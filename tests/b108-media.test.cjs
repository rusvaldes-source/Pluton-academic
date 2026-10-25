const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),{JSDOM}=require('jsdom');
const origin='https://paifjzznyiehwidoqjqb.supabase.co';
const raw=origin+'/storage/v1/object/public/id101-videos/ID-101_Leccion_01.mp4';
function setup({userId='buyer',denied=false,switchDuringSign=false,evil=false}={}){
 const w=new JSDOM('<main><video></video><audio></audio></main>',{url:'https://www.plutonacademic.com/b67/id101/',runScripts:'outside-only'}).window;
 w.HTMLMediaElement.prototype.pause=()=>{};w.HTMLMediaElement.prototype.load=()=>{};
 let user=userId?{id:userId}:null,listener;const calls=[];
 const client={
  auth:{getUser:async()=>({data:{user}}),onAuthStateChange(fn){listener=fn;return {data:{subscription:{unsubscribe(){}}}}}},
  storage:{from(bucket){return {createSignedUrl:async(path,expires)=>{
   calls.push({bucket,path,expires});if(switchDuringSign)user={id:'other'};
   return denied?{error:{message:'denied'}}:{data:{signedUrl:(evil?'https://evil.test':origin)+'/storage/v1/object/sign/'+bucket+'/'+path+'?token=short'}};
  }}}}
 };
 w.supabase={createClient:()=>client};
 if(fs.existsSync('b108/media.js'))w.eval(fs.readFileSync('b108/media.js','utf8'));
 return {w,calls,client,api:w.PlutonPrivateMedia,logout(){user=null;listener?.('SIGNED_OUT',null)}};
}
test('private media helper exists',()=>{const s=setup();assert.ok(s.api,'private media helper must be available');s.w.close()});
test('buyers get a short signed URL for the matching course instead of a public URL',async()=>{const s=setup();assert.ok(s.api);const v=s.w.document.querySelector('video');assert.equal(await s.api.bind(v,raw,'ID-101'),true);assert.deepEqual(s.calls,[{bucket:'id101-videos',path:'ID-101_Leccion_01.mp4',expires:300}]);assert.match(v.src,/\/object\/sign\/id101-videos\//);s.w.close()});
test('anonymous, denied, mismatched course and foreign hosts fail closed',async()=>{for(const options of [{userId:null},{denied:true}]){const s=setup(options);assert.ok(s.api);const v=s.w.document.querySelector('video');assert.equal(await s.api.bind(v,raw,'ID-101'),false);assert.equal(v.hasAttribute('src'),false);s.w.close()}
for(const [src,code] of [[raw,'MKT-201'],['https://evil.test/a.mp4','ID-101'],[origin+'/storage/v1/object/public/lesson-videos-b80/NA-101/L01/a.mp4','COMP-101']]){const s=setup();assert.ok(s.api);assert.equal(await s.api.bind(s.w.document.querySelector('video'),src,code),false);assert.equal(s.calls.length,0);s.w.close()}});
test('account changes during signing and a foreign signed URL are discarded',async()=>{for(const options of [{switchDuringSign:true},{evil:true}]){const s=setup(options);assert.ok(s.api);const v=s.w.document.querySelector('video');assert.equal(await s.api.bind(v,raw,'ID-101'),false);assert.equal(v.hasAttribute('src'),false);s.w.close()}});
test('logout clears already issued media on the page',async()=>{const s=setup();assert.ok(s.api);s.w.HTMLMediaElement.prototype.pause=()=>{};s.w.HTMLMediaElement.prototype.load=()=>{};const v=s.w.document.querySelector('video');await s.api.bind(v,raw,'ID-101');s.logout();assert.equal(v.hasAttribute('src'),false);s.w.close()});
test('only the fourteen approved sample audios stay public; other English audio uses private storage',async()=>{const s=setup({userId:null});assert.ok(s.api);const a=s.w.document.querySelector('audio');assert.equal(await s.api.bind(a,'/ingles-desde-cero/audios/ID001-01-01-es.mp3','ID-001'),true);assert.match(a.src,/\/ingles-desde-cero\/audios\/ID001-01-01-es.mp3$/);assert.equal(s.calls.length,0);assert.equal(await s.api.bind(a,'/ingles-desde-cero/audios/B102_ID001-02-01-es_Adays.mp3','ID-001'),false);assert.equal(a.hasAttribute('src'),false);s.w.close();
const b=setup();assert.ok(b.api);assert.equal(await b.api.bind(b.w.document.querySelector('audio'),'/ingles-desde-cero/audios/B102_ID001-02-01-es_Adays.mp3','ID-001'),true);assert.equal(b.calls[0].bucket,'b108-course-media');assert.equal(b.calls[0].path,'ID-001/B102_ID001-02-01-es_Adays.mp3');b.w.close()});
