// Temporary, bounded importer. Deploy with a fresh secret's SHA-256 and expiry.
// Never commit the secret or a rendered deployment file. Seal with HTTP 410 after use.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.0";
import approved from "./approved.json" with { type: "json" };
const expectedTokenHash = "__ONE_TIME_TOKEN_SHA256__";
const validUntil = Number("__ONE_TIME_EXPIRY__");
const sourceRoot = "https://raw.githubusercontent.com/rusvaldes-source/Pluton-academic/5aebbabc2f339dbacf818500cc1860d4b8456e99/";
const reply=(data:unknown,status=200)=>new Response(JSON.stringify(data),{status,headers:{"content-type":"application/json","cache-control":"no-store"}});
const sha=async(data:Uint8Array)=>Array.from(new Uint8Array(await crypto.subtle.digest("SHA-256",data))).map(x=>x.toString(16).padStart(2,"0")).join("");
Deno.serve(async(req:Request)=>{
 if(req.method!=="POST")return reply({error:"Method not allowed"},405);
 if(!Number.isFinite(validUntil)||!(/^[a-f0-9]{64}$/).test(expectedTokenHash))return reply({error:"Not configured"},503);
 if(Date.now()>validUntil)return reply({error:"Import window closed"},410);
 const provided=req.headers.get("authorization")||"";
 if(!provided.startsWith("Bearer "))return reply({error:"Forbidden"},403);
 const digest=await sha(new TextEncoder().encode(provided.slice(7)));let diff=0;
 for(let i=0;i<64;i++)diff|=digest.charCodeAt(i)^expectedTokenHash.charCodeAt(i);
 if(diff)return reply({error:"Forbidden"},403);
 try{
  const input=await req.json(),index=input.index;
  if(!Number.isInteger(index)||index<0||index>=approved.length)return reply({error:"Unapproved index"},400);
  const row=approved[index];
  if(row.bucket_id!=="b108-course-media"||row.course_code!=="ID-001"||!/^ID-001\/[A-Za-z0-9_-]+\.mp3$/.test(row.object_name)||row.source!=="ingles-desde-cero/audios/"+row.object_name.slice("ID-001/".length))return reply({error:"Invalid manifest"},400);
  const admin=createClient(Deno.env.get("SUPABASE_URL")!,Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
  const storage=admin.storage.from(row.bucket_id);let found=await storage.download(row.object_name),uploaded=false;
  const missing=found.error&&(String(found.error.statusCode)==="404"||found.error.message==="Object not found");
  if(missing){
   const response=await fetch(sourceRoot+row.source,{redirect:"error"});
   if(!response.ok)return reply({error:"Approved source unavailable"},502);
   const original=new Uint8Array(await response.arrayBuffer());
   if(original.byteLength!==row.bytes||await sha(original)!==row.sha256)return reply({error:"Source hash mismatch"},409);
   const result=await storage.upload(row.object_name,original,{contentType:"audio/mpeg",upsert:false,cacheControl:"0"});
   if(result.error)return reply({error:"Upload not completed; no overwrite attempted"},503);
   uploaded=true;found=await storage.download(row.object_name);
  }
  if(found.error||!found.data)return reply({error:"Private read failed"},503);
  const stored=new Uint8Array(await found.data.arrayBuffer());
  if(stored.byteLength!==row.bytes||await sha(stored)!==row.sha256)return reply({error:"Stored hash mismatch; original preserved"},409);
  const receipt=await admin.from("b108_media_assets").update({verified_sha256:row.sha256}).eq("bucket_id",row.bucket_id).eq("object_name",row.object_name).eq("expected_sha256",row.sha256).select("object_name,verified_sha256").single();
  if(receipt.error||receipt.data?.verified_sha256!==row.sha256)return reply({error:"Verification receipt not recorded"},503);
  return reply({index,object_name:row.object_name,hash_verified:true,uploaded});
 }catch{return reply({error:"Import failed without overwrite"},503);}
});
