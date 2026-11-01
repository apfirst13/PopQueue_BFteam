# Feature Inventory – Sprint 1 Focus

**Course:** CPE 334 Introduction to Software Engineering in the Age of AI Agents  
**Target Release:** `v0.1.0-sprint1` (Deliverable 1 – Due 8 Nov 2026)  

---

## 📌 Master Document Reference
เอกสารฉบับสมบูรณ์จัดเก็บไว้ที่:  
👉 **[docs/PopQueue_Deliverable_1_Master.md (Part B)](../../PopQueue_Deliverable_1_Master.md#1-รายการคุณสมบัติของระบบ-feature-inventory)**

---

## 🚀 ฟีเจอร์ที่พัฒนาและส่งมอบจริงใน Sprint 1 (Sprint 1 Scope)

| Feature ID | ชื่อฟีเจอร์ | ขอบเขตและความรับผิดชอบใน Sprint 1 | ข้อกำหนดที่ครอบคลุม |
|:---:|---|---|---|
| **F-01** | **Authentication & Role Identity** | ระบบล็อกอิน/ล็อกเอาต์ด้วย Bcrypt, คืนค่าตัวตน `/me`, การเพิกถอน Token ด้วย `tokenVersion`, และ Auth/Role Middleware กลาง | FR-01, FR-02, BR-04, NFR-01, NFR-02 |
| **F-02** | **Queue Discovery & Safe Sequential Joining** | แสดงรายการซีรีส์, กดขอรับบัตรคิวออกเลข Atomic ปลอดภัยด้วย Raw SQL `ON CONFLICT`, ป้องกันการกดคิวซ้อน (409) และกันซีรีส์ปิด | FR-03, FR-04, BR-01, BR-02, BR-09, NFR-03, NFR-04, NFR-06 |
| **F-03** | **Box Master Service Counter** | แสดงคิวรอตามสิทธิ์ซีรีส์, กด Call Next แบบ FIFO ด้วย `SKIP LOCKED`, ยืนยันเริ่มแกะกล่อง (Verify & Start), จบคิว (Complete) และบังคับสิทธิ์ไม่ให้ข้ามซีรีส์/ข้ามผู้ดูแล | FR-07..FR-10, BR-03, BR-04, BR-05, BR-06, BR-07 |
| **F-04** | **Queue Ticket Inspection & Ownership Security** | แสดงข้อมูลตั๋ว Active ตนเอง (`/my-ticket`) พร้อมตัวเลขนับถอยหลัง, ดูตั๋วรายใบตาม ID พร้อมระบบบล็อกไม่ให้ Collector ดูตั๋วคนอื่น (403 Forbidden) | FR-05, FR-06, BR-04, NFR-02, NFR-05 |

---

## ⏳ ฟีเจอร์ในสปรินต์ถัดไป (Future Sprints Backlog)
* **Sprint 2 (Deliverable 2 – 29 พ.ย.):**
  * `F-05`: Queue Cancellation (ลูกค้ายกเลิกตั๋วขณะ WAITING)
  * `F-06`: Server-Enforced No-Show Workflow (พนักงานตัดสิทธิ์ตั๋วหลังครบ 120 วินาที)
  * `F-07`: Public Queue Display Board (จอบอร์ดหน้าร้านไม่ต้องล็อกอิน)
* **Sprint 3 (Final Delivery – 13 ธ.ค.):**
  * `F-08`: Daily Service Analytics & Reports (สถิติสรุปประจำวัน)
  * `F-09`: Series Availability Control (เปิด-ปิดรับคิวซีรีส์)
  * `S3-HARDEN`: Security & System Hardening (Login Rate Limit & Full Regression)
