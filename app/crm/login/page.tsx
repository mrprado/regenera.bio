"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";

const CALLBACK_ERROR_MESSAGES: Record<string, string> = {
  callback_failed: "The sign-in link could not be verified (category D: redirect/callback error). It may have expired, already been used, or been opened in a different browser than the one that requested it.",
  not_authorized: "That account is not registered as active staff (category E: authorization error)."
};

function LoginForm() {
  const searchParams = useSearchParams();
  const callbackError = searchParams.get("error");

  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState("");
  const [category, setCategory] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    setError("");
    setCategory(null);

    try {
      const res = await fetch("/api/crm/request-magic-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() })
      });
      const data = await res.json().catch(() => null);

      if (!res.ok || !data?.ok) {
        setStatus("error");
        setCategory(data?.category ?? "app_error");
        setError(data?.error || "Something went wrong sending the sign-in link.");
        return;
      }

      setStatus("sent");
    } catch {
      // fetch itself threw: network/app-level failure, category A, never
      // reached the server route at all.
      setStatus("error");
      setCategory("app_error");
      setError("Could not reach the server. Check your connection and try again.");
    }
  }

  return (
    <div style={{ maxWidth: 420, margin: "120px auto", padding: "0 24px" }}>
      <h1 style={{ fontFamily: "var(--serif)", fontSize: 28, marginBottom: 8 }}>Regenera CRM</h1>
      <p style={{ fontSize: 14, color: "var(--t-mid)", marginBottom: 32 }}>
        Internal access only. Enter an active staff email to receive a one-time sign-in link.
      </p>

      {callbackError && CALLBACK_ERROR_MESSAGES[callbackError] && (
        <p style={{ fontSize: 13, color: "var(--terra)", marginBottom: 20 }}>
          {CALLBACK_ERROR_MESSAGES[callbackError]}
        </p>
      )}

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
            <div style={{ marginTop: 10 }}>
              <p style={{ fontSize: 13, color: "var(--terra)" }}>{error}</p>
              {category && (
                <p style={{ fontSize: 11.5, color: "var(--t-mid)", marginTop: 4 }}>
                  Diagnostic category:{" "}
                  {category === "smtp_error"
                    ? "C, SMTP authentication error (Supabase → email provider). Check custom SMTP credentials in the Supabase dashboard, this is not an app bug."
                    : category === "auth_api_error"
                    ? "B, Supabase Auth API error."
                    : "A, browser/app error."}
                </p>
              )}
            </div>
          )}
        </form>
      )}
    </div>
  );
}

export default function CrmLoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
