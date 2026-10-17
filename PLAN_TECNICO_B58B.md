# PLUTÓN ACADEMIC — B58B: blindaje técnico previo al lanzamiento

## Diagnóstico basado en el paquete B58 local
- `RELEASE_READINESS.json` indica `release_ready=false`, falta integración B57, pruebas E2E y contenido fuente.
- `membership-pricing-b58.json` fija START 14.99/10.49, PLUS 24.99/17.49, PREMIUM 39.99/27.99 USD; promoción 3 meses, primeros 100 elegibles.
- La facturación real figura como `not_connected` y PREMIUM como `pending_benefit_validation`.
- El SQL del panel administrativo es una propuesta aún no reconciliada con Supabase; no aplicarlo automáticamente.

## Propuesta prioritaria: Release Gate B58B
1. CI en GitHub sobre rama de pruebas: validación de archivos, pruebas unitarias, lint, accesibilidad y seguridad de dependencias.
2. Pruebas end-to-end: alta/login/logout, ES/EN, catálogo, lecciones, progreso, certificados, soporte y control de acceso admin.
3. Ensayo de despliegue en Cloudflare Preview, nunca en producción; aprobación manual para publicar.
4. Backup/rollback: snapshot de esquema y datos, copia versionada de medios, rollback probado y sin sobrescribir progreso.
5. Registro de auditoría de cambios administrativos y alertas de errores sin exponer información privada.

## Módulo de membresías seguro (obligatorio antes de cobrar)
- Stripe Checkout/Billing gestionado en backend, con productos y precios validados contra la configuración aprobada.
- Webhook firmado; idempotencia por ID de evento; estado de suscripción almacenado en Supabase solo por servicio confiable.
- Derechos de acceso (entitlements) calculados en backend: START, PLUS, PREMIUM, expiración, cancelación, gracia y reembolso.
- Cupo primeros 100 asignado mediante transacción atómica y registro único, no por contador de JavaScript.
- Descuento de 30% durante exactamente 3 ciclos mensuales elegibles; evitar doble promoción y reintentos que dupliquen cargos.
- Pantalla de checkout muestra precio de los 3 primeros meses, precio desde el cuarto, condiciones y cancelación.
- PREMIUM no se activa hasta validar beneficios y contenidos reales.

## Privacidad y soporte
- RLS probado con usuarios de prueba (alumno A nunca ve datos del alumno B).
- Admin requiere MFA, rol confirmado en servidor y auditoría; no basta ocultar botón `/admin`.
- IA de soporte: solo documentación autorizada, sin claves en navegador; no responde con datos privados de otros alumnos; deriva casos de cobros a humano.
- Correo transaccional: confirmación, recibo, recuperación y alertas; monitorear entrega y rebotes.

## Criterios de aceptación
- 0 bloqueos de release; pruebas E2E verdes en móvil y escritorio.
- 100% de medios críticos con URL verificada, duración y licencia/origen registrados.
- Eventos Stripe duplicados no duplican cobros, cupos ni derechos.
- Usuarios sin membresía no pueden abrir contenido restringido vía URL directa.
- Una falla de despliegue puede revertirse sin pérdida de datos de estudiantes.

## Orden sugerido
Fase A: integración B57 + pruebas de regresión.
Fase B: membresías/entitlements + webhook idempotente.
Fase C: soporte/admin con RLS y MFA.
Fase D: backup, observabilidad, simulacro de rollback y aprobación de publicación.

No ejecutar SQL ni habilitar cobros desde este documento: es una especificación de implementación, no un módulo conectado.

## Ampliación aprobada: presencia social en B58B
- Redes elegidas: Instagram, Facebook, YouTube, LinkedIn, TikTok; WhatsApp Business solo si hay canal de soporte autorizado.
- Presentación elegante en el footer de la academia y CTA «Síguenos / Follow us», manteniendo azul oscuro/dorado.
- Los enlaces deben apuntar a cuentas oficiales verificadas; ocultar redes sin perfil real y no inventar direcciones.
- Usar logos oficiales siguiendo guías de marca; tamaños táctiles de 44px, etiquetas accesibles y compatibilidad ES/EN.
- Preparados `B58_BUILD/social/social-links.json`, `social-links.js`, `social-links.css` y README; falta integración al HTML definitivo, activos de marca y verificación de cuentas.

## Trabajo ejecutado el 16 de octubre (verificado)
- Consulta en vivo de Supabase: cuatro tablas RLS, cero administradores de soporte y cero Edge Functions.
- Módulo de redes reforzado en B58: perfiles deben estar marcados `verified: true`, URL HTTPS, dominio autorizado y ruta no vacía; enlaces sin validar se ocultan.
- Prueba automática `tests/social-links.test.mjs` ejecutada correctamente; comprueba bloqueo de enlaces falsos y dominios parecidos.
- No se activaron pagos, cuentas sociales, correos, despliegues ni IA. La integración al sitio principal sigue pendiente.
