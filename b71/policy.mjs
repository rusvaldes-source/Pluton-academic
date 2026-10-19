export function canLoadAds(config,consent,pathname){
 let path;try{path=decodeURIComponent(new URL(pathname,'https://preview.invalid').pathname).toLowerCase()}catch{return false}
 const publicPath=['/b71/public/','/actualidad/','/recursos/'].some(p=>path.startsWith(p));
 return publicPath&&['enabled','activationAuthorized','accountApproved','policyReviewed','cmpReady'].every(k=>config[k]===true)&&/^ca-pub-\d{16}$/.test(config.publisherId||'')&&consent?.advertising===true;
}
export function linkModel(provider,lang){
 const sponsored=provider.affiliate?.enabled===true&&provider.affiliate?.approved===true&&provider.affiliate?.activationAuthorized===true;
 const raw=sponsored?provider.affiliate.url:provider.url;let url;
 try{url=new URL(raw);if(url.protocol!=='https:'||url.username||url.password||!provider.allowedHosts.includes(url.hostname)||url.port)return null}catch{return null}
 return {href:url.href,sponsored,rel:sponsored?'sponsored nofollow noopener noreferrer':'noopener noreferrer',disclosure:sponsored?(lang==='en'?'Affiliate link: we may earn a commission on qualifying purchases.':'Enlace de afiliado: podemos recibir una comisión por compras elegibles.'):(lang==='en'?'External provider · no affiliate link active.':'Proveedor externo · sin enlace de afiliado activo.')};
}
export function estimate({views,rpm,clickRate,conversionRate,commission}){
 if(![views,rpm,clickRate,conversionRate,commission].every(x=>Number.isFinite(x)&&x>=0)||clickRate>1||conversionRate>1)throw Error('Invalid assumptions');
 const ads=views/1000*rpm,affiliates=views*clickRate*conversionRate*commission;return {ads,affiliates,total:ads+affiliates};
}
