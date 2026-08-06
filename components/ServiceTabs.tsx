"use client";

import Link from "next/link";
import { useState } from "react";

type TabId = "energy" | "realestate" | "readiness" | "capital";

const TABS: { id: TabId; label: string }[] = [
  { id: "energy", label: "Energy" },
  { id: "realestate", label: "Real Estate & Land" },
  { id: "readiness", label: "Project Readiness" },
  { id: "capital", label: "Capital Introduction" }
];

export default function ServiceTabs({ initial = "energy" as TabId }: { initial?: TabId }) {
  const [active, setActive] = useState<TabId>(initial);

  return (
    <>
      <div className="itabs" role="tablist" aria-label="Service lines">
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

      {active === "energy" && (
        <div className="ipanel on" role="tabpanel">
          <div className="svc-head">
            <div>
              <h2 className="h2" style={{ marginBottom: "1.2rem" }}>
                Solar <em>&amp; waste to energy.</em>
              </h2>
              <p className="lede">
                Energy infrastructure that anchors regenerative development. Utility scale solar
                as the foundation, and waste to energy that closes the loop by converting waste
                streams into power, heat, and recovered materials. We advise on siting,
                structure, and capital for both.
              </p>
            </div>
            <div className="svc-note">
              Our current pipeline includes solar and waste to energy projects in development
              across international markets. Project details are shared under confidentiality
              following an introductory call.
            </div>
          </div>
          <div className="scope">
            <div className="scope-row">
              <div className="srk">Utility-scale solar</div>
              <div className="srv">
                Siting, structuring, and capital preparation for solar programs, from single
                sites to the 10 GW pipeline we currently work across.
              </div>
            </div>
            <div className="scope-row">
              <div className="srk">Waste-to-energy</div>
              <div className="srv">
                Matching conversion technology to the waste streams, grid, and community a site
                actually has, so waste becomes feedstock rather than liability.
              </div>
            </div>
            <div className="scope-row">
              <div className="srk">Structure &amp; capital</div>
              <div className="srv">
                Offtake, land, and capital structures designed so each facility strengthens the
                surrounding food, water, and health layers, with introductions to energy-focused
                institutional capital at every stage.
              </div>
            </div>
          </div>
          <div style={{ marginTop: "2.4rem" }}>
            <Link href="/contact?path=developer" className="btn btn-gold">
              Discuss a Project <span className="arr">&rarr;</span>
            </Link>
          </div>
        </div>
      )}

      {active === "realestate" && (
        <div className="ipanel on" role="tabpanel">
          <div className="svc-head">
            <div>
              <h2 className="h2" style={{ marginBottom: "1.2rem" }}>
                Real estate <em>&amp; land.</em>
              </h2>
              <p className="lede">
                Land is a living system asset. We structure real estate, working farmland,
                forest, and land holdings so their ecological, energy, and community value is
                legible to institutional capital, from single sites to portfolio-scale
                regenerative developments.
              </p>
            </div>
            <div className="svc-note">
              Typical work spans energy integrated developments, agri industrial green zones,
              net zero districts, and land backed capital structures for regenerative use.
            </div>
          </div>
          <div className="scope">
            <div className="scope-row">
              <div className="srk">Structuring</div>
              <div className="srv">
                Ownership, use, and capital structures that let land generate returns while its
                soil, water, and community health improve.
              </div>
            </div>
            <div className="scope-row">
              <div className="srk">Development consulting</div>
              <div className="srv">
                Master plan review, energy integration, and regenerative design input for
                developments at any stage.
              </div>
            </div>
            <div className="scope-row">
              <div className="srk">Agriculture &amp; conservation</div>
              <div className="srv">
                Regenerative agriculture planning, forest conservation, soil restoration, water
                stewardship, and habitat protection woven into the land strategy rather than
                added after it.
              </div>
            </div>
            <div className="scope-row">
              <div className="srk">Capital connection</div>
              <div className="srv">
                Introducing structured real estate and land opportunities to capital that
                understands long horizon, place based value.
              </div>
            </div>
          </div>
          <div style={{ marginTop: "2.4rem" }}>
            <Link href="/contact?path=realestate" className="btn btn-gold">
              Discuss a Property <span className="arr">&rarr;</span>
            </Link>
          </div>
        </div>
      )}

      {active === "readiness" && (
        <div className="ipanel on" role="tabpanel">
          <div className="svc-head">
            <div>
              <h2 className="h2" style={{ marginBottom: "1.2rem" }}>
                Project <em>readiness.</em>
              </h2>
              <p className="lede">
                Strong projects often fall short of institutional requirements for fixable
                reasons: incomplete documentation, unclear structures, unresolved risks, or a
                value proposition presented in the wrong language. Readiness work addresses
                these gaps before formal capital engagement.
              </p>
            </div>
            <div className="svc-note">
              Our assessment examines the project as a whole, revealing its strengths, risks,
              sources of value, and long term potential beyond cash flow alone.
            </div>
          </div>
          <div className="scope">
            <div className="scope-row">
              <div className="srk">Diagnostics</div>
              <div className="srv">
                Assessing the project, site, structure, risks, and wider ecosystem to establish
                what the project is worth and where it fits.
              </div>
            </div>
            <div className="scope-row">
              <div className="srk">Documentation</div>
              <div className="srv">
                Review and preparation of the materials institutional counterparties expect, in
                the form they expect them.
              </div>
            </div>
            <div className="scope-row">
              <div className="srk">Positioning</div>
              <div className="srv">
                Translating the project&apos;s regenerative case into the language of mandates,
                risk, and return.
              </div>
            </div>
          </div>
          <div style={{ marginTop: "2.4rem" }}>
            <Link href="/contact?path=developer" className="btn btn-gold">
              Get Your Project Ready <span className="arr">&rarr;</span>
            </Link>
          </div>
        </div>
      )}

      {active === "capital" && (
        <div className="ipanel on" role="tabpanel">
          <div className="svc-head">
            <div>
              <h2 className="h2" style={{ marginBottom: "1.2rem" }}>
                Capital <em>introduction.</em>
              </h2>
              <p className="lede">
                We connect infrastructure and real estate projects with institutional capital.
                Family offices, sovereign and pension capital, impact funds, and private
                investors. Introductions are made only where mandate, scale, and geography
                genuinely align.
              </p>
            </div>
            <div className="svc-note">
              Regenera acts in an introductory capacity. All investment decisions are made
              independently by the parties.
            </div>
          </div>
          <div className="scope">
            <div className="scope-row">
              <div className="srk">Project side</div>
              <div className="srv">
                Positioning, ecosystem case, and preparation of materials for institutional
                review, followed by targeted introductions to aligned capital.
              </div>
            </div>
            <div className="scope-row">
              <div className="srk">Capital side</div>
              <div className="srv">
                Access to a prepared pipeline of solar, waste to energy, real estate, and
                regenerative development opportunities matched to your mandate.
              </div>
            </div>
            <div className="scope-row">
              <div className="srk">Coordination</div>
              <div className="srv">
                We remain active between the parties from introduction through agreement, keeping
                the process moving and the information clean.
              </div>
            </div>
          </div>
          <div style={{ marginTop: "2.4rem" }}>
            <Link href="/contact?path=investor" className="btn btn-gold">
              Discuss an Introduction <span className="arr">&rarr;</span>
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
