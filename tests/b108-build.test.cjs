const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),os=require('node:os'),path=require('node:path'),{spawnSync}=require('node:child_process');
const script=path.resolve('scripts/build-b108-public.py');
test('public build omits premium bodies, raw courses, private audio, SQL and archives without changing originals',()=>{
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),'b108-public-')),src=path.join(dir,'source'),out=path.join(dir,'public');fs.mkdirSync(src);
 const write=(file,text)=>{fs.mkdirSync(path.dirname(path.join(src,file)),{recursive:true});fs.writeFileSync(path.join(src,file),text)};
 write('index.html','<!doctype html><script src="app.js"></script>');write('app.js','/* public */');write('catalog.json',JSON.stringify([{code:'ID-101',es:'Inglés',en:'English',classroom:'b67/id101/',lessons:[{id:'L1',es:'Saludo',en:'Greeting',content:{es:'PRIVATE_BODY'},answer:1,options:{es:['SECRET_A','SECRET_B']}}]}]));
 write('b67/id101/course.json','PRIVATE_FULL_COURSE');write('database/private.sql','PRIVATE_SQL');write('old.zip','PRIVATE_ARCHIVE');write('ingles-desde-cero/audios/B102_ID001-02-01-es_Adays.mp3','PRIVATE_AUDIO');write('ingles-desde-cero/audios/ID001-01-01-es.mp3','APPROVED_SAMPLE');
 const before=fs.readFileSync(path.join(src,'catalog.json'),'utf8');
 const result=spawnSync('python3',[script,'--source',src,'--output',out],{encoding:'utf8'});assert.equal(result.status,0,result.stderr);
 const catalog=JSON.parse(fs.readFileSync(path.join(out,'catalog.json')));assert.deepEqual(catalog[0].lessons,[{id:'L1',es:'Saludo',en:'Greeting'}]);assert.equal(catalog[0].classroom,'b67/id101/');assert.ok(fs.existsSync(path.join(out,'b108/daily-questions.json')),'separate public daily bank exists');
 for(const f of ['b67/id101/course.json','database/private.sql','old.zip','ingles-desde-cero/audios/B102_ID001-02-01-es_Adays.mp3'])assert.equal(fs.existsSync(path.join(out,f)),false,f);
 assert.equal(fs.readFileSync(path.join(out,'ingles-desde-cero/audios/ID001-01-01-es.mp3'),'utf8'),'APPROVED_SAMPLE');assert.equal(fs.readFileSync(path.join(src,'catalog.json'),'utf8'),before);
 const retry=spawnSync('python3',[script,'--source',src,'--output',out],{encoding:'utf8'});assert.notEqual(retry.status,0,'existing output is never overwritten');fs.rmSync(dir,{recursive:true});
});
test('public build preserves verified Facebook and YouTube dependencies without publishing other social sources',async()=>{
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),'b116-social-')),src=path.join(dir,'source'),out=path.join(dir,'public');fs.mkdirSync(src);
 try{
 const copy=file=>{fs.mkdirSync(path.dirname(path.join(src,file)),{recursive:true});fs.copyFileSync(file,path.join(src,file))};
 for(const file of ['index.html','b59-social.js','social/social-links.js','social/social-links.json'])copy(file);
 fs.writeFileSync(path.join(src,'catalog.json'),'[]');fs.writeFileSync(path.join(src,'social/private-notes.js'),'PRIVATE_NOTES');
 const result=spawnSync('python3',[script,'--source',src,'--output',out],{encoding:'utf8'});assert.equal(result.status,0,result.stderr);
 assert.ok(fs.existsSync(path.join(out,'social/social-links.js')),'footer module must ship');
 const {verifiedSocialAccounts}=await import(require('node:url').pathToFileURL(path.join(out,'social/social-links.js')).href);
 const config=JSON.parse(fs.readFileSync(path.join(out,'social/social-links.json'),'utf8'));
 assert.deepEqual(verifiedSocialAccounts(config).map(x=>({id:x.id,url:x.url})),[
 {id:'facebook',url:'https://www.facebook.com/share/19PgWDxRyE/'},
 {id:'youtube',url:'https://www.youtube.com/channel/UC9ivhOmftjj2UDVLtWpTNdw'}]);
 assert.equal(fs.existsSync(path.join(out,'social/private-notes.js')),false);
 assert.equal(fs.readFileSync(path.join(out,'social/social-links.json'),'utf8'),fs.readFileSync('social/social-links.json','utf8'));
 }finally{fs.rmSync(dir,{recursive:true});}
});
