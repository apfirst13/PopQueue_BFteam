# PopQueue — Project Deliverable 2 Master Contract & Specification (v1.1)
> **Core Expansion (Sprint 2) & Genuine Progress (Sprint 3) with GCP Deployment**  
> **Course:** CPE 334 Introduction to Software Engineering in the Age of AI Agents (Semester 1/2026, KMUTT)  
> **Project / Theme:** **PopQueue** — Theme 9: Queue and Service Management System (*Art Toy Live Unboxing Station*)  
> **Repository:** `https://github.com/apfirst13/PopQueue_BFteam.git`  
> **Team Members:** `@apfirst13` (aphiwat) & `@Theerawat82` (Theerawat)  
> **Student IDs:** *(ใส่รหัสนักศึกษาทั้ง 2 คนในหน้าปก PDF เท่านั้น — ไม่เปิดเผยใน Repo สาธารณะ)*  
> **Deliverable:** Project Deliverable 2 (70 Points | 7% of Course Grade)  
> **Submission Deadline:** **Sunday, 29 November 2026 at 23:59** (via LEB2, single self-contained PDF)  
> **Contract Version:** `v1.1 (DOCS ONLY REVISION)`  
> **Contract Date:** `2026-11-24`  
> **Initial Baseline Commit SHA:** `3ddea46ce27758ba99c9de87ecb18160bd9d326f` (Imported v1.0)  
> **Audited Evidence Baseline Commit SHA:** `830bdc575cfa14f2247e7ea5d3fb5196c348f114` (EV-A, EV-B, EV-D)  
> **Target Reviewer:** `@Theerawat82` (รอยืนยันผลการ Peer Review)  
> **Staging Lineage Branch:** `sprint2-staging` (แทนที่ `lab5-staging`)  
> **Deployed Cloud Run URL:** `*(รอผล Live Verification จากมนุษย์หลัง Deploy v0.4.0 — ดู Issue #55)*`  
> **Immutable Submitted Tag/Commit:** `*(จะเติมก่อน Export PDF หลัง Deploy สำเร็จ)*`

---

## 0. ตารางบันทึกการเปลี่ยนแปลงฉบับเอกสาร (Changelog: v1.0 → v1.1)

| ข้อที่ | หัวข้อ / ส่วนที่เปลี่ยนแปลง | เหตุผลและความจำเป็นทางวิศวกรรม | บรรทัด / หมวดที่เปลี่ยนใน Master |
| :---: | :--- | :--- | :--- |
| **1** | **Central Version & Baseline SHAs** | ระบุ SHA เต็มสำหรับ Release Tags เดิม (`v0.1.0-sprint1`, `v0.2.0-lab5`, `v0.3.0-lab7`) อ้างอิงผล Audit จริง (**EV-A01**) ไม่คาดเดา SHA ล่วงหน้า | Header, ส่วนที่ 0.1 |
| **2** | **Standard Envelope Normalization** | ปรับ Error Envelope ให้ตรงกับโค้ดจริง `{ error: { code, message, statusCode, details? } }` และ Success Envelope `{ data: ... }` โดยตัด `"success": false` และ `"success": true` ออก 100% (**EV-B01**, **EV-B04**) | ส่วนที่ 0.2, Part B (§1.4, §2.4, §3.3), Part C (§1.3, §2.3, §3.3) |
| **3** | **System-Wide Constants Definition** | รวบรวมค่านิพจน์กลาง (`UP_NEXT_LIMIT=5`, `NO_SHOW_SECONDS=120`, `RATE_LIMIT_WINDOW_MS=900000`, `RATE_LIMIT_MAX=10`, `TRUST_PROXY_HOPS=1`) ไว้ที่เดียว | ส่วนที่ 0.3 |
| **4** | **Part A Claim Integrity & Evidence Alignment** | ลบข้อความเคลมล่วงหน้า ("ทำงานถูกต้อง 100%", "PASS"); ปรับสถานะ DEF-02 retest และ CHG-02 live check เป็น `unverified — evidence pending` (**EV-B07**); อ้างอิงหลักฐานเดิมของ CHG-01 ใน `docs/labs/lab05/deployment.md` | Part A (§1, §2) |
| **5** | **Part A Decision Column & Issues Register** | เพิ่มคอลัมน์ "Accepted Decision" ใน Change & Defect Register; บันทึก Issues/PRs ทุกรายการจาก Lab 5–7 รวมถึงรายการที่ปิด/Superseded (**EV-A09**) | Part A (§2) |
| **6** | **F-05 Cancel Deterministic Flow & Concurrency** | ระบุ Error Order: 401 → 403 (FORBIDDEN_ROLE) → 404 → 403 (FORBIDDEN_OWNERSHIP) → 400 (INVALID_STATE_TRANSITION); ออกแบบ Concurrency updateMany ป้องกัน race กับ `call-next` (**EV-B05**); ยืนยัน Index Predicate ไม่ต้องมี Migration (**EV-A02**) | Part B (§1) |
| **7** | **F-05 Multi-ticket & Numbering Integrity** | เพิ่ม AC-41.6, AC-41.7, AC-41.8 สำหรับการข้ามตั๋ว CANCELLED ใน `call-next` โดยโครงสร้าง (**EV-B05**), การคงอยู่ของตั๋วใบอื่นใน Multi-ticket (**EV-B04**), และ Empty state เมื่อยกเลิกใบสุดท้าย | Part B (§1.6, §1.7) |
| **8** | **F-06 No-Show Error Order & Null-Guard Alignment** | คงลำดับโค้ดจริง Sprint 1: ตรวจ `handledByStaffId !== null && handledByStaffId !== staffId` ก่อน `INVALID_STATE_TRANSITION` (**EV-A04**); ตั๋ว `WAITING` ได้ 400 ไม่ใช่ 403; ตัดสิทธิ์ manual เท่านั้น | Part B (§2.3, §2.4) |
| **9** | **F-06 ServerNow Clock Synchronization** | เพิ่ม `data.serverNow` ใน `call-next`, `my-ticket`, และ `GET /api/staff/tickets` เพื่อให้ `CountdownTimer` และ Staff Console ซิงก์เวลากับ Application Clock (**EV-A05**, **EV-B04**, **EV-B05**) | Part B (§2.4, §2.5) |
| **10** | **F-06 Collector Re-join Policy After No-Show** | บันทึก Decision (2026-11-24, สถานะ "รอยืนยัน TA"): ลูกค้าที่ถูก No-Show สามารถ join คิวใหม่ได้ทันทีที่ท้ายแถว โดยโครงสร้าง DB Index (**EV-A02**) | Part B (§2.1, §2.6) |
| **11** | **F-07 Public Board Query & Dataset Alignment** | ปรับ Dataset และ Order ของ Board ให้ตรงกับ `call-next` (`queueDate ASC, queueNumber ASC`) เพื่อให้ Up Next ตรงกับตั๋วที่จะถูกเรียกจริง (**EV-B05**); บันทึกข้อจำกัด G-07 | Part B (§3.1, §3.3) |
| **12** | **F-07 Integer Sort, Single UP_NEXT_LIMIT & Zero PII** | เรียงตาม `queueNumber` (Int); บังคับ `UP_NEXT_LIMIT=5`; ตรวจ Zero PII ที่ "ค่า" ของ payload (ไม่พบ string usernames/passwords ใน JSON body); รองรับ Badge ปิดรับคิว | Part B (§3.3, §3.5, §3.6) |
| **13** | **F-08 Analytics Math Correction & queueDate Partition** | แก้ไข `noShowRate` ในตัวอย่างเป็น `0.10` (2/20) พร้อมแสดงสูตรคำนวณ; กำหนดนิยาม "วัน" ด้วยฟิลด์ `queueDate` (**EV-B03**); TEST-45D ใช้ Prisma direct seed ยืนยันค่า ไม่พึ่ง FakeClock กับ `createdAt` (**EV-B03**) | Part C (§1.3, §1.5) |
| **14** | **F-09 Series Toggle Full Invariants** | เพิ่ม AC-46.4: หลังปิดซีรีส์ ตั๋วค้างเดิมยังคง Call/Start/Complete ได้ปกติ; ตรวจ Body boolean (400); Idempotent toggle ซ้ำคืน 200; ทดสอบร่วมกับ AC-12 เดิม | Part C (§2) |
| **15** | **S3-HARDEN Proxy Trust & Test-Injection** | กำหนด `trust proxy, 1` (ไม่ใช่ true ลอยๆ); เพิ่ม injectable `RATE_LIMIT_WINDOW_MS` / `RATE_LIMIT_MAX` และขยายใน `NODE_ENV=test`; 429 Error Envelope; ระบุ live check บน Cloud Run เป็น NOT RUN | Part C (§3) |
| **16** | **Part D AC Register & Planned Tests Mapping** | จัดทำ AC Register ครบ AC-01..AC-47; ติดป้าย `planned (no evidence yet)` สำหรับไฟล์เทสต์ที่ยังไม่มีจริงบน codebase (**EV-A07**, **EV-B08**); บันทึก Decision Log ละเอียด | Part D (§1, §2, §3) |
| **17** | **Part E Cross-Feature Checks & 2-Stage Release Plan** | เพิ่มตาราง Cross-Feature Checks (CF-01..CF-08); ปรับ Release Plan เป็น 2 ระยะ (`v0.4.0-sprint2` แล้ว `v0.5.0-d2-rc`); ปรับ Finish Plan ละเอียดตามเกณฑ์ G0–G6 | Part E (§1, §4, §5) |
| **18** | **Section 4 Credential Sanitization** | ลบรหัสผ่าน Plaintext ทั้งหมดออกจาก Section 4 เหลือเฉพาะ Username และ Role พร้อมระบุการส่งมอบผ่าน Private Course Handoff | Section 4 (§2) |

---

## 0.1 ตารางเวอร์ชันและประวัติสายการปล่อย (Central Version & Lineage Table)

| Component / Milestone | Target / Baseline Tag | Base Branch / Lineage | Main Release Commit SHA | Deployed Cloud Run Revision | CI Pipeline Run ID | สถานะการตรวจสอบ (Status) |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| **Sprint 1 Baseline** | `v0.1.0-sprint1` | `sprint-1-staging` | `d946159ba82a249c195730a3b702cf0f68e96e2d` | `popqueue-service-00001` | N/A (Manual CI) | **Accepted** (**EV-A01**) |
| **Lab 5 Cloud Deployment** | `v0.2.0-lab5` | `lab5-staging` | `bf52c9b969d905ba6f21bcc22a460f0db3dd5172` | `popqueue-service-00003` | `#118312049` | **Accepted** (**EV-A01**, **EV-B07**) |
| **Lab 7 Maintenance (BR-02 v2)** | `v0.3.0-lab7` | `main` | `a07a7be732b30cb75a22df7f30edfdc51521a87e` | TBD (Pending #55) | `#119854721` | **Accepted** (**EV-A01**, **EV-B02**) |
| **Sprint 2 Target Release** | `v0.4.0-sprint2` | `sprint2-staging` | TBD | TBD | TBD | `planned (no evidence yet)` |
| **Deliverable 2 Final Candidate** | `v0.5.0-d2-rc` | `main` | TBD | TBD | TBD | `planned (no evidence yet)` |

---

## 0.2 มาตรฐาน Envelope ของระบบ (System Envelope Conventions — FACTS F2)

ทุก Endpoint ในระบบ PopQueue ทั้งในปัจจุบันและฟีเจอร์ใหม่ ต้องปฏิบัติตามโครงสร้าง Envelope สากลของระบบอย่างเคร่งครัด โดยไม่มีการใช้ฟิลด์ `"success": true` หรือ `"success": false` ปะปน:

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
| `NO_SHOW_SECONDS` | `number` | `120` | กรอบเวลารอคอยขั้นต่ำ (วินาที) นับจาก `calledAt` ก่อนอนุญาตให้ Box Master ตัดสิทธิ์ No-Show (`F-06`, `AC-42`, `AC-43.1`, `BR-08`, `TEST-42`) |
| `RATE_LIMIT_WINDOW_MS` | `number` | `900000` | กรอบเวลา (15 นาที ในหน่วยมิลลิวินาที) สำหรับ Login Rate Limiter (`S3-HARDEN`, `AC-47.1`, `TEST-47A`) |
| `RATE_LIMIT_MAX` | `number` | `10` | จำนวนคำขอสูงสุดต่อ IP ภายใน 1 Window สำหรับ `/api/auth/login` (`S3-HARDEN`, `AC-47.1`, `TEST-47A`) |
| `TRUST_PROXY_HOPS` | `number` | `1` | จำนวน Proxy Hop ที่ Express เชื่อถือสำหรับอ่าน Header `X-Forwarded-For` บน Google Cloud Run (`S3-HARDEN`) |

---

## 0.4 ทะเบียนบันทึกหลักฐานการตรวจประเมิน (Evidence Register)

| รหัสหลักฐาน (EV-ID) | หัวข้อการตรวจสอบ | ผลลัพธ์ที่คาดหวัง | ผลลัพธ์ที่ตรวจพบจริง (Actual Result) | เวลาที่รันคำสั่ง (ISO) | Commit SHA ที่ตรวจ | ไฟล์หลักฐานบนดิสก์ |
| :---: | :--- | :--- | :--- | :---: | :---: | :--- |
| **EV-A01** | Release Tags & SHAs | Tag v0.1.0, v0.2.0, v0.3.0 ตรงกับ Git | CONFIRMED — d946159, bf52c9b, a07a7be ตรงกัน | 2026-11-24T19:24:39+07:00 | `75068a6109439b7f` | [`docs/evidence/EV-A01.txt`](file:///docs/evidence/EV-A01.txt) |
| **EV-A02** | Migrations & Index Predicates | CANCELLED, NO_SHOW หลุดจาก Index | CONFIRMED — Migration 0002/0003 exclude ทั้งสอง | 2026-11-24T19:24:39+07:00 | `75068a6109439b7f` | [`docs/evidence/EV-A02.txt`](file:///docs/evidence/EV-A02.txt) |
| **EV-A03** | Prisma Schema Integrity | มี enum และฟิลด์ Sprint 2 ครบ | CONFIRMED — Enum บรรทัด 20-21, forfeitedAt บรรทัด 74 | 2026-11-24T19:24:39+07:00 | `75068a6109439b7f` | [`docs/evidence/EV-A03.txt`](file:///docs/evidence/EV-A03.txt) |
| **EV-A04** | Service Error Evaluation Flow | ตรวจสอบลำดับ throw ใน staff.service | CONFIRMED — มี null-guard ก่อนตรวจ NOT_HANDLER | 2026-11-24T19:24:39+07:00 | `75068a6109439b7f` | [`docs/evidence/EV-A04.txt`](file:///docs/evidence/EV-A04.txt) |
| **EV-A05** | Clock Abstraction & Calls | calledAt ถูกคุมด้วย clock.now() | CONFIRMED — Interface Clock ใน clock.ts | 2026-11-24T19:24:39+07:00 | `75068a6109439b7f` | [`docs/evidence/EV-A05.txt`](file:///docs/evidence/EV-A05.txt) |
| **EV-A06** | Health Endpoint & GIT_SHA | คืน status ok และ commit SHA | CONFIRMED — app.ts:27-34, vitest 4/4 passed | 2026-11-24T19:24:39+07:00 | `75068a6109439b7f` | [`docs/evidence/EV-A06.txt`](file:///docs/evidence/EV-A06.txt) |
| **EV-A07** | Test Inventory & R4 Integrity | รันผ่านทั้งหมด ไม่มี skip/only | CONFIRMED — 194 passed (Server 153, Client 34, E2E 7) | 2026-11-24T19:24:39+07:00 | `75068a6109439b7f` | [`docs/evidence/EV-A07.txt`](file:///docs/evidence/EV-A07.txt) |
| **EV-A08** | AC/TEST ID Collision Audit | ไม่มีเลข ID ชนกับ Sprint 1 / Labs | CONFIRMED — AC-40 เว้นว่าง; AC-41..47 ว่างตรงกัน | 2026-11-24T19:24:39+07:00 | `75068a6109439b7f` | [`docs/evidence/EV-A08.txt`](file:///docs/evidence/EV-A08.txt) |
| **EV-A09** | Issues, PRs & TA Sign-off | ตรวจสอบ Issue #52-#55, PR #57-#60 | CONFIRMED — บันทึกอนุมัติ TA 23 พ.ย. 15:30 บรรทัด 76 | 2026-11-24T19:24:39+07:00 | `75068a6109439b7f` | [`docs/evidence/EV-A09.txt`](file:///docs/evidence/EV-A09.txt) |
| **EV-A10** | Git Branch Topology | สำรวจสถานะ origin/main เทียบ local | CONFIRMED — origin/main อยู่ที่ a07a7be (v0.3.0) | 2026-11-24T19:24:39+07:00 | `75068a6109439b7f` | [`docs/evidence/EV-A10.txt`](file:///docs/evidence/EV-A10.txt) |
| **EV-B01** | Role Guard Error Code & Shape | คืน 403 FORBIDDEN_ROLE | CONFIRMED — server/src/middleware/auth.ts:85 | 2026-11-24T20:14:40+07:00 | `75068a6109439b7f` | [`docs/evidence/EV-B01.txt`](file:///docs/evidence/EV-B01.txt) |
| **EV-B02** | Git Tree Diff vs v0.3.0-lab7 | โค้ด server/client/e2e ต้องเท่ากัน | CONFIRMED — merge-base is ancestor, diff ว่างเปล่า | 2026-11-24T20:14:40+07:00 | `75068a6109439b7f` | [`docs/evidence/EV-B02.txt`](file:///docs/evidence/EV-B02.txt) |
| **EV-B03** | QueueCounter Daily Reset & Key | รีเซ็ตรายวัน Asia/Bangkok, ไม่ถอยเลข | CONFIRMED — composite key seriesId, queueDate | 2026-11-24T20:14:40+07:00 | `75068a6109439b7f` | [`docs/evidence/EV-B03.txt`](file:///docs/evidence/EV-B03.txt) |
| **EV-B04** | My-Ticket Query Filter & Shape | กรอง 3 สถานะ active, คืน {ticket, tickets} | CONFIRMED — ticket.service.ts:145-212 | 2026-11-24T20:14:40+07:00 | `75068a6109439b7f` | [`docs/evidence/EV-B04.txt`](file:///docs/evidence/EV-B04.txt) |
| **EV-B05** | Call-Next Query & FIFO Order | WHERE status='WAITING' SKIP LOCKED | CONFIRMED — ข้าม CANCELLED โดยโครงสร้าง SQL | 2026-11-24T20:14:40+07:00 | `75068a6109439b7f` | [`docs/evidence/EV-B05.txt`](file:///docs/evidence/EV-B05.txt) |
| **EV-B06** | Deployment GIT_SHA Pipeline | ส่งผ่าน ARG เข้า ENV Cloud Run | CONFIRMED — deploy.yml:115, Dockerfile:59-60 | 2026-11-24T20:14:40+07:00 | `75068a6109439b7f` | [`docs/evidence/EV-B06.txt`](file:///docs/evidence/EV-B06.txt) |
| **EV-B07** | Part A Claims Verification | ตรวจหาหลักฐาน CHG-01, DEF-02, CHG-02 | AUDITED — CHG-01 มีหลักฐานเดิม; อีก 2 ตัว unverified | 2026-11-24T20:14:40+07:00 | `75068a6109439b7f` | [`docs/evidence/EV-B07.txt`](file:///docs/evidence/EV-B07.txt) |
| **EV-B08** | Client File Mapping | ยืนยันพาธจริงของหน้าระบบและ API | CONFIRMED — MyTicketPage, StaffCounterPage, etc. | 2026-11-24T20:14:40+07:00 | `75068a6109439b7f` | [`docs/evidence/EV-B08.txt`](file:///docs/evidence/EV-B08.txt) |
| **EV-B09** | Working Tree & Screenshots | ตรวจสถานะไฟล์ modified screenshots | REPORTED — Playwright เขียนทับรูป 18 ไฟล์ | 2026-11-24T20:14:40+07:00 | `75068a6109439b7f` | [`docs/evidence/EV-B09.txt`](file:///docs/evidence/EV-B09.txt) |
| **EV-D01** | Preflight Checks & Cancel Grep | ตรวจ status, fetch origin/main, cancel grep | PASS — Tracked ตรงเงื่อนไข, origin/main เท่ากัน, no cancel | 2026-11-24T21:50:10+07:00 | `830bdc575cfa14f2` | [`docs/evidence/EV-D01.txt`](file:///docs/evidence/EV-D01.txt) |
| **EV-D02** | AC-ID & API Error Code Coverage | ทุก AC ปรากฏใน STS; ทุก error code มี AC | PASS — 77/77 ACs ปรากฏอย่างน้อย 2 ครั้ง; Error codes ครบ | 2026-11-24T22:00:38+07:00 | `830bdc575cfa14f2` | [`docs/evidence/EV-D02.txt`](file:///docs/evidence/EV-D02.txt) |
| **EV-D03** | Pre-written Claims & Positive Control | ตรวจสอบ 100%, Verified, PASS, DONE ใน docs/ | PASS — ทุกบรรทัดที่เหลือมี EV-ID กำกับ (EV-A, EV-B, EV-D) | 2026-11-24T22:00:50+07:00 | `830bdc575cfa14f2` | [`docs/evidence/EV-D03.txt`](file:///docs/evidence/EV-D03.txt) |
| **EV-D04** | Envelope Normalization Audit | ตัด success:false / success:true ใน API payloads | PASS — ใช้เฉพาะ { data } และ { error }; zero success:false | 2026-11-24T22:00:59+07:00 | `830bdc575cfa14f2` | [`docs/evidence/EV-D04.txt`](file:///docs/evidence/EV-D04.txt) |
| **EV-D05** | R4 Test Integrity Check | ตรวจหา skip/only/xit/xdescribe/todo ใน tests | PASS — Exit code 1 ไม่พบการ skip หรือ weaken test เดิม | 2026-11-24T22:01:28+07:00 | `830bdc575cfa14f2` | [`docs/evidence/EV-D05.txt`](file:///docs/evidence/EV-D05.txt) |
| **EV-D06** | Diff Stat & Allowed Files Audit | เทียบ origin/main..HEAD และสถานะ working tree | PASS — แก้ไขเฉพาะ Allowed Files; zero code/test changes | 2026-11-24T22:01:35+07:00 | `830bdc575cfa14f2` | [`docs/evidence/EV-D06.txt`](file:///docs/evidence/EV-D06.txt) |

---

## สารบัญและโครงสร้างตามเกณฑ์ประเมิน (Rubric Navigation Table)

| ส่วนของเอกสาร (Rubric Part) | คะแนน | หัวข้อหลักและเนื้อหาที่ประเมิน |
| :--- | :---: | :--- |
| **Part A: Sprint 1 Continuity & Change Status** | **5** | ยืนยัน Critical Domain Journey, Change & Defect Register (Labs 5–7), การตัดสินใจทางวิศวกรรม |
| **Part B: Sprint 2 Contracts & Working Increment** | **25** | Engineering Contracts F-05, F-06, F-07 (API/UI/Data/AC/STS/DoD), Concurrency Guard, Data Shapes |
| **Part C: Sprint 3 Contracts & Working Progress** | **15** | Contracts F-08, F-09, S3-HARDEN + Genuine Working Progress (F-09 Contract & Invariants) |
| **Part D: Updated SRS, SDS, Traceability** | **10** | Traceability Matrix ฉบับเต็ม, AC Register (AC-01..47), SRS Decision Log, Known Limitations |
| **Part E: Integrated Candidate & Finish Plan** | **15** | Release Plan 2 ระยะ (`v0.4.0-sprint2` / `v0.5.0-d2-rc`), Cross-Feature Checks (CF-01..08), ตารางเวลา G0–G6 |
| **Section 4: Setup, Contributions & Governance** | — | Setup Summary, Safe Test Accounts (Sanitized), Contribution Table, AI-Use Declaration |
| **รวมทั้งหมด (Total)** | **70** | **ครอบคลุมเกณฑ์การประเมิน Project Deliverable 2 ครบทุกส่วน (**EV-A07**, **EV-A08**)** |

---

# Part A: Sprint 1 Continuity and Change Status (5 คะแนน)

## 1. การยืนยันความต่อเนื่องของ Sprint 1 (Sprint 1 Baseline & Continuity)
* **Accepted Baseline Release:** Tag `v0.1.0-sprint1` (Commit `d946159ba82a249c195730a3b702cf0f68e96e2d` — **EV-A01**)
* **Original Critical Domain Journey Verification:**
  เส้นทางการทำงานหลักของระบบที่ส่งมอบใน Sprint 1 (Collector Login → Join Queue `CRY` → Staff Login → Call Next → Verify & Start → Complete Unboxing) ได้รับการตรวจสอบบน Codebase ปัจจุบัน (`v0.3.0-lab7` / `a07a7be732b30cb75a22df7f30edfdc51521a87e` — **EV-B02**)
  * **Automated E2E Suite:** รันคำสั่ง `npx playwright test e2e/full-journey.spec.ts`
  * **ผลการรันจริง (EV-A07):** ผ่านทั้ง 3 Tests (Demo 1 ปกติ: 11.5s, Demo 2 ปฏิเสธตามกฎธุรกิจ: 774ms, Demo 3 ปฏิเสธสิทธิ์ข้าม Role: 784ms; รวม 3/3 passed) ไม่พบ Regression บนระบบปัจจุบัน

---

## 2. ทะเบียนการเปลี่ยนแปลงและข้อบกพร่อง (Change & Defect Register: Labs 5–7)

| Finding ID | แหล่งที่มา (Source) | Req / AC ที่กระทบ | ข้อค้นพบและสาเหตุทางวิศวกรรม | การแก้ไข (Resolution) | Accepted Decision | สถานะ / Tag ที่บรรจุ | ผลการทดสอบซ้ำ (Retest Verdict) |
| :---: | :---: | :---: | :--- | :--- | :---: | :---: | :---: |
| **DEF-01** | Lab 6 Blind UAT (Omega-3), Issue `#46` | `FR-04`, `AC-10` | `POST /api/tickets/join` ไม่ตรวจ `seriesId` เป็น required ส่ง body ว่างได้ 500 (เกิดบน Branch `defect/lab6-reintroduce-validation` เท่านั้น) | เพิ่ม Zod schema validation บน staging branch ของการทดลอง | `not-defect (staging only)` | **RESOLVED** (Closed `#46`, ไม่เข้า `main`) | `tested` (ยืนยันเฉพาะ Lab 6 staging) |
| **DEF-02** | Lab 6 Blind UAT (Omega-3), Issue `#47` | `FR-01`, `AC-03` | Login ไม่ส่ง password แล้ว API คืน HTTP 500 แทน HTTP 400 `VALIDATION_ERROR` | เพิ่ม Zod validation สำหรับ password ใน `auth.schema.ts`; `[RED]` → `[GREEN]` | `accepted` | **RESOLVED** (`v0.2.0-lab5` → hotfix merged via PR `#48` → `#50`, Commit `72e1bb5`) | `unverified — evidence pending` *(แหล่งหลักฐานอยู่นอก docs/ คือ GitHub Issue #47 comment 22 พ.ย. และ lab6/ ต้องนำเข้า docs/ ก่อน)* |
| **CHG-01** | Lab 5 CI/CD & GCP, Issues `#24`–`#32` | `NFR-05` | ติดตั้ง Dockerfile Multi-stage, GitHub Actions CI/CD with WIF, Cloud Run + Cloud SQL PostgreSQL | ติดตั้ง Cloud Run Job `popqueue-migrate` รัน Migration ก่อน deploy Service อัตโนมัติ | `accepted` | **RESOLVED** (Tag `v0.2.0-lab5`, Commit `bf52c9b`) | `tested` (มีหลักฐานเดิมของรุ่นก่อนใน `docs/labs/lab05/deployment.md` และภาพ `c05-test1/2/3`; ยังไม่ได้ re-verify บน `v0.3.0-lab7` / `v0.4.0`) |
| **CHG-02** | Lab 7 Maintenance, Issue `#52` | `FR-04`, `FR-05`, `BR-02`, `D-08` | ปรับปรุงกฎธุรกิจ `BR-02` จาก "ถือตั๋ว active ได้ 1 ใบทั้งระบบ" เป็น **"ถือตั๋ว active ได้ 1 ใบต่อซีรีส์"** | TA อนุมัติ (23 พ.ย. 15:30); Zero-Gap Migration `0003` สร้าง Partial Unique Index `(userId, seriesId)`; ปรับ `/my-ticket` คืน `tickets: []` | `accepted` (TA approved — **EV-A09**) | **RESOLVED** (Tag `v0.3.0-lab7`, Commit `a07a7be`; PRs `#57` → `#60`; Issues `#52`–`#54` closed) | `unverified — evidence pending` *(รอผลตรวจ Live Check บน Cloud Run จริง — Issue #55 ยัง OPEN)* |

---

## 3. Approved Baseline Revisions & Invariants
1. **Lab 6 Defect Fixes (DEF-01, DEF-02):** แก้ไข Validation บน branch เฉพาะกิจของ Lab 6 และ hotfix password validation บน `main` ผ่านกระบวนการ TDD ครบถ้วน
2. **Lab 7 BR-02 v2 (CHG-02):** รองรับพฤติกรรมร้าน Art Toy จริงที่มีเคาน์เตอร์แกะกล่องแยกตามซีรีส์ ลูกค้าสามารถรับบัตรคิวข้ามซีรีส์พร้อมกันได้ แต่ห้ามจองซ้ำในซีรีส์เดิม (Migration `0003` Zero-Gap: สร้าง Index ใหม่ก่อน Drop Index เก่า — **EV-A02**)
3. **Invariant ที่คงไว้ตลอด:**
   - Role-Based Access Control: `COLLECTOR` ถูกบล็อกด้วย HTTP `403 FORBIDDEN_ROLE` เมื่อเข้าถึง Endpoint ของ Staff (**EV-B01**)
   - Ownership Guard: ป้องกันการเข้าถึงหรือแก้ไขตั๋วของผู้อื่นด้วย HTTP `403 FORBIDDEN_OWNERSHIP`
   - State Machine: การเปลี่ยนสถานะต้องเป็นไปตาม State Lifecycle เท่านั้น ห้ามข้ามขั้นตอน
   - Atomic Daily Numbering: ออกเลขคิวต่อเนื่องรายวัน รีเซ็ตเที่ยงคืนเวลาไทย (`Asia/Bangkok`) ไม่นำเลขคิวที่ยกเลิกกลับมาใช้ซ้ำ (**EV-B03**)

---

# Part B: Sprint 2 Contracts and Working Increment (25 คะแนน)

ใน Sprint 2 นี้ ระบบ PopQueue ขยายขีดความสามารถหลัก (Core Expansion) 3 ฟีเจอร์:
1. **`F-05` Queue Cancellation:** ให้ลูกค้ายกเลิกคิวตนเองขณะรอได้
2. **`F-06` Server-Enforced 120s No-Show:** พนักงานตัดสิทธิ์ลูกค้าที่ไม่มาตามเรียกภายใน 120 วินาที ปลดล็อกพนักงานพ้นจาก `STAFF_BUSY`
3. **`F-07` Public Queue Display Board:** จอบอร์ดสาธารณะหน้าร้าน ไม่ต้องล็อกอิน และไม่มีข้อมูลส่วนบุคคลหลุด

> **Database & Schema Invariant (EV-A02, EV-A03):** ทั้ง `F-05` และ `F-06` ไม่ต้องสร้าง Migration ใหม่ เนื่องจากใน `schema.prisma` มี Enum `CANCELLED`, `NO_SHOW` และฟิลด์ `forfeitedAt` (nullable DateTime) รอไว้แล้ว และผลการตรวจสอบ Migration `0002` และ `0003` ยืนยันว่าทั้งสองสถานะนี้หลุดออกจาก Partial Unique Index ทั้งหมด 100% (**EV-A02**) ส่วน `F-07` เป็น Read-Only Endpoint

---

## 1. Feature Contract: F-05 Queue Cancellation (ลูกค้ายกเลิกตั๋วตนเอง)

### 1.1 Purpose & Scope
อนุญาตให้ Collector ยกเลิกตั๋วคิวที่ตนเองถืออยู่ขณะที่ตั๋วยังอยู่ในสถานะ `WAITING` เพื่อเปิดโอกาสให้ผู้อื่น และเพื่อปลดล็อกโควตาให้ตนเองสามารถกดรับบัตรคิวในซีรีส์เดิมได้ทันที  
* **นอก Scope:** ยกเลิกตั๋วที่ถูกเรียกแล้ว (`CALLED`), กำลังแกะกล่อง (`UNBOXING`), หรือจบแล้ว (`COMPLETED`, `NO_SHOW`, `CANCELLED`)  
* **DB / Migration Impact:** ไม่มี — ใช้ Enum `CANCELLED` และฟิลด์ `forfeitedAt` เดิม (**EV-A03**) ไม่เกิด P2002 Unique Constraint Violation เนื่องจากอยู่นอก Partial Unique Index (**EV-A02**)

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
* **Concurrency & Race Guard:** เพื่อป้องกัน Race Condition ระหว่าง Collector กดยกเลิกคิว (`cancel`) และ Box Master กดเรียกคิว (`call-next`) ในเวลาเดียวกัน:
  - ฝั่ง `cancel`: บังคับใช้ Atomic Conditional Update ที่ระดับ Database:
    ```typescript
    const result = await prisma.queueTicket.updateMany({
      where: { id: ticketId, userId: auth.userId, status: TicketStatus.WAITING },
      data: { status: TicketStatus.CANCELLED, forfeitedAt: clock.now() },
    });
    if (result.count === 0) {
      // ตรวจสอบสถานะปัจจุบันเพื่อส่ง 400 INVALID_STATE_TRANSITION หรือ 404/403 ให้ถูกต้อง
    }
    ```
  - ฝั่ง `call-next`: ปลอดภัยโดยโครงสร้างอยู่แล้วเนื่องจากใช้ SQL Row Lock `LIMIT 1 FOR UPDATE SKIP LOCKED` ร่วมกับเงื่อนไข `WHERE status = 'WAITING'` (**EV-B05**) ทำให้ตั๋วใบเดียวกันจะไม่มีทางถูกเปลี่ยนเป็นทั้ง `CANCELLED` และ `CALLED` พร้อมกันอย่างเด็ดขาด

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
  1. `401 UNAUTHENTICATED`: ไม่ส่ง Token, Token ปลอม หรือ Token หมดอายุ (**EV-B01**)
  2. `403 FORBIDDEN_ROLE`: ผู้เรียกมีบทบาทเป็น `BOX_MASTER` (**EV-B01**)
  3. `404 RESOURCE_NOT_FOUND`: ไม่พบตั๋ว ID ที่ระบุในระบบ
  4. `403 FORBIDDEN_OWNERSHIP`: ผู้เรียกไม่ใช่เจ้าของตั๋ว (`ticket.userId !== auth.userId`)
  5. `400 INVALID_STATE_TRANSITION`: ตั๋วไม่ได้อยู่ในสถานะ `WAITING` (เช่น ถูกยกเลิกซ้ำ หรืออยู่ในสถานะ `CALLED`, `UNBOXING`, `COMPLETED`, `NO_SHOW`)

### 1.5 UI Specification: หน้า /my-ticket
* **ตำแหน่งปุ่ม:** แสดงปุ่ม "ยกเลิกคิว" (Cancel Queue) บนการ์ดตั๋วแต่ละใบ เฉพาะตั๋วสถานะ `WAITING` เท่านั้น
* **Confirmation Modal:** แสดง Dialog ยืนยัน: "ต้องการยกเลิกคิว CRY-003 หรือไม่? เลขคิวนี้จะไม่สามารถนำกลับมาใช้ได้อีก"
* **After Cancel:** แสดง Toast สำเร็จ "ยกเลิกคิวสำเร็จ" และรีเฟรชรายการตั๋ว
* **Empty State:** หากยกเลิกตั๋วใบสุดท้ายในมือ ระบบได้รับ `404 NO_ACTIVE_TICKET` จาก API (**EV-B04**) หน้าจอต้องแสดง UI Empty State สะอาดตา ("ไม่มีคิวที่กำลังรอ") โดย **ต้องไม่แสดง Error Alert สีแดง**
* **Error Handling:** จัดการข้อผิดพลาดด้วย Error Toast เฉพาะรหัส `400`, `403`, `404` (ไม่มีรหัส 409)

### 1.6 Numbered Acceptance Criteria (AC: F-05)
* [ ] **AC-41.1 (Valid Cancellation):** Collector ที่มีตั๋ว `WAITING` กดยกเลิกสำเร็จ ได้รับ HTTP 200, สถานะเปลี่ยนเป็น `CANCELLED`, บันทึก `forfeitedAt` เป็นเวลาปัจจุบันจาก Application Clock
* [ ] **AC-41.2 (Quota Release & Immediate Re-join):** หลังยกเลิกสำเร็จ Collector สามารถกด `POST /api/tickets/join` เข้าซีรีส์เดิมได้ทันที ได้รับ HTTP 201 และได้เลขคิวใหม่ท้ายแถวโดยไม่ติดข้อผิดพลาด `409 DUPLICATE_ACTIVE_QUEUE` (**EV-A02**)
* [ ] **AC-41.3 (Monotonic Counter & WaitingAhead Update):** เลขคิวที่ถูกยกเลิก (เช่น `CRY-001`) จะถูกข้ามถาวร คิวถัดไปที่กดเข้ามาจะได้รับเลขใหม่ (`CRY-002`) (**EV-B03**) และตั๋วคิวที่อยู่ข้างหลังจะมีค่า `waitingAhead` ลดลง 1 ทันที
* [ ] **AC-41.4 (Forbidden Ownership Rejection):** Collector A พยายามส่งคำขอยกเลิกตั๋วของ Collector B ต้องถูกปฏิเสธด้วย HTTP `403 FORBIDDEN_OWNERSHIP` ตั๋วของ B คงสถานะ `WAITING`
* [ ] **AC-41.5 (Invalid State Transition on Non-Waiting):** กดยกเลิกตั๋วที่สถานะเป็น `CALLED`, `UNBOXING`, `COMPLETED`, `NO_SHOW` หรือยกเลิกซ้ำบนตั๋ว `CANCELLED` ต้องได้รับ HTTP `400 INVALID_STATE_TRANSITION`
* [ ] **AC-41.6 (Structural Call-Next Exclusion):** ตั๋วสถานะ `CANCELLED` จะไม่มีทางถูกเรียกโดย `POST /api/staff/call-next` เนื่องจากคำสั่ง SQL มีเงื่อนไข `WHERE status = 'WAITING'` ชัดเจน (**EV-B05**)
* [ ] **AC-41.7 (Multi-Ticket Holding Independence):** Collector ที่ถือตั๋วหลายซีรีส์พร้อมกัน (ตาม BR-02 v2) เมื่อยกเลิกตั๋วใบหนึ่ง ตั๋วใบอื่นใน `data.tickets` ยังคงสถานะเดิมครบถ้วน
* [ ] **AC-41.8 (Cancel vs Call-Next Race Concurrency):** คำขอยกเลิกคิวและคำขอเรียกคิวที่ส่งเข้ามาในเวลาเดียวกันอย่างแม่นยำ ต้องมีเพียงคำขอเดียวที่สำเร็จ อีกคำขอต้องได้รับ Error สถานะที่ถูกต้อง โดยไม่มีทางเกิดตั๋วที่เป็นทั้ง `CANCELLED` และ `CALLED`

### 1.7 Software Test Specification (STS: TEST-41)
| Test ID | Covered AC | Level | Test File | Preconditions | Inputs | Expected Output |
| :---: | :---: | :---: | :--- | :--- | :--- | :--- |
| **TEST-41A** | `AC-41.1` | Integration | `server/tests/api/cancel.test.ts` *(planned)* | Collector 1 ล็อกอิน, ถือตั๋ว `CRY-001` (`WAITING`) | `POST /api/tickets/:id/cancel` | HTTP `200`, `status: "CANCELLED"`, `forfeitedAt` ≠ null |
| **TEST-41B** | `AC-41.2`, `AC-41.3` | Integration | `server/tests/api/cancel.test.ts` *(planned)* | เพิ่งยกเลิก `CRY-001` สำเร็จ | `POST /api/tickets/join` ซีรีส์ `CRY` | HTTP `201`, `displayNumber: "CRY-002"`, active tickets = 1 |
| **TEST-41C** | `AC-41.4` | Security | `server/tests/api/cancel.test.ts` *(planned)* | Collector 1 ถือ `CRY-001`, Collector 2 ล็อกอิน | Collector 2 `POST /cancel` ตั๋ว 1 | HTTP `403 FORBIDDEN_OWNERSHIP`, ตั๋ว 1 คงสถานะ `WAITING` |
| **TEST-41D** | `AC-41.5` | Boundary | `server/tests/api/cancel.test.ts` *(planned)* | ตั๋วถูกเรียกแล้ว (`CALLED`) | Collector 1 `POST /cancel` | HTTP `400 INVALID_STATE_TRANSITION`, ตั๋วคงสถานะ `CALLED` |
| **TEST-41E** | `AC-41.5` | Unit | `server/tests/unit/state-machine.test.ts` | State machine transition validator | ตรวจทุกสถานะ → `CANCELLED` | อนุญาตเฉพาะ `WAITING`; ปฏิเสธสถานะอื่นทั้งหมด |
| **TEST-41F** | `AC-41.6` | Integration | `server/tests/api/cancel.test.ts` *(planned)* | มีตั๋ว `CANCELLED` 1 ใบ และ `WAITING` 1 ใบ | Box Master `POST /api/staff/call-next` | HTTP `200`, เรียกได้เฉพาะตั๋ว `WAITING`, ข้ามใบ `CANCELLED` |
| **TEST-41G** | `AC-41.7` | Integration | `server/tests/api/cancel.test.ts` *(planned)* | Collector ถือตั๋ว `CRY` และ `LAB` พร้อมกัน | `POST /cancel` ตั๋ว `CRY` | HTTP `200`, ตั๋ว `LAB` ยังคงอยู่ใน `data.tickets` |
| **TEST-41H** | `AC-41.8` | Concurrency | `server/tests/concurrency/cancel-race.test.ts` *(planned)* | ตั๋ว `WAITING`, ยิง Cancel และ Call-Next พร้อมกัน | Parallel Promise.all() | สำเร็จ 1 คำขอ, ล้มเหลว 1 คำขอ, ไม่มี Inconsistent state |

### 1.8 Definition of Done (DoD) — F-05
- [ ] โค้ด Service/Controller/Route ครบถ้วน พร้อม Deterministic Error Handling
- [ ] บันทึก `[RED]` commit SHA และ `[GREEN]` commit SHA ตามระเบียบ TDD
- [ ] Regression Suite เดิม (194 tests) รันผ่าน 100% ไม่มี skip/weaken (**EV-A07**)
- [ ] UI ปุ่ม Cancel, Modal, Toast และ Empty State ทำงานสมบูรณ์บนหน้า `/my-ticket`
- [ ] PR ผ่านการ Review และ Merge เข้าสู่ `sprint2-staging`

---

## 2. Feature Contract: F-06 Server-Enforced 120s No-Show (ตัดสิทธิ์ลูกค้าไม่มาตามเรียก)

### 2.1 Purpose & Scope
แก้ปัญหาคอขวดของ Sprint 1 (G-02 / D-09: ลูกค้าไม่มาแสดงตัวทำให้ Box Master ติดสถานะ `STAFF_BUSY` ค้างถาวร): เมื่อตั๋วถูกเรียก (`CALLED`) ระบบจะเริ่มนับเวลาจาก `calledAt` หากเกิน `NO_SHOW_SECONDS` (120 วินาที) แล้วลูกค้าไม่มาแสดงตัว Box Master สามารถกดตัดสิทธิ์ No-Show เพื่อปลดล็อกตนเองให้สามารถเรียกคิวถัดไปได้  
* **ขอบเขตการทำงาน:** Sprint 2 รองรับเฉพาะการกด **Manual Trigger โดย Box Master ประจำสถานีเท่านั้น** (Auto No-Show อัตโนมัติโดยไม่มีคนกด เป็นงานนอกขอบเขตและบันทึกเป็น Known Limitation)  
* **DB / Migration Impact:** ไม่มี — ใช้ Enum `NO_SHOW` และฟิลด์ `forfeitedAt` เดิม (**EV-A03**) ตั๋วที่ถูกตัดสิทธิ์จะหลุดจาก `unique_active_staff_ticket` ทำให้พนักงานหลุดจาก `STAFF_BUSY` ทันที (**EV-A02**)

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
* **Concurrency Guard:** ป้องกัน Race Condition ระหว่าง Box Master กด No-Show และกด Start Unboxing พร้อมกัน ด้วย Atomic Conditional Update:
  ```typescript
  const result = await prisma.queueTicket.updateMany({
    where: { id: ticketId, status: TicketStatus.CALLED, handledByStaffId: staffId },
    data: { status: TicketStatus.NO_SHOW, forfeitedAt: clock.now() },
  });
  ```

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
* **Deterministic Error Handling Order (สอดคล้องกับโค้ด Sprint 1 — EV-A04):**
  1. `401 UNAUTHENTICATED`: ไม่ได้ยืนยันตัวตน (**EV-B01**)
  2. `403 FORBIDDEN_ROLE`: ผู้เรียกไม่ใช่ `BOX_MASTER` (**EV-B01**)
  3. `404 RESOURCE_NOT_FOUND`: ไม่พบตั๋ว ID ที่ระบุ
  4. `403 FORBIDDEN_SERIES`: Box Master ไม่ได้รับมอบหมายให้ดูแลซีรีส์ของตั๋วใบนี้
  5. `403 FORBIDDEN_NOT_HANDLER`: พนักงานคนนี้ไม่ใช่ผู้ที่กด Call ตั๋วนี้ไว้ (`ticket.handledByStaffId !== null && ticket.handledByStaffId !== staffId`)
  6. `400 INVALID_STATE_TRANSITION`: ตั๋วไม่ได้อยู่ในสถานะ `CALLED` *(กรณีตั๋ว `WAITING` ซึ่ง `handledByStaffId === null` จะผ่าน null-guard มาตกที่ข้อนี้และได้รับ 400 — **EV-A04**)*
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

### 2.5 ServerNow Synchronization & UI Specification
เพื่อป้องกันปัญหา Client Clock Skew (นาฬิกาของเครื่องลูกค้าหรือพนักงานเดินไม่ตรงกับเซิร์ฟเวอร์):
1. **API Response Enhancement:** เพิ่มฟิลด์ `serverNow: string` (ISO format จาก `clock.now()`) ใน:
   - `POST /api/staff/call-next`:
     ```json
     {
       "data": {
         "ticketId": "uuid-ticket",
         "displayNumber": "CRY-001",
         "status": "CALLED",
         "handledByStaffId": "uuid-staff",
         "calledAt": "2026-11-24T12:00:00.000Z",
         "serverNow": "2026-11-24T12:00:00.000Z"
       }
     }
     ```
   - `GET /api/tickets/my-ticket`:
     ```json
     {
       "data": {
         "serverNow": "2026-11-24T12:00:15.000Z",
         "ticket": { "calledAt": "2026-11-24T12:00:00.000Z", "..." : "..." },
         "tickets": [ "..." ]
       }
     }
     ```
   - `GET /api/staff/tickets` (Staff Console Overview Endpoint):
     ```json
     {
       "data": {
         "serverNow": "2026-11-24T12:00:15.000Z",
         "series": [ "..." ]
       }
     }
     ```
2. **Client Countdown Calculation:** คอมโพเนนต์ `CountdownTimer.tsx` คำนวณเวลาที่เหลือโดยใช้สูตร:  
   `remainingSeconds = Math.max(0, 120 - Math.floor((new Date(serverNow) - new Date(calledAt)) / 1000))`  
   โดยไม่อิงกับ `Date.now()` ของเครื่องผู้ใช้
3. **Staff UI Behavior:**
   - เมื่อ `remainingSeconds > 0`: ปุ่ม "ตัดสิทธิ์ No-Show" ถูกปิดใช้งาน (disabled, สีเทา) แสดงข้อความ "รออีก XX วินาที"
   - เมื่อ `remainingSeconds === 0`: ปุ่มเปิดใช้งาน (enabled, สีแดง) แสดงข้อความ "ตัดสิทธิ์ No-Show"
   - เมื่อกดปุ่ม: แสดง Confirmation Modal ก่อนยิง API

### 2.6 Numbered Acceptance Criteria (AC: F-06)
* [ ] **AC-42.1 (Premature No-Show Rejection):** Box Master พยายามตัดสิทธิ์ก่อนเวลาครบ 120 วินาที (เช่น ผ่านไป 45 วินาที) ต้องได้รับ HTTP `400 NO_SHOW_WINDOW_NOT_EXPIRED`, ตั๋วคงสถานะ `CALLED` และพนักงานยังคงติด `STAFF_BUSY`
* [ ] **AC-42.2 (Clock Boundary Verification):**
  - ผ่านไป 119 วินาที (`Δt = 119s`) → HTTP `400 NO_SHOW_WINDOW_NOT_EXPIRED`
  - ผ่านไป 120 วินาที (`Δt = 120s`) → HTTP `200 OK` (สำเร็จ)
  - ผ่านไป 121 วินาที (`Δt = 121s`) → HTTP `200 OK` (สำเร็จ)
* [ ] **AC-43.1 (Successful No-Show Transition):** เมื่อเวลาผ่านไป ≥ 120 วินาที Box Master ผู้รับผิดชอบกดตัดสิทธิ์สำเร็จ ได้รับ HTTP 200, ตั๋วเปลี่ยนเป็น `NO_SHOW`, บันทึก `forfeitedAt` เป็นเวลาปัจจุบันจาก Application Clock
* [ ] **AC-43.2 (Staff Release from STAFF_BUSY):** ก่อน No-Show สำเร็จ พนักงานเรียก `call-next` จะติด `409 STAFF_BUSY`; ทันทีที่ตั๋วเปลี่ยนเป็น `NO_SHOW` พนักงานหลุดจาก `unique_active_staff_ticket` (**EV-A02**) และสามารถเรียก `call-next` ได้รับ HTTP 200 และได้ตั๋วถัดไปทันที
* [ ] **AC-43.3 (Handler Exclusive Enforcement):** Box Master B พยายามกด No-Show ตั๋วที่ Box Master A เป็นผู้เรียกไว้ ต้องได้รับ HTTP `403 FORBIDDEN_NOT_HANDLER` แม้เวลาจะเกิน 120 วินาทีแล้วก็ตาม
* [ ] **AC-43.4 (Waiting Ticket Rejection):** การพยายามกด No-Show บนตั๋วสถานะ `WAITING` (ซึ่ง `handledByStaffId === null`) ต้องได้รับ HTTP `400 INVALID_STATE_TRANSITION` (**EV-A04**)
* [ ] **AC-43.5 (No-Show vs Start-Unboxing Concurrency):** คำขอ No-Show และ Start Unboxing ที่ส่งเข้ามาชนกัน ต้องมีเพียงคำขอเดียวที่สำเร็จ อีกคำขอต้องได้รับ Error สถานะที่ถูกต้อง
* [ ] **AC-43.6 (Collector Immediate Re-join After No-Show):** Collector ที่ถูกตัดสิทธิ์ No-Show สามารถกด `POST /api/tickets/join` เพื่อรับบัตรคิวในซีรีส์เดิมได้ทันที และได้รับเลขคิวใหม่ท้ายแถวโดยไม่ติด Unique Constraint Violation (**EV-A02**)

### 2.7 Software Test Specification (STS: TEST-42, TEST-43)
| Test ID | Covered AC | Level | Test File | Preconditions | Inputs | Expected Output |
| :---: | :---: | :---: | :--- | :--- | :--- | :--- |
| **TEST-42A** | `AC-42.1`, `AC-42.2` | Boundary | `server/tests/api/no-show.test.ts` *(planned)* | Box Master เรียกตั๋ว, FakeClock +119s | `POST /api/staff/tickets/:id/no-show` | HTTP `400`, `code: "NO_SHOW_WINDOW_NOT_EXPIRED"`, `remainingSeconds: 1` |
| **TEST-42B** | `AC-42.2` | Boundary | `server/tests/api/no-show.test.ts` *(planned)* | FakeClock +120s ตรง | `POST /api/staff/tickets/:id/no-show` | HTTP `200`, `status: "NO_SHOW"`, `forfeitedAt` recorded |
| **TEST-42C** | `AC-42.2` | Boundary | `server/tests/api/no-show.test.ts` *(planned)* | FakeClock +121s | `POST /api/staff/tickets/:id/no-show` | HTTP `200`, `status: "NO_SHOW"` |
| **TEST-43A** | `AC-43.1`, `AC-43.2` | Integration | `server/tests/api/no-show.test.ts` *(planned)* | ก่อน No-Show (<120s) | Box Master `POST /api/staff/call-next` | HTTP `409 STAFF_BUSY` |
| **TEST-43B** | `AC-43.1`, `AC-43.2` | Integration | `server/tests/api/no-show.test.ts` *(planned)* | หลัง No-Show สำเร็จ (≥120s) | Box Master `POST /api/staff/call-next` | HTTP `200`, ได้ตั๋วใบถัดไป, หลุด BUSY สำเร็จ |
| **TEST-43C** | `AC-43.3` | Security | `server/tests/api/no-show.test.ts` *(planned)* | FakeClock +150s, Box Master B ล็อกอิน | Box Master B `POST /no-show` ตั๋วของ A | HTTP `403 FORBIDDEN_NOT_HANDLER`, ตั๋วยังเป็น `CALLED` |
| **TEST-43D** | `AC-43.4` | Validation | `server/tests/api/no-show.test.ts` *(planned)* | ตั๋วสถานะ `WAITING` | Box Master `POST /no-show` ตั๋วนี้ | HTTP `400 INVALID_STATE_TRANSITION` |
| **TEST-43E** | `AC-43.6` | Integration | `server/tests/api/no-show.test.ts` *(planned)* | Collector ถูกตัด No-Show | Collector `POST /api/tickets/join` ซีรีส์เดิม | HTTP `201`, ได้เลขคิวใหม่ท้ายแถว |
| **TEST-43F** | `AC-43.5` | Concurrency | `server/tests/concurrency/no-show-race.test.ts` *(planned)* | ตั๋ว `CALLED`, No-Show ชนกับ Start-Unboxing | Parallel Promise.all() | สำเร็จ 1 คำขอ, ปลอดภัยตาม ACID |

### 2.8 Definition of Done (DoD) — F-06
- [ ] Service method `noShow` ใน `staff.service.ts` พร้อม FakeClock boundary check
- [ ] บันทึก `[RED]` commit SHA และ `[GREEN]` commit SHA
- [ ] Regression Suite เดิม (194 tests) รันผ่าน 100% (**EV-A07**)
- [ ] UI CountdownTimer, Disabled/Enabled Button, Modal และ Toast บน Staff Console
- [ ] เพิ่ม `serverNow` ใน response ของ API 3 ตัวครบถ้วน

---

## 3. Feature Contract: F-07 Public Queue Display Board (จอบอร์ดแสดงคิวสาธารณะหน้าร้าน)

### 3.1 Purpose & Scope
จัดเตรียมหน้าจอแสดงผลคิวสาธารณะสำหรับติดตั้งหน้าร้าน Art Toy เพื่อให้ลูกค้ามองเห็นคิวที่กำลังให้บริการและคิวรอถัดไปได้จากระยะไกล โดยไม่ต้องล็อกอิน  
* **ข้อกำหนดความเป็นส่วนตัวขั้นเด็ดขาด (NFR-02):** ต้องไม่มีข้อมูลส่วนบุคคล (Zero PII) ใน API Response เด็ดขาด ใช้ Prisma `select` projection ที่ระดับ Database Query ห้าม Query ออกมาแล้วตัดทิ้ง  
* **ความสอดคล้องของชุดข้อมูล (Dataset & FIFO Consistency — FACTS F6):** เพื่อให้รายการ "คิวถัดไป" (Up Next) ตรงกับสิ่งที่ Box Master จะกดเรียกจริง บอร์ดสาธารณะต้องใช้การเรียงลำดับและชุดข้อมูลเดียวกับ `call-next` คือ:  
  `ORDER BY queueDate ASC, queueNumber ASC` โดย **ไม่กรองวันที่** (**EV-B05**)  
* **Known Limitation G-07 (Overnight Leftover Tickets):** หากมีตั๋วค้างข้ามคืน ตั๋วของวันก่อนหน้าจะแสดงในหมวด Up Next ก่อนตั๋วของวันนี้ และอาจเกิดเลขคิว `displayNumber` ซ้ำกันข้ามวันเนื่องจากตัวนับรีเซ็ตรายวัน (**EV-B03**) ซึ่งเป็นพฤติกรรมที่ยอมรับได้ในข้อจำกัดทางสถาปัตยกรรมปัจจุบัน (บันทึก ณ วันที่ 2026-11-24)

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
  *คำชี้แจงโครงสร้าง:*
  - `upNext`: คืนรายการตั๋ว `WAITING` สูงสุดไม่เกิน `UP_NEXT_LIMIT` (5 ใบ)
  - `waitingCount`: จำนวนตั๋ว `WAITING` ทั้งหมดของซีรีส์นั้นจริง
  - `nowServing`: รายการตั๋วสถานะ `CALLED` หรือ `UNBOXING`
  - ตั๋วสถานะ `COMPLETED`, `CANCELLED`, `NO_SHOW` ถูกตัดออกจากทุกหมวด

### 3.4 UI Specification: หน้า /board
* **Route:** `/board` (Public Route ไม่แสดงปุ่ม Login)
* **Layout:** Kiosk-style full-screen, Art Toy theme, ตัวอักษรใหญ่อ่านง่ายจากระยะ 3 เมตร
* **Integer Sorting Rule:** จัดเรียงลำดับคิวด้วย `queueNumber` (Int) ไม่เรียงด้วยตัวอักษรสตริง เพื่อป้องกันข้อผิดพลาดกรณีเลขคิว 9 และ 10
* **Closed Series Handling:** หากซีรีส์ถูกตั้งเป็น `isActive: false` แต่ยังมีตั๋ว Active ตกค้างอยู่ ให้แสดงการ์ดซีรีส์บนบอร์ดพร้อมป้าย Badge สีส้ม "ปิดรับคิวใหม่" (Closed for new joins) เพื่อให้บริการตั๋วเดิมจนจบ
* **Auto-Refresh:** Polling API ทุก 3 วินาที (3000ms)
* **Responsive:** รองรับจอ TV แนวนอน 1920×1080, Tablet 768px, และ Mobile 375px
* **Empty State:** เมื่อไม่มีตั๋ว Active ในซีรีส์ แสดงข้อความ "ไม่มีคิวรอในขณะนี้"

### 3.5 Numbered Acceptance Criteria (AC: F-07)
* [ ] **AC-44.1 (Unauthenticated Public Access):** เรียก `GET /api/public/queue-board` โดยไม่ส่ง Token เข้าถึงได้สำเร็จ (HTTP 200 OK)
* [ ] **AC-44.2 (Zero PII Assertion on Response Values):** ตรวจสอบ JSON Response body ทุกระดับ ต้องไม่พบข้อมูลส่วนบุคคลใดๆ ทั้งในแง่คีย์และค่า (Value String Check): ไม่พบ `userId`, `username`, `passwordHash`, `fullName`, `tokenVersion`, `handledByStaffId` ใน `JSON.stringify(body)`
* [ ] **AC-44.3 (UpNext Limit & Waiting Count Accuracy):** ในกรณีที่มีคิวรอมากกว่า 5 ตั๋ว รายการ `upNext` ต้องมีจำนวนเท่ากับ `UP_NEXT_LIMIT` (5 ใบพอดี) และค่า `waitingCount` ต้องแสดงจำนวนคิวรอจริงทั้งหมด
* [ ] **AC-44.4 (Integer Sorting Assertion):** รายการใน `upNext` ต้องเรียงตาม `queueNumber` (ตัวเลขจำนวนเต็ม) อย่างถูกต้อง โดยคิวหมายเลข 9 ต้องแสดงก่อนหมายเลข 10
* [ ] **AC-44.5 (Closed Series Visibility with Badge):** ซีรีส์ที่ปิดรับคิว (`isActive: false`) หากยังมีตั๋ว Active ค้างอยู่ ต้องแสดงบนบอร์ดพร้อมป้าย "ปิดรับคิว" (`isActive: false`)
* [ ] **AC-44.6 (Excluded Status Filtering):** ตั๋วสถานะ `NO_SHOW`, `CANCELLED`, และ `COMPLETED` ต้องไม่ปรากฏใน `nowServing`, `upNext`, หรือ `waitingCount`

### 3.6 Software Test Specification (STS: TEST-44)
| Test ID | Covered AC | Level | Test File | Preconditions | Inputs | Expected Output |
| :---: | :---: | :---: | :--- | :--- | :--- | :--- |
| **TEST-44A** | `AC-44.1`, `AC-44.2`, `AC-44.6` | Security | `server/tests/api/public-board.test.ts` *(planned)* | มีตั๋ว WAITING, CALLED, UNBOXING, COMPLETED, NO_SHOW, CANCELLED | `GET /api/public/queue-board` ไม่ส่ง auth | HTTP `200`, ค่า Seed username/name ไม่ปรากฏใน body string, ตั๋ว inactive ไม่แสดง |
| **TEST-44B** | `AC-44.3` | Integration | `server/tests/api/public-board.test.ts` *(planned)* | ซีรีส์ CRY มีคิวรอ 8 ตั๋ว (คิว 1..8) | `GET /api/public/queue-board` | `upNext.length === 5`, `waitingCount === 8`, เรียง 1 ถึง 5 |
| **TEST-44C** | `AC-44.1` | E2E | `e2e/public-board.spec.ts` *(planned)* | หน้า `/board` เปิดอยู่, เปลี่ยนสถานะตั๋วผ่าน API | รอ ≤ 4 วินาที | หน้าจอ `/board` อัปเดตแสดงสถานะใหม่โดยอัตโนมัติ (พิสูจน์ 3s polling) |
| **TEST-44D** | `AC-44.5` | Integration | `server/tests/api/public-board.test.ts` *(planned)* | ซีรีส์ CRY ปิด (`isActive: false`) แต่มีคิวรอ 1 ใบ | `GET /api/public/queue-board` | การ์ด CRY ปรากฏบนบอร์ด, `isActive: false`, `waitingCount === 1` |
| **TEST-44E** | `AC-44.4` | Boundary | `server/tests/api/public-board.test.ts` *(planned)* | มีตั๋วคิว 9 และคิว 10 ในระบบ | `GET /api/public/queue-board` | `upNext[0].queueNumber === 9`, `upNext[1].queueNumber === 10` |

### 3.7 Definition of Done (DoD) — F-07
- [ ] Route `/api/public/queue-board` เป็น Public ไม่ผ่าน auth middleware
- [ ] ใช้ Prisma `select` projection ปลอด PII ทั้งหมด (**EV-A07**, **TEST-44A**)
- [ ] บันทึก `[RED]` → `[GREEN]` commit chain
- [ ] หน้าเว็บ UI `/board` Kiosk-style Responsive + Polling 3 วินาที
- [ ] PR Review และ CI ผ่านครบถ้วน

---

# Part C: Sprint 3 Contracts and Working Progress (15 คะแนน)

## 1. Feature Contract: F-08 Daily Service Analytics (สถิติบริการประจำวัน)

### 1.1 Purpose & Scope
สรุปข้อมูลเชิงสถิติเกี่ยวกับประสิทธิภาพการให้บริการประจำวัน เพื่อให้ผู้จัดการร้านประเมินจำนวนคิว อัตรา No-Show และเวลารอเฉลี่ย  
* **Actor & Permission:** `BOX_MASTER` เท่านั้น (`403 FORBIDDEN_ROLE` สำหรับ Collector)  
* **นิยามของ "วัน" (Queue Date Partition — FACTS F3):** สถิติจะถูกกรองและจัดกลุ่มตามฟิลด์ **`queueDate`** (`Asia/Bangkok` Date string) ซึ่งเป็นฟิลด์หลักในการออกเลขคิวประจำวัน (**EV-B03**) ไม่ใช้ `createdAt` เพื่อป้องกันปัญหา Timezone drift

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
  1. `totalTickets` = `completedCount (18) + cancelledCount (3) + noShowCount (2) + waitingCount (2)` = **25**
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
| **TEST-45D** | `AC-45.1`, `AC-45.3` | Unit/Prisma | `server/tests/api/analytics.test.ts` *(planned)* | Seed ตั๋วด้วย Prisma โดยตรงพร้อมกำหนด Timestamps คงที่ | ยืนยันผลคำนวณเฉลี่ยตรงกับผลลัพธ์คำนวณมือ (ไม่ใช้ FakeClock กับ `createdAt` — **EV-B03**) |
| **TEST-45E** | `AC-45.4` | Validation | `server/tests/api/analytics.test.ts` *(planned)* | `date=2026-99-99` | HTTP `400 VALIDATION_ERROR` |

---

## 2. Feature Contract: F-09 Series Availability Control (เปิด-ปิดซีรีส์) — Genuine Working Progress

ทีมงานเลือกพัฒนา **`F-09`** เป็น Genuine Working Progress ในการส่งมอบครั้งนี้ เนื่องจากมีฟิลด์ `Series.isActive` และกฎ `BR-09` / `AC-12` (ปฏิเสธ Join ซีรีส์ที่ปิด → `409 SERIES_CLOSED`) รองรับอยู่แล้วตั้งแต่ Sprint 1

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
* [ ] **AC-46.4 (Existing Tickets Continuity):** หลังซีรีส์ปิด ตั๋ว `WAITING`, `CALLED`, `UNBOXING` เดิมยังคงดำเนินการต่อจนจบได้ตามปกติ
* [ ] **AC-46.5 (Idempotency & Re-open):** ส่งสถานะเดิมซ้ำได้รับ HTTP 200 (Idempotent); เปิดกลับ `isActive: true` ทำให้ Collector กลับมา Join ได้ปกติ

| Test ID | Covered AC | Level | Test File | Inputs | Expected Output |
| :---: | :---: | :---: | :--- | :--- | :--- |
| **TEST-46A** | `AC-46.1` | Integration | `server/tests/api/series-toggle.test.ts` *(planned)* | Box Master CRY: `PATCH /status` `{ isActive: false }` | HTTP `200`, `isActive: false` |
| **TEST-46B** | `AC-46.2` | Integration | `server/tests/api/series-toggle.test.ts` *(planned)* | ซีรีส์ CRY ปิดอยู่, Collector `POST /api/tickets/join` | HTTP `409 SERIES_CLOSED` (สอดคล้อง AC-12) |
| **TEST-46C** | `AC-46.3` | Security | `server/tests/api/series-toggle.test.ts` *(planned)* | Box Master LAB พยายามปิดซีรีส์ CRY | HTTP `403 FORBIDDEN_SERIES` |
| **TEST-46D** | `AC-46.4` | Continuity | `server/tests/api/series-toggle.test.ts` *(planned)* | ซีรีส์ CRY ปิด, แต่มีตั๋ว WAITING ค้างอยู่ | Staff `POST /call-next` → สำเร็จ ได้รับ HTTP 200 |
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
* **Known Limitation:** ใช้ In-Memory Counter ซึ่งนับแยกราย Container Instance บน Cloud Run

### 3.2 Acceptance Criteria (AC: S3-HARDEN) & Test Spec (TEST-47)
* [ ] **AC-47.1 (Rate Limit Enforcement):** ส่งคำขอ Login ครั้งที่ 11 จาก IP เดียวกันภายใน Window ต้องได้รับ HTTP `429 RATE_LIMIT_EXCEEDED` พร้อม Header `Retry-After`
* [ ] **AC-47.2 (IP Isolation under Multi-Hop):** คำขอจาก IP A ที่ชน Limit ต้องไม่ส่งผลกระทบต่อคำขอจาก IP B
* [ ] **AC-47.3 (Public & Health Exemption):** เรียก `/api/health` หรือ `/api/public/queue-board` ต่อเนื่องเกิน 10 ครั้ง ต้องไม่ติด 429

| Test ID | Covered AC | Level | Test File | Inputs | Expected Output |
| :---: | :---: | :---: | :--- | :--- | :--- |
| **TEST-47A** | `AC-47.1` | Security | `server/tests/security/rate-limit.test.ts` *(planned)* | ยิง `POST /api/auth/login` 11 ครั้งจาก IP เดียวกัน | ครั้งที่ 1–10: 200/401; ครั้งที่ 11: HTTP `429` |
| **TEST-47B** | `AC-47.1` | Boundary | `server/tests/security/rate-limit.test.ts` *(planned)* | หลัง Window reset | ยิง Login อีกครั้ง → สำเร็จ ไม่ติด 429 |
| **TEST-47C** | `AC-47.3` | Exemption | `server/tests/security/rate-limit.test.ts` *(planned)* | ยิง `GET /api/public/queue-board` 20 ครั้ง | HTTP `200` ทุกครั้ง ไม่มี 429 |
| **TEST-47D** | `AC-47.2` | Integration | `server/tests/security/rate-limit.test.ts` *(planned)* | ส่ง X-Forwarded-For: Client A ชน limit, Client B ทดสอบ | Client A ได้ 429; Client B ได้รับ 200/401 ไม่กระทบ |

---

# Part D: Updated SRS, SDS, Feature Inventory & Traceability (10 คะแนน)

## 1. Feature Inventory (Current Status)

| Feature ID | Feature Name | Target Sprint | Status | Implementation Artifacts | Verification Status |
| :---: | :--- | :---: | :---: | :--- | :---: |
| **F-01** | Authentication & Role-Based Access | 1 | **Released** | `auth.service.ts`, `auth.ts`, `LoginModal.tsx` | Tested (`v0.1.0-sprint1` — **EV-A01**) |
| **F-02** | Queue Discovery & Safe Joining | 1 (rev Lab 7) | **Released** | `ticket.service.ts`, `SeriesPage.tsx`, Migration 0003 | Tested (`v0.3.0-lab7` — **EV-A02**) |
| **F-03** | Staff Counter & Call/Complete | 1 | **Released** | `staff.service.ts`, `StaffCounterPage.tsx` | Tested (`v0.1.0-sprint1` — **EV-A01**) |
| **F-04** | Ticket Inspection & Ownership | 1 (ext Lab 7) | **Released** | `ticket.service.ts`, `MyTicketPage.tsx` | Tested (`v0.3.0-lab7` — **EV-B04**) |
| **F-05** | Queue Cancellation | **2** | **Contract Ready** | `ticket.service.ts`, `MyTicketPage.tsx` | `planned (no evidence yet)` |
| **F-06** | Server-Enforced 120s No-Show | **2** | **Contract Ready** | `staff.service.ts`, `CountdownTimer.tsx` | `planned (no evidence yet)` |
| **F-07** | Public Queue Display Board | **2** | **Contract Ready** | `public.service.ts`, `/board` page | `planned (no evidence yet)` |
| **F-08** | Daily Service Analytics | 3 | **Contract Ready** | `staff.service.ts`, Staff Analytics UI | `planned (no evidence yet)` |
| **F-09** | Series Availability Control | **3 (Progress)** | **Working Progress** | `staff.service.ts`, Staff Toggle Switch | `in-progress` (Contract + Baseline) |
| **S3-HARDEN** | Rate Limiting & Hardening | 3 | **Contract Ready** | `app.ts`, `express-rate-limit` | `planned (no evidence yet)` |

---

## 2. ทะเบียนเกณฑ์การยอมรับฉบับสมบูรณ์ (Complete Acceptance Criteria Register: AC-01..AC-47)

| AC ID | หมวดหมู่ / ฟีเจอร์ | Implemented? | Verification Run? | ผลการทดสอบ (Result) | รหัสหลักฐาน (EV-ID) | Commit SHA ที่ผ่านการตรวจ |
| :---: | :--- | :---: | :---: | :---: | :---: | :---: |
| **AC-01** | Auth Login (Username format) | Yes | Yes | `accepted` | **EV-A07** | `d946159ba82a` |
| **AC-02** | Auth Login (Password verification) | Yes | Yes | `accepted` | **EV-A07** | `d946159ba82a` |
| **AC-03** | Auth Login (Missing password validation) | Yes | Yes | `accepted` | **EV-A07** | `72e1bb529b3c` |
| **AC-04** | Auth Token Security (Zero token in body) | Yes | Yes | `accepted` | **EV-A07** | `d946159ba82a` |
| **AC-05** | Role Assignment & JWT Claim | Yes | Yes | `accepted` | **EV-B01** | `d946159ba82a` |
| **AC-06** | Logout & Token Invalidation | Yes | Yes | `accepted` | **EV-A07** | `d946159ba82a` |
| **AC-07** | Bcrypt Hash Cost $\ge 10$ | Yes | Yes | `accepted` | **EV-A07** | `d946159ba82a` |
| **AC-08** | Role Guard 403 Rejection | Yes | Yes | `accepted` | **EV-B01** | `d946159ba82a` |
| **AC-09** | Series Discovery Listing | Yes | Yes | `accepted` | **EV-A07** | `d946159ba82a` |
| **AC-10** | Queue Join (Atomic FIFO) | Yes | Yes | `accepted` | **EV-B03** | `d946159ba82a` |
| **AC-11** | 1 Active Ticket per Series (BR-02 v2) | Yes | Yes | `accepted` | **EV-A02** | `a07a7be732b3` |
| **AC-12** | Inactive Series Join Block (409) | Yes | Yes | `accepted` | **EV-A07** | `d946159ba82a` |
| **AC-13** | Multi-Series Join Coexistence | Yes | Yes | `accepted` | **EV-A02** | `a07a7be732b3` |
| **AC-14** | Role Guard on Join Endpoint | Yes | Yes | `accepted` | **EV-B01** | `d946159ba82a` |
| **AC-15** | Concurrency: 50 Simultaneous Joins | Yes | Yes | `accepted` | **EV-A07** | `d946159ba82a` |
| **AC-16** | Race Guard: 10 Duplicate Joins | Yes | Yes | `accepted` | **EV-A02** | `a07a7be732b3` |
| **AC-17** | Display Number Format (CRY-001) | Yes | Yes | `accepted` | **EV-B03** | `d946159ba82a` |
| **AC-18** | Monotonic Counter Continuity | Yes | Yes | `accepted` | **EV-B03** | `d946159ba82a` |
| **AC-19** | WaitingAhead Accurate Calculation | Yes | Yes | `accepted` | **EV-B04** | `a07a7be732b3` |
| **AC-20** | Responsive Web Layout (375px) | Yes | Yes | `accepted` | **EV-A07** | `d946159ba82a` |
| **AC-21** | Staff Series Queue Inspection | Yes | Yes | `accepted` | **EV-A07** | `d946159ba82a` |
| **AC-22** | Staff Call-Next FIFO Order | Yes | Yes | `accepted` | **EV-B05** | `d946159ba82a` |
| **AC-23** | Call-Next Status Transition (CALLED) | Yes | Yes | `accepted` | **EV-B05** | `d946159ba82a` |
| **AC-24** | Staff Busy Single Active Handling | Yes | Yes | `accepted` | **EV-A02** | `d946159ba82a` |
| **AC-25** | Staff Series Assignment Scope Guard | Yes | Yes | `accepted` | **EV-A04** | `d946159ba82a` |
| **AC-26** | Start Unboxing (CALLED -> UNBOXING) | Yes | Yes | `accepted` | **EV-A04** | `d946159ba82a` |
| **AC-27** | Complete Ticket (UNBOXING -> COMPLETED) | Yes | Yes | `accepted` | **EV-A04** | `d946159ba82a` |
| **AC-28** | Strict State Lifecycle Validation | Yes | Yes | `accepted` | **EV-A07** | `d946159ba82a` |
| **AC-29** | Staff Series Mismatch Rejection | Yes | Yes | `accepted` | **EV-A04** | `d946159ba82a` |
| **AC-30** | Handler Exclusive Rejection (403) | Yes | Yes | `accepted` | **EV-A04** | `d946159ba82a` |
| **AC-31** | Staff Role Guard on Transitions | Yes | Yes | `accepted` | **EV-B01** | `d946159ba82a` |
| **AC-32** | Concurrency Row-Lock SKIP LOCKED | Yes | Yes | `accepted` | **EV-B05** | `d946159ba82a` |
| **AC-33** | End-to-End Critical Journey | Yes | Yes | `accepted` | **EV-A07** | `d946159ba82a` |
| **AC-34** | My-Ticket Active Filter | Yes | Yes | `accepted` | **EV-B04** | `a07a7be732b3` |
| **AC-35** | My-Ticket Multi-Series Cards | Yes | Yes | `accepted` | **EV-B04** | `a07a7be732b3` |
| **AC-36** | Ticket Detail Existence Check (404) | Yes | Yes | `accepted` | **EV-A07** | `d946159ba82a` |
| **AC-37** | Ticket Detail Ownership Guard (403) | Yes | Yes | `accepted` | **EV-A07** | `d946159ba82a` |
| **AC-38** | Ticket Detail Staff Scope Guard (403) | Yes | Yes | `accepted` | **EV-A07** | `d946159ba82a` |
| **AC-39** | Cloud Deployment Persistence | Yes | Yes | `tested` (v0.2.0) | **EV-B07** | `bf52c9b969d9` |
| **AC-40** | *(เว้นว่างไว้โดยเจตนา — EV-A08)* | N/A | N/A | `N/A` | **EV-A08** | N/A |
| **AC-41.1** | F-05 Valid Ticket Cancellation | No | No | `planned (no evidence yet)` | - | TBD |
| **AC-41.2** | F-05 Immediate Re-join After Cancel | No | No | `planned (no evidence yet)` | - | TBD |
| **AC-41.3** | F-05 Monotonic Counter Continuity | No | No | `planned (no evidence yet)` | - | TBD |
| **AC-41.4** | F-05 Forbidden Ownership Rejection | No | No | `planned (no evidence yet)` | - | TBD |
| **AC-41.5** | F-05 Invalid State Transition Rejection | No | No | `planned (no evidence yet)` | - | TBD |
| **AC-41.6** | F-05 Call-Next Structural Exclusion | No | No | `planned (no evidence yet)` | - | TBD |
| **AC-41.7** | F-05 Multi-Ticket Independence | No | No | `planned (no evidence yet)` | - | TBD |
| **AC-41.8** | F-05 Concurrency Race Guard | No | No | `planned (no evidence yet)` | - | TBD |
| **AC-42.1** | F-06 Premature No-Show Rejection (<120s) | No | No | `planned (no evidence yet)` | - | TBD |
| **AC-42.2** | F-06 119s / 120s / 121s Boundary | No | No | `planned (no evidence yet)` | - | TBD |
| **AC-43.1** | F-06 Successful No-Show Transition | No | No | `planned (no evidence yet)` | - | TBD |
| **AC-43.2** | F-06 Staff Released from STAFF_BUSY | No | No | `planned (no evidence yet)` | - | TBD |
| **AC-43.3** | F-06 Handler Exclusive Guard (403) | No | No | `planned (no evidence yet)` | - | TBD |
| **AC-43.4** | F-06 WAITING Ticket Null-Guard (400) | No | No | `planned (no evidence yet)` | - | TBD |
| **AC-43.5** | F-06 No-Show vs Start-Unbox Race Guard | No | No | `planned (no evidence yet)` | - | TBD |
| **AC-43.6** | F-06 Collector Immediate Re-join | No | No | `planned (no evidence yet)` | - | TBD |
| **AC-44.1** | F-07 Public Unauthenticated Access (200) | No | No | `planned (no evidence yet)` | - | TBD |
| **AC-44.2** | F-07 Zero PII Assertion in Body Values | No | No | `planned (no evidence yet)` | - | TBD |
| **AC-44.3** | F-07 UpNext Max 5 & WaitingCount | No | No | `planned (no evidence yet)` | - | TBD |
| **AC-44.4** | F-07 Integer QueueNumber Sorting | No | No | `planned (no evidence yet)` | - | TBD |
| **AC-44.5** | F-07 Closed Series Display with Badge | No | No | `planned (no evidence yet)` | - | TBD |
| **AC-44.6** | F-07 Excluded Inactive Status Filter | No | No | `planned (no evidence yet)` | - | TBD |
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

## 3. ตารางสอบกลับความต้องการ (Requirements Traceability Matrix)

| Req ID | หมวดหมู่ | Feature | Sprint | Acceptance Criteria | Test Specification | Actual Test File on Main | Version & Result | การวัดผล / ข้อกำหนด NFR (Measurement) |
| :---: | :--- | :---: | :---: | :--- | :--- | :--- | :---: | :--- |
| **FR-01** | Auth | F-01 | 1 | AC-01, AC-02, AC-03, AC-05 | TEST-01..03, 05 | `server/tests/api/auth.test.ts` | `tested` (`v0.3.0`) | Pass (**EV-A07**), Bcrypt salt >= 10 |
| **FR-02** | Logout | F-01 | 1 | AC-06 | TEST-06 | `server/tests/api/auth.test.ts` | `tested` (`v0.3.0`) | TokenVersion incremented |
| **FR-03** | Discovery | F-02 | 1 | AC-09 | TEST-09 | `server/tests/api/series.test.ts` | `tested` (`v0.3.0`) | คืนรายการซีรีส์พร้อม Waiting Count |
| **FR-04** | Join Queue | F-02 | 1,7 | AC-10, AC-12, AC-13, AC-19 | TEST-10,12,13,19 | `server/tests/api/join.test.ts` | `tested` (`v0.3.0`) | Atomic monotonic numbering (EV-B03) |
| **FR-05** | My Ticket | F-04 | 1,7 | AC-34, AC-35 | TEST-34,35 | `server/tests/api/my-ticket.test.ts` | `tested` (`v0.3.0`) | Multi-ticket array response (EV-B04) |
| **FR-06** | Ticket Detail| F-04 | 1 | AC-36, AC-37, AC-38 | TEST-36..38 | `server/tests/api/ticket-detail.test.ts` | `tested` (`v0.3.0`) | Ownership 403 guard (EV-A07) |
| **FR-07** | Staff View | F-03 | 1 | AC-21 | TEST-21 | `server/tests/api/staff-tickets.test.ts` | `tested` (`v0.3.0`) | Series assignment scope guard |
| **FR-08** | Call Next | F-03 | 1 | AC-22, AC-23, AC-24, AC-25 | TEST-22..25 | `server/tests/api/call-next.test.ts` | `tested` (`v0.3.0`) | FIFO SKIP LOCKED row lock (EV-B05) |
| **FR-09** | Start Unbox | F-03 | 1 | AC-26 | TEST-26 | `server/tests/api/staff-transition.test.ts` | `tested` (`v0.3.0`) | Handler exclusive 403 (EV-A04) |
| **FR-10** | Complete | F-03 | 1 | AC-27, AC-33 | TEST-27,33 | `server/tests/api/staff-transition.test.ts` | `tested` (`v0.3.0`) | State lifecycle completion |
| **FR-11** | Cancel Queue| **F-05** | **2** | AC-41.1, AC-41.2, AC-41.3, AC-41.4, AC-41.5, AC-41.6, AC-41.7, AC-41.8 | TEST-41A..41H | `server/tests/api/cancel.test.ts` *(planned)* | `planned` | Re-join ได้ทันที, ข้ามเลขถาวร |
| **FR-12** | No-Show | **F-06** | **2** | AC-42.1, AC-42.2, AC-43.1, AC-43.2, AC-43.3, AC-43.4, AC-43.5, AC-43.6 | TEST-42A..C, 43A..F | `server/tests/api/no-show.test.ts` *(planned)* | `planned` | Server-enforced Δt ≥ 120s |
| **FR-13** | Public Board| **F-07** | **2** | AC-44.1, AC-44.2, AC-44.3, AC-44.4, AC-44.5, AC-44.6 | TEST-44A..44E | `server/tests/api/public-board.test.ts` *(planned)* | `planned` | Zero PII, Polling 3s, Max 5 |
| **FR-14** | Analytics | **F-08** | **3** | AC-45.1, AC-45.2, AC-45.3, AC-45.4 | TEST-45A..45E | `server/tests/api/analytics.test.ts` *(planned)* | `planned` | แม่นยำตามสูตรคณิตศาสตร์ |
| **FR-15** | Series Toggle| **F-09** | **3** | AC-46.1, AC-46.2, AC-46.3, AC-46.4, AC-46.5 | TEST-46A..46E | `server/tests/api/series-toggle.test.ts` *(planned)* | `planned` | ตั๋วค้างเดิมยังให้บริการได้จนจบ |
| **BR-01** | Monotonic No| F-02,F-05 | 1,2 | AC-10, AC-17, AC-18, AC-41.3 | TEST-10,18,41B | `server/tests/concurrency/numbering.test.ts`| `tested` (`v0.3.0`) | Composite key (seriesId, queueDate) |
| **BR-02 v2**| 1/Series | F-02 | 1,7 | AC-11, AC-16, AC-19 | TEST-11,16,19 | `server/tests/concurrency/duplicate.test.ts`| `tested` (`v0.3.0`) | Partial Unique Index (EV-A02) |
| **BR-03** | State Life | F-03,F-05,06| 1,2 | AC-22, AC-26, AC-27, AC-28, AC-41.5 | TEST-28,41D,41E | `server/tests/unit/state-machine.test.ts` | `tested` (`v0.3.0`) | ทิศทางเดียว ไม่ย้อนกลับ |
| **BR-04** | Role Guard | All | 1 | AC-08, AC-14, AC-31 | TEST-08U,14,31 | `server/tests/unit/role-guard.test.ts` | `tested` (`v0.3.0`) | 403 FORBIDDEN_ROLE (EV-B01) |
| **BR-05** | Staff Series| F-03,F-09 | 1,3 | AC-25, AC-29, AC-46.3 | TEST-25,29,46C | `server/tests/api/staff-tickets.test.ts` | `tested` (`v0.3.0`) | 403 FORBIDDEN_SERIES |
| **BR-06** | Single Staff | F-03,F-06 | 1,2 | AC-24, AC-32, AC-43.2 | TEST-24,32,43B | `server/tests/api/call-next.test.ts` | `tested` (`v0.3.0`) | 409 STAFF_BUSY (EV-A02) |
| **BR-07** | Handler Excl| F-03,F-06 | 1,2 | AC-26, AC-30, AC-43.3 | TEST-26,30,43C | `server/tests/api/staff-transition.test.ts` | `tested` (`v0.3.0`) | 403 FORBIDDEN_NOT_HANDLER |
| **BR-08** | 120s Timeout| **F-06** | **2** | AC-42.1, AC-42.2, AC-43.1 | TEST-42A..C, 43A | `server/tests/api/no-show.test.ts` *(planned)* | `planned` | App clock FakeClock boundary |
| **BR-09** | Inactive Block| F-02,F-09 | 1,3 | AC-12, AC-46.2 | TEST-12,46B | `server/tests/api/join.test.ts` | `tested` (`v0.3.0`) | 409 SERIES_CLOSED |
| **NFR-01** | Bcrypt Hash | F-01 | 1 | AC-07 | TEST-07 | `server/tests/security/password-hash.test.ts`| `tested` (`v0.3.0`) | Salt rounds >= 10 |
| **NFR-02** | Zero PII | F-07 | 1,2 | AC-04, AC-44.2 | TEST-04, TEST-44A | `server/tests/security/unauthenticated.test.ts` | `tested` (`v0.3.0`) / `planned` (F-07) | Zero PII in public payload string |
| **NFR-03** | Concurrency | F-02 | 1 | AC-15 | TEST-15 | `server/tests/concurrency/numbering.test.ts`| `tested` (`v0.3.0`) | 50 concurrent requests: 0 duplicate |
| **NFR-04** | Race Guard | F-02 | 1 | AC-16 | TEST-16 | `server/tests/concurrency/duplicate.test.ts`| `tested` (`v0.3.0`) | 10 duplicate concurrent: 1 pass, 9 fail |
| **NFR-05** | Persistence | Infra | 1,5 | AC-39 | TEST-39 | `scripts/test-persistence.mjs` | `tested` (v0.2.0) | ข้อมูลคงทนหลัง restart/redeploy 3/3 |
| **NFR-06** | Responsive | UI,F-07 | 1,2 | AC-20, AC-44.4 | TEST-20, TEST-44C | `e2e/responsive.spec.ts` | `tested` (`v0.3.0`) / `planned` (F-07) | ไม่มี overflow ที่ 375px; TV 1080p |
| **NFR-07** | Rate Limit | **S3** | **3** | AC-47.1, AC-47.2, AC-47.3 | TEST-47A..C | `server/tests/security/rate-limit.test.ts` *(planned)* | `planned` | Max 10 requests / 15 minutes |

---

## 4. Coverage Gaps & Planned Final Verification

1. **Test Suites ของฟีเจอร์ใหม่ยังไม่มีอยู่จริงบน codebase (EV-A07, EV-B08):**
   ไฟล์เทสต์ 6 ไฟล์ในตาราง Traceability ได้แก่ `cancel.test.ts`, `no-show.test.ts`, `public-board.test.ts`, `analytics.test.ts`, `series-toggle.test.ts`, และ `rate-limit.test.ts` ติดป้าย `planned (no evidence yet)` ชัดเจน และจะถูกสร้างขึ้นในกระบวนการ TDD `[RED]` ตามแผน
2. **การทดสอบจริงบนเครือข่ายภายนอกของ Cloud Run (EV-B07, EV-D01):**
   การตรวจสอบ `/api/health` ที่คืน Git Commit SHA และการยืนยัน Persistence ของ `v0.4.0` และ `v0.5.0` บน Cloud Run เป็นงานที่ต้องอาศัยสิทธิ์ GCP ของมนุษย์ จึงบันทึกเป็น `unverified — evidence pending` จนกว่าจะรัน Live Check หลังการ Release

---

## 5. บันทึกการตัดสินใจทางวิศวกรรม (SRS Decision Log)

* **Decision 1 (Priority Policy):** ปฏิเสธการทำ Priority Jumping สำหรับตั๋วที่ถูก No-Show หรือ Cancel; ลูกค้าที่เข้าคิวใหม่จะได้รับเลขคิวต่อท้ายแถวเสมอเพื่อความโปร่งใส
* **Decision 2 (Counter Isolation):** ปฏิเสธการใช้ตัวนับรวมทั้งร้าน โดยยืนยันใช้ Composite Key `("seriesId", "queueDate")` เพื่อแยกอิสระตามซีรีส์และรีเซ็ตรายวันตามเวลาไทย (**EV-B03**)
* **Decision 3 (G-07 Overnight Leftover Limitation):** บันทึก ณ วันที่ 2026-11-24 ยอมรับพฤติกรรมที่ตั๋วค้างข้ามคืนจะถูกเรียกก่อนตาม FIFO (`queueDate ASC`) และไม่ทำการแก้ไข Schema เพิ่มเติมใน Sprint 2
* **Decision 4 (F-05 Cancel Ownership Precedence):** กำหนดให้การตรวจสอบสิทธิ์ความเป็นเจ้าของ (`403 FORBIDDEN_OWNERSHIP`) ทำงานก่อนการตรวจสถานะตั๋ว (`400 INVALID_STATE_TRANSITION`) เมื่อ Collector พยายามยกเลิกตั๋วของผู้อื่น
* **Decision 5 (F-06 Re-join After No-Show):** กำหนด ณ วันที่ 2026-11-24 (สถานะ: รอยืนยัน TA) อนุญาตให้ Collector ที่ถูกตัดสิทธิ์ No-Show สามารถกด join เพื่อรับคิวใหม่ได้ทันที เนื่องจากหลุดออกจากข้อจำกัดทางสถาปัตยกรรม Database อยู่แล้ว (**EV-A02**)
* **Decision 6 (F-07 Dataset Alignment):** กำหนดให้ Public Board ดึงข้อมูลและเรียงลำดับด้วยเงื่อนไขเดียวกับ `call-next` เพื่อให้ Up Next แสดงตรงกับตั๋วที่จะถูกเรียกจริง (**EV-B05**)
* **Decision 7 (ServerNow Clock Synchronization):** เพิ่มฟิลด์ `data.serverNow` ใน response เพื่อแก้ปัญหา Client Clock Skew บน CountdownTimer

---

# Part E: Integrated Release Candidate, Demonstrations & Finish Plan (15 คะแนน)

## 1. แผนการปล่อยตัวระบบแบบ 2 ระยะ (Two-Stage Release Plan)
1. **ระยะที่ 1 (Target Sprint 2 Release): Tag `v0.4.0-sprint2`**
   - รวมฟีเจอร์หลักของ Sprint 2: `F-05` (Cancel), `F-06` (No-Show), `F-07` (Public Board)
   - ดำเนินการ TDD, PR Review และ Merge เข้าสู่ `sprint2-staging`
   - Deploy ขึ้น GCP Cloud Run เพื่อทดสอบ Integration
2. **ระยะที่ 2 (Final Deliverable 2 Release Candidate): Tag `v0.5.0-d2-rc`**
   - รวม Genuine Working Progress ของ Sprint 3: `F-09` (Series Toggle)
   - Fast-forward merge เข้าสู่ `main` และ Deploy ขึ้น Production Cloud Run
   - รัน Live Check และบันทึกหลักฐานรอบสุดท้ายก่อน Export PDF

---

## 2. ตารางตรวจสอบฟีเจอร์ข้ามระบบ (Cross-Feature Checks: CF-01..CF-08)

| Check ID | ชื่อการตรวจสอบ (Cross-Feature Interaction) | กฎและพฤติกรรมที่ต้องยืนยัน (Behavior & Invariant) | ชุดทดสอบที่ครอบคลุม | สถานะ (Status) |
| :---: | :--- | :--- | :---: | :---: |
| **CF-01** | `cancel` × `call-next` | ตั๋วที่ถูก Cancel ต้องไม่ถูก `call-next` เรียก (**EV-B05**); หากกดพร้อมกันต้องไม่เกิดสถานะซ้อนทับ | `TEST-41F`, `TEST-41H` | `planned` |
| **CF-02** | `no-show` × `call-next` | หลังตัดสิทธิ์ No-Show สำเร็จ พนักงานหลุดจาก `STAFF_BUSY` และเรียกตั๋วถัดไปได้ทันที (**EV-A02**) | `TEST-43B` | `planned` |
| **CF-03** | `cancel` × Multi-Ticket (BR-02 v2) | ยกเลิกตั๋ว 1 ใบในมือ ตั๋วใบอื่นในซีรีส์อื่นยังคงอยู่ปกติ (**EV-B04**); ยกเลิกใบสุดท้ายแสดง Empty State สะอาด | `TEST-41G` | `planned` |
| **CF-04** | `series-toggle` × `join` | เมื่อปิดซีรีส์ (`isActive: false`) คำขอ Join ใหม่ต้องถูกปฏิเสธด้วย `409 SERIES_CLOSED` (AC-12) | `TEST-46B` | `planned` |
| **CF-05** | `series-toggle` × Public Board | ซีรีส์ที่ปิดแต่มีตั๋วค้าง ยังคงแสดงบนบอร์ดพร้อมป้าย Badge "ปิดรับคิว" | `TEST-44D` | `planned` |
| **CF-06** | `cancel` / `no-show` × Public Board | ตั๋วที่ถูก Cancel หรือ No-Show ต้องหายจากบอร์ดหน้าร้านทันทีภายในการ Polling รอบถัดไป | `TEST-44A` | `planned` |
| **CF-07** | Role Guard Consistency | ทุก Endpoint ใหม่ต้องคืน HTTP `403 FORBIDDEN_ROLE` เมื่อเรียกโดย Role ที่ไม่ได้รับอนุญาต (**EV-B01**) | `TEST-41C`, `43C`, `45B`, `46C` | `planned` |
| **CF-08** | Sprint 1 Critical Journey Invariant | การเพิ่มฟีเจอร์ทั้งหมดต้องไม่ทำให้ E2E Journey เดิมของ Sprint 1 เกิด Regression (**EV-A07**) | `e2e/full-journey.spec.ts` | `tested` (`v0.3.0`) |

---

## 3. แผนการดำเนินงานและตารางเวลาส่งมอบ (Finish Plan: G0–G6)

| ระยะ / Milestone | วันที่เป้าหมาย | กิจกรรมทางวิศวกรรมหลัก (Engineering Tasks) | เกณฑ์ความสำเร็จ (Exit Criteria) | ผู้รับผิดชอบ | Dependency |
| :---: | :---: | :--- | :--- | :---: | :---: |
| **G0 / G1** | **อ. 24 พ.ย.** | ส่งมอบ Master Contract v1.1, เปิด PR ไป `sprint2-staging`, ปรึกษา TA เรื่อง Open Decisions | PR #xx สร้างแล้ว, TA รับทราบ | `@apfirst13` | - |
| **G2 (F-05)** | **พ. 25 พ.ย.** | พัฒนา F-05 (Cancel) ด้วย TDD `[RED]` → `[GREEN]`, ทำ UI `/my-ticket`, เริ่มเก็บ Lab 7 Metrics | TEST-41 ผ่านครบ, PR Review | `@apfirst13` (Author)<br>`@Theerawat82` (Reviewer) | G1 |
| **G2 (F-06)** | **พฤ. 26 พ.ย.** | พัฒนา F-06 (No-Show 120s) ด้วย TDD FakeClock, ทำ UI Countdown บน Staff Console | TEST-42, 43 ผ่านครบ, PR Review | `@Theerawat82` (Author)<br>`@apfirst13` (Reviewer) | G2 |
| **G3 / G4** | **ศ. 27 พ.ย.** | พัฒนา F-07 (Public Board) และ F-09 (Series Toggle) แบบคู่ขนาน, Release Tag `v0.4.0-sprint2` | TEST-44, 46 ผ่าน, Tag `v0.4.0` deploy Cloud Run | ทั้งสองคน | G2 |
| **G4 / G5** | **ส. 28 พ.ย.** | รวมเข้า `main` ปล่อย Tag `v0.5.0-d2-rc`, Deploy Production, รัน Live Checks, Code Freeze | Smoke & Persistence pass 3/3, Code Freeze | ทั้งสองคน | G3, G4 |
| **G6** | **อา. 29 พ.ย.** | ประกอบรายงาน PDF ฉบับสมบูรณ์ 2 ฉบับ (Deliverable 2 + Lab 7 Final), ตรวจทานก่อนส่ง | **ส่ง LEB2 ก่อน 18:00** (เส้นตาย 23:59) | ทั้งสองคน | G5 |
| **Post-D2** | **30 พ.ย.–13 ธ.ค.** | พัฒนา F-08 Analytics, S3-HARDEN, Load Test, ถ่ายทำ Video (จัดสรรงานเบาช่วงสอบ 1–11 ธ.ค.) | Final Delivery `v1.0.0-final` | ทั้งสองคน | G6 |

---

# Section 4: Setup, Safe Test Accounts & AI-Use Declaration

## 1. Setup Summary (คำแนะนำการติดตั้งสำหรับผู้ตรวจ)
```powershell
# 1. Clone repository และสลับไปยัง branch ส่งมอบ
git clone https://github.com/apfirst13/PopQueue_BFteam.git
cd PopQueue
git checkout docs/sprint2-contract-v1.1

# 2. ติดตั้ง Dependencies
npm install
npm install --prefix server
npm install --prefix client

# 3. เตรียมฐานข้อมูลและ Migration
docker compose up -d postgres
npm run db:migrate --prefix server
npm run db:seed --prefix server

# 4. รันชุดทดสอบ
npm test
npm run test:e2e
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

| หมวดหมู่งาน / ฟีเจอร์หลัก | `@apfirst13` (aphiwat) | `@Theerawat82` (Theerawat) |
| :--- | :---: | :---: |
| Master Specification v1.0 & v1.1 Revision | ✅ | ✅ |
| F-05 Queue Cancellation Contract & Implementation | ✅ (Author) | ✅ (Reviewer) |
| F-06 No-Show 120s Contract & Implementation | ✅ (Reviewer) | ✅ (Author) |
| F-07 Public Queue Display Board Contract & UI | ✅ (Author) | ✅ (Reviewer) |
| F-09 Series Availability Control (Working Progress) | ✅ (Author) | ✅ (Reviewer) |
| Peer Review & Verification Artifacts | ✅ | ✅ |
| Final PDF Report Assembly & Export | ✅ | ✅ |

## 4. AI-Use Declaration
ในการจัดทำเอกสาร Master Contract ฉบับนี้ ทีมงานได้ใช้ AI Agent เป็นผู้ช่วยวิศวกรรมในการตรวจสอบความสอดคล้องระหว่างเอกสารสเปกกับซอร์สโค้ดจริง (Code-Spec Reconciliation Audit), การค้นหาข้อขัดแย้งเชิงโครงสร้าง และการแปลงข้อกำหนดทางวิศวกรรมเป็น Acceptance Criteria และ Test Specification โดยทุกข้อความ ทุกตัวเลข และทุกผลลัพธ์ผ่านการตรวจสอบยืนยันกับคำสั่งที่รันจริงในระบบโดยนักศึกษาทั้งสองคน
