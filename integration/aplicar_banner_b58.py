#!/usr/bin/env python3
"""Apply B58 hero and student zone to a local B57 copy, transactionally."""
from pathlib import Path
import shutil, sys, re

base=Path(__file__).resolve().parent
root=Path(sys.argv[1]).resolve() if len(sys.argv)>1 else None
if root is None or not (root/'index.html').is_file() or not (root/'styles.css').is_file():
    raise SystemExit('Uso: python aplicar_banner_b58.py /ruta/copia_B57')
index=root/'index.html'
html=index.read_text(encoding='utf-8')
if '<header>' not in html or '</header>' not in html or '<main id="inicio">' not in html:
    raise SystemExit('Estructura B57 inesperada; no se modificó nada.')
if 'b58-founders-hero' not in html:
    old='src="assets/b57/estudiante-01.webp"'
    oldclass='class="pa-b37-banner pa-b54-banner"'
    if html.count(old)<1 or html.count(oldclass)!=1:
        raise SystemExit('Portada B57 no coincide; no se modificó nada.')
    html=html.replace(old,'src="assets/b58/b58-fundadores-foto.webp"',1)
    html=html.replace(oldclass,'class="pa-b37-banner pa-b54-banner b58-founders-hero"',1)
    html=html.replace('alt="Estudiante con computadora y planeta Plutón"','alt="Fundadores de PLUTÓN ACADEMIC"',1)
if 'assets/b58/b58-hero.css' not in html:
    html=html.replace('</head>','<link rel="stylesheet" href="assets/b58/b58-hero.css?v=2"/>\n</head>',1)
if 'assets/b58/zona-estudiantes-b58.css' not in html:
    html=html.replace('</head>','<link rel="stylesheet" href="assets/b58/zona-estudiantes-b58.css?v=2"/>\n</head>',1)
if 'id="estudiantes"' not in html:
    student=(base.parent/'visual'/'zona-estudiantes-b58.html').read_text(encoding='utf-8')
    anchor='<div aria-label="Accesos de PLUTÓN ACADEMIC"'
    if html.count(anchor)!=1:
        raise SystemExit('Punto de inserción de zona estudiantes inesperado; no se modificó nada.')
    html=html.replace(anchor,student+'\n'+anchor,1)
# Guard navigation and localization. Never rewrite header, scripts or existing course content.
original=index.read_text(encoding='utf-8')
assert re.search(r'<header>.*?</header>',html,re.S).group()==re.search(r'<header>.*?</header>',original,re.S).group()
assert html.count('b58-founders-hero')==1 and html.count('id="estudiantes"')==1
assert 'data-b53-es=' in html and 'data-b53-en=' in html
assets=root/'assets'/'b58'
assets.mkdir(parents=True,exist_ok=True)
for name,source in {
    'b58-fundadores-foto.webp':base/'b58-fundadores-foto.webp',
    'b58-hero.css':base/'b58-hero.css',
    'zona-estudiantes-b58.css':base.parent/'visual'/'zona-estudiantes-b58.css',
}.items():
    if not source.is_file():raise SystemExit(f'Falta recurso: {source}')
    shutil.copy2(source,assets/name)
# Commit HTML last so missing assets cannot leave an incomplete reference.
tmp=index.with_suffix('.html.b58tmp')
tmp.write_text(html,encoding='utf-8')
tmp.replace(index)
print('B58 integrado en copia local: portada + Zona de estudiantes. Menú conservado. Requiere pruebas visuales.')
