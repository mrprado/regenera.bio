"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { resolveReviewTask } from "@/lib/intelligence/investors/actions";

export default function ReviewTaskActions({ taskId }: { taskId: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function resolve(status: "approved" | "rejected" | "dismissed") {
    setBusy(true);
    try {
      await resolveReviewTask(taskId, status);
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  return (
    <div style={{ display: "flex", gap: 6 }}>
      <button onClick={() => resolve("approved")} disabled={busy} className="btn btn-gold" style={{ fontSize: 11, padding: "3px 8px" }}>
        Approve
      </button>
      <button onClick={() => resolve("rejected")} disabled={busy} className="btn btn-line" style={{ fontSize: 11, padding: "3px 8px" }}>
        Reject
      </button>
      <button onClick={() => resolve("dismissed")} disabled={busy} className="btn btn-line" style={{ fontSize: 11, padding: "3px 8px" }}>
        Dismiss
      </button>
    </div>
  );
}
