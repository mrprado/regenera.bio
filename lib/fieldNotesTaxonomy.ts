// Field Notes taxonomy. This is the single source of truth for the
// category system described in content/field-notes/EDITORIAL_SYSTEM.md.
// Changing labels here changes them everywhere (filters, cards, article
// headers, JSON-LD) since nothing else hardcodes these strings.

export const SYSTEMS = [
  "Land & Soil",
  "Water",
  "Energy & Waste",
  "Food Systems",
  "Community & Health",
  "Built Environment",
  "Orbital Intelligence"
] as const;
export type SystemName = (typeof SYSTEMS)[number];

export const LENSES = [
  "Capital & Markets",
  "Asset Economics",
  "Project Delivery",
  "Policy & Standards",
  "Technology & Infrastructure",
  "Measurement & Verification",
  "Resilience & Risk",
  "Systems Design"
] as const;
export type LensName = (typeof LENSES)[number];

export const REGIONS = [
  "Global",
  "North America",
  "Latin America & Caribbean",
  "Europe",
  "Africa",
  "Asia-Pacific",
  "Middle East"
] as const;
export type RegionName = (typeof REGIONS)[number];

// Reuses the exact palette already established for the seven ecosystem
// layers on the Home and Philosophy pages, so a Field Notes system badge
// and its ecosystem-map counterpart always read as the same thing.
export const SYSTEM_COLOR_VAR: Record<SystemName, string> = {
  "Land & Soil": "--terra",
  Water: "--water",
  "Energy & Waste": "--gold",
  "Food Systems": "--food",
  "Community & Health": "--human",
  "Built Environment": "--urban",
  "Orbital Intelligence": "--orbit"
};
