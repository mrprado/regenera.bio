"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { promoteOrganizationToCrm } from "@/lib/intelligence/investors/actions";

export default function PromoteButton({ entityId, alreadyPromoted }: { entityId: string; alreadyPromoted: boolean }) {
  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "running" | "error">("idle");

  if (alreadyPromoted) {
    return <span style={{ fontSize: 12, color: "var(--t-mid)" }}>Already in CRM</span>;
  }

  async function handleClick() {
    setStatus("running");
    try {
      await promoteOrganizationToCrm(entityId);
      setStatus("idle");
      router.refresh();
    } catch {
      setStatus("error");
    }
  }

  return (
    <button onClick={handleClick} className="btn btn-gold" disabled={status === "running"} style={{ fontSize: 12, padding: "4px 10px" }}>
      {status === "running" ? "Promoting..." : status === "error" ? "Retry" : "Approve for CRM"}
    </button>
  );
}
