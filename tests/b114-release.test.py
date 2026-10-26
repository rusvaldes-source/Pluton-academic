"""Exercise the exact proposed integration in a disposable directory, never source/main."""
import hashlib,json,pathlib,runpy,shutil,subprocess,tempfile,unittest
R=pathlib.Path(__file__).resolve().parents[1]
class ReleaseTests(unittest.TestCase):
 def test_patch_preserves_all_old_courses_and_private_build_boundary(self):
  manifest=json.loads((R/'b114/release-manifest.json').read_text());old=json.loads((R/'catalog.json').read_text())
  with tempfile.TemporaryDirectory(prefix='b114-release-') as folder:
   d=pathlib.Path(folder)
   for entry in manifest['existing_files_proposed']:
    f=entry['path'];p=d/f;p.parent.mkdir(parents=True,exist_ok=True);shutil.copyfile(R/f,p);self.assertEqual(hashlib.sha256(p.read_bytes()).hexdigest(),entry['before_sha256'])
   subprocess.run(['git','apply',str(R/'b114/public-integration.patch')],cwd=d,check=True,capture_output=True)
   new=json.loads((d/'catalog.json').read_text());self.assertEqual(new[:len(old)],old);self.assertEqual([c['code'] for c in new[len(old):]],['FA-101','DRV-101','MED-201'])
   for c in new[len(old):]:
    self.assertIsNone(c['price_cents']);self.assertEqual(c['payment_type'],'one_time');self.assertTrue((R/c['cover']).is_file());self.assertNotIn('answer',json.dumps(c));self.assertNotIn('content',json.dumps(c))
   build=runpy.run_path(str(d/'scripts/build-b108-public.py'));allowed=build['allowed']
   for f in ['b114/aula.html','b114/index.html','b114/aula.js','b114/catalog.json','b114/covers/FA-101.webp']:self.assertTrue(allowed(pathlib.Path(f)),f)
   for f in ['scripts/b114-review-entry.js','b114-private/content/FA-101.json','b114-private/media/FA-101/FA-101-L01-es.mp3','database/b114_integration_proposal.sql','B114.zip']:self.assertFalse(allowed(pathlib.Path(f)),f)
   for f in ['app.js','dashboard.js','courses.js','admin/course-editor.js','admin/certificates.js']:subprocess.run(['node','--check',str(d/f)],check=True,capture_output=True)
   for entry in manifest['existing_files_proposed']:self.assertEqual(hashlib.sha256((d/entry['path']).read_bytes()).hexdigest(),entry['after_sha256'])
if __name__=='__main__':unittest.main()
