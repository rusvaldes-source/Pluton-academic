const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
test('progress rejects invalid lessons and checks account before saving',async()=>{
 assert.ok(fs.existsSync('b67/progress.js'),'account-isolated progress module must exist');
 const ctx={window:{}};vm.runInNewContext(fs.readFileSync('b67/progress.js','utf8'),ctx);const p=ctx.window.PlutonCourseProgress;let writes=0;
 const client={auth:{getUser:async()=>({data:{user:{id:'B'}}})},from:()=>({upsert:async()=>{writes++;return {error:null}}})};
 assert.equal((await p.save(client,'ID-101',12,true,'B',12)).ok,false);
 assert.equal((await p.save(client,'ID-101',0,true,'A',12)).ok,false);assert.equal(writes,0);
 assert.equal((await p.save(client,'ID-101',0,true,'B',12)).ok,true);assert.equal(writes,1);
});
