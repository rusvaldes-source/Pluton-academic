// Run: node --test tests/pluton-news-api.test.mjs (Node 20+)
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
const source=await readFile(new URL('../functions/api/news.js',import.meta.url),'utf8');
const moduleUrl='data:text/javascript;base64,'+Buffer.from(source).toString('base64');
const {onRequestGet,onRequest}=await import(moduleUrl);
const request=new Request('https://preview.example.com/api/news');
const env={PLUTON_SUPABASE_URL:'https://example.supabase.co',PLUTON_SUPABASE_SERVICE_ROLE_KEY:'test-secret'};
test('sin secretos falla cerrado',async()=>{const r=await onRequestGet({request,env:{}});assert.equal(r.status,503)});
test('solo GET',async()=>{const r=await onRequest({request:new Request(request.url,{method:'POST'}),env});assert.equal(r.status,405)});
test('filtra borradores y revisión, limita campos',async()=>{
 const previous=globalThis.fetch;
 globalThis.fetch=async (url,opts)=>{
  assert.equal(new URL(url).searchParams.get('status'),'eq.published');
  assert.equal(opts.headers.apikey,'test-secret');
  return new Response(JSON.stringify([
   {id:'1',title_es:'A',title_en:'A',body_es:'Texto',body_en:'Text',status:'published',published_at:'2026-10-21T12:00:00Z',video_url:null,private_data:'NO'},
   {id:'2',title_es:'B',title_en:'B',status:'draft',published_at:null},
   {id:'3',title_es:'C',title_en:'C',status:'review',published_at:null}
  ]),{status:200,headers:{'content-type':'application/json'}});
 };
 try{const r=await onRequestGet({request,env});assert.equal(r.status,200);const body=await r.json();assert.equal(body.length,1);assert.equal(body[0].title_es,'A');assert.equal(body[0].private_data,undefined)}
 finally{globalThis.fetch=previous}
});
test('error upstream no revela secretos',async()=>{
 const previous=globalThis.fetch;globalThis.fetch=async()=>new Response('oops',{status:500});
 try{const r=await onRequestGet({request,env});assert.equal(r.status,502);assert.doesNotMatch(await r.text(),/test-secret/)}
 finally{globalThis.fetch=previous}
});
