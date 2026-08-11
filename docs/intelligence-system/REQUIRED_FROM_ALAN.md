# Required From Alan

Running log of decisions, credentials, and access this build needs from Alan, added as each phase actually reaches the point of needing them (not requested speculatively ahead of time). Nothing below is blocking Phase 0–3b (audit, architecture, schema, agent registry, generic collector infrastructure, Priority-0 source registry), which are complete without any of it.

## Not yet requested — will be needed to go further

- **`INTEL_COLLECTOR_SECRET`**: needs to be set in Netlify's environment (any random value, e.g. `openssl rand -hex 32`) before the collector route can run in production. Not urgent until a scheduler exists to call it.
- **Confirm the P0 source registry priorities**: `docs/intelligence-system/SOURCE_REGISTRY.md` seeded 15 real, verified multilateral/DFI sources (World Bank, IDB, UNDP, UNGM, IFC, EBRD) without waiting for a manual list, per the 2026-08-11 continuation prompt's own instruction not to wait. The recommended next batch is the LATAM government/regulatory layer (Mexico/Brazil/Chile/Colombia energy ministries, regulators, PPP units) since it maps most directly to the existing Selected Mandates pipeline — flag if a different order is wanted before that batch runs.
- **Scheduler choice**: Supabase `pg_cron` + `pg_net` (now enabled, unused) calling `app/api/intel/collect` on a schedule, vs. a GitHub Actions cron workflow doing the same over HTTP. Both are free/open-source-compatible per the spec's own preference; leaning `pg_cron`+`pg_net` since it needs no new CI setup, but this is a small enough decision to just make once real sources exist, not worth a dedicated question now.
- **LLM API key** for extraction/summarization agents (which provider — Anthropic, OpenAI, etc. — and budget expectations). Not needed yet: no agent code exists, only the `intel_agents` registry (26 rows, all `status = 'planned'`, seeded verbatim from the spec's own section 64 agent roster).
- **WhatsApp delivery**: which API/provider (WhatsApp Business API via Meta directly, or a provider like Twilio) and the destination number(s) for the daily reports.
- **`app.regenera.bio` subdomain**: DNS access to point it at wherever the private dashboard ends up hosted (likely the same Netlify site as a new route, or a second Netlify site — architecture decision still open).

## Already resolved (context, not a pending ask)

- Supabase project, Resend domain, and CRM staff auth are all already set up and reused as-is by this system (see `EXISTING_SYSTEM_AUDIT.md`) — no new credentials needed for the schema work done in Phase 1–2.
- `cheerio` (open-source HTML parsing) added as the one new dependency for Phase 3a — no paid scraping/browser-automation service, matching the spec's free/open-source-first requirement (its section 7).
