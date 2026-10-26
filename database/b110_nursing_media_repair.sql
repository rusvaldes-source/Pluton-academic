-- B110: restore the existing nursing media as labelled PA-101 support.
-- No purchases, payment settings, original media bytes or lesson bodies change.
begin;
create table if not exists b107_private.b110_media_repair_backup(
 item text primary key, snapshot jsonb not null, saved_at timestamptz not null default now()
);
alter table b107_private.b110_media_repair_backup enable row level security;
revoke all on b107_private.b110_media_repair_backup from public,anon,authenticated;
grant all on b107_private.b110_media_repair_backup to service_role;

do $$
declare original public.course_public_content%rowtype; editor public.course_editor_state%rowtype;
 support jsonb; repaired jsonb; next_revision bigint;
begin
 select * into strict original from public.course_public_content where course_code='PA-101' for update;
 select * into strict editor from public.course_editor_state where course_code='PA-101' for update;
 if editor.draft_revision<>editor.published_revision or (editor.draft_payload is not null and editor.draft_payload is distinct from original.payload) then
  raise exception 'B110: preserve pending PA-101 editorial work before repair';
 end if;
 if jsonb_array_length(original.payload->'lessons')<>10 then raise exception 'B110: unexpected PA-101 curriculum';end if;
 select jsonb_agg(jsonb_build_object('title',l->'title','video',l->'video') order by ordinal)
 into support from public.course_learning_content c cross join lateral jsonb_array_elements(c.payload->'lessons') with ordinality as lesson(l,ordinal)
 where c.course_code='NA-101' and c.published;
 if jsonb_array_length(support) is distinct from 12 then raise exception 'B110: expected twelve reviewed nursing originals';end if;
 if exists(select 1 from jsonb_array_elements(support) v where v->>'video' not like 'https://paifjzznyiehwidoqjqb.supabase.co/storage/v1/object/public/lesson-videos-b80/NA-101/%'
  or not exists(select 1 from storage.objects o where o.bucket_id='lesson-videos-b80' and o.name=split_part(v->>'video','/lesson-videos-b80/',2))) then
  raise exception 'B110: a nursing original is missing or has an unexpected path';
 end if;
 insert into b107_private.b110_media_repair_backup(item,snapshot) values
 ('PA-101:published',to_jsonb(original)),('PA-101:editor',to_jsonb(editor)),
 ('b108_media_inventory_owner',(select to_jsonb(p) from pg_policies p where schemaname='public' and tablename='b108_media_assets' and policyname='b108_media_inventory_owner'))
 on conflict(item) do nothing;
 repaired=jsonb_set(original.payload,'{support_videos}',support,true);
 if repaired is distinct from original.payload then
  select greatest(original.revision,coalesce(max(revision),0))+1 into next_revision from public.course_content_versions where course_code='PA-101';
  insert into public.course_content_versions(course_code,revision,payload,created_by) values('PA-101',next_revision,repaired,null);
  update public.course_public_content set payload=repaired,revision=next_revision,updated_at=now() where course_code='PA-101';
  update public.course_editor_state set published_revision=next_revision,draft_revision=next_revision,draft_payload=repaired,updated_at=now() where course_code='PA-101';
 end if;
end $$;

alter policy b108_media_inventory_owner on public.b108_media_assets using(
 (select auth.uid()) is not null and (
 (select public.is_pluton_admin()) or exists(
  select 1 from public.course_purchase_access a where a.user_id=(select auth.uid()) and a.active and (
   a.course_code=b108_media_assets.course_code or (
    a.course_code='PA-101' and b108_media_assets.course_code='NA-101'
    and b108_media_assets.bucket_id='lesson-videos-b80'
    and exists(select 1 from public.course_public_content c cross join lateral jsonb_array_elements(coalesce(c.payload->'support_videos','[]'::jsonb)) v
      where c.course_code='PA-101' and v->>'video'='https://paifjzznyiehwidoqjqb.supabase.co/storage/v1/object/public/'||b108_media_assets.bucket_id||'/'||b108_media_assets.object_name)
   )
  )
 ))
);
commit;
