/* Build deterministic PUBLIC seeds only. ID-001 is initialized from its protected DB row. */
const fs=require('node:fs');const specs={'PA-203':'b66/pa203/curso-completo-borrador.json','ID-101':'b67/id101/course.json','MKT-201':'b68/mkt201/course.json','PA-101':'b82/pa101/course.json'};
const reviewed=JSON.parse(fs.readFileSync('b84/reviewed-assessments.json')),videos=JSON.parse(fs.readFileSync('b64/videos.json'));
let sql=fs.readFileSync('database/b95_course_editor.template.sql','utf8');
for(const[code,file]of Object.entries(specs)){const payload=JSON.parse(fs.readFileSync(file));if(reviewed[code])payload.practice_review=reviewed[code];sql+=`\ninsert into public.course_public_content(course_code,payload) values('${code}', $b95seed$${JSON.stringify(payload)}$b95seed$::jsonb);\n`;}
// The effective B70 video map becomes an explicit editable field, preserving the shown video.
for(const code of ['NA-101','COMP-101']){sql+=`\nupdate public.course_learning_content c set payload=jsonb_set(c.payload,'{lessons}',(select jsonb_agg(jsonb_set(lesson,'{video}',coalesce(($b95video$${JSON.stringify(videos[code])}$b95video$::jsonb)->((ordinal-1)::text),'null'::jsonb)) order by ordinal) from jsonb_array_elements(c.payload->'lessons') with ordinality t(lesson,ordinal))) where c.course_code='${code}';\n`;}
sql+=`\ninsert into public.course_editor_state(course_code) select course_code from public.course_public_content union all select course_code from public.course_learning_content where course_code in ('NA-101','COMP-101') union all select course_code from public.course_premium_content where course_code='ID-001';
insert into public.course_content_versions(course_code,revision,payload) select course_code,1,payload from public.course_public_content union all select course_code,1,payload from public.course_learning_content where course_code in ('NA-101','COMP-101') union all select course_code,1,payload from public.course_premium_content where course_code='ID-001';
do $$begin
 if (select count(*) from public.course_editor_state)<>7 then raise exception 'B95 requires all seven source courses'; end if;
 perform pluton_course_private.refresh_preview((select payload from public.course_premium_content where course_code='ID-001'),1);
end;$$;
notify pgrst,'reload schema';
commit;\n`;
fs.writeFileSync('supabase/migrations/20261021_b95_course_editor.sql',sql);
