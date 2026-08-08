"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function CrmLoginPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    setError("");

    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback?next=/crm`,
        // No public signup: only an email that already has a Supabase Auth
        // account (created by an admin) can request a sign-in link.
        shouldCreateUser: false
      }
    });

    if (authError) {
      setStatus("error");
      setError(authError.message);
      return;
    }

    setStatus("sent");
  }

  return (
    <div style={{ maxWidth: 420, margin: "120px auto", padding: "0 24px" }}>
      <h1 style={{ fontFamily: "var(--serif)", fontSize: 28, marginBottom: 8 }}>Regenera CRM</h1>
      <p style={{ fontSize: 14, color: "var(--t-mid)", marginBottom: 32 }}>
        Internal access only. Enter an active staff email to receive a one-time sign-in link.
      </p>

      {status === "sent" ? (
        <p style={{ fontSize: 14 }}>
          Check {email} for a sign-in link. If your email is registered as active staff, it will
          sign you in and return you here.
        </p>
      ) : (
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@regenera.bio"
            style={{
              width: "100%",
              padding: "12px 14px",
              fontSize: 14,
              border: "1px solid var(--line)",
              borderRadius: 4,
              marginBottom: 12
            }}
          />
          <button
            type="submit"
            disabled={status === "sending"}
            className="btn btn-gold"
            style={{ width: "100%" }}
          >
            {status === "sending" ? "Sending..." : "Send sign-in link"}
          </button>
          {status === "error" && (
            <p style={{ fontSize: 13, color: "var(--terra)", marginTop: 10 }}>{error}</p>
          )}
        </form>
      )}
    </div>
  );
}
