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
  {
    slug: "eu-sustainability-disclosure-law-outpaced-its-own-transposition-deadline",
    date: "August 2026",
    archiveDate: "2024-07",
    eventDate: "2024-07-06",
    title: "Europe's sustainability disclosure law outpaced its own transposition deadline",
    deck: "Member states had until 6 July 2024 to write the Corporate Sustainability Reporting Directive into national law. Most did not, and the gap between legal force and legal reality became the story.",
    system: "Built Environment",
    lens: "Policy & Standards",
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
    system: "Land & Soil",
    secondarySystem: "Food Systems",
    lens: "Capital & Markets",
    region: "North America",
    body: [
      "Farmland LP announced on 11 September 2024 that Microsoft's Climate Innovation Fund had invested in Vital Farmland III, the manager's third value add fund, targeting $250 million and built around converting conventional farmland to organic and regenerative management. The capital will help Farmland LP acquire additional acreage across its existing footprint of more than 18,500 acres in Washington, Oregon, and California, and fund development of soil carbon credits under Verra's Verified Carbon Standard across that same portfolio.",
    ],
    keySignal: "Microsoft's Climate Innovation Fund invested in Farmland LP's Vital Farmland III fund, targeting $250 million, with part of the capital earmarked specifically to develop Verra certified soil carbon credits across the manager's 18,500 acre portfolio.",
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
    system: "Community & Health",
    secondarySystem: "Energy & Waste",
    lens: "Policy & Standards",
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
    system: "Food Systems",
    secondarySystem: "Land & Soil",
    lens: "Capital & Markets",
    region: "Global",
    body: [
      "OP2B, a coalition of 26 food and agriculture companies with a combined market value of roughly $893 billion, marked its fifth year in September 2024 with a progress report tallying $3.6 billion in transition finance for regenerative agriculture deployed between 2019 and 2023. That capital, alongside 72 member programs, had reached 3.9 million hectares and roughly 300,000 farmers, against a stated coalition target of 12.5 million hectares by 2030. The same report identified an annual funding gap of $300 billion to move global agriculture onto a more sustainable footing, and noted that only 47 percent of member companies were actively financing and disclosing regenerative agriculture spending at all.",
    ],
    keySignal: "OP2B's five year progress report puts cumulative transition finance for regenerative agriculture at $3.6 billion across 2019 to 2023, reaching 3.9 million of a targeted 12.5 million hectares, against a $300 billion annual funding gap the same report identifies.",
    whyItMatters: "The gap between $3.6 billion deployed and $300 billion needed annually is the more structurally important number in the report. It says the corporate transition finance mechanisms that exist today are real but still a rounding error against the scale of land that would need to change practice for the target to matter at a system level.",
    systemConnection: "Regenerative practice on cropland acts on soil health, water retention, and input use simultaneously, which is why we track this thread inside Land & Soil diligence even when the capital source is a food company's supply chain program rather than a land investor.",
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
    system: "Land & Soil",
    lens: "Policy & Standards",
    region: "Latin America & Caribbean",
    country: "Colombia",
    body: [
      "COP16, the UN biodiversity conference, ran in Cali, Colombia from 21 October to 1 November 2024, the first time the talks were held in the Amazon region. Parties adopted the Cali Fund, a mechanism requiring companies that commercially use digital sequence information, genetic data drawn from plants, animals, and microorganisms, to contribute a share of their profits or revenue toward biodiversity conservation, with half of any proceeds directed to Indigenous Peoples and local communities. What the conference did not resolve was broader and harder: talks on a dedicated global biodiversity fund under COP governance stalled over developed and developing country disagreement on structure and control, pushing that question to a reconvened session in Rome in February 2025. Pledges to the interim Global Biodiversity Framework Fund reached only about $407 million in Cali, well short of what negotiators had sought.",
    ],
    keySignal: "COP16 in Cali adopted the Cali Fund, a digital sequence information benefit sharing mechanism with a 50 percent allocation to Indigenous Peoples and local communities, while broader global biodiversity fund negotiations stalled and were pushed to Rome in February 2025.",
    whyItMatters: "The Cali Fund is a payment obligation with a defined beneficiary, not yet a market with defined supply and demand. Its practical value depends entirely on which companies actually contribute, since participation is not compulsory in the way a tax or a regulated fee would be, and on how contribution is verified once companies do.",
    systemConnection: "Biodiversity finance sits next to, but is not the same instrument as, the carbon and natural capital markets already active in land backed structures, and the two are increasingly discussed by the same institutional buyers evaluating the same land.",
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
    system: "Land & Soil",
    secondarySystem: "Energy & Waste",
    lens: "Capital & Markets",
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
    system: "Energy & Waste",
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
    system: "Water",
    lens: "Capital & Markets",
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
    system: "Orbital Intelligence",
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
