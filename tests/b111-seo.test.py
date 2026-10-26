import unittest, pathlib, xml.etree.ElementTree as ET, subprocess, tempfile, json
from html.parser import HTMLParser
ROOT=pathlib.Path(__file__).resolve().parents[1]
BASE="bbf92b03291f810e00de36fa06e4cf5f3b060f23"
PAGES={"index.html":"/", "biblioteca/index.html":"/biblioteca/", "herramientas/index.html":"/herramientas/"}
class Head(HTMLParser):
 def __init__(self,text):
  super().__init__();self.meta={};self.canonical=[];self.feed(text)
 def handle_starttag(self,tag,attrs):
  a=dict(attrs)
  if tag=="meta":self.meta[a.get("name",a.get("property"))]=a.get("content")
  if tag=="link" and a.get("rel")=="canonical":self.canonical.append(a["href"])
class SEO(unittest.TestCase):
 def test_sitemap(self):
  doc=ET.parse(ROOT/"sitemap.xml");ns={"s":"http://www.sitemaps.org/schemas/sitemap/0.9"}
  urls=[x.text for x in doc.findall("s:url/s:loc",ns)]
  self.assertEqual(set(urls),{"https://www.plutonacademic.com"+p for p in PAGES.values()});self.assertEqual(len(urls),3)
  for name in PAGES:self.assertNotIn("noindex",Head((ROOT/name).read_text()).meta.get("robots",""))
 def test_public_metadata_and_preserved_body(self):
  for name,url in PAGES.items():
   with self.subTest(page=name):
    text=(ROOT/name).read_text();head=Head(text)
    self.assertEqual(head.canonical,["https://www.plutonacademic.com"+url])
    self.assertTrue(head.meta.get("description"));self.assertEqual(head.meta.get("og:url"),head.canonical[0])
    before=subprocess.check_output(["git","show",BASE+":"+name],cwd=ROOT,text=True)
    self.assertEqual(text.split("<body",1)[1],before.split("<body",1)[1])
 def test_public_build_keeps_search_files(self):
  with tempfile.TemporaryDirectory() as temp:
   source=pathlib.Path(temp)/"source";source.mkdir();out=pathlib.Path(temp)/"public"
   (source/"index.html").write_text("<!doctype html><title>Test</title>")
   (source/"catalog.json").write_text("[]")
   for name in ["robots.txt","sitemap.xml"]:(source/name).write_bytes((ROOT/name).read_bytes())
   result=subprocess.run(["python3",str(ROOT/"scripts/build-b108-public.py"),"--source",str(source),"--output",str(out)],capture_output=True,text=True)
   self.assertEqual(result.returncode,0,result.stderr)
   for name in ["robots.txt","sitemap.xml"]:self.assertEqual((out/name).read_bytes(),(ROOT/name).read_bytes())
 def test_robots_and_private_exclusion(self):
  robots=(ROOT/"robots.txt").read_text();self.assertIn("User-agent: *",robots);self.assertIn("Sitemap: https://www.plutonacademic.com/sitemap.xml",robots)
  self.assertNotIn("Disallow: /",robots)
  headers=(ROOT/"_headers").read_text()
  for route in ["/dashboard", "/dashboard.html", "/reset-password", "/reset-password.html", "/courses", "/courses.html", "/admin/*", "/b107/*", "/noticias/*"]:
   self.assertIn(route+"\n  X-Robots-Tag: noindex",headers)
  self.assertIn("noindex,nofollow",(ROOT/"noticias/index.html").read_text())
if __name__=="__main__":unittest.main()
