# Website Conversion System

How a visitor moves from an anonymous page view to a qualified CRM
opportunity. This is the practical map behind the CTA hierarchy and
segmented-routing requirements in the Master Operating Blueprint (sections
11-12), kept in sync with what's actually built, not the full aspirational
architecture.

## CTA hierarchy

| Context | CTA | Destination (current / planned) |
| --- | --- | --- |
| Universal | Discuss a Project | `/contact?path=general` |
| Developer | Submit a Project | `/for-developers` (planned) |
| Project readiness | Assess Project Readiness | Project Readiness Diagnostic page (planned) |
| Investor | Discuss Your Mandate | `/for-investors` (planned) |
| Landowner | Assess My Land | `/for-landowners` (planned) |
| Operator | Discuss Your Site | `/for-operators` (planned) |

The current homepage "doors" section and `/contact?path=X` routing already
implement a version of segmented CTAs (investor / developer / realestate /
operator), predating this document. The counterparty pages above are the
next step: dedicated pages that start from the visitor's problem before
routing to contact, not contact-form path parameters alone.

## The funnel as it exists today

1. **Landing**: homepage, a service/sector page, or a Field Note.
2. **Routing**: homepage doors, nav, or in-content CTAs point toward
   Services, a sector page, or Contact.
3. **Form**: `ContactForm.tsx` (general enquiry) or `LeadModal.tsx`
   (scroll/timer-triggered, allowlisted paths only, see `CLAUDE.md`).
4. **Storage**: Supabase `contact_submissions` / `lead_intake` (permanent
   record of the raw submission).
5. **CRM ingestion**: `lib/crm/ingest.ts` creates/updates an
   organization, contact, opportunity, and activity record, see
   `docs/commercial/LEAD_SCHEMA.md` for the field mapping.
6. **Notification**: best-effort email via Resend (contact form only),
   never blocks the submission if it fails.
7. **Human follow-up**: currently manual, staff review the CRM dashboard
   (`/crm`) and work opportunities from there. No automated
   scoring/routing exists yet (blueprint section 14, not started).

## What's tracked today vs. what the blueprint calls for

Currently tracked (`lib/analytics.ts` + existing event calls): page views,
outbound link clicks, and form submission success/failure.

Not yet tracked, per Appendix A10: CTA click (as a distinct event from form
submission), service page view, sector page view, form start (vs. submit),
scheduling initiation (no scheduling tool exists yet), newsletter signup
(separately from contact/lead), capability brief view/download (no such
asset exists yet), UTM/source persistence into lead records (see the gap
noted in `LEAD_SCHEMA.md`).

## Selectivity is a deliberate design constraint, not a gap

Per the blueprint's non-negotiable operating principles: a form submission
must never be presented as guaranteeing a meeting or engagement. Any future
auto-response copy, confirmation page, or scheduling flow should preserve
this, "we'll review and follow up" language, not "book your call now"
language, unless a real, unconditional scheduling link is actually being
offered to everyone who submits.

## Where this connects to other docs

- `docs/commercial/LEAD_SCHEMA.md`: exact field mapping from form to CRM.
- `docs/crm/DATA_MODEL.md`: full CRM schema, including the qualification
  scoring fields (`need_score`, `authority_score`, etc.) that exist in the
  schema but have no scoring logic wired to them yet.
- `docs/commercial/CAMPAIGN_LANDING_PAGE_TEMPLATE.md`: the landing-page
  half of this funnel for outbound/campaign traffic specifically, as
  distinct from organic/direct visitors.
