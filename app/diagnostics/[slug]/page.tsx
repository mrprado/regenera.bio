import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DIAGNOSTICS, getDiagnostic } from "@/lib/diagnostics";

export function generateStaticParams() {
  return DIAGNOSTICS.map((d) => ({ slug: d.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const d = getDiagnostic(params.slug);
  if (!d) return {};
  return { title: d.name, description: d.deck };
}

export default function DiagnosticPage({ params }: { params: { slug: string } }) {
  const d = getDiagnostic(params.slug);
  if (!d) notFound();

  return (
    <div className="tabpg">
      <div className="th">
        <div className="w">
          <div className="ey lt">
            <div className="ey-b"></div>
            <span>Diagnostic</span>
          </div>
          <h1>{d.name}</h1>
          <p className="lede">
            <em>{d.question}</em>
          </p>
          <p style={{ fontSize: 14.5, fontWeight: 300, color: "var(--t-mid)", lineHeight: 1.82, maxWidth: 640, marginTop: "1rem" }}>
            {d.deck}
          </p>
        </div>
      </div>

      <section className="sec">
        <div className="w">
          <div className="split r">
            <div>
              <div className="ey">
                <div className="ey-b"></div>
                <span>What You Get</span>
              </div>
            </div>
            <ul style={{ fontSize: 14.5, fontWeight: 300, color: "var(--t-mid)", lineHeight: 1.9, paddingLeft: 18 }}>
              {d.outputs.map((item) => (
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
                <span>Best Fit</span>
              </div>
            </div>
            <p style={{ fontSize: 14.5, fontWeight: 300, color: "rgba(214,231,203,0.6)", lineHeight: 1.82 }}>
              {d.bestFor}
            </p>
          </div>
        </div>
      </section>

      <section className="sec">
        <div className="w">
          <div className="hcta">
            <Link href={d.ctaPath} className="btn btn-gold">
              Start a Conversation <span className="arr">&rarr;</span>
            </Link>
            <Link href="/services" className="btn btn-line">
              All Services
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
