"""Import existing B108 recordings, never overwrite, verify downloaded SHA-256 before receipt."""
import argparse, hashlib, json, os, re
from pathlib import Path
from urllib.error import HTTPError
from urllib.parse import quote, urlencode
from urllib.request import Request, urlopen

class MissingObject(Exception):pass

def validated_bytes(row,package):
 if row.get('bucket_id')!='b108-course-media' or row.get('course_code')!='ID-001' or not re.fullmatch(r'ID-001/[A-Za-z0-9_-]+\.mp3',row.get('object_name','')):raise ValueError('Invalid recording path')
 data=(package/'storage'/row['object_name']).read_bytes()
 if hashlib.sha256(data).hexdigest()!=row['sha256'] or len(data)!=row['bytes']:raise ValueError('Local hash or size mismatch')
 return data

def import_one(row,package,request):
 data=validated_bytes(row,package);name=row['object_name'];object_path='/storage/v1/object/'+row['bucket_id']+'/'+quote(name,safe='/')
 try:remote=request('GET',object_path)
 except MissingObject:
  request('POST',object_path,data,{'content-type':'audio/mpeg','x-upsert':'false'})
  remote=request('GET',object_path)
 if hashlib.sha256(remote).hexdigest()!=row['sha256'] or len(remote)!=row['bytes']:raise ValueError('Remote hash or size mismatch; original preserved')
 filters=urlencode({'bucket_id':'eq.'+row['bucket_id'],'object_name':'eq.'+name,'expected_sha256':'eq.'+row['sha256']})
 receipt=request('PATCH','/rest/v1/b108_media_assets?'+filters,json.dumps({'verified_sha256':row['sha256']}).encode(),{'content-type':'application/json','Prefer':'return=representation'})
 result=json.loads(receipt)
 if not isinstance(result,list) or len(result)!=1 or result[0].get('verified_sha256')!=row['sha256']:raise ValueError('Verification receipt not recorded')
 return name

def main():
 ap=argparse.ArgumentParser(description=__doc__);ap.add_argument('--package',type=Path,required=True);ap.add_argument('--apply',action='store_true',help='Upload missing originals and record remote verification; default is local validation only');args=ap.parse_args()
 package=args.package.resolve();rows=[r for r in json.loads((package/'MEDIA_MANIFEST.json').read_text()) if r.get('course_code')=='ID-001']
 if len(rows)!=45 or len({r['object_name'] for r in rows})!=45:raise SystemExit('Expected 45 distinct original recordings')
 for row in rows:validated_bytes(row,package)
 if not args.apply:print(json.dumps({'verified_local_originals':45,'remote_writes':False}));return
 # Reuse existing server-side credentials, never put them in command arguments or output.
 base=os.environ.get('PLUTON_SUPABASE_URL','').rstrip('/');key=os.environ.get('PLUTON_SERVICE_ROLE_KEY','')
 if base!='https://paifjzznyiehwidoqjqb.supabase.co' or not key:raise SystemExit('Existing trusted server credentials required')
 def request(method,path,body=None,headers=None):
  req=Request(base+path,data=body,method=method,headers={'Authorization':'Bearer '+key,'apikey':key,**(headers or {})})
  try:
   with urlopen(req,timeout=90) as result:return result.read()
  except HTTPError as error:
   if method=='GET' and error.code==404:raise MissingObject() from None
   raise RuntimeError('Remote request failed, HTTP '+str(error.code)+'; no overwrite attempted') from None
 for row in rows:print(json.dumps({'verified_original':import_one(row,package,request)}))
 print(json.dumps({'verified_remote_originals':45,'originals_replaced':0}))
if __name__=='__main__':main()
