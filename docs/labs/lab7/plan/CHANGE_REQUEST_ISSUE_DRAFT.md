# Draft GitHub Issue & TA Approval Message (Lab 7 Change Request)

> **File Location (Local):** `LAB7/plan/CHANGE_REQUEST_ISSUE_DRAFT.md` *(Revision 4 — Clarified preserved non-`BR-02` tests in `db-schema-and-seed.test.ts` item 8, synced `[RED]` diff proof & `Closes #<CR>` flow with Master Plan Revision 5)*  
> **วิธีใช้:**
> 1. สร้าง Label `lab7` (ยังไม่มีบน Repo) แล้วนำส่วนที่ 1 ไปเปิดเป็น **GitHub Issue** บน `apfirst13/PopQueue_BFteam` (ติด label `lab7`, `enhancement`)
> 2. นำส่วนที่ 2 ส่งให้ **TA / อาจารย์** พร้อมลิงก์ GitHub Issue **ทันที**
> 3. เมื่อ TA/อาจารย์ตอบอนุมัติเป็นลายลักษณ์อักษร (เห็นชื่อผู้อนุมัติ + วันเวลา) ให้แคปหลักฐานแปะลงใน Issue **ก่อน** เริ่ม Commit เอกสาร Contract (`PR-1`)

---

## ส่วนที่ 1: เนื้อหา GitHub Issue (Copy-Paste ลง GitHub)

**Title:** `[Lab 7 Change Request] Revise BR-02 from 1 active ticket system-wide to 1 active ticket per Series (D-08)`

**Body:**
```markdown
## Change Request Metadata
- **Affected Requirements & Decisions:** `BR-02`, `FR-04`, `FR-05`, `D-06`, `D-08` (Features `F-02`, `F-04`)
- **Affected Acceptance Criteria & STS Tests:** `AC-11`, `AC-16`, `AC-19`, `AC-34` | `TEST-11`, `TEST-16`, `TEST-19`, `TEST-34` (+ `db-schema-and-seed.test.ts` `BR-02` partial unique index test)
- **Accepted Sprint 1 Baseline:** Tag `v0.1.0-sprint1` (`d946159`)
- **Lab 6 Retest Candidate / Current Code Baseline:** `2aee62b607b475a60be4b7a08980ec752d28941a` *(pending Team Omega-3 Issue #47 final sign-off; if Lab 6 requires an additional fix before release into `main`, it will be merged into staging and documented separately without invalidating `BR-02` `[RED]` evidence)*
- **Pre-Change Implementation Commit (for `[RED]` verification):** *(To be recorded as the `lab5-staging` commit right after the Contract revision PR merges, whose application/DB implementation matches `2aee62b`, immediately before running the `[RED]` test)*
- **Owners / Reviewers:** `@Theerawat82` & `@apfirst13` (Pair work; non-author review on Contract PR and Implementation PRs)

## 1. Original Sprint 1 Requirement & Implemented Behavior
- **Rule (`BR-02`):** A Collector may hold **at most 1 active queue ticket (`WAITING`, `CALLED`, or `UNBOXING`) across the entire system** simultaneously, enforced by PostgreSQL partial unique index `unique_active_ticket_user` on `"QueueTicket"("userId") WHERE status IN ('WAITING','CALLED','UNBOXING')`.
- **Current Outcome:** If a Collector holds an active ticket in `CRY` and calls `POST /api/tickets/join` for `LAB`, the backend rejects the request with `409 DUPLICATE_ACTIVE_QUEUE`, and `GET /api/tickets/my-ticket` returns only a single `ticket`.

## 2. Proposed New Rule & Reason
- **New Rule (`BR-02` Revised):** A Collector may hold **at most 1 active queue ticket (`WAITING`, `CALLED`, or `UNBOXING`) per Series** (`("userId", "seriesId")`).
- **Reason (Stakeholder Change):** In an on-site Art Toy store with independent unboxing stations per series (e.g., Crybaby and Labubu), customers who purchased blind boxes from multiple series during the same visit should be able to queue at distinct active series simultaneously, while hoarding multiple active spots within the same series remains prohibited.
- **Bounded Delivery Scope:** DB partial unique index migration (`0003_per_series_active_ticket_index`), backend `joinQueue` P2002 constraint handling & `GET /api/tickets/my-ticket` multi-ticket payload (`{ ticket: tickets[0], tickets }` ordered `createdAt ASC, id ASC`), and `/my-ticket` UI card list with independent per-ticket `CountdownTimer`.

## 3. Changed Behavior vs. Boundaries & Preserved Invariants

### A. Changed Behavior (What Changes)
1. **Cross-Series Sequential Join Allowed (`AC-11` revised):** A Collector holding an active ticket (`WAITING`, `CALLED`, or `UNBOXING`) in `CRY` who calls `POST /api/tickets/join` for a **different active series** (`LAB`) now succeeds with **`201 Created`** (`LAB-001`, `WAITING`).
2. **Concurrent Cross-Series Join Allowed (`AC-16` boundary extension):** Parallel `POST /api/tickets/join` requests by the same Collector targeting **distinct** active series (`CRY` and `LAB`) both succeed (`2 x 201 Created`), each producing 1 active ticket per series.
3. **Multi-Series Active Ticket Inspection (`FR-05`, `AC-34` extended):** `GET /api/tickets/my-ticket` returns **all** active tickets held by the Collector ordered oldest-first (`createdAt ASC, id ASC`) in `data.tickets` with per-ticket `waitingAhead` (preserving `data.ticket = tickets[0]` alias for compatibility), and `/my-ticket` UI renders each active ticket card with its own independent status and `CountdownTimer`.

### B. Boundaries & Invalid Cases (Rejected)
4. **Same-Series Duplicate Rejected (`AC-11` retained, `AC-19`):** Holding an active ticket (`WAITING`, `CALLED`, or `UNBOXING`) in `CRY` and calling `POST /api/tickets/join` for **`CRY` again** still returns **`409 DUPLICATE_ACTIVE_QUEUE`** (and `QueueCounter.lastNumber` rolls back without gaps).
5. **Same-Series Concurrency Race Rejected (`AC-16` retained):** 10 parallel requests by the same Collector to the **same** series (`CRY`) still yield strictly `1 x 201` and `9 x 409 DUPLICATE_ACTIVE_QUEUE` with `QueueCounter.lastNumber = 1`.
6. **Closed Series Rejected (`BR-09`, `AC-12`):** Joining `SKP` (`isActive = false`) even with no ticket in `SKP` still returns **`409 SERIES_CLOSED`**.
7. **Input Validation (`AC-13`):** Missing/malformed `seriesId` returns **`400 VALIDATION_ERROR`**; unknown UUID returns **`404 RESOURCE_NOT_FOUND`**.

### C. Preserved Sprint 1 Behavior (Unchanged Regression Targets)
8. **Baseline First Join & Same-User Re-join After Terminal State (`AC-10`, `AC-18`, preserved non-`BR-02` tests in `db-schema-and-seed.test.ts`):** Collector with no active ticket joining `CRY` succeeds (`201`); another user joining after `001` completes gets `002` (`AC-18`); non-`BR-02` tests in `db-schema-and-seed.test.ts` (such as re-joining `CRY` after `COMPLETED` and `BR-06` staff uniqueness) remain preserved and pass (`201`).
9. **Empty State & Role Isolation (`BR-04`, `AC-14`, `AC-31`, `AC-35`):** Collector with no active tickets calling `GET /api/tickets/my-ticket` receives `404 NO_ACTIVE_TICKET` (`AC-35`); `BOX_MASTER` receives `403 FORBIDDEN_ROLE` on `join` and `my-ticket` (`AC-14`, `AC-35`); `COLLECTOR` receives `403 FORBIDDEN_ROLE` on `/api/staff/*` (`AC-31`); unauthenticated calls return `401 UNAUTHENTICATED` (`AC-04`).
10. **Cross-User Ownership & Staff Counter Invariants (`FR-06`, `BR-05`, `BR-06`, `BR-07`, `AC-24`, `AC-25`, `AC-29`, `AC-30`, `AC-37`):** Collector A cannot inspect Collector B's ticket via `GET /api/tickets/:id` (`403 FORBIDDEN_OWNERSHIP`, `AC-37`); Box Master remains restricted to assigned series (`403 FORBIDDEN_SERIES`, `AC-25`, `AC-29`), handler-only transitions (`403 FORBIDDEN_NOT_HANDLER`, `AC-30`), and max 1 active serving ticket (`409 STAFF_BUSY`, `AC-24`).
11. **Atomic Daily Numbering & State Machine (`BR-01`, `BR-03`, `AC-15`, `AC-17`, `AC-28`):** Per-series sequential numbering, `Asia/Bangkok` midnight reset, non-reuse, and strict `WAITING -> CALLED -> UNBOXING -> COMPLETED` transitions remain untouched.

## 4. Acceptance Criteria Summary
- [ ] Written Instructor/TA approval recorded **before** Contract revision commit.
- [ ] Impact Analysis table + revised `SRS/Feature SDS/System SDS/AC/STS` peer-reviewed and merged **before** implementation commits.
- [ ] `[RED]` automated test asserts cross-series join succeeds (`201`) while same-series duplicate fails (`409`), fails on the pre-change commit, and proves test-only delta (`git diff --stat <pre-change>..<RED>`).
- [ ] Zero-gap SQL migration (`0003`: `CREATE` before `DROP`) + backend + UI updated -> `[GREEN]` tests & full preserved regression suites pass.
- [ ] Reviewed PRs (`Create a merge commit`, `Refs` on staging PRs, `Closes` on Release PR to `main`) deployed (`popqueue-migrate` verified), tagged (`v0.3.0-lab7`), confirmed Issue closed, and verified live for changed + preserved paths.

## 5. Instructor / TA Approval Record *(Required Before Contract Revision Commit)*
- **Status:** Pending Approval
- **Approver:** *(To be filled)*
- **Approval Date & Time:** *(To be filled + attach screenshot of written approval)*
- **Notes / Conditions:** *(To be filled)*
```

---

## ส่วนที่ 2: ข้อความสั้นสำหรับส่งขออนุมัติ TA / อาจารย์

> สวัสดีครับอาจารย์/พี่ TA กลุ่ม **BFteam (Section 1)** โปรเจกต์ **PopQueue (Theme 9: Queue Management)** ขออนุมัติ Change Request สำหรับ **Lab 7** ครับ
>
> - **กฎ Sprint 1 เดิม (`BR-02`):** ลูกค้า 1 คน ถือบัตรคิว Active (`WAITING`/`CALLED`/`UNBOXING`) ได้สูงสุด **1 ใบทั้งระบบ** (ถ้าเข้าคิว Crybaby อยู่ จะกดเข้าคิว Labubu ไม่ได้ ระบบคืน `409 DUPLICATE_ACTIVE_QUEUE` และ API/หน้า `/my-ticket` คืนตั๋วใบเดียว)
> - **กฎใหม่ที่ขอเปลี่ยน (`D-08`):** เปลี่ยนเป็นลูกค้า 1 คน ถือบัตรคิว Active ได้สูงสุด **1 ใบต่อซีรีส์** (`BR-02`, `FR-04`, `FR-05`) — เข้าคิว Crybaby และ Labubu พร้อมกันได้ แต่เข้าคิวซ้ำในซีรีส์เดียวกันยังโดน `409 DUPLICATE_ACTIVE_QUEUE`
> - **เหตุผลและขอบเขตที่กระทบ (Bounded Scope):** ลูกค้าหน้าร้านที่ซื้อกล่องสุ่มหลายซีรีส์พร้อมกันควรต่อคิวคนละเคาน์เตอร์ได้ การแก้ไขจะจำกัดเฉพาะ DB partial unique index (`0003`), API contract (`POST /api/tickets/join` และ `GET /api/tickets/my-ticket` คืนรายการตั๋ว active ของผู้ใช้), และหน้า UI `/my-ticket` (แสดงการ์ดตั๋วหลายใบพร้อมตัวนับเวลาแยกตามตั๋ว) โดยคงสิทธิ์ Role/Ownership (`403`), ซีรีส์ปิด (`409`), เลขคิว atomic (`BR-01`) และ Staff 1 คิวต่อคน (`409 STAFF_BUSY`) ไว้เหมือนเดิมทั้งหมดครับ
> - **GitHub Issue:** `<วางลิงก์ Issue ที่สร้างใหม่>`
>
> รบกวนอาจารย์/พี่ TA พิจารณาตอบอนุมัติเป็นลายลักษณ์อักษร (คอมเมนต์บน GitHub Issue ด้านบน หรือตอบกลับเป็นข้อความ) **ภายในวันจันทร์ที่ 23 พ.ย. 2026 เวลา 18:00 น.** เพื่อไม่ให้กระทบกำหนดการ Contract Review และการวาง Test ของ Lab 7 โดยทีมจะบันทึกหลักฐานการอนุมัติก่อนเริ่มแก้ไข Contract และวาง Test ตามขั้นตอนต่อไปครับ ขอบคุณครับ 🙏
