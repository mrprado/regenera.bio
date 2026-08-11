import type { ExtractionResult } from "../types";
import type { LLMProvider } from "./types";

// Optional, paid, OFF by default. Only becomes available if
// ANTHROPIC_API_KEY is set -- per instruction, V1 must not require this.
// Not live-tested (no key configured as of 2026-08-11); the request shape
// matches Anthropic's documented Messages API.

const MODEL = process.env.ANTHROPIC_MODEL || "claude-haiku-4-5-20251001";

const EXTRACTION_PROMPT = (sourceLabel: string, text: string) => `You extract structured facts from intelligence-gathering source text for Regenera, a regenerative infrastructure advisory. Source: "${sourceLabel}".

Extract only what the text actually states. Never invent organizations, people, amounts, or relationships not present in the text. If nothing extractable is present, return empty arrays.

Respond with ONLY valid JSON in this exact shape, no other text:
{"entities":[{"entityType":"organization|person|fund|project|asset|regulator|jurisdiction","name":"...","aliases":[],"details":{}}],"relationships":[{"fromEntityName":"...","toEntityName":"...","relationshipType":"...","confidence":0.0}],"claims":[{"entityName":"...","claimText":"...","confidence":0.0}]}

TEXT:
${text.slice(0, 12000)}`;

export const anthropicProvider: LLMProvider = {
  name: "anthropic",

  async isAvailable(): Promise<boolean> {
    return Boolean(process.env.ANTHROPIC_API_KEY);
  },

  async extract(text: string, sourceLabel: string): Promise<ExtractionResult> {
    const empty: ExtractionResult = { entities: [], relationships: [], claims: [], confidence: 0, extractedBy: "llm:anthropic" };
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) return empty;

    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01"
        },
        body: JSON.stringify({
          model: MODEL,
          max_tokens: 2048,
          messages: [{ role: "user", content: EXTRACTION_PROMPT(sourceLabel, text) }]
        }),
        signal: AbortSignal.timeout(30_000)
      });
      if (!res.ok) return empty;

      const data = await res.json();
      const raw = data.content?.[0]?.text ?? "{}";
      const parsed = JSON.parse(raw);
      return {
        entities: Array.isArray(parsed.entities) ? parsed.entities : [],
        relationships: Array.isArray(parsed.relationships) ? parsed.relationships : [],
        claims: Array.isArray(parsed.claims) ? parsed.claims : [],
        confidence: 0.8,
        extractedBy: `llm:anthropic:${MODEL}`
      };
    } catch {
      return empty;
    }
  }
};
