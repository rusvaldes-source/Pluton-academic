# PLUTÓN NEWS — auditoría técnica e integración propuesta
Fecha: 2026-10-21. Solo rama de prueba. No fusionar/publicar sin aprobación.

## Hallazgos confirmados en el código
- `admin/index.html` contiene formulario de noticia bilingüe con título ES/EN, cuerpo ES/EN y video opcional YouTube/Vimeo.
- `admin/admin.js` usa Supabase `pluton_news` y consulta `id,title_es,title_en,video_url,status,created_at`. El editor controla estados `draft`, `review`, `published` con confirmación y marca `published_at`.
- El panel comprueba `is_pluton_admin` antes de presentar funciones privadas. No modificar ese control ni credenciales.
- La propia interfaz advierte que todavía no existe canal público conectado.
- Prototipo aislado: `noticias/index.html` con categorías y ES/EN, sin publicaciones ficticias.

## Conexión pendiente
1. Identificar definición SQL actual de `pluton_news`, sus políticas RLS, índices y permisos. **No exponer claves service_role**.
2. Definir lectura pública limitada exclusivamente a `status='published'`, mediante vista/RPC o endpoint seguro. No exponer borradores, perfiles ni registros privados. Verificar autorización de lectura antes de implementar.
3. Definir `category`, `source_name`, `source_url`, `published_at`, `updated_at`, `language`, `attribution` y, si procede, `summary_es/en`. Cambios de esquema requieren revisión y respaldo.
4. Crear render público con escape seguro (textContent, no HTML arbitrario), estados vacíos y error, paginación y filtros; evitar enlaces `javascript:`.
5. Crear ingesta servidor programada (nunca API secreta en frontend) con deduplicación por URL canónica, validación de dominio/URL, control de errores, tasa y trazabilidad; inicialmente enviar a `review`, no publicar automáticamente sin política aprobada.
6. Revisar permisos/licencias de cada RSS/API. Google News es un agregador, no una licencia de republicación. No copiar artículos completos, miniaturas o fotografías sin autorización.
7. SEO: URL canónica, sitemap, metadatos y datos estructurados solamente para contenido original real. No indexar el prototipo ni páginas vacías.
8. AdSense: reservar espacios discretos, sin scripts publicitarios ni pagos hasta aprobación. Distinguir claramente contenido editorial de anuncios.

## Pruebas de aceptación
- Usuario anónimo solo ve noticias publicadas.
- Borradores/revisión no son accesibles por URL ni por consultas anónimas.
- Cambio de idioma mantiene la categoría seleccionada.
- Enlaces de fuentes son HTTPS y abren con `rel=noopener noreferrer`.
- Diseño móvil y accesibilidad de botones/teclado.
- Sin cambios en index principal, cursos, membresías, audios o videos.

## Pendiente de decisión editorial
Fuentes iniciales a evaluar: RSS de NASA y organismos públicos de educación/empleo/salud, y agregación de titulares vía Google News sujeta a términos aplicables. Reuters/AP requieren comprobar licencias comerciales específicas. El lanzamiento debe comenzar con una selección pequeña y comprobada.
