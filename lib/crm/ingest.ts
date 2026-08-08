import { createAdminClient } from "@/lib/supabase/admin";

// One-way ingestion from the three public forms into the internal CRM.
// Never reads from or alters contact_submissions / lead_intake / subscribers,
// only creates CRM records from the same data those tables already store.
// Best-effort: a failure here must never fail the public form submission,
// the public table insert (already committed by the caller) is always the
// source of truth for "did we receive this enquiry."

type IngestSource = "contact_form" | "lead_modal" | "subscribe_form";

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
}

function splitName(name: string | null | undefined): { first: string | null; last: string | null } {
  const trimmed = (name ?? "").trim();
  if (!trimmed) return { first: null, last: null };
  const parts = trimmed.split(/\s+/);
  return { first: parts[0], last: parts.length > 1 ? parts.slice(1).join(" ") : null };
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
    let organizationId: string | null = null;
    if (lead.organization) {
      const { data: org, error: orgError } = await admin
        .from("organizations")
        .select("id")
        .eq("name", lead.organization)
        .maybeSingle();
      if (orgError) throw orgError;

      if (org) {
        organizationId = org.id;
      } else {
        const { data: newOrg, error: newOrgError } = await admin
          .from("organizations")
          .insert({ name: lead.organization, organization_type: "prospect", source: lead.source })
          .select("id")
          .single();
        if (newOrgError) throw newOrgError;
        organizationId = newOrg.id;
      }
    }

    const { first, last } = splitName(lead.name);
    const { data: existingContact, error: contactLookupError } = await admin
      .from("contacts")
      .select("id")
      .eq("email", lead.email)
      .maybeSingle();
    if (contactLookupError) throw contactLookupError;

    let contactId: string;
    if (existingContact) {
      contactId = existingContact.id;
      await admin
        .from("contacts")
        .update({ last_contact_at: new Date().toISOString(), organization_id: organizationId ?? undefined })
        .eq("id", contactId);
    } else {
      const { data: newContact, error: newContactError } = await admin
        .from("contacts")
        .insert({
          first_name: first,
          last_name: last,
          email: lead.email,
          organization_id: organizationId,
          source: lead.source,
          last_contact_at: new Date().toISOString()
        })
        .select("id")
        .single();
      if (newContactError) throw newContactError;
      contactId = newContact.id;
    }

    const { error: oppError } = await admin.from("opportunities").insert({
      opportunity_name: `${lead.name || lead.email} (${lead.source})`,
      organization_id: organizationId,
      primary_contact_id: contactId,
      stage: "target",
      source: lead.source,
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
