import importlib.util
from pathlib import Path
spec = importlib.util.spec_from_file_location('public_build', Path('scripts/build-b108-public.py'))
build = importlib.util.module_from_spec(spec)
spec.loader.exec_module(build)
files = {'acceso.html','app.css','app.js','icon-180.png','icon-192.png','icon-512.png','index.html','instalar.html','lecciones.html','lessons-ui.js','manifest.webmanifest','mis-cursos.html','owned-lessons.js','panel.css','panel.js','signin-core.js','signin-ui.js'}
for name in files:
    assert build.allowed(Path('app-pluton') / name), f'Missing app file: {name}'
for name in ['secret.txt','private.json','unexpected.js','.env','unapproved.html','nested/private.png']:
    assert not build.allowed(Path('app-pluton') / name), f'Unexpected public file: {name}'
print('Publicación limitada a los archivos aprobados de la app')
