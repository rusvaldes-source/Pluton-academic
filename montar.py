#!/usr/bin/env python3
"""Proyecto PLUTÓN: validar y montar únicamente con voz y alineación aprobadas.
No realiza solicitudes de red ni modifica B56. Python 3.10+, FFmpeg y FFprobe.
"""
import argparse, json, math, pathlib, subprocess, tempfile, textwrap, sys

ROOT = pathlib.Path(__file__).resolve().parent

def run(args, capture=False):
    result = subprocess.run([str(x) for x in args], capture_output=capture, text=capture)
    if result.returncode:
        raise RuntimeError((result.stderr or 'Falló FFmpeg/FFprobe') if capture else 'Falló el montaje')
    return result.stdout if capture else ''

def probe(path):
    return json.loads(run(['ffprobe','-v','error','-show_format','-show_streams','-of','json',path],True))

def timestamp(sec):
    ms=round(sec*1000); return f'{ms//3600000:02}:{ms//60000%60:02}:{ms//1000%60:02},{ms%1000:03}'

def srt(cues, language):
    return '\n\n'.join(f'{i+1}\n{timestamp(c["start"])} --> {timestamp(c["end"])}\n'+
                     '\n'.join(textwrap.wrap(c[language],42,break_long_words=False))
                     for i,c in enumerate(cues))+'\n'

def ass(cues,language):
    def time(t):
        cent=round(t*100);return f'{cent//360000:01}:{cent//6000%60:02}:{cent//100%60:02}.{cent%100:02}'
    header='''[Script Info]
ScriptType: v4.00+
PlayResX: 1920
PlayResY: 1080
WrapStyle: 2
ScaledBorderAndShadow: yes
[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Default,DejaVu Sans,44,&H00FFFFFF,&H00FFFFFF,&H00101010,&H80000000,0,0,0,0,100,100,0,0,3,8,0,2,160,160,65,1
[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
'''
    rows=[]
    for c in cues:
        text='\\N'.join(textwrap.wrap(c[language],42,break_long_words=False))
        rows.append(f'Dialogue: 0,{time(c["start"])},{time(c["end"])},Default,,0,0,0,,{text}')
    return header+'\n'.join(rows)+'\n'

def local_file(relative):
    path=(ROOT/relative).resolve()
    if not path.is_relative_to(ROOT): raise ValueError('Los recursos deben estar dentro del proyecto')
    return path

def validate(plan, language, production=False):
    errors=[]; warnings=[]
    if plan['resolution']!=[1920,1080] or plan['fps']!=25: errors.append('Formato no autorizado')
    if len(plan['scenes'])==0: errors.append('No hay escenas')
    position=0
    for scene in plan['scenes']:
        if abs(scene['start']-position)>0.001: errors.append('Escenas discontinuas: '+scene['id'])
        if scene['end']<=scene['start']: errors.append('Duración inválida: '+scene['id'])
        position=scene['end']
        for lang in ['es','en']:
            frame=local_file(scene['frame'][lang])
            if not frame.is_file(): errors.append('Falta imagen: '+str(frame.relative_to(ROOT)))
    if position!=plan['duration']: errors.append('La duración no coincide')
    music=local_file(plan['music'])
    if not music.is_file(): errors.append('Falta la música original')
    else:
        info=probe(music);audio=[s for s in info['streams'] if s['codec_type']=='audio']
        if abs(float(info['format']['duration'])-plan['duration'])>.04:
            errors.append('Música incompleta o duración distinta al montaje')
        if len(audio)!=1 or int(audio[0]['sample_rate'])!=48000 or audio[0].get('channels')!=2:
            errors.append('La música debe ser estéreo a 48 kHz')
    alignment=json.loads(local_file(f'locucion/alineacion_{language}.json').read_text())
    if not alignment.get('verified_against_audio'): warnings.append('Sincronía final no revisada contra la voz')
    if not alignment.get('voice_rights_confirmed'): warnings.append('Falta autorización de uso de la voz grabada')
    canonical={c['id']:c for c in plan['cues']}
    cues=alignment['cues']; previous=0
    if [c['id'] for c in cues]!=list(canonical): errors.append('La alineación debe incluir todos los subtítulos, en orden')
    for c in cues:
        if c['id'] not in canonical: continue
        ref=canonical[c['id']]; scene=next(s for s in plan['scenes'] if s['id']==ref['scene'])
        if c['start']<previous or c['end']<=c['start'] or c['start']<scene['start'] or c['end']>scene['end']:
            errors.append('Tiempos inválidos: '+c['id'])
        previous=c['end']
        for lang in ['es','en']:
            if c[lang]!=ref[lang]: errors.append('Texto distinto al guion: '+c['id'])
            lines=textwrap.wrap(c[lang],42,break_long_words=False)
            if len(lines)>2: errors.append('Más de dos líneas: '+c['id']+' '+lang)
            if len(c[lang])/(c['end']-c['start'])>20: errors.append('Subtítulo demasiado rápido: '+c['id']+' '+lang)
    missing=[]; checked_audio=[]
    for scene in plan['scenes']:
        path=local_file(f'locucion/{language}/{scene["id"]}.wav')
        if not path.is_file(): missing.append(str(path.relative_to(ROOT))); continue
        info=probe(path); streams=[s for s in info['streams'] if s['codec_type']=='audio']
        duration=float(info['format']['duration'])
        max_len=scene['end']-scene['start']-scene['voice_offset']-0.45
        if len(streams)!=1: errors.append('Debe haber una pista de voz: '+path.name)
        if duration>max_len+0.04: errors.append(f'Voz demasiado larga: {path.name} ({duration:.2f}s; máximo {max_len:.2f}s)')
        if duration<0.5: errors.append('Voz demasiado corta: '+path.name)
        result=subprocess.run(['ffmpeg','-hide_banner','-i',str(path),'-af','volumedetect','-f','null','-'],capture_output=True,text=True)
        import re
        mean=re.search(r'mean_volume: ([-\w.]+) dB',result.stderr)
        if not mean or mean.group(1)=='-inf' or float(mean.group(1))<-38:
            errors.append('Audio ausente o demasiado bajo: '+path.name)
        checked_audio.append({'file':str(path.relative_to(ROOT)),'duration':duration})
    warnings.extend('Falta grabación: '+x for x in missing)
    if production:
        if missing: errors.append('No se exporta sin todas las voces')
        if not alignment.get('verified_against_audio'): errors.append('Revise la alineación y marque verified_against_audio=true')
        if not alignment.get('voice_rights_confirmed'): errors.append('Confirme los derechos de la voz en la alineación')
    return {'errors':errors,'pending':warnings,'voices_checked':checked_audio,
            'ready_for_mp4':not errors and not warnings,'duration':plan['duration'],
            'scenes':len(plan['scenes']),'cues':len(cues),'language':language},alignment

def render(plan,language,burn=False):
    report,alignment=validate(plan,language,True)
    if report['errors']: print(json.dumps(report,ensure_ascii=False,indent=2));return 2
    output=ROOT/'salida'; output.mkdir(exist_ok=True)
    with tempfile.TemporaryDirectory(prefix='pluton_montaje_') as name:
        tmp=pathlib.Path(name); videos=[]
        for index,scene in enumerate(plan['scenes']):
            length=scene['end']-scene['start']; frame=local_file(scene['frame'][language]); clip=tmp/f'{index:02}.mp4'
            fade=f'fade=t=in:st=0:d=0.3,fade=t=out:st={length-0.3}:d=0.3'
            if scene['movement']=='photo':
                # Movimiento mínimo sobre la composición completa, dentro de márgenes seguros.
                frames=round(length*25)
                vf=f"scale=3840:2160,zoompan=z='1+0.014*on/{frames}':x='iw/2-iw/zoom/2':y='ih/2-ih/zoom/2':d=1:s=1920x1080:fps=25,{fade},format=yuv420p"
            else: vf='scale=1920:1080,'+fade+',format=yuv420p'
            run(['ffmpeg','-v','error','-y','-loop','1','-framerate','25','-i',frame,'-vf',vf,'-t',length,
                 '-an','-c:v','libx264','-preset','medium','-crf','18','-r','25','-threads','2',clip])
            videos.append(clip)
        concat=tmp/'clips.txt'; concat.write_text('\n'.join("file '"+str(p)+"'" for p in videos))
        picture=tmp/'picture.mp4';run(['ffmpeg','-v','error','-y','-f','concat','-safe','0','-i',concat,'-c','copy',picture])
        args=['ffmpeg','-v','error','-y']; filters=[]; inputs=[]
        for i,scene in enumerate(plan['scenes']):
            args+=['-i',local_file(f'locucion/{language}/{scene["id"]}.wav')]
            delay=round((scene['start']+scene['voice_offset'])*1000)
            filters.append(f'[{i}:a]aresample=48000,aformat=channel_layouts=stereo,loudnorm=I=-18:TP=-2:LRA=7,adelay={delay}|{delay},apad[v{i}]')
            inputs.append(f'[v{i}]')
        filters.append(''.join(inputs)+f'amix=inputs={len(inputs)}:normalize=0:duration=longest,atrim=0:{plan["duration"]}[voice]')
        voice=tmp/'voice.wav';args+=['-filter_complex',';'.join(filters),'-map','[voice]','-t',plan['duration'],'-c:a','pcm_s24le',voice];run(args)
        mix=tmp/'mix.wav'
        fc=f'[0:a]volume=0.20[music];[1:a]asplit=2[dry][key];[music][key]sidechaincompress=threshold=0.02:ratio=5:attack=20:release=450[bed];[bed][dry]amix=inputs=2:normalize=0,loudnorm=I=-16:TP=-1.5:LRA=9,aresample=48000,atrim=0:{plan["duration"]}[mix]'
        run(['ffmpeg','-v','error','-y','-i',local_file(plan['music']),'-i',voice,'-filter_complex',fc,'-map','[mix]','-c:a','pcm_s24le',mix])
        for lang in ['es','en']:
            (output/f'{plan["slug"]}_{language.upper()}_sub_{lang}.srt').write_text(srt(alignment['cues'],lang),encoding='utf-8')
        es=output/f'{plan["slug"]}_{language.upper()}_sub_es.srt';en=output/f'{plan["slug"]}_{language.upper()}_sub_en.srt'
        mp4=output/f'{plan["slug"]}_{language.upper()}{"_SUB_FIJOS" if burn else ""}.mp4'
        args=['ffmpeg','-v','error','-y','-i',picture,'-i',mix,'-i',es,'-i',en,'-map','0:v','-map','1:a','-map','2:s','-map','3:s']
        if burn:
            sub=output/f'{plan["slug"]}_{language.upper()}_sub_{language}.ass'
            sub.write_text(ass(alignment['cues'],language),encoding='utf-8')
            # Rutas propias generadas; ejecución sin shell. Escapado de la sintaxis de filtros.
            escaped=str(sub).replace('\\','/').replace(':','\\:').replace("'","\\'")
            fonts=str(ROOT/'assets').replace('\\','/').replace(':','\\:').replace("'","\\'")
            args+=['-vf',f"ass='{escaped}':fontsdir='{fonts}'",'-c:v','libx264','-preset','medium','-crf','18','-threads','2']
        else: args+=['-c:v','copy']
        args+=['-c:a','aac','-b:a','192k','-ar','48000','-c:s','mov_text',
               '-metadata:s:a:0','language='+('spa' if language=='es' else 'eng'),
               '-metadata:s:s:0','language=spa','-metadata:s:s:0','title=Español',
               '-metadata:s:s:1','language=eng','-metadata:s:s:1','title=English',
               '-disposition:s:0','default' if language=='es' and not burn else '0',
               '-disposition:s:1','default' if language=='en' and not burn else '0',
               '-t',plan['duration'],'-movflags','+faststart',mp4];run(args)
        info=probe(mp4);video=next(s for s in info['streams'] if s['codec_type']=='video');audio=next(s for s in info['streams'] if s['codec_type']=='audio');subs=[s for s in info['streams'] if s['codec_type']=='subtitle']
        if (video['width'],video['height'])!=(1920,1080) or len(subs)!=2 or int(audio['sample_rate'])!=48000:
            raise RuntimeError('La verificación del contenedor final falló')
        if abs(float(info['format']['duration'])-plan['duration'])>0.12: raise RuntimeError('Duración final incorrecta')
        report.update({'output':mp4.name,'container_verified':True,'streams':info['streams'],
                       'human_release_check':'Escuchar la locución completa y revisar sincronía, mezcla e imagen antes de aprobar publicación.'})
        (output/f'QA_{language}.json').write_text(json.dumps(report,ensure_ascii=False,indent=2))
        print('Exportado con voz y dos pistas de subtítulos: '+str(mp4));return 0

def main():
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('action',choices=['validar','render']);parser.add_argument('--idioma',choices=['es','en'],default='es')
    parser.add_argument('--quemar',action='store_true',help='Fija los subtítulos del idioma de voz en la imagen')
    args=parser.parse_args();plan=json.loads((ROOT/'timeline.json').read_text(encoding='utf-8'))
    if args.action=='validar':
        report,_=validate(plan,args.idioma);print(json.dumps(report,ensure_ascii=False,indent=2));return 1 if report['errors'] else 0
    return render(plan,args.idioma,args.quemar)

if __name__=='__main__':
    try: sys.exit(main())
    except (ValueError,RuntimeError,FileNotFoundError) as error: print(str(error),file=sys.stderr);sys.exit(2)
