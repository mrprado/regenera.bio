# Regenera CRM / Operating System — Architecture

**Status: PROPOSAL, not yet implemented.** No migration in this document has been
applied to the production Supabase project. This file exists so the schema and
security model can be reviewed before anything touches the database that also
backs the live public site's forms.

## Why internal, not an external CRM

An earlier planning pass toward this specification considered an external CRM
(Attio, HubSpot, or similar) as the system of record. That direction was
explicitly superseded: Regenera's own instruction is to build a private,
internal CRM and business operating system on the existing Supabase project
instead, using Supabase Auth, Postgres, and the same Next.js application. Do
not reintroduce an external CRM platform without an equally explicit
instruction to do so.

## What this is not

This is not the public website. It is not indexed, not linked from public
navigation, and never accepts anonymous writes. It holds real business data:
client names, deal values, investor mandates, personal contact information.
Treat every design decision here with that in mind first, developer
convenience second.

## Where it lives

- Route: `/crm/*` inside the existing Next.js app, as a route group requiring
  an authenticated session on every request (server-side check, not just a
  client-side redirect).
- Same Supabase project (`xbgrtjcslbnnvvhwqcye`, "Regenera.bio") as the public
  site. Audited 2026-08-08: the project is new, has exactly three tables
  (`contact_submissions`, `subscribers`, `lead_intake`, all anon-insert-only,
  no rows of consequence), Supabase Auth is provisioned but has zero users,
  and there are no naming collisions with the CRM schema below. This is a
  clean base to build on, not a retrofit.
- CRM tables are entirely separate from the three public form tables. The
  public tables keep their current anon-insert-only RLS, untouched. A
  server-side (service-role) process is what moves a public submission into
  CRM records, a public visitor never gets read or write access to CRM data
  at any point.

## Phasing

Do not attempt every capability in this document at once. Sequence:

**Phase 1, Core CRM** (this document plus `DATA_MODEL.md` and
`SECURITY_MODEL.md` describe this phase): Supabase Auth for internal staff
only, RLS on every CRM table, the core schema (organizations, contacts,
opportunities, projects, project dependencies, regenerative function records,
capital mandates, partners, introductions, activities, tasks, notes/quick
capture), a dashboard, and ingestion from the three existing public forms
into CRM records. Fully tested before Phase 2 begins.

**Phase 2, Operating intelligence**: daily dashboard views, relationship
staleness indicators, pipeline aging, weekly/monthly report snapshots,
notification rules. Still no external service credentials required, this
phase runs entirely on data already in Postgres.

**Phase 3, Communications**: Gmail integration (OAuth), WhatsApp Business
Platform integration, calendar/scheduling. Each requires real external
credentials Regenera does not yet have. Build the adapter and webhook
surface, but the feature stays visibly "Not connected" until credentials
exist, per the external dependency rule in `SECURITY_MODEL.md`.

**Phase 4, Advanced AI**: meeting prep, post-meeting extraction, an
opportunity assistant, capital matching suggestions, email drafting, and the
daily executive brief. Requires a production `ANTHROPIC_API_KEY` (or
equivalent) configured server-side, never client-exposed. Every AI
suggestion in this phase requires human approval before it changes a CRM
record, none of it writes automatically.

## Core entities (Phase 1)

See `DATA_MODEL.md` for full column definitions. At a glance:

- **organizations** — companies Regenera has any relationship with (prospects,
  clients, investors, partners, etc.)
- **contacts** — people, linked to organizations, not duplicated across roles
- **opportunities** — potential paid Regenera engagements, with a pipeline
  stage
- **projects** — real-asset projects/mandates, which can exist independent of
  a sales opportunity
- **project_dependencies** — structured dependency/constraint records per
  project (land, water, energy, capital, specialist capability, etc.)
- **regenerative_function_records** — the structured justification required
  any time a project is internally described as regenerative (see
  `docs/commercial/REGENERATIVE_CLAIMS_STANDARD.md`)
- **capital_mandates** — investor appetite records, a distinct relationship
  type from a sales opportunity
- **partners** — specialist firms and referral partners
- **introductions** — a log of who was introduced to whom, why, and the
  commercial terms, kept separately because it carries its own legal weight
- **activities** — every logged interaction (call, email, meeting, etc.)
- **tasks** — the task system; the operating rule is no qualified opportunity
  exists without a next task
- **notes** — free-text quick capture, optionally AI-parsed into structured
  suggestions that a human must accept before anything changes

## What Phase 1 deliberately excludes

No Gmail or WhatsApp integration, no scheduled Supabase Edge Functions, no AI
features beyond structuring quick-capture notes for human review, no mobile
app (the responsive web app is enough). Building these before the core
schema is tested and reviewed would multiply the surface area of a
business-critical system before its foundation is confirmed solid.
