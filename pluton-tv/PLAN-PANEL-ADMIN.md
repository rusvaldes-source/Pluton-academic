# Panel administrativo de PLUTÓN TV — especificación de implementación

Estado: **diseño técnico en rama de pruebas; no desplegado ni funcional**.

## Acceso y permisos
- Inicio de sesión con Supabase Auth.
- Rol administrador verificado en servidor mediante una tabla de roles con RLS; ocultar botones no constituye seguridad.
- Solo administradores autorizados pueden crear, modificar, ordenar, aprobar o retirar programación.
- No exponer la clave `service_role` en el navegador.

## Datos del catálogo
- Identificador, título ES/EN, categoría, descripción, miniatura, duración real y orden.
- URL de video promocional independiente o contenido autorizado.
- Derechos de uso, crédito, enlace de licencia y fecha de revisión.
- Estados: borrador, revisión, aprobado, publicado, retirado.
- Fecha de creación, actualización y responsable del cambio.

## Flujo editorial
1. Subir un **clip promocional separado** a un almacenamiento dedicado, privado hasta aprobación.
2. Registrar metadatos y licencia.
3. Reproducir y comprobar video completo, audio y móvil.
4. Aprobar explícitamente para TV.
5. Publicar a la programación solo contenido aprobado; permitir despublicación inmediata.
6. Guardar historial de cambios y posibilidad de revertir.

## Situación actual
- Cinco videos de cursos: imagen y audio comprobados por el usuario desde el teléfono; son originales de lecciones, no clips promocionales públicos.
- Astronomía: prueba previa de reproducción reportada.
- `pluton-tv/index.html`: prototipo con programación desde `programacion.json`.
- Cinco páginas de pruebas individuales.
- No existe todavía un panel autenticado ni despliegue confirmado de la rama.

## Criterios de aceptación
- Usuario no autenticado: sin acceso de escritura.
- Estudiante: sin acceso de escritura.
- Administrador: puede crear borrador, editarlo, previsualizar, aprobar y retirar.
- El reproductor avanza al siguiente video al terminar, sin límite fijo.
- No se publican lecciones completas de pago ni videos externos sin autorización.
- No modificar `main` ni producción sin autorización expresa.
