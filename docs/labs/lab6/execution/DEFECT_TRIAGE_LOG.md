# Part C — Defect Triage Log

> **BFteam as UAT Team (Outgoing):** Defects found in Partner's system (CrustCraft)
> **BFteam as Product Team (Incoming):** Defects reported by Partner about PopQueue

---

## C-1: Outgoing Defect Reports (BFteam → CrustCraft)

> ใช้ Full 12-Field Template ทุกรายการ แยก `Defect` vs `Enhancement/Out-of-Scope` ให้ชัดเจน

### Outgoing Defect #1

| Field | Value |
| :--- | :--- |
| **1. Issue ID & Link** | `[TBD — GitHub Issue URL]` |
| **2. Product Owner / Team** | CrustCraft (`meebotsompurin-stack`, `poom2548`) |
| **3. Reporter** | `@Theerawat82` / `@apfirst13` |
| **4. Tested Version / Commit SHA / Live URL** | `[TBD]` |
| **5. Linked UAT Case / Requirement / AC** | `[TBD]` |
| **6. Spec Reference & Classification** | ☐ Defect against agreed Sprint 1 spec  ☐ Feature Request / Out of Scope |
| **7. Preconditions & Synthetic Test Data** | `[TBD]` |
| **8. Numbered Reproduction Steps** | 1. ... 2. ... 3. ... |
| **9. Expected Result vs Actual Result** | **Expected:** ... **Actual:** ... |
| **10. Severity & Priority** | ☐ Critical ☐ Major ☐ Minor — Impact: `[TBD]` |
| **11. Evidence ID(s) & Masked Screenshots** | `b-ev-XX.png` |
| **12. Notification Timestamp/Channel & Partner Disposition** | Sent: `[TBD]` via LINE/Discord/IG — Partner response: `[TBD]` |

*(copy section above สำหรับ defect ถัดไป)*

---

## C-2: Incoming Triage Table (CrustCraft → PopQueue)

> ทีม guluJa / PhraewaS จะรายงานเรื่องนี้มา — ต้อง Reproduce ทุกข้อและลง Disposition ภายใน 24 ชม.

| Finding # | Reported By | Description | Reproduced? | Disposition | Justification (อ้าง Spec/AC) | Action Taken |
| :---: | :--- | :--- | :---: | :--- | :--- | :--- |
| INC-01 | `guluJa`/`PhraewaS` | `[TBD]` | ☐ | ☐ Accepted Defect ☐ Not-Defect ☐ Enhancement ☐ Duplicate | `[TBD — ระบุ AC/FR/BR ที่เกี่ยวข้อง]` | `[TBD]` |

### Disposition Definitions (ตาม Lab 6 §3.3)

| Class | เกณฑ์ |
| :--- | :--- |
| **Accepted Defect** | พฤติกรรมขัดกับ Sprint 1 Spec (`FR-01..10`, `BR-01..09`, `NFR-01..06`, `AC-01..39`) |
| **Not-Defect** | พฤติกรรมตรงตาม Sprint 1 Contract แล้ว หรือผู้ทดสอบทำผิดเงื่อนไข Handoff |
| **Enhancement** | ฟีเจอร์ที่เลื่อนไป Sprint 2/3 ตั้งแต่ต้น (เช่น F-05 Cancel, F-06 No-Show, NFR-07) |
| **Duplicate** | อาการ + Root Cause เดียวกับ Issue ที่เปิดไว้แล้ว |
