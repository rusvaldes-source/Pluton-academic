const fs=require('fs'),assert=require('node:assert/strict');
const css=fs.readFileSync('visual/b58-visual.css','utf8'),html=fs.readFileSync('visual/preview.html','utf8');
for(const s of ['.b58-preview','@media(max-width:800px)','@media(max-width:560px)','object-fit:cover','focus-visible','prefers-reduced-motion'])assert.ok(css.includes(s),s);
for(const s of ['lang="es"','name="viewport"','alt=','aria-label=']) if(s==='alt=') assert.ok(!html.includes('<img '),'Placeholder intentionally avoids false image assets'); else assert.ok(html.includes(s),s);
assert.ok(!html.includes('http://')&&!html.includes('https://'));
console.log('PASS: comprobaciones estáticas visuales B58');
