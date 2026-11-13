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

All settings are read from the execution environment at runtime. No plaintext secrets, API keys, or connection strings are baked into Docker images or committed to Git.

| Variable Name | Purpose | Is Secret? | Local Default (.env.example) | GCP Production Source |
|---|---|:---:|---|---|
| `NODE_ENV` | Application runtime environment (`development` / `production` / `test`) | No | `development` | Cloud Run environment variable (`production`) |
| `PORT` | HTTP server listening port | No | `4000` (Local) / `3000` (Docker) | Cloud Run injected port (`3000`) |
| `TZ` | System timezone | No | `Asia/Bangkok` | Cloud Run environment variable (`Asia/Bangkok`) |
| `DATABASE_URL` | PostgreSQL connection string | **Yes** | `postgresql://popqueue:popqueue_dev_password@localhost:5432/popqueue` | GCP Secret Manager: `popqueue-database-url` (Unix domain socket via Cloud SQL proxy) |
| `JWT_SECRET` | Secret key for signing authentication tokens (min. 32 characters) | **Yes** | `popqueue-super-secret-jwt-key-at-least-32-chars-long` | GCP Secret Manager: `popqueue-jwt-secret` (64-character generated hex) |
| `JWT_EXPIRES_IN` | JWT access token lifespan | No | `8h` | Defaulted in application code (`8h`) |
| `BCRYPT_COST` | Salt rounds for bcrypt password hashing | No | `10` | Defaulted in application code (`10`) |
| `CORS_ORIGIN` | Allowed cross-origin header | No | `http://localhost:3000` | Application default / permissive for API routes |
| `SEED_COLLECTOR_PASSWORD` | Synthetic password for seeded Collector accounts | Semi-secret (Test) | `collector_dev_password123` | Defaulted or injected in demo seed |
| `SEED_STAFF_PASSWORD` | Synthetic password for seeded Box Master staff accounts | Semi-secret (Test) | `staff_dev_password123` | Defaulted or injected in demo seed |

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

### Option C: Automated Test Suite (Sprint 1 Verification)
```bash
# Backend vitest (147 tests)
cd server
npm test

# Frontend vitest (30 tests)
cd client
npm test

# Deployment offline script tests
bash -n deploy/deploy.sh deploy/teardown.sh deploy/release.sh
bash deploy/tests/test_deploy_stub.sh
bash deploy/tests/test_release_stub.sh
python3 -m unittest discover -s deploy/tests -p 'test_smoke.py'
```

---

## 4. GCP Architecture & Resource Naming (R-03, R-07)

| Resource | Target GCP Name | Configuration Details |
|---|---|---|
| **GCP Project** | `cpe334-bfteam` (Project No. `902539659249`) | Free Trial ($300 credit), Budget Alert set ($5 threshold) |
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
- **GitHub Actions Summary:** The release job records the exact commit SHA, digest, and URL in `$GITHUB_STEP_SUMMARY`.
- **GCP Console:** Under Cloud Run > `popqueue` > Revisions, the active revision shows the exact container image tag `@sha256:<digest>` matching the commit SHA.
- **Git Tags:** Releases are tagged with semantic versioning (e.g. `v0.1.0-sprint1`, `v0.2.0-lab5`).

---

## 6. Demonstration Verification Checks & Evidence Log

### Check C-01: Normal PR CI Gate (Lab 5 Issue 4 / GitHub Issue #27)
- **Course Requirement:** R-05, Spec 11 (Part 1: CI and Quality Gate, 30 Points)
- **Branch:** `feature/lab5-i04-ci` targeting `lab5-staging`
- **Workflow:** `.github/workflows/ci-docker.yml` (Job: `test-and-docker`)
- **Criteria:** All offline deploy tests, backend tests (PostgreSQL 16 service container), frontend tests, and Docker build pass with exit code 0.
- **Evidence Record:**
  - Pull Request: PR #34 (Merged into `lab5-staging`)
  - Status: Implemented & Verified in Issue 4

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
  assertion.sub == 'repo:apfirst13:137395434/PopQueue_BFteam:1441119685:environment:demo'
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
  - Workflow: `.github/workflows/ci-docker.yml` (Run #14)
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
  - PR #36 was safely closed with state `Closed` (purple badge) without merging.
  - Per Course Rubric, the PR is **NOT deleted**, ensuring the instructor can inspect the live GitHub link, workflow run log, and ruleset enforcement directly.
- **Archived Screenshots:**
  - `docs/labs/lab05/evidence/ep06-c02-deliberate-failure.png`
  - `docs/labs/lab05/evidence/ep06-c02-action-failed.png`
  - `docs/labs/lab05/evidence/ep06-c02-merge-blocked.png`
  - `docs/labs/lab05/evidence/ep06-c02-pr-closed.png`

---

### Episode 7: Automated Continuous Delivery (CD) Pipeline, Smoke Testing & Commit SHA Traceability (Lab 5 Issue 7 / GitHub Issue #30)
- **Course Requirement:** R-07, R-08, R-09, R-11, Check C-06
- **Branch:** `feature/lab5-i07-cd-pipeline` targeting `lab5-staging`
- **Authors & Reviewers:** Lead: `@apfirst13` / Reviewer: `@Theerawat82`
- **CD Pipeline Mechanism:**
  - Automated deployment workflow configured at `.github/workflows/deploy.yml` triggered on push to `main` (resulting from merged release PR) and on-demand via `workflow_dispatch`.
  - Reusable CI quality gate (`test-and-docker`) strictly required before deployment begins.
  - Keyless Google Cloud authentication using Workload Identity Federation (WIF).
  - Docker container image built with build-argument `GIT_SHA=$IMAGE_TAG` and pushed to Artifact Registry (`popqueue/popqueue:$IMAGE_TAG`).
  - Idempotent database migrations executed via Cloud Run Job `popqueue-migrate` before updating the live service (`release.sh`).
  - Cloud Run Service updated with immutable container image digest (`@sha256:...`) and revision label `commit-sha=$IMAGE_TAG`.
  - Automated read-only smoke test (`deploy/smoke_test.py`) validating `/api/health`, `/api/ready`, `/`, and `/api/series` without mutating production data.
- **Commit SHA Traceability (Check C-06, R-08):**
  - **API Endpoint:** `GET /api/health` returns `{ "status": "ok", "commit": "<git-sha>" }`.
  - **Web UI Footer:** Responsive badge displaying `PopQueue v0.2.0-lab5` and `<code data-testid="git-sha-badge">` showing the release Git commit SHA.

---

### Episode 8: Live Domain Workflow, Cloud SQL Persistence Verification & Rollback Procedure (Lab 5 Issue 8 / GitHub Issue #31)
- **Course Requirement:** R-03, R-04, R-07, R-08, R-11, C-04, C-05, C-06
- **Branch:** `feature/lab5-i08-persistence-verify` targeting `lab5-staging`
- **Authors & Reviewers:** Lead: `@Theerawat82` / Reviewer: `@apfirst13`
- **Verification Check C-04: Public Domain Workflow Demonstration:**
  - Demonstrated live on public Cloud Run domain (`https://popqueue-5now4hkvsa-as.a.run.app`).
  - **Step 1 (Collector Join):** Collector authenticated as `collector1` and joined `CRY` series, generating live queue ticket **`CRY-001`** in `WAITING` state.
  - **Step 2 (Staff Counter Call):** Staff authenticated as `staff_crybaby` at Counter (`/staff`) and called the queue, transitioning ticket to `CALLED`.
  - **Step 3 (Duplicate Rejection):** Collector attempted duplicate active queue join; verified business rule rejection returning HTTP 409 Conflict (`[DUPLICATE_ACTIVE_QUEUE] User already has an active queue ticket`).
  - **Archived Evidence:**
    - `docs/labs/lab05/evidence/c04-step0-login-masked.png` (Masked password login)
    - `docs/labs/lab05/evidence/c04-step1-collector-join.png` (Ticket CRY-001 created)
    - `docs/labs/lab05/evidence/c04-step2-staff-call.png` (Staff counter called CRY-001)
    - `docs/labs/lab05/evidence/c04-step3-duplicate-rejection.png` (Rejection 409 Conflict)
- **Verification Check C-05: Cloud SQL Data Persistence Verification:**
  - Verified persistence of actual ticket ID **`CRY-001`** across three operational events proving durable SSD storage:
    1. **Scale-Down to 0 (Cold Start):** Verified ticket remains intact when instances scale down to 0 and boot fresh on incoming request.
    2. **Cloud SQL Database Restart:** Executed `gcloud sql instances restart popqueue-pg --project=cpe334-bfteam`. Verified database recovered to `RUNNABLE` and ticket `CRY-001` remained completely intact.
    3. **Service Redeployment:** Triggered automated redeployment via GitHub Actions CD pipeline. Verified new revision connects to Cloud SQL and serves `CRY-001` without data loss.
  - **Archived Evidence:**
    - `docs/labs/lab05/evidence/c05-test1-scale-down-persistence.png`
    - `docs/labs/lab05/evidence/c05-test2-gcp-db-restart.png` (GCP Console confirmation of restart)
    - `docs/labs/lab05/evidence/c05-test2-db-restart-persistence.png` (Ticket CRY-001 intact after DB restart)
    - `docs/labs/lab05/evidence/c05-test3-redeploy-cli.png` (GitHub Actions workflow_dispatch trigger & ready endpoint verification)
    - `docs/labs/lab05/evidence/c05-test3-redeploy-persistence.png` (Ticket CRY-001 intact after Service redeploy)
- **Verification Check C-06: Live Commit SHA Traceability Verification:**
  - Verified live running Cloud Run service displays commit SHA matching Git release commit on `main` (`e010e19`):
    - `GET /api/health` returns `{"status":"ok","commit":"e010e192299067368c0f7101d6d7e7aeff442876"}`.
    - Web UI footer renders badge: `PopQueue v0.2.0-lab5 • Commit: e010e19`.
  - **Archived Evidence:**
    - `docs/labs/lab05/evidence/c06-live-commit-sha-badge.png`
- **Operational Procedure: Cloud Run Revision Rollback (Check C-04 / Production Ops):**
  - If a newly deployed revision encounters an unforeseen production defect, traffic can be instantly rolled back to the previous stable revision without rebuilding or pushing code:
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





