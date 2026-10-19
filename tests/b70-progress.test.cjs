const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
test('new progress adapter saves NA/COMP only and refuses mismatched account',async()=>{
 const sandbox={window:{}}; vm.runInNewContext(fs.readFileSync('b70/progress.js','utf8'),sandbox);
 let writes=0;const client={auth:{getUser:async()=>({data:{user:{id:'student-a'}}})},from:()=>({upsert:async()=>{writes++;return {error:null}}})};
 for(const code of ['NA-101','COMP-101'])assert.equal((await sandbox.window.PlutonCourseProgress.save(client,code,0,true,'student-a',12)).ok,true);
 assert.equal((await sandbox.window.PlutonCourseProgress.save(client,'NA-101',0,true,'student-b',12)).ok,false);
 assert.equal((await sandbox.window.PlutonCourseProgress.save(client,'ID-101',0,true,'student-a',12)).ok,false);
 assert.equal(writes,2);
});
test('temporary auth network failure keeps account owner and local progress',async()=>{
 const source=fs.readFileSync('b70/aula.js','utf8'),start=source.indexOf('async function sync(){'),end=source.indexOf("$('complete').onclick",start);
 const sandbox={window:{},client:{auth:{getUser:async()=>({data:{user:null},error:{message:'Network unavailable'}})}},generation:0,owner:'student-a',completed:[0],pending:[1],course:{lessons:[{},{}]},status(){},switchOwner(){sandbox.owner='guest'},write(){},progress(){}};
 vm.runInNewContext(source.slice(start,end)+';window.runSync=sync',sandbox);
 await sandbox.window.runSync();assert.equal(sandbox.owner,'student-a');assert.deepEqual(sandbox.completed,[0]);assert.deepEqual(sandbox.pending,[1]);
});
