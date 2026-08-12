import { redirect } from "next/navigation";
import { checkStaffAccess } from "@/lib/crm/staff";
import { createClient } from "@/lib/supabase/server";
import SignOutButton from "./SignOutButton";

async function getCounts() {
  const supabase = createClient();
  const [organizations, contacts, opportunities, tasks] = await Promise.all([
    supabase.from("organizations").select("id", { count: "exact", head: true }),
    supabase.from("contacts").select("id", { count: "exact", head: true }),
    supabase.from("opportunities").select("id", { count: "exact", head: true }).is("archived_at", null),
    supabase.from("tasks").select("id", { count: "exact", head: true }).eq("status", "open")
  ]);

  return {
    organizations: organizations.count ?? 0,
    contacts: contacts.count ?? 0,
    opportunities: opportunities.count ?? 0,
    openTasks: tasks.count ?? 0
  };
}

async function getRecentOpportunities() {
  const supabase = createClient();
  const { data } = await supabase
    .from("opportunities")
    .select("id, opportunity_name, stage, source, created_at")
    .order("created_at", { ascending: false })
    .limit(10);
  return data ?? [];
}

export default async function CrmDashboardPage() {
  const access = await checkStaffAccess();
  if (access.state === "no_session") {
    redirect("/crm/login");
  }
  if (access.state === "not_authorized") {
    // Category E: a real Supabase Auth session exists (the magic link
    // worked), but there's no matching active `staff` row for it.
    redirect("/crm/login?error=not_authorized");
  }
  const staff = access.staff;

  const [counts, recent] = await Promise.all([getCounts(), getRecentOpportunities()]);

  return (
    <div style={{ maxWidth: 960, margin: "0 auto", padding: "48px 24px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 32 }}>
        <div>
          <h1 style={{ fontFamily: "var(--serif)", fontSize: 28 }}>Regenera CRM</h1>
          <p style={{ fontSize: 13, color: "var(--t-mid)" }}>
            Signed in as {staff.email ?? staff.id} ({staff.role})
          </p>
        </div>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <a href="/crm/intelligence/investors" className="btn btn-line" style={{ fontSize: 13 }}>
            Investor Intelligence
          </a>
          <SignOutButton />
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
          gap: 16,
          marginBottom: 40
        }}
      >
        <div className="crm-card">
          <div style={{ fontSize: 32, fontFamily: "var(--serif)" }}>{counts.organizations}</div>
          <div style={{ fontSize: 12, color: "var(--t-mid)" }}>Organizations</div>
        </div>
        <div className="crm-card">
          <div style={{ fontSize: 32, fontFamily: "var(--serif)" }}>{counts.contacts}</div>
          <div style={{ fontSize: 12, color: "var(--t-mid)" }}>Contacts</div>
        </div>
        <div className="crm-card">
          <div style={{ fontSize: 32, fontFamily: "var(--serif)" }}>{counts.opportunities}</div>
          <div style={{ fontSize: 12, color: "var(--t-mid)" }}>Active opportunities</div>
        </div>
        <div className="crm-card">
          <div style={{ fontSize: 32, fontFamily: "var(--serif)" }}>{counts.openTasks}</div>
          <div style={{ fontSize: 12, color: "var(--t-mid)" }}>Open tasks</div>
        </div>
      </div>

      <h2 style={{ fontFamily: "var(--serif)", fontSize: 20, marginBottom: 16 }}>Recent opportunities</h2>
      {recent.length === 0 ? (
        <p style={{ fontSize: 14, color: "var(--t-mid)" }}>
          No opportunities yet. New contact and lead form submissions from the public site are
          ingested here automatically.
        </p>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr style={{ textAlign: "left", borderBottom: "1px solid var(--line)" }}>
              <th style={{ padding: "8px 4px" }}>Name</th>
              <th style={{ padding: "8px 4px" }}>Stage</th>
              <th style={{ padding: "8px 4px" }}>Source</th>
              <th style={{ padding: "8px 4px" }}>Created</th>
            </tr>
          </thead>
          <tbody>
            {recent.map((o) => (
              <tr key={o.id} style={{ borderBottom: "1px solid var(--line)" }}>
                <td style={{ padding: "8px 4px" }}>{o.opportunity_name}</td>
                <td style={{ padding: "8px 4px" }}>{o.stage}</td>
                <td style={{ padding: "8px 4px" }}>{o.source ?? "None"}</td>
                <td style={{ padding: "8px 4px" }}>
                  {o.created_at ? new Date(o.created_at).toLocaleDateString() : "None"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
