from pathlib import Path
from html import escape
import json
root=Path(__file__).parent
modules=[
('Primer contacto con el inglés','Saludar y decir el nombre con apoyo visual.',['Hola y mi nombre','Abecedario: letras y nombres','Deletrea tu nombre']),
('Números y datos personales','Reconocer y comunicar cantidades, edades y números de teléfono.',['Números del 0 al 20','Números del 21 al 100 y precios sencillos','Mi edad y mi número de teléfono']),
('Personas y el verbo to be','Usar I, you, he, she, we, they y am/is/are en presentaciones breves.',['Yo soy: I am','Tú eres y otras personas','Preguntas y negaciones con be']),
('Construye tus primeras oraciones','Relacionar persona, verbo y complemento; nombrar objetos y posesiones.',['Persona + verbo + complemento','A/an, objetos y plurales sencillos','My, your y pertenencias']),
('Verbos de todos los días','Describir acciones frecuentes y necesidades básicas.',['Have, need, want, like','Rutinas con I/you/we/they','He/she y la terminación -s']),
('Pregunta, responde y pide ayuda','Hacer preguntas básicas y señalar que no se comprende.',['Do y does en preguntas','Don’t y doesn’t en negaciones','What, where, when y pedir repetición']),
('Compras y comida','Consultar precios, elegir productos y pedir comida con cortesía.',['How much y cantidades sencillas','Quiero pedir: I would like','Pagar, agradecer y aclarar una compra']),
('Viajes: aeropuerto, hotel y transporte','Pedir ayuda, localizar servicios y comunicar una reserva.',['En el aeropuerto: equipaje, puerta y ayuda','En el hotel: llegada, reserva y salida','Taxi, autobús y direcciones sencillas']),
('Citas, ayuda y servicios cotidianos','Pedir una cita, comprender información básica y solicitar repetición.',['Solicitar una cita y decir día y hora','En una recepción o farmacia: pedir información','No entiendo: repetir, hablar despacio y confirmar']),
('Comunícate en situaciones cotidianas','Integrar lo aprendido en conversaciones breves, con repetición si hace falta.',['Del aeropuerto al hotel: conversación guiada','Compras, comida y una cita: casos breves','Conversación final y plan de práctica'])]
course={'code':'ID-001','code_status':'provisional','title_es':'Inglés desde cero: comunicación para la vida diaria','title_en':'English from Zero: Everyday Communication','version':'B89','status':'draft_for_review','public':False,'replaces_id101':False,'modules':[{'category':i+1,'title':m[0],'goal':m[1],'lessons':[{'id':f'ID001-{i+1:02d}-{j+1:02d}','title':x,'status':'content_pending' if i or j else 'lesson_text_draft_ready'} for j,x in enumerate(m[2])]} for i,m in enumerate(modules)],'video_status':'scripts_only_no_renders_requested','initial_teaching_languages':['es','en'],'additional_language_support':'visual English pathway to be designed; no other-language teaching claimed','commercial_status':'separate_one_time_purchase_confirmed_price_pending','pricing_proposal':{'currency':'USD','launch_price':10.99,'later_price_to_evaluate':19.99,'price_approved':False,'checkout_enabled':False,'membership_included':False}}
(root/'curso-id001.json').write_text(json.dumps(course,ensure_ascii=False,indent=2))
lesson='''# ID001-01-01 · Hola y mi nombre

Estado: primera lección en borrador. Público: adulto principiante absoluto. Texto y guion preparados; audio/video y revisión docente pendientes. Código ID-001 provisional. No sustituye ID-101.

Objetivo: saludar, decir el nombre y preguntar el nombre de otra persona en una interacción apoyada de 20–30 segundos. No se presupone conocimiento previo.

## Cuatro expresiones
Hello. — Hola.
My name is Ana. — Mi nombre es Ana.
What’s your name? — ¿Cómo te llamas?
Nice to meet you. — Mucho gusto.

Sustituye Ana por tu nombre real. Un nombre propio no necesita traducirse. La meta es comunicar con claridad, no imitar un acento perfecto. No usar una escritura española inventada como única guía de pronunciación: escuchar audio inglés revisado y repetir.

## Ejemplo original
Ana: Hello. My name is Ana. What’s your name?
Sam: Hello, Ana. My name is Sam.
Ana: Nice to meet you, Sam.
Sam: Nice to meet you, Ana.

## Guion para el avatar aprobado · 2–3 minutos aproximados según pausas
[ES, ritmo tranquilo] Bienvenido a Inglés desde cero de Plutón Academic. No necesitas saber inglés para empezar. Hoy vamos a saludar y decir nuestro nombre. Escucha primero. Después tendrás una pausa para repetir.
[EN, articulación natural y clara] Hello.
[ES] Significa hola. Escucha otra vez.
[EN] Hello.
[PAUSA 3 segundos — rótulo: Tu turno / Your turn]
[ES] Para decir tu nombre, usa esta expresión.
[EN] My name is Ana.
[ES] Mi nombre es Ana. En tu práctica, cambia Ana por tu nombre.
[EN] My name is Ana.
[PAUSA 4 segundos — rótulo: My name is _____.]
[ES] Para preguntar el nombre de otra persona, escucha esta pregunta.
[EN] What’s your name?
[ES] Significa: ¿cómo te llamas? Escucha y repite.
[EN] What’s your name?
[PAUSA 4 segundos]
[ES] Y cuando conoces a alguien, puedes decir:
[EN] Nice to meet you.
[ES] Significa mucho gusto. Repite cuando termine la frase.
[EN] Nice to meet you.
[PAUSA 4 segundos]
[ES] Ahora escucha una conversación corta. Yo diré las frases de Ana. Las frases de Sam aparecerán en pantalla para que otra voz aprobada o una pista de audio revisada pueda completarlas. No generar una segunda voz en esta fase.
[EN] Hello. My name is Ana. What’s your name?
[PAUSA — respuesta del estudiante con su nombre]
[EN] Nice to meet you.
[ES] Ahora practica tú. Saluda, di tu nombre y pregunta el nombre de otra persona. Puedes repetir esta lección tantas veces como necesites. En la siguiente, comenzaremos el abecedario para aprender a deletrear tu nombre. Tu futuro comienza con conocimiento.

Nota de producción: las instrucciones entre corchetes son indicaciones de edición y no se leen. Grabar segmentos ES/EN claros con el avatar aprobado del fundador; conservar look y encuadre. Verificar la pronunciación inglesa antes de integrar. Reutilizar una voz existente solo si su salida inglesa resulta adecuada; no crear ni contratar una voz nueva sin revisarlo. La duración se verificará con el montaje real, no se promete a partir del número de palabras.

## Práctica guiada
1. Escucha Hello y repítelo tres veces con pausas.
2. Completa en voz alta: My name is _____.
3. Pregunta: What’s your name?
4. Cierra con: Nice to meet you.
5. Practica con una persona o tú mismo, cambiando los nombres.

## Comprensión · cinco comprobaciones
1. ¿Cuál sirve para saludar? A) Hello. B) Goodbye. C) Thank you. Correcta: A. Hello inicia un saludo; Goodbye sirve para despedirse.
2. ¿Cómo dices tu nombre? A) Nice to meet you. B) My name is José. C) What’s your name? Correcta: B. Cambia José por tu nombre; no hace falta traducirlo.
3. What’s your name? pregunta: A) El precio. B) La hora. C) El nombre. Correcta: C.
4. Completa: My _____ is Ana. A) name B) hello C) meet. Correcta: A.
5. Nice to meet you significa: A) Hasta mañana. B) Mucho gusto. C) No comprendo. Correcta: B.

Las preguntas comprueban reconocimiento, no acreditan pronunciación ni conversación. Registrar aparte una práctica oral con una lista de autoevaluación: saludo identificable; nombre comprensible; pregunta con intención clara; despedida cordial. Una evaluación de pronunciación automática no está implementada.

## Si necesitas apoyo
Puedes señalar el rótulo, escuchar nuevamente, repetir una frase por vez y usar nombres de tu entorno. El acceso visual en inglés para quien no comprende español debe probarse con usuarios y contar con instrucciones simples e imágenes revisadas. El curso no se presenta como ya traducido a otros idiomas.
'''
(root/'ID001_LECCION_01.md').write_text(lesson)
rows=''.join(f'<tr><td>{i+1}</td><td><strong>{escape(m[0])}</strong><p>{escape(m[1])}</p></td><td>'+''.join(f'<p>{j+1}. {escape(t)}</p>' for j,t in enumerate(m[2]))+'</td></tr>' for i,m in enumerate(modules))
html='''<!doctype html><html lang="es"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>B89 · Inglés desde cero · Proyecto</title><style>*{box-sizing:border-box}body{margin:0;background:#eef2f6;color:#152a40;font:16px/1.65 system-ui,sans-serif}main{max-width:1100px;margin:auto;padding:30px 24px 60px}header{background:#0c213a;color:#faf8f1;border-top:5px solid #d3b16b;border-radius:10px;padding:28px}header small{color:#dfc689;letter-spacing:.1em}h1{font-size:34px;line-height:1.2}h2{font-size:24px}section{background:white;border:1px solid #d4dfe8;border-radius:10px;margin-top:22px;padding:25px}.scroll{overflow:auto}table{width:100%;border-collapse:collapse}th,td{vertical-align:top;text-align:left;padding:14px;border-bottom:1px solid #d4dfe8;font-size:14px}th{background:#edf1f5}td p{margin:5px 0}.notice{border-left:4px solid #bc933d;padding:12px 18px;background:#fff7e6}pre{white-space:pre-wrap;overflow-wrap:anywhere;font:14px/1.7 system-ui,sans-serif}.phrases{display:grid;grid-template-columns:1fr 1fr;gap:12px}.phrases p{padding:18px;background:#eef2f6;margin:0}.phrases b{display:block;color:#123853;font-size:19px}a{color:#194e84}@media(max-width:600px){main{padding:18px 14px}header,section{padding:20px}h1{font-size:28px}.phrases{grid-template-columns:1fr}th,td{padding:10px}}@media print{body{background:white}section{break-inside:auto}h2{break-after:avoid}tr{break-inside:avoid}}</style><main><header><small>PLUTÓN ACADEMIC · B89 · BORRADOR PARA REVISIÓN</small><h1>Inglés desde cero</h1><p>Comunicación para la vida diaria · ID-001, código provisional</p></header><section><h2>Una ruta para empezar sin conocimientos</h2><p>Curso general para adultos, independiente de ID-101 Inglés para el Trabajo. Diez categorías internas y treinta lecciones breves propuestas. La primera lección tiene texto, práctica, cinco comprobaciones y guion; las otras veintinueve aún requieren desarrollo.</p><p class="notice">Objetivo: construir comunicación elemental paso a paso. Las categorías 1–10 no equivalen a niveles oficiales ni garantizan fluidez. Se tomarán como referencia descriptores iniciales Pre-A1 y A1; afirmar un nivel requiere revisar cobertura y comprobar habilidades, incluida comprensión y expresión oral.</p></section><section><h2>Diez categorías · programa propuesto</h2><div class="scroll"><table><thead><tr><th>Categoría</th><th>Objetivo</th><th>Tres lecciones propuestas</th></tr></thead><tbody>'''+rows+'''</tbody></table></div></section><section><h2>Cómo funcionará cada lección</h2><p>Video corto con el avatar existente → explicación clara → ejemplos originales → repetición con pausas → práctica escrita y oral → cinco comprobaciones con explicación → repaso acumulativo.</p><p>La duración orientativa por lección es de 10–20 minutos entre video y práctica, ajustable tras probarla. El video se divide en segmentos si la carga resulta alta para principiantes. Subtítulos ES/EN, velocidad natural clara y transcripción accesible.</p><p>Primera ruta: apoyo en español y práctica en inglés. Para una persona que no comprende español, preparar instrucciones inglesas muy simples y apoyo visual; comprobar esa experiencia antes de anunciar acceso adecuado para cualquier lengua materna. No presuponer el idioma de una persona por su origen o nacionalidad.</p></section><section><h2>Primera muestra: Hello. My name is…</h2><div class="phrases"><p><b>Hello.</b>Hola.</p><p><b>My name is Ana.</b>Mi nombre es Ana.</p><p><b>What’s your name?</b>¿Cómo te llamas?</p><p><b>Nice to meet you.</b>Mucho gusto.</p></div><p>Al terminar, la persona debe intentar una interacción apoyada de 20–30 segundos: saludar, decir su nombre y preguntar el de otra persona.</p><details><summary>Leer la lección completa y el guion</summary><pre>'''+escape(lesson)+'''</pre></details></section><section><h2>Escenarios que pidió el propietario</h2><p>Aeropuerto, hotel y otros lugares de la vida diaria. Las frases útiles aparecerán con apoyo desde el inicio y luego se practicarán en conversaciones completas. Las situaciones no se limitan al trabajo.</p><div class="phrases"><p><b>Where is baggage claim?</b>¿Dónde se recoge el equipaje?</p><p><b>I have a reservation under the name Valdés.</b>Tengo una reserva a nombre de Valdés.</p><p><b>What time is check-out?</b>¿A qué hora es la salida del hotel?</p><p><b>Could you speak slowly, please?</b>¿Podría hablar despacio, por favor?</p></div><p>También: restaurante, supermercado, taxi, autobús, pedir direcciones y solicitar una cita. Los temas iniciales de tiempos pasados y futuros se dejan para una ampliación posterior, sin recargar esta ruta de iniciación.</p></section><section><h2>Producción y revisión</h2><ol><li>Revisar esta ruta y probar la primera lección con un principiante absoluto.</li><li>Ajustar ritmo, instrucciones y ejercicios a partir de esa prueba.</li><li>Reutilizar avatar y voz existentes para el primer video; verificar pronunciación inglesa y encuadre.</li><li>Completar una categoría de tres lecciones antes de producir las treinta.</li><li>Revisar audio, subtítulos, accesibilidad, ejercicios y progreso antes de presentar una versión para publicación.</li></ol><p>No se solicitaron renders de video nuevos para este borrador. No se publican contenidos, no se modifica ID-101, no se activa precio ni matrícula. Las dos prácticas adicionales y tres guías de B88 siguen como trabajo previsto; este curso no las sustituye.</p></section><section><h2>Referencia pedagógica</h2><p>El Consejo de Europa incorpora descriptores Pre-A1, y el British Council describe A1 mediante habilidades observables en situaciones sencillas. Aquí se usan para orientar el diseño; los ejemplos y ejercicios de esta propuesta son originales y no se presenta afiliación o acreditación.</p><p><a href="https://www.coe.int/en/web/common-european-framework-reference-languages/cefr-descriptors-search">Consejo de Europa · descriptores</a><br><a href="https://learnenglish.britishcouncil.org/level/understand-your-level/a1-elementary">British Council · habilidades A1</a></p></section></main></html>'''
html=html.replace('</main></html>','<section><h2>Precio: investigación y propuesta · 20 de octubre de 2026</h2><p>El propietario indicó cobro separado mediante pago único y sugirió US$10.99 como ejemplo. El importe no está aprobado ni activado. Recomendación: probar US$10.99 para el curso completo de iniciación, una vez terminado; evaluar US$19.99 posteriormente con datos de compras, finalización y costos. No cobrar US$10.99 por cada categoría.</p><table><tr><th>Referencia</th><th>Oferta observada</th><th>Diferencias</th></tr><tr><td>USA Learns</td><td>Gratis; curso inicial con 20 unidades y videos</td><td>Competencia gratuita directa para principiantes.</td></tr><tr><td>Espresso English · Everyday English Speaking Level 1</td><td>US$45; 45 lecciones y acceso permanente según su página</td><td>Preintermedio/intermedio; incluye comentarios docentes sobre expresión oral. No es equivalente al curso de Plutón.</td></tr></table><p>El precio propuesto es una hipótesis comercial, no un promedio del mercado ni demanda comprobada. Plutón debe aportar una ruta clara con apoyo en español, práctica en aeropuerto/hotel y ejercicios originales. No se incluye tutoría individual ilimitada en esta propuesta.</p><p>Para vender: completar las 30 lecciones, videos revisados, ejercicios y guía práctica; decidir duración del acceso y condiciones. Ofrecer la primera lección gratis. No anunciar un descuento contra US$19.99 mientras ese precio no haya sido real.</p><p>100 compras a US$10.99 = US$1,099 brutos; 100 a US$19.99 = US$1,999 brutos. Ejemplos aritméticos, no previsiones. Faltan comisiones de la procesadora por escoger, producción, alojamiento, soporte, publicidad, devoluciones e impuestos aplicables. Equilibrio: costos fijos / (precio menos costo variable por compra), redondeado hacia arriba. Sin esos costos no puede afirmarse rentabilidad.</p><p><a href="https://www.usalearns.org/1st-free-online-english-course">USA Learns · oferta gratuita</a><br><a href="https://courses.espressoenglish.net/everyday-english-speaking-courses/">Espresso English · precio y contenido</a></p><p>Sin publicación, sin checkout y sin selección de procesadora. Curso independiente de membresías e ID-101.</p></section>'+'</main></html>')
(root/'B89_INGLES_DESDE_CERO_PROYECTO.html').write_text(html)
print('B89 preparado: programa de 30 lecciones, primera lección completa en borrador y guion; sin renders ni publicación.')
