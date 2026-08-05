import type { Metadata } from "next";
import { Suspense } from "react";
import ContactForm from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "For partnerships, advisory engagements, development opportunities, and general inquiries. Every message is read personally."
};

export default function ContactPage() {
  return (
    <div className="tabpg">
      <div className="th">
        <div className="w">
          <div className="ey lt">
            <div className="ey-b"></div>
            <span>Contact</span>
          </div>
          <h1>
            Contact <em>Regenera.</em>
          </h1>
          <p className="lede">
            For partnerships, advisory engagements, development opportunities, and general
            inquiries. Every message is read personally.
          </p>
          <p style={{ marginTop: "1.2rem", fontSize: 15, fontWeight: 400, color: "var(--gold)" }}>
            <a
              href="mailto:info@regenera.bio"
              style={{ color: "var(--gold)", textDecoration: "none", borderBottom: "1px solid rgba(201,168,76,0.35)" }}
            >
              info@regenera.bio
            </a>
          </p>
        </div>
      </div>
      <section className="sec">
        <div className="w">
          <Suspense fallback={null}>
            <ContactForm />
          </Suspense>
        </div>
      </section>
    </div>
  );
}
