"use client";

import { useState } from "react";

export default function SubscribeForm() {
  const [status, setStatus] = useState<{ msg: string; ok: boolean } | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const input = form.elements.namedItem("email") as HTMLInputElement;
    const value = input.value.trim();
    if (!value || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      setStatus({ msg: "Please enter a complete email address.", ok: false });
      return;
    }

    setPending(true);
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: value })
      });
      const data = await res.json().catch(() => null);

      if (!res.ok || !data?.ok) {
        setStatus({
          msg: data?.error || "We could not add you to the list right now. Please try again shortly.",
          ok: false
        });
        setPending(false);
        return;
      }

      setStatus({ msg: "You are on the list. The next letter will find you.", ok: true });
      input.value = "";
      setPending(false);
    } catch {
      setStatus({ msg: "We could not add you to the list right now. Please try again shortly.", ok: false });
      setPending(false);
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit} aria-label="Subscribe">
        <input type="email" name="email" required placeholder="you@firm.com" aria-label="Email address" disabled={pending} />
        <button type="submit" className="btn btn-gold" style={{ padding: "12px 22px" }} disabled={pending}>
          Subscribe
        </button>
      </form>
      {status && (
        <p style={{ marginTop: "0.9rem", fontSize: 13, color: status.ok ? "var(--sage)" : "#8c4a2a" }}>
          {status.msg}
        </p>
      )}
    </div>
  );
}
