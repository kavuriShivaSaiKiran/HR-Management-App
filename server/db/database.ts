import initSqlJs, { Database } from 'sql.js';
import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
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
      is_current INTEGER NOT NULL DEFAULT 1,
      previous_salary REAL DEFAULT 0,
      reason TEXT DEFAULT 'Annual review',
      comment TEXT DEFAULT '',
      changed_by TEXT DEFAULT 'HR Manager',
      created_at TEXT
    );

    CREATE TABLE IF NOT EXISTS activity_logs (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      subtitle TEXT NOT NULL,
      status TEXT,
      type TEXT NOT NULL,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      full_name TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'HR_MANAGER',
      is_active INTEGER NOT NULL DEFAULT 1,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      last_login_at TEXT
    );

    CREATE INDEX IF NOT EXISTS idx_user_email ON users(email);
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

  try {
    db.run("ALTER TABLE salary_records ADD COLUMN previous_salary REAL DEFAULT 0;");
  } catch {}
  try {
    db.run("ALTER TABLE salary_records ADD COLUMN reason TEXT DEFAULT 'Annual review';");
  } catch {}
  try {
    db.run("ALTER TABLE salary_records ADD COLUMN comment TEXT DEFAULT '';");
  } catch {}
  try {
    db.run("ALTER TABLE salary_records ADD COLUMN changed_by TEXT DEFAULT 'HR Manager';");
  } catch {}
  try {
    db.run("ALTER TABLE salary_records ADD COLUMN created_at TEXT;");
  } catch {}

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

  // Seed default demo users if not present
  try {
    const userCheck = db.exec("SELECT COUNT(*) as c FROM users WHERE email = 'hrmanager@acme.org'")[0]?.values[0][0] as number;
    if (!userCheck || userCheck === 0) {
      const now = new Date().toISOString();
      const hrHash = bcrypt.hashSync('AcmeHR@2026!', 10);
      db.run(
        `INSERT INTO users (email, password_hash, full_name, role, is_active, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        ['hrmanager@acme.org', hrHash, 'ACME HR Manager', 'HR_MANAGER', 1, now, now]
      );

      // Seed non-HR employee user for testing 403 authorization
      const empHash = bcrypt.hashSync('Staff@2026!', 10);
      db.run(
        `INSERT INTO users (email, password_hash, full_name, role, is_active, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        ['staff@acme.org', empHash, 'Staff Member', 'EMPLOYEE', 1, now, now]
      );

      // Seed inactive user for testing 401 inactive validation
      const inactiveHash = bcrypt.hashSync('Inactive@2026!', 10);
      db.run(
        `INSERT INTO users (email, password_hash, full_name, role, is_active, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        ['inactive@acme.org', inactiveHash, 'Inactive HR', 'HR_MANAGER', 0, now, now]
      );
    }
  } catch (err) {
    console.error('Error seeding users:', err);
  }

  // Check if employees exist and conform to realistic enterprise distributions
  const inCount = db.exec("SELECT COUNT(*) FROM employees WHERE country_code = 'IN'")[0]?.values[0][0] as number || 0;
  const usCount = db.exec("SELECT COUNT(*) FROM employees WHERE country_code = 'US'")[0]?.values[0][0] as number || 0;
  const total = inCount + usCount;
  const engCount = db.exec("SELECT COUNT(*) FROM employees WHERE department_id = (SELECT id FROM departments WHERE name = 'Engineering')")[0]?.values[0][0] as number || 0;
  
  // Reseed if count < 10000 or if still using the old equal 16.7% synthetic department distribution (engCount < 3000)
  if (!total || total < 10000 || engCount < 3000 || (inCount / total) < 0.64 || (inCount / total) > 0.74) {
    console.log(`Reseeding database with realistic enterprise distribution (38% Engineering, 26% Operations, 16% Sales, 7% Finance, 7% Marketing, 6% HR)...`);
    seedEmployees(db, 10000, true);
  }

  // Ensure historical salary revision data exists for analysis periods
  ensurePeriodSalaryData(db);
}

export function ensurePeriodSalaryData(db: Database): void {
  try {
    const countRes = db.exec("SELECT COUNT(*) FROM salary_records WHERE previous_salary > 0 AND effective_date >= '2025-10-01'")[0]?.values[0][0] as number || 0;
    if (countRes >= 3000) {
      return;
    }

    const empRes = db.exec("SELECT id, current_salary, currency_code, hire_date, country_code, department_id FROM employees WHERE employment_status = 'active' ORDER BY id ASC");
    if (!empRes.length || !empRes[0].values.length) return;

    const employees = empRes[0].values;
    const approvers = ['HR Compensation Committee', 'VP People & Culture', 'Head of Total Rewards', 'Executive Review Board', 'Chief Financial Officer'];

    // Weighted enterprise review schedule across Q4 2025 - Q3 2026:
    // Q1 (Jan-Mar) is the primary annual review season (~45% volume), followed by Q2 promotions, Q3 parity, Q4 adjustments
    const reviewSchedule = [
      // Q4 2025 (~15% of annual cycle)
      { date: '2025-10-15', cycle: 'Q4 2025 Merit Cycle', weight: 3 },
      { date: '2025-11-01', cycle: 'Q4 2025 Off-Cycle Review', weight: 3 },
      { date: '2025-11-15', cycle: 'Q4 2025 Promotion Round', weight: 3 },
      { date: '2025-12-10', cycle: 'Q4 2025 Year-End Merit', weight: 4 },
      // Q1 2026 (~45% of annual cycle - primary corporate review season)
      { date: '2026-01-15', cycle: 'Q1 2026 Annual Compensation Review', weight: 10 },
      { date: '2026-01-28', cycle: 'Q1 2026 Market Equity Adjustment', weight: 8 },
      { date: '2026-02-14', cycle: 'Q1 2026 Mid-Cycle Promotion', weight: 8 },
      { date: '2026-03-01', cycle: 'Q1 2026 Performance Review', weight: 10 },
      { date: '2026-03-15', cycle: 'Q1 2026 Merit Adjustment', weight: 8 },
      // Q2 2026 (~25% of annual cycle - spring promotions and parity)
      { date: '2026-04-01', cycle: 'Q2 2026 Spring Review Cycle', weight: 6 },
      { date: '2026-04-15', cycle: 'Q2 2026 Promotion Round', weight: 6 },
      { date: '2026-05-10', cycle: 'Q2 2026 Market Parity Review', weight: 5 },
      { date: '2026-06-01', cycle: 'Q2 2026 Mid-Year Compensation Review', weight: 5 },
      { date: '2026-06-15', cycle: 'Q2 2026 Leadership Adjustment', weight: 4 },
      // Q3 2026 (~15% of annual cycle)
      { date: '2026-07-01', cycle: 'Q3 2026 Summer Review Cycle', weight: 4 },
      { date: '2026-07-15', cycle: 'Q3 2026 Technical Ladder Promotion', weight: 4 },
      { date: '2026-08-01', cycle: 'Q3 2026 Compensation Parity', weight: 3 },
      { date: '2026-08-15', cycle: 'Q3 2026 Market Benchmark Adjustment', weight: 4 },
      { date: '2026-09-01', cycle: 'Q3 2026 Fall Promotion Round', weight: 4 },
      { date: '2026-09-15', cycle: 'Q3 2026 Annual Merit Cycle', weight: 5 },
      { date: '2026-09-21', cycle: 'Q3 2026 Executive Review', weight: 3 }
    ];

    // Build flattened weighted schedule
    const schedulePool: typeof reviewSchedule = [];
    for (const item of reviewSchedule) {
      for (let w = 0; w < item.weight; w++) {
        schedulePool.push(item);
      }
    }

    db.run("BEGIN TRANSACTION;");

    // Realistic annual review coverage: ~52% of total employees (approx 5,200 annual reviews)
    const targetCount = Math.min(5250, Math.floor(employees.length * 0.525));
    for (let i = 0; i < targetCount; i++) {
      const emp = employees[i];
      const empId = emp[0] as number;
      const currentSalary = Number(emp[1]) || 50000;
      const currency = emp[2] as string;
      const hireDate = (emp[3] as string) || '2021-01-01';

      const scheduleItem = schedulePool[i % schedulePool.length];
      const effDate = scheduleItem.date;
      if (effDate < hireDate) continue;

      // Realistic percentage adjustment based on review type:
      // ~60% merit reviews (4% to 8%), ~20% promotions (10% to 18%), ~15% market adjustments (6% to 12%), ~5% performance revisions (5% to 10%)
      const mod = i % 20;
      let reason = 'Annual review';
      let increasePct = 0.055; // 5.5% baseline merit

      if (mod < 12) {
        reason = 'Annual review';
        increasePct = 0.038 + (i % 7) * 0.007; // 3.8% to 8.0%
      } else if (mod < 16) {
        reason = 'Promotion';
        increasePct = 0.10 + (i % 5) * 0.018; // 10.0% to 17.2%
      } else if (mod < 19) {
        reason = 'Market adjustment';
        increasePct = 0.065 + (i % 4) * 0.014; // 6.5% to 10.7%
      } else {
        reason = 'Performance revision';
        increasePct = 0.05 + (i % 4) * 0.012; // 5.0% to 8.6%
      }

      // Calculate clean, realistic previous base salary
      const previousSalary = currency === 'INR'
        ? Math.round((currentSalary / (1 + increasePct)) / 10000) * 10000
        : Math.round((currentSalary / (1 + increasePct)) / 500) * 500;

      if (previousSalary >= currentSalary) continue;

      const changedBy = approvers[i % approvers.length];
      const comment = `${reason} approved in ${scheduleItem.cycle}`;

      db.run("UPDATE salary_records SET is_current = 0 WHERE employee_id = ?", [empId]);

      const prevDate = '2025-01-01' < hireDate ? hireDate : '2025-01-01';
      db.run(`
        INSERT INTO salary_records (
          employee_id, base_salary, previous_salary, currency_code, effective_date, is_current, reason, comment, changed_by, created_at
        ) VALUES (?, ?, ?, ?, ?, 0, 'Previous base compensation', 'Base compensation tier prior to review cycle', ?, ?)
      `, [empId, previousSalary, 0, currency, prevDate, changedBy, `${prevDate}T09:00:00Z`]);

      db.run(`
        INSERT INTO salary_records (
          employee_id, base_salary, previous_salary, currency_code, effective_date, is_current, reason, comment, changed_by, created_at
        ) VALUES (?, ?, ?, ?, ?, 1, ?, ?, ?, ?)
      `, [empId, currentSalary, previousSalary, currency, effDate, reason, comment, changedBy, `${effDate}T10:00:00Z`]);
    }

    db.run("COMMIT;");
    saveDatabase(db);
  } catch (err) {
    try { db.run("ROLLBACK;"); } catch {}
    console.error("Error in ensurePeriodSalaryData:", err);
  }
}

export function seedEmployees(db: Database, count: number = 10000, clearExisting: boolean = false): void {
  if (clearExisting) {
    db.run("DELETE FROM salary_records;");
    db.run("DELETE FROM employees;");
  }

  // Realistic Enterprise Department Proportions:
  // - Engineering: 38% (3,800 staff) - Core software, data, cloud, architecture
  // - Operations: 26% (2,600 staff) - 24/7 global delivery, client support, operations
  // - Sales: 16% (1,600 staff) - Global commercial accounts, BDR, customer success
  // - Finance: 7% (700 staff) - Corporate accounting, FP&A, treasury, payroll
  // - Marketing: 7% (700 staff) - Product marketing, demand gen, brand, digital
  // - Human Resources: 6% (600 staff) - Talent acquisition, people partners, comp & benefits
  const departmentConfig: Record<string, {
    share: number;
    indiaRatio: number;
    rolesByBand: {
      L1: string[];
      L2: string[];
      L3: string[];
      L4: string[];
      L5: string[];
    };
    bandWeights: number[]; // L1, L2, L3, L4, L5
    usSalaries: { min: number; max: number }[];
    inSalaries: { min: number; max: number }[];
  }> = {
    'Engineering': {
      share: 0.38,
      indiaRatio: 0.70, // 70% India Tech Capability Center, 30% US HQ/Architecture
      rolesByBand: {
        L1: ['Associate Software Engineer', 'Junior QA Analyst', 'Associate Cloud Specialist'],
        L2: ['Software Engineer', 'Frontend Engineer', 'QA Automation Engineer'],
        L3: ['Senior Software Engineer', 'Fullstack Engineer', 'DevOps Engineer', 'Backend Engineer'],
        L4: ['Lead Software Engineer', 'Staff Software Engineer', 'Engineering Manager', 'Cloud Architect'],
        L5: ['Principal Architect', 'Director of Engineering', 'Distinguished Engineer']
      },
      bandWeights: [0.12, 0.28, 0.35, 0.18, 0.07],
      usSalaries: [
        { min: 66000, max: 82000 },    // L1 (avg $74k)
        { min: 88000, max: 122000 },   // L2 (avg $105k)
        { min: 126000, max: 168000 },  // L3 (avg $147k)
        { min: 172000, max: 228000 },  // L4 (avg $200k)
        { min: 230000, max: 310000 },  // L5 (avg $270k)
      ],
      inSalaries: [
        { min: 650000, max: 1050000 },   // L1 (avg ₹850k ≈ $10.2k)
        { min: 110000, max: 1900000 },   // L2 (avg ₹1.5M ≈ $18k)
        { min: 2000000, max: 3400000 },  // L3 (avg ₹2.7M ≈ $32.4k)
        { min: 3600000, max: 5600000 },  // L4 (avg ₹4.6M ≈ $55.2k)
        { min: 5800000, max: 9500000 },  // L5 (avg ₹7.5M ≈ $90k)
      ]
    },
    'Sales': {
      share: 0.16,
      indiaRatio: 0.45, // 55% US client markets, 45% India inside sales & accounts
      rolesByBand: {
        L1: ['Sales Development Rep', 'Business Development Associate'],
        L2: ['Inside Sales Rep', 'Account Specialist', 'Sales Operations Analyst'],
        L3: ['Account Executive', 'Customer Success Manager', 'Regional Sales Specialist'],
        L4: ['Senior Account Executive', 'Enterprise Account Executive', 'Sales Manager'],
        L5: ['Sales Director', 'VP Commercial Sales']
      },
      bandWeights: [0.18, 0.32, 0.30, 0.15, 0.05],
      usSalaries: [
        { min: 56000, max: 72000 },    // L1 (avg $64k)
        { min: 74000, max: 105000 },   // L2 (avg $89k)
        { min: 108000, max: 152000 },  // L3 (avg $130k)
        { min: 156000, max: 215000 },  // L4 (avg $185k)
        { min: 215000, max: 295000 },  // L5 (avg $255k)
      ],
      inSalaries: [
        { min: 520000, max: 840000 },    // L1 (avg ₹680k ≈ $8.2k)
        { min: 880000, max: 1500000 },   // L2 (avg ₹1.2M ≈ $14.4k)
        { min: 1600000, max: 2700000 },  // L3 (avg ₹2.15M ≈ $25.8k)
        { min: 2800000, max: 4400000 },  // L4 (avg ₹3.6M ≈ $43.2k)
        { min: 4600000, max: 7400000 },  // L5 (avg ₹6.0M ≈ $72k)
      ]
    },
    'Operations': {
      share: 0.26,
      indiaRatio: 0.80, // 80% India global operations & delivery center, 20% US
      rolesByBand: {
        L1: ['Operations Associate', 'Customer Support Associate', 'Data Operations Specialist'],
        L2: ['Customer Support Specialist', 'Operations Analyst', 'Logistics Coordinator'],
        L3: ['Senior Operations Analyst', 'Service Delivery Lead', 'Project Coordinator'],
        L4: ['Operations Project Manager', 'Supply Chain Manager', 'Service Delivery Manager'],
        L5: ['Director of Global Operations', 'Head of Service Delivery']
      },
      bandWeights: [0.30, 0.40, 0.20, 0.08, 0.02],
      usSalaries: [
        { min: 48000, max: 62000 },    // L1 (avg $55k)
        { min: 64000, max: 84000 },    // L2 (avg $74k)
        { min: 86000, max: 118000 },   // L3 (avg $102k)
        { min: 120000, max: 158000 },  // L4 (avg $139k)
        { min: 165000, max: 225000 },  // L5 (avg $195k)
      ],
      inSalaries: [
        { min: 420000, max: 680000 },    // L1 (avg ₹550k ≈ $6.6k)
        { min: 700000, max: 1150000 },   // L2 (avg ₹920k ≈ $11.0k)
        { min: 1200000, max: 1950000 },  // L3 (avg ₹1.58M ≈ $19.0k)
        { min: 2050000, max: 3250000 },  // L4 (avg ₹2.65M ≈ $31.8k)
        { min: 3400000, max: 5400000 },  // L5 (avg ₹4.3M ≈ $51.6k)
      ]
    },
    'Finance': {
      share: 0.07,
      indiaRatio: 0.65, // 65% India shared services, 35% US controllership & FP&A
      rolesByBand: {
        L1: ['Junior Accountant', 'Billing Specialist'],
        L2: ['Staff Accountant', 'Financial Analyst', 'Payroll Operations Specialist'],
        L3: ['Senior Financial Analyst', 'Senior Accountant', 'Corporate Treasury Analyst'],
        L4: ['FP&A Manager', 'Senior Tax Manager', 'Assistant Controller'],
        L5: ['Corporate Controller', 'Director of Finance']
      },
      bandWeights: [0.15, 0.35, 0.30, 0.15, 0.05],
      usSalaries: [
        { min: 55000, max: 70000 },    // L1 (avg $62k)
        { min: 72000, max: 96000 },    // L2 (avg $84k)
        { min: 100000, max: 138000 },  // L3 (avg $119k)
        { min: 142000, max: 188000 },  // L4 (avg $165k)
        { min: 195000, max: 270000 },  // L5 (avg $230k)
      ],
      inSalaries: [
        { min: 500000, max: 800000 },    // L1 (avg ₹650k ≈ $7.8k)
        { min: 820000, max: 1400000 },   // L2 (avg ₹1.1M ≈ $13.2k)
        { min: 1480000, max: 2500000 },  // L3 (avg ₹1.98M ≈ $23.8k)
        { min: 2650000, max: 4200000 },  // L4 (avg ₹3.4M ≈ $40.8k)
        { min: 4400000, max: 7000000 },  // L5 (avg ₹5.6M ≈ $67.2k)
      ]
    },
    'Marketing': {
      share: 0.07,
      indiaRatio: 0.50, // 50% US, 50% India
      rolesByBand: {
        L1: ['Marketing Coordinator', 'Social Media Associate'],
        L2: ['Digital Marketing Specialist', 'Content Creator', 'Event Specialist'],
        L3: ['Product Marketing Manager', 'Content Strategist', 'Growth Marketing Specialist'],
        L4: ['Senior Product Marketing Manager', 'Growth Marketing Lead', 'Creative Lead'],
        L5: ['VP Marketing', 'Global Brand Director']
      },
      bandWeights: [0.18, 0.34, 0.30, 0.14, 0.04],
      usSalaries: [
        { min: 52000, max: 68000 },    // L1 (avg $60k)
        { min: 70000, max: 94000 },    // L2 (avg $82k)
        { min: 98000, max: 134000 },   // L3 (avg $116k)
        { min: 138000, max: 182000 },  // L4 (avg $160k)
        { min: 185000, max: 255000 },  // L5 (avg $220k)
      ],
      inSalaries: [
        { min: 480000, max: 760000 },    // L1 (avg ₹620k ≈ $7.4k)
        { min: 780000, max: 1340000 },   // L2 (avg ₹1.05M ≈ $12.6k)
        { min: 1420000, max: 2400000 },  // L3 (avg ₹1.88M ≈ $22.6k)
        { min: 2500000, max: 3900000 },  // L4 (avg ₹3.15M ≈ $37.8k)
        { min: 4100000, max: 6600000 },  // L5 (avg ₹5.25M ≈ $63.0k)
      ]
    },
    'Human Resources': {
      share: 0.06,
      indiaRatio: 0.70, // 70% India, 30% US
      rolesByBand: {
        L1: ['HR Coordinator', 'Recruiting Coordinator'],
        L2: ['Talent Acquisition Specialist', 'HR Generalist', 'People Operations Analyst'],
        L3: ['Technical Recruiter', 'Senior HR Generalist', 'Comp & Benefits Analyst'],
        L4: ['Senior HR Business Partner', 'Compensation & Benefits Lead', 'Talent Acquisition Lead'],
        L5: ['VP People & Culture', 'Head of Human Resources']
      },
      bandWeights: [0.20, 0.35, 0.28, 0.13, 0.04],
      usSalaries: [
        { min: 52000, max: 68000 },    // L1 (avg $60k)
        { min: 70000, max: 94000 },    // L2 (avg $82k)
        { min: 96000, max: 132000 },   // L3 (avg $114k)
        { min: 136000, max: 178000 },  // L4 (avg $157k)
        { min: 182000, max: 250000 },  // L5 (avg $215k)
      ],
      inSalaries: [
        { min: 460000, max: 740000 },    // L1 (avg ₹600k ≈ $7.2k)
        { min: 760000, max: 1300000 },   // L2 (avg ₹1.02M ≈ $12.2k)
        { min: 1350000, max: 2300000 },  // L3 (avg ₹1.8M ≈ $21.6k)
        { min: 2400000, max: 3750000 },  // L4 (avg ₹3.05M ≈ $36.6k)
        { min: 3900000, max: 6400000 },  // L5 (avg ₹5.1M ≈ $61.2k)
      ]
    }
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

  db.run("BEGIN TRANSACTION;");

  const empStmt = db.prepare(`
    INSERT INTO employees (
      id, employee_code, first_name, last_name, email, department_id,
      role_title, country_code, currency_code, pay_band_id, current_salary,
      employment_status, hire_date, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const salStmt = db.prepare(`
    INSERT INTO salary_records (
      employee_id, base_salary, previous_salary, currency_code, effective_date, is_current, reason, comment, changed_by, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  // Showcase employees authentically representing our US and India hubs
  const showcaseEmployees = [
    {
      code: 'EMP-00001',
      first: 'Emma',
      last: 'Johnson',
      email: 'emma.johnson@demo.com',
      deptName: 'Marketing',
      role: 'Senior Product Marketing Manager',
      country: 'US',
      currency: 'USD',
      bandIdx: 3, // L4
      salary: 154000,
      status: 'active',
      hireDate: '2021-03-15'
    },
    {
      code: 'EMP-00002',
      first: 'Aarav',
      last: 'Sharma',
      email: 'employee@demo.com', // Demo employee login persona
      deptName: 'Engineering',
      role: 'Senior Software Engineer',
      country: 'IN',
      currency: 'INR',
      bandIdx: 2, // L3
      salary: 2600000, // ~31,200 USD
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
      bandIdx: 3, // L4
      salary: 195000,
      status: 'active',
      hireDate: '2020-09-01'
    },
    {
      code: 'EMP-00004',
      first: 'Priya',
      last: 'Patel',
      email: 'priya.patel@demo.com',
      deptName: 'Finance',
      role: 'Staff Accountant',
      country: 'IN',
      currency: 'INR',
      bandIdx: 1, // L2
      salary: 1100000, // ~13,200 USD
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
      bandIdx: 3, // L4
      salary: 152000,
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
      bandIdx: 2, // L3
      salary: 2400000, // ~28,800 USD
      status: 'active',
      hireDate: '2023-02-15'
    },
    {
      code: 'EMP-00007',
      first: 'David',
      last: 'Wilson',
      email: 'david.wilson@demo.com',
      deptName: 'Engineering',
      role: 'DevOps Engineer',
      country: 'US',
      currency: 'USD',
      bandIdx: 2, // L3
      salary: 145000,
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
      bandIdx: 1, // L2
      salary: 1500000, // ~18,000 USD
      status: 'active',
      hireDate: '2022-08-15'
    },
    {
      code: 'EMP-00009',
      first: 'Jessica',
      last: 'Taylor',
      email: 'jessica.taylor@demo.com',
      deptName: 'Finance',
      role: 'Corporate Controller',
      country: 'US',
      currency: 'USD',
      bandIdx: 4, // L5
      salary: 235000,
      status: 'active',
      hireDate: '2019-05-10'
    },
    {
      code: 'EMP-00010',
      first: 'Vikram',
      last: 'Malhotra',
      email: 'vikram.malhotra@demo.com',
      deptName: 'Operations',
      role: 'Director of Global Operations',
      country: 'IN',
      currency: 'INR',
      bandIdx: 4, // L5
      salary: 4800000, // ~57,600 USD
      status: 'active',
      hireDate: '2020-07-01'
    }
  ];

  const now = new Date().toISOString();

  let countToGenerate = count;
  if (startId === 1) {
    for (let idx = 0; idx < showcaseEmployees.length; idx++) {
      const sc = showcaseEmployees[idx];
      const scId = startId + idx;
      const dept = deptList.find(d => d.name === sc.deptName) || deptList[0];
      const band = bandList[sc.bandIdx] || bandList[1];
      empStmt.run([
        scId,
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

      salStmt.run([
        scId,
        Math.round(sc.salary * 0.92),
        Math.round(sc.salary * 0.84),
        sc.currency,
        sc.hireDate,
        0,
        'Initial base',
        'Initial offer compensation',
        'HR Compensation Committee',
        `${sc.hireDate}T10:00:00Z`
      ]);
      salStmt.run([
        scId,
        sc.salary,
        Math.round(sc.salary * 0.92),
        sc.currency,
        '2026-09-15',
        1,
        sc.code === 'EMP-00002' ? 'Promotion' : (sc.code === 'EMP-00003' ? 'Market adjustment' : 'Annual review'),
        sc.code === 'EMP-00002' ? 'Promoted to Senior Software Engineer' : 'Approved in FY26 compensation cycle',
        'HR Compensation Committee',
        '2026-09-15T14:30:00Z'
      ]);
    }
    countToGenerate -= showcaseEmployees.length;
    startId += showcaseEmployees.length;
  }

  // Pre-calculate cumulative department thresholds
  const deptEntries = Object.entries(departmentConfig);
  const deptCumulative: { name: string; threshold: number; conf: typeof departmentConfig[string] }[] = [];
  let cum = 0;
  for (const [dName, conf] of deptEntries) {
    cum += conf.share;
    deptCumulative.push({ name: dName, threshold: cum, conf });
  }

  for (let i = 0; i < countToGenerate; i++) {
    const currentId = startId + i;
    const empCode = `EMP-${currentId.toString().padStart(5, '0')}`;

    // Select department according to realistic corporate distribution
    const deptRand = Math.random();
    const selectedDeptEntry = deptCumulative.find(d => deptRand <= d.threshold) || deptCumulative[0];
    const deptObj = deptList.find(d => d.name === selectedDeptEntry.name) || deptList[0];
    const dConf = selectedDeptEntry.conf;

    // Determine country according to department operational hub split
    const isIndia = Math.random() < dConf.indiaRatio;
    const countryCode = isIndia ? 'IN' : 'US';
    const currencyCode = isIndia ? 'INR' : 'USD';

    // Generate authentic, localized names aligned with employee country
    const { firstName, lastName, email } = generateCountryAlignedName(countryCode, currentId);

    // Select pay band according to department-specific seniority distribution
    const bandRand = Math.random();
    let bCum = 0;
    let bandIdx = 0;
    for (let b = 0; b < dConf.bandWeights.length; b++) {
      bCum += dConf.bandWeights[b];
      if (bandRand <= bCum) {
        bandIdx = b;
        break;
      }
    }
    const band = bandList[bandIdx] || bandList[1];

    // Select role title aligned with level
    const bandKey = (`L${bandIdx + 1}`) as 'L1' | 'L2' | 'L3' | 'L4' | 'L5';
    const possibleRoles = dConf.rolesByBand[bandKey] || ['Specialist', 'Lead'];
    const roleTitle = possibleRoles[Math.floor(Math.random() * possibleRoles.length)];

    // Calculate base salary in country currency using authentic department-specific wage bands
    const salRange = isIndia ? dConf.inSalaries[bandIdx] : dConf.usSalaries[bandIdx];
    const rawSalary = salRange.min + Math.random() * (salRange.max - salRange.min);
    const localSalary = isIndia
      ? Math.round(rawSalary / 10000) * 10000
      : Math.round(rawSalary / 500) * 500;

    // Status: active
    const status = 'active';

    // Hire date between 2019 and 2024
    const hireYear = 2019 + Math.floor(Math.random() * 6);
    const hireMonth = (1 + Math.floor(Math.random() * 12)).toString().padStart(2, '0');
    const hireDay = (1 + Math.floor(Math.random() * 28)).toString().padStart(2, '0');
    const hireDate = `${hireYear}-${hireMonth}-${hireDay}`;

    empStmt.run([
      currentId,
      empCode,
      firstName,
      lastName,
      email,
      deptObj.id,
      roleTitle,
      countryCode,
      currencyCode,
      band.id,
      localSalary,
      status,
      hireDate,
      now,
      now
    ]);

    // Baseline historical records
    const hasHistory = Math.random() < 0.40 && hireYear <= 2023;
    if (hasHistory) {
      const pastSalary = isIndia
        ? Math.round((localSalary * 0.92) / 10000) * 10000
        : Math.round((localSalary * 0.92) / 500) * 500;
      const prevBase = isIndia
        ? Math.round((pastSalary * 0.92) / 10000) * 10000
        : Math.round((pastSalary * 0.92) / 500) * 500;
      const reasons = ['Annual review', 'Promotion', 'Market adjustment', 'Performance revision'];
      const r = reasons[Math.floor(Math.random() * reasons.length)];

      salStmt.run([currentId, pastSalary, prevBase, currencyCode, hireDate, 0, 'Annual review', 'Initial merit compensation review', 'HR Compensation Committee', `${hireDate}T10:00:00Z`]);
      salStmt.run([currentId, localSalary, pastSalary, currencyCode, `${hireYear + 1}-04-01`, 1, r, 'Approved merit adjustment', 'HR Compensation Committee', `${hireYear + 1}-04-01T10:00:00Z`]);
    } else {
      salStmt.run([currentId, localSalary, 0, currencyCode, hireDate, 1, 'Initial compensation', 'Onboarding offer', 'HR Compensation Committee', `${hireDate}T10:00:00Z`]);
    }
  }

  empStmt.free();
  salStmt.free();

  db.run("COMMIT;");
  saveDatabase(db);
}

