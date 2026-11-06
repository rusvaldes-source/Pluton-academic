/* B115 catalog decoration only. Checkout remains the existing window.course flow. */
(()=>{'use strict';const codes=new Set(['FAM-101','FAM-102','PSI-101','PSI-102']);
function setText(el,value){if(el&&el.textContent!==value)el.textContent=value;}
function draw(){const root=document.getElementById('mainCatalog');if(!root)return;const en=document.documentElement.lang==='en';
 const filters=document.getElementById('catalogFilters');if(filters&&!filters.querySelector('.b115-family-filter')){const link=document.createElement('a');link.className='b115-family-filter';link.href='b115/index.html?lang='+(en?'en':'es');link.textContent=en?'Family and well-being':'Familia y bienestar';filters.append(link)}
 for(const card of root.querySelectorAll('article')){const code=card.querySelector('.code')?.textContent.trim();if(!codes.has(code))continue;
  const image=card.querySelector('img');if(image)image.src='b114/covers/'+code+'-'+(en?'en':'es')+'.webp';setText(card.querySelector('small'),en?'Family and well-being':'Familia y bienestar');
  let price=card.querySelector('.b115-price');if(!price){price=document.createElement('p');price.className='b115-price';card.append(price)}setText(price,en?'$9.99 USD · One-time payment':'$9.99 USD · Pago único');
  let buy=card.querySelector('.b115-buy');if(!buy){buy=document.createElement('button');buy.type='button';buy.className='catalog-cta b115-buy';buy.addEventListener('click',()=>{if(typeof window.course==='function')window.course(code)});card.append(buy)}setText(buy,en?'Buy course':'Comprar curso');
  const details=card.querySelector('a.catalog-cta');if(details)details.href='b115/index.html?course='+encodeURIComponent(code)+'&lang='+(en?'en':'es');
 }}
function init(){const root=document.getElementById('mainCatalog');if(!root)return;let locale=document.documentElement.lang;new MutationObserver(()=>{draw()}).observe(root,{childList:true});new MutationObserver(()=>{const next=document.documentElement.lang;if(next===locale)return;locale=next;draw()}).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});draw();
 const requested=new URLSearchParams(location.search).get('b115_buy');if(codes.has(requested)&&typeof window.course==='function')window.course(requested);
}if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();})();
