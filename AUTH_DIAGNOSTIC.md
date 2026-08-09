# CRM Auth Diagnostic

Status as of 2026-08-09: **application code confirmed working end to end up
to the point of Supabase handing the email off to SMTP. The remaining
failure is entirely a Supabase → Resend SMTP credential problem, not
something fixable in this repository.** This document records the
architecture, the evidence, and exactly what needs correcting in the
Supabase dashboard.

## Architecture

Magic-link only, no passwords, no public self-registration.

```
/crm/login (client component)
  -> POST /api/crm/request-magic-link (server route)
       -> supabase.auth.signInWithOtp({ email, shouldCreateUser: false })
            -> Supabase Auth generates the link, hands the email to
               whatever SMTP provider is configured in the Supabase
               dashboard (currently: custom SMTP via Resend)
  <- { ok, category, error } JSON response

User clicks the emailed link
  -> GET /auth/callback?code=...&next=/crm
       -> supabase.auth.exchangeCodeForSession(code)   (PKCE)
       -> redirect to /crm on success, /crm/login?error=callback_failed
          on failure

/crm (server component)
  -> checkStaffAccess(): auth.getUser() then a lookup against the
     `staff` table (id, is_active)
       -> no session: redirect /crm/login
       -> session but no active staff row: redirect
          /crm/login?error=not_authorized
       -> authorized: render the dashboard
```

No custom email-sending code exists in this path. Resend is used
elsewhere in the app (`app/api/contact/route.ts`, the public contact form's
notification email) but that code is not imported by, called from, or in
any way connected to `/crm/login`, `/api/crm/request-magic-link`, or
`/auth/callback`. Confirmed by grepping the codebase for every
`Resend`/`resend` reference: exactly one file uses it, and it isn't part of
auth. Supabase Auth's own SMTP integration (configured in the Supabase
dashboard, not in this codebase) is what actually talks to Resend for the
magic-link email.

## Environment variables

| Variable | Used by | Client-exposed? |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | `lib/supabase/client.ts`, `server.ts` | Yes (by design, it's a URL) |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | `lib/supabase/client.ts`, `server.ts` | Yes (by design, RLS-scoped anon key) |
| `SUPABASE_SERVICE_ROLE_KEY` | `lib/supabase/admin.ts` (CRM lead ingestion only) | No, server-only |
| `RESEND_API_KEY` | `app/api/contact/route.ts` (contact form email) | No, server-only |

Confirmed the production project is correct: `.env.production` (committed,
safe, publishable key only) points to
`https://xbgrtjcslbnnvvhwqcye.supabase.co`, project "Regenera.bio". No
other Supabase URL or key appears anywhere in the codebase (verified via
repo-wide search). This is also independently confirmed by Supabase's own
auth logs: every `/otp` request from the production domain during this
debugging session shows up in this exact project's logs, with matching
timestamps to when they were made. If the app were pointed at a different
or stale project, those requests would not appear here at all.

Netlify's dashboard environment variables were not directly inspected (no
tool access to Netlify), but the log evidence above makes a stale/wrong
Netlify-side `NEXT_PUBLIC_SUPABASE_URL` extremely unlikely: the requests
are demonstrably reaching the correct project.

## Auth callback and PKCE

`app/auth/callback/route.ts` uses `exchangeCodeForSession(code)`, the
correct method for the PKCE flow that `@supabase/ssr`'s `createBrowserClient`
uses by default for `signInWithOtp`. This is unchanged in shape, just
hardened to log and redirect with a reason on failure instead of silently
proceeding.

**Operational note, not a bug**: PKCE stores its code verifier in a cookie
on the browser that *requested* the link. If a magic link is opened in a
different browser or app than the one that requested it (e.g., requested
on desktop Chrome, opened via a phone's mail app), the exchange will fail
with `callback_failed`. Test in the same browser both times.

## Staff authorization

Confirmed directly against the database:

```
alanprado@regenera.bio -> auth.users.id 89e9c9b7-19a4-4e4e-a06d-24b9b0923e24
                        -> email_confirmed_at: 2026-08-09 00:10:39 UTC
staff row: role=admin, is_active=true, id matches
```

This is correct and does not need further action. The failure happening
right now is before this stage is ever reached (no session exists yet
because no email has successfully sent).

## Hardening added this pass (no redesign)

1. **`app/api/crm/request-magic-link/route.ts`** (new): moves the
   `signInWithOtp` call server-side. Logs the complete error
   (`message`, `status`, `code`, `name`) to server/function logs on
   failure, categorizes it (`app_error` / `auth_api_error` / `smtp_error`),
   and returns the category plus Supabase's own (already user-facing,
   non-secret) message to the browser. No secret is logged or returned;
   Supabase's SMTP-failure message never contains the SMTP credentials.
2. **`app/crm/login/page.tsx`**: now posts to that route instead of calling
   Supabase directly from the browser, so a network/app-level failure
   (category A) is distinguishable from a structured Supabase error
   (B or C). Also renders `?error=callback_failed` / `?error=not_authorized`
   query-param states (categories D and E) with an explanation.
3. **`app/auth/callback/route.ts`**: now checks the result of
   `exchangeCodeForSession`, logs failures with full detail, and redirects
   to `/crm/login?error=callback_failed` instead of redirecting to `/crm`
   regardless of outcome.
4. **`lib/crm/staff.ts`**: added `checkStaffAccess()`, which distinguishes
   "no session at all" from "session exists, no active staff row"
   (`StaffCheckResult`), used by `app/crm/page.tsx` to redirect with
   `?error=not_authorized` specifically in the latter case. `getCurrentStaff()`
   is kept as a thin wrapper for any future call site that just wants the
   record or null.

None of this changes the auth architecture (still magic-link only, still
`staff`-table-gated, still no public signup). It only adds structured
logging and makes failure categories distinguishable instead of collapsing
everything into "Error sending magic link email."

## Production test result (this pass)

Ran `POST /api/crm/request-magic-link` for `alanprado@regenera.bio` against
the live production Supabase project (from local dev, hitting the same
project the deployed site uses):

```
Response: { "ok": false, "category": "smtp_error", "error": "Error sending magic link email" }

Server log:
[crm-auth] signInWithOtp failed {
  category: 'smtp_error',
  message: 'Error sending magic link email',
  status: 500,
  code: null,
  name: 'AuthRetryableFetchError',
  email: 'alanprado@regenera.bio'
}
```

Cross-checked against Supabase's own Auth logs for the same window: every
`/otp` request in the last ~45 minutes of testing, including several made
*after* the user reconfigured custom SMTP with a newly generated Resend API
key, returns the identical:

```
error: 535 "Authentication credentials invalid"
```

535 is an SMTP protocol response, returned by Resend's mail server when it
rejects the login handshake, before any message content is even discussed.
It is generated below the application layer entirely. A fresh API key
producing the identical error means the problem is very likely in how the
credentials are entered into Supabase's SMTP settings form, not the key
itself being revoked or wrong.

**APPLICATION CODE IS WORKING. FAILURE IS IN SUPABASE → RESEND SMTP AUTHENTICATION.**

## What to correct in the Supabase dashboard

Authentication → Emails → SMTP Settings:

- **Username** must be the literal string `resend`, not an email address,
  not an account name.
- **Password** must be a Resend API key (`re_...`) with Sending access,
  pasted with no leading/trailing whitespace and no surrounding quote
  marks (a common copy-paste artifact from `.env` files or code blocks).
- **Host**: `smtp.resend.com`.
- **Port/encryption pairing**: `587` + STARTTLS, or `465` + implicit
  SSL/TLS. A mismatched pairing can also surface as an auth-stage failure.
- Confirm the sender address configured alongside these credentials is on
  a domain actually verified in the Resend account being authenticated
  against.

Authentication → URL Configuration:

- **Site URL**: `https://regenera.bio` (matches the canonical domain used
  everywhere else in the codebase, e.g. `metadataBase` in `app/layout.tsx`).
- **Redirect URLs** (allowlist, add all that apply):
  - `https://regenera.bio/auth/callback`
  - `https://www.regenera.bio/auth/callback` (production traffic was
    observed on both the apex and `www` during this session's testing,
    add both to be safe regardless of which is canonical)
  - `http://localhost:3000/auth/callback` (only if testing from local dev)

None of the above can be verified or corrected from this repository or via
the database tools available in this session; they require direct access
to the Supabase dashboard.

## Final test: not yet passing

The full production flow (request link -> email delivered -> click ->
callback -> session -> `/crm` -> unauthorized emails blocked) has **not**
completed end to end as of this document. It is blocked at the first step
(email delivery) by the SMTP credential issue above. Once the dashboard
SMTP settings are corrected, re-test by requesting a link for
`alanprado@regenera.bio` and confirming: (1) the email actually arrives,
(2) clicking it lands on `/crm` signed in, (3) a non-staff email is
correctly rejected. This file should be updated with that result once it
happens, don't mark it complete before then.
