import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { ingestLead } from "@/lib/crm/ingest";
import { sendNotificationEmail } from "@/lib/notify";

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
  // Which Services practice (see lib/practices.ts) the visitor's CTA came
  // from, if any. Not stored on contact_submissions, only threaded into
  // the CRM opportunity below.
  const service = typeof body.service === "string" ? body.service.trim() || null : null;

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

  // Supabase is the source of truth for every enquiry. Email notification
  // below is a best-effort convenience on top of it, not a requirement for
  // success: a submission that's safely stored but fails to email out is a
  // fixable ops problem, not a lost enquiry.
  const supabase = createClient();
  const { error: dbError } = await supabase.from("contact_submissions").insert({
    name,
    org: org || null,
    email,
    type,
    message,
    consent
  });

  if (dbError) {
    console.error("Supabase contact insert failed:", dbError);
    return NextResponse.json(
      { ok: false, error: "We could not send your enquiry right now. Please try again shortly or email us directly." },
      { status: 500 }
    );
  }

  // Best-effort, one-way ingestion into the internal CRM. Never fails the
  // enquiry itself (errors are caught inside ingestLead); awaited so it
  // completes before this serverless invocation ends.
  await ingestLead({
    source: "contact_form",
    name,
    email,
    organization: org || null,
    message,
    clientType: type,
    service
  });

  const typeLabel = TYPE_LABELS[type] ?? type;
  await sendNotificationEmail(
    `Regenera enquiry: ${name}${org ? ` (${org})` : ""}`,
    [`Name: ${name}`, org ? `Organisation: ${org}` : null, `Email: ${email}`, `Type: ${typeLabel}`, "", "Message:", message]
      .filter(Boolean)
      .join("\n"),
    email
  );

  return NextResponse.json({ ok: true });
}
