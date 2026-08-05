import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Legal and Disclosures" };

export default function NoticePage() {
  return (
    <div className="tabpg">
      <div className="th">
        <div className="w">
          <div className="ey lt">
            <div className="ey-b"></div>
            <span>Legal and Disclosures</span>
          </div>
          <h1>Important Notice</h1>
        </div>
      </div>
      <section className="sec">
        <div className="w" style={{ maxWidth: 720 }}>
          <p style={{ fontSize: 14, fontWeight: 300, color: "var(--t-mid)", lineHeight: 1.8, marginBottom: "1.2rem" }}>
            Regenera Advisory provides project development, strategic consulting, capital
            alignment, and introductory services. Regenera is not registered as a broker dealer,
            investment adviser, underwriter, or placement agent and does not hold or manage
            client or investor funds.
          </p>
          <p style={{ fontSize: 14, fontWeight: 300, color: "var(--t-mid)", lineHeight: 1.8, marginBottom: "1.2rem" }}>
            For general informational purposes only and does not constitute investment, legal,
            or tax advice, an offer to sell, or a solicitation to purchase any security. Any
            investment opportunity referenced is offered solely by the relevant issuer or
            registered intermediary and remains subject to applicable law, independent due
            diligence, and definitive documentation. Project descriptions and figures do not
            represent investment performance, committed capital, or guaranteed results.
          </p>
          <p style={{ fontSize: 13, fontWeight: 300, color: "var(--t-soft)", lineHeight: 1.8 }}>
            See also our <Link href="/privacy" style={{ color: "var(--sage)" }}>Privacy</Link>{" "}
            and <Link href="/cookies" style={{ color: "var(--sage)" }}>Cookie</Link> statements.
          </p>
        </div>
      </section>
    </div>
  );
}
