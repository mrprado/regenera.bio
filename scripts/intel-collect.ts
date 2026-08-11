// Run by .github/workflows/intel-collect.yml on a schedule, before
// extraction. Calls collectSource() (lib/intelligence/collect.ts)
// directly against every active intel_sources row, the same
// direct-to-Supabase pattern already proven in
// scripts/intel-extract-ollama.ts and scripts/intel-digest.ts -- simpler
// than the original app/api/intel/collect HTTP-route design
// (INTEL_COLLECTOR_SECRET), which remains available for on-demand/manual
// triggering but isn't needed for the scheduled path now that this
// pattern is proven.
//
// Without this running daily, the extraction and digest workflows only
// ever see the same one-time bulk capture from 2026-08-11 -- confirmed
// in production: a digest sent with nothing new to report because no
// fresh document had been collected since the last one.

import { createAdminClient } from "../lib/supabase/admin";
import { collectSource } from "../lib/intelligence/collect";

async function main() {
  const supabase = createAdminClient();
  if (!supabase) {
    console.error("SUPABASE_SERVICE_ROLE_KEY / NEXT_PUBLIC_SUPABASE_URL not configured, nothing to do.");
    process.exit(1);
  }

  const { data: sources, error } = await supabase.from("intel_sources").select("id, name").eq("is_active", true);
  if (error || !sources) {
    console.error("Failed to load sources:", error?.message);
    process.exit(1);
  }

  let ok = 0;
  let changed = 0;
  let failed = 0;

  for (const source of sources) {
    const result = await collectSource(source.id);
    if (result.ok) {
      ok++;
      if (result.changed) changed++;
    } else {
      failed++;
      console.error(`${source.name}: ${result.error}`);
    }
  }

  console.log(`Collected ${ok}/${sources.length} sources (${changed} changed since last capture, ${failed} failed).`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
