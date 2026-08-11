-- Extensions needed for the Intelligence OS: pg_cron for the daily 7am/7pm
-- scheduled routines, pg_net for async HTTP dispatch from Postgres
-- (webhooks, notification fan-out), vector (pgvector) for knowledge-graph
-- embeddings/similarity search. All three confirmed available on this
-- project's extension list in the Phase 0 audit; none were previously
-- installed.
create extension if not exists pg_cron;
create extension if not exists pg_net;
create extension if not exists vector;
