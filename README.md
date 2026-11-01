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

# 5. Run automated test suites across all workspaces
npm test

# 6. Start the development server
npm run dev
```

---

## Available Root Scripts

* `npm run lint` — Lint all workspaces with ESLint
* `npm run typecheck` — Run TypeScript compiler check (`tsc --noEmit`) across all workspaces
* `npm test` — Run unit and integration tests across all workspaces via Vitest
* `npm run build` — Compile and build all workspaces
* `npm run dev` — Start the backend development server with hot-reload
* `npm run db:migrate` — Database migration command (placeholder: not implemented yet)
* `npm run db:seed` — Database seed command (placeholder: not implemented yet)
