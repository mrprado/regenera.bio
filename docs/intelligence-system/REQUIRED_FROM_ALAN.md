# Required From Alan

Running log of decisions, credentials, and access this build needs from Alan, added as each phase actually reaches the point of needing them (not requested speculatively ahead of time). Nothing below is blocking Phase 0–3a (audit, architecture, schema, agent registry, generic collector infrastructure), which are complete without any of it.

## Not yet requested — will be needed to go further

- **Specific sources to prioritize first**: which regulators, news feeds, or portals actually matter most for the mining/capital/family-office intelligence work, so the first real `intel_sources` rows are real, not placeholder guesses. The generic collector (`lib/intelligence/collect.ts`, `app/api/intel/collect`) is built and proven end-to-end against a throwaway test URL, but deliberately has zero real source rows yet — building against an arbitrary source would be wasted work; the source list should come from what's actually useful to Regenera's pipeline. **This is the main thing blocking real progress now.**
- **`INTEL_COLLECTOR_SECRET`**: needs to be set in Netlify's environment (any random value, e.g. `openssl rand -hex 32`) before the collector route can run in production. Not urgent until there's a real source and a scheduler calling it.
- **Scheduler choice**: Supabase `pg_cron` + `pg_net` (now enabled, unused) calling `app/api/intel/collect` on a schedule, vs. a GitHub Actions cron workflow doing the same over HTTP. Both are free/open-source-compatible per the spec's own preference; leaning `pg_cron`+`pg_net` since it needs no new CI setup, but this is a small enough decision to just make once real sources exist, not worth a dedicated question now.
- **LLM API key** for extraction/summarization agents (which provider — Anthropic, OpenAI, etc. — and budget expectations). Not needed yet: no agent code exists, only the `intel_agents` registry (26 rows, all `status = 'planned'`, seeded verbatim from the spec's own section 64 agent roster).
- **WhatsApp delivery**: which API/provider (WhatsApp Business API via Meta directly, or a provider like Twilio) and the destination number(s) for the daily reports.
- **`app.regenera.bio` subdomain**: DNS access to point it at wherever the private dashboard ends up hosted (likely the same Netlify site as a new route, or a second Netlify site — architecture decision still open).

## Already resolved (context, not a pending ask)

- Supabase project, Resend domain, and CRM staff auth are all already set up and reused as-is by this system (see `EXISTING_SYSTEM_AUDIT.md`) — no new credentials needed for the schema work done in Phase 1–2.
- `cheerio` (open-source HTML parsing) added as the one new dependency for Phase 3a — no paid scraping/browser-automation service, matching the spec's free/open-source-first requirement (its section 7).
