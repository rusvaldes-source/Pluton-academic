const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),{PGlite}=require('@electric-sql/pglite');
test('repair links original nursing videos, preserves curriculum, and permits only a PA-101 or NA-101 buyer',async()=>{
 const db=new PGlite();try{
 await db.exec(`create role anon;create role authenticated;create role service_role bypassrls;create schema auth;create schema storage;create schema b107_private;
 create function auth.uid() returns uuid language sql stable as $$select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid$$;
 create function public.is_pluton_admin() returns boolean language sql stable as $$select false$$;
 grant usage on schema auth,public to authenticated;grant execute on function auth.uid() to authenticated;
 create table public.course_purchase_access(user_id uuid,course_code text,active boolean default true);
 create table public.course_public_content(course_code text primary key,payload jsonb,revision bigint,updated_at timestamptz default now());
 create table public.course_learning_content(course_code text,payload jsonb,published boolean);
 create table public.course_content_versions(course_code text,revision bigint,payload jsonb,created_at timestamptz default now(),created_by uuid);
 create table public.course_editor_state(course_code text,published_revision bigint,draft_revision bigint,draft_payload jsonb,updated_at timestamptz default now());
 create table public.b108_media_assets(bucket_id text,object_name text,course_code text);alter table public.b108_media_assets enable row level security;
 create policy b108_media_inventory_owner on public.b108_media_assets for select to authenticated using(exists(select 1 from public.course_purchase_access a where a.user_id=auth.uid() and a.course_code=b108_media_assets.course_code and a.active));
 create table storage.objects(id int,bucket_id text,name text);
 grant select on public.course_public_content,public.course_purchase_access,public.b108_media_assets to authenticated;
 insert into public.course_public_content values('PA-101',jsonb_build_object('code','PA-101','lessons',(select jsonb_agg(jsonb_build_object('title','original-'||n,'video',null)) from generate_series(1,10) n)),1,now());
 insert into public.course_editor_state select course_code,1,1,payload,now() from public.course_public_content;
 insert into public.course_learning_content values('NA-101',jsonb_build_object('lessons',(select jsonb_agg(jsonb_build_object('title',jsonb_build_object('es','Original '||n,'en','Original '||n),'video','https://paifjzznyiehwidoqjqb.supabase.co/storage/v1/object/public/lesson-videos-b80/NA-101/L'||n||'/original.mp4') order by n) from generate_series(1,12) n)),true);
 insert into storage.objects select n,'lesson-videos-b80','NA-101/L'||n||'/original.mp4' from generate_series(1,12) n;
 insert into public.b108_media_assets select bucket_id,name,'NA-101' from storage.objects;
 insert into public.b108_media_assets values('id101-videos','other.mp4','ID-101');
 insert into public.course_purchase_access values('11111111-1111-4111-8111-111111111111','PA-101',true);`);
 if(fs.existsSync('database/b110_nursing_media_repair.sql'))await db.exec(fs.readFileSync('database/b110_nursing_media_repair.sql','utf8'));
 const c=(await db.query("select payload,revision from public.course_public_content where course_code='PA-101'")).rows[0];
 assert.equal(c.payload.support_videos?.length,12,'the twelve existing originals must be linked');assert.equal(c.payload.lessons.length,10);assert.equal(c.payload.lessons[0].title,'original-1');
 await db.exec("set role authenticated;select set_config('request.jwt.claim.sub','11111111-1111-4111-8111-111111111111',false)");
 assert.equal((await db.query('select * from public.b108_media_assets')).rows.length,12);
 await db.exec("reset role;update public.course_purchase_access set active=false;set role authenticated");assert.equal((await db.query('select * from public.b108_media_assets')).rows.length,0);
 await db.exec("reset role;update public.course_purchase_access set active=true,course_code='ID-101';set role authenticated");const rows=(await db.query('select * from public.b108_media_assets')).rows;assert.equal(rows.length,1);assert.equal(rows[0].course_code,'ID-101');
 }finally{await db.close()}
});
