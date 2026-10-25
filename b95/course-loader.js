/* Published content only. Source-table RLS requires the corresponding purchase. */
(()=>{'use strict';window.PlutonPublishedContent={async load(code,client){
 if(!client){if(!window.supabase)throw Error('Course client unavailable');client=window.supabase.createClient('https://paifjzznyiehwidoqjqb.supabase.co','sb_publishable_-Ip2JRpDGn-Ehx2C94Tk3Q_jg7p7VLz');}
 const first=await client.auth.getUser();const owner=first.data?.user?.id;
 if(first.error||!owner)throw Error('Sign in to open your course / Inicia sesión para abrir tu curso');
 let changed=false;
 const subscription=client.auth.onAuthStateChange((_event,session)=>{if(session?.user?.id!==owner){changed=true;for(const el of document.querySelectorAll('audio,video')){try{el.pause()}catch{}el.removeAttribute('src')};document.body.replaceChildren();const message=document.createElement('p');message.textContent='La sesión cambió. Vuelve a abrir tu curso. / Session changed. Reopen your course.';document.body.append(message);}});
 try{
  const {data,error}=await client.rpc('b95_course_published',{p_course_code:code});
  const current=await client.auth.getUser();
  if(changed||current.error||current.data?.user?.id!==owner)throw Error('Account changed');
  if(error||!data?.payload||data.revision===undefined||data.payload.code!==code)throw Error('Published course unavailable');
  const payload=data.payload;Object.defineProperty(payload,'_publishedRevision',{value:String(data.revision),enumerable:false});return payload;
 }catch(error){subscription.data?.subscription?.unsubscribe();throw error;}
}};})();
