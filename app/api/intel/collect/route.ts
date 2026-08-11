import { NextResponse } from "next/server";
import { collectSource } from "@/lib/intelligence/collect";

export const runtime = "nodejs";

// Internal-only endpoint: invoked by a scheduler (Supabase pg_cron + pg_net,
// or a GitHub Actions cron job), never by a logged-in browser session, so it
// cannot use the staff-cookie auth the rest of the app uses. Gated instead
// by a shared secret header, matching the "existing infrastructure, no paid
// SaaS" preference in the intelligence-system spec.
export async function POST(req: Request) {
  const secret = process.env.INTEL_COLLECTOR_SECRET;
  if (!secret) {
    return NextResponse.json({ ok: false, error: "INTEL_COLLECTOR_SECRET not configured." }, { status: 503 });
  }
  if (req.headers.get("x-collector-secret") !== secret) {
    return NextResponse.json({ ok: false, error: "Unauthorized." }, { status: 401 });
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Malformed request." }, { status: 400 });
  }

  const sourceId = String(body.source_id ?? "").trim();
  if (!sourceId) {
    return NextResponse.json({ ok: false, error: "source_id is required." }, { status: 400 });
  }

  const result = await collectSource(sourceId);
  return NextResponse.json(result, { status: result.ok ? 200 : 500 });
}
