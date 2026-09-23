import React, { useState, useEffect, useCallback } from 'react';
import {
  Users,
  DollarSign,
  TrendingUp,
  Globe,
  Building2,
  Layers,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Filter,
  RefreshCw,
  CheckCircle2,
  Clock,
  Briefcase,
  ChevronRight,
  Activity,
  Award,
  FileCheck2,
  Info,
  Loader2,
  AlertCircle
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  LineChart,
  Line,
  CartesianGrid,
  Legend,
  AreaChart,
  Area
} from 'recharts';
import {
  DashboardResponse,
  Department,
  RecentSalaryChange,
  AnalysisPeriodState,
  PeriodTrendPoint
} from '../types';
import { apiFetch } from '../lib/api';
import { formatCurrency, cn, getInitials } from '../lib/utils';
import { formatAsOfDate, DEFAULT_AS_OF_DATE, loadStoredPeriod } from '../lib/periodUtils';
import { AnalysisPeriodFilter } from './AnalysisPeriodFilter';

interface DashboardViewProps {
  onNavigateToEmployees: (
    countryFilter?: string, 
    deptFilter?: string, 
    options?: { salaryChangedOnly?: boolean; search?: string }
  ) => void;
  onOpenEditSalary?: (employeeId: number) => void;
  onOpenHistory?: (employeeId: number) => void;
  departments: Department[];
  analysisPeriod?: AnalysisPeriodState;
  onPeriodChange?: (nextPeriod: AnalysisPeriodState) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onNavigateToEmployees,
  onOpenEditSalary,
  onOpenHistory,
  departments,
  analysisPeriod: externalPeriod,
  onPeriodChange: externalOnPeriodChange
}) => {
  const [internalPeriod, setInternalPeriod] = useState<AnalysisPeriodState>(() => loadStoredPeriod());
  const periodState = externalPeriod || internalPeriod;

  const handlePeriodChange = (nextPeriod: AnalysisPeriodState) => {
    if (externalOnPeriodChange) {
      externalOnPeriodChange(nextPeriod);
    } else {
      setInternalPeriod(nextPeriod);
    }
  };

  const [selectedCountry, setSelectedCountry] = useState<string>('all');
  const [selectedDept, setSelectedDept] = useState<string>('all');
  const [dashboardData, setDashboardData] = useState<DashboardResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboard = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (selectedCountry !== 'all') params.append('country_code', selectedCountry);
      if (selectedDept !== 'all') params.append('department_id', selectedDept);
      if (periodState.startDate) params.append('start_date', periodState.startDate);
      if (periodState.endDate) params.append('end_date', periodState.endDate);
      if (periodState.asOfDate) params.append('as_of_date', periodState.asOfDate);

      const res = await apiFetch(`/api/dashboard?${params.toString()}`);
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      const data: DashboardResponse = await res.json();
      setDashboardData(data);
      setError(null);
    } catch (err: any) {
      console.error('Failed to load dashboard data:', err);
      setError(err.message || 'Failed to load compensation summary');
    } finally {
      setIsLoading(false);
    }
  }, [selectedCountry, selectedDept, periodState]);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  const COLORS = ['#2563eb', '#3b82f6', '#60a5fa', '#93c5fd', '#bfdbfe', '#dbeafe'];
  const formattedAsOf = formatAsOfDate(periodState.asOfDate);
  const period = dashboardData?.period_analysis;
  const prevComp = period?.previous_period_comparison;

  return (
    <div className="space-y-6 pb-12">
      {/* 1. Minimal Page Header with Shared Analysis Period Filter & Global Filters */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 bg-white px-4 py-3 sm:px-5 sm:py-3.5 rounded-xl border border-slate-200/80 shadow-2xs">
        <div className="min-w-0">
          <h1 className="text-base sm:text-lg font-bold tracking-tight text-slate-900 truncate">
            Compensation Dashboard
          </h1>
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 mt-0.5">
            <span>
              Period: <strong className="text-blue-600 font-semibold">{periodState.label}</strong>
            </span>
            <span className="text-slate-300">•</span>
            <span>
              As of <strong className="text-slate-700 font-semibold">{formattedAsOf}</strong>
            </span>
            <span className="text-slate-300 hidden sm:inline">•</span>
            <span className="text-slate-400 hidden sm:inline font-medium">10,000 Employees</span>
          </div>
        </div>

        {/* Global Filter Bar: All filters preserved */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Analysis Period Filter Dropdown */}
          <AnalysisPeriodFilter
            value={periodState}
            onChange={handlePeriodChange}
            showSubtitle={false}
          />

          {/* Country Selector */}
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 min-h-[38px] sm:min-h-0 flex-1 sm:flex-initial">
            <Globe className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="text-xs font-semibold text-slate-500 whitespace-nowrap hidden sm:inline">Country:</span>
            <select
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              className="bg-transparent text-xs font-bold text-slate-800 focus:outline-none cursor-pointer w-full"
            >
              <option value="all">All Countries</option>
              <option value="IN">India Hub (69%)</option>
              <option value="US">US Hub (31%)</option>
            </select>
          </div>

          {/* Department Selector */}
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 min-h-[38px] sm:min-h-0 flex-1 sm:flex-initial">
            <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="text-xs font-semibold text-slate-500 whitespace-nowrap hidden sm:inline">Dept:</span>
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="bg-transparent text-xs font-bold text-slate-800 focus:outline-none cursor-pointer w-full"
            >
              <option value="all">All Depts</option>
              {departments.map((d) => (
                <option key={d.id} value={String(d.id)}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={() => {
              setSelectedCountry('all');
              setSelectedDept('all');
              fetchDashboard();
            }}
            className="p-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-600 transition min-h-[38px] min-w-[38px] flex items-center justify-center"
            title="Reset filters and refresh metrics"
          >
            <RefreshCw className={cn("w-3.5 h-3.5", isLoading && "animate-spin text-blue-600")} />
          </button>

          <button
            onClick={() => onNavigateToEmployees(selectedCountry, selectedDept)}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition shadow-2xs min-h-[38px] sm:min-h-0"
          >
            <Users className="w-3.5 h-3.5" />
            <span>Directory</span>
          </button>
        </div>
      </div>

      {/* Error Recovery Banner */}
      {error && !dashboardData && !isLoading && (
        <div className="p-6 rounded-2xl bg-white border border-rose-200/90 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-center shrink-0">
              <AlertCircle className="w-5 h-5 text-rose-600" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Dashboard Metrics Unavailable</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {error.includes('401')
                  ? 'Session expired or authentication failed. Click below to reconnect your session and restore organizational metrics.'
                  : error}
              </p>
            </div>
          </div>
          <button
            onClick={() => fetchDashboard()}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-xs transition cursor-pointer shrink-0"
          >
            <RefreshCw className={cn("w-3.5 h-3.5", isLoading && "animate-spin")} />
            <span>Retry Loading</span>
          </button>
        </div>
      )}

      {/* Top Syncing / Loading Banner */}
      {isLoading && dashboardData && (
        <div className="flex items-center justify-between px-4 py-2.5 rounded-2xl bg-blue-50/90 border border-blue-200/80 text-blue-700 text-xs font-semibold animate-pulse shadow-xs">
          <div className="flex items-center gap-2.5">
            <Loader2 className="w-4 h-4 animate-spin text-blue-600 shrink-0" />
            <span>
              Updating metrics for {selectedCountry !== 'all' ? (selectedCountry === 'US' ? 'US Hub' : 'India Hub') : 'All Countries'} &amp; {periodState.label}...
            </span>
          </div>
          <span className="text-[11px] font-mono text-blue-600 hidden sm:inline">Syncing...</span>
        </div>
      )}

      {/* Full Dashboard Loading Skeleton (Rendered until initial dashboardData is loaded) */}
      {isLoading && !dashboardData && (
        <div className="space-y-6">
          {/* Top Initial Loading Banner */}
          <div className="flex items-center justify-between px-4 py-3 rounded-2xl bg-blue-50/90 border border-blue-200/80 text-blue-700 text-xs font-semibold animate-pulse shadow-xs">
            <div className="flex items-center gap-2.5">
              <Loader2 className="w-4 h-4 animate-spin text-blue-600 shrink-0" />
              <span>Loading Organizational Dashboard &amp; Compensation Metrics...</span>
            </div>
            <span className="text-[11px] font-mono text-blue-600 hidden sm:inline">Evaluating 10,000 workforce records...</span>
          </div>

          {/* 1. Current-State KPI Cards Skeleton (5 cards) */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Current-State Metrics
                </span>
                <span className="h-5 w-24 bg-slate-200 rounded-md animate-pulse" />
              </div>
              <span className="h-3 w-32 bg-slate-100 rounded animate-pulse hidden sm:inline" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-4">
              {[
                { title: 'Current Headcount', icon: Users, color: 'text-blue-600 bg-blue-50' },
                { title: 'Total Annual Comp', icon: DollarSign, color: 'text-emerald-600 bg-emerald-50' },
                { title: 'Current Avg Salary', icon: TrendingUp, color: 'text-purple-600 bg-purple-50' },
                { title: 'Median Annual Salary', icon: Award, color: 'text-indigo-600 bg-indigo-50' },
                { title: 'Budget Allocation', icon: Activity, color: 'text-amber-600 bg-amber-50' }
              ].map((item, idx) => (
                <div key={idx} className="bg-white p-3.5 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between animate-pulse">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider">
                      {item.title}
                    </span>
                    <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-xl ${item.color} flex items-center justify-center opacity-70`}>
                      <item.icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </div>
                  </div>
                  <div className="mt-3 space-y-2">
                    <div className="h-7 w-28 bg-slate-200 rounded-lg animate-pulse" />
                    <div className="h-3 w-20 bg-slate-100 rounded animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 2. Period-Controlled Activity Section Skeleton */}
          <div className="bg-slate-50/70 border border-blue-200/70 rounded-2xl p-4 sm:p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-blue-100 pb-3">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-blue-500 animate-pulse" />
                <span className="h-4 w-44 bg-slate-200 rounded animate-pulse" />
                <span className="h-4 w-28 bg-blue-100 rounded-full animate-pulse" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
              {[
                { title: 'Salary Changes in Period', icon: Clock },
                { title: 'Total Annualized Increase', icon: DollarSign },
                { title: 'Average % Adjustment', icon: TrendingUp },
                { title: 'Annualized Payroll Impact', icon: FileCheck2 }
              ].map((m, i) => (
                <div key={i} className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-3 animate-pulse">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{m.title}</span>
                    <m.icon className="w-4 h-4 text-slate-300" />
                  </div>
                  <div className="h-7 w-24 bg-slate-200 rounded animate-pulse" />
                  <div className="h-3 w-32 bg-slate-100 rounded animate-pulse" />
                </div>
              ))}
            </div>

            {/* Charts Skeleton */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pt-2">
              <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 space-y-3 animate-pulse">
                <div className="flex items-center justify-between">
                  <div className="h-4 w-44 bg-slate-200 rounded" />
                  <div className="h-5 w-20 bg-blue-50 rounded-lg" />
                </div>
                <div className="h-56 w-full bg-slate-50/70 rounded-xl flex items-center justify-center border border-dashed border-slate-200">
                  <div className="flex flex-col items-center gap-2 text-slate-400">
                    <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
                    <span className="text-xs font-medium">Computing monthly compensation curve...</span>
                  </div>
                </div>
              </div>

              <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 space-y-3 animate-pulse">
                <div className="flex items-center justify-between">
                  <div className="h-4 w-44 bg-slate-200 rounded" />
                  <div className="h-5 w-24 bg-emerald-50 rounded-lg" />
                </div>
                <div className="h-56 w-full bg-slate-50/70 rounded-xl flex items-center justify-center border border-dashed border-slate-200">
                  <div className="flex flex-col items-center gap-2 text-slate-400">
                    <Loader2 className="w-5 h-5 animate-spin text-emerald-600" />
                    <span className="text-xs font-medium">Loading adjustment frequency distribution...</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 3. Distribution & Breakdowns Skeletons */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4 animate-pulse">
              <div className="flex items-center justify-between">
                <div className="h-5 w-52 bg-slate-200 rounded" />
                <div className="h-5 w-20 bg-slate-100 rounded" />
              </div>
              <div className="h-64 w-full bg-slate-50 rounded-xl flex items-center justify-center border border-dashed border-slate-200">
                <div className="flex flex-col items-center gap-2 text-slate-400">
                  <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
                  <span className="text-xs font-medium">Aggregating departmental compensation...</span>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-12 bg-slate-50 rounded-xl border border-slate-100 animate-pulse" />
                ))}
              </div>
            </div>

            <div className="lg:col-span-5 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4 animate-pulse">
              <div className="flex items-center justify-between">
                <div className="h-5 w-44 bg-slate-200 rounded" />
                <div className="h-5 w-20 bg-slate-100 rounded" />
              </div>
              <div className="h-64 w-full bg-slate-50 rounded-xl flex items-center justify-center border border-dashed border-slate-200">
                <div className="flex flex-col items-center gap-2 text-slate-400">
                  <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
                  <span className="text-xs font-medium">Computing country hub breakdown...</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="h-16 bg-slate-50 rounded-xl border border-slate-100 animate-pulse" />
                <div className="h-16 bg-slate-50 rounded-xl border border-slate-100 animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. CURRENT-STATE METRICS (Labeled As of [date] according to spec) */}
      {dashboardData && (
        <div className={cn("space-y-6 transition-opacity duration-200", isLoading && "opacity-75 pointer-events-none")}>
          <div className="space-y-2.5">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Current-State Metrics
              </span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                As of {formattedAsOf}
              </span>
            </div>
            <span className="text-[11px] text-slate-400 hidden sm:inline">
              Point-in-time organizational snapshot
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-4">
            {/* Current Employee Count */}
            <div className="bg-white p-3.5 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between hover:border-blue-200 transition">
              <div className="flex items-center justify-between">
                <span className="text-[11px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Current Headcount
                </span>
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                  {isLoading ? (
                    <Loader2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-spin text-blue-600" />
                  ) : (
                    <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  )}
                </div>
              </div>
              <div className="mt-2 sm:mt-3">
                <div className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  {dashboardData.total_employees.toLocaleString()}
                </div>
                <p className="text-[10px] sm:text-[11px] text-slate-500 font-medium mt-0.5 truncate">
                  As of {formattedAsOf}
                </p>
              </div>
            </div>

            {/* Current Total Annual Compensation */}
            <div className="bg-white p-3.5 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between hover:border-blue-200 transition">
              <div className="flex items-center justify-between">
                <span className="text-[11px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Total Annual Comp
                </span>
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                  {isLoading ? (
                    <Loader2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-spin text-emerald-600" />
                  ) : (
                    <DollarSign className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  )}
                </div>
              </div>
              <div className="mt-2 sm:mt-3">
                <div className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  ${(dashboardData.total_annual_compensation_usd / 1000000).toFixed(2)}M
                </div>
                <p className="text-[10px] sm:text-[11px] text-emerald-600 font-semibold mt-0.5 truncate">
                  As of {formattedAsOf}
                </p>
              </div>
            </div>

            {/* Current Average Salary */}
            <div className="bg-white p-3.5 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between hover:border-blue-200 transition">
              <div className="flex items-center justify-between">
                <span className="text-[11px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Current Avg Salary
                </span>
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                  {isLoading ? (
                    <Loader2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-spin text-purple-600" />
                  ) : (
                    <TrendingUp className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  )}
                </div>
              </div>
              <div className="mt-2 sm:mt-3">
                <div className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  ${dashboardData.average_annual_salary_usd.toLocaleString()}
                </div>
                <p className="text-[10px] sm:text-[11px] text-slate-500 font-medium mt-0.5 truncate">
                  As of {formattedAsOf}
                </p>
              </div>
            </div>

            {/* Current Median Salary */}
            <div className="bg-white p-3.5 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between hover:border-blue-200 transition">
              <div className="flex items-center justify-between">
                <span className="text-[11px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Current Median Salary
                </span>
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                  {isLoading ? (
                    <Loader2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-spin text-indigo-600" />
                  ) : (
                    <Layers className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  )}
                </div>
              </div>
              <div className="mt-2 sm:mt-3">
                <div className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  ${dashboardData.median_annual_salary_usd.toLocaleString()}
                </div>
                <p className="text-[10px] sm:text-[11px] text-slate-500 font-medium mt-0.5 truncate">
                  As of {formattedAsOf}
                </p>
              </div>
            </div>

            {/* Current Hubs Breakdown */}
            <div className="bg-white p-3.5 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between hover:border-blue-200 transition col-span-1 sm:col-span-2 md:col-span-1">
              <div className="flex items-center justify-between">
                <span className="text-[11px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Countries
                </span>
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                  {isLoading ? (
                    <Loader2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-spin text-amber-600" />
                  ) : (
                    <Globe className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  )}
                </div>
              </div>
              <div className="mt-2 sm:mt-3">
                <div className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  {dashboardData.countries_count} Entities
                </div>
                <p className="text-[10px] sm:text-[11px] text-amber-600 font-semibold mt-0.5 truncate">
                  India (69%) & US (31%)
                </p>
              </div>
            </div>
          </div>
        </div>

      {/* 3. PERIOD-CONTROLLED ACTIVITY METRICS SECTION */}
      {period && (
        <div className="bg-slate-50/70 border border-blue-200/70 rounded-2xl p-4 sm:p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-blue-100 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-blue-600" />
                <h2 className="text-sm sm:text-base font-bold text-slate-900">
                  Analysis Period Activity: {period.period_label}
                </h2>
                <span className="px-2 py-0.5 text-[10px] font-extrabold uppercase rounded-full bg-blue-100 text-blue-700">
                  {period.is_snapshot ? 'Real-Time Snapshot' : `${period.start_date} → ${period.end_date}`}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {period.is_snapshot
                  ? 'Showing live organizational state as of today. Select a review period (e.g. Last 6 months) to analyze adjustment velocity and cycle comparisons.'
                  : `Metrics, salary changes, review activity, and trend curves filtered for ${period.period_label}.`}
              </p>
            </div>

            {prevComp?.has_previous_data && (
              <div className="text-xs text-slate-600 bg-white border border-slate-200/80 px-3 py-1.5 rounded-xl shadow-2xs">
                <span>Compared with previous cycle: </span>
                <strong className="text-slate-900">{prevComp.previous_start_date} to {prevComp.previous_end_date}</strong>
              </div>
            )}
          </div>

          {/* 4 Period-Controlled Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {/* Metric 1: Salary Changes in Period */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase">
                <span>Salary Changes in Period</span>
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
                ) : (
                  <Clock className="w-4 h-4 text-blue-500" />
                )}
              </div>
              <div className="flex items-baseline gap-2">
                <div className="text-2xl font-black text-slate-900 tracking-tight">
                  {period.salary_changes_count.toLocaleString()}
                </div>
                <span className="text-xs text-slate-400 font-medium">modifications</span>
              </div>
              {prevComp?.has_previous_data ? (
                <div className="flex items-center gap-1.5 text-[11px] font-semibold">
                  <span className={cn(
                    "px-1.5 py-0.5 rounded flex items-center gap-0.5",
                    (prevComp.salary_change_count_change_pct || 0) >= 0
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-rose-50 text-rose-700"
                  )}>
                    {(prevComp.salary_change_count_change_pct || 0) >= 0 ? '+' : ''}
                    {prevComp.salary_change_count_change_pct}%
                  </span>
                  <span className="text-slate-500">vs prev {prevComp.previous_salary_change_count} changes</span>
                </div>
              ) : (
                <p className="text-[11px] text-slate-400 font-medium">
                  {period.is_snapshot ? 'No adjustments in point snapshot' : 'No prior baseline data'}
                </p>
              )}
            </div>

            {/* Metric 2: Average Salary Adjustment */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase">
                <span>Avg Salary Adjustment</span>
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin text-emerald-500" />
                ) : (
                  <TrendingUp className="w-4 h-4 text-emerald-500" />
                )}
              </div>
              <div className="flex items-baseline gap-2">
                <div className="text-2xl font-black text-slate-900 tracking-tight">
                  {period.average_salary_adjustment_pct > 0 ? `+${period.average_salary_adjustment_pct}%` : `${period.average_salary_adjustment_pct}%`}
                </div>
                <span className="text-xs text-slate-400 font-medium">mean delta</span>
              </div>
              {prevComp?.has_previous_data ? (
                <div className="flex items-center gap-1.5 text-[11px] font-semibold">
                  <span className="text-slate-600">
                    Prior cycle: {prevComp.previous_avg_adjustment_pct}%
                  </span>
                  <span className="text-slate-400">
                    ({(prevComp.avg_adjustment_pct_difference || 0) >= 0 ? '+' : ''}{prevComp.avg_adjustment_pct_difference}% diff)
                  </span>
                </div>
              ) : (
                <p className="text-[11px] text-slate-400 font-medium">
                  {period.is_snapshot ? 'Calculated on review periods' : 'Historical average'}
                </p>
              )}
            </div>

            {/* Metric 3: Total Annualized Compensation Increase */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase">
                <span>Total Annualized Increase</span>
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin text-purple-500" />
                ) : (
                  <DollarSign className="w-4 h-4 text-purple-500" />
                )}
              </div>
              <div className="flex items-baseline gap-2">
                <div className="text-2xl font-black text-slate-900 tracking-tight">
                  +${(period.total_annualized_increase_usd / 1000000).toFixed(2)}M
                </div>
                <span className="text-xs text-slate-400 font-medium">annual USD</span>
              </div>
              {prevComp?.has_previous_data ? (
                <div className="flex items-center gap-1.5 text-[11px] font-semibold">
                  <span className={cn(
                    "px-1.5 py-0.5 rounded",
                    (prevComp.total_increase_usd_change_pct || 0) >= 0
                      ? "bg-purple-50 text-purple-700"
                      : "bg-slate-100 text-slate-600"
                  )}>
                    {(prevComp.total_increase_usd_change_pct || 0) >= 0 ? '+' : ''}
                    {prevComp.total_increase_usd_change_pct}%
                  </span>
                  <span className="text-slate-500">vs prev cycle</span>
                </div>
              ) : (
                <p className="text-[11px] text-slate-400 font-medium">
                  Incremental budget impact
                </p>
              )}
            </div>

            {/* Metric 4: Review Activity Breakdown */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase">
                <span>Review Activity</span>
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                ) : (
                  <FileCheck2 className="w-4 h-4 text-blue-600" />
                )}
              </div>
              <div className="flex items-baseline gap-2">
                <div className="text-2xl font-black text-slate-900 tracking-tight">
                  {period.review_activity.total_reviews}
                </div>
                <span className="text-xs text-slate-400 font-medium">total logged</span>
              </div>
              <div className="flex flex-wrap gap-1 text-[10px] font-bold">
                <span className="px-1.5 py-0.5 rounded bg-blue-50 text-blue-700">
                  Annual: {period.review_activity.annual_review_count}
                </span>
                <span className="px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700">
                  Promo: {period.review_activity.promotion_count}
                </span>
                <span className="px-1.5 py-0.5 rounded bg-amber-50 text-amber-700">
                  Market: {period.review_activity.market_adjustment_count}
                </span>
              </div>
            </div>
          </div>

          {/* Two Separate Charts: Monthly Compensation Trend & Salary Adjustment Volume */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Chart 1: Monthly Compensation Trend */}
            <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 space-y-3">
              {(() => {
                const trendData = (period.trend_points || []).map((pt) => ({
                  label: pt.date_label,
                  payroll_m: Number((pt.payroll_usd / 1000000).toFixed(2)),
                  increase_k: Math.round(pt.total_increase_usd / 1000)
                }));
                const firstPayroll = trendData[0]?.payroll_m || 0;
                const lastPayroll = trendData[trendData.length - 1]?.payroll_m || 0;
                const totalChangeM = Number((lastPayroll - firstPayroll).toFixed(2));
                const totalChangePct = firstPayroll > 0 ? Number(((totalChangeM / firstPayroll) * 100).toFixed(1)) : 0;

                return (
                  <>
                    <div className="flex items-center justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-bold text-slate-900">
                            Monthly Compensation Trend
                          </h3>
                          {totalChangeM !== 0 && (
                            <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${totalChangeM > 0 ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'}`}>
                              {totalChangeM > 0 ? `+${totalChangeM}M (+${totalChangePct}%)` : `${totalChangeM}M (${totalChangePct}%)`}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {firstPayroll > 0 && lastPayroll > 0 ? (
                            <span>Run-rate: <strong className="text-slate-700 font-mono">${firstPayroll.toFixed(2)}M</strong> &rarr; <strong className="text-blue-700 font-mono">${lastPayroll.toFixed(2)}M/mo</strong></span>
                          ) : (
                            <span>Monthly compensation ($M) &bull; {period.period_label}</span>
                          )}
                        </p>
                      </div>
                      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 text-xs font-semibold">
                        {isLoading ? (
                          <Loader2 className="w-3 h-3 animate-spin text-blue-600" />
                        ) : (
                          <span className="w-2 h-2 rounded-full bg-blue-600" />
                        )}
                        <span>USD ($M)</span>
                      </div>
                    </div>

                    <div className="h-56 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                          data={trendData}
                          margin={{ top: 10, right: 15, left: -10, bottom: 5 }}
                        >
                          <defs>
                            <linearGradient id="compTrendGradient" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#2563eb" stopOpacity={0.25} />
                              <stop offset="95%" stopColor="#2563eb" stopOpacity={0.0} />
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                          <XAxis dataKey="label" stroke="#94a3b8" fontSize={11} tickLine={false} />
                          <YAxis
                            stroke="#94a3b8"
                            fontSize={11}
                            tickLine={false}
                            domain={[
                              (dataMin: number) => Number((Math.floor((dataMin - 0.2) * 2) / 2).toFixed(1)),
                              (dataMax: number) => Number((Math.ceil((dataMax + 0.2) * 2) / 2).toFixed(1))
                            ]}
                            tickFormatter={(val) => `$${Number(val).toFixed(1)}M`}
                          />
                          <Tooltip
                            content={({ active, payload, label }) => {
                              if (active && payload && payload.length) {
                                const data = payload[0].payload;
                                return (
                                  <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xl text-xs space-y-1.5 min-w-[170px]">
                                    <div className="font-bold text-slate-900 border-b border-slate-100 pb-1">
                                      {label}
                                    </div>
                                    <div className="flex justify-between gap-3">
                                      <span className="text-slate-500">Monthly Comp:</span>
                                      <span className="font-bold text-blue-700 font-mono">${data.payroll_m}M USD</span>
                                    </div>
                                    {data.increase_k > 0 && (
                                      <div className="flex justify-between gap-3 text-[11px] text-slate-500 pt-1 border-t border-slate-100">
                                        <span>Cycle Increase:</span>
                                        <span className="font-semibold text-emerald-700 font-mono">+${data.increase_k}k/yr</span>
                                      </div>
                                    )}
                                  </div>
                                );
                              }
                              return null;
                            }}
                          />
                          <Area
                            type="monotone"
                            dataKey="payroll_m"
                            stroke="#2563eb"
                            strokeWidth={2.5}
                            fillOpacity={1}
                            fill="url(#compTrendGradient)"
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </>
                );
              })()}
            </div>

            {/* Chart 2: Salary Adjustment Volume */}
            <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 space-y-3">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <span>Salary Adjustment Volume</span>
                  </h3>
                  <p className="text-xs text-slate-500">
                    Adjustment events count &bull; {period.period_label}
                  </p>
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 text-xs font-semibold">
                  {isLoading ? (
                    <Loader2 className="w-3 h-3 animate-spin text-emerald-600" />
                  ) : (
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  )}
                  <span>Adjustment Count</span>
                </div>
              </div>

              <div className="h-56 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={period.trend_points.map((pt) => ({
                      label: pt.date_label,
                      adjustments: pt.salary_adjustments_count,
                      avg_pct: pt.avg_adjustment_pct
                    }))}
                    margin={{ top: 10, right: 15, left: -15, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="label" stroke="#94a3b8" fontSize={11} tickLine={false} />
                    <YAxis
                      stroke="#94a3b8"
                      fontSize={11}
                      tickLine={false}
                      tickFormatter={(val) => `${val}`}
                    />
                    <Tooltip
                      content={({ active, payload, label }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xl text-xs space-y-1.5 min-w-[170px]">
                              <div className="font-bold text-slate-900 border-b border-slate-100 pb-1">
                                {label}
                              </div>
                              <div className="flex justify-between gap-3">
                                <span className="text-slate-500">Adjustments:</span>
                                <span className="font-bold text-emerald-700 font-mono">{data.adjustments} logged</span>
                              </div>
                              {data.avg_pct > 0 && (
                                <div className="flex justify-between gap-3 text-[11px] text-slate-500 pt-1 border-t border-slate-100">
                                  <span>Avg Adjustment:</span>
                                  <span className="font-semibold text-slate-800 font-mono">+{data.avg_pct}%</span>
                                </div>
                              )}
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Bar
                      dataKey="adjustments"
                      fill="#10b981"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. CURRENT-STATE DISTRIBUTION & BREAKDOWNS (Labeled As of [date]) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Department Compensation Breakdown (7 cols) - As of [date] */}
        <div className="lg:col-span-7 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <span>Current Department Compensation Breakdown</span>
                  {isLoading && <Loader2 className="w-4 h-4 animate-spin text-blue-600" />}
                </h3>
                <p className="text-xs text-slate-500">
                  Total annual compensation and headcount &bull;{' '}
                  <span className="font-semibold text-slate-700">As of {formattedAsOf}</span>
                </p>
              </div>
              <span className="text-xs font-semibold px-2 py-1 bg-slate-100 text-slate-600 rounded-lg">
                USD Canonical
              </span>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={dashboardData?.department_breakdown.map((d) => ({
                    name: d.department_name,
                    total_m: Number((d.total_comp_usd / 1000000).toFixed(2)),
                    avg_k: Math.round(d.avg_salary_usd / 1000),
                    count: d.employee_count
                  })) || []}
                  margin={{ top: 10, right: 10, left: -10, bottom: 20 }}
                >
                  <XAxis
                    dataKey="name"
                    stroke="#94a3b8"
                    fontSize={11}
                    tickLine={false}
                    interval={0}
                    angle={-15}
                    textAnchor="end"
                  />
                  <YAxis
                    stroke="#94a3b8"
                    fontSize={11}
                    tickLine={false}
                    tickFormatter={(val) => `$${val}M`}
                  />
                  <Tooltip
                    formatter={(val: any, name?: any) => [
                      String(name) === 'total_m' ? `$${val}M USD` : `$${val}k USD`,
                      String(name) === 'total_m' ? 'Total Compensation' : 'Average Salary'
                    ]}
                    contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
                  />
                  <Bar dataKey="total_m" radius={[6, 6, 0, 0]}>
                    {dashboardData?.department_breakdown.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
            {dashboardData?.department_breakdown.slice(0, 6).map((dept) => (
              <div
                key={dept.department_id}
                onClick={() => onNavigateToEmployees(selectedCountry, String(dept.department_id))}
                className="p-2.5 rounded-xl bg-slate-50 hover:bg-blue-50/60 cursor-pointer transition border border-slate-100 flex flex-col justify-between"
              >
                <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                  <span className="truncate">{dept.department_name}</span>
                  <span className="text-blue-600 font-extrabold">{dept.comp_share_pct}%</span>
                </div>
                <div className="mt-1 flex items-center justify-between text-[11px] text-slate-500">
                  <span>{dept.employee_count.toLocaleString()} staff</span>
                  <span className="font-semibold text-slate-700">${(dept.total_comp_usd / 1000000).toFixed(1)}M</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Current Country Compensation Breakdown (5 cols) - As of [date] */}
        <div className="lg:col-span-5 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <span>Current Country Breakdown</span>
                  {isLoading && <Loader2 className="w-4 h-4 animate-spin text-blue-600" />}
                </h3>
                <p className="text-xs text-slate-500">
                  Headcount distribution & compensation share &bull;{' '}
                  <span className="font-semibold text-slate-700">As of {formattedAsOf}</span>
                </p>
              </div>
              <span className="text-xs font-semibold px-2 py-1 bg-emerald-100 text-emerald-700 rounded-lg">
                2 Key Hubs
              </span>
            </div>

            <div className="space-y-3">
              {dashboardData?.countries_breakdown.map((c) => {
                const isIndia = c.country_code === 'IN';
                return (
                  <div
                    key={c.country_code}
                    className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{isIndia ? '🇮🇳' : '🇺🇸'}</span>
                        <div>
                          <div className="text-xs font-bold text-slate-900">{c.country_name}</div>
                          <div className="text-[10px] text-slate-500">
                            {c.employee_count.toLocaleString()} employees ({c.pct_workforce}% workforce)
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs font-bold text-slate-900 font-mono">
                          ${(c.total_comp_usd / 1000000).toFixed(1)}M USD
                        </div>
                        <div className="text-[10px] text-slate-500">
                          Avg: ${c.avg_salary_usd.toLocaleString()} / yr
                        </div>
                      </div>
                    </div>

                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div
                        className={cn(
                          "h-full rounded-full transition-all duration-500",
                          isIndia ? "bg-amber-500" : "bg-blue-600"
                        )}
                        style={{ width: `${c.pct_workforce}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-100 p-2.5 rounded-xl bg-blue-50/60 border border-blue-100 flex items-center justify-between text-xs text-blue-900">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
              <span>India accounts for 69% of headcount; US accounts for 31%.</span>
            </div>
            <span className="font-bold text-[11px]">As of {formattedAsOf}</span>
          </div>
        </div>
      </div>

      {/* 5. SALARY DISTRIBUTION & PERIOD-CONTROLLED RECENT SALARY CHANGES */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Current Salary Distribution Across Bands (5 cols) - As of [date] */}
        <div className="lg:col-span-5 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Current Salary Band Distribution
                </h3>
                <p className="text-xs text-slate-500">
                  Employee count across bands &bull;{' '}
                  <span className="font-semibold text-slate-700">As of {formattedAsOf}</span>
                </p>
              </div>
              <span className="text-xs font-semibold px-2 py-1 bg-purple-100 text-purple-700 rounded-lg">
                5 Standard Bands
              </span>
            </div>

            <div className="space-y-3">
              {dashboardData?.salary_band_distribution.map((band) => (
                <div key={band.band_name} className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-slate-800 font-bold">{band.band_name}</span>
                    <span className="text-slate-500">
                      {band.employee_count.toLocaleString()} ({band.pct_workforce}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-blue-600 transition-all duration-300"
                      style={{ width: `${Math.min(100, band.pct_workforce * 2.2)}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-slate-400">
                    <span>Range: ${band.min_salary_usd.toLocaleString()} - ${band.max_salary_usd.toLocaleString()}</span>
                    <span>Avg: ${band.avg_salary_usd.toLocaleString()} USD</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-100 text-xs text-slate-500 flex items-center justify-between">
            <span>Canonical Scale: L1 Associate → L5 Principal</span>
            <span className="font-semibold text-slate-700">As of {formattedAsOf}</span>
          </div>
        </div>

        {/* Period-Controlled Recent Salary Changes (7 cols) */}
        <div className="lg:col-span-7 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <span>Recent Salary Changes</span>
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700">
                    {period?.period_label}
                  </span>
                </h3>
                <p className="text-xs text-slate-500">
                  {period?.is_snapshot
                    ? 'Recent logged compensation modifications across active employees'
                    : `Salary adjustments executed during ${period?.period_label} (${period?.start_date} to ${period?.end_date})`}
                </p>
              </div>
              <button
                onClick={() => onNavigateToEmployees(
                  selectedCountry !== 'all' ? selectedCountry : undefined,
                  selectedDept !== 'all' ? selectedDept : undefined,
                  { salaryChangedOnly: true }
                )}
                className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
                title="Filter directory to only show employees whose salary was changed"
              >
                <span>View All In Directory</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Desktop Table View */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 uppercase tracking-wider text-[10px] font-bold">
                    <th className="pb-2">Employee</th>
                    <th className="pb-2">Adjustment</th>
                    <th className="pb-2">New Base</th>
                    <th className="pb-2">Reason</th>
                    <th className="pb-2">Effective</th>
                    <th className="pb-2 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {dashboardData?.recent_changes && dashboardData.recent_changes.length > 0 ? (
                    dashboardData.recent_changes.slice(0, 7).map((change) => {
                      const isPositive = change.percentage_change >= 0;
                      return (
                        <tr key={change.id} className="hover:bg-slate-50/80 transition">
                          <td className="py-2.5">
                            <button
                              onClick={() => onNavigateToEmployees(undefined, undefined, { search: change.employee_code })}
                              className="font-bold text-slate-900 hover:text-blue-600 transition text-left cursor-pointer truncate block max-w-[190px]"
                              title={`View ${change.employee_name} (${change.employee_code}) in Directory`}
                            >
                              {change.employee_name}
                            </button>
                            <div className="text-[10px] text-slate-400">
                              <span 
                                onClick={() => onNavigateToEmployees(undefined, undefined, { search: change.employee_code })}
                                className="font-mono text-slate-500 hover:text-blue-600 cursor-pointer"
                              >
                                {change.employee_code}
                              </span> &bull; {change.role_title}
                            </div>
                          </td>
                          <td className="py-2.5">
                            <span
                              className={cn(
                                "inline-flex items-center px-1.5 py-0.5 rounded text-[11px] font-bold",
                                isPositive ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-800"
                              )}
                            >
                              {isPositive ? '+' : ''}{change.percentage_change}%
                            </span>
                          </td>
                          <td className="py-2.5 font-bold font-mono text-slate-800">
                            {change.currency_code} {change.new_salary.toLocaleString()}
                          </td>
                          <td className="py-2.5">
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-700">
                              {change.reason}
                            </span>
                          </td>
                          <td className="py-2.5 text-slate-500 text-[11px]">
                            {change.effective_date}
                          </td>
                          <td className="py-2.5 text-right">
                            <div className="flex items-center justify-end gap-2">
                              {onOpenHistory && (
                                <button
                                  onClick={() => onOpenHistory(change.employee_id)}
                                  className="text-slate-500 hover:text-slate-800 font-semibold text-[11px] cursor-pointer"
                                  title="View audit history"
                                >
                                  History
                                </button>
                              )}
                              {onOpenEditSalary && (
                                <button
                                  onClick={() => onOpenEditSalary(change.employee_id)}
                                  className="text-blue-600 hover:text-blue-800 font-bold text-[11px] cursor-pointer"
                                  title="Edit salary"
                                >
                                  Edit
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-slate-400">
                        No salary changes recorded in this period.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View (<sm) */}
            <div className="sm:hidden space-y-3">
              {dashboardData?.recent_changes && dashboardData.recent_changes.length > 0 ? (
                dashboardData.recent_changes.slice(0, 5).map((change) => {
                  const isPositive = change.percentage_change >= 0;
                  return (
                    <div key={change.id} className="p-3 bg-slate-50/70 border border-slate-200/80 rounded-xl space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <button
                            onClick={() => onNavigateToEmployees(undefined, undefined, { search: change.employee_code })}
                            className="font-bold text-slate-900 text-xs text-left hover:text-blue-600 cursor-pointer block"
                          >
                            {change.employee_name}
                          </button>
                          <div className="text-[10px] text-slate-400">
                            <span 
                              onClick={() => onNavigateToEmployees(undefined, undefined, { search: change.employee_code })}
                              className="font-mono text-slate-500 hover:text-blue-600 cursor-pointer"
                            >
                              {change.employee_code}
                            </span> &bull; {change.role_title} &bull; {change.department_name}
                          </div>
                        </div>
                        <span
                          className={cn(
                            "inline-flex items-center px-1.5 py-0.5 rounded text-[11px] font-bold shrink-0",
                            isPositive ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-800"
                          )}
                        >
                          {isPositive ? '+' : ''}{change.percentage_change}%
                        </span>
                      </div>

                      <div className="flex items-center justify-between pt-1 border-t border-slate-200/60 text-xs">
                        <div>
                          <span className="text-[10px] text-slate-400 block uppercase">New Salary</span>
                          <span className="font-bold font-mono text-slate-900">
                            {change.currency_code} {change.new_salary.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-white border border-slate-200 text-slate-600">
                            {change.reason}
                          </span>
                          {onOpenHistory && (
                            <button
                              onClick={() => onOpenHistory(change.employee_id)}
                              className="text-xs font-semibold text-slate-600 px-2 py-1 bg-white border border-slate-200 rounded-lg cursor-pointer"
                            >
                              History
                            </button>
                          )}
                          {onOpenEditSalary && (
                            <button
                              onClick={() => onOpenEditSalary(change.employee_id)}
                              className="text-xs font-bold text-blue-600 px-2 py-1 bg-white border border-slate-200 rounded-lg cursor-pointer"
                            >
                              Edit
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="py-6 text-center text-xs text-slate-400">
                  No salary changes recorded in this period.
                </div>
              )}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
            <span>Period filter: {period?.period_label}</span>
            <span className="text-slate-600 font-medium">
              {dashboardData?.recent_changes.length || 0} updates listed
            </span>
          </div>
        </div>
      </div>
        </div>
      )}
    </div>
  );
};
