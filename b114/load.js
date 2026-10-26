/* B114: existing private content table and purchase RLS; no preview fallback. */
(()=>{'use strict';
const counts=Object.freeze({'FA-101':10,'DRV-101':12,'MED-201':12});
async function load(code,client,onChange=()=>{}){
 if(!Object.hasOwn(counts,code)||!client)throw Error('course_unavailable');
 const first=await client.auth.getUser(),owner=first.data?.user?.id;
 if(first.error||!owner)throw Error('sign_in_required');
 let changed=false;const subscription=client.auth.onAuthStateChange((_event,session)=>{if(session?.user?.id!==owner){changed=true;onChange();}});
 try{
  const result=await client.from('course_learning_content').select('payload,updated_at').eq('course_code',code).eq('published',true).maybeSingle();
  const latest=await client.auth.getUser(),payload=result.data?.payload;
  if(changed||latest.error||latest.data?.user?.id!==owner)throw Error('account_changed');
  if(result.error||!payload||payload.code!==code||!Array.isArray(payload.lessons)||payload.lessons.length!==counts[code]||payload.lessons.some(l=>!l||!l.title||!l.explanation||!l.example||!l.exercise||!Array.isArray(l.quiz)||l.quiz.length!==5||l.quiz.some(q=>!q||!q.question||!Array.isArray(q.options?.es)||!Array.isArray(q.options?.en)||q.options.es.length<2||q.options.es.length!==q.options.en.length||!Number.isInteger(q.answer)||q.answer<0||q.answer>=q.options.es.length)))throw Error('course_unavailable');
  Object.defineProperty(payload,'_publishedRevision',{value:String(result.data.updated_at),enumerable:false});
  return {owner,payload,client,stop:()=>subscription.data?.subscription?.unsubscribe()};
 }catch(error){subscription.data?.subscription?.unsubscribe();throw error;}
}
window.PlutonB114Content=Object.freeze({codes:Object.keys(counts),counts,load});
async function init(){
 const box=document.getElementById('access'),shell=document.getElementById('classroom');
 const code=new URLSearchParams(location.search).get('course');
 function clear(){shell.querySelectorAll('audio,video').forEach(el=>{try{el.pause()}catch{}el.removeAttribute('src');el.querySelectorAll('source').forEach(s=>s.removeAttribute('src'));});shell.replaceChildren();shell.hidden=true;window.PlutonCourseData=null;box.hidden=false;box.textContent='La sesión cambió. Vuelve a abrir el curso. / Session changed. Reopen the course.';}
 try{
  if(!window.supabase)throw Error('client_unavailable');
  const client=window.supabase.createClient('https://paifjzznyiehwidoqjqb.supabase.co','sb_publishable_-Ip2JRpDGn-Ehx2C94Tk3Q_jg7p7VLz');
  const loaded=await load(code,client,clear);
  document.body.dataset.course=code;window.PlutonCourseClient=client;window.PlutonCourseData=loaded.payload;window.PlutonCourseUserId=loaded.owner;
  window.PlutonB114Media.use(client,loaded.owner);
  const script=document.createElement('script');script.src='aula.js';script.onerror=clear;document.body.append(script);
  window.addEventListener('pagehide',clear,{once:true});window.addEventListener('pageshow',e=>{if(e.persisted)location.reload()});
 }catch(error){box.hidden=false;shell.hidden=true;box.textContent=error.message==='sign_in_required'?'Inicia sesión en la portada y regresa al curso. / Sign in on the homepage, then return to this course.':'Curso pendiente de habilitación o sin acceso comprado. / Course not enabled yet or no purchased access.';}
}
if(document.getElementById('classroom'))void init();
})();
