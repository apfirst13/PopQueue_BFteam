# PopQueue — Cloud Deployment and CI/CD Specification (Lab 5)

## 1. System Architecture & Tech Stack

PopQueue is containerized as a unified, production-ready full-stack application deployed on **Google Cloud Platform (GCP)** via **Cloud Run** and backed by **Cloud SQL (PostgreSQL 16)**.

| Component | Technology | Local Dev (Docker Compose) | Production (GCP Cloud Run) |
|---|---|---|---|
| **Frontend** | React 18, TypeScript, Vite, Tailwind CSS / Custom UI | Served via Nginx reverse proxy (`client:5173`) | Compiled static SPA bundled in `/app/client/dist`, served by Express (`:3000`) |
| **Backend** | Express 4, TypeScript, Node.js 24 Alpine | Express API container (`server:3000`) | Express API + SPA static host (`popqueue:3000`) |
| **Database** | PostgreSQL 16 | PostgreSQL Alpine container (`db:5432`) | Cloud SQL for PostgreSQL 16 (`popqueue-pg`, `db-f1-micro`, `--edition=enterprise`) |
| **ORM & Migrations** | Prisma 5.18 / 5.22 | Run via `migrate` container (`popqueue-migrate`) | Run via Cloud Run Job (`popqueue-migrate`) before service rollout |
| **Containerization** | Docker multi-stage | `docker-compose.yml` (`db`, `migrate`, `server`, `client`) | Unified multi-stage root `Dockerfile` (`client-builder`, `server-builder`, `production`) |
| **CI / Quality Gate** | GitHub Actions | Local Vitest (`server` + `client`) | `.github/workflows/ci-docker.yml` (Job: `test-and-docker`) |
| **Continuous Delivery** | GitHub Actions | N/A | `.github/workflows/deploy.yml` + Workload Identity Federation (WIF) |
| **Secrets Management** | Environment Variables | `server/.env` (uncommitted) / Docker compose | GCP Secret Manager (`popqueue-database-url`, `popqueue-jwt-secret`, etc.) |

---

## 2. Environment Variables & Secret Configuration (R-02, R-12)

All settings are read from the execution environment at runtime (or build-time `ARG` for non-secret Vite commit metadata). No plaintext secrets, API keys, or connection strings are baked into Docker images or committed to Git.

| Variable Name | Purpose | Is Secret? | Local Default (.env.example / Compose) | GCP Production Source |
|---|---|:---:|---|---|
| `NODE_ENV` | Application runtime environment (`development` / `production` / `test`) | No | `development` (`.env.example`) / `production` (Compose) | Cloud Run env var (`production`) |
| `PORT` | HTTP server listening port | No | `4000` (Local Node) / `3000` (Docker Compose) | Cloud Run env / `--port 3000` (`3000`) |
| `TZ` | System timezone | No | `Asia/Bangkok` | Cloud Run env var (`Asia/Bangkok`) |
| `DATABASE_URL` | PostgreSQL connection string | **Yes** | `postgresql://popqueue:popqueue_dev_password@localhost:5432/popqueue` | GCP Secret Manager: `popqueue-database-url` (Cloud SQL Unix socket) |
| `DATABASE_URL_TEST` | Isolated test DB URL for local/CI backend integration tests | No (Local/CI) | `postgresql://popqueue:popqueue_dev_password@localhost:5432/popqueue_test?connection_limit=20` | N/A (CI `postgres:16-alpine` service & local test only) |
| `JWT_SECRET` | Secret key for signing authentication tokens (min. 32 characters) | **Yes** | `your-super-secret-jwt-key-at-least-32-chars-long` (`.env.example`) / `popqueue-super-secret-...` (Compose fallback) | GCP Secret Manager: `popqueue-jwt-secret` (64-character generated hex) |
| `JWT_EXPIRES_IN` | JWT access token lifespan | No | `8h` | Defaulted in `server/src/config/env.ts` (`8h`) |
| `BCRYPT_COST` | Salt rounds for bcrypt password hashing | No | `10` | Defaulted in `server/src/config/env.ts` (`10`) |
| `CORS_ORIGIN` | Allowed cross-origin header for Express CORS middleware | No | `http://localhost:3000` | Application default (`http://localhost:3000`); SPA same-origin in production |
| `CLIENT_DIST_DIR` | Override path to built React SPA static files served by Express | No | Unset (auto-resolves `/app/client/dist` in container) | Container default (`/app/client/dist` in root `Dockerfile`) |
| `GIT_SHA` | Full 40-char Git commit SHA exposed by `GET /api/health` | No | `development` (build `ARG` fallback) | Docker `--build-arg GIT_SHA=$IMAGE_TAG` -> `ENV GIT_SHA` in CD |
| `VITE_GIT_SHA` | Commit SHA injected into React Vite bundle for footer badge | No | `development` (Stage 1 `ARG` fallback) | Stage 1 `Dockerfile` sets `ENV VITE_GIT_SHA=$GIT_SHA` at build time |
| `VITE_API_URL` | Client base API URL (`client/.env.example`) | No | `http://localhost:4000` (Vite dev) / `""` (Compose Nginx) | `""` (same-origin `/api/*` served directly by Express) |
| `POSTGRES_USER` | PostgreSQL container username for `docker-compose.yml` | No (Local) | `popqueue` | Cloud SQL user `popqueue` |
| `POSTGRES_PASSWORD` | PostgreSQL container password for `docker-compose.yml` | No (Local) | `popqueue_dev_password` | Generated during `deploy/deploy.sh` into `popqueue-database-url` |
| `POSTGRES_DB` | PostgreSQL container database name for `docker-compose.yml` | No (Local) | `popqueue` | Cloud SQL database `popqueue` |
| `SEED_COLLECTOR_PASSWORD` | Synthetic password for seeded Collector accounts (`seed.ts`) | Semi-secret (Demo) | `collector_dev_password123` | Idempotent seed default in `popqueue-migrate` / `seed.ts` |
| `SEED_STAFF_PASSWORD` | Synthetic password for seeded Box Master staff accounts (`seed.ts`) | Semi-secret (Demo) | `staff_dev_password123` | Idempotent seed default in `popqueue-migrate` / `seed.ts` |
| `ADMIN_PASSWORD` / `DEMO_USER_PASSWORD` | Starter-kit seed secrets managed by `deploy.sh` & `teardown.sh` | **Yes** | Not used by local Compose | GCP Secret Manager: `popqueue-admin-password`, `popqueue-demo-password` *(provisioned by `deploy.sh` for starter-kit compatibility; PopQueue `seed.ts` reads `SEED_*_PASSWORD`)* |

---

## 3. Local Execution & Docker Commands (R-01)

### Option A: Local Docker Compose (Full Stack)
Build and run all 4 containers (`db`, `migrate`, `server`, `client`) from scratch:
```bash
# 1. Start containers in background
docker compose up --build -d

# 2. Check running services
docker compose ps

# 3. Verify health and readiness
curl -s http://localhost:3000/api/health
curl -s http://localhost:3000/api/ready

# 4. Open UI in browser
# Client SPA: http://localhost:5173
```

### Option B: Local Node.js Development
```bash
# 1. Database
docker compose up -d db

# 2. Server
cd server
npm ci
npx prisma migrate deploy
npm run db:seed
npm run dev

# 3. Client (in separate terminal)
cd client
npm ci
npm run dev
```

### Option C: Automated Test Suite (CI & Offline Verification)
```bash
# Backend vitest (23 files, 148 tests — requires PostgreSQL running at DATABASE_URL_TEST)
cd server
npm test

# Frontend vitest (6 files, 31 tests)
cd client
npm test

# Deployment offline script & smoke unit tests (no GCP access required)
bash -n deploy/deploy.sh deploy/teardown.sh deploy/release.sh
bash deploy/tests/test_deploy_stub.sh
bash deploy/tests/test_release_stub.sh
python3 -m unittest discover -s deploy/tests -p 'test_smoke.py' -v
```

---

## 4. GCP Architecture & Resource Naming (R-03, R-07)

| Resource | Target GCP Name | Configuration Details |
|---|---|---|
| **GCP Project** | `cpe334-bfteam` (Project No. `902539659249`) | Free Trial ($300 credit); **Alerts-only Budget: ฿250 THB (~$7 USD)** triggered on Actual spend at 10% (`฿25`), 20% (`฿50`), 50% (`฿125`), and 90% (`฿225`) |
| **Region** | `asia-southeast1` (Singapore) | Proximity to Bangkok users |
| **Artifact Registry** | `popqueue` | Docker format, `asia-southeast1-docker.pkg.dev/cpe334-bfteam/popqueue/popqueue` |
| **Cloud SQL Instance** | `popqueue-pg` | PostgreSQL 16, tier `db-f1-micro`, `--edition=enterprise`, 10GB SSD |
| **Database Name / User** | `popqueue` / `popqueue` | Dedicated application database and user |
| **Runtime Service Account** | `popqueue-runner` | `popqueue-runner@cpe334-bfteam.iam.gserviceaccount.com`, roles: `roles/cloudsql.client`, specific secret accessor on app secrets |
| **Deployer Service Account** | `popqueue-deployer` | Keyless Workload Identity Federation (WIF) for GitHub Actions |
| **Cloud Run Migration Job** | `popqueue-migrate` | Executed prior to service rollout: `npx prisma migrate deploy && npm run prisma:seed` |
| **Cloud Run Service** | `popqueue` | Min 0, Max 3 instances, 512MiB memory, 1 vCPU, port 3000, public HTTPS (`https://popqueue-5now4hkvsa-as.a.run.app`) |

---

## 5. Release Procedure & Repeatable Deployment (R-07, R-08)

### Release Flow: Feature -> Staging -> Main -> Cloud Run
1. **Feature Development:**
   - Create branch `feature/<feature-name>` from `lab5-staging`.
   - Implement changes and verify test suite passes locally (`npm test`).
   - Push to GitHub and open Pull Request targeting `lab5-staging`.
   - CI workflow `ci-docker.yml` runs automatically (`test-and-docker`).
   - Teammate performs code review and approves PR.
   - Merge into `lab5-staging`.

2. **Release Candidate PR:**
   - Open Pull Request from `lab5-staging` into `main`.
   - CI runs `test-and-docker` as a **Required Quality Gate** (R-06). Merging is blocked if tests fail.
   - Peer review approved.
   - Merge PR into `main`.

3. **Continuous Deployment (`deploy.yml`):**
   - Push to `main` triggers `Deploy demo`.
   - Runs `test-and-docker` quality gate.
   - Authenticates to GCP via **Workload Identity Federation (WIF)** without static JSON keys.
   - Builds container image and pushes to Artifact Registry tagged with 40-character commit SHA (`IMAGE_TAG`).
   - Resolves image to immutable `@sha256:...` digest.
   - Runs `popqueue-migrate` Cloud Run job to apply schema updates and idempotent seed data.
   - Deploys new revision to `popqueue` Cloud Run service and shifts 100% traffic to it.
   - Executes `deploy/smoke_test.py` against live URL (`/api/health`, `/api/ready`, `/`, `/api/series`, optional login).

### How to Verify Running Commit on Live Service
- **Live Health API (`GET /api/health`):** Returns HTTP `200` JSON `{"status":"ok","commit":"<40-char-git-sha>"}`.
- **Live Web UI Footer (`PopQueue v0.2.0-lab5`):** Renders `<code data-testid="git-sha-badge">` showing the 7-character short SHA (hover tooltip displays full 40-char SHA).
- **GitHub Actions Summary:** The release job records the exact commit SHA, digest, and URL in `$GITHUB_STEP_SUMMARY`.
- **GCP Console / Cloud Run Label:** Under Cloud Run > `popqueue` > Revisions, the active revision uses immutable `@sha256:<digest>` matching the Artifact Registry tag and carries label `commit-sha=<40-char-sha>`.
- **Git Tags:** Accepted releases are annotated tags with semantic versioning (e.g. `v0.1.0-sprint1`, `v0.2.0-lab5`).

---

## 6. Demonstration Verification Checks & Evidence Log

### Episode 1: GCP Project Setup, Budget Alert, IAM Team Access & Secret Scanning (Lab 5 Issue 1 / GitHub Issue #24)
- **Course Requirement:** R-02, R-10, R-11, R-12
- **Branch & PR:** `feature/lab5-docker-setup` -> `lab5-staging` ([PR #33](https://github.com/apfirst13/PopQueue_BFteam/pull/33), merged `736cefe`; Lead `@Theerawat82`, Reviewer `@apfirst13`)
- **Configuration Verified:**
  - Billing linked & active on project `cpe334-bfteam` (`gcloud billing projects describe cpe334-bfteam --format='value(billingEnabled)'` -> `True`).
  - Billing Budget Alert (`Alerts-only`, no billing disablement) set to **฿250 THB (~$7 USD)** with Actual spend notifications at **10% (`฿25`)**, **20% (`฿50`)**, **50% (`฿125`)**, and **90% (`฿225`)**.
  - Required 8 GCP APIs enabled (Run, Cloud SQL Admin, Artifact Registry, Secret Manager, Cloud Build, IAM, IAM Credentials, STS).
  - Teammate (`@apfirst13`) granted project IAM Editor role via masked personal Gmail; GitHub Secret Protection & Push Protection enabled (**On**).
- **Archived Screenshots:**
  - `docs/labs/lab05/evidence/ep01-billing-enabled-true.png`
  - `docs/labs/lab05/evidence/ep01-budget-alert.png`
  - `docs/labs/lab05/evidence/ep01-iam-editor.png`
  - `docs/labs/lab05/evidence/ep01-push-protection.png`

### Check C-03: Clean Clone Local Docker Build & Run Verification (Lab 5 Issues 2 & 3 / GitHub Issue #25)
- **Course Requirement:** R-01, R-02, Spec 8 (`C-03`), Answer Part 2 (20 Points)
- **Branch & PR:** `feature/lab5-docker-setup` -> `lab5-staging` ([PR #26](https://github.com/apfirst13/PopQueue_BFteam/pull/26), merged `61e77b4`; Author `@Theerawat82`, Reviewer `@apfirst13`); Windows CRLF hardening verified in Issue 9 (`feature/lab5-i09-docs-evidence`).
- **Reproducible Procedure (Fresh Clone + `.env.example` Only):**
  1. `git clone --branch lab5-staging --depth 1 https://github.com/apfirst13/PopQueue_BFteam.git`
  2. `cp .env.example .env` (safe development defaults only; zero secrets committed)
  3. `docker compose up --build -d` (starts `popqueue-db`, runs `popqueue-migrate` applying Prisma migrations & seeding 9 users + 3 series, then launches `popqueue-server` on `:3000` and `popqueue-client` Nginx SPA on `:5173`)
  4. Verify `docker compose ps -a`, `docker compose logs migrate`, `GET http://localhost:3000/api/health` (`200 OK {"status":"ok","commit":"dev"}`), `GET http://localhost:3000/api/ready` (`200 OK {"db":"connected"}`), `GET http://localhost:3000/api/series`, and `HEAD http://localhost:5173` (`200 OK`).
  5. Cleanup: `docker compose down -v`.
- **Archived Evidence Log:**
  - `docs/labs/lab05/evidence/c03-clean-clone-log.txt` (Executed clean clone verification on `2026-11-13`)

### Check C-01: Normal PR CI Gate (Lab 5 Issue 4 / GitHub Issue #27)
- **Course Requirement:** R-05, R-09, R-10, Spec 11 (Part 1: CI and Quality Gate, 30 Points)
- **Workflow:** `.github/workflows/ci-docker.yml` (Job: `test-and-docker`)
- **Criteria:** All offline deploy tests, backend tests against real `postgres:16-alpine` service container (`prisma migrate deploy && prisma:seed`), frontend tests + production Vite build, and root multi-stage `Dockerfile` build (`docker build -t popqueue:latest .`) pass with exit code `0`.
- **Verified Runs:**
  - **Initial CI PR (#34):** Branch `feature/lab5-i04-ci` -> `lab5-staging` ([PR #34](https://github.com/apfirst13/PopQueue_BFteam/pull/34), merged `27a8fec`; Author `@apfirst13`, Reviewer `@Theerawat82`) — [Run #43050323811](https://github.com/apfirst13/PopQueue_BFteam/actions/runs/43050323811) (`success`, 147 backend tests + 30 frontend tests + stub tests + Docker build).
  - **CD + SHA Traceability PR (#38):** Branch `feature/lab5-i07-cd-pipeline` -> `lab5-staging` ([PR #38](https://github.com/apfirst13/PopQueue_BFteam/pull/38), merged `8fa4139`) — [Run #43368438027](https://github.com/apfirst13/PopQueue_BFteam/actions/runs/43368438027) on commit `b8922ae` (`success`: 23 backend files / 148 tests, 6 frontend files / 31 tests, 4 `test_smoke.py` tests, 6 `test_deploy_stub.sh` assertions, 5 `test_release_stub.sh` assertions, and production Docker build).
  - **Issue 8 Verification PR (#40):** [Run #43389963671](https://github.com/apfirst13/PopQueue_BFteam/actions/runs/43389963671) on commit `7cc44d5` (`success`).

### Episode 5: First Manual Deployment to Cloud Run & Cloud SQL (Lab 5 Issue 5 / GitHub Issue #28)
- **Course Requirement:** R-01, R-02, R-03, R-04, R-11, R-12
- **Branch:** `feature/lab5-i05-cloud-deploy` targeting `lab5-staging` (PR #35)
- **Execution Method:** Idempotent `./deploy/deploy.sh --demo` executed via Google Cloud Shell on project `cpe334-bfteam` (`asia-southeast1`).
- **Evidence Record:**
  - **Cloud Run Service (`popqueue`):** Revision `popqueue-00001-jwk` serving 100% traffic
  - **Public Service URLs:**
    - Primary URL: `https://popqueue-5now4hkvsa-as.a.run.app`
    - Regional URL: `https://popqueue-902539659249.asia-southeast1.run.app`
    - Health Endpoint: `https://popqueue-5now4hkvsa-as.a.run.app/api/health`
    - Readiness Endpoint: `https://popqueue-5now4hkvsa-as.a.run.app/api/ready`
  - **Cloud Run Migration Job (`popqueue-migrate`):**
    - Execution 1 (Initial Migrate + Seed): `popqueue-migrate-998zv` (Completed, 1/1 succeeded)
    - Execution 2 (Idempotency Verification): `popqueue-migrate-qwzsf` (Completed in 6.69s, 1/1 succeeded, zero duplicate records)
  - **Archived Screenshots:**
    - `docs/labs/lab05/evidence/ep05-cloudshell-clone.png`
    - `docs/labs/lab05/evidence/ep05-deploy-completed.png`
    - `docs/labs/lab05/evidence/ep05-migrate-idempotency.png`

---

### Episode 6: Workload Identity Federation, Branch Protection Rulesets & Check C-02 (Lab 5 Issue 6 / GitHub Issue #29)
- **Course Requirement:** R-05, R-06, R-09, R-10, R-11
- **Branch:** `feature/lab5-i06-wif-ruleset` targeting `lab5-staging`
- **Authors & Reviewers:** Configured in pair collaboration (@Theerawat82 as GCP Project Owner for WIF creation; @apfirst13 configuring GitHub Environment, Rulesets, and Check C-02)

#### 1. Workload Identity Federation (WIF) Architecture (R-10, R-11)
To eliminate long-lived, high-risk static JSON service account keys in GitHub repository secrets, PopQueue uses keyless **Google Cloud Workload Identity Federation (OIDC)**:
- **Workload Identity Pool:** `github-actions` (`projects/902539659249/locations/global/workloadIdentityPools/github-actions`)
- **OIDC Provider:** `github-main` (`https://token.actions.githubusercontent.com`)
- **Attribute Mapping:**
  - `google.subject` = `assertion.sub`
  - `attribute.repository_id` = `assertion.repository_id`
- **CEL Security Attribute Condition:**
  Strictly restricts token issuance to only the immutable GitHub repository ID, owner ID, `main` branch, `deploy.yml` workflow, and `demo` environment:
  ```cel
  assertion.repository_id == '1441119685' &&
  assertion.repository_owner_id == '137395434' &&
  assertion.ref == 'refs/heads/main' &&
  assertion.workflow_ref == 'apfirst13/PopQueue_BFteam/.github/workflows/deploy.yml@refs/heads/main' &&
  assertion.sub == 'repo:apfirst13@137395434/PopQueue_BFteam@1441119685:environment:demo'
  ```
- **Deployer Service Account:** `popqueue-deployer@cpe334-bfteam.iam.gserviceaccount.com`
- **Least-Privilege IAM Bindings:**
  - `roles/run.developer` on project `cpe334-bfteam`
  - `roles/artifactregistry.writer` on repository `popqueue`
  - `roles/iam.serviceAccountUser` on runtime service account `popqueue-runner`
  - `roles/iam.workloadIdentityUser` bound to principal set `principalSet://iam.googleapis.com/projects/902539659249/locations/global/workloadIdentityPools/github-actions/attribute.repository_id/1441119685`
- **Keyless Audit:** Verification via `gcloud iam service-accounts keys list --iam-account=popqueue-deployer@... --managed-by=user` confirms **`Listed 0 items.`** (100% keyless).
- **Archived Screenshots:**
  - `docs/labs/lab05/evidence/ep06-wif-setup-commands.png`
  - `docs/labs/lab05/evidence/ep06-wif-setup-key-audit.png`

#### 2. GitHub Environment `demo` (R-10, R-11)
- **Environment Name:** `demo`
- **Deployment Branch Policy:** Selected branches only -> `main`
- **Environment Secrets:** None (Zero static keys or secrets stored in GitHub)
- **Environment Variables:**
  - `GCP_PROJECT_ID`: `cpe334-bfteam`
  - `GCP_REGION`: `asia-southeast1`
  - `WIF_PROVIDER`: `projects/902539659249/locations/global/workloadIdentityPools/github-actions/providers/github-main`
  - `WIF_SERVICE_ACCOUNT`: `popqueue-deployer@cpe334-bfteam.iam.gserviceaccount.com`
- **Archived Screenshot:**
  - `docs/labs/lab05/evidence/ep06-github-env-demo.png`

#### 3. Branch Protection Rulesets (R-05, Check C-02)
Configured under GitHub Repository **Settings > Rules > Rulesets**:
- **Ruleset 1: `protect-staging`**
  - **Enforcement Status:** Active
  - **Target Branch:** `lab5-staging`
  - **Rules Enforced:**
    - Restrict deletions
    - Require pull request before merging (1 approving review required; author cannot approve own PR)
    - Require status checks to pass before merging:
      - Required status check: `test-and-docker` (from GitHub Actions `ci-docker.yml`)
      - Require branches to be up to date before merging
    - Empty bypass list (rules apply strictly to all collaborators and administrators)
- **Ruleset 2: `protect-main`**
  - **Enforcement Status:** Active
  - **Target Branch:** `main`
  - **Rules Enforced:**
    - Restrict deletions
    - Require pull request before merging (1 approving review required)
    - Require status checks to pass before merging:
      - Required status check: `test-and-docker`
      - Require branches to be up to date before merging
    - Empty bypass list
- **Archived Screenshots:**
  - `docs/labs/lab05/evidence/ep06-ruleset-staging.png`
  - `docs/labs/lab05/evidence/ep06-ruleset-main.png`

#### 4. Verification Check C-02: Failing PR Merge Block Demonstration (R-06, Check C-02)
- **Requirement:** Course Rubric Part 1 (CI and Quality Gate, 30 Points) & Handout Spec 5.3, 10
- **Temporary Branch:** `temp/c02-failing-check` (branched from `lab5-staging`)
- **Pull Request:** [PR #36: `test(c-02): demonstrate failing PR merge block via required status check`](https://github.com/apfirst13/PopQueue_BFteam/pull/36)
- **Deliberate Failure Injected:** Added `expect(1).toBe(2);` in `client/src/App.test.tsx` (Commit: `597c95c`)
- **CI Test Failure Observation:**
  - Workflow: `.github/workflows/ci-docker.yml` ([Run #43254466119](https://github.com/apfirst13/PopQueue_BFteam/actions/runs/43254466119), sequence `#14`)
  - Result: Failed in 50 seconds on Vitest test runner:
    ```
    FAIL src/App.test.tsx > App Component > renders the PopQueue header brand and initial login route
    AssertionError: expected 1 to be 2 // Object.is equality
    - Expected: 2
    + Received: 1
    ```
- **Ruleset Enforcement Verification:**
  - Status Check: `test-and-docker` reported `failure`
  - GitHub Ruleset evaluated PR state: `mergeStateStatus: BLOCKED`
  - UI State: GitHub displayed **"Required checks failing: Fix the failing required checks."** and the green **"Merge pull request" button was completely disabled/grayed out**, preventing any merge into `lab5-staging`.
- **Safe Closing & Permanent Audit Trail:**
  - PR #36 was safely closed with state `Closed` (red badge, unmerged, with `lab5` label attached).
  - Per Course Rubric, the PR is **NOT deleted**, ensuring the instructor can inspect the live GitHub link, workflow run log, and ruleset enforcement directly.
- **Archived Screenshots:**
  - `docs/labs/lab05/evidence/ep06-c02-deliberate-failure.png`
  - `docs/labs/lab05/evidence/ep06-c02-action-failed.png`
  - `docs/labs/lab05/evidence/ep06-c02-merge-blocked.png`
  - `docs/labs/lab05/evidence/ep06-c02-pr-closed.png`

---

### Episode 7: Automated Continuous Delivery (CD) Pipeline, Smoke Testing & Commit SHA Traceability (Lab 5 Issue 7 / GitHub Issue #30)
- **Course Requirement:** R-07, R-08, R-09, R-10, R-11, Check C-06
- **Branch & PRs:**
  - Feature PR [#38](https://github.com/apfirst13/PopQueue_BFteam/pull/38): `feature/lab5-i07-cd-pipeline` -> `lab5-staging` (Author: `@Theerawat82`; Reviewer: `@apfirst13` — `CHANGES_REQUESTED` resolved in Commit `b8922ae` -> `APPROVED`; merged `8fa4139`).
  - Release PR [#39](https://github.com/apfirst13/PopQueue_BFteam/pull/39): `lab5-staging` -> `main` (Author: `@apfirst13`; Reviewer: `@Theerawat82` — `APPROVED`; merged `e010e192299067368c0f7101d6d7e7aeff442876`).
- **CD Pipeline Mechanism (`.github/workflows/deploy.yml` & `deploy/release.sh`):**
  - Triggers automatically on `push` to `main` ([Run #43370798180](https://github.com/apfirst13/PopQueue_BFteam/actions/runs/43370798180), `success`) and on-demand/rollback via `workflow_dispatch` ([Run #43373875178](https://github.com/apfirst13/PopQueue_BFteam/actions/runs/43373875178), `success`) pinned to GitHub Environment `demo`.
  - Requires reusable CI quality gate `test-and-docker` (`needs: test`) before deployment begins.
  - Authenticates to GCP keylessly via Workload Identity Federation (WIF).
  - Builds container image with `--build-arg GIT_SHA="$IMAGE_TAG"` and pushes to Artifact Registry (`popqueue/popqueue:$IMAGE_TAG`).
  - Resolves pushed tag to immutable `@sha256:...` digest, executes Cloud Run Job `popqueue-migrate` with `--wait`, then deploys Cloud Run service `popqueue` with `--update-labels="commit-sha=${IMAGE_TAG}"` and 100% traffic shift.
  - Runs read-only smoke test (`deploy/smoke_test.py`) validating `/api/health` (`status == "ok"` and non-empty `commit`), `/api/ready` (`db == "connected"`), `/`, and `/api/series` without mutating Cloud SQL.
- **Commit SHA Traceability (Check C-06, R-08):**
  - **API Endpoint:** `GET /api/health` returns `{"status":"ok","commit":"e010e192299067368c0f7101d6d7e7aeff442876"}`.
  - **Web UI Footer:** Displays `PopQueue v0.2.0-lab5` and `<code data-testid="git-sha-badge">` (`e010e19`, hover tooltip shows full 40-char SHA).

---

### Episode 8: Live Domain Workflow, Cloud SQL Persistence Verification & Rollback Procedure (Lab 5 Issue 8 / GitHub Issue #31)
- **Course Requirement:** R-03, R-04, R-07, R-08, R-09, R-11, C-04, C-05, C-06
- **Branch & PR:** `feature/lab5-i08-persistence-verify` -> `lab5-staging` ([PR #40](https://github.com/apfirst13/PopQueue_BFteam/pull/40), merged `112dee2`; Run [#43389963671](https://github.com/apfirst13/PopQueue_BFteam/actions/runs/43389963671))
- **Authors & Reviewers:** Pair collaboration. Work was shared between `@Theerawat82` and `@apfirst13` and roles were swapped during execution; PR #40 was opened by `@apfirst13` and reviewed (`CHANGES_REQUESTED` x2 -> `APPROVED` on Commit `7cc44d5`) by `@Theerawat82`.
- **Verification Check C-04: Public Domain Workflow Demonstration:**
  - Demonstrated live on public Cloud Run domain (`https://popqueue-5now4hkvsa-as.a.run.app`).
  - **Step 0 & 1 (Collector Join):** Authenticated as `collector1` (password masked in browser) and joined `CRY` series, generating live queue ticket **`CRY-001`** in `WAITING` state (`popqueue-5now4hkvsa-as.a.run.app/my-ticket`).
  - **Step 2 (Staff Counter Call):** Authenticated as `staff_crybaby` at Counter (`/staff/counter`) and called next ticket, transitioning `CRY-001` to `CALLED`.
  - **Step 3 (Duplicate Rejection):** Attempted duplicate active queue join on `/series`; verified business rule rejection returning HTTP 409 Conflict (`[DUPLICATE_ACTIVE_QUEUE] User already has an active queue ticket`).
  - **Archived Evidence:**
    - `docs/labs/lab05/evidence/c04-step0-login-masked.png`
    - `docs/labs/lab05/evidence/c04-step1-collector-join.png`
    - `docs/labs/lab05/evidence/c04-step2-staff-call.png`
    - `docs/labs/lab05/evidence/c04-step3-duplicate-rejection.png`
- **Verification Check C-05: Cloud SQL Data Persistence Verification:**
  - Verified persistence of live ticket **`CRY-001`** across three operational events proving durable Cloud SQL SSD storage:
    1. **Scale-Down to 0 (Cold Start):** Verified ticket remains intact after Cloud Run scales to zero and serves fresh incoming request (`01:55` countdown).
    2. **Cloud SQL Database Restart:** Restarted instance `popqueue-pg` via the Google Cloud Console (Cloud SQL → Overview → Restart; completion toast `"Restarted popqueue-pg 12:40:44 PM GMT+7"`). Verified the instance returned to `RUNNABLE` and ticket `CRY-001` remained intact in `CALLED` state.
    3. **Service Redeployment:** Triggered automated redeployment via GitHub Actions CD (`gh workflow run deploy.yml --ref main`, [Run #43373875178](https://github.com/apfirst13/PopQueue_BFteam/actions/runs/43373875178), `05:43:29Z`–`05:46:56Z` UTC / `12:43`–`12:46` GMT+7) and verified `/api/ready` (`{"db":"connected"}`) and `CRY-001` intact in `CALLED` state.
  - **Capture & Timer Clarification (from PR #40 Peer Review):** The UI screenshots (`c04-step0`..`c04-step3`, `c05-test1`, `c05-test2-db-restart-persistence`, `c05-test3-redeploy-persistence`, and `c06-live-commit-sha-badge`) were re-captured cleanly with cropped Windows taskbars and the full browser address bar (`popqueue-5now4hkvsa-as.a.run.app`) visible after the Cloud SQL restart and redeploy events; ticket `CRY-001` remained persistently stored in Cloud SQL throughout. The client-side circular countdown (`CountdownTimer.tsx`) initializes from `initialSeconds={120}` (`02:00`) upon page mount/refresh.
  - **Archived Evidence:**
    - `docs/labs/lab05/evidence/c05-test1-scale-down-persistence.png`
    - `docs/labs/lab05/evidence/c05-test2-gcp-db-restart.png`
    - `docs/labs/lab05/evidence/c05-test2-db-restart-persistence.png`
    - `docs/labs/lab05/evidence/c05-test3-redeploy-cli.png`
    - `docs/labs/lab05/evidence/c05-test3-redeploy-persistence.png`
- **Verification Check C-06: Live Commit SHA Traceability Verification:**
  - Verified live running Cloud Run service displays commit SHA matching Git release commit on `main` (`e010e19` / final `v0.2.0-lab5` release):
    - `GET /api/health` returns `{"status":"ok","commit":"e010e192299067368c0f7101d6d7e7aeff442876"}`.
    - Web UI footer renders badge: `PopQueue v0.2.0-lab5 • Commit: e010e19`.
  - **Archived Evidence:** `docs/labs/lab05/evidence/c06-live-commit-sha-badge.png`
- **Operational Procedure: Cloud Run Revision Rollback (`workflow_dispatch` & CLI):**
  - **Via GitHub Actions (`deploy.yml`):** Run workflow on `main` specifying optional `image_tag=<40-char-sha>` (calls `deploy/release.sh --rollback`, reusing existing Artifact Registry image without rebuilding or re-running migrations).
  - **Via `gcloud` instant traffic shift (< 5s, zero rebuild):**
    ```bash
    # 1. List revisions and current traffic allocation
    gcloud run revisions list --service=popqueue --region=asia-southeast1 --project=cpe334-bfteam

    # 2. Shift 100% traffic immediately to the previous healthy revision
    gcloud run services update-traffic popqueue \
      --region=asia-southeast1 \
      --project=cpe334-bfteam \
      --to-revisions=PREVIOUS_REVISION_NAME=100
    ```
  - **Advantage:** Rollback takes under 5 seconds with zero downtime because the previous container image and revision configuration are already cached and provisioned in Cloud Run.

---

### Episode 9 & 10: Release Tagging (`v0.2.0-lab5`), Cost Management & Safe Teardown Policy (Lab 5 Issue 9 / GitHub Issue #32)
- **Course Requirement:** R-08, Handout Sections 1, 3, 11, 12 & Student Guide Episodes 9–10
- **Annotated Release Tagging Procedure:**
  After the final `lab5-staging -> main` release PR merges and `Deploy demo` finishes green, tag the exact accepted commit on `main` and publish the GitHub release:
  ```bash
  git checkout main && git pull origin main
  git tag -a v0.2.0-lab5 -m "Lab 5 Accepted Release: Cloud Deployment and CI/CD Pipeline on GCP"
  git push origin v0.2.0-lab5
  ```
- **Live Service Retention Rule (CRITICAL — DO NOT RUN LIVE TEARDOWN):**
  - Per Lab 5 Handout Sections 1 & 3, the Cloud Run service and Cloud SQL database **MUST remain live until the instructor announces that Lab 5 grading is complete**.
  - The same GCP project (`cpe334-bfteam`) and CI/CD pipeline continue directly into **Lab 6 (Cross-Team UAT)**, Lab 7, and the Final Project.
  - **`deploy/teardown.sh` Validation (Offline Dry-Run Only):**
    Validated via `DRY_RUN=1 bash deploy/teardown.sh` (exits `0`, prints planned `[DRY_RUN] gcloud ... delete` commands for `popqueue`, `popqueue-migrate`, `popqueue-pg`, Artifact Registry `popqueue`, 4 Secret Manager secrets, and `popqueue-runner` without mutating GCP) and covered by `deploy/tests/test_deploy_stub.sh`. **Never run without `DRY_RUN=1` during active course grading/labs.**
- **Episode 9 Cost Management (Pause / Resume Policy Between Labs):**
  - **Cloud Run (`popqueue`):** Configured `--min-instances=0 --max-instances=3 --memory=512Mi --cpu=1`; zero request traffic incurs $0 compute cost automatically.
  - **Cloud SQL (`popqueue-pg`):** Incurs fixed compute (~$10.7/mo `db-f1-micro`) and 10 GB SSD (~$2.4/mo) covered by the $300 Free Trial credit. During extended idle breaks *after grading finishes*, cost can be paused/resumed using Student Guide Episode 9 commands (keeping `ALWAYS` whenever grading or Lab 6 UAT is active):
    ```bash
    # Pause only during extended idle periods (after grading announcement):
    gcloud run services remove-iam-policy-binding popqueue --region=asia-southeast1 --project=cpe334-bfteam \
      --member="allUsers" --role="roles/run.invoker"
    gcloud sql instances patch popqueue-pg --project=cpe334-bfteam --activation-policy=NEVER

    # Resume before grading / deployment / Lab 6 UAT:
    gcloud sql instances patch popqueue-pg --project=cpe334-bfteam --activation-policy=ALWAYS
    gcloud run services add-iam-policy-binding popqueue --region=asia-southeast1 --project=cpe334-bfteam \
      --member="allUsers" --role="roles/run.invoker"
    ```

---

## 7. Team Architectural Choices, Deviations & Decision Evidence (Handout §4.3, §5, R-09)

Per Instructor Handout §4.3 & §5 and Student Guide p. 3 (*"If your team chooses differently, write the choice and the reason in `deployment.md`"*), every adaptation where **BFteam** diverged from the generic TokTickIT reference starter kit — together with our peer-review decision trail (`R-09`) — is recorded below:

### 7.1 Technical & Architectural Choices vs. Starter Kit / Student Guide

| # | Area & Reference Baseline | BFteam Choice Implemented | Engineering Reason & Evidence |
|---|---|---|---|
| **D-01** | **Container Topology & Static Hosting** (Separate Nginx/backend vs. unified image; Student Guide Ep. 2) | **4-container `docker-compose.yml`** (`db`, `migrate`, `server`, `client` Nginx proxy on `:5173`) for local parity **+** **Unified 3-stage root `Dockerfile`** (`client-builder`, `server-builder`, `production` on `:3000`, `USER node`) for CI & Cloud Run. | Express serves `/app/client/dist` same-origin in production on one Cloud Run URL (`popqueue`), avoiding CORS preflight overhead and halving Cloud Run services/cold starts, while preserving Nginx SPA dev parity locally (`PR #26`). *(Differs from earlier Master Plan note stating Compose builds `server` from root Dockerfile; documented accurately here.)* |
| **D-02** | **Port Standard** (Starter kit port variations) | Local Node `.env.example` keeps `PORT=4000`, while Docker & Cloud Run inject `PORT=3000`. | Preserves local Vite proxy development ergonomics while standardizing container/Cloud Run health probes and `Dockerfile` `EXPOSE 3000`. |
| **D-03** | **Budget Alert Currency & Thresholds** (Guide Ep. 1 `$5` USD 50/90/100% vs. Hard Cap) | **฿250 THB (~$7 USD) Alerts-Only Budget** with notifications on **Actual spend at 10% (฿25), 20% (฿50), 50% (฿125), 90% (฿225)** (`ep01-budget-alert.png`). | Billing account uses THB; alerts-only (no billing disablement) prevents abrupt GCP project shutdown during live grading or Lab 6 while providing earlier 10%/20% anomaly warnings (`PR #33`). |
| **D-04** | **Branch Strategy & Dual Rulesets** (Protected `main` baseline) | Dedicated **`lab5-staging`** integration branch **plus active Rulesets on BOTH `protect-staging` and `protect-main`** (empty bypass list, `require_last_push_approval`, required check `test-and-docker`). | Guarantees broken commits or unreviewed code cannot pollute shared `lab5-staging`, while keeping `main` strictly as an auto-deploying production release branch (`PR #36`, `PR #37`). |
| **D-05** | **Database-Backed CI Gate** (Unit-only mocks vs. Live Postgres) | `.github/workflows/ci-docker.yml` provisions real **`postgres:16-alpine`** with `pg_isready`, runs `prisma migrate deploy && prisma:seed`, executes 148 backend + 31 frontend + 3 offline deploy test suites, and verifies `docker build`. | PopQueue relies on PostgreSQL atomic ticket numbering (`FOR UPDATE` / transactions); testing against real Postgres 16 catches concurrency/migration regressions early (`PR #34`, `Check C-01`). |
| **D-06** | **Keyless WIF Security Scoping** (Static JSON keys vs. Minimal OIDC) | 100% keyless OIDC (`github-actions` pool / `github-main` provider), immutable `repository_id` (`1441119685`) & `repository_owner_id` (`137395434`), **`sub` claim using GitHub `@` syntax**, `roles/run.developer` & per-service-account `serviceAccountUser`. | Zero static JSON keys (`Listed 0 items.`, `ep06-wif-setup-key-audit.png`), immune to repo-rename impersonation, and restricted solely to `main` + `deploy.yml` + `demo` environment (`PR #37`). |
| **D-07** | **Cloud SQL Tier & Storage** (`db-f1-micro` vs. larger tiers) | `db-f1-micro`, `--edition=enterprise`, PostgreSQL `16.15`, fixed `10 GB` SSD in `asia-southeast1`. | Lowest-cost persistent PostgreSQL (~$10.7/mo + $2.4/10GB covered by $300 trial credit) delivering sub-10ms Cloud Run Unix-socket latency and full restart/redeploy durability (`Check C-05`). |
| **D-08** | **Secret Manager Compatibility vs. Seed Config** (`deploy.sh` vs. `seed.ts`) | Retained `popqueue-admin-password` & `popqueue-demo-password` provisioning in `deploy.sh`/`teardown.sh` alongside core `popqueue-database-url` & `popqueue-jwt-secret`, while `server/prisma/seed.ts` reads `SEED_COLLECTOR_PASSWORD` & `SEED_STAFF_PASSWORD`. | Maintains starter-kit script compatibility & passing stub test assertions without adding runtime seed credentials to the Cloud Run service container; both sets are tracked transparently in Section 2. |
| **D-09** | **4-Layer Commit SHA Traceability** (Handout `Check C-06` & `R-08`) | Build-time `--build-arg GIT_SHA=$IMAGE_TAG` -> Stage 1 `VITE_GIT_SHA` (footer badge) + Stage 3 `GIT_SHA` (`/api/health`) + Cloud Run label `commit-sha` + `@sha256` digest + `smoke_test.py` `commit` assertion. | Container runs as unprivileged `USER node` without `.git` folder; build-time injection + smoke-test enforcement guarantees API, UI footer, and GCP revision labels can never silently drift or return `"dev"` (`PR #38`). |
| **D-10** | **No Live Teardown / Episode 9 Pause Policy** (Handout §1, §3 & Guide Ep. 9–10) | Validated `teardown.sh` strictly with `DRY_RUN=1` and stub tests; kept GCP production live (`min-instances=0`) and adopted pause/resume (`--activation-policy=NEVER/ALWAYS`) only for post-grading idle breaks. | Instructor requires live service for Lab 5 grading and reuse in Lab 6 Cross-Team UAT; running live `teardown.sh` would destroy `CRY-001` persistence evidence and break UAT (`Issue #32`). |
| **D-11** | **Cross-Platform LF Shell Script & Dockerfile Hardening** (Check C-03 discovery) | Added root `.gitattributes` enforcing `eol=lf` for `*.sh` scripts plus `sed -i 's/\r$//' ./docker-entrypoint.sh` in `server/Dockerfile`. | Fresh `git clone` on Windows checked out `server/docker-entrypoint.sh` with CRLF (`\r\n`), causing Linux container startup failure (`exec ./docker-entrypoint.sh: no such file or directory`) during Check C-03 testing; pinning LF + stripping `\r` in image build guarantees clean-clone portability across Windows/macOS/Linux. |

### 7.2 Substantive Peer-Review Decision Trail (`R-09` Compliance)

Every Pull Request in Lab 5 underwent cross-member peer review (`@Theerawat82` $\leftrightarrow$ `@apfirst13`) with explicit code checks, blocking findings, or merge rationales (zero self-approvals):

| PR / Issue | Author -> Reviewer | Review Outcome & Decision Evidence |
|---|---|---|
| **PR #26 (`#25`)** | `@Theerawat82` -> `@apfirst13` | **`APPROVED`:** Inspected `Dockerfile:19-66` (`USER node`), `/api/ready` 503 catch, `client` 30 Vitest tests & CI Run `42570690110`; explicitly flagged that local `docker compose` waited for Docker daemon availability (resolved via Cloud Run in PR #35 + clean-clone Check C-03 in Issue 9). |
| **PR #33 (`#24`)** | `@Theerawat82` -> `@apfirst13` | **`APPROVED`:** Audited `ep01-*.png` screenshots for masked personal emails (`R-12`), CI run `aa1b7a4`, 10%–90% THB thresholds, and verified `lab5` label (`R-10`). |
| **PR #34 (`#27`)** | `@apfirst13` -> `@Theerawat82` | **`APPROVED`:** Audited pinned SHA GitHub Actions, Node 24 parity, `postgres:16-alpine` service health check, `prisma migrate deploy`, and green CI Run `#43050323811`. |
| **PR #35 (`#28`)** | `@Theerawat82` -> `@apfirst13` | **`APPROVED`:** Independently probed live Cloud Run `/api/health`, `/api/ready`, `/api/series`, idempotent `popqueue-migrate-qwzsf`, and `teardown.sh` secret cleanup. |
| **PR #36 (`#29`)** | `@apfirst13` *(Check C-02)* | **`CLOSED (Blocked, Unmerged)`:** Deliberate `expect(1).toBe(2)` failed Run `#43254466119` (`test-and-docker`), activating `protect-staging` merge block; kept closed for audit (`Check C-02`). |
| **PR #37 (`#29`)** | `@apfirst13` -> `@Theerawat82` | **`APPROVED`:** Verified immutable OIDC CEL claim (`@` syntax), `Listed 0 items.` key audit, active rulesets with empty bypass list, and caught markdown typo (`:` vs `@`) in `deployment.md` to fix cleanly in Issue 9. |
| **PR #38 (`#30`)** | `@Theerawat82` -> `@apfirst13` | **`CHANGES_REQUESTED` -> `APPROVED`:** Initial review caught 3 Check C-06 traceability blockers (missing `commit` in `/api/health`, missing `--build-arg GIT_SHA` in `deploy.yml`/`Dockerfile`, missing UI footer badge). Resolved in `b8922ae` + added `test_health_missing_commit_sha_fails` -> green Run `#43368438027` -> `APPROVED`. |
| **PR #39 (`#30,#31`)** | `@apfirst13` -> `@Theerawat82` | **`APPROVED`:** Pre-production audit of `lab5-staging -> main` release diff, `Deploy demo` `id-token: write` scope, `@sha256` digest deployment, and `--wait` migration gate -> merged `e010e19` -> green CD Run `#43370798180`. |
| **PR #40 (`#31`)** | `@apfirst13` -> `@Theerawat82` | **`CHANGES_REQUESTED` (x2) -> `APPROVED`:** Caught duplicate MD5 PNGs (`c05-test1`/`c06`), missing URL bar in `c04-step1`, Console restart vs CLI doc mismatch, pair role-swap mismatch, Windows taskbar timestamp confusion, and queried client countdown timer logic (`CountdownTimer.tsx`). Resolved in Commit `7cc44d5` (Run `#43389963671`) -> `APPROVED` with non-blocking Issue 9 clarification note. |

---

## 8. Master Evidence Index (`C-01`..`C-06` & `R-01`..`R-12`)

| Check / Req | Verification Summary | Primary GitHub / GCP Evidence |
|---|---|---|
| **R-01, R-02, C-03** | Multi-stage root `Dockerfile` (`USER node`), 4-container `docker-compose.yml`, zero committed secrets, clean-clone build from `.env.example` | [PR #26](https://github.com/apfirst13/PopQueue_BFteam/pull/26), `.env.example`, `docs/labs/lab05/evidence/c03-clean-clone-log.txt`, `ep01-push-protection.png` |
| **R-03, R-04, C-04** | Live public Cloud Run service & Cloud SQL `popqueue-pg`; full Collector/Staff/409 workflow on public URL with browser address bar & masked passwords | [PR #35](https://github.com/apfirst13/PopQueue_BFteam/pull/35), [PR #40](https://github.com/apfirst13/PopQueue_BFteam/pull/40), `https://popqueue-5now4hkvsa-as.a.run.app`, `c04-step0..step3.png` |
| **R-04, C-05** | Ticket `CRY-001` persisted across scale-to-zero, Cloud SQL restart (`12:40:44 PM`), and CD redeploy ([Run #43373875178](https://github.com/apfirst13/PopQueue_BFteam/actions/runs/43373875178)) | [PR #40](https://github.com/apfirst13/PopQueue_BFteam/pull/40), `c05-test1..test3*.png` |
| **R-05, C-01** | Green CI quality gate with real Postgres 16 container, 148 backend + 31 frontend + offline deploy tests + Docker build | [PR #34](https://github.com/apfirst13/PopQueue_BFteam/pull/34) ([Run #43050323811](https://github.com/apfirst13/PopQueue_BFteam/actions/runs/43050323811)), [PR #38](https://github.com/apfirst13/PopQueue_BFteam/pull/38) ([Run #43368438027](https://github.com/apfirst13/PopQueue_BFteam/actions/runs/43368438027)) |
| **R-06, C-02** | Active rulesets (`protect-staging`, `protect-main`) & closed blocked PR #36 (`expect(1).toBe(2)`) | [PR #36](https://github.com/apfirst13/PopQueue_BFteam/pull/36) ([Run #43254466119](https://github.com/apfirst13/PopQueue_BFteam/actions/runs/43254466119)), [PR #37](https://github.com/apfirst13/PopQueue_BFteam/pull/37), `ep06-ruleset-*.png`, `ep06-c02-*.png` |
| **R-07, R-08, C-06** | Keyless WIF CD on `main` merge (`deploy.yml`), `@sha256` digest, `popqueue-migrate --wait`, smoke test, live `/api/health` + UI commit badge, tag `v0.2.0-lab5` | [PR #37](https://github.com/apfirst13/PopQueue_BFteam/pull/37), [PR #38](https://github.com/apfirst13/PopQueue_BFteam/pull/38), [PR #39](https://github.com/apfirst13/PopQueue_BFteam/pull/39) ([Run #43370798180](https://github.com/apfirst13/PopQueue_BFteam/actions/runs/43370798180)), `c06-live-commit-sha-badge.png` |
| **R-09, R-10, R-11, R-12** | Substantive peer reviews across every PR (zero self-approvals), `lab5` label on all Issues/PRs, public repo, complete `deployment.md` & `DRY_RUN=1` teardown validation | Issues `#24`–`#32`, PRs `#26`, `#33`–`#40`, `docs/labs/lab05/deployment.md`, `docs/labs/lab-05/deployment.md` |





