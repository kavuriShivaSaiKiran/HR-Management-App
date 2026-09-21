# ACME Org - Employee Salary Management Software
## Requirements & Scope Specification

### 1. Goal & Context
ACME Org's HR team currently manages compensation data for 10,000 employees across multiple global offices (US, UK, Germany, India, Singapore) using fragmented Excel spreadsheets. This system provides a centralized, secure web-based application allowing the **HR Manager** (sole user persona) to manage employee salary records at scale and answer organizational questions regarding payroll distribution and equity.

---

### 2. In-Scope Features
| Feature | Description | Business Rationale |
| :--- | :--- | :--- |
| **Full Employee & Salary CRUD** | Create, view, update employee records and maintain full chronological salary record history. | Replaces manual spreadsheet edits with transactional auditability. |
| **Salary History Tracking** | Every compensation adjustment appends a new `salary_record` while preserving previous records with `is_current = 0`. | Critical for performance reviews, merit cycle tracking, and historical audit. |
| **High-Performance Search & Filters** | Search by name, employee code, or role; filter by department, country, pay band, and active/inactive status. | Enables instant access across 10,000+ employee records with pagination. |
| **Payroll Cost Analytics** | Aggregated total and average payroll cost grouped by department and country in normalized USD. | Answers executive queries on departmental expenditure and geographic cost bases. |
| **Salary Distribution by Band** | Minimum, maximum, exact median, and average salary calculations per pay band grade (L1–L5). | Provides HR leadership with immediate visibility into band penetration and compression. |
| **Cross-Cut Comparison Analytics** | Multi-dimensional comparison of average salaries by role across departments and geographies. | Benchmarks internal role compensation parity across offices. |
| **Deterministic Multi-Currency FX** | Seeded rate table for USD, EUR, GBP, INR, and SGD to convert all base salaries into a common USD baseline. | Delivers consistent, repeatable financial aggregates without live API volatility. |
| **Soft Delete Audit Retention** | Deleting an employee marks `employment_status = 'inactive'` without purging records. | Guarantees compliance and preservation of past payroll audit trails. |
| **10,000 Employee Seed Engine** | Idempotent generation of 10,000 realistic records with departmental and pay band variance. | Proves architecture scalability under realistic production volume. |

---

### 3. Explicitly Out-of-Scope Features (with Reasoning)
| Feature | Reason for Exclusion |
| :--- | :--- |
| **Pay-Equity / Demographic Analysis** | Excluded per initial scoping guidance; prioritized core payroll analytics and salary history first. Can be added as future work. |
| **Real Payroll, Tax & Statutory Compliance** | Real tax rules differ drastically across jurisdictions (US W-2, UK PAYE, India TDS, etc.); would overcomplicate internal salary tracking. |
| **Live / Real-Time FX Conversion APIs** | Live exchange rates fluctuate constantly, causing historical reports to produce inconsistent totals. Deterministic static tables ensure financial repeatability. |
| **Employee Self-Service Portal** | Tool is exclusively designed for the HR Manager / Compensation Admin persona, eliminating self-service view complexity. |
| **Complex Role-Based Access Control (RBAC)** | Designed with single-role HR Manager access as a deliberate MVP simplification. |

---

### 4. Technical Choices & Rationale
- **Frontend**: Next.js / React 19 with TypeScript for strong typing, fast component composition, and responsive layout.
- **Component Styling**: Shadcn/ui design conventions paired with Tailwind CSS for high aesthetic density and clean visual hierarchy.
- **Backend Architecture**: Modular Express + TypeScript REST API providing explicit separation of concerns (routes, services, ORM repository).
- **ORM & Data Layer**: Relational schema with index optimizations on `department_id`, `pay_band_id`, `country_code`, and `employee_code` for sub-millisecond querying over 10,000+ records.
- **Testing**: Deterministic automated test suite covering CRUD, salary history transitions, soft deletes, FX calculations, and edge cases.
