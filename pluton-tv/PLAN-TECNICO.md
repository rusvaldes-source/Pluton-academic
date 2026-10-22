# PLUTÓN TV — Plan técnico de integración (solo pruebas)

## Base
- Inspiración visual y fuente de titulares: PLUTÓN NEWS existente.
- Mantener intactos `main`, `index.html`, la API de noticias y la página pública.
- Trabajar exclusivamente en `feature/pluton-tv-prototipo-20261022`.

## Arquitectura
1. Reproductor de videos propios alojados en URL HTTPS, con reproducción continua, transición al siguiente y repetición.
2. Archivo JSON de programación editable sin modificar el reproductor.
3. Parrilla por día y franja horaria, zona `America/New_York`, con selector de contenido.
4. Noticias: consumir `/api/news` existente, mostrar fuente y enlace; no convertir titulares en videos ni retransmitir emisiones de terceros sin permiso.
5. Publicidad: insertar segmentos entre programas completos; identificar como publicidad.
6. Mostrar «Ahora en PLUTÓN TV» y «A continuación».
7. Contenido gratuito sin login, membresía ni pago.
8. Domingo «Fe, Familia y Esperanza»: acceso voluntario, plural y con transmisiones autorizadas.
9. Incorporar videos educativos ya aprobados únicamente después de verificar sus rutas, reproducción y permisos.

## Distinción esencial
Un repetidor de videos no es técnicamente una señal en directo sincronizada entre todos los espectadores. Para simular un canal lineal sincronizado hay que determinar el segmento según hora de servidor y posición temporal; para eventos en vivo reales se requiere señal autorizada y servicio de streaming.

## Validaciones pendientes
- Verificar el reproductor en la URL de vista previa Cloudflare.
- Comprobar videos MP4, errores de red, reproducción automática silenciada, controles accesibles, móviles y enlaces externos.
- Auditar videos existentes antes de incorporarlos.
- Verificar parrilla y cambio de día en Miami, anuncios, créditos y derechos.
- Revisar rendimiento y costos de ancho de banda.
- Solo proponer integración a producción después de pruebas y autorización expresa.

Estado: documentación de diseño, NO publicado ni probado en producción.
