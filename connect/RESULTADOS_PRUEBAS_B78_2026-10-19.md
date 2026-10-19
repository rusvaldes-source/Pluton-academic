# B78 — Ejecución de pruebas de seguridad (19 octubre 2026)

Entorno: Supabase Pluton Academic. Consultas SQL con rol autenticado y sub simulado, dentro de transacciones. No se crearon cuentas ni se insertaron datos permanentes.

| Prueba | Resultado |
| --- | --- |
| Rol anon intenta SELECT en connect_posts | RECHAZADO: permiso denegado |
| Rol authenticated sin identidad válida consulta | PERMITIDO, 0 filas visibles |
| JWT sub simulado consulta connect_posts | PERMITIDO, 0 filas |
| Usuario A intenta crear perfil con user_id de B | RECHAZADO por RLS (42501) |
| Usuario A intenta publicar con user_id de B | RECHAZADO por RLS (42501) |
| Integridad: filas permanentes en perfiles y publicaciones | 0 y 0 |
| Políticas RLS instaladas | 6 |

**No probado:** registro real por Auth, creación legítima de perfil y publicación con dos sesiones, borrado legítimo, visualización en navegadores/móvil. Se necesita un entorno de autenticación de pruebas para estas operaciones. No equivale a prueba E2E.

**No publicar** hasta completar E2E, moderación/reportes y revisión visual.
