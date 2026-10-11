# PLUTÓN ACADEMIC · Video 1 · Proyecto audiovisual AV1

**Estado: proyecto completo para producción; no es un video terminado.** El montaje objetivo dura 112 segundos. Guion, escenas, composiciones 1080p, música original y subtítulos temporizados ES/EN están preparados. Faltan las grabaciones naturales ES/EN, la alineación final con esas voces y la verificación de los MP4 resultantes. No se entrega un video mudo como producto final.

Para revisar, abre `revision/index.html`. Permite cambiar idioma, recorrer todas las escenas, consultar la narración y escuchar la música. La reproducción es un storyboard temporizado con música opcional, sin voz; está rotulada como tal. No se aloja en Sites ni se publica en ningún sistema.

1. Revisa guiones y escenas antes de integración; `01_GUION_ES.md`, `02_SCRIPT_EN.md` y `03_PLAN_DE_MONTAJE.md`.
2. Graba los 12 WAV ES y 12 WAV EN según `04_DIRECCION_DE_VOZ.md`. Colócalos en las carpetas de idioma con los nombres de escena exactos.
3. Ajusta ambas alineaciones a la voz real y confirma permiso de uso. Los archivos SRT `PLAN_NO_FINAL` no están sincronizados con una voz todavía inexistente.
4. Con Python 3.10+, FFmpeg y FFprobe instalados: `python montar.py validar --idioma es` y `python montar.py validar --idioma en`.
5. Exporta `python montar.py render --idioma es` y `python montar.py render --idioma en`. Para copias con subtítulos fijos, añade `--quemar`.
6. Revisa todos los MP4 con auriculares y altavoces, imagen completa y subtítulos ES/EN; valida que la voz sea inteligible, no haya recortes, las pantallas correspondan a B56 y el cierre esté completo. La salida se guarda únicamente en `salida/`.

El montaje es determinista y no requiere servicios web. El renderizador no exporta si falta una toma, el audio está vacío o la alineación no se ha confirmado. Los controles automáticos comprueban recursos, tiempos, duraciones y pistas; la naturalidad de la voz y la sincronía precisan escucha humana.

Los paquetes entregados contienen menos de 100 archivos cada uno. No se empaquetan dependencias, modelos, claves, bases de datos ni el repositorio B56. Cuando se añadan grabaciones o renders, conservar la división por paquete si el total supera 99 archivos. No publicar ni integrar estos materiales sin aprobación del usuario.


## Fuentes editables

Las composiciones se pueden regenerar: edita `title.es/title.en` de cada escena en `timeline.json` y ejecuta `python componer.py --idioma ambos`. Las imágenes originales, tipografías y código de composición están incluidos. Actualiza también el storyboard si cambias un texto aprobado.

La secuencia y la síntesis musical son editables en `musica/componer_musica.py`; `musica/partitura_original.json` registra tempo, compases y notas MIDI. `python musica/componer_musica.py` regenera la pista original con la duración del proyecto. Revisar el audio tras cualquier cambio.

Para estos dos editores opcionales se utilizó Python 3.12 con las versiones de Pillow y NumPy de `requirements-edicion.txt`. Instalar con `python -m pip install -r requirements-edicion.txt`. El renderizador principal utiliza la biblioteca estándar de Python y FFmpeg; las composiciones y la música listas para montaje ya están incluidas.
