// Shared vocabulary for the Investor Intelligence domain. Kept as plain
// string unions matching the CHECK constraints in
// supabase/migrations/20260812120000_create_investor_intelligence_schema.sql
// exactly -- if a value is added here it must be added there too, and vice
// versa, or inserts will fail at the database instead of at the type level.

export const INVESTOR_UNIVERSES = [
  "accredited_individual",
  "family_office",
  "strategic_capital",
  "infrastructure_fund",
  "private_equity",
  "institutional_investor",
  "dfi_multilateral",
  "foundation_catalytic",
  "investment_network",
  "retail_channel"
] as const;
export type InvestorUniverse = (typeof INVESTOR_UNIVERSES)[number];

// investor_organization_profiles.investor_universe excludes accredited_individual
// (that classification is person-level only).
export type OrganizationInvestorUniverse = Exclude<InvestorUniverse, "accredited_individual">;
export const ORGANIZATION_INVESTOR_UNIVERSES = INVESTOR_UNIVERSES.filter((u): u is OrganizationInvestorUniverse => u !== "accredited_individual");

export const ACCREDITATION_STATUSES = ["unknown", "self_identified", "platform_verified", "third_party_verified", "counsel_confirmed"] as const;
export type AccreditationStatus = (typeof ACCREDITATION_STATUSES)[number];

export const AUTHORITY_CLASSIFICATIONS = [
  "economic_decision_maker",
  "investment_sponsor",
  "originator",
  "technical_evaluator",
  "gatekeeper",
  "influencer",
  "advisor",
  "unknown"
] as const;
export type AuthorityClassification = (typeof AUTHORITY_CLASSIFICATIONS)[number];

export const REVIEW_STATUSES = [
  "discovered",
  "collected",
  "extracted",
  "needs_verification",
  "verified",
  "qualified",
  "approved_for_crm",
  "approved_for_contact",
  "contacted",
  "responded",
  "referred",
  "declined",
  "monitor",
  "archived",
  "suppressed"
] as const;
export type ReviewStatus = (typeof REVIEW_STATUSES)[number];

export const MATCH_CLASSIFICATIONS = [
  "immediate_target",
  "qualified_research_target",
  "monitor_or_relationship_path",
  "archive_low_priority",
  "hard_exclusion"
] as const;
export type MatchClassification = (typeof MATCH_CLASSIFICATIONS)[number];

export const QUERY_FAMILIES = ["mandate", "portfolio", "transaction", "fund_activity", "personnel", "accredited_individual", "comparable_project"] as const;
export type QueryFamily = (typeof QUERY_FAMILIES)[number];

export const DEPLOYMENT_STATUSES = ["actively_deploying", "selective", "paused", "unknown"] as const;
export type DeploymentStatus = (typeof DEPLOYMENT_STATUSES)[number];

// Source-quality hierarchy (docs/intelligence-system/INVESTOR_INTELLIGENCE.md
// "Source hierarchy"). Tier 1 alone can prove a hard fact (check size,
// AUM, decision authority); Tier 3 can only create a candidate record.
export type SourceTier = 1 | 2 | 3;

export interface InvestorOrganizationProfile {
  entity_id: string;
  investor_universe: OrganizationInvestorUniverse;
  organization_subtype: string | null;
  legal_name: string | null;
  former_names: string[];
  canonical_domain: string | null;
  headquarters: string | null;
  office_locations: string[];
  direct_investor: boolean | null;
  fund_manager: boolean | null;
  strategic_investor: boolean | null;
  parent_entity_id: string | null;
  sectors: string[];
  subsectors: string[];
  geographies: string[];
  stages: string[];
  capital_types: string[];
  investment_structures: string[];
  check_min: number | null;
  check_max: number | null;
  currency: string;
  target_returns: Record<string, unknown>;
  time_horizon: string | null;
  impact_priorities: string[];
  regenerative_functions: string[];
  exclusions: string[];
  aum: number | null;
  aum_currency: string | null;
  current_fund_status: string | null;
  deployment_status: DeploymentStatus;
  last_investment_date: string | null;
  last_verified_at: string | null;
  confidence: number | null;
  review_status: ReviewStatus;
  promoted_to_organization_id: string | null;
  promoted_at: string | null;
}

export interface InvestorPersonProfile {
  entity_id: string;
  investor_universe: InvestorUniverse | null;
  linkedin_url: string | null;
  current_title: string | null;
  current_organization_entity_id: string | null;
  professional_location: string | null;
  seniority: string | null;
  authority_classification: AuthorityClassification;
  sector_signals: string[];
  geography_signals: string[];
  investment_signals: string[];
  public_bio: string | null;
  public_professional_email: string | null;
  official_contact_url: string | null;
  email_pattern_status: "verified" | "inferred" | "unknown";
  accreditation_status: AccreditationStatus;
  confidence: number | null;
  review_status: ReviewStatus;
  do_not_contact: boolean;
}
