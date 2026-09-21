# Architectural Tradeoffs & Engineering Decisions

### 1. Database Engine: SQLite / Embedded WASM vs. Remote Cloud SQL (Neon)
- **Context**: The take-home specification suggests PostgreSQL / Neon or SQLite for testing.
- **Decision**: Implemented an in-process SQLite relational engine with persistent disk storage (`./data/salary_app.db`) alongside in-memory test isolation.
- **Tradeoffs**:
  - *Benefits*: Zero external network hops, immune to external API outages or rate limits, sub-millisecond query latency for sorting and paginating 10,000 employees, instant zero-config setup on local and container environments.
  - *Limitations*: Single-writer concurrency model. In a large enterprise with hundreds of simultaneous HR administrators writing concurrently, a multi-primary PostgreSQL cluster would be favored.

---

### 2. Currency Conversion: Deterministic Rate Table vs. Live FX API
- **Context**: Employees are compensated in local currencies (USD, GBP, EUR, INR, SGD).
- **Decision**: Stored a deterministic `fx_rates` table seeded with fixed conversion ratios to USD (e.g. EUR 1.08, GBP 1.28, INR 0.012, SGD 0.74).
- **Tradeoffs**:
  - *Benefits*: Audit consistency. Running a quarterly payroll report on Monday produces the exact same numbers when rerun on Friday. No failure modes from third-party FX rate provider rate limits or latency.
  - *Limitations*: Does not reflect intraday currency market fluctuations. Acceptable for internal salary planning and band benchmarking.

---

### 3. Authentication: Single-Role HR Manager Admin vs. Full RBAC
- **Context**: The app is strictly an internal administrative tool for the HR Manager persona.
- **Decision**: Deliberately simplified to single-role HR Manager authenticated context.
- **Tradeoffs**:
  - *Benefits*: Reduces architectural surface area, avoids auth ceremony in take-home review, and directs development effort toward core data scaling, salary history, and analytical reporting.
  - *Limitations*: Multi-tier permissions (e.g., Department Heads viewing only their own team) are deferred to a future iteration.

---

### 4. History Modeling: Append-Only Salary Records vs. Version Columns
- **Context**: Compensation changes occur over time (promotions, cost-of-living adjustments).
- **Decision**: Modeled distinct `salary_records` child entities linked to `employee_id` with `effective_date` and an indexed `is_current` boolean flag.
- **Tradeoffs**:
  - *Benefits*: Clean temporal queries, trivial rollback capabilities, complete audit trail of who earned what and when.
  - *Limitations*: Requires updates to set `is_current = 0` on previous records when inserting a new active compensation record (guaranteed safe by wrapping in database transactions).
