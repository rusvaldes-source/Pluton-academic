-- B107 additive integration. Run as the database owner in a single transaction.
-- Existing B93 premium-content RLS remains the sole content authorization rule.
begin;
do $$
begin
 if exists(select 1 from storage.buckets where id='b107-course-media' and public) then
  raise exception 'B107 abort: existing media bucket is public; review required';
 end if;
 -- Policies combine with OR. Review all existing permissive read policies before
 -- introducing this private bucket, even policies apparently scoped elsewhere.
 if exists(select 1 from pg_policies where schemaname='storage' and tablename='objects'
  and permissive='PERMISSIVE' and cmd in ('SELECT','ALL') and policyname <> 'b107_media_read') then
  raise exception 'B107 abort: existing permissive storage read policy requires review';
 end if;
end $$;

create function public.b107_course_content(p_code text) returns jsonb
language sql stable security invoker set search_path = '' as $$
 select payload from public.course_premium_content where course_code=p_code
 and p_code in ('ELEC-101','HVAC-101','BEAUTY-101')
$$;
revoke all on function public.b107_course_content(text) from public, anon;
grant execute on function public.b107_course_content(text) to authenticated, service_role;

create table public.b107_lesson_progress (
 user_id uuid not null references auth.users(id) on delete cascade,
 course_code text not null check(course_code in ('ELEC-101','HVAC-101','BEAUTY-101')),
 lesson_number integer not null check(lesson_number between 1 and 20),
 completed boolean not null default false,
 updated_at timestamptz not null default now(),
 primary key(user_id,course_code,lesson_number)
);
alter table public.b107_lesson_progress enable row level security;
revoke all on public.b107_lesson_progress from public, anon, authenticated;
grant select,insert,update,delete on public.b107_lesson_progress to authenticated;
grant all on public.b107_lesson_progress to service_role;
create policy b107_progress_owner on public.b107_lesson_progress for all to authenticated
 using (user_id=(select auth.uid()) and exists (
 select 1 from public.course_purchase_access a where a.user_id=(select auth.uid()) and a.course_code=b107_lesson_progress.course_code and a.active))
 with check (user_id=(select auth.uid()) and exists (
 select 1 from public.course_purchase_access a where a.user_id=(select auth.uid()) and a.course_code=b107_lesson_progress.course_code and a.active));

insert into storage.buckets(id,name,public) values('b107-course-media','b107-course-media',false)
 on conflict(id) do nothing;
create policy b107_media_read on storage.objects for select to authenticated using (
 bucket_id='b107-course-media' and (select auth.uid()) is not null and (
 (select public.is_pluton_admin()) or (
 (storage.foldername(name))[1] in ('ELEC-101','HVAC-101','BEAUTY-101') and exists (
 select 1 from public.course_purchase_access a where a.user_id=(select auth.uid())
 and a.course_code=(storage.foldername(name))[1] and a.active))));

-- No browser role has access to this ledger or its grant function. Its unique
-- session key is recorded atomically with the grant; retries cannot reactivate
-- a purchase subsequently revoked by an administrator.
create schema b107_private;
revoke all on schema b107_private from public, anon, authenticated;
grant usage on schema b107_private to service_role;
create table b107_private.purchase_sessions (
 session_id text primary key,
 user_id uuid not null references auth.users(id),
 course_code text not null,
 created_at timestamptz not null default now()
);
alter table b107_private.purchase_sessions enable row level security;
grant all on b107_private.purchase_sessions to service_role;
create function public.b107_grant_purchase(p_session_id text,p_user_id uuid,p_course_code text)
returns boolean language plpgsql security invoker set search_path='' as $$
declare recorded integer;
begin
 if p_session_id !~ '^cs_(test_|live_)[A-Za-z0-9]+$' or p_user_id is null
 or p_course_code is null or p_course_code not in ('ELEC-101','HVAC-101','BEAUTY-101') then
  raise exception 'Invalid B107 purchase';
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
