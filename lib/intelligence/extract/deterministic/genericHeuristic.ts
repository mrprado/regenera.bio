import type { ExtractionResult } from "../types";

// Fallback for any source without a schema-specific adapter: plain-text
// pattern matching for monetary figures and capacity figures. Deliberately
// does NOT attempt to extract organization/person names from free text --
// a regex-based "sequence of capitalized words" heuristic on arbitrary HTML
// produces mostly false positives (nav labels, headings, boilerplate), and
// a wrong entity in the knowledge graph is worse than a missing one. This
// adapter only claims what it can find with real precision; everything
// else is left for LLM escalation, which is the point of it existing.

const MONEY_RE = /\b(?:USD|EUR|GBP|\$|€|£)\s?[\d,.]+\s?(?:million|billion|bn|mn|m|b)\b/gi;
const CAPACITY_RE = /\b[\d,.]+\s?(?:MW|GW|MWp|GWp|kWp)\b/gi;

export function canHandle(): boolean {
  return true; // last-resort fallback, always applicable
}

export function extract(text: string, sourceLabel: string): ExtractionResult {
  const money = Array.from(new Set((text.match(MONEY_RE) ?? []).map((m) => m.trim())));
  const capacity = Array.from(new Set((text.match(CAPACITY_RE) ?? []).map((m) => m.trim())));

  const claims = [
    ...money.map((m) => ({ claimText: `${sourceLabel} mentions a monetary figure: "${m}" (unverified context, needs review).`, confidence: 0.3 })),
    ...capacity.map((c) => ({ claimText: `${sourceLabel} mentions a capacity figure: "${c}" (unverified context, needs review).`, confidence: 0.3 }))
  ];

  // Confidence reflects how much of the document this adapter can actually
  // account for -- it finds isolated figures, not who/what/why, so it is
  // always low unless there's simply nothing extractable to miss.
  const confidence = claims.length > 0 ? 0.3 : 0.5;

  return { entities: [], relationships: [], claims, confidence, extractedBy: "deterministic:generic-heuristic" };
}
