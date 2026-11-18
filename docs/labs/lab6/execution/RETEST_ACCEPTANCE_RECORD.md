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

## D-2: BFteam's Decision on CrustCraft (Outgoing Retest)

> **BFteam retests CrustCraft fixes:** `@Theerawat82` + `@apfirst13`
> **Partner Product:** CrustCraft `https://crustcraft-d7wyiqxska-as.a.run.app`
> **Partner Release Tag:** `v1.0.0-sprint1` (SHA: `7a1d9dbcd64948e6d2f8758dee70656d38aba65f`)

### BFteam Retest Log

| Issue ID | Fix Commit / Deployed SHA | Retest Tester | Date | Actual Result | Screenshot ID | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :---: |
| `[TBD]` | `[TBD]` | `@Theerawat82`/`@apfirst13` | | | `d-retest-02.png` | ☐ PASS ☐ FAIL |

### Final Decision Issued by BFteam on CrustCraft

| Field | Value |
| :--- | :--- |
| **Decision** | ☐ Accepted ☐ Accepted with minor limitations ☐ Not Accepted |
| **Exact Partner Release SHA / Version** | `[TBD]` |
| **BFteam Tester 1** | `@Theerawat82` — Signature / Date: `[TBD]` |
| **BFteam Tester 2** | `@apfirst13` — Signature / Date: `[TBD]` |

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
