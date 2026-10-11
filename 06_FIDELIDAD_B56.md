# Referencia funcional B56

Referencia GitHub de solo lectura: `f679b5d15435fb98e95bb85ab25645ae609c8c73` («B56 -2»). Se compararon los blobs de las 127 fuentes/recursos presentes con la copia B56 disponible: coinciden. Los otros cuatro archivos de la lista remota son auxiliares de empaquetado/pruebas; no cambian las pantallas utilizadas. No se modificaron archivos de B56.

| Función | Representación permitida en el proyecto | Evidencia |
|---|---|---|
| Login y cuenta | Modal Iniciar sesión; correo y contraseña; cuenta en panel | `app.js`, `dashboard.js`, B56 funcional confirmado por usuario |
| Membresía registrada | El panel muestra el plan del perfil | `dashboard.js`, consulta del perfil existente |
| Catálogo y lecciones | Buscar por nombre/código, desplegar una lección | `catalog.json`, `courses.js` |
| Evaluación y avance | Una respuesta correcta completa la lección y actualiza avance | `courses.js` |
| Progreso | Guardado local; sincronía de cuenta al iniciar sesión con conexión cuando está disponible | `progress-sync.js` |
| Apuntes | Guardado en este navegador | `lesson-notes.js`, `study-tools.js` |
| Recursos de estudio | Tarjetas y diálogo Imprimir/Guardar PDF | `courses.js`, `study-media.js` |
| ES/EN | Selector y contenido real de ambos idiomas | `language.js`, catálogo bilingüe |
| Planes comerciales | Consultar START/PLUS/PREMIUM; no simular compra | `app.js`: suscripciones/pagos todavía por habilitar |
| Certificados | Sección y modelo informativo; no simular emisión/validación/descarga | `index.html`, ausencia de ruta de generación en B56 |

Los guiones no prometen títulos oficiales, acreditaciones, empleo, pagos activos, tutoría en vivo, clases en video disponibles, app instalada ni verificación automática de certificados. La presentación institucional se centra en misión y formación práctica. El tutorial explica el alcance actual sin modificar funciones.
