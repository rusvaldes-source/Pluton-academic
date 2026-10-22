// Cloudflare Pages Function — only deploy after explicit approval.
// Configure PLUTON_SUPABASE_URL and PLUTON_SUPABASE_SERVICE_ROLE_KEY as
// server-side environment variables (the latter as a SECRET, never in Git).
const json=(value,status=200)=>new Response(JSON.stringify(value),{status,headers:{'content-type':'application/json; charset=utf-8','cache-control':'no-store','x-content-type-options':'nosniff'}});
export async function onRequestGet({env,request}){
  const url=new URL(request.url);
  const category=['salud','tecnologia','educacion'].includes(url.searchParams.get('category'))?url.searchParams.get('category'):'salud';
  const lang=url.searchParams.get('lang')==='en'?'en':'es';
  const sources={
    salud:['https://feeds.bbci.co.uk/news/health/rss.xml','https://www.medicalnewstoday.com/rss'],
    tecnologia:['https://feeds.bbci.co.uk/news/technology/rss.xml','https://www.theverge.com/rss/index.xml'],
    educacion:['https://feeds.bbci.co.uk/news/education/rss.xml','https://www.edsurge.com/articles_rss']
  };
  const query={salud:'salud medicina',tecnologia:'tecnología inteligencia artificial',educacion:'educación enseñanza'}[category];
  const google=new URL('https://news.google.com/rss/search');
  google.searchParams.set('q',query+' when:7d');
  google.searchParams.set('hl','es-419');
  google.searchParams.set('gl','US');
  google.searchParams.set('ceid','US:es-419');
  const endpoints=lang==='es'?[google.toString(),...sources[category]]:sources[category];
  const decode=s=>String(s||'').replace(/^<!\[CDATA\[/,'').replace(/\]\]>$/,'').replace(/&(?:amp|quot|apos|lt|gt|#39);/g,m=>({'&amp;':'&','&quot;':'"','&apos;':"'",'&lt;':'<','&gt;':'>','&#39;':"'"})[m]).trim();
  const get=(entry,name)=>{const m=entry.match(new RegExp('<'+name+'(?:\\s[^>]*)?>([\\s\\S]*?)<\\/'+name+'>','i'));return decode(m?.[1]||'')};
  const parse=xml=>{
    const entries=xml.match(/<item\b[^>]*>[\s\S]*?<\/item>/gi)||[];
    return entries.map(entry=>({title:get(entry,'title'),source:get(entry,'source')||get(entry,'dc:creator')||'Fuente externa',link:get(entry,'link')})).filter(x=>x.title&&/^https:\/\//i.test(x.link)).slice(0,12);
  };
  const errors=[];
  for(const endpoint of endpoints){
    try{
      const response=await fetch(endpoint,{headers:{Accept:'application/rss+xml, application/xml, text/xml'},signal:AbortSignal.timeout(7000)});
      if(!response.ok){errors.push('HTTP '+response.status);continue}
      const items=parse(await response.text());
      if(items.length)return json({items,category,lang,source:lang==='es'&&endpoint===google.toString()?'es':'en'});
      errors.push('empty feed');
    }catch(error){errors.push(error instanceof Error?error.name:'unknown')}
  }
  console.error('news feeds failed',category,errors.join(','));
  return json({items:[],error:'News feed unavailable'},502);
}
export async function onRequest({request,env}) {
  if(request.method!=='GET')return json({error:'Method not allowed'},405);
  return onRequestGet({request,env});
}
