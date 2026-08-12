# Investor Intelligence — a bounded domain inside the Intelligence OS

Status: Phase 1 (foundation) + a working slice of Phase 2 (public-web discovery) implemented
2026-08-12. Phases 3 (LinkedIn) and most of Phase 5/6 are scaffolded but intentionally
inert pending decisions only Alan can make — see "Known limitations" below.

## 1. What it does

Discovers, evidence-backs, and ranks potential capital sources (family offices, PE,
infrastructure funds, DFIs, foundations, accredited individuals, retail channels, etc.)
against a specific Regenera project's capital need, then lets a human review and promote
qualified candidates into the real CRM. Nothing is invented: every organization/person
record starts as a candidate with a `review_status` of `discovered` and a real captured
source, and every structured claim about it (sectors, check size, deployment status) can
be traced back to a specific `intel_documents` row through `intel_evidence`.

## 2. What it does not do

- Does not send outreach, connection requests, or messages of any kind, automatically.
- Does not verify accreditation. `accreditation_status` defaults to `unknown` and only a
  human (`accreditation_verified_by`) can move it.
- Does not scrape LinkedIn today. The connector exists as an interface with a live
  install-detection health check, but its actual calls are not wired to a confirmed
  Agent Reach schema (see section 6) and it throws rather than fabricating results.
- Does not replace the CRM. `organizations`/`contacts` (CRM Phase 1 schema) remain the
  only system of record for real relationships; this module's tables hold pre-promotion
  discovery data and are never queried by the public site or by CRM views directly.
- Does not run as a separate deployable worker process. See section 4.

## 3. Architecture and data flow

```
staff member (via /crm/intelligence/investors)
  -> creates a project_investment_mandates row (what a project needs)
  -> generateAndStoreQueries() -> lib/intelligence/investors/queryGenerator.ts
       (pure function, 7 query families, no network call)
  -> collectUrlForReview(url) -> upserts intel_sources -> collectSource()
       (EXISTING generic collector, lib/intelligence/collect.ts, unmodified)
       -> intel_documents (hash, diff) -> intel_changes if changed
       -> extractDocument() (EXISTING extraction pipeline, deterministic first,
          optional LLM escalation) -> persistExtraction() -> intel_entities / intel_evidence
  -> staff confirms a candidate -> createOrganizationCandidate()
       -> investor_organization_profiles row (extends the intel_entities row)
       -> an intel_evidence row citing the source document
  -> calculateProjectMatch() -> lib/intelligence/investors/scoring.ts (pure, explainable)
       -> investor_project_matches row (component scores, penalties, evidence gaps)
  -> promoteOrganizationToCrm() -> creates a real organizations row, deliberate + logged,
       never automatic (mirrors the existing intel_signals -> opportunities pattern)
```

Every arrow above is either an existing, unmodified piece of the Intelligence OS or a new
pure/deterministic function. No step requires a paid API to run.

## 4. Why there is no separate worker service (a deliberate deviation)

An earlier draft of this module's brief asked for a separately deployable worker process
so long-running discovery/LinkedIn/extraction jobs never block the web app. This
repository has no infrastructure for that (Netlify serverless functions, no persistent
process, no existing job queue), and the *existing* Intelligence OS already solved the
same problem a different way: `.github/workflows/intel-collect.yml`,
`intel-extraction.yml`, and `intel-digest.yml` run scheduled collection/extraction/digest
jobs on GitHub Actions cron, decoupled from the Next.js request/response cycle at zero
infrastructure cost. `investor_discovery_jobs` is schema-ready for the same pattern
(status/attempts/backoff columns exist), but no scheduled workflow has been added yet —
that is a real next step, not an oversight, and should follow the exact shape of
`intel-collect.yml` once there is enough real discovery volume to justify scheduling it
(see "Recommended next step").

## 5. Agent Reach installation and diagnostics

Agent Reach (https://github.com/Panniantong/agent-reach) is an optional external CLI.
This application **never installs it automatically**. To enable the Exa or LinkedIn
channels:

```bash
# 1. Read the install doc yourself first:
#    https://raw.githubusercontent.com/Panniantong/agent-reach/main/docs/install.md

# 2. Preview what an install would do, without doing it:
agent-reach install --env=auto --dry-run

# 3. If that looks right, install it yourself (this app never runs this step for you):
agent-reach install --env=auto

# 4. Confirm what it can actually do:
agent-reach doctor --json
```

`lib/intelligence/investors/providers/agentReach/shared.ts` is the only file that shells
out to `agent-reach`, and only ever runs `doctor --json` to ask its own status — never an
install command, never `--system`. The connector-health page
(`/crm/intelligence/investors/settings`) calls this live on every load, so "not
installed" is always visible truthfully, not cached optimism.

**Once `doctor --json` reports the `exa` or `linkedin` channel as available**, the two
provider adapters (`agentReach/exa.ts`, `agentReach/linkedin.ts`) still report themselves
unavailable and throw on every call. This is intentional, not a bug: the spec that
commissioned this module explicitly said not to hardcode a guessed CLI/MCP call schema
ahead of inspecting the real installed tool. Wiring the actual calls is the concrete next
step once Agent Reach is really installed somewhere this can reach it — see the
`healthCheck().message` on each adapter for exactly what's blocking it.

## 6. Connector configuration

| Provider | Env var | Required? | Behavior when unset |
|---|---|---|---|
| Manual URL | none | No | Always available |
| Jina Reader | `JINA_API_KEY` | No | Works on Jina's free public rate limit |
| Agent Reach / Exa | n/a (CLI-detected) | No | Reports `not_configured`, rest of app unaffected |
| Agent Reach / LinkedIn | n/a (CLI-detected) | No | Reports `not_configured`, rest of app unaffected |

## 7. LinkedIn connector boundaries

Read `lib/intelligence/investors/providers/agentReach/linkedin.ts` in full before touching
it. Hard rules enforced in code, not just documentation: no CAPTCHA bypass, no
account/proxy rotation, no fingerprint evasion, no cookie/credential extraction, no
automatic login/connect/message. Any auth failure, rate limit, or access challenge must
throw `ProviderAccessError` and stop that connector only — never retried through, never
evaded. This is the highest legal/ToS-risk connector in the module; do not enable it for
a live business without a deliberate decision, not just a working technical connection.

## 8. Environment variables

See `.env.example` for the authoritative list. New optional additions for this module:
`JINA_API_KEY`. No new required variables — the module works with zero new configuration.

## 9. Database migrations

`supabase/migrations/20260812120000_create_investor_intelligence_schema.sql`. Adds 16
new tables plus 4 nullable columns on the existing `intel_sources`/`intel_evidence`
tables. Every new table is RLS-gated by the existing `is_intel_access()` helper (a new,
separate flag from general CRM staff access — see `lib/crm/staff.ts checkIntelAccess`).
No existing table's data or policies were altered beyond the additive columns.

## 10. Running discovery jobs

There is no scheduled runner yet (see section 4). Today, discovery is staff-driven from
the UI: create a mandate, generate queries (informational preview of what a future
provider run would search), then use "Collect a source for review" to fetch a specific
URL through the existing collector and confirm a candidate from it.

## 11. Reviewing evidence

Every evidence row cited in an organization's detail page
(`/crm/intelligence/investors/organizations/[id]`) shows the claim text, source tier (1
authoritative / 2 secondary / 3 discovery-only, `intel_sources.source_tier` /
`intel_evidence.source_tier`), and confidence. Tier 3 evidence can create a candidate but
per `scoring.ts`'s `conflicted_or_unverified_identity` penalty and the review-status
workflow, cannot alone move a record to `verified` or `approved_for_contact`.

## 12. Creating capital mandates

`/crm/intelligence/investors/mandates/new`. A mandate is deliberately **not** the same
table as the CRM's existing `capital_mandates` (that table is an investor's own stated
appetite; this module's `project_investment_mandates` is what a Regenera project needs).
Compliance fields (`offering_pathway`, `accredited_investors_only`,
`legal_review_status`, `broker_dealer_required/involved`, `communications_approved`,
`data_room_approved`) exist on the mandate but are not yet exposed in the creation form —
edit them directly via Supabase or a future settings panel until a project actually needs
to gate `approved_for_contact` on them.

## 13. Understanding match scores

`lib/intelligence/investors/scoring.ts`. Two independent, versioned, fully explainable
models (`scoreProjectMatch`, `scoreAccreditedIndividual`) — component weights, penalties,
and classification bands exactly as specified, unit-tested in
`lib/intelligence/investors/__tests__/scoring.test.ts`. No LLM is involved in scoring.
`explicit_sector_exclusion` forces `hard_exclusion` regardless of numeric score.

## 14. Monitoring

Schema-ready (`investor_monitoring_rules`, `investor_change_events`) with a UI action to
create a rule from a candidate. No scheduled job evaluates rules yet — this is the same
"needs a cron workflow once there's real volume" gap as section 4.

## 15. CRM synchronization

There is no external CRM to sync to (this application's own `/crm` **is** the CRM,
confirmed in `docs/crm/CRM_ARCHITECTURE.md`). "CRM sync" here is `promoteOrganizationToCrm`
in `lib/intelligence/investors/actions.ts`: a deliberate, staff-triggered action that
creates a real `organizations` row and stamps `promoted_to_organization_id`/`promoted_at`
on the source profile. It is idempotent (returns the existing organization id if already
promoted) and never runs automatically.

## 16. Security and privacy

- Every new table RLS-gated by `is_intel_access()`, a flag separate from general staff
  access, granted per person (`staff.has_intel_access`).
- `assertSafeUrl` (`lib/intelligence/investors/urlSafety.ts`) blocks non-http(s) schemes,
  localhost, private/loopback/link-local IP literals, and DNS-rebinding to a private
  address, applied to every staff-supplied URL (manual collection, Jina Reader).
- No LinkedIn cookies, passwords, or session tokens are ever stored — the LinkedIn
  connector has no code path that touches any of those.
- No net-worth estimation or protected-class targeting anywhere in the scoring or
  taxonomy code.
- `do_not_contact` / suppression fields exist on contact channels, person profiles, and a
  dedicated `investor_suppression_entries` table.

## 17. Compliance-control fields

See `project_investment_mandates` columns in section 12. These are intelligence
infrastructure, not legal advice — they record a human/counsel decision, they do not
compute one.

## 18. Troubleshooting

- **"Investor Intelligence access denied"**: the signed-in staff account needs
  `has_intel_access = true` on its `staff` row (separate from `intel_agents`/CRM access).
- **Empty text preview after collecting a URL**: the page is likely JS-rendered; the raw
  fetch (`ManualUrlProvider`) only sees server-rendered HTML. The candidate can still be
  created manually from what's visible, or retry once the Jina Reader provider is wired
  into the collection panel (currently only used for `fetchProfile`, not yet the UI's
  default fetch path).
- **A provider always reports `not_configured`**: expected for Agent Reach/Exa/LinkedIn
  until installed and until their call schemas are wired (see section 5).

## 19. Known limitations

- LinkedIn and Exa adapters are interfaces with live health checks, not working search --
  see section 5 and 7 for exactly why and what unblocks them.
- No scheduled discovery/monitoring runner exists yet (section 4/14) — everything today
  is staff-triggered from the UI.
- Entity resolution (`entityResolution.ts`) only *suggests* merges; there is no review-
  queue UI yet for acting on a suggestion (the `investor_review_tasks` table and
  `possible_duplicate` task type exist for this, just not wired to a specific caller).
- The discovery-query generator produces query text but nothing runs those queries
  against a real search provider yet (no working search adapter exists — see section 5).
- Person-side discovery (`investor_person_profiles`, roles, contact channels) has full
  schema and scoring support but no UI create/promote flow yet, only the organization
  side does. Extending `CollectUrlPanel`/`actions.ts` to people is the same pattern
  already proven for organizations.
- No test framework existed in this repository before this module; Vitest was added as a
  dev-only dependency specifically to cover this module's deterministic logic (parsing,
  scoring, entity resolution, query generation, URL safety, provider health) --
  `npm run test`. Server actions and React components are not covered; they require a
  live Supabase project and are exercised manually.

## 20. Recommended next step

Grant `has_intel_access = true` to Alan's staff row, walk the working slice end to end
(create a mandate for a real project, collect a real fund's team page, confirm a
candidate, score it, promote it), and use that real usage to decide which is actually
worth building next: (a) a real search provider (Jina Reader is already free and wired
for `fetchProfile` -- extending the collection panel to use it as a search-then-fetch
loop over the generated queries is the cheapest next increment), or (b) a scheduled
GitHub Actions workflow that runs open discovery jobs on a cadence, matching
`intel-collect.yml`'s existing pattern.
