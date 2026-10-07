const SUPABASE_URL = 'https://paifjzznyiehwidoqjqb.supabase.co';
const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_-Ip2JRpDGn-Ehx2C94Tk3Q_jg7p7VLz';
const sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

async function loadStudent() {
  const emailEl = document.getElementById('student-email');
  const membershipEl = document.getElementById('membership');
  try {
    const { data, error } = await sb.auth.getSession();
    if (error) throw error;
    const user = data?.session?.user;
    if (!user) {
      if (emailEl) emailEl.textContent = 'Sesión no iniciada';
      if (membershipEl) membershipEl.textContent = '—';
      setTimeout(() => window.location.href = 'index.html', 900);
      return;
    }
    if (emailEl) emailEl.textContent = user.email || 'Usuario';
    if (membershipEl) membershipEl.textContent = 'Comprobando...';

    // Use maybeSingle so a missing profile does not crash the dashboard.
    const { data: profile, error: profileError } = await sb
      .from('profiles')
      .select('membership')
      .eq('email', user.email)
      .maybeSingle();

    if (profileError) {
      console.error('Profile lookup:', profileError);
      if (membershipEl) membershipEl.textContent = 'Sin membresía';
      return;
    }
    if (membershipEl) membershipEl.textContent = profile?.membership || 'Sin membresía';
  } catch (error) {
    console.error('Dashboard:', error);
    if (emailEl) emailEl.textContent = 'Error al cargar tu cuenta';
    if (membershipEl) membershipEl.textContent = 'No disponible';
  }
}

async function closeStudentSession() {
  const button = document.getElementById('logoutButton');
  if (button) button.disabled = true;
  await sb.auth.signOut();
  window.location.href = 'index.html';
}

document.addEventListener('DOMContentLoaded', () => {
  loadStudent();
  document.getElementById('logoutButton')?.addEventListener('click', closeStudentSession);
});
