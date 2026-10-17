# B58B — avance técnico verificado

- Supabase consultado en vivo: `profiles` (1 fila), `support_admins` (0), `support_tickets` (0), `support_messages` (0), con RLS habilitado; 0 Edge Functions. No se ha desplegado IA ni automatización de soporte.
- Redes: Instagram, Facebook, YouTube, LinkedIn y TikTok seleccionadas; WhatsApp opcional. Ninguna URL oficial verificada. `social-links.js` ahora requiere `verified: true`, HTTPS, host permitido y ruta de perfil real, y evita mostrar redes vacías. Incluye fallback de texto accesible, hasta incorporar logos oficiales aprobados.
- La integración en el footer real y la verificación de propiedad de cuentas siguen pendientes. No inventar perfiles, no activar enlaces ficticios.
- Membresías aprobadas: START 10.49/14.99, PLUS 17.49/24.99, PREMIUM 27.99/39.99 USD, 30% por tres meses para primeros 100 elegibles. Pagos no conectados.
- B58 no apto para publicación: integrar base B57, materiales, pruebas E2E, pagos y permisos administrativos.
- No se modificó GitHub, Cloudflare, sitio público ni las tablas de Supabase en esta tarea.
