# PopQueue – Art Toy Live Unboxing Queue Management System
**CPE 334 Introduction to Software Engineering in the Age of AI Agents**  
**Project Deliverable 1: Engineering Baseline and Working Sprint 1**  
Semester 1/2026 | Department of Computer Engineering, KMUTT  
**เวอร์ชันเอกสาร:** v0.2 (ปรับปรุงหลังทบทวนกับ Handout และ Peer Review – ดูประวัติใน Part E หัวข้อ 0)

---

## 📋 ข้อมูลการส่งมอบและหน้าปก (Submission Metadata)

> ⚠️ ทุกช่อง `[TBD]` ต้องกรอกจากข้อมูลจริงก่อนส่ง ห้ามเดาหรือใส่ค่าสมมติ

* **ชื่อโปรเจกต์:** PopQueue (ระบบบริหารจัดการคิวและสถานีแกะกล่องสุ่ม Art Toy หน้าร้าน)
* **หัวข้อที่ได้รับมอบหมาย (Assigned Theme):** Theme 9 – Queue and Service Management System
* **บริบทของระบบ (Context):** On-site Virtual Waiting Queue สำหรับ Live Unboxing Station หน้าร้าน Art Toy (Waiting line วันเดียวกันเท่านั้น ไม่มีการจองล่วงหน้า)
* **สมาชิกในทีม (Team Members – Pair Programming):**
  1. นายธีรวัฒญ์ รุ่งสว่าง (รหัสนักศึกษา: `67070507206`)
  2. นายอภิวัชร์ ปัณฐธนาพัฒน์ (รหัสนักศึกษา: `67070507209`)
* **GitHub Repository URL (1 repo ต่อคู่):** `https://github.com/apfirst13/qdrive-license-queue`
* **Submitted Release Tag:** `v0.1.0-sprint1` *(ตั้งชื่อตามแผน – ยืนยันหลัง tag จริง)*
* **Submitted Release Commit:** `[TBD – Commit SHA ของ release commit บน main]`
* **Tested Commit (ชุดเดียวกับ Release Commit):** `[TBD]`
* **กำหนดส่งงาน:** วันอาทิตย์ที่ 8 พฤศจิกายน 2026 เวลา 23:59 น. ผ่านระบบ LEB2 (PDF เดียว ครบ Part A–F)

> **หมายเหตุความปลอดภัย:** เอกสารนี้และ Git Repository ไม่บรรจุรหัสผ่านจริง, Production Secrets หรือ Token รหัสผ่านของ Seed Accounts โหลดจาก Environment Variables และส่งมอบผ่านช่องทางส่วนตัวของวิชาเท่านั้น ข้อมูลทั้งหมดเป็นข้อมูลสังเคราะห์ (Synthetic Data)

---

## 🧭 สารบัญและตารางนำทาง (Table of Contents & Navigation Table)

> หมายเหตุ: เลขหน้าต้องกรอกตามหน้าจริงของ PDF ฉบับสุดท้าย (หลังสร้าง PDF) และต้องมีสารบัญพร้อมเลขหน้าตาม Handout §4.1

| Part | หน้าใน PDF | คะแนน | หัวข้อประเมิน | IDs ที่เกี่ยวข้อง | หลักฐานการรันจริง |
| :---: | :---: | :---: | :--- | :--- | :--- |
| **A** | `[TBD]` | 10 | SRS & Scope: บริบท, Stakeholder, Actors, ขอบเขต/ข้อยกเว้น, Assumptions, FR/BR/NFR, Decisions | FR-01..15, BR-01..09, NFR-01..07, A-01..07, D-01..14, Q-01..03 | – |
| **B** | `[TBD]` | 10 | Feature Inventory & Traceability, Coverage Gaps, Changes | F-01..F-09, S3-HARDEN, ตาราง Req→Feature→Sprint→AC→TEST | ผลจริงอยู่ Part F หน้า `[TBD]` |
| **C** | `[TBD]` | 15 | System-Level SDS: Architecture, Data/Migration/Seed, Auth, UI Navigation, API, Role Matrix, Config, GCP | Role Matrix, Prisma Schema, Error Codes, Seed Data | – |
| **D** | `[TBD]` | 5 | Three-Sprint Plan: Goal, Features, Dependencies, Outcome, Sprint 1 scope & feasibility | Sprint 1–3, F-01..F-09 | – |
| **E** | `[TBD]` | 20 | Sprint 1 Contracts: Feature SDS, AC, STS, DoD, Revision History | F-01..F-04, AC-01..AC-39, TEST-01..TEST-39 | ผลจริงอยู่ Part F หน้า `[TBD]` |
| **F** | `[TBD]` | 20 | Working Sprint 1: Setup, Demos, Test Results, TDD, Git/PR/Board, Contribution, Limitations | AC-01..39 ↔ TEST-01..39, Issues I-00..I-08 | `[TBD – กรอกหลังรันจริง]` |

---

# Part A: Software Requirements Specification (SRS) & Scope (10 คะแนน)

## 1. บริบท ปัญหา และ Stakeholder (Context, Problem & Stakeholders)

* **ปัญหา:** ร้านจำหน่าย Art Toy (เช่น Pop Mart – Crybaby, Labubu) มีลูกค้าแออัดหน้าสถานีแกะกล่อง เกิดการแซงคิว และไม่มีหลักฐานลำดับที่ตรวจสอบได้ ขั้นตอน **"เลือกกล่องสุ่มและแกะเช็กการ์ดสดที่เคาน์เตอร์ (Live Unboxing Station)"** ใช้เวลาประมาณ 2–3 นาทีต่อราย
* **ระบบ PopQueue:** เป็น **On-site Virtual Waiting Queue** แบบวันเดียวกัน ลูกค้าชำระเงินที่แคชเชียร์หลักเรียบร้อยแล้ว จึงนำกล่องมารับบัตรคิวผ่านเว็บแอป (ระบบนี้ไม่เกี่ยวข้องกับการชำระเงิน)

| Stakeholder | ผลประโยชน์ / ปัญหาที่เผชิญ | บทบาทในระบบ |
| :--- | :--- | :--- |
| ลูกค้า / นักสะสม | ไม่รู้ลำดับ ไม่ต้องการยืนรอแออัด ต้องการความเป็นธรรม | Collector |
| พนักงานสถานีแกะกล่อง | ต้องเรียกคิวตามลำดับ ไม่ให้ลูกค้าแย่งกัน และยืนยันตัวตนหน้าร้านได้ | Box Master |
| ผู้จัดการร้าน | ต้องการเห็นสถิติเวลารอ/อัตราไม่มา (Sprint 3) และควบคุมการเปิด–ปิดซีรีส์ | Box Master (สิทธิ์ระดับซีรีส์) – ไม่มี Role แยกใน Baseline |
| ผู้ชมหน้าร้าน | ดูว่าคิวไหนกำลังถูกเรียก | Public Viewer |

### ลำดับเหตุการณ์การใช้งานจริง (Walkthrough Scenario)
1. **รับตั๋วคิว:** คุณสมชาย (Collector `collector1`) ชำระเงินที่แคชเชียร์เรียบร้อย เดินมาโซน Unboxing เปิดเว็บ PopQueue ล็อกอินด้วยบัญชี Seeded เลือกซีรีส์ *Crybaby Sunset Concert* ระบบออกบัตรคิว **CRY-012**
2. **ตรวจสอบสถานะ:** หน้าจอแสดงสถานะ `WAITING` และ *"เหลืออีก 3 คิวก่อนหน้าคุณ"* อัปเดตด้วย Short Polling ทุก 3 วินาที
3. **พนักงานเรียกคิว (Call Next):** Box Master (`staff_crybaby`) กด **"Call Next"** ระบบผูก `handledByStaffId` และบันทึก `calledAt` เปลี่ยนสถานะเป็น `CALLED` หน้าจอลูกค้าแสดงข้อความ *"ถึงคิวแล้ว กรุณามาที่เคาน์เตอร์"* และตัวนับถอยหลัง 120 วินาที (Sprint 1 แสดงผลเท่านั้น ยังไม่มีผลต่อสถานะ)
4. **ยืนยันตัวตนหน้าร้านโดยพนักงาน:** สมชายมาถึงเคาน์เตอร์ **พนักงานเป็นผู้กด "Verify & Start Unboxing"** เพื่อเปลี่ยนสถานะเป็น `UNBOXING` (ลูกค้ากดเองไม่ได้ เพื่อกันการกดยืนยันระยะไกลโดยไม่อยู่หน้าร้านจริง)
5. **ให้บริการเสร็จสิ้น:** พนักงานกด **"Complete"** สถานะเป็น `COMPLETED` พนักงานเรียกคิวถัดไปได้
6. **กรณีลูกค้าไม่มา (Sprint 2):** หากครบ 120 วินาทีและลูกค้าไม่มา พนักงานกด **"Mark No-Show"** Backend ตรวจ `now - calledAt >= 120s` แล้วเปลี่ยนเป็น `NO_SHOW` (ลูกค้ารับคิวใหม่ได้ แต่ต่อท้ายแถว)
7. **กรณียกเลิก (Sprint 2):** ลูกค้ายกเลิกตั๋วของตนเองได้ขณะ `WAITING`

> **ข้อจำกัดของ Sprint 1 (เปิดเผยชัดเจน):** Sprint 1 ยังไม่มี Cancel/No-Show หากลูกค้าถูก `CALLED` แล้วไม่มา พนักงานคนนั้นจะติด `STAFF_BUSY` ทางแก้ชั่วคราวคือสคริปต์ `npm run db:reset-demo` (ดู D-09 และความเสี่ยงใน Part D)

---

## 2. ผู้ใช้งานและบทบาท (Actors & Responsibilities)

| Actor | หน้าที่ในระบบ | Sprint |
| :--- | :--- | :---: |
| **Collector** | ล็อกอิน/ล็อกเอาต์, ดูรายการซีรีส์และจำนวนคิวรอ, กดรับบัตรคิว, ดูตั๋วของตนเอง, ยกเลิกคิวขณะ WAITING | 1 (ยกเลิก: 2) |
| **Box Master** | ล็อกอิน/ล็อกเอาต์, ดูคิวรอเฉพาะซีรีส์ที่ได้รับมอบหมาย, Call Next, Verify & Start, Complete, Mark No-Show, ดูสถิติ, เปิด–ปิดซีรีส์ที่ตนดูแล | 1 (No-Show: 2, สถิติ/เปิดปิดซีรีส์: 3) |
| **Public Viewer** | ผู้ไม่ล็อกอิน: `GET /api/series` (Sprint 1) และหน้า Public Board แสดงหมายเลขที่กำลังเรียก/จำนวนคิวรอ ไม่แสดงข้อมูลส่วนบุคคล (Sprint 2) | 1 / 2 |

> ไม่มี Role "Manager/Admin" ใน Baseline ฟังก์ชันระดับผู้จัดการ (สถิติ, เปิด–ปิดซีรีส์) เป็นสิทธิ์ของ Box Master ที่ได้รับมอบหมายซีรีส์นั้น (D-01)

---

## 3. ขอบเขตและสิ่งที่ไม่รวม (Scope & Explicit Exclusions)

* **In-Scope:** Waiting line วันเดียวกัน, เลขคิวต่อเนื่องปลอดภัยรายซีรีส์, ควบคุมสิทธิ์ที่ Backend, State Machine เข้มงวด, Cancel/No-Show (Sprint 2), Public Board (Sprint 2), สถิติรายวัน (Sprint 3), เก็บข้อมูลถาวรใน PostgreSQL
* **Explicit Exclusions:**
  * **การจองล่วงหน้า (Advance Booking):** อยู่นอก Scope ตาม Theme 9
  * **ระบบชำระเงิน / Payment Gateway / การจำลองสถานะชำระเงิน:** ไม่มีเลย ถือว่าลูกค้าชำระที่แคชเชียร์หลักก่อนมารับคิว (Theme 9 ไม่ต้องการ Payment)
  * **ระบบขนส่ง/พัสดุ:** แกะสดหน้าร้านเท่านั้น
  * **Self-Registration / กู้รหัสผ่าน / Admin จัดการบัญชี:** ใช้ Seeded Accounts
  * **การแจ้งเตือนภายนอก (SMS/Push/LINE):** ใช้ In-app Polling
  * **หน้าจอสร้าง/แก้ซีรีส์:** ไม่มี ซีรีส์เปลี่ยนผ่าน Seed (ยกเว้นการเปิด–ปิดซีรีส์ใน Sprint 3 – FR-15)

---

## 4. สมมติฐานและข้อจำกัด (Assumptions & Constraints)

* **A-01 (Timezone):** `queueDate` คำนวณตาม `Asia/Bangkok (UTC+7)` เลขคิวเริ่ม 1 ใหม่ทุกเที่ยงคืนเวลาไทย โค้ดต้องไม่พึ่ง Timezone ของเครื่อง/Cloud Run และต้องทดสอบได้ด้วย Clock ที่ inject ได้
* **A-02 (Seed Series):** Seed 3 ซีรีส์: `CRY – Crybaby Sunset Concert` (เปิด), `LAB – Labubu Macaron` (เปิด), `SKP – Skullpanda Closed Demo` (**ปิด** `isActive=false` ใช้ทดสอบ BR-09) เพื่อรองรับการทดสอบสิทธิ์ข้ามซีรีส์ (Theme 9 บังคับใน Sprint 1)
* **A-03 (Seeded Accounts):** ล็อกอินด้วย **username** (ไม่ใช่อีเมล) รหัสผ่านโหลดจาก Environment Variable เท่านั้น (ห้ามฮาร์ดโค้ด/commit)

  | Username | Role | สิทธิ์ซีรีส์ | จุดประสงค์ |
  | :--- | :---: | :--- | :--- |
  | `collector1` … `collector6` | COLLECTOR | – | 6 บัญชี ให้ผู้ทดสอบ/UAT ข้ามทีมใช้ได้หลายรอบก่อน Cancel/No-Show (D-09) |
  | `staff_crybaby` | BOX_MASTER | CRY | พนักงานหลักซีรีส์ Crybaby |
  | `staff_crybaby2` | BOX_MASTER | CRY | พนักงานคนที่สองซีรีส์เดียวกัน ใช้ทดสอบ "ไม่ใช่ผู้ Call" (`FORBIDDEN_NOT_HANDLER`) และ Call Next พร้อมกัน |
  | `staff_labubu` | BOX_MASTER | LAB | พนักงานซีรีส์ Labubu ใช้ทดสอบ "ข้ามซีรีส์" (`FORBIDDEN_SERIES`) |
* **A-04 (Real-time):** Sprint 1–3 ใช้ Short Polling ทุก 3 วินาที (ไม่ใช้ SSE/WebSocket – ไม่อยู่ในแผน)
* **A-05 (Auth & Token):** JWT (HS256) อายุ 8 ชั่วโมง เก็บใน `localStorage` ส่งผ่าน `Authorization: Bearer` เพิกถอนด้วย `tokenVersion` (ดู Part C §3, D-04, D-11)
* **A-06 (Sprint 1 Operations):** ไม่มี Cancel/No-Show ใน Sprint 1 ผู้ทดสอบต้องใช้ `db:reset-demo` เมื่อติดสถานะ CALLED ค้าง (D-09)
* **A-07 (Single Day Operation):** ระบบรองรับการต่อคิวของ "วันนี้" เท่านั้น ตั๋วที่ค้างข้ามวันไม่ถูกจัดการอัตโนมัติ (ผู้ใช้ Active ข้ามวันได้ถือว่า edge case นอก Baseline – บันทึกใน Known Limitations)

---

## 5. ข้อกำหนดเชิงฟังก์ชัน (Functional Requirements – FR)

| ID | ข้อกำหนด (พฤติกรรมที่สังเกตได้) | Actor | Sprint |
| :---: | :--- | :---: | :---: |
| **FR-01** | เข้าสู่ระบบด้วย username/password ได้ Token; ออกจากระบบแล้ว Token เดิมใช้ไม่ได้ทันที | All | 1 |
| **FR-02** | `GET /api/auth/me` คืนตัวตน, Role และรายการซีรีส์ที่ได้รับมอบหมาย (สำหรับ Box Master) | All (ล็อกอิน) | 1 |
| **FR-03** | ดูรายการซีรีส์ทั้งหมด สถานะเปิด/ปิด และจำนวนคิว WAITING ของวันนี้ โดยไม่ต้องล็อกอิน | Public/All | 1 |
| **FR-04** | Collector กดรับบัตรคิวของซีรีส์ที่ **เปิดอยู่** ได้เลขคิวรายวันเฉพาะซีรีส์ (เช่น `CRY-001`) | Collector | 1 |
| **FR-05** | Collector ดูตั๋ว Active ของตนเอง (สถานะ, จำนวนคิวก่อนหน้า) ผ่าน `GET /api/tickets/my-ticket` | Collector | 1 |
| **FR-06** | ดูรายละเอียดตั๋วตาม ID ผ่าน `GET /api/tickets/:id` – Collector เห็นเฉพาะของตน, Box Master เห็นเฉพาะซีรีส์ที่ดูแล | Collector, Box Master | 1 |
| **FR-07** | Box Master ดูรายการคิวรอและคิวที่ตนกำลังให้บริการ เฉพาะซีรีส์ที่ได้รับมอบหมาย | Box Master | 1 |
| **FR-08** | Box Master กด Call Next เรียกคิว WAITING ที่เลขน้อยสุด (FIFO) ของซีรีส์ที่ตนรับผิดชอบ | Box Master | 1 |
| **FR-09** | Box Master (ผู้ Call) กด Verify & Start Unboxing เมื่อลูกค้ามาถึงหน้าเคาน์เตอร์จริง (`CALLED → UNBOXING`) | Box Master | 1 |
| **FR-10** | Box Master (ผู้ Call) กด Complete เมื่อแกะกล่องเสร็จ (`UNBOXING → COMPLETED`) | Box Master | 1 |
| **FR-11** | Collector ยกเลิกตั๋วของตนเองได้เฉพาะสถานะ `WAITING` | Collector | 2 |
| **FR-12** | Box Master ทำ Mark No-Show ได้เมื่อ `now - calledAt >= 120s` (ตรวจที่ Server) | Box Master | 2 |
| **FR-13** | Public Board แสดงหมายเลขที่กำลัง CALLED/UNBOXING และจำนวนคิวรอ โดยไม่แสดงข้อมูลส่วนบุคคล ไม่ต้องล็อกอิน | Public Viewer | 2 |
| **FR-14** | Box Master ดูสถิติรายวันของซีรีส์ที่ดูแล: เวลารอเฉลี่ย, อัตรา No-Show, จำนวนคิวสำเร็จ (Collector ดูไม่ได้) | Box Master | 3 |
| **FR-15** | Box Master เปิด–ปิดรับคิวของซีรีส์ที่ตนดูแลได้ (เปลี่ยน `isActive`) | Box Master | 3 |

---

## 6. กฎทางธุรกิจ (Business Rules – BR)

| ID | กฎทางธุรกิจ | Sprint |
| :---: | :--- | :---: |
| **BR-01** | **Safe Sequential Numbering:** เลขคิวรายวันรายซีรีส์เริ่ม 1 ต่อเนื่อง ไม่ซ้ำ ไม่ข้าม รีเซ็ตเที่ยงคืนเวลาไทย เลขของตั๋วที่ออกจากคิวแล้ว (Complete/Cancel/No-Show) ไม่ถูกนำกลับมาใช้ | 1 |
| **BR-02** | **Single Active Ticket per User:** ผู้ใช้ 1 คนมีตั๋วสถานะ `WAITING/CALLED/UNBOXING` ได้ไม่เกิน 1 ใบทั้งระบบ บังคับที่ Database | 1 |
| **BR-03** | **Strict State Lifecycle:** `WAITING → CALLED → UNBOXING → COMPLETED` ห้ามข้ามขั้น/ย้อนกลับ (Sprint 2 เพิ่ม `WAITING → CANCELLED`, `CALLED → NO_SHOW`) | 1 |
| **BR-04** | **Role & Ownership:** Collector เรียก Endpoint ของ Staff ไม่ได้ (403) และเห็นเฉพาะตั๋วของตน; Box Master เรียก Endpoint ของ Collector (join/my-ticket) ไม่ได้ (403) | 1 |
| **BR-05** | **Authorized Series Scope:** Box Master ทำ Call Next / Start / Complete / No-Show ได้เฉพาะซีรีส์ที่ตนได้รับมอบหมาย มิฉะนั้น 403 `FORBIDDEN_SERIES` | 1 |
| **BR-06** | **Single Active Service per Staff:** พนักงานมีตั๋ว `CALLED/UNBOXING` ได้ไม่เกิน 1 ใบพร้อมกัน บังคับที่ Database | 1 |
| **BR-07** | **Handler-Only Verification:** เฉพาะ Box Master ที่ Call ตั๋วนั้น (`handledByStaffId`) เท่านั้นที่ Start/Complete ได้ (พนักงานซีรีส์เดียวกันคนอื่น → 403 `FORBIDDEN_NOT_HANDLER`) ลูกค้ากด Verify เองไม่ได้ | 1 |
| **BR-08** | **Server-Enforced No-Show:** ปฏิเสธ No-Show หาก `now - calledAt < 120s` ตั๋วที่ No-Show ถูกตัดสิทธิ์ แต่ผู้ใช้รับคิวใหม่ต่อท้ายแถวได้ | 2 |
| **BR-09** | **Closed Series:** ซีรีส์ `isActive=false` ไม่รับตั๋วใหม่ (409 `SERIES_CLOSED`) ตั๋วที่มีอยู่เดิมให้บริการต่อได้ | 1 |

### ตารางวงจรสถานะคิว (State Transition Table)

| จาก (From) | Action | ผู้กระทำ | ไป (To) | ข้อผิดพลาดหากผิดกฎ | Sprint |
| :---: | :--- | :---: | :---: | :--- | :---: |
| `[None]` | Join Queue | Collector | `WAITING` | `DUPLICATE_ACTIVE_QUEUE` 409, `SERIES_CLOSED` 409, `RESOURCE_NOT_FOUND` 404, `FORBIDDEN_ROLE` 403 | 1 |
| `WAITING` | Call Next | Box Master (ซีรีส์ตน) | `CALLED` | `STAFF_BUSY` 409, `FORBIDDEN_SERIES` 403, `EMPTY_QUEUE` 404 | 1 |
| `CALLED` | Verify & Start Unboxing | Box Master (ผู้ Call) | `UNBOXING` | `INVALID_STATE_TRANSITION` 400, `FORBIDDEN_SERIES` 403, `FORBIDDEN_NOT_HANDLER` 403 | 1 |
| `UNBOXING` | Complete | Box Master (ผู้ Call) | `COMPLETED` | `INVALID_STATE_TRANSITION` 400, `FORBIDDEN_SERIES` 403, `FORBIDDEN_NOT_HANDLER` 403 | 1 |
| `WAITING` | Cancel | Collector (เจ้าของ) | `CANCELLED` | `INVALID_STATE_TRANSITION` 400, `FORBIDDEN_OWNERSHIP` 403 | 2 |
| `CALLED` | Mark No-Show | Box Master (ผู้ Call) | `NO_SHOW` | `NO_SHOW_EARLY_REJECT` 400, `FORBIDDEN_NOT_HANDLER` 403 | 2 |

*คู่สถานะอื่นทั้งหมดที่ไม่อยู่ในตาราง (เช่น `CALLED → COMPLETED`, `WAITING → UNBOXING`, `COMPLETED → *`) ถือเป็น `INVALID_STATE_TRANSITION`*

---

## 7. ข้อกำหนดที่ไม่ใช่เชิงฟังก์ชัน (NFR)

| ID | เป้าหมายที่วัดผลได้ | วิธีตรวจประเมิน | Sprint |
| :---: | :--- | :--- | :---: |
| **NFR-01** | รหัสผ่านเก็บเป็น Bcrypt cost ≥ 10 ไม่เก็บ plaintext | DB integration test: อ่าน `passwordHash`, ตรวจ pattern `$2[aby]$NN$` และ NN ≥ 10 | 1 |
| **NFR-02** | ทุก Protected Endpoint ปฏิเสธคำขอที่ไม่มี/Token เสีย (401) และ Role/Scope ผิด (403) โดยไม่คืนข้อมูลส่วนตัว | API integration test แบบ parameterized ทุก route ใน Role Matrix | 1 |
| **NFR-03** | **Concurrency ของ BR-01:** 50 คำขอ join พร้อมกันจาก 50 บัญชีต่างกัน → 201 ทั้งหมด เลข 1–50 ไม่ซ้ำไม่ข้าม | Multi-user concurrency test | 1 |
| **NFR-04** | **Concurrency ของ BR-02:** 10 คำขอ join พร้อมกันจากผู้ใช้เดียว → สำเร็จ 1, ได้ 409 อีก 9, ใน DB มีตั๋ว Active 1 ใบ | Single-user race test | 1 |
| **NFR-05** | ข้อมูลตั๋ว/ตัวนับคิวคงอยู่หลัง Restart Database Container และเลขคิวถัดไปต่อเนื่อง | Persistence script (Node.js) ผูกกับ README | 1 |
| **NFR-06** | UI ใช้งานได้ที่ความกว้าง 375px โดยไม่มี horizontal overflow ทุกหน้า Sprint 1 | Playwright viewport test | 1 |
| **NFR-07** | Login rate limit: ผิดเกิน 5 ครั้ง/15 นาที/บัญชี+IP → 429 `TOO_MANY_REQUESTS` (ปิดได้ผ่าน config ในโหมดทดสอบ) | API integration test | 3 |

> NFR-03 และ NFR-04 คือเป้าหมายการ "พิสูจน์ภายใต้ความพร้อมเพรียง" ของ BR-01 และ BR-02 ตามลำดับ (ไม่ใช่ requirement อิสระ) ระบุแยกไว้เพื่อให้ Test วัดได้ชัดเจน

---

## 8. บันทึกการตัดสินใจและข้อคำถาม (Decision Log & Open Questions)

| ID | การตัดสินใจ | เหตุผล / สถานะ |
| :---: | :--- | :--- |
| **D-01** | เลือก *Art Toy Live Unboxing Queue*; ตัด Advance Booking, Payment, Role Manager/Admin | ตาม Theme 9; ให้ Box Master รับสิทธิ์ผู้จัดการระดับซีรีส์ – **ตัดสินแล้ว** |
| **D-02** | Box Master เท่านั้นที่กด Verify & Start | กันลูกค้ากดยืนยันระยะไกล – **ตัดสินแล้ว** |
| **D-03** | ผูก `handledByStaffId` ตอน Call Next | ให้รู้ว่าใครเรียกใคร และจำกัด 1 ตั๋ว Active/พนักงาน – **ตัดสินแล้ว** |
| **D-04** | เพิกถอน Token ด้วย `tokenVersion` บน User | Stateless JWT แต่เพิกถอนได้ ไม่ต้องใช้ Redis – **ตัดสินแล้ว** |
| **D-05** | No-Show ตรวจเวลาที่ Server (120s) | กันพนักงานตัดสิทธิ์ก่อนเวลา (Sprint 2) – **ตัดสินแล้ว** |
| **D-06** | 1 ผู้ใช้ถือตั๋ว Active ได้ 1 ใบทั้งระบบ | ความเป็นธรรมหน้าร้าน – **ตัดสินแล้ว** |
| **D-07** | ไม่มี API ลัดสถานะ ใช้ `npm run db:reset-demo` | รักษา State Machine – **ตัดสินแล้ว** |
| **D-08** | เสนอเปลี่ยน BR-02 เป็น "1 คิวต่อซีรีส์" เป็นโจทย์ Lab 7 | **รออนุมัติจาก TA/อาจารย์** – ยังไม่ผูกเป็นแผนยืนยัน |
| **D-09** | Sprint 1 ยังไม่มี Cancel/No-Show: Seed collector 6 บัญชี + `db:reset-demo` + ออกแบบ UAT case ให้จบ journey; **เปิดเผยเป็น Known Limitation** (ไม่ใช่ทางแก้ถาวร) | ลดความเสี่ยง Lab 6 UAT (10–12 พ.ย.); ถ้า Sprint 1 เสร็จก่อนกำหนดจะพิจารณาดึง F-05/F-06 ขึ้นมา – **ตัดสินแล้ว (ชั่วคราว)** |
| **D-10** | ออกเลขคิวด้วย Raw SQL `INSERT … ON CONFLICT DO UPDATE … RETURNING` ใน Transaction เดียวกับการสร้างตั๋ว | Prisma `upsert` ไม่รับประกัน atomic increment ภายใต้ race – **ตัดสินแล้ว** |
| **D-11** | Logout เพิ่ม `tokenVersion` → Token ทุกอุปกรณ์ของผู้ใช้นั้นใช้ไม่ได้ | ยอมรับ trade-off (เรียบง่ายกว่ามี jti denylist) – **ตัดสินแล้ว** |
| **D-12** | Login Rate Limit เลื่อนเป็น NFR-07 / Sprint 3 (S3-HARDEN) และไม่เปิดใน Sprint 1 | ป้องกันชนกับ test login ผิดซ้ำและ UAT – **ตัดสินแล้ว** |
| **D-13** | ตอบ 404 `RESOURCE_NOT_FOUND` เมื่อไม่มีตั๋ว/ซีรีส์ก่อน แล้วจึงตรวจสิทธิ์ (403) UUID เดาไม่ได้ จึงยอมรับ | ลำดับตรวจสอบกำหนดตายตัวใน Part C §6 – **ตัดสินแล้ว** |
| **D-14** | ไม่สัญญา SSE และหน้าจัดการซีรีส์เต็มรูปแบบ; Sprint 3 มี F-08, F-09 (เปิด–ปิดซีรีส์) และ S3-HARDEN | ให้ Debt สอดคล้องกับ FR/Feature – **ตัดสินแล้ว** |

### Open Questions
* **Q-01:** ความยาววิดีโอ Final: Spec หลักบอก ≤ 10 นาที แต่ Final handout บอก ≤ 4 นาที – *สถานะ:* รอถาม Workshop 3 พ.ย. (ชั่วคราว: ทำให้ ≤ 4 นาที)
* **Q-02:** UAT ข้ามทีมใน Lab 6 ต้องรันบน GCP หรือ Local Docker + Seed ได้ และอนุญาตให้ใช้ `db:reset-demo` หรือไม่ – *สถานะ:* รอถามคาบ Lab 5
* **Q-03:** TA ยอมรับขั้นตอนเพิ่ม `CALLED → UNBOXING` (Staff Verify) เป็น Sprint 1 slice เทียบเท่าตัวอย่าง "call next + complete" หรือไม่ – *สถานะ:* รอยืนยันกับ TA ใน Workshop (ถือว่า Depth ไม่น้อยกว่าตัวอย่าง)

---

# Part B: Feature Inventory & Traceability Matrix (10 คะแนน)

## 1. รายการคุณสมบัติของระบบ (Feature Inventory)

| Feature ID | ชื่อ | คำอธิบายขอบเขต | Requirements ที่เกี่ยวข้อง | Dependencies | Sprint |
| :---: | :--- | :--- | :--- | :---: | :---: |
| **F-01** | Authentication & Role Identity | Login/Logout, `/me`, Auth + Role middleware, Bcrypt, เพิกถอน Token ด้วย `tokenVersion` | FR-01, FR-02, BR-04, NFR-01, NFR-02 | – | 1 |
| **F-02** | Queue Discovery & Safe Joining | รายการซีรีส์, รับบัตรคิวเลขต่อเนื่องปลอดภัย, กันคิวซ้อน, กันซีรีส์ปิด, หน้าจอ `/series` | FR-03, FR-04, BR-01, BR-02, BR-09, NFR-03, NFR-04, NFR-06 | F-01 | 1 |
| **F-03** | Box Master Service Counter | คิวรอตามสิทธิ์, Call Next (FIFO), Verify & Start, Complete, State Machine, สิทธิ์ซีรีส์/ผู้ Call, หน้าจอ `/staff/counter` | FR-07, FR-08, FR-09, FR-10, BR-03, BR-04, BR-05, BR-06, BR-07 | F-01, F-02 | 1 |
| **F-04** | Ticket Inspection & Ownership | `my-ticket`, `tickets/:id`, ตรวจสิทธิ์เจ้าของ/ซีรีส์, Persistence, หน้าจอ `/my-ticket` | FR-05, FR-06, BR-04, NFR-02, NFR-05 | F-01, F-02 | 1 |
| **F-05** | Queue Cancellation | Collector ยกเลิกตั๋วขณะ WAITING | FR-11, BR-03, BR-01 | F-02, F-04 | 2 |
| **F-06** | Server-Enforced No-Show | จับเวลา 120 วินาทีที่ Server, ตัดสิทธิ์ตั๋ว | FR-12, BR-08, BR-03 | F-03 | 2 |
| **F-07** | Public Queue Display Board | จอบอร์ดสาธารณะไม่ต้องล็อกอิน ไม่แสดงข้อมูลส่วนตัว | FR-13 | F-03 | 2 |
| **F-08** | Daily Service Analytics | สถิติเวลารอเฉลี่ย, No-Show Rate, จำนวนสำเร็จ (initial version ภายใน 29 พ.ย.) | FR-14 | F-03, F-06 | 3 |
| **F-09** | Series Availability Control | Box Master เปิด–ปิดซีรีส์ที่ตนดูแล | FR-15, BR-09, BR-05 | F-02, F-03 | 3 |
| **S3-HARDEN** | Security & Hardening (System Responsibility) | Login rate limit, regression suite, defect correction, usability | NFR-07 | F-01 | 3 |

---

## 2. ตารางสอบกลับ (Requirement → Feature → Sprint → AC → TEST)

> กฎการตั้ง ID: **TEST-nn ตรวจ AC-nn** (เลขเดียวกัน 1:1) ใช้ปลาย `U` สำหรับ Unit test ของ AC เดียวกัน (เช่น `TEST-08U`) AC-40 เว้นว่างโดยตั้งใจ (แยก Sprint 1 ออกจาก Sprint 2–3); AC-41 ถึง AC-47 ของ Sprint 2–3 ระบุเป้าหมายไว้ก่อน แต่ยังไม่ต้องมี STS เต็มรูปแบบ (ตาม Handout §3.2)

| Req ID | Feature | Sprint | AC | TEST | ไฟล์ทดสอบที่วางแผน | สถานะ |
| :---: | :---: | :---: | :--- | :--- | :--- | :---: |
| **FR-01** | F-01 | 1 | AC-01, AC-02, AC-03, AC-05 | TEST-01, 02, 03, 05 | `tests/api/auth.test.ts` | Planned |
| **FR-02** | F-01 | 1 | AC-06 | TEST-06 | `tests/api/auth.test.ts` | Planned |
| **FR-03** | F-02 | 1 | AC-09 | TEST-09 | `tests/api/series.test.ts` | Planned |
| **FR-04** | F-02 | 1 | AC-10, AC-12, AC-13, AC-19 | TEST-10, 12, 13, 19 | `tests/api/join.test.ts`, `e2e/join-queue.spec.ts` | Planned |
| **FR-05** | F-04 | 1 | AC-34, AC-35 | TEST-34, 35 | `tests/api/my-ticket.test.ts` | Planned |
| **FR-06** | F-04 | 1 | AC-36, AC-37, AC-38 | TEST-36, 37, 38 | `tests/api/ticket-detail.test.ts`, `tests/api/ticket-security.test.ts` | Planned |
| **FR-07** | F-03 | 1 | AC-21 | TEST-21 | `tests/api/staff-list.test.ts` | Planned |
| **FR-08** | F-03 | 1 | AC-22, AC-23, AC-24, AC-25 | TEST-22..25 | `tests/api/staff-call.test.ts` | Planned |
| **FR-09** | F-03 | 1 | AC-26 | TEST-26 | `tests/api/staff-transition.test.ts` | Planned |
| **FR-10** | F-03 | 1 | AC-27, AC-33 | TEST-27, 33 | `tests/api/staff-transition.test.ts`, `e2e/full-journey.spec.ts` | Planned |
| **FR-11** | F-05 | 2 | AC-41 | (Sprint 2 contract) | `tests/api/cancel.test.ts` | Planned |
| **FR-12** | F-06 | 2 | AC-42 | (Sprint 2 contract) | `tests/api/no-show.test.ts` | Planned |
| **FR-13** | F-07 | 2 | AC-44 | (Sprint 2 contract) | `tests/api/public-board.test.ts` | Planned |
| **FR-14** | F-08 | 3 | AC-45 | (Sprint 3 contract) | `tests/api/analytics.test.ts` | Planned |
| **FR-15** | F-09 | 3 | AC-46 | (Sprint 3 contract) | `tests/api/series-toggle.test.ts` | Planned |
| **BR-01** | F-02 | 1 (ต่อใน 2) | AC-10, AC-15, AC-17, AC-18 (+AC-41 เลขไม่ถูกใช้ซ้ำหลัง Cancel) | TEST-10, 15, 17, 17U, 18 | `tests/concurrency/numbering.test.ts`, `tests/api/queue-reset.test.ts`, `tests/unit/queue-date.test.ts` | Planned |
| **BR-02** | F-02 | 1 | AC-11, AC-16 | TEST-11, 16 | `tests/api/join.test.ts`, `tests/concurrency/duplicate.test.ts` | Planned |
| **BR-03** | F-03 | 1 | AC-22, AC-26, AC-27, AC-28 | TEST-22, 26, 27, 28, 28U | `tests/api/state-transition.test.ts`, `tests/unit/state-machine.test.ts` | Planned |
| **BR-04** | F-01, F-02, F-03, F-04 | 1 | AC-08, AC-14, AC-31, AC-37, AC-38 | TEST-08U, 14, 31, 37, 38 | `tests/unit/role-guard.test.ts`, `tests/api/permissions.test.ts`, `tests/api/ticket-security.test.ts` | Planned |
| **BR-05** | F-03 | 1 | AC-25, AC-29 | TEST-25, 29 | `tests/api/unauthorized-queue.test.ts` | Planned |
| **BR-06** | F-03 | 1 | AC-24, AC-32 | TEST-24, 32 | `tests/api/staff-call.test.ts`, `tests/concurrency/call-next.test.ts` | Planned |
| **BR-07** | F-03 | 1 | AC-26, **AC-30** | TEST-26, 30 | `tests/api/not-handler.test.ts` | Planned |
| **BR-08** | F-06 | 2 | AC-43 | (Sprint 2 contract) | `tests/api/no-show-timer.test.ts` | Planned |
| **BR-09** | F-02 | 1 (ต่อใน 3) | AC-12 | TEST-12 | `tests/api/join.test.ts` | Planned |
| **NFR-01** | F-01 | 1 | AC-07 | TEST-07 | `tests/security/password-hash.test.ts` | Planned |
| **NFR-02** | F-01 (ครอบทุก Feature) | 1 | AC-04, AC-14, AC-31, AC-37 | TEST-04, 14, 31, 37 | `tests/security/unauthenticated.test.ts` (parameterized ทุก route) | Planned |
| **NFR-03** | F-02 | 1 | AC-15 | TEST-15 | `tests/concurrency/numbering.test.ts` | Planned |
| **NFR-04** | F-02 | 1 | AC-16 | TEST-16 | `tests/concurrency/duplicate.test.ts` | Planned |
| **NFR-05** | F-04 | 1 | AC-39 | TEST-39 | `scripts/test-persistence.mjs` | Planned |
| **NFR-06** | F-02 (ครอบหน้าจอ F-03/F-04) | 1 | AC-20 | TEST-20 | `e2e/responsive.spec.ts` | Planned |
| **NFR-07** | S3-HARDEN | 3 | AC-47 | (Sprint 3 contract) | `tests/api/rate-limit.test.ts` | Planned |

### Coverage Gaps (ช่องว่างและข้อสังเกตที่เปิดเผย)

| # | ช่องว่าง / ข้อสังเกต | ผลกระทบ | แนวทาง / สถานะ |
| :---: | :--- | :--- | :--- |
| G-01 | FR-11..FR-15, BR-08, NFR-07 ยังไม่มี STS/Test (อยู่ Sprint 2–3) | ไม่ส่งผลต่อ Sprint 1 | อนุญาตตาม Handout §3.2; จัดสรร Feature/Sprint แล้ว; จะ elaborate เป็น Contract ก่อนเริ่มแต่ละ Sprint |
| G-02 | Sprint 1 ไม่มี Cancel/No-Show → ลูกค้าไม่มาทำให้พนักงานติด `STAFF_BUSY` | กระทบการใช้งานจริง/Lab 6 UAT | D-09: Seed collector 6 บัญชี + `db:reset-demo` + เปิดเผยเป็น Known Limitation |
| G-03 | NFR-03/NFR-04 ซ้ำกับ BR-01/BR-02 (เป็นการพิสูจน์ภายใต้ Concurrency) | ไม่กระทบความครบถ้วน | ระบุชัดใน Part A §7 |
| G-04 | Test ของ Midnight Reset ใช้ Clock ที่ inject ได้ ไม่ได้รอเที่ยงคืนจริง | – | AC-17 (Unit + Integration พร้อม fake clock) |
| G-05 | Rate limit ล็อกอินยังไม่อยู่ใน Sprint 1 | ความเสี่ยง Brute force (ยอมรับสำหรับ Sprint 1) | D-12: NFR-07 / Sprint 3 |
| G-06 | D-08 (Lab 7 เปลี่ยน BR-02) ยังไม่ได้รับอนุมัติ | ไม่กระทบ Sprint 1 | รออนุมัติ TA/อาจารย์ |
| G-07 | ตั๋วค้างข้ามวัน (A-07) ยังไม่มี Requirement จัดการ | Edge case | บันทึกใน Known Limitations; พิจารณาใน Sprint 3 |

### Approved / Recorded Changes (การเปลี่ยนแปลงที่บันทึกไว้)

| Change ID | วันที่ | การเปลี่ยนแปลง | เหตุผล | สถานะอนุมัติ |
| :---: | :---: | :--- | :--- | :--- |
| CHG-01 | 2026-11-01 | เพิ่ม 2 ซีรีส์ที่เปิด + 1 ซีรีส์ปิด และ 3 Box Master ตั้งแต่ Sprint 1 | Theme 9 บังคับทดสอบ "operator access to unauthorized queue" และ BR-09 | ทีมตกลง (v0.2) |
| CHG-02 | 2026-11-01 | ย้ายการยืนยันลูกค้ามาถึงให้เป็นของ Box Master (D-02) | ลูกค้ากดจากระยะไกลไม่ได้ | ทีมตกลง |
| CHG-03 | 2026-11-01 | เพิ่ม FR-15, F-09, BR-09, NFR-07 และ S3-HARDEN; ตัดคำสัญญา SSE | ให้ Known Debt/Sprint 3 สอดคล้องกับ Requirement | ทีมตกลง (v0.2) |
| CHG-04 | 2026-11-01 | ย้าย Rate Limit เป็น NFR-07 / Sprint 3 | ชนกับ test login ผิดซ้ำและ UAT | ทีมตกลง (v0.2) |
| CHG-05 | 2026-11-01 | Renumber AC/TEST เป็น 1:1 (AC-01..39) | ลดความไม่สอดคล้องของ ID | ทีมตกลง (v0.2) |
| CHG-06 | 2026-11-01 | เปลี่ยนการออกเลขคิวเป็น Raw SQL `ON CONFLICT` (D-10) | Prisma upsert ไม่ atomic ภายใต้ race | ทีมตกลง (v0.2) |

---

# Part C: System-Level Software Design Specification (SDS) (15 คะแนน)

## 1. สถาปัตยกรรม Stack และกลยุทธ์การทดสอบ

```
[Web Client: Next.js 14 + TailwindCSS]      ← หน้าจอ, validation เบื้องต้น, Polling 3 วินาที (ไม่ตัดสินสิทธิ์/กฎธุรกิจ)
        |  HTTPS REST (JSON) + Authorization: Bearer <JWT>
[API Layer: Node.js + Express + TypeScript] ← Auth/Role middleware, Zod validation, Service layer (กฎธุรกิจ), Error mapping
        |  Prisma ORM + Raw SQL (ใน Transaction เดียวกัน)
[Database: PostgreSQL 16]                   ← Constraints, Partial Unique Indexes, Row locking, ข้อมูลถาวร (Docker volume)
```

| Layer | หน้าที่ | กฎธุรกิจที่บังคับที่ชั้นนี้ |
| :--- | :--- | :--- |
| **UI (Next.js)** | แสดงผล, เก็บ Token, Polling, แสดง Error ตาม code | **ไม่มี** – การซ่อนปุ่มไม่ใช่การอนุญาตสิทธิ์ |
| **API (Express)** | ยืนยันตัวตน, Role/Scope/Ownership, validate input, State Machine, ออกเลขคิว | BR-03, BR-04, BR-05, BR-07, BR-09, ลำดับตรวจสอบ (§6) |
| **Database (PostgreSQL)** | เก็บข้อมูลถาวร, ป้องกัน Race | BR-01 (unique + counter), BR-02 (partial unique), BR-06 (partial unique) |

* **การสื่อสาร:** UI → API ด้วย REST/JSON เท่านั้น; API → DB ผ่าน Prisma (และ Raw SQL เฉพาะจุดที่ต้อง atomic/lock); ไม่มี Business Rule ที่ฝั่ง Client
* **เหตุผลเลือก Stack:** ใช้ TypeScript ทั้ง Client/Server เพื่อลดภาระการเรียนรู้ของทีม 2 คน, Prisma + PostgreSQL รองรับ Transaction/Index/Row lock ที่จำเป็นต่อ BR-01/02/06, Docker แพ็กเกจและ Deploy บน GCP Cloud Run ได้ (Modular Monolith, ไม่ใช่ Microservices)
* **โครงสร้าง Repo:** `server/` (API + Prisma), `client/` (Next.js), `e2e/` (Playwright), `scripts/`, `docs/`

### Test Strategy

| ระดับ | เครื่องมือ | ครอบคลุม |
| :--- | :--- | :--- |
| **Unit** | Vitest/Jest | `getQueueDate()` (Asia/Bangkok), State-machine guard, `requireRole`, การสร้าง `displayNumber` |
| **API/DB Integration** | Supertest + PostgreSQL จริง (DB เทสต์แยก) | Persistence, สิทธิ์/ความเป็นเจ้าของ, Constraint, Error code |
| **Concurrency** | Supertest + `Promise.all` | BR-01, BR-02, BR-06, SKIP LOCKED |
| **E2E/UI** | Playwright | Journey หลัก (AC-19, AC-33), Responsive 375px (AC-20) |
| **Infra/Persistence** | Node script + `docker compose restart` | AC-39 |

---

## 2. โครงสร้างข้อมูล (Data Model)

```prisma
// server/prisma/schema.prisma
datasource db { provider = "postgresql"  url = env("DATABASE_URL") }
generator client { provider = "prisma-client-js" }

enum Role { COLLECTOR  BOX_MASTER }
enum TicketStatus { WAITING CALLED UNBOXING COMPLETED CANCELLED NO_SHOW }

model User {
  id             String   @id @default(uuid())
  username       String   @unique
  passwordHash   String                          // bcrypt cost >= 10
  fullName       String
  role           Role     @default(COLLECTOR)
  tokenVersion   Int      @default(0)            // Logout: tokenVersion + 1
  tickets        QueueTicket[] @relation("UserTickets")
  handledTickets QueueTicket[] @relation("StaffHandledTickets")
  assignments    StaffSeriesAssignment[]
  createdAt      DateTime @default(now())
}

model Series {
  id          String   @id @default(uuid())
  code        String   @unique                    // CRY, LAB, SKP
  name        String
  isActive    Boolean  @default(true)
  tickets     QueueTicket[]
  assignments StaffSeriesAssignment[]
  counters    QueueCounter[]
  createdAt   DateTime @default(now())
}

model StaffSeriesAssignment {
  id        String @id @default(uuid())
  staffId   String
  seriesId  String
  staff     User   @relation(fields: [staffId], references: [id])
  series    Series @relation(fields: [seriesId], references: [id])
  @@unique([staffId, seriesId])
}

model QueueTicket {
  id               String       @id @default(uuid())
  seriesId         String
  series           Series       @relation(fields: [seriesId], references: [id])
  userId           String
  user             User         @relation("UserTickets", fields: [userId], references: [id])
  handledByStaffId String?
  handledByStaff   User?        @relation("StaffHandledTickets", fields: [handledByStaffId], references: [id])
  queueDate        DateTime     @db.Date           // วันที่ตาม Asia/Bangkok
  queueNumber      Int
  displayNumber    String                           // เช่น CRY-001
  status           TicketStatus @default(WAITING)
  createdAt        DateTime     @default(now())
  calledAt         DateTime?
  startedAt        DateTime?
  completedAt      DateTime?
  forfeitedAt      DateTime?                        // ใช้ใน Sprint 2 (Cancel/No-Show)

  @@unique([seriesId, queueDate, queueNumber])
  @@index([seriesId, status, queueDate, queueNumber])
  @@index([userId])
  // Partial Unique Indexes (BR-02, BR-06) Prisma schema ไม่รองรับ → เขียนเป็น Raw SQL migration (ดู §5)
}

model QueueCounter {
  id         String @id @default(uuid())
  seriesId   String
  series     Series @relation(fields: [seriesId], references: [id])
  queueDate  DateTime @db.Date
  lastNumber Int    @default(0)
  @@unique([seriesId, queueDate])
}
```

### ความสัมพันธ์และ Ownership

| Entity | ความสัมพันธ์ | Ownership / Constraint สำคัญ |
| :--- | :--- | :--- |
| `User` 1–N `QueueTicket` (`userId`) | ตั๋วเป็นของ Collector | `unique_active_ticket_user`: 1 ตั๋ว Active/ผู้ใช้ (BR-02) |
| `User` 1–N `QueueTicket` (`handledByStaffId`) | พนักงานผู้ Call | `unique_active_staff_ticket`: 1 ตั๋ว CALLED/UNBOXING/พนักงาน (BR-06) |
| `User` N–M `Series` ผ่าน `StaffSeriesAssignment` | สิทธิ์ซีรีส์ของ Box Master | `@@unique([staffId, seriesId])` (BR-05) |
| `Series` 1–N `QueueTicket`, `QueueCounter` | เลขคิวรายซีรีส์รายวัน | `@@unique([seriesId, queueDate, queueNumber])`, `@@unique([seriesId, queueDate])` (BR-01) |

---

## 3. การยืนยันตัวตนและการจัดการ Credential (Authentication Design)

| หัวข้อ | การออกแบบ |
| :--- | :--- |
| **Password** | Bcrypt cost = `BCRYPT_COST` (ค่าเริ่มต้น 10, ขั้นต่ำ 10), ห้ามบันทึก plaintext/ห้าม log, Seed โหลดจาก `SEED_*_PASSWORD` |
| **Login** | `POST /api/auth/login` ตรวจ username/password; ผิดทั้งสองกรณีตอบ `INVALID_CREDENTIALS` ข้อความเดียวกัน (ไม่เผยว่า username มีอยู่หรือไม่) |
| **Token** | JWT HS256, claims: `sub` (userId), `role`, `tokenVersion`, `iat`, `exp` (8 ชั่วโมง, `JWT_EXPIRES_IN`) ลงนามด้วย `JWT_SECRET` (≥ 32 อักขระ) |
| **การตรวจทุกคำขอ** | Auth middleware: ตรวจลายเซ็น+exp → โหลด User ตาม `sub` → เทียบ `token.tokenVersion === user.tokenVersion` และใช้ **Role จาก DB** (ไม่เชื่อ Role/ID จาก Client) → ไม่ผ่านตอบ 401 `UNAUTHENTICATED` |
| **Current user** | `GET /api/auth/me` อ่านจาก Token ที่ผ่านการตรวจแล้ว + assignedSeries จาก DB |
| **Logout** | `POST /api/auth/logout`: `tokenVersion = tokenVersion + 1` → Token เดิมถูกปฏิเสธทันที; Client ลบ Token จาก `localStorage` (**D-11:** ผลข้างเคียง = ทุกอุปกรณ์ของผู้ใช้นั้นถูกออกจากระบบ ยอมรับได้) |
| **การเก็บ Token ที่ Client** | `localStorage` + Bearer Header (ยอมรับความเสี่ยง XSS ในระดับโปรเจกต์วิชา; ไม่ใช้ Cookie จึงไม่มีความเสี่ยง CSRF) |
| **Refresh Token / Self-registration / กู้รหัสผ่าน** | ไม่มี (ไม่จำเป็นตาม Handout) |
| **Rate limit ล็อกอิน** | ไม่เปิดใน Sprint 1 (D-12) → NFR-07 / Sprint 3 |

---

## 4. การออกแบบ Concurrency

1. **BR-02 – Partial Unique Index (ผู้ใช้):**
   ```sql
   CREATE UNIQUE INDEX unique_active_ticket_user ON "QueueTicket"("userId")
   WHERE status IN ('WAITING','CALLED','UNBOXING');
   ```
2. **BR-06 – Partial Unique Index (พนักงาน):**
   ```sql
   CREATE UNIQUE INDEX unique_active_staff_ticket ON "QueueTicket"("handledByStaffId")
   WHERE status IN ('CALLED','UNBOXING');
   ```
3. **BR-01 – ออกเลขคิว Atomic (D-10)** ใน Prisma interactive transaction เดียวกับการสร้างตั๋ว **ห้ามใช้ `prisma.upsert`** (ไม่รับประกัน atomic increment ภายใต้ race จะกลายเป็น select-then-write แล้วโยน P2002):
   ```sql
   INSERT INTO "QueueCounter" ("id","seriesId","queueDate","lastNumber")
   VALUES (gen_random_uuid()::text, $1, $2::date, 1)
   ON CONFLICT ("seriesId","queueDate")
   DO UPDATE SET "lastNumber" = "QueueCounter"."lastNumber" + 1
   RETURNING "lastNumber";
   ```
   แถว counter ถูก lock จนจบ Transaction จึงเรียงคำขอต่อซีรีส์เป็นลำดับ; หาก INSERT ตั๋วล้ม (เช่น ผู้ใช้มีตั๋วอยู่แล้ว) Transaction ทั้งก้อน Rollback ทำให้เลขไม่ถูกใช้ไปโดยเปล่าประโยชน์ (ไม่เกิดช่องว่าง)
4. **การแปลง Error (P2002) ตามชื่อ constraint เท่านั้น:**

   | Constraint ที่ชน | Endpoint | Error ที่ตอบ |
   | :--- | :--- | :--- |
   | `unique_active_ticket_user` (หรือ target `userId`) | join | 409 `DUPLICATE_ACTIVE_QUEUE` |
   | `unique_active_staff_ticket` (หรือ target `handledByStaffId`) | call-next | 409 `STAFF_BUSY` |
   | `(seriesId, queueDate, queueNumber)` หรือ constraint ที่ไม่รู้จัก | ทุกที่ | 500 `INTERNAL_ERROR` (ถือเป็นบั๊ก ห้ามกลบเป็น 409) |
5. **Call Next (FIFO ไม่ชนกัน):** ภายใน Transaction: ตรวจสิทธิ์ซีรีส์ → ตรวจ staff ไม่มี CALLED/UNBOXING (`STAFF_BUSY`) → เลือกตั๋ว
   ```sql
   SELECT id FROM "QueueTicket"
   WHERE "seriesId" = $1 AND status = 'WAITING'
   ORDER BY "queueDate", "queueNumber" ASC LIMIT 1 FOR UPDATE SKIP LOCKED;
   ```
   แล้ว `UPDATE` เป็น `CALLED` + `handledByStaffId` + `calledAt` → พนักงาน 2 คนกดพร้อมกันได้คนละใบ ไม่เรียกใบเดียวกัน; พนักงานคนเดียวกดซ้ำพร้อมกัน → Partial Index/การตรวจ ทำให้เหลือสำเร็จ 1 ใบ
6. **Clock Injection:** Service รับ `clock: () => Date`; ฟังก์ชัน `getQueueDate(now)` แปลงเป็นวันที่ Asia/Bangkok เพื่อทดสอบรีเซ็ตเที่ยงคืนโดยไม่ต้องรอเวลาจริง

---

## 5. การตั้งค่าฐานข้อมูล, Migration และ Seed (Reproducible Setup)

| หัวข้อ | แนวทาง |
| :--- | :--- |
| **DB สำหรับ Local** | `docker-compose.yml` เฉพาะ PostgreSQL 16 + named volume `popqueue_pgdata` (Dockerfile ของแอป/CI/CD ทำใน Lab 5) |
| **Migration** | `prisma migrate dev`: `0001_init` (generate จาก schema) และ `0002_partial_unique_indexes` (**เขียน SQL เอง** ด้วย `--create-only` แล้วใส่ 2 CREATE UNIQUE INDEX ข้างต้น) |
| **ห้ามใช้ `prisma db push`** | จะไม่สร้าง/อาจทำให้ Partial Index หายและ schema drift; ใช้ `prisma migrate deploy` ในสภาพแวดล้อมอื่น |
| **Seed** | `prisma/seed.ts` แบบ idempotent (upsert) โหลดรหัสผ่านจาก `SEED_COLLECTOR_PASSWORD`/`SEED_STAFF_PASSWORD`; แฮชด้วย Bcrypt |
| **Reset สำหรับ Demo/UAT** | `npm run db:reset-demo` = `prisma migrate reset --force` (รัน Migration ทั้งชุดรวม Partial Index แล้ว Seed ใหม่) |
| **DB เทสต์** | `DATABASE_URL_TEST` แยกจาก Dev; Test fixture สร้าง Collector 50 คนด้วยแฮชที่คำนวณครั้งเดียว (เร็ว) |

### ข้อมูล Seed (Synthetic)

| ประเภท | รายการ |
| :--- | :--- |
| Users | `collector1`–`collector6` (COLLECTOR), `staff_crybaby`, `staff_crybaby2`, `staff_labubu` (BOX_MASTER) – รวม 9 บัญชี |
| Series | `CRY` Crybaby Sunset Concert (เปิด), `LAB` Labubu Macaron (เปิด), `SKP` Skullpanda Closed Demo (ปิด) |
| Assignments | `staff_crybaby`→CRY, `staff_crybaby2`→CRY, `staff_labubu`→LAB |
| ตั๋ว | ไม่ Seed ตั๋ว (เริ่มจากคิวว่าง) |

---

## 6. API Conventions และตารางข้อผิดพลาด

* **Base Path:** `/api`, JSON เท่านั้น, ชื่อ resource เป็นพหูพจน์/กริยาเฉพาะ action (`/call-next`, `/start-unboxing`, `/complete`)
* **Success:** `{ "data": … }` (201 เมื่อสร้างตั๋ว, 200 อื่นๆ)
* **Error:** `{ "error": { "code", "message", "statusCode" } }` – ข้อความปลอดภัย ไม่แสดง Stack Trace/SQL/ข้อมูลของผู้อื่น
* **Validation:** Zod ตรวจ body/params ทุก endpoint (`VALIDATION_ERROR` 400)
* **เวลา:** ISO-8601 UTC ใน API; `queueDate` เป็นวันที่ Asia/Bangkok
* **ลำดับการตรวจสอบมาตรฐาน (กำหนดเพื่อให้ผลทดสอบแน่นอน):**
  `1) Authentication (401)` → `2) Role (403 FORBIDDEN_ROLE)` → `3) Validation (400)` → `4) Resource existence (404)` → `5) Series scope / Ownership (403)` → `6) Handler check (403 FORBIDDEN_NOT_HANDLER – ใช้เมื่อตั๋วมี handler แล้ว)` → `7) State/Business rule (400/409)`

| Error Code | HTTP | เงื่อนไข | Sprint |
| :--- | :---: | :--- | :---: |
| `INVALID_CREDENTIALS` | 401 | username/password ไม่ถูกต้อง | 1 |
| `UNAUTHENTICATED` | 401 | ไม่มี Token / Token ผิดรูป-ปลอม-หมดอายุ / ถูกเพิกถอนด้วย `tokenVersion` | 1 |
| `FORBIDDEN_ROLE` | 403 | Role ไม่ได้รับอนุญาต (Collector→Staff endpoint, Box Master→join/my-ticket) | 1 |
| `FORBIDDEN_OWNERSHIP` | 403 | Collector ดูตั๋วที่ไม่ใช่ของตน | 1 |
| `FORBIDDEN_SERIES` | 403 | Box Master ทำกับซีรีส์/ตั๋วนอกสิทธิ์ซีรีส์ | 1 |
| `FORBIDDEN_NOT_HANDLER` | 403 | Box Master ซีรีส์เดียวกันแต่ไม่ใช่ผู้ Call ตั๋วนั้น | 1 |
| `DUPLICATE_ACTIVE_QUEUE` | 409 | ผู้ใช้มีตั๋ว Active อยู่แล้ว | 1 |
| `SERIES_CLOSED` | 409 | join ซีรีส์ที่ `isActive=false` | 1 |
| `STAFF_BUSY` | 409 | พนักงานมีตั๋ว CALLED/UNBOXING ค้าง | 1 |
| `EMPTY_QUEUE` | 404 | ไม่มีตั๋ว WAITING ในซีรีส์ที่ Call | 1 |
| `NO_ACTIVE_TICKET` | 404 | `my-ticket` แต่ผู้ใช้ไม่มีตั๋ว Active | 1 |
| `RESOURCE_NOT_FOUND` | 404 | ไม่พบตั๋ว/ซีรีส์ | 1 |
| `INVALID_STATE_TRANSITION` | 400 | เปลี่ยนสถานะผิดลำดับ | 1 |
| `VALIDATION_ERROR` | 400 | Body/Param ไม่ผ่าน Schema (รวมรูปแบบ UUID) | 1 |
| `INTERNAL_ERROR` | 500 | ข้อผิดพลาดที่ไม่คาดคิด (ข้อความทั่วไป) | 1 |
| `NO_SHOW_EARLY_REJECT` | 400 | No-Show ก่อนครบ 120 วินาที | 2 |
| `TOO_MANY_REQUESTS` | 429 | เกิน Rate limit ล็อกอิน | 3 |

---

## 7. เมทริกซ์สิทธิ์และการเข้าถึงข้อมูล (Role & Permission Matrix)

| Operation | Collector | Box Master | Public (ไม่ล็อกอิน) | ขอบเขตระดับ Record |
| :--- | :---: | :---: | :---: | :--- |
| `POST /api/auth/login` | ✅ | ✅ | ✅ | – |
| `POST /api/auth/logout` | ✅ | ✅ | ❌ 401 | เฉพาะบัญชีตนเอง (เพิ่ม tokenVersion ของตน) |
| `GET /api/auth/me` | ✅ | ✅ | ❌ 401 | เฉพาะตนเอง |
| `GET /api/series` | ✅ | ✅ | ✅ | ทุกซีรีส์ (ไม่มีข้อมูลส่วนตัว) |
| `POST /api/tickets/join` | ✅ | ❌ 403 `FORBIDDEN_ROLE` | ❌ 401 | สร้างตั๋วให้ตนเองเท่านั้น (userId จาก Token ไม่รับจาก Body) |
| `GET /api/tickets/my-ticket` | ✅ | ❌ 403 | ❌ 401 | ตั๋ว Active ของตนเอง |
| `GET /api/tickets/:id` | ✅ เฉพาะเจ้าของ (403 `FORBIDDEN_OWNERSHIP`) | ✅ เฉพาะซีรีส์ที่ดูแล (403 `FORBIDDEN_SERIES`) | ❌ 401 | – |
| `POST /api/tickets/:id/cancel` *(S2)* | ✅ เจ้าของ+WAITING | ❌ 403 | ❌ 401 | – |
| `GET /api/staff/tickets` | ❌ 403 | ✅ | ❌ 401 | เฉพาะซีรีส์ที่ได้รับมอบหมาย |
| `POST /api/staff/call-next` | ❌ 403 | ✅ | ❌ 401 | `seriesId` ต้องอยู่ในสิทธิ์ (403 `FORBIDDEN_SERIES`) |
| `POST /api/staff/tickets/:id/start-unboxing` | ❌ 403 | ✅ | ❌ 401 | ซีรีส์ตน และต้องเป็นผู้ Call (`FORBIDDEN_NOT_HANDLER`) |
| `POST /api/staff/tickets/:id/complete` | ❌ 403 | ✅ | ❌ 401 | ซีรีส์ตน และต้องเป็นผู้ Call |
| `POST /api/staff/tickets/:id/no-show` *(S2)* | ❌ 403 | ✅ | ❌ 401 | ซีรีส์ตน, ผู้ Call, ≥120 วินาที |
| `GET /api/public/board` *(S2)* | ✅ | ✅ | ✅ | เลขคิว+สถานะเท่านั้น ไม่มีชื่อ |
| `GET /api/staff/analytics` *(S3)* | ❌ 403 | ✅ | ❌ 401 | เฉพาะซีรีส์ที่ดูแล |
| `PATCH /api/staff/series/:id/availability` *(S3)* | ❌ 403 | ✅ | ❌ 401 | เฉพาะซีรีส์ที่ดูแล |

> การซ่อนปุ่มใน UI ไม่ใช่การอนุญาต – ทุกข้อด้านบนบังคับที่ API และมี Test (Part E)

---

## 8. UI: Navigation Map และพฤติกรรมร่วม

### Screen / Navigation Map (Sprint 1)

| Route | ผู้ใช้ | หน้าที่ | หลัง Login / ปลายทาง |
| :--- | :---: | :--- | :--- |
| `/login` | ทุกคน | ฟอร์ม username/password | Collector → `/series` (ถ้ามีตั๋ว Active → `/my-ticket`); Box Master → `/staff/counter` |
| `/series` | Collector | รายการซีรีส์ + จำนวนคิวรอ + ปุ่ม Join | Join สำเร็จ → `/my-ticket` |
| `/my-ticket` | Collector | บัตรคิว (เลข, ซีรีส์, สถานะ, คิวก่อนหน้า, นับถอยหลังเมื่อ CALLED), Polling 3 วินาที | – |
| `/staff/counter` | Box Master | คิวรอของซีรีส์ตน, Current Serving, ปุ่ม Call Next / Verify & Start / Complete | – |
| `/forbidden` | ทุกคน | แจ้งไม่มีสิทธิ์ (เมื่อเข้าหน้าผิด Role) | ลิงก์กลับหน้าหลัก |
| `/public/board` *(S2)*, `/staff/analytics` *(S3)* | – | ตามแผน Sprint | – |

* **Header ร่วม:** แสดงชื่อ + Role และปุ่ม Logout
* **Route guard (UX เท่านั้น):** ไม่มี Token → `/login`; Role ผิดหน้า → `/forbidden` (การตัดสินจริงอยู่ที่ API)
* **Shared UI States:** *Validation* (ข้อความใต้ช่อง, ปุ่ม Disabled ระหว่างส่ง), *Loading* (Skeleton/สปินเนอร์บนปุ่ม), *Empty* (เช่น "ยังไม่มีคิวรอ"), *Error* (กล่องแดงแสดงข้อความจาก error code + ปุ่มลองใหม่); API 401 → ลบ Token แล้วไป `/login`; 403 → แสดง `/forbidden` หรือข้อความสิทธิ์
* **Typography:** `Noto Sans Thai` / `Segoe UI` / `sans-serif`
* **Responsive:** Mobile-first ≥ 375px ไม่มี horizontal overflow (NFR-06)

### Accessible Color Palette (คำนวณด้วยสูตร WCAG 2.1 – ควรยืนยันซ้ำด้วย WebAIM ก่อนส่ง)

| Token | HEX | Contrast บนขาว `#FFFFFF` | Contrast บน `#F8FAFC` |
| :--- | :---: | :---: | :---: |
| Primary | `#BE123C` | 6.29:1 | 6.01:1 |
| Text | `#0F172A` | 17.85:1 | 17.06:1 |
| Success | `#15803D` | 5.02:1 | 4.79:1 |
| Warning | `#B45309` | 5.02:1 | 4.80:1 |
| Error | `#B91C1C` | 6.47:1 | 6.18:1 |
| Muted text | `#475569` | 7.58:1 | 7.24:1 |

ผ่านเกณฑ์ ≥ 4.5:1 ทุกค่า (ข้อความขาวบนปุ่ม Primary = 6.29:1)

---

## 9. Configuration, Secret Handling และแผน Deploy GCP

| ตัวแปร | ตัวอย่างค่า / คำอธิบาย |
| :--- | :--- |
| `DATABASE_URL` | `postgresql://<user>:<password>@localhost:5432/popqueue` (ค่าจริงอยู่ใน `.env` ไม่ commit) |
| `DATABASE_URL_TEST` | DB แยกสำหรับ Test |
| `JWT_SECRET` | สุ่มยาว ≥ 32 อักขระ |
| `JWT_EXPIRES_IN` | `8h` |
| `BCRYPT_COST` | `10` |
| `PORT`, `TZ` | `4000`, `Asia/Bangkok` |
| `CORS_ORIGIN`, `NEXT_PUBLIC_API_URL` | Origin ของ Client / URL ของ API |
| `SEED_COLLECTOR_PASSWORD`, `SEED_STAFF_PASSWORD` | รหัส Seed (ส่งผ่านช่องทางส่วนตัวของวิชา) |
| `LOGIN_RATE_LIMIT_ENABLED` | *(Sprint 3)* ปิดในโหมดเทสต์ |

* **Secret Handling:** `.env` อยู่ใน `.gitignore`; commit เฉพาะ `.env.example` (ค่า placeholder); Client Bundle ไม่มี Secret (เฉพาะ `NEXT_PUBLIC_*` ที่ไม่ลับ); บน GCP เก็บใน Secret Manager
* **GCP Plan (Lab 5):** Docker multi-stage → Artifact Registry → **Cloud Run** (API และ Web) → **Cloud SQL PostgreSQL 16** (ข้อมูลถาวร/ข้าม Restart) → **Secret Manager**; รัน `prisma migrate deploy` ใน Release step; Pipeline จาก GitHub (PR build/test เป็น Gate → merge main → deploy) *(รายละเอียดจริงตามคำแนะนำ Lab 5)*

---

# Part D: Three-Sprint Plan (5 คะแนน)

## 1. สรุปแผน 3 Sprint

| Sprint | เป้าหมาย (Goal) | Feature IDs | Dependencies | Completion Outcome (วัดผลได้) | Checkpoint |
| :---: | :--- | :--- | :--- | :--- | :---: |
| **1** | Small working domain slice: Auth + 2 Roles + Join/Call/Verify/Complete + สิทธิ์ซีรีส์ + Persistence | **F-01, F-02, F-03, F-04** | – | รันได้บน `main` พร้อม README; AC-01..AC-39 มีผล test จริงทั้งหมด (รวม Concurrency, E2E, Persistence) แนบ commit; Release tag `v0.1.0-sprint1`; PR ผ่านการ review โดยเพื่อนร่วมทีม | **Deliverable 1 – 8 พ.ย.** (Lab 5: 3, 5 พ.ย. คาบเรียน; ส่ง 15 พ.ย.) |
| **2** | Core expansion: Cancel, Server-enforced No-Show, Public Board + Deploy GCP + Cross-team UAT | **F-05, F-06, F-07** (+ Lab 5 deploy, Lab 6 UAT fixes) | F-01..F-04 | Contract/AC/STS ของ F-05..F-07 commit ก่อนโค้ด; ทุก AC ผ่านพร้อมหลักฐาน; Release รวม Sprint 1+2 deploy บน GCP; UAT defect ที่รับแล้วมี regression test | **Deliverable 2 – 29 พ.ย.** (Lab 5: 15 พ.ย., Lab 6: 22 พ.ย.) |
| **3** | Completion & hardening: Analytics, Series open/close, Rate limit, Regression, Defect correction | **F-08, F-09, S3-HARDEN (NFR-07)** | F-05, F-06, F-07 | F-08 initial version ทดสอบได้ภายใน 29 พ.ย.; Full regression suite ผ่าน; Defect วิกฤตเป็น 0; Release สุดท้าย + วิดีโอ + รายงาน | **Final – 13 ธ.ค.** (Lab 7: 29 พ.ย.) |

> **Lab 7:** ข้อเสนอเปลี่ยน BR-02 เป็นรายซีรีส์ (D-08) **ยังรออนุมัติจาก TA/อาจารย์** ไม่ใช่แผนที่ยืนยัน หากไม่ได้รับอนุมัติ จะใช้การเปลี่ยนที่ TA กำหนด
> **Requirement ครบ Baseline:** FR-01..15, BR-01..09, NFR-01..07 ถูกจัดสรรให้ Sprint 1–3 ครบ (ดู Part B)

## 2. ขอบเขต Sprint 1 และความเป็นไปได้ (Scope & Feasibility)

**อยู่ใน Sprint 1 (ตาม Handout §2 และ Theme 9 – ตัวอย่าง Sprint 1):**
* Login/Logout/`me`, 2 Roles (Collector, Box Master), Backend enforcement, Bcrypt
* Journey: ลูกค้า join → เห็นเลขคิว/สถานะ → พนักงาน Call Next → Verify & Start → Complete → ดึงข้อมูลที่บันทึกไว้
* Business rules ที่ทดสอบ: เลขคิวไม่ซ้ำ/ไม่ข้าม, ห้ามตั๋ว Active ซ้อน, ห้ามข้ามขั้น State, ห้ามข้ามซีรีส์, ห้าม Handler อื่น, ห้ามซีรีส์ปิด
* Persistence + ทดสอบหลัง Restart DB, UI 4 หน้า (Login, Series, My Ticket, Staff Counter), E2E 3 ชุด

**ไม่อยู่ใน Sprint 1 (ย้ายไปแล้วพร้อมเหตุผล):** Cancel, No-Show, Public Board (Sprint 2), Analytics, เปิด–ปิดซีรีส์, Rate limit (Sprint 3), Docker เต็มรูปแบบ/CI/CD/GCP (Lab 5)

**ทำไมทำได้จริง:** ฟีเจอร์เล็ก 4 ตัวใช้ Stack เดิมที่ฝึกใน Lab 1–4; ใช้ TDD ทีละ Issue; UI เรียบง่าย (4 หน้า, ไม่มี Realtime ซับซ้อน); ใช้ Seed แทน Registration

### แผนงานรายวัน (Sprint 1: 1–8 พ.ย.) – เป้าหมาย ไม่ใช่ผลที่เกิดแล้ว

| วันที่ | Issue (ดูภาคผนวก) | ผลลัพธ์ที่คาดหวัง |
| :---: | :--- | :--- |
| 1–2 พ.ย. | I-00 Contract baseline, I-01 Scaffold/DB/Seed | Commit เอกสาร (ก่อนโค้ด), Migration + Seed รันบน DB ว่างได้ |
| 3 พ.ย. | I-02 F-01 Auth (Workshop/Lab 5 ในคาบ) | AC-01..08 เขียวตาม TDD |
| 4 พ.ย. | I-03 F-02 Join + Concurrency, I-04 F-04 Ticket | AC-09..18, AC-34..38 |
| 5 พ.ย. | I-05, I-06 F-03 Staff Counter | AC-21..32 |
| 6 พ.ย. | I-07 Web UI | หน้าจอครบ 4 หน้า |
| 7 พ.ย. | I-08 E2E + Persistence + staging integration | AC-19, 20, 33, 39; รัน full suite |
| 8 พ.ย. | Release PR → `main`, tag, เก็บหลักฐาน, สร้าง PDF | ส่ง LEB2 ก่อน 23:59 (เผื่อเวลา) |

### ความเสี่ยงและมาตรการ

| ความเสี่ยง | มาตรการ |
| :--- | :--- |
| เวลาจำกัด (7 วัน) | ตัดฟีเจอร์ส่วนเกินออกแล้ว; ถ้าช้า ลดความสวยของ UI ก่อน ไม่ลด Test/AC |
| Race condition ทำให้ TEST-15/16/32 ไม่เสถียร | ใช้ Raw SQL ON CONFLICT + SKIP LOCKED (D-10); รันซ้ำหลายรอบก่อนส่ง |
| CALLED ค้าง → STAFF_BUSY (ไม่มี No-Show ใน Sprint 1) / UAT 10–12 พ.ย. | D-09: Seed collector 6 บัญชี, `db:reset-demo`, UAT case ที่จบ journey; พิจารณาดึง F-05/F-06 ขึ้นมาถ้าเสร็จก่อน |
| Playwright บน Windows ไม่เสถียร | ใช้ DB เทสต์แยก, รอ Polling ด้วย `expect.poll` ไม่ใช้ sleep |

## 3. งานที่เหลือหลัง Sprint 1 (Remaining Work)

F-05, F-06, F-07 (Sprint 2), Dockerfile/CI/CD/GCP (Lab 5), F-08, F-09, NFR-07, Regression/Hardening (Sprint 3), จัดการตั๋วค้างข้ามวัน (G-07), UAT defect ตาม Lab 6

---

# Part E: Sprint 1 Engineering Contracts (20 คะแนน)

## 0. ประวัติเวอร์ชันของ Contract และข้อกำหนดการ Commit ก่อนโค้ด

> **ข้อกำหนด:** Contract ของ F-01..F-04 (หัวข้อ 1–4) และ Test Specification ต้องถูก commit บนกิ่ง `sprint-1-staging` **ก่อน** commit โค้ด/โค้ดทดสอบของฟีเจอร์นั้น (Issue I-00 – PR ที่มีเฉพาะเอกสาร) และต้องบันทึก commit ID + วันที่ในตารางด้านล่างและใน Part F §6 **เอกสารนี้ไม่ยืนยันว่า commit ดังกล่าวเกิดขึ้นแล้ว จนกว่าจะกรอกช่อง `[TBD]`**

| Contract Version | วันที่ | Commit ID | การเปลี่ยนแปลงและเหตุผล | ผู้เสนอ / ผู้ทบทวน |
| :---: | :---: | :---: | :--- | :--- |
| v0.1 | 2026-11-01 | `[TBD – ถ้ามี commit]` | ฉบับร่างแรก (AC-01..AC-26, ซีรีส์ 2 รายการ) | `[TBD]` |
| v0.2 | 2026-11-01 | `[TBD]` | เพิ่ม AC list ต่อฟีเจอร์, Validation/Failure cases, Data/UI "no change", Feature DoD; Renumber AC/TEST เป็น 1:1 (AC-01..39); เพิ่ม BR-09, `FORBIDDEN_NOT_HANDLER`, `SERIES_CLOSED`, `NO_ACTIVE_TICKET`; Seed เพิ่ม (collector×6, staff_crybaby2, series SKP); เปลี่ยนการออกเลขคิวเป็น Raw SQL (D-10); ย้าย Rate limit ไป Sprint 3 | `[TBD]` |
| v0.x | `[TBD]` | `[TBD]` | การแก้ไข Contract ระหว่าง Implement (ต้องระบุเหตุผลทุกครั้ง ห้ามเขียนทับประวัติ) | `[TBD]` |

### ข้อตกลงร่วมของชุดทดสอบ (Test Conventions)

* **Seed accounts / Fixture:** ใช้บัญชีตาม Part A A-03; Fixture `createCollectors(n)` สร้างผู้ใช้ชั่วคราวสำหรับ Concurrency (แฮชรหัสครั้งเดียว); `login(username)` ใช้รหัสจาก Environment Variable เท่านั้น
* **การตรวจ DB:** Integration test ตรวจทั้ง Response และสถานะใน DB (ตาราง `QueueTicket`/`QueueCounter`) เพื่อพิสูจน์ Persistence ไม่ Mock DB
* **Clock:** ทดสอบข้ามเที่ยงคืนด้วย `clock` ที่ inject ได้
* **ก่อนแต่ละ Test:** Reset ตั๋ว/ตัวนับในฐานข้อมูลเทสต์ (Seed users/series คงอยู่)
* **TDD:** Issue ของ Feature ต้องมี commit ที่เพิ่ม Test (แดง) ก่อน commit ที่ทำให้เขียว (หลักฐานใน Part F §5)

---

## 1. Feature Contract: F-01 – Authentication & Role Identity

### 1.1 Purpose & Scope
ให้ผู้ใช้ Seeded ล็อกอิน/ล็อกเอาต์ได้จริง ดึงตัวตนปัจจุบัน และให้ทุก endpoint ที่เหลือใช้ Auth/Role middleware กลาง **นอก Scope:** สมัครสมาชิก, กู้รหัสผ่าน, Refresh token, Rate limit (Sprint 3)

### 1.2 Linked Requirements & Dependencies
FR-01, FR-02, BR-04 (ส่วน Role guard), NFR-01, NFR-02 | Dependencies: ไม่มี (ฟีเจอร์ฐานราก) | ฟีเจอร์อื่นทั้งหมดพึ่งพา F-01

### 1.3 Workflow & Business Rules
1. Client ส่ง username/password → API ตรวจกับ `passwordHash` (Bcrypt) → ออก JWT (`sub`, `role`, `tokenVersion`, exp 8 ชม.)
2. ทุกคำขอที่ป้องกัน: Auth middleware ตรวจ Token + `tokenVersion` กับ DB และใช้ Role จาก DB
3. Logout เพิ่ม `tokenVersion` ของผู้ใช้ → Token เดิมใช้ไม่ได้ทันที (D-11)
4. ตัวตน/Role มาจาก Token เท่านั้น ไม่มี "ตัวเลือก Role" หรือ userId จาก Client

### 1.4 Permissions
login: ทุกคน | logout/me: ผู้ล็อกอินเท่านั้น (เฉพาะตนเอง) | Role guard: ใช้กับ route กลุ่ม Staff/Collector ใน F-02..F-04

### 1.5 Validation & Failure / Boundary Cases

| กรณี | ผลที่ต้องได้ |
| :--- | :--- |
| password ผิด หรือ username ไม่มี | 401 `INVALID_CREDENTIALS` (ข้อความเดียวกันทั้งสองกรณี) |
| body ขาด/ว่าง/ชนิดผิด | 400 `VALIDATION_ERROR` |
| ไม่มี Authorization header / ไม่ใช่ Bearer | 401 `UNAUTHENTICATED` |
| Token ปลอม (แก้ payload) / หมดอายุ / `tokenVersion` เก่า | 401 `UNAUTHENTICATED` |
| Role ไม่อยู่ในรายการอนุญาต | 403 `FORBIDDEN_ROLE` |

### 1.6 UI Behavior
`/login`: ฟอร์ม username + password + ปุ่ม Sign In (Loading ระหว่างส่ง; แสดง "Invalid username or password" เมื่อผิด; ช่องว่างแสดง validation) | สำเร็จ → เก็บ Token แล้ว redirect ตาม Role (Part C §8) | Header มีปุ่ม Logout → เรียก API แล้วลบ Token ไป `/login`

### 1.7 API Specifications

| Method / Path | Request | Success | Errors |
| :--- | :--- | :--- | :--- |
| `POST /api/auth/login` | `{ "username": "collector1", "password": "<จาก SEED_COLLECTOR_PASSWORD>" }` | 200 `{ "data": { "token": "<jwt>", "user": { "id","username","role","fullName" } } }` | 400 `VALIDATION_ERROR`, 401 `INVALID_CREDENTIALS` |
| `POST /api/auth/logout` | Header `Authorization: Bearer <token>` | 200 `{ "data": { "success": true } }` | 401 `UNAUTHENTICATED` |
| `GET /api/auth/me` | Header Bearer | 200 `{ "data": { "id","username","fullName","role","assignedSeries": [ { "id","code","name" } ] } }` (Collector: `[]`) | 401 `UNAUTHENTICATED` |

### 1.8 Data Changes
* ตาราง `User` (`username` unique, `passwordHash`, `role`, `tokenVersion`) และ `StaffSeriesAssignment` – Migration `0001_init`
* Seed: `prisma/seed.ts` สร้าง 9 บัญชี (Part C §5) | ไม่มี Partial Index ใน Feature นี้

### 1.9 Acceptance Criteria (F-01)

| AC ID | Observable Outcome | ประเภท | Req |
| :---: | :--- | :---: | :---: |
| **AC-01** | `collector1` และ `staff_crybaby` ล็อกอินด้วยรหัสถูกต้อง → 200 ได้ `token` และ `user.role` ตรงตาม Seed (`COLLECTOR`/`BOX_MASTER`) | Positive | FR-01 |
| **AC-02** | รหัสผ่านผิด หรือ username ไม่มีในระบบ → 401 `INVALID_CREDENTIALS` ข้อความ/โครงสร้างเหมือนกัน ไม่คืน Token | Negative | FR-01 |
| **AC-03** | Body ขาด username/password หรือเป็นค่าว่าง → 400 `VALIDATION_ERROR` | Boundary | FR-01 |
| **AC-04** | ทุก Protected route ใน Role Matrix เรียกโดยไม่มี Token, Token รูปแบบผิด, Token ที่ลายเซ็นไม่ถูกต้อง หรือหมดอายุ → 401 `UNAUTHENTICATED` และ Body ไม่มีข้อมูลส่วนตัว | Negative | NFR-02 |
| **AC-05** | Logout → 200; ใช้ Token เดิมเรียก `GET /api/auth/me` → 401; ล็อกอินใหม่ได้ Token ที่ใช้งานได้ | Positive+Negative | FR-01 |
| **AC-06** | `GET /api/auth/me` คืน id, username, fullName, role; Box Master เห็น `assignedSeries` ตาม Seed (`staff_crybaby`→CRY; `staff_labubu`→LAB); Collector ได้ `[]` | Positive | FR-02 |
| **AC-07** | `passwordHash` ทุกบัญชีใน DB ตรง pattern Bcrypt cost ≥ 10 และไม่เท่ากับรหัสผ่านต้นฉบับ | Security | NFR-01 |
| **AC-08** | `requireRole(['BOX_MASTER'])` ปล่อยผู้ใช้ Role `BOX_MASTER` และปฏิเสธ `COLLECTOR` ด้วย 403 `FORBIDDEN_ROLE` (Unit) | Role | BR-04 |

### 1.10 Software Test Specification (STS) – F-01

| Test ID | AC | Level | Precondition / Input | Action | Expected Result |
| :---: | :---: | :---: | :--- | :--- | :--- |
| **TEST-01** | AC-01 | Integration | Seed มี `collector1`, `staff_crybaby` | `POST /api/auth/login` ด้วยรหัสถูกต้อง | 200; มี `token`; `user.role` = `COLLECTOR` / `BOX_MASTER`; ถอด JWT ได้ `sub` ตรง |
| **TEST-02** | AC-02 | Integration | (a) `collector1` + รหัสผิด (b) username `nobody` | `POST /api/auth/login` | ทั้งสองกรณี 401 `INVALID_CREDENTIALS` body เหมือนกัน; ไม่มี `token` |
| **TEST-03** | AC-03 | Integration | Body `{}`, `{username:""}`, `{password:"x"}` | `POST /api/auth/login` | 400 `VALIDATION_ERROR` ทุกกรณี |
| **TEST-04** | AC-04 | Integration | ตารางรายการ Protected route (จาก Role Matrix) | ยิงแต่ละ route โดย: ไม่มี header / `Bearer garbage` / Token แก้ payload / Token `exp` ในอดีต | ทุกกรณี 401 `UNAUTHENTICATED`; body ไม่มี field ของตั๋ว/ผู้ใช้ |
| **TEST-05** | AC-05 | Integration | Token ใหม่ของ `collector1` | `POST /api/auth/logout` แล้ว `GET /api/auth/me` ด้วย Token เดิม แล้ว login ใหม่และ `GET /me` | logout 200; `/me` ครั้งแรก 401; Token ใหม่ `/me` 200; ค่า `tokenVersion` ใน DB เพิ่ม 1 |
| **TEST-06** | AC-06 | Integration | Token `staff_crybaby`, `staff_labubu`, `collector1` | `GET /api/auth/me` | staff_crybaby→`assignedSeries=[CRY]`; staff_labubu→`[LAB]`; collector1→`[]`; role ถูกต้อง |
| **TEST-07** | AC-07 | Integration (DB) | หลังรัน Seed | Query `passwordHash` ของทุก User ใน PostgreSQL | ตรง regex `^\$2[aby]\$(\d{2})\$` และ cost ≥ 10; ≠ รหัสต้นฉบับ; `bcrypt.compare` สำเร็จ |
| **TEST-08U** | AC-08 | Unit | `req.user.role` = COLLECTOR และ BOX_MASTER | เรียก `requireRole(['BOX_MASTER'])` | BOX_MASTER ผ่าน (`next()`); COLLECTOR ถูกปฏิเสธ 403 `FORBIDDEN_ROLE` |

### 1.11 Definition of Done & Evidence – F-01
- [ ] AC-01..08 มี Test (TEST-01..08U) ทำงานจริง; แสดงหลักฐาน Test ล้ม (แดง) ก่อนแล้วผ่าน (เขียว) พร้อม commit ID
- [ ] PR เข้า `sprint-1-staging` ผ่านการ Review โดยเพื่อนร่วมทีม (มีความเห็นเฉพาะเจาะจง)
- [ ] README อธิบาย env + seed + login; ไม่มี Secret ใน Git
- [ ] หลักฐาน: ผลรัน Test พร้อม commit, ภาพ Login/Logout (Part F Demo 3), ข้อจำกัดที่ยังไม่ทำเปิดเผยแล้ว

---

## 2. Feature Contract: F-02 – Queue Discovery & Safe Joining

### 2.1 Purpose & Scope
แสดงซีรีส์และจำนวนคิวรอ ให้ Collector รับบัตรคิวโดยเลขต่อเนื่องปลอดภัยภายใต้การแข่งขัน ห้ามตั๋ว Active ซ้อน และห้ามเข้าซีรีส์ที่ปิด **นอก Scope:** ยกเลิกตั๋ว (F-05), เปิด–ปิดซีรีส์ผ่านระบบ (F-09)

### 2.2 Linked Requirements & Dependencies
FR-03, FR-04, BR-01, BR-02, BR-09, BR-04 (Box Master ห้าม join), NFR-03, NFR-04, NFR-06 | Dependencies: F-01 (Auth/Role)

### 2.3 Workflow & Business Rules
1. `GET /api/series` (สาธารณะ) → รายการซีรีส์ + `waitingCount` (ตั๋ว WAITING ของวันนี้ Asia/Bangkok)
2. Collector `POST /api/tickets/join` ใน Transaction เดียว: ตรวจซีรีส์มีอยู่ → ตรวจ `isActive` → ออกเลขด้วย Raw SQL `ON CONFLICT` (Part C §4) → INSERT ตั๋ว `WAITING` (`displayNumber = CODE-` + เลข 3 หลัก)
3. ผู้ใช้ที่มีตั๋ว Active อยู่แล้ว (ซีรีส์ใดก็ตาม) → ชน `unique_active_ticket_user` → `DUPLICATE_ACTIVE_QUEUE` และ Rollback (เลขไม่ถูกใช้)
4. `userId` มาจาก Token เท่านั้น

### 2.4 Permissions
`GET /api/series`: ทุกคน | `POST /api/tickets/join`: Collector เท่านั้น (Box Master 403, ไม่ล็อกอิน 401)

### 2.5 Validation & Failure / Boundary Cases

| กรณี | ผลที่ต้องได้ |
| :--- | :--- |
| `seriesId` ขาด/ไม่ใช่ UUID | 400 `VALIDATION_ERROR` |
| `seriesId` ไม่มีในระบบ | 404 `RESOURCE_NOT_FOUND` |
| ซีรีส์ `isActive=false` (SKP) | 409 `SERIES_CLOSED` ไม่สร้างตั๋ว |
| ผู้ใช้มีตั๋ว Active แล้ว | 409 `DUPLICATE_ACTIVE_QUEUE` ไม่สร้างตั๋วใหม่ |
| Box Master เรียก join | 403 `FORBIDDEN_ROLE` |
| 50 คำขอพร้อมกัน (ผู้ใช้ต่างกัน) | ทุกคำขอ 201 เลข 1..50 ไม่ซ้ำไม่ข้าม |
| 10 คำขอพร้อมกัน (ผู้ใช้เดียว) | 201 หนึ่งครั้ง, 409 เก้าครั้ง |
| ข้ามเที่ยงคืนเวลาไทย | เลขรีเซ็ตเป็น 1 ของ `queueDate` ใหม่ |
| หลังตั๋วใบแรกออกจากคิว (COMPLETED) | ผู้ใช้อื่น join ได้เลขถัดไป (ไม่ reuse) |

### 2.6 UI Behavior
`/series`: การ์ดซีรีส์ (ชื่อ, รหัส, จำนวนคิวรอ, ป้ายเปิด/ปิด) + ปุ่ม **Join Queue** (ปุ่ม Disabled + ข้อความ "ปิดรับคิว" สำหรับซีรีส์ปิด; Loading บนปุ่มระหว่างส่ง; สำเร็จ → `/my-ticket`; 409 แสดงกล่องแดงตามรหัสข้อผิดพลาด) | Empty state เมื่อไม่มีซีรีส์ | ต้องไม่มี horizontal overflow ที่ 375px

### 2.7 API Specifications

| Method / Path | Request | Success | Errors |
| :--- | :--- | :--- | :--- |
| `GET /api/series` | – | 200 `{ "data": [ { "id","code":"CRY","name","isActive":true,"waitingCount":3 }, … ] }` | – |
| `POST /api/tickets/join` | Bearer (Collector); `{ "seriesId": "<uuid>" }` | 201 `{ "data": { "ticketId","displayNumber":"CRY-001","queueNumber":1,"queueDate":"2026-11-08","status":"WAITING","seriesName","createdAt" } }` | 400 `VALIDATION_ERROR`, 401 `UNAUTHENTICATED`, 403 `FORBIDDEN_ROLE`, 404 `RESOURCE_NOT_FOUND`, 409 `DUPLICATE_ACTIVE_QUEUE`, 409 `SERIES_CLOSED` |

### 2.8 Data Changes
ตาราง `Series`, `QueueTicket`, `QueueCounter` (Migration `0001_init`); **Migration `0002`:** `unique_active_ticket_user` (partial unique index); Constraint `@@unique([seriesId, queueDate, queueNumber])`, `@@unique([seriesId, queueDate])`; Seed 3 ซีรีส์

### 2.9 Acceptance Criteria (F-02)

| AC ID | Observable Outcome | ประเภท | Req |
| :---: | :--- | :---: | :---: |
| **AC-09** | `GET /api/series` (ไม่ล็อกอิน) → 200 รายการ CRY, LAB, SKP พร้อม `isActive` และ `waitingCount` ตรงกับจำนวนตั๋ว WAITING วันนี้ | Positive | FR-03 |
| **AC-10** | Collector ที่ไม่มีตั๋ว Active join CRY → 201, `status=WAITING`, `displayNumber=CRY-001`, `queueNumber=1`; ใน DB มี 1 แถวตรงกัน (`userId` จาก Token) | Positive | FR-04, BR-01 |
| **AC-11** | Collector ที่มีตั๋ว Active อยู่แล้ว join (ซีรีส์เดิมหรือต่างซีรีส์) → 409 `DUPLICATE_ACTIVE_QUEUE`; ใน DB ยังมีตั๋ว Active เพียง 1 ใบ | Negative | BR-02 |
| **AC-12** | join SKP (ปิด) → 409 `SERIES_CLOSED`; ไม่มีตั๋วถูกสร้าง | Negative | BR-09, FR-04 |
| **AC-13** | join ด้วย `seriesId` ที่ไม่มี → 404 `RESOURCE_NOT_FOUND`; `seriesId` ขาด/ไม่ใช่ UUID → 400 `VALIDATION_ERROR` | Boundary | FR-04 |
| **AC-14** | Box Master เรียก join → 403 `FORBIDDEN_ROLE`; ไม่มี Token → 401; ไม่มีตั๋วถูกสร้าง | Role | BR-04, NFR-02 |
| **AC-15** | Collector 50 คน (บัญชีต่างกัน) join CRY พร้อมกัน → ทุกคำขอ 201; `queueNumber` ครบ 1..50 ไม่ซ้ำ ไม่ข้าม | Concurrency | BR-01, NFR-03 |
| **AC-16** | Collector คนเดียว join 10 คำขอพร้อมกัน → 201 เพียง 1 ครั้ง อีก 9 ครั้ง 409 `DUPLICATE_ACTIVE_QUEUE`; ตั๋ว Active ใน DB = 1 | Concurrency | BR-02, NFR-04 |
| **AC-17** | `getQueueDate()` แปลงเวลาเป็นวันที่ Asia/Bangkok ถูกต้อง (16:59:59Z และ 17:00:00Z คนละวัน); join ที่ 23:59:59+07 กับ 00:00:01+07 วันถัดไป ได้เลขสุดท้ายของวันเดิมและเลข 1 ของวันใหม่ตามลำดับ | Boundary | BR-01, A-01 |
| **AC-18** | หลังตั๋วใบ 001 เป็น COMPLETED ผู้ใช้อื่น join ได้ `002` (ไม่ reuse 001) | Boundary | BR-01 |
| **AC-19** | (E2E) ล็อกอิน → `/series` → Join CRY → `/my-ticket` แสดงเลขคิวและ `WAITING`; Join ซ้ำแสดงข้อผิดพลาด `DUPLICATE_ACTIVE_QUEUE` | E2E | FR-04 |
| **AC-20** | (E2E) ที่ viewport 375×667 หน้า `/login`, `/series`, `/my-ticket`, `/staff/counter` ไม่มี horizontal overflow (`scrollWidth ≤ clientWidth`) | E2E | NFR-06 |

### 2.10 Software Test Specification (STS) – F-02

| Test ID | AC | Level | Precondition / Input | Action | Expected Result |
| :---: | :---: | :---: | :--- | :--- | :--- |
| **TEST-09** | AC-09 | Integration | Seed 3 ซีรีส์; มีตั๋ว WAITING CRY 3 ใบ | `GET /api/series` ไม่ส่ง Token | 200; CRY `waitingCount=3`, LAB 0, SKP `isActive=false` |
| **TEST-10** | AC-10 | Integration | `collector1` ไม่มีตั๋ว | `POST /api/tickets/join` {CRY} | 201; `CRY-001`, `WAITING`; DB มีแถว `userId=collector1`, `queueNumber=1` |
| **TEST-11** | AC-11 | Integration | `collector1` มีตั๋ว CRY WAITING | join CRY อีกครั้ง และ join LAB | ทั้งสอง 409 `DUPLICATE_ACTIVE_QUEUE`; DB ตั๋ว Active ของ collector1 = 1; `QueueCounter` ไม่ถูกใช้ไปโดยเปล่า (lastNumber เท่าเดิม) |
| **TEST-12** | AC-12 | Integration | ซีรีส์ SKP `isActive=false` | join SKP | 409 `SERIES_CLOSED`; จำนวนตั๋ว SKP ใน DB = 0 |
| **TEST-13** | AC-13 | Integration | – | join ด้วย UUID สุ่มที่ไม่มี / `{}` / `{seriesId:"abc"}` | 404 `RESOURCE_NOT_FOUND` / 400 / 400 `VALIDATION_ERROR` |
| **TEST-14** | AC-14 | Integration | Token `staff_crybaby`; และไม่ส่ง Token | join CRY | 403 `FORBIDDEN_ROLE`; 401 `UNAUTHENTICATED`; ไม่มีตั๋วเพิ่ม |
| **TEST-15** | AC-15 | Concurrency | Fixture 50 Collector ต่างบัญชี | `Promise.all` join CRY 50 คำขอ | 50 × 201; เซต `queueNumber` = {1..50}; ไม่มีซ้ำ; `QueueCounter.lastNumber=50` |
| **TEST-16** | AC-16 | Concurrency | `collector2` ไม่มีตั๋ว | `Promise.all` join 10 คำขอ | 201 จำนวน 1; 409 `DUPLICATE_ACTIVE_QUEUE` จำนวน 9; DB ตั๋ว Active = 1 |
| **TEST-17U** | AC-17 | Unit | `Date` = 2026-11-08T16:59:59Z, 17:00:00Z | `getQueueDate(now)` | `2026-11-08` และ `2026-11-09` ตามลำดับ |
| **TEST-17** | AC-17 | Integration | `clock` = 23:59:59+07 แล้ว 00:00:01+07 (วันถัดไป) ผู้ใช้ต่างกัน | join CRY ทั้งสองครั้ง | ครั้งแรกได้เลข n ของวันเดิม; ครั้งหลังได้ `001` และ `queueDate` ใหม่ |
| **TEST-18** | AC-18 | Integration | ตั๋ว CRY-001 สถานะ COMPLETED (ตั้งผ่าน DB fixture) | `collector3` join CRY | 201 `CRY-002` |
| **TEST-19** | AC-19 | E2E (Playwright) | DB เทสต์ว่าง; `collector1` | Login → เลือก CRY → Join → กด Join ซ้ำ | ถึง `/my-ticket` เห็น `CRY-001` + `WAITING`; Join ซ้ำเห็นข้อความ/รหัส `DUPLICATE_ACTIVE_QUEUE` |
| **TEST-20** | AC-20 | E2E (Playwright) | viewport 375×667; ล็อกอินเป็น Collector และ Box Master | เปิดทุกหน้า Sprint 1 | `document.documentElement.scrollWidth ≤ clientWidth` ทุกหน้า |

### 2.11 Definition of Done & Evidence – F-02
- [ ] AC-09..20 มี Test ที่รันจริง; TEST-15/16 รันซ้ำอย่างน้อย 5 รอบเพื่อยืนยันความเสถียร (บันทึกผล)
- [ ] หลักฐาน TDD แดง→เขียว สำหรับ AC-11 และ AC-15 (commit ID)
- [ ] PR ผ่าน Review (ตรวจ Transaction/Raw SQL/การแมป P2002 ตามชื่อ constraint)
- [ ] Migration `0002` มีอยู่และรันบน DB ว่างสำเร็จ; README อัปเดต
- [ ] หลักฐาน: ภาพ Demo 1 (ขั้นตอน join) และ Demo 2 (409 ซ้ำ), ข้อจำกัดเปิดเผยแล้ว

---

## 3. Feature Contract: F-03 – Box Master Service Counter

### 3.1 Purpose & Scope
ให้ Box Master ดูคิวรอเฉพาะซีรีส์ที่ตนรับผิดชอบ เรียกคิวถัดไปตามลำดับ (FIFO) ยืนยันตัวลูกค้าหน้าเคาน์เตอร์ (Verify & Start) และจบบริการ พร้อมบังคับ State Machine, สิทธิ์ซีรีส์ และสิทธิ์เฉพาะผู้ Call **นอก Scope:** Cancel/No-Show (F-05/F-06), Analytics (F-08)

### 3.2 Linked Requirements & Dependencies
FR-07, FR-08, FR-09, FR-10, BR-03, BR-04, BR-05, BR-06, BR-07 | Dependencies: F-01 (Auth/Role), F-02 (ตั๋ว WAITING, ซีรีส์)

### 3.3 Workflow & Business Rules
1. `GET /api/staff/tickets` → ต่อซีรีส์ที่ได้รับมอบหมาย: `activeServing` (ตั๋ว CALLED/UNBOXING ที่ตนถือ) และ `waitingQueue` (WAITING เรียงตามเลข)
2. **Call Next** (Transaction): ตรวจสิทธิ์ซีรีส์ → ตรวจตนไม่มี CALLED/UNBOXING (`STAFF_BUSY`) → เลือก WAITING เลขน้อยสุดด้วย `FOR UPDATE SKIP LOCKED` → `status=CALLED`, `handledByStaffId=ตน`, `calledAt=now`
3. **Verify & Start:** ผู้ Call กดเมื่อลูกค้ามาถึงจริง → `UNBOXING`, `startedAt=now`
4. **Complete:** ผู้ Call กด → `COMPLETED`, `completedAt=now`; พนักงาน Call Next ใหม่ได้
5. **ลำดับตรวจสอบ Start/Complete:** Auth → Role → UUID validation → ตั๋วมีอยู่ (404) → ซีรีส์อยู่ในสิทธิ์ (`FORBIDDEN_SERIES`) → ถ้าตั๋วมี handler แล้วต้องเป็นตนเอง (`FORBIDDEN_NOT_HANDLER`) → State (`INVALID_STATE_TRANSITION`) *(ตั๋ว WAITING ยังไม่มี handler จึงได้ 400 ตาม State)*
6. State ที่อนุญาต: `WAITING→CALLED→UNBOXING→COMPLETED` เท่านั้น; ลูกค้าไม่มีทางเรียก endpoint เหล่านี้

### 3.4 Permissions
ทุก endpoint ของ Feature: Box Master เท่านั้น (Collector 403 `FORBIDDEN_ROLE`, ไม่ล็อกอิน 401) | ขอบเขต: เฉพาะซีรีส์ที่ได้รับมอบหมาย; Start/Complete เฉพาะผู้ Call

### 3.5 Validation & Failure / Boundary Cases

| กรณี | ผลที่ต้องได้ |
| :--- | :--- |
| Call Next ซีรีส์ที่ไม่ได้รับมอบหมาย (staff_crybaby → LAB) | 403 `FORBIDDEN_SERIES` ตั๋วไม่เปลี่ยน |
| Call Next เมื่อไม่มี WAITING | 404 `EMPTY_QUEUE` |
| Call Next ขณะตนมี CALLED/UNBOXING | 409 `STAFF_BUSY` ไม่มีตั๋วอื่นเปลี่ยน |
| `seriesId`/`:id` ผิดรูปแบบ | 400 `VALIDATION_ERROR` |
| `:id` ไม่มี | 404 `RESOURCE_NOT_FOUND` |
| ข้ามขั้น/ย้อน: WAITING→UNBOXING/COMPLETED, CALLED→COMPLETED, COMPLETED→UNBOXING/COMPLETED | 400 `INVALID_STATE_TRANSITION` ตั๋วไม่เปลี่ยน |
| Staff ซีรีส์อื่น Start/Complete ตั๋ว | 403 `FORBIDDEN_SERIES` |
| Staff ซีรีส์เดียวกันแต่ไม่ใช่ผู้ Call Start/Complete | 403 `FORBIDDEN_NOT_HANDLER` |
| Staff 2 คน Call Next พร้อมกัน (ซีรีส์เดียวกัน) | ได้คนละใบ ไม่ซ้ำ |
| Staff คนเดียวกด Call Next ซ้อนพร้อมกัน | สำเร็จ 1 ใบ ที่เหลือ 409 `STAFF_BUSY` |
| Call Next ใหม่หลัง Complete | สำเร็จ (ได้ตั๋วถัดไป) |

### 3.6 UI Behavior
`/staff/counter`: เลือกซีรีส์ (ถ้าดูแลหลายซีรีส์), กล่อง **Current Serving** (เลข/สถานะ), รายการคิวรอ, ปุ่ม **Call Next** (Disabled เมื่อมี CALLED/UNBOXING), ปุ่ม **Verify & Start Unboxing** (แสดงเมื่อ CALLED), ปุ่ม **Complete** (แสดงเมื่อ UNBOXING) | Loading ระหว่างเรียก, Empty "ไม่มีคิวรอ", Error แสดงรหัสข้อผิดพลาด | การปิดปุ่มเป็นเพียง UX – Backend บังคับกฎจริง | Polling 3 วินาที

### 3.7 API Specifications

| Method / Path | Request | Success | Errors |
| :--- | :--- | :--- | :--- |
| `GET /api/staff/tickets` | Bearer (Box Master) | 200 `{ "data": { "series": [ { "seriesId","code","name","activeServing": null \| { "id","displayNumber","status","calledAt","startedAt" }, "waitingQueue": [ { "id","displayNumber","queueNumber","createdAt","userFullName" } ] } ] } }` | 401, 403 `FORBIDDEN_ROLE` |
| `POST /api/staff/call-next` | `{ "seriesId": "<uuid>" }` | 200 `{ "data": { "ticketId","displayNumber","status":"CALLED","handledByStaffId","calledAt" } }` | 400 `VALIDATION_ERROR`, 401, 403 `FORBIDDEN_ROLE`/`FORBIDDEN_SERIES`, 404 `EMPTY_QUEUE`, 409 `STAFF_BUSY` |
| `POST /api/staff/tickets/:id/start-unboxing` | – | 200 `{ "data": { "ticketId","status":"UNBOXING","startedAt" } }` | 400 `VALIDATION_ERROR`/`INVALID_STATE_TRANSITION`, 401, 403 `FORBIDDEN_ROLE`/`FORBIDDEN_SERIES`/`FORBIDDEN_NOT_HANDLER`, 404 `RESOURCE_NOT_FOUND` |
| `POST /api/staff/tickets/:id/complete` | – | 200 `{ "data": { "ticketId","status":"COMPLETED","completedAt" } }` | เช่นเดียวกับ start-unboxing |

### 3.8 Data Changes
ใช้ฟิลด์ `handledByStaffId`, `calledAt`, `startedAt`, `completedAt`, `status` ของ `QueueTicket` (มีใน `0001_init`) | **Migration `0002`:** `unique_active_staff_ticket` (partial unique index) | ตาราง `StaffSeriesAssignment` + Seed ผูกสิทธิ์ (F-01) | ไม่เพิ่มตารางใหม่

### 3.9 Acceptance Criteria (F-03)

| AC ID | Observable Outcome | ประเภท | Req |
| :---: | :--- | :---: | :---: |
| **AC-21** | `staff_crybaby` เรียก `GET /api/staff/tickets` เห็นเฉพาะตั๋ว WAITING ของ CRY (เรียงเลข) ไม่มีตั๋ว LAB; `staff_labubu` เห็นเฉพาะ LAB | Positive/Role | FR-07, BR-05 |
| **AC-22** | `staff_crybaby` Call Next (CRY) ที่มี WAITING เลข 1,2 → ได้เลข 1: `status=CALLED`, `handledByStaffId=staff_crybaby`, `calledAt` มีค่า; ตั๋วเลข 2 ยัง WAITING | Positive | FR-08, BR-03 |
| **AC-23** | Call Next เมื่อ CRY ไม่มี WAITING → 404 `EMPTY_QUEUE` | Boundary | FR-08 |
| **AC-24** | `staff_crybaby` ถือตั๋ว CALLED/UNBOXING แล้ว Call Next อีก → 409 `STAFF_BUSY`; ตั๋ว WAITING ที่เหลือไม่เปลี่ยน | Negative | BR-06 |
| **AC-25** | `staff_crybaby` Call Next ด้วย `seriesId` ของ LAB → 403 `FORBIDDEN_SERIES`; ตั๋ว LAB ไม่เปลี่ยน | Role/Scope | BR-05, FR-08 |
| **AC-26** | ผู้ Call เรียก start-unboxing กับตั๋ว CALLED → 200 `UNBOXING` + `startedAt` | Positive | FR-09, BR-03, BR-07 |
| **AC-27** | ผู้ Call เรียก complete กับตั๋ว UNBOXING → 200 `COMPLETED` + `completedAt`; จากนั้น Call Next ได้ตั๋วใบถัดไป | Positive | FR-10, BR-03 |
| **AC-28** | การเปลี่ยนสถานะที่ไม่อยู่ใน State Table (WAITING→UNBOXING, WAITING→COMPLETED, CALLED→COMPLETED, COMPLETED→UNBOXING, COMPLETED→COMPLETED) → 400 `INVALID_STATE_TRANSITION`; สถานะใน DB ไม่เปลี่ยน | Negative | BR-03 |
| **AC-29** | `staff_labubu` เรียก start-unboxing และ complete กับตั๋ว CRY → 403 `FORBIDDEN_SERIES`; ตั๋วไม่เปลี่ยน | Role/Scope | BR-05 |
| **AC-30** | `staff_crybaby2` (ซีรีส์ CRY เดียวกัน แต่ไม่ใช่ผู้ Call) เรียก start-unboxing และ complete กับตั๋วที่ `staff_crybaby` Call ไว้ → 403 `FORBIDDEN_NOT_HANDLER`; ตั๋วไม่เปลี่ยน | Role/Ownership | BR-07 |
| **AC-31** | Collector เรียกทั้ง 4 endpoint ของ Staff → 403 `FORBIDDEN_ROLE`; ตั๋วใน DB ไม่เปลี่ยน | Role | BR-04, NFR-02 |
| **AC-32** | (ก) `staff_crybaby` และ `staff_crybaby2` Call Next พร้อมกันเมื่อมี WAITING 3 ใบ → ทั้งคู่ 200 และได้ตั๋วต่างกัน (เลข 1 และ 2) (ข) `staff_crybaby` ส่ง Call Next 5 คำขอพร้อมกัน → 200 เพียง 1 ครั้ง อีก 4 ครั้ง 409 `STAFF_BUSY` | Concurrency | BR-06, FR-08 |
| **AC-33** | (E2E) Collector join ผ่าน UI → Box Master Call Next → หน้า Collector แสดง `CALLED` (ผ่าน Polling โดยไม่ reload) → Box Master กด Verify & Start → Complete → ตั๋วเป็น `COMPLETED` และดึงข้อมูลที่บันทึกไว้ได้ | E2E | FR-09, FR-10 |

### 3.10 Software Test Specification (STS) – F-03

| Test ID | AC | Level | Precondition / Input | Action | Expected Result |
| :---: | :---: | :---: | :--- | :--- | :--- |
| **TEST-21** | AC-21 | Integration | ตั๋ว WAITING: CRY 2 ใบ, LAB 1 ใบ | `GET /api/staff/tickets` ด้วย Token `staff_crybaby` และ `staff_labubu` | crybaby เห็น CRY 2 ใบเรียงเลข ไม่มี LAB; labubu เห็น LAB 1 ใบเท่านั้น |
| **TEST-22** | AC-22 | Integration | CRY WAITING เลข 1, 2 | `staff_crybaby` `POST /call-next` {CRY} | 200; ตั๋วเลข 1 `CALLED`; DB: `handledByStaffId`=id ของ staff_crybaby, `calledAt` ไม่ว่าง; เลข 2 ยัง `WAITING` |
| **TEST-23** | AC-23 | Integration | CRY ไม่มี WAITING | `POST /call-next` {CRY} | 404 `EMPTY_QUEUE` |
| **TEST-24** | AC-24 | Integration | `staff_crybaby` ถือตั๋ว CALLED; มี WAITING อีก 1 ใบ | `POST /call-next` {CRY} อีกครั้ง | 409 `STAFF_BUSY`; ตั๋ว WAITING เดิมไม่เปลี่ยน |
| **TEST-25** | AC-25 | Integration | LAB มี WAITING 1 ใบ | `staff_crybaby` `POST /call-next` {LAB} | 403 `FORBIDDEN_SERIES`; ตั๋ว LAB ยัง `WAITING` ไม่มี `handledByStaffId` |
| **TEST-26** | AC-26 | Integration | ตั๋ว `CALLED` โดย staff_crybaby | `POST /tickets/:id/start-unboxing` ด้วย staff_crybaby | 200 `UNBOXING`; DB `startedAt` ไม่ว่าง |
| **TEST-27** | AC-27 | Integration | ตั๋ว `UNBOXING` โดย staff_crybaby; มี WAITING อีก 1 ใบ | `POST /complete` แล้ว `POST /call-next` | complete 200 `COMPLETED` + `completedAt`; call-next 200 ได้ตั๋วใบถัดไป |
| **TEST-28** | AC-28 | Integration (parameterized) | ตั๋วอยู่สถานะ WAITING / CALLED / COMPLETED | ยิง action ผิดลำดับ (ตามรายการใน AC-28) ด้วยผู้ Call | ทุกกรณี 400 `INVALID_STATE_TRANSITION`; DB สถานะเดิม |
| **TEST-28U** | AC-28 | Unit | ตารางคู่ (from, action) | `canTransition(from, action)` | คืน true เฉพาะ 3 การเปลี่ยนที่อนุญาต; อื่นๆ false |
| **TEST-29** | AC-29 | Integration | ตั๋ว CRY `CALLED` โดย staff_crybaby (และอีกใบ `UNBOXING`) | `staff_labubu` ยิง start-unboxing และ complete | 403 `FORBIDDEN_SERIES` ทั้งคู่; สถานะตั๋วไม่เปลี่ยน |
| **TEST-30** | AC-30 | Integration | ตั๋ว CRY `CALLED`/`UNBOXING` โดย staff_crybaby | `staff_crybaby2` ยิง start-unboxing และ complete | 403 `FORBIDDEN_NOT_HANDLER` ทั้งคู่; สถานะไม่เปลี่ยน |
| **TEST-31** | AC-31 | Integration | Token `collector1`; มีตั๋วหลายสถานะ | ยิง `GET /staff/tickets`, `POST /call-next`, `/start-unboxing`, `/complete` | ทุกกรณี 403 `FORBIDDEN_ROLE`; ตั๋วไม่เปลี่ยน |
| **TEST-32a** | AC-32 | Concurrency | CRY WAITING 3 ใบ | staff_crybaby และ staff_crybaby2 `call-next` พร้อมกัน | ทั้งคู่ 200; ได้ตั๋วต่างกัน (เลข 1, 2); ไม่มีตั๋วถูก Call สองครั้ง |
| **TEST-32b** | AC-32 | Concurrency | CRY WAITING 5 ใบ; staff_crybaby ไม่มีตั๋ว | `Promise.all` call-next 5 ครั้ง | 200 จำนวน 1; 409 `STAFF_BUSY` จำนวน 4; DB มีตั๋ว CALLED ของพนักงานนี้ 1 ใบ |
| **TEST-33** | AC-33 | E2E (Playwright) | DB เทสต์ว่าง; `collector1`, `staff_crybaby` (สอง browser context) | Collector join → Staff Call Next → รอหน้า Collector แสดง `CALLED` → Staff Verify & Start → Complete → ตรวจ `GET /api/tickets/:id` | หน้า Collector เปลี่ยนเป็น CALLED โดยไม่ reload; สถานะสุดท้าย `COMPLETED` พร้อม timestamp ครบ |

### 3.11 Definition of Done & Evidence – F-03
- [ ] AC-21..33 มี Test ที่รันจริงทั้ง Integration, Concurrency และ E2E
- [ ] หลักฐาน TDD แดง→เขียว อย่างน้อยสำหรับ AC-25 (Scope) และ AC-30 (Handler) พร้อม commit ID
- [ ] PR ผ่านการ Review (ตรวจ SKIP LOCKED, ลำดับตรวจสอบ, ไม่มี Role/userId จาก Client)
- [ ] Migration `0002` ครบ 2 Partial Index; Seed ผูกสิทธิ์ถูกต้อง
- [ ] หลักฐาน: ภาพ Demo 1 (ขั้นตอน Staff) และ Demo 3 (Forbidden series/Collector→Staff) + ผลรัน Test

---

## 4. Feature Contract: F-04 – Ticket Inspection & Ownership

### 4.1 Purpose & Scope
ให้ Collector ดูตั๋ว Active ของตนและดึงรายละเอียดตั๋วตาม ID (รวมตั๋วที่เสร็จแล้วเพื่อ "ดึงผลลัพธ์ที่บันทึกไว้") โดยบังคับสิทธิ์เจ้าของ/ซีรีส์ และพิสูจน์ว่าข้อมูลคงอยู่หลัง Restart DB **นอก Scope:** ประวัติตั๋วหลายใบ/ค้นหา

### 4.2 Linked Requirements & Dependencies
FR-05, FR-06, BR-04, NFR-02, NFR-05 | Dependencies: F-01, F-02 (ตั๋ว), F-03 (สถานะ CALLED/COMPLETED ที่ต้องแสดง)

### 4.3 Workflow & Business Rules
1. `my-ticket`: คืนตั๋ว Active (`WAITING/CALLED/UNBOXING`) ของผู้ใช้จาก Token; `waitingAhead` = จำนวนตั๋ว `WAITING` ซีรีส์/วันเดียวกันที่ `queueNumber` น้อยกว่า (0 ถ้าสถานะไม่ใช่ WAITING)
2. `tickets/:id`: ลำดับตรวจสอบ Auth → Role → UUID → ตั๋วมีอยู่ (404) → สิทธิ์ (Collector ต้องเป็นเจ้าของ, Box Master ต้องดูแลซีรีส์) → ตอบ
3. UI Polling 3 วินาทีจาก `my-ticket`; เมื่อสถานะ CALLED แสดงข้อความเรียกพร้อมนับถอยหลัง 120 วินาที (แสดงผลเท่านั้นใน Sprint 1)

### 4.4 Permissions
`my-ticket`: Collector เท่านั้น (Box Master 403) | `tickets/:id`: เจ้าของตั๋ว หรือ Box Master ของซีรีส์นั้น; อื่นๆ 403

### 4.5 Validation & Failure / Boundary Cases

| กรณี | ผลที่ต้องได้ |
| :--- | :--- |
| ไม่มีตั๋ว Active | 404 `NO_ACTIVE_TICKET` |
| Collector ดูตั๋วของผู้อื่น | 403 `FORBIDDEN_OWNERSHIP` ไม่คืนข้อมูลตั๋ว |
| Box Master ดูตั๋วซีรีส์ที่ไม่ได้ดูแล | 403 `FORBIDDEN_SERIES` |
| `:id` ไม่มี / ผิดรูปแบบ UUID | 404 `RESOURCE_NOT_FOUND` / 400 `VALIDATION_ERROR` |
| ไม่ล็อกอิน | 401 `UNAUTHENTICATED` |
| Restart DB | ข้อมูลตั๋วทุกสถานะ+ตัวนับยังอยู่ และ join ถัดไปได้เลขต่อเนื่อง |

### 4.6 UI Behavior
`/my-ticket`: การ์ดตั๋วใหญ่ (เลข, ซีรีส์, สถานะ, "เหลืออีก N คิวก่อนหน้า"); CALLED → กรอบเตือนสีส้ม "ถึงคิวแล้ว กรุณามาที่เคาน์เตอร์" + นับถอยหลัง; UNBOXING → "กำลังให้บริการ"; Empty state เมื่อไม่มีตั๋ว (ลิงก์ไป `/series`); Error state พร้อมปุ่มลองใหม่; Polling 3 วินาที

### 4.7 API Specifications

| Method / Path | Request | Success | Errors |
| :--- | :--- | :--- | :--- |
| `GET /api/tickets/my-ticket` | Bearer (Collector) | 200 `{ "data": { "ticket": { "id","displayNumber","queueNumber","status","waitingAhead","series": { "id","code","name" },"createdAt","calledAt","startedAt" } } }` | 401, 403 `FORBIDDEN_ROLE`, 404 `NO_ACTIVE_TICKET` |
| `GET /api/tickets/:id` | Bearer | 200 `{ "data": { "id","displayNumber","status","series","createdAt","calledAt","startedAt","completedAt" } }` (Box Master เพิ่ม `userFullName`) | 400 `VALIDATION_ERROR`, 401, 403 `FORBIDDEN_OWNERSHIP`/`FORBIDDEN_SERIES`, 404 `RESOURCE_NOT_FOUND` |

### 4.8 Data Changes
**ไม่มีการเปลี่ยนแปลง Schema/Migration** (อ่านจากตาราง `QueueTicket`, `Series` ที่สร้างใน F-02/F-03) | **UI:** เพิ่มหน้า `/my-ticket` | **API:** เพิ่ม 2 GET endpoint

### 4.9 Acceptance Criteria (F-04)

| AC ID | Observable Outcome | ประเภท | Req |
| :---: | :--- | :---: | :---: |
| **AC-34** | `collector1` ที่มีตั๋ว CRY-003 WAITING และมี WAITING เลข 1, 2 อยู่ก่อน → `my-ticket` 200 คืนตั๋วของตนเอง `waitingAhead=2` และไม่คืนตั๋วผู้อื่น; เมื่อถูก CALLED `waitingAhead=0` และมี `calledAt` | Positive | FR-05 |
| **AC-35** | Collector ที่ไม่มีตั๋ว Active (รวมกรณีตั๋วเดิม COMPLETED) เรียก `my-ticket` → 404 `NO_ACTIVE_TICKET`; Box Master เรียก → 403 `FORBIDDEN_ROLE` | Boundary/Role | FR-05, BR-04 |
| **AC-36** | เจ้าของเรียก `GET /api/tickets/:id` ของตั๋ว COMPLETED → 200 พร้อม `status=COMPLETED` และ `calledAt/startedAt/completedAt` ครบ (ดึงผลที่บันทึกไว้) | Positive | FR-06 |
| **AC-37** | `collector2` เรียก `GET /api/tickets/:id` ของ `collector1` → 403 `FORBIDDEN_OWNERSHIP` และ Body ไม่มีเลขคิว/ชื่อ/สถานะของตั๋วนั้น | Ownership | FR-06, BR-04, NFR-02 |
| **AC-38** | Box Master ซีรีส์ CRY ดูตั๋ว CRY → 200; Box Master LAB ดูตั๋ว CRY → 403 `FORBIDDEN_SERIES`; `:id` ที่ไม่มี → 404; `:id` ที่ไม่ใช่ UUID → 400 | Role/Boundary | FR-06, BR-04 |
| **AC-39** | หลัง Restart DB container: ตั๋วที่สร้างไว้ทุกสถานะเรียกคืนได้ผ่าน API ข้อมูลตรงเดิม และ join ถัดไปได้เลขต่อจากเดิม | Persistence | NFR-05 |

### 4.10 Software Test Specification (STS) – F-04

| Test ID | AC | Level | Precondition / Input | Action | Expected Result |
| :---: | :---: | :---: | :--- | :--- | :--- |
| **TEST-34** | AC-34 | Integration | CRY WAITING 001, 002 (ผู้ใช้อื่น), `collector1` ถือ 003 | `GET /my-ticket` (collector1); จากนั้นตั้ง 001, 002 เป็น COMPLETED ผ่าน DB fixture, `staff_crybaby` Call Next (ได้ 003) แล้วเรียก `GET /my-ticket` ซ้ำ | `displayNumber=CRY-003`, `waitingAhead=2`; หลังถูก CALLED `status=CALLED`, `waitingAhead=0`, `calledAt` มีค่า |
| **TEST-35** | AC-35 | Integration | (a) `collector4` ไม่มีตั๋ว (b) `collector1` ตั๋ว COMPLETED (c) Token `staff_crybaby` | `GET /my-ticket` | (a),(b) 404 `NO_ACTIVE_TICKET`; (c) 403 `FORBIDDEN_ROLE` |
| **TEST-36** | AC-36 | Integration | ตั๋วของ collector1 ผ่านวงจรจนเป็น COMPLETED | `GET /tickets/:id` ด้วย Token เจ้าของ | 200; `status=COMPLETED`; `calledAt`, `startedAt`, `completedAt` ไม่ว่างและเรียงตามเวลา |
| **TEST-37** | AC-37 | Integration | ตั๋วของ collector1; Token `collector2` | `GET /tickets/{id ของ collector1}` | 403 `FORBIDDEN_OWNERSHIP`; Body ไม่มี `displayNumber`/`status`/ชื่อผู้ใช้ |
| **TEST-38** | AC-38 | Integration | ตั๋ว CRY | `GET /tickets/:id` ด้วย staff_crybaby / staff_labubu / UUID สุ่ม / `abc` | 200 / 403 `FORBIDDEN_SERIES` / 404 / 400 ตามลำดับ |
| **TEST-39** | AC-39 | Infra script (Node) | DB ที่รันใน Docker; สร้างตั๋ว WAITING/CALLED/COMPLETED อย่างละ 1 | `docker compose restart db` รอ healthy → `GET /tickets/:id` ทุกใบ → collector ใหม่ join | ทุกใบคืนข้อมูลเหมือนก่อน Restart; join ใหม่ได้เลขต่อจากเดิม; exit code 0 |

### 4.11 Definition of Done & Evidence – F-04
- [ ] AC-34..39 มี Test ที่รันจริง (TEST-39 รันด้วยสคริปต์จริงกับ Docker volume)
- [ ] หลักฐาน TDD แดง→เขียวสำหรับ AC-37 พร้อม commit ID
- [ ] PR ผ่านการ Review (ตรวจลำดับ 404→403 และไม่รั่วข้อมูลใน Body ของ 403)
- [ ] README ระบุขั้นตอน Persistence check
- [ ] หลักฐาน: ภาพ Demo 1 (ดึงผลที่บันทึก) และ Demo 3 (Ownership 403) + ผลรัน Test

---

## 5. Product Definition of Done (Sprint 1)

1. **พฤติกรรม:** ฟีเจอร์ F-01..F-04 ทำงานจริงผ่าน UI → API → Database ตามสัญญา (ไม่ใช่ Mock/Static)
2. **การทดสอบตามแผน:** รัน Test ทั้งหมดใน STS (TEST-01..TEST-39 รวม TEST-08U, 17U, 28U, 32a/b) บน **commit ของ Release** ด้วยเครื่อง Local (CI บังคับเริ่ม Lab 5) บันทึกคำสั่ง, จำนวน Pass/Fail/Skip, ชื่อไฟล์/Test และ commit ID
3. **Test มีความหมาย:** ไม่มี Test ถูกปิด/ลดความเข้มเพื่อให้ผ่าน; Test ที่ Fail/Skip ต้องเปิดเผยใน Part F
4. **Review & Integration:** ทุก Feature merge เข้า `sprint-1-staging` ผ่าน PR ที่เพื่อนร่วมทีมตรวจ (ผู้เขียนไม่อนุมัติงานตนเอง; ความเห็นระบุสิ่งที่ตรวจเฉพาะเจาะจง) แล้วรัน Integration/System/Acceptance บน staging ก่อน Release PR เข้า `main` และ tag `v0.1.0-sprint1`
5. **Setup & เอกสารเป็นปัจจุบัน:** README ระบุ dependencies, env example, migrate/seed, คำสั่ง build/test/run, ขั้นตอน Persistence และ Demo sequence; เอกสารสเปกสอดคล้องกับโค้ดที่ Release (revision ที่เปลี่ยนมีเหตุผลบันทึก)
6. **Persistence:** ผ่าน TEST-39 (ข้อมูลอยู่หลัง Restart DB)
7. **ไม่มี Secret ใน Git/PDF:** ตรวจ `.env` ไม่ถูก track, ไม่มีรหัสผ่านจริงในเอกสาร
8. **เปิดเผยงานที่ไม่เสร็จ:** รายการที่ยังไม่ทำ/Test ที่ Fail/Skip และ Known Limitations อยู่ใน Part F §9
9. **หลักฐานไม่ใช่คำกล่าวอ้างของ AI:** การเสร็จสิ้นยืนยันด้วย Log/Test จริง ภาพ และ PR/commit เท่านั้น

---

# Part F: Working Sprint 1 Verification & Evidence (20 คะแนน)

> **คำชี้แจง:** ส่วนนี้เป็น **แม่แบบหลักฐาน** ทุกช่อง `[TBD]` ต้องกรอกจากผลจริงของ Release Commit บน `main` เท่านั้น ห้ามใส่ผลสมมติ ห้ามเขียนว่า "ผ่านทั้งหมด" โดยไม่มี Log/จำนวนจริง และห้ามลบ/ปิด Test ที่ล้มเพื่อให้ผลดูสมบูรณ์ ภาพหน้าจอเป็นส่วนเสริม ไม่ใช่หลักฐานหลัก

## 1. การระบุ Release และสรุปการติดตั้ง (Setup Summary)

| รายการ | ค่า |
| :--- | :--- |
| Release Tag / Commit (ใช้ชุดเดียวกันทั้งชุด Demo และ Test) | `v0.1.0-sprint1` / `[TBD – SHA]` |
| วันที่-เวลารันหลักฐาน | `[TBD]` |
| ข้อยกเว้น (ถ้ามี เช่น ภาพบางภาพถ่ายจาก commit อื่น) | `[TBD – ระบุ หรือ "ไม่มี"]` |
| สภาพแวดล้อมที่รัน | `[TBD – OS, Node version, Docker version]` |

**สรุปขั้นตอนติดตั้งและรัน** *(ต้องตรงกับ README ที่ Release จริง – ตรวจซ้ำก่อนส่ง)*

| ขั้นตอน | คำสั่ง / รายละเอียด |
| :--- | :--- |
| 1. Dependencies | Node.js (LTS), npm, Docker Desktop (สำหรับ PostgreSQL), Git |
| 2. ตั้งค่า env | คัดลอก `.env.example` → `.env` แล้วตั้ง `DATABASE_URL`, `DATABASE_URL_TEST`, `JWT_SECRET`, `SEED_COLLECTOR_PASSWORD`, `SEED_STAFF_PASSWORD` (ค่าจริงไม่ commit) |
| 3. เริ่ม DB | `docker compose up -d db` |
| 4. Migrate + Seed | `cd server && npm install && npx prisma migrate deploy && npm run db:seed` |
| 5. รันแอป | `npm run dev` (server), `cd client && npm install && npm run dev` |
| 6. Build | `npm run build` (server และ client) |
| 7. Test (Unit/Integration/Concurrency) | `cd server && npm test` |
| 8. E2E | `npm run test:e2e` (Playwright) |
| 9. Persistence | `node scripts/test-persistence.mjs` |
| 10. Reset Demo | `npm run db:reset-demo` |
| Test accounts | ตาม Part A A-03 (รหัสผ่านส่งทาง Private Course Handoff หรือสร้างจาก Seed local; ไม่อยู่ใน PDF/Git) |

**ลำดับ Demo ที่ทำซ้ำได้:** (1) Login `collector1` → Join CRY → ดู `/my-ticket` (2) Login `staff_crybaby` → Call Next → Verify & Start → Complete (3) ตรวจ `GET /api/tickets/:id` และ SQL (4) ลอง Join ซ้ำ / ซีรีส์ปิด (5) ยิง Staff endpoint ด้วย Collector (6) Logout แล้วใช้ Token เดิม

---

## 2. ภาพสาธิตการทำงานจริง (Program Demonstrations)

> ทุก Demo ต้องติดป้ายตามตาราง และแนบภาพ/Screen dump ที่อ่านชัด พร้อมคำบรรยายใต้ภาพ

### Demo 1 – Normal Domain Journey + Retrieval ของผลที่บันทึก
| หัวข้อ | รายละเอียด |
| :--- | :--- |
| Feature / AC | F-02, F-03, F-04 / AC-10, AC-22, AC-26, AC-27, AC-33, AC-36, AC-39 |
| Role | Collector `collector1`, Box Master `staff_crybaby` |
| Starting conditions | DB หลัง `db:reset-demo`; CRY ไม่มีตั๋ว |
| Steps | Login → Join CRY (ได้ `CRY-001` WAITING) → Staff Call Next (CALLED) → Verify & Start (UNBOXING) → Complete (COMPLETED) → ดึง `GET /api/tickets/:id` และ Query PostgreSQL ดู timestamps |
| Expected result | สถานะผ่านครบลำดับ; DB มีแถวตั๋วพร้อม `handledByStaffId`, `calledAt`, `startedAt`, `completedAt` |
| Actual result | `[TBD]` |
| หลักฐาน | `[TBD – ภาพ UI แต่ละขั้น + ภาพ API response + ภาพ SQL]` |

### Demo 2 – Business-Rule Rejection
| หัวข้อ | รายละเอียด |
| :--- | :--- |
| Feature / AC | F-02 / AC-11, AC-12 (และ AC-16 จากผล Test) |
| Role | Collector `collector2` |
| Starting conditions | `collector2` ถือตั๋ว CRY WAITING แล้ว |
| Steps | Join CRY ซ้ำ / Join LAB / Join SKP (ปิด) |
| Expected result | 409 `DUPLICATE_ACTIVE_QUEUE` (สองครั้งแรก), 409 `SERIES_CLOSED` (สุดท้าย); DB ไม่มีตั๋วใหม่ |
| Actual result | `[TBD]` |
| หลักฐาน | `[TBD – ภาพ UI error + API response + จำนวนแถวใน DB]` |

### Demo 3 – Login/Logout และ Forbidden Role / Ownership
| หัวข้อ | รายละเอียด |
| :--- | :--- |
| Feature / AC | F-01, F-03, F-04 / AC-01, AC-05, AC-14, AC-25, AC-31, AC-37 |
| Role | Collector `collector1`/`collector2`, Box Master `staff_crybaby` |
| Starting conditions | มีตั๋วของ `collector1` ใน DB |
| Steps | (ก) Login `collector1` สำเร็จ (ข) ยิง `POST /api/staff/call-next` ด้วย Token Collector (ค) `collector2` ยิง `GET /api/tickets/{ticket collector1}` (ง) `staff_crybaby` Call Next ซีรีส์ LAB (จ) Logout แล้วใช้ Token เดิมเรียก `GET /api/auth/me` |
| Expected result | (ข) 403 `FORBIDDEN_ROLE` (ค) 403 `FORBIDDEN_OWNERSHIP` ไม่มีข้อมูลตั๋ว (ง) 403 `FORBIDDEN_SERIES` (จ) 401 `UNAUTHENTICATED` |
| Actual result | `[TBD]` |
| หลักฐาน | `[TBD – ภาพ API client/terminal ของแต่ละกรณี + ผล Test ที่เกี่ยวข้อง (ไม่ใช่แค่การซ่อนปุ่มใน UI)]` |

---

## 3. ผลการ Build และ Automated Test

* **คำสั่ง Build:** `[TBD – ตามที่รันจริง]` | **คำสั่ง Test:** `[TBD – ตามที่รันจริง]`
* **Tested Commit:** `[TBD]` (ต้องตรงกับ Release Commit)
* **ผลสรุป:** Passed `[TBD]` / Failed `[TBD]` / Skipped `[TBD]` | Output จริง: `[TBD – แนบ Log ที่อ่านได้]`

### ตารางผล AC → Test (เฉพาะ Automated; Manual Check แยกด้านล่าง)

| AC | Planned TEST | Level | Actual test file / name | Result | Commit |
| :---: | :---: | :---: | :--- | :---: | :---: |
| AC-01 | TEST-01 | Integration | `tests/api/auth.test.ts` / `[TBD]` | `[TBD]` | `[TBD]` |
| AC-02 | TEST-02 | Integration | `tests/api/auth.test.ts` / `[TBD]` | `[TBD]` | `[TBD]` |
| AC-03 | TEST-03 | Integration | `tests/api/auth.test.ts` / `[TBD]` | `[TBD]` | `[TBD]` |
| AC-04 | TEST-04 | Integration | `tests/security/unauthenticated.test.ts` / `[TBD]` | `[TBD]` | `[TBD]` |
| AC-05 | TEST-05 | Integration | `tests/api/auth.test.ts` / `[TBD]` | `[TBD]` | `[TBD]` |
| AC-06 | TEST-06 | Integration | `tests/api/auth.test.ts` / `[TBD]` | `[TBD]` | `[TBD]` |
| AC-07 | TEST-07 | Integration (DB) | `tests/security/password-hash.test.ts` / `[TBD]` | `[TBD]` | `[TBD]` |
| AC-08 | TEST-08U | Unit | `tests/unit/role-guard.test.ts` / `[TBD]` | `[TBD]` | `[TBD]` |
| AC-09 | TEST-09 | Integration | `tests/api/series.test.ts` / `[TBD]` | `[TBD]` | `[TBD]` |
| AC-10 | TEST-10 | Integration | `tests/api/join.test.ts` / `[TBD]` | `[TBD]` | `[TBD]` |
| AC-11 | TEST-11 | Integration | `tests/api/join.test.ts` / `[TBD]` | `[TBD]` | `[TBD]` |
| AC-12 | TEST-12 | Integration | `tests/api/join.test.ts` / `[TBD]` | `[TBD]` | `[TBD]` |
| AC-13 | TEST-13 | Integration | `tests/api/join.test.ts` / `[TBD]` | `[TBD]` | `[TBD]` |
| AC-14 | TEST-14 | Integration | `tests/api/join.test.ts` / `[TBD]` | `[TBD]` | `[TBD]` |
| AC-15 | TEST-15 | Concurrency | `tests/concurrency/numbering.test.ts` / `[TBD]` | `[TBD]` | `[TBD]` |
| AC-16 | TEST-16 | Concurrency | `tests/concurrency/duplicate.test.ts` / `[TBD]` | `[TBD]` | `[TBD]` |
| AC-17 | TEST-17U, TEST-17 | Unit + Integration | `tests/unit/queue-date.test.ts`, `tests/api/queue-reset.test.ts` / `[TBD]` | `[TBD]` | `[TBD]` |
| AC-18 | TEST-18 | Integration | `tests/api/join.test.ts` / `[TBD]` | `[TBD]` | `[TBD]` |
| AC-19 | TEST-19 | E2E | `e2e/join-queue.spec.ts` / `[TBD]` | `[TBD]` | `[TBD]` |
| AC-20 | TEST-20 | E2E | `e2e/responsive.spec.ts` / `[TBD]` | `[TBD]` | `[TBD]` |
| AC-21 | TEST-21 | Integration | `tests/api/staff-list.test.ts` / `[TBD]` | `[TBD]` | `[TBD]` |
| AC-22 | TEST-22 | Integration | `tests/api/staff-call.test.ts` / `[TBD]` | `[TBD]` | `[TBD]` |
| AC-23 | TEST-23 | Integration | `tests/api/staff-call.test.ts` / `[TBD]` | `[TBD]` | `[TBD]` |
| AC-24 | TEST-24 | Integration | `tests/api/staff-call.test.ts` / `[TBD]` | `[TBD]` | `[TBD]` |
| AC-25 | TEST-25 | Integration | `tests/api/unauthorized-queue.test.ts` / `[TBD]` | `[TBD]` | `[TBD]` |
| AC-26 | TEST-26 | Integration | `tests/api/staff-transition.test.ts` / `[TBD]` | `[TBD]` | `[TBD]` |
| AC-27 | TEST-27 | Integration | `tests/api/staff-transition.test.ts` / `[TBD]` | `[TBD]` | `[TBD]` |
| AC-28 | TEST-28, TEST-28U | Integration + Unit | `tests/api/state-transition.test.ts`, `tests/unit/state-machine.test.ts` / `[TBD]` | `[TBD]` | `[TBD]` |
| AC-29 | TEST-29 | Integration | `tests/api/unauthorized-queue.test.ts` / `[TBD]` | `[TBD]` | `[TBD]` |
| AC-30 | TEST-30 | Integration | `tests/api/not-handler.test.ts` / `[TBD]` | `[TBD]` | `[TBD]` |
| AC-31 | TEST-31 | Integration | `tests/api/permissions.test.ts` / `[TBD]` | `[TBD]` | `[TBD]` |
| AC-32 | TEST-32a, TEST-32b | Concurrency | `tests/concurrency/call-next.test.ts` / `[TBD]` | `[TBD]` | `[TBD]` |
| AC-33 | TEST-33 | E2E | `e2e/full-journey.spec.ts` / `[TBD]` | `[TBD]` | `[TBD]` |
| AC-34 | TEST-34 | Integration | `tests/api/my-ticket.test.ts` / `[TBD]` | `[TBD]` | `[TBD]` |
| AC-35 | TEST-35 | Integration | `tests/api/my-ticket.test.ts` / `[TBD]` | `[TBD]` | `[TBD]` |
| AC-36 | TEST-36 | Integration | `tests/api/ticket-detail.test.ts` / `[TBD]` | `[TBD]` | `[TBD]` |
| AC-37 | TEST-37 | Integration | `tests/api/ticket-security.test.ts` / `[TBD]` | `[TBD]` | `[TBD]` |
| AC-38 | TEST-38 | Integration | `tests/api/ticket-security.test.ts` / `[TBD]` | `[TBD]` | `[TBD]` |
| AC-39 | TEST-39 | Infra script | `scripts/test-persistence.mjs` / `[TBD]` | `[TBD]` | `[TBD]` |

**Manual checks (เสริม ไม่ใช้แทน Automated):** `[TBD – เช่น ตรวจ UI ด้วยตา, บันทึกผล]` | **Test ที่ Fail / Skip:** `[TBD – ระบุชื่อและเหตุผล หรือ "ไม่มี"]`

---

## 4. ตัวอย่างโค้ดทดสอบจริง (Actual Test Excerpts)

### Excerpt 1 – Domain Rule: ห้ามตั๋ว Active ซ้อน (AC-16 / TEST-16)
* ไฟล์: `tests/concurrency/duplicate.test.ts` | Commit: `[TBD]`
* `[TBD – แปะส่วน setup และ assertion จริงที่เกี่ยวข้อง ไม่ใช่ทั้งไฟล์]`
* ผลรันของ Test นี้: `[TBD]`

### Excerpt 2 – Role/Ownership: พนักงานซีรีส์เดียวกันที่ไม่ใช่ผู้ Call (AC-30 / TEST-30) หรือ Ownership (AC-37)
* ไฟล์: `tests/api/not-handler.test.ts` (หรือ `ticket-security.test.ts`) | Commit: `[TBD]`
* `[TBD – แปะส่วน setup และ assertion จริง]`
* ผลรันของ Test นี้: `[TBD]`

---

## 5. หลักฐาน TDD (Red → Green)

| Test / AC | Commit ที่ Test ล้ม (แดง) – วันที่ | Log ที่แสดงความล้มเหลวตามที่คาด | Commit ที่ทำให้ผ่าน (เขียว) – วันที่ | Log ผ่าน |
| :--- | :--- | :--- | :--- | :--- |
| TEST-16 / AC-16 | `[TBD]` | `[TBD]` | `[TBD]` | `[TBD]` |
| TEST-25 หรือ TEST-30 / AC-25, AC-30 | `[TBD]` | `[TBD]` | `[TBD]` | `[TBD]` |
| TEST-37 / AC-37 | `[TBD]` | `[TBD]` | `[TBD]` | `[TBD]` |

---

## 6. Git Workflow, History และสถานะ Board

### 6.1 ลำดับประวัติ (แสดงว่า Contract/Test design มาก่อนโค้ด) – ต้องเติมจาก `git log` จริง

| ลำดับ | เหตุการณ์ | Commit ID | วันที่-เวลา | ผู้ทำ |
| :---: | :--- | :---: | :---: | :---: |
| 1 | Contract + STS ของ F-01..F-04 (เอกสารเท่านั้น – Issue I-00) | `[TBD]` | `[TBD]` | `[TBD]` |
| 2 | Test (แดง) ของ F-01 | `[TBD]` | `[TBD]` | `[TBD]` |
| 3 | Implement F-01 (เขียว) | `[TBD]` | `[TBD]` | `[TBD]` |
| 4 | Test (แดง) ของ F-02 / F-03 / F-04 | `[TBD]` | `[TBD]` | `[TBD]` |
| 5 | Implement F-02 / F-03 / F-04 | `[TBD]` | `[TBD]` | `[TBD]` |
| 6 | แก้ไข Contract ระหว่างทาง (ถ้ามี พร้อมเหตุผล) | `[TBD]` | `[TBD]` | `[TBD]` |
| 7 | Release PR `sprint-1-staging` → `main` และ tag | `[TBD]` | `[TBD]` | `[TBD]` |

### 6.2 Issue / PR ที่คัดมา 2 รายการ

| Issue | Feature / Contract / AC | Branch (จาก `sprint-1-staging`) | Author | Reviewer | ความเห็น Review ที่เฉพาะเจาะจง | PR → staging | เข้า `main` ผ่าน |
| :---: | :--- | :--- | :---: | :---: | :--- | :---: | :---: |
| `[TBD #]` | `[TBD เช่น F-02 / AC-10..18]` | `[TBD]` | `[TBD]` | `[TBD]` | `[TBD – สิ่งที่ตรวจ/คำถาม/ข้อค้นพบ/เหตุผลที่อนุมัติ]` | `[TBD #, merged วันที่]` | `[TBD Release PR #]` |
| `[TBD #]` | `[TBD เช่น F-03 / AC-21..33]` | `[TBD]` | `[TBD]` | `[TBD]` | `[TBD]` | `[TBD]` | `[TBD]` |

### 6.3 Board และ Release
* **สถานะ Board สุดท้าย:** `[TBD – ภาพ GitHub Project board แสดงสถานะแต่ละ Issue I-00..I-08]`
* **Release PR (staging → main):** `[TBD #]` Reviewer `[TBD]` | **Tag/Commit:** `[TBD]` | ผล Integration/System test ก่อน Release: `[TBD]`
* **ภาพ GitHub/History ที่อ่านชัด:** `[TBD]`

---

## 7. ตารางการมีส่วนร่วมของสมาชิก (Contribution Table)

> **เขียนจากประวัติ Issue/PR/commit จริงหลังทำงานเสร็จ ไม่เขียนล่วงหน้า** ทั้งสองคนต้องมีส่วนร่วมทุกกิจกรรม ไม่แบ่งบทบาทถาวร (เช่น คนหนึ่งเขียนสเปก อีกคนเขียนโค้ด) งานแบบ Pair ให้ระบุทั้งสองคนใน Issue/PR

| กิจกรรม | นายธีรวัฒญ์ รุ่งสว่าง (รหัส: `67070507206`) | นายอภิวัชร์ ปัณฐธนาพัฒน์ (รหัส: `67070507209`) | หลักฐาน (Issue/PR/commit) |
| :--- | :--- | :--- | :--- |
| Requirements & Design (Part A–D) | `[TBD]` | `[TBD]` | `[TBD]` |
| Feature contracts & STS (Part E) | `[TBD]` | `[TBD]` | `[TBD]` |
| เขียน Test (TDD) | `[TBD]` | `[TBD]` | `[TBD]` |
| Implementation | `[TBD]` | `[TBD]` | `[TBD]` |
| กำกับ/ตรวจ output ของ AI Agent | `[TBD]` | `[TBD]` | `[TBD]` |
| Code Review (ใครรีวิว PR ไหน) | `[TBD]` | `[TBD]` | `[TBD]` |
| Integration, Release, หลักฐาน | `[TBD]` | `[TBD]` | `[TBD]` |

---

## 8. การประกาศการใช้ AI (AI-Use Declaration)

`[TBD – ระบุเครื่องมือและงานที่ AI ช่วยจริงเมื่อโปรเจกต์เสร็จ เช่น ร่างเอกสารสเปก, ช่วยทบทวนความสอดคล้อง ID, ช่วยร่างโค้ด/Test (ถ้ามี)]` นักศึกษาทั้งสองคนต้องตรวจ output ทั้งหมด เข้าใจ และอธิบายได้ ไม่ต้องแนบ Transcript เต็ม

---

## 9. ข้อจำกัดที่ทราบและงานที่ยังไม่เสร็จ (Known Limitations & Incomplete Work)

1. **ไม่มี Cancel/No-Show ใน Sprint 1** (FR-11, FR-12 – Sprint 2): ถ้าลูกค้าถูก CALLED แล้วไม่มา พนักงานจะติด `STAFF_BUSY` ต้องใช้ `npm run db:reset-demo` เป็นทางแก้ชั่วคราว (ไม่ใช่ฟีเจอร์) มีผลต่อ UAT Lab 6 – บรรเทาด้วย Seed Collector 6 บัญชี (D-09)
2. นับถอยหลัง 120 วินาทีบนหน้าลูกค้าเป็นการแสดงผลเท่านั้น ไม่มีผลต่อสถานะ (Server-enforced ใน Sprint 2)
3. ใช้ Short Polling 3 วินาที ไม่มี Realtime push
4. Login Rate Limit ยังไม่มี (NFR-07 – Sprint 3) ความเสี่ยง Brute force ถูกยอมรับสำหรับ Sprint 1
5. ซีรีส์เปลี่ยนผ่าน Seed เท่านั้น (เปิด–ปิดผ่านระบบเป็น F-09 Sprint 3); ตั๋วค้างข้ามวันยังไม่ถูกจัดการ (G-07)
6. Token เก็บใน `localStorage` (ความเสี่ยง XSS ที่ยอมรับ) และ Logout ทำให้ทุกอุปกรณ์ของผู้ใช้ออกจากระบบ (D-11)
7. Docker เต็มรูปแบบ, CI/CD, GCP Deployment อยู่ใน Lab 5 (ไม่อยู่ใน Deliverable 1)
8. **Test ที่ Fail/Skip และงานที่ไม่เสร็จจริง ณ Release:** `[TBD – กรอกจากผลจริง หรือเขียนว่า "ไม่มี"]`

---

# 🚀 ภาคผนวก: Issue Roadmap (I-00 ถึง I-08)

> แผนงานแบบ Issue-driven บน GitHub Project Board ทุก Issue ต้องลิงก์ Feature/Contract/AC, Branch จาก `sprint-1-staging`, และ PR ที่เพื่อนร่วมทีมรีวิว (ผู้เขียนไม่อนุมัติงานตนเอง; ระบุ Pair ใน Issue/PR)

| Issue | หัวข้อ | Feature / AC | งานหลัก |
| :---: | :--- | :--- | :--- |
| **I-00** | Contract Baseline (เอกสารเท่านั้น) | Part A–E | Review เอกสารนี้ร่วมกัน, กรอกชื่อ/รหัส/Repo URL, Commit ลง `sprint-1-staging` **ก่อนมีโค้ด** (บันทึก commit ID ใน Part E §0 และ Part F §6) |
| **I-01** | Scaffold, DB, Seed, Infra | – (รากฐาน F-01..F-04) | Express+TS, ESLint/Prettier, Prisma + `docker-compose.yml` (DB), Migration `0001` + `0002` (2 Partial Index), Seed 9 users/3 series/3 assignments (รหัสจาก env), `getQueueDate`, `db:reset-demo`, README, Test harness + fake clock |
| **I-02** | F-01 Auth & Role | AC-01..08 | TDD: เขียน Test แดงก่อน → Login/Logout/Me, Auth+Role middleware, Bcrypt check |
| **I-03** | F-02 Join & Concurrency | AC-09..18 | TDD: Test แดง → `GET /series`, `POST /join` (Raw SQL counter, P2002 by constraint), Concurrency 50/10, clock test |
| **I-04** | F-04 Ticket & Ownership | AC-34..38 | TDD: `my-ticket`, `tickets/:id`, ตรวจ 404→403, ไม่รั่วข้อมูล |
| **I-05** | F-03 List & Call Next | AC-21..25, 31, 32 | TDD: `GET /staff/tickets`, `call-next` (SKIP LOCKED, STAFF_BUSY, FORBIDDEN_SERIES), Concurrency |
| **I-06** | F-03 Start/Complete/State | AC-26..30 | TDD: `start-unboxing`, `complete`, State guard (Unit), FORBIDDEN_SERIES / NOT_HANDLER |
| **I-07** | Web UI | AC-19, 20, 33 (ส่วน UI) | Next.js: `/login`, `/series`, `/my-ticket` (Polling), `/staff/counter`, สถานะ Loading/Empty/Error, 375px |
| **I-08** | E2E, Persistence, Release | AC-19, 20, 33, 39 | Playwright, `test-persistence.mjs`, รัน Full Suite บน staging, Release PR → `main`, tag `v0.1.0-sprint1`, เก็บหลักฐานกรอก Part F, สร้าง PDF เดียว (สารบัญ+เลขหน้า) |
