# Requirements Traceability Matrix – Sprint 1

**Course:** CPE 334 Introduction to Software Engineering in the Age of AI Agents  
**Target Release:** `v0.1.0-sprint1` (Deliverable 1 – Due 8 Nov 2026)  

---

## 📌 Master Document Reference
ตารางความสัมพันธ์ฉบับเต็ม 100% จัดเก็บไว้ที่:  
👉 **[docs/PopQueue_Deliverable_1_Master.md (Part B, Section 2)](../../PopQueue_Deliverable_1_Master.md#2-ตารางสอบกลับ-requirement--feature--sprint--ac--test)**

---

## 🎯 สรุปการเชื่อมโยงความต้องการของ Sprint 1 (Sprint 1 Verification Mapping)
* **เกณฑ์การยอมรับ (Acceptance Criteria):** ครอบคลุม **AC-01 ถึง AC-39** ครบถ้วน
* **ข้อกำหนดการทดสอบ (Software Test Specification):** วางแผนการทดสอบ **TEST-01 ถึง TEST-39** ครบ 40 รายการ (รวม Unit tests และ Concurrency tests)
* **การแบ่งกลุ่มไฟล์ทดสอบใน Sprint 1:**
  1. `tests/api/auth.test.ts` $\rightarrow$ ตรวจ AC-01, 02, 03, 05, 06 (Login/Logout/Me)
  2. `tests/security/` $\rightarrow$ ตรวจ AC-04 (Unauthenticated), AC-07 (Bcrypt cost >= 10)
  3. `tests/unit/` $\rightarrow$ ตรวจ AC-08 (Role guard), AC-17U (Date helper), AC-28U (Pure state transition guard)
  4. `tests/api/series.test.ts` & `tests/api/join.test.ts` $\rightarrow$ ตรวจ AC-09 ถึง AC-14, AC-18 (Discovery & Join)
  5. `tests/concurrency/` $\rightarrow$ ตรวจ AC-15 (50 Users Numbering), AC-16 (10 Duplicate Join), AC-32a/b (Staff Call Next Race)
  6. `tests/api/staff-*.test.ts` $\rightarrow$ ตรวจ AC-21 ถึง AC-31 (Staff Queue, Call Next, Start, Complete, Scope & Handler guards)
  7. `tests/api/ticket-*.test.ts` $\rightarrow$ ตรวจ AC-34 ถึง AC-38 (My-ticket & Ownership guards)
  8. `scripts/test-persistence.mjs` $\rightarrow$ ตรวจ AC-39 (Docker container restart persistence)
  9. `e2e/` (Playwright) $\rightarrow$ ตรวจ AC-19 (Join queue journey), AC-20 (Mobile 375px responsive), AC-33 (Full journey & Polling)
