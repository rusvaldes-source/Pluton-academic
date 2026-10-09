PLUTÓN ACADEMIC V9 — PDF PROFESIONAL — 08 OCT 2026

BASE: V8 validada por el usuario en Android. Paquete completo: 20 cursos, 46 lecciones, audio, tarjetas, progreso, sincronización de cuenta, login, membresías, noticias y ES/EN.

CAMBIO ÚNICO V9:
- Diseño de impresión/PDF mejorado: portada compacta con marca, curso y código, lección, contenido legible, pregunta de repaso, líneas para notas y pie de página.
- Diseño adaptable a pantalla y papel; estilos de impresión sin botones y márgenes de página apropiados.
- La ventana de impresión y Guardar como PDF del navegador se mantienen, como se verificó en V8.
- Etiquetas del documento en español o inglés según idioma seleccionado.

INSTALACIÓN: subir TODOS los archivos de este ZIP a la raíz del repositorio. Mantener la subcarpeta functions/api/news.js tal como viene. No subir la carpeta contenedora.

PRUEBAS: curso > lección > Imprimir / Guardar PDF > comprobar vista previa y guardar; volver y comprobar tarjeta, audio, cuestionario, progreso, panel y selector ES/EN.

NOTAS: la sincronización entre dispositivos no está verificada; la exportación depende del diálogo de impresión del navegador. Los cursos son introductorios. No se ha modificado Supabase ni el sistema de autenticación.

V10: Cuaderno de notas personales por lección (ES/EN). Guardar notas en este navegador; sin cambios en la sincronización de progreso ni en autenticación. Archivo nuevo: lesson-notes.js.

V11 — CUADERNO GENERAL DE NOTAS (08 OCT 2026)
- En Mis cursos aparece un resumen de las notas guardadas en este dispositivo.
- Abrir lección permite volver directamente a la lección con notas.
- Exportar mis notas (.txt) genera un archivo de texto local.
- No se modificaron credenciales, Supabase, progreso ni membresías.
- Las notas continúan guardándose solo en este navegador. La exportación debe probarse en el dispositivo.
- Subir todos los archivos y la carpeta functions/ a la raíz del repositorio.

V12 — CORRECCIÓN DE IDIOMA DEL RETO DIARIO
- En Atención al cliente (ID-101), opciones ES corregidas: ¿Cómo puedo ayudarte? / Vete de aquí / No, gracias.
- Preguntas y respuestas del reto toman el idioma actual del catálogo; las opciones EN originales se conservan.
- Se revisaron las 46 lecciones: las frases de práctica en inglés del módulo de presentaciones se mantienen como contenido pedagógico y las opciones numéricas no requieren traducción.
- Sin cambios en autenticación, notas, progreso, membresías, diseño ni infraestructura.


V13 — REVISIÓN DE TRADUCCIÓN Y COMUNIDAD (08 OCT 2026)
- Traducción explícita y reversible ES/EN de Comunidad: título, descripción, etiqueta, placeholder, botones y estado.
- Traducidos textos estáticos adicionales de Recursos y búsqueda.
- Nuevo contador de caracteres y opción de borrar la idea local. No se envía a servidores.
- Actualización de versión de scripts de idioma/noticias y CSS para evitar caché.
- Se preservan autenticación, membresías, progreso, PDF, audio, notas y catálogo.
- Subir TODOS los archivos y la carpeta functions/ en la raíz del repositorio.

V14 — BUSCADOR UNIVERSAL
Lupa en portada, lecciones y panel. Busca secciones, cursos y lecciones ES/EN; clic lleva a la ubicación. Ctrl+K abre y Escape cierra. Usa catalog.json existente; si falla la carga, sigue buscando secciones. No requiere claves ni servicios externos. Se incluyen los archivos de Cloudflare en su estructura original (no mover manualmente).


B15 — BUSCADOR Y NAVEGACIÓN ACCESIBLE (08 OCT 2026)
- Resultados de búsqueda ampliados de 30 a 80 para encontrar más cursos y lecciones.
- Al cerrar el buscador, el foco vuelve al control desde el que se abrió.
- Navegación con Tab y Shift+Tab contenida dentro del diálogo mientras está abierto.
- Se actualiza versión del script en las tres páginas para evitar caché.
- No se modifican autenticación, membresías, progreso, notas, catálogo ni Cloudflare Functions.
- Desplegar todos los archivos en la raíz, respetando functions/api/news.js.


B16 — BÚSQUEDA PRECISA DE CURSOS Y LECCIONES
- Al buscar un código exacto (por ejemplo RE-201), se muestra primero el curso correspondiente.
- Después se priorizan coincidencias exactas y nombres de cursos y lecciones.
- Cada resultado de lección identifica también el nombre de su curso para evitar confusiones.
- Sin cambios en autenticación, membresías, progreso, notas, contenidos o noticias.
- Subir el contenido completo del ZIP a la raíz de GitHub conservando functions/api/news.js.

B17 — CURSOS FAVORITOS (08 OCT 2026)
- Botón Guardar curso / Save course en cada curso; acceso rápido a favoritos en Mis cursos.
- Almacenamiento exclusivamente local, sin cambios en Supabase, progreso, notas, membresías, buscador ni menús.
- En español e inglés; favoritos persistentes al recargar en el mismo navegador.
- Nuevo archivo course-favorites.js. Subir TODOS los archivos y mantener functions/api/news.js en su carpeta.


B18 — CONTINUAR DONDE LO DEJASTE
- Guarda localmente el último curso y la última lección abierta en Mis cursos.
- En Mis cursos y panel del estudiante aparece acceso directo a esa lección, en ES/EN.
- Sin cambios en autenticación, Supabase, progreso, notas, certificados, noticias o favoritos.
- No se muestra hasta abrir una lección; datos guardados solo en el mismo dispositivo.
- Conservar functions/api/news.js dentro de su carpeta al desplegar.


B19 — CORRECCIÓN VISUAL DE FAVORITOS Y CACHÉ
- Las tres páginas usan styles.css?v=20261008-b19 para obtener estilos actualizados.
- El botón Guardar curso usa azul oscuro y dorado en móviles y navegadores.
- Sin cambios en JavaScript, catálogo, Supabase, membresías, notas o progreso.
- Mantener functions/api/news.js dentro de su carpeta original al desplegar.
