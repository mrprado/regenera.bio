# Regenera CRM — Data Model (Phase 1 proposal)

**Status: PROPOSAL.** Column lists below are the working design for the first
migration. Not yet applied. See `CRM_ARCHITECTURE.md` for phasing and
`SECURITY_MODEL.md` for the RLS approach each table needs before this can go
live.

Conventions used throughout: `id uuid primary key default gen_random_uuid()`,
`created_at timestamptz not null default now()`, `updated_at timestamptz not
null default now()` (kept current by trigger, not application code),
`created_by uuid references staff(id)`, `owner_id uuid references staff(id)`.
Soft-delete via `archived_at timestamptz` rather than hard deletion on every
table listed here except `activities` and `notes`, which are append-only logs.

## staff

Internal Regenera users. Not the same as `auth.users`, this is the
application-level profile row RLS policies key off, so access can be revoked
without touching Supabase Auth accounts directly.

`id uuid references auth.users(id) primary key`, `full_name text`, `email
text unique`, `role text` (e.g. `admin`, `staff`), `is_active boolean default
true`, `created_at`.

No public sign-up path exists anywhere in the app. Rows here are created only
by an existing admin, directly in the database or through an admin-only
internal action, never a public form.

## organizations

`id`, `name text not null`, `legal_name text`, `website text`,
`organization_type text` (prospect, client, developer, sponsor, investor,
family_office, fund, landowner, operator, epc, engineer, architect, legal,
technology_provider, government, development_institution, research_institution,
partner, other), `headquarters text`, `geographies text[]`, `sectors text[]`
(values from the site's existing 8-category Field Notes taxonomy, so
commercial and editorial sector language stay one vocabulary, not two),
`description text`, `relationship_status text`, `relationship_strength
smallint`, `owner_id`, `source text`, `tags text[]`, `last_activity_at
timestamptz`, `next_action_at timestamptz`, `notes text`, audit + archive
columns.

## contacts

`id`, `organization_id references organizations(id)`, `first_name`,
`last_name`, `full_name text generated always as (first_name || ' ' ||
last_name) stored`, `title text`, `email text`, `phone text`, `whatsapp text`,
`linkedin_url text`, `geography text`, `relationship_type text`,
`relationship_strength smallint`, `preferred_channel text`, `consent_marketing
boolean default false`, `source text`, `last_contact_at timestamptz`,
`next_contact_at timestamptz`, `owner_id`, `notes text`, audit + archive
columns.

A person with more than one relationship role (e.g. investor and partner) is
one row with multiple tags/relationship records, not duplicated rows.

## opportunities

`id`, `opportunity_name text not null`, `organization_id`, `primary_contact_id
references contacts(id)`, `project_id references projects(id)` nullable,
`service text` (one of the six practices' serviceValue, see
`lib/practices.ts`), `engagement_type text` (which
diagnostic or engagement), `sector text`, `geography text`, `stage text not
null default 'target'` (see stage list below), `estimated_value numeric`,
`probability smallint`, `weighted_value numeric generated always as
(estimated_value * probability / 100.0) stored`, `currency text default
'USD'`, `target_close_date date`, `source text`, `campaign_id text`,
qualification scores (`need_score`, `authority_score`, `readiness_score`,
`economic_capacity_score`, `timing_score`, `regenera_fit_score`,
`expansion_score`, `strategic_value_score`, each `smallint`),
`qualification_class text` (priority_a, priority_b, priority_c_diagnostic,
refer_decline), `next_action text`, `next_action_date date`, `last_activity_at
timestamptz`, `loss_reason text`, `owner_id`, `notes text`, audit + archive
columns.

Stage values: `target`, `contacted`, `engaged`, `discovery`, `qualified`,
`diagnostic_proposed`, `diagnostic_active`, `advisory_proposed`,
`active_client`, `expansion`, `nurture`, `closed_won`, `closed_lost`. Stored
as a `check` constraint, not a Postgres enum, specifically so the stage list
can change without a destructive type migration.

Qualification scores and `qualification_class` are internal only, never
rendered on any public page or exposed through any public API.

## projects

`id`, `project_name text not null`, `organization_id`, `primary_contact_id`,
`sector text`, `secondary_sectors text[]`, `location text`, `country text`,
`region text`, `latitude numeric`, `longitude numeric`, `stage text`,
`asset_type text`, `estimated_value numeric`, `capital_requirement numeric`,
`land_status text`, `permitting_status text`, `technical_status text`,
`offtake_status text`, `financing_status text`, `regenera_role text`,
`specialist_roles text[]`, `current_constraint text`, `risk_status text`,
`readiness_status text`, `regenerative_status text` (`not_claimed`,
`under_assessment`, `assessed_see_regenerative_function_records`), `summary
text`, `next_milestone text`, `next_milestone_date date`, `owner_id`, audit +
archive columns.

A project can exist with zero linked opportunities, engagement precedes sales
interest often enough that this must not be forced through the opportunity
table.

## project_dependencies

`id`, `project_id not null`, `dependency_type text` (land, water, energy,
materials, critical_minerals, feedstock, agriculture, logistics, roads,
ports, grid, telecom, data, environmental, community, governance, permitting,
offtake, capital, specialist_capability, orbital_earth_observation),
`description text`, `severity text`, `status text`, `current_capacity text`,
`required_capacity text`, `constraint_detail text`, `feedback_effect text`,
`mitigation text`, `owner_id`, `monitoring_indicator text`, audit columns.

This table is what makes the systems-dependency methodology (see the
blueprint's section on System Dependency & Feedback Analysis) a structured
record instead of prose scattered across notes.

## regenerative_function_records

`id`, `project_id not null`, `function_strengthened text not null` (soil
function, water cycle, biodiversity/ecology, productive capacity, landscape
resilience, community resilience, local economic capability, resource
circularity, long-term system capacity), `baseline text not null`,
`mechanism text not null`, `evidence_type text`, `evidence text`, `metric
text`, `current_value text`, `target_value text`, `durability text`,
`dependencies text`, `tradeoffs text`, `beneficiaries text`, `costs_borne_by
text`, `monitoring_requirement text`, `verification_status text`, audit
columns.

`function_strengthened`, `baseline`, and `mechanism` are `not null` by design.
Per `REGENERATIVE_CLAIMS_STANDARD.md`, the word "regenerative" should not
attach to a project internally without this row existing and those three
fields being genuinely filled in, not placeholder text.

## capital_mandates

`id`, `investor_organization_id references organizations(id)`, `contact_id`,
`investor_type text`, `ticket_min numeric`, `ticket_max numeric`, `currencies
text[]`, `sectors text[]`, `geographies text[]`, `stage_preferences text[]`,
`debt_equity_preference text`, `structure_preferences text`, `risk_profile
text`, `return_profile text`, `exclusions text`, `development_appetite text`,
`natural_capital_interest text`, `current_appetite text`, `summary text`,
`last_validated_at date`, `next_followup_at date`, `relationship_strength
smallint`, `owner_id`, audit + archive columns.

Kept structurally separate from `opportunities`, an investor relationship is
not a sales pipeline stage, it is an ongoing mandate that gets matched
against multiple projects over time.

## introductions

`id`, `opportunity_id` nullable, `project_id` nullable,
`introducing_staff_id references staff(id)`, `from_contact_id`,
`to_contact_id`, `date date not null`, `purpose text`, `commercial_agreement
text`, `fee_basis text`, `nda_status text`, `materials_shared text`,
`meeting_status text`, `diligence_status text`, `outcome text`, `next_action
text`, `next_action_date date`, `notes text`, audit columns.

This table carries real legal and commercial weight (fee basis, NDA status),
treat edits to existing rows as append-worthy history, not silent overwrites,
consider whether this table needs its own audit trail beyond `updated_at`
once real introductions start flowing through it.

## partners

`id`, `organization_id`, `capabilities text[]`, `sectors text[]`,
`geographies text[]`, `typical_project_size text`, `relationship_type text`,
`commercial_model text`, `agreement_status text`, `quality_rating smallint`,
`preferred_status boolean default false`, `last_contact_at timestamptz`,
`next_contact_at timestamptz`, `owner_id`, `notes text`, audit + archive
columns.

## activities

`id`, `activity_type text not null` (email, call, whatsapp, meeting,
video_call, linkedin, introduction, proposal, document_shared, note,
site_visit, follow_up), `occurred_at timestamptz not null`, `organization_id`,
`contact_id`, `opportunity_id`, `project_id`, `summary text`, `outcome text`,
`next_action text`, `next_action_date date`, `created_by not null`.

Append-only, no `archived_at`. Activities should render chronologically on
person/organization/project/opportunity pages via a query, not a
denormalized feed table.

## tasks

`id`, `task text not null`, `due_date date`, `priority text`, `status text
default 'open'`, `owner_id`, `contact_id`, `organization_id`, `opportunity_id`,
`project_id`, `task_type text`, `recurrence text`, `notes text`, audit
columns.

## notes (quick capture)

`id`, `raw_text text not null`, `created_by not null`, `created_at`,
`ai_suggested_updates jsonb`, `ai_status text default 'pending'` (`pending`,
`accepted`, `edited`, `dismissed`), `linked_organization_id`, `linked_contact_id`,
`linked_opportunity_id`, `linked_project_id`.

`ai_suggested_updates` stores whatever a future Phase 4 extraction step
proposes, structured, but nothing in this table's existence implies any
automatic write to another table. A human accepting a suggestion is a
separate, explicit action.

## Ingestion from the public forms

A server-side function (service role, never client-exposed) reads new rows
from `contact_submissions`, `subscribers`, and `lead_intake` and creates or
updates the matching `organizations`/`contacts`/`opportunities` records,
recording the original public table and row id for traceability. The public
tables themselves are never altered by this process, they remain the
permanent record of what was actually submitted.
