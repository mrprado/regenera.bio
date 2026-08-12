import type { OrganizationInvestorUniverse } from "./types";

// Turns a project_investment_mandates row into a bounded set of search
// queries across the seven query families the spec defines. Pure and
// deterministic (no network, no LLM) so it's cheap to preview in the
// discovery workbench before spending any provider quota running them,
// and easy to unit test.

export interface MandateQueryInput {
  name: string;
  sectors: string[];
  geographies: string[];
  projectStage?: string | null;
  capitalTypes: string[];
  investmentStructures: string[];
  impactThemes: string[];
  regenerativeFunctions: string[];
}

export interface GeneratedQuery {
  queryFamily: "mandate" | "portfolio" | "transaction" | "fund_activity" | "personnel" | "accredited_individual" | "comparable_project";
  queryText: string;
  investorUniverse?: OrganizationInvestorUniverse | "accredited_individual";
}

// Per-universe title/role fragments used by personnel queries (spec's
// "CONTACT ROLES" title lists, kept short and representative rather than
// exhaustive -- a query engine wants a handful of high-signal phrases,
// not the full taxonomy pasted in).
const UNIVERSE_TITLES: Record<OrganizationInvestorUniverse, string[]> = {
  family_office: ["Chief Investment Officer", "Director of Direct Investments", "Head of Private Markets"],
  strategic_capital: ["Head of Strategic Investments", "Director of Corporate Development", "Head of New Ventures"],
  infrastructure_fund: ["Head of Infrastructure", "Investment Director", "Head of Sustainable Infrastructure"],
  private_equity: ["Partner", "Managing Director", "Vice President"],
  institutional_investor: ["Chief Investment Officer", "Portfolio Manager", "Director of Real Assets"],
  dfi_multilateral: ["Principal Investment Officer", "Senior Investment Officer", "Regional Investment Lead"],
  foundation_catalytic: ["Mission Investments Director", "Program-Related Investments Director", "Catalytic Capital Director"],
  investment_network: ["Syndicate Lead", "Network Director"],
  retail_channel: ["Head of Investor Relations", "Platform Director"]
};

const UNIVERSE_LABELS: Record<OrganizationInvestorUniverse, string> = {
  family_office: "family office",
  strategic_capital: "corporate strategic investor",
  infrastructure_fund: "infrastructure fund",
  private_equity: "private equity",
  institutional_investor: "institutional investor",
  dfi_multilateral: "development finance institution",
  foundation_catalytic: "catalytic capital",
  investment_network: "investor network",
  retail_channel: "regulated investment platform"
};

const ORGANIZATION_UNIVERSES = Object.keys(UNIVERSE_LABELS) as OrganizationInvestorUniverse[];

function dedupe(queries: GeneratedQuery[]): GeneratedQuery[] {
  const seen = new Set<string>();
  return queries.filter((q) => {
    const key = q.queryText.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export function generateDiscoveryQueries(mandate: MandateQueryInput, opts: { universes?: OrganizationInvestorUniverse[]; maxPerFamily?: number } = {}): GeneratedQuery[] {
  const universes = opts.universes && opts.universes.length > 0 ? opts.universes : ORGANIZATION_UNIVERSES;
  const maxPerFamily = opts.maxPerFamily ?? 12;
  const sectors = mandate.sectors.length > 0 ? mandate.sectors : [""];
  const geographies = mandate.geographies.length > 0 ? mandate.geographies : [""];

  const queries: GeneratedQuery[] = [];

  // Mandate queries: universe + sector + geography.
  for (const universe of universes) {
    for (const sector of sectors) {
      for (const geography of geographies) {
        const parts = ["\"investment mandate\"", sector, UNIVERSE_LABELS[universe], geography].filter(Boolean);
        queries.push({ queryFamily: "mandate", queryText: parts.join(" "), investorUniverse: universe });
      }
    }
  }

  // Portfolio queries: "portfolio" + sector, one per universe.
  for (const universe of universes) {
    for (const sector of sectors) {
      queries.push({ queryFamily: "portfolio", queryText: ["portfolio", sector, UNIVERSE_LABELS[universe]].filter(Boolean).join(" "), investorUniverse: universe });
    }
  }

  // Transaction queries: "invested in" / "co-invested" + sector + geography.
  for (const sector of sectors) {
    for (const geography of geographies) {
      queries.push({ queryFamily: "transaction", queryText: ["\"invested in\"", sector, geography].filter(Boolean).join(" ") });
      queries.push({ queryFamily: "transaction", queryText: ["\"co-invested\"", sector, geography].filter(Boolean).join(" ") });
    }
  }

  // Fund activity queries: "fund closed" / "new fund" / "currently investing" + sector.
  for (const sector of sectors) {
    queries.push({ queryFamily: "fund_activity", queryText: `"fund closed" ${sector}`.trim() });
    queries.push({ queryFamily: "fund_activity", queryText: `"new fund" ${sector}`.trim() });
    queries.push({ queryFamily: "fund_activity", queryText: `"currently investing" ${sector}`.trim() });
  }

  // Personnel queries: role title + universe, one representative title
  // per universe to keep this bounded.
  for (const universe of universes) {
    const title = UNIVERSE_TITLES[universe][0];
    for (const sector of sectors) {
      queries.push({ queryFamily: "personnel", queryText: `"${title}" ${UNIVERSE_LABELS[universe]} ${sector}`.trim(), investorUniverse: universe });
    }
  }

  // Accredited-individual queries: a fixed, spec-derived set, scoped by
  // sector when one is given.
  const accreditedTemplates = ["angel investor", "founder exit investor", "private investor", "syndicate lead", "former CEO impact investor"];
  for (const template of accreditedTemplates) {
    for (const sector of sectors) {
      queries.push({ queryFamily: "accredited_individual", queryText: `${template} ${sector}`.trim(), investorUniverse: "accredited_individual" });
    }
  }

  // Comparable-project queries: highest-priority family per the spec --
  // find projects like this one, then look for their investors/co-
  // investors/sponsors/board members.
  for (const sector of sectors) {
    for (const geography of geographies) {
      const base = ["similar", sector, "project", geography].filter(Boolean).join(" ");
      queries.push({ queryFamily: "comparable_project", queryText: `${base} investors` });
      queries.push({ queryFamily: "comparable_project", queryText: `${base} co-investors` });
      queries.push({ queryFamily: "comparable_project", queryText: `${base} sponsor board members` });
    }
  }

  // Cap each family independently so a mandate with many sectors/
  // geographies doesn't silently blow the discovery workbench's budget.
  const byFamily = new Map<string, GeneratedQuery[]>();
  for (const q of dedupe(queries)) {
    const list = byFamily.get(q.queryFamily) ?? [];
    if (list.length < maxPerFamily) {
      list.push(q);
      byFamily.set(q.queryFamily, list);
    }
  }

  return Array.from(byFamily.values()).flat();
}
