# B66 · Evaluador IA del proyecto PA-203 (fase de prueba)

## Estado
Base de datos creada en Supabase: `public.pa203_project_submissions`, RLS habilitada, inserción y lectura únicamente por el estudiante autenticado. Ninguna calificación automática se considera definitiva y no se emiten certificados.

## Rúbrica original del proyecto (100 puntos)
- Organización (25): estructura Entrada/Trabajo/Entrega 10, fuente y versiones 10, respaldo/acceso 5.
- Instrucciones y comunicación (25): objetivo/contexto/datos/formato/límites 10, correo de 90–130 palabras con cuatro preguntas 10, dos mejoras explicadas 5.
- Verificación y resumen (30): seis verificaciones con evidencia 15, resumen fiel y categorías 10, ningún compromiso inventado 5.
- Privacidad y reflexión (20): información mínima y tres exclusiones 10, reflexión y revisión humana 10.

## Diseño seguro
1. El alumno autenticado entrega entre 500 y 20.000 caracteres usando datos ficticios.
2. Una función de servidor comprueba la sesión y que la entrega pertenece al usuario; controla longitud, frecuencia y costes.
3. La función llama a un proveedor de IA mediante secreto de servidor, nunca desde JavaScript del navegador.
4. Se solicita respuesta estructurada con puntos por subcriterio, citas de la entrega, explicaciones y señales de incertidumbre; se validan rangos y suma (100 máximo).
5. La evaluación se guarda con estado `provisional` o `needs_review`. El alumno recibe comentarios y puede revisar su entrega.
6. Las decisiones de aprobado definitivo, progreso oficial y certificados permanecen desactivadas hasta pruebas de precisión, seguridad y aprobación explícita.

## Bloqueos verificables
- No hay ninguna Edge Function desplegada en el proyecto Supabase al inicio de esta fase.
- Falta configurar y verificar el secreto de un proveedor de IA y realizar pruebas con una sesión real.
- No publicar una función de evaluación con llamadas a IA sin comprobar previamente autenticación, límites de uso y presupuesto.

## Referencia
Actividad original: «Entrega del proyecto PA203 PA203 project submission» de `b66/pa203/curso-completo-borrador.json`, con seis apartados, caso ficticio Sol Servicios y rúbrica de 100 puntos.
