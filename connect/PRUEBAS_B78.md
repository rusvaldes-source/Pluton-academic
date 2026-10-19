# B78 · Protocolo de pruebas sin estudiantes reales

## Ya verificado en Supabase (19 oct 2026)
- connect_profiles y connect_posts existen con RLS habilitada.
- rol anon: SELECT denegado.
- rol authenticated sin JWT de usuario: SELECT permitido por GRANT pero devuelve cero filas bajo RLS.
- intento de INSERT con UUID ajeno y rol authenticated: rechazado por RLS.
- No se insertaron datos reales de prueba.

## Pruebas pendientes en entorno aislado
1. Crear dos cuentas ficticias verificadas A y B en un proyecto Supabase de pruebas, no en producción.
2. Iniciar sesión con A y B; registrar perfiles con nombre y país.
3. A publica; B ve la publicación; B no puede actualizar el perfil de A ni borrar su publicación.
4. A borra su publicación; B deja de verla.
5. Sin sesión, comprobar que no se pueden consultar ni publicar datos.
6. Probar contenido HTML malicioso: debe verse como texto, sin ejecutarse.
7. Probar longitudes máximas, contenido vacío, errores de red y cambios ES/EN.
8. Probar visualmente pantallas de 360px, 768px y escritorio; navegación con teclado.
9. Confirmar que main, cursos, bienvenidas y videos permanecen intactos.

## Bloqueadores de lanzamiento
- No se han ejecutado pruebas completas con dos sesiones autenticadas.
- Faltan comentarios, reportes y moderación antes de abrir una comunidad pública.
- No publicar B78 ni hacer merge hasta resolver estos puntos.
