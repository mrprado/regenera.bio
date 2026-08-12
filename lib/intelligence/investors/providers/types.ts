// Provider abstraction for investor discovery. Deliberately narrow: a
// provider finds candidate organizations/people and hands back raw
// material (URLs, snippets, or a fetched profile), it never writes to the
// database and never decides anything -- that happens in
// lib/intelligence/investors/{queryGenerator,scoring,extract}.ts and the
// existing generic collector, same "collect once, reason many times"
// division of labor as the rest of the Intelligence OS.
//
// Every adapter must degrade to isAvailable() === false rather than throw
// when its dependency (an installed CLI, an API key) is missing --
// callers render that state, they never crash on it.

export interface ProviderHealth {
  providerId: string;
  available: boolean;
  status: "ok" | "not_configured" | "rate_limited" | "auth_failed" | "access_challenge" | "error";
  message: string;
  checkedAt: string;
  setupInstructions?: string;
}

export interface OrganizationSearchInput {
  investorUniverse?: string;
  sector?: string;
  geography?: string;
  queryText: string;
  limit?: number;
}

export interface PeopleSearchInput {
  organizationName?: string;
  organizationDomain?: string;
  titleKeywords?: string[];
  queryText: string;
  limit?: number;
}

export interface ProfileFetchInput {
  url: string;
}

export interface WebSearchInput {
  queryText: string;
  limit?: number;
}

export interface DiscoveryResult {
  resultType: "organization" | "person" | "web_page";
  title: string;
  url: string;
  snippet?: string;
  providerId: string;
  rawPayload?: Record<string, unknown>;
}

export interface RawSource {
  url: string;
  fetchedAt: string;
  contentType: string | null;
  body: string;
  providerId: string;
}

export interface InvestorDiscoveryProvider {
  id: string;
  label: string;
  isAvailable(): Promise<boolean>;
  healthCheck(): Promise<ProviderHealth>;
  searchOrganizations(input: OrganizationSearchInput): Promise<DiscoveryResult[]>;
  searchPeople(input: PeopleSearchInput): Promise<DiscoveryResult[]>;
  fetchProfile(input: ProfileFetchInput): Promise<RawSource>;
  searchWeb(input: WebSearchInput): Promise<DiscoveryResult[]>;
}

// Thrown by an adapter when the *platform itself* stops the request
// (auth failure, rate limit, access challenge, explicit block). Callers
// must catch this, stop that connector, and surface a review task --
// never retry through it or attempt any evasion. This is the mechanical
// enforcement of the LinkedIn boundary rules in
// docs/intelligence-system/INVESTOR_INTELLIGENCE.md.
export class ProviderAccessError extends Error {
  constructor(
    public providerId: string,
    public reason: "rate_limited" | "auth_failed" | "access_challenge",
    message: string
  ) {
    super(message);
    this.name = "ProviderAccessError";
  }
}
