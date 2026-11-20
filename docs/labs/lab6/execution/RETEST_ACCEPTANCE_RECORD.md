# Part D — Retest & Bidirectional Acceptance Record

---

## D-1: Partner UAT Team's Decision on PopQueue (Incoming)

> **UAT Team testing PopQueue:** `guluJa` (`@guluJa`) + `PhraewaS` (`@PhraewaS`)
> **Tested Product:** PopQueue v0.2.0-lab5 (`bf52c9b`) — `https://popqueue-5now4hkvsa-as.a.run.app`

### Retest Log (กรอกหลัง BFteam แก้ defect และ deploy ใหม่)

| Issue ID | Fix Commit / Deployed SHA | Retest Tester | Date | Actual Result | Screenshot ID | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :---: |
| `[TBD]` | `[TBD]` | `guluJa`/`PhraewaS` | | | `d-retest-01.png` | ☐ PASS ☐ FAIL |

### 3-Category Transparency & Explicit Sign-Off Table

| Category | Items | Partner Decision |
| :--- | :--- | :---: |
| **(A) Agreed Sprint 1 Specified Behavior** | `/my-ticket` shows active tickets only (`AC-35`); completed history via `GET /tickets/:id` (`AC-36`) | ☐ Understood ☐ Question |
| **(B) Deferred Sprint 2/3 Scope** | 120s countdown display-only (`F-06`), Cancel (`F-05`), Rate Limit (`NFR-07`), Public Board (`F-07`) | ☐ Acknowledged ☐ Disputed |
| **(C) Minor Defects / Known Limitations** | CountdownTimer resets to 02:00 on refresh (if logged as Minor) | ☐ Accepted as Minor ☐ Not Accepted |

### Final Decision on PopQueue

| Field | Value |
| :--- | :--- |
| **Decision** | ☐ Accepted ☐ Accepted with minor limitations ☐ Not Accepted |
| **Exact Tested Version / SHA** | `[TBD — must match live Cloud Run SHA]` |
| **Partner Tester 1** | `guluJa` — Signature / Date: `[TBD]` |
| **Partner Tester 2** | `PhraewaS` — Signature / Date: `[TBD]` |

---

## D-2: BFteam's Decision on CrustCraft (Outgoing Acceptance)

> **UAT Team testing CrustCraft:** `@Theerawat82` + `@apfirst13`  
> **Partner Product:** CrustCraft Artisan Bakery Pre-Order & Fulfillment System (`https://crustcraft-d7wyiqxska-as.a.run.app` / `https://crustcraft-530290697744.asia-southeast1.run.app`)  
> **Partner Release Baseline:** Release B (`crustcraft-00005-lzs` / SHA: `13932e96a1491ded7b7c1e4bfa03701b50b1e917`)  
> **Evaluation Outcome:** ครบถ้วนทั้ง 5 เคส (`UAT-CC-01` ถึง `UAT-CC-05`) ผ่าน 100% ไม่พบข้อบกพร่องตามข้อกำหนดของ Sprint 1 (Zero Defects Found)

### BFteam UAT Summary & Retest Log

| Check Scope | Tested Version / SHA | Tester | Date | Actual Result | Evidence IDs | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :---: |
| Full Sprint 1 UAT Suite (`UAT-CC-01`..`05`) | `crustcraft-00005-lzs` (`13932e9`) | `@apfirst13`<br>`@Theerawat82` | 2026-11-20 | ผ่านครบทุกเคส (Normal Journey, Boundary Limits, Role Guard, Ownership Isolation, State Transition) | `b-ev-01.png` ถึง `b-ev-05.png` | ☑ PASS |

### Final Decision Issued by BFteam on CrustCraft

| Field | Value |
| :--- | :--- |
| **Decision** | **☑ Accepted** (ผ่านการยอมรับสมบูรณ์ตามสเปก Sprint 1) |
| **Exact Partner Release SHA / Version** | Release B (`crustcraft-00005-lzs` / `13932e96a1491ded7b7c1e4bfa03701b50b1e917`) |
| **BFteam Tester 1** | นายอภิวัชร์ ปัณฐธนาพัฒน์ (`@apfirst13`) — 20 พฤศจิกายน 2026 |
| **BFteam Tester 2** | นายธีรวัฒญ์ รุ่งสว่าง (`@Theerawat82`) — 20 พฤศจิกายน 2026 |

---

## D-3: Version Lineage Table

| Branch | Tag | Commit SHA | Purpose | Deployed? |
| :--- | :--- | :--- | :--- | :---: |
| `main` | `v0.2.0-lab5` | `bf52c9b` | Lab 5 baseline — UAT surface | ✅ Live |
| `lab6-docs` | — | — | Lab 6 docs only (intentionally not merged to keep Cloud Run SHA stable) | ❌ Doc-only |
| `lab5-staging` | — | — | Code staging for defect fixes | — |
| `fix/<issue>` | — | `[TBD RED SHA]` → `[TBD GREEN SHA]` | Defect fix branch (TDD) | — |
| `main` (post-fix) | `v0.2.1-lab6` | `[TBD]` | Post-fix release (if natural defect found) | ☐ |

> **Note:** `lab6-docs` is an intentional documentation-only branch that is NOT merged into `main` throughout the grading period to keep the live Cloud Run SHA identical to the SHA accepted by the Partner UAT team.
