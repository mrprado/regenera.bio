"use client";

import { useState } from "react";

// Ring radii, inner to outer, matching layer order
const RADII = [52, 80, 108, 136, 160, 182, 202];

const LAYERS = [
  {
    id: "land",
    color: "#b4693e",
    ring: "rgba(180,105,62,",
    name: "Land and Soil",
    desc: "Land strategy, site analysis, regenerative agriculture, soil restoration, land valuation, development planning, and land backed project structures.",
    angle: 250
  },
  {
    id: "water",
    color: "#5a86a8",
    ring: "rgba(90,134,168,",
    name: "Water",
    desc: "Water access, treatment, irrigation, watershed restoration, resource security, environmental monitoring, and infrastructure planning.",
    angle: 315
  },
  {
    id: "energy",
    color: "#c9a84c",
    ring: "rgba(201,168,76,",
    name: "Energy and Waste",
    desc: "Utility scale solar, energy storage, waste to energy, resource recovery, carbon markets, and integrated energy infrastructure.",
    angle: 30
  },
  {
    id: "food",
    color: "#6f9459",
    ring: "rgba(111,148,89,",
    name: "Food Systems",
    desc: "Regenerative agriculture, agri industrial zones, food processing, rural infrastructure, and the integration of energy, water, land, and food systems.",
    angle: 215
  },
  {
    id: "human",
    color: "#a85a5a",
    ring: "rgba(168,90,90,",
    name: "Community and Health",
    desc: "Infrastructure that improves access to clean energy, water, food, health services, education, employment, and long term community resilience.",
    angle: 135
  },
  {
    id: "urban",
    color: "#7d8894",
    ring: "rgba(125,136,148,",
    name: "Built Environment",
    desc: "Sustainable real estate, masterplanning, development strategy, site infrastructure, smart buildings, district energy, water integrated development, electric mobility, climate resilience, and net zero districts.",
    angle: 90
  },
  {
    id: "orbital",
    color: "#8a76a8",
    ring: "rgba(138,118,168,",
    name: "Orbital Intelligence",
    desc: "Earth observation, environmental intelligence, satellite enabled monitoring, climate risk analysis, asset level verification, responsible orbital infrastructure, and stewardship of shared orbital environments.",
    angle: 55
  }
];

function dotPos(angleDeg: number, radius: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return {
    cx: Math.round((210 + radius * Math.cos(rad)) * 10) / 10,
    cy: Math.round((210 + radius * Math.sin(rad)) * 10) / 10
  };
}

export default function EcosystemMap({ className = "" }: { className?: string }) {
  const [active, setActive] = useState(0);

  return (
    <div className={"eco-full" + (className ? " " + className : "")}>
      <svg
        viewBox="0 0 420 420"
        style={{ width: "100%", maxWidth: 490, margin: "0 auto" }}
        aria-hidden="true"
      >
        {LAYERS.map((l, i) => (
          <circle
            key={"ring-" + l.id}
            cx="210"
            cy="210"
            r={RADII[i]}
            fill="none"
            stroke={l.ring + (active === i ? "0.95)" : "0.3)")}
            strokeWidth={active === i ? 2.5 : 1.5}
            style={{ transition: "all .25s" }}
          />
        ))}
        <circle cx="210" cy="210" r="16" fill="rgba(201,168,76,0.12)" />
        <circle cx="210" cy="210" r="5" fill="#c9a84c" />
        {LAYERS.map((l, i) => {
          const pos = dotPos(l.angle, RADII[i]);
          return (
            <circle
              key={"dot-" + l.id}
              cx={pos.cx}
              cy={pos.cy}
              r={active === i ? 8 : 6}
              style={{ fill: l.color, opacity: active === i ? 1 : 0.35, transition: "all .2s" }}
            />
          );
        })}
      </svg>
      <div className="layer-list" role="tablist" aria-label="Ecosystem layers">
        {LAYERS.map((l, i) => (
          <button
            key={l.id}
            id={l.id}
            className={"layer" + (active === i ? " on" : "")}
            onClick={() => setActive(i)}
            role="tab"
            aria-selected={active === i}
          >
            <span className="ld" style={{ background: l.color }}></span>
            <span>
              <span className="ln">{l.name}</span>
              <span className="lx" style={{ display: "block" }}>
                {l.desc}
              </span>
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
