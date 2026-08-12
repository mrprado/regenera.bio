import { notConfiguredHealth, runAgentReachDoctor } from "./shared";
import type { DiscoveryResult, InvestorDiscoveryProvider, OrganizationSearchInput, PeopleSearchInput, ProfileFetchInput, ProviderHealth, RawSource, WebSearchInput } from "../types";

const CHANNEL = "exa";

// Exa semantic search, routed through Agent Reach. Not installed in this
// environment as of this build -- see docs/intelligence-system/
// INVESTOR_INTELLIGENCE.md "Agent Reach installation" for why this
// application does not install it automatically (system-level install,
// a real decision for whoever operates this deployment) and exactly what
// to run to enable it.
//
// Deliberately does not hardcode a guessed CLI invocation for the search
// itself: once `agent-reach doctor --json` reports the "exa" channel
// available, the actual call contract needs to be read from the installed
// tool's own schema (the spec's explicit instruction), not assumed here
// ahead of time. Until that inspection happens, this adapter reports
// itself unavailable even if the binary is present, rather than silently
// returning fabricated or empty results that look like a real search.
export class AgentReachExaProvider implements InvestorDiscoveryProvider {
  id = "agent_reach_exa";
  label = "Exa (via Agent Reach)";

  async isAvailable(): Promise<boolean> {
    const doctor = await runAgentReachDoctor();
    return Boolean(doctor.installed && doctor.channels?.[CHANNEL]?.available);
  }

  async healthCheck(): Promise<ProviderHealth> {
    const doctor = await runAgentReachDoctor();
    if (!doctor.installed) {
      return notConfiguredHealth(this.id, CHANNEL);
    }
    const channel = doctor.channels?.[CHANNEL];
    if (!channel?.available) {
      return notConfiguredHealth(this.id, CHANNEL);
    }
    return {
      providerId: this.id,
      available: false,
      status: "not_configured",
      message: 'Agent Reach reports the "exa" channel available, but this adapter has not been wired to a confirmed call schema yet -- run `agent-reach doctor --json` and inspect its exa channel contract before enabling.',
      checkedAt: new Date().toISOString()
    };
  }

  async searchOrganizations(_input: OrganizationSearchInput): Promise<DiscoveryResult[]> {
    throw new Error("AgentReachExaProvider is not yet wired to a confirmed Agent Reach call schema. See healthCheck().setupInstructions.");
  }

  async searchPeople(_input: PeopleSearchInput): Promise<DiscoveryResult[]> {
    throw new Error("AgentReachExaProvider is not yet wired to a confirmed Agent Reach call schema. See healthCheck().setupInstructions.");
  }

  async searchWeb(_input: WebSearchInput): Promise<DiscoveryResult[]> {
    throw new Error("AgentReachExaProvider is not yet wired to a confirmed Agent Reach call schema. See healthCheck().setupInstructions.");
  }

  async fetchProfile(_input: ProfileFetchInput): Promise<RawSource> {
    throw new Error("AgentReachExaProvider is not yet wired to a confirmed Agent Reach call schema. See healthCheck().setupInstructions.");
  }
}
