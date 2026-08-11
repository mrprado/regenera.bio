import type { ExtractionResult } from "../types";
import type { LLMProvider } from "./types";

// Optional, paid, OFF by default. Only becomes available if
// OPENAI_API_KEY is set -- per instruction, V1 must not require this.
// Not live-tested (no key configured as of 2026-08-11); the request shape
// matches OpenAI's documented Chat Completions API with JSON mode.

const MODEL = process.env.OPENAI_MODEL || "gpt-4o-mini";

const EXTRACTION_PROMPT = (sourceLabel: string, text: string) => `You extract structured facts from intelligence-gathering source text for Regenera, a regenerative infrastructure advisory. Source: "${sourceLabel}".

Extract only what the text actually states. Never invent organizations, people, amounts, or relationships not present in the text. If nothing extractable is present, return empty arrays.

Respond with ONLY valid JSON in this exact shape, no other text:
{"entities":[{"entityType":"organization|person|fund|project|asset|regulator|jurisdiction","name":"...","aliases":[],"details":{}}],"relationships":[{"fromEntityName":"...","toEntityName":"...","relationshipType":"...","confidence":0.0}],"claims":[{"entityName":"...","claimText":"...","confidence":0.0}]}

TEXT:
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
      return {
        entities: Array.isArray(parsed.entities) ? parsed.entities : [],
        relationships: Array.isArray(parsed.relationships) ? parsed.relationships : [],
        claims: Array.isArray(parsed.claims) ? parsed.claims : [],
        confidence: 0.8,
        extractedBy: `llm:openai:${MODEL}`
      };
    } catch {
      return empty;
    }
  }
};
