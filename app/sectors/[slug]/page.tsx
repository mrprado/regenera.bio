import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SECTORS, getSector } from "@/lib/sectors";
import FromFieldNotes from "@/components/FromFieldNotes";

export function generateStaticParams() {
  return SECTORS.map((s) => ({ slug: s.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const sector = getSector(params.slug);
  if (!sector) return {};
  return {
    title: sector.name,
    description: sector.deck
  };
}

export default function SectorPage({ params }: { params: { slug: string } }) {
  const sector = getSector(params.slug);
  if (!sector) notFound();

  return (
    <div className="tabpg">
      <div className="th">
        <div className="w">
          <div className="ey lt">
            <div className="ey-b"></div>
            <span>Sectors</span>
          </div>
          <h1>{sector.name}</h1>
          <p className="lede">{sector.deck}</p>
        </div>
      </div>

      <section className="sec">
        <div className="w">
          <div className="split r">
            <div>
              <div className="ey">
                <div className="ey-b"></div>
                <span>What This Covers</span>
              </div>
            </div>
            <ul style={{ fontSize: 14.5, fontWeight: 300, color: "var(--t-mid)", lineHeight: 1.9, paddingLeft: 18 }}>
              {sector.scope.map((item) => (
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
                <span>Why It Matters</span>
              </div>
            </div>
            <p style={{ fontSize: 14.5, fontWeight: 300, color: "rgba(214,231,203,0.6)", lineHeight: 1.82 }}>
              {sector.why}
            </p>
          </div>
        </div>
      </section>

      <section className="sec">
        <div className="w">
          <FromFieldNotes category={sector.fieldNotesCategory} />
          <div style={{ marginTop: "2.4rem", display: "flex", gap: 14, flexWrap: "wrap" }}>
            <Link href="/contact?path=general" className="btn btn-gold">
              Discuss a Project <span className="arr">&rarr;</span>
            </Link>
            <Link href="/sectors" className="btn btn-line">
              All Sectors
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
