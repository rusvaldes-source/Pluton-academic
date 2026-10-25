# B108 — Activación coordinada de acceso y medios

Estado: PREPARE aplicada y 45 audios privados importados/verificados. READ, FINALIZE, webhook y publicación filtrada siguen sin activar. Stripe conserva su configuración y precio. No borra originales ni reescribe historial.

## Componentes

- `database/b108_purchase_read.sql`: lectura completa de seis cursos solo con compra activa o administrador. El RPC existente sigue siendo invocador y hereda RLS.
- `b95/course-loader.js`: no carga sin cuenta, descarta respuestas tras cambio de cuenta y limpia el aula al salir/cambiar de usuario.
- `b108/media.js`: enlaces firmados de 300 segundos, sin caché propia de enlaces ni fallback público; renovación explícita; limpia medios al salir. Conserva los 14 audios de las seis muestras aprobadas.
- Las seis aulas heredadas y el reproductor activo ID-001 usan el mismo control privado. El Aula Digital anterior dirige al aula autorizada y deja de descargar `b64/materiales.json`.
- `scripts/build-b108-public.py`: exporta rutas de interfaz y recursos públicos permitidos; catálogo solo con títulos/identificadores. Excluye JSON de cursos, manuales completos, evaluaciones privadas, SQL, ZIP, MP3 premium y copias de videos de lecciones.
- El Reto del día mantiene su banco gratuito existente, separado de los cuerpos completos y cuestionarios de cinco preguntas. Ese banco ya era público; no se extraen preguntas de payloads privados. Presentaciones, clips y muestras ID-001 permanecen abiertos.
- `database/b108_media_prepare.sql`: inventario protegido de 48 videos existentes y 45 grabaciones existentes, con hashes esperados de las grabaciones. No cambia la visibilidad de los cuatro depósitos antiguos.
- `scripts/prepare-b108-media.py`: reúne los 45 originales de audio y manifiesto fuera del repositorio público, sin regenerarlos.
- `scripts/import-b108-audio.py`: modo predeterminado valida localmente; con `--apply`, sube solo objetos faltantes sin upsert, descarga lo guardado y coteja hash/tamaño antes de registrar la comprobación. Un objeto diferente jamás se sobrescribe.
- `database/b108_media_finalize.sql`: exige los 93 objetos y 45 comprobantes de hash antes de volver privados los depósitos antiguos. Mantiene B107 privado y sus políticas.

## Orden de activación, después de revisar y autorizar el paquete

1. Respaldar DB, objetos y configuración; conservar el código remoto de partida. Obtener el paquete privado de audios con `python3 scripts/prepare-b108-media.py --output /RUTA_PRIVADA/B108_AUDIO`. No subirlo a GitHub ni Pages.
2. Aplicar PREPARE. Validar el paquete sin red: `python3 scripts/import-b108-audio.py --package /RUTA_PRIVADA/B108_AUDIO`.
3. Importar y comprobar remotos con `--apply`, reutilizando las credenciales existentes del entorno servidor `PLUTON_SUPABASE_URL` y `PLUTON_SERVICE_ROLE_KEY`. No escribirlas en archivos públicos, historial de comandos ni informes. Confirmar 45 verificaciones remotas y cero reemplazos.
4. Construir salida NUEVA: `python3 scripts/build-b108-public.py --output dist/B108-public`. No sobrescribe una salida anterior. En Cloudflare, usar ese comando de build y **dist/B108-public** como directorio de salida; las Pages Functions existentes siguen en `functions/` del proyecto. No publicar la raíz completa del repositorio.
5. Probar comprador, cuenta sin compra, otra cuenta, revocado y administrador contra una copia aislada. Probar reproducción real, renovación, seis muestras, Reto ES/EN, compras y panel a 390/1440 px. Los tests locales con SDK simulado no sustituyen estas pruebas remotas.
6. Coordinar publicación filtrada, permisos de lectura y FINALIZE. No ejecutar FINALIZE antes de tener jugadores compatibles y grabaciones comprobadas. Verificar que URLs públicas antiguas y rutas completas devuelven denegación/no contenido premium, y que el comprador conserva la reproducción.
7. Aplicar `b108_purchase_sessions.sql` antes de actualizar el webhook; conciliar previamente las compras heredadas anteriores al registro. No requiere cambiar Stripe. Reenvío de una sesión ya registrada no reactiva acceso revocado.
8. Repetir pruebas finales; registrar commit, configuración de build, inventario privado y resultado. Solo entonces marcar F01/F02/F05 cerrados en producción.

## Límites que impiden declarar cierre total ahora

- Importación completada: 45 objetos y 45 recibos SHA-256; PREPARE aplicada. READ/FINALIZE siguen pendientes para coordinar con Cloudflare.
- Aún no se configuró ni publicó la salida filtrada en Cloudflare.
- La disponibilidad de copias completas en el **historial público de GitHub** no se corrige con RLS ni con el build. Se necesita conservar ese historial en un destino privado y decidir el tratamiento del repositorio público, comprobando antes la integración con Cloudflare. No se borró historia ni se cambió visibilidad sin revisión.
- La instalación de Chromium local falló por descarga truncada. En esta etapa hay pruebas DOM/PostgreSQL y validación de archivos, pero no se declara una nueva prueba visual o reproducción real de este paquete.
- Una URL firmada ya emitida puede durar hasta 300 segundos tras revocación. La página limpia el reproductor al cambiar de cuenta; no se promete revocación instantánea de un enlace ya emitido.
- La revisión profesional clínica, las políticas comerciales, soporte completo, certificados y restauración del sistema siguen en el plan P1; este avance no los da por cerrados.
