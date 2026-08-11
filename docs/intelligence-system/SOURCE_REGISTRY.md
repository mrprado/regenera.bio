# Source Registry — status and queue

Tracks what's actually seeded in `intel_sources` versus what the user's Phase 3 continuation prompt (2026-08-11, "SOURCE REGISTRY SEED & PHASE 3 CONTINUATION") asked for, so later batches pick up from a real position instead of re-deriving scope. Every row in this doc reflects the live database at the time it was last updated, not aspiration — check `intel_sources` directly if in doubt.

## What's seeded (Priority 0 — multilateral/DFI procurement and project data)

15 sources, all individually researched via WebSearch and fetch-tested via WebFetch and/or a direct Node request using the collector's own user agent (never seeded on a guess):

**Active (10)** — confirmed reachable, `is_active = true`:
World Bank Procurement Notices API, World Bank Documents & Reports API, World Bank Projects & Operations, World Bank PPI Database, IDB Open Data API, IDB Projects Dataset, UNDP Procurement Notices, UNGM, IFC Disclosure Portal, EBRD Client e-Procurement Portal.

**Known-real, blocked to automated fetch (5)** — `is_active = false`, correct official URL confirmed via search, but the request returned HTTP 403 (bot/Cloudflare protection) under both a generic fetch and the collector's own user agent:
IDB Procurement Notices (main iadb.org site — use the Open Data API instead, already active), AfDB Procurement Notices, AfDB Specific Procurement Notices, AfDB MapAfrica Projects (entire afdb.org-family domain appears to share this protection), EIB Financed Projects.

**Proven end-to-end**: 4 of the active sources (World Bank Procurement Notices API, World Bank PPI, UNDP Procurement Notices, IFC Disclosure Portal) were actually collected — real `intel_documents` rows with real content hashes, real `intel_changes` rows recording the first capture. Re-fetching IFC's page a second time produced the identical hash, confirming the "don't reprocess unchanged content" behavior (spec section 13) actually holds, not just in theory.

## What's explicitly NOT done yet — the rest of the prompt's ask

The 2026-08-11 prompt's real scope is enormous: 20-30 P0 sources (roughly met) plus **50-100 P1 sources** spanning dozens of named global asset managers (BlackRock/GIP, Brookfield, KKR, Blackstone, etc.), ~20 named investment/project-finance banks, the family office/UHNW ecosystem and its gatekeepers, ~13 named private banks, and per-country government/regulatory/procurement portals across 8+ LATAM countries, 13+ African countries, India, 6 GCC states, Europe, and 9+ Asian countries — each with its own energy ministry, utility, regulator, PPP authority, and procurement portal to individually discover and verify. That is realistically several more full research batches of this same kind, not a gap to close in one pass. Doing it properly (real WebSearch + WebFetch verification per source, like the P0 batch above) rather than padding the registry with unverified guesses is the whole point of the "no fabrication" instruction the prompt itself included — so it's being paced, not skipped.

**Not started at all**: the private-capital layer (asset managers, private banks, family offices) and the full LATAM/Africa/GCC/Asia government-portal layer. **Recommended order for the next batch**, given Regenera's actual sector focus: the LATAM government/regulatory layer (Mexico, Brazil, Chile, Colombia — matches the existing Selected Mandates pipeline most directly) and the Africa government/regulatory layer next, before the private-capital/asset-manager layer, since government sources are more likely to have stable, discoverable, machine-collectible URLs (matching the "prefer API/structured data" collection-method ranking) than corporate investor-relations pages, which tend to be JS-heavy and harder to verify without a headless browser (explicitly a "last resort" method per the spec).

## What's still not executable regardless of source count

Steps 6-9 of the prompt's own Phase 3 task list (normalize key datasets, generate entities/claims, activate agents, surface opportunities) need actual agent/extraction code and an LLM API key, neither of which exist yet — only the `intel_agents` catalog (26 rows, all `status = 'planned'`) and the generic collector exist. Seeding more sources doesn't change that; it's a separate, later piece of work, logged in `REQUIRED_FROM_ALAN.md`.

## Collection-method note for future batches

Several official institutional domains (afdb.org and its subdomains, eib.org, and iadb.org's main site) actively block automated requests regardless of user agent. Before spending research time on a government/corporate site in future batches, fetch-test it early — if it 403s, look for that same institution's open-data/API subdomain first (this worked for IDB: `data.iadb.org` instead of `www.iadb.org`), and only fall back to marking it `is_active = false` with a note if no alternative exists. Don't assume a 403 means the URL is wrong; it usually just means bot protection, and the URL still belongs in the registry as `is_active = false` documentation of what was checked.
