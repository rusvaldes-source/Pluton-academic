const assert = require('node:assert/strict');
const fs = require('node:fs');
const http = require('node:http');
const path = require('node:path');
const { chromium } = require('/opt/codex/runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const root = path.resolve(__dirname, '..');
const fixture = '<html lang="es"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><link rel="stylesheet" href="/b59.css"><div class="b60-social-label" data-b53-es="Síguenos en redes sociales" data-b53-en="Follow us on social media">Síguenos en redes sociales</div><div id="b59-items" class="b60-social"></div><script defer src="/b59-social.js"></script></html>';
(async () => {
 const server = http.createServer((req,res) => {
  const url = new URL(req.url, 'http://localhost');
  if (url.pathname === '/') return res.end(fixture);
  const file = path.join(root, url.pathname);
  if (!file.startsWith(root + '/') || !fs.existsSync(file)) {res.statusCode=404;return res.end();}
  res.setHeader('Content-Type',file.endsWith('.js')?'text/javascript':file.endsWith('.json')?'application/json':'text/css');
  res.end(fs.readFileSync(file));
 });
 await new Promise(resolve => server.listen(0,'127.0.0.1',resolve));
 const origin = `http://127.0.0.1:${server.address().port}`;
 const browser = await chromium.launch({headless:true,executablePath:'/tmp/chromium',args:['--no-sandbox','--disable-dev-shm-usage']});
 try {
  for (const width of [390,1440]) {
   const page = await browser.newPage({viewport:{width,height:900}});
   page.setDefaultTimeout(10000);
   const errors=[];page.on('pageerror',e=>errors.push(e.message));
   await page.goto(origin);
   await page.locator('#b59-items').getByText('Las cuentas oficiales todavía no están vinculadas.').waitFor();
   assert.equal(await page.locator('#b59-items a, #b59-items [aria-disabled]').count(),0);
   await page.evaluate(()=>document.documentElement.lang='en');
   await page.locator('#b59-items').getByText('Official accounts have not been linked yet.').waitFor();
   assert.equal(await page.locator('.b60-social-label').innerText(),'Social media');
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
   await page.route('**/social/social-links.json',r=>r.fulfill({json:{networks:[
    {id:'tiktok',label:'TikTok',url:'https://www.tiktok.com/@test-fixture',verified:true},
    {id:'facebook',label:'Facebook',url:'https://facebook.com/',verified:true},
    {id:'youtube',label:'YouTube',url:'https://youtube.com.evil.com/@x',verified:true},
    {id:'instagram',label:'Instagram',url:'https://user:pass@instagram.com/test-fixture',verified:true},
    {id:'linkedin',label:'LinkedIn',url:'https://linkedin.com/company/test-fixture',verified:false}
   ]}}));
   await page.reload();
   await page.locator('#b59-items a').waitFor();
   assert.equal(await page.locator('#b59-items a').count(),1);
   const link=page.locator('#b59-items a');
   assert.equal(await link.innerText(),'TikTok');
   assert.equal(await link.getAttribute('target'),'_blank');
   assert.equal(await link.getAttribute('rel'),'noopener noreferrer');
   assert.ok((await link.boundingBox()).height>=44);
   await link.focus();assert.equal(await link.evaluate(el=>el===document.activeElement),true);
   await page.route('**/social/social-links.json',r=>r.fulfill({status:503,body:'Unavailable'}));
   await page.reload();
   await page.locator('#b59-items').getByText('No se pudieron cargar las redes sociales. Inténtalo de nuevo más tarde.').waitFor();
   assert.equal(await page.locator('#b59-items a').count(),0);
   assert.deepEqual(errors,[]);
   await page.close();
  }
  console.log('PASS: social panels desktop/mobile, ES/EN, honest pending/error states, valid TikTok link, rejected unsafe/unverified URLs, keyboard and 44px targets');
 } finally { await browser.close();server.close(); }
})().catch(e=>{console.error(e);process.exitCode=1;});
