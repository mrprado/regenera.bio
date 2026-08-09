# Campaign Landing Page Template

**Status: template specified, no route built yet.** This defines the
structure a campaign landing page should follow once outbound campaigns
exist (blueprint section 8, "Market Segmentation and Campaign Strategy").
Not yet implemented as an actual Next.js route or reusable component.

## Why a dedicated template, not the homepage

Per the blueprint's core operating logic, outbound and campaign traffic
should never land on the general homepage. Each campaign combines one
audience, one trigger/problem, one offer, one proof asset, and one landing
page, sending broad-homepage traffic to a narrow page defeats the purpose
of having qualified a specific audience and problem in the first place.

## Required sections, in order

1. **Problem-specific headline**: states the visitor's likely situation,
   not Regenera's positioning. Written from the campaign's problem
   hypothesis (see the campaign design template in the blueprint, section
   8), not a generic service description.
2. **One paragraph of context**: why this is relevant now (the trigger),
   in the visitor's terms.
3. **The single relevant offer**: one diagnostic or engagement type, not
   a menu of all six practices. Links to that offer's dedicated page.
4. **One piece of evidence**: a relevant Field Note, Selected Mandate, or
   Case Study that supports relevance to this specific audience. Never
   fabricated, never a Reference Project presented as Regenera's own work
   (see `docs/commercial/REGENERATIVE_CLAIMS_STANDARD.md` and
   `SPECIALIST_DELIVERY_MODEL.md` for the underlying discipline).
5. **A single CTA**: matching the CTA hierarchy in
   `WEBSITE_CONVERSION_SYSTEM.md` for that audience type. One CTA, not
   several competing ones.
6. **Form**: the segmented form for that audience type, once those exist
   (currently the site only has the general contact form and the lead
   modal, see `LEAD_SCHEMA.md`'s "what's deliberately not captured yet").

## URL and attribution requirements

- Route pattern: `/campaign/[slug]`, e.g. `/campaign/land-systems` (the
  blueprint's own example table references `/campaign/land-systems` for
  the California/Southwest Landowners campaign).
- Every campaign landing page must accept and persist UTM parameters into
  the lead record on submission, this is a real, currently unmet
  requirement, see the UTM gap noted in `LEAD_SCHEMA.md`. Do not build the
  page template without also closing that gap, an untracked campaign page
  defeats its own purpose.
- `noindex` is not required (campaign pages can be found organically too),
  but each should have its own canonical URL and metadata distinct from
  the general service/sector page it draws from.

## Content discipline

Same rules as every other page on the site: no fabricated figures, no
implied guarantee of a meeting or engagement, "regenerative" only with a
named mechanism, Regenera's role never overstated relative to the
specialists it coordinates with. A campaign page under time pressure is
exactly the situation where these rules are most likely to get cut, treat
that pressure as a reason for more discipline, not less.

## Build sequencing note

This template depends on the four counterparty pages and diagnostic pages
existing first (a campaign page links to them), and benefits from the
segmented forms existing (so it can capture audience-specific fields, not
just the general contact form). Build those first; this is a thin wrapper
around them, not new content in itself.
