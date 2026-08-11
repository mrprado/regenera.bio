# Intelligence OS — Architecture (Phase 1)

Ontology and system design for the private business-intelligence platform, built on top of the existing Supabase project audited in `EXISTING_SYSTEM_AUDIT.md`. This is a design doc, not an implementation log — see `supabase/migrations/` for the schema that implements it and `CLAUDE.md` for the running build history.

## 1. Core principle: evidence-first

No fact enters the knowledge graph without a citation back to a specific captured document. The system does not store conclusions floating free of their source — every `intel_entity_relationships` row and every field on an `intel_entities` row that isn't a bare identifier is backed by one or more `intel_evidence` rows, each pointing at an `intel_documents` row. This is the same proof-discipline already enforced on the public site (no invented figures/status) applied to an automated pipeline instead of a human writer — the automation has to earn the same standard, not a lower one.

## 2. Entities and relationships (the knowledge graph)

`intel_entities` is a single polymorphic table (not one table per type) because relationships cross types constantly (a person sits on a fund's board and also owns land) and a single table keeps the relationship table simple. Type-specific detail lives in a `details jsonb` column rather than per-type columns, since the shape of "what matters" differs a lot between a mining company and a family office and will keep changing as real sources get onboarded — a rigid column set would need constant migrations.

Entity types (`entity_type` enum, extendable): `organization`, `person`, `fund`, `project`, `asset`, `regulator`, `jurisdiction`.

Relationships (`intel_entity_relationships`) are typed, directed, evidence-backed, and time-bounded (`valid_from`/`valid_to`, nullable = still current). Relationship types are free text (not an enum) because the real-world vocabulary here is large and growing (e.g. `board_member_of`, `invests_in`, `advises`, `owns`, `permits`, `regulates`, `competes_with`) — a closed enum would force miscategorization the first week. A `confidence` field (0–1) lets an agent express uncertainty explicitly instead of asserting a relationship it only half-inferred.

## 3. Source registry and capture

`intel_sources` is the watch list: what gets checked, how, and how often. Each source has a `source_type` (`website`, `regulatory_filing`, `news_feed`, `social`, `document_portal`, `api`), a `check_frequency` (interval), and `jurisdiction`/`category` tags for routing to the right specialist agent. Sources start `is_active = false` until someone (an agent or Alan) has actually verified the URL/endpoint works — no source is trusted by default.

`intel_documents` stores one row per capture: the fetched content (or a pointer to it — see storage note below), a `content_hash` for cheap change detection, `fetched_at`, and the `source_id`. `intel_changes` records the diff between two consecutive `intel_documents` rows for the same source when the hash changes, with a `significance` field an agent can set after reviewing the diff (most hash changes are boilerplate — a timestamp footer, an ad — not real news; the significance field is what lets downstream agents ignore noise).

**Storage note**: raw HTML/PDF bodies are not stored inline in Postgres rows — `intel_documents.raw_content` holds a Supabase Storage path, not the content itself, once a document exceeds a few KB. This avoids bloating the primary database with what is mostly disposable capture data. Storage bucket setup is a Phase 3 (collector) concern, not addressed further here.

## 4. Evidence ledger

`intel_evidence` is the join between "a specific claim" and "the document that supports it." Each row: `entity_id` (or `relationship_id`, one of the two, never both), `claim_text` (the extracted fact in plain language), `document_id`, `extracted_by` (which agent, or `manual`), `extracted_at`, `confidence`. This table is what makes every downstream report auditable — a report line can always be traced back to `evidence → document → source` on demand, which matters given this system will eventually make claims about capital, regulation, and specific counterparties.

## 5. Agent registry

`intel_agents` is a catalog row per named specialized agent from the spec (25 of them), not the agents' code — each row records `name`, `role_description`, `domain` (e.g. "African mining regulation", "family office capital flows"), `schedule` (cron expression or null for on-demand), and `status` (`active`/`paused`/`planned`). `intel_agent_runs` logs each execution: `agent_id`, `started_at`, `finished_at`, `status`, `summary`, and a `stats jsonb` field for run-specific metrics (documents fetched, changes found, evidence created). This gives observability into the system's own behavior from day one, before 25 agents actually exist — the registry can be seeded with `planned` rows now and flipped to `active` as each is actually built, so the catalog is always a truthful picture of what's real versus aspirational.

## 6. Signals and the prospecting engine

`intel_signals` holds agent-generated "this might matter" output — a new capital commitment, a regulatory change, a fresh counterparty — each linked to the entities/evidence involved and scored (`relevance_score`) rather than auto-promoted anywhere. This is deliberately **separate from the CRM's `opportunities` table**: the CRM table represents Regenera's actual internal pipeline (real, human-confirmed engagements per the Selected Mandates proof-discipline rules already established for the public site); `intel_signals` represents raw automated pattern-matching that has not been human-reviewed. Promotion from a signal into a real CRM opportunity is a deliberate, logged action (`intel_signals.promoted_to_opportunity_id`), never automatic — this preserves the existing "no fabricated pipeline" discipline instead of letting an agent's guess silently become a claimed mandate.

## 7. Reports and delivery

`intel_reports` stores each generated digest (`report_type`: `daily_morning`, `daily_evening`, `weekly`, `monthly`; `period_start`/`period_end`; `content`; `generated_at`). `intel_report_deliveries` logs each delivery attempt per channel (`email`/`whatsapp`) with status, separate from the report content itself, so a delivery failure doesn't require regenerating the report.

## 8. Access control

Reuses the existing `staff` table and auth stack rather than standing up a second system (per the Phase 0 audit's recommendation). A new `has_intel_access boolean not null default false` column on `staff` plus an `is_intel_access()` `SECURITY DEFINER` helper function gates every `intel_*` table, following the exact pattern already fixed for RLS recursion in `docs/crm/SECURITY_MODEL.md` (helper function, never an inline `EXISTS` subquery on the table itself). CRM staff and intel-system staff are not assumed to be the same set of people — access is granted per-column, explicitly.

## 9. What Phase 2 implements now

The migration in this phase creates the tables described above with RLS, plus enables `pg_cron`, `pg_net`, and `vector` (extensions confirmed available in Phase 0). It does **not** yet: seed real sources, write any collector code, create the 25 agent rows beyond the registry table existing, or build the `app.regenera.bio` dashboard. Those are later phases (3+) and depend on real credentials/decisions logged in `REQUIRED_FROM_ALAN.md` as they come up.
