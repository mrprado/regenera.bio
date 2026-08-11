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

// A small local model (llama3.2:1b) was observed in production echoing the
// EXTRACTION_PROMPT's own framing sentence ("...for Regenera, a
// regenerative infrastructure advisory") back as if it were a fact it
// found in the source document -- a self-referential hallucination, not
// an extraction. Any output matching this exact prompt-injection pattern
// is rejected outright, not just low-confidence-flagged.
const PROMPT_ECHO_RE = /regenera/i;
const PROMPT_ECHO_PHRASE_RE = /regenerative infrastructure advisory/i;
function isPromptEcho(text: string): boolean {
  return PROMPT_ECHO_RE.test(text) && PROMPT_ECHO_PHRASE_RE.test(text);
}

function isValidConfidence(value: unknown): value is number {
  return typeof value === "number" && value >= 0 && value <= 1;
}

// LLM output is never guaranteed to match the JSON shape it was asked
// for -- confirmed in production: a small local model (llama3.2:1b)
// returned an entity with no name field, which crashed persistence
// before this existed, and separately produced content-free filler
// claims ("eProcurement procurement process", an entity name restated as
// its own claim) that all shared one tell: no valid confidence value.
// Every LLM provider should run its parsed result through this before
// returning, so malformed or low-trust records are dropped here rather
// than discovered in the evidence ledger.
export function sanitizeExtractionResult(parsed: unknown, extractedBy: string, confidence: number): ExtractionResult {
  const obj = (parsed && typeof parsed === "object" ? parsed : {}) as Record<string, unknown>;

  const entities = (Array.isArray(obj.entities) ? obj.entities : []).filter(
    (e): e is ExtractedEntity =>
      Boolean(
        e &&
          typeof e === "object" &&
          typeof (e as ExtractedEntity).name === "string" &&
          (e as ExtractedEntity).name.trim() &&
          ENTITY_TYPES.has((e as ExtractedEntity).entityType) &&
          !isPromptEcho((e as ExtractedEntity).name)
      )
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

  // Claims additionally require a real numeric confidence -- every
  // hallucinated claim observed in production omitted this field, while
  // every genuine extraction (deterministic and LLM) included one, so
  // requiring it is a real, data-motivated filter, not an arbitrary one.
  const claims = (Array.isArray(obj.claims) ? obj.claims : []).filter((c): c is ExtractedClaim =>
    Boolean(
      c &&
        typeof c === "object" &&
        typeof (c as ExtractedClaim).claimText === "string" &&
        (c as ExtractedClaim).claimText.trim() &&
        !isPromptEcho((c as ExtractedClaim).claimText) &&
        isValidConfidence((c as ExtractedClaim).confidence)
    )
  );

  return { entities, relationships, claims, confidence, extractedBy };
}
