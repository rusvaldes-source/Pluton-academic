# B70 — NA-101 y COMP-101

Fecha: 18 de octubre de 2026 (Nueva York); operaciones técnicas: 19 de octubre UTC.

## Cursos

| Curso | Módulos | Lecciones | Cuadernos ES/EN | Preguntas con explicación | Guiones preparados | Videos nuevos/integrados |
|---|---:|---:|---:|---:|---:|---:|
| NA-101 | 6 | 12 | 6 | 60 | 12 | 0 / 0 |
| COMP-101 | 4 | 8 | 4 | 40 | 8 | 0 / 0 |

Cada lección tiene explicación, caso aplicado, ejercicio corregible, espacio de respuesta guardable/exportable y cinco preguntas con retroalimentación en español e inglés. Los cuadernos incluyen práctica y respuestas de referencia. Los proyectos finales se guardan en la respuesta práctica de la última lección. No se generan calificaciones oficiales ni certificados.

NA recupera íntegramente el paquete NA101_PREPARACION_B65D y su banco de preguntas. Se amplió el repaso breve en inglés a contenido completo; se actualizaron referencias administrativas que no eran preguntas para estudiantes. COMP recupera los ocho objetivos B64 y sustituye el desarrollo genérico por actividades específicas. Los originales siguen conservados.

NA es una introducción teórica, no un programa CNA aprobado ni autorización para prestar cuidados. Revisión clínica profesional y adaptación legal por jurisdicción siguen pendientes y aparecen expresamente en el aula. La alineación con Hartman es temática, basada en el índice editorial; no se redistribuye el libro ni se afirma revisión completa de capítulos. No se enseñan dosis, técnicas invasivas, ejecución de RCP ni umbrales clínicos universales.

## Integración

- Entradas: `/b70/na101/` y `/b70/comp101/`, desde Mis cursos y Aula Digital.
- Lector independiente b70; conserva diseño y funcionamiento del lector anterior sin modificar b67/b68/b66.
- Material nuevo en `public.course_learning_content`, con lectura exclusivamente para usuarios autenticados y publicación explícita. No se guarda el nuevo contenido en el repositorio público.
- Progreso en `course_lesson_progress`, con RLS por usuario; respuestas y notas en almacenamiento local separado por curso y cuenta, exportables. Las respuestas no se sincronizan entre dispositivos; las lecciones completadas sí.
- Videos omitidos totalmente del lector nuevo. Guiones ES/EN en respaldo privado; ningún avatar, voz o archivo multimedia contratado o generado.
- Portadas vectoriales propias, distintas para ambos cursos. No se modificaron las imágenes aprobadas anteriores.

## Pruebas previas a publicar

- 21 pruebas Node aprobadas, incluido aislamiento de cuentas y conservación del progreso ante un fallo temporal de autenticación/red.
- Navegador Chromium: 20 lecciones, 100 preguntas, respuestas incorrectas/correctas y explicaciones en ambos idiomas; ejercicios, cuadernos y respuestas descargables, notas tras recarga, navegación y vista de 1440 px / 390 px.
- Pruebas con Auth, contenido y progreso reales de Supabase usando dos cuentas temporales: persistencia, aislamiento de otro usuario y limpieza visual al cerrar sesión. Se usó un puente de red para el entorno de pruebas; las respuestas del backend fueron reales.
- API real: anónimo recibe 401 al solicitar contenido nuevo o perfiles; estudiante recibe 403 al modificar contenido, guardar progreso con el UUID de otra cuenta o insertar un perfil Premium falso. Consulta de perfil propio sigue disponible (200).
- ID-101 y MKT-201: regresión de navegación, idiomas, práctica, progreso local y descargas aprobada. No se volvió a certificar audio/video en esta regresión: los archivos y URLs aprobados permanecen idénticos. PA-203: archivos y registro de catálogo conservados sin cambios.
- `npm test` general tiene fallos previos de ubicación: supone catálogo en el directorio superior y después busca un fixture inexistente en `fixtures/supabase-2.117.3.js`; además conserva una expectativa antigua de 26 cursos. No se declara aprobada esa suite general. La suite específica y las regresiones anteriores sí pasaron.

## Auditoría y protección aplicada

Se retiraron dos políticas permisivas de `profiles`: lectura pública de todos los perfiles e inserción libre de perfiles por estudiantes. El panel actual identifica el perfil por email, no por UUID; por compatibilidad, la política nueva compara el correo firmado en el JWT con el perfil. El navegador solo puede consultar su propio perfil; escritura queda para servidor. No se cambiaron precios, datos de membresías, estado, registro, pagos ni configuración de Auth. Huella de los datos antes/después: `5866ac98b1222008ac9bb446b2be1185` (1 fila, idéntica).

La prueba en el dominio real detectó el beacon existente de Cloudflare; la CSP permite sus dos dominios documentados sin habilitar orígenes arbitrarios. Cabeceras de seguridad limitadas a `/b70/*`: no-store, CSP, bloqueo de objetos y de incrustación por terceros, nosniff y permisos de cámara/micrófono/geolocalización deshabilitados. Material y progreso se protegen en servidor; el mensaje de inicio de sesión no constituye por sí mismo la barrera de seguridad.

Pendientes de seguridad: protección contra contraseñas filtradas desactivada en Supabase; videos y materiales históricos de los tres cursos anteriores aún tienen acceso público. No se modificaron esas URLs para evitar interrumpir los cursos existentes. La auditoría identifica estos pendientes; no se afirma un blindaje total.

Guía oficial de contraseñas: https://supabase.com/docs/guides/auth/password-security#password-strength-and-leaked-password-protection

## Respaldo y despliegue

Base: `04d5d4203546c96b822dc227a4cb3337d0f1b2ff`. Rama de respaldo: `backup/pre-b70-2026-10-19`. Ramas independientes: `work/b70-na101` y `work/b70-comp101`; integración: `work/b70-integration`.

El ZIP B70 incluye materiales nuevos, guiones, originales recuperados, archivos de integración y evidencias. No contiene contraseñas, tokens ni cuentas temporales. Para recuperar contenido del servidor se incluyen los dos JSON y las migraciones. No se duplican los videos protegidos; la base Git y URLs originales los identifican.

Después del despliegue se verifican rutas públicas, API protegida, cabeceras y entrada real de estudiante; el resultado final y SHA se añaden al informe entregable del respaldo. Las cuentas temporales y su función de preparación se eliminan o cierran tras las pruebas.
