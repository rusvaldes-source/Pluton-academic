# PA-203 B66 — reparación de rutas de video (auditoría 2026-10-18)

## Causa comprobada
La web pública no sirve el archivo `b64/videos/PA-203_Leccion_01_cc4044a4a2c5c95c4d42eb2175c1a3d1.mp4`. En B66 el catálogo referencia rutas `b64/videos/...` para lecciones 1, 3 y 4, que se resuelven como archivos del sitio, pero no están publicados en el hosting público. No es un fallo de CSS, controles HTML ni tamaño del archivo.

## Inventario de destinos
| Lección | Ruta actual | Estado |
| --- | --- | --- |
| 01 | b64/videos/PA-203_Leccion_01_cc4044a4a2c5c95c4d42eb2175c1a3d1.mp4 | ERROR confirmado en web pública; ausente en Supabase Storage |
| 02 | Supabase Storage pa203-videos | Objeto presente, reproducción no verificada |
| 03 | b64/videos/PA-203_Leccion_03_b51d75a3472e644708f8c5862407214f.mp4 | Ausente en Supabase Storage; reproducción no verificada |
| 04 | b64/videos/PA-203_Leccion_04_649c942ce17b0d7c914406c841b70b03.mp4 | Ausente en Supabase Storage; reproducción no verificada |
| 05–08 | Supabase Storage pa203-videos | Objetos presentes, reproducción no verificada |

## Corrección técnica pendiente de transferencia
1. Recuperar los MP4 originales de las lecciones 1, 3 y 4 de los archivos aprobados en la rama privada o biblioteca original. Comprobar SHA-256/tamaño y que no sean punteros Git LFS.
2. Subir cada MP4 a `pa203-videos` (o al hosting de pruebas con las mismas rutas); no publicar `main` ni sustituir versiones aprobadas.
3. Comprobar respuesta HTTP 200/206, `content-type: video/mp4`, soporte Range, `loadedmetadata`, `playing`, avance de `currentTime`, imagen y sonido.
4. **Solo después de la subida y pruebas**, actualizar en `b66/pa203/curso-completo-borrador.json` las rutas de 1, 3 y 4 a las URLs verificadas de Storage; conservar 2 y 5–8.
5. Validar en móvil, ES/EN, y marcar cada `video_status` por separado. No confundir la web estable con el prototipo B66.

## Seguridad de despliegue
No copiar los archivos desde GitHub privado a un sitio público sin verificar los originales. No modificar `main`, B63 ni Cloudflare. La Edge Function `b66-pa203-video-import` responde 410 (transferencia cerrada); no depender de ella.

**Estado:** fallo localizado, transferencia de 3 MP4 y pruebas de reproducción aún pendientes.