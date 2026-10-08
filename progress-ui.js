/* V6: Progress from completed lessons on this device. No fake demo figures or account-sync claims. */
(()=>{'use strict';
const lang=()=>localStorage.getItem('pluton-lang')==='en'?'en':'es';
const t=(es,en)=>lang()==='en'?en:es;
function completed(course){let list=[];try{const raw=JSON.parse(localStorage.getItem('pluton-completed-'+course.code)||'[]');if(Array.isArray(raw))list=raw}catch(e){}return new Set(list.filter(i=>Number.isInteger(i)&&i>=0&&i<course.lessons.length)).size;}
function calculate(courses){const total=courses.reduce((n,c)=>n+c.lessons.length,0),done=courses.reduce((n,c)=>n+completed(c),0);return {total,done,percent:total?Math.round(done/total*100):0};}
function element(tag,className,text){const el=document.createElement(tag);if(className)el.className=className;if(text!==undefined)el.textContent=text;return el;}
let catalog=[];
function render(){const number=document.getElementById('liveProgressNumber');if(!number||!catalog.length)return;const p=calculate(catalog);
 document.getElementById('liveGreeting').textContent=t('Mi aprendizaje','My learning');
 document.getElementById('liveProgressScope').textContent=window.plutonSync?.statusText()||t('En este dispositivo','On this device');
 document.getElementById('liveProgressLabel').textContent=t('PROGRESO REAL DE LECCIONES','ACTUAL LESSON PROGRESS');
 number.textContent=p.percent+'%';const bar=document.getElementById('liveProgressBar');bar.style.width=p.percent+'%';bar.parentElement.setAttribute('aria-valuenow',String(p.percent));
 document.getElementById('liveProgressDetail').textContent=t(`${p.done} de ${p.total} lecciones completadas. ${window.plutonSync?.statusText()||'Guardado en este navegador.'}`,`${p.done} of ${p.total} lessons completed. ${window.plutonSync?.statusText()||'Saved in this browser.'}`);
 const list=document.getElementById('liveCourseList');list.replaceChildren();const active=catalog.filter(c=>completed(c)>0).sort((a,b)=>completed(b)-completed(a)).slice(0,3);
 if(!active.length){list.appendChild(element('p','pa-note',t('Aún no has completado lecciones. Comienza un curso para ver aquí tu progreso.','No lessons completed yet. Start a course to see your progress here.')));return;}
 active.forEach(c=>{const done=completed(c),row=element('div','lesson pa-live-course');const a=element('a','',c[lang()]||c.es);a.href='courses.html?course='+encodeURIComponent(c.code);const stat=element('span','',Math.round(done/c.lessons.length*100)+'% · '+done+'/'+c.lessons.length);row.append(a,stat);list.appendChild(row)});
}
fetch('catalog.json?v=20261008-v6-real').then(r=>{if(!r.ok)throw Error('Catalog unavailable');return r.json()}).then(data=>{if(!Array.isArray(data))throw Error('Invalid catalog');catalog=data.filter(c=>c&&c.code&&Array.isArray(c.lessons)&&c.lessons.length);render()}).catch(()=>{const e=document.getElementById('liveProgressDetail');if(e)e.textContent=t('No se pudo cargar el progreso.','Could not load progress.');});
document.addEventListener('visibilitychange',()=>{if(!document.hidden)render()});window.addEventListener('pageshow',render);window.addEventListener('storage',render);document.addEventListener('pluton-progress-updated',render);document.addEventListener('pluton-sync-status',render);
const toggle=document.getElementById('languageToggle');if(toggle)toggle.addEventListener('click',()=>queueMicrotask(render));
})();
