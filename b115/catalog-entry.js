/* B115 catalog decoration only. Checkout remains the existing window.course flow. */
(()=>{'use strict';const codes=new Set(['FAM-101','FAM-102','PSI-101','PSI-102']);
function setText(el,value){if(el&&el.textContent!==value)el.textContent=value;}
function draw(){const root=document.getElementById('mainCatalog');if(!root)return;const en=document.documentElement.lang==='en';
 const filters=document.getElementById('catalogFilters');if(filters&&!filters.querySelector('.b115-family-filter')){const link=document.createElement('a');link.className='b115-family-filter';link.href='b115/index.html?lang='+(en?'en':'es');link.textContent=en?'Family and well-being':'Familia y bienestar';filters.append(link)}
 for(const card of root.querySelectorAll('article')){const code=card.querySelector('.code')?.textContent.trim();if(!codes.has(code))continue;
  const image=card.querySelector('img');if(image)image.src='b114/covers/'+code+'-'+(en?'en':'es')+'.webp?v=b115-fotos-20261106';setText(card.querySelector('small'),en?'Family and well-being':'Familia y bienestar');
  // The existing catalog already supplies the gold price and purchase button.
  for(const duplicate of card.querySelectorAll('.b115-price,.b115-buy'))duplicate.remove();
  const details=card.querySelector('a.catalog-cta');if(details)details.href='b115/index.html?course='+encodeURIComponent(code)+'&lang='+(en?'en':'es');
 }}
function init(){const root=document.getElementById('mainCatalog');if(!root)return;let locale=document.documentElement.lang;new MutationObserver(()=>{draw()}).observe(root,{childList:true});new MutationObserver(()=>{const next=document.documentElement.lang;if(next===locale)return;locale=next;draw()}).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});draw();
 const requested=new URLSearchParams(location.search).get('b115_buy');if(codes.has(requested)&&typeof window.course==='function')window.course(requested);
}if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();})();
