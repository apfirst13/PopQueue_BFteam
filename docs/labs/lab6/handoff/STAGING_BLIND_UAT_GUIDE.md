# PopQueue — Special Exercise Blind UAT Guide (`defect/lab6-reintroduce-validation` Local Execution)

> **Product Team:** **BFteam** (`@Theerawat82`, `@apfirst13`)  
> **Partner UAT Team:** **Omega-3** (`@guluJa`, `@PhraewaS`)  
> **Purpose:** Independent Blind UAT Guide for the **Lab 6 Special Exercise** (*Clarification for Teams with No UAT Defects*)  
> **Repository:** `https://github.com/apfirst13/PopQueue_BFteam`  
> **Target Branch Under Test:** **`defect/lab6-reintroduce-validation`** *(Isolated exercise branch from `lab5-staging` — separate from live Cloud Run baseline on `main`)*

---

## 1. Context & Separation of Environments

Per the instructor's clarification (**"Lab 6: Clarification for Teams with No UAT Defects"**):
1. Our initial Cloud Run deployment (`https://popqueue-5now4hkvsa-as.a.run.app`, tag `v0.2.0-lab5`, commit `bf52c9b`) completed `UAT-01`–`UAT-09` with zero genuine defects found. We are keeping that live service untouched while the Special Exercise begins.
2. Per the standardized procedure, BFteam placed a controlled exercise commit on branch **`defect/lab6-reintroduce-validation`** (branched from `lab5-staging`), and the UAT Team independently tests **`defect/lab6-reintroduce-validation`** as a **Blind Test** *(no hints or exact defect details disclosed beforehand)*.
3. Once your team identifies and reports the defect, BFteam will apply the full **Part D** workflow (triage, **RED** test, **GREEN** fix, regression, PR review into `lab5-staging` with green CI) and merge `lab5-staging → main` to **deploy the corrected release once to Cloud Run** for your final **Independent Re-test**.

> [!IMPORTANT]
> **Blind Test Integrity Rules:**
> * Please do **NOT** inspect commit messages, commit diffs, or code changes in `defect/lab6-reintroduce-validation` on GitHub before finishing your testing — test the running application independently as users/testers!
> * Do **NOT** use automated developer tests (`vitest`) as your UAT finding — discover and document behavior via actual UI and/or HTTP API testing.
> * Branch **`defect/lab6-reintroduce-validation`** is ready for your Blind Test run — please run `git fetch origin` and pull the latest commit before starting.

---

## 2. How to Run `defect/lab6-reintroduce-validation` Locally (Step-by-Step)

### Option A — Docker Compose *(Recommended: 1 Command, Zero `.env` Setup Needed)*

**Prerequisites:** `Git` + `Docker Desktop` (make sure Docker Engine is running and local ports **`5173`**, **`3000`**, and **`5432`** are not occupied by another project).

1. **Clone (if needed) and pull the latest `defect/lab6-reintroduce-validation` branch:**
   ```bash
   # If you have not cloned yet:
   git clone https://github.com/apfirst13/PopQueue_BFteam.git
   cd PopQueue_BFteam

   # Switch to and update the exercise branch:
   git fetch origin
   git checkout defect/lab6-reintroduce-validation
   git pull origin defect/lab6-reintroduce-validation

   # Record the exact Commit SHA you are testing (include this in your Defect Report!):
   git rev-parse HEAD
   ```

2. **Start a clean containerized stack (Database + Auto-Migrate/Seed + Server + Nginx UI):**
   ```bash
   # Ensure a clean database and fresh seeded accounts before starting:
   docker compose down -v
   docker compose up --build
   ```
   *(You may add `-d` if you want it in the background, then watch logs with `docker compose logs -f`.)*

3. **Wait until startup logs show `migrate` exited `0` and both `server` & `client` are ready, then verify:**
   * **Open UI in Browser:** **`http://localhost:5173`** *(⚠️ Note: In Docker Compose, the web UI + API proxy run on port **`5173`**, NOT `3000`!)*
   * **API Base URL (if testing via `curl` / Postman):** **`http://localhost:5173/api/...`** *(Nginx proxies `/api/*` directly to backend port `3000`; `http://localhost:3000/api/...` also works directly).*
   * **Quick Health & Clean Queue Check:**
     ```bash
     curl -s http://localhost:5173/api/health
     curl -s http://localhost:5173/api/ready
     curl -s http://localhost:5173/api/series
     ```
     *(Windows PowerShell tip: Use `curl.exe -s` instead of `curl -s`.)*
     *Expected:* `/api/ready` returns `{"db":"connected"}` and `/api/series` lists `CRY` (`isActive: true`, `waitingCount: 0`), `LAB` (`isActive: true`, `waitingCount: 0`), `SKP` (`isActive: false`, `waitingCount: 0`).

   *(Note: When running locally via Docker Compose, `GET /api/health` returns `"commit": "dev"` because `GIT_SHA` is only injected during Cloud Run CI builds, so always record the exact `git rev-parse HEAD` commit SHA from Step 1 in your Defect Report.)*

---

### Option B — Local Node.js + PostgreSQL *(Only If Docker Desktop Is Unavailable)*

> ⚠️ Do **NOT** simply run `npm run dev` at the repo root without setup — root `npm run dev` starts **only** the backend (`server` on port `4000`), not the frontend UI or PostgreSQL!

If you are not using Docker Compose:
1. Ensure **PostgreSQL 16** is running locally on `localhost:5432` matching `server/.env.example` (or update `DATABASE_URL` in `server/.env`).
2. Copy **both** environment templates and install dependencies from repo root:
   ```bash
   cp server/.env.example server/.env
   cp client/.env.example client/.env
   npm ci
   ```
   *(Check that `client/.env` sets `VITE_API_URL=http://localhost:4000` and `server/.env` sets `PORT=4000`, `CORS_ORIGIN=http://localhost:3000`.)*
3. Run database migrations and seed data:
   ```bash
   cd server
   npx prisma generate
   npx prisma migrate deploy
   npm run prisma:seed
   cd ..
   ```
4. Open **2 separate terminals** at the repo root:
   * **Terminal 1 (Backend API — port `4000`):** `npm run dev --workspace=server`
   * **Terminal 2 (Frontend UI — port `3000`):** `npm run dev --workspace=client`
5. Open **`http://localhost:3000`** in your browser (API calls go to `http://localhost:4000/api/...`).

---

### Option C — Scheduled Tunnel Fallback *(If Unable to Run Locally)*
If neither teammate can run Docker or local PostgreSQL, contact BFteam (`@Theerawat82` / `@apfirst13`) to schedule a live session where BFteam hosts `defect/lab6-reintroduce-validation` in local Docker and shares a temporary Tunnel URL.

---

## 3. Accounts, Multi-Session & Reset Rules During Local Testing

* **Accounts:** Sign in using **`username`** (NOT email) with the same 9 synthetic accounts (`collector1`–`collector6`, `staff_crybaby`, `staff_crybaby2`, `staff_labubu`) and the private credentials shared via DM *(which match the local `docker-compose.yml` / `.env.example` seeded values)*.
* **Browser Storage (`localStorage`):** Never open two Incognito/Private windows of the same browser for two accounts simultaneously — use **Normal Profile 1 + 1 Incognito Window** (plus Profile 2 or a 2nd browser app for 3-actor scenarios).
* **Easy Local Reset Anytime:** If you want to wipe local test tickets and restore a clean seeded DB between exploratory checks:
  ```bash
  docker compose down -v
  docker compose up -d
  ```
* **Security Hygiene:** When capturing terminal outputs, DevTools Network tabs, or screenshots, **always mask passwords and `Authorization: Bearer ...` tokens**.

---

## 4. What to Test in This Blind Exploration Round

Per the instructor's clarification, **please do not only repeat the 9 scripted cases (`UAT-01`–`UAT-09`)**. Explore the full agreed **Sprint 1 (`F-01`–`F-04`)** requirements (`FR-01`–`FR-10`, `BR-01`–`BR-09`, `AC-01`–`AC-39`) thoroughly, especially:

1. **Input Validation & Invalid / Incomplete Inputs *(Both Web UI & API)*:**
   * Test missing fields, empty strings `""`, whitespace-only strings `"   "`, malformed JSON, unexpected data types, and invalid UUID formats across **all** user forms and API endpoints (`/api/auth/*`, `/api/series`, `/api/tickets/*`, `/api/staff/*`).
   * Verify that the UI displays clear validation feedback before/on submission and that the API rejects invalid inputs cleanly with **`400 VALIDATION_ERROR`** rather than `500 Internal Server Error`, silent failure, or wrong status codes.
2. **Boundary Conditions & Unusual User Actions:**
   * Test closed series, duplicate joins (same series & cross-series), rapid/repeated clicks, page reloads (`F5`), browser back/forward navigation mid-flow, and post-completion ticket inspection.
3. **Access Restrictions & State Transitions:**
   * Test unauthenticated requests (`401`), wrong roles (`403`), cross-collector ownership (`403`), cross-series staff (`403`), same-series non-handler staff (`403`), revoked JWT replay after logout (`401`), and invalid state skips (`400 INVALID_STATE_TRANSITION`).

> [!NOTE]
> **Reminder — Sprint 2/3 & Disclosed Exclusions Still Apply:**
> Please still treat intentional Sprint 2/3 features listed in [POPQUEUE_UAT_HANDOFF.md §1.3](https://github.com/apfirst13/PopQueue_BFteam/blob/lab6-docs/docs/labs/lab6/handoff/POPQUEUE_UAT_HANDOFF.md#L40-L57) (`F-05` Cancel, `F-06` No-Show auto-expiry, `F-07` Public Board, `NFR-07` Login Rate Limit, `120s` display-only countdown resetting on refresh) as out-of-scope / documented limitations rather than new defects.

---

## 5. How to Report Any Defect Found (Lab 6 Part C)

When you discover a failure or deviation from the Sprint 1 specification, please file a **GitHub Issue** at `https://github.com/apfirst13/PopQueue_BFteam/issues/new` (choose the **Defect** template if prompted, or use the structure below):

* **Title:** Short symptom-based summary *(e.g., `[Defect] <Endpoint/Screen>: <Observed unexpected behavior>`)*
* **Affected Requirement / AC:** `<Feature F-01..F-04> / <FR-01..10 or BR-01..09> / <AC-01..39>`
* **Environment & Tested Commit:** `Local Docker Compose (http://localhost:5173)` · Branch `defect/lab6-reintroduce-validation` · Exact Commit SHA from `git rev-parse HEAD`
* **Preconditions & Actors:** Account(s) / queue state before the step
* **Steps to Reproduce:** Exact UI inputs clicked/typed and/or exact HTTP request (`Method`, `URL`, `Headers` with masked token, `Body`)
* **Expected Result vs. Actual Result:** What Sprint 1 spec requires vs. exact HTTP status, JSON response body, or UI behavior observed
* **Severity (`Critical` / `Major` / `Minor`) & User Impact Rationale**
* **Evidence:** Readable screenshot(s) or terminal/DevTools excerpt (**passwords & Bearer tokens masked!**)

---

## 6. What Happens Next (Part D Fix, Deployment & Final Live Re-test)

1. Once your Issue is filed, **BFteam** will triage it, branch `fix/<issue#>-...` from `defect/lab6-reintroduce-validation`, reproduce it with a failing automated test (**RED**), implement the fix (**GREEN**) + full regression, merge into `lab5-staging` via teammate PR review and passing CI, and then merge `lab5-staging → main`.
2. GitHub Actions (`deploy.yml`) will automatically build and **deploy the corrected release to live Cloud Run (`https://popqueue-5now4hkvsa-as.a.run.app`)**.
3. BFteam will send you the **new `main` Commit SHA** and confirm Cloud Run is updated and drained (`waitingCount = 0`).
4. **Final Re-test:** Your team performs **Independent Re-test directly on live Cloud Run (`https://popqueue-5now4hkvsa-as.a.run.app`)** *(no local Docker needed for the final re-test!)*, verifies the defect is resolved plus core regression sanity, and records the final **Sprint 1 Acceptance Decision**!
