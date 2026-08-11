import type { ExtractionResult } from "../types";
import { sanitizeExtractionResult } from "../types";
import type { LLMProvider } from "./types";

// Free, self-hosted extraction escalation path -- the spec's own
// free/open-source-first requirement. Ollama cannot run inside a Netlify
// serverless function (no persistent process), so in production this
// provider is only ever called from the scheduled GitHub Actions workflow
// (.github/workflows/intel-extraction.yml), which installs Ollama, pulls
// OLLAMA_MODEL, runs this against queued low-confidence documents, and
// tears down. Locally, it just needs `ollama serve` running.
//
// Proven live in production (2026-08-11): the GitHub Actions workflow
// successfully calls this against llama3.2:1b. Also caught a real failure
// mode there -- the model echoed this file's own prompt framing back as
// a "fact" about an unrelated source, and separately produced content-
// free filler claims. The prompt below and sanitizeExtractionResult()
// (../types.ts) both now guard against it; see docs/intelligence-system/
// EXTRACTION.md for the full incident.

const DEFAULT_HOST = "http://localhost:11434";
const DEFAULT_MODEL = "llama3.2";

function host(): string {
  return process.env.OLLAMA_HOST || DEFAULT_HOST;
}

function model(): string {
  return process.env.OLLAMA_MODEL || DEFAULT_MODEL;
}

const EXTRACTION_PROMPT = (sourceLabel: string, text: string) => `You extract structured facts that appear IN THE TEXT below. This paragraph is instructions, not content -- never extract facts about these instructions, about "Regenera", or about the task itself, only about what the TEXT states.

Extract only what the TEXT actually states. Never invent organizations, people, amounts, or relationships not present in it. Every claim needs a real confidence number (0 to 1) reflecting how directly the TEXT states it. A claim whose text is just an entity's own name restated is not a real claim -- omit it. If the TEXT has no real factual content (navigation menus, login pages, boilerplate), returning empty arrays is the correct answer, not a failure.

Respond with ONLY valid JSON in this exact shape, no other text:
{"entities":[{"entityType":"organization|person|fund|project|asset|regulator|jurisdiction","name":"...","aliases":[],"details":{}}],"relationships":[{"fromEntityName":"...","toEntityName":"...","relationshipType":"...","confidence":0.0}],"claims":[{"entityName":"...","claimText":"a specific factual sentence from the TEXT, not a name or category label","confidence":0.0}]}

TEXT (source: "${sourceLabel}"):
${text.slice(0, 12000)}`;

export const ollamaProvider: LLMProvider = {
  name: "ollama",

  async isAvailable(): Promise<boolean> {
    try {
      const res = await fetch(`${host()}/api/tags`, { signal: AbortSignal.timeout(2000) });
      return res.ok;
    } catch {
      return false;
    }
  },

  async extract(text: string, sourceLabel: string): Promise<ExtractionResult> {
    const empty: ExtractionResult = { entities: [], relationships: [], claims: [], confidence: 0, extractedBy: "llm:ollama" };
    try {
      const res = await fetch(`${host()}/api/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: model(),
          prompt: EXTRACTION_PROMPT(sourceLabel, text),
          format: "json",
          stream: false
        }),
        signal: AbortSignal.timeout(60_000)
      });
      if (!res.ok) return empty;

      const data = await res.json();
      const parsed = JSON.parse(data.response ?? "{}");
      return sanitizeExtractionResult(parsed, `llm:ollama:${model()}`, 0.6);
    } catch {
      return empty;
    }
  }
};
