# Field Notes Editorial System

This is the standing reference for anyone (human or AI agent) writing, editing,
or publishing Regenera Field Notes. It is self-contained: you should not need
any external brief to produce a compliant article once you've read this file,
`SOURCES.md`, and `WEEKLY_EDITORIAL_PROMPT.md`.

**Taxonomy note**: this document describes the 13-category taxonomy adopted
on explicit user direction, replacing an earlier 7-system model. See
CLAUDE.md for the migration rationale and mapping if you're trying to
understand why an older commit or an external brief references different
category names.

## What Field Notes is

Field Notes is the intelligence and research layer of Regenera Advisory, not
a news feed, blog, or marketing publication. Regenera operates where systems,
capital, and place converge, land, infrastructure, development, agriculture,
real assets, natural resources, communities, environmental systems, and
capital. Field Notes exists to demonstrate that these are not isolated
sectors: a solar project is a land story, a grid story, and often an
agriculture story at once.

**Editorial thesis test**, before writing anything, ask: *does this
development change how a place, project, asset, resource system,
infrastructure system, or productive landscape should be understood,
financed, designed, diligenced, developed, operated, or measured?* If yes,
it's a candidate. If it's just "green news," it isn't.

**Differentiation**, Regenera does not compete with RFSI on agriculture news,
IEA on energy data, Infrastructure Investor on fund news, NASA on satellite
science, or real-estate media on property news. The product is connecting
the systems those outlets cover in isolation. An agricultural story may also
be a land, water, energy, finance, health, or infrastructure story. A solar
development may also be a land, grid, water, or community story. That
systems-level interpretation is the editorial product, not a replacement for
sector-specific coverage.

## Taxonomy

Defined in `lib/fieldNotesTaxonomy.ts`. Do not invent new category, lens, or
entry-type strings inline, add them there first if the taxonomy genuinely
needs to grow.

**Primary category** (exactly one per article, required):

1. **Capital Markets & Real Assets**, infrastructure capital, project
   finance, private credit, institutional capital, pension funds, family
   offices, development finance, blended finance, transition finance,
   underwriting, real-asset transactions.
2. **Energy**, utility-scale and distributed solar, wind, battery storage,
   grids, transmission, interconnection, power markets, microgrids,
   industrial energy, renewable fuels, EPC. Waste is not included here.
3. **Waste & Circular Materials**, waste-to-energy, municipal and industrial
   waste, organic waste, resource recovery, anaerobic digestion, recycling,
   circular materials, biochar, recovered feedstocks. Energy produced from
   waste may cross-reference Energy as a secondary category, but Waste
   remains primary when the underlying system begins with waste/feedstock.
4. **Water Systems**, groundwater, aquifers, watersheds, municipal water,
   wastewater, reuse, irrigation, stormwater, desalination, agricultural and
   industrial water, hydrological risk. Core thesis: water is an
   underwriting variable.
5. **Land & Due Diligence**, land acquisition, suitability, title, land-use
   planning, site selection, environmental diligence, zoning, land value,
   carrying capacity, landscape analysis. Regenerative agriculture is a
   separate category, not folded in here.
6. **Regenerative Agriculture**, soil health and biology, farmland,
   transition finance, agricultural insurance, agroforestry, agrivoltaics,
   regenerative grazing, crop systems, farmer economics, biological inputs,
   ag technology, nutrient management, soil carbon, farm energy and water.
   Core thesis: soil is productive infrastructure.
7. **Food Systems**, what happens beyond primary production: processing,
   milling, storage, cold chain, logistics, aggregation, regional food
   infrastructure, procurement, ingredient systems, food supply chains,
   Scope 3 agricultural sourcing. Cross-references Regenerative Agriculture
   frequently but stays distinct.
8. **Real Estate & Built Environment**, regenerative development,
   sustainable real estate, master planning, districts, district energy and
   water, adaptive reuse, public realm, net-zero development, real-estate
   resilience.
9. **Materials & Embodied Carbon**, timber, mass timber, concrete, steel,
   hemp, bamboo, agricultural fibers, low-carbon and circular construction
   materials, embodied carbon, material supply chains. Kept separate from
   Real Estate because materials have their own industrial and capital
   systems.
10. **Mobility & Infrastructure**, EV charging, transport infrastructure,
    mobility systems, logistics infrastructure, ports, roads, rail,
    infrastructure corridors, land-use implications of mobility.
11. **Natural Capital & Environmental Markets**, biodiversity, ecosystem
    services, restoration, forestry, carbon and biodiversity markets,
    natural infrastructure, environmental credits, conservation finance. Do
    not treat all nature projects as regenerative automatically.
12. **Community & Human Health**, public-health infrastructure, food and
    health, agriculture and health, energy reliability for health
    facilities, environmental health, regional resilience, rural economies,
    food access. Not a general wellness blog.
13. **Orbital & Environmental Intelligence**, Earth observation, satellite
    systems, remote sensing, environmental monitoring, groundwater
    intelligence, land-use change, methane and wildfire detection,
    agricultural and vegetation monitoring, MRV, asset intelligence.

**Secondary category** (optional, at most one): use when a development
genuinely bridges two categories (e.g. agrivoltaics: Regenerative
Agriculture primary, Energy secondary).

**Analytical lens** (exactly one, required), tells the reader *how* Regenera
is examining the development, distinct from *what system* it concerns:
Capital & Finance, Asset Economics, Markets & Supply Chains, Project
Delivery, Policy & Regulation, Technology & Infrastructure, Measurement &
Verification, Resilience & Risk, Systems Design.

**Entry type** (exactly one, required), see "Editorial formats" below.

**Region** (optional): Global, North America, Latin America & Caribbean,
Europe, Africa, Asia-Pacific, Middle East, optionally refined with a
`country` string. Geography is metadata, not primary navigation, never make
country filters visually dominant.

**Tags** (optional, unlimited): support search and related-post scoring.
Never display a full tag list to a reader, they're invisible plumbing.

## Editorial formats (entry types)

Do not force every article into identical headings, that reads as
formulaic and AI-generated. Use the same analytical rigor internally while
allowing visible editorial variety across these seven formats:

- **Field Note**, major original Regenera thesis or structural analysis.
  Typical length 800 to 1,500 words, occasionally deeper up to ~2,500.
- **Market Signal**, a significant development worth interpreting but not a
  full essay. 250 to 500 words.
- **Capital Note**, a fund, financing structure, transaction, lending
  product, institutional allocation, or investment vehicle. 400 to 800
  words.
- **Policy Note**, regulation, government policy, standard, legislation, or
  permitting reform. 400 to 900 words.
- **Data Note**, scientific research, market data, a performance study, a
  new dataset, new empirical evidence. 400 to 800 words.
- **Case Study**, a project, company, landscape, financing mechanism, or
  implementation model, with lessons extracted. 700 to 1,300 words.
- **Systems Brief**, the monthly synthesis. 1,500 to 3,000 words.

Article structure should vary by format and subject rather than repeat a
fixed template. A Capital Note might use "The transaction / What the
structure tells us / Where risk sits / What we are watching." A Data Note
might use "What the data shows / What it does not show / Why it matters for
the asset / What evidence comes next." A Policy Note might use "What
changed / Who is affected / What implementation changes / What remains
unresolved." A Case Study might use "The model / How the system works / Who
pays / Where value is created / Where the model could fail / What is
transferable." A Field Note may use fully custom headings. Visible
consistency belongs in sourcing, quality, typography, and metadata, not in
rigid headings.

Internally, every article should still be able to answer: what actually
happened, what primary source verifies it, why is it significant, what
category and secondary category are affected, what changes economically,
operationally, and from a development and capital perspective, what remains
unresolved, and what should be watched next. That internal discipline does
not require exposing all of it as visible section headers on every piece.

## Data model

`lib/fieldNotes.ts`, the `FieldNote` interface. Key fields beyond the
obvious: `deck` (the teaser/dek), `entryType`, `category`/`secondaryCategory`,
`archiveDate`/`eventDate` (retrospective research only, see below),
`keySignal` through `whatWeAreWatching` map to the structural analysis an
article should internally answer (see above), `sources` is an array of
`{label, url}`. `metaTitle`/`metaDescription`/`canonicalUrl` are optional
overrides for SEO, when absent the page falls back to `title`/`deck` and the
default `/field-notes/[slug]` canonical. All of the structured fields beyond
the required ones are optional so legacy or lighter posts can render without
them, the article template only shows a section when its field is populated.

## Voice

Precise, analytical, measured, independent, globally aware, technically
informed, commercially informed, environmentally informed. Short declarative
sentences are fine. Not activist, promotional, alarmist, generic-ESG, or
futuristic-breathless.

Prefer: *"The more important signal is…" / "The constraint sits
elsewhere." / "For asset owners, the relevant question is…" / "The economics
change when…" / "From a development perspective…" / "The financing structure
matters because…" / "What appears to be a technology issue is also a land
issue." / "The underlying asset remains…"*

Avoid: *"groundbreaking" / "game-changing" / "revolutionary" /
"incredible" / "transformative"* unless genuinely justified or directly
quoting a source, and quotations should be rare.

No em-dashes or en-dashes anywhere (site-wide rule, not Field-Notes-specific,
use commas or periods). No prose semicolons.

## Never do this

- **Never fabricate.** No invented figures, transactions, quotes, sources,
  dates, or Regenera involvement in something Regenera wasn't involved in.
  If a claim can't be verified, don't publish it.
- **Never blur financial terms.** *Target* (hoped-for raise) is not
  *commitment* (formally committed) is not *first close* is not *final
  close* is not *AUM* is not *project value* (estimated cost) is not
  *financing* (debt/equity/facility) is not *grant* (non-repayable) is not
  *investment* (capital actually invested) is not *pipeline* (opportunities
  under consideration) is not *deployed capital*. Do not describe a $1
  billion target as a $1 billion fund if only $200 million has closed.
- **Never call something regenerative without explaining the mechanism.**
  Sustainability, ESG, nature-positive, climate-smart, organic, low-carbon,
  and circular are not automatically regenerative. Ask what is actually
  being restored or strengthened, soil function, ecological function, the
  water cycle, biodiversity, productive capacity, community resilience,
  local economic capacity. If you can't answer that, don't use the word.
- **Never imply regulated financial activity.** Regenera is not a
  broker-dealer, investment adviser, underwriter, placement agent, fund
  manager, or asset manager, and does not hold or manage client or investor
  funds. Never recommend buying or selling a security. Never imply
  guaranteed returns. Use: capital alignment, capital strategy, capital
  introductions, investor coordination, project readiness, transaction
  support, strategic introductions.
- **Never weaken the Important Notice.** It stays verbatim wherever it
  appears (`components/Footer.tsx`, `components/LegalModalProvider.tsx`).
- **Never backdate a publication.** `date` is the actual publication month,
  always. Analyzing a 2024 event in an article published in 2026 is fine and
  expected, claiming the article itself was published in 2024 is not.
- **Never silently rewrite a material claim.** If a published article's
  factual claims change materially, set `updatedDate` and show the
  "Updated" notice. Typo fixes don't need this.
- **No fluffy sustainability language**, "saving the planet," "greener
  future," "better world," "planet positive," "purpose-driven
  transformation," etc. never appear.

## Sourcing hierarchy

Full watchlist in `SOURCES.md`. Priority order when verifying a claim:

1. **Primary**, governments, regulators, central banks, grid/system
   operators, ministries, legislation, court decisions, company filings and
   official releases, MDBs/DFIs, standards bodies, scientific journals,
   universities, official datasets (World Bank, IFC, IEA, IRENA, FAO, IFAD,
   European Commission, EIB, EBRD, IDB, ADB, AfDB, Green Climate Fund, NASA,
   ESA, Copernicus, USGS, USDA, national regulators/agencies).
2. **Institutional research**, WBCSD, PRI, TNFD, Forest Trends, The Nature
   Conservancy, WEF, recognized real-asset managers, universities.
3. **Specialist trade media**, RFSI, AgFunderNews, Infrastructure Investor,
   New Private Markets, Utility Dive, PV Magazine, Carbon Pulse, Recharge,
   specialist real-estate and water publications.
4. **Discovery only**, general news, newsletters, LinkedIn, social,
   aggregators, including RFSI when used as a discovery tool rather than as
   the primary source itself. Use these to *find* stories, then verify
   against tier 1 to 3. Use original RFSI research or interviews directly
   when RFSI itself is the primary source of that material.

**Fact-check rule**: never publish a number sourced only from a secondary
newsletter (fund size, first/final close, AUM, investment, project cost, MW,
hectares, emissions, water volumes, loan/grant size, market size, valuation,
revenue, pipeline) without attempting to verify it against the primary
source. If you can't verify it, either drop the figure or attribute it
explicitly to the secondary source with appropriate hedging.

## Retrospective / historical research

Some Field Notes analyze developments from before their publication date
(see `WEEKLY_EDITORIAL_PROMPT.md` for the historical-backfill workflow).
Rules specific to this:

- Set `archiveDate` (YYYY-MM, the period being analyzed) and, when known,
  `eventDate` (YYYY-MM-DD). `date` remains the true publication month.
- Archive browsing sorts by `archiveDate` when present, `date` otherwise.
  JSON-LD `datePublished` always uses `date`, never claim earlier
  publication than actually happened. The visible archive organizes
  research chronologically by the historical period being analyzed, without
  ever implying the page itself existed before it did.
- Use hindsight explicitly and transparently: *"Viewed two years later, the
  more important signal was not the fund announcement itself but the type of
  institutional capital that subsequently entered the market."* Distinguish
  what was known at the time from what became clear later.
- Titles should be analytical and age well, not read like an old news
  headline. *"Farmland capital begins broadening beyond traditional
  agricultural exposure"*, not *"Company X raises $200 million."*
- Source dates are never altered. Never imply a source existed before it
  did.

## Related posts

Algorithmic (`getRelatedPosts` in `lib/fieldNotes.ts`), not "3 latest."
Scored by shared primary category (+3), shared secondary/primary overlap
(+2), shared lens (+1), shared tags (+1 each). Top 3, capped.

## Publication cadence and category rotation

See `WEEKLY_EDITORIAL_PROMPT.md` for the full ongoing weekly workflow. In
brief: target roughly one substantive entry every 5 to 9 days (not a
mechanical 7-day clock), avoid more than two consecutive posts from the same
primary category, and aim for at least five different categories across any
rolling eight-post window.

## Monthly Systems Brief

Approximately once per month, publish "The Regenera Systems Brief, [Month
Year]" as a Systems Brief entry. Structure: one short section per category
that actually had significant developments that month (do not force an
empty section merely because the taxonomy contains it), then Capital Flows,
What Connects Them, What We Are Watching Next. This is the primary monthly
newsletter anchor and may replace that week's normal entry.

## Cross-linking

`components/FromFieldNotes.tsx` renders a single restrained "From Field
Notes" module pointing to the latest post in a given category. It's
currently placed on the Services page's Energy tab
(`<FromFieldNotes category="Energy" />`). Drop it into other pages the same
way where it's genuinely relevant, sparingly, one per page, never a feed.

## Author and legal positioning

Use "Regenera" as editorial author unless an actual named author is
explicitly provided. Do not invent staff writers. Field Notes is
informational research, never investment recommendations. Preserve
Regenera's existing legal notice and practice-model positioning (see
CLAUDE.md's compliance-copy rule) on every article.
