import hashlib, importlib.util, json, tempfile, unittest
from pathlib import Path

class ImportTests(unittest.TestCase):
 def test_verified_original_is_never_overwritten_and_receipt_follows_remote_hash(self):
  path=Path(__file__).resolve().parents[1]/'scripts/import-b108-audio.py'
  self.assertTrue(path.exists(),'safe import script exists')
  spec=importlib.util.spec_from_file_location('importer',path);m=importlib.util.module_from_spec(spec);spec.loader.exec_module(m)
  with tempfile.TemporaryDirectory() as folder:
   package=Path(folder);f=package/'storage/ID-001/approved.mp3';f.parent.mkdir(parents=True);f.write_bytes(b'approved recording')
   sha=hashlib.sha256(f.read_bytes()).hexdigest();row={'bucket_id':'b108-course-media','object_name':'ID-001/approved.mp3','course_code':'ID-001','sha256':sha,'bytes':len(f.read_bytes())};calls=[]
   def request(method,path,body=None,headers=None):
    calls.append(method)
    if method=='GET':return b'approved recording'
    if method=='PATCH':return json.dumps([{'verified_sha256':sha}]).encode()
    raise AssertionError('Existing original must never be overwritten')
   m.import_one(row,package,request);self.assertEqual(calls,['GET','PATCH'])
   calls.clear()
   def wrong(method,path,body=None,headers=None):
    calls.append(method)
    if method=='GET':return b'wrong file'
    raise AssertionError('Mismatch must not be recorded or overwritten')
   with self.assertRaisesRegex(ValueError,'hash'):m.import_one(row,package,wrong)
   self.assertEqual(calls,['GET'])
 def test_missing_file_uploads_without_upsert_then_downloads_and_checks_before_receipt(self):
  path=Path(__file__).resolve().parents[1]/'scripts/import-b108-audio.py';self.assertTrue(path.exists())
  spec=importlib.util.spec_from_file_location('importer',path);m=importlib.util.module_from_spec(spec);spec.loader.exec_module(m)
  with tempfile.TemporaryDirectory() as folder:
   package=Path(folder);f=package/'storage/ID-001/approved.mp3';f.parent.mkdir(parents=True);f.write_bytes(b'approved recording')
   sha=hashlib.sha256(f.read_bytes()).hexdigest();row={'bucket_id':'b108-course-media','object_name':'ID-001/approved.mp3','course_code':'ID-001','sha256':sha,'bytes':len(f.read_bytes())};calls=[];stored=None
   def request(method,path,body=None,headers=None):
    nonlocal stored
    calls.append(method)
    if method=='GET':
     if stored is None:raise m.MissingObject()
     return stored
    if method=='POST':self.assertEqual(headers['x-upsert'],'false');stored=body;return b'{}'
    if method=='PATCH':self.assertEqual(json.loads(body)['verified_sha256'],sha);return json.dumps([{'verified_sha256':sha}]).encode()
   m.import_one(row,package,request);self.assertEqual(calls,['GET','POST','GET','PATCH'])
if __name__=='__main__':unittest.main()
