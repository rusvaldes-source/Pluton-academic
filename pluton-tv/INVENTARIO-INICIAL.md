# PLUTÓN TV — Inventario de integración inicial (22 oct 2026)

## Confirmado en la rama de pruebas
- `pluton-tv/index.html`: reproductor prototipo con segmentos temporizados y soporte de videos MP4 por URL.
- `pluton-tv/programacion.json`: cinco segmentos de demostración; **son tarjetas, no videos reales**.
- `pluton-tv/parrilla-semanal-propuesta.json`: propuesta semanal todavía no activada.
- `/api/news`: endpoint de PLUTÓN NEWS ya integrado en la página oficial, reutilizable sin cambios.

## Pendiente de verificación antes de enlazar
- URLs reales y permisos de los videos educativos ya aprobados.
- Disponibilidad y reproducción de archivos audiovisuales existentes.
- Fuente de videos dominicales con permiso de inserción.
- Video publicitario real de anunciante autorizado.
- Prueba del reproductor en vista previa de Cloudflare, especialmente en móvil.

## Alcance acordado
- Gratuito, sin cuenta y sin membresía.
- Reproducción continua de videos grabados; **sin directo**.
- Noticias, familia, educación, emprendimiento y anuncios entre programas.
- No publicar ni modificar producción hasta probar y obtener autorización.

## Nota de precisión
Una búsqueda de código por cadenas `.mp4`, `videos/` y `heygen` no devolvió resultados; esto **no demuestra** que no existan videos. Requiere inventario real del repositorio y/o almacenamiento.
