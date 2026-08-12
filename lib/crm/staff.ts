import { createClient } from "@/lib/supabase/server";

export interface StaffRecord {
  id: string;
  email: string | null;
  full_name: string | null;
  role: "admin" | "staff";
}

export type StaffCheckResult =
  | { state: "authorized"; staff: StaffRecord }
  | { state: "no_session" }
  | { state: "not_authorized" };

// Distinguishes "no session at all" from "session exists but no matching
// active staff row" (diagnostic category E), so callers can redirect with a
// specific reason instead of a generic bounce back to login. RLS already
// enforces this at the database level for every CRM table; this helper is
// for the UI (what to render, where to redirect), not the security boundary
// itself, see docs/crm/SECURITY_MODEL.md.
export async function checkStaffAccess(): Promise<StaffCheckResult> {
  const supabase = createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) return { state: "no_session" };

  const { data: staff, error } = await supabase
    .from("staff")
    .select("id, email, full_name, role")
    .eq("id", user.id)
    .eq("is_active", true)
    .maybeSingle();

  if (error) {
    // A real query/RLS error, not "no matching row" (that's `staff === null`
    // with no error). Previously silently swallowed and treated the same as
    // not_authorized, log it so a real failure is distinguishable from a
    // genuinely inactive/missing staff row.
    console.error("[crm-auth] staff lookup failed", {
      userId: user.id,
      email: user.email,
      message: error.message,
      code: error.code,
      details: error.details,
      hint: error.hint
    });
  }

  if (!staff) return { state: "not_authorized" };
  return { state: "authorized", staff };
}

// Convenience wrapper for callers that only need the staff record or null,
// kept for anywhere a full StaffCheckResult would be unnecessary detail.
export async function getCurrentStaff(): Promise<StaffRecord | null> {
  const result = await checkStaffAccess();
  return result.state === "authorized" ? result.staff : null;
}

// Intelligence-system access (has_intel_access) is granted per person,
// independent of general CRM staff access (see the intel_* schema
// migration's own comment on is_intel_access()) -- a CRM staff member does
// not automatically see the Investor Intelligence area. This mirrors
// checkStaffAccess's shape rather than reusing it, since "authorized" here
// means something stricter than plain active staff.
export type IntelAccessCheckResult = StaffCheckResult | { state: "no_intel_access"; staff: StaffRecord };

export async function checkIntelAccess(): Promise<IntelAccessCheckResult> {
  const supabase = createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) return { state: "no_session" };

  const { data: staff, error } = await supabase
    .from("staff")
    .select("id, email, full_name, role, has_intel_access")
    .eq("id", user.id)
    .eq("is_active", true)
    .maybeSingle();

  if (error) {
    console.error("[intel-auth] staff lookup failed", { userId: user.id, message: error.message, code: error.code });
  }

  if (!staff) return { state: "not_authorized" };
  const staffRecord: StaffRecord = { id: staff.id, email: staff.email, full_name: staff.full_name, role: staff.role };
  if (!staff.has_intel_access) return { state: "no_intel_access", staff: staffRecord };
  return { state: "authorized", staff: staffRecord };
}
