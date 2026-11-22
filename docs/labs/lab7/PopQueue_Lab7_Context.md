# PopQueue – Lab 7 Canonical System, Repo & Maintenance Context (Team BFteam)

> **Purpose of This File:** Consolidated, zero-noise technical & repository reference for **CPE 334 Lab 7 (Software maintenance metrics and release readiness)**.  
> Attach this file alongside **`Lab_7_Sprint_1_Maintenance (1).pdf`**, **`Lecture+13.+Metrics+and+Maintenance.pdf`**, and **`qdrive-license-queue/AGENTS.md`** when planning, reviewing, or auditing Lab 7 tasks with Claude.  
> **Security Notice:** Never put real user passwords, JWT tokens, connection strings, or GCP secrets into AI chats, Git, or the Lab 7 PDF. Use synthetic test data only.

---

## 1. Project, Team, Repository & Version Lineage

| Field | Value |
| :--- | :--- |
| **Course / Theme** | CPE 334 (Section 1), Semester 1/2026, KMUTT — **Theme 9: Queue and Service Management System** |
| **Product Name & Context** | **PopQueue** — On-site Virtual Waiting Queue for an **Art Toy Live Unboxing Station** (same-day queue after cashier payment; no advance booking, no payment) |
| **Team Name** | **BFteam** |
| **Members** | 1. นายธีรวัฒญ์ รุ่งสว่าง (GitHub `@Theerawat82`)<br>2. นายอภิวัชร์ ปัณฐธนาพัฒน์ (GitHub `@apfirst13`) |
| **GitHub Repository (Public)** | `https://github.com/apfirst13/PopQueue_BFteam` |
| **Workspace Path (Local)** | `qdrive-license-queue/` (monorepo root) |
| **Live Production URL (Cloud Run)** | Primary: `https://popqueue-5now4hkvsa-as.a.run.app`<br>Regional: `https://popqueue-902539659249.asia-southeast1.run.app` |
| **Sprint 1 Baseline Tag** | `v0.1.0-sprint1` (merge commit `d946159ba82a249c195730a3b702cf0f68e96e2d`, PR `#23`, 2026-11-07) |
| **Lab 5 Release Tag** | `v0.2.0-lab5` (merge commit `bf52c9b969d905ba6f21bcc22a460f0db3dd5172`, PR `#43`, 2026-11-13) |
| **Latest `origin/main` & Live Deployed Commit** | **`2aee62b607b475a60be4b7a08980ec752d28941a`** (PR `#48` → `lab5-staging` `70f942b`, then PR `#50` → `main` `2aee62b`, CD `Deploy demo #44916394495`, 2026-11-21) |
| **Canonical Engineering Docs** | • Sprint 1 Master Spec: `qdrive-license-queue/docs/sprints/sprint-1/PopQueue_Deliverable_1_Master.md`<br>• Lab 5 Deployment Spec: `qdrive-license-queue/docs/labs/lab05/deployment.md`<br>• Agent Rules: `qdrive-license-queue/AGENTS.md` |

### Warning Against Stale / Superseded PDFs
* **Ignore** `PopQueue_Part_A_SRS_Draft.pdf` (stale Nov 1 draft referencing Next.js 14, TailwindCSS, `@popqueue.com` email login, 2 series, and `AC-01..16`).
* **Ignore for Lab 7 planning:** `LAB5/01_SE_Lab_5_updated.pdf`, `LAB5/03_Student-Guide-GCP-Deployment-and+CI+CD-V1_1.pdf` (needed only if troubleshooting GCP/CI/rollback/pause), and `LAB6/Lab_6_Sprint_1_UAT.pdf`.
* **Actual implemented codebase (`2aee62b`):** **Express 4 + TypeScript + Prisma 5.18 + PostgreSQL 16**, **React 18 + Vite + Custom CSS (`tokens.css`/`index.css`)**, **`username` + `password` login**, **3 seeded series (`CRY`, `LAB`, `SKP`)**, and **`AC-01`–`AC-39`**.

---

## 2. Current Pre-Planning Repo & Lab 6 Status (Snapshot: 22 Nov 2026)

1. **Pending Lab 6 Retest Gate (Team Omega-3 — `@guluJa`, `@PhraewaS`):**
   * GitHub Issue `#47` (`[Lab6 Blind UAT] Login ไม่ส่ง password แล้วตอบ HTTP 500 แทน 400 VALIDATION_ERROR`) is **`OPEN`**, awaiting Omega-3's independent re-test & final Sprint 1 acceptance decision on live Cloud Run (`https://popqueue-5now4hkvsa-as.a.run.app`, commit `2aee62b`).
   * Note: Compared with `v0.2.0-lab5` (`bf52c9b`), `origin/main` (`2aee62b`) differs in code/tests only by the 3 regression test additions from PR `#48`/`#50` (`server/tests/unit/login-schema.test.ts`, `server/tests/api/auth.test.ts`, `client/src/tests/auth.test.tsx`), because PR `#48` restored the password validation that `4c5bb50` had temporarily disabled for the Lab 6 Special Exercise.
   * **CRITICAL DEPLOY GUARDRAIL:** `.github/workflows/deploy.yml` auto-deploys on every `push` to `main`. **Do NOT merge anything into `main`** (and avoid creating stray queues on live Cloud Run) until Omega-3 completes retesting `2aee62b` and posts their final acceptance decision on Issue `#47`.
2. **Branch & Local Sync State (Must Fix Before Lab 7 Branching):**
   * Local `HEAD` is currently checked out on `fix/47-login-password-validation` (`72e1bb5`); local `main` (`bf52c9b`) and local `lab5-staging` (`e3a8eb4`) are behind `origin`. Run `git fetch origin` before creating any Lab 7 branch.
   * `origin/lab5-staging` (`70f942b`) has **`0` file differences** vs `origin/main` (`2aee62b`), but is **3 merge commits behind** `origin/main` (`#39`, `#43`, `#50`; PR `#51` sync was previously closed). Because `protect-main` requires branches to be up to date, `main` must be back-merged into `lab5-staging` before any Lab 7 release PR to `main`.
   * `origin/lab6-docs` (`c20c93f`) touches only `docs/labs/lab6/...` (`0` overlap with `server/`, `client/`, or `e2e/`).

---

## 3. Lab 5 CI/CD, Branch Rulesets & GCP Architecture (Reused in Lab 7)

* **GCP Project:** `cpe334-bfteam` (Number `902539659249`), Region `asia-southeast1`
* **Cloud Run Service:** `popqueue` (`min-instances=0`, `max-instances=3`, `512Mi`, `1 vCPU`, port `3000`, public access)
  * `GET /api/health` (and `/api/v1/health`) → `200 {"status":"ok","commit":"<GIT_SHA>"}`
  * `GET /api/ready` → `200 {"db":"connected"}` (`503` if DB unreachable)
  * UI Footer shows `PopQueue v0.2.0-lab5 • Commit: <7-char>` (`VITE_GIT_SHA`)
* **Cloud SQL:** `popqueue-pg` (`PostgreSQL 16.15` Enterprise, `db-f1-micro`, 10 GB SSD, DB/user `popqueue`)
* **Cloud Run Migration Job:** `popqueue-migrate` — runs `npx prisma migrate deploy && npm run prisma:seed` (non-destructive; idempotent)
* **CI Workflow (`.github/workflows/ci-docker.yml`):**
  * Triggers on `workflow_call` and `pull_request` to `main` and `lab5-staging`
  * Required job name: **`test-and-docker`** (deploy script offline tests + `postgres:16-alpine` container running `prisma migrate deploy` & `prisma:seed` + server Vitest + client Vitest & Vite build + root `docker build`)
* **CD Workflow (`.github/workflows/deploy.yml`):**
  * Triggers on `push` to `main` (and `workflow_dispatch` with optional 40-char `image_tag` rollback)
  * Authenticates via keyless WIF (`github-actions` / `github-main`, GitHub Environment `demo`), runs `test-and-docker`, builds/pushes image tagged with full commit SHA, executes `popqueue-migrate --wait`, deploys Cloud Run by `@sha256` digest, runs `deploy/smoke_test.py`
* **GitHub Rulesets (`protect-staging` on `lab5-staging`, `protect-main` on `main`):**
  * Require Pull Request, **1 non-author approving review** (`require_last_push_approval`), green `test-and-docker` check, up-to-date branch, and empty bypass list (no direct pushes).

---

## 4. Sprint 1 Implemented Baseline (Target of Lab 7 Maintenance)

### 4.1 Implemented Requirements & Feature Scope (`F-01`–`F-04`)
* **`F-01` Authentication & Role Identity:**
  * `FR-01` (login/logout with `tokenVersion` revocation), `FR-02` (`GET /api/auth/me`), `NFR-01` (Bcrypt cost ≥ 10), `NFR-02` (401/403 on protected routes)
* **`F-02` Queue Discovery & Safe Joining:**
  * `FR-03` (public `GET /api/series` with `isActive` and today's `waitingCount`)
  * `FR-04` (Collector `POST /api/tickets/join` → `WAITING`)
  * `BR-01` (daily per-series sequential numbering starting at 1, `Asia/Bangkok` midnight reset, no reuse)
  * **`BR-02` (Currently Implemented):** 1 user can hold **at most 1 active ticket (`WAITING`, `CALLED`, `UNBOXING`) across the entire system**, enforced by DB partial unique index `unique_active_ticket_user` → `409 DUPLICATE_ACTIVE_QUEUE`
  * `BR-09` (closed series `isActive=false` rejects join with `409 SERIES_CLOSED`)
  * `NFR-03` (50 distinct concurrent joins → `1..50`), `NFR-04` (10 same-user concurrent joins → 1×`201`, 9×`409`), `NFR-06` (`375px` responsive)
* **`F-03` Box Master Service Counter:**
  * `FR-07` (`GET /api/staff/tickets` scoped by `StaffSeriesAssignment`), `FR-08` (`call-next` FIFO), `FR-09` (`start-unboxing`), `FR-10` (`complete`)
  * `BR-03` (strict lifecycle `WAITING → CALLED → UNBOXING → COMPLETED`, else `400 INVALID_STATE_TRANSITION`)
  * `BR-05` (`403 FORBIDDEN_SERIES` cross-series), `BR-06` (max 1 `CALLED`/`UNBOXING` per staff via `unique_active_staff_ticket` → `409 STAFF_BUSY`), `BR-07` (`403 FORBIDDEN_NOT_HANDLER`)
* **`F-04` Ticket Inspection & Ownership:**
  * `FR-05` (`GET /api/tickets/my-ticket` returns active ticket + `waitingAhead` or `404 NO_ACTIVE_TICKET`)
  * `FR-06` (`GET /api/tickets/:id` with Collector ownership `403 FORBIDDEN_OWNERSHIP` / Box Master series scope `403 FORBIDDEN_SERIES`)
  * `BR-04` (role isolation: Collector blocked `403` on `/api/staff/*`; Box Master blocked `403` on `join`/`my-ticket`)
  * `NFR-05` (persistence across DB container restart)

> **Lab 7 Scope Reminder:** Sprint 2 (`F-05` Cancel `FR-11`, `F-06` 120s No-Show `FR-12`/`BR-08`, `F-07` Public Board `FR-13`) and Sprint 3 (`F-08` Analytics `FR-14`, `F-09` Series Toggle `FR-15`, `NFR-07` Rate Limit) are **Deliverable 2 / Final Delivery backlog** and **do NOT qualify** as the Lab 7 change (`Lab_7_Sprint_1_Maintenance (1).pdf` §2: *"Simply completing an unchanged Sprint 2/3 backlog feature does not qualify."*).

### 4.2 Database Schema & Partial Unique Indexes
* **Models (`server/prisma/schema.prisma`):** `User` (`Role`: `COLLECTOR`, `BOX_MASTER`), `Series` (`CRY`, `LAB`, `SKP`), `StaffSeriesAssignment`, `QueueTicket` (`TicketStatus`: `WAITING`, `CALLED`, `UNBOXING`, `COMPLETED`, `CANCELLED`, `NO_SHOW`), `QueueCounter`.
* **Migration `20261101145503_0002_partial_unique_indexes/migration.sql`:**
  ```sql
  -- BR-02: Partial Unique Index for collector active tickets
  CREATE UNIQUE INDEX unique_active_ticket_user ON "QueueTicket"("userId")
  WHERE status IN ('WAITING','CALLED','UNBOXING');

  -- BR-06: Partial Unique Index for staff active ticket handling
  CREATE UNIQUE INDEX unique_active_staff_ticket ON "QueueTicket"("handledByStaffId")
  WHERE status IN ('CALLED','UNBOXING');
  ```

### 4.3 Implemented Endpoints, UI Routes & Key Source Files
* **API Routes (`server/src/routes/`):**
  * Auth: `POST /api/auth/login`, `POST /api/auth/logout`, `GET /api/auth/me`
  * Series: `GET /api/series`
  * Tickets (`ticket.routes.ts` → `ticket.controller.ts` → `ticket.service.ts`): `POST /api/tickets/join`, `GET /api/tickets/my-ticket`, `GET /api/tickets/:id`
  * Staff (`staff.routes.ts` → `staff.controller.ts` → `staff.service.ts`): `GET /api/staff/tickets`, `POST /api/staff/call-next`, `POST /api/staff/tickets/:id/start-unboxing`, `POST /api/staff/tickets/:id/complete`
* **Client Pages (`client/src/pages/`):** `LoginPage.tsx` (redirects Collector to `/my-ticket` if `getMyTicket()` succeeds, else `/series`), `SeriesPage.tsx` (`joinQueue` → navigates to `/my-ticket`), `MyTicketPage.tsx` (3s polling on single active ticket, `<CountdownTimer initialSeconds={120} />`), `StaffCounterPage.tsx`, `ForbiddenPage.tsx`.
* **Automated Tests & Commands (Monorepo Root `package.json`):**
  * `npm test` (runs `vitest run` in `server` and `client`)
  * `npm run typecheck` | `npm run lint` | `npm run build`
  * `npm run test:e2e` (`playwright test --config=e2e/playwright.config.ts`)
  * `npm run test:persistence` (`node scripts/test-persistence.mjs`)
  * Server tests (`server/tests/`): `api/auth.test.ts`, `api/series.test.ts`, `api/join.test.ts`, `api/my-ticket.test.ts`, `api/ticket-detail.test.ts`, `api/ticket-security.test.ts`, `api/queue-reset.test.ts`, `api/staff-tickets.test.ts`, `api/call-next.test.ts`, `api/staff-transition.test.ts`, `concurrency/numbering.test.ts`, `concurrency/duplicate.test.ts`, `concurrency/call-next-concurrency.test.ts`, `security/password-hash.test.ts`, `security/unauthenticated.test.ts`, `unit/login-schema.test.ts`, `unit/queue-date.test.ts`, `unit/role-guard.test.ts`, `unit/state-machine.test.ts`, plus root server unit tests (`clock.test.ts`, `db-schema-and-seed.test.ts`, `env.test.ts`, `error-handler.test.ts`, `health.test.ts`).

---

## 5. Planned Lab 7 Change Candidate (`D-08`) & Technical Impact Map

In `PopQueue_Deliverable_1_Master.md` (Part A §8 `D-08` & Part B `G-06`), the team pre-noted a candidate Lab 7 rule change (**still awaiting Instructor/TA approval**):

* **Candidate Rule Change (`BR-02`):**
  * **OLD Rule (Sprint 1):** A Collector may hold **at most 1 active ticket (`WAITING`, `CALLED`, `UNBOXING`) across the entire system** (joining a second series while holding an active ticket in the first series returns `409 DUPLICATE_ACTIVE_QUEUE`).
  * **PROPOSED NEW Rule (`D-08`):** A Collector may hold **at most 1 active ticket per Series** (joining `LAB` while holding an active ticket in `CRY` is **allowed**, while joining `CRY` again while holding an active ticket in `CRY` still returns `409 DUPLICATE_ACTIVE_QUEUE`).
* **Key Impact Areas if `D-08` is Chosen (to verify in Impact Analysis & Contract Revision):**
  1. **Database / Migration:** Replace `unique_active_ticket_user` on `("userId")` with a per-series partial unique index on `("userId", "seriesId") WHERE status IN ('WAITING','CALLED','UNBOXING')` (reversible/clean SQL migration; check `popqueue-migrate` behavior on existing Cloud SQL data).
  2. **Backend (`ticket.service.ts`):**
     * `joinQueue`: `P2002` error mapping for `DUPLICATE_ACTIVE_QUEUE` (verify index/constraint name check in `catch` block).
     * **`getMyActiveTicket` (`GET /api/tickets/my-ticket`) — CRITICAL CONTRACT DECISION:** Currently uses `findFirst` ordered by `createdAt: 'desc'` and returns a single `{ data: { ticket } }`. With per-series active tickets, a Collector can have >1 active ticket simultaneously (e.g., `CRY` + `LAB`)! Must decide cleanly whether `/api/tickets/my-ticket` remains backward-compatible / adds `?seriesId=...` / returns `tickets[]` (or adds a list endpoint), and document exact API contract changes in SRS/SDS/AC/STS before coding.
  3. **Frontend UI (`SeriesPage.tsx`, `MyTicketPage.tsx`, `LoginPage.tsx`, `client/src/api/ticket.api.ts`):** How Collectors view multiple active tickets across series on `/my-ticket` and whether `/series` indicates which series the Collector already holds an active ticket in.
  4. **Contracts & Tests (`PopQueue_Deliverable_1_Master.md`):** `BR-02`, `FR-04`, `FR-05`, `D-06`, `D-08`, `AC-11`/`TEST-11`, `AC-16`/`TEST-16`, `AC-19`/`TEST-19`, `AC-34`/`TEST-34`, `AC-35`/`TEST-35` (plus preserving `BR-01`, `BR-03`, `BR-04`, `BR-05`, `BR-06`, `BR-07`, `BR-09`, `AC-37` cross-user isolation, and `403` role guards).

---

## 6. Repository Records Snapshot (Reference for Lab 7 Part C Metrics)

Exact verifiable GitHub records available in `apfirst13/PopQueue_BFteam` as of `2026-11-22`:
* **Issues:**
  * Sprint 1: `#2`..`#11` (all `CLOSED`)
  * Lab 5: `#24`, `#25`, `#27`..`#32` (all `CLOSED`)
  * Lab 6: `#46` (`CLOSED`, 2026-11-20), `#47` (`OPEN`, created `2026-11-22T03:02:24Z`, awaiting Omega-3 retest)
* **Pull Requests:**
  * Lab 5 merged PRs: `#26`, `#33`, `#34`, `#35`, `#37`, `#38`, `#39`, `#40`, `#41`, `#43` (`#36` closed unmerged for C-02; `#42` closed)
  * Lab 6 PRs: `#48` (`MERGED` to `lab5-staging` `2026-11-21T14:20:32Z`), `#50` (`MERGED` to `main` `2026-11-21T14:55:00Z`), `#44`/`#49`/`#51` (`CLOSED`)
* **Recent CI / CD Runs:**
  * `#44911894767` (`CI & Docker Build`, PR `#48`, `success`), `#44914885842` (`CI & Docker Build`, `lab5-staging`, `success`), `#44915424466` (`CI & Docker Build`, `main`, `success`), `#44916394495` (`Deploy demo`, `main` `2aee62b`, `success`)
* **Part C Reminder:** Choose one explicit observation window (or release snapshot), embed reconcilable ID lists/command summaries in the PDF, and keep the interpretation `<= 100` words with one concrete owner + next milestone action.

---

## 7. Lab 7 Execution Sequence & Engineering Rules (`AGENTS.md` + Lab 7 Rubric)

1. **Gate 0 — Pre-Lab 7 Cleanup:** Confirm Omega-3 closes Lab 6 Issue `#47` on `2aee62b`; sync `origin/main` into `lab5-staging` (and fetch locally).
2. **Part A (Contract Before Code — 25 pts):**
   * Create Lab 7 Change Request GitHub Issue specifying old rule, new rule, reason, scope, boundaries, invalid cases, access rules, `v0.1.0-sprint1` baseline + pre-change commit.
   * **Obtain Instructor/TA approval** (record approver & date) before implementation.
   * Create Impact Analysis table + revise SRS / Feature SDS / System-Level SDS / AC / STS + get **teammate PR/contract review before coding** (preserve git dates/commits!).
3. **Part B (TDD Red/Green & Regression-Safe Delivery — 50 pts):**
   * Add/update automated test asserting the new behavior (with boundary) → run against **pre-change code** and capture **RED failure output + commit** (must fail due to missing rule, not syntax/fixture error).
   * Implement bounded change → show **GREEN passing test + diff** + run relevant **existing regression suites** (do not weaken/delete unaffected tests).
   * Teammate substantive PR review → merge to `lab5-staging` (green `test-and-docker`) → Release PR to `main` → automated `deploy.yml` to Cloud Run → run post-deploy checks on both changed behavior & preserved Sprint 1 domain/access paths.
4. **Part C & D (Metrics + Readiness + Retrospective — 25 pts):**
   * 5 dated, verifiable metrics + embedded reconcilable lists + `<= 100`-word interpretation.
   * Honest Readiness checklist (`READY` / `NOT READY` for maintained Sprint 1 scope), Technical Debt table (distinct from defects), 3 brief retrospective answers (1–2 sentences each), contribution table, AI-use declaration, and known limitations in one self-contained PDF due **29 November 2026 at 23:59**.
