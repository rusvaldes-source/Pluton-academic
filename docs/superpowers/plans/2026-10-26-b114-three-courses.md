# B114 Three Courses Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Prepare FA-101, DRV-101 and MED-201 with ES/EN content, photographs, original ElevenLabs audio, narrated educational videos and verified isolated classrooms, without publishing production.

**Architecture:** Reuse B70 lesson payload and classroom patterns, CSS, existing Supabase client, course_learning_content and course_lesson_progress. Add new-code-only adapters and an explicitly local review server; prepare but do not apply production SQL. Keep paid educational content, answer keys and multimedia in a private deliverable, not public git.

**Tech Stack:** Static HTML/JS/CSS, PostgreSQL RLS, Python build/package, ElevenLabs existing account, generated photographic assets, ffmpeg.

**Spec:** docs/superpowers/specs/2026-10-26-b114-three-courses-design.md; founder amendments: course photographs in every course view; use remaining ElevenLabs credits; work autonomously and present only when prepared. No main/production publication.

## Global Constraints

- Exactly FA-101 (10 lessons), DRV-101 (12), MED-201 (12), each ES/EN and five quiz questions.
- Prices remain null; no Checkout or products created; existing Stripe/Auth/media/courses/security policies unchanged.
- One work branch B114-Tres-Cursos-20261026, base main 510fe3f. Backup each completed advance remotely.
- ElevenLabs budget at start 16,592 credits; target at most 15,000, reserve the remainder; no upgrades or extra purchases.
- Keep photos coherent across isolated catalog, detail, classroom and integration manifest. Do not edit production homepage.
- Practice scores are device-local, lesson progress uses existing account table, certificates remain reviewed participation records.

## Review Focus

- Unknown course, altered code, guest or changed account never expose paid payload or media.
- Local review mode must be absent from production loader; local server binds loopback and never represents purchase mocks as actual payment tests.
- Missing asset and failed sync must remain visible; no fabricated completion or credential claim.
- ES/EN quiz state must remain per owner/course/revision; no stale content after language or account change.
- Existing tracked files remain byte-identical, except new B114 documentation and dedicated tests.

### Task 1: Private educational package
Files: private sibling b114-private/content/*.json and source scripts; tests/b114-content.test.py.
Interfaces: B70 lessons schema plus localized summary/audio/video paths; 34 lesson payloads and 170 bilingual quiz items.
- [ ] Write validator asserting counts, bilingual content, quiz options/answer consistency, unique IDs, all approved topics and no actual pricing.
- [ ] Run validator before content exists; expected failure for missing payload.
- [ ] Write original introductory lessons, worked examples, exercises, practice questions and official source register with review date.
- [ ] Run content validator; expected all pass. Privately checkpoint source and payload; public git only tests and plan.

### Task 2: Reused classroom and isolated review
Files: b114/index.html, catalog.js/json, aula.html, aula.js, load.js, progress.js, media.js, classroom.css; tests/b114-classroom.test.cjs; scripts/b114-review.py.
Interfaces: lessons payload from existing course_learning_content through exact course filter and existing purchase RLS. Local review server supplies private payload/media to a separate review entrypoint, never a production authorization fallback.
- [ ] Write tests for course mismatch, auth failure, session change, ES/EN rendering, quiz persistence, progress save failure and owned progress call.
- [ ] Run missing-feature tests RED.
- [ ] Adapt B70 rendering to dedicated new-code-only files; reuse CSS. Support private media only under matching course prefix. Catalog/detail/classroom use same photo mapping. No buy button.
- [ ] Run unit/browser tests GREEN; desktop and 390px mobile review.

### Task 3: Photos, narration and educational video
Files: b114/covers/*; private media/*; private manifest/scripts.
Interfaces: generated course photos; approved Ruslan cloned voice, saved ElevenLabs audio files; each lesson localized media paths.
- [ ] Generate and visually inspect three distinct photographic covers with safe crops.
- [ ] Prepare and count narration scripts before generation; estimate credits from UI model cost and stay inside budget.
- [ ] Generate through authenticated ElevenLabs, download every real result once; no automated generation retries after uncertain/error outcome.
- [ ] Probe audio duration; create narrated slide videos with original photo and actual lesson keypoints, no fake avatar claims. Verify playback and timestamps for every file.
- [ ] Build complete SHA-256 inventory with available/pending states and source/model/voice attribution.

### Task 4: Compatibility, SQL preparation and delivery
Files: database/b114_integration_proposal.sql; docs/B114-RESULTADOS.md; private ZIP report/inventory.
Interfaces: original main immutable; future SQL extension only adds three codes to necessary lists, keeps security predicates and existing memberships untouched.
- [ ] Inspect full relevant deployed function/constraint definitions and prepare narrowly scoped SQL without executing production mutations.
- [ ] Test purchase isolation in local Postgres fixture with synthetic users. Label all mocks/local assertions honestly; no real payment verification claim.
- [ ] Run relevant regressions and full npm test, report existing failures without modifying unrelated code. Verify old tracked files unchanged.
- [ ] Fresh whole-branch review; fix material findings with RED→GREEN tests.
- [ ] Save private ZIP, back up public branch via connector and reread refs/trees; run scripts/verificar-respaldo.py --all.
- [ ] Present actual results and remaining price/professional review/publication approvals. Do not merge or publish.
