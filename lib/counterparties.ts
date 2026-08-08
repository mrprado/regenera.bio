export interface Counterparty {
  slug: string;
  navLabel: string;
  headline: string;
  headlineEm: string;
  deck: string;
  whoFits: string[];
  triggers: string[];
  bestOffer: string;
  ctaLabel: string;
  ctaPath: string;
}

// Four counterparty routes. Each starts from the visitor's problem, not
// Regenera's org chart, per the Master Operating Blueprint, section 11.
export const COUNTERPARTIES: Counterparty[] = [
  {
    slug: "for-developers",
    navLabel: "For Developers",
    headline: "Move complex projects from",
    headlineEm: "opportunity to execution.",
    deck: "Energy, infrastructure, waste, real estate, and agricultural projects stall for the same handful of reasons: incomplete documentation, unresolved land or grid constraints, a fragmented team, or investor outreach that started before the project was actually ready for it.",
    whoFits: [
      "Energy, infrastructure, waste, and real estate developers",
      "Mixed-use and regenerative development sponsors",
      "Agricultural infrastructure project sponsors"
    ],
    triggers: [
      "The project is stuck and investor outreach is failing",
      "Documentation is incomplete",
      "Site, grid, permitting, or offtake constraints are unresolved",
      "The team is fragmented across too many uncoordinated workstreams",
      "You need a credible, sequenced path to execution"
    ],
    bestOffer: "The Project Readiness Diagnostic identifies what is actually missing before your project can credibly advance, a readiness score, gap analysis, risk register, documentation gaps, priority workstreams, a capital pathway, and a 90-day plan.",
    ctaLabel: "Submit a Project",
    ctaPath: "/contact?path=developer"
  },
  {
    slug: "for-investors",
    navLabel: "For Investors",
    headline: "Better context before",
    headlineEm: "capital is committed.",
    deck: "Family offices, real asset allocators, and infrastructure capital increasingly need better sourcing, diligence coordination, and development insight, not another generic deal blast. We work from your actual mandate, not a spray of unfiltered opportunities.",
    whoFits: [
      "Family offices and private investors",
      "Real asset managers and infrastructure capital",
      "Impact and natural-capital investors"
    ],
    triggers: [
      "You need better context on a market, sector, or geography before allocating",
      "Sourcing quality has been inconsistent relative to your mandate",
      "Diligence coordination across technical, legal, and commercial workstreams is a bottleneck",
      "You want selective opportunity flow, not volume"
    ],
    bestOffer: "We start with a mandate conversation, sectors, geography, stage, ticket, structure, and exclusions, before any project discussion, so that any introduction that follows is actually relevant to what you're trying to do.",
    ctaLabel: "Discuss Your Mandate",
    ctaPath: "/contact?path=investor"
  },
  {
    slug: "for-landowners",
    navLabel: "For Landowners",
    headline: "Understand what your land can",
    headlineEm: "support before deciding what to build.",
    deck: "A property often has multiple plausible futures, and committing to one before understanding the water, access, energy, ecology, market, and capital picture together is how value gets left on the table, or the wrong development thesis gets locked in.",
    whoFits: [
      "Family landowners and family offices",
      "Estates and agricultural landholders",
      "Developers holding strategic parcels"
    ],
    triggers: [
      "The highest and best use of the land isn't clear",
      "Water or infrastructure constraints complicate multiple potential uses",
      "You need a development partner but haven't committed to a use yet",
      "You want to create value without a premature single-use commitment"
    ],
    bestOffer: "The Land & Systems Diagnostic evaluates the site, water, access, energy, ecology, market context, infrastructure, and capital implications together, producing a site map, resource constraints, credible scenarios, an opportunity map, and next-step plan.",
    ctaLabel: "Assess My Land",
    ctaPath: "/contact?path=realestate"
  },
  {
    slug: "for-operators",
    navLabel: "For Operators",
    headline: "Treat the place as",
    headlineEm: "one operating system.",
    deck: "Resorts, campuses, industrial estates, and agricultural operations often run energy, water, waste, and food infrastructure as separate line items with separate vendors, when treating the place as one integrated system is usually where the real cost and resilience gains sit.",
    whoFits: [
      "Resorts, hospitality operators, and campuses",
      "Industrial estates and agricultural operations",
      "Districts and multi-asset operators"
    ],
    triggers: [
      "Energy, water, or waste costs are high and fragmented across vendors",
      "Infrastructure is fragmented rather than integrated",
      "Resilience or continuity issues are recurring",
      "Existing sustainability initiatives lack commercial integration"
    ],
    bestOffer: "The Regenerative Asset Review finds the highest-leverage interventions in an existing asset or place, a system baseline, performance constraints, an intervention map, the economic and operational implications, and a staged roadmap.",
    ctaLabel: "Discuss Your Site",
    ctaPath: "/contact?path=operator"
  }
];

export function getCounterparty(slug: string): Counterparty | undefined {
  return COUNTERPARTIES.find((c) => c.slug === slug);
}
