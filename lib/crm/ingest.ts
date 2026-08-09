import { createAdminClient } from "@/lib/supabase/admin";
import type { SupabaseClient } from "@supabase/supabase-js";

// One-way ingestion from the public forms into the internal CRM. Never
// reads from or alters contact_submissions / lead_intake / subscribers /
// segmented_intake, only creates CRM records from the same data those
// tables already store. Best-effort: a failure here must never fail the
// public form submission, the public table insert (already committed by
// the caller) is always the source of truth for "did we receive this."

type IngestSource = "contact_form" | "lead_modal" | "subscribe_form" | "developer" | "investor" | "landowner" | "operator";

export interface IngestLead {
  source: IngestSource;
  name?: string | null;
  email: string;
  organization?: string | null;
  message?: string | null;
  clientType?: string | null;
  interests?: string[] | null;
  pagePath?: string | null;
  referrer?: string | null;
  /** Which Services practice (lib/practices.ts serviceValue) the visitor's
   *  CTA came from, if any. Stored in opportunities.service. */
  service?: string | null;
}

function splitName(name: string | null | undefined): { first: string | null; last: string | null } {
  const trimmed = (name ?? "").trim();
  if (!trimmed) return { first: null, last: null };
  const parts = trimmed.split(/\s+/);
  return { first: parts[0], last: parts.length > 1 ? parts.slice(1).join(" ") : null };
}

async function resolveOrganization(admin: SupabaseClient, name: string | null | undefined, source: string): Promise<string | null> {
  if (!name) return null;
  const { data: org, error: orgError } = await admin.from("organizations").select("id").eq("name", name).maybeSingle();
  if (orgError) throw orgError;
  if (org) return org.id;

  const { data: newOrg, error: newOrgError } = await admin
    .from("organizations")
    .insert({ name, organization_type: "prospect", source })
    .select("id")
    .single();
  if (newOrgError) throw newOrgError;
  return newOrg.id;
}

async function resolveContact(
  admin: SupabaseClient,
  email: string,
  name: string | null | undefined,
  organizationId: string | null,
  source: string,
  phone?: string | null
): Promise<string> {
  const { data: existingContact, error: contactLookupError } = await admin
    .from("contacts")
    .select("id")
    .eq("email", email)
    .maybeSingle();
  if (contactLookupError) throw contactLookupError;

  if (existingContact) {
    await admin
      .from("contacts")
      .update({ last_contact_at: new Date().toISOString(), organization_id: organizationId ?? undefined })
      .eq("id", existingContact.id);
    return existingContact.id;
  }

  const { first, last } = splitName(name);
  const { data: newContact, error: newContactError } = await admin
    .from("contacts")
    .insert({
      first_name: first,
      last_name: last,
      email,
      phone: phone ?? null,
      organization_id: organizationId,
      source,
      last_contact_at: new Date().toISOString()
    })
    .select("id")
    .single();
  if (newContactError) throw newContactError;
  return newContact.id;
}

export async function ingestLead(lead: IngestLead): Promise<void> {
  const admin = createAdminClient();
  if (!admin) {
    // No service role key configured (e.g. local dev without it set).
    // Ingestion is a bonus on top of the public tables, so skip quietly.
    console.warn("CRM ingestion skipped: SUPABASE_SERVICE_ROLE_KEY not configured.");
    return;
  }

  try {
    const organizationId = await resolveOrganization(admin, lead.organization, lead.source);
    const contactId = await resolveContact(admin, lead.email, lead.name, organizationId, lead.source);

    const { error: oppError } = await admin.from("opportunities").insert({
      opportunity_name: `${lead.name || lead.email} (${lead.source})`,
      organization_id: organizationId,
      primary_contact_id: contactId,
      stage: "target",
      source: lead.source,
      service: lead.service ?? null,
      notes: [lead.clientType, lead.interests?.join(", "), lead.message].filter(Boolean).join(" | ") || null
    });
    if (oppError) throw oppError;

    const { error: activityError } = await admin.from("activities").insert({
      activity_type: "note",
      contact_id: contactId,
      organization_id: organizationId,
      summary: `Inbound ${lead.source.replace("_", " ")} submission${lead.pagePath ? ` from ${lead.pagePath}` : ""}.`,
      created_by: null
    });
    if (activityError) throw activityError;
  } catch (err) {
    console.error(`CRM ingestion failed for ${lead.source} (public submission was still stored):`, err);
  }
}

export interface SegmentedLead {
  intakeType: "developer" | "investor" | "landowner" | "operator";
  name: string;
  email: string;
  org: string | null;
  phone: string | null;
  fields: Record<string, string>;
  message: string | null;
  utmSource: string | null;
  utmMedium: string | null;
  utmCampaign: string | null;
  pagePath: string | null;
  referrer: string | null;
  /** Which Services practice (lib/practices.ts serviceValue) the visitor's
   *  CTA came from, if any. Stored in opportunities.service. */
  service: string | null;
}

const SEGMENTED_STAGE_MAP: Record<string, string> = {
  early: "concept",
  site_control: "concept",
  permitting: "concept",
  shovel_ready: "construction_ready",
  under_construction: "construction",
  operating: "operating"
};

// developer/landowner/operator submissions all describe a physical
// project/asset, so they populate `projects`. investor submissions
// describe a mandate, so they populate `capital_mandates` instead.
export async function ingestSegmentedLead(lead: SegmentedLead): Promise<void> {
  const admin = createAdminClient();
  if (!admin) {
    console.warn("CRM ingestion skipped: SUPABASE_SERVICE_ROLE_KEY not configured.");
    return;
  }

  const source = `segmented_${lead.intakeType}`;
  const utmSummary = [lead.utmSource, lead.utmMedium, lead.utmCampaign].filter(Boolean).join(" / ") || null;

  try {
    const organizationId = await resolveOrganization(admin, lead.org, source);
    const contactId = await resolveContact(admin, lead.email, lead.name, organizationId, source, lead.phone);

    if (lead.intakeType === "investor") {
      const { error: mandateError } = await admin.from("capital_mandates").insert({
        investor_organization_id: organizationId,
        contact_id: contactId,
        investor_type: lead.fields.investor_type ?? null,
        geographies: lead.fields.geographies ? [lead.fields.geographies] : null,
        sectors: lead.fields.sectors ? [lead.fields.sectors] : null,
        stage_preferences: lead.fields.stage_preference ? [lead.fields.stage_preference] : null,
        current_appetite: lead.message,
        summary: lead.fields.ticket_size ? `Typical ticket: ${lead.fields.ticket_size}` : null,
        source
      });
      if (mandateError) throw mandateError;
    } else {
      const { error: projectError } = await admin.from("projects").insert({
        project_name: lead.fields.project_name || `${lead.name}'s submission`,
        organization_id: organizationId,
        primary_contact_id: contactId,
        sector: lead.fields.sector ?? lead.fields.primary_infrastructure_issue ?? null,
        location: lead.fields.location ?? null,
        stage: lead.fields.stage ? (SEGMENTED_STAGE_MAP[lead.fields.stage] ?? lead.fields.stage) : null,
        land_status: lead.fields.land_status ?? lead.fields.current_use ?? null,
        capital_requirement: null,
        current_constraint: lead.message,
        summary: [lead.fields.size, lead.fields.water_access, lead.fields.place_type, lead.fields.capital_requirement]
          .filter(Boolean)
          .join(", ") || null
      });
      if (projectError) throw projectError;
    }

    const { error: oppError } = await admin.from("opportunities").insert({
      opportunity_name: `${lead.name} (${lead.intakeType})`,
      organization_id: organizationId,
      primary_contact_id: contactId,
      stage: "target",
      source,
      service: lead.service,
      campaign_id: lead.utmCampaign,
      notes: [utmSummary ? `UTM: ${utmSummary}` : null, lead.message].filter(Boolean).join(" | ") || null
    });
    if (oppError) throw oppError;

    const { error: activityError } = await admin.from("activities").insert({
      activity_type: "note",
      contact_id: contactId,
      organization_id: organizationId,
      summary: `Inbound ${lead.intakeType} intake submission${lead.pagePath ? ` from ${lead.pagePath}` : ""}${utmSummary ? `, UTM: ${utmSummary}` : ""}.`,
      created_by: null
    });
    if (activityError) throw activityError;
  } catch (err) {
    console.error(`CRM ingestion failed for segmented ${lead.intakeType} intake (public submission was still stored):`, err);
  }
}
