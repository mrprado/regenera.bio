export type PracticeSlug =
  | "advisory"
  | "capital-partnerships"
  | "project-readiness"
  | "development"
  | "asset-strategy"
  | "intelligence";

export interface PracticeCta {
  label: string;
  href: string;
}

export interface PracticeScopeItem {
  key: string;
  body: string;
}

export interface Practice {
  slug: PracticeSlug;
  /** Value stored in the CRM's opportunities.service column. */
  serviceValue: string;
  /** Tab label and page heading. Exact wording, exact order, do not vary. */
  title: string;
  deck: string;
  /** Optional standalone statement rendered as a short pull line. */
  pullLine?: string;
  note?: string;
  scope: PracticeScopeItem[];
  ctas: PracticeCta[];
}

// Six practices, in this exact order. What Regenera does for clients, as
// distinct from Sectors (where Regenera works, lib/sectors.ts). Do not
// collapse the two, and do not change these titles without a technical
// reason.
export const PRACTICES: Practice[] = [
  {
    slug: "advisory",
    serviceValue: "advisory",
    title: "Advisory",
    deck: "Advisory is where a project, asset, or opportunity gets understood before anyone decides what to do about it. Land, resources, infrastructure, institutions, and capital context, assessed together rather than one variable at a time.",
    note: "Most engagements start here. What follows, readiness work, development support, a capital conversation, depends on what the diagnosis actually finds.",
    scope: [
      { key: "Systems diagnosis", body: "What a site, project, or opportunity depends on, what constrains it, and where the real leverage sits." },
      { key: "Strategy and scenarios", body: "Development scenarios and commercial strategy built from that diagnosis, not from a template applied regardless of place." },
      { key: "Risk and context", body: "Constraint analysis, stakeholder context, and institutional context, brought in early rather than discovered midway through a deal." }
    ],
    ctas: [{ label: "Discuss an Opportunity", href: "/contact?path=general&service=advisory" }]
  },
  {
    slug: "capital-partnerships",
    serviceValue: "capital_partnerships",
    title: "Capital Partnerships",
    deck: "Financing pathways, capital readiness, and relationships with the investors, lenders, and partners a specific project actually needs, not a list of contacts run on repeat.",
    pullLine: "The right capital, in the right place, on the right terms.",
    note: "Regenera advises on capital strategy and makes introductions where mandate and fit genuinely align. Investment decisions remain the investor's; Regenera does not manage investor assets or act as a broker-dealer.",
    scope: [
      { key: "Capital strategy", body: "Financing-pathway analysis and capital readiness review, so outreach starts once a project or portfolio can actually withstand it." },
      { key: "Mandate matching", body: "Investor and capital universe development, matched against real mandates: sector, geography, stage, and structure." },
      { key: "Counterparty development", body: "Relationships with lenders, EPCs, operators, and public-sector counterparties, built alongside the capital conversation, not after it." }
    ],
    ctas: [
      { label: "Discuss Your Mandate", href: "/for-investors?service=capital_partnerships" },
      { label: "Submit a Project", href: "/for-developers?service=capital_partnerships" }
    ]
  },
  {
    slug: "project-readiness",
    serviceValue: "project_readiness",
    title: "Project Readiness",
    deck: "Viable projects stall for fixable reasons: incomplete documentation, an unresolved site or grid constraint, a data room that isn't ready for the counterparty reviewing it. This practice finds those gaps and closes them.",
    note: "The Project Readiness Diagnostic is the productized entry point into this practice.",
    scope: [
      { key: "Diagnostics", body: "Development-gap analysis and readiness scoring against what capital and delivery partners actually require." },
      { key: "Diligence preparation", body: "Land and site diligence, permitting readiness, technical coordination, and a risk register with real sequencing behind it." },
      { key: "Positioning", body: "Financial-model coordination and data-room preparation, so the project is legible to the institutions it needs to reach." }
    ],
    ctas: [
      { label: "Request a Project Readiness Diagnostic", href: "/diagnostics/project-readiness-diagnostic" },
      { label: "Submit a Project", href: "/for-developers?service=project_readiness" }
    ]
  },
  {
    slug: "development",
    serviceValue: "development",
    title: "Development",
    deck: "Moving a project from opportunity toward execution: permitting pathways, grid and utility coordination, procurement, and the sequencing that keeps a development on schedule.",
    note: "Engineers, EPC firms, environmental specialists, and legal counsel remain responsible for their own conclusions and deliverables. Regenera's role is coordination, sequencing, and development strategy.",
    scope: [
      { key: "Development coordination", body: "Feasibility work, land advancement, and infrastructure coordination, carried through to an actual execution plan." },
      { key: "Technical and EPC coordination", body: "Owner-side coordination across engineering, EPC, and technical partners, on the client's side of the table." },
      { key: "Offtake and delivery", body: "Offtake strategy and delivery coordination through to the handoff point a specific project actually needs." }
    ],
    ctas: [{ label: "Advance a Project", href: "/for-developers?service=development" }]
  },
  {
    slug: "asset-strategy",
    serviceValue: "asset_strategy",
    title: "Asset Strategy",
    deck: "For an asset, site, landholding, or portfolio already in hand: what would actually make it perform better, and in what order.",
    scope: [
      { key: "Portfolio assessment", body: "Land-use strategy, development potential, and highest-and-best-use analysis where it genuinely clarifies the decision." },
      { key: "Repositioning", body: "Adaptive reuse, infrastructure upgrades, and resource optimization for assets that have outgrown their original use." },
      { key: "Long-term value", body: "Capital-improvement strategy and portfolio prioritization built around durability, not a single exit event." }
    ],
    ctas: [
      { label: "Assess My Land", href: "/for-landowners?service=asset_strategy" },
      { label: "Discuss Your Site", href: "/for-operators?service=asset_strategy" }
    ]
  },
  {
    slug: "intelligence",
    serviceValue: "intelligence",
    title: "Intelligence",
    deck: "Earth observation, remote sensing, and environmental data, brought into a decision only where better information actually changes it.",
    note: "Regenera coordinates and interprets this data through specialist technical and data partners. It does not operate proprietary Earth-observation infrastructure.",
    scope: [
      { key: "Environmental intelligence", body: "Land-use and water indicators, vegetation monitoring, and environmental risk, coordinated with the specialists who produce them." },
      { key: "Asset verification", body: "Infrastructure monitoring and performance indicators, applied to an existing asset or a live diligence process." },
      { key: "Decision support", body: "Monitoring built around what a client actually needs to track, not a standing dashboard nobody reads." }
    ],
    ctas: [
      { label: "Discuss an Intelligence Need", href: "/contact?path=general&service=intelligence" },
      { label: "Explore Environmental Intelligence", href: "/sectors/orbital-environmental-intelligence" }
    ]
  }
];

export function getPractice(slug: string): Practice | undefined {
  return PRACTICES.find((p) => p.slug === slug);
}

// Concise, commercially believable engagement types shown below the six
// practices. Not a menu of every possible deliverable, just what a client
// can point to and say "that's what I want."
export const TYPICAL_ENGAGEMENTS = [
  { title: "Strategic Advisory Mandate", practice: "advisory" as PracticeSlug },
  { title: "Capital Strategy Mandate", practice: "capital-partnerships" as PracticeSlug },
  { title: "Project Readiness Diagnostic", practice: "project-readiness" as PracticeSlug },
  { title: "Land and Systems Diagnostic", practice: "asset-strategy" as PracticeSlug },
  { title: "Development Advisory", practice: "development" as PracticeSlug },
  { title: "Asset Review", practice: "asset-strategy" as PracticeSlug },
  { title: "Environmental Intelligence Review", practice: "intelligence" as PracticeSlug }
];
