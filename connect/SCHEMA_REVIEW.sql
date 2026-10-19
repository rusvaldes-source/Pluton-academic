-- B78 PLUTÓN CONNECT: aplicar tras revisión de seguridad, no ejecutado en producción.
create table if not exists public.connect_profiles (
 user_id uuid primary key references auth.users(id) on delete cascade,
 display_name text not null check (char_length(trim(display_name)) between 1 and 60),
 country text not null default '' check (char_length(country)<=60),
 created_at timestamptz not null default now()
);
create table if not exists public.connect_posts (
 id bigint generated always as identity primary key,
 user_id uuid not null references auth.users(id) on delete cascade,
 author_name text not null check (char_length(trim(author_name)) between 1 and 60),
 body text not null check (char_length(trim(body)) between 1 and 1000),
 created_at timestamptz not null default now()
);
alter table public.connect_profiles enable row level security;
alter table public.connect_posts enable row level security;
create policy "Connect profiles read signed in" on public.connect_profiles for select to authenticated using (true);
create policy "Connect profile insert own" on public.connect_profiles for insert to authenticated with check ((select auth.uid())=user_id);
create policy "Connect profile update own" on public.connect_profiles for update to authenticated using ((select auth.uid())=user_id) with check ((select auth.uid())=user_id);
create policy "Connect posts read signed in" on public.connect_posts for select to authenticated using (true);
create policy "Connect posts insert own" on public.connect_posts for insert to authenticated with check ((select auth.uid())=user_id);
create policy "Connect posts delete own" on public.connect_posts for delete to authenticated using ((select auth.uid())=user_id);
grant select,insert,update on public.connect_profiles to authenticated;
grant select,insert,delete on public.connect_posts to authenticated;
grant usage,select on sequence public.connect_posts_id_seq to authenticated;
