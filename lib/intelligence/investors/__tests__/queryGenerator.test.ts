import { describe, expect, it } from "vitest";
import { generateDiscoveryQueries, type MandateQueryInput } from "../queryGenerator";
import { QUERY_FAMILIES } from "../types";

const mandate: MandateQueryInput = {
  name: "Test mandate",
  sectors: ["waste-to-energy"],
  geographies: ["Mexico"],
  projectStage: "operating",
  capitalTypes: ["equity"],
  investmentStructures: ["direct"],
  impactThemes: ["circular economy"],
  regenerativeFunctions: ["soil function"]
};

describe("generateDiscoveryQueries", () => {
  it("produces queries in every one of the seven query families", () => {
    const queries = generateDiscoveryQueries(mandate);
    const families = new Set(queries.map((q) => q.queryFamily));
    for (const family of QUERY_FAMILIES) {
      expect(families.has(family)).toBe(true);
    }
  });

  it("has no duplicate query text", () => {
    const queries = generateDiscoveryQueries(mandate);
    const texts = queries.map((q) => q.queryText.toLowerCase());
    expect(new Set(texts).size).toBe(texts.length);
  });

  it("respects maxPerFamily", () => {
    const queries = generateDiscoveryQueries(mandate, { maxPerFamily: 2 });
    const counts = new Map<string, number>();
    for (const q of queries) counts.set(q.queryFamily, (counts.get(q.queryFamily) ?? 0) + 1);
    for (const count of counts.values()) {
      expect(count).toBeLessThanOrEqual(2);
    }
  });

  it("restricts organization-level families to the requested universes", () => {
    const queries = generateDiscoveryQueries(mandate, { universes: ["family_office"] });
    const mandateQueries = queries.filter((q) => q.queryFamily === "mandate");
    expect(mandateQueries.every((q) => q.investorUniverse === "family_office")).toBe(true);
  });

  it("still produces sensible queries with no sectors or geographies specified", () => {
    const queries = generateDiscoveryQueries({ ...mandate, sectors: [], geographies: [] });
    expect(queries.length).toBeGreaterThan(0);
  });
});
