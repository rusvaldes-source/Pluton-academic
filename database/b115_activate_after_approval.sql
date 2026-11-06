-- RUN ONLY AFTER explicit publication authorization, private draft import and all 120 uploads.
begin;
lock table public.course_learning_content in share row exclusive mode;
do $b115$
declare c text;
begin
 if (select count(*) from public.course_learning_content where course_code in
 ('FAM-101','FAM-102','PSI-101','PSI-102') and not published)<>4 then
  raise exception 'b115_requires_four_private_drafts';end if;
 if exists(select 1 from public.course_editor_state where course_code in
 ('FAM-101','FAM-102','PSI-101','PSI-102')) then raise exception 'b115_existing_registration';end if;
 for c in select unnest(array['FAM-101','FAM-102','PSI-101','PSI-102']) loop
  if (select jsonb_array_length(payload->'lessons') from public.course_learning_content where course_code=c)<>15
   or exists(select 1 from public.course_learning_content where course_code=c and
    ((payload->>'price')::numeric<>9.99 or payload->>'payment_type'<>'one_time'))
  then raise exception 'b115_invalid_content_or_price: %',c;end if;
  if (select count(*) from storage.objects where bucket_id='b115-course-media'
    and name ~ ('^'||c||'/'||c||'-L(0[1-9]|1[0-5])-(es|en)\.mp3$'))<>30
  then raise exception 'b115_requires_30_audio_objects: %',c;end if;
 end loop;
end;$b115$;
update public.course_learning_content set published=true,updated_at=now()
 where course_code in ('FAM-101','FAM-102','PSI-101','PSI-102');
insert into public.course_editor_state(course_code,published_revision,draft_revision)
 select course_code,1,1 from public.course_learning_content where course_code in ('FAM-101','FAM-102','PSI-101','PSI-102');
insert into public.course_content_versions(course_code,revision,payload)
 select course_code,1,payload from public.course_learning_content where course_code in ('FAM-101','FAM-102','PSI-101','PSI-102');
commit;
