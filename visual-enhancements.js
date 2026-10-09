/* B20: decorative visual follows the existing real progress; never writes progress data. */
(()=>{'use strict';
const number=document.getElementById('liveProgressNumber');
const ring=document.getElementById('paProgressRing');
const label=document.getElementById('paProgressRingText');
const caption=document.getElementById('paVisualCaption');
if(!number||!ring||!label||!caption)return;
const en=()=>window.plutonLanguage?.current()==='en';
function update(){
 const raw=number.textContent||'';const match=raw.match(/(\d{1,3})\s*%/);
 const percent=match?Math.min(100,Math.max(0,Number(match[1]))):0;
 ring.style.setProperty('--pa-progress',String(percent));
 ring.setAttribute('aria-label',en()?`Progress: ${percent} percent`:`Progreso: ${percent} por ciento`);
 label.textContent=match?`${percent}%`:'—';
 caption.textContent=en()?'Your progress at a glance':'Tu avance, de un vistazo';
}
new MutationObserver(update).observe(number,{childList:true,characterData:true,subtree:true});
document.getElementById('languageToggle')?.addEventListener('click',()=>queueMicrotask(update));
update();
})();
