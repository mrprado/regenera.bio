# Existing System Audit — Phase 0

Written before any Intelligence OS work begins, per the build spec's own Phase 0 → Phase 1 ordering. Purpose: establish exactly what already exists so later phases build on top of it instead of duplicating or colliding with it.

## 1. Application

- Next.js 14 App Router + TypeScript, deployed on Netlify (`@netlify/plugin-nextjs`, `netlify.toml` has no custom build steps beyond `npm run build`). No GitHub Actions configured (`.github/workflows/` does not exist) — there is no CI today, deploys are Netlify's own git-push trigger.
- Public site routes live under `app/`: `about`, `contact`, `field-notes`, `for-developers`, `for-investors`, `for-landowners`, `for-operators`, `how-we-work`, `philosophy`, `projects` (Selected Mandates), `sectors`, `services`, plus API routes under `app/api/` (`contact`, `intake`, `lead`) and the internal CRM under `app/crm/` + `app/auth/callback/`.
- Production dependencies (`package.json`): `@supabase/ssr`, `@supabase/supabase-js`, `next`, `react`, `react-dom`, `resend`. **No scraping, browser-automation, or agent-orchestration libraries are installed** — no Crawlee, Playwright, Puppeteer, Cheerio, LangChain, etc. Any collector/agent work starts from zero on the tooling side.
- `lib/` currently holds content/taxonomy modules (`practices.ts`, `sectors.ts`, `fieldNotesTaxonomy.ts`, `projects.ts`, `counterparties.ts`, `diagnostics.ts`, `leadOptions.ts`, `intakeFields.ts`, `notify.ts`) and `lib/crm/` (`ingest.ts`, `staff.ts`). No `lib/intelligence/` or similar exists yet.

## 2. Supabase project

- Project "Regenera.bio", ref `xbgrtjcslbnnvvhwqcye`, region `ca-central-1`, Postgres 17.6, status ACTIVE_HEALTHY, created 2026-08-06.
- **17 tables exist today**, all with RLS enabled:
  - Public-facing intake (anon insert-only): `contact_submissions` (5 rows), `subscribers` (1 row), `lead_intake` (1 row), `segmented_intake` (5 rows).
  - CRM Phase 1 core (staff-only, 0 rows except `staff` with 1 row): `staff`, `organizations`, `contacts`, `projects`, `opportunities`, `project_dependencies`, `regenerative_function_records`, `capital_mandates`, `partners`, `introductions`, `activities`, `tasks`, `notes`.
- RLS pattern: staff-gated tables use `is_active_staff()` / `is_active_admin()` `SECURITY DEFINER` helper functions (see `docs/crm/SECURITY_MODEL.md`) — **any new staff-gated table added for the Intelligence OS must follow this same pattern**, never an inline `EXISTS (SELECT ... FROM staff ...)` policy on the table itself, which causes infinite-recursion errors (this was a real bug hit and fixed this project).
- **Edge Functions: none deployed.** `list_edge_functions` returns an empty array.
- **Extensions relevant to this build that are available but not yet installed**: `pg_cron` (job scheduling — needed for the 7am/7pm daily routines), `pg_net` (async HTTP from Postgres — useful for lightweight webhook/notification dispatch), `vector` (pgvector — needed for the knowledge graph / embeddings work), `wrappers` (Supabase FDW framework — could front external APIs as foreign tables), `http` (sync HTTP client extension). None of these cost anything extra on this plan tier and can be enabled via migration when the relevant phase starts.
- No existing cron jobs, webhooks, or scheduled functions of any kind on this project today.

## 3. Auth

- Supabase Auth, magic-link (OTP/PKCE) only, `shouldCreateUser: false` — no public self-registration. Custom SMTP via Resend, `regenera.bio` domain DNS-verified.
- Staff access is gated by a `staff` table row (`role`, `is_active`) checked through `lib/crm/staff.ts`. This is the only authorization system that exists; there is no separate concept of "internal app" roles/permissions beyond staff/admin today.
- Any new private dashboard (`app.regenera.bio`) can reuse this exact auth stack (same Supabase project, same magic-link flow, same `staff` table) rather than standing up a second auth system.

## 4. Docs already in the repo

`docs/crm/` (`CRM_ARCHITECTURE.md`, `DATA_MODEL.md`, `SECURITY_MODEL.md`) and `docs/commercial/` (`REGENERATIVE_CLAIMS_STANDARD.md`, `SPECIALIST_DELIVERY_MODEL.md`, `LEAD_SCHEMA.md`, `WEBSITE_CONVERSION_SYSTEM.md`, `CAMPAIGN_LANDING_PAGE_TEMPLATE.md`) document the commercial site and CRM Phase 1 build. `docs/intelligence-system/` did not exist before this file. `CLAUDE.md` at repo root is the running build log/context file for the whole project (46KB, actively maintained) — the Intelligence OS should get its own section there once real code lands, rather than duplicating this audit's content into it.

## 5. Env vars in use today

`.env.example` documents the current set: `RESEND_API_KEY`, `CONTACT_FROM_EMAIL`, `CONTACT_TO_EMAIL`, `BUTTONDOWN_API_KEY`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_SERVICE_ROLE_KEY`. No API keys for any external data source, LLM provider, or messaging API (WhatsApp, etc.) exist yet — every one of those will need to be requested from Alan and will be logged in `REQUIRED_FROM_ALAN.md` as they come up, rather than blocking on them one at a time.

## 6. What this means for phasing

- Nothing in the public site or CRM needs to change to start the Intelligence OS — it's additive. New tables should live in their own migration files (not touching the 17 existing ones) and follow the existing `is_active_staff()` RLS pattern.
- `pg_cron` + `pg_net`, once enabled, cover the daily 7am/7pm scheduling requirement natively inside Supabase without needing an external scheduler — worth defaulting to before reaching for GitHub Actions cron or a separate worker.
- The private dashboard can live at a new `app/` route group or a genuinely separate app under a new subdomain (`app.regenera.bio`) — this is an architecture decision for Phase 1, not answered by the audit itself.
- No collector/scraping infrastructure exists at all today — Phase 1+ work in that area starts from an empty `lib/` directory, not a refactor of something existing.
