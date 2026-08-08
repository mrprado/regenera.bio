# Lead Schema

The field dictionary for how a public-site enquiry becomes a CRM record.
This is the practical, code-level companion to `docs/crm/DATA_MODEL.md`:
that document describes the full CRM table schema, this one describes
specifically what the public forms capture and how it maps into that
schema via `lib/crm/ingest.ts`.

## Sources of a lead

Three public tables are the permanent, untouched record of what a visitor
actually submitted. Nothing here ever alters them:

- `contact_submissions` (`app/api/contact/route.ts`): general enquiry form
- `lead_intake` (`app/api/lead/route.ts`): the scroll/timer-triggered lead
  modal (`components/LeadModal.tsx`)
- `subscribers` (`app/api/subscribe/route.ts`): Field Notes newsletter
  signup, intentionally **not** ingested into the CRM, a bare email address
  isn't a sales lead

## What ingestion creates

For `contact_form` and `lead_modal` submissions, `ingestLead()` in
`lib/crm/ingest.ts` creates or updates, in order:

1. **`organizations`**: looked up by exact name match if the submission
   included one, created with `organization_type: "prospect"` if new.
2. **`contacts`**: looked up by email (the natural dedupe key), created if
   new with name split into `first_name`/`last_name`, linked to the
   organization if one was resolved, `last_contact_at` stamped either way.
3. **`opportunities`**: always created fresh (one per submission, not
   deduped against prior opportunities from the same contact), `stage:
   "target"`, `source` set to the form the submission came from, `notes`
   populated from whatever the form captured (client type, interests,
   message).
4. **`activities`**: one append-only row logging the inbound submission,
   `created_by: null` (system-generated, not attributable to a staff
   member, see the `allow_system_generated_activities` migration).

## Field mapping

| Public form field                          | CRM destination                                    |
| ------------------------------------------- | --------------------------------------------------- |
| `name` (contact form)                       | `contacts.first_name` / `contacts.last_name`         |
| `org` (contact form)                        | `organizations.name`                                 |
| `email`                                     | `contacts.email` (dedupe key)                        |
| `type` (contact form) / `client_type` (lead modal) | `opportunities.notes`                         |
| `interests[]` (lead modal)                  | `opportunities.notes`                                |
| `message` (contact form)                    | `opportunities.notes`                                |
| `page_path`, `referrer` (lead modal)        | `activities.summary`                                 |
| form identity (`contact_form` / `lead_modal`) | `opportunities.source`, `activities.activity_type: "note"` |

## What's deliberately not captured yet

The segmented forms called for in the blueprint (`/for-developers`,
`/for-investors`, `/for-landowners`, `/for-operators`, each with
structured project/mandate/land/site fields) do not exist yet. When they're
built, extend `IngestLead` in `lib/crm/ingest.ts` with the additional
structured fields (sector, geography, stage, capital requirement, etc.)
rather than cramming them into the free-text `notes` field the way the
current two forms do, since those forms don't have anywhere more specific
to put that data yet.

## UTM / attribution

Not yet captured. `page_path` and `referrer` are stored today; UTM
parameters are not read or persisted anywhere in the current forms. This is
a real gap against the blueprint's attribution requirement (Appendix A10),
noted here rather than silently deferred.
