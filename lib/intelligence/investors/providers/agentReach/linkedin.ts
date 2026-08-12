import { notConfiguredHealth, runAgentReachDoctor } from "./shared";
import { ProviderAccessError } from "../types";
import type { DiscoveryResult, InvestorDiscoveryProvider, OrganizationSearchInput, PeopleSearchInput, ProfileFetchInput, ProviderHealth, RawSource, WebSearchInput } from "../types";

const CHANNEL = "linkedin";

// LinkedIn contact intelligence, routed through Agent Reach's LinkedIn MCP
// channel. This is the highest-risk connector in the module -- read
// docs/intelligence-system/INVESTOR_INTELLIGENCE.md "LinkedIn connector
// boundaries" before touching this file.
//
// Hard rules encoded here, not just documented:
//   - Never implements CAPTCHA bypass, access-control circumvention,
//     account/proxy rotation, fingerprint evasion, cookie theft, credential
//     extraction, automatic login/connection requests, or automated
//     messages. There is no code path in this file that could do any of
//     those things.
//   - On any auth failure / rate limit / access challenge / explicit
//     block, the adapter throws ProviderAccessError and stops -- it never
//     retries through the failure or attempts evasion. Callers (the
//     discovery-job runner) catch this, record it, apply ordinary backoff,
//     and surface a review task, per the spec's stop-condition contract.
//   - Like the Exa adapter, this does not hardcode a guessed MCP method
//     name for the actual search/fetch calls -- that has to come from
//     inspecting the real installed tool's schema once Agent Reach and its
//     LinkedIn channel are actually configured, not assumed in advance.
export class AgentReachLinkedInProvider implements InvestorDiscoveryProvider {
  id = "agent_reach_linkedin";
  label = "LinkedIn (via Agent Reach)";

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
      message:
        'Agent Reach reports a "linkedin" channel available, but this adapter has not been wired to a confirmed call schema yet. Given the legal/ToS sensitivity of LinkedIn access, this requires deliberate review of the installed MCP schema and explicit sign-off before enabling, not just a working connection.',
      checkedAt: new Date().toISOString()
    };
  }

  async searchOrganizations(_input: OrganizationSearchInput): Promise<DiscoveryResult[]> {
    throw new ProviderAccessError(this.id, "auth_failed", "AgentReachLinkedInProvider is not yet wired to a confirmed Agent Reach LinkedIn schema.");
  }

  async searchPeople(_input: PeopleSearchInput): Promise<DiscoveryResult[]> {
    throw new ProviderAccessError(this.id, "auth_failed", "AgentReachLinkedInProvider is not yet wired to a confirmed Agent Reach LinkedIn schema.");
  }

  async searchWeb(_input: WebSearchInput): Promise<DiscoveryResult[]> {
    return [];
  }

  async fetchProfile(_input: ProfileFetchInput): Promise<RawSource> {
    throw new ProviderAccessError(this.id, "auth_failed", "AgentReachLinkedInProvider is not yet wired to a confirmed Agent Reach LinkedIn schema.");
  }
}
