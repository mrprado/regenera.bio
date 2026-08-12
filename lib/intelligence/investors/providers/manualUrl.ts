import type { DiscoveryResult, InvestorDiscoveryProvider, OrganizationSearchInput, PeopleSearchInput, ProfileFetchInput, ProviderHealth, RawSource, WebSearchInput } from "./types";

// The only provider guaranteed to work with zero external dependencies or
// credentials: a human pastes a URL (a fund's team page, a press release,
// a conference bio) and this adapter fetches it. No search capability --
// searchOrganizations/searchPeople/searchWeb all return [] rather than
// throwing, since "no results" is the honest answer for a provider that
// cannot search. This is what keeps the module usable before Agent Reach,
// Exa, or LinkedIn are ever configured (spec's "free-first, first usable
// version needs no paid API" requirement).
export class ManualUrlProvider implements InvestorDiscoveryProvider {
  id = "manual_url";
  label = "Manual URL";

  async isAvailable(): Promise<boolean> {
    return true;
  }

  async healthCheck(): Promise<ProviderHealth> {
    return {
      providerId: this.id,
      available: true,
      status: "ok",
      message: "Always available. Paste a URL to fetch it through the existing generic collector.",
      checkedAt: new Date().toISOString()
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
    const response = await fetch(input.url, {
      headers: { "User-Agent": "RegeneraIntelligenceOS/0.1 (+https://regenera.bio)" },
      signal: AbortSignal.timeout(20_000)
    });
    const body = await response.text();
    return {
      url: input.url,
      fetchedAt: new Date().toISOString(),
      contentType: response.headers.get("content-type"),
      body,
      providerId: this.id
    };
  }
}
