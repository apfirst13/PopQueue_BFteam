# Project State – PopQueue

**Release:** none yet (Target: `v0.1.0-sprint1`) | **Sprint:** 1 | **Updated:** 2026-11-02  
**Theme:** Theme 9 – Queue and Service Management System (CPE 334)  
**Context:** PopQueue – On-site Virtual Waiting Queue for Art Toy Live Unboxing Station (No advance booking)

## Next Deadline
* **Project Deliverable 1:** 8 Nov 2026, 23:59 (Self-contained PDF via LEB2, 80 points)

## Sprint 1 Issues (Roadmap I-00 to I-08)

| Issue | Title | Scope / Feature | Status | Branch | PR |
|:---:|---|---|:---:|---|:---:|
| **I-00** | Contract Baseline & Master Specification | Part A–E Master Spec (v0.2) | **Merged** | `feature/i00-baseline-docs` | PR #1 (Merged) |
| **I-01** | Scaffold, DB, Migrations & Seed | Express + TS + Prisma + 2 Partial Indexes + Seed 9 accounts | **Merged** | `feature/i01-scaffold` | PR #12 (Merged) |
| **I-02** | F-01: Auth & Role Identity | Login, Logout, Me, Auth/Role middleware, Bcrypt (AC-01..08) | **Merged** | `feature/i02-auth` | PR #13 (Merged) |
| **I-03** | F-02: Queue Discovery & Safe Join | Series list, Raw SQL atomic join, 50-user concurrency (AC-09..18) | **Merged** | `feature/i03-join` | PR #14 (Merged) |
| **I-04** | F-04: Ticket Inspection & Ownership | My-ticket, ticket by ID, 403 ownership guard (AC-34..38) | **Merged** | `feature/i04-ticket` | PR #15 (Merged) |
| **I-05** | F-03: Staff Counter & Call Next | Queue list, Call next (SKIP LOCKED, STAFF_BUSY) (AC-21..25, 31, 32) | **Merged** | `feature/i05-staff-call` | PR #17 (Merged) |
| **I-06** | F-03: Start Unboxing & Complete | State transition machine, handler ownership guard (AC-26..30) | **Merged** | `feature/i06-staff-state` | PR #18 (Merged) |
| **I-07** | Web UI (React + Vite) | 4 Screens: Login, Series, My Ticket, Staff Counter (AC-19, 20, 33) | **Merged** | `feature/i07-web-ui` | PR #20 (Merged) |
| **I-08** | E2E, Persistence & Evidence | Playwright tests (TEST-19, 20, 33), persistence script (TEST-39), Part F evidence | **Implemented** | `feature/i08-e2e-persistence` | Ready for Review |

## Feature & Acceptance Criteria Status
* Full Contract & STS for F-01..F-04 with AC-01..AC-39 is defined in `PopQueue_Deliverable_1_Master.md`.
* Automated test results will be populated in Part F upon test execution on the release commit.

## Key Design Decisions
* **D-01 to D-14:** Documented in Part A §8 of `PopQueue_Deliverable_1_Master.md`.
* Atomic queue numbering via Raw SQL `INSERT ... ON CONFLICT DO UPDATE ... RETURNING` (D-10).
* Concurrency race prevention via 2 PostgreSQL Partial Unique Indexes (`unique_active_ticket_user`, `unique_active_staff_ticket`).
* Stateless JWT with token revocation via `tokenVersion` on `User` table (D-04, D-11).
* **CHG-08:** Web UI styles implemented with Native Semantic CSS Variables and Mobile-first layout container instead of Tailwind PostCSS build tools to prevent monorepo build complexity while preserving 100% WCAG 2.1 AA tokens.

## Checklist: Places to Update When Stack Changes (จุดที่ต้องอัปเดตเมื่อมีการเปลี่ยนเทคโนโลยี/Stack)
1. **Master Specification (`PopQueue_Deliverable_1_Master.md`):**
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
* Complete code review for **Issue I-08 Part A** (`feature/i08-e2e-persistence` -> `sprint-1-staging`). Next step is Part B: Release steps (Release PR `sprint-1-staging` -> `main`, create tag `v0.1.0-sprint1`, and compile self-contained Deliverable 1 PDF).
