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

  authMessage('Creando cuenta...');

  const { error } = await sb.auth.signUp({
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
}

// INICIAR SESIÓN
async function signIn() {
  const email = document.getElementById('authEmail')?.value.trim();
  const password = document.getElementById('authPassword')?.value;

  if (!email || !password) {
    authMessage('Escribe tu correo y contraseña.');
    return;
  }

  authMessage('Entrando...');

  const { error } = await sb.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    authMessage(error.message);
    return;
  }

  window.location.href = 'dashboard.html';
}

// RECUPERAR CONTRASEÑA
async function resetPassword() {
  const email = document.getElementById('authEmail')?.value.trim();

  if (!email) {
    authMessage('Escribe primero tu correo electrónico.');
    return;
  }

  authMessage('Enviando enlace...');

  const { error } = await sb.auth.resetPasswordForEmail(email, {
    redirectTo: window.location.origin
  });

  if (error) {
    authMessage(error.message);
    return;
  }

  authMessage('Revisa tu correo para restablecer la contraseña.');
}

// CURSOS
function course(code) {
  show(
    'Curso ' + code,
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
    'Membresía ' + name,
    `
    <p>Has seleccionado la membresía <strong>${name}</strong>.</p>
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

// FILTROS DEL CATÁLOGO
function initCourseFilters() {
  const buttons = document.querySelectorAll('.filters button[data-filter]');
  const cards = document.querySelectorAll('.courses article[data-cat]');
  buttons.forEach(button => button.addEventListener('click', () => {
    buttons.forEach(b => b.classList.remove('active'));
    button.classList.add('active');
    const filter = button.dataset.filter;
    cards.forEach(card => {
      card.style.display = filter === 'all' || card.dataset.cat === filter ? '' : 'none';
    });
  }));
}

// IDIOMA ES / EN. Traduce la interfaz principal sin alterar datos del usuario.
const translations = {
  en: {
    'Cursos':'Courses','Membresías':'Memberships','Mi plataforma':'My platform','Certificados':'Certificates','Comunidad':'Community','Iniciar sesión':'Sign in',
    'Explorar cursos':'Explore courses','Ver membresías':'View memberships','Todos':'All','Salud':'Health','Desarrollo profesional':'Professional development',
    'Cerrar sesión':'Sign out','Panel del Estudiante':'Student Dashboard','Bienvenido':'Welcome','Mi membresía':'My membership','Mis cursos':'My courses','Mi progreso':'My progress'
  }
};
function applyLanguage(lang) {
  document.documentElement.lang = lang;
  localStorage.setItem('pluton-lang', lang);
  document.querySelectorAll('[data-es]').forEach(el => {
    el.textContent = lang === 'en' ? (el.dataset.en || el.dataset.es) : el.dataset.es;
  });
  const btn = document.getElementById('languageToggle');
  if (btn) btn.textContent = lang === 'es' ? 'EN' : 'ES';
}
function toggleLanguage() {
  applyLanguage((localStorage.getItem('pluton-lang') || 'es') === 'es' ? 'en' : 'es');
}

document.addEventListener('DOMContentLoaded', () => {
  initCourseFilters();
  applyLanguage(localStorage.getItem('pluton-lang') || 'es');
});
