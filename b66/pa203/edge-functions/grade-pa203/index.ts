// B66 PA-203 — Edge Function (BORRADOR NO DESPLEGADO).
// Deploy only after provisioning PA203_OFFICIAL_QUESTION_BANK_JSON in Supabase secrets.
// The secret stores bilingual questions and correctIndex values, never exposed to students.
// Do not use the public course JSON as an authoritative grading key.
import { createClient } from 'npm:@supabase/supabase-js@2';

const headers = {
  'content-type': 'application/json',
  'cache-control': 'no-store',
  'access-control-allow-origin': Deno.env.get('PA203_ALLOWED_ORIGIN') ?? 'https://www.plutonacademic.com',
  'access-control-allow-headers': 'authorization, apikey, content-type',
  'access-control-allow-methods': 'POST, OPTIONS',
};

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers });
  if (request.method !== 'POST') return new Response(JSON.stringify({ error: 'method_not_allowed' }), { status: 405, headers });
  try {
    if (Deno.env.get('PA203_GRADING_ENABLED') !== 'true') return new Response(JSON.stringify({ error: 'grading_disabled' }), { status: 503, headers });
    const auth = request.headers.get('authorization') ?? '';
    if (!/^Bearer\s+\S+$/i.test(auth)) return new Response(JSON.stringify({ error: 'unauthorized' }), { status: 401, headers });
    const url = Deno.env.get('SUPABASE_URL');
    const anon = Deno.env.get('SUPABASE_ANON_KEY');
    const service = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    if (!url || !anon || !service ) return new Response(JSON.stringify({ error: 'not_configured' }), { status: 503, headers });
    const authClient = createClient(url, anon, { global: { headers: { Authorization: auth } }, auth: { persistSession: false } });
    const { data: { user }, error: userError } = await authClient.auth.getUser(auth.replace(/^Bearer\s+/i, ''));
    if (userError || !user) return new Response(JSON.stringify({ error: 'unauthorized' }), { status: 401, headers });
    const lengthHeader = request.headers.get('content-length');
    const declaredSize = lengthHeader === null ? null : Number(lengthHeader);
    if (declaredSize !== null && (!Number.isSafeInteger(declaredSize) || declaredSize < 0)) return new Response(JSON.stringify({ error: 'invalid_content_length' }), { status: 400, headers });
    if (declaredSize !== null && declaredSize > 8192) return new Response(JSON.stringify({ error: 'payload_too_large' }), { status: 413, headers });
    const rawBody = await request.text();
    if (rawBody.length > 8192) return new Response(JSON.stringify({ error: 'payload_too_large' }), { status: 413, headers });
    const body = JSON.parse(rawBody);
    if (!body || typeof body !== 'object' || Array.isArray(body)) return new Response(JSON.stringify({ error: 'invalid_body' }), { status: 400, headers });
    const { assessmentKey, answers, action } = body;
    if (typeof assessmentKey !== 'string' || !/^pa203-(module-1|final|lesson-0[1-8])$/.test(assessmentKey)) return new Response(JSON.stringify({ error: 'invalid_assessment' }), { status: 400, headers });
    // Official questions must come from a server-only secret, never from public practice JSON.
    // Secret format: { "pa203-final": [{ "id":"q1", "es":"...", "en":"...", "optionsEs":["..."], "optionsEn":["..."], "correctIndex":0 }] }
    const bankRaw = Deno.env.get('PA203_OFFICIAL_QUESTION_BANK_JSON');
    if (!bankRaw) return new Response(JSON.stringify({ error: 'assessment_not_configured' }), { status: 503, headers });
    const bank = JSON.parse(bankRaw);
    const officialQuestions = bank[assessmentKey];
    const validBank = Array.isArray(officialQuestions) && officialQuestions.length > 0 &&
      officialQuestions.length <= 100 &&
      officialQuestions.every(q => q && typeof q.id === 'string' && q.id.length > 0 &&
        typeof q.es === 'string' && q.es.length > 0 &&
        typeof q.en === 'string' && q.en.length > 0 &&
        Array.isArray(q.optionsEs) && Array.isArray(q.optionsEn) &&
        q.optionsEs.length >= 2 && q.optionsEs.length <= 10 &&
        q.optionsEs.length === q.optionsEn.length &&
        q.optionsEs.every(x => typeof x === 'string' && x.length > 0) &&
        q.optionsEn.every(x => typeof x === 'string' && x.length > 0) &&
        Number.isInteger(q.correctIndex) && q.correctIndex >= 0 &&
        q.correctIndex < q.optionsEs.length) &&
      new Set(officialQuestions.map(q => q.id)).size === officialQuestions.length;
    if (!validBank) return new Response(JSON.stringify({ error: 'assessment_not_configured' }), { status: 503, headers });
    if (action === 'questions') {
      const questions = officialQuestions;
      return new Response(JSON.stringify({ assessmentKey, questions: questions.map(q => ({
        id:q.id, es:q.es, en:q.en, optionsEs:q.optionsEs, optionsEn:q.optionsEn
      })) }), { status: 200, headers });
    }
    if (action !== 'submit') return new Response(JSON.stringify({ error: 'invalid_action' }), { status: 400, headers });
    const correct = officialQuestions.map(q => q.correctIndex);
    if (!Array.isArray(correct) || !correct.length || correct.length > 100 || !correct.every(x => Number.isInteger(x) && x >= 0 && x <= 9)) return new Response(JSON.stringify({ error: 'assessment_not_configured' }), { status: 503, headers });
    if (!Array.isArray(answers) || answers.length !== correct.length || !answers.every(x => Number.isInteger(x) && x >= 0 && x <= 9)) return new Response(JSON.stringify({ error: 'invalid_answers' }), { status: 400, headers });
    if (!answers.every((answer, i) => answer < officialQuestions[i].optionsEs.length)) return new Response(JSON.stringify({ error: 'invalid_answers' }), { status: 400, headers });
    const score = answers.reduce((total, answer, i) => total + Number(answer === correct[i]), 0);
    const admin = createClient(url, service, { auth: { persistSession: false } });
    const { data, error } = await admin.from('pa203_assessment_attempts').insert({
      user_id: user.id, course_code: 'PA-203', assessment_key: assessmentKey,
      correct_answers: score, total_questions: correct.length,
      status: 'graded', graded_at: new Date().toISOString(),
    }).select('id,assessment_key,correct_answers,total_questions,percentage,status,submitted_at').single();
    if (error) return new Response(JSON.stringify({ error: 'save_failed' }), { status: 500, headers });
    return new Response(JSON.stringify({ attempt: data }), { status: 200, headers });
  } catch {
    return new Response(JSON.stringify({ error: 'invalid_request' }), { status: 400, headers });
  }
});
