# Software Requirements Specification (SRS)

CPE 334 Group Project | Theme 9: Queue and Service Management | Version 0.1 (draft) | 2026-11-01

## 1. Context
ระบบคิวออนไลน์ของสำนักงานทดสอบและออกใบขับขี่ (ข้อมูลสังเคราะห์ทั้งหมด) มีบริการ เช่น สอบข้อเขียน,
สอบขับรถ, ต่ออายุใบขับขี่ แต่ละบริการมีคิวของตัวเอง ลูกค้ารับตั๋วคิวออนไลน์ในวันที่ใช้บริการ
operator เรียกตามลำดับ และลูกค้าต้องยืนยันตัวเมื่อถูกเรียก มิฉะนั้นถูกตัดสิทธิ์ (no-show)

## 2. Actors
| Actor | หน้าที่ | Sprint |
|---|---|---|
| Customer | รับตั๋ว, ดูคิวของตน, ยืนยันเมื่อถูกเรียก, ยกเลิก | 1 |
| Operator | เรียกคิว, เริ่มและจบบริการ ในคิวที่ได้รับมอบหมาย | 1 |
| Public viewer | ดูหน้าจอสถานะคิว (ไม่ต้อง login) | 2 |
| Admin | จัดการบริการ/คิว | 3 (ถ้ามีเวลา) |

## 3. Scope and exclusions
**ไม่ทำ (out of scope):** การจองนัดล่วงหน้า (Theme 9 ระบุว่านอกขอบเขตหลัก), การแจ้งเตือนภายนอก
(SMS/อีเมลจริง), การชำระเงิน, ลูกค้า walk-in ที่ไม่มีบัญชี, สมัครสมาชิกเอง, กู้รหัสผ่าน, หลายสาขา

## 4. Functional Requirements
| ID | Requirement | Sprint |
|---|---|---|
| FR-01 | ผู้ใช้ login ด้วย username/password | 1 |
| FR-02 | ผู้ใช้ logout และ session ถูกเพิกถอน | 1 |
| FR-03 | ผู้ใช้ดูตัวตนและ role ปัจจุบันของตน | 1 |
| FR-04 | Customer ดูรายการคิวที่เปิดอยู่ | 1 |
| FR-05 | Customer รับตั๋วเข้าคิว ได้เลขคิว | 1 |
| FR-06 | Customer ดูรายละเอียด entry ของตน (เลข, สถานะ, จำนวนที่รอก่อนหน้า) | 1 |
| FR-07 | Operator ดูรายการ entry ของคิวที่ได้รับมอบหมาย | 1 |
| FR-08 | Operator เรียกคิวถัดไป (FIFO) | 1 |
| FR-09 | Operator เริ่มให้บริการ entry ที่ถูกเรียก | 1 |
| FR-10 | Operator จบบริการ | 1 |
| FR-11 | Customer ยกเลิก entry ที่ยัง WAITING | 2 |
| FR-12 | Customer ยืนยันตัวเมื่อถูกเรียกภายในเวลาที่กำหนด | 2 |
| FR-13 | ระบบเปลี่ยน entry ที่ไม่ยืนยันภายในเวลาเป็น NO_SHOW | 2 |
| FR-14 | หน้าจอสาธารณะแสดงเลขที่กำลังเรียกและจำนวนที่รอ | 2 |
| FR-15 | หลายคิว/เคาน์เตอร์ และการมอบหมาย operator | 2 |
| FR-16 | Admin จัดการบริการ/คิว | 3 |
| FR-17 | สรุปบริการ (จำนวน, เวลารอเฉลี่ย, อัตรา no-show) | 3 |

## 5. Business Rules
| ID | Rule | Sprint |
|---|---|---|
| BR-01 | Customer มี active entry ได้ 1 รายการต่อคิว (active = WAITING, CALLED, CONFIRMED, SERVING) | 1 |
| BR-02 | เลขคิวไม่ซ้ำภายในคิวเดียวกันวันเดียวกัน เรียงต่อเนื่องเริ่มที่ 1 รีเซ็ตรายวัน แม้มีคำขอพร้อมกัน | 1 |
| BR-03 | Call next เลือก WAITING ที่เลขน้อยสุดของคิวนั้น (FIFO) | 1 |
| BR-04 | สถานะเปลี่ยนได้ตามลำดับที่กำหนดเท่านั้น (ดู state machine) | 1 |
| BR-05 | Operator ดำเนินการได้เฉพาะคิวที่ได้รับมอบหมาย | 1 |
| BR-06 | Customer เห็นรายละเอียด entry ของตนเท่านั้น | 1 |
| BR-07 | รับตั๋วได้เฉพาะคิวที่เปิดอยู่ | 1 |
| BR-08 | Operator ถือ entry สถานะ CALLED/CONFIRMED/SERVING ได้ไม่เกิน 1 รายการพร้อมกัน | 1 |
| BR-09 | เวลา/deadline ทุกอย่างตัดสินด้วยเวลาของเซิร์ฟเวอร์ | 1 |
| BR-10 | หลังถูกเรียก Customer มี 5 นาที (ค่า config) เพื่อยืนยัน; ยืนยันได้โดยเจ้าของเท่านั้นและก่อน deadline | 2 |
| BR-11 | entry ที่เลย deadline โดยไม่ยืนยันเป็น NO_SHOW ไม่นับเป็น active และลูกค้ารับตั๋วใหม่ได้ | 2 |
| BR-12 | Start ได้เฉพาะ entry ที่ CONFIRMED (เปลี่ยนจาก CALLED ของ Sprint 1) | 2 |
| BR-13 | ยกเลิกได้เฉพาะเจ้าของและเฉพาะสถานะ WAITING | 2 |
| BR-14 | หน้าจอสาธารณะไม่แสดงข้อมูลส่วนบุคคล | 2 |

### State machine
- **Sprint 1:** `WAITING -> CALLED -> SERVING -> COMPLETED`
- **Sprint 2 เพิ่ม:** `CALLED -> CONFIRMED -> SERVING`, `CALLED -> NO_SHOW`, `WAITING -> CANCELLED`

## 6. Non-Functional Requirements (measurable)
| ID | Target | Verification | Sprint |
|---|---|---|---|
| NFR-01 | คำขอไม่ login ไปยัง endpoint ที่ป้องกัน -> 401 และไม่มีข้อมูลส่วนตัว | API test | 1 |
| NFR-02 | รหัสผ่านไม่ถูกเก็บเป็น plaintext | test อ่านค่าใน DB | 1 |
| NFR-03 | 20 คำขอรับตั๋วพร้อมกันในคิวเดียว -> ได้เลข 20 ตัวไม่ซ้ำ | integration test | 1 |
| NFR-04 | 10 คำขอพร้อมกันจากลูกค้าคนเดียว -> active entry เพียง 1 | integration test | 1 |
| NFR-05 | error response ไม่เปิดเผย stack trace | API test | 1 |
| NFR-06 | ข้อมูลยังอยู่หลังรีสตาร์ท server | ขั้นตอนทดสอบ + test | 1 |
| NFR-07 | clone ใหม่แล้วรันได้ด้วยคำสั่งที่ README ระบุ | ลองบนเครื่องสะอาด | 1 |
| NFR-08 | operator 2 คนเรียกพร้อมกัน ไม่มี entry ถูกเรียกซ้ำ | integration test | 2 |
| NFR-09 | การตัดสิน deadline ถูกต้องที่ขอบ (4:59 ผ่าน, 5:01 ไม่ผ่าน) | unit test ด้วยนาฬิกาจำลอง | 2 |
| NFR-10 | (ตัวเลือก) p95 < 500 ms ที่ 20 ผู้ใช้พร้อมกัน | สคริปต์วัด | 3 |

หมายเหตุ: เก็บ NFR-10 ไว้เฉพาะเมื่อวัดได้จริง มิฉะนั้นตัดออกและบันทึกเป็นการเปลี่ยนแปลง

## 7. Assumptions
- ใช้ข้อมูลสังเคราะห์ และ seed account เท่านั้น
- มี 1 สำนักงาน, 1 วันทำการต่อ "queue_date", เวลาอ้างอิงเป็นของเซิร์ฟเวอร์

## 8. Decision log
| ID | Topic | Decision |
|---|---|---|
| D-01 | บริบท | สำนักงานทดสอบใบขับขี่ เป็นคิวเสมือนวันเดียวกัน ไม่ใช่การจองนัด (spec: advance booking นอกขอบเขต) |
| D-02 | กฎยืนยัน | แบบ A: ยืนยันเมื่อถูกเรียก |
| D-03 | แบบ B (ยืนยันหลังรับตั๋ว) | พิจารณาแล้ว เลื่อนเป็นตัวเลือก Sprint 3 |
| D-04 | เลขคิว | รีเซ็ตรายวัน เริ่มที่ 1 รูปแบบ prefix + 3 หลัก |
| D-05 | no-show แล้วรับตั๋วใหม่ | ได้ |
| D-06 | Sprint 1 ไม่มี CONFIRMED ใน flow | ออกแบบ schema ให้เพิ่มได้ ถือเป็นการเปลี่ยนแปลงที่อนุมัติเมื่อถึง Sprint 2 (BR-12) |
| D-07 | BR-08 และ BR-12 | เป็นกฎที่ทีมตั้งขึ้นเอง (ไม่ได้มาจาก spec โดยตรง) |

## 9. Open questions
| ID | Question | Status |
|---|---|---|
| Q-01 | ถาม TA: บริบทคิวเสมือนที่มีการยืนยันอยู่ใน Theme 9 ใช่ไหม | รอ Workshop 3 พ.ย. |
| Q-02 | ถาม TA: Sprint 1 ต้องมีหน้าจอสาธารณะหรือไม่ (spec ใช้คำว่า "may") | รอ Workshop 3 พ.ย. |

## 10. Source-compliance check (Group spec section 6.9, Sprint 1 example)
| Spec requirement | Covered by |
|---|---|
| Seed a service queue | F-01, seed data |
| Customer logs in, joins, sees number/status | FR-05, FR-06 |
| Operator calls next and completes service | FR-08 to FR-10 |
| Unique numbers generated safely | BR-02, NFR-03 |
| Prevent duplicate active entries | BR-01, NFR-04 |
| Reject out-of-order/invalid transitions | BR-04 |
| Customers access their own detailed entry | BR-06 |
| Operators act only on authorized queues | BR-05 |
| Tests: customer calls/completes; operator unauthorized queue | F-03 contract (AC/STS) |
