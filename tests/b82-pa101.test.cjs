const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const read=p=>JSON.parse(fs.readFileSync(p,'utf8')),c=read('b82/pa101/course.json');
test('PA-101 has ten distinct bilingual lessons and complete practice',()=>{
 assert.equal(c.lessons.length,10);assert.equal(new Set(c.lessons.map(l=>l.id)).size,10);assert.equal(c.notebooks.length,5);assert.equal(c.final_quiz.length,5);assert.equal(c.review_status,'professional_review_pending');
 for(const [i,l]of c.lessons.entries()){assert.equal(l.number,i+1);assert.equal(l.video,null);assert.equal(l.quiz.length,5);for(const lang of ['es','en']){assert.ok(l.explanation[lang].length>1100);assert.ok(l.example[lang].length>80);assert.ok(l.notes_prompt[lang]);assert.ok(l.exercise.prompt[lang]);}
 for(const q of l.quiz){assert.ok(q.answer>=0&&q.answer<3);for(const lang of ['es','en']){assert.equal(new Set(q.options[lang]).size,3);assert.ok(q.feedback[lang]);}}}
 const cat=read('catalog.json');assert.equal(cat.length,6);assert.equal(cat.reduce((n,c)=>n+c.lessons.length,0),58);assert.equal(cat.find(c=>c.code==='PA-101').classroom,'b82/pa101/index.html');assert.equal(read('b82/pa101/originales/catalogo-dos-lecciones.json').lessons.length,2);
});
test('PA-101 adapter saves its course only and verifies the account',async()=>{
 const s={window:{}};vm.runInNewContext(fs.readFileSync('b82/pa101/progress.js','utf8'),s);let rows=[];const cl={auth:{getUser:async()=>({data:{user:{id:'a'}}})},from:()=>({upsert:async row=>{rows.push(row);return {error:null}}})};
 assert.equal((await s.window.PlutonCourseProgress.save(cl,'PA-101',9,true,'a',10)).ok,true);assert.equal(rows[0].lesson_number,10);
 for(const args of [['NA-101',0,true,'a',10],['PA-101',10,true,'a',10],['PA-101',0,true,'b',10]])assert.equal((await s.window.PlutonCourseProgress.save(cl,...args)).ok,false);assert.equal(rows.length,1);
});
test('temporary auth failures preserve local ownership and pending progress',async()=>{
 const source=fs.readFileSync('b82/pa101/aula.js','utf8'),a=source.indexOf('async function sync(){'),b=source.indexOf("$('complete').onclick",a);
 const s={window:{},client:{auth:{getUser:async()=>({data:{user:null},error:{message:'network'}})}},generation:0,owner:'a',completed:[0],pending:[1],course:c,status(){},switchOwner(){s.owner='guest'},write(){},progress(){}};vm.runInNewContext(source.slice(a,b)+';window.runSync=sync',s);await s.window.runSync();assert.equal(s.owner,'a');assert.deepEqual(s.pending,[1]);assert.deepEqual(s.completed,[0]);
});
