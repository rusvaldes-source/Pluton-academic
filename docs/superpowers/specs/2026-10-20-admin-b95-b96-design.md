# B95/B96 · Propuesta aprobada

Autorización del usuario: «implementa el arreglo».

B95–B96 · Editor de cursos y certificadosPLUTÓN ACADEMIC · Propuesta para revisión ·20octubre2026
B95–B96 · Edición de cursos y certificados
Diseño de los dos módulos pendientes del administrador. Es una propuesta: todavía no se han creado tablas, modificado aulas ni habilitado emisión de certificados.
Resultado de la revisión
El panel actual tiene enlaces a los cursos, pero no un editor. Hay siete cursos repartidos en tres formatos. No existe registro de certificados ni verificador. Los controles actuales de progreso son declarados por el estudiante; no sirven por sí solos para acreditar aprobación.
Se recomienda conservar las aulas y sus permisos, añadir edición por borradores y crear un registro de documentos independiente. La alternativa de trasladar todos los cursos a una única fuente introduciría una migración mayor; editar los archivos públicos desde el navegador requeriría credenciales de repositorio que no deben exponerse.
B95 · Editor de los siete cursos
Flujo: seleccionar curso y lección → editar ES/EN → guardar borrador → vista previa → publicar con confirmación. También restaurar una versión anterior.
Campos: título, explicación, ejemplos, ejercicios, preguntas de práctica y enlaces de videos existentes. Se conservarán los videos y avatares aprobados.
Primera versión: no borrar, crear o reordenar lecciones ni cambiar sus códigos. Así se evita asociar el progreso guardado con otra lección.
Los borradores son privados del administrador. Guardar no cambia el aula. La publicación mantiene una versión previa y rechaza sobrescrituras si otro editor publicó entre tanto.
La vista del alumno debe mostrar exactamente los campos publicados, incluidos los repasos que hoy proceden del archivo B84 y los videos que hoy proceden del mapa B64.
Las seis muestras y el temario público de ID-001 se actualizarán desde una proyección limitada; nunca se expondrá el curso completo de pago en el catálogo público.
Los cambios de preguntas de práctica no se convertirán en notas oficiales. Las respuestas guardadas de una revisión anterior no se reutilizarán como resultados nuevos.
CursosIntegración propuestaAcceso conservado
PA-203, ID-101, MKT-201, PA-101Almacenamiento de versiones publicadas y adaptación de sus cargadores actuales. Copia inicial exacta de los JSON existentes.La lectura actual de esos materiales; borradores solo para administrador.
NA-101 y COMP-101Conservar course_learning_content. Añadir borradores y escritura administrativa validada.Usuarios autenticados para publicados.
ID-001 · Inglés desde ceroConservar course_premium_content y la autorización de compra separada. Actualización limitada de muestras/temario.Administrador o autorización específica del curso; seis muestras abiertas.
B96 · Documentos verificables
Flujo: buscar estudiante → seleccionar curso y versión → revisar nombre y evidencia → previsualizar documento ES/EN → emitir → descargar/imprimir. Posteriormente se podrá revocar con motivo registrado.
Se propone empezar con constancias de participación, aprobadas manualmente por el administrador y basadas en evidencia documentada. No se afirmará que el estudiante aprobó un examen oficial.
El certificado de finalización quedará habilitado por curso únicamente cuando existan criterios de aprobación acordados y evidencia confiable. La interfaz oficial de evaluación de PA-203 está deshabilitada y la tabla de notas tiene cero registros; no se presentará como acreditación ya disponible.
NA-101 mantiene su bloqueo de certificados y su revisión clínica pendiente. Ningún documento acreditará licencia, programa CNA aprobado ni competencia clínica práctica. PA-101 conservará su alcance introductorio.
El servidor asignará código aleatorio, fecha y administrador emisor. El alumno no podrá emitirse documentos ni enviar un porcentaje del navegador como prueba de aprobación.
La identidad se resolverá contra el usuario real de Auth; no se supondrá que profiles.id equivale al identificador de la cuenta. El nombre mostrado se revisará antes de emitir.
Un documento emitido no se sobreescribirá. Para corregir nombre o curso se revocará y emitirá otro, conservando el historial.
La verificación por código exacto mostrará tipo, curso, fecha y estado válido/revocado/no encontrado. No permitirá listar estudiantes ni mostrará correo, evidencia o motivos privados. El nombre público requerirá consentimiento; por defecto estará oculto o enmascarado.
Se reutilizará el diseño azul/dorado. Se generará documento imprimible desde el registro guardado; no se inventarán horas lectivas, créditos, firmas nuevas ni acreditaciones externas.
Datos y permisos
Conservar is_pluton_admin y support_admins, sin crear otro sistema de roles.
Nuevo almacenamiento de borradores y versiones. Publicación transaccional, validación por formato y control de versión esperada.
Nuevo registro de certificados/constancias y eventos de emisión/revocación; RLS y sin escritura directa del estudiante.
Operaciones de servidor verifican sesión y permiso administrativo. Ninguna clave de servicio irá al navegador.
Al cambiar de cuenta o cerrar sesión se retirarán editor, vistas previas y datos del estudiante; se descartarán respuestas tardías.
Pruebas de aceptación
Editar y publicar una lección de cada formato: la versión del alumno refleja el cambio y conserva sus videos.
Guardar un borrador no altera el curso publicado. Restaurar una versión recupera exactamente el contenido previo.
Un conflicto entre dos editores no sobrescribe cambios ajenos.
Una cuenta de estudiante o un visitante no modifica cursos ni emite/revoca documentos. ID-001 conserva su acceso separado.
El administrador puede emitir una constancia de prueba en un entorno aislado, verificarla y revocarla; la página de validación refleja el estado real.
Un error de red nunca se presenta como publicación confirmada ni certificado válido.
Una respuesta tardía tras cambiar de cuenta no muestra datos ni modifica formularios de otra sesión.
Alcance para aprobar
Implementar primero B95 y después B96, en ramas independientes, con revisión, pruebas y respaldo antes de integrar. Los pagos y los49 audios pendientes no forman parte de estos módulos. No se emitirán documentos reales a estudiantes durante las pruebas.
La decisión principal es comenzar los documentos con constancias de participación verificables y reservar los certificados de finalización para cursos con criterios y evidencia aprobados.