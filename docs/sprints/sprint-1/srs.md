# Software Requirements Specification (SRS) – Sprint 1 Engineering Baseline

**Course:** CPE 334 Introduction to Software Engineering in the Age of AI Agents  
**Project:** PopQueue – Art Toy Live Unboxing Queue Management System  
**Deliverable:** Project Deliverable 1 (Sprint 1) | **Due:** 8 November 2026, 23:59 via LEB2  
**Target Release:** `v0.1.0-sprint1` | **Status:** Baseline Approved  

---

## 📌 Master Document Reference
เอกสารฉบับสมบูรณ์ที่พร้อมแปลงเป็น PDF ส่งมอบ LEB2 ถูกจัดเก็บไว้ที่:  
👉 **[docs/PopQueue_Deliverable_1_Master.md (Part A)](../PopQueue_Deliverable_1_Master.md#part-a-software-requirements-specification-srs--scope-10-คะแนน)**

---

## 🎯 บริบทและขอบเขตเฉพาะของ Sprint 1 (Sprint 1 Operational Context)
* **Domain Scenario:** ระบบบริหารจัดการคิวเสมือนหน้าร้าน (On-site Virtual Waiting Queue) วันเดียวกัน สำหรับสถานีแกะกล่องสุ่ม Art Toy หน้าร้าน (เช่น Pop Mart – Crybaby, Labubu)
* **Actors ใน Sprint 1:**
  1. `Collector`: นักสะสม/ลูกค้าหน้าร้าน (ดูซีรีส์, กดรับบัตรคิว, ดูสถานะตั๋วตนเอง)
  2. `Box Master`: พนักงานประจำสถานีแกะกล่อง (ดูคิวเฉพาะซีรีส์ตน, Call Next, Verify & Start, Complete)
  3. `Public Viewer`: ผู้ชมบอร์ดหน้าร้าน (ดูซีรีส์และจำนวนคิวรอโดยไม่ต้องล็อกอิน)
* **Explicit Exclusions (ตามเกณฑ์ Theme 9):**
  * ไม่มีระบบจองล่วงหน้าข้ามวัน (Waiting Line เท่านั้น)
  * ไม่มีระบบชำระเงิน / Payment Gateway (ลูกค้าชำระเงินที่แคชเชียร์หลักก่อนมารับคิว)
  * ไม่มีการสมัครสมาชิกเอง / จัดการบัญชีขั้นสูง (ใช้ Seeded Accounts ใน Sprint 1)
  * ไม่มีการแจ้งเตือนภายนอก (ใช้ Short Polling 3 วินาที)

---

## 📋 ข้อกำหนดที่บังคับใช้และทดสอบใน Sprint 1 (Active Requirements)
* **Functional Requirements (FR-01 ถึง FR-10):**
  * `FR-01`: Login/Logout เพิกถอน Token ด้วย `tokenVersion`
  * `FR-02`: ตรวจสอบตัวตนและ Role ผ่าน `/api/auth/me`
  * `FR-03`: ดูรายการซีรีส์และจำนวนคิวรอปัจจุบัน
  * `FR-04`: Collector กดรับบัตรคิวซีรีส์ที่เปิดอยู่ได้เลขคิวต่อเนื่อง
  * `FR-05`: Collector ดูตั๋ว Active ตนเองผ่าน `/api/tickets/my-ticket`
  * `FR-06`: ดูรายละเอียดตั๋วตาม ID พร้อมการบังคับสิทธิ์เจ้าของ
  * `FR-07`: Box Master ดูคิวรอเฉพาะซีรีส์ที่ได้รับมอบหมาย
  * `FR-08`: Box Master กด Call Next (FIFO)
  * `FR-09`: Box Master กด Verify & Start Unboxing เมื่อลูกค้ามาปรากฏตัวหน้าร้านจริง
  * `FR-10`: Box Master กด Complete จบการให้บริการ
* **Business Rules (BR-01 ถึง BR-07, BR-09):**
  * `BR-01`: ออกเลขคิวต่อเนื่องรายวัน เริ่มที่ 1 รีเซ็ตเที่ยงคืนเวลาไทย ไม่นำเลขกลับมาใช้ซ้ำ
  * `BR-02`: ลูกค้า 1 คนถือตั๋ว Active ได้สูงสุด 1 ใบทั้งระบบ (บังคับด้วย Partial Unique Index)
  * `BR-03`: State Lifecycle เคร่งครัด: `WAITING -> CALLED -> UNBOXING -> COMPLETED`
  * `BR-04`: Collector ถูกบล็อกไม่ให้เรียก Endpoint ของ Staff (403 Forbidden)
  * `BR-05`: Box Master ดำเนินการได้เฉพาะซีรีส์ที่ได้รับมอบหมายเท่านั้น (403 Forbidden)
  * `BR-06`: พนักงาน 1 คนมีตั๋ว CALLED/UNBOXING ได้ไม่เกิน 1 ใบพร้อมกัน (Partial Unique Index)
  * `BR-07`: การเปลี่ยนเป็น UNBOXING ต้องทำโดย Box Master ผู้ Call เท่านั้น (`FORBIDDEN_NOT_HANDLER`)
  * `BR-09`: ซีรีส์ที่ปิด (`isActive=false`) ไม่รับตั๋วใหม่ (409 `SERIES_CLOSED`)
* **Non-Functional Requirements (NFR-01 ถึง NFR-06):**
  * `NFR-01`: Bcrypt Cost >= 10
  * `NFR-02`: 401/403 ครบทุก Protected Route
  * `NFR-03`: 50 Concurrent Users ได้เลข 1..50 ไม่ซ้ำ ไม่ข้าม
  * `NFR-04`: 10 Concurrent Duplicate Requests สำเร็จ 1 ที่เหลือ 409
  * `NFR-05`: ข้อมูลตั๋วไม่สูญหายหลัง Restart Database Container
  * `NFR-06`: หน้าจอ Web UI ไม่ล้นหน้าจอที่ความกว้าง 375px

---

## ⏳ ข้อกำหนดที่เลื่อนไปส่งมอบในสปรินต์ถัดไป (Deferred Requirements)
* **Sprint 2 (Deliverable 2 – 29 พ.ย.):** FR-11 (ลูกค้ายกเลิกตั๋ว), FR-12 / BR-08 (No-Show Timer 120 วินาทีตรวจที่ Server), FR-13 (Public Display Board)
* **Sprint 3 (Final – 13 ธ.ค.):** FR-14 (Analytics เวลารอเฉลี่ย), FR-15 (เปิด-ปิดซีรีส์ผ่านระบบ), NFR-07 (Login Rate Limit)
