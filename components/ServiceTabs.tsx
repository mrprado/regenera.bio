"use client";

import Link from "next/link";
import { useState } from "react";
import FromFieldNotes from "@/components/FromFieldNotes";
import { PRACTICES, type PracticeSlug } from "@/lib/practices";

export default function ServiceTabs({ initial = "advisory" as PracticeSlug }: { initial?: PracticeSlug }) {
  const [active, setActive] = useState<PracticeSlug>(initial);
  const activePractice = PRACTICES.find((p) => p.slug === active) ?? PRACTICES[0];

  return (
    <>
      <div className="itabs" role="tablist" aria-label="Practices">
        {PRACTICES.map((p) => (
          <button
            key={p.slug}
            id={`tab-${p.slug}`}
            className={"itab" + (active === p.slug ? " on" : "")}
            onClick={() => setActive(p.slug)}
            role="tab"
            aria-selected={active === p.slug}
            aria-controls={`panel-${p.slug}`}
          >
            {p.title}
          </button>
        ))}
      </div>

      <div className="ipanel on" role="tabpanel" id={`panel-${activePractice.slug}`} aria-labelledby={`tab-${activePractice.slug}`}>
        <div className="svc-head">
          <div>
            <h2 className="h2" style={{ marginBottom: "1.2rem" }}>
              {activePractice.title}
            </h2>
            <p className="lede">{activePractice.deck}</p>
            {activePractice.pullLine && (
              <p
                style={{
                  fontFamily: "var(--serif)",
                  fontStyle: "italic",
                  fontSize: "1.1rem",
                  color: "var(--gold-dim)",
                  marginTop: "1rem"
                }}
              >
                {activePractice.pullLine}
              </p>
            )}
          </div>
          {activePractice.note && <div className="svc-note">{activePractice.note}</div>}
        </div>
        <div className="scope">
          {activePractice.scope.map((item) => (
            <div className="scope-row" key={item.key}>
              <div className="srk">{item.key}</div>
              <div className="srv">{item.body}</div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: "2.4rem", display: "flex", gap: 14, flexWrap: "wrap" }}>
          {activePractice.ctas.map((cta, i) => (
            <Link key={cta.href} href={cta.href} className={i === 0 ? "btn btn-gold" : "btn btn-line"}>
              {cta.label} {i === 0 && <span className="arr">&rarr;</span>}
            </Link>
          ))}
        </div>
        {activePractice.slug === "development" && <FromFieldNotes category="Energy" />}
      </div>
    </>
  );
}
