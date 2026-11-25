# PopQueue — Project Deliverable 2 Master Contract & Specification (v1.7)
> **Core Expansion (Sprint 2) & Genuine Progress (Sprint 3) with GCP Deployment**  
> **Course:** CPE 334 Introduction to Software Engineering in the Age of AI Agents (Semester 1/2026, KMUTT)  
> **Project / Theme:** **PopQueue** — Theme 9: Queue and Service Management System (*Art Toy Live Unboxing Station*)  
> **Repository:** `https://github.com/apfirst13/PopQueue_BFteam.git`  
> **Team Members:** `@apfirst13` (aphiwat) & `@Theerawat82` (Theerawat)  
> **Student IDs:** *(ใส่รหัสนักศึกษาทั้ง 2 คนในหน้าปก PDF เท่านั้น — ไม่เปิดเผยใน Repo สาธารณะ)*  
> **Deliverable:** Project Deliverable 2 (70 Points | 7% of Course Grade)  
> **Submission Deadline:** **Sunday, 29 November 2026 at 23:59** (via LEB2, single self-contained PDF)  
> **Contract Version:** `v1.7 (6-ISSUE EXECUTION PLAN & RUBRIC RECONCILED)`  
> **Contract Date:** `2026-11-25`  
> **Baseline Tags Audited:** `v0.1.0-sprint1` (`d946159`), `v0.2.0-lab5` (`bf52c9b`), `v0.3.0-lab7` (`a07a7be`)  
> **Audit Evidence Execution Commit:** `75068a6109439b7f5dcadd7713ba93115ab29043` (`sprint-2-docs`, bit-identical to `a07a7be` per EV-B02) & `80863efe5da82de12e8494189f9de030262c2432` (`docs/sprint2-master-contract`)  
> **Evidence Consolidated History:** `75068a6` (`sprint-2-docs`) & `830bdc5..f1941a0` (PR #61 draft history; consolidated on clean branch `docs/sprint2-master-contract` superseding closed PR #61)  
> **Authors / Reviewers:** Author `@apfirst13` (v1.0–v1.5), Author/Reconciler `@Theerawat82` (v1.6–v1.7) — Target Reviewer: `@apfirst13` (Contract PR `#62` → `sprint2-staging`)  
> **Staging Lineage Branch:** `sprint2-staging` (แตกจาก `origin/main` commit `a07a7be`)  
> **Deployed Cloud Run URL:** `https://popqueue-5now4hkvsa-as.a.run.app` *(Baseline Lab 5–7 live URL; รอผล Live Verification รอบ Candidate หลัง Deploy `v0.4.0-sprint2` / `v0.5.0-d2-rc`)*  
> **Immutable Submitted Tag/Commit:** `*(จะเติมก่อน Export PDF หลัง Deploy รอบสุดท้ายบน main)*`

---

## 0. ตารางบันทึกการเปลี่ยนแปลงฉบับเอกสาร (Changelog: v1.0 → v1.7)

| เวอร์ชัน | วันที่ | ส่วนที่แก้ไข / เพิ่มเติม | เหตุผลและความจำเป็นทางวิศวกรรม |
| :---: | :---: | :--- | :--- |
| **v1.0** | 2026-11-23 | ฉบับร่างแรก (Initial Draft) | ร่างข้อกำหนดสัญญา F-05, F-06, F-07 และวางโครงร่าง Deliverable 2 |
| **v1.1** | 2026-11-24 | Audit Reconciliation & Normalization | ปรับแก้ตามผล Ground-Truth Audit: ตัด boolean flag success (true/false), ปรับ SHA เต็ม, แก้ error order ของ No-Show ตามโค้ดจริง, เพิ่ม `serverNow`, ปรับสูตร Analytics |
| **v1.2** | 2026-11-24 | **Full Rubric Alignment & Contract Tightening** | 1. **Release Plan:** ปรับเป็น Staging → PR → `main` → Tag `v0.4.0` (ไม่ deploy จาก staging โดยตรง ไม่ข้าม PR)<br>2. **Decision Gate:** เพิ่ม Go/No-Go Gate วันศุกร์ 12:00 สำหรับ F-07 และติดตาม Live Cloud Run Check<br>3. **Full Part D:** บรรจุ SRS ฉบับสมบูรณ์ (Actors/Scope/FR/BR/NFR) และ System SDS (Architecture/Role Matrix/Env Vars) ไว้ใน Master ครบถ้วน เพื่อให้ PDF สมบูรณ์ในเล่มเดียว<br>4. **ตารางบังคับ:** เพิ่ม Sprint 2 Completion Table, Remaining-Work Table ตามเทมเพลต และ Evidence Plan (§4.1)<br>5. **Traceability:** แยกสถานะ `tested` / `planned` ชัดเจน ไม่เคลมผลเกินจริง, ปรับ F-09 เป็น `Contract Ready`<br>6. **Part A vs D:** แยกผล Local/CI ออกจาก Live Cloud Run, ปรับคำอธิบาย DEF-01<br>7. **Contract Tightening:** กำหนด Precondition/Error Code ชัดเจนใน Race Condition (AC-41.8, AC-43.5), เพิ่ม Role Guard Test ข้าม Role (`TEST-41I`, `TEST-43G`), ขยาย `TEST-46D`, ปรับตัวอย่าง JSON บอร์ด, เพิ่ม AC-44.7 Responsive |
| **v1.3** | 2026-11-24 | **Full Rubric Part D/E & Self-Contained PDF Appendices** | 1. เพิ่มเนื้อหา SRS ฉบับสมบูรณ์ (FR/BR/NFR) และ System SDS เข้าใน Part D ครบถ้วน<br>2. เพิ่มภาคผนวก Appendix A (คู่มือติดตั้ง), Appendix B (คลังหลักฐานสรุปทุก EV-*), Appendix C (บันทึกข้อตัดสินใจ DEC-01..05) เพื่อให้ PDF สมบูรณ์ในเล่มเดียว<br>3. วางแผนดำเนินงานแบบขนาน Track A (@apfirst13: F-05, F-07) และ Track B (@Theerawat82: F-06, F-09) กำหนด Go/No-Go Gate วันศุกร์ 12:00 |
| **v1.4** | 2026-11-24 | **Ground-Truth Audit Reconciliation** | 1. ตัดตัวเลข Code Coverage สังเคราะห์ใน EV-A08 แทนที่ด้วย AC/TEST ID collision check จริง<br>2. แก้ Commit SHA ของ v0.2.0-lab5 ใน EV-A01 ให้ถูกต้อง<br>3. แก้ชื่อ SQL Partial Unique Index ให้ตรงกับ migrations 0002/0003<br>4. อัปเดตยอด Test Suite เป็น 194 passed จริง (Server 153, Client 34, E2E 7)<br>5. เพิ่มการซิงก์ `AGENTS.md` ให้ผูกกับ Deliverable 2 (ก่อนยุบไฟล์แยกใน v1.5 และนำกลับมาซิงก์ข้าม Sprint ใน v1.6) |
| **v1.5** | 2026-11-24 | **Peer Review v1.4 Reconciliation & Single-Master Consolidation** | 1. Reconcile บัญชีทดสอบใน Appendix A §2 ตรงกับ server/prisma/seed.ts (`collector1..6`, `staff_crybaby`/`2`, `staff_labubu`)<br>2. ปรับคำสั่ง Dev Server ใน Appendix A §1 แยก 2 terminals (API 4000 / Client 3000) และรวม `npm install` ที่ root<br>3. เพิ่ม DB Impact: None, DoD, และ UI Specification บน `StaffCounterPage.tsx` พร้อมระบุการคืน `isActive` ใน `GET /api/staff/tickets` สำหรับ F-09<br>4. เพิ่ม DB Impact: None, DoD, และการกำหนด `RATE_LIMIT_*` / `TRUST_PROXY_HOPS` ใน `server/src/config/env.ts` สำหรับ S3-HARDEN<br>5. ปรับสูตรนับถอยหลัง F-06 AC-43.8 ให้ตรงกับ `virtualServerNow`<br>6. ปรับ Stack Reality เป็น Native CSS Variables, `node:24-alpine`, Port 3000 (Container) / 4000 (Local)<br>7. ปรับ EV-B08 ตัด `BoardPage.tsx` ออกจากไฟล์ UI ที่มีอยู่จริงบน `main`<br>8. ยุบไฟล์ spec/evidence แยกออกจาก PR (`5e95b20`) เพื่อให้ Master เป็นเอกสารศูนย์กลางเล่มเดียว |
| **v1.6** | 2026-11-25 | **Final Schema, Governance & Link Reconciliation** | 1. แก้ไข API/TypeScript DTO Shapes ของ `F-06 serverNow` (`CallNextResponse`, `MyTicketResponse`, `StaffTicketsResponse`) ให้ตรงกับโค้ดจริงบน `main` และรองรับ `CountdownTimer.tsx` แบบไม่ทำลาย Sprint 1 Regression<br>2. อัปเดต `AGENTS.md` ให้รองรับการควบคุม Agent ข้าม Sprint (`sprint2-staging` → `feature/<issue#>-<slug>`) โดยไม่อ้างอิงไฟล์ที่ถูกลบ<br>3. เพิ่ม HTML anchor `<a id="appendix-b"></a>`, แก้เลข §1/§2/§3 ในตาราง §0.4, แก้หัวข้อซ้ำใน Part C (`F-08` §1.6–§1.7 และ `S3-HARDEN` §3.3 + `config.TRUST_PROXY_HOPS`)<br>4. ปรับสถานะ `F-09` ใน Feature Inventory และ AC Register ให้ตรงความจริง, อัปเดตสถานะ `Issue #55` (`CLOSED` แต่ยังรอผล Live Check), ขยาย buffer `TEST-44C` เป็น 5s, และเพิ่มขั้นตอนสร้าง DB `popqueue_test` ใน Appendix A §1 |
| **v1.7** | 2026-11-25 | **6-Issue Execution Backlog, Ground-Truth Fixes & Rubric Tightening** | 1. เพิ่ม **6-Issue Execution Plan (`D2-I1`–`D2-I6`)** และรวมตารางเวลา Part E §4 + §6 เป็นตารางเดียวที่ไม่ขัดกัน พร้อมขยับ `F-09` ให้พัฒนาโค้ดล่วงหน้าได้ต่อจาก `F-06` และแก้ลำดับ `deploy.yml` (Merge `main` → Deploy อัตโนมัติ → Live Check → Tag)<br>2. แทนที่เลข CI Run ID/Revision สังเคราะห์ใน §0.1 ด้วยข้อมูลจริงจาก `gh run list` และ Cloud Run Service `popqueue`; แก้ประวัติ `DEF-01`/`DEF-02` (`72e1bb5` ใน `v0.3.0-lab7` + Omega-3 Retest PASS บน `2aee62b` + `LIM-01` CountdownTimer) และแก้ `EV-A09` (ตัด claim เกินหลักฐานและสะกดชื่อ TA `นายรัตนโชติ เพ็ชรพันธ์ศรี`)<br>3. ซิงก์นิยาม `EV-A04`, `EV-A05`, `EV-B02`, `EV-B05`, `EV-B09` ระหว่าง §0.4 และ Appendix B แบบ 1:1 พร้อมฝัง verbatim raw excerpts<br>4. ปิดช่องว่างสัญญาและ Traceability: เพิ่ม SRS **Assumptions**, SDS **UI Route Map**, `AC-41.11`, `AC-43.9` (Collector `/my-ticket` `serverNow` countdown), `AC-43.10` (`403 FORBIDDEN_SERIES` / `DEC-03` / `TEST-43U`), `AC-44.8` (3s polling / error state / `calledAt` sort / `DEC-04`), ปรับ `F-08`/`F-09` (`TEST-46E`/`46F`, `AC-46.4` `isActive` grep), แก้ `NFR-02`/`NFR-06` และคำศัพท์สถานะให้ตรง Rubric, ตัด `auto-cancel`/`Load Test`, เพิ่ม `DEC-06` (`F-08 → F-09`), และปรับ Appendix A (placeholder DB password, Deployment/Rollback summary, Contribution Table, AI-Use `Claude Sonnet 5.5` + `Antigravity`) |

---

## 0.1 ตารางเวอร์ชันและประวัติสายการปล่อย (Central Version & Lineage Table)

| Component / Milestone | Target / Baseline Tag | Base Branch / Lineage | Main Release Commit SHA | Deployed Cloud Run Service / Revision | Verified CI / CD Run ID (`gh run list`) | สถานะการตรวจสอบ (Status) |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| **Sprint 1 Baseline** | `v0.1.0-sprint1` | `sprint-1-staging` → `main` | `d946159ba82a249c195730a3b702cf0f68e96e2d` | `N/A` *(Local Docker/Vitest only — GCP เริ่มใน Lab 5)* | `N/A` *(Sprint 1 Local CI)* | **accepted** ([EV-A01](#appendix-b)) |
| **Lab 5 Cloud Deployment** | `v0.2.0-lab5` | `lab5-staging` → `main` | `bf52c9b969d905ba6f21bcc22a460f0db3dd5172` | Service `popqueue` *(Ep.5 rev `popqueue-00001-jwk`; rev ล่าสุดตรวจเพิ่มใน GCP Console)* | CI `#44915424466` (`#30`)<br>Deploy `#43473747855` (`#4`) | **accepted** ([EV-A01](#appendix-b), [EV-B07](#appendix-b)) |
| **Lab 6 Hotfix (Issue `#47`)** | *(untagged on `main`; included in `v0.3.0-lab7`)* | `fix/47-*` → `lab5-staging` → `main` | `2aee62b607b475a60be4b7a08980ec752d28941a` *(fix `72e1bb5`)* | Service `popqueue` *(Omega-3 Live Retest PASS 22 พ.ย.)* | CI `#44916401133` (`#31`)<br>Deploy `#44916394495` (`#5`) | **accepted** (Issue `#47`, [EV-B07](#appendix-b)) |
| **Lab 7 Maintenance (`BR-02 v2`)** | `v0.3.0-lab7` | `lab5-staging` → `main` | `a07a7be732b30cb75a22df7f30edfdc51521a87e` | Service `popqueue` *(รอระบุชื่อ revision & ปิดลูปหลักฐานใน Issue `#55`)* | CI `#45354243279` (`#37`, `3fbfaeb` PR `#60`)<br>Deploy `#45357138027` (`#6`, `a07a7be`) | **accepted** ([EV-A01](#appendix-b), [EV-B02](#appendix-b)) |
| **Sprint 2 Target Release** | `v0.4.0-sprint2` | `sprint2-staging` → `main` | TBD | Service `popqueue` (TBD) | TBD | `planned` |
| **Deliverable 2 Final Candidate** | `v0.5.0-d2-rc` | `sprint3-staging` → `main` | TBD | Service `popqueue` (TBD) | TBD | `planned` |

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
> - **EV-A01 ถึง EV-A10** และ **EV-B01 ถึง EV-B09:** รันตรวจสอบบน commit `75068a6109439b7f5dcadd7713ba93115ab29043` (Branch `sprint-2-docs` ต้นทาง; ผล `EV-B02` ยืนยันว่า `server/`, `client/`, `e2e/`, `scripts/` เหมือน `v0.3.0-lab7` / `a07a7be` 100%)  
> - **EV-D01 ถึง EV-D06:** รันตรวจสอบบน commit `830bdc575cfa14f2247e7ea5d3fb5196c348f114`..`02f0264` บน `docs/sprint2-contract-v1.1`  
> - **EV-D01-r2 ถึง EV-D06-r2 & v1.7 Ground-Truth Re-Audit:** รันตรวจสอบบน `81d605a84ba73ab0bc530c39cf9eb0083f76d635` และทวนสอบคำสั่ง Git/GitHub สดบน `80863efe5da82de12e8494189f9de030262c2432` (`docs/sprint2-master-contract`, PR `#62`); ไฟล์ดิบ `EV-*.txt` เดิมไม่ได้ commit ลง PR `#62` จึงฝังคำสั่งและ raw excerpt สำคัญลงใน Appendix B โดยตรง และจะรันชุดเต็มซ้ำบน `v0.5.0-d2-rc` ก่อน Export PDF

| รหัสหลักฐาน (EV-ID) | หัวข้อการตรวจสอบ | ผลลัพธ์ที่คาดหวัง | ผลลัพธ์ที่ตรวจพบจริง (Actual Result) | เวลาที่รันคำสั่ง (ISO) | Commit SHA ที่ตรวจ | หมวดหลักฐานในเล่ม (Appendix B Pointer) |
| :---: | :--- | :--- | :--- | :---: | :---: | :--- |
| **EV-A01** | Release Tags & SHAs | Tag v0.1.0, v0.2.0, v0.3.0 ตรงกับ Git | CONFIRMED — d946159, bf52c9b, a07a7be ตรงกัน | 2026-11-24T19:24:39+07:00 | `75068a6109439b7f` | [Appendix B §1 (EV-A01)](#appendix-b) |
| **EV-A02** | Migrations & Index Predicates | CANCELLED, NO_SHOW หลุดจาก Index | CONFIRMED — Migration 0002/0003 exclude ทั้งสอง | 2026-11-24T19:24:39+07:00 | `75068a6109439b7f` | [Appendix B §1 (EV-A02)](#appendix-b) |
| **EV-A03** | Prisma Schema Integrity | มี enum และฟิลด์ Sprint 2 ครบ | CONFIRMED — Enum บรรทัด 20-21, forfeitedAt บรรทัด 74 | 2026-11-24T19:24:39+07:00 | `75068a6109439b7f` | [Appendix B §1 (EV-A03)](#appendix-b) |
| **EV-A04** | Service Error Evaluation Flow | ตรวจสอบลำดับ throw ใน staff.service | CONFIRMED — มี null-guard ก่อนตรวจ NOT_HANDLER (`staff.service.ts::startUnboxing/complete`) | 2026-11-24T19:24:39+07:00 | `75068a6109439b7f` | [Appendix B §1 (EV-A04)](#appendix-b) |
| **EV-A05** | Clock Abstraction & Calls | calledAt ถูกคุมด้วย clock.now() | CONFIRMED — Interface Clock ใน `server/src/utils/clock.ts` | 2026-11-24T19:24:39+07:00 | `75068a6109439b7f` | [Appendix B §1 (EV-A05)](#appendix-b) |
| **EV-A06** | Health Endpoint & GIT_SHA | คืน status ok และ commit SHA | CONFIRMED — `server/src/app.ts` health route, vitest 4/4 passed | 2026-11-24T19:24:39+07:00 | `75068a6109439b7f` | [Appendix B §1 (EV-A06)](#appendix-b) |
| **EV-A07** | Test Inventory & R4 Integrity | รันผ่านทั้งหมด ไม่มี skip/only | CONFIRMED — 194 passed, 0 failed, 0 skipped (Server 153, Client 34, E2E 7) บน `75068a6` (โค้ดเท่า `v0.3.0-lab7` ตาม EV-B02) | 2026-11-24T19:24:39+07:00 | `75068a6109439b7f` | [Appendix B §1 (EV-A07)](#appendix-b) |
| **EV-A08** | AC/TEST ID Collision Audit | ไม่มีเลข ID ชนกับ Sprint 1 / Labs | CONFIRMED — AC-40 เว้นว่าง; AC-41..47 ว่างตรงกัน | 2026-11-24T19:24:39+07:00 | `75068a6109439b7f` | [Appendix B §1 (EV-A08)](#appendix-b) |
| **EV-A09** | Issues, PRs & TA Sign-off | ตรวจสอบ Issue #52-#55, PR #57-#60 | CONFIRMED — TA (`นายรัตนโชติ เพ็ชรพันธ์ศรี`) อนุมัติ Lab 7 `BR-02 v2` (4 เงื่อนไข) วันที่ 23 พ.ย. 15:30 ใน Issue `#52` / PR `#57` | 2026-11-24T19:24:39+07:00 | `80863efe5da82de1` | [Appendix B §1 (EV-A09)](#appendix-b) |
| **EV-A10** | Git Branch Topology | สำรวจสถานะ origin/main เทียบ local | CONFIRMED — `origin/main` และ `origin/sprint2-staging` อยู่ที่ `a07a7be` (`v0.3.0-lab7`) | 2026-11-25T02:47:00+07:00 | `80863efe5da82de1` | [Appendix B §1 (EV-A10)](#appendix-b) |
| **EV-B01** | Role Guard Error Code & Shape | คืน 403 FORBIDDEN_ROLE | CONFIRMED — `server/src/middleware/auth.ts::requireRole` | 2026-11-24T20:14:40+07:00 | `75068a6109439b7f` | [Appendix B §2 (EV-B01)](#appendix-b) |
| **EV-B02** | Git Tree Diff vs v0.3.0-lab7 | โค้ด server/client/e2e ต้องเท่ากัน | CONFIRMED — `merge-base` is ancestor (`exit 0`), diff ว่างเปล่า | 2026-11-24T20:14:40+07:00 | `75068a6109439b7f` | [Appendix B §2 (EV-B02)](#appendix-b) |
| **EV-B03** | QueueCounter Daily Reset & Key | รีเซ็ตรายวัน Asia/Bangkok, ไม่ถอยเลข | CONFIRMED — composite key `("seriesId", "queueDate")` | 2026-11-24T20:14:40+07:00 | `75068a6109439b7f` | [Appendix B §2 (EV-B03)](#appendix-b) |
| **EV-B04** | My-Ticket Query Filter & Shape | กรอง 3 สถานะ active, คืน `{ticket, tickets}` | CONFIRMED — `ticket.service.ts::getMyActiveTicket` | 2026-11-24T20:14:40+07:00 | `75068a6109439b7f` | [Appendix B §2 (EV-B04)](#appendix-b) |
| **EV-B05** | Call-Next FIFO & `isActive` Scope | `WHERE status='WAITING' SKIP LOCKED` & ไม่เช็ก `isActive` ใน `staff.service.ts` | CONFIRMED — ข้าม `CANCELLED`/`NO_SHOW` โดยโครงสร้าง SQL และ `git grep isActive` พิสูจน์ว่าทั้ง `callNext`, `startUnboxing`, `complete` ไม่บล็อกซีรีส์ปิด | 2026-11-25T02:47:00+07:00 | `80863efe5da82de1` | [Appendix B §2 (EV-B05)](#appendix-b) |
| **EV-B06** | Deployment Trigger & `GIT_SHA` | ตรวจ `.github/workflows/deploy.yml` และ `Dockerfile` | CONFIRMED — Trigger เฉพาะ `push: [main]` และ `workflow_dispatch` (ไม่ใช่ tag); ส่ง `GIT_SHA` ผ่าน Docker `--build-arg` | 2026-11-25T02:47:00+07:00 | `80863efe5da82de1` | [Appendix B §2 (EV-B06)](#appendix-b) |
| **EV-B07** | Part A Claims, Tags & CI Runs | ตรวจ `git tag --contains 72e1bb5`, `gh run list`, Issue `#46/#47/#55` | AUDITED — `72e1bb5` อยู่ใน `v0.3.0-lab7` เท่านั้น; Omega-3 Retest PASS บน `2aee62b`; Run IDs จริง `#43473747855`/`#44916394495`/`#45357138027`; Issue `#55` ปิดแบบไม่มี comment | 2026-11-25T02:47:00+07:00 | `80863efe5da82de1` | [Appendix B §2 (EV-B07)](#appendix-b) |
| **EV-B08** | Client File Mapping & Test Files | ยืนยันพาธจริงของ UI และ `git ls-files` ชุดทดสอบ | CONFIRMED — UI จริง 5 หน้า (`BoardPage.tsx` planned); ชุดทดสอบจริง 42 ไฟล์ใน `server/tests`, `client/src/tests`, `e2e`, `scripts` | 2026-11-25T03:39:05+07:00 | `80863efe5da82de1` | [Appendix B §2 (EV-B08)](#appendix-b) |
| **EV-B09** | Working Tree & Screenshots | ตรวจสถานะ working tree ทั้งรอบเก่า (`75068a6`) และ PR `#62` (`80863ef`) | AUDITED — รอบ `75068a6` Playwright เขียนทับรูป 18 ไฟล์ (รายงานตาม Rule 6); ปัจจุบันบน branch `docs/sprint2-master-contract` (`80863ef`) `working tree clean` | 2026-11-25T02:47:40+07:00 | `80863efe5da82de1` | [Appendix B §2 (EV-B09)](#appendix-b) |
| **EV-D01** | Preflight Checks & Cancel Grep | ตรวจ status, fetch origin/main, cancel grep | PASS — Tracked ตรงเงื่อนไข, origin/main เท่ากัน, no cancel | 2026-11-24T21:50:10+07:00 | `830bdc575cfa14f2` | [Appendix B §3 (EV-D01)](#appendix-b) |
| **EV-D02** | AC-ID & API Error Code Coverage | ทุก AC ปรากฏใน STS; ทุก error code มี AC | PASS — ตรวจสอบรอบ v1.1 (ขยายเป็น 83 active ACs + AC-40 reserved = 84 แถวใน v1.7) | 2026-11-24T22:00:38+07:00 | `830bdc575cfa14f2` | [Appendix B §3 (EV-D02)](#appendix-b) |
| **EV-D03** | Pre-written Claims Verification | ตรวจสอบ 100%, Verified, PASS, DONE ใน docs/ | PASS — ทุกบรรทัดที่เหลือมี EV-ID กำกับชัดเจน | 2026-11-24T22:00:50+07:00 | `830bdc575cfa14f2` | [Appendix B §3 (EV-D03)](#appendix-b) |
| **EV-D04** | Envelope Normalization Audit | ตรวจสอบการตัด boolean flag success ใน API payloads | PASS — ใช้เฉพาะ `{ data }` และ `{ error }`; zero legacy success flag | 2026-11-24T22:00:59+07:00 | `830bdc575cfa14f2` | [Appendix B §3 (EV-D04)](#appendix-b) |
| **EV-D05** | R4 Test Suite Integrity Check | ตรวจหา skip/only/xit/xdescribe/todo ใน tests | PASS — Exit code 1 ไม่พบการ skip หรือ weaken test เดิม | 2026-11-24T22:01:28+07:00 | `830bdc575cfa14f2` | [Appendix B §3 (EV-D05)](#appendix-b) |
| **EV-D06** | Diff Stat & Allowed Files Audit | เทียบ origin/main..HEAD และสถานะ working tree | PASS — แก้ไขเฉพาะ Docs/Rules; zero code/test changes (ประวัติก่อนยุบใน `5e95b20`) | 2026-11-24T22:01:35+07:00 | `830bdc575cfa14f2` | [Appendix B §3 (EV-D06)](#appendix-b) |
| **EV-D01-r2** | Preflight Checks & Cancel Grep (r2) | ตรวจ status, fetch origin/main, cancel grep | PASS — Tracked ตรงเงื่อนไข, no cancel in code | 2026-11-24T23:50:00+07:00 | `81d605a84ba73ab0` | [Appendix B §3 (EV-D01-r2)](#appendix-b) |
| **EV-D02-r2** | AC-ID & API Error Code Coverage (r2) | ทุก AC ปรากฏใน STS; ทุก error code มี AC | PASS — ตรวจซ้ำรอบ PR `#62` (ขยายครบ 83 active ACs + AC-40 reserved = 84 rows ใน v1.7) | 2026-11-25T04:20:00+07:00 | `80863efe5da82de1` | [Appendix B §3 (EV-D02-r2)](#appendix-b) |
| **EV-D03-r2** | Pre-written Claims Verification (r2) | ตรวจสอบ 100%, Verified, PASS, DONE ใน docs/ | PASS — ทุกบรรทัดที่เหลือมี EV-ID กำกับชัดเจน | 2026-11-24T23:50:00+07:00 | `81d605a84ba73ab0` | [Appendix B §3 (EV-D03-r2)](#appendix-b) |
| **EV-D04-r2** | Envelope Normalization Audit (r2) | ตรวจสอบการตัด boolean flag success ใน API payloads | PASS — ใช้เฉพาะ `{ data }` และ `{ error }`; zero legacy success flag | 2026-11-24T23:50:00+07:00 | `81d605a84ba73ab0` | [Appendix B §3 (EV-D04-r2)](#appendix-b) |
| **EV-D05-r2** | R4 Test Suite Integrity Check (r2) | ตรวจหา skip/only/xit/xdescribe/todo ใน tests | PASS — Exit code 1 ไม่พบการ skip หรือ weaken test เดิม | 2026-11-24T23:50:00+07:00 | `81d605a84ba73ab0` | [Appendix B §3 (EV-D05-r2)](#appendix-b) |
| **EV-D06-r2** | Diff Stat & Allowed Files Audit (r2) | เทียบ origin/sprint2-staging..HEAD และสถานะ Contract PR `#62` | PASS — แก้ไขเฉพาะ `PopQueue_Deliverable_2_Master.md` และ `AGENTS.md` (clean branch; zero code/test changes) | 2026-11-25T04:20:00+07:00 | `80863efe5da82de1` | [Appendix B §3 (EV-D06-r2)](#appendix-b) |

---

## สารบัญและโครงสร้างตามเกณฑ์ประเมิน (Rubric Navigation Table)

| ส่วนของเอกสาร (Rubric Part) | คะแนน | หัวข้อหลักและเนื้อหาที่ประเมิน | ตำแหน่งในเอกสาร (Document Pointers) |
| :--- | :---: | :--- | :--- |
| **Part A: Sprint 1 Continuity & Change Status** | **5** | ยืนยัน Critical Domain Journey, Change & Defect Register (Labs 5–7 พร้อม Severity/Priority), การตัดสินใจทางวิศวกรรม | Part A §1–§3 (ดู Appendix B: EV-A, EV-B) |
| **Part B: Sprint 2 Contracts & Working Increment** | **25** | Engineering Contracts F-05, F-06, F-07 (API/UI/Data/AC/STS/DoD), Concurrency Guard, Data Shapes | Part B §1–§3 (ดู Appendix B: EV-B, EV-D) |
| **Part C: Sprint 3 Contracts & Working Progress** | **15** | Contracts F-08, F-09, S3-HARDEN + Genuine Working Progress Target (`F-09`, Justification `DEC-06`) | Part C §1–§3 (ดู Appendix B: EV-B05, EV-D) |
| **Part D: Updated SRS, SDS, Traceability** | **10** | Full SRS Baseline + Assumptions, System SDS Architecture + UI Route Map + Role Matrix, Traceability Matrix, Complete AC Register (83 active ACs + AC-40 reserved = 84 rows) | Part D §1–§6 |
| **Part E: Integrated Candidate & Finish Plan** | **15** | Release Plan (Merge PR → Deploy → Live Check → Tag), **6-Issue Execution Plan (`D2-I1`–`D2-I6`)**, Cross-Feature Checks, Unified Timeline & Readiness Review | Part E §1–§7 |
| **Appendices: Setup, Evidence & Governance** | — | Local Setup & Deployment/Rollback Ref, Safe Test Accounts (Sanitized), Contribution & AI-Use, Evidence Catalog (Raw Excerpts), Open Decisions (`DEC-01..06`) | Appendix A, B, C |
| **รวมทั้งหมด (Total)** | **70** | **ครอบคลุมเกณฑ์การประเมิน Project Deliverable 2 ครบถ้วนตาม Rubric** ([EV-A07](#appendix-b), [EV-A08](#appendix-b)) | ฉบับสัญญา Pre-Code `v1.7` (อัปเดตผลจริงก่อน Export PDF) |

---

# Part A: Sprint 1 Continuity and Change Status (5 คะแนน)

## 1. การยืนยันความต่อเนื่องของ Sprint 1 (Sprint 1 Baseline & Continuity)
* **Accepted Baseline Release:** Tag `v0.1.0-sprint1` (Commit `d946159ba82a249c195730a3b702cf0f68e96e2d` — [EV-A01](#appendix-b))
* **Original Critical Domain Journey Verification:**
  เส้นทางการทำงานหลักของระบบที่ส่งมอบใน Sprint 1 (Collector Login → Join Queue `CRY` → Staff Login → Call Next → Verify & Start → Complete Unboxing) ได้รับการยืนยันบน Baseline ปัจจุบัน (`75068a6` ซึ่งโค้ดเหมือน `v0.3.0-lab7` / `a07a7be` 100% ตาม [EV-B02](#appendix-b))
  * **Automated E2E Suite (Baseline):** รันคำสั่ง `npx playwright test e2e/full-journey.spec.ts`
  * **ผลการรันบน Baseline ([EV-A07](#appendix-b)):** ผ่านทั้ง 3 Tests (Demo 1 ปกติ: 11.5s, Demo 2 ปฏิเสธตามกฎธุรกิจ: 774ms, Demo 3 ปฏิเสธสิทธิ์ข้าม Role: 784ms; รวม 3/3 passed) ไม่พบ Regression บน Baseline เดิม
  * **แผนการยืนยันบน Release Candidate (`planned`):** จะรัน `e2e/full-journey.spec.ts` และ `npm test` ซ้ำบน commit ของ Final Candidate **`v0.5.0-d2-rc`** ใน **Issue `D2-I6`** เพื่อพิสูจน์ Continuity บน Candidate จริงตาม Rubric

---

## 2. ทะเบียนการเปลี่ยนแปลงและข้อบกพร่อง (Change & Defect Register: Labs 5–7)

| Finding ID | แหล่งที่มา (Source) | Severity / Priority | Req / AC ที่กระทบ | ข้อค้นพบและสาเหตุทางวิศวกรรม | การแก้ไข (Resolution) | Accepted Decision | สถานะ / Tag ที่บรรจุ | ผลการทดสอบซ้ำ (Retest Verdict) |
| :---: | :--- | :---: | :---: | :--- | :--- | :---: | :---: | :--- |
| **DEF-01** | Lab 6 Special Exercise — Internal Controlled Defect Preparation (`BFteam`), Issue `#46` *(ไม่เข้า Blind UAT)* | Major / High *(Exercise Prep)* | `FR-04`, `AC-13`, `BR-09` | ทดลองถอด required `seriesId` บน `POST /api/tickets/join` ใน branch `defect/lab6-reintroduce-validation` (`0405c38`, PR `#44` ไม่ถูก merge) แล้วปิด Issue `#46` เพื่อเตรียมรอบ Blind UAT จริงด้วยเคส `#47` | คง validation เดิมไว้บน `lab5-staging` / `main` โดยไม่ได้ merge branch จำลอง | `accepted (controlled prep only; never merged to main)` | **CLOSED** (`#46`, ไม่เข้า `main`) | `N/A` (ไม่ได้ merge เข้า production) |
| **DEF-02** | Lab 6 Special Exercise — Independent Blind UAT (**Team Omega-3** `@guluJa`, `@PhraewaS`), Issue `#47` | Major / High *(Release-Blocking)* | `FR-01`, `AC-03` | บน branch `defect/lab6-reintroduce-validation` (`4c5bb50`) Login ไม่ส่ง `password` แล้ว API คืน HTTP 500 แทน HTTP 400 `VALIDATION_ERROR` | คืนค่า required `.min(1)` ใน `server/src/types/auth.ts`, `auth.controller.ts` และ `LoginPage.tsx` ด้วย TDD (`[RED] 47e2824` → `[GREEN] 72e1bb5`) | `accepted` | **RESOLVED** (PR `#48` → `#50`, `main` `2aee62b`; รวมอยู่ใน Tag **`v0.3.0-lab7`** — [EV-B07](#appendix-b)) | **Omega-3 Independent Retest `PASS`** บน Live Cloud Run `2aee62b` (`Accepted with minor limitations`, Issue `#47`, 22 พ.ย.) + Local/CI `PASS` ([EV-A07](#appendix-b)); `planned` รัน regression ซ้ำบน `v0.5.0-d2-rc` |
| **LIM-01** | Lab 6 Independent Retest Sign-off (**Team Omega-3**), Issue `#47` | Minor / Medium *(Known Limitation)* | `FR-05`, `F-04` | ตัวนับถอยหลัง `CountdownTimer` 120s บนหน้า `/my-ticket` ใช้ React local state (`initialSeconds=120`) จึงรีเซ็ตเป็น `02:00` เมื่อ Refresh หน้าเว็บ | Omega-3 ลงนามยอมรับเป็น Documented Minor Limitation ของ Sprint 1 ใน Issue `#47`; **วางแผนแก้ไขใน Sprint 2 `F-06` (`AC-42.3`, `AC-43.9`)** ด้วย `calledAt + serverNow` | `accepted as Sprint 1 limitation → fix planned in F-06` | **OPEN (Planned Fix in `v0.4.0-sprint2`)** | `planned` (`TEST-43J` บน `v0.4.0-sprint2`) |
| **CHG-01** | Lab 5 CI/CD & GCP, Issues `#24`–`#32` | Enhancement / High | `NFR-05` | ติดตั้ง Dockerfile Multi-stage, GitHub Actions CI/CD with WIF, Cloud Run (`popqueue`) + Cloud SQL (`popqueue-pg`) | ติดตั้ง Cloud Run Job `popqueue-migrate` รัน Migration ก่อน deploy Service อัตโนมัติ (`deploy.yml`) | `accepted` | **RESOLVED** (Tag `v0.2.0-lab5`, `bf52c9b`, Deploy `#43473747855`) | `tested` (หลักฐาน `c05-test1/2/3` ใน `docs/labs/lab-05/deployment.md`); `planned` re-verify persistence บน `v0.5.0-d2-rc` |
| **CHG-02** | Lab 7 Maintenance, Issue `#52` | Change Request / High | `FR-04`, `FR-05`, `BR-02`, `D-08` | ปรับกฎ `BR-02` จาก "ถือตั๋ว active ได้ 1 ใบทั้งระบบ" เป็น **"1 ใบต่อซีรีส์"** | TA (`นายรัตนโชติ เพ็ชรพันธ์ศรี`) อนุมัติ 23 พ.ย. 15:30; Zero-Gap Migration `0003` (`unique_active_ticket_user_series`); ปรับ `/my-ticket` คืน `{ ticket, tickets }` (ไม่มีตั๋วคืน `404 NO_ACTIVE_TICKET` — [EV-B04](#appendix-b)) | `accepted` (TA approved — [EV-A09](#appendix-b)) | **RESOLVED** (Tag `v0.3.0-lab7`, `a07a7be`, PR `#57`–`#60`, Deploy `#45357138027`) | `tested` ใน Local/CI ([EV-A07](#appendix-b)); มีภาพ live check นอก repo (`LAB7/evidence/live/`) แต่ Issue `#55` ปิดโดยไม่มี comment แนบ (`[รอทีมยืนยันสถานะการส่ง Lab 7 PDF & คอมเมนต์ปิดลูปใน Issue #55]`) |

---

## 3. Approved Baseline Revisions & Invariants
1. **Lab 6 Defect Fixes (DEF-01, DEF-02):** แก้ไข Validation บน branch เฉพาะกิจของ Lab 6 และ hotfix password validation บน `main` ผ่านกระบวนการ TDD ครบถ้วน
2. **Lab 7 BR-02 v2 (CHG-02):** รองรับพฤติกรรมร้าน Art Toy จริงที่มีเคาน์เตอร์แกะกล่องแยกตามซีรีส์ ลูกค้าสามารถรับบัตรคิวข้ามซีรีส์พร้อมกันได้ แต่ห้ามจองซ้ำในซีรีส์เดิม (Migration `0003` Zero-Gap: สร้าง Index ใหม่ก่อน Drop Index เก่า — [EV-A02](#appendix-b))
3. **Invariant ที่คงไว้ตลอด:**
   - Role-Based Access Control: `COLLECTOR` ถูกบล็อกด้วย HTTP `403 FORBIDDEN_ROLE` เมื่อเข้าถึง Endpoint ของ Staff ([EV-B01](#appendix-b))
   - Ownership Guard: ป้องกันการเข้าถึงหรือแก้ไขตั๋วของผู้อื่นด้วย HTTP `403 FORBIDDEN_OWNERSHIP`
   - State Machine: การเปลี่ยนสถานะต้องเป็นไปตาม State Lifecycle เท่านั้น ห้ามข้ามขั้นตอน
   - Atomic Daily Numbering: ออกเลขคิวต่อเนื่องรายวัน รีเซ็ตเที่ยงคืนเวลาไทย (`Asia/Bangkok`) ไม่นำเลขคิวที่ยกเลิกกลับมาใช้ซ้ำ ([EV-B03](#appendix-b))

---

# Part B: Sprint 2 Contracts and Working Increment (25 คะแนน)

ใน Sprint 2 นี้ ระบบ PopQueue ขยายขีดความสามารถหลัก (Core Expansion) 3 ฟีเจอร์:
1. **`F-05` Queue Cancellation:** ให้ลูกค้ายกเลิกคิวตนเองขณะรอได้
2. **`F-06` Server-Enforced 120s No-Show:** พนักงานตัดสิทธิ์ลูกค้าที่ไม่มาตามเรียกภายใน 120 วินาที ปลดล็อกพนักงานพ้นจาก `STAFF_BUSY`
3. **`F-07` Public Queue Display Board:** จอบอร์ดสาธารณะหน้าร้าน ไม่ต้องล็อกอิน และไม่มีข้อมูลส่วนบุคคลหลุด

> **Database & Schema Invariant ([EV-A02](#appendix-b), [EV-A03](#appendix-b)):** ทั้ง `F-05` และ `F-06` ไม่ต้องสร้าง Migration ใหม่ เนื่องจากใน `schema.prisma` มี Enum `CANCELLED`, `NO_SHOW` และฟิลด์ `forfeitedAt` (nullable DateTime) รอไว้แล้ว และผลการตรวจสอบ Migration `0002` และ `0003` ยืนยันว่าทั้งสองสถานะนี้หลุดออกจาก Partial Unique Index ทั้งหมด 100% ([EV-A02](#appendix-b)) ส่วน `F-07` เป็น Read-Only Endpoint

---

## 1. Feature Contract: F-05 Queue Cancellation (ลูกค้ายกเลิกตั๋วตนเอง)

### 1.1 Purpose & Scope
อนุญาตให้ Collector ยกเลิกตั๋วคิวที่ตนเองถืออยู่ขณะที่ตั๋วยังอยู่ในสถานะ `WAITING` เพื่อเปิดโอกาสให้ผู้อื่น และเพื่อปลดล็อกโควตาให้ตนเองสามารถกดรับบัตรคิวในซีรีส์เดิมได้ทันที  
* **นอก Scope:** ยกเลิกตั๋วที่ถูกเรียกแล้ว (`CALLED`), กำลังแกะกล่อง (`UNBOXING`), หรือจบแล้ว (`COMPLETED`, `NO_SHOW`, `CANCELLED`)  
* **DB / Migration Impact:** ไม่มี — ใช้ Enum `CANCELLED` และฟิลด์ `forfeitedAt` เดิม ([EV-A03](#appendix-b)) ไม่เกิด P2002 Unique Constraint Violation เนื่องจากอยู่นอก Partial Unique Index ([EV-A02](#appendix-b))

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
    - ฝั่ง Call-Next ใช้ Row Lock: `SELECT id FROM "QueueTicket" WHERE "seriesId" = $1 AND status = 'WAITING' ORDER BY "queueDate", "queueNumber" ASC LIMIT 1 FOR UPDATE SKIP LOCKED;` ([EV-B05](#appendix-b))
  - **ผลลัพธ์ที่กำหนดตายตัว (Deterministic Outcome):**
    1. **กรณี Cancel ถึง DB ก่อน:** ตั๋ว A เปลี่ยนเป็น `CANCELLED` ทันที → คำขอ Cancel ได้รับ HTTP `200 OK`; คำขอ `call-next` ที่ตามมาจะพบว่าไม่มีตั๋ว `WAITING` หลงเหลืออยู่ จึงได้รับ HTTP `404 EMPTY_QUEUE`
    2. **กรณี Call-Next ถึง DB ก่อน:** ตั๋ว A ติด Row Lock และเปลี่ยนเป็น `CALLED` → คำขอ Call-Next ได้รับ HTTP `200 OK`; คำขอ Cancel ที่ตามมาจะพบว่า `result.count === 0` และตั๋วไม่ได้อยู่ในสถานะ `WAITING` อีกต่อไป จึงได้รับ HTTP `400 INVALID_STATE_TRANSITION`
    3. **Invariant:** ไม่มีทางเกิดตั๋วที่อยู่ในทั้งสองสถานะ หรือเกิดข้อผิดพลาดระดับ Unhandled Exception


* **State Machine Helper Extension:** ในการพัฒนา F-05 และ F-06 จะทำการขยาย helper `canTransition` ใน `server/src/utils/state-machine.ts` จากเดิมที่รองรับเฉพาะ Staff Actions (`CALL_NEXT`, `START_UNBOXING`, `COMPLETE`) ให้รองรับ Action Lifecycle เพิ่มเติมคือ `'CANCEL'` (อนุญาตเฉพาะ `WAITING -> CANCELLED`) และ `'NO_SHOW'` (อนุญาตเฉพาะ `CALLED -> NO_SHOW`) เพื่อให้สอดคล้องกับ unit tests `TEST-41E` และ **`TEST-43U`**

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
  1. `401 UNAUTHENTICATED`: ไม่ส่ง Token, Token ปลอม หรือ Token หมดอายุ ([EV-B01](#appendix-b))
  2. `403 FORBIDDEN_ROLE`: ผู้เรียกมีบทบาทเป็น `BOX_MASTER` ([EV-B01](#appendix-b))
  3. `400 VALIDATION_ERROR`: พารามิเตอร์ `:id` ไม่ใช่ UUID ที่ถูกต้อง
  4. `404 RESOURCE_NOT_FOUND`: ไม่พบตั๋ว ID ที่ระบุในระบบ
  5. `403 FORBIDDEN_OWNERSHIP`: ผู้เรียกไม่ใช่เจ้าของตั๋ว (`ticket.userId !== auth.userId`)
  6. `400 INVALID_STATE_TRANSITION`: ตั๋วไม่ได้อยู่ในสถานะ `WAITING` (เช่น ถูกยกเลิกซ้ำ หรืออยู่ในสถานะ `CALLED`, `UNBOXING`, `COMPLETED`, `NO_SHOW`)

### 1.5 UI Specification: หน้า /my-ticket
* **ตำแหน่งปุ่ม:** แสดงปุ่ม "ยกเลิกคิว" (Cancel Queue) บนการ์ดตั๋วแต่ละใบ เฉพาะตั๋วสถานะ `WAITING` เท่านั้น
* **Confirmation Modal & Double-Submit Guard:** แสดง Dialog ยืนยัน: "ต้องการยกเลิกคิว CRY-003 หรือไม่? เลขคิวนี้จะไม่สามารถนำกลับมาใช้ได้อีก" และระหว่างส่งคำขอ `POST /api/tickets/:id/cancel` ต้อง Disable ปุ่มยืนยันพร้อมแสดง Loading State เพื่อป้องกัน Double Submission (และจัดการ Network Error โดยเปิดปุ่มกลับมาพร้อมแจ้งเตือน)
* **After Cancel:** แสดง Toast สำเร็จ "ยกเลิกคิวสำเร็จ" และรีเฟรชรายการตั๋ว
* **Empty State:** หากยกเลิกตั๋วใบสุดท้ายในมือ ระบบได้รับ `404 NO_ACTIVE_TICKET` จาก API ([EV-B04](#appendix-b)) หน้าจอต้องแสดง UI Empty State สะอาดตา ("ไม่มีคิวที่กำลังรอ") โดย **ต้องไม่แสดง Error Alert สีแดง**
* **Error Handling:** จัดการข้อผิดพลาดด้วย Error Toast เฉพาะรหัส `400`, `403`, `404` (ไม่มีรหัส 409)

### 1.6 Numbered Acceptance Criteria (AC: F-05)
* [ ] **AC-41.1 (Valid Cancellation):** Collector ที่มีตั๋ว `WAITING` กดยกเลิกสำเร็จ ได้รับ HTTP 200, สถานะเปลี่ยนเป็น `CANCELLED`, บันทึก `forfeitedAt` เป็นเวลาปัจจุบันจาก Application Clock
* [ ] **AC-41.2 (Quota Release & Immediate Re-join):** หลังยกเลิกสำเร็จ Collector สามารถกด `POST /api/tickets/join` เข้าซีรีส์เดิมได้ทันที ได้รับ HTTP 201 และได้เลขคิวใหม่ท้ายแถวโดยไม่ติดข้อผิดพลาด `409 DUPLICATE_ACTIVE_QUEUE` ([EV-A02](#appendix-b))
* [ ] **AC-41.3 (Monotonic Counter & WaitingAhead Update):** เมื่อมีคิวรอ `CRY-001` และ `CRY-002` อยู่ในซีรีส์ แล้ว `CRY-001` ถูกยกเลิก เลขคิว `CRY-001` จะถูกข้ามถาวร คิวถัดไปที่กดเข้ามาใหม่จะได้รับเลขถัดจากตัวนับสูงสุด (`CRY-003` — [EV-B03](#appendix-b)) และตั๋ว `CRY-002` ที่อยู่ข้างหลังจะมีค่า `waitingAhead` ลดลงจาก `1` เหลือ `0` ทันที
* [ ] **AC-41.4 (Forbidden Ownership Rejection):** Collector A พยายามส่งคำขอยกเลิกตั๋วของ Collector B ต้องถูกปฏิเสธด้วย HTTP `403 FORBIDDEN_OWNERSHIP` ตั๋วของ B คงสถานะ `WAITING`
* [ ] **AC-41.5 (Invalid State Transition on Non-Waiting):** กดยกเลิกตั๋วที่สถานะเป็น `CALLED`, `UNBOXING`, `COMPLETED`, `NO_SHOW` หรือยกเลิกซ้ำบนตั๋ว `CANCELLED` ต้องได้รับ HTTP `400 INVALID_STATE_TRANSITION`
* [ ] **AC-41.6 (Structural Call-Next Exclusion):** ตั๋วสถานะ `CANCELLED` จะไม่มีทางถูกเรียกโดย `POST /api/staff/call-next` เนื่องจากคำสั่ง SQL มีเงื่อนไข `WHERE status = 'WAITING'` ชัดเจน ([EV-B05](#appendix-b))
* [ ] **AC-41.7 (Multi-Ticket Holding Independence):** Collector ที่ถือตั๋วหลายซีรีส์พร้อมกัน (ตาม BR-02 v2) เมื่อยกเลิกตั๋วใบหนึ่ง ตั๋วใบอื่นใน `data.tickets` ยังคงสถานะเดิมครบถ้วน
* [ ] **AC-41.8 (Cancel vs Call-Next Race Concurrency):** คำขอยกเลิกคิวและคำขอเรียกคิวที่ส่งเข้ามาชนกันบนตั๋วใบเดียว ต้องมีเพียงคำขอเดียวที่สำเร็จ และอีกคำขอได้รับ Error ที่ถูกต้อง (`404 EMPTY_QUEUE` หรือ `400 INVALID_STATE_TRANSITION`)
* [ ] **AC-41.9 (Collector Cancel Access Guards):** Endpoint สำหรับยกเลิกตั๋วจำกัดสิทธิ์เฉพาะ Collector (หรือผู้ถือครอง); หาก Box Master ส่งคำขอต้องได้รับ HTTP 403 `FORBIDDEN_ROLE` ([EV-B01](#appendix-b)) และหากไม่ส่ง Authorization Header ต้องได้รับ HTTP 401 `UNAUTHENTICATED` ([EV-B01](#appendix-b))
* [ ] **AC-41.10 (Cancellation UI Modal & Clean Empty State):** หน้าจอ `/my-ticket` แสดง Confirmation Dialog เมื่อกดปุ่มยกเลิก, แสดง Toast สีเขียวเมื่อสำเร็จ, และในกรณีที่ตั๋วที่ยกเลิกเป็นตั๋วใบสุดท้ายในมือ (API คืน `404 NO_ACTIVE_TICKET` — [EV-B04](#appendix-b)) หน้าจอต้องปรับเข้าสู่ Clean Empty State ("ไม่มีคิวที่กำลังรอ") โดยต้องไม่แสดง Error Banner สีแดงรบกวนผู้ใช้
* [ ] **AC-41.11 (Not-Found Rejection & Double-Submit Guard):** ส่งคำขอยกเลิกด้วย Ticket UUID ที่ไม่มีอยู่จริงต้องได้รับ HTTP `404 RESOURCE_NOT_FOUND` (และ invalid UUID → `400 VALIDATION_ERROR`); บนหน้าจอ UI ระหว่างรอ response ปุ่มยืนยันใน Modal ต้องถูก Disable เพื่อป้องกันการส่งคำขอซ้ำ

### 1.7 Software Test Specification (STS: TEST-41)
| Test ID | Covered AC | Level | Test File | Preconditions | Inputs | Expected Output |
| :---: | :---: | :---: | :--- | :--- | :--- | :--- |
| **TEST-41A** | `AC-41.1` | Integration | `server/tests/api/cancel.test.ts` *(planned)* | Collector 1 ล็อกอิน, ถือตั๋ว `CRY-001` (`WAITING`) | `POST /api/tickets/:id/cancel` | HTTP `200`, `status: "CANCELLED"`, `forfeitedAt` ≠ null |
| **TEST-41B** | `AC-41.2`, `AC-41.3` | Integration | `server/tests/api/cancel.test.ts` *(planned)* | มีตั๋ว `CRY-001` (Collector 1) และ `CRY-002` (Collector 2, `waitingAhead: 1`) → ยกเลิก `CRY-001` แล้ว Collector 1 กด join ใหม่ | `POST /api/tickets/join` ซีรีส์ `CRY` + เช็กตั๋ว 2 | HTTP `201`, ได้เลข `CRY-003`, ตั๋ว 2 มี `waitingAhead` ลดลงเหลือ `0` |
| **TEST-41C** | `AC-41.4` | Security | `server/tests/api/cancel.test.ts` *(planned)* | Collector 1 ถือ `CRY-001`, Collector 2 ล็อกอิน | Collector 2 `POST /cancel` ตั๋ว 1 | HTTP `403 FORBIDDEN_OWNERSHIP`, ตั๋ว 1 คงสถานะ `WAITING` |
| **TEST-41D** | `AC-41.5` | Boundary | `server/tests/api/cancel.test.ts` *(planned)* | ตั๋วถูกเรียกแล้ว (`CALLED`) | Collector 1 `POST /cancel` | HTTP `400 INVALID_STATE_TRANSITION`, ตั๋วคงสถานะ `CALLED` |
| **TEST-41E** | `AC-41.5` | Unit | `server/tests/unit/state-machine.test.ts` | State machine transition validator | ตรวจทุกสถานะ → `CANCELLED` | อนุญาตเฉพาะ `WAITING`; ปฏิเสธสถานะอื่นทั้งหมด |
| **TEST-41F** | `AC-41.6` | Integration | `server/tests/api/cancel.test.ts` *(planned)* | มีตั๋ว `CANCELLED` 1 ใบ และ `WAITING` 1 ใบ | Box Master `POST /api/staff/call-next` | HTTP `200`, เรียกได้เฉพาะตั๋ว `WAITING`, ข้ามใบ `CANCELLED` |
| **TEST-41G** | `AC-41.7` | Integration | `server/tests/api/cancel.test.ts` *(planned)* | Collector ถือตั๋ว `CRY` และ `LAB` พร้อมกัน | `POST /cancel` ตั๋ว `CRY` | HTTP `200`, ตั๋ว `LAB` ยังคงอยู่ใน `data.tickets` |
| **TEST-41H** | `AC-41.8` | Concurrency | `server/tests/concurrency/cancel-race.test.ts` *(planned)* | มีตั๋ว `WAITING` ใบเดียว, ยิง Cancel และ Call-Next ชนกัน | Parallel Promise.all() | ฝั่งหนึ่งได้ 200, อีกฝั่งได้ 404 หรือ 400 (ไม่มีตั๋วค้างสถานะคู่) |
| **TEST-41I** | `AC-41.9` | Security | `server/tests/api/cancel.test.ts` *(planned)* | Box Master ล็อกอิน | `POST /api/tickets/:id/cancel` | HTTP `403 FORBIDDEN_ROLE` ([EV-B01](#appendix-b)) |
| **TEST-41J** | `AC-41.9` | Security | `server/tests/api/cancel.test.ts` *(planned)* | ไม่ส่ง Authorization Header | `POST /api/tickets/:id/cancel` | HTTP `401 UNAUTHENTICATED` ([EV-B01](#appendix-b)) |
| **TEST-41K** | `AC-41.10`, `AC-41.11` | Component / E2E | `client/src/tests/ticket.test.tsx` *(planned)* | มีตั๋ว `WAITING` ใบสุดท้าย | กดปุ่ม Cancel → กดยืนยัน Modal (ตรวจ disabled state ระหว่างส่ง) | ปุ่มถูก disable ระหว่างรอ, ได้รับ Toast สำเร็จ, การ์ดตั๋วหายไป และหน้าจอแสดง Clean Empty State โดยไม่มี Error Banner สีแดง |
| **TEST-41L** | `AC-41.11` | Boundary / Validation | `server/tests/api/cancel.test.ts` *(planned)* | Collector 1 ล็อกอิน | `POST /api/tickets/<nonexistent-uuid>/cancel` และ invalid UUID | HTTP `404 RESOURCE_NOT_FOUND` (และ `400 VALIDATION_ERROR` กรณี UUID ผิดรูปแบบ) |

### 1.8 Definition of Done (DoD) — F-05
- [ ] โค้ด Service/Controller/Route ครบถ้วน พร้อม Deterministic Error Handling
- [ ] บันทึก `[RED]` commit SHA และ `[GREEN]` commit SHA ตามระเบียบ TDD
- [ ] Regression Suite เดิม (194 tests) รันผ่าน 100% ไม่มี skip/weaken ([EV-A07](#appendix-b))
- [ ] UI ปุ่ม Cancel, Modal, Toast และ Empty State ทำงานสมบูรณ์บนหน้า `/my-ticket`
- [ ] PR ผ่านการ Review และ Merge เข้าสู่ `sprint2-staging`

---

## 2. Feature Contract: F-06 Server-Enforced 120s No-Show (ตัดสิทธิ์ลูกค้าไม่มาตามเรียก)

### 2.1 Purpose & Scope
แก้ปัญหาคอขวดของ Sprint 1 (G-02 / D-09: ลูกค้าไม่มาแสดงตัวทำให้ Box Master ติดสถานะ `STAFF_BUSY` ค้างถาวร): เมื่อตั๋วถูกเรียก (`CALLED`) ระบบจะเริ่มนับเวลาจาก `calledAt` หากเกิน `NO_SHOW_SECONDS` (120 วินาที) แล้วลูกค้าไม่มาแสดงตัว Box Master สามารถกดตัดสิทธิ์ No-Show เพื่อปลดล็อกตนเองให้สามารถเรียกคิวถัดไปได้  
* **ขอบเขตการทำงาน:** Sprint 2 รองรับเฉพาะการกด **Manual Trigger โดย Box Master ประจำสถานีเท่านั้น** (Auto No-Show อัตโนมัติโดยไม่มีคนกด เป็นงานนอกขอบเขตและบันทึกเป็น Known Limitation)  
* **DB / Migration Impact:** ไม่มี — ใช้ Enum `NO_SHOW` และฟิลด์ `forfeitedAt` เดิม ([EV-A03](#appendix-b)) ตั๋วที่ถูกตัดสิทธิ์จะหลุดจาก `unique_active_staff_ticket` ทำให้พนักงานหลุดจาก `STAFF_BUSY` ทันที ([EV-A02](#appendix-b))

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
* **Server-side validation (BR-08):** คำนวณ `elapsedMs = clock.now().getTime() - ticket.calledAt.getTime()`
  - `elapsedMs < 120_000` → HTTP `400 NO_SHOW_WINDOW_NOT_EXPIRED` พร้อม `details: { remainingSeconds: Math.ceil((120_000 - elapsedMs) / 1000) }` *(ปัดขึ้นด้วย `Math.ceil` ตรงกับฝั่ง Client เพื่อไม่ให้แสดง 0 วินาทีขณะยังไม่ครบกำหนด)*
  - `elapsedMs >= 120_000` → อนุญาต, บันทึก `forfeitedAt = clock.now()`, เปลี่ยนสถานะเป็น `NO_SHOW`
* **Concurrency Guard (AC-43.5 / TEST-43F):**
  - ฟังก์ชัน `startUnboxing` ในโค้ด Sprint 1 ปัจจุบัน (`server/src/services/staff.service.ts::startUnboxing`) **ใช้ Atomic Conditional `updateMany` อยู่แล้ว** (`WHERE id = :ticketId AND status = 'CALLED' AND handledByStaffId = :staffId`) ดังนั้นในการพัฒนา `F-06` **ไม่ต้องแก้ไขโค้ด `startUnboxing` เดิม** เพียงให้เมธอด `noShow` ตัวใหม่ใช้เงื่อนไข `updateMany` เดียวกัน
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
* **Deterministic Error Handling Order (สอดคล้องกับโค้ด Sprint 1 — [EV-A04](#appendix-b)):**
  1. `401 UNAUTHENTICATED`: ไม่ได้ยืนยันตัวตน ([EV-B01](#appendix-b))
  2. `403 FORBIDDEN_ROLE`: ผู้เรียกไม่ใช่ `BOX_MASTER` ([EV-B01](#appendix-b))
  3. `404 RESOURCE_NOT_FOUND`: ไม่พบตั๋ว ID ที่ระบุ
  4. `403 FORBIDDEN_SERIES`: Box Master ไม่ได้รับมอบหมายให้ดูแลซีรีส์ของตั๋วใบนี้
  5. `403 FORBIDDEN_NOT_HANDLER`: พนักงานคนนี้ไม่ใช่ผู้ที่กด Call ตั๋วนี้ไว้ (`ticket.handledByStaffId !== null && ticket.handledByStaffId !== staffId`)
  6. `400 INVALID_STATE_TRANSITION`: ตั๋วไม่ได้อยู่ในสถานะ `CALLED` *(กรณีตั๋ว `WAITING` ซึ่ง `handledByStaffId === null` จะผ่าน null-guard มาตกที่ข้อนี้และได้รับ 400 — [EV-A04](#appendix-b))*
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


* **Frontend Data Type Extension:** เพิ่มสถานะ `'NO_SHOW'` เข้าไปใน `TicketStatus` type ใน `client/src/types/index.ts:3` (จากเดิมที่มีเฉพาะ `'WAITING' | 'CALLED' | 'UNBOXING' | 'COMPLETED' | 'CANCELLED'`) เพื่อให้รองรับการแสดงผลบัตรคิวที่ถูกตัดสิทธิ์ No-Show บน Client UI

### 2.5 ServerNow Synchronization & Client Countdown Logic
1. **API Response Enhancement & JSON Schema:** เพิ่มฟิลด์ `serverNow: string` (ISO 8601 UTC format จาก `clock.now().toISOString()`) ภายใต้ `data.serverNow` ใน 3 Endpoints หลักโดย **คงโครงสร้าง Payload เดิมของ `main` ไว้ทั้งหมด** (`client/src/types/index.ts`, `staff.service.ts`, `ticket.service.ts`) เพื่อไม่ให้กระทบ Sprint 1 Regression:
   - `POST /api/staff/call-next` (`CallNextResponse`): `{ data: { ticketId: string, displayNumber: string, status: TicketStatus, handledByStaffId: string | null, calledAt: string, serverNow: string } }`
   - `GET /api/tickets/my-ticket` (`MyTicketResponse`): `{ data: { ticket: ActiveTicket, tickets: ActiveTicket[], serverNow: string } }` *(เมื่อไม่มีตั๋ว Active Backend คืน HTTP `404 NO_ACTIVE_TICKET`)*
   - `GET /api/staff/tickets` (`StaffTicketsResponse`): `{ data: { series: StaffSeriesQueueDto[], serverNow: string } }` *(โดย `StaffSeriesQueueDto` เพิ่ม `isActive: boolean` ใน F-09)*
2. **Component Compatibility & Clock Sync (`CountdownTimer.tsx` & `StaffCounterPage.tsx`):**  
   ปรับปรุง `client/src/components/CountdownTimer.tsx` จากเดิมที่รับ `initialSeconds?: number` ให้รองรับ props `calledAt?: string | null`, `serverNow?: string`, และคง `initialSeconds?: number` เป็น fallback เพื่อไม่ให้เทสต์เดิมพังระหว่างเปลี่ยนผ่าน (พร้อมอัปเดต `MyTicketPage.tsx` และ mock payloads ใน `client/src/tests/ticket.test.tsx` ให้ส่ง `serverNow` โดยคง assertions เดิมครบถ้วน) ส่วนหน้าจอ Staff Console (`StaffCounterPage.tsx`) ใช้สูตร Virtual Server Clock เดียวกันเพื่อคำนวณเวลาคงเหลือของปุ่ม "ตัดสิทธิ์ No-Show":
   ```typescript
   // คำนวณความต่างเวลาระหว่างเครื่องกับเซิร์ฟเวอร์ครั้งเดียวเมื่อได้รับ response
   const localOffsetMs = Date.now() - new Date(serverNow).getTime();
   
   // ใน useEffect interval (ทุก 1000ms):
   const virtualServerNow = Date.now() - localOffsetMs;
   const remainingSeconds = Math.max(0, Math.ceil((new Date(calledAt).getTime() + 120_000 - virtualServerNow) / 1000));
   ```
   ทำให้การนับถอยหลัง 120 วินาทีบนทั้งหน้าจอ Collector (`MyTicketPage.tsx`) และหน้าจอ Staff Console (`StaffCounterPage.tsx`) เดินตรงกับเวลาจริงของเซิร์ฟเวอร์เสมอ ป้องกันปัญหา Client Clock Skew ได้สมบูรณ์
3. **Staff UI Behavior:**
   - เมื่อ `remainingSeconds > 0`: ปุ่ม "ตัดสิทธิ์ No-Show" ถูกปิดใช้งาน (disabled, สีเทา) แสดงข้อความ "รออีก XX วินาที"
   - เมื่อ `remainingSeconds === 0`: ปุ่มเปิดใช้งาน (enabled, สีแดง) แสดงข้อความ "ตัดสิทธิ์ No-Show"

### 2.6 Numbered Acceptance Criteria (AC: F-06)
* [ ] **AC-42.1 (Premature No-Show Rejection):** Box Master พยายามตัดสิทธิ์ก่อนเวลาครบ 120 วินาที (เช่น ผ่านไป 45 วินาที) ต้องได้รับ HTTP `400 NO_SHOW_WINDOW_NOT_EXPIRED` พร้อม `remainingSeconds` (ปัดขึ้น `Math.ceil`), ตั๋วคงสถานะ `CALLED` และพนักงานยังคงติด `STAFF_BUSY`
* [ ] **AC-42.2 (Clock Boundary Verification):**
  - ผ่านไป 119 วินาที (`Δt = 119s`) → HTTP `400 NO_SHOW_WINDOW_NOT_EXPIRED` (`remainingSeconds: 1`)
  - ผ่านไป 120 วินาที (`Δt = 120s`) → HTTP `200 OK` (สำเร็จ)
  - ผ่านไป 121 วินาที (`Δt = 121s`) → HTTP `200 OK` (สำเร็จ)
* [ ] **AC-42.3 (ServerNow Response Payload Synchronization):** Endpoint สำหรับจัดการคิวของตั๋ว active (`/api/tickets/my-ticket`, `/api/staff/call-next`, `GET /api/staff/tickets`) ต้องส่งคืนฟิลด์ `serverNow` (ISO 8601 String เช่น `"2026-11-24T15:00:00.000Z"`) ที่ได้จาก Application Clock (`clock.now().toISOString()`) เพื่อให้ฝั่ง Client ใช้คำนวณ Local Clock Offset ได้อย่างเที่ยงตรง
* [ ] **AC-43.1 (Successful No-Show Transition):** เมื่อเวลาผ่านไป ≥ 120 วินาที Box Master ผู้รับผิดชอบกดตัดสิทธิ์สำเร็จ ได้รับ HTTP 200, ตั๋วเปลี่ยนเป็น `NO_SHOW`, บันทึก `forfeitedAt` เป็นเวลาปัจจุบันจาก Application Clock
* [ ] **AC-43.2 (Staff Release from STAFF_BUSY):** ก่อน No-Show สำเร็จ พนักงานเรียก `call-next` จะติด `409 STAFF_BUSY`; ทันทีที่ตั๋วเปลี่ยนเป็น `NO_SHOW` พนักงานหลุดจาก `unique_active_staff_ticket` ([EV-A02](#appendix-b)) และสามารถเรียก `call-next` ได้รับ HTTP 200 และได้ตั๋วถัดไปทันที
* [ ] **AC-43.3 (Handler Exclusive Enforcement):** Box Master B พยายามกด No-Show ตั๋วที่ Box Master A เป็นผู้เรียกไว้ ต้องได้รับ HTTP `403 FORBIDDEN_NOT_HANDLER` แม้เวลาจะเกิน 120 วินาทีแล้วก็ตาม
* [ ] **AC-43.4 (Waiting Ticket Rejection):** การพยายามกด No-Show บนตั๋วสถานะ `WAITING` (ซึ่ง `handledByStaffId === null`) ต้องได้รับ HTTP `400 INVALID_STATE_TRANSITION` ([EV-A04](#appendix-b))
* [ ] **AC-43.5 (No-Show vs Start-Unboxing Concurrency):** คำขอ No-Show และ Start Unboxing ที่ส่งเข้ามาชนกัน ต้องมีเพียงคำขอเดียวที่สำเร็จ อีกคำขอต้องได้รับ HTTP `400 INVALID_STATE_TRANSITION`
* [ ] **AC-43.6 (Collector Immediate Re-join After No-Show):** Collector ที่ถูกตัดสิทธิ์ No-Show สามารถกด `POST /api/tickets/join` เพื่อรับบัตรคิวในซีรีส์เดิมได้ทันที และได้รับเลขคิวใหม่ท้ายแถวโดยไม่ติด Unique Constraint Violation ([EV-A02](#appendix-b))
* [ ] **AC-43.7 (Staff No-Show Access Guards):** Endpoint การตัดสิทธิ์ No-Show จำกัดสิทธิ์เฉพาะ Box Master เท่านั้น; หาก Collector พยายามเรียกใช้ต้องได้รับ HTTP 403 `FORBIDDEN_ROLE` ([EV-B01](#appendix-b)) และหากไม่ส่ง Authorization Header ต้องได้รับ HTTP 401 `UNAUTHENTICATED` ([EV-B01](#appendix-b))
* [ ] **AC-43.8 (Staff Countdown Timer & Button State UI):** หน้าจอ Box Master Console คำนวณเวลานับถอยหลัง `remainingSeconds = Math.max(0, Math.ceil((new Date(ticket.calledAt).getTime() + 120_000 - virtualServerNow) / 1000))`, แสดงผลนับถอยหลังบนปุ่ม, ทำการ Disable ปุ่ม "ตัดสิทธิ์ No-Show" ตลอดเวลาที่ Δt < 120s (และ Disable ระหว่างส่งคำขอ), และสลับสถานะเป็น Enabled ให้กดได้ทันทีเมื่อเวลาครบ Δt ≥ 120s (โดยผูกกับค่า `serverNow`)
* [ ] **AC-43.9 (Collector `/my-ticket` Server-Synced Countdown):** หน้าจอ Collector `/my-ticket` (`CountdownTimer.tsx`) รับ `calledAt` และ `serverNow` เพื่อแสดงเวลานับถอยหลังที่เหลือตรงกับเวลาเซิร์ฟเวอร์จริง ไม่รีเซ็ตกลับเป็น `02:00` เมื่อ Refresh หน้าเว็บ (ปิดข้อจำกัด `LIM-01` จาก Lab 6)
* [ ] **AC-43.10 (Cross-Series Rejection, Post-120s Start-Unboxing & State-Machine Unit Invariant):** Box Master ซีรีส์อื่นพยายามกด No-Show ต้องได้รับ HTTP `403 FORBIDDEN_SERIES` (และ Ticket ID ไม่มีอยู่จริง → `404 RESOURCE_NOT_FOUND`); หากผ่าน `>= 120s` แล้วยังไม่กด No-Show ผู้ Call ยังสามารถกด `start-unboxing` ได้สำเร็จ (`DEC-03`); และ `canTransition(status, 'NO_SHOW')` ต้องอนุญาตเฉพาะ `CALLED` เท่านั้น

### 2.7 Software Test Specification (STS: TEST-42, TEST-43)
| Test ID | Covered AC | Level | Test File | Preconditions | Inputs | Expected Output |
| :---: | :---: | :---: | :--- | :--- | :--- | :--- |
| **TEST-42A** | `AC-42.1`, `AC-42.2` | Boundary | `server/tests/api/no-show.test.ts` *(planned)* | Box Master เรียกตั๋ว, FakeClock +119s | `POST /api/staff/tickets/:id/no-show` แล้วตามด้วย `POST /api/staff/call-next` | No-Show ได้ HTTP `400 NO_SHOW_WINDOW_NOT_EXPIRED` (`remainingSeconds: 1`) และ `call-next` ยังติด `409 STAFF_BUSY` |
| **TEST-42B** | `AC-42.2` | Boundary | `server/tests/api/no-show.test.ts` *(planned)* | FakeClock +120s ตรง | `POST /api/staff/tickets/:id/no-show` | HTTP `200`, `status: "NO_SHOW"`, `forfeitedAt` recorded |
| **TEST-42C** | `AC-42.2` | Boundary | `server/tests/api/no-show.test.ts` *(planned)* | FakeClock +121s | `POST /api/staff/tickets/:id/no-show` | HTTP `200`, `status: "NO_SHOW"` |
| **TEST-42D** | `AC-42.3` | Integration | `server/tests/api/no-show.test.ts` *(planned)* | Server รันด้วย FakeClock | เรียก `/api/tickets/my-ticket`, `/api/staff/call-next`, `GET /api/staff/tickets` | Payload ส่งคืนฟิลด์ `serverNow` เป็น ISO 8601 string ที่ตรงกับ FakeClock |
| **TEST-43A** | `AC-43.1`, `AC-43.2` | Integration | `server/tests/api/no-show.test.ts` *(planned)* | ก่อน No-Show (<120s) | Box Master `POST /api/staff/call-next` | HTTP `409 STAFF_BUSY` |
| **TEST-43B** | `AC-43.1`, `AC-43.2` | Integration | `server/tests/api/no-show.test.ts` *(planned)* | หลัง No-Show สำเร็จ (≥120s) | Box Master `POST /api/staff/call-next` | HTTP `200`, ได้ตั๋วใบถัดไป, หลุด BUSY สำเร็จ |
| **TEST-43C** | `AC-43.3` | Security | `server/tests/api/no-show.test.ts` *(planned)* | FakeClock +150s, Box Master B ล็อกอิน | Box Master B `POST /no-show` ตั๋วของ A | HTTP `403 FORBIDDEN_NOT_HANDLER`, ตั๋วยังเป็น `CALLED` |
| **TEST-43D** | `AC-43.4` | Validation | `server/tests/api/no-show.test.ts` *(planned)* | ตั๋วสถานะ `WAITING` | Box Master `POST /no-show` ตั๋วนี้ | HTTP `400 INVALID_STATE_TRANSITION` |
| **TEST-43E** | `AC-43.6` | Integration | `server/tests/api/no-show.test.ts` *(planned)* | Collector ถูกตัด No-Show | Collector `POST /api/tickets/join` ซีรีส์เดิม | HTTP `201`, ได้เลขคิวใหม่ท้ายแถว |
| **TEST-43F** | `AC-43.5` | Concurrency | `server/tests/concurrency/no-show-race.test.ts` *(planned)* | ตั๋ว `CALLED`, No-Show ชนกับ Start-Unboxing | Parallel Promise.all() | สำเร็จ 1 คำขอ, อีกฝั่งได้รับ 400 INVALID_STATE_TRANSITION |
| **TEST-43G** | `AC-43.7` | Security | `server/tests/api/no-show.test.ts` *(planned)* | Collector ล็อกอิน | `POST /api/staff/tickets/:id/no-show` | HTTP `403 FORBIDDEN_ROLE` ([EV-B01](#appendix-b)) |
| **TEST-43H** | `AC-43.7` | Security | `server/tests/api/no-show.test.ts` *(planned)* | ไม่ส่ง Authorization Header | `POST /api/staff/tickets/:id/no-show` | HTTP `401 UNAUTHENTICATED` ([EV-B01](#appendix-b)) |
| **TEST-43I** | `AC-43.8` | Component / E2E | `client/src/tests/staff.test.tsx` *(planned)* | ตั๋วสถานะ `CALLED` | ตรวจสอบสถานะปุ่ม No-Show | แสดงตัวเลขนับถอยหลัง `Math.ceil()`, ปุ่ม disabled ในช่วง 0–119s และ enabled อัตโนมัติเมื่อครบ 120s |
| **TEST-43J** | `AC-43.9` | Component | `client/src/tests/ticket.test.tsx` *(planned)* | Collector `/my-ticket` รับ `calledAt` ผ่านมาแล้ว 45s + `serverNow` | Mount / Re-mount `<CountdownTimer />` | แสดงเวลาคงเหลือ `01:15` (ไม่รีเซ็ตกลับ `02:00` เมื่อ remount/refresh) |
| **TEST-43K** | `AC-43.10` | Security / Boundary | `server/tests/api/no-show.test.ts` *(planned)* | (1) `staff_labubu` กด no-show ตั๋ว `CRY`; (2) nonexistent UUID; (3) `staff_crybaby` กด `start-unboxing` ที่ +150s (`DEC-03`) | ยิง API ทั้ง 3 กรณี | (1) `403 FORBIDDEN_SERIES`; (2) `404 RESOURCE_NOT_FOUND`; (3) `200 UNBOXING` |
| **TEST-43U** | `AC-43.10` | Unit | `server/tests/unit/state-machine.test.ts` | State machine transition validator | ตรวจทุกสถานะ → `'NO_SHOW'` | อนุญาตเฉพาะ `CALLED`; ปฏิเสธ `WAITING`, `UNBOXING`, `COMPLETED`, `CANCELLED`, `NO_SHOW` |

### 2.8 Definition of Done (DoD) — F-06
- [ ] Service method `noShow` ใน `staff.service.ts` พร้อม FakeClock boundary check
- [ ] บันทึก `[RED]` commit SHA และ `[GREEN]` commit SHA
- [ ] Regression Suite เดิม (194 tests) รันผ่าน 100% ([EV-A07](#appendix-b))
- [ ] UI CountdownTimer, Disabled/Enabled Button, Modal และ Toast บน Staff Console
- [ ] เพิ่ม `serverNow` ใน response ของ API 3 ตัวครบถ้วน

---

## 3. Feature Contract: F-07 Public Queue Display Board (จอบอร์ดแสดงคิวสาธารณะหน้าร้าน)

### 3.1 Purpose & Scope
จัดเตรียมหน้าจอแสดงผลคิวสาธารณะสำหรับติดตั้งหน้าร้าน Art Toy เพื่อให้ลูกค้ามองเห็นคิวที่กำลังให้บริการและคิวรอถัดไปได้จากระยะไกล โดยไม่ต้องล็อกอิน  
* **ข้อกำหนดความเป็นส่วนตัวขั้นเด็ดขาด (NFR-02):** ต้องไม่มีข้อมูลส่วนบุคคล (Zero PII) ใน API Response เด็ดขาด ใช้ Prisma `select` projection ที่ระดับ Database Query ห้าม Query ออกมาแล้วตัดทิ้ง  
* **ความสอดคล้องของชุดข้อมูล (Dataset & FIFO Consistency — FACTS F6):** เพื่อให้รายการ "คิวถัดไป" (Up Next) ตรงกับสิ่งที่ Box Master จะกดเรียกจริง บอร์ดสาธารณะต้องใช้การเรียงลำดับและชุดข้อมูลเดียวกับ `call-next` คือ:  
  `ORDER BY queueDate ASC, queueNumber ASC` โดย **ไม่กรองวันที่** ([EV-B05](#appendix-b))  
* **Known Limitation G-07 (Overnight Leftover Tickets):** หากมีตั๋วค้างข้ามคืน ตั๋วของวันก่อนหน้าจะแสดงในหมวด Up Next ก่อนตั๋วของวันนี้ และอาจเกิดเลขคิว `displayNumber` ซ้ำกันข้ามวันเนื่องจากตัวนับรีเซ็ตรายวัน ([EV-B03](#appendix-b)) ซึ่งเป็นพฤติกรรมที่ยอมรับได้ในข้อจำกัดทางสถาปัตยกรรมปัจจุบัน (บันทึก ณ วันที่ 2026-11-24)

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


* **กฎการรวมและเรียงลำดับ Now Serving:** ฟิลด์ `nowServing` รวมตั๋วทั้งสถานะ `CALLED` และ `UNBOXING` ของซีรีส์นั้น ในกรณีที่มี Box Master มากกว่า 1 คนประจำการในซีรีส์เดียวกัน (เช่น `staff_crybaby` และ `staff_crybaby2` ประจำซีรีส์ `CRY` พร้อมกัน) ให้เรียงลำดับตั๋วใน `nowServing` ด้วย `calledAt ASC` (ตั๋วที่ถูกเรียกก่อนอยู่ด้านบน/ทางซ้าย)
* **การกรองซีรีส์ที่ปิดบริการ (Closed Series Filtering Invariant):**
  - ซีรีส์ที่ปิดบริการ (`isActive: false`) และ **ไม่มีตั๋วค้าง** ในระบบ (`waitingCount === 0` และ `nowServing.length === 0`) จะถูกกรองออกจากรายการ `boards[]` ตั้งแต่ระดับ API Backend (`server/src/services/public.service.ts`) เพื่อไม่ให้เปลือง Bandwidth และลดภาระของ Client
  - ซีรีส์ที่ปิดบริการ (`isActive: false`) แต่ **ยังมีตั๋วค้าง** ในระบบ (`waitingCount > 0` หรือ `nowServing.length > 0`) จะยังคงถูกส่งคืนใน `boards[]` เพื่อให้หน้าจอแสดงการ์ดพร้อมป้าย Badge สีส้ม "ปิดรับคิวใหม่" และให้บริการตั๋วเดิมจนจบกระบวนการ
* **พฤติกรรมซีรีส์เปิดแต่ไม่มีคิว (Open Series with Zero Queue):** หากซีรีส์มีสถานะเปิดให้บริการ (`isActive: true`) แต่ปัจจุบันมีจำนวนคิวรอเป็น 0 ใบ ระบบจะยังคงแสดงการ์ดซีรีส์ดังกล่าวบน Public Board (`/board`) โดยแสดง Now Serving เป็น "-" และ Up Next เป็นข้อความแจ้งเตือน "ไม่มีคิวรอในขณะนี้" (ไม่ถูกซ่อนจากบอร์ด)

### 3.4 UI Specification: หน้า /board
* **Route:** `/board` (Public Route ไม่แสดงปุ่ม Login)
* **Layout:** Kiosk-style full-screen, Art Toy theme, ตัวอักษรใหญ่อ่านง่ายจากระยะ 3 เมตร
* **Integer Sorting Rule:** จัดเรียงลำดับคิวด้วย `queueNumber` (Int) ไม่เรียงด้วยตัวอักษรสตริง เพื่อป้องกันข้อผิดพลาดกรณีเลขคิว 9 และ 10
* **Closed Series Handling:** หากซีรีส์ถูกตั้งเป็น `isActive: false` แต่ยังมีตั๋ว Active ตกค้างอยู่ ให้แสดงการ์ดซีรีส์บนบอร์ดพร้อมป้าย Badge สีส้ม "ปิดรับคิวใหม่" (Closed for new joins) เพื่อให้บริการตั๋วเดิมจนจบ
* **Auto-Refresh & Degraded Error State:** Polling API ทุก 3 วินาที (`3000ms`); หาก API ล่มหรือขาดการเชื่อมต่อ หน้าจอ `/board` ต้องแสดงแบนเนอร์แจ้งเตือนสถานะเชื่อมต่อขัดข้อง ("กำลังเชื่อมต่อเซิร์ฟเวอร์ใหม่...") แทนการค้างข้อมูลเก่าแบบเงียบๆ
* **Responsive (NFR-06):** รองรับจอ TV แนวนอน 1920×1080, Tablet 768px, และ Mobile 375px โดยไม่มีการตัดตกหรือเกิด Horizontal Overflow
* **Empty State:** เมื่อไม่มีตั๋ว Active ในซีรีส์ แสดงข้อความ "ไม่มีคิวรอในขณะนี้"

### 3.5 Numbered Acceptance Criteria (AC: F-07)
* [ ] **AC-44.1 (Unauthenticated Public Access):** เรียก `GET /api/public/queue-board` โดยไม่ส่ง Token เข้าถึงได้สำเร็จ (HTTP 200 OK)
* [ ] **AC-44.2 (Zero PII Assertion on Response Values):** ตรวจสอบ JSON Response body ทุกระดับ ต้องไม่พบข้อมูลส่วนบุคคลใดๆ ทั้งในแง่คีย์และค่า (Value String Check): ไม่พบ `userId`, `username`, `passwordHash`, `fullName`, `tokenVersion`, `handledByStaffId` ใน `JSON.stringify(body)`
* [ ] **AC-44.3 (UpNext Limit & Waiting Count Accuracy):** ในกรณีที่มีคิวรอ 5 ใบ (`upNext.length === 5`), 6 ใบ (`upNext.length === 5`, `waitingCount === 6`), หรือมากกว่า 5 ตั๋ว รายการ `upNext` ต้องไม่เกิน `UP_NEXT_LIMIT` (5 ใบ) และค่า `waitingCount` ต้องแสดงจำนวนคิวรอจริงทั้งหมด
* [ ] **AC-44.4 (Integer Sorting Assertion):** รายการใน `upNext` ต้องเรียงตาม `queueNumber` (ตัวเลขจำนวนเต็ม) อย่างถูกต้อง โดยคิวหมายเลข 9 ต้องแสดงก่อนหมายเลข 10
* [ ] **AC-44.5 (Closed Series Visibility with Badge):** ซีรีส์ที่ปิดรับคิว (`isActive: false`) หากยังมีตั๋ว Active ค้างอยู่ ต้องแสดงบนบอร์ดพร้อมป้าย "ปิดรับคิวใหม่" (`isActive: false`)
* [ ] **AC-44.6 (Excluded Status Filtering):** ตั๋วสถานะ `NO_SHOW`, `CANCELLED`, และ `COMPLETED` ต้องไม่ปรากฏใน `nowServing`, `upNext`, หรือ `waitingCount`
* [ ] **AC-44.7 (Responsive Display Across Viewports):** หน้าเว็บ `/board` แสดงผลได้ถูกต้องบน Viewport ขนาด 1920×1080 (TV), 768px (Tablet), และ 375px (Mobile) โดยไม่ล้นจอ
* [ ] **AC-44.8 (Board Polling, Ordering, Empty/Hidden Rules & Degraded UI):** (1) `/board` อัปเดตอัตโนมัติผ่าน 3s polling โดยไม่ reload และแสดงแบนเนอร์ error เมื่อ API ล้มเหลว; (2) `nowServing` เรียงตาม `calledAt ASC`; (3) ซีรีส์ปิดที่ไม่มีตั๋วค้างถูกซ่อน (`DEC-04`), ขณะที่ซีรีส์เปิดที่ไม่มีคิวรอต้องยังแสดงการ์ดว่าง

### 3.6 Software Test Specification (STS: TEST-44)
| Test ID | Covered AC | Level | Test File | Preconditions | Inputs | Expected Output |
| :---: | :---: | :---: | :--- | :--- | :--- | :--- |
| **TEST-44A** | `AC-44.1`, `AC-44.2`, `AC-44.6` | Security | `server/tests/api/public-board.test.ts` *(planned)* | มีตั๋ว WAITING, CALLED, UNBOXING, COMPLETED, NO_SHOW, CANCELLED | `GET /api/public/queue-board` ไม่ส่ง auth | HTTP `200`, ค่า Seed username/name ไม่ปรากฏใน body string, ตั๋ว inactive ไม่แสดง |
| **TEST-44B** | `AC-44.3` | Integration | `server/tests/api/public-board.test.ts` *(planned)* | ทดสอบ boundary ที่ 5, 6 และ 8 ตั๋ว (คิว 4..11) | `GET /api/public/queue-board` | ที่ 5 → `upNext=5/waiting=5`; ที่ 6 → `upNext=5/waiting=6`; ที่ 8 → `upNext=5/waiting=8` เรียง 4 ถึง 8 |
| **TEST-44C** | `AC-44.8` | E2E | `e2e/public-board.spec.ts` *(planned)* | หน้า `/board` เปิดอยู่, เปลี่ยนสถานะตั๋วผ่าน API และจำลอง API error | รอ ≤ 5 วินาที | หน้าจอ `/board` อัปเดตอัตโนมัติ (3s polling + buffer CI) และแสดงแบนเนอร์เตือนเมื่อ API ล่ม |
| **TEST-44D** | `AC-44.5` | Integration | `server/tests/api/public-board.test.ts` *(planned)* | ซีรีส์ CRY ปิด (`isActive: false`) แต่มีคิวรอ 1 ใบ | `GET /api/public/queue-board` | การ์ด CRY ปรากฏบนบอร์ด, `isActive: false`, `waitingCount === 1`, ป้าย `"ปิดรับคิวใหม่"` |
| **TEST-44E** | `AC-44.4` | Boundary | `server/tests/api/public-board.test.ts` *(planned)* | มีตั๋วคิว 9 และคิว 10 ในระบบ | `GET /api/public/queue-board` | `upNext[0].queueNumber === 9`, `upNext[1].queueNumber === 10` |
| **TEST-44F** | `AC-44.7` | UI/E2E | `e2e/responsive.spec.ts` *(planned)* | เข้าหน้า `/board` ด้วย Viewport 1920×1080, 768×1024, 375×667 | ตรวจสอบ bounding box | ไม่มี horizontal scrollbar, font ขนาดอ่านง่าย |
| **TEST-44G** | `AC-44.8` | Integration | `server/tests/api/public-board.test.ts` *(planned)* | (1) `CRY` มี 2 ตั๋ว `nowServing` ต่างเวลา `calledAt`; (2) `SKP` ปิดและไม่มีตั๋ว (`DEC-04`); (3) `LAB` เปิดและมี 0 คิว | `GET /api/public/queue-board` | `nowServing` เรียง `calledAt ASC`; `SKP` ถูกซ่อนจาก `boards[]`; `LAB` ยังแสดงพร้อม `waitingCount: 0` |

### 3.7 Definition of Done (DoD) — F-07
- [ ] Route `/api/public/queue-board` เป็น Public ไม่ผ่าน auth middleware
- [ ] ใช้ Prisma `select` projection ปลอด PII ทั้งหมด ([EV-A07](#appendix-b), `TEST-44A`)
- [ ] บันทึก `[RED]` → `[GREEN]` commit chain
- [ ] หน้าเว็บ UI `/board` Kiosk-style Responsive + Polling 3 วินาที
- [ ] PR Review และ CI ผ่านครบถ้วน

---

# Part C: Sprint 3 Contracts and Working Progress (15 คะแนน)

## 1. Feature Contract: F-08 Daily Service Analytics (สถิติบริการประจำวัน)

### 1.1 Purpose & Scope
สรุปข้อมูลเชิงสถิติเกี่ยวกับประสิทธิภาพการให้บริการประจำวัน เพื่อให้ `BOX_MASTER` (ในบทบาทผู้ดูแลประจำซีรีส์ตาม `D-01` ซึ่งไม่มี Role Manager/Admin แยก) ประเมินจำนวนคิว อัตรา No-Show และเวลารอเฉลี่ยเฉพาะซีรีส์ที่ตนได้รับมอบหมาย  
* **Actor & Permission:** `BOX_MASTER` เท่านั้น (`403 FORBIDDEN_ROLE` สำหรับ Collector, `401 UNAUTHENTICATED` กรณีไม่ส่ง Token)  
* **นิยามของ "วัน" (Queue Date Partition — FACTS F3):** สถิติจะถูกกรองและจัดกลุ่มตามฟิลด์ **`queueDate`** (`Asia/Bangkok` Date string) ซึ่งเป็นฟิลด์หลักในการออกเลขคิวประจำวัน ([EV-B03](#appendix-b)) ไม่ใช้ `createdAt` เพื่อป้องกันปัญหา Timezone drift
* **หมายเหตุสูตร `noShowRate`:** ใช้สูตรที่ทีมกำหนดคือ $\frac{\text{noShowCount}}{\text{completedCount} + \text{noShowCount}}$ เพื่อวัดอัตราการไม่มาตามนัดจากตั๋วที่ถูกเรียกและจบกระบวนการเรียกแล้ว โดยไม่รวมตั๋ว `CANCELLED` ที่ลูกค้าแจ้งยกเลิกเองล่วงหน้าก่อนถูกเรียก

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
* [ ] **AC-45.2 (Role, Auth & Series Scope Authorization):** ไม่ส่ง Token ได้รับ `401 UNAUTHENTICATED`; Collector เข้าถึงได้รับ `403 FORBIDDEN_ROLE`; Box Master ระบุ `seriesId` นอกเหนือหน้าที่ได้รับ `403 FORBIDDEN_SERIES`
* [ ] **AC-45.3 (Mathematical Precision of Averages):** คำนวณ `avgWaitTimeSeconds`, `avgServiceTimeSeconds`, และ `noShowRate` ถูกต้องตามสูตร หากตัวหารเป็น 0 คืนค่า 0
* [ ] **AC-45.4 (Date Validation Rejection):** ส่งพารามิเตอร์ `date` ผิดรูปแบบต้องได้รับ HTTP `400 VALIDATION_ERROR`

| Test ID | Covered AC | Level | Test File | Inputs | Expected Output |
| :---: | :---: | :---: | :--- | :--- | :--- |
| **TEST-45A** | `AC-45.1`, `AC-45.3` | Integration | `server/tests/api/analytics.test.ts` *(planned)* | มีตั๋ว Completed 18, No-Show 2, Cancelled 3, Waiting 2 | `completedCount: 18`, `noShowRate: 0.10`, `totalTickets: 25` |
| **TEST-45B** | `AC-45.2` | Security | `server/tests/api/analytics.test.ts` *(planned)* | (1) No Auth header; (2) Collector JWT; (3) `staff_labubu` ขอ `?seriesId=<CRY_ID>` | (1) `401 UNAUTHENTICATED`; (2) `403 FORBIDDEN_ROLE`; (3) `403 FORBIDDEN_SERIES` |
| **TEST-45C** | `AC-45.3` | Boundary | `server/tests/api/analytics.test.ts` *(planned)* | วันที่ไม่มีตั๋ว (`date=2026-01-01`) | HTTP `200`, ทุกค่าเป็น `0`, `noShowRate: 0` |
| **TEST-45D** | `AC-45.1`, `AC-45.3` | Unit/Prisma | `server/tests/api/analytics.test.ts` *(planned)* | Seed ตั๋วด้วย Prisma โดยตรงพร้อมกำหนด Timestamps คงที่ | ยืนยันผลคำนวณเฉลี่ยตรงกับผลลัพธ์คำนวณมือ (ไม่ใช้ FakeClock กับ `createdAt` — [EV-B03](#appendix-b)) |
| **TEST-45E** | `AC-45.4` | Validation | `server/tests/api/analytics.test.ts` *(planned)* | `date=2026-99-99` | HTTP `400 VALIDATION_ERROR` |

### 1.6 Database & Migration Impact
* **Database & Migration Impact:** `None` (ใช้ข้อมูลและฟิลด์ `calledAt`, `startedAt`, `completedAt`, `forfeitedAt` ที่มีอยู่แล้วใน `QueueTicket` ไม่มีการสร้าง Migration ใหม่)

### 1.7 Definition of Done (DoD) — F-08
- [ ] พัฒนา Aggregation Query คำนวณ Avg Wait Time, Total Served, No-Show Count และ No-Show Rate (0.10) ถูกต้องแม่นยำตามสูตรคณิตศาสตร์
- [ ] ชุดทดสอบ Vitest `server/tests/api/analytics.test.ts` (`TEST-45A..45E`) ผ่านครบทุกข้อ
- [ ] หน้ารายงานสถิติบน Staff Console แสดงผลถูกต้องแยกตามซีรีส์และ `queueDate`

---

## 2. Feature Contract: F-09 Series Availability Control (เปิด-ปิดซีรีส์) — Planned (Sprint 3 Working Progress Target; Baseline 409 Existing)

ทีมงานตั้งใจกำหนดให้ **`F-09`** เป็น Genuine Working Progress ในการส่งมอบ Deliverable 2 โดยสลับลำดับภายใน Sprint 3 จากแผนเดิมใน D1 (`F-08 initial version`) มาทำ `F-09` ก่อน (บันทึกเหตุผลไว้ใน **`DEC-06`** เพื่อไม่ต้องรอข้อมูล `F-06` ของ `F-08` เสร็จก่อน และสามารถพัฒนาขนานได้ตั้งแต่หลัง `F-06`) โดยส่วนที่ baseline มีอยู่เดิมคือการปฏิเสธการจองตั๋วในซีรีส์ที่ปิด (`BR-09` / `AC-12`: HTTP `409 SERIES_CLOSED`) ส่วนงานพัฒนาใหม่ใน `D2-I5` คือ `PATCH /api/staff/series/:id/status`, การส่ง `isActive` ใน `GET /api/staff/tickets`, สวิตช์เปิด-ปิดบน `StaffCounterPage.tsx`, และชุดทดสอบ `TEST-46A..46F`

### 2.1 Purpose & Scope
อนุญาตให้ Box Master สามารถสลับสถานะเปิด (`isActive: true`) หรือปิด (`isActive: false`) ซีรีส์ที่ตนได้รับมอบหมายเท่านั้น  
* **ผลลัพธ์เมื่อปิดซีรีส์ (AC-46.4 / CF-04 / CF-05):**
  - ตั๋วเดิมที่ค้างอยู่ในคิว (`WAITING`, `CALLED`, `UNBOXING`) ยังคงสามารถ Call Next, Start Unboxing และ Complete ได้ตามปกติจนจบกระบวนการ
  - คำขอ `POST /api/tickets/join` ใหม่จะถูกปฏิเสธด้วย HTTP `409 SERIES_CLOSED` (สอดคล้องกับ `ticket.service.ts` เดิม)
  - บน Public Board ซีรีส์ที่ปิดยังคงแสดงอยู่หากมีตั๋วค้าง พร้อมป้าย Badge "ปิดรับคิวใหม่"

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
  3. `400 VALIDATION_ERROR`: `:id` ไม่ใช่ UUID หรือ Body ไม่ใช่ boolean เช่น `{ "isActive": "no" }`
  4. `404 RESOURCE_NOT_FOUND`: ไม่พบซีรีส์ ID ที่ระบุ
  5. `403 FORBIDDEN_SERIES`: Box Master ไม่ได้รับมอบหมายให้ดูแลซีรีส์นี้

### 2.3 Database & Migration Impact
* **Database & Migration Impact:** `None` (ใช้ฟิลด์ `Series.isActive` ที่มีอยู่แล้วใน `schema.prisma` ไม่มีการสร้าง Migration ใหม่)

### 2.4 UI Specification: หน้าจอ Staff Console (`client/src/pages/StaffCounterPage.tsx`)
* **Toggle Switch Component:** เพิ่ม Toggle Switch สำหรับเปิด-ปิดซีรีส์ที่หัวการ์ดประจำซีรีส์แต่ละใบ
* **API Response Enhancement:** ปรับปรุง `GET /api/staff/tickets` โดยให้ DTO `StaffSeriesQueueDto` ใน `server/src/services/staff.service.ts` และ `client/src/types/index.ts` ส่งคืนฟิลด์ **`isActive: boolean`** มาด้วย *(หมายเหตุสำคัญ: ห้ามนำ `isActive` ไปกรอง `WHERE` ออกจากรายการของ `getStaffTickets` เพื่อคงให้พนักงานเห็นและเคลียร์คิวเดิมในซีรีส์ที่ปิดได้)*
* **Interactive UI States:**
  - สวิตช์แสดงสถานะ Checked / สีเขียว เมื่อ `isActive: true` ("เปิดรับคิว") และ Unchecked / สีเทา เมื่อ `isActive: false` ("ปิดรับคิว")
  - ขณะส่งคำขอ `PATCH /api/staff/series/:id/status` ให้แสดง Loading Spinner และ Disable สวิตช์ชั่วคราวเพื่อป้องกัน Double Click
  - เมื่อคำขอสำเร็จ แสดง Toast ยืนยัน ("เปิดรับคิวสำเร็จ" / "ปิดรับคิวเรียบร้อย") และปรับ Badge บนการ์ดทันที
  - หากได้รับ HTTP `403 FORBIDDEN_SERIES` หรือเกิดข้อผิดพลาด ให้ย้อนกลับสวิตช์สู่สถานะเดิมและแสดง Error Toast แจ้งเตือน

### 2.5 Acceptance Criteria (AC: F-09) & Test Spec (TEST-46)
* [ ] **AC-46.1 (Authorized Status Toggle):** Box Master ประจำซีรีส์สามารถเปลี่ยนสถานะ `isActive` ได้สำเร็จ (HTTP 200)
* [ ] **AC-46.2 (Join Prevention on Closed Series):** ทันทีที่ซีรีส์ถูกตั้งเป็น `isActive: false` Collector ที่พยายาม Join ต้องได้รับ HTTP `409 SERIES_CLOSED`
* [ ] **AC-46.3 (Auth, Role, Validation, Not-Found & Unauthorized Series Rejection):** ไม่ส่ง Token → `401 UNAUTHENTICATED`; Collector → `403 FORBIDDEN_ROLE`; Body ผิดรูปแบบ (`{ isActive: "disabled" }`) → `400 VALIDATION_ERROR`; Series ID ไม่มีอยู่จริง → `404 RESOURCE_NOT_FOUND`; Box Master ที่ไม่ได้ดูแลซีรีส์นี้ → `403 FORBIDDEN_SERIES`
* [ ] **AC-46.4 (Existing Tickets Continuity Across All States):** หลังซีรีส์ปิด ตั๋ว `WAITING` สามารถ Call Next ได้, ตั๋ว `CALLED` สามารถ Start Unboxing ได้, และตั๋ว `UNBOXING` สามารถ Complete ได้ตามปกติ (ยืนยันด้วย `git grep -n "isActive" -- server/src` ใน [EV-B05](#appendix-b) ว่าใน `server/src/services/staff.service.ts` ทั้ง `getStaffTickets`, `callNext`, `startUnboxing`, และ `complete` ไม่มีการตรวจ `series.isActive` เลย มีเฉพาะ `ticket.service.ts::joinQueue` จุดเดียวเท่านั้นที่บล็อกด้วย `409 SERIES_CLOSED`)
* [ ] **AC-46.5 (Idempotency & Re-open Validation):** ส่งสถานะเดิมซ้ำได้รับ HTTP 200 (Idempotent); เปิดกลับ `isActive: true` ทำให้ Collector กลับมา Join ได้ปกติ (`201 Created`)

| Test ID | Covered AC | Level | Test File | Inputs | Expected Output |
| :---: | :---: | :---: | :--- | :--- | :--- |
| **TEST-46A** | `AC-46.1` | Integration | `server/tests/api/series-toggle.test.ts` *(planned)* | Box Master CRY: `PATCH /status` `{ isActive: false }` | HTTP `200`, `isActive: false` |
| **TEST-46B** | `AC-46.2` | Integration | `server/tests/api/series-toggle.test.ts` *(planned)* | ซีรีส์ CRY ปิดอยู่, Collector `POST /api/tickets/join` | HTTP `409 SERIES_CLOSED` (สอดคล้อง AC-12) |
| **TEST-46C** | `AC-46.3` | Security | `server/tests/api/series-toggle.test.ts` *(planned)* | Box Master LAB พยายามปิดซีรีส์ CRY | HTTP `403 FORBIDDEN_SERIES` |
| **TEST-46D** | `AC-46.4` | Continuity | `server/tests/api/series-toggle.test.ts` *(planned)* | ซีรีส์ CRY ปิด, แต่มีตั๋ว WAITING, CALLED, UNBOXING | ทดสอบ Call, Start, Complete สำเร็จทั้ง 3 ขั้นตอน |
| **TEST-46E** | `AC-46.5` | Integration / Idempotency | `server/tests/api/series-toggle.test.ts` *(planned)* | ส่ง `PATCH { isActive: false }` ซ้ำ 2 รอบ → จากนั้นส่ง `PATCH { isActive: true }` แล้ว Collector กด Join | รอบซ้ำได้ HTTP `200` (Idempotent); เปิดกลับได้ `200` และ Collector Join สำเร็จ `201 Created` |
| **TEST-46F** | `AC-46.3` | Security / Validation | `server/tests/api/series-toggle.test.ts` *(planned)* | (1) No auth header; (2) Collector JWT; (3) Body `{ isActive: "disabled" }`; (4) Nonexistent Series UUID | (1) `401 UNAUTHENTICATED`; (2) `403 FORBIDDEN_ROLE`; (3) `400 VALIDATION_ERROR`; (4) `404 RESOURCE_NOT_FOUND` |

### 2.6 Definition of Done (DoD) — F-09
- [ ] พัฒนา Endpoint `PATCH /api/staff/series/:id/status` สำเร็จพร้อม Auth, Role, Validation, 404 & Series Ownership Guard
- [ ] ปรับปรุง `GET /api/staff/tickets` ให้คืนฟิลด์ `isActive: boolean` ของแต่ละซีรีส์อย่างถูกต้อง (โดยไม่กรองซีรีส์ปิดออก)
- [ ] ชุดทดสอบ Vitest `server/tests/api/series-toggle.test.ts` (`TEST-46A..46F`) ผ่านครบทุกข้อ
- [ ] ติดตั้ง Toggle Switch บน `StaffCounterPage.tsx` พร้อม Loading/Disabled/Toast states ครบถ้วน

---

## 3. Contract: S3-HARDEN Rate Limiting & System Hardening

### 3.1 Database & Migration Impact
* **Database & Migration Impact:** `None` (ใช้ In-Memory Store สำหรับ Rate Limiter ชั่วคราว ไม่แตะต้องฐานข้อมูล)

### 3.2 Technical Specification, Reverse Proxy Trust & Zod Schema
* **Express Proxy Trust Configuration:** กำหนดจำนวน Proxy Hop จาก Environment Config ใน `server/src/app.ts`:  
  `app.set('trust proxy', config.TRUST_PROXY_HOPS);`  
  *(ค่าตั้งต้น `1` hop สำหรับ Google Cloud Run เพื่ออ่าน Client IP จาก hop แรกของ `X-Forwarded-For` อย่างถูกต้อง และป้องกัน IP Spoofing; การทดสอบจริงบน Cloud Run ถือเป็น NOT RUN จนกว่ามนุษย์จะรัน live check)*
* **Configurable Limits via Environment Variables & Zod Schema:**
  กำหนดตัวแปรสภาพแวดล้อมลงใน Zod schema (`envSchema`) ใน `server/src/config/env.ts` พร้อมค่า Default:
  - `RATE_LIMIT_WINDOW_MS`: `z.coerce.number().default(900000)` (15 นาที)
  - `RATE_LIMIT_MAX`: `z.coerce.number().default(10)` (10 คำขอต่อ IP)
  - `TRUST_PROXY_HOPS`: `z.coerce.number().default(1)` (1 hop สำหรับ Cloud Run)
  พร้อมอัปเดตไฟล์ `.env.example`, `server/.env.example`, และตรวจความสอดคล้องใน `server/tests/env.test.ts`
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

### 3.3 Acceptance Criteria (AC: S3-HARDEN) & Test Spec (TEST-47)
* [ ] **AC-47.1 (Rate Limit Enforcement):** ส่งคำขอ Login ครั้งที่ 11 จาก IP เดียวกันภายใน Window ต้องได้รับ HTTP `429 RATE_LIMIT_EXCEEDED` พร้อม Header `Retry-After`
* [ ] **AC-47.2 (IP Isolation under Multi-Hop):** คำขอจาก IP A ที่ชน Limit ต้องไม่ส่งผลกระทบต่อคำขอจาก IP B
* [ ] **AC-47.3 (Public & Health Exemption):** เรียก `/api/health`, `/api/v1/health` หรือ `/api/public/queue-board` ต่อเนื่องเกิน 10 ครั้ง ต้องไม่ติด 429

| Test ID | Covered AC | Level | Test File | Inputs | Expected Output |
| :---: | :---: | :---: | :--- | :--- | :--- |
| **TEST-47A** | `AC-47.1` | Security | `server/tests/security/rate-limit.test.ts` *(planned)* | ยิง `POST /api/auth/login` 11 ครั้งจาก IP เดียวกัน | ครั้งที่ 1–10: 200/401; ครั้งที่ 11: HTTP `429` |
| **TEST-47B** | `AC-47.1` | Boundary | `server/tests/security/rate-limit.test.ts` *(planned)* | หลัง Window reset | ยิง Login อีกครั้ง → สำเร็จ ไม่ติด 429 |
| **TEST-47C** | `AC-47.3` | Exemption | `server/tests/security/rate-limit.test.ts` *(planned)* | ยิง `GET /api/public/queue-board` 20 ครั้ง และ `/api/health` 20 ครั้ง | HTTP `200` ทุกครั้ง ไม่มี 429 |
| **TEST-47D** | `AC-47.2` | Integration | `server/tests/security/rate-limit.test.ts` *(planned)* | ส่ง X-Forwarded-For: Client A ชน limit, Client B ทดสอบ | Client A ได้ 429; Client B ได้รับ 200/401 ไม่กระทบ |

### 3.4 Definition of Done (DoD) — S3-HARDEN
- [ ] ติดตั้ง `express-rate-limit` และจำกัดเฉพาะ `POST /api/auth/login` โดยไม่กระทบ `/api/health` หรือ `/api/public/queue-board`
- [ ] เพิ่ม `RATE_LIMIT_*` และ `TRUST_PROXY_HOPS` ใน `server/src/config/env.ts` และ `.env.example` / `server/.env.example`
- [ ] ชุดทดสอบ Vitest `server/tests/security/rate-limit.test.ts` (`TEST-47A..47D`) ผ่านครบทุกข้อ
- [ ] กำหนด `app.set('trust proxy', config.TRUST_PROXY_HOPS)` (ค่าตั้งต้น `1`) ใน `server/src/app.ts` เรียบร้อย

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

### 1.2 สมมติฐานและข้อจำกัดของโดเมน (Assumptions — Spec §8.1)
* **A-01 (Timezone & Daily Reset):** `queueDate` คำนวณตามเวลาไทย `Asia/Bangkok (UTC+7)` เลขคิวเริ่มที่ 1 ใหม่ทุกเที่ยงคืนเวลาไทย ควบคุมด้วย Application Clock Injection (`Clock` / `FakeClock`)
* **A-02 (Payment-First Operational Flow):** ลูกค้าชำระเงินซื้อกล่องสุ่มที่แคชเชียร์หลักเรียบร้อยแล้ว จึงเดินมาโซน Unboxing เพื่อกด Join คิวในเว็บแอป ดังนั้นกรณี `NO_SHOW` หมายถึงลูกค้าที่ชำระเงินแล้วเสียสิทธิ์คิวบริการแกะกล่องรอบนั้น (สิทธิ์ในสินค้ายังอยู่และรับคิวใหม่ต่อท้ายแถวได้ตาม `DEC-02`)
* **A-03 (Verify & Start Counter Verification & Box Policy):** การกด `Verify & Start Unboxing` คือการยืนยันการปรากฏตัวจริงหน้าเคาน์เตอร์โดยพนักงานดูเลขบัตรคิว (`displayNumber`) และชื่อ (`userFullName`) บนจอมือถือลูกค้า ไม่มีโมดูลตรวจใบเสร็จดิจิทัล; **`[รอทีมยืนยันจำนวนกล่องต่อตั๋ว เช่น 1 ตั๋ว = แกะ 1 กล่อง / 1 รอบบริการต่อซีรีส์]`**
* **A-04 (Seeded Accounts & Series):** ใช้บัญชี Seed 9 บัญชี (`collector1..6`, `staff_crybaby`, `staff_crybaby2`, `staff_labubu`) และซีรีส์ 3 รายการ (`CRY`, `LAB`, `SKP`) ไม่มีการสมัครสมาชิกเองหรือ Admin CRUD UI
* **A-05 (Short Polling & Stateless JWT):** การอัปเดตสถานะ UI ทั้งหมดใช้ Short Polling ทุก 3 วินาที และ JWT (`HS256`, 8 ชั่วโมง) เก็บใน `localStorage` เพิกถอนข้ามอุปกรณ์ผ่าน `User.tokenVersion`
* **A-07 (Single-Day Store Operation):** ร้านเปิดให้บริการเป็นรอบรายวัน (ไม่เปิดข้ามเที่ยงคืน); พนักงานเคลียร์คิวผ่าน `Complete`/`No-Show` ก่อนปิดร้าน ไม่มีสคริปต์ Auto-Cancel อัตโนมัติ (กรณีหลงค้างข้ามวันบันทึกเป็น Known Limitation `G-07`)

### 1.3 ขอบเขตที่ไม่รวม (Explicit Exclusions)
* ไม่มีระบบจองคิวล่วงหน้าข้ามวัน (Waiting Line วันเดียวกันเท่านั้น)
* ไม่มีระบบชำระเงิน / Payment Gateway / การตรวจใบเสร็จดิจิทัล (ลูกค้าชำระเงินที่แคชเชียร์หลักก่อนมารับบัตรคิว)
* ไม่มีการส่ง SMS หรือ Push Notification ภายนอก (ใช้ Short Polling 3 วินาทีบนเว็บแอปพลิเคชัน)
* ไม่มีระบบ Auto No-Show หรือสคริปต์ Auto-Cancel ข้ามคืนอัตโนมัติ (Sprint 2 ใช้การกด manual trigger โดย Box Master และ Collector เท่านั้น)

### 1.4 ข้อกำหนดเชิงฟังก์ชัน (Functional Requirements: FR-01 ถึง FR-15)
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

### 1.5 กฎทางธุรกิจของระบบ (Business Rules: BR-01 ถึง BR-09)
* `BR-01`: ออกเลขคิวต่อเนื่องรายวัน แยกตัวนับตามซีรีส์และวันที่ (`Asia/Bangkok`) ไม่ลดค่าตัวนับและไม่นำเลขเดิมกลับมาใช้ซ้ำ ([EV-B03](#appendix-b))
* `BR-02 v2`: ลูกค้า 1 คนถือตั๋ว Active ได้สูงสุด 1 ใบต่อซีรีส์ แต่ถือข้ามซีรีส์พร้อมกันได้ บังคับด้วย Partial Unique Index `(userId, seriesId)` ([EV-A02](#appendix-b))
* `BR-03`: วงจรสถานะตั๋วคิวเป็นแบบทิศทางเดียว ไม่สามารถย้อนกลับได้ (`WAITING → CALLED → UNBOXING → COMPLETED`, `WAITING → CANCELLED`, `CALLED → NO_SHOW`)
* `BR-04`: Collector ห้ามเรียก Endpoint ของ Staff อย่างเด็ดขาด (`403 FORBIDDEN_ROLE` — [EV-B01](#appendix-b))
* `BR-05`: Box Master ดำเนินการได้เฉพาะซีรีส์ที่ตนได้รับมอบหมายเท่านั้น (`403 FORBIDDEN_SERIES`)
* `BR-06`: Box Master 1 คนมีตั๋วในสถานะ `CALLED` หรือ `UNBOXING` ได้ไม่เกิน 1 ใบพร้อมกัน บังคับด้วย Partial Unique Index `unique_active_staff_ticket` ([EV-A02](#appendix-b))
* `BR-07`: การเปลี่ยนสถานะเป็น `UNBOXING` หรือ `NO_SHOW` ต้องทำโดย Box Master ผู้กด Call ตั๋วไว้เท่านั้น (`403 FORBIDDEN_NOT_HANDLER` — [EV-A04](#appendix-b))
* `BR-08`: การตัดสิทธิ์ No-Show ต้องผ่านเงื่อนไขเวลา `clock.now() - ticket.calledAt >= 120 วินาที` บังคับที่ Server
* `BR-09`: ซีรีส์ที่ปิด (`isActive = false`) จะปฏิเสธคำขอรับบัตรคิวใหม่ด้วย HTTP `409 SERIES_CLOSED`

### 1.6 ข้อกำหนดที่ไม่ใช่เชิงฟังก์ชัน (Non-Functional Requirements: NFR-01 ถึง NFR-07)
* `NFR-01`: รหัสผ่านแฮชด้วย Bcrypt Cost $\ge 10$
* `NFR-02`: ทุก Protected Endpoint ปฏิเสธคำขอที่ไม่มี/Token เสีย (`401 UNAUTHENTICATED`) และ Role/Scope ผิด (`403`) โดยไม่คืนข้อมูลส่วนตัว และ Public Board (`F-07`) ต้องไม่มี PII หลุดใน Payload ทั้งชื่อ key และค่า string
* `NFR-03`: รองรับ 50 คำขอ Join พร้อมกันโดยได้เลขคิวต่อเนื่อง ไม่ซ้ำ ไม่ข้าม
* `NFR-04`: รองรับ 10 คำขอจองซ้ำพร้อมกันในซีรีส์เดิม สำเร็จเพียง 1 คำขอ ที่เหลือถูกปฏิเสธด้วย `409 DUPLICATE_ACTIVE_QUEUE`
* `NFR-05`: ข้อมูลตั๋วไม่สูญหายหลัง Container Restart หรือ Database Redeployment ([EV-B07](#appendix-b))
* `NFR-06`: หน้าจอ Web UI และ Public Board รองรับการแสดงผล Responsive บนหน้าจอขนาด 375px จนถึง 1920×1080 โดยไม่ล้นจอ
* `NFR-07`: จำกัดการส่งคำขอ Login ไม่เกิน 10 ครั้งต่อ 15 นาทีต่อ IP เกินกว่านั้นคืน HTTP `429 RATE_LIMIT_EXCEEDED`

---

## 2. การออกแบบสถาปัตยกรรมระดับระบบ (System-Level Software Design Specification — SDS)

### 2.1 สถาปัตยกรรมเทคโนโลยี (Stack & Architecture)
* **Frontend:** React 18 + Vite + Native CSS Variables (Kiosk-style responsive, 3s Short Polling, Offset-based Server Clock Sync)
* **Backend:** Node.js + Express + TypeScript (Layered Service-Controller-Route, Zod schema validation, Application Clock injection)
* **Database & ORM:** PostgreSQL 16 + Prisma ORM (Partial Unique Indexes, Raw SQL Atomic Monotonic Increment, Row-level Locking)
* **Cloud Infrastructure:** Google Cloud Run (Container Service `popqueue`) + Google Cloud SQL (`popqueue-pg`, PostgreSQL 16) + Cloud Run Job (`popqueue-migrate`) + GitHub Actions WIF CI/CD

### 2.1.1 โครงสร้างหน้าจอและแนวทาง API (UI Route Map & API Approach)
| Frontend Route | Component / File | Role ที่เข้าถึงได้ | พฤติกรรมหลัก & Polling | สถานะ |
| :--- | :--- | :---: | :--- | :---: |
| `/login` | `client/src/pages/LoginPage.tsx` | Public | เข้าสู่ระบบด้วย `username`/`password` → Redirect ตาม Role | `accepted` |
| `/series` | `client/src/pages/SeriesPage.tsx` | `COLLECTOR` | แสดงรายการซีรีส์ + คิวรอ + ปุ่ม Join Queue | `accepted` |
| `/my-ticket` | `client/src/pages/MyTicketPage.tsx` | `COLLECTOR` | แสดงการ์ดตั๋ว Active หลายซีรีส์ (Polling 3s), Countdown sync `serverNow` (`F-06`), ปุ่ม Cancel + Modal (`F-05`) | `accepted` (S1/L7) / `planned` (F-05, F-06) |
| `/staff/counter` | `client/src/pages/StaffCounterPage.tsx` | `BOX_MASTER` | คิวรอเฉพาะซีรีส์ตน (Polling 3s), Call Next, Verify & Start, Complete, ปุ่ม No-Show 120s (`F-06`), สวิตช์เปิด-ปิดซีรีส์ (`F-09`) | `accepted` (S1) / `planned` (F-06, F-09) |
| `/forbidden` | `client/src/pages/ForbiddenPage.tsx` | All | หน้าแจ้งเตือน 403 เมื่อเข้า URL นอกบทบาท | `accepted` |
| `/board` | `client/src/pages/BoardPage.tsx` *(planned)* | Public | จอบอร์ดหน้าร้าน Kiosk-style แสดง Now Serving + Up Next (Max 5) + Polling 3s + Error Banner (`F-07`) | `planned` |

* **API Approach:** RESTful JSON ภายใต้ prefix `/api/*`, Envelope มาตรฐาน `{ data }` / `{ error }` (ไม่มี boolean `success`), Bearer JWT authentication (`Authorization: Bearer <token>`), Error Handling รวมศูนย์ผ่าน `errorHandler` ที่ไม่คืน stack trace และไม่ leak ข้อมูลภายใน (`500 INTERNAL_ERROR`)

### 2.2 ผังบทบาทและสิทธิ์การเข้าถึงระดับระบบ (Comprehensive Role & Permission Matrix)

| HTTP Method & Endpoint Path | Middleware | Role ที่อนุญาต | Business Ownership / Series Guard | HTTP Rejection Codes | อ้างอิงโค้ดจริง (Code Reference) |
| :--- | :---: | :---: | :--- | :--- | :--- |
| `GET /api/health` | None | Public | ไม่มี | None | `server/src/app.ts:28-33` ([EV-A06](#appendix-b)) |
| `GET /api/v1/health` | None | Public | ไม่มี | None | `server/src/app.ts:28-33` ([EV-A06](#appendix-b)) |
| `GET /api/ready` | None | Public | ตรวจสอบการเชื่อมต่อ Database | `503 Service Unavailable` | `server/src/app.ts:36-43` |
| `POST /api/auth/login` | None | Public | ตรวจสอบ Password Hash | `400 VALIDATION_ERROR`<br>`401 INVALID_CREDENTIALS`<br>`429 RATE_LIMIT_EXCEEDED` *(S3)* | `server/src/routes/auth.routes.ts:8`<br>`server/src/services/auth.service.ts:34-47` |
| `POST /api/auth/logout` | `authenticateToken` | All Roles | ตรวจสอบ Token และ `tokenVersion` | `401 UNAUTHENTICATED` | `server/src/routes/auth.routes.ts:11` |
| `GET /api/auth/me` | `authenticateToken` | All Roles | คืนข้อมูลตัวตนและ Role ของผู้เรียก | `401 UNAUTHENTICATED` | `server/src/routes/auth.routes.ts:12` |
| `GET /api/series` | None | Public | คืนเฉพาะซีรีส์และจำนวนคิวรอ | None | `server/src/routes/series.routes.ts:7` |
| `POST /api/tickets/join` | `authenticateToken` | `COLLECTOR` | 1 active ticket per series (`BR-02 v2`) | `401 UNAUTHENTICATED`<br>`403 FORBIDDEN_ROLE`<br>`409 DUPLICATE_ACTIVE_QUEUE`<br>`409 SERIES_CLOSED` | `server/src/routes/ticket.routes.ts:9`<br>`server/src/services/ticket.service.ts:60-140` |
| `GET /api/tickets/my-ticket` | `authenticateToken` | `COLLECTOR` | กรองเฉพาะตั๋วของผู้เรียก (`userId`) | `401 UNAUTHENTICATED`<br>`404 NO_ACTIVE_TICKET` | `server/src/routes/ticket.routes.ts:17`<br>`server/src/services/ticket.service.ts:145-213` ([EV-B04](#appendix-b)) |
| `GET /api/tickets/:id` | `authenticateToken` | All Roles | Ownership (Collector: own ticket, Staff: assigned series) | `401 UNAUTHENTICATED`<br>`404 RESOURCE_NOT_FOUND`<br>`403 FORBIDDEN_OWNERSHIP`<br>`403 FORBIDDEN_SERIES` | `server/src/routes/ticket.routes.ts:25`<br>`server/src/services/ticket.service.ts:220-262` |
| `POST /api/tickets/:id/cancel` *(F-05)* | `authenticateToken` | `COLLECTOR` | Ownership (`ticket.userId === auth.userId`) | `401 UNAUTHENTICATED`<br>`403 FORBIDDEN_ROLE`<br>`404 RESOURCE_NOT_FOUND`<br>`403 FORBIDDEN_OWNERSHIP`<br>`400 INVALID_STATE_TRANSITION` | `server/src/routes/ticket.routes.ts` *(planned)*<br>Master Contract Part B §1.4 |
| `GET /api/staff/tickets` | `authenticateToken` | `BOX_MASTER` | เฉพาะซีรีส์ที่ตนได้รับมอบหมาย | `401 UNAUTHENTICATED`<br>`403 FORBIDDEN_ROLE` | `server/src/routes/staff.routes.ts:9`<br>`server/src/services/staff.service.ts:77-142` |
| `POST /api/staff/call-next` | `authenticateToken` | `BOX_MASTER` | ซีรีส์ที่ได้รับมอบหมาย + Single Serving | `401 UNAUTHENTICATED`<br>`403 FORBIDDEN_ROLE`<br>`403 FORBIDDEN_SERIES`<br>`409 STAFF_BUSY`<br>`404 EMPTY_QUEUE` | `server/src/routes/staff.routes.ts:17`<br>`server/src/services/staff.service.ts:148-223` ([EV-B05](#appendix-b)) |
| `POST /api/staff/tickets/:id/start-unboxing` | `authenticateToken` | `BOX_MASTER` | Assigned Series + Handler Exclusive | `401 UNAUTHENTICATED`<br>`403 FORBIDDEN_ROLE`<br>`404 RESOURCE_NOT_FOUND`<br>`403 FORBIDDEN_SERIES`<br>`403 FORBIDDEN_NOT_HANDLER`<br>`400 INVALID_STATE_TRANSITION` | `server/src/routes/staff.routes.ts:25`<br>`server/src/services/staff.service.ts:237-302` ([EV-A04](#appendix-b)) |
| `POST /api/staff/tickets/:id/complete` | `authenticateToken` | `BOX_MASTER` | Assigned Series + Handler Exclusive | `401 UNAUTHENTICATED`<br>`403 FORBIDDEN_ROLE`<br>`404 RESOURCE_NOT_FOUND`<br>`403 FORBIDDEN_SERIES`<br>`403 FORBIDDEN_NOT_HANDLER`<br>`400 INVALID_STATE_TRANSITION` | `server/src/routes/staff.routes.ts:33`<br>`server/src/services/staff.service.ts:323-388` |
| `POST /api/staff/tickets/:id/no-show` *(F-06)* | `authenticateToken` | `BOX_MASTER` | Handler Exclusive + Time $\ge$ 120s | `401 UNAUTHENTICATED`<br>`403 FORBIDDEN_ROLE`<br>`404 RESOURCE_NOT_FOUND`<br>`403 FORBIDDEN_SERIES`<br>`403 FORBIDDEN_NOT_HANDLER`<br>`400 INVALID_STATE_TRANSITION`<br>`400 NO_SHOW_WINDOW_NOT_EXPIRED` | `server/src/routes/staff.routes.ts` *(planned)*<br>Master Contract Part B §2.4 |
| `GET /api/public/queue-board` *(F-07)* | None | Public | Zero PII (Prisma select projection) | None (Unrestricted Public Access) | `server/src/routes/public.routes.ts` *(planned)*<br>Master Contract Part B §3.3 |
| `GET /api/staff/analytics` *(F-08)* | `authenticateToken` | `BOX_MASTER` | ข้อมูลสถิติเฉพาะซีรีส์ที่ได้รับมอบหมาย | `401 UNAUTHENTICATED`<br>`403 FORBIDDEN_ROLE`<br>`400 VALIDATION_ERROR`<br>`403 FORBIDDEN_SERIES` | `server/src/routes/staff.routes.ts` *(planned)*<br>Master Contract Part C §1.3 |
| `PATCH /api/staff/series/:id/status` *(F-09)* | `authenticateToken` | `BOX_MASTER` | เฉพาะซีรีส์ที่ได้รับมอบหมาย | `401 UNAUTHENTICATED`<br>`403 FORBIDDEN_ROLE`<br>`400 VALIDATION_ERROR`<br>`404 RESOURCE_NOT_FOUND`<br>`403 FORBIDDEN_SERIES` | `server/src/routes/staff.routes.ts` *(planned)*<br>Master Contract Part C §2.2 |

### 2.3 รายการตัวแปรสภาพแวดล้อม (Environment Variables Register)
* `NODE_ENV`: `production` / `test` / `development`
* `PORT`: `3000` (Docker Container / Cloud Run) / `4000` (Local Node)
* `TZ`: `Asia/Bangkok` (บังคับ Timezone เวลาไทย)
* `GIT_SHA`: Commit SHA 40 หลัก คืนใน `/api/health` ([EV-A06](#appendix-b))
* `DATABASE_URL`: Cloud SQL PostgreSQL Unix Socket connection string
* `JWT_SECRET`: Secret Key สำหรับ Stateless JWT
* `RATE_LIMIT_WINDOW_MS`: `900000` (15 นาที)
* `RATE_LIMIT_MAX`: `10` คำขอต่อ IP
* `TRUST_PROXY_HOPS`: `1` (Google Cloud Run proxy trust)

---


### 2.4 สถาปัตยกรรมโมเดลข้อมูลระดับระบบ (Database Models & Concurrency Predicates)
* **User (`server/prisma/schema.prisma:9-25`):** จัดเก็บข้อมูลผู้ใช้ บัญชีทดสอบ บทบาท (`Role: COLLECTOR | BOX_MASTER`) และ `tokenVersion`
* **Series (`server/prisma/schema.prisma:27-38`):** ข้อมูลซีรีส์กล่องสุ่ม (`code`, `name`, `isActive: Boolean @default(true)`)
* **QueueCounter (`server/prisma/schema.prisma:48-59`):** ตัวนับคิวแยกรายซีรีส์และรายวัน (`seriesId`, `queueDate`, `lastNumber`) รีเซ็ตเที่ยงคืนเวลาไทย (`Asia/Bangkok`)
* **QueueTicket (`server/prisma/schema.prisma:61-89`):** บัตรคิว พร้อม Enum `TicketStatus: WAITING | CALLED | UNBOXING | COMPLETED | CANCELLED | NO_SHOW` และฟิลด์ `forfeitedAt DateTime?`
* **Partial Unique Indexes SQL (EV-A02):**
  ```sql
  -- Migration 0003: 1 active ticket per collector per series
  CREATE UNIQUE INDEX unique_active_ticket_user_series ON "QueueTicket"("userId", "seriesId")
  WHERE status IN ('WAITING','CALLED','UNBOXING');

  -- Migration 0002: 1 active serving ticket per staff
  CREATE UNIQUE INDEX unique_active_staff_ticket ON "QueueTicket"("handledByStaffId")
  WHERE status IN ('CALLED','UNBOXING');
  ```
* **Atomic Monotonic Numbering SQL (EV-B03):**
  ```sql
  INSERT INTO "QueueCounter" ("id", "seriesId", "queueDate", "lastNumber")
  VALUES (gen_random_uuid()::text, ${seriesId}, ${queueDateStr}::date, 1)
  ON CONFLICT ("seriesId", "queueDate")
  DO UPDATE SET "lastNumber" = "QueueCounter"."lastNumber" + 1
  RETURNING "lastNumber";
  ```

### 2.5 สถาปัตยกรรมการติดตั้งบนคลาวด์ (Cloud Deployment Architecture)
```
[GitHub Actions CI/CD Pipeline]
       │ (WIF Authentication)
       ├──► [Docker Multi-Stage Build: node:24-alpine] ──► [Artifact Registry Image]
       │
       ├──► [Cloud Run Job: popqueue-migrate] ──────────► [Cloud SQL PostgreSQL 16]
       │         (Prisma Migration Deploy)
       │
       └──► [Cloud Run Service: popqueue]
                 (Express Backend + Static Vite Frontend, Port 3000)
```

## 3. Feature Inventory (Current Status — Rubric 5-Level Vocabulary)

> ใช้คำศัพท์สถานะตาม Rubric เท่านั้น: `planned` / `in progress` / `implemented` / `tested` / `accepted`

| Feature ID | Feature Name | Target Sprint | Status | Implementation Artifacts | Verification Status |
| :---: | :--- | :---: | :---: | :--- | :---: |
| **F-01** | Authentication & Role-Based Access | 1 | `accepted` | `auth.service.ts`, `auth.ts`, `client/src/pages/LoginPage.tsx` | `accepted` (`v0.1.0-sprint1` + Lab 6 `#47` — [EV-A07](#appendix-b)) |
| **F-02** | Queue Discovery & Safe Joining | 1 (rev Lab 7) | `accepted` | `ticket.service.ts`, `SeriesPage.tsx`, Migration 0003 | `accepted` (`v0.3.0-lab7` — [EV-A02](#appendix-b), [EV-A07](#appendix-b)) |
| **F-03** | Staff Counter & Call/Complete | 1 | `accepted` | `staff.service.ts`, `StaffCounterPage.tsx` | `accepted` (`v0.1.0-sprint1` — [EV-A07](#appendix-b)) |
| **F-04** | Ticket Inspection & Ownership | 1 (ext Lab 7) | `accepted` | `ticket.service.ts`, `MyTicketPage.tsx` | `accepted` (`v0.3.0-lab7` — [EV-B04](#appendix-b), [EV-A07](#appendix-b)) |
| **F-05** | Queue Cancellation | **2** | `planned` | `ticket.service.ts`, `ticket.routes.ts`, `MyTicketPage.tsx` *(Issue `D2-I2`)* | `planned` (no implementation evidence yet) |
| **F-06** | Server-Enforced 120s No-Show | **2** | `planned` | `staff.service.ts`, `CountdownTimer.tsx`, `StaffCounterPage.tsx` *(Issue `D2-I3`)* | `planned` (no implementation evidence yet) |
| **F-07** | Public Queue Display Board | **2** | `planned` | `public.service.ts`, `public.routes.ts`, `BoardPage.tsx` *(Issue `D2-I4`)* | `planned` (no implementation evidence yet) |
| **F-08** | Daily Service Analytics | 3 | `planned` | `staff.service.ts`, Staff Analytics UI *(Post-D2)* | `planned` (no implementation evidence yet) |
| **F-09** | Series Availability Control | **3 (D2 Target Progress)** | `planned` | `staff.service.ts`, `staff.routes.ts`, `StaffCounterPage.tsx` *(Issue `D2-I5`)* | `planned` (Toggle API/UI pending `D2-I5`; Baseline `BR-09` 409 verified) |
| **S3-HARDEN** | Rate Limiting & Hardening | 3 | `planned` | `app.ts`, `env.ts`, `express-rate-limit` *(Post-D2)* | `planned` (no implementation evidence yet) |

---

## 4. ทะเบียนเกณฑ์การยอมรับฉบับสมบูรณ์ (Complete Acceptance Criteria Register: 83 Active ACs + AC-40 Reserved = 84 รายการ)

> **หมายเหตุเรื่อง Commit ของหลักฐาน Sprint 1 (`AC-01..AC-39`):** คอลัมน์ Commit แสดง accepted baseline ที่ผ่านการส่งมอบ (`d946159` / `72e1bb5` / `bf52c9b` / `a07a7be`) และชุดทดสอบ regression `EV-A07` (194 passed) รันทวนสอบบน `75068a6` (ซึ่งโค้ดเหมือน `a07a7be` ตาม `EV-B02`) — ใน **Issue `D2-I6`** จะรัน `vitest --reporter=verbose` แยกราย AC บน `v0.5.0-d2-rc` เพื่อแนบเป็นหลักฐานรายข้อก่อน Export PDF

| AC ID | หมวดหมู่ / ฟีเจอร์ | Implemented? | Verification Run? | ผลการทดสอบ (Result) | รหัสหลักฐาน (EV-ID) | Baseline / Verified Commit SHA |
| :---: | :--- | :---: | :---: | :---: | :---: | :---: |
| **AC-01** | Auth Login (Username format) | Yes | Yes | `accepted` | [EV-A07](#appendix-b) | `d946159` *(reg `75068a6`)* |
| **AC-02** | Auth Login (Password verification) | Yes | Yes | `accepted` | [EV-A07](#appendix-b) | `d946159` *(reg `75068a6`)* |
| **AC-03** | Auth Login (Missing password validation) | Yes | Yes | `accepted` (Lab 6 Retest + CI) | [EV-A07](#appendix-b), [EV-B07](#appendix-b) | `72e1bb5` → `2aee62b` *(reg `75068a6`)* |
| **AC-04** | Auth Token Protection (`401 UNAUTHENTICATED` across protected routes) | Yes | Yes | `accepted` | [EV-A07](#appendix-b) | `d946159` *(reg `75068a6`)* |
| **AC-05** | Logout & Token Invalidation (`tokenVersion`) | Yes | Yes | `accepted` | [EV-A07](#appendix-b) | `d946159` *(reg `75068a6`)* |
| **AC-06** | Auth `/me` Profile & `assignedSeries` | Yes | Yes | `accepted` | [EV-A07](#appendix-b) | `d946159` *(reg `75068a6`)* |
| **AC-07** | Bcrypt Hash Cost $\ge 10$ | Yes | Yes | `accepted` | [EV-A07](#appendix-b) | `d946159` *(reg `75068a6`)* |
| **AC-08** | Role Guard `403 FORBIDDEN_ROLE` Unit | Yes | Yes | `accepted` | [EV-A07](#appendix-b), [EV-B01](#appendix-b) | `d946159` *(reg `75068a6`)* |
| **AC-09** | Series Discovery Listing | Yes | Yes | `accepted` | [EV-A07](#appendix-b) | `d946159` *(reg `75068a6`)* |
| **AC-10** | Queue Join (Atomic FIFO) | Yes | Yes | `accepted` | [EV-A07](#appendix-b), [EV-B03](#appendix-b) | `d946159` *(reg `75068a6`)* |
| **AC-11** | 1 Active Ticket per Series (`BR-02 v2`) | Yes | Yes | `accepted` (CI/Local) | [EV-A07](#appendix-b), [EV-A02](#appendix-b) | `a07a7be` *(reg `75068a6`)* |
| **AC-12** | Inactive Series Join Block (`409 SERIES_CLOSED`) | Yes | Yes | `accepted` | [EV-A07](#appendix-b) | `d946159` *(reg `75068a6`)* |
| **AC-13** | Join Input Validation (`400`/`404`) | Yes | Yes | `accepted` | [EV-A07](#appendix-b) | `d946159` *(reg `75068a6`)* |
| **AC-14** | Role Guard on Join Endpoint (`403`/`401`) | Yes | Yes | `accepted` | [EV-A07](#appendix-b), [EV-B01](#appendix-b) | `d946159` *(reg `75068a6`)* |
| **AC-15** | Concurrency: 50 Simultaneous Joins | Yes | Yes | `accepted` | [EV-A07](#appendix-b) | `d946159` *(reg `75068a6`)* |
| **AC-16** | Race Guard: 10 Same-Series + 2 Cross-Series Joins | Yes | Yes | `accepted` (CI/Local) | [EV-A07](#appendix-b), [EV-A02](#appendix-b) | `a07a7be` *(reg `75068a6`)* |
| **AC-17** | Asia/Bangkok Midnight Reset | Yes | Yes | `accepted` | [EV-A07](#appendix-b), [EV-B03](#appendix-b) | `d946159` *(reg `75068a6`)* |
| **AC-18** | Monotonic Counter Non-Reuse After Completed | Yes | Yes | `accepted` | [EV-A07](#appendix-b), [EV-B03](#appendix-b) | `d946159` *(reg `75068a6`)* |
| **AC-19** | E2E Join, Cross-Series & Duplicate UI Alert | Yes | Yes | `accepted` (CI/Local) | [EV-A07](#appendix-b) | `a07a7be` *(reg `75068a6`)* |
| **AC-20** | Responsive Web Layout (`375x667`) | Yes | Yes | `accepted` | [EV-A07](#appendix-b) | `a07a7be` *(reg `75068a6`)* |
| **AC-21** | Staff Series Queue Inspection | Yes | Yes | `accepted` | [EV-A07](#appendix-b) | `d946159` *(reg `75068a6`)* |
| **AC-22** | Staff Call-Next FIFO Order | Yes | Yes | `accepted` | [EV-A07](#appendix-b), [EV-B05](#appendix-b) | `d946159` *(reg `75068a6`)* |
| **AC-23** | Call-Next Empty Queue (`404 EMPTY_QUEUE`) | Yes | Yes | `accepted` | [EV-A07](#appendix-b) | `d946159` *(reg `75068a6`)* |
| **AC-24** | Staff Busy Single Active Handling (`409 STAFF_BUSY`) | Yes | Yes | `accepted` | [EV-A07](#appendix-b), [EV-A02](#appendix-b) | `d946159` *(reg `75068a6`)* |
| **AC-25** | Staff Series Assignment Scope Guard (`403`) | Yes | Yes | `accepted` | [EV-A07](#appendix-b), [EV-A04](#appendix-b) | `d946159` *(reg `75068a6`)* |
| **AC-26** | Start Unboxing (`CALLED -> UNBOXING`) | Yes | Yes | `accepted` | [EV-A07](#appendix-b), [EV-A04](#appendix-b) | `d946159` *(reg `75068a6`)* |
| **AC-27** | Complete Ticket (`UNBOXING -> COMPLETED`) | Yes | Yes | `accepted` | [EV-A07](#appendix-b), [EV-A04](#appendix-b) | `d946159` *(reg `75068a6`)* |
| **AC-28** | Strict State Lifecycle Validation (`400`) | Yes | Yes | `accepted` | [EV-A07](#appendix-b) | `d946159` *(reg `75068a6`)* |
| **AC-29** | Staff Series Mismatch Rejection (`403`) | Yes | Yes | `accepted` | [EV-A07](#appendix-b), [EV-A04](#appendix-b) | `d946159` *(reg `75068a6`)* |
| **AC-30** | Handler Exclusive Rejection (`403 FORBIDDEN_NOT_HANDLER`) | Yes | Yes | `accepted` | [EV-A07](#appendix-b), [EV-A04](#appendix-b) | `d946159` *(reg `75068a6`)* |
| **AC-31** | Staff Role Guard on All Staff Routes (`403`) | Yes | Yes | `accepted` | [EV-A07](#appendix-b), [EV-B01](#appendix-b) | `d946159` *(reg `75068a6`)* |
| **AC-32** | Concurrency Row-Lock `SKIP LOCKED` & Single-Staff Race | Yes | Yes | `accepted` | [EV-A07](#appendix-b), [EV-B05](#appendix-b) | `d946159` *(reg `75068a6`)* |
| **AC-33** | End-to-End Critical Journey (`full-journey.spec.ts`) | Yes | Yes | `accepted` | [EV-A07](#appendix-b) | `d946159` *(reg `75068a6`)* |
| **AC-34** | My-Ticket Multi-Series Array & `waitingAhead` | Yes | Yes | `accepted` | [EV-A07](#appendix-b), [EV-B04](#appendix-b) | `a07a7be` *(reg `75068a6`)* |
| **AC-35** | My-Ticket `404 NO_ACTIVE_TICKET` / `403` Role Guard | Yes | Yes | `accepted` | [EV-A07](#appendix-b), [EV-B04](#appendix-b) | `a07a7be` *(reg `75068a6`)* |
| **AC-36** | Ticket Detail History & Existence (`404`) | Yes | Yes | `accepted` | [EV-A07](#appendix-b) | `d946159` *(reg `75068a6`)* |
| **AC-37** | Ticket Detail Ownership Guard (`403 FORBIDDEN_OWNERSHIP`) | Yes | Yes | `accepted` | [EV-A07](#appendix-b) | `d946159` *(reg `75068a6`)* |
| **AC-38** | Ticket Detail Staff Scope Guard (`403 FORBIDDEN_SERIES`) | Yes | Yes | `accepted` | [EV-A07](#appendix-b) | `d946159` *(reg `75068a6`)* |
| **AC-39** | DB Container Restart & Cloud Deployment Persistence | Yes | Yes | `tested` (`v0.2.0-lab5`) | [EV-B07](#appendix-b) | `bf52c9b` *(re-run planned on `v0.5.0-d2-rc`)* |
| **AC-40** | *(เว้นว่างไว้โดยเจตนา — EV-A08)* | N/A | N/A | `N/A` | [EV-A08](#appendix-b) | N/A |
| **AC-41.1** | F-05 Valid Ticket Cancellation | No | No | `planned` | - | TBD |
| **AC-41.2** | F-05 Immediate Re-join After Cancel | No | No | `planned` | - | TBD |
| **AC-41.3** | F-05 Monotonic Counter Continuity (`CRY-003`) | No | No | `planned` | - | TBD |
| **AC-41.4** | F-05 Forbidden Ownership Rejection | No | No | `planned` | - | TBD |
| **AC-41.5** | F-05 Invalid State Transition Rejection | No | No | `planned` | - | TBD |
| **AC-41.6** | F-05 Call-Next Structural Exclusion | No | No | `planned` | - | TBD |
| **AC-41.7** | F-05 Multi-Ticket Independence | No | No | `planned` | - | TBD |
| **AC-41.8** | F-05 Concurrency Race Guard | No | No | `planned` | - | TBD |
| **AC-41.9** | F-05 Collector Cancel Role & Auth Guards | No | No | `planned` | - | TBD |
| **AC-41.10** | F-05 Cancel Confirmation Modal & Empty State UI | No | No | `planned` | - | TBD |
| **AC-41.11** | F-05 Not-Found (`404`), UUID Validation & Double-Submit Guard | No | No | `planned` | - | TBD |
| **AC-42.1** | F-06 Premature No-Show Rejection (<120s) + `STAFF_BUSY` | No | No | `planned` | - | TBD |
| **AC-42.2** | F-06 119s / 120s / 121s Boundary | No | No | `planned` | - | TBD |
| **AC-42.3** | F-06 ServerNow Timestamp Synchronization | No | No | `planned` | - | TBD |
| **AC-43.1** | F-06 Successful No-Show Transition | No | No | `planned` | - | TBD |
| **AC-43.2** | F-06 Staff Released from STAFF_BUSY | No | No | `planned` | - | TBD |
| **AC-43.3** | F-06 Handler Exclusive Guard (403) | No | No | `planned` | - | TBD |
| **AC-43.4** | F-06 WAITING Ticket Null-Guard (400) | No | No | `planned` | - | TBD |
| **AC-43.5** | F-06 No-Show vs Start-Unbox Race Guard | No | No | `planned` | - | TBD |
| **AC-43.6** | F-06 Collector Immediate Re-join | No | No | `planned` | - | TBD |
| **AC-43.7** | F-06 Staff No-Show Role & Auth Guards | No | No | `planned` | - | TBD |
| **AC-43.8** | F-06 Staff Countdown Timer & Button State UI | No | No | `planned` | - | TBD |
| **AC-43.9** | F-06 Collector `/my-ticket` Server-Synced Countdown (`LIM-01` fix) | No | No | `planned` | - | TBD |
| **AC-43.10** | F-06 Cross-Series `403`, `404`, `DEC-03` Post-120s Start & Unit State-Machine | No | No | `planned` | - | TBD |
| **AC-44.1** | F-07 Public Unauthenticated Access (200) | No | No | `planned` | - | TBD |
| **AC-44.2** | F-07 Zero PII Assertion in Body Values | No | No | `planned` | - | TBD |
| **AC-44.3** | F-07 UpNext Max 5 (5/6/8 Boundary) & WaitingCount | No | No | `planned` | - | TBD |
| **AC-44.4** | F-07 Integer QueueNumber Sorting | No | No | `planned` | - | TBD |
| **AC-44.5** | F-07 Closed Series Display with Badge (`ปิดรับคิวใหม่`) | No | No | `planned` | - | TBD |
| **AC-44.6** | F-07 Excluded Inactive Status Filter | No | No | `planned` | - | TBD |
| **AC-44.7** | F-07 Responsive Layout Across Viewports | No | No | `planned` | - | TBD |
| **AC-44.8** | F-07 Board 3s Polling, Degraded Error State, `calledAt` Sort & `DEC-04` Hidden Empty Closed Series | No | No | `planned` | - | TBD |
| **AC-45.1** | F-08 Daily Aggregation Accuracy | No | No | `planned` | - | TBD |
| **AC-45.2** | F-08 Role, Auth & Series Authorization (`401`/`403`) | No | No | `planned` | - | TBD |
| **AC-45.3** | F-08 Mathematical Precision of Averages | No | No | `planned` | - | TBD |
| **AC-45.4** | F-08 Date Format Validation Rejection | No | No | `planned` | - | TBD |
| **AC-46.1** | F-09 Authorized Status Toggle (200) | No | No | `planned` | - | TBD |
| **AC-46.2** | F-09 Join Prevention on Closed Series (`BR-09` baseline) | No (Toggle pending) | No | `planned` | - | TBD |
| **AC-46.3** | F-09 Auth, Role, Validation, `404` & Unauthorized Series Rejection | No | No | `planned` | - | TBD |
| **AC-46.4** | F-09 Existing Tickets Continuity (`callNext`/`startUnboxing`/`complete`) | No (query invariant verified) | No | `planned` | [EV-B05](#appendix-b) | TBD |
| **AC-46.5** | F-09 Idempotency & Re-open Validation | No | No | `planned` | - | TBD |
| **AC-47.1** | S3-HARDEN Login Rate Limit (10/15m) | No | No | `planned` | - | TBD |
| **AC-47.2** | S3-HARDEN IP Isolation Multi-Hop | No | No | `planned` | - | TBD |
| **AC-47.3** | S3-HARDEN Public/Health Exemption | No | No | `planned` | - | TBD |

---

## 5. ตารางสอบกลับความต้องการ (Requirements Traceability Matrix)

> **คำอธิบายเชิงอรรถ:**  
> - Sprint `1` = Sprint 1 Baseline (`v0.1.0-sprint1`), `Lab 5` = GCP CI/CD (`v0.2.0-lab5`), `Lab 7` = BR-02 v2 Maintenance (`v0.3.0-lab7`)  
> - สถานะใช้เฉพาะคำศัพท์มาตรฐาน Rubric (`planned` / `in progress` / `implemented` / `tested` / `accepted`); กรณี Requirement ที่ครอบคลุมทั้ง Sprint 1 และ Sprint 2–3 จะระบุแยกชัดเจนเป็น `accepted (S1) / planned (S2–S3)` (ส่วนนิยาม `TEST-01..TEST-39` อยู่ใน `docs/sprints/sprint-1/PopQueue_Deliverable_1_Master.md` Part E และจะรัน verbose รายข้อบน `v0.5.0-d2-rc` ใน Issue `D2-I6`)

| Req ID | หมวดหมู่ | Feature | Sprint | Acceptance Criteria | Test Specification | Actual Test File on Main (`EV-B08`) | Rubric Status | การวัดผล / ข้อกำหนด NFR (Measurement) |
| :---: | :--- | :---: | :---: | :--- | :--- | :--- | :---: | :--- |
| **FR-01** | Auth | F-01 | 1, Lab 6 | AC-01, AC-02, AC-03, AC-05 | TEST-01..03, 05 | `server/tests/api/auth.test.ts`, `unit/login-schema.test.ts` | `accepted` (`v0.3.0-lab7`) | Pass ([EV-A07](#appendix-b)), Bcrypt salt $\ge 10$ |
| **FR-02** | Auth `/me` & Logout | F-01 | 1 | AC-05, AC-06 | TEST-05, 06 | `server/tests/api/auth.test.ts` | `accepted` (`v0.3.0-lab7`) | `tokenVersion` incremented & profile scopes |
| **FR-03** | Discovery | F-02 | 1 | AC-09 | TEST-09 | `server/tests/api/series.test.ts` | `accepted` (`v0.3.0-lab7`) | คืนรายการซีรีส์พร้อม Waiting Count |
| **FR-04** | Join Queue | F-02 | 1, Lab 7 | AC-10, AC-12, AC-13, AC-19 | TEST-10,12,13,19 | `server/tests/api/join.test.ts`, `e2e/join-queue.spec.ts` | `accepted` (`v0.3.0-lab7`) | Atomic monotonic numbering ([EV-B03](#appendix-b)) |
| **FR-05** | My Ticket | F-04 | 1, Lab 7 | AC-34, AC-35 | TEST-34,35 | `server/tests/api/my-ticket.test.ts` | `accepted` (`v0.3.0-lab7`) | Multi-ticket array response ([EV-B04](#appendix-b)) |
| **FR-06** | Ticket Detail | F-04 | 1 | AC-36, AC-37, AC-38 | TEST-36..38 | `server/tests/api/ticket-detail.test.ts`, `ticket-security.test.ts` | `accepted` (`v0.3.0-lab7`) | Ownership 403 guard ([EV-A07](#appendix-b)) |
| **FR-07** | Staff View | F-03 | 1 | AC-21 | TEST-21 | `server/tests/api/staff-tickets.test.ts` | `accepted` (`v0.3.0-lab7`) | Series assignment scope guard |
| **FR-08** | Call Next | F-03 | 1 | AC-22, AC-23, AC-24, AC-25 | TEST-22..25 | `server/tests/api/call-next.test.ts` | `accepted` (`v0.3.0-lab7`) | FIFO `SKIP LOCKED` row lock ([EV-B05](#appendix-b)) |
| **FR-09** | Start Unbox | F-03 | 1 | AC-26 | TEST-26 | `server/tests/api/staff-transition.test.ts` | `accepted` (`v0.3.0-lab7`) | Handler exclusive 403 ([EV-A04](#appendix-b)) |
| **FR-10** | Complete | F-03 | 1 | AC-27, AC-33 | TEST-27,33 | `server/tests/api/staff-transition.test.ts`, `e2e/full-journey.spec.ts` | `accepted` (`v0.3.0-lab7`) | State lifecycle completion |
| **FR-11** | Cancel Queue | **F-05** | **2** | AC-41.1..41.11 | TEST-41A..41L | `server/tests/api/cancel.test.ts` *(planned)* | `planned` | Re-join ได้ทันที, ข้ามเลขถาวร |
| **FR-12** | No-Show | **F-06** | **2** | AC-42.1..42.3, AC-43.1..43.10 | TEST-42A..D, TEST-43A..K, 43U | `server/tests/api/no-show.test.ts` *(planned)* | `planned` | Server-enforced Δt ≥ 120s + `serverNow` sync |
| **FR-13** | Public Board | **F-07** | **2** | AC-44.1..44.8 | TEST-44A..44G | `server/tests/api/public-board.test.ts` *(planned)* | `planned` | Zero PII, Polling 3s, Max 5 |
| **FR-14** | Analytics | **F-08** | **3** | AC-45.1..45.4 | TEST-45A..45E | `server/tests/api/analytics.test.ts` *(planned)* | `planned` | แม่นยำตามสูตรคณิตศาสตร์ |
| **FR-15** | Series Toggle | **F-09** | **3** | AC-46.1..46.5 | TEST-46A..46F | `server/tests/api/series-toggle.test.ts` *(planned)* | `planned` | ตั๋วค้างเดิมยังให้บริการได้จนจบ |
| **BR-01** | Monotonic No | F-02, F-05 | 1, 2 | AC-10, AC-17, AC-18, AC-41.3 | TEST-10,17,18,41B | `server/tests/concurrency/numbering.test.ts` | `accepted (S1) / planned (S2)` | Composite key `(seriesId, queueDate)` |
| **BR-02 v2**| 1/Series | F-02 | 1, Lab 7 | AC-11, AC-16, AC-19 | TEST-11,16,19 | `server/tests/concurrency/duplicate.test.ts`, `join.test.ts` | `accepted` (`v0.3.0-lab7`) | Partial Unique Index ([EV-A02](#appendix-b)) |
| **BR-03** | State Life | F-03, F-05, F-06 | 1, 2 | AC-22, AC-26, AC-27, AC-28, AC-41.5, AC-43.10 | TEST-28,41D,41E,43D,43U | `server/tests/unit/state-machine.test.ts` | `accepted (S1) / planned (S2)` | ทิศทางเดียว ไม่ย้อนกลับ |
| **BR-04** | Role Guard | All | 1, 2, 3 | AC-08, AC-14, AC-31, AC-41.9, AC-43.7, AC-45.2, AC-46.3 | TEST-08U,14,31,41I,43G,45B,46F | `server/tests/unit/role-guard.test.ts` | `accepted (S1) / planned (S2–S3)` | `403 FORBIDDEN_ROLE` ([EV-B01](#appendix-b)) |
| **BR-05** | Staff Series | F-03, F-06, F-08, F-09 | 1, 2, 3 | AC-25, AC-29, AC-43.10, AC-45.2, AC-46.3 | TEST-25,29,43K,45B,46C | `server/tests/api/staff-tickets.test.ts` | `accepted (S1) / planned (S2–S3)` | `403 FORBIDDEN_SERIES` |
| **BR-06** | Single Staff | F-03, F-06 | 1, 2 | AC-24, AC-32, AC-43.2 | TEST-24,32,43B | `server/tests/api/call-next.test.ts` | `accepted (S1) / planned (S2)` | `409 STAFF_BUSY` ([EV-A02](#appendix-b)) |
| **BR-07** | Handler Excl | F-03, F-06 | 1, 2 | AC-26, AC-30, AC-43.3 | TEST-26,30,43C | `server/tests/api/staff-transition.test.ts` | `accepted (S1) / planned (S2)` | `403 FORBIDDEN_NOT_HANDLER` |
| **BR-08** | 120s Timeout | **F-06** | **2** | AC-42.1..42.3, AC-43.1 | TEST-42A..D, 43A | `server/tests/api/no-show.test.ts` *(planned)* | `planned` | App clock FakeClock boundary |
| **BR-09** | Inactive Block | F-02, F-09 | 1, 3 | AC-12, AC-46.2 | TEST-12,46B | `server/tests/api/join.test.ts` | `accepted (S1) / planned (S3)` | `409 SERIES_CLOSED` |
| **NFR-01** | Bcrypt Hash | F-01 | 1 | AC-07 | TEST-07 | `server/tests/security/password-hash.test.ts` | `accepted` (`v0.3.0-lab7`) | Salt rounds $\ge 10$ |
| **NFR-02** | Access & Zero PII | F-01, F-04, F-07 | 1, 2 | AC-04, AC-14, AC-31, AC-37, AC-44.2 | TEST-04,14,31,37,44A | `server/tests/security/unauthenticated.test.ts`, `ticket-security.test.ts` | `accepted (S1) / planned (S2)` | 401/403 non-leak + Zero PII in public payload |
| **NFR-03** | Concurrency | F-02 | 1 | AC-15 | TEST-15 | `server/tests/concurrency/numbering.test.ts` | `accepted` (`v0.3.0-lab7`) | 50 concurrent requests: 0 duplicate |
| **NFR-04** | Race Guard | F-02 | 1 | AC-16 | TEST-16 | `server/tests/concurrency/duplicate.test.ts` | `accepted` (`v0.3.0-lab7`) | 10 duplicate concurrent: 1 pass, 9 fail |
| **NFR-05** | Persistence | Infra | 1, Lab 5 | AC-39 | TEST-39 | `scripts/test-persistence.mjs` | `tested` (`v0.2.0-lab5`) | ข้อมูลคงทนหลัง restart/redeploy 3/3 |
| **NFR-06** | Responsive | UI, F-07 | 1, 2 | AC-20, AC-44.7 | TEST-20, TEST-44F | `e2e/responsive.spec.ts` | `accepted (S1) / planned (S2)` | ไม่มี overflow ที่ 375px; TV 1080p |
| **NFR-07** | Rate Limit | **S3** | **3** | AC-47.1..47.3 | TEST-47A..D | `server/tests/security/rate-limit.test.ts` *(planned)* | `planned` | Max 10 requests / 15 minutes |

---

### 5.1 ตารางวิเคราะห์ช่องว่างและแผนการตรวจสอบรอบสุดท้าย (Coverage Gaps & Planned Final Verification)

| หมวดหมู่ (Category) | ช่องว่างที่ตรวจพบ (Identified Gap) | สาเหตุและผลกระทบ (Impact) | แผนการตรวจสอบและหลักฐานยืนยัน (Planned Final Verification) |
| :--- | :--- | :--- | :--- |
| **Unimplemented Requirements (Pre-Code Phase)** | `FR-11..FR-15`, `BR-08`, `NFR-07` และ `AC-41..47` ทั้งหมดอยู่ในสถานะ `planned` | ปัจจุบันอยู่ที่ขั้น Contract & Plan Baseline (`D2-I1`) ยังไม่ได้พัฒนาโค้ด | ดำเนินการพัฒนาและทดสอบทีละ Issue (`D2-I2`..`D2-I5`) ด้วย TDD `[RED]`→`[GREEN]` และรันชุดเต็มใน `D2-I6` |
| **GCP Cloud Run Live Evidence (`v0.3.0` / `v0.5.0`)** | Issue `#55` ปิดเมื่อ 2026-11-24 โดยไม่มี live check comment ใน issue (`LAB7/evidence/live/` อยู่นอก repo); และยังต้อง verify บน Candidate ใหม่ | ขาดหลักฐาน Live Check ที่ผูกกับ release candidate `v0.5.0-d2-rc` | คอมเมนต์ปิดลูป Issue `#55` และรัน Live Check + Cloud SQL Persistence บน `v0.5.0-d2-rc` ใน `D2-I6` |
| **UI Interactive Behaviors** | Modal ยืนยันยกเลิกตั๋ว, Countdown 120s (`/my-ticket` + `/staff/counter`), `/board` error banner และ Toggle สวิตช์ยังอยู่ในสถานะ `planned` | ต้องยืนยันทั้งฝั่ง Backend และ Client DOM/E2E | เพิ่ม Component/E2E Tests (`ticket.test.tsx`, `staff.test.tsx`, `public-board.spec.ts`) ครอบคลุม `TEST-41K`, `TEST-43I/J`, `TEST-44C/F` |
| **Cross-Day Queue Drift (`G-07`)** | `F-07` ไม่กรอง `queueDate` เพื่อให้ตรงกับ `call-next` หากมีตั๋วค้างข้ามคืนจะขึ้นก่อน | ยอมรับเป็น Known Limitation (`A-07`/`G-07`) ร้านเปิดเป็นรอบรายวัน ไม่มีสคริปต์ Auto-Cancel | พนักงานเคลียร์คิวก่อนปิดร้านผ่าน Complete / No-Show; เปิดเผยชัดเจนใน Known Limitations |
| **Network Latency Drift** | Client timer กับ Server timer อาจคลาดเคลื่อนจาก latency | ปุ่ม No-Show อาจกดไม่ติดหากเวลาบน client เร็วกว่า server | บังคับใช้ `serverNow` ISO timestamp (`AC-42.3`, `TEST-42D`) ซิงก์ local offset ทั้ง 2 หน้าจอ (`TEST-43I/J`) |

## 6. บันทึกการตัดสินใจทางวิศวกรรม (SRS Decision Log)

* **Decision 1 (Priority Policy):** ปฏิเสธการทำ Priority Jumping สำหรับตั๋วที่ถูก No-Show หรือ Cancel; ลูกค้าที่เข้าคิวใหม่จะได้รับเลขคิวต่อท้ายแถวเสมอเพื่อความโปร่งใส
* **Decision 2 (Counter Isolation):** ปฏิเสธการใช้ตัวนับรวมทั้งร้าน โดยยืนยันใช้ Composite Key `("seriesId", "queueDate")` เพื่อแยกอิสระตามซีรีส์และรีเซ็ตรายวันตามเวลาไทย ([EV-B03](#appendix-b))
* **Decision 3 (G-07 Overnight Leftover Limitation):** บันทึก ณ วันที่ 2026-11-24 ยอมรับพฤติกรรมที่ตั๋วค้างข้ามคืนจะถูกเรียกก่อนตาม FIFO (`queueDate ASC`) และไม่เพิ่มสคริปต์ auto-cancel นอกขอบเขต
* **Decision 4 (F-05 Cancel Ownership Precedence):** กำหนดให้การตรวจสอบสิทธิ์ความเป็นเจ้าของ (`403 FORBIDDEN_OWNERSHIP`) ทำงานก่อนการตรวจสถานะตั๋ว (`400 INVALID_STATE_TRANSITION`) เมื่อ Collector พยายามยกเลิกตั๋วของผู้อื่น
* **Decision 5 (F-06 Re-join Policy หลัง No-Show):** บันทึก ณ วันที่ 2026-11-24 (สถานะ: รอยืนยัน TA ใน G1) อนุญาตให้ Collector ที่ถูกตัดสิทธิ์ No-Show สามารถกด join เพื่อรับคิวใหม่ได้ทันที เนื่องจากหลุดออกจากข้อจำกัดทางสถาปัตยกรรม Database อยู่แล้ว ([EV-A02](#appendix-b))
* **Decision 6 (F-07 Dataset Alignment):** กำหนดให้ Public Board ดึงข้อมูลและเรียงลำดับด้วยเงื่อนไขเดียวกับ `call-next` เพื่อให้ Up Next แสดงตรงกับตั๋วที่จะถูกเรียกจริง ([EV-B05](#appendix-b))
* **Decision 7 (ServerNow Clock Synchronization):** เพิ่มฟิลด์ `data.serverNow` ใน response เพื่อแก้ปัญหา Client Clock Skew บน `CountdownTimer` ทั้งหน้า `/my-ticket` (ปิด `LIM-01`) และ `/staff/counter`
* **Decision 8 (NFR-07 S3-HARDEN Scope):** กำหนดให้การติดตั้ง Rate Limit จำกัดเฉพาะ `POST /api/auth/login` และยกไปทำใน Sprint 3 ตามแผน เพื่อไม่ให้เกิดผลข้างเคียงต่อการตรวจประเมินระบบของผู้ตรวจและ TA
* **Decision 9 (`DEC-06` — Sprint 3 Working Progress Reorder `F-08 → F-09`):** ใน D1 วางทั้ง `F-08` และ `F-09` ไว้ใน Sprint 3 โดยเดิมตั้งเป้าส่ง `F-08 initial version` ใน Deliverable 2 แต่ทีมปรับมาส่ง **`F-09` (Series Availability Control)** เป็น Sprint 3 Working Progress แทน เนื่องจาก `F-08` ต้องอิงข้อมูลจาก `F-06` ที่กำลังพัฒนาใน Sprint 2 ขณะที่ `F-09` พัฒนาขนานได้เร็วกว่าและสาธิตผลร่วมกับ `F-02`/`F-07` ได้ครบวงจร *(ไม่กระทบขอบเขต Sprint 2)*

---

# Part E: Integrated Release Candidate, Demonstrations & Finish Plan (15 คะแนน)

## 1. แผนการปล่อยตัวระบบตามระเบียบวิศวกรรม (Engineering Release Plan)

เพื่อปฏิบัติตามข้อกำหนดของรายวิชา CPE 334 อย่างเคร่งครัด (ตามแบบแผนเดียวกับ Sprint 1 `sprint-1-staging` และ Lab 5 `lab5-staging` ใน `AGENTS.md`) ระบบ PopQueue **จะไม่มีการ Commit ตรงลง `main` หรือ `sprint-*-staging`, จะไม่มีการ Deploy สู่ Production จาก Staging Branch โดยตรง, และไม่มีการทำ Fast-forward merge ข้ามกระบวนการ Release PR** โดยมีแผนการแตก Branch และการปล่อยระบบ 2 ระยะดังนี้:

```
[feature/<id>-f05-cancel] ──┐
[feature/<id>-f06-no-show] ─┼─► PRs ─► [sprint2-staging] ──► Release PR ─► [main] ──► deploy.yml (Auto Deploy + Smoke) ──► Tag v0.4.0-sprint2
[feature/<id>-f07-board] ───┘                                                 │
                                                                              ▼ (sync sprint3-staging)
[feature/<id>-f09-series-toggle] ──► PR ─► [sprint3-staging] ──► Release PR ─► [main] ──► deploy.yml (Auto Deploy + Smoke) ──► Tag v0.5.0-d2-rc
```

> **ลำดับ Trigger จริงของ `.github/workflows/deploy.yml` ([EV-B06](#appendix-b)):** Workflow `Deploy demo` ทำงานอัตโนมัติเมื่อ **`push` เข้า branch `main` (ผ่าน Release PR merge)** หรือเรียกแบบ manual **`workflow_dispatch`** เท่านั้น — **ไม่ได้ trigger จากการ push Git Tag** ดังนั้นทุก Release ต้องเรียงลำดับเป็น **`Merge Release PR (→ main) ──► Automated Deploy + Smoke Test ──► Live Check PASS ──► สร้างและ Push Annotated Tag`**

1. **ระยะที่ 1 (Target Sprint 2 Release): `v0.4.0-sprint2` บน `main`**
   - แตก Branch รายฟีเจอร์จาก **`sprint2-staging`** ตามรูปแบบ `feature/<issue#>-<slug>` (`D2-I2` F-05, `D2-I3` F-06, `D2-I4` F-07)
   - เมื่อพัฒนาและผ่าน TDD (`[RED]` → `[GREEN]`) + Peer Review + CI (`test-and-docker`) แล้ว Merge เข้า **`sprint2-staging`** ด้วย `Create a merge commit`
   - เปิด **Release PR จาก `sprint2-staging` ไปยัง `main`** พร้อม Peer Review อย่างเป็นทางการ (ผู้ Approve ต้องไม่ใช่เจ้าของ commit ล่าสุดบน `sprint2-staging` ตาม `require_last_push_approval`)
   - Merge เข้า `main` → GitHub Actions `deploy.yml` รัน CI, Build Image (`--build-arg GIT_SHA`), รัน `popqueue-migrate`, Deploy ขึ้น Cloud Run service `popqueue`, และรัน `deploy/smoke_test.py` อัตโนมัติ
   - เมื่อ Live Smoke Check ผ่าน จึงสร้างและ Push Annotated Tag **`v0.4.0-sprint2`** บน commit นั้นของ `main`
2. **ระยะที่ 2 (Final Deliverable 2 Candidate): `v0.5.0-d2-rc` บน `main`**
   - แตก `sprint3-staging` จาก `main` หลัง `v0.4.0-sprint2` (โดย `@Theerawat82` สามารถเริ่มพัฒนาโค้ด/เทสต์ของ `D2-I5` F-09 ล่วงหน้าต่อจาก `D2-I3` F-06 ได้ทันที ไม่ต้องรอถึงคืนวันศุกร์ แล้วค่อย rebase/merge เข้า `sprint3-staging` เพื่อเปิด PR)
   - Merge Feature PR (`D2-I5` F-09) เข้า `sprint3-staging` → เปิด Release PR เข้า `main` → `deploy.yml` Deploy อัตโนมัติ → รัน Full Suite + Live Smoke & Persistence Check → Push Annotated Tag **`v0.5.0-d2-rc`**
3. **Rollback Plan (กรณี Deploy บน `main` มีปัญหา):**
   - **ทางเลือกที่ 1 (CI/CD Automated Rollback):** รัน `.github/workflows/deploy.yml` ผ่าน `workflow_dispatch` โดยระบุ `image_tag = <40-char previous healthy commit SHA>` (เรียก `deploy/release.sh` โหมด `ROLLBACK=true` ใช้ `@sha256` digest เดิมโดยไม่ rebuild และไม่รัน migration ซ้ำ)
   - **ทางเลือกที่ 2 (Instant Cloud Run Traffic Shift < 5s):** `gcloud run services update-traffic popqueue --region=asia-southeast1 --project=cpe334-bfteam --to-revisions=<PREVIOUS_REVISION>=100`

---

## 2. ตารางสถานะความสมบูรณ์ของ Sprint 2 (Sprint 2 Completion Table)

| Feature ID | Feature Name | Acceptance Criteria (ACs) | Implementation Artifacts | Verification Suites | Status / Result | Release Tag |
| :---: | :--- | :--- | :--- | :--- | :---: | :---: |
| **F-05** | Queue Cancellation | AC-41.1..AC-41.11 | `ticket.service.ts`<br>`ticket.routes.ts`<br>`MyTicketPage.tsx` | `TEST-41A..41L`<br>`cancel-race.test.ts` | `planned` | `v0.4.0-sprint2` |
| **F-06** | Server 120s No-Show | AC-42.1..42.3, AC-43.1..43.10 | `staff.service.ts`<br>`staff.routes.ts`<br>`CountdownTimer.tsx` | `TEST-42A..D`<br>`TEST-43A..K`, `43U`<br>`no-show-race.test.ts` | `planned` | `v0.4.0-sprint2` |
| **F-07** | Public Queue Board | AC-44.1..AC-44.8 | `public.service.ts`<br>`public.routes.ts`<br>`BoardPage.tsx` | `TEST-44A..44G`<br>`public-board.spec.ts` | `planned` | `v0.4.0-sprint2` |

---

## 3. ตารางตรวจสอบฟีเจอร์ข้ามระบบ (Cross-Feature Checks: CF-01..CF-08)

| Check ID | ชื่อการตรวจสอบ (Cross-Feature Interaction) | กฎและพฤติกรรมที่ต้องยืนยัน (Behavior & Invariant) | ชุดทดสอบที่ครอบคลุม | สถานะ (Status) |
| :---: | :--- | :--- | :---: | :---: |
| **CF-01** | `cancel` × `call-next` | ตั๋วที่ถูก Cancel ต้องไม่ถูก `call-next` เรียก ([EV-B05](#appendix-b)); หากกดพร้อมกันบนตั๋วใบเดียว ฝั่งแพ้ได้ 404 หรือ 400 | `TEST-41F`, `TEST-41H` | `planned` |
| **CF-02** | `no-show` × `call-next` | หลังตัดสิทธิ์ No-Show สำเร็จ พนักงานหลุดจาก `STAFF_BUSY` และเรียกตั๋วถัดไปได้ทันที ([EV-A02](#appendix-b)) | `TEST-43B` | `planned` |
| **CF-03** | `cancel` × Multi-Ticket (BR-02 v2) | ยกเลิกตั๋ว 1 ใบในมือ ตั๋วใบอื่นในซีรีส์อื่นยังคงอยู่ปกติ ([EV-B04](#appendix-b)); ยกเลิกใบสุดท้ายแสดง Empty State สะอาด | `TEST-41G`, `TEST-41K` | `planned` |
| **CF-04** | `series-toggle` × `join` | เมื่อปิดซีรีส์ (`isActive: false`) คำขอ Join ใหม่ต้องถูกปฏิเสธด้วย `409 SERIES_CLOSED` (AC-12) | `TEST-46B` | `planned` |
| **CF-05** | `series-toggle` × Public Board | ซีรีส์ที่ปิดแต่มีตั๋วค้าง ยังคงแสดงบนบอร์ดพร้อมป้าย Badge "ปิดรับคิวใหม่"; หากไม่มีตั๋วค้างให้ซ่อน (`DEC-04`) | `TEST-44D`, `TEST-44G` | `planned` |
| **CF-06** | `cancel` / `no-show` × Public Board | ตั๋วที่ถูก Cancel หรือ No-Show ต้องหายจากบอร์ดหน้าร้านทันทีภายในการ Polling รอบถัดไป | `TEST-44A`, `TEST-44C` | `planned` |
| **CF-07** | Role Guard Consistency | ทุก Endpoint ใหม่ต้องคืน HTTP `403 FORBIDDEN_ROLE` เมื่อเรียกโดย Role ที่ไม่ได้รับอนุญาต ([EV-B01](#appendix-b)) | `TEST-41I`, `43G`, `45B`, `46F` | `planned` |
| **CF-08** | Sprint 1 Critical Journey Invariant | การเพิ่มฟีเจอร์ทั้งหมดต้องไม่ทำให้ E2E Journey เดิมของ Sprint 1 เกิด Regression ([EV-A07](#appendix-b)) | `e2e/full-journey.spec.ts` | `tested` (`v0.3.0-lab7`; re-run `planned` on `v0.5.0-d2-rc`) |

---

## 4. แผนการแตกงานและรายละเอียด 6 Issues (Deliverable 2 Execution Backlog: `D2-I1` – `D2-I6`)

เพื่อให้การดำเนินงานระหว่าง **`@apfirst13`** และ **`@Theerawat82`** เดินขนานกันได้จริง ไม่ติด Ruleset Deadlock (`require_last_push_approval`), ตรวจสอบย้อนกลับได้ครบตามเกณฑ์ PR Chain และส่งมอบทันเส้นตาย **อาทิตย์ 29 พ.ย. 2026 เวลา 23:59 น.** งานทั้งหมดในรอบ Deliverable 2 ถูกแบ่งออกเป็น **6 GitHub Issues** ดังรายละเอียดต่อไปนี้ *(เมื่อเปิด Issue บน GitHub แล้วให้เติมเลข `#63..#68` แทน `<issue#>` และตั้งชื่อ Branch ตาม `AGENTS.md` Rule 2)*:

### ตารางสรุปการหมุนเวียนสิทธิ์ 6 Issues (Ruleset-Safe PR & Ownership Matrix)

| Issue Key | GitHub Issue | ชื่องานและฟีเจอร์หลัก (Scope) | Branch Name (`AGENTS.md` Rule 2) | Target Branch | Author / Opener | Reviewer & Merger | Covered ACs & Tests | เป้าหมายเสร็จ (Target) |
| :---: | :---: | :--- | :--- | :---: | :---: | :---: | :--- | :---: |
| **`D2-I1`** | `#TBD` *(PR `#62`)* | **Contract & Plan Baseline (`v1.7`):** Master Spec + `AGENTS.md` + ปิดลูปหลักฐาน Lab 7 (`#55`) | `docs/sprint2-master-contract` | `sprint2-staging` | `@Theerawat82` | `@apfirst13` | Contract Gate (`G0/G1`), `EV-A/B/D` | **พ. 25 พ.ย. 12:00** |
| **`D2-I2`** | `#TBD` | **F-05 Queue Cancellation:** API `POST /api/tickets/:id/cancel` + UI ปุ่มยกเลิก/Modal/Empty State + Race Test | `feature/<id>-f05-cancel` *(จาก `sprint2-staging`)* | `sprint2-staging` | `@apfirst13` | `@Theerawat82` | `AC-41.1..41.11`, `TEST-41A..41L`, `CF-01`, `CF-03` | **พ. 25 พ.ย. 23:59** |
| **`D2-I3`** | `#TBD` | **F-06 Server-Enforced 120s No-Show & `serverNow` Sync:** `POST /api/staff/tickets/:id/no-show` + `serverNow` บน 3 API + Countdown ทั้ง `/my-ticket` (`LIM-01`) และ `/staff/counter` | `feature/<id>-f06-no-show` *(จาก `sprint2-staging`)* | `sprint2-staging` | `@Theerawat82` | `@apfirst13` | `AC-42.1..42.3`, `AC-43.1..43.10`, `TEST-42A..D`, `TEST-43A..K/U`, `CF-02` | **พฤ. 26 พ.ย. 18:00** |
| **`D2-I4`** | `#TBD` | **F-07 Public Queue Board & Sprint 2 Release (`v0.4.0-sprint2`):** `GET /api/public/queue-board` (Zero PII) + `/board` Kiosk UI + Release PR `sprint2-staging → main` + Deploy & Tag | `feature/<id>-f07-public-board` *(จาก `sprint2-staging`)* | `sprint2-staging` → `main` | `@apfirst13` *(Feature)*<br>สลับ opener/merger ตอน Release PR ตาม HEAD author | `@Theerawat82` | `AC-44.1..44.8`, `TEST-44A..44G`, `CF-05`, `CF-06` | **ศ. 27 พ.ย. 12:00** (Feature/Gate)<br>**ศ. 27 พ.ย. 18:00** (`v0.4.0` deployed) |
| **`D2-I5`** | `#TBD` | **F-09 Series Availability Control (Sprint 3 Working Progress):** `PATCH /api/staff/series/:id/status` + `isActive` ใน `GET /api/staff/tickets` + Toggle Switch UI | `feature/<id>-f09-series-toggle` *(เริ่มโค้ดได้ทันทีหลัง `D2-I3`; PR เข้า `sprint3-staging`)* | `sprint3-staging` | `@Theerawat82` | `@apfirst13` | `AC-46.1..46.5`, `TEST-46A..46F`, `CF-04`, `CF-05`, `CF-07` | **ส. 28 พ.ย. 12:00** *(โค้ดเริ่ม พฤ.ค่ำ/ศ.)* |
| **`D2-I6`** | `#TBD` | **Final Candidate (`v0.5.0-d2-rc`), Full Regression, Live Verification & Deliverable 2 PDF:** Release PR `sprint3-staging → main`, รัน Full Suite Verbose + Persistence + Live Cloud Run + Private Credential Handoff + Export PDF | `docs/<id>-d2-final-report` | `sprint3-staging` → `main` | ทั้งสองคน (`@apfirst13` ↔ `@Theerawat82`) | Cross-Review | `CF-08`, Full Suite Verbose, Persistence, Demo 1–5, PDF Rubric 70 pts | **ส. 28 พ.ย. 18:00** (`v0.5.0` Freeze)<br>**อา. 29 พ.ย. 18:00** (ส่ง LEB2 ก่อน 23:59) |

### รายละเอียดการดำเนินการราย Issue (Actionable Specifications & Exit Criteria)

1. **`D2-I1` — Sprint 2 Master Contract, Governance & Baseline Verification (`PR #62`)**
   - **Deliverables:** ปรับปรุง `docs/sprints/sprint-2/PopQueue_Deliverable_2_Master.md` (`v1.7`) + `AGENTS.md` ให้สอดคล้องกับโค้ดจริงบน `main` (`a07a7be`), ปิดลูปคอมเมนต์หลักฐาน Live Verification ของ Lab 7 ใน Issue `#55` (หรือปรับสถานะตามจริง), และยืนยัน `DEC-02` กับ TA
   - **Exit Criteria:** `PR #62` ผ่านการ Review/Approve โดย `@apfirst13` และ Merge เข้า `sprint2-staging` ด้วย `Create a merge commit` (zero code changes)

2. **`D2-I2` — `F-05` Queue Cancellation (Track A — `@apfirst13`)**
   - **Deliverables:**
     - ขยาย `canTransition` (`WAITING → CANCELLED`) ใน `server/src/utils/state-machine.ts`
     - เพิ่ม `cancelTicket` ใน `server/src/services/ticket.service.ts` (Atomic `updateMany` + `forfeitedAt: clock.now()`), route `POST /api/tickets/:id/cancel` ใน `server/src/routes/ticket.routes.ts` พร้อม deterministic errors `401/403/400/404/403/400`
     - เพิ่ม `cancelTicket` ใน `client/src/api/ticket.api.ts`, ปุ่มยกเลิก + Confirmation Modal + Double-submit disabled state + Toast + Clean Empty State (`404 NO_ACTIVE_TICKET` ไม่ขึ้นกรอบแดง) บน `client/src/pages/MyTicketPage.tsx`
   - **TDD & Exit Criteria:** Commit 1 `[RED]` → Commit 2 `[GREEN]` ผ่าน `TEST-41A..41L`, `cancel-race.test.ts` (`CF-01`), `client/src/tests/ticket.test.tsx`, และ Regression เดิม 194 tests + CI เขียว + Review โดย `@Theerawat82`

3. **`D2-I3` — `F-06` Server-Enforced 120s No-Show & `serverNow` Sync (Track B — `@Theerawat82`, ขนานกับ `D2-I2`)**
   - **Deliverables:**
     - ขยาย `canTransition` (`CALLED → NO_SHOW`) ใน `server/src/utils/state-machine.ts` (`TEST-43U`)
     - เพิ่ม `noShow` ใน `server/src/services/staff.service.ts` (ใช้ `clock.now()`, `Math.ceil` สำหรับ `remainingSeconds`, Atomic `updateMany`, คง `startUnboxing` เดิมไว้) และ route `POST /api/staff/tickets/:id/no-show`
     - เพิ่ม `data.serverNow` (`clock.now().toISOString()`) ใน `POST /api/staff/call-next`, `GET /api/tickets/my-ticket`, `GET /api/staff/tickets` โดยรักษา backward compatibility ของ `data.ticket` / `data.tickets`
     - อัปเดต `CountdownTimer.tsx`, `MyTicketPage.tsx` (ปิด `LIM-01` รีเฟรชไม่รีเซ็ต `02:00`), และ `StaffCounterPage.tsx` (ปุ่ม No-Show disable <120s / enable ≥120s + Modal + Toast)
   - **TDD & Exit Criteria:** Commit 1 `[RED]` → Commit 2 `[GREEN]` ผ่าน `TEST-42A..D`, `TEST-43A..K/U`, `no-show-race.test.ts` (`CF-02`), `staff.test.tsx`, `ticket.test.tsx` + Regression เดิม + CI เขียว + Review โดย `@apfirst13`

4. **`D2-I4` — `F-07` Public Queue Display Board & Sprint 2 Release `v0.4.0-sprint2` (Track A — `@apfirst13`)**
   - **Deliverables:**
     - สร้าง `server/src/services/public.service.ts` (Prisma `select` projection ปลอด PII, `ORDER BY queueDate ASC, queueNumber ASC`, `nowServing` เรียง `calledAt ASC`, `upNext` max 5, ซ่อนซีรีส์ปิดที่ไม่มีตั๋ว `DEC-04`, แสดงซีรีส์เปิดว่าง) และ `server/src/routes/public.routes.ts` (`GET /api/public/queue-board`, `Cache-Control: no-store...`, ไม่ผ่าน auth)
     - สร้าง `client/src/pages/BoardPage.tsx` (route `/board` Kiosk-style, 3s polling, Error/Degraded banner, ป้าย `"ปิดรับคิวใหม่"`, Responsive `1920×1080` / `768px` / `375px`)
     - ผ่าน **Go/No-Go Decision Gate (ศ. 27 พ.ย. 12:00)** → เปิด Release PR `sprint2-staging → main` → Merge ให้ `deploy.yml` Deploy อัตโนมัติ → Smoke Check ผ่าน → สร้าง Annotated Tag **`v0.4.0-sprint2`**
   - **TDD & Exit Criteria:** `TEST-44A..44G`, `e2e/public-board.spec.ts`, `e2e/responsive.spec.ts` ผ่าน 100%, `CF-05`/`CF-06` ผ่าน, และ Live Cloud Run แสดง commit ตรงกับ `v0.4.0-sprint2`

5. **`D2-I5` — `F-09` Series Availability Control — Sprint 3 Working Progress (Track B — `@Theerawat82`)**
   - **Scheduling De-risk Rule:** เพื่อไม่ให้ Part C (15 คะแนน) ไปกระจุกเสี่ยงในวันเสาร์ `@Theerawat82` **เริ่มเขียนโค้ดและเทสต์ของ `D2-I5` ได้ทันทีหลังจบ `D2-I3` (พฤ. ค่ำ / ศ. เช้า)** บน branch `feature/<id>-f09-series-toggle` จากนั้นเมื่อ `v0.4.0-sprint2` ขึ้น `main` จึงแตก `sprint3-staging` จาก `main`, ซิงก์ branch, และเปิด PR เข้า `sprint3-staging` ทันที
   - **Deliverables:**
     - เพิ่ม `PATCH /api/staff/series/:id/status` ใน `staff.routes.ts` / `staff.service.ts` (Auth/Role/Validation/404/Series Guard + Idempotency)
     - เพิ่ม `isActive: boolean` ใน DTO ของ `GET /api/staff/tickets` (โดยไม่กรองซีรีส์ที่ปิดออก) และติดตั้ง Toggle Switch + Loading/Toast/Rollback-on-Error บน `StaffCounterPage.tsx`
   - **TDD & Exit Criteria:** `TEST-46A..46F` ผ่านครบ (ยืนยัน `CF-04`, `CF-05`, `CF-07` และ continuity `AC-46.4`) + Review โดย `@apfirst13` + Merge เข้า `sprint3-staging`

6. **`D2-I6` — Final Candidate (`v0.5.0-d2-rc`), Full Verification, Live Checks & Self-Contained PDF (คู่กัน)**
   - **Deliverables:**
     - Release PR `sprint3-staging → main` → Merge ให้ `deploy.yml` Deploy ขึ้น Cloud Run + รัน `popqueue-migrate` + `smoke_test.py` → Tag **`v0.5.0-d2-rc`** (**Code Freeze ส. 28 พ.ย. 18:00**)
     - รันชุดทดสอบเต็มบน commit ของ `v0.5.0-d2-rc`: `npm test -- --reporter=verbose`, `npm run typecheck`, `npm run lint`, `npm run build`, `npm run test:e2e` (รวม `full-journey.spec.ts` `CF-08` และ cancel → re-join E2E), `npm run test:persistence` (3/3), และ Live Cloud Run Verification (บันทึกรูป Demo 1–5 + Cloud Run Revision name + `/api/health` SHA)
     - ส่งรหัสผ่านบัญชีทดสอบ Live ผ่าน **Private Course Handoff (LEB2)** โดยไม่ใส่รหัสลงใน PDF/Git
     - อัปเดต `PopQueue_Deliverable_2_Master.md` (เปลี่ยนสถานะจาก `planned` → `tested`/`accepted`, ฝัง Raw Excerpts, Commit SHAs, Release Notes, Test Counts) → Export เป็น Self-Contained PDF ตรวจหน้ากระดาษ/ตารางไม่ตกขอบ → ส่ง LEB2 ก่อน **อา. 29 พ.ย. 18:00** (เส้นตาย 23:59)

---

## 5. แผนการจัดเตรียมหลักฐานการทดสอบสำหรับรายงาน PDF (Evidence Plan: §4.1)

1. **Test Excerpt #1 (Domain Rule Evidence):**  
   คัดเลือกโค้ดทดสอบจาก `server/tests/api/no-show.test.ts` (เคส `TEST-42B` และ `TEST-43A`) แสดงการใช้ `FakeClock` ควบคุมเวลา $\ge 120$ วินาที เพื่อพิสูจน์กฎธุรกิจการตัดสิทธิ์ No-Show พร้อมผลรัน Vitest
2. **Test Excerpt #2 (Access Restriction Evidence):**  
   คัดเลือกโค้ดทดสอบจาก `server/tests/api/cancel.test.ts` (เคส `TEST-41C`) แสดงการส่งคำขอยกเลิกตั๋วของผู้อื่น และยืนยันการตอบกลับ HTTP `403 FORBIDDEN_OWNERSHIP` จากระดับ Backend
3. **TDD RED/GREEN Evidence Chain:**  
   บันทึกหลักฐานคู่ Commit ของฟีเจอร์ F-05 (`D2-I2`) และ F-06 (`D2-I3`):
   - Commit `[RED]`: SHA + ผลการรัน Vitest ที่ล้มเหลวเพราะ Assertion (`expected 200, received 404`)
   - Commit `[GREEN]`: SHA + ผลการรัน Vitest ที่ผ่านครบทั้งชุด
   - `git diff --stat` ระหว่าง 2 Commits เพื่อแสดงปริมาณโค้ดที่เพิ่มขึ้น
4. **Issue / PR Chain Evidence:**  
   แสดงประวัติ Git Lineage ครบวงจรอย่างน้อย 2 สายงาน (`feature/<issue#>-<slug>`):
   - สายงานที่ 1 (`D2-I2` F-05): GitHub Issue → Branch `feature/<id>-f05-cancel` → PR + 5-Lenses Review Comments → Merge เข้า `sprint2-staging`
   - สายงานที่ 2 (`D2-I3` F-06): GitHub Issue → Branch `feature/<id>-f06-no-show` → PR + Review Comments → Merge เข้า `sprint2-staging`
5. **Program Demonstrations (Screenshots with API Payloads & Full Candidate E2E):**  
   จับภาพหน้าจอคู่กับ DevTools Network Panel บน **`v0.5.0-d2-rc`** (หมายเหตุ: เคส `403` ที่ UI ซ่อนปุ่มให้แนบหลักฐานจาก API call / Vitest log คู่กัน):
   - Demo 1: Sprint 1 Continuity Journey บน Candidate `v0.5.0-d2-rc` (`CF-08`)
   - Demo 2: Collector กดยกเลิกคิวตนเองสำเร็จ + Re-join (`cancel → re-join` E2E) พร้อมหลักฐาน API `403 FORBIDDEN_OWNERSHIP`
   - Demo 3: Staff Countdown นับถอยหลัง 120s + Collector `/my-ticket` sync `serverNow` และกดตัด No-Show สำเร็จ
   - Demo 4: จอบอร์ดสาธารณะ `/board` แสดง Now Serving, Up Next และ Error/Empty State อัปเดตอัตโนมัติ
   - Demo 5: Staff กด Toggle ปิดซีรีส์ (`F-09`) และ Collector ถูกปฏิเสธด้วย `409 SERIES_CLOSED` ขณะที่ตั๋วค้างเดิมยังให้บริการจนจบ

---

## 6. ตารางเวลารวมเดียวและ Go/No-Go Gate (Single Unified Finish Plan: G0–G6 & Post-D2)

> **หมายเหตุความสอดคล้อง:** ตารางนี้เป็น **ตารางเวลาชุดเดียว (Single Source of Truth)** ที่เชื่อมตรงกับ 6 Issues ใน §4 เพื่อไม่ให้เกิดเวลาขัดแย้งกัน **`[รอทีมยืนยันวันสอบ/งานวิชาอื่นในช่วง 25–29 พ.ย. และ 1–11 ธ.ค. เพื่อปรับวัน Post-D2 หากชนสอบ]`**

| Gate / ระยะ | Issue ที่ผูก | วัน–เวลาเป้าหมาย (ICT) | กิจกรรมทางวิศวกรรมหลัก (Engineering Tasks) | เกณฑ์ความสำเร็จ (Exit Criteria) | ผู้รับผิดชอบ | Dependency |
| :---: | :---: | :---: | :--- | :--- | :---: | :---: |
| **G0 / G1** | **`D2-I1`** | **พ. 25 พ.ย. 12:00** | Merge Contract PR `#62` (`v1.7` + `AGENTS.md`) เข้า `sprint2-staging`, เปิด Issues `D2-I2..I6`, คอมเมนต์ปิดลูป Live Check ใน Issue `#55`, ยืนยัน `DEC-02` กับ TA | PR `#62` Merged เข้า `sprint2-staging`, 6 Issues เปิดครบ | `@Theerawat82` & `@apfirst13` | - |
| **G2a (Track A)** | **`D2-I2`** | **พ. 25 พ.ย. 23:59** | พัฒนา `F-05` Cancel ด้วย TDD `[RED]`→`[GREEN]` + UI `/my-ticket` + `cancel-race.test.ts` | `TEST-41A..41L` ผ่าน, PR Merged เข้า `sprint2-staging` | `@apfirst13` (Author)<br>`@Theerawat82` (Reviewer) | `G1` |
| **G2b (Track B)** | **`D2-I3`** | **พ. 25 – พฤ. 26 พ.ย. 18:00** | พัฒนา `F-06` No-Show 120s + `serverNow` Sync ทั้ง Staff & Collector `/my-ticket` (**ทำขนานกับ `D2-I2`**) | `TEST-42A..D`, `TEST-43A..K/U` ผ่าน, PR Merged เข้า `sprint2-staging` | `@Theerawat82` (Author)<br>`@apfirst13` (Reviewer) | `G1` *(อิสระจาก `D2-I2`)* |
| **G3a (Track A)** | **`D2-I4`** | **พฤ. 26 – ศ. 27 พ.ย. 12:00** | พัฒนา `F-07` Public Queue Board (`/api/public/queue-board`, `/board` UI, Polling 3s, E2E) | `TEST-44A..44G` ผ่าน, PR พร้อมบน `sprint2-staging` | `@apfirst13` (Author)<br>`@Theerawat82` (Reviewer) | `G2a` |
| **G3b (Parallel Prep)** | **`D2-I5`** | **พฤ. 26 18:00 – ศ. 27 พ.ย. 18:00** | `@Theerawat82` พัฒนาโค้ด/เทสต์ `F-09` Series Toggle ล่วงหน้าบน feature branch **ขนานกับ `D2-I4`** (ลดความเสี่ยง Part C) | `TEST-46A..46F` ผ่านใน local พร้อมเปิด PR ทันทีหลัง `v0.4.0` | `@Theerawat82` | `G2b` |
| **Go/No-Go Gate** | **`D2-I4`** | **ศ. 27 พ.ย. 12:00** | ทบทวนความพร้อม `F-05`, `F-06`, `F-07` บน `sprint2-staging` (หาก `F-07` UI มีปัญหาล็อกเป็น Minimum Viable Board ตาม `AC-44.1..44.8`; หากต้อง Scope Revision ให้ขอ TA อนุมัติเป็นลายลักษณ์อักษร) | ยืนยันความพร้อมเปิด Release PR `v0.4.0-sprint2` | ทั้งสองคน | `G2a`, `G2b`, `G3a` |
| **G4 (Release `v0.4.0`)** | **`D2-I4`** | **ศ. 27 พ.ย. 18:00** | เปิด Release PR `sprint2-staging → main` → Merge (`deploy.yml` Deploy อัตโนมัติ + `smoke_test.py`) → ตรวจ Live ผ่าน → Push Tag **`v0.4.0-sprint2`** | `v0.4.0-sprint2` Live บน `popqueue` Cloud Run | ทั้งสองคน | `Go/No-Go Gate` |
| **G5a (`F-09` Merge)** | **`D2-I5`** | **ส. 28 พ.ย. 12:00** | แตก `sprint3-staging` จาก `main` (`v0.4.0-sprint2`) → เปิด PR `D2-I5` (`F-09`) → Review & CI → Merge เข้า `sprint3-staging` | `TEST-46A..46F` + `CF-04/05/07` ผ่านบน CI | `@Theerawat82` (Author)<br>`@apfirst13` (Reviewer) | `G4`, `G3b` |
| **G5b (Freeze `v0.5.0`)** | **`D2-I6`** | **ส. 28 พ.ย. 18:00** | Release PR `sprint3-staging → main` → `deploy.yml` Deploy อัตโนมัติ → รัน **Full Suite Verbose + E2E + Persistence + Cloud Run Live Check** → Push Tag **`v0.5.0-d2-rc`** (**Code Freeze**) | Full Suite + E2E + Persistence + Live Check ผ่าน 100% บน `v0.5.0-d2-rc` | ทั้งสองคน | `G5a` |
| **G6 (PDF & Handoff)** | **`D2-I6`** | **อา. 29 พ.ย. 18:00** *(เส้นตาย 23:59)* | อัปเดต Master (`planned` → `tested/accepted` + Raw Outputs + Demo Screenshots + Release Notes), ส่งรหัสทดสอบ Live ผ่าน **Private Handoff (LEB2)**, ตรวจทาน & Export Deliverable 2 PDF | ส่ง Deliverable 2 PDF + Private Test Credentials บน LEB2 ครบถ้วน | ทั้งสองคน | `G5b` |
| **Post-D2 (Sprint 3 Final)** | `F-08`, `S3-HARDEN`, Final | **30 พ.ย. – 13 ธ.ค.** *(`[ปรับตามตารางสอบ 1–11 ธ.ค.]`)* | พัฒนา `F-08` Analytics (`AC-45.1..45.4`), `S3-HARDEN` Rate Limit (`AC-47.1..47.3`), UAT Re-test, Full Regression, ถ่ายทำวิดีโอ Final Demo, และรายงาน Final | Tag `v1.0.0-final` + วิดีโอ + รายงาน Final ส่ง 13 ธ.ค. | `@Theerawat82` (`F-08`)<br>`@apfirst13` (`S3-HARDEN`) | `G6` |

---

## 7. การประเมินความพร้อมในการปล่อยระบบ (Release Readiness Review: READY / NOT READY)

| มิติการประเมินความพร้อม (Readiness Lens) | เกณฑ์การประเมินตาม Rubric & Lecture 12 | สถานะปัจจุบัน (Current Status) | ผลการประเมิน (Readiness Verdict) |
| :--- | :--- | :---: | :---: |
| **1. Feature Implementation** | ฟีเจอร์ Sprint 2 (`F-05..07`) + Sprint 3 Progress (`F-09`) พัฒนาพร้อม TDD ครบ | `planned` (อยู่ระหว่างเริ่ม `D2-I2..I5`) | **NOT READY** |
| **2. Regression & Skipped Tests** | ชุดทดสอบเต็มรันผ่าน 100% บน Candidate (`0 failed, 0 skipped`) | `tested` บน Baseline `75068a6` (`194/194 pass, 0 skipped` — **ยังไม่ได้รันบน `v0.5.0-d2-rc`**) | **NOT READY FOR RC** *(Baseline READY — [EV-A07](#appendix-b))* |
| **3. Security & Role Guard Integrity** | 401/403 Guards, Zero PII Public Board, ไม่เปิดเผยรหัสจริงใน Git/PDF | Baseline `401/403` ผ่าน ([EV-B01](#appendix-b)); ฟีเจอร์ใหม่ `planned` | **NOT READY** *(รอ `D2-I2..I5`)* |
| **4. Live Deployment & Rollback Plan** | Deploy บน Cloud Run `popqueue` + Live Check + Rollback Procedure | Rollback procedure พร้อมใน `deploy.yml` (`workflow_dispatch` + `image_tag`); Live Candidate `planned` *(Issue `#55` รอปิดลูปคอมเมนต์)* | **NOT READY** *(รอ `D2-I4`/`D2-I6`)* |
| **5. Governance, Known Issues & Release Notes** | Contract ตรงโค้ดจริง, Known Issues (`LIM-01`, `G-07`, `TD-01..04`) เปิดเผยชัด, Release Notes ฉบับ Candidate | `in progress` (`v1.7` Contract Baseline รอ Merge PR `#62`; Release Notes ของ `v0.5.0-d2-rc` เติมใน `D2-I6`) | **IN PROGRESS** |
| **6. Evidence Plan Completeness** | 2 Test Excerpts, TDD Red/Green, 2 PR Chains, Captioned Screenshots, Private Credential Handoff | แผนครบใน §4–§5 (รอเก็บหลักฐานจริงใน `D2-I2..I6`) | **READY FOR EXECUTION** |
| **สรุปคำวินิจฉัยความพร้อมภาพรวม** | **Overall Release Candidate Verdict** | **NOT READY FOR PRODUCTION DEPLOYMENT**<br>*(คงสถานะ NOT READY ในขั้นแผน `v1.7` จนกว่าจะจบ `D2-I2..D2-I5`, ผ่าน Go/No-Go Gate ศ. 27 พ.ย. 12:00, Deploy และรัน Full Suite + Live Verification บน `v0.5.0-d2-rc` ใน `D2-I6`)* | |

# Appendix A: Local Setup, Deployment Ref, Safe Test Accounts & AI-Use Declaration

## 1. Setup Summary (คำแนะนำการติดตั้งสำหรับผู้ตรวจ)
```powershell
# 1. Clone repository เข้าสู่โฟลเดอร์ PopQueue
git clone https://github.com/apfirst13/PopQueue_BFteam.git PopQueue
cd PopQueue

# 2. สลับไปยัง Release Tag ตรวจประเมินบน main
# สำหรับผู้ตรวจ Deliverable 2 Final Candidate (เมื่อปล่อยแล้ว):
git checkout tags/v0.5.0-d2-rc  # (Baseline ปัจจุบันก่อนเขียนโค้ด Sprint 2 คือ tags/v0.3.0-lab7)

# 3. เตรียม Environment Variables จากไฟล์ตัวอย่าง (Local Dev เท่านั้น — ห้ามใช้ค่าตัวอย่างบน Production)
Copy-Item .env.example .env
Copy-Item server/.env.example server/.env
Copy-Item client/.env.example client/.env

# 4. ติดตั้ง Dependencies ทั้งหมดในระดับ Monorepo Workspaces
npm install

# 5. เริ่มต้นฐานข้อมูล PostgreSQL ผ่าน Docker Compose และเตรียมฐานข้อมูลทดสอบ popqueue_test
docker compose up -d db
docker compose exec db psql -U popqueue -c "CREATE DATABASE popqueue_test;"

# 6. รัน Database Migrations และ Seed ข้อมูลเริ่มต้น (แทน <LOCAL_DB_PASSWORD> ด้วยรหัสจากไฟล์ .env ในเครื่อง Local)
npm run db:migrate
npm run db:seed
$env:DATABASE_URL="postgresql://popqueue:<LOCAL_DB_PASSWORD>@localhost:5432/popqueue_test?schema=public"
npx prisma migrate deploy --schema server/prisma/schema.prisma
Remove-Item Env:DATABASE_URL

# 7. ตรวจสอบความสมบูรณ์ของระบบผ่านชุดทดสอบอัตโนมัติ
npm test
npm run test:e2e

# 8. รันระบบในโหมดพัฒนา (Development Mode — เลือกวิธีใดวิธีหนึ่ง):
# วิธีที่ 1: รันผ่าน 2 Terminals (แนะนำสำหรับ Local Development)
# Terminal 1 (Backend API Port 4000):
npm run dev
# Terminal 2 (Vite Frontend Port 3000):
npm run dev --workspace=client

# วิธีที่ 2: รันทั้งระบบผ่าน Docker Compose
docker compose up -d --build
# Application Frontend (Nginx proxy): http://localhost:5173
# Backend Health API: http://localhost:3000/api/health
```

### 1.1 Cloud Run Deployment & Rollback Reference (`.github/workflows/deploy.yml`)
* **GCP Project / Service:** `cpe334-bfteam` (`asia-southeast1`), Cloud Run Service `popqueue`, Cloud SQL `popqueue-pg`, Cloud Run Job `popqueue-migrate`
* **CD Trigger:** อัตโนมัติเมื่อ `push` (Merge Release PR) เข้า branch **`main`** หรือ manual `workflow_dispatch` (ไม่ trigger เมื่อ push tag)
* **Secrets Management:** Production อ่าน `DATABASE_URL` และ `JWT_SECRET` จาก GCP Secret Manager (`popqueue-database-url`, `popqueue-jwt-secret`) และยืนยันตัวตนผ่าน keyless OIDC WIF (`github-actions` / `github-main`, zero static JSON keys)
* **Rollback:** รัน `deploy.yml` ผ่าน `workflow_dispatch` โดยระบุ `image_tag=<previous-40-char-sha>` (reuses immutable `@sha256` digest โดยไม่ rebuild/re-migrate) หรือใช้ `gcloud run services update-traffic popqueue --to-revisions=<PREVIOUS_REVISION>=100`

## 2. Safe Test Accounts (ข้อมูลบัญชีสำหรับทดสอบ — Sanitized)

> **ความปลอดภัยของข้อมูลการทดสอบ (Credential Sanitization):**  
> ตามระเบียบการรักษาความปลอดภัยของระบบ ไม่มีรหัสผ่านจริงอยู่ในเอกสาร PDF หรือรายงานฉบับนี้:
> - **สำหรับรันบนเครื่อง Local (`docker compose` / Node):** ใช้ค่า local-dev ที่ตั้งใน `.env` ของเครื่องตนเอง (อิงโครงสร้างจาก `.env.example` เฉพาะสภาพแวดล้อม Local เท่านั้น)
> - **สำหรับทดสอบ Live Cloud Run (`https://popqueue-5now4hkvsa-as.a.run.app`):** รับรหัสผ่านบัญชีทดสอบจาก **Private Course Handoff (ช่องทางส่งงานส่วนตัวใน LEB2)** เท่านั้น *(ห้ามนำรหัสผ่าน Production ใส่ใน Git หรือ PDF; `[รอทีมยืนยันการแยกรหัส seed บน Cloud Run]`)*

| บทบาท (Role) | บัญชีผู้ใช้ (Username) | สิทธิ์การเข้าถึงและกรณีทดสอบหลัก (Scope & Test Scenarios) |
| :--- | :--- | :--- |
| `COLLECTOR` | `collector1` | ลูกค้าหลัก: จองคิวซีรีส์ `CRY`, ดูตั๋วตนเอง, ทดสอบกดยกเลิกคิว (`F-05`) |
| `COLLECTOR` | `collector2` | ลูกค้าหลัก: จองคิวซีรีส์ `LAB`, ทดสอบการจองข้ามซีรีส์ (`BR-02 v2`), ตรวจสอบการนับคิวรอถัดไป |
| `COLLECTOR` | `collector3` | ลูกค้าทั่วไป: บัญชีสำหรับการทดสอบ Concurrency และ Parallel Joining |
| `COLLECTOR` | `collector4` .. `collector6` | บัญชีสำรอง: สำหรับทดสอบ Queue Overflow และ Concurrency Stress Testing |
| `BOX_MASTER` | `staff_crybaby` | พนักงานประจำสถานี คนที่ 1: ดูแลซีรีส์ `CRY` (Call Next, Start, Complete, ตัดสิทธิ์ No-Show `F-06`, ปิดซีรีส์ `F-09`) |
| `BOX_MASTER` | `staff_crybaby2` | พนักงานประจำสถานี คนที่ 2: ดูแลซีรีส์ `CRY` (ทดสอบ Concurrency Call Next ระหว่าง 2 Staff ในซีรีส์เดียวกัน) |
| `BOX_MASTER` | `staff_labubu` | พนักงานประจำสถานี: ดูแลซีรีส์ `LAB` (Call Next, Start, Complete, No-Show, ปิดซีรีส์ `F-09`) |
> *(หมายเหตุ: ในระบบ Seed ปัจจุบันไม่มีพนักงานที่ดูแล 2 ซีรีส์พร้อมกัน โดยแยกสถานีประจำการ 1 คนต่อ 1 ซีรีส์ตาม StaffSeriesAssignment)*

## 3. Contribution Table (ตารางการมีส่วนร่วมของสมาชิก — Spec §2)

| หมวดหมู่งาน / ฟีเจอร์หลัก | `@apfirst13` (aphiwat) | `@Theerawat82` (Theerawat) | สถานะของงาน (Task Status) |
| :--- | :---: | :---: | :---: |
| Lab 5–7 Continuity, CI/CD Pipeline & Maintenance (`v0.2.0`–`v0.3.0`) | Co-Author / Reviewer | Co-Author / Reviewer | `accepted` |
| Master Contract `v1.0–v1.7` & `AGENTS.md` (`D2-I1`, PR `#62`) | Author (`v1.0–v1.5`) / Reviewer (`v1.6–v1.7`) | Reviewer (`v1.0–v1.5`) / Author (`v1.6–v1.7`) | `in progress` |
| `D2-I2`: F-05 Queue Cancellation (Backend, UI & TDD Tests) | Author | Reviewer & Merger | `planned` |
| `D2-I3`: F-06 No-Show 120s & `serverNow` Sync (Backend, UI & TDD Tests) | Reviewer & Merger | Author | `planned` |
| `D2-I4`: F-07 Public Queue Display Board & `v0.4.0-sprint2` Release | Author | Reviewer & Merger | `planned` |
| `D2-I5`: F-09 Series Availability Control (Sprint 3 Working Progress) | Reviewer & Merger | Author | `planned` |
| Deployment Verification, Live Smoke/Persistence & Rollback Checks (`D2-I6`) | Co-Executor | Co-Executor | `planned` |
| Automated Testing, TDD Gate Enforcement & AI Output Verification | Co-Reviewer / Supervisor | Co-Reviewer / Supervisor | `in progress` |
| Final Deliverable 2 PDF Report Assembly & Private Credential Handoff (`D2-I6`) | Co-Author | Co-Author | `planned` |

## 4. AI-Use Declaration
ในการจัดทำเอกสาร Master Contract และดำเนินงานพัฒนา Deliverable 2 ทีมงานได้ใช้งานเครื่องมือ AI ตามระเบียบข้อบังคับของรายวิชา CPE 334 ดังนี้:
1. **Claude Sonnet 5.5 (Anthropic):** ใช้สำหรับการทวนสอบความสอดคล้องของเอกสารเทียบกับ Rubric เกณฑ์การประเมิน และตรวจหาช่องว่างของ Contract / AC / STS
2. **Antigravity AI Assistant (Google DeepMind):** ใช้เป็นผู้ช่วยวิศวกรรมใน IDE สำหรับรันคำสั่งตรวจสอบ Ground Truth ภายใน Codebase, ตรวจ Git/GitHub lineage, จัดทำแผน 6 Issues และการทวนสอบ Test Suites
3. **`[รอทีมเติมรายชื่อ/รุ่น AI ของแชทอื่นๆ ที่ใช้ช่วยร่าง v1.0–v1.5 หรือเขียนโค้ดจริง]`**  
*ทั้งนี้ นักศึกษาทั้งสองคน (`@apfirst13` และ `@Theerawat82`) เป็นผู้ตัดสินใจทางวิศวกรรม กำหนดนโยบายธุรกิจ ตรวจทานคำสั่งและโค้ดทุกบรรทัด และอนุมัติเนื้อหาทั้งหมดด้วยตนเอง*

---

<a id="appendix-b"></a>

# Appendix B: Audited Evidence Catalog & Verbatim Command Excerpts (Self-Contained PDF Archive)
> ส่วนนี้สอดคล้อง 1:1 กับทะเบียนหลักฐานใน `§0.4` เพื่อให้เอกสารเป็น Self-Contained PDF ที่ตรวจทานคำสั่งและผลลัพธ์จริงได้ด้วยตนเอง *(หมายเหตุ: ผลรันชุดทดสอบเต็มแบบ verbose บน Release Candidate `v0.5.0-d2-rc` จะถูกเพิ่มเข้ามาใน Issue `D2-I6` ก่อนส่ง PDF)*

### 1. Ground-Truth Codebase & Migration Audit (EV-A01 ถึง EV-A10)
* **EV-A01 (Baseline Tags & SHAs):**
  ```text
  $ git rev-parse "v0.1.0-sprint1^{commit}" -> d946159ba82a249c195730a3b702cf0f68e96e2d
  $ git rev-parse "v0.2.0-lab5^{commit}"    -> bf52c9b969d905ba6f21bcc22a460f0db3dd5172
  $ git rev-parse "v0.3.0-lab7^{commit}"    -> a07a7be732b30cb75a22df7f30edfdc51521a87e
  ```
* **EV-A02 (Database Partial Indexes):** ตรวจไฟล์ Migration จริงใน `server/prisma/migrations/`:
  - `unique_active_ticket_user` (Migration `0002`, ถูก DROP ใน Migration `0003`)
  - `unique_active_staff_ticket` (`"handledByStaffId" WHERE status IN ('CALLED', 'UNBOXING')`, Migration `0002`)
  - `unique_active_ticket_user_series` (`("userId", "seriesId") WHERE status IN ('WAITING', 'CALLED', 'UNBOXING')`, Migration `0003`)
  - ทั้งหมดยกเว้น `CANCELLED` และ `NO_SHOW` ออกจาก Partial Unique Index 100%
* **EV-A03 (Prisma Schema Invariants):** `server/prisma/schema.prisma` มี enum `TicketStatus` ครบทั้ง `WAITING`, `CALLED`, `UNBOXING`, `COMPLETED`, `CANCELLED`, `NO_SHOW` (บรรทัด 15–22) และ `forfeitedAt DateTime?` (บรรทัด 74)
* **EV-A04 (Service Error Evaluation Flow):** ตรวจ `server/src/services/staff.service.ts::startUnboxing` และ `complete`: ลำดับตรวจคือ `404 RESOURCE_NOT_FOUND` → `403 FORBIDDEN_SERIES` → `403 FORBIDDEN_NOT_HANDLER` (มี null-guard `ticket.handledByStaffId !== null && ticket.handledByStaffId !== staffId`) → `400 INVALID_STATE_TRANSITION` → Atomic `updateMany`
* **EV-A05 (Clock Abstraction & Calls):** ตรวจ `server/src/utils/clock.ts` (`Clock`, `SystemClock`, `FakeClock`) และ `server/src/app.ts` (`app.locals.clock`); `calledAt`, `startedAt`, `completedAt` ใน `staff.service.ts` ใช้ `clock.now()` ทั้งหมด รองรับการทดสอบ boundary ด้วย `FakeClock`
* **EV-A06 (Health Endpoint & GIT_SHA):** `server/src/app.ts` (`GET /api/health`, `/api/v1/health`) คืน `{ status: 'ok', commit: process.env.GIT_SHA || 'dev' }` (vitest `health.test.ts` 4/4 passed)
* **EV-A07 (Baseline Regression Suite — Run on `75068a6`, bit-identical to `v0.3.0-lab7` per `EV-B02`):**
  ```text
  Baseline Commit Audited: 75068a6109439b7f5dcadd7713ba93115ab29043 (0 code diffs vs v0.3.0-lab7 / a07a7be)
  Server Vitest : 24/24 files, 153 passed, 0 failed, 0 skipped
  Client Vitest :  6/6  files,  34 passed, 0 failed, 0 skipped
  Playwright E2E:  3/3  full-journey + join-queue + responsive = 7 passed, 0 failed, 0 skipped
  Total         : 194 passed, 0 failed, 0 skipped
  (หมายเหตุ: ชุดทดสอบเต็มบน Release Candidate v0.5.0-d2-rc จะรันและฝัง verbose output ใน Issue D2-I6)
  ```
* **EV-A08 (AC/TEST ID Collision Audit):** ยืนยันว่า `AC-40` / `TEST-40` เว้นว่างโดยเจตนา และช่วง `AC-41..47` / `TEST-41..47` ไม่มีเลขชนกับ Sprint 1 หรือ Labs
* **EV-A09 (Issues, PRs & TA Approval Record):** ตรวจ GitHub Issue `#52` (`IC_kwDOVeW9xc8AAAABpx5Aig`), PR `#57` และ PR `#60`: TA **นายรัตนโชติ เพ็ชรพันธ์ศรี (พี่ลูกหมู)** อนุมัติ Lab 7 Change Request (`BR-02 v2`: 1 active ticket per series พร้อมเงื่อนไข 4 ข้อ) เมื่อ `2026-11-23 15:30 ICT` ผ่านอีเมล `rattanachote.petpa@mail.kmutt.ac.th` *(หมายเหตุ: เป็นการอนุมัติเฉพาะ `BR-02 v2` ของ Lab 7 ไม่รวมขอบเขตอื่น)*
* **EV-A10 (Git Branch Topology):** `origin/main` และ `origin/sprint2-staging` อยู่ที่ `a07a7be732b30cb75a22df7f30edfdc51521a87e` (`v0.3.0-lab7`); Contract PR `#62` อยู่บน branch `docs/sprint2-master-contract`

### 2. Envelope, Counter, Clocks & Live Configuration Audit (EV-B01 ถึง EV-B09)
* **EV-B01 (Error Envelopes & Role Guards):** `server/src/middleware/auth.ts::authenticateToken/requireRole` ส่ง `{ error: { code, message, statusCode } }` (`401 UNAUTHENTICATED`, `403 FORBIDDEN_ROLE`) โดยไม่มี boolean `success`
* **EV-B02 (Git Tree Diff vs `v0.3.0-lab7`):**
  ```text
  $ git merge-base --is-ancestor v0.3.0-lab7 HEAD             -> Exit Code: 0
  $ git diff --stat v0.3.0-lab7 HEAD -- server client e2e scripts -> (empty, 0 changes)
  ```
* **EV-B03 (Daily Counter Monotonic Behavior):** `QueueCounter` composite key `("seriesId", "queueDate")` ใช้ timezone `Asia/Bangkok` เพิ่มเลขแบบ atomic ด้วย Raw SQL `ON CONFLICT DO UPDATE` ไม่ลดค่าและไม่ใช้เลขซ้ำ
* **EV-B04 (My-Ticket Payload & 404 Behavior):** `server/src/services/ticket.service.ts::getMyActiveTicket` กรองเฉพาะ `WAITING`, `CALLED`, `UNBOXING` เรียง `createdAt ASC, id ASC`; หากไม่มีตั๋ว active โยน `AppError(404, 'NO_ACTIVE_TICKET')`; หากพบคืน `{ ticket: tickets[0], tickets }`
* **EV-B05 (Call-Next FIFO SQL & `isActive` Scope Verification — `AC-46.4`):**
  ```sql
  -- server/src/services/staff.service.ts::callNext
  SELECT "id" FROM "QueueTicket"
  WHERE "seriesId" = ${seriesId} AND "status" = 'WAITING'::"TicketStatus"
  ORDER BY "queueDate" ASC, "queueNumber" ASC
  LIMIT 1
  FOR UPDATE SKIP LOCKED;
  ```
  ```text
  $ git grep -n "isActive" -- server/src
  server/src/services/series.service.ts:9:  isActive: boolean;
  server/src/services/series.service.ts:34:      isActive: series.isActive,
  server/src/services/ticket.service.ts:78:    if (!series.isActive) {
  (ExitCode: 0 — ยืนยันว่าทั้ง getStaffTickets, callNext, startUnboxing และ complete ใน staff.service.ts ไม่เช็ก isActive)
  ```
* **EV-B06 (Deployment Trigger & `GIT_SHA` Pipeline — `.github/workflows/deploy.yml`):**
  ```text
  $ Select-String -Path .github\workflows\deploy.yml -Pattern "on:|push:|tags:|branches:|workflow_dispatch"
  .github\workflows\deploy.yml:25:on:
  .github\workflows\deploy.yml:26:  push:
  .github\workflows\deploy.yml:27:    branches: [main]
  .github\workflows\deploy.yml:28:  workflow_dispatch:
  (ExitCode: 0 — Trigger เฉพาะ push เข้า main และ workflow_dispatch; ส่ง GIT_SHA ผ่าน --build-arg ใน deploy.yml:115 และ ENV ใน Dockerfile:59-60)
  ```
* **EV-B07 (Tag Containment, GitHub Actions Runs & Part A Claims):**
  ```text
  $ git tag --contains 72e1bb5
  v0.3.0-lab7
  $ gh run list --limit 30 --json databaseId,number,name,headSha,conclusion,createdAt (Key Deploy/CI Runs)
  - Deploy demo #6 (id 45357138027, success, 2026-11-24T08:33:20Z, headSha a07a7be) -> v0.3.0-lab7
  - CI & Docker Build #37 (id 45354243279, success, 2026-11-24T08:13:29Z, headSha 3fbfaeb) -> PR #60
  - Deploy demo #5 (id 44916394495, success, 2026-11-21T14:55:03Z, headSha 2aee62b) -> Lab 6 Issue #47 (Omega-3 Retest PASS)
  - Deploy demo #4 (id 43473747855, success, 2026-11-13T17:32:09Z, headSha bf52c9b) -> v0.2.0-lab5
  ```
* **EV-B08 (Client File Mapping & Actual Test Inventory):** ยืนยัน UI จริง 5 หน้า (`LoginPage.tsx`, `SeriesPage.tsx`, `MyTicketPage.tsx`, `StaffCounterPage.tsx`, `ForbiddenPage.tsx`; `BoardPage.tsx` planned สำหรับ `F-07`) และผล `git ls-files server/tests e2e client/src/tests scripts` พบ 42 ไฟล์จริง (รวม `scripts/test-persistence.mjs`, `server/tests/security/unauthenticated.test.ts`, `client/src/tests/staff.test.tsx`)
* **EV-B09 (Working Tree Audit History):**
  - รอบ `75068a6` (`sprint-2-docs`, `2026-11-24T20:14:40+07:00`): หลังรัน Playwright มี tracked screenshots ถูกเขียนทับ 18 ไฟล์ (รายงานตาม Rule 6 โดยไม่ commit ทับ)
  - รอบ PR `#62` (`docs/sprint2-master-contract`, `80863ef`, `2026-11-25T02:47:40+07:00`):
    ```text
    $ git status
    On branch docs/sprint2-master-contract
    nothing to commit, working tree clean
    ```

### 3. Preflight & Contract Specification Verification (EV-D01 ถึง EV-D06)
* **EV-D01 (Preflight Checks & Cancel Grep):** ยืนยัน branch lineage สะอาด ไม่พบ endpoint ยกเลิกคิวในโค้ดเดิมก่อนเริ่มพัฒนา
* **EV-D02 (AC Completeness & Error Code Coverage):** ตรวจสอบว่าเกณฑ์การยอมรับทั้งหมด (`83` active ACs `+ AC-40 reserved = 84` รายการใน `v1.7`) และ Error Codes ของระบบถูกผูกกับ AC และ STS ครบถ้วน
* **EV-D03 (Pre-written Output Claims Verification):** ตรวจสอบด้วย regex ไม่พบการอ้างอิงข้อความเคลมผลลัพธ์ของฟีเจอร์ `planned` ล่วงหน้า
* **EV-D04 (Response Envelope Normalization):** ตรวจสอบว่าในข้อกำหนดและตัวอย่าง payload ทั้งหมดไม่มีการใช้ boolean flag `success: true` หรือ `success: false`
* **EV-D05 (R4 Test Integrity Verification):** ตรวจสอบชุดทดสอบใน `server/tests` และ `e2e` ยืนยันว่าปราศจากการใช้ `.skip(`, `.only(`, `xit(`, `xdescribe(`, `it.todo` 100%
* **EV-D06 (Diff Stat vs `origin/sprint2-staging`):** บน branch สะอาด `docs/sprint2-master-contract` (`PR #62`) คงการแก้ไขไว้เฉพาะ `docs/sprints/sprint-2/PopQueue_Deliverable_2_Master.md` กับ `AGENTS.md` เท่านั้น (zero code/test changes)
* **EV-D01-r2 ถึง EV-D06-r2 (Append-Only Audit Suite):** ยืนยันความสอดคล้องของบัญชีทดสอบจริง (`seed.ts`), คำสั่ง monorepo, DTO schemas (`serverNow`), anchor links, DB Impact: None & DoD, response envelope ปลอด boolean flag, และ test suite ปลอด skip 100%

---

# Appendix C: Open Decisions & Formal Policy Register
> รวบรวมข้อตัดสินใจทางวิศวกรรม นโยบายธุรกิจ และประเด็นที่อยู่ระหว่างการปรึกษาหารือกับ TA อย่างเป็นทางการ

| Decision ID | ข้อตัดสินใจทางวิศวกรรม / นโยบายธุรกิจ | ข้อกำหนดและพฤติกรรมที่เลือก (Selected Policy) | เหตุผลและความจำเป็นทางวิศวกรรม | สถานะการอนุมัติ (Approval Status) |
| :---: | :--- | :--- | :--- | :---: |
| **DEC-01** | **Race Condition Loser (Cancel vs Call-Next)** | เมื่อมีตั๋ว `WAITING` ใบเดียว หาก Cancel และ Call-Next ชนกัน ฝ่ายแพ้จะได้รับ Error ที่ชัดเจน (Cancel ชนะ → Staff ได้ `404 EMPTY_QUEUE`; Call-Next ชนะ → Collector ได้ `400 INVALID_STATE_TRANSITION`) | ป้องกันตั๋วค้างสถานะคู่ และทำให้ client ทราบผลลัพธ์ที่แท้จริงได้ทันที | **Approved in Contract** |
| **DEC-02** | **Re-join Policy หลังถูกตัดสิทธิ์ No-Show** | Collector ที่ถูกตัดสิทธิ์ No-Show สามารถกดขอรับบัตรคิวในซีรีส์เดิมได้ทันที โดยได้รับเลขคิวใหม่ต่อท้ายแถว (`AC-43.6`, ไม่มีการแทรกคิวหรือ cooldown penalty ใน Sprint 2) | สอดคล้องกับพฤติกรรมหน้าร้านและ D1 `BR-08` ลูกค้าที่จ่ายเงินแล้วสามารถเริ่มต่อแถวใหม่ได้ | **Pending TA Confirmation (G1)** |
| **DEC-03** | **Start-Unboxing หลังเกิน 120 วินาที** | หากเวลาผ่านไปเกิน 120s แล้ว แต่ Staff ยังไม่ได้กดปุ่ม No-Show และลูกค้าปรากฏตัว Staff ยังคงสามารถกด Start-Unboxing เพื่อให้บริการได้ตามปกติ (`AC-43.10`, `TEST-43K`) | ให้ความยืดหยุ่นหน้างานแก่พนักงาน และระบบมี conditional `updateMany` ป้องกัน race condition | **Approved in Contract** |
| **DEC-04** | **การแสดงผลซีรีส์ที่ปิดบน Public Board** | ซีรีส์ที่ถูกปิด (`isActive: false`) จะยังคงแสดงบนจอบอร์ดสาธารณะหากยังมีตั๋วค้างรอรับบริการอยู่ (`WAITING`, `CALLED`, `UNBOXING`) พร้อมติดป้าย "ปิดรับคิวใหม่"; หากไม่มีตั๋วค้างเลยจะซ่อนจากบอร์ด (`AC-44.5`, `AC-44.8`) | ป้องกันความสับสนของลูกค้าที่ถือตั๋วค้างอยู่หน้าร้าน | **Approved in Contract** |
| **DEC-05** | **ขอบเขตสถานะ Now Serving บนจอบอร์ด** | คอลัมน์ Now Serving บนจอบอร์ดสาธารณะ (`/board`) จะรวมทั้งตั๋วสถานะ `CALLED` และ `UNBOXING` เรียงตาม `calledAt ASC` (`AC-44.8`) | ลดความแออัดหน้าเคาน์เตอร์และแจ้งเตือนลูกค้าล่วงหน้า | **Approved in Contract** |
| **DEC-06** | **Sprint 3 Working Progress Reorder (`F-08 → F-09`)** | ทั้ง `F-08` และ `F-09` อยู่ใน Sprint 3 ตั้งแต่ D1 แต่ทีมสลับมาพัฒนา **`F-09` (Series Availability Control)** เป็น Sprint 3 Working Progress ใน Deliverable 2 แทน `F-08 initial version` (และทำ `F-08` ต่อใน Post-D2) | `F-08` ต้องอิงข้อมูลจาก `F-06` ที่เพิ่งทำใน Sprint 2 ขณะที่ `F-09` พัฒนาขนานได้เร็วกว่าและทดสอบข้ามฟีเจอร์กับ `F-02`/`F-07` ได้ครบวงจร โดยไม่ได้ลดทอนขอบเขต Sprint 2 | **Approved by Team (Recorded in D2)** |
