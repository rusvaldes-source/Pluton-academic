const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs');
test('ID101 has 12 bilingual lessons with five explained quiz questions each',()=>{
 assert.ok(fs.existsSync('b67/id101/course.json'),'ID101 structured course must exist');
 const c=JSON.parse(fs.readFileSync('b67/id101/course.json'));
 assert.equal(c.code,'ID-101');assert.equal(c.lessons.length,12);assert.equal(c.notebooks.length,6);
 for(const l of c.lessons){for(const lang of ['es','en']){assert.ok(l.title[lang]);assert.ok(l.explanation[lang].length>200);assert.ok(l.example[lang]);assert.ok(l.exercise.prompt[lang]);}assert.equal(l.quiz.length,5);for(const q of l.quiz){assert.equal(q.options.es.length,q.options.en.length);assert.ok(q.answer>=0&&q.answer<q.options.es.length);assert.ok(q.feedback.es.length>20&&q.feedback.en.length>20);}}
});
test('main course catalog routes ID101 to all recovered lessons',()=>{
 const c=JSON.parse(fs.readFileSync('catalog.json')).find(c=>c.code==='ID-101');
 assert.equal(c.lessons.length,12);assert.equal(c.classroom,'b67/id101/index.html');
});
