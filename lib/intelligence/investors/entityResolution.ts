// Deterministic-first entity resolution. Produces a suggested-merge
// recommendation with an explicit confidence, supporting signals, and
// conflicting signals -- it never merges anything itself. Per spec:
// "Never automatically merge low-confidence records." The caller (a
// review-queue action) is what actually merges, only on human approval.

const LEGAL_SUFFIXES = /\b(inc|incorporated|llc|l\.l\.c|ltd|limited|corp|corporation|co|company|lp|l\.p|llp|l\.l\.p|gmbh|plc|sa|nv|ag|fund|partners|capital|group|holdings)\b\.?/gi;

export function normalizeOrgName(name: string): string {
  return name
    .toLowerCase()
    .replace(LEGAL_SUFFIXES, "")
    .replace(/[^a-z0-9\s]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function normalizePersonName(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z\s'-]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export interface MergeSignal {
  key: string;
  matched: boolean;
  weight: number;
  detail: string;
}

export interface MergeSuggestion {
  confidence: number; // 0..1
  supportingSignals: MergeSignal[];
  conflictingSignals: MergeSignal[];
  recommendation: "likely_duplicate" | "possible_duplicate" | "likely_distinct";
}

function summarize(signals: MergeSignal[]): MergeSuggestion {
  const applicable = signals.filter((s) => s.detail !== "not_comparable");
  const supporting = applicable.filter((s) => s.matched);
  const conflicting = applicable.filter((s) => !s.matched);
  const totalWeight = applicable.reduce((sum, s) => sum + s.weight, 0);
  const matchedWeight = supporting.reduce((sum, s) => sum + s.weight, 0);
  const confidence = totalWeight > 0 ? matchedWeight / totalWeight : 0;

  // A matched canonical-domain or LinkedIn-URL signal is treated as a
  // near-unique identifier: a real match there outweighs conflicting soft
  // signals (a nickname vs. a formal name, a stale headquarters field), so
  // it recommends likely_duplicate on its own rather than being averaged
  // down by everything else. Conflicting signals still surface in
  // conflictingSignals for the human reviewer either way -- this only
  // decides the recommendation label, never merges anything itself.
  let recommendation: MergeSuggestion["recommendation"] = "likely_distinct";
  if (supporting.some((s) => s.key === "canonical_domain" || s.key === "linkedin_url")) {
    recommendation = "likely_duplicate";
  } else if (confidence >= 0.4) {
    recommendation = "possible_duplicate";
  }

  return { confidence: Math.round(confidence * 100) / 100, supportingSignals: supporting, conflictingSignals: conflicting, recommendation };
}

export interface OrganizationResolutionInput {
  name: string;
  legalName?: string | null;
  canonicalDomain?: string | null;
  formerNames?: string[];
  headquarters?: string | null;
  parentEntityId?: string | null;
  linkedinUrl?: string | null;
}

// Weights reflect the spec's own signal ordering (canonical domain first,
// then legal name, normalized name, former name, headquarters, parent
// organization, LinkedIn company URL). Regulatory identifier is omitted
// here since this repo does not yet collect one for organizations.
export function suggestOrganizationMerge(a: OrganizationResolutionInput, b: OrganizationResolutionInput): MergeSuggestion {
  const signals: MergeSignal[] = [];

  if (a.canonicalDomain && b.canonicalDomain) {
    signals.push({ key: "canonical_domain", weight: 35, matched: a.canonicalDomain.toLowerCase() === b.canonicalDomain.toLowerCase(), detail: `${a.canonicalDomain} vs ${b.canonicalDomain}` });
  }

  if (a.legalName && b.legalName) {
    signals.push({ key: "legal_name", weight: 20, matched: normalizeOrgName(a.legalName) === normalizeOrgName(b.legalName), detail: `${a.legalName} vs ${b.legalName}` });
  }

  signals.push({ key: "normalized_name", weight: 20, matched: normalizeOrgName(a.name) === normalizeOrgName(b.name), detail: `${a.name} vs ${b.name}` });

  const aFormerNames = (a.formerNames ?? []).map(normalizeOrgName);
  const bNameNorm = normalizeOrgName(b.name);
  const bFormerNames = (b.formerNames ?? []).map(normalizeOrgName);
  const aNameNorm = normalizeOrgName(a.name);
  const formerNameMatch = aFormerNames.includes(bNameNorm) || bFormerNames.includes(aNameNorm);
  if (aFormerNames.length > 0 || bFormerNames.length > 0) {
    signals.push({ key: "former_name", weight: 15, matched: formerNameMatch, detail: formerNameMatch ? "One entity's former name matches the other's current name." : "No former-name overlap." });
  }

  if (a.headquarters && b.headquarters) {
    signals.push({ key: "headquarters", weight: 10, matched: a.headquarters.toLowerCase().trim() === b.headquarters.toLowerCase().trim(), detail: `${a.headquarters} vs ${b.headquarters}` });
  }

  if (a.parentEntityId && b.parentEntityId) {
    signals.push({ key: "parent_organization", weight: 10, matched: a.parentEntityId === b.parentEntityId, detail: "Same parent organization on record." });
  }

  if (a.linkedinUrl && b.linkedinUrl) {
    signals.push({ key: "linkedin_url", weight: 30, matched: normalizeUrlLoose(a.linkedinUrl) === normalizeUrlLoose(b.linkedinUrl), detail: `${a.linkedinUrl} vs ${b.linkedinUrl}` });
  }

  return summarize(signals);
}

export interface PersonResolutionInput {
  fullName: string;
  currentEmployerEntityId?: string | null;
  currentTitle?: string | null;
  linkedinUrl?: string | null;
  professionalLocation?: string | null;
}

export function suggestPersonMerge(a: PersonResolutionInput, b: PersonResolutionInput): MergeSuggestion {
  const signals: MergeSignal[] = [];

  signals.push({ key: "normalized_name", weight: 25, matched: normalizePersonName(a.fullName) === normalizePersonName(b.fullName), detail: `${a.fullName} vs ${b.fullName}` });

  if (a.linkedinUrl && b.linkedinUrl) {
    signals.push({ key: "linkedin_url", weight: 40, matched: normalizeUrlLoose(a.linkedinUrl) === normalizeUrlLoose(b.linkedinUrl), detail: `${a.linkedinUrl} vs ${b.linkedinUrl}` });
  }

  if (a.currentEmployerEntityId && b.currentEmployerEntityId) {
    signals.push({ key: "current_employer", weight: 20, matched: a.currentEmployerEntityId === b.currentEmployerEntityId, detail: "Same current employer on record." });
  }

  if (a.currentTitle && b.currentTitle) {
    signals.push({ key: "current_title", weight: 5, matched: a.currentTitle.toLowerCase().trim() === b.currentTitle.toLowerCase().trim(), detail: `${a.currentTitle} vs ${b.currentTitle}` });
  }

  if (a.professionalLocation && b.professionalLocation) {
    signals.push({ key: "professional_location", weight: 10, matched: a.professionalLocation.toLowerCase().trim() === b.professionalLocation.toLowerCase().trim(), detail: `${a.professionalLocation} vs ${b.professionalLocation}` });
  }

  return summarize(signals);
}

function normalizeUrlLoose(url: string): string {
  return url
    .toLowerCase()
    .replace(/^https?:\/\//, "")
    .replace(/^www\./, "")
    .replace(/\/$/, "");
}
