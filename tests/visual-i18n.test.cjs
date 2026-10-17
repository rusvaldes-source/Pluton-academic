const fs=require('node:fs'),assert=require('node:assert/strict');
const html=fs.readFileSync('visual/preview.html','utf8'),js=fs.readFileSync('visual/b58-preview-i18n.js','utf8');
const keys=[...html.matchAll(/data-i18n="([a-z0-9]+)"/g)].map(x=>x[1]);
for(const key of new Set(keys)){const matches=[...js.matchAll(new RegExp('(?:^|[,\\s])'+key+':','g'))];assert.equal(matches.length,2,'ES/EN key missing: '+key)}
assert.ok(html.includes('data-lang="es"')&&html.includes('data-lang="en"'));
assert.ok(js.includes('document.documentElement.lang=lang'));
assert.ok(js.includes("setAttribute('aria-pressed'"));
assert.ok(!html.includes('<img '),'Do not pretend original photos are available');
console.log('PASS B58 visual bilingual preview: '+new Set(keys).size+' translated keys');
