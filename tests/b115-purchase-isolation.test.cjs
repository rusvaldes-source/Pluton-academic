const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const repo=path.resolve(__dirname,'..'),codes=['FAM-101','FAM-102','PSI-101','PSI-102'];
const sql=p=>fs.readFileSync(path.join(repo,p),'utf8');
// Reuse the existing B114 database fixture and production RLS definitions, without running its unrelated tests.
const loader=new Function('require','__dirname',sql('tests/b114-rls.test.cjs')+'\nreturn {fixture,role};');
const {fixture,role}=loader(id=>id==='node:test'?{test(){}}:require(id),__dirname);
const uid=i=>'00000000-0000-4000-8000-'+String(100+i).padStart(12,'0');

test('four isolated paid purchases grant exactly one B115 course and its 30 audios; refunds/replay/guests fail closed',async()=>{
 const db=await fixture();try{
  await db.exec(`create role service_role bypassrls; create schema b107_private; create table b107_private.purchase_sessions(session_id text primary key,user_id uuid,course_code text);grant usage on schema public,b107_private to service_role;grant all on b107_private.purchase_sessions,public.course_purchase_access to service_role;`);
  await db.exec(sql('database/b108_purchase_sessions.sql'));
  const oldRows=(await db.query('select * from public.course_learning_content order by course_code')).rows;
  await db.exec(sql('database/b115_integration_proposal.sql'));
  const seed=fs.readFileSync(path.join(process.env.B115_ROOT,'integration/b115-private-draft.sql'),'utf8');await db.exec(seed);
  assert.deepEqual((await db.query("select * from public.course_learning_content where course_code not in ('FAM-101','FAM-102','PSI-101','PSI-102') order by course_code")).rows,oldRows);
  assert.equal((await db.query("select * from public.course_learning_content where course_code like 'FAM-%' or course_code like 'PSI-%'")).rows.every(r=>r.published===false),true);
  assert.equal((await db.query("select * from public.course_editor_state where course_code in ('FAM-101','FAM-102','PSI-101','PSI-102')")).rows.length,0);
  await assert.rejects(db.exec(sql('database/b115_activate_after_approval.sql')),/requires_30_audio_objects/);await db.exec('rollback');
  for(const code of codes)for(const lang of ['es','en'])for(let n=1;n<=15;n++)await db.query('insert into storage.objects(bucket_id,name) values($1,$2)',['b115-course-media',code+'/'+code+'-L'+String(n).padStart(2,'0')+'-'+lang+'.mp3']);
  await db.query('insert into storage.objects(bucket_id,name) values($1,$2)',['b115-course-media','FAM-101/PSI-101-L01-es.mp3']);
  await db.exec(sql('database/b115_activate_after_approval.sql'));
  for(let i=0;i<4;i++){const code=codes[i],user=uid(i),session='cs_test_b115'+i;
   await db.query('insert into auth.users(id,email_confirmed_at) values($1,now())',[user]);
   await role(db,user);assert.equal((await db.query("select course_code from public.course_learning_content where course_code in ('FAM-101','FAM-102','PSI-101','PSI-102')")).rows.length,0);await assert.rejects(db.query('select public.b107_grant_purchase($1,$2,$3)',[session,user,code]));
   await db.exec('reset role;set role service_role');assert.equal((await db.query('select public.b107_grant_purchase($1,$2,$3) ok',[session,user,code])).rows[0].ok,true);
   await assert.rejects(db.query('select public.b107_grant_purchase($1,$2,$3)',[session,user,codes[(i+1)%4]]),/binding mismatch/);
   await role(db,user);const content=(await db.query("select course_code,payload from public.course_learning_content where course_code in ('FAM-101','FAM-102','PSI-101','PSI-102')")).rows;assert.deepEqual(content.map(x=>x.course_code),[code]);assert.equal(content[0].payload.price,9.99);assert.equal(content[0].payload.lessons.length,15);const media=(await db.query("select name from storage.objects where bucket_id='b115-course-media'")).rows;assert.equal(media.length,30);assert.ok(media.every(x=>x.name.startsWith(code+'/'+code+'-')));assert.equal((await db.query('select public.b95_course_published($1) result',[code])).rows[0].result.payload.code,code);
   for(const other of codes.filter(c=>c!==code))assert.equal((await db.query('select public.b95_course_published($1) result',[other])).rows[0].result,null);
   await db.exec('reset role');await db.query('update public.course_purchase_access set active=false where user_id=$1 and course_code=$2',[user,code]);await db.exec('set role service_role');assert.equal((await db.query('select public.b107_grant_purchase($1,$2,$3) ok',[session,user,code])).rows[0].ok,false);
   await role(db,user);assert.equal((await db.query("select * from storage.objects where bucket_id='b115-course-media'")).rows.length,0);assert.equal((await db.query('select public.b95_course_published($1) result',[code])).rows[0].result,null);await db.exec('reset role');
  }
  await db.exec("grant select on storage.objects to anon;create policy synthetic_b115_permissive on storage.objects for select to anon,authenticated using(bucket_id='b115-course-media')");await role(db,null);assert.equal((await db.query("select * from storage.objects where bucket_id='b115-course-media'")).rows.length,0);
  await role(db,uid(0));assert.equal((await db.query("select * from storage.objects where bucket_id='b115-course-media'")).rows.length,0);
 }finally{await db.close()}
});
