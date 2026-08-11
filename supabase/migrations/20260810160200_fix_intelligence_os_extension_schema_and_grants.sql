-- Security-advisor fixes for the intelligence-os migrations just applied:
-- 1) pg_net and vector were installed into `public` (advisor: extensions
--    should not live in public). Move them to the `extensions` schema,
--    matching pgcrypto/uuid-ossp/pg_stat_statements already there.
-- 2) is_intel_access() was still callable by anon per the advisor despite
--    the inline revoke in the previous migration; re-assert explicitly.

drop extension if exists pg_net;
create extension if not exists pg_net with schema extensions;

drop extension if exists vector;
create extension if not exists vector with schema extensions;

revoke execute on function is_intel_access() from public;
revoke execute on function is_intel_access() from anon;
grant execute on function is_intel_access() to authenticated;
