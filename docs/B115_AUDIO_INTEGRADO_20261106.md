# B115 — integración privada de 120 audios

6 de noviembre de 2026. Rama: `B115-integracion-audios-120`.

Los cuatro paquetes privados tienen 15 lecciones ES/EN, 30 MP3 originales por
curso, portadas aprobadas ES/EN, lector con reproductor, cuadernos y preguntas.
Los 120 guiones coinciden exactamente con `narration` del contenido original.
Los archivos privados y las respuestas no se incluyen en este repositorio.

El lector detiene y libera el MP3 anterior al cambiar de idioma, lección o
evaluación. Cada paquete incluye `course.json` con rutas compatibles con el
almacenamiento privado existente, un manifiesto de importación y checksums.
`scripts/b115-integrate-audio.py` permite reproducir la integración sin llamadas
externas; exige mantener la salida privada fuera del checkout público.

La adaptación de la plantilla existente admite los cuatro códigos, 15
lecciones, medios privados y portadas por idioma. Se mantienen autenticación,
filtro de contenido publicado, comprobación del propietario y URLs firmadas
del bucket existente; nunca se concede una compra desde el navegador.

## Verificación

`tests/b115-audio-integration.test.cjs` verifica el lector en DOM ejecutable:
120 rutas, navegación, 8 portadas, audio único por pantalla, liberación del
anterior y examen final. Comprueba además rechazo de otro curso, usuario sin
sesión, origen no confiable y limpieza al cerrar sesión. Las cuatro pruebas
estáticas B114 también pasan: seis pruebas, cero fallos.

Los 120 MP3 originales pasaron decodificación y sus bytes se conservan. Cada
ZIP queda bajo el límite de 100 archivos: 81, 81, 81 y 84 respectivamente.
El navegador remoto no permite abrir archivos locales; no se declara QA de
reproducción visual real ni acceso real de estudiantes.

## Alcance de esta entrega

No se modificó producción ni se importaron objetos en servicios externos.
La carga privada de los MP3 y los payloads, la habilitación de catálogo y
la publicación son pasos de despliegue separados. El manifiesto registra el
destino previsto de cada recurso; no acredita que ya exista en ese destino.
No se tocó Stripe ni se ejecutaron revisiones o cambios de Supabase.
Los videos siguen pendientes como en el contenido original. Se conserva el
estado de borrador y el modelo de constancia manual original.

Para reproducir las pruebas, instalar jsdom 26.1.0 y definir `B115_ROOT` con
la carpeta privada integrada; ejecutar `node --test
tests/b115-audio-integration.test.cjs tests/b114-static-integrity.test.cjs`.
