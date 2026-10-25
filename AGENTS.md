# PLUTÓN ACADEMIC — Orden permanente de respaldo

Orden del fundador: todo trabajo debe quedar guardado y bajo control. Ninguna rama de trabajo puede depender únicamente de la copia local.

1. Trabajar en una rama identificada por versión. Antes de modificar una versión estable, crear y verificar su respaldo remoto.
2. Después de cada avance terminado y antes de pausar, cambiar de tarea, cambiar de sesión o entregar: revisar los archivos pendientes, crear un commit y guardar la rama en GitHub. No posponer el respaldo hasta el final del proyecto.
3. Verificar el respaldo leyendo de nuevo la rama remota. Registrar nombre de rama y SHA del commit remoto; comprobar que contiene el commit local o exactamente el mismo árbol de archivos si el conector de GitHub creó un commit equivalente.
4. Ejecutar `python3 scripts/verificar-respaldo.py --all` antes de entregar. Un error, una rama sin respaldo o archivos pendientes impiden declarar el trabajo respaldado/terminado. Revisar también los archivos nuevos no rastreados; nunca agregarlos a ciegas ni incluir secretos.
5. Contenidos y medios privados de cursos, respuestas, credenciales y datos personales NO se publican en el repositorio público. Guardar esos entregables en su destino privado persistente, verificar guardado e inventario y conservar los originales aprobados.
6. Cada entrega debe identificar versión, rama remota, commit remoto, inventario de archivos y resultado de verificación. Los enlaces locales solos no cuentan como respaldo.
7. No fusionar ni publicar cambios de producto sin la autorización aplicable del fundador. No sobrescribir trabajo ajeno ni forzar ramas para resolver discrepancias.
8. Si el guardado remoto falla, informar el fallo concreto y conservar los archivos. No afirmar que se guardó, no abandonar la tarea como terminada y no sustituir silenciosamente archivos originales por otros nuevos.

Este control debe aplicarse a todas las tareas futuras del proyecto. No es una promesa de respaldo automático de servicios externos: exige ejecutar y comprobar el respaldo en cada avance.
