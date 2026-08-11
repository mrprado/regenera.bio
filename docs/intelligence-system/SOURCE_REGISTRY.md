# Source Registry — status and queue

Tracks what's actually seeded in `intel_sources` versus what the user's Phase 3 continuation prompt (2026-08-11, "SOURCE REGISTRY SEED & PHASE 3 CONTINUATION") asked for, so later batches pick up from a real position instead of re-deriving scope. Every row in this doc reflects the live database at the time it was last updated, not aspiration — check `intel_sources` directly if in doubt.

## What's seeded (Priority 0 — multilateral/DFI procurement and project data)

15 sources, all individually researched via WebSearch and fetch-tested via WebFetch and/or a direct Node request using the collector's own user agent (never seeded on a guess):

**Active (10)** — confirmed reachable, `is_active = true`:
World Bank Procurement Notices API, World Bank Documents & Reports API, World Bank Projects & Operations, World Bank PPI Database, IDB Open Data API, IDB Projects Dataset, UNDP Procurement Notices, UNGM, IFC Disclosure Portal, EBRD Client e-Procurement Portal.

**Known-real, blocked to automated fetch (5)** — `is_active = false`, correct official URL confirmed via search, but the request returned HTTP 403 (bot/Cloudflare protection) under both a generic fetch and the collector's own user agent:
IDB Procurement Notices (main iadb.org site — use the Open Data API instead, already active), AfDB Procurement Notices, AfDB Specific Procurement Notices, AfDB MapAfrica Projects (entire afdb.org-family domain appears to share this protection), EIB Financed Projects.

**Proven end-to-end**: 4 of the active sources (World Bank Procurement Notices API, World Bank PPI, UNDP Procurement Notices, IFC Disclosure Portal) were actually collected — real `intel_documents` rows with real content hashes, real `intel_changes` rows recording the first capture. Re-fetching IFC's page a second time produced the identical hash, confirming the "don't reprocess unchanged content" behavior (spec section 13) actually holds, not just in theory.

## Batch 2: LATAM government/regulatory layer (2026-08-11)

19 more sources across Mexico, Brazil, Chile, and Colombia — energy ministry, regulator, grid operator, procurement portal, and environmental permitting authority for each, researched and fetch-tested the same way as the P0 batch (WebSearch then a real HTTP request, never seeded on a guess).

**Active (17)**: SENER, CNE México (the successor to CRE, which was folded into SENER on 2025-03-18 — use `cne.gob.mx`, not the old `cre.gob.mx`), CENACE*, ComprasMX, SIE*; MME, ANEEL, ONS, Compras.gov.br (Brazil); CNE Chile, SEA, Mercado Público (Chile); Ministerio de Minas y Energía, CREG, XM, Colombia Compra Eficiente/SECOP, ANLA (Colombia). *CENACE and SIE were seeded active, then actually collected against and found to return HTTP 200 with an **empty body on plain HTTP fetch** (client-side-JS-rendered pages — cheerio-based extraction finds nothing), so both were flipped back to `is_active = false` with that specific finding recorded, rather than left active and silently producing useless empty-content captures forever.

**Inactive (2), documented reasons**: Coordinador Eléctrico Nacional (Chile's grid operator) returns HTTP 403 like the AfDB/EIB pattern from Batch 1. CAF (Development Bank of Latin America) fails TLS certificate verification ("unable to verify the first certificate") under two independent fetch methods — a server-side certificate-chain misconfiguration on CAF's end, not a wrong URL or bot-blocking, worth re-testing in a later batch since it may get fixed.

**Proven end-to-end**: XM (Colombia's grid operator/market administrator) was actually collected — real content extracted (15,368 characters), hashed, stored as a genuine `intel_documents`/`intel_changes` row, same as the 4 P0 sources proven in Batch 1.

**Running total after Batch 2**: 34 sources seeded, 25 active, 5 real captured documents, 26 agents (unchanged, still all `planned`).

## What's explicitly NOT done yet — the rest of the prompt's ask

The 2026-08-11 prompt's real scope is enormous: 20-30 P0 sources (roughly met) plus **50-100 P1 sources** spanning dozens of named global asset managers (BlackRock/GIP, Brookfield, KKR, Blackstone, etc.), ~20 named investment/project-finance banks, the family office/UHNW ecosystem and its gatekeepers, ~13 named private banks, and per-country government/regulatory/procurement portals across 8+ LATAM countries, 13+ African countries, India, 6 GCC states, Europe, and 9+ Asian countries — each with its own energy ministry, utility, regulator, PPP authority, and procurement portal to individually discover and verify. That is realistically several more full research batches of this same kind, not a gap to close in one pass. Doing it properly (real WebSearch + WebFetch verification per source, like the P0 batch above) rather than padding the registry with unverified guesses is the whole point of the "no fabrication" instruction the prompt itself included — so it's being paced, not skipped.

**Not started at all**: the private-capital layer (asset managers, private banks, family offices), the Africa/GCC/Asia government-portal layer, and the remaining LATAM countries the prompt named but this batch didn't reach (Peru, Argentina, Central America). **Recommended order for the next batch**: Africa government/regulatory layer (South Africa, Kenya, Nigeria, Ghana as a starting cluster) next, before the private-capital/asset-manager layer, for the same reason as before — government/regulator sources tend to have more stable, verifiable URLs than JS-heavy corporate investor-relations pages. Worth noting from this batch: even government sources aren't uniformly collectible — 2 of the 21 real LATAM URLs found (CENACE, SIE) are JS-rendered and return empty content on a plain fetch, so "government source" doesn't guarantee "easy to collect," each one still needs the same fetch-test-first discipline.

## What's still not executable regardless of source count

Steps 6-9 of the prompt's own Phase 3 task list (normalize key datasets, generate entities/claims, activate agents, surface opportunities) need actual agent/extraction code and an LLM API key, neither of which exist yet — only the `intel_agents` catalog (26 rows, all `status = 'planned'`) and the generic collector exist. Seeding more sources doesn't change that; it's a separate, later piece of work, logged in `REQUIRED_FROM_ALAN.md`.

## Collection-method note for future batches

Several official institutional domains (afdb.org and its subdomains, eib.org, and iadb.org's main site) actively block automated requests regardless of user agent. Before spending research time on a government/corporate site in future batches, fetch-test it early — if it 403s, look for that same institution's open-data/API subdomain first (this worked for IDB: `data.iadb.org` instead of `www.iadb.org`), and only fall back to marking it `is_active = false` with a note if no alternative exists. Don't assume a 403 means the URL is wrong; it usually just means bot protection, and the URL still belongs in the registry as `is_active = false` documentation of what was checked.
