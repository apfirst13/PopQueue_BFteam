# แผนการพัฒนา Issue I-04: F-04 Queue Ticket Inspection & Ownership Security
**โครงการ PopQueue – Art Toy Live Unboxing Queue Management System**  
**CPE 334 Introduction to Software Engineering in the Age of AI Agents (Semester 1/2026)**  
**เวอร์ชันเอกสาร:** v1.0 | **สถานะ:** ดำเนินการตามขั้นตอน TDD  
**ผู้จัดทำ:** นายอภิวัชร์ ปัณฐธนาพัฒน์ (67070507209) & นายธีรวัฒญ์ รุ่งสว่าง (67070507206)  
**เอกสารอ้างอิงหลัก:**
- [`docs/PopQueue_Deliverable_1_Master.md`](../../PopQueue_Deliverable_1_Master.md) (Part C §5–§7, Part E §4)

---

## 1. บทนำและขอบเขตข้อกำหนด (Context & Scope)
Issue I-04 รับผิดชอบการพัฒนาฟีเจอร์ลำดับที่สี่ของ Sprint 1 คือ **Feature F-04: Queue Ticket Inspection & Ownership Security** ซึ่งเป็นระบบการเข้าถึงและตรวจสอบข้อมูลตั๋วคิวของผู้ใช้งาน:
1. **Collector Active Ticket Inspection (`GET /api/tickets/my-ticket`):** ให้สิทธิ์เฉพาะ Collector ในการตรวจสอบตั๋วสถานะ Active (`WAITING`, `CALLED`, `UNBOXING`) ของตนเอง พร้อมคำนวณจำนวนคิวก่อนหน้า (`waitingAhead`) อิงจาก `queueDate` ของตั๋วใบนั้น
2. **Strict 5-Stage Authorization Pipeline (`GET /api/tickets/:id`):** บังคับใช้ลำดับการประเมินสิทธิ์ 5 ขั้นตอน: `Auth (401) -> Role (403) -> Param UUID (400) -> Exists (404) -> Ownership/Scope (403)`
3. **Zero Data Leakage on 403 (AC-37):** เมื่อ Collector ตรวจสอบตั๋วของผู้อื่น จะได้รับ 403 `FORBIDDEN_OWNERSHIP` โดย Response Body จะมีเฉพาะ key `error` และไม่มีข้อมูล `displayNumber`, `status` หรือข้อมูลส่วนบุคคลของตั๋วใบนั้น
4. **Box Master Scope Enforcement (AC-38):** Box Master ตรวจสอบตั๋วในซีรีส์ที่ได้รับมอบหมายได้ (200 OK พร้อม `userFullName`) แต่หากข้ามซีรีส์จะถูกปฏิเสธด้วย 403 `FORBIDDEN_SERIES`

---

## 2. ตารางการสอบกลับข้อกำหนด (Traceability Matrix)

| Req ID | สเปก / ข้อกำหนด | AC | Test ID | สถานะ |
| :---: | :--- | :---: | :---: | :---: |
| **FR-05** | Collector ดูตั๋ว Active ตนเอง (`WAITING`, `CALLED`, `UNBOXING`) พร้อม `waitingAhead` และ timestamps | **AC-34**, **AC-35** | **TEST-34**, **TEST-35** | Planned / Implemented |
| **FR-06** | ดูรายละเอียดตั๋วตาม ID รวมตั๋วที่ COMPLETED แล้วสำหรับดึงผลลัพธ์ที่บันทึกไว้ | **AC-36** | **TEST-36** | Planned / Implemented |
| **BR-04 / NFR-02** | บังคับสิทธิ์เจ้าของและซีรีส์ ป้องกันการรั่วไหลข้อมูล (Collector ห้ามดูของคนอื่น, Staff ห้ามข้ามซีรีส์) | **AC-37**, **AC-38** | **TEST-37**, **TEST-38** | Planned / Implemented |
| **NFR-05** | ข้อมูลตั๋วคงอยู่หลัง Restart DB (ทดสอบใน Issue I-08) | **AC-39** | **TEST-39** | Scheduled in I-08 |

---

## 3. สถาปัตยกรรมและการออกแบบทางเทคนิค (Technical Design)

### 3.1 Minimal Select Optimization
เพื่อลดภาระงานของฐานข้อมูลและป้องกันปัญหา Information Leakage ฟังก์ชัน `getTicketById` ดำเนินการคัดกรองเบื้องต้นด้วย:
```typescript
const minimal = await prisma.queueTicket.findUnique({
  where: { id: ticketId },
  select: { id: true, userId: true, seriesId: true },
});
```
ตรวจสอบความมีอยู่จริง (404) และสิทธิ์ (403) ก่อน จึงค่อยทำการ Query ข้อมูลเต็มรูปแบบพร้อม Join กับตาราง `Series` และ `User`

### 3.2 Response Shapes Alignment (Master Spec Part E §4.7)
- `GET /api/tickets/my-ticket` ตอบกลับในโครงสร้าง `{ data: { ticket: { ... } } }`
- `GET /api/tickets/:id` ตอบกลับในโครงสร้าง `{ data: { ... } }` (เพิ่ม `userFullName` เฉพาะเมื่อผู้เรียกเป็น Box Master)
