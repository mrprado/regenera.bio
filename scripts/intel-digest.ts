// Run by .github/workflows/intel-digest.yml twice daily (morning and
// evening), after .github/workflows/intel-collect.yml and
// intel-extraction.yml have had a chance to run. Summarizes what actually
// happened in the intelligence system since the last digest -- new
// documents collected, new entities/relationships/evidence extracted,
// source changes detected -- as a letter, and emails it via the same
// Resend integration the site's own contact/lead forms use
// (lib/notify.ts).
//
// Always includes a "highlights" section drawn from the highest-
// confidence evidence on record ALL-TIME, not just what changed since
// the last briefing -- without this, a quiet period produces an email
// with genuinely nothing in it, which is exactly what happened the first
// time this ran on a schedule (confirmed: an empty "nothing new" email
// with real, substantive facts sitting unmentioned in the database the
// whole time).
//
// Deliberately does NOT claim to surface "opportunities" or "signals" --
// no agent/prioritization code exists yet (see docs/intelligence-system/
// ARCHITECTURE.md, intel_signals is unused). This is a factual activity
// summary, not intelligence synthesis; the letter says so plainly rather
// than implying more analysis happened than actually did.
//
// REPORT_PERIOD env var ("morning" | "evening", default "morning") picks
// the greeting/report_type; the two scheduled runs in the workflow set it
// differently.

import { createAdminClient } from "../lib/supabase/admin";
import { sendNotificationEmail } from "../lib/notify";

type Period = "morning" | "evening";

function formatEvidenceLine(claimText: string): string {
  return claimText.length > 220 ? `${claimText.slice(0, 217)}...` : claimText;
}

async function main() {
  const supabase = createAdminClient();
  if (!supabase) {
    console.error("SUPABASE_SERVICE_ROLE_KEY / NEXT_PUBLIC_SUPABASE_URL not configured, nothing to do.");
    process.exit(1);
  }

  const period: Period = process.env.REPORT_PERIOD === "evening" ? "evening" : "morning";
  const reportType = period === "evening" ? "daily_evening" : "daily_morning";
  const greeting = period === "evening" ? "Good evening, Alan," : "Good morning, Alan,";
  const subjectLabel = period === "evening" ? "evening briefing" : "morning briefing";

  const { data: lastReport } = await supabase.from("intel_reports").select("generated_at").order("generated_at", { ascending: false }).limit(1).maybeSingle();

  const periodStart = lastReport?.generated_at ? new Date(lastReport.generated_at) : new Date(Date.now() - 24 * 60 * 60 * 1000);
  const periodEnd = new Date();

  const [documents, entities, relationships, evidence, changes, sources, highlights] = await Promise.all([
    supabase.from("intel_documents").select("id, url, intel_sources(name)").gte("fetched_at", periodStart.toISOString()),
    supabase.from("intel_entities").select("entity_type, name").gte("created_at", periodStart.toISOString()),
    supabase.from("intel_entity_relationships").select("id, relationship_type").gte("created_at", periodStart.toISOString()),
    supabase.from("intel_evidence").select("claim_text, confidence").gte("extracted_at", periodStart.toISOString()).order("confidence", { ascending: false }).limit(8),
    supabase.from("intel_changes").select("id, significance").gte("detected_at", periodStart.toISOString()),
    supabase.from("intel_sources").select("is_active"),
    // All-time highest-confidence claims, independent of the since-last-
    // briefing window -- without this, a quiet period (no new collection/
    // extraction) produces an email with genuinely nothing in it, which
    // is exactly what happened in production the first time this ran on
    // a schedule. This keeps every send substantive by drawing on what's
    // actually accumulated in the knowledge graph, not just what changed
    // in the last few hours.
    supabase.from("intel_evidence").select("claim_text, confidence").order("confidence", { ascending: false }).order("extracted_at", { ascending: false }).limit(8)
  ]);

  const docCount = documents.data?.length ?? 0;
  const entityCount = entities.data?.length ?? 0;
  const relCount = relationships.data?.length ?? 0;
  const evidenceCount = evidence.data?.length ?? 0;
  const changeCount = changes.data?.length ?? 0;
  const activeSources = (sources.data ?? []).filter((s) => s.is_active).length;
  const totalSources = sources.data?.length ?? 0;

  const uniqueSourceNames = Array.from(
    new Set((documents.data ?? []).map((d) => (d as { intel_sources?: { name?: string } }).intel_sources?.name).filter((n): n is string => Boolean(n)))
  );

  const quiet = docCount === 0 && entityCount === 0 && evidenceCount === 0 && changeCount === 0;

  const paragraphs: string[] = [greeting, ""];

  if (quiet) {
    paragraphs.push("Nothing new came through the intelligence system since your last briefing -- no documents collected, nothing extracted this cycle.", "");
  } else {
    const topLine =
      docCount > 0
        ? `The system captured ${docCount} document${docCount === 1 ? "" : "s"} since your last briefing${uniqueSourceNames.length ? `, across sources including ${uniqueSourceNames.slice(0, 5).join(", ")}${uniqueSourceNames.length > 5 ? `, and ${uniqueSourceNames.length - 5} more` : ""}` : ""}.`
        : `No new documents were collected since your last briefing, but the extraction pipeline processed material already on hand.`;
    paragraphs.push(topLine, "");

    if (entityCount > 0 || evidenceCount > 0) {
      paragraphs.push(
        `That produced ${entityCount} new entit${entityCount === 1 ? "y" : "ies"} and ${evidenceCount} evidence-cited claim${evidenceCount === 1 ? "" : "s"}${relCount > 0 ? `, with ${relCount} new relationship${relCount === 1 ? "" : "s"} linking them` : ""} in the knowledge graph.`,
        ""
      );
    }

    if (evidenceCount > 0) {
      paragraphs.push("A few of what came in:");
      for (const e of (evidence.data ?? []).slice(0, 6)) {
        paragraphs.push(`  - ${formatEvidenceLine(e.claim_text)}`);
      }
      paragraphs.push("");
    }

    if (changeCount > 0) {
      paragraphs.push(`${changeCount} previously-tracked source${changeCount === 1 ? "" : "s"} showed real content changes since last check.`, "");
    }
  }

  const alreadyShown = new Set((evidence.data ?? []).map((e) => e.claim_text));
  const highlightRows = (highlights.data ?? []).filter((h) => !alreadyShown.has(h.claim_text)).slice(0, 5);

  if (highlightRows.length > 0) {
    paragraphs.push(quiet ? "In the meantime, here's what's already on record, for context:" : "Also worth keeping in view, from earlier captures still on record:");
    for (const h of highlightRows) {
      paragraphs.push(`  - ${formatEvidenceLine(h.claim_text)}`);
    }
    paragraphs.push("");
  }

  paragraphs.push(
    `Source registry stands at ${activeSources} active out of ${totalSources} tracked.`,
    "",
    "A note on what this is: this is a factual summary of what the collector and extraction pipeline actually did, not an analyzed opportunity list -- there's no agent layer yet that prioritizes or interprets these facts for you. Full detail always lives in docs/intelligence-system/ in the repo, or I can query the database directly on request.",
    "",
    "-- Your Regenera Intelligence System"
  );

  const content = paragraphs.join("\n");

  const { data: report, error: reportError } = await supabase
    .from("intel_reports")
    .insert({
      report_type: reportType,
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

  const sent = await sendNotificationEmail(`Your ${subjectLabel} -- Regenera Intelligence, ${periodEnd.toISOString().slice(0, 10)}`, content);

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
