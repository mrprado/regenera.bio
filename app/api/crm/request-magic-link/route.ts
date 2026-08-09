import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Diagnostic categories for the CRM login flow, see AUTH_DIAGNOSTIC.md.
// "B" (Supabase Auth API error) and "C" (SMTP error) both surface here as
// the same underlying signInWithOtp() failure, distinguished heuristically
// by message content, since Supabase does not return a structured SMTP
// error code, only a generic message plus a numeric status.
type DiagnosticCategory = "app_error" | "auth_api_error" | "smtp_error";

function categorize(message: string, status: number | undefined): DiagnosticCategory {
  const m = message.toLowerCase();
  if (m.includes("sending") && m.includes("email")) return "smtp_error";
  if (status && status >= 500) return "smtp_error";
  return "auth_api_error";
}

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, category: "app_error", error: "Malformed request." }, { status: 400 });
  }

  const email = String(body.email ?? "").trim();
  if (!email || !EMAIL_RE.test(email)) {
    return NextResponse.json(
      { ok: false, category: "app_error", error: "Enter a complete email address." },
      { status: 400 }
    );
  }

  const origin = new URL(req.url).origin;
  const supabase = createClient();

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${origin}/auth/callback?next=/crm`,
      // No public signup: only an email that already has a Supabase Auth
      // account (created by an admin) can request a sign-in link.
      shouldCreateUser: false
    }
  });

  if (error) {
    const category = categorize(error.message, error.status);
    // Full structured error, server-side only (Netlify function logs / this
    // process's stdout), never sent to the browser. This is the detail
    // task 7 asked for: message, status, code, name, all in one place.
    console.error("[crm-auth] signInWithOtp failed", {
      category,
      message: error.message,
      status: error.status,
      code: (error as { code?: string }).code ?? null,
      name: error.name,
      email
    });

    return NextResponse.json(
      {
        ok: false,
        category,
        // Supabase's own error.message is already the user-facing string it
        // shows by design (it never embeds SMTP credentials or secrets in
        // it), so passing it through here doesn't expose anything new.
        error: error.message
      },
      { status: error.status ?? 500 }
    );
  }

  console.info("[crm-auth] signInWithOtp requested", { email });
  return NextResponse.json({ ok: true });
}
