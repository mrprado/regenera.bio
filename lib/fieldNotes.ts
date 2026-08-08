// Field Notes archive data.
//
// Taxonomy (system, lens, region) lives in lib/fieldNotesTaxonomy.ts. See
// content/field-notes/EDITORIAL_SYSTEM.md for the full editorial rules this
// data model exists to support.
//
// The 22 posts below predate this taxonomy rebuild. Their title/date/body/
// img are preserved verbatim (approved copy). They've been assigned a
// system + lens for the new archive, but do NOT carry the newer structured
// fields (keySignal, whyItMatters, sources, etc.) because those require
// real verified sourcing this migration did not fabricate. New posts going
// forward should populate the fuller structure.
import type { LensName, RegionName, SystemName } from "./fieldNotesTaxonomy";

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
  system: SystemName;
  secondarySystem?: SystemName;
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
}

export const POSTS: FieldNote[] = [
  {
    slug: "a-working-definition-and-why-precision-matters",
    date: "January 2025",
    title: "A working definition, and why precision matters",
    deck: "Sustainability and regenerative development are treated as synonyms. They describe different design briefs and different outcomes.",
    system: "Land & Soil",
    lens: "Systems Design",
    legacyCategory: "Regenerative Development",
    body: ["Sustainability sets a floor: reduce harm, hold impact roughly constant. A regenerative design brief sets a different target entirely, that the completed project leaves the measurable condition of a place better than its baseline, soil organic matter, watershed yield, income diversity, not only carbon intensity. The distinction is not semantic. It changes which interventions get funded and how they get measured.", "Our practice begins every engagement with a systems diagnostic across seven interacting layers, land, water, energy, food, community health, the built environment, and orbital monitoring, before any technology or capital decision is made. This archive documents that work as it happens, month by month, across the sectors and geographies where we operate."],
    img: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1f/Mangrove_forest_reforestation.jpg/1280px-Mangrove_forest_reforestation.jpg",
    imgAlt: "Mangrove forest restoration",
  },
  {
    slug: "designing-for-maximum-solar-capture-by-latitude-and-by-season",
    date: "February 2025",
    title: "Designing for maximum solar capture, by latitude and by season",
    deck: "Two sites with identical panel counts can differ in annual yield by 15 percent or more, purely on tilt, azimuth, and tracking design matched to local irradiance.",
    system: "Energy & Waste",
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
    system: "Land & Soil",
    secondarySystem: "Energy & Waste",
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
    system: "Water",
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
    system: "Energy & Waste",
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
    system: "Built Environment",
    lens: "Policy & Standards",
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
    system: "Built Environment",
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
    system: "Energy & Waste",
    lens: "Policy & Standards",
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
    system: "Land & Soil",
    lens: "Capital & Markets",
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
    system: "Orbital Intelligence",
    secondarySystem: "Land & Soil",
    lens: "Measurement & Verification",
    legacyCategory: "Orbital & Earth Observation",
    body: ["Soil moisture, canopy cover, water level, and land use change are now measurable from orbit at asset resolution, which closes a verification gap that previously depended on periodic site visits and operator-reported figures. For land backed capital structures with ten- and twenty-year horizons, this kind of independent, repeatable measurement is moving from a differentiator to a diligence requirement.", "We treat satellite-enabled monitoring as a standing tool now, applied alongside the Five Capitals assessment on any engagement where the underlying land condition is itself the asset being underwritten."],
    img: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/ISS-43_Earth_view_from_the_cupola_onboard_the_ISS.jpg/1280px-ISS-43_Earth_view_from_the_cupola_onboard_the_ISS.jpg",
    imgAlt: "Earth observed from the Cupola of the International Space Station",
  },
  {
    slug: "charging-infrastructure-is-a-land-use-and-grid-planning-decision",
    date: "October 2025",
    title: "Charging infrastructure is a land use and grid-planning decision",
    deck: "EV charging is typically scoped as a technology deployment. The siting decision behind it determines development patterns for a decade.",
    system: "Built Environment",
    secondarySystem: "Energy & Waste",
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
    system: "Community & Health",
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
    system: "Community & Health",
    secondarySystem: "Built Environment",
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
    system: "Land & Soil",
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
    system: "Land & Soil",
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
    system: "Energy & Waste",
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
    system: "Water",
    secondarySystem: "Energy & Waste",
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
    system: "Energy & Waste",
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
    system: "Built Environment",
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
    system: "Energy & Waste",
    lens: "Asset Economics",
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
    system: "Orbital Intelligence",
    lens: "Measurement & Verification",
    legacyCategory: "Orbital & Earth Observation",
    body: ["Two years ago, satellite-enabled verification was something we offered selectively on land and agriculture positions. It is now a standard request on energy and real estate diligence as well, ahead of an introduction proceeding to term sheet.", "We expect this trajectory to continue, which is why orbital sustainability sits alongside the other six layers in our ecosystem framework as a standing discipline, not an add-on service."],
    img: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/Earth%27s_City_Lights_by_DMSP%2C_1994-1995_%28large%29.jpg/1280px-Earth%27s_City_Lights_by_DMSP%2C_1994-1995_%28large%29.jpg",
    imgAlt: "Composite satellite view of Earth's city lights at night",
  },
  {
    slug: "what-the-eus-finalized-disclosure-rules-mean-for-real-asset-underwriting",
    date: "August 2026",
    title: "What the EU's finalized disclosure rules mean for real asset underwriting",
    deck: "With the Omnibus I Directive published in February, European sustainability disclosure now has a narrower, clearer scope. That clarity is starting to show up in how real asset deals are structured.",
    system: "Built Environment",
    lens: "Capital & Markets",
    region: "Europe",
    legacyCategory: "Capital Markets & Real Assets",
    featured: true,
    body: ["The finalized rules raise CSRD's mandatory threshold to companies above 1,000 employees and roughly €450 million turnover, removing a large share of mid market real estate and infrastructure vehicles from mandatory scope entirely. For sponsors below that threshold, disclosure is now a deliberate positioning choice rather than a compliance default, and the sponsors choosing to disclose voluntarily are, in our experience this year, the ones underwriting fastest with institutional counterparties who no longer assume the paperwork will arrive automatically.", "Heading into the second half of the year, our capital introduction conversations increasingly start with this question directly: what can this sponsor actually prove, independent of what they are legally required to file. That is a higher bar than compliance, and it is the one that is starting to determine access to capital."],
    img: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Planta_Solar_Fotovoltaica_Yunchar%C3%A1.jpg/1280px-Planta_Solar_Fotovoltaica_Yunchar%C3%A1.jpg",
    imgAlt: "Utility-scale solar plant under wide skies",
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

export function getLatestBySystem(system: SystemName): FieldNote | undefined {
  return [...POSTS]
    .sort((a, b) => parseDate(b.date) - parseDate(a.date))
    .find((p) => p.system === system || p.secondarySystem === system);
}

export function getRelatedPosts(post: FieldNote, count = 3): FieldNote[] {
  const scored = POSTS.filter((p) => p.slug !== post.slug).map((p) => {
    let score = 0;
    if (p.system === post.system) score += 3;
    if (post.secondarySystem && (p.system === post.secondarySystem || p.secondarySystem === post.secondarySystem)) score += 2;
    if (p.secondarySystem && p.secondarySystem === post.system) score += 2;
    if (p.lens === post.lens) score += 1;
    if (post.tags && p.tags) {
      score += post.tags.filter((t) => p.tags!.includes(t)).length;
    }
    return { post: p, score };
  });
  scored.sort((a, b) => b.score - a.score || parseDate(b.post.date) - parseDate(a.post.date));
  return scored.slice(0, count).map((s) => s.post);
}
