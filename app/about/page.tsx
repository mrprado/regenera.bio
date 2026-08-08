import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About",
  description:
    "Why Regenera exists, how it works across disciplines, and how it coordinates specialists rather than replacing them."
};

export default function AboutPage() {
  return (
    <div className="tabpg">
      <div className="th">
        <div className="w">
          <div className="ey lt">
            <div className="ey-b"></div>
            <span>About</span>
          </div>
          <h1>
            One point of coordination <em>across a multidisciplinary project.</em>
          </h1>
          <p className="lede">
            Every asset exists inside a larger system. The system around the asset determines
            the performance of the asset. Regenera exists to understand that system, identify
            the leverage points, coordinate the intervention, and align the right capital and
            counterparties around it.
          </p>
        </div>
      </div>

      <section className="sec">
        <div className="w">
          <div className="split r">
            <div>
              <div className="ey">
                <div className="ey-b"></div>
                <span>Interdisciplinary Practice</span>
              </div>
              <h2 className="h2" style={{ marginBottom: "1rem" }}>
                We coordinate. <em>We don&apos;t replace.</em>
              </h2>
            </div>
            <p style={{ fontSize: 14.5, fontWeight: 300, color: "var(--t-mid)", lineHeight: 1.82 }}>
              Regenera does not replace the engineers, scientists, designers, counsel, financial
              professionals, or other specialists a project requires. We work across those
              disciplines: defining the system, identifying dependencies and constraints,
              sequencing the work, coordinating counterparties, and translating findings into
              development and capital decisions. See our{" "}
              <Link href="/philosophy">Philosophy</Link> for the principles behind this, and the
              full detail of what we do and do not claim to do in{" "}
              <Link href="/services">Services</Link>.
            </p>
          </div>
        </div>
      </section>

      <section className="sec sec-n">
        <div className="w">
          <div className="split r">
            <div>
              <div className="ey lt">
                <div className="ey-b"></div>
                <span>Experience &amp; Geographies</span>
              </div>
            </div>
            <div className="trust-in" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: 20 }}>
              <div className="ti">
                <div className="tv">7</div>
                <div className="tk">Ecosystem Layers</div>
              </div>
              <div className="ti">
                <div className="tv">10 GW</div>
                <div className="tk">Energy Pipeline</div>
              </div>
              <div className="ti">
                <div className="tv">30+</div>
                <div className="tk">Projects and Mandates</div>
              </div>
              <div className="ti">
                <div className="tv">5+</div>
                <div className="tk">Countries Engaged</div>
              </div>
              <div className="ti">
                <div className="tv">Global</div>
                <div className="tk">Capital and Technical Network</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="sec">
        <div className="w">
          <div className="split r">
            <div>
              <div className="ey">
                <div className="ey-b"></div>
                <span>Partner Ecosystem</span>
              </div>
            </div>
            <p style={{ fontSize: 14.5, fontWeight: 300, color: "var(--t-mid)", lineHeight: 1.82 }}>
              We coordinate with engineering, EPC, architecture, hydrology, ecology, agriculture,
              geology, legal, project finance, real estate, Earth observation, aerospace, and
              project management specialists as each engagement requires. We name a specific
              partner firm publicly only where that partner has agreed to be named in that
              specific context, general references to a discipline describe the category of
              relationship we coordinate, not a claim that a specific named firm is currently
              engaged unless it genuinely is.
            </p>
          </div>
        </div>
      </section>

      <section className="sec sec-n">
        <div className="w">
          <div className="ey lt r">
            <div className="ey-b"></div>
            <span>Governance &amp; Legal Positioning</span>
          </div>
          <p className="lede r d1" style={{ maxWidth: 720 }}>
            Regenera is an advisory practice. It is not a broker-dealer, registered investment
            adviser, underwriter, placement agent, or fund manager. Full detail is in the
            Important Notice available from the footer on every page.
          </p>
        </div>
      </section>
    </div>
  );
}
