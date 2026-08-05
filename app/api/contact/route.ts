import { NextResponse } from "next/server";
import { Resend } from "resend";

export const runtime = "nodejs";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const TYPE_LABELS: Record<string, string> = {
  general: "General",
  investor: "Investor",
  developer: "Project developer",
  realestate: "Real estate or land owner",
  operator: "Municipality or operator",
  partner: "Potential partner",
  media: "Media or research"
};

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Malformed request." }, { status: 400 });
  }

  const name = String(body.name ?? "").trim();
  const org = String(body.org ?? "").trim();
  const email = String(body.email ?? "").trim();
  const type = String(body.type ?? "general").trim();
  const message = String(body.message ?? "").trim();
  const consent = Boolean(body.consent);

  if (!name || !email || !message) {
    return NextResponse.json(
      { ok: false, error: "Please complete your name, email, and a brief context so we know how to help." },
      { status: 400 }
    );
  }
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json(
      { ok: false, error: "That email address does not look complete. Please check it and try again." },
      { status: 400 }
    );
  }
  if (!consent) {
    return NextResponse.json(
      { ok: false, error: "Please confirm the acknowledgement above so we can process your enquiry." },
      { status: 400 }
    );
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL || "info@regenera.bio";
  const from = process.env.CONTACT_FROM_EMAIL;

  if (!apiKey || !from) {
    console.error("Contact form submission received but RESEND_API_KEY or CONTACT_FROM_EMAIL is not configured.");
    return NextResponse.json(
      { ok: false, error: "We could not send your enquiry right now. Please try again shortly or email us directly." },
      { status: 503 }
    );
  }

  try {
    const resend = new Resend(apiKey);
    const typeLabel = TYPE_LABELS[type] ?? type;

    const { error } = await resend.emails.send({
      from,
      to,
      replyTo: email,
      subject: `Regenera enquiry: ${name}${org ? ` (${org})` : ""}`,
      text: [
        `Name: ${name}`,
        org ? `Organisation: ${org}` : null,
        `Email: ${email}`,
        `Type: ${typeLabel}`,
        "",
        "Message:",
        message
      ]
        .filter(Boolean)
        .join("\n")
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json(
        { ok: false, error: "We could not send your enquiry right now. Please try again shortly or email us directly." },
        { status: 502 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Contact form send failed:", err);
    return NextResponse.json(
      { ok: false, error: "We could not send your enquiry right now. Please try again shortly or email us directly." },
      { status: 500 }
    );
  }
}
