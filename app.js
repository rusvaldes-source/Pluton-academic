const SUPABASE_URL = 'https://paifjzznyiehwidoqjqb.supabase.co';
const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_-Ip2JRpDGn-Ehx2C94Tk3Q_jg7p7VLz';
let sb = null;
if (window.supabase) {
  sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
}



// MODAL
function show(title, html) {
  const modal = document.getElementById('modal');
  const modalTitle = document.getElementById('modalTitle');
  const modalText = document.getElementById('modalText');

  if (!modal || !modalTitle || !modalText) return;

  modalTitle.textContent = title;
  modalText.innerHTML = html;
  modal.classList.add('show');
  if(window.plutonLanguage)window.plutonLanguage.apply(modal);
}

function closeModal() {
  const modal = document.getElementById('modal');
  if (modal) modal.classList.remove('show');
}

function authMessage(message) {
  const element = document.getElementById('authMessage');
  if (element) element.textContent = message;
}

// LOGIN
function openLogin() {
  show(
    'Área del estudiante',
    `
    <div class="auth-box">
      <label>Correo electrónico</label>
      <input
        id="authEmail"
        type="email"
        autocomplete="email"
        placeholder="tu@email.com"
      >

      <label>Contraseña</label>
      <input
        id="authPassword"
        type="password"
        autocomplete="current-password"
        placeholder="Contraseña"
      >

      <button type="button" onclick="signIn()">
        Iniciar sesión
      </button>

      <button type="button" onclick="signUp()">
        Crear cuenta
      </button>

      <button type="button" onclick="resetPassword()">
        Olvidé mi contraseña
      </button>

      <p id="authMessage"></p>
    </div>
    `
  );
}

// CREAR CUENTA
async function signUp() {
  const email = document.getElementById('authEmail')?.value.trim();
  const password = document.getElementById('authPassword')?.value;

  if (!email || !password || password.length < 6) {
    authMessage(
      'Escribe un correo válido y una contraseña de al menos 6 caracteres.'
    );
    return;
  }

  if (!sb) return authMessage('No se pudo conectar al servicio. Recarga la página.');
  authMessage('Creando cuenta...');

  try { const { error } = await sb.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: window.location.origin
    }
  });

  if (error) {
    authMessage(error.message);
    return;
  }

  authMessage('Revisa tu correo para confirmar tu cuenta.');
  } catch(e) { authMessage(e.message || 'Error de conexión'); }
}

// INICIAR SESIÓN
async function signIn() {
  const email = document.getElementById('authEmail')?.value.trim();
  const password = document.getElementById('authPassword')?.value;

  if (!email || !password) {
    authMessage('Escribe tu correo y contraseña.');
    return;
  }

  if (!sb) return authMessage('No se pudo conectar al servicio. Recarga la página.');
  authMessage('Entrando...');

  try { const { error } = await sb.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    authMessage(error.message);
    return;
  }

  window.location.href = 'dashboard.html';
  } catch(e) { authMessage(e.message || 'Error de conexión'); }
}

// RECUPERAR CONTRASEÑA
async function resetPassword() {
  const email = document.getElementById('authEmail')?.value.trim();

  if (!email) {
    authMessage('Escribe primero tu correo electrónico.');
    return;
  }

  if (!sb) return authMessage('No se pudo conectar al servicio. Recarga la página.');
  authMessage('Enviando enlace...');

  try { const { error } = await sb.auth.resetPasswordForEmail(email, {
    redirectTo: window.location.origin
  });

  if (error) {
    authMessage(error.message);
    return;
  }

  authMessage('Revisa tu correo para restablecer la contraseña.');
  } catch(e) { authMessage(e.message || 'Error de conexión'); }
}

// CURSOS
function course(code) {
  show(
    (window.plutonLanguage?.current()==='en'?'Course ':'Curso ') + code,
    `
    <p>Este curso forma parte del catálogo de PLUTÓN ACADEMIC.</p>
    <p>Inicia sesión para acceder al contenido y progreso académico.</p>
    <button type="button" onclick="closeModal(); openLogin();">
      Iniciar sesión
    </button>
    `
  );
}

// MEMBRESÍAS
function plan(name) {
  show(
    (window.plutonLanguage?.current()==='en'?'Membership ':'Membresía ') + name,
    `
    <p>${window.plutonLanguage?.current()==='en'?'You have selected the membership':'Has seleccionado la membresía'} <strong>${name}</strong>.</p>
    <p>El sistema de suscripción y pagos se habilitará desde esta sección.</p>
    `
  );
}

// COMUNIDAD / CRECIMIENTO
function growth(name) {
  show(
    name,
    `
    <p>Esta función forma parte del ecosistema PLUTÓN ACADEMIC.</p>
    <p>Próximamente estará disponible para los estudiantes.</p>
    `
  );
}

// Filtros del catálogo
 document.addEventListener('DOMContentLoaded',()=>{
 document.querySelectorAll('[data-filter]').forEach(btn=>btn.addEventListener('click',()=>{
 document.querySelectorAll('[data-filter]').forEach(b=>b.classList.toggle('active',b===btn));
 document.querySelectorAll('.courses article[data-cat]').forEach(card=>{card.hidden=btn.dataset.filter!=='all'&&card.dataset.cat!==btn.dataset.filter;});
 }));
 });
