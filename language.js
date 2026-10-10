(function(){
'use strict';
const dictionary={
'Recursos':'Resources',
'Conocimiento que se convierte en oportunidades':'Knowledge that turns into opportunities',
'Aprende, practica y demuestra lo que sabes, desde cualquier dispositivo.':'Learn, practice and show what you know, from any device.',
'Explora cursos prácticos en distintas áreas.':'Explore practical courses in different fields.',
'Responde actividades y guarda tus apuntes.':'Complete activities and save your notes.',
'Sigue tu progreso y celebra cada logro.':'Track your progress and celebrate every achievement.',
'PLUTÓN ACADEMIC | Tu futuro comienza con conocimiento':'PLUTÓN ACADEMIC | Your future begins with knowledge',
'Cursos | PLUTÓN ACADEMIC':'Courses | PLUTÓN ACADEMIC',
'Panel del Estudiante | PLUTÓN ACADEMIC':'Student Dashboard | PLUTÓN ACADEMIC',
'Membresía START':'Membership START',
'Membresía PLUS':'Membership PLUS',
'Membresía PREMIUM':'Membership PREMIUM',
'Guardado en este dispositivo.':'Saved on this device.',
'Notas borradas.':'Notes cleared.',
'No se pudo guardar en este dispositivo.':'Unable to save on this device.',
'No se puede guardar en este dispositivo.':'Storage is unavailable.',
'Almacenamiento no disponible':'Storage unavailable',
'Buscando tu próxima lección…':'Finding your next lesson…',
'Buscar / Search':'Search',
'Buscar cursos por nombre o código / Search courses':'Search courses by name or code',
'Lecciones introductorias de demostración. El progreso se guarda en este dispositivo y se sincroniza al iniciar sesión, cuando hay conexión.':'Introductory demo lessons. Progress is saved on this device and synced when you sign in and have a connection.',
'Revisa tu correo para confirmar tu cuenta.':'Check your email to confirm your account.',
'Revisa tu correo para restablecer la contraseña.':'Check your email to reset your password.',
'Credenciales incorrectas. Revisa tu correo y contraseña.':'Invalid credentials. Check your email and password.',
'Confirma tu correo antes de iniciar sesión.':'Confirm your email before signing in.',
'Espera unos minutos antes de intentarlo de nuevo.':'Wait a few minutes before trying again.',
'No se pudo completar la solicitud. Inténtalo de nuevo.':'Could not complete the request. Please try again.',
'No se pudo cerrar la sesión. Inténtalo de nuevo.':'Could not sign out. Please try again.',
'Cuenta ya registrada. Inicia sesión o recupera tu contraseña.':'Account already registered. Sign in or reset your password.',
'El registro de cuentas no está disponible.':'Account registration is unavailable.',
'Usuario':'User',
'Menú':'Menu',
'PLUTÓN ACADEMIC — educación digital':'PLUTÓN ACADEMIC — digital education',
'Accesos de PLUTÓN ACADEMIC':'PLUTÓN ACADEMIC shortcuts',
'Progreso de lecciones':'Lesson progress',
'Resumen visual de progreso':'Visual progress summary',
'Estudiante con computadora y planeta Plutón':'Student with a computer and planet Pluto',
'Mis apuntes':'My notes',
'Cursos favoritos':'Favorite courses',
'Educación real para un futuro brillante':'Real education for a brighter future',
'Cursos prácticos de salud, bienes raíces, negocios y más.':'Practical courses in health, real estate, business and more.',
'Comenzar a aprender →':'Start learning →',
'PLUTÓN ACADEMIC · EDUCACIÓN DIGITAL':'PLUTÓN ACADEMIC · DIGITAL EDUCATION',
'Aprende':'Learn','Practica':'Practice','Avanza':'Progress','EXPLORA TU FUTURO':'EXPLORE YOUR FUTURE','Rutas de aprendizaje':'Learning paths','Plan de estudio':'Study plan','Práctica diaria':'Daily practice','Catálogo ampliado':'Expanded catalog',
'Pregunta de la comunidad':'Community question','Comparte una idea para mejorar tu aprendizaje. La respuesta se guarda únicamente en este navegador.':'Share an idea to improve your learning. Your response is saved only in this browser.','Guardar mi idea':'Save my idea','Borrar mi idea':'Clear my idea','Herramientas para aprender y aplicar':'Tools to learn and apply','Material práctico para organizar tus estudios y tus proyectos.':'Practical resources to organize your studies and projects.','Plan de estudio / Study plan':'Study plan','Define una meta, elige un curso y dedica bloques cortos a practicar.':'Set a goal, choose a course and dedicate short sessions to practice.','Abrir mi cuaderno →':'Open my notebook →','Práctica diaria / Daily practice':'Daily practice','Responde el reto del día y revisa tus respuestas con atención.':'Answer the daily challenge and review your responses carefully.','Ir al reto →':'Go to challenge →','Catálogo ampliado / Expanded catalog':'Expanded catalog','20 cursos iniciales con actividades de comprobación.':'20 introductory courses with knowledge checks.','Explorar lecciones →':'Explore lessons →','Buscar cursos / Search courses':'Search courses','Nombre o código / Name or code':'Name or code','Reto del día / Daily challenge':'Daily challenge','RECURSOS / RESOURCES':'RESOURCES','RETO DEL DÍA / DAILY CHALLENGE':'DAILY CHALLENGE','¿Qué tema te gustaría aprender?':'What topic would you like to learn?','Panel del Estudiante':'Student Dashboard','Bienvenido':'Welcome','Mi membresía':'My membership','Mis cursos':'My courses','Mi progreso':'My progress','Cerrar sesión':'Sign out','Cargando tu cuenta...':'Loading your account...','Cargando...':'Loading...','Sin membresía':'No membership','Cursos':'Courses','Membresías':'Memberships','Mi plataforma':'My platform','Lecciones':'Lessons','Certificados':'Certificates','Comunidad':'Community','Iniciar sesión':'Sign in','Explorar cursos':'Explore courses','Ver membresías':'View memberships','Todos':'All','Salud':'Health','Desarrollo profesional':'Professional development','Seleccionar':'Select','Ver curso →':'View course →','Nivel inicial':'Beginner level','Nivel intermedio':'Intermediate level','Nivel profesional':'Professional level','MÁS COMPLETO':'MOST COMPLETE','CATÁLOGO INICIAL':'INITIAL CATALOG','MEMBRESÍAS':'MEMBERSHIPS','CERTIFICACIÓN DIGITAL':'DIGITAL CERTIFICATION','EDUCACIÓN DIGITAL · A TU RITMO':'DIGITAL EDUCATION · AT YOUR PACE','Tu futuro comienza':'Your future begins','con conocimiento.':'with knowledge.','Aprendizaje práctico para avanzar':'Practical learning to move forward','Elige cómo quieres aprender':'Choose how you want to learn','Área del estudiante':'Student area','Tu propuesta':'Your proposal','¿Qué tema te gustaría aprender?':'What would you like to learn?','PLUTÓN INFORMA':'PLUTÓN NEWS','PARTICIPA':'PARTICIPATE','Noticias':'News','Participa':'Participate','Correo electrónico':'Email','Contraseña':'Password','Crear cuenta':'Create account','Olvidé mi contraseña':'Forgot password','Mis cursos y lecciones':'My courses and lessons','Lecciones introductorias de demostración. El progreso se guarda en este navegador, no en la cuenta del estudiante.':'Introductory demo lessons. Progress is saved in this browser, not in the student account.','Explora las lecciones disponibles y registra tu avance.':'Explore available lessons and track your progress.','Abrir mis cursos →':'Open my courses →','Administración':'Administration','EXPERIENCIA DEL ESTUDIANTE':'STUDENT EXPERIENCE','Todo tu aprendizaje':'All your learning','en un solo lugar.':'in one place.','Entrar a mi plataforma':'Enter my platform','Reconoce cada logro.':'Recognize every achievement.','Aprende. Avanza. Conecta.':'Learn. Grow. Connect.','App móvil':'Mobile app','Nuevos cursos':'New courses','Automatizaciones':'Automations','Ver evolución →':'See progress →','Conocer comunidad →':'Explore community →','Ver sistema →':'View system →','Explorar expansión →':'Explore expansion →','Certificados digitales':'Digital certificates','Multidispositivo':'Multi-device','Materiales y recursos':'Materials and resources','Mi cuenta':'My account','Hola, Estudiante':'Hello, Student','PROGRESO GENERAL':'OVERALL PROGRESS','CERTIFICADO':'CERTIFICATE','DE FINALIZACIÓN':'OF COMPLETION','Tu Nombre':'Your Name','Fundador':'Founder','Código de verificación':'Verification code','Inicio':'Home','Comprobando...':'Checking...','Sesión no iniciada':'Not signed in','Error al cargar tu cuenta':'Error loading your account','No disponible':'Unavailable','Preparación y seguridad':'Preparation and safety','Iniciar lección':'Start lesson','Completar lección':'Complete lesson','Lección completada':'Lesson completed','Volver':'Back','Tu futuro comienza con conocimiento.':'Your future begins with knowledge.',
'Aprende habilidades prácticas, avanza a tu ritmo y construye nuevas oportunidades con una experiencia educativa moderna.':'Learn practical skills, progress at your own pace, and create new opportunities with a modern learning experience.',
'Rutas diseñadas para convertir conocimiento en habilidades aplicables.':'Learning paths designed to turn knowledge into practical skills.',
'Precios de lanzamiento sujetos a ajuste antes de la apertura comercial.':'Launch prices may change before commercial opening.',
'Una plataforma diseñada para acompañarte desde tu primera lección hasta tu certificado.':'A platform designed to support you from your first lesson to your certificate.',
'El sistema de suscripción y pagos se habilitará desde esta sección.':'Subscriptions and payments will be enabled in this section.',
'Este curso forma parte del catálogo de PLUTÓN ACADEMIC.':'This course is part of the PLUTÓN ACADEMIC catalog.',
'Inicia sesión para acceder al contenido y progreso académico.':'Sign in to access course content and progress.',
'Este certificado se otorga a':'This certificate is awarded to','por haber completado satisfactoriamente el curso':'for successfully completing the course',
'Los cursos elegibles incluyen certificado digital de finalización con identificación del estudiante, curso, fecha y código de verificación.':'Eligible courses include a digital completion certificate with student identification, course, date, and verification code.',
'Educación práctica para construir nuevas oportunidades.':'Practical education to build new opportunities.',
"Asistente de Enfermería: Fundamentos":"Nursing Assistant: Foundations",
"Cuidado, seguridad, higiene, comunicación y apoyo al residente/paciente.":"Care, safety, hygiene, communication and patient support.",
"Signos Vitales y Cuidado Básico":"Vital Signs and Basic Care",
"Temperatura, pulso, respiración, presión arterial y registro.":"Temperature, pulse, breathing, blood pressure and documentation.",
"Introducción a Flebotomía":"Introduction to Phlebotomy",
"Punción venosa, tubos, orden de extracción y errores frecuentes.":"Venipuncture, collection tubes, order of draw and common errors.",
"Fundamentos de ECG":"ECG Fundamentals",
"Anatomía cardíaca, conducción eléctrica, 12 derivaciones y procedimiento.":"Cardiac anatomy, electrical conduction, 12 leads and procedure.",
"Servicio al Cliente Profesional":"Professional Customer Service",
"Comunicación, presentación, resolución de problemas y experiencia del cliente.":"Communication, presentation, problem-solving and customer experience.",
"Herramientas Digitales e IA":"Digital Tools and AI",
"Productividad, documentos, organización y uso responsable de inteligencia artificial.":"Productivity, documents, organization and responsible use of artificial intelligence.",
"▶ Mis cursos":"▶ My courses",
"▰ Materiales y recursos":"▰ Materials and resources",
"✓ Mi progreso":"✓ My progress",
"♜ Certificados":"♜ Certificates",
"✓ Certificados digitales":"✓ Digital certificates",
"✓ Multidispositivo":"✓ Multi-device",
"75% completo":"75% complete",
"42% completo":"42% complete",
"/mes":"/month",
"Biblioteca digital":"Digital library",
"Selección básica de cursos":"Basic course selection",
"Nuevos recursos periódicos":"New resources regularly",
"Certificados: pago por curso":"Certificates: pay per course",
"Catálogo ampliado":"Expanded catalog",
"Contenido premium":"Premium content",
"Recursos prioritarios":"Priority resources",
"Certificados seleccionados":"Selected certificates",
"Catálogo completo":"Full catalog",
"Certificados incluidos":"Certificates included",
"Prioridad y recursos exclusivos":"Priority access and exclusive resources",
"Conocimiento hoy · Oportunidades mañana.":"Knowledge today · Opportunities tomorrow.",
"FASE 4 · CRECIMIENTO":"PHASE 4 · GROWTH",
"Más que cursos: una comunidad para avanzar":"More than courses: a community to grow",
"PLUTÓN ACADEMIC evoluciona hacia una experiencia continua con app, comunidad, automatizaciones y nuevas rutas de aprendizaje.":"PLUTÓN ACADEMIC is evolving into an ongoing learning experience with an app, community, automations and new learning paths.",
"Acceso móvil a cursos, progreso, certificados y novedades desde una experiencia diseñada para el estudiante.":"Mobile access to courses, progress, certificates and updates in an experience designed for students.",
"Espacio para estudiantes, retos, logros, preguntas frecuentes y acompañamiento durante el aprendizaje.":"A space for students, challenges, achievements, frequently asked questions and learning support.",
"Recordatorios de progreso, bienvenida, seguimiento de cursos, avisos de certificados y comunicaciones programadas.":"Progress reminders, welcome messages, course tracking, certificate notifications and scheduled communications.",
"Expansión del catálogo en salud, desarrollo profesional, emprendimiento y herramientas digitales.":"Catalog expansion in health, professional development, entrepreneurship and digital tools.",
"ECOSISTEMA PLUTÓN":"PLUTÓN ECOSYSTEM",
"Una experiencia preparada para crecer con cada estudiante, desde la primera lección hasta nuevas oportunidades profesionales.":"An experience designed to grow with every student, from the first lesson to new professional opportunities.",
"Pilares de crecimiento":"Growth pillars",
"Cursos iniciales":"Initial courses",
"Acceso digital":"Digital access",
"© 2026 PLUTÓN ACADEMIC · Fundador: Ruslan Valdes":"© 2026 PLUTÓN ACADEMIC · Founder: Ruslan Valdes",
"Has seleccionado la membresía":"You have selected the membership",
"Esta función forma parte del ecosistema PLUTÓN ACADEMIC.":"This feature is part of the PLUTÓN ACADEMIC ecosystem.",
"Próximamente estará disponible para los estudiantes.":"It will be available to students soon.",
"Escribe un correo válido y una contraseña de al menos 6 caracteres.":"Enter a valid email and a password of at least 6 characters.",
"Creando cuenta...":"Creating account...",
"Escribe tu correo y contraseña.":"Enter your email and password.",
"Entrando...":"Signing in...",
"Escribe primero tu correo electrónico.":"Enter your email address first.",
"Enviando enlace...":"Sending link...",
"No se pudo conectar al servicio. Recarga la página.":"Could not connect to the service. Reload the page.",
"Error de conexión":"Connection error",
"Curso":"Course",
"Membresía":"Membership",
"Curso PA-101":"Course PA-101",
"Tu futuro comienza con conocimiento":"Your future begins with knowledge"
};
const reverse={};
for(const [es,en] of Object.entries(dictionary)){
 const score=s=>s.length+(s.includes(' / ')?10000:0);
 if(!reverse[en]||score(es)<score(reverse[en]))reverse[en]=es;
}
function current(){try{return localStorage.getItem('pluton-lang')==='en'?'en':'es'}catch(e){return 'es'}}
function text(value){const spanish=reverse[value]||value;return current()==='en'?(dictionary[spanish]||value):spanish;}
function apply(root=document.body){
 if(!root)return;
 if(observer)observer.disconnect();
 const language=current();document.documentElement.lang=language;
 document.title=text(document.title);
 const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);let node;
 while((node=walker.nextNode())){
  if(node.parentElement?.closest('script,style,textarea,input,#student-email,#membership,#overallProgress,[data-no-translate]'))continue;
  const raw=node.nodeValue,trimmed=raw.trim();if(!trimmed)continue;
  const translated=text(trimmed);
  if(translated!==trimmed)node.nodeValue=raw.replace(trimmed,translated);
 }
 document.querySelectorAll('input[placeholder],textarea[placeholder]').forEach(el=>{
  el.setAttribute('placeholder',text(el.getAttribute('placeholder')));
 });
 document.querySelectorAll('[aria-label],[alt]').forEach(el=>{
  if(el.closest('[data-no-translate]'))return;
  for(const attr of ['aria-label','alt'])if(el.hasAttribute(attr))el.setAttribute(attr,text(el.getAttribute(attr)));
 });
 const bannerEs=document.getElementById('pa-banner-es'),bannerEn=document.getElementById('pa-banner-en');if(bannerEs&&bannerEn){bannerEs.style.display=language==='es'?'block':'none';bannerEn.style.display=language==='en'?'block':'none';}
 document.querySelectorAll('#languageToggle').forEach(b=>{if(b.textContent!==(language==='en'?'EN':'ES'))b.textContent=language==='en'?'EN':'ES';b.setAttribute('aria-label',language==='en'?'Switch to Spanish':'Cambiar a inglés')});
 if(observer)observer.observe(document.body,{childList:true,characterData:true,subtree:true});
}
function toggle(){try{localStorage.setItem('pluton-lang',current()==='en'?'es':'en')}catch(e){}apply();if(typeof window.translateDashboard==='function')window.translateDashboard();if(typeof window.renderCourses==='function')window.renderCourses();}
window.plutonLanguage={current,apply,toggle,text};window.changeLanguage=toggle;window.changeDashboardLanguage=toggle;window.toggleLang=toggle;
const observer=new MutationObserver(()=>apply());
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>apply());else apply();
})();
