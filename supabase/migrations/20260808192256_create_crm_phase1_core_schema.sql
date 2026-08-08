-- Regenera internal CRM, Phase 1 core schema.
-- Private, staff-only. See docs/crm/CRM_ARCHITECTURE.md, DATA_MODEL.md, SECURITY_MODEL.md.
-- No table here is ever readable or writable by the anon role.

-- Keep updated_at current automatically.
create or replace function crm_set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ============================================================
-- staff: the CRM's own allowlist, distinct from auth.users so
-- access can be revoked without touching the Auth account.
-- ============================================================
create table staff (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  email text unique,
  role text not null default 'staff' check (role in ('admin','staff')),
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

alter table staff enable row level security;

-- Staff can see the staff list (needed for owner pickers etc), only an
-- admin can modify it. No public access at all.
create policy staff_select on staff for select
  using (exists (select 1 from staff s where s.id = auth.uid() and s.is_active));
create policy staff_admin_write on staff for insert
  with check (exists (select 1 from staff s where s.id = auth.uid() and s.is_active and s.role = 'admin'));
create policy staff_admin_update on staff for update
  using (exists (select 1 from staff s where s.id = auth.uid() and s.is_active and s.role = 'admin'));

-- Shared baseline policy helper, expressed inline per table below rather
-- than as a function, so each policy stays self-contained and easy to audit.

-- ============================================================
-- organizations
-- ============================================================
create table organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  legal_name text,
  website text,
  organization_type text check (organization_type in (
    'prospect','client','developer','sponsor','investor','family_office','fund',
    'landowner','operator','epc','engineer','architect','legal','technology_provider',
    'government','development_institution','research_institution','partner','other'
  )),
  headquarters text,
  geographies text[],
  sectors text[],
  description text,
  relationship_status text,
  relationship_strength smallint check (relationship_strength between 1 and 5),
  owner_id uuid references staff(id),
  source text,
  tags text[],
  last_activity_at timestamptz,
  next_action_at timestamptz,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid references staff(id),
  archived_at timestamptz
);
create trigger organizations_updated_at before update on organizations
  for each row execute function crm_set_updated_at();
alter table organizations enable row level security;
create policy organizations_staff_all on organizations for all
  using (exists (select 1 from staff s where s.id = auth.uid() and s.is_active))
  with check (exists (select 1 from staff s where s.id = auth.uid() and s.is_active));

-- ============================================================
-- contacts (people)
-- ============================================================
create table contacts (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references organizations(id) on delete set null,
  first_name text,
  last_name text,
  title text,
  email text,
  phone text,
  whatsapp text,
  linkedin_url text,
  geography text,
  relationship_type text,
  relationship_strength smallint check (relationship_strength between 1 and 5),
  preferred_channel text,
  consent_marketing boolean not null default false,
  source text,
  last_contact_at timestamptz,
  next_contact_at timestamptz,
  owner_id uuid references staff(id),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid references staff(id),
  archived_at timestamptz
);
create trigger contacts_updated_at before update on contacts
  for each row execute function crm_set_updated_at();
alter table contacts enable row level security;
create policy contacts_staff_all on contacts for all
  using (exists (select 1 from staff s where s.id = auth.uid() and s.is_active))
  with check (exists (select 1 from staff s where s.id = auth.uid() and s.is_active));

-- ============================================================
-- projects (defined before opportunities, which reference it)
-- ============================================================
create table projects (
  id uuid primary key default gen_random_uuid(),
  project_name text not null,
  organization_id uuid references organizations(id) on delete set null,
  primary_contact_id uuid references contacts(id) on delete set null,
  sector text,
  secondary_sectors text[],
  location text,
  country text,
  region text,
  latitude numeric,
  longitude numeric,
  stage text,
  asset_type text,
  estimated_value numeric,
  capital_requirement numeric,
  land_status text,
  permitting_status text,
  technical_status text,
  offtake_status text,
  financing_status text,
  regenera_role text,
  specialist_roles text[],
  current_constraint text,
  risk_status text,
  readiness_status text,
  regenerative_status text not null default 'not_claimed'
    check (regenerative_status in ('not_claimed','under_assessment','assessed_see_regenerative_function_records')),
  summary text,
  next_milestone text,
  next_milestone_date date,
  owner_id uuid references staff(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid references staff(id),
  archived_at timestamptz
);
create trigger projects_updated_at before update on projects
  for each row execute function crm_set_updated_at();
alter table projects enable row level security;
create policy projects_staff_all on projects for all
  using (exists (select 1 from staff s where s.id = auth.uid() and s.is_active))
  with check (exists (select 1 from staff s where s.id = auth.uid() and s.is_active));

-- ============================================================
-- opportunities
-- ============================================================
create table opportunities (
  id uuid primary key default gen_random_uuid(),
  opportunity_name text not null,
  organization_id uuid references organizations(id) on delete set null,
  primary_contact_id uuid references contacts(id) on delete set null,
  project_id uuid references projects(id) on delete set null,
  service text,
  engagement_type text,
  sector text,
  geography text,
  stage text not null default 'target' check (stage in (
    'target','contacted','engaged','discovery','qualified','diagnostic_proposed',
    'diagnostic_active','advisory_proposed','active_client','expansion','nurture',
    'closed_won','closed_lost'
  )),
  estimated_value numeric,
  probability smallint check (probability between 0 and 100),
  currency text not null default 'USD',
  target_close_date date,
  source text,
  campaign_id text,
  need_score smallint check (need_score between 1 and 5),
  authority_score smallint check (authority_score between 1 and 5),
  readiness_score smallint check (readiness_score between 1 and 5),
  economic_capacity_score smallint check (economic_capacity_score between 1 and 5),
  timing_score smallint check (timing_score between 1 and 5),
  regenera_fit_score smallint check (regenera_fit_score between 1 and 5),
  expansion_score smallint check (expansion_score between 1 and 5),
  strategic_value_score smallint check (strategic_value_score between 1 and 5),
  qualification_class text check (qualification_class in ('priority_a','priority_b','priority_c_diagnostic','refer_decline')),
  next_action text,
  next_action_date date,
  last_activity_at timestamptz,
  loss_reason text,
  owner_id uuid references staff(id),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid references staff(id),
  archived_at timestamptz
);
create trigger opportunities_updated_at before update on opportunities
  for each row execute function crm_set_updated_at();
alter table opportunities enable row level security;
create policy opportunities_staff_all on opportunities for all
  using (exists (select 1 from staff s where s.id = auth.uid() and s.is_active))
  with check (exists (select 1 from staff s where s.id = auth.uid() and s.is_active));

-- ============================================================
-- project_dependencies
-- ============================================================
create table project_dependencies (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects(id) on delete cascade,
  dependency_type text check (dependency_type in (
    'land','water','energy','materials','critical_minerals','feedstock','agriculture',
    'logistics','roads','ports','grid','telecom','data','environmental','community',
    'governance','permitting','offtake','capital','specialist_capability','orbital_earth_observation'
  )),
  description text,
  severity text,
  status text,
  current_capacity text,
  required_capacity text,
  constraint_detail text,
  feedback_effect text,
  mitigation text,
  owner_id uuid references staff(id),
  monitoring_indicator text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid references staff(id)
);
create trigger project_dependencies_updated_at before update on project_dependencies
  for each row execute function crm_set_updated_at();
alter table project_dependencies enable row level security;
create policy project_dependencies_staff_all on project_dependencies for all
  using (exists (select 1 from staff s where s.id = auth.uid() and s.is_active))
  with check (exists (select 1 from staff s where s.id = auth.uid() and s.is_active));

-- ============================================================
-- regenerative_function_records
-- ============================================================
create table regenerative_function_records (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects(id) on delete cascade,
  function_strengthened text not null,
  baseline text not null,
  mechanism text not null,
  evidence_type text,
  evidence text,
  metric text,
  current_value text,
  target_value text,
  durability text,
  dependencies text,
  tradeoffs text,
  beneficiaries text,
  costs_borne_by text,
  monitoring_requirement text,
  verification_status text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid references staff(id)
);
create trigger regenerative_function_records_updated_at before update on regenerative_function_records
  for each row execute function crm_set_updated_at();
alter table regenerative_function_records enable row level security;
create policy regenerative_function_records_staff_all on regenerative_function_records for all
  using (exists (select 1 from staff s where s.id = auth.uid() and s.is_active))
  with check (exists (select 1 from staff s where s.id = auth.uid() and s.is_active));

-- ============================================================
-- capital_mandates
-- ============================================================
create table capital_mandates (
  id uuid primary key default gen_random_uuid(),
  investor_organization_id uuid references organizations(id) on delete set null,
  contact_id uuid references contacts(id) on delete set null,
  investor_type text,
  ticket_min numeric,
  ticket_max numeric,
  currencies text[],
  sectors text[],
  geographies text[],
  stage_preferences text[],
  debt_equity_preference text,
  structure_preferences text,
  risk_profile text,
  return_profile text,
  exclusions text,
  development_appetite text,
  natural_capital_interest text,
  current_appetite text,
  summary text,
  last_validated_at date,
  next_followup_at date,
  relationship_strength smallint check (relationship_strength between 1 and 5),
  owner_id uuid references staff(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid references staff(id),
  archived_at timestamptz
);
create trigger capital_mandates_updated_at before update on capital_mandates
  for each row execute function crm_set_updated_at();
alter table capital_mandates enable row level security;
create policy capital_mandates_staff_all on capital_mandates for all
  using (exists (select 1 from staff s where s.id = auth.uid() and s.is_active))
  with check (exists (select 1 from staff s where s.id = auth.uid() and s.is_active));

-- ============================================================
-- partners
-- ============================================================
create table partners (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references organizations(id) on delete set null,
  capabilities text[],
  sectors text[],
  geographies text[],
  typical_project_size text,
  relationship_type text,
  commercial_model text,
  agreement_status text,
  quality_rating smallint check (quality_rating between 1 and 5),
  preferred_status boolean not null default false,
  last_contact_at timestamptz,
  next_contact_at timestamptz,
  owner_id uuid references staff(id),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid references staff(id),
  archived_at timestamptz
);
create trigger partners_updated_at before update on partners
  for each row execute function crm_set_updated_at();
alter table partners enable row level security;
create policy partners_staff_all on partners for all
  using (exists (select 1 from staff s where s.id = auth.uid() and s.is_active))
  with check (exists (select 1 from staff s where s.id = auth.uid() and s.is_active));

-- ============================================================
-- introductions
-- ============================================================
create table introductions (
  id uuid primary key default gen_random_uuid(),
  opportunity_id uuid references opportunities(id) on delete set null,
  project_id uuid references projects(id) on delete set null,
  introducing_staff_id uuid references staff(id),
  from_contact_id uuid references contacts(id) on delete set null,
  to_contact_id uuid references contacts(id) on delete set null,
  intro_date date not null default current_date,
  purpose text,
  commercial_agreement text,
  fee_basis text,
  nda_status text,
  materials_shared text,
  meeting_status text,
  diligence_status text,
  outcome text,
  next_action text,
  next_action_date date,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger introductions_updated_at before update on introductions
  for each row execute function crm_set_updated_at();
alter table introductions enable row level security;
create policy introductions_staff_all on introductions for all
  using (exists (select 1 from staff s where s.id = auth.uid() and s.is_active))
  with check (exists (select 1 from staff s where s.id = auth.uid() and s.is_active));

-- ============================================================
-- activities (append-only)
-- ============================================================
create table activities (
  id uuid primary key default gen_random_uuid(),
  activity_type text not null check (activity_type in (
    'email','call','whatsapp','meeting','video_call','linkedin','introduction',
    'proposal','document_shared','note','site_visit','follow_up'
  )),
  occurred_at timestamptz not null default now(),
  organization_id uuid references organizations(id) on delete set null,
  contact_id uuid references contacts(id) on delete set null,
  opportunity_id uuid references opportunities(id) on delete set null,
  project_id uuid references projects(id) on delete set null,
  summary text,
  outcome text,
  next_action text,
  next_action_date date,
  created_by uuid references staff(id) not null,
  created_at timestamptz not null default now()
);
alter table activities enable row level security;
create policy activities_staff_all on activities for all
  using (exists (select 1 from staff s where s.id = auth.uid() and s.is_active))
  with check (exists (select 1 from staff s where s.id = auth.uid() and s.is_active));

-- ============================================================
-- tasks
-- ============================================================
create table tasks (
  id uuid primary key default gen_random_uuid(),
  task text not null,
  due_date date,
  priority text,
  status text not null default 'open' check (status in ('open','in_progress','waiting','completed','cancelled')),
  owner_id uuid references staff(id),
  contact_id uuid references contacts(id) on delete set null,
  organization_id uuid references organizations(id) on delete set null,
  opportunity_id uuid references opportunities(id) on delete set null,
  project_id uuid references projects(id) on delete set null,
  task_type text,
  recurrence text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid references staff(id)
);
create trigger tasks_updated_at before update on tasks
  for each row execute function crm_set_updated_at();
alter table tasks enable row level security;
create policy tasks_staff_all on tasks for all
  using (exists (select 1 from staff s where s.id = auth.uid() and s.is_active))
  with check (exists (select 1 from staff s where s.id = auth.uid() and s.is_active));

-- ============================================================
-- notes (quick capture)
-- ============================================================
create table notes (
  id uuid primary key default gen_random_uuid(),
  raw_text text not null,
  created_by uuid references staff(id) not null,
  created_at timestamptz not null default now(),
  ai_suggested_updates jsonb,
  ai_status text not null default 'pending' check (ai_status in ('pending','accepted','edited','dismissed')),
  linked_organization_id uuid references organizations(id) on delete set null,
  linked_contact_id uuid references contacts(id) on delete set null,
  linked_opportunity_id uuid references opportunities(id) on delete set null,
  linked_project_id uuid references projects(id) on delete set null
);
alter table notes enable row level security;
create policy notes_staff_all on notes for all
  using (exists (select 1 from staff s where s.id = auth.uid() and s.is_active))
  with check (exists (select 1 from staff s where s.id = auth.uid() and s.is_active));

-- ============================================================
-- Helpful indexes for the lookups the CRM will do constantly.
-- ============================================================
create index idx_contacts_organization on contacts(organization_id);
create index idx_opportunities_organization on opportunities(organization_id);
create index idx_opportunities_stage on opportunities(stage);
create index idx_projects_organization on projects(organization_id);
create index idx_project_dependencies_project on project_dependencies(project_id);
create index idx_regenerative_function_records_project on regenerative_function_records(project_id);
create index idx_activities_organization on activities(organization_id);
create index idx_activities_opportunity on activities(opportunity_id);
create index idx_tasks_owner_status on tasks(owner_id, status);
create index idx_tasks_due_date on tasks(due_date) where status not in ('completed','cancelled');
