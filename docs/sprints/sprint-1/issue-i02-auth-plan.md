# Issue I-02: F-01 Authentication & Role Identity – Detailed Plan & Specification (v1.2 Revised)

**Sprint:** 1 | **Feature:** F-01 | **Branch:** `feature/i02-auth` | **Target Branch:** `sprint-1-staging`  
**Master Specification Link:** [Part E §1 Feature Contract F-01](PopQueue_Deliverable_1_Master.md#1-feature-contract-f-01--authentication--role-identity)  
**Governing Change Record:** **CHG-08** (v0.2.2 – บันทึกใน Part B §2.3 และ Part E §0 ของ Master Specification)  
**Linked Requirements:** FR-01, FR-02, BR-04 (ส่วน Role Guard), NFR-01, NFR-02  
**Acceptance Criteria:** AC-01 to AC-08  
**Test Suite (STS):** TEST-01 to TEST-08U  
**Review & Merge Rule:** เพื่อนร่วมทีมที่ไม่ใช่ผู้เปิด PR เป็นผู้ approve พร้อมความเห็นเฉพาะเจาะจง (ห้าม self-merge) และ **ห้าม Merge แบบ Squash** (ต้องใช้ Merge Commit เท่านั้น เพื่อรักษาประวัติ Red $\rightarrow$ Green สำหรับ Part F)  

---

## 1. Requirement & Contract Baseline (ข้อกำหนดอย่างละเอียด)

### 1.1 วัตถุประสงค์ (Purpose & Scope)
ระบบยืนยันตัวตน (Authentication) และการระบุบทบาท (Role Identity) สำหรับ Seeded Users ในฐานข้อมูล:
* **In Scope:**
  1. `POST /api/auth/login`: ตรวจสอบ `username` และ `password` กับ Bcrypt hash ออก JWT token (`HS256` อายุ 8 ชม. อ่านค่าจาก `JWT_EXPIRES_IN`)
  2. `POST /api/auth/logout`: เพิกถอนทุก token / ทุกอุปกรณ์ของผู้ใช้ (All-device Token Revocation) ตาม Decision D-11 โดยการเพิ่มค่า `tokenVersion = tokenVersion + 1` ในฐานข้อมูล ทำให้ Token ปัจจุบันและก่อนหน้าทั้งหมดของผู้ใช้นั้นหมดสภาพทันที
  3. `GET /api/auth/me`: ดึงข้อมูลตัวตนของผู้ใช้ปัจจุบันและรายการซีรีส์ที่ได้รับมอบหมาย (`assignedSeries`)
  4. `authenticateToken` Middleware: ตรวจสอบ Bearer JWT (`HS256`), ตรวจสอบ `tokenVersion` กับ Record ล่าสุดใน DB และผูก `req.user`
  5. `requireRole(allowedRoles)` Middleware: ตรวจสอบสิทธิ์ระดับบทบาท (Collector vs Box Master) โดยตรวจ Authentication (401) ก่อน Role (403) เสมอ
* **Out of Scope (Sprint 1):**
  * สมัครสมาชิกใหม่ (Self-registration)
  * กู้คืนรหัสผ่าน (Password reset / forgot password)
  * Refresh Token
  * Rate Limiting สำหรับ Login (เลื่อนไป Sprint 3 ตาม NFR-07 / D-12)

### 1.2 การบันทึกการเปลี่ยนแปลง (Change Record CHG-08 / Master v0.2.2)
ตามเกณฑ์ประเมิน Deliverable 1 Handout §3.5 (“revisions must remain visible and justified”) ได้บันทึกการปรับปรุงลงใน Master Specification ดังนี้:
1. **TEST-03:** เพิ่มเคสทดสอบ Malformed JSON และปรับ Error handler ดัก `SyntaxError` ให้ตอบ 400 `VALIDATION_ERROR` (ป้องกัน 500 Unhandled)
2. **TEST-04:** ปรับเป็น Parameterized Testing ผ่านตาราง `protectedRoutes` กลาง พร้อมเพิ่มเคส Algorithm Confusion (`alg: none`, `HS512`)
3. **TEST-05:** ระบุใช้บัญชี `collector6` สำหรับการทดสอบ Logout เพื่อป้องกัน Data Collision / Flaky Test กับเทสต์อื่นที่รันขนานกัน
4. **TEST-07:** กำหนดให้เป็น Characterization Test ของ Seeded Data (ไม่นับเป็น Red Test ในกระบวนการ TDD)
5. **TEST-08U:** เพิ่มเคสตรวจสอบเมื่อขาด `req.user` ต้องตอบ 401 `UNAUTHENTICATED` ก่อนการตรวจ Role
6. **Config:** เพิ่มตัวแปร `JWT_EXPIRES_IN` ใน `server/src/config/env.ts` และ `.env.example` (default `'8h'`)

---

## 2. API Contract Specification

### 2.1 `POST /api/auth/login`
* **Access:** Public (ไม่ต้องส่ง Token)
* **Request Headers:** `Content-Type: application/json`
* **Request Body (Zod Validation):**
  ```json
  {
    "username": "collector1",
    "password": "<จาก SEED_COLLECTOR_PASSWORD>"
  }
  ```
  * Schema: `username` (string, min 1, required), `password` (string, min 1, required)
* **Success Response (200 OK):**
  ```json
  {
    "data": {
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "user": {
        "id": "e2c347b8-f076-4d1a-9694-8db9f18705e4",
        "username": "collector1",
        "fullName": "Collector 1",
        "role": "COLLECTOR"
      }
    }
  }
  ```
* **Error Responses (Standard Error Envelope ตาม Part C §6):**
  * **400 Bad Request:** ข้อมูลใน Body ไม่ครบ เป็นค่าว่าง หรือส่ง JSON ผิดรูปแบบ (Malformed JSON)
    ```json
    {
      "error": {
        "code": "VALIDATION_ERROR",
        "message": "Invalid login payload",
        "statusCode": 400
      }
    }
    ```
  * **401 Unauthorized:** รหัสผ่านผิด หรือไม่พบ username ในระบบ (ข้อความและโครงสร้างเหมือนกันทั้ง 2 กรณี เพื่อป้องกัน User Enumeration)
    ```json
    {
      "error": {
        "code": "INVALID_CREDENTIALS",
        "message": "Invalid username or password",
        "statusCode": 401
      }
    }
    ```

---

### 2.2 `POST /api/auth/logout`
* **Access:** Authenticated Users (Collector & Box Master)
* **Request Headers:** `Authorization: Bearer <jwt-token>`
* **Request Body:** ว่างเปล่า
* **Behavior:**
  * ดึง `userId` จาก Token
  * ปรับปรุงฐานข้อมูล: `UPDATE "User" SET "tokenVersion" = "tokenVersion" + 1 WHERE id = $userId`
* **Success Response (200 OK):**
  ```json
  {
    "data": {
      "success": true
    }
  }
  ```
* **Error Response (401 Unauthorized):**
  ```json
  {
    "error": {
      "code": "UNAUTHENTICATED",
      "message": "Authentication required or token has been revoked",
      "statusCode": 401
    }
  }
  ```

---

### 2.3 `GET /api/auth/me`
* **Access:** Authenticated Users
* **Request Headers:** `Authorization: Bearer <jwt-token>`
* **Success Response (200 OK):**
  * กรณี Collector:
    ```json
    {
      "data": {
        "id": "e2c347b8-f076-4d1a-9694-8db9f18705e4",
        "username": "collector1",
        "fullName": "Collector 1",
        "role": "COLLECTOR",
        "assignedSeries": []
      }
    }
    ```
  * กรณี Box Master (`staff_crybaby`):
    ```json
    {
      "data": {
        "id": "b3f021ca-4d67-42f5-a352-78d123456789",
        "username": "staff_crybaby",
        "fullName": "Staff Crybaby",
        "role": "BOX_MASTER",
        "assignedSeries": [
          {
            "id": "c1a2b3d4-...",
            "code": "CRY",
            "name": "Crybaby Sunset Concert"
          }
        ]
      }
    }
    ```
* **Error Response (401 Unauthorized):**
  ```json
  {
    "error": {
      "code": "UNAUTHENTICATED",
      "message": "Authentication required or token has been revoked",
      "statusCode": 401
    }
  }
  ```

---

## 3. Middleware Architecture & Security Enforcement

```mermaid
flowchart TD
    Req[Incoming HTTP Request] --> CheckHeader{Has Bearer Token?}
    CheckHeader -- No --> Err401[401 UNAUTHENTICATED]
    CheckHeader -- Yes --> VerifyJWT{jwt.verify with HS256 & Expiry}
    VerifyJWT -- Invalid/Expired/Wrong Algo --> Err401
    VerifyJWT -- Valid --> FetchUser{Fetch User from DB & Compare tokenVersion}
    FetchUser -- Not Found or Version Mismatch --> Err401
    FetchUser -- Match --> AttachUser[Attach req.user from DB]
    AttachUser --> CheckRole{Require Role Specified?}
    CheckRole -- No / Any Role --> NextRoute[next: Route Handler]
    CheckRole -- Yes --> UserPresent{Is req.user present?}
    UserPresent -- No --> Err401
    UserPresent -- Yes --> RoleMatch{req.user.role in allowedRoles?}
    RoleMatch -- No --> Err403[403 FORBIDDEN_ROLE]
    RoleMatch -- Yes --> NextRoute
```

### 3.1 `authenticateToken`
1. อ่าน Header `Authorization` ตรวจสอบรูปแบบ `Bearer <token>`
2. ตรวจสอบ Token อย่างรัดกุมด้วย:
   ```typescript
   jwt.verify(token, config.JWT_SECRET, { algorithms: ['HS256'] })
   ```
   *(ป้องกันช่องโหว่ Algorithm Confusion หรือ None Algorithm)*
3. ค้นหา User ล่าสุดจาก PostgreSQL: `prisma.user.findUnique({ where: { id: payload.sub } })`
4. ยืนยันสถานะ Token Revocation: `user.tokenVersion === payload.tokenVersion`
5. แนบ User Profile (ไม่รวม `passwordHash`) ลงใน `req.user`
6. หากไม่ผ่านเงื่อนไขใด ให้ส่งต่อ `AppError(401, 'UNAUTHENTICATED', 'Authentication required or token has been revoked')` ทันที

### 3.2 `requireRole(allowedRoles: Role[])`
ตามลำดับการตรวจสอบมาตรฐานใน Master Spec Part C §6 (`1) Authentication (401) → 2) Role (403 FORBIDDEN_ROLE)`):
1. ตรวจสอบว่า `req.user` มีอยู่หรือไม่:
   * **ถ้าไม่มี `req.user`:** ให้ตอบ 401 `UNAUTHENTICATED` ทันที (Authentication มาก่อน Role เสมอ)
2. ตรวจสอบบทบาท:
   * **ถ้า `allowedRoles.includes(req.user.role)` เป็นเท็จ:** ให้ตอบ 403 `FORBIDDEN_ROLE` (`message: 'Forbidden: Insufficient role permissions'`)
3. ถ้าผ่านเงื่อนไข ให้เรียก `next()`

### 3.3 การปรับปรุง Global Error Handler สำหรับ Malformed JSON
ใน [../../../server/src/middleware/error-handler.ts](../../../server/src/middleware/error-handler.ts) ให้เพิ่มการตรวจจับ `SyntaxError` จาก `express.json()` เมื่อ Client ส่ง JSON เสีย:
```typescript
if (err instanceof SyntaxError && 'status' in err && err.status === 400) {
  res.status(400).json({
    error: {
      code: 'VALIDATION_ERROR',
      message: 'Malformed JSON payload',
      statusCode: 400,
    },
  });
  return;
}
```
*(แก้ไขช่องโหว่ที่ปัจจุบันระบบตอบกลับเป็น 500 INTERNAL_ERROR ให้เป็น 400 VALIDATION_ERROR ตามมาตรฐาน)*

---

## 4. Parameterized Protected Routes Architecture (TEST-04)

เพื่อรองรับ **NFR-02**, **AC-04**, และ **Traceability Matrix** อย่างยั่งยืน ให้สร้างตาราง Route กลางใน `server/tests/helpers/protected-routes.ts` เพื่อให้ TEST-04 สามารถวนลูปทดสอบทุก Protected Route แบบ Parameterized และรองรับการเติม Route จาก Issues ถัดไป (I-03 ถึง I-06):

```typescript
// server/tests/helpers/protected-routes.ts
export interface ProtectedRouteDef {
  method: 'GET' | 'POST' | 'PATCH' | 'DELETE';
  path: string;
  description: string;
  body?: unknown;
  addedInIssue: 'I-02' | 'I-03' | 'I-04' | 'I-05' | 'I-06';
}

export const protectedRoutes: ProtectedRouteDef[] = [
  // Issue I-02 Routes
  { method: 'POST', path: '/api/auth/logout', description: 'Logout endpoint', addedInIssue: 'I-02' },
  { method: 'GET', path: '/api/auth/me', description: 'Get current user profile', addedInIssue: 'I-02' },

  // Extensible for subsequent issues:
  // { method: 'POST', path: '/api/tickets/join', description: 'Join queue', body: { seriesId: 'uuid' }, addedInIssue: 'I-03' },
  // { method: 'GET', path: '/api/tickets/my-ticket', description: 'My active ticket', addedInIssue: 'I-04' },
  // { method: 'GET', path: '/api/tickets/mock-id', description: 'Ticket by ID', addedInIssue: 'I-04' },
  // { method: 'GET', path: '/api/staff/tickets', description: 'Staff queue list', addedInIssue: 'I-05' },
  // { method: 'POST', path: '/api/staff/call-next', description: 'Call next ticket', body: { seriesId: 'uuid' }, addedInIssue: 'I-05' },
  // { method: 'POST', path: '/api/staff/tickets/mock-id/start-unboxing', description: 'Start unboxing', addedInIssue: 'I-06' },
  // { method: 'POST', path: '/api/staff/tickets/mock-id/complete', description: 'Complete unboxing', addedInIssue: 'I-06' },
];
```

### การตรวจสอบใน TEST-04:
ในแต่ละ Route จากตาราง `protectedRoutes` จะต้องถูกทดสอบ 6 สถานการณ์ล้มเหลว:
1. ไม่มี Authorization Header
2. Header `Authorization: Bearer garbage-invalid-token`
3. Token ปลอมแปลง Payload / ลายเซ็นไม่ตรง
4. Token หมดอายุ (`exp` ในอดีต)
5. **Algorithm Confusion (alg: none):** Token ที่ใช้ Header `{"alg": "none", "typ": "JWT"}`
6. **Algorithm Confusion (unsupported alg):** Token ที่เซ็นด้วยอัลกอริทึมอื่น เช่น `HS512` หรือ `RS256`
* **ผลลัพธ์ที่คาดหวัง:** ทั้ง 6 กรณีต้องได้ 401 `UNAUTHENTICATED` และไม่มีข้อมูลผู้ใช้หรือระบบรั่วไหล

---

## 5. Software Test Specification (STS) & Acceptance Criteria Mapping

| Test ID | AC ID | ระดับการทดสอบ | ไฟล์ทดสอบ | สิ่งที่ตรวจสอบ | ประเภท TDD |
|:---:|:---:|:---:|:---|:---|:---:|
| **TEST-01** | AC-01 | Integration | `tests/api/auth.test.ts` | Login ด้วย `collector1` และ `staff_crybaby` รหัสถูกต้อง ได้ 200, ได้ `token`, `user.role` ตรงตาม Seed และถอด JWT ได้ `sub` ตรงกับ user id | **Red $\rightarrow$ Green** |
| **TEST-02** | AC-02 | Integration | `tests/api/auth.test.ts` | Login (1) รหัสผิด (2) username ไม่มีในระบบ ได้ 401 `INVALID_CREDENTIALS` ข้อความและโครงสร้างเหมือนกัน 100% ไม่มี Token | **Red $\rightarrow$ Green** |
| **TEST-03** | AC-03 | Integration | `tests/api/auth.test.ts` | Body ว่าง `{}`, `{ username: "" }`, `{ password: "x" }`, และ Malformed JSON string ได้ 400 `VALIDATION_ERROR` ทุกกรณี | **Red $\rightarrow$ Green** |
| **TEST-04** | AC-04 | Security | `tests/security/unauthenticated.test.ts` | วนลูปตรวจทุก route ใน `protectedRoutes`: (1) ไม่มี header, (2) `Bearer garbage`, (3) Token ปลอมแปลง, (4) Token หมดอายุ, (5) `alg: none`, (6) อัลกอริทึมผิด ทั้งหมดได้ 401 `UNAUTHENTICATED` | **Red $\rightarrow$ Green** |
| **TEST-05** | AC-05 | Integration | `tests/api/auth.test.ts` | ใช้ `collector6` (แยก user เพื่อป้องกัน data race): Login ได้ Token A $\rightarrow$ Logout 200 $\rightarrow$ Token A เรียก `/me` ได้ 401 $\rightarrow$ Login ใหม่ได้ Token B เรียก `/me` 200 $\rightarrow$ `tokenVersion` เพิ่ม 1 | **Red $\rightarrow$ Green** |
| **TEST-06** | AC-06 | Integration | `tests/api/auth.test.ts` | `GET /api/auth/me` คืน id, username, fullName, role; Box Master คืน `assignedSeries` ครบ (`staff_crybaby` $\rightarrow$ CRY, `staff_labubu` $\rightarrow$ LAB); Collector ได้ `[]` | **Red $\rightarrow$ Green** |
| **TEST-07** | AC-07 | Security / DB | `tests/security/password-hash.test.ts` | Query hash ทุก User จาก Seed: ตรง regex Bcrypt cost $\ge$ 10, ไม่เท่ากับ plaintext, และ `bcrypt.compareSync` เป็น true | **Characterization** *(เทสต์พฤติกรรม Seed ที่มีอยู่แล้ว)* |
| **TEST-08U** | AC-08 | Unit | `tests/unit/role-guard.test.ts` | Unit test ตรวจ middleware `requireRole(['BOX_MASTER'])`: อนุญาต Box Master (`next()`), ปฏิเสธ Collector (403 `FORBIDDEN_ROLE`), ถ้าไม่มี `req.user` ตอบ 401 `UNAUTHENTICATED` | **Red $\rightarrow$ Green** |

---

## 6. แผนการดำเนินงานตามกระบวนการ TDD (Test-Driven Development) & บันทึกหลักฐาน Part F

```mermaid
flowchart TD
    subgraph Step0 [ขั้น 0: สภาพแวดล้อมและ Test Harness]
        Docker[docker compose up -d db เพื่อเปิด DB]
        TestDB[ตั้งค่า DATABASE_URL_TEST อัตโนมัติใน setup.ts]
        VitestCfg[ตรวจสอบ vitest.config.ts include pattern]
        Helpers[สร้าง tests/helpers/auth-helper.ts และ protected-routes.ts]
    end
    subgraph Step1 [เตรียมการ & Setup]
        B[git checkout -b feature/i02-auth]
        Deps[npm install jsonwebtoken & @types/jsonwebtoken]
        Env[เพิ่ม JWT_EXPIRES_IN ใน env.ts & .env.example]
        Stub[สร้าง Stubs พฤติกรรมผิด เพื่อให้ล้มที่ Assertion]
    end
    subgraph Step2 [Red Phase: เขียน Test ให้ล้มที่ Assertion]
        T1[Unit Test: role-guard.test.ts]
        T2[API Test: auth.test.ts]
        T3[Security Test: unauthenticated.test.ts & password-hash.test.ts]
        Fail[ยืนยัน Test ล้มที่ Assertion แดงจริง ไม่ใช่ crash]
        LogRed[เซฟ log แดงลง docs/evidence/i02-red-test-log.txt]
        CommitRed[Commit RED: test auth: add failing tests for F-01]
    end
    subgraph Step3 [Green Phase: Implement โค้ดจริง]
        M1[src/types/auth.ts & src/utils/jwt.ts]
        M2[src/middleware/auth.ts & error-handler SyntaxError]
        M3[src/services/auth.service.ts & controllers & routes]
        Mount[Mount /api/auth ใน src/app.ts]
        Pass[รัน Vitest ผ่านเขียว 100%]
        LogGreen[เซฟ log เขียวลง docs/evidence/i02-green-test-log.txt]
        CommitGreen[Commit GREEN: feat auth: implement F-01 auth and role identity]
    end
    subgraph Step4 [Peer Review & Merge]
        Push[Push กิ่ง feature/i02-auth ขึ้น GitHub]
        OpenPR[เปิด PR เข้า sprint-1-staging]
        Review[เพื่อนร่วมทีมที่ไม่ใช่ผู้เปิด PR เป็นผู้ approve พร้อมความเห็นเฉพาะเจาะจง]
        Merge[Merge PR แบบ Merge Commit เท่านั้น - NO SQUASH]
    end

    Step0 --> Step1 --> Step2 --> Step3 --> Step4
```

### 6.1 กฎการสร้าง Stub สำหรับ Red Phase (Assertion Failure Discipline)
เพื่อให้ Test ล้มที่ระดับ **Assertion Failure** (ไม่ใช่ Unhandled Exception หรือ Compile error) ตามเกณฑ์ Handout §3.5:
* **`requireRole(allowedRoles)` Stub:**
  ```typescript
  export const requireRole = (_allowedRoles: Role[]) => {
    return (_req: Request, _res: Response, next: NextFunction) => next(); // Pass-through stub
  };
  ```
  *(เมื่อเทสต์ด้วย COLLECTOR แต่คาดหวัง 403 `FORBIDDEN_ROLE` เทสต์จะล้มที่ `expect(res.status).toBe(403)` ได้ 200/next แทน เป็น Assertion Failure ที่แท้จริง)*
* **`authenticateToken` Stub:**
  ```typescript
  export const authenticateToken = (_req: Request, _res: Response, next: NextFunction) => next(); // Pass-through
  ```
  *(เมื่อเทสต์ด้วย garbage token คาดหวัง 401 แต่ stub ปล่อยผ่าน เทสต์จะล้มที่ `expect(res.status).toBe(401)`)*
* **`authRouter` Stub:**
  ```typescript
  export const authRouter = Router(); // Empty router
  ```
  *(Route ที่ยังไม่ได้ implement จะได้ 404 ซึ่ง Supertest ที่คาดหวัง 200 จะล้มที่ `expect(res.status).toBe(200)`)*

### 6.2 กฎการ Merge เข้า `sprint-1-staging` (NO SQUASH)
* **ห้ามทำการ Squash Merge (No Squash Merge)** โดยเด็ดขาด
* ต้องใช้ **Merge Commit (`git merge --no-ff`)**
* **เหตุผล:** เพื่อรักษาประวัติการพัฒนาตามกระบวนการ TDD (Commit Red $\rightarrow$ Commit Green) ให้ปรากฏใน `git log` ของ `sprint-1-staging` ตามที่กำหนดใน Deliverable 1 Part F §5 & §6 (การ Squash จะบดประวัติ Commit Red หายไป เหลือเพียง Commit เดียว ทำให้หลักฐาน TDD เสียหาย)

### 6.3 หลักฐานที่ต้องบันทึกสำหรับ Deliverable 1 Part F
ตามเกณฑ์ประเมิน 20 คะแนนของ Part F:
1. **Red Commit Hash:** จด commit hash ของ Red phase (เช่น `test(auth): add failing tests...`)
2. **Red Test Execution Log:** บันทึกไฟล์ `docs/evidence/i02-red-test-log.txt` (แสดงจำนวนเทสต์ที่ล้มที่ Assertion)
3. **Green Commit Hash:** จด commit hash ของ Green phase (เช่น `feat(auth): implement F-01...`)
4. **Green Test Execution Log:** บันทึกไฟล์ `docs/evidence/i02-green-test-log.txt` (แสดงเทสต์ผ่าน 100%)
5. **หลักฐานการ Review บน PR:** ข้อความ Review และ Approval จากเพื่อนร่วมทีมใน GitHub PR
6. **อัปเดตเอกสาร:** อัปเดตตารางสถานะใน `docs/PROJECT_STATE.md` และบันทึกผลการทดสอบลงใน Master Specification Part F §5

---

## 7. รายการไฟล์ที่จะสร้างและแก้ไขใน Issue I-02

### กลุ่มเตรียมการ & Test Harness (Step 0 & 1):
1. **`server/tests/setup.ts`:** เพิ่มการสลับ `DATABASE_URL` ไปใช้ `DATABASE_URL_TEST` อัตโนมัติเมื่อ `NODE_ENV === 'test'`
2. **`server/vitest.config.ts`:** กำหนด `include: ['tests/**/*.test.ts']` และ `testTimeout: 10000`
3. **`server/tests/helpers/protected-routes.ts`:** ตาราง Route กลางสำหรับ parameterized testing (รองรับ I-02..I-06)
4. **`server/tests/helpers/auth-helper.ts`:** Helper สำหรับสร้าง Token ทดสอบ (`signTestToken`) และ Header (`getAuthHeader`)
5. **`server/package.json`:** เพิ่ม dependency `jsonwebtoken` และ `devDependencies` `@types/jsonwebtoken`
6. **`server/src/config/env.ts`:** เพิ่ม `JWT_EXPIRES_IN: z.string().default('8h')`
7. **`.env.example` & `server/.env.example`:** เพิ่มตัวแปร `JWT_EXPIRES_IN=8h`

### กลุ่มชุดทดสอบ TDD (Step 2):
8. **`server/tests/unit/role-guard.test.ts`:** Unit test สำหรับ `requireRole` (TEST-08U)
9. **`server/tests/api/auth.test.ts`:** Integration test สำหรับ TEST-01, TEST-02, TEST-03, TEST-05, TEST-06
10. **`server/tests/security/unauthenticated.test.ts`:** Security test แบบ Parameterized สำหรับ TEST-04 (รวมเคส Algorithm Confusion)
11. **`server/tests/security/password-hash.test.ts`:** Characterization test ตรวจสอบ Bcrypt cost $\ge$ 10 (TEST-07)

### กลุ่ม Implementation (Step 3):
12. **`server/src/middleware/error-handler.ts`:** เพิ่มการดัก `SyntaxError` (400 `VALIDATION_ERROR`) สำหรับ Malformed JSON
13. **`server/src/types/auth.ts`:** กำหนด interface `JwtPayload`, Express Request typing (`req.user`), และ Zod schemas สำหรับ Login
14. **`server/src/utils/jwt.ts`:** ฟังก์ชันสร้างและถอดรหัส Token ด้วย `algorithms: ['HS256']`
15. **`server/src/middleware/auth.ts`:** Middleware `authenticateToken` และ `requireRole`
16. **`server/src/services/auth.service.ts`:** Business logic สำหรับ `login`, `logout` (increment `tokenVersion`), และ `getMe`
17. **`server/src/controllers/auth.controller.ts`:** จัดการ request validation และ response envelopes
18. **`server/src/routes/auth.routes.ts`:** กำหนดเส้นทาง `/login`, `/logout`, `/me`
19. **`server/src/app.ts`:** Mount Router ภายใต้ `/api/auth`

### กลุ่มเอกสาร & สถานะโครงการ:
20. **`docs/PROJECT_STATE.md`:** ปรับสถานะ Issue I-02 เป็น In Progress
21. **`README.md`:** เพิ่มเอกสารอธิบายการตั้งค่า Auth, Endpoints, Seed accounts, และวิธีการทดสอบ
