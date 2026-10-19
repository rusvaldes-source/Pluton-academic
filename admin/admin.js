// Never put a Supabase service_role key in browser code.
// Inject the existing site's PUBLIC Supabase URL and publishable/anon key via
// a separately deployed admin-config.js: window.PLUTON_ADMIN_CONFIG = { url, publishableKey }.
const $ = id => document.getElementById(id);
const status = msg => { $('status').textContent = msg; };
let sb, language = 'es', authRevision = 0;
function clearPrivateData() {
  for (const id of ['studentsRows','newsList','reportsList']) $(id).replaceChildren();
  for (const id of ['studentsStatus','newsStatus','reportsStatus','who']) $(id).textContent = '';
  $('newsForm').reset();
}
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
  const revision = ++authRevision;
  $('private').hidden = true;
  clearPrivateData();
  const { data: { user } = {}, error } = await sb.auth.getUser();
  if (revision !== authRevision) return;
  if (error || !user) { $('login').hidden = false; return status('Inicia sesión con una cuenta autorizada / Sign in with an authorized account.'); }
  const { data: allowed, error: roleError } = await sb.rpc('is_pluton_admin');
  if (revision !== authRevision) return;
  if (roleError || allowed !== true) { await sb.auth.signOut(); $('login').hidden = false; $('password').value = ''; return status('Acceso denegado o verificación no disponible / Access denied or verification unavailable.'); }
  $('login').hidden = true;
  $('private').hidden = false;
  $('who').textContent = user.email || '';
  status('');
  await Promise.all([loadStudents(revision), loadNews(revision), loadReports(revision)]);
}
async function loadStudents(revision = authRevision) {
  const body = $('studentsRows');
  body.replaceChildren();
  $('studentsStatus').textContent = language === 'es' ? 'Cargando estudiantes…' : 'Loading students…';
  const { data, error } = await sb.from('profiles').select('email,membership,status,progress').order('email', { ascending: true }).limit(100);
  if (revision !== authRevision) return;
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
$('logout').addEventListener('click', async () => { authRevision++; $('private').hidden = true; clearPrivateData(); if (sb) await sb.auth.signOut(); await refresh(); });
async function loadReports(revision = authRevision) {
  const list = $('reportsList'); list.replaceChildren();
  const { data, error } = await sb.from('connect_reports').select('id,post_id,reason,status,created_at').order('created_at', { ascending: false }).limit(50);
  if (revision !== authRevision) return;
  if (error) { $('reportsStatus').textContent = 'No se pudieron cargar las denuncias / Reports unavailable.'; return; }
  $('reportsStatus').textContent = `${data.length} denuncias visibles / visible reports`;
  for (const report of data) {
    const li = document.createElement('li');
    const description = document.createElement('span'); description.textContent = `#${report.id} · Post ${report.post_id} · ${report.status} · ${report.reason} `; li.append(description);
    if (report.status === 'open') {
      for (const next of ['reviewed','dismissed']) {
        const button = document.createElement('button'); button.type = 'button'; button.textContent = next === 'reviewed' ? 'Revisada / Reviewed' : 'Descartar / Dismiss';
        button.addEventListener('click', async () => {
          if (!window.confirm('¿Confirmar cambio de estado? / Confirm status change?')) return;
          button.disabled = true;
          const { data: updated, error } = await sb.from('connect_reports').update({ status: next, reviewed_at: new Date().toISOString() }).eq('id', report.id).eq('status','open').select('id');
          $('reportsStatus').textContent = error || updated?.length !== 1 ? 'No se confirmó el cambio / Change not confirmed.' : 'Estado actualizado / Status updated.';
          await loadReports();
        }); li.append(button);
      }
    }
    list.append(li);
  }
}
async function loadNews(revision = authRevision) {
  const list = $('newsList'); list.replaceChildren();
  const { data, error } = await sb.from('pluton_news').select('id,title_es,title_en,status,created_at').order('created_at', { ascending: false }).limit(30);
  if (revision !== authRevision) return;
  if (error) { $('newsStatus').textContent = 'No se pudieron cargar las noticias / News unavailable.'; return; }
  for (const item of data || []) {
    const li = document.createElement('li');
    const name = document.createElement('span'); name.textContent = `${item.title_es} / ${item.title_en} — ${item.status} `; li.append(name);
    if (item.status !== 'published') {
      const next = item.status === 'draft' ? 'review' : 'published';
      const button = document.createElement('button'); button.type = 'button';
      button.textContent = next === 'review' ? 'Enviar a revisión / Submit for review' : 'Aprobar publicación / Approve publication';
      button.addEventListener('click', async () => {
        const question = next === 'published' ? '¿Confirmas la aprobación de esta noticia? / Approve this news item?' : '¿Enviar a revisión? / Send for review?';
        if (!window.confirm(question)) return;
        button.disabled = true;
        const patch = { status: next, updated_at: new Date().toISOString() };
        if (next === 'published') patch.published_at = new Date().toISOString();
        const { data: updated, error } = await sb.from('pluton_news').update(patch).eq('id', item.id).eq('status', item.status).select('id');
        $('newsStatus').textContent = error || updated?.length !== 1 ? 'No se confirmó el cambio / Change not confirmed.' : 'Estado actualizado / Status updated.';
        await loadNews();
      });
      li.append(button);
    }
    list.append(li);
  }
}
$('newsForm').addEventListener('submit', async event => {
  event.preventDefault();
  if (!sb || $('private').hidden) return;
  $('newsStatus').textContent = 'Guardando / Saving…';
  const entry = { title_es: $('newsTitleEs').value.trim(), title_en: $('newsTitleEn').value.trim(), body_es: $('newsBodyEs').value.trim(), body_en: $('newsBodyEn').value.trim(), status: 'draft' };
  if (Object.values(entry).some(v => !v)) { $('newsStatus').textContent = 'Completa todos los campos / Complete all fields.'; return; }
  const { error } = await sb.from('pluton_news').insert(entry);
  if (error) { $('newsStatus').textContent = 'No se pudo guardar / Save failed.'; return; }
  $('newsForm').reset(); $('newsStatus').textContent = 'Borrador guardado / Draft saved.';
  await loadNews();
});
init();
