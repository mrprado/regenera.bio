// Run by .github/workflows/intel-extraction.yml on a schedule, after
// intel-collect.yml. Ollama can't run inside a Netlify serverless
// function (no persistent process), so this is the actual production
// home for LLM-escalated extraction: a GitHub Actions runner installs
// Ollama, pulls a small model, runs this script against queued
// documents, then tears down -- free, per the spec's free/open-source-
// first requirement.
//
// Proven live in production (2026-08-11), including catching and fixing
// a real hallucination bug -- see docs/intelligence-system/EXTRACTION.md.
//
// Processes documents referenced by recent intel_changes rows (first
// captures and genuine content changes), not just "any recent document
// lacking evidence" -- the collector inserts a fresh intel_documents row
// every run even when content is unchanged, so the naive version of this
// query would silently re-process identical content every single day.
// intel_changes already only gets a row when the hash actually differs
// (or it's a source's first-ever capture), so it's the correct queue.

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

  const { data: changes, error: changesError } = await supabase
    .from("intel_changes")
    .select("new_document_id")
    .order("detected_at", { ascending: false })
    .limit(BATCH_SIZE * 2); // some will already have evidence; overfetch and filter below

  if (changesError || !changes) {
    console.error("Failed to load changes:", changesError?.message);
    process.exit(1);
  }

  const candidateIds = Array.from(new Set(changes.map((c) => c.new_document_id))).slice(0, BATCH_SIZE * 2);
  if (candidateIds.length === 0) {
    console.log("No changed documents to process.");
    return;
  }

  const { data: documents, error } = await supabase
    .from("intel_documents")
    .select("id, url, raw_content, source_id, intel_sources(name)")
    .in("id", candidateIds);

  if (error || !documents) {
    console.error("Failed to load documents:", error?.message);
    process.exit(1);
  }

  let processed = 0;
  let skippedAlreadyExtracted = 0;

  for (const doc of documents.slice(0, BATCH_SIZE)) {
    const { count } = await supabase.from("intel_evidence").select("id", { count: "exact", head: true }).eq("document_id", doc.id);
    if (count && count > 0) {
      skippedAlreadyExtracted++;
      continue;
    }
    if (!doc.raw_content) continue;

    const sourceLabel = (doc as { intel_sources?: { name?: string } }).intel_sources?.name ?? doc.url ?? "unknown source";
    const result = await extractDocument(doc.url ?? "", doc.raw_content, sourceLabel);
    const stats = await persistExtraction(doc.id, result);
    processed++;
    console.log(`${sourceLabel}: confidence=${result.confidence.toFixed(2)} extractedBy=${result.extractedBy} entities+${stats.entitiesCreated} relationships+${stats.relationshipsCreated} evidence+${stats.evidenceCreated}`);
  }

  console.log(`Done. Processed ${processed} changed documents, ${skippedAlreadyExtracted} already had evidence.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
