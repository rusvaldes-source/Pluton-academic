# B96 constancias Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Emisión manual de constancias de participación con evidencia revisada, registro inmutable, revocación y verificación pública mínima.

**Architecture:** Módulo independiente montado en el panel autorizado existente. RPC transaccional con comprobación de is_pluton_admin; RLS y privilegios restringen acceso directo. El panel invalida todo estado privado al cambiar identidad.

**Tech Stack:** JavaScript DOM, PostgreSQL/Supabase, node:test y jsdom.

**Spec:** docs/superpowers/specs/2026-10-20-admin-b95-b96-design.md

## Global Constraints

- Conservar precios START 10.49, PLUS 17.49, PREMIUM 27.99.
- No activar pagos ni generar los 49 audios pendientes.
- No guardar contenido premium ID001 en repositorio público.
- No emitir documentos reales durante pruebas.
- NA101 conserva bloqueo de certificación clínica.

## Review Focus

- Cambio de cuenta durante solicitud: descartar respuestas y limpiar datos.
- Usuario sin autorización: toda escritura rechazada en servidor.
- Edición concurrente: mostrar conflicto y conservar borrador.
- Error de red: mensaje visible sin éxito falso.
- Contenido ingresado: representar texto sin ejecución HTML.

### Task 1: Backend y permisos

**Files:** admin/certificates.js; database/b96_certificates.sql; certificados/verificar/; tests/b96*.cjs

- [x] Escribir pruebas de acceso administrador, denegación estudiante/anónimo, conflictos y rollback.
- [x] Ejecutarlas antes de implementar y confirmar fallos esperados.
- [x] Implementar migración aditiva con permisos mínimos y validación servidor.
- [x] Revisar SQL y aplicar mediante migración; probar operaciones en transacción revertida.

### Task 2: Módulo y consumidores

**Interfaces:** window.PlutonCertificates.mount({client,container,isCurrent,language}) devuelve {clear,unmount}.

- [x] Probar montaje, errores, limpieza de identidad y entradas no confiables.
- [x] Implementar módulo bilingüe azul/dorado y consumidores correspondientes.
- [x] Ejecutar node --test tests/b96*.cjs; todos deben pasar.

### Task 3: Integración y entrega

- [x] Integrar contenedores y ciclo de identidad en admin/admin.js e index.html.
- [x] Ejecutar regresiones B94/B93 y revisión independiente del conjunto.
- [ ] Publicar rama propia y main usando expected_sha; comprobar despliegue Cloudflare.
- [ ] Entregar ZIP versionado con resultados y límites de revisión visual autenticada.
