# Dirección de locución y grabación

Grabar dos voces naturales profesionales, una por idioma, o una persona bilingüe con dicción nativa en ambos. Tono cálido, seguro, cercano y sereno; sin exageración comercial. No clonar ni imitar al fundador. Pronunciar «PLUTÓN» como plu-TÓN; en español puede leerse «Académic» de forma coherente. En inglés, conservar la marca PLUTÓN y pronunciar «Academic» naturalmente.

El guion institucional necesita aproximadamente 130–170 palabras por minuto durante las frases, con pausas de apertura y cierre. La bienvenida puede subir a 145–185 palabras por minuto en las frases más densas, manteniendo claras las etiquetas de navegación. Respetar los límites por escena de `03_PLAN_DE_MONTAJE.md`. No alargar mediante aceleración artificial; repetir la toma si no cabe.

Entregar un WAV por escena e idioma: `locucion/es/I01.wav` o `locucion/en/I01.wav` para el video institucional; `W01.wav` a `W10.wav` para bienvenida. No añadir música, reverb, compresión fuerte ni silencio inicial largo. La inserción automática empieza 0,65 s después del inicio de cada escena. Mantener mínimo 0,45 s antes del corte final.

Registrar voz a 48 kHz / 24 bits, pico entre −12 y −3 dBFS, ruido de fondo bajo, sin clipping ni respiraciones disruptivas. Confirmar autorización comercial de la grabación y guardar el consentimiento del intérprete con el equipo productor.

Después de grabar, escuchar las frases sobre cada escena y ajustar `start/end` en `locucion/alineacion_es.json` y `alineacion_en.json`. Los tiempos son absolutos desde el comienzo del video, y ES/EN se sincronizan por significado con la voz de esa versión. No copiar la alineación ES al EN: cada interpretación tiene pausas diferentes. Al terminar la revisión, activar `verified_against_audio` y `voice_rights_confirmed`. Mantener intacto el texto aprobado; cualquier cambio de narración requiere actualizar guion y subtítulos conjuntamente.
