# PLUTÓN TV — Control de calidad antes de publicar

**Estado:** prototipo de GitHub, sin despliegue ni publicación en producción.  
**Regla:** no modificar `main` ni los MP4 originales. No publicar lecciones completas de pago.

## Pruebas individuales preparadas

| Área | Ruta en la rama | Reproducción real |
| --- | --- | --- |
| Inglés desde cero | `pluton-tv/prueba-video-ingles.html` | Pendiente |
| Herramientas digitales / Adays | `pluton-tv/prueba-adays-pa203.html` | Pendiente |
| Enfermería | `pluton-tv/prueba-enfermeria.html` | Pendiente |
| Computación básica | `pluton-tv/prueba-computacion.html` | Pendiente |
| Marketing digital | `pluton-tv/prueba-marketing.html` | Pendiente |
| Astronomía / Orbits | `pluton-tv/prueba-video-externo.html` | Reproducción reportada como correcta en Android Chrome; repetir antes del lanzamiento |

## Cómo aprobar cada prueba en un navegador real

1. Abrir la página en una **vista previa de la rama** (GitHub por sí solo no ejecuta la página como sitio). No publicar la vista previa para el público.
2. Pulsar **Reproducir** y confirmar imagen y audio.
3. Confirmar que la duración indicada es la del MP4 y que el video llega al final **sin corte a 20 ni 180 segundos**.
4. Probar **Pausar**, volver a reproducir y, en móvil, pantalla vertical.
5. Comprobar que aparece el estado de **finalizado** y no un error de reproducción.
6. Anotar resultado y fecha en esta lista; si falla, registrar navegador y mensaje exacto.

## Bloqueos de publicación

- **Los archivos de curso provienen de buckets públicos de Supabase.** `noindex` y `controlslist="nodownload"` no protegen ni recortan el archivo. El navegador puede obtener el MP4 completo. No enlazar las pruebas desde producción.
- Crear y almacenar **clips promocionales independientes** antes de añadirlos a `programacion.json`. No basta con detener el reproductor mediante JavaScript.
- Confirmar derechos y créditos del material externo.
- Revisión final de reproducción móvil, audio, enlaces y avance automático del canal.
- Autorización explícita antes de integrar en `main` o publicar.

## Criterio de cierre

Solo marcar **listo para publicar** cuando los cinco MP4 estén probados en un navegador real, existan clips promocionales separados y se apruebe el canal. Las verificaciones de código por sí solas **no equivalen** a comprobar la reproducción.
