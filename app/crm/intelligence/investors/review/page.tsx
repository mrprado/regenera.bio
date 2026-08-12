import { createClient } from "@/lib/supabase/server";
import ReviewTaskActions from "@/components/investors/ReviewTaskActions";

export default async function ReviewQueuePage() {
  const supabase = createClient();
  const { data: tasks } = await supabase
    .from("investor_review_tasks")
    .select("id, task_type, description, created_at, subject_entity_id, intel_entities(name)")
    .eq("status", "open")
    .order("created_at", { ascending: false });

  return (
    <div>
      <h1 style={{ fontFamily: "var(--serif)", fontSize: 24, marginBottom: 20 }}>Review queue</h1>
      <p style={{ fontSize: 13, color: "var(--t-mid)", marginBottom: 24, maxWidth: 560 }}>
        Nothing reaches &quot;approved for contact&quot; or CRM sync without a resolution here. First-contact outreach
        is never automatically approved.
      </p>

      {!tasks || tasks.length === 0 ? (
        <p style={{ fontSize: 14, color: "var(--t-mid)" }}>No open review tasks.</p>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr style={{ textAlign: "left", borderBottom: "1px solid var(--line)" }}>
              <th style={{ padding: "8px 4px" }}>Type</th>
              <th style={{ padding: "8px 4px" }}>Subject</th>
              <th style={{ padding: "8px 4px" }}>Description</th>
              <th style={{ padding: "8px 4px" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((t) => (
              <tr key={t.id} style={{ borderBottom: "1px solid var(--line)" }}>
                <td style={{ padding: "8px 4px" }}>{t.task_type.replace(/_/g, " ")}</td>
                <td style={{ padding: "8px 4px" }}>
                  {t.subject_entity_id ? (
                    <a href={`/crm/intelligence/investors/organizations/${t.subject_entity_id}`}>
                      {(t.intel_entities as unknown as { name: string } | null)?.name ?? t.subject_entity_id}
                    </a>
                  ) : (
                    "—"
                  )}
                </td>
                <td style={{ padding: "8px 4px" }}>{t.description ?? "—"}</td>
                <td style={{ padding: "8px 4px" }}>
                  <ReviewTaskActions taskId={t.id} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
