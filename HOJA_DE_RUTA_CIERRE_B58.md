# B58 — Plan de cierre hacia versión casi final (auditoría 2026-10-16)

## Lo que está en el ZIP
- Diseño y archivos de banner fundadores PNG/WebP, módulo de integración y estilos aislados.
- Vista previa bilingüe y módulo Zona de estudiantes; la fotografía original de estudiante aún no ha sido cotejada.
- Inventario de 58 actividades de LearnWorlds: PA-203 (25), ID-101 (19), MKT-201 (14). Es un inventario, NO 58 actividades migradas.
- Módulos de catálogo de lanzamiento, migración reversible de progreso y pruebas técnicas aisladas.

## Orden de trabajo obligatorio
1. Integrar **una copia íntegra** de B57-Prueba en carpeta de ensayo; preservar archivos y referencias. La conexión GitHub lee pero escritura está bloqueada por 403.
2. Integrar banner con **foto sin texto ni controles incrustados**, conservar header original y CTAs HTML reales; revisar que la imagen no duplique menú. Comprobar escritorio 1440/1024, tableta 768 y móvil 390/360 px.
3. Incorporar la foto original de estudiante a Zona de estudiantes, comprobar recortes y alt, idioma ES/EN, enlaces de cursos, progreso y certificados.
4. Recuperar archivos fuente de PA-203, ID-101, MKT-201: por cada actividad cotejar título, orden, video, audio, subtítulos ES/EN, cuaderno, preguntas, respuestas, material PDF y estado. No inventar lo faltante.
5. Recuperar/crear y verificar contenidos separados para Computación (TEC-101) y Nurse Assistant (PA-101). No confundir ambos cursos.
6. Asegurar persistencia de progreso al añadir lecciones (migración por IDs estables), compatibilidad de membresías y autorización de acceso.
7. Verificar certificados, enlaces, formularios, buscador, filtros, login/logout, dashboard, seguridad básica y noticias (feed observado como no disponible en la web pública).
8. Ejecutar pruebas end-to-end y visuales, auditar consola/red, validar que la portada no desconfigure navegación, obtener aprobación, **solo entonces** publicar.

## Puerta de publicación
`python tests/release-readiness.py` genera un listado de bloqueos y termina con código 2 cuando no está listo. Los 8 tests existentes pasan, pero son pruebas aisladas, no de la plataforma completa.

## Regla
Mantener producción/main intacta; no afirmar migración de un curso hasta comprobar sus archivos y ejecución real.
