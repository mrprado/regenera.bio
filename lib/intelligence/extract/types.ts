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
