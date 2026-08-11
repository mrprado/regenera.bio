import type { ExtractionResult } from "./types";
import { extractDeterministic } from "./deterministic";
import { getConfiguredProvider } from "./llm";

// Confidence below this triggers LLM escalation, but ONLY if a provider is
// actually configured/reachable (getConfiguredProvider returns null
// otherwise, and the deterministic result is used as-is). This is what
// makes "LLM escalation only when deterministic extraction cannot achieve
// sufficient confidence" real rather than aspirational.
const ESCALATION_THRESHOLD = 0.6;

export async function extractDocument(sourceUrl: string, rawContent: string, sourceLabel: string): Promise<ExtractionResult> {
  const deterministic = extractDeterministic(sourceUrl, rawContent, sourceLabel);

  if (deterministic.confidence >= ESCALATION_THRESHOLD) {
    return deterministic;
  }

  const provider = await getConfiguredProvider();
  if (!provider) {
    return deterministic; // no LLM available -- ship what deterministic found, low confidence and all
  }

  const llmResult = await provider.extract(rawContent, sourceLabel);
  // Merge rather than replace: deterministic findings are precise even when
  // sparse, LLM findings add breadth. Neither is discarded.
  return {
    entities: [...deterministic.entities, ...llmResult.entities],
    relationships: [...deterministic.relationships, ...llmResult.relationships],
    claims: [...deterministic.claims, ...llmResult.claims],
    confidence: Math.max(deterministic.confidence, llmResult.confidence),
    extractedBy: llmResult.confidence > 0 ? `${deterministic.extractedBy}+${llmResult.extractedBy}` : deterministic.extractedBy
  };
}

export { extractDeterministic } from "./deterministic";
export type { ExtractionResult, ExtractedEntity, ExtractedRelationship, ExtractedClaim } from "./types";
