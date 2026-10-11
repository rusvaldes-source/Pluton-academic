# Plan de montaje · video 1

Duración fija: 112 s. Dos versiones narradas independientes: ES y EN. Cada versión tendrá subtítulos ES y EN. No se mezclan ambos idiomas en una misma narración.

| Escena | Tiempo | Recurso | Texto en pantalla ES | Voz máxima por WAV | Dirección / fidelidad |
|---|---|---|---|---|---|
| I01 | 000–008 s | b54-hero-photo.jpg | El conocimiento abre caminos. | 6.90 s | Apertura: revelar la imagen aprobada con fundido de 0,3 s. Pausa cálida antes de aprender. |
| I02 | 008–018 s | foto-profesional.jpg | Educación útil. / Nuevas posibilidades. | 8.90 s | Plano de conversación profesional; no atribuir una persona al fundador. |
| I03 | 018–028 s | b54-hero-photo.jpg | Aprende a tu ritmo. | 8.90 s | Composición aprobada y transición suave. |
| I04 | 028–037 s | course-photo-PA-101.jpg | Salud | 7.90 s | Contenido educativo introductorio; no sugerir licencia sanitaria o práctica acreditada. |
| I05 | 037–046 s | course-photo-RE-101.jpg | Bienes raíces | 7.90 s | Composición aprobada y transición suave. |
| I06 | 046–055 s | course-photo-ID-101.jpg | Inglés profesional | 7.90 s | Composición aprobada y transición suave. |
| I07 | 055–064 s | course-photo-NE-101.jpg | Emprendimiento | 7.90 s | Composición aprobada y transición suave. |
| I08 | 064–073 s | course-photo-PA-203.jpg | Herramientas digitales | 7.90 s | Composición aprobada y transición suave. |
| I09 | 073–083 s | course-photo-PA-203.jpg | Lee. Practica. Revisa. | 8.90 s | Composición aprobada y transición suave. |
| I10 | 083–093 s | course-photo-ID-101.jpg | Español e inglés | 8.90 s | Composición aprobada y transición suave. |
| I11 | 093–103 s | foto-profesional.jpg | Pequeños pasos. / Avances reales. | 8.90 s | Composición aprobada y transición suave. |
| I12 | 103–112 s | b54-hero-photo.jpg | Tu futuro comienza / con conocimiento. | 7.90 s | Cerrar sobre lema durante 3 s; pronunciar el nombre sin imitar la voz del fundador. |

Los textos EN y las frases emparejadas están en `timeline.json` y en el storyboard. Los fotogramas son composiciones terminadas para montaje, no fotogramas de un MP4 final. Preservan la proporción de las imágenes de B56. Las fuentes de 960×540 o menores se integran en una composición de 1920×1080; no son rodaje nativo 1080p.

Movimiento: las escenas fotográficas llevan un acercamiento central de 1,4% en toda la composición. Las capturas de interfaz permanecen estáticas para mantener la lectura. Entrada y salida por fundido de 0,3 s a negro; la música mantiene continuidad. No usar transiciones que simulen botones o pantallas inexistentes.

Audio: locución seca, 48 kHz, WAV mono o estéreo; normalización de voz a −18 LUFS antes de mezcla. Música original reducida y atenuada bajo la voz. Mezcla objetivo −16 LUFS integrados, pico verdadero ≤ −1,5 dBTP. Revisar auditivamente el archivo completo; los valores de normalización no sustituyen medición final.

Subtítulos: máximo dos líneas y 42 caracteres por línea, máximo 20 caracteres por segundo. Los SRT entregados son tiempos de planificación. Para exportación final se requiere alineación con las grabaciones reales. El renderizador genera los SRT revisados y dos pistas seleccionables en MP4. La opción `--quemar` fija el idioma narrado en la imagen.

Exportación: H.264, 1920×1080, 25 fps, píxel cuadrado, 16:9, yuv420p, AAC estéreo a 48 kHz / 192 kbps, MP4 con faststart. El renderizado no publica ni integra el contenido en ningún servicio.
