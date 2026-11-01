# PopQueue – Art Toy Live Unboxing Queue Management System

**Theme 9: Queue and Service Management System** (CPE 334 Software Engineering Project)

PopQueue is an on-site virtual waiting queue management system designed for art toy stores (e.g. Crybaby Sunset Concert, Labubu Macaron) offering live unboxing experiences.

---

## Architecture & Workspaces

The repository is organized as an npm workspaces monorepo:

* `server/`: Express + TypeScript + Prisma + PostgreSQL API service
* `client/`: React + Vite + TypeScript web interface
* `e2e/`: Playwright end-to-end smoke test suite
* `docs/`: Master specification and sprint engineering contracts

---

## Setup & Getting Started

### Prerequisites

* **Node.js**: `>= 20.18.0` (LTS pinned in `.nvmrc`)
* **Docker & Docker Compose**: For local PostgreSQL database container
* **Git**

### Exact Setup Commands

Follow these steps sequentially to set up and run the project locally:

```bash
# 1. Clone the repository
git clone https://github.com/apfirst13/PopQueue_BFteam.git
cd PopQueue_BFteam

# 2. Copy environment configuration
cp .env.example .env

# 3. Start the local PostgreSQL database container
docker compose up -d

# 4. Install dependencies across all workspaces from clean state
npm install

# 5. Run database migration and seed data
npm run db:migrate
npm run db:seed

# Alternatively: reset cleanly and re-seed anytime
npm run db:reset-demo

# 6. Run automated test suites across all workspaces
npm test

# 7. Start the development server
npm run dev
```

---

## Authentication & Role Identity (Feature F-01 / Issue I-02)

PopQueue uses stateless JWT authentication with all-device token revocation via database `tokenVersion`:

### Endpoints
* `POST /api/auth/login` — Public. Expects `{ "username": "...", "password": "..." }`. Returns 200 `{ "data": { "token": "...", "user": { ... } } }`.
* `POST /api/auth/logout` — Protected (`Bearer <token>`). Increments user's `tokenVersion` in PostgreSQL, immediately invalidating all active tokens across devices. Returns 200 `{ "data": { "success": true } }`.
* `GET /api/auth/me` — Protected (`Bearer <token>`). Returns user identity and `assignedSeries` (`[]` for Collectors; array of assigned series for Box Masters).

### Seed Test Accounts
All seeded accounts use passwords defined in `SEED_COLLECTOR_PASSWORD` and `SEED_STAFF_PASSWORD`:
* **Collectors (Role `COLLECTOR`):**
  * `collector1` to `collector6` (Password default: `collector_dev_password123`)
* **Box Masters (Role `BOX_MASTER`):**
  * `staff_crybaby` (Assigned: `CRY` Crybaby Sunset Concert, Password default: `staff_dev_password123`)
  * `staff_crybaby2` (Assigned: `CRY` Crybaby Sunset Concert, Password default: `staff_dev_password123`)
  * `staff_labubu` (Assigned: `LAB` Labubu Macaron, Password default: `staff_dev_password123`)

---

## Available Root Scripts

* `npm run lint` — Lint all workspaces with ESLint
* `npm run typecheck` — Run TypeScript compiler check (`tsc --noEmit`) across all workspaces
* `npm test` — Run unit and integration tests across all workspaces via Vitest
* `npm run build` — Compile and build all workspaces
* `npm run dev` — Start the backend development server with hot-reload
* `npm run db:migrate` — Run Prisma migrations against PostgreSQL (`prisma migrate dev`)
* `npm run db:seed` — Run idempotent database seed script (`prisma db seed`)
* `npm run db:reset-demo` — Reset database cleanly, apply all migrations (including partial indexes), and re-seed 9 accounts + 3 series
