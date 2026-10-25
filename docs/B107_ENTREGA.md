# B107 — Tres cursos profesionales

Base estable: `110e4aab0179254526f1f41d384052b5af11e950`. Respaldo: `backup/pre-B107-20261025`. Integración: `B107-final-integracion`. Publicación autorizada por el fundador.

ELEC-101, HVAC-101 y BEAUTY-101 conservan sus códigos y precio individual de 9.99 USD, pago único. Cada curso reutiliza 20 lecciones bilingües, 10 módulos, 100 preguntas de lección, 50 de módulo y 25 finales, documentos, actividades, proyecto y rúbricas. El certificado de formación no es licencia ni acreditación oficial; los proyectos requieren revisión humana.

Tres portadas con profesionales aprobadas por el fundador, con originales PNG y copias WebP sin recorte. Siete fotografías documentales con atribuciones. Bienvenidas ES/EN: seis videos y seis audios. Sesenta audios de repaso breve, no narraciones completas de lecciones, con transcripción y volumen normalizado.

Los cuerpos, respuestas y 79 objetos multimedia están en Supabase privado, fuera del repositorio público. RLS exige compra activa para contenido, progreso y medios. URLs firmadas de 300 segundos. Webhook verifica sesión directamente en Stripe y usa registro transaccional de sesión para los nuevos cursos. Una redirección no concede acceso.

## Verificación

- 18 pruebas conductuales B107 aprobadas, incluyendo PostgreSQL RLS y contratos de checkout/webhook.
- Navegador Chromium real: 33/33 verificaciones. Los tres cursos ES/EN muestran todo el contenido; 390/1440 px sin desbordamiento ni errores JavaScript. Reproducción real de seis videos y 66 audios; fotografías, atribuciones, progreso, panel y bloqueo de otra cuenta comprobados contra Supabase desplegado.
- Catálogo: diez tarjetas (siete anteriores y tres nuevas), portadas completas, diálogos de compra con el código correcto y 9.99 USD, Reto del día sin registro.
- Suite general: 131 pruebas; 127 aprobadas, tres fallos heredados y una omitida por requerir fixtures privados B70. Los fallos heredados corresponden a navegación de recursos, precio histórico de membresía y alcance antiguo ID-001.
- Los seis objetos originales de catalog.json y los archivos de cursos anteriores, administración, idioma, redes y reto permanecen iguales a la base. Solo se adapta el test PA-101 para seguir comprobando sus seis registros originales al añadir tres cursos.

## Alcance de pagos y entrega privada

La configuración existente de Stripe continúa en modo de prueba. Se crearon tres sesiones sandbox reales mediante la función desplegada y se comprobaron directamente en Stripe: 999 centavos USD, curso y retorno correctos. No se completó un pago ni se efectuó un cobro real; los accesos de verificación fueron fixtures temporales de QA. Esto no equivale a activar cobros comerciales. No se cambiaron claves ni modos de pago.

Paquetes privados por curso: JSON íntegro, fuentes y guiones recuperados, medios y SHA-256. No subir los paquetes privados a GitHub ni Pages. Los originales de audio se conservan en el paquete previo. No se generaron nuevos medios de pago.

La prueba móvil fue emulada, no en dispositivos físicos. La escucha humana completa y la revisión docente siguen siendo actividades humanas.
