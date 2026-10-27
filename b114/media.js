/* Dedicated new-course media; never grants access from the browser. */
(()=>{'use strict';let client=null,epoch=0;const attached=new Set(),origin='https://paifjzznyiehwidoqjqb.supabase.co',codes=['FA-101','DRV-101','MED-201'];
function clear(){epoch++;for(const el of attached){try{el.pause()}catch{}el.removeAttribute('src');try{el.load()}catch{}}attached.clear();}
function path(raw,code){if(!codes.includes(code)||typeof raw!=='string'||!new RegExp('^'+code+'/'+code+'-L[0-9]{2}-(es|en)\\.(mp3|mp4)$').test(raw))throw Error('invalid_media');return raw;}
window.PlutonB114Media={use(sb,owner){client=sb;sb.auth.onAuthStateChange((_event,session)=>{if(!owner||session?.user?.id!==owner)clear();});},async attach(el,raw,code){
 const run=epoch;try{
  const mediaPath=path(raw,code);if(!client)throw Error('client');const first=await client.auth.getUser(),owner=first.data?.user?.id;if(first.error||!owner)throw Error('auth');
  const result=await client.storage.from('b114-course-media').createSignedUrl(mediaPath,300);const current=await client.auth.getUser();
  if(result.error||current.error||current.data?.user?.id!==owner||epoch!==run)throw Error('access');
  const signed=new URL(result.data.signedUrl);if(signed.origin!==origin||decodeURIComponent(signed.pathname)!=='/storage/v1/object/sign/b114-course-media/'+mediaPath||!signed.searchParams.get('token'))throw Error('origin');
  el.src=signed.href;el.preload='metadata';attached.add(el);return true;
 }catch{el.removeAttribute('src');return false;}
},clear};window.addEventListener('pagehide',clear);
})();
