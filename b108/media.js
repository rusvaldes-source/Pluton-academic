/* B108: original files, private Storage reads, five-minute signed playback. */
(()=>{'use strict';
const storageOrigin='https://paifjzznyiehwidoqjqb.supabase.co';
const samples=new Set(['ID001-01-01-es.mp3','ID001-01-01-en.mp3','ID001-01-02-es.mp3','ID001-01-02-en.mp3','ID001-01-03-es.mp3','ID001-01-03-en.mp3','ID001-08-01-es.mp3','ID001-08-01-en.mp3','ID001-08-01-es-apoyo.mp3','ID001-08-02-es.mp3','ID001-08-02-en.mp3','ID001-08-02-es-apoyo.mp3','ID001-08-03-es.mp3','ID001-08-03-es-apoyo.mp3']);
const bucketCourses={'pa203-videos':'PA-203','id101-videos':'ID-101','mkt201-videos':'MKT-201'};
let client=null,epoch=0;const playing=new Set(),runs=new WeakMap();
const tr=(es,en)=>document.documentElement.lang==='en'?en:es;
function clear(el){if(el.hasAttribute('src')){try{el.pause()}catch{}el.removeAttribute('src');try{el.load()}catch{}}}
function getClient(){if(!client){if(!window.supabase)throw Error('client');client=window.supabase.createClient(storageOrigin,'sb_publishable_-Ip2JRpDGn-Ehx2C94Tk3Q_jg7p7VLz');client.auth.onAuthStateChange((event,session)=>{for(const item of playing){if(!item.el.isConnected){playing.delete(item);continue}if(event==='SIGNED_OUT'||item.owner!==session?.user?.id){epoch++;clear(item.el);playing.delete(item)}}});}return client;}
function target(raw,code){
 const u=new URL(raw,location.href);if(u.search||u.hash||u.username||u.password)throw Error('path');
 if(code==='ID-001'&&u.origin===location.origin&&u.pathname.startsWith('/ingles-desde-cero/audios/')){
  const filename=decodeURIComponent(u.pathname.slice('/ingles-desde-cero/audios/'.length));
  if(!/^[A-Za-z0-9_-]+\.mp3$/.test(filename))throw Error('audio');
  if(samples.has(filename))return {public:u.href};
  if(!/^B102_ID001-\d{2}-\d{2}-(?:es_Adays|en_Ruslan)\.mp3$/.test(filename))throw Error('audio');
  return {bucket:'b108-course-media',path:'ID-001/'+filename};
 }
 const prefix='/storage/v1/object/public/';
 if(u.origin!==storageOrigin||!u.pathname.startsWith(prefix))throw Error('origin');
 const parts=u.pathname.slice(prefix.length).split('/').map(decodeURIComponent),bucket=parts.shift(),path=parts.join('/');
 if(!path||parts.some(x=>!x||x==='.'||x==='..'||x.includes('\\')||x.includes('/')))throw Error('path');
 const mapped=bucketCourses[bucket]||(bucket==='lesson-videos-b80'&&['NA-101','COMP-101'].includes(parts[0])?parts[0]:null);
 // PA-101 includes the existing nursing library as explicitly labelled support.
 // Storage RLS independently checks the purchase and the published support list.
 if(mapped!==code&&!(code==='PA-101'&&mapped==='NA-101'&&bucket==='lesson-videos-b80'))throw Error('course');return {bucket,path};
}
async function bind(el,raw,code){
 const run={};runs.set(el,run);clear(el);const started=epoch;
 try{
  const dest=target(raw,code);if(dest.public){el.src=dest.public;return true}
  const sb=getClient(),first=await sb.auth.getUser();if(first.error||!first.data?.user)throw Error('auth');const owner=first.data.user.id;
  const result=await sb.storage.from(dest.bucket).createSignedUrl(dest.path,300);
  if(result.error||!result.data?.signedUrl)throw Error('media');
  const current=await sb.auth.getUser();if(current.error||current.data?.user?.id!==owner||started!==epoch||runs.get(el)!==run)throw Error('account');
  const signed=new URL(result.data.signedUrl),expected='/storage/v1/object/sign/'+dest.bucket+'/'+dest.path;
  if(signed.origin!==storageOrigin||decodeURIComponent(signed.pathname)!==expected||!signed.searchParams.get('token'))throw Error('signed URL');
  el.src=signed.href;if(el instanceof HTMLMediaElement){el.preload='metadata';try{el.load()}catch{}}for(const item of playing)if(!item.el.isConnected||item.el===el)playing.delete(item);playing.add({el,owner});return true;
 }catch{if(runs.get(el)===run)clear(el);return false;}
}
function attach(el,raw,code){
 if(el.dataset.plutonMediaAttached)return;el.dataset.plutonMediaAttached='1';
 el.controls=true;el.preload='metadata';
 function start(){
  if(!el.isConnected){const observer=new MutationObserver(()=>{if(el.isConnected){observer.disconnect();start()}});observer.observe(document.documentElement,{subtree:true,childList:true});return}
  const button=document.createElement('button'),status=document.createElement('span');button.type='button';button.textContent=tr('Renovar audio o video','Refresh audio or video');status.setAttribute('role','status');el.after(button,status);
  let validUntil=0,loading=null,authorized=false;
  async function load(){
   if(loading)return loading;
   loading=(async()=>{button.disabled=true;status.textContent=tr('Comprobando acceso…','Checking access…');try{
    const ok=await bind(el,raw,code);authorized=ok;validUntil=ok?Date.now()+240000:0;
    status.textContent=ok?tr('Audio o video listo.','Audio or video ready.'):tr('No disponible. Comprueba tu acceso y reintenta.','Unavailable. Check access and retry.');
    return ok;
   }finally{button.disabled=false;loading=null}})();return loading;
  }
  button.addEventListener('click',()=>{void load()});
  el.addEventListener('play',()=>{if(authorized&&Date.now()>validUntil){try{el.pause()}catch{}status.textContent=tr('Renovando acceso. Pulsa Play nuevamente.','Refreshing access. Press Play again.');void load();}});
  el.addEventListener('error',()=>{validUntil=0;status.textContent=tr('Reintenta cargar el recurso.','Try refreshing the media.');});
  void load();
 }
 queueMicrotask(start);
}
window.PlutonPrivateMedia={bind,attach};
})();
