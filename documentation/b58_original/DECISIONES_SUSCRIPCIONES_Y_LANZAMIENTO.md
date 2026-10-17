# PLUTÓN ACADEMIC — Decisiones de infraestructura y suscripciones
Fecha: 2026-10-16

## Decisiones acordadas
- Presupuesto objetivo operativo: USD 70–100/mes (estimación, no facturación confirmada).
- Mantener GitHub para código y versiones; Cloudflare Pages para hosting; Supabase para autenticación, datos y soporte.
- Supabase figura actualmente en plan Free; evaluar Pro (~USD 25/mes) al lanzamiento, según límites, copias de seguridad y necesidades.
- Mantener HeyGen mientras siga siendo necesario producir videos y lecciones; comprobar precio y renovación reales.
- No contratar otro hosting sin evidencia de una necesidad técnica concreta.
- No cancelar LearnWorlds ni ningún servicio de prueba hasta descargar, inventariar y verificar la integridad de todos los videos, guiones, actividades y materiales originales.
- No ejecutar cancelaciones ni compras sin autorización del titular.

## Revisión antes de renovar/cancelar
Registrar por proveedor: cuenta/organización, plan vigente, precio facturado, moneda, impuestos, fecha de renovación, método de pago, uso real, dependencias, exportación completada, decisión final.

## Prioridades técnicas B58
1. Preservar el sitio público y la rama principal hasta pruebas y aprobación.
2. Integrar código completo B57 estable antes de dar B58 por desplegable.
3. Panel administrador privado con control de roles real y MFA.
4. Soporte al estudiante enlazado con las tablas support_tickets, support_messages, support_admins ya creadas en Supabase; probar con cuentas de prueba.
5. Notificaciones e IA con credenciales solo del lado servidor, consentimiento y control de costos.
6. Migración comprobable de PA-203, ID-101, MKT-201, TEC-101 y PA-101, con pruebas visuales ES/EN y móviles.
7. Auditar costos reales de videos, email, IA, dominio, procesamiento de pagos y respaldos antes de lanzamiento.

Estado: nota de decisiones; NO constituye verificación de implementación final.

## Precios de membresía APROBADOS para B58 (2026-10-16)
- START: USD 10.49/mes durante meses 1–3; luego USD 14.99/mes.
- PLUS: USD 17.49/mes durante meses 1–3; luego USD 24.99/mes. Destacar PLUS.
- PREMIUM: USD 27.99/mes durante meses 1–3; luego USD 39.99/mes. Activación pendiente de validar beneficios exclusivos.
- Oferta limitada a los primeros 100 estudiantes elegibles; se debe explicar claramente la renovación a precio normal a partir del cuarto mes.
- Las cantidades promocionales están redondeadas a centavos (30% exacto produce fracciones de centavo).
- Implementación actual: vista previa visual bilingüe y archivo de configuración. NO se ha integrado todavía con la facturación, Stripe, B57 o la web pública. Antes de lanzar: validar elegibilidad y límite 100 en servidor, crear precios/periodos en procesador de pagos, pruebas de impuestos, recibos, cancelación y consentimiento.
