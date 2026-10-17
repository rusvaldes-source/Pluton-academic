# B58 — Protección de cabecera y transferencia de cursos

## Banner y menú: condición de integración
- La portada horizontal aprobada contiene textos, menú y CTA *dibujados dentro de la imagen*. No son enlaces. No reemplazar la cabecera funcional de B57 por esa imagen.
- Mantener la cabecera, navegación, selector ES/EN, buscador, login y botones originales en HTML real. La imagen se ubica únicamente en el contenedor del hero; evaluar una versión fotográfica sin interfaz incrustada para evitar duplicación visual.
- Se añadió CSS encapsulado (`visual/b58-banner-integration-guard.css`) y prueba estática. **No demuestra todavía que el banner funcione en B57 ni en móvil.**
- Validar tamaños 360/390/768/1280/1920, menú expandido, idioma, foco/teclado, contraste y recorte de ambos rostros. No hacer deploy sin aprobar las capturas.

## Cursos de LearnWorlds → B58
- Inventario documental de Work: PA-203 (25 actividades), ID-101 (19), MKT-201 (14), total 58 actividades referenciadas. No equivalen a 58 lecciones con contenido descargado.
- PA-203, ID-101 y MKT-201 son tres de los cinco cursos de lanzamiento; Computación y Nurse Assistant son cursos separados, con materiales y códigos todavía por conciliar.
- Conservar las lecciones existentes en B57 y sus índices de progreso; asignar identificadores estables antes de agregar o reordenar actividades.
- No importar únicamente títulos o enlaces como si fueran videos/PDFs reales. Verificar origen, idiomas, licencias, evaluaciones y archivos multimedia.
- Los demás cursos del catálogo se conservan como futuros, no se eliminan.

## Bloqueos comprobables
1. Falta copia completa verificable de la rama B57-Prueba en este paquete.
2. Falta recuperación de los binarios y textos completos de la plataforma de cursos anterior.
3. Permisos de escritura del conector GitHub devolvieron 403 en el intento previo.
4. Las pruebas de B58_BUILD son unitarias/estáticas; falta Playwright y pruebas integrales de login, cursos, certificados, traducción y navegación.

**Estado:** preparatorio; no instalado, no probado en B57, no publicado.
