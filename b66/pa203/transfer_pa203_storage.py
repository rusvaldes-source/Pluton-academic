#!/usr/bin/env python3
"""Transfer three existing PA-203 MP4s from checked-out B66 branch to Supabase Storage.
Requires SUPABASE_SERVICE_ROLE_KEY in environment. Never overwrites.
"""
import os, pathlib, urllib.request, urllib.error, sys, subprocess
PROJECT='paifjzznyiehwidoqjqb'
BUCKET='pa203-videos'
FILES=[
 'PA-203_Leccion_01_cc4044a4a2c5c95c4d42eb2175c1a3d1.mp4',
 'PA-203_Leccion_03_b51d75a3472e644708f8c5862407214f.mp4',
 'PA-203_Leccion_04_649c942ce17b0d7c914406c841b70b03.mp4',
]
key=os.environ.get('SUPABASE_SERVICE_ROLE_KEY')
if not key: sys.exit('Missing SUPABASE_SERVICE_ROLE_KEY; no upload performed.')
branch=subprocess.run(['git','branch','--show-current'],capture_output=True,text=True,check=True).stdout.strip()
if branch!='B66-PA203-preparacion': sys.exit('Only B66-PA203-preparacion allowed.')
base=f'https://{PROJECT}.supabase.co/storage/v1/object/{BUCKET}/'
for filename in FILES:
 path=pathlib.Path('b64/videos')/filename
 if not path.is_file() or path.stat().st_size<100000: sys.exit(f'Missing original MP4: {path}')
 url=base+filename
 headers={'Authorization':f'Bearer {key}','apikey':key}
 req=urllib.request.Request(url,headers=headers,method='HEAD')
 try:
  with urllib.request.urlopen(req,timeout=30): print(f'EXISTS, skipped: {filename}');continue
 except urllib.error.HTTPError as e:
  if e.code not in (400,404): sys.exit(f'Existence check failed HTTP {e.code}: {filename}')
 req=urllib.request.Request(url,data=path.read_bytes(),headers={**headers,'Content-Type':'video/mp4','x-upsert':'false'},method='POST')
 try:
  with urllib.request.urlopen(req,timeout=180) as r: print(f'UPLOADED HTTP {r.status}: {filename}')
 except urllib.error.HTTPError as e: sys.exit(f'Upload failed HTTP {e.code}: {filename}')
print('Transfer finished; playback/audio verification still required.')
