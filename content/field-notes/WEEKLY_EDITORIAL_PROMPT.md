# Field Notes Publishing Workflows

Read `EDITORIAL_SYSTEM.md` and `SOURCES.md` first. This file covers the two
publishing modes: the ongoing weekly cycle, and the one-time historical
backfill.

## Content priority framework

**Priority 1 — structural signals**: major regulation, new infrastructure
constraints, institutional allocations, major financing structures, large
project markets, major standards, material technological shifts, verified
real-asset performance, major environmental datasets.

**Priority 2 — market development**: fund closes, strategic acquisitions,
large partnerships, new transition-finance mechanisms, corporate
supply-chain deployment, new infrastructure investment.

**Priority 3 — emerging signal**: interesting pilots, technology
demonstrations, new datasets, early-stage models, small but strategically
important transactions. Don't over-cover venture rounds unless they reveal
something structurally important.

## Scoring candidates

Score each candidate 1-5 on: materiality, source quality, relevance to
Regenera's practice, cross-system significance, capital relevance,
development relevance, analytical originality. Weak aggregate scores don't
become Field Notes — better to publish fewer, stronger pieces.

## Ongoing weekly workflow

Target: ~3 Field Notes/week, plus one Regenera Systems Brief at month end.
A reasonable rhythm (not shown publicly — it's an internal workflow, not a
published schedule): markets/capital/policy one day, physical
systems/infrastructure/technology another, cross-system/agriculture/land
synthesis a third.

1. Review trusted sources (`SOURCES.md`) for significant developments from
   roughly the last 7 days.
2. Identify 5-10 candidates.
3. Reject: pure marketing, unverifiable claims, repetitive stories,
   insignificant developments, "green news" with no structural angle,
   anything disconnected from a system Regenera actually works across.
4. Rank survivors using the scoring above.
5. Select ~3.
6. Verify material claims against primary sources per the fact-check rule
   in `EDITORIAL_SYSTEM.md`.
7. Draft original analysis — never copy structure, headlines, or language
   from the source newsletter/article you found it through.
8. Add sources (label + URL where available).
9. Add full metadata: system, lens, optional secondary system, region, tags,
   deck, image (see image standard below), featured flag if applicable.
10. Add the entry to `lib/fieldNotes.ts`. The site's routing, sitemap,
    related-posts, and archive filtering all key off this array — there is
    no second place to register an article.
11. Run `npm run build` and `npx next lint`. Resolve any errors.
12. Spot-check: the new route renders, related posts make sense, images
    load, no console errors, mobile layout doesn't overflow (this codebase
    has a history of grid-responsive-override bugs — check the new content
    at a 375px viewport specifically).
13. Publish only once all of the above passes.

## Image standard

Editorial, documentary, architectural, geographic, institutional, real.
Avoid: obviously AI-generated images, generic green leaves, hands holding
seedlings, glowing-Earth imagery, sustainability stock photography,
handshake photos, futuristic renders, abstract ESG graphics. Prefer
infrastructure, agricultural landscapes, satellite imagery, real assets,
construction, ecological systems, maps, industrial systems. This site
sources images from Wikimedia Commons via the deterministic thumb URL
pattern already used throughout `lib/fieldNotes.ts` — no image may repeat
anywhere on the site (home strip, other Field Notes, the lead-modal image).
Every image needs real descriptive alt text.

## Historical backfill (one-time, before switching to weekly)

Objective: give Field Notes a coherent research archive from July 2024
onward instead of starting abruptly at first real publication. This is
retrospective *research*, not retroactive fabrication — see the
retrospective-research rules in `EDITORIAL_SYSTEM.md` (archiveDate vs. date,
hindsight used transparently, source dates never altered).

**This only works with a genuine research budget.** Each historical entry
needs real verification against primary sources, the same as a live weekly
pick — there is no shortcut for retrospective analysis that skips sourcing.
Do not attempt to produce dozens of these in a single unsupervised pass; work
in verified batches and let whoever is reviewing check sourcing quality
before the next batch.

Target ~40-60 entries across July 2024-August 2026, unevenly distributed —
quality and genuine structural importance over even monthly coverage.
Rough system balance across the full archive: Land & Soil 10-14, Energy &
Waste 9-12, Water 5-7, Built Environment 5-7, Orbital Intelligence 4-6,
Community & Health 4-6, with Food Systems threaded through Land & Soil and
Community & Health rather than counted separately.

Suggested narrative threads to keep the archive coherent rather than a
random pile of articles (only follow these where the actual verified
evidence supports them — do not force a thread the sources don't back):

- **Agriculture**: practice-based sustainability narrative (2024) → natural
  capital allocations and transition-finance structures expanding, farmland
  strategies maturing, processing/regional infrastructure recognized as a
  bottleneck (2025) → agriculture as productive infrastructure, insurance
  and lending responding to regenerative practice, Scope 3 driving upstream
  corporate investment, land-sector accounting maturing (2026).
- **Energy**: rapid deployment with grid constraints emerging (2024) →
  interconnection becomes the primary constraint, storage decouples from
  solar economics (2025) → grid access shapes real-asset and industrial
  siting decisions directly (2026).
- **Water**: environmental consideration → development infrastructure →
  operational risk → underwriting variable → increasingly measurable via
  remote sensing and hydrology data.
- **Orbital Intelligence**: environmental monitoring → asset intelligence →
  verification → diligence → ongoing asset management.
- **Capital**: track how structures evolve (farmland funds, natural-capital
  funds, transition finance, blended/catalytic capital, private credit) —
  interpret what each structure reveals about market maturity rather than
  just reporting totals.

Steps:

1. Research July-December 2024. Identify the strongest structural
   developments per the priority framework above.
2. Research January-December 2025.
3. Research January-August 2026.
4. For every candidate, record: event date, system, secondary system, lens,
   geography, significance, source quality, primary sources, the Regenera
   angle.
5. Score candidates (see above).
6. Select the ~40-60 strongest.
7. Draft original analysis for each.
8. Verify every material figure against a primary source.
9. Add full metadata including `archiveDate` (and `eventDate` where the
   precise date is known).
10. Add to `lib/fieldNotes.ts`.
11. Check that the assembled archive reads as a coherent progression, not a
    random collection — re-read the narrative threads above against what
    actually got selected.
12. Once the historical archive is genuinely complete and verified, switch
    to the ongoing weekly workflow above.

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
publish it — cut the claim, don't guess at it.

## Corrections

If a published article's factual claims change materially, update the
article and set `updatedDate` (renders as "Updated [date]" on the article
page). Typo-level corrections don't need this.
