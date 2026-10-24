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
      <div class="pa-password-field" style="display:flex;align-items:center;gap:8px">
        <input
          id="authPassword"
          type="password"
          autocomplete="current-password"
          placeholder="Contraseña"
          style="flex:1;min-width:0"
        >
        <button type="button" id="authPasswordToggle" onclick="toggleAuthPassword()" aria-label="Mostrar contraseña" aria-pressed="false" title="Mostrar contraseña" style="width:44px;min-width:44px;height:44px;display:grid;place-items:center" >
          <svg id="authEyeIcon" xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/></svg>
        </button>
      </div>

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


// Mostrar u ocultar contraseña sin modificar el valor ni enviar el formulario.
function toggleAuthPassword() {
  const input = document.getElementById('authPassword');
  const button = document.getElementById('authPasswordToggle');
  const icon = document.getElementById('authEyeIcon');
  if (!input || !button || !icon) return;
  const visible = input.type === 'password';
  input.type = visible ? 'text' : 'password';
  button.setAttribute('aria-pressed', String(visible));
  const english = window.plutonLanguage?.current?.() === 'en';
  const label = visible ? (english ? 'Hide password' : 'Ocultar contraseña') : (english ? 'Show password' : 'Mostrar contraseña');
  button.setAttribute('aria-label', label);
  button.title = label;
  icon.innerHTML = visible
    ? '<path d="m3 3 18 18"/><path d="M10.6 5.1A11 11 0 0 1 12 5c6.4 0 10 7 10 7a15 15 0 0 1-3.2 3.9"/><path d="M6.4 6.4C3.6 8.2 2 12 2 12s3.6 7 10 7a10 10 0 0 0 4.2-.9"/><path d="M10 10a3 3 0 0 0 4 4"/>'
    : '<path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/>';
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
    redirectTo: window.location.origin + '/reset-password.html'
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
