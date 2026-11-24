# PopQueue Deliverable 2 — Audit Addendum (READ-ONLY)
> **Audit Date:** 2026-11-24T20:14:40+07:00  
> **Audited Commit / HEAD:** `75068a6109439b7f5dcadd7713ba93115ab29043` (Branch `sprint-2-docs`)  
> **Production Remote Release Tag:** `v0.3.0-lab7` (`a07a7be732b30cb75a22df7f30edfdc51521a87e`)  
> **Master Specification Audited:** `docs/sprints/sprint-2/PopQueue_Deliverable_2_Master.md`  
> **Audit Scope & Constraints:** READ-ONLY inspection on repository, test suites, database migrations, CI/CD pipelines, and client/server architecture. Append-only evidence policy: zero modifications to existing `EV-A*` files, zero deletion/restoration of files, reporting only.

---

## สารบัญการตรวจสอบเพิ่มเติม (Audit Addendum Table of Contents)
1. [บันทึกหลักฐานดิบรายข้อ (Raw Evidence EV-B01 .. EV-B09)](#1-บันทึกหลักฐานดิบรายข้อ-raw-evidence-ev-b01--ev-b09)
2. [หมวดที่ 1: ผลการตรวจสอบเชิงลึกรายหัวข้อ (Deep-Dive Analysis B01 .. B09)](#2-หมวดที่-1-ผลการตรวจสอบเชิงลึกรายหัวข้อ-deep-dive-analysis-b01--b09)
3. [หมวดที่ 2: ข้อขัดแย้งและสิ่งที่ไม่มีหลักฐานรองรับ (Conflicts & No Existing Evidence)](#3-หมวดที่-2-ข้อขัดแย้งและสิ่งที่ไม่มีหลักฐานรองรับ-conflicts--no-existing-evidence)
4. [Evidence Report Table](#4-evidence-report-table)
5. [Self-Audit (การประเมินตนเองอย่างเคร่งครัด)](#5-self-audit-การประเมินตนเองอย่างเคร่งครัด)

---

## 1. บันทึกหลักฐานดิบรายข้อ (Raw Evidence EV-B01 .. EV-B09)

ทุกข้อถูกบันทึกเป็นไฟล์หลักฐานดิบแยกรายข้อในไดเรกทอรี `docs/evidence/EV-B*.txt` ตามกฎ Append-only Evidence (Rule 4):

| รหัสหลักฐาน | หัวข้อการตรวจ | ไฟล์หลักฐานบนดิสก์ |
| :---: | :--- | :--- |
| **EV-B01** | Role Guard Implementation, Error Code & Envelope | [`docs/evidence/EV-B01.txt`](file:///d:/University/Y3/sem1/cpe334%20se/group_project/PopQueue/docs/evidence/EV-B01.txt) |
| **EV-B02** | Git Ancestry & Source Tree Diff vs v0.3.0-lab7 | [`docs/evidence/EV-B02.txt`](file:///d:/University/Y3/sem1/cpe334%20se/group_project/PopQueue/docs/evidence/EV-B02.txt) |
| **EV-B03** | QueueCounter & BR-01: Key, Daily Reset & Permanent Skip | [`docs/evidence/EV-B03.txt`](file:///d:/University/Y3/sem1/cpe334%20se/group_project/PopQueue/docs/evidence/EV-B03.txt) |
| **EV-B04** | My-Ticket: Status Query Filter & Post-Lab 7 Response Shape | [`docs/evidence/EV-B04.txt`](file:///d:/University/Y3/sem1/cpe334%20se/group_project/PopQueue/docs/evidence/EV-B04.txt) |
| **EV-B05** | Call-Next: FIFO Query & Structural Skipping of CANCELLED | [`docs/evidence/EV-B05.txt`](file:///d:/University/Y3/sem1/cpe334%20se/group_project/PopQueue/docs/evidence/EV-B05.txt) |
| **EV-B06** | Deployment: GIT_SHA Flow to Cloud Run & Fallback | [`docs/evidence/EV-B06.txt`](file:///d:/University/Y3/sem1/cpe334%20se/group_project/PopQueue/docs/evidence/EV-B06.txt) |
| **EV-B07** | Master Part A Claims Audit: CHG-01, DEF-02 & CHG-02 | [`docs/evidence/EV-B07.txt`](file:///d:/University/Y3/sem1/cpe334%20se/group_project/PopQueue/docs/evidence/EV-B07.txt) |
| **EV-B08** | Client Architecture & Test Suites Real File Map | [`docs/evidence/EV-B08.txt`](file:///d:/University/Y3/sem1/cpe334%20se/group_project/PopQueue/docs/evidence/EV-B08.txt) |
| **EV-B09** | Working Tree Integrity & Untracked Files Audit | [`docs/evidence/EV-B09.txt`](file:///d:/University/Y3/sem1/cpe334%20se/group_project/PopQueue/docs/evidence/EV-B09.txt) |

---

## 2. หมวดที่ 1: ผลการตรวจสอบเชิงลึกรายหัวข้อ (Deep-Dive Analysis B01 .. B09)

### B01: Role Guard (`requireRole`), Error Code และ Response Envelope
- **ไฟล์โค้ด:** `server/src/middleware/auth.ts` (บรรทัด 67–93)
- **โค้ดฟังก์ชัน `requireRole` จริง:**
  ```typescript
  export function requireRole(allowedRoles: Role[]) {
    return (req: Request, res: Response, next: NextFunction): void => {
      // 1. Authentication check precedes Role check
      if (!req.user) {
        res.status(401).json({
          error: {
            code: 'UNAUTHENTICATED',
            message: 'Authentication required or token has been revoked',
            statusCode: 401,
          },
        });
        return;
      }

      // 2. Role permission check
      if (!allowedRoles.includes(req.user.role)) {
        res.status(403).json({
          error: {
            code: 'FORBIDDEN_ROLE',
            message: 'Forbidden: Insufficient role permissions',
            statusCode: 403,
          },
        });
        return;
      }

      next();
    };
  }
  ```
- **Error Code ที่ส่งจริง:**
  ส่งค่า **`FORBIDDEN_ROLE`** (ไม่ใช่ `FORBIDDEN`)
- **JSON ตัวอย่างจาก Unit Test จริง (`server/tests/unit/role-guard.test.ts` lines 34–67, TEST-08U):**
  ```json
  {
    "error": {
      "code": "FORBIDDEN_ROLE",
      "message": "Forbidden: Insufficient role permissions",
      "statusCode": 403
    }
  }
  ```
- **Response Envelope จริง:**
  ระบบใช้ Standard Error Envelope ครอบด้วยออบเจกต์ `error` ที่ประกอบด้วย 3 ฟิลด์หลัก:
  - `error.code` (string): รหัสประเภทข้อผิดพลาด เช่น `"FORBIDDEN_ROLE"`
  - `error.message` (string): ข้อความอธิบาย
  - `error.statusCode` (number): รหัสสถานะ HTTP เช่น `403`

---

### B02: Git Ancestry และ Codebase Diff เทียบกับ Release Tag `v0.3.0-lab7`
- **คำสั่ง Ancestry Check:**
  ```powershell
  git merge-base --is-ancestor v0.3.0-lab7 HEAD
  ```
  - **Exit Code:** `0`
  - **ข้อสรุป:** Tag `v0.3.0-lab7` (`a07a7be732b30cb75a22df7f30edfdc51521a87e`) **เป็น Ancestor สายตรง 100%** ของ `HEAD` (`75068a6109439b7f5dcadd7713ba93115ab29043`) บน Branch `sprint-2-docs`
- **คำสั่ง Code Diff Check:**
  ```powershell
  git diff --stat v0.3.0-lab7 HEAD -- server client e2e scripts
  ```
  - **Exit Code:** `0`
  - **ผลลัพธ์:** ว่างเปล่า (Empty output, 0 files changed, 0 insertions, 0 deletions)
- **ข้อสรุปเชิงโครงสร้าง:**
  โค้ดในโฟลเดอร์ปฏิบัติการหลักทั้งหมด (`server/`, `client/`, `e2e/`, และ `scripts/`) บน `HEAD` **เหมือนกันแบบ Bit-for-bit (Bit-identical 100%)** กับเวอร์ชัน Production Release `v0.3.0-lab7` โดยสิ่งที่เพิ่มขึ้นมีเพียงไฟล์เอกสาร `docs/sprints/sprint-2/PopQueue_Deliverable_2_Master.md` (632 insertions) เท่านั้น

---

### B03: QueueCounter และ BR-01 (การออกเลขคิว, Counter Key, การรีเซ็ตรายวัน และตั๋วยกเลิก)
- **ไฟล์โค้ด:** `server/src/services/ticket.service.ts` (บรรทัด 86–95) และ `server/src/utils/clock.ts` (บรรทัด 33–53)
- **โค้ดออกเลขคิวใน `joinQueue`:**
  ```typescript
  // Atomic increment of QueueCounter using PostgreSQL raw SQL (D-10, BR-01)
  const counterRows = await tx.$queryRaw<Array<{ lastNumber: number }>>`
    INSERT INTO "QueueCounter" ("id", "seriesId", "queueDate", "lastNumber")
    VALUES (gen_random_uuid()::text, ${seriesId}, ${queueDateStr}::date, 1)
    ON CONFLICT ("seriesId", "queueDate")
    DO UPDATE SET "lastNumber" = "QueueCounter"."lastNumber" + 1
    RETURNING "lastNumber";
  `;

  const queueNumber = Number(counterRows[0].lastNumber);
  const displayNumber = `${series.code}-${String(queueNumber).padStart(3, '0')}`;
  ```
- **Counter Key:**
  ใช้ Composite Key **`("seriesId", "queueDate")`** ตาม Constraint `ON CONFLICT ("seriesId", "queueDate")` และ Prisma Schema `@@unique([seriesId, queueDate])` (แยกตัวนับอิสระตามแต่ละซีรีส์ และแยกตามวัน)
- **รีเซ็ตรายวันไหม? และ Timezone อะไร?:**
  - **รีเซ็ตรายวันแน่นอน 100%**
  - Timezone: **`Asia/Bangkok`** (UTC+7, เวลาประเทศไทย) ผ่านฟังก์ชัน `getQueueDate()` ซึ่งใช้ `Intl.DateTimeFormat` จัดรูปแบบเป็น `YYYY-MM-DD` เมื่อพ้นเวลา 00:00:00 น. ค่า `queueDate` จะเปลี่ยนเป็นวันถัดไป ทำให้คำสั่ง SQL สร้างแถวใหม่และเริ่มต้น `lastNumber = 1` เสมอ
- **ตั๋วที่ยกเลิกแล้วเลขจะถูกข้ามถาวรหรือไม่?:**
  - **ตอบตรงๆ: ถูกข้ามถาวร (Yes, permanently skipped)**
  - ตัวนับ `QueueCounter.lastNumber` เป็นแบบ Monotonically Increasing Counter เมื่อตั๋วใดถูกยกเลิก (`CANCELLED` หรือ `NO_SHOW`) จะ **ไม่มีการถอยค่าตัวนับกลับ (No rollback / No decrement)** และระบบไม่มีการนำหมายเลขคิวนั้นกลับมาใช้ซ้ำ ตั๋วคิวที่กดเข้ามาหลังจากนั้นจะได้รับเลขถัดไป ทำให้หมายเลขคิวที่ยกเลิกถูกข้ามไปอย่างถาวร (ระบุไว้ใน Master บรรทัด 87)

---

### B04: My-Ticket (Query Filter สถานะ และ Response Shape หลัง Lab 7)
- **ไฟล์โค้ด:** `server/src/services/ticket.service.ts` (บรรทัด 148–213) และ `server/src/controllers/ticket.controller.ts` (บรรทัด 28–41)
- **Query และ Filter สถานะ:**
  ```typescript
  const activeTickets = await prisma.queueTicket.findMany({
    where: {
      userId,
      status: {
        in: [TicketStatus.WAITING, TicketStatus.CALLED, TicketStatus.UNBOXING],
      },
    },
    orderBy: [{ createdAt: 'asc' }, { id: 'asc' }],
    include: {
      series: {
        select: {
          id: true,
          code: true,
          name: true,
        },
      },
    },
  });
  ```
  - **สถานะที่เลือก:** กรองเฉพาะ 3 สถานะ Active คือ `WAITING`, `CALLED`, และ `UNBOXING`
  - **สถานะที่ถูกตัดออก (Excluded):** `COMPLETED`, `CANCELLED`, และ `NO_SHOW` ไม่ติด query ออกมา
  - หากไม่มีตั๋วค้างอยู่ จะ throw `404 NO_ACTIVE_TICKET`
- **Response Shape หลัง Lab 7 (PR #58 / Issue #53):**
  Response Envelope ตอบกลับ HTTP 200:
  ```json
  {
    "data": {
      "ticket": {
        "id": "uuid-cry",
        "displayNumber": "CRY-001",
        "queueNumber": 1,
        "status": "WAITING",
        "waitingAhead": 0,
        "series": {
          "id": "uuid-series",
          "code": "CRY",
          "name": "Crybaby Molly"
        },
        "createdAt": "2026-11-24T12:00:00.000Z",
        "calledAt": null,
        "startedAt": null
      },
      "tickets": [
        {
          "id": "uuid-cry",
          "displayNumber": "CRY-001",
          "queueNumber": 1,
          "status": "WAITING",
          "waitingAhead": 0,
          "series": { "id": "uuid-series", "code": "CRY", "name": "Crybaby Molly" },
          "createdAt": "2026-11-24T12:00:00.000Z",
          "calledAt": null,
          "startedAt": null
        },
        {
          "id": "uuid-lab",
          "displayNumber": "LAB-001",
          "queueNumber": 1,
          "status": "WAITING",
          "waitingAhead": 0,
          "series": { "id": "uuid-series-lab", "code": "LAB", "name": "Labubu The Monsters" },
          "createdAt": "2026-11-24T12:05:00.000Z",
          "calledAt": null,
          "startedAt": null
        }
      ]
    }
  }
  ```
  - มีทั้ง `data.ticket` (ตั๋วใบแรก สำหรับ Backward compatibility)
  - มีทั้ง `data.tickets` (Array สำหรับ Multi-Ticket คิวข้ามหลายซีรีส์พร้อมกันตาม BR-02 v2)

---

### B05: Call-Next (Query คิว FIFO และ การข้ามตั๋ว CANCELLED โดยโครงสร้าง)
- **ไฟล์โค้ด:** `server/src/services/staff.service.ts` (บรรทัด 183–189)
- **Query เลือกตั๋ว:**
  ```typescript
  // Atomic FIFO lock with FOR UPDATE SKIP LOCKED (Master Part C §4)
  const rows = await tx.$queryRaw<Array<{ id: string }>>`
    SELECT "id" FROM "QueueTicket"
    WHERE "seriesId" = ${seriesId} AND "status" = 'WAITING'::"TicketStatus"
    ORDER BY "queueDate" ASC, "queueNumber" ASC
    LIMIT 1
    FOR UPDATE SKIP LOCKED;
  `;
  ```
  - **เงื่อนไขกรอง:** `"seriesId" = ${seriesId}` และ `"status" = 'WAITING'::"TicketStatus"`
  - **การเรียงลำดับ:** `ORDER BY "queueDate" ASC, "queueNumber" ASC` (FIFO ตามวันและเลขคิว)
  - **จำนวนและ Concurrency:** `LIMIT 1 FOR UPDATE SKIP LOCKED`
- **ตั๋ว CANCELLED ถูกข้ามโดยโครงสร้างอยู่แล้วหรือไม่?:**
  - **ตอบ: ถูกข้ามโดยโครงสร้างอยู่แล้ว 100% (Structurally skipped by SQL query filter)**
  - เพราะคำสั่ง SQL มีเงื่อนไข WHERE Clause ระบุอย่างชัดเจนว่า `"status" = 'WAITING'::"TicketStatus"` ทำให้ตั๋วสถานะ `CANCELLED` (รวมถึง `CALLED`, `UNBOXING`, `COMPLETED`, `NO_SHOW`) จะ **ไม่มีทางถูก SELECT ออกมาได้เลย** โดยข้อกำหนดของ SQL Query

---

### B06: Deployment (การส่งต่อ `GIT_SHA` เข้าสู่ Cloud Run และ Fallback)
- **ไฟล์คอนฟิก:** `.github/workflows/deploy.yml` (บรรทัด 75, 115), `Dockerfile` (บรรทัด 20, 25, 59, 60) และ `server/src/app.ts` (บรรทัด 27–34)
- **บรรทัดจริงที่ส่งค่า `GIT_SHA`:**
  - `.github/workflows/deploy.yml` (บรรทัด 75):
    ```yaml
    IMAGE_TAG: ${{ inputs.image_tag || github.sha }}
    ```
  - `.github/workflows/deploy.yml` (บรรทัด 115):
    ```yaml
    docker build --build-arg GIT_SHA="$IMAGE_TAG" --tag "$IMAGE" .
    ```
  - `Dockerfile` (บรรทัด 59–60 ใน Stage 3 Production Runtime):
    ```dockerfile
    ARG GIT_SHA="development"
    ENV GIT_SHA=$GIT_SHA
    ```
  - `server/src/app.ts` (บรรทัด 28–33):
    ```typescript
    app.get(['/api/health', '/api/v1/health'], (_req: Request, res: Response) => {
      res.status(200).json({
        status: 'ok',
        commit: process.env.GIT_SHA || 'dev',
      });
    });
    ```
- **การทำงานและการ Fallback:**
  - เมื่อ Deploy ผ่าน GitHub Actions ค่า Git commit SHA (40 ตัวอักษร) จะถูกส่งผ่าน `--build-arg GIT_SHA` และฝังเป็น Environment Variable `ENV GIT_SHA` ใน Runtime Container บน Cloud Run ทำให้ `/api/health` คืน Commit SHA ที่ deploy จริง
  - **หากไม่ถูกตั้ง (เช่น รันเซิร์ฟเวอร์แบบ Local โดยไม่ได้ใส่ตัวแปร ENV `GIT_SHA`):** โค้ดใน `server/src/app.ts` มี fallback `process.env.GIT_SHA || 'dev'` ดังนั้น `/api/health` **จะคืนค่า commit เป็น `"dev"` เสมอ**

---

### B07: ตรวจสอบ Claims ใน Master Part A เทียบกับหลักฐานในโฟลเดอร์ `docs/`
ตามข้อกำหนด Rule 3 ของ Agent Rules มีการรัน Positive Control บน `$env:TEMP` ก่อนทำการสรุปกรณีที่ "ไม่พบ":
1. **CHG-01 persistence 3/3:**
   - **สถานะ:** **มีหลักฐานเดิมรองรับ (EXISTING EVIDENCE FOUND)**
   - **Path และบรรทัด:**
     - `docs/labs/lab-05/deployment.md` บรรทัด 349–360 (และ `docs/labs/lab05/deployment.md` บรรทัด 346–357)
     - หลักฐานภาพถ่ายหน้าจอ 3 เหตุการณ์:
       - `docs/labs/lab05/evidence/c05-test1-scale-down-persistence.png` (Scale down to 0)
       - `docs/labs/lab05/evidence/c05-test2-db-restart-persistence.png` (Cloud SQL DB Restart)
       - `docs/labs/lab05/evidence/c05-test3-redeploy-persistence.png` (CD Redeployment)
     - `docs/sprints/sprint-1/PopQueue_Deliverable_1_Master.md` บรรทัด 1174, 1282 (`scripts/test-persistence.mjs` PASS)
2. **DEF-02 retest PASS:**
   - **สถานะ:** **NO EXISTING EVIDENCE ใน `docs/`**
   - **รายละเอียด:** ในโฟลเดอร์ `docs/` ปรากฏคำนี้เฉพาะใน Master Deliverable 2 บรรทัด 47 และ 52 ซึ่งเป็นเพียงข้อความเคลมลอยๆ แต่ไม่มีไฟล์ log, เอกสาร UAT, หรือหลักฐานการ Retest ของทีม Omega-3 อยู่ในโฟลเดอร์ `docs/` เลย (หลักฐานจริงถูกบันทึกไว้นอก repo ในคอมเมนต์ของ GitHub Issue #47 และโฟลเดอร์ `lab6/`)
3. **CHG-02 live check บน Cloud Run:**
   - **สถานะ:** **NO EXISTING EVIDENCE ใน `docs/`**
   - **รายละเอียด:** ในโฟลเดอร์ `docs/` มีเพียงข้อความเคลมใน Master Deliverable 2 บรรทัด 49 และ 53 โดยไม่มีไฟล์ log, ผล curl หรือภาพถ่ายหน้าจอที่ยืนยัน live check บน Cloud Run เลย ยิ่งไปกว่านั้น Master บรรทัด 14 ยังระบุ Cloud Run URL เป็น placeholder `*(จะเติมหลัง Deploy ครั้งสุดท้ายก่อนส่ง PDF)*` และ Issue #55 ยังคงมีสถานะ OPEN

---

### B08: Client File Map (พาธจริงของหน้าระบบ, Router, API Client และ Tests)
- **หน้า /my-ticket:**
  - Page: `client/src/pages/MyTicketPage.tsx`
  - Components: `client/src/components/CountdownTimer.tsx`, `client/src/components/LoadingSkeleton.tsx`
- **Staff Console:**
  - Page: `client/src/pages/StaffCounterPage.tsx`
  - Component: `client/src/components/SeriesSelector.tsx`
- **Router & Route Guard:**
  - Main Router: `client/src/App.tsx`
  - Guard: `client/src/components/ProtectedRoute.tsx`
  - Forbidden Page: `client/src/pages/ForbiddenPage.tsx`
  - Layout: `client/src/components/Layout.tsx`
  - Bootstrap: `client/src/main.tsx`
- **API Client:**
  - Base Client: `client/src/api/client.ts`
  - Ticket API: `client/src/api/ticket.api.ts`
  - Staff API: `client/src/api/staff.api.ts`
  - Auth API: `client/src/api/auth.api.ts`
  - Series API: `client/src/api/series.api.ts`
- **Test Suites ที่เกี่ยวข้อง:**
  - Client Vitest:
    - `client/src/tests/ticket.test.tsx`
    - `client/src/tests/staff.test.tsx`
    - `client/src/tests/auth.test.tsx`
    - `client/src/tests/series.test.tsx`
    - `client/src/tests/polling.test.ts`
    - `client/src/App.test.tsx`
  - E2E Playwright:
    - `e2e/full-journey.spec.ts`
    - `e2e/join-queue.spec.ts`
    - `e2e/responsive.spec.ts`
    - `e2e/smoke.spec.ts`

---

### B09: ไฟล์แปลกปลอมและสถานะ Working Tree (`git status --porcelain`)
- **ผลการรันคำสั่ง `git status --porcelain --untracked-files=all`:**
  - **ไฟล์ Tracked ที่ถูกแก้ไข (Modified 'M'):**
    1. `AGENTS.md` (เพิ่มข้อกำหนดส่วน `## ENVIRONMENT`)
    2. Screenshots 18 ไฟล์ใน `docs/evidence/screenshots/`:
       `ac19-duplicate-rejection-error.png`, `ac19-join-success-waiting.png`, `ac20-responsive-375px-login.png`, `ac20-responsive-375px-my-ticket-multi.png`, `ac20-responsive-375px-my-ticket.png`, `ac20-responsive-375px-series.png`, `ac20-responsive-375px-staff-counter.png`, `demo1-step1-collector-waiting.png`, `demo1-step2-staff-called.png`, `demo1-step3-collector-called.png`, `demo1-step4-staff-unboxing.png`, `demo1-step5-collector-unboxing.png`, `demo1-step6-staff-completed.png`, `demo1-step7-collector-completed-reloaded.png`, `demo2-step1-duplicate-error.png`, `demo2-step2-closed-series.png`, `demo3-step1-forbidden-collector.png`, `demo3-step2-logout-redirect.png`  
       *(สาเหตุ: เกิดจากการรันชุดทดสอบ Playwright E2E ในระหว่างกระบวนการเก็บหลักฐาน EV-A07 ตามกฎ Rule 6 ห้าม commit และห้าม restore เอง)*
  - **ไฟล์ Untracked นอก `docs/evidence/` ('??'):**
    1. `SPECIAL_EXERCISE_UAT_GUIDE.md`
    2. `docs/AGENT_RULES.md`
    3. `docs/labs/lab7/CHANGE_REQUEST_PROPOSAL.html`
    4. `docs/labs/lab7/CHANGE_REQUEST_PROPOSAL.md`
    5. `docs/labs/lab7/CHANGE_REQUEST_PROPOSAL.pdf`
    6. `docs/labs/lab7/build_clean_pdf.py`
  - **การตรวจหาไฟล์ `run-health-server.mjs` และ `run-server-listen.mjs`:**
    **ไม่พบไฟล์ทั้งสองใน working tree หรือ git status แต่อย่างใด** ยืนยันว่าไม่มีสคริปต์แปลกปลอมตกค้างใน Repository ตามกฎ Rule 5

---

## 3. หมวดที่ 2: ข้อขัดแย้งและสิ่งที่ไม่มีหลักฐานรองรับ (Conflicts & No Existing Evidence)

| ประเด็น | ข้อความที่ระบุใน Master Specification | ข้อเท็จจริงที่ตรวจพบจาก Repository | สรุปสถานะ |
| :--- | :--- | :--- | :---: |
| **DEF-02 Retest Sign-off** | Master บรรทัด 47 ระบุว่า *"PASS — Omega-3 retest ยืนยันผลผ่านและปิด Issue #47"* | ในโฟลเดอร์ `docs/` ไม่พบไฟล์เอกสารหลักฐานหรือ test log ของ Omega-3 เลย (มีเฉพาะคอมเมนต์ใน GitHub Issue #47 ภายนอก repo) | **NO EXISTING EVIDENCE in `docs/`** |
| **CHG-02 Live Check บน Cloud Run** | Master บรรทัด 49 ระบุว่า *"PASS — Live check บน Cloud Run ยืนยัน cross-series join สำเร็จ"* | ใน `docs/` ไม่มีหลักฐาน live check ใดๆ, URL บน Master บรรทัด 14 ยังเป็น placeholder, และ Issue #55 ยัง OPEN | **NO EXISTING EVIDENCE in `docs/`** |
| **Role Guard Error Code** | Master เอกสารบางจุดอ้างอิง `403 FORBIDDEN` | ในโค้ดจริง `server/src/middleware/auth.ts` คืนรหัส `"FORBIDDEN_ROLE"` อย่างชัดเจน | **SPEC MISALIGNMENT** |

---

## 4. Evidence Report Table

| รหัสหลักฐาน | หัวข้อการตรวจ | คำสั่งที่รัน | ผลการตรวจ | Commit SHA ที่ตรวจ | ไฟล์หลักฐานบนดิสก์ |
| :---: | :--- | :--- | :---: | :---: | :--- |
| **EV-B01** | Role Guard Implementation | Inspect `auth.ts` & `role-guard.test.ts` | CONFIRMED | `75068a6109439b7f` | `docs/evidence/EV-B01.txt` |
| **EV-B02** | Ancestry & Code Tree Diff | `git merge-base` + `git diff --stat` | CONFIRMED | `75068a6109439b7f` | `docs/evidence/EV-B02.txt` |
| **EV-B03** | QueueCounter & BR-01 | Inspect `ticket.service.ts` & `clock.ts` | CONFIRMED | `75068a6109439b7f` | `docs/evidence/EV-B03.txt` |
| **EV-B04** | My-Ticket Status & Shape | Inspect `ticket.service.ts` & `types` | CONFIRMED | `75068a6109439b7f` | `docs/evidence/EV-B04.txt` |
| **EV-B05** | Call-Next FIFO & Skip | Inspect `staff.service.ts` | CONFIRMED | `75068a6109439b7f` | `docs/evidence/EV-B05.txt` |
| **EV-B06** | Deployment GIT_SHA | Inspect `deploy.yml`, `Dockerfile`, `app.ts` | CONFIRMED | `75068a6109439b7f` | `docs/evidence/EV-B06.txt` |
| **EV-B07** | Master Part A Claims | Grep `docs/` + Positive Controls | AUDITED | `75068a6109439b7f` | `docs/evidence/EV-B07.txt` |
| **EV-B08** | Client & E2E File Map | Path verification across `client/` & `e2e/` | CONFIRMED | `75068a6109439b7f` | `docs/evidence/EV-B08.txt` |
| **EV-B09** | Working Tree & Screenshots | `git status --porcelain --untracked-files=all` | CONFIRMED | `75068a6109439b7f` | `docs/evidence/EV-B09.txt` |

---

## 5. Self-Audit (การประเมินตนเองอย่างเคร่งครัด)

ข้าพเจ้าได้ตรวจสอบตนเองอย่างเคร่งครัดตามข้อกำหนด Agent Rules และขอรายงานจุดสำคัญ 3 ประการ:
1. **การรายงาน "NO EXISTING EVIDENCE" ภายใต้กฎ Positive Control:**  
   สำหรับการค้นหาหลักฐาน DEF-02 retest และ CHG-02 live check ในโฟลเดอร์ `docs/` ซึ่งได้ผลลัพธ์ว่า "ไม่พบ" ข้าพเจ้าได้ดำเนินการทดสอบ Positive Control โดยสร้างไฟล์ชั่วคราวใน `$env:TEMP` เพื่อยืนยันว่ากลไกการค้นหา Regex ของคำสั่งสามารถตรวจจับข้อความดังกล่าวได้ถูกต้องก่อนที่จะยืนยันว่าใน `docs/` ไม่มีหลักฐานอยู่จริง
2. **การคงสภาพไฟล์ Modified Screenshots และ Untracked Files:**  
   แม้ว่า `git status` จะมีไฟล์ screenshots จำนวน 18 ไฟล์ที่ถูกเขียนทับจากการรัน Playwright ในกระบวนการตรวจสอบก่อนหน้า ข้าพเจ้าได้ปฏิบัติตามคำสั่ง READ-ONLY อย่างเคร่งครัด โดยไม่มีการรันคำสั่ง `git checkout`, `git restore`, หรือลบไฟล์ภาพทิ้งแต่อย่างใด และได้รายงานความเปลี่ยนแปลงดังกล่าวอย่างตรงไปตรงมาใน EV-B09
3. **การแยกแยะระหว่างหลักฐานใน Repository กับข้อมูลในภายนอก (GitHub Remote):**  
   ในข้อ B07 แม้ว่าหลักฐานการ Retest ของ DEF-02 (Issue #47) จะมีอยู่จริงในคอมเมนต์ของ GitHub Remote Tracking แต่การ Audit ได้ยึดถือขอบเขตคำถามที่ระบุให้ค้นหาในโฟลเดอร์ `docs/` จึงได้ตอบว่า `NO EXISTING EVIDENCE` สำหรับขอบเขตไฟล์ใน repository พร้อมระบุหมายเหตุเชื่อมโยงไปยังแหล่งข้อมูลจริงภายนอกเพื่อให้การรายงานมีความสมบูรณ์สูงสุด
