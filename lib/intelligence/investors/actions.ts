"use server";

import { revalidatePath } from "next/cache";
import { checkIntelAccess } from "@/lib/crm/staff";
import { createClient } from "@/lib/supabase/server";
import { collectSource } from "@/lib/intelligence/collect";
import { extractDocument } from "@/lib/intelligence/extract";
import { persistExtraction } from "@/lib/intelligence/extract/persist";
import { generateDiscoveryQueries, type MandateQueryInput } from "./queryGenerator";
import { scoreProjectMatch, type ProjectMatchInputs } from "./scoring";
import { extractDomain, normalizeUrl } from "./extract";
import type { OrganizationInvestorUniverse } from "./types";

// Server actions for the Investor Intelligence UI. Every export here
// starts with the same guard: a real Supabase Auth session AND
// staff.has_intel_access = true, checked in application code as UX
// (redirects, error messages) -- the actual security boundary is RLS via
// is_intel_access() on every investor_* table, so a bug here fails closed,
// not open. Reads/writes go through the user-session client (RLS
// enforced), except calling the existing collectSource() helper, which
// necessarily uses the admin client internally (unchanged, reused as-is).

class IntelAccessError extends Error {}

async function requireIntelAccess() {
  const access = await checkIntelAccess();
  if (access.state !== "authorized") {
    throw new IntelAccessError(`Investor Intelligence access denied (${access.state}).`);
  }
  return access.staff;
}

// ------------------------------------------------------------------
// Capital mandates
// ------------------------------------------------------------------

export interface MandateInput {
  name: string;
  projectId?: string | null;
  sectors: string[];
  geographies: string[];
  projectStage?: string | null;
  capitalTypes: string[];
  investmentStructures: string[];
  targetRaiseMin?: number | null;
  targetRaiseMax?: number | null;
  preferredCheckMin?: number | null;
  preferredCheckMax?: number | null;
  currency: string;
  impactThemes: string[];
  regenerativeFunctions: string[];
  offeringPathway?: string | null;
  accreditedInvestorsOnly?: boolean | null;
}

export async function createMandate(input: MandateInput): Promise<{ id: string }> {
  const staff = await requireIntelAccess();
  const supabase = createClient();

  const { data, error } = await supabase
    .from("project_investment_mandates")
    .insert({
      name: input.name,
      project_id: input.projectId ?? null,
      sectors: input.sectors,
      geographies: input.geographies,
      project_stage: input.projectStage ?? null,
      capital_types: input.capitalTypes,
      investment_structures: input.investmentStructures,
      target_raise_min: input.targetRaiseMin ?? null,
      target_raise_max: input.targetRaiseMax ?? null,
      preferred_check_min: input.preferredCheckMin ?? null,
      preferred_check_max: input.preferredCheckMax ?? null,
      currency: input.currency,
      impact_themes: input.impactThemes,
      regenerative_functions: input.regenerativeFunctions,
      offering_pathway: input.offeringPathway ?? null,
      accredited_investors_only: input.accreditedInvestorsOnly ?? null,
      status: "draft",
      owner_id: staff.id,
      created_by: staff.id
    })
    .select("id")
    .single();

  if (error || !data) throw new Error(`Failed to create mandate: ${error?.message}`);
  revalidatePath("/crm/intelligence/investors/mandates");
  return { id: data.id };
}

// ------------------------------------------------------------------
// Discovery query generation (pure, no provider calls yet)
// ------------------------------------------------------------------

export async function generateAndStoreQueries(mandateId: string, universes?: OrganizationInvestorUniverse[]) {
  await requireIntelAccess();
  const supabase = createClient();

  const { data: mandate, error } = await supabase.from("project_investment_mandates").select("*").eq("id", mandateId).single();
  if (error || !mandate) throw new Error(`Mandate not found: ${error?.message}`);

  const mandateInput: MandateQueryInput = {
    name: mandate.name,
    sectors: mandate.sectors ?? [],
    geographies: mandate.geographies ?? [],
    projectStage: mandate.project_stage,
    capitalTypes: mandate.capital_types ?? [],
    investmentStructures: mandate.investment_structures ?? [],
    impactThemes: mandate.impact_themes ?? [],
    regenerativeFunctions: mandate.regenerative_functions ?? []
  };

  const queries = generateDiscoveryQueries(mandateInput, { universes });

  const { error: insertError } = await supabase.from("investor_discovery_queries").insert(
    queries.map((q) => ({
      mandate_id: mandateId,
      query_family: q.queryFamily,
      query_text: q.queryText,
      investor_universe: q.investorUniverse ?? null,
      status: "pending"
    }))
  );
  if (insertError) throw new Error(`Failed to store queries: ${insertError.message}`);

  revalidatePath(`/crm/intelligence/investors/mandates/${mandateId}`);
  return { count: queries.length };
}

// ------------------------------------------------------------------
// Manual-URL / Jina Reader collection: fetch a single URL through the
// existing generic collector, for a human to review before any entity is
// created from it. This is the only discovery path that is fully
// functional without any external credentials.
// ------------------------------------------------------------------

export interface CollectedForReview {
  sourceId: string;
  documentId: string;
  changed: boolean;
  textPreview: string;
  suggestedEntities: { name: string; entityType: string }[];
}

export async function collectUrlForReview(url: string, mandateId: string | null): Promise<CollectedForReview> {
  await requireIntelAccess();
  const supabase = createClient();
  const normalized = normalizeUrl(url);
  if (!normalized) throw new Error("Not a valid URL.");

  const { data: existingSource } = await supabase.from("intel_sources").select("id").eq("url", normalized).maybeSingle();

  let sourceId: string;
  if (existingSource) {
    sourceId = existingSource.id;
  } else {
    const { data: inserted, error: insertError } = await supabase
      .from("intel_sources")
      .insert({
        name: extractDomain(normalized) ?? normalized,
        source_type: "website",
        url: normalized,
        category: "investor_discovery",
        is_active: true
      })
      .select("id")
      .single();
    if (insertError || !inserted) throw new Error(`Failed to register source: ${insertError?.message}`);
    sourceId = inserted.id;
  }

  // Reuses the existing generic collector unmodified -- this is the
  // module's one required "extend, don't duplicate" behavior.
  const collectResult = await collectSource(sourceId);
  if (!collectResult.ok || !collectResult.documentId) {
    throw new Error(collectResult.error ?? "Collection failed.");
  }

  const { data: document } = await supabase.from("intel_documents").select("raw_content").eq("id", collectResult.documentId).single();
  const text = (document?.raw_content as string | undefined) ?? "";

  // Best-effort automatic extraction (deterministic first, LLM only if a
  // provider is configured) -- persisted immediately as generic
  // intel_entities/intel_evidence rows, exactly like every other source in
  // this system. This does NOT create an investor_organization_profiles
  // row; that only happens when a human confirms a candidate below, so an
  // LLM hallucination can add a stray intel_entities row but can never by
  // itself put something in front of "approved for contact."
  try {
    const extraction = await extractDocument(normalized, text, extractDomain(normalized) ?? normalized);
    await persistExtraction(collectResult.documentId, extraction);
  } catch (err) {
    console.error("[investor-intel] extraction failed, continuing with manual review only", err);
  }

  // investor_discovery_results rows always belong to a specific generated
  // query (its FK is not-null); an ad-hoc manual/Jina fetch has no query to
  // attach to, so it is tracked only as the intel_sources/intel_documents
  // rows above, not as a discovery result row. mandateId is accepted here
  // for the caller's own UI context (which mandate this review is for),
  // not persisted as a relationship on this row.
  void mandateId;

  return {
    sourceId,
    documentId: collectResult.documentId,
    changed: Boolean(collectResult.changed),
    textPreview: text.slice(0, 2000),
    suggestedEntities: []
  };
}

// ------------------------------------------------------------------
// Candidate creation (human-confirmed name + universe, cites the
// collected document as evidence)
// ------------------------------------------------------------------

export interface CreateOrganizationCandidateInput {
  name: string;
  investorUniverse: OrganizationInvestorUniverse;
  canonicalDomain?: string | null;
  headquarters?: string | null;
  sectors: string[];
  geographies: string[];
  sourceDocumentId?: string | null;
  sourceUrl?: string | null;
}

export async function createOrganizationCandidate(input: CreateOrganizationCandidateInput): Promise<{ entityId: string }> {
  await requireIntelAccess();
  const supabase = createClient();

  const { data: existing } = await supabase.from("intel_entities").select("id").eq("entity_type", "organization").ilike("name", input.name).maybeSingle();

  let entityId: string;
  if (existing) {
    entityId = existing.id;
  } else {
    const { data: entity, error: entityError } = await supabase
      .from("intel_entities")
      .insert({ entity_type: "organization", name: input.name, details: {} })
      .select("id")
      .single();
    if (entityError || !entity) throw new Error(`Failed to create entity: ${entityError?.message}`);
    entityId = entity.id;
  }

  const { error: profileError } = await supabase.from("investor_organization_profiles").upsert(
    {
      entity_id: entityId,
      investor_universe: input.investorUniverse,
      canonical_domain: input.canonicalDomain ?? null,
      headquarters: input.headquarters ?? null,
      sectors: input.sectors,
      geographies: input.geographies,
      review_status: "discovered"
    },
    { onConflict: "entity_id" }
  );
  if (profileError) throw new Error(`Failed to create investor profile: ${profileError.message}`);

  if (input.sourceDocumentId) {
    await supabase.from("intel_evidence").insert({
      entity_id: entityId,
      claim_text: `Identified as a candidate ${input.investorUniverse.replace(/_/g, " ")} investor from ${input.sourceUrl ?? "a reviewed source"}.`,
      document_id: input.sourceDocumentId,
      extracted_by: "manual:staff-review",
      confidence: 0.9,
      predicate: "investor_universe",
      raw_value: input.investorUniverse,
      source_tier: 3
    });
  }

  revalidatePath("/crm/intelligence/investors/organizations");
  return { entityId };
}

// ------------------------------------------------------------------
// Matching
// ------------------------------------------------------------------

export async function calculateProjectMatch(mandateId: string, investorEntityId: string) {
  await requireIntelAccess();
  const supabase = createClient();

  const [{ data: mandate }, { data: profile }] = await Promise.all([
    supabase.from("project_investment_mandates").select("*").eq("id", mandateId).single(),
    supabase.from("investor_organization_profiles").select("*").eq("entity_id", investorEntityId).single()
  ]);
  if (!mandate) throw new Error("Mandate not found.");
  if (!profile) throw new Error("Investor profile not found.");

  const { count: comparableCount } = await supabase
    .from("investor_transactions")
    .select("id", { count: "exact", head: true })
    .eq("investor_entity_id", investorEntityId);

  const inputs: ProjectMatchInputs = {
    sectorOverlap: { candidateValues: profile.sectors ?? [], mandateValues: mandate.sectors ?? [] },
    geographyOverlap: { candidateValues: profile.geographies ?? [], mandateValues: mandate.geographies ?? [] },
    investorCheckSize: { min: profile.check_min, max: profile.check_max },
    mandateCheckSize: { min: mandate.preferred_check_min, max: mandate.preferred_check_max },
    stageOverlap: { candidateValues: profile.stages ?? [], mandateValues: mandate.project_stage ? [mandate.project_stage] : [] },
    capitalTypeOverlap: { candidateValues: profile.capital_types ?? [], mandateValues: mandate.capital_types ?? [] },
    structureOverlap: { candidateValues: profile.investment_structures ?? [], mandateValues: mandate.investment_structures ?? [] },
    comparableInvestmentCount: comparableCount ?? 0,
    deploymentStatus: profile.deployment_status ?? "unknown",
    impactAlignmentOverlap: { candidateValues: [...(profile.impact_priorities ?? []), ...(profile.regenerative_functions ?? [])], mandateValues: [...(mandate.impact_themes ?? []), ...(mandate.regenerative_functions ?? [])] },
    hasRelationshipAccess: false,
    readinessFit: null,
    flags: {
      explicitSectorExclusion: (profile.exclusions ?? []).some((ex: string) => (mandate.sectors ?? []).some((s: string) => s.toLowerCase() === ex.toLowerCase())),
      serviceProviderMisclassified: false,
      conflictedOrUnverifiedIdentity: (profile.confidence ?? 1) < 0.4,
      hasDirectInvestingEvidence: Boolean(profile.direct_investor),
      lastVerifiedAt: profile.last_verified_at
    }
  };

  const result = scoreProjectMatch(inputs);

  const { error } = await supabase.from("investor_project_matches").upsert(
    {
      mandate_id: mandateId,
      investor_entity_id: investorEntityId,
      match_kind: "project_investor",
      total_score: result.totalScore,
      classification: result.classification,
      component_scores: result.componentScores,
      penalties: result.penalties,
      missing_evidence: result.missingEvidence,
      explanation: result.explanation,
      scoring_version: result.scoringVersion,
      calculated_at: new Date().toISOString()
    },
    { onConflict: "mandate_id,investor_entity_id" }
  );
  if (error) throw new Error(`Failed to store match: ${error.message}`);

  revalidatePath(`/crm/intelligence/investors/mandates/${mandateId}`);
  return result;
}

// ------------------------------------------------------------------
// Promotion to CRM (deliberate, logged, never automatic)
// ------------------------------------------------------------------

export async function promoteOrganizationToCrm(entityId: string): Promise<{ organizationId: string }> {
  const staff = await requireIntelAccess();
  const supabase = createClient();

  const [{ data: entity }, { data: profile }] = await Promise.all([
    supabase.from("intel_entities").select("name").eq("id", entityId).single(),
    supabase.from("investor_organization_profiles").select("*").eq("entity_id", entityId).single()
  ]);
  if (!entity || !profile) throw new Error("Candidate not found.");
  if (profile.promoted_to_organization_id) return { organizationId: profile.promoted_to_organization_id };

  const { data: org, error: orgError } = await supabase
    .from("organizations")
    .insert({
      name: entity.name,
      website: profile.canonical_domain ? `https://${profile.canonical_domain}` : null,
      organization_type: "investor",
      headquarters: profile.headquarters,
      geographies: profile.geographies,
      sectors: profile.sectors,
      relationship_status: "prospect",
      source: "investor_intelligence",
      created_by: staff.id
    })
    .select("id")
    .single();
  if (orgError || !org) throw new Error(`Failed to create CRM organization: ${orgError?.message}`);

  await supabase
    .from("investor_organization_profiles")
    .update({ promoted_to_organization_id: org.id, promoted_at: new Date().toISOString(), review_status: "approved_for_crm" })
    .eq("entity_id", entityId);

  revalidatePath("/crm/intelligence/investors/organizations");
  return { organizationId: org.id };
}

// ------------------------------------------------------------------
// Monitoring rules
// ------------------------------------------------------------------

export async function createMonitoringRule(input: { investorEntityId: string; ruleType: string }) {
  const staff = await requireIntelAccess();
  const supabase = createClient();

  const { error } = await supabase.from("investor_monitoring_rules").insert({
    investor_entity_id: input.investorEntityId,
    rule_type: input.ruleType,
    is_active: true,
    created_by: staff.id
  });
  if (error) throw new Error(`Failed to create monitoring rule: ${error.message}`);
  revalidatePath("/crm/intelligence/investors/monitoring");
}

// ------------------------------------------------------------------
// Review tasks
// ------------------------------------------------------------------

export async function resolveReviewTask(taskId: string, status: "approved" | "rejected" | "dismissed") {
  const staff = await requireIntelAccess();
  const supabase = createClient();

  const { error } = await supabase
    .from("investor_review_tasks")
    .update({ status, resolved_by: staff.id, resolved_at: new Date().toISOString() })
    .eq("id", taskId);
  if (error) throw new Error(`Failed to resolve review task: ${error.message}`);
  revalidatePath("/crm/intelligence/investors/review");
}

// ------------------------------------------------------------------
// Connector health (live check, nothing persisted)
// ------------------------------------------------------------------

export async function getConnectorHealth() {
  await requireIntelAccess();
  const { checkAllProviderHealth } = await import("./providers/registry");
  return checkAllProviderHealth();
}
