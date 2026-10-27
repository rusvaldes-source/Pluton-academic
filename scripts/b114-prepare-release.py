"""Prepare a reviewable integration patch; never writes existing source or deploys.
Prices and Stripe setup are intentionally pending. New-course purchase calls stay blocked.
"""
import difflib,hashlib,json,pathlib
ROOT=pathlib.Path(__file__).resolve().parents[1]
def main():
 changes={}
 def replace(file,old,new):
  original=changes.get(file,(ROOT/file).read_text());assert original.count(old)==1,(file,old);changes[file]=original.replace(old,new)
 extra="'FA-101','DRV-101','MED-201'"
 replace('admin/course-editor.js',"'COMP-101','ID-001'];","'COMP-101','ID-001',"+extra+"];")
 replace('admin/certificates.js',"'COMP-101','ID-001']);","'COMP-101','ID-001',"+extra+"]);")
 replace('scripts/build-b108-public.py',"'b107/index.html'}","'b107/index.html','b114/index.html','b114/aula.html'}")
 replace('scripts/build-b108-public.py',"JS_DIRS = {'admin'","JS_DIRS = {'b114','admin'")
 replace('scripts/build-b108-public.py',"PUBLIC_JSON = {'herramientas/products.json'","PUBLIC_JSON = {'b114/catalog.json','b114/syllabus.json','herramientas/products.json'")
 replace('scripts/build-b108-public.py',"IMAGE_ROOTS = {'assets'","IMAGE_ROOTS = {'b114','assets'")
 replace('dashboard.js','function classroomURL(code,lesson=0){return',"function classroomURL(code,lesson=0){if(["+extra+"].includes(code))return 'b114/aula.html?course='+encodeURIComponent(code)+'&lesson='+lesson+'&lang='+dashboardLang();return")
 replace('dashboard.js','card.append(title,link)',"if(["+extra+"].includes(code)){const photo=document.createElement('img');photo.src='b114/covers/'+code+'.webp';photo.alt=title.textContent;photo.style.cssText='display:block;width:100%;aspect-ratio:16/9;object-fit:cover;border-radius:10px';card.append(photo)}card.append(title,link)")
 # Preserve the existing visual and checkout paths for every old course.
 old='"BEAUTY-101":"b107/covers/belleza-banner-aprobado.webp"'
 new=old+','+','.join('"'+c+'":"b114/covers/'+c+'.webp"' for c in ['FA-101','DRV-101','MED-201'])
 replace('courses.js',old,new)
 replace('app.js',"async function purchaseCourse(code) {","async function purchaseCourse(code) {\n  if (["+extra+"].includes(String(code).toUpperCase())) return show('PLUTÓN ACADEMIC', '<p>Precio y habilitación de venta pendientes de aprobación. / Price and sales activation awaiting approval.</p>');")
 replace('app.js',"  const professionalEnglish =", "  if (["+extra+"].includes(safeCode)) return show(safeCode, '<p>Precio pendiente de aprobación. / Price awaiting approval.</p>');\n  const professionalEnglish =")
 data=json.loads((ROOT/'catalog.json').read_text());before=len(data);new=json.loads((ROOT/'b114/catalog.json').read_text());syllabus=json.loads((ROOT/'b114/syllabus.json').read_text())
 for c in new:
  assert not any(x['code']==c['code'] for x in data)
  s=next(x for x in syllabus['courses'] if x['code']==c['code']);data.append({'code':c['code'],'cover':'b114/'+c['cover'],'es':c['title']['es'],'en':c['title']['en'],'category':'profesional' if c['code']=='DRV-101' else 'salud','classroom':'b114/aula.html?course='+c['code'],'price_cents':None,'currency':'usd','payment_type':'one_time','publication_status':'pending_approval','lessons':[{'id':l['id'],'es':l['title']['es'],'en':l['title']['en']} for l in s['lessons']]})
 changes['catalog.json']=json.dumps(data,ensure_ascii=False,indent=2)+'\n'
 patch=''.join(''.join(difflib.unified_diff((ROOT/f).read_text().splitlines(True),s.splitlines(True),fromfile='a/'+f,tofile='b/'+f,n=1 if f=='catalog.json' else 3)) for f,s in changes.items())
 dest=ROOT/'b114/public-integration.patch';dest.write_text(patch)
 (ROOT/'b114/release-manifest.json').write_text(json.dumps({'version':'B114','base_commit':'510fe3fa3ce9e00528f0200a8c6418ce35e17bb2','applied':False,'existing_courses':before,'new_courses':3,'existing_files_proposed':[{'path':f,'before_sha256':hashlib.sha256((ROOT/f).read_bytes()).hexdigest(),'after_sha256':hashlib.sha256(s.encode()).hexdigest()} for f,s in changes.items()],'publication_gates':['Founder approval','Professional review','Approved new prices and separate Stripe product configuration','Authorized staging Auth/Storage/purchase end-to-end tests'],'new_course_sales':'blocked until separately approved; existing Stripe code untouched beyond new-code-only UI guard'},ensure_ascii=False,indent=2)+'\n')
 print('Prepared integration patch for',len(changes),'existing files; none modified.')
if __name__=='__main__':main()
