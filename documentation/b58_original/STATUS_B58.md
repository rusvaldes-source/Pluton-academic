# B58: avance técnico verificable (16 octubre 2026)

- Se generó un manifiesto normalizado de **58 actividades** (PA-203: 25; ID-101: 19; MKT-201: 14), con IDs persistentes y vínculo a la referencia de origen.
- Se agregó comprobación automática de IDs únicos, cobertura y estado pendiente.
- Se conserva el módulo aislado de migración reversible de progreso, sin conexión todavía a B57.
- Los 58 registros son **referencias de inventario**, NO lecciones multimedia integradas. Los textos completos, fotografías, PDFs y videos originales requieren verificación/recuperación.
- No se descargó ni modificó la rama B57-Prueba. No se cambió `main` ni la web pública.
- Pruebas de estos componentes aislados no equivalen a las pruebas de regresión del sitio completo.

## Próxima integración segura
1. Obtener una copia exacta de B57-Prueba y registrar SHA de commit.
2. Asociar IDs a las 7 lecciones existentes sin romper los índices guardados.
3. Integrar contenidos reales y assets con verificación ES/EN y permisos.
4. Ejecutar suite Playwright, inspección visual, pruebas de acceso y móvil.
5. Entregar **un único ZIP integral B58** cuando esté realmente completo.

## Avance visual (16 octubre 2026)
- Creada `visual/b58-visual.css`, una propuesta **encapsulada** que no altera estilos de B57.
- Creada `visual/preview.html` para evaluar tipografía, cabecera, hero, proporción de imágenes, tarjetas compactas, navegación y distribución responsive.
- Añadidos controles de foco visible, movimiento reducido y puntos de quiebre 800/560 px.
- Se usaron marcadores explícitos en lugar de atribuir fotografías no recuperadas.
- Pasaron pruebas **estáticas** de CSS/HTML y pruebas aisladas de inventario/progreso. No hay verificación visual con navegador ni integración con B57 todavía.

## Mejora real de maqueta ES/EN (16 octubre, segundo avance)
- Selector ES/EN **operativo solo dentro de la maqueta**; traducción de cabecera, CTA, tarjetas, avisos y etiquetas de accesibilidad.
- Estados de idioma `aria-pressed`, foco visible y controles táctiles mínimos.
- Se mantiene el CSS encapsulado y la ausencia de fotografías ficticias.
- No es traducción funcional de B57; falta integración y validación en navegador.

## Auditoría pública y corrección preparada (16 octubre)
- Consulta de solo lectura con TinyFish a `/` y `/courses.html`: la página principal contiene texto «20 cursos iniciales» y la página de cursos indica «Lecciones introductorias de demostración».
- La referencia B57 auditada tiene 26 cursos; la discrepancia debe resolverse con datos de catálogo en tiempo de ejecución, no reemplazando a mano por 26.
- Añadido `src/b58-catalog-metrics.js` que calcula cantidad de cursos y lecciones desde el catálogo, detecta códigos duplicados y genera la etiqueta ES/EN.
- Añadido `tests/catalog-metrics.test.cjs`: ocho aserciones superadas. Las cinco suites aisladas existentes se ejecutaron correctamente desde la raíz `B58_BUILD`.
- **No está conectado a index.html ni a producción.** No sustituir los textos sobre lecciones de demostración hasta comprobar que el contenido real esté instalado.

## Lanzamiento acotado a cinco cursos (16 octubre 2026)
- Se codificó `src/b58-launch-catalog.js`: PA-203, ID-101, MKT-201, **Computación** y **Nurse Assistant**, separados. Los dos últimos tienen IDs internos provisionales, sujetos a conciliación con el catálogo real.
- El módulo marca como **Próximamente** cualquier curso sin entrada en catálogo o sin validación explícita de contenido, ES/EN, evaluaciones, multimedia, navegación y QA. Nunca publica cursos por inferencia.
- Los 26 cursos del catálogo B57 no se eliminan: el lanzamiento es una selección, no una purga.
- Test aislado `tests/launch-catalog.test.cjs` agregado. Falta integración real con UI y datos.


## Portada y estudiantes (16 octubre)
Se agregó la portada horizontal aprobada con los dos fundadores en blazer blanco (PNG original + WebP), y el módulo HTML/CSS bilingüe Zona de estudiantes que referencia la foto de estudiante B57. Falta integración en B57-Prueba y verificación de recurso fotográfico.
