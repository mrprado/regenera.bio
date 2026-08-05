import type { Metadata } from "next";

export const metadata: Metadata = { title: "Privacy" };

const P = { fontSize: 14, fontWeight: 300, color: "var(--t-mid)", lineHeight: 1.8, marginBottom: "1.2rem" } as const;

export default function PrivacyPage() {
  return (
    <div className="tabpg">
      <div className="th">
        <div className="w">
          <div className="ey lt">
            <div className="ey-b"></div>
            <span>Legal</span>
          </div>
          <h1>Privacy</h1>
        </div>
      </div>
      <section className="sec">
        <div className="w" style={{ maxWidth: 720 }}>
          <p style={P}>
            We collect information you choose to provide through our contact and subscription
            forms and use it to respond to enquiries, manage communications, and deliver
            requested updates.
          </p>
          <p style={P}>
            Our website and service providers may process limited technical information required
            to operate, secure, and understand use of the site. We do not sell personal
            information or share it with third parties for their own marketing purposes.
          </p>
          <p style={P}>
            You may request access to, correction of, or deletion of your information, or
            unsubscribe from communications, by contacting{" "}
            <a href="mailto:info@regenera.bio" style={{ color: "var(--sage)" }}>
              info@regenera.bio
            </a>
            . Personal information is handled in accordance with applicable data protection
            laws.
          </p>
        </div>
      </section>
    </div>
  );
}
