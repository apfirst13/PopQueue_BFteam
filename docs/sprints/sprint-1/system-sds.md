# System-Level Software Design Specification – Sprint 1 Architecture

**Course:** CPE 334 Introduction to Software Engineering in the Age of AI Agents  
**Target Release:** `v0.1.0-sprint1` (Deliverable 1 – Due 8 Nov 2026)  

---

## 📌 Master Document Reference
สถาปัตยกรรมระบบฉบับสมบูรณ์จัดเก็บไว้ที่:  
👉 **[docs/PopQueue_Deliverable_1_Master.md (Part C)](../../PopQueue_Deliverable_1_Master.md#part-c-system-level-software-design-specification-sds-15-คะแนน)**

---

## 🏗️ สถาปัตยกรรมและเทคโนโลยีที่ใช้ใน Sprint 1 (Sprint 1 Stack)
* **Web Client:** Next.js 14 + TailwindCSS (รันบนพอร์ต 3000) – รองรับ Mobile-first 375px, Short Polling 3 วินาทีสำหรับอัปเดตสถานะตั๋ว, จัดการ UI States (Loading, Empty, Error)
* **API Server:** Node.js + Express + TypeScript (รันบนพอร์ต 4000) – ตรวจสอบ Input ด้วย Zod, ยืนยันตัวตนด้วย Stateless JWT พร้อมตรวจ `tokenVersion` ทุกคำขอ, แยก Service Layer ควบคุมกฎธุรกิจ
* **Database:** PostgreSQL 16 ผ่าน Prisma ORM – ติดตั้งบน Docker Volume คงทนถาวร

---

## 🔐 สถาปัตยกรรม Concurrency & Data Model ใน Sprint 1
1. **Prisma Data Model:** โมเดล `User`, `Series`, `StaffSeriesAssignment`, `QueueTicket`, `QueueCounter`
2. **Partial Unique Index 1 (กันลูกค้ากดซ้อน - BR-02):**
   ```sql
   CREATE UNIQUE INDEX unique_active_ticket_user ON "QueueTicket"("userId")
   WHERE status IN ('WAITING','CALLED','UNBOXING');
   ```
3. **Partial Unique Index 2 (กันพนักงานกดเรียกซ้อน - BR-06):**
   ```sql
   CREATE UNIQUE INDEX unique_active_staff_ticket ON "QueueTicket"("handledByStaffId")
   WHERE status IN ('CALLED','UNBOXING');
   ```
4. **Atomic Sequential Numbering (BR-01, D-10):**
   ออกเลขคิวภายใน Transaction เดียวกันด้วย Raw SQL:
   ```sql
   INSERT INTO "QueueCounter" ("id","seriesId","queueDate","lastNumber")
   VALUES (gen_random_uuid()::text, $1, $2::date, 1)
   ON CONFLICT ("seriesId","queueDate")
   DO UPDATE SET "lastNumber" = "QueueCounter"."lastNumber" + 1
   RETURNING "lastNumber";
   ```
5. **FIFO Queue Selection (NFR Concurrency):**
   ```sql
   SELECT id FROM "QueueTicket"
   WHERE "seriesId" = $1 AND status = 'WAITING'
   ORDER BY "queueDate", "queueNumber" ASC LIMIT 1 FOR UPDATE SKIP LOCKED;
   ```
6. **Seeded Data (Synthetic):** 9 บัญชีผู้ใช้ (Collector 6 คน, Box Master 3 คน) + ซีรีส์ 3 รายการ (CRY, LAB, SKP ปิด)
