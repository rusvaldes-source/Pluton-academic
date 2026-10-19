// Never put a Supabase service_role key in browser code.
// Inject the existing site's PUBLIC Supabase URL and publishable/anon key via
// a separately deployed admin-config.js: window.PLUTON_ADMIN_CONFIG = { url, publishableKey }.
const $ = id => document.getElementById(id);
const status = msg => { $('status').textContent = msg; };
let sb, language = 'es';
$('language').addEventListener('click', () => {
  language = language === 'es' ? 'en' : 'es';
  document.documentElement.lang = language;
  document.querySelectorAll('[data-es][data-en]').forEach(el => el.textContent = el.dataset[language]);
  $('language').textContent = language === 'es' ? 'EN' : 'ES';
});
async function init() {
  const config = window.PLUTON_ADMIN_CONFIG;
  if (!config?.url || !config?.publishableKey) return status('Panel no configurado / Panel not configured.');
  try {
    const { createClient } = await import('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm');
    sb = createClient(config.url, config.publishableKey);
    $('login').hidden = false;
    sb.auth.onAuthStateChange(() => { setTimeout(refresh, 0); });
    await refresh();
  } catch { status('No se pudo conectar con la autenticación / Authentication unavailable.'); }
}
async function refresh() {
  if (!sb) return;
  $('private').hidden = true;
  const { data: { user }, error } = await sb.auth.getUser();
  if (error || !user) { $('login').hidden = false; return status('Inicia sesión con una cuenta autorizada / Sign in with an authorized account.'); }
  const { data: allowed, error: roleError } = await sb.rpc('is_pluton_admin');
  if (roleError || allowed !== true) { await sb.auth.signOut(); $('login').hidden = false; $('password').value = ''; return status('Acceso denegado: cuenta sin permisos de administrador. Sesión cerrada / Access denied. Signed out.'); }
  $('login').hidden = true;
  $('private').hidden = false;
  $('who').textContent = user.email || '';
  status('');
}
$('login').addEventListener('submit', async event => {
  event.preventDefault();
  if (!sb) return;
  status('Verificando credenciales…');
  const { error } = await sb.auth.signInWithPassword({ email: $('email').value, password: $('password').value });
  $('password').value = '';
  if (error) status('No se pudo iniciar sesión / Sign in failed.');
  else await refresh();
});
$('logout').addEventListener('click', async () => { if (sb) await sb.auth.signOut(); $('private').hidden = true; await refresh(); });
init();
