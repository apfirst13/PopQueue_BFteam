# PopQueue — System Software Design Specification (System SDS)
> **Engineering Baseline & Architecture Specification (Updated for Sprint 2 & 3)**  
> **Course:** CPE 334 Introduction to Software Engineering in the Age of AI Agents (Semester 1/2026, KMUTT)  
> **Target Releases:** `v0.3.0-lab7` (Baseline) → `v0.4.0-sprint2` → `v0.5.0-d2-rc`  
> **Status:** Updated & Reconciled (READ-ONLY Ground-Truth Audit Alignment)  
> **Master Specification Reference:** [`docs/sprints/sprint-2/PopQueue_Deliverable_2_Master.md`](file:///docs/sprints/sprint-2/PopQueue_Deliverable_2_Master.md)

---

## 1. ผังบทบาทและสิทธิ์การเข้าถึง (Role & Permission Matrix)

ระบบ PopQueue กำหนดบทบาทผู้ใช้ (Enum `Role` ใน `server/prisma/schema.prisma:9-12` — **EV-A03**) ออกเป็น 2 บทบาทหลัก และ 1 บทบาทภายนอก:
1. `Role.COLLECTOR`: ลูกค้า/นักสะสม Art Toy
2. `Role.BOX_MASTER`: พนักงานประจำสถานีแกะกล่องหน้าร้าน
3. `Public Viewer`: บุคคลภายนอก / ผู้ชมบอร์ดสาธารณะ (Unauthenticated)

| HTTP Method & Endpoint Path | Authentication Middleware | Allowed Role(s) | Business Ownership / Series Guard | HTTP Rejection Codes | อ้างอิงโค้ดจริง (Code Reference) / สถานะ |
| :--- | :---: | :---: | :--- | :--- | :--- |
| `GET /api/health` | None | Public | ไม่มี | None | `server/src/app.ts:28-33` (**EV-A06**) |
| `GET /api/v1/health` | None | Public | ไม่มี | None | `server/src/app.ts:28-33` (**EV-A06**) |
| `GET /api/ready` | None | Public | ตรวจสอบการเชื่อมต่อ Database | `503 Service Unavailable` | `server/src/app.ts:36-43` |
| `POST /api/auth/login` | None | Public | ตรวจสอบ Username / Password Hash | `400 VALIDATION_ERROR`<br>`401 INVALID_CREDENTIALS` | `server/src/routes/auth.routes.ts:8`<br>`server/src/services/auth.service.ts:34-47` |
| `POST /api/auth/logout` | `authenticateToken` | All Roles | ตรวจสอบ Token และ `tokenVersion` | `401 UNAUTHENTICATED` | `server/src/routes/auth.routes.ts:11` |
| `GET /api/auth/me` | `authenticateToken` | All Roles | คืนข้อมูลตัวตนและ Role ของผู้เรียก | `401 UNAUTHENTICATED` | `server/src/routes/auth.routes.ts:12` |
| `GET /api/series` | None | Public | คืนเฉพาะซีรีส์และจำนวนคิวรอ | None | `server/src/routes/series.routes.ts:7` |
| `POST /api/tickets/join` | `authenticateToken` | `COLLECTOR` | 1 active ticket per series (`BR-02 v2`) | `401 UNAUTHENTICATED`<br>`403 FORBIDDEN_ROLE`<br>`409 DUPLICATE_ACTIVE_QUEUE`<br>`409 SERIES_CLOSED` | `server/src/routes/ticket.routes.ts:9`<br>`server/src/services/ticket.service.ts:60-140` |
| `GET /api/tickets/my-ticket` | `authenticateToken` | `COLLECTOR` | กรองเฉพาะตั๋วของผู้เรียก (`userId`) | `401 UNAUTHENTICATED`<br>`404 NO_ACTIVE_TICKET` | `server/src/routes/ticket.routes.ts:17`<br>`server/src/services/ticket.service.ts:145-213` (**EV-B04**) |
| `GET /api/tickets/:id` | `authenticateToken` | All Roles | Ownership (Collector: own ticket, Staff: assigned series) | `401 UNAUTHENTICATED`<br>`404 RESOURCE_NOT_FOUND`<br>`403 FORBIDDEN_OWNERSHIP`<br>`403 FORBIDDEN_SERIES` | `server/src/routes/ticket.routes.ts:25`<br>`server/src/services/ticket.service.ts:220-262` |
| `POST /api/tickets/:id/cancel` *(F-05)* | `authenticateToken` | `COLLECTOR` | Ownership (`ticket.userId === auth.userId`) | `401 UNAUTHENTICATED`<br>`403 FORBIDDEN_ROLE`<br>`404 RESOURCE_NOT_FOUND`<br>`403 FORBIDDEN_OWNERSHIP`<br>`400 INVALID_STATE_TRANSITION` | `server/src/routes/ticket.routes.ts` *(planned)*<br>Master Contract Part B §1.4 |
| `GET /api/staff/tickets` | `authenticateToken` | `BOX_MASTER` | เฉพาะซีรีส์ที่ตนได้รับมอบหมาย | `401 UNAUTHENTICATED`<br>`403 FORBIDDEN_ROLE` | `server/src/routes/staff.routes.ts:9`<br>`server/src/services/staff.service.ts:77-142` |
| `POST /api/staff/call-next` | `authenticateToken` | `BOX_MASTER` | ซีรีส์ที่ได้รับมอบหมาย + Single Serving | `401 UNAUTHENTICATED`<br>`403 FORBIDDEN_ROLE`<br>`403 FORBIDDEN_SERIES`<br>`409 STAFF_BUSY`<br>`404 EMPTY_QUEUE` | `server/src/routes/staff.routes.ts:17`<br>`server/src/services/staff.service.ts:148-223` (**EV-B05**) |
| `POST /api/staff/tickets/:id/start-unboxing` | `authenticateToken` | `BOX_MASTER` | Assigned Series + Handler Exclusive | `401 UNAUTHENTICATED`<br>`403 FORBIDDEN_ROLE`<br>`404 RESOURCE_NOT_FOUND`<br>`403 FORBIDDEN_SERIES`<br>`403 FORBIDDEN_NOT_HANDLER`<br>`400 INVALID_STATE_TRANSITION` | `server/src/routes/staff.routes.ts:25`<br>`server/src/services/staff.service.ts:237-302` (**EV-A04**) |
| `POST /api/staff/tickets/:id/complete` | `authenticateToken` | `BOX_MASTER` | Assigned Series + Handler Exclusive | `401 UNAUTHENTICATED`<br>`403 FORBIDDEN_ROLE`<br>`404 RESOURCE_NOT_FOUND`<br>`403 FORBIDDEN_SERIES`<br>`403 FORBIDDEN_NOT_HANDLER`<br>`400 INVALID_STATE_TRANSITION` | `server/src/routes/staff.routes.ts:33`<br>`server/src/services/staff.service.ts:323-388` |
| `POST /api/staff/tickets/:id/no-show` *(F-06)* | `authenticateToken` | `BOX_MASTER` | Handler Exclusive + Time $\ge$ 120s | `401 UNAUTHENTICATED`<br>`403 FORBIDDEN_ROLE`<br>`404 RESOURCE_NOT_FOUND`<br>`403 FORBIDDEN_SERIES`<br>`403 FORBIDDEN_NOT_HANDLER`<br>`400 INVALID_STATE_TRANSITION`<br>`400 NO_SHOW_WINDOW_NOT_EXPIRED` | `server/src/routes/staff.routes.ts` *(planned)*<br>Master Contract Part B §2.4 |
| `GET /api/public/queue-board` *(F-07)* | None | Public | Zero PII (Prisma select projection) | None (Unrestricted Public Access) | `server/src/routes/public.routes.ts` *(planned)*<br>Master Contract Part B §3.3 |
| `GET /api/staff/analytics` *(F-08)* | `authenticateToken` | `BOX_MASTER` | ข้อมูลสถิติเฉพาะซีรีส์ที่ได้รับมอบหมาย | `401 UNAUTHENTICATED`<br>`403 FORBIDDEN_ROLE`<br>`400 VALIDATION_ERROR`<br>`403 FORBIDDEN_SERIES` | `server/src/routes/staff.routes.ts` *(planned)*<br>Master Contract Part C §1.3 |
| `PATCH /api/staff/series/:id/status` *(F-09)* | `authenticateToken` | `BOX_MASTER` | เฉพาะซีรีส์ที่ได้รับมอบหมาย | `401 UNAUTHENTICATED`<br>`403 FORBIDDEN_ROLE`<br>`400 VALIDATION_ERROR`<br>`404 RESOURCE_NOT_FOUND`<br>`403 FORBIDDEN_SERIES` | `server/src/routes/staff.routes.ts` *(planned)*<br>Master Contract Part C §2.2 |

---

## 2. โครงสร้างฐานข้อมูลและกลไก Concurrency Guard (Database & Index Invariants)

### 2.1 Prisma Data Models (`server/prisma/schema.prisma` — EV-A03)
* `User`: จัดเก็บผู้ใช้, รหัสผ่านแฮช (Bcrypt), บทบาท (`Role`), และ `tokenVersion`
* `Series`: ซีรีส์กล่องสุ่ม (`code`, `name`, `isActive`)
* `StaffSeriesAssignment`: แมปพนักงานกับซีรีส์ที่ดูแล (`staffId`, `seriesId`)
* `QueueCounter`: ตัวนับคิวแยกรายซีรีส์และรายวัน (`seriesId`, `queueDate`, `lastNumber`)
* `QueueTicket`: บัตรคิว (`userId`, `seriesId`, `status`, `queueDate`, `queueNumber`, `displayNumber`, `handledByStaffId`, `calledAt`, `startedAt`, `completedAt`, `forfeitedAt`)

### 2.2 Partial Unique Indexes (`server/prisma/migrations/` — EV-A02)
1. **Collector Active Ticket Index (Migration `0003_per_series_active_ticket_index`):**
   ```sql
   CREATE UNIQUE INDEX unique_active_ticket_user_series ON "QueueTicket"("userId", "seriesId")
   WHERE status IN ('WAITING','CALLED','UNBOXING');
   ```
   - **Predicate Enforcement:** นับเฉพาะสถานะ `WAITING`, `CALLED`, และ `UNBOXING`
   - **Exclusion Invariant:** สถานะ `COMPLETED`, **`CANCELLED`**, และ **`NO_SHOW`** หลุดออกจาก Index 100% (**EV-A02**) ทำให้ Collector สามารถกด Join ซีรีส์เดิมได้ทันทีหลังตั๋วถูกยกเลิกหรือตัดสิทธิ์ No-Show
2. **Staff Active Serving Index (Migration `0002_partial_unique_indexes`):**
   ```sql
   CREATE UNIQUE INDEX unique_active_staff_ticket ON "QueueTicket"("handledByStaffId")
   WHERE status IN ('CALLED','UNBOXING');
   ```
   - **Predicate Enforcement:** นับเฉพาะสถานะ `CALLED` และ `UNBOXING`
   - **Exclusion Invariant:** สถานะ `WAITING`, `COMPLETED`, **`CANCELLED`**, และ **`NO_SHOW`** หลุดออกจาก Index 100% (**EV-A02**) ทำให้พนักงานหลุดพ้นจาก `STAFF_BUSY` ทันทีที่ตั๋วเปลี่ยนเป็น No-Show

### 2.3 Atomic Monotonic Numbering & Daily Reset (EV-B03)
การออกเลขคิวใน `joinQueue` ใช้ PostgreSQL Raw Query พร้อม Atomic Increment:
```sql
INSERT INTO "QueueCounter" ("id", "seriesId", "queueDate", "lastNumber")
VALUES (gen_random_uuid()::text, ${seriesId}, ${queueDateStr}::date, 1)
ON CONFLICT ("seriesId", "queueDate")
DO UPDATE SET "lastNumber" = "QueueCounter"."lastNumber" + 1
RETURNING "lastNumber";
```
* **Composite Key:** `("seriesId", "queueDate")` แยกนับอิสระรายซีรีส์และรีเซ็ตทุกเที่ยงคืนเวลาไทย (`Asia/Bangkok`)
* **Monotonic Sequence:** ตั๋วที่ถูก Cancel หรือ No-Show จะไม่มีการลดค่าตัวนับถอยหลัง (`No Decrement`) เลขคิวดังกล่าวจะถูกข้ามไปอย่างถาวร (**EV-B03**)

---

## 3. สถาปัตยกรรมการติดตั้งบนคลาวด์ (Cloud Deployment & Infrastructure)

ระบบ PopQueue ได้รับการออกแบบและติดตั้งบนโครงสร้างพื้นฐาน Google Cloud Platform (GCP) ตามมาตรฐาน CI/CD ของโครงการ (Lab 5 & Lab 7 Baseline):

```
[GitHub Actions CI/CD] 
       │ (WIF Authentication)
       ├─► [Docker Multi-Stage Build] ──► [Artifact Registry Image]
       │
       ├─► [Cloud Run Job: popqueue-migrate] ──► [Cloud SQL PostgreSQL 16]
       │         (Prisma Migration Deploy)
       │
       └─► [Cloud Run Service: popqueue-service]
                 (Express Backend + Static Vite Frontend)
```

### 3.1 คอนฟิกูเรชันของ Container Runtime (Dockerfile — EV-B06)
* **Stage 1 (Builder):** `node:24-alpine` ทำการ compile TypeScript ทั้งฝั่ง Client และ Server
* **Stage 2 (Migration Runner):** รัน `npx prisma migrate deploy` ผ่าน Cloud Run Job
* **Stage 3 (Production Runner):** รัน Node.js Express server พร้อม static frontend assets

### 3.2 รายการตัวแปรสภาพแวดล้อม (Environment Variables Register)

| ตัวแปร (Variable Name) | แหล่งที่มา / การจ่ายค่า (Source & Pipeline) | ค่ามาตรฐาน (Default / Production) | ความสำคัญและบทบาททางวิศวกรรม | การตรวจสอบ (Verification) |
| :--- | :--- | :--- | :--- | :---: |
| `NODE_ENV` | `Dockerfile:61` | `production` (หรือ `test`) | ควบคุม Mode การทำงานของ Express และ Error Stack Hiding | CONFIRMED (**EV-B06**) |
| `PORT` | Cloud Run Runtime Environment | `3000` (Docker Container / Cloud Run) / `4000` (Local) | พอร์ตเครือข่ายสำหรับรับ HTTP Traffic | CONFIRMED |
| `TZ` | `Dockerfile:62` | `Asia/Bangkok` | บังคับ Timezone ระบบให้ตรงกับเวลาประเทศไทยสำหรับ `queueDate` | CONFIRMED (**EV-B03**) |
| `GIT_SHA` | GitHub Actions `--build-arg GIT_SHA` | Git Commit SHA 40 หลัก (หรือ `"dev"`) | คืนค่า SHA ใน `/api/health` เพื่อตรวจสอบเวอร์ชันที่ deploy จริง | CONFIRMED (**EV-A06**, **EV-B06**) |
| `DATABASE_URL` | GCP Secret Manager / Cloud SQL Socket | `postgresql://.../popqueue?host=/cloudsql/...` | สตริงเชื่อมต่อ Cloud SQL PostgreSQL 16 ผ่าน Unix Socket | CONFIRMED (**EV-B07**) |
| `JWT_SECRET` | GCP Secret Manager | Secret String (Min 32 chars) | กุญแจเข้ารหัสและตรวจสอบความถูกต้องของ Stateless JWT Token | CONFIRMED |
| `RATE_LIMIT_WINDOW_MS` | Injectable via Environment / Test Config | `900000` (15 นาที) | หน้าต่างเวลาสำหรับ Rate Limiting (`S3-HARDEN`) | `planned` |
| `RATE_LIMIT_MAX` | Injectable via Environment / Test Config | `10` คำขอต่อ IP | เพดานคำขอสูงสุดสำหรับ Login Rate Limiting (`S3-HARDEN`) | `planned` |
| `CLOUD_RUN_URL` | GCP Cloud Run Service Allocation | Placeholder: `*(รอผล Live Verification)*` | URL สาธารณะของบริการ Cloud Run | `unverified — evidence pending` |

---

## 4. บันทึกความถูกต้องและสถานะการตรวจสอบ (Ground-Truth Audit Summary)

1. **Role Guard Code:** `server/src/middleware/auth.ts:85` คืนรหัส `"FORBIDDEN_ROLE"` อย่างชัดเจน (**EV-B01**)
2. **Error Envelope Structure:** ทุก Endpoint คืนข้อผิดพลาดในรูป `{ error: { code, message, statusCode, details? } }` ไม่มี `"success": false` ปะปน (**EV-B01**, **EV-B04**)
3. **Database Constraints Independence:** Migration `0003` สร้าง Index `unique_active_ticket_user_series` โดยกันเฉพาะ 3 สถานะ Active ทำให้ฟีเจอร์ Cancel และ No-Show สามารถเริ่มพัฒนาได้ทันทีโดยไม่ต้องแก้ Schema หรือ Migration ใหม่อีก (**EV-A02**)
4. **Cloud Run Live Verification Status:** สถานะการ curl ทดสอบผ่าน Public URL ยังคงเป็น `unverified — evidence pending` เนื่องจากเครื่องทดสอบไม่มีสิทธิ์เข้าถึง GCP Console โดยตรง และ Master URL ยังคงเป็น placeholder (**EV-A06**, **EV-B07**)
