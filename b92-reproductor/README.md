# B92 · Reproductor de narración bilingüe

Extensión del lector existente: dos pistas de audio por lección y transcripciones, reproducción exclusiva entre audio/video, detención al navegar o cambiar idioma, estado explícito para archivos pendientes y errores de carga.

Este repositorio es público. El catálogo completo, los guiones y las grabaciones del futuro curso de pago NO se incluyen aquí. La entrega privada contiene el HTML autónomo y los medios. Este directorio contiene únicamente código genérico; no se añade una ruta pública ni se cambia la portada.

Contrato: window.PREVIEW_DATA con title/subtitle/notice/items. Cada item usa los campos actuales id,title,category,goal,sections,practice,quiz,sources y audio_text{es,en}; audio{es,en} incluye status, file y display_name. Solo status completed crea un reproductor; otros estados muestran texto de pendiente y transcripción. support_clip opcional: status completed,file,captions. Los paths de archivos son relativos a la entrega. Las respuestas se conservan solo durante la lectura; no hay reproducción automática ni evaluación oral.

La futura venta requiere autenticación y permisos en servidor. Este código no implementa cobros ni protección de contenido.
