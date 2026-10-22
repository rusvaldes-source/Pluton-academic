-- Borrador de migracion; NO ejecutado. Requiere revision antes de aplicar.
create table if not exists public.tv_programs (
 id uuid primary key default gen_random_uuid(),
 title text not null,
 section text not null,
 description text not null default '',
 video_url text,
 license_note text,
 status text not null default 'draft' check (status in ('draft','review','approved','published','retired')),
 sort_order integer not null default 0,
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now()
);
alter table public.tv_programs enable row level security;
create policy tv_admin_read on public.tv_programs for select to authenticated using (exists(select 1 from public.support_admins a where a.user_id=(select auth.uid())));
create policy tv_admin_insert on public.tv_programs for insert to authenticated with check (exists(select 1 from public.support_admins a where a.user_id=(select auth.uid())));
create policy tv_admin_update on public.tv_programs for update to authenticated using (exists(select 1 from public.support_admins a where a.user_id=(select auth.uid()))) with check (exists(select 1 from public.support_admins a where a.user_id=(select auth.uid())));
create policy tv_admin_delete on public.tv_programs for delete to authenticated using (exists(select 1 from public.support_admins a where a.user_id=(select auth.uid())));
-- No se conceden permisos anonimos de escritura.
