/* V10: notas personales por lección; almacenamiento local, sin modificar progreso ni Supabase. */
(()=>{'use strict';
const key=(code,index)=>'pluton-v10-note-'+code+'-'+index;
const isEn=()=>window.plutonLanguage?.current()==='en';
function hydrate(root=document){root.querySelectorAll('.pa-personal-notes').forEach(section=>{const field=section.querySelector('textarea');if(!field)return;const k=key(section.dataset.code,section.dataset.lesson);try{field.value=localStorage.getItem(k)||''}catch(e){section.querySelector('.pa-notes-status').textContent=isEn()?'Storage unavailable':'Almacenamiento no disponible';}})}
document.addEventListener('click',event=>{const button=event.target.closest('.pa-notes-save');if(!button)return;const section=button.closest('.pa-personal-notes');if(!section)return;const field=section.querySelector('textarea');const status=section.querySelector('.pa-notes-status');try{localStorage.setItem(key(section.dataset.code,section.dataset.lesson),field.value);status.textContent=isEn()?'Saved on this device ✓':'Guardado en este dispositivo ✓';}catch(e){status.textContent=isEn()?'Could not save notes':'No se pudieron guardar las notas';}});
const list=document.getElementById('courseList');if(list){const observer=new MutationObserver(()=>hydrate(list));observer.observe(list,{childList:true});hydrate(list);}
})();
