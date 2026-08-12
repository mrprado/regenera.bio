import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import PromoteButton from "@/components/investors/PromoteButton";

export default async function OrganizationCandidateDetailPage({ params }: { params: { id: string } }) {
  const supabase = createClient();

  const [{ data: entity }, { data: profile }] = await Promise.all([
    supabase.from("intel_entities").select("id, name, aliases, details, created_at").eq("id", params.id).single(),
    supabase.from("investor_organization_profiles").select("*").eq("entity_id", params.id).single()
  ]);
  if (!entity || !profile) notFound();

  const [{ data: evidence }, { data: matches }] = await Promise.all([
    supabase
      .from("intel_evidence")
      .select("id, claim_text, predicate, raw_value, source_tier, confidence, extracted_at, document_id")
      .eq("entity_id", params.id)
      .order("extracted_at", { ascending: false }),
    supabase.from("investor_project_matches").select("id, mandate_id, total_score, classification, explanation").eq("investor_entity_id", params.id)
  ]);

  return (
    <div>
      <h1 style={{ fontFamily: "var(--serif)", fontSize: 24, marginBottom: 4 }}>{entity.name}</h1>
      <p style={{ fontSize: 12, color: "var(--t-mid)", marginBottom: 20 }}>
        {profile.investor_universe.replace(/_/g, " ")} · Review status: {profile.review_status.replace(/_/g, " ")} · Deployment:{" "}
        {profile.deployment_status.replace(/_/g, " ")}
      </p>

      <div style={{ marginBottom: 24 }}>
        <PromoteButton entityId={entity.id} alreadyPromoted={Boolean(profile.promoted_to_organization_id)} />
      </div>

      <section style={{ marginBottom: 28 }}>
        <h2 style={{ fontSize: 16, marginBottom: 8 }}>Profile</h2>
        <table style={{ fontSize: 13, borderCollapse: "collapse" }}>
          <tbody>
            <Row label="Sectors" value={(profile.sectors ?? []).join(", ")} />
            <Row label="Geographies" value={(profile.geographies ?? []).join(", ")} />
            <Row label="Check size" value={profile.check_min || profile.check_max ? `${profile.currency} ${profile.check_min ?? "?"} – ${profile.check_max ?? "?"}` : "—"} />
            <Row label="Canonical domain" value={profile.canonical_domain} />
            <Row label="Headquarters" value={profile.headquarters} />
            <Row label="Confidence" value={profile.confidence != null ? String(profile.confidence) : "—"} />
            <Row label="Last verified" value={profile.last_verified_at} />
          </tbody>
        </table>
      </section>

      <section style={{ marginBottom: 28 }}>
        <h2 style={{ fontSize: 16, marginBottom: 8 }}>Evidence ({evidence?.length ?? 0})</h2>
        {!evidence || evidence.length === 0 ? (
          <p style={{ fontSize: 13, color: "var(--t-mid)" }}>No evidence recorded yet.</p>
        ) : (
          <ul style={{ fontSize: 13, paddingLeft: 18 }}>
            {evidence.map((e) => (
              <li key={e.id} style={{ marginBottom: 8 }}>
                {e.claim_text}
                <span style={{ fontSize: 11, color: "var(--t-mid)" }}>
                  {" "}
                  — tier {e.source_tier ?? "unclassified"}, confidence {e.confidence ?? "—"}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2 style={{ fontSize: 16, marginBottom: 8 }}>Match scores ({matches?.length ?? 0})</h2>
        {!matches || matches.length === 0 ? (
          <p style={{ fontSize: 13, color: "var(--t-mid)" }}>Not yet scored against any mandate.</p>
        ) : (
          <ul style={{ fontSize: 13, paddingLeft: 18 }}>
            {matches.map((m) => (
              <li key={m.id} style={{ marginBottom: 10 }}>
                <a href={`/crm/intelligence/investors/mandates/${m.mandate_id}`}>Mandate {m.mandate_id}</a>: {m.total_score} ({m.classification.replace(/_/g, " ")})
                <div style={{ fontSize: 12, color: "var(--t-mid)" }}>{m.explanation}</div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string | null | undefined }) {
  return (
    <tr>
      <td style={{ padding: "4px 12px 4px 0", color: "var(--t-mid)", verticalAlign: "top" }}>{label}</td>
      <td style={{ padding: "4px 0" }}>{value || "—"}</td>
    </tr>
  );
}
