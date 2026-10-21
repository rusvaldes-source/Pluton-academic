const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
test('authenticated classroom package has full bilingual lessons and no video resources',{skip:!process.env.B70_CONTENT_DIR&&'Private package is supplied via B70_CONTENT_DIR'},()=>{
 const root=process.env.B70_CONTENT_DIR;assert.ok(root,'Set B70_CONTENT_DIR to the recovered course package');
 for(const [code,count,books] of [['NA-101',12,6],['COMP-101',8,4]]){
  const c=JSON.parse(fs.readFileSync(path.join(root,code,'course.json')));assert.equal(c.lessons.length,count);assert.equal(c.notebooks.length,books);assert.equal(c.video_policy,'scripts_only');
  const ids=new Set();for(const l of c.lessons){assert.equal(l.video,null);assert.ok(!ids.has(l.id));ids.add(l.id);assert.equal(l.quiz.length,5);
   for(const lang of ['es','en']){for(const prop of ['title','explanation','example','notes_prompt'])assert.ok(l[prop][lang].length>8);assert.ok(l.explanation[lang].length>650);assert.ok(l.exercise.prompt[lang]);assert.ok(l.exercise.feedback[lang]);
    for(const q of l.quiz){assert.equal(q.options[lang].length,3);assert.ok(Number.isInteger(q.answer)&&q.answer>=0&&q.answer<3);assert.ok(q.question[lang]);assert.ok(q.feedback[lang]);assert.equal(new Set(q.options[lang]).size,3);}
   }
  }
  assert.equal(c.modules.flatMap(m=>m.lessons).length,count);for(const n of c.notebooks)assert.ok(n.text.includes('ENGLISH'));
 }
});
test('no new protected content is stored as public course.json',()=>{
 for(const name of ['na101','comp101'])assert.equal(fs.existsSync('b70/'+name+'/course.json'),false);
 assert.ok(fs.readFileSync('b70/load.js','utf8').includes('PlutonPublishedContent.load(code,client)'));
 assert.ok(fs.readFileSync('b95/course-loader.js','utf8').includes('b95_course_published'));
 assert.ok(fs.readFileSync('supabase/migrations/20261021_b95_course_editor.sql','utf8').includes('security invoker'));
});
