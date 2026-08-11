# Required From Alan

Running log of decisions, credentials, and access this build needs from Alan, added as each phase actually reaches the point of needing them (not requested speculatively ahead of time). Nothing below is blocking Phase 0–2 (audit, architecture, schema), which are complete without any of it.

## Not yet requested — will be needed for Phase 3+ (collectors)

- **LLM API key** for extraction/summarization agents (which provider — Anthropic, OpenAI, etc. — and budget expectations).
- **Specific sources to prioritize first**: which regulators, news feeds, or portals actually matter most for the mining/capital/family-office intelligence work, so the first real `intel_sources` rows are real, not placeholder guesses. Building a generic scraper against an arbitrary source is wasted work; the source list should come from what's actually useful to Regenera's pipeline.
- **WhatsApp delivery**: which API/provider (WhatsApp Business API via Meta directly, or a provider like Twilio) and the destination number(s) for the daily reports.
- **`app.regenera.bio` subdomain**: DNS access to point it at wherever the private dashboard ends up hosted (likely the same Netlify site as a new route, or a second Netlify site — architecture decision still open).

## Already resolved (context, not a pending ask)

- Supabase project, Resend domain, and CRM staff auth are all already set up and reused as-is by this system (see `EXISTING_SYSTEM_AUDIT.md`) — no new credentials needed for the schema work done in Phase 1–2.
