const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),{JSDOM}=require('jsdom');
const origin='https://paifjzznyiehwidoqjqb.supabase.co';
const tick=()=>new Promise(r=>setTimeout(r,40));
test('PA-101 exposes labelled support videos without replacing its ten lessons',async()=>{
 const w=new JSDOM(fs.readFileSync('b82/pa101/index.html','utf8'),{url:'https://plutonacademic.com/b82/pa101/',runScripts:'outside-only'}).window;
 w.HTMLMediaElement.prototype.pause=()=>{};
 const course=JSON.parse(fs.readFileSync('b82/pa101/course.json'));
 course.support_videos=[{title:{es:'Prevención de infecciones',en:'Infection prevention'},video:origin+'/storage/v1/object/public/lesson-videos-b80/NA-101/L03/original.mp4'},{title:{es:'Movilidad segura',en:'Safe mobility'},video:origin+'/storage/v1/object/public/lesson-videos-b80/NA-101/L07/original.mp4'}];
 const calls=[];w.PlutonPublishedContent={load:async()=>course};w.PlutonPrivateMedia={attach:(el,url,code)=>calls.push({el,url,code})};
 w.eval(fs.readFileSync('b82/pa101/aula.js','utf8'));await tick();
 assert.equal(w.document.querySelector('#lesson').options.length,10);
 const select=w.document.querySelector('[data-support-videos]');assert.ok(select,'support-video selector must be visible');
 assert.equal(select.options.length,2);assert.equal(calls.length,1);assert.equal(calls[0].code,'PA-101');
 select.value='1';select.dispatchEvent(new w.Event('change'));assert.equal(calls.at(-1).url,course.support_videos[1].video);
 assert.match(w.document.querySelector('#lessonContent').textContent,/apoyo/);w.close();
});
test('PA-101 signs its nursing support video but no other course can use that alias',async()=>{
 const w=new JSDOM('<video></video>',{url:'https://plutonacademic.com/b82/pa101/',runScripts:'outside-only'}).window;
 w.HTMLMediaElement.prototype.pause=()=>{};w.HTMLMediaElement.prototype.load=()=>{};
 w.supabase={createClient:()=>({auth:{getUser:async()=>({data:{user:{id:'buyer'}}}),onAuthStateChange(){}},storage:{from:bucket=>({createSignedUrl:async path=>({data:{signedUrl:origin+'/storage/v1/object/sign/'+bucket+'/'+path+'?token=test'}})})}})};
 w.eval(fs.readFileSync('b108/media.js','utf8'));const video=w.document.querySelector('video'),url=origin+'/storage/v1/object/public/lesson-videos-b80/NA-101/L03/original.mp4';
 assert.equal(await w.PlutonPrivateMedia.bind(video,url,'PA-101'),true);
 assert.equal(await w.PlutonPrivateMedia.bind(video,url,'COMP-101'),false);assert.equal(video.hasAttribute('src'),false);w.close();
});
