import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "How We Work",
  description:
    "Diagnose the system. Design the intervention. Align the capital. How Regenera Advisory works across development, infrastructure, capital, land, and real estate."
};

export default function HowWeWorkPage() {
  return (
    <div className="tabpg">
      <div className="th">
        <div className="w">
          <div className="ey lt">
            <div className="ey-b"></div>
            <span>How We Work</span>
          </div>
          <h1>
            Diagnose the system. Design the intervention. <em>Align the capital.</em>
          </h1>
          <p className="lede">
            The regenerative method is simple to state and demanding to practice. Before any
            capital, technology, or development decision, we map the whole system surrounding a
            project, then position the intervention where it can strengthen the most layers at
            once.
          </p>
        </div>
      </div>

      <section className="sec">
        <div className="w">
          <div className="ey r">
            <div className="ey-b"></div>
            <span>The Method</span>
          </div>
          <h2 className="h2 r d1" style={{ marginBottom: "1rem" }}>
            Three phases, <em>every engagement.</em>
          </h2>
          <p className="lede r d1" style={{ marginBottom: "3rem" }}>
            Regenera coordinates multidisciplinary teams across land, energy, infrastructure,
            real estate, and capital to advance complex projects from opportunity to execution.
          </p>
          <div className="phase-g r d2">
            <div className="phase">
              <div className="ph-k">Phase I</div>
              <div className="ph-t">Systemic Diagnosis</div>
              <div className="ph-b">
                We map the full ecosystem of a place or project across seven interconnected
                layers before capital, technology, or development decisions are made. The
                objective is to identify constraints, dependencies, and leverage points where
                targeted interventions can create cascading value across the system.
              </div>
            </div>
            <div className="phase">
              <div className="ph-k">Phase II</div>
              <div className="ph-t">Intervention Design</div>
              <div className="ph-b">
                We align land, infrastructure, technology, governance, partnerships, and
                commercial structures around the needs of the project and its wider system. The
                objective is to develop commercially viable interventions that strengthen
                long-term asset value, ecological performance, and community resilience.
              </div>
            </div>
            <div className="phase">
              <div className="ph-k">Phase III</div>
              <div className="ph-t">Capital Alignment</div>
              <div className="ph-b">
                <p style={{ marginBottom: "0.9rem" }}>
                  We prepare opportunities for engagement and coordinate relationships between
                  investors, developers, technical partners, and other counterparties whose
                  mandates align with the project&apos;s scale, geography, structure, and
                  objectives.
                </p>
                <p>The right capital, in the right place, on the right terms.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="sec" style={{ background: "var(--cream)", padding: "80px 0" }}>
        <div className="w">
          <div className="ey r">
            <div className="ey-b"></div>
            <span>Who We Work With</span>
          </div>
          <h2 className="h2 r d1" style={{ marginBottom: "2.6rem" }}>
            Four kinds of <em>counterparty.</em>
          </h2>
          <div className="g2 r d2">
            <div className="card">
              <div className="ct">Investors</div>
              <div className="cb">
                You have capital to deploy and a mandate to meet. We provide selectively sourced
                opportunities assessed for strategic fit, project readiness, commercial
                structure, and wider system value.
              </div>
            </div>
            <div className="card">
              <div className="ct">Project Developers</div>
              <div className="cb">
                You have a credible project that requires stronger positioning, technical
                coordination, delivery partners, or capital alignment. We help advance it toward
                institutional review and execution.
              </div>
            </div>
            <div className="card">
              <div className="ct">Real Estate and Land</div>
              <div className="cb">
                You control land or property with unrealized potential. We help structure it
                through site strategy, infrastructure integration, regenerative planning,
                development pathways, and aligned capital.
              </div>
            </div>
            <div className="card">
              <div className="ct">Places and Operators</div>
              <div className="cb">
                You manage a municipality, utility, destination, facility, or productive
                landscape. We help identify and coordinate the systems, infrastructure,
                partnerships, and capital required for resilient development.
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="sec">
        <div className="w">
          <div className="ey r">
            <div className="ey-b"></div>
            <span>The Process</span>
          </div>
          <h2 className="h2 r d1" style={{ marginBottom: "1rem" }}>
            Selective <em>on both sides.</em>
          </h2>
          <p className="lede r d2" style={{ marginBottom: "2.6rem" }}>
            We take on a limited number of engagements and work with counterparties prepared to
            provide the information, access, and commitment required to move an opportunity
            forward.
          </p>
          <div className="steps r d3">
            <div className="step">
              <div className="sk">Step 01</div>
              <div className="st">First Contact</div>
              <div className="sb">
                Tell us who you are, what you are working on, and the support you are seeking.
              </div>
            </div>
            <div className="step">
              <div className="sk">Step 02</div>
              <div className="st">Introductory Call</div>
              <div className="sb">
                A direct conversation about fit. We ask about your mandate or project, and you ask
                about our approach. No decks required.
              </div>
            </div>
            <div className="step">
              <div className="sk">Step 03</div>
              <div className="st">Scope and Agreement</div>
              <div className="sb">
                Where there is a credible fit, we define the scope, responsibilities, fees,
                deliverables, and confidentiality requirements.
              </div>
            </div>
            <div className="step">
              <div className="sk">Step 04</div>
              <div className="st">Active Through Delivery</div>
              <div className="sb">
                We coordinate the agreed workstreams, partners, information, and decisions
                required to advance the project or mandate.
              </div>
            </div>
          </div>
          <div style={{ marginTop: "3rem" }} className="r">
            <Link href="/contact?path=general" className="btn btn-gold">
              Get in Touch <span className="arr">&rarr;</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
