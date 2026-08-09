-- Every CRM table's RLS policy checks "is the current user an active staff
-- member" via EXISTS (SELECT 1 FROM staff WHERE staff.id = auth.uid() AND
-- staff.is_active). For the staff table's OWN policies, this means a policy
-- ON staff queries staff again from inside itself, which Postgres correctly
-- detects as infinite recursion and rejects with "infinite recursion
-- detected in policy for relation staff". Every other table's policy also
-- queries staff, so evaluating THEIR policy requires evaluating staff's own
-- (broken) policy too, breaking every CRM table's access, not just staff.
--
-- Fix: SECURITY DEFINER helper functions bypass RLS on their own internal
-- query, so checking staff membership no longer re-triggers staff's policy.
-- This is the standard pattern for a self-referential roles/staff table.

create or replace function is_active_staff()
returns boolean
language sql
security definer
set search_path = ''
stable
as $$
  select exists (
    select 1 from public.staff where id = auth.uid() and is_active
  );
$$;

create or replace function is_active_admin()
returns boolean
language sql
security definer
set search_path = ''
stable
as $$
  select exists (
    select 1 from public.staff where id = auth.uid() and is_active and role = 'admin'
  );
$$;

-- staff's own policies
drop policy if exists staff_select on staff;
create policy staff_select on staff for select
  using (is_active_staff());

drop policy if exists staff_admin_write on staff;
create policy staff_admin_write on staff for insert
  with check (is_active_admin());

drop policy if exists staff_admin_update on staff;
create policy staff_admin_update on staff for update
  using (is_active_admin());

-- every other CRM table's "_staff_all" policy
drop policy if exists organizations_staff_all on organizations;
create policy organizations_staff_all on organizations for all
  using (is_active_staff()) with check (is_active_staff());

drop policy if exists contacts_staff_all on contacts;
create policy contacts_staff_all on contacts for all
  using (is_active_staff()) with check (is_active_staff());

drop policy if exists opportunities_staff_all on opportunities;
create policy opportunities_staff_all on opportunities for all
  using (is_active_staff()) with check (is_active_staff());

drop policy if exists projects_staff_all on projects;
create policy projects_staff_all on projects for all
  using (is_active_staff()) with check (is_active_staff());

drop policy if exists project_dependencies_staff_all on project_dependencies;
create policy project_dependencies_staff_all on project_dependencies for all
  using (is_active_staff()) with check (is_active_staff());

drop policy if exists regenerative_function_records_staff_all on regenerative_function_records;
create policy regenerative_function_records_staff_all on regenerative_function_records for all
  using (is_active_staff()) with check (is_active_staff());

drop policy if exists capital_mandates_staff_all on capital_mandates;
create policy capital_mandates_staff_all on capital_mandates for all
  using (is_active_staff()) with check (is_active_staff());

drop policy if exists partners_staff_all on partners;
create policy partners_staff_all on partners for all
  using (is_active_staff()) with check (is_active_staff());

drop policy if exists introductions_staff_all on introductions;
create policy introductions_staff_all on introductions for all
  using (is_active_staff()) with check (is_active_staff());

drop policy if exists activities_staff_all on activities;
create policy activities_staff_all on activities for all
  using (is_active_staff()) with check (is_active_staff());

drop policy if exists tasks_staff_all on tasks;
create policy tasks_staff_all on tasks for all
  using (is_active_staff()) with check (is_active_staff());

drop policy if exists notes_staff_all on notes;
create policy notes_staff_all on notes for all
  using (is_active_staff()) with check (is_active_staff());

drop policy if exists segmented_intake_staff_select on segmented_intake;
create policy segmented_intake_staff_select on segmented_intake for select
  using (is_active_staff());
