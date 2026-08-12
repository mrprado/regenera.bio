import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import GenerateQueriesButton from "@/components/investors/GenerateQueriesButton";
import CollectUrlPanel from "@/components/investors/CollectUrlPanel";
import CalculateMatchButton from "@/components/investors/CalculateMatchButton";

export default async function MandateDetailPage({ params }: { params: { id: string } }) {
  const supabase = createClient();

  const { data: mandate } = await supabase.from("project_investment_mandates").select("*").eq("id", params.id).single();
  if (!mandate) notFound();

  const [{ data: queries }, { data: matches }, { data: candidates }] = await Promise.all([
    supabase.from("investor_discovery_queries").select("id, query_family, query_text, status").eq("mandate_id", params.id).order("query_family"),
    supabase
      .from("investor_project_matches")
      .select("id, investor_entity_id, total_score, classification, calculated_at, intel_entities(name)")
      .eq("mandate_id", params.id)
      .order("total_score", { ascending: false }),
    supabase.from("investor_organization_profiles").select("entity_id, investor_universe, review_status, intel_entities(name)").order("created_at", { ascending: false }).limit(50)
  ]);

  const matchedEntityIds = new Set((matches ?? []).map((m) => m.investor_entity_id));
  const unmatchedCandidates = (candidates ?? []).filter((c) => !matchedEntityIds.has(c.entity_id));

  return (
    <div>
      <h1 style={{ fontFamily: "var(--serif)", fontSize: 24, marginBottom: 4 }}>{mandate.name}</h1>
      <p style={{ fontSize: 12, color: "var(--t-mid)", marginBottom: 24 }}>
        Status: {mandate.status} · Sectors: {(mandate.sectors ?? []).join(", ") || "—"} · Geographies: {(mandate.geographies ?? []).join(", ") || "—"}
        {mandate.preferred_check_min || mandate.preferred_check_max
          ? ` · Check size: ${mandate.currency} ${mandate.preferred_check_min ?? "?"} – ${mandate.preferred_check_max ?? "?"}`
          : ""}
      </p>

      <section style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: 16, marginBottom: 10 }}>Discovery queries ({queries?.length ?? 0})</h2>
        <GenerateQueriesButton mandateId={mandate.id} />
        {queries && queries.length > 0 && (
          <ul style={{ fontSize: 12, color: "var(--t-mid)", marginTop: 12, maxHeight: 200, overflowY: "auto", paddingLeft: 18 }}>
            {queries.slice(0, 30).map((q) => (
              <li key={q.id}>
                <strong>{q.query_family}:</strong> {q.query_text} <em>({q.status})</em>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: 16, marginBottom: 10 }}>Collect a source for review</h2>
        <CollectUrlPanel mandateId={mandate.id} />
      </section>

      <section style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: 16, marginBottom: 10 }}>Ranked matches ({matches?.length ?? 0})</h2>
        {!matches || matches.length === 0 ? (
          <p style={{ fontSize: 13, color: "var(--t-mid)" }}>No matches scored yet.</p>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13, marginBottom: 16 }}>
            <thead>
              <tr style={{ textAlign: "left", borderBottom: "1px solid var(--line)" }}>
                <th style={{ padding: "6px 4px" }}>Investor</th>
                <th style={{ padding: "6px 4px" }}>Score</th>
                <th style={{ padding: "6px 4px" }}>Classification</th>
              </tr>
            </thead>
            <tbody>
              {matches.map((m) => (
                <tr key={m.id} style={{ borderBottom: "1px solid var(--line)" }}>
                  <td style={{ padding: "6px 4px" }}>
                    <a href={`/crm/intelligence/investors/organizations/${m.investor_entity_id}`}>
                      {(m.intel_entities as unknown as { name: string } | null)?.name ?? m.investor_entity_id}
                    </a>
                  </td>
                  <td style={{ padding: "6px 4px" }}>{m.total_score}</td>
                  <td style={{ padding: "6px 4px" }}>{m.classification.replace(/_/g, " ")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {unmatchedCandidates.length > 0 && (
          <div>
            <p style={{ fontSize: 12, color: "var(--t-mid)", marginBottom: 8 }}>Candidates not yet scored against this mandate:</p>
            <ul style={{ fontSize: 13, listStyle: "none", padding: 0 }}>
              {unmatchedCandidates.map((c) => (
                <li key={c.entity_id} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                  <span>{(c.intel_entities as unknown as { name: string } | null)?.name ?? c.entity_id}</span>
                  <span style={{ fontSize: 11, color: "var(--t-mid)" }}>({c.investor_universe})</span>
                  <CalculateMatchButton mandateId={mandate.id} investorEntityId={c.entity_id} />
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>
    </div>
  );
}
