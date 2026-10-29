# Customer Service Implementation Plan
> Agentic workers: execute inline with superpowers:executing-plans.
Goal: Activar asistencia bilingüe segura usando el crédito existente.
Architecture: Centro de ayuda existente → función autenticada → reserva SQL atómica → Responses; casos sensibles al formulario humano.
Tech Stack: JS, Deno, Postgres, Node tests, PGlite/JSDOM.
Spec: docs/superpowers/specs/2026-10-29-customer-service-design.md
## Global constraints
No Stripe, cursos, portada, compra de créditos ni recarga automática. Secretos solo servidor. Respaldo remoto previo obligatorio.
## Review focus
Autenticación falsificada; consumo concurrente; secretos en salida; campos conservados al traducir; tickets huérfanos.
## Task 1: Backend y límites
Files: supabase/functions/pluton-support-ai/index.ts; database/b115_support_ai.sql; tests/b115-support-ai.test.cjs; tests/b115-support-db.test.cjs.
- [ ] Escribir pruebas de autenticación, límites, privacidad, error de proveedor y SQL atómico.
- [ ] Ejecutar pruebas y confirmar fallo por funcionalidad ausente.
- [ ] Implementar handler sin privilegios y RPC con auth.uid, contador privado y ticket atómico.
- [ ] Ejecutar pruebas; guardar commit y rama remota.
## Task 2: Interfaz y activación
Files: support/index.html; support/support.js; support/support.css; tests/b115-support-ui.test.cjs.
- [ ] Pruebas de envío ES/EN, autenticación, doble envío, XSS, creación de ticket.
- [ ] Implementar en sección existente; conservar recuperación y campos.
- [ ] Pruebas, revisión independiente, migración aditiva y despliegue función; verificar sin revelar claves.
- [ ] Publicar solo archivos revisados; comprobar remoto y ejecutar verificar-respaldo.py --all.
