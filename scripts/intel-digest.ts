// Run by .github/workflows/intel-digest.yml on a schedule (after the
// extraction workflow has had time to run). Summarizes what actually
// happened in the intelligence system since the last digest -- new
// documents collected, new entities/relationships/evidence extracted,
// changes detected -- and emails it via the same Resend integration the
// site's own contact/lead forms use (lib/notify.ts).
//
// Deliberately does NOT claim to surface "opportunities" or "signals" --
// no agent/prioritization code exists yet (see docs/intelligence-system/
// ARCHITECTURE.md, intel_signals is unused). This is a factual activity
// summary, not intelligence synthesis; don't let the subject line or
// framing imply more than that until there's real signal-generation code
// behind it.

import { createAdminClient } from "../lib/supabase/admin";
import { sendNotificationEmail } from "../lib/notify";

async function main() {
  const supabase = createAdminClient();
  if (!supabase) {
    console.error("SUPABASE_SERVICE_ROLE_KEY / NEXT_PUBLIC_SUPABASE_URL not configured, nothing to do.");
    process.exit(1);
  }

  const { data: lastReport } = await supabase.from("intel_reports").select("generated_at").order("generated_at", { ascending: false }).limit(1).maybeSingle();

  const periodStart = lastReport?.generated_at ? new Date(lastReport.generated_at) : new Date(Date.now() - 24 * 60 * 60 * 1000);
  const periodEnd = new Date();

  const [documents, entities, relationships, evidence, changes, sources] = await Promise.all([
    supabase.from("intel_documents").select("id, url, intel_sources(name)").gte("fetched_at", periodStart.toISOString()),
    supabase.from("intel_entities").select("entity_type, name").gte("created_at", periodStart.toISOString()),
    supabase.from("intel_entity_relationships").select("id, relationship_type").gte("created_at", periodStart.toISOString()),
    supabase.from("intel_evidence").select("claim_text, confidence").gte("extracted_at", periodStart.toISOString()).order("confidence", { ascending: false }).limit(15),
    supabase.from("intel_changes").select("id, significance").gte("detected_at", periodStart.toISOString()),
    supabase.from("intel_sources").select("is_active")
  ]);

  const activeSources = (sources.data ?? []).filter((s) => s.is_active).length;
  const totalSources = sources.data?.length ?? 0;

  const entityCountsByType = (entities.data ?? []).reduce<Record<string, number>>((acc, e) => {
    acc[e.entity_type] = (acc[e.entity_type] ?? 0) + 1;
    return acc;
  }, {});

  const lines = [
    `Regenera Intelligence OS -- activity digest`,
    `${periodStart.toISOString().slice(0, 16).replace("T", " ")} to ${periodEnd.toISOString().slice(0, 16).replace("T", " ")} UTC`,
    "",
    `Source registry: ${activeSources} active / ${totalSources} total.`,
    "",
    `Documents collected: ${documents.data?.length ?? 0}`,
    ...(documents.data ?? []).slice(0, 10).map((d) => `  - ${(d as { intel_sources?: { name?: string } }).intel_sources?.name ?? d.url}`),
    ...((documents.data?.length ?? 0) > 10 ? [`  ...and ${(documents.data?.length ?? 0) - 10} more`] : []),
    "",
    `Entities extracted: ${entities.data?.length ?? 0}${Object.keys(entityCountsByType).length ? ` (${Object.entries(entityCountsByType).map(([t, c]) => `${c} ${t}`).join(", ")})` : ""}`,
    `Relationships extracted: ${relationships.data?.length ?? 0}`,
    `Evidence-cited claims: ${evidence.data?.length ?? 0}`,
    ...(evidence.data ?? []).slice(0, 8).map((e) => `  - ${e.claim_text}`),
    "",
    `Source changes detected: ${changes.data?.length ?? 0}`,
    "",
    "This is a factual activity summary of what the collector and extraction pipeline did, not an analyzed opportunity report -- no agent/prioritization layer exists yet.",
    "",
    "Full detail: docs/intelligence-system/ in the repo, or query Supabase directly."
  ];

  const content = lines.join("\n");

  const { data: report, error: reportError } = await supabase
    .from("intel_reports")
    .insert({
      report_type: "daily_morning",
      period_start: periodStart.toISOString().slice(0, 10),
      period_end: periodEnd.toISOString().slice(0, 10),
      content
    })
    .select("id")
    .single();

  if (reportError || !report) {
    console.error("Failed to store report:", reportError?.message);
    process.exit(1);
  }

  const sent = await sendNotificationEmail(`Regenera Intelligence digest -- ${periodEnd.toISOString().slice(0, 10)}`, content);

  await supabase.from("intel_report_deliveries").insert({
    report_id: report.id,
    channel: "email",
    status: sent ? "sent" : "failed",
    delivered_at: sent ? new Date().toISOString() : null,
    error: sent ? null : "sendNotificationEmail returned false, see workflow log for the underlying Resend/config error"
  });

  console.log(sent ? "Digest sent." : "Digest generated but email send failed -- see log above.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
