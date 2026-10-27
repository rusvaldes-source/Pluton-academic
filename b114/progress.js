/* Reuses B70 progress API and existing owner-protected table. */
(()=>{'use strict';const counts={'FA-101':10,'DRV-101':12,'MED-201':12};
window.PlutonCourseProgress={
 async load(client,code,count){
  if(counts[code]!==count)return {ok:false,reason:'invalid'};
  const first=await client.auth.getUser(),user=first.data?.user;if(first.error||!user)return {ok:false,reason:'login'};
  const result=await client.from('course_lesson_progress').select('lesson_number,completed').eq('user_id',user.id).eq('course_code',code);
  const current=await client.auth.getUser();if(current.error||current.data?.user?.id!==user.id)return {ok:false,reason:'account_changed'};
  if(result.error)return {ok:false,reason:'read'};
  return {ok:true,userId:user.id,completed:(result.data||[]).filter(x=>x.completed===true&&Number.isInteger(x.lesson_number)&&x.lesson_number>=1&&x.lesson_number<=count).map(x=>x.lesson_number-1)};
 },
 async save(client,code,index,completed,expectedUserId,count){
  if(counts[code]!==count||!Number.isInteger(index)||index<0||index>=count||typeof completed!=='boolean')return {ok:false,reason:'invalid'};
  const first=await client.auth.getUser(),user=first.data?.user;if(first.error||!user||user.id!==expectedUserId)return {ok:false,reason:'account_changed'};
  const result=await client.from('course_lesson_progress').upsert({user_id:user.id,course_code:code,lesson_number:index+1,completed,updated_at:new Date().toISOString()},{onConflict:'user_id,course_code,lesson_number'});
  const current=await client.auth.getUser();if(current.error||current.data?.user?.id!==expectedUserId)return {ok:false,reason:'account_changed'};
  return result.error?{ok:false,reason:'write'}:{ok:true};
 }
};})();
