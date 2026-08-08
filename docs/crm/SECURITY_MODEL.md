# Regenera CRM — Security Model

**Status: PROPOSAL, review before implementation.** This describes the
security posture Phase 1 must have before a single CRM table is created in
production. Nothing here is optional, this system holds real client, deal,
and investor data on the same Supabase project that also serves the public
site.

## The core rule

The CRM is never publicly accessible, in any form. No CRM table is ever
readable or writable by the `anon` role. This is stricter than the public
site's existing tables (`contact_submissions`, `subscribers`, `lead_intake`),
which intentionally allow anonymous *inserts* only, because a marketing form
has to accept unauthenticated submissions. No CRM table should even allow
that. Every CRM read and write requires an authenticated session belonging
to an active row in `staff`.

## Authentication

- Supabase Auth, email/password or magic link, no public sign-up form exists
  anywhere in the codebase or the Supabase dashboard's auth settings.
- New staff accounts are created by an existing admin only, either directly
  in the Supabase dashboard or through an internal admin-only action that
  itself requires an authenticated admin session. There is no self-service
  registration path, full stop.
- Every `auth.users` row that should have CRM access needs a matching row in
  `public.staff` with `is_active = true`. RLS policies check `staff`, not
  `auth.users` directly, so revoking access is one `UPDATE staff SET
  is_active = false` away, no need to touch the Auth account itself.
- Server-side route handlers under `/crm/*` verify the session on every
  request (via Supabase's server client reading the session cookie), not
  just in client-side page logic. A client-side-only check is not a security
  boundary, treat it as a UX nicety at most.

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

- The Supabase service role key is used server-side only, inside Next.js
  Route Handlers (`app/api/crm/...` or a dedicated ingestion function), never
  sent to the browser, never referenced in any client component.
- Its only Phase 1 job is promoting rows from the three public form tables
  into CRM records. That ingestion path is the single place service-role
  writes to CRM tables happen without an authenticated staff session in the
  loop, document that exception explicitly in the ingestion function's code
  comments so a future reviewer doesn't mistake it for a security hole.

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
