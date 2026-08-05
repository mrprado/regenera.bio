import type { Metadata } from "next";
import EcosystemMap from "@/components/EcosystemMap";

export const metadata: Metadata = {
  title: "Philosophy",
  description:
    "Capital should behave like a living system. The principles and ecosystem framework behind Regenera Advisory's practice."
};

export default function PhilosophyPage() {
  return (
    <div className="tabpg">
      <div className="th">
        <div className="w">
          <div className="ey lt">
            <div className="ey-b"></div>
            <span>Philosophy</span>
          </div>
          <h1>
            Capital should behave like a <em>living system.</em>
          </h1>
          <p className="lede">
            ESG applies filters to the existing financial system. Regenerative economics
            redesigns the capital structure itself to align with how living systems actually
            create and hold value. That distinction runs through everything we do.
          </p>
          <p style={{ marginTop: "1.6rem", fontFamily: "var(--serif)", fontStyle: "italic", fontSize: "1.3rem", lineHeight: 1.5, color: "var(--gold)", maxWidth: 640 }}>
            &ldquo;Capital becomes regenerative when it strengthens the living systems on which
            its value depends.&rdquo;
          </p>
        </div>
      </div>

      

      <section className="sec">
        <div className="w">
          <div className="ey r">
            <div className="ey-b"></div>
            <span>Eight Operating Principles</span>
          </div>
          <h2 className="h2 r d1" style={{ marginBottom: "1rem" }}>
            The disciplines guiding <em>every engagement.</em>
          </h2>
          <p className="lede r d1" style={{ marginBottom: "2.6rem" }}>
            The disciplines guiding every engagement across land, infrastructure, capital, and
            project delivery.
          </p>
          <div className="prin r d2">
            <div>
              <strong>Place Based Intelligence</strong>Every engagement begins with the realities
              of place. Land, ecology, water, infrastructure, regulation, markets, culture, and
              community.
            </div>
            <div>
              <strong>Community Legitimacy</strong>Projects should create durable local value,
              respond to community priorities, and earn the trust required for long term
              operation.
            </div>
            <div>
              <strong>Systems Integration</strong>We identify value at the intersections of
              land, water, energy, waste, food systems, mobility, infrastructure, and capital.
            </div>
            <div>
              <strong>Resilience and Bankability</strong>We balance efficiency, resilience,
              adaptability, and risk adjusted performance to support long term project
              viability.
            </div>
            <div>
              <strong>Aligned Governance</strong>We establish clear roles, aligned incentives,
              decision rights, and accountability among landowners, developers, communities,
              authorities, technical partners, operators, and capital providers.
            </div>
            <div>
              <strong>Circular Resource Design</strong>We seek to convert waste, water, heat,
              materials, and underutilized assets into productive inputs where technically and
              economically viable.
            </div>
            <div>
              <strong>Adaptive Execution</strong>Strategies and structures evolve as technical
              data, permitting conditions, stakeholder requirements, and market signals become
              clearer.
            </div>
            <div>
              <strong>Whole System Value</strong>We assess value across financial performance,
              ecological condition, community outcomes, institutional capacity, and the long
              term quality of place.
            </div>
          </div>
        </div>
      </section>

      <section className="sec sec-n">
        <div className="w">
          <div className="split r">
            <div>
              <div className="ey lt">
                <div className="ey-b"></div>
                <span>The Ecosystem Map</span>
              </div>
              <h2 className="h2" style={{ color: "var(--cream)" }}>
                From soil <em style={{ color: "var(--mist)" }}>to orbit.</em>
              </h2>
            </div>
            <p style={{ fontSize: 14.5, fontWeight: 300, color: "rgba(214,231,203,0.5)", lineHeight: 1.82 }}>
              Seven interconnected layers, one living system. Across each layer, we identify
              the interventions, partnerships, and capital structures that strengthen the system
              around them.
            </p>
          </div>
          <EcosystemMap className="r d1" />
        </div>
      </section>

      <section className="sec">
        <div className="w">
          <div className="ey r">
            <div className="ey-b"></div>
            <span>Why Now</span>
          </div>
          <h2 className="h2 r d1" style={{ marginBottom: "2.6rem" }}>
            Six forces, <em>one direction.</em>
          </h2>
          <div className="g3 r d2">
            <div className="card">
              <div className="ct">Capital Reallocation</div>
              <div className="cb">
                Institutional and private capital is increasingly seeking resilient real assets
                across energy, infrastructure, land, water, and environmental markets. At the
                same time, capital is becoming more selective about project readiness,
                governance, risk allocation, and measurable performance.
              </div>
            </div>
            <div className="card">
              <div className="ct">Natural Assets</div>
              <div className="cb">
                Water security, soil condition, ecological integrity, infrastructure access,
                permitting, and development rights are becoming increasingly important to long
                term land value and project viability.
              </div>
            </div>
            <div className="card">
              <div className="ct">Energy Transition</div>
              <div className="cb">
                Electrification, industry, data infrastructure, mobility, and urban growth are
                increasing demand for reliable generation, storage, grid capacity, and
                distributed energy infrastructure.
              </div>
            </div>
            <div className="card">
              <div className="ct">Waste as Resource</div>
              <div className="cb">
                Rising waste volumes, disposal costs, and resource pressure are creating demand
                for infrastructure that converts suitable waste streams into energy, fuels,
                materials, and other productive outputs.
              </div>
            </div>
            <div className="card">
              <div className="ct">Project Readiness</div>
              <div className="cb">
                Many credible opportunities remain unfunded because land control, technical
                studies, permits, governance, documentation, financial structures, and delivery
                strategies have not yet been developed to an investable standard.
              </div>
            </div>
            <div className="card">
              <div className="ct">Integrated Delivery</div>
              <div className="cb">
                Projects increasingly require coordinated execution across landowners,
                developers, technical teams, EPC providers, public authorities, communities,
                operators, and capital providers.
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
