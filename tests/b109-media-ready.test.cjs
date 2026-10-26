const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),{JSDOM}=require('jsdom');
const origin='https://paifjzznyiehwidoqjqb.supabase.co';
const tick=()=>new Promise(r=>setTimeout(r,30));
test('existing lesson player authorizes its source on entry without a separate load click',async()=>{
 const w=new JSDOM('<main><video controls></video></main>',{url:'https://www.plutonacademic.com/b67/id101/',runScripts:'outside-only'}).window;
 w.HTMLMediaElement.prototype.pause=()=>{};w.HTMLMediaElement.prototype.load=()=>{};
 const client={auth:{getUser:async()=>({data:{user:{id:'buyer'}}}),onAuthStateChange(){return {data:{subscription:{unsubscribe(){}}}}}},storage:{from:bucket=>({createSignedUrl:async path=>({data:{signedUrl:origin+'/storage/v1/object/sign/'+bucket+'/'+path+'?token=test'}})})}};
 w.supabase={createClient:()=>client};w.eval(fs.readFileSync('b108/media.js','utf8'));
 const v=w.document.querySelector('video');w.PlutonPrivateMedia.attach(v,origin+'/storage/v1/object/public/id101-videos/lesson.mp4','ID-101');
 await tick();assert.match(v.getAttribute('src')||'',/\/object\/sign\/id101-videos\/lesson.mp4/);assert.equal(v.autoplay,false);w.close();
});
for(const denied of [false,true])test('B107 '+(denied?'denied access shows no players':'welcome and module players appear without a load click'),async()=>{
 const w=new JSDOM(fs.readFileSync('b107/index.html','utf8'),{url:'https://www.plutonacademic.com/b107/?course=ELEC-101',runScripts:'outside-only'}).window;
 const payload={code:'ELEC-101',title:{es:'Curso',en:'Course'},welcome:{es:'ELEC-101/welcome.mp4'},welcomeAudio:{es:'ELEC-101/welcome.mp3'},moduleAudio:{1:{es:'ELEC-101/module-1.mp3'}},modules:[{number:1,title:{es:'Módulo',en:'Module'}}],items:Array.from({length:20},(_,i)=>({id:'lesson-'+i,module:1,title:{es:'Lección',en:'Lesson'},content:{es:'Práctica',en:'Practice'},quiz:[]}))};
 let signs=0;const query={select(){return this},eq(){return this},then(ok){return Promise.resolve({data:[]}).then(ok)}};
 w.supabase={createClient:()=>({auth:{getUser:async()=>({data:{user:{id:'buyer'}}}),onAuthStateChange(){}},rpc:async()=>denied?{error:{message:'denied'}}:{data:payload},from:()=>query,storage:{from:()=>({createSignedUrl:async path=>{signs++;return {data:{signedUrl:origin+'/storage/v1/object/sign/b107-course-media/'+path+'?token=test'}}}})}})};
 w.eval(fs.readFileSync('b107/classroom.js','utf8'));await tick();
 assert.equal(w.document.querySelectorAll('video[src]').length,denied?0:1);assert.equal(w.document.querySelectorAll('audio[src]').length,denied?0:2);assert.equal(signs,denied?0:3);w.close();
});
