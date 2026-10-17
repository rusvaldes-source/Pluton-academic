# B58: portada y zona de estudiantes

**Portada aprobada**: `assets/b58/portada-fundadores-aprobada.png` (original sin alterar), más copia WebP optimizada. Fotografía del fundador y Adays con blazer blanco, formato panorámico.

**Zona de estudiantes**: `visual/zona-estudiantes-b58.html` + `.css`. Reutiliza `assets/b57/estudiante-01.webp`, la imagen de estudiante referenciada en B57. Antes de publicar, verificar que ese archivo sea exactamente la foto de la hija actualmente en la portada; si no, sustituir solo la ruta por el recurso confirmado.

**Advertencia de integración**: La imagen panorámica aprobada contiene botones y menú *dibujados* que no son interactivos. No sustituir el menú real del sitio con una imagen. En integración definitiva, usar la imagen como arte de referencia, o extraer la zona fotográfica y mantener títulos, navegación, selector de idioma y CTA como HTML reales accesibles. También comprobar contraste, cortes móviles y traducción real del texto.

**Estado**: archivos añadidos al paquete local de desarrollo B58. No integrados todavía en `B57-Prueba` ni desplegados. Sin alterar producción.
