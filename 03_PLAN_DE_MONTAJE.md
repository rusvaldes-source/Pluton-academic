# Plan de montaje · video 2

Duración fija: 82 s. Dos versiones narradas independientes: ES y EN. Cada versión tendrá subtítulos ES y EN. No se mezclan ambos idiomas en una misma narración.

| Escena | Tiempo | Recurso | Texto en pantalla ES | Voz máxima por WAV | Dirección / fidelidad |
|---|---|---|---|---|---|
| W01 | 000–006 s | inicio | Bienvenido a / PLUTÓN ACADEMIC. | 4.90 s | Composición aprobada y transición suave. |
| W02 | 006–013 s | login | 1. Inicia sesión | 5.90 s | Mostrar el modal real vacío. No rellenar ni revelar credenciales. |
| W03 | 013–021 s | perfil | 2. Abre Mi plataforma | 6.90 s | Captura del panel real con sesión y PLUS simulados sin conexión; rotular cuenta de demostración. |
| W04 | 021–029 s | curso | 3. Encuentra tu curso | 6.90 s | Composición aprobada y transición suave. |
| W05 | 029–037 s | leccion | 4. Estudia y toma notas | 6.90 s | Botones reales. PDF mediante el diálogo de impresión del navegador; no descarga de manual completo. |
| W06 | 037–046 s | evaluacion | 5. Comprueba y avanza | 7.90 s | Primer quiz RE-201 resuelto solo en navegador de rodaje. Progreso del curso 33%; general 1%, datos de demostración. |
| W07 | 046–055 s | progreso | Tu progreso, organizado | 7.90 s | No prometer sincronía de apuntes. Mostrar panel real sin nuevos controles inventados. |
| W08 | 055–064 s | membresias | Membresías: consulta los planes | 7.90 s | Mostrar tarjetas B56, sin precios añadidos. Corte al modal informativo del plan PLUS en el storyboard complementario. |
| W09 | 064–074 s | certificados | Certificados: información | 8.90 s | Rotular MODELO INFORMATIVO / INFORMATIONAL SAMPLE. No animar generación, descarga ni verificación. |
| W10 | 074–082 s | idioma | Elige tu idioma. / Comienza tu próxima lección. | 6.90 s | Cierre; el selector ES/EN de B56 no aparece en el recorte del héroe: usar captura de portada con cabecera. |

Los textos EN y las frases emparejadas están en `timeline.json` y en el storyboard. Los fotogramas son composiciones terminadas para montaje, no fotogramas de un MP4 final. Preservan la proporción de las imágenes de B56. Las fuentes de 960×540 o menores se integran en una composición de 1920×1080; no son rodaje nativo 1080p.

Movimiento: las escenas fotográficas llevan un acercamiento central de 1,4% en toda la composición. Las capturas de interfaz permanecen estáticas para mantener la lectura. Entrada y salida por fundido de 0,3 s a negro; la música mantiene continuidad. No usar transiciones que simulen botones o pantallas inexistentes.

Audio: locución seca, 48 kHz, WAV mono o estéreo; normalización de voz a −18 LUFS antes de mezcla. Música original reducida y atenuada bajo la voz. Mezcla objetivo −16 LUFS integrados, pico verdadero ≤ −1,5 dBTP. Revisar auditivamente el archivo completo; los valores de normalización no sustituyen medición final.

Subtítulos: máximo dos líneas y 42 caracteres por línea, máximo 20 caracteres por segundo. Los SRT entregados son tiempos de planificación. Para exportación final se requiere alineación con las grabaciones reales. El renderizador genera los SRT revisados y dos pistas seleccionables en MP4. La opción `--quemar` fija el idioma narrado en la imagen.

Exportación: H.264, 1920×1080, 25 fps, píxel cuadrado, 16:9, yuv420p, AAC estéreo a 48 kHz / 192 kbps, MP4 con faststart. El renderizado no publica ni integra el contenido en ningún servicio.
