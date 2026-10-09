/* B18: local-only resume of last opened lesson. Does not change academic progress. */
(()=>{'use strict';
const KEY='pluton-last-lesson-b18';
const isEnglish=()=>window.plutonLanguage?.current()==='en';
const validCode=code=>typeof code==='string'&&/^[A-Z0-9-]{2,30}$/.test(code);
let catalog=[];
function read(){try{const v=JSON.parse(localStorage.getItem(KEY)||'null');return v&&validCode(v.code)&&Number.isInteger(v.lesson)&&v.lesson>=0&&v.lesson<100?v:null}catch{return null}}
function store(code,lesson){try{localStorage.setItem(KEY,JSON.stringify({code,lesson}));}catch{}update()}
function update(){const area=document.getElementById('pa-resume');if(!area)return;const record=read();const course=catalog.find(c=>c.code===record?.code);const lesson=course?.lessons?.[record.lesson];if(!lesson){area.hidden=true;return}const lang=isEnglish()?'en':'es';area.hidden=false;area.querySelector('h2').textContent=lang==='en'?'Continue where you left off':'Continúa donde lo dejaste';area.querySelector('p').textContent=(course[lang]||course.es)+' · '+(lesson[lang]||lesson.es);const a=area.querySelector('a');a.href='courses.html?course='+encodeURIComponent(record.code)+'&lesson='+record.lesson;a.textContent=lang==='en'?'Resume lesson →':'Retomar lección →';}
function mount(){const courses=document.getElementById('courseList');const dashboard=document.querySelector('.student-dashboard');const target=courses?.parentElement||dashboard;if(!target)return;const area=document.createElement('section');area.id='pa-resume';area.className='pa-resume';area.hidden=true;const title=document.createElement('h2'),detail=document.createElement('p'),link=document.createElement('a');link.className='pa-link';area.append(title,detail,link);if(courses){target.insertBefore(area,document.getElementById('notesLibrary')||courses)}else{const next=document.querySelector('.pa-next-step');if(next)next.before(area);else dashboard.append(area)}
if(courses){courses.addEventListener('toggle',e=>{const detail=e.target;if(!detail.matches?.('details.pa-lesson')||!detail.open)return;const card=detail.closest('.pa-course-card');const code=card?.id?.replace(/^course-/,'');if(!validCode(code))return;const lesson=Array.prototype.indexOf.call(card.querySelectorAll('details.pa-lesson'),detail);if(lesson>=0)store(code,lesson)},true)}
fetch('catalog.json').then(r=>{if(!r.ok)throw Error('catalog');return r.json()}).then(data=>{if(Array.isArray(data))catalog=data.filter(c=>validCode(c?.code)&&Array.isArray(c.lessons));update()}).catch(()=>{area.hidden=true});
document.getElementById('languageToggle')?.addEventListener('click',()=>queueMicrotask(update));window.addEventListener('storage',e=>{if(e.key===KEY)update()});}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mount);else mount();
})();
