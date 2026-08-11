import { createHash } from "crypto";
import * as cheerio from "cheerio";
import { createAdminClient } from "@/lib/supabase/admin";

// Generic collector: fetch one intel_sources row's URL, store the result as
// an intel_documents row, and record an intel_changes row only when the
// content actually differs from the previous capture. This is the single
// shared "collect once, store once" path every specialist agent reasons
// over later (docs/intelligence-system/ARCHITECTURE.md) -- it does not
// itself decide what's interesting, that's downstream agent work.

const MAX_INLINE_CONTENT_LENGTH = 20_000;

export interface CollectResult {
  ok: boolean;
  documentId?: string;
  changed?: boolean;
  error?: string;
}

function extractText(contentType: string | null, body: string): string {
  if (!contentType || !contentType.includes("html")) {
    return body;
  }
  const $ = cheerio.load(body);
  $("script, style, noscript").remove();
  return $("body").text().replace(/\s+/g, " ").trim();
}

export async function collectSource(sourceId: string): Promise<CollectResult> {
  const supabase = createAdminClient();
  if (!supabase) {
    return { ok: false, error: "Supabase admin client not configured (SUPABASE_SERVICE_ROLE_KEY missing)." };
  }

  const { data: source, error: sourceError } = await supabase
    .from("intel_sources")
    .select("id, url, is_active")
    .eq("id", sourceId)
    .single();

  if (sourceError || !source) {
    return { ok: false, error: `Source not found: ${sourceError?.message ?? sourceId}` };
  }
  if (!source.url) {
    return { ok: false, error: "Source has no url." };
  }

  let response: Response;
  try {
    response = await fetch(source.url, {
      headers: { "User-Agent": "RegeneraIntelligenceOS/0.1 (+https://regenera.bio)" },
      signal: AbortSignal.timeout(20_000)
    });
  } catch (err) {
    return { ok: false, error: `Fetch failed: ${err instanceof Error ? err.message : String(err)}` };
  }

  const body = await response.text();
  const contentType = response.headers.get("content-type");
  const text = extractText(contentType, body);
  const contentHash = createHash("sha256").update(text).digest("hex");

  const { data: previous } = await supabase
    .from("intel_documents")
    .select("id, content_hash")
    .eq("source_id", sourceId)
    .order("fetched_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  const { data: inserted, error: insertError } = await supabase
    .from("intel_documents")
    .insert({
      source_id: sourceId,
      url: source.url,
      content_hash: contentHash,
      raw_content: text.length > MAX_INLINE_CONTENT_LENGTH ? text.slice(0, MAX_INLINE_CONTENT_LENGTH) : text,
      http_status: response.status
    })
    .select("id")
    .single();

  if (insertError || !inserted) {
    return { ok: false, error: `Storing document failed: ${insertError?.message}` };
  }

  await supabase.from("intel_sources").update({ last_checked_at: new Date().toISOString() }).eq("id", sourceId);

  const changed = !previous || previous.content_hash !== contentHash;
  if (changed) {
    await supabase.from("intel_changes").insert({
      source_id: sourceId,
      previous_document_id: previous?.id ?? null,
      new_document_id: inserted.id
    });
  }

  return { ok: true, documentId: inserted.id, changed };
}
