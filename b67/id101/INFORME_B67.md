# ID-101 — B67 — 18 octubre 2026
Estado: integración lista para QA en alojamiento; no declarar finalizado hasta comprobar producción.
- Recuperados del repositorio: 12 lecciones, 6 cuadernos bilingües, examen de 12 preguntas. Fuente intacta: b64/materiales.json. LearnWorlds no modificado.
- Videos recuperados: 0. Nuevos: 12. Supabase: bucket público id101-videos, 12 MP4 de 1280×720, H.264/AAC, 44,32–49,45 s. Fundador con avatar y voz clonada comprobados en PA-203. Narración ES con frases modelo EN; no se ofrece una segunda pista EN.
- Aula nueva: b67/id101/index.html. 12 ejercicios interactivos, 60 preguntas bilingües con explicación, seis cuadernos descargables, respuestas prácticas guardables y exportables. Examen recuperado conservado como práctica. Ninguna calificación oficial ni certificado automático.
- Explicaciones: ES recuperado, EN desarrollado como guía pedagógica independiente; títulos, ejemplos, ejercicios y retroalimentación en ambos idiomas. Los cuadernos y examen conservan ES/EN juntos.
- Progreso: local separado por cuenta y sincronización en course_lesson_progress; no se modifica Auth, pagos ni membresías. Respuestas y notas se guardan en el dispositivo; se pueden descargar. Progreso de lecciones sí admite sincronización entre dispositivos.
- Pruebas nuevas y estáticas: 14 pruebas de Node aprobadas. Navegador local: idioma, feedback, notas, descarga, navegación y persistencia aprobados. Video: 24 reproducciones (12×1440 px y 12×390 px), avance real sin mute y sin desbordamiento. Audio: pista AAC con señal no silenciosa en los 12 archivos.
- Supabase real: prueba transaccional de guardar/leer progreso propio y rechazo RLS de otra cuenta, revertida completamente.
- Función temporal b67-id101-import cerrada con respuesta 410 y verificación JWT activa tras transferir.
- PA-203, autenticación, precios y pagos: archivos protegidos sin diferencias respecto de 6ba26bccf714d0c9bf3efc3053ca98fd4a4dd548. Catálogo PA-203 conservado sin cambios.
## Limitación de pruebas históricas
npm test contiene un supuesto antiguo de 26 tarjetas en portada; la base actual tiene cuatro entradas en catalog.json. Esa prueba se agota esperando 26 antes de llegar a las pruebas del curso. Inicialmente también faltaba su fixture; se descargó temporalmente para diagnosticar. No se cambió la prueba histórica ni se declara aprobada. La batería actual de 14 pruebas estáticas y las pruebas específicas de ID-101 sí pasan.
## Respaldo
Base protegida en commit 6ba26bccf714d0c9bf3efc3053ca98fd4a4dd548; rama independiente B67-ID101-integracion. La publicación requiere comprobar el alojamiento final antes del cierre.
