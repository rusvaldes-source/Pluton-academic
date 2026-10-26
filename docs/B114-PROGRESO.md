# SDD ledger — plan: docs/superpowers/plans/2026-10-26-b114-three-courses.md

2026-10-26: Founder authorized autonomous implementation, photos everywhere courses appear in review, use existing ElevenLabs credits. Approval to publish production is still withheld.

Pre-flight: Task 1 payload consumed by Task 2 renderer and Task 3 narration/video; Task 4 packaging requires all three. B70 equivalent schema selected; no parallel course schema.

Ruling: Use local isolated preview and prepare SQL without applying it to production — founder explicitly prohibits deployment before review — live Auth/Stripe/Storage end-to-end remains unverified until authorized staging or deployment.

Ruling: Narrated educational slide videos will use new photographs and lesson keypoints with real ElevenLabs narration — no authorization to buy extra avatar generation and no need to alter existing videos — these are not hands-on procedural demonstrations or avatar videos.

Ruling: Retain existing device-local quiz practice and reviewed participation certificates — reuse existing functionality as ordered — no official grade or professional credential is implied.

Task 1: content draft complete privately (34 bilingual lessons, 170 bilingual questions, worked cases, exercises and sources). Validation RED for missing payloads then GREEN with `python3 tests/b114-content.test.py`. Content is introductory and professional review remains pending.

Task 2: content/progress adapter subset RED→GREEN, `node --test tests/b114-classroom.test.cjs` → 4/4. Production loader rejects guest, wrong course and account race. Renderer and integration tests still pending.

Task 3: three photographs generated and inspected; founder asked to see them and replied Listo. Ruslan clonada voice located. Eight initial narrations generated without regeneration; real first MP3 probed at 19.644 seconds. Full narration queue prepared: 68 files, 14,049 characters total; observed initial billing one credit per character despite Flash model, so budget uses that observed rate. Target reserve 2,543 credits if no extra generation. No plan changes or purchases.

Ruling: Use a new private b114-course-media bucket in the unapplied integration proposal — existing media policies enumerate other course prefixes — no current bucket, policy or rule will be modified; live provisioning requires later publication authorization.

 Referencias existentes confirmadas en main: `b67/id101/course.json` (ID-101), `b68/mkt201/course.json` (MKT-201), `b82/pa101/course.json` (PA-101), `b95/course-loader.js` (contenido publicado protegido). Decisión del fundador: seguir las estructuras de cursos ya presentados, sin crear otra plataforma. Para la integración B114 reutilizar campos bilingües, explicación, ejemplo, ejercicio, quiz, progreso y control de compra existente. No alterar Stripe ni RLS de producción. Pendiente: adjuntar payloads de los tres cursos, audios/videos reales y pruebas E2E antes de fusionar.

2026-10-26: Se incorpora el commit remoto 9c08b44 y su syllabus sin eliminar los originales privados. Conciliación de temario y material en curso.

2026-10-26 — Recuperación y conciliación final de esta sesión:
- Integrado el historial remoto hasta 9c08b44 sin comenzar de cero. El temario vigente es b114/syllabus.json; se conservaron los payloads y medios originales en el paquete privado.
- Task 1: 34 lecciones bilingües y 170 preguntas conciliadas al temario. Se ampliaron los temas nuevos por escrito; siguen sujetas a revisión profesional. Validador de contenido: 2/2.
- Task 2: aula y catálogo aislados, 3 fotos, cinco preguntas por lección, ejercicios, cuaderno, progreso. Suite de acceso/render/SQL/integridad: 18/18. El progreso real en Supabase no se ha escrito; la prueba de navegador usa una cuenta local ficticia.
- Task 3: 68 MP3 originales y 68 MP4 de resumen narrado conservados, 14.37 minutos de audio en total. Las 34 lecciones enlazan 58 pares localizados distintos; se indica el tema original de cada clip de apoyo. No hubo regeneraciones ni compras en esta sesión. Falta material específico de siete temas incorporados por el último temario (14 audios ES/EN y 14 videos derivados). Cola privada preparada: 2,243 caracteres, frente a los 2,543 créditos de la última lectura anterior. ElevenLabs muestra inicio de sesión; no se generó nada desde esa pantalla.
- Navegador real Chromium local, 1440×1000 y 390×844: 34 lecciones por tamaño, idiomas, cuestionarios, ejercicio, progreso tras recarga y 272 comprobaciones de reproducción aprobadas. No son pruebas de Auth/Storage/Stripe reales.
- Task 4: propuesta SQL no aplicada, semilla privada con published=false, parche de integración pública NO aplicado; el parche se aplica y valida en un directorio desechable conservando los 10 cursos anteriores. Regresiones dirigidas existentes: 11/11 y B111: 4/4. npm test completo falla por expectativa anterior de 26 cursos frente al catálogo real de 10; no se alteraron pruebas ajenas para ocultarlo.
- Revisión independiente: corregido aislamiento de ejercicios/cuadernos por revisión (RED→GREEN), completada ruta B95 para nuevos códigos (RED→GREEN), conciliadas las pruebas estáticas con SDK fijado y esquema real. Sin menores diferidos informados por el revisor.

Ruling: conservar audios/videos previos como material de apoyo identificado y preparar una cola separada para siete temas nuevos — evita regenerar originales y confundir temas — hasta recuperar autenticación faltan 14 narraciones específicas y sus videos; B114 no se declara terminada para venta.
Ruling: preparar un parche revisable para catálogo público, fotos, rutas, listas administrativas y compilación sin aplicarlo a archivos existentes — mantiene intacta la versión aprobada — requiere aplicarlo y comprobarlo en un entorno autorizado antes de publicar.
Ruling: mantener bloqueada la venta de los tres códigos nuevos en el parche — sus precios no están aprobados y Stripe no debe cambiarse — no se podrá vender B114 hasta habilitación posterior autorizada.

Pendientes de cierre: material específico bloqueado por autenticación, revisión profesional, precios, pruebas reales aisladas de compra/Auth/Storage y autorización de publicación. MAIN continúa en 510fe3fa3ce9e00528f0200a8c6418ce35e17bb2. Ninguna mutación de producción realizada.
