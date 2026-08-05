"use client";

import Link from "next/link";
import { useState } from "react";
import { PROJECT_TABS, DEPLOYMENT_FOCUS, type ProjectCard } from "@/lib/projects";

function Gate({ card }: { card: ProjectCard }) {
  return (
    <div className="gate">
      <span className="gtag">{card.tag}</span>
      <div className="gt">{card.title}</div>
      <div className="gm">{card.summary}</div>
      {card.details.length > 0 && (
        <div className="gd">
          {card.details.map((d) => (
            <span key={d}>{d}</span>
          ))}
        </div>
      )}
      <div className="grole">{card.role}</div>
      <Link href={`/contact?path=${card.path}`} className="gdet">
        Details <span className="arr">&rarr;</span>
      </Link>
    </div>
  );
}

export default function ProjectTabs() {
  const [active, setActive] = useState<(typeof PROJECT_TABS)[number]["id"]>("energy");
  const tab = PROJECT_TABS.find((t) => t.id === active)!;

  return (
    <>
      <div className="itabs" role="tablist" aria-label="Projects and partnerships">
        {PROJECT_TABS.map((t) => (
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

      <div className="ipanel on" role="tabpanel">
        <div className="ptab-head">
          <h3>{tab.heading}</h3>
          {tab.intro.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>

        {tab.cards.length > 0 && (
          <div className="g3">
            {tab.cards.map((c) => (
              <Gate key={c.title} card={c} />
            ))}
          </div>
        )}

        {tab.extraCards && (
          <div className="g2" style={{ marginTop: "1.6rem" }}>
            {tab.extraCards.map((c) => (
              <Gate key={c.title} card={c} />
            ))}
          </div>
        )}

        {tab.id === "waste" && (
          <>
            <div className="ey" style={{ marginTop: "2.8rem" }}>
              <div className="ey-b"></div>
              <span>Deployment Focus</span>
            </div>
            <div className="mini6">
              {DEPLOYMENT_FOCUS.map((d) => (
                <div key={d.title}>
                  <strong>{d.title}</strong>
                  <span>{d.copy}</span>
                </div>
              ))}
            </div>
          </>
        )}

        

        <div className="pship">
          <p>
            <strong style={{ fontWeight: 600, color: "var(--ink)" }}>{tab.partnershipLabel}</strong>{" "}
            {tab.partnershipCopy}
          </p>
          <Link href={`/contact?path=${tab.ctaPath}`} className="btn btn-gold">
            {tab.ctaLabel} <span className="arr">&rarr;</span>
          </Link>
        </div>
      </div>
    </>
  );
}
