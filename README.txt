PLUTÓN ACADEMIC V8 — AULA INTERACTIVA — 08 OCT 2026
BASE: V7 validada en móvil. Conserva 20 cursos, 46 lecciones, progreso y sincronización, login, membresía, noticias y ES/EN.

NOVEDADES V8 EN LECCIONES:
- Escuchar el contenido de cada lección usando la síntesis de voz del navegador (depende del dispositivo).
- Detener audio.
- Tarjeta de repaso con pregunta y respuesta que se revela al pulsar.
- Imprimir o guardar PDF de la lección usando la función Imprimir del navegador (ventana emergente).
- Controles accesibles, adaptados al móvil, textos ES/EN.
- Las tarjetas de repaso NO cuentan como evaluación ni modifican el progreso.

NO SE INCLUYEN VIDEOS NI FOTOGRAFÍAS LICENCIADAS; esas piezas requieren material autorizado.
V7 sincroniza progreso en user_metadata de Supabase; no se ha validado aún entre dos dispositivos.
El audio requiere que el navegador admita SpeechSynthesis; imprimir requiere permitir ventana emergente.

INSTALACIÓN: subir TODOS los archivos a la raíz del repositorio. La única subcarpeta
functions/api/news.js es necesaria para la ruta de Cloudflare Pages; mantener su estructura.
No cambiar claves ni editar código. Guardar V7 como respaldo.
PRUEBA: abrir un curso > una lección > Escuchar > Detener > Tarjeta de estudio > Ver respuesta > Imprimir.
Comprobar luego un cuestionario y que el progreso sigue actualizándose.
