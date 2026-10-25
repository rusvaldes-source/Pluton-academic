"""Assemble recovered B107 content outside the public repository; no remote writes."""
import argparse, concurrent.futures, hashlib, json, shutil, subprocess
from pathlib import Path

def main():
    ap=argparse.ArgumentParser();ap.add_argument('--recovered',type=Path,required=True);ap.add_argument('--output',type=Path,required=True);a=ap.parse_args()
    repo=Path(__file__).resolve().parents[1];out=a.output.resolve()
    if out==repo or repo in out.parents:raise SystemExit('Private output must be outside public repository')
    out.mkdir(parents=True,exist_ok=True);recovered=a.recovered.resolve();codes=['ELEC-101','HVAC-101','BEAUTY-101']
    content=recovered/'B107_PARTE_2_CONTENIDO_PRIVADO';welcome=recovered/'B107_03_BIENVENIDAS_ES_EN';audio=recovered/'B107_04_AUDIOS_MODULOS_ES_EN'
    scripts=json.loads((audio/'GUIONES_RECUPERADOS.json').read_text());jobs=[];payloads=[]
    for code in codes:
        payload=json.loads((welcome/'importacion_multimedia'/f'{code}.json').read_text())
        assert payload['code']==code and len(payload['items'])==20 and len(payload['finalExam'])==25
        assert sum(len(x['quiz']) for x in payload['items'])==100
        assert sum(len(x['questions']) for x in payload['moduleAssessments'])==50
        payload['moduleAudio']={};payload['moduleAudioText']={}
        for photo in payload['images']:
            source=content/'importacion/storage'/photo['path'];dest=out/'storage'/photo['path'];dest.parent.mkdir(parents=True,exist_ok=True);shutil.copyfile(source,dest)
        for field in ['welcome','welcomeAudio']:
            for lang in ['es','en']:
                source=welcome/'multimedia'/code/Path(payload[field][lang]).name;dest=out/'storage'/payload[field][lang];dest.parent.mkdir(parents=True,exist_ok=True);shutil.copyfile(source,dest)
        for m in range(1,11):
            payload['moduleAudio'][str(m)]={};payload['moduleAudioText'][str(m)]={}
            for lang in ['es','en']:
                name=f'modulo-{m:02}-{lang}.mp3';path=code+'/audio/'+name
                payload['moduleAudio'][str(m)][lang]=path
                payload['moduleAudioText'][str(m)][lang]=next(x['text'] for x in scripts if x['code']==code and x['module']==m and x['lang']==lang)
                jobs.append((audio/code/name,out/'storage'/path))
        payloads.append(payload)
    def normalize(job):
        source,dest=job;dest.parent.mkdir(parents=True,exist_ok=True)
        result=subprocess.run(['ffmpeg','-v','error','-i',str(source),'-af','loudnorm=I=-18:TP=-3:LRA=11','-codec:a','libmp3lame','-b:a','128k','-f','mp3','pipe:1'],check=True,capture_output=True)
        assert len(result.stdout)>1000
        stage=dest.with_suffix('.stage');stage.write_bytes(result.stdout);stage.replace(dest)
    with concurrent.futures.ThreadPoolExecutor(max_workers=6) as pool:list(pool.map(normalize,jobs))
    for payload in payloads:(out/(payload['code']+'.json')).write_text(json.dumps(payload,ensure_ascii=False,indent=2)+'\n')
    sql='BEGIN;\n'
    for payload in payloads:
        code=payload['code'];literal=json.dumps(payload,ensure_ascii=False).replace("'","''")
        sql+=f"DO $$ BEGIN IF EXISTS(SELECT 1 FROM public.course_premium_content WHERE course_code='{code}') THEN RAISE EXCEPTION 'Existing B107 course; review before replacing'; END IF; END $$;\n"
        sql+=f"INSERT INTO public.course_premium_content(course_code,payload) VALUES ('{code}','{literal}'::jsonb);\n"
    (out/'IMPORTACION_PRIVADA.sql').write_text(sql+'COMMIT;\n')
    entries=[{'path':p.relative_to(out).as_posix(),'bytes':p.stat().st_size,'sha256':hashlib.sha256(p.read_bytes()).hexdigest()} for p in sorted(out.rglob('*')) if p.is_file() and p.name!='INVENTARIO.json']
    assert sum(x['path'].startswith('storage/') for x in entries)==79
    (out/'INVENTARIO.json').write_text(json.dumps(entries,ensure_ascii=False,indent=2)+'\n')
    print(json.dumps({'payloads':len(payloads),'storage_objects':79,'inventory_files':len(entries),'output':str(out)}))

if __name__=='__main__':main()
