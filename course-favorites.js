/* B17: favoritos de cursos en este dispositivo; sin alterar progreso ni autenticación. */
(()=>{'use strict';
const KEY='pluton-favorite-courses-b17';
const en=()=>window.plutonLanguage?.current()==='en';
const get=()=>{try{const a=JSON.parse(localStorage.getItem(KEY)||'[]');return Array.isArray(a)?a.filter(x=>typeof x==='string'&&/^[A-Z0-9-]{2,30}$/.test(x)):[]}catch{return []}};
const save=a=>{try{localStorage.setItem(KEY,JSON.stringify(a));return true}catch{return false}};
const host=document.getElementById('courseList');if(!host)return;
const panel=document.createElement('section');panel.className='pa-favorites';panel.setAttribute('aria-label','Cursos favoritos');
const heading=document.createElement('h2'),hint=document.createElement('p'),items=document.createElement('div'),status=document.createElement('p');status.setAttribute('role','status');items.className='pa-favorites-links';panel.append(heading,hint,items,status);host.before(panel);
function refresh(){const fav=get();heading.textContent=en()?'My favorite courses':'Mis cursos favoritos';hint.textContent=en()?'Save courses for quick access on this device.':'Guarda cursos para acceder rápidamente desde este dispositivo.';items.replaceChildren();
 for(const code of fav){const card=document.getElementById('course-'+code);if(!card)continue;const link=document.createElement('a');link.href='courses.html?course='+encodeURIComponent(code);link.textContent=card.querySelector('h2')?.textContent+' · '+code;items.append(link)}
 if(!items.children.length){const p=document.createElement('p');p.textContent=en()?'No favorites yet. Choose a course below.':'Aún no tienes favoritos. Elige un curso abajo.';items.append(p)}
 host.querySelectorAll('.pa-course-card').forEach(card=>{const code=card.id.slice('course-'.length);if(!/^[A-Z0-9-]{2,30}$/.test(code))return;let btn=card.querySelector('.pa-favorite-toggle');if(!btn){btn=document.createElement('button');btn.type='button';btn.className='pa-favorite-toggle';btn.dataset.code=code;card.querySelector('small')?.after(btn)}const selected=fav.includes(code);btn.setAttribute('aria-pressed',String(selected));btn.textContent=selected?(en()?'★ Saved':'★ Guardado'):(en()?'☆ Save course':'☆ Guardar curso')});
}
host.addEventListener('click',e=>{const b=e.target.closest('.pa-favorite-toggle');if(!b)return;const code=b.dataset.code;const fav=get();const next=fav.includes(code)?fav.filter(x=>x!==code):[...fav,code];if(!save(next)){status.textContent=en()?'Storage is unavailable.':'No se puede guardar en este dispositivo.';return}status.textContent='';refresh()});
const observer=new MutationObserver(()=>{observer.disconnect();refresh();observer.observe(host,{childList:true})});observer.observe(host,{childList:true});
document.getElementById('languageToggle')?.addEventListener('click',()=>setTimeout(refresh,0));
refresh();
})();
