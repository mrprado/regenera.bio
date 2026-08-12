import * as cheerio from "cheerio";

// Deterministic parsers for the investor domain, run before any LLM
// escalation (same "deterministic first" order as
// lib/intelligence/extract/deterministic/*). Each function here is pure
// and has no network/DB access, which is what makes it unit-testable
// without a live Supabase project.

// ------------------------------------------------------------------
// URL / domain normalization
// ------------------------------------------------------------------

const TRACKING_PARAM_PREFIXES = ["utm_", "gclid", "fbclid", "mc_cid", "mc_eid"];

export function normalizeUrl(rawUrl: string): string | null {
  let url: URL;
  try {
    url = new URL(rawUrl);
  } catch {
    return null;
  }

  url.hostname = url.hostname.toLowerCase();
  if ((url.protocol === "http:" && url.port === "80") || (url.protocol === "https:" && url.port === "443")) {
    url.port = "";
  }

  const params = Array.from(url.searchParams.keys());
  for (const key of params) {
    if (TRACKING_PARAM_PREFIXES.some((prefix) => key.toLowerCase().startsWith(prefix))) {
      url.searchParams.delete(key);
    }
  }

  url.hash = "";
  let normalized = url.toString();
  if (normalized.endsWith("/") && url.pathname === "/") {
    normalized = normalized.slice(0, -1);
  }
  return normalized;
}

export function extractDomain(rawUrl: string): string | null {
  try {
    const url = new URL(rawUrl);
    return url.hostname.toLowerCase().replace(/^www\./, "");
  } catch {
    return null;
  }
}

// ------------------------------------------------------------------
// Currency / check-size parsing
// ------------------------------------------------------------------

const CURRENCY_SYMBOLS: Record<string, string> = { "$": "USD", "€": "EUR", "£": "GBP", "¥": "JPY" };
const MAGNITUDE: Record<string, number> = { k: 1_000, thousand: 1_000, m: 1_000_000, mm: 1_000_000, million: 1_000_000, b: 1_000_000_000, bn: 1_000_000_000, billion: 1_000_000_000 };

export interface ParsedAmount {
  amount: number;
  currency: string;
}

// Parses a single monetary amount out of free text, e.g. "$25 million",
// "USD 5,000,000", "EUR 2.5m", "up to $50M". Returns null when nothing
// matched -- callers must treat that as "no evidence", never assume a
// default amount.
export function parseCurrencyAmount(text: string): ParsedAmount | null {
  const pattern = /(?:(USD|EUR|GBP|JPY)\s*)?([$€£¥])?\s*([\d,]+(?:\.\d+)?)\s*(thousand|million|billion|k|mm|m|bn|b)?\b/i;
  const match = text.match(pattern);
  if (!match) return null;

  const [, isoCode, symbol, numberText, magnitudeText] = match;
  const number = Number(numberText.replace(/,/g, ""));
  if (!Number.isFinite(number) || number === 0) return null;

  const magnitude = magnitudeText ? MAGNITUDE[magnitudeText.toLowerCase()] ?? 1 : 1;
  const currency = isoCode?.toUpperCase() ?? (symbol ? CURRENCY_SYMBOLS[symbol] : undefined) ?? "USD";

  // Reject bare small integers with no currency marker at all -- "5" in
  // running text is not evidence of a $5 check size, it's noise.
  if (!isoCode && !symbol && !magnitudeText) return null;

  return { amount: number * magnitude, currency };
}

export interface ParsedCheckSizeRange {
  min: number | null;
  max: number | null;
  currency: string;
}

// Parses a range like "$5 million to $25 million", "$1M-$10M", or a single
// bound like "up to $25 million" / "minimum $1 million".
export function parseCheckSizeRange(text: string): ParsedCheckSizeRange | null {
  const rangeMatch = text.match(/([$€£¥]?\s*[\d,.]+\s*(?:thousand|million|billion|k|mm|m|bn|b)?)\s*(?:-|to|–|—)\s*([$€£¥]?\s*[\d,.]+\s*(?:thousand|million|billion|k|mm|m|bn|b)?)/i);
  if (rangeMatch) {
    const low = parseCurrencyAmount(rangeMatch[1]);
    const high = parseCurrencyAmount(rangeMatch[2]);
    if (low && high) {
      return { min: Math.min(low.amount, high.amount), max: Math.max(low.amount, high.amount), currency: high.currency };
    }
  }

  const upToMatch = text.match(/up to\s+(.+)/i);
  if (upToMatch) {
    const parsed = parseCurrencyAmount(upToMatch[1]);
    if (parsed) return { min: null, max: parsed.amount, currency: parsed.currency };
  }

  const minimumMatch = text.match(/(?:minimum|at least|from)\s+(.+)/i);
  if (minimumMatch) {
    const parsed = parseCurrencyAmount(minimumMatch[1]);
    if (parsed) return { min: parsed.amount, max: null, currency: parsed.currency };
  }

  const single = parseCurrencyAmount(text);
  if (single) return { min: single.amount, max: single.amount, currency: single.currency };

  return null;
}

// ------------------------------------------------------------------
// Contact-link extraction (public professional routes only)
// ------------------------------------------------------------------

export interface ExtractedContactLinks {
  emails: string[];
  contactFormUrls: string[];
}

const CONTACT_PATH_RE = /contact|get-in-touch|reach-us|connect/i;

export function extractContactLinks(html: string, baseUrl?: string): ExtractedContactLinks {
  const $ = cheerio.load(html);
  const emails = new Set<string>();
  const contactFormUrls = new Set<string>();

  $("a[href]").each((_, el) => {
    const href = $(el).attr("href")?.trim();
    if (!href) return;

    if (href.toLowerCase().startsWith("mailto:")) {
      const email = href.slice("mailto:".length).split("?")[0].trim();
      if (email.includes("@")) emails.add(email.toLowerCase());
      return;
    }

    if (CONTACT_PATH_RE.test(href)) {
      try {
        const resolved = baseUrl ? new URL(href, baseUrl).toString() : href;
        contactFormUrls.add(resolved);
      } catch {
        // Unresolvable relative URL without a base -- skip rather than guess.
      }
    }
  });

  return { emails: Array.from(emails), contactFormUrls: Array.from(contactFormUrls) };
}

// ------------------------------------------------------------------
// Email-pattern inference (organization-wide pattern, never per-person guessing)
// ------------------------------------------------------------------

export type EmailPattern = "first.last" | "firstlast" | "first" | "flast" | "first_last" | "unknown";

function localPart(email: string): string {
  return email.split("@")[0].toLowerCase();
}

function detectPattern(localPartValue: string, firstName: string, lastName: string): EmailPattern | null {
  const f = firstName.toLowerCase();
  const l = lastName.toLowerCase();
  if (localPartValue === `${f}.${l}`) return "first.last";
  if (localPartValue === `${f}${l}`) return "firstlast";
  if (localPartValue === `${f}_${l}`) return "first_last";
  if (localPartValue === `${f[0]}${l}`) return "flast";
  if (localPartValue === f) return "first";
  return null;
}

// Per spec: organizational email-pattern inference is only permitted when
// the domain is verified AND at least two public examples support the
// same pattern, and the result must be labeled `inferred`, never
// `verified`. This function only ever returns a pattern string or null --
// callers are responsible for setting email_pattern_status = 'inferred'
// and never upgrading it to 'verified' from this alone.
export function inferEmailPattern(examples: { email: string; firstName: string; lastName: string }[]): EmailPattern | null {
  const detected = examples.map((e) => detectPattern(localPart(e.email), e.firstName, e.lastName)).filter((p): p is EmailPattern => p !== null);
  if (detected.length < 2) return null;
  const [first, ...rest] = detected;
  return rest.every((p) => p === first) ? first : null;
}
