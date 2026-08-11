import { createAdminClient } from "../../supabase/admin";
import type { ExtractionResult } from "./types";

export interface PersistStats {
  entitiesCreated: number;
  entitiesReused: number;
  relationshipsCreated: number;
  evidenceCreated: number;
  claimsSkippedNoSubject: number;
}

// Writes an ExtractionResult into the knowledge graph, citing documentId as
// the evidence source for every claim. Entities are deduplicated by
// (entity_type, lower(name)) against what's already in intel_entities --
// deliberately simple exact-ish matching for now, not fuzzy/alias
// resolution, since silently merging two similarly-named but distinct
// organizations would be a worse error than leaving a duplicate for a
// human/future agent to reconcile.
export async function persistExtraction(documentId: string, result: ExtractionResult): Promise<PersistStats> {
  const supabase = createAdminClient();
  const stats: PersistStats = { entitiesCreated: 0, entitiesReused: 0, relationshipsCreated: 0, evidenceCreated: 0, claimsSkippedNoSubject: 0 };
  if (!supabase) return stats;

  const entityIdByName = new Map<string, string>();

  // Deterministic adapters always produce well-formed entities, but LLM
  // output (lib/intelligence/extract/llm/*) is never guaranteed to match
  // the requested JSON shape -- a small local model in particular can
  // return an entity with a missing/null name. Skip rather than crash the
  // whole batch over one bad record.
  for (const entity of result.entities) {
    if (!entity?.name || typeof entity.name !== "string" || !entity.entityType) continue;
    const key = `${entity.entityType}:${entity.name.toLowerCase()}`;
    if (entityIdByName.has(key)) continue;

    const { data: existing } = await supabase
      .from("intel_entities")
      .select("id")
      .eq("entity_type", entity.entityType)
      .ilike("name", entity.name)
      .maybeSingle();

    if (existing) {
      entityIdByName.set(key, existing.id);
      stats.entitiesReused++;
      continue;
    }

    const { data: inserted, error } = await supabase
      .from("intel_entities")
      .insert({ entity_type: entity.entityType, name: entity.name, aliases: entity.aliases ?? [], details: entity.details ?? {} })
      .select("id")
      .single();

    if (!error && inserted) {
      entityIdByName.set(key, inserted.id);
      stats.entitiesCreated++;
    }
  }

  const resolveEntityId = async (name: string): Promise<string | null> => {
    for (const [key, id] of entityIdByName) {
      if (key.endsWith(`:${name.toLowerCase()}`)) return id;
    }
    const { data } = await supabase.from("intel_entities").select("id").ilike("name", name).maybeSingle();
    return data?.id ?? null;
  };

  const relationshipIdByKey = new Map<string, string>();

  for (const rel of result.relationships) {
    if (!rel?.fromEntityName || !rel?.toEntityName || !rel?.relationshipType) continue;
    const fromId = await resolveEntityId(rel.fromEntityName);
    const toId = await resolveEntityId(rel.toEntityName);
    if (!fromId || !toId) continue;

    const { data: inserted, error } = await supabase
      .from("intel_entity_relationships")
      .insert({ from_entity_id: fromId, to_entity_id: toId, relationship_type: rel.relationshipType, confidence: rel.confidence })
      .select("id")
      .single();

    if (!error && inserted) {
      relationshipIdByKey.set(`${rel.fromEntityName}|${rel.relationshipType}|${rel.toEntityName}`, inserted.id);
      stats.relationshipsCreated++;
    }
  }

  for (const claim of result.claims) {
    if (!claim?.claimText || typeof claim.claimText !== "string") continue;

    let entityId: string | null = null;
    let relationshipId: string | null = null;

    if (claim.entityName) {
      entityId = await resolveEntityId(claim.entityName);
    } else if (claim.relationship) {
      relationshipId =
        relationshipIdByKey.get(`${claim.relationship.fromEntityName}|${claim.relationship.relationshipType}|${claim.relationship.toEntityName}`) ?? null;
    }

    if (!entityId && !relationshipId) {
      stats.claimsSkippedNoSubject++;
      continue;
    }

    const { error } = await supabase.from("intel_evidence").insert({
      entity_id: entityId,
      relationship_id: relationshipId,
      claim_text: claim.claimText,
      document_id: documentId,
      extracted_by: result.extractedBy,
      confidence: claim.confidence
    });

    if (!error) stats.evidenceCreated++;
  }

  return stats;
}
