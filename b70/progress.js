/* Learning progress only. Never used for grades, membership or authorization. */
'use strict';
window.PlutonCourseProgress={
 async load(client,code,count){
  const {data:{user},error}=await client.auth.getUser();if(error||!user)return {ok:false,reason:'login'};
  const {data,error:readError}=await client.from('course_lesson_progress').select('lesson_number,completed').eq('user_id',user.id).eq('course_code',code);
  const {data:{user:current}}=await client.auth.getUser();if(!current||current.id!==user.id)return {ok:false,reason:'account_changed'};
  if(readError)return {ok:false,reason:'read',userId:user.id};
  return {ok:true,userId:user.id,completed:(data||[]).filter(x=>x.completed===true&&Number.isInteger(x.lesson_number)&&x.lesson_number>=1&&x.lesson_number<=count).map(x=>x.lesson_number-1)};
 },
 async save(client,code,index,completed,expectedUserId,count){
  if(!['NA-101','COMP-101'].includes(code)||!Number.isInteger(index)||index<0||index>=count||typeof completed!=='boolean')return {ok:false,reason:'invalid'};
  const {data:{user},error}=await client.auth.getUser();if(error||!user||user.id!==expectedUserId)return {ok:false,reason:'account_changed'};
  const {error:writeError}=await client.from('course_lesson_progress').upsert({user_id:user.id,course_code:code,lesson_number:index+1,completed,updated_at:new Date().toISOString()},{onConflict:'user_id,course_code,lesson_number'});
  return writeError?{ok:false,reason:'write'}:{ok:true};
 }
};
