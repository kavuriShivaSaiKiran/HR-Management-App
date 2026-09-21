import initSqlJs, { Database } from 'sql.js';
import { initializeSchema } from '../server/db/database';

async function runTests() {
  console.log('--- Starting ACME Employee Salary Management Test Suite ---');
  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string) {
    if (condition) {
      console.log(`PASS: ${testName}`);
      passed++;
    } else {
      console.error(`FAIL: ${testName}`);
      failed++;
    }
  }

  const SQL = await initSqlJs();
  const db = new SQL.Database();
  initializeSchema(db);

  console.log('\n[1] Testing Schema and Baseline Reference Data...');
  const depts = db.exec("SELECT COUNT(*) FROM departments")[0].values[0][0] as number;
  assert(depts >= 6, 'Departments table seeded with >= 6 departments');

  const payBands = db.exec("SELECT COUNT(*) FROM pay_bands")[0].values[0][0] as number;
  assert(payBands >= 5, 'Pay bands table seeded with >= 5 bands');

  const fxRates = db.exec("SELECT COUNT(*) FROM fx_rates")[0].values[0][0] as number;
  assert(fxRates >= 5, 'Deterministic FX rate table initialized with 5 currencies');

  console.log('\n[2] Testing Employee Creation and Validation...');
  // Test valid employee insertion
  const now = new Date().toISOString();
  db.run(`
    INSERT INTO employees (
      employee_code, first_name, last_name, email, department_id,
      role_title, country_code, currency_code, pay_band_id, employment_status,
      hire_date, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `, [
    'EMP-TEST1', 'Sarah', 'Connor', 'sarah.connor@acme.test', 1,
    'Lead Architect', 'US', 'USD', 5, 'active', '2023-01-15', now, now
  ]);
  const newEmpId = db.exec("SELECT last_insert_rowid()")[0].values[0][0] as number;
  assert(newEmpId > 0, 'New employee created with unique code EMP-TEST1');

  // Test salary record creation
  db.run(`
    INSERT INTO salary_records (
      employee_id, base_salary, currency_code, effective_date, is_current
    ) VALUES (?, ?, ?, ?, 1)
  `, [newEmpId, 210000, 'USD', '2023-01-15']);
  const salId = db.exec("SELECT last_insert_rowid()")[0].values[0][0] as number;
  assert(salId > 0, 'Initial salary record created with is_current = 1');

  // Test unique email constraint
  let emailDupeFailed = false;
  try {
    db.run(`
      INSERT INTO employees (
        employee_code, first_name, last_name, email, department_id,
        role_title, country_code, currency_code, pay_band_id, employment_status,
        hire_date, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      'EMP-TEST2', 'Duplicate', 'User', 'sarah.connor@acme.test', 1,
      'Architect', 'US', 'USD', 5, 'active', '2023-01-15', now, now
    ]);
  } catch {
    emailDupeFailed = true;
  }
  assert(emailDupeFailed, 'Duplicate email correctly rejected by database constraint');

  console.log('\n[3] Testing Salary History and Updates...');
  // Record salary change: set old to is_current = 0, new to is_current = 1
  db.run("UPDATE salary_records SET is_current = 0 WHERE employee_id = ?", [newEmpId]);
  db.run(`
    INSERT INTO salary_records (
      employee_id, base_salary, currency_code, effective_date, is_current
    ) VALUES (?, ?, ?, ?, 1)
  `, [newEmpId, 235000, 'USD', '2024-03-01']);

  const histRecords = db.exec("SELECT base_salary, is_current FROM salary_records WHERE employee_id = ? ORDER BY effective_date ASC", [newEmpId])[0].values;
  assert(histRecords.length === 2, 'Employee retains 2 historical salary records');
  assert(histRecords[0][0] === 210000 && histRecords[0][1] === 0, 'First salary marked inactive (is_current = 0)');
  assert(histRecords[1][0] === 235000 && histRecords[1][1] === 1, 'Latest salary marked current (is_current = 1)');

  console.log('\n[4] Testing Soft Delete (Audit Trail Retention)...');
  db.run("UPDATE employees SET employment_status = 'inactive', updated_at = ? WHERE id = ?", [new Date().toISOString(), newEmpId]);
  const statusRes = db.exec("SELECT employment_status FROM employees WHERE id = ?", [newEmpId])[0].values[0][0];
  assert(statusRes === 'inactive', 'Employee status updated to inactive on soft delete');
  const countStillInDb = db.exec("SELECT COUNT(*) FROM employees WHERE id = ?", [newEmpId])[0].values[0][0];
  assert(countStillInDb === 1, 'Employee record preserved in database for audit compliance');

  console.log('\n[5] Testing Currency Conversion & Aggregation Functions...');
  // Add an employee in EUR and test deterministic USD conversion
  db.run(`
    INSERT INTO employees (
      employee_code, first_name, last_name, email, department_id,
      role_title, country_code, currency_code, pay_band_id, employment_status,
      hire_date, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `, [
    'EMP-EUR1', 'Hans', 'Mueller', 'hans.mueller@acme.test', 1,
    'DevOps Engineer', 'DE', 'EUR', 4, 'active', '2023-05-01', now, now
  ]);
  const deEmpId = db.exec("SELECT last_insert_rowid()")[0].values[0][0] as number;
  db.run(`
    INSERT INTO salary_records (employee_id, base_salary, currency_code, effective_date, is_current)
    VALUES (?, ?, ?, ?, 1)
  `, [deEmpId, 100000, 'EUR', '2023-05-01']);

  // Rate for EUR is 1.08 so 100,000 EUR = 108,000 USD
  const convertedUsd = db.exec(`
    SELECT sr.base_salary * fx.rate_to_usd
    FROM salary_records sr
    JOIN employees e ON sr.employee_id = e.id
    JOIN fx_rates fx ON e.currency_code = fx.currency_code
    WHERE e.id = ? AND sr.is_current = 1
  `, [deEmpId])[0].values[0][0] as number;
  assert(Math.round(convertedUsd) === 108000, 'Deterministic FX rate (1.08) accurately converts 100,000 EUR to $108,000 USD');

  console.log('\n[6] Testing Edge Cases...');
  // 1. Employee with no salary records
  db.run(`
    INSERT INTO employees (
      employee_code, first_name, last_name, email, department_id,
      role_title, country_code, currency_code, pay_band_id, employment_status,
      hire_date, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `, [
    'EMP-NOSAL', 'No', 'Salary', 'no.salary@acme.test', 2,
    'Intern', 'US', 'USD', 1, 'active', '2024-01-01', now, now
  ]);
  const noSalId = db.exec("SELECT last_insert_rowid()")[0].values[0][0] as number;
  const noSalQuery = db.exec(`
    SELECT e.id, sr.base_salary
    FROM employees e
    LEFT JOIN salary_records sr ON e.id = sr.employee_id AND sr.is_current = 1
    WHERE e.id = ?
  `, [noSalId])[0].values[0];
  assert(noSalQuery[1] === null, 'Employee with no salary history safely handled with null current salary');

  // 2. Empty filter results
  const emptyFilter = db.exec("SELECT COUNT(*) FROM employees WHERE department_id = 9999")[0].values[0][0];
  assert(emptyFilter === 0, 'Non-existent department filter returns 0 records without crashing');

  // 3. Pagination boundaries
  const pagedRes = db.exec("SELECT * FROM employees LIMIT 5 OFFSET 0")[0].values;
  assert(pagedRes.length <= 5, 'Pagination limit strictly respected');

  console.log(`\n================================`);
  console.log(`Tests finished: ${passed} passed, ${failed} failed.`);
  console.log(`================================\n`);

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch(err => {
  console.error('Test runner fatal error:', err);
  process.exit(1);
});
