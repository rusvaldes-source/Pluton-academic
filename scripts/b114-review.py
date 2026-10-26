"""Private local review only. Never deploy this server or private package.
Run: python3 scripts/b114-review.py --private ../b114-private --port 8765
No production credentials, payment requests, or Supabase mutations are used.
"""
import argparse,json,mimetypes,pathlib,re
from http.server import BaseHTTPRequestHandler,ThreadingHTTPServer
from urllib.parse import urlsplit,unquote,parse_qs
REPO=pathlib.Path(__file__).resolve().parents[1]
CODES={'FA-101':10,'DRV-101':12,'MED-201':12}
def main():
 p=argparse.ArgumentParser();p.add_argument('--private',default=str(REPO.parent/'b114-private'));p.add_argument('--port',type=int,default=8765);a=p.parse_args();private=pathlib.Path(a.private).resolve();progress={}
 class Handler(BaseHTTPRequestHandler):
  def log_message(self,*args):pass
  def safe(self):
   hosts={f'127.0.0.1:{a.port}',f'localhost:{a.port}'}
   origin=self.headers.get('Origin');return self.headers.get('Host') in hosts and (not origin or urlsplit(origin).netloc in hosts)
  def send(self,data,typ='text/plain; charset=utf-8',status=200):
   self.send_response(status);self.send_header('Content-Type',typ);self.send_header('Content-Length',str(len(data)));self.send_header('Cache-Control','no-store');self.send_header('X-Content-Type-Options','nosniff');self.send_header('X-Robots-Tag','noindex, nofollow');self.send_header('Content-Security-Policy',"default-src 'self'; script-src 'self'; style-src 'self'; media-src 'self'; img-src 'self'; connect-src 'self'; frame-ancestors 'none'");self.end_headers();self.wfile.write(data)
  def do_GET(self):
   if not self.safe():return self.send(b'Local review only',status=403)
   u=urlsplit(self.path);path=unquote(u.path);query=parse_qs(u.query)
   if path in ('/','/b114/'):path='/b114/index.html'
   match=re.fullmatch(r'/__review__/content/(FA-101|DRV-101|MED-201)\.json',path)
   if match:return self.file(private/'content'/(match[1]+'.json'))
   if path=='/__review__/progress':return self.send(json.dumps(progress.get(query.get('course',[''])[0],[])).encode(),'application/json')
   if path=='/b114/review-entry.js':return self.file(REPO/'scripts/b114-review-entry.js')
   match=re.fullmatch(r'/__review__/media/(FA-101|DRV-101|MED-201)/([A-Za-z0-9_-]+\.(?:mp3|mp4))',path)
   if match:
    if not match[2].startswith(match[1]+'-'):return self.send(b'Wrong course prefix',status=403)
    return self.file(private/'media'/match[1]/match[2])
   allowed={'/styles.css','/b67/aula.css','/b70/aula.css'}
   if path in allowed:return self.file(REPO/path.lstrip('/'))
   if re.fullmatch(r'/b114/(?:index\.html|aula\.html|aula\.js|progress\.js|classroom\.css|catalog\.js|catalog\.json|covers/(?:FA-101|DRV-101|MED-201)\.webp)',path):
    target=REPO/path.lstrip('/')
    if path.endswith('/aula.html'):
     html=target.read_text().replace('<script src="../supabase-2.117.3.js"></script>','').replace('<script src="media.js"></script>','').replace('<script src="load.js"></script>','<script src="review-entry.js"></script>').replace('href="../index.html"','href="index.html"');return self.send(html.encode(),'text/html; charset=utf-8')
    return self.file(target)
   return self.send(b'Not found',status=404)
  def do_POST(self):
   if not self.safe() or urlsplit(self.path).path!='/__review__/progress':return self.send(b'Forbidden',status=403)
   try:
    size=int(self.headers.get('Content-Length','0'));assert 0<size<=2000;data=json.loads(self.rfile.read(size));code=data['course_code'];assert code in CODES and data['user_id']=='b114-review-owner' and type(data['lesson_number']) is int and 1<=data['lesson_number']<=CODES[code] and type(data['completed']) is bool
    rows=progress.setdefault(code,[]);rows[:]=[x for x in rows if x['lesson_number']!=data['lesson_number']];rows.append({'lesson_number':data['lesson_number'],'completed':data['completed']});return self.send(b'{"ok":true}','application/json')
   except (AssertionError,ValueError,KeyError,TypeError):return self.send(b'Invalid review progress',status=400)
  def file(self,path):
   if not path.is_file():return self.send(b'Resource pending',status=404)
   return self.send(path.read_bytes(),mimetypes.guess_type(str(path))[0] or 'application/octet-stream')
 print(f'PRIVATE LOCAL REVIEW ONLY: http://127.0.0.1:{a.port}/b114/',flush=True)
 ThreadingHTTPServer(('127.0.0.1',a.port),Handler).serve_forever()
if __name__=='__main__':main()
