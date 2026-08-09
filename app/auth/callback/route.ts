import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

// Exchanges a Supabase Auth magic-link code for a session cookie, then
// redirects on. Currently only used by the CRM's staff-only login
// (app/crm/login), since that's the only auth flow this site has.
//
// Diagnostic category D (redirect/callback error) lives here: if the code
// exchange fails (expired link, already used, or opened in a different
// browser than the one that requested it, since PKCE's verifier is stored
// in a cookie on the requesting browser), send the visitor back to
// /crm/login with a reason instead of silently redirecting to `next` with
// no session.
export async function GET(req: Request) {
  const { searchParams, origin } = new URL(req.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/";

  if (!code) {
    console.error("[crm-auth] callback hit with no code param", { url: req.url });
    return NextResponse.redirect(`${origin}/crm/login?error=callback_failed`);
  }

  const supabase = createClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    console.error("[crm-auth] exchangeCodeForSession failed", {
      message: error.message,
      status: error.status,
      code: (error as { code?: string }).code ?? null,
      name: error.name
    });
    return NextResponse.redirect(`${origin}/crm/login?error=callback_failed`);
  }

  console.info("[crm-auth] session established via callback");
  return NextResponse.redirect(`${origin}${next}`);
}
