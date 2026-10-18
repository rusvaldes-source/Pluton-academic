# B67 — ID-101 — 18 octubre 2026
Autoridad: orden maestra del usuario; ejecución continua sin permisos rutinarios.
Base: 6ba26bccf714d0c9bf3efc3053ca98fd4a4dd548.
Diseño: conservar 12 lecciones, 6 cuadernos y examen recuperados en b64/materiales.json; crear un aula específica con secciones separadas, cinco preguntas bilingües por lección, práctica con retroalimentación y progreso por cuenta en la tabla existente course_lesson_progress. Enlazar desde Mis cursos y Aula Digital; no reemplazar el reproductor PA-203. Videos nuevos solo con avatares/voces comprobados de PA-203. Ninguna nota local será oficial.
1. Inventario y respaldo de materiales y estado base.
2. Guiones y videos de 12 lecciones, validación de originales, importación al bucket ID-101 mediante operación autenticada.
3. Completar ejemplos, ejercicios y 60 preguntas con explicación bilingüe; conservar fuente original.
4. Aula adaptable con idioma, navegación, descarga de cuadernos y guardado de práctica/progreso; errores de sincronización visibles y aislamiento de cuentas.
5. Pruebas automáticas de contenido, corrección, persistencia y navegación; QA real de video/sonido y pantallas.
6. Solo después de pasar QA, integrar y comprobar producción. Si no pasa, conservar rama y documentar evidencia y bloqueo.
## Registro
Inventario: 12 lecciones ES con referencias EN, 6 cuadernos ES/EN, examen 12 preguntas. HeyGen: 14 videos preexistentes, todos ajenos a ID-101; ningún video recuperable del curso. Supabase: course_lesson_progress con RLS por user_id y clave compuesta; no requiere cambio de esquema.
Decisión: no tocar autenticación, precios o PA-203; recursos nuevos bajo b67. Mantener todos los materiales de origen.
