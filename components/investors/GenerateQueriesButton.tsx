"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { generateAndStoreQueries } from "@/lib/intelligence/investors/actions";

export default function GenerateQueriesButton({ mandateId }: { mandateId: string }) {
  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "running" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleClick() {
    setStatus("running");
    try {
      const { count } = await generateAndStoreQueries(mandateId);
      setMessage(`Generated ${count} queries across 7 families.`);
      setStatus("idle");
      router.refresh();
    } catch (err) {
      setStatus("error");
      setMessage(err instanceof Error ? err.message : "Failed to generate queries.");
    }
  }

  return (
    <div>
      <button onClick={handleClick} className="btn btn-line" disabled={status === "running"} style={{ fontSize: 13 }}>
        {status === "running" ? "Generating..." : "Generate discovery queries"}
      </button>
      {message && <p style={{ fontSize: 12, color: status === "error" ? "var(--terra)" : "var(--t-mid)", marginTop: 6 }}>{message}</p>}
    </div>
  );
}
