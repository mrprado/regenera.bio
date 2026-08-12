import { assertSafeUrl, FETCH_TIMEOUT_MS, MAX_RESPONSE_BYTES, UnsafeUrlError } from "../urlSafety";
import type { DiscoveryResult, InvestorDiscoveryProvider, OrganizationSearchInput, PeopleSearchInput, ProfileFetchInput, ProviderHealth, RawSource, WebSearchInput } from "./types";

// Jina Reader (https://jina.ai/reader) turns any URL into clean text,
// which is a real improvement over raw fetch for JS-heavy investor sites
// (team pages rendered client-side, PDF viewers). Its public endpoint
// (https://r.jina.ai/<url>) works with no API key at a low free rate
// limit; JINA_API_KEY (optional) raises that limit. No search capability
// (Jina Reader reads a URL, it doesn't search), so searchOrganizations/
// searchPeople/searchWeb return [] like ManualUrlProvider.
export class JinaReaderProvider implements InvestorDiscoveryProvider {
  id = "jina_reader";
  label = "Jina Reader";

  async isAvailable(): Promise<boolean> {
    return true; // works without a key; a key only raises the rate limit
  }

  async healthCheck(): Promise<ProviderHealth> {
    const hasKey = Boolean(process.env.JINA_API_KEY);
    return {
      providerId: this.id,
      available: true,
      status: "ok",
      message: hasKey ? "Configured with JINA_API_KEY (higher rate limit)." : "Available on Jina's free public rate limit. Set JINA_API_KEY to raise it.",
      checkedAt: new Date().toISOString(),
      setupInstructions: hasKey ? undefined : "Optional: get a free key at https://jina.ai/reader and set JINA_API_KEY."
    };
  }

  async searchOrganizations(_input: OrganizationSearchInput): Promise<DiscoveryResult[]> {
    return [];
  }

  async searchPeople(_input: PeopleSearchInput): Promise<DiscoveryResult[]> {
    return [];
  }

  async searchWeb(_input: WebSearchInput): Promise<DiscoveryResult[]> {
    return [];
  }

  async fetchProfile(input: ProfileFetchInput): Promise<RawSource> {
    const target = await assertSafeUrl(input.url);
    const readerUrl = `https://r.jina.ai/${target.toString()}`;

    const apiKey = process.env.JINA_API_KEY;
    const response = await fetch(readerUrl, {
      headers: {
        "User-Agent": "RegeneraIntelligenceOS/0.1 (+https://regenera.bio)",
        ...(apiKey ? { Authorization: `Bearer ${apiKey}` } : {})
      },
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS)
    });

    if (!response.ok) {
      throw new Error(`Jina Reader returned ${response.status} for ${input.url}`);
    }

    const buffer = await response.arrayBuffer();
    if (buffer.byteLength > MAX_RESPONSE_BYTES) {
      throw new Error(`Response exceeded ${MAX_RESPONSE_BYTES} bytes: ${input.url}`);
    }

    return {
      url: input.url,
      fetchedAt: new Date().toISOString(),
      contentType: response.headers.get("content-type"),
      body: Buffer.from(buffer).toString("utf-8"),
      providerId: this.id
    };
  }
}

export { UnsafeUrlError };
