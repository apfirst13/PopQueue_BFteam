# PopQueue — Lab 5 Master Execution & Deployment Plan (v2.2 Final)
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
| **Issue 1** | Ep. 1 | `@apfirst13` | `@Theerawat82` | GCP Project Setup (`popqueue-lab5` or unique suffix), $5 Budget Alert, Enable APIs, **Add `@Theerawat82` as IAM Editor (Handout 4.4)**. *(Today's Target, 9 Nov)* |
| **Issues 2 & 3** | Ep. 2 & 3 | `@Theerawat82` | `@apfirst13` | Cloud Readiness, `.env.example`, Multi-stage Dockerfile, Compose, Health endpoints (PR #26). `@apfirst13` conducts comprehensive file-by-file code review. |
| **Issue 4** | Ep. 4 | `@apfirst13` | `@Theerawat82` | CI Pipeline on PRs (`ci-docker.yml`) using **Node 24**, **PostgreSQL service container**, and `prisma migrate deploy`. Green PR demonstration (**C-01**). |
| **Issue 5** | Ep. 5 | `@Theerawat82` | `@apfirst13` | First Cloud Shell deployment (`deploy/deploy.sh`), Cloud SQL (`popqueue-pg`), Create runtime SA `popqueue-sa`, Cloud Run Job with **Idempotent DB Seeding**, Secret Manager. |
| **Issue 6** | Ep. 6 | **Pair Work** (`@apfirst13` & `@Theerawat82`) | Co-reviewed | Workload Identity Federation (WIF) setup (least privilege, `serviceAccountUser` on `popqueue-sa`), GitHub Environment `demo`, Branch Protection Rulesets on **both `main` and `lab5-staging`**, and **Failing PR Merge Block demonstration (C-02)**. |
| **Issue 7** | Ep. 7 | `@apfirst13` | `@Theerawat82` | Automated CD Pipeline (`deploy.yml`) on merge to `main`, Read-only Automated Smoke Test, Expose `GIT_SHA` in UI/API, **Release visible change (C-06 Pipeline Execution)**. |
| **Issue 8** | Ep. 8 | `@Theerawat82` | `@apfirst13` | Live Domain Workflow screenshots (**C-04**), Data Persistence Verification across scale-down & DB restart (**C-05**), and **Live Commit SHA Traceability (C-06 Verification)**. |
| **Issue 9** | Ep. 9 | **Pair Work** (`@Theerawat82` & `@apfirst13`) | Joint sign-off | Finalize `docs/labs/lab05/deployment.md`, Tag `v0.2.0-lab5` on `main`, Cost Management (Cloud SQL pause policy), Evidence collation, and PDF report compilation (`lab5_sec1_BFteam.pdf`). |

---

## 2. Adjusted Project Timeline & Delivery Milestones

Per team agreement, **Today (9 Nov) is dedicated exclusively to Issue 1** (GCP Setup, Budget Alert & IAM Team Access) to establish a rock-solid cloud foundation without rushing. Subsequent issues follow in a clean, manageable sequence:

```
[9 Nov (Today): Issue 1 — GCP Free Trial, Project Setup, $5 Budget Alert, IAM Editor]
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
[13 Nov (Fri): Issue 8 — C-04 Domain Workflow, C-05 Persistence Test, C-06 Verification]
       |
       v
[14 Nov (Sat): Issue 9 — Finalize docs/labs/lab05/deployment.md, Compile lab5_sec1_BFteam.pdf]
       |
       v
[15 Nov (Sun): Final Review against Rubric, Tag v0.2.0-lab5 on main, Submit to LEB2 before 23:59]
```

| Date | Planned Execution Milestone | Focus Scope & Key Outputs |
|:---:|---|---|
| **Mon 9 Nov (Today)** | **Issue 1 exclusively:** Setup GCP Project (`popqueue-lab5`), $5 Budget Alert, enable 5 required APIs, grant `@Theerawat82` IAM Editor role. | Cloud infrastructure foundation established; zero code changes to `main`. |
| **Tue 10 Nov** | **Issues 2 & 3:** `@apfirst13` conducts substantive code review on PR #26 $\rightarrow$ merge to `lab5-staging` $\rightarrow$ execute **C-03 (Clean clone demo)**. Then `@apfirst13` implements **Issue 4** (CI on PR with Node 24 & Postgres container, **C-01 demo**). | Staging baseline merged; CI gate enforced on PRs. |
| **Wed 11 Nov** | **Issue 5:** `@Theerawat82` executes first deployment via Cloud Shell (`deploy/deploy.sh`), Cloud SQL setup, `popqueue-sa` IAM, and Idempotent DB seed verification. | **Public GCP URL live and operational** for domain testing. |
| **Thu 12 Nov** | **Issue 6:** Pair work sets up WIF (with `serviceAccountUser`), branch rulesets on `main` and `lab5-staging`, execute **C-02 (Failing PR demo)**.<br>**Issue 7:** `@apfirst13` sets up automated CD pipeline (`deploy.yml`), read-only smoke test, releases visible change (commit SHA in UI footer) via PR to `main` (**C-06 execution**). | Automated CD active; **ready for Lab 6 partner team UAT**. |
| **Fri 13 Nov** | **Issue 8:** Execute **C-04 (Public domain workflow screenshots with browser URL bar)**, **C-05 (Persistence test across scale-down & Cloud SQL restart)**, and **C-06 (Live SHA verification)**. | All 6 required demonstration checks captured with complete evidence. |
| **Sat 14 Nov** | **Issue 9:** Finalize `docs/labs/lab05/deployment.md`, compile PDF report (`lab5_sec1_BFteam.pdf`, Parts 0–4), peer review against rubric. | Report draft complete; peer review of evidence. |
| **Sun 15 Nov** | Final buffer, review against rubric, create Git release tag `v0.2.0-lab5` on `main`, submit PDF to LEB2 before 23:59. | **Final Submission Complete.** Service left running for grading. |

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
                 | - Edition: Enterprise         |   | - popqueue-seed-admin-pw   |
                 | - Persistent Storage (SSD)    |   +----------------------------+
                 +-------------------------------+
```

### 3.1 Service Account & Least-Privilege IAM Matrix (Issues 5 & 6)
To satisfy security best practices and prevent actAs deployment errors:

| Service Account | Primary Purpose | Required Roles & Bindings |
|---|---|---|
| **`popqueue-sa@PROJECT.iam...`** | Runtime identity for Cloud Run service and migration job. | 1. `roles/secretmanager.secretAccessor`<br>2. `roles/cloudsql.client` |
| **`github-deployer@PROJECT.iam...`** | Automated CD identity via Workload Identity Federation. | 1. `roles/run.admin`<br>2. `roles/artifactregistry.writer`<br>3. **`roles/iam.serviceAccountUser` on `popqueue-sa`** *(Required for actAs privilege to deploy Cloud Run)* |
| **Workload Identity Provider** | Keyless token exchange with GitHub Actions. | Bound to `principalSet://.../attribute.repository/apfirst13/PopQueue_BFteam`<br>Restricted in workflow to `github.ref == 'refs/heads/main'`. |

### 3.2 Idempotent Database Seeding Protocol (Issue 5 & CD Pipeline)
The Cloud Run migration job runs:
```bash
npx prisma migrate deploy && npx prisma db seed
```
* **Idempotency Rule:** `prisma/seed.ts` uses `prisma.user.upsert`, `prisma.series.upsert`, and `prisma.staffSeriesAssignment.upsert`.
* **Zero-Data Loss Guarantee:** Seeding **NEVER** executes `TRUNCATE`, `DELETE`, or table drops.
* **Preservation of User Data:** Active queue tickets (`Ticket`) and sequential queue counters (`DailyQueueSequence`) created by users during C-04/C-05 or Lab 6 UAT remain untouched across subsequent deployments.
* **Verification in Issue 5:** Execute seed twice consecutively on Cloud SQL to verify idempotency before performing C-05.

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
| **Part 3: GCP Deployment & Persistence** | **35** | Live deployment on GCP at a public URL with working UI, API, and database. Persistent database survives container restarts and redeployments. | **R-03, R-04**<br>Demonstrated via **C-04** (Public domain workflow) and **C-05** (Data persistence across scale-down & DB restart). |
| **Part 4: Repeatable Release Pipeline** | **15** | Repeatable CD pipeline deploying accepted releases from `main`. Commit SHA identification on live application and documented release procedure. | **R-07, R-08**<br>Demonstrated via **C-06** (Reviewed change staging $\rightarrow$ main, live commit SHA). |

### 4.2 Handout Requirements Traceability Table (R-01 to R-12)

| Req ID | Requirement Description (from Handout & Spec) | Implementation Mechanism | Evidence in Report |
|:---:|---|---|---|
| **R-01** | Package application with Docker; fresh build from clean clone produces a working container (Spec 5.1, 5.3, 10). | Root unified `Dockerfile`, `docker-compose.yml`, multi-stage build, Node 24 alpine, non-root user `node`. | **Check C-03**, Dockerfile listings, build logs. |
| **R-02** | Read every setting from environment; document in `.env.example` or `deployment.md`; zero secrets committed (Spec 5.3, 10). | `.env.example`, Secret Manager references (`popqueue-database-url`, `popqueue-jwt-secret`), `.gitignore`. | `.env.example` content, Secret Manager screenshot, clean git history. |
| **R-03** | Deploy on GCP at public URL; domain workflow works through UI, API, and DB (Spec 5.3, 10). | Google Cloud Run service `popqueue` + Cloud SQL PostgreSQL 16 `popqueue-pg`. | **Check C-04** screenshots showing browser URL bar. |
| **R-04** | Persistent database; data survives application restart and redeploy (Spec 5.1, 10). | Cloud SQL instance with managed persistent SSD storage; Cloud Run Job for migrations. | **Check C-05** evidence before/after scale-down and DB restart. |
| **R-05** | Run build and automated tests on every relevant PR with meaningful results (Spec 5.3, 10). | `.github/workflows/ci-docker.yml` running Node 24, PostgreSQL container, Vitest suites (147 server + 30 client tests). | **Check C-01** green PR run link and test log. |
| **R-06** | Required passing check; failed check blocks merge; show with failing PR from temp branch (Spec 5.3, 10). | GitHub Branch Ruleset requiring status check `test-and-docker` on `main` and `lab5-staging`. | **Check C-02** failing PR screenshot and blocked merge button. |
| **R-07** | Deploy accepted releases from `main` through repeatable pipeline: review $\rightarrow$ CI $\rightarrow$ merge $\rightarrow$ deploy (Spec 5.3, 8.3, 10). | `.github/workflows/deploy.yml` triggered on push to `main` via PR merge; runs CI checks first before deploy. | **Check C-06**, CD workflow run log, release PR link. |
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
| **C-03** | **Clean Clone Local Build & Run** | In a fresh directory, run `git clone`, checkout `lab5-staging` (post-PR #26), copy `.env.example` to `.env`, execute `docker compose up --build -d`. | Terminal log showing clean clone, successful multi-container startup (`db`, `migrate`, `server`, `client`), and `curl http://localhost:3000/api/health` returning 200 OK. |
| **C-04** | **Public Domain Workflow** | Open live public GCP URL in browser. Demonstrate collector login, join queue to generate ticket (`PQ-001`), staff counter login, call ticket, and business rule rejection (duplicate join 409 error). | Captioned screenshots **clearly showing the browser URL bar with GCP domain**. Password input masked; demo credentials shared with Lab 6 partner privately. |
| **C-05** | **Data Persistence across Scale-Down & DB Restart** | 1. Create queue ticket `PQ-001` on live URL.<br>2. Cloud Run scale-down: wait for idle instance scale-down to 0 instances, then issue new request to observe cold start instance.<br>3. Cloud SQL restart: execute `gcloud sql instances restart popqueue-pg`.<br>4. Query ticket: confirm `PQ-001` remains intact. | Screenshots of database queries or UI before and after scale-down and DB restart proving persistent storage. |
| **C-06** | **Repeatable Pipeline with Visible Change & Commit SHA** | 1. In Issue 7, release visible change (UI footer commit SHA badge) via PR `lab5-staging` $\rightarrow$ `main`.<br>2. Teammate reviews and approves PR.<br>3. Merge triggers `.github/workflows/deploy.yml`.<br>4. In Issue 8, verify live site displays updated commit SHA matching Git release commit. | Release PR link, teammate approval, Actions deploy log, and browser screenshot showing live URL displaying new commit SHA. |

---

## 6. Detailed Sequential Issue Execution Plan (Issues 1 to 9)

### Issue 1 (Episode 1): GCP Project Setup, Budget Alert ($5 Threshold) & IAM Team Access
* **GitHub Issue:** `Lab 5 Issue 1: Setup GCP Project, Budget Alert ($5 threshold) & IAM Team Access` (Issue #24)
* **Author:** `@apfirst13` | **Reviewer:** `@Theerawat82` | **Label:** `lab5`
* **Target Execution Date:** **Monday, 9 November 2026 (Today's Dedicated Focus)**
* **Tasks:**
  1. Create Google Cloud Project: `popqueue-lab5` (if project ID exists, append unique suffix e.g. `popqueue-lab5-bfteam`).
  2. Set Region: `asia-southeast1` (Singapore).
  3. Create Budget Alert:
     - Target Amount: $5.00 USD.
     - Thresholds: 50% ($2.50), 90% ($4.50), 100% ($5.00).
     - Notification: Email project owners.
     - *Pricing Awareness:* Cloud SQL `db-f1-micro` is billed hourly (~$7.60–$10/month in Singapore). The $5 alert will fire within ~2–3 weeks; it is an early warning notification, not a hard cutoff.
  4. Enable GCP APIs: `run.googleapis.com`, `sqladmin.googleapis.com`, `secretmanager.googleapis.com`, `artifactregistry.googleapis.com`, `iam.googleapis.com`.
  5. **Grant Teammate IAM Access (Handout 4.4):** `@apfirst13` grants `@Theerawat82` the role **Editor (`roles/editor`)** in GCP IAM.
* **Evidence:** Screenshot of GCP Budget Alert dashboard showing $5 budget, email alert settings, and IAM member table with both members.

---

### Issues 2 & 3 (Episodes 2 & 3): Cloud Readiness, Multi-Stage Dockerfile & Local Parity (PR #26)
* **GitHub Issue:** `Lab 5 Issues 2 & 3: Cloud Readiness, Docker Containerization & Local Verification` (Issue #25)
* **Author:** `@Theerawat82` | **Reviewer:** `@apfirst13` | **Label:** `lab5`
* **Target Execution Date:** **Tuesday, 10 November 2026**
* **Handling Existing PR #26 (Preserving R-10):**
  - PR #26 currently contains foundational Dockerfile, docker-compose, health checks, deploy scripts, and initial CI workflow.
  - Per **R-10 (no rewriting git history)**, PR #26 will NOT be deleted or rebased.
  - Description updated to reference Issue #24 and #25.
  - `@apfirst13` performs a detailed, substantive file-by-file code review on PR #26 (evaluating multi-stage build, health check endpoints, environment variable bindings).
  - Merge into `lab5-staging` once approved.
* **Tasks Implemented:**
  - Root multi-stage `Dockerfile`: builds Vite React frontend, compiles Express server, packages in Node 24 Alpine as user `node`, exposes port 3000.
  - Health checks in `server/src/app.ts`: `/api/health` and `/api/ready` (checks PostgreSQL via `SELECT 1`).
  - Production static serving: Express serves `/app/client/dist` for root `/` and SPA fallback routes.
  - `docker-compose.yml`: sets up `db` (Postgres 16), `migrate` (Prisma deploy), `server` (Express), and `client` (Nginx reverse proxy) for local development parity.
  - Created `.env.example` documenting all configuration keys (R-02).
  - Created `docs/labs/lab05/deployment.md` as canonical specification.
* **Verification Check C-03 (Clean Clone Local Build & Run):**
  - In a separate clean directory, run `git clone`, checkout `lab5-staging`, `cp .env.example .env`, `docker compose up --build -d`.
  - Capture terminal log showing healthy services and `curl http://localhost:3000/api/health` returning 200 OK.

---

### Issue 4 (Episode 4): CI Pipeline on Pull Requests with Automated Testing & Docker Build Gate
* **GitHub Issue:** `Lab 5 Issue 4: CI Pipeline on Pull Requests with PostgreSQL Service Container & Docker Build Gate`
* **Author:** `@apfirst13` | **Reviewer:** `@Theerawat82` | **Label:** `lab5`
* **Target Execution Date:** **Tuesday, 10 November 2026**
* **Branch:** `feature/lab5-ci-workflow` $\rightarrow$ PR to `lab5-staging`
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
* **Branch:** `feature/lab5-cloud-deploy` $\rightarrow$ PR to `lab5-staging`
* **Tasks:**
  1. Create Runtime Service Account `popqueue-sa`:
     ```bash
     gcloud iam service-accounts create popqueue-sa --display-name="PopQueue Runtime SA"
     gcloud projects add-iam-policy-binding $PROJECT_ID \
       --member="serviceAccount:popqueue-sa@$PROJECT_ID.iam.gserviceaccount.com" \
       --role="roles/secretmanager.secretAccessor"
     gcloud projects add-iam-policy-binding $PROJECT_ID \
       --member="serviceAccount:popqueue-sa@$PROJECT_ID.iam.gserviceaccount.com" \
       --role="roles/cloudsql.client"
     ```
  2. Provision Cloud SQL instance: `popqueue-pg` (PostgreSQL 16, tier `db-f1-micro`, `--edition=enterprise`, region `asia-southeast1`).
     Create database `popqueue_db` and user `popqueue_user`.
  3. Secret Manager Configuration:
     - `popqueue-database-url`: Unix socket string `postgresql://popqueue_user:...@localhost/popqueue_db?host=/cloudsql/PROJECT:REGION:INSTANCE`.
     - `popqueue-jwt-secret`: High-entropy random secret.
     - `popqueue-seed-admin-pw`: Secure password for demo accounts.
  4. Cloud Run Migration & Idempotent Seeding Job:
     - Run `popqueue-migrate` job executing `npx prisma migrate deploy && npx prisma db seed`.
     - Verify seed idempotency: run seed twice to verify no duplicate records or errors occur.
  5. Deploy Cloud Run Service `popqueue`:
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
* **Collaboration:** **Pair Work** (`@apfirst13` & `@Theerawat82`) | **Label:** `lab5`
* **Target Execution Date:** **Thursday, 12 November 2026**
* **Branch:** `feature/lab5-wif-ruleset` $\rightarrow$ PR to `lab5-staging`
* **PR Content:** Documentation of WIF setup, IAM roles, GitHub Environment bindings, and ruleset screenshots. `@Theerawat82` authors PR, `@apfirst13` reviews and approves.
* **Tasks:**
  1. Workload Identity Federation (WIF) Setup:
     - Pool: `github-actions-pool`.
     - Provider: `github-actions-provider`.
     - Service Account: `github-deployer@$PROJECT_ID.iam.gserviceaccount.com`.
     - IAM Bindings (Least Privilege):
       - `roles/run.admin` on project.
       - `roles/artifactregistry.writer` on project.
       - **`roles/iam.serviceAccountUser` on `popqueue-sa`** *(Enables deployer to actAs runtime SA)*.
       - *(Deployer does NOT receive secretAccessor)*.
     - Attribute Condition: Bound to `attribute.repository == "apfirst13/PopQueue_BFteam"`.
  2. GitHub Environment `demo`:
     - Variables: `GCP_PROJECT_ID`, `GCP_REGION`, `WIF_PROVIDER`, `WIF_SERVICE_ACCOUNT`.
     - Enable Secret Scanning Push Protection on repo settings (R-12).
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
* **Branch:** `feature/lab5-cd-pipeline` $\rightarrow$ PR to `lab5-staging`
* **Tasks:**
  1. Configure `.github/workflows/deploy.yml`:
     - Trigger: Push to `main` (resulting from merged release PR).
     - Step 1: Run CI quality gate tests first. If tests fail, halt deployment immediately.
     - Step 2: Authenticate to GCP using WIF.
     - Step 3: Build Docker image tagged with Git commit SHA (`popqueue:$GITHUB_SHA`) and push to Artifact Registry.
     - Step 4: Execute Cloud Run migration job `popqueue-migrate` (runs migrations + idempotent seed).
     - Step 5: Deploy to Cloud Run with `--image ...:$GITHUB_SHA` and set label `--update-labels=commit-sha=$GITHUB_SHA`.
     - Step 6: Wait for deployment healthy.
     - Step 7: Execute read-only smoke test `python deploy/smoke_test.py --url $SERVICE_URL`.
  2. Read-Only Automated Smoke Test (`deploy/smoke_test.py`):
     - Validates:
       - `GET /api/health` -> 200 OK (returns valid status and commit SHA).
       - `GET /api/ready` -> 200 OK (verifies Cloud SQL connectivity).
       - `GET /` -> 200 OK (verifies React SPA HTML loaded).
       - `GET /api/series` -> 200 OK (verifies seeded series catalog query).
     - *Design Note:* Automated CD smoke test remains strictly **read-only** to prevent polluting production DB with test data on every deploy.
  3. Release a **Visible Change (Check C-06 Execution)**:
     - Add the commit SHA display badge to the Web UI footer and `/api/health`.
     - Release through PR `lab5-staging` $\rightarrow$ `main`.
     - Teammate `@Theerawat82` reviews and approves PR.
     - Merge triggers automated deployment pipeline to live Cloud Run.

---

### Issue 8 (Episode 8): Live Domain Workflow & Cloud SQL Persistence Verification
* **GitHub Issue:** `Lab 5 Issue 8: Live Domain Workflow, Data Persistence across Scale-Down & DB Restart, and Live SHA Traceability`
* **Author:** `@Theerawat82` | **Reviewer:** `@apfirst13` | **Label:** `lab5`
* **Target Execution Date:** **Friday, 13 November 2026**
* **Branch:** `feature/lab5-persistence-verify` $\rightarrow$ PR to `lab5-staging`
* **Tasks:**
  1. **Execute Verification Check C-04 (Public Domain Workflow):**
     - Open live public URL in browser.
     - Demonstrate collector login, browse series, join queue to generate ticket (`PQ-001`).
     - Open staff counter, login as staff, call ticket, transition state to serving.
     - Demonstrate business rule rejection: attempt duplicate join with same collector account; verify 409 Conflict error.
     - Capture clear screenshots showing the **complete browser URL bar with GCP domain**.
     - *Password masking:* Ensure password fields are masked in screenshots; share demo credentials with Lab 6 partner team privately.
  2. **Execute Verification Check C-05 (Data Persistence across Scale-Down & DB Restart):**
     - Record ticket ID `PQ-001` in database.
     - **Test 1: Cloud Run Scale-Down:** Allow Cloud Run instance to scale to 0 (idle). Issue a new request, observing a fresh instance/cold start. Confirm `PQ-001` exists.
     - **Test 2: Cloud SQL Database Restart:** Execute `gcloud sql instances restart popqueue-pg`. After instance recovers, query live URL and confirm `PQ-001` and daily sequence remain intact.
     - Capture evidence screenshots before and after restart proving persistent SSD storage.
  3. **Execute Verification Check C-06 Verification (Live Commit SHA):**
     - Verify live site displays the commit SHA matching the release commit from Issue 7.
     - Capture screenshot of `/api/health` response and UI footer showing the exact Git SHA.
  4. Document Rollback Procedure:
     - Document manual revision rollback command (`gcloud run services update-traffic popqueue --to-revisions=PREVIOUS_REVISION=100`) in `deployment.md` as recommended operational procedure.

---

### Issue 9 (Episode 9): Deployment Documentation, Release Tag & Deliverable PDF Report
* **GitHub Issue:** `Lab 5 Issue 9: Finalize Deployment Docs, Release Tag v0.2.0-lab5 & Deliverable PDF Report`
* **Collaboration:** **Pair Work** (`@Theerawat82` & `@apfirst13`) | **Label:** `lab5`
* **Target Execution Date:** **Saturday, 14 November & Sunday, 15 November 2026**
* **Tasks:**
  1. Finalize Documentation:
     - Set `docs/labs/lab05/deployment.md` as the canonical document.
     - Ensure `docs/labs/lab-05/deployment.md` and `docs/deployment.md` link to the canonical document.
  2. Create Release Tag:
     - Create and push annotated tag `v0.2.0-lab5` on `main`:
       ```bash
       git tag -a v0.2.0-lab5 -m "Lab 5 Accepted Release: Cloud Deployment and CI/CD Pipeline on GCP"
       git push origin v0.2.0-lab5
       ```
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
       * **Answer Part 3: GCP Deployment and Persistence (35 pts):** Evidence for R-03, R-04, C-04 (domain workflow with browser URL bar visible), and C-05 (data persistence before/after scale-down and DB restart).
       * **Answer Part 4: Repeatable Release Pipeline (15 pts):** Evidence for R-07, R-08, and C-06 (reviewed change staging $\rightarrow$ main, live commit SHA display).

---

## 7. Master Execution Checklist & Progress Tracking

- [x] Create integration branch `lab5-staging` from `main`
- [x] Move and archive Sprint 1 documentation into `docs/sprints/sprint-1/`
- [x] Implement multi-stage `Dockerfile`, health checks, Express static serving (PR #26)
- [x] Verify repository is Public and has `lab5` label (R-10, R-12)
- [ ] User approval of Final Master Plan (`LAB5_MASTER_PLAN.md` v2.2)
- [ ] **Issue 1 (Mon 9 Nov - TODAY'S FOCUS):** `@apfirst13` sets up GCP project, $5 Budget Alert, and grants `@Theerawat82` IAM Editor role
- [ ] **Issues 2 & 3 (Tue 10 Nov):** `@apfirst13` reviews PR #26 with substantive file-level comments; merge into `lab5-staging`
- [ ] **Issue 3 (Tue 10 Nov):** Execute and capture **Check C-03** (Clean clone local build and run from `.env.example`)
- [ ] **Issue 4 (Tue 10 Nov):** `@apfirst13` creates CI workflow PR with Node 24 and Postgres container; verify **Check C-01** (Green PR)
- [ ] **Issue 5 (Wed 11 Nov):** `@Theerawat82` deploys Cloud SQL, creates `popqueue-sa`, runs idempotent seed; verify public URL live
- [ ] **Issue 6 (Thu 12 Nov):** Pair work sets up WIF (with `serviceAccountUser`) and Branch Rulesets on `main` and `lab5-staging`
- [ ] **Issue 6 (Thu 12 Nov):** Execute and capture **Check C-02** (Failing PR from temporary branch blocked from merging; leave closed)
- [ ] **Issue 7 (Thu 12 Nov):** `@apfirst13` creates CD workflow with read-only smoke test and visible commit SHA; release via PR to `main` (**Check C-06 Execution**)
- [ ] **Issue 8 (Fri 13 Nov):** Execute and capture **Check C-04** (Public domain workflow with browser URL bar visible, masked passwords)
- [ ] **Issue 8 (Fri 13 Nov):** Execute and capture **Check C-05** (Data persistence across scale-down and Cloud SQL restart)
- [ ] **Issue 8 (Fri 13 Nov):** Execute and capture **Check C-06 Verification** (Commit SHA traceability on live site matching release commit)
- [ ] **Issue 9 (Sat 14 – Sun 15 Nov):** Pair work synchronizes `docs/labs/lab05/deployment.md`, creates tag `v0.2.0-lab5`, compiles `lab5_sec1_BFteam.pdf` (Parts 0–4), and submits to LEB2 before 23:59
- [ ] Keep service running for Lab 6 UAT; pause Cloud SQL only during extended idle periods
