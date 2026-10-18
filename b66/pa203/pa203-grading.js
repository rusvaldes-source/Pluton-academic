'use strict';
// B66 PA-203: cliente de calificaciones oficiales (función aún NO desplegada).
// La puntuación nunca se envía: el servidor debe calcularla desde respuestas.
window.PA203Grading = {
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
        body:{assessmentKey,answers}
      });
      if (error) return {ok:false,reason:'grading_unavailable'};
      if (!data || !data.attempt || data.attempt.assessment_key !== assessmentKey ||
          !Number.isInteger(data.attempt.correct_answers) ||
          !Number.isInteger(data.attempt.total_questions)) {
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
