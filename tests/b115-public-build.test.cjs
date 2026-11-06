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
  const catalog=JSON.parse(fs.readFileSync(path.join(out,'catalog.json')));for(const code of codes){const c=catalog.find(c=>c.code===code);assert.equal(c.price_cents,999);assert.equal(c.lessons.length,15);for(const lang of ['es','en'])assert.ok(fs.existsSync(path.join(out,c.covers[lang])));}
  for(const f of ['b115/course.json','b115/private.sql','b115/audios/FAM-101-L01-es.mp3','b115/REVISAR.html'])assert.equal(fs.existsSync(path.join(out,f)),false,f);
 }finally{fs.rmSync(dir,{recursive:true});}
});
