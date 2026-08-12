import { getConnectorHealth } from "@/lib/intelligence/investors/actions";

const STATUS_COLOR: Record<string, string> = {
  ok: "var(--water, #2c6e5f)",
  not_configured: "var(--t-mid)",
  rate_limited: "var(--gold)",
  auth_failed: "var(--terra)",
  access_challenge: "var(--terra)",
  error: "var(--terra)"
};

export default async function ConnectorSettingsPage() {
  const health = await getConnectorHealth();

  return (
    <div>
      <h1 style={{ fontFamily: "var(--serif)", fontSize: 24, marginBottom: 8 }}>Connector health</h1>
      <p style={{ fontSize: 13, color: "var(--t-mid)", marginBottom: 24, maxWidth: 600 }}>
        Live status, checked on page load. A connector reporting &quot;not configured&quot; degrades gracefully:
        every other connector and the manual-URL path keep working. This application never installs Agent Reach or
        any LinkedIn integration on its own -- setup instructions below are exactly what to run yourself.
      </p>

      <div style={{ display: "grid", gap: 12 }}>
        {health.map((h) => (
          <div key={h.providerId} className="crm-card" style={{ textAlign: "left" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <strong style={{ fontSize: 14 }}>{h.providerId}</strong>
              <span style={{ fontSize: 12, color: STATUS_COLOR[h.status] ?? "var(--t-mid)" }}>{h.status.replace(/_/g, " ")}</span>
            </div>
            <p style={{ fontSize: 12, color: "var(--t-mid)", marginTop: 6 }}>{h.message}</p>
            {h.setupInstructions && <p style={{ fontSize: 11.5, color: "var(--t-mid)", marginTop: 6, whiteSpace: "pre-wrap" }}>{h.setupInstructions}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}
