# B66 PA-203 · Auditoría verificable · 2026-10-18

## Pruebas realizadas (lectura, sin publicación)
- GitHub rama `B66-PA203-preparacion`: JSON válido con 8 lecciones, 6 evaluaciones, 30 preguntas y 5 cuadernos.
- Las 29 preguntas de opción múltiple tienen exactamente una opción marcada como correcta. La entrega manual no tiene opciones.
- Referencias a video: L1, L2, L3 y L4; L5–L8 no tienen video asociado.
- GitHub: archivos referenciados L1, L3 y L4 encontrados en la rama; **L2 devolvió 404 (NOT_FOUND)**. No se ha verificado la reproducción ni el audio de ninguno.
- Supabase: `pa203_project_submissions` = 0 registros; `course_lesson_progress` para PA-203 = 0 registros. No existe aún prueba extremo a extremo con alumno autenticado.
- HTML de aula contiene los controles de entrega e historial y referencia los scripts correspondientes. Esto es una inspección estática, **no prueba de navegador**.

## Bloqueos antes de declarar funcional
1. Restaurar/verificar MP4 de L2 en la ruta exacta o corregir la referencia después de identificar el original autorizado.
2. Probar los videos 1–4 con reproducción y sonido, y determinar si L4 corresponde al curso correcto.
3. Validar navegación, preguntas, ES/EN, guardado y recuperación en navegador móvil y escritorio.
4. Probar RLS y envío/lectura de entregas con cuenta de alumno y sesión real.
5. Configurar y validar proveedor de IA en función segura del servidor; no hay evaluador activo.
6. Verificar los materiales y los criterios de finalización antes de generar ZIP definitivo.

## Política de entrega
Ningún resultado de inspección estática se presentará como prueba de funcionamiento. No publicar ni modificar B63 o main sin autorización.
