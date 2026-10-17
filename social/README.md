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
