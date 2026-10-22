// Cloudflare Pages Function — only deploy after explicit approval.
// Configure PLUTON_SUPABASE_URL and PLUTON_SUPABASE_SERVICE_ROLE_KEY as
// server-side environment variables (the latter as a SECRET, never in Git).
const json=(value,status=200)=>new Response(JSON.stringify(value),{status,headers:{'content-type':'application/json; charset=utf-8','cache-control':'no-store','x-content-type-options':'nosniff'}});
export async function onRequestGet({env,request}){
  const base=env.PLUTON_SUPABASE_URL;
  const secret="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBhaWZqenpueWllaHdpZG9xanFiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTExMjkyNzcsImV4cCI6MjEwNjcwNTI3N30.JQTcl818gsTe82y8WYHooEiWWKdJxRNmEbPnk0fkQ10";
  if(!base||!secret)return json({error:'News service not configured'},503);
  let url;
  try{url=new URL(base);if(url.protocol!=='https:'||!url.hostname.endsWith('.supabase.co')||url.username||url.password||url.search||url.hash||url.pathname!=='/')throw Error('Invalid URL')}
  catch{return json({error:'Invalid service configuration'},503)}
  const req=new URL(request.url);
  const limit=Math.min(30,Math.max(1,Number.parseInt(req.searchParams.get('limit')||'12',10)||12));
  const offset=Math.min(1000,Math.max(0,Number.parseInt(req.searchParams.get('offset')||'0',10)||0));
  const endpoint=new URL('/rest/v1/pluton_news',url);
  endpoint.searchParams.set('select','id,title_es,title_en,body_es,body_en,status,published_at,video_url');
  endpoint.searchParams.set('status','eq.published');
  endpoint.searchParams.set('published_at','not.is.null');
  endpoint.searchParams.set('order','published_at.desc');
  endpoint.searchParams.set('limit',String(limit));
  endpoint.searchParams.set('offset',String(offset));
  try{
    const response=await fetch(endpoint,{headers:{apikey:secret,Authorization:'Bearer '+secret,Accept:'application/json'},redirect:'error',signal:AbortSignal.timeout(8000)});
    if(!response.ok)return json({error:'News temporarily unavailable'},502);
    const data=await response.json();
    if(!Array.isArray(data))return json({error:'Unexpected response'},502);
    const clean=data.filter(x=>x&&x.status==='published'&&x.published_at&&x.title_es&&x.title_en).map(x=>({
      id:x.id,title_es:x.title_es,title_en:x.title_en,body_es:x.body_es,body_en:x.body_en,
      status:'published',published_at:x.published_at,video_url:x.video_url
    }));
    return json(clean);
  }catch{return json({error:'News temporarily unavailable'},502)}
}
export async function onRequest({request,env}) {
  if(request.method!=='GET')return json({error:'Method not allowed'},405);
  return onRequestGet({request,env});
}
