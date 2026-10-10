const { chromium } = require('playwright');

const fs = require('fs'); const path = require('path'); const assert = require('assert/strict');
const source = process.env.PLUTON_SOURCE_ROOT || path.resolve(__dirname, '..');
const catalog = JSON.parse(fs.readFileSync(path.join(source,'catalog.json')));
const results=[]; let pageErrors=[]; let requests=[]; let newsMode='success'; let profileMode='PREMIUM'; let loginMode='success';
const user={id:'00000000-0000-4000-8000-000000000001',aud:'authenticated',role:'authenticated',email:'student@example.invalid',user_metadata:{},app_metadata:{provider:'email'},created_at:'2026-01-01T00:00:00Z'};
const jwtPart=o=>Buffer.from(JSON.stringify(o)).toString('base64url');
const session={access_token:jwtPart({alg:'HS256',typ:'JWT'})+'.'+jwtPart({sub:user.id,aud:'authenticated',role:'authenticated',exp:Math.floor(Date.now()/1000)+3600})+'.test',refresh_token:'test-refresh-token',token_type:'bearer',expires_in:3600,expires_at:Math.floor(Date.now()/1000)+3600,user};
const server=require('http').createServer((req,res)=>{
 if(req.url.startsWith('/api/news')){res.setHeader('Content-Type','application/json');if(newsMode==='error'){res.statusCode=503;res.end(JSON.stringify({items:[],error:'Unavailable'}));return;}const en=req.url.includes('lang=en');res.end(JSON.stringify({items:[{title:en?'Test headline':'Titular de prueba',source:'Test fixture',link:'https://example.invalid/article'}]}));return;}
 const file=path.join(source,decodeURI(req.url.split('?')[0]));
 try{res.setHeader('Content-Type',({'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json','.jpg':'image/jpeg','.png':'image/png','.svg':'image/svg+xml'})[path.extname(file)]||'application/octet-stream');res.end(fs.readFileSync(file));}catch(e){res.statusCode=404;res.end('Not found');}
});
async function check(name,fn){try{await fn();results.push({name,status:'passed'});console.log('PASS',name);}catch(e){results.push({name,status:'failed',error:e.message});throw e;}}
(async()=>{
 await new Promise(r=>server.listen(8768,'127.0.0.1',r));
 const browser=await chromium.launch({headless:true,...(process.env.CHROMIUM_EXECUTABLE ? {executablePath:process.env.CHROMIUM_EXECUTABLE, args:['--no-sandbox','--disable-dev-shm-usage']} : {})});
 const context=await browser.newContext({viewport:{width:390,height:844},acceptDownloads:true});
 await context.route('https://cdn.jsdelivr.net/**',r=>r.fulfill({contentType:'text/javascript',body:fs.readFileSync(path.join(__dirname,'fixtures','supabase-2.117.3.js'))}));
 await context.route('https://*.supabase.co/**',async r=>{
  const req=r.request(),url=new URL(req.url());requests.push({path:url.pathname,method:req.method()});let data={};let status=200;
  if(url.pathname.endsWith('/token')){if(loginMode==='error'){status=400;data={code:'invalid_credentials',error_code:'invalid_credentials',msg:'Invalid login credentials'};}else data=session;}
  else if(url.pathname.endsWith('/signup'))data={user,session:null};
  else if(url.pathname.endsWith('/recover')||url.pathname.endsWith('/logout'))data={};
  else if(url.pathname.endsWith('/user')){if(req.method()==='PUT')Object.assign(user.user_metadata,req.postDataJSON()?.data||{});data=user;}
  else if(url.pathname.includes('/rest/v1/profiles')){if(profileMode==='error'){status=500;data={code:'XX000',message:'Test failure'};}else data=profileMode==='none'?[]:[{membership:profileMode}];}
  else{status=503;data={message:'Unexpected test request'};}
  await r.fulfill({status,contentType:'application/json',body:JSON.stringify(data)});
 });
 await context.addInitScript(()=>{
  const synth={cancel(){},speak(utterance){window.testSpeechLang=utterance.lang},getVoices(){return []}};
  Object.defineProperty(window,'speechSynthesis',{value:synth,configurable:true});
 });
 const page=await context.newPage(); page.on('pageerror',e=>pageErrors.push(e.message));
 const goto=async p=>{await page.goto('http://127.0.0.1:8768/'+p);await page.waitForTimeout(180);};
 const toggle=async()=>{await page.evaluate(()=>document.getElementById('languageToggle').click());await page.waitForTimeout(120)};
 const setLang=async lang=>{if(await page.locator('html').getAttribute('lang')!==lang)await toggle();assert.equal(await page.locator('#languageToggle').innerText(),lang.toUpperCase())};
 await check('Portada: 26 cursos, 9 filtros y recursos íntegros',async()=>{
  await goto('index.html');await page.waitForFunction(()=>document.querySelectorAll('#mainCatalog article').length===26);
  assert.equal(await page.locator('[data-catalog-filter]').count(),10);
  for(const c of catalog){await page.locator('#mainCatalog article').filter({has:page.locator('.code',{hasText:c.code})}).scrollIntoViewIfNeeded();}
  const images=await page.locator('img').evaluateAll(els=>els.map(e=>({src:e.getAttribute('src'),loaded:e.complete&&e.naturalWidth>0})));assert(images.every(i=>i.loaded),JSON.stringify(images.filter(i=>!i.loaded)));
  const invalid=await page.locator('a[href^="#"]').evaluateAll(els=>els.map(e=>e.hash).filter(h=>h&&!document.getElementById(h.slice(1))));assert.deepEqual(invalid,[]);
 });
 await check('Navegación móvil, filtros y búsquedas ES/EN',async()=>{
  await page.locator('.menu').click();assert(await page.locator('header nav').isVisible());
  await page.locator('[data-catalog-filter="real-estate"]').click();assert.equal(await page.locator('#mainCatalog article').count(),4);
  await page.locator('[data-catalog-filter="all"]').click();await page.locator('#catalogSearch').fill('RE-201');assert.equal(await page.locator('#mainCatalog article').count(),1);
  await setLang('en');assert.match(await page.locator('#mainCatalog h3').innerText(),/Buying and Selling/);assert.equal(await page.locator('#catalogSearch').getAttribute('placeholder'),'Search courses by name or code');
  await page.locator('#catalogSearch').fill('');await setLang('es');assert.equal(await page.locator('#mainCatalog article').count(),26);
  await page.locator('.pa-search-launch').click();await page.locator('#pa-search-input').fill('RE-201');await page.waitForTimeout(100);
  assert.equal(await page.locator('.pa-search-result').first().getAttribute('href'),'courses.html?course=RE-201');await page.keyboard.press('Escape');
 });
 await check('Participación: guardar, restaurar, borrar y traducir',async()=>{
  await page.locator('#communityIdea').fill('Idea de prueba');await page.locator('#saveIdea').click();assert.match(await page.locator('#ideaStatus').innerText(),/Guardado/);
  await setLang('en');assert.match(await page.locator('#ideaStatus').innerText(),/Saved/);await page.reload();await page.waitForTimeout(150);assert.equal(await page.locator('#communityIdea').inputValue(),'Idea de prueba');
  await page.locator('#clearIdea').click();assert.equal(await page.locator('#communityIdea').inputValue(),'');assert.match(await page.locator('#ideaStatus').innerText(),/cleared/);
 });
 await check('Noticias: idioma, pestañas y caída del servicio',async()=>{
  await page.waitForFunction(()=>document.querySelector('#newsList h3')?.textContent==='Test headline');await page.locator('[data-news-category="tecnologia"]').click();await page.waitForTimeout(100);
  await setLang('es');assert.equal(await page.locator('#newsList h3').innerText(),'Titular de prueba');newsMode='error';await page.locator('[data-news-category="salud"]').click();await page.waitForTimeout(100);assert.match(await page.locator('#newsStatus').innerText(),/temporalmente/);
  await setLang('en');assert.match(await page.locator('#newsStatus').innerText(),/temporarily/);newsMode='success';
 });
 await check('Membresías y ventanas dinámicas reversibles ES/EN',async()=>{
  for(const lang of ['es','en']){await setLang(lang);for(const name of ['START','PLUS','PREMIUM']){await page.locator('#membresias article').filter({has:page.locator('h3',{hasText:name})}).locator('button').click();assert.match(await page.locator('#modalTitle').innerText(),new RegExp((lang==='en'?'Membership ':'Membresía ')+name));await page.locator('#modal .x').click();}}
  await page.evaluate(()=>growth('Comunidad'));assert.match(await page.locator('#modalText').innerText(),/ecosystem/);await page.locator('#modal .x').click();
 });
 await check('Login: validación, error, registro y recuperación simulados',async()=>{
  await page.evaluate(()=>openLogin());await page.evaluate(()=>signIn());assert.equal(await page.locator('#authMessage').innerText(),'Enter your email and password.');await setLang('es');assert.equal(await page.locator('#authMessage').innerText(),'Escribe tu correo y contraseña.');
  await page.locator('#authEmail').fill(user.email);await page.locator('#authPassword').fill('test-password');loginMode='error';await page.evaluate(()=>signIn());assert.match(await page.locator('#authMessage').innerText(),/Credenciales incorrectas/);
  await setLang('en');assert.match(await page.locator('#authMessage').innerText(),/Invalid credentials/);await page.evaluate(()=>signUp());assert.match(await page.locator('#authMessage').innerText(),/confirm your account/);
  await page.evaluate(()=>resetPassword());assert.match(await page.locator('#authMessage').innerText(),/reset your password/);loginMode='success';
 });
 await check('Login → perfil → membresía, con SDK real y respuestas simuladas',async()=>{
  await Promise.all([page.waitForURL('**/dashboard.html'),page.evaluate(()=>signIn())]);await page.waitForFunction(()=>document.getElementById('membership')?.textContent==='PREMIUM');assert.equal(await page.locator('#student-email').innerText(),user.email);
  for(const membership of ['START','PLUS','PREMIUM']){profileMode=membership;await page.evaluate(()=>loadStudent());assert.equal(await page.locator('#membership').innerText(),membership);}
  profileMode='none';await page.evaluate(()=>loadStudent());assert.equal(await page.locator('#membership').innerText(),'No membership');await setLang('es');assert.equal(await page.locator('#membership').innerText(),'Sin membresía');
  profileMode='error';await page.evaluate(()=>loadStudent());assert.equal(await page.locator('#membership').innerText(),'No disponible');await setLang('en');assert.equal(await page.locator('#membership').innerText(),'Unavailable');assert.equal(await page.locator('#student-email').innerText(),user.email);profileMode='PREMIUM';
 });
 await check('Cuaderno del panel, idioma y cierre de sesión',async()=>{
  await page.locator('#journalNotes').fill('Resumen de prueba');await page.locator('#journalSave').click();assert.match(await page.locator('#journalStatus').innerText(),/Saved/);await page.reload();await page.waitForTimeout(180);assert.equal(await page.locator('#journalNotes').inputValue(),'Resumen de prueba');await page.locator('#journalClear').click();assert.equal(await page.locator('#journalNotes').inputValue(),'');
  await Promise.all([page.waitForURL('**/index.html'),page.locator('#logoutButton').click()]);await goto('dashboard.html');await page.waitForFunction(()=>document.getElementById('student-email')?.textContent==='Not signed in');assert.equal(await page.locator('#membership').innerText(),'—');
 });
 await check('Lecciones: buscador reparado y navegación al curso exacto',async()=>{
  await goto('courses.html?course=RE-201&lesson=0');await page.waitForFunction(()=>document.querySelectorAll('.pa-course-card').length===26);assert(await page.locator('#course-RE-201 .pa-lesson').first().getAttribute('open')!==null);
  await page.locator('.pa-search-launch').click();await page.locator('#pa-search-input').fill('RE-201');assert.equal(await page.locator('.pa-search-result').first().getAttribute('href'),'courses.html?course=RE-201');await page.keyboard.press('Escape');
  assert.match(await page.locator('#notice').innerText(),/Introductory demo lessons/);
 });
 await check('Notas, favoritos, tarjetas y audio conservados',async()=>{
  const lesson=page.locator('#course-RE-201 .pa-lesson').first();await lesson.locator('.pa-notes-input').fill('Mi nota de prueba');await lesson.locator('.pa-notes-save').click();await page.waitForTimeout(50);assert.match(await page.locator('#notesLibraryItems').innerText(),/Mi nota de prueba/);
  await page.locator('#course-RE-201 .pa-favorite-toggle').click();assert.match(await page.locator('.pa-favorites-links').innerText(),/Buying and Selling/);
  await lesson.locator('.pa-flashcard-toggle').click();assert(await lesson.locator('.pa-flashcard').isVisible());await lesson.locator('.pa-reveal-answer').click();assert(await lesson.locator('.pa-flashcard-back').isVisible());
  await lesson.locator('.pa-read-aloud').click();assert.equal(await page.evaluate(()=>testSpeechLang),'en-US');await lesson.locator('.pa-stop-audio').click();assert.match(await lesson.locator('.pa-study-message').innerText(),/stopped/);
  await setLang('es');const esLesson=page.locator('#course-RE-201 .pa-lesson').first();await esLesson.locator('summary').click();assert.equal(await esLesson.locator('.pa-notes-input').inputValue(),'Mi nota de prueba');assert.match(await page.locator('#course-RE-201 .pa-favorite-toggle').innerText(),/Guardado/);
  const download=page.waitForEvent('download');await page.locator('#notesLibraryExport').click();assert.equal((await download).suggestedFilename(),'PLUTON_ACADEMIC_MIS_NOTAS.txt');
 });
 await check('Cuestionarios: respuesta vacía, incorrecta y 70 correctas',async()=>{
  let lesson=page.locator('#course-RE-201 .pa-lesson').first();await lesson.locator('.pa-quiz-button').click();assert.match(await lesson.locator('.pa-feedback').innerText(),/Selecciona/);const l=catalog.find(c=>c.code==='RE-201').lessons[0];await lesson.locator('input[value="'+((l.answer+1)%l.options.es.length)+'"]').check();await lesson.locator('.pa-quiz-button').click();assert.match(await lesson.locator('.pa-feedback').innerText(),/Inténtalo/);
  for(const c of catalog){for(let i=0;i<c.lessons.length;i++){const box=page.locator('#course-'+c.code+' details').nth(i);await box.evaluate(e=>e.open=true);await box.locator('input[value="'+c.lessons[i].answer+'"]').check();await box.locator('.pa-quiz-button').click();assert.match(await box.locator('.pa-feedback').innerText(),/correcto|Correct/i);}}
  const done=await page.evaluate(()=>Object.entries(localStorage).filter(([k])=>k.startsWith('pluton-completed-')).reduce((n,[,v])=>n+JSON.parse(v).length,0));assert.equal(done,70);
 });
 await check('Progreso del panel y portada: 70/70 sin duplicados',async()=>{
  await goto('dashboard.html');await page.waitForFunction(()=>document.getElementById('overallProgress')?.textContent.includes('70/70'));assert.match(await page.locator('#overallProgress').innerText(),/100%/);await goto('index.html');await page.waitForFunction(()=>document.getElementById('liveProgressNumber')?.textContent==='100%');
  const options=page.locator('#dailyOptions button');let completed=false;for(let i=0;i<await options.count();i++){await options.nth(i).click();if(/Correct|Correcto/.test(await page.locator('#dailyFeedback').innerText())){completed=true;break;}}assert(completed);await page.reload();await page.waitForTimeout(180);assert.match(await page.locator('#dailyFeedback').innerText(),/completado/);
 });
 await check('Impresión y contenido bilingüe sin cambiar las lecciones',async()=>{
  for(const lang of ['es','en']){await goto('courses.html?course=RE-201&lesson=0');await setLang(lang);const lesson=page.locator('#course-RE-201 details').first();await lesson.evaluate(e=>e.open=true);const popupPromise=context.waitForEvent('page');await lesson.locator('.pa-print-lesson').click();const popup=await popupPromise;await popup.waitForLoadState();assert.equal(await popup.locator('html').getAttribute('lang'),lang);assert.match(await popup.locator('.sheet').innerText(),new RegExp(lang==='en'?'Financial preparation':'Preparación financiera'));await popup.close();}
 });
 await check('Traducción de todas las secciones y títulos, incluso tras cambios dinámicos',async()=>{
  await goto('index.html');await setLang('en');const body=await page.locator('body').innerText();for(const text of ['Conocimiento que se convierte','Aprende, practica','Explora cursos prácticos','Responde actividades','Sigue tu progreso','Buscar / Search','Noticias y actualidad'])assert(!body.includes(text),text);assert.equal(await page.title(),'PLUTÓN ACADEMIC | Your future begins with knowledge');
  await page.evaluate(()=>plan('PREMIUM'));await setLang('es');assert.equal(await page.locator('#modalTitle').innerText(),'Membresía PREMIUM');await page.locator('#modal .x').click();
  await goto('dashboard.html');await page.locator('#journalSave').click();await setLang('en');assert.equal(await page.locator('#journalStatus').innerText(),'Saved on this device.');assert.equal(await page.title(),'Student Dashboard | PLUTÓN ACADEMIC');
 });
 await check('Responsive: tres páginas en 320, 390, 768 y 1440 px',async()=>{
  for(const width of [320,390,768,1440]){await page.setViewportSize({width,height:900});for(const file of ['index.html','courses.html','dashboard.html']){await goto(file);const sizes=await page.evaluate(()=>({width:innerWidth,scroll:document.documentElement.scrollWidth}));assert(sizes.scroll<=sizes.width+1,JSON.stringify({file,...sizes}));if(width===390||width===1440)await page.screenshot({path:path.join(__dirname,'verified-'+width+'-'+file+'.png')});}}
 });
 await check('Ningún error JavaScript y ninguna solicitud real a Supabase',async()=>{assert.deepEqual(pageErrors,[]);assert(requests.some(r=>r.path.endsWith('/token')));});
 fs.writeFileSync(path.join(__dirname,'test-results.json'),JSON.stringify({results,requests,pageErrors},null,2));await browser.close();server.close();
})().catch(e=>{fs.writeFileSync(path.join(__dirname,'test-results.json'),JSON.stringify({results,requests,pageErrors},null,2));console.error(e);process.exit(1)});
