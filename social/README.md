# B58B — Redes sociales / Social links

**Selección:** Instagram, Facebook, YouTube, LinkedIn y TikTok. WhatsApp Business opcional, solo si se habilita atención por ese canal.

**Ubicación:** pie de página global, debajo de contacto; opcional bloque «Síguenos / Follow us» en portada. No llenar la cabecera de logos.

**Reglas obligatorias:**
1. No inventar cuentas ni URLs. Configurar `social-links.json` solo después de verificar que el perfil oficial de PLUTÓN ACADEMIC existe y pertenece a la academia.
2. Los iconos oficiales de cada marca deben descargarse de los recursos de marca de la plataforma y colocarse en `/assets/social/<id>.svg` con licencia/guía respetada. Nunca reemplazar el logo de Facebook por el de Meta, ni recolorear arbitrariamente marcas.
3. El módulo oculta redes sin URL verificada; no presenta enlaces rotos o a la portada genérica de una red.
4. ES/EN, navegación con teclado, objetivos táctiles de 44px, etiquetas accesibles, `rel=noopener noreferrer`.
5. Los enlaces externos no implican colaboración o patrocinio. No incluir chat de WhatsApp hasta que exista número de atención aprobado; priorizar tickets de soporte internos.
6. Pendiente integrar con el footer real de B57/B58 y hacer pruebas móviles, idiomas, URL, assets y accesibilidad antes de lanzamiento.

**Estado:** archivos de componente y configuración preparados, no integrados a la web pública; ninguna cuenta verificada, logos oficiales aún por incorporar.

**Revisión 16 oct:** para mostrar un enlace se requiere URL HTTPS con ruta de perfil y `verified: true`, confirmado por el administrador. Mientras no haya cuentas verificadas, se oculta el módulo. Los nombres son fallback accesible; logos oficiales aún pendientes.


## B73 — corrección del panel público (19 oct 2026)

El pie real de `index.html` carga `b59-social.js`, que utiliza el validador compartido de `social/social-links.js` y exclusivamente `social/social-links.json`. Las copias históricas de configuración no se modifican ni controlan este panel.

- Ya no se dibujan botones inactivos para cuentas sin configurar.
- Sin cuentas verificadas se muestra un aviso ES/EN; un fallo de carga tiene su propio mensaje.
- Los enlaces válidos funcionan con teclado, abren una pestaña nueva y tienen objetivos de al menos 44 px.
- Se admiten las seis redes del archivo, incluido TikTok y WhatsApp Business cuando estén aprobadas.
- No se añadieron URLs: las seis cuentas siguen pendientes de identificación por el propietario. No se crearon cuentas ni se publicó en redes.

Para activar una cuenta: recibir su URL oficial, verificar que pertenece a la academia y editar su entrada en `social/social-links.json` con URL HTTPS y `verified: true`. Probar el destino real antes de publicar. La prueba usa perfiles ficticios únicamente como fixtures; no acredita titularidad.

Verificación: `node --test tests/social-links.test.mjs` y `LD_LIBRARY_PATH=/tmp/b70-libs node tests/b73-social-browser.cjs` (Chromium y Playwright disponibles en el entorno de trabajo). Cobertura: escritorio/móvil, ES/EN, sin configuración, fallo HTTP, URLs rechazadas, TikTok, teclado y tamaño táctil. Ninguna modificación de cursos, autenticación, pagos, Supabase ni Aula Digital.
