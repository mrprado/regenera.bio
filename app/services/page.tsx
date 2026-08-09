import type { Metadata } from "next";
import Link from "next/link";
import ServiceTabs from "@/components/ServiceTabs";
import { PRACTICES, TYPICAL_ENGAGEMENTS, getPractice, type PracticeSlug } from "@/lib/practices";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Regenera's practices: Advisory, Capital Partnerships, Project Readiness, Development, Asset Strategy, and Intelligence, applied across real assets and infrastructure."
};

const VALID_TABS = PRACTICES.map((p) => p.slug);

export default function ServicesPage({
  searchParams
}: {
  searchParams: { tab?: string };
}) {
  const tab = (VALID_TABS as string[]).includes(searchParams.tab ?? "")
    ? (searchParams.tab as PracticeSlug)
    : "advisory";

  return (
    <div className="tabpg">
      <div className="th">
        <div className="w">
          <div className="ey lt">
            <div className="ey-b"></div>
            <span>Services</span>
          </div>
          <h1>
            From strategy <em>to execution.</em>
          </h1>
          <p className="lede">
            Regenera works across real assets and infrastructure, from early advisory and
            capital strategy through project readiness, development, asset strategy, and
            long-term intelligence. Applied across twelve sectors, see{" "}
            <Link href="/sectors">Sectors</Link>.
          </p>
        </div>
      </div>

      <section className="sec">
        <div className="w">
          <ServiceTabs initial={tab} />
        </div>
      </section>

      <section className="sec sec-n">
        <div className="w">
          <div className="ey lt r">
            <div className="ey-b"></div>
            <span>Typical Engagements</span>
          </div>
          <h2 className="h2 r d1" style={{ marginBottom: "2rem", color: "var(--cream)" }}>
            How clients <em style={{ color: "var(--mist)" }}>actually engage Regenera.</em>
          </h2>
          <div className="g3 r d2">
            {TYPICAL_ENGAGEMENTS.map((e) => {
              const practice = getPractice(e.practice);
              return (
                <div className="card" key={e.title}>
                  <div className="ct">{e.title}</div>
                  <div className="cb">{practice?.title}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="sec">
        <div className="w">
          <div className="ey r">
            <div className="ey-b"></div>
            <span>Sector Connection</span>
          </div>
          <p className="lede r d1" style={{ maxWidth: 640, marginBottom: "2rem" }}>
            These practices are applied across twelve sectors, from energy and water to
            materials, real estate, and environmental intelligence. The practice is what
            Regenera does; the sector is where.
          </p>
          <Link href="/sectors" className="btn btn-gold">
            Explore Sectors <span className="arr">&rarr;</span>
          </Link>
        </div>
      </section>

      <section className="sec sec-d">
        <div className="w">
          <div className="ey lt r">
            <div className="ey-b"></div>
            <span>Get Started</span>
          </div>
          <h2 className="h2 r d1" style={{ color: "var(--cream)", marginBottom: "1rem" }}>
            Have a project, asset, <em style={{ color: "var(--mist)" }}>or mandate?</em>
          </h2>
          <p className="lede r d2" style={{ maxWidth: 640, marginBottom: "2rem", color: "rgba(214,231,203,0.6)" }}>
            Regenera can help establish what is viable, what is missing, who needs to be
            involved, and what should happen next.
          </p>
          <Link href="/contact?path=general&service=advisory" className="btn btn-gold">
            Discuss an Opportunity <span className="arr">&rarr;</span>
          </Link>
        </div>
      </section>
    </div>
  );
}
