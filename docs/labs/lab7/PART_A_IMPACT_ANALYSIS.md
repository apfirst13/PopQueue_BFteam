# Lab 7 Part A — Impact Analysis & Test Impact Matrix

**Linked Change Request Issue:** `#52` (Revise BR-02 to 1 active ticket per Series)  
**Pull Request:** `PR #57` (`feature/lab7-52-contract` $\rightarrow$ `lab5-staging`)  
**Approval Prerequisite:** TA Written Approval (นายรัตนโชติ เพ็ชรพันธ์ศรี / พี่ลูกหมู, 2026-11-23 15:30 ICT)  
**Accepted Baseline:** `v0.1.0-sprint1` (`d946159`) · Lab 6 / Current `main` Baseline: `2aee62b`  

---

## 1. Requirement-to-Module Impact Table (Lab 7 §3.1 Format)

| Req ID | Feature | Affected SRS / Feature SDS / System SDS Sections | Affected AC | STS Test IDs | Code Modules & Persistence / Role / Caller Notes |
| :--- | :---: | :--- | :---: | :--- | :--- |
| **BR-02** | `F-02` | Master Part A §6 (`BR-02`), §8 (`D-06`, `D-08`); Part C §2, §4 (`unique_active_ticket_user_series`); Part E §2.3, §2.5, §2.8; `srs.md`, `system-sds.md` | `AC-11`, `AC-16`, `AC-19` | `TEST-11` *(rev)*, `TEST-16` *(ext)*, `TEST-19` *(ext)*, `db-schema-and-seed` *(rev)* | `0003` migration (`QueueTicket`), `schema.prisma` comment, `ticket.service.ts` (`joinQueue` P2002), `SeriesPage.tsx` (unchanged error alert), `smoke_test.py` (`N/A`: checks health/ready/series/auth only), `test-persistence.mjs` (`N/A`: distinct users) |
| **FR-04** | `F-02` | Master Part A §5 (`FR-04`); Part E §2.3 | `AC-10`, `AC-11` | `TEST-10` *(keep)*, `TEST-11` *(rev)* | `ticket.controller.ts`, `ticket.service.ts`; `SeriesPage` navigation to `/my-ticket` unchanged |
| **FR-05** | `F-04` | Master Part A §5 (`FR-05`), Part C §6–§8; Part E §4.3, §4.6, §4.7; `traceability.md` | `AC-34`, `AC-35`, `AC-20` | `TEST-34` *(ext)*, `TEST-35` *(keep)*, `TEST-20` *(reg)* | `ticket.service.ts` (`getMyActiveTicket`), `ticket.controller.ts`, `client/src/types/index.ts`, `MyTicketPage.tsx` (single 3s poller, ordered list, `<CountdownTimer key={t.id} />`), `LoginPage.tsx` (unchanged via `data.ticket`) |
| **BR-04, BR-05, BR-06, BR-07** | `F-01`, `F-03`, `F-04` | **Unchanged (`N/A` for rule edit)** — Master Part A §6, Part C §7 | `AC-08`, `AC-14`, `AC-24..31`, `AC-35` *(403)*, `AC-37`, `AC-38` | `TEST-08U`, `14`, `24..32`, `35` *(403)*, `37`, `38`, `db-schema` (`BR-06`) | **Roles / Ownership:** Collector blocked on `/api/staff/*` & cross-user `tickets/:id` (`403`); Box Master blocked on `join`/`my-ticket` (`403`) & still restricted to 1 serving ticket (`409 STAFF_BUSY`). Protected by regression suite |
| **BR-01, BR-03, BR-09** | `F-02`, `F-03` | **Unchanged (`N/A` for rule edit)** | `AC-12`, `AC-15`, `AC-17`, `AC-18`, `AC-28` | `TEST-12`, `15`, `17`, `18`, `28` | Atomic daily numbering, closed series `SKP` (`409 SERIES_CLOSED`), and strict state lifecycle unchanged; protected by regression suite |

---

## 2. Complete Test Impact Matrix (`AGENTS.md` #5 & Lab 7 §3.2 Justification)

| Test File & ID | Pre-Change Expectation | Disposition | Exact Action & Justification |
| :--- | :--- | :---: | :--- |
| `server/tests/db-schema-and-seed.test.ts` (`BR-02` test) | Creating `CRY` + `LAB` directly for `collector1` throws `P2002` | **Revised (Legitimate)** | Assert `CRY` + `LAB` succeeds, while `CRY` + second active `CRY` throws `P2002` on `unique_active_ticket_user_series`; keep `BR-06` test intact |
| `server/tests/api/join.test.ts` (`TEST-11`) | `CRY` then `LAB` (`crossRes`) returns `409 DUPLICATE_ACTIVE_QUEUE` | **Revised (Legitimate — `[RED]` Target)** | Update `crossRes` assertion from `409` to `201` (`LAB-001`, active count = 2); **retain** same-series `CRY` -> `CRY` `409` + counter rollback assertion; justified in Contract PR & PR-2 description per Lab 7 §3.2 |
| `server/tests/concurrency/duplicate.test.ts` (`TEST-16`) | 10 concurrent `CRY` joins -> 1×`201`, 9×`409` | **Preserved + Extended** | Keep existing 10× same-series race test intact; add concurrent distinct-series test (`CRY` + `LAB` -> `2 x 201`) |
| `server/tests/api/my-ticket.test.ts` (`TEST-34`, `TEST-35`) | `GET /api/tickets/my-ticket` returns `{ data: { ticket } }` or `404` / `403` | **Preserved + Extended** | Keep `data.ticket` & `404`/`403` tests untouched; add test asserting `data.tickets` returns 2 tickets ordered `createdAt ASC` with per-series `waitingAhead`, shrinking to 1 after one completes |
| `client/src/tests/ticket.test.tsx` | Single ticket render & `404` empty state (`data.ticket`) | **Preserved + Extended** | Keep existing mocks untouched (via fallback); add multi-ticket render test (`CRY` `CALLED` + `LAB` `WAITING`) verifying independent `CountdownTimer` & order |
| `client/src/tests/auth.test.tsx` & `series.test.tsx` | Mock `GET /api/tickets/my-ticket` returning `{ data: { ticket: ... } }` | **Preserved (Untouched)** | Protected by `{ ticket: tickets[0], tickets }` API shape & client fallback (`TD-02`) |
| `e2e/join-queue.spec.ts` (`TEST-19`) | Join `CRY` -> `/my-ticket` -> retry `CRY` -> `DUPLICATE_ACTIVE_QUEUE` | **Preserved + Extended** | Keep same-series duplicate check intact; add multi-series flow joining `LAB` after `CRY` |
| `e2e/responsive.spec.ts` (`TEST-20`) | `375x667` zero horizontal overflow across Sprint 1 UI | **Preserved (Extended Run)** | Verify `/my-ticket` with 2 active cards still exhibits zero horizontal overflow at `375px` |
| All other Sprint 1 tests (34 tests: `auth`, `ticket-detail`, `ticket-security`, `staff-*`, `numbering`, `queue-reset`, `permissions`) | Expected status codes, `401`/`403` security checks, `1..50` numbering | **Preserved (Untouched)** | Full regression proof that unrelated Sprint 1 security, role, and concurrency rules remain unbroken (**0 unintended regressions**) |

---

## 3. Governance & Invariant Preservation
- **0 Unintended Regressions:** Unrelated Sprint 1 capabilities (Auth, Bcrypt, Daily atomic numbering Asia/Bangkok, Staff call next queue FIFO, Staff busy 409, Cross-user 403, and Database persistence) remain 100% preserved.
- **TA Condition #4 Operational Trade-off:** Collectors called at 2 desks simultaneously see independent 120s countdown timers in UI; physical desk coordination is an accepted Sprint 1 operational limitation prior to Sprint 2 `F-06` server-enforced No-Show.
