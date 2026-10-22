# PLUTÓN NEWS — resultado de verificación real (2026-10-21)

**Estado:** rama de prueba. Sin cambios ejecutados en la base de datos ni en producción.

## Comprobaciones
- Proyecto Supabase: Pluton Academic, activo.
- Tabla: public.pluton_news.
- RLS: habilitado.
- Políticas actuales: SELECT/INSERT/UPDATE administrativos, sin política pública de lectura.
- Registros actuales: 0. Publicados: 0.
- Campos: id, title_es, title_en, body_es, body_en, status, created_at, updated_at, published_at, video_url.

## Próxima integración
Implementar lector público limitado a registros aprobados, sin abrir borradores. La propuesta SQL previa es **solo documentación**, no debe ejecutarse directamente sin diseño final de permisos. Se recomienda un endpoint con respuesta filtrada y sin credenciales secretas en el navegador, o un mecanismo RLS cuidadosamente revisado.

## Noticias automáticas
Separar titulares externos de las noticias originales del panel; nunca mezclar automáticamente fuentes no autorizadas con registros aprobados. Primero validar licencia de fuente, deduplicación y moderación.

## Pruebas requeridas antes de publicación
1. Insertar un ejemplo ficticio únicamente en entorno aislado, no en base real.
2. Confirmar que un usuario anónimo no puede ver borradores.
3. Confirmar que solo noticias publicadas se devuelven en la salida pública.
4. Verificar ES/EN, accesibilidad, móvil, manejo de errores y estados vacíos.
5. Revisar y aprobar la integración antes de desplegar.
