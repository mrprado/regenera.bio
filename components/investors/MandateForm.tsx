"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createMandate } from "@/lib/intelligence/investors/actions";

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "10px 12px",
  fontSize: 14,
  border: "1px solid var(--line)",
  borderRadius: 4,
  marginBottom: 14
};
const labelStyle: React.CSSProperties = { fontSize: 12, color: "var(--t-mid)", display: "block", marginBottom: 4 };

function csv(value: string): string[] {
  return value
    .split(",")
    .map((v) => v.trim())
    .filter(Boolean);
}

export default function MandateForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [sectors, setSectors] = useState("");
  const [geographies, setGeographies] = useState("");
  const [projectStage, setProjectStage] = useState("");
  const [capitalTypes, setCapitalTypes] = useState("");
  const [checkMin, setCheckMin] = useState("");
  const [checkMax, setCheckMax] = useState("");
  const [status, setStatus] = useState<"idle" | "saving" | "error">("idle");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("saving");
    setError("");
    try {
      const { id } = await createMandate({
        name,
        sectors: csv(sectors),
        geographies: csv(geographies),
        projectStage: projectStage || null,
        capitalTypes: csv(capitalTypes),
        investmentStructures: [],
        preferredCheckMin: checkMin ? Number(checkMin) : null,
        preferredCheckMax: checkMax ? Number(checkMax) : null,
        currency: "USD",
        impactThemes: [],
        regenerativeFunctions: []
      });
      router.push(`/crm/intelligence/investors/mandates/${id}`);
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Failed to create mandate.");
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 480 }}>
      <label style={labelStyle}>Mandate name</label>
      <input style={inputStyle} required value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Waste-to-energy Phase II raise" />

      <label style={labelStyle}>Sectors (comma-separated)</label>
      <input style={inputStyle} value={sectors} onChange={(e) => setSectors(e.target.value)} placeholder="waste-to-energy, circular materials" />

      <label style={labelStyle}>Geographies (comma-separated)</label>
      <input style={inputStyle} value={geographies} onChange={(e) => setGeographies(e.target.value)} placeholder="Mexico, Latin America" />

      <label style={labelStyle}>Project stage</label>
      <input style={inputStyle} value={projectStage} onChange={(e) => setProjectStage(e.target.value)} placeholder="development, construction, operating" />

      <label style={labelStyle}>Capital types (comma-separated)</label>
      <input style={inputStyle} value={capitalTypes} onChange={(e) => setCapitalTypes(e.target.value)} placeholder="equity, debt, blended" />

      <div style={{ display: "flex", gap: 12 }}>
        <div style={{ flex: 1 }}>
          <label style={labelStyle}>Preferred check min (USD)</label>
          <input style={inputStyle} type="number" value={checkMin} onChange={(e) => setCheckMin(e.target.value)} />
        </div>
        <div style={{ flex: 1 }}>
          <label style={labelStyle}>Preferred check max (USD)</label>
          <input style={inputStyle} type="number" value={checkMax} onChange={(e) => setCheckMax(e.target.value)} />
        </div>
      </div>

      <button type="submit" className="btn btn-gold" disabled={status === "saving"}>
        {status === "saving" ? "Creating..." : "Create mandate"}
      </button>
      {status === "error" && (
        <p style={{ fontSize: 13, color: "var(--terra)", marginTop: 10 }}>{error}</p>
      )}
    </form>
  );
}
