# PopQueue — Project Deliverable 2 Master Contract & Specification (v1.3)
> **Core Expansion (Sprint 2) & Genuine Progress (Sprint 3) with GCP Deployment**  
> **Course:** CPE 334 Introduction to Software Engineering in the Age of AI Agents (Semester 1/2026, KMUTT)  
> **Project / Theme:** **PopQueue** — Theme 9: Queue and Service Management System (*Art Toy Live Unboxing Station*)  
> **Repository:** `https://github.com/apfirst13/PopQueue_BFteam.git`  
> **Team Members:** `@apfirst13` (aphiwat) & `@Theerawat82` (Theerawat)  
> **Student IDs:** *(ใส่รหัสนักศึกษาทั้ง 2 คนในหน้าปก PDF เท่านั้น — ไม่เปิดเผยใน Repo สาธารณะ)*  
> **Deliverable:** Project Deliverable 2 (70 Points | 7% of Course Grade)  
> **Submission Deadline:** **Sunday, 29 November 2026 at 23:59** (via LEB2, single self-contained PDF)  
> **Contract Version:** `v1.3 (FULL RUBRIC RECONCILIATION & SELF-CONTAINED PDF EDITION)`  
> **Contract Date:** `2026-11-24`  
> **Baseline Tags Audited:** `v0.1.0-sprint1` (`d946159`), `v0.2.0-lab5` (`bf52c9b`), `v0.3.0-lab7` (`a07a7be`)  
> **Audit Evidence Execution Commit:** `75068a6109439b7f5dcadd7713ba93115ab29043` (Branch `sprint-2-docs` — EV-A, EV-B)  
> **Evidence Imported & Integrated Commit:** `830bdc575cfa14f2247e7ea5d3fb5196c348f114` (Branch `docs/sprint2-contract-v1.1` — EV-D)  
> **Target Reviewer:** `@Theerawat82` (Peer Reviewer — PR #61)  
> **Staging Lineage Branch:** `sprint2-staging` (แตกจาก `origin/main` commit `a07a7be`)  
> **Deployed Cloud Run URL:** `*(รอผล Live Verification จากมนุษย์หลัง Deploy v0.4.0 — ดู Issue #55)*`  
> **Immutable Submitted Tag/Commit:** `*(จะเติมก่อน Export PDF หลัง Deploy รอบสุดท้ายบน main)*`

---

## 0. ตารางบันทึกการเปลี่ยนแปลงฉบับเอกสาร (Changelog: v1.0 → v1.2)

| เวอร์ชัน | วันที่ | ส่วนที่แก้ไข / เพิ่มเติม | เหตุผลและความจำเป็นทางวิศวกรรม |
| :---: | :---: | :--- | :--- |
| **v1.0** | 2026-11-23 | ฉบับร่างแรก (Initial Draft) | ร่างข้อกำหนดสัญญา F-05, F-06, F-07 และวางโครงร่าง Deliverable 2 |
| **v1.1** | 2026-11-24 | Audit Reconciliation & Normalization | ปรับแก้ตามผล Ground-Truth Audit: ตัด boolean flag success (true/false), ปรับ SHA เต็ม, แก้ error order ของ No-Show ตามโค้ดจริง, เพิ่ม `serverNow`, ปรับสูตร Analytics |
| **v1.2** | 2026-11-24 | **Full Rubric Alignment & Contract Tightening** | 1. **Release Plan:** ปรับเป็น Staging → PR → `main` → Tag `v0.4.0` (ไม่ deploy จาก staging โดยตรง ไม่ข้าม PR)<br>2. **Decision Gate:** เพิ่ม Go/No-Go Gate วันศุกร์ 12:00 สำหรับ F-07 และเร่งปิด Issue #55<br>3. **Full Part D:** บรรจุ SRS ฉบับสมบูรณ์ (Actors/Scope/FR/BR/NFR) และ System SDS (Architecture/Role Matrix/Env Vars) ไว้ใน Master ครบถ้วน เพื่อให้ PDF สมบูรณ์ในเล่มเดียว<br>4. **ตารางบังคับ:** เพิ่ม Sprint 2 Completion Table, Remaining-Work Table ตามเทมเพลต และ Evidence Plan (§4.1)<br>5. **Traceability:** แยกสถานะ `tested` / `planned` ชัดเจน ไม่เคลมผลเกินจริง, ปรับ F-09 เป็น `Contract Ready`<br>6. **Part A vs D:** แยกผล Local/CI ออกจาก Live Cloud Run, ปรับคำอธิบาย DEF-01<br>7. **Contract Tightening:** กำหนด Precondition/Error Code ชัดเจนใน Race Condition (AC-41.8, AC-43.5), เพิ่ม Role Guard Test ข้าม Role (`TEST-41I`, `TEST-43G`), ขยาย `TEST-46D`, ปรับตัวอย่าง JSON บอร์ด, เพิ่ม AC-44.7 Responsive |

---

## 0.1 ตารางเวอร์ชันและประวัติสายการปล่อย (Central Version & Lineage Table)

| Component / Milestone | Target / Baseline Tag | Base Branch / Lineage | Main Release Commit SHA | Deployed Cloud Run Revision | CI Pipeline Run ID | สถานะการตรวจสอบ (Status) |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| **Sprint 1 Baseline** | `v0.1.0-sprint1` | `sprint-1-staging` | `d946159ba82a249c195730a3b702cf0f68e96e2d` | `popqueue-service-00001` | N/A (Manual CI) | **accepted** ([EV-A01](../../evidence/EV-A01.txt)) |
| **Lab 5 Cloud Deployment** | `v0.2.0-lab5` | `lab5-staging` | `bf52c9b969d905ba6f21bcc22a460f0db3dd5172` | `popqueue-service-00003` | `#118312049` | **accepted** ([EV-A01](../../evidence/EV-A01.txt), [EV-B07](../../evidence/EV-B07.txt)) |
| **Lab 7 Maintenance (BR-02 v2)** | `v0.3.0-lab7` | `main` | `a07a7be732b30cb75a22df7f30edfdc51521a87e` | TBD (Pending Issue #55) | `#119854721` | **accepted** ([EV-A01](../../evidence/EV-A01.txt), [EV-B02](../../evidence/EV-B02.txt)) |
| **Sprint 2 Target Release** | `v0.4.0-sprint2` | `sprint2-staging` → `main` | TBD | TBD | TBD | `planned` |
| **Deliverable 2 Final Candidate** | `v0.5.0-d2-rc` | `feature/lab7-53-backend` → `main` | TBD | TBD | TBD | `planned` |

---

## 0.2 มาตรฐาน Envelope ของระบบ (System Envelope Conventions — FACTS F2)

ทุก Endpoint ในระบบ PopQueue ทั้งในปัจจุบันและฟีเจอร์ใหม่ ต้องปฏิบัติตามโครงสร้าง Envelope สากลของระบบอย่างเคร่งครัด โดยไม่มีการใช้ boolean flag success (true/false) ปะปน:

1. **Success Envelope (HTTP 200 / 201):**
   ```json
   {
     "data": { ... }
   }
   ```
2. **Standard Error Envelope (HTTP 4xx / 5xx):**
   ```json
   {
     "error": {
       "code": "STRING_ERROR_CODE",
       "message": "Human readable explanation",
       "statusCode": 400,
       "details": {}
     }
   }
   ```
   *หมายเหตุ: ฟิลด์ `details` เป็น Optional สำหรับส่งข้อมูลเสริม เช่น รายการ Validation Errors หรือ `remainingSeconds` ในกรณี No-Show*

---

## 0.3 นิยามค่าคงที่ส่วนกลาง (System-Wide Constants)

| ชื่อค่าคงที่ (Constant Name) | ชนิดข้อมูล | ค่าตั้งต้น (Default) | คำอธิบายและฟีเจอร์ที่อ้างอิง |
| :--- | :---: | :---: | :--- |
| `UP_NEXT_LIMIT` | `number` | `5` | จำนวนคิวรอถัดไปสูงสุดที่คืนค่าและแสดงผลบน Public Display Board (`F-07`, `AC-44.3`, `TEST-44B`) |
| `NO_SHOW_SECONDS` | `number` | `120` | กรอบเวลารอคอยขั้นต่ำ (วินาที) นับจาก `calledAt` ก่อนอนุญาตให้ Box Master ตัดสิทธิ์ No-Show (`F-06`, `AC-42.1`, `AC-43.1`, `BR-08`, `TEST-42A`) |
| `RATE_LIMIT_WINDOW_MS` | `number` | `900000` | กรอบเวลา (15 นาที ในหน่วยมิลลิวินาที) สำหรับ Login Rate Limiter (`S3-HARDEN`, `AC-47.1`, `TEST-47A`) |
| `RATE_LIMIT_MAX` | `number` | `10` | จำนวนคำขอสูงสุดต่อ IP ภายใน 1 Window สำหรับ `/api/auth/login` (`S3-HARDEN`, `AC-47.1`, `TEST-47A`) |
| `TRUST_PROXY_HOPS` | `number` | `1` | จำนวน Proxy Hop ที่ Express เชื่อถือสำหรับอ่าน Header `X-Forwarded-For` บน Google Cloud Run (`S3-HARDEN`) |

---

## 0.4 ทะเบียนบันทึกหลักฐานการตรวจประเมิน (Evidence Register)

> **หมายเหตุลำดับ Commit ของหลักฐาน:**  
> - **EV-A01 ถึง EV-A10** และ **EV-B01 ถึง EV-B09:** รันตรวจสอบบน commit `75068a6109439b7f5dcadd7713ba93115ab29043` (Branch `sprint-2-docs` ต้นทาง)  
> - **EV-D01 ถึง EV-D06:** รันตรวจสอบบน commit `830bdc575cfa14f2247e7ea5d3fb5196c348f114` จนถึง `02f0264` บน branch ปัจจุบัน (`docs/sprint2-contract-v1.1`)

| รหัสหลักฐาน (EV-ID) | หัวข้อการตรวจสอบ | ผลลัพธ์ที่คาดหวัง | ผลลัพธ์ที่ตรวจพบจริง (Actual Result) | เวลาที่รันคำสั่ง (ISO) | Commit SHA ที่ตรวจ | ไฟล์หลักฐานบนดิสก์ |
| :---: | :--- | :--- | :--- | :---: | :---: | :--- |
| **EV-A01** | Release Tags & SHAs | Tag v0.1.0, v0.2.0, v0.3.0 ตรงกับ Git | CONFIRMED — d946159, bf52c9b, a07a7be ตรงกัน | 2026-11-24T19:24:39+07:00 | `75068a6109439b7f` | [EV-A01.txt](../../evidence/EV-A01.txt) |
| **EV-A02** | Migrations & Index Predicates | CANCELLED, NO_SHOW หลุดจาก Index | CONFIRMED — Migration 0002/0003 exclude ทั้งสอง | 2026-11-24T19:24:39+07:00 | `75068a6109439b7f` | [EV-A02.txt](../../evidence/EV-A02.txt) |
| **EV-A03** | Prisma Schema Integrity | มี enum และฟิลด์ Sprint 2 ครบ | CONFIRMED — Enum บรรทัด 20-21, forfeitedAt บรรทัด 74 | 2026-11-24T19:24:39+07:00 | `75068a6109439b7f` | [EV-A03.txt](../../evidence/EV-A03.txt) |
| **EV-A04** | Service Error Evaluation Flow | ตรวจสอบลำดับ throw ใน staff.service | CONFIRMED — มี null-guard ก่อนตรวจ NOT_HANDLER | 2026-11-24T19:24:39+07:00 | `75068a6109439b7f` | [EV-A04.txt](../../evidence/EV-A04.txt) |
| **EV-A05** | Clock Abstraction & Calls | calledAt ถูกคุมด้วย clock.now() | CONFIRMED — Interface Clock ใน clock.ts | 2026-11-24T19:24:39+07:00 | `75068a6109439b7f` | [EV-A05.txt](../../evidence/EV-A05.txt) |
| **EV-A06** | Health Endpoint & GIT_SHA | คืน status ok และ commit SHA | CONFIRMED — app.ts:27-34, vitest 4/4 passed | 2026-11-24T19:24:39+07:00 | `75068a6109439b7f` | [EV-A06.txt](../../evidence/EV-A06.txt) |
| **EV-A07** | Test Inventory & R4 Integrity | รันผ่านทั้งหมด ไม่มี skip/only | CONFIRMED — 194 passed (Server 153, Client 34, E2E 7) | 2026-11-24T19:24:39+07:00 | `75068a6109439b7f` | [EV-A07.txt](../../evidence/EV-A07.txt) |
| **EV-A08** | AC/TEST ID Collision Audit | ไม่มีเลข ID ชนกับ Sprint 1 / Labs | CONFIRMED — AC-40 เว้นว่าง; AC-41..47 ว่างตรงกัน | 2026-11-24T19:24:39+07:00 | `75068a6109439b7f` | [EV-A08.txt](../../evidence/EV-A08.txt) |
| **EV-A09** | Issues, PRs & TA Sign-off | ตรวจสอบ Issue #52-#55, PR #57-#60 | CONFIRMED — บันทึกอนุมัติ TA 23 พ.ย. 15:30 บรรทัด 76 | 2026-11-24T19:24:39+07:00 | `75068a6109439b7f` | [EV-A09.txt](../../evidence/EV-A09.txt) |
| **EV-A10** | Git Branch Topology | สำรวจสถานะ origin/main เทียบ local | CONFIRMED — origin/main อยู่ที่ a07a7be (v0.3.0) | 2026-11-24T19:24:39+07:00 | `75068a6109439b7f` | [EV-A10.txt](../../evidence/EV-A10.txt) |
| **EV-B01** | Role Guard Error Code & Shape | คืน 403 FORBIDDEN_ROLE | CONFIRMED — server/src/middleware/auth.ts:85 | 2026-11-24T20:14:40+07:00 | `75068a6109439b7f` | [EV-B01.txt](../../evidence/EV-B01.txt) |
| **EV-B02** | Git Tree Diff vs v0.3.0-lab7 | โค้ด server/client/e2e ต้องเท่ากัน | CONFIRMED — merge-base is ancestor, diff ว่างเปล่า | 2026-11-24T20:14:40+07:00 | `75068a6109439b7f` | [EV-B02.txt](../../evidence/EV-B02.txt) |
| **EV-B03** | QueueCounter Daily Reset & Key | รีเซ็ตรายวัน Asia/Bangkok, ไม่ถอยเลข | CONFIRMED — composite key seriesId, queueDate | 2026-11-24T20:14:40+07:00 | `75068a6109439b7f` | [EV-B03.txt](../../evidence/EV-B03.txt) |
| **EV-B04** | My-Ticket Query Filter & Shape | กรอง 3 สถานะ active, คืน {ticket, tickets} | CONFIRMED — ticket.service.ts:145-212 | 2026-11-24T20:14:40+07:00 | `75068a6109439b7f` | [EV-B04.txt](../../evidence/EV-B04.txt) |
| **EV-B05** | Call-Next Query & FIFO Order | WHERE status='WAITING' SKIP LOCKED | CONFIRMED — ข้าม CANCELLED โดยโครงสร้าง SQL | 2026-11-24T20:14:40+07:00 | `75068a6109439b7f` | [EV-B05.txt](../../evidence/EV-B05.txt) |
| **EV-B06** | Deployment GIT_SHA Pipeline | ส่งผ่าน ARG เข้า ENV Cloud Run | CONFIRMED — deploy.yml:115, Dockerfile:59-60 | 2026-11-24T20:14:40+07:00 | `75068a6109439b7f` | [EV-B06.txt](../../evidence/EV-B06.txt) |
| **EV-B07** | Part A Claims Verification | ตรวจหาหลักฐาน CHG-01, DEF-02, CHG-02 | AUDITED — CHG-01 มีหลักฐานเดิม; อีก 2 ตัว unverified | 2026-11-24T20:14:40+07:00 | `75068a6109439b7f` | [EV-B07.txt](../../evidence/EV-B07.txt) |
| **EV-B08** | Client File Mapping | ยืนยันพาธจริงของหน้าระบบและ API | CONFIRMED — MyTicketPage, StaffCounterPage, etc. | 2026-11-24T20:14:40+07:00 | `75068a6109439b7f` | [EV-B08.txt](../../evidence/EV-B08.txt) |
| **EV-B09** | Working Tree & Screenshots | ตรวจสถานะไฟล์ modified screenshots | REPORTED — Playwright เขียนทับรูป 18 ไฟล์ | 2026-11-24T20:14:40+07:00 | `75068a6109439b7f` | [EV-B09.txt](../../evidence/EV-B09.txt) |
| **EV-D01** | Preflight Checks & Cancel Grep | ตรวจ status, fetch origin/main, cancel grep | PASS — Tracked ตรงเงื่อนไข, origin/main เท่ากัน, no cancel | 2026-11-24T21:50:10+07:00 | `830bdc575cfa14f2` | [EV-D01.txt](../../evidence/EV-D01.txt) |
| **EV-D02** | AC-ID & API Error Code Coverage | ทุก AC ปรากฏใน STS; ทุก error code มี AC | PASS — 74 ACs ปรากฏอย่างน้อย 2 ครั้ง; Error codes ครบ | 2026-11-24T22:00:38+07:00 | `830bdc575cfa14f2` | [EV-D02.txt](../../evidence/EV-D02.txt) |
| **EV-D03** | Pre-written Claims Verification | ตรวจสอบ 100%, Verified, PASS, DONE ใน docs/ | PASS — ทุกบรรทัดที่เหลือมี EV-ID กำกับชัดเจน | 2026-11-24T22:00:50+07:00 | `830bdc575cfa14f2` | [EV-D03.txt](../../evidence/EV-D03.txt) |
| **EV-D04** | Envelope Normalization Audit | ตรวจสอบการตัด boolean flag success ใน API payloads | PASS — ใช้เฉพาะ { data } และ { error }; zero legacy success flag | 2026-11-24T22:00:59+07:00 | `830bdc575cfa14f2` | [EV-D04.txt](../../evidence/EV-D04.txt) |
| **EV-D05** | R4 Test Suite Integrity Check | ตรวจหา skip/only/xit/xdescribe/todo ใน tests | PASS — Exit code 1 ไม่พบการ skip หรือ weaken test เดิม | 2026-11-24T22:01:28+07:00 | `830bdc575cfa14f2` | [EV-D05.txt](../../evidence/EV-D05.txt) |
| **EV-D06** | Diff Stat & Allowed Files Audit | เทียบ origin/main..HEAD และสถานะ working tree | PASS — แก้ไขเฉพาะ Allowed Files; zero code/test changes | 2026-11-24T22:01:35+07:00 | `830bdc575cfa14f2` | [EV-D06.txt](../../evidence/EV-D06.txt) |

---

## สารบัญและโครงสร้างตามเกณฑ์ประเมิน (Rubric Navigation Table)

| ส่วนของเอกสาร (Rubric Part) | คะแนน | หัวข้อหลักและเนื้อหาที่ประเมิน | ตำแหน่งในเอกสาร (Document Pointers) |
| :--- | :---: | :--- | :--- |
| **Part A: Sprint 1 Continuity & Change Status** | **5** | ยืนยัน Critical Domain Journey, Change & Defect Register (Labs 5–7), การตัดสินใจทางวิศวกรรม | Part A §1–§3 (ดู Appendix B: EV-A, EV-B) |
| **Part B: Sprint 2 Contracts & Working Increment** | **25** | Engineering Contracts F-05, F-06, F-07 (API/UI/Data/AC/STS/DoD), Concurrency Guard, Data Shapes | Part B §1–§3 (ดู Appendix B: EV-B, EV-D) |
| **Part C: Sprint 3 Contracts & Working Progress** | **15** | Contracts F-08, F-09, S3-HARDEN + Genuine Working Progress (F-09 Contract & Invariants) | Part C §1–§3 (ดู Appendix B: EV-A05, EV-D) |
| **Part D: Updated SRS, SDS, Traceability** | **10** | Full SRS Baseline, System SDS Architecture & Role Matrix, Traceability Matrix, Complete AC Register (81 ACs) | Part D §1–§6 |
| **Part E: Integrated Candidate & Finish Plan** | **15** | Release Plan (Staging→PR→Main), Parallel Finish Plan, Cross-Feature Checks, Remaining-Work Table, Evidence Plan | Part E §1–§6 |
| **Appendices: Setup, Evidence & Governance** | — | Local Setup, Safe Test Accounts (Sanitized), Evidence Catalog (Self-Contained PDF Archive), Open Decisions, AI Declaration | Appendix A, B, C |
| **รวมทั้งหมด (Total)** | **70** | **ครอบคลุมเกณฑ์การประเมิน Project Deliverable 2 ครบถ้วนตาม Rubric** ([EV-A07](../../evidence/EV-A07.txt), [EV-A08](../../evidence/EV-A08.txt)) | ฉบับสมบูรณ์ Self-Contained PDF |

---

# Part A: Sprint 1 Continuity and Change Status (5 คะแนน)

## 1. การยืนยันความต่อเนื่องของ Sprint 1 (Sprint 1 Baseline & Continuity)
* **Accepted Baseline Release:** Tag `v0.1.0-sprint1` (Commit `d946159ba82a249c195730a3b702cf0f68e96e2d` — [EV-A01](../../evidence/EV-A01.txt))
* **Original Critical Domain Journey Verification:**
  เส้นทางการทำงานหลักของระบบที่ส่งมอบใน Sprint 1 (Collector Login → Join Queue `CRY` → Staff Login → Call Next → Verify & Start → Complete Unboxing) ได้รับการตรวจสอบบน Codebase ปัจจุบัน (`v0.3.0-lab7` / `a07a7be732b30cb75a22df7f30edfdc51521a87e` — [EV-B02](../../evidence/EV-B02.txt))
  * **Automated E2E Suite:** รันคำสั่ง `npx playwright test e2e/full-journey.spec.ts`
  * **ผลการรันจริง ([EV-A07](../../evidence/EV-A07.txt)):** ผ่านทั้ง 3 Tests (Demo 1 ปกติ: 11.5s, Demo 2 ปฏิเสธตามกฎธุรกิจ: 774ms, Demo 3 ปฏิเสธสิทธิ์ข้าม Role: 784ms; รวม 3/3 passed) ไม่พบ Regression บนระบบปัจจุบัน

---

## 2. ทะเบียนการเปลี่ยนแปลงและข้อบกพร่อง (Change & Defect Register: Labs 5–7)

| Finding ID | แหล่งที่มา (Source) | Req / AC ที่กระทบ | ข้อค้นพบและสาเหตุทางวิศวกรรม | การแก้ไข (Resolution) | Accepted Decision | สถานะ / Tag ที่บรรจุ | ผลการทดสอบซ้ำ (Retest Verdict) |
| :---: | :---: | :---: | :--- | :--- | :---: | :---: | :---: |
| **DEF-01** | Lab 6 Blind UAT (Omega-3), Issue `#46` | `FR-04`, `AC-10` | `POST /api/tickets/join` ไม่ตรวจ `seriesId` เป็น required ส่ง body ว่างได้ 500 (เกิดบน Branch `defect/lab6-reintroduce-validation` เท่านั้น) | เพิ่ม Zod schema validation บน staging branch ของการทดลอง | `accepted (resolved on lab6 branch only; out of main production scope)` | **RESOLVED** (Closed `#46`, ไม่เข้า `main`) | `tested` (ยืนยันเฉพาะ Lab 6 staging) |
| **DEF-02** | Lab 6 Blind UAT (Omega-3), Issue `#47` | `FR-01`, `AC-03` | Login ไม่ส่ง password แล้ว API คืน HTTP 500 แทน HTTP 400 `VALIDATION_ERROR` | เพิ่ม Zod validation สำหรับ password ใน `auth.schema.ts`; `[RED]` → `[GREEN]` | `accepted` | **RESOLVED** (`v0.2.0-lab5` → hotfix merged via PR `#48` → `#50`, Commit `72e1bb5`) | `tested` ใน Local/CI ([EV-A07](../../evidence/EV-A07.txt)); `unverified — live evidence pending` บน Cloud Run |
| **CHG-01** | Lab 5 CI/CD & GCP, Issues `#24`–`#32` | `NFR-05` | ติดตั้ง Dockerfile Multi-stage, GitHub Actions CI/CD with WIF, Cloud Run + Cloud SQL PostgreSQL | ติดตั้ง Cloud Run Job `popqueue-migrate` รัน Migration ก่อน deploy Service อัตโนมัติ | `accepted` | **RESOLVED** (Tag `v0.2.0-lab5`, Commit `bf52c9b`) | `tested` (มีหลักฐานเดิมของรุ่น `v0.2.0` ใน `docs/labs/lab05/deployment.md` และภาพ `c05-test1/2/3`; ยังไม่ได้ re-verify บน `v0.3.0` / `v0.4.0`) |
| **CHG-02** | Lab 7 Maintenance, Issue `#52` | `FR-04`, `FR-05`, `BR-02`, `D-08` | ปรับปรุงกฎธุรกิจ `BR-02` จาก "ถือตั๋ว active ได้ 1 ใบทั้งระบบ" เป็น **"ถือตั๋ว active ได้ 1 ใบต่อซีรีส์"** | TA อนุมัติ (23 พ.ย. 15:30); Zero-Gap Migration `0003` สร้าง Partial Unique Index `(userId, seriesId)`; ปรับ `/my-ticket` ให้ส่งคืน array ตั๋ว active ทุกใบ `{ ticket: tickets[0], tickets: [...] }` (หากไม่มีตั๋ว active เลย คืน HTTP 404 `NO_ACTIVE_TICKET` ตามโค้ดจริง **EV-B04**) | `accepted` (TA approved — [EV-A09](../../evidence/EV-A09.txt)) | **RESOLVED** (Tag `v0.3.0-lab7`, Commit `a07a7be`; PRs `#57` → `#60`; Issues `#52`–`#54` closed) | `tested` ใน Local/CI ([EV-A02](../../evidence/EV-A02.txt)); `unverified — live evidence pending` บน Cloud Run *(รอปิด Issue #55)* |

---

## 3. Approved Baseline Revisions & Invariants
1. **Lab 6 Defect Fixes (DEF-01, DEF-02):** แก้ไข Validation บน branch เฉพาะกิจของ Lab 6 และ hotfix password validation บน `main` ผ่านกระบวนการ TDD ครบถ้วน
2. **Lab 7 BR-02 v2 (CHG-02):** รองรับพฤติกรรมร้าน Art Toy จริงที่มีเคาน์เตอร์แกะกล่องแยกตามซีรีส์ ลูกค้าสามารถรับบัตรคิวข้ามซีรีส์พร้อมกันได้ แต่ห้ามจองซ้ำในซีรีส์เดิม (Migration `0003` Zero-Gap: สร้าง Index ใหม่ก่อน Drop Index เก่า — [EV-A02](../../evidence/EV-A02.txt))
3. **Invariant ที่คงไว้ตลอด:**
   - Role-Based Access Control: `COLLECTOR` ถูกบล็อกด้วย HTTP `403 FORBIDDEN_ROLE` เมื่อเข้าถึง Endpoint ของ Staff ([EV-B01](../../evidence/EV-B01.txt))
   - Ownership Guard: ป้องกันการเข้าถึงหรือแก้ไขตั๋วของผู้อื่นด้วย HTTP `403 FORBIDDEN_OWNERSHIP`
   - State Machine: การเปลี่ยนสถานะต้องเป็นไปตาม State Lifecycle เท่านั้น ห้ามข้ามขั้นตอน
   - Atomic Daily Numbering: ออกเลขคิวต่อเนื่องรายวัน รีเซ็ตเที่ยงคืนเวลาไทย (`Asia/Bangkok`) ไม่นำเลขคิวที่ยกเลิกกลับมาใช้ซ้ำ ([EV-B03](../../evidence/EV-B03.txt))

---

# Part B: Sprint 2 Contracts and Working Increment (25 คะแนน)

ใน Sprint 2 นี้ ระบบ PopQueue ขยายขีดความสามารถหลัก (Core Expansion) 3 ฟีเจอร์:
1. **`F-05` Queue Cancellation:** ให้ลูกค้ายกเลิกคิวตนเองขณะรอได้
2. **`F-06` Server-Enforced 120s No-Show:** พนักงานตัดสิทธิ์ลูกค้าที่ไม่มาตามเรียกภายใน 120 วินาที ปลดล็อกพนักงานพ้นจาก `STAFF_BUSY`
3. **`F-07` Public Queue Display Board:** จอบอร์ดสาธารณะหน้าร้าน ไม่ต้องล็อกอิน และไม่มีข้อมูลส่วนบุคคลหลุด

> **Database & Schema Invariant ([EV-A02](../../evidence/EV-A02.txt), [EV-A03](../../evidence/EV-A03.txt)):** ทั้ง `F-05` และ `F-06` ไม่ต้องสร้าง Migration ใหม่ เนื่องจากใน `schema.prisma` มี Enum `CANCELLED`, `NO_SHOW` และฟิลด์ `forfeitedAt` (nullable DateTime) รอไว้แล้ว และผลการตรวจสอบ Migration `0002` และ `0003` ยืนยันว่าทั้งสองสถานะนี้หลุดออกจาก Partial Unique Index ทั้งหมด 100% ([EV-A02](../../evidence/EV-A02.txt)) ส่วน `F-07` เป็น Read-Only Endpoint

---

## 1. Feature Contract: F-05 Queue Cancellation (ลูกค้ายกเลิกตั๋วตนเอง)

### 1.1 Purpose & Scope
อนุญาตให้ Collector ยกเลิกตั๋วคิวที่ตนเองถืออยู่ขณะที่ตั๋วยังอยู่ในสถานะ `WAITING` เพื่อเปิดโอกาสให้ผู้อื่น และเพื่อปลดล็อกโควตาให้ตนเองสามารถกดรับบัตรคิวในซีรีส์เดิมได้ทันที  
* **นอก Scope:** ยกเลิกตั๋วที่ถูกเรียกแล้ว (`CALLED`), กำลังแกะกล่อง (`UNBOXING`), หรือจบแล้ว (`COMPLETED`, `NO_SHOW`, `CANCELLED`)  
* **DB / Migration Impact:** ไม่มี — ใช้ Enum `CANCELLED` และฟิลด์ `forfeitedAt` เดิม ([EV-A03](../../evidence/EV-A03.txt)) ไม่เกิด P2002 Unique Constraint Violation เนื่องจากอยู่นอก Partial Unique Index ([EV-A02](../../evidence/EV-A02.txt))

### 1.2 Linked Requirements & Dependencies
* **Requirements:** `FR-11` (Cancel Ticket), `BR-01` (Non-reuse numbering), `BR-02 v2` (Active quota per series), `BR-04` (Role Guard)
* **Dependencies:** `F-01` (Authentication), `F-02` (Queue Ticket in WAITING state)

### 1.3 State Machine & Concurrency Design
```
[WAITING] ── POST /api/tickets/:id/cancel ──> [CANCELLED]
                                                   │
                                     forfeitedAt = clock.now()
                                     หลุดจาก unique_active_ticket_user_series ทันที (EV-A02)
                                     QueueCounter.lastNumber ไม่ลดลง → เลขคิวเดิมถูกข้ามถาวร (EV-B03)
```
* **Concurrency & Race Guard (AC-41.8 / TEST-41H):**
  - **สถานการณ์จำลอง (Precondition):** ซีรีส์ `CRY` มีตั๋วคิว `WAITING` **เพียงใบเดียว** ในระบบ (ตั๋ว A ของ Collector 1)
  - ในจังหวะเวลาเดียวกันอย่างแม่นยำ Collector 1 ส่งคำขอ `POST /api/tickets/:id/cancel` ขณะที่ Box Master ส่งคำขอ `POST /api/staff/call-next`:
  - **กลไกป้องกันที่ระดับ Database:**
    - ฝั่ง Cancel ใช้ Atomic Conditional Update:
      ```typescript
      const result = await prisma.queueTicket.updateMany({
        where: { id: ticketId, userId: auth.userId, status: TicketStatus.WAITING },
        data: { status: TicketStatus.CANCELLED, forfeitedAt: clock.now() },
      });
      ```
    - ฝั่ง Call-Next ใช้ Row Lock: `SELECT id FROM "QueueTicket" WHERE "seriesId" = $1 AND status = 'WAITING' ORDER BY "queueDate", "queueNumber" ASC LIMIT 1 FOR UPDATE SKIP LOCKED;` ([EV-B05](../../evidence/EV-B05.txt))
  - **ผลลัพธ์ที่กำหนดตายตัว (Deterministic Outcome):**
    1. **กรณี Cancel ถึง DB ก่อน:** ตั๋ว A เปลี่ยนเป็น `CANCELLED` ทันที → คำขอ Cancel ได้รับ HTTP `200 OK`; คำขอ `call-next` ที่ตามมาจะพบว่าไม่มีตั๋ว `WAITING` หลงเหลืออยู่ จึงได้รับ HTTP `404 EMPTY_QUEUE`
    2. **กรณี Call-Next ถึง DB ก่อน:** ตั๋ว A ติด Row Lock และเปลี่ยนเป็น `CALLED` → คำขอ Call-Next ได้รับ HTTP `200 OK`; คำขอ Cancel ที่ตามมาจะพบว่า `result.count === 0` และตั๋วไม่ได้อยู่ในสถานะ `WAITING` อีกต่อไป จึงได้รับ HTTP `400 INVALID_STATE_TRANSITION`
    3. **Invariant:** ไม่มีทางเกิดตั๋วที่อยู่ในทั้งสองสถานะ หรือเกิดข้อผิดพลาดระดับ Unhandled Exception

### 1.4 API Specification: POST /api/tickets/:id/cancel
* **Route:** `POST /api/tickets/:id/cancel`
* **Route File:** `server/src/routes/ticket.routes.ts`
* **Service File:** `server/src/services/ticket.service.ts` (`cancelTicket`)
* **Headers:** `Authorization: Bearer <collector_jwt_token>`
* **Path Parameters:** `id: string` (UUID ของตั๋ว)
* **Request Body:** ไม่มี (Empty Body)
* **Success Response (HTTP 200 OK):**
  ```json
  {
    "data": {
      "id": "7c9e6679-0b2a-4c28-984b-0123456789ab",
      "seriesId": "a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d",
      "displayNumber": "CRY-003",
      "status": "CANCELLED",
      "forfeitedAt": "2026-11-24T12:00:00.000Z"
    }
  }
  ```
* **Deterministic Error Handling Order:**
  1. `401 UNAUTHENTICATED`: ไม่ส่ง Token, Token ปลอม หรือ Token หมดอายุ ([EV-B01](../../evidence/EV-B01.txt))
  2. `403 FORBIDDEN_ROLE`: ผู้เรียกมีบทบาทเป็น `BOX_MASTER` ([EV-B01](../../evidence/EV-B01.txt))
  3. `404 RESOURCE_NOT_FOUND`: ไม่พบตั๋ว ID ที่ระบุในระบบ
  4. `403 FORBIDDEN_OWNERSHIP`: ผู้เรียกไม่ใช่เจ้าของตั๋ว (`ticket.userId !== auth.userId`)
  5. `400 INVALID_STATE_TRANSITION`: ตั๋วไม่ได้อยู่ในสถานะ `WAITING` (เช่น ถูกยกเลิกซ้ำ หรืออยู่ในสถานะ `CALLED`, `UNBOXING`, `COMPLETED`, `NO_SHOW`)

### 1.5 UI Specification: หน้า /my-ticket
* **ตำแหน่งปุ่ม:** แสดงปุ่ม "ยกเลิกคิว" (Cancel Queue) บนการ์ดตั๋วแต่ละใบ เฉพาะตั๋วสถานะ `WAITING` เท่านั้น
* **Confirmation Modal:** แสดง Dialog ยืนยัน: "ต้องการยกเลิกคิว CRY-003 หรือไม่? เลขคิวนี้จะไม่สามารถนำกลับมาใช้ได้อีก"
* **After Cancel:** แสดง Toast สำเร็จ "ยกเลิกคิวสำเร็จ" และรีเฟรชรายการตั๋ว
* **Empty State:** หากยกเลิกตั๋วใบสุดท้ายในมือ ระบบได้รับ `404 NO_ACTIVE_TICKET` จาก API ([EV-B04](../../evidence/EV-B04.txt)) หน้าจอต้องแสดง UI Empty State สะอาดตา ("ไม่มีคิวที่กำลังรอ") โดย **ต้องไม่แสดง Error Alert สีแดง**
* **Error Handling:** จัดการข้อผิดพลาดด้วย Error Toast เฉพาะรหัส `400`, `403`, `404` (ไม่มีรหัส 409)

### 1.6 Numbered Acceptance Criteria (AC: F-05)
* [ ] **AC-41.1 (Valid Cancellation):** Collector ที่มีตั๋ว `WAITING` กดยกเลิกสำเร็จ ได้รับ HTTP 200, สถานะเปลี่ยนเป็น `CANCELLED`, บันทึก `forfeitedAt` เป็นเวลาปัจจุบันจาก Application Clock
* [ ] **AC-41.2 (Quota Release & Immediate Re-join):** หลังยกเลิกสำเร็จ Collector สามารถกด `POST /api/tickets/join` เข้าซีรีส์เดิมได้ทันที ได้รับ HTTP 201 และได้เลขคิวใหม่ท้ายแถวโดยไม่ติดข้อผิดพลาด `409 DUPLICATE_ACTIVE_QUEUE` ([EV-A02](../../evidence/EV-A02.txt))
* [ ] **AC-41.3 (Monotonic Counter & WaitingAhead Update):** เลขคิวที่ถูกยกเลิก (เช่น `CRY-001`) จะถูกข้ามถาวร คิวถัดไปที่กดเข้ามาจะได้รับเลขใหม่ (`CRY-002`) ([EV-B03](../../evidence/EV-B03.txt)) และตั๋วคิวที่อยู่ข้างหลังจะมีค่า `waitingAhead` ลดลง 1 ทันที
* [ ] **AC-41.4 (Forbidden Ownership Rejection):** Collector A พยายามส่งคำขอยกเลิกตั๋วของ Collector B ต้องถูกปฏิเสธด้วย HTTP `403 FORBIDDEN_OWNERSHIP` ตั๋วของ B คงสถานะ `WAITING`
* [ ] **AC-41.5 (Invalid State Transition on Non-Waiting):** กดยกเลิกตั๋วที่สถานะเป็น `CALLED`, `UNBOXING`, `COMPLETED`, `NO_SHOW` หรือยกเลิกซ้ำบนตั๋ว `CANCELLED` ต้องได้รับ HTTP `400 INVALID_STATE_TRANSITION`
* [ ] **AC-41.6 (Structural Call-Next Exclusion):** ตั๋วสถานะ `CANCELLED` จะไม่มีทางถูกเรียกโดย `POST /api/staff/call-next` เนื่องจากคำสั่ง SQL มีเงื่อนไข `WHERE status = 'WAITING'` ชัดเจน ([EV-B05](../../evidence/EV-B05.txt))
* [ ] **AC-41.7 (Multi-Ticket Holding Independence):** Collector ที่ถือตั๋วหลายซีรีส์พร้อมกัน (ตาม BR-02 v2) เมื่อยกเลิกตั๋วใบหนึ่ง ตั๋วใบอื่นใน `data.tickets` ยังคงสถานะเดิมครบถ้วน
* [ ] **AC-41.8 (Cancel vs Call-Next Race Concurrency):** คำขอยกเลิกคิวและคำขอเรียกคิวที่ส่งเข้ามาชนกันบนตั๋วใบเดียว ต้องมีเพียงคำขอเดียวที่สำเร็จ และอีกคำขอได้รับ Error ที่ถูกต้อง (`404 EMPTY_QUEUE` หรือ `400 INVALID_STATE_TRANSITION`)
* [ ] **AC-41.9 (Collector Cancel Access Guards):** Endpoint สำหรับยกเลิกตั๋วจำกัดสิทธิ์เฉพาะ Collector (หรือผู้ถือครอง); หาก Box Master ส่งคำขอต้องได้รับ HTTP 403 `FORBIDDEN_ROLE` ([EV-B01](../../evidence/EV-B01.txt)) และหากไม่ส่ง Authorization Header ต้องได้รับ HTTP 401 `UNAUTHENTICATED` ([EV-B01](../../evidence/EV-B01.txt))
* [ ] **AC-41.10 (Cancellation UI Modal & Clean Empty State):** หน้าจอ `/my-ticket` แสดง Confirmation Dialog เมื่อกดปุ่มยกเลิก, แสดง Toast สีเขียวเมื่อสำเร็จ, และในกรณีที่ตั๋วที่ยกเลิกเป็นตั๋วใบสุดท้ายในมือ (API คืน `404 NO_ACTIVE_TICKET` — [EV-B04](../../evidence/EV-B04.txt)) หน้าจอต้องปรับเข้าสู่ Clean Empty State ("ไม่มีคิวที่กำลังรอ") โดยต้องไม่แสดง Error Banner สีแดงรบกวนผู้ใช้

### 1.7 Software Test Specification (STS: TEST-41)
| Test ID | Covered AC | Level | Test File | Preconditions | Inputs | Expected Output |
| :---: | :---: | :---: | :--- | :--- | :--- | :--- |
| **TEST-41A** | `AC-41.1` | Integration | `server/tests/api/cancel.test.ts` *(planned)* | Collector 1 ล็อกอิน, ถือตั๋ว `CRY-001` (`WAITING`) | `POST /api/tickets/:id/cancel` | HTTP `200`, `status: "CANCELLED"`, `forfeitedAt` ≠ null |
| **TEST-41B** | `AC-41.2`, `AC-41.3` | Integration | `server/tests/api/cancel.test.ts` *(planned)* | เพิ่งยกเลิก `CRY-001` สำเร็จ, มีตั๋ว `CRY-002` รออยู่ | `POST /api/tickets/join` ซีรีส์ `CRY` + เช็กตั๋ว 2 | HTTP `201`, ได้เลข `CRY-003`, ตั๋ว 2 มี `waitingAhead` ลดลง 1 |
| **TEST-41C** | `AC-41.4` | Security | `server/tests/api/cancel.test.ts` *(planned)* | Collector 1 ถือ `CRY-001`, Collector 2 ล็อกอิน | Collector 2 `POST /cancel` ตั๋ว 1 | HTTP `403 FORBIDDEN_OWNERSHIP`, ตั๋ว 1 คงสถานะ `WAITING` |
| **TEST-41D** | `AC-41.5` | Boundary | `server/tests/api/cancel.test.ts` *(planned)* | ตั๋วถูกเรียกแล้ว (`CALLED`) | Collector 1 `POST /cancel` | HTTP `400 INVALID_STATE_TRANSITION`, ตั๋วคงสถานะ `CALLED` |
| **TEST-41E** | `AC-41.5` | Unit | `server/tests/unit/state-machine.test.ts` | State machine transition validator | ตรวจทุกสถานะ → `CANCELLED` | อนุญาตเฉพาะ `WAITING`; ปฏิเสธสถานะอื่นทั้งหมด |
| **TEST-41F** | `AC-41.6` | Integration | `server/tests/api/cancel.test.ts` *(planned)* | มีตั๋ว `CANCELLED` 1 ใบ และ `WAITING` 1 ใบ | Box Master `POST /api/staff/call-next` | HTTP `200`, เรียกได้เฉพาะตั๋ว `WAITING`, ข้ามใบ `CANCELLED` |
| **TEST-41G** | `AC-41.7` | Integration | `server/tests/api/cancel.test.ts` *(planned)* | Collector ถือตั๋ว `CRY` และ `LAB` พร้อมกัน | `POST /cancel` ตั๋ว `CRY` | HTTP `200`, ตั๋ว `LAB` ยังคงอยู่ใน `data.tickets` |
| **TEST-41H** | `AC-41.8` | Concurrency | `server/tests/concurrency/cancel-race.test.ts` *(planned)* | มีตั๋ว `WAITING` ใบเดียว, ยิง Cancel และ Call-Next ชนกัน | Parallel Promise.all() | ฝั่งหนึ่งได้ 200, อีกฝั่งได้ 404 หรือ 400 (ไม่มีตั๋วค้างสถานะคู่) |
| **TEST-41I** | `AC-41.9` | Security | `server/tests/api/cancel.test.ts` *(planned)* | Box Master ล็อกอิน | `POST /api/tickets/:id/cancel` | HTTP `403 FORBIDDEN_ROLE` ([EV-B01](../../evidence/EV-B01.txt)) |
| **TEST-41J** | `AC-41.9` | Security | `server/tests/api/cancel.test.ts` *(planned)* | ไม่ส่ง Authorization Header | `POST /api/tickets/:id/cancel` | HTTP `401 UNAUTHENTICATED` ([EV-B01](../../evidence/EV-B01.txt)) |
| **TEST-41K** | `AC-41.10` | Component / E2E | `client/tests/my-ticket.spec.ts` *(planned)* | มีตั๋ว `WAITING` ใบสุดท้าย | กดปุ่ม Cancel → กดยืนยัน Modal | ได้รับ Toast สำเร็จ, การ์ดตั๋วหายไป, และหน้าจอแสดง Clean Empty State โดยไม่มีแถบ Error สีแดง |

### 1.8 Definition of Done (DoD) — F-05
- [ ] โค้ด Service/Controller/Route ครบถ้วน พร้อม Deterministic Error Handling
- [ ] บันทึก `[RED]` commit SHA และ `[GREEN]` commit SHA ตามระเบียบ TDD
- [ ] Regression Suite เดิม (194 tests) รันผ่าน 100% ไม่มี skip/weaken ([EV-A07](../../evidence/EV-A07.txt))
- [ ] UI ปุ่ม Cancel, Modal, Toast และ Empty State ทำงานสมบูรณ์บนหน้า `/my-ticket`
- [ ] PR ผ่านการ Review และ Merge เข้าสู่ `sprint2-staging`

---

## 2. Feature Contract: F-06 Server-Enforced 120s No-Show (ตัดสิทธิ์ลูกค้าไม่มาตามเรียก)

### 2.1 Purpose & Scope
แก้ปัญหาคอขวดของ Sprint 1 (G-02 / D-09: ลูกค้าไม่มาแสดงตัวทำให้ Box Master ติดสถานะ `STAFF_BUSY` ค้างถาวร): เมื่อตั๋วถูกเรียก (`CALLED`) ระบบจะเริ่มนับเวลาจาก `calledAt` หากเกิน `NO_SHOW_SECONDS` (120 วินาที) แล้วลูกค้าไม่มาแสดงตัว Box Master สามารถกดตัดสิทธิ์ No-Show เพื่อปลดล็อกตนเองให้สามารถเรียกคิวถัดไปได้  
* **ขอบเขตการทำงาน:** Sprint 2 รองรับเฉพาะการกด **Manual Trigger โดย Box Master ประจำสถานีเท่านั้น** (Auto No-Show อัตโนมัติโดยไม่มีคนกด เป็นงานนอกขอบเขตและบันทึกเป็น Known Limitation)  
* **DB / Migration Impact:** ไม่มี — ใช้ Enum `NO_SHOW` และฟิลด์ `forfeitedAt` เดิม ([EV-A03](../../evidence/EV-A03.txt)) ตั๋วที่ถูกตัดสิทธิ์จะหลุดจาก `unique_active_staff_ticket` ทำให้พนักงานหลุดจาก `STAFF_BUSY` ทันที ([EV-A02](../../evidence/EV-A02.txt))

### 2.2 Linked Requirements & Dependencies
* **Requirements:** `FR-12` (No-Show Timeout), `BR-03` (State Machine), `BR-05` (Staff Series Assignment), `BR-06` (Single Active Handling), `BR-07` (Handler Exclusive), `BR-08` (120s Timeout Rule)
* **Dependencies:** `F-03` (Staff Call Queue, `calledAt` timestamp)

### 2.3 State Machine & Server-Side Verification Rule
```
[CALLED] ── POST /api/staff/tickets/:id/no-show ──> [NO_SHOW]
   │          (เงื่อนไข: currentTime - calledAt >= 120 วินาที)          │
   │                                                                      │
   └─ พนักงานติดสถานะ STAFF_BUSY                                            └─ พนักงานหลุดจาก unique_active_staff_ticket
      (unique_active_staff_ticket constraint)                                   สามารถ POST /api/staff/call-next ได้ทันที
```
* **Server-side validation (BR-08):** คำนวณ `Δt = clock.now() − ticket.calledAt`
  - `Δt < 120s` → HTTP `400 NO_SHOW_WINDOW_NOT_EXPIRED` พร้อม `details: { remainingSeconds }`
  - `Δt ≥ 120s` → อนุญาต, บันทึก `forfeitedAt = clock.now()`, เปลี่ยนสถานะเป็น `NO_SHOW`
* **Concurrency Guard (AC-43.5 / TEST-43F):**
  - ทั้งฟังก์ชัน `noShow` และ `startUnboxing` บังคับใช้ Atomic Conditional Update บนเงื่อนไขเดียวกัน:  
    `WHERE id = :ticketId AND status = 'CALLED' AND handledByStaffId = :staffId`
  - หากคำขอหนึ่งเปลี่ยนสถานะสำเร็จไปแล้ว (เป็น `NO_SHOW` หรือ `UNBOXING`) อีกคำขอที่ส่งเข้ามาชนกันจะพบว่า `count === 0` และได้รับ HTTP `400 INVALID_STATE_TRANSITION` อย่างแน่นอน

### 2.4 API Specification: POST /api/staff/tickets/:id/no-show
* **Route:** `POST /api/staff/tickets/:id/no-show`
* **Route File:** `server/src/routes/staff.routes.ts`
* **Service File:** `server/src/services/staff.service.ts` (`noShow`)
* **Headers:** `Authorization: Bearer <box_master_jwt_token>`
* **Path Parameters:** `id: string` (UUID ของตั๋ว)
* **Success Response (HTTP 200 OK):**
  ```json
  {
    "data": {
      "id": "7c9e6679-0b2a-4c28-984b-0123456789ab",
      "displayNumber": "CRY-001",
      "status": "NO_SHOW",
      "forfeitedAt": "2026-11-24T12:02:05.000Z"
    }
  }
  ```
* **Deterministic Error Handling Order (สอดคล้องกับโค้ด Sprint 1 — [EV-A04](../../evidence/EV-A04.txt)):**
  1. `401 UNAUTHENTICATED`: ไม่ได้ยืนยันตัวตน ([EV-B01](../../evidence/EV-B01.txt))
  2. `403 FORBIDDEN_ROLE`: ผู้เรียกไม่ใช่ `BOX_MASTER` ([EV-B01](../../evidence/EV-B01.txt))
  3. `404 RESOURCE_NOT_FOUND`: ไม่พบตั๋ว ID ที่ระบุ
  4. `403 FORBIDDEN_SERIES`: Box Master ไม่ได้รับมอบหมายให้ดูแลซีรีส์ของตั๋วใบนี้
  5. `403 FORBIDDEN_NOT_HANDLER`: พนักงานคนนี้ไม่ใช่ผู้ที่กด Call ตั๋วนี้ไว้ (`ticket.handledByStaffId !== null && ticket.handledByStaffId !== staffId`)
  6. `400 INVALID_STATE_TRANSITION`: ตั๋วไม่ได้อยู่ในสถานะ `CALLED` *(กรณีตั๋ว `WAITING` ซึ่ง `handledByStaffId === null` จะผ่าน null-guard มาตกที่ข้อนี้และได้รับ 400 — [EV-A04](../../evidence/EV-A04.txt))*
  7. `400 NO_SHOW_WINDOW_NOT_EXPIRED`: เวลาผ่านไปยังไม่ครบ 120 วินาที คืน Response:
     ```json
     {
       "error": {
         "code": "NO_SHOW_WINDOW_NOT_EXPIRED",
         "message": "No-show window has not expired yet",
         "statusCode": 400,
         "details": {
           "remainingSeconds": 45
         }
       }
     }
     ```

### 2.5 ServerNow Synchronization & Client Countdown Logic
1. **API Response Enhancement:** เพิ่มฟิลด์ `serverNow: string` (ISO format จาก `clock.now()`) ใน:
   - `POST /api/staff/call-next`
   - `GET /api/tickets/my-ticket`
   - `GET /api/staff/tickets` (Staff Console Overview Endpoint)
2. **Client Countdown Calculation (Offset-based Sync):**  
   เพื่อไม่ให้นาฬิกาของเครื่อง Client ที่อาจตั้งเวลาผิดพลาดส่งผลต่อการนับถอยหลัง แต่ยังคงทำให้ Timer เดินต่อเนื่องทุก 1 วินาที:
   ```typescript
   // คำนวณความต่างเวลาระหว่างเครื่องกับเซิร์ฟเวอร์ครั้งเดียวเมื่อได้ response
   const localOffsetMs = Date.now() - new Date(serverNow).getTime();
   
   // ใน useEffect interval (ทุก 1000ms):
   const virtualServerNow = Date.now() - localOffsetMs;
   const elapsedSeconds = Math.floor((virtualServerNow - new Date(calledAt).getTime()) / 1000);
   const remainingSeconds = Math.max(0, 120 - elapsedSeconds);
   ```
3. **Staff UI Behavior:**
   - เมื่อ `remainingSeconds > 0`: ปุ่ม "ตัดสิทธิ์ No-Show" ถูกปิดใช้งาน (disabled, สีเทา) แสดงข้อความ "รออีก XX วินาที"
   - เมื่อ `remainingSeconds === 0`: ปุ่มเปิดใช้งาน (enabled, สีแดง) แสดงข้อความ "ตัดสิทธิ์ No-Show"

### 2.6 Numbered Acceptance Criteria (AC: F-06)
* [ ] **AC-42.1 (Premature No-Show Rejection):** Box Master พยายามตัดสิทธิ์ก่อนเวลาครบ 120 วินาที (เช่น ผ่านไป 45 วินาที) ต้องได้รับ HTTP `400 NO_SHOW_WINDOW_NOT_EXPIRED`, ตั๋วคงสถานะ `CALLED` และพนักงานยังคงติด `STAFF_BUSY`
* [ ] **AC-42.2 (Clock Boundary Verification):**
  - ผ่านไป 119 วินาที (`Δt = 119s`) → HTTP `400 NO_SHOW_WINDOW_NOT_EXPIRED`
  - ผ่านไป 120 วินาที (`Δt = 120s`) → HTTP `200 OK` (สำเร็จ)
  - ผ่านไป 121 วินาที (`Δt = 121s`) → HTTP `200 OK` (สำเร็จ)
* [ ] **AC-43.1 (Successful No-Show Transition):** เมื่อเวลาผ่านไป ≥ 120 วินาที Box Master ผู้รับผิดชอบกดตัดสิทธิ์สำเร็จ ได้รับ HTTP 200, ตั๋วเปลี่ยนเป็น `NO_SHOW`, บันทึก `forfeitedAt` เป็นเวลาปัจจุบันจาก Application Clock
* [ ] **AC-43.2 (Staff Release from STAFF_BUSY):** ก่อน No-Show สำเร็จ พนักงานเรียก `call-next` จะติด `409 STAFF_BUSY`; ทันทีที่ตั๋วเปลี่ยนเป็น `NO_SHOW` พนักงานหลุดจาก `unique_active_staff_ticket` ([EV-A02](../../evidence/EV-A02.txt)) และสามารถเรียก `call-next` ได้รับ HTTP 200 และได้ตั๋วถัดไปทันที
* [ ] **AC-43.3 (Handler Exclusive Enforcement):** Box Master B พยายามกด No-Show ตั๋วที่ Box Master A เป็นผู้เรียกไว้ ต้องได้รับ HTTP `403 FORBIDDEN_NOT_HANDLER` แม้เวลาจะเกิน 120 วินาทีแล้วก็ตาม
* [ ] **AC-43.4 (Waiting Ticket Rejection):** การพยายามกด No-Show บนตั๋วสถานะ `WAITING` (ซึ่ง `handledByStaffId === null`) ต้องได้รับ HTTP `400 INVALID_STATE_TRANSITION` ([EV-A04](../../evidence/EV-A04.txt))
* [ ] **AC-43.5 (No-Show vs Start-Unboxing Concurrency):** คำขอ No-Show และ Start Unboxing ที่ส่งเข้ามาชนกัน ต้องมีเพียงคำขอเดียวที่สำเร็จ อีกคำขอต้องได้รับ HTTP `400 INVALID_STATE_TRANSITION`
* [ ] **AC-43.6 (Collector Immediate Re-join After No-Show):** Collector ที่ถูกตัดสิทธิ์ No-Show สามารถกด `POST /api/tickets/join` เพื่อรับบัตรคิวในซีรีส์เดิมได้ทันที และได้รับเลขคิวใหม่ท้ายแถวโดยไม่ติด Unique Constraint Violation ([EV-A02](../../evidence/EV-A02.txt))
* [ ] **AC-42.3 (ServerNow Response Payload Synchronization):** Endpoint สำหรับจัดการคิวของตั๋ว active (`/my-ticket`, `/api/staff/call-next`, `/api/series/:id/status`) ต้องส่งคืนฟิลด์ `serverNow` (ISO 8601 String เช่น `"2026-11-24T15:00:00.000Z"`) ที่ได้จาก Application Clock (`clock.now().toISOString()`) เพื่อให้ฝั่ง Client ใช้คำนวณ Local Clock Offset ได้อย่างเที่ยงตรง
* [ ] **AC-43.7 (Staff No-Show Access Guards):** Endpoint การตัดสิทธิ์ No-Show จำกัดสิทธิ์เฉพาะ Box Master เท่านั้น; หาก Collector พยายามเรียกใช้ต้องได้รับ HTTP 403 `FORBIDDEN_ROLE` ([EV-B01](../../evidence/EV-B01.txt)) และหากไม่ส่ง Authorization Header ต้องได้รับ HTTP 401 `UNAUTHENTICATED` ([EV-B01](../../evidence/EV-B01.txt))
* [ ] **AC-43.8 (Countdown Timer & Button State UI):** หน้าจอ Box Master Console คำนวณเวลานับถอยหลัง `remainingSeconds = Math.max(0, 120 - Math.floor((clockNow - calledAt) / 1000))`, แสดงผลปัดขึ้น `Math.ceil(remainingSeconds)` บนปุ่ม, ทำการ Disable ปุ่ม "ตัดสิทธิ์ No-Show" ตลอดเวลาที่ Δt < 120s, และสลับสถานะเป็น Enabled ให้กดได้ทันทีเมื่อเวลาครบ Δt ≥ 120s

### 2.7 Software Test Specification (STS: TEST-42, TEST-43)
| Test ID | Covered AC | Level | Test File | Preconditions | Inputs | Expected Output |
| :---: | :---: | :---: | :--- | :--- | :--- | :--- |
| **TEST-42A** | `AC-42.1`, `AC-42.2` | Boundary | `server/tests/api/no-show.test.ts` *(planned)* | Box Master เรียกตั๋ว, FakeClock +119s | `POST /api/staff/tickets/:id/no-show` | HTTP `400`, `code: "NO_SHOW_WINDOW_NOT_EXPIRED"`, `remainingSeconds: 1` |
| **TEST-42B** | `AC-42.2` | Boundary | `server/tests/api/no-show.test.ts` *(planned)* | FakeClock +120s ตรง | `POST /api/staff/tickets/:id/no-show` | HTTP `200`, `status: "NO_SHOW"`, `forfeitedAt` recorded |
| **TEST-42C** | `AC-42.2` | Boundary | `server/tests/api/no-show.test.ts` *(planned)* | FakeClock +121s | `POST /api/staff/tickets/:id/no-show` | HTTP `200`, `status: "NO_SHOW"` |
| **TEST-42D** | `AC-42.3` | Integration | `server/tests/api/no-show.test.ts` *(planned)* | Server รันด้วย FakeClock | เรียก `/api/tickets/my-ticket` และ `/api/staff/call-next` | Payload ส่งคืนฟิลด์ `serverNow` เป็น ISO 8601 string ที่ตรงกับ FakeClock |
| **TEST-43A** | `AC-43.1`, `AC-43.2` | Integration | `server/tests/api/no-show.test.ts` *(planned)* | ก่อน No-Show (<120s) | Box Master `POST /api/staff/call-next` | HTTP `409 STAFF_BUSY` |
| **TEST-43B** | `AC-43.1`, `AC-43.2` | Integration | `server/tests/api/no-show.test.ts` *(planned)* | หลัง No-Show สำเร็จ (≥120s) | Box Master `POST /api/staff/call-next` | HTTP `200`, ได้ตั๋วใบถัดไป, หลุด BUSY สำเร็จ |
| **TEST-43C** | `AC-43.3` | Security | `server/tests/api/no-show.test.ts` *(planned)* | FakeClock +150s, Box Master B ล็อกอิน | Box Master B `POST /no-show` ตั๋วของ A | HTTP `403 FORBIDDEN_NOT_HANDLER`, ตั๋วยังเป็น `CALLED` |
| **TEST-43D** | `AC-43.4` | Validation | `server/tests/api/no-show.test.ts` *(planned)* | ตั๋วสถานะ `WAITING` | Box Master `POST /no-show` ตั๋วนี้ | HTTP `400 INVALID_STATE_TRANSITION` |
| **TEST-43E** | `AC-43.6` | Integration | `server/tests/api/no-show.test.ts` *(planned)* | Collector ถูกตัด No-Show | Collector `POST /api/tickets/join` ซีรีส์เดิม | HTTP `201`, ได้เลขคิวใหม่ท้ายแถว |
| **TEST-43F** | `AC-43.5` | Concurrency | `server/tests/concurrency/no-show-race.test.ts` *(planned)* | ตั๋ว `CALLED`, No-Show ชนกับ Start-Unboxing | Parallel Promise.all() | สำเร็จ 1 คำขอ, อีกฝั่งได้รับ 400 INVALID_STATE_TRANSITION |
| **TEST-43G** | `AC-43.7` | Security | `server/tests/api/no-show.test.ts` *(planned)* | Collector ล็อกอิน | `POST /api/staff/tickets/:id/no-show` | HTTP `403 FORBIDDEN_ROLE` ([EV-B01](../../evidence/EV-B01.txt)) |
| **TEST-43H** | `AC-43.7` | Security | `server/tests/api/no-show.test.ts` *(planned)* | ไม่ส่ง Authorization Header | `POST /api/staff/tickets/:id/no-show` | HTTP `401 UNAUTHENTICATED` ([EV-B01](../../evidence/EV-B01.txt)) |
| **TEST-43I** | `AC-43.8` | Component / E2E | `client/tests/staff-counter.spec.ts` *(planned)* | ตั๋วสถานะ `CALLED` | ตรวจสอบสถานะปุ่ม No-Show | แสดงตัวเลขนับถอยหลัง `Math.ceil()`, ปุ่ม disabled ในช่วง 0–119s และ enabled อัตโนมัติเมื่อครบ 120s |

### 2.8 Definition of Done (DoD) — F-06
- [ ] Service method `noShow` ใน `staff.service.ts` พร้อม FakeClock boundary check
- [ ] บันทึก `[RED]` commit SHA และ `[GREEN]` commit SHA
- [ ] Regression Suite เดิม (194 tests) รันผ่าน 100% ([EV-A07](../../evidence/EV-A07.txt))
- [ ] UI CountdownTimer, Disabled/Enabled Button, Modal และ Toast บน Staff Console
- [ ] เพิ่ม `serverNow` ใน response ของ API 3 ตัวครบถ้วน

---

## 3. Feature Contract: F-07 Public Queue Display Board (จอบอร์ดแสดงคิวสาธารณะหน้าร้าน)

### 3.1 Purpose & Scope
จัดเตรียมหน้าจอแสดงผลคิวสาธารณะสำหรับติดตั้งหน้าร้าน Art Toy เพื่อให้ลูกค้ามองเห็นคิวที่กำลังให้บริการและคิวรอถัดไปได้จากระยะไกล โดยไม่ต้องล็อกอิน  
* **ข้อกำหนดความเป็นส่วนตัวขั้นเด็ดขาด (NFR-02):** ต้องไม่มีข้อมูลส่วนบุคคล (Zero PII) ใน API Response เด็ดขาด ใช้ Prisma `select` projection ที่ระดับ Database Query ห้าม Query ออกมาแล้วตัดทิ้ง  
* **ความสอดคล้องของชุดข้อมูล (Dataset & FIFO Consistency — FACTS F6):** เพื่อให้รายการ "คิวถัดไป" (Up Next) ตรงกับสิ่งที่ Box Master จะกดเรียกจริง บอร์ดสาธารณะต้องใช้การเรียงลำดับและชุดข้อมูลเดียวกับ `call-next` คือ:  
  `ORDER BY queueDate ASC, queueNumber ASC` โดย **ไม่กรองวันที่** ([EV-B05](../../evidence/EV-B05.txt))  
* **Known Limitation G-07 (Overnight Leftover Tickets):** หากมีตั๋วค้างข้ามคืน ตั๋วของวันก่อนหน้าจะแสดงในหมวด Up Next ก่อนตั๋วของวันนี้ และอาจเกิดเลขคิว `displayNumber` ซ้ำกันข้ามวันเนื่องจากตัวนับรีเซ็ตรายวัน ([EV-B03](../../evidence/EV-B03.txt)) ซึ่งเป็นพฤติกรรมที่ยอมรับได้ในข้อจำกัดทางสถาปัตยกรรมปัจจุบัน (บันทึก ณ วันที่ 2026-11-24)

### 3.2 Linked Requirements & Dependencies
* **Requirements:** `FR-13` (Public Queue Display), `NFR-02` (Data Privacy & Zero PII), `NFR-06` (Responsive Display)
* **Dependencies:** `F-02` (Series & Tickets), `F-03` (Active Serving Status)

### 3.3 API Specification: GET /api/public/queue-board
* **Route:** `GET /api/public/queue-board`
* **Route File:** `server/src/routes/public.routes.ts` *(ไฟล์ใหม่ — ไม่ผ่าน authenticateToken)*
* **Service File:** `server/src/services/public.service.ts` *(ไฟล์ใหม่)*
* **Authentication:** **None (Public Route)** — ไม่ต้องส่ง Authorization Header
* **Rate Limiting:** ไม่ถูกจำกัดโดย Auth Login Rate Limiter (`S3-HARDEN`)
* **Cache-Control Header:** `no-store, no-cache, must-revalidate`
* **Success Response (HTTP 200 OK):**
  ```json
  {
    "data": {
      "timestamp": "2026-11-24T12:00:00.000Z",
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
            { "queueNumber": 4, "displayNumber": "CRY-004" },
            { "queueNumber": 5, "displayNumber": "CRY-005" },
            { "queueNumber": 6, "displayNumber": "CRY-006" },
            { "queueNumber": 7, "displayNumber": "CRY-007" },
            { "queueNumber": 8, "displayNumber": "CRY-008" }
          ],
          "waitingCount": 8
        }
      ]
    }
  }
  ```
  *คำชี้แจงความสอดคล้องของตัวเลข (Mathematical Alignment):*
  - ในตัวอย่างข้างต้น ซีรีส์ `CRY` มีคิวรอทั้งหมด `waitingCount = 8` ใบ (คิวหมายเลข 4 ถึง 11)
  - รายการ `upNext` ตัดแสดงผลสูงสุด `UP_NEXT_LIMIT = 5` ใบแรก (คือคิวหมายเลข 4, 5, 6, 7, 8)
  - อีก 3 ใบที่เหลือ (คิวหมายเลข 9, 10, 11) ยังคงรอต่อแถวอยู่หลังจอบอร์ด ทำให้ `upNext.length` (5) $\le$ `UP_NEXT_LIMIT` (5) และ `waitingCount` (8) $\ge$ `upNext.length` (5) ถูกต้องสมบูรณ์

### 3.4 UI Specification: หน้า /board
* **Route:** `/board` (Public Route ไม่แสดงปุ่ม Login)
* **Layout:** Kiosk-style full-screen, Art Toy theme, ตัวอักษรใหญ่อ่านง่ายจากระยะ 3 เมตร
* **Integer Sorting Rule:** จัดเรียงลำดับคิวด้วย `queueNumber` (Int) ไม่เรียงด้วยตัวอักษรสตริง เพื่อป้องกันข้อผิดพลาดกรณีเลขคิว 9 และ 10
* **Closed Series Handling:** หากซีรีส์ถูกตั้งเป็น `isActive: false` แต่ยังมีตั๋ว Active ตกค้างอยู่ ให้แสดงการ์ดซีรีส์บนบอร์ดพร้อมป้าย Badge สีส้ม "ปิดรับคิวใหม่" (Closed for new joins) เพื่อให้บริการตั๋วเดิมจนจบ
* **Auto-Refresh:** Polling API ทุก 3 วินาที (3000ms)
* **Responsive (NFR-06):** รองรับจอ TV แนวนอน 1920×1080, Tablet 768px, และ Mobile 375px โดยไม่มีการตัดตกหรือเกิด Horizontal Overflow
* **Empty State:** เมื่อไม่มีตั๋ว Active ในซีรีส์ แสดงข้อความ "ไม่มีคิวรอในขณะนี้"

### 3.5 Numbered Acceptance Criteria (AC: F-07)
* [ ] **AC-44.1 (Unauthenticated Public Access):** เรียก `GET /api/public/queue-board` โดยไม่ส่ง Token เข้าถึงได้สำเร็จ (HTTP 200 OK)
* [ ] **AC-44.2 (Zero PII Assertion on Response Values):** ตรวจสอบ JSON Response body ทุกระดับ ต้องไม่พบข้อมูลส่วนบุคคลใดๆ ทั้งในแง่คีย์และค่า (Value String Check): ไม่พบ `userId`, `username`, `passwordHash`, `fullName`, `tokenVersion`, `handledByStaffId` ใน `JSON.stringify(body)`
* [ ] **AC-44.3 (UpNext Limit & Waiting Count Accuracy):** ในกรณีที่มีคิวรอมากกว่า 5 ตั๋ว รายการ `upNext` ต้องมีจำนวนเท่ากับ `UP_NEXT_LIMIT` (5 ใบพอดี) และค่า `waitingCount` ต้องแสดงจำนวนคิวรอจริงทั้งหมด
* [ ] **AC-44.4 (Integer Sorting Assertion):** รายการใน `upNext` ต้องเรียงตาม `queueNumber` (ตัวเลขจำนวนเต็ม) อย่างถูกต้อง โดยคิวหมายเลข 9 ต้องแสดงก่อนหมายเลข 10
* [ ] **AC-44.5 (Closed Series Visibility with Badge):** ซีรีส์ที่ปิดรับคิว (`isActive: false`) หากยังมีตั๋ว Active ค้างอยู่ ต้องแสดงบนบอร์ดพร้อมป้าย "ปิดรับคิว" (`isActive: false`)
* [ ] **AC-44.6 (Excluded Status Filtering):** ตั๋วสถานะ `NO_SHOW`, `CANCELLED`, และ `COMPLETED` ต้องไม่ปรากฏใน `nowServing`, `upNext`, หรือ `waitingCount`
* [ ] **AC-44.7 (Responsive Display Across Viewports):** หน้าเว็บ `/board` แสดงผลได้ถูกต้องบน Viewport ขนาด 1920×1080 (TV), 768px (Tablet), และ 375px (Mobile) โดยไม่ล้นจอ

### 3.6 Software Test Specification (STS: TEST-44)
| Test ID | Covered AC | Level | Test File | Preconditions | Inputs | Expected Output |
| :---: | :---: | :---: | :--- | :--- | :--- | :--- |
| **TEST-44A** | `AC-44.1`, `AC-44.2`, `AC-44.6` | Security | `server/tests/api/public-board.test.ts` *(planned)* | มีตั๋ว WAITING, CALLED, UNBOXING, COMPLETED, NO_SHOW, CANCELLED | `GET /api/public/queue-board` ไม่ส่ง auth | HTTP `200`, ค่า Seed username/name ไม่ปรากฏใน body string, ตั๋ว inactive ไม่แสดง |
| **TEST-44B** | `AC-44.3` | Integration | `server/tests/api/public-board.test.ts` *(planned)* | ซีรีส์ CRY มีคิวรอ 8 ตั๋ว (คิว 4..11) | `GET /api/public/queue-board` | `upNext.length === 5`, `waitingCount === 8`, เรียง 4 ถึง 8 |
| **TEST-44C** | `AC-44.1` | E2E | `e2e/public-board.spec.ts` *(planned)* | หน้า `/board` เปิดอยู่, เปลี่ยนสถานะตั๋วผ่าน API | รอ ≤ 4 วินาที | หน้าจอ `/board` อัปเดตแสดงสถานะใหม่โดยอัตโนมัติ (พิสูจน์ 3s polling) |
| **TEST-44D** | `AC-44.5` | Integration | `server/tests/api/public-board.test.ts` *(planned)* | ซีรีส์ CRY ปิด (`isActive: false`) แต่มีคิวรอ 1 ใบ | `GET /api/public/queue-board` | การ์ด CRY ปรากฏบนบอร์ด, `isActive: false`, `waitingCount === 1` |
| **TEST-44E** | `AC-44.4` | Boundary | `server/tests/api/public-board.test.ts` *(planned)* | มีตั๋วคิว 9 และคิว 10 ในระบบ | `GET /api/public/queue-board` | `upNext[0].queueNumber === 9`, `upNext[1].queueNumber === 10` |
| **TEST-44F** | `AC-44.7` | UI/E2E | `e2e/responsive.spec.ts` *(planned)* | เข้าหน้า `/board` ด้วย Viewport 1920×1080, 768×1024, 375×667 | ตรวจสอบ bounding box | ไม่มี horizontal scrollbar, font ขนาดอ่านง่าย |

### 3.7 Definition of Done (DoD) — F-07
- [ ] Route `/api/public/queue-board` เป็น Public ไม่ผ่าน auth middleware
- [ ] ใช้ Prisma `select` projection ปลอด PII ทั้งหมด ([EV-A07](../../evidence/EV-A07.txt), `TEST-44A`)
- [ ] บันทึก `[RED]` → `[GREEN]` commit chain
- [ ] หน้าเว็บ UI `/board` Kiosk-style Responsive + Polling 3 วินาที
- [ ] PR Review และ CI ผ่านครบถ้วน

---

# Part C: Sprint 3 Contracts and Working Progress (15 คะแนน)

## 1. Feature Contract: F-08 Daily Service Analytics (สถิติบริการประจำวัน)

### 1.1 Purpose & Scope
สรุปข้อมูลเชิงสถิติเกี่ยวกับประสิทธิภาพการให้บริการประจำวัน เพื่อให้ผู้จัดการร้านประเมินจำนวนคิว อัตรา No-Show และเวลารอเฉลี่ย  
* **Actor & Permission:** `BOX_MASTER` เท่านั้น (`403 FORBIDDEN_ROLE` สำหรับ Collector)  
* **นิยามของ "วัน" (Queue Date Partition — FACTS F3):** สถิติจะถูกกรองและจัดกลุ่มตามฟิลด์ **`queueDate`** (`Asia/Bangkok` Date string) ซึ่งเป็นฟิลด์หลักในการออกเลขคิวประจำวัน ([EV-B03](../../evidence/EV-B03.txt)) ไม่ใช้ `createdAt` เพื่อป้องกันปัญหา Timezone drift

### 1.2 Linked Requirements & Dependencies
* **Requirements:** `FR-14` (Daily Analytics)
* **Dependencies:** `F-03` (`calledAt`, `startedAt`, `completedAt`), `F-05` (`CANCELLED`), `F-06` (`NO_SHOW`)

### 1.3 API Specification: GET /api/staff/analytics
* **Route:** `GET /api/staff/analytics`
* **Headers:** `Authorization: Bearer <box_master_jwt>`
* **Query Parameters:**
  - `date`: (optional, format `YYYY-MM-DD`, default: วันนี้ตามเวลาไทย `getQueueDate()`)
  - `seriesId`: (optional, default: ทุกซีรีส์ที่ Staff ได้รับมอบหมาย)
* **Success Response (HTTP 200 OK):**
  ```json
  {
    "data": {
      "date": "2026-11-24",
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
          "noShowRate": 0.10
        }
      ]
    }
  }
  ```
* **สูตรการคำนวณและการพิสูจน์ตัวเลข (Mathematical Formulas & Verification):**
  1. `totalTickets` = `completedCount (18) + cancelledCount (3) + noShowCount (2) + waitingCount (2) + calledCount (0) + unboxingCount (0)` = **25**
  2. `noShowRate` = $\frac{\text{noShowCount}}{\text{completedCount} + \text{noShowCount}} = \frac{2}{18 + 2} = \frac{2}{20} =$ **`0.10`** *(10.0% — แก้ไขจากค่า 0.08 ใน v1.0)*
  3. `avgWaitTimeSeconds` = ค่าเฉลี่ยของ $(\text{calledAt} - \text{createdAt})$ สำหรับตั๋วที่ถูกเรียกแล้วทั้งหมด (20 ใบ): $\frac{6840\text{s}}{20} =$ **342 วินาที**
  4. `avgServiceTimeSeconds` = ค่าเฉลี่ยของ $(\text{completedAt} - \text{startedAt})$ สำหรับตั๋วสถานะ `COMPLETED` (18 ใบ): $\frac{3330\text{s}}{18} =$ **185 วินาที**
* **Deterministic Error Handling:**
  1. `401 UNAUTHENTICATED`: ไม่ส่ง Token
  2. `403 FORBIDDEN_ROLE`: Collector พยายามเข้าถึงสถิติ
  3. `400 VALIDATION_ERROR`: รูปแบบวันที่ไม่ถูกต้อง (เช่น `date=invalid` หรือ `date=2026-13-45`)
  4. `403 FORBIDDEN_SERIES`: Staff ระบุ `seriesId` ที่ตนเองไม่ได้รับมอบหมาย

### 1.4 UI Specification
* **Route:** แท็บ Analytics ภายใน Staff Console
* **UI States:** Loading Skeleton, Empty State (วันที่ไม่มีตั๋ว), Error Alert, Invalid Date Warning

### 1.5 Numbered Acceptance Criteria (AC: F-08) & Test Spec (TEST-45)
* [ ] **AC-45.1 (Accurate Daily Aggregation):** สถิติรวมตั๋วแยกตามสถานะตรงกับฐานข้อมูลจริงตาม `queueDate`
* [ ] **AC-45.2 (Role & Series Scope Authorization):** Collector เข้าถึงได้รับ `403 FORBIDDEN_ROLE`; Staff ดูซีรีส์นอกเหนือหน้าที่ได้รับ `403 FORBIDDEN_SERIES`
* [ ] **AC-45.3 (Mathematical Precision of Averages):** คำนวณ `avgWaitTimeSeconds`, `avgServiceTimeSeconds`, และ `noShowRate` ถูกต้องตามสูตร หากตัวหารเป็น 0 คืนค่า 0
* [ ] **AC-45.4 (Date Validation Rejection):** ส่งพารามิเตอร์ `date` ผิดรูปแบบต้องได้รับ HTTP `400 VALIDATION_ERROR`

| Test ID | Covered AC | Level | Test File | Inputs | Expected Output |
| :---: | :---: | :---: | :--- | :--- | :--- |
| **TEST-45A** | `AC-45.1`, `AC-45.3` | Integration | `server/tests/api/analytics.test.ts` *(planned)* | มีตั๋ว Completed 18, No-Show 2, Cancelled 3, Waiting 2 | `completedCount: 18`, `noShowRate: 0.10`, `totalTickets: 25` |
| **TEST-45B** | `AC-45.2` | Security | `server/tests/api/analytics.test.ts` *(planned)* | Collector JWT | HTTP `403 FORBIDDEN_ROLE` |
| **TEST-45C** | `AC-45.3` | Boundary | `server/tests/api/analytics.test.ts` *(planned)* | วันที่ไม่มีตั๋ว (`date=2026-01-01`) | HTTP `200`, ทุกค่าเป็น `0`, `noShowRate: 0` |
| **TEST-45D** | `AC-45.1`, `AC-45.3` | Unit/Prisma | `server/tests/api/analytics.test.ts` *(planned)* | Seed ตั๋วด้วย Prisma โดยตรงพร้อมกำหนด Timestamps คงที่ | ยืนยันผลคำนวณเฉลี่ยตรงกับผลลัพธ์คำนวณมือ (ไม่ใช้ FakeClock กับ `createdAt` — [EV-B03](../../evidence/EV-B03.txt)) |
| **TEST-45E** | `AC-45.4` | Validation | `server/tests/api/analytics.test.ts` *(planned)* | `date=2026-99-99` | HTTP `400 VALIDATION_ERROR` |

---

## 2. Feature Contract: F-09 Series Availability Control (เปิด-ปิดซีรีส์) — Planned (Contract Ready)

ทีมงานกำหนดให้ **`F-09`** เป็น Genuine Working Progress ในการส่งมอบ Deliverable 2 โดยส่วนที่ baseline รองรับอยู่เดิมคือการปฏิเสธการจองตั๋วในซีรีส์ที่ปิด (`BR-09` / `AC-12`: HTTP `409 SERIES_CLOSED`) ส่วนฟีเจอร์การสลับสถานะผ่าน PATCH endpoint และสวิตช์ควบคุมบนหน้าจอ Staff ถือเป็นงานชิ้นใหม่ที่เปิด Contract และเตรียมพัฒนาสำหรับ Sprint 3 โดยเฉพาะ

### 2.1 Purpose & Scope
อนุญาตให้ Box Master สามารถสลับสถานะเปิด (`isActive: true`) หรือปิด (`isActive: false`) ซีรีส์ที่ตนได้รับมอบหมายเท่านั้น  
* **ผลลัพธ์เมื่อปิดซีรีส์ (AC-46.4 / CF-04 / CF-05):**
  - ตั๋วเดิมที่ค้างอยู่ในคิว (`WAITING`, `CALLED`, `UNBOXING`) ยังคงสามารถ Call Next, Start Unboxing และ Complete ได้ตามปกติจนจบกระบวนการ
  - คำขอ `POST /api/tickets/join` ใหม่จะถูกปฏิเสธด้วย HTTP `409 SERIES_CLOSED` (สอดคล้องกับ `ticket.service.ts` เดิม)
  - บน Public Board ซีรีส์ที่ปิดยังคงแสดงอยู่หากมีตั๋วค้าง พร้อมป้าย Badge "ปิดรับคิว"

### 2.2 API Specification: PATCH /api/staff/series/:id/status
* **Route:** `PATCH /api/staff/series/:id/status`
* **Route File:** `server/src/routes/staff.routes.ts`
* **Headers:** `Authorization: Bearer <box_master_jwt>`
* **Request Body:** `{ "isActive": false }`
* **Success Response (HTTP 200 OK):**
  ```json
  {
    "data": {
      "id": "a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d",
      "code": "CRY",
      "name": "Crybaby Sunset Concert",
      "isActive": false
    }
  }
  ```
* **Deterministic Error Handling:**
  1. `401 UNAUTHENTICATED`: ไม่ส่ง Token
  2. `403 FORBIDDEN_ROLE`: Collector พยายามสลับสถานะ
  3. `400 VALIDATION_ERROR`: Body ไม่ใช่ boolean เช่น `{ "isActive": "no" }`
  4. `404 RESOURCE_NOT_FOUND`: ไม่พบซีรีส์ ID ที่ระบุ
  5. `403 FORBIDDEN_SERIES`: Box Master ไม่ได้รับมอบหมายให้ดูแลซีรีส์นี้

### 2.3 Acceptance Criteria (AC: F-09) & Test Spec (TEST-46)
* [ ] **AC-46.1 (Authorized Status Toggle):** Box Master ประจำซีรีส์สามารถเปลี่ยนสถานะ `isActive` ได้สำเร็จ (HTTP 200)
* [ ] **AC-46.2 (Join Prevention on Closed Series):** ทันทีที่ซีรีส์ถูกตั้งเป็น `isActive: false` Collector ที่พยายาม Join ต้องได้รับ HTTP `409 SERIES_CLOSED`
* [ ] **AC-46.3 (Unauthorized Series Toggle Rejection):** Box Master ที่ไม่ได้ดูแลซีรีส์นี้พยายาม Toggle ต้องได้รับ HTTP `403 FORBIDDEN_SERIES`
* [ ] **AC-46.4 (Existing Tickets Continuity Across All States):** หลังซีรีส์ปิด ตั๋ว `WAITING` สามารถ Call Next ได้, ตั๋ว `CALLED` สามารถ Start Unboxing ได้, และตั๋ว `UNBOXING` สามารถ Complete ได้ตามปกติ (ยืนยันจากโค้ดจริงใน `server/src/services/staff.service.ts:182-187` ([EV-A05](../../evidence/EV-A05.txt)) ว่าคำสั่ง SQL ดึงคิวของ `callNext` ตรวจสอบเฉพาะ `WHERE "seriesId" = ${seriesId} AND "status" = 'WAITING'::"TicketStatus"` โดยไม่มีการตรวจสอบฟิลด์ `isActive` ดังนั้นตั๋วเดิมที่ค้างอยู่จึงสามารถถูกเรียกและให้บริการจนเสร็จสิ้นได้ 100% ตามธรรมชาติของระบบ)
* [ ] **AC-46.5 (Idempotency & Re-open Validation):** ส่งสถานะเดิมซ้ำได้รับ HTTP 200 (Idempotent); เปิดกลับ `isActive: true` ทำให้ Collector กลับมา Join ได้ปกติ

| Test ID | Covered AC | Level | Test File | Inputs | Expected Output |
| :---: | :---: | :---: | :--- | :--- | :--- |
| **TEST-46A** | `AC-46.1` | Integration | `server/tests/api/series-toggle.test.ts` *(planned)* | Box Master CRY: `PATCH /status` `{ isActive: false }` | HTTP `200`, `isActive: false` |
| **TEST-46B** | `AC-46.2` | Integration | `server/tests/api/series-toggle.test.ts` *(planned)* | ซีรีส์ CRY ปิดอยู่, Collector `POST /api/tickets/join` | HTTP `409 SERIES_CLOSED` (สอดคล้อง AC-12) |
| **TEST-46C** | `AC-46.3` | Security | `server/tests/api/series-toggle.test.ts` *(planned)* | Box Master LAB พยายามปิดซีรีส์ CRY | HTTP `403 FORBIDDEN_SERIES` |
| **TEST-46D** | `AC-46.4` | Continuity | `server/tests/api/series-toggle.test.ts` *(planned)* | ซีรีส์ CRY ปิด, แต่มีตั๋ว WAITING, CALLED, UNBOXING | ทดสอบ Call, Start, Complete สำเร็จทั้ง 3 ขั้นตอน |
| **TEST-46E** | `AC-46.5` | Validation | `server/tests/api/series-toggle.test.ts` *(planned)* | Body `{ isActive: "disabled" }` | HTTP `400 VALIDATION_ERROR` |

---

## 3. Contract: S3-HARDEN Rate Limiting & System Hardening

### 3.1 Technical Specification & Reverse Proxy Trust
* **Express Proxy Trust Configuration:** กำหนดจำนวน Proxy Hop ที่แน่ชัดใน `server/src/app.ts`:  
  `app.set('trust proxy', 1);`  
  *(ระบุค่า 1 hop สำหรับ Google Cloud Run เพื่ออ่าน Client IP จาก hop แรกของ `X-Forwarded-For` อย่างถูกต้อง และป้องกัน IP Spoofing; การทดสอบจริงบน Cloud Run ถือเป็น NOT RUN จนกว่ามนุษย์จะรัน live check)*
* **Configurable Limits via Environment Variables:**
  - `RATE_LIMIT_WINDOW_MS`: ค่าตั้งต้น `900000` (15 นาที)
  - `RATE_LIMIT_MAX`: ค่าตั้งต้น `10` คำขอ
  - ในสภาวะแวดล้อม `NODE_ENV=test`: สามารถปรับลด Window ให้สั้นลงเพื่อการทดสอบ Integration หรือขยายเพดานเพื่อไม่ให้กระทบ E2E Test Suites
* **Response Envelope on HTTP 429:**
  ```json
  {
    "error": {
      "code": "RATE_LIMIT_EXCEEDED",
      "message": "Too many login attempts from this IP, please try again after 15 minutes",
      "statusCode": 429
    }
  }
  ```
  พร้อมแนบ Header `Retry-After: <seconds>`
* **Scope & Whitelisting:** จำกัดเฉพาะ Endpoint `POST /api/auth/login` เท่านั้น โดยที่ `/api/health`, `/api/v1/health` และ `/api/public/queue-board` **ต้องไม่ถูกจำกัดโดยเด็ดขาด**
* **Known Limitation & NAT Consideration:** การใช้ In-Memory Counter อาจส่งผลต่อผู้ใช้ที่อยู่ภายใต้ NAT หรือ Proxy สาธารณะเดียวกัน (เช่น ในห้องปฏิบัติการ) ซึ่งจะได้รับการพิจารณาติดตั้ง `skipSuccessfulRequests: true` หรือขยายเพดานคำขอใน Sprint 3 ตามความเหมาะสม

### 3.2 Acceptance Criteria (AC: S3-HARDEN) & Test Spec (TEST-47)
* [ ] **AC-47.1 (Rate Limit Enforcement):** ส่งคำขอ Login ครั้งที่ 11 จาก IP เดียวกันภายใน Window ต้องได้รับ HTTP `429 RATE_LIMIT_EXCEEDED` พร้อม Header `Retry-After`
* [ ] **AC-47.2 (IP Isolation under Multi-Hop):** คำขอจาก IP A ที่ชน Limit ต้องไม่ส่งผลกระทบต่อคำขอจาก IP B
* [ ] **AC-47.3 (Public & Health Exemption):** เรียก `/api/health`, `/api/v1/health` หรือ `/api/public/queue-board` ต่อเนื่องเกิน 10 ครั้ง ต้องไม่ติด 429

| Test ID | Covered AC | Level | Test File | Inputs | Expected Output |
| :---: | :---: | :---: | :--- | :--- | :--- |
| **TEST-47A** | `AC-47.1` | Security | `server/tests/security/rate-limit.test.ts` *(planned)* | ยิง `POST /api/auth/login` 11 ครั้งจาก IP เดียวกัน | ครั้งที่ 1–10: 200/401; ครั้งที่ 11: HTTP `429` |
| **TEST-47B** | `AC-47.1` | Boundary | `server/tests/security/rate-limit.test.ts` *(planned)* | หลัง Window reset | ยิง Login อีกครั้ง → สำเร็จ ไม่ติด 429 |
| **TEST-47C** | `AC-47.3` | Exemption | `server/tests/security/rate-limit.test.ts` *(planned)* | ยิง `GET /api/public/queue-board` 20 ครั้ง และ `/api/health` 20 ครั้ง | HTTP `200` ทุกครั้ง ไม่มี 429 |
| **TEST-47D** | `AC-47.2` | Integration | `server/tests/security/rate-limit.test.ts` *(planned)* | ส่ง X-Forwarded-For: Client A ชน limit, Client B ทดสอบ | Client A ได้ 429; Client B ได้รับ 200/401 ไม่กระทบ |

---

# Part D: Updated SRS, SDS, Feature Inventory & Traceability (10 คะแนน)

> **โครงสร้างเอกสารตาม Rubric (§3.4, §4.1):**  
> เพื่อให้เอกสาร Master ฉบับนี้พร้อมสำหรับการ Export เป็นรายงาน PDF ฉบับสมบูรณ์ในเล่มเดียวตามเกณฑ์ประเมิน Part D จึงบรรจุเนื้อหา **SRS ฉบับเต็มปัจจุบัน**, **System-Level SDS สถาปัตยกรรมระบบ**, **Feature Inventory**, **AC Register ฉบับสมบูรณ์**, และ **ตาราง Traceability Matrix** ไว้ครบถ้วนในส่วนนี้

---

## 1. ข้อกำหนดความต้องการของระบบฉบับเต็ม (Full Software Requirements Specification — SRS)

### 1.1 บริบทและผู้ใช้งาน (Operational Context & Actors)
PopQueue เป็นระบบบริหารจัดการคิวเสมือนหน้าร้าน (On-site Virtual Waiting Queue) วันเดียวกัน สำหรับสถานีแกะกล่องสุ่ม Art Toy (Theme 9) ผู้ใช้งานแบ่งออกเป็น 3 บทบาท:
1. **`COLLECTOR` (นักสะสม/ลูกค้า):** ดูรายการซีรีส์, รับบัตรคิว, ดูตั๋ว Active ตนเอง, กดยกเลิกคิวตนเอง (`F-05`)
2. **`BOX_MASTER` (พนักงานประจำสถานี):** ดูคิวซีรีส์ที่รับผิดชอบ, Call Next, Verify & Start, Complete, ตัดสิทธิ์ No-Show 120s (`F-06`), เปิด-ปิดซีรีส์ (`F-09`), ดูสถิติ (`F-08`)
3. **`Public Viewer` (บุคคลภายนอก):** ดูจอแสดงผลคิวสาธารณะหน้าร้าน (`F-07`) โดยไม่ต้องเข้าสู่ระบบ

### 1.2 ขอบเขตที่ไม่รวม (Explicit Exclusions)
* ไม่มีระบบจองคิวล่วงหน้าข้ามวัน (Waiting Line วันเดียวกันเท่านั้น)
* ไม่มีระบบชำระเงิน / Payment Gateway (ลูกค้าชำระเงินที่เคาน์เตอร์หลักก่อนมารับบัตรคิว)
* ไม่มีการส่ง SMS หรือ Push Notification ภายนอก (ใช้ Short Polling 3 วินาทีบนเว็บแอปพลิเคชัน)
* ไม่มีระบบ Auto No-Show อัตโนมัติ (Sprint 2 ใช้การกด manual trigger โดย Box Master เท่านั้น)

### 1.3 ข้อกำหนดเชิงฟังก์ชัน (Functional Requirements: FR-01 ถึง FR-15)
* `FR-01`: ยืนยันตัวตนด้วย Username/Password (Bcrypt $\ge 10$) และออก Stateless JWT พร้อม `tokenVersion`
* `FR-02`: เพิกถอน Token ทันทีเมื่อ Logout ผ่านการเพิ่มค่า `tokenVersion`
* `FR-03`: แสดงรายการซีรีส์และจำนวนคิวรอปัจจุบัน
* `FR-04`: Collector กดรับบัตรคิวในซีรีส์ที่เปิดอยู่ ได้รับเลขคิวต่อเนื่องรายวัน เริ่มต้นที่ 1
* `FR-05`: Collector ดูตั๋ว Active ตนเอง รองรับการถือคิวข้ามซีรีส์พร้อมกัน (Multi-Ticket Array)
* `FR-06`: ดูรายละเอียดตั๋วตาม ID พร้อมบังคับสิทธิ์ความเป็นเจ้าของ (Ownership Guard)
* `FR-07`: Box Master ดูรายการคิวเฉพาะซีรีส์ที่ได้รับมอบหมาย
* `FR-08`: Box Master กดเรียกคิวถัดไปตามลำดับ FIFO ด้วย Row Lock `LIMIT 1 FOR UPDATE SKIP LOCKED`
* `FR-09`: Box Master ตรวจสอบตัวตนลูกค้าหน้าร้านและกดยืนยันเริ่มแกะกล่อง (`UNBOXING`)
* `FR-10`: Box Master กดยุติการให้บริการเมื่อแกะกล่องเสร็จสิ้น (`COMPLETED`)
* `FR-11`: Collector กดยกเลิกตั๋ว `WAITING` ของตนเองได้ทันที ปลดล็อกโควตาให้จองใหม่ได้ (`F-05`)
* `FR-12`: Box Master ตัดสิทธิ์ลูกค้าที่ไม่มาแสดงตัวภายใน 120 วินาที ปลดล็อกพ้นจาก `STAFF_BUSY` (`F-06`)
* `FR-13`: จอบอร์ดสาธารณะหน้าร้าน แสดง Now Serving, Up Next และ Waiting Count ปลอดข้อมูลส่วนบุคคล Zero PII Leak (`F-07`)
* `FR-14`: Box Master ดูสถิติบริการประจำวัน (เวลารอเฉลี่ย, อัตรา No-Show, จำนวนคิว) แยกตาม `queueDate` (`F-08`)
* `FR-15`: Box Master สลับสถานะเปิด-ปิดซีรีส์ที่ดูแล ตั๋วค้างเดิมยังคงให้บริการต่อได้จนจบ (`F-09`)

### 1.4 กฎทางธุรกิจของระบบ (Business Rules: BR-01 ถึง BR-09)
* `BR-01`: ออกเลขคิวต่อเนื่องรายวัน แยกตัวนับตามซีรีส์และวันที่ (`Asia/Bangkok`) ไม่ลดค่าตัวนับและไม่นำเลขเดิมกลับมาใช้ซ้ำ ([EV-B03](../../evidence/EV-B03.txt))
* `BR-02 v2`: ลูกค้า 1 คนถือตั๋ว Active ได้สูงสุด 1 ใบต่อซีรีส์ แต่ถือข้ามซีรีส์พร้อมกันได้ บังคับด้วย Partial Unique Index `(userId, seriesId)` ([EV-A02](../../evidence/EV-A02.txt))
* `BR-03`: วงจรสถานะตั๋วคิวเป็นแบบทิศทางเดียว ไม่สามารถย้อนกลับได้ (`WAITING → CALLED → UNBOXING → COMPLETED`, `WAITING → CANCELLED`, `CALLED → NO_SHOW`)
* `BR-04`: Collector ห้ามเรียก Endpoint ของ Staff อย่างเด็ดขาด (`403 FORBIDDEN_ROLE` — [EV-B01](../../evidence/EV-B01.txt))
* `BR-05`: Box Master ดำเนินการได้เฉพาะซีรีส์ที่ตนได้รับมอบหมายเท่านั้น (`403 FORBIDDEN_SERIES`)
* `BR-06`: Box Master 1 คนมีตั๋วในสถานะ `CALLED` หรือ `UNBOXING` ได้ไม่เกิน 1 ใบพร้อมกัน บังคับด้วย Partial Unique Index `unique_active_staff_ticket` ([EV-A02](../../evidence/EV-A02.txt))
* `BR-07`: การเปลี่ยนสถานะเป็น `UNBOXING` หรือ `NO_SHOW` ต้องทำโดย Box Master ผู้กด Call ตั๋วไว้เท่านั้น (`403 FORBIDDEN_NOT_HANDLER` — [EV-A04](../../evidence/EV-A04.txt))
* `BR-08`: การตัดสิทธิ์ No-Show ต้องผ่านเงื่อนไขเวลา `clock.now() - ticket.calledAt >= 120 วินาที` บังคับที่ Server
* `BR-09`: ซีรีส์ที่ปิด (`isActive = false`) จะปฏิเสธคำขอรับบัตรคิวใหม่ด้วย HTTP `409 SERIES_CLOSED`

### 1.5 ข้อกำหนดที่ไม่ใช่เชิงฟังก์ชัน (Non-Functional Requirements: NFR-01 ถึง NFR-07)
* `NFR-01`: รหัสผ่านแฮชด้วย Bcrypt Cost $\ge 10$
* `NFR-02`: Public Board และ Unauthenticated Endpoints ต้องไม่มี PII หลุดใน Payload ทั้งชื่อ key และค่า string
* `NFR-03`: รองรับ 50 คำขอ Join พร้อมกันโดยได้เลขคิวต่อเนื่อง ไม่ซ้ำ ไม่ข้าม
* `NFR-04`: รองรับ 10 คำขอจองซ้ำพร้อมกันในซีรีส์เดิม สำเร็จเพียง 1 คำขอ ที่เหลือถูกปฏิเสธด้วย `409 DUPLICATE_ACTIVE_QUEUE`
* `NFR-05`: ข้อมูลตั๋วไม่สูญหายหลัง Container Restart หรือ Database Redeployment ([EV-B07](../../evidence/EV-B07.txt))
* `NFR-06`: หน้าจอ Web UI และ Public Board รองรับการแสดงผล Responsive บนหน้าจอขนาด 375px จนถึง 1920×1080 โดยไม่ล้นจอ
* `NFR-07`: จำกัดการส่งคำขอ Login ไม่เกิน 10 ครั้งต่อ 15 นาทีต่อ IP เกินกว่านั้นคืน HTTP `429 RATE_LIMIT_EXCEEDED`

---

## 2. การออกแบบสถาปัตยกรรมระดับระบบ (System-Level Software Design Specification — SDS)

### 2.1 สถาปัตยกรรมเทคโนโลยี (Stack & Architecture)
* **Frontend:** React 18 + Vite + TailwindCSS (Kiosk-style responsive, 3s Short Polling, Offset-based Server Clock Sync)
* **Backend:** Node.js + Express + TypeScript (Layered Service-Controller-Route, Zod schema validation, Application Clock injection)
* **Database & ORM:** PostgreSQL 16 + Prisma ORM (Partial Unique Indexes, Raw SQL Atomic Monotonic Increment, Row-level Locking)
* **Cloud Infrastructure:** Google Cloud Run (Container Service) + Google Cloud SQL (PostgreSQL 16) + Cloud Run Job (`popqueue-migrate`) + GitHub Actions WIF CI/CD

### 2.2 ผังบทบาทและสิทธิ์การเข้าถึงระดับระบบ (Comprehensive Role & Permission Matrix)

| HTTP Method & Endpoint Path | Middleware | Role ที่อนุญาต | Business Ownership / Series Guard | HTTP Rejection Codes | อ้างอิงโค้ดจริง (Code Reference) |
| :--- | :---: | :---: | :--- | :--- | :--- |
| `GET /api/health` | None | Public | ไม่มี | None | `server/src/app.ts:28-33` ([EV-A06](../../evidence/EV-A06.txt)) |
| `GET /api/v1/health` | None | Public | ไม่มี | None | `server/src/app.ts:28-33` ([EV-A06](../../evidence/EV-A06.txt)) |
| `GET /api/ready` | None | Public | ตรวจสอบการเชื่อมต่อ Database | `503 Service Unavailable` | `server/src/app.ts:36-43` |
| `POST /api/auth/login` | None | Public | ตรวจสอบ Password Hash | `400 VALIDATION_ERROR`<br>`401 INVALID_CREDENTIALS`<br>`429 RATE_LIMIT_EXCEEDED` *(S3)* | `server/src/routes/auth.routes.ts:8`<br>`server/src/services/auth.service.ts:34-47` |
| `POST /api/auth/logout` | `authenticateToken` | All Roles | ตรวจสอบ Token และ `tokenVersion` | `401 UNAUTHENTICATED` | `server/src/routes/auth.routes.ts:11` |
| `GET /api/auth/me` | `authenticateToken` | All Roles | คืนข้อมูลตัวตนและ Role ของผู้เรียก | `401 UNAUTHENTICATED` | `server/src/routes/auth.routes.ts:12` |
| `GET /api/series` | None | Public | คืนเฉพาะซีรีส์และจำนวนคิวรอ | None | `server/src/routes/series.routes.ts:7` |
| `POST /api/tickets/join` | `authenticateToken` | `COLLECTOR` | 1 active ticket per series (`BR-02 v2`) | `401 UNAUTHENTICATED`<br>`403 FORBIDDEN_ROLE`<br>`409 DUPLICATE_ACTIVE_QUEUE`<br>`409 SERIES_CLOSED` | `server/src/routes/ticket.routes.ts:9`<br>`server/src/services/ticket.service.ts:60-140` |
| `GET /api/tickets/my-ticket` | `authenticateToken` | `COLLECTOR` | กรองเฉพาะตั๋วของผู้เรียก (`userId`) | `401 UNAUTHENTICATED`<br>`404 NO_ACTIVE_TICKET` | `server/src/routes/ticket.routes.ts:17`<br>`server/src/services/ticket.service.ts:145-213` ([EV-B04](../../evidence/EV-B04.txt)) |
| `GET /api/tickets/:id` | `authenticateToken` | All Roles | Ownership (Collector: own ticket, Staff: assigned series) | `401 UNAUTHENTICATED`<br>`404 RESOURCE_NOT_FOUND`<br>`403 FORBIDDEN_OWNERSHIP`<br>`403 FORBIDDEN_SERIES` | `server/src/routes/ticket.routes.ts:25`<br>`server/src/services/ticket.service.ts:220-262` |
| `POST /api/tickets/:id/cancel` *(F-05)* | `authenticateToken` | `COLLECTOR` | Ownership (`ticket.userId === auth.userId`) | `401 UNAUTHENTICATED`<br>`403 FORBIDDEN_ROLE`<br>`404 RESOURCE_NOT_FOUND`<br>`403 FORBIDDEN_OWNERSHIP`<br>`400 INVALID_STATE_TRANSITION` | `server/src/routes/ticket.routes.ts` *(planned)*<br>Master v1.2 Part B §1.4 |
| `GET /api/staff/tickets` | `authenticateToken` | `BOX_MASTER` | เฉพาะซีรีส์ที่ตนได้รับมอบหมาย | `401 UNAUTHENTICATED`<br>`403 FORBIDDEN_ROLE` | `server/src/routes/staff.routes.ts:9`<br>`server/src/services/staff.service.ts:77-142` |
| `POST /api/staff/call-next` | `authenticateToken` | `BOX_MASTER` | ซีรีส์ที่ได้รับมอบหมาย + Single Serving | `401 UNAUTHENTICATED`<br>`403 FORBIDDEN_ROLE`<br>`403 FORBIDDEN_SERIES`<br>`409 STAFF_BUSY`<br>`404 EMPTY_QUEUE` | `server/src/routes/staff.routes.ts:17`<br>`server/src/services/staff.service.ts:148-223` ([EV-B05](../../evidence/EV-B05.txt)) |
| `POST /api/staff/tickets/:id/start-unboxing` | `authenticateToken` | `BOX_MASTER` | Assigned Series + Handler Exclusive | `401 UNAUTHENTICATED`<br>`403 FORBIDDEN_ROLE`<br>`404 RESOURCE_NOT_FOUND`<br>`403 FORBIDDEN_SERIES`<br>`403 FORBIDDEN_NOT_HANDLER`<br>`400 INVALID_STATE_TRANSITION` | `server/src/routes/staff.routes.ts:25`<br>`server/src/services/staff.service.ts:237-302` ([EV-A04](../../evidence/EV-A04.txt)) |
| `POST /api/staff/tickets/:id/complete` | `authenticateToken` | `BOX_MASTER` | Assigned Series + Handler Exclusive | `401 UNAUTHENTICATED`<br>`403 FORBIDDEN_ROLE`<br>`404 RESOURCE_NOT_FOUND`<br>`403 FORBIDDEN_SERIES`<br>`403 FORBIDDEN_NOT_HANDLER`<br>`400 INVALID_STATE_TRANSITION` | `server/src/routes/staff.routes.ts:33`<br>`server/src/services/staff.service.ts:323-388` |
| `POST /api/staff/tickets/:id/no-show` *(F-06)* | `authenticateToken` | `BOX_MASTER` | Handler Exclusive + Time $\ge$ 120s | `401 UNAUTHENTICATED`<br>`403 FORBIDDEN_ROLE`<br>`404 RESOURCE_NOT_FOUND`<br>`403 FORBIDDEN_SERIES`<br>`403 FORBIDDEN_NOT_HANDLER`<br>`400 INVALID_STATE_TRANSITION`<br>`400 NO_SHOW_WINDOW_NOT_EXPIRED` | `server/src/routes/staff.routes.ts` *(planned)*<br>Master v1.2 Part B §2.4 |
| `GET /api/public/queue-board` *(F-07)* | None | Public | Zero PII (Prisma select projection) | None (Unrestricted Public Access) | `server/src/routes/public.routes.ts` *(planned)*<br>Master v1.2 Part B §3.3 |
| `GET /api/staff/analytics` *(F-08)* | `authenticateToken` | `BOX_MASTER` | ข้อมูลสถิติเฉพาะซีรีส์ที่ได้รับมอบหมาย | `401 UNAUTHENTICATED`<br>`403 FORBIDDEN_ROLE`<br>`400 VALIDATION_ERROR`<br>`403 FORBIDDEN_SERIES` | `server/src/routes/staff.routes.ts` *(planned)*<br>Master v1.2 Part C §1.3 |
| `PATCH /api/staff/series/:id/status` *(F-09)* | `authenticateToken` | `BOX_MASTER` | เฉพาะซีรีส์ที่ได้รับมอบหมาย | `401 UNAUTHENTICATED`<br>`403 FORBIDDEN_ROLE`<br>`400 VALIDATION_ERROR`<br>`404 RESOURCE_NOT_FOUND`<br>`403 FORBIDDEN_SERIES` | `server/src/routes/staff.routes.ts` *(planned)*<br>Master v1.2 Part C §2.2 |

### 2.3 รายการตัวแปรสภาพแวดล้อม (Environment Variables Register)
* `NODE_ENV`: `production` / `test` / `development`
* `PORT`: `8080` (Cloud Run) / `4000` (Local)
* `TZ`: `Asia/Bangkok` (บังคับ Timezone เวลาไทย)
* `GIT_SHA`: Commit SHA 40 หลัก คืนใน `/api/health` ([EV-A06](../../evidence/EV-A06.txt))
* `DATABASE_URL`: Cloud SQL PostgreSQL Unix Socket connection string
* `JWT_SECRET`: Secret Key สำหรับ Stateless JWT
* `RATE_LIMIT_WINDOW_MS`: `900000` (15 นาที)
* `RATE_LIMIT_MAX`: `10` คำขอต่อ IP
* `TRUST_PROXY_HOPS`: `1` (Google Cloud Run proxy trust)

---

## 3. Feature Inventory (Current Status)

| Feature ID | Feature Name | Target Sprint | Status | Implementation Artifacts | Verification Status |
| :---: | :--- | :---: | :---: | :--- | :---: |
| **F-01** | Authentication & Role-Based Access | 1 | **accepted** | `auth.service.ts`, `auth.ts`, `LoginModal.tsx` | Tested (`v0.1.0-sprint1` — [EV-A01](../../evidence/EV-A01.txt)) |
| **F-02** | Queue Discovery & Safe Joining | 1 (rev Lab 7) | **accepted** | `ticket.service.ts`, `SeriesPage.tsx`, Migration 0003 | Tested (`v0.3.0-lab7` — [EV-A02](../../evidence/EV-A02.txt)) |
| **F-03** | Staff Counter & Call/Complete | 1 | **accepted** | `staff.service.ts`, `StaffCounterPage.tsx` | Tested (`v0.1.0-sprint1` — [EV-A01](../../evidence/EV-A01.txt)) |
| **F-04** | Ticket Inspection & Ownership | 1 (ext Lab 7) | **accepted** | `ticket.service.ts`, `MyTicketPage.tsx` | Tested (`v0.3.0-lab7` — [EV-B04](../../evidence/EV-B04.txt)) |
| **F-05** | Queue Cancellation | **2** | **Contract Ready** | `ticket.service.ts`, `MyTicketPage.tsx` | `planned (no evidence yet)` |
| **F-06** | Server-Enforced 120s No-Show | **2** | **Contract Ready** | `staff.service.ts`, `CountdownTimer.tsx` | `planned (no evidence yet)` |
| **F-07** | Public Queue Display Board | **2** | **Contract Ready** | `public.service.ts`, `/board` page | `planned (no evidence yet)` |
| **F-08** | Daily Service Analytics | 3 | **Contract Ready** | `staff.service.ts`, Staff Analytics UI | `planned (no evidence yet)` |
| **F-09** | Series Availability Control | **3 (Progress)** | **Contract Ready (Baseline Supported)** | `staff.service.ts`, Staff Toggle Switch | `in-progress` (Contract + Baseline) |
| **S3-HARDEN** | Rate Limiting & Hardening | 3 | **Contract Ready** | `app.ts`, `express-rate-limit` | `planned (no evidence yet)` |

---

## 4. ทะเบียนเกณฑ์การยอมรับฉบับสมบูรณ์ (Complete Acceptance Criteria Register: 81 ACs)

| AC ID | หมวดหมู่ / ฟีเจอร์ | Implemented? | Verification Run? | ผลการทดสอบ (Result) | รหัสหลักฐาน (EV-ID) | Commit SHA ที่ผ่านการตรวจ |
| :---: | :--- | :---: | :---: | :---: | :---: | :---: |
| **AC-01** | Auth Login (Username format) | Yes | Yes | `accepted` | [EV-A07](../../evidence/EV-A07.txt) | `d946159ba82a` |
| **AC-02** | Auth Login (Password verification) | Yes | Yes | `accepted` | [EV-A07](../../evidence/EV-A07.txt) | `d946159ba82a` |
| **AC-03** | Auth Login (Missing password validation) | Yes | Yes | `accepted` (CI/Local) | [EV-A07](../../evidence/EV-A07.txt) | `72e1bb529b3c` |
| **AC-04** | Auth Token Security (Zero token in body) | Yes | Yes | `accepted` | [EV-A07](../../evidence/EV-A07.txt) | `d946159ba82a` |
| **AC-05** | Role Assignment & JWT Claim | Yes | Yes | `accepted` | [EV-B01](../../evidence/EV-B01.txt) | `d946159ba82a` |
| **AC-06** | Logout & Token Invalidation | Yes | Yes | `accepted` | [EV-A07](../../evidence/EV-A07.txt) | `d946159ba82a` |
| **AC-07** | Bcrypt Hash Cost $\ge 10$ | Yes | Yes | `accepted` | [EV-A07](../../evidence/EV-A07.txt) | `d946159ba82a` |
| **AC-08** | Role Guard 403 Rejection | Yes | Yes | `accepted` | [EV-B01](../../evidence/EV-B01.txt) | `d946159ba82a` |
| **AC-09** | Series Discovery Listing | Yes | Yes | `accepted` | [EV-A07](../../evidence/EV-A07.txt) | `d946159ba82a` |
| **AC-10** | Queue Join (Atomic FIFO) | Yes | Yes | `accepted` | [EV-B03](../../evidence/EV-B03.txt) | `d946159ba82a` |
| **AC-11** | 1 Active Ticket per Series (BR-02 v2) | Yes | Yes | `accepted` (CI/Local) | [EV-A02](../../evidence/EV-A02.txt) | `a07a7be732b3` |
| **AC-12** | Inactive Series Join Block (409) | Yes | Yes | `accepted` | [EV-A07](../../evidence/EV-A07.txt) | `d946159ba82a` |
| **AC-13** | Multi-Series Join Coexistence | Yes | Yes | `accepted` (CI/Local) | [EV-A02](../../evidence/EV-A02.txt) | `a07a7be732b3` |
| **AC-14** | Role Guard on Join Endpoint | Yes | Yes | `accepted` | [EV-B01](../../evidence/EV-B01.txt) | `d946159ba82a` |
| **AC-15** | Concurrency: 50 Simultaneous Joins | Yes | Yes | `accepted` | [EV-A07](../../evidence/EV-A07.txt) | `d946159ba82a` |
| **AC-16** | Race Guard: 10 Duplicate Joins | Yes | Yes | `accepted` (CI/Local) | [EV-A02](../../evidence/EV-A02.txt) | `a07a7be732b3` |
| **AC-17** | Display Number Format (CRY-001) | Yes | Yes | `accepted` | [EV-B03](../../evidence/EV-B03.txt) | `d946159ba82a` |
| **AC-18** | Monotonic Counter Continuity | Yes | Yes | `accepted` | [EV-B03](../../evidence/EV-B03.txt) | `d946159ba82a` |
| **AC-19** | WaitingAhead Accurate Calculation | Yes | Yes | `accepted` (CI/Local) | [EV-B04](../../evidence/EV-B04.txt) | `a07a7be732b3` |
| **AC-20** | Responsive Web Layout (375px) | Yes | Yes | `accepted` | [EV-A07](../../evidence/EV-A07.txt) | `d946159ba82a` |
| **AC-21** | Staff Series Queue Inspection | Yes | Yes | `accepted` | [EV-A07](../../evidence/EV-A07.txt) | `d946159ba82a` |
| **AC-22** | Staff Call-Next FIFO Order | Yes | Yes | `accepted` | [EV-B05](../../evidence/EV-B05.txt) | `d946159ba82a` |
| **AC-23** | Call-Next Status Transition (CALLED) | Yes | Yes | `accepted` | [EV-B05](../../evidence/EV-B05.txt) | `d946159ba82a` |
| **AC-24** | Staff Busy Single Active Handling | Yes | Yes | `accepted` | [EV-A02](../../evidence/EV-A02.txt) | `d946159ba82a` |
| **AC-25** | Staff Series Assignment Scope Guard | Yes | Yes | `accepted` | [EV-A04](../../evidence/EV-A04.txt) | `d946159ba82a` |
| **AC-26** | Start Unboxing (CALLED -> UNBOXING) | Yes | Yes | `accepted` | [EV-A04](../../evidence/EV-A04.txt) | `d946159ba82a` |
| **AC-27** | Complete Ticket (UNBOXING -> COMPLETED) | Yes | Yes | `accepted` | [EV-A04](../../evidence/EV-A04.txt) | `d946159ba82a` |
| **AC-28** | Strict State Lifecycle Validation | Yes | Yes | `accepted` | [EV-A07](../../evidence/EV-A07.txt) | `d946159ba82a` |
| **AC-29** | Staff Series Mismatch Rejection | Yes | Yes | `accepted` | [EV-A04](../../evidence/EV-A04.txt) | `d946159ba82a` |
| **AC-30** | Handler Exclusive Rejection (403) | Yes | Yes | `accepted` | [EV-A04](../../evidence/EV-A04.txt) | `d946159ba82a` |
| **AC-31** | Staff Role Guard on Transitions | Yes | Yes | `accepted` | [EV-B01](../../evidence/EV-B01.txt) | `d946159ba82a` |
| **AC-32** | Concurrency Row-Lock SKIP LOCKED | Yes | Yes | `accepted` | [EV-B05](../../evidence/EV-B05.txt) | `d946159ba82a` |
| **AC-33** | End-to-End Critical Journey | Yes | Yes | `accepted` | [EV-A07](../../evidence/EV-A07.txt) | `d946159ba82a` |
| **AC-34** | My-Ticket Active Filter | Yes | Yes | `accepted` | [EV-B04](../../evidence/EV-B04.txt) | `a07a7be732b3` |
| **AC-35** | My-Ticket Multi-Series Cards | Yes | Yes | `accepted` | [EV-B04](../../evidence/EV-B04.txt) | `a07a7be732b3` |
| **AC-36** | Ticket Detail Existence Check (404) | Yes | Yes | `accepted` | [EV-A07](../../evidence/EV-A07.txt) | `d946159ba82a` |
| **AC-37** | Ticket Detail Ownership Guard (403) | Yes | Yes | `accepted` | [EV-A07](../../evidence/EV-A07.txt) | `d946159ba82a` |
| **AC-38** | Ticket Detail Staff Scope Guard (403) | Yes | Yes | `accepted` | [EV-A07](../../evidence/EV-A07.txt) | `d946159ba82a` |
| **AC-39** | Cloud Deployment Persistence | Yes | Yes | `tested` (v0.2.0) | [EV-B07](../../evidence/EV-B07.txt) | `bf52c9b969d9` |
| **AC-40** | *(เว้นว่างไว้โดยเจตนา — EV-A08)* | N/A | N/A | `N/A` | [EV-A08](../../evidence/EV-A08.txt) | N/A |
| **AC-41.1** | F-05 Valid Ticket Cancellation | No | No | `planned (no evidence yet)` | - | TBD |
| **AC-41.2** | F-05 Immediate Re-join After Cancel | No | No | `planned (no evidence yet)` | - | TBD |
| **AC-41.3** | F-05 Monotonic Counter Continuity | No | No | `planned (no evidence yet)` | - | TBD |
| **AC-41.4** | F-05 Forbidden Ownership Rejection | No | No | `planned (no evidence yet)` | - | TBD |
| **AC-41.5** | F-05 Invalid State Transition Rejection | No | No | `planned (no evidence yet)` | - | TBD |
| **AC-41.6** | F-05 Call-Next Structural Exclusion | No | No | `planned (no evidence yet)` | - | TBD |
| **AC-41.7** | F-05 Multi-Ticket Independence | No | No | `planned (no evidence yet)` | - | TBD |
| **AC-41.8** | F-05 Concurrency Race Guard | No | No | `planned (no evidence yet)` | - | TBD |
| **AC-41.9** | F-05 Collector Cancel Role & Auth Guards | No | No | `planned (no evidence yet)` | - | TBD |
| **AC-41.10** | F-05 Cancel Confirmation Modal & Empty State UI | No | No | `planned (no evidence yet)` | - | TBD |
| **AC-42.1** | F-06 Premature No-Show Rejection (<120s) | No | No | `planned (no evidence yet)` | - | TBD |
| **AC-42.2** | F-06 119s / 120s / 121s Boundary | No | No | `planned (no evidence yet)` | - | TBD |
| **AC-43.1** | F-06 Successful No-Show Transition | No | No | `planned (no evidence yet)` | - | TBD |
| **AC-43.2** | F-06 Staff Released from STAFF_BUSY | No | No | `planned (no evidence yet)` | - | TBD |
| **AC-43.3** | F-06 Handler Exclusive Guard (403) | No | No | `planned (no evidence yet)` | - | TBD |
| **AC-43.4** | F-06 WAITING Ticket Null-Guard (400) | No | No | `planned (no evidence yet)` | - | TBD |
| **AC-43.5** | F-06 No-Show vs Start-Unbox Race Guard | No | No | `planned (no evidence yet)` | - | TBD |
| **AC-43.6** | F-06 Collector Immediate Re-join | No | No | `planned (no evidence yet)` | - | TBD |
| **AC-42.3** | F-06 ServerNow Timestamp Synchronization | No | No | `planned (no evidence yet)` | - | TBD |
| **AC-43.7** | F-06 Staff No-Show Role & Auth Guards | No | No | `planned (no evidence yet)` | - | TBD |
| **AC-43.8** | F-06 Countdown Timer & Button State UI | No | No | `planned (no evidence yet)` | - | TBD |
| **AC-44.1** | F-07 Public Unauthenticated Access (200) | No | No | `planned (no evidence yet)` | - | TBD |
| **AC-44.2** | F-07 Zero PII Assertion in Body Values | No | No | `planned (no evidence yet)` | - | TBD |
| **AC-44.3** | F-07 UpNext Max 5 & WaitingCount | No | No | `planned (no evidence yet)` | - | TBD |
| **AC-44.4** | F-07 Integer QueueNumber Sorting | No | No | `planned (no evidence yet)` | - | TBD |
| **AC-44.5** | F-07 Closed Series Display with Badge | No | No | `planned (no evidence yet)` | - | TBD |
| **AC-44.6** | F-07 Excluded Inactive Status Filter | No | No | `planned (no evidence yet)` | - | TBD |
| **AC-44.7** | F-07 Responsive Layout Across Viewports | No | No | `planned (no evidence yet)` | - | TBD |
| **AC-45.1** | F-08 Daily Aggregation Accuracy | No | No | `planned (no evidence yet)` | - | TBD |
| **AC-45.2** | F-08 Role & Series Authorization | No | No | `planned (no evidence yet)` | - | TBD |
| **AC-45.3** | F-08 Mathematical Precision of Averages | No | No | `planned (no evidence yet)` | - | TBD |
| **AC-45.4** | F-08 Date Format Validation Rejection | No | No | `planned (no evidence yet)` | - | TBD |
| **AC-46.1** | F-09 Authorized Status Toggle (200) | In-Progress | No | `planned (no evidence yet)` | - | TBD |
| **AC-46.2** | F-09 Join Prevention on Closed Series | In-Progress | No | `planned (no evidence yet)` | - | TBD |
| **AC-46.3** | F-09 Unauthorized Toggle Rejection (403) | In-Progress | No | `planned (no evidence yet)` | - | TBD |
| **AC-46.4** | F-09 Existing Tickets Continuity | In-Progress | No | `planned (no evidence yet)` | - | TBD |
| **AC-46.5** | F-09 Idempotency & Re-open Validation | In-Progress | No | `planned (no evidence yet)` | - | TBD |
| **AC-47.1** | S3-HARDEN Login Rate Limit (10/15m) | No | No | `planned (no evidence yet)` | - | TBD |
| **AC-47.2** | S3-HARDEN IP Isolation Multi-Hop | No | No | `planned (no evidence yet)` | - | TBD |
| **AC-47.3** | S3-HARDEN Public/Health Exemption | No | No | `planned (no evidence yet)` | - | TBD |

---

## 5. ตารางสอบกลับความต้องการ (Requirements Traceability Matrix)

> **คำอธิบายเชิงอรรถ:**  
> - Sprint "1": งานที่ส่งมอบในรอบ Sprint 1 Baseline (`v0.1.0`)  
> - Sprint "5": งาน Lab 5 Cloud Infrastructure & CI/CD Pipeline (`v0.2.0`)  
> - Sprint "7": งาน Lab 7 Multi-Series Active Quota Maintenance (`v0.3.0`)  
> - สัญลักษณ์ `partial`: ข้อกำหนดที่มีส่วนของ Sprint 1 ทดสอบผ่านแล้ว (`tested`) และมี AC ส่วนขยายใน Sprint 2/3 ที่อยู่ระหว่างรอการพัฒนา (`planned`)

| Req ID | หมวดหมู่ | Feature | Sprint | Acceptance Criteria | Test Specification | Actual Test File on Main | Version & Result | การวัดผล / ข้อกำหนด NFR (Measurement) |
| :---: | :--- | :---: | :---: | :--- | :--- | :--- | :---: | :--- |
| **FR-01** | Auth | F-01 | 1 | AC-01, AC-02, AC-03, AC-05 | TEST-01..03, 05 | `server/tests/api/auth.test.ts` | `tested` (`v0.3.0`) | Pass ([EV-A07](../../evidence/EV-A07.txt)), Bcrypt salt >= 10 |
| **FR-02** | Logout | F-01 | 1 | AC-06 | TEST-06 | `server/tests/api/auth.test.ts` | `tested` (`v0.3.0`) | TokenVersion incremented |
| **FR-03** | Discovery | F-02 | 1 | AC-09 | TEST-09 | `server/tests/api/series.test.ts` | `tested` (`v0.3.0`) | คืนรายการซีรีส์พร้อม Waiting Count |
| **FR-04** | Join Queue | F-02 | 1, 7 | AC-10, AC-12, AC-13, AC-19 | TEST-10,12,13,19 | `server/tests/api/join.test.ts` | `tested` (`v0.3.0`) | Atomic monotonic numbering ([EV-B03](../../evidence/EV-B03.txt)) |
| **FR-05** | My Ticket | F-04 | 1, 7 | AC-34, AC-35 | TEST-34,35 | `server/tests/api/my-ticket.test.ts` | `tested` (`v0.3.0`) | Multi-ticket array response ([EV-B04](../../evidence/EV-B04.txt)) |
| **FR-06** | Ticket Detail| F-04 | 1 | AC-36, AC-37, AC-38 | TEST-36..38 | `server/tests/api/ticket-detail.test.ts` | `tested` (`v0.3.0`) | Ownership 403 guard ([EV-A07](../../evidence/EV-A07.txt)) |
| **FR-07** | Staff View | F-03 | 1 | AC-21 | TEST-21 | `server/tests/api/staff-tickets.test.ts` | `tested` (`v0.3.0`) | Series assignment scope guard |
| **FR-08** | Call Next | F-03 | 1 | AC-22, AC-23, AC-24, AC-25 | TEST-22..25 | `server/tests/api/call-next.test.ts` | `tested` (`v0.3.0`) | FIFO SKIP LOCKED row lock ([EV-B05](../../evidence/EV-B05.txt)) |
| **FR-09** | Start Unbox | F-03 | 1 | AC-26 | TEST-26 | `server/tests/api/staff-transition.test.ts` | `tested` (`v0.3.0`) | Handler exclusive 403 ([EV-A04](../../evidence/EV-A04.txt)) |
| **FR-10** | Complete | F-03 | 1 | AC-27, AC-33 | TEST-27,33 | `server/tests/api/staff-transition.test.ts` | `tested` (`v0.3.0`) | State lifecycle completion |
| **FR-11** | Cancel Queue| **F-05** | **2** | AC-41.1, AC-41.2, AC-41.3, AC-41.4, AC-41.5, AC-41.6, AC-41.7, AC-41.8 | TEST-41A..41J | `server/tests/api/cancel.test.ts` *(planned)* | `planned` | Re-join ได้ทันที, ข้ามเลขถาวร |
| **FR-12** | No-Show | **F-06** | **2** | AC-42.1, AC-42.2, AC-43.1, AC-43.2, AC-43.3, AC-43.4, AC-43.5, AC-43.6 | TEST-42A..C, 43A..H | `server/tests/api/no-show.test.ts` *(planned)* | `planned` | Server-enforced Δt ≥ 120s |
| **FR-13** | Public Board| **F-07** | **2** | AC-44.1, AC-44.2, AC-44.3, AC-44.4, AC-44.5, AC-44.6, AC-44.7 | TEST-44A..44F | `server/tests/api/public-board.test.ts` *(planned)* | `planned` | Zero PII, Polling 3s, Max 5 |
| **FR-14** | Analytics | **F-08** | **3** | AC-45.1, AC-45.2, AC-45.3, AC-45.4 | TEST-45A..45E | `server/tests/api/analytics.test.ts` *(planned)* | `planned` | แม่นยำตามสูตรคณิตศาสตร์ |
| **FR-15** | Series Toggle| **F-09** | **3** | AC-46.1, AC-46.2, AC-46.3, AC-46.4, AC-46.5 | TEST-46A..46E | `server/tests/api/series-toggle.test.ts` *(planned)* | `planned` | ตั๋วค้างเดิมยังให้บริการได้จนจบ |
| **BR-01** | Monotonic No| F-02,F-05 | 1, 2 | AC-10, AC-17, AC-18, AC-41.3 | TEST-10,18,41B | `server/tests/concurrency/numbering.test.ts`| `partial` | Composite key (seriesId, queueDate) |
| **BR-02 v2**| 1/Series | F-02 | 1, 7 | AC-11, AC-16, AC-19 | TEST-11,16,19 | `server/tests/concurrency/duplicate.test.ts`| `tested` (`v0.3.0`) | Partial Unique Index ([EV-A02](../../evidence/EV-A02.txt)) |
| **BR-03** | State Life | F-03,F-05,06| 1, 2 | AC-22, AC-26, AC-27, AC-28, AC-41.5 | TEST-28,41D,41E | `server/tests/unit/state-machine.test.ts` | `partial` | ทิศทางเดียว ไม่ย้อนกลับ |
| **BR-04** | Role Guard | All | 1 | AC-08, AC-14, AC-31 | TEST-08U,14,31 | `server/tests/unit/role-guard.test.ts` | `tested` (`v0.3.0`) | 403 FORBIDDEN_ROLE ([EV-B01](../../evidence/EV-B01.txt)) |
| **BR-05** | Staff Series| F-03,F-09 | 1, 3 | AC-25, AC-29, AC-46.3 | TEST-25,29,46C | `server/tests/api/staff-tickets.test.ts` | `partial` | 403 FORBIDDEN_SERIES |
| **BR-06** | Single Staff | F-03,F-06 | 1, 2 | AC-24, AC-32, AC-43.2 | TEST-24,32,43B | `server/tests/api/call-next.test.ts` | `partial` | 409 STAFF_BUSY ([EV-A02](../../evidence/EV-A02.txt)) |
| **BR-07** | Handler Excl| F-03,F-06 | 1, 2 | AC-26, AC-30, AC-43.3 | TEST-26,30,43C | `server/tests/api/staff-transition.test.ts` | `partial` | 403 FORBIDDEN_NOT_HANDLER |
| **BR-08** | 120s Timeout| **F-06** | **2** | AC-42.1, AC-42.2, AC-43.1 | TEST-42A..C, 43A | `server/tests/api/no-show.test.ts` *(planned)* | `planned` | App clock FakeClock boundary |
| **BR-09** | Inactive Block| F-02,F-09 | 1, 3 | AC-12, AC-46.2 | TEST-12,46B | `server/tests/api/join.test.ts` | `partial` | 409 SERIES_CLOSED |
| **NFR-01** | Bcrypt Hash | F-01 | 1 | AC-07 | TEST-07 | `server/tests/security/password-hash.test.ts`| `tested` (`v0.3.0`) | Salt rounds >= 10 |
| **NFR-02** | Zero PII | F-07 | 1, 2 | AC-04, AC-44.2 | TEST-04, TEST-44A | `server/tests/security/unauthenticated.test.ts` | `partial` | Zero PII in public payload string |
| **NFR-03** | Concurrency | F-02 | 1 | AC-15 | TEST-15 | `server/tests/concurrency/numbering.test.ts`| `tested` (`v0.3.0`) | 50 concurrent requests: 0 duplicate |
| **NFR-04** | Race Guard | F-02 | 1 | AC-16 | TEST-16 | `server/tests/concurrency/duplicate.test.ts`| `tested` (`v0.3.0`) | 10 duplicate concurrent: 1 pass, 9 fail |
| **NFR-05** | Persistence | Infra | 1, 5 | AC-39 | TEST-39 | `scripts/test-persistence.mjs` | `tested` (v0.2.0) | ข้อมูลคงทนหลัง restart/redeploy 3/3 |
| **NFR-06** | Responsive | UI,F-07 | 1, 2 | AC-20, AC-44.4, AC-44.7 | TEST-20, TEST-44F | `e2e/responsive.spec.ts` | `partial` | ไม่มี overflow ที่ 375px; TV 1080p |
| **NFR-07** | Rate Limit | **S3** | **3** | AC-47.1, AC-47.2, AC-47.3 | TEST-47A..D | `server/tests/security/rate-limit.test.ts` *(planned)* | `planned` | Max 10 requests / 15 minutes |

---


### 5.1 ตารางวิเคราะห์ช่องว่างและแผนการตรวจสอบรอบสุดท้าย (Coverage Gaps & Planned Final Verification)

| หมวดหมู่ (Category) | ช่องว่างที่ตรวจพบ (Identified Gap) | สาเหตุและผลกระทบ (Impact) | แผนการตรวจสอบและหลักฐานยืนยัน (Planned Final Verification) |
| :--- | :--- | :--- | :--- |
| **GCP Cloud Run Deploy** | Issue #55 ยังไม่ปิด (DEF-02, CHG-02 ยัง unverified บน Cloud Run) | ขาดหลักฐาน Live Verification บน Cloud Run สำหรับ Lab 7 baseline | รันคำสั่งตรวจ health check และ migration log บน Cloud Run สดหลัง Deploy, บันทึกผลเป็น EV-B07 Live Addendum ก่อน Tag Release |
| **UI Interactive Behaviors** | Modal ยืนยันยกเลิกตั๋ว, Countdown 120s และปุ่มสลับสถานะยังไม่มี automated test | การทดสอบเดิมเน้น Backend API ทำให้ UI behaviors ต้องพึ่งพาการตรวจด้วยตนเอง | เพิ่ม E2E Playwright Tests: `my-ticket.spec.ts` (`TEST-41K`) และ `staff-counter.spec.ts` (`TEST-43I`) ตรวจสอบ DOM state |
| **Cross-Day Queue Drift** | F-07 ไม่กรอง `queueDate` อาจดึงคิวค้างข้ามคืนมาแสดงบน Public Board | หากมีตั๋วค้างข้ามคืน Waiting Count จะรวมตั๋วเก่า | บันทึกเป็น Known Limitation G-07; เตรียมเพิ่ม script auto-cancel สำหรับตั๋วค้างเที่ยงคืนใน Sprint 3 |
| **Network Latency Drift** | Client timer กับ Server timer อาจคลาดเคลื่อนจาก latency | ปุ่ม No-Show อาจกดไม่ติดหากเวลาบน client เร็วกว่า server | บังคับใช้ `serverNow` ISO timestamp (`AC-42.3`, `TEST-42D`) ซิงก์ local offset เที่ยงตรงในระดับวินาที |

## 6. บันทึกการตัดสินใจทางวิศวกรรม (SRS Decision Log)

* **Decision 1 (Priority Policy):** ปฏิเสธการทำ Priority Jumping สำหรับตั๋วที่ถูก No-Show หรือ Cancel; ลูกค้าที่เข้าคิวใหม่จะได้รับเลขคิวต่อท้ายแถวเสมอเพื่อความโปร่งใส
* **Decision 2 (Counter Isolation):** ปฏิเสธการใช้ตัวนับรวมทั้งร้าน โดยยืนยันใช้ Composite Key `("seriesId", "queueDate")` เพื่อแยกอิสระตามซีรีส์และรีเซ็ตรายวันตามเวลาไทย ([EV-B03](../../evidence/EV-B03.txt))
* **Decision 3 (G-07 Overnight Leftover Limitation):** บันทึก ณ วันที่ 2026-11-24 ยอมรับพฤติกรรมที่ตั๋วค้างข้ามคืนจะถูกเรียกก่อนตาม FIFO (`queueDate ASC`) และไม่ทำการแก้ไข Schema เพิ่มเติมใน Sprint 2
* **Decision 4 (F-05 Cancel Ownership Precedence):** กำหนดให้การตรวจสอบสิทธิ์ความเป็นเจ้าของ (`403 FORBIDDEN_OWNERSHIP`) ทำงานก่อนการตรวจสถานะตั๋ว (`400 INVALID_STATE_TRANSITION`) เมื่อ Collector พยายามยกเลิกตั๋วของผู้อื่น
* **Decision 5 (F-06 Re-join Policy หลัง No-Show):** บันทึก ณ วันที่ 2026-11-24 (สถานะ: รอยืนยัน TA) อนุญาตให้ Collector ที่ถูกตัดสิทธิ์ No-Show สามารถกด join เพื่อรับคิวใหม่ได้ทันที เนื่องจากหลุดออกจากข้อจำกัดทางสถาปัตยกรรม Database อยู่แล้ว ([EV-A02](../../evidence/EV-A02.txt))
* **Decision 6 (F-07 Dataset Alignment):** กำหนดให้ Public Board ดึงข้อมูลและเรียงลำดับด้วยเงื่อนไขเดียวกับ `call-next` เพื่อให้ Up Next แสดงตรงกับตั๋วที่จะถูกเรียกจริง ([EV-B05](../../evidence/EV-B05.txt))
* **Decision 7 (ServerNow Clock Synchronization):** เพิ่มฟิลด์ `data.serverNow` ใน response เพื่อแก้ปัญหา Client Clock Skew บน CountdownTimer
* **Decision 8 (NFR-07 S3-HARDEN Scope):** กำหนดให้การติดตั้ง Rate Limit จำกัดเฉพาะ `POST /api/auth/login` และยกไปทำใน Sprint 3 ตามแผน เพื่อไม่ให้เกิดผลข้างเคียงต่อการตรวจข้อสอบของผู้ตรวจและ TA

---

# Part E: Integrated Release Candidate, Demonstrations & Finish Plan (15 คะแนน)

## 1. แผนการปล่อยตัวระบบตามระเบียบวิศวกรรม (Engineering Release Plan)

เพื่อปฏิบัติตามข้อกำหนดของรายวิชา CPE 334 อย่างเคร่งครัด ระบบ PopQueue **จะไม่มีการ Deploy สู่ Production จาก Staging Branch โดยตรง และไม่มีการทำ Fast-forward merge ข้ามกระบวนการ Release PR** โดยมีแผนการปล่อยระบบ 2 ระยะดังนี้:

```
[sprint2-staging] ────────► Release PR (5-Lenses Review) ──► [main] ──► Tag v0.4.0-sprint2 ──► Automated Deploy
                                                               ▲
[feature/f09-series-toggle] ──► [sprint3-staging] ─────────────┴──► Release PR (Review) ──► Tag v0.5.0-d2-rc ──► Final Deploy
```

1. **ระยะที่ 1 (Target Sprint 2 Release): Tag `v0.4.0-sprint2` บน `main`**
   - พัฒนา F-05, F-06, F-07 บน branch ย่อยเข้าสู่ `sprint2-staging`
   - เปิด **Release PR จาก `sprint2-staging` ไปยัง `main`** พร้อม Peer Review อย่างเป็นทางการ
   - เมื่อผ่านการ Review ทำการ Merge เข้า `main` ด้วย Merge Commit
   - สร้าง Git Annotated Tag `v0.4.0-sprint2` บน `main` (มี Commit SHA ชัดเจน)
   - GitHub Actions CI/CD Pipeline ทำการ Build, Run Migrations, และ Deploy สู่ Cloud Run อัตโนมัติ
2. **ระยะที่ 2 (Final Deliverable 2 Candidate): Tag `v0.5.0-d2-rc` บน `main`**
   - พัฒนา F-09 Series Toggle บน branch แยก แล้วเปิด PR รวมเข้าสู่ `main`
   - สร้าง Release Tag `v0.5.0-d2-rc` บน `main`
   - รัน Live Smoke Check และ Cloud Run Verification รอบสุดท้ายก่อน Export PDF

---

## 2. ตารางสถานะความสมบูรณ์ของ Sprint 2 (Sprint 2 Completion Table)

| Feature ID | Feature Name | Acceptance Criteria (ACs) | Implementation Artifacts | Verification Suites | Status / Result | Release Tag |
| :---: | :--- | :--- | :--- | :--- | :---: | :---: |
| **F-05** | Queue Cancellation | AC-41.1, AC-41.2, AC-41.3, AC-41.4, AC-41.5, AC-41.6, AC-41.7, AC-41.8 | `ticket.service.ts`<br>`ticket.routes.ts`<br>`MyTicketPage.tsx` | `TEST-41A..41J`<br>`cancel-race.test.ts` | `planned (no evidence yet)` | `v0.4.0-sprint2` |
| **F-06** | Server 120s No-Show | AC-42.1, AC-42.2, AC-43.1, AC-43.2, AC-43.3, AC-43.4, AC-43.5, AC-43.6 | `staff.service.ts`<br>`staff.routes.ts`<br>`CountdownTimer.tsx` | `TEST-42A..C`<br>`TEST-43A..H`<br>`no-show-race.test.ts` | `planned (no evidence yet)` | `v0.4.0-sprint2` |
| **F-07** | Public Queue Board | AC-44.1, AC-44.2, AC-44.3, AC-44.4, AC-44.5, AC-44.6, AC-44.7 | `public.service.ts`<br>`public.routes.ts`<br>`BoardPage.tsx` | `TEST-44A..44F`<br>`public-board.spec.ts` | `planned (no evidence yet)` | `v0.4.0-sprint2` |

---

## 3. ตารางตรวจสอบฟีเจอร์ข้ามระบบ (Cross-Feature Checks: CF-01..CF-08)

| Check ID | ชื่อการตรวจสอบ (Cross-Feature Interaction) | กฎและพฤติกรรมที่ต้องยืนยัน (Behavior & Invariant) | ชุดทดสอบที่ครอบคลุม | สถานะ (Status) |
| :---: | :--- | :--- | :---: | :---: |
| **CF-01** | `cancel` × `call-next` | ตั๋วที่ถูก Cancel ต้องไม่ถูก `call-next` เรียก ([EV-B05](../../evidence/EV-B05.txt)); หากกดพร้อมกันบนตั๋วใบเดียว ฝั่งแพ้ได้ 404 หรือ 400 | `TEST-41F`, `TEST-41H` | `planned` |
| **CF-02** | `no-show` × `call-next` | หลังตัดสิทธิ์ No-Show สำเร็จ พนักงานหลุดจาก `STAFF_BUSY` และเรียกตั๋วถัดไปได้ทันที ([EV-A02](../../evidence/EV-A02.txt)) | `TEST-43B` | `planned` |
| **CF-03** | `cancel` × Multi-Ticket (BR-02 v2) | ยกเลิกตั๋ว 1 ใบในมือ ตั๋วใบอื่นในซีรีส์อื่นยังคงอยู่ปกติ ([EV-B04](../../evidence/EV-B04.txt)); ยกเลิกใบสุดท้ายแสดง Empty State สะอาด | `TEST-41G` | `planned` |
| **CF-04** | `series-toggle` × `join` | เมื่อปิดซีรีส์ (`isActive: false`) คำขอ Join ใหม่ต้องถูกปฏิเสธด้วย `409 SERIES_CLOSED` (AC-12) | `TEST-46B` | `planned` |
| **CF-05** | `series-toggle` × Public Board | ซีรีส์ที่ปิดแต่มีตั๋วค้าง ยังคงแสดงบนบอร์ดพร้อมป้าย Badge "ปิดรับคิว" | `TEST-44D` | `planned` |
| **CF-06** | `cancel` / `no-show` × Public Board | ตั๋วที่ถูก Cancel หรือ No-Show ต้องหายจากบอร์ดหน้าร้านทันทีภายในการ Polling รอบถัดไป | `TEST-44A` | `planned` |
| **CF-07** | Role Guard Consistency | ทุก Endpoint ใหม่ต้องคืน HTTP `403 FORBIDDEN_ROLE` เมื่อเรียกโดย Role ที่ไม่ได้รับอนุญาต ([EV-B01](../../evidence/EV-B01.txt)) | `TEST-41I`, `43G`, `45B`, `46C` | `planned` |
| **CF-08** | Sprint 1 Critical Journey Invariant | การเพิ่มฟีเจอร์ทั้งหมดต้องไม่ทำให้ E2E Journey เดิมของ Sprint 1 เกิด Regression ([EV-A07](../../evidence/EV-A07.txt)) | `e2e/full-journey.spec.ts` | `tested` (`v0.3.0`) |

---

## 4. ตารางงานคงค้างและการดำเนินงานแบบขนาน (Parallel Remaining-Work Table)

| สายงาน (Track) & ฟีเจอร์ | สถานะปัจจุบัน | งานที่ต้องทำ (Remaining Action) | ผู้รับผิดชอบ (Owner) | วันที่เป้าหมาย (Target Date) | สิ่งที่ขึ้นต่อกัน (Dependency) |
| :--- | :--- | :--- | :---: | :---: | :---: |
| **Infrastructure Baseline** | Issue #55 OPEN | รัน Cloud Run Live Verification บน production, ปิด Issue #55 | `@apfirst13` | อ. 24 พ.ย. 23:59 | สิทธิ์ GCP |
| **Track A: F-05 Cancel** | Contract Ready | TDD `[RED]` → `[GREEN]`, ทำ UI ปุ่ม Cancel + Modal + Clean Empty State | `@apfirst13` | พ. 25 พ.ย. 23:59 | PR #61 Merged |
| **Track B: F-06 No-Show** | Contract Ready | TDD FakeClock boundary, ทำ UI Countdown บน Staff Console | `@Theerawat82` | พ. 25 – พฤ. 26 พ.ย. 18:00 | PR #61 Merged (อิสระจาก F-05) |
| **Track A: F-07 Public Board**| Contract Ready | พัฒนา Public Route, จอแสดงผลหน้าร้าน Kiosk-style, Polling 3s | `@apfirst13` | พฤ. 26 – ศ. 27 พ.ย. 12:00 | F-02/F-03 Data (ขนานกับ Track B) |
| **Go/No-Go Decision Gate** | Milestone | ทบทวนความพร้อม F-07, ยืนยัน Minimum Viable Board, ยื่น TA หากมี Scope Revision | ทั้งสองคน | **ศ. 27 พ.ย. 12:00** | F-05, F-06, F-07 พร้อมบน staging |
| **Release v0.4.0-sprint2** | Planned | Release PR: `sprint2-staging` → `main`, Tag `v0.4.0-sprint2`, Automated Deploy | ทั้งสองคน | ศ. 27 พ.ย. 18:00 | Go/No-Go Gate ผ่าน |
| **Track B: F-09 Series Toggle**| Contract Ready | พัฒนา PATCH `/status`, Toggle Switch บน Staff Console บน `sprint3-staging` | `@Theerawat82` | ศ. 27 18:00 – ส. 28 12:00 | v0.4.0 deployed |
| **Release v0.5.0-d2-rc** | Planned | Release PR: `sprint3-staging` → `main`, Tag `v0.5.0-d2-rc`, Deploy Cloud Run, **Code Freeze** | ทั้งสองคน | ส. 28 พ.ย. 18:00 | F-09 Merged |
| **Final PDF Assembly** | In-Progress | ตรวจสอบ Evidence Catalog Appendix, ประกอบและ Export PDF สมบูรณ์ 2 ฉบับ | ทั้งสองคน | **อา. 29 พ.ย. 18:00** (ส่งก่อน 23:59) | v0.5.0 Deployed |
| **F-08 Analytics** | Contract Ready | Aggregation Query, Dashboard UI (Sprint 3 Scope) | `@Theerawat82` | 3 ธ.ค. 2569 | Deliverable 2 ส่งมอบแล้ว |
| **S3-HARDEN** | Contract Ready | ติดตั้ง `express-rate-limit`, Hardening (Sprint 3 Scope) | `@apfirst13` | 6 ธ.ค. 2569 | Deliverable 2 ส่งมอบแล้ว |

---

## 5. แผนการจัดเตรียมหลักฐานการทดสอบสำหรับรายงาน PDF (Evidence Plan: §4.1)

1. **Test Excerpt #1 (Domain Rule Evidence):**  
   คัดเลือกโค้ดทดสอบจาก `server/tests/api/no-show.test.ts` (เคส `TEST-42B` และ `TEST-43A`) แสดงการใช้ `FakeClock` ควบคุมเวลา $\ge 120$ วินาที เพื่อพิสูจน์กฎธุรกิจการตัดสิทธิ์ No-Show พร้อมผลรัน Vitest
2. **Test Excerpt #2 (Access Restriction Evidence):**  
   คัดเลือกโค้ดทดสอบจาก `server/tests/api/cancel.test.ts` (เคส `TEST-41C`) แสดงการส่งคำขอยกเลิกตั๋วของผู้อื่น และยืนยันการตอบกลับ HTTP `403 FORBIDDEN_OWNERSHIP` จากระดับ Backend
3. **TDD RED/GREEN Evidence Chain:**  
   บันทึกหลักฐานคู่ Commit ของฟีเจอร์ F-05:
   - Commit `[RED]`: SHA + ผลการรัน Vitest ที่ล้มเหลวเพราะ Assertion (`expected 200, received 404`)
   - Commit `[GREEN]`: SHA + ผลการรัน Vitest ที่ผ่านครบทั้งชุด
   - `git diff --stat` ระหว่าง 2 Commits เพื่อแสดงปริมาณโค้ดที่เพิ่มขึ้น
4. **Issue / PR Chain Evidence:**  
   แสดงประวัติ Git Lineage ครบวงจร 2 สายงาน:
   - สายงานที่ 1 (F-05): GitHub Issue → Branch `feature/sprint2-f05-cancel` → Pull Request → 5-Lenses Review Comments → Merge เข้า `sprint2-staging`
   - สายงานที่ 2 (F-06): GitHub Issue → Branch `feature/sprint2-f06-no-show` → Pull Request → Review Comments → Merge
5. **Program Demonstrations (Screenshots with API Payloads):**  
   จับภาพหน้าจอคู่กับ DevTools Network Panel:
   - Demo 1: Sprint 1 Continuity Journey บนระบบปัจจุบัน
   - Demo 2: Collector กดยกเลิกคิวตนเองสำเร็จ พร้อม Toast และแสดง `403 FORBIDDEN_OWNERSHIP`
   - Demo 3: Staff Countdown นับถอยหลัง 120s และกดตัด No-Show สำเร็จ
   - Demo 4: จอบอร์ดสาธารณะ `/board` แสดง Now Serving และ Up Next อัปเดตอัตโนมัติ
   - Demo 5: Staff กด Toggle ปิดซีรีส์ และ Collector ถูกปฏิเสธด้วย `409 SERIES_CLOSED`

---

## 6. แผนการดำเนินงานและตารางเวลาส่งมอบ (Finish Plan & Go/No-Go Gate: G0–G6)

| ระยะ / Milestone | วันที่เป้าหมาย | กิจกรรมทางวิศวกรรมหลัก (Engineering Tasks) | เกณฑ์ความสำเร็จ (Exit Criteria) | ผู้รับผิดชอบ | Dependency |
| :---: | :---: | :--- | :--- | :---: | :---: |
| **G0 / G1** | **อ. 24 พ.ย.** | ส่งมอบ Master Contract v1.2, ปิด Issue #55 (Lab 7 Cloud Run), ปรึกษา TA เรื่อง Open Decisions | Issue #55 ปิด, PR #61 พร้อม Merge | `@apfirst13` | - |
| **G2 (F-05)** | **พ. 25 พ.ย.** | พัฒนา F-05 (Cancel) ด้วย TDD `[RED]` → `[GREEN]`, ทำ UI `/my-ticket`, เริ่มเก็บ Lab 7 Metrics | TEST-41 ผ่านครบ, PR Review | `@apfirst13` (Author)<br>`@Theerawat82` (Reviewer) | G1 |
| **G2 (F-06)** | **พฤ. 26 พ.ย.** | พัฒนา F-06 (No-Show 120s) ด้วย TDD FakeClock, ทำ UI Countdown บน Staff Console | TEST-42, 43 ผ่านครบ, PR Review | `@Theerawat82` (Author)<br>`@apfirst13` (Reviewer) | G2 |
| **Go/No-Go Gate**| **ศ. 27 พ.ย. 12:00**| **ประเมินสถานะ F-07 และความพร้อมปล่อย Release:** ยืนยันความพร้อมก่อนตัด Release v0.4.0 หากพบปัญหา UI จะควบคุมขอบเขตให้อยู่ในระดับ Minimum Viable Board ที่แสดงข้อมูลถูกต้องตาม AC-44.1..44.6 ทั้งนี้ หากจำเป็นต้องปรับเปลี่ยนขอบเขต (Scope Revision) จะต้องจัดทำเอกสารขออนุมัติจาก TA อย่างเป็นทางการตามระเบียบ Rubric (ห้าม De-scope เองโดยพลการ) | ยืนยันความพร้อมก่อนตัด Release v0.4.0 | ทั้งสองคน | Track A & B Complete |
| **G3 / G4** | **ศ. 27 พ.ย. 21:00**| พัฒนา F-07 (Public Board), เปิด Release PR สู่ `main`, Tag `v0.4.0-sprint2`, Deploy Cloud Run | `v0.4.0` deployed บน main | ทั้งสองคน | Go/No-Go |
| **G4 (F-09)** | **ส. 28 พ.ย. 16:00**| พัฒนา F-09 (Series Toggle) เป็น Genuine Progress, ทำ Toggle Switch บน Staff Console | TEST-46 ผ่าน, PR สู่ `main` | `@Theerawat82` | G3 |
| **G5** | **ส. 28 พ.ย. 21:00**| Tag `v0.5.0-d2-rc` บน `main`, Deploy Production Cloud Run, รัน Live Checks, **Code Freeze** | Smoke & Persistence pass 3/3 | ทั้งสองคน | G4 |
| **G6** | **อา. 29 พ.ย.** | ประกอบรายงาน PDF ฉบับสมบูรณ์ 2 ฉบับ (Deliverable 2 + Lab 7 Final), ตรวจทานก่อนส่ง | **ส่ง LEB2 ก่อน 18:00** (เส้นตาย 23:59) | ทั้งสองคน | G5 |
| **Post-D2** | **30 พ.ย.–13 ธ.ค.** | พัฒนา F-08 Analytics, S3-HARDEN, Load Test, ถ่ายทำ Video (จัดสรรงานเบาช่วงสอบ 1–11 ธ.ค.) | Final Delivery `v1.0.0-final` | ทั้งสองคน | G6 |

---

# Appendix A: Local Setup, Safe Test Accounts & AI-Use Declaration

## 1. Setup Summary (คำแนะนำการติดตั้งสำหรับผู้ตรวจ)
```powershell
# 1. Clone repository เข้าสู่โฟลเดอร์ PopQueue
git clone https://github.com/apfirst13/PopQueue_BFteam.git PopQueue
cd PopQueue

# 2. สลับไปยัง Release Tag หรือ Tag ตรวจประเมินบน main
# สำหรับผู้ตรวจ / กรรมการตรวจประเมินผลงาน (Reviewer & Evaluator)
git checkout tags/v0.3.0-lab7  # หรือ tags/v0.5.0-d2-rc เมื่อ deploy release candidate บน main

# 3. เตรียม Environment Variables จากไฟล์ตัวอย่าง
Copy-Item server/.env.example server/.env
Copy-Item client/.env.example client/.env

# 4. ติดตั้ง Dependencies ทั้งระบบ
npm install
npm install --prefix server
npm install --prefix client

# 5. เริ่มต้นฐานข้อมูล PostgreSQL ผ่าน Docker Compose
docker compose up -d postgres

# 6. รัน Database Migrations และ Seed ข้อมูลเริ่มต้น
npm run db:migrate --prefix server
npm run db:seed --prefix server

# 7. ตรวจสอบความสมบูรณ์ของระบบผ่านชุดทดสอบอัตโนมัติ
npm test
npm run test:e2e

# 8. รันระบบในโหมดพัฒนา (Development Mode)
npm run dev
# Frontend: http://localhost:3000
# Backend API: http://localhost:4000
```

## 2. Safe Test Accounts (ข้อมูลบัญชีสำหรับทดสอบ — Sanitized)

> **ความปลอดภัยของข้อมูลการทดสอบ (Credential Sanitization):**  
> ตามระเบียบการรักษาความปลอดภัยของระบบ ข้อมูลรหัสผ่านจริงทั้งหมดถูกคัดแยกออกจากเอกสารสาธารณะ โดยผู้ตรวจประเมินสามารถใช้รหัสผ่านกลางที่ส่งมอบผ่าน **Private Course Handoff (LEB2 Submission Portal)** ควบคู่กับรายชื่อบัญชีด้านล่าง:

| บทบาท (Role) | บัญชีผู้ใช้ (Username) | สิทธิ์การเข้าถึงและการทดสอบ (Scope & Permissions) |
| :--- | :--- | :--- |
| `COLLECTOR` | `somchai` | ลูกค้าทั่วไป: จองคิวซีรีส์ `CRY`, ดูตั๋วตนเอง, กดยกเลิกคิว (`F-05`) |
| `COLLECTOR` | `somying` | ลูกค้าทั่วไป: จองคิวซีรีส์ `LAB`, ทดสอบการจองข้ามซีรีส์ (BR-02 v2) |
| `COLLECTOR` | `somsak` | ลูกค้าทั่วไป: บัญชีสำรองสำหรับการทดสอบ Concurrency |
| `BOX_MASTER` | `staff_cry` | พนักงานสถานีแกะกล่อง: ประจำซีรีส์ `CRY` (Call Next, Start, Complete, No-Show, Toggle) |
| `BOX_MASTER` | `staff_lab` | พนักงานสถานีแกะกล่อง: ประจำซีรีส์ `LAB` |
| `BOX_MASTER` | `staff_multi` | พนักงานสถานีแกะกล่อง: ได้รับมอบหมายดูแลทั้ง `CRY` และ `LAB` |

## 3. Contribution Table (ตารางการมีส่วนร่วมของสมาชิก)

| หมวดหมู่งาน / ฟีเจอร์หลัก | `@apfirst13` (aphiwat) | `@Theerawat82` (Theerawat) | สถานะของงาน (Task Status) |
| :--- | :---: | :---: | :---: |
| Master Specification Contract & Architecture (Part A, B §1/§3, D) | Author | Reviewer | `implemented` |
| Master Specification Contract & Review (Part B §2, C §1/§2, E) | Reviewer | Author | `implemented` |
| F-05 Queue Cancellation Contract & Implementation | Author | Reviewer | `planned` |
| F-06 No-Show 120s Contract & Implementation | Reviewer | Author | `planned` |
| F-07 Public Queue Display Board Contract & UI | Author | Reviewer | `planned` |
| F-09 Series Availability Control (Working Progress) | Reviewer | Author | `planned` |
| Peer Review & Verification Artifacts Management | Contributor | Contributor | `in-progress` |
| Final PDF Report Assembly & Export | Contributor | Contributor | `planned` |

## 4. AI-Use Declaration
ในการจัดทำเอกสาร Master Contract ฉบับนี้ ทีมงานได้ใช้งานเครื่องมือ AI ตามระเบียบข้อบังคับของรายวิชา CPE 334:
1. **Claude 3.5 Sonnet (Anthropic):** ใช้สำหรับการวิเคราะห์ทวนสอบความสอดคล้องของเอกสารเทียบกับ Rubric เกณฑ์การประเมิน, การจัดทำโครงสร้างสัญญา และการตรวจทานข้อขัดแย้งของ State Machine
2. **Antigravity AI Assistant (Google DeepMind):** ใช้เป็นผู้ช่วยวิศวกรรมในการรันคำสั่งตรวจสอบ Ground Truth ภายใน Codebase, ตรวจสอบ Predicate ของ Database Migrations, การรัน Test Suites อัตโนมัติ และการเก็บหลักฐานคำสั่งดิบ (Raw Evidence EV-A, EV-B, EV-D)  
*ทั้งนี้ นักศึกษาทั้งสองคนเป็นผู้ตัดสินใจทางวิศวกรรม กำหนดนโยบายธุรกิจ ตรวจทานคำสั่ง และอนุมัติเนื้อหาทุกส่วนในเอกสารด้วยตนเอง*

---

# Appendix B: Audited Evidence Catalog & Command Excerpts (Self-Contained PDF Archive)
> ส่วนนี้จัดทำขึ้นเพื่อให้เอกสารฉบับนี้เป็น **Self-Contained PDF** ตามข้อกำหนดของ Deliverable 2 Rubric ที่ระบุว่า *"PDF ต้องสามารถอ่านเข้าใจและตรวจประเมินได้ในตัวเอง โดย Link ไม่ใช่ตัวแทนของเอกสาร"* ข้อมูลด้านล่างคือสาระสำคัญ คำสั่งที่รันจริง และผลลัพธ์ดิบของหลักฐานการตรวจประเมินทั้งหมด

### 1. Ground-Truth Codebase & Migration Audit (EV-A01 ถึง EV-A10)
* **EV-A01 (Baseline Tags & SHAs):** `git rev-parse v0.1.0-sprint1` → `d946159ba82a249c195730a3b702cf0f68e96e2d`, `git rev-parse v0.2.0-lab5` → `bf52c9b4e60ea94348a735071ae7573d4d420f86`, `git rev-parse v0.3.0-lab7` → `a07a7be732b30cb75a22df7f30edfdc51521a87e`
* **EV-A02 (Database Partial Indexes):** Migration `0002` และ `0003` ยืนยัน Partial Unique Index:
  - `unique_active_collector_ticket` สร้างบน `("userId") WHERE status IN ('WAITING', 'CALLED', 'UNBOXING')` (ยกเว้น `CANCELLED`, `NO_SHOW`, `COMPLETED`)
  - `unique_active_staff_ticket` สร้างบน `("handledByStaffId") WHERE status IN ('CALLED', 'UNBOXING')`
  - `unique_active_user_series_ticket` สร้างบน `("userId", "seriesId") WHERE status IN ('WAITING', 'CALLED', 'UNBOXING')`
* **EV-A03 (Prisma Schema Invariants):** `QueueTicket` มี enum status ครบถ้วน: `WAITING`, `CALLED`, `UNBOXING`, `COMPLETED`, `CANCELLED`, `NO_SHOW` และมีฟิลด์ `forfeitedAt DateTime?` ในบรรทัดที่ 74 รอไว้แล้ว
* **EV-A04 (State Transition & Clock Interface):** โค้ด `server/src/services/ticket.service.ts` และ `staff.service.ts` ใช้อินเทอร์เฟซ `Clock` จาก `server/src/utils/clock.ts` ในการบันทึก `calledAt`, `startedAt`, `completedAt` และมีการตรวจสอบ `handledByStaffId === null` ก่อนเกิด `INVALID_STATE_TRANSITION`
* **EV-A05 (Call-Next Raw SQL Transaction):** `server/src/services/staff.service.ts:182-187` ใช้คำสั่ง:
  ```sql
  SELECT "id" FROM "QueueTicket"
  WHERE "seriesId" = ${seriesId} AND "status" = 'WAITING'::"TicketStatus"
  ORDER BY "queueDate" ASC, "queueNumber" ASC
  LIMIT 1
  FOR UPDATE SKIP LOCKED;
  ```
  โดยไม่มีการกรอง `isActive` หรือวันที่ ทำให้ตั๋วเดิมในซีรีส์ที่ปิดสามารถถูกเรียกและให้บริการจนเสร็จสิ้นได้
* **EV-A06 (Health Check & GIT_SHA Pipeline):** `/api/health` และ `/api/v1/health` คืนค่า commit จาก `process.env.GIT_SHA` ซึ่งถูก inject เข้ามาในขั้นตอน Docker Build ผ่าน GitHub Actions Workflow
* **EV-A07 (Baseline Regression Suite):** ผลการรัน `npm test` บน baseline `v0.3.0-lab7`: ผ่านทั้งหมด 194 tests (153 unit tests, 34 integration tests, 7 schema tests) โดยไม่มีการ skip/only/weaken test
* **EV-A08 (Coverage Baseline):** Statements: 84.8%, Branches: 78.4%, Functions: 82.1%, Lines: 84.5%
* **EV-A09 (TA Approved Scope Record):** บันทึกการอนุมัติขอบเขตจาก TA (คุณรัตนโชติ เพชรพันธุ์ศรี) เมื่อวันที่ 2026-11-23 15:30 อนุญาตให้ปรับกฎ `BR-02` เป็น 1 ตั๋วต่อซีรีส์ และรับรองขอบเขต F-05, F-06, F-07
* **EV-A10 (Branch Verification):** ยืนยันว่า `origin/main` อยู่ที่ commit `a07a7be` ซิงก์สมบูรณ์

### 2. Envelope, Counter, Clocks & Live Configuration Audit (EV-B01 ถึง EV-B09)
* **EV-B01 (Error Envelopes & Role Guards):** Error responses ทั้งหมดส่งคืนโครงสร้าง `{ error: { code, message, statusCode, details? } }` โดยไม่มี boolean flag success (true/false) ปะปน; กรณีไม่ล็อกอินได้ `401 UNAUTHENTICATED`, สิทธิ์ไม่ถึงได้ `403 FORBIDDEN_ROLE`
* **EV-B02 (Full Journey E2E Baseline):** `npx playwright test e2e/full-journey.spec.ts` รันผ่านครบ 3/3 scenarios
* **EV-B03 (Daily Counter Monotonic Behavior):** `QueueCounter` key `("seriesId", "queueDate")` ใช้ timezone `Asia/Bangkok` ค่า count เพิ่มขึ้นต่อเนื่อง ไม่มีการลดค่า และไม่นำเลขคิวเดิมกลับมาใช้ซ้ำ
* **EV-B04 (My-Ticket Payload & 404 Behavior):** `/api/tickets/my-ticket` หากไม่มีตั๋ว active ในสถานะ `WAITING`, `CALLED`, `UNBOXING` เลย จะโยน `AppError(404, 'NO_ACTIVE_TICKET')`; หากพบตั๋วจะคืน `{ ticket, tickets: [...] }`
* **EV-B05 (Call-Next FIFO Invariant):** ยืนยันว่าคำสั่ง SQL ข้ามตั๋วสถานะ `CANCELLED` โดยอัตโนมัติเนื่องจากมีเงื่อนไข `status = 'WAITING'`
* **EV-B06 (Deployment GIT_SHA Pipeline):** `deploy.yml:115` ส่ง build argument `GIT_SHA=${{ github.sha }}` เข้า Dockerfile
* **EV-B07 (Deployment Status & Live Verification):** CHG-01 มีหลักฐานเดิมของรุ่น `v0.2.0`; DEF-02 และ CHG-02 รอการปิด Issue #55 บน Cloud Run
* **EV-B08 (Client File Mapping):** ตรวจสอบไฟล์ UI จริง `client/src/pages/MyTicketPage.tsx`, `StaffCounterPage.tsx`, `BoardPage.tsx`
* **EV-B09 (Working Tree Cleanliness):** ยืนยันสถานะความสะอาดของ repository

### 3. Preflight & Contract Specification Verification (EV-D01 ถึง EV-D06)
* **EV-D01 (Preflight Checks & Cancel Grep):** ยืนยัน branch lineage สะอาด ไม่พบค้างคำว่า cancel ก่อนเริ่มพัฒนา
* **EV-D02 (AC Completeness & Error Code Coverage):** ตรวจสอบว่าเกณฑ์การยอมรับทั้งหมด 81 ACs ปรากฏอย่างน้อย 2 ครั้งในเอกสาร และ Error Codes ทั้ง 11 รหัสถูกผูกกับ AC และ STS อย่างสมบูรณ์
* **EV-D03 (Pre-written Output Claims Verification):** ตรวจสอบด้วย regex ไม่พบการอ้างอิงข้อความเคลมลอย ("100%", "Verified", "PASS", "DONE") ทุกจุดมี EV-ID กำกับชัดเจน
* **EV-D04 (Response Envelope Normalization):** ตรวจสอบว่าในข้อกำหนดและตัวอย่าง payload ทั้งหมดไม่มีการใช้ boolean flag `success: true` หรือ `success: false` แม้แต่จุดเดียว
* **EV-D05 (R4 Test Integrity Verification):** ตรวจสอบชุดทดสอบใน `server/tests` และ `e2e` ยืนยันว่า Exit Code 1 ของคำสั่ง grep พิสูจน์ว่าปราศจากการใช้ `.skip(`, `.only(`, `xit(`, `xdescribe(`, `it.todo` 100%
* **EV-D06 (Diff Stat vs origin/main):** ยืนยันว่าการเปลี่ยนแปลงทั้งหมดถูกจำกัดอยู่เฉพาะเอกสารและหลักฐานใน `docs/` และ `AGENTS.md` โดยไม่มีการแก้ไขโค้ดหรือชุดทดสอบในโฟลเดอร์อื่น

---

# Appendix C: Open Decisions & Formal Policy Register
> รวบรวมข้อตัดสินใจทางวิศวกรรม นโยบายธุรกิจ และประเด็นที่อยู่ระหว่างการปรึกษาหารือกับ TA อย่างเป็นทางการ

| Decision ID | ข้อตัดสินใจทางวิศวกรรม / นโยบายธุรกิจ | ข้อกำหนดและพฤติกรรมที่เลือก (Selected Policy) | เหตุผลและความจำเป็นทางวิศวกรรม | สถานะการอนุมัติ (Approval Status) |
| :---: | :--- | :--- | :--- | :---: |
| **DEC-01** | **Race Condition Loser (Cancel vs Call-Next)** | เมื่อมีตั๋ว `WAITING` ใบเดียว หาก Cancel และ Call-Next ชนกัน ฝ่ายแพ้จะได้รับ Error ที่ชัดเจน (Cancel ชนะ → Staff ได้ `404 NO_WAITING_TICKETS`; Call-Next ชนะ → Collector ได้ `400 INVALID_STATE_TRANSITION`) | ป้องกันตั๋วค้างสถานะคู่ และทำให้ client ทราบผลลัพธ์ที่แท้จริงได้ทันที | **Approved in Contract** |
| **DEC-02** | **Re-join Policy หลังถูกตัดสิทธิ์ No-Show** | Collector ที่ถูกตัดสิทธิ์ No-Show สามารถกดขอรับบัตรคิวในซีรีส์เดิมได้ทันที โดยได้รับเลขคิวใหม่ต่อท้ายแถว (`AC-43.6`) | สอดคล้องกับพฤติกรรมหน้าร้าน ลูกค้าที่มาไม่ทันสามารถเริ่มต่อแถวใหม่ได้โดยไม่ต้องรอข้ามวัน | **Pending TA Confirmation (G1)** |
| **DEC-03** | **Start-Unboxing หลังเกิน 120 วินาที** | หากเวลาผ่านไปเกิน 120s แล้ว แต่ Staff ยังไม่ได้กดปุ่ม No-Show และลูกค้าปรากฏตัว Staff ยังคงสามารถกด Start-Unboxing เพื่อให้บริการได้ตามปกติ | ให้ความยืดหยุ่นหน้างานแก่พนักงาน และระบบมี conditional update ป้องกัน race condition | **Approved in Contract** |
| **DEC-04** | **การแสดงผลซีรีส์ที่ปิดบน Public Board** | ซีรีส์ที่ถูกปิด (`isActive: false`) จะยังคงแสดงบนจอบอร์ดสาธารณะหากยังมีตั๋วค้างรอรับบริการอยู่ (`WAITING`, `CALLED`, `UNBOXING`) พร้อมติดป้าย "ปิดรับคิวใหม่"; หากไม่มีตั๋วค้างเลยจะซ่อนจากบอร์ด | ป้องกันความสับสนของลูกค้าที่ถือตั๋วค้างอยู่หน้าร้าน | **Approved in Contract** |
| **DEC-05** | **ขอบเขตสถานะ Now Serving บนจอบอร์ด** | คอลัมน์ Now Serving บนจอบอร์ดสาธารณะ (`/board`) จะรวมทั้งตั๋วสถานะ `CALLED` (เรียกแล้วกำลังเดินมา) และ `UNBOXING` (กำลังแกะกล่อง) เพื่อให้ลูกค้าหน้าร้านมองเห็นการเคลื่อนไหวของคิว | ลดความแออัดหน้าเคาน์เตอร์และแจ้งเตือนลูกค้าล่วงหน้า | **Approved in Contract** |
