# Feature Inventory

Version 0.1 (draft) | 2026-11-01

| ID | Feature | Description | Requirements | Depends on | Sprint |
|---|---|---|---|---|---|
| F-01 | Auth, session, role middleware, seed | login/logout/me, session lifecycle, role + queue-assignment checks, seed accounts and queues | FR-01 to FR-03, NFR-01, NFR-02, NFR-05 | - | 1 |
| F-02 | Join queue and my entry | list open queues, take ticket with safe queue number, view own entry | FR-04 to FR-06, BR-01, BR-02, BR-06, BR-07, NFR-03, NFR-04 | F-01 | 1 |
| F-03 | Operator workflow | list entries, call next (FIFO), start, complete, authorization, invalid transitions rejected | FR-07 to FR-10, BR-03, BR-04, BR-05, BR-08, BR-09 | F-01, F-02 | 1 |
| F-04 | Cancel ticket | owner cancels a WAITING entry | FR-11, BR-13 | F-02 | 2 |
| F-05 | Confirm and no-show | confirm when called within window; unconfirmed becomes NO_SHOW | FR-12, FR-13, BR-10 to BR-12, NFR-08, NFR-09 | F-03 | 2 |
| F-06 | Public display | public status board without personal data | FR-14, BR-14 | F-03 | 2 (Sprint 1 only if TA requires, see Q-02) |
| F-07 | Multiple queues/counters | more queues, operator assignment management | FR-15 | F-03 | 2 |
| F-08 | Service administration | admin manages services/queues | FR-16 | F-01 | 3 (optional) |
| F-09 | Service summary | counts, average wait, no-show rate | FR-17 | F-05 | 3 |
| F-10 | Hardening and regression | persistence, setup reproducibility, performance check, regression suite | NFR-06, NFR-07, NFR-10 | all | 1 and 3 |

## Sprint 1 scope
F-01, F-02, F-03 plus the verification parts of F-10 (NFR-06, NFR-07).
