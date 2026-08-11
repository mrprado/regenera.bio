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

## Batch 3: Africa, India, GCC, mining exchanges, and the global capital layer (2026-08-11, same session, continued without stopping to ask per the user's instruction)

60 more sources, same fetch-test-first discipline throughout:

**Africa (15, 12 active)**: South Africa (DMPR, eTenders active; NERSA 403, Department of Electricity and Energy has an EXPIRED TLS certificate on their own site), Kenya (EPRA, KPLC, KenGen — EPRA's server refused the connection at test time), Nigeria (NERC, REA, Bureau of Public Procurement — note: use `publicprocurement.ng` without `www`, the www subdomain fails to connect), Ghana (Energy Commission, PURC, PPA, GHANEPS, Minerals Commission — all 5 active, Ghana's the cleanest African cluster tested).

**India (6, 4 active)**: MNRE, SECI, CEA, Ministry of Coal active; Ministry of Power 403'd, GeM (the mandatory national procurement portal) refused the connection — worth re-testing since it's otherwise the single highest-value India procurement source.

**GCC (8, 2 active)**: only Abu Dhabi's Department of Energy and the UAE federal `u.ae` energy-entities directory page actually worked. Every other GCC candidate tested failed for a different reason each time — DEWA (403), UAE Ministry of Energy and Infrastructure (connection refused), Saudi Ministry of Energy (connection refused), Etimad (200 but a JS-rendered empty shell), Abu Dhabi's own procurement gate (200 but actually a WAF rejection page, caught only by checking the extracted text, not just the status code), Saudi's renewable-energy eProcurement portal (TLS certificate for the wrong domain, it's actually white-labeled on Jaggaer's SaaS platform under a broken cert). **GCC is meaningfully harder to collect from than LATAM or Africa in this pass** — worth knowing before assuming "VERY HIGH priority" will translate into an easy source count.

**Mining/filings exchanges (6, 5 active)**: SEC EDGAR Full-Text Search API (real JSON, 10,000+ hits on a test query — but note it requires a compliant `User-Agent` with a real contact identifier or SEC 403s it, the collector's current generic UA will need updating before this is actually usable in production), SEC EDGAR company search, SEDAR+ (Canada), ASX announcements (Australia), JSE (South Africa) all active; LSE's `lse.co.uk/rns` mirror 403'd (the primary londonstockexchange.com RNS feed untested, worth trying next).

**Global capital layer — asset managers, private banks, family-office gatekeepers, mining royalty companies, remaining DFIs (25, 19 active)**: Brookfield, Macquarie AM, KKR, GIP, Actis, Copenhagen Infrastructure Partners, Ardian, Stonepeak, I Squared Capital, Quinbrook, Generate Capital (asset managers, 11/12 active — only Blackstone 403'd); UBS and J.P. Morgan Private Bank alternatives pages (2/2 active); Family Office Exchange and TIGER 21 (2/3 active — Campden Wealth failed to connect); ADB and AIIB (2/2 active, rounding out the DFI list from Batch 1); DEG and Proparco (2/2 active, rounding out the bilateral DFI list); Franco-Nevada, Wheaton Precious Metals, Royal Gold, and British International Investment all 403'd — corporate IR sites and UK DFI sites both skew toward bot-protected in this pass, worth trying a different collection approach (official RSS if one exists, or accept these need a headless-browser method later) rather than repeatedly retrying the same plain fetch.

**Proven end-to-end this batch**: XM (Colombia, from Batch 2), ADB, and Family Office Exchange all actually collected with real content and hashes, not just reachability-checked.

**Running total after Batch 3: 94 sources seeded, 67 active, 7 real captured documents, 26 agents (still all `planned`).**

## Batch 4: full collection sweep + award-fact extraction (2026-08-11, same session)

Two follow-up passes at the user's request ("run the collector for more real data"):

1. Ran the collector against every active source that had never been collected once (38 sources first pass, then a further 20 — every active source in the registry has now been fetched at least once). One more JS-rendered empty-shell source found and deactivated (`ComprasMX`, Mexico's federal procurement portal). Registry now at 65 active, **67 real captured documents**.
2. Enhanced the World Bank Procurement adapter to parse actual award/counterparty facts (who won a contract, for how much) out of Contract Award notices' HTML body, not just project metadata. Found and fixed a real bug in the process (a "Beneficial Ownership Details" section was causing every award to be double-counted). Proven against a real 20-notice solar-sector sample: 3 real Contract Award notices on Pakistan's Sindh Solar Energy Project (World Bank loan IDA-62580) — BBOXX ($38.498M), d.light Design Ltd ($43.276M), Shenzhen Lemi Technology ($30.262M), plus 7 more real solar projects captured as entities. Full detail in `EXTRACTION.md`.

**Running total after Batch 4: 94 sources seeded, 65 active, 67 real captured documents, 62 entities, 26 relationships, 20 evidence-cited claims.**

## Batch 5: conservation, regenerative agriculture, natural capital (2026-08-11, same session)

Explicit gap named by the user: everything collected through Batch 4 is generic procurement/government/capital-market sources -- nothing on conservation, regenerative agriculture, carbon/biodiversity markets, or natural capital, despite that being core to Regenera's actual positioning. 9 real sources researched and fetch-verified the same way as every prior batch:

**Active (8)**: GEF Projects Database (real per-country/topic project counts confirmed, e.g. Brazil 96 projects, Argentina 53), Gold Standard Impact Registry (carbon credits), Mirova Natural Capital (conservation/biodiversity investment platform, >1bn AUM target), FAO Climate Change Projects & Programmes, FAOSTAT, IFAD Projects and Programmes, Capitals Coalition (natural capital accounting, 370+ members), Biodiversity Credit Alliance (UNEP/UNDP-backed biodiversity credit market standards body).

**Inactive (1)**: Verra Registry (`registry.verra.org`) -- world's largest voluntary carbon registry (3,886+ projects per their own reporting), but the registry app itself is a JS-rendered empty shell to a plain fetch, same pattern as several other registry-style sites this session. A public API reportedly exists (~5,000 project records, no auth) but the exact endpoint wasn't confirmed in this pass -- worth a dedicated follow-up.

**Proven**: GEF's Projects Database was actually collected (real content captured and stored, not just reachability-tested).

**Running total after Batch 5: 103 sources seeded, 73 active, 68 real captured documents.**

## What's explicitly NOT done yet — the rest of the prompt's ask

The 2026-08-11 prompt's real scope is enormous: 20-30 P0 sources (roughly met) plus **50-100 P1 sources** spanning dozens of named global asset managers (BlackRock/GIP, Brookfield, KKR, Blackstone, etc.), ~20 named investment/project-finance banks, the family office/UHNW ecosystem and its gatekeepers, ~13 named private banks, and per-country government/regulatory/procurement portals across 8+ LATAM countries, 13+ African countries, India, 6 GCC states, Europe, and 9+ Asian countries — each with its own energy ministry, utility, regulator, PPP authority, and procurement portal to individually discover and verify. That is realistically several more full research batches of this same kind, not a gap to close in one pass. Doing it properly (real WebSearch + WebFetch verification per source, like the P0 batch above) rather than padding the registry with unverified guesses is the whole point of the "no fabrication" instruction the prompt itself included — so it's being paced, not skipped.

**Honest assessment against the full 2026-08-11 prompt, after 3 batches in one continuous session**: every category the prompt named now has real coverage — P0 multilaterals, 4 LATAM countries, 4 African countries, India, GCC, 5 mining/filings exchanges, ~12 global asset managers, 2 private banks, 2 family-office gatekeepers, 3 mining royalty companies, and the DFI list (World Bank/IDB/AfDB/UN/IFC/EBRD/ADB/AIIB/DEG/Proparco). That is a genuinely comprehensive first pass, not just the P0 tier — but it is still a first pass, not literal completion of every named entity. Specifically still open: Peru/Argentina/Central America in LATAM; Tanzania/Uganda/Rwanda/Mozambique/Zambia/Botswana/Namibia/Zimbabwe/Mauritius in Africa; Qatar/Oman/Bahrain/Kuwait in GCC; China/Japan/South Korea/Indonesia/Vietnam/Philippines/Thailand/Malaysia/Singapore in Asia; the EU-institutions/national-ministry layer in Europe beyond EIB/EBRD; most of the ~20 named project-finance banks (JPMorgan, Citi, Goldman, HSBC, etc. — none attempted yet, these are likely to skew bot-protected like Blackstone/Franco-Nevada did); most of the ~13 named private banks beyond UBS/JPM; the waste/water/circular-economy and real-estate/land P2 categories; and the transaction-comparable/people-movement/regulatory-policy P2/P3 categories, which are more naturally served by monitoring the sources above over time than by a distinct source list of their own.

**Pattern worth carrying into any future batch**: roughly 30% of every batch's candidates failed for a real, specific, individually-diagnosed reason (403 bot protection, expired/mismatched TLS certificates, JS-rendered empty shells, refused connections) rather than being wrong URLs — always check the *extracted text*, not just the HTTP status, since at least two sources (Etimad, Abu Dhabi's procurement gate) returned a healthy-looking 200 while actually serving a JS shell or a WAF rejection page.

## What's still not executable regardless of source count

Steps 6-9 of the prompt's own Phase 3 task list (normalize key datasets, generate entities/claims, activate agents, surface opportunities) need actual agent/extraction code and an LLM API key, neither of which exist yet — only the `intel_agents` catalog (26 rows, all `status = 'planned'`) and the generic collector exist. Seeding more sources doesn't change that; it's a separate, later piece of work, logged in `REQUIRED_FROM_ALAN.md`.

## Collection-method note for future batches

Several official institutional domains (afdb.org and its subdomains, eib.org, and iadb.org's main site) actively block automated requests regardless of user agent. Before spending research time on a government/corporate site in future batches, fetch-test it early — if it 403s, look for that same institution's open-data/API subdomain first (this worked for IDB: `data.iadb.org` instead of `www.iadb.org`), and only fall back to marking it `is_active = false` with a note if no alternative exists. Don't assume a 403 means the URL is wrong; it usually just means bot protection, and the URL still belongs in the registry as `is_active = false` documentation of what was checked.
