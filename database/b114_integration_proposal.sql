-- B114 PROPOSAL ONLY. DO NOT APPLY WITHOUT PUBLICATION AUTHORIZATION.
-- Reviewed against deployed schema on 2026-10-26. No current policies are changed.
-- This does not create Stripe products/prices or publish any course content.
begin;
alter table public.course_learning_content drop constraint course_learning_content_course_code_check;
alter table public.course_learning_content add constraint course_learning_content_course_code_check
 check(course_code in ('NA-101','COMP-101','FA-101','DRV-101','MED-201'));
alter table public.course_editor_state drop constraint course_editor_state_course_code_check;
alter table public.course_editor_state add constraint course_editor_state_course_code_check
 check(course_code in ('PA-203','ID-101','MKT-201','PA-101','NA-101','COMP-101','ID-001','FA-101','DRV-101','MED-201'));
alter table public.course_certificates drop constraint course_certificates_course_code_check;
alter table public.course_certificates add constraint course_certificates_course_code_check
 check(course_code in ('PA-203','ID-101','MKT-201','PA-101','COMP-101','ID-001','FA-101','DRV-101','MED-201'));

-- Existing reviewed-participation procedures: only the course allowlist changes.
CREATE OR REPLACE FUNCTION pluton_rpc_private.b96_certificate_courses()
 RETURNS TABLE(course_code text, revision bigint, title jsonb)
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
begin
 if auth.uid() is null or not public.is_pluton_admin() then raise exception 'admin_required' using errcode='42501'; end if;
 return query select s.course_code,v.revision,
 case when jsonb_typeof(v.payload->'title')='object' then v.payload->'title'
 else jsonb_build_object('es',coalesce(nullif(v.payload->>'title',''),s.course_code||' — Herramientas Digitales e IA'),
 'en',coalesce(nullif(v.payload->>'title',''),s.course_code||' — Digital Tools and AI')) end
 from public.course_editor_state s join public.course_content_versions v
 on v.course_code=s.course_code and v.revision=s.published_revision
 where s.course_code in ('PA-203','ID-101','MKT-201','PA-101','COMP-101','ID-001','FA-101','DRV-101','MED-201') order by s.course_code;
end;
$function$
;

CREATE OR REPLACE FUNCTION pluton_rpc_private.b96_issue_certificate(p_request_id uuid, p_user_id uuid, p_recipient_name text, p_course_code text, p_expected_revision bigint, p_participation_date date, p_evidence text, p_locale text DEFAULT 'es'::text, p_attested boolean DEFAULT false)
 RETURNS course_certificates
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
declare v_actor uuid:=auth.uid(); v_title jsonb; v_record public.course_certificates; v_scope jsonb;
begin
 if v_actor is null or not public.is_pluton_admin() then raise exception 'admin_required' using errcode='42501'; end if;
 if p_request_id is null or p_user_id is null or p_recipient_name is null or char_length(btrim(p_recipient_name)) not between 2 and 160
 or p_course_code is null or p_course_code not in ('PA-203','ID-101','MKT-201','PA-101','COMP-101','ID-001','FA-101','DRV-101','MED-201')
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
$function$
;

-- A separate private bucket avoids changing protections on any original media.
insert into storage.buckets(id,name,public) values('b114-course-media','b114-course-media',false) on conflict(id) do nothing;
do $$begin
 if exists(select 1 from storage.buckets where id='b114-course-media' and public) then raise exception 'B114 bucket must remain private'; end if;
end$$;
create policy b114_private_media_read on storage.objects for select to authenticated
using (
 bucket_id='b114-course-media'
 and (select auth.uid()) is not null
 and split_part(name,'/',1) in ('FA-101','DRV-101','MED-201')
 and split_part(name,'/',2) ~ ('^'||split_part(name,'/',1)||'-L[0-9]{2}-(es|en)\.(mp3|mp4)$')
 and array_length(string_to_array(name,'/'),1)=2
 and ((select public.is_pluton_admin()) or exists(
  select 1 from public.course_purchase_access a
  where a.user_id=(select auth.uid()) and a.course_code=split_part(objects.name,'/',1) and a.active
 ))
);
-- No anon SELECT and no browser INSERT/UPDATE/DELETE policies are created.
-- Private payload seed is supplied separately in the owner's private package.
-- All three courses remain unpublished until an approved release.
notify pgrst,'reload schema';
commit;

