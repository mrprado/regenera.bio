import type { ExtractionResult } from "../types";

// Schema-specific parser for the SEC EDGAR Full-Text Search API
// (efts.sec.gov/LATEST/search-index). Real, verified JSON shape captured
// 2026-08-11 -- see docs/intelligence-system/SOURCE_REGISTRY.md.

interface EdgarHit {
  _source?: {
    display_names?: string[];
    form?: string;
    file_date?: string;
    biz_locations?: string[];
    adsh?: string;
  };
}

const DISPLAY_NAME_RE = /^(.*?)\s*\(CIK\s+(\d+)\)$/;

export function canHandle(sourceUrl: string): boolean {
  return sourceUrl.includes("efts.sec.gov");
}

export function extract(rawContent: string): ExtractionResult {
  const result: ExtractionResult = { entities: [], relationships: [], claims: [], confidence: 0.85, extractedBy: "deterministic:sec-edgar" };

  let parsed: { hits?: { hits?: EdgarHit[] } };
  try {
    parsed = JSON.parse(rawContent);
  } catch {
    return { ...result, confidence: 0 };
  }

  const hits = parsed.hits?.hits ?? [];
  const seenEntities = new Set<string>();

  for (const hit of hits) {
    const src = hit._source;
    if (!src?.display_names?.length) continue;

    for (const rawName of src.display_names) {
      const match = DISPLAY_NAME_RE.exec(rawName.trim());
      const name = (match?.[1] ?? rawName).trim();
      const cik = match?.[2];
      const key = `org:${cik ?? name}`;
      if (!seenEntities.has(key)) {
        seenEntities.add(key);
        result.entities.push({
          entityType: "organization",
          name,
          aliases: cik ? [`CIK ${cik}`] : [],
          details: { source: "sec_edgar" }
        });
      }

      result.claims.push({
        entityName: name,
        claimText: `${name} filed SEC Form ${src.form ?? "unknown"} on ${src.file_date ?? "unknown date"}${src.biz_locations?.length ? ` (business location: ${src.biz_locations.join(", ")})` : ""}${src.adsh ? `, accession ${src.adsh}` : ""}.`,
        confidence: 0.85
      });
    }
  }

  return result;
}
