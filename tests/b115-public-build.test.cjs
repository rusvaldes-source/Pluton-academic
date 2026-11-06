const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),os=require('node:os'),path=require('node:path'),{spawnSync}=require('node:child_process');
test('production build ships B115 catalog, scripts and eight covers while excluding paid payloads and recordings',()=>{
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),'b115-public-')),src=path.join(dir,'source'),out=path.join(dir,'public');fs.mkdirSync(src);
 const copy=file=>{fs.mkdirSync(path.dirname(path.join(src,file)),{recursive:true});fs.copyFileSync(file,path.join(src,file))};
 try{
  for(const f of ['index.html','catalog.json','b115/index.html','b115/catalog.json','b115/catalog.js','b115/catalog-entry.js'])copy(f);
  const codes=['FAM-101','FAM-102','PSI-101','PSI-102'];for(const code of codes)for(const lang of ['es','en'])copy(`b114/covers/${code}-${lang}.webp`);
  for(const f of ['b115/course.json','b115/private.sql','b115/audios/FAM-101-L01-es.mp3','b115/REVISAR.html']){fs.mkdirSync(path.dirname(path.join(src,f)),{recursive:true});fs.writeFileSync(path.join(src,f),'PRIVATE');}
  const result=spawnSync('python3',['scripts/build-b108-public.py','--source',src,'--output',out],{encoding:'utf8'});assert.equal(result.status,0,result.stderr);
  for(const f of ['b115/index.html','b115/catalog.json','b115/catalog.js','b115/catalog-entry.js'])assert.ok(fs.existsSync(path.join(out,f)),f);
  const catalog=JSON.parse(fs.readFileSync(path.join(out,'catalog.json')));for(const code of codes){const c=catalog.find(c=>c.code===code);assert.equal(c.price_cents,999);assert.equal(c.lessons.length,15);for(const lang of ['es','en'])assert.ok(fs.existsSync(path.join(out,c.covers[lang].split('?')[0])));}
  for(const f of ['b115/course.json','b115/private.sql','b115/audios/FAM-101-L01-es.mp3','b115/REVISAR.html'])assert.equal(fs.existsSync(path.join(out,f)),false,f);
 }finally{fs.rmSync(dir,{recursive:true});}
});
test('homepage B115 decoration settles with the existing global translator',async()=>{
 const {JSDOM}=require('jsdom'),dom=new JSDOM(fs.readFileSync('index.html','utf8'),{url:'https://www.plutonacademic.com/index.html?b115_buy=FAM-101#cursos',runScripts:'outside-only',pretendToBeVisual:true});
 const w=dom.window,Real=w.MutationObserver,counts=[],observers=[];let exceeded=false;
 w.MutationObserver=class extends Real{constructor(callback){const count={calls:0};counts.push(count);super((records,observer)=>{if(++count.calls>60){exceeded=true;observer.disconnect();return}callback(records,observer)});observers.push(this)}};
 w.fetch=async()=>({ok:true,json:async()=>JSON.parse(fs.readFileSync('catalog.json','utf8'))});let requested=null;w.course=code=>{requested=code};
 try{
  w.eval(fs.readFileSync('language.js','utf8'));
  for(const script of [...w.document.querySelectorAll('script:not([src])')].map(s=>s.textContent).filter(s=>s.includes('function applyCoursePrices')||s.includes('const PRICE_ES=')))w.eval(script);
  for(const file of ['b107/catalog.js','b115/catalog-entry.js','catalog-ui.js'])w.eval(fs.readFileSync(file,'utf8'));
  await new Promise(resolve=>setTimeout(resolve,150));
  assert.equal(exceeded,false,'mutation observers must settle instead of blocking browser input');assert.equal(requested,'FAM-101');
  assert.equal(w.document.querySelectorAll('.b115-buy,.b115-price').length,0);
  for(const code of ['FAM-101','FAM-102','PSI-101','PSI-102']){const card=[...w.document.querySelectorAll('#mainCatalog article')].find(c=>c.querySelector('.code')?.textContent===code);assert.equal(card.querySelectorAll('.pa-b102-course-price').length,1);assert.equal(card.querySelectorAll('.pa-b103-buy').length,1);card.querySelector('.pa-b103-buy').click();assert.equal(requested,code,'existing gold purchase button must retain checkout routing');}
  const before=counts.map(c=>c.calls);w.document.documentElement.lang=w.document.documentElement.lang;await new Promise(resolve=>setTimeout(resolve,100));
  assert.equal(exceeded,false);assert.ok(counts.every((c,i)=>c.calls-before[i]<10),'writing the same locale must not cause repeated decoration');
 }finally{for(const observer of observers)observer.disconnect();dom.window.close()}
});
