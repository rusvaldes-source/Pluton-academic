-- B108 staged DB component. Coordinate with static/private-media deployment.
-- No course rows, originals or editor history are removed or replaced.
begin;
alter table public.course_public_content enable row level security;
alter table public.course_learning_content enable row level security;
-- Restrictive policies AND the purchase test with every existing SELECT policy.
-- This prevents a permissive legacy policy from accidentally reopening access.
create policy b108_public_purchase_required on public.course_public_content
 as restrictive for select to authenticated using (
 (select auth.uid()) is not null and (
 (select public.is_pluton_admin()) or exists (
  select 1 from public.course_purchase_access a where a.user_id=(select auth.uid())
  and a.course_code=course_public_content.course_code and a.active)));
create policy b108_learning_purchase_required on public.course_learning_content
 as restrictive for select to authenticated using (
 (select auth.uid()) is not null and (
 (select public.is_pluton_admin()) or exists (
  select 1 from public.course_purchase_access a where a.user_id=(select auth.uid())
  and a.course_code=course_learning_content.course_code and a.active)));
-- Anon is denied without querying the private entitlement table.
create policy b108_public_no_anon on public.course_public_content
 as restrictive for select to anon using(false);
create policy b108_learning_no_anon on public.course_learning_content
 as restrictive for select to anon using(false);
notify pgrst,'reload schema';
commit;
