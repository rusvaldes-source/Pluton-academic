(()=>{'use strict';
let questions=[];
const lang=()=>window.plutonLanguage?.current()==='en'?'en':'es';
const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function render(){
 const root=document.getElementById('dailyOptions');
 if(!root||!questions.length)return;
 const day=new Date().toLocaleDateString('en-CA');
 const seed=[...day].reduce((a,c)=>a+c.charCodeAt(0),0);
 const {course,lesson}=questions[seed%questions.length],l=lang(),key='pluton-daily-'+day;
 document.getElementById('dailyTitle').textContent=l==='en'?'Learn something new today':'Aprende algo nuevo hoy';
 document.getElementById('dailyIntro').textContent=l==='en'?'One daily question to practice your knowledge. No account needed.':'Una pregunta diaria para practicar tus conocimientos. Sin necesidad de registrarte.';
 document.getElementById('dailyQuestion').textContent=lesson.question[l]||lesson.question.es;
 const link=document.getElementById('dailyLink');
 link.textContent=l==='en'?'Explore courses →':'Explorar cursos →';
 link.href='index.html#cursos';
 root.innerHTML=(lesson.options[l]||lesson.options.es).map((o,i)=>'<button type="button" class="pa-daily-choice" data-answer="'+i+'">'+esc(o)+'</button>').join('');
 const feedback=document.getElementById('dailyFeedback');
 feedback.textContent='';
 root.querySelectorAll('button').forEach(b=>b.addEventListener('click',()=>{
   const correct=Number(b.dataset.answer)===Number(lesson.answer);
   feedback.textContent=correct?(l==='en'?'Correct! Great job.':'¡Correcto! Buen trabajo.'):(l==='en'?'Try again.':'Inténtalo de nuevo.');
   if(correct){try{localStorage.setItem(key,'done')}catch(e){}root.querySelectorAll('button').forEach(x=>x.disabled=true);}
 }));
 try{if(localStorage.getItem(key)==='done')feedback.textContent=l==='en'?'Today’s challenge completed on this device.':'Reto de hoy completado en este dispositivo.'}catch(e){}
}
document.addEventListener('DOMContentLoaded',()=>{
 fetch('catalog.json').then(r=>{if(!r.ok)throw Error('catalog');return r.json()}).then(data=>{
   questions=data.flatMap(course=>(course.lessons||[]).filter(lesson=>lesson.question?.es&&lesson.question?.en&&Array.isArray(lesson.options?.es)&&Array.isArray(lesson.options?.en)&&lesson.options.es.length>=2&&lesson.options.en.length>=2&&Number.isInteger(lesson.answer)&&lesson.answer>=0&&lesson.answer<lesson.options.es.length&&lesson.answer<lesson.options.en.length).map(lesson=>({course,lesson})));
   if(!questions.length)throw Error('No valid questions');
   render();
 }).catch(()=>{
   // Public fallback: the homepage challenge must not depend on a catalog download.
   questions=[{course:{code:'PA-203'},lesson:{
     question:{es:'¿Cuál es una buena práctica para proteger una cuenta digital?',en:'Which is a good practice for protecting a digital account?'},
     options:{es:['Compartir la contraseña','Activar la verificación en dos pasos','Usar la misma contraseña en todas partes'],en:['Share the password','Enable two-step verification','Reuse the same password everywhere']},
     answer:1
   }}];
   render();
 });
 document.getElementById('languageToggle')?.addEventListener('click',()=>setTimeout(render,0));
});
})();