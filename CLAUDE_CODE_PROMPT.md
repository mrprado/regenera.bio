# Claude Code Prompt for regenera.bio

Setup:
  unzip regenera-nextjs.zip && cd regenera-nextjs
  cp ../regenera-bio-final.html ./reference-design.html
  npm install
  claude
Then paste the prompt below.

---

This folder contains the complete, approved Next.js 14 website for Regenera Advisory
(regenera.bio). The design, copy, structure, and images are FINAL. reference-design.html
in the project root is the approved single-file preview of the exact same site — it is
the visual and content reference of record. Your job is to make this codebase run
flawlessly and match that reference, then finish production wiring. Do NOT redesign,
rewrite copy, restructure pages, or "improve" anything visual or textual. Read CLAUDE.md
first — its hard rules (no em-dashes, no semicolons or stylistic colons in copy,
compliance text is verbatim and load-bearing, REGENERA logo styling, no Contact tab in
the header, no repeated images, no photo credits) override any default you have.

Work in this order, keeping npm run build green after every step:

1. VERIFY PARITY. Run npm run dev. Open reference-design.html in a browser beside it.
   Compare every page: Home (hero with 7-ring orbital, one dot per ring, rotating; four
   doors with CTAs Explore Opportunities / Advance a Project / Structure an Asset /
   Explore a Partnership; Regenera at a Glance bar; three practice pillars in order
   Energy Infrastructure & Real Estate, Project Readiness, Capital Introduction; the
   three-photo strip using /public/images), How We Work, Services (4 tabs, Energy first,
   no photos in panels, all CTAs gold), Philosophy (gold italic quote inline under the
   hero paragraph, Eight Operating Principles, ecosystem map at 490px where clicking a
   layer highlights ITS ring in ITS color), Projects & Partnerships (Energy / Real
   Estate / Waste / Capital Partnerships), Field Notes (22 posts, each with a unique
   image, no "Published since" line), Contact (path pre-selection via ?path= query),
   and the footer (Important Notice / Privacy / Cookies / Contact). Fix any divergence
   in the Next.js code so it matches the reference. Fix all hydration errors and
   console warnings.

2. IMAGES. Confirm all 22 Wikimedia Commons URLs in lib/fieldNotes.ts actually render.
   Any that 404: replace with a different freely licensed Commons image of the same
   subject, never reusing an image that appears anywhere else on the site. Confirm the
   three local images in public/images render on the home strip.

3. FORMS. Create app/api/contact/route.ts that emails submissions to info@regenera.bio
   (Resend preferred; nodemailer/SMTP acceptable; env vars with a .env.example). Wire
   ContactForm.tsx to POST to it, preserving the existing validation messages, consent
   gate, and disabled-after-submit behavior exactly. Wire SubscribeForm.tsx to the same
   pattern or Buttondown. On any backend error, show a graceful message that does not
   promise a response time.

4. FONTS. Migrate the <link> tags in app/layout.tsx to next/font/google (Cormorant
   Garamond ital+wght 300-600, Instrument Sans 300-600), exposing CSS variables so the
   existing --serif and --sans in globals.css work unchanged. Zero visual difference
   allowed.

5. MOTION. Add a small client component that applies the scroll-reveal already defined
   in CSS (.r gains .vis on first intersection, threshold 0.1), used on the sections
   that carry class "r" in reference-design.html. Respect prefers-reduced-motion.

6. SEO. Add app/sitemap.ts and app/robots.ts covering every route including all 22
   field-notes slugs. Add JSON-LD Article schema to app/field-notes/[slug]/page.tsx
   (headline, datePublished from the post's month, image, publisher Regenera Advisory).

7. QUALITY GATE. npx next lint clean, npm run build green, then grep the entire
   rendered output to confirm: zero em/en dashes, zero prose semicolons, "Bjarke"
   appears nowhere, every showTab/legacy artifact is gone, and no image URL appears
   twice. Report npm audit findings without upgrading past Next 14.

8. DEPLOY PREP. Add a vercel.json if needed, confirm next.config.js remotePatterns
   still cover upload.wikimedia.org, and write DEPLOY.md with the exact steps to ship
   on Vercel with the regenera.bio domain and the env vars from step 3.

Finish with a summary of every file you changed and anything a human should re-verify
by eye, with the reference comparison as the acceptance test.
