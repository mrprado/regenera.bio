import { createClient as createSupabaseClient } from "@supabase/supabase-js";

// This module reads process.env.SUPABASE_SERVICE_ROLE_KEY (not NEXT_PUBLIC_),
// which Next.js only makes available server-side, so it is safe to import
// only from Route Handlers and Server Components, never from a "use client"
// file.

// Service-role client. Bypasses RLS entirely, so it must never be imported
// into a client component and must never be exposed outside this server-only
// module. Used only for the one-way public-form-to-CRM ingestion path
// (lib/crm/ingest.ts). See docs/crm/SECURITY_MODEL.md.
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    return null;
  }

  return createSupabaseClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false }
  });
}
