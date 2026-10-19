# B75 — Portadas del catálogo público

Alcance: reemplazar exclusivamente las seis portadas del catálogo mostrado en las capturas y corregir su encuadre. Los valores de las lecciones, textos educativos, ejercicios y videos permanecen iguales. No se modifica Supabase, autenticación, membresías ni pagos.

| Curso | Imagen |
| --- | --- |
| PA-101 | b75/pa101-fundamentos.webp — escena ilustrativa de práctica con maniquí |
| PA-203 | fundador.webp — imagen aprobada del fundador |
| ID-101 | b75/id101-ingles.webp — imagen de inglés aprobada previamente |
| MKT-201 | b75/mkt201-marketing.webp — profesional negra en un espacio de marketing digital |
| NA-101 | assets/b74/na101-hija-enfermeria.webp — imagen aprobada |
| COMP-101 | assets/b74/comp101-hija-computacion.webp — imagen aprobada |

El archivo catalog.json cambia únicamente los campos cover. El CSS nuevo se limita a #mainCatalog y utiliza contain para conservar caras, equipos y gráficos completos dentro de un marco uniforme. Los archivos históricos de las portadas permanecen disponibles. La portada principal conserva las dos fotos corregidas en B74.

Generación: herramienta integrada image_gen; conversión a WebP para la web, sin modificar los originales. Las escenas nuevas son ilustrativas y no representan personal real de la academia.

## Prompts finales

### PA-101

Use case: photorealistic-natural. Asset type: premium horizontal course catalog cover for PLUTÓN ACADEMIC, course PA-101 Nursing Assistant Fundamentals. Create a sharp high-resolution professional editorial photograph in a bright modern clinical training room, an adult female healthcare educator in clean navy scrubs demonstrating a blood-pressure cuff on a realistic medical training mannequin's arm, a neatly made training bed, simple healthcare supplies and a notebook visible. Respectful educational scene, no real patient, no invasive procedure. Wide 16:9 composition, all faces and relevant equipment entirely inside frame with generous safe margins, naturally proportioned hands, realistic materials and soft daylight. Cohesive deep navy, white and subtle warm gold accents. This is a course-cover photograph, not a website screenshot, not a collage. No added logos, no text, no watermark, no blurry foreground, no fake social icons.

### MKT-201

undefined

## Verificación

Pruebas del catálogo con Chromium en 390, 768 y 1440 píxeles: seis portadas distintas, fuente de al menos 1400 píxeles de ancho, imágenes decodificadas, encuadre contain, sin desbordamiento de las tarjetas y cambio ES/EN. Comparación estructural del catálogo antes/después excluyendo cover para comprobar que el contenido educativo no cambió. Verificar también el dominio público tras el despliegue.


### Ajuste final de encuadre de MKT-201

Edit only the framing of this photograph. Zoom the camera out and extend the room ABOVE the subject so the Black woman's entire hair silhouette is visible, with a generous clear band of background above the highest curls, at least 8% of the full image height. The top of her head and hair MUST NOT touch any edge. Keep the same adult woman, face, natural hair, skin tone, navy blouse, pose, laptop and marketing dashboard, phone, notebook, products and room. Do not change her identity or replace her. Retain all the important desk objects and photographic quality. Wider 16:9 shot with much more headroom, no collage, no new text, no watermark. The only intended change is safer uncropped framing.


## Corrección de caché de portadas

Las capturas del propietario muestran marcos B75 nuevos junto con portadas previas. La carga del catálogo ahora utiliza una URL de datos con versión y cache: no-store; el HTML también cambia la versión del script. No se modifican imágenes ni contenido educativo. Regresión: simular una respuesta antigua en catalog.json sin versión; comprobar que las seis portadas nuevas siguen cargando con el recurso versionado, en ES/EN y móvil/escritorio.


## B76 — medidas de la plantilla superior (19 oct 2026)

El propietario confirmó que las fotos ya cambiaron y pidió usar la presentación de las cinco tarjetas superiores. El catálogo ahora adopta cinco/tres/dos/una columnas con los mismos cortes de 1100/700/410 px, separación de 16/12 px, bordes de 17 px e imágenes de 180/145/200 px de alto. Se elimina el marco interno fijo 3:2 y la imagen pasa al borde superior de la tarjeta. Se mantiene la proporción mediante cover y el punto de encuadre superior protege los rostros; esto puede recortar bordes laterales o inferiores según la pantalla, igual que la plantilla de referencia.

Las seis fuentes existentes se conservan, incluido Marketing con la profesional negra. No se generan, recomprimen ni sustituyen archivos de imagen. El catálogo, las lecciones y los videos permanecen idénticos. La versión de la hoja de estilos cambia para evitar caché antigua.

Verificación comparativa con Chromium a 390, 430, 768 y 1440 px: alturas, número de columnas y radios iguales a la plantilla superior; imagen al ancho de tarjeta; ausencia de desbordamiento; ES/EN; resolución suficiente para densidad 3x en móvil/tableta y 2x en escritorio, sin ampliación de píxeles físicos. Inspección visual de los cuatro tamaños. La versión previa fallaba la comparación de altura (208,66 frente a 200 px en móvil).
