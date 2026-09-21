# Intentional AI Usage & Prompt Log

This document records the architectural prompts, system instructions, and design patterns used with AI during development.

---

### Prompt 1: Domain Modeling & Database Schema
> *"Design a relational SQL schema for ACME Org's compensation platform supporting 10,000 employees. Structure tables for employees, departments, pay_bands, salary_records, and fx_rates. Ensure salary revisions append historical records with is_current flags rather than overwriting past values."*
- **Outcome**: Created modular schema with proper foreign keys, `is_current` boolean indexing, and audit-safe soft deletes.

---

### Prompt 2: Aggregations & Exact Median Computation
> *"Develop analytics functions in TypeScript that aggregate total and average payroll costs across departments and countries in normalized USD. Implement exact median and distribution calculations per pay band grade."*
- **Outcome**: Built mathematical median calculation logic that handles both odd and even dataset lengths without precision loss.

---

### Prompt 3: UI Design Alignment with Reference Artifact
> *"Translate the PaySphere dashboard reference image into clean, modular React components using Tailwind CSS and Lucide icons. Recreate the 4 KPI stat cards, 6-month payroll trend chart, salary breakdown donut chart, payroll calendar widget, and searchable employee payroll table with status badges."*
- **Outcome**: Implemented matching UI hierarchy with identical visual balance, typography, and responsive controls.

---

### Prompt 4: Deterministic Seed Generation at Scale
> *"Write an idempotent seed engine that generates up to 10,000 employees across 6 departments, 5 pay bands, and 5 global currencies (USD, GBP, EUR, INR, SGD). Apply realistic variance within band bounds and generate past salary histories."*
- **Outcome**: Built batch-inserted seeding engine executing within single-transaction blocks for sub-second database population.
