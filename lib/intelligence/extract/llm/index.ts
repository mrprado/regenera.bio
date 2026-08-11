import type { LLMProvider } from "./types";
import { ollamaProvider } from "./ollama";
import { anthropicProvider } from "./anthropic";
import { openaiProvider } from "./openai";

// Preference order matches the free-first mandate: try the free local
// option before either paid API, and never fail if none are configured --
// the orchestrator treats "no provider available" as a normal outcome, not
// an error, per instruction to not require a paid key for V1.
const PROVIDERS: LLMProvider[] = [ollamaProvider, anthropicProvider, openaiProvider];

export async function getConfiguredProvider(): Promise<LLMProvider | null> {
  for (const provider of PROVIDERS) {
    if (await provider.isAvailable()) return provider;
  }
  return null;
}

export { ollamaProvider, anthropicProvider, openaiProvider };
