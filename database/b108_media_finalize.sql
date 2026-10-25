-- B108 FINALIZE: apply only together with the filtered Pages build and private players.
-- Does not delete, replace or rename any original object.
begin;
do $$ begin
 if (select count(*) from public.b108_media_assets)<>93 then
  raise exception 'B108 media inventory must contain 93 reviewed originals';
 end if;
 if exists(select 1 from public.b108_media_assets m left join storage.objects o
  on o.bucket_id=m.bucket_id and o.name=m.object_name where o.name is null) then
  raise exception 'B108 missing media originals: upload and verify before privatizing';
 end if;
 if exists(select 1 from public.b108_media_assets where expected_sha256 is not null and verified_sha256 is distinct from expected_sha256) then
  raise exception 'B108 hash verification receipts missing for private recordings';
 end if;
 if (select count(*) from storage.buckets where id in ('pa203-videos','id101-videos','mkt201-videos','lesson-videos-b80','b108-course-media'))<>5 then
  raise exception 'B108 missing media bucket';
 end if;
end $$;
update storage.buckets set public=false where id in ('pa203-videos','id101-videos','mkt201-videos','lesson-videos-b80','b108-course-media');
commit;
