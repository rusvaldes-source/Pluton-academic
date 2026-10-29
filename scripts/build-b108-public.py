"""Build a public-only Pages directory without deleting or overwriting source files."""
import argparse, hashlib, json, re, shutil
from pathlib import Path

ENTRIES = {'index.html','courses.html','dashboard.html','aula-b64.html','reset-password.html',
 'support/index.html','admin/index.html','certificados/verificar/index.html','noticias/index.html',
 'biblioteca/index.html','ingles-desde-cero/index.html','herramientas/index.html',
 'b66/pa203/pa203-prueba.html','b67/id101/index.html','b68/mkt201/index.html',
 'b70/na101/index.html','b70/comp101/index.html','b82/pa101/index.html','b107/index.html','b114/index.html','b114/aula.html'}
JS_DIRS = {'b114','admin','b107','b108','b95','b67','b70','b82/pa101','b66/pa203','assets/b59','recursos-pluton','biblioteca','herramientas','noticias','certificados/verificar','support','b84','b75'}
ENGLISH_JS = {'content.js','access.js','syllabus.js','syllabus-view.js','audios-b102.js'}
PUBLIC_JSON = {'b114/catalog.json','b114/syllabus.json','herramientas/products.json','herramientas/commerce-config.json','assets/b59/social-links.json','social-links.json','social/social-links.json'}
PUBLIC_MEDIA = {'PLUTON_BIENVENIDA_EN.mp4','PLUTON_BIENVENIDA_ES.mp4','biblioteca/presentacion.mp4','ingles-desde-cero/presentacion.mp4',
 'ingles-desde-cero/clips/airport.mp4','ingles-desde-cero/clips/hotel.mp4','ingles-desde-cero/clips/transport.mp4'}
SAMPLES = {f'ingles-desde-cero/audios/ID001-{lesson}-{lang}{suffix}.mp3'
 for lesson in ('01-01','01-02','01-03','08-01','08-02','08-03') for lang in ('es','en') for suffix in ('','-apoyo')
 if (not suffix or lesson.startswith('08-') and lang=='es') and not (lesson=='08-03' and lang=='en')}
IMAGE_ROOTS = {'b114','assets','b75','b70','b107','biblioteca','ingles-desde-cero'}
# Only these app files are intended for the public deployment.
APP_FILES = {f'app-pluton/{name}' for name in (
 'acceso.html','app.css','app.js','icon-180.png','icon-192.png','icon-512.png',
 'index.html','instalar.html','lecciones.html','lessons-ui.js','manifest.webmanifest',
 'mis-cursos.html','owned-lessons.js','panel.css','panel.js','signin-core.js','signin-ui.js')}


def allowed(path):
 name=path.as_posix(); parent=path.parent.as_posix(); ext=path.suffix.lower()
 if name in ENTRIES|PUBLIC_JSON|PUBLIC_MEDIA|SAMPLES|{'_headers','robots.txt','sitemap.xml','favicon.ico','integration/b58-fundadores-foto.webp','social/social-links.js'}: return True
 if any(p.startswith('.') or p in {'node_modules','dist','tests','documentation','database','docs','scripts','originales','originals'} for p in path.parts):return False
 if name in APP_FILES:return True
 if ext=='.js':
  if len(path.parts)==1:return path.name not in {'sites-worker.js'}
  return parent in JS_DIRS or parent=='ingles-desde-cero' and path.name in ENGLISH_JS or name=='b64/aula.js'
 if ext=='.css':return len(path.parts)==1 or parent in JS_DIRS|{'b64'}
 if ext in {'.png','.jpg','.jpeg','.webp','.svg','.woff','.woff2','.ttf','.ico'}:
  return len(path.parts)==1 or path.parts[0] in IMAGE_ROOTS
 if ext=='.vtt':return name.startswith(('ingles-desde-cero/','biblioteca/'))
 return False

def catalog_projection(courses):
 if not isinstance(courses,list):raise ValueError('Expected course list')
 keys=('code','cover','es','en','category','classroom','description','price_cents','currency','payment_type','video_policy')
 result=[]
 for course in courses:
  if not course.get('classroom'):raise ValueError('A classroom route is required; no public inline-course fallback')
  public={key:course[key] for key in keys if key in course}
  public['lessons']=[{key:lesson[key] for key in ('id','es','en') if key in lesson} for lesson in course.get('lessons',[])]
  result.append(public)
 return result

def main():
 parser=argparse.ArgumentParser(description=__doc__);parser.add_argument('--source',type=Path,default=Path(__file__).resolve().parents[1]);parser.add_argument('--output',type=Path,required=True);args=parser.parse_args()
 source=args.source.resolve();out=args.output.resolve()
 if out==source or out in source.parents or (source in out.parents and source/'dist' not in out.parents):raise SystemExit('Output must be outside source or in a new dist subdirectory')
 if out.exists():raise SystemExit('Output already exists; choose a new path. Originals are never overwritten.')
 original_catalog=json.loads((source/'catalog.json').read_text())
 public_catalog=catalog_projection(original_catalog)
 if not (source/'index.html').is_file():raise SystemExit('Missing homepage')
 out.mkdir(parents=True)
 for p in sorted(source.rglob('*')):
  if p.is_symlink() or not p.is_file():continue
  rel=p.relative_to(source)
  if allowed(rel):
   dest=out/rel;dest.parent.mkdir(parents=True,exist_ok=True);shutil.copyfile(p,dest)
 (out/'catalog.json').write_text(json.dumps(public_catalog,ensure_ascii=False,indent=2)+'\n')
 # The existing free Daily Challenge already used this limited question bank.
 # Keep that public feature separate from full lesson bodies and five-item quizzes.
 daily=[]
 for course in original_catalog:
  questions=[]
  for lesson in course.get('lessons',[]):
   options=lesson.get('options',{});question=lesson.get('question',{});answer=lesson.get('answer')
   if all(question.get(lang) and isinstance(options.get(lang),list) and len(options[lang])>=2 for lang in ('es','en')) and isinstance(answer,int) and not isinstance(answer,bool) and all(0<=answer<len(options[lang]) for lang in ('es','en')):
    questions.append({key:lesson[key] for key in ('question','options','answer')})
  if questions:daily.append({'code':course['code'],'lessons':questions})
 (out/'b108').mkdir(exist_ok=True)
 (out/'b108/daily-questions.json').write_text(json.dumps(daily,ensure_ascii=False,indent=2)+'\n')
 (out/'404.html').write_text('<!doctype html><html lang="es"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>PLUTÓN ACADEMIC</title><h1>Contenido no disponible / Content unavailable</h1><p>Abre los materiales desde tu curso. / Open materials from your course.</p><a href="/">PLUTÓN ACADEMIC</a></html>')
 inventory=[{'path':p.relative_to(out).as_posix(),'bytes':p.stat().st_size,'sha256':hashlib.sha256(p.read_bytes()).hexdigest()} for p in sorted(out.rglob('*')) if p.is_file()]
 print(json.dumps({'output':str(out),'files':len(inventory),'courses':len(public_catalog),'lessons':sum(len(c['lessons']) for c in public_catalog),'inventory':inventory},ensure_ascii=False))
if __name__=='__main__':main()
