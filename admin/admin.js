// Never put a Supabase service_role key in browser code.
// Inject the existing site's PUBLIC Supabase URL and publishable/anon key via
// a separately deployed admin-config.js: window.PLUTON_ADMIN_CONFIG = { url, publishableKey }.
const $ = id => document.getElementById(id);
const status = msg => { $('status').textContent = msg; };
let sb, language = (()=>{try{return localStorage.getItem('pluton-lang')==='en'?'en':'es'}catch{return 'es'}})(), authRevision = 0, authUserId = null, recoveryMode = false;
let privateModules = [];
function clearPrivateData() {
  for (const module of privateModules) { try { module?.unmount?.(); } catch {} }
  for (const id of ['courseEditor','certificatesEditor']) $(id)?.replaceChildren();
  privateModules = [];
  for (const id of ['studentsRows','newsList','reportsList']) $(id).replaceChildren();
  for (const id of ['studentsStatus','newsStatus','reportsStatus','who']) $(id).textContent = '';
  $('newsForm').reset();
  $('newPassword').value = '';
  $('password').value = '';
  $('newsForm').querySelector('button[type="submit"]').disabled = false;
}
function invalidatePrivateData() {
  authRevision++;
  authUserId = null;
  $('private').hidden = true;
  $('setup').hidden = false;
  clearPrivateData();
}
async function safeRequest(request) {
  try { return await request(); } catch { return { data: null, error: new Error('Connection unavailable') }; }
}
function translate() {
  document.documentElement.lang = language;
  document.querySelectorAll('[data-es][data-en]').forEach(el => {
    const field = el.querySelector('input, textarea, select');
    if (field) {
      const node = Array.from(el.childNodes).find(n => n.nodeType === 3);
      if (node) node.textContent = el.dataset[language] + ' ';
    } else el.textContent = el.dataset[language];
  });
  $('language').textContent = language === 'es' ? 'EN' : 'ES';
}
$('language').addEventListener('click', () => {
  language = language === 'es' ? 'en' : 'es';
  try { localStorage.setItem('pluton-lang', language); } catch {}
  translate();
  for (const module of privateModules) module?.setLanguage?.(language);
});
translate();
async function init() {
  const config = window.PLUTON_ADMIN_CONFIG;
  if (!config?.url || !config?.publishableKey) return status('Panel no configurado / Panel not configured.');
  try {
    const { createClient } = window.supabase;
    sb = createClient(config.url, config.publishableKey);
    $('newPasswordForm').hidden = true;
    $('login').hidden = false;
    sb.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY') {
        invalidatePrivateData();
        authUserId = session?.user?.id || null;
        recoveryMode = true;
        $('newPasswordForm').hidden = false;
        $('login').hidden = true;
        $('resetStatus').textContent = language === 'es' ? 'Escribe tu nueva contraseña.' : 'Enter your new password.';
        return;
      }
      if (event === 'SIGNED_OUT') {
        recoveryMode = false;
        $('newPasswordForm').hidden = true;
        invalidatePrivateData();
        $('login').hidden = false;
        return;
      }
      if (['SIGNED_IN','INITIAL_SESSION','TOKEN_REFRESHED','USER_UPDATED'].includes(event)) {
        if (session?.user?.id !== authUserId) {
          recoveryMode = false;
          $('newPasswordForm').hidden = true;
          $('login').hidden = false;
          invalidatePrivateData();
          authUserId = session?.user?.id || null;
        }
        if (!recoveryMode) {
          if (!$('private').hidden) {
            const revision = authRevision;
            setTimeout(async()=>{
              const {data: allowed, error} = await safeRequest(()=>sb.rpc('is_pluton_admin'));
              if (revision === authRevision && (error || allowed !== true)) await refresh();
            },0);
          } else setTimeout(refresh, 0);
        }
      }
    });
    if ($('newPasswordForm').hidden) await refresh();
  } catch { status('No se pudo conectar con la autenticación / Authentication unavailable.'); }
}
async function refresh() {
  if (!sb || recoveryMode) return;
  const revision = ++authRevision;
  $('private').hidden = true;
  $('setup').hidden = false;
  clearPrivateData();
  const { data: authData, error } = await safeRequest(()=>sb.auth.getUser());
  const user = authData?.user;
  if (revision !== authRevision) return;
  if (error || !user) { $('login').hidden = false; return status('Inicia sesión con una cuenta autorizada / Sign in with an authorized account.'); }
  authUserId = user.id;
  const { data: allowed, error: roleError } = await safeRequest(()=>sb.rpc('is_pluton_admin'));
  if (revision !== authRevision) return;
  if (roleError || allowed !== true) { $('login').hidden = false; $('password').value = ''; return status(roleError ? 'No se pudo verificar el permiso / Permission verification unavailable.' : 'Cuenta sin permiso administrativo. Tu sesión de estudiante se conserva / No admin permission. Your student session is preserved.'); }
  $('login').hidden = true;
  $('setup').hidden = true;
  $('private').hidden = false;
  $('who').textContent = user.email || '';
  status('');
  const isCurrent = () => revision === authRevision && !$('private').hidden;
  for (const [api, id] of [[window.PlutonCourseEditor, 'courseEditor'], [window.PlutonCertificates, 'certificatesEditor']]) {
    if (api && $(id)) {
      try { privateModules.push(api.mount({client: sb, container: $(id), isCurrent, language})); }
      catch { $(id).textContent = language === 'es' ? 'No se pudo abrir el módulo. Actualiza el panel.' : 'Could not open module. Refresh the panel.'; }
    }
  }
  await reloadData(revision);
}
async function reloadData(revision = authRevision) {
  if (!sb || $('private').hidden || revision !== authRevision) return;
  await Promise.allSettled([loadStudents(revision), loadNews(revision), loadReports(revision)]);
}
$('refreshData').addEventListener('click', async () => {
  if (!sb || $('private').hidden) return;
  const { data: allowed, error } = await safeRequest(()=>sb.rpc('is_pluton_admin'));
  if (error || allowed !== true) { await refresh(); return; }
  await reloadData();
});
async function loadStudents(revision = authRevision) {
  if ($('private').hidden || revision !== authRevision) return;
  const body = $('studentsRows');
  body.replaceChildren();
  $('studentsStatus').textContent = language === 'es' ? 'Cargando estudiantes…' : 'Loading students…';
  const { data, error } = await safeRequest(()=>sb.from('profiles').select('email,membership,status,progress').order('email', { ascending: true }).limit(100));
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
  const { error } = await safeRequest(()=>sb.auth.signInWithPassword({ email: $('email').value, password: $('password').value }));
  $('password').value = '';
  if (error) status('No se pudo iniciar sesión / Sign in failed.');
  else { status('Abriendo administración… / Opening administration…'); await refresh(); }
});
$('newPasswordForm').addEventListener('submit', async event => {
  event.preventDefault();
  if (!sb || !recoveryMode || $('newPasswordForm').hidden) return;
  const password = $('newPassword').value;
  const revision = authRevision;
  if (password.length < 12) return;
  const button = $('newPasswordForm').querySelector('button[type="submit"]');
  button.disabled = true;
  try {
    const { error } = await sb.auth.updateUser({ password });
    if (revision !== authRevision) return;
    $('newPassword').value = '';
    if (error) { $('resetStatus').textContent = language === 'es' ? 'No se pudo actualizar la contraseña.' : 'Could not update password.'; return; }
    recoveryMode = false;
    $('newPasswordForm').hidden = true;
    $('login').hidden = false;
    $('resetStatus').textContent = language === 'es' ? 'Contraseña actualizada. Ya puedes iniciar sesión con tu nueva contraseña.' : 'Password updated. You can now sign in with your new password.';
    await refresh();
  } catch { $('resetStatus').textContent = language === 'es' ? 'Error de conexión.' : 'Connection error.'; }
  finally { button.disabled = false; }
});
$('forgotPassword').addEventListener('click', async () => {
  if (!sb) return;
  const email = $('email').value.trim();
  if (!email || !$('email').checkValidity()) {
    $('resetStatus').textContent = language === 'es' ? 'Introduce primero tu correo electrónico válido.' : 'Enter your valid email address first.';
    $('email').focus();
    return;
  }
  const button = $('forgotPassword');
  button.disabled = true;
  try {
    const { error } = await sb.auth.resetPasswordForEmail(email, { redirectTo: 'https://www.plutonacademic.com/admin/' });
    $('resetStatus').textContent = error
      ? (language === 'es' ? 'No se pudo enviar el enlace. Comprueba la configuración de recuperación.' : 'Could not send the link. Check password recovery settings.')
      : (language === 'es' ? 'Si existe la cuenta, recibirás un correo con el enlace para recuperar tu contraseña.' : 'If the account exists, you will receive a password recovery email.');
  } catch {
    $('resetStatus').textContent = language === 'es' ? 'Error de conexión.' : 'Connection error.';
  } finally { button.disabled = false; }
});
$('logout').addEventListener('click', async () => {
  invalidatePrivateData();
  recoveryMode = false;
  $('newPasswordForm').hidden = true;
  $('newPassword').value = '';
  $('password').value = '';
  $('login').hidden = false;
  const {error} = await safeRequest(()=>sb.auth.signOut());
  status(error ? 'No se pudo confirmar el cierre de sesión / Sign out could not be confirmed.' : 'Sesión cerrada / Signed out.');
});
async function loadReports(revision = authRevision) {
  if ($('private').hidden || revision !== authRevision) return;
  const list = $('reportsList'); list.replaceChildren();
  const { data, error } = await safeRequest(()=>sb.from('connect_reports').select('id,post_id,reason,status,created_at').order('created_at', { ascending: false }).limit(50));
  if (revision !== authRevision) return;
  if (error) { $('reportsStatus').textContent = 'No se pudieron cargar las denuncias / Reports unavailable.'; return; }
  $('reportsStatus').textContent = `${data?.length || 0} denuncias visibles / visible reports`;
  for (const report of data || []) {
    const li = document.createElement('li');
    const description = document.createElement('span'); description.textContent = `#${report.id} · Post ${report.post_id} · ${report.status} · ${report.reason} `; li.append(description);
    if (report.status === 'open') {
      for (const next of ['reviewed','dismissed']) {
        const button = document.createElement('button'); button.type = 'button'; button.textContent = next === 'reviewed' ? 'Revisada / Reviewed' : 'Descartar / Dismiss';
        button.addEventListener('click', async () => {
          if (revision !== authRevision || $('private').hidden) return;
          if (!window.confirm('¿Confirmar cambio de estado? / Confirm status change?')) return;
          button.disabled = true;
          const { data: updated, error } = await safeRequest(()=>sb.from('connect_reports').update({ status: next, reviewed_at: new Date().toISOString() }).eq('id', report.id).eq('status','open').select('id'));
          if (revision !== authRevision || $('private').hidden) return;
          $('reportsStatus').textContent = error || updated?.length !== 1 ? 'No se confirmó el cambio / Change not confirmed.' : 'Estado actualizado / Status updated.';
          await loadReports(revision);
        }); li.append(button);
      }
    }
    list.append(li);
  }
}
async function loadNews(revision = authRevision) {
  if ($('private').hidden || revision !== authRevision) return;
  const list = $('newsList'); list.replaceChildren();
  const { data, error } = await safeRequest(()=>sb.from('pluton_news').select('id,title_es,title_en,video_url,status,created_at').order('created_at', { ascending: false }).limit(30));
  if (revision !== authRevision) return;
  if (error) { $('newsStatus').textContent = 'No se pudieron cargar las noticias / News unavailable.'; return; }
  $('newsStatus').textContent = data?.length ? `${data.length} noticias visibles / visible news items` : 'No hay noticias guardadas / No saved news items.';
  for (const item of data || []) {
    const li = document.createElement('li');
    const name = document.createElement('span'); name.textContent = `${item.title_es} / ${item.title_en} — ${item.status} `; li.append(name);
    if (videoSource(item.video_url)) {
      const videoLink = document.createElement('a');
      videoLink.href = item.video_url;
      videoLink.target = '_blank';
      videoLink.rel = 'noopener noreferrer';
      videoLink.textContent = ' Abrir video / Open video';
      li.append(videoLink);
      const preview = document.createElement('button');
      preview.type = 'button';
      preview.textContent = 'Vista previa / Preview';
      preview.addEventListener('click', () => {
        const existing = li.querySelector('iframe');
        if (existing) { existing.remove(); return; }
        const frame = document.createElement('iframe');
        frame.title = 'Video preview';
        frame.loading = 'lazy';
        frame.allowFullscreen = true;
        frame.allow = 'encrypted-media; picture-in-picture';
        frame.referrerPolicy = 'strict-origin-when-cross-origin';
        let link;
        try { link = new URL(item.video_url); } catch { return; }
        if (link.protocol !== 'https:') return;
        let id = '';
        if (['youtube.com','www.youtube.com'].includes(link.hostname)) id = link.searchParams.get('v') || link.pathname.replace('/embed/','');
        if (['youtu.be','www.youtu.be'].includes(link.hostname)) id = link.pathname.slice(1);
        if (/^[A-Za-z0-9_-]{11}$/.test(id)) frame.src = 'https://www.youtube-nocookie.com/embed/' + id;
        else if (['vimeo.com','www.vimeo.com'].includes(link.hostname) && /^\/[0-9]+$/.test(link.pathname)) frame.src = 'https://player.vimeo.com/video/' + link.pathname.slice(1);
        else return;
        li.append(frame);
      });
      li.append(preview);
    }
    if (item.status !== 'published') {
      const next = item.status === 'draft' ? 'review' : 'published';
      const button = document.createElement('button'); button.type = 'button';
      button.textContent = next === 'review' ? 'Enviar a revisión / Submit for review' : 'Aprobar publicación / Approve publication';
      button.addEventListener('click', async () => {
        if (revision !== authRevision || $('private').hidden) return;
        const question = next === 'published' ? '¿Confirmas la aprobación de esta noticia? / Approve this news item?' : '¿Enviar a revisión? / Send for review?';
        if (!window.confirm(question)) return;
        button.disabled = true;
        const patch = { status: next, updated_at: new Date().toISOString() };
        if (next === 'published') patch.published_at = new Date().toISOString();
        const { data: updated, error } = await safeRequest(()=>sb.from('pluton_news').update(patch).eq('id', item.id).eq('status', item.status).select('id'));
        if (revision !== authRevision || $('private').hidden) return;
        $('newsStatus').textContent = error || updated?.length !== 1 ? 'No se confirmó el cambio / Change not confirmed.' : 'Estado actualizado / Status updated.';
        await loadNews(revision);
      });
      li.append(button);
    }
    list.append(li);
  }
}
$('newsForm').addEventListener('submit', async event => {
  event.preventDefault();
  if (!sb || $('private').hidden) return;
  const revision = authRevision;
  $('newsStatus').textContent = 'Guardando / Saving…';
  const entry = { title_es: $('newsTitleEs').value.trim(), title_en: $('newsTitleEn').value.trim(), body_es: $('newsBodyEs').value.trim(), body_en: $('newsBodyEn').value.trim(), status: 'draft', video_url: $('newsVideoUrl').value.trim() || null };
  if (Object.entries(entry).filter(([key]) => key !== 'video_url').map(([,value]) => value).some(v => !v)) { $('newsStatus').textContent = 'Completa todos los campos / Complete all fields.'; return; }
  if (entry.video_url && !videoSource(entry.video_url)) {
    $('newsStatus').textContent = 'Enlace de video no admitido / Unsupported video link.';
    return;
  }
  const submitButton = $('newsForm').querySelector('button[type="submit"]');
  if (submitButton.disabled) return;
  submitButton.disabled = true;
  try {
    const { data, error } = await sb.from('pluton_news').insert(entry).select('id');
    if (revision !== authRevision || $('private').hidden) return;
    if (error || data?.length !== 1) {
      $('newsStatus').textContent = 'No se confirmó el guardado / Save not confirmed.';
      return;
    }
    $('newsForm').reset();
    $('newsStatus').textContent = 'Borrador guardado / Draft saved.';
    await loadNews(revision);
  } catch {
    if (revision === authRevision) $('newsStatus').textContent = 'Error de conexión / Connection error.';
  } finally {
    if (revision === authRevision) submitButton.disabled = false;
  }
});
function videoSource(value) {
  try {
    const u = new URL(value);
    if (u.protocol !== 'https:' || u.username || u.password) return null;
    let id = '';
    if (['youtube.com','www.youtube.com'].includes(u.hostname)) {
      if (u.pathname === '/watch') id = u.searchParams.get('v') || '';
      else if (/^\/embed\/[A-Za-z0-9_-]{11}$/.test(u.pathname)) id = u.pathname.slice(7);
    }
    if (['youtu.be','www.youtu.be'].includes(u.hostname)) id = u.pathname.slice(1);
    if (/^[A-Za-z0-9_-]{11}$/.test(id)) return u;
    if (['vimeo.com','www.vimeo.com'].includes(u.hostname) && /^\/[0-9]+$/.test(u.pathname)) return u;
  } catch {}
  return null;
}
init();
