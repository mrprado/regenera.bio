"use client";

import Link from "next/link";
import { useState } from "react";
import { MANDATE_CATEGORIES, type MandateCard } from "@/lib/projects";

function Gate({ card }: { card: MandateCard }) {
  return (
    <div className="gate">
      <span className="gtag">{card.type}</span>
      <div className="gt">{card.title}</div>
      <div className="gm">{card.description}</div>
      <div className="gd">
        <span>{card.location}</span>
        <span>{card.scale}</span>
        <span>{card.stage}</span>
        {card.note && <span>{card.note}</span>}
      </div>
      <div className="grole">{card.role}</div>
      <Link href={`/contact?path=${card.path}`} className="gdet">
        Details <span className="arr">&rarr;</span>
      </Link>
    </div>
  );
}

export default function ProjectTabs() {
  const [active, setActive] = useState<(typeof MANDATE_CATEGORIES)[number]["id"]>("energy");
  const category = MANDATE_CATEGORIES.find((c) => c.id === active)!;

  return (
    <>
      <div className="itabs" role="tablist" aria-label="Mandate categories">
        {MANDATE_CATEGORIES.map((c) => (
          <button
            key={c.id}
            className={"itab" + (active === c.id ? " on" : "")}
            onClick={() => setActive(c.id)}
            role="tab"
            aria-selected={active === c.id}
          >
            {c.label}
          </button>
        ))}
      </div>

      <div className="ipanel on" role="tabpanel">
        <div className="ptab-head">
          <h3>{category.heading}</h3>
          <p>{category.intro}</p>
        </div>

        <div className="g3">
          {category.cards.map((c) => (
            <Gate key={c.title} card={c} />
          ))}
        </div>
      </div>
    </>
  );
}
