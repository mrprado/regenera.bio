-- Automated ingestion (public form -> CRM) needs to log an activity without
-- a staff actor. Null created_by means system-generated, not attributable to
-- a specific staff member.
alter table activities alter column created_by drop not null;
