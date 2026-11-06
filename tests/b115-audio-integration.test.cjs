const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {JSDOM}=require('jsdom');
const root=path.resolve(__dirname,'..');
const privateRoot=process.env.B115_ROOT;
const codes=['FAM-101','FAM-102','PSI-101','PSI-102'];

test('B115 reader selects all 120 exact MP3s and stops previous audio on navigation',()=>{
 assert.ok(privateRoot,'Set B115_ROOT to the private integrated directory');
 for(const code of codes){
  const dir=path.join(privateRoot,code),course=JSON.parse(fs.readFileSync(path.join(dir,'course.json')));
  const dom=new JSDOM(fs.readFileSync(path.join(dir,'REVISAR.html'),'utf8'),{url:'https://private.invalid/'+code+'/REVISAR.html',runScripts:'dangerously',beforeParse(w){
   w.HTMLMediaElement.prototype.pause=function(){this.dataset.stopped='true'};
   w.HTMLMediaElement.prototype.load=function(){};
  }});
  const w=dom.window,d=w.document;
  assert.equal(d.querySelectorAll('#lesson option').length,15);
  let previous=null;
  for(let i=0;i<15;i++)for(const lang of ['es','en']){
   if(d.documentElement.lang!==lang)d.getElementById('language').click();
   const select=d.getElementById('lesson');select.value=String(i);select.dispatchEvent(new w.Event('change'));
   const audio=d.querySelector('audio');assert.ok(audio.controls);assert.equal(d.querySelectorAll('audio').length,1);
   const local='audios/'+lang+'/'+course.lessons[i].id+'-'+lang+'.mp3';
   assert.equal(audio.getAttribute('src'),local);assert.ok(fs.statSync(path.join(dir,local)).size>1000);
   assert.equal(course.lessons[i].audio[lang],code+'/'+course.lessons[i].id+'-'+lang+'.mp3');
   if(previous){assert.equal(previous.dataset.stopped,'true');assert.equal(previous.hasAttribute('src'),false)}previous=audio;
   assert.match(d.querySelector('img').src,/^data:image\/webp;base64,/);
   assert.equal(d.querySelectorAll('input[type=radio]').length,20);
  }
  d.getElementById('final').click();assert.equal(d.querySelectorAll('input[type=radio]').length,80);
  assert.equal(d.querySelectorAll('audio').length,0);assert.ok(d.getElementById('content').textContent.includes(course.final_project.en));
  assert.equal(course.certificate.enabled,false);dom.window.close();
 }
});

test('B115 private media rejects wrong course, untrusted origins, guests and logout',async()=>{
 const dom=new JSDOM('<body></body>',{url:'https://example.test',runScripts:'outside-only'}),w=dom.window;
 w.HTMLMediaElement.prototype.pause=()=>{};w.HTMLMediaElement.prototype.load=()=>{};
 w.eval(fs.readFileSync(path.join(root,'b114/media.js'),'utf8'));
 let callback,owner='owner',untrusted=false,calls=0;
 const sb={auth:{getUser:async()=>({data:{user:owner?{id:owner}:null}}),onAuthStateChange(fn){callback=fn}},storage:{from(bucket){return {async createSignedUrl(p){calls++;return {data:{signedUrl:(untrusted?'https://untrusted.invalid':'https://paifjzznyiehwidoqjqb.supabase.co')+'/storage/v1/object/sign/'+bucket+'/'+p+'?token=test'}}}}}}};
 w.PlutonB114Media.use(sb,'owner');
 for(const code of codes){const a=w.document.createElement('audio');w.document.body.append(a);assert.equal(await w.PlutonB114Media.attach(a,code+'/'+code+'-L15-en.mp3',code),true);const before=calls;assert.equal(await w.PlutonB114Media.attach(a,'FAM-101/FAM-101-L01-es.mp3',code==='FAM-101'?'PSI-101':code),false);assert.equal(calls,before)}
 untrusted=true;assert.equal(await w.PlutonB114Media.attach(w.document.createElement('audio'),'PSI-102/PSI-102-L01-es.mp3','PSI-102'),false);
 owner=null;assert.equal(await w.PlutonB114Media.attach(w.document.createElement('audio'),'PSI-102/PSI-102-L01-es.mp3','PSI-102'),false);
 callback('SIGNED_OUT',null);assert.equal(w.document.querySelectorAll('audio[src]').length,0);w.close();
});
