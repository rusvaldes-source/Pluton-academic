# PLUTÓN ACADEMIC B58 — avance técnico, NO versión integral final

**Construcción iniciada:** módulo de migración de progreso que transforma índices de lecciones en identificadores estables y evita pérdida de progreso al intercalar lecciones nuevas. Conserva las claves antiguas para permitir reversión.

**Pruebas aisladas:** `node tests/progress-migration.test.cjs`.

**Pendiente:** integrar con el código completo de `B57-Prueba` (`courses.js`, `progress-sync.js`, `dashboard.js`), ejecutar pruebas del sitio, obtener los contenidos completos, fotografías originales, MP4 y PDFs, y validar ES/EN, audio, certificados y acceso. **No está instalado ni publicado.** La conexión a GitHub permite lectura pero rechazó escritura (403).

**Inventario actual:** 26 cursos en B57, incluyendo PA-203 (2 lecciones), ID-101 (2), MKT-201 (3). Work inventarió 58 actividades, no todas recuperadas como archivos originales.

**Regla:** no modificar `main` ni publicar B58 hasta pruebas y aprobación.
