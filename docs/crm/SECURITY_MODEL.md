# Regenera CRM — Security Model

**Status: IMPLEMENTED for schema, RLS, and auth (2026-08-08).** The Phase 1
schema, RLS policies, and the `/crm` auth gate described below are live in
production. What remains is documented in "What 'done' looks like" at the
end of this file: the first `staff` row (needs a real Supabase Auth account
to link to), and independent verification that RLS actually blocks
unauthenticated access.

## The core rule

The CRM is never publicly accessible, in any form. No CRM table is ever
readable or writable by the `anon` role. This is stricter than the public
site's existing tables (`contact_submissions`, `subscribers`, `lead_intake`),
which intentionally allow anonymous *inserts* only, because a marketing form
has to accept unauthenticated submissions. No CRM table should even allow
that. Every CRM read and write requires an authenticated session belonging
to an active row in `staff`.

## Authentication

- Supabase Auth magic link (`signInWithOtp`), implemented at
  `app/crm/login/page.tsx`, exchanged for a session at `app/auth/callback/
  route.ts`. Called with `shouldCreateUser: false`, so requesting a sign-in
  link never creates a new Supabase Auth account, only an email that already
  has one can receive a link. No public sign-up form exists anywhere in the
  codebase or the Supabase dashboard's auth settings.
- New staff accounts are created by an existing admin only, directly in the
  Supabase dashboard (Authentication → Users → Add user), since Phase 1 has
  no in-app admin action for this yet. There is no self-service registration
  path, full stop.
- Every `auth.users` row that should have CRM access needs a matching row in
  `public.staff` with `is_active = true`. RLS policies check `staff`, not
  `auth.users` directly, so revoking access is one `UPDATE staff SET
  is_active = false` away, no need to touch the Auth account itself.
- `app/crm/page.tsx` calls `getCurrentStaff()` (`lib/crm/staff.ts`) on every
  request, server-side, and redirects to `/crm/login` if there's no session
  or no matching active `staff` row. This UI-level check is a courtesy, not
  the actual security boundary, RLS is (see below); it exists so an
  unauthorized visitor sees a login page instead of an empty/erroring
  dashboard.

## Row Level Security

- RLS is enabled on every CRM table, no exceptions, before it is ever
  populated with real data.
- The baseline policy on every CRM table: `USING (EXISTS (SELECT 1 FROM
  staff WHERE staff.id = auth.uid() AND staff.is_active))`. Refine per-table
  only if a genuine need for row-level restriction emerges (e.g. a future
  "only the owner or an admin can see this mandate" rule), don't add
  complexity the business doesn't need yet.
- Do not rely on hiding `/crm` from navigation as a security measure. RLS is
  the boundary. The UI hiding is a courtesy, not a control.

## Service role usage

- The Supabase service role key (`SUPABASE_SERVICE_ROLE_KEY`, server-side
  only, never `NEXT_PUBLIC_`) is read only by `lib/supabase/admin.ts`, never
  referenced in any client component.
- Its only Phase 1 job is `lib/crm/ingest.ts`, called from `app/api/contact/
  route.ts` and `app/api/lead/route.ts` after the public table insert
  succeeds, to create/update the corresponding `organizations` /
  `contacts` / `opportunities` / `activities` rows. That ingestion path is
  the single place service-role writes to CRM tables happen without an
  authenticated staff session in the loop, this is documented in the file's
  own comments so a future reviewer doesn't mistake it for a security hole.
  `subscribe`/newsletter submissions are not ingested, a bare email signup
  isn't a sales lead.
- Ingestion failures are caught and logged, never surfaced to the visitor
  and never allowed to fail the underlying public form submission, matching
  the existing best-effort pattern used for the Resend/Buttondown calls in
  those same route handlers.

## Separation from the public site

- The public site's three existing tables keep their current RLS exactly as
  is (anon insert-only, no select). This CRM work does not touch them beyond
  the read-only ingestion function described above.
- CRM tables and public tables are logically separate even though they share
  a Postgres instance, no CRM table has a foreign key into
  `contact_submissions`/`subscribers`/`lead_intake` directly, the ingestion
  function copies relevant fields across instead, so the public form tables
  remain the untouched, permanent record of what was actually submitted.

## Storage

- Any document storage (NDAs, decks, financial models, meeting notes)
  described in the wider CRM plan uses private Supabase Storage buckets with
  Storage RLS policies mirroring the table-level policy above, signed URLs
  for access, never a public bucket. Not building this in Phase 1, noting the
  requirement now so it isn't retrofitted carelessly when it is built.

## Audit and deletion

- `created_at`, `updated_at`, `created_by`, `owner_id` on every substantive
  table.
- Soft delete via `archived_at` for `organizations`, `contacts`,
  `opportunities`, `projects`, `capital_mandates`, `partners`. Hard deletion
  of these should not be exposed anywhere in the application layer, if it's
  ever genuinely needed it happens directly in the database by an admin, not
  through a CRM UI action.
- `activities` and `notes` are append-only logs, no update or delete path in
  the application layer at all.

## Secrets

- `ANTHROPIC_API_KEY` (Phase 4) and any Gmail OAuth client secret or WhatsApp
  Business API token (Phase 3) are server-side environment variables only,
  documented in `.env.example` with no real values committed, exactly the
  existing pattern already used for `RESEND_API_KEY` and
  `BUTTONDOWN_API_KEY`.
- Scheduled jobs (Phase 2/3) that need secrets use Supabase's own secrets
  management for Edge Functions, not values baked into migration files or
  checked into the repository.

## What "done" looks like for this document

This file stops being a proposal once: RLS has actually been verified (not
assumed) to block an unauthenticated request against every CRM table, a test
account with `is_active = false` in `staff` has been confirmed to lose
access, and the service-role ingestion path has been confirmed to be the
only write path that doesn't require an authenticated staff session. None of
that has happened yet, this document describes the target, not the current
state.
