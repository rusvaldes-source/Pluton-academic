# PLUTÓN ACADEMIC — Método reutilizable de importación de videos (B66)

## Resultado comprobado (18 octubre 2026)
Se transfirieron cuatro MP4 originales de HeyGen (PA-203 L05–L08) directamente a Supabase Storage sin descarga manual. Se verificó su existencia y tamaño en `storage.objects`. Se actualizaron las rutas HTTPS en `b66/pa203/curso-completo-borrador.json` y el reproductor `b66/pa203/pa203-aula.js` para admitir rutas HTTPS absolutas. **No confundir existencia del archivo con QA de reproducción/audio en navegador.**

## Procedimiento para cursos futuros
1. Obtener los IDs de los videos aprobados y consultar HeyGen `get_video(videoId)`. Exigir `status=completed` y `videoUrl` firmada aún válida. Registrar curso, lección, duración, presentador y nombre definitivo del MP4.
2. Crear un bucket de Supabase Storage apropiado para el curso (límite de tamaño y MIME `video/mp4`). Definir visibilidad pública solo para videos educativos destinados a reproducción pública; en otros casos usar bucket privado y URLs firmadas con control de acceso.
3. Desplegar **temporalmente** una Supabase Edge Function de transferencia servidor-a-servidor: recibe una solicitud autenticada/autorizada; usa `fetch(videoUrl)` desde Deno para obtener el binario real; comprueba HTTP 200, MIME/tamaño razonables; sube el `ArrayBuffer` al endpoint `/storage/v1/object/<bucket>/<path>` usando `SUPABASE_SERVICE_ROLE_KEY` únicamente en el servidor (nunca navegador/GitHub). Usar nombres predefinidos y listas permitidas, no URLs arbitrarias suministradas por usuarios.
4. Invocar la función mediante un cliente autorizado o, cuando corresponda, una solicitud de red desde Supabase `pg_net`. No guardar URLs firmadas de HeyGen en archivos permanentes: caducan.
5. Consultar `storage.objects` para confirmar **cada archivo** y tamaño. Verificar acceso HTTPS y reproducción real en navegador, sonido, duración, móvil y CORS antes de marcar QA aprobado.
6. Cambiar el JSON del curso para que `video` apunte a la URL permanente del MP4; adaptar el reproductor para admitir `https://` además de rutas relativas. Documentar versión, commit, fecha y prueba de cada video.
7. **Desactivar o retirar la función temporal de importación** y cualquier token de transferencia al finalizar. Nunca dejar un endpoint público que acepte un token estático en código. En B66 la función `b66-pa203-video-import` fue sustituida por una respuesta 410 y verificación JWT activada.
8. No publicar en `main` ni modificar la base estable sin autorización; trabajar en rama de prueba.

## Infraestructura usada en B66
- Proyecto Supabase: `paifjzznyiehwidoqjqb`.
- Bucket: `pa203-videos`.
- Tabla de verificación: `storage.objects`.
- GitHub: rama `B66-PA203-preparacion`.
- Video L05: `PA-203_Leccion_05_05423b95514bd66e8608b753dfd44a00.mp4` — 17,850,443 bytes.
- Video L06: `PA-203_Leccion_06_2e07f54d434467a07494e38951d85a17.mp4` — 16,792,589 bytes.
- Video L07: `PA-203_Leccion_07_6c90166c69872a754564584be5aaaa8d.mp4` — 15,881,427 bytes.
- Video L08: `PA-203_Leccion_08_95b0d1b0e3f5d46cd3c5f36dcb3ae5c6.mp4` — 16,933,278 bytes.

## Advertencias
- No usar el selector de archivos del navegador automatizado para transferencias de binarios: el selector local puede bloquearse.
- No guardar URLs firmadas de HeyGen en el catálogo ni reutilizar una URL caducada.
- Evitar registrar credenciales y tokens en repositorios. Usar autenticación robusta en cualquier función futura; restringirla a operadores autorizados.
- Si la descarga falla, renovar la URL con HeyGen `get_video` y repetir el intento autorizado; no generar otro video salvo indicación expresa.
- Las verificaciones en `storage.objects` prueban persistencia, **no reproducción real**.
