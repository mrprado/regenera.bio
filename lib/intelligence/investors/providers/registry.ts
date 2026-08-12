import { AgentReachExaProvider } from "./agentReach/exa";
import { AgentReachLinkedInProvider } from "./agentReach/linkedin";
import { JinaReaderProvider } from "./jinaReader";
import { ManualUrlProvider } from "./manualUrl";
import type { InvestorDiscoveryProvider, ProviderHealth } from "./types";

// Single place the rest of the application asks "which providers exist
// and are any of them usable right now" -- the UI's connector-health view
// and the discovery-job runner both go through this, never construct an
// adapter directly, so adding a provider is a one-line change here.
const providers: InvestorDiscoveryProvider[] = [new ManualUrlProvider(), new JinaReaderProvider(), new AgentReachExaProvider(), new AgentReachLinkedInProvider()];

export function listProviders(): InvestorDiscoveryProvider[] {
  return providers;
}

export function getProvider(id: string): InvestorDiscoveryProvider | undefined {
  return providers.find((p) => p.id === id);
}

export async function checkAllProviderHealth(): Promise<ProviderHealth[]> {
  return Promise.all(providers.map((p) => p.healthCheck()));
}
