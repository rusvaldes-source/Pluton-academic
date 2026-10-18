-- B66 / PA-203. Preparación únicamente: NO ejecutar sin revisión y autorización.
-- Calificaciones por estudiante y evaluación. El cliente no puede autoasignarse
-- una nota oficial: el INSERT/UPDATE queda reservado al backend confiable.
create table if not exists public.pa203_assessment_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  course_code text not null default 'PA-203' check (course_code = 'PA-203'),
  assessment_key text not null check (assessment_key ~ '^pa203-(module-1|final|lesson-(0[1-8]))$'),
  correct_answers integer not null check (correct_answers >= 0),
  total_questions integer not null check (total_questions between 1 and 100),
  percentage numeric(5,2) generated always as (round(correct_answers * 100.0 / total_questions, 2)) stored,
  status text not null default 'pending_review' check (status in ('pending_review','graded')),
  submitted_at timestamptz not null default now(),
  graded_at timestamptz,
  constraint pa203_correct_within_total check (correct_answers <= total_questions),
  constraint pa203_graded_timestamp check (status <> 'graded' or graded_at is not null)
);
create index if not exists pa203_assessment_attempts_user_idx
  on public.pa203_assessment_attempts (user_id, submitted_at desc);
alter table public.pa203_assessment_attempts enable row level security;
-- Solo lectura de notas propias; la escritura requerirá un endpoint seguro
-- que recalcule resultados en servidor, sin confiar en respuestas del navegador.
drop policy if exists "pa203_read_own_assessment_attempts" on public.pa203_assessment_attempts;
create policy "pa203_read_own_assessment_attempts"
  on public.pa203_assessment_attempts for select to authenticated
  using ((select auth.uid()) = user_id);
comment on table public.pa203_assessment_attempts is
  'B66 PA-203: historial de evaluaciones; escritura únicamente por backend confiable.';
