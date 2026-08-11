# Extraction Pipeline

How a captured `intel_documents` row becomes real `intel_entities` /
`intel_entity_relationships` / `intel_evidence` rows. Written 2026-08-11
per the explicit instruction that V1 must not require a paid LLM: try
deterministic extraction first, escalate to an LLM only when deterministic
confidence is insufficient, and even then prefer a free local model
(Ollama) over Anthropic/OpenAI, which stay available but off unless a key
is set.

## Architecture

`lib/intelligence/extract/index.ts` (`extractDocument`) is the entry
point:

1. Run `lib/intelligence/extract/deterministic/` first. This dispatches to
   a schema-specific adapter if the source URL matches one (currently:
   World Bank Procurement Notices API, SEC EDGAR Full-Text Search), else
   falls back to a generic regex-based heuristic (money/capacity figures
   only — deliberately does not attempt organization/person names from
   free text, since a regex "capitalized word sequence" heuristic on
   arbitrary HTML produces mostly false positives, and a wrong entity in
   the graph is worse than a missing one).
2. If the deterministic result's confidence is >= 0.6, stop there — no LLM
   call happens at all. This is the common case for structured
   API sources, and the whole point of adapters: a well-known JSON shape
   doesn't need an LLM to parse.
3. If confidence is below 0.6, call `getConfiguredProvider()`
   (`lib/intelligence/extract/llm/index.ts`), which tries Ollama, then
   Anthropic, then OpenAI, in that order, and returns the first one whose
   `isAvailable()` check passes. Ollama is available if something answers
   at `OLLAMA_HOST` (default `http://localhost:11434`); Anthropic/OpenAI
   are available only if their API key env var is set. If none are
   available, the function returns `null` and the deterministic result
   ships as-is — **this is a normal outcome, not an error**, per
   instruction not to require a paid key for V1.
4. Deterministic and LLM results are merged, not replaced — deterministic
   findings are precise even when sparse, an LLM pass adds breadth.

`lib/intelligence/extract/persist.ts` (`persistExtraction`) writes an
`ExtractionResult` into the knowledge graph: entities are deduplicated by
`(entity_type, lower(name))` against what already exists (simple exact-ish
matching, not fuzzy/alias resolution — merging two similarly-named but
distinct organizations would be a worse error than a duplicate a human or
future agent can reconcile). Every `intel_evidence` row cites the
`document_id` it came from. Claims without a resolvable entity or
relationship are **not** persisted (counted in `claimsSkippedNoSubject`
instead) — the schema's `intel_evidence_exactly_one_subject` constraint
means an unattributed claim (e.g. the generic heuristic's "this document
mentions $50M somewhere") has nowhere valid to go, and forcing one would
mean inventing a subject.

## Why Ollama can't run in the Netlify route

Netlify serverless functions are stateless, request-scoped processes —
there's no way to keep a local model server (`ollama serve`) running
between invocations, or even for the duration of one. The real home for
Ollama-based extraction is `.github/workflows/intel-extraction.yml`: an
ephemeral GitHub Actions runner installs Ollama, pulls a small model
(`llama3.2:1b` by default), runs `scripts/intel-extract-ollama.ts` against
queued documents, then tears down. This is genuinely free (GitHub Actions'
free tier minutes, no persistent infrastructure) and matches the spec's
own preference for "existing GitHub allowance."

**Proven and scheduled as of 2026-08-11.** Repo secrets were set, and five
manual `workflow_dispatch` runs were used to actually debug this against
the real CI environment rather than guessing:

1. `@/` path-alias resolution failure — `persist.ts` used the alias, but
   `tsx` running standalone outside Next.js's build pipeline doesn't
   resolve it the same way. Fixed to a relative import.
2. `native WebSocket not found` from `@supabase/supabase-js`'s
   `RealtimeClient`, which is constructed at `createClient()` time
   regardless of whether realtime features are used, and needs Node 22+.
   The workflow was pinned to Node 20. Fixed.
3. An unhandled crash (`Cannot read properties of undefined (reading
   'toLowerCase')`) when the small local model (`llama3.2:1b`) returned an
   entity with no `name` field — small models don't reliably follow a
   requested JSON shape. Fixed with a shared `sanitizeExtractionResult()`
   (`lib/intelligence/extract/types.ts`) that every LLM provider now runs
   its output through, plus defensive guards directly in
   `persistExtraction()` itself.

Run 5 succeeded end to end, including a real Ollama-escalated extraction
that wrote a genuine new entity + evidence row to production Supabase
(verified via `execute_sql`, not assumed from a green checkmark). The
`schedule:` trigger (`cron: "0 6 * * *"`, daily) is now enabled.

## Award-fact extraction (World Bank Procurement adapter)

The most valuable fact type this system exists to surface — who was
actually awarded a contract, for how much — doesn't live in a clean JSON
field on the World Bank Procurement API. It's inside `notice_text`, a
loosely-structured HTML blob, only present on `notice_type: "Contract
Award"` notices. The adapter (`worldBankProcurement.ts`) now parses this:
finds the "Awarded Bidder(s):" section, extracts the winning
organization's name and WB bidder ID, and pairs it with the "Signed
Contract price" that follows.

**A real bug was found and fixed while proving this against real data**:
the section also contains a "Beneficial Ownership Details" sub-section
that *restates the same winning bidder's name* (a compliance disclosure,
not a second bidder) — the first version of the section-boundary regex
didn't stop there, so it double-counted every real award (once correctly
priced, once with no price attached, since the price list has only one
real entry). Confirmed by inspecting a real notice's full `notice_text`
(Sindh Solar Energy Project, Pakistan), not by reasoning about the regex
in the abstract. Fixed by stopping the captured section at whichever
comes first among "Beneficial Ownership Details", "Evaluated Bidder(s)",
or "Rejected Bidder(s)".

**Known limitation, not silently assumed away**: awarded names and prices
are paired by their position within the section. This is correct for the
common case (one notice, one winner) but would misattribute price to name
in a genuinely multi-winner single notice — not yet observed in real data,
but worth knowing if a future batch surfaces one.

**Proven with real data**: extracted from a real 20-notice sample of
World Bank solar-sector procurement (13,317 total matching notices in
their system; 20 sampled). Found 3 real Contract Award notices, all on
the same underlying framework agreement (Sindh Solar Energy Project,
Pakistan, World Bank loan IDA-62580, "Bulk Procurement of 200,000 Solar
Home Systems", split across 3 winners):
- BBOXX (UK) — USD 38,498,000
- d.light Design Ltd (Mauritius) — USD 43,276,000
- Shenzhen Lemi Technology Development Co., Ltd (China) — USD 30,262,000

Plus 7 more real solar projects captured as entities (Morocco's
Ouarzazate CSP complex, India's Rewa/Neemuch/Shajapur/Agar solar parks,
Comoros' island electrification program, Burundi's school
electrification program, Pakistan's Tarbela floating solar project).
12 new entities, 4 new relationships, 10 new evidence rows, all persisted
to production Supabase and citation-traceable back to the real captured
document.

## What's actually proven vs. designed-but-untested

**Proven, with real data**: both schema-specific adapters, run against real
captured API responses (not synthetic test data). The World Bank
Procurement Notices adapter: a 3-notice sample produced 7 new entities (3
projects, 2 jurisdictions, 1 organization, 1 regulator), 4 relationships
(3 `located_in`, 1 `awarded_contract_to` — the real fact that UNDP was
awarded a $20.7M contract on Turkey's Health System Strengthening project,
signed 2016-11-09), and 3 evidence rows citing the real captured document.
A separate 15-notice sample produced 30 more entities and 15 more
`located_in` relationships (these currently have **no evidence rows** —
the full 195KB source document wasn't persisted for context-budget
reasons during this proof; the entities/relationships are real and
correctly derived, just not yet formally cited, a gap worth closing before
treating this batch as fully evidence-complete). The SEC EDGAR adapter: a
real full-text search for "solar power" (4,452 total hits, 12 sampled)
produced 6 real organizations (Solar Power Inc, Evergreen Solar, Prime Sun
Power, Coronus Solar, Fairview Energy, American Electric Technologies),
each with a real, fully evidence-cited 8-K filing claim.

**Collection breadth also proven, not just extraction depth**: ran the raw
fetch-hash-store logic (no extraction, this is what a scheduler will
eventually do automatically) against 38 previously-uncollected active
sources in one pass. 37 succeeded with real content; one
(`mercadopublico.cl`, Chile's procurement portal) returned an empty
JS-rendered shell like CENACE/SIE/Etimad before it and was deactivated
with that finding recorded. Two captures (Mexico's SENER, Abu Dhabi's DOE)
returned unusually small bodies compared to earlier test fetches of the
same URLs — noted in `intel_documents.raw_content` as worth re-checking,
not silently trusted. Total real captured documents across all proving
passes: 47.

**Designed, not yet live-tested**: the Ollama provider (real HTTP client
matching Ollama's documented API, but no Ollama installation exists in the
environment this was written in) and the GitHub Actions workflow. The
Anthropic/OpenAI provider stubs are real, standard API calls, disabled
until a key is set, also untested.

**A real bug found and fixed along the way**: `lib/intelligence/collect.ts`
originally truncated ALL captured content (including JSON) at 20,000
characters to limit storage bloat. For a JSON API response, truncating at
an arbitrary byte offset produces invalid JSON — which would have silently
broken every deterministic adapter's `JSON.parse()` the moment a real
capture exceeded that length (confirmed: even a 2-notice World Bank
response can hit 54KB due to one large `notice_text` field). Fixed to only
truncate non-JSON content; JSON is stored in full regardless of size. Found
by actually running extraction against a real capture, not by inspection.
