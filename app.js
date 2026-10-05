const SUPABASE_URL='https://paifjzznyiehwidoqjqb.supabase.co';
const SUPABASE_PUBLISHABLE_KEY='sb_publishable_-Ip2JRpDGn-Ehx2C94Tk3Q_jg7p7VLz';
const sb=window.supabase.createClient(SUPABASE_URL,SUPABASE_PUBLISHABLE_KEY);

const filters=document.querySelectorAll('.filters button'),cards=document.querySelectorAll('.courses article');
filters.forEach(b=>b.addEventListener('click',()=>{filters.forEach(x=>x.classList.remove('active'));b.classList.add('active');cards.forEach(c=>c.style.display=b.dataset.filter==='all'||c.dataset.cat===b.dataset.filter?'block':'none')}));

function show(t,html){document.getElementById('modalTitle').textContent=t;document.getElementById('modalText').innerHTML=html;document.getElementById('modal').classList.add('show')}
function closeModal(){document.getElementById('modal').classList.remove('show')}
function authMessage(msg,ok=false){const e=document.getElementById('authMessage');if(e){e.textContent=msg;e.style.marginTop='12px';e.style.fontWeight='700';e.style.color=ok?'#b7f7c7':'#ffd0d0'}}

function openLogin(){show('Área del estudiante',`<div class="auth-box"><label>Correo electrónico</label><input id="authEmail" type="email" autocomplete="email" placeholder="tu@email.com"><label>Contraseña</label><input id="authPassword" type="password" autocomplete="current-password" placeholder="Tu contraseña"><button class="primary" onclick="signIn()">Iniciar sesión</button><button class="secondary" onclick="signUp()">Crear cuenta</button><button class="auth-link" onclick="resetPassword()">Olvidé mi contraseña</button><p id="authMessage"></p></div>`)}
async function signUp(){const email=document.getElementById('authEmail').value.trim(),password=document.getElementById('authPassword').value;if(!email||password.length<6)return authMessage('Escribe un correo válido y una contraseña de al menos 6 caracteres.');authMessage('Creando cuenta…');const {error}=await sb.auth.signUp({email,password,options:{emailRedirectTo:location.origin}});if(error)return authMessage(error.message);authMessage('Cuenta creada. Revisa tu correo y confirma tu registro.',true)}
async function signIn(){const email=document.getElementById('authEmail').value.trim(),password=document.getElementById('authPassword').value;if(!email||!password)return authMessage('Escribe tu correo y contraseña.');authMessage('Entrando…');const {error}=await sb.auth.signInWithPassword({email,password});if(error)return authMessage('No pudimos iniciar sesión. Verifica tus datos y la confirmación del correo.');closeModal();await refreshAuthUI()}
async function resetPassword(){const email=document.getElementById('authEmail').value.trim();if(!email)return authMessage('Escribe primero tu correo electrónico.');const {error}=await sb.auth.resetPasswordForEmail(email,{redirectTo:location.origin});if(error)return authMessage(error.message);authMessage('Te enviamos un enlace para restablecer tu contraseña.',true)}
async function signOut(){await sb.auth.signOut();await refreshAuthUI()}
async function refreshAuthUI(){const {data:{user}}=await sb.auth.getUser();document.querySelectorAll('nav button').forEach(btn=>{if(btn.textContent.includes('Iniciar sesión')||btn.dataset.auth==='user'){if(user){btn.textContent='Cerrar sesión';btn.onclick=signOut;btn.dataset.auth='user'}else{btn.textContent='Iniciar sesión';btn.onclick=openLogin;btn.dataset.auth='user'}}});const dash=document.querySelector('.dash-head b');if(dash)dash.textContent=user?`Hola, ${user.email.split('@')[0]}`:'Hola, Estudiante'}
function course(id){show(id+' · Vista del curso','<p>La experiencia del curso está preparada para conectar video-lecciones, PDFs, ejercicios, evaluación y progreso del estudiante.</p>')}
function plan(name){show('Plan '+name,'<p>La selección comercial está preparada. El cobro recurrente se activará cuando conectemos el proveedor de pagos.</p>')}
function growth(name){show(name+' · Fase 4','<p>Este módulo forma parte de la expansión de PLUTÓN ACADEMIC.</p>')}
sb.auth.onAuthStateChange(()=>refreshAuthUI());refreshAuthUI();_
// Supabase connected
// Student dashboard
// PANEL ESTUDIANTE
if (document.getElementById("student-email")) {
  sb.auth.getSession().then(({ data, error }) => {
    const userEmail = document.getElementById("student-email");

    if (error) {
      userEmail.textContent = "Error al cargar la cuenta";
      return;
    }

    const user = data?.session?.user;

    if (user) {
      userEmail.textContent = user.email;
    } else {
      userEmail.textContent = "Sesión no iniciada";
      window.location.href = "login.html";
    }
  });
}
