/* Published content only. RLS of the existing source table governs every read. */
(()=>{'use strict';window.PlutonPublishedContent={async load(code,client){
 if(!client){if(!window.supabase)throw Error('Course client unavailable');client=window.supabase.createClient('https://paifjzznyiehwidoqjqb.supabase.co','sb_publishable_-Ip2JRpDGn-Ehx2C94Tk3Q_jg7p7VLz');}
 const {data,error}=await client.rpc('b95_course_published',{p_course_code:code});
 if(error||!data?.payload||data.revision===undefined)throw Error('Published course unavailable');
 const payload=data.payload;Object.defineProperty(payload,'_publishedRevision',{value:String(data.revision),enumerable:false});return payload;
}};})();
