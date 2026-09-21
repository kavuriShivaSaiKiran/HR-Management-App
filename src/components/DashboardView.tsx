import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, Variants } from 'motion/react';
import {
  Wallet,
  Users,
  Clock,
  FileText,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
  Filter,
  Download,
  Play,
  CheckCircle2,
  AlertCircle,
  Clock3,
  Calendar as CalendarIcon,
  Globe,
  Check,
  CalendarDays,
  RotateCcw,
  X,
  DollarSign,
  UserCheck
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { DashboardStats, Employee, ActivityItem, PaginatedResponse, DateRangeFilter } from '../types';
import { formatCurrency, cn, getInitials } from '../lib/utils';

interface DashboardViewProps {
  stats: DashboardStats | null;
  employeesData: PaginatedResponse<Employee> | null;
  activities: ActivityItem[];
  onSelectEmployee: (emp: Employee) => void;
  onPageChange: (page: number) => void;
  onRunPayroll?: () => void;
  onViewEmployees?: () => void;
  onStartCountryPayroll?: (country: 'US' | 'IN') => void;
  onViewReports?: () => void;
  currentPage: number;
  selectedDateRange?: DateRangeFilter;
  onCountryFilterChange?: (country: string) => void;
  initialCountry?: string;
}

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const SHORT_MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

// Seasonal variance multipliers for realistic month-over-month payroll calculation
const MONTH_FACTORS = [0.96, 0.97, 0.98, 0.99, 1.00, 1.01, 1.015, 1.02, 1.03, 1.04, 1.055, 1.09];
const YEAR_FACTORS: Record<number, number> = {
  2024: 1.0,
  2025: 1.042,
  2026: 1.084,
  2027: 1.135
};

export const DashboardView: React.FC<DashboardViewProps> = ({
  stats,
  employeesData,
  activities,
  onSelectEmployee,
  onPageChange,
  onRunPayroll,
  onViewEmployees,
  onStartCountryPayroll,
  onViewReports,
  currentPage,
  selectedDateRange,
  onCountryFilterChange,
  initialCountry = 'all'
}) => {
  // Top Filter Pane State: Country and Date (Month & Year)
  const [selectedCountry, setSelectedCountry] = useState<string>(initialCountry);
  const [selectedMonth, setSelectedMonth] = useState<number>(8); // September (0-indexed: 8)
  const [selectedYear, setSelectedYear] = useState<number>(2026);

  // Employee Payroll Card local filters (initially affected by page filters, but card changes do NOT affect page filters)
  const [tableCountry, setTableCountry] = useState<string>(initialCountry);
  const [tableMonth, setTableMonth] = useState<number>(8);
  const [tableYear, setTableYear] = useState<number>(2026);

  // Top page filters initially and reactively update the Employee Payroll card filters
  useEffect(() => {
    setTableCountry(selectedCountry);
    setDashboardPage(1);
  }, [selectedCountry]);

  useEffect(() => {
    setTableMonth(selectedMonth);
  }, [selectedMonth]);

  useEffect(() => {
    setTableYear(selectedYear);
  }, [selectedYear]);

  // Local table state to isolate Dashboard pagination & employees from global app state
  const [dashboardPage, setDashboardPage] = useState<number>(currentPage || 1);
  const [dashboardEmployees, setDashboardEmployees] = useState<any[]>(employeesData?.data || []);
  const [dashboardTotalCount, setDashboardTotalCount] = useState<number>(employeesData?.pagination?.total || 10000);
  const [dashboardTotalPages, setDashboardTotalPages] = useState<number>(employeesData?.pagination?.total_pages || 1000);

  // Secondary toggles
  const [trendPeriod, setTrendPeriod] = useState<'6m' | '12m'>('6m');
  const [isPageLoading, setIsPageLoading] = useState(false);
  const [isTableFilterOpen, setIsTableFilterOpen] = useState(false);

  // Country changes in top pane
  const handleCountryChange = (country: string) => {
    setSelectedCountry(country);
  };

  // Country changes in Employee Payroll card toolbar ONLY (does NOT alter top page filters)
  const handleTableCountryChange = (country: string) => {
    setTableCountry(country);
    setDashboardPage(1);
  };

  // Fetch table data locally whenever dashboardPage or tableCountry changes
  useEffect(() => {
    let isMounted = true;
    const fetchDashboardTable = async () => {
      setIsPageLoading(true);
      try {
        const countryParam = tableCountry !== 'all' ? `&country_code=${tableCountry}` : '';
        const res = await fetch(`/api/employees?page=${dashboardPage}&limit=10${countryParam}`);
        if (res.ok) {
          const json = await res.json();
          if (isMounted) {
            setDashboardEmployees(json.data || []);
            setDashboardTotalCount(json.pagination?.total || (tableCountry === 'US' ? 3100 : tableCountry === 'IN' ? 6900 : 10000));
            setDashboardTotalPages(json.pagination?.total_pages || 1);
          }
        }
      } catch (err) {
        console.error('Failed to fetch dashboard table employees:', err);
      } finally {
        if (isMounted) setIsPageLoading(false);
      }
    };

    fetchDashboardTable();
    return () => {
      isMounted = false;
    };
  }, [dashboardPage, tableCountry]);

  // Base monthly payroll numbers from database
  const baseMonthlyAll = stats?.total_payroll_month || 78092928;
  const baseMonthlyUS = 24239333; // ~3,100 employees in US
  const baseMonthlyIN_USD = 53853594; // ~6,900 employees in India in USD equivalent
  const baseMonthlyIN_INR = 4487799527; // ~₹448.8 Cr in local INR

  // Combined calculation factor based strictly on the selected month & year
  const currentMonthFactor = MONTH_FACTORS[selectedMonth] ?? 1.0;
  const currentYearFactor = YEAR_FACTORS[selectedYear] ?? 1.084;
  const calcFactor = currentMonthFactor * currentYearFactor;

  // Dynamically calculated payroll & deductions for the selected month, year, and country
  const calculatedPayrollAll = baseMonthlyAll * calcFactor;
  const calculatedDeductionsAll = (stats?.tax_deductions || 11050149) * calcFactor;

  const calculatedPayrollUS = baseMonthlyUS * calcFactor;
  const calculatedDeductionsUS = calculatedPayrollUS * 0.1415;

  const calculatedPayrollIN_INR = Math.round(baseMonthlyIN_INR * calcFactor);
  const calculatedPayrollIN_USD = baseMonthlyIN_USD * calcFactor;
  const calculatedDeductionsIN_INR = Math.round(calculatedPayrollIN_INR * 0.1415);
  const calculatedDeductionsIN_USD = calculatedPayrollIN_USD * 0.1415;

  // Selected date parameters
  const daysInSelectedMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();
  const currentMonthName = MONTH_NAMES[selectedMonth];
  const currentShortMonth = SHORT_MONTHS[selectedMonth];
  const formattedCycleDate = `${currentShortMonth} ${daysInSelectedMonth}, ${selectedYear}`;
  const isPastCycle = selectedYear < 2026 || (selectedYear === 2026 && selectedMonth < 8);

  // Handle smooth page changes local to Dashboard
  const handlePageChange = (newPage: number) => {
    if (newPage === dashboardPage || newPage < 1 || newPage > dashboardTotalPages) return;
    setDashboardPage(newPage);
  };

  // Dynamic Salary Breakdown based on Country, Month & Year
  let breakdownGross = calculatedPayrollAll * 1.20;
  let breakdownDeductions = calculatedDeductionsAll;
  let breakdownBonuses = calculatedPayrollAll * 0.07;
  let breakdownNet = calculatedPayrollAll;
  let breakdownCurrency = 'USD';
  let breakdownTotalFormatted = formatCurrency(calculatedPayrollAll, 'USD');

  if (selectedCountry === 'US') {
    breakdownGross = calculatedPayrollUS * 1.20;
    breakdownDeductions = calculatedDeductionsUS;
    breakdownBonuses = calculatedPayrollUS * 0.07;
    breakdownNet = calculatedPayrollUS;
    breakdownCurrency = 'USD';
    breakdownTotalFormatted = formatCurrency(calculatedPayrollUS, 'USD');
  } else if (selectedCountry === 'IN') {
    breakdownGross = calculatedPayrollIN_INR * 1.20;
    breakdownDeductions = calculatedDeductionsIN_INR;
    breakdownBonuses = calculatedPayrollIN_INR * 0.07;
    breakdownNet = calculatedPayrollIN_INR;
    breakdownCurrency = 'INR';
    breakdownTotalFormatted = formatCurrency(calculatedPayrollIN_INR, 'INR');
  }

  const dynamicBreakdownData = [
    { name: 'Gross Salary', value: breakdownGross, pct: '60.5%' },
    { name: 'Deductions', value: breakdownDeductions, pct: '7.1%' },
    { name: 'Bonuses', value: breakdownBonuses, pct: '3.5%' },
    { name: 'Net Salary', value: breakdownNet, pct: '50.3%' },
  ];
  const BREAKDOWN_COLORS = ['#3b82f6', '#f43f5e', '#eab308', '#10b981'];

  // Dynamic Payroll Trend Data ending at the selected Month and Year
  const numTrendMonths = trendPeriod === '12m' ? 12 : 6;
  const dynamicTrendData: Array<{ month: string; amount: number; local_amount: number }> = [];

  for (let i = numTrendMonths - 1; i >= 0; i--) {
    const pointDate = new Date(selectedYear, selectedMonth - i, 1);
    const mIdx = pointDate.getMonth();
    const yr = pointDate.getFullYear();
    const label = `${SHORT_MONTHS[mIdx]} '${String(yr).slice(-2)}`;
    const pointFactor = (MONTH_FACTORS[mIdx] ?? 1.0) * (YEAR_FACTORS[yr] ?? 1.0);

    if (selectedCountry === 'IN') {
      dynamicTrendData.push({
        month: label,
        amount: Math.round(baseMonthlyIN_USD * pointFactor),
        local_amount: Math.round(baseMonthlyIN_INR * pointFactor)
      });
    } else if (selectedCountry === 'US') {
      dynamicTrendData.push({
        month: label,
        amount: Math.round(baseMonthlyUS * pointFactor),
        local_amount: Math.round(baseMonthlyUS * pointFactor)
      });
    } else {
      dynamicTrendData.push({
        month: label,
        amount: Math.round(baseMonthlyAll * pointFactor),
        local_amount: Math.round(baseMonthlyAll * pointFactor)
      });
    }
  }

  const activeTrendCurrency = selectedCountry === 'IN' ? 'INR' : 'USD';

  // Dynamic Payroll Calendar generation based strictly on selected Month & Year
  const firstDayOfWeek = new Date(selectedYear, selectedMonth, 1).getDay();
  const prevMonthDaysTotal = new Date(selectedYear, selectedMonth, 0).getDate();
  const calendarCells: Array<{
    day: number;
    isPrev?: boolean;
    isNext?: boolean;
    isPayday?: boolean;
    isUpcoming?: boolean;
    isCurrentMonth?: boolean;
  }> = [];

  // Trailing previous month days
  for (let i = firstDayOfWeek - 1; i >= 0; i--) {
    calendarCells.push({ day: prevMonthDaysTotal - i, isPrev: true });
  }
  // Days of current selected month
  for (let d = 1; d <= daysInSelectedMonth; d++) {
    calendarCells.push({
      day: d,
      isPayday: d === 15,
      isUpcoming: d === daysInSelectedMonth,
      isCurrentMonth: true
    });
  }
  // Trailing next month days to align grid to 7 columns
  const remainingCells = 7 - (calendarCells.length % 7);
  if (remainingCells < 7) {
    for (let n = 1; n <= remainingCells; n++) {
      calendarCells.push({ day: n, isNext: true });
    }
  }

  // Employee table lists & count (isolated to DashboardView)
  const totalEmployeesCount = dashboardTotalCount;
  const displayEmployees = dashboardEmployees.length > 0 ? dashboardEmployees : (employeesData?.data || []);
  const totalPages = dashboardTotalPages;

  // Table specific date & status parameters (derived from tableMonth & tableYear)
  const tableShortMonth = SHORT_MONTHS[tableMonth];
  const tableDaysInMonth = new Date(tableYear, tableMonth + 1, 0).getDate();
  const isTablePastCycle = tableYear < 2026 || (tableYear === 2026 && tableMonth < 8);

  // Status badge
  const getStatusBadge = (status?: string, index: number = 0) => {
    const paymentStatus = isTablePastCycle ? 'Paid' : (index === 2 ? 'Processing' : index === 3 ? 'Pending' : 'Paid');
    if (paymentStatus === 'Paid') {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          Paid
        </span>
      );
    }
    if (paymentStatus === 'Processing') {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
          <Clock3 className="w-3.5 h-3.5 text-blue-600" />
          Processing
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
        <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
        Pending
      </span>
    );
  };

  // Animation variants
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.06,
        delayChildren: 0.02
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 12 },
    show: { opacity: 1, y: 0, transition: { duration: 0.28, ease: 'easeOut' } }
  };

  const countryLabel = selectedCountry === 'all'
    ? 'All Entities'
    : selectedCountry === 'US'
      ? 'United States'
      : 'India';

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-6 pb-12"
    >
      {/* 1. TOP FILTER PANE: Date & Country Filter with All Option */}
      <motion.div
        variants={itemVariants}
        className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-2xs"
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Filter Description & Active Pill */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold border border-blue-100 shrink-0">
              <Filter className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-slate-900">Dashboard Filter Controls</h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                  Real-time Sync
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Current Filter: <span className="font-bold text-slate-800">{countryLabel}</span> &bull; <span className="font-bold text-blue-600">{currentMonthName} {selectedYear}</span>
              </p>
            </div>
          </div>

          {/* Right Controls: Country segmented picker + Date (Month & Year) Picker */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Country Filter (All, US, India) */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200/80">
              <button
                type="button"
                onClick={() => handleCountryChange('all')}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer flex items-center gap-1.5",
                  selectedCountry === 'all'
                    ? "bg-white text-slate-900 shadow-2xs font-bold"
                    : "text-slate-600 hover:text-slate-900"
                )}
              >
                <Globe className="w-3.5 h-3.5 text-blue-600" />
                <span>All</span>
              </button>
              <button
                type="button"
                onClick={() => handleCountryChange('US')}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer flex items-center gap-1.5",
                  selectedCountry === 'US'
                    ? "bg-white text-slate-900 shadow-2xs font-bold"
                    : "text-slate-600 hover:text-slate-900"
                )}
              >
                <span>🇺🇸</span>
                <span>US</span>
              </button>
              <button
                type="button"
                onClick={() => handleCountryChange('IN')}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer flex items-center gap-1.5",
                  selectedCountry === 'IN'
                    ? "bg-white text-slate-900 shadow-2xs font-bold"
                    : "text-slate-600 hover:text-slate-900"
                )}
              >
                <span>🇮🇳</span>
                <span>India</span>
              </button>
            </div>

            {/* Date / Calendar Filter: Month and Year Selection Only */}
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 shadow-2xs">
              <CalendarIcon className="w-4 h-4 text-blue-600 shrink-0" />

              {/* Month Selector */}
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(Number(e.target.value))}
                className="text-xs font-bold text-slate-800 bg-transparent border-none focus:outline-none cursor-pointer pr-1"
                aria-label="Select Payroll Month"
              >
                {MONTH_NAMES.map((name, idx) => (
                  <option key={idx} value={idx}>
                    {name}
                  </option>
                ))}
              </select>

              <span className="text-slate-300 font-light">|</span>

              {/* Year Selector */}
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(Number(e.target.value))}
                className="text-xs font-bold text-slate-800 bg-transparent border-none focus:outline-none cursor-pointer pl-1"
                aria-label="Select Payroll Year"
              >
                {[2024, 2025, 2026, 2027].map((yr) => (
                  <option key={yr} value={yr}>
                    {yr}
                  </option>
                ))}
              </select>
            </div>

            {/* Quick Reset Button if not default */}
            {(selectedCountry !== 'all' || selectedMonth !== 8 || selectedYear !== 2026) && (
              <button
                type="button"
                onClick={() => {
                  handleCountryChange('all');
                  setSelectedMonth(8);
                  setSelectedYear(2026);
                }}
                title="Reset filters to September 2026 (All)"
                className="p-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </motion.div>

      {/* 2. Top 4 Metric KPI Cards - Dynamically updated by filters (EXCEPT Global Workforce) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {/* Card 1: Total Payroll (Changes based on Country + Month + Year) */}
        <motion.div
          variants={itemVariants}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs relative transition hover:shadow-xs hover:border-slate-300"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-11 h-11 rounded-xl bg-blue-500 text-white flex items-center justify-center shadow-xs">
              <Wallet className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider bg-slate-100 px-2 py-0.5 rounded-full">
              {selectedCountry === 'IN' ? 'INR (₹)' : 'USD ($)'}
            </span>
          </div>
          <p className="text-xs font-medium text-slate-500">
            Total Payroll ({currentShortMonth} {selectedYear})
          </p>
          <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-1">
            {selectedCountry === 'IN'
              ? formatCurrency(calculatedPayrollIN_INR, 'INR')
              : selectedCountry === 'US'
                ? formatCurrency(calculatedPayrollUS, 'USD')
                : formatCurrency(calculatedPayrollAll, 'USD')}
          </h3>
          <div className="flex items-center gap-1.5 mt-2.5 text-xs font-semibold text-emerald-600">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>
              {selectedCountry === 'IN'
                ? `≈ ${formatCurrency(calculatedPayrollIN_USD, 'USD')} USD`
                : selectedCountry === 'US'
                  ? 'United States Entity'
                  : 'Multi-entity consolidated'}
            </span>
          </div>
        </motion.div>

        {/* Card 2: Total Global Workforce */}
        <motion.div
          variants={itemVariants}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs relative transition hover:shadow-xs hover:border-slate-300"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-11 h-11 rounded-xl bg-emerald-500 text-white flex items-center justify-center shadow-xs">
              <Users className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              2 Global Hubs
            </span>
          </div>
          <p className="text-xs font-medium text-slate-500">Total Global Workforce</p>
          <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-1">
            {stats ? (stats.total_active_employees || 10000).toLocaleString() : '10,000'}
          </h3>
          <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-semibold">
            <span className="text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md text-[11px]">
              🇺🇸 US: 69%
            </span>
            <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md text-[11px]">
              🇮🇳 India: 31%
            </span>
          </div>
        </motion.div>

        {/* Card 3: Average Monthly Salary */}
        <motion.div
          variants={itemVariants}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs relative transition hover:shadow-xs hover:border-slate-300"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-11 h-11 rounded-xl bg-indigo-500 text-white flex items-center justify-center shadow-xs">
              <DollarSign className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border bg-indigo-50 text-indigo-700 border-indigo-200">
              Active Baseline
            </span>
          </div>
          <p className="text-xs font-medium text-slate-500">Average Monthly Salary</p>
          <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-1">
            {selectedCountry === 'IN'
              ? formatCurrency(Math.round(calculatedPayrollIN_INR / Math.max(1, (stats?.total_active_employees || 10000) * 0.31)), 'INR')
              : selectedCountry === 'US'
                ? formatCurrency(Math.round(calculatedPayrollUS / Math.max(1, (stats?.total_active_employees || 10000) * 0.69)), 'USD')
                : formatCurrency(Math.round(calculatedPayrollAll / Math.max(1, (stats?.total_active_employees || 10000))), 'USD')}
          </h3>
          <div className="flex items-center gap-1.5 mt-2.5 text-xs font-semibold text-slate-500">
            <Clock className="w-3.5 h-3.5 text-indigo-500" />
            <span>Per employee across {countryLabel}</span>
          </div>
        </motion.div>

        {/* Card 4: Employees Needing Review */}
        <motion.div
          variants={itemVariants}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs relative transition hover:shadow-xs hover:border-slate-300"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-11 h-11 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-xs">
              <UserCheck className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
              Review Queue
            </span>
          </div>
          <p className="text-xs font-medium text-slate-500">Employees Needing Review</p>
          <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-1">
            {stats ? stats.pending_salaries_count.toLocaleString() : '142'} <span className="text-sm font-normal text-slate-500">Employees</span>
          </h3>
          <div className="flex items-center gap-1.5 mt-2.5 text-xs font-semibold text-slate-500">
            <span>Eligible for periodic salary revision</span>
          </div>
        </motion.div>
      </div>

      {/* 3. Multi-Country Operations Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Country Hub 1: India */}
        <motion.div
          variants={itemVariants}
          className="bg-gradient-to-br from-white to-emerald-50/40 p-5 rounded-2xl border border-emerald-200/80 shadow-2xs hover:shadow-xs transition flex flex-col justify-between"
        >
          <div>
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex items-center gap-3">
                <span className="text-3xl">🇮🇳</span>
                <div>
                  <h4 className="font-extrabold text-slate-900 text-base">India Operations</h4>
                  <p className="text-xs text-slate-500 font-medium">Bengaluru Tech Hub &bull; Currency: INR (₹)</p>
                </div>
              </div>
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                31% of Workforce
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 my-4 text-xs">
              <div className="bg-white/80 p-2.5 rounded-xl border border-emerald-100">
                <span className="text-[10px] text-slate-400 font-semibold block uppercase">Headcount</span>
                <span className="text-base font-bold font-mono text-slate-900">
                  {stats ? Math.round((stats.total_active_employees || 10000) * 0.31).toLocaleString() : '3,100'}
                </span>
              </div>
              <div className="bg-white/80 p-2.5 rounded-xl border border-emerald-100">
                <span className="text-[10px] text-slate-400 font-semibold block uppercase">Est. Monthly Cost</span>
                <span className="text-base font-bold font-mono text-emerald-700">
                  {formatCurrency(calculatedPayrollIN_INR, 'INR')}
                </span>
              </div>
              <div className="bg-white/80 p-2.5 rounded-xl border border-emerald-100 col-span-2 sm:col-span-1">
                <span className="text-[10px] text-slate-400 font-semibold block uppercase">Pay Structure</span>
                <span className="text-xs font-bold text-slate-800">
                  Base + Allowances
                </span>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-emerald-100/80 flex items-center justify-between">
            <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Monthly Compensation Cycle Active
            </span>
            <span className="text-[10px] font-bold px-2.5 py-1 rounded-md bg-white border border-emerald-200 text-emerald-800 shadow-2xs">
              EPFO Salary Tiers
            </span>
          </div>
        </motion.div>

        {/* Country Hub 2: United States */}
        <motion.div
          variants={itemVariants}
          className="bg-gradient-to-br from-white to-blue-50/40 p-5 rounded-2xl border border-blue-200/80 shadow-2xs hover:shadow-xs transition flex flex-col justify-between"
        >
          <div>
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex items-center gap-3">
                <span className="text-3xl">🇺🇸</span>
                <div>
                  <h4 className="font-extrabold text-slate-900 text-base">United States Operations</h4>
                  <p className="text-xs text-slate-500 font-medium">San Francisco Hub &bull; Currency: USD ($)</p>
                </div>
              </div>
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-blue-100 text-blue-800 border border-blue-300">
                69% of Workforce
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 my-4 text-xs">
              <div className="bg-white/80 p-2.5 rounded-xl border border-blue-100">
                <span className="text-[10px] text-slate-400 font-semibold block uppercase">Headcount</span>
                <span className="text-base font-bold font-mono text-slate-900">
                  {stats ? Math.round((stats.total_active_employees || 10000) * 0.69).toLocaleString() : '6,900'}
                </span>
              </div>
              <div className="bg-white/80 p-2.5 rounded-xl border border-blue-100">
                <span className="text-[10px] text-slate-400 font-semibold block uppercase">Est. Monthly Cost</span>
                <span className="text-base font-bold font-mono text-blue-700">
                  {formatCurrency(calculatedPayrollUS, 'USD')}
                </span>
              </div>
              <div className="bg-white/80 p-2.5 rounded-xl border border-blue-100 col-span-2 sm:col-span-1">
                <span className="text-[10px] text-slate-400 font-semibold block uppercase">Pay Structure</span>
                <span className="text-xs font-bold text-slate-800">
                  Annual Base + Bonus
                </span>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-blue-100/80 flex items-center justify-between">
            <span className="text-[11px] text-blue-700 font-semibold flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Standard Compensation Cycle Active
            </span>
            <span className="text-[10px] font-bold px-2.5 py-1 rounded-md bg-white border border-blue-200 text-blue-800 shadow-2xs">
              USD Leveling Bands
            </span>
          </div>
        </motion.div>
      </div>

      {/* 4. Middle Row: Payroll Trend (uses filters), Salary Breakdown Donut (changes with filter), Calendar (month/year based) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Trend Area Chart (5 Cols) - Uses Filtered Country, Month & Year */}
        <motion.div
          variants={itemVariants}
          className="lg:col-span-5 bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col justify-between"
        >
          <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
            <div>
              <h4 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                <span>Payroll Trend</span>
              </h4>
              <p className="text-[11px] text-slate-400">
                {countryLabel} &bull; Ending {currentShortMonth} {selectedYear} ({activeTrendCurrency})
              </p>
            </div>

            {/* Range Toggle */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
              <button
                type="button"
                onClick={() => setTrendPeriod('6m')}
                className={cn(
                  "px-2.5 py-1 rounded-md text-xs font-bold transition",
                  trendPeriod === '6m' ? "bg-white text-slate-900 shadow-2xs" : "text-slate-500 hover:text-slate-800"
                )}
              >
                Last 6M
              </button>
              <button
                type="button"
                onClick={() => setTrendPeriod('12m')}
                className={cn(
                  "px-2.5 py-1 rounded-md text-xs font-bold transition",
                  trendPeriod === '12m' ? "bg-white text-slate-900 shadow-2xs" : "text-slate-500 hover:text-slate-800"
                )}
              >
                Last 12M
              </button>
            </div>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dynamicTrendData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="payrollGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis
                  stroke="#94a3b8"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(val) => {
                    if (selectedCountry === 'IN') {
                      return `₹${(val / 10000000).toFixed(0)}Cr`;
                    }
                    if (val >= 1000000) return `$${(val / 1000000).toFixed(1)}M`;
                    return `$${Math.round(val / 1000)}K`;
                  }}
                />
                <Tooltip
                  formatter={(val: any) => [
                    formatCurrency(Number(val), activeTrendCurrency),
                    `${countryLabel} Payroll`
                  ]}
                  contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                />
                <Area
                  type="monotone"
                  dataKey={selectedCountry === 'IN' ? 'local_amount' : 'amount'}
                  stroke="#2563eb"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#payrollGradient)"
                  dot={{ r: 3.5, fill: '#2563eb', strokeWidth: 1.5, stroke: '#fff' }}
                  activeDot={{ r: 5, fill: '#1d4ed8' }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Donut Salary Breakdown (4 Cols) - Changes with filter */}
        <motion.div
          variants={itemVariants}
          className="lg:col-span-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col justify-between"
        >
          <div className="flex items-center justify-between mb-2">
            <div>
              <h4 className="font-bold text-slate-900 text-sm">Compensation Composition</h4>
              <p className="text-[11px] text-slate-400">{countryLabel} &bull; {currentShortMonth} {selectedYear}</p>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
              {breakdownCurrency}
            </span>
          </div>

          <div className="relative flex items-center justify-center my-2">
            <div className="w-44 h-44">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={dynamicBreakdownData}
                    cx="50%"
                    cy="50%"
                    innerRadius={52}
                    outerRadius={76}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {dynamicBreakdownData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={BREAKDOWN_COLORS[index % BREAKDOWN_COLORS.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="absolute flex flex-col items-center justify-center text-center px-2">
              <span className="text-[10px] font-medium text-slate-400">Total Base</span>
              <span className="text-xs font-extrabold text-slate-900 truncate max-w-[100px]">
                {breakdownTotalFormatted}
              </span>
            </div>
          </div>

          <div className="space-y-1.5 text-xs pt-1 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-slate-600">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                <span>Base Salary (75%)</span>
              </div>
              <span className="font-semibold text-slate-800">
                {formatCurrency(breakdownNet, breakdownCurrency)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-slate-600">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
                <span>Allowances & Benefits (15%)</span>
              </div>
              <span className="font-semibold text-slate-800">
                {formatCurrency(breakdownDeductions, breakdownCurrency)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-slate-600">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span>Bonus Target & Merit (10%)</span>
              </div>
              <span className="font-semibold text-slate-800">
                {formatCurrency(Math.round(breakdownNet * 0.12), breakdownCurrency)}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Payroll Calendar (3 Cols) - Based strictly on Month & Year selection */}
        <motion.div
          variants={itemVariants}
          className="lg:col-span-3 bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col justify-between"
        >
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-bold text-slate-900 text-sm">Payroll Calendar</h4>
            <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">
              {currentShortMonth} {selectedYear}
            </span>
          </div>

          <div className="space-y-2">
            <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold text-slate-400">
              <span>S</span><span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span>
            </div>
            <div className="grid grid-cols-7 gap-1 text-center text-xs">
              {calendarCells.map((item, idx) => (
                <div
                  key={idx}
                  className={cn(
                    "h-7 flex items-center justify-center rounded-lg font-medium transition",
                    item.isPrev || item.isNext ? "text-slate-300" : "text-slate-700",
                    item.isPayday && "bg-blue-600 text-white font-bold shadow-xs",
                    item.isUpcoming && "bg-emerald-50 text-emerald-700 font-bold border border-emerald-200"
                  )}
                >
                  {item.day}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-around text-xs text-slate-500">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
              <span>Mid-month (15th)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span>Close ({daysInSelectedMonth}th)</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* 5. Bottom Row: Employee Payroll Table (Filters has Country & Month only; Whole 30 days used, breadcrumb removed) */}
      <motion.div
        variants={itemVariants}
        className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden flex flex-col"
      >
        {/* Table Header Controls */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-bold text-slate-900 text-base">Salary Review Register</h4>
              {isPageLoading && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[11px] font-semibold animate-pulse">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                  Updating...
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400">
              Active employee base compensation records and scheduled adjustments
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Filters Button (Toggles Country & Month only, does NOT take to Reports) */}
            <button
              type="button"
              onClick={() => setIsTableFilterOpen(prev => !prev)}
              className={cn(
                "inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-semibold transition min-h-[38px] cursor-pointer",
                isTableFilterOpen
                  ? "bg-blue-50 border-blue-300 text-blue-700"
                  : "border-slate-200 hover:bg-slate-50 text-slate-700"
              )}
            >
              <Filter className="w-3.5 h-3.5" />
              <span>Filters</span>
              {(selectedCountry !== 'all' || selectedMonth !== 8) && (
                <span className="w-2 h-2 rounded-full bg-blue-600" />
              )}
            </button>

            {/* CSV Export */}
            <button
              type="button"
              onClick={() => {
                const csvContent = "data:text/csv;charset=utf-8,"
                  + "Code,FirstName,LastName,Role,Department,Salary,Currency\n"
                  + displayEmployees.map(e => `${e.employee_code},"${e.first_name}","${e.last_name}","${e.role_title}","${e.department_name}",${e.current_salary},${e.currency_code}`).join("\n");
                const encodedUri = encodeURI(csvContent);
                const link = document.createElement("a");
                link.setAttribute("href", encodedUri);
                link.setAttribute("download", `salary_register_${tableShortMonth}_${tableYear}.csv`);
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 transition min-h-[38px]"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span>Export</span>
            </button>

            <button
              type="button"
              onClick={onViewEmployees || onRunPayroll}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition min-h-[38px]"
            >
              <Users className="w-3.5 h-3.5" />
              <span>Manage Salaries</span>
            </button>
          </div>
        </div>

        {/* In-Table Filter Toolbar (COUNTRIES AND MONTH ONLY) */}
        {isTableFilterOpen && (
          <div className="p-3 sm:px-5 bg-slate-50/90 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs animate-fadeIn">
            <div className="flex flex-wrap items-center gap-3">
              <span className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">Table Filters:</span>

              {/* Country Selection */}
              <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-slate-200 shadow-2xs">
                <span className="text-[11px] font-semibold text-slate-400 pl-1.5 pr-0.5">Country:</span>
                <button
                  type="button"
                  onClick={() => handleTableCountryChange('all')}
                  className={cn(
                    "px-2.5 py-1 rounded text-xs font-bold transition",
                    tableCountry === 'all' ? "bg-blue-600 text-white shadow-2xs" : "text-slate-600 hover:text-slate-900"
                  )}
                >
                  All
                </button>
                <button
                  type="button"
                  onClick={() => handleTableCountryChange('US')}
                  className={cn(
                    "px-2.5 py-1 rounded text-xs font-bold transition flex items-center gap-1",
                    tableCountry === 'US' ? "bg-blue-600 text-white shadow-2xs" : "text-slate-600 hover:text-slate-900"
                  )}
                >
                  <span>🇺🇸</span> US
                </button>
                <button
                  type="button"
                  onClick={() => handleTableCountryChange('IN')}
                  className={cn(
                    "px-2.5 py-1 rounded text-xs font-bold transition flex items-center gap-1",
                    tableCountry === 'IN' ? "bg-blue-600 text-white shadow-2xs" : "text-slate-600 hover:text-slate-900"
                  )}
                >
                  <span>🇮🇳</span> India
                </button>
              </div>

              {/* Month Selection */}
              <div className="flex items-center gap-1.5 bg-white px-2.5 py-1 rounded-lg border border-slate-200 shadow-2xs">
                <span className="text-[11px] font-semibold text-slate-400">Month:</span>
                <select
                  value={tableMonth}
                  onChange={(e) => setTableMonth(Number(e.target.value))}
                  className="text-xs font-bold text-slate-800 bg-transparent border-none focus:outline-none cursor-pointer"
                >
                  {MONTH_NAMES.map((name, idx) => (
                    <option key={idx} value={idx}>
                      {name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Year Selection */}
              <div className="flex items-center gap-1.5 bg-white px-2.5 py-1 rounded-lg border border-slate-200 shadow-2xs">
                <span className="text-[11px] font-semibold text-slate-400">Year:</span>
                <select
                  value={tableYear}
                  onChange={(e) => setTableYear(Number(e.target.value))}
                  className="text-xs font-bold text-slate-800 bg-transparent border-none focus:outline-none cursor-pointer"
                >
                  {[2024, 2025, 2026, 2027].map((yr) => (
                    <option key={yr} value={yr}>
                      {yr}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsTableFilterOpen(false)}
              className="text-xs font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-1 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
              <span>Dismiss</span>
            </button>
          </div>
        )}

        {/* Mobile Payroll Card List (< md) */}
        <div className="block md:hidden divide-y divide-slate-100">
          {displayEmployees.slice(0, 5).map((emp, idx) => {
            const gross = emp.current_salary ? Math.round(emp.current_salary / 12) : 7500;
            const deductions = Math.round(gross * 0.12);
            const bonus = idx === 0 ? 500 : idx === 1 ? 300 : idx === 2 ? 250 : 200;
            const net = gross - deductions + bonus;
            const payDate = idx % 2 === 0
              ? `${currentShortMonth} 15, ${selectedYear}`
              : `${currentShortMonth} ${daysInSelectedMonth}, ${selectedYear}`;

            return (
              <div
                key={emp.id}
                onClick={() => onSelectEmployee(emp)}
                className="p-4 hover:bg-slate-50 cursor-pointer transition space-y-2.5"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs shrink-0 border border-blue-200">
                      {getInitials(emp.first_name, emp.last_name)}
                    </div>
                    <div>
                      <p className="font-extrabold text-slate-900 text-sm leading-tight">
                        {emp.first_name} {emp.last_name}
                      </p>
                      <p className="text-[11px] text-slate-500">{emp.role_title} · <span className="text-slate-400">{emp.department_name}</span></p>
                    </div>
                  </div>
                  {getStatusBadge(emp.employment_status, idx)}
                </div>

                {/* Days Worked: 30 / 30 Days (Breadcrumbs removed) */}
                <div className="p-2.5 bg-slate-50 rounded-xl flex items-center justify-between text-xs">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Days Worked / Total</span>
                  <span className="font-extrabold text-slate-800">30 / 30 Days</span>
                </div>

                <div className="grid grid-cols-2 gap-2 p-2.5 bg-slate-50 rounded-xl text-xs">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Gross / Month</span>
                    <span className="font-bold text-slate-700">{formatCurrency(gross, emp.currency_code)}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Net Pay</span>
                    <span className="font-extrabold text-slate-900">{formatCurrency(net, emp.currency_code)}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                  <span>Pay date: <b className="text-slate-600">{payDate}</b></span>
                  <span className="text-blue-600 font-semibold flex items-center gap-0.5">
                    View details <ChevronRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Desktop Table Content (>= md) */}
        <div className="hidden md:block overflow-x-auto min-h-[360px] relative">
          {isPageLoading && (
            <div className="absolute inset-0 bg-white/70 backdrop-blur-2xs z-20 flex items-center justify-center transition-all duration-200">
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white shadow-lg border border-slate-200 text-xs font-bold text-slate-800">
                <span className="w-3.5 h-3.5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                <span>Loading payroll records...</span>
              </div>
            </div>
          )}

          <table className="w-full text-left text-xs table-fixed">
            <thead className="bg-slate-50 text-slate-500 font-semibold uppercase text-[11px] border-b border-slate-200">
              <tr>
                <th className="py-3 px-3 w-14 text-center">Avatar</th>
                <th className="py-3 px-4 w-44">Employee Name</th>
                <th className="py-3 px-4 w-44">Role</th>
                <th className="py-3 px-3 w-32">Department</th>
                <th className="py-3 px-4 w-44">Days Worked / Total</th>
                <th className="py-3 px-3 w-28">Gross Salary</th>
                <th className="py-3 px-3 w-24">Deductions</th>
                <th className="py-3 px-3 w-28">Net Pay</th>
                <th className="py-3 px-3 w-28">Status</th>
                <th className="py-3 px-3 w-28">Pay Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {displayEmployees.slice(0, 5).map((emp, idx) => {
                const gross = emp.current_salary ? Math.round(emp.current_salary / 12) : 7500;
                const deductions = Math.round(gross * 0.12);
                const bonus = idx === 0 ? 500 : idx === 1 ? 300 : idx === 2 ? 250 : 200;
                const net = gross - deductions + bonus;
                const payDate = idx % 2 === 0
                  ? `${tableShortMonth} 15, ${tableYear}`
                  : `${tableShortMonth} ${tableDaysInMonth}, ${tableYear}`;

                return (
                  <tr
                    key={emp.id}
                    onClick={() => onSelectEmployee(emp)}
                    className="hover:bg-blue-50/40 cursor-pointer transition h-[64px]"
                  >
                    {/* Avatar */}
                    <td className="py-3 px-3 text-center">
                      <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs mx-auto border border-blue-200/80 shadow-2xs">
                        {getInitials(emp.first_name, emp.last_name)}
                      </div>
                    </td>

                    {/* Separated Employee Name */}
                    <td className="py-3 px-4 font-extrabold text-slate-900">
                      <p className="leading-tight text-slate-900">{emp.first_name} {emp.last_name}</p>
                      <span className="text-[10px] font-semibold text-slate-400 font-mono">
                        {emp.employee_code}
                      </span>
                    </td>

                    {/* Role Title */}
                    <td className="py-3 px-4 font-medium text-slate-700 truncate">
                      {emp.role_title}
                    </td>

                    {/* Department */}
                    <td className="py-3 px-3 font-medium text-slate-600 truncate">
                      {emp.department_name || 'Engineering'}
                    </td>

                    {/* Whole 30 days used, breadcrumbs removed */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5 font-extrabold text-slate-800">
                        <CalendarDays className="w-3.5 h-3.5 text-blue-600" />
                        <span>30 / 30 Days</span>
                      </div>
                    </td>

                    {/* Financial Figures */}
                    <td className="py-3 px-3 font-semibold text-slate-800">
                      {formatCurrency(gross, emp.currency_code)}
                    </td>
                    <td className="py-3 px-3 text-slate-500">
                      {formatCurrency(deductions, emp.currency_code)}
                    </td>
                    <td className="py-3 px-3 font-extrabold text-slate-900">
                      {formatCurrency(net, emp.currency_code)}
                    </td>

                    {/* Status & Pay Date */}
                    <td className="py-3 px-3">
                      {getStatusBadge(emp.employment_status, idx)}
                    </td>
                    <td className="py-3 px-3 text-slate-500 font-medium text-[11px]">
                      {payDate}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Table Pagination Controls */}
        <div className="p-3.5 sm:p-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 bg-slate-50/40">
          <p>
            Showing {((dashboardPage - 1) * 10) + 1} to {Math.min(dashboardPage * 10, totalEmployeesCount)} of {totalEmployeesCount.toLocaleString()} employees
          </p>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              disabled={dashboardPage <= 1 || isPageLoading}
              onClick={() => handlePageChange(dashboardPage - 1)}
              className="px-3 py-2 rounded-xl border border-slate-200 flex items-center justify-center hover:bg-slate-50 disabled:opacity-40 min-h-[38px] min-w-[38px] font-bold transition cursor-pointer"
              aria-label="Previous page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => handlePageChange(1)}
              className={cn(
                "w-9 h-9 rounded-xl font-bold flex items-center justify-center min-h-[38px] min-w-[38px] transition cursor-pointer",
                dashboardPage === 1 ? "bg-blue-600 text-white shadow-xs" : "border border-slate-200 hover:bg-slate-50"
              )}
            >
              1
            </button>
            {totalPages > 1 && (
              <button
                type="button"
                onClick={() => handlePageChange(2)}
                className={cn(
                  "w-9 h-9 rounded-xl font-bold flex items-center justify-center min-h-[38px] min-w-[38px] transition cursor-pointer",
                  dashboardPage === 2 ? "bg-blue-600 text-white shadow-xs" : "border border-slate-200 hover:bg-slate-50"
                )}
              >
                2
              </button>
            )}
            {totalPages > 3 && <span className="px-1 text-slate-400">...</span>}
            {totalPages > 2 && (
              <button
                type="button"
                onClick={() => handlePageChange(totalPages)}
                className={cn(
                  "w-9 h-9 rounded-xl font-bold flex items-center justify-center min-h-[38px] min-w-[38px] transition cursor-pointer",
                  dashboardPage === totalPages ? "bg-blue-600 text-white shadow-xs" : "border border-slate-200 hover:bg-slate-50"
                )}
              >
                {totalPages}
              </button>
            )}
            <button
              type="button"
              disabled={dashboardPage >= totalPages || isPageLoading}
              onClick={() => handlePageChange(dashboardPage + 1)}
              className="px-3 py-2 rounded-xl border border-slate-200 flex items-center justify-center hover:bg-slate-50 disabled:opacity-40 min-h-[38px] min-w-[38px] font-bold transition cursor-pointer"
              aria-label="Next page"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
