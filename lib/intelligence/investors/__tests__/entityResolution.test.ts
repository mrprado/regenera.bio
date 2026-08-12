import { describe, expect, it } from "vitest";
import { normalizeOrgName, normalizePersonName, suggestOrganizationMerge, suggestPersonMerge } from "../entityResolution";

describe("normalizeOrgName", () => {
  it("strips common legal suffixes and punctuation", () => {
    expect(normalizeOrgName("Example Infrastructure Partners, LLC")).toBe("example infrastructure");
  });
});

describe("normalizePersonName", () => {
  it("lowercases and strips punctuation but keeps hyphens/apostrophes", () => {
    expect(normalizePersonName("Mary-Jane O'Brien")).toBe("mary-jane o'brien");
  });
});

describe("suggestOrganizationMerge", () => {
  it("recommends likely_duplicate when canonical domains match", () => {
    const result = suggestOrganizationMerge(
      { name: "Example Fund", canonicalDomain: "examplefund.com" },
      { name: "Example Fund LLC", canonicalDomain: "examplefund.com" }
    );
    expect(result.recommendation).toBe("likely_duplicate");
    expect(result.confidence).toBeGreaterThan(0.7);
  });

  it("never returns likely_duplicate purely from a normalized-name match with no domain or LinkedIn signal", () => {
    const result = suggestOrganizationMerge({ name: "Meridian Partners" }, { name: "Meridian Partners" });
    expect(result.recommendation).not.toBe("likely_duplicate");
  });

  it("recommends likely_distinct when every comparable signal conflicts", () => {
    const result = suggestOrganizationMerge(
      { name: "Alpha Capital", canonicalDomain: "alpha.com", headquarters: "New York" },
      { name: "Beta Ventures", canonicalDomain: "beta.com", headquarters: "London" }
    );
    expect(result.recommendation).toBe("likely_distinct");
    expect(result.confidence).toBeLessThan(0.4);
  });

  it("treats a former-name match as supporting evidence", () => {
    const result = suggestOrganizationMerge({ name: "Regen Capital", formerNames: ["Old Growth Partners"] }, { name: "Old Growth Partners" });
    expect(result.supportingSignals.some((s) => s.key === "former_name")).toBe(true);
  });
});

describe("suggestPersonMerge", () => {
  it("recommends likely_duplicate when LinkedIn URLs match", () => {
    const result = suggestPersonMerge({ fullName: "Jane Doe", linkedinUrl: "https://linkedin.com/in/janedoe" }, { fullName: "Jane R. Doe", linkedinUrl: "https://www.linkedin.com/in/janedoe/" });
    expect(result.recommendation).toBe("likely_duplicate");
  });

  it("does not merge two different people who happen to share a name", () => {
    const result = suggestPersonMerge({ fullName: "John Smith", currentEmployerEntityId: "org-a" }, { fullName: "John Smith", currentEmployerEntityId: "org-b" });
    expect(result.recommendation).not.toBe("likely_duplicate");
  });
});
