/* PLUTÓN V9 — herramientas de estudio locales, sin afectar cuestionarios ni progreso */
(()=>{'use strict';
const lang=()=>window.plutonLanguage?.current()==='en'?'en':'es';
const msg=(es,en)=>lang()==='en'?en:es;
let currentSpeech=null;
function stop(){if('speechSynthesis' in window){window.speechSynthesis.cancel();currentSpeech=null;}}
function getLesson(button){const code=button.dataset.code,idx=Number(button.dataset.lesson);const card=button.closest('.pa-lesson');return {code,idx,card,content:card?.querySelector(':scope > p')?.textContent||'',question:card?.querySelector('strong')?.textContent||''};}
function printLesson(button){
  const lesson=button.closest('.pa-lesson');if(!lesson)return;
  const card=button.closest('.pa-course-card');
  const title=card?.querySelector('h2')?.textContent||'PLUTÓN ACADEMIC';
  const code=card?.querySelector('small')?.textContent||'';
  const name=(lesson.querySelector('summary')?.textContent||'').replace(/\s*✓\s*$/,'').trim();
  const content=lesson.querySelector(':scope > p')?.textContent||'';
  const question=lesson.querySelector('strong')?.textContent||'';
  const escape=s=>String(s).replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  const w=window.open('','_blank');
  if(!w){alert(msg('Permite ventanas emergentes para imprimir.','Allow pop-ups to print.'));return;}
  const t={course:msg('CURSO','COURSE'),lesson:msg('LECCIÓN','LESSON'),objective:msg('CONTENIDO DE ESTUDIO','STUDY CONTENT'),review:msg('PREGUNTA DE REPASO','REVIEW QUESTION'),notes:msg('MIS APUNTES','MY NOTES'),footer:msg('Material educativo introductorio · PLUTÓN ACADEMIC','Introductory learning material · PLUTÓN ACADEMIC'),print:msg('Imprimir / Guardar PDF','Print / Save PDF')};
  const html=`<!doctype html><html lang="${lang()}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escape(title)} — ${escape(name)}</title><style>
  :root{color-scheme:light}*{box-sizing:border-box}body{margin:0;background:#edf0f5;color:#14233e;font:16px/1.55 Arial,Helvetica,sans-serif}.sheet{background:white;max-width:800px;min-height:850px;margin:24px auto;padding:46px 54px;box-shadow:0 8px 30px #10213b25}.brand{font-size:22px;font-weight:800;letter-spacing:.04em;color:#0a1932;border-bottom:4px solid #d5aa51;padding-bottom:16px}.eyebrow{color:#946c25;font-size:11px;font-weight:800;letter-spacing:.13em;margin:30px 0 8px;text-transform:uppercase}h1{font-size:29px;line-height:1.2;margin:0 0 8px;color:#0b1c37}h2{font-size:21px;line-height:1.3;margin:0;color:#9c752d}.code{font-size:13px;color:#53637b;margin-top:12px}.section{margin-top:32px;break-inside:avoid}.section-title{font-size:12px;letter-spacing:.09em;font-weight:800;color:#946c25;border-bottom:1px solid #d7dfea;padding-bottom:9px;margin-bottom:14px}.content{font-size:17px;line-height:1.75;white-space:pre-wrap;overflow-wrap:anywhere}.question{font-size:18px;font-weight:700;line-height:1.55;overflow-wrap:anywhere}.writing-line{height:33px;border-bottom:1px solid #dce2eb}.footer{border-top:1px solid #d7dfea;margin-top:38px;padding-top:12px;color:#69778d;font-size:11px}.toolbar{max-width:800px;margin:18px auto 30px;text-align:center}.toolbar button{background:#d9b45f;color:#0a1932;border:0;border-radius:9px;font-size:16px;font-weight:700;padding:14px 26px;cursor:pointer}@page{size:auto;margin:15mm}@media(max-width:600px){.sheet{margin:0;padding:25px 22px;min-height:0;box-shadow:none}.brand{font-size:19px}h1{font-size:25px}.toolbar{padding:0 20px}}@media print{html,body{background:white!important;-webkit-print-color-adjust:exact;print-color-adjust:exact}.sheet{box-shadow:none!important;max-width:none;min-height:0;margin:0;padding:0}.toolbar{display:none!important}.section{break-inside:avoid}.footer{break-inside:avoid}}
  </style></head><body><main class="sheet"><div class="brand">PLUTÓN ACADEMIC</div><div class="eyebrow">${escape(t.course)}</div><h1>${escape(title)}</h1><div class="code">${escape(code)}</div><div class="eyebrow">${escape(t.lesson)}</div><h2>${escape(name)}</h2><section class="section"><div class="section-title">${escape(t.objective)}</div><div class="content">${escape(content)}</div></section><section class="section"><div class="section-title">${escape(t.review)}</div><div class="question">${escape(question)}</div></section><section class="section"><div class="section-title">${escape(t.notes)}</div><div class="writing-line"></div><div class="writing-line"></div><div class="writing-line"></div></section><footer class="footer">${escape(t.footer)}</footer></main><div class="toolbar"><button type="button" onclick="window.print()">${escape(t.print)}</button></div></body></html>`;
  w.document.write(html);w.document.close();
}
document.addEventListener('click',e=>{const button=e.target.closest('.pa-read-aloud,.pa-stop-audio,.pa-flashcard-toggle,.pa-reveal-answer,.pa-print-lesson');if(!button)return;const tools=button.closest('.pa-study-tools');if(!tools)return;const status=tools.querySelector('.pa-study-message');
if(button.matches('.pa-stop-audio')){stop();status.textContent=msg('Lectura detenida.','Reading stopped.');return;}
if(button.matches('.pa-flashcard-toggle')){const card=tools.querySelector('.pa-flashcard');card.hidden=!card.hidden;return;}
if(button.matches('.pa-reveal-answer')){const back=tools.querySelector('.pa-flashcard-back');back.hidden=!back.hidden;button.textContent=back.hidden?msg('Ver respuesta','Reveal answer'):msg('Ocultar respuesta','Hide answer');return;}
if(button.matches('.pa-print-lesson')){printLesson(button);return;}
if(!('speechSynthesis' in window)){status.textContent=msg('Este navegador no admite lectura en voz alta.','Speech is not supported in this browser.');return;}
stop();const data=getLesson(button);const title=data.card?.querySelector('summary')?.textContent||'';const utterance=new SpeechSynthesisUtterance([title,data.content,data.question].join('. '));utterance.lang=lang()==='en'?'en-US':'es-ES';utterance.rate=.9;currentSpeech=utterance;utterance.onend=()=>{status.textContent=msg('Lectura finalizada.','Reading finished.');currentSpeech=null;};utterance.onerror=()=>{status.textContent=msg('No se pudo reproducir el audio.','Audio playback was unavailable.');currentSpeech=null;};status.textContent=msg('Reproduciendo la lección…','Reading lesson…');window.speechSynthesis.speak(utterance);
});
document.addEventListener('visibilitychange',()=>{if(document.hidden)stop();});window.addEventListener('pagehide',stop);
})();
