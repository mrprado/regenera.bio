export interface ProjectCard {
  tag: string;
  title: string;
  summary: string;
  details: string[];
  role: string;
  path: string;
}

export interface ProjectTab {
  id: "energy" | "re" | "waste" | "capital";
  label: string;
  heading: string;
  intro: string[];
  cards: ProjectCard[];
  extraCards?: ProjectCard[];
  partnershipLabel: string;
  partnershipCopy: string;
  ctaLabel: string;
  ctaPath: string;
}

export const PROJECT_TABS: ProjectTab[] = [
  {
    id: "energy",
    label: "Energy",
    heading: "Renewable energy in development.",
    intro: [
      "Selected utility scale and distributed energy projects across international markets. Our work focuses on advancing credible opportunities through project development, strategic coordination, institutional readiness, and alignment with suitable technical and capital partners."
    ],
    cards: [
      {
        tag: "Utility Scale Solar",
        title: "Sub-Saharan Africa Solar Portfolio",
        summary:
          "A multi market portfolio of utility scale solar projects designed to serve grid, commercial, industrial, institutional, and community electricity demand across Sub-Saharan Africa. The portfolio supports reliable energy access while enabling productive industry, agricultural development, public infrastructure, employment, and long term regional resilience.",
        details: ["Sub-Saharan Africa", "2.1 GW development pipeline", "Project development"],
        role: "Project origination, development coordination, portfolio aggregation, project readiness, and strategic and capital introductions.",
        path: "investor"
      },
      {
        tag: "Utility Scale Solar",
        title: "Mexico Solar Development Portfolio",
        summary:
          "A portfolio of utility scale solar opportunities supported by substantial land positions and development relationships across Mexico. Projects are evaluated according to land suitability, interconnection potential, regional energy demand, productive land use, industrial development, and long term infrastructure value.",
        details: ["Mexico", "4 GW development pipeline", "Site origination"],
        role: "Project origination, development coordination, land and energy strategy, project readiness, and strategic partner engagement.",
        path: "investor"
      },
      {
        tag: "Distributed Energy",
        title: "Distributed Solar Portfolio",
        summary:
          "A portfolio of distributed solar projects serving commercial, industrial, institutional, and community electricity demand across selected emerging markets. Projects are structured around local energy requirements, available infrastructure, site conditions, potential offtake, and opportunities for phased deployment.",
        details: ["Africa, Latin America, Asia", "Multi market portfolio", "Portfolio development"],
        role: "Opportunity assessment, project aggregation, development coordination, project readiness, and strategic introductions.",
        path: "investor"
      }
    ],
    partnershipLabel: "Energy partnerships.",
    partnershipCopy:
      "We engage with project developers, landowners, governments, utilities, technical partners, energy users, and institutional counterparties seeking to advance renewable energy infrastructure.",
    ctaLabel: "Discuss an Energy Project",
    ctaPath: "developer"
  },
  {
    id: "re",
    label: "Real Estate",
    heading: "Regenerative places in development.",
    intro: [
      "Selected land, agriculture, and real estate opportunities shaped through regenerative master planning, mixed land use, ecological systems integration, and long term stewardship.",
      "Our work connects architecture, landscape, agriculture, energy, water, infrastructure, and community use within a coordinated development strategy."
    ],
    cards: [
      {
        tag: "Regenerative Development",
        title: "Destination & Mixed-Use Development",
        summary:
          "A large-scale regenerative tourism and mixed use development integrating ecological restoration, cultural infrastructure, hospitality, education, agriculture, water systems, public space, and community oriented economic development. The project is conceived as a living regional system in which architecture, landscape, infrastructure, ecology, and cultural identity strengthen one another.",
        details: ["Yucat\u00e1n Peninsula, Mexico", "Destination master plan", "Master planning"],
        role: "Regenerative master planning, land use strategy, design direction, ecological systems integration, development planning, and coordination across architecture, landscape, infrastructure, agriculture, culture, and community.",
        path: "realestate"
      },
      {
        tag: "Agriculture & Energy",
        title: "Regenerative Agriculture & Energy Integration",
        summary:
          "A mixed land use development model combining commercial renewable energy generation with regenerative agriculture, productive farmland, soil restoration, water stewardship, habitat, and diversified land-based income. Designed for landowners, agricultural operators, and renewable energy developers seeking to combine commercial energy generation with continued agricultural production.",
        details: ["~100 acres of working farmland", "10+ MW renewable generation", "Land use planning"],
        role: "Regenerative agricultural planning, mixed land use strategy, renewable energy integration, soil and water systems design, ecological restoration, and development coordination.",
        path: "realestate"
      },
      {
        tag: "Urban & Built Environment",
        title: "Energy Integrated District",
        summary:
          "A mixed use district designed around on site renewable generation, resource efficiency, climate responsive planning, and infrastructure capable of supporting low carbon or net zero operations. Energy, buildings, mobility, water, landscape, and public space are planned as one coordinated urban system rather than as separate development components.",
        details: ["Mixed use district", "Energy-integrated", "Master planning"],
        role: "Regenerative master planning, land use strategy, energy and infrastructure integration, development programming, sustainability frameworks, and coordination across architecture, landscape, mobility, and public space.",
        path: "realestate"
      },
      {
        tag: "Land & Conservation",
        title: "Regenerative Land Holding",
        summary:
          "A substantial landholding being planned for regenerative agriculture, ecological restoration, conservation, productive land use, and long term stewardship. The strategy is designed to strengthen the land's ecological condition while creating compatible agricultural, educational, hospitality, conservation, and community uses.",
        details: ["Latin America", "Land & conservation strategy", "Development structuring"],
        role: "Land assessment, regenerative master planning, agricultural strategy, conservation planning, ecological systems integration, development phasing, and stewardship frameworks.",
        path: "realestate"
      },
      {
        tag: "Agri Industrial Development",
        title: "Agri Industrial Green Zone",
        summary:
          "A regenerative economic zone integrating renewable energy, agricultural production, food processing, water infrastructure, logistics, and value added industry. The development connects energy generation with productive land use and local processing, strengthening food security, employment, regional industry, and community resilience.",
        details: ["Africa", "Agricultural & industrial zone", "Project development"],
        role: "Regenerative master planning, land use strategy, agriculture and food systems planning, renewable energy integration, infrastructure coordination, development strategy, and stakeholder alignment.",
        path: "realestate"
      }
    ],
    partnershipLabel: "Real estate partnerships.",
    partnershipCopy:
      "We engage with landowners, developers, agricultural operators, municipalities, architects, planners, infrastructure partners, and long term stewards seeking to develop land and real estate regeneratively.",
    ctaLabel: "Discuss a Real Estate Project",
    ctaPath: "realestate"
  },
  {
    id: "waste",
    label: "Waste",
    heading: "Waste to resource.",
    intro: [
      "Selected waste to energy and circular infrastructure opportunities designed to convert municipal, commercial, industrial, agricultural, healthcare, and institutional waste streams into usable energy, fuels, recovered materials, and long term economic value.",
      "Each project is structured around the available feedstock, local infrastructure, required outputs, and development priorities of its location."
    ],
    cards: [
      {
        tag: "Feedstock",
        title: "Waste as a Secured Resource",
        summary:
          "Waste streams are assessed according to composition, volume, consistency, contamination, logistics, disposal costs, and long term supply potential. The objective is to establish reliable feedstock arrangements that reduce disposal liabilities while supporting stable facility operations and productive resource recovery.",
        details: ["Municipal, industrial, agricultural", "Healthcare & institutional", "Supply structuring"],
        role: "Feedstock opportunity assessment, stakeholder coordination, site and market evaluation, project development, and long term supply strategy.",
        path: "operator"
      },
      {
        tag: "Conversion",
        title: "Technology Matched to the Waste Stream",
        summary:
          "Modular conversion technologies are selected and configured according to the composition of the available feedstock, required outputs, site conditions, local infrastructure, regulatory environment, and commercial objectives. The approach prioritizes systems capable of recovering value from mixed waste streams without relying on conventional mass burn incineration.",
        details: ["Modular & scalable", "Technology assessment", "Deployment planning"],
        role: "Technology-partner coordination, project configuration, commercial assessment, development strategy, and alignment between feedstock, infrastructure, and market requirements.",
        path: "operator"
      },
      {
        tag: "Outputs",
        title: "Multiple Products from One Waste Stream",
        summary:
          "Each facility is configured around the outputs most relevant to its location, available feedstock, infrastructure, and potential offtake relationships. Potential outputs include electricity, process heat, synthetic fuels and SynCrude, hydrogen pathways, recovered carbon materials, reusable industrial inputs, and environmental attributes and credits.",
        details: ["Power & heat", "Fuels & hydrogen pathways", "Recovered materials"],
        role: "Output-market assessment, offtake strategy, regional infrastructure integration, commercial coordination, and strategic partner engagement.",
        path: "operator"
      }
    ],
    extraCards: [
      {
        tag: "Deployment Model",
        title: "From Waste Opportunity to Operating Facility",
        summary:
          "Projects move through a structured development process connecting feedstock, site, technology, outputs, infrastructure, stakeholders, and capital: feedstock and site assessment, technology and output configuration, commercial and regulatory structuring, offtake and partnership development, project readiness and documentation, strategic and capital partner engagement, and deployment and operating coordination. Potential hosts include municipalities, industrial zones, healthcare systems, agricultural regions, waste operators, infrastructure developers, and private landowners.",
        details: [],
        role: "Project origination, market development, project readiness, stakeholder coordination, deployment partnerships, and strategic introductions.",
        path: "operator"
      },
      {
        tag: "Regenerative Integration",
        title: "Infrastructure Beyond Waste Disposal",
        summary:
          "Waste-conversion facilities are planned as part of wider regional systems rather than as isolated disposal assets. Recovered energy, heat, fuels, and materials can support food production, water treatment, industry, healthcare infrastructure, mobility, housing, and local economic development. The objective is not simply to divert waste from landfill, but to use waste infrastructure as an anchor for broader regenerative development.",
        details: [],
        role: "Regenerative systems planning, infrastructure integration, development coordination, resource flow design, and alignment across environmental, economic, and community priorities.",
        path: "operator"
      }
    ],
    partnershipLabel: "Waste partnerships.",
    partnershipCopy:
      "We engage with municipalities, governments, waste holders, operators, industrial groups, healthcare systems, agricultural producers, developers, technology providers, and institutional counterparties seeking to transform waste liabilities into productive infrastructure.",
    ctaLabel: "Enquire About Waste to Energy",
    ctaPath: "operator"
  },
  {
    id: "capital",
    label: "Capital Partnerships",
    heading: "Aligned capital relationships for prepared opportunities.",
    intro: [
      "Our network includes relationships with family offices, institutional investors, impact funds, and strategic capital partners interested in energy, infrastructure, natural assets, waste, and regenerative real estate.",
      "We assess opportunities for alignment across mandate, geography, scale, development stage, and project readiness, facilitating introductions where there is a credible fit between qualified counterparties."
    ],
    cards: [],
    partnershipLabel: "Present a Project to the Network.",
    partnershipCopy:
      "We consider opportunities with clear ownership, defined capital requirements, credible development pathways, and sufficient technical and commercial preparation.",
    ctaLabel: "Present a Project",
    ctaPath: "developer"
  }
];

export const DEPLOYMENT_FOCUS = [
  { title: "Municipal Waste", copy: "Regional and city scale waste conversion systems supporting landfill diversion, energy production, and improved municipal infrastructure." },
  { title: "Industrial Waste", copy: "Dedicated facilities for manufacturing, processing, logistics, and commercial waste streams." },
  { title: "Healthcare Waste", copy: "Institutional and hospital based solutions designed around secure waste handling, energy recovery, and site requirements." },
  { title: "Agricultural Waste", copy: "Conversion of agricultural residues, organic waste, and processing by products into usable energy and recovered resources." },
  { title: "Distributed Facilities", copy: "Modular systems for institutional, industrial, and geographically dispersed waste streams." },
  { title: "Regional Programs", copy: "Multi-site deployment programs structured across cities, regions, or jurisdictions." }
];

export const CAPITAL_TABLE = [
  { mandate: "Sovereign-scale", range: "$100B+", focus: "Infrastructure, energy, real assets", geo: "Global" },
  { mandate: "Institutional", range: "$10B to $80B", focus: "Energy transition, data infrastructure", geo: "Americas, EMEA, Asia" },
  { mandate: "Family office", range: "$100M to $5B", focus: "Regenerative real estate, land, impact", geo: "Global" },
  { mandate: "Impact & ESG funds", range: "$50M to $2B", focus: "Climate, community, circular economy", geo: "Global, frontier markets" }
];
