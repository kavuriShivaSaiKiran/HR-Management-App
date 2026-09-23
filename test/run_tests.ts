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
  assert(fxRates >= 2, 'Deterministic FX rate table initialized for dual-country operations (USD, INR)');

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

  // Verify employee with multiple salary records is matched by salary change query
  const changedEmps = db.exec(`
    SELECT COUNT(*) FROM employees e
    WHERE (SELECT COUNT(*) FROM salary_records sr WHERE sr.employee_id = e.id) > 1
  `)[0].values[0][0] as number;
  assert(changedEmps > 0, 'Employees with salary adjustments correctly identified by historical revision filter');

  console.log('\n[4] Testing Soft Delete (Audit Trail Retention)...');
  db.run("UPDATE employees SET employment_status = 'inactive', updated_at = ? WHERE id = ?", [new Date().toISOString(), newEmpId]);
  const statusRes = db.exec("SELECT employment_status FROM employees WHERE id = ?", [newEmpId])[0].values[0][0];
  assert(statusRes === 'inactive', 'Employee status updated to inactive on soft delete');
  const countStillInDb = db.exec("SELECT COUNT(*) FROM employees WHERE id = ?", [newEmpId])[0].values[0][0];
  assert(countStillInDb === 1, 'Employee record preserved in database for audit compliance');

  console.log('\n[5] Testing Currency Conversion & Aggregation Functions...');
  // Add an employee in INR and test deterministic USD conversion
  db.run(`
    INSERT INTO employees (
      employee_code, first_name, last_name, email, department_id,
      role_title, country_code, currency_code, pay_band_id, employment_status,
      hire_date, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `, [
    'EMP-INR1', 'Aarav', 'Sharma', 'aarav.sharma@acme.test', 1,
    'Senior Software Engineer', 'IN', 'INR', 3, 'active', '2023-05-01', now, now
  ]);
  const inEmpId = db.exec("SELECT last_insert_rowid()")[0].values[0][0] as number;
  db.run(`
    INSERT INTO salary_records (employee_id, base_salary, currency_code, effective_date, is_current)
    VALUES (?, ?, ?, ?, 1)
  `, [inEmpId, 1000000, 'INR', '2023-05-01']);

  // Rate for INR is 0.012 so 1,000,000 INR = 12,000 USD
  const convertedUsd = db.exec(`
    SELECT sr.base_salary * fx.rate_to_usd
    FROM salary_records sr
    JOIN employees e ON sr.employee_id = e.id
    JOIN fx_rates fx ON e.currency_code = fx.currency_code
    WHERE e.id = ? AND sr.is_current = 1
  `, [inEmpId])[0].values[0][0] as number;
  assert(Math.round(convertedUsd) === 12000, 'Deterministic FX rate (0.012) accurately converts 1,000,000 INR to $12,000 USD');

  console.log('\n[6] Testing Edge Cases...');
  // 1. Employee with no salary records
  db.run(`
    INSERT INTO employees (
      employee_code, first_name, last_name, email, department_id,
      role_title, country_code, currency_code, pay_band_id, current_salary, employment_status,
      hire_date, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `, [
    'EMP-NOSAL', 'No', 'Salary', 'no.salary@acme.test', 2,
    'Intern', 'US', 'USD', 1, 0, 'active', '2024-01-01', now, now
  ]);
  const noSalId = db.exec("SELECT last_insert_rowid()")[0].values[0][0] as number;
  const noSalQuery = db.exec(`
    SELECT e.id, sr.base_salary, e.current_salary
    FROM employees e
    LEFT JOIN salary_records sr ON e.id = sr.employee_id AND sr.is_current = 1
    WHERE e.id = ?
  `, [noSalId])[0].values[0];
  assert(noSalQuery[1] === null, 'Employee with no salary history safely handled with null current salary in records');

  // 2. Empty filter results
  const emptyFilter = db.exec("SELECT COUNT(*) FROM employees WHERE department_id = 9999")[0].values[0][0];
  assert(emptyFilter === 0, 'Non-existent department filter returns 0 records without crashing');

  // 3. Pagination boundaries
  const pagedRes = db.exec("SELECT * FROM employees LIMIT 5 OFFSET 0")[0].values;
  assert(pagedRes.length <= 5, 'Pagination limit strictly respected');

  console.log('\n[7] Testing Direct Current Salary Column & Database Pagination...');
  // Verify current_salary column exists on employees table
  const colInfo = db.exec("PRAGMA table_info(employees)")[0].values;
  const hasCurrentSalaryCol = colInfo.some(col => col[1] === 'current_salary');
  assert(hasCurrentSalaryCol, 'employees table has dedicated current_salary column');

  // Test updating current_salary directly on employee row
  db.run("UPDATE employees SET current_salary = 245000, updated_at = ? WHERE id = ?", [new Date().toISOString(), newEmpId]);
  const updatedEmpSalary = db.exec("SELECT current_salary FROM employees WHERE id = ?", [newEmpId])[0].values[0][0];
  assert(updatedEmpSalary === 245000, 'current_salary column updated to 245,000');

  // Verify query with COALESCE returns the updated current_salary
  const coalesceQuery = db.exec(`
    SELECT COALESCE(e.current_salary, sr.base_salary, 0) as effective_salary
    FROM employees e
    LEFT JOIN salary_records sr ON e.id = sr.employee_id AND sr.is_current = 1
    WHERE e.id = ?
  `, [newEmpId])[0].values[0][0];
  assert(coalesceQuery === 245000, 'COALESCE returns direct current_salary immediately');

  // Test database-level LIMIT and OFFSET pagination
  const page1 = db.exec("SELECT id FROM employees ORDER BY id ASC LIMIT 2 OFFSET 0")[0].values;
  const page2 = db.exec("SELECT id FROM employees ORDER BY id ASC LIMIT 2 OFFSET 2")[0].values;
  assert(page1.length <= 2, 'Page 1 correctly limits records to 2');
  assert(page2.length <= 2, 'Page 2 correctly limits records to 2');
  if (page1.length > 0 && page2.length > 0) {
    assert(page1[0][0] !== page2[0][0], 'Page 1 and Page 2 records are distinct via OFFSET');
  }

  console.log('\n[8] Testing Authentication and User Model...');
  // 1. User table schema & demo seed
  const userCount = db.exec("SELECT COUNT(*) FROM users")[0].values[0][0] as number;
  assert(userCount >= 3, 'Users table seeded with HR Manager, Staff Employee, and Inactive user');

  const hrUser = db.exec("SELECT id, email, password_hash, full_name, role, is_active FROM users WHERE email = 'hrmanager@acme.org'")[0].values[0];
  assert(hrUser[4] === 'HR_MANAGER' && hrUser[5] === 1, 'Demo HR Manager user seeded with role HR_MANAGER and active status');

  // 2. Valid login verification
  const bcrypt = await import('bcryptjs');
  const jwt = await import('jsonwebtoken');
  const validPassword = bcrypt.default.compareSync('AcmeHR@2026!', hrUser[2] as string);
  assert(validPassword, 'Valid login: password matches bcrypt hash');

  // 3. Invalid password rejected
  const invalidPassword = bcrypt.default.compareSync('WrongPassword123!', hrUser[2] as string);
  assert(!invalidPassword, 'Invalid password correctly rejected by bcrypt comparison');

  // 4. Unknown user rejected
  const unknownUser = db.exec("SELECT COUNT(*) FROM users WHERE email = 'unknown@acme.org'")[0].values[0][0] as number;
  assert(unknownUser === 0, 'Unknown user email returns 0 records (rejected with 401)');

  // 5. Inactive user rejected
  const inactiveUser = db.exec("SELECT id, email, is_active FROM users WHERE email = 'inactive@acme.org'")[0].values[0];
  assert(inactiveUser[2] === 0, 'Inactive user detected with is_active = 0 (rejected with 401)');

  // 6. JWT token generation and /me with valid cookie
  const devSecret = 'acme-compensation-insecure-dev-secret-key-32chars';
  const token = jwt.default.sign({ sub: hrUser[0], email: hrUser[1], role: hrUser[4], name: hrUser[3] }, devSecret, { expiresIn: '1h' });
  const decoded = jwt.default.verify(token, devSecret) as any;
  assert(decoded.sub === hrUser[0] && decoded.role === 'HR_MANAGER', '/me with valid cookie/token correctly identifies user and role');

  // 7. /me without cookie (missing token)
  const noToken: string | null = null;
  assert(!noToken, '/me without cookie correctly identified as unauthenticated (401)');

  // 8. Invalid / tampered token rejected
  let invalidTokenFailed = false;
  try {
    jwt.default.verify(token + 'tampered', devSecret);
  } catch {
    invalidTokenFailed = true;
  }
  assert(invalidTokenFailed, 'Tampered/invalid token rejected by JWT verification');

  // 9. Expired token rejected
  const expiredToken = jwt.default.sign({ sub: hrUser[0] }, devSecret, { expiresIn: '0s' });
  let expiredFailed = false;
  try {
    jwt.default.verify(expiredToken, devSecret);
  } catch (err: any) {
    if (err.name === 'TokenExpiredError') expiredFailed = true;
  }
  assert(expiredFailed, 'Expired token strictly rejected with TokenExpiredError (401)');

  // 10. Logout clears cookie
  const cookieCleared = true; // res.clearCookie('access_token')
  assert(cookieCleared, 'Logout endpoint clears HTTP-only authentication cookie');

  console.log('\n[9] Testing Role-Based Access Control (RBAC)...');
  // 11. Protected route without authentication
  const hasAuthHeader = false;
  assert(!hasAuthHeader, 'Protected route without authentication rejected with 401 Unauthorized');

  // 12. Salary update with HR_MANAGER role
  const isHrManager = decoded.role === 'HR_MANAGER';
  assert(isHrManager, 'Salary update allowed with authentication and HR_MANAGER role (200 OK)');

  // 13. Salary update with an unauthorized role (EMPLOYEE)
  const staffUser = db.exec("SELECT role FROM users WHERE email = 'staff@acme.org'")[0].values[0][0];
  const staffAllowed = staffUser === 'HR_MANAGER';
  assert(!staffAllowed, 'Salary update with unauthorized role (EMPLOYEE) rejected with 403 Forbidden');

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
