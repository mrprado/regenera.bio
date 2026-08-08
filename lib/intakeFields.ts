export type IntakeType = "developer" | "investor" | "landowner" | "operator";

export interface IntakeField {
  name: string;
  label: string;
  type: "text" | "select" | "textarea";
  options?: { value: string; label: string }[];
  required?: boolean;
  placeholder?: string;
}

export interface IntakeConfig {
  type: IntakeType;
  orgLabel: string;
  fields: IntakeField[];
  messageLabel: string;
  messagePlaceholder: string;
  submitLabel: string;
}

const SECTOR_OPTIONS = [
  { value: "energy", label: "Energy" },
  { value: "waste", label: "Waste & Circular Infrastructure" },
  { value: "water", label: "Water" },
  { value: "land", label: "Land" },
  { value: "agriculture", label: "Regenerative Agriculture" },
  { value: "food", label: "Food Systems" },
  { value: "real_estate", label: "Real Estate & Built Environment" },
  { value: "materials", label: "Materials & Critical Resources" },
  { value: "mobility", label: "Mobility & Infrastructure" },
  { value: "natural_capital", label: "Natural Capital & Environmental Markets" },
  { value: "community_health", label: "Community & Human Health" },
  { value: "orbital", label: "Orbital & Environmental Intelligence" },
  { value: "other", label: "Other / multiple" }
];

export const INTAKE_CONFIGS: Record<IntakeType, IntakeConfig> = {
  developer: {
    type: "developer",
    orgLabel: "Company / sponsor",
    submitLabel: "Submit a Project",
    messageLabel: "Primary constraint",
    messagePlaceholder: "What's actually blocking this project right now?",
    fields: [
      { name: "project_name", label: "Project name", type: "text", required: true },
      { name: "sector", label: "Sector", type: "select", options: SECTOR_OPTIONS, required: true },
      { name: "location", label: "Location / geography", type: "text", required: true },
      {
        name: "stage",
        label: "Stage",
        type: "select",
        required: true,
        options: [
          { value: "early", label: "Early / concept" },
          { value: "site_control", label: "Site control secured" },
          { value: "permitting", label: "In permitting" },
          { value: "shovel_ready", label: "Shovel ready" },
          { value: "under_construction", label: "Under construction" },
          { value: "operating", label: "Operating" }
        ]
      },
      {
        name: "land_status",
        label: "Land / site control",
        type: "select",
        options: [
          { value: "owned", label: "Owned" },
          { value: "under_option", label: "Under option" },
          { value: "in_negotiation", label: "In negotiation" },
          { value: "not_secured", label: "Not yet secured" }
        ]
      },
      { name: "capital_requirement", label: "Approximate capital requirement", type: "text", placeholder: "e.g. $15-25M, or leave blank if unknown" }
    ]
  },
  investor: {
    type: "investor",
    orgLabel: "Firm / family office",
    submitLabel: "Discuss Your Mandate",
    messageLabel: "Current appetite",
    messagePlaceholder: "What are you actively looking for right now, and what would make an introduction worth your time?",
    fields: [
      {
        name: "investor_type",
        label: "Investor type",
        type: "select",
        required: true,
        options: [
          { value: "family_office", label: "Family office" },
          { value: "institutional", label: "Institutional allocator" },
          { value: "impact_fund", label: "Impact / natural-capital fund" },
          { value: "infrastructure_fund", label: "Infrastructure fund" },
          { value: "private_investor", label: "Private investor" },
          { value: "other", label: "Other" }
        ]
      },
      { name: "ticket_size", label: "Typical ticket size", type: "text", placeholder: "e.g. $5-20M" },
      { name: "geographies", label: "Target geographies", type: "text", placeholder: "e.g. North America, Sub-Saharan Africa" },
      { name: "sectors", label: "Sectors of interest", type: "select", options: SECTOR_OPTIONS },
      {
        name: "stage_preference",
        label: "Stage preference",
        type: "select",
        options: [
          { value: "early_development", label: "Early development" },
          { value: "construction_ready", label: "Construction-ready" },
          { value: "operating", label: "Operating assets" },
          { value: "all_stages", label: "All stages" }
        ]
      }
    ]
  },
  landowner: {
    type: "landowner",
    orgLabel: "Entity (if applicable)",
    submitLabel: "Assess My Land",
    messageLabel: "What you're trying to figure out",
    messagePlaceholder: "What's unclear about the land's best use, right now?",
    fields: [
      { name: "location", label: "Property location", type: "text", required: true },
      { name: "size", label: "Approximate size", type: "text", placeholder: "e.g. 400 acres" },
      {
        name: "current_use",
        label: "Current use",
        type: "select",
        options: [
          { value: "undeveloped", label: "Undeveloped / vacant" },
          { value: "agricultural", label: "Agricultural" },
          { value: "conservation", label: "Conservation / held" },
          { value: "partially_developed", label: "Partially developed" },
          { value: "other", label: "Other" }
        ]
      },
      { name: "water_access", label: "Known water access or constraints", type: "text", placeholder: "Leave blank if unknown" }
    ]
  },
  operator: {
    type: "operator",
    orgLabel: "Organization",
    submitLabel: "Discuss Your Site",
    messageLabel: "Primary challenge",
    messagePlaceholder: "Energy, water, waste, resilience, what's the actual pain point?",
    fields: [
      {
        name: "place_type",
        label: "Type of place",
        type: "select",
        required: true,
        options: [
          { value: "resort_hospitality", label: "Resort / hospitality" },
          { value: "campus", label: "Campus" },
          { value: "industrial_estate", label: "Industrial estate" },
          { value: "agricultural_operation", label: "Agricultural operation" },
          { value: "district_municipality", label: "District / municipality" },
          { value: "other", label: "Other" }
        ]
      },
      { name: "location", label: "Location", type: "text", required: true },
      {
        name: "primary_infrastructure_issue",
        label: "Primary infrastructure issue",
        type: "select",
        options: [
          { value: "energy_cost", label: "Energy cost or reliability" },
          { value: "water", label: "Water" },
          { value: "waste", label: "Waste" },
          { value: "fragmented_systems", label: "Fragmented, uncoordinated systems" },
          { value: "resilience", label: "Resilience / continuity" },
          { value: "other", label: "Other" }
        ]
      }
    ]
  }
};
