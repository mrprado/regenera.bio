# Regenera Advisory — regenera.bio

Client-facing site for Regenera Advisory, a regenerative systems consulting and capital
introduction practice (solar, waste-to-energy, real estate, land, agriculture, water,
orbital intelligence).

## Stack
- Next.js 14 (App Router) + TypeScript, no CSS framework
- All styling lives in `app/globals.css` (custom design system: CSS variables, Cormorant
  Garamond + Instrument Sans, parchment/forest/gold palette)
- Content data in `lib/` (fieldNotes.ts, projects.ts); pages in `app/`; interactive pieces
  are small client components in `components/`
- Supabase (project "Regenera.bio", `xbgrtjcslbnnvvhwqcye`) persists contact and subscribe
  form submissions. No auth: RLS grants `anon`/`authenticated` INSERT-only on
  `contact_submissions` and `subscribers`, no SELECT, so the publishable key in the
  browser bundle can never read data back. Clients in `lib/supabase/` (server.ts used from
  the two Route Handlers; client.ts unused today, kept for parity with the standard
  `@supabase/ssr` Next.js pattern in case auth is added later).

## Commands
- `npm run dev` — dev server
- `npm run build` — production build (must stay green; 35 static pages)

## Hard rules — do not violate
1. NO em-dashes or en-dashes anywhere in copy. Use commas or periods.
2. Compliance copy is load-bearing. Never add: response-time promises, fee commitments,
   return/IRR figures, "guaranteed", or securities offering language. The Important Notice
   text in `components/Footer.tsx` and `components/LegalModalProvider.tsx` must stay verbatim.
3. Logo is REGENERA (all caps, no period, gold). Never restyle without instruction.
4. Header nav has NO Contact tab; contact is reached only via "Get in Touch" and footer.
   Important Notice / Privacy / Cookies are footer-triggered modal popups
   (`components/LegalModalProvider.tsx`), not separate pages; only Contact navigates.
5. Images: Wikimedia Commons only, via the deterministic thumb URL scheme already used.
   No image may appear twice anywhere on the site. No visible photo credits (owner's
   decision; if licensing posture changes, add a /credits page rather than captions).
6. Design changes (color, type, spacing) only on explicit instruction.

## Content conventions
- Tone: institutional, precise, mechanism-first. PhD-level assessment written for
  investors, developers, and operators. Avoid greenwashing language; "regenerative"
  used sparingly.
- Field Notes: monthly entries in `lib/fieldNotes.ts`. To add a month: append an entry
  (slug, date, theme, title, teaser, body[], img, imgAlt) with a NEW unique Commons image.
- Headline figures: 10 GW energy pipeline, 30+ projects and mandates, 5+ countries
  engaged, 7 ecosystem layers, global capital network. Keep consistent across pages.
  (Per-project cards keep their own indicative figures: Sub-Saharan 2.1 GW, Mexico 4 GW.)

## Known open items
- `npm audit` shows remaining high-severity advisories on next@14.2.35; upgrading to
  Next 15/16 is a known future task (breaking changes).
- Email notifications are best-effort, not required for a submission to succeed. Contact
  form email requires `RESEND_API_KEY` and `CONTACT_FROM_EMAIL` (verified sender domain in
  Resend); subscribe form email requires `BUTTONDOWN_API_KEY`. Without them, the form still
  succeeds (row is stored in Supabase), it just skips the email and logs why server-side.
  `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` are required for the
  forms to work at all. See `.env.example` and `DEPLOY.md`.

## Resolved
- Contact + subscribe forms write to Supabase (`contact_submissions` / `subscribers`) as
  the source of truth, then best-effort notify via Resend (`app/api/contact/route.ts`) and
  Buttondown (`app/api/subscribe/route.ts`).
- Fonts migrated to `next/font/google` (Cormorant Garamond, Instrument Sans), exposed as
  `--font-serif` / `--font-sans` consumed by `--serif` / `--sans` in globals.css.
- Scroll-reveal ported via `components/ScrollReveal.tsx` (IntersectionObserver, threshold
  0.1, respects prefers-reduced-motion). Deferred one animation frame on mount so it
  doesn't race hydration of Suspense-deferred client components (e.g. ContactForm).
- All 22 Wikimedia field-note image URLs fetch-verified (200).
- `app/sitemap.ts`, `app/robots.ts`, and per-post JSON-LD Article schema added.
