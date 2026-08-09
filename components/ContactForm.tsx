"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { LEAD_INTEREST_LABELS } from "@/lib/leadOptions";

const LEAD_HANDOFF_KEY = "rg_lead_handoff";

const PATHS = [
  { id: "investor", label: "Investor", sub: "Family office, institution, or impact fund" },
  { id: "developer", label: "Project Developer", sub: "Solar, waste to energy, infrastructure" },
  { id: "realestate", label: "Real Estate & Land", sub: "Owner, developer, or landholder" },
  { id: "operator", label: "Place or Operator", sub: "Municipality, utility, or operation" },
  { id: "partner", label: "Partnership", sub: "Advisors, technology, and ecosystem partners" },
  { id: "media", label: "Media & Research", sub: "Papers, interviews, and speaking" }
];

export default function ContactForm() {
  const searchParams = useSearchParams();
  const [selected, setSelected] = useState<string>("general");
  const [status, setStatus] = useState<{ msg: string; ok: boolean } | null>(null);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const p = searchParams.get("path");
    if (p && PATHS.some((x) => x.id === p)) setSelected(p);
  }, [searchParams]);

  const emailRef = useRef<HTMLInputElement>(null);
  const messageRef = useRef<HTMLTextAreaElement>(null);

  // One-time handoff from the lead-qualification modal, read imperatively
  // (not via defaultValue/state) so it never has to match server-rendered
  // HTML during hydration. Consumed once, then cleared.
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(LEAD_HANDOFF_KEY);
      if (!raw) return;
      sessionStorage.removeItem(LEAD_HANDOFF_KEY);
      const data = JSON.parse(raw) as { email?: string; interests?: string[] };
      if (data.email && emailRef.current) {
        emailRef.current.value = data.email;
      }
      if (data.interests?.length && messageRef.current) {
        const labels = data.interests.map((i) => LEAD_INTEREST_LABELS[i]).filter(Boolean);
        if (labels.length) {
          messageRef.current.value = `Interested in: ${labels.join(", ")}.\n\n`;
        }
      }
    } catch {
      // Malformed or unavailable storage: prefill is a convenience, not required.
    }
  }, []);

  const [pending, setPending] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const name = (form.elements.namedItem("name") as HTMLInputElement).value.trim();
    const org = (form.elements.namedItem("org") as HTMLInputElement).value.trim();
    const email = (form.elements.namedItem("email") as HTMLInputElement).value.trim();
    const type = (form.elements.namedItem("type") as HTMLSelectElement).value;
    const msg = (form.elements.namedItem("message") as HTMLTextAreaElement).value.trim();
    const consent = (form.elements.namedItem("consent") as HTMLInputElement).checked;

    if (!name || !email || !msg) {
      setStatus({ msg: "Please complete your name, email, and a brief context so we know how to help.", ok: false });
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setStatus({ msg: "That email address does not look complete. Please check it and try again.", ok: false });
      return;
    }
    if (!consent) {
      setStatus({ msg: "Please confirm the acknowledgement above so we can process your enquiry.", ok: false });
      return;
    }

    setPending(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, org, email, type, message: msg, consent, service: searchParams.get("service") })
      });
      const data = await res.json().catch(() => null);

      if (!res.ok || !data?.ok) {
        setStatus({
          msg: data?.error || "We could not send your enquiry right now. Please try again shortly or email us directly.",
          ok: false
        });
        setPending(false);
        return;
      }

      setStatus({
        msg: "Thank you for your inquiry. We'll be in touch.",
        ok: true
      });
      setSubmitted(true);
    } catch {
      setStatus({
        msg: "We could not send your enquiry right now. Please try again shortly or email us directly.",
        ok: false
      });
      setPending(false);
    }
  }

  return (
    <div className="contact-grid">
      <div>
        <div className="ey r">
          <div className="ey-b"></div>
          <span>Choose Your Path</span>
        </div>
        <div className="paths r d1" role="group" aria-label="Enquiry type">
          {PATHS.map((p) => (
            <button
              key={p.id}
              type="button"
              className={"path" + (selected === p.id ? " on" : "")}
              onClick={() => setSelected(p.id)}
            >
              <span className="pk">{p.label}</span>
              <span className="px" style={{ display: "block" }}>
                {p.sub}
              </span>
            </button>
          ))}
        </div>
        <p className="r d2" style={{ marginTop: "1.6rem", fontSize: 12.5, fontWeight: 300, color: "var(--t-soft)", lineHeight: 1.7 }}>
          Selecting a path pre-fills the form. Every enquiry goes to the same desk either way:{" "}
          <a
            href="mailto:info@regenera.bio"
            style={{ fontWeight: 500, color: "var(--ink)", textDecoration: "none", borderBottom: "1px solid rgba(38,50,31,0.3)" }}
          >
            info@regenera.bio
          </a>
          .
        </p>
      </div>
      <form className="cform r d1" onSubmit={handleSubmit} noValidate>
        <div className="fgr">
          <div className="fg">
            <label htmlFor="f-name">Name</label>
            <input id="f-name" name="name" type="text" required autoComplete="name" disabled={submitted || pending} />
          </div>
          <div className="fg">
            <label htmlFor="f-org">Organisation</label>
            <input id="f-org" name="org" type="text" autoComplete="organization" disabled={submitted || pending} />
          </div>
        </div>
        <div className="fgr">
          <div className="fg">
            <label htmlFor="f-email">Email</label>
            <input ref={emailRef} id="f-email" name="email" type="email" required autoComplete="email" disabled={submitted || pending} />
          </div>
          <div className="fg">
            <label htmlFor="f-type">I am a</label>
            <select id="f-type" name="type" value={selected} onChange={(e) => setSelected(e.target.value)} disabled={submitted || pending}>
              <option value="general">Select one</option>
              {PATHS.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.id === "investor"
                    ? "Investor"
                    : p.id === "developer"
                    ? "Project developer"
                    : p.id === "realestate"
                    ? "Real estate or land owner"
                    : p.id === "operator"
                    ? "Municipality or operator"
                    : p.id === "partner"
                    ? "Potential partner"
                    : "Media or research"}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="fg">
          <label htmlFor="f-msg">Brief context</label>
          <textarea
            ref={messageRef}
            id="f-msg"
            name="message"
            required
            placeholder="What are you working on, and what would be most useful to explore together?"
            disabled={submitted || pending}
          ></textarea>
        </div>
        <div className="consent">
          <input type="checkbox" id="f-consent" name="consent" required disabled={submitted || pending} />
          <label htmlFor="f-consent">
            I confirm I am a sophisticated, professional, or institutional counterparty, and I
            consent to Regenera Advisory contacting me in connection with my enquiry. I
            understand this website does not constitute investment advice or a solicitation.
            Data is processed in accordance with applicable data protection law (GDPR / UK GDPR
            / CCPA).
          </label>
        </div>
        <button type="submit" className="btn btn-gold" style={{ width: "100%", justifyContent: "center" }} disabled={submitted || pending}>
          Send Enquiry
        </button>
        {status && (
          <p role="status" style={{ marginTop: "1rem", fontSize: 13.5, fontWeight: 400, lineHeight: 1.6, color: status.ok ? "var(--sage)" : "#8c4a2a" }}>
            {status.msg}
          </p>
        )}
      </form>
    </div>
  );
}
