const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),{JSDOM}=require('jsdom');
const repo=path.resolve(__dirname,'..'),codes=['FAM-101','FAM-102','PSI-101','PSI-102'];
const read=p=>fs.readFileSync(path.join(repo,p),'utf8');
const settle=()=>new Promise(r=>setImmediate(r));

test('B115 catalog preserves every old entry and provides 4 complete 999-cent bilingual records',()=>{
 const {execFileSync}=require('node:child_process');const old=JSON.parse(execFileSync('git',['show','be03017c4c71699412d4825861184f3ff66c4047:catalog.json'],{cwd:repo,encoding:'utf8'})),all=JSON.parse(read('catalog.json'));
 assert.deepEqual(all.filter(c=>!codes.includes(c.code)),old);assert.equal(all.length,old.length+4);
 for(const c of all.filter(c=>codes.includes(c.code))){assert.equal(c.price_cents,999);assert.equal(c.currency,'usd');assert.equal(c.payment_type,'one_time');assert.equal(c.lessons.length,15);assert.match(c.classroom,/^b114\/aula.html\?course=/);for(const lang of ['es','en']){assert.ok(c[lang]);assert.ok(fs.statSync(path.join(repo,c.covers[lang].split('?')[0])).size>1000);assert.equal(new Set(c.lessons.map(x=>x.id)).size,15)}}
});

test('B115 page renders 4 prices and covers in both languages; purchase uses the unchanged existing flow',async()=>{
 const data=JSON.parse(read('b115/catalog.json')),html=read('b115/index.html'),dom=new JSDOM(html,{url:'https://example.test/b115/index.html',runScripts:'outside-only'}),w=dom.window;
 w.fetch=async()=>({ok:true,json:async()=>data});w.eval(read('b115/catalog.js'));await settle();
 for(const lang of ['es','en']){assert.equal(w.document.documentElement.lang,lang);const cards=[...w.document.querySelectorAll('article')];assert.equal(cards.length,4);for(const [i,card]of cards.entries()){assert.ok(card.textContent.includes('$9.99'));assert.equal(card.querySelectorAll('li').length,15);assert.ok(card.querySelector('img').src.endsWith(data[i].covers[lang]));assert.equal(new URL(card.querySelector('a.buy').href).searchParams.get('b115_buy'),data[i].code);assert.equal(new URL(card.querySelector('p a').href).searchParams.get('course'),data[i].code)}w.document.getElementById('language').click()}
 w.close();
 const d=new JSDOM('<main id="mainCatalog">'+data.map(c=>'<article><span class="code">'+c.code+'</span><a class="catalog-cta">View</a><p class="b115-price">Duplicate</p><button class="b115-buy">Duplicate</button></article>').join('')+'</main>',{url:'https://example.test',runScripts:'outside-only'});d.window.eval(read('b115/catalog-entry.js'));d.window.document.dispatchEvent(new d.window.Event('DOMContentLoaded'));assert.equal(d.window.document.querySelectorAll('.b115-price,.b115-buy').length,0);for(const card of d.window.document.querySelectorAll('article'))assert.ok(card.querySelector('a.catalog-cta').href.includes('/b115/index.html?course='));d.window.close();
});

test('mobile purchased-course routing accepts B115 and never trusts a redirect as a purchase',async()=>{
 const api=require('../app-pluton/owned-lessons.js');for(const code of codes){assert.equal(api.courseLink(code,'en'),'/b114/aula.html?course='+code+'&lang=en');const result=await api.resolveOwnedCourses({getUser:async()=>({data:{user:{id:'owner'}}}),purchases:async()=>({data:[{course_code:code,active:true},{course_code:'OTHER',active:false}]}),catalog:async()=>JSON.parse(read('catalog.json'))});assert.deepEqual(result.courses.map(c=>c.code),[code]);}
});

test('student classroom renders B115 lessons, original audio paths, bilingual banners and final assessment',async()=>{
 for(const code of codes){const data=JSON.parse(fs.readFileSync(path.join(process.env.B115_ROOT,code,'course.json')));Object.defineProperty(data,'_publishedRevision',{value:'b115-1'});const dom=new JSDOM(read('b114/aula.html'),{url:'https://example.test/b114/aula.html?course='+code,runScripts:'outside-only'}),w=dom.window,d=w.document;let attached=[];
  d.body.dataset.course=code;w.PlutonCourseData=data;w.PlutonCourseUserId='owner';w.PlutonCourseClient=null;w.PlutonB114Media={clear(){attached=[]},async attach(el,p,c){attached.push({p,c});return true}};w.scrollTo=()=>{};w.eval(read('b114/aula.js'));await settle();
  for(let i=0;i<15;i++)for(const lang of ['es','en']){if(d.documentElement.lang!==lang)d.getElementById('language').click();d.getElementById('lesson').value=String(i);d.getElementById('lesson').dispatchEvent(new w.Event('change'));assert.equal(d.querySelectorAll('audio').length,1);assert.equal(attached.length,1);assert.equal(attached[0].p,code+'/'+data.lessons[i].id+'-'+lang+'.mp3');assert.ok(new URL(d.getElementById('coursePhoto').src).pathname.endsWith('/'+data.covers[lang]));assert.equal(new URL(d.getElementById('coursePhoto').src).searchParams.get('v'),'b115-fotos-20261106');assert.equal(d.querySelectorAll('#lessonContent .b67-question').length,5);assert.equal(d.querySelectorAll('#finalAssessment .b67-question').length,20);}
  w.close();
 }
});

test('Stripe, keys, webhooks and payment application source remain byte-identical to main',()=>{
 const {execFileSync}=require('node:child_process');for(const file of ['app.js','supabase/functions/b101-create-checkout/index.ts','supabase/functions/b101-stripe-webhook/index.ts']){const before=execFileSync('git',['show','be03017c4c71699412d4825861184f3ff66c4047:'+file],{cwd:repo});assert.deepEqual(fs.readFileSync(path.join(repo,file)),before,file)}
});
