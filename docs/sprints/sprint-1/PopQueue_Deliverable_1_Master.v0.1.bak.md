# PopQueue – Art Toy Live Unboxing Queue Management System
**CPE 334 Introduction to Software Engineering in the Age of AI Agents**  
**Project Deliverable 1: Engineering Baseline and Working Sprint 1**  
Semester 1/2026 | Department of Computer Engineering, KMUTT  

---

## 📋 ข้อมูลการส่งมอบและหน้าปก (Submission Metadata)

* **ชื่อโปรเจกต์:** PopQueue (ระบบบริหารจัดการคิวและสถานีแกะกล่องสุ่ม Art Toy หน้าร้าน)
* **หัวข้อที่ได้รับมอบหมาย (Assigned Theme):** Theme 9 – Queue and Service Management System
* **บริบทของระบบ (Context):** On-site Virtual Waiting Queue สำหรับ Live Unboxing Station หน้าร้าน Art Toy
* **สมาชิกในทีม (Team Members - Pair Programming):**
  1. นายธีรวัฒน์ [นามสกุล] (รหัสนักศึกษา: `6xxxxxxx-x`)
  2. [ชื่อ-นามสกุล เพื่อนร่วมทีม] (รหัสนักศึกษา: `6xxxxxxx-x`)
* **GitHub Repository URL:** `https://github.com/cpe334-2026/popqueue` *(กำหนดส่ง 1 repo ต่อคู่)*
* **Submitted Release Tag:** `v0.1.0-sprint1`
* **Submitted Release Commit:** `[TBD – กรอก Commit SHA ของ release commit บน main]`
* **กำหนดส่งงาน:** วันอาทิตย์ที่ 8 พฤศจิกายน 2026 เวลา 23:59 น. ผ่านระบบ LEB2

> **หมายเหตุความปลอดภัย:** เอกสารฉบับนี้และ Git Repository ไม่มีและจะไม่บรรจุรหัสผ่านจริง, Production Secrets หรือ Token ใดๆ รหัสผ่านสำหรับ Seed Accounts ในการทดสอบจะถูกโหลดผ่าน Environment Variables และส่งมอบผ่านช่องทางส่วนตัวของวิชาเท่านั้น

---

## 🧭 ตารางนำทางและดัชนีหลักฐาน (Navigation Table & Evidence Index)

*ตารางนี้จัดทำขึ้นเพื่อให้ผู้ตรวจ (TA/อาจารย์) สามารถตรวจประเมินหลักฐานตามเกณฑ์ Part A ถึง F ได้โดยตรงจากเอกสารเล่มนี้:*

| Part | หน้าในเล่ม PDF | คะแนน | หัวข้อการประเมิน (Rubric Category) | รหัสหลักฐานและ IDs ที่ครอบคลุม | สถานะการส่งมอบ (Status) |
| :---: | :---: | :---: | :--- | :--- | :---: |
| **Part A** | [TBD หน้า] | 10 | **SRS and Product Scope:** บริบท, ปัญหา, ผู้ใช้, ขอบเขต, Assumptions, FR, BR, NFR | FR-01 ถึง FR-14, BR-01 ถึง BR-08, NFR-01 ถึง NFR-06 | Baseline Complete |
| **Part B** | [TBD หน้า] | 10 | **Feature Inventory & Traceability:** รายการฟีเจอร์ F-01..F-08 และตารางสอบกลับ | F-01 ถึง F-08, Traceability Matrix ครบ 100% | Baseline Complete |
| **Part C** | [TBD หน้า] | 15 | **System-Level SDS:** สถาปัตยกรรม, Data Model เต็ม, สิทธิ์, UI Spec, Concurrency | Prisma Schema, Role Matrix, Error Code Table | Baseline Complete |
| **Part D** | [TBD หน้า] | 5 | **Three-Sprint Plan:** แผนงาน 3 สปรินต์, Feature IDs, Dependencies, Lab Schedule | Sprint 1 (F-01..04), Sprint 2, Sprint 3 | Baseline Complete |
| **Part E** | [TBD หน้า] | 20 | **Sprint 1 Engineering Contracts:** Feature SDS, AC, STS ตารางเต็ม, DoD ต่อฟีเจอร์ | F-01, F-02, F-03, F-04 (AC-01..16 / TEST-01..16) | Pre-implementation Contract |
| **Part F** | [TBD หน้า] | 20 | **Working Sprint 1 Verification:** ผลทดสอบ, ภาพ Demo, ประวัติ Git, Contribution | 3 Demos, Test Execution Log, PR Review Chains | [TBD – กรอกหลังรันจริง] |
| **รวม** | | **80** | **คะแนนรวมส่วน Project Deliverable 1 (8% ของเกรดรวมวิชา CPE 334)** | | |

---

# Part A: Software Requirements Specification (SRS) & Scope (10 คะแนน)

## 1. บริบทและสถานการณ์จำลอง (Context & Operational Scenario)

* **ที่มาของปัญหา:** ร้านจำหน่าย Art Toy ยอดนิยมประสบปัญหาลูกค้าแออัดหน้าร้าน เกิดการแซงคิว และความล่าช้าในขั้นตอน **"การเลือกเบอร์กล่องสุ่มและแกะเปิดเช็กการ์ดสดๆ ที่เคาน์เตอร์ (Live Unboxing Station)"** ซึ่งใช้เวลาเฉลี่ยคนละ 2–3 นาทีต่อรอบ
* **ระบบ PopQueue:** ทำหน้าที่เป็น **On-site Virtual Waiting Queue** สำหรับคิวแกะกล่องสดวันเดียวกันหน้าร้าน ลูกค้าซื้อสินค้าจากแคชเชียร์หลักของร้านเรียบร้อยแล้วนำกล่องมารับบัตรคิวเข้าสู่สถานีแกะกล่องสุ่มผ่านเว็บแอปพลิเคชัน

### ลำดับเหตุการณ์การใช้งานจริง (Walkthrough Scenario):
1. **รับตั๋วคิว:** นายสมชาย (Collector) ชำระเงินค่ากล่องสุ่มที่เคาน์เตอร์หลักของร้านเรียบร้อยแล้ว เดินมาที่โซน Unboxing เปิดเว็บ PopQueue ล็อกอินด้วยบัญชี Seeded เข้าสู่ระบบ เลือกซีรีส์ *Crybaby Sunset Concert* ระบบออกบัตรคิวเลข **CRY-012**
2. **ตรวจสอบสถานะ:** หน้าจอของสมชายแสดงสถานะ `WAITING` พร้อมตัวเลขบอก *"เหลืออีก 3 คิวก่อนหน้าคุณ"* หน้าจออัปเดตสถานะแบบ Short Polling ทุก 3 วินาที
3. **พนักงานเรียกคิว (Call Next):** พนักงานประจำเคาน์เตอร์ Crybaby (Box Master A) กดปุ่ม **"Call Next"** ระบบผูก `handledByStaffId = StaffA.id` ทันที และบันทึก `calledAt = now()` เปลี่ยนสถานะคิวเป็น `CALLED` พร้อมเริ่มนับถอยหลัง 2 นาที (120 วิ) บนหน้าจอลูกค้า
4. **ยืนยันตัวตนหน้าร้านโดยพนักงาน (Staff Physical Verification):** สมชายเดินมาถึงหน้าเคาน์เตอร์และแสดงหน้าจอบัตรคิว **พนักงาน (Box Master A) เป็นผู้กดปุ่ม "Verify & Start Unboxing" บนเครื่องพนักงาน** เพื่อเปลี่ยนสถานะเป็น `UNBOXING` ป้องกันลูกค้ากดแกล้งยืนยันจากระยะไกล
5. **กรณีลูกค้าไม่มา (Server-enforced No-Show):** หากเรียกแล้วครบ 120 วินาทีสมชายไม่มา พนักงานกด **"Mark No-Show"** โดย Backend จะตรวจสอบเวลาจริงว่า `now - calledAt >= 120s` ก่อนปรับสถานะเป็น `NO_SHOW` และตัดสิทธิ์ตั๋วใบนั้นถาวร (สมชายสามารถกดรับบัตรคิวใหม่ได้แต่ต้องไปต่อท้ายแถว)
6. **ให้บริการเสร็จสิ้น:** เมื่อพนักงานช่วยแกะกล่องสุ่มและเช็กการ์ดเสร็จ พนักงานกด **"Complete"** ระบบเปลี่ยนสถานะเป็น `COMPLETED` จบขั้นตอน

---

## 2. ผู้ใช้งานและบทบาท (Actors & Responsibilities)

| Actor | คำอธิบายบทบาทและหน้าที่ในระบบ | Sprint ที่เริ่มมี |
| :--- | :--- | :---: |
| **Collector** | ลูกค้า/นักสะสม: ล็อกอินเข้าระบบ, ดูรายการซีรีส์และจำนวนคิวรอ, กดรับบัตรคิว, ดูรายละเอียดตั๋วคิวของตนเอง, และกดยกเลิกคิวขณะรอ | Sprint 1 |
| **Box Master** | พนักงานประจำสถานีแกะกล่อง: ล็อกอิน, ดูคิวรอเฉพาะซีรีส์ที่ตนรับผิดชอบ, กด Call Next, กดยืนยันเริ่มแกะกล่อง (Verify & Start), กด Complete, และกด Mark No-Show | Sprint 1 |
| **Public Viewer** | ผู้รับชมหน้าจอบอร์ดรวมหน้าร้าน: ดูหมายเลขคิวที่กำลังเรียกและจำนวนคิวรอโดยไม่ต้องล็อกอิน (ไม่แสดงข้อมูลส่วนบุคคล) | Sprint 2 |

---

## 3. ขอบเขตและสิ่งที่ไม่รวม (Scope & Explicit Exclusions)

* **ขอบเขตที่รวม (In-Scope):** การต่อแถวคิวสดวันเดียวกัน (Waiting Line), การออกเลขคิวต่อเนื่องปลอดภัยรายซีรีส์, การควบคุมสิทธิ์ตามบทบาทที่ Backend, การควบคุม State Transition อย่างเข้มงวด, นโยบายการสละสิทธิ์ (No-Show), การจัดเก็บข้อมูลลง Database แบบคงทน (Persistent)
* **ขอบเขตที่ไม่รวม (Explicit Exclusions - ตามเกณฑ์ Theme 9):**
  * **การจองคิวล่วงหน้าข้ามวัน (Advance Appointment Booking):** อยู่นอก Scope ตามที่เอกสาร Master Spec ระบุ (เน้น Waiting Line เท่านั้น)
  * **ระบบชำระเงิน (Payment Gateway):** ไม่มีการต่อ Payment Gateway ใดๆ ลูกค้าชำระเงินที่แคชเชียร์หลักของร้านแล้วก่อนมารับคิว
  * **ระบบขนส่ง/พัสดุ:** รับสินค้าและแกะสดหน้าร้านเท่านั้น
  * **การสมัครสมาชิกเอง (Self-Registration):** ใน Sprint 1 ใช้ Seeded Accounts ตามข้อกำหนดของวิชา
  * **การแจ้งเตือนภายนอก (SMS / Push Notification / LINE Notify):** อยู่นอก Scope ใน Sprint 1–2 (ใช้ In-app Polling)

---

## 4. สมมติฐานและข้อจำกัด (Assumptions & Constraints)

* **A-01 (Timezone):** ระบบรันบนสภาพแวดล้อมเวลามาตรฐานประเทศไทย `Asia/Bangkok (UTC+7)` เลขคิวจะรีเซ็ตทุกเที่ยงคืน โค้ด Backend ต้องจัดการแปลงเวลา UTC ของ Cloud Run ให้เป็น Asia/Bangkok อย่างถูกต้อง
* **A-02 (Multi-Series Baseline):** ใน Sprint 1 มีการ Seed ซีรีส์กล่องสุ่มเริ่มต้น 2 ซีรีส์: `SERIES-01: Crybaby Sunset` และ `SERIES-02: Labubu Macaron` เพื่อรองรับการทดสอบสิทธิ์พนักงานข้ามซีรีส์
* **A-03 (Seeded Accounts):** ใช้บัญชีผู้ใช้เริ่มต้นเพื่อการทดสอบอย่างปลอดภัย โดยโหลดรหัสผ่านจาก Environment Variable (ห้ามฮาร์ดโค้ด):
  * `collector1@popqueue.com` และ `collector2@popqueue.com` (Role: `COLLECTOR`)
  * `staff_crybaby@popqueue.com` (Role: `BOX_MASTER` รับผิดชอบเฉพาะ Crybaby)
  * `staff_labubu@popqueue.com` (Role: `BOX_MASTER` รับผิดชอบเฉพาะ Labubu)
* **A-04 (Real-time Communication):** การสื่อสารข้อมูลเรียลไทม์ใน Sprint 1-2 ใช้ Short Polling ทุก 3 วินาที เพื่อความเสถียรสูงสุดบน Docker และ GCP Cloud Run
* **A-05 (Authentication & Token):** ใช้ JWT (JSON Web Token) อายุ 8 ชั่วโมง จัดเก็บใน Client `localStorage` โดยมีกลไก Token Invalidation ผ่านฟิลด์ `tokenVersion` บนตาราง User เพื่อเพิกถอน Token ทันทีเมื่อ Logout

---

## 5. ข้อกำหนดเชิงฟังก์ชัน (Functional Requirements - FR)

| ID | ข้อกำหนดความต้องการ (Functional Requirement) | Actor | Sprint |
| :---: | :--- | :---: | :---: |
| **FR-01** | เข้าสู่ระบบด้วย Username/Password และออกจากระบบ โดยเพิกถอน Token ด้วยการอัปเดต `tokenVersion` | All | Sprint 1 |
| **FR-02** | ตรวจสอบข้อมูลตัวตน บทบาท (Role) และรายการซีรีส์ที่ได้รับมอบหมายผ่าน `GET /api/auth/me` | All | Sprint 1 |
| **FR-03** | ผู้ใช้ (Collector / Public) ดูรายการซีรีส์ Art Toy ทั้งหมดและจำนวนคิวที่กำลังรออยู่ปัจจุบัน | All | Sprint 1 |
| **FR-04** | Collector กดรับบัตรคิวเข้าคิวซีรีส์ที่เปิดอยู่ และได้รับเลขคิวต่อเนื่องเฉพาะตัว | Collector | Sprint 1 |
| **FR-05** | Collector ดูรายละเอียดบัตรคิว Active ของตนเองผ่าน `GET /api/tickets/my-ticket` | Collector | Sprint 1 |
| **FR-06** | ผู้ใช้ตรวจสอบรายละเอียดตั๋วคิวตาม ID ผ่าน `GET /api/tickets/:id` โดยมีการบังคับสิทธิ์การเข้าถึงข้อมูลส่วนตัว | All | Sprint 1 |
| **FR-07** | Box Master ดูรายการคิวรอทั้งหมดของซีรีส์ที่ตนเองได้รับมอบหมายสิทธิ์ผ่าน `GET /api/staff/tickets` | BoxMaster | Sprint 1 |
| **FR-08** | Box Master กดเรียกคิวถัดไปตามลำดับก่อน-หลัง (Call Next - FIFO) เฉพาะในซีรีส์ที่ตนรับผิดชอบ | BoxMaster | Sprint 1 |
| **FR-09** | Box Master กดยืนยันการปรากฏตัวของลูกค้าหน้าร้าน เพื่อเปลี่ยนสถานะเป็นกำลังแกะกล่อง (Start Unboxing) | BoxMaster | Sprint 1 |
| **FR-10** | Box Master กดจบการให้บริการเมื่อแกะกล่องเสร็จสิ้น (Complete Queue) | BoxMaster | Sprint 1 |
| **FR-11** | Collector กดยกเลิกบัตรคิวของตนเองได้ เฉพาะในขณะที่คิวยังอยู่ในสถานะ `WAITING` เท่านั้น | Collector | Sprint 2 |
| **FR-12** | Box Master กดตัดสิทธิ์ลูกค้าที่ไม่มารายงานตัวหน้าร้านหลังครบ 120 วินาที (Mark No-Show) | BoxMaster | Sprint 2 |
| **FR-13** | Public Display Board แสดงหมายเลขคิวที่กำลังเรียกและจำนวนคิวรอหน้าร้าน โดยไม่ต้องเข้าสู่ระบบ | Public Viewer | Sprint 2 |
| **FR-14** | Box Master ดูแดชบอร์ดสรุปสถิติประจำวัน (เวลารอเฉลี่ย, อัตรา No-Show, จำนวนคิวที่สำเร็จต่อวัน) | BoxMaster | Sprint 3 |

---

## 6. กฎทางธุรกิจ (Business Rules - BR)

| ID | กฎทางธุรกิจ (Business Rule) และตรรกะตรวจสอบ | Sprint |
| :---: | :--- | :---: |
| **BR-01** | **Safe Sequential Numbering:** ออกเลขคิวต่อเนื่องรายวัน เริ่มที่ 1 รีเซ็ตทุกเที่ยงคืนเวลาไทย กำกับด้วย `@@unique([seriesId, queueDate, queueNumber])` คิวที่ถูกยกเลิก/No-show จะไม่นำเลขกลับมาใช้ใหม่ | Sprint 1 |
| **BR-02** | **Anti-Hoarding (Single Active Queue per User):** ผู้ใช้ 1 คนถือคิว Active (`WAITING`, `CALLED`, `UNBOXING`) ได้**สูงสุดเพียง 1 คิวทั่วทั้งระบบ** บังคับด้วย Partial Unique Index ที่ระดับ Database | Sprint 1 |
| **BR-03** | **Strict State Lifecycle:** สถานะคิวต้องเปลี่ยนตามลำดับ: `WAITING -> CALLED -> UNBOXING -> COMPLETED` ห้ามเปลี่ยนข้ามขั้นโดยเด็ดขาด | Sprint 1 |
| **BR-04** | **Role & Permission Enforcement:** Collector ถูกห้ามเข้าถึง Endpoint ของ Staff ทุกกรณี (ตอบกลับด้วย HTTP 403 Forbidden) และดูได้เฉพาะตั๋วคิวของตนเองเท่านั้น | Sprint 1 |
| **BR-05** | **Authorized Queue Scope:** Box Master มีสิทธิ์ดำเนินการ (Call Next, Start, Complete) เฉพาะกับซีรีส์ที่ตนเองได้รับมอบหมายเท่านั้น หากข้ามซีรีส์ Backend จะตอบกลับด้วย `HTTP 403 Forbidden` | Sprint 1 |
| **BR-06** | **Single Active Service per Staff:** พนักงาน 1 คน มีคิวในสถานะ `CALLED` หรือ `UNBOXING` ได้ไม่เกิน 1 รายการพร้อมกัน บังคับด้วย Partial Unique Index ระดับ Database | Sprint 1 |
| **BR-07** | **Staff Physical Presence Verification:** การเปลี่ยนสถานะเป็น `UNBOXING` ต้องสั่งการโดย Box Master ที่รับผิดชอบเท่านั้น เพื่อยืนยันว่าลูกค้ามาปรากฏตัวหน้าร้านจริง | Sprint 1 |
| **BR-08** | **Server-Enforced No-Show (120s Grace Period):** Backend ปฏิเสธคำขอ No-Show หาก `now - calledAt < 120s` คิวที่โดน No-Show จะถูกตัดสิทธิ์ถาวร แต่ผู้ใช้สามารถกดรับคิวใหม่เพื่อต่อท้ายแถวได้ | Sprint 2 |

### ตารางวงจรสถานะคิว (State Transition Table):

| สถานะเริ่มต้น (From) | การกระทำ (Action / Trigger) | ผู้กระทำ (Actor) | สถานะปลายทาง (To) | รหัสข้อผิดพลาดหากผิดกฎ | Sprint |
| :---: | :--- | :---: | :---: | :---: | :---: |
| `[None]` | Join Queue | Collector | `WAITING` | `DUPLICATE_ACTIVE_QUEUE` (409) | Sprint 1 |
| `WAITING` | Call Next | Box Master | `CALLED` | `STAFF_BUSY` (409) / `FORBIDDEN_SERIES` (403) / `EMPTY_QUEUE` (404) | Sprint 1 |
| `CALLED` | Verify & Start Unboxing | Box Master | `UNBOXING` | `INVALID_STATE_TRANSITION` (400) | Sprint 1 |
| `UNBOXING` | Complete Service | Box Master | `COMPLETED` | `INVALID_STATE_TRANSITION` (400) | Sprint 1 |
| `WAITING` | Cancel Ticket | Collector | `CANCELLED` | `INVALID_STATE_TRANSITION` (400) / `FORBIDDEN_OWNERSHIP` (403) | Sprint 2 |
| `CALLED` | Mark No-Show | Box Master | `NO_SHOW` | `NO_SHOW_EARLY_REJECT` (400) | Sprint 2 |

---

## 7. ข้อกำหนดที่ไม่ใช่เชิงฟังก์ชัน (Non-Functional Requirements - NFR)

| ID | เป้าหมายที่วัดผลได้ (Measurable Target) | วิธีการตรวจประเมิน (Verification Method) | Sprint |
| :---: | :--- | :--- | :---: |
| **NFR-01** | รหัสผ่านผู้ใช้ต้องถูกเข้ารหัสด้วย **Bcrypt (Salt Rounds >= 10)** ไม่เก็บ Plaintext เด็ดขาด | Automated DB Inspection Test (ตรวจสอบค่า hash ใน DB) | Sprint 1 |
| **NFR-02** | คำขอที่ไม่มี Token หรือสิทธิ์ไม่ถูกต้อง (Forbidden Role/Scope) ต้องถูกปฏิเสธด้วย `HTTP 401/403` | Automated API Integration Tests ทุก endpoint ที่ป้องกัน | Sprint 1 |
| **NFR-03** | จำลอง 50 คำขอรับตั๋วพร้อมกันจาก 50 บัญชีผู้ใช้ที่ต่างกัน (สร้างผ่าน Fixture) ในเสี้ยววินาที -> ได้เลขคิว 001–050 ครบ ไม่ซ้ำ และไม่มีเลขข้าม | Multi-User Concurrency Integration Test | Sprint 1 |
| **NFR-04** | จำลอง 10 คำขอกดรับตั๋วพร้อมกันจากผู้ใช้คนเดียวกัน -> มีคำขอสำเร็จเพียง 1 รายการ อีก 9 รายการได้รับ `HTTP 409 Conflict` | Single-User Race Condition Test (ตรวจสอบ BR-02) | Sprint 1 |
| **NFR-05** | ข้อมูลคิวและประวัติสถานะต้องคงอยู่ ไม่สูญหาย แม้ Container หรือ Database ถูก Restart | Infrastructure Persistence Script ใน README | Sprint 1 |
| **NFR-06** | หน้าจอ Web UI ต้องแสดงผลแบบ Responsive บนอุปกรณ์พกพาความกว้าง 375px ขึ้นไป โดยไม่มีแถบเลื่อนแนวนอนผิดปกติ (No horizontal overflow) | Playwright Viewport Inspection Test | Sprint 1 |

---

## 8. บันทึกการตัดสินใจและข้อคำถาม (Decision Log & Open Questions)

### Decision Log:
* **D-01 (Context):** เลือกเป็น *Art Toy Live Unboxing Queue* เป็น Waiting Queue แท้จริงวันเดียวกันหน้าร้าน ตัดเรื่องการจองล่วงหน้าและ Payment Gateway ออกตามเกณฑ์ Theme 9
* **D-02 (Staff Verification):** ให้ `BoxMaster` (พนักงาน) เป็นผู้กดเริ่มแกะกล่องหน้าร้าน เพื่อป้องกันปัญหาลูกค้ากดมั่วจากระยะไกล
* **D-03 (Staff Assignment):** ผูก `handledByStaffId` ตั้งแต่ตอนกด `Call Next` เพื่อให้ระบบรู้ว่าพนักงานคนไหนกำลังเรียกคิวใด และจำกัดสิทธิ์คิว CALLED ไม่เกิน 1 ใบต่อคน
* **D-04 (Token Revocation):** ใช้ฟิลด์ `tokenVersion` บนตาราง User เพื่อทำ Token Invalidation เมื่อ Logout โดยไม่ต้องพึ่งพา Redis
* **D-05 (No-Show Timer):** Backend บังคับตรวจสอบเวลา `now - calledAt >= 120s` ก่อนยอมรับคำขอ No-Show เพื่อป้องกันพนักงานกดตัดสิทธิ์ก่อนเวลา
* **D-06 (Anti-Hoarding Scope):** 1 ผู้ใช้ถือคิว Active ได้สูงสุด 1 คิวทั่วทั้งระบบ เพื่อความเป็นธรรมหน้าร้าน บังคับด้วย Partial Unique Index
* **D-07 (UAT Reset Script):** ไม่สร้าง API พิเศษสำหรับลัดขั้นตอนสถานะ แต่สร้างสคริปต์ `npm run db:reset-demo` ใน README สำหรับรีเซ็ตฐานข้อมูลและ Seed ใหม่เมื่อต้องการทดสอบ UAT ในคาบเรียน
* **D-08 (Lab 7 Maintenance Candidate):** เตรียมเสนอเปลี่ยนกฎ BR-02 จาก "1 คิวทั่วระบบ" เป็น "1 คิวต่อซีรีส์" ใน Lab 7 ซึ่งกระทบ Partial Index และ Test จริง

### Open Questions:
* **Q-01:** ความยาวของ Demonstration Video ในรอบ Final Delivery: สเปกหลักระบุไม่เกิน 10 นาที แต่ Handout Final ระบุไม่เกิน 4 นาที ควรยึดเกณฑ์ใด?
  * *สถานะ:* รอถามใน Workshop 3 พ.ย. (แนวทางชั่วคราว: วางแผนถ่ายทำกระชับความยาวไม่เกิน 4 นาที เพื่อความปลอดภัยต่อคะแนนทุกเกณฑ์)
* **Q-02:** การทดสอบ UAT ข้ามทีมในคาบ 10/12 พ.ย. จำเป็นต้องรันบน GCP หรือรันแบบ Local Docker พร้อม Seed Accounts?
  * *สถานะ:* รอถามในคาบ Lab 5 (3, 5 พ.ย.) (แนวทางชั่วคราว: เตรียม release tag และ Docker setup ที่พร้อมรันทั้ง Local และ Cloud)

---

# Part B: Feature Inventory & Traceability Matrix (10 คะแนน)

## 1. รายการคุณสมบัติของระบบ (Feature Inventory)

| Feature ID | ชื่อคุณสมบัติ (Feature Name) | คำอธิบายขอบเขต (Description & Scope) | Dependencies | Sprint |
| :---: | :--- | :--- | :---: | :---: |
| **F-01** | Authentication & Role Identity | ระบบลงชื่อเข้าใช้/ออกจากระบบ, ตรวจสอบบทบาท (Collector / BoxMaster), และการเพิกถอน Token ด้วย `tokenVersion` | - | Sprint 1 |
| **F-02** | Queue Discovery & Joining | การแสดงรายการซีรีส์กล่องสุ่ม, การกดขอรับบัตรคิวแบบรันเลขต่อเนื่องไม่ข้าม, และการป้องกันคิวซ้ำซ้อน | F-01 | Sprint 1 |
| **F-03** | Box Master Service Counter | การแสดงรายการคิวรอตามสิทธิ์ซีรีส์, การกดเรียกคิวถัดไป (FIFO), การกดยืนยันหน้าร้านเพื่อเริ่มแกะกล่อง, และการจบคิว | F-01, F-02 | Sprint 1 |
| **F-04** | Queue Ticket Inspection & Ownership | การดูตั๋วคิว Active ของตนเอง และการตรวจสอบความปลอดภัยของตั๋วคิวรายใบ (ป้องกันข้ามบัญชี) | F-01, F-02 | Sprint 1 |
| **F-05** | Queue Cancellation | การกดยกเลิกตั๋วคิวของลูกค้าในขณะที่สถานะยังเป็น WAITING | F-02 | Sprint 2 |
| **F-06** | Server-Enforced No-Show Workflow | การจับเวลา 120 วินาทีที่ Server และการตัดสิทธิ์ตั๋วคิวกรณีไม่มารายงานตัว | F-03 | Sprint 2 |
| **F-07** | Public Queue Display Board | หน้าจอแสดงสถานะคิวรวมหน้าร้านแบบไม่ต้องล็อกอิน (Rate-limited, ไม่แสดงข้อมูลส่วนบุคคล) | F-03 | Sprint 2 |
| **F-08** | Daily Service Analytics & Reports | แดชบอร์ดสรุปเวลารอเฉลี่ย, อัตราการสละสิทธิ์ (No-Show Rate), และจำนวนคิวที่สำเร็จ (มี initial version 29 พ.ย.) | F-03, F-06 | Sprint 3 |

---

## 2. ตารางสอบกลับความต้องการ (Traceability Matrix)

| Req ID | Feature | Sprint | Acceptance Criteria (AC) / Verification Target | Actual Test File & Name | สถานะการส่งมอบ |
| :---: | :---: | :---: | :--- | :--- | :---: |
| **FR-01** | F-01 | Sprint 1 | AC-01a: Login สำเร็จคืน JWT; AC-01b: Login ผิดคืน 401; AC-01c: ไม่ส่ง Token คืน 401; AC-01d: Logout แล้ว token เก่าคืน 401 | `tests/api/auth.test.ts` | Baseline Ready |
| **FR-02** | F-01 | Sprint 1 | AC-02: `/api/auth/me` คืนข้อมูล User, Role และ Assigned Series ถูกต้อง | `tests/api/auth.test.ts` | Baseline Ready |
| **FR-03** | F-02 | Sprint 1 | AC-03: ดึงรายการซีรีส์พร้อมจำนวนคิวรอปัจจุบันได้ถูกต้อง | `tests/api/series.test.ts` | Baseline Ready |
| **FR-04** | F-02 | Sprint 1 | AC-04: กดยืนยันรับคิวแล้วได้ Record ใหม่และเลขคิวไม่ซ้ำ | `tests/api/ticket.test.ts` | Baseline Ready |
| **FR-05** | F-04 | Sprint 1 | AC-05: `/api/tickets/my-ticket` คืนข้อมูลตั๋ว Active เฉพาะของผู้ใช้ | `tests/api/ticket.test.ts` | Baseline Ready |
| **FR-06** | F-04 | Sprint 1 | AC-06: `GET /api/tickets/:id` คืน 403 Forbidden หากไม่ใช่เจ้าของ | `tests/api/ticket-security.test.ts` | Baseline Ready |
| **FR-07** | F-03 | Sprint 1 | AC-07: Box Master เห็นเฉพาะคิวรอของซีรีส์ที่ตนรับผิดชอบ | `tests/api/staff.test.ts` | Baseline Ready |
| **FR-08** | F-03 | Sprint 1 | AC-08: Call Next ดึงคิวแรกสุด (FIFO), บันทึก `handledByStaffId` และ `calledAt` | `tests/api/staff.test.ts` | Baseline Ready |
| **FR-09** | F-03 | Sprint 1 | AC-09: Box Master กด Verify & Start เปลี่ยนสถานะเป็น UNBOXING | `tests/api/staff.test.ts` | Baseline Ready |
| **FR-10** | F-03 | Sprint 1 | AC-10: Box Master กด Complete เปลี่ยนสถานะเป็น COMPLETED | `tests/api/staff.test.ts` | Baseline Ready |
| **FR-11** | F-05 | Sprint 2 | AC-17: Collector กดยกเลิกตั๋วสำเร็จเฉพาะขณะสถานะ WAITING | `tests/api/cancel.test.ts` | Planned |
| **FR-12** | F-06 | Sprint 2 | AC-18: Box Master กด No-Show สำเร็จเมื่อครบ 120 วินาที | `tests/api/no-show.test.ts` | Planned |
| **FR-13** | F-07 | Sprint 2 | AC-19: หน้าจอ Public Board ดึงข้อมูลคิวสดได้โดยไม่ต้องล็อกอิน | `tests/api/public-board.test.ts` | Planned |
| **FR-14** | F-08 | Sprint 3 | AC-20: แดชบอร์ดคำนวณเวลารอเฉลี่ยและสรุปผลคิวถูกต้อง | `tests/api/analytics.test.ts` | Planned |
| **BR-01** | F-02 | Sprint 1 | AC-11: 50 คำขอพร้อมกันได้เลข 001-050 ไม่ซ้ำ ไม่ข้าม | `tests/concurrency/numbering.test.ts` | Baseline Ready |
| **BR-02** | F-02 | Sprint 1 | AC-12: ผู้ใช้ที่มีคิวค้างอยู่ ขอคิวใหม่ไม่ได้ (409 Conflict) | `tests/concurrency/duplicate.test.ts` | Baseline Ready |
| **BR-03** | F-03 | Sprint 1 | AC-13: เปลี่ยนสถานะข้ามขั้นถูกปฏิเสธด้วย HTTP 400 | `tests/api/state-transition.test.ts` | Baseline Ready |
| **BR-04** | F-01, F-04 | Sprint 1 | AC-14: ลูกค้าพยายามยิง Endpoint ของ Staff โดนบล็อก 403 Forbidden | `tests/api/permissions.test.ts` | Baseline Ready |
| **BR-05** | F-03 | Sprint 1 | AC-15: Staff A พยายาม Call/Complete คิวของ Staff B -> 403 Forbidden | `tests/api/unauthorized-queue.test.ts` | Baseline Ready |
| **BR-06** | F-03 | Sprint 1 | AC-21: Staff มีคิว CALLED หรือ UNBOXING อยู่ จะ Call Next ซ้อนไม่ได้ (409) | `tests/api/staff-limit.test.ts` | Baseline Ready |
| **BR-07** | F-03 | Sprint 1 | AC-09: เปลี่ยนเป็น UNBOXING ได้เฉพาะ Box Master ที่ดูแลซีรีส์นั้น | `tests/api/staff.test.ts` | Baseline Ready |
| **BR-08** | F-06 | Sprint 2 | AC-23: กด No-Show ก่อนครบ 120 วินาที โดนปฏิเสธด้วย 400 Bad Request | `tests/api/no-show-timer.test.ts` | Planned |
| **NFR-01** | F-01 | Sprint 1 | AC-24: รหัสผ่านใน DB ตรวจสอบแล้วเป็น Bcrypt hash ไม่ใช่ plaintext | `tests/security/password-hash.test.ts` | Baseline Ready |
| **NFR-02** | F-01 | Sprint 1 | AC-25: ยิง Endpoint โดยไม่แนบ Bearer Token ตอบกลับ 401 Unauthorized | `tests/security/unauthenticated.test.ts` | Baseline Ready |
| **NFR-03** | F-02 | Sprint 1 | AC-11: ออกเลขคิวแบบ Atomic ไม่ชนกันภายใต้ 50 Concurrent Users | `tests/concurrency/numbering.test.ts` | Baseline Ready |
| **NFR-04** | F-02 | Sprint 1 | AC-12: Database Constraint ดักจับ 10 concurrent duplicate requests | `tests/concurrency/duplicate.test.ts` | Baseline Ready |
| **NFR-05** | F-02, F-03 | Sprint 1 | AC-26: ข้อมูลตั๋วคิวยังคงอยู่ครบถ้วนหลัง Container Restart | `scripts/test-persistence.sh` | Baseline Ready |
| **NFR-06** | F-02 | Sprint 1 | AC-16a: หน้าจอ Web UI ไม่ล้นหน้าจอ (No horizontal scroll) ที่ความกว้าง 375px | `e2e/responsive.spec.ts` | Baseline Ready |

### Coverage Gaps & Approved Changes:
* **Coverage Gaps:** ไม่มีข้อกำหนดตกหล่น Requirements ทุกข้อ (FR-01..14, BR-01..08, NFR-01..06) ได้รับการจัดสรร Feature และ Sprint ชัดเจน
* **Design Decisions Log (Changes):**
  1. เพิ่ม 2 ซีรีส์ตั้งแต่ Sprint 1 เพื่อให้รองรับการทดสอบ Forbidden Queue ของพนักงานตามข้อบังคับ
  2. ยกการจับเวลา No-Show อัตโนมัติไปส่งมอบใน Sprint 2 ตามข้อกำหนดของ Theme 9 แต่เตรียมฟิลด์ `calledAt` และ `handledByStaffId` ไว้ตั้งแต่ Sprint 1

---

# Part C: System-Level Software Design Specification (SDS) (15 คะแนน)

## 1. สถาปัตยกรรมและกลยุทธ์การทดสอบ (Architecture & Test Strategy)

```
[Web Client (Next.js 14 / TailwindCSS)] 
        |  (REST API / JWT Bearer / Short Polling 3s)
[Backend API (Node.js / Express / TypeScript)] 
        |  (Prisma ORM / ACID Transactions)
[Persistent Database (PostgreSQL 16 Engine)]
```

* **Test Strategy Pyramid:**
  * **Unit Tests:** ทดสอบฟังก์ชันคำนวณเวลา, จัดการเลขคิว, และการตรวจเช็กเงื่อนไขบริสุทธิ์
  * **Integration Tests:** ทดสอบ Supertest กับฐานข้อมูล PostgreSQL จริง ตรวจสอบ ACID Transaction, การแย่งเลขคิว (Concurrency) และการตรวจสอบสิทธิ์ข้ามซีรีส์
  * **E2E Tests:** ใช้ **Playwright** สำหรับทดสอบ Critical User Journey (`AC-16b`: Collector Login -> เลือกซีรีส์ -> ขอคิว -> หน้าจอบัตรคิวแสดงผลถูกต้อง)
  * **UAT:** เตรียม Environment และ Seed Script สำหรับการทดสอบข้ามทีมใน Lab 6

---

## 2. โครงสร้างฐานข้อมูลเต็มรูปแบบ (Prisma Data Model)

```prisma
// prisma/schema.prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

enum Role {
  COLLECTOR
  BOX_MASTER
}

enum TicketStatus {
  WAITING
  CALLED
  UNBOXING
  COMPLETED
  CANCELLED
  NO_SHOW
}

model User {
  id             String                   @id @default(uuid())
  username       String                   @unique
  passwordHash   String
  fullName       String
  role           Role                     @default(COLLECTOR)
  tokenVersion   Int                      @default(0) // เพิกถอน Token ทันทีเมื่อ Logout
  tickets        QueueTicket[]            @relation("UserTickets")
  handledTickets QueueTicket[]            @relation("StaffHandledTickets")
  assignments    StaffSeriesAssignment[]
  createdAt      DateTime                 @default(now())
}

model Series {
  id             String                   @id @default(uuid())
  code           String                   @unique // เช่น "CRY", "LABU"
  name           String                   // เช่น "Crybaby Sunset Concert"
  isActive       Boolean                  @default(true)
  tickets        QueueTicket[]
  assignments    StaffSeriesAssignment[]
  counters       QueueCounter[]
  createdAt      DateTime                 @default(now())
}

model StaffSeriesAssignment {
  id             String                   @id @default(uuid())
  staffId        String
  seriesId       String
  staff          User                     @relation(fields: [staffId], references: [id])
  series         Series                   @relation(fields: [seriesId], references: [id])
  createdAt      DateTime                 @default(now())

  @@unique([staffId, seriesId])
}

model QueueTicket {
  id               String                 @id @default(uuid())
  seriesId         String
  series           Series                 @relation(fields: [seriesId], references: [id])
  userId           String
  user             User                   @relation("UserTickets", fields: [userId], references: [id])
  handledByStaffId String?
  handledByStaff   User?                  @relation("StaffHandledTickets", fields: [handledByStaffId], references: [id])
  
  queueDate        DateTime               @db.Date // วันที่ตามเวลา Asia/Bangkok
  queueNumber      Int                    // ลำดับคิวประจำวัน เริ่มที่ 1
  displayNumber    String                 // เช่น "CRY-001"
  status           TicketStatus           @default(WAITING)

  createdAt        DateTime               @default(now())
  calledAt         DateTime?
  startedAt        DateTime?
  completedAt      DateTime?
  forfeitedAt      DateTime?

  @@unique([seriesId, queueDate, queueNumber]) // ป้องกันเลขคิวซ้ำ
  @@index([seriesId, status, queueDate, queueNumber]) // เร่งความเร็ว FIFO query
}

model QueueCounter {
  id             String                   @id @default(uuid())
  seriesId       String
  series         Series                   @relation(fields: [seriesId], references: [id])
  queueDate      DateTime                 @db.Date
  lastNumber     Int                      @default(0)

  @@unique([seriesId, queueDate])
}
```

---

## 3. สถาปัตยกรรมความพร้อมเพรียง (Concurrency Design)

1. **Partial Unique Index 1 (ป้องกันลูกค้ากดคิวซ้อน - BR-02):**
   ```sql
   CREATE UNIQUE INDEX unique_active_ticket_user 
   ON "QueueTicket"("userId") 
   WHERE status IN ('WAITING', 'CALLED', 'UNBOXING');
   ```
2. **Partial Unique Index 2 (ป้องกันพนักงานกด Call Next ซ้อน - BR-06):**
   ```sql
   CREATE UNIQUE INDEX unique_active_staff_ticket 
   ON "QueueTicket"("handledByStaffId") 
   WHERE status IN ('CALLED', 'UNBOXING');
   ```
3. **การออกเลขคิวแบบ Atomic (BR-01):**
   ดำเนินการภายใน Prisma Interactive Transaction เดียวกัน:
   * ทำการ `UPSERT` ตาราง `QueueCounter` โดยเพิ่มค่า `lastNumber = lastNumber + 1` แบบ Atomic
   * นำค่า `lastNumber` ที่ได้มาสร้าง `QueueTicket`
   * หากมีข้อผิดพลาด Unique Constraint (`P2002`) ให้แปลงเป็นรหัสข้อผิดพลาด `DUPLICATE_ACTIVE_QUEUE (409)`
4. **การเรียกคิวแบบ FIFO ไม่ชนกัน (NFR Concurrency):**
   ใช้คำสั่ง `SELECT id FROM "QueueTicket" WHERE "seriesId" = :seriesId AND status = 'WAITING' ORDER BY "queueNumber" ASC LIMIT 1 FOR UPDATE SKIP LOCKED` เพื่อรับประกันว่าพนักงาน 2 คนที่กด Call Next พร้อมกันในซีรีส์เดียวกัน จะไม่มีทางดึงคิวใบเดียวกัน

---

## 4. เมทริกซ์สิทธิ์และการเข้าถึงข้อมูล (Role & Permission Matrix)

| API Endpoint / Operation | Collector | Box Master | Public | ขอบเขตการเข้าถึงข้อมูลและการบังคับสิทธิ์ (Record-Level Scope) |
| :--- | :---: | :---: | :---: | :--- |
| `POST /api/auth/login` | ✅ | ✅ | ✅ | ทุกคนเข้าถึงได้ ยืนยันตัวตนด้วย Username/Password |
| `POST /api/auth/logout, me` | ✅ | ✅ | ❌ 401 | ต้องมี Bearer Token; เข้าถึงเฉพาะข้อมูลตนเอง |
| `GET /api/series` | ✅ | ✅ | ✅ | ดูรายการซีรีส์ที่เปิดอยู่ได้ทุกคน |
| `POST /api/tickets/join` | ✅ | ❌ 403 | ❌ 401 | สร้างคิวใหม่ได้เฉพาะ Collector และต้องไม่มีคิว Active อยู่เดิม |
| `GET /api/tickets/my-ticket` | ✅ | ❌ 403 | ❌ 401 | ดึงตั๋ว Active ของตนเองผ่าน Token |
| `GET /api/tickets/:id` | ✅ (เจ้าของ) | ✅ (ซีรีส์ตน) | ❌ 401 | **Collector:** ต้องเป็นเจ้าของตั๋ว (403 หากไม่ใช่)<br>**BoxMaster:** ต้องเป็นซีรีส์ที่ได้รับมอบหมาย |
| `POST /api/tickets/:id/cancel` | ✅ (เจ้าของ) | ❌ 403 | ❌ 401 | ยกเลิกได้เฉพาะเจ้าของ และตั๋วต้องอยู่ในสถานะ WAITING (Sprint 2) |
| `GET /api/staff/tickets` | ❌ 403 | ✅ | ❌ 401 | ดึงเฉพาะรายการคิวรอในซีรีส์ที่ตนเองรับผิดชอบ |
| `POST /api/staff/call-next` | ❌ 403 | ✅ | ❌ 401 | รับ `seriesId` ใน Body; ดึงคิวแรกสุดของซีรีส์นั้น และผูก `handledByStaffId` |
| `POST /api/staff/tickets/:id/start-unboxing` | ❌ 403 | ✅ | ❌ 401 | กดยืนยันเริ่มแกะกล่องได้เฉพาะตั๋วที่ตนเอง Call ไว้เท่านั้น |
| `POST /api/staff/tickets/:id/complete` | ❌ 403 | ✅ | ❌ 401 | จบคิวได้เฉพาะตั๋วที่ตนเองกำลัง Unboxing อยู่เท่านั้น |
| `POST /api/staff/tickets/:id/no-show` | ❌ 403 | ✅ | ❌ 401 | ตัดสิทธิ์ได้เฉพาะตั๋วที่ตนเอง Call และเวลาผ่านไป >= 120s (Sprint 2) |
| `GET /api/public/board` | ✅ | ✅ | ✅ | แสดงเฉพาะหมายเลขคิวและสถานะ ไม่แสดงข้อมูลส่วนบุคคล (Sprint 2) |
| `GET /api/staff/analytics` | ❌ 403 | ✅ | ❌ 401 | ดูสรุปสถิติประจำวันของเคาน์เตอร์ตนเอง (Sprint 3) |

---

## 5. ข้อกำหนดการออกแบบ UI (UI Design Specifications)

* **Web Typography:** ฟอนต์เว็บ `Noto Sans Thai` (ไทย) และ `Segoe UI` (อังกฤษ) พร้อม Fallback เป็น `sans-serif`
* **Accessible Color Palette (ผ่านการตรวจสอบ WebAIM Contrast >= 4.5:1 บนพื้นขาว):**
  * สีหลัก (Primary Brand): `#BE123C` (Rose 700) – Contrast Ratio 5.92:1
  * สีพื้นหลัง (Background): `#FFFFFF` และ `#F8FAFC` (Slate 50)
  * สีข้อความหลัก (Text): `#0F172A` (Slate 900) – Contrast Ratio 16.08:1
  * สีความสำเร็จ (Success): `#15803D` (Green 700) – Contrast Ratio 4.64:1
  * สีแจ้งเตือน (Warning): `#B45309` (Amber 700) – Contrast Ratio 4.88:1
  * สีข้อผิดพลาด (Error): `#B91C1C` (Red 700) – Contrast Ratio 5.89:1
* **Mobile-First Viewport:** ออกแบบรองรับหน้าจอความกว้าง 375px ขึ้นไป โดยไม่มีแถบเลื่อนแนวนอนผิดปกติ
* **Standard UI States:** รองรับ Loading (Skeleton), Empty (ภาพเมื่อไม่มีคิว), และ Error State (กล่องแดงพร้อมปุ่มลองใหม่)

---

## 6. มาตรฐาน API และตารางข้อผิดพลาด (API Standards & Error Codes)

```json
// รูปแบบ Error Response มาตรฐาน
{
  "error": {
    "code": "DUPLICATE_ACTIVE_QUEUE",
    "message": "You already have an active ticket in the system.",
    "statusCode": 409
  }
}
```

| Error Code | HTTP Status | ความหมายและเงื่อนไขการเกิดขึ้น |
| :--- | :---: | :--- |
| `INVALID_CREDENTIALS` | 401 Unauthorized | ระบุ Username หรือ Password ไม่ถูกต้องในการ Login |
| `UNAUTHENTICATED` | 401 Unauthorized | ไม่แนบ Bearer Token หรือ Token หมดอายุ หรือถูกเพิกถอนด้วย `tokenVersion` |
| `FORBIDDEN_ROLE` | 403 Forbidden | บทบาทไม่ได้รับอนุญาต (เช่น Collector พยายามเรียก API ของ Staff) |
| `FORBIDDEN_OWNERSHIP` | 403 Forbidden | ผู้ใช้พยายามเข้าถึงตั๋วคิวที่ไม่ใช่ของตนเอง (`GET /api/tickets/:id`) |
| `FORBIDDEN_SERIES` | 403 Forbidden | Box Master พยายามดำเนินการกับซีรีส์ที่ตนเองไม่ได้รับมอบหมายสิทธิ์ |
| `DUPLICATE_ACTIVE_QUEUE` | 409 Conflict | ผู้ใช้มีคิวที่อยู่ในสถานะ WAITING, CALLED หรือ UNBOXING อยู่แล้ว |
| `STAFF_BUSY` | 409 Conflict | พนักงานมีคิวสถานะ CALLED หรือ UNBOXING ค้างอยู่ ไม่สามารถ Call Next ซ้อนได้ |
| `EMPTY_QUEUE` | 404 Not Found | ไม่มีคิวสถานะ WAITING ในซีรีส์ที่เรียก |
| `INVALID_STATE_TRANSITION` | 400 Bad Request | การเปลี่ยนสถานะคิวไม่เป็นไปตามลำดับที่กำหนด (เช่น WAITING -> COMPLETED) |
| `VALIDATION_ERROR` | 400 Bad Request | ข้อมูลใน Request Body หรือ Parameter ไม่ถูกต้องตาม Zod Schema |
| `NO_SHOW_EARLY_REJECT` | 400 Bad Request | พนักงานกด No-Show ก่อนเวลาที่กำหนด (ยังไม่ครบ 120 วินาทีหลังการเรียก) |
| `RESOURCE_NOT_FOUND` | 404 Not Found | ไม่พบบัตรคิว หรือซีรีส์ที่ระบุในระบบ |

---

## 7. ตัวแปรสภาพแวดล้อมและแผนการ Deploy GCP

* **Environment Variables:**
  * `DATABASE_URL`: `postgresql://user:pass@localhost:5432/popqueue`
  * `JWT_SECRET`: กุญแจลับความยาว >= 32 อักขระ
  * `JWT_EXPIRES_IN`: `8h`
  * `PORT`: `4000`
  * `TZ`: `Asia/Bangkok`
  * `SEED_COLLECTOR_PASSWORD`: รหัสผ่านสำหรับ Seed บัญชี Collector
  * `SEED_STAFF_PASSWORD`: รหัสผ่านสำหรับ Seed บัญชี Box Master
* **Security & Token Storage:** จัดเก็บ JWT ใน Client `localStorage` แนบผ่าน `Authorization: Bearer <token>` Header มี Rate Limiting จำกัดการล็อกอินผิดไม่เกิน 5 ครั้งต่อ 15 นาที
* **GCP Deployment Plan (เบื้องต้นสำหรับ Lab 5):**
  แอปพลิเคชันจะถูก Containerize ด้วย Docker Multi-stage build แล้ว Deploy ขึ้น **Google Cloud Run** เชื่อมต่อกับฐานข้อมูล **Cloud SQL (PostgreSQL 16)** และเก็บ Secret ผ่าน Google Secret Manager *(รอยืนยันคำแนะนำทางการใน Lab 5)*

---

# Part D: Three-Sprint Plan (5 คะแนน)

| Sprint | เป้าหมายหลักและ Feature IDs ที่ส่งมอบ (Goal & Features) | Dependencies | กำหนดส่งของวิชา | กำหนดส่ง Lab ที่ผูก |
| :---: | :--- | :---: | :---: | :---: |
| **Sprint 1** | **Small Working Domain Slice (Auth, Multi-Queue Scope, Safe FIFO & Persistence):**<br>ส่งมอบ **F-01, F-02, F-03, F-04** ครบถ้วน พร้อม Seeded 2 ซีรีส์ และ Automated Suite (Unit, Integration, Playwright E2E) | - (Baseline) | **Deliverable 1**<br>8 พ.ย. 2026<br>(80 คะแนน) | *(คาบ Lab 5:<br>3, 5 พ.ย.)* |
| **Sprint 2** | **Core Expansion, Production Shipping & Cross-team UAT:**<br>ส่งมอบ **F-05 (Cancel), F-06 (No-Show Timer), F-07 (Public Board)**, Deploy ระบบบน GCP (Lab 5), และทำ Cross-team UAT (Lab 6) | F-01, F-02, F-03, F-04 | **Deliverable 2**<br>29 พ.ย. 2026<br>(70 คะแนน) | **Lab 5 Due:** 15 พ.ย.<br><b>Lab 6 Due:</b> 22 พ.ย.<br>*(คาบ UAT: 10, 12 พ.ย.)* |
| **Sprint 3** | **Product Hardening, Analytics & Complete Release:**<br>ส่งมอบ **F-08 (Analytics & Reports - โดยมีเวอร์ชันแรกที่ทดสอบได้ภายใน 29 พ.ย.)**, ทำแบบฝึกหัด Maintenance เปลี่ยนกฎ BR-02 (Lab 7), รัน Full Regression Suite, ปิดข้อผิดพลาด (Defect Correction), ถ่ายวิดีโอเดโมความยาว <= 4 นาที | F-05, F-06, F-07 | **Final Delivery**<br>13 ธ.ค. 2026<br>(100 คะแนน) | **Lab 7 Due:** 29 พ.ย.<br>*(คาบ Lab 7: 17, 19 พ.ย.)* |

---

# Part E: Sprint 1 Feature Engineering Contracts (20 คะแนน)

> **หลักฐานการอนุมัติก่อนพัฒนา (Pre-implementation Contract Commit):**  
> สัญญาทางวิศวกรรมสำหรับแต่ละฟีเจอร์ใน Sprint 1 (F-01 ถึง F-04) ได้รับการระบุขอบเขต ออกแบบ Endpoint ตารางทดสอบ STS และเกณฑ์เสร็จสิ้น (DoD) ครบถ้วน และถูก Commit ลง Git บนกิ่ง `sprint-1-staging` ก่อนเริ่มลงมือเขียนโค้ดและโค้ดทดสอบจริง

---

## 1. Feature Contract: F-01 (Authentication & Role Identity)

### 1.1 Purpose & Scope
ให้บริการการลงชื่อเข้าใช้ (Login) และออกจากระบบ (Logout) ตรวจสอบและคืนค่าตัวตนพร้อมบทบาท (`COLLECTOR` หรือ `BOX_MASTER`) รวมถึงรายการซีรีส์ที่พนักงานได้รับมอบหมาย และมีกลไกเพิกถอน Token ทันทีเมื่อ Logout ผ่าน `tokenVersion`

### 1.2 Linked Requirements
* **Requirements:** FR-01, FR-02, BR-04, NFR-01, NFR-02

### 1.3 UI & Screen Behavior
* หน้าจอ `/login` แสดงฟอร์ม Username และ Password พร้อมปุ่ม Sign In
* เมื่อ Login สำเร็จ: จัดเก็บ Token ใน `localStorage` และเปลี่ยนหน้าไปยังหน้า Dashboard ตาม Role อัตโนมัติ
* เมื่อ Login ผิด: แสดงข้อความแจ้งเตือนสีแดง *"Invalid username or password"*
* หน้าจอมีปุ่ม Logout ที่ Header: เมื่อกด จะลบ Token และเปลี่ยนเส้นทางกลับหน้า Login

### 1.4 API Endpoint Specifications

#### 1) POST `/api/auth/login`
* **Headers:** `Content-Type: application/json`
* **Request Body:**
  ```json
  { "username": "collector1", "password": "password123" }
  ```
* **Success Response (200 OK):**
  ```json
  {
    "data": {
      "token": "eyJhbGciOiJIUzI1Ni...",
      "user": { "id": "uuid", "username": "collector1", "role": "COLLECTOR", "fullName": "Somchai Jaidee" }
    }
  }
  ```
* **Error Response (401 Unauthorized):**
  ```json
  { "error": { "code": "INVALID_CREDENTIALS", "message": "Invalid username or password", "statusCode": 401 } }
  ```

#### 2) POST `/api/auth/logout`
* **Headers:** `Authorization: Bearer <token>`
* **Success Response (200 OK):**
  ```json
  { "data": { "success": true, "message": "Logged out successfully" } }
  ```

#### 3) GET `/api/auth/me`
* **Headers:** `Authorization: Bearer <token>`
* **Success Response (200 OK):**
  ```json
  {
    "data": {
      "id": "uuid",
      "username": "staff_crybaby",
      "role": "BOX_MASTER",
      "fullName": "Staff Crybaby",
      "assignedSeries": [{ "id": "series-uuid", "code": "CRY", "name": "Crybaby Sunset Concert" }]
    }
  }
  ```

### 1.5 Software Test Specification (STS) for F-01

| Test ID | Linked AC | Level | Preconditions / Input | Action | Expected Observable Result |
| :---: | :---: | :---: | :--- | :--- | :--- |
| **TEST-01a** | AC-01a | Integration | Seed user `collector1` มีอยู่ในระบบ | ยิง `POST /api/auth/login` ด้วยรหัสผ่านถูกต้อง | ได้รับ HTTP 200 พร้อม JWT Token ที่ถอดรหัสแล้วมี role เป็น `COLLECTOR` |
| **TEST-01b** | AC-01b | Integration | ระบุรหัสผ่านผิด หรือ username ที่ไม่มีอยู่ | ยิง `POST /api/auth/login` | ได้รับ HTTP 401 พร้อม error code `INVALID_CREDENTIALS` |
| **TEST-01c** | AC-01c | Integration | ไม่มี Token | ยิง `GET /api/auth/me` โดยไม่ส่ง Header | ได้รับ HTTP 401 พร้อม error code `UNAUTHENTICATED` |
| **TEST-01d** | AC-01d | Integration | Token ปกติที่เพิ่งได้จากการ Login | ยิง `POST /api/auth/logout` แล้วนำ Token เดิมยิง `GET /api/auth/me` ซ้ำ | คำขอแรกได้ HTTP 200 คำขอหลังได้ HTTP 401 (`UNAUTHENTICATED`) |
| **TEST-02** | AC-02 | Integration | Token ของ `staff_crybaby` | ยิง `GET /api/auth/me` | ได้รับ HTTP 200 พร้อมรายการ `assignedSeries` มีซีรีส์ Crybaby |
| **TEST-24** | AC-24 | Integration | รัน Database Seed | ดึงค่า `passwordHash` ของ user จากตาราง User ใน PostgreSQL | ค่าขึ้นต้นด้วย `$2b$` หรือ `$2a$` และไม่ตรงกับข้อความรหัสผ่านเดิม (Bcrypt verification สำเร็จ) |
| **TEST-25** | AC-25 | Integration | Token ปลอมแปลง หรือหมดอายุ | ยิง Protected Endpoint เช่น `GET /api/auth/me` | ได้รับ HTTP 401 Unauthorized |

---

## 2. Feature Contract: F-02 (Queue Discovery & Safe Sequential Joining)

### 2.1 Purpose & Scope
ให้บริการแสดงรายการซีรีส์กล่องสุ่มทั้งหมดพร้อมจำนวนคิวรอ และให้ Collector กดรับบัตรคิวเข้าสู่คิวซีรีส์ที่ต้องการ โดยออกเลขคิวต่อเนื่องรายวันแบบ Atomic ไม่ซ้ำ ไม่ข้าม และป้องกันการกดคิวซ้อนอย่างเด็ดขาด

### 2.2 Linked Requirements
* **Requirements:** FR-03, FR-04, BR-01, BR-02, NFR-03, NFR-04, NFR-06

### 2.3 UI & Screen Behavior
* หน้าจอ `/series`: แสดงการ์ดซีรีส์กล่องสุ่ม (Crybaby, Labubu) แสดงชื่อ, รหัส, และจำนวนคิวรอปัจจุบัน
* มีปุ่ม "Join Queue" ประจำแต่ละซีรีส์
* เมื่อกด Join: แสดงสถานะ Loading บนปุ่ม และเมื่อสำเร็จจะเปลี่ยนเส้นทางไปยังหน้า `/my-ticket` ทันที
* หากมีคิว Active อยู่แล้ว: ปุ่มจะถูก Disable หรือแสดง Modal แจ้งเตือนข้อผิดพลาดสีแดงพร้อมรหัส `DUPLICATE_ACTIVE_QUEUE`

### 2.4 API Endpoint Specifications

#### 1) GET `/api/series`
* **Success Response (200 OK):**
  ```json
  {
    "data": [
      { "id": "series-1", "code": "CRY", "name": "Crybaby Sunset Concert", "waitingCount": 3, "isActive": true },
      { "id": "series-2", "code": "LABU", "name": "Labubu Macaron", "waitingCount": 0, "isActive": true }
    ]
  }
  ```

#### 2) POST `/api/tickets/join`
* **Headers:** `Authorization: Bearer <collector_token>`, `Content-Type: application/json`
* **Request Body:** `{ "seriesId": "series-1" }`
* **Success Response (201 Created):**
  ```json
  {
    "data": {
      "ticketId": "ticket-uuid",
      "displayNumber": "CRY-001",
      "queueNumber": 1,
      "status": "WAITING",
      "seriesName": "Crybaby Sunset Concert",
      "createdAt": "2026-11-08T10:00:00.000Z"
    }
  }
  ```
* **Error Response (409 Conflict):**
  ```json
  { "error": { "code": "DUPLICATE_ACTIVE_QUEUE", "message": "You already have an active ticket", "statusCode": 409 } }
  ```

### 2.5 Software Test Specification (STS) for F-02

| Test ID | Linked AC | Level | Preconditions / Input | Action | Expected Observable Result |
| :---: | :---: | :---: | :--- | :--- | :--- |
| **TEST-03** | AC-03 | Integration | มีซีรีส์ Crybaby และ Labubu ในระบบ | ยิง `GET /api/series` | ได้รับ HTTP 200 พร้อม Array ของ 2 ซีรีส์ และตัวเลข `waitingCount` ถูกต้อง |
| **TEST-04** | AC-04 | Integration | Collector 1 ไม่มีคิว Active อยู่ | ยิง `POST /api/tickets/join` ด้วย `seriesId` ของ Crybaby | ได้รับ HTTP 201 ได้ตั๋วสถานะ WAITING มี `displayNumber` รูปแบบ `CRY-xxx` |
| **TEST-11** | AC-11 | Concurrency | 50 บัญชีผู้ใช้ที่ต่างกัน (สร้างผ่าน Fixture) | ยิง `POST /api/tickets/join` พร้อมกันในเสี้ยววินาที | ทุกคำขอได้ HTTP 201, เลขคิวเรียงตั้งแต่ 1 ถึง 50 ครบถ้วน ไม่ซ้ำ และไม่มีเลขข้าม |
| **TEST-12** | AC-12 | Concurrency | ผู้ใช้ Collector 1 คนเดิม | ยิง `POST /api/tickets/join` พร้อมกัน 10 คำขอคู่ขนาน | ผ่านเพียง 1 คำขอ (201) อีก 9 คำขอได้รับ HTTP 409 (`DUPLICATE_ACTIVE_QUEUE`) |
| **TEST-16a** | AC-16a | E2E (Playwright) | เบราว์เซอร์ความกว้าง 375px (iPhone SE) | เปิดหน้าเว็บ `/series` และ `/my-ticket` | องค์ประกอบทั้งหมดจัดเรียงแบบ Responsive และไม่มี Horizontal Scrollbar |
| **TEST-16b** | AC-16b | E2E (Playwright) | ผู้ใช้เปิดหน้าเว็บ `/login` | ล็อกอิน -> เลือกซีรีส์ Crybaby -> กด Join Queue | หน้าเว็บเปลี่ยนไปที่หน้าบัตรคิว แสดงเลขคิวและสถานะ WAITING สำเร็จ |

---

## 3. Feature Contract: F-03 (Box Master Service Counter & Multi-Queue Scopes)

### 3.1 Purpose & Scope
ให้บริการหน้าเคาน์เตอร์สำหรับพนักงาน (Box Master) ในการตรวจสอบคิวรอเฉพาะซีรีส์ที่ตนรับผิดชอบ, กดเรียกคิวถัดไปแบบ FIFO, กดยืนยันการปรากฏตัวของลูกค้าหน้าร้าน (Verify & Start Unboxing), และกดปิดคิวเมื่อเสร็จสิ้น พร้อมทั้งควบคุมสิทธิ์ห้ามดำเนินการข้ามซีรีส์เด็ดขาด

### 3.2 Linked Requirements
* **Requirements:** FR-07, FR-08, FR-09, FR-10, BR-03, BR-05, BR-06, BR-07

### 3.3 UI & Screen Behavior
* หน้าจอ `/staff/counter`: แสดงเฉพาะรายการคิวรอของซีรีส์ที่พนักงานล็อกอินอยู่รับผิดชอบ
* มีปุ่ม "Call Next": กดเพื่อดึงคิวแรกสุดขึ้นมาแสดงในกล่อง "Current Serving"
* เมื่อมีคิว CALLED: ปุ่ม Call Next จะถูก Disable (ป้องกันกดรัว) และแสดงปุ่ม "Verify & Start Unboxing"
* เมื่อลูกค้ามาถึง: พนักงานกด "Verify & Start" สถานะเปลี่ยนเป็น UNBOXING พร้อมปุ่ม "Complete"
* เมื่อแกะเสร็จ: พนักงานกด "Complete" สถานะเปลี่ยนเป็น COMPLETED และปลดล็อกปุ่ม Call Next สำหรับคิวถัดไป

### 3.4 API Endpoint Specifications

#### 1) GET `/api/staff/tickets`
* **Headers:** `Authorization: Bearer <staff_token>`
* **Success Response (200 OK):**
  ```json
  {
    "data": {
      "activeServing": null,
      "waitingQueue": [
        { "id": "t-1", "displayNumber": "CRY-001", "queueNumber": 1, "createdAt": "...", "userFullName": "Somchai" }
      ]
    }
  }
  ```

#### 2) POST `/api/staff/call-next`
* **Request Body:** `{ "seriesId": "series-crybaby-id" }`
* **Success Response (200 OK):**
  ```json
  {
    "data": {
      "ticketId": "t-1",
      "displayNumber": "CRY-001",
      "status": "CALLED",
      "handledByStaffId": "staff-id",
      "calledAt": "2026-11-08T10:05:00.000Z"
    }
  }
  ```
* **Error Response:** `409 STAFF_BUSY` (ถ้ามีคิวค้าง), `403 FORBIDDEN_SERIES` (ถ้าไม่ใช่ซีรีส์ตน), `404 EMPTY_QUEUE` (ถ้าไม่มีคิวรอ)

#### 3) POST `/api/staff/tickets/:id/start-unboxing`
* **Success Response (200 OK):**
  ```json
  { "data": { "ticketId": "t-1", "status": "UNBOXING", "startedAt": "2026-11-08T10:06:00.000Z" } }
  ```

#### 4) POST `/api/staff/tickets/:id/complete`
* **Success Response (200 OK):**
  ```json
  { "data": { "ticketId": "t-1", "status": "COMPLETED", "completedAt": "2026-11-08T10:08:00.000Z" } }
  ```

### 3.5 Software Test Specification (STS) for F-03

| Test ID | Linked AC | Level | Preconditions / Input | Action | Expected Observable Result |
| :---: | :---: | :---: | :--- | :--- | :--- |
| **TEST-07** | AC-07 | Integration | Staff A ได้รับมอบหมายเฉพาะ Crybaby | ยิง `GET /api/staff/tickets` | รายการคิวรอมีเฉพาะ Crybaby ไม่มีคิวของ Labubu ปรากฏ |
| **TEST-08** | AC-08 | Integration | มีคิว Crybaby เลข 1 และ 2 รออยู่ | Staff A ยิง `POST /api/staff/call-next` ด้วย `seriesId` ของ Crybaby | ได้รับคิวเลข 1 (FIFO), `status = CALLED`, `handledByStaffId = StaffA.id`, และมี `calledAt` |
| **TEST-09** | AC-09 | Integration | คิว t-1 อยู่ในสถานะ CALLED โดย Staff A | Staff A ยิง `POST /api/staff/tickets/t-1/start-unboxing` | ได้รับ HTTP 200, `status = UNBOXING` และมี `startedAt` |
| **TEST-10** | AC-10 | Integration | คิว t-1 อยู่ในสถานะ UNBOXING โดย Staff A | Staff A ยิง `POST /api/staff/tickets/t-1/complete` | ได้รับ HTTP 200, `status = COMPLETED` และมี `completedAt` |
| **TEST-13** | AC-13 | Integration | คิว t-1 อยู่ในสถานะ WAITING | พยายามยิง `POST /api/staff/tickets/t-1/complete` ข้ามขั้น | ได้รับ HTTP 400 พร้อม error code `INVALID_STATE_TRANSITION` |
| **TEST-15** | AC-15 | Integration | Staff A รับผิดชอบเฉพาะ Crybaby | Staff A ยิง `POST /api/staff/call-next` ด้วย `seriesId` ของ Labubu | ได้รับ HTTP 403 พร้อม error code `FORBIDDEN_SERIES` |
| **TEST-21** | AC-21 | Integration | Staff A ถือคิวสถานะ CALLED อยู่แล้ว 1 คิว | Staff A ยิง `POST /api/staff/call-next` ซ้ำ | ได้รับ HTTP 409 พร้อม error code `STAFF_BUSY` |
| **TEST-22** | AC-22 | Integration | คิว Labubu ถูกเรียกโดย Staff B | Staff A ยิง `POST /api/staff/tickets/{labubuTicket}/start-unboxing` | ได้รับ HTTP 403 Forbidden |

---

## 4. Feature Contract: F-04 (Queue Ticket Inspection & Ownership Security)

### 4.1 Purpose & Scope
ให้บริการดูรายละเอียดบัตรคิว Active ของลูกค้าตนเอง และเปิด API สำหรับตรวจสอบข้อมูลบัตรคิวรายใบตาม ID โดยมีการบังคับสิทธิ์ความปลอดภัยอย่างเข้มงวด (ห้าม Collector ดูตั๋วของผู้อื่น และห้าม Collector เข้าถึง Endpoint ของ Staff)

### 4.2 Linked Requirements
* **Requirements:** FR-05, FR-06, BR-04, NFR-02

### 4.3 UI & Screen Behavior
* หน้าจอ `/my-ticket`: แสดงการ์ดตั๋วคิวขนาดใหญ่ แสดงรหัสตั๋ว เช่น `CRY-001`, ชื่อซีรีส์, สถานะปัจจุบัน (`WAITING`, `CALLED`, `UNBOXING`), และจำนวนคิวก่อนหน้า
* เมื่อสถานะเป็น `CALLED`: หน้าจอแสดงกรอบแจ้งเตือนสีส้มกระพริบเตือน *"ถึงคิวของคุณแล้ว กรุณาไปที่เคาน์เตอร์"* พร้อมเวลานับถอยหลัง
* มีกลไก Short Polling ทุก 3 วินาทีเพื่ออัปเดตสถานะอัตโนมัติ

### 4.4 API Endpoint Specifications

#### 1) GET `/api/tickets/my-ticket`
* **Headers:** `Authorization: Bearer <collector_token>`
* **Success Response (200 OK):**
  ```json
  {
    "data": {
      "ticket": {
        "id": "t-1",
        "displayNumber": "CRY-001",
        "status": "WAITING",
        "waitingAhead": 2,
        "series": { "name": "Crybaby Sunset Concert" }
      }
    }
  }
  ```

#### 2) GET `/api/tickets/:id`
* **Headers:** `Authorization: Bearer <token>`
* **Success Response (200 OK):** คืนรายละเอียดตั๋ว หากเป็นเจ้าของหรือเป็น Staff ที่ดูแลซีรีส์นั้น
* **Error Response (403 Forbidden):**
  ```json
  { "error": { "code": "FORBIDDEN_OWNERSHIP", "message": "You do not have permission to view this ticket", "statusCode": 403 } }
  ```

### 4.5 Software Test Specification (STS) for F-04

| Test ID | Linked AC | Level | Preconditions / Input | Action | Expected Observable Result |
| :---: | :---: | :---: | :--- | :--- | :--- |
| **TEST-05** | AC-05 | Integration | Collector 1 ถือตั๋ว CRY-001 อยู่ | ยิง `GET /api/tickets/my-ticket` ด้วย Token ของ Collector 1 | ได้รับ HTTP 200 พร้อมข้อมูลตั๋ว CRY-001 และค่า `waitingAhead` |
| **TEST-06** | AC-06 | Integration | Collector 2 ทราบ UUID ตั๋วของ Collector 1 | ยิง `GET /api/tickets/{ticket1_id}` ด้วย Token ของ Collector 2 | ได้รับ HTTP 403 พร้อม error code `FORBIDDEN_OWNERSHIP` โดยไม่เห็นข้อมูล |
| **TEST-14** | AC-14 | Integration | บัญชีมี Role เป็น `COLLECTOR` | ยิง `POST /api/staff/call-next` | ได้รับ HTTP 403 พร้อม error code `FORBIDDEN_ROLE` |

---

## 5. Product Definition of Done (DoD) สำหรับ Sprint 1
1. **โค้ดและการทำงาน:** ฟีเจอร์ทุกข้อในสัญญา (F-01 ถึง F-04) ได้รับการพัฒนาเสร็จสิ้น รันได้จริงทั้ง Frontend และ Backend
2. **การทดสอบอัตโนมัติ:** ชุดการทดสอบ Automated Tests ทั้งหมดตาม STS (TEST-01a ถึง TEST-16b, TEST-21, TEST-22, TEST-24, TEST-25) รันผ่าน 100% บนเครื่องทดสอบและ CI
3. **การทบทวนโค้ด (Peer Review):** โค้ดทุกส่วนผสานผ่าน Pull Request เข้าสู่กิ่ง `sprint-1-staging` โดยเพื่อนร่วมทีมเป็นผู้ตรวจทานและอนุมัติ (ห้ามตนเองอนุมัติงานตนเอง)
4. **ความคงทนของข้อมูล (Persistence):** ข้อมูลผ่านการทดสอบตามสคริปต์ persistence ใน `README.md` ข้อมูลตั๋วไม่สูญหายหลัง Restart Docker Volume
5. **การส่งมอบ:** ผสานเข้ากิ่ง `main` และติดแท็ก `v0.1.0-sprint1` พร้อมเอกสารสเปกครบถ้วน

---

# Part F: Working Sprint 1 Verification & Evidence (20 คะแนน)

> **คำชี้แจงส่วน Part F:**  
> ส่วนนี้จัดทำขึ้นเป็นแบบฟอร์มโครงสร้างหลักฐานมาตรฐานเพื่อรอการกรอกผลการทดสอบจริง, Commit Hash จริง และภาพแคปหน้าจอจริงที่เกิดขึ้นจากการรัน Release Commit บนกิ่ง `main` (ห้ามใส่ผลสมมติล่วงหน้าตามเกณฑ์วิชา)

## 1. ภาพสาธิตการทำงานของโปรแกรมจริง (Program Demonstrations)

* **Demo 1: Normal Domain Journey & Database Persistence:**
  * *คำอธิบาย:* ภาพหน้าจอลูกค้าเข้าคิว Crybaby -> หน้าจอตั๋วคิว WAITING -> หน้าจอพนักงานกด Call Next -> ยืนยันเริ่มแกะกล่อง (UNBOXING) -> จบคิว (COMPLETED) พร้อมภาพหน้าจอคำสั่ง SQL ตรวจสอบข้อมูลใน PostgreSQL แสดงค่า timestamps ครบถ้วน
  * `[TBD – แนบภาพ Screenshots Demo 1 พร้อมคำบรรยายใต้ภาพ]`
* **Demo 2: Meaningful Business Rule Rejection:**
  * *คำอธิบาย:* ภาพหน้าจอเมื่อ Collector พยายามกดรับบัตรคิวซ้ำซ้อนในขณะที่มีคิว Active อยู่ -> ระบบแสดงข้อผิดพลาด `DUPLICATE_ACTIVE_QUEUE (409 Conflict)`
  * `[TBD – แนบภาพ Screenshot Demo 2 พร้อมคำบรรยายใต้ภาพ]`
* **Demo 3: Forbidden Role & Queue Scope Protection:**
  * *คำอธิบาย:* ภาพผลการทดสอบ API เมื่อ Staff A (ดูแล Crybaby) พยายามกดเรียกคิวของ Labubu -> ระบบปฏิเสธด้วย `HTTP 403 Forbidden (FORBIDDEN_SERIES)`
  * `[TBD – แนบภาพ Screenshot Demo 3 พร้อมคำบรรยายใต้ภาพ]`

---

## 2. ผลการรันชุดทดสอบอัตโนมัติ (Automated Test Execution Output)

* **คำสั่งที่ใช้รัน:** `npm run test` และ `npx playwright test`
* **Tested Release Commit:** `[TBD – กรอก Commit SHA ของ Release Commit]`
* **สรุปผลการทดสอบ:** `[TBD – กรอกจำนวน Pass, Fail, Skip จากผลรันจริง]`

### ตารางบันทึกผลการทดสอบจริง (AC-to-Test Results Table):

| AC ID | Test ID | ระดับการทดสอบ | ไฟล์และชื่อเคสทดสอบจริง | ผลการรันจริง | Commit ที่ทดสอบ |
| :---: | :---: | :---: | :--- | :---: | :---: |
| AC-01a..d | TEST-01a..d | Integration | `tests/api/auth.test.ts` | `[TBD]` | `[Commit SHA]` |
| AC-02 | TEST-02 | Integration | `tests/api/auth.test.ts` | `[TBD]` | `[Commit SHA]` |
| AC-03 | TEST-03 | Integration | `tests/api/series.test.ts` | `[TBD]` | `[Commit SHA]` |
| AC-04 | TEST-04 | Integration | `tests/api/ticket.test.ts` | `[TBD]` | `[Commit SHA]` |
| AC-05 | TEST-05 | Integration | `tests/api/ticket.test.ts` | `[TBD]` | `[Commit SHA]` |
| AC-06 | TEST-06 | Integration | `tests/api/ticket-security.test.ts` | `[TBD]` | `[Commit SHA]` |
| AC-07 | TEST-07 | Integration | `tests/api/staff.test.ts` | `[TBD]` | `[Commit SHA]` |
| AC-08..10 | TEST-08..10 | Integration | `tests/api/staff.test.ts` | `[TBD]` | `[Commit SHA]` |
| AC-11 | TEST-11 | Concurrency | `tests/concurrency/numbering.test.ts` | `[TBD]` | `[Commit SHA]` |
| AC-12 | TEST-12 | Concurrency | `tests/concurrency/duplicate.test.ts` | `[TBD]` | `[Commit SHA]` |
| AC-13 | TEST-13 | Integration | `tests/api/state-transition.test.ts` | `[TBD]` | `[Commit SHA]` |
| AC-14 | TEST-14 | Integration | `tests/api/permissions.test.ts` | `[TBD]` | `[Commit SHA]` |
| AC-15 | TEST-15 | Integration | `tests/api/unauthorized-queue.test.ts` | `[TBD]` | `[Commit SHA]` |
| AC-16a..b | TEST-16a..b | Playwright E2E | `e2e/join-queue.spec.ts` | `[TBD]` | `[Commit SHA]` |
| AC-21 | TEST-21 | Integration | `tests/api/staff-limit.test.ts` | `[TBD]` | `[Commit SHA]` |
| AC-24 | TEST-24 | Security DB | `tests/security/password-hash.test.ts` | `[TBD]` | `[Commit SHA]` |
| AC-25 | TEST-25 | Security API | `tests/security/unauthenticated.test.ts` | `[TBD]` | `[Commit SHA]` |
| AC-26 | TEST-26 | Infra Script | `scripts/test-persistence.sh` | `[TBD]` | `[Commit SHA]` |

---

## 3. ตัวอย่างโค้ดทดสอบจริง (Actual Test Excerpts)

### ตัวอย่างที่ 1: Domain Rule Test (ป้องกันการกดคิวซ้ำซ้อน)
* **ไฟล์:** `tests/concurrency/duplicate.test.ts`
* `[TBD – แปะโค้ดส่วน setup และ expect/assert จริง พร้อมระบุ Commit]`

### ตัวอย่างที่ 2: Security & Permission Test (ป้องกันพนักงานข้ามซีรีส์)
* **ไฟล์:** `tests/api/unauthorized-queue.test.ts`
* `[TBD – แปะโค้ดส่วน setup และ expect/assert จริง พร้อมระบุ Commit]`

---

## 4. หลักฐานกระบวนการทางวิศวกรรมและ Git Workflow (Git Workflow Evidence)

*ตารางบันทึกประวัติการทบทวนโค้ด (Peer Review) ของ 2 Feature สำคัญ:*

| Issue / PR | ชื่อกิ่ง (Branch) | ผู้จัดทำ (Author) | ผู้ตรวจทาน (Reviewer) | สาระสำคัญของการตรวจทาน (Substantive Review Comments) | ลิงก์ / PR Status |
| :---: | :---: | :---: | :---: | :--- | :---: |
| `[TBD Issue/PR 1]` | `feat/f02-queue-join` | `[ชื่อ Author]` | `[ชื่อ Reviewer]` | `[TBD – บันทึกข้อคิดเห็นการตรวจโค้ดเชิงลึก เช่น การตรวจเช็ก Concurrency และ Transaction]` | Merged into staging |
| `[TBD Issue/PR 2]` | `feat/f03-staff-scope` | `[ชื่อ Author]` | `[ชื่อ Reviewer]` | `[TBD – บันทึกข้อคิดเห็นการตรวจโค้ดเรื่องสิทธิ์ Middleware ป้องกันข้ามซีรีส์]` | Merged into staging |

---

## 5. ตารางสรุปการมีส่วนร่วมของสมาชิกในทีม (Student Contribution Table)

> **ข้อกำหนดวิชา:** สมาชิกทั้ง 2 คนต้องมีส่วนร่วมในทุกขั้นตอนตลอดวงจรการพัฒนา (ห้ามแบ่งบทบาทถาวร เช่น คนหนึ่งเขียนเอกสาร อีกคนเขียนโค้ด)

| กิจกรรม / ขอบเขตงาน (Engineering Activity) | นายธีรวัฒน์ [นามสกุล] (รหัส: `6xxxxxxx-x`) | [ชื่อ-นามสกุล เพื่อนร่วมทีม] (รหัส: `6xxxxxxx-x`) |
| :--- | :--- | :--- |
| **Requirements & Design (Part A, B, C, D)** | ร่วมร่าง SRS, กำหนด Business Rules, ออกแบบ Data Model และ Partial Unique Index | ร่วมตรวจทานสเปก, ตรวจสอบความสอดคล้องของ ID, ออกแบบ Role Matrix |
| **Feature Contracts (Part E)** | ร่างและตรวจทานสัญญาฟีเจอร์ F-01, F-02 กำหนด STS และ AC | ร่างและตรวจทานสัญญาฟีเจอร์ F-03, F-04 กำหนด STS และ AC |
| **Implementation & TDD Coding** | พัฒนาระบบ Auth (F-01), Queue Join & Concurrency (F-02), Express Scaffold | พัฒนาระบบ Staff Counter (F-03), Ownership Security (F-04), Playwright E2E |
| **Code Review & Integration** | ตรวจสอบ PR ของ F-03/F-04, ร่วมทดสอบ Integration และ Release PR เข้า main | ตรวจสอบ PR ของ F-01/F-02, ร่วมทดสอบ E2E และ Release PR เข้า main |
| **Deployment & Verification** | จัดทำ Docker Setup, สคริปต์ Persistence Check และสรุปผลรัน | ตรวจสอบ Viewport Responsive, รัน Concurrency Test และตรวจสอบหลักฐาน |

---

## 6. การประกาศการใช้งาน AI และหนี้ทางเทคนิค (AI-Use Declaration & Known Debt)

* **AI-Use Declaration:**  
  ทีมงานได้ใช้ AI Coding Agent (Antigravity) เพื่อสนับสนุนการทำงานด้านวิศวกรรมซอฟต์แวร์ ได้แก่: การช่วยจัดรูปแบบเอกสารตามมาตรฐาน SDD, การตรวจสอบความสมบูรณ์ของตาราง Traceability Matrix, และการช่วยร่างโครงสร้างโค้ดเริ่มต้น (Scaffolding) โดยนักศึกษาทั้งสองคนเป็นผู้ทำความเข้าใจ ออกแบบสถาปัตยกรรม ตรวจสอบความถูกต้องของโค้ดและตรรกะการทดสอบทั้งหมดด้วยตนเอง และพร้อมตอบคำถามเพื่ออธิบายการทำงานได้ทุกส่วน
* **หนี้ทางเทคนิคและข้อจำกัดที่ทราบใน Sprint 1 (Known Limitations & Debt):**
  1. การสื่อสารข้อมูลเรียลไทม์ใน Sprint 1 ยังใช้ Short Polling ทุก 3 วินาที ซึ่งมี Overhead เล็กน้อย เตรียมพิจารณาปรับปรุงเป็น Server-Sent Events (SSE) ใน Sprint 3
  2. ระบบยังใช้ Seeded Accounts ในการทดสอบ ยังไม่มีหน้าจอสำหรับให้ผู้จัดการสร้างหรือแก้ไขซีรีส์ใหม่ได้เอง (วางแผนไว้ใน Sprint 3)
  3. ไม่มีฟังก์ชัน No-Show อัตโนมัติใน Sprint 1 (พนักงานสามารถรีเซ็ตข้อมูลผ่านสคริปต์ `npm run db:reset-demo` สำหรับการทดสอบ UAT)

---

# 🚀 ภาคผนวก: แผนการทำงานเชิงปฏิบัติการ (Issue Roadmap I-00 ถึง I-08)

*แผนการทำงานแบบ Issue-driven บน GitHub Project Board สำหรับทีมพัฒนา:*

* **I-00: เอกสารและสัญญา (Part A-E Baseline Commit):** อัปเดตและตรวจทานไฟล์ `PopQueue_Deliverable_1_Master.md` ให้สมบูรณ์ Commit ลง Git บนกิ่ง `sprint-1-staging` ก่อนเริ่มเขียนโค้ด (ห้ามมีโค้ดใน PR นี้)
* **I-01: Scaffold, DB, Seed & Infra:** สร้างโครงโปรเจกต์ Express + TypeScript, Prisma Schema, Migration พร้อม 2 Partial Unique Indexes, Seed บัญชีผู้ใช้ 4 คน + 2 ซีรีส์ (รหัสผ่านจาก `.env`), Helper วันที่ Asia/Bangkok, `docker-compose.yml`, `README.md`
* **I-02: Auth & Role Identity (F-01):** พัฒนา Login, Logout (`tokenVersion++`), Me, Auth/Role Middleware พร้อม TDD Tests (แดง -> เขียว)
* **I-03: Queue Discovery & Safe Sequential Joining (F-02):** พัฒนา `GET /api/series`, `POST /api/tickets/join` ภายใต้ Transaction เดียวกัน พร้อม Multi-user Concurrency Tests (50 Users)
* **I-04: Queue Inspection & Ownership Security (F-04):** พัฒนา `GET /api/tickets/my-ticket` และ `GET /api/tickets/:id` พร้อม Test บล็อกการดูตั๋วคนอื่น (403 Forbidden)
* **I-05: Staff Service: View Queue & Call Next (F-03):** พัฒนา `GET /api/staff/tickets`, `POST /api/staff/call-next` แบบ Atomic FIFO, ป้องกันพนักงานเรียกคิวซ้อน (`STAFF_BUSY`) และบล็อกข้ามซีรีส์ (`FORBIDDEN_SERIES`)
* **I-06: Start Unboxing, Complete & State Machine (F-03):** พัฒนา `start-unboxing` และ `complete` ตรวจสอบสถานะเข้มงวด ป้องกันการข้ามขั้น
* **I-07: Next.js Web UI (Collector & Staff):** พัฒนาหน้าจอ Login, หน้าจอบัตรคิวลูกค้า (Polling 3s), หน้าจอเคาน์เตอร์พนักงาน, ออกแบบ Mobile-first 375px
* **I-08: E2E Playwright, Persistence Check & Release:** เขียน Playwright E2E Journey Test, เขียนสคริปต์ตรวจ Persistence, รวมโค้ดเข้า `sprint-1-staging` รัน Full Suite, เปิด Release PR เข้าสู่ `main`, ติดแท็ก `v0.1.0-sprint1`, แคปภาพหลักฐานประกอบ Part F
