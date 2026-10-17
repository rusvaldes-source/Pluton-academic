#!/usr/bin/env python3
"""Conservative release gate. Do not treat inventory rows as migrated content."""
import json, pathlib, sys
root=pathlib.Path(__file__).resolve().parents[1]
activities=json.loads((root/'data/activities-b58.json').read_text())
statuses=json.loads((root/'CONTENT_STATUS.json').read_text())
issues=[]
for c in ('PA-203','ID-101','MKT-201','TEC-101','PA-101'):
    entry=next((x for x in statuses if x['course']==c),None)
    if entry is None: issues.append(f'{c}: sin verificación de materiales fuente')
    elif not entry.get('source_assets_verified'): issues.append(f'{c}: archivos fuente no verificados')
for p in ('index.html','styles.css','courses.html','dashboard.html'):
    if not (root/'site'/p).exists(): issues.append(f'Sitio B57 integrado: falta {p}')
if not (root/'qa'/'responsive-visual-approved.json').exists(): issues.append('Sin prueba visual aprobada de escritorio/tableta/móvil')
if not (root/'qa'/'functional-e2e-approved.json').exists(): issues.append('Sin prueba end-to-end de login, navegación, traducción, progreso y certificados')
if not (root/'qa'/'original-student-photo-verified.json').exists(): issues.append('Fotografía original de estudiante sin cotejo confirmado')
result={'release_ready':not issues,'activities_in_inventory':len(activities) if isinstance(activities,list) else None,'blocking_issues':issues}
print(json.dumps(result,ensure_ascii=False,indent=2))
sys.exit(0 if not issues else 2)
