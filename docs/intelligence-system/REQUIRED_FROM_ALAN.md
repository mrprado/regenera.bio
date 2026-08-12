# Required From Alan

Running log of decisions, credentials, and access this build needs from Alan, added as each phase actually reaches the point of needing them (not requested speculatively ahead of time). Nothing below is blocking Phase 0–3d (audit, architecture, schema, agent registry, generic collector infrastructure, a 94-source registry across every category the source-seed prompt named), which are complete without any of it.

## Not yet requested — will be needed to go further

- **`INTEL_COLLECTOR_SECRET`**: needs to be set in Netlify's environment (any random value, e.g. `openssl rand -hex 32`) before the collector route can run in production. Not urgent until a scheduler exists to call it.
- **Which remaining gaps actually matter**: `docs/intelligence-system/SOURCE_REGISTRY.md` has 94 real, verified sources across every category the 2026-08-11 prompt named (multilaterals, LATAM/Africa/India/GCC governments, mining exchanges, global asset managers/private banks/family offices), seeded without waiting for a manual list. What's still open (more LATAM/Africa/GCC/Asia countries, the ~20 named project-finance banks, ~13 named private banks beyond UBS/JPM) is a long tail, not a short blocker — worth a steer on which of those actually matter to Regenera's real pipeline before spending more research time on names picked from the prompt rather than from an active deal.
- **The SEC EDGAR User-Agent fix**: `lib/intelligence/collect.ts`'s generic User-Agent gets blocked by SEC's EDGAR API, which requires a real contact-identifying UA string. Trivial one-line fix, just needs a real contact email/name to put in it (not urgent, no source is being collected on a schedule yet).
- ~~GitHub repo secrets for the extraction workflow~~ — **done 2026-08-11**. Both secrets set, workflow debugged through 3 real bugs across 5 manual runs (path alias, Node version, malformed LLM output), run 5 succeeded end to end with a real Ollama-escalated write to Supabase. Daily schedule (`cron: "0 6 * * *"`) now enabled.
- **3 new GitHub repo secrets for the email digest**: `.github/workflows/intel-digest.yml` needs `RESEND_API_KEY`, `CONTACT_FROM_EMAIL`, and `CONTACT_TO_EMAIL` added under Settings → Secrets and variables → Actions. These are the same values already configured in Netlify for the site's contact-form emails (you already have them, e.g. `RESEND_API_KEY` starts `re_...`) — GitHub Actions just doesn't share Netlify's environment, so they need to be re-entered as separate GitHub secrets, same situation as `SUPABASE_SERVICE_ROLE_KEY` earlier. Once set, trigger a manual run (`workflow_dispatch`) and confirm a real email actually arrives before trusting the 06:30 UTC daily schedule.
- **Ollama, if you want local testing before relying on the CI path**: install it (https://ollama.com) and run `ollama serve` + `ollama pull llama3.2` locally, then set `OLLAMA_HOST`/`OLLAMA_MODEL` if you want to test `lib/intelligence/extract/llm/ollama.ts` outside of GitHub Actions. Not required — the GitHub Actions path is the intended production route and doesn't need this.
- **Anthropic/OpenAI keys remain fully optional** per your explicit instruction — the extraction pipeline works without either, escalating to Ollama (free) only when deterministic extraction's confidence is too low. Only provide one of these if you want higher-quality LLM escalation than a small local model gives.
- **Scheduler choice**: Supabase `pg_cron` + `pg_net` (now enabled, unused) calling `app/api/intel/collect` on a schedule, vs. a GitHub Actions cron workflow doing the same over HTTP. Both are free/open-source-compatible per the spec's own preference; leaning `pg_cron`+`pg_net` since it needs no new CI setup, but this is a small enough decision to just make once real sources exist, not worth a dedicated question now.
- **LLM API key** for extraction/summarization agents (which provider — Anthropic, OpenAI, etc. — and budget expectations). Not needed yet: no agent code exists, only the `intel_agents` registry (26 rows, all `status = 'planned'`, seeded verbatim from the spec's own section 64 agent roster).
- **WhatsApp delivery**: which API/provider (WhatsApp Business API via Meta directly, or a provider like Twilio) and the destination number(s) for the daily reports.
- **`app.regenera.bio` subdomain**: DNS access to point it at wherever the private dashboard ends up hosted (likely the same Netlify site as a new route, or a second Netlify site — architecture decision still open).

## Investor Intelligence module (added 2026-08-12, see INVESTOR_INTELLIGENCE.md)

- ~~`has_intel_access` grant for your own staff row~~ -- **done 2026-08-12**. `alanprado@regenera.bio` now has `has_intel_access = true`; `/crm/intelligence/investors` is reachable on the next sign-in.
- **Agent Reach / LinkedIn decision**: not installed, and this build deliberately does not
  install it or write real LinkedIn call logic for you -- both because it's a system-level
  install decision and because LinkedIn scraping carries real ToS/legal exposure for a
  live business. If you want the LinkedIn contact-intelligence half of this module
  working, that's a real conversation (what's the actual legal posture you're comfortable
  with), not a config value. Exa (semantic web search) is lower-risk and could be wired
  first if useful.
- **No scheduled discovery/monitoring runner yet**: today, discovery is 100% staff-
  triggered from the UI (paste a URL, review, confirm). Worth revisiting once there's
  real usage to justify a GitHub Actions cron workflow like the existing
  `intel-collect.yml`.
- **`JINA_API_KEY`, fully optional**: only worth getting if the free public rate limit on
  Jina Reader turns out to be a real bottleneck once you're using the module regularly.

## Already resolved (context, not a pending ask)

- Supabase project, Resend domain, and CRM staff auth are all already set up and reused as-is by this system (see `EXISTING_SYSTEM_AUDIT.md`) — no new credentials needed for the schema work done in Phase 1–2.
- `cheerio` (open-source HTML parsing) added as the one new dependency for Phase 3a — no paid scraping/browser-automation service, matching the spec's free/open-source-first requirement (its section 7).
