# PopQueue — Lab 5 Master Execution & Deployment Plan (v2.4 Final)
## Cloud Deployment and CI/CD Pipeline on Google Cloud Platform (GCP)

**Course:** CPE 334 Introduction to Software Engineering in the Age of AI Agents (Semester 1/2026, KMUTT)  
**Theme:** Theme 9 — Queue and Service Management System (PopQueue: On-site Virtual Queue for Art Toy Live Unboxing)  
**Team:** BFteam (Section 1)  
**Total Points:** 100 Lab Points (5% of Course Grade)  
**Due Date:** Sunday, 15 November 2026, 23:59  
**Submission Deliverable:** Single PDF named `lab5_sec1_BFteam.pdf` via LEB2  
**Target Release Tag:** `v0.2.0-lab5`  
**Baseline Source:** Sprint 1 Accepted Release (`v0.1.0-sprint1`, Commit `d946159`, Branch `main`)  
**Integration Branches:** `main` (Protected Production) and `lab5-staging` (Protected Staging)  
**Repository (Public, R-12):** [https://github.com/apfirst13/PopQueue_BFteam](https://github.com/apfirst13/PopQueue_BFteam)  
**Canonical Deployment Spec:** `docs/labs/lab05/deployment.md`

---

## 1. Executive Summary & Non-Permanent Team Roles (R-09, R-11)

This Master Execution Plan establishes the end-to-end strategy for **Lab 5 (Cloud Deployment and CI/CD Pipeline on GCP)** in strict accordance with `01_SE_Lab_5_updated.pdf` and the CPE 334 Group Work Specification.

### 1.1 Non-Permanent Role Rotation (Spec Section 2 & R-11)
Per course regulations, team members **must not divide learning outcomes into permanent roles** (e.g. one pure developer and one pure reviewer). Both members actively participate across requirements, containerization, CI/CD pipelines, GCP deployment, automated testing, code review, and documentation.

To enforce **R-09 (author cannot approve own PR)** and **R-11 (shared participation)**, author and reviewer duties rotate across issues:

| Issue / Topic | Handout Episode | Primary Author (Implementer) | Required Reviewer (Approver) | Scope & Collaboration |
|:---:|:---:|:---:|:---:|---|
| **Issue 1** | Ep. 1 | `@apfirst13` | `@Theerawat82` | GCP Project Setup (`popqueue-lab5` or unique suffix), $5 Budget Alert, Enable APIs (including Cloud Build, STS, IAM Credentials), **Add `@Theerawat82` as IAM Editor (Handout 4.4)**. Enable GitHub Secret Scanning Push Protection. *(Today's Dedicated Focus, 9 Nov)* |
| **Issues 2 & 3** | Ep. 2 & 3 | `@Theerawat82` | `@apfirst13` | Cloud Readiness, `.env.example`, Multi-stage Dockerfile, Compose (building `server` from root Dockerfile), Health endpoints (PR #26). `@apfirst13` conducts comprehensive file-by-file code review (auditing Prisma CLI availability in production stage). |
| **Issue 4** | Ep. 4 | `@apfirst13` | `@Theerawat82` | CI Pipeline on PRs (`ci-docker.yml`) using **Node 24**, **PostgreSQL service container**, and `prisma migrate deploy`. Green PR demonstration (**C-01**). |
| **Issue 5** | Ep. 5 | `@Theerawat82` | `@apfirst13` | First Cloud Shell deployment (`deploy/deploy.sh`), Artifact Registry `popqueue`, Cloud SQL (`popqueue-pg`), Create runtime SA `popqueue-sa`, Create & run Cloud Run Job `popqueue-migrate` with **Mounted Seed Secrets** & **Idempotent DB Seeding**, Secret Manager. |
| **Issue 6** | Ep. 6 | `@Theerawat82` | `@apfirst13` | Pair Work on GCP/GitHub configuration. `@Theerawat82` authors WIF & ruleset documentation PR to `lab5-staging`, `@apfirst13` reviews and approves. WIF setup (`workloadIdentityUser` + `serviceAccountUser` on `popqueue-sa`), Branch Protection Rulesets on **both `main` and `lab5-staging`**, and **Failing PR Merge Block demonstration (C-02)**. |
| **Issue 7** | Ep. 7 | `@apfirst13` | `@Theerawat82` | Automated CD Pipeline (`deploy.yml` with push to `main` and `workflow_dispatch`, updating migration job image before execute), Read-only Smoke Test (verifies public `GET /api/series`), Expose `GIT_SHA` in UI/API, **Release visible change (C-06 Pipeline Execution)**. |
| **Issue 8** | Ep. 8 | `@Theerawat82` | `@apfirst13` | Live Domain Workflow screenshots (**C-04**, masked passwords), Data Persistence Verification across scale-down, DB restart & redeploy (**C-05**, actual ticket ID), and **Live Commit SHA Traceability (C-06 Verification)**. |
| **Issue 9** | Ep. 9 | **Pair Work** (`@Theerawat82` & `@apfirst13`) | Joint sign-off | Finalize canonical `docs/labs/lab05/deployment.md`, wait for CD deploy to succeed then tag `v0.2.0-lab5` on `main`, Cost Management (Cloud SQL pause policy), Evidence collation, and PDF report compilation (`lab5_sec1_BFteam.pdf`). |

---

## 2. Project Timeline & Delivery Milestones

Per team agreement, **Today (9 Nov) is dedicated exclusively to Issue 1** (GCP Setup, Budget Alert, IAM Team Access & Secret Scanning Push Protection) to establish a rock-solid cloud foundation without rushing. Subsequent issues follow in a clean, manageable sequence:

```
[9 Nov (Today): Issue 1 — GCP Free Trial, Project Setup, $5 Budget Alert, IAM Editor, Push Protection]
       |
       v
[10 Nov (Tue): Issues 2 & 3 — Substantive Review & Merge PR #26, C-03 Clean Clone Demo, Start Issue 4]
       |
       v
[11 Nov (Wed): Issue 5 — Cloud Shell Deploy, Cloud SQL, popqueue-sa IAM, Idempotent Seed -> Public URL Live]
       |
       v
[12 Nov (Thu): Issue 6 — WIF, Branch Rulesets, C-02 Demo + Issue 7 — CD Pipeline & Visible Change (C-06 Execution)]
       |  (Ready for Lab 6 Partner Team UAT)
       v
[13 Nov (Fri): Issue 8 — C-04 Domain Workflow, C-05 Persistence Test (Scale-down, Restart, Redeploy), C-06 Verification]
       |
       v
[14 Nov (Sat): Issue 9 — Finalize docs/labs/lab05/deployment.md, Tag v0.2.0-lab5, Compile lab5_sec1_BFteam.pdf]
       |
       v
[15 Nov (Sun): Final Review against Rubric, Submit PDF to LEB2 before 23:59]
```

> **Operational Note on Schedule:** Thursday 12 Nov has a dense schedule (Issue 6 + Issue 7 + Lab 6 Session). If Issue 5 finishes early on Wednesday 11 Nov, the team will immediately begin the WIF and IAM configuration of Issue 6 to balance the workload and ensure plenty of buffer before the Lab 6 UAT session.

| Date | Planned Execution Milestone | Focus Scope & Key Outputs |
|:---:|---|---|
| **Mon 9 Nov (Today)** | **Issue 1 exclusively:** Setup GCP Project (`popqueue-lab5`), $5 Budget Alert, enable 8 required APIs, grant `@Theerawat82` IAM Editor role (via personal Gmail), enable GitHub Secret Scanning Push Protection. | Cloud infrastructure foundation established; zero code changes to `main`. |
| **Tue 10 Nov** | **Issues 2 & 3:** `@apfirst13` conducts substantive code review on PR #26 (verifying Prisma CLI retention in production stage) $\rightarrow$ merge to `lab5-staging` $\rightarrow$ execute **C-03 (Clean clone demo)**. Then `@apfirst13` implements **Issue 4** (CI on PR with Node 24 & Postgres container, **C-01 demo**). | Staging baseline merged; CI gate enforced on PRs. |
| **Wed 11 Nov** | **Issue 5:** `@Theerawat82` creates Artifact Registry repo `popqueue`, executes first deployment via Cloud Shell (`deploy/deploy.sh`), Cloud SQL setup, creates `popqueue-sa`, creates Cloud Run migration job `popqueue-migrate` (with mounted seed secrets) and verifies Idempotent DB seed. | **Public GCP URL live and operational** in time for Lab 6 first session. |
| **Thu 12 Nov** | **Issue 6:** Pair work sets up WIF (with `workloadIdentityUser` and `serviceAccountUser` on `popqueue-sa`), branch rulesets on `main` and `lab5-staging`, execute **C-02 (Failing PR demo)**.<br>**Issue 7:** `@apfirst13` sets up automated CD pipeline (`deploy.yml` with `workflow_dispatch` and migration job image update), read-only smoke test, releases visible change (commit SHA in UI footer) via PR to `main` (**C-06 execution**). | Automated CD active; **ready for Lab 6 partner team UAT**. |
| **Fri 13 Nov** | **Issue 8:** Execute **C-04 (Public domain workflow screenshots with browser URL bar)**, **C-05 (Persistence test across scale-down, DB restart, and redeploy)**, and **C-06 (Live SHA verification)**. | All 6 required demonstration checks captured with complete evidence. |
| **Sat 14 Nov** | **Issue 9:** Finalize `docs/labs/lab05/deployment.md`, wait for CD deploy, create release tag `v0.2.0-lab5` on `main`, compile PDF report (`lab5_sec1_BFteam.pdf`, Parts 0–4), peer review against rubric. | Report draft complete; peer review of evidence. |
| **Sun 15 Nov** | Final buffer, review against rubric, verify tag and live URL, submit PDF to LEB2 before 23:59. | **Final Submission Complete.** Service left running for grading. |

---

## 3. Target Cloud Architecture & Security Specifications

```
                         +------------------------------------------------+
                         |           Internet / Browser Clients           |
                         +------------------------------------------------+
                                                 |
                                                 v HTTPS (Port 443)
                         +------------------------------------------------+
                         |           Google Cloud Run: popqueue           |
                         |  - Region: asia-southeast1 (Singapore)         |
                         |  - 1 vCPU, 512 MiB Memory, Min: 0, Max: 2      |
                         |  - Service Account: popqueue-sa                |
                         |  - Unified Multi-Stage Image (Node 24 Alpine)  |
                         |    * Port 3000                                 |
                         |    * Express 4 API endpoints (/api/*)          |
                         |    * React 18 SPA static host (/app/client/dist|
                         |    * Health endpoints (/api/health, /api/ready)|
                         |    * Exposes GIT_SHA in health & UI footer     |
                         +------------------------------------------------+
                                 |                                |
          Cloud SQL Auth Proxy   |                                | Cloud IAM / Secret Manager
          Unix Socket Connection |                                | (popqueue-sa runtime)
                                 v                                v
                 +-------------------------------+   +----------------------------+
                 | Cloud SQL (PostgreSQL 16)     |   | Secret Manager             |
                 | - Instance: popqueue-pg       |   | - popqueue-database-url    |
                 | - Tier: db-f1-micro           |   | - popqueue-jwt-secret      |
                 | - Edition: Enterprise         |   | - popqueue-seed-collector-pw
                 | - Persistent Storage (SSD)    |   | - popqueue-seed-staff-pw   |
                 +-------------------------------+   +----------------------------+
```

### 3.1 Service Account & Workload Identity Federation (WIF) Matrix (Issues 5 & 6)
To satisfy least-privilege security and eliminate actAs permission errors during deployment:

| Identity / Resource | Required Roles & Bindings | Purpose & Scope |
|---|---|---|
| **`popqueue-sa@PROJECT.iam...`** (Runtime SA) | 1. `roles/secretmanager.secretAccessor`<br>2. `roles/cloudsql.client` | Attached to Cloud Run service and migration job to access secrets and Cloud SQL Auth Proxy at runtime. |
| **`github-deployer@PROJECT.iam...`** (Deployer SA) | 1. `roles/run.admin` on project<br>2. `roles/artifactregistry.writer` on project<br>3. **`roles/iam.serviceAccountUser` on `popqueue-sa`** | Allows GitHub Actions to build/push images, deploy Cloud Run services, and attach `popqueue-sa` to Cloud Run without permission failure. *(Does NOT receive secretAccessor)*. |
| **GitHub Actions Provider Binding** | **`roles/iam.workloadIdentityUser`** granted to `principalSet://.../attribute.repository/apfirst13/PopQueue_BFteam` on `github-deployer` | Authorizes GitHub Actions runners from this repository to impersonate `github-deployer`. |
| **Provider Attribute Mapping & Condition** | Mapping: `google.subject=assertion.sub, attribute.repository=assertion.repository, attribute.ref=assertion.ref`<br>Condition: `assertion.repository == 'apfirst13/PopQueue_BFteam' && assertion.ref == 'refs/heads/main'` | Strictly restricts keyless token exchange to the approved repository and `main` branch. *(ตรวจคำสั่งและ flag ด้วย `--help` ก่อนรัน)* |

### 3.2 Container Build & Runtime Assets Protocol (Issues 3 & 5)
1. **Container Alignment (R-01) & Prisma CLI Retention:**
   - The production container is built via root multi-stage `Dockerfile`:
     * Stage 1 (`client-builder`): Builds Vite React SPA.
     * Stage 2 (`server-builder`): Compiles TypeScript Express server and pre-compiles seed script to plain JavaScript (`dist/prisma/seed.js`) so that runtime database seeding does NOT depend on devDependencies (e.g. `tsx` or `ts-node`).
     * Stage 3 (`production`): Node 24 Alpine minimal runtime, non-root user `node`, Prisma generated client, and Express static host on port 3000.
     * **Critical Audit in PR #26 Review:** In multi-stage Docker builds, production stages that run `npm ci --omit=dev` often prune the Prisma CLI. The team must verify during Tuesday's PR review that the `prisma` CLI executable is explicitly retained/accessible in the production stage (e.g. via direct dependency or copying CLI assets) so that `npx prisma migrate deploy` executes offline without attempting runtime package downloads.
2. **Docker Compose Parity (C-03):** Service `server` in `docker-compose.yml` builds from the same root unified `Dockerfile` to guarantee local development behavior perfectly mirrors production.
3. **Idempotent Database Seeding Protocol (Issue 5 & CD):**
   - The Cloud Run migration job runs `npx prisma migrate deploy && node dist/prisma/seed.js`.
   - **Mounted Secrets:** Secrets for database and seed passwords are explicitly injected matching the exact environment variables read by `seed.js`: `DATABASE_URL`, `SEED_COLLECTOR_PASSWORD`, `SEED_STAFF_PASSWORD`.
   - Seeding **NEVER** executes `TRUNCATE`, `DELETE`, or table drops. It uses `upsert` exclusively on reference tables (`User`, `Series`, `StaffSeriesAssignment`).
   - Active queue tickets (`Ticket`) and sequential queue counters (`DailyQueueSequence`) created by users during C-04/C-05 or Lab 6 UAT are **never touched or reset** upon subsequent redeployments.
   - Seed idempotency is verified in Issue 5 by executing the job twice consecutively on Cloud SQL before proceeding to C-05.
4. **Commit SHA Injection (R-08):**
   - The build passes `--build-arg GIT_SHA=$GITHUB_SHA` into the Dockerfile, with default fallback `ARG GIT_SHA=dev` for local builds.
   - Exposed via `GET /api/health` -> `{ status: "ok", commit: process.env.GIT_SHA || "dev" }`.
   - Displayed in Web UI footer -> `PopQueue v0.2.0 (Commit: ...)`.
   - Labeled on Cloud Run service revisions using `--update-labels=commit-sha=...` *(ตรวจคำสั่งด้วย `--help` ก่อนรัน)*.

---

## 4. Official Lab 5 Rubric & Requirements Traceability Matrix (100 Points)

The Lab 5 grade is evaluated across **4 rubric categories** totaling 100 points.

```
Total: 100 Points
├── 1. CI and Quality Gate (30 Points)       [R-05, R-06, C-01, C-02]
├── 2. Docker & Reproducible Config (20 Points)[R-01, R-02, C-03]
├── 3. GCP Deployment & Persistence (35 Points)[R-03, R-04, C-04, C-05]
└── 4. Repeatable Release Pipeline (15 Points)[R-07, R-08, C-06]
```

### 4.1 Rubric Category Breakdown

| Rubric Part | Points | Scope & Deliverables | Primary Checks & Requirements |
|---|:---:|---|---|
| **Part 1: CI and Quality Gate** | **30** | GitHub Actions CI workflow running automated unit/integration tests and build checks on PRs. Passing check is strictly required before merge. | **R-05, R-06**<br>Demonstrated via **C-01** (Normal green PR) and **C-02** (Failing PR merge block). |
| **Part 2: Docker & Reproducible Config** | **20** | Full-stack application containerization, multi-stage build, non-root user, reproducible environment from clean clone via `.env.example`, zero committed secrets. | **R-01, R-02**<br>Demonstrated via **C-03** (Clean clone local build & run). |
| **Part 3: GCP Deployment & Persistence** | **35** | Live deployment on GCP at a public URL with working UI, API, and database. Persistent database survives container restarts and redeployments. | **R-03, R-04**<br>Demonstrated via **C-04** (Public domain workflow) and **C-05** (Data persistence across scale-down, DB restart, and redeploy). |
| **Part 4: Repeatable Release Pipeline** | **15** | Repeatable CD pipeline deploying accepted releases from `main`. Commit SHA identification on live application and documented release procedure. | **R-07, R-08**<br>Demonstrated via **C-06** (Reviewed change staging $\rightarrow$ main, live commit SHA). |

### 4.2 Handout Requirements Traceability Table (R-01 to R-12)

| Req ID | Requirement Description (from Handout & Spec) | Implementation Mechanism | Evidence in Report |
|:---:|---|---|---|
| **R-01** | Package application with Docker; fresh build from clean clone produces a working container (Spec 5.1, 5.3, 10). | Root unified `Dockerfile`, `docker-compose.yml`, multi-stage build, Node 24 alpine, non-root user `node`. | **Check C-03**, Dockerfile listings, build logs. |
| **R-02** | Read every setting from environment; document in `.env.example` or `deployment.md`; zero secrets committed (Spec 5.3, 10). | `.env.example`, Secret Manager references (`popqueue-database-url`, `popqueue-jwt-secret`, `popqueue-seed-collector-pw`, `popqueue-seed-staff-pw`), `.gitignore`. | `.env.example` content, Secret Manager screenshot, clean git history. |
| **R-03** | Deploy on GCP at public URL; domain workflow works through UI, API, and DB (Spec 5.3, 10). | Google Cloud Run service `popqueue` + Cloud SQL PostgreSQL 16 `popqueue-pg`. | **Check C-04** screenshots showing browser URL bar. |
| **R-04** | Persistent database; data survives application restart and redeploy (Spec 5.1, 10). | Cloud SQL instance with managed persistent SSD storage; Cloud Run Job for migrations. | **Check C-05** evidence across scale-down, DB restart, and redeploy. |
| **R-05** | Run build and automated tests on every relevant PR with meaningful results (Spec 5.3, 10). | `.github/workflows/ci-docker.yml` running Node 24, PostgreSQL container, Vitest suites (147 server + 30 client tests). | **Check C-01** green PR run link and test log. |
| **R-06** | Required passing check; failed check blocks merge; show with failing PR from temp branch (Spec 5.3, 10). | GitHub Branch Ruleset requiring status check `test-and-docker` on `main` and `lab5-staging`. | **Check C-02** failing PR screenshot and blocked merge button. |
| **R-07** | Deploy accepted releases from `main` through repeatable pipeline: review $\rightarrow$ CI $\rightarrow$ merge $\rightarrow$ deploy (Spec 5.3, 8.3, 10). | `.github/workflows/deploy.yml` triggered on push to `main` via PR merge and on manual `workflow_dispatch`. | **Check C-06**, CD workflow run log, release PR link. |
| **R-08** | Identify commit of each release (tag/SHA) and document release procedure in `deployment.md` (Spec 8.3, 10). | Expose `GIT_SHA` in `GET /api/health`, UI footer, and Cloud Run revision labels (`--update-labels=commit-sha=...`). | **Check C-06**, `/api/health` JSON response, UI footer screenshot. |
| **R-09** | Use Issues, project board, feature/fix branches, PRs into staging reviewed by teammate, release PR into main (author cannot approve own PR) (Spec 5.3, 8.3). | GitHub Issues labeled `lab5`, branch model (`feature/*` $\rightarrow$ `lab5-staging` $\rightarrow$ `main`), cross-reviews (@apfirst13 & @Theerawat82). | PR review comments, approval history, branch graph. |
| **R-10** | Label Lab 5 Issues and PRs (`lab5`); clean commit history; no rewriting history (`git push --force` forbidden) (Spec 8.3). | All Lab 5 items labeled `lab5`. Linear, clean commit history preserved; no rebase or deletion of existing commits. | Issue and PR list with `lab5` label; git log. |
| **R-11** | Both members participate across requirements, testing, implementation, review, deployment; record in Issues/commits/PRs (Spec 2). | Role rotation across Issues 1 to 9 (see Section 1.1). Both author and review code/deployments. | GitHub commit insights, PR authors & reviewers table. |
| **R-12** | Public repository throughout grading period; no committed secrets; enable Secret scanning push protection (Spec 11). | Repository `apfirst13/PopQueue_BFteam` is public. Secret Manager used for cloud credentials; GitHub Secret scanning push protection enabled. | Repository visibility verification, Secret scanning status. |

---

## 5. Mandatory Demonstration Verification Checks (C-01 to C-06)

| Check ID | Handout Description | Execution Method & Demonstration | Expected Output & Evidence in Report |
|:---:|---|---|---|
| **C-01** | **Normal PR CI Gate** | Create feature branch, make valid change, open PR into `lab5-staging`. | GitHub Actions runs `test-and-docker`. All backend tests (147), frontend tests (30), and Docker build pass. Green check shown. |
| **C-02** | **Failing PR Merge Block** | From a temporary branch `temp/c02-failing-check`, add a deliberately failing test (`expect(1).toBe(2)`) and open PR to `lab5-staging`. | CI job fails. GitHub branch ruleset marks check failed and **disables the merge button**. Leave PR closed (not deleted). *(Executed in Issue 6 after ruleset is enabled).* |
| **C-03** | **Clean Clone Local Build & Run** | In a fresh directory, run `git clone`, checkout `lab5-staging` (post-PR #26), copy `.env.example` to `.env`, execute `docker compose up --build -d`. | Terminal log showing clean clone, successful multi-container startup (`db`, `migrate`, `server`, `client`), and `curl http://localhost:3000/api/health` returning 200 OK. Service `server` builds from root Dockerfile. |
| **C-04** | **Public Domain Workflow** | Open live public GCP URL in browser. Demonstrate collector login, join queue to generate actual ticket, staff counter login, call ticket, and business rule rejection (duplicate join 409 error). | Captioned screenshots **clearly showing the browser URL bar with GCP domain**. Password input masked; demo credentials shared with Lab 6 partner privately. |
| **C-05** | **Data Persistence across Scale-Down, DB Restart & Redeploy** | 1. Create a queue ticket on the live URL, recording the actual ticket ID generated.<br>2. **Test 1 (Scale-Down):** Wait for Cloud Run idle scale-down to 0 instances, issue new request to trigger cold start, verify ticket exists.<br>3. **Test 2 (Database Restart):** Execute `gcloud sql instances restart popqueue-pg`, wait for recovery, verify ticket exists.<br>4. **Test 3 (Service Redeploy):** Trigger redeployment of Cloud Run service (via `workflow_dispatch` or commit push), verify ticket still exists. | Screenshots of UI and database before and after each test proving persistent storage survives both restart and redeploy. |
| **C-06** | **Repeatable Pipeline with Visible Change & Commit SHA** | 1. In Issue 7, release visible change (UI footer commit SHA badge) via PR `lab5-staging` $\rightarrow$ `main`.<br>2. Teammate reviews and approves PR.<br>3. Merge triggers `.github/workflows/deploy.yml`.<br>4. In Issue 8, verify live site displays updated commit SHA matching Git release commit. | Release PR link, teammate approval, Actions deploy log, and browser screenshot showing live URL displaying new commit SHA. |

---

## 6. Detailed Sequential Issue Execution Plan (Issues 1 to 9)

### Issue 1 (Episode 1): GCP Project Setup, Budget Alert ($5 Threshold) & IAM Team Access
* **GitHub Issue:** `Lab 5 Issue 1: Setup GCP Project, Budget Alert ($5 threshold) & IAM Team Access` (Issue #24)
* **Author:** `@apfirst13` | **Reviewer:** `@Theerawat82` | **Label:** `lab5`
* **Target Execution Date:** **Monday, 9 November 2026 (Today's Dedicated Focus)**
* **Tasks:**
  1. Create Google Cloud Project: `popqueue-lab5` (if project ID already taken, append unique suffix e.g. `popqueue-lab5-bfteam`).
  2. Set Region: `asia-southeast1` (Singapore).
  3. **Configure $5 Budget Alert FIRST:**
     - Target Amount: $5.00 USD.
     - Thresholds: 50% ($2.50), 90% ($4.50), 100% ($5.00).
     - Notification: Email project owners.
     - *Precaution:* Set Budget Alert **before** enabling APIs or provisioning resources. Do NOT click Upgrade account / do NOT make prepayment.
     - *Pricing Awareness:* Cloud SQL `db-f1-micro` is billed hourly (~$7.60–$10/month in Singapore). The $5 alert will fire within ~2–3 weeks; it is an early warning notification, not a hard cutoff.
  4. Enable Required GCP APIs:
     - Cloud Run: `run.googleapis.com`
     - Cloud SQL Admin: `sqladmin.googleapis.com`
     - Secret Manager: `secretmanager.googleapis.com`
     - Artifact Registry: `artifactregistry.googleapis.com`
     - Cloud IAM: `iam.googleapis.com`
     - Cloud Build: `cloudbuild.googleapis.com` *(required for `gcloud builds submit` in Issue 5)*
     - IAM Service Account Credentials: `iamcredentials.googleapis.com` *(required for WIF in Issue 6)*
     - Security Token Service: `sts.googleapis.com` *(required for WIF in Issue 6)*
     - *(Note: You may enable all 8 upfront or allow gcloud CLI to prompt for enabling as needed).*
  5. **Grant Teammate IAM Access (Handout 4.4):** `@apfirst13` grants `@Theerawat82` the role **Editor (`roles/editor`)** in GCP IAM.
     - *Important:* Use `@Theerawat82`'s personal Google Account (Gmail), NOT GitHub username, and NOT `@mail.kmutt.ac.th` (to avoid Google Workspace organization permission limitations).
  6. **Enable GitHub Secret Scanning Push Protection (R-12):** In repository Settings $\rightarrow$ Code security $\rightarrow$ Enable *Secret scanning* and *Push protection*.
* **Evidence:** Screenshot of GCP Budget Alert dashboard showing $5 budget, email alert settings, IAM member table with both personal Gmail accounts as Editor, and GitHub Push Protection setting.

---

### Issues 2 & 3 (Episodes 2 & 3): Cloud Readiness, Multi-Stage Dockerfile & Local Parity (PR #26)
* **GitHub Issue:** `Lab 5 Issues 2 & 3: Cloud Readiness, Docker Containerization & Local Verification` (Issue #25)
* **Author:** `@Theerawat82` | **Reviewer:** `@apfirst13` | **Label:** `lab5`
* **Target Execution Date:** **Tuesday, 10 November 2026**
* **Branch:** `feature/lab5-i02-docker-setup` $\rightarrow$ PR to `lab5-staging` (PR #26, PR #33)
* **Handling Existing PR #26 (Preserving R-10):**
  - PR #26 currently contains candidate implementations of Dockerfile, docker-compose, health checks, deploy scripts, and initial CI workflow.
  - Per **R-10 (no rewriting git history)**, PR #26 will NOT be deleted or rebased.
  - Description updated to reference Issue #24 and #25.
  - `@apfirst13` performs a detailed, substantive file-by-file code review on PR #26:
    * Evaluating multi-stage build efficiency and non-root execution.
    * **Auditing Prisma CLI in Production Stage:** Verify that `prisma` CLI is retained in the production container image so that `npx prisma migrate deploy` does not fail or attempt runtime downloads.
    * Verifying health check endpoints and environment variable bindings.
  - Merge into `lab5-staging` once approved.
* **Tasks Under Review:**
  - Root multi-stage `Dockerfile`: builds Vite React frontend, compiles Express server, pre-compiles seed script to `dist/prisma/seed.js`, packages in Node 24 Alpine as user `node`, exposes port 3000.
  - Health checks in `server/src/app.ts`: `/api/health` (returns status and `GIT_SHA`) and `/api/ready` (checks PostgreSQL via `SELECT 1`).
  - Production static serving: Express serves `/app/client/dist` for root `/` and SPA fallback routes.
  - `docker-compose.yml`: sets up `db` (Postgres 16), `migrate` (Prisma deploy), `server` (Express built from root Dockerfile), and `client` (Nginx reverse proxy) for local development parity.
  - Created `.env.example` documenting all configuration keys (R-02).
  - Created `docs/labs/lab05/deployment.md` as canonical specification.
* **Verification Check C-03 (Clean Clone Local Build & Run):**
  - In a separate clean directory, run `git clone`, checkout `lab5-staging` (post-PR #26), `cp .env.example .env`, `docker compose up --build -d`.
  - Capture terminal log showing healthy services and `curl http://localhost:3000/api/health` returning 200 OK. Confirm `server` builds from root Dockerfile.

---

### Issue 4 (Episode 4): CI Pipeline on Pull Requests with Automated Testing & Docker Build Gate
* **GitHub Issue:** `Lab 5 Issue 4: CI Pipeline on Pull Requests with PostgreSQL Service Container & Docker Build Gate`
* **Author:** `@apfirst13` | **Reviewer:** `@Theerawat82` | **Label:** `lab5`
* **Target Execution Date:** **Tuesday, 10 November 2026**
* **Branch:** `feature/lab5-i04-ci` $\rightarrow$ PR to `lab5-staging` (PR #34)
* **Tasks:**
  1. Configure `.github/workflows/ci-docker.yml` running on pull requests targeting `lab5-staging` and `main`.
  2. Align Node version: Use **Node.js 24** (matching production Docker container runtime).
  3. PostgreSQL Service Container: Run a live `postgres:16-alpine` service container in GitHub Actions (matching production Cloud SQL), ensuring Prisma and Raw SQL atomic numbering tests execute realistically.
  4. CI Quality Gate steps:
     - Install dependencies (`npm ci`).
     - Run `npx prisma migrate deploy` on Postgres container. *(Strictly `migrate deploy`, never `db push`).*
     - Backend test suite (147 Vitest tests).
     - Frontend test suite (30 Vitest tests).
     - Multi-stage Docker build check (`docker build -t popqueue:ci .`).
* **Verification Check C-01 (Normal PR CI Gate):**
  - PR runs CI workflow, all tests pass green. Capture PR link and check summary.

---

### Issue 5 (Episode 5): First Manual Deployment to Cloud Run & Cloud SQL via Cloud Shell
* **GitHub Issue:** `Lab 5 Issue 5: First Manual Deployment to Cloud Run & Cloud SQL via Cloud Shell`
* **Author:** `@Theerawat82` | **Reviewer:** `@apfirst13` | **Label:** `lab5`
* **Target Execution Date:** **Wednesday, 11 November 2026**
* **Branch:** `feature/lab5-i05-cloud-deploy` $\rightarrow$ PR to `lab5-staging` (PR #35)
* **Tasks:**
  1. Create Artifact Registry Repository `popqueue`:
     ```bash
     gcloud artifacts repositories create popqueue \
       --repository-format=docker \
       --location=asia-southeast1 \
       --description="PopQueue Docker Repository"
     # Build and push image
     gcloud builds submit --tag asia-southeast1-docker.pkg.dev/$PROJECT_ID/popqueue/app:$TAG
     ```
  2. Create Runtime Service Account `popqueue-sa`:
     ```bash
     gcloud iam service-accounts create popqueue-sa --display-name="PopQueue Runtime SA"
     gcloud projects add-iam-policy-binding $PROJECT_ID \
       --member="serviceAccount:popqueue-sa@$PROJECT_ID.iam.gserviceaccount.com" \
       --role="roles/secretmanager.secretAccessor"
     gcloud projects add-iam-policy-binding $PROJECT_ID \
       --member="serviceAccount:popqueue-sa@$PROJECT_ID.iam.gserviceaccount.com" \
       --role="roles/cloudsql.client"
     ```
  3. Provision Cloud SQL instance: `popqueue-pg` (PostgreSQL 16, tier `db-f1-micro`, `--edition=enterprise`, region `asia-southeast1`).
     Create database `popqueue_db` and user `popqueue_user`.
  4. Secret Manager Configuration:
     - `popqueue-database-url`: Unix socket string `postgresql://popqueue_user:...@localhost/popqueue_db?host=/cloudsql/PROJECT:REGION:INSTANCE`.
     - `popqueue-jwt-secret`: High-entropy random secret.
     - `popqueue-seed-collector-pw`: Secure password for demo collector accounts.
     - `popqueue-seed-staff-pw`: Secure password for demo staff accounts.
  5. Create and Execute Cloud Run Migration Job `popqueue-migrate`:
     ```bash
     # Create migration job with mounted seed secrets (ตรวจคำสั่งและ flag ด้วย --help ก่อนรัน)
     gcloud run jobs create popqueue-migrate \
       --image asia-southeast1-docker.pkg.dev/$PROJECT_ID/popqueue/app:$TAG \
       --service-account popqueue-sa@$PROJECT_ID.iam.gserviceaccount.com \
       --region asia-southeast1 \
       --set-cloudsql-instances $PROJECT_ID:asia-southeast1:popqueue-pg \
       --set-secrets DATABASE_URL=popqueue-database-url:latest,SEED_COLLECTOR_PASSWORD=popqueue-seed-collector-pw:latest,SEED_STAFF_PASSWORD=popqueue-seed-staff-pw:latest \
       --command "sh" --args "-c,npx prisma migrate deploy && node dist/prisma/seed.js"
     
     # Execute migration job
     gcloud run jobs execute popqueue-migrate --region asia-southeast1 --wait
     ```
     - Verify seed idempotency: run the job a second time to verify no errors or duplicate records occur.
  6. Deploy Cloud Run Service `popqueue`:
     ```bash
     gcloud run deploy popqueue \
       --image asia-southeast1-docker.pkg.dev/$PROJECT_ID/popqueue/app:$TAG \
       --service-account popqueue-sa@$PROJECT_ID.iam.gserviceaccount.com \
       --region asia-southeast1 \
       --port 3000 --cpu 1 --memory 512Mi \
       --min-instances 0 --max-instances 2 \
       --add-cloudsql-instances $PROJECT_ID:asia-southeast1:popqueue-pg \
       --set-secrets DATABASE_URL=popqueue-database-url:latest,JWT_SECRET=popqueue-jwt-secret:latest \
       --allow-unauthenticated
     ```
* **Evidence:** Live Cloud Run URL responding 200 OK to `/api/health`, `/api/ready`, and loading React SPA frontend.

---

### Issue 6 (Episode 6): Workload Identity Federation (WIF) & Branch Protection Rulesets
* **GitHub Issue:** `Lab 5 Issue 6: Workload Identity Federation & Branch Protection Rulesets on Staging and Main`
* **Author:** `@Theerawat82` | **Reviewer:** `@apfirst13` | **Label:** `lab5`
* **Target Execution Date:** **Thursday, 12 November 2026**
* **Branch:** `feature/lab5-i06-wif-ruleset` $\rightarrow$ PR to `lab5-staging`
* **PR Content:** Documentation of WIF setup, IAM roles, GitHub Environment bindings, and ruleset screenshots. `@Theerawat82` authors PR, `@apfirst13` reviews and approves.
* **Tasks:**
  1. Workload Identity Federation (WIF) Setup:
     ```bash
     # 1. Create pool and provider (ตรวจคำสั่งและ flag ด้วย --help ก่อนรัน)
     gcloud iam workload-identity-pools create github-actions-pool \
       --location=global --display-name="GitHub Actions Pool"
     
     gcloud iam workload-identity-pools providers create-oidc github-actions-provider \
       --location=global --workload-identity-pool=github-actions-pool \
       --issuer-uri=https://token.actions.githubusercontent.com \
       --attribute-mapping="google.subject=assertion.sub,attribute.repository=assertion.repository,attribute.ref=assertion.ref" \
       --attribute-condition="assertion.repository=='apfirst13/PopQueue_BFteam' && assertion.ref=='refs/heads/main'"
     
     # 2. Create deployer service account and grant roles
     gcloud iam service-accounts create github-deployer --display-name="GitHub Actions Deployer"
     
     gcloud projects add-iam-policy-binding $PROJECT_ID \
       --member="serviceAccount:github-deployer@$PROJECT_ID.iam.gserviceaccount.com" \
       --role="roles/run.admin"
     
     gcloud projects add-iam-policy-binding $PROJECT_ID \
       --member="serviceAccount:github-deployer@$PROJECT_ID.iam.gserviceaccount.com" \
       --role="roles/artifactregistry.writer"
     
     # 3. Grant actAs privilege on popqueue-sa
     gcloud iam service-accounts add-iam-policy-binding popqueue-sa@$PROJECT_ID.iam.gserviceaccount.com \
       --role="roles/iam.serviceAccountUser" \
       --member="serviceAccount:github-deployer@$PROJECT_ID.iam.gserviceaccount.com"
     
     # 4. Bind workloadIdentityUser on github-deployer
     gcloud iam service-accounts add-iam-policy-binding github-deployer@$PROJECT_ID.iam.gserviceaccount.com \
       --role="roles/iam.workloadIdentityUser" \
       --member="principalSet://iam.googleapis.com/projects/$PROJECT_NUMBER/locations/global/workloadIdentityPools/github-actions-pool/attribute.repository/apfirst13/PopQueue_BFteam"
     ```
  2. GitHub Environment `demo`:
     - Variables: `GCP_PROJECT_ID`, `GCP_REGION`, `WIF_PROVIDER`, `WIF_SERVICE_ACCOUNT`.
  3. GitHub Branch Rulesets (protecting **BOTH `main` and `lab5-staging`**):
     - Require Pull Request before merging (1 approval required).
     - Require review approval from teammate (author cannot approve own PR, R-09).
     - Require passing status check: `test-and-docker` (R-06).
     - Block direct push to `main` and `lab5-staging`.
  4. **Execute Verification Check C-02 (Failing PR Merge Block):**
     - Branch from staging: `temp/c02-failing-check`.
     - Add a deliberate failing test (`expect(1).toBe(2)`).
     - Push and open PR targeting `lab5-staging`.
     - Verify CI check fails and **GitHub blocks the merge button** with required status check violation.
     - Capture captioned screenshot for Answer Part 1, then **leave PR closed (not deleted)** so link remains verifiable.

---

### Issue 7 (Episode 7): Automated Continuous Delivery (CD) Pipeline & Smoke Testing
* **GitHub Issue:** `Lab 5 Issue 7: Automated CD Pipeline on Main Merge, Read-Only Smoke Test & Commit SHA Traceability`
* **Author:** `@apfirst13` | **Reviewer:** `@Theerawat82` | **Label:** `lab5`
* **Target Execution Date:** **Thursday, 12 November 2026**
* **Branch:** `feature/lab5-i07-cd-pipeline` $\rightarrow$ PR to `lab5-staging`
* **Tasks:**
  1. Configure `.github/workflows/deploy.yml`:
     - Triggers: Push to `main` (resulting from merged release PR) and **`workflow_dispatch`** (enabling manual redeploy for repeatable pipeline evidence R-07).
     - Step 1: Run CI quality gate tests first. If tests fail, halt deployment immediately.
     - Step 2: Authenticate to GCP using WIF.
     - Step 3: Build Docker image passing `--build-arg GIT_SHA=$GITHUB_SHA`, tag with commit SHA (`popqueue:$GITHUB_SHA`), push to Artifact Registry.
     - Step 4: **Update and Execute Cloud Run Migration Job (ตรวจด้วย `--help` ก่อนรัน):**
       ```bash
       gcloud run jobs update popqueue-migrate \
         --image asia-southeast1-docker.pkg.dev/$PROJECT_ID/popqueue/app:$GITHUB_SHA \
         --region asia-southeast1
       gcloud run jobs execute popqueue-migrate --region asia-southeast1 --wait
       ```
     - Step 5: Deploy to Cloud Run with `--image ...:$GITHUB_SHA` and set label `--update-labels=commit-sha=$GITHUB_SHA` *(ตรวจด้วย `--help` ก่อนรัน)*.
     - Step 6: Wait for deployment healthy.
     - Step 7: Execute read-only smoke test `python deploy/smoke_test.py --url $SERVICE_URL`.
  2. Read-Only Automated Smoke Test (`deploy/smoke_test.py`):
     - Validates:
       - `GET /api/health` -> 200 OK (returns valid status and commit SHA).
       - `GET /api/ready` -> 200 OK (verifies Cloud SQL connectivity).
       - `GET /` -> 200 OK (verifies React SPA HTML loaded).
       - `GET /api/series` -> 200 OK (verifies seeded series catalog query; **confirmed public endpoint, does not require login**).
     - *Design Note:* Automated CD smoke test remains strictly **read-only** to prevent polluting production DB with test data on every deploy.
  3. Release a **Visible Change (Check C-06 Execution)**:
     - Add the commit SHA display badge to the Web UI footer and `/api/health`.
     - Release through PR `lab5-staging` $\rightarrow$ `main`.
     - Teammate `@Theerawat82` reviews and approves PR.
     - Merge triggers automated deployment pipeline to live Cloud Run.

---

### Issue 8 (Episode 8): Live Domain Workflow & Cloud SQL Persistence Verification
* **GitHub Issue:** `Lab 5 Issue 8: Live Domain Workflow, Data Persistence across Scale-Down, DB Restart & Redeploy, and Live SHA Traceability`
* **Author:** `@Theerawat82` | **Reviewer:** `@apfirst13` | **Label:** `lab5`
* **Target Execution Date:** **Friday, 13 November 2026**
* **Branch:** `feature/lab5-i08-persistence-verify` $\rightarrow$ PR to `lab5-staging`
* **Tasks:**
  1. **Execute Verification Check C-04 (Public Domain Workflow):**
     - Open live public URL in browser.
     - Demonstrate collector login, browse series, join queue to generate actual ticket (record the generated ticket ID).
     - Open staff counter, login as staff, call ticket, transition state to serving.
     - Demonstrate business rule rejection: attempt duplicate join with same collector account; verify 409 Conflict error.
     - Capture clear screenshots showing the **complete browser URL bar with GCP domain**.
     - *Password masking:* Ensure password fields are masked in screenshots; share demo credentials with Lab 6 partner team privately.
  2. **Execute Verification Check C-05 (Data Persistence across Scale-Down, DB Restart & Redeploy):**
     - Record the actual ticket ID created in step 1.
     - **Test 1: Cloud Run Scale-Down:** Allow Cloud Run instance to scale to 0 (idle). Issue a new request, observing a fresh instance/cold start. Confirm the ticket exists intact.
     - **Test 2: Cloud SQL Database Restart:** Execute `gcloud sql instances restart popqueue-pg`. After instance recovers, query live URL and confirm the ticket and daily sequence remain intact.
     - **Test 3: Service Redeploy:** Trigger redeployment of Cloud Run service (via `workflow_dispatch` or commit push). Confirm the ticket remains intact in Cloud SQL.
     - Capture evidence screenshots before and after each test proving persistent SSD storage.
  3. **Execute Verification Check C-06 Verification (Live Commit SHA):**
     - Verify live site displays the commit SHA matching the release commit from Issue 7.
     - Capture screenshot of `/api/health` response and UI footer showing the exact Git SHA.
  4. Document Rollback Procedure:
     - Document manual revision rollback command (`gcloud run services update-traffic popqueue --to-revisions=PREVIOUS_REVISION=100`) in `deployment.md` as recommended operational procedure. *(ตรวจคำสั่งด้วย `--help` ก่อนรัน)*.

---

### Issue 9 (Episode 9): Deployment Documentation, Release Tag & Deliverable PDF Report
* **GitHub Issue:** `Lab 5 Issue 9: Finalize Deployment Docs, Release Tag v0.2.0-lab5 & Deliverable PDF Report`
* **Collaboration:** **Pair Work** (`@Theerawat82` & `@apfirst13`) | **Label:** `lab5`
* **Target Execution Date:** **Saturday, 14 November & Sunday, 15 November 2026**
* **Branch:** `feature/lab5-i09-docs-evidence` $\rightarrow$ PR to `lab5-staging`
* **Tasks:**
  1. Finalize Documentation:
     - Canonical document is maintained exclusively at `docs/labs/lab05/deployment.md`.
     - `docs/labs/lab-05/deployment.md` and `docs/deployment.md` contain pointer links to the canonical document.
  2. Create Release Tag (Order of Operations):
     - **Merge final PR into `main` and wait for automated CD deploy to finish successfully.**
     - Verify live Cloud Run service reflects the release commit SHA.
     - Create and push annotated tag `v0.2.0-lab5` on that exact commit:
       ```bash
       git tag -a v0.2.0-lab5 -m "Lab 5 Accepted Release: Cloud Deployment and CI/CD Pipeline on GCP"
       git push origin v0.2.0-lab5
       ```
     - This guarantees the repository tag, release commit SHA, live running revision, and PDF Part 0 match 100%.
  3. **Cost Management Policy (DO NOT RUN TEARDOWN):**
     - **Rule:** As required by Handout Section 1 and 3, **the service must remain running until the instructor announces the end of grading**.
     - This exact GCP project and pipeline are reused for **Lab 6 (Cross-team UAT)**, Lab 7, and the Final Project.
     - **Action:** Test `deploy/teardown.sh` offline/stub only for script validation, but **DO NOT execute teardown on live production**.
     - **Pause Policy:** Always set activation policy to `ALWAYS` before merging to `main` and before Lab 6 UAT sessions. Only set to `NEVER` during extended idle periods when no deployments or tests are occurring.
  4. Compile Deliverable PDF (`lab5_sec1_BFteam.pdf`):
     - Strictly structured into **Answer Parts 0 to 4**:
       * **Answer Part 0: Team and Evidence Index:** Repository URL, Target Release Tag (`v0.2.0-lab5`), Release Commit SHA, Public Cloud Run URL, Live Commit SHA running, Team member table with KMUTT IDs, GitHub usernames, contribution percentage, and Evidence Index mapping C-01..C-06 and R-01..R-12 to report pages.
       * **Answer Part 1: CI and Quality Gate (30 pts):** Evidence for R-05, R-06, C-01 (normal PR green run link & test summary), and C-02 (failing PR blocked merge screenshot).
       * **Answer Part 2: Docker and Reproducible Configuration (20 pts):** Evidence for R-01, R-02, and C-03 (clean clone local build & run terminal log).
       * **Answer Part 3: GCP Deployment and Persistence (35 pts):** Evidence for R-03, R-04, C-04 (domain workflow with browser URL bar visible), and C-05 (data persistence across scale-down, DB restart, and redeploy).
       * **Answer Part 4: Repeatable Release Pipeline (15 pts):** Evidence for R-07, R-08, and C-06 (reviewed change staging $\rightarrow$ main, live commit SHA display).

---

## 7. Master Execution Checklist & Progress Tracking

- [x] Create integration branch `lab5-staging` from `main`
- [x] Move and archive Sprint 1 documentation into `docs/sprints/sprint-1/`
- [x] Implement multi-stage `Dockerfile`, health checks, Express static serving (PR #26)
- [x] Verify repository is Public and has `lab5` label (R-10, R-12)
- [ ] User approval of Final Master Plan (`LAB5_MASTER_PLAN.md` v2.4) *(Team joint decision to check)*
- [x] **Issue 1 (Mon 9 Nov):** `@apfirst13` sets up GCP project, $5 Budget Alert, enables 8 required APIs (Cloud Build, STS, IAM Credentials), grants `@Theerawat82` IAM Editor role via personal Gmail, enables Secret Scanning Push Protection
- [x] **Issues 2 & 3 (Tue 10 Nov):** `@apfirst13` reviews PR #26 with substantive file-level comments (auditing Prisma CLI in production container); merge into `lab5-staging`
- [x] **Issue 3 (Tue 10 Nov):** Execute and capture **Check C-03** (Clean clone local build and run from `.env.example`, compose server from root Dockerfile)
- [x] **Issue 4 (Tue 10 Nov):** `@apfirst13` creates CI workflow PR with Node 24 and Postgres container; verify **Check C-01** (Green PR)
- [x] **Issue 5 (Wed 11 Nov):** `@Theerawat82` creates Artifact Registry repo `popqueue`, deploys Cloud SQL, creates `popqueue-sa`, creates and runs `popqueue-migrate` job with mounted seed secrets and idempotent seed; verify public URL live
- [x] **Issue 6 (Thu 12 Nov):** Pair work sets up WIF (with `workloadIdentityUser` and `serviceAccountUser` on `popqueue-sa`) and Branch Rulesets on `main` and `lab5-staging`
- [x] **Issue 6 (Thu 12 Nov):** Execute and capture **Check C-02** (Failing PR from temporary branch blocked from merging; leave closed)
- [x] **Issue 7 (Thu 12 Nov):** `@apfirst13` creates CD workflow with `workflow_dispatch`, updates migration job image before execute, read-only smoke test, and visible commit SHA; release via PR to `main` (**Check C-06 Execution**)
- [x] **Issue 8 (Fri 13 Nov):** Execute and capture **Check C-04** (Public domain workflow with browser URL bar visible, masked passwords)
- [x] **Issue 8 (Fri 13 Nov):** Execute and capture **Check C-05** (Data persistence across scale-down, Cloud SQL restart, and redeploy)
- [x] **Issue 8 (Fri 13 Nov):** Execute and capture **Check C-06 Verification** (Commit SHA traceability on live site matching release commit)
- [x] **Issue 9 (Sat 14 – Sun 15 Nov):** Pair work synchronizes `docs/labs/lab05/deployment.md`, waits for deploy, creates tag `v0.2.0-lab5` on `main`, compiles `lab5_sec1_BFteam.pdf` (Parts 0–4), and submits to LEB2 before 23:59
- [ ] Keep service running for Lab 6 UAT; pause Cloud SQL only during extended idle periods
