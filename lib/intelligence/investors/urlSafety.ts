import { lookup } from "dns/promises";
import { isIP } from "net";

// SSRF guard shared by every investor-domain fetch entry point (manual URL
// fetch, Jina Reader, and any future provider). Applied in addition to --

// not instead of -- the existing generic collector's own fetch, which only
// ever fetches operator-curated intel_sources rows, not user-supplied URLs.
// This guard exists specifically because the investor module lets a signed-
// in staff member submit an arbitrary URL through the UI.

const BLOCKED_HOSTNAMES = new Set(["localhost", "0.0.0.0", "metadata.google.internal"]);

function isPrivateIPv4(ip: string): boolean {
  const parts = ip.split(".").map(Number);
  if (parts.length !== 4 || parts.some((p) => Number.isNaN(p))) return false;
  const [a, b] = parts;
  if (a === 10) return true;
  if (a === 172 && b >= 16 && b <= 31) return true;
  if (a === 192 && b === 168) return true;
  if (a === 127) return true;
  if (a === 169 && b === 254) return true; // link-local, also covers cloud metadata (169.254.169.254)
  return false;
}

function isPrivateIPv6(ip: string): boolean {
  const lower = ip.toLowerCase();
  return lower === "::1" || lower.startsWith("fe80:") || lower.startsWith("fc") || lower.startsWith("fd");
}

export class UnsafeUrlError extends Error {}

// Throws UnsafeUrlError if the URL is not safe to fetch server-side.
// Checks: scheme, blocked hostnames, IP literals, and (for hostnames) the
// resolved address -- a hostname that resolves to a private/loopback/
// link-local address is rejected even if the hostname itself looks public,
// which is what stops DNS-rebinding-style access to internal services.
export async function assertSafeUrl(rawUrl: string): Promise<URL> {
  let url: URL;
  try {
    url = new URL(rawUrl);
  } catch {
    throw new UnsafeUrlError("Not a valid URL.");
  }

  if (url.protocol !== "http:" && url.protocol !== "https:") {
    throw new UnsafeUrlError(`Unsupported scheme: ${url.protocol}`);
  }

  const hostname = url.hostname.toLowerCase();
  if (BLOCKED_HOSTNAMES.has(hostname)) {
    throw new UnsafeUrlError(`Blocked hostname: ${hostname}`);
  }

  const ipVersion = isIP(hostname);
  if (ipVersion === 4 && isPrivateIPv4(hostname)) {
    throw new UnsafeUrlError(`Blocked private IPv4 address: ${hostname}`);
  }
  if (ipVersion === 6 && isPrivateIPv6(hostname)) {
    throw new UnsafeUrlError(`Blocked private IPv6 address: ${hostname}`);
  }

  if (!ipVersion) {
    try {
      const { address, family } = await lookup(hostname);
      if (family === 4 && isPrivateIPv4(address)) {
        throw new UnsafeUrlError(`${hostname} resolves to a private address (${address}).`);
      }
      if (family === 6 && isPrivateIPv6(address)) {
        throw new UnsafeUrlError(`${hostname} resolves to a private address (${address}).`);
      }
    } catch (err) {
      if (err instanceof UnsafeUrlError) throw err;
      throw new UnsafeUrlError(`Could not resolve hostname: ${hostname}`);
    }
  }

  return url;
}

export const MAX_RESPONSE_BYTES = 5_000_000;
export const FETCH_TIMEOUT_MS = 20_000;
