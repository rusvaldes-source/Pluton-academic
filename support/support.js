// Public Supabase key only. Never embed service_role credentials.
const $ = id => document.getElementById(id);
let sb = null, lang = 'es';
$('lang').onclick = () => { lang = lang === 'es' ? 'en' : 'es'; document.documentElement.lang = lang; document.querySelectorAll('[data-es][data-en]').forEach(el => { el.textContent = el.dataset[lang]; }); $('lang').textContent = lang === 'es' ? 'EN' : 'ES'; };
async function init(){const cfg=window.PLUTON_ADMIN_CONFIG;if(!cfg?.url||!cfg?.publishableKey){$('resetStatus').textContent='Servicio pendiente de configuración / Service not configured.';return;}try{const {createClient}=await import('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm');sb=createClient(cfg.url,cfg.publishableKey);}catch{$('resetStatus').textContent='Servicio no disponible / Service unavailable.';}}
$('reset').addEventListener('submit',async e=>{e.preventDefault();if(!sb)return;const email=$('resetEmail').value.trim();const {error}=await sb.auth.resetPasswordForEmail(email,{redirectTo:new URL('../index.html',location.href).href});$('resetStatus').textContent=error?'No se pudo procesar la solicitud. Contacta soporte. / Request could not be processed.':'Si existe una cuenta, revisa tu correo. / If an account exists, check your inbox.';});
$('ticket').addEventListener('submit',async e=>{e.preventDefault();if(!sb)return;const {data:{user}}=await sb.auth.getUser();if(!user){$('ticketStatus').textContent='Inicia sesión primero / Sign in first.';return;}const {error}=await sb.from('support_tickets').insert({category:$('category').value,subject:$('subject').value.trim(),body:$('description').value.trim(),user_id:user.id});$('ticketStatus').textContent=error?'No se pudo enviar. El servicio puede estar pendiente de configuración. / Could not submit.':'Solicitud enviada / Ticket submitted.';if(!error)$('ticket').reset();});
init();
const assistantForm=$('assistantForm');
assistantForm.addEventListener('submit',async e=>{
 e.preventDefault();
 const output=$('assistantResponse'),button=$('assistantSend');
 if(!sb){output.textContent=lang==='es'?'El servicio no está configurado.':'Service not configured.';return;}
 const {data:{session},error:sessionError}=await sb.auth.getSession();
 if(sessionError||!session){output.textContent=lang==='es'?'Inicia sesión antes de consultar al asistente.':'Sign in before asking the assistant.';return;}
 button.disabled=true;output.textContent=lang==='es'?'Consultando...':'Checking...';
 try{
  const response=await fetch(window.PLUTON_ADMIN_CONFIG.url+'/functions/v1/pluton-support-ai',{method:'POST',headers:{'Content-Type':'application/json','Authorization':'Bearer '+session.access_token,'apikey':window.PLUTON_ADMIN_CONFIG.publishableKey},body:JSON.stringify({message:$('assistantMessage').value.trim(),lang})});
  const result=await response.json();
  if(!response.ok)throw Error('unavailable');
  output.textContent=result.answer||'';
  if(result.escalate)output.textContent+=' '+(lang==='es'?'Si necesitas más ayuda, envía la solicitud de soporte de arriba.':'For further help, submit the support request above.');
 }catch{output.textContent=lang==='es'?'El asistente no está disponible todavía. Puedes enviar una solicitud de soporte.':'The assistant is not available yet. You can submit a support request.';}
 finally{button.disabled=false;}
});
