/* B93: content authorization is enforced by database RLS, never by this UI. */
(()=>{'use strict';
const button=document.getElementById('load-course'),status=document.getElementById('access-status');
if(!button||!status)return;
const data=window.PREVIEW_DATA, samples=data.items, originalNotice=data.notice;
let generation=0,owner=null,state='ready';
const messages={es:{ready:'El curso completo requiere acceso independiente. Los pagos todavía no están habilitados.',loading:'Comprobando el acceso de tu cuenta…',login:'Inicia sesión para comprobar tu acceso.',denied:'Tu cuenta aún no tiene habilitado este curso. Las seis muestras siguen disponibles.',error:'No se pudo comprobar el acceso. Inténtalo de nuevo; puedes seguir con las muestras.',open:'Las 30 lecciones están disponibles para tu cuenta. Los audios adicionales siguen pendientes.',button:'Abrir mi curso completo',link:'Ir a inicio e iniciar sesión'},en:{ready:'The full course requires separate access. Payments are not enabled yet.',loading:'Checking your account access…',login:'Sign in to check access.',denied:'This course is not enabled for your account yet. The six samples remain available.',error:'Access could not be checked. Please try again; the samples remain available.',open:'All 30 lessons are available for your account. Additional audio is still pending.',button:'Open my full course',link:'Go to home and sign in'}};
function render(){const s=messages[document.documentElement.lang==='en'?'en':'es'];button.textContent=s.button;status.textContent=s[state];if(state==='login'){const a=document.createElement('a');a.href='/index.html';a.textContent=s.link;status.append(' ',a);}}
function reset(){generation++;owner=null;data.items=samples;data.notice=originalNotice;state='ready';button.disabled=false;if(typeof catalog==='function')catalog();if(typeof chrome==='function')chrome();render();}
if(!window.supabase){state='error';button.disabled=true;render();return;}
const client=window.supabase.createClient('https://paifjzznyiehwidoqjqb.supabase.co','sb_publishable_-Ip2JRpDGn-Ehx2C94Tk3Q_jg7p7VLz');
client.auth.onAuthStateChange((event,session)=>{if(event==='SIGNED_OUT'||(owner&&session?.user?.id!==owner))reset();});
button.addEventListener('click',async()=>{const run=++generation;button.disabled=true;state='loading';render();try{
 const first=await client.auth.getUser();if(run!==generation)return;const user=first.data?.user;if(!user&&(!first.error||first.error.name==='AuthSessionMissingError')){state='login';return;}if(first.error)throw Error('auth');if(!user){state='login';return;}owner=user.id;
 const result=await client.from('course_premium_content').select('payload').eq('course_code','ID-001').maybeSingle();
 const current=await client.auth.getUser();if(run!==generation)return;if(current.error||current.data?.user?.id!==owner){reset();return;}if(result.error)throw Error('content');
 if(!result.data){state='denied';return;}const payload=result.data.payload;if(!payload||!Array.isArray(payload.items)||payload.items.length!==30)throw Error('invalid course');
 data.items=payload.items;data.notice={es:'Curso de 30 lecciones: textos, ejemplos, práctica y 150 preguntas. Los audios adicionales siguen pendientes. No hay cobros activos.',en:'30-lesson course: texts, examples, practice and 150 questions. Additional audio is still pending. No payments are active.'};
 state='open';chrome();catalog();
 }catch{if(run===generation)state='error';}finally{if(run===generation){button.disabled=false;render();}}});
new MutationObserver(render).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});render();
})();
