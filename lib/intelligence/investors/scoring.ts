import type { DeploymentStatus, MatchClassification } from "./types";

// Deterministic, explainable investor scoring. No LLM in this file --
// every number here is arithmetic over structured inputs the caller
// already has evidence for, and every score comes back with the component
// breakdown, penalties, and missing-evidence list that produced it. This
// is what "no unexplained LLM-generated score" (spec) means in practice.
//
// Bump SCORING_VERSION whenever the weights, penalties, or formulas below
// change -- stored match rows keep the version they were computed under so
// a UI can flag stale scores rather than silently mixing two model
// generations in one ranked list.
export const PROJECT_MATCH_SCORING_VERSION = "project-match-v1";
export const ACCREDITED_SCORING_VERSION = "accredited-individual-v1";

export interface ComponentScore {
  key: string;
  label: string;
  weight: number;
  value: number; // 0..weight
  fraction: number; // 0..1, value / weight
  missingEvidence: boolean;
  rationale: string;
}

export interface OverlapInput {
  candidateValues: string[];
  mandateValues: string[];
}

function overlap(input: OverlapInput): { fraction: number; missingEvidence: boolean; rationale: string } {
  const { candidateValues, mandateValues } = input;
  if (mandateValues.length === 0) {
    return { fraction: 0.5, missingEvidence: true, rationale: "Mandate did not specify a value for this dimension; scored neutral." };
  }
  if (candidateValues.length === 0) {
    return { fraction: 0, missingEvidence: true, rationale: "No evidence found for the candidate on this dimension." };
  }
  const normCandidate = new Set(candidateValues.map((v) => v.toLowerCase().trim()));
  const matches = mandateValues.filter((v) => normCandidate.has(v.toLowerCase().trim()));
  return {
    fraction: matches.length / mandateValues.length,
    missingEvidence: false,
    rationale: matches.length > 0 ? `Overlaps on: ${matches.join(", ")}.` : "No overlap between candidate and mandate values."
  };
}

function component(key: string, label: string, weight: number, fraction: number, missingEvidence: boolean, rationale: string): ComponentScore {
  const clamped = Math.max(0, Math.min(1, fraction));
  return { key, label, weight, value: Math.round(clamped * weight * 100) / 100, fraction: clamped, missingEvidence, rationale };
}

// ============================================================
// Investor <-> project mandate match
// ============================================================

export interface CheckSizeRange {
  min: number | null;
  max: number | null;
}

export interface ProjectMatchInputs {
  sectorOverlap: OverlapInput;
  geographyOverlap: OverlapInput;
  investorCheckSize: CheckSizeRange;
  mandateCheckSize: CheckSizeRange;
  stageOverlap: OverlapInput;
  capitalTypeOverlap: OverlapInput;
  structureOverlap: OverlapInput;
  comparableInvestmentCount: number;
  deploymentStatus: DeploymentStatus;
  impactAlignmentOverlap: OverlapInput;
  hasRelationshipAccess: boolean;
  readinessFit: number | null; // 0..1, null = not assessed
  flags: {
    explicitSectorExclusion: boolean;
    serviceProviderMisclassified: boolean;
    conflictedOrUnverifiedIdentity: boolean;
    hasDirectInvestingEvidence: boolean;
    lastVerifiedAt: string | null;
  };
}

export interface PenaltyResult {
  key: string;
  label: string;
  amount: number; // negative
  applied: boolean;
  rationale: string;
}

export interface ScoreResult {
  totalScore: number;
  classification: MatchClassification;
  componentScores: ComponentScore[];
  penalties: PenaltyResult[];
  missingEvidence: string[];
  explanation: string;
  scoringVersion: string;
}

const STALE_EVIDENCE_DAYS = 365;

function checkSizeFit(investor: CheckSizeRange, mandate: CheckSizeRange): { fraction: number; missingEvidence: boolean; materialMismatch: boolean; rationale: string } {
  if (investor.min == null && investor.max == null) {
    return { fraction: 0.5, missingEvidence: true, materialMismatch: false, rationale: "No check-size evidence for this investor." };
  }
  if (mandate.min == null && mandate.max == null) {
    return { fraction: 0.5, missingEvidence: true, materialMismatch: false, rationale: "Mandate did not specify a target check size." };
  }
  const investorLow = investor.min ?? -Infinity;
  const investorHigh = investor.max ?? Infinity;
  const mandateLow = mandate.min ?? -Infinity;
  const mandateHigh = mandate.max ?? Infinity;
  const overlapLow = Math.max(investorLow, mandateLow);
  const overlapHigh = Math.min(investorHigh, mandateHigh);

  if (overlapHigh < overlapLow) {
    return { fraction: 0, missingEvidence: false, materialMismatch: true, rationale: "Investor check-size range and mandate target range do not overlap." };
  }

  const mandateWidth = Number.isFinite(mandateHigh - mandateLow) ? mandateHigh - mandateLow : overlapHigh - overlapLow || 1;
  const overlapWidth = overlapHigh - overlapLow;
  const fraction = mandateWidth > 0 ? Math.min(1, overlapWidth / mandateWidth) : 1;
  return { fraction, missingEvidence: false, materialMismatch: false, rationale: "Investor check-size range overlaps the mandate's target range." };
}

function deploymentFraction(status: DeploymentStatus): { fraction: number; missingEvidence: boolean } {
  switch (status) {
    case "actively_deploying":
      return { fraction: 1, missingEvidence: false };
    case "selective":
      return { fraction: 0.6, missingEvidence: false };
    case "paused":
      return { fraction: 0.1, missingEvidence: false };
    default:
      return { fraction: 0, missingEvidence: true };
  }
}

export function scoreProjectMatch(inputs: ProjectMatchInputs): ScoreResult {
  const missingEvidence: string[] = [];
  const components: ComponentScore[] = [];

  const sector = overlap(inputs.sectorOverlap);
  components.push(component("sector_technology_fit", "Sector and technology fit", 20, sector.fraction, sector.missingEvidence, sector.rationale));

  const geography = overlap(inputs.geographyOverlap);
  components.push(component("geography_fit", "Geography fit", 15, geography.fraction, geography.missingEvidence, geography.rationale));

  const checkSize = checkSizeFit(inputs.investorCheckSize, inputs.mandateCheckSize);
  components.push(component("check_size_fit", "Check-size fit", 15, checkSize.fraction, checkSize.missingEvidence, checkSize.rationale));

  const stage = overlap(inputs.stageOverlap);
  components.push(component("stage_fit", "Stage fit", 10, stage.fraction, stage.missingEvidence, stage.rationale));

  const capitalType = overlap(inputs.capitalTypeOverlap);
  const structure = overlap(inputs.structureOverlap);
  const capitalStructureFraction = (capitalType.fraction + structure.fraction) / 2;
  components.push(
    component(
      "capital_type_structure_fit",
      "Capital-type and structure fit",
      10,
      capitalStructureFraction,
      capitalType.missingEvidence && structure.missingEvidence,
      `${capitalType.rationale} ${structure.rationale}`
    )
  );

  const comparableFraction = Math.min(1, inputs.comparableInvestmentCount / 3);
  components.push(
    component(
      "comparable_investment_evidence",
      "Comparable investment evidence",
      10,
      comparableFraction,
      inputs.comparableInvestmentCount === 0,
      inputs.comparableInvestmentCount > 0 ? `${inputs.comparableInvestmentCount} comparable transaction(s) found.` : "No comparable transactions found."
    )
  );

  const deployment = deploymentFraction(inputs.deploymentStatus);
  components.push(component("current_deployment_activity", "Current deployment activity", 5, deployment.fraction, deployment.missingEvidence, `Deployment status: ${inputs.deploymentStatus}.`));

  const impact = overlap(inputs.impactAlignmentOverlap);
  components.push(component("impact_mandate_alignment", "Impact or mandate alignment", 5, impact.fraction, impact.missingEvidence, impact.rationale));

  components.push(
    component(
      "relationship_access",
      "Relationship access",
      5,
      inputs.hasRelationshipAccess ? 1 : 0,
      false,
      inputs.hasRelationshipAccess ? "A relationship pathway is on record." : "No relationship pathway on record."
    )
  );

  const readinessKnown = inputs.readinessFit != null;
  components.push(
    component(
      "project_readiness",
      "Project readiness relative to investor needs",
      5,
      inputs.readinessFit ?? 0.5,
      !readinessKnown,
      readinessKnown ? "Readiness assessed against investor requirements." : "Project readiness not yet assessed against this investor's stated requirements."
    )
  );

  for (const c of components) {
    if (c.missingEvidence) missingEvidence.push(c.label);
  }

  const rawSum = components.reduce((sum, c) => sum + c.value, 0);

  const penalties: PenaltyResult[] = [
    {
      key: "no_evidence_of_direct_investing",
      label: "No evidence of direct investing",
      amount: -15,
      applied: !inputs.flags.hasDirectInvestingEvidence,
      rationale: "No source has been found showing this organization makes direct investments (as opposed to advisory or service provision)."
    },
    {
      key: "wrong_geography",
      label: "Wrong geography",
      amount: -20,
      applied: !geography.missingEvidence && geography.fraction === 0,
      rationale: "Investor's stated geographies have zero overlap with the mandate's geographies."
    },
    {
      key: "material_check_size_mismatch",
      label: "Material check-size mismatch",
      amount: -20,
      applied: checkSize.materialMismatch,
      rationale: checkSize.rationale
    },
    {
      key: "not_currently_deploying",
      label: "Not currently deploying",
      amount: -25,
      applied: inputs.deploymentStatus === "paused",
      rationale: "Evidence indicates this investor is not currently deploying capital."
    },
    {
      key: "explicit_sector_exclusion",
      label: "Explicit sector exclusion",
      amount: -40,
      applied: inputs.flags.explicitSectorExclusion,
      rationale: "Investor's own stated exclusions rule out this mandate's sector."
    },
    {
      key: "service_provider_misclassified_as_investor",
      label: "Service provider misclassified as investor",
      amount: -30,
      applied: inputs.flags.serviceProviderMisclassified,
      rationale: "This record shows signs of being an adviser/consultant/broker rather than a capital provider."
    },
    {
      key: "stale_evidence",
      label: "Stale evidence",
      amount: -10,
      applied: isStale(inputs.flags.lastVerifiedAt),
      rationale: `Evidence has not been verified within the last ${STALE_EVIDENCE_DAYS} days.`
    },
    {
      key: "conflicted_or_unverified_identity",
      label: "Conflicted or unverified identity",
      amount: -20,
      applied: inputs.flags.conflictedOrUnverifiedIdentity,
      rationale: "Entity resolution has an unresolved conflict or low-confidence identity for this record."
    }
  ];

  const penaltyTotal = penalties.filter((p) => p.applied).reduce((sum, p) => sum + p.amount, 0);
  const totalScore = Math.max(0, Math.round((rawSum + penaltyTotal) * 100) / 100);
  const hardExclusion = penalties.find((p) => p.key === "explicit_sector_exclusion")?.applied ?? false;
  const classification = classify(totalScore, hardExclusion);

  return {
    totalScore,
    classification,
    componentScores: components,
    penalties,
    missingEvidence,
    explanation: buildExplanation(components, penalties, totalScore, classification),
    scoringVersion: PROJECT_MATCH_SCORING_VERSION
  };
}

function isStale(lastVerifiedAt: string | null): boolean {
  if (!lastVerifiedAt) return true;
  const verified = new Date(lastVerifiedAt).getTime();
  if (Number.isNaN(verified)) return true;
  const ageDays = (Date.now() - verified) / (1000 * 60 * 60 * 24);
  return ageDays > STALE_EVIDENCE_DAYS;
}

function classify(totalScore: number, hardExclusion: boolean): MatchClassification {
  if (hardExclusion) return "hard_exclusion";
  if (totalScore >= 80) return "immediate_target";
  if (totalScore >= 65) return "qualified_research_target";
  if (totalScore >= 50) return "monitor_or_relationship_path";
  return "archive_low_priority";
}

function buildExplanation(components: ComponentScore[], penalties: PenaltyResult[], totalScore: number, classification: MatchClassification): string {
  const topComponents = [...components]
    .sort((a, b) => b.value - a.value)
    .slice(0, 3)
    .map((c) => `${c.label} (${c.value}/${c.weight})`);
  const appliedPenalties = penalties.filter((p) => p.applied).map((p) => `${p.label} (${p.amount})`);
  const parts = [`Score ${totalScore} -> ${classification}.`, `Strongest components: ${topComponents.join(", ")}.`];
  if (appliedPenalties.length > 0) parts.push(`Penalties applied: ${appliedPenalties.join(", ")}.`);
  return parts.join(" ");
}

// ============================================================
// Accredited-individual match
// ============================================================

export interface AccreditedIndividualInputs {
  priorPrivateInvestingEvidenceCount: number;
  sectorOverlap: OverlapInput;
  estimatedCheckSizeFit: number | null; // 0..1, explicitly an estimate -- never proof of wealth or accreditation
  geographicRelationship: boolean;
  operatingExperience: boolean;
  documentedLiquidityEvent: boolean;
  warmAccessPathway: boolean;
  currentInvestmentActivityRecent: boolean;
  strategicValueBeyondCapital: boolean;
}

export function scoreAccreditedIndividual(inputs: AccreditedIndividualInputs): ScoreResult {
  const components: ComponentScore[] = [];

  const priorInvestingFraction = Math.min(1, inputs.priorPrivateInvestingEvidenceCount / 3);
  components.push(
    component(
      "prior_private_investing_evidence",
      "Evidence of prior private investing",
      20,
      priorInvestingFraction,
      inputs.priorPrivateInvestingEvidenceCount === 0,
      inputs.priorPrivateInvestingEvidenceCount > 0 ? `${inputs.priorPrivateInvestingEvidenceCount} prior investment(s) on record.` : "No prior private investments found."
    )
  );

  const sector = overlap(inputs.sectorOverlap);
  components.push(component("sector_alignment", "Sector alignment", 15, sector.fraction, sector.missingEvidence, sector.rationale));

  const checkSizeKnown = inputs.estimatedCheckSizeFit != null;
  components.push(
    component(
      "estimated_check_size_fit",
      "Estimated check-size fit (based on investment evidence, not net worth)",
      15,
      inputs.estimatedCheckSizeFit ?? 0.5,
      !checkSizeKnown,
      checkSizeKnown ? "Estimated from observed past investment sizes." : "No investment-size evidence to estimate from."
    )
  );

  components.push(component("geographic_relationship", "Geographic relationship", 10, inputs.geographicRelationship ? 1 : 0, false, inputs.geographicRelationship ? "Documented geographic tie to the mandate." : "No documented geographic tie."));

  components.push(component("operating_experience", "Operating experience", 10, inputs.operatingExperience ? 1 : 0, false, inputs.operatingExperience ? "Relevant operating experience on record." : "No relevant operating experience found."));

  components.push(
    component(
      "documented_liquidity_event",
      "Publicly documented liquidity event",
      10,
      inputs.documentedLiquidityEvent ? 1 : 0,
      false,
      inputs.documentedLiquidityEvent ? "A public liquidity event is documented." : "No documented liquidity event."
    )
  );

  components.push(component("warm_access_pathway", "Warm-access pathway", 10, inputs.warmAccessPathway ? 1 : 0, false, inputs.warmAccessPathway ? "A relationship pathway is on record." : "No relationship pathway on record."));

  components.push(
    component(
      "current_investment_activity",
      "Current investment activity",
      5,
      inputs.currentInvestmentActivityRecent ? 1 : 0,
      false,
      inputs.currentInvestmentActivityRecent ? "Recent investment activity found." : "No recent investment activity found."
    )
  );

  components.push(
    component(
      "strategic_value_beyond_capital",
      "Strategic value beyond capital",
      5,
      inputs.strategicValueBeyondCapital ? 1 : 0,
      false,
      inputs.strategicValueBeyondCapital ? "Documented strategic value beyond capital (expertise, network, offtake)." : "No documented strategic value beyond capital."
    )
  );

  const missingEvidence = components.filter((c) => c.missingEvidence).map((c) => c.label);
  const totalScore = Math.max(0, Math.round(components.reduce((sum, c) => sum + c.value, 0) * 100) / 100);
  const classification = classify(totalScore, false);

  return {
    totalScore,
    classification,
    componentScores: components,
    penalties: [],
    missingEvidence,
    explanation: buildExplanation(components, [], totalScore, classification),
    scoringVersion: ACCREDITED_SCORING_VERSION
  };
}
