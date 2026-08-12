"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { collectUrlForReview, createOrganizationCandidate } from "@/lib/intelligence/investors/actions";
import { ORGANIZATION_INVESTOR_UNIVERSES, type OrganizationInvestorUniverse } from "@/lib/intelligence/investors/types";

const inputStyle: React.CSSProperties = { width: "100%", padding: "8px 10px", fontSize: 13, border: "1px solid var(--line)", borderRadius: 4, marginBottom: 10 };

interface Collected {
  documentId: string;
  sourceUrl: string;
  textPreview: string;
}

export default function CollectUrlPanel({ mandateId }: { mandateId: string }) {
  const router = useRouter();
  const [url, setUrl] = useState("");
  const [fetchStatus, setFetchStatus] = useState<"idle" | "fetching" | "error">("idle");
  const [fetchError, setFetchError] = useState("");
  const [collected, setCollected] = useState<Collected | null>(null);

  const [name, setName] = useState("");
  const [universe, setUniverse] = useState<OrganizationInvestorUniverse>("infrastructure_fund");
  const [sectors, setSectors] = useState("");
  const [geographies, setGeographies] = useState("");
  const [createStatus, setCreateStatus] = useState<"idle" | "saving" | "done" | "error">("idle");
  const [createError, setCreateError] = useState("");

  async function handleFetch(e: React.FormEvent) {
    e.preventDefault();
    setFetchStatus("fetching");
    setFetchError("");
    try {
      const result = await collectUrlForReview(url, mandateId);
      setCollected({ documentId: result.documentId, sourceUrl: url, textPreview: result.textPreview });
      setFetchStatus("idle");
    } catch (err) {
      setFetchStatus("error");
      setFetchError(err instanceof Error ? err.message : "Failed to fetch URL.");
    }
  }

  async function handleCreateCandidate(e: React.FormEvent) {
    e.preventDefault();
    if (!collected) return;
    setCreateStatus("saving");
    setCreateError("");
    try {
      await createOrganizationCandidate({
        name,
        investorUniverse: universe,
        sectors: sectors.split(",").map((s) => s.trim()).filter(Boolean),
        geographies: geographies.split(",").map((s) => s.trim()).filter(Boolean),
        sourceDocumentId: collected.documentId,
        sourceUrl: collected.sourceUrl
      });
      setCreateStatus("done");
      router.refresh();
    } catch (err) {
      setCreateStatus("error");
      setCreateError(err instanceof Error ? err.message : "Failed to create candidate.");
    }
  }

  return (
    <div style={{ border: "1px solid var(--line)", borderRadius: 4, padding: 16, maxWidth: 560 }}>
      <p style={{ fontSize: 12, color: "var(--t-mid)", marginBottom: 10 }}>
        Paste a URL (a fund&apos;s team page, a press release, a conference bio). It is fetched through the existing
        collector, hashed, and stored. You then confirm the organization name and classification before any investor
        record is created.
      </p>

      <form onSubmit={handleFetch} style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        <input style={{ ...inputStyle, marginBottom: 0, flex: 1 }} required type="url" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://example-fund.com/team" />
        <button type="submit" className="btn btn-line" disabled={fetchStatus === "fetching"} style={{ fontSize: 13, whiteSpace: "nowrap" }}>
          {fetchStatus === "fetching" ? "Fetching..." : "Fetch"}
        </button>
      </form>
      {fetchStatus === "error" && <p style={{ fontSize: 12, color: "var(--terra)", marginBottom: 10 }}>{fetchError}</p>}

      {collected && (
        <div>
          <div style={{ background: "var(--parchment, #faf8f3)", border: "1px solid var(--line)", borderRadius: 4, padding: 10, fontSize: 12, maxHeight: 160, overflowY: "auto", marginBottom: 14, whiteSpace: "pre-wrap" }}>
            {collected.textPreview || "(No text captured -- the page may be JS-rendered. Consider the Jina Reader provider once wired to this panel, or paste the org name manually below anyway.)"}
          </div>

          {createStatus === "done" ? (
            <p style={{ fontSize: 13 }}>Candidate created, status &quot;discovered&quot;. Review it from the Organizations list.</p>
          ) : (
            <form onSubmit={handleCreateCandidate}>
              <input style={inputStyle} required value={name} onChange={(e) => setName(e.target.value)} placeholder="Organization name" />
              <select style={inputStyle} value={universe} onChange={(e) => setUniverse(e.target.value as OrganizationInvestorUniverse)}>
                {ORGANIZATION_INVESTOR_UNIVERSES.map((u) => (
                  <option key={u} value={u}>
                    {u.replace(/_/g, " ")}
                  </option>
                ))}
              </select>
              <input style={inputStyle} value={sectors} onChange={(e) => setSectors(e.target.value)} placeholder="Sectors (comma-separated)" />
              <input style={inputStyle} value={geographies} onChange={(e) => setGeographies(e.target.value)} placeholder="Geographies (comma-separated)" />
              <button type="submit" className="btn btn-gold" disabled={createStatus === "saving"} style={{ fontSize: 13 }}>
                {createStatus === "saving" ? "Creating..." : "Create candidate"}
              </button>
              {createStatus === "error" && <p style={{ fontSize: 12, color: "var(--terra)", marginTop: 8 }}>{createError}</p>}
            </form>
          )}
        </div>
      )}
    </div>
  );
}
