const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const {JSDOM}=require('jsdom');
const root=path.resolve(__dirname,'..'),dir=path.join(root,'herramientas');
test('public catalog cannot deliver commercial files or initiate checkout',()=>{
 const config=JSON.parse(fs.readFileSync(path.join(dir,'commerce-config.json')));
 assert.equal(config.provider,null);assert.equal(config.checkoutEnabled,false);assert.equal(config.downloadsEnabled,false);
 assert.deepEqual(config.publicAssetUrls,[]);
 for(const file of fs.readdirSync(dir))assert(!/\.(zip|pdf|docx|xlsx)$/.test(file));
 const html=fs.readFileSync(path.join(dir,'index.html'),'utf8');
 assert(!/base64|archivos\/|PLUTON_B87_FILES|B87_VISTA_PREVIA/.test(html));
});
test('homepage entry links resolve to existing portal sections without changing navigation',()=>{
 const dom=new JSDOM(fs.readFileSync(path.join(root,'index.html'),'utf8'));
 const portal=new JSDOM(fs.readFileSync(path.join(dir,'index.html'),'utf8'));
 const links=[...dom.window.document.querySelectorAll('.pa-b87-links a')];assert.equal(links.length,3);
 assert(dom.window.document.querySelector('#recursos .pa-b87-entry'));
 for(const a of links){const [file,hash]=a.getAttribute('href').split('#');assert(fs.existsSync(path.join(root,file,'index.html')));assert(portal.window.document.getElementById(hash));}
 for(const id of ['cursos','membresias','empresas','certificados','noticias'])assert(dom.window.document.getElementById(id));
 dom.window.close();portal.window.close();
});
test('portal inherits and saves the established language preference, with no form data stored',()=>{
 const dom=new JSDOM(fs.readFileSync(path.join(dir,'index.html'),'utf8'),{runScripts:'outside-only',url:'https://www.plutonacademic.com/herramientas/#tienda'}),w=dom.window;
 w.localStorage.setItem('pluton-lang','en');
 for(const file of ['tools.js','app.js'])w.eval(fs.readFileSync(path.join(dir,file),'utf8'));
 assert.equal(w.document.documentElement.lang,'en');assert.equal(w.document.getElementById('tienda').hidden,false);
 w.document.getElementById('lang').click();assert.equal(w.localStorage.getItem('pluton-lang'),'es');assert.equal(w.localStorage.length,1);
 assert.equal(w.document.querySelector('header .brand').getAttribute('href'),'/');
 assert.equal(w.document.querySelector('header .home-link').getAttribute('href'),'/');w.close();
});
