// B66 PA-203 — Edge Function (BORRADOR NO DESPLEGADO).
// Deploy only after provisioning PA203_GRADING_KEY_JSON in Supabase secrets.
// Expected secret: {"pa203-final":[0,1,...],"pa203-module-1":[0,0],...}
// Each array contains the zero-based correct option for each question.
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
    const secret = Deno.env.get('PA203_GRADING_KEY_JSON');
    if (!url || !anon || !service || !secret) return new Response(JSON.stringify({ error: 'not_configured' }), { status: 503, headers });
    const authClient = createClient(url, anon, { global: { headers: { Authorization: auth } }, auth: { persistSession: false } });
    const { data: { user }, error: userError } = await authClient.auth.getUser(auth.replace(/^Bearer\s+/i, ''));
    if (userError || !user) return new Response(JSON.stringify({ error: 'unauthorized' }), { status: 401, headers });
    const body = await request.json();
    if (!body || typeof body !== 'object' || Array.isArray(body)) return new Response(JSON.stringify({ error: 'invalid_body' }), { status: 400, headers });
    const { assessmentKey, answers } = body;
    if (typeof assessmentKey !== 'string' || !/^pa203-(module-1|final|lesson-0[1-8])$/.test(assessmentKey)) return new Response(JSON.stringify({ error: 'invalid_assessment' }), { status: 400, headers });
    const keys = JSON.parse(secret);
    const correct = keys[assessmentKey];
    if (!Array.isArray(correct) || !correct.length || correct.length > 100 || !correct.every(x => Number.isInteger(x) && x >= 0 && x <= 9)) return new Response(JSON.stringify({ error: 'assessment_not_configured' }), { status: 503, headers });
    if (!Array.isArray(answers) || answers.length !== correct.length || !answers.every(x => Number.isInteger(x) && x >= 0 && x <= 9)) return new Response(JSON.stringify({ error: 'invalid_answers' }), { status: 400, headers });
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
