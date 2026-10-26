/* Local browser verification only: no real Auth/Stripe requests. */
const {chromium}=require('playwright');const {spawn}=require('node:child_process');const {once}=require('node:events');const fs=require('node:fs');const path=require('node:path');const assert=require('node:assert/strict');
const repo=path.resolve(__dirname,'..'),privateRoot=process.env.B114_PRIVATE||path.resolve(repo,'../b114-private'),port=8876;
(async()=>{const server=spawn('python3',[path.join(repo,'scripts/b114-review.py'),'--private',privateRoot,'--port',String(port)],{stdio:['ignore','pipe','pipe']});let browser;const errors=[],results=[];
try{await once(server.stdout,'data');
 for(const [name,width,height] of [['desktop',1440,1000],['phone',390,844]]){
  console.log('VIEWPORT',name);browser=await chromium.launch({executablePath:process.env.B114_CHROMIUM||'/tmp/chromium',headless:true,args:['--no-zygote','--single-process','--disable-dev-shm-usage']});const context=await browser.newContext({viewport:{width,height}}),page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));const requests=[];page.on('request',r=>requests.push(r.url()));
  await page.goto(`http://127.0.0.1:${port}/b114/`);await page.waitForSelector('.course-card');assert.equal(await page.locator('.course-card').count(),3);assert.equal(await page.locator('a[href*="checkout"],button:has-text("Comprar")').count(),0);assert.equal(await page.locator('.course-photo').evaluateAll(imgs=>imgs.every(i=>i.complete&&i.naturalWidth>0)),true);
  for(const code of ['FA-101','DRV-101','MED-201']){
   const data=JSON.parse(fs.readFileSync(path.join(privateRoot,'content',code+'.json'),'utf8'));
   await page.goto(`http://127.0.0.1:${port}/b114/index.html?course=${code}`);await page.waitForSelector('.detail-content');assert.equal(await page.locator('#detail img').getAttribute('src'),'covers/'+code+'.webp');
   await page.goto(`http://127.0.0.1:${port}/b114/aula.html?course=${code}&lang=es`);await page.waitForSelector('#classroom:not([hidden])');assert.equal(await page.locator('#lesson option').count(),data.lessons.length);
   for(let index=0;index<data.lessons.length;index++){
    await page.selectOption('#lesson',String(index));await page.waitForFunction(i=>document.querySelector('#lesson').value===String(i),index);assert.equal(await page.locator('.b67-question').count(),5);
    for(let qi=0;qi<5;qi++){const block=page.locator('.b67-question').nth(qi);await block.locator('input').nth(data.lessons[index].quiz[qi].answer).check();await block.locator('button').click();assert.match(await block.innerText(),/Correcto|Correct\./);}const exercise=page.locator('#lessonContent input[type=text]');await exercise.fill(data.lessons[index].exercise.answers[0]);await page.getByRole('button',{name:/^(Comprobar ejercicio|Check exercise)$/}).click();assert.ok((await page.locator('#lessonContent').innerText()).includes('5/5'));
    for(const lang of ['es','en']){
     if(await page.locator('html').getAttribute('lang')!==lang)await page.click('#language');
     assert.ok((await page.locator('#lessonContent h2').innerText()).includes(data.lessons[index].title[lang]));assert.ok(await page.locator('.b67-question input:checked').count());
     if(process.env.B114_REQUIRE_MEDIA==='1')for(const tag of ['audio','video']){
      const media=page.locator('#lessonContent '+tag);assert.equal(await media.count(),1);await media.evaluate(async el=>{await el.play();});await page.waitForFunction(t=>{const e=document.querySelector('#lessonContent '+t);return e.currentTime>0.1&&!e.error},tag);const state=await media.evaluate(e=>({duration:e.duration,time:e.currentTime,error:e.error?.code||null}));assert.ok(state.duration>2&&state.time>0);await media.evaluate(e=>e.pause());results.push({viewport:name,code,lesson:index+1,lang,media:tag,...state});
     }
    }
    if(await page.locator('#complete').isEnabled()){await page.click('#complete');await page.waitForFunction(()=>/sincronizado|synced/.test(document.querySelector('#sync').textContent));}assert.ok(Number((await page.locator('#progress').innerText()).match(/(\d+)\//)[1])>=index+1);
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),true,'Horizontal overflow '+name+' '+code+' '+index);
   }
   await page.reload();await page.waitForSelector('#classroom:not([hidden])');await page.waitForFunction(n=>document.querySelector('#progress').textContent.includes(n+'/'+n),data.lessons.length);assert.match(await page.locator('#certificateStatus').innerText(),/participation|participación/);
  }
  assert.equal(requests.some(u=>u.includes('supabase.co')||u.includes('stripe.com')),false,'Local review must not contact production services');await browser.close();browser=null;
 }
 assert.deepEqual(errors,[]);const out={status:'passed',environment:'local Chromium; synthetic review account; no real Auth or payment test',viewports:['1440x1000','390x844'],courses:3,lessonsPerViewport:34,mediaChecks:results.length,playback:results};fs.writeFileSync(path.join(privateRoot,'reports/browser-results.json'),JSON.stringify(out,null,2));console.log(JSON.stringify({...out,playback:undefined}));
}finally{await browser?.close();server.kill();}
})().catch(e=>{console.error(e.stack);process.exitCode=1});
