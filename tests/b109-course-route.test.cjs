const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const {JSDOM}=require('jsdom');
test('PA-203 digital classroom opens its protected player instead of linking to itself',async()=>{
 const w=new JSDOM(fs.readFileSync('aula-b64.html','utf8'),{url:'https://www.plutonacademic.com/aula-b64.html?course=PA-203&lesson=3&lang=en',runScripts:'outside-only'}).window;
 w.document.documentElement.lang='en';
 w.fetch=async()=>({ok:true,json:async()=>JSON.parse(fs.readFileSync('catalog.json','utf8'))});
 w.eval(fs.readFileSync('b64/aula.js','utf8'));
 await new Promise(r=>setTimeout(r,20));
 const u=new URL(w.document.querySelector('#reading a').href);
 assert.notEqual(u.pathname,'/aula-b64.html','Course entry must not loop back to this page');
 assert.equal(u.pathname,'/b66/pa203/pa203-prueba.html');
 assert.equal(u.searchParams.get('lesson'),'3');
 assert.equal(u.searchParams.get('lang'),'en');
 assert.match(fs.readFileSync('b66/pa203/pa203-aula.js','utf8'),/PlutonPublishedContent.load/);
 w.close();
});
