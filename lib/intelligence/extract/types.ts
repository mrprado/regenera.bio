// Shared types for the extraction pipeline. See docs/intelligence-system/
// ARCHITECTURE.md and EXTRACTION.md for the design this implements.

export interface ExtractedEntity {
  entityType: "organization" | "person" | "fund" | "project" | "asset" | "regulator" | "jurisdiction";
  name: string;
  aliases?: string[];
  details?: Record<string, unknown>;
}

export interface ExtractedRelationship {
  fromEntityName: string;
  toEntityName: string;
  relationshipType: string;
  confidence: number;
}

export interface ExtractedClaim {
  entityName?: string;
  relationship?: { fromEntityName: string; toEntityName: string; relationshipType: string };
  claimText: string;
  confidence: number;
}

export interface ExtractionResult {
  entities: ExtractedEntity[];
  relationships: ExtractedRelationship[];
  claims: ExtractedClaim[];
  // Overall confidence in this extraction being complete/correct, 0-1.
  // Drives whether the orchestrator escalates to an LLM provider.
  confidence: number;
  extractedBy: string;
}

const ENTITY_TYPES = new Set(["organization", "person", "fund", "project", "asset", "regulator", "jurisdiction"]);

// LLM output is never guaranteed to match the JSON shape it was asked
// for -- confirmed in production: a small local model (llama3.2:1b)
// returned an entity with no name field, which crashed persistence
// before this existed. Every LLM provider should run its parsed result
// through this before returning, so a malformed record is dropped here
// rather than discovered at the database write.
export function sanitizeExtractionResult(parsed: unknown, extractedBy: string, confidence: number): ExtractionResult {
  const obj = (parsed && typeof parsed === "object" ? parsed : {}) as Record<string, unknown>;

  const entities = (Array.isArray(obj.entities) ? obj.entities : []).filter(
    (e): e is ExtractedEntity => Boolean(e && typeof e === "object" && typeof (e as ExtractedEntity).name === "string" && (e as ExtractedEntity).name.trim() && ENTITY_TYPES.has((e as ExtractedEntity).entityType))
  );

  const relationships = (Array.isArray(obj.relationships) ? obj.relationships : []).filter(
    (r): r is ExtractedRelationship =>
      Boolean(
        r &&
          typeof r === "object" &&
          typeof (r as ExtractedRelationship).fromEntityName === "string" &&
          typeof (r as ExtractedRelationship).toEntityName === "string" &&
          typeof (r as ExtractedRelationship).relationshipType === "string"
      )
  );

  const claims = (Array.isArray(obj.claims) ? obj.claims : []).filter((c): c is ExtractedClaim =>
    Boolean(c && typeof c === "object" && typeof (c as ExtractedClaim).claimText === "string" && (c as ExtractedClaim).claimText.trim())
  );

  return { entities, relationships, claims, confidence, extractedBy };
}
