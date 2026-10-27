// Isolated support assistant prototype. Not deployed or linked to production.
// Requires OPENAI_API_KEY, SUPABASE_URL and SUPABASE_ANON_KEY as server secrets.
// No privileged database access, payments, account modifications, or ticket writes.
const allowedOrigins = new Set(["https://plutonacademic.com","https://www.plutonacademic.com"]);
const faq = [
  {topic:"access",es:"Para entrar a un curso comprado, inicia sesión con el correo de la compra y abre Mis compras. Si no aparece, crea una solicitud de soporte sin compartir contraseñas ni datos bancarios.",en:"Sign in with the purchase email and open My Purchases. If the course is missing, submit a support request without sharing passwords or bank details."},
  {topic:"password",es:"Utiliza la opción Restablecer contraseña del Centro de ayuda y revisa tu correo, incluida la carpeta de spam.",en:"Use Reset Password in the Help Center and check your email, including spam."},
  {topic:"media",es:"Si no se reproduce un audio o video, revisa tu conexión, vuelve a cargar la lección y prueba otro navegador. Si persiste, informa el curso y la lección exactos.",en:"If audio or video does not play, check your connection, reload the lesson and try another browser. If it persists, report the course and exact lesson."},
  {topic:"billing",es:"Si tienes un problema con un cobro, no compartas números de tarjeta. Envía una solicitud de soporte para revisión humana.",en:"For billing issues, do not share card numbers. Submit a support request for human review."}
];
Deno.serve(async req => {
  const origin=req.headers.get("origin")||"";
  const cors=allowedOrigins.has(origin)?{"Access-Control-Allow-Origin":origin,"Vary":"Origin"}:{};
  const headers={...cors,"Content-Type":"application/json","Cache-Control":"no-store"};
  if(req.method==="OPTIONS") return new Response(null,{status:allowedOrigins.has(origin)?204:403,headers:{...headers,"Access-Control-Allow-Headers":"authorization,apikey,content-type","Access-Control-Allow-Methods":"POST"}});
  if(req.method!=="POST" || !allowedOrigins.has(origin)) return new Response(JSON.stringify({error:"Not allowed"}),{status:403,headers});
  const auth=req.headers.get("authorization")||"";
  if(!auth.startsWith("Bearer ")) return new Response(JSON.stringify({error:"Authentication required"}),{status:401,headers});
  const url=Deno.env.get("SUPABASE_URL"),anon=Deno.env.get("SUPABASE_ANON_KEY");
  if(!url||!anon) return new Response(JSON.stringify({error:"Service not configured"}),{status:503,headers});
  const userResponse=await fetch(url+"/auth/v1/user",{headers:{"apikey":anon,"Authorization":auth}});
  if(!userResponse.ok) return new Response(JSON.stringify({error:"Invalid session"}),{status:401,headers});
  let body;try{body=await req.json()}catch{return new Response(JSON.stringify({error:"Invalid JSON"}),{status:400,headers})}
  const message=typeof body?.message==="string"?body.message.trim():"";
  const lang=body?.lang==="en"?"en":"es";
  if(!message||message.length>1000) return new Response(JSON.stringify({error:"Message must be 1–1000 characters"}),{status:400,headers});
  const key=Deno.env.get("OPENAI_API_KEY");
  if(!key) return new Response(JSON.stringify({answer:lang==="es"?"El asistente inteligente aún no está configurado. Puedes utilizar el Centro de ayuda para crear una solicitud.":"The AI assistant is not configured yet. You can submit a request through the Help Center.",escalate:true,configured:false}),{headers});
  const controller=new AbortController();const timeout=setTimeout(()=>controller.abort(),12000);
  try{
    const instructions="You are PLUTÓN ACADEMIC's bilingual student support assistant. Answer in "+(lang==="es"?"Spanish":"English")+". Use ONLY the verified FAQ below; if insufficient, say you cannot confirm and recommend a support ticket. Never claim to have checked a purchase, changed a password, granted access, fixed a video, or sent a notification. Never request credentials, payment information, or sensitive personal data. For billing, account ownership, security, persistent media failures, or unresolved issues, recommend human support. Keep answers concise. Verified FAQ: "+JSON.stringify(faq);
    const ai=await fetch("https://api.openai.com/v1/responses",{method:"POST",headers:{"Authorization":"Bearer "+key,"Content-Type":"application/json"},body:JSON.stringify({model:"gpt-4.1-mini",instructions,input:message,max_output_tokens:300,store:false}),signal:controller.signal});
    if(!ai.ok) throw Error("AI unavailable");
    const data=await ai.json();
    const answer=(data.output||[]).flatMap(x=>x.content||[]).filter(x=>x.type==="output_text").map(x=>x.text).join("").trim();
    if(!answer) throw Error("Empty answer");
    const escalate=/payment|billing|charge|refund|fraud|security|password|compra|cobro|reembolso|seguridad|contraseña|no funciona|not working/i.test(message);
    return new Response(JSON.stringify({answer,escalate,configured:true}),{headers});
  }catch{return new Response(JSON.stringify({answer:lang==="es"?"No puedo resolverlo automáticamente en este momento. Por favor, crea una solicitud de soporte.":"I cannot resolve this automatically right now. Please submit a support request.",escalate:true}),{headers,status:200})}
  finally{clearTimeout(timeout)}
});
