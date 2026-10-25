-- B108: reuse the existing private atomic ledger for all ten courses.
-- Apply before the new webhook. No Stripe keys/configuration changes.
-- Existing B107 session records are preserved. Pre-ledger legacy transactions
-- cannot be reconstructed here; reconcile Stripe history before cutover.
begin;
create or replace function public.b107_grant_purchase(p_session_id text,p_user_id uuid,p_course_code text)
returns boolean language plpgsql security invoker set search_path='' as $$
declare recorded integer;
begin
 if p_session_id !~ '^cs_(test_|live_)[A-Za-z0-9]+$' or p_user_id is null
 or p_course_code is null or p_course_code not in ('PA-101','PA-203','ID-101','MKT-201','NA-101','COMP-101','ID-001','ELEC-101','HVAC-101','BEAUTY-101') then
  raise exception 'Invalid course purchase';
 end if;
 insert into b107_private.purchase_sessions(session_id,user_id,course_code)
 values(p_session_id,p_user_id,p_course_code) on conflict(session_id) do nothing;
 get diagnostics recorded = row_count;
 if recorded=0 then
  if not exists(select 1 from b107_private.purchase_sessions where session_id=p_session_id
   and user_id=p_user_id and course_code=p_course_code) then
   raise exception 'B107 session binding mismatch';
  end if;
  return false;
 end if;
 insert into public.course_purchase_access(user_id,course_code,active)
 values(p_user_id,p_course_code,true) on conflict(user_id,course_code) do update set active=true;
 return true;
end $$;
revoke all on function public.b107_grant_purchase(text,uuid,text) from public,anon,authenticated;
grant execute on function public.b107_grant_purchase(text,uuid,text) to service_role;
commit;
