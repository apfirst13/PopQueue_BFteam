# PopQueue Deliverable 2 — Ground-Truth Audit Report (READ-ONLY)
> **Audit Date:** 2026-11-24T19:24:39+07:00  
> **Audited Commit / HEAD:** `75068a6109439b7f5dcadd7713ba93115ab29043` (Branch `sprint-2-docs`)  
> **Production Remote Release Tag:** `v0.3.0-lab7` (`a07a7be732b30cb75a22df7f30edfdc51521a87e`)  
> **Master Specification Audited:** `docs/sprints/sprint-2/PopQueue_Deliverable_2_Master.md`  
> **Audit Policy:** READ-ONLY inspection on repository, test suites, database migrations, and GitHub remote tracking. Zero modifications to code, tests, migrations, or master specifications.

---

## สารบัญการตรวจสอบ (Audit Table of Contents)
1. [บันทึกหลักฐานดิบรายข้อ (Raw Evidence EV-A01 .. EV-A10)](#1-บันทึกหลักฐานดิบรายข้อ-raw-evidence-ev-a01--ev-a10)
2. [หมวดที่ 1: ยืนยันแล้ว (มี EV)](#2-หมวดที่-1-ยืนยันแล้ว-มี-ev)
3. [หมวดที่ 2: ขัดแย้ง (Master vs Repo — แสดงทั้งสองฝั่ง)](#3-หมวดที่-2-ขัดแย้ง-master-vs-repo--แสดงทั้งสองฝั่ง)
4. [หมวดที่ 3: ยืนยันไม่ได้ (NOT RUN)](#4-หมวดที่-3-ยืนยันไม่ได้-not-run)
5. [Evidence Report Table](#5-evidence-report-table)
6. [Self-Audit (การประเมินตนเองอย่างเคร่งครัด)](#6-self-audit-การประเมินตนเองอย่างเคร่งครัด)

---

## 1. บันทึกหลักฐานดิบรายข้อ (Raw Evidence EV-A01 .. EV-A10)

ทุกหัวข้อถูกบันทึกเป็นไฟล์หลักฐานแยกรายข้อในไดเรกทอรี `docs/evidence/EV-A*.txt` ตามกฎเหล็ก R2:

### EV-A01: Release Tags & Git Commit SHAs
- **ไฟล์หลักฐาน:** `docs/evidence/EV-A01.txt`
- **คำสั่ง:**
  ```bash
  git tag -l --format='%(refname:short) %(objectname) %(creatordate:iso)'
  git rev-parse v0.1.0-sprint1 v0.2.0-lab5 v0.3.0-lab7
  git rev-parse "v0.1.0-sprint1^{commit}" "v0.2.0-lab5^{commit}" "v0.3.0-lab7^{commit}"
  ```
- **ผลลัพธ์ดิบ:**
  - `v0.1.0-sprint1`: Tag Object `97d855d7dd300956d3e4409eda865920605a3209`, Commit SHA `d946159ba82a249c195730a3b702cf0f68e96e2d` (ตรงกับ Master บรรทัด 10 และ 36)
  - `v0.2.0-lab5`: Tag Object `0cf07d16c341f6680a5cd6e86a96ba34419f44e6`, Commit SHA `bf52c9b969d905ba6f21bcc22a460f0db3dd5172` (ตรงกับ Master บรรทัด 11)
  - `v0.3.0-lab7`: Tag Object `d9a8ed270f161306d32e12f21f81a4664da33534`, Commit SHA `a07a7be732b30cb75a22df7f30edfdc51521a87e` (ตรงกับ Master บรรทัด 12)

### EV-A02: Database Migrations & Partial Unique Index Predicates
- **ไฟล์หลักฐาน:** `docs/evidence/EV-A02.txt`
- **คำสั่ง:**
  ```bash
  Get-Content server/prisma/migrations/20261101145503_0002_partial_unique_indexes/migration.sql
  Get-Content server/prisma/migrations/20261124143000_0003_per_series_active_ticket_index/migration.sql
  ```
- **SQL ของ Migration 0002 (`server/prisma/migrations/20261101145503_0002_partial_unique_indexes/migration.sql`):**
  ```sql
  -- BR-02: Partial Unique Index for collector active tickets
  CREATE UNIQUE INDEX unique_active_ticket_user ON "QueueTicket"("userId")
  WHERE status IN ('WAITING','CALLED','UNBOXING');

  -- BR-06: Partial Unique Index for staff active ticket handling
  CREATE UNIQUE INDEX unique_active_staff_ticket ON "QueueTicket"("handledByStaffId")
  WHERE status IN ('CALLED','UNBOXING');
  ```
- **SQL ของ Migration 0003 (`server/prisma/migrations/20261124143000_0003_per_series_active_ticket_index/migration.sql`):**
  ```sql
  -- BR-02 (v2 / D-08 / Issue #52, #53): Revise single active ticket to per-series
  -- Zero-gap migration rule: CREATE new unique index first, then DROP the old one.
  CREATE UNIQUE INDEX unique_active_ticket_user_series ON "QueueTicket"("userId", "seriesId")
  WHERE status IN ('WAITING','CALLED','UNBOXING');

  DROP INDEX IF EXISTS unique_active_ticket_user;
  ```
- **การวิเคราะห์ Predicate:**
  - `unique_active_ticket_user_series`: มี predicate `WHERE status IN ('WAITING','CALLED','UNBOXING')`
    - นับสถานะ: `WAITING`, `CALLED`, `UNBOXING`
    - ไม่นับ (Excluded): `COMPLETED`, **`CANCELLED`**, **`NO_SHOW`**
  - `unique_active_staff_ticket`: มี predicate `WHERE status IN ('CALLED','UNBOXING')`
    - นับสถานะ: `CALLED`, `UNBOXING`
    - ไม่นับ (Excluded): `WAITING`, `COMPLETED`, **`CANCELLED`**, **`NO_SHOW`**
- **คำตอบตรงประเด็น (Direct Answer):**
  **`CANCELLED` และ `NO_SHOW` หลุดออกจาก Index ทั้งสองตัว 100% (Excluded from both indexes)**
  - Collector ที่มีตั๋ว `CANCELLED` หรือ `NO_SHOW` สามารถกด join ซีรีส์เดิมได้ทันที ไม่เกิด P2002 Unique Constraint Violation (ยืนยัน AC-41.2 ผ่านทางระดับ Database Constraint)
  - พนักงานที่ตั๋วถูกปรับเป็น `NO_SHOW` (หรือ `CANCELLED`) จะหลุดออกจาก `unique_active_staff_ticket` ทันที และสามารถกด `call-next` ได้ทันทีโดยไม่ติด `409 STAFF_BUSY`

### EV-A03: Prisma Schema Verification
- **ไฟล์หลักฐาน:** `docs/evidence/EV-A03.txt`
- **คำสั่ง:** Line-by-line inspection on `server/prisma/schema.prisma`
- **ผลการตรวจสอบ:**
  - Enum `TicketStatus` (บรรทัด 15–22):
    ```prisma
    enum TicketStatus {
      WAITING
      CALLED
      UNBOXING
      COMPLETED
      CANCELLED   // บรรทัด 20
      NO_SHOW     // บรรทัด 21
    }
    ```
  - Model `QueueTicket` (บรรทัด 58–75):
    - บรรทัด 64: `handledByStaffId String?` (มีอยู่จริง)
    - บรรทัด 71: `calledAt DateTime?` (มีอยู่จริง)
    - บรรทัด 74: `forfeitedAt DateTime? // ใช้ใน Sprint 2 (Cancel/No-Show)` (มีอยู่จริง)

### EV-A04: Service Error Evaluation Sequence
- **ไฟล์หลักฐาน:** `docs/evidence/EV-A04.txt`
- **คำสั่ง:** ตรวจสอบ `staff.routes.ts`, `staff.controller.ts`, `staff.service.ts`
- **ลำดับจริงในโค้ด:**
  1. `POST /api/staff/call-next`:
     `401 UNAUTHENTICATED` → `403 FORBIDDEN_ROLE` → `400 VALIDATION_ERROR (UUID)` → `403 FORBIDDEN_SERIES` → `409 STAFF_BUSY` → `404 EMPTY_QUEUE`
  2. `POST /api/staff/tickets/:id/start-unboxing`:
     `401 UNAUTHENTICATED` → `403 FORBIDDEN_ROLE` → `400 VALIDATION_ERROR (UUID)` → `404 RESOURCE_NOT_FOUND` → `403 FORBIDDEN_SERIES` → `403 FORBIDDEN_NOT_HANDLER` → `400 INVALID_STATE_TRANSITION`
  3. `POST /api/staff/tickets/:id/complete`:
     `401 UNAUTHENTICATED` → `403 FORBIDDEN_ROLE` → `400 VALIDATION_ERROR (UUID)` → `404 RESOURCE_NOT_FOUND` → `403 FORBIDDEN_SERIES` → `403 FORBIDDEN_NOT_HANDLER` → `400 INVALID_STATE_TRANSITION`
- **ข้อค้นพบสำคัญ (Key Insight):**
  ใน `startUnboxing` และ `complete` การตรวจ `FORBIDDEN_NOT_HANDLER` เขียนไว้ว่า:
  `if (ticket.handledByStaffId !== null && ticket.handledByStaffId !== staffId)`
  ทำให้ตั๋ว `WAITING` (ซึ่ง `handledByStaffId === null`) จะ **ไม่** โดน 403 แต่จะหลุดไปที่ Step ถัดไปและได้รับ `400 INVALID_STATE_TRANSITION`!  
  ดังนั้น Master F-06 ที่เขียนว่า `403 FORBIDDEN_NOT_HANDLER ถ้า staffId != handledByStaffId` จำเป็นต้องระบุ null-check หรือสลับลำดับเอา 400 ขึ้นก่อน

### EV-A05: Clock Abstraction & Timestamp Generation
- **ไฟล์หลักฐาน:** `docs/evidence/EV-A05.txt`
- **คำสั่ง:** Grep `server/src/**/*.ts` สำหรับ `Clock`, `calledAt`, `startedAt`, `completedAt`, `forfeitedAt`
- **ผลการตรวจสอบ:**
  - Interface ชื่อ `Clock` ใน `server/src/utils/clock.ts` (มี `SystemClock` และ `FakeClock`)
  - `calledAt` (staff.service.ts:204): ถูกเซ็ตด้วย `now = clock.now()`
  - `startedAt` (staff.service.ts:293): ถูกเซ็ตด้วย `now = clock.now()`
  - `completedAt` (staff.service.ts:379): ถูกเซ็ตด้วย `now = clock.now()`
  - `forfeitedAt`: ใน `schema.prisma` บรรทัด 74 ยังไม่มีการเรียกใช้ใน service ของ Sprint 1
  - ยืนยันว่า timestamp ทั้งหมดถูกควบคุมผ่าน application clock (`clock.now()`) ไม่ได้ใช้ DB default (`now()`) ยกเว้น `createdAt` ทำให้ `FakeClock` ใช้ควบคุมเวลาสำหรับ boundary 119s / 120s / 121s ได้ 100%

### EV-A06: Health Check Endpoint `/api/health`
- **ไฟล์หลักฐาน:** `docs/evidence/EV-A06.txt`
- **คำสั่ง:** ตรวจสอบ `server/src/app.ts` (บรรทัด 27–34), รัน `npx vitest run tests/health.test.ts`, และทดสอบ `curl.exe` บนเครื่อง
- **ผลการตรวจสอบ:**
  - มี endpoint จริง: `app.get(['/api/health', '/api/v1/health'], ...)`
  - คืนสถานะ: 200 `{ status: 'ok', commit: process.env.GIT_SHA || 'dev' }`
  - ทดสอบผ่าน 4/4 tests ใน `tests/health.test.ts`
  - ทดสอบ `curl.exe -i http://localhost:3344/api/health` ได้รับ `HTTP/1.1 200 OK` พร้อม `{"status":"ok","commit":"dev"}`
  - ทดสอบ inject `$env:GIT_SHA="75068a6109439b7f5dcadd7713ba93115ab29043"` ได้รับ `{"status":"ok","commit":"75068a6109439b7f5dcadd7713ba93115ab29043"}` ตรงตาม SHA จริง

### EV-A07: Test Inventory, R4 Integrity & Traceability Coverage
- **ไฟล์หลักฐาน:** `docs/evidence/EV-A07.txt`
- **คำสั่ง:**
  - `npm test`
  - `npm run test:e2e`
  - `git grep -E "\.(skip|only)\(|xit\(|xdescribe\(|it\.todo" -- server/tests e2e`
- **ผลลัพธ์การรันจริง:**
  - **Server Vitest:** 24 test files, 153 passed (153 tests)
  - **Client Vitest:** 6 test files, 34 passed (34 tests)
  - **Playwright E2E:** 4 test files, 7 passed (7 tests)
  - **รวม:** 194 passed, 0 failed, 0 skipped
- **R4 Integrity Check:**
  - Exit code: 1 (ไม่พบ `.skip`, `.only`, `xit`, `xdescribe`, หรือ `it.todo` ใดๆ ใน repo)
- **Traceability Comparison:**
  - ตารางบรรทัด 517–547 ใน Master มีไฟล์ test ของ Sprint 2 และ Sprint 3 จำนวน 6 ไฟล์ที่ **ยังไม่มีอยู่จริงบน main**:
    1. `server/tests/api/cancel.test.ts`
    2. `server/tests/api/no-show.test.ts`
    3. `server/tests/api/public-board.test.ts`
    4. `server/tests/api/analytics.test.ts`
    5. `server/tests/api/series-toggle.test.ts`
    6. `server/tests/security/rate-limit.test.ts`

### EV-A08: AC and TEST ID Collision Audit
- **ไฟล์หลักฐาน:** `docs/evidence/EV-A08.txt`
- **คำสั่ง:** Grep ค้นหา `(AC-\d+|TEST-\d+)` ใน `docs/` ทั้งหมด
- **ผลการตรวจสอบ:**
  - `AC-01` ถึง `AC-39` มีอยู่จริงใน Sprint 1, Lab 5, Lab 6, Lab 7
  - `AC-40` เว้นว่างไว้โดยเจตนา (ระบุชัดเจนใน `PopQueue_Deliverable_1_Master.md` บรรทัด 229)
  - `AC-41` ถึง `AC-47` และ `TEST-41` ถึง `TEST-47` ถูกจองไว้ล่วงหน้าตั้งแต่ Deliverable 1
  - ใน Lab 6 และ Lab 7 ไม่มีการสร้าง AC-40..47 ใดๆ
  - ยืนยัน: **Zero Collision (ไม่มีการชนเลข ID)**

### EV-A09: GitHub Issues & Pull Requests Audit
- **ไฟล์หลักฐาน:** `docs/evidence/EV-A09.txt`
- **คำสั่ง:** `gh issue list --state all --limit 100` และ `gh pr list --state all --limit 100`
- **ผลการตรวจสอบ:**
  - Issues #24–#32 (Lab 5), #46–#47 (Lab 6), #52–#54 (Lab 7) ปิดครบถ้วน
  - Issue #55: OPEN (`[Lab 7 Part C/D] Release Tagging v0.3.0-lab7, Cloud Run Live Verification, Metrics & Final PDF`)
  - PRs #48, #50 (Lab 6), #57, #58, #59, #60 (Lab 7) MERGED ครบถ้วน
  - PR #49, #51, #56: CLOSED (unmerged / superseded / chore sync)
  - **บันทึกการอนุมัติจาก TA (23 พ.ย. 15:30):** บันทึกไว้จริงใน Issue #52, PR #57 body, และ PR #60 review (อนุมัติโดยนายรัตนโชติ เพ็ชรพันธ์ศรี / พี่ลูกหมู พร้อม 4 เงื่อนไข)

### EV-A10: Git Branch Topology & HEAD Verification
- **ไฟล์หลักฐาน:** `docs/evidence/EV-A10.txt`
- **คำสั่ง:** `git branch -a -v --no-abbrev`
- **ผลการตรวจสอบ:**
  - `origin/main`: `a07a7be732b30cb75a22df7f30edfdc51521a87e` (Tag `v0.3.0-lab7`)
  - Local `main`: `bf52c9b969d905ba6f21bcc22a460f0db3dd5172` (behind 15 commits, ยังไม่ fast-forward)
  - `lab5-staging`: `3fbfaeb186b726e537dafc99a90ea469d946dcb1` (commit ก่อน PR #60 merge)
  - `defect/lab6-reintroduce-validation`: `4c5bb50bf63200b1b4ecde9292510bae78f5a364`
  - `sprint-2-docs` (HEAD): `75068a6109439b7f5dcadd7713ba93115ab29043`

---

## 2. หมวดที่ 1: ยืนยันแล้ว (มี EV)

| ข้อที่ | หัวข้อ | ข้อเท็จจริงที่ยืนยันจาก Repository | รหัสหลักฐาน |
| :---: | :--- | :--- | :---: |
| 1 | **Release Tags** | Tag `v0.1.0-sprint1` (`d946159`), `v0.2.0-lab5` (`bf52c9b`), `v0.3.0-lab7` (`a07a7be`) มีอยู่จริง และ SHA ตรงกับที่ Master อ้างถึง | **EV-A01** |
| 2 | **Migrations & Predicates** | Migration 0003 มีอยู่จริง; `CANCELLED` และ `NO_SHOW` หลุดจาก Partial Unique Index ทั้งสองตัว (`unique_active_ticket_user_series` และ `unique_active_staff_ticket`) 100% | **EV-A02** |
| 3 | **Prisma Schema** | Enum `TicketStatus` มี `CANCELLED` (line 20), `NO_SHOW` (line 21); ฟิลด์ `handledByStaffId` (line 64), `calledAt` (line 71), `forfeitedAt` (line 74) มีอยู่จริง | **EV-A03** |
| 4 | **Service Error Flow** | ลำดับการตรวจ error ใน `staff.service.ts` เป็น 401 → 403 → 400 → 404 → 403 → 403 → 400; มี null-check สำหรับ `handledByStaffId` ก่อนตรวจ FORBIDDEN_NOT_HANDLER | **EV-A04** |
| 5 | **Clock Abstraction** | ใช้ Interface `Clock` (`server/src/utils/clock.ts`); `calledAt`, `startedAt`, `completedAt` ถูกเซ็ตด้วย `clock.now()` เสมอ ทำให้ FakeClock ควบคุมเวลาได้ | **EV-A05** |
| 6 | **Health Check API** | `/api/health` และ `/api/v1/health` มีอยู่จริง และคืน `{ status: 'ok', commit: process.env.GIT_SHA \|\| 'dev' }` ทดสอบผ่าน 4/4 tests | **EV-A06** |
| 7 | **Test Suite Execution** | รันผ่านทั้งหมด 194/194 tests (Server 153, Client 34, E2E 7) ไม่มี failed, ไม่มี skip; R4 grep ไม่พบ skip/only | **EV-A07** |
| 8 | **ID Collision** | AC-40 ถูกเว้นว่างไว้; AC-41..47 และ TEST-41..47 ไม่มีชนกับเลขเดิมใน Sprint 1, Lab 6, Lab 7 | **EV-A08** |
| 9 | **Issues, PRs & TA Sign-off** | Issues #24–#32, #46–#47, #52–#54 และ PRs #48, #50, #57–#60 ตรงกับประวัติ Git จริง; บันทึกการอนุมัติ TA วันที่ 2026-11-23 15:30 มีอยู่จริง | **EV-A09** |
| 10 | **Branch Topology** | Branches `lab5-staging`, `sprint-2-docs`, `defect/lab6-reintroduce-validation` มีอยู่จริงตาม Git tree | **EV-A10** |

---

## 3. หมวดที่ 2: ขัดแย้ง (Master vs Repo — แสดงทั้งสองฝั่ง)

### ข้อขัดแย้งที่ 1: ตาราง Traceability Matrix อ้างไฟล์ Test ที่ยังไม่มีอยู่จริง
- **Master Document (บรรทัด 527–531, 539, 547):**  
  ระบุชื่อไฟล์ `server/tests/api/cancel.test.ts`, `no-show.test.ts`, `public-board.test.ts`, `analytics.test.ts`, `series-toggle.test.ts`, `rate-limit.test.ts`
- **Repository จริง (EV-A07):**  
  ไฟล์ทั้ง 6 ไฟล์นี้ **ยังไม่มีอยู่ใน codebase** (ยังไม่ได้ implement)  
  สถานะใน Master บางแถวระบุว่า "Verified" หรือ "Contract Ready" จึงต้องปรับสถานะเป็น `planned (no evidence yet)`

### ข้อขัดแย้งที่ 2: ข้อความผลลัพธ์ที่เขียนล่วงหน้าโดยยังไม่มีผลรัน
- **Master Document (บรรทัด 38):**  
  ระบุว่า *"ทำงานถูกต้อง 100% ไม่เกิด Regression"*
- **Master Document (บรรทัด 40):**  
  ระบุว่า `* ผลลัพธ์: *(จะเติมผลรันจริงพร้อมจำนวน assertions)*`
- **Repository จริง (EV-A07):**  
  Automated E2E Suite `e2e/full-journey.spec.ts` รันผ่านจริง 3/3 tests (Demo 1: 11.5s, Demo 2: 774ms, Demo 3: 784ms) แต่ข้อความใน Master เป็นการเคลมล่วงหน้าและทิ้ง placeholder เอาไว้โดยยังไม่ได้นำผลรันจริงไปบันทึก

### ข้อขัดแย้งที่ 3: Local Git Branch `main` หลุดจาก Production Remote `origin/main`
- **Master Document (บรรทัด 12):**  
  อ้างอิง Tag `v0.3.0-lab7 (a07a7be)` บน `main`
- **Repository จริง (EV-A10):**  
  - Remote `origin/main`: อยู่ที่ commit `a07a7be732b30cb75a22df7f30edfdc51521a87e` (Tag `v0.3.0-lab7`)
  - Local `main` ในเครื่อง: ยังคงชี้อยู่ที่ `bf52c9b969d905ba6f21bcc22a460f0db3dd5172` (Tag `v0.2.0-lab5`, behind 15 commits)
  - ยังไม่ได้ทำ `git checkout main && git pull`

### ข้อขัดแย้งที่ 4: ลำดับการตรวจ Error ของ F-06 No-Show ใน Master ขัดกับโค้ดจริง
- **Master Document (บรรทัด 199–201):**  
  ระบุลำดับ: ตรวจ `403 FORBIDDEN_NOT_HANDLER` ก่อน `400 INVALID_STATE_TRANSITION` โดยเขียนเงื่อนไขว่า `staffId != handledByStaffId`
- **Repository จริง (EV-A04):**  
  ใน `staff.service.ts` มีการตรวจ null-check: `ticket.handledByStaffId !== null && ticket.handledByStaffId !== staffId`  
  หากไม่ใส่ null-check ตั๋วสถานะ `WAITING` (ซึ่ง `handledByStaffId` เป็น null) จะได้รับ 403 แทนที่จะเป็น 400

---

## 4. หมวดที่ 3: ยืนยันไม่ได้ (NOT RUN)

| ข้อที่ | หัวข้อ | สาเหตุที่ไม่สามารถรันได้ใน Session นี้ | คำสั่งสำหรับมนุษย์ที่ต้องรันเอง |
| :---: | :--- | :--- | :--- |
| 1 | **Live Cloud Run Health Check via Public URL** | URL ใน Master บรรทัด 14 ยังเป็น placeholder `*(จะเติมหลัง Deploy ครั้งสุดท้ายก่อนส่ง PDF)*` และเครื่องทดสอบไม่มีสิทธิ์เข้าถึง GCP Cloud Console โดยตรงเพื่อ query active URL | ```bash<br># เมื่อได้ URL จาก Cloud Run Console<br>curl -s -i "https://<SERVICE_URL>/api/health"<br># ตรวจสอบว่า HTTP Status = 200 และ commit ตรงกับ a07a7be<br>``` |

*(หมายเหตุ: ทุกการตรวจสอบภายใน Repository โค้ด, ฐานข้อมูล migrations, schema, test suites ทั้ง 194 tests, และ GitHub CLI สามารถรันได้สำเร็จ 100%)*

---

## 5. Evidence Report Table

| รหัสหลักฐาน (EV-ID) | หัวข้อการตรวจ | คำสั่งที่รัน | ผลการตรวจ | Commit SHA ที่ตรวจ | ไฟล์หลักฐาน |
| :---: | :--- | :--- | :---: | :---: | :--- |
| **EV-A01** | Release Tags | `git tag -l ...` / `git rev-parse ...` | CONFIRMED | `75068a6109439b7f` | `docs/evidence/EV-A01.txt` |
| **EV-A02** | Migrations & Index Predicates | `Get-Content server/prisma/migrations/...` | CONFIRMED | `75068a6109439b7f` | `docs/evidence/EV-A02.txt` |
| **EV-A03** | Prisma Schema | Line-by-line inspection on `schema.prisma` | CONFIRMED | `75068a6109439b7f` | `docs/evidence/EV-A03.txt` |
| **EV-A04** | Service Error Flow | Inspect `staff.routes.ts`, `staff.service.ts` | CONFIRMED | `75068a6109439b7f` | `docs/evidence/EV-A04.txt` |
| **EV-A05** | Clock Abstraction | Grep `Clock`, `calledAt`, `startedAt`, etc. | CONFIRMED | `75068a6109439b7f` | `docs/evidence/EV-A05.txt` |
| **EV-A06** | Health API | Inspect `app.ts` + `vitest run tests/health.test.ts` | CONFIRMED | `75068a6109439b7f` | `docs/evidence/EV-A06.txt` |
| **EV-A07** | Test Inventory & R4 | `npm test` + `npm run test:e2e` + `git grep` | CONFIRMED / CONFLICT | `75068a6109439b7f` | `docs/evidence/EV-A07.txt` |
| **EV-A08** | AC/TEST ID Collision | Grep `(AC-\d+\|TEST-\d+)` in `docs/` | CONFIRMED | `75068a6109439b7f` | `docs/evidence/EV-A08.txt` |
| **EV-A09** | GitHub Issues & PRs | `gh issue list` + `gh pr list` + `gh pr view` | CONFIRMED | `75068a6109439b7f` | `docs/evidence/EV-A09.txt` |
| **EV-A10** | Branch Topology | `git branch -a -v --no-abbrev` | CONFIRMED | `75068a6109439b7f` | `docs/evidence/EV-A10.txt` |

---

## 6. Self-Audit (การประเมินตนเองอย่างเคร่งครัด)

ตามข้อกำหนดของ PREAMBLE ข้าพเจ้าได้ตรวจสอบตนเองและขอรายงานจุดที่อาจเป็นการลัดขั้นตอนหรือมีความไม่มั่นใจอย่างน้อย 3 ข้อ ดังต่อไปนี้:

1. **ความต่างระหว่าง Local `main` กับ Remote `origin/main`:**  
   การ audit ดำเนินการบน branch `sprint-2-docs` (commit `75068a6`) ซึ่ง fork ออกมาจาก remote lineage ที่รวม PR #60 แล้ว แต่ local branch `main` ในเครื่องยังอยู่ที่ `bf52c9b` (Tag `v0.2.0-lab5`) เนื่องจากยังไม่มีการรัน `git checkout main && git pull` ทำให้หากผู้ใช้สลับไปที่ `main` ในเครื่องโดยตรง จะยังไม่เห็นการเปลี่ยนแปลงของ Lab 7
2. **การรัน Health Check API มีการทดสอบทั้ง Supertest และ curl.exe โลคอล แต่ยังไม่ได้ curl ยิง Cloud Run สาธารณะจริง:**  
   การยืนยัน `/api/health` ใน EV-A06 มีการรัน `server/tests/health.test.ts` และรัน Express server โลคอลเพื่อทดสอบด้วย `curl.exe -i http://localhost:3344/api/health` ทั้งแบบ default และ inject `GIT_SHA` ซึ่งพิสูจน์การทำงานของ Express handler ได้ถูกต้อง แต่ยังไม่ได้เป็นการ curl ยิงผ่านเครือข่ายไปยัง Cloud Run public URL จริง เนื่องจาก Master เอกสารระบุ URL เป็น placeholder `(จะเติมหลัง Deploy ครั้งสุดท้ายก่อนส่ง PDF)` และไม่มีการเปิดเผย URL หรือสิทธิ์ GCP ใน session นี้
3. **ไฟล์ Screenshot ใน `docs/evidence/screenshots/` ถูกอัปเดต timestamp จากการรัน Playwright Test:**  
   ในการรัน `npm test` และ `npm run test:e2e` (EV-A07) ชุดทดสอบ Playwright (`full-journey.spec.ts`) ได้ทำการจับภาพหน้าจอทับลงใน `docs/evidence/screenshots/*.png` ส่งผลให้ `git status --porcelain` มีไฟล์ binary screenshots ขึ้นสถานะ `M` (Modified) แม้ว่าจะไม่มีการแก้ไขโค้ดหรือเอกสารสเปกใดๆ ก็ตาม (จำเป็นต้องแจ้งให้ผู้ใช้ทราบก่อนทำการ commit)
