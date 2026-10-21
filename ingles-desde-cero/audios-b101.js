/* B101: original recovered recordings for ID-001; does not change authorization. */
(()=>{'use strict';
const mapping={"ID001-01-01": [{"language": "es", "kind": "narration", "file": "audios/ID001-01-01-es.mp3"}, {"language": "en", "kind": "narration", "file": "audios/ID001-01-01-en.mp3"}], "ID001-01-02": [{"language": "en", "kind": "narration", "file": "audios/ID001-01-02-en.mp3"}, {"language": "es", "kind": "narration", "file": "audios/ID001-01-02-es.mp3"}], "ID001-01-03": [{"language": "es", "kind": "narration", "file": "audios/ID001-01-03-es.mp3"}, {"language": "en", "kind": "narration", "file": "audios/ID001-01-03-en.mp3"}], "ID001-08-01": [{"language": "es", "kind": "narration", "file": "audios/ID001-08-01-es.mp3"}, {"language": "en", "kind": "narration", "file": "audios/ID001-08-01-en.mp3"}, {"language": "es", "kind": "support", "file": "audios/ID001-08-01-es-apoyo.mp3"}], "ID001-08-02": [{"language": "es", "kind": "narration", "file": "audios/ID001-08-02-es.mp3"}, {"language": "en", "kind": "narration", "file": "audios/ID001-08-02-en.mp3"}, {"language": "es", "kind": "support", "file": "audios/ID001-08-02-es-apoyo.mp3"}], "ID001-08-03": [{"language": "es", "kind": "narration", "file": "audios/ID001-08-03-es.mp3"}, {"language": "es", "kind": "support", "file": "audios/ID001-08-03-es-apoyo.mp3"}]};
const root=document.getElementById('reader');if(!root)return;
let queued=false;
function render(){
 const old=root.querySelector('[data-b101-audio]');
 const records=mapping[root.dataset.id];
 if(root.hidden||!records){if(old)old.remove();return;}
 const article=root.querySelector('article');if(!article)return;
 const language=document.documentElement.lang==='en'?'en':'es';
 if(old&&old.dataset.lesson===root.dataset.id&&old.dataset.language===language)return;
 if(old)old.remove();
 const box=document.createElement('section');box.dataset.b101Audio='';box.dataset.lesson=root.dataset.id;box.dataset.language=language;
 const title=document.createElement('h3');title.textContent=language==='en'?'Lesson audio':'Audios de la lección';box.append(title);
 for(const record of records){
  const label=document.createElement('p');
  label.textContent=(record.kind==='support'?(language==='en'?'Short supporting audio':'Audio breve de apoyo'):(language==='en'?'Lesson narration':'Narración de la lección'))+' · '+(record.language==='en'?'English':'Español');
  const audio=document.createElement('audio');audio.controls=true;audio.preload='none';audio.style.width='100%';audio.src=record.file;audio.setAttribute('aria-label',label.textContent+' · '+root.dataset.id);
  audio.addEventListener('error',()=>{label.textContent=language==='en'?'Audio could not load. You can continue reading.':'No se pudo cargar el audio. Puedes continuar leyendo.';});box.append(label,audio);
 }
 const h=article.querySelector('h2');if(h)h.insertAdjacentElement('afterend',box);else article.prepend(box);
}
function queue(){if(queued)return;queued=true;queueMicrotask(()=>{queued=false;render()});}
new MutationObserver(queue).observe(root,{childList:true,attributes:true,attributeFilter:['hidden','data-id']});
new MutationObserver(queue).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
render();
})();
