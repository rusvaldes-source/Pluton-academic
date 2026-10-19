import {estimate} from './policy.mjs';
const ids=['views','rpm','clickRate','conversionRate','commission'];
function render(){try{const v=Object.fromEntries(ids.map(k=>[k,Number(document.getElementById(k).value)]));v.clickRate/=100;v.conversionRate/=100;const r=estimate(v);for(const k of ['ads','affiliates','total'])document.getElementById(k).textContent=new Intl.NumberFormat('es-US',{style:'currency',currency:'USD'}).format(r[k]);document.getElementById('modelStatus').textContent='Escenario hipotético bruto; no es una promesa ni una medición de ingresos.'}catch{document.getElementById('modelStatus').textContent='Revisa los supuestos: usa valores no negativos y porcentajes entre 0 y 100.'}}
for(const id of ids)document.getElementById(id).addEventListener('input',render);render();
