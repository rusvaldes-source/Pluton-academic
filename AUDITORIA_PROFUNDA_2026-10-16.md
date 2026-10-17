# Auditoría integral de preparación B58 — 16 octubre 2026

## Alcance real
Se revisaron todos los archivos presentes en `/mnt/data/B58_BUILD`, el ZIP acumulado, la portada y los módulos independientes. **No** se ha revisado ni ejecutado la aplicación B57 completa dentro de este paquete; por tanto, no se puede certificar integración, inicio de sesión, pagos, progreso en la nube, certificados, traducción del sitio ni experiencia visual final.

## Evidencia comprobada
- Seis suites Node ejecutadas desde la raíz de B58_BUILD: `catalog-metrics`, `inventory`, `launch-catalog`, `progress-migration`, `visual-i18n`, `visual-static`: todas finalizan correctamente.
- El ZIP acumulado anterior pasó la prueba de integridad de ZIP.
- Portada aprobada disponible en `assets/b58/portada-fundadores-aprobada.png` y `.webp`, ambas de 1983×793; WebP de aproximadamente 217 KB.
- Existe el fragmento HTML bilingüe `visual/zona-estudiantes-b58.html` con enlaces a `dashboard.html` y `courses.html`.
- El inventario de 58 actividades contiene referencias, no archivos de lecciones y multimedia terminados.

## Hallazgos y prioridad

### BLOQUEANTE 1 — La portada incluye interfaz dibujada
La imagen aprobada contiene encabezado, navegación, botón y textos incrustados. Si se usa como reemplazo directo del encabezado real, esos elementos no serán interactivos ni traducibles. **Acción:** preparar una variante fotográfica de fondo y superponer menú, CTA y títulos HTML reales; comprobar contraste y recorte responsive. No publicar el PNG completo como sustituto del menú.

### BLOQUEANTE 2 — No existe integración con B57 en este paquete
`B58_BUILD` es un conjunto de componentes y una maqueta, no una copia completa de B57 con cambios aplicados. **Acción:** obtener árbol y SHA de B57-Prueba, integrar en una copia, ejecutar regresión Playwright y validación de Auth/membresías/progreso.

### ALTO 3 — Fotografía de estudiante no verificada
El fragmento apunta a `assets/b57/estudiante-01.webp`, que no está incluido en B58_BUILD. No hay comprobación de que sea la foto exacta de la hija en el sitio actual. **Acción:** verificar el recurso en B57-Prueba y comprobar su apariencia antes de aprobar.

### ALTO 4 — ES/EN parcial
Las 16 claves de la maqueta están verificadas, pero no existe prueba de traducción completa del sitio ni del texto incrustado en el banner. **Acción:** mantener textos como HTML y auditar cursos, evaluaciones, accesibilidad y enlaces en ambos idiomas.

### ALTO 5 — Contenidos de lanzamiento
La selección son cinco cursos: PA-203, ID-101, MKT-201, Computación y Nurse Assistant; los dos últimos son independientes y sus códigos están pendientes de conciliación. **Acción:** no marcar ninguno como listo hasta disponer de contenido real, pruebas y audiovisuales.

### ALTO 6 — Progreso de estudiantes
Existe módulo reversible por IDs, pero no se ha conectado a `courses.js`, `progress-sync.js` ni panel de B57. **Acción:** migración sin borrar datos previos y pruebas con cuentas existentes.

### MEDIO 7 — Pruebas sensibles al directorio de ejecución
Algunas suites leen rutas relativas a la carpeta raíz; ejecutarlas desde fuera produce ENOENT. **Acción:** ejecutar siempre desde la raíz o refactorizar rutas a `__dirname` para portabilidad.

### MEDIO 8 — Diseño móvil no comprobado visualmente
El CSS tiene reglas responsive, pero las pruebas actuales son estáticas y no demuestran que los rostros, textos o botones se vean bien en móvil. **Acción:** capturas y prueba de interacción real a 360, 390, 768, 1280 y 1920 px.

## Estado final
**Auditoría preparatoria aprobada con bloqueantes identificados. B58 NO apto aún para instalación ni publicación.** No modificar `main` ni web pública hasta pruebas y aprobación del usuario.
