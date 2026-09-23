# Planning & Database Design Notes

## 1. Schema Modeling & Entity Relationships
- **`employees`**: Master employee records containing demographic, geographic, and organizational positioning data. Contains a denormalized `current_salary` column to eliminate expensive join overhead on directory listings.
- **`salary_records`**: Temporal salary adjustment log. Every merit adjustment, promotion, or market adjustment inserts a new record with `is_current = 1` and toggles prior records to `is_current = 0` within an atomic transaction.
- **`departments`**: Canonical organizational units (Engineering, Operations, Sales, Finance, Marketing, HR) with allocated annual budgets.
- **`pay_bands`**: Standardized compensation grade levels (L1 through L5) with minimum and maximum salary thresholds.
- **`fx_rates`**: Deterministic currency exchange table for USD, EUR, GBP, INR, and SGD.

---

## 2. Indexing Strategy for 10,000 Records
- `idx_emp_dept`: `(department_id)`
- `idx_emp_country`: `(country_code)`
- `idx_emp_band`: `(pay_band_id)`
- `idx_emp_status`: `(employment_status)`
- `idx_emp_code`: `(employee_code)`
- `idx_sal_emp_eff`: `(employee_id, effective_date DESC, is_current)`

---

## 3. Current-State vs Period Activity Philosophy
- **Current-State Metrics**: Always calculated at the active snapshot timestamp (Current Headcount, Total Annualized Comp, Current Avg/Median Salary).
- **Period Activity**: Calculates delta adjustments occurring strictly within the selected analysis window (Salary Changes in Period, Avg Adjustment %, Total Increase, Review Activity).
