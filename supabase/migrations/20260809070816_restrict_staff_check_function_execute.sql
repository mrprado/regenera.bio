-- New functions default to EXECUTE granted to the PUBLIC pseudo-role, which
-- anon and authenticated both inherit regardless of a role-specific revoke.
-- Revoke from PUBLIC directly, then grant back only to authenticated, the
-- only role that actually evaluates policies using these functions.
revoke execute on function is_active_staff() from public;
revoke execute on function is_active_admin() from public;
grant execute on function is_active_staff() to authenticated;
grant execute on function is_active_admin() to authenticated;
