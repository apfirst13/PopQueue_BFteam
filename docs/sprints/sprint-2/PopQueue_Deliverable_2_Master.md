# PopQueue — Project Deliverable 2 Master Contract & Specification
> **Core Expansion (Sprint 2) & Genuine Progress (Sprint 3) with GCP Deployment**  
> **Course:** CPE 334 Introduction to Software Engineering in the Age of AI Agents (Semester 1/2026, KMUTT)  
> **Project / Theme:** **PopQueue** — Theme 9: Queue and Service Management System (*Art Toy Live Unboxing Station*)  
> **Repository:** `https://github.com/apfirst13/PopQueue_BFteam.git`  
> **Team Members:** `@apfirst13` (aphiwat) & `@Theerawat82` (Theerawat)  
> **Student IDs:** *(ใส่รหัสนักศึกษาทั้ง 2 คนในหน้าปก PDF เท่านั้น — ไม่เปิดเผยใน Repo สาธารณะ)*  
> **Deliverable:** Project Deliverable 2 (70 Points | 7% of Course Grade)  
> **Submission Deadline:** **Sunday, 29 November 2026 at 23:59** (via LEB2, single self-contained PDF)  
> **Sprint 1 Baseline Release:** Tag `v0.1.0-sprint1` (`d946159`)  
> **Lab 5 Release:** Tag `v0.2.0-lab5`  
> **Lab 7 Maintenance Release:** Tag `v0.3.0-lab7` (`a07a7be`)  
> **Target Sprint 2 Release Candidate:** Tag `v0.4.0-sprint2` on `main` deployed to GCP Cloud Run  
> **Deployed Cloud Run URL:** *(จะเติมหลัง Deploy ครั้งสุดท้ายก่อนส่ง PDF)*  
> **Immutable Submitted Tag/Commit:** *(จะเติมก่อนส่ง PDF)*

---

## สารบัญและโครงสร้างตามเกณฑ์ประเมิน (Rubric Navigation Table)

| ส่วนของเอกสาร (Rubric Part) | คะแนน | หน้า PDF | หัวข้อหลักและเนื้อหาที่ประเมิน |
| :--- | :---: | :---: | :--- |
| **Part A: Sprint 1 Continuity & Change Status** | **5** | *(ใส่เลขหน้าตอน export PDF)* | ยืนยัน Critical Domain Journey, Change & Defect Register (Labs 5–7) |
| **Part B: Sprint 2 Contracts & Working Increment** | **25** | | Engineering Contracts F-05, F-06, F-07 (API/UI/Data/AC/STS/DoD), TDD Evidence, PR Reviews |
| **Part C: Sprint 3 Contracts & Working Progress** | **15** | | Contracts F-08, F-09, S3-HARDEN + Genuine Working Progress (F-09) |
| **Part D: Updated SRS, SDS, Traceability** | **10** | | SRS ฉบับเต็มปัจจุบัน, Feature Inventory, System SDS, Traceability Matrix |
| **Part E: Integrated Candidate & Finish Plan** | **15** | | Release Candidate, Deployment, Demonstrations, Tests & History, Readiness |
| **Section 4: Setup, Contributions & AI Use** | — | | Setup Summary, Safe Test Accounts, Contribution Table, AI-Use Declaration |
| **รวมทั้งหมด (Total)** | **70** | | |

---

# Part A: Sprint 1 Continuity and Change Status (5 คะแนน)

## 1. การยืนยันความต่อเนื่องของ Sprint 1 (Sprint 1 Baseline & Continuity)
* **Accepted Baseline Release:** Tag `v0.1.0-sprint1` (Commit `d946159ba82a249c195730a3b702cf0f68e96e2d`)
* **Original Critical Domain Journey Verification:**
  เส้นทางการทำงานหลักของระบบที่ส่งมอบใน Sprint 1 (Collector Login → Join Queue `CRY` → Staff Login → Call Next → Verify & Start → Complete Unboxing) ยังคงทำงานได้ถูกต้อง 100% บน Codebase ปัจจุบัน (`v0.3.0-lab7`) โดยไม่เกิด Regression จากการเพิ่มฟีเจอร์ใหม่
  * รันยืนยันผ่าน Automated E2E Suite: `npx playwright test e2e/full-journey.spec.ts`
  * ผลลัพธ์: *(จะเติมผลรันจริงพร้อมจำนวน assertions)*

## 2. ทะเบียนการเปลี่ยนแปลงและข้อบกพร่อง (Change & Defect Register: Labs 5–7)

| Finding ID | แหล่งที่มา | Req / AC ที่กระทบ | คำอธิบายและสาเหตุ | การแก้ไข | สถานะ / Tag | ผลการทดสอบซ้ำ |
| :---: | :---: | :---: | :--- | :--- | :---: | :---: |
| **DEF-01** | Lab 6 Blind UAT (Omega-3), Issue `#46` | `FR-04`, `AC-10` | `POST /api/tickets/join` ไม่ตรวจ `seriesId` เป็น required ทำให้ส่ง body ว่างได้ 500 (Branch `defect/lab6-reintroduce-validation` เท่านั้น; ไม่กระทบ `main` Production) | เพิ่ม Zod required validation กลับเข้า schema บน staging branch | **RESOLVED** (Closed `#46`, ปิดบน staging, ไม่เข้า `main` เพราะเป็น Lab 6 Special Exercise branch) | **PASS** — Omega-3 ยืนยัน |
| **DEF-02** | Lab 6 Blind UAT (Omega-3), Issue `#47` | `FR-01`, `AC-03` | Login ไม่ส่ง password แล้ว API คืน HTTP 500 แทน HTTP 400 `VALIDATION_ERROR` | เพิ่ม Zod schema validation สำหรับ password; `[RED]` → `[GREEN]` ตาม TDD | **RESOLVED** (`v0.2.0-lab5` → hotfix merged to `main` via PR `#48` → `#50`, Commit `72e1bb5`) | **PASS** — Omega-3 retest ยืนยันผลผ่านและปิด Issue `#47` |
| **CHG-01** | Lab 5 CI/CD & GCP | `NFR-05` (Persistence & Deployment) | ติดตั้ง Dockerfile Multi-stage, GitHub Actions CI/CD with WIF, Cloud Run + Cloud SQL PostgreSQL | ใช้ Cloud Run Job `popqueue-migrate` เพื่อรัน Migration ก่อน deploy Service อัตโนมัติ | **RESOLVED** (Tag `v0.2.0-lab5`, Issues `#24`–`#32`) | **PASS** — Container restart & redeploy persistence verified 3/3 ครั้ง |
| **CHG-02** | Lab 7 Maintenance, Issue `#52` | `FR-04`, `FR-05`, `BR-02`, `D-08` | ปรับปรุงกฎธุรกิจ `BR-02` จาก "ถือตั๋ว active ได้สูงสุด 1 ใบทั้งระบบ" เป็น **"ถือตั๋ว active ได้สูงสุด 1 ใบต่อซีรีส์"** | TA อนุมัติ (23 พ.ย. 15:30); Zero-Gap Migration `0003` สร้าง Partial Unique Index `(userId, seriesId)`; ปรับ `GET /api/tickets/my-ticket` คืน `tickets: []`; Multi-ticket UI cards + countdown | **RESOLVED** (Tag `v0.3.0-lab7`, Commit `a07a7be`; PRs `#57` → `#58` → `#59` → `#60`; Issues `#52` closed, `#53` closed, `#54` closed; `#55` pending metrics/PDF) | **PASS** — Live check บน Cloud Run ยืนยัน cross-series join สำเร็จ, same-series duplicate ยังคงถูก reject |

## 3. Approved Baseline Revisions & Rationale
1. **Lab 6 Defect Fixes (DEF-01, DEF-02):** แก้ไข Validation ที่หลุดบน staging branch สำหรับ Lab 6 Special Exercise และ hotfix password validation บน `main` ทั้งสองผ่านกระบวนการ TDD `[RED]` → `[GREEN]` และ Cross-team retest
2. **Lab 7 BR-02 v2 (CHG-02):** รองรับพฤติกรรมร้าน Art Toy จริงที่มี Live Unboxing Station แยกอิสระต่อซีรีส์ ลูกค้าที่ซื้อกล่องสุ่มหลายซีรีส์ต่อคิวข้ามซีรีส์พร้อมกันได้ ยังคงห้ามกักตั๋วซ้ำในซีรีส์เดียวกัน (Migration `0003` Zero-Gap: `CREATE INDEX` ก่อน `DROP INDEX`)
3. **Invariant ที่คงไว้ตลอด:** Role-Based Access Control (`COLLECTOR` ห้ามเข้าหน้า Staff, `BOX_MASTER` ห้ามจองคิว), Ownership 403, State Machine guard, และ Atomic Daily Numbering ทำงานเหมือนเดิมทุกประการ

---

# Part B: Sprint 2 Contracts and Working Increment (25 คะแนน)

ใน Sprint 2 นี้ ระบบ PopQueue ทำการขยายขีดความสามารถหลัก (Core Expansion) 3 ฟีเจอร์ เพื่อแก้ปัญหาคอขวดที่เปิดเผยไว้ในข้อจำกัดของ Sprint 1 (Known Limitation G-02 / D-09):
1. **`F-05` Queue Cancellation:** ให้ลูกค้ายกเลิกคิวตนเองขณะรอได้
2. **`F-06` Server-Enforced 120s No-Show:** พนักงานตัดสิทธิ์ลูกค้าที่ไม่มาตามเรียกภายใน 120 วินาที ปลดล็อกพนักงานพ้นจาก `STAFF_BUSY`
3. **`F-07` Public Queue Display Board:** จอบอร์ดสาธารณะหน้าร้าน ไม่ต้องล็อกอิน และไม่มีข้อมูลส่วนบุคคลหลุด

> **DB Schema Note:** ทั้ง `F-05` และ `F-06` ไม่ต้องสร้าง Migration ใหม่ เนื่องจากใน `schema.prisma` มี Enum `CANCELLED`, `NO_SHOW` และฟิลด์ `forfeitedAt` (nullable DateTime) รอไว้ตั้งแต่ Migration `0001_init` แล้ว ส่วน `F-07` เป็น Read-Only Endpoint ที่ Query ข้อมูลที่มีอยู่เดิม ไม่มีการเปลี่ยนแปลง Schema ใดๆ

---

## 1. Feature Contract: F-05 Queue Cancellation (ลูกค้ายกเลิกตั๋วตนเอง)

### 1.1 Purpose & Scope
อนุญาตให้ Collector ยกเลิกตั๋วคิวที่ตนเองถืออยู่ขณะที่ตั๋วยังอยู่ในสถานะ `WAITING` เพื่อเปิดโอกาสให้ผู้อื่น และเพื่อปลดล็อกโควตาให้ตนเองสามารถกดรับบัตรคิวในซีรีส์เดิมหรือซีรีส์อื่นได้ทันที  
**นอก Scope:** ยกเลิกตั๋วที่ถูกเรียกแล้ว (`CALLED`), กำลังให้บริการ (`UNBOXING`), หรือจบแล้ว (`COMPLETED`)  
**DB / Migration Impact:** ไม่มี — ใช้ `TicketStatus.CANCELLED` และ `forfeitedAt` ที่มีอยู่แล้ว

### 1.2 Linked Requirements & Dependencies
* **Requirements:** `FR-11` (Cancel Ticket), `BR-01` (Non-reuse numbering), `BR-02 v2` (Active quota per series), `BR-04` (Role Guard)
* **Dependencies:** `F-01` (Authentication), `F-02` (Queue Ticket in WAITING state)

### 1.3 State Machine

```
[WAITING] ── POST /api/tickets/:id/cancel ──> [CANCELLED]
                                                   │
                                     forfeitedAt = now()
                                     Partial Unique Index หลุด → Collector สามารถ re-join ซีรีส์เดิมได้ทันที
                                     QueueCounter.lastNumber ไม่ลดลง → เลขคิวที่ถูกยกเลิกจะถูกข้ามถาวร
```

ทิศทางเดียว ไม่สามารถย้อนกลับจาก `CANCELLED` ไปสถานะอื่นได้

### 1.4 API Specification: POST /api/tickets/:id/cancel
* **Route File:** `server/src/routes/ticket.routes.ts` (เพิ่ม route ใหม่)
* **Service File:** `server/src/services/ticket.service.ts` (เพิ่ม method `cancelTicket`)
* **Headers:** `Authorization: Bearer <collector_jwt_token>`
* **Path Parameters:** `id: string` (UUID ของตั๋ว)
* **Request Body:** ไม่มี (Empty Body)
* **Success Response (HTTP 200 OK):**
  ```json
  {
    "success": true,
    "data": {
      "id": "7c9e6679-...",
      "seriesId": "a1b2c3d4-...",
      "displayNumber": "CRY-003",
      "status": "CANCELLED",
      "forfeitedAt": "2026-11-23T13:45:00.000Z"
    }
  }
  ```
* **Error Handling (Deterministic Order — สอดคล้องกับ `staff.service.ts` ของ Sprint 1):**
  1. `401 UNAUTHENTICATED`: ไม่มี Token หรือ Token ปลอม/หมดอายุ
  2. `403 FORBIDDEN_ROLE`: ผู้เรียกมีบทบาทเป็น `BOX_MASTER`
  3. `404 RESOURCE_NOT_FOUND`: ไม่พบตั๋ว ID ที่ระบุในระบบ
  4. `403 FORBIDDEN_OWNERSHIP`: ผู้เรียกไม่ใช่เจ้าของตั๋ว (`ticket.userId !== auth.userId`)
  5. `400 INVALID_STATE_TRANSITION`: ตั๋วไม่ได้อยู่ในสถานะ `WAITING` *(ใช้ `400` ให้สอดคล้องกับ `startUnboxing` / `complete` ใน Sprint 1 ที่ใช้ `400 INVALID_STATE_TRANSITION` เมื่อสถานะไม่ถูกต้อง; ส่วน `409` สงวนไว้ให้ `STAFF_BUSY`, `DUPLICATE_ACTIVE_QUEUE`, `SERIES_CLOSED`)*

### 1.5 UI Specification: หน้า /my-ticket
* **ตำแหน่งปุ่ม:** แสดงปุ่ม "ยกเลิกคิว" (Cancel Queue) บนการ์ดตั๋วแต่ละใบ เฉพาะเมื่อตั๋วมีสถานะ `WAITING` เท่านั้น เมื่อสถานะเปลี่ยนเป็น `CALLED` หรือสถานะอื่น ปุ่มจะหายไปโดยอัตโนมัติ
* **Confirm Modal:** เมื่อกดปุ่ม Cancel จะแสดง Confirmation Dialog: "ต้องการยกเลิกคิว CRY-003 หรือไม่? เลขคิวนี้จะไม่สามารถกลับมาใช้ได้อีก" พร้อมปุ่ม "ยืนยันยกเลิก" (สีแดง) และ "ไม่ยกเลิก"
* **After Cancel:** แสดง Toast/Notification "ยกเลิกคิวสำเร็จ" และรีเฟรชรายการตั๋วให้ตั๋วที่ยกเลิกหายจากหน้า Active (เนื่องจาก `GET /api/tickets/my-ticket` คืนเฉพาะตั๋ว Active)
* **Loading / Error States:** แสดง Spinner ขณะรอ API ตอบกลับ; แสดง Error Toast เมื่อได้ `400`, `409` พร้อมข้อความที่เข้าใจง่าย
* **Layer ที่ไม่เปลี่ยนแปลง:** DB Schema (ไม่มี Migration ใหม่), Staff UI (ไม่เกี่ยว), Auth Middleware (ใช้ของเดิม)

### 1.6 Numbered Acceptance Criteria (AC)
* [ ] **AC-41.1 (Valid Cancellation):** Collector ที่มีตั๋วสถานะ `WAITING` เมื่อส่งคำขอยกเลิกสำเร็จ ได้รับ HTTP 200, สถานะเปลี่ยนเป็น `CANCELLED`, มีค่า `forfeitedAt` เป็นเวลาปัจจุบัน
* [ ] **AC-41.2 (Quota Release & Re-join):** หลังยกเลิกสำเร็จ Collector สามารถกด `POST /api/tickets/join` เข้าซีรีส์เดิมได้ทันที และได้รับเลขคิวถัดไปโดยไม่ติด `409 DUPLICATE_ACTIVE_QUEUE`
* [ ] **AC-41.3 (Numbering Continuity):** เลขคิวที่ถูกยกเลิก (เช่น `CRY-003`) จะไม่ถูกนำกลับมาออกซ้ำ คิวถัดไปที่กดเข้ามาระบบต้องออกเป็น `CRY-004`
* [ ] **AC-41.4 (Forbidden Ownership):** Collector A พยายามยกเลิกตั๋วของ Collector B ต้องถูกปฏิเสธด้วย HTTP `403 FORBIDDEN_OWNERSHIP` ตั๋วของ B ต้องคงสถานะเดิม
* [ ] **AC-41.5 (Invalid Transition on CALLED/COMPLETED):** เมื่อตั๋วถูก Box Master เรียกแล้ว (`CALLED`) หรือสถานะอื่นที่ไม่ใช่ `WAITING` Collector กดยกเลิกต้องได้รับ HTTP `400 INVALID_STATE_TRANSITION`

### 1.7 Software Test Specification (STS: TEST-41)
| Test ID | Level | Test File | Preconditions | Inputs | Expected Output |
| :---: | :---: | :--- | :--- | :--- | :--- |
| **TEST-41A** | Integration | `server/tests/api/cancel.test.ts` | Collector 1 ล็อกอิน, ถือตั๋ว `CRY-001` (`WAITING`) | `POST /api/tickets/:id/cancel` JWT Collector 1 | HTTP `200`, `status: "CANCELLED"`, `forfeitedAt` ≠ null, DB status = CANCELLED |
| **TEST-41B** | Integration | `server/tests/api/cancel.test.ts` | Collector 1 เพิ่งยกเลิก `CRY-001` | `POST /api/tickets/join` ซีรีส์ `CRY` | HTTP `201`, `displayNumber: "CRY-002"`, active ticket = 1 |
| **TEST-41C** | Security | `server/tests/api/cancel.test.ts` | Collector 1 ถือ `CRY-001`, Collector 2 ล็อกอิน | Collector 2 `POST /cancel` ตั๋ว 1 | HTTP `403 FORBIDDEN_OWNERSHIP`, ตั๋ว 1 ยังเป็น `WAITING` |
| **TEST-41D** | Boundary | `server/tests/api/cancel.test.ts` | ตั๋ว `CRY-001` ถูก Call แล้ว (`CALLED`) | Collector 1 `POST /cancel` | HTTP `400 INVALID_STATE_TRANSITION`, สถานะคงเป็น `CALLED` |
| **TEST-41E** | Unit | `server/tests/unit/state-machine.test.ts` | State machine validator | ตรวจทุกสถานะ → `CANCELLED` | อนุญาตเฉพาะ `WAITING`; ปฏิเสธ `CALLED`, `UNBOXING`, `COMPLETED` |

### 1.8 Definition of Done (DoD) — F-05
- [ ] โค้ด Service/Controller/Route ครบถ้วน พร้อม Error Handling ตาม Deterministic Order
- [ ] `[RED]` test commit บันทึก SHA ก่อนเขียนโค้ด; `[GREEN]` test commit หลังแก้ผ่านทั้งชุด
- [ ] Regression Suite เดิม (Sprint 1 + Lab 7) ผ่าน 100% ไม่มี test ที่ถูก weakened หรือ skip
- [ ] UI ปุ่ม Cancel + Confirm Modal + Toast ทำงานบนหน้า `/my-ticket`
- [ ] PR ผ่านการ Review (5-Lenses) โดยเพื่อนร่วมทีม, Merge ด้วย `Create a merge commit`
- [ ] CI Pipeline ผ่าน (Build + Test + Docker Build)

---

## 2. Feature Contract: F-06 Server-Enforced 120s No-Show (ตัดสิทธิ์ลูกค้าไม่มาตามเรียก)

### 2.1 Purpose & Scope
แก้ปัญหาค้างคาของ Sprint 1 (G-02 / D-09: ไม่มี No-Show ทำให้พนักงานติด `STAFF_BUSY` เมื่อลูกค้าหนีหาย): เมื่อตั๋วถูกเรียก (`CALLED`) ระบบจะเริ่มนับเวลาจาก `calledAt` หากเกิน 120 วินาทีแล้วลูกค้าไม่มาแสดงตัว Box Master สามารถกดตัดสิทธิ์ No-Show เพื่อปลดล็อกตนเองให้เรียกคิวถัดไปได้  
**นอก Scope:** No-Show อัตโนมัติ (Auto No-Show ไม่มี manual trigger) — Sprint 2 ใช้การกด manual โดย Box Master เท่านั้น  
**DB / Migration Impact:** ไม่มี — ใช้ `TicketStatus.NO_SHOW` และ `forfeitedAt` ที่มีอยู่แล้ว

### 2.2 Linked Requirements & Dependencies
* **Requirements:** `FR-12` (No-Show Timeout), `BR-03` (State Machine), `BR-05` (Staff Series Assignment), `BR-06` (Single Active Handling), `BR-07` (Handler Exclusive), `BR-08` (120s Timeout Rule)
* **Dependencies:** `F-03` (Staff Call Queue, `calledAt` timestamp)

### 2.3 State Machine & Server Validation Rule

```
[CALLED] ── POST /api/staff/tickets/:id/no-show ──> [NO_SHOW]
   │          (ต้องผ่านเงื่อนไข: now() - calledAt >= 120 วินาที)        │
   │                                                                      │
   └─ Staff ติดสถานะ STAFF_BUSY                                            └─ Staff หลุดจาก unique_active_staff_ticket
      (unique_active_staff_ticket constraint)                                   สามารถ POST /api/staff/call-next ได้ทันที
```

**Server-side validation (BR-08):** `Δt = currentTime − ticket.calledAt`
  * `Δt < 120s` → HTTP `400 NO_SHOW_WINDOW_NOT_EXPIRED` พร้อม `remainingSeconds`
  * `Δt ≥ 120s` → อนุญาต, บันทึก `forfeitedAt = now()`, ตั๋ว → `NO_SHOW`

**Clock Injection for Testing:** ใช้ `AppOptions { clock?: IClock }` ที่มีอยู่แล้ว (จาก Sprint 1 `D-10`) เพื่อ Inject `FakeClock` ในการทดสอบ ทำให้รัน test กรณี ≥ 120s ได้ทันทีโดยไม่ต้อง `sleep`

### 2.4 API Specification: POST /api/staff/tickets/:id/no-show
* **Route File:** `server/src/routes/staff.routes.ts` (เพิ่ม route ใหม่)
* **Service File:** `server/src/services/staff.service.ts` (เพิ่ม method `noShow`)
* **Headers:** `Authorization: Bearer <box_master_jwt_token>`
* **Path Parameters:** `id: string` (UUID ของตั๋ว)
* **Success Response (HTTP 200 OK):**
  ```json
  {
    "success": true,
    "data": {
      "id": "7c9e6679-...",
      "displayNumber": "CRY-001",
      "status": "NO_SHOW",
      "forfeitedAt": "2026-11-23T13:47:05.000Z"
    }
  }
  ```
* **Error Handling (Deterministic Order — สอดคล้องกับ `staff.service.ts` pattern ของ Sprint 1):**
  1. `401 UNAUTHENTICATED`: ไม่ได้ยืนยันตัวตน
  2. `403 FORBIDDEN_ROLE`: ผู้เรียกไม่ใช่ `BOX_MASTER`
  3. `404 RESOURCE_NOT_FOUND`: ไม่พบตั๋ว ID ที่ระบุ
  4. `403 FORBIDDEN_SERIES`: Box Master ไม่ได้รับมอบหมายให้ดูแลซีรีส์ของตั๋วใบนี้
  5. `403 FORBIDDEN_NOT_HANDLER`: พนักงานคนนี้ไม่ใช่ผู้ที่กด Call ตั๋วนี้ไว้ (`ticket.handledByStaffId !== staff.id`)
  6. `400 INVALID_STATE_TRANSITION`: ตั๋วไม่ได้อยู่ในสถานะ `CALLED` *(ใช้ `400` สอดคล้องกับ Sprint 1)*
  7. `400 NO_SHOW_WINDOW_NOT_EXPIRED`: เวลาผ่านไปยังไม่ครบ 120 วินาที (พร้อม `remainingSeconds` ใน response body)

### 2.5 UI Specification: หน้า Staff Service Counter
* **Countdown Timer:** เมื่อตั๋วอยู่ในสถานะ `CALLED` แสดง Countdown Timer นับถอยหลังจาก 120 วินาที โดย:
  * `remainingTime > 0`: แสดงปุ่ม "ตัด No-Show" เป็นสีเทา (disabled) พร้อมข้อความ "รออีก XX วินาที"
  * `remainingTime ≤ 0`: เปลี่ยนปุ่มเป็นสีแดง (enabled) ข้อความ "ตัด No-Show" พร้อมกดได้
* **Confirm Action:** เมื่อกดปุ่ม No-Show จะแสดง Confirmation: "ลูกค้าไม่มาตามเรียก ต้องการตัดสิทธิ์คิว CRY-001 หรือไม่?"
* **After No-Show:** แสดง Toast "ตัดสิทธิ์ No-Show สำเร็จ" และอัปเดตหน้า Staff ให้พร้อมกดเรียกคิวถัดไป
* **Loading / Error States:** Spinner ขณะรอ; Error Toast เมื่อได้ `400 NO_SHOW_WINDOW_NOT_EXPIRED` (พร้อมเวลาที่เหลือ)
* **Layer ที่ไม่เปลี่ยนแปลง:** DB Schema (ไม่มี Migration ใหม่), Collector UI `/my-ticket` (ตั๋ว NO_SHOW หายจาก active list เอง), Auth Middleware

### 2.6 Numbered Acceptance Criteria (AC)
* [ ] **AC-42 (Premature No-Show Rejection):** Box Master พยายามส่งคำขอ No-Show ก่อนเวลาครบ 120 วินาที (เช่น ผ่านไป 60 วินาที) ต้องได้รับ HTTP `400 NO_SHOW_WINDOW_NOT_EXPIRED`, ตั๋วคงสถานะ `CALLED` และพนักงานยังคงติด `STAFF_BUSY`
* [ ] **AC-43.1 (Successful No-Show Transition):** เมื่อเวลาผ่านไป ≥ 120 วินาที Box Master ที่เป็นผู้ Call ส่งคำขอสำเร็จ ได้รับ HTTP 200, ตั๋วเปลี่ยนสถานะเป็น `NO_SHOW`, บันทึก `forfeitedAt`
* [ ] **AC-43.2 (Staff Unlocked from STAFF_BUSY):** ทันทีที่ตั๋วเป็น `NO_SHOW` พนักงานคนเดิมสามารถเรียก `POST /api/staff/call-next` เพื่อเรียกคิวถัดไปได้ทันที ไม่เกิดข้อผิดพลาด `409 STAFF_BUSY`
* [ ] **AC-43.3 (Handler Exclusive Enforcement):** Box Master B พยายามกด No-Show ตั๋วที่ Box Master A เป็นผู้เรียกไว้ ต้องได้รับ HTTP `403 FORBIDDEN_NOT_HANDLER` แม้เวลาจะเกิน 120 วินาทีแล้วก็ตาม

### 2.7 Software Test Specification (STS: TEST-42, TEST-43)
| Test ID | Level | Test File | Preconditions | Inputs | Expected Output |
| :---: | :---: | :--- | :--- | :--- | :--- |
| **TEST-42** | Integration | `server/tests/api/no-show.test.ts` | Box Master A เรียกตั๋ว `CRY-001` (`CALLED`), FakeClock +45s | `POST /api/staff/tickets/:id/no-show` | HTTP `400`, `code: "NO_SHOW_WINDOW_NOT_EXPIRED"`, ตั๋วยังเป็น `CALLED` |
| **TEST-43A** | Integration | `server/tests/api/no-show.test.ts` | FakeClock advance +125s | `POST /api/staff/tickets/:id/no-show` | HTTP `200`, `status: "NO_SHOW"`, `forfeitedAt` recorded |
| **TEST-43B** | Constraint | `server/tests/api/no-show.test.ts` | ตั๋ว `CRY-001` = `NO_SHOW` | Box Master A: `POST /api/staff/call-next` | HTTP `200`, ได้ตั๋ว `CRY-002`, `unique_active_staff_ticket` released |
| **TEST-43C** | Security | `server/tests/api/no-show.test.ts` | ตั๋วผ่านไป 150s, Box Master B ล็อกอิน | Box Master B: `POST /no-show` ตั๋ว 1 | HTTP `403 FORBIDDEN_NOT_HANDLER`, ตั๋วยังเป็น `CALLED` |

### 2.8 Definition of Done (DoD) — F-06
- [ ] Service method `noShow` ใน `staff.service.ts` พร้อม Clock Injection + ตรวจ 120s
- [ ] `[RED]` → `[GREEN]` commit chain บันทึกไว้ครบ
- [ ] Regression Suite ผ่าน 100%
- [ ] UI Countdown Timer + ปุ่ม No-Show (disabled/enabled) + Confirm Modal
- [ ] PR Review + CI ผ่าน + Merge ด้วย `Create a merge commit`

---

## 3. Feature Contract: F-07 Public Queue Display Board (จอบอร์ดแสดงคิวสาธารณะหน้าร้าน)

### 3.1 Purpose & Scope
จัดเตรียมหน้าจอแสดงผลคิวสาธารณะสำหรับตั้งหน้าร้าน Art Toy เพื่อให้ลูกค้าที่เดินดูสินค้าสามารถมองเห็นคิวที่กำลังให้บริการและคิวถัดไปได้จากระยะไกล โดยไม่ต้องล็อกอิน  
**ข้อกำหนดด้านความเป็นส่วนตัว (NFR-02):** ต้องไม่มี PII (`userId`, `username`, `fullName`, `passwordHash`, `tokenVersion`) ใน API Response โดยเด็ดขาด — ใช้ Prisma `select` projection ที่ระดับ Query เท่านั้น (ไม่ query แล้วมาตัด)  
**DB / Migration Impact:** ไม่มี (Read-Only Endpoint)

### 3.2 Linked Requirements & Dependencies
* **Requirements:** `FR-13` (Public Queue Display), `NFR-02` (Data Privacy & Zero PII), `NFR-06` (Responsive Display)
* **Dependencies:** `F-02` (Series & Tickets), `F-03` (Active Serving Status)

### 3.3 API Specification: GET /api/public/queue-board
* **Route File:** `server/src/routes/public.routes.ts` (ไฟล์ใหม่ — public routes ไม่ผ่าน `authenticateToken` middleware)
* **Service File:** `server/src/services/public.service.ts` (ไฟล์ใหม่)
* **Authentication:** **None (Public Route)** — ไม่ต้องส่ง `Authorization` header
* **Cache-Control Header:** `no-store, no-cache, must-revalidate` (ข้อมูลคิว Real-time)
* **Success Response (HTTP 200 OK):**
  ```json
  {
    "success": true,
    "data": {
      "timestamp": "2026-11-23T13:50:00.000Z",
      "boards": [
        {
          "seriesCode": "CRY",
          "seriesName": "Crybaby Sunset Concert",
          "isActive": true,
          "nowServing": [
            {
              "displayNumber": "CRY-003",
              "status": "UNBOXING"
            }
          ],
          "upNext": [
            { "displayNumber": "CRY-004" },
            { "displayNumber": "CRY-005" }
          ],
          "waitingCount": 5
        }
      ]
    }
  }
  ```
  > **Note:** ไม่มีฟิลด์ `station` หรือ `counter` เนื่องจากใน DB Schema ไม่มีคอลัมน์ชื่อ Station / Counter — Staff ถูกระบุโดย `handledByStaffId` ซึ่งเป็นข้อมูลภายใน **ห้ามส่งออกใน Public API** มิฉะนั้นจะหลุดข้อมูลพนักงาน ถ้าต้องการแสดงชื่อเคาน์เตอร์ในอนาคตต้องสร้างคอลัมน์ `station` หรือ `counterLabel` แยกออกจาก `User` table

### 3.4 UI Specification: หน้า /board
* **Route:** `/board` (Public Route ไม่ต้อง Login ไม่ต้องแสดง Navbar/Login button)
* **Layout:** Kiosk-style full-screen, Art Toy theme, ตัวอักษรใหญ่อ่านง่ายจากระยะไกล
* **Content per Series Card:**
  * ชื่อซีรีส์ + โลโก้ + สถานะ Open/Closed
  * "กำลังให้บริการ" (Now Serving): แสดง `displayNumber` ของตั๋วที่มีสถานะ `CALLED` หรือ `UNBOXING`
  * "คิวถัดไป" (Up Next): แสดงรายการ `displayNumber` ของตั๋ว `WAITING` ถัดไป 3-5 ใบ
  * "จำนวนคิวรอ" (Waiting Count)
* **Auto-Refresh:** Polling `GET /api/public/queue-board` ทุก 3 วินาที
* **Responsive:** รองรับ TV landscape 1920×1080, Tablet portrait, และ Mobile 375px
* **Empty State:** เมื่อไม่มีตั๋ว Active แสดงข้อความ "ไม่มีคิวในขณะนี้"
* **Layer ที่ไม่เปลี่ยนแปลง:** DB Schema, Auth Middleware (ไม่ใช้), Collector/Staff UI pages

### 3.5 Numbered Acceptance Criteria (AC)
* [ ] **AC-44.1 (Unauthenticated Access):** ผู้ใช้ภายนอกเรียก `GET /api/public/queue-board` โดยไม่ส่ง Token สามารถเข้าถึงข้อมูลคิวได้สำเร็จ (HTTP 200 OK)
* [ ] **AC-44.2 (Zero PII Assertion):** ตรวจสอบ JSON payload ทุกระดับ ต้องไม่มี key: `username`, `password`, `passwordHash`, `userId`, `fullName`, `tokenVersion`, `handledByStaffId`
* [ ] **AC-44.3 (Accurate Queue Grouping):** ข้อมูลคิวถูกแยกกลุ่มตามซีรีส์ถูกต้อง: ตั๋วสถานะ `CALLED` และ `UNBOXING` อยู่ในหมวด `nowServing` ส่วนตั๋ว `WAITING` อยู่ในหมวด `upNext` เรียงตามเลขคิวน้อยไปมาก ส่วนตั๋ว `COMPLETED`, `CANCELLED`, `NO_SHOW` ไม่แสดงบนบอร์ด
* [ ] **AC-44.4 (UI Display):** หน้าเว็บ `/board` แสดงซีรีส์ทุกซีรีส์ที่เปิดอยู่ พร้อมข้อมูล Now Serving, Up Next และ Waiting Count ตรงกับ API โดยอัปเดตอัตโนมัติทุก 3 วินาที

### 3.6 Software Test Specification (STS: TEST-44)
| Test ID | Level | Test File | Preconditions | Inputs | Expected Output |
| :---: | :---: | :--- | :--- | :--- | :--- |
| **TEST-44A** | Security | `server/tests/api/public-board.test.ts` | มีตั๋วในสถานะ `WAITING`, `CALLED`, `UNBOXING`, `COMPLETED` | `GET /api/public/queue-board` ไม่ใส่ auth | HTTP `200`, JSON ไม่มี PII keys, ตั๋ว `COMPLETED`/`CANCELLED` ไม่แสดง |
| **TEST-44B** | Integration | `server/tests/api/public-board.test.ts` | ซีรีส์ `CRY` มีคิวรอ 3 ตั๋ว กำลังแกะ 1 ตั๋ว | `GET /api/public/queue-board` | `nowServing.length === 1`, `upNext.length <= 3`, `waitingCount === 3` |
| **TEST-44C** | E2E | `e2e/public-board.spec.ts` | Server running, มีตั๋ว Active | เปิดหน้า `/board` | แสดงการ์ดซีรีส์ + หมายเลขคิว, ไม่มีปุ่มที่ต้อง Login |

### 3.7 Definition of Done (DoD) — F-07
- [ ] Public route `/api/public/queue-board` ไม่ผ่าน auth middleware, ใช้ Prisma `select` projection
- [ ] `[RED]` → `[GREEN]` commit chain + PII assertion test
- [ ] Regression Suite ผ่าน 100%
- [ ] UI `/board` Kiosk-style + Auto-polling ทุก 3s + Responsive
- [ ] PR Review + CI ผ่าน + Merge ด้วย `Create a merge commit`

---

## 4. ตารางสรุปการส่งมอบ Sprint 2 (Template — อัปเดตตามผลรันจริง)

| Feature | ACs | Implementation Artifacts | Tests | Result | Tag |
| :--- | :--- | :--- | :--- | :---: | :---: |
| **F-05** Cancel | AC-41.1..41.5 | `ticket.service.ts`, `ticket.routes.ts`, `/my-ticket` UI | TEST-41A..41E | *(รอผลรัน)* | `v0.4.0-sprint2` |
| **F-06** No-Show | AC-42, AC-43.1..43.3 | `staff.service.ts`, `staff.routes.ts`, Staff UI countdown | TEST-42, 43A..43C | *(รอผลรัน)* | `v0.4.0-sprint2` |
| **F-07** Board | AC-44.1..44.4 | `public.service.ts`, `public.routes.ts`, `/board` UI | TEST-44A..44C | *(รอผลรัน)* | `v0.4.0-sprint2` |

---

# Part C: Sprint 3 Contracts and Working Progress (15 คะแนน)

เกณฑ์ Deliverable 2 §3.3 กำหนดให้เขียน **Contract, AC และ STS ที่ละเอียดพอควบคุมการ Implement ได้ สำหรับฟีเจอร์ Sprint 3 ทั้งหมด** และ **ต้องแสดงผลงานจริงอย่างน้อย 1 ฟีเจอร์ (Genuine Working Progress)**

## 1. Feature Contract: F-08 Daily Service Analytics (สถิติบริการประจำวัน)

### 1.1 Purpose & Scope
แสดงสรุปข้อมูลเชิงสถิติเกี่ยวกับประสิทธิภาพการให้บริการประจำวัน เพื่อให้ผู้จัดการร้านประเมินจำนวนคิว อัตรา No-Show และเวลารอเฉลี่ย  
**Actor & Permission:** `BOX_MASTER` เท่านั้น (เนื่องจากเป็นข้อมูลปฏิบัติการภายใน)  
**DB / Migration Impact:** ไม่มี — ใช้ Aggregation Query บนข้อมูลที่มีอยู่ (`QueueTicket` timestamps)

### 1.2 Linked Requirements & Dependencies
* **Requirements:** `FR-14` (Daily Analytics)
* **Dependencies:** `F-03` (Staff Service — ข้อมูล `calledAt`, `startedAt`, `completedAt`), `F-05` / `F-06` (ข้อมูล `CANCELLED` / `NO_SHOW`)

### 1.3 API Specification: GET /api/staff/analytics
* **Route File:** `server/src/routes/staff.routes.ts` (เพิ่ม route)
* **Headers:** `Authorization: Bearer <box_master_jwt>`
* **Query Parameters:**
  * `date` (optional, format `YYYY-MM-DD`, default: วันนี้ ตาม `Asia/Bangkok`)
  * `seriesId` (optional, default: ทุกซีรีส์ที่ Staff ได้รับมอบหมาย)
* **Success Response (HTTP 200 OK):**
  ```json
  {
    "success": true,
    "data": {
      "date": "2026-11-23",
      "series": [
        {
          "seriesCode": "CRY",
          "seriesName": "Crybaby Sunset Concert",
          "totalTickets": 25,
          "completedCount": 18,
          "cancelledCount": 3,
          "noShowCount": 2,
          "waitingCount": 2,
          "avgWaitTimeSeconds": 342,
          "avgServiceTimeSeconds": 185,
          "noShowRate": 0.08
        }
      ]
    }
  }
  ```
* **Computed Fields:**
  * `avgWaitTimeSeconds` = Average of (`calledAt` − `createdAt`) for tickets with `calledAt` ≠ null
  * `avgServiceTimeSeconds` = Average of (`completedAt` − `startedAt`) for `COMPLETED` tickets
  * `noShowRate` = `noShowCount` / (`completedCount` + `noShowCount`)
* **Error Handling:**
  1. `401 UNAUTHENTICATED`
  2. `403 FORBIDDEN_ROLE`: Collector พยายามเข้าถึงสถิติ

### 1.4 UI Specification
* **Route:** แสดงเป็นแท็บหรือ section ภายในหน้า Staff Console
* **Content:** ตาราง/การ์ดแสดงสถิติรายซีรีส์ พร้อมตัวเลข Total, Completed, Cancelled, No-Show, Avg Wait Time, Avg Service Time
* **Date Picker:** เลือกดูย้อนหลังรายวัน

### 1.5 Acceptance Criteria (AC-45) & Test Specification (TEST-45)
* [ ] **AC-45.1 (Accurate Aggregation):** ข้อมูลสถิติรายซีรีส์ตรงกับจำนวนตั๋วจริงใน DB ของวันนั้น
* [ ] **AC-45.2 (Authorization):** Collector เรียก endpoint นี้ได้รับ `403 FORBIDDEN_ROLE`
* [ ] **AC-45.3 (Average Calculation):** `avgWaitTimeSeconds` คำนวณจาก `calledAt - createdAt` ของตั๋วที่ถูกเรียกแล้ว; `avgServiceTimeSeconds` คำนวณจาก `completedAt - startedAt` ของตั๋วที่สำเร็จ; `noShowRate` = noShowCount / (completedCount + noShowCount) หรือ 0 ถ้าหารด้วย 0

| Test ID | Level | Test File | Preconditions | Inputs | Expected Output |
| :---: | :---: | :--- | :--- | :--- | :--- |
| **TEST-45A** | Integration | `server/tests/api/analytics.test.ts` | มีตั๋ว Completed 3, No-Show 1, Cancelled 1, Waiting 2 ในซีรีส์ CRY วันนี้ | `GET /api/staff/analytics` JWT Box Master | HTTP `200`, `completedCount: 3`, `noShowCount: 1`, `noShowRate: 0.25`, `waitingCount: 2` |
| **TEST-45B** | Security | `server/tests/api/analytics.test.ts` | Collector ล็อกอิน | `GET /api/staff/analytics` JWT Collector | HTTP `403 FORBIDDEN_ROLE` |
| **TEST-45C** | Boundary | `server/tests/api/analytics.test.ts` | ไม่มีตั๋วใดในวันที่ระบุ | `GET /api/staff/analytics?date=2026-01-01` | HTTP `200`, `totalTickets: 0`, `avgWaitTimeSeconds: 0`, `noShowRate: 0` |

---

## 2. Feature Contract: F-09 Series Availability Control (เปิด-ปิดซีรีส์) — Genuine Working Progress

ทีมงานเลือกพัฒนา **`F-09`** เป็น Genuine Working Progress ในส่งมอบครั้งนี้ เนื่องจากมีฟิลด์ `Series.isActive` และกฎ `BR-09` / `AC-12` (ปฏิเสธ Join ซีรีส์ที่ปิด → `409 SERIES_CLOSED`) รองรับอยู่แล้วตั้งแต่ Sprint 1

### 2.1 Purpose & Scope
ให้ Box Master สามารถสลับสถานะเปิด (`isActive: true`) หรือปิด (`isActive: false`) ซีรีส์ที่ตนได้รับมอบหมายเท่านั้น  
**ผลลัพธ์เมื่อปิดซีรีส์:**
  * ตั๋วเดิมที่อยู่ในคิว (`WAITING`, `CALLED`, `UNBOXING`) ยังคงให้บริการต่อไปจนจบได้ตามปกติ
  * คำขอ `POST /api/tickets/join` ใหม่จะถูกปฏิเสธด้วย HTTP `409 SERIES_CLOSED` (สอดคล้องกับโค้ดเดิมใน `ticket.service.ts`)  
**DB / Migration Impact:** ไม่มี — ฟิลด์ `Series.isActive` มีอยู่แล้ว

### 2.2 Linked Requirements & Dependencies
* **Requirements:** `FR-15` (Series Toggle), `BR-05` (Staff Series Assignment), `BR-09` (Inactive Series Join Block)
* **Dependencies:** `F-01` (Auth), `F-02` (Series model)

### 2.3 API Specification: PATCH /api/staff/series/:id/status
* **Route File:** `server/src/routes/staff.routes.ts` (เพิ่ม route ใหม่)
* **Service File:** `server/src/services/staff.service.ts` (เพิ่ม method `toggleSeriesStatus`)
* **Headers:** `Authorization: Bearer <box_master_jwt>`
* **Request Body:**
  ```json
  { "isActive": false }
  ```
* **Success Response (HTTP 200 OK):**
  ```json
  {
    "success": true,
    "data": {
      "id": "a1b2c3d4-...",
      "code": "CRY",
      "name": "Crybaby Sunset Concert",
      "isActive": false
    }
  }
  ```
* **Error Handling:**
  1. `401 UNAUTHENTICATED`
  2. `403 FORBIDDEN_ROLE`: Collector
  3. `404 RESOURCE_NOT_FOUND`: ไม่พบซีรีส์
  4. `403 FORBIDDEN_SERIES`: Box Master ไม่ได้รับมอบหมายให้ดูแลซีรีส์นี้

### 2.4 UI Specification
* **ตำแหน่ง:** Toggle Switch บนหน้า Staff Console ข้างชื่อซีรีส์ที่ Staff ได้รับมอบหมาย
* **สถานะ:** สีเขียว (Open) / สีแดง (Closed) พร้อมข้อความ "เปิดรับคิว" / "ปิดรับคิว"
* **Confirm:** "ต้องการปิดรับคิวซีรีส์ CRY หรือไม่? ลูกค้าจะไม่สามารถกดรับบัตรคิวใหม่ได้ ส่วนคิวที่มีอยู่แล้วยังให้บริการต่อได้"

### 2.5 Acceptance Criteria (AC-46) & Test Specification (TEST-46)
* [ ] **AC-46.1 (Authorized Status Toggle):** Box Master ประจำซีรีส์สามารถเปลี่ยนสถานะ `isActive` ได้สำเร็จ (HTTP 200)
* [ ] **AC-46.2 (Join Prevention on Closed Series):** ทันทีที่ซีรีส์ถูกตั้งเป็น `isActive: false` Collector ที่พยายาม Join ต้องได้รับ `409 SERIES_CLOSED` (ทดสอบร่วมกับ `TEST-12` เดิม)
* [ ] **AC-46.3 (Unauthorized Series Toggle):** Box Master ที่ไม่ได้ Assign ซีรีส์นี้พยายาม Toggle ต้องได้รับ `403 FORBIDDEN_SERIES`

| Test ID | Level | Test File | Preconditions | Inputs | Expected Output |
| :---: | :---: | :--- | :--- | :--- | :--- |
| **TEST-46A** | Integration | `server/tests/api/series-toggle.test.ts` | Box Master CRY ล็อกอิน, ซีรีส์ CRY เปิดอยู่ | `PATCH /api/staff/series/:id/status` `{isActive: false}` | HTTP `200`, `isActive: false` |
| **TEST-46B** | Integration | `server/tests/api/series-toggle.test.ts` | ซีรีส์ CRY ปิดอยู่ | Collector: `POST /api/tickets/join` ซีรีส์ CRY | HTTP `409 SERIES_CLOSED` |
| **TEST-46C** | Security | `server/tests/api/series-toggle.test.ts` | Box Master LAB ล็อกอิน | `PATCH /api/staff/series/:crySeries/status` | HTTP `403 FORBIDDEN_SERIES` |

---

## 3. Contract: S3-HARDEN Rate Limiting & System Hardening

### 3.1 Purpose & Scope
ป้องกันการโจมตี Brute Force บน `/api/auth/login` และจำกัดอัตราคำขอ (Rate Limiting) เพื่อความเสถียรของระบบ  
**DB / Migration Impact:** ไม่มี — ใช้ in-memory rate limiter (`express-rate-limit`)

### 3.2 Linked Requirements & Dependencies
* **Requirements:** `NFR-07` (Login Rate Limiting)
* **Dependencies:** `F-01` (Auth Login endpoint)

### 3.3 Technical Specification
* **Middleware:** ใช้ `express-rate-limit` สำหรับ `/api/auth/login`
  * **Window:** 15 นาที
  * **Max Requests per Window:** 10 ครั้งต่อ IP
  * **Response เมื่อเกินขีดจำกัด:** HTTP `429 Too Many Requests` พร้อม `Retry-After` header
* **Scope:** ในระยะแรก (Sprint 3) จำกัดเฉพาะ Login endpoint; อาจขยายไปครอบคลุม `/api/tickets/join` ในอนาคตตามผล Load Test

### 3.4 Acceptance Criteria (AC-47) & Test Specification (TEST-47)
* [ ] **AC-47.1 (Rate Limit Enforcement):** ส่ง Login request 11 ครั้งติดต่อกันจาก IP เดียวกันภายใน 15 นาที ครั้งที่ 11 ต้องได้รับ HTTP `429 Too Many Requests`
* [ ] **AC-47.2 (Normal Operation Unaffected):** Login ภายใต้ขีดจำกัด (≤ 10 ครั้ง) ทำงานตามปกติ ไม่มี False positive

| Test ID | Level | Test File | Preconditions | Inputs | Expected Output |
| :---: | :---: | :--- | :--- | :--- | :--- |
| **TEST-47A** | Integration | `server/tests/security/rate-limit.test.ts` | Rate limiter configured | Loop POST `/api/auth/login` 11 ครั้ง | ครั้งที่ 1–10: HTTP `200` or `401`; ครั้งที่ 11: HTTP `429` |
| **TEST-47B** | Integration | `server/tests/security/rate-limit.test.ts` | หลัง Window reset | POST `/api/auth/login` 1 ครั้ง | HTTP `200` or `401` (ไม่ใช่ `429`) |

---

## 4. สรุปสถานะงาน Sprint 3 และแผนงานที่เหลือ

| Feature / Task | Status in Deliverable 2 | Remaining for Final Delivery (13 ธ.ค.) | Owner |
| :--- | :---: | :--- | :---: |
| **F-09: Series Control** | **Genuine Working Progress** (Contract + Code + Test) | ตกแต่ง UI Toggle Switch ให้สมบูรณ์ | `@apfirst13` |
| **F-08: Service Analytics** | **Contract Defined** (AC + STS ครบ) | Implement Aggregation Query + Dashboard UI | `@Theerawat82` |
| **S3-HARDEN: Rate Limit** | **Contract Defined** (AC + STS ครบ) | ติดตั้ง `express-rate-limit` + ทดสอบ | `@apfirst13` |
| **G-07: ตั๋วค้างข้ามคืน** | **Known Limitation (Documented)** | พิจารณาพัฒนาถ้ามีเวลา; ไม่มี FR/BR รองรับโดยตรง | ทั้งสองคน |

---

# Part D: Updated SRS, SDS, Feature Inventory & Traceability (10 คะแนน)

> **Note (§3.4 / §4.1):** ในรายงาน PDF จะแนบ **SRS ฉบับเต็มปัจจุบัน**, **Feature Inventory** และ **System-Level SDS** ที่อัปเดตให้ตรงกับระบบปัจจุบัน (Cloud Run, Cloud SQL, Migration 0003, BR-02 v2, routes `/board`, `F-05..F-09`) รวมถึงตาราง Traceability Matrix ด้านล่าง

## 1. Feature Inventory (Updated)

| Feature ID | Feature Name | Sprint | Status |
| :---: | :--- | :---: | :---: |
| F-01 | Authentication & Role-Based Access | 1 | **Released** (`v0.1.0-sprint1`) |
| F-02 | Queue Discovery & Safe Joining | 1 (revised Lab 7) | **Released** (`v0.3.0-lab7` / BR-02 v2) |
| F-03 | Staff Service Counter & Call/Complete | 1 | **Released** (`v0.1.0-sprint1`) |
| F-04 | Ticket Inspection & Ownership | 1 (extended Lab 7) | **Released** (`v0.3.0-lab7` / multi-ticket) |
| F-05 | Queue Cancellation | **2** | *(Sprint 2 — Contract Ready)* |
| F-06 | Server-Enforced 120s No-Show | **2** | *(Sprint 2 — Contract Ready)* |
| F-07 | Public Queue Display Board | **2** | *(Sprint 2 — Contract Ready)* |
| F-08 | Daily Service Analytics | 3 | *(Sprint 3 — Contract Ready)* |
| F-09 | Series Availability Control | **3 (Progress)** | *(Sprint 3 — Genuine Working Progress)* |
| S3-HARDEN | Rate Limiting & Security | 3 | *(Sprint 3 — Contract Ready)* |

## 2. Requirements Traceability Matrix (Updated for Sprint 2 & 3)

| Req ID | Category | Feature | Sprint | Acceptance Criteria | Test Spec | Actual Test File on `main` | Status |
| :---: | :--- | :---: | :---: | :--- | :--- | :--- | :---: |
| **FR-01** | Authentication | F-01 | 1 | AC-01..03, AC-05 | TEST-01..03, 05 | `server/tests/api/auth.test.ts` | Verified (`v0.3.0-lab7`) |
| **FR-02** | Logout | F-01 | 1 | AC-06 | TEST-06 | `server/tests/api/auth.test.ts` | Verified |
| **FR-03** | Series Discovery | F-02 | 1 | AC-09 | TEST-09 | `server/tests/api/series.test.ts` | Verified |
| **FR-04** | Queue Join | F-02 | 1,7 | AC-10,12,13,19 | TEST-10,12,13,19 | `server/tests/api/join.test.ts`, `e2e/join-queue.spec.ts` | Verified (Lab 7 Revised) |
| **FR-05** | My Ticket | F-04 | 1,7 | AC-34,35 | TEST-34,35 | `server/tests/api/my-ticket.test.ts` | Verified (Multi-cards) |
| **FR-06** | Ticket Security | F-04 | 1 | AC-36,37,38 | TEST-36,37,38 | `server/tests/api/ticket-detail.test.ts`, `server/tests/api/ticket-security.test.ts` | Verified |
| **FR-07** | Staff Queue View | F-03 | 1 | AC-21 | TEST-21 | `server/tests/api/staff-tickets.test.ts` | Verified |
| **FR-08** | Staff Call Next | F-03 | 1 | AC-22..25 | TEST-22..25 | `server/tests/api/call-next.test.ts` | Verified |
| **FR-09** | Staff Start Unbox | F-03 | 1 | AC-26 | TEST-26 | `server/tests/api/staff-transition.test.ts` | Verified |
| **FR-10** | Staff Complete | F-03 | 1 | AC-27,33 | TEST-27,33 | `server/tests/api/staff-transition.test.ts`, `e2e/full-journey.spec.ts` | Verified |
| **FR-11** | Cancel Queue | **F-05** | **2** | AC-41.1..41.5 | TEST-41A..41E | `server/tests/api/cancel.test.ts` *(Sprint 2)* | *(Contract Ready)* |
| **FR-12** | No-Show | **F-06** | **2** | AC-42, AC-43.1..43.3 | TEST-42, 43A..43C | `server/tests/api/no-show.test.ts` *(Sprint 2)* | *(Contract Ready)* |
| **FR-13** | Public Board | **F-07** | **2** | AC-44.1..44.4 | TEST-44A..44C | `server/tests/api/public-board.test.ts` *(Sprint 2)* | *(Contract Ready)* |
| **FR-14** | Analytics | **F-08** | **3** | AC-45.1..45.3 | TEST-45A..45C | `server/tests/api/analytics.test.ts` *(Sprint 3)* | *(Contract Ready)* |
| **FR-15** | Series Toggle | **F-09** | **3** | AC-46.1..46.3 | TEST-46A..46C | `server/tests/api/series-toggle.test.ts` *(Sprint 3)* | *(Working Progress)* |
| **BR-01** | Atomic Numbers | F-02 | 1,2 | AC-10,18,41.3 | TEST-10,18,41B | `server/tests/concurrency/numbering.test.ts` | Verified |
| **BR-02** | 1 Active/Series | F-02 | 1,7 | AC-11(Rev),16(Ext) | TEST-11,16 | `server/tests/concurrency/duplicate.test.ts` | Verified (Lab 7 v2) |
| **BR-03** | State Machine | F-03,F-05,F-06 | 1,2 | AC-22,26,27,41.5 | TEST-28,41D,41E | `server/tests/unit/state-machine.test.ts` | Verified |
| **BR-04** | Role Guard | All | 1 | AC-08,14,31 | TEST-08U,14,31 | `server/tests/unit/role-guard.test.ts` | Verified |
| **BR-05** | Staff Series | F-03 | 1,3 | AC-25,29,46.3 | TEST-25,29,46C | `server/tests/api/staff-tickets.test.ts`, `server/tests/api/call-next.test.ts` | Verified |
| **BR-06** | Staff Single | F-03 | 1,2 | AC-24,32,43.2 | TEST-24,32,43B | `server/tests/api/call-next.test.ts` | Verified |
| **BR-07** | Handler Excl. | F-03 | 1,2 | AC-26,30,43.3 | TEST-26,30,43C | `server/tests/api/staff-transition.test.ts` | Verified |
| **BR-08** | 120s Timeout | **F-06** | **2** | AC-42,43.1 | TEST-42,43A | `server/tests/api/no-show.test.ts` *(Sprint 2)* | *(Contract Ready)* |
| **BR-09** | Inactive Block | F-02,F-09 | 1,3 | AC-12,46.2 | TEST-12,46B | `server/tests/api/join.test.ts` | Verified |
| **NFR-01** | Bcrypt ≥ 10 | F-01 | 1 | AC-07 | TEST-07 | `server/tests/security/password-hash.test.ts` | Verified |
| **NFR-02** | Privacy/No PII | F-07 | 1,2 | AC-04,44.2 | TEST-04,44A | `server/tests/security/unauthenticated.test.ts` | Verified |
| **NFR-03** | Concurrency | F-02 | 1 | AC-15 | TEST-15 | `server/tests/concurrency/numbering.test.ts` | Verified |
| **NFR-04** | Race Guard | F-02 | 1 | AC-16 | TEST-16 | `server/tests/concurrency/duplicate.test.ts` | Verified |
| **NFR-05** | Persistence | Infra | 1,5 | AC-39 | TEST-39 | `scripts/test-persistence.mjs` | Verified |
| **NFR-06** | Responsive | UI | 1,2 | AC-20,44.4 | TEST-20 | `e2e/responsive.spec.ts` | Verified |
| **NFR-07** | Rate Limit | **S3** | **3** | AC-47.1,47.2 | TEST-47A,47B | `server/tests/security/rate-limit.test.ts` *(Sprint 3)* | *(Contract Ready)* |

---

# Part E: Integrated Release Candidate, Demonstrations & Finish Plan (15 คะแนน)

## 1. Release Candidate & Deployment
* **Target Tag:** `v0.4.0-sprint2` on `main`
* **Deployment:** GCP Cloud Run (เดียวกับ Lab 5 CI/CD Pipeline)
  * GitHub Actions CI: Build → Test → Docker Image → Push Artifact Registry → Migration Job → Cloud Run Service Update
* **Post-Deployment Verification:**
  1. `GET /api/health` → `200 OK` พร้อม Git Commit SHA ตรงกับ Release Tag
  2. Public Board (`/board`) เข้าถึงได้โดยไม่ต้อง Login
  3. Cancel Live Check: Collector กดรับคิว → กดยกเลิก → กด Join ใหม่ได้สำเร็จ
  4. No-Show Live Check: Box Master เรียกคิว → รอ ≥ 120s → กดตัด No-Show → เรียกคิวถัดไปสำเร็จ
  5. Persistence: ตั๋ว `CANCELLED` / `NO_SHOW` ยังคงอยู่ใน Cloud SQL หลัง Redeploy

## 2. Release Readiness Verdict
*(จะเติมหลังรันเทสต์และ Deploy ครบ — ระบุ `READY` หรือ `NOT READY` พร้อมเหตุผล)*

## 3. Program Demonstrations (ตามเกณฑ์ §4.1 — ใส่ในรายงาน PDF)
เกณฑ์กำหนดให้แสดง:
1. **Sprint 1 Continuity:** แคปหน้าจอ Journey เดิม (Login → Join → Call → Start → Complete) บนระบบปัจจุบัน
2. **Sprint 2 Feature Demo #1 (F-05 Cancel):** แคป API + UI ของกระบวนการยกเลิก พร้อม `403 FORBIDDEN_OWNERSHIP` ของ Backend
3. **Sprint 2 Feature Demo #2 (F-06 No-Show):** แคป API + UI ของ No-Show Countdown + ตัดสิทธิ์ + Staff หลุด BUSY
4. **Sprint 3 Working Progress Demo (F-09 Series Toggle):** แคป API + UI ของการเปิด-ปิดซีรีส์ + Collector ถูกปฏิเสธด้วย `409 SERIES_CLOSED`
5. **Backend 403 Evidence:** อย่างน้อย 1 กรณีที่แสดง API คืน `403 FORBIDDEN_*` (ไม่ใช่แค่ UI ซ่อนปุ่ม)

## 4. Tests & History (ตามเกณฑ์ §4.1 — ใส่ในรายงาน PDF)
1. **Build/Test/CI Commands:** `npm run build`, `npm test`, `npm run test:e2e` พร้อมจำนวน pass/fail/skip
2. **Test Excerpt #1 (Domain Rule):** TEST-41A หรือ TEST-43A — แสดงโค้ดทดสอบและผลรัน (ตรวจกฎธุรกิจ Cancel/No-Show)
3. **Test Excerpt #2 (Access Restriction):** TEST-41C หรือ TEST-43C — แสดงโค้ดทดสอบและผลรัน (ตรวจ `403 FORBIDDEN_OWNERSHIP` / `FORBIDDEN_NOT_HANDLER`)
4. **TDD Red/Green Evidence:** `[RED]` commit SHA + ผล test fail + `[GREEN]` commit SHA + ผล test pass + `git diff --stat` ระหว่าง 2 commits
5. **Issue/PR Chain #1:** แสดง Issue → Branch → PR → Review Comment → Staging → Main สำหรับ F-05
6. **Issue/PR Chain #2:** แสดง Issue → Branch → PR → Review Comment → Staging → Main สำหรับ F-06

## 5. แผนการดำเนินงาน (Finish Plan: 24–29 พ.ย. 2026 Sprint 2 → 30 พ.ย.–13 ธ.ค. Final)

### Sprint 2 Execution (24–29 พ.ย.)
| วัน | กิจกรรม | ผู้รับผิดชอบ |
| :---: | :--- | :---: |
| **อ. 24 – พ. 25 พ.ย.** | Implement F-05 (Cancel): TDD [RED] → [GREEN] → PR → Review → Merge to `lab5-staging` | `@apfirst13` (Author) / `@Theerawat82` (Reviewer) |
| **พ. 25 – พฤ. 26 พ.ย.** | Implement F-06 (No-Show): TDD [RED] → [GREEN] → PR → Review → Merge to `lab5-staging` | `@Theerawat82` (Author) / `@apfirst13` (Reviewer) |
| **พฤ. 26 – ศ. 27 พ.ย.** | Implement F-07 (Board) + F-09 (Series Toggle Working Progress): TDD → PR → Review | แบ่งงานคู่ขนาน |
| **ส. 28 พ.ย.** | Full Regression Test + Release `lab5-staging` → `main` + Tag `v0.4.0-sprint2` + Deploy | ทั้งสองคน |
| **อา. 29 พ.ย.** | Post-Deployment Live Check + เก็บ Demo Screenshots + เขียน PDF → **ส่ง LEB2 ก่อน 23:59** | ทั้งสองคน |

### Final Delivery (30 พ.ย. – 13 ธ.ค.)
| ช่วงวันที่ | กิจกรรม | ผู้รับผิดชอบ |
| :---: | :--- | :---: |
| 30 พ.ย. – 3 ธ.ค. | F-08 Daily Service Analytics | `@Theerawat82` |
| 4 – 6 ธ.ค. | S3-HARDEN (Rate Limit) + Edge cases | `@apfirst13` |
| 7 – 9 ธ.ค. | Full Regression + Load Test | ทั้งสองคน |
| 10 – 11 ธ.ค. | ถ่ายทำ Final Video ≤ 4 นาที | ทั้งสองคน |
| 12 – 13 ธ.ค. | PDF Final Delivery + Tag `v1.0.0-final` → **ส่ง LEB2 ก่อน 23:59** | ทั้งสองคน |

---

# Section 4: Setup, Contributions & AI Use (ใส่ในรายงาน PDF)

## 1. Setup Summary
*(จะเติมคำสั่ง Setup สำหรับผู้ตรวจรัน: `git clone`, `npm install`, `docker compose up`, `.env` configuration, `npm run db:migrate`, `npm run db:seed`, `npm test`, `npm run dev`)*

## 2. Safe Test Accounts
*(จะเติมรายชื่อ username/password สำหรับ Collector และ Box Master ที่ผู้ตรวจใช้ทดสอบได้อย่างปลอดภัย)*

## 3. Contribution Table
| หัวข้อ / Feature | `@apfirst13` | `@Theerawat82` |
| :--- | :---: | :---: |
| Sprint 2 Contract & Planning | ✅ | ✅ |
| F-05 Cancel (Author) | *(จะเติม)* | *(จะเติม)* |
| F-06 No-Show (Author) | *(จะเติม)* | *(จะเติม)* |
| F-07 Public Board | *(จะเติม)* | *(จะเติม)* |
| F-09 Series Toggle (Progress) | *(จะเติม)* | *(จะเติม)* |
| PR Reviews | ✅ | ✅ |
| PDF Report | *(จะเติม)* | *(จะเติม)* |

## 4. AI-Use Declaration
*(จะเติมรายละเอียดการใช้งาน AI Agent ตามเกณฑ์ของรายวิชา)*

---

> **เอกสารนี้จัดทำขึ้นเพื่อใช้เป็น:**
> 1. สัญญาทางวิศวกรรม (Engineering Contract) ก่อนเริ่มลงมือเขียนโค้ดของ Sprint 2 & 3
> 2. โครงร่างหลักสำหรับการ Export เป็นไฟล์รายงาน PDF ของ Project Deliverable 2 ตามเกณฑ์ประเมินของรายวิชา CPE 334
> 3. Branch `sprint-2-docs` นี้จะ **ไม่ Merge เข้า `main` หรือ `lab5-staging`** — เป็น Reference Branch สำหรับอ่านอ้างอิงเท่านั้น
