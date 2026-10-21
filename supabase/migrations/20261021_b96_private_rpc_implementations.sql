-- Additive B95/B96 hardening; apply after both original migrations.
-- Keep pluton_rpc_private OUTSIDE the project's exposed Data API schemas.
-- Public signatures/defaults/results stay unchanged. Original function OIDs,
-- owners, bodies, empty search paths and internal admin checks are preserved.
-- Invoker wrappers need USAGE and EXECUTE on their private destinations; those
-- grants do not allow CREATE or data-table access, and do not replace auth checks.
begin;
set local search_path = '';
create schema pluton_rpc_private;
revoke all on schema pluton_rpc_private from public,anon,authenticated;
grant usage on schema pluton_rpc_private to anon,authenticated;

do $hardening$
declare
 targets constant text[] := array[
  'b95_editor_get','b95_editor_history','b95_editor_save','b95_editor_restore','b95_editor_publish',
  'b96_resolve_recipient','b96_certificate_courses','b96_list_certificates','b96_get_certificate',
  'b96_issue_certificate','b96_revoke_certificate','b96_verify_certificate'
 ];
 f record;
 identities text;
 arguments text;
 result_type text;
 call_args text;
 body_sql text;
 volatility text;
 parallelism text;
 target_count integer;
 target_names integer;
begin
 select count(*),count(distinct p.proname) into target_count,target_names
 from pg_catalog.pg_proc p join pg_catalog.pg_namespace n on n.oid=p.pronamespace
 where n.nspname='public' and p.proname=any(targets) and p.prokind='f';
 if target_count <> 12 or target_names <> 12 then
  raise exception 'Expected exactly twelve reviewed B95/B96 functions, found % functions and % names',target_count,target_names;
 end if;
 for f in
  select p.* from pg_catalog.pg_proc p join pg_catalog.pg_namespace n on n.oid=p.pronamespace
  where n.nspname='public' and p.proname=any(targets) and p.prokind='f' order by p.proname
 loop
  if not f.prosecdef or f.provariadic<>0 then
   raise exception 'Unexpected security mode or variadic signature: %',f.proname;
  end if;
  identities := pg_catalog.pg_get_function_identity_arguments(f.oid);
  arguments := pg_catalog.pg_get_function_arguments(f.oid);
  result_type := pg_catalog.pg_get_function_result(f.oid);
  -- pronargs counts only input arguments: TABLE/OUT names must never become inputs.
  select coalesce(pg_catalog.string_agg('$'||i::text,', ' order by i),'') into call_args
   from pg_catalog.generate_series(1,f.pronargs) as inputs(i);
  body_sql := pg_catalog.format('select * from pluton_rpc_private.%I(%s)',f.proname,call_args);
  volatility := case f.provolatile when 'i' then 'immutable' when 's' then 'stable' else 'volatile' end;
  parallelism := case f.proparallel when 's' then 'safe' when 'r' then 'restricted' else 'unsafe' end;
  execute pg_catalog.format('alter function public.%I(%s) set schema pluton_rpc_private',f.proname,identities);
  execute pg_catalog.format(
   'create function public.%I(%s) returns %s language sql %s parallel %s %s security invoker set search_path = %L as %L',
   f.proname,arguments,result_type,volatility,parallelism,
   case when f.proisstrict then 'returns null on null input' else 'called on null input' end,'',body_sql);
  -- Remove PostgreSQL's default PUBLIC EXECUTE plus all previous browser grants,
  -- from BOTH layers, before granting the exact reviewed call paths.
  execute pg_catalog.format('revoke all on function public.%I(%s) from public,anon,authenticated,service_role',f.proname,identities);
  execute pg_catalog.format('revoke all on function pluton_rpc_private.%I(%s) from public,anon,authenticated,service_role',f.proname,identities);
  execute pg_catalog.format('grant execute on function public.%I(%s) to authenticated',f.proname,identities);
  execute pg_catalog.format('grant execute on function pluton_rpc_private.%I(%s) to authenticated',f.proname,identities);
  if f.proname='b96_verify_certificate' then
   execute pg_catalog.format('grant execute on function public.%I(%s) to anon',f.proname,identities);
   execute pg_catalog.format('grant execute on function pluton_rpc_private.%I(%s) to anon',f.proname,identities);
  end if;
 end loop;
end;
$hardening$;
-- Validation helpers remain inaccessible to browser roles. Privileged
-- implementations run with their unchanged owner and can still use them.
revoke all on schema pluton_course_private from public,anon,authenticated;
revoke all on all functions in schema pluton_course_private from public,anon,authenticated;
notify pgrst,'reload schema';
commit;
