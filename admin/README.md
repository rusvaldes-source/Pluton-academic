# Administración privada · B95/B96

Ruta activa: `/admin/`. Usa la misma sesión de estudiante y comprueba `is_pluton_admin` en servidor. Un acceso administrativo denegado no cierra la sesión del estudiante. El origen real de permisos es `public.support_admins`, no `admin_users`; no volver a aplicar el arranque B58 antiguo.

Disponible: directorio de perfiles en solo lectura (máximo100), redacción bilingüe de noticias y sus estados (máximo30), referencia de precios sin cobros, revisión de denuncias (máximo50). El campo de progreso mostrado es un indicador histórico del perfil; no agrega progreso por lección. Los límites se indican en pantalla; no son totales globales.

B95: editor de siete cursos por lección, con texto ES/EN, ejercicios y preguntas de práctica, borradores privados, vista previa, publicación CAS e historial/restauración. Los IDs, estructura y alcance clínico permanecen protegidos. Los seis ejemplos y el temario público de ID-001 se proyectan sin publicar las otras 24 lecciones. Las aulas leen el contenido publicado mediante un RPC invoker que conserva el acceso de cada fuente. Las prácticas se separan por revisión; el progreso de lecciones conserva su índice.

B96: búsqueda por correo exacto de cuenta Auth verificada, nombre y evidencia revisados manualmente, vista previa, emisión idempotente de constancia de participación, impresión/PDF del registro guardado y revocación con motivo privado. NA-101 bloqueado en servidor. Verificación pública exacta en `/certificados/verificar/`, sin nombre, correo, UUID ni evidencia. No se emiten certificados de aprobación ni se aceptan porcentajes del navegador como acreditación.

Pendiente: pagos, gestión de acceso de compras, certificados de finalización, canal público de noticias y auditoría general de otros módulos. Los módulos nuevos conservan sus propias versiones y eventos.

Seguridad: SDK local fijado2.117.3; solo clave publicable; permisos reales mediante RLS. Se elimina contenido privado al cambiar de cuenta/cerrar sesión/entrar en recuperación. Respuestas tardías se descartan. La recuperación de contraseña tiene prioridad sobre consultas anteriores. Nunca usar user_metadata para autorizar ni exponer claves de servicio.

`database/admin_security.sql` y su copia raíz son consultas de diagnóstico de solo lectura. No modifican permisos ni sustituyen la función existente. `admin.js` en raíz es un archivo histórico sin ruta activa; el panel ejecuta `admin/admin.js`.

Validación: `node --test tests/b94-admin.test.cjs` y `node tests/admin-static.test.cjs`. La recuperación de correo real, cambio de contraseña, publicación de noticias reales y revisión visual privada requieren comprobación del propietario; no se ejecutan para auditar.


Despliegue: aplicar las migraciones B95, B96 y encapsulación de RPC antes de publicar sus cargadores. Ya aplicadas en el proyecto durante esta revisión; no reejecutarlas a mano. No incluir el payload privado ID-001 en Git ni ZIP público.

Pruebas: `tests/b95-live.sql` y `tests/b96-live.sql` son transacciones revertidas; no dejan cambios ni documentos reales. Las suites jsdom verifican funciones y seguridad de estados, sin sustituir revisión visual privada. El harness histórico `npm test` requiere Chromium; no se completó en este entorno.
