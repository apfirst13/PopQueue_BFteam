# Software Requirements Specification (SRS) – PopQueue Engineering Baseline (v1.4)
> **Course:** CPE 334 Introduction to Software Engineering in the Age of AI Agents (Semester 1/2026, KMUTT)  
> **Project:** PopQueue – Theme 9: Queue and Service Management System (*Art Toy Live Unboxing Station*)  
> **Deliverable:** Project Deliverable 2 (Core Expansion Sprint 2 & Genuine Progress Sprint 3)  
> **Master Contract Reference:** [`docs/sprints/sprint-2/PopQueue_Deliverable_2_Master.md`](file:///docs/sprints/sprint-2/PopQueue_Deliverable_2_Master.md)  
> **Single Source of Truth:** Master Contract v1.4 เป็นแหล่งความจริงเดียวของข้อกำหนดและสัญญาทางวิศวกรรมทั้งหมด

---

## 1. บริบทและขอบเขตของระบบ (System Scope & Operational Context)

PopQueue เป็นระบบบริหารจัดการคิวเสมือนหน้าร้าน (On-site Virtual Queue) วันเดียวกัน สำหรับสถานีแกะกล่องสุ่ม Art Toy หน้าร้าน (เช่น Pop Mart – Crybaby, Labubu) เพื่อแก้ปัญหาการยืนออหน้าร้านและเปิดโอกาสให้นักสะสมเดินเลือกชมสินค้าอื่นขณะรอเรียกคิว

### 1.1 ผู้ใช้งานและบทบาท (Actors & Responsibilities)
1. **Collector (`Role.COLLECTOR`):** นักสะสม/ลูกค้าหน้าร้าน (ดูซีรีส์, รับบัตรคิว, ดูสถานะตั๋วตนเอง, กดยกเลิกคิวตนเอง `F-05`)
2. **Box Master (`Role.BOX_MASTER`):** พนักงานประจำสถานีแกะกล่อง (ดูคิวเฉพาะซีรีส์ตน, Call Next, Verify & Start, Complete, ตัดสิทธิ์ No-Show 120s `F-06`, เปิด-ปิดซีรีส์ `F-09`, ดูสถิติ `F-08`)
3. **Public Viewer:** บุคคลทั่วไปหน้าร้าน (ดูจอแสดงผลคิวสาธารณะ `F-07` โดยไม่ต้องล็อกอิน)

### 1.2 ขอบเขตที่ไม่รวม (Explicit Exclusions)
* ไม่มีระบบจองล่วงหน้าข้ามวัน (Waiting Line วันเดียวกันเท่านั้น)
* ไม่มีระบบชำระเงิน / Payment Gateway (ลูกค้าชำระเงินที่แคชเชียร์หลักก่อนรับคิว)
* ไม่มีการส่ง SMS / Push Notification ภายนอก (ใช้ Polling 3 วินาทีบนเว็บแอปพลิเคชัน)
* ไม่มีระบบ Auto No-Show อัตโนมัติโดยไม่มีคนกด (Sprint 2 รองรับเฉพาะ Manual Trigger โดย Box Master)

---

## 2. ข้อกำหนดเชิงฟังก์ชัน (Functional Requirements – FR)

| FR ID | ชื่อข้อกำหนด | Target Sprint | สรุปพฤติกรรมของระบบ | สถานะปัจจุบัน |
| :---: | :--- | :---: | :--- | :---: |
| **FR-01** | Authentication & Token | 1 | เข้าสู่ระบบด้วย username/password ตรวจสอบด้วย Bcrypt และออก Stateless JWT พร้อม `tokenVersion` | Tested (`v0.3.0`) |
| **FR-02** | Logout & Token Invalidation | 1 | ออกจากระบบโดยการเพิ่ม `tokenVersion` ทำให้ Token เดิมถูกเพิกถอนทันที | Tested (`v0.3.0`) |
| **FR-03** | Series Discovery | 1 | ดูรายการซีรีส์กล่องสุ่มทั้งหมด พร้อมจำนวนคิวรอในแต่ละซีรีส์ | Tested (`v0.3.0`) |
| **FR-04** | Queue Join (Atomic FIFO) | 1, Lab 7 | กดรับบัตรคิวในซีรีส์ที่เปิดอยู่ ได้รับเลขคิวต่อเนื่องรายวัน เริ่มที่ 1 รีเซ็ตเที่ยงคืนเวลาไทย | Tested (`v0.3.0`) |
| **FR-05** | My Ticket Inspection | 1, Lab 7 | ดูตั๋วคิว Active ของตนเอง รองรับการถือคิวข้ามซีรีส์พร้อมกัน (Multi-Ticket Array) | Tested (`v0.3.0`) |
| **FR-06** | Ticket Security Guard | 1 | ดูรายละเอียดตั๋วตาม ID มีการบังคับสิทธิ์ความเป็นเจ้าของ (Collector) หรือซีรีส์ที่ดูแล (Staff) | Tested (`v0.3.0`) |
| **FR-07** | Staff Queue Overview | 1 | Box Master ดูรายการคิวรอและตั๋วที่กำลังให้บริการเฉพาะซีรีส์ที่ได้รับมอบหมาย | Tested (`v0.3.0`) |
| **FR-08** | Staff Call Next (FIFO) | 1 | Box Master กดเรียกคิวถัดไปตามลำดับ FIFO ด้วย Row Lock `LIMIT 1 FOR UPDATE SKIP LOCKED` | Tested (`v0.3.0`) |
| **FR-09** | Staff Start Unbox | 1 | Box Master ตรวจสอบตัวตนลูกค้าหน้าร้านและกดยืนยันเริ่มแกะกล่อง (เปลี่ยนเป็น `UNBOXING`) | Tested (`v0.3.0`) |
| **FR-10** | Staff Complete | 1 | Box Master กดจบการให้บริการเมื่อแกะกล่องเสร็จสิ้น (เปลี่ยนเป็น `COMPLETED`) | Tested (`v0.3.0`) |
| **FR-11** | Queue Cancellation | **2** | Collector กดยกเลิกตั๋ว `WAITING` ของตนเองได้ทันที ปลดล็อกโควตาให้จองใหม่ได้ | `Contract Ready` |
| **FR-12** | 120s No-Show Timeout | **2** | Box Master ตัดสิทธิ์ลูกค้าที่ไม่มาแสดงตัวภายใน 120 วินาที ปลดล็อกตนเองพ้นจาก `STAFF_BUSY` | `Contract Ready` |
| **FR-13** | Public Queue Board | **2** | จอแสดงผลคิวหน้าร้าน ไม่ต้องล็อกอิน ปลอด PII 100% เรียงคิวตาม `queueNumber` (Int) | `Contract Ready` |
| **FR-14** | Daily Service Analytics | 3 | สรุปสถิติบริการประจำวัน (เวลารอเฉลี่ย, อัตรา No-Show, จำนวนคิว) แยกตาม `queueDate` | `Contract Ready` |
| **FR-15** | Series Availability Control | **3 (Progress)** | Box Master สลับสถานะเปิด-ปิดซีรีส์ที่ดูแล ตั๋วค้างเดิมยังคงให้บริการต่อได้จนจบ (Baseline รองรับ 409 SERIES_CLOSED แล้ว; PATCH /status และ UI Switch อยู่ในสถานะ Working Progress สำหรับ G4) | `Working Progress (Contract Ready)` |

---

## 3. กฎทางธุรกิจของระบบ (Business Rules – BR)

* **BR-01 (Monotonic Numbering & Non-reuse):** ตัวนับ `QueueCounter` เพิ่มขึ้นทางเดียว ไม่มีการถอยค่ากลับ และไม่มีการนำหมายเลขคิวที่ยกเลิกหรือ No-Show กลับมาใช้ซ้ำ (**EV-B03**)
* **BR-02 v2 (Active Ticket Quota per Series):** ลูกค้า 1 คนสามารถถือตั๋ว Active ได้สูงสุด 1 ใบต่อซีรีส์ แต่สามารถเข้าคิวข้ามซีรีส์พร้อมกันได้ บังคับด้วย Partial Unique Index `unique_active_ticket_user_series` (**EV-A02**)
* **BR-03 (Strict State Lifecycle):** วงจรสถานะตั๋วคิวเป็นแบบทิศทางเดียว ไม่สามารถย้อนกลับได้:  
  `WAITING ──► CALLED ──► UNBOXING ──► COMPLETED`  
  `WAITING ──► CANCELLED`  
  `CALLED ──► NO_SHOW`
* **BR-04 (Role-Based Access Control):** การจำกัดสิทธิ์ตรวจสอบที่ Backend อย่างเคร่งครัด Collector ห้ามเรียก Endpoint ของ Staff (`403 FORBIDDEN_ROLE` — **EV-B01**)
* **BR-05 (Staff Series Assignment Scope):** Box Master สามารถดูและดำเนินการได้เฉพาะซีรีส์ที่ตนได้รับมอบหมายเท่านั้น (`403 FORBIDDEN_SERIES`)
* **BR-06 (Single Active Serving per Staff):** Box Master 1 คนสามารถมีตั๋วในสถานะ `CALLED` หรือ `UNBOXING` ได้ไม่เกิน 1 ใบพร้อมกัน บังคับด้วย Partial Unique Index `unique_active_staff_ticket` (**EV-A02**)
* **BR-07 (Handler Exclusive Verification):** การเปลี่ยนสถานะเป็น `UNBOXING` หรือ `NO_SHOW` ต้องทำโดย Box Master ผู้กด Call ตั๋วนั้นไว้เท่านั้น (`403 FORBIDDEN_NOT_HANDLER` — **EV-A04**)
* **BR-08 (120-Second No-Show Window):** การตัดสิทธิ์ No-Show ทำได้เมื่อเวลาผ่านไปนับจาก `calledAt` ไม่น้อยกว่า 120 วินาที (`Δt ≥ 120s`) ตรวจสอบโดย Application Clock ที่ระดับ Server
* **BR-09 (Closed Series Join Prevention):** ซีรีส์ที่ปิด (`isActive = false`) จะปฏิเสธคำขอรับบัตรคิวใหม่ด้วย HTTP `409 SERIES_CLOSED`

---

## 4. ข้อกำหนดที่ไม่ใช่เชิงฟังก์ชัน (Non-Functional Requirements – NFR)

* **NFR-01 (Password Hashing):** รหัสผ่านจัดเก็บด้วย Bcrypt Salt Rounds $\ge 10$
* **NFR-02 (Data Privacy & Zero PII):** Public Board และ Unauthenticated Endpoints ต้องไม่มี PII หลุดใน Payload ทั้งชื่อ key และค่า string
* **NFR-03 (Concurrency Safety):** รองรับ 50 คำขอ Join พร้อมกันโดยได้เลขคิวต่อเนื่อง ไม่ซ้ำ ไม่ข้าม
* **NFR-04 (Race Guard):** รองรับ 10 คำขอจองซ้ำพร้อมกันในซีรีส์เดิม สำเร็จเพียง 1 คำขอ ที่เหลือถูกปฏิเสธด้วย `409 DUPLICATE_ACTIVE_QUEUE`
* **NFR-05 (Data Persistence):** ข้อมูลตั๋วไม่สูญหายหลัง Cloud Run Container Restart หรือ Cloud SQL Redeployment (**EV-B07**)
* **NFR-06 (Responsive Interface):** Web UI รองรับการแสดงผลบนหน้าจอขนาด 375px (Mobile) จนถึง 1920×1080 (TV Display) โดยไม่ล้นจอ
* **NFR-07 (Brute Force Protection):** จำกัดการส่งคำขอ Login ไม่เกิน 10 ครั้งต่อ 15 นาทีต่อ IP เกินกว่านั้นคืน HTTP `429 RATE_LIMIT_EXCEEDED`
