import { describe, expect, it } from "vitest";
import { scoreAccreditedIndividual, scoreProjectMatch, type AccreditedIndividualInputs, type ProjectMatchInputs } from "../scoring";

function baseInputs(overrides: Partial<ProjectMatchInputs> = {}): ProjectMatchInputs {
  return {
    sectorOverlap: { candidateValues: ["energy"], mandateValues: ["energy"] },
    geographyOverlap: { candidateValues: ["Mexico"], mandateValues: ["Mexico"] },
    investorCheckSize: { min: 1_000_000, max: 10_000_000 },
    mandateCheckSize: { min: 2_000_000, max: 5_000_000 },
    stageOverlap: { candidateValues: ["operating"], mandateValues: ["operating"] },
    capitalTypeOverlap: { candidateValues: ["equity"], mandateValues: ["equity"] },
    structureOverlap: { candidateValues: ["direct"], mandateValues: ["direct"] },
    comparableInvestmentCount: 3,
    deploymentStatus: "actively_deploying",
    impactAlignmentOverlap: { candidateValues: ["climate"], mandateValues: ["climate"] },
    hasRelationshipAccess: true,
    readinessFit: 1,
    flags: {
      explicitSectorExclusion: false,
      serviceProviderMisclassified: false,
      conflictedOrUnverifiedIdentity: false,
      hasDirectInvestingEvidence: true,
      lastVerifiedAt: new Date().toISOString()
    },
    ...overrides
  };
}

describe("scoreProjectMatch", () => {
  it("scores a fully-aligned investor near the top of the immediate_target band", () => {
    const result = scoreProjectMatch(baseInputs());
    expect(result.totalScore).toBeGreaterThanOrEqual(80);
    expect(result.classification).toBe("immediate_target");
    expect(result.missingEvidence).toEqual([]);
  });

  it("applies the explicit_sector_exclusion penalty and forces hard_exclusion regardless of score", () => {
    const result = scoreProjectMatch(
      baseInputs({
        flags: {
          explicitSectorExclusion: true,
          serviceProviderMisclassified: false,
          conflictedOrUnverifiedIdentity: false,
          hasDirectInvestingEvidence: true,
          lastVerifiedAt: new Date().toISOString()
        }
      })
    );
    expect(result.classification).toBe("hard_exclusion");
    expect(result.penalties.find((p) => p.key === "explicit_sector_exclusion")?.applied).toBe(true);
  });

  it("applies wrong_geography when there is zero geography overlap with known values on both sides", () => {
    const result = scoreProjectMatch(baseInputs({ geographyOverlap: { candidateValues: ["Kenya"], mandateValues: ["Mexico"] } }));
    expect(result.penalties.find((p) => p.key === "wrong_geography")?.applied).toBe(true);
  });

  it("does not apply wrong_geography when the mandate has no geography evidence (missing, not wrong)", () => {
    const result = scoreProjectMatch(baseInputs({ geographyOverlap: { candidateValues: ["Kenya"], mandateValues: [] } }));
    expect(result.penalties.find((p) => p.key === "wrong_geography")?.applied).toBe(false);
    expect(result.missingEvidence).toContain("Geography fit");
  });

  it("applies material_check_size_mismatch when investor and mandate ranges do not overlap", () => {
    const result = scoreProjectMatch(baseInputs({ investorCheckSize: { min: 100_000, max: 500_000 }, mandateCheckSize: { min: 5_000_000, max: 10_000_000 } }));
    expect(result.penalties.find((p) => p.key === "material_check_size_mismatch")?.applied).toBe(true);
  });

  it("applies not_currently_deploying only when status is paused", () => {
    const paused = scoreProjectMatch(baseInputs({ deploymentStatus: "paused" }));
    expect(paused.penalties.find((p) => p.key === "not_currently_deploying")?.applied).toBe(true);

    const selective = scoreProjectMatch(baseInputs({ deploymentStatus: "selective" }));
    expect(selective.penalties.find((p) => p.key === "not_currently_deploying")?.applied).toBe(false);
  });

  it("applies stale_evidence when last verified more than a year ago", () => {
    const staleDate = new Date();
    staleDate.setFullYear(staleDate.getFullYear() - 2);
    const result = scoreProjectMatch(baseInputs({ flags: { ...baseInputs().flags, lastVerifiedAt: staleDate.toISOString() } }));
    expect(result.penalties.find((p) => p.key === "stale_evidence")?.applied).toBe(true);
  });

  it("applies no_evidence_of_direct_investing when hasDirectInvestingEvidence is false", () => {
    const result = scoreProjectMatch(baseInputs({ flags: { ...baseInputs().flags, hasDirectInvestingEvidence: false } }));
    expect(result.penalties.find((p) => p.key === "no_evidence_of_direct_investing")?.applied).toBe(true);
  });

  it("never returns a negative total score", () => {
    const result = scoreProjectMatch(
      baseInputs({
        sectorOverlap: { candidateValues: [], mandateValues: ["energy"] },
        geographyOverlap: { candidateValues: [], mandateValues: ["Mexico"] },
        deploymentStatus: "paused",
        flags: {
          explicitSectorExclusion: false,
          serviceProviderMisclassified: true,
          conflictedOrUnverifiedIdentity: true,
          hasDirectInvestingEvidence: false,
          lastVerifiedAt: null
        }
      })
    );
    expect(result.totalScore).toBeGreaterThanOrEqual(0);
    expect(result.classification).toBe("archive_low_priority");
  });

  it("component weights sum to 100", () => {
    const result = scoreProjectMatch(baseInputs());
    const totalWeight = result.componentScores.reduce((sum, c) => sum + c.weight, 0);
    expect(totalWeight).toBe(100);
  });
});

function baseAccreditedInputs(overrides: Partial<AccreditedIndividualInputs> = {}): AccreditedIndividualInputs {
  return {
    priorPrivateInvestingEvidenceCount: 3,
    sectorOverlap: { candidateValues: ["energy"], mandateValues: ["energy"] },
    estimatedCheckSizeFit: 0.8,
    geographicRelationship: true,
    operatingExperience: true,
    documentedLiquidityEvent: true,
    warmAccessPathway: true,
    currentInvestmentActivityRecent: true,
    strategicValueBeyondCapital: true,
    ...overrides
  };
}

describe("scoreAccreditedIndividual", () => {
  it("scores a fully-documented candidate near the top", () => {
    const result = scoreAccreditedIndividual(baseAccreditedInputs());
    expect(result.totalScore).toBeGreaterThanOrEqual(80);
  });

  it("flags missing evidence when there is no prior investing evidence", () => {
    const result = scoreAccreditedIndividual(baseAccreditedInputs({ priorPrivateInvestingEvidenceCount: 0 }));
    expect(result.missingEvidence).toContain("Evidence of prior private investing");
  });

  it("never claims accreditation -- scoring never touches accreditation_status", () => {
    const result = scoreAccreditedIndividual(baseAccreditedInputs());
    expect(result).not.toHaveProperty("accreditationStatus");
  });

  it("component weights sum to 100", () => {
    const result = scoreAccreditedIndividual(baseAccreditedInputs());
    const totalWeight = result.componentScores.reduce((sum, c) => sum + c.weight, 0);
    expect(totalWeight).toBe(100);
  });
});
