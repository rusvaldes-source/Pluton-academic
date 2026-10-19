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
  const { data: { user } = {}, error } = await sb.auth.getUser();
  if (error || !user) { $('login').hidden = false; return status('Inicia sesión con una cuenta autorizada / Sign in with an authorized account.'); }
  const { data: allowed, error: roleError } = await sb.rpc('is_pluton_admin');
  if (roleError || allowed !== true) { await sb.auth.signOut(); $('login').hidden = false; $('password').value = ''; return status('Acceso denegado o verificación no disponible / Access denied or verification unavailable.'); }
  $('login').hidden = true;
  $('private').hidden = false;
  $('who').textContent = user.email || '';
  status('');
  await loadStudents();
}
async function loadStudents() {
  const body = $('studentsRows');
  body.replaceChildren();
  $('studentsStatus').textContent = language === 'es' ? 'Cargando estudiantes…' : 'Loading students…';
  const { data, error } = await sb.from('profiles').select('email,membership,status,progress').order('email', { ascending: true }).limit(100);
  if (error) { $('studentsStatus').textContent = language === 'es' ? 'No se pudo consultar el directorio.' : 'Could not load the directory.'; return; }
  for (const student of data || []) {
    const tr = document.createElement('tr');
    for (const value of [student.email, student.membership, student.status, student.progress]) {
      const td = document.createElement('td'); td.textContent = String(value ?? '—'); tr.append(td);
    }
    body.append(tr);
  }
  $('studentsStatus').textContent = (data?.length || 0) + (language === 'es' ? ' registros visibles (máximo 100).' : ' visible records (max 100).');
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
