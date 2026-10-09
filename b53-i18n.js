/* B53 localized additions; follows existing language preference without replacing existing translator. */
(function(){
const items=[
['#communityIdea','placeholder','¿Qué tema te gustaría aprender?','What would you like to learn?'],
['.pa-news-tabs [data-news-category="salud"]','textContent','Salud','Health'],
['.pa-news-tabs [data-news-category="tecnologia"]','textContent','Tecnología','Technology'],
['.pa-news-tabs [data-news-category="educacion"]','textContent','Educación','Education']
];
function language(){try{return localStorage.getItem('pluton-lang')==='en'?'en':'es'}catch(e){return document.documentElement.lang==='en'?'en':'es'}}
function render(){
const en=language()==='en';
document.querySelectorAll('[data-b53-es][data-b53-en]').forEach(el=>{const val=el.getAttribute(en?'data-b53-en':'data-b53-es');if(el.textContent!==val)el.textContent=val});
items.forEach(([selector,attr,es,english])=>{const el=document.querySelector(selector);if(el){const val=en?english:es;if(attr==='placeholder')el.setAttribute(attr,val);else if(el.textContent!==val)el.textContent=val}});
document.documentElement.lang=en?'en':'es';
}
document.addEventListener('DOMContentLoaded',()=>{render();document.getElementById('languageToggle')?.addEventListener('click',()=>setTimeout(render,100));});
window.addEventListener('storage',render);
})();
