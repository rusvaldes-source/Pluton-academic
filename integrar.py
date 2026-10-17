from pathlib import Path
import sys,shutil
s=Path(__file__).resolve().parent
if len(sys.argv)!=2:raise SystemExit('Uso: python integrar.py RUTA_COPIA_B57')
r=Path(sys.argv[1]);p=r/'index.html'
if not p.exists() or not (r/'styles.css').exists():raise SystemExit('Se requiere una copia completa de B57-Prueba')
h=p.read_text(encoding='utf-8')
if 'b59-founders' not in h:
 if h.count('src="assets/b57/estudiante-01.webp"')!=1:raise SystemExit('Portada inesperada; no se modifica')
 h=h.replace('src="assets/b57/estudiante-01.webp"','src="assets/b59/b58-fundadores-foto.webp"',1).replace('class="pa-b37-banner pa-b54-banner"','class="pa-b37-banner pa-b54-banner b59-founders"',1).replace('alt="Estudiante con computadora y planeta Plutón"','alt="Fundadores de PLUTÓN ACADEMIC"',1)
if 'b59.css' not in h:h=h.replace('</head>','<link rel="stylesheet" href="assets/b59/b59.css">\n</head>',1)
if 'id="estudiantes"' not in h:
 a='<div aria-label="Accesos de PLUTÓN ACADEMIC"'
 if a not in h:raise SystemExit('Ancla estudiantes no encontrada')
 h=h.replace(a,(s/'visual/zona-estudiantes-b58.html').read_text(encoding='utf-8')+'\n'+a,1)
if 'id="b59-redes"' not in h:
 h=h.replace('</footer>','<div id="b59-redes" aria-label="Redes sociales"><strong>Síguenos / Follow us</strong><div class="b59-items" id="b59-items"></div></div></footer>',1)
if 'b59-social.js' not in h:h=h.replace('</body>','<script src="assets/b59/b59-social.js" defer></script></body>',1)
a=r/'assets/b59';a.mkdir(parents=True,exist_ok=True)
for n,src in {'b58-fundadores-foto.webp':s/'integration/b58-fundadores-foto.webp','b59.css':s/'b59.css','b59-social.js':s/'b59-social.js','social-links.json':s/'social/social-links.json'}.items():shutil.copy2(src,a/n)
for f in (s/'admin').iterdir():
 d=r/'admin'/f.name;d.parent.mkdir(exist_ok=True);shutil.copy2(f,d)
backup=r/'index.html.b59-backup'
if not backup.exists():shutil.copy2(p,backup)
p.write_text(h,encoding='utf-8')
print('Integración aplicada a copia local. Pendientes URLs de redes, Supabase y pruebas visuales.')
