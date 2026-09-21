# System Architecture & Technical Design

## 1. High-Level Architecture Diagram

```
+---------------------------------------------------------------------------------+
|                               CLIENT LAYER                                      |
|                                                                                 |
|  [PaySphere React 19 Frontend + Shadcn/UI + Tailwind CSS + Recharts]             |
|                                                                                 |
|   +-------------------+  +-------------------+  +---------------------------+   |
|   | Dashboard View    |  | Employees View    |  | Analytics & Reports View  |   |
|   | - 4 KPI Cards     |  | - Filter Bar      |  | - Payroll by Dept/Country |   |
|   | - Trend Area Chart|  | - Search (Name/ID)|  | - Salary Distribution     |   |
|   | - Donut Breakdown |  | - Paginated Table |  |   (Min/Max/Median/Avg)    |   |
|   | - Payroll Calendar|  | - Salary History  |  | - Role vs Dept Comparison |   |
|   +-------------------+  +-------------------+  +---------------------------+   |
+---------------------------------------+-----------------------------------------+
                                        | HTTP / JSON REST
+---------------------------------------v-----------------------------------------+
|                               BACKEND LAYER                                     |
|                                                                                 |
|   [Express 4 + TypeScript Application Server (Port 3000)]                       |
|                                                                                 |
|   +-------------------------------------------------------------------------+   |
|   | REST API Endpoints (/api)                                               |   |
|   |  - GET    /api/employees (pagination, filter, sorting)                  |   |
|   |  - GET    /api/employees/:id (detail + chronological salary history)    |   |
|   |  - POST   /api/employees (transactional employee + initial salary)      |   |
|   |  - PUT    /api/employees/:id (employee details update)                  |   |
|   |  - PATCH  /api/employees/:id/salary (record salary change revision)     |   |
|   |  - DELETE /api/employees/:id (soft delete audit status update)          |   |
|   |  - GET    /api/analytics/payroll-cost?group_by=department|country       |   |
|   |  - GET    /api/analytics/salary-distribution?group_by=pay_band          |   |
|   |  - GET    /api/analytics/comparison?dimension=role&group_by=department  |   |
|   |  - POST   /api/seed (10,000 employee generation)                        |   |
|   +------------------------------------+------------------------------------+   |
|                                        |                                        |
|   +------------------------------------v------------------------------------+   |
|   | ORM & Data Access Layer (EmployeeRepository)                            |   |
|   |  - Transactional boundaries (BEGIN / COMMIT / ROLLBACK)                 |   |
|   |  - Deterministic FX normalization engine                                |   |
|   |  - Exact median & percentile aggregation calculator                     |   |
|   |  - Strict input validator & schema sanitization                         |   |
|   +------------------------------------+------------------------------------+   |
+----------------------------------------|----------------------------------------+
                                         |
+----------------------------------------v----------------------------------------+
|                               DATABASE LAYER                                    |
|                                                                                 |
|   [Relational SQLite Engine with Disk Persistence & Memory-Mapped Cache]       |
|                                                                                 |
|   Tables:                                                                       |
|   - departments (id PK, name UNIQUE)                                            |
|   - pay_bands (id PK, name, min_salary, max_salary)                             |
|   - fx_rates (currency_code PK, rate_to_usd)                                    |
|   - employees (id PK, employee_code UNIQUE, email UNIQUE, dept_id FK,           |
|                band_id FK, status, country, currency, hire_date)               |
|   - salary_records (id PK, employee_id FK, base_salary, currency,               |
|                     effective_date, is_current)                                 |
|   - activity_logs (id PK, title, subtitle, status, type, created_at)            |
|                                                                                 |
|   Indexes:                                                                      |
|   - idx_emp_dept, idx_emp_band, idx_emp_country, idx_emp_status, idx_sal_emp   |
+---------------------------------------------------------------------------------+
```

## 2. Deployment Topology
- **Container Target**: Cloud Run / Docker container listening on host `0.0.0.0`, port `3000`.
- **Static Assets & SPA**: Bundled by Vite, served directly through Express static middleware with fallback index routing.
- **Data Persistence**: File snapshot backing to `./data/salary_app.db` with automated disk write syncing on mutating operations.
