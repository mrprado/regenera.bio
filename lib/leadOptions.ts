export const LEAD_INTERESTS = [
  { value: "investment_opportunities", label: "Investment opportunities" },
  { value: "raising_capital", label: "Raising capital" },
  { value: "advisory_services", label: "Advisory services" },
  { value: "project_development", label: "Project development" },
  { value: "partnerships", label: "Partnerships" }
] as const;

export const LEAD_INTEREST_LABELS: Record<string, string> = Object.fromEntries(LEAD_INTERESTS.map((i) => [i.value, i.label]));
