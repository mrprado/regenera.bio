import type { CategoryName } from "./fieldNotesTaxonomy";

export interface Sector {
  slug: string;
  name: string;
  deck: string;
  scope: string[];
  why: string;
  /** Field Notes category (a separate taxonomy, see CLAUDE.md) used to
   *  surface a relevant Field Note on this sector's page. */
  fieldNotesCategory: CategoryName;
}

// Twelve sectors, distinct from the Field Notes 8-category taxonomy
// (lib/fieldNotesTaxonomy.ts). Energy/Waste kept separate, Land/Regenerative
// Agriculture/Food Systems kept separate, per explicit instruction. Source:
// Master Operating Blueprint, sections 11 and 28.
export const SECTORS: Sector[] = [
  {
    slug: "energy",
    name: "Energy",
    deck: "Generation, storage, grids, and the interconnection queues that increasingly decide where and when a project can actually deliver power.",
    scope: [
      "Generation, storage, and distributed systems",
      "Grids, transmission, and interconnection",
      "Industrial energy and fuels",
      "Development sequencing and delivery"
    ],
    why: "Energy availability, not capital or land alone, is increasingly the constraint that determines where a project can locate and how fast it can move from permitted to producing. We evaluate a project's energy position, generation, storage, grid access, and interconnection timeline, as a development variable in its own right, not an afterthought to the technology choice.",
    fieldNotesCategory: "Energy"
  },
  {
    slug: "waste-circular-infrastructure",
    name: "Waste & Circular Infrastructure",
    deck: "Collection, feedstock, treatment, and the recovery infrastructure that turns a disposal cost into a resource stream.",
    scope: [
      "Collection, feedstock, and logistics",
      "Treatment and resource recovery",
      "Recycling and material conversion",
      "Circular industrial recovery systems"
    ],
    why: "Waste and material recovery infrastructure sits at the intersection of regulation, feedstock economics, and energy markets, a project can look identical on paper and perform very differently depending on feedstock reliability and offtake structure. We assess the full chain from collection through conversion to understand where a project's real risk and real value sit.",
    fieldNotesCategory: "Waste & Circular Materials"
  },
  {
    slug: "water",
    name: "Water",
    deck: "Groundwater, watersheds, reuse, and desalination, evaluated as a development constraint and an underwriting variable, not a permitting formality.",
    scope: [
      "Groundwater and watershed context",
      "Municipal and industrial water",
      "Reuse, irrigation, and wastewater",
      "Desalination and water infrastructure"
    ],
    why: "Water security increasingly determines whether a project, agricultural, industrial, or residential, can actually operate at its intended scale over its intended lifetime. We treat water availability and quality as a core development and diligence variable, evaluated alongside energy and land rather than assumed as a solved input.",
    fieldNotesCategory: "Water Systems"
  },
  {
    slug: "land",
    name: "Land",
    deck: "Site selection, title, zoning, and the environmental diligence that determines what a parcel can actually support before a single-use commitment is made.",
    scope: [
      "Site selection and land suitability",
      "Title, control, and zoning",
      "Environmental diligence",
      "Resource access and carrying capacity"
    ],
    why: "A landowner or developer often has multiple plausible development theses for the same property and no integrated way to compare them. We evaluate the land, water, access, energy, ecology, market context, infrastructure, and capital implications together, before a site commits to a single use it may not be the best fit for.",
    fieldNotesCategory: "Land & Regenerative Agriculture"
  },
  {
    slug: "regenerative-agriculture",
    name: "Regenerative Agriculture",
    deck: "Soil function, farm economics, and the transition finance that determines whether a regenerative practice change is commercially durable, not just ecologically sound.",
    scope: [
      "Soil, farmland, and agroforestry",
      "Grazing and crop systems",
      "Farm economics and biological inputs",
      "Farm water/energy use and transition finance"
    ],
    why: "A practice change that improves soil function but breaks farm economics does not survive contact with a real operating budget. We evaluate regenerative agricultural strategies against both ends of that equation, the specific soil, water, or biodiversity function being strengthened, and the commercial viability of maintaining the practice, see our sitewide Regenerative Claims Standard for how we hold this discipline consistently.",
    fieldNotesCategory: "Land & Regenerative Agriculture"
  },
  {
    slug: "food-systems",
    name: "Food Systems",
    deck: "Processing, cold chain, and aggregation, the physical infrastructure that determines whether a local sourcing relationship can actually scale.",
    scope: [
      "Processing, storage, and cold chain",
      "Aggregation and logistics",
      "Procurement and ingredient systems",
      "Regional food infrastructure"
    ],
    why: "A regional food system's constraint is rarely growers or buyers alone, it is usually the processing, cold chain, and aggregation capacity that sits between them. We look at food systems as physical infrastructure problems first, market-access problems second, since the second rarely resolves without the first.",
    fieldNotesCategory: "Food Systems & Community Health"
  },
  {
    slug: "real-estate-built-environment",
    name: "Real Estate & Built Environment",
    deck: "Master planning, district systems, and adaptive reuse, evaluated for long-term asset performance, not just delivery cost.",
    scope: [
      "Master planning and districts",
      "Adaptive reuse and resilient development",
      "District-level infrastructure planning",
      "Long-term asset performance"
    ],
    why: "A building or district's performance over decades depends on decisions made at the planning stage, energy strategy, water strategy, material choice, infrastructure integration, that are often made in isolation from each other. We evaluate real estate and built-environment projects as integrated systems, not a stack of separately optimized decisions.",
    fieldNotesCategory: "Real Estate & Built Environment"
  },
  {
    slug: "materials-critical-resources",
    name: "Materials & Critical Resources",
    deck: "The material and resource systems underlying infrastructure, development, energy, and emerging orbital economies, from construction materials to critical minerals and circular recovery.",
    scope: [
      "Critical-mineral supply chains",
      "Mining and resource context",
      "Processing and refining infrastructure",
      "Materials sourcing, substitution, and circular recovery",
      "Embodied carbon and resource security",
      "Industrial and aerospace resource dependencies"
    ],
    why: "Mineral availability, processing capacity, and supply-chain concentration increasingly change project economics and development risk well before a project's own technical work would surface them. Our purpose here is not to become a mining consultancy, it is to understand where material and resource constraints materially affect a project's cost, timeline, or resilience, and to coordinate with qualified geology, mining, and materials specialists where a technical conclusion is required.",
    fieldNotesCategory: "Capital Markets & Real Assets"
  },
  {
    slug: "mobility-infrastructure",
    name: "Mobility & Infrastructure",
    deck: "Roads, ports, corridors, and EV infrastructure, evaluated as the connective tissue that determines whether a project's inputs and outputs can actually move.",
    scope: [
      "Roads, rail, and ports",
      "Logistics infrastructure",
      "EV charging infrastructure",
      "Corridors and mobility-linked land use"
    ],
    why: "A project's feedstock, product, or workforce access depends on mobility infrastructure that is often outside the project's own control but material to its viability. We evaluate these dependencies explicitly, as part of a project's real operating environment rather than a background assumption.",
    fieldNotesCategory: "Real Estate & Built Environment"
  },
  {
    slug: "natural-capital-environmental-markets",
    name: "Natural Capital & Environmental Markets",
    deck: "Biodiversity, restoration, and the carbon and conservation finance instruments built on top of them, evaluated for what the underlying project actually does, not the asset class alone.",
    scope: [
      "Biodiversity and forestry",
      "Ecosystem services and restoration",
      "Carbon and biodiversity markets",
      "Conservation finance and natural infrastructure"
    ],
    why: "Carbon credits, biodiversity credits, and conservation finance instruments are financial structures, whether the underlying project genuinely strengthens an ecological function is a separate question our Regenerative Claims Standard applies with the same discipline as any other sector. We evaluate the instrument and the underlying project separately, not as one and the same.",
    fieldNotesCategory: "Capital Markets & Real Assets"
  },
  {
    slug: "community-human-health",
    name: "Community & Human Health",
    deck: "Environmental health, infrastructure access, and the rural economic capacity that determines whether a project's local benefits are durable or temporary.",
    scope: [
      "Environmental and public health",
      "Infrastructure access",
      "Rural economies and livelihoods",
      "Community resilience"
    ],
    why: "Projects that affect energy, water, waste, or food infrastructure also affect the communities that depend on that infrastructure, directly and measurably, not as a secondary consideration. We evaluate community and public-health effects as a real system dependency, alongside the technical and commercial ones, not as a communications exercise layered on afterward.",
    fieldNotesCategory: "Food Systems & Community Health"
  },
  {
    slug: "orbital-environmental-intelligence",
    name: "Orbital & Environmental Intelligence",
    deck: "Earth observation and environmental intelligence that improves diligence and asset decisions, and the physical, terrestrial systems that orbital infrastructure itself depends on.",
    scope: [
      "Remote sensing and Earth observation",
      "Water, agricultural, and land-use monitoring",
      "Environmental verification and MRV",
      "Satellite and ground infrastructure",
      "Launch systems, spectrum, and space sustainability",
      "Terrestrial dependencies of orbital development: land, energy, materials, communities"
    ],
    why: "We use Earth observation and environmental intelligence as an input to diligence, monitoring, and asset decisions, not as a service we operate ourselves. We also treat orbital infrastructure's terrestrial footprint, launch sites, ports, power, water, materials, and communities, as a real-asset question in its own right, distinguishing clearly between demonstrated, commercial, pilot, and speculative systems rather than presenting emerging concepts as bankable industries.",
    fieldNotesCategory: "Orbital & Environmental Intelligence"
  }
];

export function getSector(slug: string): Sector | undefined {
  return SECTORS.find((s) => s.slug === slug);
}
