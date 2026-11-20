# Part C — Defect Triage Log

> **BFteam as UAT Team (Outgoing):** Defects found in Partner's system (CrustCraft)
> **BFteam as Product Team (Incoming):** Defects reported by Partner about PopQueue

---

## C-1: Outgoing Defect Reports (BFteam → CrustCraft)

> ใช้ Full 12-Field Template ทุกรายการ แยก `Defect` vs `Enhancement/Out-of-Scope` ให้ชัดเจน

### Outgoing Defect Summary
* **Total Executed Cases:** 5 (`UAT-CC-01` to `UAT-CC-05`)
* **Natural Defects Found:** 0 (Zero Defects) — ระบบ CrustCraft ทำงานถูกต้องตาม Functional Requirements, Acceptance Criteria, และ Business Rules (`BR-01` ถึง `BR-07`) ทั้งหมด 100%
* **Out-of-Scope / Deferred Observations:** 1 รายการ (Order Cancellation เป็นฟีเจอร์ Sprint 2 `F-06` ตามที่ระบุในข้อกำหนด — Not a Defect)

### Outgoing Item #1: Order Cancellation Observation (Classified: Out of Scope / Sprint 2)

| Field | Value |
| :--- | :--- |
| **1. Issue ID & Link** | `N/A — Out of Scope Observation` |
| **2. Product Owner / Team** | CrustCraft (`@meebotsompurin-stack`, `@poom2548`) |
| **3. Reporter** | นายอภิวัชร์ ปัณฐธนาพัฒน์ (`@apfirst13`) / นายธีรวัฒญ์ รุ่งสว่าง (`@Theerawat82`) |
| **4. Tested Version / Commit SHA / Live URL** | Release B (`crustcraft-00005-lzs` / `13932e96a1491ded7b7c1e4bfa03701b50b1e917`) · `https://crustcraft-530290697744.asia-southeast1.run.app` |
| **5. Linked UAT Case / Requirement / AC** | `UAT-CC-01`, `UAT-CC-02` / `F-03` |
| **6. Spec Reference & Classification** | ☑ **Feature Request / Out of Scope** (ตาม `docs/sprints/sprint-1/specification.md` Section 3: *Extended fulfillment & customer order cancellation `F-06` deferred to Sprint 2*) |
| **7. Preconditions & Synthetic Test Data** | Customer 1 (`uat.customer1@test.com`) สร้าง Pre-Order สำเร็จ (สถานะ `PENDING`) |
| **8. Numbered Reproduction Steps** | 1. ล็อกอินด้วยบัญชี `uat.customer1@test.com`<br>2. ไปที่หน้า `/orders`<br>3. คลิกดูรายละเอียดออเดอร์ `/orders/:id`<br>4. ตรวจสอบปุ่มสำหรับยกเลิกคำสั่งซื้อ |
| **9. Expected Result vs Actual Result** | **Expected:** ตามสเปก Sprint 1 ไม่มีปุ่มยกเลิกออเดอร์<br>**Actual:** ไม่มีปุ่มยกเลิกออเดอร์ในหน้าจอ ซึ่งตรงตามข้อกำหนดของ Sprint 1 (Deferred to Sprint 2) |
| **10. Severity & Priority** | Low / Out of Scope (ไม่กระทบการทำงานของ Sprint 1) |
| **11. Evidence ID(s) & Masked Screenshots** | `b-ev-01.png`, `b-ev-02.png` |
| **12. Notification Timestamp/Channel & Partner Disposition** | แจ้งผ่านช่องทางสื่อสารส่วนตัว (LINE / Discord) เพื่อยืนยันว่าระบบผ่าน 100% ไม่มี Defect |

---

## C-2: Incoming Triage Table (CrustCraft → PopQueue)

> ทีม guluJa / PhraewaS จะรายงานเรื่องนี้มา — ต้อง Reproduce ทุกข้อและลง Disposition ภายใน 24 ชม.

| Finding # | Reported By | Description | Reproduced? | Disposition | Justification (อ้าง Spec/AC) | Action Taken |
| :---: | :--- | :--- | :---: | :--- | :--- | :--- |
| INC-01 | `guluJa`/`PhraewaS` | *(รอผลการทดสอบจากทีมผู้ตรวจ)* | ☐ | ☐ Accepted Defect ☐ Not-Defect ☐ Enhancement ☐ Duplicate | | |

### Disposition Definitions (ตาม Lab 6 §3.3)

| Class | เกณฑ์ |
| :--- | :--- |
| **Accepted Defect** | พฤติกรรมขัดกับ Sprint 1 Spec (`FR-01..10`, `BR-01..09`, `NFR-01..06`, `AC-01..39`) |
| **Not-Defect** | พฤติกรรมตรงตาม Sprint 1 Contract แล้ว หรือผู้ทดสอบทำผิดเงื่อนไข Handoff |
| **Enhancement** | ฟีเจอร์ที่เลื่อนไป Sprint 2/3 ตั้งแต่ต้น (เช่น F-05 Cancel, F-06 No-Show, NFR-07) |
| **Duplicate** | อาการ + Root Cause เดียวกับ Issue ที่เปิดไว้แล้ว |
