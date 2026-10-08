const SUPABASE_URL = 'https://paifjzznyiehwidoqjqb.supabase.co';
const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_-Ip2JRpDGn-Ehx2C94Tk3Q_jg7p7VLz';
const sb = window.supabase ? window.supabase.createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY) : null;

async function loadStudent() {
  const emailEl = document.getElementById('student-email');
  const membershipEl = document.getElementById('membership');
  try {
    if (!sb) throw new Error('Supabase no está disponible');
    const { data, error } = await sb.auth.getSession();
    if (error) throw error;
    const user = data?.session?.user;
    if (!user) {
      if (emailEl) emailEl.textContent = 'Sesión no iniciada';
      if (membershipEl) membershipEl.textContent = '—';
      return;
    }
    if (emailEl) emailEl.textContent = user.email || 'Usuario';
    if (membershipEl) membershipEl.textContent = 'Comprobando...';
    const { data: profile, error: profileError } = await sb.from('profiles')
      .select('membership').eq('email', user.email).maybeSingle();
    if (profileError) {
      console.error('Profile lookup:', profileError);
      if (membershipEl) membershipEl.textContent = 'Sin membresía';
      return;
    }
    if (membershipEl) membershipEl.textContent = profile?.membership || 'Sin membresía';
    translateDashboard();
  } catch (error) {
    console.error('Dashboard:', error);
    if (emailEl) emailEl.textContent = 'Error al cargar tu cuenta';
    if (membershipEl) membershipEl.textContent = 'No disponible';
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
const dashboardLabels={'Panel del Estudiante':'Student Dashboard','Bienvenido':'Welcome','Mi membresía':'My membership','Mis cursos':'My courses','Mi progreso':'My progress','Cerrar sesión':'Sign out','Inicio':'Home','Cargando tu cuenta...':'Loading your account...','Cargando...':'Loading...','Sin membresía':'No membership','Sesión no iniciada':'Not signed in','Comprobando...':'Checking...','Error al cargar tu cuenta':'Error loading your account','No disponible':'Unavailable'};
function dashboardLang(){return localStorage.getItem('pluton-lang')==='en'?'en':'es';}
function translateDashboard(){
 const lang=dashboardLang(),reverse=Object.fromEntries(Object.entries(dashboardLabels).map(([a,b])=>[b,a]));
 const walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);let n;
 while(n=walker.nextNode()){if(n.parentElement?.closest('[data-i18n],#student-email,#membership,#overallProgress,script'))continue;const v=n.nodeValue.trim(),es=reverse[v]||v;if(dashboardLabels[es])n.nodeValue=n.nodeValue.replace(v,lang==='en'?dashboardLabels[es]:es);}
 document.querySelectorAll('[data-i18n]').forEach(el=>{el.textContent=dashboardStrings[lang][el.dataset.i18n]||el.textContent;});
 const b=document.getElementById('languageToggle');if(b)b.textContent=lang==='en'?'ES':'EN';document.documentElement.lang=lang;refreshProgress();
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
