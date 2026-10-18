# PA-203 — Criterios de aceptación para cierre de B66

Estado: **NO APROBADO PARA PUBLICACIÓN**. Esta lista separa la verificación de código de la prueba real de funcionamiento.

## Verificado en archivos y Supabase (18 octubre 2026)
- Ocho lecciones registradas y ocho referencias de video.
- MP4 de lecciones 1, 3 y 4 presentes en GitHub; 2, 5, 6, 7 y 8 registrados en Supabase Storage.
- Once actividades: ocho repasos de cinco preguntas, un control de dos, una evaluación final de doce y un proyecto.
- Cincuenta y cuatro preguntas de opción múltiple con una respuesta marcada en el JSON.
- Cuatro scripts JavaScript principales superaron análisis de sintaxis.
- Progreso y entregas tienen tablas y políticas de acceso por usuario en Supabase.
- No existe aún la tabla pa203_assessment_attempts; la función de calificaciones no está desplegada.
- La función de calificaciones incluye bloqueo PA203_GRADING_ENABLED (apagada por defecto).

## Pruebas de aceptación todavía obligatorias
- [ ] Reproducir cada uno de los ocho videos en móvil y escritorio: imagen, sonido, duración, inicio y avance.
- [ ] Abrir cada una de las ocho lecciones en español e inglés, comprobar todos los textos y enlaces.
- [ ] Comprobar los cuadernos integrados y los complementarios 5, 7 y 8.
- [ ] Enviar proyecto de prueba de 500–20.000 caracteres, revisar estado e historial en Supabase.
- [ ] Validar con dos cuentas reales que cada usuario ve solo su progreso, borradores y entregas.
- [ ] Preparar un banco de exámenes oficiales diferente de las preguntas públicas de práctica; proteger sus claves.
- [ ] Revisar y desplegar en entorno de prueba tabla de intentos y función de calificaciones; probar nota correcta, rechazo sin sesión y cambio de cuenta.
- [ ] Revisar proceso de evaluación del proyecto por instructor o IA con supervisión humana; no emitir nota inexistente.
- [ ] Realizar pruebas de accesibilidad, pantalla pequeña y errores de red.
- [ ] Aprobar formalmente la publicación antes de fusionar B66 con main.

## Bloqueos
1. Las claves de los cuestionarios de práctica están en el JSON visible para el alumno. No usarlo como examen oficial.
2. No hay verificación audiovisual real en navegador.
3. La calificación oficial y la revisión final del proyecto siguen pendientes.

No cambiar main, B63 ni Cloudflare durante las pruebas de B66.

## Estado técnico verificado — 18 octubre 2026

- [x] Tabla `public.pa203_assessment_attempts` instalada en Supabase con RLS; el rol `authenticated` tiene SELECT y no INSERT/UPDATE.
- [x] Edge Function `b66-pa203-grade` desplegada con verificación JWT; calificación permanece desactivada hasta cargar secreto y habilitar el interruptor.
- [x] Cliente B66 llama a `b66-pa203-grade` (commit 24baef97).
- [x] Banco privado local `pa203-final`: 12 preguntas, IDs únicos y claves dentro de las opciones; **no subirlo a archivos públicos**.
- [x] Cinco MP4 en bucket `pa203-videos` (lecciones 2, 5, 6, 7 y 8), tamaños mayores que cero, MIME video/mp4.
- [ ] Configurar `PA203_OFFICIAL_QUESTION_BANK_JSON` en secretos de Supabase (requiere acceso al panel).
- [ ] Configurar `PA203_GRADING_ENABLED=true` solo durante pruebas controladas.
- [ ] Probar lectura y entrega de examen con usuario autenticado y verificar fila propia; comprobar rechazo de acceso cruzado.
- [ ] Verificar reproducción/audio de los 8 videos en navegador real, incluyendo móvil.
- [ ] Probar envío e historial del proyecto final con cuenta de prueba en ES/EN.
- [ ] Confirmar experiencia móvil (navegación, video, evaluación, cuaderno y proyecto) antes de habilitar el lanzamiento.

**Importante:** tests simulados de función/cliente no equivalen a pruebas de extremo a extremo. No publicar ni declarar listo hasta completar las casillas pendientes.
