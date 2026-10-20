# Administración privada · B94

Ruta activa: `/admin/`. Usa la misma sesión de estudiante y comprueba `is_pluton_admin` en servidor. Un acceso administrativo denegado no cierra la sesión del estudiante. El origen real de permisos es `public.support_admins`, no `admin_users`; no volver a aplicar el arranque B58 antiguo.

Disponible: directorio de perfiles en solo lectura (máximo100), redacción bilingüe de noticias y sus estados (máximo30), referencia de precios sin cobros, revisión de denuncias (máximo50). El campo de progreso mostrado es un indicador histórico del perfil; no agrega progreso por lección. Los límites se indican en pantalla; no son totales globales.

Pendiente: edición de cursos, emisión/validación administrativa de certificados, pagos, gestión de acceso de compras, canal público de noticias, registro de auditoría y controles de recuperación/MFA adicionales. Los enlaces de cursos y biblioteca abren sus vistas existentes; no son editores administrativos.

Seguridad: SDK local fijado2.117.3; solo clave publicable; permisos reales mediante RLS. Se elimina contenido privado al cambiar de cuenta/cerrar sesión/entrar en recuperación. Respuestas tardías se descartan. La recuperación de contraseña tiene prioridad sobre consultas anteriores. Nunca usar user_metadata para autorizar ni exponer claves de servicio.

`database/admin_security.sql` y su copia raíz son consultas de diagnóstico de solo lectura. No modifican permisos ni sustituyen la función existente. `admin.js` en raíz es un archivo histórico sin ruta activa; el panel ejecuta `admin/admin.js`.

Validación: `node --test tests/b94-admin.test.cjs` y `node tests/admin-static.test.cjs`. La recuperación de correo real, cambio de contraseña, publicación de noticias reales y revisión visual privada requieren comprobación del propietario; no se ejecutan para auditar.
