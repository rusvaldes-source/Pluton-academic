const SUPABASE_URL = 'https://paifjzznyiehwidoqjqb.supabase.co';
const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_-Ip2JRpDGn-Ehx2C94Tk3Q_jg7p7VLz';
const sb = window.supabase ? window.supabase.createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY) : null;

function studentStatus(element, value) {
  if (!element) return;
  element.dataset.studentStatus = value;
  element.textContent = window.plutonLanguage?.text(value) || value;
}
function studentValue(element, value) {
  if (!element) return;
  delete element.dataset.studentStatus;
  element.textContent = value;
}

async function loadStudent() {
  const emailEl = document.getElementById('student-email');
  const purchasesEl = document.getElementById('purchasedCourses');
  try {
    if (!sb) throw new Error('Supabase no está disponible');
    const { data, error } = await sb.auth.getSession();
    if (error) throw error;
    const user = data?.session?.user;
    if (!user) {
      studentStatus(emailEl, 'Sesión no iniciada');
      studentValue(purchasesEl, '—');
      return;
    }
    studentValue(emailEl, user.email || window.plutonLanguage?.text('Usuario') || 'Usuario');
    studentStatus(purchasesEl, 'Comprobando...');
    const { data: purchases, error: purchaseError } = await sb.from('course_purchase_access')
      .select('course_code').eq('user_id', user.id).eq('active', true);
    if (purchaseError) {
      console.error('Purchase access lookup:', purchaseError);
      studentStatus(purchasesEl, 'No disponible');
      return;
    }
    const owned = purchases || [];
    if (owned.length) {
      const catalog = await fetch('catalog.json').then(r => r.ok ? r.json() : []).catch(() => []);
      const names = Object.fromEntries(catalog.map(item => [item.code, item[dashboardLang()] || item.es || item.code]));
      purchasesEl.textContent = '';
      const list = document.createElement('div');
      list.className = 'pa-owned-courses';
      owned.forEach(item => {
        const card = document.createElement('article');
        card.style.cssText = 'padding:16px;margin:10px 0;border:1px solid #bd9a4c;border-radius:12px';
        const title = document.createElement('strong');
        title.textContent = names[item.course_code] || (item.course_code === 'ID-001' ? 'Inglés desde cero' : item.course_code);
        const link = document.createElement('a');
        link.className = 'pa-link';
        link.style.cssText = 'display:block;margin-top:8px';
        link.href = 'courses.html?course=' + encodeURIComponent(item.course_code);
        link.textContent = dashboardLang() === 'en' ? 'Open purchased course →' : 'Abrir curso comprado →';
        card.append(title, link);
        list.appendChild(card);
      });
      purchasesEl.appendChild(list);
    } else studentValue(purchasesEl, 'Aún no has comprado cursos');
    translateDashboard();
  } catch (error) {
    console.error('Dashboard:', error);
    studentStatus(emailEl, 'Error al cargar tu cuenta');
    studentStatus(purchasesEl, 'No disponible');
  }
}

async function closeStudentSession() {
  if (sb) await sb.auth.signOut();
  window.location.href = 'index.html';
}

document.addEventListener('DOMContentLoaded', () => {
  loadStudent();
  document.getElementById('logoutButton')?.addEventListener('click', closeStudentSession);
});

// Traducción explícita y estable; evita alterar correo o datos del perfil.
const dashboardStrings={es:{courseHint:'Explora las lecciones disponibles y registra tu avance.',goCourses:'Abrir mis cursos →',overall:'Progreso general: ',admin:'Administración'},en:{courseHint:'Explore available lessons and track your progress.',goCourses:'Open my courses →',overall:'Overall progress: ',admin:'Administration'}};
const dashboardLabels={'Panel del Estudiante':'Student Dashboard','Bienvenido':'Welcome','Mis compras':'My purchases','Mis cursos':'My courses','Mi progreso':'My progress','Cerrar sesión':'Sign out','Inicio':'Home','Cargando tu cuenta...':'Loading your account...','Cargando...':'Loading...','Aún no has comprado cursos':'No purchased courses yet','Sesión no iniciada':'Not signed in','Comprobando...':'Checking...','Error al cargar tu cuenta':'Error loading your account','No disponible':'Unavailable'};
function dashboardLang(){return localStorage.getItem('pluton-lang')==='en'?'en':'es';}
function translateDashboard(){
 const lang=dashboardLang(),reverse=Object.fromEntries(Object.entries(dashboardLabels).map(([a,b])=>[b,a]));
 const walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);let n;
 while(n=walker.nextNode()){if(n.parentElement?.closest('[data-i18n],#student-email,#purchasedCourses,#overallProgress,script'))continue;const v=n.nodeValue.trim(),es=reverse[v]||v;if(dashboardLabels[es])n.nodeValue=n.nodeValue.replace(v,lang==='en'?dashboardLabels[es]:es);}
 document.querySelectorAll('[data-i18n]').forEach(el=>{el.textContent=dashboardStrings[lang][el.dataset.i18n]||el.textContent;});
 document.querySelectorAll('[data-student-status]').forEach(el=>{el.textContent=window.plutonLanguage?.text(el.dataset.studentStatus)||el.dataset.studentStatus;});
 const b=document.getElementById('languageToggle');if(b)b.textContent=lang==='en'?'EN':'ES';document.documentElement.lang=lang;refreshProgress();
}
function changeDashboardLanguage(){window.plutonLanguage?.toggle();}
let allCourseCodes=[];
function refreshProgress(){
 const courses=window.plutonDashboardCatalog||[];
 let total=0,done=0;
 for(const c of courses){if(!Array.isArray(c.lessons))continue;total+=c.lessons.length;try{const list=JSON.parse(localStorage.getItem('pluton-completed-'+c.code)||'[]');if(Array.isArray(list))done+=new Set(list.filter(i=>Number.isInteger(i)&&i>=0&&i<c.lessons.length)).size;}catch(e){}}
 const el=document.getElementById('overallProgress');
 if(el)el.textContent=dashboardStrings[dashboardLang()].overall+(total?Math.round(done/total*100):0)+'% · '+done+'/'+total+' '+(dashboardLang()==='en'?'lessons':'lecciones');const syncEl=document.getElementById('progressSyncStatus');if(syncEl)syncEl.textContent=window.plutonSync?.statusText()||'';
}
document.addEventListener('DOMContentLoaded',()=>{fetch('catalog.json').then(r=>r.ok?r.json():Promise.reject()).then(data=>{allCourseCodes=data.map(c=>c.code);refreshProgress()}).catch(()=>{});});
document.addEventListener('DOMContentLoaded',()=>{translateDashboard();});

// V4: suggested next lesson based on local progress; no changes to authentication.
function refreshNextCourse(){const en=dashboardLang()==='en';const title=document.getElementById('nextTitle'),label=document.getElementById('nextCourse'),link=document.getElementById('nextCourseLink');if(!title||!label||!link)return;title.textContent=en?'Continue learning':'Continúa aprendiendo';document.getElementById('dashboardDailyTitle').textContent=en?'Today’s challenge':'Tu reto de hoy';document.getElementById('dashboardDailyText').textContent=en?'Practice one new question each day.':'Practica una pregunta nueva cada día.';document.getElementById('dashboardDailyLink').textContent=en?'View daily challenge →':'Ver reto diario →';const courses=window.plutonDashboardCatalog||[];const next=courses.find(c=>{try{return JSON.parse(localStorage.getItem('pluton-completed-'+c.code)||'[]').length<c.lessons.length}catch(e){return true}});label.textContent=next?(next[en?'en':'es']+' · '+next.code):(en?'All introductory lessons completed or catalog unavailable.':'Todas las lecciones introductorias completadas o catálogo no disponible.');link.href=next?'courses.html?course='+encodeURIComponent(next.code):'courses.html';link.textContent=en?'Continue course →':'Continuar curso →';}
const originalTranslateDashboard=translateDashboard;translateDashboard=function(){originalTranslateDashboard();refreshNextCourse()};
document.addEventListener('DOMContentLoaded',()=>fetch('catalog.json').then(r=>r.json()).then(data=>{window.plutonDashboardCatalog=data;refreshProgress();refreshNextCourse()}).catch(()=>refreshNextCourse()));

document.addEventListener('pluton-progress-updated',()=>{refreshProgress();refreshNextCourse()});document.addEventListener('pluton-sync-status',refreshProgress);


// B105: Checkout redirects never grant access; only the verified Stripe webhook does.
async function waitForVerifiedCheckout() {
  if (new URLSearchParams(location.search).get('checkout') !== 'success') return;
  const el = document.getElementById('checkoutVerification');
  if (!el) return;
  el.hidden = false;
  el.textContent = 'Verificando el pago con Stripe…';
  let previous = '';
  for (let i = 0; i < 8; i++) {
    await loadStudent();
    const content = document.getElementById('purchasedCourses')?.textContent || '';
    if (content && content !== 'Aún no has comprado cursos' && content !== 'Comprobando...' && content !== 'No disponible') {
      el.textContent = 'Pago confirmado. Tu curso comprado aparece en Mis compras.';
      history.replaceState(null, '', location.pathname);
      return;
    }
    previous = content;
    await new Promise(resolve => setTimeout(resolve, 1500));
  }
  el.textContent = 'El pago está pendiente de confirmación. Actualiza el panel en unos momentos. Si no aparece, contacta con soporte.';
}
document.addEventListener('DOMContentLoaded', waitForVerifiedCheckout);
