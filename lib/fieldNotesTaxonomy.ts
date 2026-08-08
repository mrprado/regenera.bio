// Field Notes taxonomy. This is the single source of truth for the
// category system described in content/field-notes/EDITORIAL_SYSTEM.md.
// Changing labels here changes them everywhere (filters, cards, article
// headers, JSON-LD) since nothing else hardcodes these strings.
//
// Replaced the original 7-system taxonomy with this 13-category system on
// explicit user direction. Regenerative Agriculture, Waste & Circular
// Materials, Materials & Embodied Carbon, Mobility & Infrastructure, and
// Natural Capital & Environmental Markets are now first-class categories
// rather than folded into broader ones. See CLAUDE.md for the migration
// rationale and mapping from the old taxonomy.

export const CATEGORIES = [
  "Capital Markets & Real Assets",
  "Energy",
  "Waste & Circular Materials",
  "Water Systems",
  "Land & Due Diligence",
  "Regenerative Agriculture",
  "Food Systems",
  "Real Estate & Built Environment",
  "Materials & Embodied Carbon",
  "Mobility & Infrastructure",
  "Natural Capital & Environmental Markets",
  "Community & Human Health",
  "Orbital & Environmental Intelligence"
] as const;
export type CategoryName = (typeof CATEGORIES)[number];

export const LENSES = [
  "Capital & Finance",
  "Asset Economics",
  "Markets & Supply Chains",
  "Project Delivery",
  "Policy & Regulation",
  "Technology & Infrastructure",
  "Measurement & Verification",
  "Resilience & Risk",
  "Systems Design"
] as const;
export type LensName = (typeof LENSES)[number];

export const ENTRY_TYPES = [
  "Field Note",
  "Market Signal",
  "Capital Note",
  "Policy Note",
  "Data Note",
  "Case Study",
  "Systems Brief"
] as const;
export type EntryType = (typeof ENTRY_TYPES)[number];

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

// Each color relates tonally to its predecessor in the original 7-system
// palette so badges stay legible against the same parchment/forest ground.
// Categories that split off an old system (Regenerative Agriculture from
// Land & Soil, Waste from Energy & Waste, Materials/Mobility/Natural
// Capital newly distinguished) get new, related tones defined alongside
// the rest of the palette in app/globals.css.
export const CATEGORY_COLOR_VAR: Record<CategoryName, string> = {
  "Capital Markets & Real Assets": "--capital",
  Energy: "--gold",
  "Waste & Circular Materials": "--waste",
  "Water Systems": "--water",
  "Land & Due Diligence": "--terra",
  "Regenerative Agriculture": "--agri",
  "Food Systems": "--food",
  "Real Estate & Built Environment": "--urban",
  "Materials & Embodied Carbon": "--materials",
  "Mobility & Infrastructure": "--mobility",
  "Natural Capital & Environmental Markets": "--natcap",
  "Community & Human Health": "--human",
  "Orbital & Environmental Intelligence": "--orbit"
};
