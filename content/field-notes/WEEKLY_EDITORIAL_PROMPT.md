# Field Notes Publishing Workflows

Read `EDITORIAL_SYSTEM.md` and `SOURCES.md` first. This file covers the two
publishing modes: the ongoing weekly cycle, and the historical backfill.

**On autonomy**: this workflow describes what a publishing agent should do
editorially. It does not by itself authorize an agent to push to `main` or
deploy without confirmation, or to run on an unattended schedule. Whoever
operates this workflow (human or agent) still confirms commits, pushes, and
deployment actions per the operating rules in effect for that session, and
autonomous scheduled execution requires a separate, explicit decision to
set up, not something this document grants on its own.

## Content priority framework

**Priority 1, structural signals**: major regulation, new infrastructure
constraints, institutional allocations, major financing structures, large
project markets, major standards, material technological shifts, verified
real-asset performance, major environmental datasets.

**Priority 2, market development**: fund closes, strategic acquisitions,
large partnerships, new transition-finance mechanisms, corporate
supply-chain deployment, new infrastructure investment.

**Priority 3, emerging signal**: interesting pilots, technology
demonstrations, new datasets, early-stage models, small but strategically
important transactions. Don't over-cover venture rounds unless they reveal
something structurally important.

## Scoring candidates

Score each candidate 1-5 on: materiality, source quality, relevance to
Regenera's practice, cross-category significance, capital relevance,
development relevance, analytical originality. Weak aggregate scores don't
become Field Notes, better to publish fewer, stronger pieces than a weak one
just to hit a cadence target.

## Ongoing weekly workflow

Target roughly one substantive entry every 5 to 9 days (occasionally a
10-12 day gap when nothing sufficiently important occurred, occasionally a
4-day gap when two important developments land close together), averaging
about 4-5 entries a month. Do not use a mechanically predictable seven-day
clock, that reads as automated rather than editorial.

**Weekday bias** (professional midweek reading behavior): Tuesday ~35%
(Capital Markets, Energy, Real Estate, Mobility, major market
developments), Wednesday ~35% (Regenerative Agriculture, Land, Food Systems,
Water, Natural Capital, longer analytical work), Thursday ~23% (Waste,
Materials, Orbital Intelligence, Technology, Data Notes, Policy Notes),
Monday ~4% (major structural Field Notes, major regulatory development,
monthly/quarterly research only), Friday ~3% (Case Studies, Systems Briefs,
retrospective synthesis only). Avoid routine weekend publication. Where the
platform records a publish time, vary it naturally within roughly 11:00am to
4:00pm in the site's primary operating timezone rather than a fixed minute.

**Category rotation**: avoid more than two consecutive posts from the same
primary category. Across a rolling eight-post window, aim for at least five
different categories represented.

1. Review trusted sources (`SOURCES.md`) for significant developments from
   roughly the last 7-10 days.
2. Identify 5-12 candidates.
3. Reject: pure marketing, unverifiable claims, repetitive stories,
   insignificant developments, "green news" with no structural angle,
   anything disconnected from a category Regenera actually works across.
4. Rank survivors using the scoring above.
5. Check recent posts (see `editorial-state.json`) to avoid repeating the
   same category or an adjacent topic back to back.
6. Select the strongest candidate and the appropriate entry type (see
   "Editorial formats" in `EDITORIAL_SYSTEM.md`).
7. Verify material claims against primary sources per the fact-check rule
   in `EDITORIAL_SYSTEM.md`.
8. Draft original analysis, never copy structure, headlines, or language
   from the source newsletter/article you found it through.
9. Add sources (label + URL where available).
10. Add full metadata: entryType, category, optional secondary category,
    lens, region, tags, deck, image (see image standard below), featured
    flag if applicable.
11. Add the entry to `lib/fieldNotes.ts`. The site's routing, sitemap,
    related-posts, and archive filtering all key off this array, there is
    no second place to register an article.
12. Run `npm run build` and `npx next lint`. Resolve any errors.
13. Spot-check: the new route renders, related posts make sense, images
    load, no console errors, mobile layout doesn't overflow (this codebase
    has a history of grid-responsive-override bugs, check the new content
    at a 375px viewport specifically).
14. Update `editorial-state.json` (lastPublished, lastCategory,
    recentCategories, recentTopics, monthlyCount, yearlyCategoryCounts).
15. Publish only once all of the above passes, and only after the operator
    confirms the commit/push per that session's standing practice.

If no story clears the quality threshold in a given window, do not publish a
weak article to satisfy cadence. Wait for the next window.

## Image standard

Editorial, documentary, architectural, geographic, institutional, real.
Avoid: obviously AI-generated images, generic green leaves, hands holding
seedlings, glowing-Earth imagery, sustainability stock photography,
handshake photos, futuristic renders, abstract ESG graphics. Prefer
infrastructure, agricultural landscapes, satellite imagery, real assets,
construction, ecological systems, maps, industrial systems. This site
sources images from Wikimedia Commons via the deterministic thumb URL
pattern already used throughout `lib/fieldNotes.ts`, no image may repeat
anywhere on the site (home strip, other Field Notes, the lead-modal image).
Every image needs real descriptive alt text.

## Monthly Systems Brief

Approximately once per month, publish "The Regenera Systems Brief, [Month
Year]" as a Systems Brief entry, which may replace that week's normal entry.
See `EDITORIAL_SYSTEM.md` for structure. Do not force an empty section for a
category that had no material development that month.

## Historical backfill

Objective: give Field Notes a coherent research archive from July 2024
onward instead of starting abruptly at first real publication. This is
retrospective *research*, not retroactive fabrication, see the
retrospective-research rules in `EDITORIAL_SYSTEM.md` (archiveDate vs. date,
hindsight used transparently, source dates never altered).

**This only works with a genuine research budget.** Each historical entry
needs real verification against primary sources, the same as a live weekly
pick, there is no shortcut for retrospective analysis that skips sourcing.
Work in verified batches, do not attempt to produce dozens of these in a
single unsupervised pass.

**Status as of the taxonomy rearchitecture** (see CLAUDE.md for the date):
31 entries exist in `lib/fieldNotes.ts`, of which 9 carry `archiveDate` and
are genuinely retrospective (July-December 2024, source-verified against
primary/institutional sources), and 22 are the original pre-rebuild articles
running monthly from January 2025 through August 2026 without an
`archiveDate` (they are not falsely retrospective, but they also were not
independently fact-checked against primary sources the way the 2024 batch
was, since they predate that sourcing discipline).

Density guidance in this document's cadence section (~44-52 substantive
entries per year, averaging roughly weekly) is directional for the *full*
archive, including the historical period, not just the go-forward cadence.
Applied literally to July 2024 through the present, that implies an archive
meaningfully larger than 31 entries. Treat the 31 current entries as a
foundation, not a finished archive, more historical batches are expected
work, not optional polish. Do not pad the count with weak stories to close
the gap faster, a smaller honest archive is better than a larger padded one.

Rough category balance to aim for across a full year (directional, not a
quota, never force a weak article merely because a category is behind):
Regenerative Agriculture ~7, Energy ~6, Capital Markets & Real Assets ~6,
Water Systems ~4, Waste & Circular Materials ~4, Land & Due Diligence ~4,
Food Systems ~4, Real Estate & Built Environment ~4, Natural Capital &
Environmental Markets ~4, Orbital & Environmental Intelligence ~3,
Materials & Embodied Carbon ~2, Community & Human Health ~2, Mobility &
Infrastructure ~2.

Story threads to keep the archive coherent rather than a random pile
(follow these only where the actual verified evidence supports them, do not
force a thread the sources don't back):

- **Regenerative Agriculture**: farming practice, then supply-chain
  concern, then resilience strategy, then natural-capital exposure, then
  transition-finance market, then productive real-asset strategy, then
  measurable environmental and financial performance.
- **Energy**: rapid deployment, then land constraints, then interconnection
  constraints, then storage integration, then grid bottlenecks, then
  industrial-load interaction, then energy availability shaping development
  geography.
- **Water Systems**: environmental issue, then operational risk, then
  infrastructure constraint, then underwriting variable, then measurable
  environmental intelligence.
- **Waste & Circular Materials**: disposal problem, then diversion, then
  material recovery, then energy/feedstock recovery, then circular
  industrial infrastructure.
- **Natural Capital & Environmental Markets**: impact allocation, then
  carbon, then biodiversity, then working landscapes, then institutional
  real assets, then natural infrastructure.
- **Orbital & Environmental Intelligence**: environmental observation, then
  monitoring, then verification, then diligence, then ongoing asset
  intelligence.
- **Capital Markets & Real Assets**: track how structures evolve
  (farmland funds, natural-capital funds, transition finance,
  blended/catalytic capital, private credit), interpret what each structure
  reveals about market maturity rather than just reporting totals.

Steps for each batch:

1. Pick the next unresearched window (e.g. the next quarter).
2. For every candidate, record: event date, category, secondary category,
   lens, geography, significance, source quality, primary sources, the
   Regenera angle.
3. Score candidates (see above).
4. Select the strongest per the category balance and story threads.
5. Draft original analysis for each, verify every material figure against a
   primary source.
6. Add full metadata including `archiveDate` (and `eventDate` where the
   precise date is known).
7. Add to `lib/fieldNotes.ts`, build/lint clean, QA per the weekly workflow
   steps above.
8. Update `editorial-state.json` for the batch.
9. Report the honest delivered count against the directional target, do not
   round up or imply completeness that hasn't been verified.

**Titles**: analytical, built to age well. *"Grid access begins overtaking
capital as the renewable-development constraint"*, not *"New solar rules
announced."*

## Automation safety (applies to both workflows)

Never: invent figures, transactions, quotes, sources, or dates; fabricate
Regenera involvement in something Regenera wasn't involved in; alter
existing project claims or Regenera's legal positioning; publish investment
recommendations; publish confidential client information or private client
materials; cite a source you can't actually verify exists and says what you
claim; state a projection as a fact. If a claim can't be verified, don't
publish it, cut the claim, don't guess at it.

## Corrections

If a published article's factual claims change materially, update the
article and set `updatedDate` (renders as "Updated [date]" on the article
page). Typo-level corrections don't need this.
