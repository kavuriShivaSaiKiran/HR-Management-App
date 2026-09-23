# Development Approach & Engineering Methodology

## 1. Agentic AI Methodology & Autonomous Workflow
- **Domain-Driven Instructions**: The platform was built using autonomous agentic tools where every prompt was anchored in concrete schema contracts (`employees`, `salary_records`, `pay_bands`, `fx_rates`).
- **Smart Read-Before-Write**: Before making code modifications, existing files were inspected to avoid blind overwrites and preserve existing architectural contracts.
- **Continuous Verification**: Every code modification was verified through `compile_applet` (TypeScript strict mode) and `lint_applet` (ESLint) to ensure zero syntax or type regressions.
- **Zero Mocking in Data Engine**: All calculations (medians, averages, canonical USD normalization, and period comparisons) execute against an in-process SQLite relational engine with persistent disk storage.

---

## 2. Code Structure & Maintainability
- **Frontend Architecture (React 19 + TypeScript + Tailwind CSS)**:
  - `src/components/DashboardView.tsx`: Executive KPIs, dual distinct charts, department & country breakdowns, full-page skeleton suites.
  - `src/components/EmployeesView.tsx`: 10,000-record paginated directory with multi-attribute filtering & sorting.
  - `src/components/ReportsView.tsx`: Compensation Insights with analytical distributions and period activity.
  - `src/components/AboutView.tsx`: Complete system dossier and interactive test runner.
  - `src/lib/periodUtils.ts`: Shared period calculation logic for point-in-time snapshot and cycle delta comparisons.
  - `src/lib/generateDossierPdf.ts`: Publication-grade PDF generator for technical dossier.
- **Backend Architecture (Express 4 + TypeScript)**:
  - `server/routes/api.ts`: Modular REST endpoints with strict input validation.
  - `server/db/orm.ts`: Atomic transactions, exact median calculators, and deterministic currency normalization.
  - `server/db/database.ts`: Normalized SQLite schema with composite indexes.

---

## 3. Fast & Deterministic Automated Unit Testing Suite
- **Location**: `/test/run_tests.ts` (Run via `npm test` or interactive UI runner in About page)
- **Speed**: Executes 21 assertions in < 30ms with 100% deterministic reproducibility.
- **Scope**:
  1. *Schema & Baseline Reference Data*: Departments table (>= 6 depts), Pay bands (>= 5 grades), Deterministic FX rates table (5 currencies).
  2. *Employee Creation & Validation*: Unique employee code creation, initial salary record with `is_current = 1`, duplicate email constraint rejection.
  3. *Chronological Salary History*: Salary revisions append historical records while setting prior to `is_current = 0`.
  4. *Soft Delete Audit Compliance*: Status updated to `inactive` on deletion; employee row is preserved in database for historical payroll and regulatory compliance.
  5. *Deterministic FX Normalization*: 100,000 EUR with 1.08 rate converts to exactly $108,000 USD canonical baseline.
  6. *Edge Cases & Boundary Handling*: Safe handling of employees with null salary; non-existent department filter returns 0 records without crash; strict pagination limit boundaries.
  7. *Direct Current Salary & Pagination*: Dedicated `current_salary` column on employees table; `COALESCE` fallback; database-level `LIMIT/OFFSET` returns distinct pages.

---

## 4. Incremental Commit History & Evolution
1. **Milestone 1 (Foundations)**: Relational schema, SQLite setup with disk persistence, and 10,000-employee realistic seeding engine.
2. **Milestone 2 (Core Business Logic)**: Employee CRUD, salary adjustment drawer with audit reason, and paginated table with multi-attribute filtering.
3. **Milestone 3 (Analytical Intelligence)**: Executive Dashboard, period activity filters, and dual-state snapshot vs review cycle comparison.
4. **Milestone 4 (Simpler Two-Chart Architecture)**: Refactored complex charts into two distinct visual graphs (Monthly Compensation Trend & Salary Adjustment Volume).
5. **Milestone 5 (Data Realism & Dual Hub)**: Calibrated salary distributions to mirror realistic enterprise compensation across India (69%) and US (31%) hubs.
6. **Milestone 6 (UX & Loading Polish)**: Built full-page skeleton suites and active card spinners to eliminate layout shift and provide responsive feedback.
7. **Milestone 7 (Documentation & Artifacts)**: Complete development dossier, live test runner, and printable PDF export.
