import type { Metadata } from "next";

export const metadata: Metadata = { title: "Cookies" };

export default function CookiesPage() {
  return (
    <div className="tabpg">
      <div className="th">
        <div className="w">
          <div className="ey lt">
            <div className="ey-b"></div>
            <span>Legal</span>
          </div>
          <h1>Cookies</h1>
        </div>
      </div>
      <section className="sec">
        <div className="w" style={{ maxWidth: 720 }}>
          <p style={{ fontSize: 14, fontWeight: 300, color: "var(--t-mid)", lineHeight: 1.8 }}>
            This website uses essential cookies only: a single preference that remembers you
            have seen the cookie notice. We do not use advertising, tracking, or analytics
            cookies that identify you personally.
          </p>
        </div>
      </section>
    </div>
  );
}
