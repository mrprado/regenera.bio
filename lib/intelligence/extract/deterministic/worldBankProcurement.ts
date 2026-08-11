import type { ExtractionResult } from "../types";

// Schema-specific parser for the World Bank Procurement Notices API
// (http://search.worldbank.org/api/procnotices). Real, verified JSON shape
// captured 2026-08-11 -- see docs/intelligence-system/SOURCE_REGISTRY.md.
// Every field read here is one actually observed in a live response, not
// guessed from documentation.

interface ProcNotice {
  id?: string;
  notice_type?: string;
  noticedate?: string;
  notice_status?: string;
  project_ctry_name?: string;
  project_id?: string;
  project_name?: string;
  bid_reference_no?: string;
  bid_description?: string;
  procurement_method_name?: string;
}

export function canHandle(sourceUrl: string): boolean {
  return sourceUrl.includes("search.worldbank.org/api/procnotices");
}

export function extract(rawContent: string): ExtractionResult {
  const result: ExtractionResult = { entities: [], relationships: [], claims: [], confidence: 0.9, extractedBy: "deterministic:world-bank-procurement" };

  let parsed: { procnotices?: ProcNotice[] };
  try {
    parsed = JSON.parse(rawContent);
  } catch {
    return { ...result, confidence: 0 };
  }

  const notices = parsed.procnotices ?? [];
  const seenEntities = new Set<string>();

  for (const notice of notices) {
    if (notice.project_name && notice.project_id) {
      const key = `project:${notice.project_id}`;
      if (!seenEntities.has(key)) {
        seenEntities.add(key);
        result.entities.push({
          entityType: "project",
          name: notice.project_name,
          aliases: [notice.project_id],
          details: { source: "world_bank_procurement", project_id: notice.project_id }
        });
      }
    }

    if (notice.project_ctry_name) {
      const key = `jurisdiction:${notice.project_ctry_name}`;
      if (!seenEntities.has(key)) {
        seenEntities.add(key);
        result.entities.push({ entityType: "jurisdiction", name: notice.project_ctry_name });
      }
    }

    if (notice.project_name && notice.project_ctry_name) {
      result.relationships.push({
        fromEntityName: notice.project_name,
        toEntityName: notice.project_ctry_name,
        relationshipType: "located_in",
        confidence: 0.9
      });
    }

    if (notice.project_name) {
      const parts = [
        notice.notice_type,
        notice.notice_status ? `(${notice.notice_status})` : null,
        notice.procurement_method_name ? `via ${notice.procurement_method_name}` : null,
        notice.noticedate ? `on ${notice.noticedate}` : null
      ]
        .filter(Boolean)
        .join(" ");
      result.claims.push({
        entityName: notice.project_name,
        claimText: `World Bank procurement notice for "${notice.project_name}" (${notice.project_id}): ${parts}${notice.bid_description ? ` — ${notice.bid_description}` : ""}`,
        confidence: 0.9
      });
    }
  }

  return result;
}
