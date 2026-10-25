const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const {PGlite}=require('@electric-sql/pglite');
const schema=fs.readFileSync('docs/B107_SCHEMA.sql','utf8');
const uid='11111111-1111-4111-8111-111111111111', other='22222222-2222-4222-8222-222222222222';
async function setup(){const db=new PGlite();await db.exec(`create role anon; create role authenticated; create role service_role bypassrls;
create schema auth; create table auth.users(id uuid primary key); insert into auth.users values('${uid}'),('${other}');
create function auth.uid() returns uuid language sql stable as $$select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid$$;
grant usage on schema auth to authenticated; grant execute on function auth.uid() to authenticated;
create function public.is_pluton_admin() returns boolean language sql stable as $$select coalesce(current_setting('test.admin',true),'')='true'$$;
create schema storage; create table storage.buckets(id text primary key,name text,public boolean);
create table storage.objects(bucket_id text,name text); alter table storage.objects enable row level security;
create function storage.foldername(text) returns text[] language sql immutable as $$ select (string_to_array($1,'/'))[1:array_length(string_to_array($1,'/'),1)-1] $$;
grant usage on schema storage to authenticated; grant select on storage.objects to authenticated;
`);await db.exec(fs.readFileSync('docs/B93_ACCESS_SCHEMA.sql','utf8'));await db.exec(schema);await db.exec(`insert into public.course_premium_content(course_code,payload) values('ELEC-101','{"secret":"electric"}'),('HVAC-101','{"secret":"hvac"}'),('BEAUTY-101','{"secret":"beauty"}');insert into storage.objects values('b107-course-media','ELEC-101/lesson.mp4'),('b107-course-media','HVAC-101/lesson.mp4'),('b107-course-media','ELEC-101evil/lesson.mp4');`);return db;}
async function role(db,r,id=uid){await db.exec(`reset role;set role ${r};select set_config('request.jwt.claim.sub','${id}',false);`);}
const prep=()=>fs.existsSync('database/b108_media_prepare.sql')?fs.readFileSync('database/b108_media_prepare.sql','utf8'):'';
const finalize=()=>fs.existsSync('database/b108_media_finalize.sql')?fs.readFileSync('database/b108_media_finalize.sql','utf8'):'';
async function mediaSetup(){const db=await setup();await db.exec("insert into storage.buckets values('pa203-videos','pa203-videos',true),('id101-videos','id101-videos',true),('mkt201-videos','mkt201-videos',true),('lesson-videos-b80','lesson-videos-b80',true);");await db.exec(prep());return db;}
test('media migration supplies a protected per-file ownership inventory',async()=>{const db=await mediaSetup();try{const rows=await db.query("select tablename from pg_tables where schemaname='public' and tablename='b108_media_assets'");assert.equal(rows.rows.length,1,'protected media inventory exists');}finally{await db.close()}});
test('media ownership restricts file reads and mapping reads; B107 continues unchanged',async()=>{const db=await mediaSetup();try{
 await db.exec('insert into storage.objects(bucket_id,name) select bucket_id,object_name from public.b108_media_assets');
 await role(db,'authenticated');assert.equal((await db.query('select * from public.b108_media_assets')).rows.length,0);assert.equal((await db.query('select * from storage.objects')).rows.length,0);await assert.rejects(db.exec("insert into public.b108_media_assets values('id101-videos','forged.mp4','ID-101')"));
 await role(db,'service_role');await db.exec(`insert into public.course_purchase_access(user_id,course_code) values('${uid}','ID-101'),('${uid}','ELEC-101')`);
 await role(db,'authenticated');assert.equal((await db.query('select * from public.b108_media_assets')).rows.length,12);assert.equal((await db.query("select * from storage.objects where bucket_id='id101-videos'")).rows.length,12);assert.equal((await db.query("select * from storage.objects where bucket_id='b107-course-media'")).rows.length,1);assert.equal((await db.query("select * from storage.objects where bucket_id='lesson-videos-b80'")).rows.length,0);
 await role(db,'authenticated',other);assert.equal((await db.query('select * from storage.objects')).rows.length,0);
 await role(db,'service_role');await db.exec(`update public.course_purchase_access set active=false where user_id='${uid}'`);await role(db,'authenticated');assert.equal((await db.query('select * from storage.objects')).rows.length,0);
 }finally{await db.close()}});
test('finalization refuses missing originals before changing bucket visibility',async()=>{const db=await mediaSetup();try{await assert.rejects(db.exec(finalize()),/B108.*missing/i);await db.exec('rollback');assert.equal((await db.query("select count(*)::int n from storage.buckets where public")).rows[0].n,4);await db.exec('insert into storage.objects(bucket_id,name) select bucket_id,object_name from public.b108_media_assets');await db.exec('update public.b108_media_assets set verified_sha256=expected_sha256');await db.exec(finalize());assert.equal((await db.query("select count(*)::int n from storage.buckets where public")).rows[0].n,0);assert.equal((await db.query('select * from public.b108_media_assets')).rows.length,93);}finally{await db.close()}});
test('finalization rejects unverified recordings even if all expected paths exist',async()=>{const db=await mediaSetup();try{await db.exec('insert into storage.objects(bucket_id,name) select bucket_id,object_name from public.b108_media_assets');await assert.rejects(db.exec(finalize()),/B108.*hash/i);}finally{await db.close()}});
