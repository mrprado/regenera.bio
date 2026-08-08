// Field Notes taxonomy. This is the single source of truth for the
// category system described in content/field-notes/EDITORIAL_SYSTEM.md.
// Changing labels here changes them everywhere (filters, cards, article
// headers, JSON-LD) since nothing else hardcodes these strings.
//
// History: shipped as a 7-system taxonomy, replaced with a 13-category
// taxonomy on 2026-08-08, then condensed to this 8-category taxonomy the
// same day on explicit user direction ("condense to the best 7 or 8,
// energy should be separate than waste/circular"). Energy and Waste &
// Circular Materials are kept deliberately distinct per that instruction,
// everything else is merged toward the categories that had the most
// content or the clearest identity. See CLAUDE.md for the full mapping.

export const CATEGORIES = [
  "Capital Markets & Real Assets",
  "Energy",
  "Waste & Circular Materials",
  "Water Systems",
  "Land & Regenerative Agriculture",
  "Food Systems & Community Health",
  "Real Estate & Built Environment",
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

export const CATEGORY_COLOR_VAR: Record<CategoryName, string> = {
  "Capital Markets & Real Assets": "--capital",
  Energy: "--gold",
  "Waste & Circular Materials": "--waste",
  "Water Systems": "--water",
  "Land & Regenerative Agriculture": "--terra",
  "Food Systems & Community Health": "--food",
  "Real Estate & Built Environment": "--urban",
  "Orbital & Environmental Intelligence": "--orbit"
};
