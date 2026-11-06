-- B115: PREPARED ONLY. Do not apply until the owner authorizes production publication.
-- No Stripe configuration, keys, webhooks, old course rows or purchase rows change.
begin;

-- Extend existing allowlists without replacing their current definitions.
do $b115$
declare target text; constraint_name text; expression text;
begin
 for target,constraint_name in select * from (values
  ('course_learning_content','course_learning_content_course_code_check'),
  ('course_editor_state','course_editor_state_course_code_check')) as v(t,c)
 loop
  select pg_get_expr(conbin,conrelid) into expression from pg_constraint
   where conrelid=('public.'||target)::regclass and conname=constraint_name and contype='c';
  if expression is null then raise exception 'b115_missing_constraint: %',constraint_name; end if;
  if position('FAM-101' in expression)>0 then raise exception 'b115_already_prepared_review_required';end if;
  execute format('alter table public.%I drop constraint %I',target,constraint_name);
  execute format('alter table public.%I add constraint %I check ((%s) or course_code in (''FAM-101'',''FAM-102'',''PSI-101'',''PSI-102''))',target,constraint_name,expression);
 end loop;
end;$b115$;

-- RLS is an additional restrictive layer for B115 only. Old courses retain their policies.
create policy b115_exact_course_purchase on public.course_learning_content
as restrictive for select to authenticated using (
 course_code not in ('FAM-101','FAM-102','PSI-101','PSI-102') or (
  (select auth.uid()) is not null and
  ((select public.is_pluton_admin()) or (published and exists(
   select 1 from public.course_purchase_access a where a.user_id=(select auth.uid())
   and a.course_code=course_learning_content.course_code and a.active
  )))
 ));

-- Separate bucket: never alter old bucket policies or expose MP3s publicly.
insert into storage.buckets(id,name,public) values('b115-course-media','b115-course-media',false);
create policy b115_media_read on storage.objects for select to authenticated using (
 bucket_id='b115-course-media' and (select auth.uid()) is not null
 and split_part(name,'/',1) in ('FAM-101','FAM-102','PSI-101','PSI-102')
 and array_length(string_to_array(name,'/'),1)=2
 and split_part(name,'/',2) ~ ('^'||split_part(name,'/',1)||'-L(0[1-9]|1[0-5])-(es|en)\.mp3$')
 and ((select public.is_pluton_admin()) or exists(select 1 from public.course_purchase_access a
  join public.course_learning_content c on c.course_code=a.course_code and c.published
  where a.user_id=(select auth.uid()) and a.active and a.course_code=split_part(objects.name,'/',1)))
);
create policy b115_media_guard on storage.objects as restrictive for select to authenticated using (
 bucket_id<>'b115-course-media' or (
  (select auth.uid()) is not null
  and split_part(name,'/',1) in ('FAM-101','FAM-102','PSI-101','PSI-102')
  and array_length(string_to_array(name,'/'),1)=2
  and split_part(name,'/',2) ~ ('^'||split_part(name,'/',1)||'-L(0[1-9]|1[0-5])-(es|en)\.mp3$')
  and ((select public.is_pluton_admin()) or exists(select 1 from public.course_purchase_access a
   join public.course_learning_content c on c.course_code=a.course_code and c.published
   where a.user_id=(select auth.uid()) and a.active and a.course_code=split_part(objects.name,'/',1)))
 ));
create policy b115_media_anon_guard on storage.objects as restrictive for select to anon
 using(bucket_id<>'b115-course-media');

-- Keep the existing invoker RPC and all existing routes; add B115 to its learning route only.
do $b115$
declare definition text; pattern text := '(?i)(p_course_code\s+in\s*\()([^)]*NA-101[^)]*)(\))';
begin
 select pg_get_functiondef('public.b95_course_published(text)'::regprocedure) into definition;
 if definition !~ pattern then raise exception 'b115_published_rpc_schema_drift';end if;
 definition:=regexp_replace(definition,pattern,E'\\1\\2,''FAM-101'',''FAM-102'',''PSI-101'',''PSI-102''\\3','g');
 execute definition;
end;$b115$;

-- Register new course codes in the EXISTING trusted purchase ledger. Preserve
-- signature, invoker security, service-role-only execution, idempotency and replay guards.
-- Neither Stripe function nor webhook source is changed.
do $b115$
declare definition text; pattern text := '(?i)(p_course_code\s+not\s+in\s*\()([^)]*)(\))';
begin
 select pg_get_functiondef('public.b107_grant_purchase(text,uuid,text)'::regprocedure) into definition;
 if definition !~ pattern or position('B107 session binding mismatch' in definition)=0 then
  raise exception 'b115_purchase_ledger_schema_drift';end if;
 definition:=regexp_replace(definition,pattern,E'\\1\\2,''FAM-101'',''FAM-102'',''PSI-101'',''PSI-102''\\3','g');
 execute definition;
end;$b115$;
commit;
