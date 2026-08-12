import { createClient } from "@/lib/supabase/server";

export default async function MandatesListPage() {
  const supabase = createClient();
  const { data: mandates } = await supabase
    .from("project_investment_mandates")
    .select("id, name, sectors, geographies, status, created_at")
    .order("created_at", { ascending: false });

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 24 }}>
        <h1 style={{ fontFamily: "var(--serif)", fontSize: 24 }}>Capital mandates</h1>
        <a href="/crm/intelligence/investors/mandates/new" className="btn btn-gold" style={{ fontSize: 13 }}>
          New mandate
        </a>
      </div>

      {!mandates || mandates.length === 0 ? (
        <p style={{ fontSize: 14, color: "var(--t-mid)" }}>No mandates yet. Create one from an existing project to start investor discovery.</p>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr style={{ textAlign: "left", borderBottom: "1px solid var(--line)" }}>
              <th style={{ padding: "8px 4px" }}>Name</th>
              <th style={{ padding: "8px 4px" }}>Sectors</th>
              <th style={{ padding: "8px 4px" }}>Geographies</th>
              <th style={{ padding: "8px 4px" }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {mandates.map((m) => (
              <tr key={m.id} style={{ borderBottom: "1px solid var(--line)" }}>
                <td style={{ padding: "8px 4px" }}>
                  <a href={`/crm/intelligence/investors/mandates/${m.id}`}>{m.name}</a>
                </td>
                <td style={{ padding: "8px 4px" }}>{(m.sectors ?? []).join(", ") || "—"}</td>
                <td style={{ padding: "8px 4px" }}>{(m.geographies ?? []).join(", ") || "—"}</td>
                <td style={{ padding: "8px 4px" }}>{m.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
