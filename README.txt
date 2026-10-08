PLUTÓN ACADEMIC — paquete completo 08 octubre 2026
Subir el contenido del ZIP a la raíz del repositorio GitHub, manteniendo functions/api/news.js en su subcarpeta. Cloudflare Pages debe desplegar desde GitHub para ejecutar la función de noticias. Si se usa una subida estática directa sin Functions, la sección de noticias mostrará un aviso de no disponibilidad.
Se mantienen los datos de Supabase y las membresías; no se activan pagos.
Cursos: 6 cursos, 12 lecciones con material introductorio y cuestionarios; progreso almacenado LOCALMENTE en cada navegador, no sincronizado a Supabase.
Noticias: titulares externos vía Google News RSS, procesados por Cloudflare Pages Function; caché y refresco al cargar la página. No se garantizan titulares si la fuente externa falla.
Participación: buzón de ideas local en navegador, NO es todavía un foro compartido ni guarda respuestas en una base de datos.
Idioma: ES/EN. Revisar en la página publicada las funciones de autenticación y traducción.


Corrección 8 octubre: traducciones interiores de Participa, estilo de botones y campos. Noticias requiere que functions/api/news.js se conserve en su ruta de carpetas al desplegar Cloudflare Pages. Subir únicamente archivos planos a GitHub NO instala esa función. Si /api/news no está disponible, las noticias mostrarán un aviso, nunca titulares inventados.

AMPLIACION 8 OCT: Se agregan 8 cursos INTRODUCTORIOS bilingües en real estate, negocios, finanzas, IA, mantenimiento, marketing e idiomas, con 2 lecciones y cuestionarios por curso. NO son programas completos ni habilitan licencias profesionales. Se conservan los archivos y funciones previos.

REVISIÓN 8 OCT: Los 14 cursos se muestran ahora en el catálogo principal con filtros y enlace directo a sus lecciones. Se eliminó la lista duplicada al final. Se corrigieron estilos del formulario y pestañas de noticias. El contenido es introductorio y el progreso sigue guardado en este dispositivo.
IMPORTANTE: Subir los archivos de la raíz Y conservar functions/api/news.js en su ruta exacta. La API de noticias requiere Cloudflare Pages Functions habilitadas en el despliegue; si el origen RSS falla, se muestra un mensaje, no titulares inventados.
