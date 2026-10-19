const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs');
test('new classrooms allow lesson MP4 from the existing Supabase host only',()=>{
const block=fs.readFileSync('_headers','utf8').split('/b70/*')[1];
assert.match(block,/media-src 'self' https:\/\/paifjzznyiehwidoqjqb\.supabase\.co;/);
assert.doesNotMatch(block,/media-src[^;]*\*/);
});
