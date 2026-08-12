import { describe, expect, it } from "vitest";
import { ManualUrlProvider } from "../providers/manualUrl";
import { AgentReachExaProvider } from "../providers/agentReach/exa";
import { AgentReachLinkedInProvider } from "../providers/agentReach/linkedin";
import { checkAllProviderHealth, getProvider, listProviders } from "../providers/registry";

describe("ManualUrlProvider", () => {
  it("is always available and reports ok health", async () => {
    const provider = new ManualUrlProvider();
    expect(await provider.isAvailable()).toBe(true);
    const health = await provider.healthCheck();
    expect(health.status).toBe("ok");
  });

  it("has no search capability and returns empty arrays rather than throwing", async () => {
    const provider = new ManualUrlProvider();
    await expect(provider.searchOrganizations({ queryText: "x" })).resolves.toEqual([]);
    await expect(provider.searchPeople({ queryText: "x" })).resolves.toEqual([]);
    await expect(provider.searchWeb({ queryText: "x" })).resolves.toEqual([]);
  });
});

describe("AgentReachExaProvider / AgentReachLinkedInProvider (not installed in this environment)", () => {
  it("report unavailable rather than throwing when the agent-reach binary is missing", async () => {
    const exa = new AgentReachExaProvider();
    expect(await exa.isAvailable()).toBe(false);
    const exaHealth = await exa.healthCheck();
    expect(exaHealth.available).toBe(false);
    expect(exaHealth.status).toBe("not_configured");
    expect(exaHealth.setupInstructions).toBeTruthy();

    const linkedin = new AgentReachLinkedInProvider();
    expect(await linkedin.isAvailable()).toBe(false);
    const linkedinHealth = await linkedin.healthCheck();
    expect(linkedinHealth.available).toBe(false);
  });

  it("never resolves a search call successfully when unavailable -- it throws rather than returning fabricated results", async () => {
    const exa = new AgentReachExaProvider();
    await expect(exa.searchOrganizations({ queryText: "x" })).rejects.toThrow();
  });
});

describe("provider registry", () => {
  it("lists all four providers", () => {
    const ids = listProviders().map((p) => p.id);
    expect(ids).toEqual(["manual_url", "jina_reader", "agent_reach_exa", "agent_reach_linkedin"]);
  });

  it("getProvider returns undefined for an unknown id rather than throwing", () => {
    expect(getProvider("does_not_exist")).toBeUndefined();
  });

  it("checkAllProviderHealth resolves for every provider even when some are unconfigured", async () => {
    const health = await checkAllProviderHealth();
    expect(health).toHaveLength(4);
    expect(health.every((h) => typeof h.available === "boolean")).toBe(true);
  });
});
