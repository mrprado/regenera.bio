import { Resend } from "resend";

// Shared best-effort email notification, used by every form's Route
// Handler after its Supabase insert succeeds, and by the intelligence
// digest (scripts/intel-digest.ts). Supabase is always the source of
// truth: a failure here is logged and swallowed, never allowed to fail
// the caller. Reuses the same RESEND_API_KEY / CONTACT_FROM_EMAIL /
// CONTACT_TO_EMAIL env vars already configured for the contact form, no
// new setup required for the form paths -- the digest, running in GitHub
// Actions rather than Netlify, needs these set as separate repo secrets.
// Returns whether the send succeeded, so callers that need to record
// delivery status (the digest, via intel_report_deliveries) can -- every
// existing caller ignores the return value, so this is additive.
export async function sendNotificationEmail(subject: string, text: string, replyTo?: string): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL || "info@regenera.bio";
  const from = process.env.CONTACT_FROM_EMAIL;

  if (!apiKey || !from) {
    console.error(`Notification skipped, RESEND_API_KEY or CONTACT_FROM_EMAIL not configured: ${subject}`);
    return false;
  }

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from,
      to,
      ...(replyTo ? { replyTo } : {}),
      subject,
      text
    });
    if (error) {
      console.error("Resend notification error (submission was still stored):", error);
      return false;
    }
    return true;
  } catch (err) {
    console.error("Notification email failed (submission was still stored):", err);
    return false;
  }
}
