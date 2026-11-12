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
- **Branch:** `feature/lab5-cloud-deploy` targeting `lab5-staging`
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


