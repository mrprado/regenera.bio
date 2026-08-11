-- Intelligence OS core schema (Phase 2). Implements the ontology in
-- docs/intelligence-system/ARCHITECTURE.md: source registry -> captured
-- documents -> detected changes -> evidence -> knowledge-graph entities and
-- relationships, plus an agent registry/run log and a signals/reports layer
-- kept separate from the CRM's own `opportunities` table (signals are
-- unreviewed agent output; CRM opportunities are confirmed real pipeline).
--
-- Access is gated by a NEW staff.has_intel_access flag, independent of CRM
-- staff access -- intel-system access is granted per person, not implied by
-- being CRM staff. Follows the is_active_staff()-style SECURITY DEFINER
-- helper pattern (docs/crm/SECURITY_MODEL.md) throughout: never an inline
-- EXISTS subquery on a table referencing itself or another RLS table.

alter table staff add column if not exists has_intel_access boolean not null default false;

create or replace function is_intel_access()
returns boolean
language sql
security definer
set search_path = ''
stable
as $$
  select exists (
    select 1 from public.staff
    where id = auth.uid() and is_active and has_intel_access
  );
$$;

revoke execute on function is_intel_access() from public;
grant execute on function is_intel_access() to authenticated;

-- 1. Source registry -----------------------------------------------------

create table intel_sources (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  source_type text not null check (source_type in ('website', 'regulatory_filing', 'news_feed', 'social', 'document_portal', 'api')),
  url text,
  category text,
  jurisdiction text,
  check_frequency interval,
  is_active boolean not null default false,
  last_checked_at timestamptz,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger intel_sources_updated_at before update on intel_sources
  for each row execute function crm_set_updated_at();

-- 2. Captured documents ---------------------------------------------------

create table intel_documents (
  id uuid primary key default gen_random_uuid(),
  source_id uuid not null references intel_sources(id) on delete cascade,
  fetched_at timestamptz not null default now(),
  url text,
  content_hash text,
  -- Inline for small captures; a Supabase Storage path once content
  -- exceeds a few KB (see ARCHITECTURE.md storage note). Not enforced at
  -- the schema level -- collector code decides which.
  raw_content text,
  http_status int,
  created_at timestamptz not null default now()
);
create index intel_documents_source_id_idx on intel_documents(source_id);
create index intel_documents_content_hash_idx on intel_documents(content_hash);

-- 3. Detected changes ------------------------------------------------------

create table intel_changes (
  id uuid primary key default gen_random_uuid(),
  source_id uuid not null references intel_sources(id) on delete cascade,
  previous_document_id uuid references intel_documents(id) on delete set null,
  new_document_id uuid not null references intel_documents(id) on delete cascade,
  detected_at timestamptz not null default now(),
  diff_summary text,
  significance text check (significance in ('noise', 'minor', 'notable', 'major'))
);
create index intel_changes_source_id_idx on intel_changes(source_id);

-- 4. Knowledge graph: entities and relationships ---------------------------

create table intel_entities (
  id uuid primary key default gen_random_uuid(),
  entity_type text not null check (entity_type in ('organization', 'person', 'fund', 'project', 'asset', 'regulator', 'jurisdiction')),
  name text not null,
  aliases text[] not null default '{}',
  details jsonb not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index intel_entities_type_idx on intel_entities(entity_type);
create index intel_entities_name_idx on intel_entities(name);
create trigger intel_entities_updated_at before update on intel_entities
  for each row execute function crm_set_updated_at();

create table intel_entity_relationships (
  id uuid primary key default gen_random_uuid(),
  from_entity_id uuid not null references intel_entities(id) on delete cascade,
  to_entity_id uuid not null references intel_entities(id) on delete cascade,
  relationship_type text not null,
  confidence numeric check (confidence between 0 and 1) default 0.5,
  valid_from date,
  valid_to date,
  created_at timestamptz not null default now()
);
create index intel_entity_relationships_from_idx on intel_entity_relationships(from_entity_id);
create index intel_entity_relationships_to_idx on intel_entity_relationships(to_entity_id);

-- 5. Evidence ledger --------------------------------------------------------
-- Every entity/relationship fact traces back to exactly one captured
-- document. Points at either an entity OR a relationship, never both/neither.

create table intel_evidence (
  id uuid primary key default gen_random_uuid(),
  entity_id uuid references intel_entities(id) on delete cascade,
  relationship_id uuid references intel_entity_relationships(id) on delete cascade,
  claim_text text not null,
  document_id uuid not null references intel_documents(id) on delete cascade,
  extracted_by text not null default 'manual',
  confidence numeric check (confidence between 0 and 1),
  extracted_at timestamptz not null default now(),
  constraint intel_evidence_exactly_one_subject check (
    (entity_id is not null)::int + (relationship_id is not null)::int = 1
  )
);
create index intel_evidence_entity_id_idx on intel_evidence(entity_id);
create index intel_evidence_relationship_id_idx on intel_evidence(relationship_id);
create index intel_evidence_document_id_idx on intel_evidence(document_id);

-- 6. Agent registry and run log ---------------------------------------------

create table intel_agents (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  role_description text,
  domain text,
  schedule text,
  status text not null default 'planned' check (status in ('planned', 'active', 'paused')),
  created_at timestamptz not null default now()
);

create table intel_agent_runs (
  id uuid primary key default gen_random_uuid(),
  agent_id uuid not null references intel_agents(id) on delete cascade,
  started_at timestamptz not null default now(),
  finished_at timestamptz,
  status text not null default 'running' check (status in ('running', 'success', 'failed')),
  summary text,
  stats jsonb not null default '{}'
);
create index intel_agent_runs_agent_id_idx on intel_agent_runs(agent_id);

-- 7. Signals (unreviewed agent output, distinct from CRM opportunities) ----

create table intel_signals (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  relevance_score numeric check (relevance_score between 0 and 1),
  entity_ids uuid[] not null default '{}',
  evidence_ids uuid[] not null default '{}',
  generated_by_agent_id uuid references intel_agents(id) on delete set null,
  -- Deliberately NOT a foreign key constraint tying this schema to the CRM's
  -- opportunities table structurally; promotion is a logged fact, not a
  -- hard link the intel schema depends on.
  promoted_to_opportunity_id uuid,
  status text not null default 'new' check (status in ('new', 'reviewed', 'dismissed', 'promoted')),
  created_at timestamptz not null default now()
);
create index intel_signals_status_idx on intel_signals(status);

-- 8. Reports and delivery log ------------------------------------------------

create table intel_reports (
  id uuid primary key default gen_random_uuid(),
  report_type text not null check (report_type in ('daily_morning', 'daily_evening', 'weekly', 'monthly')),
  period_start date,
  period_end date,
  content text not null,
  generated_at timestamptz not null default now()
);

create table intel_report_deliveries (
  id uuid primary key default gen_random_uuid(),
  report_id uuid not null references intel_reports(id) on delete cascade,
  channel text not null check (channel in ('email', 'whatsapp')),
  status text not null default 'pending' check (status in ('pending', 'sent', 'failed')),
  delivered_at timestamptz,
  error text
);
create index intel_report_deliveries_report_id_idx on intel_report_deliveries(report_id);

-- RLS: every intel_* table, gated on is_intel_access(), same "_staff_all"
-- shape as the CRM tables.

alter table intel_sources enable row level security;
alter table intel_documents enable row level security;
alter table intel_changes enable row level security;
alter table intel_entities enable row level security;
alter table intel_entity_relationships enable row level security;
alter table intel_evidence enable row level security;
alter table intel_agents enable row level security;
alter table intel_agent_runs enable row level security;
alter table intel_signals enable row level security;
alter table intel_reports enable row level security;
alter table intel_report_deliveries enable row level security;

create policy intel_sources_staff_all on intel_sources for all
  using (is_intel_access()) with check (is_intel_access());
create policy intel_documents_staff_all on intel_documents for all
  using (is_intel_access()) with check (is_intel_access());
create policy intel_changes_staff_all on intel_changes for all
  using (is_intel_access()) with check (is_intel_access());
create policy intel_entities_staff_all on intel_entities for all
  using (is_intel_access()) with check (is_intel_access());
create policy intel_entity_relationships_staff_all on intel_entity_relationships for all
  using (is_intel_access()) with check (is_intel_access());
create policy intel_evidence_staff_all on intel_evidence for all
  using (is_intel_access()) with check (is_intel_access());
create policy intel_agents_staff_all on intel_agents for all
  using (is_intel_access()) with check (is_intel_access());
create policy intel_agent_runs_staff_all on intel_agent_runs for all
  using (is_intel_access()) with check (is_intel_access());
create policy intel_signals_staff_all on intel_signals for all
  using (is_intel_access()) with check (is_intel_access());
create policy intel_reports_staff_all on intel_reports for all
  using (is_intel_access()) with check (is_intel_access());
create policy intel_report_deliveries_staff_all on intel_report_deliveries for all
  using (is_intel_access()) with check (is_intel_access());
