const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
function element(value=''){return {value,type:'password',disabled:false,textContent:'',attributes:{},listeners:{},addEventListener(k,fn){this.listeners[k]=fn},setAttribute(k,v){this.attributes[k]=v}}}
async function scenario(outcome){
 const form=element(),status=element(),submit=element(),password=element('password-value'),email=element('  student@example.com  '),show=element();
 const nodes={'signin-form':form,'signin-status':status,'signin-submit':submit,'signin-password':password,'signin-email':email,'show-password':show};
 let received,redirect;const document={documentElement:{lang:'es'},getElementById:id=>nodes[id],addEventListener(){}};
 const client={auth:{signInWithPassword:async data=>{received=data;return outcome==='ok'?{data:{user:{id:'one'}}}:{error:new Error('private detail')}}}};
 const context={document,window:null,console};context.window=context;context.location={replace:url=>{redirect=url}};context.supabase={createClient:()=>client};vm.createContext(context);
 vm.runInContext(fs.readFileSync('app-pluton/signin-core.js','utf8'),context);vm.runInContext(fs.readFileSync('app-pluton/signin-ui.js','utf8'),context);
 await form.listeners.submit({preventDefault(){}});assert.equal(received.email,'student@example.com');assert.equal(password.value,'');
 if(outcome==='ok'){assert.equal(redirect,'./mis-cursos.html');assert.equal(submit.disabled,true)}else{assert.equal(redirect,undefined);assert.equal(submit.disabled,false);assert.match(status.textContent,/No se pudo iniciar sesión/);assert(!status.textContent.includes('private detail'));assert(!status.textContent.includes('password-value'))}
}
(async()=>{await scenario('ok');await scenario('error');console.log('Inicio de sesión: conexión, errores y limpieza del campo comprobados');})().catch(e=>{console.error(e);process.exitCode=1});
