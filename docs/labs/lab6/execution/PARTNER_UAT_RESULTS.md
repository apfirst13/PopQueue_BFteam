# Part B — Partner UAT Execution Results

> **UAT Team:** BFteam (`@Theerawat82`, `@apfirst13`)  
> **Partner Product:** CrustCraft Artisan Bakery Pre-Order & Fulfillment System (Theme 4)  
> **Partner Repo:** `https://github.com/meebotsompurin-stack/crustcraft-bakery-order`  
> **Assessed Release:** Release B (Header: `"CrustCraft Bakery (Release B)"`)  
> **Tested Commit SHA:** `13932e96a1491ded7b7c1e4bfa03701b50b1e917`  
> **Cloud Run Revision:** `crustcraft-00005-lzs` (`asia-southeast1`)  
> **Live URL:** `https://crustcraft-530290697744.asia-southeast1.run.app` (`https://crustcraft-d7wyiqxska-as.a.run.app`)  
> **Partner Handoff Document:** `D:\University\Y3\sem1\cpe334 se\group_project\lab6\crustcraft_sprint_1_uat_handoff_test_cases.md`  
> **Test Date:** 20 พฤศจิกายน 2026

> [!IMPORTANT]
> **⚠️ ข้อมูลบัญชีทดสอบที่ได้รับมอบหมาย (Safe Synthetic Accounts):**  
> • `Account-OP`: `admin@crustcraft.com` (Role: `OPERATOR`) — ตรวจสอบคิวร้านและรับออเดอร์  
> • `Account-C1`: `uat.customer1@test.com` (Role: `CUSTOMER`) — สั่งพรีออเดอร์และทดสอบขอบเขต  
> • `Account-C2`: `uat.customer2@test.com` (Role: `CUSTOMER`) — ทดสอบการกักกันข้อมูลข้ามลูกค้า  
> *(รหัสผ่านได้รับมอบหมายผ่านช่องทางส่วนตัวอย่างปลอดภัย และยืนยันผลการ Login ผ่าน Probe แล้ว 100%)*

---

## Handoff Audit Checklist (ก่อนเริ่ม Execute)

| รายการ | ผล | หมายเหตุ |
| :--- | :---: | :--- |
| มี ≥4 หมวด UAT Cases | ☑ PASS | ครอบคลุม 4 หมวด: Normal Journey, Business Rules & Limits, Forbidden Role/Ownership, State & Persistence |
| Expected Result ชัดเจนทุก step | ☑ PASS | ระบุ HTTP Status, ยอดเงินเป้าหมาย ฿390.00, ชื่อสถานะ, และจำนวนสต็อกครบทุกขั้นตอน |
| Account / Setup instructions ครบ | ☑ PASS | ระบุ 3 บัญชีแยกบทบาท (Account-OP, Account-C1, Account-C2) พร้อมคู่มือและลำดับการรัน |
| Live URL / deployed version ระบุชัด | ☑ PASS | ระบุ Release B, Commit SHA `13932e9`, Revision `crustcraft-00005-lzs`, Cloud Run URL ครบถ้วน |
| **ผ่าน Audit → เริ่ม Execute ได้** | **☑ APPROVED** | **ผ่านเกณฑ์ทั้งหมด อนุมัติเริ่มดำเนินการทดสอบจริง** |

---

## UAT Execution Results

> **Evidence Naming:** ใช้ `b-ev-XX.png` (XX = running number, e.g. `b-ev-01.png` ถึง `b-ev-05.png`)  
> **ห้ามก็อป Expected Result มาใส่ Actual** — บันทึกผลจากการสังเกตหน้าจอจริงและการตอบสนองของเซิร์ฟเวอร์เท่านั้น

| Case ID | Tester | Date & Time (UTC+7) | Tested SHA / Revision | Actual Inputs / IDs Used | Observed Actual Result | Status | Evidence ID |
| :--- | :--- | :--- | :--- | :--- | :--- | :---: | :---: |
| `UAT-CC-01` | `@apfirst13` | `2026-11-20 15:31` | `crustcraft-00005-lzs`<br>(`13932e9`) | Account: `uat.customer1@test.com`<br>Items: 2 Croissant (`฿85.00`×2) + 1 Sourdough (`฿220.00`×1)<br>Note: `UAT-CC01-20261119-Pickup-1400`<br>Order ID: `cmwoq07gq0002dhwhktphpm53` | Login สำเร็จ Redirect ไป `/catalog` Header แสดง Release B; สั่งซื้อสำเร็จ Redirect ไป `/orders/cmwoq07gq0002dhwhktphpm53`; สถานะแสดง `Pending Acceptance / รอยืนยัน`; ยอดรวมคำนวณถูกต้องที่ `฿390.00`; กลับไปดูหน้า `/catalog` สต็อก Croissant ลดเหลือ 48 และ Sourdough ลดเหลือ 19 ชิ้นตรงตามจริง | `PASS` | `b-ev-01.png`<br>`b-ev-01-stock.png` |
| `UAT-CC-02` | `@apfirst13` | `2026-11-20 15:46` | `crustcraft-00005-lzs`<br>(`13932e9`) | 1. Duplicate email: `uat.customer1@test.com`<br>2. Empty items array / 0 quantity<br>3. 505-char pickupNote with 1 Cinnamon Brioche Roll | 1. สมัครซ้ำถูกบล็อกแสดงแบนเนอร์สีแดง `Email already in use` (409 Conflict) อยู่หน้า `/register` เดิม<br>2. ออเดอร์ว่างเปล่า (0 ชิ้น) ปุ่ม `Confirm Pre-Order` ถูก Disable เป็นสีเทากดไม่ได้<br>3. ใส่ pickupNote 505 ตัวอักษร ระบบแสดงแบนเนอร์ `Pickup note cannot exceed 500 characters.` (400 Bad Request) ไม่สร้างออเดอร์ขยะ และสต็อก Cinnamon Brioche Roll คงเดิมที่ 80 ชิ้น | `PASS` | `b-ev-02.png`<br>`b-ev-02-dup.png`<br>`b-ev-02-empty.png` |
| `UAT-CC-03` | `@apfirst13` | `2026-11-20 15:49` | `crustcraft-00005-lzs`<br>(`13932e9`) | Account: `uat.customer1@test.com`<br>Target URL: `/operator/orders` | ขณะล็อกอินเป็น Customer 1 พิมพ์ URL ตรงเข้า `/operator/orders` ใน Address Bar; ถูก `ProtectedRoute` ดักสิทธิ์บล็อกทันทีและ Redirect กลับมาหน้า `/catalog`; ไม่แสดงคิวออเดอร์ของร้าน และ API ส่ง 403 Forbidden ไม่เปิดเผยข้อมูลคำสั่งซื้อ | `PASS` | `b-ev-03.png` |
| `UAT-CC-04` | `@apfirst13` | `2026-11-20 15:52` | `crustcraft-00005-lzs`<br>(`13932e9`) | Account: `uat.customer2@test.com`<br>URL: `/orders/cmwoq07gq0002dhwhktphpm53` | 1. หน้า `/orders` ของ Customer 2 ว่างเปล่า ไม่ปรากฏออเดอร์ของ Customer 1<br>2. เมื่อพิมพ์ URL ตรงเข้าไปที่ `/orders/cmwoq07gq0002dhwhktphpm53` ระบบแสดงแบนเนอร์สีแดง `You do not have permission to access this order.` มีปุ่ม `Back to Orders`; Console แสดง API 403 (Forbidden); ไม่เปิดเผยข้อมูลรายการ ยอดเงิน หรือชื่อผู้สั่งซื้อ | `PASS` | `b-ev-04.png`<br>`b-ev-04-list.png` |
| `UAT-CC-05` | `@apfirst13` & `@Theerawat82` | `2026-11-20 15:55` | `crustcraft-00005-lzs`<br>(`13932e9`) | Account: `admin@crustcraft.com`<br>Target Order: `#cmwoq07gq0002dhwhktphpm53` | ล็อกอินเป็น Operator เข้าหน้า `/operator/orders`; ออเดอร์ `#cmwoq07gq0002dhwhktphpm53` ขึ้นแสดงในคิวสถานะ `PENDING`; เมื่อกดปุ่ม `Accept Order` สถานะของแถวเปลี่ยนเป็น `ACCEPTED` ทันทีและปุ่มเปลี่ยนเป็น `Accepted ✓` (ปิดการกดซ้ำ); หลังกด Refresh ข้อมูลยังคงสถานะ `ACCEPTED` ใน Cloud SQL และฝั่ง Customer 1 ตรวจสอบ API พบสถานะเปลี่ยนเป็น `ACCEPTED` สมบูรณ์ | `PASS` | `b-ev-05.png`<br>`b-ev-05-before.png` |

---

## Notes / BLOCKED Issues

* ไม่พบปัญหาที่เป็นตัวขวางกั้นการทดสอบ (Zero BLOCKED Issues)
* ระบบของ CrustCraft ผ่านเกณฑ์การยอมรับการทดสอบ (Acceptance Criteria) ของ Sprint 1 ครบถ้วนทั้ง 5 เคส
* ข้อสังเกตเพิ่มเติม: ลูกค้ายังไม่สามารถกดยกเลิกออเดอร์ได้ ซึ่งตรงตามข้อกำหนดที่ระบุว่าระบบยกเลิกคำสั่งซื้อ (`F-06`) จะส่งมอบใน Sprint 2 (Not a Defect / Out of Scope)
