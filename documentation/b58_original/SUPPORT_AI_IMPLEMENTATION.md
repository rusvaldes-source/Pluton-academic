# B58: soporte e IA — estado técnico

Implementado localmente: página de ayuda bilingüe, flujo de recuperación por Supabase Auth (requiere redirect URL permitida), formulario de ticket autenticado, SQL de tabla con RLS para creación y lectura de tickets propios. **No desplegado.**

Pendiente antes de lanzar: configurar Supabase URL y clave pública; revisar y aplicar migración SQL; configurar rutas de recuperación de contraseña; proteger contra abuso con CAPTCHA/rate limits; panel de tickets del administrador y sus permisos de servidor; email transaccional y notificaciones de administrador/estudiante; estado/historial de tickets; reglas de retención y privacidad; accesibilidad y pruebas E2E.

IA: **no está conectada**. Diseñar un endpoint server-side que consulte FAQ verificada y redacte respuestas sin acceso a contraseñas, tokens, claves ni pagos. Requerir consentimiento y escalado humano para problemas de identidad, cobros, cuentas bloqueadas o solicitudes no resueltas. Notificaciones solo por backend autenticado; no enviar mensajes desde navegador usando credenciales privilegiadas. Mantener registro de interacciones y posibilidad de desactivar automatización.
