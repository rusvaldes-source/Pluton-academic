PLUTÓN ACADEMIC V7 — SINCRONIZACIÓN DE PROGRESO — 08 OCT 2026
BASE: V6 aprobada; conserva diseño V4.1, 20 cursos, 46 lecciones, ES/EN, login y membresía.

V7: guarda las lecciones completadas en el navegador y, si hay una sesión iniciada,
las sincroniza mediante Supabase Auth user_metadata, campo pluton_completed_v7.
NO necesita SQL, tablas nuevas, permisos adicionales ni cambios de claves.
Al abrir otra computadora o teléfono, iniciar sesión con LA MISMA CUENTA para recuperar avance.
El sistema fusiona los avances de ambos dispositivos y nunca borra lecciones completadas.
La sincronización requiere Internet; si falla, mantiene copia local y muestra aviso.
El progreso solo se sincroniza si el estudiante inició sesión. No sincroniza notas.

PRUEBA RECOMENDADA: abrir Mi plataforma con sesión iniciada; comprobar mensaje
'Sincronizado con tu cuenta'; completar lección; entrar con la misma cuenta en otro
navegador y comprobar porcentaje. Si sale aviso de error, no afirmar que sincronizó.

INSTALACIÓN: subir TODO el contenido del ZIP al repositorio, respetando automáticamente
la carpeta functions/api. No editar archivos ni claves.
Guardar V6 como respaldo hasta verificar el funcionamiento en producción.
