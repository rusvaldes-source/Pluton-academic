# B77 — Videos por curso y lección

Base: main ceee788 (B76). Estado: integración en main autorizada expresamente por el propietario el 19 octubre 2026; comprobación del despliegue pendiente.

## Cambio
El Aula Digital general muestra el video correspondiente dentro de cada una de las 28 lecciones: PA-203 (8), ID-101 (12), MKT-201 (8). Antes, ID-101 y MKT-201 mostraban solamente el enlace a sus aulas individuales. Sus aulas individuales ya tenían asociados los videos; se conservan.

Se actualizan los mapas videos.json y b64/videos.json con los 28 enlaces permanentes que ya están alojados, y se utilizan al mostrar las lecciones. No hay que volver a subir los MP4 ni consumir créditos de generación.

## Comprobaciones
- 28 identificadores de video distintos, 28 enlaces distintos, 28 SHA256 de MP4 distintos y 28 guiones normalizados distintos.
- Correspondencia exacta de los mapas con los videos de las aulas individuales PA-203, ID-101 y MKT-201.
- Los 28 enlaces alojados responden HTTP 200, son video/mp4 y sus tamaños coinciden con los originales recuperados.
- Prueba de navegador: las 28 lecciones muestran su propio video; los cuadernos no heredan el video de una lección.
- Pruebas de contenido ID-101 y MKT-201: 4 aprobadas.
- Los MP4 originales recuperados ya pasaron decodificación completa sin errores y contienen audio. Los temas de los guiones corresponden a sus respectivas lecciones. Son explicaciones o resúmenes educativos; no lecturas íntegras de todo el texto escrito.

## Límites reales de validación
La prueba opcional de reproducción con MP4 en el navegador automatizado de este entorno agotó el tiempo de espera de play(); no se presenta como aprobada. La reproducción visual integral y la sincronización perceptual de labios siguen pendientes. No se infiere que un enlace HTTP 200 por sí solo pruebe reproducción.

La suite general npm test no aprobó: inicialmente faltaba fixtures/supabase-2.117.3.js. Proporcionando temporalmente el archivo ya existente en la raíz, la suite agotó el tiempo de espera en regression-tests.cjs:40, al esperar que la portada estuviera en inglés. Este problema de la suite/portada no se modificó en B77.

## Conservación
No se modifican las bienvenidas, el catálogo, las fotografías, los contenidos escritos, el progreso, la autenticación ni los MP4 originales. La aplicación en main y el despliegue de B77 fueron autorizados expresamente por el propietario.

## Pendientes NA-101 / COMP-101
No se asignan videos de otros cursos para rellenar estas lecciones. La primera producción NA-101 falló por MOVIO_PAYMENT_INSUFFICIENT_CREDIT; el saldo premium observado se mantuvo en 4. No se ejecutaron otras generaciones ni compras. Antes de repetir la producción se necesita conocer el costo y disponer de la clase de créditos exigida por la conexión de HeyGen.

## Aplicación
El ZIP contiene los cuatro archivos web modificados respetando sus rutas, más los controles B77 y sus pruebas. Aplicar sobre la base B76 y verificar el entorno de prueba antes de publicar. Los videos se sirven desde sus enlaces existentes.
