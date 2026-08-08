-- Segmented intake from the four counterparty pages (/for-developers,
-- /for-investors, /for-landowners, /for-operators). Same pattern as
-- contact_submissions/lead_intake: anon insert-only, no select, so the
-- publishable key in the browser bundle can never read data back.
create table segmented_intake (
  id uuid primary key default gen_random_uuid(),
  intake_type text not null check (intake_type in ('developer','investor','landowner','operator')),
  name text not null,
  email text not null,
  org text,
  phone text,
  fields jsonb not null default '{}'::jsonb,
  message text,
  consent boolean not null,
  page_path text,
  referrer text,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  created_at timestamptz not null default now()
);

alter table segmented_intake enable row level security;

create policy segmented_intake_anon_insert on segmented_intake for insert
  to anon, authenticated
  with check (true);

create policy segmented_intake_staff_select on segmented_intake for select
  using (exists (select 1 from staff s where s.id = auth.uid() and s.is_active));
