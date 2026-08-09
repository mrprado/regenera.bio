export interface Diagnostic {
  slug: string;
  name: string;
  question: string;
  deck: string;
  outputs: string[];
  bestFor: string;
  ctaPath: string;
}

// Four productized diagnostic engagements. No fee figures published, per
// the Master Operating Blueprint (Appendix A5): the blueprint's own
// illustrative ranges are explicitly "planning assumptions, not approved
// published pricing."
export const DIAGNOSTICS: Diagnostic[] = [
  {
    slug: "project-readiness-diagnostic",
    name: "Project Readiness Diagnostic",
    question: "What is missing before this can credibly advance?",
    deck: "For project developers and sponsors whose projects are stuck, underdocumented, or facing unresolved site, grid, permitting, or offtake constraints, before the next step should be broader investor or partner outreach.",
    outputs: [
      "Readiness score",
      "Gap analysis",
      "Risk register",
      "Documentation gaps",
      "Priority workstreams",
      "Capital pathway",
      "90-day plan"
    ],
    bestFor: "Energy, infrastructure, waste, and real estate developers with a project that isn't yet ready for the capital or partner conversation it needs.",
    ctaPath: "/for-developers?service=project_readiness"
  },
  {
    slug: "land-systems-diagnostic",
    name: "Land & Systems Diagnostic",
    question: "What can this land credibly support?",
    deck: "For landowners and developers who control a site with multiple plausible futures and no integrated view of the water, access, infrastructure, ecology, market, and capital picture together.",
    outputs: [
      "Site and system map",
      "Resource constraints",
      "Infrastructure assessment",
      "Development scenarios",
      "Opportunity map",
      "Development implications",
      "Next-step plan"
    ],
    bestFor: "Family landowners, family offices, and developers deciding what a property should become before committing to one use.",
    ctaPath: "/for-landowners?service=asset_strategy"
  },
  {
    slug: "capital-readiness-review",
    name: "Capital Readiness Review",
    question: "Should this project approach capital now?",
    deck: "For sponsors deciding whether a project's documentation, structure, and positioning are genuinely ready for institutional capital, before that outreach begins and the project's credibility is on the line.",
    outputs: [
      "Readiness gaps",
      "Financing pathway",
      "Likely counterparty types",
      "Diligence requirements",
      "Preparation sequence"
    ],
    bestFor: "Sponsors weighing whether to start capital outreach now or address specific gaps first.",
    ctaPath: "/for-developers?service=capital_partnerships"
  },
  {
    slug: "regenerative-asset-review",
    name: "Regenerative Asset Review",
    question: "Where are the highest-leverage interventions in an existing asset or place?",
    deck: "For operators, place owners, and asset managers whose existing asset has fragmented infrastructure, high or rising operating costs, or sustainability initiatives that were never commercially integrated into how the place actually runs.",
    outputs: [
      "System baseline",
      "Performance constraints",
      "Intervention map",
      "Economic and operational implications",
      "Staged roadmap"
    ],
    bestFor: "Resorts, campuses, industrial estates, and agricultural operations looking for where a coordinated intervention would create the most value.",
    ctaPath: "/for-operators?service=asset_strategy"
  }
];

export function getDiagnostic(slug: string): Diagnostic | undefined {
  return DIAGNOSTICS.find((d) => d.slug === slug);
}
