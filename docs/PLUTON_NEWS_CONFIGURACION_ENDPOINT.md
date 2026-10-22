# PLUTÓN NEWS — conexión Cloudflare/Supabase (pendiente de despliegue)

## Archivos en la rama aislada
- `noticias/index.html`: página bilingüe de prueba, no indexable.
- `noticias/news-reader.js`: consulta `/api/news`, filtros ES/EN, solo muestra estado published.
- `functions/api/news.js`: Cloudflare Pages Function que devuelve únicamente campos de noticias publicadas.

## Configuración pendiente (NO hacer todavía en producción)
Cloudflare Pages debe tener variables **solo de servidor**:
- `PLUTON_SUPABASE_URL`: URL HTTPS del proyecto.
- `PLUTON_SUPABASE_SERVICE_ROLE_KEY`: clave de servidor como **Secret** en Cloudflare, nunca en GitHub ni en JS del navegador.

**Advertencia de seguridad:** esta clave puede omitir RLS. La función impone el filtro `status=published`, selecciona campos concretos y nunca devuelve la clave. Antes de desplegar, revisar código, limitar la clave a este entorno y verificar que no existan rutas alternativas de exposición. Preferir una credencial de menor privilegio/endpoint RLS dedicado cuando se complete la arquitectura.

## Pruebas aún no ejecutadas
1. Configuración de secrets en entorno de prueba.
2. `GET /api/news` sin configuración debe devolver 503.
3. Con configuración, solo noticias published y nunca draft/review.
4. Sin noticias, devuelve arreglo vacío.
5. Probar error de Supabase, métodos no permitidos, límites, móvil e idioma.
6. Solo después solicitar autorización para despliegue o fusión.

## Situación real al 21 octubre 2026
La tabla `pluton_news` tiene cero registros; no hay noticias reales para mostrar. No se ha cambiado el esquema, RLS, secretos ni la página pública.
