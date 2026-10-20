-- B93: independent course access; only a trusted backend can grant purchases.
create table public.course_purchase_access (
 user_id uuid not null references auth.users(id) on delete cascade,
 course_code text not null,
 active boolean not null default true,
 created_at timestamptz not null default now(),
 primary key (user_id,course_code)
);
alter table public.course_purchase_access enable row level security;
revoke all on public.course_purchase_access from anon,authenticated;
grant select on public.course_purchase_access to authenticated;
grant all on public.course_purchase_access to service_role;
create policy purchase_read_own on public.course_purchase_access for select to authenticated using (user_id=(select auth.uid()));
create table public.course_premium_content (
 course_code text primary key,
 payload jsonb not null,
 updated_at timestamptz not null default now()
);
alter table public.course_premium_content enable row level security;
revoke all on public.course_premium_content from anon,authenticated;
grant select on public.course_premium_content to authenticated;
grant all on public.course_premium_content to service_role;
create policy premium_authorized_read on public.course_premium_content for select to authenticated using (
 (select auth.uid()) is not null and (
 (select public.is_pluton_admin()) or exists (
 select 1 from public.course_purchase_access a where a.user_id=(select auth.uid()) and a.course_code=course_premium_content.course_code and a.active
 ))
);
