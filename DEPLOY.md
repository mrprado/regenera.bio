# Deploying regenera.bio to Netlify

This is a standard Next.js 14 App Router project. Netlify builds it via the
official `@netlify/plugin-nextjs` adapter, declared in `netlify.toml` at the
repo root:

```toml
[build]
  command = "npm run build"

[[plugins]]
  package = "@netlify/plugin-nextjs"
```

The plugin handles routing, SSR, and Image Optimization (including the
remote Wikimedia hosts already allow-listed in `next.config.js`) without
further config.

## 1. Push to a Git repository

This repo already lives at https://github.com/mrprado/regenera.bio, so this
step is done. For reference, from scratch it's:

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin <your-repo-url>
git branch -M main
git push -u origin main
```

## 2. Import the project in Netlify

1. Go to https://app.netlify.com/start and pick "Import an existing project"
   → GitHub → select `mrprado/regenera.bio`.
2. Netlify auto-detects the `netlify.toml` and the Next.js plugin; leave the
   build command and publish directory as whatever the plugin sets (don't
   override them manually).
3. Base directory: leave blank if the repo root is `regenera-nextjs/`
   itself (this is how it's currently pushed). If you ever restructure so
   the app lives in a subfolder, set the base directory there instead.

## 3. Environment variables

Add these in Site configuration → Environment variables. Values come from
`.env.example`.

| Variable | Required | Notes |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Supabase project API URL. Project: "Regenera.bio" (`xbgrtjcslbnnvvhwqcye`). |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Yes | Supabase publishable key. Safe to expose to the browser; RLS on `contact_submissions` / `subscribers` only grants INSERT, no SELECT. |
| `RESEND_API_KEY` | No, but no email without it | From your Resend dashboard. |
| `CONTACT_FROM_EMAIL` | No, but no email without it | Must be an address on a domain verified in Resend, e.g. `"Regenera Advisory <no-reply@regenera.bio>"`. |
| `CONTACT_TO_EMAIL` | No | Defaults to `info@regenera.bio` if unset. |
| `BUTTONDOWN_API_KEY` | No, but no Buttondown sync without it | From your Buttondown account settings. |
| `SUPABASE_SERVICE_ROLE_KEY` | No, but no CRM ingestion without it | Supabase dashboard → Project Settings → API → `service_role` secret. Server-side only, never exposed to the browser. Without it, the contact form, lead modal, and the four `/for-*` segmented intake forms still succeed and store the raw submission, they just skip creating the corresponding CRM records (organization/contact/opportunity/project or capital mandate), logging why server-side. See `docs/crm/SECURITY_MODEL.md`. |

Supabase is the source of truth for every form: a submission only fails if
the Supabase insert into the relevant public table (`contact_submissions`,
`lead_intake`, or `segmented_intake`) fails. Without `RESEND_API_KEY` /
`CONTACT_FROM_EMAIL`, the contact form still succeeds (the enquiry is
stored) and just skips the notification email, logging why server-side.
Same for `BUTTONDOWN_API_KEY` and the subscribe form, and for
`SUPABASE_SERVICE_ROLE_KEY` and CRM ingestion. Without the two
`NEXT_PUBLIC_SUPABASE_*` variables, every form fails outright, since there
is nowhere to store the submission.

Domain verification in Resend (required before `CONTACT_FROM_EMAIL` will
actually deliver): Resend dashboard → Domains → add `regenera.bio` → add the
DNS records it gives you (SPF/DKIM) at your DNS provider.

## 4. Attach the domain

1. Site configuration → Domain management → Add a domain → `regenera.bio`.
2. Point DNS at Netlify per what it shows (Netlify DNS, or an `A` record at
   the apex to Netlify's load balancer IP plus a `CNAME` for `www` to your
   `<site-name>.netlify.app`).
3. Netlify issues the TLS certificate automatically once DNS resolves, and
   lets you choose the `www` ↔ apex redirect direction in domain settings.

## 5. Verify after deploy

- Visit the production URL and click through Home, How We Work, Services,
  Philosophy, Projects & Partnerships, Field Notes (list + a couple of
  detail pages), and Contact.
- Submit the contact form and confirm an email arrives at `info@regenera.bio`.
- Submit the Field Notes subscribe form and confirm the address appears in
  Buttondown.
- Check `/sitemap.xml` and `/robots.txt` resolve and list all routes.
- Confirm the favicon renders in a browser tab.
- Run Lighthouse or PageSpeed Insights against the production URL as a final
  sanity check on Core Web Vitals.

## Known deferred item

`npm audit` reports high-severity advisories against `next@14.2.35` (see the
project's quality-gate notes). Fixing them requires upgrading to Next 15/16,
which is an intentionally separate, breaking-change task and was not done
here per instruction to stay on Next 14.
