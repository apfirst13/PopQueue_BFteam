# PopQueue — Lab 7 Master Plan (Software Maintenance Metrics & Release Readiness)

> **File Location (Local):** `LAB7/plan/LAB7_MASTER_PLAN.md` *(Revision 5 — Enforced `Create a merge commit` across all PRs, added `Refs #<CR>` / `Closes #<CR>` linking & pre-snapshot closure check, added `[RED]` `git diff --stat` proof, removed non-rubric DORA terms in Part C, added private test-credential submission check, and aligned `TEST-20`/`TEST-33` matrix refs)*  
> **Repo Target Path (When Lab 7 Branch Starts):** `docs/labs/lab7/plan/LAB7_MASTER_PLAN.md` *(omit student ID numbers from public repo files; put full student IDs on the LEB2 PDF cover)*  
> **Course:** CPE 334 Introduction to Software Engineering in the Age of AI Agents (Section 1, Semester 1/2026, KMUTT)  
> **Assignment:** Lab 7 — Software maintenance metrics and release readiness (**100 points | 5% of course grade**)  
> **Deadline:** **Sunday, 29 November 2026 at 23:59** (via LEB2, single self-contained PDF; Project Deliverable 2 shares the same deadline)  
> **Project / Theme:** **PopQueue** — Theme 9: Queue and Service Management System (*Art Toy Live Unboxing Station*)

---

## 0. Mandatory Governance Rule: Git, GitHub & GCP Command Authorization Policy

> [!CAUTION]
> **STRICT RULE — MUST OBTAIN USER APPROVAL BEFORE ANY MUTATING GIT / GITHUB / CLOUD COMMAND:**  
> ห้าม AI Agent หรือระบบอัตโนมัติรันคำสั่งที่ **สร้าง/แก้ไข/เปลี่ยนสถานะ/ส่งข้อมูล** บน Git, GitHub (`gh`), หรือ GCP ด้วยตัวเองโดยเด็ดขาด **ต้องแจ้งรายละเอียดและได้รับการอนุญาตอย่างชัดแจ้งจากเจ้าของงาน (User) ก่อนทุกครั้ง**

### 0.0 คำสั่งแบบ "อ่านอย่างเดียว" ที่อนุญาตให้รันได้ทันที (ไม่ต้องขออนุญาตซ้ำ)
เพื่อให้การเช็กสถานะ, วิเคราะห์ผลกระทบ, และเก็บ Metrics (Part C) ไม่สะดุด Agent สามารถรันคำสั่ง **Read-Only** เหล่านี้ได้ทันที:
* **Git Read-Only:** `git status`, `git log`, `git show`, `git diff`, `git branch -a`, `git tag -l`, `git ls-tree`, `git ls-remote`
* **GitHub CLI Read-Only:** `gh issue list`, `gh issue view`, `gh pr list`, `gh pr view`, `gh run list`, `gh run view`, `gh label list`, `gh api` (เฉพาะ HTTP `GET`)
* **Local Pure Read-Only Checks:** `npm run typecheck`, `npm run lint`, `npm run build`
* **DB-Backed Local Tests (`npm test`, `npm run test:e2e`):** Server/E2E tests (`server/tests/setup.ts`) call `dotenv.config()` and only override `DATABASE_URL` if `DATABASE_URL_TEST` is set, then run DB resets (`deleteMany()` / `resetQueueState()`). Before running DB-backed tests in any workspace, require **one-time explicit User confirmation** that local `.env` points strictly to a local disposable test DB and **never** to Cloud SQL/staging *(never read `.env` directly per `AGENTS.md` #7)*.

### 0.1 คำสั่งที่ "ห้ามรันเอง" (ต้องแจ้งและขออนุญาตทุกครั้งก่อนรัน)
1. **GitHub CLI (`gh`) ที่สร้าง/แก้ไข/เปลี่ยนสถานะบน GitHub:**
   * `gh issue create`, `gh issue edit`, `gh issue close`, `gh issue comment`
   * `gh pr create`, `gh pr merge`, `gh pr review`, `gh pr close`, `gh pr edit`
   * `gh workflow run`, `gh release create`, `gh label create`
2. **Git Commands ที่เปลี่ยนสถานะ Branch / History / Remote:**
   * `git checkout`, `git switch`, `git branch -D`
   * `git add`, `git commit`, `git merge`, `git cherry-pick`, `git revert` *(ห้ามลบหรือเขียนทับ commit/history ที่เผยแพร่แล้วตาม **Lab 5 R-10** และต้องรักษาลำดับวันที่/commit ตาม **Lab 7 §3.1**)*
   * `git push` *(และห้ามใช้ `git push --force` โดยเด็ดขาด)*
   * `git tag` และ `git push origin <tag>`
3. **Cloud / Database Commands ที่กระทบ Production Demo บน GCP:**
   * `gcloud run ...`, `gcloud sql ...`, `deploy/deploy.sh`, `deploy/release.sh`, `deploy/teardown.sh`, การรัน migrate/seed/reset บน Cloud SQL จริง

### 0.2 รูปแบบการขออนุญาตก่อนรันคำสั่งในหมวด 0.1 ทุกครั้ง
ก่อนรันคำสั่งในหมวด 0.1 ทุกครั้ง Agent ต้องแสดงให้ User ตรวจสอบก่อน 4 ข้อ:
1. **วัตถุประสงค์ & Phase ของงาน**
2. **คำสั่งจริงที่จะรันแบบเต็มบรรทัด** (Exact command)
3. **ผลกระทบ & Branch / Target ปลายทาง**
4. รอคำยืนยัน (`อนุญาต` / `โอเค` / `รันได้เลย`) **ก่อน** ลงมือรันจริงทุกครั้ง

---

## 1. Team Metadata, Deterministic PR Ownership & Gate Controls

### 1.1 Team `BFteam` & Ruleset-Safe Single-Author PR Chain
* **Members:** นายธีรวัฒญ์ รุ่งสว่าง (`@Theerawat82`) & นายอภิวัชร์ ปัณฐธนาพัฒน์ (`@apfirst13`) *(Add student IDs on the LEB2 PDF cover; omit student IDs from public repo docs).*
* **Branch Naming Rule (`AGENTS.md` #2):** Never commit directly to `main` or `*-staging`. Every working branch **must** use `feature/<CR#>-<slug>` or `fix/<CR#>-<slug>` using the Change Request Issue number `<CR#>`.
* **Ruleset Constraint (`require_last_push_approval: true`):** Both `protect-staging` (`lab5-staging`) and `protect-main` (`main`) block whoever authored the PR's head/last-pushed commit from approving that PR.
  * Verified on GitHub: `origin/main` HEAD (`2aee62b`) was authored/merged by **`@Theerawat82`**.
  * **Mandatory Merge Strategy (`Create a merge commit` Only):** **Every PR (`PR-Sync`, `PR-1`, `PR-2`, `PR-3`, `PR-4`) MUST merge using `Create a merge commit`** (never *Squash and merge* or *Rebase and merge*). Only a true merge commit makes the merger the author of the resulting branch HEAD commit (keeping the `PR-4` ownership table valid under `require_last_push_approval`) and preserves commit/date history for Lab 7 evaluation.
  * **Issue Traceability (`Refs #<CR>` vs. `Closes #<CR>`):** All commit messages and PR descriptions in **`PR-1`, `PR-2`, and `PR-3`** (`-> lab5-staging`) MUST cite **`Refs #<CR>`** (do *not* rely on `Closes` into staging, because GitHub auto-closes issues only on default branch `main`). Put **`Closes #<CR>`** in **`PR-4`** (`-> main`) so `#CR` closes automatically at release and counts as a Completed Issue in Part C.
  * Therefore, **every PR below has one named sole author/opener and one named approver/merger**, alternating cleanly so no ruleset deadlock can occur:

| PR / Step | Source → Target | Sole Pusher / Opener | Named Reviewer, Approver & Merger | Resulting Target HEAD Author & Merge / Link Rules |
| :--- | :--- | :--- | :--- | :--- |
| **PR-Sync** *(Phase 0)* | `main` (`2aee62b`) → `lab5-staging` | **`@Theerawat82`** *(opens PR)* | **`@apfirst13`** *(approves & merges)* | `Create a merge commit` -> `lab5-staging` HEAD becomes authored by `@apfirst13` (`0` file diff; does **not** trigger `deploy.yml`). Check PR UI at open time to confirm no `"approval not counted"` notice appears |
| **PR-1 (Part A)** | `feature/<CR#>-br02-contract` → `lab5-staging` | **`@Theerawat82`** | **`@apfirst13`** | `Create a merge commit` (`Refs #<CR>` in commits & PR) -> `lab5-staging` HEAD = `@apfirst13`. **Must be authored & merged AFTER TA written approval and BEFORE any code/test commits** |
| **PR-2 (Part B Backend)** | `feature/<CR#>-br02-backend` → `lab5-staging` | **`@apfirst13`** | **`@Theerawat82`** | `Create a merge commit` (`Refs #<CR>` in commits & PR) -> `lab5-staging` HEAD = `@Theerawat82`. Commit 1: `[RED]` test on pre-change commit; Commit 2: Migration `0003` + Backend `[GREEN]` + **full `server` Vitest suite run recorded** |
| **PR-3 (Part B UI/E2E)** | `feature/<CR#>-br02-ui-e2e` → `lab5-staging` | **`@Theerawat82`** | **`@apfirst13`** | `Create a merge commit` (`Refs #<CR>` in commits & PR) -> **`lab5-staging` HEAD = `@apfirst13`**. Multi-ticket UI (`MyTicketPage`), component tests, E2E, `PROJECT_STATE.md`, full monorepo regression |
| **PR-4 (Release)** | `lab5-staging` → `main` | **`@apfirst13`** *(opens Release PR)* | **`@Theerawat82`** *(approves & merges to `main`)* | `Create a merge commit` (`Closes #<CR>` in PR description so `#CR` closes automatically on `main`). Because `@apfirst13` merged `PR-3`, `@apfirst13` opens `PR-4` and **`@Theerawat82` approves & merges in the normal path**. *(If an intervening Lab 6 hotfix back-merge `main -> lab5-staging` happens after `PR-3`, merge it via `Create a merge commit` and recalculate dynamically: opener = that back-merge HEAD author; approver/merger = the other teammate)* |

### 1.2 Version Lineage, Pre-Change SHA Clarity & Lab 6 Gate Controls
* **Accepted Sprint 1 Baseline Tag:** `v0.1.0-sprint1` (`d946159ba82a249c195730a3b702cf0f68e96e2d`, PR `#23`, 7 Nov 2026)
* **Lab 5 CI/CD & GCP Tag:** `v0.2.0-lab5` (`bf52c9b969d905ba6f21bcc22a460f0db3dd5172`, PR `#43`, 13 Nov 2026)
* **Lab 6 Retest Candidate on `origin/main` & Live Cloud Run:** `2aee62b607b475a60be4b7a08980ec752d28941a` (PR `#48` → `PR #50`, `Deploy demo #44916394495`, 21 Nov 2026)
* **Live Cloud Run URL:** `https://popqueue-5now4hkvsa-as.a.run.app` (shared later with Deliverable 2)

> [!IMPORTANT]
> **Critical Gate & Pre-Change Evidence Rules:**
> 1. **Immediate Phase 0 Actions (Do NOT Wait for Omega-3):**
>    * `deploy.yml` triggers **only on `push` to `main`**. Creating label `lab7`, opening the Change Request Issue `#CR`, requesting TA approval, and merging `PR-Sync` (`main -> lab5-staging`) can all happen **immediately** without changing `2aee62b` on live Cloud Run.
> 2. **Strict TA Approval Before Contract Edit (`Lecture+13` Slides 19 & 21):**
>    * **Record TA/Instructor written approval (with visible approver name, date & time screenshot attached to Issue `#CR`) BEFORE committing `PR-1` Contract edits.**
>    * **Pre-Drafting Optimization + Fallback:** To save schedule time without breaking Git sequence, you may draft the `PopQueue_Deliverable_1_Master.md` revisions locally in an uncommitted scratch/preview (trade-off: minor rework if TA asks to adjust scope), and **only `git commit` / `git push` `PR-1` after TA written approval arrives**. If TA has not responded by **Mon 23 Nov 18:00 (ICT)**, follow up in the course Facebook group / lab channel or ask during Tuesday's class session (**24 Nov**) — **even if approved verbally in Tuesday's class, TA/Instructor MUST immediately confirm in writing (chat reply or GitHub Issue `#CR` comment with visible approver name and timestamp) and be screenshotted into Issue `#CR` before committing `PR-1`**; if TA deems `D-08` too broad, review the conditional **Backup Rule Option** in §3.4.
> 3. **What Waits for Omega-3 (`Issue #47`) & Pre-Change SHA Rule:**
>    * **Only `PR-4` (`lab5-staging -> main`) waits for Lab 6 Issue `#47` closure** so Cloud Run `2aee62b` stays frozen during retest.
>    * **Decision Deadline (`Issue #47`):** If Team Omega-3 has not responded/closed `#47` by **Wed 25 Nov 12:00 (ICT)**, consult the Instructor/TA per Lab 6 §2/§3.5 before releasing `PR-4`.
>    * **Pre-Change `[RED]` Commit vs. Possible Lab 6 Hotfix:** The **Pre-Change Code Commit** proved by `[RED]` is the `lab5-staging` commit right after `PR-1` merges (whose code/DB matches `2aee62b` because `PR-1` only edits docs). If Omega-3 retest later discovers a defect requiring a Lab 6 hotfix on `main`, resolve the Lab 6 hotfix (`lab5-staging -> main`), back-merge `main -> lab5-staging` before `PR-4`, recalculate `PR-4` opener/approver dynamically per §1.1 if the back-merge changed `lab5-staging` HEAD author, and explicitly record in the Version Table & Part B that the Lab 6 hotfix (e.g., auth/unrelated fix) did not touch `BR-02` and therefore does **not** invalidate the `[RED]` evidence!

---

## 2. Lab 7 Rubric & Parallel Two-Track Strategy (With Deliverable 2)

### 2.1 Rubric Summary (`Lab_7_Sprint_1_Maintenance (1).pdf` — 100 Points)
| Part | Points | Assessed Material Required Directly Inside PDF |
| :---: | :---: | :--- |
| **A. Change impact & updated contract** | **25** | Approved Change Request (`BR-02` / `D-08`) with TA written approval dated before Contract edit, Requirement→Code Impact Table (including Roles/Ownership & N/A reasons), revised `SRS/Feature SDS/System SDS/AC/STS` excerpts, and teammate contract review before code |
| **B. Implementation & regression safe delivery** | **50** | `[RED]` output on pre-change `lab5-staging` commit, bounded `[GREEN]` fix + diff, backend & full regression runs/counts/commands (with rationale for `TEST-11`/`db-schema` contract revisions), embedded PR review text, CI, `lab5-staging`, `main` release tag `v0.3.0-lab7`, `popqueue-migrate` `0003` log, live changed + preserved Sprint 1 checks |
| **C. Objective engineering metrics** | **15** | Five dated, verifiable metrics in locked window (ending at `v0.3.0-lab7` snapshot timestamp), embedded reconcilable lists, `<= 100`-word interpretation with owner & next milestone |
| **D. Release readiness & retrospective** | **10** | Honest `READY`/`NOT READY` verdict for maintained Sprint 1 scope, Technical Debt table (separate from defects), 3 brief retrospective answers (1–2 sentences each), Version Table, Contribution Table, AI-Use Declaration, Known Limitations |

### 2.2 Parallel Two-Track Schedule With Deliverable 2 (Both Due Sun 29 Nov 2026)
Sprint 2 (`Deliverable 2`, 70 pts: `F-05` Cancel, `F-06` 120s No-Show, `F-07` Public Board, `F-08` initial Analytics) is too large to squeeze into Sat–Sun alone. Run two cleanly isolated tracks:
* **Track 1 (Lab 7 Critical Path — Mon 23 to Thu 26 Nov):** Primary focus on `PR-1` → `PR-2` → `PR-3` → `PR-4` (`v0.3.0-lab7`) + live verification.
* **Track 2 (Deliverable 2 / Sprint 2 Prep in Parallel — Mon 23 to Thu 26 Nov):** While Track 1 awaits TA approval / PR reviews / CI, the partner drafts Sprint 2 contracts (`F-05..F-08`) and develops on isolated `feature/<s2-issue#>-...` branches.
  * **Track 2 `BR-02 v2` Alignment Rule:** All new Sprint 2 contracts (`F-05` Cancel, `F-06` No-Show) **must reference `BR-02 v2` ("1 active ticket per series") from Day 1** (e.g., cancelling or marking No-Show on `CRY` frees the Collector to re-join `CRY`, while leaving any active `LAB` ticket untouched) so Sprint 2 contracts need zero rework.
  * **Strict Staging/Main Freeze Until Lab 7 Tag:** Do **NOT** merge any Sprint 2 PR into `lab5-staging` or `main` until `PR-4` merges into `main`, tags `v0.3.0-lab7`, and passes live Cloud Run verification.
* **Shared Cloud Run Service Note:** Because Deliverable 2 will later deploy newer revisions onto `https://popqueue-5now4hkvsa-as.a.run.app` before 29 Nov 23:59, capture ALL Lab 7 live evidence & `popqueue-migrate` logs immediately on the `v0.3.0-lab7` revision (recording exact revision ID + SHA), and re-verify `BR-02 v2` remains healthy in Deliverable 2's final release!

---

## 3. Codebase Audit, Locked Technical Contract & Backup Option

### 3.1 Verified Repo Audit Findings (22 Nov 2026)
Repository-wide searches across `server/`, `client/`, `e2e/`, `deploy/`, `scripts/`, and `docs/` verified:
* **GitHub Labels:** `lab5` and `lab6` exist; **`lab7` does not exist yet** (create in Phase 0).
* **Docs / Source of Truth:**
  * `docs/PROJECT_STATE.md` (`AGENTS.md` #10) does **not** exist at `docs/PROJECT_STATE.md` — the active state file is `docs/sprints/sprint-1/PROJECT_STATE.md`. Update `docs/sprints/sprint-1/PROJECT_STATE.md` on every completed task (and optionally add a root pointer if desired).
  * `docs/sprints/sprint-1/PopQueue_Deliverable_1_Master.md` is the canonical Source of Truth (`AGENTS.md`), while `srs.md` (line 44), `system-sds.md` (lines 23–27), and `traceability.md` also contain `BR-02` / `unique_active_ticket_user` summaries — update Master Spec first and keep those 3 pointer files aligned.
* **Footer Version Badge (`Layout.tsx` & `App.test.tsx`):**
  * `client/src/components/Layout.tsx` line 105 **hardcodes** `PopQueue v0.2.0-lab5` (asserted in `client/src/App.test.tsx` line 16!), while line 16 reads `VITE_GIT_SHA` and renders `Commit: <7-char>` alongside `GET /api/health` (`process.env.GIT_SHA`).
  * **Verification Rule:** Do **not** hardcode-bump `v0.2.0-lab5` unless explicitly scoped; verify the deployed Lab 7 release using **`GET /api/health` (`commit` == full 40-char `main` SHA) + UI footer `Commit: <7-char>` + Cloud Run revision name**, and tie that exact SHA to tag **`v0.3.0-lab7`** in the PDF Version Table.
* **Prisma, Scripts & Smoke Check:**
  * `server/prisma/schema.prisma` line 79 is comment-only (`// Note: Partial Unique Indexes...`) — no model columns change (update comment only).
  * `deploy/smoke_test.py` checks only `/api/health`, `/api/ready`, `/`, `/api/series`, optional `/api/auth/login`→`/me`→`/logout` (**Unaffected / `N/A`**).
  * `scripts/test-persistence.mjs` (`TEST-39`) creates 3 `CRY` tickets for distinct users (`collector1..3`) and joins as `collector4` (**Unaffected / `N/A`**).
* **Existing Tests Directly Touching `BR-02` / `my-ticket`:**
  * `server/tests/db-schema-and-seed.test.ts` (line 99: asserts `CRY`+`LAB` for `collector1` fails with `P2002` on `unique_active_ticket_user`)
  * `server/tests/api/join.test.ts` (`TEST-11`: asserts `CRY` then `LAB` returns `409 DUPLICATE_ACTIVE_QUEUE`)
  * `server/tests/concurrency/duplicate.test.ts` (`TEST-16`: 10× concurrent `CRY` joins)
  * `server/tests/api/my-ticket.test.ts` (`TEST-34`, `TEST-35`)
  * `client/src/tests/auth.test.tsx`, `series.test.tsx`, `ticket.test.tsx` (mock `GET /api/tickets/my-ticket` returning `{ data: { ticket: ... } }`)
  * `e2e/join-queue.spec.ts` (`TEST-19`) & `e2e/full-journey.spec.ts` (`Demo 2`): both join `CRY` and retry **`CRY`** (same series) -> `DUPLICATE_ACTIVE_QUEUE`.

### 3.2 Locked API & UI Specification (`GET /api/tickets/my-ticket` & `MyTicketPage`)
1. **Endpoint Signature (No Unused Params):** Keep `GET /api/tickets/my-ticket` with **no query parameters** (do **not** add `?seriesId=`, as nothing calls it).
2. **Deterministic Ordering & Per-Ticket `waitingAhead`:**
   * `ticket.service.ts` `getMyActiveTicket(userId)` queries `prisma.queueTicket.findMany` where `userId`, `status IN ('WAITING', 'CALLED', 'UNBOXING')`, with deterministic ordering: **`orderBy: [{ createdAt: 'asc' }, { id: 'asc' }]`** (oldest joined active ticket first).
   * If `activeTickets.length === 0`, throw `404 NO_ACTIVE_TICKET` (unchanged).
   * For each active ticket `t`, compute `waitingAhead` **individually**: if `t.status === 'WAITING'`, count `WAITING` tickets with `seriesId = t.seriesId`, `queueDate = t.queueDate`, `queueNumber < t.queueNumber`; otherwise `0`.
   * Return `200 { data: { ticket: tickets[0], tickets } }`.
3. **Frontend Multi-Ticket Polling & Timer (`MyTicketPage.tsx`):**
   * **Single Page-Level Poller:** Keep one `usePolling(..., 3000, ...)` interval calling `GET /api/tickets/my-ticket` once every 3 seconds whenever `!isLoading && tickets.length > 0` (never spawn N separate pollers).
   * **Ticket List Rendering & Fallback:** Read `res.data?.tickets ?? (res.data?.ticket ? [res.data.ticket] : [])` and render each ticket's stepper + virtual card cleanly (`tickets.map((t) => ...)`).
   * **Independent Per-Card `CountdownTimer`:** Inside each card where `t.status === 'CALLED'`, render `<CountdownTimer key={t.id} initialSeconds={120} />` keyed by `t.id` so each called ticket maintains its own 120s countdown independently across 3s polls (preserving the documented Sprint 1 minor limitation that full browser refresh resets `120s` on mount).
   * **Responsive Check:** Verify `375x667` (`AC-20`) with 2 active cards (`CRY` + `LAB`) has zero horizontal overflow.
   * **`SeriesPage.tsx` Behavior:** Leave join buttons enabled on active series so clicking `เข้าคิว` on an already-queued series continues triggering `409 DUPLICATE_ACTIVE_QUEUE` banner (preserving `TEST-19` and `Demo 2`), while joining another active series returns `201` -> `/my-ticket`.
4. **Technical Debt Items to Register in Part D (Separate From Defects):**
   * `TD-01`: Legacy singular `data.ticket` alias retained alongside `data.tickets` in `GET /api/tickets/my-ticket` (`Low` priority, remove in Sprint 3 once all tests/clients read `data.tickets`).
   * `TD-02`: Client fallback `res.data?.tickets ?? (res.data?.ticket ? [res.data.ticket] : [])` in `MyTicketPage.tsx` (`Low` priority, kept so legacy Sprint 1 component test mocks `auth.test.tsx`/`series.test.tsx`/`ticket.test.tsx` stay green; update mocks and remove fallback in Sprint 3).
   * `TD-03`: `SeriesPage.tsx` does not visually badge which series the Collector already holds an active ticket in (`Low` priority, relies on backend `409` feedback; non-blocking UX enhancement for Sprint 3).
   * `TD-04`: UI footer label in `Layout.tsx` (`PopQueue v0.2.0-lab5`, asserted by `App.test.tsx`) remains hardcoded during Lab 7 to avoid touching unrelated baseline UI tests; release traceability uses `/api/health` full SHA + footer 7-char `Commit: <sha>` + Cloud Run revision mapped to tag `v0.3.0-lab7` (`Low` priority, parameterize via build-time version or update in Sprint 3; cross-reference in Part D Known Limitations).

### 3.3 Zero-Gap Migration Order & Rollback Analysis (`0003_per_series_active_ticket_index`)
1. **Create New Index BEFORE Dropping Old Index:**
   ```sql
   -- 1. Add per-series partial unique index while unique_active_ticket_user still enforces uniqueness
   CREATE UNIQUE INDEX "unique_active_ticket_user_series"
     ON "QueueTicket"("userId", "seriesId")
     WHERE status IN ('WAITING', 'CALLED', 'UNBOXING');

   -- 2. Drop the legacy system-wide partial unique index
   DROP INDEX IF EXISTS "unique_active_ticket_user";
   ```
   *Why:* Zero unguarded constraint window during `popqueue-migrate`; existing rows trivially satisfy `(userId, seriesId)` uniqueness.
2. **Backend `P2002` & `STAFF_BUSY` Check:**
   * Update `ticket.service.ts` `joinQueue` catch block to detect exact index name `unique_active_ticket_user_series` first (matching `userId` only when `queueNumber` is absent — **never** bare `targetStr.includes('seriesId')`, which collides with `QueueTicket_seriesId_queueDate_queueNumber_key`) and map to `409 DUPLICATE_ACTIVE_QUEUE`, proven by retaining the same-series `409` assertion in `TEST-11`.
   * Add explicit regression verification that `unique_active_staff_ticket` (`isStaffBusyError` -> `409 STAFF_BUSY`, `BR-06`) remains untouched.
3. **Rollback Caveat (Document in Part A Impact & Part D Known Limitations):**
   * Rolling back the Cloud Run container via `deploy.yml` (`image_tag`) does **not** roll back SQL migration `0003`.
   * Once any Collector holds 2 active tickets in different series, re-applying the old `unique_active_ticket_user` index cannot succeed until those tickets complete; furthermore, old pre-Lab-7 container code checks `unique_active_ticket_user` or `targetStr.includes('userId')` (so if Prisma returns only the new index name `unique_active_ticket_user_series` in `meta.target`, an old image could fail to map `409` cleanly).

### 3.4 Backup Rule-Change Candidate (Conditional Only — Verify Feasibility Before Use)
If the Instructor/TA deems `D-08` (DB index + API + UI) too broad or asks to narrow scope:
* **Conditional Backup Option (`BR-02-ALT`, Must Verify 4 Constraints First):** Restrict each Collector to at most **2 joins per series per `queueDate` (`Asia/Bangkok`)** (instead of unlimited daily re-joins after `COMPLETED`), returning `409 DAILY_SERIES_LIMIT_REACHED`. **Do NOT activate automatically without verifying all 4 constraints first:**
  1. *Contract grounding:* Unlimited same-day re-join after `COMPLETED` is currently implicit (`BR-02` + `db-schema-and-seed.test.ts` test) rather than an explicitly numbered rule in `PopQueue_Deliverable_1_Master.md` — confirm TA accepts it as a Sprint 1 rule change rather than an implicit/new rule.
  2. *Concurrency safety (`NFR-04`):* Partial unique index `unique_active_ticket_user` does **not** protect `COMPLETED` quota counts, so `count()` + `insert()` can race under 10 parallel requests unless guarded with `SERIALIZABLE` transaction or row locking on `User`/`QueueCounter`.
  3. *Error catalog addition:* Requires adding a new error code (`DAILY_SERIES_LIMIT_REACHED`) to Master §7 Error Catalog.
  4. *Sprint 2 interaction:* Must explicitly specify in the revised contract whether `CANCELLED` / `NO_SHOW` tickets count toward the daily quota.

---

## 4. Lab 7 Impact Table & Full Test Impact Matrix (Part A)

### 4.1 Requirement-to-Module Impact Table (Lab 7 §3.1 Format)
| Req ID | Feature | Affected SRS / Feature SDS / System SDS Sections | Affected AC | STS Test IDs | Code Modules & Persistence / Role / Caller Notes |
| :--- | :---: | :--- | :---: | :--- | :--- |
| **BR-02** | `F-02` | Master Part A §6 (`BR-02`), §8 (`D-06`, `D-08`); Part C §2, §4 (`unique_active_ticket_user_series`); Part E §2.3, §2.5, §2.8; `srs.md`, `system-sds.md` | `AC-11`, `AC-16`, `AC-19` | `TEST-11` *(rev)*, `TEST-16` *(ext)*, `TEST-19` *(ext)*, `db-schema-and-seed` *(rev)* | `0003` migration (`QueueTicket`), `schema.prisma` comment, `ticket.service.ts` (`joinQueue` P2002), `SeriesPage.tsx` (unchanged error alert), `smoke_test.py` (`N/A`: checks health/ready/series/auth only), `test-persistence.mjs` (`N/A`: distinct users) |
| **FR-04** | `F-02` | Master Part A §5 (`FR-04`); Part E §2.3 | `AC-10`, `AC-11` | `TEST-10` *(keep)*, `TEST-11` *(rev)* | `ticket.controller.ts`, `ticket.service.ts`; `SeriesPage` navigation to `/my-ticket` unchanged |
| **FR-05** | `F-04` | Master Part A §5 (`FR-05`), Part C §6–§8; Part E §4.3, §4.6, §4.7; `traceability.md` | `AC-34`, `AC-35`, `AC-20` | `TEST-34` *(ext)*, `TEST-35` *(keep)*, `TEST-20` *(reg)* | `ticket.service.ts` (`getMyActiveTicket`), `ticket.controller.ts`, `client/src/types/index.ts`, `MyTicketPage.tsx` (single 3s poller, ordered list, `<CountdownTimer key={t.id} />`), `LoginPage.tsx` (unchanged via `data.ticket`) |
| **BR-04, BR-05, BR-06, BR-07** | `F-01`, `F-03`, `F-04` | **Unchanged (`N/A` for rule edit)** — Master Part A §6, Part C §7 | `AC-08`, `AC-14`, `AC-24..31`, `AC-35` *(403)*, `AC-37`, `AC-38` | `TEST-08U`, `14`, `24..32`, `35` *(403)*, `37`, `38`, `db-schema` (`BR-06`) | **Roles / Ownership:** Collector blocked on `/api/staff/*` & cross-user `tickets/:id` (`403`); Box Master blocked on `join`/`my-ticket` (`403`) & still restricted to 1 serving ticket (`409 STAFF_BUSY`). Protected by regression suite |
| **BR-01, BR-03, BR-09** | `F-02`, `F-03` | **Unchanged (`N/A` for rule edit)** | `AC-12`, `AC-15`, `AC-17`, `AC-18`, `AC-28` | `TEST-12`, `15`, `17`, `18`, `28` | Atomic daily numbering, closed series `SKP` (`409 SERIES_CLOSED`), and strict state lifecycle unchanged; protected by regression suite |

### 4.2 Complete Test Impact Matrix (`AGENTS.md` #5 & Lab 7 §3.2 Justification)
| Test File & ID | Pre-Change Expectation | Disposition | Exact Action & Justification |
| :--- | :--- | :---: | :--- |
| `server/tests/db-schema-and-seed.test.ts` (`BR-02` test) | Creating `CRY` + `LAB` directly for `collector1` throws `P2002` | **Revised (Legitimate)** | Assert `CRY` + `LAB` succeeds, while `CRY` + second active `CRY` throws `P2002` on `unique_active_ticket_user_series`; keep `BR-06` test intact |
| `server/tests/api/join.test.ts` (`TEST-11`) | `CRY` then `LAB` (`crossRes`) returns `409 DUPLICATE_ACTIVE_QUEUE` | **Revised (Legitimate — `[RED]` Target)** | Update `crossRes` assertion from `409` to `201` (`LAB-001`, active count = 2); **retain** same-series `CRY` -> `CRY` `409` + counter rollback assertion; justified in Contract PR & PR-2 description per Lab 7 §3.2 |
| `server/tests/concurrency/duplicate.test.ts` (`TEST-16`) | 10 concurrent `CRY` joins -> 1×`201`, 9×`409` | **Preserved + Extended** | Keep existing 10× same-series race test intact; add concurrent distinct-series test (`CRY` + `LAB` -> `2 x 201`) |
| `server/tests/api/my-ticket.test.ts` (`TEST-34`, `TEST-35`) | `GET /api/tickets/my-ticket` returns `{ data: { ticket } }` or `404` / `403` | **Preserved + Extended** | Keep `data.ticket` & `404`/`403` tests untouched; add test asserting `data.tickets` returns 2 tickets ordered `createdAt ASC` with per-series `waitingAhead`, shrinking to 1 after one completes |
| `client/src/tests/ticket.test.tsx` | Single ticket render & `404` empty state (`data.ticket`) | **Preserved + Extended** | Keep existing mocks untouched (via fallback); add multi-ticket render test (`CRY` `CALLED` + `LAB` `WAITING`) verifying independent `CountdownTimer` & order |
| `client/src/tests/auth.test.tsx` & `series.test.tsx` | Mock `GET /api/tickets/my-ticket` returning `{ data: { ticket: ... } }` | **Preserved (Untouched)** | Protected by `{ ticket: tickets[0], tickets }` API shape & client fallback (`TD-02`) |
| `e2e/join-queue.spec.ts` (`TEST-19`) | Join `CRY` -> `/my-ticket` -> retry `CRY` -> `DUPLICATE_ACTIVE_QUEUE` | **Preserved + Extended** | Keep same-series duplicate check intact; add multi-series flow joining `LAB` after `CRY` |
| `e2e/responsive.spec.ts` (`TEST-20`) | `375x667` zero horizontal overflow across Sprint 1 screens | **Preserved + Extended** | Extend/verify `/my-ticket` at `375x667` (`AC-20`) with 2 active cards (`CRY` + `LAB`) has zero horizontal overflow |
| `e2e/full-journey.spec.ts` (`TEST-33` Demo 1 & Demo 2) | Demo 1 (`TEST-33` full `WAITING->COMPLETED` polling journey) & Demo 2 (`CRY` retry reject) | **Preserved (Untouched)** | Full regression proof that end-to-end Collector+Staff journey and same-series rejection still pass |
| `ticket-security.test.ts`, `staff-*.test.ts`, `call-next.test.ts`, `numbering.test.ts`, `security/*.test.ts` | Ownership (`403`), Staff scope (`403`), `STAFF_BUSY` (`409`), `1..50` numbering | **Preserved (Untouched)** | Full regression proof that unrelated Sprint 1 security, role, and concurrency rules remain unbroken |

---

## 5. Step-by-Step Schedule (22–29 Nov 2026)

### Phase 0 — Label, Change Request, TA Request & Sync *(Sun 22 Nov — Start Immediately)*
1. Create GitHub label `lab7` (`gh label create lab7 ...` — ask user approval per §0).
2. Open Change Request Issue (`#CR`) from `LAB7/plan/CHANGE_REQUEST_ISSUE_DRAFT.md` (ask user approval per §0).
3. Send TA/Instructor approval message + Issue `#CR` link immediately.
4. Open **`PR-Sync` (`main` → `lab5-staging`)** (`@Theerawat82` opens; `@apfirst13` approves & merges `Create a merge commit`; verify no `"approval not counted"` warning) + `git fetch origin` locally.
5. *(Track 2 starts offline / unmerged branches)* Partner begins Sprint 2 contracts (`F-05..F-08`) referencing `BR-02 v2`.
6. *(Optional pre-drafting)* Draft `PopQueue_Deliverable_1_Master.md` edits locally (do **not** commit until TA approval arrives!).

### Phase 1 — Part A: Contract Revision & Review *(Mon 23 – Tue 24 Nov, STRICTLY AFTER TA Written Approval)*
1. Screenshot TA/Instructor written approval (showing approver name, date & time) and post/record it in Issue `#CR`.
2. Branch `feature/<CR#>-br02-contract` from synced `lab5-staging` (`@Theerawat82`).
3. Commit (`Refs #<CR>` in message) Impact Analysis table, Test Impact Matrix, revised `BR-02`/`FR-04`/`FR-05`/`D-06`/`D-08`, SDS §2/§4/§6–§8, `F-02`/`F-04`, revised `AC-11`/`AC-16`/`AC-19`/`AC-34` & `TEST-11`/`TEST-16`/`TEST-19`/`TEST-34` (`AC-35`/`TEST-35` reviewed unchanged as Preserved per §4.1–§4.2), Revision History, `srs.md`, `system-sds.md`, `traceability.md`, and `docs/sprints/sprint-1/PROJECT_STATE.md`.
4. Open **`PR-1`** (`Refs #<CR>` in body) → `@apfirst13` leaves substantive review comments on contract completeness/boundaries → approves & merges to `lab5-staging` via **`Create a merge commit`**.
5. Record the merged `lab5-staging` SHA as the **`Pre-Change Code SHA`** (used as the baseline before `[RED]`).

### Phase 2 — Part B: `[RED]` → `[GREEN]` → Regression → Release & Live Checks *(Tue 24 – Thu 26 Nov)*
1. **`PR-2` Backend + Migration (`feature/<CR#>-br02-backend`, sole author `@apfirst13`):**
   * Commit 1 `[RED]` (`Refs #<CR>` in message): Update `TEST-11` (`join.test.ts`), `db-schema-and-seed.test.ts`, and add multi-series tests in `duplicate.test.ts` & `my-ticket.test.ts`. Run against this commit (whose app/DB code still matches `Pre-Change Code SHA` / `2aee62b`) -> record **both** **`Pre-Change Code SHA`** and **`RED Test Commit SHA`**, capture **RED failure output** (`Expected 201, Received 409`), and save **`git diff --stat <Pre-Change-SHA>..<RED-SHA>`** proving **only test files changed** (zero changes to `server/src/`, `server/prisma/`, or `client/src/`).
   * Commit 2 `[GREEN]` (`Refs #<CR>` in message): Add migration `0003` (`CREATE` before `DROP`), update `schema.prisma` comment, update `ticket.service.ts` (`P2002` + `getMyActiveTicket` ordered `createdAt ASC` returning `{ ticket, tickets }`), add `STAFF_BUSY` assertion, update `PROJECT_STATE.md`.
   * **Mandatory Backend Gate:** Run **full server Vitest suite (`npm test --workspace=server`)** + `npm run typecheck --workspace=server` + `npm run lint --workspace=server` and capture exact `pass/fail/skip` counts!
   * Open `PR-2` (`Refs #<CR>` in body) → `@Theerawat82` performs 5-Lenses review -> green `test-and-docker` CI -> merges to `lab5-staging` via **`Create a merge commit`**.
2. **`PR-3` Frontend UI + E2E (`feature/<CR#>-br02-ui-e2e`, sole author `@Theerawat82`):**
   * Commit (`Refs #<CR>` in message): Update `client/src/types/index.ts`, `MyTicketPage.tsx` (single 3s poller, ordered list, `<CountdownTimer key={t.id} />`), `client/src/tests/ticket.test.tsx`, `e2e/join-queue.spec.ts`, `e2e/responsive.spec.ts` (`TEST-20`: `375x667` with 2 active cards), `PROJECT_STATE.md`.
   * Run full monorepo regression (`npm test`, `npm run typecheck`, `npm run lint`, `npm run build`, `npm run test:e2e`) -> record commands, tool versions, and `pass/fail/skip` counts.
   * Open `PR-3` (`Refs #<CR>` in body) → `@apfirst13` performs 5-Lenses review -> green `test-and-docker` CI -> merges to `lab5-staging` via **`Create a merge commit`**.
   * **Phase 2 Deadline Scope-Cut Guardrail (`Thu 26 Nov 12:00 ICT`):** If `PR-3` is not yet merged by **Thu 26 Nov 12:00 (ICT)**, defer non-mandatory UX polish (e.g., extra multi-card styling tweaks or helper specs beyond core `TEST-19`/`TEST-20`/`TEST-33` & `375x667` overflow verification) so `PR-4`, `v0.3.0-lab7` deploy, and Part C snapshot lock complete on time before Sprint 2 merges.
3. **Lab 6 Gate Check & Release (`PR-4`: `lab5-staging` → `main`):**
   * Confirm Lab 6 Issue `#47` closed *(or execute §1.2 Wed 25 Nov TA consultation / Lab 6 hotfix contingency)*.
   * In the normal flow, `@apfirst13` opens `PR-4` (`lab5-staging` → `main`) with **`Closes #<CR>`** in PR description, and **`@Theerawat82`** approves & merges to `main` via **`Create a merge commit`** *(apply §1.1's dynamic opener/approver swap if a Lab 6 hotfix back-merge changed `lab5-staging` HEAD author)*.
   * Wait for `Deploy demo` workflow -> save **`popqueue-migrate` Cloud Run Job log** confirming migration `0003` succeeded on Cloud SQL -> confirm **Issue `#CR` state is `CLOSED`**!
   * Create & push annotated tag **`v0.3.0-lab7`** on the merged `main` commit (after user approval per §0).
4. **Live Cloud Run Post-Deploy Checks (Immediately on `v0.3.0-lab7` Revision Before Sprint 2 Deploys):**
   * Capture exact Cloud Run revision name, `GET /api/health` (`commit` == `v0.3.0-lab7` SHA), and UI footer `Commit: <7-char>`.
   * **Changed behavior check (synthetic accounts):** `collector1` joins `CRY` (`201`) -> joins `LAB` (`201`) -> `/my-ticket` renders both active cards -> retrying `CRY` returns `409 DUPLICATE_ACTIVE_QUEUE` -> `staff_crybaby` & `staff_labubu` complete both tickets cleanly.
   * **Preserved Sprint 1 access/domain check:** `collector2` -> `GET /api/tickets/<c1_id>` (`403 FORBIDDEN_OWNERSHIP`), `staff_crybaby` -> `LAB` (`403 FORBIDDEN_SERIES`), `collector1` -> `/api/staff/tickets` (`403 FORBIDDEN_ROLE`).
   * **Automated Tests Snapshot for Part C:** Run & record `npm test` + `npm run test:e2e` on the **exact released `v0.3.0-lab7` commit**.
   * **Record Part C Snapshot Closure Timestamp** (exact `YYYY-MM-DD HH:MM ICT` right after live verification completes and **after confirming Issue `#CR` is `CLOSED`** so it counts as a Completed Issue) and unlock Track 2 Sprint 2 merges into `lab5-staging`!

### Phase 3 — Part C & D: Metrics, Readiness, Retrospective & PDF *(Fri 27 – Sun 29 Nov)*
1. **Part C (5 Dated Metrics):**
   * **Observation Window:** **`2026-11-20 00:00 ICT` (`2026-11-19T17:00:00Z`) to `<exact v0.3.0-lab7 snapshot timestamp ICT>`** (captured right after live verification & `#CR` closure, before Sprint 2 merges). *Boundary verified against GitHub:* last Lab 5 `Deploy demo` finished `2026-11-14 00:32 ICT` (`2026-11-13T17:32:09Z`), followed only by `16 Nov` Dependabot, while first post-Lab-5 work (`0405c38`, `PR #44`, `Issue #46`, `Issue #47`, `PR #50`) started `2026-11-20 19:20 ICT`.
   * **Strict Timezone & Scope Rule:** Convert **all** GitHub UTC (`Z`) timestamps consistently to **`ICT (UTC+7)`** across every Part C calculation and embedded table before summarizing the **5 required Lab 7 metrics** (*Open/Completed Issues, Merged Pull Requests, Automated Tests Pass/Fail/Skip, UAT/Maintenance Defects Found & Resolved, and CI Pass Rate*). Do **not** add unrequested DORA metrics (Lead Time, MTTR, Deployment Frequency) unless explicitly marked as out-of-scope note.
   * Embed compact reconcilable source lists (Issues, PRs, `v0.3.0-lab7` `npm test` summary, UAT defect snapshot `#46`/`#47`, CI run IDs) directly in PDF; write `<= 100`-word interpretation with owner & next milestone.
2. **Part D & Self-Contained PDF (Due Sun 29 Nov 23:59 on LEB2):**
   * Cover metadata (Team, Student IDs, Theme, Repo URL, Deployed URL + revision, `v0.1.0-sprint1` / Lab 6 baseline / Pre-change SHA / `RED` SHA / `v0.3.0-lab7`), Contents Table (Parts A–D, page ranges, Evidence IDs), embedded old/new contract excerpts, **embedded PR review comments**, `[RED]`/`[GREEN]` logs, `git diff --stat <Pre-Change>..<RED>` & implementation diff, `popqueue-migrate` `0003` log, live checks, Readiness Checklist (`READY`/`NOT READY` for maintained Sprint 1 scope), Technical Debt Table (`TD-01`..`TD-04`), 3 retrospective answers (1–2 sentences each), Version Table, Contribution Table, AI-Use Declaration (3 columns), Known Limitations.
   * **Private Test Account Credentials:** Submit synthetic Collector / Box Master test account credentials strictly through the course's **private submission channel** (never include passwords/tokens/real secrets inside the PDF or public repository).

---

## 6. Lab 7 §5 Pre-Submission Audit Checklist

- [ ] Change Request changes Sprint 1 `BR-02`, records TA written approval **dated before** `PR-1` contract commit, and identifies `v0.1.0-sprint1` + Lab 6 baseline + `Pre-Change Code SHA`.
- [ ] `PR-1` (Contract + Impact Table + Test Impact Matrix + teammate review, `Refs #<CR>`) precedes `[RED]`/`[GREEN]` commits in Git history.
- [ ] Meaningful `[RED]` test records **separate** `Pre-Change Code SHA` and `RED Commit SHA` + **`git diff --stat <Pre-Change>..<RED>`** proving test-only delta (`Expected 201, Received 409`); `[GREEN]` passes with bounded diff; `PR-2` server suite + `PR-3` full regression + `v0.3.0-lab7` post-release suite run cleanly with exact counts/commands recorded.
- [ ] All PRs (`PR-Sync`, `PR-1`, `PR-2`, `PR-3`, `PR-4`) merge via **`Create a merge commit`**, link `Refs #<CR>` (`PR-1..3` + commits) and `Closes #<CR>` (`PR-4`), confirm **`#CR` is `CLOSED`** before snapshot, pass CI, deploy via `deploy.yml` (`popqueue-migrate` `0003` log captured), tag `v0.3.0-lab7`, and verify live on exact Cloud Run revision before Sprint 2 merges.
- [ ] Five Part C metrics (strictly Issues, PRs, Test Results, UAT/Maintenance Defects, CI Pass Rate) use the locked **`2026-11-20 00:00 ICT`** window & `v0.3.0-lab7` test run, convert all UTC timestamps to `ICT (UTC+7)`, reconcile directly with embedded tables, and have `<= 100`-word interpretation.
- [ ] Part D includes `READY`/`NOT READY`, Technical Debt (`TD-01`..`TD-04`, separate from defects), 3 brief retrospective answers, Version Table, Contribution Table, AI-Use Declaration, embedded PR review text; synthetic test credentials sent via **private course channel only** with zero secrets/credentials inside the PDF or public repo.
