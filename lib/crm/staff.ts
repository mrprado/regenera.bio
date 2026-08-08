import { createClient } from "@/lib/supabase/server";

export interface StaffRecord {
  id: string;
  email: string | null;
  full_name: string | null;
  role: "admin" | "staff";
}

// Returns the current active staff record, or null if there is no session,
// or the session exists but has no matching active `staff` row. RLS already
// enforces this at the database level for every CRM table; this helper is
// for the UI (what to render, where to redirect), not the security boundary
// itself, see docs/crm/SECURITY_MODEL.md.
export async function getCurrentStaff(): Promise<StaffRecord | null> {
  const supabase = createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: staff } = await supabase
    .from("staff")
    .select("id, email, full_name, role")
    .eq("id", user.id)
    .eq("is_active", true)
    .maybeSingle();

  return staff ?? null;
}
