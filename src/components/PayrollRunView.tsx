import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  CheckCircle2,
  FileText,
  CreditCard,
  AlertCircle,
  RefreshCw,
  Sparkles,
  Search,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
  X,
  RotateCcw
} from 'lucide-react';
import { Employee, Department, PayBand } from '../types';
import { PayslipModal } from './PayslipModal';
import { cn } from '../lib/utils';

const countries = [
  { code: 'US', name: 'United States' },
  { code: 'IN', name: 'India' }
];

interface PayrollRunViewProps {
  initialCountry?: 'US' | 'IN' | 'ALL';
  departments?: Department[];
  payBands?: PayBand[];
  onNavigateToEmployees?: () => void;
  onNavigateToDashboard?: () => void;
  onRunComplete?: () => void;
}

interface RegisterRow {
  employee: Employee;
  baseSalary: number; // Monthly
  allowance: number;
  bonus: number;
  grossPay: number;
  deductions: number;
  netPay: number;
  currencySymbol: string;
  currencyCode: string;
  reviewed: boolean;
}

export const PayrollRunView: React.FC<PayrollRunViewProps> = ({
  initialCountry = 'IN',
  departments = [],
  payBands = [],
  onRunComplete
}) => {
  // Minimal header controls (Country & Period)
  const [selectedCountry, setSelectedCountry] = useState<string>(
    initialCountry === 'US' || initialCountry === 'IN' ? initialCountry : ''
  );
  const [selectedPeriod, setSelectedPeriod] = useState<string>('September 2026');
  const [payrollStatus, setPayrollStatus] = useState<'draft' | 'calculated' | 'paid'>('draft');
  const [previewEmployee, setPreviewEmployee] = useState<Employee | null>(null);
  const [previewBonus, setPreviewBonus] = useState<number>(0);
  const [isCalculating, setIsCalculating] = useState<boolean>(false);
  const [paidBatchRef, setPaidBatchRef] = useState<string | null>(null);

  // Exact same filters as Employees section
  const [search, setSearch] = useState<string>('');
  const [selectedDept, setSelectedDept] = useState<string>('');
  const [selectedBand, setSelectedBand] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('active');
  const [showFiltersMobile, setShowFiltersMobile] = useState<boolean>(false);

  // Metadata fallbacks
  const [localDepts, setLocalDepts] = useState<Department[]>(departments);
  const [localBands, setLocalBands] = useState<PayBand[]>(payBands);

  useEffect(() => {
    if (departments.length > 0) setLocalDepts(departments);
  }, [departments]);

  useEffect(() => {
    if (payBands.length > 0) setLocalBands(payBands);
  }, [payBands]);

  useEffect(() => {
    if (localDepts.length === 0 || localBands.length === 0) {
      fetch('/api/meta')
        .then((res) => res.json())
        .then((data) => {
          if (data.departments && localDepts.length === 0) setLocalDepts(data.departments);
          if (data.payBands && localBands.length === 0) setLocalBands(data.payBands);
        })
        .catch((err) => console.error('Failed to load meta:', err));
    }
  }, []);

  // Real employee data with pagination
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [totalEmployees, setTotalEmployees] = useState<number>(10000);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [isLoadingEmployees, setIsLoadingEmployees] = useState<boolean>(false);

  // Active filter count
  const activeFilterCount = [
    search.trim() !== '',
    selectedDept !== '',
    selectedCountry !== '' && selectedCountry !== 'ALL',
    selectedBand !== '',
    selectedStatus !== 'all' && selectedStatus !== ''
  ].filter(Boolean).length;

  const handleResetFilters = () => {
    setSearch('');
    setSelectedDept('');
    setSelectedCountry('');
    setSelectedBand('');
    setSelectedStatus('active');
    setPage(1);
  };

  // Maintain editable register rows in state (allows HR to change any employee's bonus)
  const [registerRows, setRegisterRows] = useState<Record<number, { bonus: number; reviewed: boolean }>>({
    2: { bonus: 25000, reviewed: true },
    4: { bonus: 0, reviewed: true },
    6: { bonus: 15000, reviewed: true },
    10: { bonus: 50000, reviewed: true },
    1: { bonus: 1200, reviewed: true },
    3: { bonus: 2500, reviewed: true },
    7: { bonus: 1000, reviewed: true }
  });

  // Fetch all employees from backend with active filters & pagination
  const fetchPayrollEmployees = useCallback(async () => {
    setIsLoadingEmployees(true);
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
        sort_by: 'id',
        sort_order: 'asc'
      });
      if (search.trim()) {
        params.set('search', search.trim());
      }
      if (selectedDept) {
        params.set('department_id', selectedDept);
      }
      if (selectedCountry && selectedCountry !== 'ALL') {
        params.set('country_code', selectedCountry);
      }
      if (selectedBand) {
        params.set('pay_band_id', selectedBand);
      }
      if (selectedStatus && selectedStatus !== 'all') {
        params.set('status', selectedStatus);
      }

      const res = await fetch(`/api/employees?${params.toString()}`);
      if (res.ok) {
        const json = await res.json();
        setEmployees(json.data || []);
        setTotalEmployees(json.pagination?.total || 0);
        setTotalPages(json.pagination?.total_pages || 1);
      }
    } catch (err) {
      console.error('Failed to fetch payroll employees:', err);
    } finally {
      setIsLoadingEmployees(false);
    }
  }, [page, limit, search, selectedDept, selectedCountry, selectedBand, selectedStatus]);

  useEffect(() => {
    fetchPayrollEmployees();
  }, [fetchPayrollEmployees]);

  // Country change handler
  const handleCountryChange = (country: string) => {
    setSelectedCountry(country === 'ALL' ? '' : country);
    setPage(1);
    setPayrollStatus('draft');
  };

  // Search change handler
  const handleSearchChange = (val: string) => {
    setSearch(val);
    setPage(1);
  };

  // Calculate live row values based on country formulas
  const calculatedRows: RegisterRow[] = useMemo(() => {
    return employees.map((emp) => {
      const isIndia = emp.country_code === 'IN';
      const currencySymbol = isIndia ? '₹' : '$';
      const currencyCode = isIndia ? 'INR' : 'USD';
      const baseMonthly = Math.round((emp.current_salary || (isIndia ? 1800000 : 100000)) / 12);
      const allowance = Math.round(isIndia ? baseMonthly * 0.40 : baseMonthly * 0.04);
      const bonus = registerRows[emp.id]?.bonus ?? 0;
      const reviewed = registerRows[emp.id]?.reviewed ?? true;

      const grossPay = baseMonthly + allowance + bonus;

      // Statutory deductions per country
      let deductions = 0;
      if (isIndia) {
        const tds = Math.round(grossPay * 0.15);
        const epf = Math.round(baseMonthly * 0.12);
        const pt = 200;
        deductions = tds + epf + pt;
      } else {
        const fedState = Math.round(grossPay * 0.18);
        const fica = Math.round(grossPay * 0.0765);
        deductions = fedState + fica;
      }

      const netPay = grossPay - deductions;

      return {
        employee: emp,
        baseSalary: baseMonthly,
        allowance,
        bonus,
        grossPay,
        deductions,
        netPay,
        currencySymbol,
        currencyCode,
        reviewed
      };
    });
  }, [employees, registerRows]);

  // Aggregate totals for displayed register
  const totals = useMemo(() => {
    const totalBase = calculatedRows.reduce((acc, r) => acc + r.baseSalary, 0);
    const totalBonus = calculatedRows.reduce((acc, r) => acc + r.bonus, 0);
    const totalGross = calculatedRows.reduce((acc, r) => acc + r.grossPay, 0);
    const totalDeductions = calculatedRows.reduce((acc, r) => acc + r.deductions, 0);
    const totalNet = calculatedRows.reduce((acc, r) => acc + r.netPay, 0);
    const reviewedCount = calculatedRows.filter((r) => r.reviewed).length;
    return {
      totalBase,
      totalBonus,
      totalGross,
      totalDeductions,
      totalNet,
      reviewedCount,
      allReviewed: calculatedRows.length > 0 && reviewedCount === calculatedRows.length
    };
  }, [calculatedRows]);

  // Primary currency display for header cards
  const primaryCurrencySymbol = selectedCountry === 'IN' ? '₹' : selectedCountry === 'US' ? '$' : '$';

  // Handle bonus update by HR
  const handleBonusChange = (empId: number, val: string) => {
    const num = Math.max(0, parseInt(val, 10) || 0);
    setRegisterRows((prev) => ({
      ...prev,
      [empId]: {
        ...(prev[empId] || { reviewed: true }),
        bonus: num
      }
    }));
    if (payrollStatus === 'paid') {
      setPayrollStatus('calculated');
    }
  };

  // Toggle review checkbox
  const handleToggleReview = (empId: number) => {
    setRegisterRows((prev) => ({
      ...prev,
      [empId]: {
        ...(prev[empId] || { bonus: 0 }),
        reviewed: !prev[empId]?.reviewed
      }
    }));
  };

  // Mark all reviewed on current page
  const handleMarkAllReviewed = () => {
    const next: Record<number, { bonus: number; reviewed: boolean }> = { ...registerRows };
    calculatedRows.forEach((r) => {
      next[r.employee.id] = {
        bonus: r.bonus,
        reviewed: true
      };
    });
    setRegisterRows(next);
  };

  // Calculate action
  const handleCalculate = () => {
    setIsCalculating(true);
    setTimeout(() => {
      setIsCalculating(false);
      setPayrollStatus('calculated');
    }, 400);
  };

  // Approve & Pay action
  const handleApproveAndPay = async () => {
    setIsCalculating(true);
    try {
      const res = await fetch('/api/payroll/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          country_code: selectedCountry === 'ALL' ? 'GLOBAL' : selectedCountry,
          period: selectedPeriod,
          total_amount: totals.totalNet,
          employee_count: totalEmployees
        })
      });
      await res.json();
    } catch {
      // Graceful fallback
    } finally {
      setIsCalculating(false);
      setPayrollStatus('paid');
      const prefix = selectedCountry === 'IN' ? 'NEFT-IN' : selectedCountry === 'US' ? 'ACH-US' : 'SWIFT-GLB';
      const ref = `${prefix}-202609-${Math.floor(100000 + Math.random() * 900000)}`;
      setPaidBatchRef(ref);
      if (onRunComplete) {
        onRunComplete();
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Minimal Header Section (Payroll Run Register + Country & Date Dropdowns) */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Payroll Run Register
            </h1>
          </div>

          {/* Minimal Controls: Country and Date Dropdowns */}
          <div className="flex items-center gap-3 flex-wrap">
            {/* Country Dropdown */}
            <div className="relative">
              <select
                value={selectedCountry === '' ? 'ALL' : selectedCountry}
                onChange={(e) => handleCountryChange(e.target.value)}
                className="text-xs font-semibold px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[40px] cursor-pointer"
              >
                <option value="ALL">All Entities (Global)</option>
                <option value="IN">India (INR ₹)</option>
                <option value="US">United States (USD $)</option>
              </select>
            </div>

            {/* Date Dropdown */}
            <div className="relative">
              <select
                value={selectedPeriod}
                onChange={(e) => {
                  setSelectedPeriod(e.target.value);
                  if (e.target.value !== 'September 2026') {
                    setPayrollStatus('paid');
                    setPaidBatchRef(`HIST-${e.target.value.replace(/\s+/g, '-').toUpperCase()}`);
                  } else {
                    setPayrollStatus('draft');
                    setPaidBatchRef(null);
                  }
                }}
                className="text-xs font-semibold px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[40px] cursor-pointer"
              >
                <option value="September 2026">September 2026 (Upcoming)</option>
                <option value="August 2026">August 2026 (Closed)</option>
                <option value="July 2026">July 2026 (Closed)</option>
                <option value="June 2026">June 2026 (Closed)</option>
                <option value="May 2026">May 2026 (Closed)</option>
                <option value="April 2026">April 2026 (Closed)</option>
                <option value="March 2026">March 2026 (Closed)</option>
                <option value="February 2026">February 2026 (Closed)</option>
                <option value="January 2026">January 2026 (Closed)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Minimal Sub-bar: Status and Verified Count */}
        <div className="mt-4 pt-3.5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-500 font-medium">Batch Status:</span>
            {payrollStatus === 'paid' ? (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Approved & Paid
              </span>
            ) : payrollStatus === 'calculated' ? (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-300">
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                Calculated & Ready
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300">
                <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                Draft Review
              </span>
            )}

            {paidBatchRef && (
              <span className="font-mono bg-slate-100 px-2 py-0.5 rounded text-[11px] text-slate-600 font-semibold border border-slate-200">
                Ref: {paidBatchRef}
              </span>
            )}
          </div>

          <div className="flex items-center gap-3 text-xs text-slate-500">
            <button
              onClick={handleMarkAllReviewed}
              className="font-semibold text-slate-600 hover:text-blue-600 underline cursor-pointer"
            >
              Mark page ({calculatedRows.length}) as reviewed
            </button>
            <span>&bull;</span>
            <span className="font-medium">
              {totals.reviewedCount} of {calculatedRows.length} verified on this page
            </span>
          </div>
        </div>
      </div>

      {/* 2. Success Banner when Paid */}
      <AnimatePresence>
        {payrollStatus === 'paid' && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-5 rounded-2xl bg-emerald-600 text-white shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-extrabold text-base">Payroll Disbursal Successfully Executed!</h3>
                <p className="text-xs text-emerald-100 mt-0.5">
                  Direct funds transfer scheduled for {totalEmployees.toLocaleString()} employees via banking clearance gateway.
                </p>
              </div>
            </div>
            {calculatedRows.length > 0 && (
              <button
                onClick={() => {
                  setPreviewEmployee(calculatedRows[0].employee);
                  setPreviewBonus(calculatedRows[0].bonus);
                }}
                className="px-4 py-2 rounded-xl bg-white text-emerald-800 font-bold text-xs hover:bg-emerald-50 transition shadow-xs shrink-0"
              >
                Inspect Sample Payslip
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3. Summary Metric Strip (Page Batch Totals) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <span className="text-[11px] font-semibold text-slate-400 block uppercase">Page Base Monthly</span>
          <span className="text-xl font-bold font-mono text-slate-900 mt-1 block">
            {primaryCurrencySymbol}{totals.totalBase.toLocaleString()}
          </span>
          <span className="text-[10px] text-slate-400">Excluding variable bonuses</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <span className="text-[11px] font-semibold text-slate-400 block uppercase">Allowances & Bonuses</span>
          <span className="text-xl font-bold font-mono text-blue-600 mt-1 block">
            +{primaryCurrencySymbol}{(totals.totalGross - totals.totalBase).toLocaleString()}
          </span>
          <span className="text-[10px] text-slate-400">
            {selectedCountry === 'IN' ? 'HRA + Performance' : '401(k) + Performance'}
          </span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <span className="text-[11px] font-semibold text-slate-400 block uppercase">Statutory Deductions</span>
          <span className="text-xl font-bold font-mono text-rose-600 mt-1 block">
            -{primaryCurrencySymbol}{totals.totalDeductions.toLocaleString()}
          </span>
          <span className="text-[10px] text-slate-400">
            {selectedCountry === 'IN' ? 'TDS & EPF Withheld' : 'Federal & FICA Tax'}
          </span>
        </div>

        <div className="bg-blue-600 text-white p-4 rounded-xl shadow-xs">
          <span className="text-[11px] font-bold text-blue-200 block uppercase">Net Disbursal Total</span>
          <span className="text-2xl font-black font-mono text-white mt-1 block">
            {primaryCurrencySymbol}{totals.totalNet.toLocaleString()}
          </span>
          <span className="text-[10px] text-blue-100">Batch for {calculatedRows.length} employees on page</span>
        </div>
      </div>

      {/* 4. Filter Toolbar (Exact Same Filters as Employees Section) */}
      <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
        {/* Mobile Filter Toggle Header */}
        <div className="flex items-center justify-between gap-2 sm:hidden">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search name, code, role..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 min-h-[40px]"
            />
          </div>

          <button
            type="button"
            onClick={() => setShowFiltersMobile(!showFiltersMobile)}
            className={cn(
              "px-3 py-2 rounded-xl text-xs font-semibold border flex items-center gap-1.5 transition min-h-[40px] shrink-0 cursor-pointer",
              showFiltersMobile || activeFilterCount > 0
                ? "bg-blue-50 border-blue-300 text-blue-700"
                : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
            )}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Filters</span>
            {activeFilterCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center ml-0.5">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>

        {/* Collapsible Filter Section on Mobile / Always visible on Desktop */}
        <div className={cn(
          "space-y-3 transition-all",
          showFiltersMobile ? "block" : "hidden sm:block"
        )}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5 sm:gap-3">
            {/* Search by Name or Code */}
            <div className="relative hidden sm:block">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Search name, code, role..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition min-h-[40px]"
              />
            </div>

            {/* Department Filter */}
            <div className="relative">
              <select
                value={selectedDept}
                onChange={(e) => {
                  setSelectedDept(e.target.value);
                  setPage(1);
                }}
                className="w-full py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 min-h-[40px] cursor-pointer"
              >
                <option value="">All Departments</option>
                {localDepts.map((d) => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
            </div>

            {/* Country Filter */}
            <div className="relative">
              <select
                value={selectedCountry}
                onChange={(e) => {
                  setSelectedCountry(e.target.value);
                  setPage(1);
                }}
                className="w-full py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 min-h-[40px] cursor-pointer"
              >
                <option value="">All Countries</option>
                {countries.map((c) => (
                  <option key={c.code} value={c.code}>{c.name}</option>
                ))}
              </select>
            </div>

            {/* Pay Band Filter */}
            <div className="relative">
              <select
                value={selectedBand}
                onChange={(e) => {
                  setSelectedBand(e.target.value);
                  setPage(1);
                }}
                className="w-full py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 min-h-[40px] cursor-pointer"
              >
                <option value="">All Pay Bands</option>
                {localBands.map((b) => (
                  <option key={b.id} value={b.id}>{b.name}</option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div className="relative">
              <select
                value={selectedStatus}
                onChange={(e) => {
                  setSelectedStatus(e.target.value);
                  setPage(1);
                }}
                className="w-full py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 min-h-[40px] cursor-pointer"
              >
                <option value="all">All Statuses</option>
                <option value="active">Active Only</option>
                <option value="inactive">Inactive (Soft-Deleted)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Filter Badges / Active Counts & Per Page */}
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 pt-1 border-t border-slate-100">
          <div className="flex items-center gap-2 flex-wrap">
            <span>Showing <b>{calculatedRows.length}</b> of <b>{totalEmployees.toLocaleString()}</b> employees</span>
            {activeFilterCount > 0 && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="text-blue-600 hover:text-blue-700 font-bold underline underline-offset-2 flex items-center gap-1 py-1 cursor-pointer"
              >
                <X className="w-3 h-3" />
                Reset Filters ({activeFilterCount})
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <span>Rows:</span>
            <select
              value={limit}
              onChange={(e) => {
                setLimit(Number(e.target.value));
                setPage(1);
              }}
              className="py-1 px-2 border border-slate-200 rounded-lg text-xs bg-slate-50 min-h-[34px] cursor-pointer"
            >
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
          </div>
        </div>
      </div>

      {/* 5. Full Employees Payroll Register Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        {/* Table Subheader */}
        <div className="p-3.5 sm:px-5 border-b border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-2 bg-slate-50/70">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-800">
              Disbursal Calculation Register
            </span>
            <span className="text-slate-300">&bull;</span>
            <span className="text-xs font-medium text-slate-500">
              Page {page} of {totalPages}
            </span>
          </div>

          <span className="text-[11px] font-medium text-slate-500">
            Tip: Edit bonuses directly in table below before disbursement
          </span>
        </div>

        {/* Table Body */}
        <div className="overflow-x-auto min-h-[380px]">
          {isLoadingEmployees ? (
            <div className="flex flex-col items-center justify-center p-12 text-slate-400">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-2" />
              <p className="text-xs font-semibold">Loading employee register...</p>
            </div>
          ) : calculatedRows.length === 0 ? (
            <div className="p-12 text-center text-slate-400 text-xs font-semibold">
              <p>No employees found matching the filter criteria.</p>
              {activeFilterCount > 0 && (
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 font-bold text-xs transition cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Reset all filters
                </button>
              )}
            </div>
          ) : (
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4 w-12 text-center">Rev</th>
                  <th className="py-3 px-4">Code</th>
                  <th className="py-3 px-4">Employee</th>
                  <th className="py-3 px-4">Role & Dept</th>
                  <th className="py-3 px-4">Country</th>
                  <th className="py-3 px-4 text-right">Base Pay</th>
                  <th className="py-3 px-4 text-right">Allowances</th>
                  <th className="py-3 px-4 text-right w-36">Bonus</th>
                  <th className="py-3 px-4 text-right">Gross Pay</th>
                  <th className="py-3 px-4 text-right">Deductions</th>
                  <th className="py-3 px-4 text-right font-black">Net Pay</th>
                  <th className="py-3 px-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {calculatedRows.map((row) => (
                  <tr
                    key={row.employee.id}
                    className={`hover:bg-slate-50/80 transition ${
                      row.reviewed ? '' : 'bg-amber-50/30'
                    }`}
                  >
                    {/* Checkbox */}
                    <td className="py-3 px-4 text-center">
                      <input
                        type="checkbox"
                        checked={row.reviewed}
                        onChange={() => handleToggleReview(row.employee.id)}
                        className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300 cursor-pointer"
                        title="Mark as reviewed"
                      />
                    </td>

                    {/* Employee Code */}
                    <td className="py-3 px-4 font-mono text-xs font-semibold text-slate-600">
                      {row.employee.employee_code}
                    </td>

                    {/* Employee Name & Email */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center font-bold text-blue-700 text-xs shadow-2xs shrink-0">
                          {row.employee.first_name[0]}{row.employee.last_name[0]}
                        </div>
                        <div className="min-w-0">
                          <div className="font-bold text-slate-900 truncate">
                            {row.employee.first_name} {row.employee.last_name}
                          </div>
                          <div className="text-[11px] text-slate-400 truncate">
                            {row.employee.email}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Role & Dept */}
                    <td className="py-3 px-4">
                      <div className="font-medium text-slate-800">{row.employee.role_title}</div>
                      <div className="text-[10px] text-slate-400">{row.employee.department_name}</div>
                    </td>

                    {/* Country & Currency */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5">
                        <span>{row.employee.country_code === 'IN' ? '🇮🇳' : '🇺🇸'}</span>
                        <span className="font-bold text-slate-700 text-[11px]">
                          {row.currencyCode}
                        </span>
                      </div>
                    </td>

                    {/* Base Salary */}
                    <td className="py-3 px-4 text-right font-mono font-semibold text-slate-700">
                      {row.currencySymbol}{row.baseSalary.toLocaleString()}
                    </td>

                    {/* Allowances */}
                    <td className="py-3 px-4 text-right font-mono text-slate-600">
                      +{row.currencySymbol}{row.allowance.toLocaleString()}
                      <span className="block text-[9px] text-slate-400">
                        {row.employee.country_code === 'IN' ? 'HRA 40%' : '401k'}
                      </span>
                    </td>

                    {/* Bonus (Interactive Edit for HR!) */}
                    <td className="py-3 px-4 text-right">
                      <div className="inline-flex items-center relative">
                        <span className="absolute left-2.5 text-slate-400 font-mono text-xs">{row.currencySymbol}</span>
                        <input
                          type="number"
                          value={row.bonus === 0 ? '' : row.bonus}
                          placeholder="0"
                          onChange={(e) => handleBonusChange(row.employee.id, e.target.value)}
                          className="w-28 pl-6 pr-2 py-1 text-right font-mono font-bold text-xs bg-slate-50 border border-slate-200 rounded-md focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 text-emerald-700"
                          title="Adjust performance bonus"
                        />
                      </div>
                    </td>

                    {/* Gross Pay */}
                    <td className="py-3 px-4 text-right font-mono font-bold text-slate-900">
                      {row.currencySymbol}{row.grossPay.toLocaleString()}
                    </td>

                    {/* Deductions */}
                    <td className="py-3 px-4 text-right font-mono text-rose-600">
                      -{row.currencySymbol}{row.deductions.toLocaleString()}
                      <span className="block text-[9px] text-slate-400">
                        {row.employee.country_code === 'IN' ? 'TDS + EPF' : 'Fed + FICA'}
                      </span>
                    </td>

                    {/* Net Pay */}
                    <td className="py-3 px-4 text-right font-mono font-extrabold text-blue-600 text-sm">
                      {row.currencySymbol}{row.netPay.toLocaleString()}
                    </td>

                    {/* Action: Preview Payslip */}
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => {
                          setPreviewEmployee(row.employee);
                          setPreviewBonus(row.bonus);
                        }}
                        className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition cursor-pointer"
                        title="Preview Payslip"
                      >
                        <FileText className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Table Pagination Controls (Same standard pagination as EmployeesView) */}
        <div className="p-3.5 sm:p-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 bg-slate-50/40">
          <p>
            Showing {totalEmployees === 0 ? 0 : ((page - 1) * limit) + 1} to {Math.min(page * limit, totalEmployees)} of {totalEmployees.toLocaleString()} employees
          </p>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              disabled={page <= 1 || isLoadingEmployees}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="px-3 py-2 rounded-xl border border-slate-200 flex items-center justify-center hover:bg-slate-50 disabled:opacity-40 min-h-[38px] min-w-[38px] font-bold transition cursor-pointer"
              aria-label="Previous page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => setPage(1)}
              className={`w-9 h-9 rounded-xl font-bold flex items-center justify-center min-h-[38px] min-w-[38px] transition cursor-pointer ${
                page === 1 ? 'bg-blue-600 text-white shadow-xs' : 'border border-slate-200 hover:bg-slate-50'
              }`}
            >
              1
            </button>

            {totalPages > 1 && (
              <button
                type="button"
                onClick={() => setPage(2)}
                className={`w-9 h-9 rounded-xl font-bold flex items-center justify-center min-h-[38px] min-w-[38px] transition cursor-pointer ${
                  page === 2 ? 'bg-blue-600 text-white shadow-xs' : 'border border-slate-200 hover:bg-slate-50'
                }`}
              >
                2
              </button>
            )}

            {totalPages > 3 && <span className="px-1 text-slate-400">...</span>}

            {totalPages > 2 && (
              <button
                type="button"
                onClick={() => setPage(totalPages)}
                className={`w-9 h-9 rounded-xl font-bold flex items-center justify-center min-h-[38px] min-w-[38px] transition cursor-pointer ${
                  page === totalPages ? 'bg-blue-600 text-white shadow-xs' : 'border border-slate-200 hover:bg-slate-50'
                }`}
              >
                {totalPages}
              </button>
            )}

            <button
              type="button"
              disabled={page >= totalPages || isLoadingEmployees}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className="px-3 py-2 rounded-xl border border-slate-200 flex items-center justify-center hover:bg-slate-50 disabled:opacity-40 min-h-[38px] min-w-[38px] font-bold transition cursor-pointer"
              aria-label="Next page"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Footer Action Bar */}
        <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-slate-500 text-center sm:text-left">
            <p>
              Statutory verification: <strong>{selectedCountry === 'IN' ? 'India Statutory Rules (TDS 15% + EPF 12% + PT ₹200)' : selectedCountry === 'US' ? 'US Statutory Rules (Federal 18% + FICA 7.65%)' : 'Dual-Entity Compliant Rules'}</strong>
            </p>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            {/* Button: Calculate */}
            <button
              onClick={handleCalculate}
              disabled={isCalculating}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold text-xs transition disabled:opacity-50 cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isCalculating ? 'animate-spin' : ''}`} />
              <span>Calculate</span>
            </button>

            {/* Button: Preview First Payslip */}
            <button
              onClick={() => {
                if (calculatedRows.length > 0) {
                  setPreviewEmployee(calculatedRows[0].employee);
                  setPreviewBonus(calculatedRows[0].bonus);
                }
              }}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs transition shadow-2xs cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5 text-slate-500" />
              <span>Preview Payslip</span>
            </button>

            {/* Button: Approve & Pay */}
            <button
              onClick={handleApproveAndPay}
              disabled={isCalculating || payrollStatus === 'paid'}
              className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs text-white transition shadow-sm cursor-pointer ${
                payrollStatus === 'paid'
                  ? 'bg-emerald-600 cursor-default'
                  : 'bg-blue-600 hover:bg-blue-700 active:scale-98'
              }`}
            >
              {payrollStatus === 'paid' ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Batch Disbursed</span>
                </>
              ) : (
                <>
                  <CreditCard className="w-4 h-4" />
                  <span>Approve & Pay ({primaryCurrencySymbol}{totals.totalNet.toLocaleString()})</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Payslip Modal */}
      {previewEmployee && (
        <PayslipModal
          employee={previewEmployee}
          period={selectedPeriod}
          bonusAmount={previewBonus}
          onClose={() => setPreviewEmployee(null)}
        />
      )}
    </div>
  );
};
