"use client";

import Link from "next/link";
import { useState } from "react";
import FromFieldNotes from "@/components/FromFieldNotes";

type TabId = "systems" | "readiness" | "assets" | "capital";

const TABS: { id: TabId; label: string }[] = [
  { id: "systems", label: "Systems & Place Advisory" },
  { id: "readiness", label: "Development & Project Readiness" },
  { id: "assets", label: "Real Assets & Infrastructure" },
  { id: "capital", label: "Capital Strategy & Alignment" }
];

export default function ServiceTabs({ initial = "systems" as TabId }: { initial?: TabId }) {
  const [active, setActive] = useState<TabId>(initial);

  return (
    <>
      <div className="itabs" role="tablist" aria-label="Service practices">
        {TABS.map((t) => (
          <button
            key={t.id}
            className={"itab" + (active === t.id ? " on" : "")}
            onClick={() => setActive(t.id)}
            role="tab"
            aria-selected={active === t.id}
          >
            {t.label}
          </button>
        ))}
      </div>

      {active === "systems" && (
        <div className="ipanel on" role="tabpanel">
          <div className="svc-head">
            <div>
              <h2 className="h2" style={{ marginBottom: "1.2rem" }}>
                Practice I<em>: Systems &amp; Place Advisory.</em>
              </h2>
              <p className="lede">
                Every asset exists inside a larger system, and the system around the asset
                determines the asset&apos;s performance. This practice is where every engagement
                starts: understanding the land, resources, infrastructure, institutions,
                community, and capital context an opportunity actually sits inside, before
                proposing what should be done about it.
              </p>
            </div>
            <div className="svc-note">
              Output is a systemic diagnosis and an intervention strategy, not a menu of
              technical services, the specific technical work that follows depends on what the
              diagnosis actually finds.
            </div>
          </div>
          <div className="scope">
            <div className="scope-row">
              <div className="srk">Systemic diagnosis</div>
              <div className="srv">
                Place-based intelligence and land/resource assessment: what this specific site,
                place, or opportunity actually depends on, and what constrains it.
              </div>
            </div>
            <div className="scope-row">
              <div className="srk">Dependency mapping</div>
              <div className="srv">
                Infrastructure dependencies, ecological constraints, and governance/regulatory
                context, mapped explicitly rather than assumed.
              </div>
            </div>
            <div className="scope-row">
              <div className="srk">Intervention design</div>
              <div className="srv">
                Opportunity mapping and development scenarios that follow from the diagnosis,
                including a Five Capitals view where it clarifies the decision.
              </div>
            </div>
          </div>
          <div style={{ marginTop: "2.4rem" }}>
            <Link href="/contact?path=general" className="btn btn-gold">
              Discuss a Project <span className="arr">&rarr;</span>
            </Link>
          </div>
        </div>
      )}

      {active === "readiness" && (
        <div className="ipanel on" role="tabpanel">
          <div className="svc-head">
            <div>
              <h2 className="h2" style={{ marginBottom: "1.2rem" }}>
                Practice II<em>: Development &amp; Project Readiness.</em>
              </h2>
              <p className="lede">
                Strong projects often fall short of institutional requirements for fixable
                reasons: incomplete documentation, unresolved site or grid constraints, or a
                fragmented team. This practice closes those gaps before formal capital or
                partner engagement, rather than letting a project absorb months of speculative
                outreach it isn&apos;t ready for.
              </p>
            </div>
            <div className="svc-note">
              The <Link href="/diagnostics/project-readiness-diagnostic">Project Readiness
              Diagnostic</Link> is the productized entry point into this practice, see{" "}
              <Link href="/for-developers">For Developers</Link> for the full picture.
            </div>
          </div>
          <div className="scope">
            <div className="scope-row">
              <div className="srk">Readiness assessment</div>
              <div className="srv">
                Project diagnostic and readiness scoring against what institutional capital and
                delivery partners actually require.
              </div>
            </div>
            <div className="scope-row">
              <div className="srk">Feasibility &amp; sequencing</div>
              <div className="srv">
                Site and land readiness, permitting pathway, technical/EPC counterparty
                coordination, and a risk register with real development sequencing behind it.
              </div>
            </div>
            <div className="scope-row">
              <div className="srk">Documentation &amp; positioning</div>
              <div className="srv">
                Commercial and offtake strategy, financial-model coordination, and diligence
                preparation, so the project&apos;s case is legible to the counterparties it
                needs to reach.
              </div>
            </div>
          </div>
          <div style={{ marginTop: "2.4rem" }}>
            <Link href="/for-developers" className="btn btn-gold">
              Submit a Project <span className="arr">&rarr;</span>
            </Link>
          </div>
        </div>
      )}

      {active === "assets" && (
        <div className="ipanel on" role="tabpanel">
          <div className="svc-head">
            <div>
              <h2 className="h2" style={{ marginBottom: "1.2rem" }}>
                Practice III<em>: Real Assets &amp; Infrastructure Advisory.</em>
              </h2>
              <p className="lede">
                Sector-specific advisory across energy, waste, water, land, agriculture, food
                systems, real estate, materials, mobility, natural capital, community health, and
                environmental intelligence, all twelve sectors we work across, see{" "}
                <Link href="/sectors">Sectors</Link> for the full architecture.
              </p>
            </div>
            <div className="svc-note">
              Environmental &amp; Asset Intelligence, Earth observation, remote sensing, and
              environmental monitoring, cuts across every sector in this practice as an input,
              not a service we operate ourselves.
            </div>
          </div>
          <div className="scope">
            <div className="scope-row">
              <div className="srk">Asset &amp; site strategy</div>
              <div className="srv">
                Integrated infrastructure design coordination and commercial/operational systems
                review, specific to the sector and asset in question.
              </div>
            </div>
            <div className="scope-row">
              <div className="srk">Development partnership</div>
              <div className="srv">
                Specialist coordination across engineering, EPC, ecology, agriculture, and
                architecture, Regenera owns the integration layer, specialists own specialist
                conclusions, see our <Link href="/philosophy">Philosophy</Link> page.
              </div>
            </div>
            <div className="scope-row">
              <div className="srk">Environmental intelligence</div>
              <div className="srv">
                Earth observation and monitoring data brought into diligence, development, and
                operating decisions where better information genuinely changes the outcome.
              </div>
            </div>
          </div>
          <div style={{ marginTop: "2.4rem" }}>
            <Link href="/sectors" className="btn btn-gold">
              Explore Sectors <span className="arr">&rarr;</span>
            </Link>
          </div>
          <FromFieldNotes category="Energy" />
        </div>
      )}

      {active === "capital" && (
        <div className="ipanel on" role="tabpanel">
          <div className="svc-head">
            <div>
              <h2 className="h2" style={{ marginBottom: "1.2rem" }}>
                Practice IV<em>: Capital Strategy &amp; Alignment.</em>
              </h2>
              <p className="lede">
                Capital readiness review, financing pathway analysis, and investor/capital
                universe development. Strategic introductions, where lawful, are one capability
                inside this practice, not the whole of it, see{" "}
                <Link href="/for-investors">For Investors</Link>.
              </p>
            </div>
            <div className="svc-note">
              Regenera acts in an advisory and, where appropriate, introductory capacity. All
              investment decisions are made independently by the parties involved.
            </div>
          </div>
          <div className="scope">
            <div className="scope-row">
              <div className="srk">Capital readiness</div>
              <div className="srv">
                Readiness review and financing-pathway analysis, so a project or portfolio
                approaches capital only once it&apos;s genuinely ready to.
              </div>
            </div>
            <div className="scope-row">
              <div className="srk">Mandate matching</div>
              <div className="srv">
                Investor and capital universe development, matched against actual mandates,
                sectors, geography, stage, and structure, not a generic deal blast.
              </div>
            </div>
            <div className="scope-row">
              <div className="srk">Strategic introductions</div>
              <div className="srv">
                Introductions made only where mandate, scale, and geography genuinely align,
                development-finance and blended-finance pathways included where relevant.
              </div>
            </div>
          </div>
          <div style={{ marginTop: "2.4rem" }}>
            <Link href="/for-investors" className="btn btn-gold">
              Discuss Your Mandate <span className="arr">&rarr;</span>
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
