# B87 catálogo sin descargas comerciales abiertas

Abrir `B87_VISTA_PREVIA.html` o `index.html`. El catálogo permite consultar los tres paquetes y los archivos que incluyen. La compra está desactivada y no se ha elegido proveedor de pagos.

## Qué se cerró

- Retirados del árbol de código público los 21 archivos comerciales, sus tres ZIP y los generadores que permitían recrearlos.
- Eliminados los archivos incrustados en la vista autónoma y todas las rutas directas a paquetes, Word, PDF y Excel comerciales.
- Eliminadas las descargas comerciales de las guías del currículum y del diálogo de productos.
- Añadidas exclusiones Git para prevenir nuevas incorporaciones accidentales. La exclusión no sustituye una revisión de lo que se sube.
- Los formularios siguen permitiendo descargar el texto creado por el usuario y sus respuestas de entrevista. Esas herramientas gratuitas no contienen los paquetes comerciales.

## Conservación

Los archivos comerciales se conservan en la entrega B87 que recibió el propietario y en su copia de trabajo anterior. No se destruyeron ni se convirtieron en productos ficticios. Este ZIP y esta vista del catálogo no los incluyen.

## Pagos y entrega pendientes

`commerce-config.json` declara `provider: null`, `checkoutEnabled: false` y `downloadsEnabled: false`. No se ha conectado Stripe, Gumroad ni otro proveedor. Estos campos documentan el estado; no son una autorización de descarga ni un control de acceso. No hay archivo comercial disponible en el frontend aunque alguien altere la interfaz.

Antes de vender: elegir proveedor, configurar pago real, comprobar la compra en servidor y entregar los archivos desde almacenamiento privado mediante autorización temporal. No colocar los paquetes en el HTML ni en rutas estáticas públicas. Los precios siguen pendientes de aprobación.

## Límites

Retirar archivos de la versión actual no revoca copias descargadas antes. También pueden permanecer objetos o vistas antiguas en cachés e historial remoto. La revisión de la rama elimina la versión con los archivos comerciales de su historia alcanzable, pero no se declara una purga de los objetos históricos de GitHub; eso requiere el proceso de retirada correspondiente del proveedor. No se promete que una URL histórica conocida deje de funcionar.

## Verificación

`npm run test:b87`: 15 pruebas de lógica e interacción DOM, incluyendo ausencia de archivos, datos incrustados, enlaces de descarga y proveedor elegido. Sintaxis y diff verificados. La revisión visual de navegador y la prueba general heredada permanecen pendientes porque el navegador de prueba no está disponible. No se ha publicado ni modificado main.
