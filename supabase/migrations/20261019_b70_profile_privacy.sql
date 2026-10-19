-- Existing dashboard owns profiles by email; legacy IDs do not map to Auth IDs.
-- Preserve all existing rows and membership/status values. Server writes remain available.
drop policy if exists "Enable read access for all users" on public.profiles;
drop policy if exists "Enable insert for authenticated users only" on public.profiles;
revoke all on public.profiles from anon, authenticated;
grant select on public.profiles to authenticated;
create policy "Students read own verified email profile"
 on public.profiles for select to authenticated
 using (lower(btrim(email))=lower(btrim((select auth.jwt()->>'email'))) and (select auth.uid()) is not null);
