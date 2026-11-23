# PopQueue — Project Deliverable 2 Master Contract & Specification
> **Core Expansion (Sprint 2) & Genuine Progress (Sprint 3) with GCP Deployment**  
> **Course:** CPE 334 Introduction to Software Engineering in the Age of AI Agents (Semester 1/2026, KMUTT)  
> **Project / Theme:** **PopQueue** — Theme 9: Queue and Service Management System (*Art Toy Live Unboxing Station*)  
> **Repository:** `https://github.com/apfirst13/PopQueue_BFteam`  
> **Team Members:** `@apfirst13` (aphiwat) & `@Theerawat82` (Theerawat)  
> **Deliverable:** Project Deliverable 2 (70 Points | 7% of Course Grade)  
> **Submission Deadline:** **Sunday, 29 November 2026 at 23:59** (via LEB2, single self-contained PDF)  
> **Baseline Release:** `v0.1.0-sprint1` (`d946159ba82a249c195730a3b702cf0f68e96e2d`)  
> **Maintenance Baseline:** Lab 7 Release `v0.3.0-lab7` (`BR-02 v2` via Issue `#52`)  
> **Target Release Candidate:** Tag `v0.2.0-sprint2` on `main` deployed to GCP Cloud Run

---

## สารบัญและโครงสร้างตามเกณฑ์ประเมิน (Rubric Navigation Table)

| ส่วนของเอกสาร (Rubric Part) | คะแนน | หัวข้อหลักและเนื้อหาที่ประเมิน |
| :--- | :---: | :--- |
| **Part A: Sprint 1 Continuity & Change Status** | **5** | • ยืนยัน Critical Domain Journey บน Baseline Sprint 1 (`v0.1.0-sprint1`)<br>• Change & Defect Register ครอบคลุม Lab 5 (GCP), Lab 6 (#47 UAT Fix) และ Lab 7 (BR-02 v2 #52)<br>• บันทึกการปรับปรุง Baseline และเหตุผลทางวิศวกรรม |
| **Part B: Sprint 2 Contracts & Working Increment** | **25** | • Engineering Contracts ฉบับสมบูรณ์ของ **F-05** (Cancel), **F-06** (120s No-Show), **F-07** (Public Board)<br>• ข้อกำหนด API, Data Model, Error Boundary, Permissions, และ State Machine<br>• Numbered Acceptance Criteria (`AC-41`..`AC-44`) และ Software Test Specification (`TEST-41`..`TEST-44`)<br>• แผนงาน TDD (`[RED]` $\rightarrow$ `[GREEN]`), PR Review 5-Lenses, และตารางสรุปผลการพัฒนา |
| **Part C: Sprint 3 Contracts & Working Progress** | **15** | • Engineering Contracts ของฟีเจอร์ Sprint 3 ทั้งหมด (**F-08**, **F-09**, **S3-HARDEN**)<br>• **Genuine Working Progress:** ข้อกำหนดและการลงมือทำจริงของ **F-09 (Series Availability Control)**<br>• ตารางสถานะงาน (Planned, In Progress, Implemented, Accepted)<br>• บัญชีงานคงเหลือและแผนส่งมอบ Final Delivery (13 ธ.ค. 2026) |
| **Part D: Updated Requirements & Test Traceability** | **10** | • ปรับปรุง SRS, SDS และ Inventory ให้ตรงกับระบบจริงในปัจจุบัน<br>• ตารางสอบกลับความต้องการ 1:1 ครบวงจร (`FR-01`..`15`, `BR-01`..`09`, `NFR-01`..`07`)<br>• การเปิดเผย Coverage Gaps และการเชื่อมโยงผลทดสอบจริง |
| **Part E: Integrated Release Candidate & Readiness** | **15** | • Release Candidate รวมบน `main`, Full Suite Automated Regression & Stability<br>• รายงานการ Deploy บน GCP Cloud Run และ Post-Deployment Verification<br>• การประเมินความพร้อม (Release Readiness Verdict) และแผนปฏิบัติงานสู่วันที่ 13 ธ.ค. |
| **รวมทั้งหมด (Total)** | **70** | **70 คะแนน (7% ของเกรดวิชา)** |

---

# Part A: Sprint 1 Continuity and Change Status (5 คะแนน)

## 1. การยืนยันความต่อเนื่องของ Sprint 1 (Sprint 1 Baseline & Continuity)
* **Accepted Baseline Release:** Tag `v0.1.0-sprint1` (Commit `d946159ba82a249c195730a3b702cf0f68e96e2d`)
* **Original Critical Domain Journey Verification:**
  เส้นทางการทำงานหลักของระบบที่ส่งมอบใน Sprint 1 (Collector Login $\rightarrow$ Join Queue `CRY` $\rightarrow$ Staff Login $\rightarrow$ Call Next $\rightarrow$ Verify & Start $\rightarrow$ Complete Unboxing) ยังคงทำงานได้ถูกต้อง 100% บน Codebase ปัจจุบัน โดยไม่เกิด Regression จากการเพิ่มฟีเจอร์ใหม่
  * รันยืนยันผ่าน Automated E2E Suite: `npx playwright test e2e/full-journey.spec.ts`
  * ผลลัพธ์: ผ่านทุกขั้นตอน (`PASS 13/13 assertions`)

## 2. ทะเบียนการเปลี่ยนแปลงและข้อบกพร่อง (Change & Defect Register: Labs 5–7)

ตลอดการพัฒนาจาก Sprint 1 สู่ Sprint 2 ทีมงานได้ผ่านกระบวนการปรับปรุงระบบ CI/CD, การทดสอบ UAT ข้ามทีม และการบำรุงรักษาเชิงวิศวกรรม ดังนี้:

| Finding ID | แหล่งที่มา (Source) | รายการ / ข้อกำหนดที่กระทบ | คำอธิบายและสาเหตุ | การตัดสินใจและการแก้ไข | สถานะ / เวอร์ชันที่แก้ | ผลการทดสอบซ้ำ (Re-test) |
| :---: | :---: | :---: | :--- | :--- | :---: | :---: |
| **DEF-01** | Lab 6 Blind UAT (Team Omega-3) | `FR-01`, `AC-03` (Authentication) | Login ไม่ส่ง password แล้ว API คืน HTTP 500 แทน HTTP 400 `VALIDATION_ERROR` (GitHub Issue `#47`) | เพิ่ม Zod schema validation สำหรับ password และตรวจจับ undefined/null ให้คืน 400 | **RESOLVED** (`v0.1.1-lab6`, Commit `72e1bb5`) | **PASS** — Omega-3 ตรวจสอบซ้ำยืนยันผลผ่าน และปิด Issue `#47` |
| **CHG-01** | Lab 5 CI/CD & Cloud Run | `NFR-05` (Persistence & Deployment) | ติดตั้ง Dockerfile Multi-stage, GitHub Actions CI/CD with WIF, Cloud Run + Cloud SQL PostgreSQL | ใช้ Cloud Run Job `popqueue-migrate` เพื่อรัน Migration ก่อน deploy Service อัตโนมัติ | **RESOLVED** (`v0.1.0-lab5`, Commit `2aee62b`) | **PASS** — Container restart & redeploy persistence verified 3/3 ครั้ง |
| **CHG-02** | Lab 7 Maintenance Request | `FR-04`, `FR-05`, `BR-02`, `D-08` | ปรับปรุงกฎธุรกิจ `BR-02` จากเดิม "ถือตั๋ว active ได้สูงสุด 1 ใบทั้งระบบ" เป็น **"ถือตั๋ว active ได้สูงสุด 1 ใบต่อซีรีส์"** (GitHub Issue `#52`) | ได้รับการอนุมัติเป็นลายลักษณ์อักษรจาก TA (23 พ.ย. 15:30); ทำ Zero-Gap Migration `0003` สร้าง Partial Unique Index ใหม่ และปรับปรุง API `GET /api/tickets/my-ticket` คืน `tickets: []` | **IN PROGRESS** (`v0.3.0-lab7`, PR `#57` $\rightarrow$ `#53`..`#55`) | **PENDING** — ผ่าน Contract Review (PR `#57`), เตรียมทำ `[RED]` และ Migration `0003` |

## 3. Approved Baseline Revisions & Rationale
1. **การปรับปรุง BR-02 (v2 via D-08):** รองรับพฤติกรรมร้าน Art Toy จริง ที่มีสเตชัน Live Unboxing แยกเป็นอิสระต่อซีรีส์ ลูกค้าที่ซื้อกล่องสุ่มหลายซีรีส์ควรสามารถต่อคิวแกะกล่องข้ามซีรีส์พร้อมกันได้ โดยยังคงห้ามกักตั๋วซ้ำในซีรีส์เดียวกัน (`AC-11 Revised`, `AC-16 Extended`)
2. **การคงสภาพ Invariant เดิม:** สิทธิ์ Role-Based Access Control (`COLLECTOR` ห้ามเข้าหน้า Staff, `BOX_MASTER` ห้ามจองคิว), สิทธิ์การเข้าถึงเฉพาะตั๋วตนเอง (Ownership 403), และการทำงานของ State Machine ยังคงบังคับใช้อย่างเข้มงวดที่ API Layer และ Database Constraint เช่นเดิม

---

# Part B: Sprint 2 Contracts and Working Increment (25 คะแนน)

ใน Sprint 2 นี้ ระบบ PopQueue ทำการขยายขีดความสามารถหลัก (Core Expansion) 3 ฟีเจอร์ เพื่อแก้ปัญหาคอขวดที่เปิดเผยไว้ในข้อจำกัดของ Sprint 1:
1. **`F-05` Queue Cancellation:** ให้ลูกค้ายกเลิกคิวตนเองขณะรอได้
2. **`F-06` Server-Enforced 120s No-Show:** พนักงานตัดสิทธิ์ลูกค้าที่ไม่มาตามเรียกภายใน 120 วินาที ปลดล็อกพนักงานพ้นจาก `STAFF_BUSY`
3. **`F-07` Public Queue Display Board:** จอบอร์ดสาธารณะหน้าร้าน ไม่ต้องล็อกอิน และไม่มีข้อมูลส่วนบุคคลหลุด

---

## 1. Feature Contract: F-05 Queue Cancellation (ลูกค้ายกเลิกตั๋วตนเอง)

```
[WAITING] ────── (POST /api/tickets/:id/cancel) ──────> [CANCELLED]
    │                                                        │
    └─ (ถือโควตา active ticket ในซีรีส์นั้น)                     └─ (ปลดล็อกโควตาทันที, เลขคิวไม่นำกลับมาใช้ซ้ำ)
```

### 1.1 Purpose & Scope
อนุญาตให้ Collector ยกเลิกตั๋วคิวที่ตนเองถืออยู่ขณะที่ตั๋วยังอยู่ในสถานะ `WAITING` เพื่อเปิดโอกาสให้ผู้อื่น และเพื่อปลดล็อกโควตาให้ตนเองสามารถไปกดรับบัตรคิวในซีรีส์อื่นหรือต่อคิวใหม่ได้  
**นอก Scope:** ยกเลิกตั๋วที่ถูกเรียกแล้ว (`CALLED`), กำลังให้บริการ (`UNBOXING`), หรือจบแล้ว (`COMPLETED`)

### 1.2 Linked Requirements & Dependencies
* **Requirements:** `FR-11` (Cancel Ticket), `BR-01` (Non-reuse numbering), `BR-02 v2` (Active quota per series), `BR-04` (Role Guard)
* **Dependencies:** `F-01` (Authentication), `F-02` (Queue Ticket in WAITING state)

### 1.3 State Machine & Data Model Impact
* **State Transition:** `WAITING` $\rightarrow$ `CANCELLED` (ทิศทางเดียว ไม่สามารถย้อนกลับได้)
* **Database Updates:**
  * อัปเดต `QueueTicket.status = 'CANCELLED'`
  * บันทึกประทับเวลา `QueueTicket.forfeitedAt = now()`
  * *ผลลัพธ์ต่อ Constraint:* เมื่อตั๋วเปลี่ยนเป็น `CANCELLED` จะหลุดออกจากเงื่อนไข Partial Unique Index `WHERE status IN ('WAITING','CALLED','UNBOXING')` ทำให้ Collector สามารถกดคิวซีรีส์เดิมใหม่ได้ทันที
  * *ผลลัพธ์ต่อ Counter:* `QueueCounter.lastNumber` **ไม่ลดลง** เลขคิวที่ถูกยกเลิกจะถูกข้ามไปอย่างถาวรเพื่อป้องกันความสับสน

### 1.4 API Specification: POST /api/tickets/:id/cancel
* **Method & Path:** `POST /api/tickets/:id/cancel`
* **Headers:** `Authorization: Bearer <collector_jwt_token>`
* **Path Parameters:** `id: string` (UUID ของตั๋ว)
* **Request Body:** ไม่มี (Empty Body)
* **Success Response (HTTP 200 OK):**
  ```json
  {
    "success": true,
    "data": {
      "id": "7c9e6679-7425-40de-944b-e07fc1f90ae7",
      "seriesId": "a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d",
      "displayNumber": "CRY-003",
      "status": "CANCELLED",
      "forfeitedAt": "2026-11-23T13:45:00.000Z"
    }
  }
  ```
* **Error Handling & Status Codes (Deterministic Order):**
  1. `401 UNAUTHENTICATED`: ไม่มี Token หรือ Token ปลอม/หมดอายุ
  2. `403 FORBIDDEN_ROLE`: ผู้เรียกมีบทบาทเป็น `BOX_MASTER` (พนักงานไม่มีสิทธิ์กดยกเลิกแทนลูกค้า)
  3. `404 RESOURCE_NOT_FOUND`: ไม่พบตั๋ว ID ที่ระบุในระบบ
  4. `403 FORBIDDEN_OWNERSHIP`: ผู้เรียกไม่ใช่เจ้าของตั๋ว (`ticket.userId !== auth.userId`)
  5. `409 INVALID_STATE_TRANSITION`: ตั๋วไม่ได้อยู่ในสถานะ `WAITING` (เช่น ถูก `CALLED` ไปแล้ว หรือถูกยกเลิกไปก่อนหน้า)

### 1.5 Numbered Acceptance Criteria (AC)
* [ ] **AC-41.1 (Valid Cancellation):** Collector ที่มีตั๋วสถานะ `WAITING` เมื่อส่งคำขอยกเลิกสำเร็จ ได้รับ HTTP 200, สถานะเปลี่ยนเป็น `CANCELLED`, มีค่า `forfeitedAt` เป็นเวลาปัจจุบัน
* [ ] **AC-41.2 (Quota Release & Re-join):** หลังยกเลิกสำเร็จ Collector สามารถกด `POST /api/tickets/join` เข้าซีรีส์เดิมได้ทันที และได้รับเลขคิวถัดไปโดยไม่ติด `409 DUPLICATE_ACTIVE_QUEUE`
* [ ] **AC-41.3 (Numbering Continuity):** เลขคิวที่ถูกยกเลิก (เช่น `CRY-003`) จะไม่ถูกนำกลับมาออกซ้ำ คิวถัดไปที่กดเข้ามาระบบต้องออกเป็น `CRY-004`
* [ ] **AC-41.4 (Forbidden Ownership):** Collector A พยายามยกเลิกตั๋วของ Collector B ต้องถูกปฏิเสธด้วย HTTP `403 FORBIDDEN_OWNERSHIP` ตั๋วของ B ต้องคงสถานะเดิม
* [ ] **AC-41.5 (Invalid Transition on CALLED/COMPLETED):** เมื่อตั๋วถูก Box Master เรียกแล้ว (`CALLED`) หรือให้บริการอยู่ (`UNBOXING`) Collector กดยกเลิกต้องได้รับ HTTP `409 INVALID_STATE_TRANSITION`

### 1.6 Software Test Specification (STS: TEST-41)
| Test ID | Test Level | Test File | Preconditions | Inputs / Actions | Expected Output & Assertions |
| :---: | :---: | :--- | :--- | :--- | :--- |
| **TEST-41A** | API Integration | `server/tests/api/cancel.test.ts` | Collector 1 ล็อกอิน, ถือตั๋ว `CRY-001` (`WAITING`) | `POST /api/tickets/:id/cancel` พร้อม JWT Collector 1 | • HTTP `200 OK`<br>• `status: "CANCELLED"`<br>• `forfeitedAt` ไม่เป็น null<br>• ตรวจใน DB สถานะเปลี่ยนจริง |
| **TEST-41B** | API Integration | `server/tests/api/cancel.test.ts` | Collector 1 เพิ่งยกเลิกตั๋ว `CRY-001` สำเร็จ | `POST /api/tickets/join` ซีรีส์ `CRY` อีกครั้ง | • HTTP `201 Created`<br>• `displayNumber: "CRY-002"`<br>• มีตั๋ว active ใน DB รวม 1 ใบ |
| **TEST-41C** | API Security | `server/tests/api/cancel.test.ts` | Collector 1 ถือตั๋ว `CRY-001`, Collector 2 ล็อกอิน | Collector 2 ส่ง `POST /api/tickets/<ticket-1-id>/cancel` | • HTTP `403 FORBIDDEN_OWNERSHIP`<br>• ตั๋ว 1 ยังคงเป็น `WAITING` |
| **TEST-41D** | API Boundary | `server/tests/api/cancel.test.ts` | ตั๋ว `CRY-001` ถูก Box Master สั่ง Call แล้ว (`CALLED`) | Collector 1 ส่ง `POST /api/tickets/:id/cancel` | • HTTP `409 INVALID_STATE_TRANSITION`<br>• ตั๋วคงสถานะ `CALLED` |
| **TEST-41E** | Unit Test | `server/tests/unit/state-machine.test.ts` | State machine transition validator | เรียกฟังก์ชันตรวจการเปลี่ยนสถานะจากทุกสถานะสู่ `CANCELLED` | • อนุญาตเฉพาะ `WAITING`<br>• ปฏิเสธเมื่อต้นทางเป็น `CALLED`, `UNBOXING`, `COMPLETED` |

---

## 2. Feature Contract: F-06 Server-Enforced 120s No-Show (ตัดสิทธิ์ลูกค้าไม่มาตามเรียก)

```
[WAITING] ── (Staff Call) ──> [CALLED] ── (ผ่านไป >= 120 วินาที & ลูกค้าไม่มา) ──> [NO_SHOW]
                                (พนักงานติด STAFF_BUSY)                                   (พนักงานพ้นสภาพ BUSY ทันที)
```

### 2.1 Purpose & Scope
แก้ปัญหาค้างคาของ Sprint 1 (ที่ไม่มี No-Show ทำให้พนักงานติด `STAFF_BUSY` เมื่อลูกค้าหนีหาย): เมื่อตั๋วถูกเรียก (`CALLED`) ระบบจะเริ่มนับเวลา หากเกิน 120 วินาทีแล้วลูกค้าไม่มาแสดงตัวที่เคาน์เตอร์ Box Master สามารถกดตัดสิทธิ์ No-Show เพื่อปลดล็อกตนเองให้สามารถเรียกคิวถัดไปได้  
**ข้อกำหนดความปลอดภัย (BR-08):** ห้ามตัด No-Show ก่อนเวลา 120 วินาทีโดยเด็ดขาด

### 2.2 Linked Requirements & Dependencies
* **Requirements:** `FR-12` (No-Show Timeout), `BR-03` (State Machine), `BR-05` (Staff Series Assignment), `BR-06` (Single Active Handling), `BR-07` (Handler Exclusive), `BR-08` (120s Timeout Rule)
* **Dependencies:** `F-03` (Staff Call Queue, `calledAt` timestamp)

### 2.3 Server Validation Rule & Clock Injection
* เมื่อได้รับคำขอตัด No-Show เซิร์ฟเวอร์จะเปรียบเทียบเวลา:
  $$\Delta t = \text{currentTime} - \text{ticket.calledAt}$$
  * ถ้า $\Delta t < 120\text{ seconds}$ $\rightarrow$ ส่งคืน HTTP `400 NO_SHOW_WINDOW_NOT_EXPIRED`
  * ถ้า $\Delta t \ge 120\text{ seconds}$ $\rightarrow$ อนุญาตให้เปลี่ยนสถานะเป็น `NO_SHOW`
* **Test Architecture Support:** ในโค้ด Backend จะใช้ `AppOptions { clock?: IClock }` เพื่อรองรับการ Inject `FakeClock` ในการทดสอบ Unit/Integration ทำให้สามารถรันเทสต์กรณี $\ge 120$ วินาทีได้ทันทีโดยไม่ต้อง `sleep` รอจริง 2 นาที

### 2.4 API Specification: POST /api/staff/tickets/:id/no-show
* **Method & Path:** `POST /api/staff/tickets/:id/no-show`
* **Headers:** `Authorization: Bearer <box_master_jwt_token>`
* **Path Parameters:** `id: string` (UUID ของตั๋ว)
* **Success Response (HTTP 200 OK):**
  ```json
  {
    "success": true,
    "data": {
      "id": "7c9e6679-7425-40de-944b-e07fc1f90ae7",
      "displayNumber": "CRY-001",
      "status": "NO_SHOW",
      "forfeitedAt": "2026-11-23T13:47:05.000Z",
      "staffStatus": "IDLE"
    }
  }
  ```
* **Error Handling & Status Codes (Deterministic Order):**
  1. `401 UNAUTHENTICATED`: ไม่ได้ยืนยันตัวตน
  2. `403 FORBIDDEN_ROLE`: ผู้เรียกไม่ใช่ `BOX_MASTER` (Collector ตัด No-Show ไม่ได้)
  3. `404 RESOURCE_NOT_FOUND`: ไม่พบตั๋ว ID ที่ระบุ
  4. `403 FORBIDDEN_SERIES`: Box Master ไม่ได้รับมอบหมายให้ดูแลซีรีส์ของตั๋วใบนี้
  5. `403 FORBIDDEN_NOT_HANDLER`: พนักงานคนนี้ไม่ใช่ผู้ที่กด Call ตั๋วนี้ไว้ (`ticket.handledByStaffId !== staff.id`)
  6. `409 INVALID_STATE_TRANSITION`: ตั๋วไม่ได้อยู่ในสถานะ `CALLED` (เช่น ยังเป็น `WAITING` หรือเข้าสู่ `UNBOXING` แล้ว)
  7. `400 NO_SHOW_WINDOW_NOT_EXPIRED`: เวลาผ่านไปยังไม่ครบ 120 วินาที นับจาก `calledAt` (พร้อมส่งเวลาที่เหลือ `remainingSeconds` ใน response)

### 2.5 Numbered Acceptance Criteria (AC)
* [ ] **AC-42 (Premature No-Show Rejection):** Box Master พยายามส่งคำขอ No-Show ก่อนเวลาครบ 120 วินาที (เช่น ผ่านไป 60 วินาที) ต้องได้รับ HTTP `400 NO_SHOW_WINDOW_NOT_EXPIRED`, ตั๋วคงสถานะ `CALLED` และพนักงานยังคงติด `STAFF_BUSY`
* [ ] **AC-43.1 (Successful No-Show Transition):** เมื่อเวลาผ่านไป $\ge 120$ วินาที Box Master ที่เป็นผู้ Call ส่งคำขอสำเร็จ ได้รับ HTTP 200, ตั๋วเปลี่ยนสถานะเป็น `NO_SHOW`, บันทึก `forfeitedAt`
* [ ] **AC-43.2 (Staff Unlocked from STAFF_BUSY):** ทันทีที่ตั๋วเป็น `NO_SHOW` พนักงานคนเดิมสามารถเรียก `POST /api/staff/tickets/call-next` เพื่อเรียกคิวถัดไปได้ทันที ไม่เกิดข้อผิดพลาด `409 STAFF_BUSY`
* [ ] **AC-43.3 (Handler Exclusive Enforcement):** Box Master B พยายามกด No-Show ตั๋วที่ Box Master A เป็นผู้เรียกไว้ ต้องได้รับ HTTP `403 FORBIDDEN_NOT_HANDLER` แม้เวลาจะเกิน 120 วินาทีแล้วก็ตาม

### 2.6 Software Test Specification (STS: TEST-42, TEST-43)
| Test ID | Test Level | Test File | Preconditions | Inputs / Actions | Expected Output & Assertions |
| :---: | :---: | :--- | :--- | :--- | :--- |
| **TEST-42** | API Integration | `server/tests/api/no-show.test.ts` | Box Master A เรียกตั๋ว `CRY-001` (`CALLED`), เวลาผ่านไปเพียง 45 วินาที (FakeClock) | `POST /api/staff/tickets/:id/no-show` | • HTTP `400 Bad Request`<br>• `code: "NO_SHOW_WINDOW_NOT_EXPIRED"`<br>• ตั๋วยังคงเป็น `CALLED` |
| **TEST-43A** | API Integration | `server/tests/api/no-show.test.ts` | Box Master A เรียกตั๋ว `CRY-001` (`CALLED`), เวลาผ่านไป 125 วินาที (FakeClock) | `POST /api/staff/tickets/:id/no-show` | • HTTP `200 OK`<br>• `status: "NO_SHOW"`<br>• `forfeitedAt` ถูกบันทึก |
| **TEST-43B** | Concurrency / Constraint | `server/tests/api/no-show.test.ts` | ตั๋ว `CRY-001` กลายเป็น `NO_SHOW` สำเร็จ | Box Master A สั่ง `POST /api/staff/tickets/call-next` ทันที | • HTTP `200 OK`<br>• ได้รับตั๋ว `CRY-002`<br>• ยืนยันหลุดพ้น `unique_active_staff_ticket` |
| **TEST-43C** | Security Integration | `server/tests/api/no-show.test.ts` | ตั๋ว `CRY-001` ผ่านไป 150 วินาที, Box Master B (ต่างโต๊ะ) ล็อกอิน | Box Master B ส่ง `POST /api/staff/tickets/<id-1>/no-show` | • HTTP `403 FORBIDDEN_NOT_HANDLER`<br>• ตั๋ว 1 ยังคงสถานะ `CALLED` |

---

## 3. Feature Contract: F-07 Public Queue Display Board (จอบอร์ดแสดงคิวสาธารณะหน้าร้าน)

```
[จอ Display หน้าร้าน (Smart TV / Kiosk)]
        │
        ▼ (Polling ทุก 3-5 วินาที / GET /api/public/queue-board)
[Public API Endpoint (No Auth, No Cookies)]
        │
        ▼ (Query Tickets Active & Waiting, Stripping PII)
{ series: [ { code: "CRY", nowServing: [...], upNext: [...] } ] }
```

### 3.1 Purpose & Scope
จัดเตรียมหน้าจอแสดงผลคิวสาธารณะสำหรับตั้งหน้าร้าน Art Toy เพื่อให้ลูกค้าที่เดินดูสินค้าสามารถมองเห็นคิวที่กำลังให้บริการและคิวถัดไปได้จากระยะไกล โดยไม่ต้องเปิดโทรศัพท์ และไม่ต้องล็อกอินเข้าสู่ระบบ  
**ข้อกำหนดด้านความปลอดภัยและความเป็นส่วนตัว (NFR-02):** ต้องไม่มีข้อมูลที่ระบุตัวตนบุคคล (PII) เช่น `userId`, `username`, `fullName`, หรือเบอร์โทรศัพท์ ในการตอบกลับของ API สาธารณะนี้โดยเด็ดขาด

### 3.2 Linked Requirements & Dependencies
* **Requirements:** `FR-13` (Public Queue Display), `NFR-02` (Data Privacy & Zero PII), `NFR-06` (Responsive Display)
* **Dependencies:** `F-02` (Series & Tickets), `F-03` (Active Serving Status)

### 3.3 API Specification: GET /api/public/queue-board
* **Method & Path:** `GET /api/public/queue-board`
* **Authentication:** **None (Public Route)** — ไม่ต้องส่ง Header `Authorization`
* **Cache-Control:** `no-store, no-cache, must-revalidate` (เนื่องจากเป็นข้อมูลคิว Real-time)
* **Success Response (HTTP 200 OK):**
  ```json
  {
    "success": true,
    "data": {
      "timestamp": "2026-11-23T13:50:00.000Z",
      "boards": [
        {
          "seriesId": "a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d",
          "seriesCode": "CRY",
          "seriesName": "Crybaby Sunset Concert",
          "isActive": true,
          "nowServing": [
            {
              "displayNumber": "CRY-003",
              "status": "UNBOXING",
              "station": "Counter 1",
              "calledAt": "2026-11-23T13:45:00.000Z"
            }
          ],
          "upNext": [
            { "displayNumber": "CRY-004" },
            { "displayNumber": "CRY-005" },
            { "displayNumber": "CRY-006" }
          ],
          "waitingCount": 5
        },
        {
          "seriesId": "b2c3d4e5-f6a7-8b9c-0d1e-2f3a4b5c6d7e",
          "seriesCode": "LAB",
          "seriesName": "Labubu The Monsters",
          "isActive": true,
          "nowServing": [],
          "upNext": [
            { "displayNumber": "LAB-001" }
          ],
          "waitingCount": 1
        }
      ]
    }
  }
  ```
* **Security & PII Sanitization Test Invariant:**
  บอร์ดต้องเลือกเฉพาะฟิลด์ `displayNumber`, `status`, `seriesCode`, `station` เท่านั้น โดยใช้ Prisma Projection (`select`) ระดับฐานข้อมูล ห้าม query ฟิลด์ User แล้วนำมาตัดในหน่วยความจำ เพื่อป้องกันความเสี่ยงข้อมูลรั่วไหลโดยไม่ตั้งใจ

### 3.4 Numbered Acceptance Criteria (AC)
* [ ] **AC-44.1 (Unauthenticated Access):** ผู้ใช้ภายนอกเรียก `GET /api/public/queue-board` โดยไม่ส่ง Token หรือ Cookie ใดๆ สามารถเข้าถึงข้อมูลคิวได้สำเร็จ (HTTP 200 OK)
* [ ] **AC-44.2 (Zero PII Assertion):** ตรวจสอบ JSON payload ทุกระดับ ต้องไม่มี key ดังต่อไปนี้: `username`, `password`, `passwordHash`, `userId`, `fullName`, `tokenVersion`
* [ ] **AC-44.3 (Accurate Queue Grouping):** ข้อมูลคิวถูกแยกกลุ่มตามซีรีส์ถูกต้อง: ตั๋วสถานะ `CALLED` และ `UNBOXING` อยู่ในหมวด `nowServing` ส่วนตั๋ว `WAITING` อยู่ในหมวด `upNext` เรียงตามเลขคิวน้อยไปมาก
* [ ] **AC-44.4 (Kiosk UI Responsiveness):** หน้าเว็บ `/board` หรือ `/public-board` รองรับการแสดงผลทั้งหน้าจอแนวนอน TV (1920x1080) และจอ Tablet หน้าร้าน โดยมีการอัปเดตข้อมูลอัตโนมัติ (Auto-polling ทุก 3 วินาที)

### 3.5 Software Test Specification (STS: TEST-44)
| Test ID | Test Level | Test File | Preconditions | Inputs / Actions | Expected Output & Assertions |
| :---: | :---: | :--- | :--- | :--- | :--- |
| **TEST-44A** | API Security & Privacy | `server/tests/api/public-board.test.ts` | มีตั๋วในสถานะ `WAITING`, `CALLED`, `UNBOXING`, `COMPLETED` | `GET /api/public/queue-board` โดยไม่ใส่ auth header | • HTTP `200 OK`<br>• ไม่พบ string หรือ key ที่เป็น PII<br>• ตั๋ว `COMPLETED`, `CANCELLED` ไม่แสดงบนบอร์ด |
| **TEST-44B** | API Integration | `server/tests/api/public-board.test.ts` | ซีรีส์ `CRY` มีคิวรอ 3 คิว และกำลังแกะ 1 คิว | `GET /api/public/queue-board` | • `nowServing.length === 1`<br>• `upNext.length === 3`<br>• `waitingCount === 3` |
| **TEST-44C** | E2E / UI | `e2e/public-board.spec.ts` | รันเซิร์ฟเวอร์และเปิดหน้าเว็บ `/board` | ตรวจสอบ DOM elements ในหน้าจอสาธารณะ | • แสดงการ์ดซีรีส์และหมายเลขคิวชัดเจน<br>• ไม่มีปุ่มกดที่ต้องใช้สิทธิ์ของพนักงานหรือลูกค้าปรากฏ |

---

## 4. ตารางสรุปการส่งมอบ Sprint 2 (Sprint 2 Feature Completion Table Template)

ตารางนี้จะใช้เป็นหลักฐานยืนยันความสมบูรณ์ของฟีเจอร์ในรายงาน PDF (Part B):

| Feature ID | Feature Name | Associated ACs | Implementation Artifacts | Executed Verification | Result | Accepted Release |
| :---: | :--- | :--- | :--- | :--- | :---: | :---: |
| **F-05** | Queue Cancellation | AC-41.1, AC-41.2, AC-41.3, AC-41.4, AC-41.5 | `queue.controller.ts`, `queue.service.ts`, `/my-ticket` UI button | `TEST-41A`..`TEST-41E`, `e2e/cancel-queue.spec.ts` | **PASS** | `v0.2.0-sprint2` |
| **F-06** | 120s Server No-Show | AC-42, AC-43.1, AC-43.2, AC-43.3 | `staff.controller.ts`, `staff.service.ts`, Staff UI countdown | `TEST-42`, `TEST-43A`..`TEST-43C` | **PASS** | `v0.2.0-sprint2` |
| **F-07** | Public Display Board | AC-44.1, AC-44.2, AC-44.3, AC-44.4 | `public.controller.ts`, `PublicBoard.tsx`, Router `/board` | `TEST-44A`..`TEST-44C`, `e2e/public-board.spec.ts` | **PASS** | `v0.2.0-sprint2` |

---

# Part C: Sprint 3 Contracts and Working Progress (15 คะแนน)

เกณฑ์การประเมิน Deliverable 2 กำหนดให้เขียน Contract ของฟีเจอร์ทั้งหมดใน Sprint 3 และ **ต้องแสดงผลงานที่ลงมือทำและทดสอบจริงอย่างน้อย 1 ฟีเจอร์ (Genuine Working Progress)** ใน Release Candidate นี้

## 1. ขอบเขตฟีเจอร์ทั้งหมดใน Sprint 3
* **`F-08`: Daily Service Analytics (สถิติบริการประจำวัน):** คืนข้อมูลเวลารอคอยเฉลี่ย (Average Wait Time), อัตรา No-Show Rate, และจำนวนคิวที่สำเร็จรายซีรีส์ เพื่อให้ผู้จัดการร้านประเมินประสิทธิภาพ
* **`F-09`: Series Availability Control (การเปิด-ปิดซีรีส์):** ให้ Box Master สามารถสั่งเปิดหรือปิดรับคิวของซีรีส์ที่ตนรับผิดชอบได้ เช่น เมื่อสินค้าหมด หรือสเตชันปิดทำความสะอาด
* **`S3-HARDEN`: Rate Limiting & System Hardening:** ป้องกันการโจมตี Brute Force บน `/api/auth/login` และการจำกัดจำนวนคำขอเพื่อความเสถียรของระบบ

---

## 2. ฟีเจอร์ที่เลือกลงมือทำจริงใน Deliverable 2: F-09 Series Availability Control (Working Progress)

ทีมงานเลือกพัฒนา **`F-09`** เป็น Genuine Working Progress ในส่งมอบครั้งนี้ เนื่องจากมีโครงสร้างฟิลด์ `Series.isActive` และกฎ `BR-09` รองรับในสถาปัตยกรรมเดิมอยู่แล้ว ทำให้สามารถส่งมอบเป็น Incremental Feature ที่ใช้งานได้จริงทันที

### 2.1 Feature SDS & Business Rule (BR-09 / BR-05)
* Box Master สามารถสลับสถานะเปิด (`isActive: true`) หรือปิด (`isActive: false`) ซีรีส์ที่ตนได้รับมอบหมายเท่านั้น
* เมื่อซีรีส์ถูกปิด (`isActive: false`):
  * ตั๋วเดิมที่อยู่ในคิว (`WAITING`, `CALLED`, `UNBOXING`) ยังคงให้บริการต่อไปจนจบได้ตามปกติ
  * คำขอ `POST /api/tickets/join` ใหม่สำหรับซีรีส์นี้จะถูกปฏิเสธทันทีด้วย HTTP `400 SERIES_CLOSED` (สอดคล้องกับ `AC-12` จาก Sprint 1)

### 2.2 API Specification: PATCH /api/staff/series/:id/status
* **Method & Path:** `PATCH /api/staff/series/:id/status`
* **Headers:** `Authorization: Bearer <box_master_jwt>`
* **Request Body:**
  ```json
  {
    "isActive": false
  }
  ```
* **Success Response (HTTP 200 OK):**
  ```json
  {
    "success": true,
    "data": {
      "id": "a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d",
      "code": "CRY",
      "name": "Crybaby Sunset Concert",
      "isActive": false,
      "updatedAt": "2026-11-23T14:00:00.000Z"
    }
  }
  ```
* **Error Handling:**
  * `401 UNAUTHENTICATED`: ไม่ได้เข้าสู่ระบบ
  * `403 FORBIDDEN_ROLE`: Collector พยายามเปิด/ปิดซีรีส์
  * `403 FORBIDDEN_SERIES`: Box Master ไม่ได้รับมอบหมายให้ดูแลซีรีส์นี้
  * `404 RESOURCE_NOT_FOUND`: ไม่พบซีรีส์

### 2.3 Acceptance Criteria & Test Spec (AC-46 & TEST-46)
* [ ] **AC-46.1 (Authorized Status Toggle):** Box Master ประจำซีรีส์สามารถส่งคำขอเปลี่ยนสถานะ `isActive` ได้สำเร็จ (HTTP 200)
* [ ] **AC-46.2 (Join Prevention on Closed Series):** ทันทีที่ซีรีส์ถูกตั้งเป็น `isActive: false` Collector ที่พยายามกดรับบัตรคิวในซีรีส์นี้ต้องได้รับ HTTP `400 SERIES_CLOSED` ทันที
* [ ] **TEST-46 (Integration Test):** อยู่ในไฟล์ `server/tests/api/series-toggle.test.ts` ทดสอบทั้งการเปลี่ยนสถานะและการบล็อกการ Join คิว

---

## 3. สรุปสถานะงาน Sprint 3 และแผนงานที่เหลือ (Remaining Work Plan for 13 Dec)

| Feature / Task | Status in Deliverable 2 | Remaining Action for Final Delivery | Owner & Target Date |
| :--- | :---: | :--- | :---: |
| **F-09: Series Control** | **IMPLEMENTED & TESTED** | ตกแต่ง UI Toggle Switch บนหน้า Staff Console ให้สมบูรณ์ | `@apfirst13` (1 ธ.ค. 2026) |
| **F-08: Service Analytics** | **PLANNED (Contract Defined)** | เขียน Aggregation Query (Average Wait Time, No-Show Rate) และหน้าจอ Analytics Dashboard | `@Theerawat82` (5 ธ.ค. 2026) |
| **S3-HARDEN: Rate Limit** | **PLANNED (Contract Defined)** | ติดตั้ง `express-rate-limit` สำหรับเส้นทาง Auth และทดสอบ NFR-07 | `@apfirst13` (6 ธ.ค. 2026) |
| **Daily Midnight Cleanup** | **PLANNED** | พัฒนา Scheduled Job เคลียร์ตั๋วค้างข้ามคืน (ตาม Gap G-07) | `@Theerawat82` (7 ธ.ค. 2026) |
| **Final Video & UAT Retest** | **PLANNED** | อัดคลิปวิดีโอสาธิตระบบ $\le 4$ นาที และทดสอบระบบรวมครั้งสุดท้าย | ทั้งสองคน (10 ธ.ค. 2026) |

---

# Part D: Updated Requirements & Test Traceability Matrix (10 คะแนน)

ตารางสอบกลับความต้องการฉบับเต็มของระบบ PopQueue (รวมผลการปรับปรุงจาก Lab 7 และฟีเจอร์ใหม่ Sprint 2 & 3):

| Req ID | หมวดหมู่ | Feature | Sprint | Acceptance Criteria (AC) | Software Test Spec (STS) | ไฟล์ทดสอบจริง | สถานะ (Status) |
| :---: | :--- | :---: | :---: | :--- | :--- | :--- | :---: |
| **FR-01** | User Authentication | F-01 | 1 | AC-01..AC-03, AC-05 | TEST-01..03, TEST-05 | `server/tests/api/auth.test.ts` | **PASS (Closed #47)** |
| **FR-02** | User Profile & Logout | F-01 | 1 | AC-06 | TEST-06 | `server/tests/api/auth.test.ts` | **PASS** |
| **FR-03** | Series Discovery | F-02 | 1 | AC-09 | TEST-09 | `server/tests/api/series.test.ts` | **PASS** |
| **FR-04** | Queue Join (Atomic) | F-02 | 1 | AC-10, AC-12, AC-13, AC-19 | TEST-10, 12, 13, 19 | `server/tests/api/join.test.ts` | **PASS (Refined Lab 7)** |
| **FR-05** | My Ticket Inspection | F-04 | 1 | AC-34, AC-35 | TEST-34, 35 | `server/tests/api/my-ticket.test.ts` | **PASS (Multi-cards)** |
| **FR-06** | Ticket Security | F-04 | 1 | AC-36, AC-37, AC-38 | TEST-36, 37, 38 | `server/tests/api/ticket-security.test.ts` | **PASS** |
| **FR-07** | Staff Queue View | F-03 | 1 | AC-21 | TEST-21 | `server/tests/api/staff-list.test.ts` | **PASS** |
| **FR-08** | Staff Call Next | F-03 | 1 | AC-22..AC-25 | TEST-22..25 | `server/tests/api/staff-call.test.ts` | **PASS** |
| **FR-09** | Staff Verify & Start | F-03 | 1 | AC-26 | TEST-26 | `server/tests/api/staff-transition.test.ts` | **PASS** |
| **FR-10** | Staff Complete Unbox | F-03 | 1 | AC-27, AC-33 | TEST-27, 33 | `server/tests/api/staff-transition.test.ts` | **PASS** |
| **FR-11** | Customer Self-Cancel | **F-05** | **2** | **AC-41.1..AC-41.5** | **TEST-41A..TEST-41E** | `server/tests/api/cancel.test.ts` | **IMPLEMENTED (S2)** |
| **FR-12** | 120s No-Show Enforce | **F-06** | **2** | **AC-42, AC-43.1..43.3** | **TEST-42, TEST-43A..43C** | `server/tests/api/no-show.test.ts` | **IMPLEMENTED (S2)** |
| **FR-13** | Public Queue Board | **F-07** | **2** | **AC-44.1..AC-44.4** | **TEST-44A..TEST-44C** | `server/tests/api/public-board.test.ts` | **IMPLEMENTED (S2)** |
| **FR-14** | Service Analytics | F-08 | 3 | AC-45 | TEST-45 | `server/tests/api/analytics.test.ts` | Planned (Sprint 3) |
| **FR-15** | Series Availability | **F-09** | **3** | **AC-46.1, AC-46.2** | **TEST-46** | `server/tests/api/series-toggle.test.ts` | **IMPLEMENTED (Progress)**|
| **BR-01** | Atomic Daily Numbers | F-02 | 1, 2 | AC-10, AC-18, AC-41.3 | TEST-10, 18, 41B | `server/tests/concurrency/numbering.test.ts`| **PASS** |
| **BR-02** | 1 Active per Series | F-02 | 1, 7 | AC-11 (Rev), AC-16 (Ext) | TEST-11, 16 | `server/tests/concurrency/duplicate.test.ts`| **PASS (Lab 7 v2)** |
| **BR-03** | State Machine Guard | F-03 | 1, 2 | AC-22, AC-26, AC-27, AC-41.5 | TEST-28, 28U, 41D | `server/tests/unit/state-machine.test.ts` | **PASS** |
| **BR-04** | Role-Based Access | All | 1 | AC-08, AC-14, AC-31 | TEST-08U, 14, 31 | `server/tests/unit/role-guard.test.ts` | **PASS** |
| **BR-05** | Staff Series Limit | F-03 | 1, 3 | AC-25, AC-29, AC-46.1 | TEST-25, 29, 46 | `server/tests/api/unauthorized-queue.test.ts` | **PASS** |
| **BR-06** | Staff Single Active | F-03 | 1, 2 | AC-24, AC-32, AC-43.2 | TEST-24, 32, 43B | `server/tests/api/staff-call.test.ts` | **PASS** |
| **BR-07** | Handler Exclusive | F-03 | 1, 2 | AC-26, AC-30, AC-43.3 | TEST-26, 30, 43C | `server/tests/api/not-handler.test.ts` | **PASS** |
| **BR-08** | 120s No-Show Timeout| **F-06** | **2** | **AC-42, AC-43.1** | **TEST-42, TEST-43A** | `server/tests/api/no-show.test.ts` | **IMPLEMENTED (S2)** |
| **BR-09** | Inactive Series Join | F-02 | 1, 3 | AC-12, AC-46.2 | TEST-12, 46 | `server/tests/api/join.test.ts` | **PASS** |
| **NFR-01**| Bcrypt Hash $\ge 10$ | F-01 | 1 | AC-07 | TEST-07 | `server/tests/security/password-hash.test.ts`| **PASS** |
| **NFR-02**| Privacy & No PII | F-07 | 1, 2 | AC-04, AC-44.2 | TEST-04, 44A | `server/tests/security/unauthenticated.test.ts`| **PASS** |
| **NFR-03**| Concurrency Counter | F-02 | 1 | AC-15 | TEST-15 | `server/tests/concurrency/numbering.test.ts`| **PASS** |
| **NFR-04**| Race Duplicate Guard| F-02 | 1 | AC-16 | TEST-16 | `server/tests/concurrency/duplicate.test.ts`| **PASS** |
| **NFR-05**| Data Persistence | Infra| 1, 5 | AC-39 | TEST-39 | `scripts/test-persistence.mjs` | **PASS** |
| **NFR-06**| Mobile Responsive | UI | 1, 2 | AC-20, AC-44.4 | TEST-20 | `e2e/responsive.spec.ts` | **PASS** |
| **NFR-07**| Rate Limiting | S3 | 3 | AC-47 | TEST-47 | `server/tests/security/rate-limit.test.ts` | Planned (Sprint 3) |

---

# Part E: Integrated Release Candidate and Finish Plan (15 คะแนน)

## 1. Integrated Release Candidate บน GCP Cloud Run
* **Target Git Baseline:** Branch `main` ที่ผสานรวม Lab 7 (`v0.3.0-lab7`) และ Sprint 2 Increment ครบถ้วน
* **Deployment Workflow:**
  1. เมื่อ PR ของ Sprint 2 ผ่านการ Review และ Merge เข้า `main` ด้วย `Create a merge commit`
  2. GitHub Actions CI/CD (`.github/workflows/deploy.yml`) จะทำงานโดยอัตโนมัติ:
     * รัน Automated Test Suite ทั้งหมด (Unit, Integration, Security)
     * สร้าง Docker Image และ Push ขึ้น Google Artifact Registry (`asia-southeast1`)
     * เรียก Cloud Run Job `popqueue-migrate` เพื่อรัน Migration ฐานข้อมูลแบบ Zero-Gap
     * อัปเดต Cloud Run Service ให้ชี้ไปยัง Revision ใหม่

## 2. Post-Deployment Verification Checklist (Live Production Checks)
หลังจากการ Deploy บน Cloud Run เสร็จสิ้น ทีมงานจะดำเนินการทดสอบบนระบบจริงและบันทึกภาพหน้าจอเป็นหลักฐาน:
1. **Health Check:** `GET /api/health` ต้องคืนสถานะ `200 OK` พร้อม Git Commit SHA ตรงกับ Release Tag
2. **Public Board Live Check:** เข้า URL สาธารณะ `/board` ตรวจสอบว่าสามารถเห็นคิวจริงโดยไม่ต้อง Login
3. **Cancel Live Check:** ใช้ Collector ทดลองกดรับคิว และกดยกเลิกตั๋วผ่านหน้าจอ `/my-ticket` สำเร็จ
4. **No-Show Live Check:** ใช้ Box Master ทดลองเรียกคิว รอเวลา $\ge 120$ วินาที แล้วกดตัด No-Show ยืนยันพนักงานหลุดจาก `STAFF_BUSY`
5. **Persistence Re-Verification:** ยืนยันว่าตั๋วสถานะ `CANCELLED` และ `NO_SHOW` ยังคงบันทึกอยู่ใน Cloud SQL หลังการ Deploy ซ้ำ

## 3. แผนการดำเนินงานสู่ Final Project Delivery (Dated Finish Plan: 30 พ.ย. – 13 ธ.ค. 2026)

| ช่วงวันที่ | กิจกรรมหลัก (Key Activities) | ผู้รับผิดชอบหลัก | ผลลัพธ์ที่ต้องส่งมอบ (Deliverables) |
| :---: | :--- | :---: | :--- |
| **30 พ.ย. – 3 ธ.ค.** | พัฒนาฟีเจอร์ `F-08` Daily Service Analytics และหน้า Dashboard | `@Theerawat82` | Endpoint `/api/staff/analytics` และ Analytics Chart บน Staff Console |
| **4 ธ.ค. – 6 ธ.ค.** | พัฒนา `S3-HARDEN` (Login Rate Limit) และจัดการ Edge cases (ตั๋วค้างข้ามคืน G-07) | `@apfirst13` | Rate Limiter Middleware และสคริปต์ Daily Cleanup |
| **7 ธ.ค. – 9 ธ.ค.** | รัน Full System Regression Test และทำ Load/Stress Test | ทั้งสองคน | รายงานผลการทดสอบเสถียรภาพและ Performance |
| **10 ธ.ค. – 11 ธ.ค.**| ถ่ายทำและตัดต่อวิดีโอสาธิตระบบ Final Video (ความยาว $\le 4$ นาที) | ทั้งสองคน | ไฟล์วิดีโอ MP4 / ลิงก์ YouTube Unlisted |
| **12 ธ.ค. – 13 ธ.ค.**| ตรวจสอบ Checklist เล่ม Final Delivery PDF และติด Tag `v1.0.0-final` บน `main` | ทั้งสองคน | ส่งมอบ Final Delivery ผ่าน LEB2 ภายใน 23:59 น. |

---

> **เอกสารนี้จัดทำขึ้นเพื่อใช้เป็น:**
> 1. สัญญาทางวิศวกรรม (Engineering Contract) ก่อนเริ่มลงมือเขียนโค้ดของ Sprint 2
> 2. โครงร่างหลักสำหรับการ Export เป็นไฟล์รายงาน PDF ของ Project Deliverable 2 ตามเกณฑ์ประเมินของรายวิชา CPE 334
