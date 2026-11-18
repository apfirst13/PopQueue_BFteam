# PopQueue — Sprint 1 Independent UAT Plan & Handoff Guide (Part A)

> **Product Team:** **BFteam** — CPE 334 (Section 1), Semester 1/2026, KMUTT  
> **Team Members:** นายธีรวัฒญ์ รุ่งสว่าง (`67070507206`, `@Theerawat82`) · นายอภิวัชร์ ปัณฐธนาพัฒน์ (`67070507209`, `@apfirst13`)  
> **Product / Theme:** **PopQueue** — Theme 9: Queue and Service Management System (*Art Toy Live Unboxing Station*)  
> **Document Role:** Complete Part A Executable UAT Plan & Safe Handoff Package for the Partner UAT Team  
> **Security Rule:** Passwords are supplied **privately** outside Git and PDFs (`SEED_COLLECTOR_PASSWORD` / `SEED_STAFF_PASSWORD`). **Never commit or paste real passwords or unmasked `Authorization: Bearer ...` tokens into issue reports, logs, or PDF screenshots.**

---

## 1. Handoff Identity, Live Environment & Accepted-for-Test Scope

### 1.1 Target Release & Environment Under Test
| Item | Exact Value to Verify Before Starting |
| :--- | :--- |
| **Live Service URL (Primary)** | `https://popqueue-5now4hkvsa-as.a.run.app` |
| **Live Service URL (Regional)** | `https://popqueue-902539659249.asia-southeast1.run.app` |
| **Public Repository** | `https://github.com/apfirst13/PopQueue_BFteam` *(branch/tags public for corroboration)* |
| **Sprint 1 Accepted Release Tag** | `v0.1.0-sprint1` (`d946159`) |
| **Lab 5 Deployed Baseline Tag** | `v0.2.0-lab5` (`bf52c9b` / full SHA `bf52c9b969d905ba6f21bcc22a460f0db3dd5172`) |
| **Liveness Check** | `GET /api/health` → `200 {"status":"ok","commit":"bf52c9b969d905ba6f21bcc22a460f0db3dd5172"}` |
| **Readiness Check** | `GET /api/ready` → `200 {"db":"connected"}` |
| **UI Footer Badge** | All pages show `PopQueue v0.2.0-lab5 • Commit: bf52c9b` |

### 1.2 Accepted-for-Test Sprint 1 Scope (`F-01`–`F-04`)
UAT validates ONLY the delivered **Sprint 1** contract (`docs/sprints/sprint-1/PopQueue_Deliverable_1_Master.md`):

* **`F-01` Authentication & Role Identity (`FR-01`, `FR-02`, `BR-04`, `NFR-01`, `NFR-02`):** Login with `username`/`password` (NOT email), 8h HS256 JWT in `localStorage`, immediate server-side revocation on logout (`tokenVersion` increment), `/api/auth/me` profile + `assignedSeries`, backend Role enforcement.
* **`F-02` Queue Discovery & Safe Joining (`FR-03`, `FR-04`, `BR-01`, `BR-02`, `BR-09`, `NFR-06`):** Public `GET /api/series`, Collector queue joining with per-series daily sequential numbers (`Asia/Bangkok`), active-series check (`SERIES_CLOSED`), system-wide single active ticket per Collector (`DUPLICATE_ACTIVE_QUEUE`), mobile-first UI (`375×667`).
* **`F-03` Box Master Service Counter (`FR-07`–`FR-10`, `BR-03`–`BR-07`):** Series-isolated staff queue view (`activeServing` + FIFO `waitingQueue`), `Call Next` (`WAITING → CALLED` + `STAFF_BUSY` guard), handler-only `Verify & Start Unboxing` (`CALLED → UNBOXING`), handler-only `Complete` (`UNBOXING → COMPLETED`), strict transition guards (`INVALID_STATE_TRANSITION`).
* **`F-04` Ticket Inspection & Ownership (`FR-05`, `FR-06`, `BR-04`):** Live 3-second polling on `/my-ticket` (`waitingAhead` + status updates), `GET /api/tickets/:id` ownership/series-scope isolation and completed timestamp history retrieval.
* **Automated-Only Sprint 1 Guarantees (`NFR-03`–`NFR-05`):** 50-user concurrent join numbering (`NFR-03`), 10-request single-user race protection (`NFR-04`), and PostgreSQL container restart persistence (`NFR-05`) are part of the Sprint 1 contract and are verified via automated Vitest suites & `scripts/test-persistence.mjs` (see **Section 6** — do **not** attempt container restarts or load floods on the shared live Cloud Run instance).

### 1.3 Explicit Non-Sprint-1 Exclusions & Disclosed Sprint 1 Behaviors
Please **do not log the following intentional Sprint 2/3 items or permanent exclusions as Sprint 1 defects**:

1. **Deferred to Sprint 2 / Sprint 3 (Not Implemented in `v0.2.0-lab5`):**
   * Collector queue cancellation (`F-05` / `FR-11`)
   * Server-enforced 120-second `Mark No-Show` (`F-06` / `FR-12` / `BR-08`)
   * Unauthenticated Public Queue Display Board `/public/board` (`F-07` / `FR-13`)
   * Daily Service Analytics (`F-08` / `FR-14`) & Box Master series open/close toggle UI (`F-09` / `FR-15`)
   * Login brute-force rate limiting (`S3-HARDEN` / `NFR-07`)
2. **Permanent Exclusions (Out of Scope for PopQueue):**
   * Advance booking, online payment / cashier receipt verification, shipping/delivery, self-registration / password reset, SMS / LINE notifications.
3. **Disclosed Sprint 1 Runtime Behaviors:**
   * **Display-Only Countdown & Refresh Behavior (`MyTicketPage.tsx` & `CountdownTimer.tsx`):** Per `PopQueue_Deliverable_1_Master.md` (lines 61, 951, 1229), the `120s` countdown when `CALLED` is display-only in Sprint 1 (no automatic no-show expiry). **In the current implementation, the countdown ring always initializes at `02:00` when the component mounts or when `/my-ticket` is refreshed** (it does not compute elapsed seconds from `calledAt`).
   * **Polling Latency Tolerance:** Both `/my-ticket` and `/staff/counter` poll every `3` seconds (`usePolling.ts`); allow up to **`3–10` seconds** for automatic UI updates over live network round-trips.
   * **Cloud Run Cold Start:** Cloud Run runs with `min-instances=0`; the very first request after idle periods may take several seconds to wake up (this is normal Lab 5 infra behavior, not a Sprint 1 bug unless repeated 5xx/timeouts occur).
   * **Completed Tickets Exit `/my-ticket` (`AC-35` / `AC-36`):** Once staff clicks `"เสร็จสิ้น (Complete)"`, `GET /api/tickets/my-ticket` returns `404 NO_ACTIVE_TICKET` and `/my-ticket` displays `"ยังไม่มีบัตรคิว"`. Completed ticket details remain permanently retrievable via `GET /api/tickets/:id`.

---

## 2. Synthetic Accounts, Seeded Series & Private Credential Handoff

No `QueueTicket` rows are seeded in the baseline database.

### 2.1 Seeded Series (3)
| Code | Series Name | `isActive` | Current Live UUID *(Verify via `GET /api/series`)* | Purpose |
| :---: | :--- | :---: | :--- | :--- |
| **`CRY`** | Crybaby Sunset Concert | `true` | `c15d6745-97aa-4784-a38a-da06c09817be` | Primary active test series |
| **`LAB`** | Labubu Macaron | `true` | `c01fc3db-99f4-4490-b633-7a3829756a25` | Cross-series isolation & duplicate-join test |
| **`SKP`** | Skullpanda Closed Demo | `false` | `057416e7-1fa4-4214-8cb2-e817dbab4a01` | Closed-series rejection test (`SERIES_CLOSED`) |

### 2.2 Safe Test Accounts (9 Synthetic Users)
> **Credential Delivery:** Real passwords are shared privately via **LINE / Discord / Instagram DM** (contact `@Theerawat82` or `@apfirst13` to request credentials). Sign in using **`username`** (NOT email).

| Username | Role | Full Name | Assigned Series | Dedicated UAT Responsibility |
| :--- | :---: | :--- | :---: | :--- |
| `collector1` | `COLLECTOR` | `Collector 1` | `[]` | `UAT-01`, `UAT-02`, `UAT-03` (first join), `UAT-09` |
| `collector2` | `COLLECTOR` | `Collector 2` | `[]` | `UAT-03` (second join), `UAT-04` (`SKP`/duplicate), `UAT-05` |
| `collector3` | `COLLECTOR` | `Collector 3` | `[]` | `UAT-04` (non-leak check), `UAT-06` (**logout revocation**), `UAT-07` (**re-login** ticket owner) |
| `collector4` | `COLLECTOR` | `Collector 4` | `[]` | `UAT-07` (unauthorized viewer `FORBIDDEN_OWNERSHIP`) |
| `collector5` | `COLLECTOR` | `Collector 5` | `[]` | `UAT-08` (session persistence & `COMPLETED` lookup) |
| `collector6` | `COLLECTOR` | `Collector 6` | `[]` | `UAT-08` (post-completion sequential number non-reuse) |
| `staff_crybaby` | `BOX_MASTER` | `Staff Crybaby` | `CRY` | Primary `CRY` counter handler |
| `staff_crybaby2` | `BOX_MASTER` | `Staff Crybaby 2` | `CRY` | `UAT-07` non-handler test (`FORBIDDEN_NOT_HANDLER`) |
| `staff_labubu` | `BOX_MASTER` | `Staff Labubu` | `LAB` | `UAT-01`, `UAT-05` (`EMPTY_QUEUE`), `UAT-07` (`FORBIDDEN_SERIES`) |

---

## 3. Mandatory Execution Rules, Browser Isolation & Queue Recovery Runbook

### 3.1 Strict Execution Order (`UAT-01 → UAT-02 → UAT-03 → UAT-04 → UAT-05 → UAT-06 → UAT-07 → UAT-08 → UAT-09`)
Because the live Cloud Run database (`popqueue-pg`) persists queue tickets across tests (`Call Next` is strictly FIFO and Sprint 1 has no `Cancel` feature), **execute the 9 cases strictly in numerical order `UAT-01` → `UAT-09`**, and **always complete the cleanup step at the end of every case**.

### 3.2 Pre-UAT Queue Check (Run Before `UAT-01`)

> [!NOTE]
> **For the Partner UAT Team:** The **BFteam Product Team** has already drained all queues to `waitingCount = 0` before this handoff (see `docs/labs/lab6/evidence/a-preuat-clean.png`). The steps below are for your **verification only** — please confirm the clean state before starting `UAT-01`, but do **not** attempt to drain the queue yourself.

1. Open `https://popqueue-5now4hkvsa-as.a.run.app/api/series` in a browser or `curl`. Confirm `waitingCount` is `0` for both `CRY` and `LAB`.
2. Log in briefly as `staff_crybaby` (`/staff/counter`) and `staff_labubu` and verify Current Serving shows `"ยังไม่มีคิวที่กำลังให้บริการ"` and Waiting Queue shows `"ยังไม่มีคิวรอรับบริการ"`.
3. If any leftover ticket exists (e.g., from an earlier run), complete it first using the Recovery Runbook (§3.4) before starting `UAT-01`.
4. **Dynamic Numbering Note:** Because `QueueCounter` does not reset mid-day, **never assume the first ticket is `CRY-001`**; record the actual number displayed as **`CRY-N`** and verify subsequent sequential increment **`CRY-(N+1)`** while no external user joins in between.

### 3.3 Browser Storage & Multi-Session Rules (`D-11`)
* Tokens are stored in browser **`localStorage`** under keys **`popqueue_token`** and **`popqueue_user`**.
* Calling `logout` increments `User.tokenVersion` in PostgreSQL, **immediately invalidating ALL existing JWTs for that user across every tab/device**.
* **⚠️ NEVER open two Incognito/Private windows of the SAME browser for two different accounts at the same time:** multiple Incognito windows in one browser share the same Incognito `localStorage` container and overwrite each other!
* **Correct Multi-Session Setup:**
  * **2 simultaneous UI accounts (`UAT-02`, `UAT-09`):** **Normal Browser Profile 1** + **1 Incognito/Private Window**
  * **3 simultaneous UI accounts (`UAT-03`):** **Browser Profile 1** + **Browser Profile 2 (or a second browser app such as Edge/Firefox)** + **1 Incognito Window**
* Do **not** have two testers log into the same account concurrently.

### 3.4 Queue Recovery Runbook (If an Account Gets Stuck Mid-Testing)
| Stuck Symptom | Recovery Steps (No DB Reset Needed!) |
| :--- | :--- |
| Box Master sees disabled `"เรียกคิวถัดไป (Call Next)"` or API `409 STAFF_BUSY` | Log in as that Box Master on `/staff/counter` → inspect the **Current Serving** card → if `CALLED`, click `"Verify & Start Unboxing"`, then click `"เสร็จสิ้น (Complete)"`. |
| Collector cannot join (`409 DUPLICATE_ACTIVE_QUEUE`) | Check `/my-ticket` (or `GET /api/tickets/my-ticket`) to see which series (`CRY` or `LAB`) holds the active ticket → have that series's Box Master call next FIFO and complete tickets until cleared. |

---

## 4. Self-Contained API Discovery & Helper Commands

Some negative, boundary, and security assertions (`UAT-04`, `UAT-05`, `UAT-06`, `UAT-07`, `UAT-08`) require direct HTTP API calls because the UI prevents disabled actions (e.g., closed `SKP` button, disabled `Call Next` when busy) or redirects routes. Use any REST client (Postman/Insomnia/`curl`) with the steps below.

> **🔒 Masking Reminder:** When capturing DevTools Network tabs or terminal outputs for evidence, **always mask `<PASSWORD>` and `Authorization: Bearer ...` tokens**.

### Step A — Discover Live `seriesId` UUIDs (Public, No Token Needed)
```bash
curl -s https://popqueue-5now4hkvsa-as.a.run.app/api/series
```
From `data[]`, note the `"id"` UUID for `"code": "CRY"`, `"LAB"`, and `"SKP"`.

### Step B — Obtain a Role JWT Token
**Option 1 (API):**
```bash
curl -s -X POST https://popqueue-5now4hkvsa-as.a.run.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"collector3","password":"<PASSWORD>"}'
```
Copy `data.token` from the JSON response.

**Option 2 (Browser DevTools after UI login):** Open DevTools (`F12`) → **Console** → run:
```javascript
localStorage.getItem('popqueue_token')
```
*(Or copy `popqueue_token` from Application → Local Storage).*

### Step C — Obtain `ticketId` UUID
* After clicking `"เข้าคิว (Join Queue)"` in UI, call `GET /api/tickets/my-ticket` and read **`data.ticket.id`**:
```bash
curl -s https://popqueue-5now4hkvsa-as.a.run.app/api/tickets/my-ticket \
  -H "Authorization: Bearer <COLLECTOR_JWT>"
```
* Or if joining via API (`POST /api/tickets/join`), read **`data.ticketId`** directly from the `201` response.

*(PowerShell tip: Use `curl.exe` on Windows so flags like `-X`, `-H`, `-d` behave identically to the bash examples above, or use `Invoke-RestMethod`.)*

---

## 5. Executable Sprint 1 UAT Cases (`UAT-01` – `UAT-09`)

---

### `UAT-01` — Public Series Discovery & Authenticated Identity Profile
* **Category:** *(Pre-Journey Discovery & Identity Check)* | **Req / AC:** `FR-02`, `FR-03` · **`AC-06`**, **`AC-09`**
* **Purpose:** Verify unauthenticated users can inspect all 3 seeded series without PII leakage, and `/api/auth/me` returns accurate roles and `assignedSeries`.
* **Actors & Setup:** Unauthenticated public browser/client; sequential API login checks with `collector1`, `staff_crybaby`, `staff_labubu` (**do NOT click logout**).
* **Preconditions:** Baseline queue drained (`CRY` and `LAB` `waitingCount = 0`).
* **Synthetic Inputs:** Usernames `collector1`, `staff_crybaby`, `staff_labubu` + private passwords.

**Steps & Expected Results:**
1. Without logging in, call `GET https://popqueue-5now4hkvsa-as.a.run.app/api/series` (you can also view `/series` later after Collector login in `UAT-02`).  
   → **Expected:** `200 OK`; `data` lists 3 series: `CRY` (`isActive: true`, `waitingCount: 0`), `LAB` (`isActive: true`, `waitingCount: 0`), `SKP` (`isActive: false`, `waitingCount: 0`). No `username` or `fullName` appears anywhere.
2. Call `POST /api/auth/login` then `GET /api/auth/me` with `Bearer` token for each account in sequence:  
   a. `collector1` → **Expected:** `200 OK`; `data.role = "COLLECTOR"`, `data.assignedSeries = []`.  
   b. `staff_crybaby` → **Expected:** `200 OK`; `data.role = "BOX_MASTER"`, `data.assignedSeries` contains **only** `CRY`.  
   c. `staff_labubu` → **Expected:** `200 OK`; `data.role = "BOX_MASTER"`, `data.assignedSeries` contains **only** `LAB`.
* **Post-Case State:** `CRY`/`LAB` `waitingCount = 0`; zero active tickets created.

---

### `UAT-02` — Normal End-to-End Domain Journey (2 Concurrent Sessions + Live Polling)
* **Category:** **1. Normal Domain Journey** | **Req / AC:** `FR-01`, `FR-04`, `FR-05`, `FR-08`, `FR-09`, `FR-10` · **`AC-01`**, **`AC-10`**, **`AC-22`**, **`AC-26`**, **`AC-27`**, **`AC-33`**, **`AC-34`**
* **Purpose:** Validate the core live unboxing journey across Collector and Box Master browser UIs without manual reload.
* **Actors & Setup:** **Window A (Normal Profile):** `collector1` | **Window B (1 Incognito Window):** `staff_crybaby`.
* **Preconditions:** `UAT-01` complete; `CRY` has `waitingCount = 0`; `staff_crybaby` has no active serving ticket (`"ยังไม่มีคิวที่กำลังให้บริการ"`).

**Steps & Expected Results:**
1. In **Window A**, open `/login`. Enter `collector1` and password, click `"เข้าสู่ระบบ (Sign In)"`.  
   → **Expected:** Redirects to `/series`. Header shows `"Collector 1"`, badge `COLLECTOR`. Cards show `CRY` & `LAB` (`"เปิดให้บริการ"` + `"เข้าคิว (Join Queue)"`), `SKP` (`"ปิดรับคิว"` + disabled button `"ปิดรับคิว"`).
2. In **Window B (Incognito)**, open `/login`. Sign in as `staff_crybaby`.  
   → **Expected:** Redirects to `/staff/counter`. Header shows `"Staff Crybaby"`, badge `BOX_MASTER`. Current Serving is empty; Waiting Queue shows `"ยังไม่มีคิวรอรับบริการ"`.
3. In **Window A**, click `"เข้าคิว (Join Queue)"` on **Crybaby Sunset Concert (`CRY`)**.  
   → **Expected:** Navigates to `/my-ticket`. Record displayed ticket number as **`CRY-N`**. Badge shows **`WAITING`**, box shows **`"เหลืออีก 0 คิวก่อนหน้า"`**, stepper highlights `เข้าคิว`.
4. Wait up to `3–10` seconds in **Window B** (no manual refresh).  
   → **Expected:** Waiting Queue displays **`CRY-N`** with `"(Collector 1)"`, badge `คิวถัดไป` and `WAITING`.
5. In **Window B**, click **`"เรียกคิวถัดไป (Call Next)"`**.  
   → **Expected:** Window B moves `CRY-N` into Current Serving with status badge **`CALLED`** and button **`"Verify & Start Unboxing"`** (`Call Next` button becomes disabled with note `"* ต้องเสร็จสิ้นคิวปัจจุบันก่อนจึงจะเรียกคิวถัดไปได้"`).
6. Watch **Window A** for up to **`3–10` seconds without reloading**.  
   → **Expected:** `/my-ticket` updates automatically via polling to badge **`CALLED`**, orange alert **`"ถึงคิวแล้ว กรุณามาที่เคาน์เตอร์"`**, and countdown timer ring starting at `02:00`.
7. In **Window B**, click **`"Verify & Start Unboxing"`**. Watch Window A (`3–10s`).  
   → **Expected:** Window B status changes to **`UNBOXING`** and button changes to **`"เสร็จสิ้น (Complete)"`**. Window A updates automatically to badge **`UNBOXING`** and **`"กำลังให้บริการ"`**.
8. In **Window B**, click **`"เสร็จสิ้น (Complete)"`**. Watch Window A (`3–10s`).  
   → **Expected:** Window B Current Serving returns to `"ยังไม่มีคิวที่กำลังให้บริการ"` and `Call Next` re-enables. Window A updates automatically to **`"ยังไม่มีบัตรคิว"`** (`404 NO_ACTIVE_TICKET`).
* **Post-Case State (Verify Before `UAT-03`):** Both Window B Waiting Queue and Current Serving are empty; `collector1` has no active ticket. Keep Window A & B signed in if proceeding straight to `UAT-03`.

---

### `UAT-03` — Multi-User FIFO Queue Ordering & Live `waitingAhead` Decrement
* **Category:** **1 + 2. Normal Multi-User Flow & FIFO Business Rule** | **Req / AC:** `FR-05`, `FR-08`, `FR-10`, `BR-01` · **`AC-10`**, **`AC-18`**, **`AC-22`**, **`AC-27`**, **`AC-34`**
* **Purpose:** Verify FIFO ordering across multiple collectors, accurate `waitingAhead` calculation, and automatic UI decrement when an earlier customer is called.
* **Actors & Setup (3 Separate UI Contexts Required):** **Profile 1:** `collector1` | **Profile 2 (or 2nd Browser App):** `collector2` *(do NOT substitute `curl` here — UI polling check required!)* | **1 Incognito Window:** `staff_crybaby`.
* **Preconditions:** `CRY` is empty (`waitingCount = 0`); `staff_crybaby` idle; no external tester joins during steps 1–5.

**Steps & Expected Results:**
1. **`collector1`** clicks `"เข้าคิว (Join Queue)"` on `CRY`.  
   → **Expected:** Receives **`CRY-N`**, `WAITING`, `"เหลืออีก 0 คิวก่อนหน้า"`. (From `UAT-02`, **`N`** is strictly higher than the previous completed number — non-reuse).
2. **`collector2`** signs in (Profile 2) and clicks `"เข้าคิว (Join Queue)"` on `CRY`.  
   → **Expected:** Receives **`CRY-(N+1)`**, `WAITING`, **`"เหลืออีก 1 คิวก่อนหน้า"`**.
3. Wait `3–10s` in **`staff_crybaby`**'s Waiting Queue panel.  
   → **Expected:** `"รายการคิวรอ (2 คิว)"` shows **`CRY-N`** at the top (`คิวถัดไป`) followed by **`CRY-(N+1)`** below it.
4. **`staff_crybaby`** clicks **`"เรียกคิวถัดไป (Call Next)"`**. Wait `3–10s` on **`collector2`**'s screen (no refresh).  
   → **Expected:** Staff serves **`CRY-N`** (`CALLED`), **NOT** `CRY-(N+1)`. **`collector2`**'s `/my-ticket` updates automatically to **`"เหลืออีก 0 คิวก่อนหน้า"`**.
5. **`staff_crybaby`** completes **`CRY-N`** (`Verify & Start Unboxing` → `เสร็จสิ้น (Complete)`), then clicks **`"เรียกคิวถัดไป (Call Next)"`** again, and completes **`CRY-(N+1)`** (`Verify & Start Unboxing` → `เสร็จสิ้น (Complete)`).  
   → **Expected:** Second `Call Next` calls **`CRY-(N+1)`**; both complete cleanly.
* **Post-Case State:** `CRY` queue empty (`waitingCount = 0`), `staff_crybaby` idle, `collector1` and `collector2` free.

---

### `UAT-04` — Closed Series (`SKP`), Single-Active Duplicate Rejection (`BR-02`) & Zero Counter Leak
* **Category:** **2. Business Rule & Boundary Case** | **Req / AC:** `FR-04`, `BR-01`, `BR-02`, `BR-09` · **`AC-11`** *(incl. counter non-leak)*, **`AC-12`**, **`AC-19`**
* **Purpose:** Verify closed series rejection cleanly before holding an active ticket, enforce system-wide 1-active-ticket-per-collector across UI & API, and prove rejected duplicates do not waste queue numbers.
* **Actors & Setup:** `collector2` (UI + API), `collector3` (API/UI for post-duplicate number check), `staff_crybaby` (cleanup).
* **Preconditions:** `CRY` and `LAB` empty (`waitingCount = 0`); **`collector2` currently has NO active ticket**.

**Steps & Expected Results:**
1. **Closed Series Check FIRST (`AC-12`):**  
   a. On `/series` as `collector2`, inspect `SKP` (*Skullpanda Closed Demo*). → **Expected:** Badge shows `"ปิดรับคิว"` and button `"ปิดรับคิว"` is disabled.  
   b. Call API with `collector2`'s JWT using `SKP`'s UUID:
   ```bash
   curl -i -X POST https://popqueue-5now4hkvsa-as.a.run.app/api/tickets/join \
     -H "Authorization: Bearer <COLLECTOR2_JWT>" \
     -H "Content-Type: application/json" \
     -d '{"seriesId":"057416e7-1fa4-4214-8cb2-e817dbab4a01"}'
   ```
   > *(UUIDs above were verified from `GET /api/series` at the time of this handoff. Please re-verify with `GET /api/series` if re-deployed before use.)*
   → **Expected:** `409 Conflict` with `error.code = "SERIES_CLOSED"`; `SKP` `waitingCount` stays `0`.
2. **Join Active Series (`collector2`):** On `/series`, click `"เข้าคิว (Join Queue)"` on `CRY`. Note the exact number **`CRY-N`**.
3. **Duplicate Join Attempt — UI & Same/Other Series (`AC-11`, `AC-19`):**  
   a. Click `"ดูซีรีส์"` in top/bottom nav to return to `/series`, and click `"เข้าคิว (Join Queue)"` on `CRY` again.  
      → **Expected:** Red `<ErrorAlert>` renders **`[DUPLICATE_ACTIVE_QUEUE] User already has an active queue ticket`**; redirects/remains single ticket **`CRY-N`**.  
   b. Call `POST /api/tickets/join` with `LAB`'s UUID (`c01fc3db-99f4-4490-b633-7a3829756a25`) using `collector2`'s JWT.  
      → **Expected:** `409 Conflict` with `error.code = "DUPLICATE_ACTIVE_QUEUE"`; `LAB` `waitingCount` remains `0`.
4. **Cleanup & Zero Counter Leak Proof (`AC-11`):**  
   a. `staff_crybaby` completes `collector2`'s **`CRY-N`** (`Call Next` → `Verify & Start Unboxing` → `เสร็จสิ้น (Complete)`).  
   b. With no other joins in between, **`collector3`** immediately joins `CRY` (`POST /api/tickets/join` or UI).  
      → **Expected:** `collector3` receives **`CRY-(N+1)`** *(exact next integer after `N`, proving the two rejected `409` calls did NOT leak/consume `QueueCounter` numbers!)*.  
   c. `staff_crybaby` completes `collector3`'s **`CRY-(N+1)`** (`Call Next` → `Verify & Start Unboxing` → `เสร็จสิ้น (Complete)`).
* **Post-Case State:** `CRY` & `LAB` empty (`0`), `staff_crybaby` idle, `collector2` & `collector3` free.

---

### `UAT-05` — Staff Business Rules (`EMPTY_QUEUE`, `STAFF_BUSY`) & State Machine Guards
* **Category:** **2. Business Rule & Boundary Case** | **Req / AC:** `BR-03`, `BR-06`, `FR-08` · **`AC-23`**, **`AC-24`**, **`AC-28`** *(partial transitions)*
* **Purpose:** Verify empty-queue handling, single-active-serving lock per staff member, and strict rejection of out-of-order state transitions.
* **Actors & Setup:** `collector2` (temporary ticket), `staff_labubu`, `staff_crybaby`.
* **Preconditions:** Both `LAB` and `CRY` are empty (`0`); all staff idle.

**Steps & Expected Results:**
1. **Empty Queue (`AC-23`):** As `staff_labubu`, inspect `/staff/counter` (`"ยังไม่มีคิวรอรับบริการ"`) and call API:
   ```bash
   curl -i -X POST https://popqueue-5now4hkvsa-as.a.run.app/api/staff/call-next \
     -H "Authorization: Bearer <STAFF_LABUBU_JWT>" \
     -H "Content-Type: application/json" \
     -d '{"seriesId":"c01fc3db-99f4-4490-b633-7a3829756a25"}'
   ```
   → **Expected:** `404 Not Found` with `error.code = "EMPTY_QUEUE"`.
2. **`STAFF_BUSY` Lock (`AC-24`):**  
   a. Have `collector2` join `CRY` (save `<TICKET_ID>`).  
   b. As `staff_crybaby`, click `"เรียกคิวถัดไป (Call Next)"` (ticket is now `CALLED`). Observe UI button `"เรียกคิวถัดไป (Call Next)"` is **disabled**.  
   c. Call `POST /api/staff/call-next` `{ "seriesId": "<CRY_UUID>" }` with `staff_crybaby`'s JWT.  
      → **Expected:** `409 Conflict` with `error.code = "STAFF_BUSY"`.
3. **Invalid State Transitions (`AC-28`):**  
   a. While `<TICKET_ID>` is still `CALLED`, call `POST /api/staff/tickets/<TICKET_ID>/complete` with `staff_crybaby`'s JWT (skipping `UNBOXING`).  
      → **Expected:** `400 Bad Request` with `error.code = "INVALID_STATE_TRANSITION"`; UI still shows `CALLED`.  
   b. Complete the ticket legitimately via UI (`"Verify & Start Unboxing"` → `"เสร็จสิ้น (Complete)"`).  
   c. Once `<TICKET_ID>` is `COMPLETED`, call `POST /api/staff/tickets/<TICKET_ID>/start-unboxing` with `staff_crybaby`'s JWT.  
      → **Expected:** `400 Bad Request` with `error.code = "INVALID_STATE_TRANSITION"`.
* **Post-Case State:** `CRY` & `LAB` empty (`0`), all staff idle, `collector2` free.

---

### `UAT-06` — Authentication Failures, Full Role Matrix Enforcement & Logout Revocation
* **Category:** **3. Forbidden Role & Security Boundaries** | **Req / AC:** `FR-01`, `FR-04`, `BR-04`, `NFR-02` · **`AC-02`**, **`AC-05`**, **`AC-14`** *(401 + 403)*, **`AC-31`** *(all 4 staff endpoints)*, **`AC-35`** *(staff 403)*
* **Purpose:** Verify uniform credential errors (anti-enumeration), strict backend role guards across all UI routes & API endpoints, unauthenticated rejection on join, and immediate JWT revocation upon logout.
* **Actors & Setup:** **`collector3`** *(dedicated for logout test — will re-login in `UAT-07`)* + `staff_crybaby`.
* **Preconditions:** Queues empty (`0`); **do not create any tickets in this case**.

**Steps & Expected Results:**
1. **Identical Invalid Login Response (`AC-02`):** Send two `POST /api/auth/login` requests:  
   a. `{"username":"collector3","password":"wrong_password_123"}`  
   b. `{"username":"nobody_uat_999","password":"wrong_password_123"}`  
   → **Expected:** Both return `401 Unauthorized` with identical payload `{"error":{"code":"INVALID_CREDENTIALS","message":"Invalid username or password","statusCode":401}}` and no `token`. *(UI login also displays `[INVALID_CREDENTIALS] Invalid username or password`).*
2. **Unauthenticated Join Rejected (`AC-14`):** Call `POST /api/tickets/join` `{ "seriesId": "<CRY_UUID>" }` with **no `Authorization` header**.  
   → **Expected:** `401 Unauthorized` with `error.code = "UNAUTHENTICATED"`; `GET /api/series` confirms `CRY` `waitingCount` remains `0`.
3. **Collector Blocked on Staff UI & ALL 4 Staff API Endpoints (`AC-31`):** Sign in as `collector3`:  
   a. Navigate directly to `/staff/counter` in browser. → **Expected:** Redirects/shows **`/forbidden`** (`"403 - ไม่มีสิทธิ์เข้าถึง"`).  
   b. Call all 4 staff endpoints using `collector3`'s JWT (use placeholder UUID `00000000-0000-0000-0000-000000000000` for `:id`):  
      - `GET /api/staff/tickets`  
      - `POST /api/staff/call-next` `{"seriesId":"c15d6745-97aa-4784-a38a-da06c09817be"}`  
      - `POST /api/staff/tickets/00000000-0000-0000-0000-000000000000/start-unboxing`  
      - `POST /api/staff/tickets/00000000-0000-0000-0000-000000000000/complete`  
   → **Expected:** **All 4 requests return `403 Forbidden`** with `error.code = "FORBIDDEN_ROLE"`.
4. **Box Master Blocked on Collector UI & Endpoints (`AC-14`, `AC-35`):** Using `staff_crybaby`:  
   a. Navigate directly to `/series` and `/my-ticket` in browser. → **Expected:** Both show **`/forbidden`** (`"403 - ไม่มีสิทธิ์เข้าถึง"`).  
   b. Call `POST /api/tickets/join` `{"seriesId":"<CRY_UUID>"}` and `GET /api/tickets/my-ticket` with `staff_crybaby`'s JWT. → **Expected:** Both return `403 Forbidden` with `error.code = "FORBIDDEN_ROLE"`.
5. **Logout Token Revocation (`AC-05`):**  
   a. Record `collector3`'s current valid JWT `<OLD_JWT>`, verify `GET /api/auth/me` returns `200`.  
   b. Click **`"ออกจากระบบ"`** in UI header (or call `POST /api/auth/logout` with `<OLD_JWT>`). → **Expected:** Redirects to `/login` (`localStorage.getItem('popqueue_token')` is `null`).  
   c. Replay `<OLD_JWT>` against `GET /api/auth/me`. → **Expected:** `401 Unauthorized` with `error.code = "UNAUTHENTICATED"` (old token rejected immediately even before 8h expiry!).
* **Post-Case State:** Queues empty (`0`); `collector3`'s old JWT is revoked (must log in freshly for `UAT-07`).

---

### `UAT-07` — Record Ownership, Series Scope, Handler-Only Verification & Boundary IDs
* **Category:** **3. Ownership & Multi-Staff Authorization** | **Req / AC:** `FR-06`, `FR-07`, `BR-04`, `BR-05`, `BR-07` · **`AC-21`**, **`AC-25`**, **`AC-29`**, **`AC-30`**, **`AC-37`**, **`AC-38`**
* **Purpose:** Verify record-level isolation across collectors (`FORBIDDEN_OWNERSHIP`), across staff series (`FORBIDDEN_SERIES`), and between two staff members assigned to the *same* series (`FORBIDDEN_NOT_HANDLER`), plus `404`/`400` validation boundaries on `/api/tickets/:id`.
* **Actors & Setup:** **`collector3` (MUST sign in again for a fresh JWT!)**, `collector4`, `staff_crybaby`, `staff_crybaby2`, `staff_labubu`.
* **Preconditions:** Queues empty (`0`).

**Steps & Expected Results:**
1. **Setup Ticket:** `collector3` signs in **freshly** (verifying re-login works after `UAT-06` logout!) and joins `CRY`. Record `<TICKET_ID>` from `GET /api/tickets/my-ticket`.
2. **Staff Series List Isolation (`AC-21`):** Call `GET /api/staff/tickets` for `staff_crybaby` vs `staff_labubu`.  
   → **Expected:** `staff_crybaby` sees only `CRY` containing `<TICKET_ID>`; `staff_labubu` sees only `LAB` (`waitingQueue: []`) with zero `CRY` tickets.
3. **Ticket Inspection Scope & Boundaries (`AC-37`, `AC-38`):** Call `GET /api/tickets/...` with each specified JWT:  
   a. **`collector4`** → `GET /api/tickets/<TICKET_ID>` → **`403 Forbidden`** (`FORBIDDEN_OWNERSHIP`); response body must NOT reveal `displayNumber`, `status`, or owner name.  
   b. **`staff_crybaby`** → `GET /api/tickets/<TICKET_ID>` → **`200 OK`** (`status: "WAITING"`, `userFullName: "Collector 3"`).  
   c. **`staff_labubu`** → `GET /api/tickets/<TICKET_ID>` → **`403 Forbidden`** (`FORBIDDEN_SERIES`).  
   d. **`staff_crybaby`** → `GET /api/tickets/00000000-0000-0000-0000-000000000000` → **`404 Not Found`** (`RESOURCE_NOT_FOUND`).  
   e. **`staff_crybaby`** → `GET /api/tickets/not-a-uuid` → **`400 Bad Request`** (`VALIDATION_ERROR`).
4. **Cross-Series Staff Action Rejected (`AC-25`, `AC-29`):** With `staff_labubu`'s JWT:  
   - Call `POST /api/staff/call-next` with `CRY` UUID (`c15d6745-97aa-4784-a38a-da06c09817be`)  
   - Call `POST /api/staff/tickets/<TICKET_ID>/start-unboxing` and `.../complete`  
   → **Expected:** All return **`403 Forbidden`** (`FORBIDDEN_SERIES`); `<TICKET_ID>` stays `WAITING`.
5. **Same-Series Non-Handler Rejected (`AC-30`):**  
   a. `staff_crybaby` calls next on `CRY` (acquires `<TICKET_ID>` in `CALLED`, setting `handledByStaffId` = `staff_crybaby`).  
   b. **`staff_crybaby2`** (also assigned to `CRY`, but NOT the handler!) calls `POST /api/staff/tickets/<TICKET_ID>/start-unboxing` and `POST /api/staff/tickets/<TICKET_ID>/complete`.  
      → **Expected:** Both return **`403 Forbidden`** with `error.code = "FORBIDDEN_NOT_HANDLER"`; ticket remains `CALLED` under `staff_crybaby`.
6. **Cleanup:** `staff_crybaby` clicks `"Verify & Start Unboxing"` → `"เสร็จสิ้น (Complete)"` on `<TICKET_ID>`.
* **Post-Case State:** `CRY` & `LAB` empty (`0`), all 3 staff idle, `collector3` free.

---

### `UAT-08` — Cross-Session Persistence, Completed Ticket History & Non-Reusable Numbers
* **Category:** **4. State / History / Persistence** | **Req / AC:** `BR-01`, `FR-05`, `FR-06` · **`AC-18`**, **`AC-34`**, **`AC-35`** *(post-completion 404)*, **`AC-36`**
* **Purpose:** Confirm queue tickets and timestamps persist in PostgreSQL across page reloads/re-logins, completed tickets leave `/my-ticket` while remaining inspectable by ID, and finished numbers are never reused.
* **Actors & Setup:** `collector5`, `collector6`, `staff_crybaby`.
* **Preconditions:** `CRY` empty (`0`); **no outside tester joins between steps 1–4**.

**Steps & Expected Results:**
1. **`collector5`** logs in, joins `CRY`, records **`CRY-N`** and **`<TICKET_ID>`**.  
   - Press **`F5` (reload page)**, then **close tab / reopen browser** to `https://popqueue-5now4hkvsa-as.a.run.app/my-ticket` (or log in again).  
   → **Expected:** Ticket **`CRY-N`** (`WAITING`, `waitingAhead: 0`) persists identically across reload/new session.
2. **`staff_crybaby`** serves **`CRY-N`** through completion (`Call Next` → `Verify & Start Unboxing` → `เสร็จสิ้น (Complete)`).
3. Inspect **`collector5`** after completion:  
   a. Wait `3–10s` (or open `/my-ticket`): → **Expected:** UI shows **`"ยังไม่มีบัตรคิว"`** + link `"เลือกซีรีส์และรับบัตรคิวใหม่"`, and `GET /api/tickets/my-ticket` returns **`404 NO_ACTIVE_TICKET`** (`AC-35`).  
   b. Call `GET /api/tickets/<TICKET_ID>` with `collector5`'s JWT.  
      → **Expected:** **`200 OK`** returning `displayNumber: "CRY-N"`, `status: "COMPLETED"`, and non-null chronological ISO timestamps **`createdAt`**, **`calledAt`**, **`startedAt`**, **`completedAt`** *(and no `userFullName` leakage)* (`AC-36`).
4. **Non-Reuse Check (`AC-18`):** **`collector6`** signs in and joins `CRY` immediately.  
   → **Expected:** Receives **`CRY-(N+1)`** *(NOT `CRY-N`)*.
5. **Cleanup:** `staff_crybaby` serves and completes `collector6`'s `CRY-(N+1)`.
* **Post-Case State:** `CRY` & `LAB` empty (`0`), `staff_crybaby` idle, `collector5` & `collector6` free.

---

### `UAT-09` — Mobile-First Responsive Layout (`375×667`)
* **Category:** *(Usability / NFR Verification)* | **Req / AC:** `NFR-06` · **`AC-20`**
* **Purpose:** Confirm all 4 Sprint 1 UI routes remain readable and usable at `375px` mobile width with zero horizontal overflow.
* **Actors & Setup:** `collector1` + `staff_crybaby`; Browser DevTools Device Toolbar set to **`375 × 667`** (iPhone SE).
* **Preconditions:** `CRY` empty (`0`).

**Steps & Expected Results:**
1. At `375×667`, inspect **`/login`** → check form inputs, button `"เข้าสู่ระบบ (Sign In)"`, no horizontal scrollbar.
2. Log in as `collector1`, inspect **`/series`** (including mobile bottom nav `"ดูซีรีส์"`, `"บัตรคิวของฉัน"`), click `"เข้าคิว (Join Queue)"` on `CRY`, and inspect **`/my-ticket`** (`WAITING`).
3. In a separate window/session at `375×667`, log in as `staff_crybaby`, inspect **`/staff/counter`**, and click **`"เรียกคิวถัดไป (Call Next)"`** → inspect `collector1`'s `/my-ticket` (`CALLED` `120s` countdown `"ถึงคิวแล้ว กรุณามาที่เคาน์เตอร์"`).
4. On `/staff/counter` (`375×667`), click **`"Verify & Start Unboxing"`** (inspect `UNBOXING` state) → **`"เสร็จสิ้น (Complete)"`** to finish `collector1`'s ticket cleanly.
   → **Expected (All 4 screens):** Zero clipped buttons/text, `document.documentElement.scrollWidth <= document.documentElement.clientWidth` (no horizontal overflow).
* **Post-Case State:** `CRY` empty (`0`), `staff_crybaby` idle.

---

## 6. Sprint 1 AC Traceability Split (`AC-01` – `AC-39`)

| Verification Scope | Covered AC IDs | Backing Proof Reference |
| :--- | :--- | :--- |
| **Executed via Independent UAT (`UAT-01`–`UAT-09`) + Automated Suite** | `AC-01`, `AC-02`, `AC-05`, `AC-06`, `AC-09`, `AC-10`, `AC-11`, `AC-12`, `AC-14`, `AC-18`, `AC-19`, `AC-20`, `AC-21`, `AC-22`, `AC-23`, `AC-24`, `AC-25`, `AC-26`, `AC-27`, `AC-28` *(UI/API transition jumps)*, `AC-29`, `AC-30`, `AC-31` *(all 4 routes)*, `AC-33`, `AC-34`, `AC-35`, `AC-36`, `AC-37`, `AC-38` *(all 4 cases)* | Step-by-step manual & API verification in §5 above + server/E2E suites |
| **Verified by Automated / Unit / Concurrency / Infra Tests ONLY *(Not Direct UAT)*** | `AC-03` *(Malformed JSON/Zod)*, `AC-04` *(Parameterized `alg:none`/tampered/expired JWT across all routes)*, `AC-07` *(DB `passwordHash` Bcrypt cost ≥ 10)*, `AC-08` *(`requireRole` unit test)*, `AC-13` *(Join unknown/non-UUID)*, `AC-15` *(50 concurrent distinct joins)*, `AC-16` *(10 concurrent same-user joins)*, `AC-17` *(`Asia/Bangkok` midnight reset via `FakeClock`)*, `AC-28` *(Exhaustive `canTransition()` unit table `TEST-28U`)*, `AC-32` *(2-staff & 5-req `call-next` concurrency)*, `AC-39` *(`NFR-05` DB container restart persistence)* | `server/tests/api/*`, `server/tests/security/*`, `server/tests/unit/*`, `server/tests/concurrency/*`, `scripts/test-persistence.mjs`, and Lab 5 Check `C-05` |

---

## 7. Partner UAT Execution Recording Template *(To Be Completed by Partner UAT Team)*

| Case ID | Tester Name(s) | Date & Time (UTC+7) | Tested Commit / SHA | Actual Inputs / Ticket IDs Used | Observed Actual Result *(Never copy Expected)* | Status (`PASS` / `FAIL` / `BLOCKED`) | Evidence ID |
| :--- | :--- | :--- | :--- | :--- | :--- | :---: | :---: |
| `UAT-01` | | | | | | | |
| `UAT-02` | | | | | | | |
| `UAT-03` | | | | | | | |
| `UAT-04` | | | | | | | |
| `UAT-05` | | | | | | | |
| `UAT-06` | | | | | | | |
| `UAT-07` | | | | | | | |
| `UAT-08` | | | | | | | |
| `UAT-09` | | | | | | | |
