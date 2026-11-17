# PopQueue — Lab 6 Master Plan (Independent UAT & Defect Management)

> **File Location:** `docs/labs/lab6/plan/LAB6_MASTER_PLAN.md` *(Revision 6 — Reactive §3.5 TA Trigger Post-UAT, Isolated `lab6-docs`, `main` Freeze & Verified Traceability)*  
> **Course:** CPE 334 Software Engineering (Section 1, Semester 1/2026, KMUTT)  
> **Assignment:** Lab 6 — Independent User Acceptance Testing and Defect Management (**100 points | 5% of course grade**)  
> **Deadline:** **Sunday, 22 November 2026 at 23:59** (via LEB2, single self-contained PDF)  
> **Project / Theme:** **PopQueue** — Theme 9: Queue and Service Management System (*Art Toy Live Unboxing Station*)

---

## 0. Mandatory Governance Rule: Git & GitHub Command Authorization Policy

> [!CAUTION]
> **STRICT RULE — MUST OBTAIN USER APPROVAL BEFORE ANY GITHUB / GIT-MUTATING COMMAND:**  
> ห้าม AI Agent หรือระบบอัตโนมัติรันคำสั่งเกี่ยวกับ **GitHub CLI (`gh`)** หรือ **คำสั่ง Git ที่แก้ไข/สร้าง/ส่งข้อมูลขึ้น Remote** ด้วยตัวเองโดยเด็ดขาด **ต้องถามรายละเอียดและได้รับการอนุญาตอย่างชัดแจ้งจากเจ้าของงาน (User) ก่อนทุกครั้ง**

### 0.1 คำสั่งที่ "ห้ามรันเอง" (ต้องแจ้งและขออนุญาตทุกครั้งก่อนรัน)
1. **GitHub CLI (`gh`) ทุกคำสั่งที่สร้าง/แก้ไข/เปลี่ยนสถานะบน GitHub (รวมถึงคำสั่ง `gh` ที่เกี่ยวข้องกับ Repo คู่ค้า/การส่งงาน):**
   * `gh issue create`, `gh issue edit`, `gh issue close`, `gh issue comment`
   * `gh pr create`, `gh pr merge`, `gh pr review`, `gh pr close`, `gh pr edit`
   * `gh workflow run`, `gh release create`, `gh label create`
2. **Git Commands ที่เปลี่ยนสถานะ Branch / History / Remote:**
   * `git checkout -b`, `git switch -c`, `git branch -D`
   * `git add`, `git commit`, `git merge`, `git cherry-pick`, `git revert`
   * `git push` *(และห้ามใช้ `git push --force` โดยเด็ดขาด)*
   * `git tag` และ `git push origin <tag>`
   * การแก้/ลบไฟล์ที่ถูก Git track อยู่บน `main` (เช่น `docs/labs/lab-05/`)
3. **Cloud / Database Commands ที่กระทบ Production Demo บน GCP:**
   * `gcloud run ...`, `gcloud sql ...`, `deploy/release.sh`, `deploy/teardown.sh`, การ seed หรือ reset ข้อมูลบน Cloud SQL

### 0.2 รูปแบบการขออนุญาตก่อนรันคำสั่งทุกครั้ง
ก่อนรันคำสั่งในหมวด 0.1 ทุกครั้ง Agent ต้องแสดงให้ User ตรวจสอบก่อน 4 ข้อนี้:
1. **วัตถุประสงค์ & Phase ของงาน**
2. **คำสั่งจริงที่จะรันแบบเต็มบรรทัด** (Exact command)
3. **ผลกระทบ & Branch/Target ปลายทาง**
4. รอคำยืนยัน (`อนุญาต` / `โอเค` / `รันได้เลย`) **ก่อน** ลงมือรันจริงทุกครั้ง

---

## 1. Team Metadata, Baseline, Branch Isolation & Partner Exchange

### 1.1 Team `BFteam` (Product Team for PopQueue & UAT Team for Partner)
| Member | Student ID | GitHub Handle | Primary Coordination |
| :--- | :---: | :---: | :--- |
| นายธีรวัฒญ์ รุ่งสว่าง | `67070507206` | `@Theerawat82` | Product Team Lead (Handoff, Pre-UAT Drain, Triage) + UAT Co-Tester & Reviewer |
| นายอภิวัชร์ ปัณฐธนาพัฒน์ | `67070507209` | `@apfirst13` | UAT Team Lead (Partner Execution, Outgoing Defects) + Fix & CD Co-Author/Reviewer |

*(ข้อกำหนด Lab 6 §1 & §3.2: สมาชิกทั้ง 2 คนต้องมีส่วนร่วมทั้งฝั่ง Product Team และ UAT Team, ทดสอบระบบคู่ค้าจริงทั้งคู่ และทำ Cross-Review PR โดยห้าม Approve งานตัวเอง)*

### 1.2 Assessed Sprint 1 Product Baseline, `main` Freeze & `lab6-docs` Isolation Policy
| Item | Baseline Value | Verification / Action Required |
| :--- | :--- | :--- |
| **Canonical GitHub Repo** | `https://github.com/apfirst13/PopQueue_BFteam` *(Public; local `origin` `qdrive-license-queue.git` redirects here)* | ยืนยันผ่าน GitHub API แล้ว (`full_name: apfirst13/PopQueue_BFteam`, `private: false`) |
| **Sprint 1 Accepted Tag** | `v0.1.0-sprint1` (`d946159`) | Core Sprint 1 features (`F-01`–`F-04`, `AC-01`–`AC-39`) |
| **Lab 5 Deployed Baseline Tag** | `v0.2.0-lab5` (`bf52c9b`, PR `#43`; App release PR `#39` commit `e010e19`) | **Action (Phase 0):** ยิง `GET /api/health` + เช็ก UI Footer Badge (`PopQueue v0.2.0-lab5 • Commit: ...`) เพื่อยืนยัน Live Revision SHA จริงก่อนส่งมอบ |
| **Live Primary URL (GCP)** | `https://popqueue-5now4hkvsa-as.a.run.app` | Regional: `https://popqueue-902539659249.asia-southeast1.run.app` |
| **Canonical Spec Reference** | `docs/sprints/sprint-1/PopQueue_Deliverable_1_Master.md` | ใช้ตัดสิน Scope (`F-01`–`F-04`) vs Future Sprint 2/3 (`F-05`–`F-09`, `S3-HARDEN`) |
| **Zero-Noise Context Doc** | `LAB6/PopQueue_Lab6_Context.md` *(อยู่นอก repo)* | ใช้สรุปข้อเท็จจริงของระบบและแนวทางแก้จุดอ่อนเพื่อทีมและ AI |

#### 🚨 กฎเหล็ก Git Branch Isolation (`lab6-docs` vs `lab5-staging` vs `main` Freeze)
1. **แยก Branch เอกสารออกจาก Code Release (`lab6-docs`):**
   * `.github/workflows/deploy.yml` จะทำงานอัตโนมัติ **ทุกครั้งที่มีการ Push/Merge เข้า `main`** ซึ่งจะเปลี่ยน Commit SHA บน Cloud Run (`GET /api/health` และ UI Footer) ทันที
   * ถ้าเก็บเอกสาร Lab 6 บน `lab5-staging` เวลาเปิด Release PR `lab5-staging → main` เพื่อแก้โค้ด เอกสารจะถูกพ่วงเข้า `main` (หรือหาก merge เอกสารวันอาทิตย์ SHA บน Cloud Run ก็จะขยับหนี SHA ที่ทีมคู่ลงนามรับรองไว้ในขณะเปิดระบบให้ตรวจ!)
   * **วิธีแก้ที่สะอาดที่สุด:**
     * **`lab6-docs`** *(แตกจาก `main`)*: ใช้เก็บเอกสาร, แผน, Handoff, Triage Logs และ Evidence ทั้งหมดของ Lab 6 (`docs/labs/lab6/`) — **ไม่ Merge เข้า `lab5-staging` และไม่ Merge เข้า `main` จนกว่าจะพ้นช่วง Grading** (ไฟล์ PDF ที่ส่งบน LEB2 คือ Grading Surface หลักตาม Lab 6 §4 และลิงก์สาขา `lab6-docs` ไว้ใน PDF ได้เลย)
     * **`lab5-staging`** *(Code & Test Staging)*: มี **เฉพาะโค้ดและ Automated Test ที่แก้ Defect** เท่านั้น (ใช้ CI `test-and-docker` + Ruleset `protect-staging` ที่อนุญาต `merge`/`squash`/`rebase`; ควรเปิด PR Sync `main → lab5-staging` ด้วยวิธี **"Create a merge commit"** ก่อนเปิด `fix/*` PR แรก เพื่อรวมประวัติ PR `#39`/`#43` ให้ฝั่งซ้ายของ `main...lab5-staging` เป็น `0` → ผลจะเป็น `0  1` และบันทึกลงตาราง Version Lineage) *(ขออนุญาต User ก่อน)*
     * **`main` (`MAIN BRANCH FREEZE`)**: ห้าม Merge PR ใดๆ ตลอดช่วง UAT ยกเว้น Release PR แก้ Defect ที่แจ้ง Partner ล่วงหน้าแล้ว — เพื่อให้ SHA บน Cloud Run ตรงกับ SHA ในคำตัดสิน `Accepted` 100% ตลอดช่วง Grading

### 1.3 Partner Team Information *(เส้นตายจับคู่: พุธ 18 พ.ย. 12:00 น.)*
> [!WARNING]
> **Public Repo Privacy Guard:** เนื่องจาก `apfirst13/PopQueue_BFteam` เป็น Public Repo **ห้าม commit ชื่อจริง/รหัสนักศึกษาของ Partner Team หรือรายละเอียด/ลิงก์ช่องทางส่งรหัสผ่านส่วนตัวลงใน branch `lab6-docs`** ให้คง `[TBD / Redacted in Git]` ไว้บน Git แล้วนำไปกรอกเฉพาะในฉบับ Final PDF (`lab6_sec1_BFteam.pdf` บน LEB2 — เพิ่ม `*.pdf` หรือไม่ commit PII เพื่อนขึ้น Git)

| Field | Value (TBD at Pairing) |
| :--- | :--- |
| **Partner Team Name & Members / IDs** | `[TBD — บันทึกชื่อทีม, ชื่อจริง-นามสกุล, รหัสนักศึกษา, GitHub handles ทั้ง 2 คน]` |
| **Partner Project / Theme** | `[TBD]` |
| **Partner Repo URL** | `[TBD]` |
| **Partner Assessed Release Tag / Commit / URL** | `[TBD — บันทึก Tag, Commit SHA และ Live URL ที่ใช้ทดสอบจริง]` |
| **Agreed UAT / Retest Windows & Private Channel** | `[TBD — กำหนดเวลารอบ Execute (พฤ.), Fix (ศ.), Retest (ส.) รวมทั้งจองเวลา Retest วันเสาร์ไว้ล่วงหน้าแม้ไม่พบบั๊กจริง]` |

---

## 2. Lab 6 Rubric & Dual-Role Architecture (100 Points)

| Part | Pts | Role | Objective & Passing Criteria | Output Doc & Evidence in Final PDF |
| :---: | :---: | :--- | :--- | :--- |
| **A** | **20** | **Product Team** (`BFteam`) | Handoff Header Checklist ครบ (รวม Known Refresh Behavior & `NFR-03..05`), Executable UAT Cases ≥4 หมวด, API instructions แบบไม่ต้องอธิบายด้วยวาจา, Sequential Order ชัดเจน, Safe Handoff + Pre-UAT Queue Drain | `handoff/POPQUEUE_UAT_HANDOFF.md` (`UAT-01..09`) + `AC` Traceability Split |
| **B** | **25** | **UAT Team** (`BFteam` ตรวจคู่ค้า) | Audit Handoff คู่ค้าก่อนรัน; สมาชิกทั้ง 2 คนรันเคสทั้งหมดบน Deployed URL จริง บันทึก Actual Result จริง (`PASS`/`FAIL`/`BLOCKED`) + Masked Screenshots มี Evidence ID และ URL Bar | `execution/PARTNER_UAT_RESULTS.md` + Annotated Screenshots (`b-*.png`) |
| **C** | **20** | **Dual (`Outgoing` + `Incoming`)** | (1) Outgoing Defect Reports ใช้ **Full 12-Field Template** (แยก Defect vs Feature Request + Partner Disposition) (2) Incoming Triage Table ผูก Sprint 1 Contract ครบทุกข้อ *(รวมถึงข้อที่มาหลัง Freeze)* | `execution/DEFECT_TRIAGE_LOG.md` |
| **D** | **35** | **Product Team + Independent Retest** | แก้ Critical/Major Defects ผ่าน TDD `RED` commit (CI Red) → `GREEN` commit (CI Green) + Peer PR + Redeploy + Bidirectional Retest + **Explicit 3-Category Sign-Off Table** *(หรือทำ §3.5 Controlled Defect Exercise หลัง TA อนุมัติ/กำหนด)* | `execution/RETEST_ACCEPTANCE_RECORD.md` + Red/Green Logs (`d-red-*.txt`, `d-green-*.txt`) + Lineage Table |

---

## 3. Master Timeline & Buffered Schedule (17–22 Nov 2026)

| Date | Phase | Critical Actions, Reviews & Deadlines | Exit Gates |
| :--- | :---: | :--- | :--- |
| **Tue 17 Nov** *(ค่ำนี้)* | **Phase 0: Baseline, Branches & Partner Setup** | 1. เช็ก `GET /api/health`, `/api/ready`, UI Footer SHA (`bf52c9b`), Cloud SQL `ALWAYS`, และ Canonical Repo URL (`PopQueue_BFteam`)<br>2. *(ขออนุญาต User ก่อน)* สร้าง branch **`lab6-docs`** จาก `origin/main` สำหรับเก็บเอกสาร Lab 6 + *(ถ้าสะดวกทำคืนนี้)* PR Sync `main → lab5-staging` แบบ Merge Commit + เปิด **`MAIN BRANCH FREEZE`**<br>3. ติดต่อ Partner Team + **นัดจองเวลา Retest วันเสาร์ไว้ล่วงหน้า** *(ยังไม่ทัก TA เรื่อง §3.5 — รอดูผลเทสต์ UAT รอบแรกก่อนว่าพบ Defect จริงหรือไม่)* | Baseline SHA verified; `lab6-docs` active; `main` frozen; Partner contacted |
| **Wed 18 Nov** | **Phase 1: Pairing Gate, Part A Handoff & PDF Skeleton** | 1. **12:00 Pairing Hard Deadline:** หากยังไม่จับคู่หรือคู่ค้าไม่พร้อม / เว็บคู่ค้าเข้าไม่ได้ → แจ้ง Instructor/TA ทันทีพร้อมหลักฐาน (Lab 6 §2)<br>2. เขียน `handoff/POPQUEUE_UAT_HANDOFF.md` บน `lab6-docs` (ครบ Handoff Checklist §4.1 + `UAT-01..09` + Runbooks) + ทำ Internal Rehearsal *(ถ้าทำต้อง Drain คิวเป็น `0` และระบุใน PDF ว่าเป็น Rehearsal)*<br>3. รับ & **Audit Handoff ของ Partner ทันที** (ครบ 4 หมวด, Expected ชัด, Account/Setup พร้อม) ถ้าขาดให้ขอคู่ค้าแก้ก่อนเริ่มรัน<br>4. **เริ่มสร้าง `lab6_sec1_BFteam.html` + ทดสอบแปลง PDF** (ToC, เลขหน้า, Anchors) | Partner Handoff audited; PopQueue Queue drained (`waitingCount=0`, `activeServing=null`); `lab6_sec1_BFteam.html` skeleton built |
| **Thu 19 Nov** | **Phase 2: Part B Execution & Findings Freeze (`22:00`)** | 1. `@Theerawat82` & `@apfirst13` รันทุกเคสของ Partner บันทึก Actual Results & Masked Screenshots (`b-*.png`)<br>2. ส่ง Outgoing Defect Reports (12 Fields) ให้ Partner พร้อมติดตาม Partner Disposition<br>3. **Findings Freeze for Friday Cycle: `22:00 น.`** *(Findings ที่มาหลัง `22:00` ยังต้องลง Disposition ครบทุกข้อใน `DEFECT_TRIAGE_LOG.md` ตาม §3.3)*<br>4. **§3.5 Decision Trigger (`22:00`):** หากพ้น Findings Freeze แล้ว **ไม่พบ Natural Defect ใน `PopQueue` เลย** → ทักถาม TA ทันทีในคืนพฤหัส / เช้าศุกร์ไม่เกิน `09:00` *(ถ้าเจอบั๊กจริง ไม่ต้องทัก TA!)* | `PARTNER_UAT_RESULTS.md` complete; Outgoing Reports filed; Findings Freeze @ `22:00`; Bug status clear |
| **Fri 20 Nov** | **Phase 3: Part C Triage, RED/GREEN Fix OR §3.5 Exercise** | 1. Reproduce & Triage ทุก Finding ลง `DEFECT_TRIAGE_LOG.md`<br>2. **ถ้ามี Defect จริง:** แจ้ง Partner ล่วงหน้าก่อน Deploy → `fix/<issue#>-<slug>` จาก `lab5-staging` → Push **RED commit** (เก็บ CI Red + SHA) → Push **GREEN commit** + Regression (เก็บ CI Green + SHA) → Peer PR → Release PR `main` (โค้ด+Test เท่านั้น ไม่มี `docs/labs/lab6/`) → **Redeploy Cut-off: `18:00 น.`** *(ขออนุญาต User ก่อนทุกคำสั่ง)*<br>3. **ถ้าไม่มี Defect จริง (§3.5):** ส่งคำขอถึง TA ไม่เกิน **`09:00 น.`** (ถาม: ใครกำหนด Defect + นิยาม "deployed" บน Branch แยก), Follow-up ช่วง **`15:00 น.`** หากเงียบ; ถ้าได้โจทย์ → ทำ Exercise บน Branch แยก; ถ้ายังไม่ได้คำตอบก่อน **`18:00 น.`** → บันทึก *Unresolved Assessment Dependency* พร้อมหลักฐานการทักทั้งหมด | Fixes (with partner notice & RED/GREEN SHAs) OR §3.5 Exercise / Dependency Notice done @ `18:00` |
| **Sat 21 Nov** | **Phase 4: Buffered Retest & Bidirectional Acceptance** | 1. **เช้า (Buffer #1):** Partner รัน Independent Retest (`PopQueue` Fixes / §3.5 Exercise) + `BFteam` รัน Retest ของ Partner<br>2. **บ่าย–ค่ำ (Contingency Buffer #2):** เผื่อเวลา Patch/Retest รอบที่ 2 หาก Retest #1 ยังไม่ผ่าน!<br>3. ลงนาม **Bidirectional Acceptance Decisions** + **3-Category Sign-Off** ใน `RETEST_ACCEPTANCE_RECORD.md` | Both Acceptance Decisions signed; Exact accepted SHA matches Cloud Run live SHA |
| **Sun 22 Nov** *(ก่อน 23:59)* | **Phase 5: Final PDF Build, Hygiene Audit & LEB2** | 1. Compile `lab6_sec1_BFteam.html` → `lab6_sec1_BFteam.pdf` บน `lab6-docs` (Lineage Table, Contribution Table, **Honest AI-Use Declaration**, Known Limitations)<br>2. สแกน Zero-Secret & เช็ก Checklist §7.2<br>3. อัปโหลดส่ง **LEB2 ก่อน `23:59`** *(**ไม่ Merge `lab6-docs` เข้า `main`** เพื่อคง Live Cloud Run SHA ให้ตรงกับ SHA ที่ทีมคู่รับรองตลอดช่วง Grading; แนบลิงก์ branch `lab6-docs` ใน PDF)* | `lab6_sec1_BFteam.pdf` submitted on LEB2; Live SHA unchanged through grading |

---

## 4. Phase 1 Detailed Design: Part A — PopQueue Handoff Checklist, UAT Cases & Traceability

### 4.1 Mandatory Handoff Header Checklist & Operational Rules (`POPQUEUE_UAT_HANDOFF.md`)

#### 1. Handoff Header & Accepted-for-Test Scope Checklist *(อยู่หน้าแรกของ `POPQUEUE_UAT_HANDOFF.md` ตาม Lab 6 §3.1)*
* **Identity & Target Release:**
  * Sprint 1 Tag: `v0.1.0-sprint1` (`d946159`) | Deployed Lab 5 Tag: `v0.2.0-lab5` (`bf52c9b` / release PR `#39` `e010e19`)
  * Verified Live SHA (`GET /api/health` + UI Footer Badge): `[ยืนยันตอน Handoff]` | Live Base URL: `https://popqueue-5now4hkvsa-as.a.run.app`
* **Accepted-for-Test Sprint 1 Scope (`F-01`–`F-04`):**
  * `F-01` Auth & Role Identity (`FR-01`, `FR-02`, `BR-04`, `NFR-01`, `NFR-02`)
  * `F-02` Queue Discovery & Safe Joining (`FR-03`, `FR-04`, `BR-01`, `BR-02`, `BR-09`, `NFR-06`)
  * `F-03` Box Master Service Counter (`FR-07`–`FR-10`, `BR-03`–`BR-07`)
  * `F-04` Ticket Inspection & Ownership (`FR-05`, `FR-06`, `BR-04`)
  * **Automated-Only Sprint 1 Guarantees (`NFR-03`–`NFR-05`):** สัญญา Concurrency (`50` join พร้อมกัน / `10` duplicate race) และการคงอยู่หลัง DB Container Restart (`NFR-05`) ตรวจโดย **Automated Tests & `scripts/test-persistence.mjs` เท่านั้น** *(ดูรายละเอียด §4.3 — ไม่ต้องรันซ้ำใน Manual UAT)*
* **Explicit Non-Sprint-1 Exclusions & Disclosed Countdown Behavior *(เปิดเผยโปร่งใสตั้งแต่ต้น)*:**
  * **Deferred Sprint 2/3 Features:** Queue Cancellation (`F-05`/`FR-11`), Server-Enforced 120s No-Show (`F-06`/`FR-12`/`BR-08`), Public Display Board (`F-07`/`FR-13`), Daily Analytics (`F-08`/`FR-14`), Series Toggle UI (`F-09`/`FR-15`), Login Rate Limiting (`S3-HARDEN`/`NFR-07`)
  * **Permanent Out-of-Scope:** Advance Booking, Payment Gateway, Shipping/Delivery, Self-Registration/Password Reset, SMS/LINE Push
  * **Disclosed Countdown Behavior (`MyTicketPage.tsx` & `PopQueue_Deliverable_1_Master.md` lines 61, 951, 1229):** ตัวนับถอยหลัง `120s` บน `/my-ticket` มีไว้ *"แสดงผลเท่านั้น ยังไม่มีผลต่อสถานะ (Server-enforced ใน Sprint 2)"* **และในโค้ดปัจจุบัน ตัวนับจะเริ่มที่ `02:00` ใหม่เมื่อโหลดหรือรีเฟรชหน้าเว็บ (ยังไม่ได้คำนวณเวลาที่เหลือจาก `calledAt`)**
* **Account Labels, Roles & Series Matrix *(ห้ามใส่รหัสผ่านจริงลงเอกสาร!)*:**
  * `collector1` … `collector6` (`COLLECTOR`, no series)
  * `staff_crybaby` (`BOX_MASTER`, `CRY`), `staff_crybaby2` (`BOX_MASTER`, `CRY`), `staff_labubu` (`BOX_MASTER`, `LAB`)
  * **Private Credential Channel:** `[ระบุชื่อช่องทางส่วนตัวที่ใช้ส่งรหัสผ่าน เช่น DM Discord/LINE ของทีมคู่]`
* **Declared Execution Mode:** **Sequential (`UAT-01 → UAT-02 → ... → UAT-09`)** พร้อม Pre-UAT Drain & Recovery Runbook

#### 2. Pre-UAT Queue Drain, Non-Deterministic Numbers & Recovery Runbook
* **Pre-UAT Drain Step (Product Team ทำก่อน Handoff):** พนักงาน `staff_crybaby` และ `staff_labubu` ไล่ Call Next → Verify & Start → Complete จน `GET /api/series` แสดง `waitingCount: 0` ทั้ง `CRY`/`LAB` และ `GET /api/staff/tickets` แสดง `activeServing: null` + `waitingQueue: []` ทุกบัญชีพนักงาน (แคปภาพ `a-preuat-clean.png`)
* **Dynamic Ticket Numbering:** ใช้ **`CRY-N`** และ **`CRY-(N+1)`** ห้ามสมมติว่าเริ่มที่ `CRY-001` และห้ามมีผู้ทดสอบอื่น join แทรกกลางเคส
* **Recovery Runbook:**
  * *Staff ค้าง `409 STAFF_BUSY`:* ล็อกอินด้วยบัญชีพนักงานคนนั้นที่ `/staff/counter` → กด `"Verify & Start Unboxing"` (ถ้าเป็น `CALLED`) → กด `"เสร็จสิ้น (Complete)"`
  * *Collector ค้าง `409 DUPLICATE_ACTIVE_QUEUE`:* ตรวจซีรีส์ที่ค้างผ่าน `/my-ticket` แล้วให้ Box Master ของซีรีส์นั้น Call Next ไล่ FIFO จนจบใบนั้น

#### 3. Multi-Session `localStorage` Isolation & `logout` Rule (`D-11`)
* JWT (`popqueue_token`) และ User (`popqueue_user`) เก็บใน `localStorage` (`AuthContext.tsx`) และการ `logout` จะเพิ่ม `tokenVersion` ทำให้ Token เก่าทุก Session ของ User นั้นถูกเพิกถอนทันที
* **⚠️ ห้ามเปิด Incognito/Private Window สองหน้าต่างจาก Browser Profile เดียวกันสำหรับ 2 บัญชีพร้อมกัน:** เพราะ Incognito หลายบานในเบราว์เซอร์เดียวกัน **แชร์ `localStorage` ของ Incognito container เดียวกัน** จะทับ Token กัน!
* **วิธีแยก Session ที่ถูกต้อง:**
  * *2 บัญชี UI พร้อมกัน (`UAT-02`, `UAT-09`):* **Browser Profile 1 (ปกติ)** + **1 Incognito Window**
  * *3 บัญชี UI พร้อมกัน (`UAT-03`):* **Browser Profile 1** + **Browser Profile 2 (หรือเบราว์เซอร์ตัวที่สอง เช่น Edge/Firefox)** + **1 Incognito Window** *(ห้ามใช้ `curl` แทน `collector2` ใน `UAT-03` เพราะต้องตรวจ UI auto-polling!)*
* **ห้าม** ใช้บัญชีเดียวกันพร้อมกันระหว่างผู้ทดสอบ 2 คน

#### 4. Polling Tolerance, Cold Start & Self-Contained API Discovery Guide
* **Polling:** รีเฟรชทุก `3s` (`usePolling.ts`) — เกณฑ์ผ่านคืออัปเดตอัตโนมัติบน UI ภายใน **`3–10s`**; Cloud Run (`min-instances=0`) อาจมี Cold Start ช้าใน Request แรกหลัง Idle
* **Self-Contained API Steps (ใส่ `curl` Template แบบ Mask Token `<JWT>`, `<PASSWORD>` ใน `POPQUEUE_UAT_HANDOFF.md`):**
  * **Series UUIDs:** `GET <BASE_URL>/api/series` → เก็บ `data[].id` ของ `"CRY"`, `"LAB"`, `"SKP"`
  * **JWT Token:** `POST <BASE_URL>/api/auth/login` (`data.token`) หรือ DevTools `localStorage.getItem('popqueue_token')`
  * **Ticket UUID:** `data.ticketId` (`POST /api/tickets/join`) หรือ `data.ticket.id` (`GET /api/tickets/my-ticket`)

---

### 4.2 Declared Sequential Execution Schedule (`UAT-01 → UAT-02 → UAT-03 → UAT-04 → UAT-05 → UAT-06 → UAT-07 → UAT-08 → UAT-09`)

| Order | Case ID | Category | Verified ACs (Exact Scope) | Accounts & Windows | Start State → Key Actions → Post-Case Clean State |
| :---: | :---: | :--- | :--- | :--- | :--- |
| **1** | **UAT-01** | Discovery & Identity Profile | `AC-06`, `AC-09` *(FR-02, FR-03)* | Public + `collector1`, `staff_crybaby`, `staff_labubu` *(ทีละคน, ไม่ Logout)* | **Start:** `CRY`/`LAB` `waitingCount=0`. เปิด `/series` & `GET /api/series`: เห็น 3 ซีรีส์ (`CRY`/`LAB` เปิด; `SKP` `"ปิดรับคิว"` disabled), `waitingCount=0` ไม่มี PII; ยิง `GET /api/auth/me`: `collector1` → `[]`, `staff_crybaby` → `[CRY]`, `staff_labubu` → `[LAB]`. **End:** คิวว่าง 0 |
| **2** | **UAT-02** | **1. Normal Domain Journey** | `AC-01`, `AC-10`, `AC-22`, `AC-26`, `AC-27`, `AC-33`, `AC-34` *(FR-01, FR-04, FR-05, FR-08..10)* | Browser 1: `collector1`<br>1 Incognito: `staff_crybaby` | **Start:** คิวว่าง 0, `staff_crybaby` ว่าง. `collector1` Join `CRY` → `CRY-N` (`WAITING`, `waitingAhead=0`) → `staff_crybaby` Call Next → หน้า `collector1` **เปลี่ยนเป็น `CALLED` เองใน 3–10s** (ข้อความ `"ถึงคิวแล้ว..."` + นับถอยหลัง `120s`) → `Verify & Start Unboxing` (`UNBOXING`) → `เสร็จสิ้น (Complete)`. **End:** คิวว่าง 0, `staff_crybaby` ว่าง |
| **3** | **UAT-03** | **1+2. Multi-User FIFO & UI `waitingAhead`** | `AC-10`, `AC-18`, `AC-22`, `AC-27`, `AC-34` *(BR-01, FR-05, FR-08, FR-10)* | **Profile 1:** `collector1`<br>**Profile 2 (2nd Browser):** `collector2`<br>**1 Incognito:** `staff_crybaby` *(ต้องเปิด UI ทั้ง 3 บัญชี)* | **Start:** คิวว่าง 0 (ห้ามแทรก). `collector1` Join `CRY` (`CRY-N`); `collector2` Join `CRY` (`CRY-(N+1)`, `"เหลืออีก 1 คิวก่อนหน้า"`). `staff_crybaby` เห็นคิวเรียง FIFO → Call Next → เรียก **`CRY-N`**, **หน้าจอ UI ของ `collector2` อัปเดตเองใน 3–10s เป็น `"เหลืออีก 0 คิวก่อนหน้า"`** → Complete `CRY-N` → Call Next อีกครั้ง → เรียก **`CRY-(N+1)`** → Complete. **End:** คิวว่าง 0, พนักงานว่าง |
| **4** | **UAT-04** | **2. Closed Series (`SKP`), Duplicate (`BR-02`) & Counter Non-Leak** | `AC-11` *(incl. non-leak)*, `AC-12`, `AC-19` *(FR-04, BR-09)* | `collector2`, `collector3` *(counter check)* + `staff_crybaby` | **Start:** คิวว่าง 0, **`collector2` ยังไม่มีตั๋ว Active**.<br>1. **Closed Series FIRST (`AC-12`):** ดู `SKP` UI (`"ปิดรับคิว"` disabled) และยิง `POST /api/tickets/join` `{SKP seriesId}` ด้วย JWT `collector2` → **`409 SERIES_CLOSED`** *(ไม่กำกวมกับ Duplicate!)*<br>2. **Duplicate (`AC-11`, `AC-19`):** `collector2` Join `CRY` (`CRY-N`) → พยายาม Join `CRY` ซ้ำ (UI+API) และ Join `LAB` → **`409 DUPLICATE_ACTIVE_QUEUE` ทั้งคู่**<br>3. `staff_crybaby` Call Next → Start → Complete `CRY-N`<br>4. **Zero Counter Leak (`AC-11`):** `collector3` Join `CRY` ทันที → ได้ **`CRY-(N+1)` พอดี (ไม่มีช่องว่าง)** → `staff_crybaby` Complete `CRY-(N+1)`. **End:** คิวว่าง 0 |
| **5** | **UAT-05** | **2. Staff Business Rules & State Guard (`BR-03`, `BR-06`)** | `AC-23`, `AC-24`, `AC-28` *(partial state jumps)* | `collector2`, `staff_labubu`, `staff_crybaby` | **Start:** `LAB` & `CRY` ว่างทั้งคู่. (1) `staff_labubu` Call Next `{LAB}` → **`404 EMPTY_QUEUE`**. (2) `collector2` Join `CRY` (`{id}`) → `staff_crybaby` Call Next (`CALLED`) → ปุ่ม Call Next disabled + API `call-next` ซ้ำ → **`409 STAFF_BUSY`**; ยิง `complete` จาก `CALLED` → **`400 INVALID_STATE_TRANSITION`**. (3) `staff_crybaby` Verify & Start → Complete → ยิง `start-unboxing` บนตั๋ว `COMPLETED` → **`400 INVALID_STATE_TRANSITION`**. **End:** คิวว่าง 0 |
| **6** | **UAT-06** | **3. Auth Errors, Full Role Matrix & Logout Revocation** | `AC-02`, `AC-05`, `AC-14` *(401+403)*, `AC-31` *(4 routes)*, `AC-35` *(staff 403)* | `collector3` *(dedicated logout)* + `staff_crybaby` | **Start:** คิวว่าง 0 (ไม่สร้างตั๋ว). (1) **`AC-02`:** `login` ด้วย `collector3`+รหัสผิด vs `nobody_uat_999` → **`401 INVALID_CREDENTIALS`** ข้อความ/โครงสร้างเหมือนกัน. (2) **`AC-14` Unauth Join:** `POST /api/tickets/join` `{CRY}` **ไม่ส่ง Token** → **`401 UNAUTHENTICATED`** (`waitingCount=0`). (3) **`AC-31` All 4 Routes:** Token `collector3` เปิด `/staff/counter` (`/forbidden`) + ยิงทั้ง 4 API routes (`GET /staff/tickets`, `POST /call-next`, `.../start-unboxing`, `.../complete`) → **`403 FORBIDDEN_ROLE` ทั้งหมด**. (4) **`AC-14`/`35` Staff:** `staff_crybaby` เปิด `/series` (`/forbidden`) + `POST /tickets/join` & `GET /tickets/my-ticket` → **`403 FORBIDDEN_ROLE`**. (5) **`AC-05` Logout:** เก็บ JWT `collector3` → Logout → ยิง `GET /auth/me` ด้วย JWT เดิม → **`401 UNAUTHENTICATED`**. **End:** คิวว่าง 0 |
| **7** | **UAT-07** | **3. Ownership, Series Scope, Handler & ID Boundary** | `AC-21`, `AC-25`, `AC-29`, `AC-30`, `AC-37`, `AC-38` *(all 4 cases)* | **`collector3` (Re-login ใหม่!)**, `collector4`, `staff_crybaby`, `staff_crybaby2`, `staff_labubu` | **Start:** คิวว่าง 0; **`collector3` ล็อกอินใหม่** แล้ว Join `CRY` (`{id}`). (1) **`AC-21`:** `staff_crybaby` เห็น `{id}`, `staff_labubu` ไม่เห็น `CRY`. (2) **`AC-37` / `AC-38`:** `collector4` `GET /tickets/{id}` → **`403 FORBIDDEN_OWNERSHIP`** (ไม่รั่วข้อมูล); `staff_crybaby` → **`200`** (มี `userFullName`); `staff_labubu` → **`403 FORBIDDEN_SERIES`**; **`staff_crybaby`** ยิง `GET /tickets/00000000-0000-0000-0000-000000000000` → **`404 RESOURCE_NOT_FOUND`**; **`staff_crybaby`** ยิง `GET /tickets/not-a-uuid` → **`400 VALIDATION_ERROR`**. (3) **`AC-25`/`29`:** `staff_labubu` ยิง `call-next`/`start`/`complete` บน `CRY` → **`403 FORBIDDEN_SERIES`**. (4) **`AC-30`:** `staff_crybaby` Call Next `{id}` → `staff_crybaby2` ยิง `start-unboxing` & `complete` → **`403 FORBIDDEN_NOT_HANDLER`**. (5) Cleanup `staff_crybaby` Complete `{id}`. **End:** คิวว่าง 0 |
| **8** | **UAT-08** | **4. Cross-Session Persistence, History & Non-Reuse** | `AC-18`, `AC-34`, `AC-35` *(no-ticket 404)*, `AC-36` *(BR-01, FR-05, FR-06)* | `collector5`, `collector6`, `staff_crybaby` | **Start:** คิวว่าง 0 (ห้ามแทรก). (1) `collector5` Join `CRY` (`CRY-N`, `{id}`) → Refresh (`F5`) / ปิดแท็บเปิดใหม่ → `/my-ticket` ยังแสดง `CRY-N`. (2) `staff_crybaby` Call Next → Start → Complete `CRY-N` → `/my-ticket` ของ `collector5` กลับเป็น `"ยังไม่มีบัตรคิว"` (`404 NO_ACTIVE_TICKET`), ส่วน `GET /tickets/{id}` คืน `200 status: "COMPLETED"` พร้อม timestamps ครบ. (3) `collector6` Join `CRY` → ได้ **`CRY-(N+1)`** (ไม่ใช้เลขเดิมซ้ำ) → `staff_crybaby` Complete `CRY-(N+1)`. **End:** คิวว่าง 0 |
| **9** | **UAT-09** | *(Mobile UX / Responsive)* | `AC-20` *(NFR-06)* | `collector1` + `staff_crybaby` | **Start:** คิวว่าง 0. ใช้ DevTools **`375×667`** ตรวจ `/login`, `/series`, `/my-ticket` (`collector1` Join `CRY` แล้ว `staff_crybaby` Complete คืน), `/staff/counter` → `scrollWidth <= clientWidth`. **End:** คิวว่าง 0 |

---

### 4.3 Complete Sprint 1 AC Traceability Split (`AC-01`–`AC-39`) — Exact Coverage

| Verification Mode | Covered AC IDs | Automated / Infra Proof Reference |
| :--- | :--- | :--- |
| **Verified Directly by Executable UAT (`UAT-01`..`UAT-09`) + Automated Tests** | `AC-01`, `AC-02`, `AC-05`, `AC-06`, `AC-09`, `AC-10`, `AC-11` *(incl. counter non-leak)*, `AC-12`, `AC-14` *(401+403)*, `AC-18`, `AC-19`, `AC-20`, `AC-21`, `AC-22`, `AC-23`, `AC-24`, `AC-25`, `AC-26`, `AC-27`, `AC-28` *(partial UI/API jumps)*, `AC-29`, `AC-30`, `AC-31` *(4 routes)*, `AC-33`, `AC-34`, `AC-35`, `AC-36`, `AC-37`, `AC-38` *(all 4 cases)* | ดูขั้นตอนใน §4.2 และไฟล์ Integration/E2E ใน `PopQueue_Lab6_Context.md` §6 |
| **Verified by Automated / Unit / Concurrency / Infra Tests ONLY *(Not Direct Manual UAT)*** | **`AC-03`** *(Malformed JSON/Zod)*, **`AC-04`** *(Parameterized `alg:none`/tampered/expired JWT across all routes)*, **`AC-07`** *(Bcrypt cost ≥ 10)*, **`AC-08`** *(`requireRole` unit test)*, **`AC-13`** *(Join unknown/non-UUID)*, **`AC-15`** *(50 concurrent distinct joins)*, **`AC-16`** *(10 concurrent same-user joins)*, **`AC-17`** *(`Asia/Bangkok` midnight reset via `FakeClock`)*, **`AC-28` (ส่วน Unit Test ของ `canTransition()`)**, **`AC-32`** *(2-staff & 5-req `call-next` concurrency)*, **`AC-39`** *(NFR-05 DB container restart persistence)* | `server/tests/api/auth.test.ts`, `unauthenticated.test.ts`, `password-hash.test.ts`, `role-guard.test.ts`, `join.test.ts`, `numbering.test.ts`, `duplicate.test.ts`, `queue-date.test.ts`, `queue-reset.test.ts`, `state-machine.test.ts` *(TEST-28U)*, `call-next-concurrency.test.ts`, `scripts/test-persistence.mjs` *(+ Lab 5 Check C-05)* |

---

## 5. Phase 2 & 3 Protocol: Independent Execution (Part B) & Defect Triage (Part C)

### 5.1 กติกาการทดสอบของ BFteam ในฐานะ UAT Team (Part B — 25 pts)
1. **Audit Partner Handoff ก่อนรัน:** ตรวจว่ามี ≥4 หมวด, Expected Result ชัด, ข้อมูล/บัญชีพร้อม หากขาดให้ขอแก้ก่อนรัน (เก็บหลักฐาน)
2. **รันครบทุกเคสของ Partner Team** บน Released GCP URL จริง โดย **ทั้ง `@Theerawat82` และ `@apfirst13` ร่วมทดสอบจริง**
3. **Evidence & Security Hygiene:** มี `Evidence ID` (`B-EV-xx`), Actual Result จริง (**ห้ามก๊อป Expected**), Date/Time, Tester Identity, Tested Version/SHA, Browser URL Bar, **Mask `Authorization: Bearer ...` และรหัสผ่านทุกภาพ/Log**; หากติดปัญหาให้ลง **`BLOCKED`** และแจ้ง Partner/TA ทันที

### 5.2 Full 12-Field Outgoing Defect Report Template (BFteam → Partner Team)
*(ใช้ Template 12 ช่องนี้ทั้งใน GitHub Issue Body และ `execution/DEFECT_TRIAGE_LOG.md` แทน `.github/ISSUE_TEMPLATE/defect.md` ที่มีแค่ 5 หัวข้อ)*

1. **Issue ID & Link**
2. **Product Owner / Team**
3. **Reporter** (`@Theerawat82` or `@apfirst13`)
4. **Tested Version / Commit SHA / Live URL**
5. **Linked UAT Case / Requirement / AC**
6. **Spec Reference & Classification** *(`Defect against agreed Sprint 1 spec` vs `New Feature Request / Out of Scope`)*
7. **Preconditions & Synthetic Test Data**
8. **Numbered Reproduction Steps**
9. **Expected Result vs Actual Result**
10. **Severity (`Critical` / `Major` / `Minor` — อธิบาย User Impact) & Priority**
11. **Evidence ID(s) & Masked Screenshots / Sanitized Logs**
12. **Notification Timestamp/Channel & Partner Disposition / Outcome** *(ผลตอบกลับจากทีมคู่)*

### 5.3 Incoming Triage Protocol & Spec-Grounded Guidelines (`PopQueue`)
* **กฎเหล็ก Triage:** เมื่อได้รับ Finding จริงจาก Partner (ไม่ว่าจะมา **ก่อนหรือหลัง `22:00` Freeze**) ต้อง **Reproduce, เทียบข้อความใน `PopQueue_Deliverable_1_Master.md`, ชี้แจงทีมคู่, และลง Disposition ครบทุกข้อ** (นิยามในตารางด้านล่างใช้แยกประเภทอย่างตรงไปตรงมา)

| Disposition Class | Strict Criteria Aligned to Lab 6 §3.3 & `PopQueue_Deliverable_1_Master.md` | Clear Examples *(When Verified Against Findings)* |
| :--- | :--- | :--- |
| **`Accepted Defect`** | พฤติกรรมจริง **ขัดกับ Sprint 1 Spec / Contract ที่ตกลงไว้** (`FR-01..10`, `BR-01..07`, `BR-09`, `NFR-01..06`, `AC-01..39`, หรือ Part E UI Behavior) | * ตั๋วข้ามสถานะ, สิทธิ์ Role/Ownership/Series รั่ว, เลขคิวซ้ำ/กระโดด, ข้อมูลสูญหาย *(หรือ Minor defect เช่น ข้อความ/UX ที่พิสูจน์ว่าบกพร่องจริงในขอบเขต Sprint 1)* |
| **`Duplicate`** | อาการและ Root Cause เดียวกันกับ Issue อื่นที่เปิดไว้แล้ว | * รายงานซ้ำของ Issue เดิม → อ้างอิงเชื่อมกลับไปยัง Primary Issue ID ต้นฉบับ |
| **`Not-Defect`** | พฤติกรรม **ตรงตาม Sprint 1 Contract แล้ว** OR **ผู้ทดสอบทำผิดเงื่อนไข Handoff** | * `/my-ticket` กลับสู่ `"ยังไม่มีบัตรคิว"` หลัง `COMPLETED` (`AC-35`, ประวัติอยู่บน `GET /api/tickets/:id` ตาม `AC-36`)<br>* `STAFF_BUSY` เพราะไม่ Complete เคสก่อนหน้า, Cold start delay, หรือแชร์ Incognito แล้ว Token ทับกัน |
| **`Enhancement`** | ข้อเสนอฟีเจอร์ใหม่ OR ฟีเจอร์ที่ **เลื่อนไป Sprint 2 / Sprint 3** ตั้งแต่ต้น *(ห้ามนำ Sprint 1 Req ที่พังมาแปะเป็น Enhancement!)* | * การไม่มี Server cutoff เมื่อครบ `120s` (**Deferred `F-06` No-Show Sprint 2**)<br>* Cancel (`F-05`), Public Board (`F-07`), Analytics (`F-08`), Series Toggle (`F-09`), Rate Limit (`NFR-07`) |

#### 🎯 Dedicated Note: แนวทางพิจารณาเฉพาะกรณี `CountdownTimer` Refresh Behavior
* จากการเปิดเช็ก `PopQueue_Deliverable_1_Master.md` (lines 61, 951, 1229) สเปกระบุเพียง *"แสดงข้อความเรียกพร้อมนับถอยหลัง 120 วินาที (แสดงผลเท่านั้นใน Sprint 1)"* และไม่ได้กำหนดให้ Client คำนวณเวลาที่เหลือจาก `calledAt` (การคำนวณ `now - calledAt >= 120s` อยู่ใน `FR-12`/`BR-08` ของ Sprint 2)
* **วิธีปฏิบัติเมื่อ Partner รายงานประเด็นนี้:**
  1. Reproduce และอ้างข้อความสเปกจริงให้ Partner เห็นตรงกันก่อน
  2. หาก Partner รายงานแค่เรื่องไม่มี Auto No-Show หลังครบ `120s` → **`Enhancement` (Deferred `F-06`)**
  3. หาก Partner รายงานเรื่องรีเฟรช `/my-ticket` แล้วตัวนับเริ่ม `02:00` ใหม่ว่ากระทบผู้ใช้จริง → ยอมรับอย่างโปร่งใสเป็น **`Minor`** (เลือกระหว่างแก้ให้คำนวณจาก `calledAt` หรือขอให้ Partner ลงนามรับใน **§6.3(C) Minor Known Limitations** เพื่อไม่ให้ค้างคา)

---

## 6. Phase 3 & 4 Workflow: Fix Chain, §3.5 Controlled Exercise & Bidirectional Sign-Off

### 6.1 Mandatory Engineering Fix Chain (Code/Test Only on `lab5-staging` → `main`)
1. **GitHub Issue (`bug` + `lab6`):** ลิงก์ Defect Report + Assign Owner *(ขออนุญาต User)*
2. **Branch off Code Staging (`lab5-staging`):** สร้าง `fix/<issue#>-<slug>` *(มีเฉพาะโค้ด+Test ห้ามมีเอกสาร `docs/labs/lab6/` ปนอยู่; ขออนุญาต User)*
3. **TDD `RED` Commit & Push First:**
   * Commit และ Push **เฉพาะ Automated Test ที่ Reproduce Defect และ Fail** ขึ้น `fix/*` ก่อน
   * **เก็บหลักฐานทั้ง Local Output + GitHub Actions CI สีแดง (`test-and-docker`) + จด `RED Commit SHA` ไว้เสมอ** (`d-red-*.txt`) *(สำคัญมากหากทีมใช้ Squash Merge เพราะ Squash จะลบประวัติ Commit ย่อยตอนเข้า Staging!)*
4. **TDD `GREEN` Commit & Regression:**
   * Commit และ Push โค้ดแก้ไขขั้นต่ำ + รัน `npm test`, `npm run typecheck`, `npm run lint`, `npm run build` (และ `npm run test:e2e` เมื่อกระทบ UI)
   * **เก็บหลักฐานทั้ง Local Output + GitHub Actions CI สีเขียว + จด `GREEN Commit SHA` ไว้เสมอ** (`d-green-*.txt`)
5. **Peer PR → `lab5-staging`:** ใช้ `.github/PULL_REQUEST_TEMPLATE.md` (ลิงก์ Issue ทุกครั้ง) + CI `test-and-docker` ผ่าน + เพื่อน Approve 1 คน — **บังคับเลือก `"Create a merge commit"`** (ห้าม Squash เพื่อให้ `RED`/`GREEN` commit ปรากฏในกราฟชัดเจน; ขออนุญาต User ก่อน)
6. **Notify Partner + Release PR `lab5-staging` → `main` (`deploy.yml`):** **แจ้ง Partner ล่วงหน้าก่อน Deploy** → Merge เข้า `main` → Auto-deploy + `smoke_test.py` → ยืนยัน `GET /api/health` SHA ใหม่ **แล้วติด annotated tag เช่น `v0.2.1-lab6`** เพื่อระบุจุด deploy ชัดในกราฟ *(Rollback via `workflow_dispatch` `image_tag` / `ROLLBACK=true` หากมีปัญหา — ขออนุญาต User ก่อนทุกคำสั่ง tag/release)*
7. **Independent Retest:** ส่ง Corrected SHA/URL + เคสเดิมให้ Partner เทสต์ซ้ำ (รองรับ 2 รอบในวันเสาร์)

### 6.2 §3.5 Controlled Defect Exercise Protocol (ทำเฉพาะกรณี `v0.2.0-lab5` ไม่พบ Natural Defect หลัง UAT)
1. **ห้าม** ปั้น Defect ปลอม, **ห้าม** ทำ Live `popqueue` หลักพัง, **ห้าม** เอาฟีเจอร์ Sprint 2 มาแก้แทน
2. ให้ Partner ออกคำตัดสิน Sprint 1 Acceptance ของ **Healthy Release (`v0.2.0-lab5`)** ตามจริงก่อน
3. **Reactive TA Inquiry & Execution (รอดูผล UAT ก่อน — ทักเมื่อไม่พบบั๊กจริง):**
   * หลัง Findings Freeze (**พฤหัส `22:00`** หรือเช้า **ศุกร์ไม่เกิน `09:00`**) หากไม่พบ Defect จริง ให้ทักถาม Instructor/TA เพื่อขอ **Controlled Defect Exercise** (ถามทั้งผู้กำหนด Defect และนิยาม "deployed" สำหรับ Branch แยก เพราะ `deploy.yml` & WIF ผูกเฉพาะ `main` และ `popqueue-pg`)
   * เมื่อได้แนวทางจาก TA แล้ว ให้ทำครบ Loop: *Defect Spec/Issue → Branch แยก → RED Commit (CI Red) → GREEN Commit (CI Green) + Regression → Peer PR → Independent Retest โดย Partner ในวันเสาร์ → Version Lineage Table แยกชัดเจนระหว่าง Healthy Release กับ Exercise*
4. **TA Response Cut-off:** ส่ง Follow-up ช่วง **ศุกร์ `15:00`** หากยังเงียบ และหากยังไม่ได้รับคำตอบหรือ Replacement Tester ภายใน **ศุกร์ `18:00`** → บันทึกเป็น *Unresolved assessment dependency* พร้อมแนบหลักฐานเวลาที่ส่งและติดตามทั้งหมดอย่างตรงไปตรงมา (Lab 6 §3.5)

### 6.3 Bidirectional Retest & 3-Category Sign-Off Record (`RETEST_ACCEPTANCE_RECORD.md`)
ไฟล์ `execution/RETEST_ACCEPTANCE_RECORD.md` แยก **2 ส่วนชัดเจน**:
1. **Part D-1: Partner UAT Team's Independent Decision on `PopQueue` (Product = `BFteam`)**
   * ตาราง **Retest Log** (Issue ID, Fix Commit/Deployed SHA, Retest Tester, Date, Actual Result, Screenshot ID)
   * **3-Category Transparency & Explicit Sign-Off Table:**
     * **(A) Agreed Sprint 1 Specified Behavior *(Confirming understanding — not a defect)*:** `/my-ticket` displays active tickets only (`AC-35`, `AC-36`) — `[Understood / Question]`
     * **(B) Deferred Sprint 2/3 Scope *(Acknowledged out-of-scope Enhancements)*:** Visual-only `120s` client timer (`F-06` Sprint 2), Cancel (`F-05` Sprint 2), Rate Limit (`NFR-07` Sprint 3) — `[Acknowledged / Disputed]`
     * **(C) Minor Defects / Actual Known Limitations *(Explicitly Agreed by UAT Team)*:** รายการ Minor defects ที่ไม่ได้แก้ (ถ้ามี เช่น `CountdownTimer` reset บน refresh หากถูกบันทึกเป็น Minor defect) — **`[Accepted as Minor Limitation / Not Accepted]`**
   * **Final Decision on `PopQueue`:** `[Accepted / Accepted with minor limitations / Not Accepted]` + Exact Tested Version/SHA *(ตรงกับ Live Cloud Run SHA)* + Partner Tester Names + Date
2. **Part D-2: `BFteam`'s Independent Retest & Decision on Partner Product (UAT Team = `BFteam`)**
   * ตาราง **BFteam Retest Log** (`@Theerawat82` & `@apfirst13` รีเทสต์บั๊กที่ Partner แก้กลับมาบน Deployed Revision ใหม่) + รายการ Minor Limitations ของ Partner ที่ `BFteam` ยอมรับ/ไม่ยอมรับ
   * **Final Decision Issued by `BFteam`:** `[Accepted / Accepted with minor limitations / Not Accepted]` + Exact Partner Release SHA/Version + Both BFteam Testers + Date

---

## 7. Lab 6 Folder Hygiene, Rehearsal Policy & Final PDF Checklist

### 7.1 Clean Folder Structure on `lab6-docs` Branch (`docs/labs/lab6/`)
*เก็บทั้งหมดบน **`lab6-docs`** ไม่ Merge ปนเข้า `lab5-staging` หรือ `main` เพื่อให้ Cloud Run Live SHA ตรงกับ Release ที่ถูก UAT ตลอดช่วง Grading:*

```text
docs/labs/lab6/
├── plan/
│   └── LAB6_MASTER_PLAN.md              # แผนหลักฉบับนี้ (Rev 6)
├── handoff/
│   └── POPQUEUE_UAT_HANDOFF.md          # Part A: Scope Header (+ NFR-03..05 & Countdown Refresh Note), Sequential UAT-01..09, Masked Curl, Drain Runbook
├── execution/
│   ├── PARTNER_UAT_RESULTS.md           # Part B: ผลเทสต์ระบบคู่ค้า (Actual Results ของ BFteam 2 คน)
│   ├── DEFECT_TRIAGE_LOG.md             # Part C: Full 12-Field Outgoing Reports + Incoming Triage Table
│   └── RETEST_ACCEPTANCE_RECORD.md      # Part D: Bidirectional Retests + 3-Category Sign-Off + RED/GREEN SHAs + §3.5 Log
├── evidence/                            # Screenshots (Masked) & RED/GREEN Test Logs
│   ├── a-*.png                          # Pre-UAT baseline drain / Handoff checks (Rehearsal ตั้งชื่อ rehearsal-*.png แยก!)
│   ├── b-*.png                          # Part B Partner UAT screenshots
│   ├── d-red-*.txt                      # Part D Automated RED logs (+ CI Red screenshot)
│   ├── d-green-*.txt                    # Part D Automated GREEN + Regression logs (+ CI Green screenshot)
│   └── d-retest-*.png                   # Part D Retest & Deployed SHA confirmation screenshots
├── lab6_sec1_BFteam.html                # สร้าง/ทดสอบ HTML→PDF ตั้งแต่ Phase 1 (พุธ-พฤ.)
└── lab6_sec1_BFteam.pdf                 # Final Self-Contained PDF ส่ง LEB2 ก่อน อา. 22 พ.ย. 23:59
```
*(หมายเหตุ: `LAB6/PopQueue_Lab6_Context.md` นอก repo ใช้เป็น Reference Context ส่วนตัว; หากทำ Pre-UAT Rehearsal บน Production ต้อง Drain คิวเป็น `0` หลังซ้อม และห้ามใส่แทน Independent UAT)*

### 7.2 Mandatory Pre-Submission Audit Checklist (Lab 6 §4 & §5)
- [ ] **No Secrets & Branch Integrity:** สแกน PDF/Screenshots (`Authorization: Bearer ...`)/`curl`/Git ว่าไม่มีรหัสผ่าน/Token จริง; เอกสาร Lab 6 อยู่บน `lab6-docs` (ไม่ปนเข้า `main` จนทำให้ Live Cloud Run SHA คลาดเคลื่อนจากคำตัดสิน `Accepted`)
- [ ] **Dual-Role & Bidirectional Clarity:** แยก Product Team vs UAT Team และคำตัดสินทั้ง 2 ฝั่งชัดเจน พร้อมชื่อจริง+รหัสนิสิต+คู่ Partner
- [ ] **Handoff & AC Honesty:** มี Scope Header Checklist ครบ (`NFR-03..05` หมายเหตุว่าตรวจโดย Automated + เปิดเผย Countdown refresh behavior), `UAT-01..09` เรียงลำดับชัดเจน, `SKP` ไม่กำกวม, `AC-11` non-leak, `AC-14` unauth 401, และตารางแยก `UAT` vs `Automated Only` (`AC-01`–`AC-39`)
- [ ] **Part B Integrity:** Audit Handoff คู่ค้าก่อนรัน + Actual Result จริง + Evidence ID ครบ + Tester ครบ 2 คน
- [ ] **Part C Completeness:** Outgoing Reports ครบ 12 Fields + Incoming Triage ครบทุกข้อ (รวมข้อที่มาหลัง `22:00` Freeze) โดยไม่ขัดนิยามตัวเอง
- [ ] **Part D & §3.5 Compliance:** มีทั้ง `RED` commit (CI Red) & `GREEN` commit (CI Green) SHA + Regression logs, Version Lineage Table *(ระบุหมายเหตุว่า `lab6-docs` เป็น branch เอกสารที่ตั้งใจไม่ merge เพื่อคง Live Cloud Run SHA และอธิบาย merge commit sync `0 1` หากทำ)*, **3-Category Transparency & Explicit Minor Limitation Acceptance Table**, และคำตัดสินอิสระ (หรือ §3.5 แยกส่วน / Unresolved Dependency พร้อมหลักฐานเวลาที่แจ้ง TA หลัง UAT ไม่พบบั๊ก)
- [ ] **End Matter:** Short Contribution Table, **Honest AI-Use Declaration (ระบุตามจริงว่ามีการใช้ผู้ช่วย AI ในขั้นตอนใดบ้าง รวมทั้งการวิจารณ์และปรับปรุงแผน/ร่างเอกสาร)**, Known Limitations, ToC พร้อมเลขหน้า & Evidence IDs; Repo & Cloud Run/Cloud SQL ยังออนไลน์ตลอดช่วง Grading
