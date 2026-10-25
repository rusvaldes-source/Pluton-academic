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
`);await db.exec(fs.readFileSync('docs/B93_ACCESS_SCHEMA.sql','utf8'));await db.exec(schema);await db.exec(fs.readFileSync('database/b108_purchase_sessions.sql','utf8'));await db.exec(`insert into public.course_premium_content(course_code,payload) values('ELEC-101','{"secret":"electric"}'),('HVAC-101','{"secret":"hvac"}'),('BEAUTY-101','{"secret":"beauty"}');insert into storage.objects values('b107-course-media','ELEC-101/lesson.mp4'),('b107-course-media','HVAC-101/lesson.mp4'),('b107-course-media','ELEC-101evil/lesson.mp4');`);return db;}
async function role(db,r,id=uid){await db.exec(`reset role;set role ${r};select set_config('request.jwt.claim.sub','${id}',false);`);}
test('B108 real SQL ledger rejects browser grants and replay for all ten courses',async()=>{const db=await setup();try{
 const codes=['PA-101','PA-203','ID-101','MKT-201','NA-101','COMP-101','ID-001','ELEC-101','HVAC-101','BEAUTY-101'];
 for(const [i,code] of codes.entries()){
  const session='cs_test_b108'+i;
  await role(db,'authenticated');await assert.rejects(db.query('select public.b107_grant_purchase($1,$2,$3)',[session,uid,code]));
  await role(db,'service_role');assert.equal((await db.query('select public.b107_grant_purchase($1,$2,$3) granted',[session,uid,code])).rows[0].granted,true);
  await db.query('update public.course_purchase_access set active=false where user_id=$1 and course_code=$2',[uid,code]);
  assert.equal((await db.query('select public.b107_grant_purchase($1,$2,$3) granted',[session,uid,code])).rows[0].granted,false);
  assert.equal((await db.query('select active from public.course_purchase_access where user_id=$1 and course_code=$2',[uid,code])).rows[0].active,false);
  await assert.rejects(db.query('select public.b107_grant_purchase($1,$2,$3)',[session,other,code]),/binding mismatch/);
  assert.equal((await db.query('select public.b107_grant_purchase($1,$2,$3) granted',[session+'new',uid,code])).rows[0].granted,true);
 }
 await assert.rejects(db.query('select public.b107_grant_purchase($1,$2,$3)',['cs_test_unknown',uid,'FAKE-101']),/Invalid course/);
 }finally{await db.close();}});
