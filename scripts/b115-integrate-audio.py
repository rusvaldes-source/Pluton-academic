"""Build private B115 course packages from approved source and original MP3s.

Never uploads content or deploys a site. Keep all arguments outside a public
checkout: the source JSON includes paid lessons and answer keys.
"""
import argparse, csv, hashlib, importlib.util, json, shutil, zipfile
from pathlib import Path

CODES = ('FAM-101', 'FAM-102', 'PSI-101', 'PSI-102')

def build(source, audio, scripts, output):
    source, audio, scripts, output = map(lambda p: Path(p).resolve(), (source, audio, scripts, output))
    checkout = Path(__file__).resolve().parents[1]
    if output == checkout or checkout in output.parents:
        raise ValueError('Private course output must remain outside the public checkout')
    output.mkdir(parents=True, exist_ok=True)
    spec = importlib.util.spec_from_file_location('original_review', source/'shared/qa/build_review.py')
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    template = module.TEMPLATE
    template = template.replace("img-src data:;", "img-src data:; media-src 'self' file:;")
    template = template.replace("box.replaceChildren();", "box.querySelectorAll('audio').forEach(a=>{a.pause();a.removeAttribute('src');a.load()});box.replaceChildren();")
    marker = "section(tr('Explicación','Explanation'),l.explanation);"
    player = """const media=section(tr('Audio de esta lección','Lesson audio'));const player=el('audio',undefined,media);player.controls=true;player.preload='metadata';player.style.width='100%';player.setAttribute('aria-label',tr('Audio de la lección','Lesson audio'));const audioStatus=el('p',tr('Cargando audio…','Loading audio…'),media);audioStatus.setAttribute('role','status');player.onloadedmetadata=()=>audioStatus.textContent=tr('Audio disponible.','Audio available.');player.onerror=()=>audioStatus.textContent=tr('No se pudo abrir el MP3. Extrae el paquete completo y conserva la carpeta audios.','MP3 unavailable. Extract the complete package and retain the audios folder.');player.src='audios/'+lang+'/'+l.id+'-'+lang+'.mp3';"""
    assert template.count(marker) == 1
    template = template.replace(marker, player+marker)
    workbook_marker = "section(tr('Cuaderno práctico','Practical workbook'),l.notes_prompt);"
    workbook = "const notebook=course.notebooks[Math.floor(index/2)];if(notebook){const wb=el('details');el('summary',loc(notebook.title),wb);el('pre',notebook.text,wb);}for(const guide of course.support_guides||[]){const gd=el('details');el('summary',loc(guide.title),gd);el('p',loc(guide.content),gd);}"
    template = template.replace(workbook_marker, workbook_marker+workbook)
    template = template.replace('questions(course.final_assessment);return', "section(tr('Proyecto de integración','Integration project'),course.final_project);questions(course.final_assessment);return")
    template = template.replace('REVISIÓN PRIVADA', 'AUDIOS INTEGRADOS · VERSIÓN PRIVADA')
    reports = []
    for code in CODES:
        dest = output/code
        shutil.copytree(source/code, dest, dirs_exist_ok=True)
        course = json.loads((dest/'course.json').read_text())
        assert len(course['lessons']) == 15
        course['covers'] = {lang: f'covers/{code}-{lang}.webp' for lang in ('es','en')}
        course['audio_status'] = 'integrated_original_cloned_voices'
        course['audio_voice'] = 'Ruslan clonada' if code in ('FAM-101','PSI-101') else 'Adays clonada'
        manifest = []
        for lesson in course['lessons']:
            for lang in ('es','en'):
                stem = f"{lesson['id']}-{lang}"
                narration = (scripts/code/lang/(stem+'.txt')).read_text().strip()
                assert narration == lesson['narration'][lang].strip(), stem+' narration differs'
                src = audio/code/lang/(stem+'.mp3')
                assert src.is_file() and src.stat().st_size > 1000, stem+' missing MP3'
                target = dest/'audios'/lang/src.name
                target.parent.mkdir(parents=True, exist_ok=True)
                shutil.copy2(src, target)
                # Contract expected by the existing private media loader.
                lesson['audio'][lang] = f'{code}/{stem}.mp3'
                manifest.append({'lesson_id': lesson['id'], 'language': lang,
                    'local_path': f'{code}/audios/{lang}/{stem}.mp3',
                    'storage_bucket': 'b114-course-media', 'storage_path': lesson['audio'][lang],
                    'sha256': hashlib.sha256(src.read_bytes()).hexdigest(), 'size_bytes': src.stat().st_size,
                    'voice': course['audio_voice']})
        (dest/'course.json').write_text(json.dumps(course, ensure_ascii=False, indent=2)+'\n')
        import base64
        covers = {lang: 'data:image/webp;base64,'+base64.b64encode((dest/'covers'/f'{code}-{lang}.webp').read_bytes()).decode() for lang in ('es','en')}
        data = json.dumps(course,ensure_ascii=False).replace('<','\\u003c')
        (dest/'REVISAR.html').write_text(template.replace('__DATA__',data).replace('__COVERS__',json.dumps(covers)))
        (dest/'AUDIO_IMPORT_MANIFEST.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n')
        (dest/'LEEME_AUDIO_INTEGRADO.md').write_text(
            '# B115 — audios integrados\n\nExtrae todo el ZIP y abre REVISAR.html. Selecciona una lección y el idioma; el reproductor usa su MP3 original. Se detiene el audio anterior al cambiar de lección o idioma. Las portadas ES/EN están incluidas.\n\n'
            'course.json contiene las 30 rutas privadas para el cargador existente. AUDIO_IMPORT_MANIFEST.json relaciona cada archivo local con su destino privado y SHA256. Esta entrega no sube recursos ni modifica producción. Nunca publiques este paquete ni sus respuestas en un repositorio o almacenamiento público.\n\n'
            'Se conserva el contenido aprobado, las preguntas, cuadernos y examen final. Los videos siguen pendientes; no se inventaron enlaces. El estado de borrador y la constancia manual permanecen como en el original.\n')
        entries = sorted(p for p in dest.rglob('*') if p.is_file() and p.name!='INVENTARIO.csv')
        with (dest/'INVENTARIO.csv').open('w') as f:
            w=csv.writer(f);w.writerow(['archivo','bytes','sha256'])
            for p in entries:w.writerow([p.relative_to(output),p.stat().st_size,hashlib.sha256(p.read_bytes()).hexdigest()])
        entries=sorted(p for p in dest.rglob('*') if p.is_file())
        assert len(entries)<=100
        package=output/f'B115_{code}_INTEGRADO_ES_EN_30_AUDIOS.zip'
        with zipfile.ZipFile(package,'w',zipfile.ZIP_DEFLATED) as z:
            for p in entries:z.write(p,p.relative_to(output))
        reports.append({'course':code,'audios':len(manifest),'files':len(entries),'zip':package.name,'sha256':hashlib.sha256(package.read_bytes()).hexdigest()})
    (output/'INTEGRACION_AUDIO_RESULTADOS.json').write_text(json.dumps({'courses':reports,'total_audio':120,'production_modified':False},indent=2)+'\n')
    print(json.dumps(reports,indent=2))

if __name__=='__main__':
    p=argparse.ArgumentParser();p.add_argument('--source',required=True);p.add_argument('--audio',required=True);p.add_argument('--scripts',required=True);p.add_argument('--output',required=True);a=p.parse_args();build(a.source,a.audio,a.scripts,a.output)
