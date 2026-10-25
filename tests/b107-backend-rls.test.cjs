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
test('real PostgreSQL RLS: content, owner progress, storage and revoked replay',async()=>{const db=await setup();try{
 await role(db,'authenticated');assert.equal((await db.query("select public.b107_course_content('ELEC-101') payload")).rows[0].payload,null);
 await assert.rejects(db.exec(`insert into public.b107_lesson_progress values('${uid}','ELEC-101',1,true,now())`));
 await assert.rejects(db.query(`select public.b107_grant_purchase('cs_test_one','${uid}','ELEC-101')`));
 await role(db,'service_role');assert.equal((await db.query(`select public.b107_grant_purchase('cs_test_one','${uid}','ELEC-101') granted`)).rows[0].granted,true);
 await role(db,'authenticated');assert.deepEqual((await db.query("select public.b107_course_content('ELEC-101') payload")).rows[0].payload,{secret:'electric'});
 assert.equal((await db.query("select public.b107_course_content('HVAC-101') payload")).rows[0].payload,null);
 assert.deepEqual((await db.query('select name from storage.objects')).rows.map(x=>x.name),['ELEC-101/lesson.mp4']);
 await db.exec(`insert into public.b107_lesson_progress values('${uid}','ELEC-101',1,true,now())`);
 await assert.rejects(db.exec(`update public.b107_lesson_progress set user_id='${other}'`));
 await assert.rejects(db.exec(`insert into public.b107_lesson_progress values('${uid}','ELEC-101',21,true,now())`));
 await role(db,'authenticated',other);assert.equal((await db.query('select * from public.b107_lesson_progress')).rows.length,0);
 await role(db,'service_role');await db.exec(`update public.course_purchase_access set active=false where user_id='${uid}'`);
 assert.equal((await db.query(`select public.b107_grant_purchase('cs_test_one','${uid}','ELEC-101') granted`)).rows[0].granted,false);
 await assert.rejects(db.query(`select public.b107_grant_purchase('cs_test_one','${other}','ELEC-101')`));
 await role(db,'authenticated');assert.equal((await db.query('select * from public.b107_lesson_progress')).rows.length,0);assert.equal((await db.query('select * from storage.objects')).rows.length,0);
 await assert.rejects(db.exec(`insert into public.b107_lesson_progress values('${uid}','ELEC-101',2,true,now())`));
 await db.exec("select set_config('test.admin','true',false)");assert.deepEqual((await db.query("select public.b107_course_content('HVAC-101') payload")).rows[0].payload,{secret:'hvac'});
 }finally{await db.close();}});
test('schema aborts instead of weakening an existing public bucket or permissive read policy',async()=>{for(const mutation of ["insert into storage.buckets values('b107-course-media','b107-course-media',true)","create policy open_read on storage.objects for select using(true)"]){const db=new PGlite();try{await db.exec('create schema storage;create table storage.buckets(id text,name text,public boolean);create table storage.objects(name text);');await db.exec(mutation);await assert.rejects(db.exec(schema),/B107 abort/);}finally{await db.close();}}});
