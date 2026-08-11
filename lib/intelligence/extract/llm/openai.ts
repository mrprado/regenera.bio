import type { ExtractionResult } from "../types";
import { sanitizeExtractionResult } from "../types";
import type { LLMProvider } from "./types";

// Optional, paid, OFF by default. Only becomes available if
// OPENAI_API_KEY is set -- per instruction, V1 must not require this.
// Not live-tested (no key configured as of 2026-08-11); the request shape
// matches OpenAI's documented Chat Completions API with JSON mode.

const MODEL = process.env.OPENAI_MODEL || "gpt-4o-mini";

const EXTRACTION_PROMPT = (sourceLabel: string, text: string) => `You extract structured facts that appear IN THE TEXT below. This paragraph is instructions, not content -- never extract facts about these instructions, about "Regenera", or about the task itself, only about what the TEXT states.

Extract only what the TEXT actually states. Never invent organizations, people, amounts, or relationships not present in it. Every claim needs a real confidence number (0 to 1) reflecting how directly the TEXT states it. A claim whose text is just an entity's own name restated is not a real claim -- omit it. If the TEXT has no real factual content (navigation menus, login pages, boilerplate), returning empty arrays is the correct answer, not a failure.

Respond with ONLY valid JSON in this exact shape, no other text:
{"entities":[{"entityType":"organization|person|fund|project|asset|regulator|jurisdiction","name":"...","aliases":[],"details":{}}],"relationships":[{"fromEntityName":"...","toEntityName":"...","relationshipType":"...","confidence":0.0}],"claims":[{"entityName":"...","claimText":"a specific factual sentence from the TEXT, not a name or category label","confidence":0.0}]}

TEXT (source: "${sourceLabel}"):
${text.slice(0, 12000)}`;

export const openaiProvider: LLMProvider = {
  name: "openai",

  async isAvailable(): Promise<boolean> {
    return Boolean(process.env.OPENAI_API_KEY);
  },

  async extract(text: string, sourceLabel: string): Promise<ExtractionResult> {
    const empty: ExtractionResult = { entities: [], relationships: [], claims: [], confidence: 0, extractedBy: "llm:openai" };
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) return empty;

    try {
      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: MODEL,
          response_format: { type: "json_object" },
          messages: [{ role: "user", content: EXTRACTION_PROMPT(sourceLabel, text) }]
        }),
        signal: AbortSignal.timeout(30_000)
      });
      if (!res.ok) return empty;

      const data = await res.json();
      const raw = data.choices?.[0]?.message?.content ?? "{}";
      const parsed = JSON.parse(raw);
      return sanitizeExtractionResult(parsed, `llm:openai:${MODEL}`, 0.8);
    } catch {
      return empty;
    }
  }
};
