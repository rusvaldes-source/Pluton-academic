# B58 — Verificación actual, 16 octubre 2026

## Realizado
- Ajustado el instalador local de portada para integrar **también Zona de estudiantes** en copia de B57, sin modificar `<header>`.
- Conservados los botones y enlaces HTML originales; la foto de fundadores es solo un recurso visual.
- Atributos bilingües de Zona de estudiantes alineados con B57 (`data-b53-es`, `data-b53-en`).
- Instalador idempotente: segunda ejecución no duplica componentes; comprueba estructura antes de escribir.
- Ocho suites de pruebas Node superadas, incluida integración local en directorio temporal, preservación de menú, foto presente y segunda ejecución.
- La fotografía anterior `assets/b57/estudiante-01.webp` sigue referenciada desde la Zona de estudiantes.

## No verificado / pendiente
- El paquete B58 no contiene todavía el árbol íntegro de B57 ni los archivos multimedia completos de LearnWorlds; NO es un paquete final desplegable.
- Las 58 actividades inventariadas son registros de PA-203, ID-101 y MKT-201, no prueba de que estén descargados sus videos, evaluaciones y documentos.
- Faltan contenido confirmado de Computación y Nurse Assistant, y pruebas completas de progreso, auth, certificados, filtros y pagos.
- No hay verificación visual de navegador con B58 integrado a 360/390/768/1280/1920; no afirmar que no se desconfigure hasta hacerla.
- GitHub conector permite lectura, pero rechazó escritura con HTTP 403; ninguna rama ni página pública fueron modificadas.

## Criterio de salida
Solo marcar listo para instalación tras recuperar base B57 y recursos, integrar, probar móvil y escritorio, verificar ES/EN y navegación, completar materiales de los cinco cursos y aprobar revisión final.
