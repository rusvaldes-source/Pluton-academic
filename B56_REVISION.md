# PLUTÓN ACADEMIC B56 — revisión privada

Base: GitHub `rusvaldes-source/Pluton-academic`, rama `main`, commit `705ec81e0108ae6562bdd09bada00583906eff0b` (B55). Comparada con B42, commit `df41d295c7c5ac02052fbe34d3fb6bfc2337b1b0`. El núcleo de acceso, panel, lecciones y catálogo de ambas versiones es idéntico. Se conservan las mejoras posteriores de presentación y fotografía de B55.

## Regresiones reproducidas y corregidas

| Fallo comprobado | Corrección |
| --- | --- |
| `news.js` contenía código de servidor y generaba `Unexpected token 'export'` en el navegador. Los controles de participación no ejecutaban acciones. | Restaurado el módulo de navegador desde el historial; recuperada la ruta original `functions/api/news.js` para el servidor. |
| El buscador de lecciones intentaba insertar un botón delante de un elemento que no era hijo directo de la cabecera. | Corregida únicamente la posición de inserción. Se mantienen sus resultados, navegación y teclado. |
| Búsqueda, rutas de aprendizaje, títulos y mensajes dinámicos no cambiaban completamente ES/EN. | Completadas las traducciones faltantes; traducción reversible de textos que cambian después de abrir ventanas o ejecutar acciones. |
| El panel mostraba estados de cuenta y membresía en español estando en inglés; el selector alternaba entre idioma actual y destino. | Estados traducidos explícitamente, preservando correo y valor real de membresía. Selector coherente con B55: muestra el idioma actual. |
| Un error al consultar el perfil se presentaba como ausencia de membresía. | El error muestra «No disponible / Unavailable»; una consulta correcta sin membresía conserva «Sin membresía / No membership». |

Las noticias reciben ahora el idioma seleccionado y descartan respuestas anteriores cuando se cambia rápidamente de pestaña o idioma. Se versionaron las referencias locales de las tres páginas para cargar el mismo paquete B56.

## Comprobaciones

16 grupos de pruebas de navegador aprobados, más pruebas del servidor de noticias:

| Área | Resultado |
| --- | --- |
| Catálogo | 26 cursos, 70 lecciones; contenido y JSON sin cambios. |
| Navegación | Enlaces internos, filtros, búsqueda por nombre/código, curso RE-201, enlaces de lección, menú móvil y buscador con teclado. |
| Autenticación y perfil | SDK Supabase real con respuestas de prueba: validación, credenciales incorrectas, registro, recuperación, login → panel, correo, START/PLUS/PREMIUM, perfil ausente, fallo del perfil y cierre de sesión. |
| Traducción | Portada, panel, lecciones, búsqueda, cuestionarios, ventanas, estados, títulos y controles ES/EN. |
| Aprendizaje | Las 70 respuestas correctas registran 70/70 y 100%; respuestas vacías o incorrectas no completan la lección. |
| Funciones conservadas | Notas y exportación TXT, favoritos, reanudar lección, tarjetas de estudio, impresión, controles de lectura en voz alta, reto diario y participación. |
| Imágenes y recursos | Todas las imágenes originales decodifican; los recursos de catálogo cargan. Ninguna imagen ni estilo fue reemplazado. |
| Pantallas | Portada, panel y lecciones en 320, 390, 768 y 1440 px; sin desbordamiento horizontal. |
| JavaScript | Sin errores de ejecución en los recorridos probados. |
| Noticias | Parser RSS, idioma, categoría inválida, filtrado de enlaces, servicio caído y despacho de archivos de la vista privada comprobados. |
| Conectividad real | Consulta de solo lectura a Supabase Auth: HTTP 200; clave existente aceptada y registro por correo habilitado. |

## Límites de la validación

El inicio de sesión con una cuenta real, su membresía en producción y la entrega de correos deben revisarse con la cuenta del propietario. Las pruebas de esos recorridos interceptaron las respuestas para no crear usuarios, enviar correos ni modificar información real. La narración se probó mediante los controles y el idioma solicitado; la voz audible depende del navegador y dispositivo.

Los planes y certificados informativos, el contenido introductorio y las funciones anunciadas para el futuro se conservaron como estaban. No se activaron pagos, videolecciones, certificados verificables ni contratación empresarial. El servicio de noticias depende de la disponibilidad de su fuente externa.

En el despliegue privado se comprobaron las tres páginas, la carga de Supabase y los cambios de idioma sin errores JavaScript. Los archivos publicados coinciden con los comprobados. La ruta de noticias ya ejecuta su servidor, pero la fuente externa devolvió un fallo de disponibilidad (HTTP 503); la interfaz lo comunica correctamente en ES/EN. No se muestran titulares inventados. Esta disponibilidad queda pendiente de comprobación cuando responda la fuente.

Vista privada de revisión: https://pluton-academic-b56-revision.genialwood16.chatgpt.site

No se publicaron cambios en GitHub ni Cloudflare, ni se modificaron claves, reglas, esquema o datos de Supabase. La única publicación autorizada es la vista privada de revisión en Sites.

## Paquete

`B56_PLUTON_ACADEMIC_ESTABILIZADO.zip` contiene el sitio completo, la ruta `functions/api/news.js`, este informe y las pruebas. Es una versión para revisión y aprobación; no requiere editar líneas manualmente. Antes de cualquier actualización externa se debe aprobar esta versión.
