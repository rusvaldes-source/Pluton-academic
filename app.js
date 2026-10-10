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
  if (element) element.textContent = window.plutonLanguage?.text(message) || message;
}

function authError(error) {
  const messages = {
    invalid_credentials: 'Credenciales incorrectas. Revisa tu correo y contraseña.',
    email_not_confirmed: 'Confirma tu correo antes de iniciar sesión.',
    over_email_send_rate_limit: 'Espera unos minutos antes de intentarlo de nuevo.',
    over_request_rate_limit: 'Espera unos minutos antes de intentarlo de nuevo.',
    user_already_exists: 'Cuenta ya registrada. Inicia sesión o recupera tu contraseña.',
    signup_disabled: 'El registro de cuentas no está disponible.',
    weak_password: 'Escribe un correo válido y una contraseña de al menos 6 caracteres.'
  };
  console.warn('Authentication request:', error?.code || error?.name || 'unavailable');
  authMessage(messages[error?.code] || 'No se pudo completar la solicitud. Inténtalo de nuevo.');
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
    authError(error);
    return;
  }

  authMessage('Revisa tu correo para confirmar tu cuenta.');
  } catch(e) { authError(e); }
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
    authError(error);
    return;
  }

  window.location.href = 'dashboard.html';
  } catch(e) { authError(e); }
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
    authError(error);
    return;
  }

  authMessage('Revisa tu correo para restablecer la contraseña.');
  } catch(e) { authError(e); }
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
