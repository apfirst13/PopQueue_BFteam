# PopQueue — Lab 6 Overview & Implementation Changelog

> **Assignment:** Lab 6 — Independent User Acceptance Testing and Defect Management (100 Points)  
> **Course:** CPE 334 Software Engineering (Semester 1/2026, Section 1, KMUTT)  
> **Team:** **BFteam**  
> * นายธีรวัฒญ์ รุ่งสว่าง (`67070507206`, `@Theerawat82`)  
> * นายอภิวัชร์ ปัณฐธนาพัฒน์ (`67070507209`, `@apfirst13`)  
> **Git Branch:** `lab6-docs` (แยก branch ชัดเจน ไม่ปนเปื้อน `main` เพื่อคง Live Cloud Run Commit SHA)

---

## 📌 บันทึกประวัติการดำเนินงานและการแก้ไข (Activity & Change Log)

### 📅 วันที่: 18 พฤศจิกายน 2569 (Phase 1: Pairing Gate, Part A Handoff & Environment Prep)

| ลำดับ | รายการงาน | ไฟล์ที่สร้าง / แก้ไข | ผู้ดำเนินการ / บทบาท | รายละเอียดการเปลี่ยนแปลง |
| :---: | :--- | :--- | :--- | :--- |
| **1** | **Fact-Check Implementation vs Plan** | `server/src/**`<br>`server/tests/**` | AI Assistant + `@apfirst13` | ตรวจสอบโค้ดจริงเทียบแผน Sprint 1: ยืนยัน Raw SQL `ON CONFLICT DO UPDATE`, การดักจับ `P2002` นอก `$transaction`, 5-stage Auth Pipeline, `tokenVersion` revocation, และ Concurrency Tests 50 users ผ่านเกณฑ์ 100% |
| **2** | **Fact-Check & Audit Handoff Doc** | `docs/labs/lab6/handoff/`<br>`POPQUEUE_UAT_HANDOFF.md` | AI Assistant + `@Theerawat82` | ตรวจสอบความสอดคล้องระหว่างเอกสารส่งมอบ (Handoff) กับ `LAB6_MASTER_PLAN.md` §4 พบจุดปรับปรุง 5 ข้อ และจัดทำแผนแก้ไข |
| **3** | **อัปเดตช่องทางรับส่งรหัสผ่าน (Private Channel)** | `docs/labs/lab6/handoff/`<br>`POPQUEUE_UAT_HANDOFF.md` (§2.2) | `@apfirst13` | แก้ไขจาก placeholder `[TBD]` เป็นระบุช่องทางติดต่อส่วนตัวจริง: **LINE / Discord / Instagram DM** เพื่อส่งรหัสผ่าน synthetic accounts อย่างปลอดภัยตามข้อกำหนด Security Hygiene |
| **4** | **ชี้แจงบทบาท Pre-UAT Drain (Role Clarification)** | `docs/labs/lab6/handoff/`<br>`POPQUEUE_UAT_HANDOFF.md` (§3.2) | `@apfirst13` | เพิ่ม Callout Note ระบุชัดเจนว่า **Product Team (BFteam) ได้เคลียร์คิวเป็น 0 ล่วงหน้าแล้ว** พร้อมอ้างอิง `a-preuat-clean.png` โดยทีมคู่ค้ามีหน้าที่เพียง Verify ความพร้อมก่อนเริ่มเทสต์ ไม่ต้องกดเคลียร์เอง |
| **5** | **เพิ่มหมายเหตุ UUID Verification สำหรับ API Testing** | `docs/labs/lab6/handoff/`<br>`POPQUEUE_UAT_HANDOFF.md` (§5, `UAT-04`) | `@apfirst13` | เพิ่มข้อความแจ้งเตือนให้ทีมคู่ค้าตรวจสอบ `seriesId` UUID จาก `GET /api/series` ล่าสุดก่อนยิงคำสั่ง `curl` ป้องกันกรณีฐานข้อมูลมีการ re-seed |
| **6** | **บันทึกข้อมูลทีมคู่ค้าแบบ 3 ทีม (Circular Pairing)** | `docs/labs/lab6/plan/`<br>`LAB6_MASTER_PLAN.md` (§1.3) | `@Theerawat82` + `@apfirst13` | บันทึกข้อมูลการจับคู่ทดสอบระบบ 3 ทีมวนกัน:<br>• **ทีมที่ BFteam ต้องตรวจ (Partner Product):** CrustCraft Artisan Bakery (`@meebotsompurin-stack`, `@poom2548`) บน Theme 4 (E-Commerce)<br>• **Release Baseline ของ CrustCraft:** Tag `v1.0.0-sprint1` (SHA: `7a1d9db`), URL: `https://crustcraft-d7wyiqxska-as.a.run.app`<br>• **ทีมที่จะมาตรวจ PopQueue ของเรา:** `@guluJa` และ `@PhraewaS`<br>• **ข้อสังเกตสำคัญ:** CrustCraft ใช้รูปแบบการล็อกอินด้วย Email (ต่างจาก PopQueue ที่ใช้ Username) |
| **7** | **เตรียมโครงสร้างโฟลเดอร์ & Templates (Phase 2–4)** | `docs/labs/lab6/execution/`<br>• `PARTNER_UAT_RESULTS.md`<br>• `DEFECT_TRIAGE_LOG.md`<br>• `RETEST_ACCEPTANCE_RECORD.md` | `@apfirst13` | สร้างเทมเพลตมาตรฐานล่วงหน้า:<br>• Part B: UAT Execution & Evidence Log (พร้อม Handoff Audit Checklist)<br>• Part C: Full 12-Field Outgoing Defect Reports + Incoming Triage Table<br>• Part D: Retest Log + ตาราง 3-Category Sign-Off และ Version Lineage Table |
| **8** | **ดำเนินการ Pre-UAT Queue Drain บน Production จริง** | Live GCP Cloud Run & Cloud SQL | `@apfirst13` (Verified by API) | เคลียร์คิวที่ตกค้างบน Production ทั้งหมด:<br>• เคลียร์ซีรีส์ CRY (`staff_crybaby`) จน Current Serving และ Waiting Queue ว่าง<br>• เคลียร์ซีรีส์ LAB (`staff_labubu`) ตั๋วตกค้างเก่า (`LAB-001`) จนเสร็จสิ้นสมบูรณ์<br>• ยืนยันผลผ่าน `GET /api/series` (`waitingCount: 0` ทุกซีรีส์) และ `GET /api/staff/tickets` (`activeServing: null`, `waitingQueue: []` ทุกคน) |
| **9** | **จัดเก็บหลักฐานภาพถ่าย Pre-UAT Clean State** | `docs/labs/lab6/evidence/`<br>`a-preuat-clean.png` | `@apfirst13` | แคปภาพหน้าจอคู่แสดงผล Live URL บาร์ พร้อมผลลัพธ์ JSON `GET /api/series` (0 คิว) และหน้า UI เคาน์เตอร์ `staff_crybaby` ที่สถานะว่าง เพื่อเป็นหลักฐานทางการก่อนเริ่ม UAT |
| **10** | **ตรวจสอบเทียบเกณฑ์ใบงานทางการ (Lab 6 Spec Audit)** | `Lab_6_Sprint_1_UAT.pdf`<br>`POPQUEUE_UAT_HANDOFF.md`<br>`LAB6_MASTER_PLAN.md` | AI Assistant + `@apfirst13` | ตรวจสอบเทียบทุกประโยคกับใบงานหลัก `Lab_6_Sprint_1_UAT.pdf` (100 คะแนน): ยืนยันความสอดคล้อง 100% ครบทั้ง 4 หมวดของ Part A, กติกา Part B, 12-field template Part C, กระบวนการ TDD Red/Green Part D, §3.5 Controlled Exercise, และบันทึกข้อสังเกตการชี้แจง Circular Pairing (3 ทีม) ลงในรายงาน |

---

## 📂 โครงสร้างไฟล์ทั้งหมดในโฟลเดอร์ `docs/labs/lab6/`

```text
docs/labs/lab6/
├── README.md                            # [ไฟล์นี้] สรุปภาพรวมและบันทึกการแก้ไขงาน Lab 6
├── plan/
│   └── LAB6_MASTER_PLAN.md              # แผนแม่บทการดำเนินงาน Lab 6 (Dual-Role Architecture & Rules)
├── handoff/
│   └── POPQUEUE_UAT_HANDOFF.md          # คู่มือการส่งมอบระบบ (Part A) ครบ 9 UAT Cases และ Runbooks
├── execution/
│   ├── PARTNER_UAT_RESULTS.md           # แบบบันทึกผลการทดสอบระบบ CrustCraft (Part B)
│   ├── DEFECT_TRIAGE_LOG.md             # บันทึกรายงานข้อบกพร่องทั้ง Outgoing และ Incoming (Part C)
│   └── RETEST_ACCEPTANCE_RECORD.md      # บันทึกการทดสอบซ้ำและการลงนามรับรองระบบแบบ 3 หมวด (Part D)
└── evidence/
    ├── README.md                        # คำอธิบายข้อกำหนดการตั้งชื่อและจัดเก็บไฟล์หลักฐาน
    └── a-preuat-clean.png               # ภาพหลักฐานยืนยันระบบว่างสมบูรณ์ก่อนส่งมอบ (Pre-UAT Clean State)
```
