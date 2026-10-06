const SUPABASE_URL = 'https://paifjzznyiehwidoqjqb.supabase.co';
const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_-Ip2JRpDGn-Ehx2C94Tk3Q_jg7p7VLz';
const sb = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY
);

async function loadStudent() {
  const studentEmail = document.getElementById('student-email');
  if (!studentEmail) return;

  studentEmail.textContent = 'Comprobando sesión...';

  try {
    const { data, error } = await sb.auth.getSession();

    if (error) {
      studentEmail.textContent = 'Error al comprobar la sesión';
      return;
    }

    const user = data?.session?.user;

    if (!user) {
      studentEmail.textContent = 'Sesión no iniciada';
      return;
    }

    studentEmail.textContent = user.email;
    const { data: profile } = await sb.from('profiles').select('*').eq('email', user.email).single();
  } catch (error) {
    
    studentEmail.textContent = 'Error al cargar tu cuenta';
  }
}

async function closeStudentSession() {
  await sb.auth.signOut();
  window.location.href = '/';
}

document.addEventListener('DOMContentLoaded', () => {
  loadStudent();

  const logoutButton = document.getElementById('logoutButton');

  if (logoutButton) {
    logoutButton.addEventListener('click', closeStudentSession);
  }
});
