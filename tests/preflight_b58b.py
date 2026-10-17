"""Preflight de lectura para B58. No publica ni cambia sistemas externos."""
import json
from pathlib import Path
import sys

root = Path(sys.argv[1]) if len(sys.argv)>1 else Path('/mnt/data/B58_BUILD')
errors=[]
for p in ('RELEASE_READINESS.json','data/membership-pricing-b58.json'):
    if not (root/p).is_file(): errors.append(f'Falta {p}')
if not errors:
    ready=json.loads((root/'RELEASE_READINESS.json').read_text())
    pricing=json.loads((root/'data/membership-pricing-b58.json').read_text())
    expected={'START':(14.99,10.49),'PLUS':(24.99,17.49),'PREMIUM':(39.99,27.99)}
    actual={p['id']:(p['regular_monthly_usd'],p['intro_monthly_usd']) for p in pricing['plans']}
    if actual != expected: errors.append('Precios no coinciden con decisión aprobada')
    if pricing['promotion_months'] != 3 or pricing['discount_percent'] != 30: errors.append('Promoción incorrecta')
    if pricing['billing_status'] != 'connected_and_tested': errors.append('Cobros no conectados y probados')
    if not ready.get('release_ready'): errors.append('B58 no listo para lanzamiento')
    errors.extend(ready.get('blocking_issues',[]))
print(json.dumps({'approved_for_release':not errors,'blockers':errors},ensure_ascii=False,indent=2))
sys.exit(0 if not errors else 1)
