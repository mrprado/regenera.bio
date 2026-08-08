import Link from "next/link";
import type { Counterparty } from "@/lib/counterparties";

export default function CounterpartyPage({ c }: { c: Counterparty }) {
  return (
    <div className="tabpg">
      <div className="th">
        <div className="w">
          <div className="ey lt">
            <div className="ey-b"></div>
            <span>{c.navLabel}</span>
          </div>
          <h1>
            {c.headline} <em>{c.headlineEm}</em>
          </h1>
          <p className="lede">{c.deck}</p>
          <div className="hcta" style={{ marginTop: "1.8rem" }}>
            <Link href={c.ctaPath} className="btn btn-gold">
              {c.ctaLabel} <span className="arr">&rarr;</span>
            </Link>
          </div>
        </div>
      </div>

      <section className="sec">
        <div className="w">
          <div className="split r">
            <div>
              <div className="ey">
                <div className="ey-b"></div>
                <span>Who This Is For</span>
              </div>
            </div>
            <ul style={{ fontSize: 14.5, fontWeight: 300, color: "var(--t-mid)", lineHeight: 1.9, paddingLeft: 18 }}>
              {c.whoFits.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="sec sec-n">
        <div className="w">
          <div className="split r">
            <div>
              <div className="ey lt">
                <div className="ey-b"></div>
                <span>Signs It&apos;s Time to Talk</span>
              </div>
            </div>
            <ul style={{ fontSize: 14.5, fontWeight: 300, color: "rgba(214,231,203,0.6)", lineHeight: 1.9, paddingLeft: 18 }}>
              {c.triggers.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="sec">
        <div className="w">
          <div className="ey r">
            <div className="ey-b"></div>
            <span>Where This Usually Starts</span>
          </div>
          <p className="lede r d1" style={{ maxWidth: 720, marginBottom: "2rem" }}>
            {c.bestOffer}
          </p>
          <Link href={c.ctaPath} className="btn btn-gold">
            {c.ctaLabel} <span className="arr">&rarr;</span>
          </Link>
        </div>
      </section>
    </div>
  );
}
