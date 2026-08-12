import { describe, expect, it } from "vitest";
import { extractContactLinks, extractDomain, inferEmailPattern, normalizeUrl, parseCheckSizeRange, parseCurrencyAmount } from "../extract";

describe("normalizeUrl", () => {
  it("lowercases the hostname and strips default ports", () => {
    expect(normalizeUrl("https://Example.COM:443/Team")).toBe("https://example.com/Team");
  });

  it("strips known tracking params but keeps others", () => {
    expect(normalizeUrl("https://example.com/?utm_source=x&id=5")).toBe("https://example.com/?id=5");
  });

  it("strips the hash fragment", () => {
    expect(normalizeUrl("https://example.com/team#bio")).toBe("https://example.com/team");
  });

  it("returns null for an invalid URL", () => {
    expect(normalizeUrl("not a url")).toBeNull();
  });
});

describe("extractDomain", () => {
  it("strips a leading www.", () => {
    expect(extractDomain("https://www.example-fund.com/team")).toBe("example-fund.com");
  });

  it("returns null for an invalid URL", () => {
    expect(extractDomain("not a url")).toBeNull();
  });
});

describe("parseCurrencyAmount", () => {
  it("parses a dollar-sign amount with a magnitude word", () => {
    expect(parseCurrencyAmount("$25 million")).toEqual({ amount: 25_000_000, currency: "USD" });
  });

  it("parses an ISO code amount", () => {
    expect(parseCurrencyAmount("EUR 2.5m")).toEqual({ amount: 2_500_000, currency: "EUR" });
  });

  it("parses a comma-formatted amount with a currency symbol", () => {
    expect(parseCurrencyAmount("$5,000,000")).toEqual({ amount: 5_000_000, currency: "USD" });
  });

  it("returns null for a bare number with no currency marker", () => {
    expect(parseCurrencyAmount("the team has 5 people")).toBeNull();
  });

  it("returns null for text with no amount at all", () => {
    expect(parseCurrencyAmount("no numbers here")).toBeNull();
  });
});

describe("parseCheckSizeRange", () => {
  it("parses a 'to' range", () => {
    expect(parseCheckSizeRange("Typical investments range from $5 million to $25 million")).toEqual({ min: 5_000_000, max: 25_000_000, currency: "USD" });
  });

  it("parses a dash range", () => {
    expect(parseCheckSizeRange("$1M-$10M")).toEqual({ min: 1_000_000, max: 10_000_000, currency: "USD" });
  });

  it("parses an 'up to' single bound", () => {
    expect(parseCheckSizeRange("up to $50 million")).toEqual({ min: null, max: 50_000_000, currency: "USD" });
  });

  it("parses a 'minimum' single bound", () => {
    expect(parseCheckSizeRange("minimum $1 million")).toEqual({ min: 1_000_000, max: null, currency: "USD" });
  });

  it("returns null when nothing parses", () => {
    expect(parseCheckSizeRange("no figures mentioned")).toBeNull();
  });
});

describe("extractContactLinks", () => {
  it("extracts mailto and contact-page links, ignoring unrelated ones", () => {
    const html = `
      <a href="mailto:invest@example.com">Email us</a>
      <a href="/contact">Contact</a>
      <a href="/about">About</a>
    `;
    const result = extractContactLinks(html, "https://example.com");
    expect(result.emails).toEqual(["invest@example.com"]);
    expect(result.contactFormUrls).toEqual(["https://example.com/contact"]);
  });
});

describe("inferEmailPattern", () => {
  it("requires at least two consistent examples before inferring a pattern", () => {
    expect(
      inferEmailPattern([
        { email: "jane.doe@example.com", firstName: "Jane", lastName: "Doe" },
        { email: "john.smith@example.com", firstName: "John", lastName: "Smith" }
      ])
    ).toBe("first.last");
  });

  it("returns null with only one example", () => {
    expect(inferEmailPattern([{ email: "jane.doe@example.com", firstName: "Jane", lastName: "Doe" }])).toBeNull();
  });

  it("returns null when examples disagree on the pattern", () => {
    expect(
      inferEmailPattern([
        { email: "jane.doe@example.com", firstName: "Jane", lastName: "Doe" },
        { email: "jsmith@example.com", firstName: "John", lastName: "Smith" }
      ])
    ).toBeNull();
  });
});
