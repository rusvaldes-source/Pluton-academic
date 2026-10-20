# B87 · PLUTÓN Hoy, herramientas y tienda empresarial

Prototipo autorizado por Ruslan el 20 de octubre de 2026. Rama: `B87-Prueba-Hoy-Herramientas-Tienda`. Base: B86 (`f0fd32b`). Sin cambios en la portada, PLUTÓN Noticias, cursos, precios de membresías o autenticación. Sin despliegue solicitado ni realizado por este trabajo.

## Probar

Abrir `B87_VISTA_PREVIA.html` (archivo autónomo) o `index.html` directamente en un navegador moderno. No requiere instalación, servidor, servicios externos, claves ni conexión para funcionar. Incluye ES/EN. El único enlace externo lleva a CareerSource South Florida y se abre únicamente al pulsarlo.

## Lo que funciona

- PLUTÓN Hoy separado de Noticias, con acción diaria rotativa por día de la semana, práctica de inglés, recurso de tecnología y enlace oficial de oportunidades. Contenido editorial de muestra, no noticias en directo.
- Currículum: formulario, ejemplo ficticio, documento editable y descarga TXT. No traduce el texto introducido ni inventa experiencia.
- Entrevistas: tres áreas con cinco preguntas ES/EN, respuestas conservadas por pregunta en memoria y exportación TXT. Sin grabaciones o evaluación de personas.
- Documentos: correo profesional o presupuesto USD con cálculo de subtotal, edición y descarga. No calcula impuestos ni otros cargos.
- Tienda: seis conceptos de productos, categorías, búsqueda, muestras reales gratuitas en TXT y selección de prueba con total simulado. Los DOC/XLSX/PDF listados son formatos propuestos; no se ofrecen como archivos terminados. Sin cobros, pedidos ni pagos.

## Persistencia y privacidad

Los datos de los formularios, respuestas y selección permanecen solo en memoria de la pestaña. Recargar o cerrarla los borra. Solo una descarga expresamente solicitada crea un archivo en el dispositivo. Sin localStorage, cookies de seguimiento ni llamadas a IA.

## Próxima revisión

Revisar diseño y nombres con Ruslan. Elegir tres productos para producir sus formatos finales, definir licencia y política comercial; después seleccionar pagos, entrega y límites de funciones. La integración pública requiere una instrucción posterior. No activar cobros ni modificar membresías a partir de este prototipo.

## Verificación

`node --test tests/b87-tools.test.cjs` desde la raíz del repositorio.
`node --check b87-prueba/app.js` y `node --check b87-prueba/tools.js`.
La prueba general heredada necesita un ejecutable Playwright no instalado en este entorno. Su ausencia se informa por separado; no implica que esa prueba haya pasado.

Pruebas de interacción: `node --test tests/b87-tools.test.cjs tests/b87-dom.test.cjs` con jsdom 26.1.0 disponible mediante NODE_PATH. Resultado: 10 pruebas aprobadas. La comprobación DOM no valida el aspecto visual. La previsualización local no estuvo disponible en el navegador de esta sesión; el diseño móvil y de escritorio requiere revisión visual antes de integrar.

Tras instalar las dependencias de desarrollo del repositorio, ejecutar `npm run test:b87`. El archivo B87_VISTA_PREVIA.html incluye todos sus estilos y scripts y puede revisarse sin extraer otros archivos.
