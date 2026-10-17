-- B58: execute only after reviewing against the existing Supabase schema.
-- Admin roles must be granted manually by a trusted database operator.
create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);
alter table public.admin_users enable row level security;
revoke all on public.admin_users from anon, authenticated;
-- SECURITY DEFINER bypasses RLS only in this narrowly scoped boolean check.
create or replace function public.is_pluton_admin()
returns boolean language sql stable security definer
set search_path = '' as $$
  select exists (select 1 from public.admin_users where user_id = (select auth.uid()));
$$;
revoke all on function public.is_pluton_admin() from public;
grant execute on function public.is_pluton_admin() to authenticated;
-- Example admin-only management table; not a replacement for existing courses schema.
create table if not exists public.admin_announcements (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(title) between 1 and 160),
  body text not null default '',
  is_published boolean not null default false,
  updated_at timestamptz not null default now()
);
alter table public.admin_announcements enable row level security;
revoke all on public.admin_announcements from anon;
grant select, insert, update, delete on public.admin_announcements to authenticated;
create policy "Admins manage announcements" on public.admin_announcements
for all to authenticated using ((select public.is_pluton_admin()))
with check ((select public.is_pluton_admin()));
-- Assign first admin ONLY from SQL editor with trusted UUID (never browser code):
-- insert into public.admin_users(user_id) values ('<auth.users UUID>');
