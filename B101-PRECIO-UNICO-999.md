# B101 — Venta individual de cursos a USD 9.99

Estado: especificación aprobada; implementación y pruebas pendientes. No publicar.

- Registro gratuito obligatorio con correo, contraseña y perfil antes de comprar.
- Todos los cursos actuales y futuros: precio predeterminado USD 9.99, pago único por curso.
- Sustituir la oferta de membresías; conservar derechos adquiridos y pagos anteriores.
- Conservar el acceso únicamente a cursos comprados, progreso y certificados.
- Reutilizar Supabase Auth, public.course_purchase_access y Stripe; no confiar en confirmación del navegador para otorgar acceso: verificar el pago desde backend/webhook.
- Revisar y actualizar index.html, app.js, dashboard.html y las rutas reales de checkout y catálogo, incluidos textos ES/EN.
- Revisar modo real de Stripe: la conexión accesible actualmente es únicamente de prueba.
- Probar registro, inicio de sesión, compra, webhook, acceso autorizado/no autorizado, reintentos, errores, cursos nuevos y regresiones antes de fusionar.

Esta rama se origina de main. No se han cambiado precios de producción ni activado cobros.
