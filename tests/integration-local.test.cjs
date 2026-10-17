const assert=require('node:assert/strict');
const fs=require('node:fs');const os=require('node:os');const path=require('node:path');const cp=require('node:child_process');
const root=path.resolve(__dirname,'..');const temp=fs.mkdtempSync(path.join(os.tmpdir(),'b58-local-'));
try {
const html=`<html><head></head><body><header><nav><a href="courses.html">Cursos</a><button id="languageToggle">ES</button></nav></header><main id="inicio"><section class="pa-b37-banner pa-b54-banner"><div><img src="assets/b57/estudiante-01.webp" alt="Estudiante con computadora y planeta Plutón"></div></section><div aria-label="Accesos de PLUTÓN ACADEMIC" class="x"></div><p data-b53-es="Hola" data-b53-en="Hello">Hola</p></main></body></html>`;
fs.writeFileSync(path.join(temp,'index.html'),html);fs.writeFileSync(path.join(temp,'styles.css'),'body{}');
const script=path.join(root,'integration','aplicar_banner_b58.py');
cp.execFileSync('python',[script,temp]);
const first=fs.readFileSync(path.join(temp,'index.html'),'utf8');
assert.match(first,/b58-founders-hero/);assert.match(first,/id="estudiantes"/);assert.match(first,/data-b53-en="Student zone"/);
assert.match(first,/<header><nav><a href="courses.html">Cursos<\/a><button id="languageToggle">ES<\/button><\/nav><\/header>/);
assert(fs.existsSync(path.join(temp,'assets/b58/b58-fundadores-foto.webp')));
cp.execFileSync('python',[script,temp]);
assert.equal(fs.readFileSync(path.join(temp,'index.html'),'utf8'),first,'Must be idempotent');
console.log('PASS local integration, header preservation, bilingual student zone, asset, idempotence');
} finally {fs.rmSync(temp,{recursive:true,force:true});}
