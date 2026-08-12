-- Investor Intelligence domain (bounded add-on to the Intelligence OS).
-- See docs/intelligence-system/INVESTOR_INTELLIGENCE.md for the design this
-- implements and why. Guiding rule: reuse existing entities, never
-- duplicate them. Concretely this means:
--   - candidate investor organizations/funds/people are rows in the
--     existing generic `intel_entities` table (entity_type organization |
--     person | fund), extended here with typed, filterable profile tables,
--     NOT a parallel entity system.
--   - evidence for investor-specific claims reuses the existing
--     `intel_evidence` ledger (extended with a few nullable columns below),
--     not a parallel claims table.
--   - a discovered investor is only ever promoted into the CRM's real
--     `organizations`/`contacts` tables by a deliberate human action,
--     mirroring the existing intel_signals -> opportunities promotion
--     pattern. The intelligence tables below are never the CRM itself.
--   - "capital mandate" here is named `project_investment_mandates`,
--     deliberately NOT `capital_mandates` -- that name is already taken by
--     the CRM's investor-appetite table (Phase 1 core schema). The two are
--     complementary: `capital_mandates` = what a known investor wants;
--     `project_investment_mandates` = what a Regenera project needs. A
--     match row can eventually reference either side.
--
-- All tables gated by the existing is_intel_access() helper, same shape as
-- every other intel_* table (docs/crm/SECURITY_MODEL.md pattern: helper
-- function, never an inline EXISTS subquery on an RLS table).

-- ============================================================
-- 0. Small extensions to existing shared tables
-- ============================================================

-- Source-quality tier (spec's Tier 1 authoritative / Tier 2 secondary /
-- Tier 3 discovery-only hierarchy). Nullable: unknown until classified,
-- same "don't assume, default to unclassified" posture as is_active on
-- intel_sources already establishes.
alter table intel_sources add column if not exists source_tier smallint check (source_tier between 1 and 3);

-- Richer evidence shape for structured claims (predicate/value pairs, not
-- just free-text claim_text), additive and nullable so every existing
-- intel_evidence row and every other extractor (SEC EDGAR, World Bank
-- procurement) keeps working unchanged.
alter table intel_evidence add column if not exists predicate text;
alter table intel_evidence add column if not exists normalized_value jsonb;
alter table intel_evidence add column if not exists raw_value text;
alter table intel_evidence add column if not exists source_tier smallint check (source_tier between 1 and 3);

-- ============================================================
-- 1. Organization-side investor profile (extends intel_entities)
-- ============================================================

create table investor_organization_profiles (
  entity_id uuid primary key references intel_entities(id) on delete cascade,
  investor_universe text not null check (investor_universe in (
    'family_office', 'strategic_capital', 'infrastructure_fund', 'private_equity',
    'institutional_investor', 'dfi_multilateral', 'foundation_catalytic',
    'investment_network', 'retail_channel'
  )),
  organization_subtype text,
  legal_name text,
  former_names text[] not null default '{}',
  canonical_domain text,
  headquarters text,
  office_locations text[] not null default '{}',
  direct_investor boolean,
  fund_manager boolean,
  strategic_investor boolean,
  parent_entity_id uuid references intel_entities(id) on delete set null,
  sectors text[] not null default '{}',
  subsectors text[] not null default '{}',
  geographies text[] not null default '{}',
  stages text[] not null default '{}',
  capital_types text[] not null default '{}',
  investment_structures text[] not null default '{}',
  check_min numeric,
  check_max numeric,
  currency text not null default 'USD',
  target_returns jsonb not null default '{}',
  time_horizon text,
  impact_priorities text[] not null default '{}',
  regenerative_functions text[] not null default '{}',
  exclusions text[] not null default '{}',
  aum numeric,
  aum_currency text,
  current_fund_status text,
  deployment_status text not null default 'unknown' check (deployment_status in ('actively_deploying', 'selective', 'paused', 'unknown')),
  last_investment_date date,
  last_verified_at timestamptz,
  confidence numeric check (confidence between 0 and 1),
  review_status text not null default 'discovered' check (review_status in (
    'discovered', 'collected', 'extracted', 'needs_verification', 'verified', 'qualified',
    'approved_for_crm', 'approved_for_contact', 'contacted', 'responded', 'referred',
    'declined', 'monitor', 'archived', 'suppressed'
  )),
  promoted_to_organization_id uuid references organizations(id) on delete set null,
  promoted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger investor_organization_profiles_updated_at before update on investor_organization_profiles
  for each row execute function crm_set_updated_at();
create index investor_organization_profiles_universe_idx on investor_organization_profiles(investor_universe);
create index investor_organization_profiles_review_status_idx on investor_organization_profiles(review_status);
create index investor_organization_profiles_domain_idx on investor_organization_profiles(canonical_domain);

-- ============================================================
-- 2. Person-side investor profile (extends intel_entities)
-- ============================================================

create table investor_person_profiles (
  entity_id uuid primary key references intel_entities(id) on delete cascade,
  investor_universe text check (investor_universe in (
    'accredited_individual', 'family_office', 'strategic_capital', 'infrastructure_fund',
    'private_equity', 'institutional_investor', 'dfi_multilateral', 'foundation_catalytic',
    'investment_network', 'retail_channel'
  )),
  linkedin_url text,
  current_title text,
  current_organization_entity_id uuid references intel_entities(id) on delete set null,
  professional_location text,
  seniority text,
  authority_classification text not null default 'unknown' check (authority_classification in (
    'economic_decision_maker', 'investment_sponsor', 'originator', 'technical_evaluator',
    'gatekeeper', 'influencer', 'advisor', 'unknown'
  )),
  sector_signals text[] not null default '{}',
  geography_signals text[] not null default '{}',
  investment_signals text[] not null default '{}',
  public_bio text,
  public_professional_email text,
  official_contact_url text,
  email_pattern_status text not null default 'unknown' check (email_pattern_status in ('verified', 'inferred', 'unknown')),
  accreditation_status text not null default 'unknown' check (accreditation_status in (
    'unknown', 'self_identified', 'platform_verified', 'third_party_verified', 'counsel_confirmed'
  )),
  accreditation_verification_method text,
  accreditation_verified_by text,
  accreditation_verified_at timestamptz,
  accreditation_notes text,
  last_verified_at timestamptz,
  confidence numeric check (confidence between 0 and 1),
  review_status text not null default 'discovered' check (review_status in (
    'discovered', 'collected', 'extracted', 'needs_verification', 'verified', 'qualified',
    'approved_for_crm', 'approved_for_contact', 'contacted', 'responded', 'referred',
    'declined', 'monitor', 'archived', 'suppressed'
  )),
  promoted_to_contact_id uuid references contacts(id) on delete set null,
  promoted_at timestamptz,
  do_not_contact boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger investor_person_profiles_updated_at before update on investor_person_profiles
  for each row execute function crm_set_updated_at();
create index investor_person_profiles_universe_idx on investor_person_profiles(investor_universe);
create index investor_person_profiles_authority_idx on investor_person_profiles(authority_classification);
create index investor_person_profiles_org_idx on investor_person_profiles(current_organization_entity_id);
create index investor_person_profiles_accreditation_idx on investor_person_profiles(accreditation_status);

-- Employment/role history. Append-only in practice (application code should
-- never overwrite a past row, only close it via ended_at and insert a new
-- current one) -- not enforced at the schema level, same trust posture as
-- the rest of this migration.
create table investor_person_roles (
  id uuid primary key default gen_random_uuid(),
  person_entity_id uuid not null references intel_entities(id) on delete cascade,
  organization_entity_id uuid references intel_entities(id) on delete set null,
  title text,
  started_at date,
  ended_at date,
  is_current boolean not null default true,
  source_document_id uuid references intel_documents(id) on delete set null,
  created_at timestamptz not null default now()
);
create index investor_person_roles_person_idx on investor_person_roles(person_entity_id);
create index investor_person_roles_org_idx on investor_person_roles(organization_entity_id);

-- Public professional contact channels for a candidate person. Distinct
-- from the CRM's contacts.email/phone -- those are for real, promoted
-- relationships; this is pre-promotion discovery data.
create table investor_contact_channels (
  id uuid primary key default gen_random_uuid(),
  person_entity_id uuid not null references intel_entities(id) on delete cascade,
  channel_type text not null check (channel_type in ('email', 'phone', 'contact_form', 'linkedin', 'other')),
  value text not null,
  source_url text,
  is_public boolean not null default true,
  is_professional boolean not null default true,
  verification_status text not null default 'unverified' check (verification_status in ('unverified', 'inferred', 'verified')),
  verified_at timestamptz,
  do_not_contact boolean not null default false,
  created_at timestamptz not null default now()
);
create index investor_contact_channels_person_idx on investor_contact_channels(person_entity_id);

-- ============================================================
-- 3. Funds and transactions
-- ============================================================

create table investor_funds (
  id uuid primary key default gen_random_uuid(),
  organization_entity_id uuid not null references intel_entities(id) on delete cascade,
  fund_name text not null,
  vintage_year int,
  fund_size numeric,
  currency text not null default 'USD',
  status text not null default 'unknown' check (status in ('fundraising', 'investing', 'harvesting', 'closed', 'unknown')),
  sectors text[] not null default '{}',
  geographies text[] not null default '{}',
  check_min numeric,
  check_max numeric,
  last_verified_at timestamptz,
  confidence numeric check (confidence between 0 and 1),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger investor_funds_updated_at before update on investor_funds
  for each row execute function crm_set_updated_at();
create index investor_funds_org_idx on investor_funds(organization_entity_id);

-- Portfolio investments / transactions, the evidence base for "comparable
-- project and co-investor discovery" (spec: highest-priority discovery
-- signal after mandate queries). portfolio_entity_id links to a resolved
-- intel_entities row when known; portfolio_company_name is the fallback
-- for a transaction discovered before its target is itself resolved.
create table investor_transactions (
  id uuid primary key default gen_random_uuid(),
  investor_entity_id uuid not null references intel_entities(id) on delete cascade,
  fund_id uuid references investor_funds(id) on delete set null,
  portfolio_entity_id uuid references intel_entities(id) on delete set null,
  portfolio_company_name text,
  transaction_type text not null default 'unknown' check (transaction_type in ('investment', 'co_investment', 'exit', 'follow_on', 'unknown')),
  transaction_date date,
  amount numeric,
  currency text not null default 'USD',
  role text,
  sectors text[] not null default '{}',
  geographies text[] not null default '{}',
  evidence_id uuid references intel_evidence(id) on delete set null,
  confidence numeric check (confidence between 0 and 1),
  created_at timestamptz not null default now()
);
create index investor_transactions_investor_idx on investor_transactions(investor_entity_id);
create index investor_transactions_portfolio_idx on investor_transactions(portfolio_entity_id);
create index investor_transactions_date_idx on investor_transactions(transaction_date);

-- ============================================================
-- 4. Project-side capital need ("mandate" in the spec's sense)
-- ============================================================

create table project_investment_mandates (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  project_id uuid references projects(id) on delete set null,
  sectors text[] not null default '{}',
  subsectors text[] not null default '{}',
  geographies text[] not null default '{}',
  project_stage text,
  capital_purpose text[] not null default '{}',
  capital_types text[] not null default '{}',
  target_raise_min numeric,
  target_raise_max numeric,
  preferred_check_min numeric,
  preferred_check_max numeric,
  currency text not null default 'USD',
  investment_structures text[] not null default '{}',
  revenue_models text[] not null default '{}',
  impact_themes text[] not null default '{}',
  regenerative_functions text[] not null default '{}',
  target_returns jsonb not null default '{}',
  time_horizon text,
  readiness jsonb not null default '{}',
  investor_requirements text[] not null default '{}',
  exclusions text[] not null default '{}',
  -- Capital-raising compliance flags. Intelligence infrastructure, not
  -- legal advice: these are explicit project-level controls a human/counsel
  -- must set, never inferred, and used only to gate a candidate out of
  -- approved_for_contact until complete (see app-level enforcement).
  offering_pathway text,
  jurisdictions text[] not null default '{}',
  general_solicitation_permitted boolean,
  accredited_investors_only boolean,
  legal_review_status text not null default 'not_reviewed' check (legal_review_status in ('not_reviewed', 'in_review', 'approved', 'restricted')),
  broker_dealer_required boolean,
  broker_dealer_involved boolean,
  communications_approved boolean not null default false,
  data_room_approved boolean not null default false,
  outreach_restrictions text,
  status text not null default 'draft' check (status in ('draft', 'active', 'paused', 'closed')),
  owner_id uuid references staff(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid references staff(id)
);
create trigger project_investment_mandates_updated_at before update on project_investment_mandates
  for each row execute function crm_set_updated_at();
create index project_investment_mandates_project_idx on project_investment_mandates(project_id);
create index project_investment_mandates_status_idx on project_investment_mandates(status);

-- ============================================================
-- 5. Matching (explainable, per-mandate, never a universal score)
-- ============================================================

create table investor_project_matches (
  id uuid primary key default gen_random_uuid(),
  mandate_id uuid not null references project_investment_mandates(id) on delete cascade,
  investor_entity_id uuid references intel_entities(id) on delete cascade,
  investor_organization_id uuid references organizations(id) on delete cascade,
  match_kind text not null check (match_kind in ('project_investor', 'accredited_individual')),
  total_score numeric not null,
  classification text not null check (classification in (
    'immediate_target', 'qualified_research_target', 'monitor_or_relationship_path',
    'archive_low_priority', 'hard_exclusion'
  )),
  component_scores jsonb not null default '{}',
  penalties jsonb not null default '{}',
  missing_evidence text[] not null default '{}',
  explanation text,
  scoring_version text not null,
  calculated_at timestamptz not null default now(),
  constraint investor_project_matches_one_subject check (
    (investor_entity_id is not null)::int + (investor_organization_id is not null)::int = 1
  )
);
create index investor_project_matches_mandate_idx on investor_project_matches(mandate_id);
create index investor_project_matches_entity_idx on investor_project_matches(investor_entity_id);
create index investor_project_matches_org_idx on investor_project_matches(investor_organization_id);
create index investor_project_matches_classification_idx on investor_project_matches(classification);
-- One live score per (mandate, investor) pair; recalculation replaces the
-- row rather than accumulating history, matching "last_calculated_date" in
-- the spec rather than a score time series.
create unique index investor_project_matches_mandate_entity_uidx on investor_project_matches(mandate_id, investor_entity_id) where investor_entity_id is not null;
create unique index investor_project_matches_mandate_org_uidx on investor_project_matches(mandate_id, investor_organization_id) where investor_organization_id is not null;

-- ============================================================
-- 6. Discovery: queries, raw results, jobs
-- ============================================================

create table investor_discovery_queries (
  id uuid primary key default gen_random_uuid(),
  mandate_id uuid references project_investment_mandates(id) on delete cascade,
  query_family text not null check (query_family in (
    'mandate', 'portfolio', 'transaction', 'fund_activity', 'personnel',
    'accredited_individual', 'comparable_project'
  )),
  query_text text not null,
  investor_universe text,
  provider_id text,
  status text not null default 'pending' check (status in ('pending', 'running', 'completed', 'failed', 'cancelled')),
  results_count int not null default 0,
  duplicate_count int not null default 0,
  records_created int not null default 0,
  records_rejected int not null default 0,
  error text,
  estimated_cost numeric,
  actual_cost numeric,
  created_by uuid references staff(id),
  created_at timestamptz not null default now(),
  started_at timestamptz,
  completed_at timestamptz
);
create index investor_discovery_queries_mandate_idx on investor_discovery_queries(mandate_id);
create index investor_discovery_queries_status_idx on investor_discovery_queries(status);

create table investor_discovery_results (
  id uuid primary key default gen_random_uuid(),
  query_id uuid not null references investor_discovery_queries(id) on delete cascade,
  result_type text not null default 'web_page' check (result_type in ('organization', 'person', 'web_page')),
  title text,
  url text,
  snippet text,
  provider_id text,
  raw_payload jsonb not null default '{}',
  status text not null default 'new' check (status in ('new', 'collected', 'rejected', 'duplicate')),
  intel_source_id uuid references intel_sources(id) on delete set null,
  created_at timestamptz not null default now()
);
create index investor_discovery_results_query_idx on investor_discovery_results(query_id);
create index investor_discovery_results_status_idx on investor_discovery_results(status);

create table investor_discovery_jobs (
  id uuid primary key default gen_random_uuid(),
  job_type text not null check (job_type in (
    'discover_organizations', 'discover_people', 'fetch_source', 'extract_investor_profile',
    'resolve_entity', 'calculate_project_match', 'discover_relationships', 'verify_contact',
    'monitor_investor', 'monitor_person_role', 'monitor_fund_activity', 'sync_to_crm'
  )),
  status text not null default 'queued' check (status in ('queued', 'running', 'succeeded', 'failed', 'cancelled')),
  priority smallint not null default 5,
  attempt_count int not null default 0,
  max_attempts int not null default 3,
  scheduled_at timestamptz not null default now(),
  started_at timestamptz,
  completed_at timestamptz,
  error_code text,
  error_message text,
  provider_id text,
  mandate_id uuid references project_investment_mandates(id) on delete set null,
  investor_entity_id uuid references intel_entities(id) on delete set null,
  source_id uuid references intel_sources(id) on delete set null,
  payload jsonb not null default '{}',
  created_by uuid references staff(id),
  created_at timestamptz not null default now()
);
create index investor_discovery_jobs_status_idx on investor_discovery_jobs(status);
create index investor_discovery_jobs_scheduled_idx on investor_discovery_jobs(scheduled_at) where status = 'queued';
create index investor_discovery_jobs_mandate_idx on investor_discovery_jobs(mandate_id);

-- Provider cost accounting, only ever populated when a paid provider
-- actually runs (Exa, third-party email verification, paid LLM
-- escalation); free/deterministic paths never write here.
create table investor_provider_costs (
  id uuid primary key default gen_random_uuid(),
  provider_id text not null,
  operation text not null,
  units numeric,
  estimated_cost numeric,
  actual_cost numeric,
  job_id uuid references investor_discovery_jobs(id) on delete set null,
  mandate_id uuid references project_investment_mandates(id) on delete set null,
  created_at timestamptz not null default now()
);
create index investor_provider_costs_provider_idx on investor_provider_costs(provider_id);

-- ============================================================
-- 7. Monitoring
-- ============================================================

create table investor_monitoring_rules (
  id uuid primary key default gen_random_uuid(),
  investor_entity_id uuid references intel_entities(id) on delete cascade,
  investor_organization_id uuid references organizations(id) on delete cascade,
  rule_type text not null check (rule_type in (
    'new_investment_criteria', 'new_fund_launch', 'new_fund_close', 'new_portfolio_investment',
    'new_geography', 'new_sector', 'changed_check_size', 'role_change', 'contact_left',
    'new_relevant_hire', 'new_comparable_transaction', 'new_conference_appearance',
    'new_investment_thesis', 'fund_no_longer_investing', 'source_removed'
  )),
  is_active boolean not null default true,
  frequency interval not null default '1 day',
  last_checked_at timestamptz,
  created_by uuid references staff(id),
  created_at timestamptz not null default now(),
  constraint investor_monitoring_rules_one_subject check (
    (investor_entity_id is not null)::int + (investor_organization_id is not null)::int = 1
  )
);
create index investor_monitoring_rules_entity_idx on investor_monitoring_rules(investor_entity_id);
create index investor_monitoring_rules_org_idx on investor_monitoring_rules(investor_organization_id);

create table investor_change_events (
  id uuid primary key default gen_random_uuid(),
  monitoring_rule_id uuid references investor_monitoring_rules(id) on delete set null,
  investor_entity_id uuid references intel_entities(id) on delete cascade,
  change_type text not null,
  previous_value text,
  new_value text,
  source_id uuid references intel_sources(id) on delete set null,
  document_id uuid references intel_documents(id) on delete set null,
  detected_at timestamptz not null default now(),
  confidence numeric check (confidence between 0 and 1),
  affected_match_ids uuid[] not null default '{}',
  requires_review boolean not null default true,
  review_status text not null default 'pending' check (review_status in ('pending', 'reviewed', 'dismissed'))
);
create index investor_change_events_entity_idx on investor_change_events(investor_entity_id);
create index investor_change_events_review_idx on investor_change_events(review_status);

-- ============================================================
-- 8. Review queues and suppression
-- ============================================================

create table investor_review_tasks (
  id uuid primary key default gen_random_uuid(),
  task_type text not null check (task_type in (
    'possible_duplicate', 'low_confidence_classification', 'conflicting_mandate_evidence',
    'potential_decision_maker', 'inferred_contact_information', 'stale_record',
    'linkedin_role_conflict', 'high_priority_investor', 'hard_exclusion',
    'crm_sync_approval', 'outreach_approval'
  )),
  subject_entity_id uuid references intel_entities(id) on delete cascade,
  subject_organization_id uuid references organizations(id) on delete cascade,
  match_id uuid references investor_project_matches(id) on delete set null,
  description text,
  status text not null default 'open' check (status in ('open', 'approved', 'rejected', 'edited', 'dismissed')),
  resolved_by uuid references staff(id),
  resolved_at timestamptz,
  created_at timestamptz not null default now()
);
create index investor_review_tasks_status_idx on investor_review_tasks(status);
create index investor_review_tasks_type_idx on investor_review_tasks(task_type);

create table investor_suppression_entries (
  id uuid primary key default gen_random_uuid(),
  subject_type text not null check (subject_type in ('person', 'organization', 'email', 'domain')),
  person_entity_id uuid references intel_entities(id) on delete cascade,
  organization_entity_id uuid references intel_entities(id) on delete cascade,
  email text,
  domain text,
  reason text,
  created_by uuid references staff(id),
  created_at timestamptz not null default now()
);
create index investor_suppression_entries_email_idx on investor_suppression_entries(email);
create index investor_suppression_entries_domain_idx on investor_suppression_entries(domain);

-- ============================================================
-- 9. RLS -- same is_intel_access() shape as every other intel_* table
-- ============================================================

alter table investor_organization_profiles enable row level security;
alter table investor_person_profiles enable row level security;
alter table investor_person_roles enable row level security;
alter table investor_contact_channels enable row level security;
alter table investor_funds enable row level security;
alter table investor_transactions enable row level security;
alter table project_investment_mandates enable row level security;
alter table investor_project_matches enable row level security;
alter table investor_discovery_queries enable row level security;
alter table investor_discovery_results enable row level security;
alter table investor_discovery_jobs enable row level security;
alter table investor_provider_costs enable row level security;
alter table investor_monitoring_rules enable row level security;
alter table investor_change_events enable row level security;
alter table investor_review_tasks enable row level security;
alter table investor_suppression_entries enable row level security;

create policy investor_organization_profiles_staff_all on investor_organization_profiles for all
  using (is_intel_access()) with check (is_intel_access());
create policy investor_person_profiles_staff_all on investor_person_profiles for all
  using (is_intel_access()) with check (is_intel_access());
create policy investor_person_roles_staff_all on investor_person_roles for all
  using (is_intel_access()) with check (is_intel_access());
create policy investor_contact_channels_staff_all on investor_contact_channels for all
  using (is_intel_access()) with check (is_intel_access());
create policy investor_funds_staff_all on investor_funds for all
  using (is_intel_access()) with check (is_intel_access());
create policy investor_transactions_staff_all on investor_transactions for all
  using (is_intel_access()) with check (is_intel_access());
create policy project_investment_mandates_staff_all on project_investment_mandates for all
  using (is_intel_access()) with check (is_intel_access());
create policy investor_project_matches_staff_all on investor_project_matches for all
  using (is_intel_access()) with check (is_intel_access());
create policy investor_discovery_queries_staff_all on investor_discovery_queries for all
  using (is_intel_access()) with check (is_intel_access());
create policy investor_discovery_results_staff_all on investor_discovery_results for all
  using (is_intel_access()) with check (is_intel_access());
create policy investor_discovery_jobs_staff_all on investor_discovery_jobs for all
  using (is_intel_access()) with check (is_intel_access());
create policy investor_provider_costs_staff_all on investor_provider_costs for all
  using (is_intel_access()) with check (is_intel_access());
create policy investor_monitoring_rules_staff_all on investor_monitoring_rules for all
  using (is_intel_access()) with check (is_intel_access());
create policy investor_change_events_staff_all on investor_change_events for all
  using (is_intel_access()) with check (is_intel_access());
create policy investor_review_tasks_staff_all on investor_review_tasks for all
  using (is_intel_access()) with check (is_intel_access());
create policy investor_suppression_entries_staff_all on investor_suppression_entries for all
  using (is_intel_access()) with check (is_intel_access());
