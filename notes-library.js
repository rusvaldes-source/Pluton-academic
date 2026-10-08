/* V11: índice local de notas; exportación voluntaria, sin enviar datos a servidores. */
(()=>{'use strict';
const panel=document.getElementById('notesLibrary'),items=document.getElementById('notesLibraryItems');
if(!panel||!items)return;
const en=()=>window.plutonLanguage?.current()==='en';
let catalog=[];
function entries(){const result=[];for(const course of catalog){for(let i=0;i<course.lessons.length;i++){let note='';try{note=localStorage.getItem('pluton-v10-note-'+course.code+'-'+i)||''}catch(e){}if(note.trim())result.push({course,index:i,note,lesson:course.lessons[i]});}}return result;}
function draw(){const lang=en()?'en':'es',notes=entries();panel.hidden=false;
document.getElementById('notesLibraryTitle').textContent=en()?'My study notebook':'Mi cuaderno de estudio';
document.getElementById('notesLibraryCount').textContent=en()?`${notes.length} saved lesson notes on this device`:`${notes.length} notas de lecciones guardadas en este dispositivo`;
document.getElementById('notesLibraryExport').textContent=en()?'Export my notes (.txt)':'Exportar mis notas (.txt)';
items.replaceChildren();for(const entry of notes){const article=document.createElement('article');article.className='pa-note-entry';const h=document.createElement('h3');h.textContent=entry.course[lang]+' · '+entry.lesson[lang];const p=document.createElement('p');p.textContent=entry.note.length>180?entry.note.slice(0,180)+'…':entry.note;const b=document.createElement('button');b.type='button';b.textContent=en()?'Open lesson':'Abrir lección';b.addEventListener('click',()=>{const search=document.getElementById('lessonSearch');if(search&&search.value){search.value='';search.dispatchEvent(new Event('input',{bubbles:true}));}const card=document.getElementById('course-'+entry.course.code);const lesson=card?.querySelectorAll('details.pa-lesson')[entry.index];if(lesson){lesson.open=true;lesson.scrollIntoView({behavior:'smooth',block:'start'});}});article.append(h,p,b);items.append(article);}}
document.getElementById('notesLibraryExport').addEventListener('click',()=>{const notes=entries();const status=document.getElementById('notesLibraryMessage');if(!notes.length){status.textContent=en()?'No notes to export.':'No hay notas para exportar.';return;}const lang=en()?'en':'es';const content='PLUTÓN ACADEMIC — '+(en()?'My study notes':'Mis apuntes')+'\n\n'+notes.map(x=>x.course[lang]+' ('+x.course.code+')\n'+x.lesson[lang]+'\n'+x.note).join('\n\n--------------------\n\n');const blob=new Blob([content],{type:'text/plain;charset=utf-8'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='PLUTON_ACADEMIC_MIS_NOTAS.txt';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),2000);status.textContent=en()?'Export started.':'Exportación iniciada.';});
document.addEventListener('click',e=>{if(e.target.closest('.pa-notes-save'))setTimeout(draw,0);});
document.getElementById('languageToggle')?.addEventListener('click',()=>setTimeout(draw,0));
fetch('catalog.json').then(r=>{if(!r.ok)throw Error('catalog');return r.json()}).then(data=>{catalog=data;draw()}).catch(()=>{panel.hidden=true;});
})();