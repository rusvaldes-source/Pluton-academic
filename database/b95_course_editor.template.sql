-- B95. Review and apply transactionally. No payment/access/clinical changes.
begin;
create schema if not exists pluton_course_private;
revoke all on schema pluton_course_private from public, anon, authenticated;
create table public.course_public_content (
 course_code text primary key check(course_code in ('PA-203','ID-101','MKT-201','PA-101')),
 payload jsonb not null check(jsonb_typeof(payload)='object'),
 revision bigint not null default 1, updated_at timestamptz not null default now()
);
alter table public.course_public_content enable row level security;
revoke all on public.course_public_content from public,anon,authenticated;
grant select on public.course_public_content to anon,authenticated;
create policy b95_public_published on public.course_public_content for select to anon,authenticated using(true);
create table public.course_editor_state (
 course_code text primary key check(course_code in ('PA-203','ID-101','MKT-201','PA-101','NA-101','COMP-101','ID-001')),
 published_revision bigint not null default 1,
 draft_revision bigint not null default 1,
 draft_payload jsonb,
 updated_at timestamptz not null default now(), updated_by uuid
);
create table public.course_content_versions (
 course_code text not null references public.course_editor_state(course_code), revision bigint not null,
 payload jsonb not null, created_at timestamptz not null default now(), created_by uuid,
 primary key(course_code,revision)
);
alter table public.course_editor_state enable row level security;
alter table public.course_content_versions enable row level security;
revoke all on public.course_editor_state, public.course_content_versions from public, anon, authenticated;
-- Only the fixed six samples plus syllabus metadata may be public for ID-001.
create table public.course_preview_content (
 course_code text primary key check(course_code='ID-001'),
 payload jsonb not null, revision bigint not null
);
alter table public.course_preview_content enable row level security;
revoke all on public.course_preview_content from public,anon,authenticated;
grant select on public.course_preview_content to anon,authenticated;
create policy b95_preview_read on public.course_preview_content for select to anon,authenticated using(true);
create function pluton_course_private.require_admin() returns void language plpgsql security invoker set search_path='' as $$
begin
 if auth.uid() is null or not public.is_pluton_admin() then raise exception 'admin_required' using errcode='42501'; end if;
end;$$;
-- Compares the entire shape with the published version: arrays, IDs, metadata and
-- unexposed fields are immutable. Only explicit pedagogical leaves are editable.
create function pluton_course_private.validate_tree(a jsonb,b jsonb,p text default '') returns void
language plpgsql security invoker set search_path='' as $$
declare k text; i integer; editable boolean; typ text;
begin
 if a is not distinct from b then return; end if;
 editable := p ~ '^(title(\.(es|en))?|lessons\.[0-9]+\.(title|text|explanation|example|notes_prompt|video)(\.(es|en))?|lessons\.[0-9]+\.exercise\.(prompt|feedback)(\.(es|en))?|lessons\.[0-9]+\.exercise\.answers\.[0-9]+|lessons\.[0-9]+\.quiz\.[0-9]+\.(question|feedback)(\.(es|en))?|lessons\.[0-9]+\.quiz\.[0-9]+\.options\.(es|en)\.[0-9]+|lessons\.[0-9]+\.quiz\.[0-9]+\.answer|items\.[0-9]+\.(title|goal|practice)\.(es|en)|items\.[0-9]+\.sections\.[0-9]+\.(heading|body)\.(es|en)|items\.[0-9]+\.quiz\.[0-9]+\.(question|explanation)\.(es|en)|items\.[0-9]+\.quiz\.[0-9]+\.options\.(es|en)\.[0-9]+|items\.[0-9]+\.quiz\.[0-9]+\.answer|(practice_review|final_quiz)\.[0-9]+\.(question|feedback)\.(es|en)|(practice_review|final_quiz)\.[0-9]+\.options\.(es|en)\.[0-9]+|(practice_review|final_quiz)\.[0-9]+\.answer|assessments\.[0-9]+\.questions\.[0-9]+\.(enunciado|pregunta)|assessments\.[0-9]+\.questions\.[0-9]+\.opciones\.[0-9]+\.(texto|correcta_segun_editor))$';
 if p ~ '^lessons\.[0-9]+\.video$' then
  if jsonb_typeof(b) not in ('string','null') then raise exception 'invalid_video'; end if;
  if jsonb_typeof(b)='string' and b#>>'{}' !~ '^https://paifjzznyiehwidoqjqb\.supabase\.co/storage/v1/object/public/[A-Za-z0-9_/%+.?=&-]+$' then raise exception 'invalid_video'; end if;
  return;
 end if;
 if jsonb_typeof(a) is distinct from jsonb_typeof(b) then raise exception 'invalid_type: %',p; end if;
 typ:=jsonb_typeof(b);
 if typ='object' then
  if (select array_agg(key order by key) from jsonb_object_keys(a) key) is distinct from (select array_agg(key order by key) from jsonb_object_keys(b) key) then raise exception 'immutable_shape: %',p; end if;
  if b ? 'answer' and b ? 'options' then
   if jsonb_typeof(b->'answer')<>'number' or (b->>'answer') !~ '^[0-9]+$' then raise exception 'invalid_answer'; end if;
   if (b->>'answer')::int >= jsonb_array_length(b->'options'->'es') or jsonb_array_length(b->'options'->'es')<>jsonb_array_length(b->'options'->'en') then raise exception 'invalid_answer'; end if;
  end if;
  if b ? 'opciones' and jsonb_array_length(b->'opciones')>0 and (select count(*) from jsonb_array_elements(b->'opciones') o where o->'correcta_segun_editor'='true'::jsonb)<>1 then raise exception 'invalid_answer'; end if;
  for k in select jsonb_object_keys(a) loop perform pluton_course_private.validate_tree(a->k,b->k,case when p='' then k else p||'.'||k end); end loop;
 elsif typ='array' then
  if jsonb_array_length(a)<>jsonb_array_length(b) then raise exception 'immutable_length: %',p; end if;
  for i in 0..jsonb_array_length(a)-1 loop perform pluton_course_private.validate_tree(a->i,b->i,p||'.'||i); end loop;
 else
  if not editable then raise exception 'immutable_field: %',p; end if;
  if typ='string' and (length(b#>>'{}')>100000 or length(b#>>'{}')=0) then raise exception 'invalid_text: %',p; end if;
 end if;
end;$$;
create function pluton_course_private.snapshot(p_code text) returns jsonb language sql stable security invoker set search_path='' as $$
 select payload from public.course_content_versions v join public.course_editor_state s using(course_code) where v.course_code=p_code and v.revision=s.published_revision
$$;
create function pluton_course_private.editor_response(p_code text) returns jsonb language sql stable security invoker set search_path='' as $$
 select jsonb_build_object('course_code',course_code,'published_revision',published_revision,'draft_revision',draft_revision,'has_draft',draft_payload is not null,'payload',coalesce(draft_payload,pluton_course_private.snapshot(p_code))) from public.course_editor_state where course_code=p_code
$$;
create function pluton_course_private.refresh_preview(p_payload jsonb,p_revision bigint) returns void language plpgsql security invoker set search_path='' as $$
declare samples jsonb; syllabus jsonb;
begin
 select jsonb_agg(item order by ordinal) into samples from jsonb_array_elements(p_payload->'items') with ordinality t(item,ordinal) where item->>'id' in ('ID001-01-01','ID001-01-02','ID001-01-03','ID001-08-01','ID001-08-02','ID001-08-03');
 if jsonb_array_length(samples) <> 6 or samples is null then raise exception 'invalid_sample_projection'; end if;
 select jsonb_agg(jsonb_build_object('id',item->'id','title',item->'title','category',item->'category','goal',item->'goal') order by ordinal) into syllabus from jsonb_array_elements(p_payload->'items') with ordinality t(item,ordinal);
 insert into public.course_preview_content(course_code,payload,revision) values('ID-001',jsonb_build_object('samples',samples,'syllabus',syllabus),p_revision) on conflict(course_code) do update set payload=excluded.payload,revision=excluded.revision;
end;$$;
create function public.b95_editor_get(p_course_code text) returns jsonb language plpgsql security definer set search_path='' as $$
begin perform pluton_course_private.require_admin(); return pluton_course_private.editor_response(p_course_code); end;$$;
create function public.b95_editor_history(p_course_code text) returns jsonb language plpgsql security definer set search_path='' as $$
begin perform pluton_course_private.require_admin(); return (select coalesce(jsonb_agg(to_jsonb(t) order by revision desc),'[]'::jsonb) from(select revision,created_at from public.course_content_versions where course_code=p_course_code order by revision desc limit 100)t); end;$$;
create function public.b95_editor_save(p_course_code text,p_payload jsonb,p_expected_draft bigint,p_expected_published bigint) returns jsonb language plpgsql security definer set search_path='' as $$
declare s public.course_editor_state;
begin
 perform pluton_course_private.require_admin();
 select * into s from public.course_editor_state where course_code=p_course_code for update;
 if not found then raise exception 'unknown_course'; end if;
 if s.draft_revision is distinct from p_expected_draft or s.published_revision is distinct from p_expected_published then raise exception 'version_conflict' using errcode='40001'; end if;
 if p_payload is null or jsonb_typeof(p_payload)<>'object' or octet_length(p_payload::text)>2000000 then raise exception 'invalid_payload'; end if;
 perform pluton_course_private.validate_tree(pluton_course_private.snapshot(p_course_code),p_payload);
 update public.course_editor_state set draft_payload=p_payload,draft_revision=draft_revision+1,updated_at=now(),updated_by=auth.uid() where course_code=p_course_code;
 return pluton_course_private.editor_response(p_course_code);
end;$$;
create function public.b95_editor_restore(p_course_code text,p_revision bigint,p_expected_draft bigint,p_expected_published bigint) returns jsonb language plpgsql security definer set search_path='' as $$
declare p jsonb;
begin
 perform pluton_course_private.require_admin();
 select payload into p from public.course_content_versions where course_code=p_course_code and revision=p_revision;
 if p is null then raise exception 'unknown_version'; end if;
 return public.b95_editor_save(p_course_code,p,p_expected_draft,p_expected_published);
end;$$;
create function public.b95_editor_publish(p_course_code text,p_expected_draft bigint,p_expected_published bigint) returns jsonb language plpgsql security definer set search_path='' as $$
declare s public.course_editor_state; next_revision bigint; actual jsonb;
begin
 perform pluton_course_private.require_admin();
 select * into s from public.course_editor_state where course_code=p_course_code for update;
 if not found then raise exception 'unknown_course'; end if;
 if s.draft_revision is distinct from p_expected_draft or s.published_revision is distinct from p_expected_published then raise exception 'version_conflict' using errcode='40001'; end if;
 if s.draft_payload is null then raise exception 'draft_required'; end if;
 perform pluton_course_private.validate_tree(pluton_course_private.snapshot(p_course_code),s.draft_payload);
 -- Detect external changes made outside the editor as well as simultaneous editors.
 if p_course_code='ID-001' then select payload into actual from public.course_premium_content where course_code=p_course_code for update;
 elsif p_course_code in ('NA-101','COMP-101') then select payload into actual from public.course_learning_content where course_code=p_course_code for update;
 else select payload into actual from public.course_public_content where course_code=p_course_code for update; end if;
 if actual is distinct from pluton_course_private.snapshot(p_course_code) then raise exception 'version_conflict' using errcode='40001'; end if;
 next_revision:=s.published_revision+1;
 if p_course_code='ID-001' then
  update public.course_premium_content set payload=s.draft_payload,updated_at=now() where course_code=p_course_code;
  perform pluton_course_private.refresh_preview(s.draft_payload,next_revision);
 elsif p_course_code in ('NA-101','COMP-101') then update public.course_learning_content set payload=s.draft_payload,updated_at=now() where course_code=p_course_code;
 else update public.course_public_content set payload=s.draft_payload,revision=next_revision,updated_at=now() where course_code=p_course_code; end if;
 insert into public.course_content_versions(course_code,revision,payload,created_by) values(p_course_code,next_revision,s.draft_payload,auth.uid());
 update public.course_editor_state set published_revision=next_revision,draft_payload=null,draft_revision=draft_revision+1,updated_at=now(),updated_by=auth.uid() where course_code=p_course_code;
 return pluton_course_private.editor_response(p_course_code);
end;$$;
-- Public read RPC runs as INVOKER. Existing source RLS remains authoritative,
-- especially ID-001 purchase access. No access to history or private drafts.
create function public.b95_course_published(p_course_code text) returns jsonb language plpgsql security invoker set search_path='' as $$
declare p jsonb; stamp text;
begin
 if p_course_code='ID-001' then select payload,updated_at::text into p,stamp from public.course_premium_content where course_code=p_course_code;
 elsif p_course_code in ('NA-101','COMP-101') then select payload,updated_at::text into p,stamp from public.course_learning_content where course_code=p_course_code and published;
 else select payload,revision::text into p,stamp from public.course_public_content where course_code=p_course_code; end if;
 if p is null then return null; end if;
 return jsonb_build_object('payload',p,'revision',stamp);
end;$$;
revoke all on all functions in schema pluton_course_private from public,anon,authenticated;
revoke all on function public.b95_editor_get(text),public.b95_editor_history(text),public.b95_editor_save(text,jsonb,bigint,bigint),public.b95_editor_restore(text,bigint,bigint,bigint),public.b95_editor_publish(text,bigint,bigint),public.b95_course_published(text) from public,anon,authenticated;
grant execute on function public.b95_editor_get(text),public.b95_editor_history(text),public.b95_editor_save(text,jsonb,bigint,bigint),public.b95_editor_restore(text,bigint,bigint,bigint),public.b95_editor_publish(text,bigint,bigint) to authenticated;
grant execute on function public.b95_course_published(text) to anon,authenticated;
-- PUBLIC SEEDS INSERTED BELOW; premium payload stays inside the database.
