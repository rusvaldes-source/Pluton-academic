# B66 — Auditoría estructural PA-203 (18 oct 2026)

**Alcance:** comprobación estática de archivos en la rama de pruebas; NO equivale a prueba de reproducción ni publicación.

## Comprobado
- Ocho lecciones definidas, cada una con campo de video.
- Lecciones 1, 3 y 4: MP4 presentes en GitHub (`b64/videos/`), según consulta del repositorio.
- Lección 2: MP4 original recuperado y almacenado en Supabase Storage (32.988.762 bytes); JSON actualizado.
- Lecciones 5–8: MP4 almacenados en Supabase Storage; JSON actualizado con URLs HTTPS permanentes.
- Reproductor B66 admite rutas relativas y URLs HTTPS absolutas, muestra estados de carga/reproducción y duración cuando el navegador la conoce.
- Seis actividades/evaluaciones con 30 preguntas en total: 2 autoevaluación módulo 1, 1 entrega de proyecto, 12 evaluación final y 5 cada una en repasos de lecciones 1, 2 y 3.
- Claves de respuesta: todas las preguntas con opciones tienen exactamente una marcada `correcta_segun_editor=true`; el reproductor usa esa misma propiedad.

## Pendiente de resolver y verificar
1. **Lecciones 4–8:** no aparecen repasos interactivos independientes de cinco preguntas cada uno. Evaluar y completar sin duplicar la evaluación final ni actividades existentes.
2. **Experiencia didáctica:** confirmar que video, resumen, ejemplo, ejercicio y cuestionario estén presentados por separado y traducidos ES/EN en las ocho lecciones; el texto de las lecciones aún se muestra en bloque `<pre>`.
3. **Prueba real:** comprobar HTTP, carga del MP4, duración, imagen, audio, avance y reproducción en móvil para cada una de las ocho lecciones. Las rutas y el tamaño de archivo por sí solos no lo prueban.
4. **Evaluación final y proyecto:** verificar entrega autenticada, persistencia, permisos RLS, mensajes de error y corrección/retroalimentación de IA. No declarar calificación automática hasta probarla.
5. **Progreso:** comprobar sincronización con Supabase, cierre de sesión, cambio de usuario, recuperación y uso móvil.
6. **Bilingüe:** revisar textos, navegación, ejercicios y retroalimentación en español e inglés.
7. **Publicación:** requiere aprobación explícita. Mantener `main` y B63 intactos.

## Estado
**B66 en preparación; no apto todavía para publicación.**
