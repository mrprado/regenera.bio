import type { ExtractionResult } from "../types";

// A provider is only ever consulted when deterministic extraction's own
// confidence falls below the orchestrator's threshold -- see
// docs/intelligence-system/EXTRACTION.md. Providers must never throw on
// "not configured"; isAvailable() is how the orchestrator finds out, so it
// can silently skip to the next provider (or to none at all) instead.
export interface LLMProvider {
  name: string;
  isAvailable(): Promise<boolean>;
  extract(text: string, sourceLabel: string): Promise<ExtractionResult>;
}
