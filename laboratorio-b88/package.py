from pathlib import Path
import base64,zipfile,json,hashlib
root=Path(__file__).resolve().parent
delivery=root.parent.parent/'b88-entrega';delivery.mkdir(exist_ok=True)
html=(root/'index.html').read_text()
html=html.replace('<link rel="stylesheet" href="styles.css">','<style>'+(root/'styles.css').read_text()+'</style>')
for name in ['engine.js','app.js']:
 html=html.replace(f'<script src="{name}" defer></script>','')
html=html.replace('</body>','<script>'+(root/'engine.js').read_text()+'</script><script>'+(root/'app.js').read_text()+'</script></body>')
for name,mime in [('presentacion.mp4','video/mp4'),('presentacion-poster.jpg','image/jpeg')]:
 if not (root/name).is_file():raise RuntimeError('Falta el recurso '+name)
 html=html.replace('"'+name+'"','"data:'+mime+';base64,'+base64.b64encode((root/name).read_bytes()).decode()+'"')
preview=delivery/'B88_LABORATORIO_VISTA_PREVIA.html';preview.write_text(html)
readme='''B88 · LABORATORIO DE TRABAJO BILINGÜE · REVISIÓN PRIVADA

ABRIR: B88_LABORATORIO_VISTA_PREVIA.html en Chrome, Edge, Safari o Firefox.
El archivo contiene la aplicación y el video; no necesita servidor ni conexión.
Alternativa: extraer el ZIP y abrir laboratorio-b88/index.html conservando los demás archivos en su carpeta.

RECORRIDO: Entrar al primer caso → leer solicitud → completar decisiones → calcular presupuesto → redactar respuesta → resolver extra → leer evaluación.
ES/EN cambia la interfaz sin borrar respuestas. Video en español; transcripción ES/EN.
Exportar informe descarga TXT. Imprimir permite guardar PDF si el navegador lo ofrece.

Es una simulación educativa. No envía mensajes, no crea reservas ni cobra.
La puntuación revisa decisiones e importes. El texto libre no se califica automáticamente.
Las respuestas permanecen en la pestaña y se pierden al cerrarla o recargarla.

Incluye código, criterios y pruebas. Sin cambios en main ni publicación del Laboratorio.
La biblioteca es una ampliación posterior y no forma parte de este piloto.
'''
(delivery/'B88_LEEME.txt').write_text(readme)
manifest={p.name:{'bytes':p.stat().st_size,'sha256':hashlib.sha256(p.read_bytes()).hexdigest()} for p in [preview,root/'presentacion.mp4']}
(delivery/'B88_MANIFIESTO.json').write_text(json.dumps(manifest,indent=2))
archive=delivery/'B88_LABORATORIO_PROYECTO_COMPLETO.zip'
with zipfile.ZipFile(archive,'w',zipfile.ZIP_DEFLATED) as z:
 for p in root.iterdir():
  if p.is_file():z.write(p,'laboratorio-b88/'+p.name)
 for p in [preview,delivery/'B88_LEEME.txt',delivery/'B88_MANIFIESTO.json']:z.write(p,p.name)
 for p in (root.parent/'tests').glob('b88-*.cjs'):z.write(p,'tests/'+p.name)
 z.write(root.parent/'docs/B88_PROYECTO.md','docs/B88_PROYECTO.md')
print('Entregables:',preview.name,preview.stat().st_size,'bytes;',archive.name,archive.stat().st_size,'bytes')
