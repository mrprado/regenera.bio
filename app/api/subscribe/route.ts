import { NextResponse } from "next/server";

export const runtime = "nodejs";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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

  const apiKey = process.env.BUTTONDOWN_API_KEY;

  if (!apiKey) {
    console.error("Subscribe request received but BUTTONDOWN_API_KEY is not configured.");
    return NextResponse.json(
      { ok: false, error: "We could not add you to the list right now. Please try again shortly." },
      { status: 503 }
    );
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

    // Buttondown returns 201 for a new subscriber and 400 for an email already
    // on the list, which we treat as a success from the visitor's perspective.
    if (res.ok || res.status === 400) {
      return NextResponse.json({ ok: true });
    }

    const detail = await res.text();
    console.error("Buttondown error:", res.status, detail);
    return NextResponse.json(
      { ok: false, error: "We could not add you to the list right now. Please try again shortly." },
      { status: 502 }
    );
  } catch (err) {
    console.error("Subscribe request failed:", err);
    return NextResponse.json(
      { ok: false, error: "We could not add you to the list right now. Please try again shortly." },
      { status: 500 }
    );
  }
}
