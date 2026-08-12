import { createClient } from "@/lib/supabase/server";

export default async function OrganizationCandidatesPage() {
  const supabase = createClient();
  const { data: candidates } = await supabase
    .from("investor_organization_profiles")
    .select("entity_id, investor_universe, review_status, deployment_status, confidence, promoted_to_organization_id, intel_entities(name)")
    .order("entity_id", { ascending: false })
    .limit(200);

  return (
    <div>
      <h1 style={{ fontFamily: "var(--serif)", fontSize: 24, marginBottom: 20 }}>Organization candidates</h1>

      {!candidates || candidates.length === 0 ? (
        <p style={{ fontSize: 14, color: "var(--t-mid)" }}>
          No candidates yet. Collect a source from a mandate&apos;s detail page to create the first one.
        </p>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr style={{ textAlign: "left", borderBottom: "1px solid var(--line)" }}>
              <th style={{ padding: "8px 4px" }}>Name</th>
              <th style={{ padding: "8px 4px" }}>Universe</th>
              <th style={{ padding: "8px 4px" }}>Review status</th>
              <th style={{ padding: "8px 4px" }}>Deployment</th>
              <th style={{ padding: "8px 4px" }}>Confidence</th>
              <th style={{ padding: "8px 4px" }}>CRM</th>
            </tr>
          </thead>
          <tbody>
            {candidates.map((c) => (
              <tr key={c.entity_id} style={{ borderBottom: "1px solid var(--line)" }}>
                <td style={{ padding: "8px 4px" }}>
                  <a href={`/crm/intelligence/investors/organizations/${c.entity_id}`}>
                    {(c.intel_entities as unknown as { name: string } | null)?.name ?? c.entity_id}
                  </a>
                </td>
                <td style={{ padding: "8px 4px" }}>{c.investor_universe.replace(/_/g, " ")}</td>
                <td style={{ padding: "8px 4px" }}>{c.review_status.replace(/_/g, " ")}</td>
                <td style={{ padding: "8px 4px" }}>{c.deployment_status.replace(/_/g, " ")}</td>
                <td style={{ padding: "8px 4px" }}>{c.confidence ?? "—"}</td>
                <td style={{ padding: "8px 4px" }}>{c.promoted_to_organization_id ? "Promoted" : "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
