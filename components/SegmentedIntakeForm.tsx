"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { INTAKE_CONFIGS, type IntakeType } from "@/lib/intakeFields";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function SegmentedIntakeForm({ type }: { type: IntakeType }) {
  const config = INTAKE_CONFIGS[type];
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<{ msg: string; ok: boolean } | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [pending, setPending] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    if (String(formData.get("website") ?? "").trim()) {
      // Honeypot filled in: silently pretend success, don't tip off the bot.
      setStatus({ msg: "Thank you. We'll review and follow up.", ok: true });
      setSubmitted(true);
      return;
    }

    const name = String(formData.get("name") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const org = String(formData.get("org") ?? "").trim();
    const phone = String(formData.get("phone") ?? "").trim();
    const message = String(formData.get("message") ?? "").trim();
    const consent = formData.get("consent") === "on";

    if (!name || !email) {
      setStatus({ msg: "Please complete your name and email so we know who to follow up with.", ok: false });
      return;
    }
    if (!EMAIL_RE.test(email)) {
      setStatus({ msg: "That email address does not look complete. Please check it and try again.", ok: false });
      return;
    }
    if (!consent) {
      setStatus({ msg: "Please confirm the acknowledgement above so we can process your submission.", ok: false });
      return;
    }

    const fields: Record<string, string> = {};
    for (const f of config.fields) {
      const value = String(formData.get(f.name) ?? "").trim();
      if (f.required && !value) {
        setStatus({ msg: `Please complete "${f.label}".`, ok: false });
        return;
      }
      if (value) fields[f.name] = value;
    }

    setPending(true);
    try {
      const res = await fetch("/api/intake", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          intake_type: type,
          name,
          email,
          org: org || null,
          phone: phone || null,
          fields,
          message: message || null,
          consent,
          page_path: typeof window !== "undefined" ? window.location.pathname : null,
          referrer: typeof document !== "undefined" ? document.referrer || null : null,
          utm_source: searchParams.get("utm_source"),
          utm_medium: searchParams.get("utm_medium"),
          utm_campaign: searchParams.get("utm_campaign"),
          service: searchParams.get("service")
        })
      });
      const data = await res.json().catch(() => null);

      if (!res.ok || !data?.ok) {
        setStatus({
          msg: data?.error || "We could not send this right now. Please try again shortly or email us directly.",
          ok: false
        });
        setPending(false);
        return;
      }

      setStatus({ msg: "Thank you. We'll review and follow up.", ok: true });
      setSubmitted(true);
    } catch {
      setStatus({
        msg: "We could not send this right now. Please try again shortly or email us directly.",
        ok: false
      });
      setPending(false);
    }
  }

  return (
    <form className="cform" onSubmit={handleSubmit} noValidate>
      {/* Honeypot: hidden from sighted users and screen readers, real
          submitters never fill this in. A bot that fills every field will. */}
      <div aria-hidden="true" style={{ position: "absolute", left: "-9999px", width: 1, height: 1, overflow: "hidden" }}>
        <label htmlFor="si-website">Website</label>
        <input id="si-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>
      <div className="fgr">
        <div className="fg">
          <label htmlFor="si-name">Name</label>
          <input id="si-name" name="name" type="text" required autoComplete="name" disabled={submitted || pending} />
        </div>
        <div className="fg">
          <label htmlFor="si-org">{config.orgLabel}</label>
          <input id="si-org" name="org" type="text" autoComplete="organization" disabled={submitted || pending} />
        </div>
      </div>
      <div className="fgr">
        <div className="fg">
          <label htmlFor="si-email">Email</label>
          <input id="si-email" name="email" type="email" required autoComplete="email" disabled={submitted || pending} />
        </div>
        <div className="fg">
          <label htmlFor="si-phone">Phone (optional)</label>
          <input id="si-phone" name="phone" type="tel" autoComplete="tel" disabled={submitted || pending} />
        </div>
      </div>

      {config.fields.map((f) => (
        <div className="fg" key={f.name}>
          <label htmlFor={`si-${f.name}`}>{f.label}</label>
          {f.type === "select" ? (
            <select id={`si-${f.name}`} name={f.name} required={f.required} disabled={submitted || pending} defaultValue="">
              <option value="" disabled>
                Select one
              </option>
              {f.options?.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          ) : (
            <input
              id={`si-${f.name}`}
              name={f.name}
              type="text"
              required={f.required}
              placeholder={f.placeholder}
              disabled={submitted || pending}
            />
          )}
        </div>
      ))}

      <div className="fg">
        <label htmlFor="si-message">{config.messageLabel}</label>
        <textarea id="si-message" name="message" placeholder={config.messagePlaceholder} disabled={submitted || pending}></textarea>
      </div>

      <div className="consent">
        <input type="checkbox" id="si-consent" name="consent" required disabled={submitted || pending} />
        <label htmlFor="si-consent">
          I confirm I am a sophisticated, professional, or institutional counterparty, and I
          consent to Regenera Advisory contacting me in connection with this submission. I
          understand this does not guarantee a meeting or the acceptance of a mandate, and that
          this website does not constitute investment advice or a solicitation. Data is
          processed in accordance with applicable data protection law (GDPR / UK GDPR / CCPA).
        </label>
      </div>

      <button type="submit" className="btn btn-gold" style={{ width: "100%", justifyContent: "center" }} disabled={submitted || pending}>
        {config.submitLabel}
      </button>
      {status && (
        <p
          role="status"
          style={{
            marginTop: "1rem",
            fontSize: 13.5,
            fontWeight: 400,
            lineHeight: 1.6,
            color: status.ok ? "var(--sage)" : "#8c4a2a"
          }}
        >
          {status.msg}
        </p>
      )}
    </form>
  );
}
