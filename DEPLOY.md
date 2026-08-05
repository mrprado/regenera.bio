# Deploying regenera.bio to Vercel

This is a standard Next.js 14 App Router project. Vercel detects it automatically,
so no `vercel.json` is required (adding one for framework detection or routing
would only risk overriding Vercel's correct defaults). The only thing lower-level
config controls is remote image hosts, already set in `next.config.js`
(`upload.wikimedia.org`, `commons.wikimedia.org`).

## 1. Push to a Git repository

Vercel deploys from GitHub, GitLab, or Bitbucket.

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin <your-repo-url>
git push -u origin main
```

## 2. Import the project in Vercel

1. Go to https://vercel.com/new and import the repository.
2. Framework Preset: **Next.js** (auto-detected).
3. Root Directory: `regenera-nextjs` if the repo root is `Regenera.bio/` (this
   folder contains `reference-design.html` alongside the app); set it to `.` if
   you push the contents of `regenera-nextjs/` as the repo root instead.
4. Build Command / Output: leave as the Next.js defaults (`next build`).

## 3. Environment variables

Add these in Vercel Project Settings → Environment Variables (Production,
Preview, and Development as appropriate). Values come from `.env.example`.

| Variable | Required | Notes |
|---|---|---|
| `RESEND_API_KEY` | Yes, for the contact form to send | From your Resend dashboard. |
| `CONTACT_FROM_EMAIL` | Yes | Must be an address on a domain verified in Resend, e.g. `"Regenera Advisory <no-reply@regenera.bio>"`. |
| `CONTACT_TO_EMAIL` | No | Defaults to `info@regenera.bio` if unset. |
| `BUTTONDOWN_API_KEY` | Yes, for the Field Notes subscribe form | From your Buttondown account settings. |

Without `RESEND_API_KEY` / `CONTACT_FROM_EMAIL`, the contact form still
validates client-side but returns a graceful "could not send right now" error
on submit rather than crashing. Same for `BUTTONDOWN_API_KEY` and the
subscribe form.

Domain verification in Resend (required before `CONTACT_FROM_EMAIL` will
actually deliver): Resend dashboard → Domains → add `regenera.bio` → add the
DNS records it gives you (SPF/DKIM) at your DNS provider.

## 4. Attach the domain

1. Vercel Project Settings → Domains → add `regenera.bio` and `www.regenera.bio`.
2. Point DNS at Vercel per the instructions Vercel shows (either an `A`/`ALIAS`
   record at the apex to Vercel's IP, or delegate via nameservers if the
   registrar supports it), and a `CNAME` for `www` to `cname.vercel-dns.com`.
3. In Domains settings, set the redirect direction (`www` → apex or apex →
   `www`) once both resolve. Vercel issues the TLS certificate automatically.

## 5. Verify after deploy

- Visit the production URL and click through Home, How We Work, Services,
  Philosophy, Projects & Partnerships, Field Notes (list + a couple of
  detail pages), and Contact.
- Submit the contact form and confirm an email arrives at `info@regenera.bio`.
- Submit the Field Notes subscribe form and confirm the address appears in
  Buttondown.
- Check `/sitemap.xml` and `/robots.txt` resolve and list all routes.
- Run Lighthouse or PageSpeed Insights against the production URL as a final
  sanity check on Core Web Vitals.

## Known deferred item

`npm audit` reports high-severity advisories against `next@14.2.35` (see the
project's quality-gate notes). Fixing them requires upgrading to Next 15/16,
which is an intentionally separate, breaking-change task and was not done
here per instruction to stay on Next 14.
