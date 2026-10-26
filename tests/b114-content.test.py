"""Validate private payloads without putting content or answer keys in public git."""
import json, os, pathlib, unittest
ROOT=pathlib.Path(os.environ.get('B114_PRIVATE',str(pathlib.Path(__file__).resolve().parents[2]/'b114-private')))
class PayloadTests(unittest.TestCase):
 def test_matches_founder_syllabus(self):
  syllabus=json.loads((pathlib.Path(__file__).resolve().parents[1]/"b114/syllabus.json").read_text())
  for approved in syllabus["courses"]:
   c=json.loads((ROOT/"content"/(approved["code"]+".json")).read_text())
   self.assertEqual([(x["id"],x["title"]) for x in c["lessons"]],[(x["id"],x["title"]) for x in approved["lessons"]])

 def test_three_courses_match_approved_structure(self):
  for code,count in [('FA-101',10),('DRV-101',12),('MED-201',12)]:
   with self.subTest(code=code):
    path=ROOT/'content'/f'{code}.json'
    self.assertTrue(path.exists(),f'Missing private course {code}')
    c=json.loads(path.read_text()); self.assertEqual(c['code'],code);self.assertIsNone(c['price']);self.assertEqual(len(c['lessons']),count)
    self.assertEqual(len({l['id'] for l in c['lessons']}),count)
    for l in c['lessons']:
     self.assertEqual(len(l['quiz']),5)
     for field in ['title','summary','explanation','example','audioText','notes_prompt']:
      for lang in ['es','en']: self.assertGreater(len(l[field][lang].strip()),5 if field=='title' else 15,(code,l['number'],field,lang))
     for q in l['quiz']:
      self.assertEqual(len(q['options']['es']),len(q['options']['en']))
      self.assertGreaterEqual(len(q['options']['es']),3)
      self.assertIn(q['answer'],range(len(q['options']['es'])))
      for lang in ['es','en']:
       self.assertGreater(len(q['question'][lang]),10); self.assertTrue(q['feedback'][lang]);self.assertEqual(len(set(q['options'][lang])),len(q['options'][lang]))
     for lang in ['es','en']: self.assertTrue(l['exercise']['prompt'][lang]);self.assertTrue(l['exercise']['feedback'][lang])
     self.assertTrue(l['exercise']['answers']); self.assertTrue(l['sources'])
if __name__=='__main__':unittest.main()
