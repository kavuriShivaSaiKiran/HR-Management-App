# ACME Compensation & Workforce Intelligence Portal (SalaryFlow)

A production-grade, full-stack multi-country compensation and workforce analytics management system built for dual-hub operations across the **United States (USD)** and **India (INR)**. The platform simulates and manages **10,000 workforce records** with localized statutory compensation, auditable salary histories, deterministic FX conversion, and role-based access control.

---

## Table of Contents

- [Overview & Architecture](#overview--architecture)
- [Key Features](#key-features)
- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Default Demo Credentials](#default-demo-credentials)
- [Available Scripts](#available-scripts)
- [Directory Structure](#directory-structure)
- [API Reference](#api-reference)
- [Testing & Quality Assurance](#testing--quality-assurance)
- [Dual-Country Operational Baseline](#dual-country-operational-baseline)

---

## Overview & Architecture

SalaryFlow is architected as an integrated full-stack application:

- **Frontend:** React 19, TypeScript, Tailwind CSS v4, Lucide Icons, Recharts, and jsPDF.
- **Backend:** Node.js with Express 4 (`server.ts`), mounting Vite middleware during development and running compiled CommonJS in production.
- **Database:** In-process relational SQLite (`sql.js`) with Write-Ahead Logging (WAL) semantics, seeded with 10,000 realistic employee records across Engineering, Operations, Sales, Finance, Marketing, and Human Resources.
- **Authentication & Security:** JWT tokens delivered via HTTP-only cookies and Bearer headers, Bcrypt password hashing (salt rounds = 10), and strict Role-Based Access Control (RBAC).

---

## Key Features

1. **Authentication & Sign-In Page:**
   - Starts by default on the secure Sign-In view.
   - 1-click demo login buttons for rapid persona evaluation.
   - Password reveal toggle and session state isolation.

2. **Workforce Directory & Compensation Management:**
   - Filter 10,000 records by department, country (US/India), pay band (L1–L5), and active/inactive status.
   - Filter by employees with historical salary adjustments (`has_salary_change`).
   - Server-side indexed pagination (`current_salary` direct column, indexed lookups).
   - Auditable salary adjustments with required justification and timestamp logging in `salary_history`.

3. **Analytics & Insights:**
   - Real-time departmental payroll spend in USD normalized via deterministic FX rates (INR 0.012 = $1 USD).
   - Pay band penetration, salary range spread, and gender distribution analytics.
   - Filter metrics across custom historical analysis periods or single-date snapshots.

4. **Audit Trail & Compliance:**
   - Soft-delete compliance: deactivated employees retain complete historical audit trails.
   - Export comprehensive Executive Compensation Audit Dossiers in PDF format (`jspdf`).

5. **Built-in Automated Verification:**
   - 36 automated unit and integration tests runnable via CLI (`npm test`) or directly within the in-app **About** page.

---

## Prerequisites

- **Node.js:** v18.0.0 or higher (v20+ recommended)
- **npm:** v9.0.0 or higher

---

## Quick Start

### 1. Clone the repository

```bash
git clone <repository-url>
cd <repository-directory>
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Copy the example environment file:

```bash
cp .env.example .env
```

The default values are configured for local development:

```env
# Optional Gemini AI API key for intelligence features
GEMINI_API_KEY=""

# Application Host URL
APP_URL="http://localhost:3000"

# Authentication & Security
JWT_SECRET="acme-super-secret-jwt-key-minimum-32-characters-long"
JWT_EXPIRES_IN="1h"
COOKIE_SECURE="false"
COOKIE_SAME_SITE="lax"
```

### 4. Start the development server

```bash
npm run dev
```

The application will start on **`http://localhost:3000`** with live reloading and integrated API routes.

---

## Default Demo Credentials

The system seeds three test accounts for evaluating role-based workflows:

| Role | Email | Password | Access Level |
| :--- | :--- | :--- | :--- |
| **ACME HR Manager** | `hrmanager@acme.org` | `AcmeHR@2026!` | **Full Admin:** Create employees, update salaries, view all payroll metrics & audit trails. |
| **Standard Staff** | `staff@acme.org` | `Staff@2026!` | **Read-Only / Self-Service:** View personal profile and compensation history. |
| **Inactive Account** | `inactive@acme.org` | `Inactive@2026!` | **Deactivated:** Used to test and verify 401 unauthorized rejection. |

*Tip: The Sign-In screen features **1-Click Login** cards to immediately authenticate as either demo persona.*

---

## Available Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Runs the full-stack development server on port 3000 (`tsx server.ts`). |
| `npm test` | Executes the 36-assertion automated test suite (`tsx test/run_tests.ts`). |
| `npm run lint` | Runs the TypeScript compiler (`tsc --noEmit`) to ensure type safety. |
| `npm run build` | Compiles client assets via Vite and bundles `server.ts` into `dist/server.cjs`. |
| `npm start` | Boots the compiled production server (`node dist/server.cjs`). |

---

## Directory Structure

```
├── server/
│   ├── db/
│   │   ├── database.ts        # SQLite database init, tables, and 10,000 seed records
│   │   ├── employeeRepo.ts    # Repository for employee queries, pagination, & salary updates
│   │   └── userRepo.ts        # Repository for authentication, users, and password checks
│   ├── middleware/
│   │   └── auth.ts            # JWT verification, RBAC guard, & cookie extraction
│   └── routes/
│       └── api.ts             # Express REST endpoints (auth, employees, dashboard, tests)
├── src/
│   ├── components/            # React UI components (Sidebar, TopHeader, Modals, Views)
│   │   ├── DashboardView.tsx  # Executive metrics, departmental payroll spend, & trends
│   │   ├── EmployeesView.tsx  # Searchable, filterable workforce table with pagination
│   │   ├── InsightsView.tsx   # Pay equity, band penetration, & compensation breakdown
│   │   ├── LoginPage.tsx      # Sign-in portal with 1-click persona quick-logins
│   │   ├── AboutView.tsx      # Architecture documentation & interactive test runner
│   │   └── ...
│   ├── context/
│   │   └── AuthContext.tsx    # React authentication provider & session state management
│   ├── lib/                   # API client, PDF generation, currency utilities, date filters
│   └── types.ts               # Core TypeScript interfaces & domain types
├── test/
│   └── run_tests.ts           # Standalone automated test suite (36 assertions)
├── server.ts                  # Application entry point (Express + Vite middlewares)
├── metadata.json              # AI Studio deployment metadata & capabilities
├── package.json               # Scripts and dependency definitions
└── README.md                  # Project documentation (this file)
```

---

## API Reference

### Authentication
- `POST /api/auth/login` — Authenticate credentials (`email`, `password`), issues JWT token & HTTP-only cookie.
- `POST /api/auth/logout` — Invalidate session and clear authentication cookie.
- `GET /api/auth/me` — Return currently authenticated user profile and permissions.

### Reference Data & Metadata
- `GET /api/meta` — Returns departments, pay bands (L1–L5), and dual-country FX conversion rates.

### Workforce & Compensation
- `GET /api/employees` — Paginated and filtered employee list (`search`, `department_id`, `country_code`, `pay_band_id`, `has_salary_change`, `page`, `limit`).
- `GET /api/employees/:id` — Detailed employee profile including complete `salary_history`.
- `POST /api/employees` — Register a new employee *(Requires `HR_MANAGER` role)*.
- `PUT /api/employees/:id` — Update employee demographic and job profile *(Requires `HR_MANAGER` role)*.
- `PUT /api/employees/:id/salary` — Record an auditable salary revision with justification *(Requires `HR_MANAGER` role)*.
- `DELETE /api/employees/:id` — Soft-delete employee, preserving historical audit records *(Requires `HR_MANAGER` role)*.

### Metrics & Testing
- `GET /api/dashboard` — Aggregated compensation metrics, headcount, and departmental spend.
- `GET /api/activities` — Real-time audit log of recent compensation changes.
- `GET /api/tests/run` — Executes all 36 test assertions and returns structured JSON results for UI reporting.

---

## Testing & Quality Assurance

The application includes an automated test harness covering 36 critical assertions:

```bash
npm test
```

### Test Coverage Highlights:
- **Schema & Reference Data:** Validates 6 departments, 5 pay bands, and USD/INR exchange rates.
- **Workforce & Validation:** Tests employee creation, duplicate email rejection, and pagination bounds.
- **Salary History & Revisions:** Confirms revision tracking, `is_current` flags, and the salary change drilldown filter.
- **Soft Deletion:** Verifies audit trail preservation upon employee offboarding.
- **FX Normalization:** Validates deterministic conversion from INR to USD.
- **Security & RBAC:** Verifies Bcrypt hash comparisons, deactivated account rejection, JWT signature checks, token expiry, and HTTP 403 enforcement on unauthorized salary changes.

---

## Dual-Country Operational Baseline

The platform operates across two primary hubs:

| Country | Code | Currency | Deterministic FX Rate | Workforce Distribution |
| :--- | :--- | :--- | :--- | :--- |
| **India** | `IN` | **INR (₹)** | `0.012` (₹1,000,000 = $12,000 USD) | **~69% (~6,900 employees)** |
| **United States** | `US` | **USD ($)** | `1.000` ($1.00 = $1.00 USD) | **~31% (~3,100 employees)** |

### Departmental Distribution:
- **Engineering:** ~38%
- **Operations:** ~26%
- **Sales:** ~16%
- **Finance:** ~7%
- **Marketing:** ~7%
- **Human Resources:** ~6%
