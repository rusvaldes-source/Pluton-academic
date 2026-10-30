# B115 Familia y Bienestar — Development Plan
Goal: four private bilingual educational courses, 15 lessons each, ready for professional review; no production integration.
Architecture: author private JSON payloads matching b114/aula.js fields, plus ES/EN reading, workbook, narration/video scripts and assessments. Public branch holds process documentation only (AGENTS.md prohibits paid content and answer keys in this public repository).
Spec: founder work order dated 2026-10-30, supplied in conversation.
Constraints: one branch B115-familia-bienestar-desarrollo; no existing-file changes; no paid media; $9.99 USD once; all assets unpublished; certificate issuance remains manual under existing system.
- [x] Review current architecture and capture integration gaps.
- [x] Author and validate FAM-101, PSI-101, FAM-102, PSI-102 independently with 15 lessons and 20 final questions each.
- [x] Prepare four original cover designs, offline review reader, manifests and audiovisual workload estimates.
- [x] Validate structural compatibility offline; explicitly distinguish schema checks from production E2E, which is prohibited.
- [x] Save private packages of <=100 files and public branch documentation; verify remote backups.
Review focus: bilingual parity, wrong answer keys, clinical promises, unavailable media, unsupported course allowlists. Current b114 loader is fixed to three prior codes; final assessment renderer is not present. Integration remains blocked until approved changes and staging tests. Do not claim these new courses run unmodified in production.
