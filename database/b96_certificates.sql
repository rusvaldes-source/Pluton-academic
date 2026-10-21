-- B96. Apply after B95 course editor schema and seeds; reviewed deployment only.
-- Participation records only. No official grades or completion certificates.
begin;
create table public.course_certificates (
 id uuid primary key default gen_random_uuid(),
 request_id uuid not null unique,
 verification_code text not null unique check (verification_code ~ '^PA-[A-F0-9]{32}$'),
 user_id uuid not null references auth.users(id) on delete restrict,
 recipient_name text not null check (char_length(recipient_name) between 2 and 160),
 document_type text not null default 'participation' check(document_type='participation'),
 course_code text not null check(course_code in ('PA-203','ID-101','MKT-201','PA-101','COMP-101','ID-001')),
 course_revision bigint not null,
 course_title jsonb not null,
 locale text not null check(locale in ('es','en')),
 scope jsonb not null,
 participation_date date not null,
 evidence text not null check(char_length(evidence) between 20 and 4000),
 issued_at timestamptz not null default now(),
 issued_by uuid not null references auth.users(id) on delete restrict,
 status text not null default 'issued' check(status in ('issued','revoked')),
 revoked_at timestamptz,
 revoked_by uuid references auth.users(id) on delete restrict,
 revocation_reason text,
 template_version text not null default 'B96-1',
 foreign key(course_code,course_revision) references public.course_content_versions(course_code,revision) on delete restrict,
 check ((status='issued' and revoked_at is null and revoked_by is null and revocation_reason is null)
   or (status='revoked' and revoked_at is not null and revoked_by is not null and char_length(revocation_reason) between 10 and 1000))
);
create index b96_certificates_recent on public.course_certificates(issued_at desc,id desc);
create table public.certificate_events (
 id uuid primary key default gen_random_uuid(),
 certificate_id uuid not null references public.course_certificates(id) on delete restrict,
 event_type text not null check(event_type in ('issued','revoked')),
 actor_id uuid not null references auth.users(id) on delete restrict,
 occurred_at timestamptz not null default now(),
 reason text not null,
 unique(certificate_id,event_type)
);
alter table public.course_certificates enable row level security;
alter table public.certificate_events enable row level security;
revoke all on public.course_certificates from public,anon,authenticated,service_role;
revoke all on public.certificate_events from public,anon,authenticated,service_role;
-- The narrowly scoped RPCs below are the only application interface.

create or replace function public.b96_guard_certificate_history() returns trigger
language plpgsql set search_path = '' as $function$
begin
 if TG_TABLE_NAME='certificate_events' or TG_OP='DELETE' then
  raise exception 'immutable_history' using errcode='42501';
 end if;
 if old.status<>'issued' or new.status<>'revoked' or new.revoked_by is distinct from auth.uid()
    or auth.uid() is null or not public.is_pluton_admin()
    or (to_jsonb(new)-array['status','revoked_at','revoked_by','revocation_reason'])
       is distinct from (to_jsonb(old)-array['status','revoked_at','revoked_by','revocation_reason']) then
  raise exception 'immutable_document' using errcode='42501';
 end if;
 return new;
end;
$function$;
revoke all on function public.b96_guard_certificate_history() from public,anon,authenticated,service_role;
create trigger b96_immutable_document before update or delete on public.course_certificates
 for each row execute function public.b96_guard_certificate_history();
create trigger b96_immutable_events before update or delete on public.certificate_events
 for each row execute function public.b96_guard_certificate_history();

create or replace function public.b96_resolve_recipient(p_email text)
returns table(user_id uuid,email text)
language plpgsql security definer set search_path = '' as $function$
begin
 if auth.uid() is null or not public.is_pluton_admin() then raise exception 'admin_required' using errcode='42501'; end if;
 if p_email is null or char_length(p_email)>254 or position('@' in p_email)<2 then raise exception 'invalid_email'; end if;
 return query select u.id,u.email::text from auth.users u
 where pg_catalog.lower(u.email)=pg_catalog.lower(pg_catalog.btrim(p_email))
 and u.email_confirmed_at is not null and u.deleted_at is null
 and (u.banned_until is null or u.banned_until<=now()) limit 2;
end;
$function$;

create or replace function public.b96_certificate_courses()
returns table(course_code text,revision bigint,title jsonb)
language plpgsql security definer set search_path = '' as $function$
begin
 if auth.uid() is null or not public.is_pluton_admin() then raise exception 'admin_required' using errcode='42501'; end if;
 return query select s.course_code,v.revision,
 case when jsonb_typeof(v.payload->'title')='object' then v.payload->'title'
 else jsonb_build_object('es',coalesce(nullif(v.payload->>'title',''),s.course_code||' — Herramientas Digitales e IA'),
 'en',coalesce(nullif(v.payload->>'title',''),s.course_code||' — Digital Tools and AI')) end
 from public.course_editor_state s join public.course_content_versions v
 on v.course_code=s.course_code and v.revision=s.published_revision
 where s.course_code in ('PA-203','ID-101','MKT-201','PA-101','COMP-101','ID-001') order by s.course_code;
end;
$function$;

create or replace function public.b96_list_certificates(p_limit integer default 30,p_before timestamptz default null)
returns setof public.course_certificates
language plpgsql security definer set search_path = '' as $function$
begin
 if auth.uid() is null or not public.is_pluton_admin() then raise exception 'admin_required' using errcode='42501'; end if;
 if p_limit is null or p_limit<1 or p_limit>100 then raise exception 'invalid_limit'; end if;
 return query select c.* from public.course_certificates c where p_before is null or c.issued_at<p_before order by c.issued_at desc,c.id desc limit p_limit;
end;
$function$;

create or replace function public.b96_get_certificate(p_certificate_id uuid)
returns public.course_certificates
language plpgsql security definer set search_path = '' as $function$
declare v_record public.course_certificates;
begin
 if auth.uid() is null or not public.is_pluton_admin() then raise exception 'admin_required' using errcode='42501'; end if;
 select c.* into v_record from public.course_certificates c where c.id=p_certificate_id;
 if not found then raise exception 'not_found'; end if;
 return v_record;
end;
$function$;

create or replace function public.b96_issue_certificate(
 p_request_id uuid,p_user_id uuid,p_recipient_name text,p_course_code text,p_expected_revision bigint,
 p_participation_date date,p_evidence text,p_locale text default 'es',p_attested boolean default false)
returns public.course_certificates
language plpgsql security definer set search_path = '' as $function$
declare v_actor uuid:=auth.uid(); v_title jsonb; v_record public.course_certificates; v_scope jsonb;
begin
 if v_actor is null or not public.is_pluton_admin() then raise exception 'admin_required' using errcode='42501'; end if;
 if p_request_id is null or p_user_id is null or p_recipient_name is null or char_length(btrim(p_recipient_name)) not between 2 and 160
 or p_course_code is null or p_course_code not in ('PA-203','ID-101','MKT-201','PA-101','COMP-101','ID-001')
 or p_expected_revision is null or p_participation_date is null or p_participation_date>current_date
 or p_evidence is null or char_length(btrim(p_evidence)) not between 20 and 4000 or p_locale is null or p_locale not in ('es','en')
 or p_attested is distinct from true then raise exception 'invalid_participation_record'; end if;
 -- Same request is safe to retry after loss of its network response.
 perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtextextended(v_actor::text||p_request_id::text,0));
 select c.* into v_record from public.course_certificates c where c.request_id=p_request_id;
 if found then
  if v_record.issued_by<>v_actor or v_record.user_id<>p_user_id or v_record.recipient_name<>btrim(p_recipient_name)
   or v_record.course_code<>p_course_code or v_record.course_revision<>p_expected_revision
   or v_record.participation_date<>p_participation_date or v_record.evidence<>btrim(p_evidence) or v_record.locale<>p_locale then
   raise exception 'request_conflict';
  end if;
  return v_record;
 end if;
 if not exists(select 1 from auth.users u where u.id=p_user_id and u.email_confirmed_at is not null
 and u.deleted_at is null and (u.banned_until is null or u.banned_until<=now())) then raise exception 'recipient_not_found'; end if;
 -- Lock the current publication so concurrent publication cannot invalidate the reviewed version.
 perform 1 from public.course_editor_state s where s.course_code=p_course_code and s.published_revision=p_expected_revision for share;
 if not found then raise exception 'course_version_conflict'; end if;
 select c.title into v_title from public.b96_certificate_courses() c where c.course_code=p_course_code and c.revision=p_expected_revision;
 if not found then raise exception 'course_not_available'; end if;
 v_scope:=jsonb_build_object('es','Constancia de participación revisada manualmente. No acredita aprobación de examen oficial, licencia ni acreditación profesional.',
 'en','Manually reviewed participation record. It does not certify passing an official exam, a license or professional accreditation.');
 if p_course_code='PA-101' then
  v_scope:=jsonb_build_object('es','Participación en formación teórica introductoria. Revisión profesional pendiente. No acredita un programa CNA aprobado, licencia ni competencia clínica práctica.',
  'en','Participation in introductory theoretical learning. Professional review pending. Not an approved CNA program, license or demonstration of practical clinical competence.');
 end if;
 insert into public.course_certificates(request_id,verification_code,user_id,recipient_name,course_code,course_revision,course_title,locale,scope,participation_date,evidence,issued_by)
 values(p_request_id,'PA-'||upper(replace(gen_random_uuid()::text,'-','')),p_user_id,btrim(p_recipient_name),p_course_code,p_expected_revision,v_title,p_locale,v_scope,p_participation_date,btrim(p_evidence),v_actor)
 returning * into v_record;
 insert into public.certificate_events(certificate_id,event_type,actor_id,reason)
 values(v_record.id,'issued',v_actor,'Manual participation review: '||btrim(p_evidence));
 return v_record;
end;
$function$;

create or replace function public.b96_revoke_certificate(p_certificate_id uuid,p_reason text)
returns public.course_certificates
language plpgsql security definer set search_path = '' as $function$
declare v_record public.course_certificates;
begin
 if auth.uid() is null or not public.is_pluton_admin() then raise exception 'admin_required' using errcode='42501'; end if;
 if p_reason is null or char_length(btrim(p_reason)) not between 10 and 1000 then raise exception 'reason_required'; end if;
 select c.* into v_record from public.course_certificates c where c.id=p_certificate_id for update;
 if not found then raise exception 'not_found'; end if;
 if v_record.status='revoked' then return v_record; end if;
 update public.course_certificates set status='revoked',revoked_at=now(),revoked_by=auth.uid(),revocation_reason=btrim(p_reason)
 where id=p_certificate_id returning * into v_record;
 insert into public.certificate_events(certificate_id,event_type,actor_id,reason) values(v_record.id,'revoked',auth.uid(),btrim(p_reason));
 return v_record;
end;
$function$;

create or replace function public.b96_verify_certificate(p_code text)
returns table(verification_code text,document_type text,course_code text,course_title jsonb,course_revision bigint,participation_date date,issued_at timestamptz,status text,scope jsonb)
language sql stable security definer set search_path = '' as $function$
 select c.verification_code,c.document_type,c.course_code,c.course_title,c.course_revision,c.participation_date,c.issued_at,c.status,c.scope
 from public.course_certificates c
 where p_code ~* '^PA-[A-F0-9]{32}$' and c.verification_code = pg_catalog.upper(p_code) limit 1;
$function$;

revoke all on function public.b96_resolve_recipient(text),public.b96_certificate_courses(),public.b96_list_certificates(integer,timestamptz),public.b96_get_certificate(uuid),
 public.b96_issue_certificate(uuid,uuid,text,text,bigint,date,text,text,boolean),public.b96_revoke_certificate(uuid,text),public.b96_verify_certificate(text) from public,anon,authenticated;
grant execute on function public.b96_resolve_recipient(text),public.b96_certificate_courses(),public.b96_list_certificates(integer,timestamptz),public.b96_get_certificate(uuid),
 public.b96_issue_certificate(uuid,uuid,text,text,bigint,date,text,text,boolean),public.b96_revoke_certificate(uuid,text) to authenticated;
grant execute on function public.b96_verify_certificate(text) to anon,authenticated;
comment on table public.course_certificates is 'B96: manually reviewed participation only; NA-101 blocked; no official completion or clinical credentials.';
commit;
