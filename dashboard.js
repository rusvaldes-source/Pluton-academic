const SUPABASE_URL = 'https://paifjzznyiehwidoqjqb.supabase.co';
const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_-Ip2JRpDGn-Ehx2C94Tk3Q_jg7p7VLz';
const sb = window.supabase ? window.supabase.createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY) : null;
const B107_CODES = new Set(['ELEC-101','HVAC-101','BEAUTY-101']);
let dashboardGeneration=0, dashboardUser=null, dashboardOwned=[], dashboardProgress=null, dashboardCatalog=[];
let checkoutState='';
const dashboardLabels={'Panel del Estudiante':'Student Dashboard','Bienvenido':'Welcome','Mis compras':'My purchases','Mis cursos':'My courses','Mi progreso':'My progress','Cerrar sesión':'Sign out','Inicio':'Home','Cargando tu cuenta...':'Loading your account...','Cargando...':'Loading...','Aún no has comprado cursos':'No purchased courses yet','Sesión no iniciada':'Not signed in','Comprobando...':'Checking...','Error al cargar tu cuenta':'Error loading your account','No disponible':'Unavailable'};
function dashboardLang(){return localStorage.getItem('pluton-lang')==='en'?'en':'es';}
function tr(es,en){return dashboardLang()==='en'?en:es;}
function studentStatus(el,value){if(el){el.dataset.studentStatus=value;el.textContent=dashboardLang()==='en'?(dashboardLabels[value]||value):value;}}
function studentValue(el,value){if(el){delete el.dataset.studentStatus;el.textContent=value;}}
function classroomURL(code,lesson=0){return B107_CODES.has(code)?'b107/index.html?course='+encodeURIComponent(code)+'&lesson='+lesson+'&lang='+dashboardLang():'courses.html?course='+encodeURIComponent(code);}
function renderPurchases(){
 const el=document.getElementById('purchasedCourses');if(!el)return;
 if(!dashboardUser)return;
 if(!dashboardOwned.length){studentStatus(el,'Aún no has comprado cursos');return;}
 delete el.dataset.studentStatus;el.replaceChildren();const list=document.createElement('div');list.className='pa-owned-courses';
 dashboardOwned.forEach(code=>{const card=document.createElement('article');card.style.cssText='padding:16px;margin:10px 0;border:1px solid #bd9a4c;border-radius:12px';const title=document.createElement('strong');const c=dashboardCatalog.find(c=>c.code===code);title.textContent=c?.[dashboardLang()]||c?.es||code;const link=document.createElement('a');link.className='pa-link';link.style.cssText='display:block;margin-top:8px';link.href=classroomURL(code);link.textContent=tr('Abrir curso comprado →','Open purchased course →');card.append(title,link);list.append(card)});el.append(list);
}
function invalidateDashboard(){dashboardGeneration++;dashboardUser=null;dashboardOwned=[];dashboardProgress=null;studentStatus(document.getElementById('student-email'),'Comprobando...');studentStatus(document.getElementById('purchasedCourses'),'Comprobando...');checkoutState='';const checkout=document.getElementById('checkoutVerification');if(checkout){checkout.hidden=true;checkout.textContent='';}refreshProgress();refreshNextCourse();}
async function loadStudent(){
 const generation=++dashboardGeneration;const current=()=>generation===dashboardGeneration;let user;
 try{
  if(!sb)throw Error('Supabase unavailable');
  const verified=await sb.auth.getUser();if(!current())return {owned:[],stale:true};if(verified.error)throw verified.error;user=verified.data?.user;
  dashboardUser=user?.id||null;dashboardOwned=[];dashboardProgress=null;
  if(!user){studentStatus(document.getElementById('student-email'),'Sesión no iniciada');studentValue(document.getElementById('purchasedCourses'),'—');refreshProgress();refreshNextCourse();return {owned:[]};}
  studentValue(document.getElementById('student-email'),user.email||tr('Usuario','User'));studentStatus(document.getElementById('purchasedCourses'),'Comprobando...');
  const purchases=await sb.from('course_purchase_access').select('course_code').eq('user_id',user.id).eq('active',true);
  if(!current()||dashboardUser!==user.id)return {owned:[],stale:true};if(purchases.error)throw purchases.error;
  dashboardOwned=[...new Set((purchases.data||[]).map(p=>p.course_code).filter(c=>typeof c==='string'))];
  const codes=dashboardOwned.filter(c=>B107_CODES.has(c));
  if(codes.length){const progress=await sb.from('b107_lesson_progress').select('user_id,course_code,lesson_number,completed').eq('user_id',user.id).in('course_code',codes).eq('completed',true);
   if(!current()||dashboardUser!==user.id)return {owned:[],stale:true};
   if(!progress.error){dashboardProgress=new Map(codes.map(c=>[c,new Set()]));for(const row of progress.data||[])if(row.user_id===user.id&&dashboardProgress.has(row.course_code)&&row.completed===true&&Number.isInteger(row.lesson_number)&&row.lesson_number>=1&&row.lesson_number<=20)dashboardProgress.get(row.course_code).add(row.lesson_number);}
  }else dashboardProgress=new Map();
  renderPurchases();refreshProgress();refreshNextCourse();return {owned:[...dashboardOwned],userId:user.id};
 }catch(error){if(!current())return {owned:[],stale:true};dashboardOwned=[];dashboardProgress=null;studentStatus(document.getElementById('purchasedCourses'),'No disponible');if(!user)studentStatus(document.getElementById('student-email'),'Error al cargar tu cuenta');refreshProgress();refreshNextCourse();return {owned:[],error:true};}
}
function legacyCompleted(c){try{const list=JSON.parse(localStorage.getItem('pluton-completed-'+c.code)||'[]');return new Set(Array.isArray(list)?list.filter(i=>Number.isInteger(i)&&i>=0&&i<c.lessons.length):[]);}catch{return new Set();}}
function refreshProgress(){let total=0,done=0;for(const c of dashboardCatalog){if(B107_CODES.has(c.code)||!Array.isArray(c.lessons))continue;total+=c.lessons.length;done+=legacyCompleted(c).size;}
 const owned=dashboardOwned.filter(c=>B107_CODES.has(c));total+=owned.length*20;const unavailable=owned.length&&!dashboardProgress;if(dashboardProgress)for(const set of dashboardProgress.values())done+=set.size;
 const el=document.getElementById('overallProgress');if(el)el.textContent=tr('Progreso general: ','Overall progress: ')+(unavailable?tr('No disponible','Unavailable'):(total?Math.round(done/total*100):0)+'% · '+done+'/'+total+' '+tr('lecciones','lessons'));const sync=document.getElementById('progressSyncStatus');if(sync)sync.textContent=unavailable?tr('No disponible','Unavailable'):(window.plutonSync?.statusText()||'');}
function refreshNextCourse(){const title=document.getElementById('nextTitle'),label=document.getElementById('nextCourse'),link=document.getElementById('nextCourseLink');if(!title||!label||!link)return;title.textContent=tr('Continúa aprendiendo','Continue learning');
 let code,lesson=0;if(dashboardProgress)for(const owned of dashboardOwned){if(!B107_CODES.has(owned))continue;const done=dashboardProgress.get(owned);if(done&&done.size<20){code=owned;while(done.has(lesson+1))lesson++;break;}}
 let next=dashboardCatalog.find(c=>c.code===code);if(!code){next=dashboardCatalog.find(c=>dashboardOwned.includes(c.code)&&!B107_CODES.has(c.code)&&Array.isArray(c.lessons)&&legacyCompleted(c).size<c.lessons.length);code=next?.code;}
 label.textContent=code?((next?.[dashboardLang()]||next?.es||code)+' · '+code):tr('Todas las lecciones introductorias completadas o catálogo no disponible.','All introductory lessons completed or catalog unavailable.');link.href=code?classroomURL(code,lesson):'courses.html';link.textContent=tr('Continuar curso →','Continue course →');
 for(const [id,es,en] of [['dashboardDailyTitle','Tu reto de hoy','Today’s challenge'],['dashboardDailyText','Practica una pregunta nueva cada día.','Practice one new question each day.'],['dashboardDailyLink','Ver reto diario →','View daily challenge →']]){const e=document.getElementById(id);if(e)e.textContent=tr(es,en);}}
function renderCheckout(){const el=document.getElementById('checkoutVerification');if(!el||!checkoutState)return;el.hidden=false;const messages={checking:['Verificando el pago con Stripe…','Verifying payment with Stripe…'],confirmed:['Pago confirmado. Tu curso comprado aparece en Mis compras.','Payment confirmed. Your purchased course appears in My purchases.'],pending:['El pago está pendiente de confirmación. Actualiza el panel en unos momentos.','Payment confirmation is pending. Refresh your dashboard shortly.'],neutral:['Consulta Mis compras para comprobar el acceso a tus cursos.','Check My purchases to verify access to your courses.']};el.textContent=messages[checkoutState][dashboardLang()==='en'?1:0];}
function translateDashboard(){const reverse=Object.fromEntries(Object.entries(dashboardLabels).map(([a,b])=>[b,a]));const walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);let n;while(n=walker.nextNode()){if(n.parentElement?.closest('[data-i18n],#student-email,#purchasedCourses,#overallProgress,script'))continue;const v=n.nodeValue.trim(),es=reverse[v]||v;if(dashboardLabels[es])n.nodeValue=n.nodeValue.replace(v,tr(es,dashboardLabels[es]));}document.querySelectorAll('[data-student-status]').forEach(e=>studentStatus(e,e.dataset.studentStatus));const hint=document.querySelector('[data-i18n="courseHint"]');if(hint)hint.textContent=tr('Explora las lecciones disponibles y registra tu avance.','Explore available lessons and track your progress.');const go=document.querySelector('[data-i18n="goCourses"]');if(go)go.textContent=tr('Abrir mis cursos →','Open my courses →');const toggle=document.getElementById('languageToggle');if(toggle)toggle.textContent=dashboardLang()==='en'?'EN':'ES';document.documentElement.lang=dashboardLang();renderPurchases();refreshProgress();refreshNextCourse();renderCheckout();}
function changeDashboardLanguage(){window.plutonLanguage?.toggle();translateDashboard();}
async function closeStudentSession(){invalidateDashboard();if(sb)await sb.auth.signOut();window.location.href='index.html';}
async function waitForVerifiedCheckout(){const query=new URLSearchParams(location.search);if(query.get('checkout')!=='success')return;const code=query.get('course');if(!code){checkoutState='neutral';renderCheckout();return;}checkoutState='checking';renderCheckout();const generation=dashboardGeneration;const owner=dashboardUser;
 for(let i=0;i<8;i++){if(i)await new Promise(resolve=>setTimeout(resolve,1500));if(dashboardGeneration!==generation+i||dashboardUser!==owner)return;const result=await loadStudent();if(result.stale||result.userId!==owner)return;if(result.owned.includes(code)){checkoutState='confirmed';renderCheckout();history.replaceState(null,'',location.pathname);return;}}
 checkoutState='pending';renderCheckout();}
document.addEventListener('DOMContentLoaded',async()=>{document.getElementById('logoutButton')?.addEventListener('click',closeStudentSession);translateDashboard();try{const response=await fetch('catalog.json');if(response.ok){dashboardCatalog=await response.json();window.plutonDashboardCatalog=dashboardCatalog;}}catch{}await loadStudent();translateDashboard();waitForVerifiedCheckout();});
if(sb?.auth.onAuthStateChange)sb.auth.onAuthStateChange(()=>{invalidateDashboard();setTimeout(()=>loadStudent(),0);});
document.addEventListener('pluton-progress-updated',()=>{refreshProgress();refreshNextCourse();});document.addEventListener('pluton-sync-status',refreshProgress);
document.addEventListener('pluton-language-changed',translateDashboard);
