"""Plan existing legacy media; metadata only in Git, private bytes outside the repo."""
import argparse, hashlib, json, re, shutil
from pathlib import Path

def manifest(repo):
 rows=[]
 for code,videos in json.loads((repo/'b64/videos.json').read_text()).items():
  for url in videos.values():
   tail=url.split('/storage/v1/object/public/',1)[1];bucket,name=tail.split('/',1)
   rows.append({'course_code':code,'bucket_id':bucket,'object_name':name})
 text=(repo/'ingles-desde-cero/audios-b102.js').read_text();mapping=json.loads(text.split('const mapping=',1)[1].split(';\nconst root=',1)[0])
 samples={'ID001-01-01','ID001-01-02','ID001-01-03','ID001-08-01','ID001-08-02','ID001-08-03'}
 for lesson,records in mapping.items():
  if lesson in samples:continue
  for record in records:
   source=repo/'ingles-desde-cero'/record['file'];name=source.name
   if not source.is_file():raise ValueError('Missing approved recording: '+name)
   rows.append({'course_code':'ID-001','bucket_id':'b108-course-media','object_name':'ID-001/'+name,'source':source.relative_to(repo).as_posix(),'sha256':hashlib.sha256(source.read_bytes()).hexdigest(),'bytes':source.stat().st_size})
 if len(rows)!=93 or len({(r['bucket_id'],r['object_name']) for r in rows})!=93:raise ValueError('Expected 48 existing videos and 45 existing premium recordings')
 return rows

def main():
 ap=argparse.ArgumentParser(description=__doc__);ap.add_argument('--output',type=Path,required=True);args=ap.parse_args();repo=Path(__file__).resolve().parents[1];out=args.output.resolve()
 if out==repo or repo in out.parents:raise SystemExit('Private output must be outside public repo')
 if out.exists():raise SystemExit('Output exists; refusing overwrite')
 rows=manifest(repo);out.mkdir(parents=True)
 for row in rows:
  if 'source' not in row:continue
  dest=out/'storage'/row['object_name'];dest.parent.mkdir(parents=True,exist_ok=True);shutil.copyfile(repo/row['source'],dest)
 (out/'MEDIA_MANIFEST.json').write_text(json.dumps(rows,ensure_ascii=False,indent=2)+'\n')
 print(json.dumps({'videos_in_existing_buckets':48,'private_recordings_copied':45,'output':str(out)}))
if __name__=='__main__':main()
