"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { calculateProjectMatch } from "@/lib/intelligence/investors/actions";

export default function CalculateMatchButton({ mandateId, investorEntityId }: { mandateId: string; investorEntityId: string }) {
  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "running" | "error">("idle");

  async function handleClick() {
    setStatus("running");
    try {
      await calculateProjectMatch(mandateId, investorEntityId);
      setStatus("idle");
      router.refresh();
    } catch {
      setStatus("error");
    }
  }

  return (
    <button onClick={handleClick} className="btn btn-line" disabled={status === "running"} style={{ fontSize: 12, padding: "4px 10px" }}>
      {status === "running" ? "Scoring..." : status === "error" ? "Retry score" : "Score match"}
    </button>
  );
}
