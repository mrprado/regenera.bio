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
  notice_text?: string;
}

export function canHandle(sourceUrl: string): boolean {
  return sourceUrl.includes("search.worldbank.org/api/procnotices");
}

// Contract Award notices carry the actual counterparty/capital fact (who
// got awarded what, for how much) inside notice_text as loosely-structured
// HTML, not as its own JSON field -- this is the single highest-value fact
// type this whole system exists to surface, so it's worth parsing even
// though the HTML isn't as clean as the rest of the API. Real shape
// observed 2026-08-11 (Sindh Solar Energy Project, Pakistan):
//   <b>BBOXX (804829)</b><br/>...Country: United Kingdom<br/>...
//   Signed Contract price<br/>USD 38498000.00
// Awarded-bidder names and prices are paired by position within the
// "Awarded Bidder(s)" section, stopping at whichever comes first among
// "Beneficial Ownership Details" (a compliance sub-section that RESTATES
// the same winning bidder's name -- confirmed against a real notice,
// where including it produced a duplicate entity for the one real
// winner), "Evaluated Bidder(s)" (bidders considered but NOT awarded),
// "Rejected Bidder(s)", or end of string. Correct for the common
// single-award-per-notice case, imperfect for a genuinely multi-lot award
// with more than one winner in one notice, a known limitation, not
// silently assumed correct.
const AWARDED_SECTION_RE = /Awarded Bidder\(s\):([\s\S]*?)(?:Beneficial Ownership Details|Evaluated Bidder\(s\)|Rejected Bidder\(s\)|$)/;
const BIDDER_NAME_RE = /<b>([^<()]+?)\s*\((\d+)\)<\/b>/g;
const CONTRACT_PRICE_RE = /Signed Contract price<br\/>([A-Z]{3})\s*([\d.]+)/g;

function extractAwards(noticeText: string | undefined): { name: string; wbBidderId: string; currency: string; amount: string }[] {
  if (!noticeText) return [];
  const sectionMatch = AWARDED_SECTION_RE.exec(noticeText);
  if (!sectionMatch) return [];
  const section = sectionMatch[1];

  const names = Array.from(section.matchAll(BIDDER_NAME_RE)).map((m) => ({ name: m[1].trim(), wbBidderId: m[2] }));
  const prices = Array.from(noticeText.matchAll(CONTRACT_PRICE_RE)).map((m) => ({ currency: m[1], amount: m[2] }));

  return names.map((n, i) => ({ ...n, currency: prices[i]?.currency ?? "", amount: prices[i]?.amount ?? "" }));
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

    if (notice.notice_type === "Contract Award" && notice.project_name) {
      for (const award of extractAwards(notice.notice_text)) {
        if (!award.name) continue;
        const orgKey = `organization:${award.name.toLowerCase()}`;
        if (!seenEntities.has(orgKey)) {
          seenEntities.add(orgKey);
          result.entities.push({
            entityType: "organization",
            name: award.name,
            aliases: [`WB bidder ${award.wbBidderId}`],
            details: { source: "world_bank_procurement" }
          });
        }
        result.relationships.push({
          fromEntityName: award.name,
          toEntityName: notice.project_name,
          relationshipType: "awarded_contract_on",
          confidence: 0.85
        });
        result.claims.push({
          entityName: award.name,
          claimText: `${award.name} was awarded a contract on "${notice.project_name}" (${notice.project_id})${notice.bid_description ? ` — ${notice.bid_description}` : ""}${award.amount ? `, signed contract price ${award.currency} ${award.amount}` : ""}${notice.noticedate ? `, notice dated ${notice.noticedate}` : ""}.`,
          confidence: 0.85
        });
      }
    }
  }

  return result;
}
