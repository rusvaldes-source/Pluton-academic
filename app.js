const SUPABASE_URL = 'https://paifjzznyiehwidoqjqb.supabase.co';
const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_Ip2JRpDGn-Ehx2C94Tk3Q_jg7p7VLz';

const sb = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY
);

function show(title, html) {
  document.getElementById('modalTitle').textContent = title;
  document.getElementById('modalText').innerHTML = html;
  document.getElementById('modal').classList.add('show');
}

function closeModal() {
  document.getElementById('modal').classList.remove('show');
}

function authMessage(msg) {
  const e = document.getElementById('authMessage');
  if (e) e.textContent = msg;
}

function openLogin() {
  show('Área del estudiante', `
    <div class="auth-box">
      <label>Correo electrónico</label>
      <input id="authEmail" type="email" autocomplete="email">

      <label>Contraseña</label>
      <input id="authPassword" type="password" autocomplete="current-password">

      <button onclick="signIn()">Iniciar sesión</button>
      <button onclick="signUp()">Crear cuenta</button>
      <button onclick="resetPassword()">Olvidé mi contraseña</button>

      <p id="authMessage"></p>
    </div>
  `);
}

async function signUp() {
  const email = document.getElementById('authEmail').value.trim();
  const password = document.getElementById('authPassword').value;

  if (!email || password.length < 6) {
    authMessage('Escribe un correo válido y una contraseña de al menos 6 caracteres.');
    return;
  }

  authMessage('Creando cuenta...');

  const { error } = await sb.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: location.origin
    }
  });

  if (error) {
    authMessage(error.message);
    return;
  }

  authMessage('Revisa tu correo para confirmar tu cuenta.');
}

async function signIn() {
  const email = document.getElementById('authEmail').value.trim();
  const password = document.getElementById('authPassword').value;

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
