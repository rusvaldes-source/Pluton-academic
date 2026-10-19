const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs');
test('B70 CSP permits the existing Cloudflare beacon while denying arbitrary origins',()=>{
 const h=fs.readFileSync('_headers','utf8');assert.match(h,/script-src[^;]*https:\/\/static\.cloudflareinsights\.com/);assert.match(h,/connect-src[^;]*https:\/\/cloudflareinsights\.com/);assert.match(h,/frame-ancestors 'none'/);assert.doesNotMatch(h,/script-src[^;]*\*/);
});
