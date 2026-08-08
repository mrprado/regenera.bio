# Regenerative Claims Standard

This is a non-negotiable standard for any Regenera-authored content, on the
public website or internally in the CRM. It governs every use of the word
"regenerative" and applies beyond Field Notes, which already had its own
version of this rule (`content/field-notes/EDITORIAL_SYSTEM.md`, "Never call
something regenerative without explaining the mechanism"). This document is
the site-wide version: Philosophy, Services, sector pages, diagnostics,
Selected Mandates, Case Studies, project language, marketing copy, and
metadata all fall under it, not just editorial content.

## The test

Do not describe a project, intervention, asset, or strategy as regenerative
merely because it is sustainable, renewable, low-carbon, circular, organic,
ESG-aligned, nature-related, or impact-oriented. Those are adjacent
categories, not synonyms.

Whenever "regenerative" is used, be able to answer: **what function is
actually restored or strengthened?**

Candidate functions, not an exhaustive list:

- soil function
- water-cycle function
- biodiversity / ecological function
- productive capacity
- landscape resilience
- community resilience
- local economic capability
- resource circularity
- long-term system capacity

If no specific function can be named and explained, don't use the word. Use
sustainable, low-carbon, circular, or whatever term is actually accurate
instead. "Regenerative" is not a synonym for "environmentally conscious."

## What to evaluate, where relevant

- baseline condition (what was the state before)
- the mechanism (how does the intervention actually change that state)
- evidence supporting the claim
- measurable indicators
- durability (does the effect persist, or reverse once the intervention
  stops)
- dependencies (what has to remain true for the effect to hold)
- tradeoffs and externalities
- who benefits, who bears the costs
- commercial and economic viability of maintaining the practice
- monitoring requirements

Not every piece of content needs to expose all of this to a reader. A
Field Note might state the mechanism in a sentence. A Case Study or a formal
Regenerative Asset Review should be able to produce the fuller answer on
request, backed by the structured record in the CRM's
`regenerative_function_records` table (see `docs/crm/DATA_MODEL.md`), not
just asserted in prose.

## Internal enforcement

Any project internally marked as regenerative in the CRM must have at least
one `regenerative_function_records` row with `function_strengthened`,
`baseline`, and `mechanism` genuinely filled in, not placeholder text. A
project without that record should carry `regenerative_status:
under_assessment`, not `regenerative_status: assessed`, and public copy
should not call it regenerative yet either. Public claims and internal
records should never diverge, if the internal record doesn't support the
claim, the public claim is wrong and needs to change, not the other way
around.

## Examples

Avoid: "a regenerative solar project" (solar generation alone restores
nothing by itself, the land use design around it might).

Prefer: "an agrivoltaic design that improves shade-tolerant crop yield
relative to open field while generating power," when that specific mechanism
is actually true and evidenced, exactly the standard the existing Field
Notes agrivoltaics piece already meets.

Avoid: "regenerative agriculture practices" as a blanket label for any
farming that uses cover crops or reduced tillage without saying what those
practices are restoring (soil organic matter, water infiltration, biological
activity) or over what timeframe.

Avoid calling a natural capital fund, a carbon credit, or a conservation
finance instrument "regenerative" on the strength of its asset class alone.
Carbon and biodiversity markets are financial instruments; whether the
underlying project is regenerative is a separate question this standard
still applies to.

## Where this applies

Philosophy page, all four service practice pages, all sector pages,
diagnostic engagement pages, Selected Mandates, Case Studies, Field Notes
(already covered, kept consistent here rather than duplicated), any project
language used in outreach or proposals, marketing copy generally, and page
metadata (titles/descriptions) wherever "regenerative" appears in them.
