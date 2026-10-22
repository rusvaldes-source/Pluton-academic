// Cloudflare Pages Function — only deploy after explicit approval.
// Configure PLUTON_SUPABASE_URL and PLUTON_SUPABASE_SERVICE_ROLE_KEY as
// server-side environment variables (the latter as a SECRET, never in Git).
const json=(value,status=200)=>new Response(JSON.stringify(value),{status,headers:{'content-type':'application/json; charset=utf-8','cache-control':'no-store','x-content-type-options':'nosniff'}});
export async function onRequestGet({env,request}){
  const url=new URL(request.url);
  const category=['salud','tecnologia','educacion'].includes(url.searchParams.get('category'))?url.searchParams.get('category'):'salud';
  const lang=url.searchParams.get('lang')==='en'?'en':'es';
  const terms={salud:['salud medicina','health medicine'],tecnologia:['tecnología inteligencia artificial','technology artificial intelligence'],educacion:['educación enseñanza','education learning']};
  const query=terms[category][lang==='en'?1:0];
  const feed=new URL('https://news.google.com/rss/search');
  feed.searchParams.set('q',query+' when:7d');
  feed.searchParams.set('hl',lang==='en'?'en-US':'es-419');
  feed.searchParams.set('gl','US');
  feed.searchParams.set('ceid',lang==='en'?'US:en':'US:es-419');
  try{
    const response=await fetch(feed,{signal:AbortSignal.timeout(8000)});
    if(!response.ok)return json({items:[],error:'News feed unavailable'},502);
    const xml=await response.text();
    const entries=xml.match(/<item[ >][\s\S]*?<\/item>/g)||[];
    const get=(entry,name)=>{const match=entry.match(new RegExp('<'+name+'(?: [^>]*)?>([\s\S]*?)<\/'+name+'>'));return match?match[1].replace(/^<!\[CDATA\[/,'').replace(/\]\]>$/,'').replace(/&amp;/g,'&').replace(/&quot;/g,'"').replace(/&#39;/g,"'").trim():''};
    const items=entries.map(entry=>({title:get(entry,'title'),source:get(entry,'source'),link:get(entry,'link')})).filter(x=>x.title&&x.link.startsWith('https://')).slice(0,12);
    return json({items});
  }catch(error){console.error('news feed error',error instanceof Error?error.name:'unknown');return json({items:[],error:'News feed unavailable'},502)}

}
export async function onRequest({request,env}) {
  if(request.method!=='GET')return json({error:'Method not allowed'},405);
  return onRequestGet({request,env});
}
