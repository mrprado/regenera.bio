import { createClient } from "@/lib/supabase/server";

async function getCounts() {
  const supabase = createClient();
  const [organizations, verified, accredited, matches, review, mandates] = await Promise.all([
    supabase.from("investor_organization_profiles").select("entity_id", { count: "exact", head: true }),
    supabase.from("investor_organization_profiles").select("entity_id", { count: "exact", head: true }).eq("review_status", "verified"),
    supabase.from("investor_person_profiles").select("entity_id", { count: "exact", head: true }).eq("investor_universe", "accredited_individual"),
    supabase.from("investor_project_matches").select("id", { count: "exact", head: true }).eq("classification", "immediate_target"),
    supabase.from("investor_review_tasks").select("id", { count: "exact", head: true }).eq("status", "open"),
    supabase.from("project_investment_mandates").select("id", { count: "exact", head: true }).eq("status", "active")
  ]);

  return {
    organizations: organizations.count ?? 0,
    verified: verified.count ?? 0,
    accredited: accredited.count ?? 0,
    highPriorityMatches: matches.count ?? 0,
    openReview: review.count ?? 0,
    activeMandates: mandates.count ?? 0
  };
}

function StatCard({ value, label }: { value: number; label: string }) {
  return (
    <div className="crm-card">
      <div style={{ fontSize: 32, fontFamily: "var(--serif)" }}>{value}</div>
      <div style={{ fontSize: 12, color: "var(--t-mid)" }}>{label}</div>
    </div>
  );
}

export default async function InvestorIntelligenceOverviewPage() {
  const counts = await getCounts();

  return (
    <div>
      <h1 style={{ fontFamily: "var(--serif)", fontSize: 28, marginBottom: 8 }}>Investor Intelligence</h1>
      <p style={{ fontSize: 14, color: "var(--t-mid)", marginBottom: 32, maxWidth: 640 }}>
        Discovery, evidence, and matching for potential capital sources against Regenera project mandates. Nothing
        here is a confirmed relationship until a candidate is promoted into the CRM by a deliberate review action.
        No outreach is ever sent automatically.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 16, marginBottom: 40 }}>
        <StatCard value={counts.organizations} label="Candidate organizations" />
        <StatCard value={counts.verified} label="Verified investors" />
        <StatCard value={counts.accredited} label="Accredited-individual candidates" />
        <StatCard value={counts.highPriorityMatches} label="Immediate-target matches" />
        <StatCard value={counts.openReview} label="Open review tasks" />
        <StatCard value={counts.activeMandates} label="Active mandates" />
      </div>

      <div style={{ display: "flex", gap: 12 }}>
        <a href="/crm/intelligence/investors/mandates/new" className="btn btn-gold" style={{ fontSize: 13 }}>
          New capital mandate
        </a>
        <a href="/crm/intelligence/investors/organizations" className="btn btn-line" style={{ fontSize: 13 }}>
          Browse candidates
        </a>
        <a href="/crm/intelligence/investors/settings" className="btn btn-line" style={{ fontSize: 13 }}>
          Connector health
        </a>
      </div>
    </div>
  );
}
