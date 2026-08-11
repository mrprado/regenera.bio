// Run by .github/workflows/intel-extraction.yml on a schedule. Ollama can't
// run inside a Netlify serverless function (no persistent process), so
// this is the actual production home for LLM-escalated extraction: a
// GitHub Actions runner installs Ollama, pulls a small model, runs this
// script against queued documents, then tears down -- free, per the
// spec's free/open-source-first requirement.
//
// NOT LIVE-TESTED as of 2026-08-11 -- written and reviewed, but no CI run
// has exercised it yet (needs SUPABASE_SERVICE_ROLE_KEY and
// NEXT_PUBLIC_SUPABASE_URL set as repo secrets first). Deterministic
// extraction (lib/intelligence/extract/deterministic) IS proven, against
// real captured documents -- see docs/intelligence-system/EXTRACTION.md.

import { createAdminClient } from "../lib/supabase/admin";
import { extractDocument } from "../lib/intelligence/extract";
import { persistExtraction } from "../lib/intelligence/extract/persist";

const BATCH_SIZE = 25;

async function main() {
  const supabase = createAdminClient();
  if (!supabase) {
    console.error("SUPABASE_SERVICE_ROLE_KEY / NEXT_PUBLIC_SUPABASE_URL not configured, nothing to do.");
    process.exit(1);
  }

  // Documents with no intel_evidence rows yet are the extraction queue --
  // a simple, real "not yet processed" signal. Not a dedicated status
  // column (that's a reasonable future improvement once this has run for
  // real and the failure modes of this approach are actually known).
  const { data: documents, error } = await supabase
    .from("intel_documents")
    .select("id, url, raw_content, source_id, intel_sources(name)")
    .order("fetched_at", { ascending: false })
    .limit(BATCH_SIZE);

  if (error || !documents) {
    console.error("Failed to load documents:", error?.message);
    process.exit(1);
  }

  let processed = 0;
  let skippedNoEvidenceNeeded = 0;

  for (const doc of documents) {
    const { count } = await supabase.from("intel_evidence").select("id", { count: "exact", head: true }).eq("document_id", doc.id);
    if (count && count > 0) {
      skippedNoEvidenceNeeded++;
      continue;
    }
    if (!doc.raw_content) continue;

    const sourceLabel = (doc as { intel_sources?: { name?: string } }).intel_sources?.name ?? doc.url ?? "unknown source";
    const result = await extractDocument(doc.url ?? "", doc.raw_content, sourceLabel);
    const stats = await persistExtraction(doc.id, result);
    processed++;
    console.log(`${sourceLabel}: confidence=${result.confidence.toFixed(2)} extractedBy=${result.extractedBy} entities+${stats.entitiesCreated} relationships+${stats.relationshipsCreated} evidence+${stats.evidenceCreated}`);
  }

  console.log(`Done. Processed ${processed} documents, ${skippedNoEvidenceNeeded} already had evidence.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
