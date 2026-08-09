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
            Real systems. <em>Interconnected markets.</em>
          </h1>
          <p className="lede">
            Regenera works across the physical systems that shape land, infrastructure,
            resource use, asset performance, and long-term development value.
          </p>
          <p style={{ fontSize: 14.5, fontWeight: 300, color: "var(--t-mid)", lineHeight: 1.82, marginTop: "1rem" }}>
            Each sector is approached on its own terms, while recognizing the
            dependencies that connect energy, water, land, materials, communities,
            infrastructure, and capital.
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
