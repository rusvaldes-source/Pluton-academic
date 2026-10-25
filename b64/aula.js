/* B108: public library contains course metadata; full materials stay in the authorized classroom. */
(async()=>{'use strict';
const $=id=>document.getElementById(id),response=await fetch('catalog.json');if(!response.ok)throw Error('catalog');
const courses=await response.json(),course=$('course'),kind=$('kind'),entries=$('entries'),reading=$('reading');
const en=()=>document.documentElement.lang==='en';
for(const c of courses){if(c.classroom)course.add(new Option(c.code+' · '+(c.lessons||[]).length+' · '+c[en()?'en':'es'],c.code));}
function render(){const c=courses.find(x=>x.code===course.value);entries.replaceChildren();reading.replaceChildren();if(!c?.classroom)return;
 const title=document.createElement('h2');title.textContent=c[en()?'en':'es'];const note=document.createElement('p');note.textContent=en()?'Open your course to study its lessons, workbooks and assessments. Access requires the corresponding purchase.':'Abre tu curso para estudiar sus lecciones, cuadernos y evaluaciones. El acceso requiere la compra correspondiente.';
 const link=document.createElement('a');const url=new URL(c.classroom,location.href);url.searchParams.set('lang',en()?'en':'es');const q=new URLSearchParams(location.search);if(/^\d+$/.test(q.get('lesson')||'')&&+q.get('lesson')<(c.lessons||[]).length)url.searchParams.set('lesson',q.get('lesson'));link.href=url.pathname+url.search;link.className='pa-quiz-button';link.textContent=en()?'Open my course':'Abrir mi curso';reading.append(title,note,link);
}
const query=new URLSearchParams(location.search);if(courses.some(c=>c.code===query.get('course')))course.value=query.get('course');
course.onchange=()=>{const url=new URL(location.href);url.searchParams.set('course',course.value);url.searchParams.delete('lesson');history.replaceState(null,'',url);render()};if(kind)kind.onchange=render;document.addEventListener('pluton-aula-language',render);render();
})().catch(()=>{document.getElementById('reading').textContent='No se pudo cargar el catálogo. / Could not load the catalog.'});
