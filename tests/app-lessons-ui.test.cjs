const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
class Element {
  constructor(tag='div'){this.tag=tag;this.children=[];this.listeners={};this.attrs={};this.textContent='';this.href='';}
  replaceChildren(){this.children=[];} append(...nodes){this.children.push(...nodes);}
  addEventListener(event,fn){this.listeners[event]=fn;} setAttribute(k,v){this.attrs[k]=v;}
}
const status=new Element(),list=new Element(),retry=new Element('button'),events={};
const document={documentElement:{lang:'es'},getElementById(id){return {'owned-lessons':list,'owned-lessons-status':status,'owned-lessons-retry':retry}[id]},createElement(tag){return new Element(tag)},addEventListener(k,fn){events[k]=fn}};
let authEvent,session={id:'user-a'},purchased=[{course_code:'PA-101',active:true}],queries=[];
const client={
 auth:{getUser:async()=>({data:{user:session}}),onAuthStateChange(fn){authEvent=fn}},
 from(table){assert.equal(table,'course_purchase_access');return {select(){return {eq(key,val){queries.push([key,val]);return {eq(key2,val2){queries.push([key2,val2]);return Promise.resolve({data:purchased})}}}}}}}
};
const app={document,console,setTimeout,fetch:async()=>({ok:true,json:async()=>[{code:'PA-101',es:'Enfermería',en:'Nursing'},{code:'FA-101',es:'Primeros auxilios',en:'First aid'}]})};
app.window=app;app.supabase={createClient:()=>client};app.addEventListener=(k,fn)=>events[k]=fn;
vm.createContext(app);vm.runInContext(fs.readFileSync('app-pluton/owned-lessons.js','utf8'),app);vm.runInContext(fs.readFileSync('app-pluton/lessons-ui.js','utf8'),app);
const tick=()=>new Promise(r=>setTimeout(r,20));
(async()=>{
 await tick();assert.equal(list.children.length,1);assert.equal(list.children[0].children[0].children[0].textContent,'Enfermería');assert.equal(list.children[0].href,'/courses.html?course=PA-101');assert.deepEqual(queries.slice(0,2),[['user_id','user-a'],['active',true]]);
 document.documentElement.lang='en';events['app-language-changed']();assert.equal(list.children[0].children[0].children[0].textContent,'Nursing');
 session=null;authEvent('SIGNED_OUT');assert.equal(list.children.length,0);assert.match(status.textContent,/Sign in/);
 session={id:'user-b'};purchased=[{course_code:'FA-101',active:true}];authEvent('SIGNED_IN');assert.equal(list.children.length,0);await tick();assert.equal(list.children.length,1);assert.equal(list.children[0].href,'/b114/aula.html?course=FA-101&lang=en');
 console.log('Panel de lecciones: sesión, compra, cambio de cuenta e idioma verificados');
})().catch(e=>{console.error(e);process.exitCode=1});
