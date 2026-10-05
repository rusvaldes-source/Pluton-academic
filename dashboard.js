const SUPABASE_URL = 'https://paifjzznyiehwidoqjqb.supabase.co';
const SUPABASE_PUBLISHABLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBhaWZqenpueWllaHdpZG9xanFiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTExMjkyNzcsImV4cCI6MjEwNjcwNTI3N30.JQTcl818gsTe82y8WYHooEiWWKdJxRNmEbPnk0fkQ10';

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
