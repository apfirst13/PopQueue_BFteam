# PopQueue — Lab 7 Planning & Coordination Docs (`lab7-docs`)

> **IMPORTANT — DO NOT MERGE THIS BRANCH INTO `lab5-staging` OR `main`!**  
> Branch **`lab7-docs`** is a **documentation & evidence workspace branch** (same pattern as `lab6-docs`), shared so both teammates (`@Theerawat82` & `@apfirst13`) can review the Lab 7 Master Plan, Change Request draft, and coordinate without polluting `lab5-staging`, `main`, CI/CD runs, or `BR-02` diffs.
>
> Actual Lab 7 deliverables (Contract PR, `[RED]`/`[GREEN]` implementation PRs, and Release PR) **must branch from `lab5-staging`** (`feature/<CR#>-...`) and merge via **`PR-1` -> `PR-2` -> `PR-3` -> `PR-4` -> `main`**.

---

## Files in This Folder

| File | Purpose |
| :--- | :--- |
| [plan/LAB7_MASTER_PLAN.md](plan/LAB7_MASTER_PLAN.md) | Full Lab 7 plan (Revision 5): governance rules, deterministic PR ownership, `BR-02 v2` spec, migration `0003` order, Impact Table, Test Impact Matrix, schedule, and pre-submission checklist |
| [plan/CHANGE_REQUEST_ISSUE_DRAFT.md](plan/CHANGE_REQUEST_ISSUE_DRAFT.md) | Copy-paste GitHub Change Request Issue draft + TA approval message |
| [PopQueue_Lab7_Context.md](PopQueue_Lab7_Context.md) | Baseline repo, commit, tag, API/schema, and GitHub record context |

---

## Quick Coordination Summary for `@apfirst13`

1. **Staging Branch:** Continue using **`lab5-staging`** (**do NOT create `lab7-staging`** — `ci-docker.yml` and ruleset `protect-staging` only cover `lab5-staging` and `main`).
2. **Mandatory Merge Method:** Every PR (`PR-Sync`, `PR-1`, `PR-2`, `PR-3`, `PR-4`) **must use `Create a merge commit`** (never Squash or Rebase) so `require_last_push_approval` never deadlocks `PR-4`.
3. **Issue Traceability:**
   * All commits + PR bodies in `PR-1`..`PR-3` (`-> lab5-staging`): include **`Refs #<CR>`**
   * `PR-4` (`lab5-staging -> main`): include **`Closes #<CR>`** so `#CR` closes automatically on release before Part C snapshot.
4. **Role Ownership Chain:**
   * **`PR-Sync`** (`main` -> `lab5-staging`): `@Theerawat82` opens -> **`@apfirst13` approves & merges (`Create a merge commit`)** *(safe immediately; `deploy.yml` triggers on `main` only)*.
   * **`PR-1` Contract (`feature/<CR#>-br02-contract` -> `lab5-staging`, strictly AFTER TA written approval):** `@Theerawat82` authors -> **`@apfirst13` reviews contract + approves & merges**.
   * **`PR-2` Backend + Migration (`feature/<CR#>-br02-backend` -> `lab5-staging`):** **`@apfirst13` sole author** (`Commit 1 [RED]` with `Pre-Change SHA`, `RED SHA`, `git diff --stat`; `Commit 2 [GREEN]` with migration `0003` CREATE-before-DROP + full `server` Vitest run) -> `@Theerawat82` 5-Lenses reviews & merges.
   * **`PR-3` Frontend UI + E2E (`feature/<CR#>-br02-ui-e2e` -> `lab5-staging`):** `@Theerawat82` authors -> **`@apfirst13` 5-Lenses reviews & merges**.
   * **`PR-4` Release (`lab5-staging` -> `main`, AFTER Issue `#47` closes or Wed 25 Nov 12:00 TA consultation):** **`@apfirst13` opens (`Closes #<CR>`)** -> `@Theerawat82` approves & merges (`Create a merge commit`) -> verify `Deploy demo` + `popqueue-migrate` -> tag `v0.3.0-lab7` -> live verify.
5. **Deliverable 2 (Sprint 2 Parallel Track):**
   * Develop Sprint 2 (`F-05..F-08`) on separate `feature/<s2-issue#>-...` branches referencing `BR-02 v2` ("1 active ticket per Series").
   * **Do NOT merge any Sprint 2 PR into `lab5-staging` or `main` until `v0.3.0-lab7` passes live Cloud Run verification.**
