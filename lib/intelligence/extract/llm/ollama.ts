import type { ExtractionResult } from "../types";
import type { LLMProvider } from "./types";

// Free, self-hosted extraction escalation path -- the spec's own
// free/open-source-first requirement. Ollama cannot run inside a Netlify
// serverless function (no persistent process), so in production this
// provider is only ever called from the scheduled GitHub Actions workflow
// (.github/workflows/intel-extraction.yml), which installs Ollama, pulls
// OLLAMA_MODEL, runs this against queued low-confidence documents, and
// tears down. Locally, it just needs `ollama serve` running.
//
// NOT LIVE-TESTED against a real model as of 2026-08-11 -- no Ollama
// installation exists in the dev environment this was written in. The
// HTTP contract here matches Ollama's documented /api/generate endpoint;
// verify against a real installation before relying on it.

const DEFAULT_HOST = "http://localhost:11434";
const DEFAULT_MODEL = "llama3.2";

function host(): string {
  return process.env.OLLAMA_HOST || DEFAULT_HOST;
}

function model(): string {
  return process.env.OLLAMA_MODEL || DEFAULT_MODEL;
}

const EXTRACTION_PROMPT = (sourceLabel: string, text: string) => `You extract structured facts from intelligence-gathering source text for Regenera, a regenerative infrastructure advisory. Source: "${sourceLabel}".

Extract only what the text actually states. Never invent organizations, people, amounts, or relationships not present in the text. If nothing extractable is present, return empty arrays.

Respond with ONLY valid JSON in this exact shape, no other text:
{"entities":[{"entityType":"organization|person|fund|project|asset|regulator|jurisdiction","name":"...","aliases":[],"details":{}}],"relationships":[{"fromEntityName":"...","toEntityName":"...","relationshipType":"...","confidence":0.0}],"claims":[{"entityName":"...","claimText":"...","confidence":0.0}]}

TEXT:
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
      return {
        entities: Array.isArray(parsed.entities) ? parsed.entities : [],
        relationships: Array.isArray(parsed.relationships) ? parsed.relationships : [],
        claims: Array.isArray(parsed.claims) ? parsed.claims : [],
        confidence: 0.6,
        extractedBy: `llm:ollama:${model()}`
      };
    } catch {
      return empty;
    }
  }
};
