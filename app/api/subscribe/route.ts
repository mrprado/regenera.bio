import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Postgres unique_violation
const UNIQUE_VIOLATION = "23505";

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Malformed request." }, { status: 400 });
  }

  const email = String(body.email ?? "").trim();

  if (!email || !EMAIL_RE.test(email)) {
    return NextResponse.json({ ok: false, error: "Please enter a complete email address." }, { status: 400 });
  }

  // Supabase is the source of truth for the subscriber list. Buttondown
  // below is a best-effort convenience on top of it, not a requirement for
  // success.
  const supabase = createClient();
  const { error: dbError } = await supabase.from("subscribers").insert({ email });

  if (dbError && dbError.code !== UNIQUE_VIOLATION) {
    console.error("Supabase subscribe insert failed:", dbError);
    return NextResponse.json(
      { ok: false, error: "We could not add you to the list right now. Please try again shortly." },
      { status: 500 }
    );
  }

  const apiKey = process.env.BUTTONDOWN_API_KEY;

  if (!apiKey) {
    console.error("Subscriber stored, but BUTTONDOWN_API_KEY is not configured, so Buttondown was not updated.");
    return NextResponse.json({ ok: true });
  }

  try {
    const res = await fetch("https://api.buttondown.email/v1/subscribers", {
      method: "POST",
      headers: {
        Authorization: `Token ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email })
    });

    // Buttondown returns 201 for a new subscriber and 400 for an email
    // already on the list; either is fine since Supabase already has it.
    if (!res.ok && res.status !== 400) {
      const detail = await res.text();
      console.error("Buttondown error (subscriber was still stored):", res.status, detail);
    }
  } catch (err) {
    console.error("Buttondown request failed (subscriber was still stored):", err);
  }

  return NextResponse.json({ ok: true });
}
