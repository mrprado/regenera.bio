import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { ingestSegmentedLead } from "@/lib/crm/ingest";
import { sendNotificationEmail } from "@/lib/notify";
import { INTAKE_CONFIGS, type IntakeType } from "@/lib/intakeFields";

export const runtime = "nodejs";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const INTAKE_TYPES = ["developer", "investor", "landowner", "operator"] as const;

const INTAKE_TYPE_LABELS: Record<IntakeType, string> = {
  developer: "Developer",
  investor: "Investor",
  landowner: "Landowner",
  operator: "Operator"
};

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Malformed request." }, { status: 400 });
  }

  // Honeypot: real submitters never fill this hidden field in. Silently
  // report success so a bot doesn't learn to look elsewhere.
  if (String(body.website ?? "").trim()) {
    return NextResponse.json({ ok: true });
  }

  const intakeType = String(body.intake_type ?? "").trim();
  const name = String(body.name ?? "").trim();
  const email = String(body.email ?? "").trim();
  const org = typeof body.org === "string" ? body.org.trim() || null : null;
  const phone = typeof body.phone === "string" ? body.phone.trim() || null : null;
  const message = typeof body.message === "string" ? body.message.trim() || null : null;
  const consent = Boolean(body.consent);
  const fields = body.fields && typeof body.fields === "object" ? (body.fields as Record<string, string>) : {};
  const pagePath = typeof body.page_path === "string" ? body.page_path.slice(0, 200) : null;
  const referrer = typeof body.referrer === "string" ? body.referrer.slice(0, 500) : null;
  const utmSource = typeof body.utm_source === "string" ? body.utm_source.slice(0, 200) : null;
  const utmMedium = typeof body.utm_medium === "string" ? body.utm_medium.slice(0, 200) : null;
  const utmCampaign = typeof body.utm_campaign === "string" ? body.utm_campaign.slice(0, 200) : null;
  const service = typeof body.service === "string" ? body.service.trim() || null : null;

  if (!(INTAKE_TYPES as readonly string[]).includes(intakeType)) {
    return NextResponse.json({ ok: false, error: "Unrecognized submission type." }, { status: 400 });
  }
  if (!name || !email) {
    return NextResponse.json(
      { ok: false, error: "Please complete your name and email." },
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
      { ok: false, error: "Please confirm the acknowledgement above so we can process your submission." },
      { status: 400 }
    );
  }

  const supabase = createClient();
  const { error } = await supabase.from("segmented_intake").insert({
    intake_type: intakeType,
    name,
    email,
    org,
    phone,
    fields,
    message,
    consent,
    page_path: pagePath,
    referrer,
    utm_source: utmSource,
    utm_medium: utmMedium,
    utm_campaign: utmCampaign
  });

  if (error) {
    console.error("Supabase segmented_intake insert failed:", error);
    return NextResponse.json(
      { ok: false, error: "We couldn't save your submission. Please try again or contact info@regenera.bio." },
      { status: 500 }
    );
  }

  await ingestSegmentedLead({
    intakeType: intakeType as "developer" | "investor" | "landowner" | "operator",
    name,
    email,
    org,
    phone,
    fields,
    message,
    utmSource,
    utmMedium,
    utmCampaign,
    pagePath,
    referrer,
    service
  });

  const typeLabel = INTAKE_TYPE_LABELS[intakeType as IntakeType];
  const config = INTAKE_CONFIGS[intakeType as IntakeType];
  const fieldLines = config.fields
    .filter((f) => fields[f.name])
    .map((f) => {
      const raw = fields[f.name];
      const optionLabel = f.options?.find((o) => o.value === raw)?.label;
      return `${f.label}: ${optionLabel ?? raw}`;
    });

  await sendNotificationEmail(
    `Regenera ${typeLabel.toLowerCase()} submission: ${name}${org ? ` (${org})` : ""}`,
    [
      `Name: ${name}`,
      org ? `Organisation: ${org}` : null,
      `Email: ${email}`,
      phone ? `Phone: ${phone}` : null,
      `Type: ${typeLabel}`,
      "",
      ...fieldLines,
      message ? `\n${config.messageLabel}:\n${message}` : null
    ]
      .filter(Boolean)
      .join("\n")
      .trim(),
    email
  );

  return NextResponse.json({ ok: true });
}
