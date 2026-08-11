import type { ExtractionResult } from "../types";
import * as worldBankProcurement from "./worldBankProcurement";
import * as secEdgar from "./secEdgar";
import * as genericHeuristic from "./genericHeuristic";

// Schema-specific adapters tried in order before falling back to the
// generic heuristic. Add a new adapter here as new structured sources are
// proven in docs/intelligence-system/SOURCE_REGISTRY.md -- an adapter
// should only read fields actually observed in a real captured response,
// never guessed from documentation.
const ADAPTERS = [worldBankProcurement, secEdgar];

export function extractDeterministic(sourceUrl: string, rawContent: string, sourceLabel: string): ExtractionResult {
  for (const adapter of ADAPTERS) {
    if (adapter.canHandle(sourceUrl)) {
      return adapter.extract(rawContent);
    }
  }
  return genericHeuristic.extract(rawContent, sourceLabel);
}
