-- Review existing schema before applying. Execute only from trusted admin SQL console.
create table if not exists public.support_tickets (
 id uuid primary key default gen_random_uuid(),
 student_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
 category text not null check (category in ('access','email','technical','billing','other')),
 subject text not null check (char_length(subject) between 1 and 120),
 description text not null check (char_length(description) between 10 and 3000),
 status text not null default 'open' check (status in ('open','in_progress','resolved','closed')),
 created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
alter table public.support_tickets enable row level security;
revoke all on public.support_tickets from anon;
grant select,insert on public.support_tickets to authenticated;
-- Student cannot forge another student's ticket; client cannot choose a privileged status.
create policy "students_create_own_support_tickets" on public.support_tickets for insert to authenticated with check (student_id = (select auth.uid()) and status = 'open');
create policy "students_read_own_support_tickets" on public.support_tickets for select to authenticated using (student_id = (select auth.uid()));
-- Admin access should be added only after verifying is_pluton_admin() implementation and grants.
-- Server-side admin updates, notifications, audit logging and rate limits are NOT implemented here.
