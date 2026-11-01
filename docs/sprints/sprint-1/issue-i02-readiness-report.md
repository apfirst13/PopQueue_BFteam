# Issue I-02 Pre-flight & Repository Readiness Report

**Date:** 2026-11-02  
**Context:** Verification of repository baseline and scaffold from Issue I-01 prior to starting Issue I-02 (F-01 Authentication & Role Identity).  
**Target Feature:** F-01 (FR-01, FR-02, BR-04, NFR-01, NFR-02 | AC-01..08)  

---

## 1. Git State

* **Branch ปัจจุบัน:** `sprint-1-staging`
* **ผลคำสั่ง `git log --oneline -15`:**
  ```text
  3078739 Merge pull request #12 from apfirst13/feature/i01-scaffold
  12d584b fix(test): add optional chaining to satisfy strict null check in typecheck
  f7961fe chore(test): use strict Prisma error types to achieve zero lint warnings
  242a07c feat(i01): add statusCode to error handler, enforce strict JWT secret without fallback, and align PORT to 4000
  5013977 test(i01): add failing tests for error statusCode, strict JWT secret, and P2002 assertions
  c2992a2 docs(i01): record CHG-07 UI stack change to React 18 + Vite, update VITE config, repo URL, and PR #12
  2912846 feat(scaffold): add prisma models, partial unique indexes, and idempotent seed script (Issue #1)
  b55eebf feat(scaffold): initialize monorepo skeleton, health check, and test harnesses (Issue #0)
  be364fc Merge pull request #1 from apfirst13/feature/i00-baseline-docs
  dc42b8f docs: fix relative paths for Sprint 1 pointer docs to ../../
  ad62b8b docs: organize Sprint 1 specifications into docs/sprints/sprint-1/ and fill metadata
  9a8025b docs: relocate Deliverable 1 master specification to docs/
  3410ff7 chore: sync configs with PopQueue v0.2 and remove obsolete QDrive docs
  ab49348 Final Issue 0 รอเฟิร์สตรวจ
  8605fa9 New SRS กรูรษตรวจทานก่อน
  ```
* **สถานะการ Merge ของ Issue I-01:**
  * **สถานะ:** ถูก Merge เข้า `sprint-1-staging` แล้ว
  * **หลักฐาน:** Commit `3078739` มีข้อความ `Merge pull request #12 from apfirst13/feature/i01-scaffold` และมี commit ประวัติการพัฒนาของ I-01 (`b55eebf` ถึง `12d584b`) อยู่ในสาย branch
* **สถานะความสะอาดของ `git status`:**
  * มี 1 untracked file คือ `docs/sprints/sprint-1/issue-i02-auth-plan.md` (ไฟล์แผนงานที่สร้างไว้ก่อนหน้า)
  * ไม่มี staged หรือ unstaged modifications ใน tracked files

---

## 2. Dependencies (อ่านจาก `server/package.json`)

* **Path:** `server/package.json`
* **Production Dependencies:**
  * `express`: `^4.19.2`
  * `@prisma/client`: `^5.18.0`
  * `bcryptjs`: `^3.0.3` (ใช้ `bcryptjs` แบบ pure JS แทน native `bcrypt`)
  * `zod`: `^3.23.8`
  * `jsonwebtoken`: **ไม่พบ**
  * `dotenv`: `^16.4.5`
  * `cors`: `^2.8.5`
* **Dev Dependencies:**
  * `typescript`: `^5.5.4`
  * `vitest`: `^2.0.5` (ใช้ `vitest` ไม่มี `jest`)
  * `supertest`: `^7.0.0`
  * `@types/supertest`: `^6.0.2`
  * `tsx`: `^4.16.2` (ใช้ `tsx` ไม่มี `ts-node`)
  * `@types/jsonwebtoken`: **ไม่พบ**
  * `@types/bcryptjs`: `^2.4.6`
  * `@types/cors`: `^2.8.17`
  * `@types/express`: `^4.17.21`
  * `@types/node`: `^20.14.12`
  * `prisma`: `^5.18.0`
* **Scripts ทั้งหมด:**
  ```json
  "dev": "tsx watch src/index.ts",
  "build": "tsc -p tsconfig.build.json",
  "typecheck": "tsc --noEmit",
  "test": "vitest run",
  "lint": "eslint src tests",
  "db:migrate": "prisma migrate dev",
  "db:seed": "prisma db seed",
  "db:reset-demo": "prisma migrate reset --force",
  "prisma": { "seed": "tsx prisma/seed.ts" }
  ```

---

## 3. Error Handling

* **Class `AppError`:** **มีแล้ว**
  * **Path:** `server/src/middleware/error-handler.ts:12-24`
* **Global Error Handler Middleware:** **มีแล้ว** ตอบรูปแบบ `{ "error": { "code", "message", "statusCode" } }`
  * **Path:** `server/src/middleware/error-handler.ts:26-52`
  * **โค้ด:**
    ```typescript
    export function errorHandler(
      err: Error,
      _req: Request,
      res: Response<ErrorResponse>,
      _next: NextFunction,
    ): void {
      if (err instanceof AppError) {
        res.status(err.statusCode).json({
          error: {
            code: err.code,
            message: err.message,
            statusCode: err.statusCode,
            ...(err.details !== undefined ? { details: err.details } : {}),
          },
        });
        return;
      }

      // Fallback for unhandled exceptions - never leak internal details or stack traces (NFR-05)
      res.status(500).json({
        error: {
          code: 'INTERNAL_ERROR',
          message: 'An unexpected internal error occurred',
          statusCode: 500,
        },
      });
    }
    ```
* **พฤติกรรมกรณีต่างๆ:**
  * **Route ไม่มี (404):** **ไม่พบ Middleware จัดการ 404** ใน `server/src/app.ts` (Express จะตอบ default HTML `Cannot GET /...`)
  * **JSON Body เสีย (Parse Error):** `express.json()` โยน `SyntaxError` ซึ่งไม่ใช่ `AppError` จึงตกไปยัง fallback 500 `INTERNAL_ERROR` (ไม่รั่ว stack trace แต่ status code จะเป็น 500 แทนที่จะเป็น 400 `VALIDATION_ERROR`)
  * **Error ที่ไม่คาดคิด (500):** ตกไปยัง fallback บรรทัดที่ 44–51 ตอบ `INTERNAL_ERROR` 500 โดย **ไม่รั่ว stack trace** (มีชุดเทสต์ยืนยันใน `tests/error-handler.test.ts`)

---

## 4. Configuration

* **Config Module:** **มีแล้ว**
  * **Path:** `server/src/config/env.ts`
  * **Env ที่อ่าน:** `NODE_ENV`, `PORT`, `TZ`, `DATABASE_URL`, `JWT_SECRET`, `CORS_ORIGIN`, `BCRYPT_COST`, `SEED_COLLECTOR_PASSWORD`, `SEED_STAFF_PASSWORD`
* **การตรวจ `JWT_SECRET` ตอนเริ่มต้น:** **ตรวจเข้มงวด (Fail-fast)**
  * กำหนดผ่าน Zod `z.string().min(32, 'JWT_SECRET must be at least 32 characters')` ไม่มี default fallback หากขาดหรือสั้นกว่า 32 ตัวอักษรจะ throw exception ทันที (ทดสอบแล้วใน `tests/env.test.ts`)
* **ไฟล์ `.env.example`:**
  * **Path:** `.env.example` (root) และ `server/.env.example`
  * มี `JWT_SECRET`: มี (`your-super-secret-jwt-key-at-least-32-chars-long`)
  * มี `DATABASE_URL`: มี (`postgresql://popqueue:popqueue_dev_password@localhost:5432/popqueue`)
  * มี `SEED_*_PASSWORD`: มี (`SEED_COLLECTOR_PASSWORD`, `SEED_STAFF_PASSWORD`)
  * ค่า Expiry (เช่น `JWT_EXPIRES_IN`): **ไม่พบ** (ยังไม่มีตัวแปรนี้ใน `.env.example` หรือใน schema ของ `env.ts`)
  * ไม่มี secret จริงหลุด (มีเฉพาะ synthetic dev credentials)
* **การ Ignore `.env`:** **มีแล้ว**
  * **Path:** `.gitignore:9-11` ระบุ `.env`, `.env.*`, และ `!.env.example`

---

## 5. App Structure

* **การแยก `app` ออกจากตัว Listen:** **แยกเรียบร้อย**
  * **Path:** `server/src/app.ts` ทำการ export `createApp()` และ `app` โดยไม่สั่ง `.listen()` ทำให้ Supertest นำไปใช้เทสต์ได้ทันที
  * **Path:** `server/src/index.ts` เป็นจุดรัน `app.listen(config.PORT)`
* **Routes / Controllers / Services ที่มีอยู่แล้ว:**
  * Routes, Controllers, Services: **ไม่พบ** (ยังไม่มีโฟลเดอร์ `routes/`, `controllers/`, หรือ `services/` ใน `server/src/`)
* **Health Route:** **มีแล้ว**
  * **Path:** `server/src/app.ts:12-14`
  * Endpoint: `GET /api/v1/health` คืน 200 `{ status: "ok" }`

---

## 6. Test Harness

* **Test Runner Config:** `server/vitest.config.ts`
* **Setup / Teardown:** `server/tests/setup.ts` กำหนด `NODE_ENV = 'test'` และ mock `JWT_SECRET`
* **การแยก DB Test จาก DB Dev:**
  * ใน `.env.example` มีตัวแปร `DATABASE_URL_TEST` แต่ใน `server/src/config/env.ts` และ Vitest setup **ยังไม่ได้สลับ connection ไปใช้ `DATABASE_URL_TEST` โดยอัตโนมัติ**
* **Helpers ที่มีอยู่แล้ว:**
  * **Fake Clock / Bangkok Queue Date:** `server/src/utils/clock.ts` (`FakeClock`, `SystemClock`, `getQueueDate`)
  * **Test DB Harness:** `server/src/utils/test-db.ts` (ยังมีเฉพาะฟังก์ชันว่างเปล่า placeholder)
  * **Login / Token Helpers:** **ไม่พบ**
* **ผลการรัน Test Suite ปัจจุบัน (`npm test` ใน `server`):**
  * **ผลลัพธ์:** **11 passed, 6 skipped (รวม 17 tests), 1 test file failed**
  ```text
   ✓ tests/clock.test.ts (4 tests) 33ms
   ✓ tests/env.test.ts (4 tests) 6ms
   ✓ tests/health.test.ts (1 test) 39ms
   ✓ tests/error-handler.test.ts (2 tests) 47ms
   ❯ tests/db-schema-and-seed.test.ts (6 tests | 6 skipped) 8369ms

  ⎯⎯⎯⎯⎯⎯ Failed Suites 1 ⎯⎯⎯⎯⎯⎯⎯
   FAIL tests/db-schema-and-seed.test.ts > Database Schema, Models, Partial Indexes & Seed Verification (Issue I-01)
  PrismaClientInitializationError: Can't reach database server at `localhost:5432`
  ```
  *(หมายเหตุ: ไฟล์ `db-schema-and-seed.test.ts` ล้มเพราะ Docker daemon ของ PostgreSQL ยังไม่ได้ถูกสั่ง Start)*

---

## 7. Prisma + Seed

* **Migrations ที่มีอยู่:**
  1. `server/prisma/migrations/20261101145005_0001_init`
  2. `server/prisma/migrations/20261101145503_0002_partial_unique_indexes`
* **โมเดล `User` ใน `server/prisma/schema.prisma`:**
  * **Path:** `server/prisma/schema.prisma:24-35`
  * มีฟิลด์: `id`, `username`, `passwordHash`, `fullName`, `role` (Enum `COLLECTOR` / `BOX_MASTER`), `tokenVersion` (Int default 0) **ตรงกับข้อกำหนด Master Spec 100%**
* **Seed Script (`server/prisma/seed.ts`):**
  * **Path:** `server/prisma/seed.ts`
  * สร้าง 9 บัญชี: `collector1` ถึง `collector6` (COLLECTOR), `staff_crybaby`, `staff_crybaby2`, `staff_labubu` (BOX_MASTER)
  * สร้าง 3 Series: `CRY`, `LAB`, `SKP`
  * สร้าง 3 Assignments: `staff_crybaby` → CRY, `staff_crybaby2` → CRY, `staff_labubu` → LAB
  * Bcrypt cost: อ่านจาก `Number(process.env.BCRYPT_COST) || 10`
  * รหัสผ่าน: อ่านจาก `process.env.SEED_COLLECTOR_PASSWORD` และ `process.env.SEED_STAFF_PASSWORD` (มี fallback เป็น dev password)
* **ผลคำสั่งนับ User จาก DB จริง:**
  * **คำสั่งที่ใช้ค้น:**
    ```powershell
    npx tsx -r dotenv/config -e "import { PrismaClient } from '@prisma/client'; const prisma = new PrismaClient(); async function main() { const count = await prisma.user.count(); console.log('User count:', count); } main().catch(e => { console.error('DB Error:', e.message); process.exit(1); });"
    ```
  * **ผลลัพธ์:** **ไม่สามารถนับได้จริง (DB Error)** `Can't reach database server at localhost:5432` เนื่องจากบริการ PostgreSQL ใน Docker Container ยังไม่ได้เปิดทำงาน

---

## 8. ตารางสรุปสถานะการตรวจสอบก่อนเริ่ม Issue I-02

| รายการ | มีแล้ว/ไม่มี/บางส่วน | path | หลักฐาน | ช่องว่างที่ I-02 ต้องเติม |
|:---|:---:|:---|:---|:---|
| **Git Baseline & Branch** | มีแล้ว | `qdrive-license-queue` | Commit `3078739` รวม I-01 เข้า `sprint-1-staging` เรียบร้อย | แตกกิ่งใหม่ `feature/i02-auth` |
| **Auth Dependencies (`jsonwebtoken`)** | ไม่มี | `server/package.json` | ค้นหา `jsonwebtoken` ไม่พบใน `dependencies` | ติดตั้ง `jsonwebtoken` และ `@types/jsonwebtoken` |
| **Bcrypt Dependency** | มีแล้ว | `server/package.json:21` | `"bcryptjs": "^3.0.3"` พร้อม types | ใช้งาน `bcryptjs` ใน auth service สำหรับ compare hash |
| **Error Handling (AppError & Envelope)** | มีแล้ว | `server/src/middleware/error-handler.ts` | คืน `{ error: { code, message, statusCode } }` ไม่รั่ว stack | ใช้งานรหัส `INVALID_CREDENTIALS`, `UNAUTHENTICATED`, `FORBIDDEN_ROLE` |
| **Config & JWT Secret Guard** | มีแล้ว | `server/src/config/env.ts` | บังคับ `JWT_SECRET` ขั้นต่ำ 32 ตัวอักษร ไม่มี fallback | เพิ่มค่า `JWT_EXPIRES_IN` (เช่น `'8h'`) ใน config/env |
| **App & Server Separation** | มีแล้ว | `server/src/app.ts` | Export `app` โดยไม่ listen พร้อมสำหรับ Supertest | Mount route `/api/auth` เข้ากับ `app` |
| **Auth Routes / Controllers / Services** | ไม่มี | `server/src/` | ค้นหาโฟลเดอร์ `routes/`, `controllers/`, `services/` ไม่พบ | สร้าง Auth Router, Controller, Service |
| **Auth Middlewares** | ไม่มี | `server/src/middleware/` | มีเฉพาะ `error-handler.ts` | สร้าง `authenticateToken` และ `requireRole` middleware |
| **Database Schema (`User`)** | มีแล้ว | `server/prisma/schema.prisma:24` | มี `passwordHash`, `role`, `tokenVersion` ครบถ้วน | ไม่ต้องแก้ schema ใช้ข้อมูลตาราง `User` ที่มีอยู่ |
| **Seed Data 9 บัญชี** | มีแล้ว | `server/prisma/seed.ts:18` | 6 Collectors, 3 Box Masters พร้อม Bcrypt hash | ใช้บัญชีและรหัสผ่านจาก seed ในการทดสอบ Login |
| **Auth Test Suites (AC-01..08)** | ไม่มี | `server/tests/` | มีเฉพาะ clock, env, health, error-handler, db-schema | สร้าง `auth.test.ts`, `role-guard.test.ts`, security tests |

---

## 9. สิ่งที่ Issue I-02 ต้องเพิ่มเอง (สรุปรายการงาน)

1. **ติดตั้ง Packages:** `jsonwebtoken` และ `@types/jsonwebtoken` ใน `server/`
2. **สร้าง JWT Helper (`server/src/utils/jwt.ts`):** สำหรับ `sign` และ `verify` Token พร้อม payload `{ sub, role, tokenVersion }` (อายุ 8 ชม.)
3. **สร้าง Middlewares (`server/src/middleware/auth.ts`):**
   * `authenticateToken`: ตรวจ Bearer JWT + ตรวจสอบ `tokenVersion` ล่าสุดกับ Record ในตาราง User
   * `requireRole(allowedRoles)`: ตรวจสอบสิทธิ์ Role guard (403 `FORBIDDEN_ROLE`)
4. **สร้าง Business Logic & Handlers:**
   * `server/src/services/auth.service.ts`: จัดการ `login`, `logout` (บวก `tokenVersion`), และ `getMe`
   * `server/src/controllers/auth.controller.ts`: รับ request, ตรวจสอบ payload ด้วย Zod, ส่ง response
   * `server/src/routes/auth.routes.ts`: กำหนด endpoints `POST /login`, `POST /logout`, `GET /me`
5. **Mount Route ใน `server/src/app.ts`:** เชื่อมต่อ `/api/auth` เข้ากับ Express App
6. **สร้างชุดทดสอบ TDD (AC-01 ถึง AC-08):**
   * `tests/unit/role-guard.test.ts` (TEST-08U)
   * `tests/api/auth.test.ts` (TEST-01, 02, 03, 05, 06)
   * `tests/security/unauthenticated.test.ts` (TEST-04)
   * `tests/security/password-hash.test.ts` (TEST-07)
