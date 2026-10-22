# PLUTÓN TV — Control de calidad previo a publicación

Estado: **NO APROBADO PARA PUBLICACIÓN**. Prototipo privado. No modificar la rama principal.

## Pruebas técnicas

| Prueba | Resultado | Criterio de aceptación |
|---|---|---|
| Estructura y código de la página | Pendiente de ejecución en navegador | Carga sin errores JavaScript |
| Programación desde JSON | Pendiente | Se muestran los espacios correctos |
| Cambio automático entre tarjetas | Pendiente | Avanza sin congelarse |
| Modo biblioteca bajo demanda | Implementado; prueba en navegador pendiente | Seleccionar una tarjeta detiene el avance automático y permite cambiar manualmente |
| Cambio de biblioteca a TV | Implementado; prueba en navegador pendiente | Al desactivar modo biblioteca vuelve la rotación automática |
| Fin de video en biblioteca | Implementado; prueba en navegador pendiente | No salta al siguiente video sin elección del visitante |
| Pausar y reanudar | Pendiente | El contador se detiene y continúa |
| Avance manual | Pendiente | Cambia de programa sin mezclar datos |
| Noticias fuera de servicio | Pendiente | El canal continúa funcionando |
| Domingos de Fe, Familia y Esperanza | Pendiente | Aparece solamente los domingos |
| Videos sin autorización | Protección implementada; prueba pendiente | No aparecen en rotación |
| Primer video externo Orbits.webm | **INICIO DE REPRODUCCIÓN CONFIRMADO EN ANDROID POR CAPTURA DEL USUARIO**; avance continuo ≥3 s y audio sin evidencia concluyente | Reproduce imagen y avanza al menos 3 s |
| Editor copiar/pegar de PLUTÓN TV | Implementado en página de pruebas; sin autenticación ni publicación | Enlace directo HTTPS, título, derechos, vista previa y ficha de borrador |
| Confirmación de reproducción en editor | Implementada; pendiente prueba en navegador | Señal visible al avanzar 3 s, sin aprobar automáticamente |
| Administración privada y publicación | **NO IMPLEMENTADO** | Solo el administrador autenticado puede guardar y publicar; cambios reflejados en TV |
| Sonido | Pendiente | Silenciar/activar funciona en navegador |
| Android / móvil | Página aislada abierta en Chrome y reproducción iniciada según captura; controles de TV completos pendientes | Controles visibles, video reproducible |
| Computadora | Pendiente | Controles y reproducción correctos |
| Accesibilidad básica | Pendiente | Botones operables con teclado y etiquetas claras |
| Derechos de reproducción | Licencia CC BY-SA 3.0 identificada; revisión final pendiente | Créditos y obligaciones aplicables documentados |
| Integridad de producción | No se han solicitado cambios en producción | Ningún archivo de producción modificado |

## Protocolo del primer video

1. Abrir `pluton-tv/prueba-video-externo.html` desde un entorno HTTPS que sirva la rama de pruebas.
2. Pulsar «Reintentar reproducción» si no comienza.
3. Confirmar imagen y avance de al menos 3 segundos.
4. Pulsar «Copiar resultado técnico» y conservar el informe.
5. Registrar fecha, navegador, dispositivo y resultado. **No aprobar la emisión solamente porque el archivo tenga licencia.**
6. Si falla, documentar error y usar una copia permanente autorizada en un alojamiento compatible antes de integrar.

## Condiciones de salida

No declarar PLUTÓN TV terminado ni autorizar publicación hasta verificar en dispositivos reales, disponer de un video con fuente estable, confirmar los permisos de cada pieza y recibir autorización explícita del fundador.

## Evidencia de prueba en teléfono — 22 octubre 2026

El fundador descargó `prueba-video-externo.html` de GitHub, lo abrió en Chrome para Android y compartió una captura con imagen del video y el mensaje «Reproducción iniciada». Confirmó verbalmente que la prueba le parecía correcta. **Alcance:** se verifica apertura del archivo local y comienzo de reproducción del video externo. No se ha recibido un informe técnico con tiempo transcurrido ≥3 segundos ni prueba independiente del sonido, del reproductor completo de PLUTÓN TV o de su publicación web. Mantener el video sin aprobación para emisión automática.
