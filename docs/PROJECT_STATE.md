# Project State – PopQueue

**Release:** none yet (Target: `v0.1.0-sprint1`) | **Sprint:** 1 | **Updated:** 2026-11-01  
**Theme:** Theme 9 – Queue and Service Management System (CPE 334)  
**Context:** PopQueue – On-site Virtual Waiting Queue for Art Toy Live Unboxing Station (No advance booking)

## Next Deadline
* **Project Deliverable 1:** 8 Nov 2026, 23:59 (Self-contained PDF via LEB2, 80 points)

## Sprint 1 Issues (Roadmap I-00 to I-08)

| Issue | Title | Scope / Feature | Status | Branch | PR |
|:---:|---|---|:---:|---|:---:|
| **I-00** | Contract Baseline & Master Specification | Part A–E Master Spec (v0.2) | **Merged** | `feature/i00-baseline-docs` | PR #1 (Merged) |
| **I-01** | Scaffold, DB, Migrations & Seed | Express + TS + Prisma + 2 Partial Indexes + Seed 9 accounts | **Merged** | `feature/i01-scaffold` | PR #12 (Merged) |
| **I-02** | F-01: Auth & Role Identity | Login, Logout, Me, Auth/Role middleware, Bcrypt (AC-01..08) | **Implemented** | `feature/i02-auth` | PR (Ready for Review) |
| **I-03** | F-02: Queue Discovery & Safe Join | Series list, Raw SQL atomic join, 50-user concurrency (AC-09..18) | Todo | `feature/i03-join` | - |
| **I-04** | F-04: Ticket Inspection & Ownership | My-ticket, ticket by ID, 403 ownership guard (AC-34..38) | Todo | `feature/i04-ticket` | - |
| **I-05** | F-03: Staff Counter & Call Next | Queue list, Call next (SKIP LOCKED, STAFF_BUSY) (AC-21..25, 31, 32) | Todo | `feature/i05-staff-call` | - |
| **I-06** | F-03: Start Unboxing & Complete | State transition machine, handler ownership guard (AC-26..30) | Todo | `feature/i06-staff-state` | - |
| **I-07** | Web UI (React + Vite) | 4 Screens: Login, Series, My Ticket, Staff Counter (AC-19, 20, 33) | Todo | `feature/i07-web-ui` | - |
| **I-08** | E2E, Persistence & Release | Playwright tests, persistence script, release PR & tag `v0.1.0-sprint1` | Todo | `feature/i08-release` | - |

## Feature & Acceptance Criteria Status
* Full Contract & STS for F-01..F-04 with AC-01..AC-39 is defined in `docs/PopQueue_Deliverable_1_Master.md`.
* Automated test results will be populated in Part F upon test execution on the release commit.

## Key Design Decisions
* **D-01 to D-14:** Documented in Part A §8 of `docs/PopQueue_Deliverable_1_Master.md`.
* Atomic queue numbering via Raw SQL `INSERT ... ON CONFLICT DO UPDATE ... RETURNING` (D-10).
* Concurrency race prevention via 2 PostgreSQL Partial Unique Indexes (`unique_active_ticket_user`, `unique_active_staff_ticket`).
* Stateless JWT with token revocation via `tokenVersion` on `User` table (D-04, D-11).

## Checklist: Places to Update When Stack Changes (จุดที่ต้องอัปเดตเมื่อมีการเปลี่ยนเทคโนโลยี/Stack)
1. **Master Specification (`docs/PopQueue_Deliverable_1_Master.md`):**
   - § ข้อมูลการส่งมอบและหน้าปก (Repository URL, Project Details)
   - Part B §2.3 ตาราง Approved / Recorded Changes (เพิ่ม Change ID เช่น `CHG-xx`)
   - Part C §1 Architecture Diagram, Layer Table, Repository Structure
   - Part C §8 UI Navigation & Technology Details
   - Part C §9 Configuration & Environment Variables (`VITE_*` vs `NEXT_PUBLIC_*`)
   - Part E §0 Contract Version History
   - Appendix: Issue Roadmap
2. **Sprint Pointers & Mini-SDS (`docs/sprints/sprint-1/system-sds.md`, etc.):**
   - ข้อความสรุปเทคโนโลยีใน Sprint Stack
3. **Project State (`docs/PROJECT_STATE.md`):**
   - ตารางสถานะงาน (Issue Roadmap Table)
4. **Monorepo & Package Configurations:**
   - Root `package.json`, workspace `package.json`, `.env.example`, `README.md`
5. **Issue Tracker & GitHub PRs:**
   - ชื่อและคำอธิบายของการ์ด Issue และ Pull Request บน GitHub

## Known Debt & Limitations
1. Sprint 1 has no Cancel/No-Show (arrives in Sprint 2); temporary relief via `npm run db:reset-demo` and 6 seeded collector accounts (D-09).
2. Countdown timer (120s) on Collector screen is visual-only in Sprint 1 (server enforcement in Sprint 2).
3. Short Polling (3s) for real-time updates without WebSockets/SSE.

## Next Step for the Team / Agent
* Complete review and merge of **Issue I-01** (Scaffold, Prisma models, migrations with 2 partial unique indexes, seed 9 accounts, and db:reset-demo). Next issue is **Issue I-02** (F-01: Auth & Role Identity).
