import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { ingestLead } from "@/lib/crm/ingest";

export const runtime = "nodejs";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const CLIENT_TYPES = ["investor_family_office", "developer_sponsor", "landowner", "strategic_partner", "public_sector", "other"] as const;

const INTERESTS = ["investment_opportunities", "raising_capital", "advisory_services", "project_development", "partnerships"] as const;

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Malformed request." }, { status: 400 });
  }

  const email = String(body.email ?? "").trim();
  const clientType = String(body.client_type ?? "").trim();
  const interests = Array.isArray(body.interests)
    ? body.interests.filter((i): i is string => typeof i === "string" && (INTERESTS as readonly string[]).includes(i))
    : [];
  const pagePath = typeof body.page_path === "string" ? body.page_path.slice(0, 200) : null;
  const referrer = typeof body.referrer === "string" ? body.referrer.slice(0, 500) : null;

  if (!email || !EMAIL_RE.test(email)) {
    return NextResponse.json({ ok: false, error: "Please enter a complete email address." }, { status: 400 });
  }
  if (!(CLIENT_TYPES as readonly string[]).includes(clientType)) {
    return NextResponse.json({ ok: false, error: "Please tell us which best describes you." }, { status: 400 });
  }

  const supabase = createClient();
  const { error } = await supabase.from("lead_intake").insert({
    email,
    client_type: clientType,
    interests,
    source: "site_modal",
    page_path: pagePath,
    referrer
  });

  if (error) {
    console.error("Supabase lead_intake insert failed:", error);
    return NextResponse.json(
      { ok: false, error: "We couldn't save your details. Please try again or contact info@regenera.bio." },
      { status: 500 }
    );
  }

  await ingestLead({
    source: "lead_modal",
    email,
    clientType,
    interests,
    pagePath,
    referrer
  });

  return NextResponse.json({ ok: true });
}
