/* V7 - Optional authenticated cross-device progress sync using Supabase Auth user_metadata.
   No database schema changes. Local progress continues offline and without a session.
   Completion is monotonic (merge-only); sync status is never falsely marked successful. */
(()=>{'use strict';
const URL='https://paifjzznyiehwidoqjqb.supabase.co';
const KEY='sb_publishable_-Ip2JRpDGn-Ehx2C94Tk3Q_jg7p7VLz';
const FIELD='pluton_completed_v7';
let client=null,activeUser=null,busy=false,pending=false,initPromise=null,lastStatus='local';
const lang=()=>localStorage.getItem('pluton-lang')==='en'?'en':'es';
function status(s){lastStatus=s;document.dispatchEvent(new CustomEvent('pluton-sync-status',{detail:{status:s}}));}
function localEntries(){const out={};for(let i=0;i<localStorage.length;i++){const k=localStorage.key(i);if(!k?.startsWith('pluton-completed-'))continue;const code=k.slice('pluton-completed-'.length);if(!/^[A-Z0-9-]{2,30}$/.test(code))continue;try{const a=JSON.parse(localStorage.getItem(k));if(Array.isArray(a))out[code]=a.filter(n=>Number.isInteger(n)&&n>=0&&n<100)}catch(e){}}return out;}
function clean(input){const result={};if(!input||typeof input!=='object'||Array.isArray(input))return result;for(const [code,arr] of Object.entries(input)){if(!/^[A-Z0-9-]{2,30}$/.test(code)||!Array.isArray(arr))continue;result[code]=[...new Set(arr.filter(n=>Number.isInteger(n)&&n>=0&&n<100))].sort((a,b)=>a-b).slice(0,100)}return result;}
function merge(a,b){const out=clean(a);for(const [code,arr] of Object.entries(clean(b)))out[code]=[...new Set([...(out[code]||[]),...arr])].sort((x,y)=>x-y);return out;}
function saveLocal(entries){let changed=false;for(const [code,arr] of Object.entries(clean(entries))){const k='pluton-completed-'+code;let existing=[];try{existing=JSON.parse(localStorage.getItem(k)||'[]')}catch(e){}const union=[...new Set([...(Array.isArray(existing)?existing:[]),...arr])].sort((a,b)=>a-b);if(JSON.stringify(existing)!==JSON.stringify(union)){localStorage.setItem(k,JSON.stringify(union));changed=true;}}if(changed)document.dispatchEvent(new Event('pluton-progress-updated'));return changed;}
async function init(){if(initPromise)return initPromise;initPromise=(async()=>{if(!window.supabase){status('local');return;}try{client=window.supabase.createClient(URL,KEY);
// Supabase's default client uses the default storage key; createClient above must match it.
const {data:{session},error}=await client.auth.getSession();if(error)throw error;
if(!session?.user){status('local');return;}activeUser=session.user.id;await sync();
client.auth.onAuthStateChange((_event,session)=>{const next=session?.user?.id||null;if(next!==activeUser){activeUser=next;status(next?'pending':'local');if(next)setTimeout(()=>sync(),0);}});
}catch(e){console.warn('Progress sync initialization:',e);status('error');}})();return initPromise;}
async function sync(){if(!client||!activeUser)return;if(busy){pending=true;return;}busy=true;status('pending');try{const {data,error}=await client.auth.getUser();if(error)throw error;const user=data?.user;if(!user||user.id!==activeUser){status('local');return;}
const remote=clean(user.user_metadata?.[FIELD]);const combined=merge(remote,localEntries());saveLocal(combined);
if(JSON.stringify(remote)!==JSON.stringify(combined)){
const {data:updated,error:saveError}=await client.auth.updateUser({data:{[FIELD]:combined}});if(saveError)throw saveError;if(!updated?.user)throw Error('No sync confirmation');}
status('synced');
}catch(e){console.warn('Progress sync:',e);status('error');}finally{busy=false;if(pending){pending=false;setTimeout(()=>sync(),350);}}}
function markCompleted(code,index){if(!/^[A-Z0-9-]{2,30}$/.test(code)||!Number.isInteger(index)||index<0)return;let existing=[];try{existing=JSON.parse(localStorage.getItem('pluton-completed-'+code)||'[]')}catch(e){}saveLocal({[code]:[...(Array.isArray(existing)?existing:[]),index]});if(activeUser)sync();else init().then(()=>{if(activeUser)sync()});}
function statusText(){const en=lang()==='en';return ({synced:en?'Synced to your account':'Sincronizado con tu cuenta',pending:en?'Syncing progress…':'Sincronizando progreso…',error:en?'Saved on this device; account sync unavailable':'Guardado en este dispositivo; sincronización no disponible',local:en?'Saved on this device; sign in to sync':'Guardado en este dispositivo; inicia sesión para sincronizar'})[lastStatus]||'';}
window.plutonSync={init,sync,markCompleted,statusText,getStatus:()=>lastStatus};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
window.addEventListener('online',()=>{if(activeUser)sync()});window.addEventListener('pageshow',()=>{if(activeUser)sync()});
})();
