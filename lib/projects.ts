export interface MandateCard {
  type: string;
  title: string;
  description: string;
  location: string;
  scale: string;
  stage: string;
  /** One concise sentence. No "Regenera role:" label, the field itself is the description. */
  role: string;
  /** Intent-based contact routing: investor / developer / realestate / operator. */
  path: string;
  /** Optional discreet tag shown alongside location/scale/stage, e.g. "Confidential". */
  note?: string;
}

export interface MandateCategory {
  id: "energy" | "realestate" | "waste";
  label: string;
  heading: string;
  intro: string;
  cards: MandateCard[];
}

// Selected Mandates: actual current or recent Regenera engagements only.
// Capital Partnerships is not a standalone category here, there are no
// capital-only mandates distinct from the project mandates below, capital
// work is folded into each card's role description instead, per explicit
// instruction not to force a filter without real standalone content behind
// it. See CLAUDE.md for the full record of this decision.
export const MANDATE_CATEGORIES: MandateCategory[] = [
  {
    id: "energy",
    label: "Energy",
    heading: "Renewable energy in development.",
    intro: "Selected utility-scale and distributed-energy mandates across international markets, spanning development, readiness, and capital partnerships.",
    cards: [
      {
        type: "Utility-Scale Solar",
        title: "Sub-Saharan Africa Solar Portfolio",
        description: "A multi-market portfolio of utility-scale solar projects under development across Sub-Saharan Africa, serving grid, commercial, industrial, and institutional power demand across several national markets.",
        location: "Sub-Saharan Africa",
        scale: "2.1 GW platform pipeline",
        stage: "Development",
        role: "Project origination, development coordination, project readiness, and capital introductions.",
        path: "investor"
      },
      {
        type: "Utility-Scale Solar",
        title: "Mexico Solar Development Portfolio",
        description: "A portfolio of utility-scale solar opportunities supported by land positions and development relationships across Mexico, evaluated for interconnection, regional demand, and productive land use.",
        location: "Mexico",
        scale: "4 GW platform pipeline",
        stage: "Development",
        role: "Project origination, land and energy strategy, project readiness, and strategic partner engagement.",
        path: "investor"
      },
      {
        type: "Distributed Energy",
        title: "Distributed Solar Portfolio",
        description: "A portfolio of distributed solar projects serving commercial, industrial, institutional, and community demand across selected emerging markets, structured around local infrastructure and phased deployment.",
        location: "Africa, Latin America, Asia",
        scale: "Multi-market portfolio",
        stage: "Development",
        role: "Opportunity assessment, project aggregation, development coordination, and strategic introductions.",
        path: "investor"
      }
    ]
  },
  {
    id: "realestate",
    label: "Real Estate & Land",
    heading: "Land and real estate in development.",
    intro: "Selected land, agriculture, and real estate mandates shaped through master planning, ecological systems integration, and long-term stewardship.",
    cards: [
      {
        type: "Regenerative Development",
        title: "Destination & Mixed-Use Development",
        description: "A large-scale mixed-use destination integrating ecological restoration, hospitality, agriculture, water systems, and public space with community-oriented development on the Yucatán Peninsula.",
        location: "Yucatán Peninsula, Mexico",
        scale: "Destination master plan",
        stage: "Master planning",
        role: "Master planning, land-use strategy, design direction, and coordination across architecture, infrastructure, and agriculture.",
        path: "realestate"
      },
      {
        type: "Regenerative Land & Energy",
        title: "Regenerative Agriculture & Energy Integration",
        description: "A development concept being explored within a broader Yucatán Peninsula pipeline, combining renewable energy generation with productive agriculture, soil restoration, water stewardship, habitat, and diversified land use.",
        location: "Yucatán Peninsula, Mexico",
        scale: "Development concept",
        stage: "Agriculture + energy",
        role: "Land-use strategy, regenerative development planning, renewable-energy integration, agricultural systems planning, project structuring, and development coordination.",
        path: "realestate"
      },
      {
        type: "Urban & Built Environment",
        title: "Energy Integrated District",
        description: "A mixed-use development concept integrating on-site renewable energy, resource-efficient infrastructure, water, mobility, landscape, buildings, and public space within a coordinated district strategy.",
        location: "Yucatán Peninsula, Mexico",
        scale: "Mixed-use development concept",
        stage: "District planning",
        role: "Development strategy, land-use planning, energy and infrastructure integration, sustainability strategy, development programming, and coordination across relevant technical disciplines.",
        path: "realestate"
      },
      {
        type: "Land & Conservation",
        title: "Regenerative Land Holding",
        description: "A substantial landholding being planned for regenerative agriculture, ecological restoration, and long-term stewardship, with compatible agricultural, educational, and conservation uses under evaluation.",
        location: "Latin America",
        scale: "Land and conservation strategy",
        stage: "Planning",
        role: "Land assessment, master planning, agricultural strategy, and conservation planning.",
        path: "realestate"
      },
      {
        type: "Agriculture & Industry",
        title: "Agri Industrial Green Zone",
        description: "A regenerative economic zone integrating renewable energy, agricultural production, food processing, and logistics, connecting energy generation with productive land use and local industry.",
        location: "Africa",
        scale: "Agricultural and industrial zone",
        stage: "Development",
        role: "Master planning, land-use strategy, agriculture and food systems planning, and infrastructure coordination.",
        path: "realestate"
      }
    ]
  },
  {
    id: "waste",
    label: "Waste Infrastructure",
    heading: "Waste infrastructure in development.",
    intro: "Selected waste-to-resource mandates converting municipal, industrial, and healthcare waste streams into energy, fuels, and recovered materials.",
    cards: [
      {
        type: "Waste-to-Resource",
        title: "Global Waste-to-Resource Platform",
        description: "A multi-market waste infrastructure platform developing modular conversion opportunities around municipal, industrial, healthcare, and agricultural waste streams, with potential outputs including energy, fuels, and recovered materials.",
        location: "India, Africa, Mexico, Indonesia, Poland, Armenia, and other selected markets",
        scale: "Modular waste conversion platform",
        stage: "Development and origination",
        role: "Market origination, project development, host and feedstock identification, strategic partnerships, and capital strategy.",
        path: "operator"
      },
      {
        type: "Distributed Waste Infrastructure",
        title: "India Waste-to-Resource Development",
        description: "Development of modular waste-conversion opportunities in India, including healthcare and municipal-scale applications, structured around local feedstock, site conditions, operating partners, and deployment requirements.",
        location: "India",
        scale: "Distributed and municipal applications",
        stage: "Early development",
        role: "Market development, local partner coordination, deployment strategy, and capital engagement.",
        path: "operator"
      },
      {
        type: "Healthcare Waste",
        title: "African Healthcare Waste-to-Resource Opportunity",
        description: "An institutional waste-conversion opportunity focused on healthcare waste, secure handling, and productive energy recovery for hospital, clinic, and related medical infrastructure across the region.",
        location: "Sub-Saharan Africa",
        scale: "Institutional infrastructure",
        stage: "Early development",
        role: "Opportunity development, strategic partner engagement, project positioning, and capital coordination.",
        path: "operator"
      }
    ]
  }
];

export function getMandateCategory(id: string): MandateCategory | undefined {
  return MANDATE_CATEGORIES.find((c) => c.id === id);
}
