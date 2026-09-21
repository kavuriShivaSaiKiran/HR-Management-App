import initSqlJs, { Database } from 'sql.js';
import fs from 'fs';
import path from 'path';
import { generateCountryAlignedName } from './countryNames';

const DB_DIR = path.resolve(process.cwd(), 'data');
const DB_PATH = path.join(DB_DIR, 'salary_app.db');

export interface DbContext {
  db: Database;
  save: () => void;
}

let dbInstance: Database | null = null;

export async function getDb(): Promise<Database> {
  if (dbInstance) return dbInstance;

  if (!fs.existsSync(DB_DIR)) {
    fs.mkdirSync(DB_DIR, { recursive: true });
  }

  const SQL = await initSqlJs();

  if (fs.existsSync(DB_PATH)) {
    try {
      const fileBuffer = fs.readFileSync(DB_PATH);
      dbInstance = new SQL.Database(fileBuffer);
      // Ensure tables exist
      initializeSchema(dbInstance);
      return dbInstance;
    } catch (e) {
      console.error('Failed to load database from file, initializing fresh DB', e);
    }
  }

  dbInstance = new SQL.Database();
  initializeSchema(dbInstance);
  saveDatabase(dbInstance);
  return dbInstance;
}

export function saveDatabase(db: Database = dbInstance!): void {
  if (!db) return;
  try {
    if (!fs.existsSync(DB_DIR)) {
      fs.mkdirSync(DB_DIR, { recursive: true });
    }
    const data = db.export();
    const buffer = Buffer.from(data);
    fs.writeFileSync(DB_PATH, buffer);
  } catch (err) {
    console.error('Error saving database to disk:', err);
  }
}

export function initializeSchema(db: Database): void {
  db.run(`
    CREATE TABLE IF NOT EXISTS departments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE
    );

    CREATE TABLE IF NOT EXISTS pay_bands (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      min_salary REAL NOT NULL,
      max_salary REAL NOT NULL
    );

    CREATE TABLE IF NOT EXISTS fx_rates (
      currency_code TEXT PRIMARY KEY,
      rate_to_usd REAL NOT NULL
    );

    CREATE TABLE IF NOT EXISTS employees (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      employee_code TEXT NOT NULL UNIQUE,
      first_name TEXT NOT NULL,
      last_name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      department_id INTEGER NOT NULL REFERENCES departments(id),
      role_title TEXT NOT NULL,
      country_code TEXT NOT NULL,
      currency_code TEXT NOT NULL,
      pay_band_id INTEGER NOT NULL REFERENCES pay_bands(id),
      current_salary REAL DEFAULT 0,
      employment_status TEXT NOT NULL DEFAULT 'active',
      hire_date TEXT NOT NULL,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS salary_records (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      employee_id INTEGER NOT NULL REFERENCES employees(id),
      base_salary REAL NOT NULL,
      currency_code TEXT NOT NULL,
      effective_date TEXT NOT NULL,
      is_current INTEGER NOT NULL DEFAULT 1
    );

    CREATE TABLE IF NOT EXISTS activity_logs (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      subtitle TEXT NOT NULL,
      status TEXT,
      type TEXT NOT NULL,
      created_at TEXT NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_emp_dept ON employees(department_id);
    CREATE INDEX IF NOT EXISTS idx_emp_band ON employees(pay_band_id);
    CREATE INDEX IF NOT EXISTS idx_emp_country ON employees(country_code);
    CREATE INDEX IF NOT EXISTS idx_emp_status ON employees(employment_status);
    CREATE INDEX IF NOT EXISTS idx_emp_code ON employees(employee_code);
    CREATE INDEX IF NOT EXISTS idx_sal_emp ON salary_records(employee_id);
    CREATE INDEX IF NOT EXISTS idx_sal_curr ON salary_records(is_current);
  `);

  try {
    db.run("ALTER TABLE employees ADD COLUMN current_salary REAL DEFAULT 0;");
  } catch {
    // Column already exists
  }

  // Seed reference tables if empty
  const deptCount = db.exec("SELECT COUNT(*) as c FROM departments")[0]?.values[0][0] as number;
  if (!deptCount || deptCount === 0) {
    const depts = ['Engineering', 'Sales', 'Finance', 'Operations', 'Human Resources', 'Marketing'];
    for (const d of depts) {
      db.run("INSERT INTO departments (name) VALUES (?)", [d]);
    }
  }

  const bandCount = db.exec("SELECT COUNT(*) as c FROM pay_bands")[0]?.values[0][0] as number;
  if (!bandCount || bandCount === 0) {
    const bands = [
      { name: 'L1 - Associate', min: 40000, max: 65000 },
      { name: 'L2 - Junior', min: 60000, max: 95000 },
      { name: 'L3 - Mid-Level', min: 85000, max: 135000 },
      { name: 'L4 - Senior', min: 125000, max: 190000 },
      { name: 'L5 - Lead / Principal', min: 180000, max: 270000 },
    ];
    for (const b of bands) {
      db.run("INSERT INTO pay_bands (name, min_salary, max_salary) VALUES (?, ?, ?)", [b.name, b.min, b.max]);
    }
  }

  const fxCount = db.exec("SELECT COUNT(*) as c FROM fx_rates")[0]?.values[0][0] as number;
  if (!fxCount || fxCount === 0) {
    const fx = [
      { code: 'USD', rate: 1.0 },
      { code: 'EUR', rate: 1.08 },
      { code: 'GBP', rate: 1.28 },
      { code: 'INR', rate: 0.012 },
      { code: 'SGD', rate: 0.74 }
    ];
    for (const f of fx) {
      db.run("INSERT INTO fx_rates (currency_code, rate_to_usd) VALUES (?, ?)", [f.code, f.rate]);
    }
  }

  // Seed default activities if empty
  const actCount = db.exec("SELECT COUNT(*) as c FROM activity_logs")[0]?.values[0][0] as number;
  if (!actCount || actCount === 0) {
    const now = new Date();
    db.run(`INSERT INTO activity_logs (id, title, subtitle, status, type, created_at) VALUES 
      ('act-1', 'Bonus approval requested', 'by Olivia Brown', 'Pending', 'bonus', ?),
      ('act-2', 'Payroll approved', 'May 15, 2024 Payroll', 'Approved', 'payroll', ?),
      ('act-3', 'Tax report generated', 'Q2 2024 Tax Report', NULL, 'tax', ?),
      ('act-4', 'New employee added', 'James Wilson - Sales Executive', NULL, 'employee', ?),
      ('act-5', 'Payroll processing started', 'May 31, 2024 Payroll', 'Processing', 'payroll', ?)`,
      [
        new Date(now.getTime() - 10 * 60000).toISOString(),
        new Date(now.getTime() - 60 * 60000).toISOString(),
        new Date(now.getTime() - 180 * 60000).toISOString(),
        new Date(now.getTime() - 300 * 60000).toISOString(),
        new Date(now.getTime() - 1440 * 60000).toISOString()
      ]
    );
  }

  // Check if employees exist and conform to 2-country demo (US 69%, IN 31%). If not, reseed full dataset!
  const empCount = db.exec("SELECT COUNT(*) as c FROM employees")[0]?.values[0][0] as number;
  const nonUsInCount = db.exec("SELECT COUNT(*) FROM employees WHERE country_code NOT IN ('US', 'IN')")[0]?.values[0][0] as number;
  if (!empCount || empCount < 10000 || nonUsInCount > 0) {
    console.log(`Reseeding database with 2-country demo specification: 69% US & 31% India...`);
    seedEmployees(db, 10000, true);
  }
}

export function seedEmployees(db: Database, count: number = 10000, clearExisting: boolean = false): void {
  if (clearExisting) {
    db.run("DELETE FROM salary_records;");
    db.run("DELETE FROM employees;");
  }

  // Multi-country angle: Exactly 2 countries (US ~69%, India ~31%)
  const countryConfigs = [
    { country: 'US', currency: 'USD', rate: 1.0, weight: 0.69 },
    { country: 'IN', currency: 'INR', rate: 0.012, weight: 0.31 }
  ];

  const rolesByDept: Record<string, string[]> = {
    'Engineering': ['Software Engineer', 'Frontend Engineer', 'Backend Engineer', 'DevOps Engineer', 'QA Automation Engineer', 'Engineering Manager'],
    'Sales': ['Sales Executive', 'Account Executive', 'Business Development Rep', 'Sales Director', 'Customer Success Manager'],
    'Finance': ['Financial Analyst', 'Senior Accountant', 'Payroll Specialist', 'Controller', 'Finance Manager'],
    'Operations': ['Operations Analyst', 'Supply Chain Coordinator', 'Project Manager', 'Operations Director'],
    'Human Resources': ['HR Specialist', 'Technical Recruiter', 'HR Business Partner', 'Compensation & Benefits Lead'],
    'Marketing': ['Marketing Manager', 'Product Marketing Specialist', 'Content Strategist', 'Growth Marketer', 'Creative Director']
  };

  const departmentsRes = db.exec("SELECT id, name FROM departments");
  const deptList = departmentsRes[0].values.map(v => ({ id: v[0] as number, name: v[1] as string }));

  const bandsRes = db.exec("SELECT id, name, min_salary, max_salary FROM pay_bands");
  const bandList = bandsRes[0].values.map(v => ({
    id: v[0] as number,
    name: v[1] as string,
    min: v[2] as number,
    max: v[3] as number
  }));

  // Find existing max code
  const maxCodeRes = db.exec("SELECT MAX(id) FROM employees")[0]?.values[0][0];
  let startId = typeof maxCodeRes === 'number' ? maxCodeRes + 1 : 1;

  // Insert in chunks with transaction for maximum speed
  db.run("BEGIN TRANSACTION;");

  const empStmt = db.prepare(`
    INSERT INTO employees (
      employee_code, first_name, last_name, email, department_id,
      role_title, country_code, currency_code, pay_band_id, current_salary,
      employment_status, hire_date, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const salStmt = db.prepare(`
    INSERT INTO salary_records (
      employee_id, base_salary, currency_code, effective_date, is_current
    ) VALUES (?, ?, ?, ?, ?)
  `);

  // Showcase employees authentically representing our US and India hubs
  const showcaseEmployees = [
    {
      code: 'EMP-00001',
      first: 'Emma',
      last: 'Johnson',
      email: 'emma.johnson@demo.com',
      deptName: 'Marketing',
      role: 'Marketing Manager',
      country: 'US',
      currency: 'USD',
      rate: 1.0,
      bandIdx: 3,
      salary: 108000,
      status: 'active',
      hireDate: '2021-03-15'
    },
    {
      code: 'EMP-00002',
      first: 'Aarav',
      last: 'Sharma',
      email: 'employee@demo.com', // Demo employee login persona
      deptName: 'Engineering',
      role: 'Software Engineer',
      country: 'IN',
      currency: 'INR',
      rate: 0.012,
      bandIdx: 2,
      salary: 2800000, // ~33,600 USD (or competitive INR tech salary)
      status: 'active',
      hireDate: '2022-06-10'
    },
    {
      code: 'EMP-00003',
      first: 'Michael',
      last: 'Miller',
      email: 'michael.miller@demo.com',
      deptName: 'Engineering',
      role: 'Engineering Manager',
      country: 'US',
      currency: 'USD',
      rate: 1.0,
      bandIdx: 4,
      salary: 165000,
      status: 'active',
      hireDate: '2020-09-01'
    },
    {
      code: 'EMP-00004',
      first: 'Priya',
      last: 'Patel',
      email: 'priya.patel@demo.com',
      deptName: 'Finance',
      role: 'Financial Analyst',
      country: 'IN',
      currency: 'INR',
      rate: 0.012,
      bandIdx: 1,
      salary: 1850000,
      status: 'active',
      hireDate: '2023-01-20'
    },
    {
      code: 'EMP-00005',
      first: 'Sarah',
      last: 'Davis',
      email: 'sarah.davis@demo.com',
      deptName: 'Human Resources',
      role: 'Compensation & Benefits Lead',
      country: 'US',
      currency: 'USD',
      rate: 1.0,
      bandIdx: 3,
      salary: 115000,
      status: 'active',
      hireDate: '2022-04-12'
    },
    {
      code: 'EMP-00006',
      first: 'Rohan',
      last: 'Verma',
      email: 'rohan.verma@demo.com',
      deptName: 'Engineering',
      role: 'Backend Engineer',
      country: 'IN',
      currency: 'INR',
      rate: 0.012,
      bandIdx: 2,
      salary: 2400000,
      status: 'active',
      hireDate: '2023-02-15'
    },
    {
      code: 'EMP-00007',
      first: 'David',
      last: 'Wilson',
      email: 'david.wilson@demo.com',
      deptName: 'Operations',
      role: 'DevOps Engineer',
      country: 'US',
      currency: 'USD',
      rate: 1.0,
      bandIdx: 3,
      salary: 128000,
      status: 'active',
      hireDate: '2021-11-01'
    },
    {
      code: 'EMP-00008',
      first: 'Ananya',
      last: 'Sen',
      email: 'ananya.sen@demo.com',
      deptName: 'Engineering',
      role: 'Frontend Engineer',
      country: 'IN',
      currency: 'INR',
      rate: 0.012,
      bandIdx: 2,
      salary: 2100000,
      status: 'active',
      hireDate: '2022-08-15'
    },
    {
      code: 'EMP-00009',
      first: 'Jessica',
      last: 'Taylor',
      email: 'jessica.taylor@demo.com',
      deptName: 'Finance',
      role: 'Controller',
      country: 'US',
      currency: 'USD',
      rate: 1.0,
      bandIdx: 4,
      salary: 142000,
      status: 'active',
      hireDate: '2019-05-10'
    },
    {
      code: 'EMP-00010',
      first: 'Vikram',
      last: 'Malhotra',
      email: 'vikram.malhotra@demo.com',
      deptName: 'Operations',
      role: 'Operations Director',
      country: 'IN',
      currency: 'INR',
      rate: 0.012,
      bandIdx: 4,
      salary: 3400000,
      status: 'active',
      hireDate: '2020-07-01'
    }
  ];

  const now = new Date().toISOString();

  // If this is starting from scratch, insert showcase employees first
  let countToGenerate = count;
  if (startId === 1) {
    for (const sc of showcaseEmployees) {
      const dept = deptList.find(d => d.name === sc.deptName) || deptList[0];
      const band = bandList[sc.bandIdx] || bandList[1];
      empStmt.run([
        sc.code,
        sc.first,
        sc.last,
        sc.email,
        dept.id,
        sc.role,
        sc.country,
        sc.currency,
        band.id,
        sc.salary,
        sc.status,
        sc.hireDate,
        now,
        now
      ]);

      const empIdRes = db.exec("SELECT last_insert_rowid()")[0].values[0][0] as number;
      
      // Add a past salary record then current salary record to show history!
      salStmt.run([empIdRes, Math.round(sc.salary * 0.9), sc.currency, sc.hireDate, 0]);
      salStmt.run([empIdRes, sc.salary, sc.currency, '2024-01-01', 1]);
    }
    countToGenerate -= showcaseEmployees.length;
    startId += showcaseEmployees.length;
  }

  // Generate remaining employees up to count: exactly 31% India and 69% US
  for (let i = 0; i < countToGenerate; i++) {
    const currentId = startId + i;
    const empCode = `EMP-${currentId.toString().padStart(5, '0')}`;

    // 31% India, 69% US
    const distRoll = Math.random();
    const cConf = distRoll < 0.31 ? countryConfigs[0] : countryConfigs[1];

    // Generate authentic, localized names strictly aligned with employee country
    const { firstName, lastName, email } = generateCountryAlignedName(cConf.country, currentId);
    
    // Distribute across departments
    const dept = deptList[i % deptList.length];
    const roles = rolesByDept[dept.name] || ['Specialist', 'Manager', 'Coordinator'];
    const roleTitle = roles[Math.floor(Math.random() * roles.length)];
    
    // Distribute across pay bands with realistic variance
    // L1: 25%, L2: 30%, L3: 25%, L4: 15%, L5: 5%
    const rand = Math.random();
    let bandIdx = 0;
    if (rand < 0.25) bandIdx = 0;
    else if (rand < 0.55) bandIdx = 1;
    else if (rand < 0.80) bandIdx = 2;
    else if (rand < 0.95) bandIdx = 3;
    else bandIdx = 4;

    const band = bandList[bandIdx] || bandList[1];

    // Status: active
    const status = 'active';
    
    // Hire date between 2018 and 2024
    const hireYear = 2018 + Math.floor(Math.random() * 6);
    const hireMonth = (1 + Math.floor(Math.random() * 12)).toString().padStart(2, '0');
    const hireDay = (1 + Math.floor(Math.random() * 28)).toString().padStart(2, '0');
    const hireDate = `${hireYear}-${hireMonth}-${hireDay}`;

    // Calculate base salary in local currency based on USD band range
    const bandSpread = band.max - band.min;
    const baseUsd = band.min + (Math.random() * 0.9 + 0.05) * bandSpread;
    
    // Convert to local currency deterministically
    const localSalary = Math.round(baseUsd / cConf.rate);

    empStmt.run([
      empCode,
      firstName,
      lastName,
      email,
      dept.id,
      roleTitle,
      cConf.country,
      cConf.currency,
      band.id,
      localSalary,
      status,
      hireDate,
      now,
      now
    ]);

    const empIdRes = db.exec("SELECT last_insert_rowid()")[0].values[0][0] as number;

    // Past salary history
    const hasHistory = Math.random() < 0.4 && hireYear <= 2022;
    if (hasHistory) {
      const pastSalary = Math.round(localSalary * (0.85 + Math.random() * 0.08));
      salStmt.run([empIdRes, pastSalary, cConf.currency, hireDate, 0]);
      salStmt.run([empIdRes, localSalary, cConf.currency, `${hireYear + 1}-04-01`, 1]);
    } else {
      salStmt.run([empIdRes, localSalary, cConf.currency, hireDate, 1]);
    }
  }

  empStmt.free();
  salStmt.free();

  db.run("COMMIT;");
  saveDatabase(db);
}
