PLUTÓN ACADEMIC — V4 PLATAFORMA VIVA — 08 OCT 2026
BASE: V3 reparación. Nombre único para evitar confusiones en Android.

Sube TODO el contenido de este ZIP a la raíz de GitHub, incluyendo la carpeta functions/api/news.js. No subas solamente la carpeta contenedora. Cloudflare Pages debe estar conectado al repositorio para ejecutar Pages Functions.

NOVEDADES V4:
- Reto diario interactivo bilingüe, con resultado local en el navegador.
- Panel: sugerencia de siguiente curso y enlace al reto del día; no cambia Supabase ni el login.
- Noticias: función /api/news con RSS externo y mensajes de error si no hay servicio. Requiere Cloudflare Pages Functions y conexión a Internet; no garantiza disponibilidad ni verifica titulares.
- Se preservan 14 cursos y lecciones, estilo móvil V3, selector ES/EN, membresías, login y cuestionarios.
- Comunidad: el buzón existente es LOCAL, no es todavía un foro entre usuarios.
- Fotografías y videos externos no incluidos: requieren recursos autorizados; no se han inventado materiales audiovisuales.
- No se habilitaron pagos ni se modificaron las claves de Supabase.

IMPORTANTE: conserva copia de V3 reparación antes de desplegar. Las comprobaciones de archivos y sintaxis no sustituyen pruebas reales en producción.

V4.1: corregidos los botones del reto diario y renovada la versión de CSS para evitar caché. Conservar functions/api/news.js en su ruta al subir el paquete completo.
