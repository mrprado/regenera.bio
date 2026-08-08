// Field Notes archive data.
//
// Taxonomy (category, lens, entryType, region) lives in
// lib/fieldNotesTaxonomy.ts. See content/field-notes/EDITORIAL_SYSTEM.md
// for the full editorial rules this data model exists to support.
//
// The taxonomy was rearchitected from an original 7-system model to the
// current 13-category model on explicit user direction (see CLAUDE.md for
// the migration rationale). Every post below, old and new, has been
// re-tagged under the new categories; body copy for the original 22 posts
// was preserved verbatim per the "don't rewrite good copy" editorial rule,
// only their metadata was migrated.
import type { CategoryName, EntryType, LensName, RegionName } from "./fieldNotesTaxonomy";

export interface FieldNoteSource {
  label: string;
  url?: string;
}

export interface FieldNote {
  slug: string;
  date: string; // publication month, e.g. "August 2026"
  updatedDate?: string;
  /** For retrospective research only: the historical period being analyzed
   *  (YYYY-MM), distinct from `date` (actual publication month). Archive
   *  browsing sorts by this when present; JSON-LD datePublished always
   *  uses `date`, never this, so publication metadata stays truthful. */
  archiveDate?: string;
  /** For retrospective research only: the specific event date (YYYY-MM-DD)
   *  being analyzed, if known precisely. */
  eventDate?: string;
  title: string;
  deck: string;
  entryType: EntryType;
  category: CategoryName;
  secondaryCategory?: CategoryName;
  lens: LensName;
  region?: RegionName;
  country?: string;
  tags?: string[];
  /** Pre-rebuild category label, kept for internal reference only. Never rendered. */
  legacyCategory?: string;
  body: string[];
  keySignal?: string;
  whyItMatters?: string;
  systemConnection?: string;
  capitalImplication?: string;
  developmentImplication?: string;
  whatWeAreWatching?: string[];
  sources?: FieldNoteSource[];
  img: string;
  imgAlt: string;
  featured?: boolean;
  metaTitle?: string;
  metaDescription?: string;
  canonicalUrl?: string;
}

export const POSTS: FieldNote[] = [
  {
    slug: "a-working-definition-and-why-precision-matters",
    date: "January 2025",
    title: "A working definition, and why precision matters",
    deck: "Sustainability and regenerative development are treated as synonyms. They describe different design briefs and different outcomes.",
    entryType: "Field Note",
    category: "Land & Regenerative Agriculture",
    lens: "Systems Design",
    legacyCategory: "Regenerative Development",
    body: ["Sustainability sets a floor: reduce harm, hold impact roughly constant. A regenerative design brief sets a different target entirely, that the completed project leaves the measurable condition of a place better than its baseline, soil organic matter, watershed yield, income diversity, not only carbon intensity. The distinction is not semantic. It changes which interventions get funded and how they get measured.", "Our practice begins every engagement with a systems diagnostic across the interacting layers that determine how a place performs, land, water, energy, food, community health, the built environment, and orbital monitoring, before any technology or capital decision is made. This archive documents that work as it happens, across the sectors and geographies where we operate."],
    img: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1f/Mangrove_forest_reforestation.jpg/1280px-Mangrove_forest_reforestation.jpg",
    imgAlt: "Mangrove forest restoration",
  },
  {
    slug: "designing-for-maximum-solar-capture-by-latitude-and-by-season",
    date: "February 2025",
    title: "Designing for maximum solar capture, by latitude and by season",
    deck: "Two sites with identical panel counts can differ in annual yield by 15 percent or more, purely on tilt, azimuth, and tracking design matched to local irradiance.",
    entryType: "Field Note",
    category: "Energy",
    lens: "Technology & Infrastructure",
    legacyCategory: "Renewable Energy",
    body: ["Fixed-tilt arrays should be set close to the site's latitude for maximum annual yield, but that default undersells sites where winter output matters most to the offtake profile: a steeper tilt trades a few points of summer yield for materially better winter capacity factor, relevant anywhere the load or the grid constraint is seasonal. Single-axis tracking adds 15 to 25 percent annual energy in high direct-normal-irradiance regions, less value in diffuse-light or high-latitude sites where the marginal gain rarely justifies the added mechanical risk and O&M cost.", "Bifacial modules add a further 5 to 15 percent depending on albedo, row spacing, and mounting height, which is why we now specify ground cover and racking geometry as a distinct design variable rather than an afterthought. None of this is exotic engineering. It is the difference between a design that clears a regional benchmark and one that quietly underperforms it for twenty-five years."],
    img: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/39/Lamerd_Photovoltaic_Power_Station.jpg/1280px-Lamerd_Photovoltaic_Power_Station.jpg",
    imgAlt: "Rows of a utility scale photovoltaic power station",
  },
  {
    slug: "agrivoltaics-and-the-economics-of-dual-land-use",
    date: "March 2025",
    title: "Agrivoltaics and the economics of dual land use",
    deck: "Treating energy and food production as competing land uses is a modeling error, not a physical constraint.",
    entryType: "Field Note",
    category: "Land & Regenerative Agriculture",
    secondaryCategory: "Energy",
    lens: "Asset Economics",
    legacyCategory: "Land & Regenerative Agriculture",
    body: ["Vertical bifacial modules spaced between crop rows generate from both faces of the panel while reducing peak heat stress and evapotranspiration at ground level, which in several documented trials has improved yield for shade-tolerant crops relative to open field, not merely preserved it. The land does not choose between an energy return and an agricultural return. Structured correctly, it produces both, and the combined income stream is materially more resilient to a single commodity price cycle than either use alone.", "For institutional land positions, this changes the underwriting question from 'energy or agriculture' to a joint optimization across row spacing, module height, crop selection, and irrigation design. That is a land use engineering problem, and it is where our agricultural and energy diligence now sit inside a single workstream rather than two."],
    img: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Solar_panels_with_sheep_in_Belgium.jpg/1280px-Solar_panels_with_sheep_in_Belgium.jpg",
    imgAlt: "Sheep grazing beneath solar panels on working land",
  },
  {
    slug: "water-security-as-a-underwriting-variable-not-a-permitting-formality",
    date: "April 2025",
    title: "Water security as an underwriting variable, not a permitting formality",
    deck: "Reservoir yield and watershed condition are as material to a project's viability as interconnection queue position, and are diligenced with a fraction of the rigor.",
    entryType: "Field Note",
    category: "Water Systems",
    lens: "Resilience & Risk",
    legacyCategory: "Water Systems",
    body: ["Competing agricultural, municipal, and industrial demand on a shared watershed can turn a fully permitted project into a stranded asset years after financial close, and the failure mode rarely shows up in a standard environmental review. We now run water security as a standing line in the systemic diagnosis phase, quantifying seasonal yield variability and upstream demand growth on the same footing as grid capacity and land tenure.", "The projects that hold up over a twenty-year horizon are the ones where water was treated as a constraint to design around from the first site screen, not a risk to disclose after the fact."],
    img: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Pantabangan_Dam_reservoir.jpg/1280px-Pantabangan_Dam_reservoir.jpg",
    imgAlt: "Reservoir and dam infrastructure",
  },
  {
    slug: "the-risk-that-lives-between-financial-close-and-energization",
    date: "May 2025",
    title: "The risk that lives between financial close and energization",
    deck: "Capital treats financial close as the finish line. Procurement, interconnection sequencing, and contractor capacity treat it as the starting point.",
    entryType: "Field Note",
    category: "Energy",
    lens: "Project Delivery",
    legacyCategory: "EPC & Project Delivery",
    body: ["The interval between financial close and commercial operation is where a well-structured deal can still fail: equipment lead times, interconnection study slippage, weather windows, and constrained EPC contractor capacity in a given region and season. Institutional capital increasingly wants this delivery risk underwritten before commitment, not discovered mid-construction.", "Project readiness work now includes a formal delivery-risk review alongside financial and legal diligence: contractor track record, procurement lead times against the interconnection timeline, and seasonal construction windows specific to the site's climate. A project that is bankable on paper still has to be buildable on a schedule that survives contact with reality."],
    img: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/Installing_Solar_Panels_%287336033672%29.jpg/1280px-Installing_Solar_Panels_%287336033672%29.jpg",
    imgAlt: "Workers installing solar panels at a utility scale site",
  },
  {
    slug: "real-assets-disclosure-and-the-eus-recalibration-of-reporting-scope",
    date: "June 2025",
    title: "Real assets, disclosure, and the EU's recalibration of reporting scope",
    deck: "Europe narrowed mandatory sustainability disclosure this year. That does not reduce what serious institutional capital expects to see.",
    entryType: "Policy Note",
    category: "Real Estate & Built Environment",
    secondaryCategory: "Capital Markets & Real Assets",
    lens: "Policy & Regulation",
    legacyCategory: "Sustainable Real Estate",
    body: ["The EU's Omnibus package, moving through Council and Parliament since February, raised the CSRD reporting threshold substantially and delayed timelines for companies not yet in scope. For real asset owners this is frequently read as a relaxation. It is closer to a reallocation: investment committees still price a building's energy, water, and material performance into underwriting, they now do it through direct diligence rather than assuming a standardized disclosure will do the work for them.", "A building that measurably reduces its own cooling load, sources power on site, and demonstrates its material and water performance without waiting for a mandatory framework will underwrite better than one relying on a compliance filing that may no longer be required for its ownership structure at all."],
    img: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Blick_vom_Ingenhoven-Tal_in_D%C3%BCsseldorf_zum_K%C3%B6-Bogen_und_Hofgarten_2.jpg/1280px-Blick_vom_Ingenhoven-Tal_in_D%C3%BCsseldorf_zum_K%C3%B6-Bogen_und_Hofgarten_2.jpg",
    imgAlt: "Green facades and public space in a city district",
  },
  {
    slug: "the-building-material-is-now-a-capital-decision",
    date: "June 2025",
    title: "The building material is now a capital decision",
    deck: "Structural material choice can account for a third of a building's lifetime carbon footprint before a single day of operation.",
    entryType: "Field Note",
    category: "Real Estate & Built Environment",
    lens: "Asset Economics",
    legacyCategory: "Materials & Embodied Carbon",
    body: ["Cement and concrete production accounts for roughly eight percent of global greenhouse gas emissions, more than any country other than the United States and China. Mass timber, principally cross-laminated and glue-laminated wood, offers a structural alternative for mid- and high-rise construction that stores carbon in the finished structure rather than releasing it during manufacture. Mjøsårnet, an 18-storey mixed use tower in Norway, demonstrates the structural case at scale: a full timber primary structure carrying residential, hotel, and office loads to 85 meters.", "For institutional developers, the relevant comparison is no longer wood against concrete in the abstract. It is embodied carbon per square meter, construction schedule, and long-run maintenance cost, evaluated site by site. On projects where local timber supply chains exist, the capital case increasingly closes on its own terms, independent of any carbon premium."],
    img: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Mj%C3%B8st%C3%A5rnet.jpg/1280px-Mj%C3%B8st%C3%A5rnet.jpg",
    imgAlt: "An 18-storey mass timber tower in Norway",
  },
  {
    slug: "why-community-integrated-facilities-move-faster-through-permitting",
    date: "July 2025",
    title: "Why community integrated facilities move faster through permitting",
    deck: "The fastest-permitted waste to energy facilities are rarely the most technically advanced. They are the ones designed to be used by the public, not merely tolerated by it.",
    entryType: "Policy Note",
    category: "Waste & Circular Materials",
    lens: "Policy & Regulation",
    legacyCategory: "Waste to Energy",
    body: ["CopenHill in Copenhagen converts municipal waste into district heat and power for tens of thousands of homes, and it does so from inside a structure the city built a public recreation slope on top of rather than screened from view. That is a siting decision with a measurable permitting consequence: facilities designed as civic infrastructure face materially less community and regulatory resistance than facilities sited purely on technical and logistical criteria.", "The lesson for our own site selection is procedural, not architectural. Waste infrastructure positioned as a shared community asset clears local approval on a faster timeline than the same facility positioned as a liability to be minimized and hidden."],
    img: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/58/Amager_Bakke_4.jpg/1280px-Amager_Bakke_4.jpg",
    imgAlt: "The CopenHill waste to energy plant, Copenhagen",
  },
  {
    slug: "what-clears-institutional-diligence-and-what-does-not",
    date: "August 2025",
    title: "What clears institutional diligence, and what does not",
    deck: "Family offices and infrastructure funds review a high volume of opportunities each year. The variable that predicts a second meeting is rarely the return projection.",
    entryType: "Field Note",
    category: "Capital Markets & Real Assets",
    secondaryCategory: "Land & Regenerative Agriculture",
    lens: "Capital & Finance",
    legacyCategory: "Capital Introduction",
    body: ["It is whether the land and offtake structure is clean, whether documentation is complete on first request, and whether the team presenting the opportunity can answer a technical question about it without deferring to someone not in the room. Return assumptions are checked, but they are rarely the reason a credible deal is declined.", "Project readiness work is, in practical terms, the systematic removal of the reasons a fundamentally sound opportunity receives a polite no. The projects that clear diligence fastest were prepared for it before an introduction was ever made."],
    img: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/db/FrankfurtOder_asv2022-07_img48_Neuberesinchen.jpg/1280px-FrankfurtOder_asv2022-07_img48_Neuberesinchen.jpg",
    imgAlt: "Aerial view of an institutional-scale solar asset",
  },
  {
    slug: "verification-from-orbit-as-a-condition-of-capital",
    date: "September 2025",
    title: "Verification from orbit as a condition of capital",
    deck: "Long-horizon land and agriculture positions increasingly require proof of environmental performance that does not depend on self-reported data.",
    entryType: "Field Note",
    category: "Orbital & Environmental Intelligence",
    secondaryCategory: "Land & Regenerative Agriculture",
    lens: "Measurement & Verification",
    legacyCategory: "Orbital & Earth Observation",
    body: ["Soil moisture, canopy cover, water level, and land use change are now measurable from orbit at asset resolution, which closes a verification gap that previously depended on periodic site visits and operator-reported figures. For land backed capital structures with ten- and twenty-year horizons, this kind of independent, repeatable measurement is moving from a differentiator to a diligence requirement.", "We treat satellite-enabled monitoring as a standing tool now, applied on any engagement where the underlying land condition is itself the asset being underwritten."],
    img: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/ISS-43_Earth_view_from_the_cupola_onboard_the_ISS.jpg/1280px-ISS-43_Earth_view_from_the_cupola_onboard_the_ISS.jpg",
    imgAlt: "Earth observed from the Cupola of the International Space Station",
  },
  {
    slug: "charging-infrastructure-is-a-land-use-and-grid-planning-decision",
    date: "October 2025",
    title: "Charging infrastructure is a land use and grid-planning decision",
    deck: "EV charging is typically scoped as a technology deployment. The siting decision behind it determines development patterns for a decade.",
    entryType: "Field Note",
    category: "Real Estate & Built Environment",
    secondaryCategory: "Energy",
    lens: "Technology & Infrastructure",
    legacyCategory: "Mobility & EV Infrastructure",
    body: ["Where charging infrastructure is placed shapes what follows it: commercial density, grid reinforcement priorities, and, in several master planned districts we have reviewed, the sequencing of adjacent housing. Treated as a standalone technology rollout, most of that downstream value is left unaccounted for in the initial business case.", "In the districts we advise on, charging infrastructure is planned alongside on site generation and storage capacity from the master plan stage, sized to the district's full build-out, not retrofitted after the buildings are complete."],
    img: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Electric_Vehicle_Charging_Station.jpg/1280px-Electric_Vehicle_Charging_Station.jpg",
    imgAlt: "Electric vehicle charging station",
  },
  {
    slug: "energy-reliability-as-a-public-health-input",
    date: "November 2025",
    title: "Energy reliability as a public health input",
    deck: "A rural health facility without dependable power is a building, not a functioning health system. Energy access sits upstream of most public health outcomes it enables.",
    entryType: "Field Note",
    category: "Food Systems & Community Health",
    secondaryCategory: "Energy",
    lens: "Resilience & Risk",
    legacyCategory: "Community & Human Health",
    body: ["Vaccine cold chain, emergency lighting, and water pumping and purification are all downstream of power that does not fail. In several of the markets where we work, the sequencing of energy infrastructure investment determines what level of public health investment becomes feasible in the years that follow, not the other way around.", "This is the clearest instance of the multiplier effect our systems diagnostic is built to find: a single power and storage installation that strengthens energy, water, and health outcomes simultaneously, rather than three separate projects competing for the same limited capital."],
    img: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/66/Solarpower_Keetmanshoop.jpg/1280px-Solarpower_Keetmanshoop.jpg",
    imgAlt: "Utility solar installation in Southern Africa",
  },
  {
    slug: "what-a-place-is-for-before-what-it-contains",
    date: "November 2025",
    title: "What a place is for, before what it contains",
    deck: "The developments that hold long term value are rarely defined first by unit count or floor area. They start from what a place has historically been, and what it is for.",
    entryType: "Field Note",
    category: "Real Estate & Built Environment",
    secondaryCategory: "Food Systems & Community Health",
    lens: "Systems Design",
    legacyCategory: "Story of Place & Wellbeing",
    body: ["A green facade cooling a city block, a district built around a lake rather than despite it, a masterplan that keeps a working farm inside its boundary rather than displacing it: these decisions are frequently framed as amenity. In underwriting terms they function differently, as retention and premium drivers, because occupants, guests, and residents measurably stay longer and pay more for developments legible as a specific place rather than an interchangeable product.", "We now include a formal cultural and landscape narrative as part of masterplanning: what this site has been, what continuity looks like, and how public space, daylight, material palette, and access to nature are sequenced through the development, not applied afterward as landscaping."],
    img: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/70/Plot_4.1_The_Timber_House_%285127222990%29.jpg/1280px-Plot_4.1_The_Timber_House_%285127222990%29.jpg",
    imgAlt: "Timber architecture designed around its place",
  },
  {
    slug: "cop30-and-the-verification-gap-in-nature-based-finance",
    date: "December 2025",
    title: "COP30 and the verification gap in nature based finance",
    deck: "COP30 closed in Belém on 22 November with an agreement to substantially increase adaptation finance for developing countries. The harder problem it did not solve is measurement.",
    entryType: "Field Note",
    category: "Capital Markets & Real Assets",
    secondaryCategory: "Orbital & Environmental Intelligence",
    lens: "Measurement & Verification",
    region: "Latin America & Caribbean",
    legacyCategory: "Carbon & Environmental Markets",
    body: ["Held for the first time in the Amazon, COP30 concluded with commitments to significantly scale climate adaptation funding and strengthen support for the clean energy transition in developing economies. What it did not resolve, and what voluntary carbon markets have struggled with for years, is the gap between a hectare of restored land and a credit an institutional buyer can actually audit: baseline measurement, ongoing monitoring, and a defensible chain of evidence.", "Satellite-enabled monitoring is closing that gap faster than policy is. It is why we treat environmental markets and earth observation as a single workstream, not two, and why any carbon or biodiversity credit we help structure carries independent verification from origination, not retrofitted before sale."],
    img: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1f/Panoramic_view_from_Sarsina_%28Emilia_Romagna%29.jpg/1280px-Panoramic_view_from_Sarsina_%28Emilia_Romagna%29.jpg",
    imgAlt: "A living regional landscape of hills, fields, and settlements",
  },
  {
    slug: "a-land-selection-framework-for-the-year-ahead",
    date: "January 2026",
    title: "A land selection framework for the year ahead",
    deck: "Heading into 2026, the constraint on new development is rarely capital availability. It is the supply of land that clears diligence on water, grid, and title simultaneously.",
    entryType: "Field Note",
    category: "Land & Regenerative Agriculture",
    lens: "Resilience & Risk",
    legacyCategory: "Land & Due Diligence",
    body: ["The land positions that move fastest to financial close pass four screens at once: secured or securable water rights, a realistic grid or interconnection path, clean and defensible title, and a land use classification that supports the intended development without a protracted rezoning process. Sites that pass three of four are common. Sites that pass all four are scarce, and scarcity is exactly why they command a premium in negotiation.", "Our origination work for 2026 is weighted toward exactly that screen: fewer sites under review, deeper diligence on each, before any capital conversation begins."],
    img: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/92/Wilferdingen_Solarpark_View_from_Niemandsberg.jpg/1280px-Wilferdingen_Solarpark_View_from_Niemandsberg.jpg",
    imgAlt: "Solar park set within working land",
  },
  {
    slug: "winds-second-act-pairing-generation-with-storage-and-industrial-load",
    date: "February 2026",
    title: "Pairing wind with storage and industrial load",
    deck: "Wind sold as raw megawatt-hours into a grid is a commodity business. Wind paired with storage and located next to an industrial or agricultural load is a different asset entirely.",
    entryType: "Field Note",
    category: "Energy",
    lens: "Asset Economics",
    legacyCategory: "Renewable Energy",
    body: ["The economics of wind assets are shifting from merchant generation toward co located storage and direct industrial or agricultural offtake, which reduces transmission loss and curtailment risk while giving the project a contracted revenue base independent of wholesale price volatility.", "We are seeing more of this structure in origination: wind and storage anchoring a wider industrial or agricultural development, rather than a standalone generation asset sold on wholesale terms alone."],
    img: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Aerial-TehachapiWindFarm.jpg/1280px-Aerial-TehachapiWindFarm.jpg",
    imgAlt: "Aerial view of a wind farm",
  },
  {
    slug: "sequencing-power-and-water-in-frontier-markets",
    date: "March 2026",
    title: "Sequencing power and water in frontier markets",
    deck: "In the frontier markets where a meaningful share of our pipeline sits, water infrastructure is rarely the first investment. It follows power, because it depends on power.",
    entryType: "Field Note",
    category: "Water Systems",
    secondaryCategory: "Energy",
    lens: "Systems Design",
    legacyCategory: "Water Systems",
    body: ["Pumping, treatment, and desalination are energy intensive processes. Reliable water access in these markets is frequently downstream of reliable power access, not a parallel track. Sequencing energy investment with this dependency explicit changes what becomes achievable for a region within a small number of years rather than a generation.", "This is why our energy origination diligence now asks a water question before a grid question: what does dependable power at this site unlock for regional water security, and is that worth designing the interconnection and capacity around from the outset."],
    img: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/Photovoltaic_power_station_near_Alofi_South.jpg/1280px-Photovoltaic_power_station_near_Alofi_South.jpg",
    imgAlt: "Distributed solar power station in a frontier market",
  },
  {
    slug: "the-interconnection-queue-not-capital-is-the-binding-constraint",
    date: "April 2026",
    title: "The interconnection queue, not capital, is the binding constraint",
    deck: "In market after market, projects with committed capital and secured land now wait years for a grid interconnection study. That queue, not financing, decides who builds first.",
    entryType: "Field Note",
    category: "Energy",
    lens: "Project Delivery",
    legacyCategory: "EPC & Grid Interconnection",
    body: ["Interconnection queues have lengthened across most of the markets we track as more capacity competes for finite grid headroom, and a project's position in that queue is frequently fixed years before construction begins. Positioning strategy, submitting a complete, technically sound application early and managing the study process actively, has become a distinct and economically significant skill.", "We now treat interconnection strategy as part of project readiness from the earliest stage of site origination, because by financial close the position in the queue is usually already locked in."],
    img: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/Blons_Photovoltaikanlage_Schr%C3%A4gluftbild.jpg/1280px-Blons_Photovoltaikanlage_Schr%C3%A4gluftbild.jpg",
    imgAlt: "Oblique aerial view of a photovoltaic installation and grid context",
  },
  {
    slug: "a-net-zero-district-is-one-system-not-a-collection-of-efficient-buildings",
    date: "May 2026",
    title: "A net zero district is one system, not a collection of efficient buildings",
    deck: "Districts that reliably achieve net zero operation are planned as one coordinated energy, water, and mobility system from the master plan stage, not assembled building by building.",
    entryType: "Field Note",
    category: "Real Estate & Built Environment",
    lens: "Systems Design",
    legacyCategory: "Sustainable Real Estate",
    body: ["Retrofitting coordination after individual buildings are designed independently rarely closes the performance gap between projected and actual district-level energy balance. The districts that hold their numbers are the ones where generation, storage, charging infrastructure, and building load were modeled together before a single foundation was poured.", "That coordination, not a certification, is the deliverable on our real estate engagements: a working system that happens to contain several buildings, rather than several buildings that happen to share a boundary."],
    img: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8f/Weser_Stadion_Photovoltaikanlage_16-7-2014.jpg/1280px-Weser_Stadion_Photovoltaikanlage_16-7-2014.jpg",
    imgAlt: "Building-integrated photovoltaics on a stadium facade",
  },
  {
    slug: "one-waste-stream-four-potential-outputs",
    date: "June 2026",
    title: "One waste stream, four potential outputs",
    deck: "Modern conversion technology can extract power, heat, recovered materials, and industrial feedstock from a single waste stream. Most facilities are still configured to produce only one.",
    entryType: "Field Note",
    category: "Waste & Circular Materials",
    lens: "Markets & Supply Chains",
    legacyCategory: "Waste & Circular Materials",
    body: ["Configuration choices, not waste composition, are usually the binding constraint on output diversity: electricity, process heat, recovered carbon materials, and, depending on the technology pathway, hydrogen precursors can be extracted from the same feedstock. Facilities designed around a single output leave most of that potential value uncaptured.", "The deployment model we use configures each facility around the outputs its surrounding region can actually absorb, treating the waste stream as a feedstock optimization problem rather than a disposal problem."],
    img: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/28/Amager_Bakke_night.jpg/1280px-Amager_Bakke_night.jpg",
    imgAlt: "The CopenHill waste to energy facility at night",
  },
  {
    slug: "environmental-verification-moves-from-advantage-to-requirement",
    date: "July 2026",
    title: "Environmental verification moves from advantage to requirement",
    deck: "What began as an optional differentiator on land heavy deals is increasingly a standing request from capital partners across every asset class we work in.",
    entryType: "Field Note",
    category: "Orbital & Environmental Intelligence",
    lens: "Measurement & Verification",
    legacyCategory: "Orbital & Earth Observation",
    body: ["Two years ago, satellite-enabled verification was something we offered selectively on land and agriculture positions. It is now a standard request on energy and real estate diligence as well, ahead of an introduction proceeding to term sheet.", "We expect this trajectory to continue, which is why orbital and environmental intelligence sits alongside the other systems in our ecosystem framework as a standing discipline, not an add-on service."],
    img: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/Earth%27s_City_Lights_by_DMSP%2C_1994-1995_%28large%29.jpg/1280px-Earth%27s_City_Lights_by_DMSP%2C_1994-1995_%28large%29.jpg",
    imgAlt: "Composite satellite view of Earth's city lights at night",
  },
  {
    slug: "what-the-eus-finalized-disclosure-rules-mean-for-real-asset-underwriting",
    date: "August 2026",
    title: "What the EU's finalized disclosure rules mean for real asset underwriting",
    deck: "With the Omnibus I Directive published in February, European sustainability disclosure now has a narrower, clearer scope. That clarity is starting to show up in how real asset deals are structured.",
    entryType: "Field Note",
    category: "Capital Markets & Real Assets",
    secondaryCategory: "Real Estate & Built Environment",
    lens: "Capital & Finance",
    region: "Europe",
    legacyCategory: "Capital Markets & Real Assets",
    featured: true,
    body: ["The finalized rules raise CSRD's mandatory threshold to companies above 1,000 employees and roughly €450 million turnover, removing a large share of mid market real estate and infrastructure vehicles from mandatory scope entirely. For sponsors below that threshold, disclosure is now a deliberate positioning choice rather than a compliance default, and the sponsors choosing to disclose voluntarily are, in our experience this year, the ones underwriting fastest with institutional counterparties who no longer assume the paperwork will arrive automatically.", "Heading into the second half of the year, our capital introduction conversations increasingly start with this question directly: what can this sponsor actually prove, independent of what they are legally required to file. That is a higher bar than compliance, and it is the one that is starting to determine access to capital."],
    img: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Planta_Solar_Fotovoltaica_Yunchar%C3%A1.jpg/1280px-Planta_Solar_Fotovoltaica_Yunchar%C3%A1.jpg",
    imgAlt: "Utility-scale solar plant under wide skies",
  },
  {
    slug: "eu-sustainability-disclosure-law-outpaced-its-own-transposition-deadline",
    date: "August 2026",
    archiveDate: "2024-07",
    eventDate: "2024-07-06",
    title: "Europe's sustainability disclosure law outpaced its own transposition deadline",
    deck: "Member states had until 6 July 2024 to write the Corporate Sustainability Reporting Directive into national law. Most did not, and the gap between legal force and legal reality became the story.",
    entryType: "Policy Note",
    category: "Real Estate & Built Environment",
    secondaryCategory: "Capital Markets & Real Assets",
    lens: "Policy & Regulation",
    region: "Europe",
    body: [
      "The Corporate Sustainability Reporting Directive entered into force in January 2023 with a transposition deadline for EU member states of 6 July 2024. By that date only eleven countries had adopted implementing legislation, at least in part, while several others had only reached the consultation stage. The European Commission subsequently opened infringement procedures against seventeen member states, including Germany, Spain, and the Netherlands, giving each two months to respond.",
    ],
    keySignal: "By the 6 July 2024 transposition deadline, only eleven of twenty seven EU member states had adopted CSRD implementing legislation, at least in part. The European Commission opened infringement procedures against the other seventeen in the following weeks.",
    whyItMatters: "A missed transposition deadline does not suspend the underlying obligation for long, and it does not change what institutional counterparties expect to see from a real asset sponsor in the meantime. It does mean the compliance calendar an owner assumed applied to their jurisdiction may not yet be enforceable there, while investors underwriting cross border portfolios are left reconciling different effective dates country by country.",
    systemConnection: "Real estate and infrastructure portfolios that span multiple EU jurisdictions now sit inside a patchwork rather than a single directive, since national transposition determines what is actually enforceable, and by when, asset by asset.",
    capitalImplication: "Sponsors who kept building toward CSRD's substance rather than waiting on their own country's transposition timeline are, in our experience, the ones underwriting fastest with capital partners who no longer assume a mandatory filing will arrive on schedule.",
    whatWeAreWatching: [
      "Whether infringement procedures against the seventeen member states escalate toward referral before the Court of Justice.",
      "Whether the Omnibus simplification package moving through the EU legislative process narrows CSRD's scope before every member state finishes transposition.",
      "Divergence between national transpositions that exceed the directive's floor and those that transpose it minimally.",
    ],
    sources: [
      { label: "Directive (EU) 2022/2464 (CSRD), EUR-Lex", url: "https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX%3A32022L2464" },
      { label: "European Commission opens infringement procedures over CSRD transposition, Business & Human Rights Resource Centre", url: "https://www.business-humanrights.org/en/latest-news/eu-commission-sends-formal-notice-to-17-member-states-for-failing-to-meet-csrd-transposition-deadline-initiating-infringement-procedures/" },
    ],
    img: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/75/Berlaymont_EU_Building-Brussels.jpg/1280px-Berlaymont_EU_Building-Brussels.jpg",
    imgAlt: "The Berlaymont building in Brussels, headquarters of the European Commission",
  },
  {
    slug: "farmland-capital-begins-underwriting-soil-carbon-as-its-own-asset",
    date: "August 2026",
    archiveDate: "2024-09",
    eventDate: "2024-09-11",
    title: "Farmland capital begins underwriting soil carbon as its own asset",
    deck: "A corporate climate fund's investment in a regenerative farmland manager treats soil carbon as a distinct, financeable output, not a land value footnote.",
    entryType: "Capital Note",
    category: "Land & Regenerative Agriculture",
    secondaryCategory: "Capital Markets & Real Assets",
    lens: "Capital & Finance",
    region: "North America",
    body: [
      "Farmland LP announced on 11 September 2024 that Microsoft's Climate Innovation Fund had invested in Vital Farmland III, the manager's third value add fund, built around converting conventional farmland to organic and regenerative management. Farmland LP did not disclose the size of Microsoft's check. What it did disclose is the fund's own target, $250 million, and that the capital raised will help Farmland LP acquire additional acreage across its existing footprint of more than 18,500 acres in Washington, Oregon, and California, and fund development of soil carbon credits under Verra's Verified Carbon Standard across that same portfolio.",
    ],
    keySignal: "Microsoft's Climate Innovation Fund invested in Farmland LP's Vital Farmland III fund, which targets $250 million overall. The size of Microsoft's specific commitment was not disclosed. Part of the fund's capital is earmarked to develop Verra certified soil carbon credits across the manager's 18,500 acre portfolio.",
    whyItMatters: "The structure treats soil carbon as a revenue line the fund actively develops and sells, not a co benefit reported alongside the land's agricultural income. That distinction determines whether soil carbon shows up in underwriting as a modeled, financeable cash flow or as a sustainability disclosure with no cash attached to it.",
    capitalImplication: "A corporate climate fund taking a position in farmland transition, rather than buying credits after the fact, is a different signal than a voluntary offtake agreement. It prices the transition itself, before the credits exist, which is a materially different risk to underwrite.",
    developmentImplication: "For farmland managers without an existing carbon methodology in place, third party verification standards like Verra's VCS are becoming a prerequisite for this kind of capital, not a differentiator to add later.",
    whatWeAreWatching: [
      "Verified issuance volume once the Verra methodology work on the portfolio completes.",
      "Whether other corporate climate funds follow with direct farmland transition capital rather than credit purchases.",
      "Yield and input cost data as converted acreage moves from transition to certified organic status.",
    ],
    sources: [
      { label: "Farmland LP announces investment from Microsoft's Climate Innovation Fund", url: "https://www.farmlandlp.com/2024/11/farmland-lp-announces-investment-from-microsofts-climate-innovation-fund-to-support-regenerative-agriculture/" },
    ],
    img: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Corn_planter_with_a_no-till_farming_system_in_Brookings%2C_Co.%2C_SD_%2813874294214%29.jpg/1280px-Corn_planter_with_a_no-till_farming_system_in_Brookings%2C_Co.%2C_SD_%2813874294214%29.jpg",
    imgAlt: "A no-till corn planter working a Midwestern field",
  },
  {
    slug: "africas-electrification-push-gains-institutional-coordination",
    date: "August 2026",
    archiveDate: "2024-09",
    eventDate: "2024-09-19",
    title: "Africa's electrification push gains institutional coordination, not just money",
    deck: "Mission 300's more durable contribution so far is the coalition aligning around a single delivery framework, not the funding pledged at launch.",
    entryType: "Policy Note",
    category: "Food Systems & Community Health",
    secondaryCategory: "Energy",
    lens: "Policy & Regulation",
    region: "Africa",
    body: [
      "The World Bank Group and the African Development Bank launched Mission 300 in April 2024, targeting electricity access for 300 million people across Africa by 2030, with the World Bank committing to support 250 million connections and the AfDB the remaining 50 million. Africa holds an estimated 83 percent of the world's unelectrified population, and the World Bank has said the pace of new connections needs to roughly triple to meet the target. By September, the coalition behind the initiative had visibly widened: the Rockefeller Foundation, the Global Energy Alliance for People and Planet, and Sustainable Energy for All confirmed support alongside IFC, MIGA, and the regional trade bloc COMESA, which is providing technical assistance and project preparation capacity to participating governments.",
    ],
    keySignal: "Mission 300, launched by the World Bank Group and AfDB in April 2024 to electrify 300 million people by 2030, added the Rockefeller Foundation, the Global Energy Alliance for People and Planet, Sustainable Energy for All, IFC, MIGA, and COMESA as named institutional partners by September.",
    whyItMatters: "Development finance institutions have repeatedly stated that they cannot fund electrification at this scale alone. The question that actually determines delivery is whether enough private capital and technical capacity gets mobilized around a common framework, country by country, not whether a headline connection target sounds achievable in isolation.",
    systemConnection: "Reliable power is a precondition for the rest of the community and health infrastructure it enables, cold chain for vaccines, water pumping and treatment, and lighting for clinics operating past daylight hours, which is why we treat electrification sequencing as a health system input, not only an energy metric.",
    developmentImplication: "For developers working in participating countries, the practical relevance is the project preparation and technical assistance capacity COMESA and its partners are standing up, which can shorten the distance between a viable site and a bankable one in markets where that gap has historically been the binding constraint.",
    whatWeAreWatching: [
      "Country level National Energy Compacts as they are finalized and whether they translate into project pipelines.",
      "The scale of private capital actually mobilized against the stated target, as distinct from development finance commitments.",
      "Connection data as it is reported against the 2030 target.",
    ],
    sources: [
      { label: "Five ways the World Bank will achieve Mission 300, World Bank", url: "https://www.worldbank.org/en/news/feature/2024/09/19/five-ways-the-world-bank-will-achieve-mission-300" },
    ],
    img: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/35/OuarzazateSolar.jpeg/1280px-OuarzazateSolar.jpeg",
    imgAlt: "Satellite view of the Noor Ouarzazate solar power complex in Morocco",
  },
  {
    slug: "regenerative-agriculture-transition-finance-is-still-measured-in-single-digit-billions",
    date: "August 2026",
    archiveDate: "2024-09",
    eventDate: "2024-09-19",
    title: "Regenerative agriculture transition finance is still measured in single digit billions",
    deck: "A coalition of two dozen food and agriculture companies tracked 3.6 billion dollars in transition finance over five years. Against the land it aims to cover, that number is the more honest headline.",
    entryType: "Data Note",
    category: "Land & Regenerative Agriculture",
    secondaryCategory: "Food Systems & Community Health",
    lens: "Capital & Finance",
    region: "Global",
    body: [
      "OP2B, a coalition of 26 food and agriculture companies with a combined market value of roughly $893 billion, marked its fifth year in September 2024 with a progress report tallying $3.6 billion in transition finance for regenerative agriculture deployed between 2019 and 2023. That capital, alongside 72 member programs, had reached 3.9 million hectares and roughly 300,000 farmers, against a stated coalition target of 12.5 million hectares by 2030. The same report identified an annual funding gap of $300 billion to move global agriculture onto a more sustainable footing, and noted that only 47 percent of member companies were actively financing and disclosing regenerative agriculture spending at all.",
    ],
    keySignal: "OP2B's five year progress report puts cumulative transition finance for regenerative agriculture at $3.6 billion across 2019 to 2023, reaching 3.9 million of a targeted 12.5 million hectares, against a $300 billion annual funding gap the same report identifies.",
    whyItMatters: "The gap between $3.6 billion deployed and $300 billion needed annually is the more structurally important number in the report. It says the corporate transition finance mechanisms that exist today are real but still a rounding error against the scale of land that would need to change practice for the target to matter at a system level.",
    systemConnection: "Regenerative practice on cropland acts on soil health, water retention, and input use simultaneously, which is why we track this thread inside our regenerative agriculture desk even when the capital source is a food company's supply chain program rather than a land investor.",
    capitalImplication: "Less than half of OP2B's own membership is actively financing and disclosing what they spend on this transition, which suggests the credible near term capital pool is still a subset of the coalition's headline size, not the whole of it.",
    whatWeAreWatching: [
      "Whether disclosure participation among OP2B members improves beyond the current 47 percent.",
      "Hectare growth against the 12.5 million target as the coalition approaches its stated 2030 horizon.",
      "Whether the identified $300 billion funding gap draws in capital structures beyond direct corporate supply chain finance.",
    ],
    sources: [
      { label: "Global regenerative agriculture initiative hits major milestones, WBCSD", url: "https://www.wbcsd.org/news/global-regenerative-agriculture-initiative-hits-major-milestones-as-collaborative-efforts-accelerate/" },
    ],
    img: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/28/Farmland_in_Weaver_Township%2C_Humboldt_County%2C_Iowa.jpg/1280px-Farmland_in_Weaver_Township%2C_Humboldt_County%2C_Iowa.jpg",
    imgAlt: "Farmland in Humboldt County, Iowa",
  },
  {
    slug: "biodiversity-finance-gets-a-payment-mechanism-not-yet-a-market",
    date: "August 2026",
    archiveDate: "2024-11",
    eventDate: "2024-11-01",
    title: "Biodiversity finance gets a payment mechanism, not yet a market",
    deck: "COP16 in Cali created the first structured claim on revenue from genetic sequence data for biodiversity conservation. Whether it becomes real capital flow depends on participation nobody can yet compel.",
    entryType: "Policy Note",
    category: "Capital Markets & Real Assets",
    lens: "Policy & Regulation",
    region: "Latin America & Caribbean",
    country: "Colombia",
    body: [
      "COP16, the UN biodiversity conference, ran in Cali, Colombia from 21 October to 1 November 2024, the first time the talks were held in the Amazon region. Parties adopted the Cali Fund, a mechanism requiring companies that commercially use digital sequence information, genetic data drawn from plants, animals, and microorganisms, to contribute a share of their profits or revenue toward biodiversity conservation, with half of any proceeds directed to Indigenous Peoples and local communities. What the conference did not resolve was broader and harder: talks on a dedicated global biodiversity fund under COP governance stalled over developed and developing country disagreement on structure and control, pushing that question to a reconvened session in Rome in February 2025. Pledges to the interim Global Biodiversity Framework Fund reached only about $407 million in Cali, well short of what negotiators had sought.",
    ],
    keySignal: "COP16 in Cali adopted the Cali Fund, a digital sequence information benefit sharing mechanism with a 50 percent allocation to Indigenous Peoples and local communities, while broader global biodiversity fund negotiations stalled and were pushed to Rome in February 2025.",
    whyItMatters: "The Cali Fund is a payment obligation with a defined beneficiary, not yet a market with defined supply and demand. Its practical value depends entirely on which companies actually contribute, since participation is not compulsory in the way a tax or a regulated fee would be, and on how contribution is verified once companies do.",
    systemConnection: "Biodiversity finance sits next to, but is not the same instrument as, the carbon markets already active in land backed structures, and the two are increasingly discussed by the same institutional buyers evaluating the same land.",
    whatWeAreWatching: [
      "Corporate contribution volume to the Cali Fund once it begins operating.",
      "Whether the reconvened Rome session in February 2025 resolves global biodiversity fund governance.",
      "Whether verification standards for DSI linked biodiversity outcomes converge with existing carbon market methodologies or diverge into a separate discipline.",
    ],
    sources: [
      { label: "COP16: Key outcomes agreed at the UN biodiversity conference in Cali, Colombia, Carbon Brief", url: "https://www.carbonbrief.org/cop16-key-outcomes-agreed-at-the-un-biodiversity-conference-in-cali-colombia" },
      { label: "COP16 Adopts Cali Fund, WWF", url: "https://www.worldwildlife.org/news/press-releases/some-successes-but-cop16-in-cali-ends-in-disappointment-with-crucial-finance-agreements-delayed/" },
    ],
    img: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Los_Farallones.jpg/1280px-Los_Farallones.jpg",
    imgAlt: "Mountain landscape of the Farallones near Cali, Colombia",
  },
  {
    slug: "the-climate-finance-goal-tripled-on-paper-the-harder-number-is-1-3-trillion",
    date: "August 2026",
    archiveDate: "2024-11",
    eventDate: "2024-11-24",
    title: "The climate finance goal tripled on paper. The harder number is 1.3 trillion",
    deck: "COP29's headline agreement raises the developed country finance floor to 300 billion dollars a year by 2035. The 1.3 trillion figure it points toward depends on private capital nobody has yet committed to mobilize.",
    entryType: "Policy Note",
    category: "Capital Markets & Real Assets",
    secondaryCategory: "Land & Regenerative Agriculture",
    lens: "Capital & Finance",
    region: "Global",
    body: [
      "COP29 closed in Baku, Azerbaijan on 24 November 2024 with agreement on a New Collective Quantified Goal on climate finance, committing developed countries to mobilize at least $300 billion annually for developing countries by 2035, up from the prior $100 billion goal. The text also references a broader ambition, that public and private sources together reach $1.3 trillion a year by 2035, without specifying binding commitments for how the gap between the two figures gets closed. Reaction split along familiar lines, with developing country negotiators and civil society groups calling the $300 billion figure inadequate against stated need, and the deal's defenders framing it as a floor to build from rather than a ceiling.",
    ],
    keySignal: "COP29's New Collective Quantified Goal commits developed countries to $300 billion annually by 2035 for developing country climate finance, with a non binding reference to $1.3 trillion a year from all public and private sources combined.",
    whyItMatters: "The distinction between the $300 billion committed figure and the $1.3 trillion referenced figure is the entire story. One is a floor with named obligated parties. The other is an aspiration with no defined mechanism for how private capital gets mobilized at that scale, which means the practical financing environment for the next several years is closer to the smaller number than the headline suggests.",
    capitalImplication: "Land, agriculture, and infrastructure projects seeking blended or catalytic capital in developing markets should expect the public finance floor to move gradually rather than to unlock a step change in private co-investment on the strength of this agreement alone.",
    whatWeAreWatching: [
      "How much of the $300 billion floor is delivered as grants versus loans, which materially changes its value to recipient countries.",
      "Any follow on mechanisms proposed to close the gap toward the $1.3 trillion figure.",
      "Whether COP30 in Belem, held the following November, produces more specificity on private capital mobilization than Baku did.",
    ],
    sources: [
      { label: "COP29 UN Climate Conference Agrees to Triple Finance to Developing Countries, UNFCCC", url: "https://unfccc.int/news/cop29-un-climate-conference-agrees-to-triple-finance-to-developing-countries-protecting-lives-and" },
      { label: "Baku Conference Sets New Collective Climate Finance Goal, IISD", url: "https://www.iisd.org/articles/insight/baku-conference-sets-new-collective-climate-finance-goal" },
    ],
    img: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/22/Baku_15_06_14_216000.jpeg/1280px-Baku_15_06_14_216000.jpeg",
    imgAlt: "The Heydar Aliyev Center in Baku, Azerbaijan",
  },
  {
    slug: "battery-prices-fell-fast-enough-in-2024-to-change-what-a-solar-project-is",
    date: "August 2026",
    archiveDate: "2024-12",
    eventDate: "2024-12-10",
    title: "Battery prices fell fast enough in 2024 to change what a solar project is",
    deck: "A 20 percent single year drop in lithium ion pack prices was the fastest since 2017. It is also close to the point where dispatchable solar stops being a premium product.",
    entryType: "Data Note",
    category: "Energy",
    lens: "Asset Economics",
    region: "Global",
    body: [
      "BloombergNEF's 2024 Lithium-Ion Battery Price Survey, published 10 December 2024, put the volume weighted average battery pack price at $115 per kilowatt hour, a 20 percent drop from 2023 and the steepest single year decline since 2017. The survey drew on 343 data points across electric cars, buses, and commercial vehicles, and found meaningful regional spread beneath the average: pack prices in China averaged $94 per kilowatt hour, while the US and Europe ran 31 and 48 percent higher respectively. Cell manufacturing overcapacity, falling metal and component costs, and continued adoption of lower cost lithium iron phosphate chemistry were the drivers BNEF identified.",
    ],
    keySignal: "BNEF's 2024 survey recorded lithium-ion battery pack prices falling 20 percent year over year to $115 per kilowatt hour, the largest annual drop since 2017, with China at $94 per kilowatt hour against materially higher US and European averages.",
    whyItMatters: "Storage economics, not panel or turbine cost, are now the more active variable in whether a generation asset can be sold as dispatchable rather than intermittent power. A 20 percent single year price move changes the co-location math for a project that was marginal on storage economics twelve months earlier.",
    systemConnection: "The regional price spread matters as much as the global average for our origination work, since a project's storage economics depend on where its equipment is actually sourced and financed, not on the headline global figure.",
    developmentImplication: "Projects we are advising on with wind or solar generation now model storage co-location as a base case rather than an optional upgrade, given how much the marginal economics have moved in a single reporting cycle.",
    whatWeAreWatching: [
      "Whether the following year's survey shows the decline continuing or stabilizing after 2024's outsized move.",
      "Tariff and trade policy effects on the US-China-Europe price spread specifically.",
      "LFP chemistry adoption rates outside China.",
    ],
    sources: [
      { label: "Lithium-Ion Battery Pack Prices See Largest Drop Since 2017, Falling to $115 per Kilowatt-Hour, BloombergNEF", url: "https://about.bnef.com/insights/commodities/lithium-ion-battery-pack-prices-see-largest-drop-since-2017-falling-to-115-per-kilowatt-hour-bloombergnef/" },
    ],
    img: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c6/Tesvolt_battery_energy_storage_system_Rheineck.jpg/1280px-Tesvolt_battery_energy_storage_system_Rheineck.jpg",
    imgAlt: "A grid-scale battery energy storage installation",
  },
  {
    slug: "a-water-utilitys-loan-was-priced-on-performance-not-just-infrastructure",
    date: "August 2026",
    archiveDate: "2024-11",
    eventDate: "2024-11-19",
    title: "A water utility's loan was priced on performance, not just infrastructure",
    deck: "IFC structured its financing for a Brazilian utility's river restoration program with pricing tied to sewage connection targets. That structure, not the loan size, is the more exportable part.",
    entryType: "Capital Note",
    category: "Water Systems",
    secondaryCategory: "Capital Markets & Real Assets",
    lens: "Capital & Finance",
    region: "Latin America & Caribbean",
    country: "Brazil",
    body: [
      "IFC announced on 19 November 2024 a sustainability linked loan of up to BRL 1.06 billion, roughly $184 million at the time, to Sabesp, the water utility serving Sao Paulo state, to support its Integra Tiete initiative restoring water quality along the Tiete River. The loan carries a ten year tenor and pricing incentives tied to specific performance targets, increasing the share of households connected to sewage collection and treatment in the Guarulhos and Perus service areas, expected to reach more than 360,000 residents. The financing followed IFC's 2022 blue loan to the same utility and forms part of a larger financing package assembled around the Integra Tiete program.",
    ],
    keySignal: "IFC's November 2024 sustainability linked loan to Sabesp, up to BRL 1.06 billion, prices interest rate incentives against sewage connection and treatment targets in Guarulhos and Perus rather than against generic ESG metrics.",
    whyItMatters: "A sustainability linked structure that prices against a specific, auditable operational target, households actually connected to treatment, is a materially different underwriting proposition than one priced against a broad ESG score. The former is verifiable against utility connection data. The latter frequently is not.",
    systemConnection: "River restoration and sewage connection are the same infrastructure problem viewed from two ends, and financing that prices the connection metric directly is, in effect, financing the river outcome without needing a separate environmental instrument to do it.",
    capitalImplication: "The specificity of the performance metric, not the loan's size, is what would make this structure replicable for other utilities and other multilateral lenders evaluating water infrastructure in emerging markets.",
    whatWeAreWatching: [
      "Connection rate progress in Guarulhos and Perus against the loan's performance targets.",
      "Whether IFC or other DFIs replicate connection linked pricing on subsequent water utility financings.",
      "Additional tranches or co-financing added to the broader Integra Tiete package.",
    ],
    sources: [
      { label: "IFC Provides Loan to Sabesp to Improve Access to Water and Sanitation Services in Brazil, IFC", url: "https://www.ifc.org/en/pressroom/2024/ifc-invests-in-sabesp-to-improve-access-to-water-and-sanitation-services-in-brazil" },
    ],
    img: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/Rio_Tiet%C3%AA_-_Cidade_de_Salto_1.jpg/1280px-Rio_Tiet%C3%AA_-_Cidade_de_Salto_1.jpg",
    imgAlt: "The Tiete River near Salto, Sao Paulo state, Brazil",
  },
  {
    slug: "europe-rebuilt-its-earth-observation-baseline-in-2024",
    date: "August 2026",
    archiveDate: "2024-12",
    eventDate: "2024-12-05",
    title: "Europe rebuilt its Earth observation baseline in a single year",
    deck: "Two Copernicus satellite launches within four months restored radar and optical monitoring capacity that asset level environmental verification quietly depends on.",
    entryType: "Field Note",
    category: "Orbital & Environmental Intelligence",
    lens: "Technology & Infrastructure",
    region: "Europe",
    body: [
      "The Copernicus Sentinel-2C optical satellite launched from French Guiana on 5 September 2024, the final flight of the original Vega rocket after twelve years of service. Three months later, on 5 December 2024, Sentinel-1C launched on the first operational flight of its successor, Vega-C, restoring Europe's independent radar imaging capacity on Vega-C's return to flight. Within days, Sentinel-1C returned its first radar image, a scan of Brussels rendering the city's built density in bright tones against darker surrounding vegetation.",
    ],
    keySignal: "Two Copernicus Sentinel satellites reached orbit in the second half of 2024. Sentinel-2C, launched 5 September, extends optical land monitoring. Sentinel-1C, launched 5 December on Vega-C's return to flight, extends radar coverage, which unlike optical imaging works through cloud cover and at night.",
    whyItMatters: "Verification workflows that depend on regular revisit intervals, soil moisture, canopy change, flood extent, land use change, are only as reliable as the constellation behind them. A single satellite failure or a gap in launch cadence can widen the interval between usable passes over a given site for months. Two successful launches in one year is a capacity story before it is a data story.",
    systemConnection: "Land and agriculture positions with multi year capital behind them increasingly treat this kind of independent, repeatable measurement as a standing requirement rather than a periodic check, which makes the health of the underlying satellite infrastructure a due diligence input in its own right, not a detail to take for granted.",
    whatWeAreWatching: [
      "Whether Vega-C's return to flight holds through its next several missions after a mechanical delay pushed the Sentinel-1C launch by a day.",
      "Data latency and revisit frequency improvements as both satellites complete commissioning.",
      "How verification providers incorporate the wider radar and optical baseline into asset level reporting over the following year.",
    ],
    sources: [
      { label: "Sentinel-2C joins the Copernicus family in orbit, ESA", url: "https://www.esa.int/Applications/Observing_the_Earth/Copernicus/Sentinel-2/Sentinel-2C_joins_the_Copernicus_family_in_orbit" },
      { label: "Vega-C takes Copernicus Sentinel-1C into orbit, ESA", url: "https://www.esa.int/ESA_Multimedia/Images/2024/12/Vega-C_takes_Copernicus_Sentinel-1C_into_orbit" },
    ],
    img: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Brussels%2C_Belgium%2C_captured_by_Sentinel-1C_ESA504717.jpg/1280px-Brussels%2C_Belgium%2C_captured_by_Sentinel-1C_ESA504717.jpg",
    imgAlt: "Radar image of Brussels captured by the Copernicus Sentinel-1C satellite shortly after launch",
  },
  {
    slug: "regional-food-infrastructure-funding-starts-reaching-the-middle-of-the-supply-chain",
    date: "August 2026",
    archiveDate: "2024-10",
    eventDate: "2024-10-17",
    title: "Regional food infrastructure funding starts reaching the middle of the supply chain",
    deck: "USDA's Resilient Food Systems Infrastructure Program was designed to fund cold storage, shared processing, and aggregation hubs, not just farms. By late 2024, state-administered awards showed the money moving to exactly that layer.",
    entryType: "Policy Note",
    category: "Food Systems & Community Health",
    lens: "Markets & Supply Chains",
    region: "North America",
    body: [
      "USDA's Agricultural Marketing Service announced up to $420 million for the Resilient Food Systems Infrastructure Program in May 2023, aimed at the aggregation, processing, and distribution layer between farms and end markets rather than production itself. States administer the program through cooperative agreements with USDA and then issue their own competitive subawards. Connecticut's Department of Agriculture, working through that structure, announced three infrastructure grants totaling over $670,000 on 17 October 2024, funding shared cold storage and processing facilities and a cooperative commercial kitchen intended to help small producers reach broader markets. Washington State's parallel round, administered by its own Department of Agriculture, awarded over $7.3 million across grants ranging from $100,000 to $3 million for similar aggregation, processing, and distribution capacity.",
    ],
    keySignal: "USDA's Resilient Food Systems Infrastructure Program, up to $420 million nationally, is being disbursed through state departments of agriculture as competitive subawards. Connecticut's October 2024 round funded shared cold storage, processing, and a cooperative commercial kitchen. Washington's round awarded over $7.3 million across similar mid-chain infrastructure.",
    whyItMatters: "Farm-level support and retail-level demand rarely fail for lack of capital. The layer that has historically been hardest to finance is the one in between, aggregation, cold storage, and shared processing capacity sized for a regional producer base rather than a single large processor. A program explicitly targeting that layer, and state-level award data showing it actually reaching shared cold storage and commercial kitchens rather than only farm equipment, is a more precise signal than the national total by itself.",
    systemConnection: "Regional food infrastructure sits directly upstream of the agricultural, land, and community outcomes we track elsewhere: shared cold storage and processing capacity changes what crop mix is viable for a given region's producers, which in turn changes the land use and water demand questions we ask on the agricultural side.",
    developmentImplication: "For developers or landowners evaluating agricultural or mixed-use sites, proximity to funded aggregation and cold storage infrastructure is becoming a real, if still underappreciated, site selection variable, since it changes which crops and which buyers a given parcel can realistically serve.",
    whatWeAreWatching: [
      "Whether state award rounds through 2025 continue prioritizing shared infrastructure over single-operator equipment grants.",
      "Utilization data at funded facilities once they come online, distinct from the funding announcements themselves.",
      "Whether other states' award structures resemble Connecticut and Washington's mid-chain focus or skew toward farm-level equipment instead.",
    ],
    sources: [
      { label: "USDA Announces $270 Million Awarded to Build Food Supply Chain Resiliency, USDA", url: "https://www.usda.gov/about-usda/news/press-releases/2024/02/07/usda-announces-270-million-awarded-build-food-supply-chain-resiliency" },
      { label: "USDA and Connecticut Award Projects that Strengthen Food Supply Chain Infrastructure, Connecticut Department of Agriculture", url: "https://portal.ct.gov/doag/press-room/press-releases/2024/october/usda-and-connecticut-award-projects-that-strengthen-food-supply-chain-infrastructure" },
      { label: "USDA Partners with Washington to Award Over $7.3 Million to Strengthen Food Supply Chain Infrastructure, USDA Farm Service Agency", url: "https://www.fsa.usda.gov/news-events/news/05-30-2024/usda-partners-washington-award-73-million-strengthen-food-supply-chain" },
    ],
    img: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/48/Harlingen_Cold_Storage.jpg/1280px-Harlingen_Cold_Storage.jpg",
    imgAlt: "A cold storage warehouse facility in Harlingen, Texas",
  },
  {
    slug: "the-worlds-largest-fully-renewable-desalination-plant-reached-financial-close",
    date: "August 2026",
    archiveDate: "2025-05",
    eventDate: "2025-05-08",
    title: "The world's largest fully renewable powered desalination plant reached financial close",
    deck: "A 613 million euro plant outside Casablanca will supply drinking water to 7.5 million people, powered entirely by a dedicated wind farm. The renewable pairing, not the plant's size alone, is what makes the structure exportable.",
    entryType: "Capital Note",
    category: "Water Systems",
    secondaryCategory: "Energy",
    lens: "Capital & Finance",
    region: "Africa",
    country: "Morocco",
    body: [
      "The Al Baidaa Desalination Company consortium, ACCIONA holding 50 percent alongside Green of Africa and AfriquiaGaz, signed financing on 8 May 2025 for a seawater desalination plant at Sidi Rahal in the Greater Casablanca area, a total investment of roughly 6.5 billion Moroccan dirham, about 613 million euro. The plant will produce 300 million cubic meters of water annually, serving approximately 7.5 million people, and will draw its power entirely from a dedicated 360 megawatt wind farm at Bir Anzarane, with 47 percent of that farm's output allocated to the facility. ACCIONA will operate and maintain the plant under a public private partnership with Morocco's national water and electricity authority over a 27 year concession, with construction scheduled to complete in 2028.",
    ],
    keySignal: "The Al Baidaa consortium, led by ACCIONA, signed financing on 8 May 2025 for a 613 million euro desalination plant near Casablanca that will draw its entire power supply from a dedicated 360 MW wind farm, serving roughly 7.5 million people over a 27 year concession.",
    whyItMatters: "Pairing a desalination plant's full power demand with a dedicated renewable asset, rather than drawing from the grid, removes a variable that has historically made desalination projects vulnerable to fuel and carbon price swings over a multi decade concession. That structure is what makes the economics underwritable at this scale and tenor, not the plant's size by itself.",
    systemConnection: "This is the water and energy sequencing question we have tracked in frontier markets made concrete at scale, a water project that solved its own power dependency by building the generation asset alongside it rather than treating grid power as a given.",
    capitalImplication: "A 27 year concession with power cost effectively fixed by ownership of the generation asset is a materially different risk profile for infrastructure lenders than a conventional grid connected plant, and should price accordingly.",
    whatWeAreWatching: [
      "Whether the renewable pairing structure gets replicated on subsequent desalination financings in water stressed, renewable resource rich markets.",
      "Construction progress against the 2028 completion target.",
      "Water tariff and offtake terms as they become public, which will determine whether the structure is genuinely replicable or dependent on Morocco specific support.",
    ],
    sources: [
      { label: "ACCIONA signs financing for Casablanca desalination plant, ACCIONA", url: "https://www.acciona.com/updates/news/acciona-signs-financing-casablanca-desalination-plant" },
      { label: "ACCIONA Signs Financing For Casablanca Desalination Plant, Water Online", url: "https://www.wateronline.com/doc/acciona-signs-financing-for-casablanca-desalination-plant-0001" },
    ],
    img: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/Reverse_osmosis_desalination_plant.JPG/960px-Reverse_osmosis_desalination_plant.JPG",
    imgAlt: "A seawater reverse osmosis desalination plant",
  },
  {
    slug: "methanesats-loss-is-a-reminder-that-verification-infrastructure-is-not-permanent",
    date: "August 2026",
    archiveDate: "2025-07",
    eventDate: "2025-06-20",
    title: "MethaneSAT's loss is a reminder that verification infrastructure is not permanent",
    deck: "A single on orbit anomaly ended a purpose built methane monitoring satellite after fifteen months. The episode is a data point on the fragility of the verification layer capital increasingly depends on, not a one off story.",
    entryType: "Data Note",
    category: "Orbital & Environmental Intelligence",
    lens: "Resilience & Risk",
    region: "Global",
    body: [
      "MethaneSAT, a satellite built by the Environmental Defense Fund specifically to detect and quantify methane emissions at regional scale and make the data freely public, suffered an on orbit anomaly and lost communication with mission control on 20 June 2025. Operators made nearly 400 attempts to reestablish contact over the following 21 days without success, and on 1 July EDF confirmed the satellite had lost power and was likely not recoverable. The subsequent anomaly investigation attributed the failure to a single event affecting either the flight avionics unit or the electrical power subsystem. MethaneSAT had launched in March 2024 and operated for roughly fifteen months.",
    ],
    keySignal: "MethaneSAT, EDF's purpose built methane monitoring satellite, lost communication on 20 June 2025 and was confirmed unrecoverable on 1 July, ending a mission that had operated for about fifteen months after its March 2024 launch.",
    whyItMatters: "Environmental verification increasingly gets treated as a standing capability, a layer that is simply there when a deal needs it. A single satellite loss after fifteen months of operation is a concrete reminder that any specific monitoring asset has real failure risk, and that verification claims resting on one satellite or one provider carry more fragility than the underwriting language usually acknowledges.",
    systemConnection: "This sits alongside, not against, the broader trend of Europe rebuilding its Sentinel constellation the same year, the two stories together say verification capacity overall is expanding, but any single mission remains a point of failure worth diligencing specifically, not assuming as a given.",
    developmentImplication: "Diligence teams relying on a specific satellite mission's data for a multi year monitoring commitment should confirm what happens to that commitment if the mission ends early, redundancy and data continuity plans matter as much as the mission's stated capability.",
    whatWeAreWatching: [
      "Whether EDF or another operator proposes a MethaneSAT successor mission.",
      "How methane monitoring commitments that referenced MethaneSAT specifically are being revised.",
      "Redundancy planning among other single satellite environmental monitoring missions.",
    ],
    sources: [
      { label: "MethaneSAT loses contact with satellite, Environmental Defense Fund", url: "https://www.edf.org/media/methanesat-loses-contact-satellite" },
      { label: "Results of the Anomaly Investigation into the Loss of Communication with MethaneSAT, MethaneSAT", url: "https://www.methanesat.org/project-updates/results-anomaly-investigation-loss-communication-methanesat" },
    ],
    img: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/SpaceX_Flacon_9_Iridium-8_Launches_from_Vandenberg_%285024378%29.jpg/1280px-SpaceX_Flacon_9_Iridium-8_Launches_from_Vandenberg_%285024378%29.jpg",
    imgAlt: "A SpaceX Falcon 9 rocket launches from Vandenberg Space Force Base",
  },
  {
    slug: "the-fda-pushed-its-traceability-rule-back-30-months-the-supply-chain-gap-it-revealed-did-not-move",
    date: "August 2026",
    archiveDate: "2025-08",
    eventDate: "2025-08-07",
    title: "The FDA pushed its traceability rule back 30 months. The supply chain gap it revealed did not move",
    deck: "FDA delayed mandatory farm to table traceability recordkeeping to 2028, citing data system interoperability problems the industry could not solve in time. That gap is the more durable story than the delay itself.",
    entryType: "Policy Note",
    category: "Food Systems & Community Health",
    lens: "Policy & Regulation",
    region: "North America",
    body: [
      "FDA proposed a 30 month extension to the Food Traceability Rule's compliance deadline on 7 August 2025, moving mandatory additional recordkeeping for high risk foods, including leafy greens, from January 2026 to July 2028, a delay Congress subsequently directed the agency not to enforce ahead of in November 2025. The rule, finalized in November 2022 under the Food Safety Modernization Act, requires entities across the supply chain, growers, processors, distributors, retailers, to maintain and be able to rapidly produce standardized traceability records. FDA cited concerns raised across the supply chain about the interoperability of data systems between growers, processors, and distributors, and the volume of data the rule would require each entity to receive, maintain, and transmit.",
    ],
    keySignal: "FDA proposed extending the Food Traceability Rule's compliance deadline by 30 months, from January 2026 to July 2028, on 7 August 2025, citing supply chain data system interoperability problems industry could not resolve on the original timeline.",
    whyItMatters: "A delayed compliance deadline is not evidence the underlying traceability gap closed, it is evidence the supply chain's data infrastructure was not ready to close it on the original schedule. The interoperability problem FDA cited, growers, processors, and distributors running incompatible systems, is exactly the kind of structural, financeable infrastructure gap that a delay does not solve on its own.",
    systemConnection: "Traceability recordkeeping sits directly on top of the same regional aggregation, processing, and cold chain infrastructure we track under this category's supply chain thread, better mid chain infrastructure and better traceability systems are, in practice, largely the same investment.",
    developmentImplication: "Processors and distributors that build interoperable traceability systems ahead of the 2028 deadline, rather than waiting for it, gain a genuine operating advantage with retail and food service buyers who are already asking for this data voluntarily.",
    whatWeAreWatching: [
      "Whether the 2028 deadline holds or faces further extension as the 2027 checkpoint approaches.",
      "Investment in traceability and data interoperability infrastructure ahead of the deadline, distinct from compliance spending after the fact.",
      "Which retailers and food service buyers begin requiring traceability data voluntarily, ahead of the mandatory date.",
    ],
    sources: [
      { label: "Requirements for Additional Traceability Records for Certain Foods: Compliance Date Extension, Federal Register", url: "https://www.federalregister.gov/documents/2025/08/07/2025-14967/requirements-for-additional-traceability-records-for-certain-foods-compliance-date-extension" },
      { label: "FDA Proposes Extension to Food Traceability Rule Compliance Date, Covington & Burling", url: "https://www.cov.com/en/news-and-insights/insights/2025/08/fda-proposes-extension-to-food-traceability-rule-compliance-date" },
    ],
    img: "https://upload.wikimedia.org/wikipedia/commons/e/e9/ARS_romaine_lettuce.jpg",
    imgAlt: "A head of romaine lettuce, a high-risk food under FDA traceability rules",
  },
  {
    slug: "eu-textile-waste-law-creates-a-financeable-recovery-industry",
    date: "August 2026",
    archiveDate: "2025-10",
    eventDate: "2025-10-16",
    title: "The EU's textile waste law creates a financeable recovery industry, not just a compliance cost",
    deck: "The revised Waste Framework Directive forces producers to fund textile collection, sorting, and recycling at scale. That funding obligation is also a demand signal for recovery infrastructure that didn't previously have one.",
    entryType: "Policy Note",
    category: "Waste & Circular Materials",
    lens: "Policy & Regulation",
    region: "Europe",
    body: [
      "The EU's revised Waste Framework Directive entered into force on 16 October 2025, introducing the bloc's first mandatory Extended Producer Responsibility scheme for textiles. Producers placing clothing, footwear, accessories, and household linen on the EU market, including online sellers based outside the EU, must now finance the collection, sorting, and recycling of those products, with fees eco-modulated to reward more durable and recyclable design. Separately collected textiles must be sorted before export, closing a loophole that let waste labeled as reusable goods be shipped to countries without the capacity to manage it. Member states have 20 months to transpose the directive and 30 months to stand up their EPR schemes, with micro-enterprises given 42 months.",
    ],
    keySignal: "The EU's revised Waste Framework Directive, in force since 16 October 2025, creates the first EU-wide mandatory Extended Producer Responsibility scheme for textiles, funding collection, sorting, and recycling through eco-modulated producer fees.",
    whyItMatters: "An EPR fee is a compliance cost from a producer's seat and a guaranteed revenue stream from a recycler's seat. Mandating that producers pay for collection and sorting is what turns textile recovery from a marginal, subsidy dependent activity into infrastructure with a financeable cash flow, the same shift that happened to packaging recycling under earlier EPR schemes.",
    systemConnection: "Textile recovery infrastructure, sorting facilities, mechanical and chemical recycling lines, competes for the same industrial sites, logistics networks, and in some cases feedstock streams as other circular materials operations, which is why we track it inside the same category rather than as a separate vertical.",
    developmentImplication: "Sorting and recycling capacity sized to the new EPR volumes does not exist yet at the scale the directive implies, which means site selection and permitting for that capacity is a live opportunity in the member states that move fastest on transposition, not a wait and see proposition.",
    whatWeAreWatching: [
      "Which member states transpose ahead of the 20 month deadline and start directing EPR fee revenue toward capacity build out early.",
      "Whether eco-modulated fee schedules meaningfully shift producer design choices, or settle at a level too low to change behavior.",
      "Investment announcements for new sorting and recycling capacity sized to the EPR volumes.",
    ],
    sources: [
      { label: "Revised Waste Framework Directive enters into force, European Commission", url: "https://environment.ec.europa.eu/news/revised-waste-framework-directive-enters-force-2025-10-16_en" },
    ],
    img: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ae/Material_recovery_facility_2004-03-24.jpg/1280px-Material_recovery_facility_2004-03-24.jpg",
    imgAlt: "A materials recovery facility sorting mixed recyclable waste",
  },
  {
    slug: "the-largest-ever-energy-transition-fund-closed-above-target",
    date: "August 2026",
    archiveDate: "2025-10",
    eventDate: "2025-10-07",
    title: "The largest ever energy transition fund closed above target",
    deck: "Brookfield raised 20 billion dollars for its second global transition fund, beating a 17 billion dollar target and its own prior record. The scale says institutional capital still treats the transition as a distinct, investable category, not a niche.",
    entryType: "Capital Note",
    category: "Capital Markets & Real Assets",
    secondaryCategory: "Energy",
    lens: "Capital & Finance",
    region: "Global",
    body: [
      "Brookfield announced the final close of its Brookfield Global Transition Fund II on 7 October 2025 at $20 billion in fund commitments and strategic capital, exceeding its $17 billion target and surpassing its predecessor fund to become, by Brookfield's own description, the largest private fund dedicated to the energy transition. Including roughly $3.5 billion of co-investment alongside the fund itself, total capital raised for the strategy reached approximately $23.5 billion. Reported commitments included $2 billion from Mubadala backed ALTÉRRA and $1.5 billion from Norges Bank Investment Management.",
    ],
    keySignal: "Brookfield closed its second Global Transition Fund at $20 billion on 7 October 2025, above its $17 billion target and its predecessor's record, with total capital including co-investment reaching approximately $23.5 billion.",
    whyItMatters: "A target sized at $17 billion closing at $20 billion, in a fundraising environment where several large infrastructure vehicles have struggled to hit target, is a specific signal that institutional allocators still treat energy transition infrastructure as a distinct, oversubscribed category rather than a subset of general infrastructure they are deprioritizing.",
    capitalImplication: "The named commitments, sovereign and quasi sovereign capital from ALTÉRRA and Norges Bank, indicate the investor base for transition infrastructure at this scale remains concentrated among the largest, most patient pools of capital, a relevant data point for smaller managers assuming the same investor appetite exists at their scale.",
    developmentImplication: "A fund this size needs deployable scale, which typically means larger individual asset checks and a preference for platforms and portfolios over single assets, project sponsors should calibrate what check size and structure actually clears this kind of capital's bar.",
    whatWeAreWatching: [
      "Brookfield's initial deployment pace and asset types out of Fund II.",
      "Whether other large managers announce comparably sized transition specific vehicles in response.",
      "Whether the gap between headline fundraising totals like this one and broader infrastructure fundraising softness elsewhere in the market persists or narrows.",
    ],
    sources: [
      { label: "Brookfield Raises $20 billion for Record Transition Fund, Brookfield Asset Management", url: "https://bam.brookfield.com/press-releases/brookfield-raises-20-billion-record-transition-fund" },
      { label: "Brookfield surpasses target to close BGTF II on $20bn, Infrastructure Investor", url: "https://www.infrastructureinvestor.com/brookfield-surpasses-target-to-close-bgtf-ii-on-20bn/" },
    ],
    img: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b4/High_voltage_transmission_towers_and_lines.jpg/1280px-High_voltage_transmission_towers_and_lines.jpg",
    imgAlt: "High-voltage electricity transmission towers and lines",
  },
  {
    slug: "green-building-benchmarking-hit-record-participation-in-2025-scores-still-diverged-sharply",
    date: "August 2026",
    archiveDate: "2025-10",
    eventDate: "2025-10-01",
    title: "Green building benchmarking hit record participation in 2025. Scores still diverged sharply",
    deck: "Over 2,300 entities completed GRESB's real estate assessment this year, and new entrants scored higher than ever on their first attempt. The remaining question is whether rising floor scores reflect real performance gains or better reporting.",
    entryType: "Data Note",
    category: "Real Estate & Built Environment",
    lens: "Measurement & Verification",
    region: "Global",
    body: [
      "GRESB released final 2025 Real Estate Benchmark Reports to participants on 1 October 2025, following a preliminary results release and correction window that opened 1 September. The assessment drew 1,002 fund managers submitting 2,382 assessments, a roughly 15 percent increase in total participation over 2024, including 239 entities in an inaugural residential component. New entrants to the benchmark scored an average of 68 in their first year, up 6 points from 2024's first year average, and GRESB reported score increases across the board, which it attributed to stronger management practices and deeper data engagement rather than a change in scoring methodology.",
    ],
    keySignal: "GRESB's 2025 Real Estate Benchmark drew 2,382 assessments from 1,002 fund managers, a roughly 15 percent participation increase over 2024, with new entrants averaging a first year score of 68, up 6 points from the prior year's new entrant average.",
    whyItMatters: "A rising first year average score for new entrants is the more informative number here. It suggests the entities newly choosing to participate already have stronger underlying management practices in place, which is different from, and harder to fake than, existing participants' scores improving year over year under the same reporting incentives.",
    capitalImplication: "Investors using GRESB scores as an underwriting input should weight the new entrant data specifically, since it is less exposed to the reporting sophistication effects that can inflate returning participants' year over year gains without a matching change in physical asset performance.",
    developmentImplication: "Owners who have not yet participated in GRESB face a rising bar, waiting to enter no longer means competing against a lower historical average, first year entrants in 2025 are already scoring close to what took returning participants several assessment cycles to reach previously.",
    whatWeAreWatching: [
      "Whether the 2026 benchmark shows participation growth continuing or plateauing after this year's jump.",
      "Sector level divergence, healthcare's reported energy efficiency lead over other sectors specifically.",
      "Whether GRESB or a comparable body moves to separate reporting quality from physical performance more explicitly in future scoring methodology.",
    ],
    sources: [
      { label: "2025 Real Estate Assessment Results, GRESB", url: "https://www.gresb.com/2025-real-estate-assessment-results/" },
      { label: "GRESB 2025 Benchmarks reflect industry maturity and continued progress toward responsible investing, GRESB", url: "https://www.gresb.com/nl-en/insights/gresb-2025-benchmarks-reflect-industry-maturity-and-continued-progress-toward-responsible-investing/" },
    ],
    img: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/Chicago_City_Hall_green_roof_edit.jpg/1280px-Chicago_City_Hall_green_roof_edit.jpg",
    imgAlt: "The green roof atop Chicago City Hall",
  },
  {
    slug: "usda-puts-700-million-behind-a-single-regenerative-framework",
    date: "August 2026",
    archiveDate: "2025-12",
    eventDate: "2025-12-10",
    title: "USDA puts $700 million behind a single regenerative framework instead of scattered practice payments",
    deck: "The new Regenerative Pilot Program lets farmers bundle cover crops, managed grazing, and other practices into one application. The bundling, not the funding total, is the more interesting design choice.",
    entryType: "Policy Note",
    category: "Land & Regenerative Agriculture",
    lens: "Policy & Regulation",
    region: "North America",
    body: [
      "USDA and the Department of Health and Human Services announced the Regenerative Pilot Program on 10 December 2025, directing $700 million, $400 million through the Environmental Quality Incentives Program and $300 million through the Conservation Stewardship Program, toward whole farm regenerative planning administered by the Natural Resources Conservation Service. Rather than farmers applying separately for individual practice payments, the program lets them bundle multiple practices, cover crops and managed grazing among the examples USDA cited, into a single application addressing soil, water, and land health together. HHS's involvement is tied to its Make America Healthy Again strategy, which included a dedicated section on soil health and land stewardship, and a new Chief's Regenerative Agriculture Advisory Council will meet quarterly to guide implementation.",
    ],
    keySignal: "USDA's Regenerative Pilot Program, announced 10 December 2025, directs $700 million ($400 million EQIP, $300 million CSP) toward a bundled, whole farm application process for regenerative practices, administered by NRCS with a new quarterly advisory council.",
    whyItMatters: "Conservation program design has historically paid for individual practices in isolation, a cover crop payment here, a grazing plan there, which fragments what is usually a single farm level decision into multiple applications and separate monitoring regimes. A bundled, whole farm application is a delivery mechanism change, not just a funding increase, and delivery mechanism changes are usually what determines actual adoption rates more than the headline dollar figure.",
    capitalImplication: "A federal program explicitly organized around whole farm regenerative planning gives private capital, farmland funds, transition finance vehicles, corporate supply chain programs, a public underwriting framework to reference rather than building bespoke practice verification from scratch on every deal.",
    developmentImplication: "Farmland managers and lenders evaluating regenerative transition now have a federal cost share structure to layer alongside private capital, which changes the blended capital stack math for transition financing specifically.",
    whatWeAreWatching: [
      "Uptake rates once the application window opens, against the $700 million allocation.",
      "How the quarterly Advisory Council's guidance shapes which practices qualify for bundling.",
      "Whether private transition finance vehicles explicitly structure around this program as a co-funding source.",
    ],
    sources: [
      { label: "USDA Launches New Regenerative Pilot Program, USDA", url: "https://www.usda.gov/about-usda/news/press-releases/2025/12/10/usda-launches-new-regenerative-pilot-program-lower-farmer-production-costs-and-advance-maha-agenda" },
      { label: "USDA and DHHS announce $700 million Regenerative Pilot Program, Agweek", url: "https://www.agweek.com/news/policy/usda-and-dhhs-announce-700-million-regenerative-pilot-program" },
    ],
    img: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/Hairy_vetch_cover_crop.jpg/960px-Hairy_vetch_cover_crop.jpg",
    imgAlt: "Hairy vetch cover crop growing between rows in a California orchard",
  },
  {
    slug: "us-battery-storage-installations-broke-records-for-the-second-straight-year",
    date: "August 2026",
    archiveDate: "2025-12",
    title: "US battery storage installations broke records for the second straight year",
    deck: "18.9 gigawatts of battery storage went into the US grid in 2025, 52 percent more than 2024, spread across 13 states rather than concentrated in the usual two.",
    entryType: "Data Note",
    category: "Energy",
    lens: "Asset Economics",
    region: "North America",
    body: [
      "The American Clean Power Association and Wood Mackenzie's U.S. Energy Storage Monitor, published 24 March 2026, recorded 18.9 gigawatts of battery energy storage system installations across the United States in 2025, a 52 percent increase over 2024 and the largest annual total on record. Utility scale storage accounted for most of that growth, and the fourth quarter alone set a new quarterly record at 5.8 gigawatts, with utility scale installations up 31 percent year over year. New activity spread across 13 different states, a shift the report frames as diversification beyond the historical concentration in California and Texas.",
    ],
    keySignal: "ACP and Wood Mackenzie's U.S. Energy Storage Monitor recorded 18.9 GW of battery storage installed in the US in 2025, up 52 percent from 2024, with Q4 2025 setting a new quarterly record of 5.8 GW and installations spreading across 13 states.",
    whyItMatters: "A 52 percent single year increase, on top of an already growing base, means storage co-location is moving from a project specific decision to a default assumption for new generation in most US markets. The state diversification detail matters as much as the topline number, since it signals the economics are starting to work outside the two markets that had the most favorable rate structures and permitting environments.",
    systemConnection: "Storage deployment at this scale interacts directly with the interconnection queue constraints we have tracked as the binding factor on new generation, storage can sometimes qualify for faster interconnection paths than paired generation, which is reshaping how projects are sequenced and permitted.",
    developmentImplication: "Projects in the 11 states outside the historical California and Texas concentration should reassess whether storage co-location assumptions that looked marginal a year or two ago still hold, given how fast the deployment base has shifted.",
    whatWeAreWatching: [
      "Whether the pace of state diversification continues or concentrates again as tax and trade policy settles.",
      "Interconnection queue data specifically for storage versus paired generation applications.",
      "The next annual report's read on whether 2025's growth rate is sustainable or a one time catch up.",
    ],
    sources: [
      { label: "REPORT: 2025 U.S. Energy Storage Installations Set New Record, Surpass 2024 by 52%, American Clean Power Association", url: "https://cleanpower.org/news/report-2025-u-s-energy-storage-installations-set-new-record-surpass-2024-by-52/" },
    ],
    img: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/de/Container-based_energy_storage_system_commissioning.jpg/1280px-Container-based_energy_storage_system_commissioning.jpg",
    imgAlt: "Technicians commissioning a container-based battery energy storage system",
  },
  {
    slug: "solar-import-duties-on-four-countries-reset-where-panels-get-sourced",
    date: "August 2026",
    archiveDate: "2024-12",
    eventDate: "2024-12-04",
    title: "Solar import duties on four countries reset where panels get sourced",
    deck: "Preliminary antidumping and countervailing duties on solar cells from Cambodia, Malaysia, Thailand, and Vietnam took effect in December, on top of existing Section 201 tariffs. Procurement teams had already started moving before the final determination followed months later.",
    entryType: "Policy Note",
    category: "Energy",
    lens: "Policy & Regulation",
    region: "North America",
    body: [
      "The US Department of Commerce's preliminary antidumping determination on crystalline silicon photovoltaic cells from Cambodia, Malaysia, Thailand, and Vietnam took effect 4 December 2024, applying duties to solar cell imports from those countries on top of the existing Section 201 tariffs already in place on imported panels generally. Commerce had opened the investigation in May 2024 after US manufacturers alleged the four countries were being used to route Chinese-linked production around existing China specific duties, and preliminary countervailing duties had already been placed on companies in all four countries that fall. Commerce's final affirmative determination followed on 21 April 2025, confirming that imports from all four countries were being dumped and had received countervailable subsidies, in several cases traced to transnational subsidies from the Chinese government.",
    ],
    keySignal: "Commerce's preliminary antidumping determination on solar cells from Cambodia, Malaysia, Thailand, and Vietnam took effect 4 December 2024, layering onto existing Section 201 tariffs, with a final affirmative determination following 21 April 2025 that found transnational subsidies traced to China in several cases.",
    whyItMatters: "A preliminary determination changes procurement economics well before the final ruling lands, since duty liability typically applies retroactively to the preliminary determination date. Developers and EPC contractors sourcing from these four countries were exposed to duty risk on shipments from early December 2024 forward, months before the final rate was actually known.",
    capitalImplication: "Projects with module supply contracts signed against these four countries before December 2024 needed to reassess landed cost assumptions immediately, not wait for the April 2025 final determination, since the financial exposure was already live.",
    developmentImplication: "Procurement teams that had already diversified sourcing beyond the four named countries before the preliminary determination absorbed materially less disruption than those that had concentrated supply chains there, a diligence question worth asking on any project financed in this window.",
    whatWeAreWatching: [
      "Sourcing shifts to countries not named in this determination, and whether Commerce opens further country specific investigations.",
      "The Section 201 tariff's own scheduled expiration in February 2026 and whether that changes the net duty picture.",
      "Module pricing data as the market absorbs the final determination's confirmed rates.",
    ],
    sources: [
      { label: "U.S. Department of Commerce Announces Final Determinations in the Antidumping and Countervailing Duty Investigations of Solar Panels From Multiple Countries, International Trade Administration", url: "https://www.trade.gov/press-release/us-department-commerce-announces-final-determinations-antidumping-and-countervailing" },
    ],
    img: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/Line3174_-_Shipping_Containers_at_the_terminal_at_Port_Elizabeth%2C_New_Jersey_-_NOAA.jpg/1280px-Line3174_-_Shipping_Containers_at_the_terminal_at_Port_Elizabeth%2C_New_Jersey_-_NOAA.jpg",
    imgAlt: "Shipping containers stacked at a US port terminal",
  },
  {
    slug: "a-waste-incinerator-carbon-capture-retrofit-got-a-buyer-before-it-had-a-capture-system",
    date: "August 2026",
    archiveDate: "2025-07",
    eventDate: "2025-07-11",
    title: "A waste incinerator's carbon capture retrofit got a buyer before it had a capture system",
    deck: "Microsoft agreed to buy 2.95 million tonnes of carbon removal from a Danish waste-to-energy plant's planned carbon capture retrofit, years before the capture equipment exists. The offtake, not the technology, is what makes the retrofit financeable.",
    entryType: "Capital Note",
    category: "Waste & Circular Materials",
    secondaryCategory: "Capital Markets & Real Assets",
    lens: "Capital & Finance",
    region: "Europe",
    country: "Denmark",
    body: [
      "Microsoft signed an agreement on 11 July 2025 to purchase up to 2.95 million tonnes of carbon removal credits, delivered over time beginning in 2029, from Gaia ProjectCo, a joint venture between Copenhagen Infrastructure Partners and Danish waste-to-energy company Vestforbrænding. Gaia's project retrofits a waste incineration plant with bioenergy carbon capture and storage technology designed to capture up to 500,000 tonnes of CO2 annually, and the retrofit itself has not yet been built, Microsoft's purchase agreement is what gives Copenhagen Infrastructure Partners the long-term revenue certainty needed to move the project to financing.",
    ],
    keySignal: "Microsoft agreed on 11 July 2025 to purchase up to 2.95 million tonnes of carbon removal credits from Gaia ProjectCo's planned carbon capture retrofit of a Danish waste-to-energy plant, with deliveries beginning in 2029, before the capture equipment has been built.",
    whyItMatters: "A capture retrofit on an operating waste-to-energy plant is a straightforward engineering proposition and a genuinely difficult financing one, since there was previously no reliable long-term revenue stream to underwrite the capital cost against. A multi-year corporate offtake agreement signed before construction is what converts the retrofit from a subsidy-dependent proposition into one with a contracted revenue base, the same structural shift EPR fees are creating for textile recycling.",
    systemConnection: "This retrofit sits directly on existing waste-to-energy infrastructure rather than requiring new siting or permitting, which is a meaningfully faster path to deployed carbon capture capacity than greenfield projects, worth tracking against how many other operating waste-to-energy plants in similar regulatory environments could support the same retrofit economics.",
    capitalImplication: "The offtake buyer here is a single large corporate balance sheet, not a diversified pool of credit buyers, concentration risk in the buyer base is a real factor in how replicable this specific financing structure is for smaller waste-to-energy operators without access to a Microsoft scale counterparty.",
    whatWeAreWatching: [
      "Financial close and construction milestones for the capture retrofit itself, distinct from the offtake agreement already signed.",
      "Whether other waste-to-energy operators secure comparable long-term offtake agreements to finance their own capture retrofits.",
      "Pricing detail on the offtake agreement as it becomes available, to assess whether this structure is replicable at a lower buyer concentration.",
    ],
    sources: [
      { label: "Microsoft Signs Landmark Carbon Removal Deal with CIP, Vestforbrænding's Gaia Project, ESG News", url: "https://esgnews.com/microsoft-signs-landmark-carbon-removal-deal-with-cip-vestforbraendings-gaia-project/" },
      { label: "Microsoft Signs Deal for 3 Million Tons of CO2 Removal Generated Through New Waste-to-Energy Carbon Capture Project, ESG Today", url: "https://www.esgtoday.com/microsoft-signs-deal-for-3-million-tons-of-co2-removal-generated-through-new-waste-to-energy-carbon-capture-project/" },
    ],
    img: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Amagerv%C3%A6rket_%28K%C3%B8benhavn%29.JPG/1280px-Amagerv%C3%A6rket_%28K%C3%B8benhavn%29.JPG",
    imgAlt: "Amagerværket, a combined heat and power plant in Copenhagen, Denmark",
  },
  {
    slug: "the-first-major-institutional-farmland-reit-is-a-structure-story-not-just-a-fundraise",
    date: "August 2026",
    archiveDate: "2025-09",
    eventDate: "2025-09-22",
    title: "The first major institutional farmland REIT is a structure story, not just a fundraise",
    deck: "Nuveen launched a 3 billion dollar non-traded farmland REIT, the first from a major institutional manager. The perpetual-life, non-traded structure is what makes farmland accessible to a wider investor base than the closed-end funds that came before it.",
    entryType: "Capital Note",
    category: "Land & Regenerative Agriculture",
    secondaryCategory: "Capital Markets & Real Assets",
    lens: "Capital & Finance",
    region: "North America",
    country: "United States",
    body: [
      "Nuveen launched a private, non-listed, perpetual-life farmland REIT on 22 September 2025, targeting up to $3 billion from accredited investors, the first non-traded investment vehicle specializing in farmland from a major institutional manager. The REIT will focus on row crop farmland, corn, soybeans, wheat, and cotton, with exposure to California's Central Valley among its stated holdings, and sits inside Nuveen Natural Capital, the firm's farmland investment arm, which managed $13.1 billion across 3 million acres globally as of year end 2024. Nuveen's SEC filing cited rising global food demand as an investment driver, entering a market where cropland values averaged $5,830 per acre in 2025, up 4.7 percent from 2024, the fifth straight year of increases though at a slowing rate.",
    ],
    keySignal: "Nuveen launched a $3 billion target, non-traded, perpetual-life farmland REIT on 22 September 2025, the first such vehicle from a major institutional manager, sitting inside a farmland platform that already managed $13.1 billion across 3 million acres as of year end 2024.",
    whyItMatters: "Farmland institutional capital has historically arrived through closed-end funds with defined exit timelines, which structurally mismatches an asset class where value is built over multi-decade soil and water investment horizons. A perpetual-life, non-traded REIT removes that mismatch and, more practically, opens farmland exposure to the accredited investor and wealth management channel that closed-end institutional funds rarely reach.",
    capitalImplication: "A major manager committing its own platform brand to a non-traded farmland structure is a signal other managers evaluating farmland fund structures will read closely, if this vehicle raises well, expect more non-traded farmland structures from other platforms within the following fund cycle.",
    developmentImplication: "Farmland transition and regenerative practice financing, which typically needs a longer horizon than a closed-end fund's hold period naturally supports, is easier to underwrite inside a perpetual-life vehicle, this structure is worth watching specifically for how it treats transition capital.",
    whatWeAreWatching: [
      "Fundraising progress against the $3 billion target over the coming fund cycles.",
      "Whether the vehicle's stated Central Valley exposure comes with water rights specifics that clear our own diligence bar.",
      "Competing non-traded farmland vehicle launches from other institutional managers.",
    ],
    sources: [
      { label: "Nuveen launches farmland REIT as agricultural property values grow, CoStar", url: "https://www.costar.com/article/1394793197/nuveen-launches-farmland-reit-as-agricultural-property-values-grow" },
      { label: "Nuveen Launches Farmland REIT Seeking $3B From Investors, GlobeSt", url: "https://www.globest.com/2025/09/25/nuveen-launches-farmland-reit-seeking-3b-from-investors/" },
    ],
    img: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fd/Central_Valley%2C_California_%2820950415334%29.jpg/1280px-Central_Valley%2C_California_%2820950415334%29.jpg",
    imgAlt: "Aerial view of farmland in California's Central Valley",
  },
  {
    slug: "a-federal-freeze-and-release-showed-how-fragile-farm-energy-funding-really-is",
    date: "August 2026",
    archiveDate: "2025-03",
    eventDate: "2025-03-26",
    title: "A federal freeze and release showed how fragile farm energy funding really is",
    deck: "USDA froze $911 million in obligated rural energy grants in January, then released them in March with a catch: recipients had to revise projects to align with a new executive order. The conditional release is the more durable lesson than the freeze itself.",
    entryType: "Policy Note",
    category: "Land & Regenerative Agriculture",
    secondaryCategory: "Energy",
    lens: "Policy & Regulation",
    region: "North America",
    body: [
      "Following a 20 January 2025 executive order on American energy, USDA froze more than $911 million in previously obligated Rural Energy for America Program grants, funding farmers and rural small businesses had already been awarded for solar and other on-farm energy projects. USDA announced the release of the frozen funds on 26 March 2025, but attached a condition: recipients had 30 days to voluntarily revise their project plans to align with the administration's energy executive order, which favors fossil fuel development, or risk the funding remaining unavailable. Farmers who had already committed capital or signed contracts against the original grant terms spent the intervening two months with obligated federal funding they could not access.",
    ],
    keySignal: "USDA froze $911 million in obligated REAP grants after a 20 January 2025 executive order, then released the funds on 26 March 2025 conditional on recipients voluntarily revising their project plans within 30 days to align with the new energy policy.",
    whyItMatters: "A grant that has been formally obligated is not, in practice, the same thing as capital a farmer can actually rely on, this freeze demonstrated that even signed federal commitments carry policy risk that shifts with the administration in office. That is a real, quantifiable risk factor for any capital stack that assumes federal cost share as a stable input, not a footnote.",
    capitalImplication: "Private lenders and transition finance vehicles that had underwritten projects assuming REAP funding would arrive on the original schedule absorbed a two month gap, and in some cases a forced project redesign, that a purely private capital stack would not have faced.",
    developmentImplication: "Farm energy projects structured with REAP as a funding layer should now model federal cost share as conditional and revisable, not guaranteed once obligated, and build contingency financing for a comparable gap into future project timelines.",
    whatWeAreWatching: [
      "How many REAP recipients actually revised their project plans versus forfeited the funding.",
      "Whether the conditional release approach is applied to other previously obligated USDA rural energy programs.",
      "Private lenders' underwriting language for federal cost share commitments going forward.",
    ],
    sources: [
      { label: "USDA Delivers on Rural Energy Commitments, Provides Path for Applicants to Support U.S. Energy Independence, USDA", url: "https://www.usda.gov/about-usda/news/press-releases/2025/03/25/usda-delivers-rural-energy-commitments-provides-path-applicants-support-us-energy-independence" },
      { label: "USDA Begins Releasing Frozen REAP Funding, National Sustainable Agriculture Coalition", url: "https://sustainableagriculture.net/blog/usda-begins-releasing-frozen-reap-funding/" },
    ],
    img: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fc/Solar_panel_installation_at_Grange_farm.jpg/1280px-Solar_panel_installation_at_Grange_farm.jpg",
    imgAlt: "Workers installing solar panels on a barn roof at a farm",
  },
  {
    slug: "the-nations-first-direct-to-distribution-water-reuse-plant-broke-ground",
    date: "August 2026",
    archiveDate: "2025-02",
    eventDate: "2025-02-28",
    title: "The nation's first direct-to-distribution water reuse plant broke ground",
    deck: "El Paso started construction on a 295 million dollar facility that will pipe purified wastewater straight into the drinking water system, no environmental buffer required. The regulatory approval, not the treatment technology, is the harder part other cities will have to replicate.",
    entryType: "Field Note",
    category: "Water Systems",
    lens: "Project Delivery",
    region: "North America",
    country: "United States",
    body: [
      "El Paso Water broke ground on its Pure Water Center on 28 February 2025, an advanced purification facility designed to add 10 million gallons of drinking water per day directly to the city's distribution system, the first direct-to-distribution water reuse facility of its kind in the country. The $295 million project uses membrane filtration, reverse osmosis, ultraviolet light with advanced oxidation, and granular activated carbon filtration in sequence before the water reaches the drinking supply, bypassing the environmental buffer, an aquifer or reservoir storage period, that most water reuse projects still rely on to satisfy regulators. Construction is expected to complete in 2028.",
    ],
    keySignal: "El Paso Water broke ground 28 February 2025 on a $295 million, 10 million gallon per day Pure Water Center, the first US facility approved to purify wastewater and pipe it directly into a drinking water distribution system without an environmental buffer.",
    whyItMatters: "The treatment technology behind direct-to-distribution reuse is not new, membrane filtration and reverse osmosis are established. What is genuinely new is regulatory approval to skip the environmental buffer entirely, which is the step that has kept most water reuse projects indirect. That regulatory precedent, once established in Texas, is what other water stressed cities will actually study, not the plant's engineering.",
    systemConnection: "A water utility willing to build the most technically demanding form of reuse is itself a signal about how tight that region's water constraint actually is, El Paso's move here says more about the underlying resource picture in the Chihuahuan Desert than any standalone drought report would.",
    developmentImplication: "Development in water stressed regions increasingly needs to account for a longer list of water sourcing options than groundwater and imported surface water, direct-to-distribution reuse capacity, once permitted precedent exists, changes what water availability actually means for a given site's underwriting.",
    whatWeAreWatching: [
      "Whether other Texas or Southwestern utilities pursue direct-to-distribution permits now that a precedent exists.",
      "Construction progress and cost against the 2028 target and $295 million budget.",
      "Public acceptance data as the facility moves toward commissioning, historically the harder obstacle for direct reuse projects than the engineering itself.",
    ],
    sources: [
      { label: "El Paso Water breaks ground on nation's first direct-to-distribution water reuse facility, PCL Construction", url: "https://www.pcl.com/us/en/newsroom/press-releases/el-paso-water-breaks-ground-on-nations-first-direct-to-distribution-water-reuse-facility" },
      { label: "As it seeks to drought-proof El Paso, city's water utility breaks ground on first-of-its-kind water recycling plant, El Paso Matters", url: "https://elpasomatters.org/2025/03/09/el-paso-water-sewage-purification-plant/" },
    ],
    img: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/77/Reverse_Osmosis_Plant.JPG/960px-Reverse_Osmosis_Plant.JPG",
    imgAlt: "Reverse osmosis water treatment plant equipment",
  },
  {
    slug: "a-radar-satellite-two-space-agencies-spent-a-decade-building-finally-flew",
    date: "August 2026",
    archiveDate: "2025-07",
    eventDate: "2025-07-30",
    title: "A radar satellite two space agencies spent a decade building finally flew",
    deck: "NISAR launched in July after antenna problems pushed the NASA-ISRO mission past its original 2024 target. Its dual-band radar can track land and forest change at a resolution and revisit rate no single-agency mission has matched.",
    entryType: "Data Note",
    category: "Orbital & Environmental Intelligence",
    lens: "Technology & Infrastructure",
    region: "Asia-Pacific",
    country: "India",
    body: [
      "NISAR, a joint NASA-ISRO Earth observation satellite, launched on 30 July 2025 aboard ISRO's GSLV-F16 rocket from the Satish Dhawan Space Centre, after delays pushed the mission past its originally targeted 2024 launch when the satellite's 12-meter radar antenna reflector was sent back to NASA's Jet Propulsion Laboratory over overheating concerns. NISAR carries both an L-band radar, built by NASA, and an S-band radar, built by ISRO, the first satellite to fly dual-frequency synthetic aperture radar, letting it measure land surface and vegetation change with a level of detail neither agency's radar alone would provide.",
    ],
    keySignal: "NISAR launched 30 July 2025 on ISRO's GSLV-F16 after delays from an antenna reflector issue pushed it past its original 2024 target, carrying the first dual-frequency (L-band and S-band) synthetic aperture radar flown on a single Earth observation satellite.",
    whyItMatters: "A multi-year technical delay on a flagship joint mission is a reminder that even the best resourced Earth observation programs are not immune to the kind of single point of failure risk we flagged with MethaneSAT's loss the same year, hardware readiness, not funding or ambition, was NISAR's actual constraint.",
    systemConnection: "Dual-band radar data is directly relevant to the land and agricultural monitoring thread we track under this category, L-band radar in particular penetrates vegetation canopy better than the higher frequency bands most existing satellites use, which matters for forest biomass and soil moisture measurement specifically.",
    developmentImplication: "Long horizon land and forestry positions that have been waiting on better canopy penetrating radar data now have a live data source to evaluate, once NISAR completes commissioning and data begins flowing to end users.",
    whatWeAreWatching: [
      "NISAR's commissioning timeline and when its data becomes available to commercial and research users.",
      "Whether the dual-band approach demonstrates a measurable advantage over single-band radar missions already in service.",
      "Any further hardware issues during the mission's commissioning phase, given the antenna problems that delayed launch.",
    ],
    sources: [
      { label: "ISRO's GSLV-F16 will launch ISRO-NASA joint satellite, NISAR, on July 30, 2025, ISRO", url: "https://www.isro.gov.in/Mission_GSLVF16_NISAR.html" },
      { label: "Mission Overview, NASA Science", url: "https://science.nasa.gov/mission/nisar/mission-overview/" },
    ],
    img: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c6/GSLV_F11_GSAT-7A_campaign-_Vehicle_roll_out_03.jpg/1280px-GSLV_F11_GSAT-7A_campaign-_Vehicle_roll_out_03.jpg",
    imgAlt: "An ISRO GSLV rocket being rolled out to its launch pad at Satish Dhawan Space Centre",
  },
  {
    slug: "a-real-estate-brokerage-bought-its-way-into-power-and-digital-infrastructure",
    date: "August 2026",
    archiveDate: "2025-11",
    eventDate: "2025-11-04",
    title: "A real estate brokerage bought its way into power and digital infrastructure",
    deck: "CBRE paid 1.2 billion dollars for a digital and power infrastructure services firm. A company built on leasing and property management just bet that data center and grid infrastructure services are the more durable growth business.",
    entryType: "Capital Note",
    category: "Real Estate & Built Environment",
    secondaryCategory: "Capital Markets & Real Assets",
    lens: "Capital & Finance",
    region: "North America",
    body: [
      "CBRE Group announced on 4 November 2025 that it would acquire Pearce Services, a digital and power infrastructure services business, from New Mountain Capital for approximately $1.2 billion in cash, with a potential earn-out of up to $115 million tied to Pearce meeting performance thresholds in 2027. The deal came in a month where broader commercial real estate transaction volume ran roughly 10 percent below November 2024, even as deals above $100 million rose 51 percent year over year, a divergence that put the largest transactions, including this one, at the center of an otherwise slower market.",
    ],
    keySignal: "CBRE agreed to acquire digital and power infrastructure services firm Pearce Services from New Mountain Capital for approximately $1.2 billion cash on 4 November 2025, with up to $115 million in additional earn-out tied to 2027 performance.",
    whyItMatters: "A traditional real estate services firm acquiring an infrastructure services business, rather than a property portfolio, is a bet that the recurring service revenue behind data center and power infrastructure operations is more durable growth than leasing and brokerage fees in a transaction market that was, in the same month, running below the prior year.",
    capitalImplication: "The earn-out structure, tied specifically to 2027 performance, signals CBRE priced meaningful execution risk into the deal rather than paying entirely for Pearce's current book of business, worth noting as a template for how infrastructure services acquisitions get structured more broadly.",
    developmentImplication: "Real estate operators evaluating their own build versus buy decision on digital and power infrastructure services now have a large, public price reference point for what that capability costs to acquire rather than build organically.",
    whatWeAreWatching: [
      "Whether the earn-out triggers based on 2027 performance, an early read on how the deal is actually performing.",
      "Similar infrastructure-services acquisitions by other large real estate services firms responding to the same demand signal.",
      "Whether the divergence between total transaction volume and large-deal volume persists into 2026.",
    ],
    sources: [
      { label: "CBRE Strikes $1.2 Billion Deal for Digital Infrastructure Firm, Bloomberg", url: "https://www.bloomberg.com/news/articles/2025-11-04/cbre-strikes-1-2-billion-deal-for-digital-infrastructure-firm" },
    ],
    img: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Amazon_Datacenter.jpg/1280px-Amazon_Datacenter.jpg",
    imgAlt: "A data center exterior with electrical infrastructure",
  },
];

function parseDate(dateStr: string): number {
  return new Date(`${dateStr} 1`).getTime();
}

/** Sort/group key: archiveDate ("2024-07") for retrospective research,
 *  otherwise the publication date. This is what "chronological" means for
 *  archive browsing; JSON-LD and on-page bylines always use `date`. */
export function sortTime(post: FieldNote): number {
  if (post.archiveDate) return new Date(`${post.archiveDate}-01`).getTime();
  return parseDate(post.date);
}

export function archiveYear(post: FieldNote): string {
  const source = post.archiveDate ?? post.date;
  const match = source.match(/\d{4}/);
  return match ? match[0] : "";
}

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

/** What a reader should see as "when this is about": the archive period for
 *  retrospective research (formatted "Month YYYY"), otherwise the plain
 *  publication date. Never use raw `date` for card/header display once a
 *  post has an archiveDate, or a 2024 retrospective piece would visually
 *  read as published in 2026. */
export function displayDate(post: FieldNote): string {
  if (post.archiveDate) {
    const [y, m] = post.archiveDate.split("-");
    const monthName = MONTH_NAMES[Number(m) - 1];
    return monthName ? `${monthName} ${y}` : post.archiveDate;
  }
  return post.date;
}

export function isRetrospective(post: FieldNote): boolean {
  return !!post.archiveDate && post.archiveDate.slice(0, 7) !== monthKey(post.date);
}

function monthKey(dateStr: string): string {
  const d = new Date(`${dateStr} 1`);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

export function orderedPosts(posts: FieldNote[] = POSTS): FieldNote[] {
  return [...posts].sort((a, b) => sortTime(b) - sortTime(a));
}

export function getFeaturedPost(): FieldNote {
  return POSTS.find((p) => p.featured) ?? POSTS[POSTS.length - 1];
}

export function getLatestByCategory(category: CategoryName): FieldNote | undefined {
  return [...POSTS]
    .sort((a, b) => parseDate(b.date) - parseDate(a.date))
    .find((p) => p.category === category || p.secondaryCategory === category);
}

export function getRelatedPosts(post: FieldNote, count = 3): FieldNote[] {
  const scored = POSTS.filter((p) => p.slug !== post.slug).map((p) => {
    let score = 0;
    if (p.category === post.category) score += 3;
    if (post.secondaryCategory && (p.category === post.secondaryCategory || p.secondaryCategory === post.secondaryCategory)) score += 2;
    if (p.secondaryCategory && p.secondaryCategory === post.category) score += 2;
    if (p.lens === post.lens) score += 1;
    if (post.tags && p.tags) {
      score += post.tags.filter((t) => p.tags!.includes(t)).length;
    }
    return { post: p, score };
  });
  scored.sort((a, b) => b.score - a.score || parseDate(b.post.date) - parseDate(a.post.date));
  return scored.slice(0, count).map((s) => s.post);
}
