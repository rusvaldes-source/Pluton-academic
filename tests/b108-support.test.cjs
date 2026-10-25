const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),{JSDOM}=require('jsdom');
test('switching support language repeatedly preserves fields, entered values and validation',()=>{
 const w=new JSDOM(fs.readFileSync('support/index.html','utf8'),{url:'https://example.test/support/',runScripts:'outside-only'}).window;
 w.eval(fs.readFileSync('support/support.js','utf8'));
 const fields=['category','subject','description'].map(id=>w.document.getElementById(id));
 fields[0].value='billing';fields[1].value='Compra del curso';fields[2].value='Necesito ayuda con mi compra.';
 for(let i=0;i<4;i++) {w.document.getElementById('lang').click();for(const field of fields)assert.equal(w.document.getElementById(field.id),field,'original field remains attached');assert.equal(fields[0].value,'billing');assert.equal(fields[1].value,'Compra del curso');assert.equal(fields[2].value,'Necesito ayuda con mi compra.');assert.equal(w.document.documentElement.lang,i%2?'es':'en');assert.equal(fields[1].required,true);assert.equal(fields[2].minLength,10);}
 w.close();
});
