-- New course material only; no changes to existing auth, prices or memberships.
create table if not exists public.course_learning_content (
 course_code text primary key check (course_code in ('NA-101','COMP-101')),
 payload jsonb not null check (jsonb_typeof(payload)='object'),
 published boolean not null default false,
 updated_at timestamptz not null default now()
);
alter table public.course_learning_content enable row level security;
revoke all on public.course_learning_content from anon, authenticated;
grant select on public.course_learning_content to authenticated;
grant all on public.course_learning_content to service_role;
create policy "Registered students read published B70 courses"
 on public.course_learning_content for select to authenticated
 using (published and (select auth.uid()) is not null);
comment on table public.course_learning_content is 'B70 introductory learning content. Practice answers are not official grades. No clinical credential implied.';
