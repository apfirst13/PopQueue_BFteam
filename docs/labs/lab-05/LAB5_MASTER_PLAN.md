# PopQueue — Lab 5 Master Execution & Deployment Plan
## Cloud Deployment and CI/CD Pipeline on Google Cloud Platform (GCP)

**Course:** CPE 334 Software Engineering, Semester 1/2026, KMUTT  
**Theme:** Theme 9 — Queue and Service Management System (PopQueue: On-site Virtual Queue for Art Toy Live Unboxing)  
**Team:** BFteam (Section 1)  
**Total Points:** 100 Points  
**Target Release Tag:** `v0.2.0-lab5`  
**Base Release Tag:** `v0.1.0-sprint1` (Commit `d946159`, Branch `main`)  
**Active Staging Branch:** `lab5-staging`  
**Current PR under Review:** PR #26 (`feature/lab5-docker-setup` -> `lab5-staging`)

---

## 1. Executive Summary & Team Alignment

This document establishes the end-to-end Master Plan for **Lab 5: Cloud Deployment and CI/CD Pipeline**. The goal of this lab is to transition the PopQueue application from a local development environment into a fully automated, production-grade cloud deployment on **Google Cloud Platform (GCP)** with automated testing, continuous integration, containerization, and continuous delivery via GitHub Actions.

### Team Roles & Responsibility Matrix (R-09, R-11)

| Member | GitHub Username | Role | Primary Lab 5 Responsibilities |
|---|---|---|---|
| **Theerawat** | `@Theerawat82` | Author / DevOps Engineer | Dockerization, multi-stage builds, CI/CD GitHub Actions workflows, Cloud Run deployment scripts, smoke test automation, persistence/rollback verification. |
| **Teammate** | `@apfirst13` | Reviewer / Project Owner / Budget Lead | GCP Account provisioning, $5 Budget Alert configuration, Workload Identity Federation (WIF) setup, Pull Request reviews & approvals, final PDF report compilation. |

> **Hard Constraint (R-09 / R-11):** The author of a Pull Request cannot approve or merge their own PR. All PRs targeting `lab5-staging` or `main` require explicit review and approval from the other team member.

---

## 2. Target Cloud Architecture & Tech Stack

PopQueue is architected as a unified containerized full-stack service to optimize resource efficiency on GCP free-tier resources while ensuring zero-downtime database persistence.

```
                    +--------------------------------------------------+
                    |             Internet / Users & Staff             |
                    +--------------------------------------------------+
                                             |
                                             v HTTPS (Port 443)
                    +--------------------------------------------------+
                    |           Google Cloud Run: popqueue             |
                    |  - Region: asia-southeast1 (Singapore)           |
                    |  - 1 vCPU, 512 MiB Memory, Min: 0, Max: 2        |
                    |  - Unified Container: Express 4 + Node 24 Alpine |
                    |    * Port 3000                                   |
                    |    * Static React SPA served from client/dist    |
                    |    * REST API endpoints: /api/*                  |
                    |    * Health/Readiness: /api/health, /api/ready   |
                    +--------------------------------------------------+
                             |                             |
      Cloud SQL Auth Proxy   |                             | Cloud IAM / Secret Manager
      Unix Socket Connection |                             | (Mounted Env Secrets)
                             v                             v
             +-------------------------------+   +-----------------------------+
             | Cloud SQL (PostgreSQL 16)     |   | Secret Manager              |
             | - Instance: popqueue-pg       |   | - popqueue-database-url     |
             | - Tier: db-f1-micro           |   | - popqueue-jwt-secret       |
             | - Edition: Enterprise         |   +-----------------------------+
             | - Persistent SSD Storage      |
             +-------------------------------+
```

### Local Dev vs. Cloud Production Comparison

| Component | Local Development | Cloud Production (GCP) |
|---|---|---|
| **Frontend** | React 18, Vite Dev Server (`:5173`) | Compiled static SPA bundled in Express `/app/client/dist` |
| **Backend** | Express 4 + TypeScript (`:3000`) | Express 4 hosting both API and React SPA on port 3000 |
| **Database** | Docker container `postgres:16-alpine` | Cloud SQL for PostgreSQL 16 (`popqueue-pg`, `db-f1-micro`) |
| **Migrations** | Local `npx prisma migrate dev` | Cloud Run Job (`popqueue-migrate`) executed before service rollout |
| **Container Engine**| Docker Desktop + Docker Compose | Cloud Run (Serverless Managed Containers) via Artifact Registry |
| **CI / CD** | Vitest local run | GitHub Actions (`ci-docker.yml` on PR, `deploy.yml` on merge to `main`) |
| **Authentication** | Local `.env` | GCP Secret Manager + Workload Identity Federation (WIF) |

---

## 3. Grading Criteria & Requirements Traceability Matrix (100 Points)

| Req ID | Points | Requirement Description | Implementation Artifact | Verification Evidence |
|:---:|:---:|---|---|---|
| **R-01** | 10 | GCP Free Trial & Budget Alert ($5 threshold, 50%, 90%, 100%) | Google Cloud Console Billing Alert | Screenshot of Budget Alert with email recipient |
| **R-02** | 10 | Cloud readiness & deployment documentation | `docs/labs/lab-05/deployment.md` | Architecture diagram, env var table, deploy steps |
| **R-03** | 10 | Containerize application with Docker | `Dockerfile`, `docker-compose.yml` | Multi-stage build, non-root user, local compose up |
| **R-04** | 10 | CI on Pull Requests with test & build gate | `.github/workflows/ci-docker.yml` | Green GitHub Actions run on PR, **Check C-01** |
| **R-05** | 10 | First manual deployment via Cloud Shell | `deploy/deploy.sh` | Live Cloud Run URL responding 200 OK |
| **R-06** | 10 | Branch protection on `main` & WIF setup | GitHub Ruleset + GCP IAM WIF | Rejected direct push (**Check C-02**), WIF pool |
| **R-07** | 15 | Automated CD pipeline on merge to `main` | `.github/workflows/deploy.yml` | Automatic deployment log (**Check C-03**) |
| **R-08** | 10 | Automated smoke test in CD pipeline | `deploy/smoke_test.py` | CD job passing smoke test (**Check C-04**) |
| **R-09** | 5 | Cross-member PR review & ruleset enforcement | GitHub PR reviews (@Theerawat82 & @apfirst13) | PR review approval comments and timestamps |
| **R-10** | 5 | Persistent DB storage & rollback verification | Cloud SQL + Cloud Run Revision update | Data survives restart (**Check C-05**), Rollback (**Check C-06**) |
| **R-11** | 5 | Teamwork and balanced contribution | GitHub Commit/PR history | Split ownership across issues and commits |
| **R-12** | Pass/Fail | Zero committed secrets | Git commit history + Secret Manager | `.env` untracked, clean repo history, Secret Manager used |

---

## 4. Mandatory Demonstration Verification Checks (C-01 to C-06)

To achieve full marks on the grading rubric, the following 6 concrete demonstrations must be executed, captured, and documented in the final report:

| Check ID | Demonstration Requirement | Execution Method | Expected Output / Evidence |
|:---:|---|---|---|
| **C-01** | **CI Gate Demonstration** | Create temporary PR with failing test or syntax error. | GitHub Actions CI fails, PR merge button is disabled. |
| **C-02** | **Branch Protection Demonstration** | Attempt a direct `git push origin main`. | Remote rejection: `remote: error: GH013: Repository rule violations found for refs/heads/main`. |
| **C-03** | **Automated CD Trigger** | Merge approved PR from `lab5-staging` into `main`. | `.github/workflows/deploy.yml` triggers automatically without manual intervention. |
| **C-04** | **Smoke Test Verification** | CD pipeline executes `deploy/smoke_test.py`. | Green CD step verifying `/api/health`, `/api/ready`, static UI, and a live queue join operation. |
| **C-05** | **Database Persistence Check** | Create queue ticket on live site, restart Cloud Run revision / delete container instance, query ticket again. | Ticket persists in database; data is not lost upon container restart. |
| **C-06** | **Service Rollback Demonstration** | Execute manual rollback to previous Cloud Run revision using `gcloud run services update-traffic` or GitHub release rollback. | Traffic shifted 100% to previous revision within seconds without redeploying code. |

---

## 5. Sequential Issue Breakdown (9 Issues Total)

All 9 issues are mapped directly to the Lab 5 Student Guide and Handout episodes:

```
[Issue 1: GCP & Budget Alert] (Console, @apfirst13)
        |
        +---> [Issue 2: Cloud Readiness & Docs] (PR #26)
        |
        +---> [Issue 3: Dockerization & Local Compose] (PR #26)
        |
        v
[Issue 4: CI on PRs with Docker & Test Gate] (PR #26)
        |
        v
[Issue 5: Cloud Shell Deploy & Cloud SQL] (deploy.sh)
        |
        v
[Issue 6: Workload Identity Federation & Branch Protection] (WIF + Ruleset)
        |
        v
[Issue 7: Automated CD & Smoke Test] (deploy.yml + smoke_test.py)
        |
        v
[Issue 8: Persistence Check & Rollback Demo] (C-05 & C-06)
        |
        v
[Issue 9: Documentation, Report PDF & Teardown] (lab5_sec1_BFteam.pdf)
```

### Issue 1 (Episode 1): GCP Free Trial Account & Budget Alert ($5 Threshold)
* **GitHub Issue Title:** `Lab 5 Issue 1: Setup GCP Free Trial, Budget Alert ($5 threshold) & Billing Account`
* **Assignee:** `@apfirst13`
* **Scope:**
  - Create or select Google Cloud Project (e.g. `popqueue-lab5` or `qdrive-lab5`).
  - Link Billing Account with Free Trial credits.
  - Create Budget Alert:
    - Target: $5.00 USD total budget.
    - Thresholds: 50% ($2.50), 90% ($4.50), 100% ($5.00).
    - Notifications: Email alert to project owners.
  - Enable fundamental GCP APIs:
    - Cloud Run (`run.googleapis.com`)
    - Cloud SQL Admin (`sqladmin.googleapis.com`)
    - Secret Manager (`secretmanager.googleapis.com`)
    - Artifact Registry (`artifactregistry.googleapis.com`)
    - IAM & Service Account Credentials (`iam.googleapis.com`)
* **Deliverable Evidence:** Screenshot of GCP Budget Alert dashboard showing $5 budget, email notification settings, and enabled APIs.

---

### Issue 2 (Episode 2): Cloud Readiness, Environment Configuration & Deployment Architecture Doc
* **GitHub Issue Title:** `Lab 5 Issue 2: Cloud Readiness, Environment Configuration & Deployment Architecture Doc`
* **Assignee:** `@Theerawat82` | **Reviewer:** `@apfirst13`
* **Scope:**
  - Create `.env.example` documenting all runtime variables (`DATABASE_URL`, `JWT_SECRET`, `PORT`, `NODE_ENV`, `CLIENT_DIST_DIR`).
  - Add production health check endpoints in `server/src/app.ts`:
    - `GET /api/health` -> returns `{ status: "ok", timestamp: ... }`.
    - `GET /api/ready` -> executes `SELECT 1` via Prisma to verify live database connectivity.
  - Configure Express to serve compiled React SPA static files from `/app/client/dist` with SPA client-side fallback route.
  - Create `docs/labs/lab-05/deployment.md` containing:
    - Mermaid architecture diagram mapping components to GCP services.
    - Secrets matrix distinguishing Secret Manager references from plain env vars.
    - Step-by-step deploy instructions.
* **Deliverable Evidence:** `docs/labs/lab-05/deployment.md`, `/api/health` and `/api/ready` test suite.

---

### Issue 3 (Episode 3): Containerize PopQueue Full-Stack Application with Docker
* **GitHub Issue Title:** `Lab 5 Issue 3: Containerize PopQueue Full-Stack Application with Docker`
* **Assignee:** `@Theerawat82` | **Reviewer:** `@apfirst13`
* **Scope:**
  - Root multi-stage `Dockerfile`:
    - Stage 1 (`client-builder`): Builds Vite React frontend -> produces static dist.
    - Stage 2 (`server-builder`): Compiles TypeScript Express server.
    - Stage 3 (`production`): Node 24 Alpine runtime, non-root user `node`, Prisma generated client, Express static host on port 3000.
  - Local microservice Dockerfiles:
    - `client/Dockerfile` with Nginx reverse proxy on port 5173.
    - `server/Dockerfile` with `docker-entrypoint.sh` for backend isolation.
  - `docker-compose.yml`:
    - Service `db`: `postgres:16-alpine` with healthcheck.
    - Service `migrate`: runs `prisma migrate deploy` after db becomes healthy.
    - Service `server`: Express backend on port 3000.
    - Service `client`: Nginx frontend on port 5173 with proxy to server.
  - Root `.dockerignore` excluding `node_modules`, `.git`, `.env`, tests, artifacts.
* **Deliverable Evidence:** Terminal log of `docker compose up --build` and `docker compose ps` showing all 4 services healthy.

---

### Issue 4 (Episode 4): Continuous Integration (CI) on Pull Requests with Test & Build Gate
* **GitHub Issue Title:** `Lab 5 Issue 4: Setup CI Pipeline on Pull Requests with Automated Testing & Docker Build Gate`
* **Assignee:** `@Theerawat82` | **Reviewer:** `@apfirst13`
* **Scope:**
  - Workflow `.github/workflows/ci-docker.yml` running on pull requests targeting `lab5-staging` and `main`.
  - CI Pipeline Job `test-and-docker`:
    1. Checkout repository.
    2. Setup Node.js 20 with npm cache.
    3. Install root and package dependencies (`npm ci`).
    4. Generate Prisma client & run database migrations on in-memory SQLite / PostgreSQL service.
    5. Execute Backend Unit & Integration Tests (147 tests pass).
    6. Execute Frontend Component Tests (30 tests pass).
    7. Execute Offline Deployment Script Tests (10 tests pass).
    8. Execute Multi-stage Docker build check (`docker build -t popqueue:ci .`).
  - **Execute Demonstration Check C-01:** Intentionally failing PR demonstration showing that a failing test blocks PR merge.
* **Deliverable Evidence:** GitHub Actions green check run screenshot + C-01 failing PR demonstration screenshot.

---

### Issue 5 (Episode 5): First Manual Deployment to Cloud Run & Cloud SQL via Cloud Shell
* **GitHub Issue Title:** `Lab 5 Issue 5: First Manual Deployment to Cloud Run & Cloud SQL via Cloud Shell`
* **Assignee:** `@Theerawat82` | **Reviewer:** `@apfirst13`
* **Scope:**
  - Deployment script `deploy/deploy.sh`:
    1. Authenticate with Google Cloud and set project ID.
    2. Provision Artifact Registry repository `popqueue`.
    3. Provision Cloud SQL PostgreSQL 16 instance `popqueue-pg` (`db-f1-micro`, `--edition=enterprise`).
    4. Create database `popqueue_db` and database user `popqueue_user`.
    5. Store credentials in Secret Manager (`popqueue-database-url`, `popqueue-jwt-secret`).
    6. Build and push production image to Artifact Registry.
    7. Execute Cloud Run Job `popqueue-migrate` to run Prisma migrations against Cloud SQL.
    8. Deploy Cloud Run service `popqueue` with Cloud SQL connection socket and mounted secrets.
  - Verify Cloud Run URL responds with 200 OK.
* **Deliverable Evidence:** Cloud Shell execution log, Cloud Run Service URL, active revision dashboard.

---

### Issue 6 (Episode 6): Setup Workload Identity Federation (WIF) & GitHub Branch Protection Ruleset
* **GitHub Issue Title:** `Lab 5 Issue 6: Setup Workload Identity Federation (WIF) & GitHub Branch Protection Ruleset`
* **Assignee:** `@apfirst13` & `@Theerawat82`
* **Scope:**
  - Configure GCP Workload Identity Federation (keyless authentication):
    - Create Workload Identity Pool: `github-actions-pool`.
    - Create Workload Identity Provider: `github-actions-provider`.
    - Create Service Account: `github-deployer@$PROJECT_ID.iam.gserviceaccount.com`.
    - Grant IAM roles: `roles/run.admin`, `roles/iam.serviceAccountUser`, `roles/artifactregistry.writer`, `roles/secretmanager.secretAccessor`.
    - Bind Workload Identity User to repository: `principalSet://iam.googleapis.com/.../attribute.repository/apfirst13/PopQueue_BFteam`.
  - Configure GitHub Environment:
    - Create Environment `demo` with variables (`GCP_PROJECT_ID`, `GCP_REGION`, `WIF_PROVIDER`, `WIF_SERVICE_ACCOUNT`).
  - Configure GitHub Branch Ruleset on `main`:
    - Restrict direct pushes: Direct push rejected (**Check C-02**).
    - Require pull request before merging with 1 required review approval (R-09).
    - Author cannot approve own PR.
    - Require status checks to pass: `test-and-docker`.
* **Deliverable Evidence:** Screenshot of GCP WIF provider, GitHub Environment settings, and C-02 rejected push terminal log.

---

### Issue 7 (Episode 7): Automated Continuous Delivery (CD) Pipeline & Smoke Test on Staging Merge
* **GitHub Issue Title:** `Lab 5 Issue 7: Setup Automated Continuous Delivery (CD) Pipeline & Smoke Test on Staging Merge`
* **Assignee:** `@Theerawat82` | **Reviewer:** `@apfirst13`
* **Scope:**
  - Workflow `.github/workflows/deploy.yml`:
    - Trigger: Push / PR merge from `lab5-staging` into `main`.
    - Authenticate to GCP using Workload Identity Federation (`google-github-actions/auth`).
    - Build and push Docker image with git SHA tag to Artifact Registry.
    - Run Cloud Run Migration Job `popqueue-migrate`.
    - Deploy new revision to Cloud Run service `popqueue`.
    - Wait for service ready status.
    - Run Automated Smoke Test: `python deploy/smoke_test.py --url $SERVICE_URL`.
  - Smoke Test Verification (**Check C-04**):
    - `GET /api/health` -> HTTP 200 OK.
    - `GET /api/ready` -> HTTP 200 OK (DB connectivity).
    - `GET /` -> HTTP 200 OK (React index.html).
    - `GET /api/series` -> HTTP 200 OK (Series catalog).
    - `POST /api/queue/join` -> HTTP 201 Created (End-to-end join transaction).
* **Deliverable Evidence:** Green GitHub Actions CD pipeline run (**Check C-03**), successful smoke test output log (**Check C-04**).

---

### Issue 8 (Episode 8): Verify Cloud SQL Persistence Across Restarts & Execute Rollback Procedure
* **GitHub Issue Title:** `Lab 5 Issue 8: Verify Cloud SQL Persistence Across Restarts & Execute Rollback Procedure`
* **Assignee:** `@Theerawat82` | **Reviewer:** `@apfirst13`
* **Scope:**
  - **Execute Demonstration Check C-05 (Data Persistence):**
    1. Join queue on live Cloud Run URL, creating ticket (e.g. `LAB5-DEMO-001`).
    2. Restart Cloud Run revision or force new revision deployment.
    3. Query ticket status via API/UI.
    4. Confirm ticket state and number remain perfectly intact in Cloud SQL.
  - **Execute Demonstration Check C-06 (Rollback Procedure):**
    1. Record previous stable Cloud Run revision name (e.g. `popqueue-00001-abc`).
    2. Deploy a new revision or simulate a defect.
    3. Execute instant rollback: `gcloud run services update-traffic popqueue --to-revisions=PREVIOUS_REVISION=100`.
    4. Verify traffic shifts back to the previous revision immediately.
* **Deliverable Evidence:** Screenshots and terminal logs for C-05 (persisted data) and C-06 (revision rollback).

---

### Issue 9 (Episode 9): Finalize Deployment Documentation, Teardown Verification & Generate Lab 5 PDF Report
* **GitHub Issue Title:** `Lab 5 Issue 9: Finalize Deployment Documentation, Teardown Verification & Generate Lab 5 PDF Report`
* **Assignee:** `@Theerawat82` & `@apfirst13`
* **Scope:**
  - Finalize `docs/labs/lab-05/deployment.md` with live production URLs, revision history, and secrets documentation.
  - Verify Teardown script `deploy/teardown.sh` to safely delete Cloud SQL, Cloud Run, and Artifact Registry images upon lab grading completion.
  - Generate final PDF report: `lab5_sec1_BFteam.pdf` strictly following formatting standards:
    - Font: Arial only.
    - Color: Pure black `#000000`.
    - Zero italics throughout the entire document.
    - Native tables and captioned figures for checks C-01 through C-06.
    - Complete evidence log and contributor sign-off.
* **Deliverable Evidence:** `docs/labs/lab-05/deployment.md`, `deploy/teardown.sh`, and `lab5_sec1_BFteam.pdf`.

---

## 6. Current Implementation State & Immediate Next Steps

### Current Status of PR #26 (`feature/lab5-docker-setup` -> `lab5-staging`)
* **Commits:**
  - `1d70373`: Unified multi-stage Dockerfile, docker-compose, Express static serving, health checks, deploy scripts, CI workflow.
  - `5cb0193`: Self-contained server tsconfig, Prisma client generation in CI, clean gitignore.
* **Testing:**
  - Backend: 147 tests pass.
  - Frontend: 30 tests pass.
  - Deploy stub tests: 10 tests pass.
  - Local Docker Compose: `popqueue-db`, `popqueue-server`, `popqueue-client` verified up and operational.
  - GitHub Actions CI: `ci-docker.yml` ran on PR #26 and passed 100% green.
* **Immediate Decision Point:**
  - PR #26 is currently **OPEN** and awaits teammate review from `@apfirst13`.
  - Once the user and teammate review and approve this Master Plan, `@apfirst13` will submit the PR review approval and merge PR #26 into `lab5-staging`.
  - If changes are requested to the plan, PR #26 can be adjusted or rolled back as instructed.

---

## 7. Cost & Budget Safety Protocol

To guarantee zero billing surprises:
1. **Cloud SQL Tier:** Strictly use `db-f1-micro` with Enterprise edition.
2. **Cloud Run Limits:** Maximum 2 instances (`--max-instances 2`), scale to 0 when idle (`--min-instances 0`).
3. **Artifact Registry:** Keep only the last 3 image tags.
4. **Teardown Script:** Run `deploy/teardown.sh` immediately after demonstration or evaluation to delete the Cloud SQL instance, which is the only resource incurring continuous hourly storage costs.

---

## 8. Master Execution Checklist

- [x] Create integration branch `lab5-staging` from `main`
- [x] Implement multi-stage `Dockerfile`, `docker-compose.yml`, health checks (PR #26)
- [x] Setup GitHub Actions CI workflow `ci-docker.yml` (PR #26)
- [x] Structure and archive Sprint 1 documentation into `docs/sprints/sprint-1/`
- [ ] User approval of `LAB5_MASTER_PLAN.md`
- [ ] Issue 1: `@apfirst13` configures GCP project & $5 Budget Alert
- [ ] Review & Merge PR #26 into `lab5-staging` (approved by `@apfirst13`)
- [ ] Issue 5: Initial Cloud Shell deployment via `deploy/deploy.sh`
- [ ] Issue 6: Configure Workload Identity Federation & branch ruleset on `main`
- [ ] Issue 6: Demonstrate Check C-01 (Failing PR) & Check C-02 (Rejected Direct Push)
- [ ] Issue 7: Create PR from `lab5-staging` to `main`, merge, and verify automated CD (**Check C-03**) & Smoke Test (**Check C-04**)
- [ ] Issue 8: Execute Persistence Verification (**Check C-05**) & Rollback Demonstration (**Check C-06**)
- [ ] Issue 9: Finalize `deployment.md`, generate `lab5_sec1_BFteam.pdf`, and run `teardown.sh`
