# SDD ledger — plan: docs/superpowers/plans/2026-10-26-b114-three-courses.md

2026-10-26: Founder authorized autonomous implementation, photos everywhere courses appear in review, use existing ElevenLabs credits. Approval to publish production is still withheld.

Pre-flight: Task 1 payload consumed by Task 2 renderer and Task 3 narration/video; Task 4 packaging requires all three. B70 equivalent schema selected; no parallel course schema.

Ruling: Use local isolated preview and prepare SQL without applying it to production — founder explicitly prohibits deployment before review — live Auth/Stripe/Storage end-to-end remains unverified until authorized staging or deployment.

Ruling: Narrated educational slide videos will use new photographs and lesson keypoints with real ElevenLabs narration — no authorization to buy extra avatar generation and no need to alter existing videos — these are not hands-on procedural demonstrations or avatar videos.

Ruling: Retain existing device-local quiz practice and reviewed participation certificates — reuse existing functionality as ordered — no official grade or professional credential is implied.

Task 1: content draft complete privately (34 bilingual lessons, 170 bilingual questions, worked cases, exercises and sources). Validation RED for missing payloads then GREEN with `python3 tests/b114-content.test.py`. Content is introductory and professional review remains pending.

Task 2: content/progress adapter subset RED→GREEN, `node --test tests/b114-classroom.test.cjs` → 4/4. Production loader rejects guest, wrong course and account race. Renderer and integration tests still pending.

Task 3: three photographs generated and inspected; founder asked to see them and replied Listo. Ruslan clonada voice located. Eight initial narrations generated without regeneration; real first MP3 probed at 19.644 seconds. Full narration queue prepared: 68 files, 14,049 characters total; observed initial billing one credit per character despite Flash model, so budget uses that observed rate. Target reserve 2,543 credits if no extra generation. No plan changes or purchases.

Ruling: Use a new private b114-course-media bucket in the unapplied integration proposal — existing media policies enumerate other course prefixes — no current bucket, policy or rule will be modified; live provisioning requires later publication authorization.
