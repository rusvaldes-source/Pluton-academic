# B79 — Auditoría de permisos (19 octubre 2026)

Consulta directa a `pg_class`/`has_table_privilege` de Supabase:

| Tabla | RLS | anon SELECT | authenticated SELECT | authenticated INSERT | authenticated DELETE |
| --- | --- | --- | --- | --- | --- |
| connect_posts | activa | no | sí | sí | sí |
| connect_profiles | activa | no | sí | sí | no |

La denegación de DELETE en connect_profiles es intencional según el esquema actual. Para connect_posts, la política DELETE exige `auth.uid() = user_id`. Las políticas de INSERT también requieren propiedad del usuario; en publicaciones, el nombre debe coincidir con el perfil autenticado.

## Resultado
- Configuración de permisos: verificada.
- Tests negativos previos: suplantación de perfil y publicación rechazada por RLS.
- Sin pruebas reales de dos sesiones, registro gratuito ni vista móvil. Esas pruebas requieren una instancia de la rama B79 y cuentas ficticias autenticadas. No confundir inspección de permisos con E2E.
- La rama de prueba no se ha fusionado con main ni publicado.
