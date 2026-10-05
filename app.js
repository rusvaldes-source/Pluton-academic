alert("APP JS FUNCIONANDO");const SUPABASE_URL = 'https://paifjzznyiehwidoqjqb.supabase.co';
const SUPABASE_PUBLISHABLE_KEY ="sb_publishable_Ip2JRpDGn-Ehx2C94Tk3Q_jg7p7VLz"; 

const sb = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY
);

// PANEL DEL ESTUDIANTE
async function loadStudent() {
  const studentEmail = document.getElementById('student-email');

  if (!studentEmail) return;

  studentEmail.textContent = 'Comprobando sesión...';

  try {
    const { data, error } = await sb.auth.getSession();

    if (error) {
      console.error(error);
      studentEmail.textContent = 'Error al comprobar la sesión';
      return;
    }

    const user = data?.session?.user;

    if (!user) {
      studentEmail.textContent = 'Sesión no iniciada';
      return;
    }

    studentEmail.textContent = user.email;
  } catch (error) {
    console.error(error);
    studentEmail.textContent = 'Error al cargar tu cuenta';
  }
}

// CERRAR SESIÓN
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

sb.auth.onAuthStateChange(() => {
  loadStudent();
});
