# PLUTÓN ACADEMIC — B114 — Entrega de revisión

26 de octubre de 2026. Rama única `B114-Tres-Cursos-20261026`, continuada desde el commit indicado por el fundador `9c08b44fb3f0aabd14a4d9ac8b912cf4e9bea0a1`. Base pública preservada: MAIN `510fe3fa3ce9e00528f0200a8c6418ce35e17bb2`.

**Estado: preparación avanzada y respaldada; no aprobada para venta ni publicada.** El contenido y los medios pagados se entregan en un paquete privado, fuera del repositorio público.

| Curso | Lecciones ES/EN | Preguntas bilingües | Foto |
|---|---:|---:|---|
| FA-101 | 10 | 50 | Propia |
| DRV-101 | 12 | 60 | Propia |
| MED-201 | 12 | 60 | Propia |
| Total | 34 | 170 | 3 |

Cada lección tiene título, resumen, explicación, caso ficticio, ejercicio interactivo, cinco preguntas con respuesta y explicación, cuaderno y registro de finalización. Sigue el temario del último commit; no se han reutilizado ciegamente los números de lección anteriores. Se conserva el sistema existente de prácticas por dispositivo y progreso por cuenta. Las constancias son de participación, revisadas por administración; no acreditan RCP, CDL, ELDT ni certificación profesional de codificación.

## Multimedia y alcance real

Se recuperaron y conservaron 68 MP3 de ElevenLabs y 68 MP4: resúmenes narrados de 7.3–20.9 segundos, con fotografía y texto educativo, no clases completas ni demostraciones prácticas. Se verificaron formatos, duración, pistas y hashes. El inventario privado identifica procedencia, voz, idioma y relación con cada lección.

Tras conciliar el nuevo temario, las aulas usan 58 pares localizados distintos; todos los 68 pares originales siguen disponibles. Los clips reutilizados llevan una nota visible sobre su tema original. **Siete temas requieren narración y video específicos**: FA-101 L09; DRV-101 L03, L06, L09; MED-201 L04, L07, L11. La cola privada contiene 14 guiones ES/EN, 2,243 caracteres. No se generaron porque la sesión actual de ElevenLabs muestra inicio de sesión. No se compraron créditos ni se regeneraron archivos existentes.

La última lectura autenticada anterior registró 2,543 créditos disponibles. No equivale a una lectura actual de saldo; la nueva cola cabe en ese saldo al coste observado, sujeto a confirmación al recuperar el acceso.

## Pruebas realizadas

| Prueba | Resultado | Entorno y límite |
|---|---|---|
| Estructura y coincidencia del temario | 2/2 | Payloads privados reales; 34 lecciones, 170 preguntas |
| Acceso, render, progreso, medios, SQL e integridad | 18/18 | JSDOM y Postgres local PGlite; usuarios sintéticos |
| Navegador de escritorio y móvil | Aprobado | Chromium real local: 1440×1000 y 390×844 |
| Reproducción | 272 comprobaciones aprobadas | 34 lecciones × 2 idiomas × audio/video × 2 tamaños, con los clips actualmente enlazados |
| Parche de integración | 1/1 | Aplicado en directorio desechable; conserva exactamente los 10 cursos anteriores |
| Regresiones dirigidas existentes | 11/11 | Acceso B108, loader, políticas de medios, rutas B109 y enfermería B110 |
| SEO B111 | 4/4 | Pruebas existentes, sin modificar portada |
| npm test general anterior | Falló | Exige 26 cursos y agota espera; catálogo base real contiene 10. También requirió raíz explícita y SDK fijado como fixture del harness |

Las pruebas de navegador recorren las 34 lecciones por tamaño, los dos idiomas, las cinco preguntas, el ejercicio, progreso tras recarga y reproducción. Las fotos se revisaron visualmente y no tienen desbordamiento horizontal. Se comprobó en SQL local: invitado bloqueado, compra A aislada de B/C, compra antigua sin acceso a B114, progreso de otro usuario rechazado, compra revocada sin contenido ni medios y emisión administrativa de participación con revisión e idempotencia. El servidor de revisión rechaza Host/Origin ajenos y rutas no permitidas.

**No se ha probado en vivo** una compra B114, webhook, Auth, progreso real, Storage firmado real ni certificado real. No se ejecutó ninguna operación de Stripe. Las comprobaciones locales no sustituyen esos ensayos.

## Integración preparada

`database/b114_integration_proposal.sql` amplía únicamente listas de códigos necesarias, conserva controles administrativos y de participación, añade un bucket privado con acceso por compra exacta y enruta B95 hacia la tabla protegida existente. Está contrastada con definiciones desplegadas consultadas en lectura. No aplicada.

La semilla privada inserta las tres estructuras en las tablas existentes con `published=false`, inicia historial y rechaza sobrescritura de registros anteriores. Ejecutada solo en Postgres local de prueba.

`b114/public-integration.patch` prepara fotos y rutas del catálogo general, cursos, panel del alumno, listas administrativas y compilación pública. **No aplicado a los archivos actuales.** Bloquea compras de los tres códigos nuevos mientras no haya precios aprobados. No cambia Checkout, productos, precios ni compras existentes. El manifiesto registra hashes antes y después de los siete archivos propuestos.

La compilación propuesta incluye solo HTML, código y metadatos públicos B114; excluye respuestas, payloads privados, audios/videos pagados, semilla, SQL, ZIP y servidor local. El acceso productivo usa la tabla y las políticas de compra existentes, nunca una marca de pago en localStorage. Los medios privados usan enlaces firmados de 300 segundos; las fuentes se retiran del aula al cambiar cuenta o cerrar sesión. Un enlace firmado emitido previamente puede seguir vigente hasta su vencimiento.

## Revisión y observación existente

La revisión independiente detectó tres ajustes materiales y quedaron cubiertos por pruebas: respuestas/cuaderno aislados por revisión, enrutamiento B95 de los códigos nuevos y pruebas estáticas compatibles con la implementación conciliada. No informó menores diferidos. La conciliación pedagógica posterior y el parche adicional se validaron localmente; no cuentan como revisión profesional independiente.

Se observaron permisos existentes amplios, incluido `TRUNCATE`, para `anon` y `authenticated` sobre `course_lesson_progress`. Se informa para una revisión separada; no se ejecutó TRUNCATE, no se ensayó explotación y no se modificaron permisos ni políticas existentes.

## Pendientes reales para cerrar B114

1. Recuperar acceso autorizado a ElevenLabs y completar los 14 audios específicos preparados y sus 14 videos; conservar los originales.
2. Revisión profesional de primeros auxilios, CDL y facturación/codificación, incluida suficiencia pedagógica y vigencia normativa. Los materiales son introductorios y no credenciales oficiales.
3. Aprobar los precios nuevos. Continúan nulos; los precios antiguos permanecen iguales.
4. Aplicar la integración únicamente en un entorno autorizado, cargar medios privados y verificar sesión, permisos, progreso, certificados y aislamiento real por compra. La activación de ventas requiere configuración separada y autorizada de los productos nuevos; no se ha modificado Stripe.
5. Autorizar publicación solo después de esas verificaciones. No se solicita autorización para publicar una versión con esos pendientes.

## Decisiones registradas

Se reutilizó el formato B70 y las tablas existentes. Se mantuvo revisión local separada de producción, con el coste de posponer la validación real. Se usaron videos de resumen narrado, cuyo alcance no sustituye demostraciones. Se mantuvieron prácticas por dispositivo y constancias revisadas, que no son notas ni títulos oficiales. Se propuso un bucket privado separado, pendiente de aplicación y prueba real. Se conservaron clips de apoyo identificados al cambiar el temario; aún faltan los específicos indicados. Se preparó un parche sin aplicarlo y se bloquearon ventas nuevas hasta aprobación de precios. No hay menores diferidos declarados por el revisor.

El inventario de archivos y sus SHA-256, evidencias completas, fuentes oficiales, guiones pendientes e instrucciones de revisión se incluyen en el ZIP privado. No se ha modificado ningún archivo preexistente de la base publicada; los cambios actuales son adiciones dedicadas a B114.
