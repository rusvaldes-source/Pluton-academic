-- B108 PREPARE: keep current public visibility until the coordinated cutover.
-- Metadata only. Upload and hash-check the 45 existing recordings before FINALIZE.
begin;
do $$ begin
 if exists(select 1 from storage.buckets where id='b108-course-media' and public) then
  raise exception 'B108 media bucket must be private';
 end if;
end $$;
insert into storage.buckets(id,name,public) values('b108-course-media','b108-course-media',false) on conflict(id) do nothing;
create table public.b108_media_assets (
 bucket_id text not null,
 object_name text not null,
 expected_sha256 text check(expected_sha256 ~ '^[a-f0-9]{64}$'),
 verified_sha256 text check(verified_sha256 ~ '^[a-f0-9]{64}$'),
 expected_bytes bigint check(expected_bytes>0),
 course_code text not null check(course_code in ('PA-203','ID-101','MKT-201','NA-101','COMP-101','ID-001')),
 primary key(bucket_id,object_name)
);
alter table public.b108_media_assets enable row level security;
revoke all on public.b108_media_assets from public,anon,authenticated;
grant select on public.b108_media_assets to authenticated;
grant all on public.b108_media_assets to service_role;
create policy b108_media_inventory_owner on public.b108_media_assets for select to authenticated using(
 (select auth.uid()) is not null and ((select public.is_pluton_admin()) or exists(
 select 1 from public.course_purchase_access a where a.user_id=(select auth.uid())
 and a.course_code=b108_media_assets.course_code and a.active)));
insert into public.b108_media_assets(bucket_id,object_name,course_code,expected_sha256,expected_bytes) values
 ('pa203-videos','PA-203_Leccion_01_cc4044a4a2c5c95c4d42eb2175c1a3d1.mp4','PA-203',null,null),
 ('pa203-videos','PA-203_Leccion_02_2af2c139ccb79853b26a3096cee38e7b.mp4','PA-203',null,null),
 ('pa203-videos','PA-203_Leccion_03_b51d75a3472e644708f8c5862407214f.mp4','PA-203',null,null),
 ('pa203-videos','PA-203_Leccion_04_649c942ce17b0d7c914406c841b70b03.mp4','PA-203',null,null),
 ('pa203-videos','PA-203_Leccion_05_05423b95514bd66e8608b753dfd44a00.mp4','PA-203',null,null),
 ('pa203-videos','PA-203_Leccion_06_2e07f54d434467a07494e38951d85a17.mp4','PA-203',null,null),
 ('pa203-videos','PA-203_Leccion_07_6c90166c69872a754564584be5aaaa8d.mp4','PA-203',null,null),
 ('pa203-videos','PA-203_Leccion_08_95b0d1b0e3f5d46cd3c5f36dcb3ae5c6.mp4','PA-203',null,null),
 ('id101-videos','ID-101_Leccion_01_364eadf048b173cdc8f1594821621e59.mp4','ID-101',null,null),
 ('id101-videos','ID-101_Leccion_02_5de535132127f232aeb8ae55b3fb9b17.mp4','ID-101',null,null),
 ('id101-videos','ID-101_Leccion_03_03462ec6506efc54df6ae40b9780ad82.mp4','ID-101',null,null),
 ('id101-videos','ID-101_Leccion_04_a04e89dd967105fa6c9f4b48345edca1.mp4','ID-101',null,null),
 ('id101-videos','ID-101_Leccion_05_f52e2b7ef3e9dfb6fb9d31bc30b9e322.mp4','ID-101',null,null),
 ('id101-videos','ID-101_Leccion_06_0b6561f0dbe68389d0b78b24c1a10cc6.mp4','ID-101',null,null),
 ('id101-videos','ID-101_Leccion_07_d9b5120acfa059fe697b6789a8df9707.mp4','ID-101',null,null),
 ('id101-videos','ID-101_Leccion_08_36f0dc3836d955adae2b7cc213a99dd0.mp4','ID-101',null,null),
 ('id101-videos','ID-101_Leccion_09_575d66c0f2f364e28f1842bc4947bc69.mp4','ID-101',null,null),
 ('id101-videos','ID-101_Leccion_10_7980fee93b799ab037a9e8ffa243832a.mp4','ID-101',null,null),
 ('id101-videos','ID-101_Leccion_11_623616e99d880a219d4dc52775cf03ee.mp4','ID-101',null,null),
 ('id101-videos','ID-101_Leccion_12_95dfb4ed3cdbf72f1d9c29e07eb4af50.mp4','ID-101',null,null),
 ('mkt201-videos','MKT-201_Leccion_01_d50ceac7f0b5568c32fabcc7731136d4.mp4','MKT-201',null,null),
 ('mkt201-videos','MKT-201_Leccion_02_d177878a58589c0b8787c0572516c0d6.mp4','MKT-201',null,null),
 ('mkt201-videos','MKT-201_Leccion_03_19ff97f87fd9949ed252c215448f0a22.mp4','MKT-201',null,null),
 ('mkt201-videos','MKT-201_Leccion_04_808725bb6126138b823ea58a454fb459.mp4','MKT-201',null,null),
 ('mkt201-videos','MKT-201_Leccion_05_b5e589293a733d564ae572ac9a134e8d.mp4','MKT-201',null,null),
 ('mkt201-videos','MKT-201_Leccion_06_728ead1afd1cca067028a3c82d227d74.mp4','MKT-201',null,null),
 ('mkt201-videos','MKT-201_Leccion_07_8e35afae9cc7cf4673a3dff7a3eb0687.mp4','MKT-201',null,null),
 ('mkt201-videos','MKT-201_Leccion_08_d1f8544fe893cd91d858c27c6265c9e8.mp4','MKT-201',null,null),
 ('lesson-videos-b80','COMP-101/L01/COMP-101_L01_ES.mp4','COMP-101',null,null),
 ('lesson-videos-b80','COMP-101/L02/COMP-101_L02_ES.mp4','COMP-101',null,null),
 ('lesson-videos-b80','COMP-101/L03/COMP-101_L03_ES.mp4','COMP-101',null,null),
 ('lesson-videos-b80','COMP-101/L04/COMP-101_L04_ES.mp4','COMP-101',null,null),
 ('lesson-videos-b80','COMP-101/L05/COMP-101_L05_ES.mp4','COMP-101',null,null),
 ('lesson-videos-b80','COMP-101/L06/COMP-101_L06_ES.mp4','COMP-101',null,null),
 ('lesson-videos-b80','COMP-101/L07/COMP-101_L07_ES.mp4','COMP-101',null,null),
 ('lesson-videos-b80','COMP-101/L08/COMP-101_L08_ES.mp4','COMP-101',null,null),
 ('lesson-videos-b80','NA-101/L01/NA-101_L01_ES.mp4','NA-101',null,null),
 ('lesson-videos-b80','NA-101/L02/NA-101_L02_ES.mp4','NA-101',null,null),
 ('lesson-videos-b80','NA-101/L03/NA-101_L03_ES.mp4','NA-101',null,null),
 ('lesson-videos-b80','NA-101/L04/NA-101_L04_ES.mp4','NA-101',null,null),
 ('lesson-videos-b80','NA-101/L05/NA-101_L05_ES.mp4','NA-101',null,null),
 ('lesson-videos-b80','NA-101/L06/NA-101_L06_ES.mp4','NA-101',null,null),
 ('lesson-videos-b80','NA-101/L07/NA-101_L07_ES.mp4','NA-101',null,null),
 ('lesson-videos-b80','NA-101/L08/NA-101_L08_ES.mp4','NA-101',null,null),
 ('lesson-videos-b80','NA-101/L09/NA-101_L09_ES.mp4','NA-101',null,null),
 ('lesson-videos-b80','NA-101/L10/NA-101_L10_ES.mp4','NA-101',null,null),
 ('lesson-videos-b80','NA-101/L11/NA-101_L11_ES.mp4','NA-101',null,null),
 ('lesson-videos-b80','NA-101/L12/NA-101_L12_ES.mp4','NA-101',null,null),
 ('b108-course-media','ID-001/B102_ID001-02-01-en_Ruslan.mp3','ID-001','110c51f8d17e9a6ff9de1c0bca5d1230963387fc6dfb7cf88c397a6714e17514',2277260),
 ('b108-course-media','ID-001/B102_ID001-02-01-es_Adays.mp3','ID-001','05f33ae30885346de595645ca06f9e89d3169b64bddac37b188b1e1b77e6087f',1929936),
 ('b108-course-media','ID-001/B102_ID001-02-02-en_Ruslan.mp3','ID-001','9cf7d46ff94bb22c40679d62788de64d3d4e00613223740362f1e2e60e1ae7c5',2984086),
 ('b108-course-media','ID-001/B102_ID001-02-02-es_Adays.mp3','ID-001','cfff3faefcbd9941a451409ba6749e1d13775bd40b3a90f79d829005b2c68a28',3315736),
 ('b108-course-media','ID-001/B102_ID001-02-03-en_Ruslan.mp3','ID-001','81c55e64b021644d5ac7e03d9467b7d79a1d8cdcba2ac6b818b0dcf328d3b6b1',2638016),
 ('b108-course-media','ID-001/B102_ID001-02-03-es_Adays.mp3','ID-001','e7e75ec27dc48010176612d9614b65e468f63a5979586d0decf10a46ac3134a7',3596604),
 ('b108-course-media','ID-001/B102_ID001-03-01-en_Ruslan.mp3','ID-001','7caa847f3c83532216becdbc011c2a0ee1fbdf8cc91c414c724d80fb1ffda3d0',2612939),
 ('b108-course-media','ID-001/B102_ID001-03-01-es_Adays.mp3','ID-001','5f068a2ae3facabb318f17dbe712cfc28023e97d0aa0337d290d3d018e4b81d1',3152105),
 ('b108-course-media','ID-001/B102_ID001-03-02-en_Ruslan.mp3','ID-001','39d1f91a287ed3815b3c9661f2c9b81a5f836d49de614f657e314b6afd24f5ae',2448681),
 ('b108-course-media','ID-001/B102_ID001-03-02-es_Adays.mp3','ID-001','778b383120a079c4f149e7f03ab7e9574e150f536dbe040fb1e5d478bd7c3fc2',3056183),
 ('b108-course-media','ID-001/B102_ID001-03-03-en_Ruslan.mp3','ID-001','8d0795b2aa7482abcba8e23f2d44733afe6cbb33de7170d0e361296d739f4e91',2476266),
 ('b108-course-media','ID-001/B102_ID001-03-03-es_Adays.mp3','ID-001','d86d7c384a0d640023c504541943dcd6325a8442127b62a35c71447b3a2c477a',2953365),
 ('b108-course-media','ID-001/B102_ID001-04-01-en_Ruslan.mp3','ID-001','85998360b91fc0474f2246313e414db026b24f48d03d62a2b59db3f82291e92c',2668109),
 ('b108-course-media','ID-001/B102_ID001-04-01-es_Adays.mp3','ID-001','4d67c8b2fc8f069b2338e9477aea4f5030ac8e382ce924c9c1708119ff5738ab',3409777),
 ('b108-course-media','ID-001/B102_ID001-04-02-en_Ruslan.mp3','ID-001','7c678df20b6732e65440d52596a507e318d5b34a64c0c2330d1265971a845aaa',2721399),
 ('b108-course-media','ID-001/B102_ID001-04-02-es_Adays.mp3','ID-001','96a2c6e3a79d007ca6c3a0f461fa1c98dfe575c779929ff93dad6a63eabe3dfa',3190348),
 ('b108-course-media','ID-001/B102_ID001-04-03-en_Ruslan.mp3','ID-001','0a58e92129aa762fd6e72249ede99f8139dbb470c2b5bcbdf00123f871243d64',2491939),
 ('b108-course-media','ID-001/B102_ID001-04-03-es_Adays.mp3','ID-001','31e76e461dc71bf011bae0e3a35e17d64cdf10e32d0e642ad81c6273ac7cd552',3149597),
 ('b108-course-media','ID-001/B102_ID001-05-01-en_Ruslan.mp3','ID-001','9c41e1a150b1dea241c54163a89ff51e968992dc9d77feaa970775881498ca49',2387241),
 ('b108-course-media','ID-001/B102_ID001-05-01-es_Adays.mp3','ID-001','5aa5ca01c86e96d4c09879b3d1ee2d80f9c92a6b4ae92b8beb729496d75df9ee',2841770),
 ('b108-course-media','ID-001/B102_ID001-05-02-en_Ruslan.mp3','ID-001','d283750e61d500ee27f67336c43b731171c230314d7752244aa41a77c0b2c635',2390376),
 ('b108-course-media','ID-001/B102_ID001-05-02-es_Adays.mp3','ID-001','21f6f637e887370e0b7a6ca2b76655e7f17288ab17fa5cdc537a9676e2d65c9a',2736445),
 ('b108-course-media','ID-001/B102_ID001-05-03-en_Ruslan.mp3','ID-001','7476c5b01da9dbf943b181ac088209900aa8051dc6dab6b49cfaa3e9a0af05eb',2360910),
 ('b108-course-media','ID-001/B102_ID001-05-03-es_Adays.mp3','ID-001','d4507811ba651e5353742fb6aa3f69f614e076be7332a7ee5bb71de1b968a06d',2806663),
 ('b108-course-media','ID-001/B102_ID001-06-01-en_Ruslan.mp3','ID-001','3597bf0b2464ce027ed4da52659066c6702f709282a1d7c93a5bd4a8c074961f',2291320),
 ('b108-course-media','ID-001/B102_ID001-06-01-es_Adays.mp3','ID-001','5694bd79ece41663db87223d989d0d9b5a45c135a8f1c7a0b248feebe4bfd172',2720772),
 ('b108-course-media','ID-001/B102_ID001-06-02-en_Ruslan.mp3','ID-001','1cc019bb13ba030db06635640c07d6986a7fb930d58b81cc28e61279e1d54061',2169067),
 ('b108-course-media','ID-001/B102_ID001-06-02-es_Adays.mp3','ID-001','eee4fa281fab2c75ee79ad91c7bc1f52ca5a303a2ba59c0e7677352d37338aca',2747103),
 ('b108-course-media','ID-001/B102_ID001-06-03-en_Ruslan.mp3','ID-001','c55c164fa6eaca85ebf03253ffe1f4f76be8f74a14973091005051888d1e0a38',2451189),
 ('b108-course-media','ID-001/B102_ID001-06-03-es_Adays.mp3','ID-001','341999c39303ce47306d687e7879f93a0470e5934d1d15869e683f1550191756',2631120),
 ('b108-course-media','ID-001/B102_ID001-07-01-en_Ruslan.mp3','ID-001','aa98c55c948ff338f4221d94d93a5fed4853da1442faa3095e90fbdcfa9e4f6b',2538334),
 ('b108-course-media','ID-001/B102_ID001-07-01-es_Adays.mp3','ID-001','ea37a972194741cb668db2095a5cf0edb9116709a87efeb32bd8d98741a22899',3001014),
 ('b108-course-media','ID-001/B102_ID001-07-02-en_Ruslan.mp3','ID-001','5d7ad945e837b022905ab9d0d60a3d7834d0b484beeedb3e2f6275b0c2fbc4b0',2620463),
 ('b108-course-media','ID-001/B102_ID001-07-02-es_Adays.mp3','ID-001','74282df2cfa076664143d85c71c6507a42cdef6b9c06719796e965f1f2f5f0eb',2743342),
 ('b108-course-media','ID-001/B102_ID001-07-03-en_Ruslan.mp3','ID-001','c5cc21051d6ebcb201d2eb831b30cc44e370b3e1c3f3237f91bcc51709bfd831',2768420),
 ('b108-course-media','ID-001/B102_ID001-09-01-en_Ruslan.mp3','ID-001','a114c7e55cc6e0cb56d4d683710cc6e73631045830d3f455c106dfbf4a8306c8',2547111),
 ('b108-course-media','ID-001/B102_ID001-09-01-es_Adays.mp3','ID-001','82313dd8de2d524c10a63283f8544d7583e7544541130807ab717f10b93ebb7e',2822336),
 ('b108-course-media','ID-001/B102_ID001-09-02-en_Ruslan.mp3','ID-001','2557a019627aaf6bcbc4311a7346c11e809aaac5e687922282f2152e01ff8478',2627986),
 ('b108-course-media','ID-001/B102_ID001-09-02-es_Adays.mp3','ID-001','b6a5a09a82a38ef88186f212ab9d66e386c1c5b2314059e840cf72b6800c7e88',3259312),
 ('b108-course-media','ID-001/B102_ID001-09-03-en_Ruslan.mp3','ID-001','40d674b10649fe72bd59df0864a0b0fc5368f6047d6866e7d4b35878b9ca60ba',2885658),
 ('b108-course-media','ID-001/B102_ID001-09-03-es_Adays.mp3','ID-001','6e3a1c6ef3a2093cba9a42380f994e4b2c8fb78f66132d06b7a2f97cd9844c26',3367146),
 ('b108-course-media','ID-001/B102_ID001-10-01-en_Ruslan.mp3','ID-001','e93d97bc0037329d113b621b43f07e0ab75cdaec97dfa0fd689122cdc21b5971',3015434),
 ('b108-course-media','ID-001/B102_ID001-10-01-es_Adays.mp3','ID-001','ecda9688ca47363a9ab350172d93a9b00b97d1423abc8de287ace7166fa5b25d',3723247),
 ('b108-course-media','ID-001/B102_ID001-10-02-en_Ruslan.mp3','ID-001','ced5cf5d761bb5e8414c8b3de11bb135af8d34783244fed75fedf5890ddc20ac',3142703),
 ('b108-course-media','ID-001/B102_ID001-10-02-es_Adays.mp3','ID-001','f37244ab3d5783c59ce7707234304485130029bdf9c012c79abb20db6ee7e717',3184080);
-- The inventory itself is filtered by purchase RLS. No browser write grants.
create policy b108_legacy_media_read on storage.objects for select to authenticated using(
 exists(select 1 from public.b108_media_assets m where m.bucket_id=objects.bucket_id and m.object_name=objects.name));
-- Add an AND restriction so an unrelated permissive policy cannot reopen these buckets.
create policy b108_legacy_media_guard on storage.objects as restrictive for select to authenticated using(
 bucket_id not in ('pa203-videos','id101-videos','mkt201-videos','lesson-videos-b80','b108-course-media')
 or exists(select 1 from public.b108_media_assets m where m.bucket_id=objects.bucket_id and m.object_name=objects.name));
create policy b108_legacy_media_no_anon on storage.objects as restrictive for select to anon using(
 bucket_id not in ('pa203-videos','id101-videos','mkt201-videos','lesson-videos-b80','b108-course-media'));
notify pgrst,'reload schema';
commit;
