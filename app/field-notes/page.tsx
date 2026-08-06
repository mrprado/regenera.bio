import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { POSTS } from "@/lib/fieldNotes";
import SubscribeForm from "@/components/SubscribeForm";

export const metadata: Metadata = {
  title: "Field Notes",
  description:
    "A running record across everything the practice touches: energy systems, land and agriculture, real estate and materials, water, waste, capital markets, and orbital verification."
};

export default function FieldNotesPage() {
  const ordered = [...POSTS].reverse();

  return (
    <div className="tabpg">
      <div className="th">
        <div className="w">
          <div className="ey lt">
            <div className="ey-b"></div>
            <span>Field Notes</span>
          </div>
          <h1>
            Where systems, capital, and <em>place converge.</em>
          </h1>
          <p className="lede">
            Analysis and observations across energy, land, water, food, waste, real estate,
            infrastructure, and environmental intelligence.
          </p>
        </div>
      </div>
      <section className="sec">
        <div className="w">
          <div className="jgrid r">
            {ordered.map((p) => (
              <Link key={p.slug} href={`/field-notes/${p.slug}`} className="jcard">
                <Image src={p.img} alt={p.imgAlt} width={400} height={160} style={{ width: "100%", height: 160, objectFit: "cover" }} />
                <div className="jbody">
                  <div className="jmeta">
                    <span>{p.date}</span>
                    <span className="jtheme">{p.theme}</span>
                  </div>
                  <div className="jt">{p.title}</div>
                  <div className="jd">{p.teaser}</div>
                  <span className="jread">
                    Read <span className="arr">&rarr;</span>
                  </span>
                </div>
              </Link>
            ))}
          </div>
          <div className="sub-bar r d1" style={{ marginTop: "3rem" }}>
            <div>
              <div style={{ fontFamily: "var(--serif)", fontSize: "1.4rem", color: "var(--cream)" }}>
                The Regenera Letter
              </div>
              <div style={{ fontSize: 13, fontWeight: 300, color: "rgba(214,231,203,0.45)", marginTop: 4 }}>
                Field Notes, delivered monthly. Unsubscribe anytime.
              </div>
            </div>
            <SubscribeForm />
          </div>
        </div>
      </section>
    </div>
  );
}
