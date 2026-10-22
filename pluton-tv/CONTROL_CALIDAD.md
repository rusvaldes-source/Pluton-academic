# PLUTÓN TV — Control de calidad previo a publicación

Estado: **NO APROBADO PARA PUBLICACIÓN**. Prototipo privado. No modificar la rama principal.

## Pruebas técnicas

| Prueba | Resultado | Criterio de aceptación |
|---|---|---|
| Estructura y código de la página | Pendiente de ejecución en navegador | Carga sin errores JavaScript |
| Programación desde JSON | Pendiente | Se muestran los espacios correctos |
| Cambio automático entre tarjetas | Pendiente | Avanza sin congelarse |
| Pausar y reanudar | Pendiente | El contador se detiene y continúa |
| Avance manual | Pendiente | Cambia de programa sin mezclar datos |
| Noticias fuera de servicio | Pendiente | El canal continúa funcionando |
| Domingos de Fe, Familia y Esperanza | Pendiente | Aparece solamente los domingos |
| Videos sin autorización | Protección implementada; prueba pendiente | No aparecen en rotación |
| Primer video externo Orbits.webm | **NO VERIFICADO** | Reproduce imagen y avanza al menos 3 s |
| Sonido | Pendiente | Silenciar/activar funciona en navegador |
| Android / móvil | Pendiente | Controles visibles, video reproducible |
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
