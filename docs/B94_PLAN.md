# B94 · Auditoría y correcciones del administrador

Solicitud: revisión profunda del panel y arreglos necesarios. Conservar la misma cuenta de estudiante/administrador, los permisos actuales y las funciones reales. No crear cuentas, no cambiar contraseñas ni enviar correos, no activar pagos, no publicar noticias de prueba.

Hallazgos reproducibles a corregir: cierre de sesión global al negar acceso administrativo; carrera entre PASSWORD_RECOVERY y refresh que oculta recuperación; datos privados antiguos visibles al cambiar cuenta antes del refresco; errores de red que dejan cargando; URL almacenada no validada antes de crear enlace; estado vacío de noticias ausente; respuesta tardía de guardado puede borrar un formulario de otra sesión. SDK sin versión fijada y documentación/SQL antiguos que podrían sustituir la función de permisos por una tabla distinta de la real.

Plan:1) pruebas DOM realistas de cada fallo;2) corrección de estado de sesión, errores y enlaces;3) sincronizar textos/documentación con módulos reales y fijar SDK existente local;4) verificar RLS/rol sin cambiar los datos;5) revisión independiente, publicación autorizada e informe privado.

Límites: gestión de cursos/certificados/pagos no existe y no se presentará como operativa. No se simulará sesión autenticada en el navegador real; la revisión visual privada requiere el acceso seguro del propietario.

Revisión final: detectó persistencia del formulario de recuperación al cambiar de identidad. Dos pruebas adicionales observadas fallar y luego pasar; se cancela recuperación y se borran campos de contraseña en cambios de cuenta/cierre de sesión. Sin más hallazgos materiales del revisor.
