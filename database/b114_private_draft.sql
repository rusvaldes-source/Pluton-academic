-- Private payload placeholders must be supplied from the protected delivery.
-- Do not insert course_editor_state: the live checkout treats those rows as purchasable.
begin;
lock table public.course_editor_state in share mode;
lock table public.course_learning_content in access exclusive mode;
do $guard$
declare current_check text;
begin
 if exists(select 1 from public.course_editor_state where course_code in('FA-101','DRV-101','MED-201')) or exists(select 1 from public.course_learning_content where course_code in('FA-101','DRV-101','MED-201')) then
  raise exception 'b114_existing_draft_or_editor_state';
 end if;
 select pg_get_constraintdef(oid) into current_check from pg_constraint where conrelid='public.course_learning_content'::regclass and conname='course_learning_content_course_code_check';
 if current_check is distinct from 'CHECK ((course_code = ANY (ARRAY[''NA-101''::text, ''COMP-101''::text])))' then
  raise exception 'b114_schema_drift_review_required';
 end if;
end;
$guard$;
alter table public.course_learning_content drop constraint course_learning_content_course_code_check;
alter table public.course_learning_content add constraint course_learning_content_course_code_check check(course_code in('NA-101','COMP-101','FA-101','DRV-101','MED-201'));
insert into public.course_learning_content(course_code,payload,published) values
 ('FA-101',/* B114_PAYLOAD_FA_101 */,false),
 ('DRV-101',/* B114_PAYLOAD_DRV_101 */,false),
 ('MED-201',/* B114_PAYLOAD_MED_201 */,false);
commit;
