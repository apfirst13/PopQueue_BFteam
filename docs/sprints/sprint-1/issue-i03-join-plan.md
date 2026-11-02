# แผนการพัฒนา Issue I-03: F-02 Queue Discovery & Safe Joining (ฉบับปรับปรุง v1.4)
**โครงการ PopQueue – Art Toy Live Unboxing Queue Management System**  
**CPE 334 Introduction to Software Engineering in the Age of AI Agents (Semester 1/2026)**  
**เวอร์ชันเอกสาร:** v1.4 | **สถานะ:** เสนอเพื่อขออนุมัติและเริ่มขั้นตอน TDD  
**ผู้จัดทำ:** นายธีรวัฒญ์ รุ่งสว่าง (67070507206) & นายอภิวัชร์ ปัณฐธนาพัฒน์ (67070507209)  
**เอกสารอ้างอิงหลัก:**
- [`docs/PopQueue_Deliverable_1_Master.md`](../../PopQueue_Deliverable_1_Master.md) (Part A §5–§8, Part B §1–§2, Part C §1–§6, Part E §2, Part F §3–§5)
- Course Handout: Deliverable 1 Engineering Baseline and Working Sprint 1 (§3.5, §4.2, Rubric Part E & F)
- Course Handout: Group Work Specification (Theme 9 Requirements)
- Course Handout: Lecture 10 Spec-Driven Development (SDD & TDD Workflows)

---

## 📋 ประวัติการแก้ไขแผนงาน (Revision History & Justified Changes)

| เวอร์ชัน | วันที่ | หัวข้อที่แก้ไขและเหตุผลทางวิศวกรรม | ผู้เสนอ / ผู้ทบทวน |
| :---: | :---: | :--- | :--- |
| **v1.0** | 2026-11-02 | ร่างแผนการทำงาน F-02 ครอบคลุม AC-09..18, Raw SQL Atomic Increment, และ STS | Theerawat |
| **v1.1** | 2026-11-02 | ปรับปรุงมาตรการ Concurrency, ย้ายการดักจับ P2002 นอก Transaction, ตัด Application Pre-check, และปรับลำดับ TDD Log | Theerawat (AI-assisted plan review – บันทึกใน AI-use declaration) |
| **v1.2** | 2026-11-02 | ปรับปรุง STS ใน Master Doc (CHG-09 ก่อน Red Commit), แนะนำการเซฟ Log UTF-8, คง export app, และตั้ง connection_limit=20 | Theerawat (AI-assisted plan review) |
| **v1.3** | 2026-11-02 | ปรับปรุง Safety Guards และความถูกต้องของการรันจริง (CHG-09 Final) | Theerawat (AI-assisted plan review) |
| **v1.4** | 2026-11-02 | **แก้ไขลำดับ Stability Log และ Safety Guard ให้รัดกุม (CHG-09 Strict Alignment):**<br/>1. ย้ายการรัน Stability Test 5 รอบไปไว้ **หลัง** Green Commit เพื่อให้ SHA ใน `i03-stability-log.txt` ตรงกับ Commit ที่ผ่านการทดสอบจริงตาม Handout §4.2 และ Master §2.11<br/>2. ปรับ Safety Guard ใน `resetQueueState()` ให้แกะ `pathname` ผ่าน `new URL()` และตรวจเฉพาะ `endsWith('_test')` พร้อมพิมพ์เฉพาะชื่อฐานข้อมูล ป้องกัน Credential Leak ลงใน Log/PDF ตาม Handout §4.4 | Theerawat (AI-assisted plan review) |

---

## 1. บทนำและบริบทความสอดคล้องกับข้อกำหนด (Context & Traceability Alignment)

### 1.1 วัตถุประสงค์ของ Issue I-03
Issue I-03 รับผิดชอบการพัฒนาฟีเจอร์หลักลำดับที่สองของ Sprint 1 คือ **Feature F-02: Queue Discovery & Safe Joining** ซึ่งเป็นหัวใจสำคัญของระบบคิวเสมือนหน้าร้าน (On-site Virtual Waiting Line) สำหรับ Art Toy Live Unboxing Station โดยเปิดให้:
1. **Public / Collector:** ตรวจดูสถานะของซีรีส์ทั้งหมด (`CRY`, `LAB`, `SKP`) พร้อมจำนวนคิวที่กำลังรอรับบริการในวันปัจจุบันแบบ Real-time (`waitingCount`) โดยปราศจากการเปิดเผยข้อมูลส่วนบุคคล (Privacy-preserving)
2. **Collector (ผู้ใช้งานที่ผ่านการยืนยันตัวตน):** กดขอรับบัตรคิวสำหรับซีรีส์ที่เปิดให้บริการ โดยระบบต้องรับประกัน **ลำดับเลขคิวต่อเนื่องรายวันรายซีรีส์ที่ปลอดภัย ไม่ซ้ำ ไม่ข้าม (Gapless & Duplicate-Free Sequential Numbering)**
3. **Database Guardrails:** บังคับกฎห้ามถือตั๋ว Active ซ้ำซ้อน (1 ผู้ใช้ต่อ 1 ตั๋ว Active ทั้งระบบ) และห้ามขอรับตั๋วในซีรีส์ที่ปิดให้บริการ (`isActive = false`) อย่างเด็ดขาดในระดับ ACID Transaction และ Database Partial Index

### 1.2 ตารางการสอบกลับข้อกำหนด (Requirements Traceability Matrix)

| Requirement ID | รายละเอียดข้อกำหนด | แหล่งที่มา (Traceability Source) | Acceptance Criteria | Software Test Spec |
| :---: | :--- | :--- | :---: | :---: |
| **FR-03** | ดูรายการซีรีส์ทั้งหมด สถานะเปิด/ปิด และจำนวนคิวรอ (`waitingCount`) ของวันนี้ โดยไม่ต้องยืนยันตัวตน | Master Part A §5, Theme 9 §1.1 | **AC-09** | **TEST-09** |
| **FR-04** | Collector กดรับบัตรคิวของซีรีส์ที่เปิดอยู่ ได้เลขคิวรายวันเฉพาะซีรีส์ (เช่น `CRY-001`) ในสถานะ `WAITING` | Master Part A §5, Theme 9 §1.1 | **AC-10, AC-12, AC-13** | **TEST-10, TEST-12, TEST-13** |
| **BR-01** | **Safe Sequential Numbering:** เลขคิวเริ่ม 1 ต่อเนื่อง ไม่ซ้ำ ไม่ข้าม รีเซ็ตเที่ยงคืนเวลาไทย (`Asia/Bangkok`) เลขของตั๋วที่ออกจากคิวแล้วไม่ถูกนำกลับมาใช้ซ้ำ | Master Part A §6, Decision D-10 | **AC-10, AC-15, AC-17, AC-18** | **TEST-10, TEST-15, TEST-17, TEST-17U, TEST-18** |
| **BR-02** | **Single Active Ticket per User:** ผู้ใช้ 1 คนมีตั๋วสถานะ `WAITING/CALLED/UNBOXING` ได้ไม่เกิน 1 ใบทั้งระบบ บังคับที่ Database Engine | Master Part A §6, Deliverable 1 §3.5 | **AC-11, AC-16** | **TEST-11, TEST-16** *(เตรียมเป็น Excerpt 1 ใน Part F §4)* |
| **BR-04** | **Role Separation:** Box Master ห้ามเรียกคำสั่งขอรับบัตรคิว (`POST /api/tickets/join`) หากเรียกต้องถูกปฏิเสธด้วย 403 `FORBIDDEN_ROLE` | Master Part A §6, Part C §7 | **AC-14** | **TEST-14** |
| **BR-09** | **Closed Series Enforcement:** ซีรีส์ที่ `isActive = false` (เช่น `SKP`) ต้องปฏิเสธการขอรับตั๋วใหม่ด้วย 409 `SERIES_CLOSED` | Master Part A §6, Change CHG-01 | **AC-12** | **TEST-12** |
| **NFR-02** | ปฏิเสธคำขอที่ไม่มี Token หรือ Token ผิดรูปด้วย 401 `UNAUTHENTICATED` โดยไม่รั่วไหลข้อมูล | Master Part A §7, Handout §3.5 | **AC-04, AC-14** | **TEST-04, TEST-14** |
| **NFR-03** | **Multi-User Concurrency (BR-01 Verification):** 50 บัญชีส่งคำขอ join พร้อมกัน ได้ 201 ทั้งหมด ได้เลข 1..50 ไม่ซ้ำ ไม่ข้าม | Master Part A §7, Handout §3.5 | **AC-15** | **TEST-15** |
| **NFR-04** | **Single-User Race (BR-02 Verification):** 1 บัญชีส่ง 10 คำขอ join พร้อมกัน ได้ 201 หนึ่งครั้ง และได้ 409 อีกเก้าครั้ง ตั๋วใน DB มีใบเดียว | Master Part A §7, Handout §3.5 | **AC-16** | **TEST-16** |
| **A-01** | Timezone ล็อกเป็น `Asia/Bangkok (UTC+7)` เลขคิวรีเซ็ตเที่ยงคืนเวลาไทย และทดสอบได้ด้วย FakeClock | Master Part A §4, Part C §4 | **AC-17** | **TEST-17, TEST-17U** |

---

## 2. หลักฐานและเหตุผลการออกแบบทางสถาปัตยกรรม (Architectural Justifications & Concurrency Proof)

### 2.1 ข้อจำกัดของ `prisma.queueCounter.upsert` (Decision D-10 & CHG-06)
ในระบบที่ต้องรับประกันเลขคิวแบบต่อเนื่องไม่ซ้ำและไม่ข้ามภายใต้สภาวะโหลดพร้อมเพรียงสูง (High Concurrency: NFR-03, NFR-04) สถาปัตยกรรมระดับ Database Access Layer มีความสำคัญสูงสุด:

> [!CAUTION]
> **เหตุผลที่ไม่สามารถใช้ `prisma.queueCounter.upsert` ได้ (Decision D-10 ใน Master):**
> *ฟังก์ชัน `prisma.queueCounter.upsert()` ไม่รับประกัน atomic increment ภายใต้ race conditions* เนื่องจาก Prisma ORM อาจใช้วิธี **Select-then-Write ในบางเงื่อนไข** หากมี 2 คำขอขึ้นไปเข้ามาพร้อมกันในแถวที่ยังไม่มีข้อมูล ทั้งคู่มีโอกาสค้นหาไม่เจอและพยายามยิง `INSERT` พร้อมกัน ส่งผลให้คำขอหนึ่งถูก PostgreSQL ปฏิเสธด้วย Unique Constraint Violation (`P2002`) และทำให้คำขอของผู้ใช้กลายเป็น Unhandled Exception 500 ทันที

### 2.2 โซลูชันระดับเอนจิน: Atomic Upsert via Raw SQL with Row-Level Locking
เราแก้ปัญหาด้วยคำสั่ง SQL Native ระดับ PostgreSQL รันผ่าน `tx.$queryRaw` ภายใต้ **Prisma Interactive Transaction (`prisma.$transaction`)**:

```sql
INSERT INTO "QueueCounter" ("id", "seriesId", "queueDate", "lastNumber")
VALUES (gen_random_uuid()::text, $1, $2::date, 1)
ON CONFLICT ("seriesId", "queueDate")
DO UPDATE SET "lastNumber" = "QueueCounter"."lastNumber" + 1
RETURNING "lastNumber";
```

#### การพิสูจน์เชิงวิศวกรรม (Engineering Proof of Correctness):
1. **Row-Level Exclusive Lock:** กลไก `ON CONFLICT DO UPDATE` ของ PostgreSQL ดำเนินการแบบ Atomic Command คำขอแรกที่เข้าถึงแถว `(seriesId, queueDate)` จะถือ Exclusive Lock (X-Lock) บนแถวดังกล่าว
2. **Strict Serialization of Increments:** คำขอถัดไปที่เข้ามาพร้อมกัน (Concurrent Requests) จะถูกจัดคิวรอในระดับฐานข้อมูล (Wait for lock) จนกว่า Transaction แรกจะ Commit หรือ Rollback ทำให้ค่า `lastNumber` ถูกบวกเพิ่มทีละ 1 เสมอ
3. **Rollback Protection (No Gaps Guarantee):** คำสั่ง `INSERT INTO "QueueTicket"` ทำงานอยู่ใน Transaction เดียวกัน หากเกิดข้อผิดพลาดใดๆ หลังจากออกเลข (เช่น ชน Partial Index `unique_active_ticket_user` จากคำขออื่นของผู้ใช้คนเดียวกันที่ชิง Commit ไปก่อน) Transaction ทั้งหมดจะถูก **ROLLBACK** คืนสภาพทันที ส่งผลให้แถว `QueueCounter` ไม่บันทึกค่าที่บวกเพิ่ม จึงไม่มีการเกิดช่องว่างของเลขคิว (Gapless Guarantee ตาม BR-01)

### 2.3 การป้องกันการถือตั๋วซ้ำซ้อนด้วย Partial Unique Index (BR-02) และไม่มี Pre-check
* ใน Migration `0002_partial_unique_indexes` ได้สร้างดัชนีพิเศษ:
  ```sql
  CREATE UNIQUE INDEX unique_active_ticket_user ON "QueueTicket"("userId")
  WHERE status IN ('WAITING', 'CALLED', 'UNBOXING');
  ```
* **ทำไมต้องไม่มี Application Pre-check:** ตามที่ระบุใน Master §2.3 ข้อ 3 เรา **ไม่ใส่โค้ด `findFirst` เพื่อเช็คตั๋ว Active ล่วงหน้า** เพราะในสภาวะ Race Condition (เช่น 10 คำขอยิงเข้ามาพร้อมกัน) การเช็คระดับ Application จะผ่านทั้งหมดเพราะยังไม่มีตั๋วใน DB การพึ่งพา Database Partial Unique Index ร่วมกับ Transaction Rollback ล้วนๆ คือวิธีเดียวที่รับประกันความถูกต้อง 100% และทำให้การทดสอบ TEST-16 สามารถพิสูจน์กลไก Rollback ของ Database Engine ได้จริง
* **การเสริม Assertion ใน TEST-16 (CHG-09):** ตรวจสอบว่าหลังจากส่ง 10 คำขอพร้อมกันสำเร็จ 1 คำขอ (201) และล้มเหลว 9 คำขอ (409) ค่า `QueueCounter.lastNumber` ในฐานข้อมูลต้องมีค่าเท่ากับ **1** เท่านั้น เพื่อพิสูจน์ว่า 9 คำขอที่ชน Index ถูก Rollback สมบูรณ์โดยไม่กินเลขคิวไป

### 2.4 การดักจับและแปลง Prisma Error `P2002` นอก `$transaction`
> [!IMPORTANT]
> **หลักการ PostgreSQL Transaction State:** เมื่อเกิด Unique Constraint Violation ภายใน Transaction ของ PostgreSQL ตัวฐานข้อมูลจะตั้งสถานะ Transaction เป็น **Aborted** ทันที หากเราพยายามดักจับ Error ภายใน Callback ของ `$transaction` คำสั่งถัดไปจะไม่สามารถรันได้ ดังนั้น **ต้องครอบ `prisma.$transaction(...)` ด้วย `try/catch` ที่ภายนอกเท่านั้น**

```typescript
// server/src/services/ticket.service.ts
try {
  return await prisma.$transaction(
    async (tx) => {
      // 1. Check series existence & isActive
      // 2. Atomic increment QueueCounter via $queryRaw
      // 3. tx.queueTicket.create(...)
    },
    { maxWait: 10000, timeout: 15000 } // รองรับคิวรอ Lock 50 คำขอ
  );
} catch (err: unknown) {
  if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
    const target = String(err.meta?.target || '');
    if (target.includes('unique_active_ticket_user') || target.includes('userId')) {
      throw new AppError(409, 'DUPLICATE_ACTIVE_QUEUE', 'User already has an active ticket');
    }
    // Constraint อื่นที่ไม่รู้จัก โยนให้ตก 500 INTERNAL_ERROR (ห้ามกลบเป็น 409)
  }
  throw err;
}
```

```mermaid
sequenceDiagram
    autonumber
    actor C as Collector Client
    participant API as Join Controller
    participant Svc as Ticket Service
    participant DB as PostgreSQL (Prisma tx)
    
    C->>API: POST /api/tickets/join { seriesId }
    Note over API: 1) Auth Check (401)<br/>2) Role Guard (403 COLLECTOR)<br/>3) Zod Validation (400)
    API->>Svc: joinQueue(userId, seriesId)
    
    Svc->>DB: prisma.$transaction(async (tx) => { ... }, { maxWait: 10s, timeout: 15s })
    DB->>DB: Check Series Exists & isActive
    alt Series not found
        DB-->>Svc: null
        Svc-->>API: throw AppError(404, 'RESOURCE_NOT_FOUND')
        API-->>C: 404 RESOURCE_NOT_FOUND
    else Series isActive === false
        DB-->>Svc: { isActive: false }
        Svc-->>API: throw AppError(409, 'SERIES_CLOSED')
        API-->>C: 409 SERIES_CLOSED
    end

    Note over DB: Raw SQL: INSERT ... ON CONFLICT DO UPDATE RETURNING lastNumber<br/>Acquires Row Lock on (seriesId, queueDate)
    DB->>DB: Atomic Counter Increment
    
    Note over DB: INSERT INTO "QueueTicket"<br/>Checks Partial Index: unique_active_ticket_user
    alt User has active ticket (Concurrent collision)
        DB-->>Svc: P2002 Unique Constraint Violation
        Note over DB: Transaction ROLLBACK (lastNumber restored!)
        Note over Svc: Catch P2002 OUTSIDE $transaction<br/>Maps to DUPLICATE_ACTIVE_QUEUE
        Svc-->>API: throw AppError(409, 'DUPLICATE_ACTIVE_QUEUE')
        API-->>C: 409 DUPLICATE_ACTIVE_QUEUE
    else Success
        DB-->>Svc: Created QueueTicket
        Note over DB: Transaction COMMIT
        Svc-->>API: Ticket details (displayNumber: "CRY-001")
        API-->>C: 201 Created { ticketId, displayNumber, ... }
    end
```

### 2.5 การฉีด Clock สำหรับทดสอบ (Clock Dependency Injection)
เพื่อให้ `TEST-17` สามารถทดสอบการข้ามเที่ยงคืนได้โดยไม่ต้องรอเวลาจริง:
1. ปรับปรุง `createApp` ใน `server/src/app.ts`:
   ```typescript
   export interface AppOptions {
     clock?: Clock;
   }
   export function createApp(options: AppOptions = {}): Express
   export const app = createApp(); // คง export เดิมไว้เพื่อไม่ให้เทสต์เดิมพัง
   ```
2. ส่ง `clock` ไปยัง `seriesRouter` และ `ticketRouter` โดยหากไม่ได้ระบุจะใช้ `defaultClock` (`SystemClock`) เป็นค่าเริ่มต้น

---

## 3. รายละเอียดข้อกำหนด API สัญญาระบบ (API Contract Specifications)

### 3.1 Endpoint 1: ค้นหารายการซีรีส์และจำนวนคิวรอ (Queue Discovery)
* **เส้นทาง (Route):** `GET /api/series`
* **การเข้าถึง (Access):** Public (ไม่ต้องมี Authorization Header หรือมีก็ได้)
* **การทำงาน:**
  1. ดึงข้อมูลซีรีส์ทั้งหมดจากตาราง `Series` โดยเรียงตาม `createdAt ASC`
  2. คำนวณ `waitingCount` สำหรับแต่ละซีรีส์จากตาราง `QueueTicket` เฉพาะแถวที่:
     - `seriesId` ตรงกัน
     - `status = 'WAITING'`
     - `queueDate = getQueueDateAsDate(clock.now())` (ล็อกเวลาปัจจุบันตาม Timezone Asia/Bangkok)
  3. ไม่ส่งคืนข้อมูลส่วนบุคคลใดๆ ของลูกค้า
* **Response 200 OK:**
  ```json
  {
    "data": [
      {
        "id": "c1a2b3c4-0000-4000-8000-000000000001",
        "code": "CRY",
        "name": "Crybaby Sunset Concert",
        "isActive": true,
        "waitingCount": 3
      },
      {
        "id": "c1a2b3c4-0000-4000-8000-000000000002",
        "code": "LAB",
        "name": "Labubu Macaron",
        "isActive": true,
        "waitingCount": 0
      },
      {
        "id": "c1a2b3c4-0000-4000-8000-000000000003",
        "code": "SKP",
        "name": "Skullpanda Closed Demo",
        "isActive": false,
        "waitingCount": 0
      }
    ]
  }
  ```

### 3.2 Endpoint 2: ขอรับบัตรคิวอย่างปลอดภัย (Safe Queue Joining)
* **เส้นทาง (Route):** `POST /api/tickets/join`
* **การเข้าถึง (Access):** Protected – เฉพาะผู้ใช้ที่มี Role `COLLECTOR` เท่านั้น
* **Headers:** `Authorization: Bearer <JWT>`
* **Request Body (JSON):**
  ```json
  {
    "seriesId": "c1a2b3c4-0000-4000-8000-000000000001"
  }
  ```
  *(หมายเหตุสำคัญ: ไม่รับ `userId` จาก Request Body โดยเด็ดขาด ค่า `userId` ต้องดึงมาจาก `req.user.id` ใน Token เท่านั้น)*
* **Response 201 Created:**
  ```json
  {
    "data": {
      "ticketId": "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d",
      "displayNumber": "CRY-001",
      "queueNumber": 1,
      "queueDate": "2026-11-08",
      "status": "WAITING",
      "seriesName": "Crybaby Sunset Concert",
      "createdAt": "2026-11-08T09:30:00.000Z"
    }
  }
  ```
* **Error Responses (โครงสร้าง `{ error: { code, message, statusCode } }`):**
  - `400 Bad Request` (`VALIDATION_ERROR`): Body ขาด `seriesId` หรือไม่ใช่ UUID รูปแบบที่ถูกต้อง
  - `401 Unauthorized` (`UNAUTHENTICATED`): ไม่มี Token, Token หมดอายุ, หรือ Token ถูกเพิกถอน
  - `403 Forbidden` (`FORBIDDEN_ROLE`): บัญชีผู้ใช้มี Role เป็น `BOX_MASTER`
  - `404 Not Found` (`RESOURCE_NOT_FOUND`): ไม่พบซีรีส์ที่ระบุในฐานข้อมูล
  - `409 Conflict` (`SERIES_CLOSED`): ซีรีส์ปิดรับคิว (`isActive === false`)
  - `409 Conflict` (`DUPLICATE_ACTIVE_QUEUE`): ผู้ใช้มีตั๋ว Active (`WAITING`, `CALLED`, `UNBOXING`) อยู่แล้วในระบบ

---

## 4. แผนการทดสอบเชิงลึก (Software Test Specification: TEST-09 ถึง TEST-18)

| Test ID | ตรวจ AC | ระดับ | Precondition / Fixture | การกระทำ (Action) | ผลลัพธ์ที่คาดหวัง (Expected Assertion) | ไฟล์ทดสอบเป้าหมาย |
| :---: | :---: | :---: | :--- | :--- | :--- | :--- |
| **TEST-09** | AC-09 | Integration | Seed 3 ซีรีส์ (CRY, LAB, SKP); สร้างตั๋ว WAITING ของ CRY 3 ใบสำหรับวันนี้โดยใช้ผู้ใช้ 3 คน (`collector1..3`) | ยิง `GET /api/series` โดยไม่ส่ง Authorization Header | 200 OK; รายการซีรีส์ครบ 3 ตัว; CRY มี `waitingCount = 3`; LAB มี `waitingCount = 0`; SKP มี `isActive = false`; ไม่มีฟิลด์ส่วนตัวผู้ใช้ | `tests/api/series.test.ts` |
| **TEST-10** | AC-10 | Integration | Collector `collector1` ไม่มีตั๋ว Active ในระบบ; ซีรีส์ CRY ว่าง | ยิง `POST /api/tickets/join` ด้วย `{ seriesId: CRY }` | 201 Created; `displayNumber: "CRY-001"`; `queueNumber: 1`; `status: "WAITING"`; ใน DB มีตั๋วผูกกับ `userId` ของ `collector1` | `tests/api/join.test.ts` |
| **TEST-11** | AC-11 | Integration | `collector1` ถือตั๋ว CRY สถานะ WAITING อยู่แล้ว | (ก) ส่ง join ซีรีส์ CRY ซ้ำ<br/>(ข) ส่ง join ซีรีส์ LAB | ทั้งสองคำขอได้ 409 `DUPLICATE_ACTIVE_QUEUE`; ตั๋ว Active ใน DB มีเพียง 1 ใบเท่าเดิม; ค่า `lastNumber` ใน `QueueCounter` ไม่เพิ่ม | `tests/api/join.test.ts` *(TDD Red $\rightarrow$ Green)* |
| **TEST-12** | AC-12 | Integration | ซีรีส์ SKP มีสถานะ `isActive = false` | `collector1` ยิง join ซีรีส์ SKP | 409 `SERIES_CLOSED`; ไม่มีการสร้างแถวตั๋ว SKP ใน DB; `QueueCounter` ของ SKP ไม่ถูกสร้าง | `tests/api/join.test.ts` |
| **TEST-13** | AC-13 | Integration | Collector ล็อกอินปกติ | (ก) ยิง join ด้วย UUID สุ่มที่ไม่มีในระบบ<br/>(ข) ยิง join ด้วย body ว่าง `{}`<br/>(ค) ยิง join ด้วย `{ seriesId: "invalid-uuid" }` | (ก) 404 `RESOURCE_NOT_FOUND`<br/>(ข) 400 `VALIDATION_ERROR`<br/>(ค) 400 `VALIDATION_ERROR` | `tests/api/join.test.ts` |
| **TEST-14** | AC-14 | Integration | มีบัญชี Box Master (`staff_crybaby`) และ Request Unauthenticated | (ก) Box Master ยิง `POST /api/tickets/join`<br/>(ข) ยิงโดยไม่มี Token | (ก) 403 `FORBIDDEN_ROLE`<br/>(ข) 401 `UNAUTHENTICATED`<br/>ไม่มีตั๋วใหม่ถูกสร้างขึ้น | `tests/api/join.test.ts` & `tests/security/unauthenticated.test.ts` |
| **TEST-15** | AC-15 | Concurrency | Fixture สร้าง Collector ชั่วคราว 50 บัญชี และสร้าง Token ด้วย `signTestToken`; ซีรีส์ CRY ว่าง | ยิง `Promise.all` ส่ง 50 join requests เข้ามาพร้อมกัน | คำขอทั้ง 50 ได้ 201 Created ทั้งหมด; เซตของ `queueNumber` คือ `{1, 2, ..., 50}` สมบูรณ์ **ไม่ซ้ำ และไม่ข้าม**; `QueueCounter.lastNumber = 50` | `tests/concurrency/numbering.test.ts` *(TDD Red $\rightarrow$ Green)* |
| **TEST-16** | AC-16 | Concurrency | Collector `collector2` ไม่มีตั๋ว Active | ยิง `Promise.all` ส่ง 10 join requests พร้อมกันด้วย Token เดียวกัน | ได้รับ 201 Created เพียง **1 คำขอ**; อีก **9 คำขอ** ได้รับ 409 `DUPLICATE_ACTIVE_QUEUE`; ตั๋ว Active ใน DB มีเพียง 1 แถว; **และ `QueueCounter.lastNumber = 1`** | `tests/concurrency/duplicate.test.ts` *(เตรียม Code Excerpt 1)* |
| **TEST-17U**| AC-17 | Unit (Charac.) | ค่า Date จำลอง: 16:59:59Z และ 17:00:00Z | เรียก `getQueueDate(date)` | 16:59:59Z ได้วันที่เดิม (23:59:59+07); 17:00:00Z ได้วันใหม่ (00:00:00+07) ถูกต้องตาม `Asia/Bangkok` (มีแล้วใน `clock.test.ts` จาก I-01) | `tests/unit/queue-date.test.ts` *(Characterization)* |
| **TEST-17** | AC-17 | Integration | ใช้ `FakeClock`: จุดเวลา 23:59:59+07 และเลื่อนเวลาเป็น 00:00:01+07 ของวันถัดไป ผ่าน `createApp({ clock })` | Collector คนที่ 1 join ก่อนเที่ยงคืน; Collector คนที่ 2 join หลังเที่ยงคืน | Collector คนที่ 1 ได้เลขสุดท้ายของวันเดิม; Collector คนที่ 2 ได้เลข `001` และ `queueDate` วันใหม่ | `tests/api/queue-reset.test.ts` |
| **TEST-18** | AC-18 | Boundary | สร้างตั๋ว `CRY-001` แล้วอัปเดตสถานะเป็น `COMPLETED` ผ่าน DB Fixture | Collector คนถัดไปยิง join ซีรีส์ CRY | ได้รับ 201 Created หมายเลข `CRY-002` (ไม่นำเลข 001 กลับมาใช้ใหม่ แม้จะออกจากคิวแล้ว) | `tests/api/join.test.ts` |

---

## 5. กลยุทธ์การทดสอบและความเสถียรของสภาพแวดล้อม (Test Stability Strategy)

### 5.1 การตัดปัญหาการแย่งฐานข้อมูล (State Isolation & File Parallelism)
* **ปัญหา:** ค่าปริยายของ Vitest จะรันแต่ละ Test File พร้อมกัน (Concurrency across files) ทำให้ตาราง `QueueTicket` และ `QueueCounter` ชนกัน
* **การแก้ไข:**
  1. ใน `server/vitest.config.ts`: เพิ่ม `fileParallelism: false`, `testTimeout: 30000`, และ `retry: 0`
  2. ใน `server/tests/helpers/queue-helper.ts`: สร้างฟังก์ชัน `resetQueueState()` พร้อม Safety Guard:
     ```typescript
     export async function resetQueueState(): Promise<void> {
       const dbUrl = process.env.DATABASE_URL ?? '';
       let dbName = '';
       try {
         dbName = new URL(dbUrl).pathname.replace('/', '');
       } catch {
         throw new Error('resetQueueState() refused: invalid or missing DATABASE_URL');
       }

       if (!dbName.endsWith('_test')) {
         throw new Error(`resetQueueState() refused: database "${dbName}" is not a test database`);
       }

       await prisma.queueTicket.deleteMany({});
       await prisma.queueCounter.deleteMany({});
       await prisma.user.deleteMany({
         where: { username: { startsWith: 'synthetic_collector_' } }
       });
     }
     ```
  3. เรียก `resetQueueState()` ใน `beforeEach` และ `afterAll` ของทุก Test File ที่เกี่ยวกับคิว

### 5.2 การปรับแต่ง Connection Pool และ Transaction Limits
1. ใน `server/.env` สำหรับการทดสอบ (`DATABASE_URL_TEST`):
   ```
   DATABASE_URL_TEST=postgresql://popqueue:popqueue_dev_password@localhost:5432/popqueue_test?connection_limit=20
   ```
   *(ตั้ง `connection_limit=20` ปลอดภัยต่อเพดาน `max_connections` ของ PostgreSQL)*
2. ใน `server/src/services/ticket.service.ts`: กำหนด `{ maxWait: 10000, timeout: 15000 }` ใน `$transaction`
3. ใน `server/tests/concurrency/numbering.test.ts`: สร้าง Token ทั้ง 50 บัญชีด้วยฟังก์ชัน `signTestToken` ของ `auth-helper.ts` (ลงนาม JWT โดยตรง ไม่ผ่าน HTTP Login ซ้ำ 50 ครั้ง เพื่อไม่ให้ติด Bcrypt CPU bottleneck)
4. **คำสั่งรัน Concurrency Stability 5 รอบ พร้อมบันทึกผลลง Evidence (PowerShell + cmd):**
   ```powershell
   # กำหนด Header SHA สำหรับไฟล์หลักฐาน Stability (อ้างอิง Green Commit SHA)
   git rev-parse HEAD | Out-File -Encoding utf8 docs/evidence/i03-stability-log.txt
   
   1..5 | ForEach-Object {
     $iteration = $_
     Write-Host "--- Concurrency Run #$iteration ---" -ForegroundColor Cyan
     "=== RUN ITERATION $iteration ===" | Out-File -Encoding utf8 -Append docs/evidence/i03-stability-log.txt
     
     cmd /c "set NO_COLOR=1 && npx vitest run tests/concurrency >> docs\evidence\i03-stability-log.txt 2>&1"
     if ($LASTEXITCODE -ne 0) {
       throw "Concurrency run failed on iteration $iteration (logged in docs/evidence/i03-stability-log.txt)"
     }
   }
   ```

---

## 6. ขั้นตอนการปฏิบัติงานแบบ TDD (Step-by-Step TDD Sequence)

```mermaid
flowchart TD
    S0["Step 0: Checkout sprint-1-staging & Branch feature/i03-join"] --> S0A["Step 0A: Record CHG-09 in Master Doc (Contract-First SDD) & Commit"]
    S0A --> S1["Step 1: Stubs, Reset Helper, Protected-Routes & Regression Check"]
    S1 --> S2["Step 2: Write Failing Tests (Red Phase: TEST-09..18)"]
    S2 --> S2A["Git Commit Red: test(join): add failing tests for F-02 AC-09..18 [RED]"]
    S2A --> S2B["Capture Red Log with Commit SHA (docs/evidence/i03-red-test-log.txt)"]
    S2B --> S3["Step 3: Implement Services, Raw SQL & Controller (Green Phase)"]
    S3 --> S4A["Step 4A: Local Verification (npm test, build, lint)"]
    S4A --> S4B["Step 4B: Git Commit Green: feat(join): implement F-02 queue discovery & safe joining [GREEN]"]
    S4B --> S4C["Step 4C: Capture Green Log with Tested Commit SHA (docs/evidence/i03-green-test-log.txt)"]
    S4C --> S4D["Step 4D: Multi-Run Stability Tests 5x with Tested Commit SHA (docs/evidence/i03-stability-log.txt)"]
    S4D --> S4E["Step 4E: Git Commit Evidence Logs (docs(i03): capture green test and stability evidence)"]
    S4E --> S5["Step 5: Code Excerpt 1 Preparation & Clean Push to feature/i03-join"]
    S5 --> S6["Step 6: Open PR & Request Peer Review"]
```

### รายละเอียดขั้นตอนการปฏิบัติการ:

#### ขั้นที่ 0: การเตรียม Git Branch และบันทึก Contract Revision (CHG-09)
1. สลับไปยัง `sprint-1-staging` และดึงการเปลี่ยนแปลงล่าสุด (`git pull origin sprint-1-staging`) เพื่อให้ได้ Commit ล่าสุด (`37768e2`)
2. สร้าง Branch ใหม่: `feature/i03-join` แตกออกจาก `sprint-1-staging`
3. **บันทึก CHG-09 ใน `docs/PopQueue_Deliverable_1_Master.md` (Contract-First SDD):**
   - เพิ่มแถว CHG-09 ใน Part B §2
   - เพิ่มแถว v0.2.3 ใน Part E §0
   - ปรับ STS ใน Part E §2.10 (TEST-16 เพิ่ม assertion `lastNumber = 1`, TEST-17U เป็น Characterization)
4. ทำการ Commit เอกสารสัญญาก่อนเริ่มโค้ด:
   `docs(i03): record CHG-09 contract revision and issue I-03 implementation plan`

#### ขั้นที่ 1: การลงทะเบียน Protected Routes, Stubs, Helper และ Regression Check
1. ขยายตาราง `server/tests/helpers/protected-routes.ts`:
   ```typescript
   {
     method: 'POST',
     path: '/api/tickets/join',
     description: 'Join queue for a series',
     body: { seriesId: '00000000-0000-0000-0000-000000000000' },
     addedInIssue: 'I-03'
   }
   ```
2. สร้าง Helper `server/tests/helpers/queue-helper.ts` สำหรับ `resetQueueState()` พร้อม Safety Guard
3. สร้าง Stubs ใน `server/src/routes/series.routes.ts` และ `ticket.routes.ts` (ส่ง 501 Not Implemented)
4. อัปเดต `server/src/app.ts` ให้รับ `AppOptions { clock?: Clock }` โดย **คง `export const app = createApp()`** ไว้
5. **รัน Regression Check:** รัน `npm test` เพื่อยืนยันว่าชุดเทสต์เดิมทั้งหมดตามผลรันจริงบนสภาพแวดล้อมยังเป็นสีเขียว 100% ก่อนเริ่มเขียน Red Test ใหม่

#### ขั้นที่ 2: การเขียนชุดทดสอบที่ล้มเหลว (Red Phase)
1. สร้างไฟล์ทดสอบครบทุกหมวด:
   - `server/tests/api/series.test.ts` (TEST-09)
   - `server/tests/api/join.test.ts` (TEST-10, 11, 12, 13, 14, 18)
   - `server/tests/concurrency/numbering.test.ts` (TEST-15)
   - `server/tests/concurrency/duplicate.test.ts` (TEST-16)
   - `server/tests/unit/queue-date.test.ts` (TEST-17U – Characterization)
   - `server/tests/api/queue-reset.test.ts` (TEST-17)
2. ทำการ Commit Git ในสถานะ Red:
   `test(join): add failing tests for F-02 AC-09..18 (TEST-09..18) [RED]`
3. รันคำสั่งทดสอบ `npm test` เพื่อตรวจสอบว่าล้มเหลวแบบ Assertion Failure (501 แทน 200/201) และบันทึก Log ที่มี Commit SHA กำกับบรรทัดแรกอย่างปลอดภัยปราศจาก PowerShell noise:
   ```powershell
   git rev-parse HEAD | Out-File -Encoding utf8 docs/evidence/i03-red-test-log.txt
   cmd /c "set NO_COLOR=1 && npm test >> docs\evidence\i03-red-test-log.txt 2>&1"
   ```
4. ตรวจสอบไฟล์ `docs/evidence/i03-red-test-log.txt` ว่าอ่านได้สะอาดตาและบันทึก Commit SHA
5. Commit ไฟล์ Log:
   `docs(i03): capture red test execution evidence for F-02`

#### ขั้นที่ 3: การพัฒนาฟังก์ชันการทำงานจริง (Green Phase)
1. **Validation Layer:** สร้าง Zod Schema ใน `server/src/schemas/ticket.schema.ts`
2. **Service Layer:**
   - `server/src/services/series.service.ts`: ดึงรายการซีรีส์และนับ `waitingCount`
   - `server/src/services/ticket.service.ts`: ดำเนินการ Atomic Increment ผ่าน Raw SQL ใน Interactive Transaction และดักจับ `P2002` ที่ภายนอก Transaction
3. **Controller & Route Layer:**
   - สร้าง `series.controller.ts` และ `ticket.controller.ts` ผูก Role Guard `requireRole(['COLLECTOR'])`

#### ขั้นที่ 4: การตรวจสอบความถูกต้องและเสถียรภาพ (Green Verification & Stability)
1. รันคำสั่งทดสอบ `npm test` เพื่อตรวจสอบว่าผ่าน 100%
2. ตรวจสอบ Typecheck (`npm run build`) และ Lint (`npm run lint`) ปราศจาก Warning/Error
3. ทำการ Commit Git ในสถานะ Green (Tested Commit):
   `feat(join): implement F-02 queue discovery & safe joining [GREEN]`
4. บันทึก Log เขียวที่มี Tested Commit SHA กำกับบรรทัดแรก:
   ```powershell
   git rev-parse HEAD | Out-File -Encoding utf8 docs/evidence/i03-green-test-log.txt
   cmd /c "set NO_COLOR=1 && npm test >> docs\evidence\i03-green-test-log.txt 2>&1"
   ```
5. **Multi-Run Stability Check (5 รอบ):** รัน Concurrency Test 5 รอบต่อเนื่อง พร้อมบันทึกลง `docs/evidence/i03-stability-log.txt` (บรรทัดแรกกำกับด้วย Tested Commit SHA เดียวกัน):
   ```powershell
   git rev-parse HEAD | Out-File -Encoding utf8 docs/evidence/i03-stability-log.txt
   1..5 | ForEach-Object {
     "=== RUN ITERATION $_ ===" | Out-File -Encoding utf8 -Append docs/evidence/i03-stability-log.txt
     cmd /c "set NO_COLOR=1 && npx vitest run tests/concurrency >> docs\evidence\i03-stability-log.txt 2>&1"
   }
   ```
6. Commit ไฟล์ Log เขียวและ Stability Log:
   `docs(i03): capture green test and stability evidence for F-02`

#### ขั้นที่ 5: การจัดเตรียมหลักฐานและการเปิด Pull Request
1. คัดลอกโค้ดส่วน Setup และ Assertion ของ `tests/concurrency/duplicate.test.ts` สำหรับเตรียมใส่ใน **Part F §4 Excerpt 1**
2. Push กิ่ง `feature/i03-join` ขึ้นสู่ GitHub และเปิด Pull Request เพื่อให้เพื่อนร่วมทีมตรวจทาน

---

## 7. เกณฑ์ความสำเร็จของงาน (Definition of Done: DoD Checklist)
ตามข้อกำหนดใน **Master Part E §2.11**:

- [ ] **Automated Test Coverage:** ทุกข้อกำหนด AC-09 ถึง AC-18 มีชุดทดสอบที่ผ่านการทดสอบจริง (TEST-09 ถึง TEST-18 รวม 17U)
- [ ] **Concurrency Stability:** TEST-15 (50 Users) และ TEST-16 (Single-user 10 duplicate) รันซ้ำอย่างน้อย 5 รอบผ่านฉลุย ปราศจาก Flaky Behavior พร้อมบันทึกผลใน `docs/evidence/i03-stability-log.txt`
- [ ] **TDD Evidence:** มี Commit แดง (Red) บันทึก Log ล้มเหลว และ Commit เขียว (Green) บันทึก Log ผ่าน ชัดเจนสำหรับ **AC-11** และ **AC-15** ใน `docs/evidence/`
- [ ] **Database Integrity & Migration:** Migration `0002_partial_unique_indexes` มีอยู่และทดสอบรันบนฐานข้อมูลว่างสำเร็จ
- [ ] **No Gaps & Rollback Verification:** พิสูจน์ได้ว่าไม่มีเลขคิวซ้ำหรือข้าม และเมื่อตั๋วชนดัชนี ค่า `lastNumber` จะไม่ขยับ (Rollback สมบูรณ์)
- [ ] **Peer Review Ready:** จุดตรวจสำคัญสำหรับเพื่อนร่วมทีม:
  - [ ] การใช้ Interactive Transaction ร่วมกับ Raw SQL `ON CONFLICT DO UPDATE RETURNING`
  - [ ] การดักจับ Prisma Error `P2002` อยู่นอก `$transaction` และแมปเฉพาะ Target ที่ตรงกับ `unique_active_ticket_user`
  - [ ] ไม่รับ `userId` จาก Request Body
- [ ] **Documentation & Demo Preparation:** README ได้รับการอัปเดต และเตรียมหลักฐาน Demo 1 (ขั้นตอน join) และ Demo 2 (409 ซ้ำ) พร้อมสำหรับจัดทำรายงาน
