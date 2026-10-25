# B108 — Urgente y alta prioridad

Base: main 5aebbabc2f339dbacf818500cc1860d4b8456e99. Rama B108-urgente-alta creada y verificada remotamente sobre esa base. Fuente: inventario final 20261025 F01–F14.

Autorización: priorizar y empezar correcciones. Stripe ya configurado por el fundador: conservar claves, precios y configuración. No publicar ni fusionar esta rama sin autorización aplicable. No regenerar medios aprobados, borrar originales ni reescribir el historial.

## Orden y criterios

1. F01/F02: cerrar lectura por compra en DB, RPC, aula y publicación estática. Preparar cambios coordinados; no privatizar buckets antes de que el reproductor autorizado funcione. Conservar muestras aprobadas y originales privados. Probar sin sesión, sin compra, dueño, otra cuenta, revocado y administrador. Las copias históricas de Git requieren tratamiento aparte; no prometer su retirada con un bloqueo de Cloudflare.
2. F05: extender el registro idempotente de sesiones a los diez códigos; una sesión repetida no reactiva acceso revocado. Mantener firma y verificación directa del pago, importe 999 USD centavos y curso correcto. No cambiar Stripe.
3. F10/F11: corregir traducción destructiva y completar listado/respuestas/estados de soporte con permisos por alumno y administrador, valores retenidos y cambios de cuenta seguros.
4. F06/F07/F08: separar lectura de aprobación manual, incorporar evaluación humana y consulta de documentos, respetando bloqueo clínico NA-101. No inventar aprobación profesional ni acreditación.
5. F09: recuperar y cotejar cuatro audios faltantes sin regenerarlos.
6. F04/F13: preparar procedimiento comercial coherente y políticas revisables sin inventar identidad fiscal, plazos o aprobación jurídica.
7. F12: mantener revisión profesional pendiente; preparar lista de revisión para revisor cualificado. Solo un profesional puede cerrar ese punto.
8. F14: inventario de respaldos privados y ensayo aislado; nunca publicar datos personales ni contenidos de pago en GitHub.

## Ejecución y pruebas

Pruebas de regresión antes de cada corrección; implementación mínima y repetición. Primer paquete: permisos DB preparados, protección de replay y traducción soporte. Cada avance se guarda por commit remoto y se verifica por árbol o ascendencia.

Archivos iniciales: database/b108_purchase_read.sql, database/b108_purchase_sessions.sql, supabase/functions/b101-stripe-webhook/index.ts, support/index.html, tests/b108-*.test.cjs. Nuevas pruebas con datos sintéticos, nunca respuestas académicas privadas.

## Estado

- [x] Base estable recuperada y rama remota verificada.
- [x] Dependencias instaladas con npm ci --ignore-scripts.
- [x] Primer paquete implementado y probado en rama.
- [ ] Restricción estática y multimedia coordinadas.
- [ ] Soporte completo.
- [ ] Evaluación y certificados.
- [ ] Audios recuperados.
- [ ] Políticas y operación.
- [ ] Restauración aislada.
- [ ] Publicación autorizada y comprobada.

Decisión: ejecutar directamente sin preguntas rutinarias, según orden del fundador. Los fallos de regresión ya inventariados se registrarán por separado y no se presentarán como nuevos.

### Avance 1 — F10
Reproducido con jsdom: alternar EN destruía select/input/textarea. Corrección mínima: textos traducibles en spans dentro de etiquetas; controles y valores conservados. Prueba nueva falla antes y pasa después. Suite dirigida: 6/6. npm test basal falla ENOENT por ruta padre del catálogo (F23 ya inventariado), sin cambios de este paquete. No publicado.

### Avance 2 — F01/F05, preparado sin aplicar en producción
- Restricción SELECT por compra activa en ambas tablas heredadas. Se usa política restrictiva para que una política permisiva antigua no abra acceso. Anónimo denegado por política separada sin consultar compras; dueño, otra cuenta, revocado y admin probados en PostgreSQL local.
- Extensión del registro atómico B107 a los diez códigos y uso uniforme por webhook. Firma, consulta de Stripe, importe, moneda y códigos se conservan. Repetir sesión registrada no reactiva acceso revocado; sesión vinculada a otra identidad falla; nueva sesión legítima funciona.
- Orden obligatorio: SQL de sesiones antes del webhook. Conciliar pagos heredados previos al registro antes del cambio. El registro no inventa historial de Stripe ni reconstruye transacciones antiguas.
- SQL de lectura no se aplica aisladamente: F01/F02 siguen abiertos hasta coordinar rutas estáticas, multimedia privada y reproductores. No se borraron/copiaron payloads ni medios a GitHub; originales sin cambios.
- Pruebas dirigidas: 8/8 aprobadas (incluyen 10 códigos dentro de los casos). RED observado para traducción, lectura de otro alumno y upsert heredado antes de correcciones.
- Suite cjs: 129 casos, 124 aprobados, 4 fallos, 1 omitido. Tres fallos históricos: b87-publication (navegación), b91-publication (membresía antigua), b91-publication (muestra ID-001). Cuarto: b107-classroom no arranca porque depende de fixtures privados en ruta absoluta ausente en esta nueva sesión; no es evidencia de regresión del aula. No se publican fixtures privados para resolverlo.
- npm test: sigue fallo basal ENOENT de ruta padre. No se declara suite general verde.
- F10 listo para revisión en rama. F01/F05 componentes probados, aún sin despliegue; los demás P0/P1 pendientes. Stripe configurado por el fundador; no se cambiaron claves, precios ni modo.

### Avance 3 — Reproductor privado compartido
Implementado b108/media.js y seis pruebas conductuales RED→GREEN: firma de 300 segundos, bloqueo sin cuenta/permiso, coincidencia curso/depósito/ruta, rechazo de dominios ajenos, cambio de cuenta durante firma y retirada del medio al cerrar sesión. Se conservan las catorce grabaciones de las seis muestras aprobadas de ID-001. El resto requiere bucket privado. El usuario carga o renueva el recurso explícitamente. Todavía falta conectar las aulas y preparar la publicación filtrada; no desplegado.

### Avance 4 — Integración F01/F02 preparada y verificada
- Aulas heredadas y audio activo ID-001 conectados a firma privada; Aula Digital anterior deja de descargar textos completos. Cargador exige cuenta, descarta lectura cruzada y limpia al cambiar de usuario.
- Build filtrado reproducible: 304 archivos públicos, catálogo de nueve registros/118 títulos más ID-001 separado (10 cursos, 148 lecciones en total). Cero dependencias locales HTML faltantes. Sin payloads, manuales completos, respuestas de curso, SQL, ZIP ni audios premium en la salida. Se conserva el banco de 38 preguntas del Reto gratuito y las seis muestras con 14 audios.
- Inventario exacto: 48 videos existentes +45 audios premium existentes. PREPARE no cambia visibilidad antigua; FINALIZE exige todos los objetos y 45 recibos de hash. Importador no sobrescribe y verifica descarga antes del recibo. No se generaron ni reemplazaron medios.
- Pruebas dirigidas: 36/36 Node y 2/2 Python aprobadas. Suite general: 147 casos, 142 aprobados, cuatro fallos y uno omitido; los mismos tres contratos históricos b87/b91 y el arranque de b107-classroom por fixtures privados ausentes. npm test mantiene ENOENT basal de catálogo en carpeta padre.
- Prueba visual/reproducción nueva no ejecutada: Chromium no pudo instalarse por descarga truncada. No se presenta jsdom como prueba visual, móvil física ni playback real.
- Producción sin cambios: faltan importar/verificar remotos, validar en entorno aislado, coordinar configuración de salida Cloudflare/SQL y resolver copias completas del historial público de GitHub. F01/F02 no se declaran cerrados en producción.
- Procedimiento y límites completos: docs/B108/ACTIVACION_F01_F02.md. Estado verificable: docs/B108/VERIFICACION_ARCHIVOS.json. Los demás P1 siguen pendientes según el orden original.
