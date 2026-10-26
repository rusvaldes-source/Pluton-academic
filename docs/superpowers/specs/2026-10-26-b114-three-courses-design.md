# B114 — Integración de tres cursos: revisión y diseño

Fecha: 26 de octubre de 2026. Estado: revisión terminada; diseño pendiente de aprobación; implementación no iniciada.

## Orden y límites

Integrar FA-101 Primeros Auxilios y Emergencias (10 temas), DRV-101 Formación para Conductores de Camiones CDL con Inglés Profesional (12 temas) y MED-201 Facturación y Codificación Médica en Estados Unidos (12 temas). Propuesta inicial: un tema aprobado por lección, 34 lecciones bilingües. Mantener la estructura pedagógica existente: video, audio, explicación/resumen, ejemplo, ejercicio, cinco preguntas, progreso, finalización y constancia conforme al sistema actual. No inventar precios. Pago único por curso; compras desactivadas en pruebas hasta aprobación de precios e integración comercial posterior.

No tocar main, producción, portada, banners, cursos o medios anteriores, Auth, Stripe, rutas actuales ni políticas de acceso. Todo el trabajo nuevo quedará en una única rama B114-Tres-Cursos-20261026. No reanudar soporte B113 ni otros trabajos dentro de esta orden.

## Base real y evidencia de lectura

- main consultado en GitHub: 510fe3fa3ce9e00528f0200a8c6418ce35e17bb2, árbol 7d029480746b4f0dc843420fd6497d4ca3ed1587, B111.
- HTTP 200 y coincidencia exacta de bytes con main para b67/aula.js, b70/aula.js y b95/course-loader.js. La portada difiere únicamente por el beacon de métricas añadido por Cloudflare antes de cerrar body. Esto confirma los componentes examinados; no es una certificación de todo el despliegue.
- Supabase paifjzznyiehwidoqjqb: consultas de metadatos y conteos solamente. Ningún cambio remoto aplicado.
- No existen registros con los tres códigos nuevos en course_learning_content ni course_editor_state. Ningún recurso Storage identificado por esos códigos. No se afirma que no existan archivos con otros nombres en otras fuentes.

## Componentes reutilizables

1. Aula B70: b70/aula.js, b70/load.js, b70/comp101/index.html, estilos b67/aula.css y b70/aula.css. Modelo lessons con title, explanation, example, exercise, quiz; modules, notebooks, final_project y sources.
2. Carga privada B95: b95/course-loader.js llama b95_course_published y comprueba usuario y revisión. Las tablas course_learning_content y course_editor_state restringen códigos. La función también enruta códigos explícitamente.
3. Progreso: course_lesson_progress usa clave user_id/course_code/lesson_number y RLS de propietario. b70/progress.js limita guardado a NA-101 y COMP-101. Los cuestionarios B70 guardan respuestas de práctica por usuario, curso y revisión en localStorage: no son notas oficiales ni se sincronizan entre dispositivos.
4. Constancias B96: course_certificates contiene document_type=participation y lista explícita de códigos. Revisión administrativa; no implica credencial RCP, CDL, ELDT, facturador o codificador certificado. Reutilizar flujo y plantilla; no emitir certificados durante pruebas de contenido.
5. Medios: seis buckets existentes, todos privados: b107-course-media, pa203-videos, id101-videos, mkt201-videos, lesson-videos-b80 y b108-course-media. B108/B107 firman URLs por cinco minutos y controlan cambio de cuenta. No reutilizar medios de otros cursos como sustitutos. Los códigos nuevos no están admitidos en todos los enrutadores de medios actuales.
6. Compras: preservar course_purchase_access y sus comprobaciones de compra activa por curso. No usar localStorage ni progreso como autorización. No crear precios, productos, sesiones o derechos de compra reales para esta revisión.

## Enfoque propuesto

Hay una sola vía compatible con la orden: extensión aislada que copie/adapte el aula B70 para los tres códigos, conserve su modelo y reutilice CSS y APIs existentes. Cambiar el aula compartida afectaría cursos operativos; crear una plataforma nueva contradice la orden. Ninguna de esas alternativas se recomienda.

Nuevos archivos previstos bajo b114/: catálogo de pruebas no indexable sin botón de compra; aulas FA-101, DRV-101 y MED-201; adaptadores mínimos de carga/progreso/medios restringidos a esos códigos. No modificar catalog.json ni el catálogo de la portada durante esta fase.

El contenido completo, soluciones y medios deben guardarse en un destino privado persistente, nunca en la rama pública. GitHub conservará código, pruebas y documentación sin respuestas ni recursos privados. Usar los mismos campos de contenido existentes, sin un esquema paralelo.

Preparar SQL de integración, sin ejecutarlo en producción: ampliar solo listas de códigos necesarias para contenido/versiones/constancias y el enrutamiento B95, conservando todas las condiciones anteriores. Preparar inserciones únicamente para los tres cursos, sin sobrescribir registros. Verificar primero en una base de pruebas aislada. Cualquier cambio a políticas de seguridad exige detenerse e informar; no es parte del diseño.

## Contenido y materiales

Redactar las 34 lecciones completas en ES/EN, ejercicios y 170 preguntas originales de práctica con explicaciones. Usar fuentes oficiales actuales: AHA/Red Cross para primeros auxilios, FMCSA y manual CDL estatal aplicable para conducción, CDC/CMS/HHS para codificación, facturación y privacidad. Conservar edición y fecha consultada. No reproducir tablas CPT licenciadas; explicar su uso con material autorizado o ejemplos que no requieran reproducirlo.

Revisión profesional pendiente antes de comercialización de contenido clínico o regulatorio. FA-101 es formación educativa, no sustituto de práctica supervisada ni certificación de RCP. DRV-101 no acredita ELDT ni autoriza conducir; comprobar requisitos FMCSA y estatales. MED-201 no otorga licencia ni certificación profesional. No usar datos de pacientes reales en ejercicios.

Multimedia: registrar por curso/lección/idioma/tipo el archivo, origen, permisos y estado. Partir de estado pendiente, sin inventar URLs ni reutilizar contenido anterior. No generar videos de pago ni contratar servicios con esta orden. Cuando existan archivos reales aprobados, verificar reproducción efectiva y acceso privado. Los guiones pueden entregarse como preparación, claramente diferenciados de archivos reproducibles.

## Pruebas y criterios de entrega

- Catálogo de pruebas: exactamente tres cursos, nombres/códigos correctos, precios pendientes y ningún cobro.
- Cada aula abre solo su contenido; rechaza códigos desconocidos, usuario sin compra y cambio de cuenta. Probar matrices comprar A/no acceder B o C y acceso revocado, sin modificar compras reales.
- ES/EN: campos completos, navegación y feedback traducidos en 34 lecciones, cinco preguntas por lección y ejercicios funcionales.
- Persistencia: documentar explícitamente que práctica se conserva en ese dispositivo y progreso de lecciones en cuenta. Si se desea sincronización de notas de cuestionarios, no fingir que existe: requiere ampliar alcance con endpoint evaluador y persistencia segura.
- Constancias: mantener revisión y tipo participation existentes; validar altas de los nuevos códigos en pruebas, sin emitir documentos reales.
- Audio/video pendientes no cuentan como aprobados. Verificar reproducción cuando se reciban recursos reales.
- Regresión: hashes/diff de archivos anteriores, comprobación de que Stripe/Auth/políticas y precios antiguos no cambiaron; pruebas relevantes de acceso, multimedia y rutas existentes. No confundir invariancia de código con una compra end-to-end probada.
- Escritorio y teléfono: navegación, teclado, traducción, formulario de respuestas, progreso y desbordes en navegadores de prueba.
- Entrega: código completo, contenido privado, inventario multimedia, resultados con distinción probado/simulado/pendiente, compatibilidad y respaldo ZIP si procede. Nada se publica en main ni producción sin autorización expresa posterior.

## Decisiones pendientes antes de implementar

Confirmar este diseño, especialmente el alcance existente de cuestionarios (práctica guardada en el dispositivo) y constancias (participación con revisión administrativa). Los precios y medios no bloquean preparar contenido y código, pero sí la activación de ventas y la aprobación de reproducción.

## Inventario de esta revisión

Único archivo nuevo de esta fase: este documento. Cero archivos de producto modificados, cero cambios SQL aplicados, cero cursos dados por terminados. No se ejecutaron pruebas funcionales de cursos todavía inexistentes.
