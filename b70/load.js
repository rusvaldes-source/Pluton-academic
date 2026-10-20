/* New courses: authorization is enforced by PostgreSQL RLS, not this UI. */
(async()=>{'use strict';
 const box=document.getElementById('access'),shell=document.getElementById('classroom'),code=document.body.dataset.course;
 function message(es,en,login=false){box.replaceChildren();const p=document.createElement('p');p.textContent=es+' / '+en;box.append(p);if(login){const a=document.createElement('a');a.href='../../index.html?course='+encodeURIComponent(code)+'&login=1';a.textContent='Iniciar sesión / Sign in';box.append(a)}const retry=document.createElement('button');retry.type='button';retry.textContent='Reintentar / Retry';retry.onclick=()=>location.reload();box.append(retry)}
 try{
  if(!window.supabase)throw Error('connection');
  const client=window.supabase.createClient('https://paifjzznyiehwidoqjqb.supabase.co','sb_publishable_-Ip2JRpDGn-Ehx2C94Tk3Q_jg7p7VLz');
  const {data:{user},error}=await client.auth.getUser();
  if(error||!user){message('Inicia sesión en PLUTÓN ACADEMIC para estudiar este curso. Después regresa a esta página.','Sign in to PLUTÓN ACADEMIC to study this course, then return here.',true);return}
  const subscription=client.auth.onAuthStateChange((_event,session)=>{if((session?.user?.id||null)!==user.id){shell.hidden=true;shell.replaceChildren();window.PlutonCourseData=null;location.reload()}});
  const {data,error:readError}=await client.from('course_learning_content').select('payload').eq('course_code',code).eq('published',true).single();
  const {data:{user:current}}=await client.auth.getUser();
  if(!current||current.id!==user.id){subscription.data.subscription.unsubscribe();message('La sesión cambió. Vuelve a entrar.','The session changed. Sign in again.',true);return}
  if(readError||!data?.payload||data.payload.code!==code)throw Error('content');
  window.PlutonCourseClient=client;window.PlutonCourseData=data.payload;window.PlutonCourseUserId=user.id;
  const script=document.createElement('script');script.src='../../b70/aula.js?v=b84';script.onerror=()=>message('No se pudo abrir el curso. Reintenta.','Could not open the course. Please retry.');document.body.append(script);
 }catch{message('No se pudo cargar el curso. Comprueba tu conexión y reintenta.','Could not load the course. Check your connection and retry.')}
})();
