# B115 — integración preparada, sin publicar

6 de noviembre de 2026. Rama: `B115-integracion-catalogo-seguro`.
Base: main `be03017c4c71699412d4825861184f3ff66c4047`.

FAM-101, FAM-102, PSI-101 y PSI-102: cada curso tiene 15 lecciones
bilingües, 30 MP3 originales, dos portadas aprobadas y precio de pago único
$9.99 USD. Los 120 audios existentes se reutilizaron sin generación nueva.
Los paquetes incluyen cuadernos, evaluación final y proyecto originales.
El aula muestra las guías de apoyo de PSI-102 y no presenta videos inexistentes.

El catálogo principal y la página B115 incluyen las cuatro ofertas, portadas
por idioma, precios y enlaces al flujo de compra existente. Mis compras y
la aplicación móvil dirigen cada compra a su aula. El nuevo código está
limitado a B115; las doce entradas originales del catálogo se conservan.
No se añadieron los cursos al editor administrativo: su adaptación editorial
queda fuera de esta integración y requiere trabajo adicional antes de usarlos allí.

Los contenidos pagados, respuestas y MP3 NO están en este repositorio público.
`scripts/b115-integrate-audio.py` integra los originales en una carpeta privada
fuera del checkout. Cada ZIP contiene menos de 100 archivos: 81, 81, 81 y 84.
Cada paquete tiene manifiesto de importación y checksums SHA-256.

## Preparación del despliegue (NO ejecutada)

1. Obtener autorización explícita del fundador para publicar.
2. Revisar en el destino los prerrequisitos del SQL preparado y respaldar el estado.
3. Aplicar `database/b115_integration_proposal.sql`: ampliar solamente los códigos
   admitidos, registrar las cuatro compras en el ledger existente y preparar
   un bucket privado separado `b115-course-media` con acceso por compra exacta.
4. Importar el archivo PRIVADO `integration/b115-private-draft.sql` y los 120 MP3
   en las rutas de sus manifiestos. El contenido permanece como borrador.
5. Aplicar `database/b115_activate_after_approval.sql`, que exige cuatro borradores,
   15 lecciones y 30 objetos MP3 por curso; registrar únicamente esos cuatro cursos.
6. Desplegar esta rama y comprobar visualmente catálogo, banners ES/EN, aula,
   reproducción y una compra autorizada real con acceso limitado al curso comprado.

Ningún SQL se aplicó a servicios externos. No se publicó ni se fusionó main.
Stripe, claves API, fuente de checkout y webhooks permanecen sin cambios.
Los SQL son propuestas para revisión y ejecución autorizada: sus controles
rechazan discrepancias del esquema en vez de sustituirlas silenciosamente.

## Evidencia y límites

12 pruebas locales, cero fallos. DOM ejecutable: catálogo ES/EN, ocho portadas,
precios, 120 rutas de audio, navegación, liberación del audio anterior, aula real,
exámenes y filtro de cursos comprados en móvil. PostgreSQL local (PGlite):
cuatro compras separadas conceden únicamente su curso y sus 30 audios;
se rechazan visitantes, compras revocadas y reutilización de sesión para otro curso.
Se preservan filas de los cursos anteriores. Checkout, webhook y app.js se
comparan byte a byte con main. Estas pruebas NO prueban una compra en Stripe
ni un despliegue real; esa verificación sigue pendiente de autorización.

Los MP3 habían pasado integridad; los paquetes conservan los originales.
Videos siguen sin generar, como en el material original. Se mantienen borrador
sujeto a revisión profesional y constancia manual; no se declara aprobación clínica
ni automatización de certificados.

Para reproducir las pruebas: instalar jsdom 26.1.0 y @electric-sql/pglite 0.3.14,
definir B115_ROOT con la carpeta privada integrada y NODE_PATH si procede, y ejecutar:

```
node --test tests/b115-catalog-access.test.cjs tests/b115-purchase-isolation.test.cjs tests/b115-audio-integration.test.cjs tests/b114-static-integrity.test.cjs
```
