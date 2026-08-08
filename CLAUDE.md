# Regenera Advisory — regenera.bio

Client-facing site for Regenera Advisory, a regenerative systems consulting and capital
introduction practice (solar, waste-to-energy, real estate, land, agriculture, water,
orbital intelligence). Regenera is NOT a broker-dealer, registered investment adviser,
underwriter, placement agent, or fund manager — never write or imply regulated
securities activity, response-time promises, fee commitments, return/IRR figures, or
"guaranteed" anything, anywhere on the site including Field Notes.

## Stack
- Next.js 14 (App Router) + TypeScript, no CSS framework
- All styling lives in `app/globals.css` (custom design system: CSS variables, Cormorant
  Garamond + Instrument Sans, parchment/forest/gold palette; system-colored dots use
  `--terra --water --gold --food --human --urban --orbit`)
- Content data in `lib/` (fieldNotes.ts, fieldNotesTaxonomy.ts, projects.ts, leadOptions.ts,
  analytics.ts); pages in `app/`; interactive pieces are small client components in
  `components/`
- Supabase (project "Regenera.bio", `xbgrtjcslbnnvvhwqcye`) persists contact, subscribe,
  and lead-intake form submissions. No auth: RLS grants `anon`/`authenticated`
  INSERT-only on `contact_submissions`, `subscribers`, `lead_intake` — no SELECT, so the
  publishable key in the browser bundle can never read data back. All writes go through
  Next.js Route Handlers (`app/api/*/route.ts`), never inserted from the browser directly.
- Deploy target: **Netlify** (switched from Vercel earlier in the project — don't
  reintroduce Vercel config). GitHub remote: `https://github.com/mrprado/regenera.bio.git`,
  branch `main`.

## Commands
- `npm run dev` — dev server
- `npm run build` — production build (must stay green)
- Never run `npm run build` while `next dev` is still running against the same folder —
  they share `.next` and corrupt webpack's chunk cache (looks like a real 500 bug, isn't
  one). Stop the dev server first.

## Hard rules — do not violate
1. NO em-dashes or en-dashes anywhere in copy. Use commas or periods.
2. Compliance copy is load-bearing (see practice-model note above). The Important Notice
   text in `components/Footer.tsx` and `components/LegalModalProvider.tsx` must stay
   verbatim. This same discipline extends to Field Notes: no investment recommendations,
   no projections stated as fact, no fabricated Regenera involvement in deals it wasn't
   part of.
3. Logo is REGENERA (all caps, no period, gold). Never restyle without instruction.
4. Header nav has NO Contact tab; contact is reached only via "Get in Touch" and footer.
   Important Notice / Privacy / Cookies are footer-triggered modal popups
   (`components/LegalModalProvider.tsx`), not separate pages; only Contact navigates.
5. Images: Wikimedia Commons only, via the deterministic thumb URL scheme already used.
   No image may appear twice anywhere on the site (home strip, Field Notes, lead-modal
   image, project cards all share one dedupe space). No visible photo credits (owner's
   decision; if licensing posture changes, add a /credits page rather than captions).
   Avoid AI-generated-looking images, generic green-leaf/handshake/glowing-Earth stock
   photography — prefer real infrastructure, agricultural landscapes, satellite imagery,
   maps.
6. Design changes (color, type, spacing) only on explicit instruction.
7. Contact form success message is exactly: "Thank you for your inquiry. We'll be in
   touch." — do not restore a longer confirmation message.
8. The public-facing contact address is always `info@regenera.bio`; actual delivery
   routes server-side to `alanprado@regenera.bio` via `CONTACT_TO_EMAIL`. Never expose
   the real delivery address in visible copy.

## How We Work — methodology (do not silently rephrase)
Three-phase model on `app/how-we-work/page.tsx`. Lede: "Regenera coordinates
multidisciplinary teams across land, energy, infrastructure, real estate, and capital to
advance complex projects from opportunity to execution." Phase I text intentionally
dropped an earlier "Five Capitals lens" reference (removed on request — don't reintroduce
it). Phase III closes with a standalone line, kept as its own paragraph: "The right
capital, in the right place, on the right terms." If asked to touch this section again,
treat the current copy as the approved baseline, not a draft.

## Lead-qualification modal (`components/LeadModal.tsx`)
Premium intent-capture modal, built to spec: triggers on scroll depth (50%) or a 20s
timer, only on an allowlist of paths (`/`, `/how-we-work`, `/services`, `/philosophy`,
`/projects`, `/field-notes`), suppressed for 15 days after dismissal/submission via
localStorage, shown once per session. On submit it hands off email + message to the
Contact page via `sessionStorage` (`rg_lead_handoff`), which `ContactForm.tsx` reads
once on mount and clears (imperative ref assignment, not `defaultValue`/state — needed
to avoid SSR/CSR hydration mismatches on prefill). Interests list lives in
`lib/leadOptions.ts` and is shared with the Contact form, not duplicated. Data lands in
`lead_intake` (Supabase), validated server-side against the same allowed `client_type`
and `interests` values as the client.
- Entrance animation deliberately uses `setTimeout(20ms)`, not `requestAnimationFrame` —
  rAF was found to be unreliable for triggering the animation in this project's testing
  environment; this is a real robustness fix, not a workaround to remove later.
- Modal image uses `loading="eager"` intentionally — the component's own conditional
  mount already provides lazy-loading; native `loading="lazy"` was observed to never
  fire in this environment's viewport-intersection detection, so eager is correct here,
  not a regression.

## Field Notes — editorial system
Field Notes is a research/intelligence publication, not a blog. The full standing
editorial reference lives in `content/field-notes/` — **read these before adding or
editing any article**:
- `content/field-notes/EDITORIAL_SYSTEM.md` — taxonomy, article structure, voice,
  "never do this" list, sourcing hierarchy, retrospective-research rules, related-posts
  scoring, Monthly Systems Brief format, cross-linking rules.
- `content/field-notes/SOURCES.md` — trusted source watchlist by desk.
- `content/field-notes/WEEKLY_EDITORIAL_PROMPT.md` — the actual publishing workflow
  (weekly ongoing cadence + one-time historical backfill), scoring rubric, image
  standard, automation safety rules, corrections policy.

Do not re-derive a different taxonomy or workflow from scratch — these three files are
the source of truth and were deliberately authored to support future automated weekly
publishing.

**Taxonomy** (`lib/fieldNotesTaxonomy.ts`): 7 systems (Land & Soil, Water, Energy &
Waste, Food Systems, Community & Health, Built Environment, Orbital Intelligence,
color-mapped via `SYSTEM_COLOR_VAR`), 8 analytical lenses (Capital & Markets, Asset
Economics, Project Delivery, Policy & Standards, Technology & Infrastructure,
Measurement & Verification, Resilience & Risk, Systems Design), 7 regions.

**Data model** (`lib/fieldNotes.ts`): every `FieldNote` carries `system` + `lens`
(required), optional `secondarySystem`, `region`, `tags`, plus a set of optional
analytical sections (`keySignal`, `whyItMatters`, `systemConnection`,
`capitalImplication`, `developmentImplication`, `whatWeAreWatching`, `sources`). All 22
original articles were preserved verbatim (title/date/body/image) and retrofitted with
this taxonomy rather than rewritten.

**Date model — load-bearing distinction, do not collapse it**: `date` is the true
publication date (never backdated). `archiveDate` is the historical period a
retrospective article analyzes. `eventDate` is the precise date of the specific event
discussed, when known. `displayDate(post)` (in `lib/fieldNotes.ts`) shows `archiveDate`
when present, else falls back to `date` — this is what cards, the featured block, and
the article header must render, **never raw `post.date` directly** when archiveDate
might be set. `isRetrospective(post)` gates a transparent on-page note (added to
`app/field-notes/[slug]/page.tsx`) stating the archive period being analyzed and the
true publication date. This exists because a batch of historical articles all publish
in the same month but analyze different past periods — without this distinction the
chronological archive UI (grouped by `archiveYear()`) would visually misrepresent when
things happened.

**Anti-fabrication rules (non-negotiable, user-specified)**: never invent figures,
transactions, quotes, sources, or dates. Never fabricate Regenera involvement in a deal
it wasn't part of. Verify every material financial figure against a primary source
before publishing; distinguish target/commitment/first close/final close/AUM/project
value/financing/grant/investment/pipeline/deployed capital — these are not
interchangeable words. "Regenerative" requires an explained mechanism in the copy, not
just ESG/sustainability language. If a claim can't be verified, cut it — don't guess.
Source tiers: Tier 1 primary (governments, regulators, MDBs/DFIs, filings, journals) >
Tier 2 institutional research > Tier 3 specialist trade media > Tier 4 discovery-only
(never cite directly, use only to find a Tier 1-3 source).

## Historical Field Notes backfill — in progress, read before continuing
User request: build a retrospective research archive from July 2024 to present
(~40-60 articles, unevenly distributed, favoring genuine structural importance over
even monthly coverage — see per-system targets and narrative threads in
`WEEKLY_EDITORIAL_PROMPT.md`).

**Explicitly rejected approach**: fabricating plausible-sounding historical
articles/figures to hit the 40-60 count quickly. I raised this concern directly and the
user corrected/clarified rather than overriding it: *"i dont want you to invent
content, i want you to use real content as if you were writing in july of 2024... so
yes, bulk generate everything... and finish."* — i.e., the volume request stands, but
every entry must be genuinely researched (WebSearch) and sourced, same bar as a live
weekly pick. Do not skip verification to move faster; if the honest, verified count
comes in under 40-60, say so plainly rather than padding it.

**Status**: ~19 real, source-verified historical candidates had been researched
(spanning July 2024 through mid-2026) but had NOT yet been written into the `POSTS`
array in `lib/fieldNotes.ts` as of the last session. The `displayDate`/`isRetrospective`
plumbing described above was built specifically to support this batch and is done.
Remaining before this task is actually finished:
1. Write the researched entries into `lib/fieldNotes.ts` with real `archiveDate` /
   `eventDate`, correct taxonomy, original Regenera-voice analysis (not copied from any
   source), and real `sources` (label + URL).
2. `npm run build` + `npx next lint` clean (stop dev server first).
3. Mobile/desktop QA on the archive UI (filters, year grouping, featured block,
   retrospective note) — this codebase has a known history of responsive-CSS
   cascade bugs (see below), so check new content at a 375px viewport specifically.
4. Commit and push to `main`.
5. Report to the user honestly against the 40-60 target — this was already flagged as a
   likely partial delivery, not a promised full 40-60.

Water, Orbital Intelligence, and Community & Health were the lightest-covered systems
in the researched batch relative to their targets — prioritize these if continuing.

## Known recurring bug pattern — CSS cascade
This codebase previously shipped a real mobile bug (`.phase-g` grid) caused by a class
being defined once correctly inside a `@media(max-width:...)` block and then redefined
unconditionally *later in the file*, so the later rule always won regardless of
viewport. When adding new responsive CSS to `app/globals.css`, keep base/desktop rules
before all media-query blocks, and grep for duplicate class definitions before trusting
a mobile screenshot report from the user.

## Testing-environment quirks (not app bugs — don't chase these as regressions)
- The Browser pane's console-message capture accumulates history per-tab across
  navigations; a stale error can appear to persist after a fix. Open a fresh tab
  (`tabs_create`) before trusting a "still broken" console read.
- `requestAnimationFrame` and native `loading="lazy"` were both found unreliable in this
  specific testing environment (see Lead Modal section above) — the fixes already
  applied for that are correct production behavior, not environment hacks to revert.

## Content conventions
- Tone: institutional, precise, mechanism-first. PhD-level assessment written for
  investors, developers, and operators. Avoid greenwashing language; "regenerative"
  used sparingly and only with an explained mechanism.
- Headline figures: 10 GW energy pipeline, 30+ projects and mandates, 5+ countries
  engaged, 7 ecosystem layers, global capital network. Keep consistent across pages.
  (Per-project cards keep their own indicative figures: Sub-Saharan 2.1 GW, Mexico 4 GW.)

## Known open items
- `npm audit` shows remaining high-severity advisories on next@14.2.35; upgrading to
  Next 15/16 is a known future task (breaking changes).
- Email notifications are best-effort, not required for a submission to succeed. Contact
  form email requires `RESEND_API_KEY` and `CONTACT_FROM_EMAIL` (verified sender domain in
  Resend); subscribe form email requires `BUTTONDOWN_API_KEY`. Without them, the form still
  succeeds (row is stored in Supabase), it just skips the email and logs why server-side.
  `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` are required for the
  forms to work at all. `CONTACT_TO_EMAIL=alanprado@regenera.bio` sets real delivery
  address (public copy stays `info@regenera.bio`, see Hard Rules). See `.env.example` and
  `DEPLOY.md`.
- `.env.production` IS committed to git (deliberately, on explicit user confirmation) —
  this is safe only because it contains the Supabase *publishable* key plus
  insert-only/no-select RLS, never a secret key. Don't generalize this exception to any
  other credential.
- Historical Field Notes backfill is mid-flight — see dedicated section above.

## Resolved
- Contact + subscribe + lead-intake forms write to Supabase as source of truth, then
  best-effort notify via Resend (`app/api/contact/route.ts`) and Buttondown
  (`app/api/subscribe/route.ts`).
- Fonts migrated to `next/font/google` (Cormorant Garamond, Instrument Sans), exposed as
  `--font-serif` / `--font-sans` consumed by `--serif` / `--sans` in globals.css.
- Scroll-reveal ported via `components/ScrollReveal.tsx` (IntersectionObserver, threshold
  0.1, respects prefers-reduced-motion). Deferred one animation frame on mount so it
  doesn't race hydration of Suspense-deferred client components (e.g. ContactForm).
- All Wikimedia field-note image URLs fetch-verified (200).
- `app/sitemap.ts`, `app/robots.ts`, and per-post JSON-LD Article schema (with
  `author`, `dateModified`, `about: post.system`) added.
- Mobile header nav wrapping bug fixed (`@media(max-width:1120px)` + `white-space:nowrap`).
- Field Notes fully rebuilt: taxonomy-driven data model, filterable/year-grouped
  archive UI, upgraded article template, algorithmic related-posts, cross-linking from
  Services into Field Notes (`components/FromFieldNotes.tsx`).
