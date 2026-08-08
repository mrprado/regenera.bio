# Field Notes Editorial System

This is the standing reference for anyone (human or AI agent) writing, editing,
or publishing Regenera Field Notes. It is self-contained: you should not need
the original rebuild brief to produce a compliant article once you've read
this file, `SOURCES.md`, and `WEEKLY_EDITORIAL_PROMPT.md`.

## What Field Notes is

Field Notes is the intelligence and research layer of Regenera Advisory, not
a news feed, blog, or marketing publication. Regenera operates where systems,
capital, and place converge — land, soil, water, agriculture, food systems,
renewable energy, waste, circular materials, real estate, infrastructure,
natural capital, environmental markets, community systems, human health,
Earth observation, environmental intelligence, project delivery, and capital
strategy. Field Notes exists to demonstrate that these are not isolated
sectors: a solar project is a land story, a grid story, and often an
agriculture story at once.

**Editorial thesis test** — before writing anything, ask: *does this
development change how a place, project, asset, infrastructure system, or
living system should be understood, financed, designed, operated, or
measured?* If yes, it's a candidate. If it's just "green news," it isn't.

**Differentiation** — Regenera does not compete with RFSI on agriculture
news, IEA on energy data, Infrastructure Investor on fund news, NASA on
satellite science, or real-estate media on property news. The product is
connecting the systems those outlets cover in isolation.

## Taxonomy

Defined in `lib/fieldNotesTaxonomy.ts`. Do not invent new category strings —
add them there first if the taxonomy genuinely needs to grow.

**Primary system** (exactly one per article, required):
Land & Soil · Water · Energy & Waste · Food Systems · Community & Health ·
Built Environment · Orbital Intelligence

**Secondary system** (optional, at most one): use when a development
genuinely bridges two systems (e.g. agrivoltaics: Land & Soil primary,
Energy & Waste secondary).

**Analytical lens** (exactly one, required):
Capital & Markets · Asset Economics · Project Delivery · Policy & Standards ·
Technology & Infrastructure · Measurement & Verification · Resilience & Risk
· Systems Design

**Region** (optional): Global · North America · Latin America & Caribbean ·
Europe · Africa · Asia-Pacific · Middle East, optionally refined with a
`country` string. Geography is metadata, not primary navigation — never make
country filters visually dominant.

**Tags** (optional, unlimited): support search and related-post scoring.
Never display a full tag list to a reader; they're invisible plumbing.

## Article structure

Not every heading needs to render on every article (readability wins), but
the underlying logic should be present:

1. **The Signal** — what happened. Concrete: a transaction, a regulation, a
   dataset, a scientific finding. Dates, currencies, no promotional language.
2. **Why It Matters** — the structural significance (economics, asset
   durability, operational risk, bankability, regulatory exposure), not a
   restatement of the announcement.
3. **The System Connection** — what adjacent physical systems this touches
   and how (see examples in the taxonomy section of the original brief, or
   just reason it through: agriculture touches soil/water/processing/energy/
   food supply/health; solar touches land/grid/storage/industrial load/
   water; waste touches feedstock/materials/energy/municipal systems/land
   use; real estate touches water/mobility/energy/materials/community/
   ecology).
4. **Capital Implication** — what becomes more or less investable, where
   risk moves, what capital structure might fit. See the compliance
   constraints below — this section is analysis, never a recommendation.
5. **Development Implication** — what changes for developers, asset owners,
   municipalities, operators, landowners: permitting, land, water, feedstock,
   grid, logistics, construction, offtake, community integration.
6. **What We Are Watching** — 2-4 specific forward-looking indicators.
7. **Sources reviewed** — see sourcing rules below. Every article needs one.

## Data model

`lib/fieldNotes.ts` — the `FieldNote` interface. Key fields beyond the
obvious: `deck` (the teaser/dek), `archiveDate`/`eventDate` (retrospective
research only — see below), `keySignal` through `whatWeAreWatching` map to
the six structural sections above, `sources` is an array of `{label, url}`.
All of the structured fields are optional so legacy or lighter posts can
render without them; the article template only shows a section when its
field is populated.

## Voice

Informed, calm, precise, observational, commercially/technically/
ecologically literate, independent, measured. Short declarative sentences
are fine. Not activist, promotional, alarmist, generic-ESG, or
futuristic-breathless.

Prefer: *"The more important constraint is…" / "From an underwriting
perspective…" / "For developers, the relevant question is…" / "The economics
change when…"*

Avoid: *"This groundbreaking initiative…" / "This game-changing
innovation…" / "This incredible milestone…"* — unless directly quoting a
source, and quotations should be rare.

No em-dashes or en-dashes anywhere (site-wide rule, not Field-Notes-specific
— use commas or periods). No prose semicolons.

## Never do this

- **Never fabricate.** No invented figures, transactions, quotes, sources,
  dates, or Regenera involvement in something Regenera wasn't involved in.
  If a claim can't be verified, don't publish it.
- **Never blur financial terms.** *Target* (hoped-for raise) ≠ *commitment*
  (formally committed) ≠ *first close* ≠ *final close* ≠ *AUM* ≠ *project
  value* (estimated cost) ≠ *financing* (debt/equity/facility) ≠ *grant*
  (non-repayable) ≠ *investment* (capital actually invested) ≠ *pipeline*
  (opportunities under consideration) ≠ *deployed capital*.
- **Never call something regenerative without explaining the mechanism.**
  Sustainability / ESG / nature-positive / climate-smart / organic /
  low-carbon / circular are not automatically regenerative. Ask: what is
  actually regenerating — soil, water systems, ecology, biodiversity,
  community systems, productive capacity, economic resilience? If you can't
  answer that, don't use the word.
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
  always. Analyzing a 2025 event in an article published in 2026 is fine and
  expected; claiming the article itself was published in 2025 is not.
- **Never silently rewrite a material claim.** If a published article's
  factual claims change materially, set `updatedDate` and show the "Updated"
  notice. Typo fixes don't need this.
- **No fluffy sustainability language** — "saving the planet," "greener
  future," "better world," "planet positive," "purpose-driven
  transformation," etc. never appear.

## Sourcing hierarchy

Full watchlist in `SOURCES.md`. Priority order when verifying a claim:

1. **Primary** — governments, regulators, central banks, grid/system
   operators, ministries, legislation, court decisions, company filings and
   official releases, MDBs/DFIs, standards bodies, scientific journals,
   universities, official datasets (World Bank, IFC, IEA, IRENA, FAO, IFAD,
   European Commission, EIB, EBRD, IDB, ADB, AfDB, Green Climate Fund, NASA,
   ESA, Copernicus, USGS, USDA, national regulators/agencies).
2. **Institutional research** — WBCSD, PRI, TNFD, Forest Trends, The Nature
   Conservancy, WEF, recognized real-asset managers, universities.
3. **Specialist trade media** — AgFunderNews, RFSI, PV Magazine, Utility
   Dive, Recharge, Carbon Pulse, Infrastructure Investor, New Private
   Markets.
4. **Discovery only** — general news, newsletters, LinkedIn, social,
   aggregators. Use these to *find* stories, then verify against tier 1-3.

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
  JSON-LD `datePublished` always uses `date` — never claim earlier
  publication than actually happened.
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
Scored by shared primary system (+3), shared secondary/primary overlap (+2),
shared lens (+1), shared tags (+1 each). Top 3, capped.

## Content mix

Roughly across a month: 2 capital-flow, 2 policy/regulation, 2
asset-economics, 2 technology/infrastructure, 1 verification/data, 1
project-delivery, 1 community/health, 1 systems-synthesis. Don't force these
ratios rigidly if the actual developments that month don't support it, but
don't publish three similar stories in a row either.

## Monthly Systems Brief

At the end of each month, publish "The Regenera Systems Brief — [Month
Year]" with the subtitle *"The developments shaping land, infrastructure,
natural capital and real assets this month."* Structure: one short section
per system (Land & Soil, Water, Energy & Waste, Food Systems, Community &
Health, Built Environment, Orbital Intelligence), then Capital Flows, What
Connects Them, What We Are Watching Next. This is the primary monthly
newsletter anchor.

## Cross-linking

`components/FromFieldNotes.tsx` renders a single restrained "From Field
Notes" module pointing to the latest post in a given system. It's currently
placed on the Services page's Energy tab. Drop it into other pages the same
way (`<FromFieldNotes system="Water" />` etc.) where it's genuinely relevant
— sparingly, one per page, never a feed.
