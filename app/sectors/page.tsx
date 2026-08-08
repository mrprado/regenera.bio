import type { Metadata } from "next";
import Link from "next/link";
import { SECTORS } from "@/lib/sectors";

export const metadata: Metadata = {
  title: "Sectors",
  description:
    "Where Regenera's practices are applied: energy, waste, water, land, agriculture, food systems, real estate, materials, mobility, natural capital, community health, and orbital intelligence."
};

export default function SectorsPage() {
  return (
    <div className="tabpg">
      <div className="th">
        <div className="w">
          <div className="ey lt">
            <div className="ey-b"></div>
            <span>Sectors</span>
          </div>
          <h1>
            Twelve sectors, <em>one method.</em>
          </h1>
          <p className="lede">
            Regenera&apos;s four practices apply the same systemic method across twelve
            sectors. Energy and waste remain distinct. Land, regenerative agriculture,
            and food systems remain distinct. Sectors cross-link constantly in practice,
            they are not collapsed here for convenience.
          </p>
        </div>
      </div>
      <section className="sec">
        <div className="w">
          <div className="g3 r d1">
            {SECTORS.map((s) => (
              <Link key={s.slug} href={`/sectors/${s.slug}`} className="card" style={{ display: "block" }}>
                <div className="ct">{s.name}</div>
                <div className="cb">{s.deck}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
