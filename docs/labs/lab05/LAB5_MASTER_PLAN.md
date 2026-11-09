# PopQueue — Lab 5 Master Execution & Deployment Plan (Revised v2.0)
## Cloud Deployment and CI/CD Pipeline on Google Cloud Platform (GCP)

**Course:** CPE 334 Introduction to Software Engineering in the Age of AI Agents (Semester 1/2026, KMUTT)  
**Theme:** Theme 9 — Queue and Service Management System (PopQueue: On-site Virtual Queue for Art Toy Live Unboxing)  
**Team:** BFteam (Section 1)  
**Total Points:** 100 Lab Points (5% of Course Grade)  
**Submission Document:** Single PDF named `lab5_sec1_BFteam.pdf` via LEB2  
**Target Release Tag:** `v0.2.0-lab5`  
**Baseline Source:** Sprint 1 Accepted Release (`v0.1.0-sprint1`, Commit `d946159`, Branch `main`)  
**Integration Branches:** `main` (Protected Production) and `lab5-staging` (Protected Staging)  
**Repository (Public, R-12):** [https://github.com/apfirst13/PopQueue_BFteam](https://github.com/apfirst13/PopQueue_BFteam)

---

## 1. Executive Summary & Non-Permanent Team Roles (R-09, R-11)

This Master Execution Plan aligns PopQueue with the exact requirements of **Lab 5 (Cloud Deployment and CI/CD Pipeline on GCP)** as defined in `01_SE_Lab_5_updated.pdf` and the CPE 334 Group Work Specification.

### 1.1 Non-Permanent Role Rotation (Spec Section 2 & R-11)
Per course regulations, team members **must not divide learning outcomes into permanent roles** (e.g. one pure developer and one pure reviewer). Both members must actively participate across requirements, containerization, CI/CD pipelines, GCP cloud deployment, automated testing, code review, and documentation.

To ensure compliance with **R-09 (author cannot approve own PR)** and **R-11 (shared participation)**, author and reviewer responsibilities rotate across issues:

| Issue / Topic | Handout Episode | Primary Author (Implementer) | Required Reviewer (Approver) | Scope & Collaboration |
|:---:|:---:|:---:|:---:|---|
| **Issue 1** | Ep. 1 | `@apfirst13` | `@Theerawat82` | GCP Project Setup, $5 Budget Alert, Enable APIs, **Add `@Theerawat82` as IAM Editor (Handout 4.4)**. |
| **Issue 2 & 3** | Ep. 2 & 3 | `@Theerawat82` | `@apfirst13` | Cloud Readiness, `.env.example`, Multi-stage Dockerfile, Compose, Health endpoints (PR #26). `@apfirst13` conducts comprehensive file-by-file code review. |
| **Issue 4** | Ep. 4 | `@apfirst13` | `@Theerawat82` | CI Pipeline on PRs (`ci-docker.yml`) using **Node 24** and **PostgreSQL service container**. Green PR demonstration (**C-01**). |
| **Issue 5** | Ep. 5 | `@Theerawat82` | `@apfirst13` | First Cloud Shell deployment (`deploy/deploy.sh`), Cloud SQL (`popqueue-pg`), Cloud Run Job with DB seeding, Secret Manager. |
| **Issue 6** | Ep. 6 | **Pair Work** (`@apfirst13` & `@Theerawat82`) | Co-reviewed | Workload Identity Federation (WIF) setup (least privilege), GitHub Environment `demo`, Branch Protection Rulesets on **both `main` and `lab5-staging`**, and **Failing PR Merge Block demonstration (C-02)**. |
| **Issue 7** | Ep. 7 | `@apfirst13` | `@Theerawat82` | Automated CD Pipeline (`deploy.yml`) on merge to `main`, Read-only Automated Smoke Test, Expose `GIT_SHA` in UI/API, Release visible change. |
| **Issue 8** | Ep. 8 | `@Theerawat82` | `@apfirst13` | Data Persistence Verification across restart & redeploy (**C-05**), Live Commit SHA traceability (**C-06**), and rollback procedure documentation. |
| **Issue 9** | Ep. 9 | **Pair Work** (`@Theerawat82` & `@apfirst13`) | Joint sign-off | Finalize `deployment.md`, Cost Management (Cloud SQL pause policy), Evidence collation, and PDF report compilation (`lab5_sec1_BFteam.pdf`). |

---

## 2. Target Cloud Architecture & Production Parity

PopQueue is packaged and deployed to Google Cloud Platform using the reference serverless container stack.

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
                         |  - Unified Multi-Stage Image (Node 24 Alpine)  |
                         |    * Port 3000                                 |
                         |    * Express 4 API endpoints (/api/*)          |
                         |    * React 18 SPA static host (/app/client/dist|
                         |    * Health check endpoints (/api/health, ready|
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

### Production Parity & Design Decisions
1. **Container Alignment (R-01):** The root multi-stage `Dockerfile` handles production compilation:
   - Stage 1 (`client-builder`): Builds Vite React SPA -> outputs to static dist.
   - Stage 2 (`server-builder`): Compiles Express TypeScript code.
   - Stage 3 (`production`): Node 24 Alpine minimal runtime, non-root user `node`, Prisma generated client, Express static file server on port 3000.
   - Local `docker-compose.yml` runs PostgreSQL 16 Alpine, migration container, and server/client with full network parity.
2. **Database Seeding on Cloud:** To enable live login for grading demonstration (**C-04**) and for Lab 6 partner team UAT, the Cloud Run migration job runs `prisma migrate deploy` followed by `prisma db seed` using credentials safely injected via Secret Manager (never hardcoded in git, **R-02**).
3. **Commit Traceability (R-08):** `GIT_SHA` is injected into the container build:
   - Returned by `GET /api/health` -> `{ status: "ok", commit: "a1b2c3d", timestamp: "..." }`.
   - Displayed in the Web UI footer -> `PopQueue v0.2.0 (Commit: a1b2c3d)`.
   - Labeled on Cloud Run revisions -> `--set-labels=commit-sha=a1b2c3d`.

---

## 3. Official Lab 5 Rubric & Requirements Traceability Matrix (100 Points)

The Lab 5 score is evaluated based on the **4 official rubric categories** totaling 100 points.

```
Total: 100 Points
├── 1. CI and Quality Gate (30 Points)       [R-05, R-06, C-01, C-02]
├── 2. Docker & Reproducible Config (20 Points)[R-01, R-02, C-03]
├── 3. GCP Deployment & Persistence (35 Points)[R-03, R-04, C-04, C-05]
└── 4. Repeatable Release Pipeline (15 Points)[R-07, R-08, C-06]
```

### 3.1 Rubric Category Breakdown

| Rubric Part | Points | Scope & Deliverables | Primary Checks & Requirements |
|---|:---:|---|---|
| **Part 1: CI and Quality Gate** | **30** | GitHub Actions CI workflow running automated unit/integration tests and build checks on PRs. Passing check is strictly required before merge. | **R-05, R-06**<br>Demonstrated via **C-01** (Normal green PR) and **C-02** (Failing PR merge block). |
| **Part 2: Docker & Reproducible Config** | **20** | Full-stack application containerization, multi-stage build, non-root user, reproducible environment from clean clone via `.env.example`, zero committed secrets. | **R-01, R-02**<br>Demonstrated via **C-03** (Clean clone local build & run). |
| **Part 3: GCP Deployment & Persistence** | **35** | Live deployment on GCP at a public URL with working UI, API, and database. Persistent database survives container restarts and redeployments. | **R-03, R-04**<br>Demonstrated via **C-04** (Public domain workflow) and **C-05** (Data persistence across restart & redeploy). |
| **Part 4: Repeatable Release Pipeline** | **15** | Repeatable CD pipeline deploying accepted releases from `main`. Commit SHA identification on live application and documented release procedure. | **R-07, R-08**<br>Demonstrated via **C-06** (Reviewed change staging $\rightarrow$ main, live commit SHA). |

### 3.2 Handout Requirements Traceability Table (R-01 to R-12)

| Req ID | Requirement Description (from Handout & Spec) | Implementation Mechanism | Evidence in Report |
|:---:|---|---|---|
| **R-01** | Package application with Docker; fresh build from clean clone produces a working container (Spec 5.1, 5.3, 10). | Root unified `Dockerfile`, `docker-compose.yml`, multi-stage build, Node 24 alpine, non-root user `node`. | **Check C-03**, Dockerfile listings, build logs. |
| **R-02** | Read every setting from environment; document in `.env.example` or `deployment.md`; zero secrets committed (Spec 5.3, 10). | `.env.example`, Secret Manager references (`popqueue-database-url`, `popqueue-jwt-secret`), `.gitignore`. | `.env.example` content, Secret Manager screenshot, clean git history. |
| **R-03** | Deploy on GCP at public URL; domain workflow works through UI, API, and DB (Spec 5.3, 10). | Google Cloud Run service `popqueue` + Cloud SQL PostgreSQL 16 `popqueue-pg`. | **Check C-04** screenshots showing browser URL bar. |
| **R-04** | Persistent database; data survives application restart and redeploy (Spec 5.1, 10). | Cloud SQL instance with managed persistent SSD storage; Cloud Run Job for migrations. | **Check C-05** evidence before/after restart and redeploy. |
| **R-05** | Run build and automated tests on every relevant PR with meaningful results (Spec 5.3, 10). | `.github/workflows/ci-docker.yml` running Node 24, PostgreSQL container, Vitest suites (147 server + 30 client tests). | **Check C-01** green PR run link and test log. |
| **R-06** | Required passing check; failed check blocks merge; show with failing PR from temp branch (Spec 5.3, 10). | GitHub Branch Ruleset requiring status check `test-and-docker` on `main` and `lab5-staging`. | **Check C-02** failing PR screenshot and blocked merge button. |
| **R-07** | Deploy accepted releases from `main` through repeatable pipeline: review $\rightarrow$ CI $\rightarrow$ merge $\rightarrow$ deploy (Spec 5.3, 8.3, 10). | `.github/workflows/deploy.yml` triggered on push to `main` via PR merge; runs CI checks first before deploy. | **Check C-06**, CD workflow run log, release PR link. |
| **R-08** | Identify commit of each release (tag/SHA) and document release procedure in `deployment.md` (Spec 8.3, 10). | Expose `GIT_SHA` in `GET /api/health`, UI footer, and Cloud Run revision labels. Document procedure. | **Check C-06**, `/api/health` JSON response, UI footer screenshot. |
| **R-09** | Use Issues, project board, feature/fix branches, PRs into staging reviewed by teammate, release PR into main (author cannot approve own PR) (Spec 5.3, 8.3). | GitHub Issues labeled `lab5`, branch model (`feature/*` $\rightarrow$ `lab5-staging` $\rightarrow$ `main`), cross-reviews (@apfirst13 & @Theerawat82). | PR review comments, approval history, branch graph. |
| **R-10** | Label Lab 5 Issues and PRs (`lab5`); clean commit history; no rewriting history (`git push --force` forbidden) (Spec 8.3). | All Lab 5 items labeled `lab5`. Linear, clean commit history preserved; no rebase or deletion of existing commits. | Issue and PR list with `lab5` label; git log. |
| **R-11** | Both members participate across requirements, testing, implementation, review, deployment; record in Issues/commits/PRs (Spec 2). | Role rotation across Issues 1 to 9 (see Section 1.1). Both author and review code/deployments. | GitHub commit insights, PR authors & reviewers table. |
| **R-12** | Public repository throughout grading period; no committed secrets; enable Secret scanning push protection (Spec 11). | Repository `apfirst13/PopQueue_BFteam` is public. Secret Manager used for cloud credentials; git history verified clean. | Repository visibility verification, Secret scanning status. |

> **Recommended Practices (Not Scored Separately):**
> * **$5 Budget Alert (Episode 1):** Configured in GCP Billing to alert via email at 50%, 90%, 100%. (Essential operational safety; does not automatically terminate resources).
> * **Workload Identity Federation (Episode 6):** Keyless authentication from GitHub Actions to GCP (no long-lived service account keys).
> * **Manual Rollback (Episode 8):** `gcloud run services update-traffic` to divert 100% traffic back to previous revision on demand.

---

## 4. Mandatory Demonstration Verification Checks (C-01 to C-06)

These 6 checks correspond directly to the required evidence defined in Handout Section 8:

| Check ID | Handout Description | Execution Method & Demonstration | Expected Output & Evidence in Report |
|:---:|---|---|---|
| **C-01** | **Normal PR CI Gate** | Create feature branch, make valid change, open PR into `lab5-staging`. | GitHub Actions runs `test-and-docker`. All backend tests (147), frontend tests (30), and Docker build pass. Green check shown. |
| **C-02** | **Failing PR Merge Block** | From a temporary branch `temp/c02-failing-check`, add a deliberately failing test or syntax error and open PR. | CI job fails. GitHub branch ruleset marks check failed and **disables the merge button**. Captioned screenshot of blocked merge. *(Executed in Issue 6 after ruleset is enabled).* |
| **C-03** | **Clean Clone Local Build & Run** | In a fresh temporary directory, run `git clone`, copy `.env.example` to `.env`, execute `docker compose up --build -d`, and test. | Terminal log showing clean clone, successful multi-container startup (`db`, `migrate`, `server`, `client`), and `curl http://localhost:3000/api/health` returning 200 OK. |
| **C-04** | **Public Domain Workflow** | Open the live GCP Cloud Run URL in a web browser. Demonstrate full domain workflow: Collector Login $\rightarrow$ Join Queue $\rightarrow$ Staff Counter Login $\rightarrow$ Call Next $\rightarrow$ Rule rejection (e.g. duplicate join attempt). | Captioned screenshots **clearly showing the browser URL bar** with the public GCP domain for each workflow step. |
| **C-05** | **Data Persistence across Restart & Redeploy** | 1. Create a queue ticket on the live GCP URL.<br>2. Restart Cloud Run (force container scale to 0 or restart revision). Verify ticket still exists.<br>3. Deploy a new revision. Verify ticket still exists. | Screenshots of database queries or UI before restart, after restart, and after redeploy proving zero data loss. |
| **C-06** | **Repeatable Pipeline with Visible Change & Commit SHA** | 1. Create PR from `lab5-staging` to `main` with a visible change (UI footer commit SHA badge).<br>2. Teammate reviews and approves PR.<br>3. Merge triggers `.github/workflows/deploy.yml`.<br>4. Live site deploys automatically and reflects the exact commit SHA. | PR review approval link, successful CD workflow run log, and browser screenshot showing live URL displaying the new commit SHA. |

---

## 5. Detailed Sequential Issue Execution Plan (Issues 1 to 9)

```
[Issue 1: GCP & $5 Budget Alert] (Console, @apfirst13 author, @Theerawat82 review, add IAM Editor)
        |
        v
[Issues 2 & 3: Cloud Readiness, Dockerization, PR #26] (@Theerawat82 author, @apfirst13 substantive review)
        |
        v
[Issue 4: CI on PRs with Node 24 & Postgres Service Container] (@apfirst13 author, @Theerawat82 review, Check C-01)
        |
        v
[Issue 5: Cloud Shell Deploy, Cloud SQL & DB Seeding] (@Theerawat82 author, @apfirst13 review)
        |
        v
[Issue 6: WIF, Branch Ruleset on Staging+Main, Check C-02] (Pair work, Failing PR merge block)
        |
        v
[Issue 7: Automated CD Pipeline, Read-only Smoke Test, Visible Change] (@apfirst13 author, @Theerawat82 review)
        |
        v
[Issue 8: Persistence Verification C-05, Live Revision Traceability C-06] (@Theerawat82 author, @apfirst13 review)
        |
        v
[Issue 9: Deployment Docs, Cost Management & PDF Report Part 0-4] (Pair work, lab5_sec1_BFteam.pdf)
```

### Issue 1 (Episode 1): GCP Project Setup, Budget Alert ($5 Threshold) & IAM Team Access
* **GitHub Issue:** `Lab 5 Issue 1: Setup GCP Project, Budget Alert ($5 threshold) & IAM Team Access` (Issue #24)
* **Author:** `@apfirst13` | **Reviewer:** `@Theerawat82` | **Label:** `lab5`
* **Tasks:**
  1. Create Google Cloud Project: `popqueue-lab5` (linked to Free Trial billing account).
  2. Set Region: `asia-southeast1` (Singapore).
  3. Create Budget Alert:
     - Target Amount: $5.00 USD.
     - Thresholds: 50% ($2.50), 90% ($4.50), 100% ($5.00).
     - Notification: Email project owners.
     - *Understanding Cost:* Cloud SQL `db-f1-micro` is billed hourly (~$7.60/month). The $5 alert will fire within ~3 weeks; it is an alert, not a hard shutoff.
  4. Enable GCP APIs: `run.googleapis.com`, `sqladmin.googleapis.com`, `secretmanager.googleapis.com`, `artifactregistry.googleapis.com`, `iam.googleapis.com`.
  5. **Add Teammate to IAM (Handout 4.4):** `@apfirst13` grants `@Theerawat82` the role **Editor (`roles/editor`)** in GCP IAM so both members can deploy and manage resources from Cloud Shell.
* **Evidence:** Screenshot of GCP Budget Alert dashboard showing $5 budget, email alert settings, and IAM member table with both members.

---

### Issues 2 & 3 (Episodes 2 & 3): Cloud Readiness, Multi-Stage Dockerfile & Local Parity (PR #26)
* **GitHub Issue:** `Lab 5 Issues 2 & 3: Cloud Readiness, Docker Containerization & Local Verification` (Issue #25)
* **Author:** `@Theerawat82` | **Reviewer:** `@apfirst13` | **Label:** `lab5`
* **Handling Existing PR #26 (Preserving R-10):**
  - PR #26 currently contains the foundational Dockerfile, docker-compose, health checks, deploy scripts, and initial CI workflow.
  - Per **R-10 (no rewriting git history)**, PR #26 will NOT be deleted or rebased.
  - Description updated to reference Issue #24 and #25.
  - `@apfirst13` performs a detailed, substantive code review on PR #26 (evaluating multi-stage build, health check endpoints, environment variable bindings).
  - Merged into `lab5-staging` once approved.
* **Tasks Implemented:**
  - Root multi-stage `Dockerfile`: builds Vite React frontend, compiles Express server, packages in Node 24 Alpine as user `node`, exposes port 3000.
  - Health checks in `server/src/app.ts`: `/api/health` and `/api/ready` (checks PostgreSQL via `SELECT 1`).
  - Production static serving: Express serves `/app/client/dist` for root `/` and SPA fallback routes.
  - `docker-compose.yml`: sets up `db` (Postgres 16), `migrate` (Prisma deploy), `server` (Express), and `client` (Nginx reverse proxy) for local development parity.
  - Created `.env.example` documenting all configuration keys (R-02).
  - Initial `docs/labs/lab05/deployment.md` and `docs/labs/lab-05/deployment.md`.
* **Verification Check C-03 (Clean Clone Local Build & Run):**
  - Run `git clone`, `cp .env.example .env`, `docker compose up --build -d`.
  - Capture terminal log showing healthy services and `curl http://localhost:3000/api/health` returning 200 OK.

---

### Issue 4 (Episode 4): CI Pipeline on Pull Requests with Automated Testing & Docker Build Gate
* **GitHub Issue:** `Lab 5 Issue 4: CI Pipeline on Pull Requests with PostgreSQL Service Container & Docker Build Gate`
* **Author:** `@apfirst13` | **Reviewer:** `@Theerawat82` | **Label:** `lab5`
* **Branch:** `feature/lab5-ci-workflow` $\rightarrow$ PR to `lab5-staging`
* **Tasks:**
  1. Configure `.github/workflows/ci-docker.yml` running on pull requests targeting `lab5-staging` and `main`.
  2. Align Node version: Use **Node.js 24** (matching production Docker container runtime).
  3. PostgreSQL Service Container: Run a live `postgres:16-alpine` service container in GitHub Actions (matching production Cloud SQL) instead of SQLite, ensuring Prisma and Raw SQL atomic numbering tests execute realistically.
  4. CI Quality Gate steps:
     - Install dependencies (`npm ci`).
     - Run `npx prisma db push` / `prisma migrate deploy` on Postgres container.
     - Backend test suite (147 Vitest tests).
     - Frontend test suite (30 Vitest tests).
     - Multi-stage Docker build check (`docker build -t popqueue:ci .`).
* **Verification Check C-01 (Normal PR CI Gate):**
  - PR runs CI workflow, all tests pass green. Capture PR link and check summary.
  *(Note: Failing PR Demo C-02 is moved to Issue 6 where branch rulesets are active).*

---

### Issue 5 (Episode 5): First Manual Deployment to Cloud Run & Cloud SQL via Cloud Shell
* **GitHub Issue:** `Lab 5 Issue 5: First Manual Deployment to Cloud Run & Cloud SQL via Cloud Shell`
* **Author:** `@Theerawat82` | **Reviewer:** `@apfirst13` | **Label:** `lab5`
* **Branch:** `feature/lab5-cloud-deploy` $\rightarrow$ PR to `lab5-staging`
* **Tasks:**
  1. Cloud Shell execution of `deploy/deploy.sh`:
     - Provision Artifact Registry repository: `popqueue`.
     - Provision Cloud SQL instance: `popqueue-pg` (PostgreSQL 16, tier `db-f1-micro`, `--edition=enterprise`).
     - Create database `popqueue_db` and user `popqueue_user`.
  2. Secret Manager Configuration (R-02, R-12):
     - `popqueue-database-url`: Unix socket connection string `postgresql://popqueue_user:...@localhost/popqueue_db?host=/cloudsql/PROJECT:REGION:INSTANCE`.
     - `popqueue-jwt-secret`: High-entropy random secret.
     - `popqueue-seed-admin-pw`: Password for demo seed accounts.
  3. Cloud Run Migration & Seeding Job:
     - Run `popqueue-migrate` job running `npx prisma migrate deploy && npx prisma db seed`.
     - Seeds standard demo accounts (`collector1`, `staff1`, series catalog) so live login and business actions work on public URL for **C-04** and Lab 6 partner team testing.
  4. Deploy Cloud Run Service:
     - Deploy service `popqueue` (port 3000, 1 CPU, 512 MiB memory, min instances 0, max instances 2).
     - Connect to Cloud SQL via `--add-cloudsql-instances`.
     - Mount secrets via `--set-secrets`.
* **Evidence:** Live Cloud Run URL responding 200 OK to `/api/health`, `/api/ready`, and loading React SPA frontend.

---

### Issue 6 (Episode 6): Workload Identity Federation (WIF) & Branch Protection Rulesets
* **GitHub Issue:** `Lab 5 Issue 6: Workload Identity Federation & Branch Protection Rulesets on Staging and Main`
* **Collaboration:** **Pair Work** (`@apfirst13` & `@Theerawat82`) | **Label:** `lab5`
* **Branch:** `feature/lab5-wif-ruleset` $\rightarrow$ PR to `lab5-staging`
* **Tasks:**
  1. Workload Identity Federation (WIF) Setup (Keyless Auth):
     - Pool: `github-actions-pool`.
     - Provider: `github-actions-provider`.
     - Service Account: `github-deployer@popqueue-lab5.iam.gserviceaccount.com`.
     - Least Privilege IAM Bindings:
       - `github-deployer` receives `roles/run.admin` and `roles/artifactregistry.writer`.
       - `github-deployer` does **NOT** receive `secretmanager.secretAccessor` (secret access is restricted to the Cloud Run runtime service account `popqueue-sa`).
       - Attribute Condition: Restricted to repository `attribute.repository == "apfirst13/PopQueue_BFteam"`.
  2. GitHub Environment `demo`:
     - Store environment variables: `GCP_PROJECT_ID`, `GCP_REGION`, `WIF_PROVIDER`, `WIF_SERVICE_ACCOUNT`.
  3. GitHub Branch Rulesets (protecting **BOTH `main` and `lab5-staging`**):
     - Require Pull Request before merging (1 approval required).
     - Require review approval from teammate (author cannot approve own PR, R-09).
     - Require passing status check: `test-and-docker` (R-06).
     - Block direct push to `main` and `lab5-staging`.
  4. **Execute Verification Check C-02 (Failing PR Merge Block):**
     - Branch from staging: `temp/c02-failing-check`.
     - Add a deliberate failing test (e.g. `expect(1).toBe(2)`).
     - Push and open PR targeting `lab5-staging`.
     - Verify CI check fails and **GitHub blocks the merge button** with required status check violation.
     - Capture screenshot for Answer Part 1, then close the temporary PR.

---

### Issue 7 (Episode 7): Automated Continuous Delivery (CD) Pipeline & Smoke Testing
* **GitHub Issue:** `Lab 5 Issue 7: Automated CD Pipeline on Main Merge, Read-Only Smoke Test & Commit SHA Traceability`
* **Author:** `@apfirst13` | **Reviewer:** `@Theerawat82` | **Label:** `lab5`
* **Branch:** `feature/lab5-cd-pipeline` $\rightarrow$ PR to `lab5-staging`
* **Tasks:**
  1. Configure `.github/workflows/deploy.yml`:
     - Trigger: Push to `main` (resulting from merged release PR).
     - Step 1: Run CI quality gate tests first. If tests fail, halt deployment immediately.
     - Step 2: Authenticate to GCP using WIF.
     - Step 3: Build Docker image tagged with Git commit SHA (`popqueue:$GITHUB_SHA`) and push to Artifact Registry.
     - Step 4: Execute Cloud Run migration job `popqueue-migrate`.
     - Step 5: Deploy to Cloud Run with `--image ...:$GITHUB_SHA` and set label `--set-labels=commit-sha=$GITHUB_SHA`.
     - Step 6: Wait for deployment healthy.
     - Step 7: Execute automated smoke test `python deploy/smoke_test.py --url $SERVICE_URL`.
  2. Read-Only Automated Smoke Test (`deploy/smoke_test.py`):
     - Validates:
       - `GET /api/health` -> 200 OK (returns valid status and commit SHA).
       - `GET /api/ready` -> 200 OK (verifies Cloud SQL connectivity).
       - `GET /` -> 200 OK (verifies React SPA HTML loaded).
       - `GET /api/series` -> 200 OK (verifies seeded series catalog query).
     - *Design Note:* Automated CD smoke test remains strictly **read-only** to prevent creating dummy queue tickets on production on every deploy.
  3. Release a **Visible Change (Check C-06)**:
     - Add the commit SHA display badge to the Web UI footer and `/api/health`.
     - Release through PR `lab5-staging` $\rightarrow$ `main`.
     - Teammate `@Theerawat82` approves PR.
     - Merge triggers automated deployment.
     - Verify live site updates and displays the commit SHA matching the Git release commit.

---

### Issue 8 (Episode 8): Cloud SQL Persistence Verification & Live Domain Workflow
* **GitHub Issue:** `Lab 5 Issue 8: Data Persistence Verification across Restart & Redeploy, and Public Domain Workflow`
* **Author:** `@Theerawat82` | **Reviewer:** `@apfirst13` | **Label:** `lab5`
* **Branch:** `feature/lab5-persistence-verify` $\rightarrow$ PR to `lab5-staging`
* **Tasks:**
  1. **Execute Verification Check C-04 (Public Domain Workflow):**
     - Open live public URL in browser.
     - Demonstrate collector login, browse series, join queue to generate ticket (e.g. `PQ-001`).
     - Open staff counter, login as staff, call ticket, transition state to serving.
     - Demonstrate business rule rejection: attempt duplicate join with same collector account; verify 409 Conflict error.
     - Capture clear screenshots showing the **complete browser URL bar with GCP domain**.
  2. **Execute Verification Check C-05 (Data Persistence across Restart & Redeploy):**
     - Record ticket ID `PQ-001` in database.
     - **Test Restart:** Restart Cloud Run container / force scale to 0 (`gcloud run services update popqueue --min-instances=0 --max-instances=0` then reset to `--max-instances=2`).
     - Query live URL: Confirm ticket `PQ-001` still exists intact in Cloud SQL.
     - **Test Redeploy:** Deploy a new revision or trigger redeploy.
     - Query live URL: Confirm ticket `PQ-001` still exists intact.
     - Capture evidence screenshots before and after restart and redeploy.
  3. Document Rollback Procedure:
     - Document manual revision rollback command (`gcloud run services update-traffic popqueue --to-revisions=PREVIOUS_REVISION=100`) in `deployment.md` as recommended operational procedure.

---

### Issue 9 (Episode 9): Deployment Documentation, Cost Management & Deliverable PDF Report
* **GitHub Issue:** `Lab 5 Issue 9: Finalize Deployment Docs, Cost Management & Deliverable PDF Report`
* **Collaboration:** **Pair Work** (`@Theerawat82` & `@apfirst13`) | **Label:** `lab5`
* **Tasks:**
  1. Finalize Documentation:
     - Synchronize `docs/labs/lab05/deployment.md`, `docs/labs/lab-05/deployment.md`, and `docs/deployment.md`.
     - Document architecture diagram, environment variables table, deploy steps from scratch, and release procedure.
  2. **CRITICAL Cost Management Policy (DO NOT RUN TEARDOWN):**
     - **Rule:** As required by Handout Section 1 and 3, **the service must remain running until the instructor announces the end of grading**.
     - This exact GCP project and pipeline are reused for **Lab 6 (Cross-team UAT)**, Lab 7, and the Final Project.
     - **Action:** Test `deploy/teardown.sh` offline/stub only for script validation, but **DO NOT execute teardown on live production**.
     - **To save costs during idle periods:** Set Cloud SQL activation policy to `NEVER` when not in use:
       ```bash
       gcloud sql instances patch popqueue-pg --activation-policy=NEVER
       ```
       And resume before demonstration or grading:
       ```bash
       gcloud sql instances patch popqueue-pg --activation-policy=ALWAYS
       ```
  3. Compile Deliverable PDF (`lab5_sec1_BFteam.pdf`):
     - Strictly structured into **Answer Parts 0 to 4**:
       * **Answer Part 0: Team and Evidence Index:** Student names, KMUTT student IDs, GitHub usernames, contribution table, and evidence index mapping C-01..C-06 and R-01..R-12 to report pages.
       * **Answer Part 1: CI and Quality Gate (30 pts):** Evidence for R-05, R-06, C-01 (normal PR green run link & test summary), and C-02 (failing PR blocked merge screenshot).
       * **Answer Part 2: Docker and Reproducible Configuration (20 pts):** Evidence for R-01, R-02, and C-03 (clean clone local build & run terminal log).
       * **Answer Part 3: GCP Deployment and Persistence (35 pts):** Evidence for R-03, R-04, C-04 (domain workflow with browser URL bar visible), and C-05 (data persistence before/after restart and redeploy).
       * **Answer Part 4: Repeatable Release Pipeline (15 pts):** Evidence for R-07, R-08, and C-06 (reviewed change staging $\rightarrow$ main, live commit SHA display).

---

## 6. Master Execution Checklist & Progress Tracking

- [x] Create integration branch `lab5-staging` from `main`
- [x] Move and archive Sprint 1 documentation into `docs/sprints/sprint-1/`
- [x] Implement multi-stage `Dockerfile`, health checks, Express static serving (PR #26)
- [x] Verify repository is Public and has `lab5` label (R-10, R-12)
- [ ] User approval of Revised Master Plan (`LAB5_MASTER_PLAN.md`)
- [ ] **Issue 1:** `@apfirst13` sets up GCP project, $5 Budget Alert, and grants `@Theerawat82` IAM Editor role
- [ ] **Issues 2 & 3:** `@apfirst13` reviews PR #26 with substantive file-level comments; merge into `lab5-staging`
- [ ] **Issue 3:** Execute and capture **Check C-03** (Clean clone local build and run from `.env.example`)
- [ ] **Issue 4:** `@apfirst13` creates CI workflow PR with Node 24 and Postgres container; verify **Check C-01** (Green PR)
- [ ] **Issue 5:** `@Theerawat82` deploys Cloud SQL & Cloud Run with DB seeding; verify live URL opens
- [ ] **Issue 6:** Pair work sets up WIF and Branch Rulesets on `main` and `lab5-staging`
- [ ] **Issue 6:** Execute and capture **Check C-02** (Failing PR from temporary branch blocked from merging)
- [ ] **Issue 7:** `@apfirst13` creates CD workflow with read-only smoke test and visible commit SHA; release via PR to `main`
- [ ] **Issue 8:** Execute and capture **Check C-04** (Public domain workflow with browser URL bar visible)
- [ ] **Issue 8:** Execute and capture **Check C-05** (Data persistence across container restart and redeploy)
- [ ] **Issue 8:** Execute and capture **Check C-06** (Commit SHA traceability on live site matching release commit)
- [ ] **Issue 9:** Pair work synchronizes `deployment.md`, compiles `lab5_sec1_BFteam.pdf` (Parts 0–4), and submits to LEB2
- [ ] Keep service running for Lab 6 UAT; pause Cloud SQL during idle periods
