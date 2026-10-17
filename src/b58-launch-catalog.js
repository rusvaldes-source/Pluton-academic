/* B58: launch gating is opt-in and fails closed; never assumes content is complete. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.PlutonB58Launch=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){
 const TARGETS=Object.freeze([{id:'PA-203',name:'PA-203'},{id:'ID-101',name:'ID-101'},{id:'MKT-201',name:'MKT-201'},{id:'COMPUTACION',name:'Computación'},{id:'NURSE-ASSISTANT',name:'Nurse Assistant'}]);
 const REQUIREMENTS=Object.freeze(['content','es','en','assessments','media','navigation','qa']);
 function evaluate(catalog,readiness){
  if(!Array.isArray(catalog)&&!Array.isArray(catalog?.courses))throw Error('Invalid catalog');
  const courses=Array.isArray(catalog)?catalog:catalog.courses;
  const seen=new Set();for(const c of courses){if(!c||typeof c.code!=='string'||seen.has(c.code))throw Error('Missing or duplicate code');seen.add(c.code)}
  const result=TARGETS.map(target=>{
   const found=courses.find(c=>c.code===target.id);
   const checks=readiness?.[target.id]||{};
   const missing=REQUIREMENTS.filter(k=>checks[k]!==true);
   if(!found)missing.unshift('catalog_entry');
   return {id:target.id,name:target.name,status:missing.length?'coming_soon':'ready',missing};
  });
  return {targets:result,ready:result.filter(x=>x.status==='ready').length,planned:TARGETS.length,allReady:result.every(x=>x.status==='ready')};
 }
 function label(status,lang){return status==='ready'?(lang==='en'?'Available':'Disponible'):(lang==='en'?'Coming soon':'Próximamente')}
 return {TARGETS,REQUIREMENTS,evaluate,label};
});
