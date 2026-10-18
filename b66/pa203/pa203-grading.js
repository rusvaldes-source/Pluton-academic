'use strict';
// B66 PA-203: cliente de calificaciones oficiales (función aún NO desplegada).
// La puntuación nunca se envía: el servidor debe calcularla desde respuestas.
window.PA203Grading = {
  async questions(client, assessmentKey, expectedUserId) {
    if (!client || !/^pa203-(module-1|final|lesson-0[1-8])$/.test(assessmentKey) || !expectedUserId) return {ok:false,reason:'invalid_input'};
    try {
      const {data:{user}}=await client.auth.getUser();
      if (!user || user.id!==expectedUserId) return {ok:false,reason:'account_changed'};
      const {data,error}=await client.functions.invoke('grade-pa203',{body:{action:'questions',assessmentKey}});
      if (error || !data || data.assessmentKey!==assessmentKey || !Array.isArray(data.questions)) return {ok:false,reason:'grading_unavailable'};
      if (!data.questions.length || data.questions.length>100 || data.questions.some(q=>!q || typeof q.id!=='string' || typeof q.es!=='string' || typeof q.en!=='string' || !Array.isArray(q.optionsEs) || !Array.isArray(q.optionsEn) || q.optionsEs.length<2 || q.optionsEs.length>10 || q.optionsEs.length!==q.optionsEn.length || q.optionsEs.some(x=>typeof x!=='string') || q.optionsEn.some(x=>typeof x!=='string') || Object.keys(q).some(k=>!['id','es','en','optionsEs','optionsEn'].includes(k)))) return {ok:false,reason:'invalid_server_response'};
      const {data:{user:after}}=await client.auth.getUser();
      if (!after || after.id!==expectedUserId) return {ok:false,reason:'account_changed'};
      return {ok:true,questions:data.questions};
    } catch { return {ok:false,reason:'network_error'}; }
  },
  async submit(client, assessmentKey, answers, expectedUserId) {
    if (!client || !/^pa203-(module-1|final|lesson-0[1-8])$/.test(assessmentKey) ||
        !Array.isArray(answers) || answers.length < 1 || answers.length > 100 ||
        !answers.every(n => Number.isInteger(n) && n >= 0 && n <= 9) ||
        typeof expectedUserId !== 'string' || !expectedUserId) {
      return {ok:false, reason:'invalid_input'};
    }
    try {
      const {data:{user},error:userError} = await client.auth.getUser();
      if (userError || !user || user.id !== expectedUserId) return {ok:false,reason:'account_changed'};
      const {data,error} = await client.functions.invoke('grade-pa203',{
        body:{action:'submit',assessmentKey,answers}
      });
      if (error) return {ok:false,reason:'grading_unavailable'};
      if (!data || !data.attempt || data.attempt.assessment_key !== assessmentKey ||
          !Number.isInteger(data.attempt.correct_answers) ||
          !Number.isInteger(data.attempt.total_questions) ||
          data.attempt.total_questions !== answers.length ||
          data.attempt.correct_answers < 0 ||
          data.attempt.correct_answers > data.attempt.total_questions ||
          data.attempt.status !== 'graded') {
        return {ok:false,reason:'invalid_server_response'};
      }
      const {data:{user:afterUser},error:afterError} = await client.auth.getUser();
      if (afterError || !afterUser || afterUser.id !== expectedUserId)
        return {ok:false,reason:'account_changed'};
      return {ok:true,attempt:data.attempt};
    } catch {
      return {ok:false,reason:'network_error'};
    }
  }
};
