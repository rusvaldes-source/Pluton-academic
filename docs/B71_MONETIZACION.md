# PLUTÓN ACADEMIC — Preparación de monetización

Versión B71 · Revisión: 18 de octubre de 2026, Nueva York / 19 de octubre UTC.

**Resultado:** propuesta e infraestructura aisladas en una rama de prueba. No se activaron anuncios, campañas, pagos, cuentas comerciales ni servicios de pago. La producción conserva la versión de cursos B70.

## 1. Oportunidades y prioridad

Priorizar servicios digitales y recursos propios antes de depender de publicidad: un sitio con poca audiencia puede obtener ingresos publicitarios bajos. Primero validar demanda y capacidad de entrega; después experimentar con afiliados pertinentes y, finalmente, publicidad en páginas editoriales públicas.

| Vía | Encaje | Condición antes de vender o activar |
|---|---|---|
| Currículums y cartas | Entrega concreta para estudiantes y profesionales | Alcance, precio aprobado, privacidad, revisiones y cancelaciones |
| Plantillas propias | Documentos reutilizables para pequeños negocios | Derechos propios, formatos, licencia y soporte |
| Acompañamiento digital | Aplicación práctica de computación y herramientas | Agenda, límite de tareas, política de acceso y personal disponible |
| Afiliados | Herramientas opcionales y bibliografía pertinente | Acuerdo aprobado, enlace verificado y divulgación cercana |
| AdSense | Páginas públicas originales con audiencia | Revisión de Google, privacidad, consentimiento aplicable e inventario autorizado |

No se verificaron estadísticas de audiencia, país de visitantes, solicitudes comerciales ni ingresos. Las cifras posteriores son ejercicios de planificación, no pronósticos.

## 2. Auditoría de la estructura actual

El sitio tiene portada, catálogo, noticias, recursos, registro, membresías, panel y aulas. `news.js` y `sites-worker.js` ya implementan una sección de titulares externos; no se duplican ni se modifican. Antes de reutilizar ese feed comercialmente debe confirmarse la autorización de cada fuente: la existencia de un RSS no concede por sí sola derechos generales de republicación, imágenes o artículos.

El pie de portada contiene marca, fundador, redes y administración. No se encontraron archivos públicos dedicados de privacidad, cookies, términos o divulgación publicitaria ni enlaces a ellos en ese pie. La existencia de seis cursos no sustituye contenido editorial público original para una revisión publicitaria. Los cursos con registro deben seguir protegidos; no abrirlos a un rastreador ni a anuncios para conseguir aprobación.

**Ubicaciones propuestas:** un bloque adaptable entre dos secciones públicas, después de contenido útil; un bloque lateral junto a servicios en computadora, convertido en bloque inferior en móvil. Máximo dos en el piloto, sin ventanas emergentes, pantalla completa, reproducción automática ni posiciones pegadas a botones. Se mantiene espacio para reducir saltos visuales. Las etiquetas son Publicidad / Advertisements; las herramientas recomendadas constituyen una sección distinta.

**Exclusiones:** `courses`, `dashboard`, `aula`, `b64`, `b66`, `b67`, `b68`, `b70`, administración, registro, autenticación y pagos. Ningún identificador de estudiante se utiliza para publicidad. B71 añade archivos, no modifica esos lectores ni el sistema de cuentas.

## 3. Requisitos antes de solicitar AdSense

Google pide contenido propio de calidad, cumplimiento de sus políticas, control del sitio y titular adulto. La revisión no está garantizada. La página oficial citada no establece un mínimo universal de visitas; no debe inventarse uno. [G1]

| Requisito | Estado comprobado / acción pendiente |
|---|---|
| Control técnico del dominio y HTML | Despliegue GitHub/Cloudflare funcionando; el propietario debe verificar la cuenta que usaría |
| Titular, país y situación comercial | No verificados; confirmar elegibilidad, identidad y documentación aplicable |
| Contenido público original y navegación | Estructura disponible; crear una línea editorial con revisión humana y derechos claros |
| Privacidad y proveedores publicitarios | Faltan páginas públicas verificadas; hay cuatro borradores B71, todavía no políticas definitivas |
| Consentimiento | Elegir/configurar solución aplicable a audiencia y modalidad; el panel de prueba no es una CMP certificada |
| Etiquetas y colocación | Dos espacios separados y adaptables preparados; sin código de anuncios |
| Cuenta, sitio aprobado e identificador | No solicitados ni activados |
| ads.txt | No se publica un identificador ficticio; preparar el registro auténtico cuando exista y corresponda |
| Seguridad y calidad | Mantener CSP y controles por ruta; comprobar rendimiento, enlaces, accesibilidad y tráfico inválido |

Google exige información de privacidad sobre sus proveedores, cookies y opciones publicitarias. Para anuncios personalizados dirigidos al EEE, Reino Unido y Suiza requiere una CMP certificada integrada con TCF. Eso no convierte cualquier banner propio en una solución certificada, ni equivale a una revisión legal completa. Otras modalidades y regiones requieren evaluación específica. [G2–G3]

No se deben incentivar clics para apoyar la academia ni hacer pasar anuncios por descargas, navegación o material obligatorio. [G4]

Objetivo editorial interno sugerido: 12 artículos útiles y originales revisados, con autoría, fecha y fuentes. Es una meta de trabajo, **no un requisito numérico ni una garantía de Google**.

## 4. Proveedores y condiciones de integración

| Contenido / proveedor | Uso propuesto | Condiciones y estado |
|---|---|---|
| Noticias: fuentes oficiales y medios autorizados | Resúmenes originales con enlace a la fuente | En el piloto solo lectura original y enlaces. No copiar artículos, fotos ni activar sindicación sin derechos |
| BLS | Empleo y precios | Conservar período, metodología, revisiones y fuente. API pública documentada; revisar límites y términos antes de conectar [D1] |
| BCE / ECB | Tipos de cambio de referencia | Publicación en días laborables, normalmente alrededor de 16:00 CET. Base EUR y fecha explícitas; no es una tasa para ejecutar transacciones [D2] |
| BCE: derechos | Reutilización futura de datos | Reproducción fiel con atribución; señalar transformaciones y que el original es gratuito si se vende integrado. Enlaces comerciales en ventana completa, no dentro de marcos [D3] |
| FRED | Enlace a indicadores; futura API seleccionada | API requiere clave; las restricciones de series de terceros subsisten. Revisar cada serie y los avisos requeridos. No se creó una cuenta [D4] |
| LBMA | Enlace a publicaciones de oro y metales | No se presupone permiso de redistribución de cotizaciones. Confirmar licencia concreta antes de copiar datos [D5] |
| TradingView widgets | Alternativa futura para mercados | Usar el widget oficial y conservar atribución; confirmar símbolo, cobertura, retraso y términos. No raspar datos ni activar el widget en este piloto [D6] |
| Coursera / Impact | Afiliación educativa opcional | Programa oficial mediante Impact; requiere solicitud y condiciones aplicables a compras elegibles. No usar su comisión máxima como ingreso esperado [A1] |
| Amazon Associates | Bibliografía y accesorios pertinentes | Revisar acuerdo regional, compras elegibles, identificación y divulgación exigidas. Sin solicitud ni enlaces especiales creados [A2] |
| LibreOffice, Canva, CISA | Directorio inicial de herramientas | Enlaces ordinarios a proveedores; sin afiliación activada. No afirmar que Canva es totalmente gratuito ni que existe un acuerdo comercial |

La divulgación de una relación remunerada debe acompañar la recomendación de forma visible y comprensible; el aviso del pie no basta. Se prepara además `rel="sponsored nofollow noopener noreferrer"` para los enlaces de afiliados. La clasificación de enlaces no sustituye la divulgación al lector. [A3]

No se solicitaron API keys, cuentas comerciales ni contratos. El prototipo no descarga cotizaciones ni titulares, por lo que no hay datos ficticios presentados como actuales.

## 5. Arquitectura técnica propuesta

**Ahora:** `b71/public/` sirve una vista bilingüe estática con tres lecturas originales, tres fuentes de mercados, tres herramientas, tres propuestas de servicios y dos contenedores publicitarios. Los borradores legales viven en `b71/legal/`. Configuración de monetización y afiliados desactivada. No hay cargador de anuncios ni widget externo incluido.

**Fase futura de datos:** una ruta de Cloudflare dedicada, por ejemplo `/api/public-data`, con proveedores y series permitidos expresamente. Sin URL arbitraria del visitante; timeout, tamaño máximo, validación de respuesta, caché, fecha de origen y estado de dato vencido. Claves privadas en secretos del servidor. Sin acceso a tablas de estudiantes ni tokens de Auth. BCE: consulta moderada y caché acorde a su frecuencia diaria; BLS/FRED según publicación. Mostrar ausencia de datos en vez de inventar un precio.

**Fase publicitaria:** aplicación solo en rutas públicas autorizadas. Las puertas de habilitación comprueban autorización, cuenta aprobada, revisión de políticas, CMP, identificador válido y consentimiento. Aunque todas las puertas se simulen abiertas en una prueba, este paquete no incluye el adaptador que cargaría anuncios. Implementarlo requiere la autorización adicional indicada por el propietario.

**Afiliados:** lista explícita de hosts HTTPS, rechazo de credenciales en URLs y dominios parecidos, identificación junto al enlace. Los enlaces de seguimiento y sus redirecciones se revisarán cuando se reciba un acuerdo real; no se aceptan dominios desconocidos automáticamente.

**Preferencias:** demostración aislada de aceptación/rechazo y cambio posterior, guardada solo en `pluton-b71-consent-v1`. No altera sesión o datos de cursos y no activa seguimiento al aceptar. Antes del lanzamiento faltan caducidad, retirada coordinada con proveedores, CMP aplicable e inventario real de cookies/almacenamiento.

## 6. Costos y escenarios ilustrativos

**Gasto nuevo contratado en esta fase: USD 0.** El piloto usa archivos estáticos en la infraestructura existente. No se verificó el plan facturado del propietario; capacidad gratis o incluida no significa uso ilimitado. Los límites y tarifas de Cloudflare deben comprobarse antes de conectar APIs. [C1]

Reservas de planificación, no cotizaciones: implementación editorial/legal/datos 18–32 horas; a un valor supuesto de USD 20/h, USD 360–640 de trabajo. Operación editorial 4–8 h/mes a USD 15/h: USD 60–120. Reserva técnica opcional USD 0–25/mes, pendiente de elegir CMP/datos y verificar planes; ninguna compra autorizada. Revisión legal especializada y licencias de datos se cotizan aparte y pueden superar esa reserva.

Publicidad: vistas públicas mensuales / 1.000 × RPM efectivo supuesto. El RPM efectivo debe reflejar consentimiento, cobertura, bloqueadores y país; no se multiplica por el número de bloques. Afiliados: vistas públicas × tasa de clic × conversión elegible × comisión media supuesta. Devoluciones, impuestos y ajustes no están incluidos.

| Escenario hipotético mensual | Vistas | RPM supuesto | Publicidad | Afiliados* | Ingreso bruto combinado |
|---|---:|---:|---:|---:|---:|
| Inicial | 5.000 | USD 2 | USD 10 | USD 10 | USD 20 |
| Intermedio | 25.000 | USD 4 | USD 100 | USD 50 | USD 150 |
| Amplio | 100.000 | USD 6 | USD 600 | USD 200 | USD 800 |

*En los tres ejemplos: 2% hace clic, 2% de esos clics convierte y comisión media USD 5. Son supuestos escogidos para explicar la fórmula, no tasas observadas ni tarifas de un programa. Cero visitas, falta de aprobación o cero compras elegibles pueden dar USD 0. La calculadora permite cambiar estos supuestos.

### Servicios: precios de estudio, todavía no ofertas

| Servicio | Precio hipotético | Alcance por validar |
|---|---:|---|
| Currículum básico | USD 35 | Borrador editable, una revisión, sin prometer empleo |
| Currículum y carta | USD 55 | Dos documentos y una revisión; no asesoría migratoria |
| Paquete de plantillas propias | USD 12 | Tres documentos, licencia personal/comercial definida |
| Acompañamiento de 45 minutos | USD 25 | Una tarea educativa; sin pedir contraseñas ni operar pagos |

Ejemplo independiente: dos currículums a USD 35 producen USD 70 brutos. Si cada uno requiere una hora valorada en USD 15, quedan USD 40 antes de impuestos, comisiones, captación, soporte y devoluciones. No sumarlo automáticamente al escenario publicitario: depende de demanda y capacidad adicionales. Los precios no se han añadido a la plataforma ni a pagos.

## 7. Páginas legales y datos pendientes

Se prepararon cuatro borradores bilingües: privacidad, cookies/almacenamiento, términos y publicidad/afiliados. No se presentan como políticas publicadas. Faltan operador legal, país/jurisdicción, contacto real de privacidad, retención, derechos, tratamiento de menores, transferencias, contratos de encargados, condiciones de servicios y obligaciones regionales. Deben verificarse con el funcionamiento final y revisión competente. No se configura un tratamiento nuevo de datos con estos borradores.

## 8. Implementación sin interrupción

1. Mantener B71 en rama de prueba. Comparar con B70: solo archivos nuevos; sin cambios de cursos, precios, Auth, membresías o Supabase.
2. Revisar propuesta, inventario legal y audiencia. Redactar contenido original y completar la identidad/contacto del sitio.
3. Publicar primero contenido público y políticas finalizadas mediante un cambio aislado y respaldado; todavía sin proveedores comerciales.
4. Solo con autorización adicional: solicitar AdSense/afiliados, configurar CMP real, revisar licencias y condiciones de pago/impuestos. No contratar datos sin presupuesto aprobado.
5. Prueba limitada: un proveedor y un espacio; validar consentimiento, rechazo, retirada, rendimiento y exclusiones. Añadir un segundo espacio solo si aporta valor sin perjudicar lectura.
6. Revisar ingresos netos y calidad tras 30 días de actividad real. Medir solo información pública agregada; no exportar datos de estudiantes. Desactivar el módulo o revertir el commit si aparece una regresión.

## Fuentes oficiales revisadas

- [G1 — Elegibilidad AdSense](https://support.google.com/adsense/answer/9724?hl=en)
- [G2 — Contenido requerido de privacidad](https://support.google.com/adsense/answer/1348695?hl=en)
- [G3 — CMP certificada y regiones](https://support.google.com/adsense/answer/13554116?hl=en)
- [G4 — Colocación publicitaria](https://support.google.com/adsense/answer/1346295?hl=en)
- [A1 — Coursera Affiliate Program](https://www.coursera.org/about/affiliates)
- [A2 — Amazon Associates: acuerdo](https://affiliate-program.amazon.com/help/operating/agreement)
- [A3 — FTC: divulgaciones](https://www.ftc.gov/business-guidance/resources/disclosures-101-social-media-influencers)
- [D1 — BLS API](https://www.bls.gov/developers/api_signature_v2.htm)
- [D2 — BCE: tipos de referencia](https://www.ecb.europa.eu/stats/policy_and_exchange_rates/euro_reference_exchange_rates/html/index.en.html)
- [D3 — BCE: derechos](https://www.ecb.europa.eu/services/using-our-site/disclaimer/html/index.en.html)
- [D4 — FRED API: condiciones](https://fred.stlouisfed.org/docs/api/terms_of_use.html)
- [D5 — LBMA: publicaciones de metales](https://www.lbma.org.uk/prices-and-data/lbma-precious-metal-prices)
- [D6 — TradingView: widgets](https://www.tradingview.com/widget-docs/faq/general/)
- [C1 — Cloudflare: precios y límites](https://developers.cloudflare.com/workers/platform/pricing/)

Las condiciones pueden cambiar; volver a revisarlas inmediatamente antes de solicitar cuentas o activar proveedores.


## Validación realizada

24 pruebas Node aprobadas (incluidas las 21 de la versión de cursos), más prueba Chromium de escritorio 1440 px y móvil 390 px. Verificados dos idiomas, dos espacios reservados, cuatro borradores legales, rechazo y cambio de preferencias, fórmulas y validación del modelo. Aceptar preferencias no activa publicidad. Cero formularios de pago, cero campañas afiliadas y cero solicitudes externas generadas por el prototipo local. Las claves locales de los cursos permanecen intactas. Los lectores, catálogo, registro, precios y archivos B70 no se modifican. La suite general npm conserva sus fallos previos documentados en B70; no se declara aprobada.
