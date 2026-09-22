import React, { useState, useEffect, useCallback } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
  AreaChart,
  Area
} from 'recharts';
import {
  TrendingUp,
  Building,
  DollarSign,
  Users,
  ShieldCheck,
  Bot,
  HelpCircle,
  Sparkles,
  MessageSquare,
  ArrowRight,
  Layers,
  Globe,
  Sliders,
  CheckCircle2,
  RefreshCw,
  Printer,
  ChevronRight,
  Activity,
  FileCheck2,
  Clock,
  Calendar,
  FileText
} from 'lucide-react';
import {
  CompensationInsightsResponse,
  PredefinedQuestionAnswer,
  DepartmentInsight,
  CountryInsight,
  SalaryBandInsight,
  LevelInsight,
  AnalysisPeriodState
} from '../types';
import { cn } from '../lib/utils';
import { formatAsOfDate, loadStoredPeriod, DEFAULT_AS_OF_DATE } from '../lib/periodUtils';
import { AnalysisPeriodFilter } from './AnalysisPeriodFilter';

interface ReportsViewProps {
  analysisPeriod?: AnalysisPeriodState;
  onPeriodChange?: (period: AnalysisPeriodState) => void;
}

export const ReportsView: React.FC<ReportsViewProps> = ({
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

  const [insights, setInsights] = useState<CompensationInsightsResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Predefined queries state
  const [selectedQuestionId, setSelectedQuestionId] = useState<string>('1');
  const [salaryThreshold, setSalaryThreshold] = useState<number>(100000);
  const [activeAnswer, setActiveAnswer] = useState<PredefinedQuestionAnswer | null>(null);
  const [isAnswering, setIsAnswering] = useState<boolean>(false);

  // Active section tab
  const [activeSection, setActiveSection] = useState<'all' | 'assistant' | 'period' | 'dept' | 'geo_bands_levels'>('all');
  const [lastReportSection, setLastReportSection] = useState<'all' | 'period' | 'dept' | 'geo_bands_levels'>('all');

  const fetchInsights = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (periodState.startDate) params.append('start_date', periodState.startDate);
      if (periodState.endDate) params.append('end_date', periodState.endDate);
      if (periodState.asOfDate) params.append('as_of_date', periodState.asOfDate);

      const res = await fetch(`/api/insights?${params.toString()}`);
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      const data: CompensationInsightsResponse = await res.json();
      setInsights(data);
    } catch (err: any) {
      console.error('Failed to load compensation insights:', err);
      setError(err.message || 'Failed to load insights');
    } finally {
      setIsLoading(false);
    }
  }, [periodState]);

  const fetchQuestionAnswer = async (id: string, threshold: number = salaryThreshold) => {
    setIsAnswering(true);
    try {
      const res = await fetch(`/api/insights/question?id=${id}&threshold=${threshold}`);
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      const data: PredefinedQuestionAnswer = await res.json();
      setActiveAnswer(data);
    } catch (err: any) {
      console.error('Failed to get answer:', err);
    } finally {
      setIsAnswering(false);
    }
  };

  useEffect(() => {
    fetchInsights();
  }, [fetchInsights]);

  useEffect(() => {
    fetchQuestionAnswer('1', 100000);
  }, []);

  const handleSelectQuestion = (id: string) => {
    setSelectedQuestionId(id);
    fetchQuestionAnswer(id, salaryThreshold);
  };

  const handleThresholdChange = (val: number) => {
    setSalaryThreshold(val);
    if (selectedQuestionId === '4') {
      fetchQuestionAnswer('4', val);
    }
  };

  const COLORS = ['#2563eb', '#3b82f6', '#60a5fa', '#93c5fd', '#a5b4fc', '#c7d2fe'];

  const QUESTIONS = [
    { id: '1', title: 'Which department has the highest average salary?' },
    { id: '2', title: 'Which country has the largest compensation cost?' },
    { id: '3', title: 'How is compensation distributed across departments?' },
    { id: '4', title: 'How many employees earn above a selected salary?' },
    { id: '5', title: 'Which level has the highest average salary?' }
  ];

  const formattedAsOf = formatAsOfDate(periodState.asOfDate);
  const period = insights?.period_analysis;
  const prevComp = period?.previous_period_comparison;

  return (
    <div className="space-y-6 pb-16">
      {/* 1. Minimal Page Header with Shared Analysis Period Filter */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 bg-white px-4 py-3 sm:px-5 sm:py-3.5 rounded-xl border border-slate-200/80 shadow-2xs">
        <div className="min-w-0">
          <h1 className="text-base sm:text-lg font-bold tracking-tight text-slate-900 truncate">
            Compensation Insights
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

        <div className="flex flex-wrap items-center gap-2">
          {/* Shared Analysis Period Filter */}
          <AnalysisPeriodFilter
            value={periodState}
            onChange={handlePeriodChange}
            showSubtitle={false}
          />

          <button
            onClick={() => {
              fetchInsights();
              fetchQuestionAnswer(selectedQuestionId, salaryThreshold);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-semibold transition min-h-[38px] sm:min-h-0"
            title="Refresh insights"
          >
            <RefreshCw className={cn("w-3.5 h-3.5", isLoading && "animate-spin text-blue-600")} />
            <span>Refresh</span>
          </button>

          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition shadow-2xs min-h-[38px] sm:min-h-0"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Report</span>
          </button>
        </div>
      </div>

      {/* Desktop Navigation Tabs (Large screens: 5 full tabs) */}
      <div className="hidden lg:flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-slate-200">
        {[
          { id: 'all', label: 'All Reports & Insights' },
          { id: 'assistant', label: 'Intelligence Assistant' },
          { id: 'period', label: `Period Analysis (${periodState.label})` },
          { id: 'dept', label: 'Departments' },
          { id: 'geo_bands_levels', label: 'Geographies, Bands & Levels' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveSection(tab.id as any);
              if (tab.id !== 'assistant') {
                setLastReportSection(tab.id as any);
              }
            }}
            className={cn(
              "px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition active:scale-[0.98]",
              activeSection === tab.id
                ? "bg-blue-600 text-white shadow-xs"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Medium and Small Screens Navigation (2 tabs + section dropdown) */}
      <div className="flex lg:hidden flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 pb-2 border-b border-slate-200">
        {/* 2 Primary Tabs on medium/small screens */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 w-full sm:w-auto">
          <button
            onClick={() => setActiveSection(lastReportSection === 'all' ? 'all' : lastReportSection)}
            className={cn(
              "flex-1 sm:flex-initial px-3.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 min-h-[36px]",
              activeSection !== 'assistant'
                ? "bg-white text-slate-900 shadow-2xs"
                : "text-slate-500 hover:text-slate-900"
            )}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>All Reports & Insights</span>
          </button>
          <button
            onClick={() => setActiveSection('assistant')}
            className={cn(
              "flex-1 sm:flex-initial px-3.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 min-h-[36px]",
              activeSection === 'assistant'
                ? "bg-white text-blue-700 shadow-2xs font-extrabold"
                : "text-slate-500 hover:text-slate-900"
            )}
          >
            <Bot className="w-3.5 h-3.5" />
            <span>Intelligence Assistant</span>
          </button>
        </div>

        {/* Section switcher dropdown when Reports & Insights is active */}
        {activeSection !== 'assistant' && (
          <div className="flex items-center justify-between sm:justify-start gap-2 bg-white border border-slate-200 rounded-xl px-3 py-1.5 shadow-2xs">
            <span className="text-xs font-semibold text-slate-500 whitespace-nowrap">Section:</span>
            <select
              value={activeSection}
              onChange={(e) => {
                const val = e.target.value as any;
                setActiveSection(val);
                setLastReportSection(val);
              }}
              className="text-xs font-bold text-slate-800 bg-transparent border-none focus:outline-none cursor-pointer pr-1 flex-1 sm:flex-initial min-h-[30px]"
            >
              <option value="all">All Overview & Metrics</option>
              <option value="period">Period Analysis</option>
              <option value="dept">Departments</option>
              <option value="geo_bands_levels">Geographies, Bands & Levels</option>
            </select>
          </div>
        )}
      </div>

      {/* Compensation Intelligence Assistant: Dedicated Tab */}
      {activeSection === 'assistant' && (
        <div className="bg-white rounded-2xl border border-blue-200/80 shadow-sm overflow-hidden">
          <div className="p-4 bg-gradient-to-r from-blue-50/80 to-indigo-50/50 border-b border-blue-100 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <span>Compensation Intelligence Assistant</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-100 text-blue-700">
                    Predefined Analytical Queries
                  </span>
                </h2>
                <p className="text-[11px] text-slate-500">
                  Explore instant answers backed by live SQLite compensation data
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-slate-200">
            {/* Left Column: Questions List (5 cols) */}
            <div className="lg:col-span-5 p-5 space-y-3 bg-slate-50/40 flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                  Select a Question
                </span>
                <div className="space-y-1.5">
                  {QUESTIONS.map((q) => {
                    const isSelected = selectedQuestionId === q.id;
                    return (
                      <button
                        key={q.id}
                        onClick={() => handleSelectQuestion(q.id)}
                        className={cn(
                          "w-full text-left p-3 rounded-xl text-xs font-semibold transition flex items-center justify-between gap-2 border min-h-[44px] active:scale-[0.99]",
                          isSelected
                            ? "bg-white text-blue-700 border-blue-300 shadow-xs font-bold"
                            : "bg-white/80 hover:bg-white text-slate-700 border-slate-200 hover:border-slate-300"
                        )}
                      >
                        <div className="flex items-center gap-2.5">
                          <span
                            className={cn(
                              "w-6 h-6 rounded-full text-[10px] font-bold flex items-center justify-center shrink-0",
                              isSelected
                                ? "bg-blue-600 text-white"
                                : "bg-slate-100 text-slate-600"
                            )}
                          >
                            {q.id}
                          </span>
                          <span className="leading-snug">{q.title}</span>
                        </div>
                        <ChevronRight
                          className={cn(
                            "w-4 h-4 shrink-0 transition",
                            isSelected ? "text-blue-600 translate-x-0.5" : "text-slate-300"
                          )}
                        />
                      </button>
                    );
                  })}
                </div>

                {selectedQuestionId === '4' && (
                  <div className="mt-3 p-3 bg-white rounded-xl border border-blue-200 shadow-2xs space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-700">Salary Benchmark Filter:</span>
                      <span className="font-black text-blue-600 font-mono">
                        ${salaryThreshold.toLocaleString()} USD
                      </span>
                    </div>
                    <input
                      type="range"
                      min="30000"
                      max="250000"
                      step="5000"
                      value={salaryThreshold}
                      onChange={(e) => handleThresholdChange(Number(e.target.value))}
                      className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    />
                    <div className="flex items-center justify-between text-[10px] text-slate-400 font-medium">
                      <span>$30k</span>
                      <span>$100k</span>
                      <span>$150k</span>
                      <span>$250k</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-4 pt-3 border-t border-slate-200/80">
                <p className="text-[11px] text-slate-500 italic leading-relaxed">
                  💡 <strong className="font-semibold text-slate-700">Analytical Note:</strong> Predefined queries run deterministically on SQLite organization data.
                </p>
              </div>
            </div>

            {/* Right Column: Chatbot Style Answer (7 cols) */}
            <div className="lg:col-span-7 p-5 bg-white flex flex-col justify-between">
              {isAnswering ? (
                <div className="py-12 flex flex-col items-center justify-center gap-2 text-slate-400">
                  <RefreshCw className="w-5 h-5 animate-spin text-blue-600" />
                  <span className="text-xs">Computing deterministic analysis...</span>
                </div>
              ) : activeAnswer ? (
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs text-xs font-bold">
                      AI
                    </div>
                    <div className="flex-1">
                      <div className="bg-slate-50 border border-slate-200 rounded-2xl rounded-tl-xs p-4 space-y-3">
                        <div className="flex items-center justify-between text-[11px] text-slate-400 border-b border-slate-200/60 pb-2">
                          <span className="font-bold text-slate-700">Query Result</span>
                          <span>Source: SQLite Live DB</span>
                        </div>

                        <p className="text-sm font-bold text-slate-900 leading-snug">
                          {activeAnswer.summary}
                        </p>

                        <div className="space-y-1.5 pt-1">
                          {activeAnswer.details.map((item, idx) => (
                            <div
                              key={idx}
                              className="flex items-start gap-2 text-xs text-slate-700 bg-white p-2 rounded-xl border border-slate-100"
                            >
                              <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5 shrink-0" />
                              <span className="font-medium">{item}</span>
                            </div>
                          ))}
                        </div>

                        {activeAnswer.insight && (
                          <div className="p-2.5 bg-blue-50/70 border border-blue-100 rounded-xl text-xs text-blue-900 font-medium flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-blue-600 shrink-0" />
                            <span>{activeAnswer.insight}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ) : null}

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
                <span>Canonical Currency: USD Equivalent (INR FX: 0.012)</span>
                <span>As of {formattedAsOf}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. CURRENT-STATE EXECUTIVE METRICS (Labeled As of [date]) */}
      {insights && (activeSection === 'all' || activeSection === 'period') && (
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Current-State Metrics
              </h2>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                As of {formattedAsOf}
              </span>
            </div>
            <span className="text-[11px] text-slate-400">
              Point-in-time organizational snapshot
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
              <span className="text-[10px] uppercase font-bold text-slate-400 block truncate">
                Current Headcount
              </span>
              <span className="text-xl font-black text-slate-900 font-mono mt-1 block">
                {insights.overview.total_employees.toLocaleString()}
              </span>
              <span className="text-[10px] text-blue-600 font-semibold mt-0.5 block truncate">
                As of {formattedAsOf}
              </span>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
              <span className="text-[10px] uppercase font-bold text-slate-400 block truncate">
                Total Annual Comp
              </span>
              <span className="text-xl font-black text-slate-900 font-mono mt-1 block">
                ${(insights.overview.total_annual_compensation_usd / 1000000).toFixed(2)}M
              </span>
              <span className="text-[10px] text-emerald-600 font-semibold mt-0.5 block truncate">
                As of {formattedAsOf}
              </span>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
              <span className="text-[10px] uppercase font-bold text-slate-400 block truncate">
                Current Avg Salary
              </span>
              <span className="text-xl font-black text-slate-900 font-mono mt-1 block">
                ${insights.overview.avg_annual_salary_usd.toLocaleString()}
              </span>
              <span className="text-[10px] text-slate-400 font-medium mt-0.5 block truncate">
                As of {formattedAsOf}
              </span>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
              <span className="text-[10px] uppercase font-bold text-slate-400 block truncate">
                Current Median Salary
              </span>
              <span className="text-xl font-black text-slate-900 font-mono mt-1 block">
                ${insights.overview.median_annual_salary_usd.toLocaleString()}
              </span>
              <span className="text-[10px] text-slate-400 font-medium mt-0.5 block truncate">
                As of {formattedAsOf}
              </span>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
              <span className="text-[10px] uppercase font-bold text-slate-400 block truncate">
                Highest Salary
              </span>
              <span className="text-xl font-black text-slate-900 font-mono mt-1 block">
                ${insights.overview.highest_annual_salary_usd.toLocaleString()}
              </span>
              <span className="text-[10px] text-purple-600 font-medium mt-0.5 block truncate">
                Peak earner
              </span>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
              <span className="text-[10px] uppercase font-bold text-slate-400 block truncate">
                Lowest Base Floor
              </span>
              <span className="text-xl font-black text-slate-900 font-mono mt-1 block">
                ${insights.overview.lowest_annual_salary_usd.toLocaleString()}
              </span>
              <span className="text-[10px] text-slate-400 font-medium mt-0.5 block truncate">
                Entry minimum
              </span>
            </div>
          </div>
        </div>
      )}

      {/* 3. PERIOD-CONTROLLED ACTIVITY METRICS SECTION */}
      {period && (activeSection === 'all' || activeSection === 'period') && (
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
                  ? 'Showing live organizational state as of today. Select a review period (e.g. Last 6 months) to evaluate salary adjustments, review activity, and historical cycle benchmarks.'
                  : `Salary adjustment velocity, budget impact, and review activities recorded during ${period.period_label}.`}
              </p>
            </div>

            {prevComp?.has_previous_data && (
              <div className="text-xs text-slate-600 bg-white border border-slate-200/80 px-3 py-1.5 rounded-xl shadow-2xs">
                <span>Previous cycle: </span>
                <strong className="text-slate-900">{prevComp.previous_start_date} to {prevComp.previous_end_date}</strong>
              </div>
            )}
          </div>

          {/* 4 Period Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {/* Metric 1: Salary Changes in Period */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase">
                <span>Salary Changes in Period</span>
                <Clock className="w-4 h-4 text-blue-500" />
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
                  {period.is_snapshot ? 'Select review range to filter' : 'No prior baseline data'}
                </p>
              )}
            </div>

            {/* Metric 2: Average Salary Adjustment */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase">
                <span>Avg Salary Adjustment</span>
                <TrendingUp className="w-4 h-4 text-emerald-500" />
              </div>
              <div className="flex items-baseline gap-2">
                <div className="text-2xl font-black text-slate-900 tracking-tight">
                  {period.average_salary_adjustment_pct > 0 ? `+${period.average_salary_adjustment_pct}%` : `${period.average_salary_adjustment_pct}%`}
                </div>
                <span className="text-xs text-slate-400 font-medium">mean adjustment</span>
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
                  {period.is_snapshot ? 'Calculated across review periods' : 'Historical average'}
                </p>
              )}
            </div>

            {/* Metric 3: Total Annualized Compensation Increase */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase">
                <span>Total Annualized Increase</span>
                <DollarSign className="w-4 h-4 text-purple-500" />
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
                  Budget delta impact
                </p>
              )}
            </div>

            {/* Metric 4: Review Activity Breakdown */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase">
                <span>Review Activity</span>
                <FileCheck2 className="w-4 h-4 text-blue-600" />
              </div>
              <div className="flex items-baseline gap-2">
                <div className="text-2xl font-black text-slate-900 tracking-tight">
                  {period.review_activity.total_reviews}
                </div>
                <span className="text-xs text-slate-400 font-medium">reviews processed</span>
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

          {/* Period-Controlled Compensation Trend Chart */}
          <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <span>Compensation Trend Curve ({period.period_label})</span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-50 text-blue-700">
                    Controlled by Analysis Period
                  </span>
                </h3>
                <p className="text-xs text-slate-500">
                  Tracking monthly payroll and modification volume across {period.period_label}
                </p>
              </div>

              <div className="flex items-center gap-3 text-xs font-semibold text-slate-600">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-blue-600" />
                  <span>Monthly Payroll ($M)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-emerald-500" />
                  <span>Adjustments Count</span>
                </div>
              </div>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={period.trend_points.map((pt) => ({
                    label: pt.date_label,
                    payroll_m: Number((pt.payroll_usd / 1000000).toFixed(2)),
                    adjustments: pt.salary_adjustments_count,
                    increase_k: Math.round(pt.total_increase_usd / 1000),
                    avg_pct: pt.avg_adjustment_pct
                  }))}
                  margin={{ top: 10, right: 10, left: -10, bottom: 10 }}
                >
                  <defs>
                    <linearGradient id="insightsPayrollGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563eb" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#2563eb" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="label" stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} tickFormatter={(v) => `$${v}M`} />
                  <Tooltip
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xl text-xs space-y-1.5">
                            <div className="font-bold text-slate-900 border-b border-slate-100 pb-1">
                              {label}
                            </div>
                            <div className="flex justify-between gap-4">
                              <span className="text-slate-500">Monthly Payroll:</span>
                              <span className="font-bold text-blue-700">${data.payroll_m}M USD</span>
                            </div>
                            <div className="flex justify-between gap-4">
                              <span className="text-slate-500">Adjustments:</span>
                              <span className="font-bold text-emerald-600">{data.adjustments} logged</span>
                            </div>
                            {data.increase_k > 0 && (
                              <div className="flex justify-between gap-4">
                                <span className="text-slate-500">Period Increase:</span>
                                <span className="font-semibold text-slate-800">+${data.increase_k}k USD</span>
                              </div>
                            )}
                            {data.avg_pct > 0 && (
                              <div className="flex justify-between gap-4">
                                <span className="text-slate-500">Avg Adjustment:</span>
                                <span className="font-semibold text-slate-800">+{data.avg_pct}%</span>
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
                    fill="url(#insightsPayrollGradient)"
                  />
                  <Line
                    type="monotone"
                    dataKey="adjustments"
                    stroke="#10b981"
                    strokeWidth={2}
                    dot={{ r: 4, fill: '#10b981' }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* 4. CURRENT DEPARTMENT BREAKDOWN (Labeled As of [date]) */}
      {insights && (activeSection === 'all' || activeSection === 'dept') && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-500">
                Current Department Compensation Breakdown
              </h2>
              <p className="text-xs text-slate-400">
                Functional compensation splits &bull; <strong className="text-slate-600 font-semibold">As of {formattedAsOf}</strong>
              </p>
            </div>
            <span className="text-xs font-semibold px-2 py-0.5 bg-blue-50 text-blue-700 rounded-lg">
              {insights.by_department.length} Functional Teams
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Graph 1: Wage Division */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Total Wage Division by Department</h3>
                  <p className="text-xs text-slate-500">Total annual compensation expenditure ($M USD)</p>
                </div>
                <span className="text-xs font-bold text-blue-600 font-mono">
                  ${(insights.overview.total_annual_compensation_usd / 1000000).toFixed(1)}M Total
                </span>
              </div>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={insights.by_department.map(d => ({
                      name: d.department,
                      total: Number((d.total_compensation_usd / 1000000).toFixed(2)),
                      share: d.comp_share_pct
                    }))}
                    margin={{ top: 10, right: 10, left: -10, bottom: 25 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} interval={0} angle={-15} textAnchor="end" tickLine={false} />
                    <YAxis stroke="#94a3b8" fontSize={11} tickFormatter={(v) => `$${v}M`} tickLine={false} />
                    <Tooltip
                      formatter={(v: any) => [`$${v}M USD`, 'Total Compensation']}
                      contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0' }}
                    />
                    <Bar dataKey="total" radius={[6, 6, 0, 0]}>
                      {insights.by_department.map((_, i) => (
                        <Cell key={`bar-${i}`} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Graph 2: Department Average vs Median Comparison */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Average vs. Median Salary by Department</h3>
                  <p className="text-xs text-slate-500">Distribution skew evaluation (USD)</p>
                </div>
                <span className="text-xs font-semibold px-2 py-0.5 bg-slate-100 text-slate-600 rounded">
                  USD Benchmark
                </span>
              </div>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={insights.by_department.map(d => ({
                      name: d.department,
                      Average: d.avg_salary_usd,
                      Median: d.median_salary_usd
                    }))}
                    margin={{ top: 10, right: 10, left: 0, bottom: 25 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} interval={0} angle={-15} textAnchor="end" tickLine={false} />
                    <YAxis stroke="#94a3b8" fontSize={11} tickFormatter={(v) => `$${Math.round(v / 1000)}k`} tickLine={false} />
                    <Tooltip
                      formatter={(v: any) => [`$${Number(v).toLocaleString()} USD`, 'Salary']}
                      contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0' }}
                    />
                    <Legend verticalAlign="top" height={36} iconType="circle" />
                    <Bar dataKey="Average" fill="#2563eb" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="Median" fill="#93c5fd" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Department Breakdown Data Table */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900">
                Departmental Expenditure Details &bull; As of {formattedAsOf}
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 uppercase tracking-wider text-[10px] font-bold bg-slate-50/60">
                    <th className="py-3 px-4">Department</th>
                    <th className="py-3 px-4">Headcount</th>
                    <th className="py-3 px-4">% Workforce</th>
                    <th className="py-3 px-4">Total Comp (USD)</th>
                    <th className="py-3 px-4">% Comp Share</th>
                    <th className="py-3 px-4">Avg Salary</th>
                    <th className="py-3 px-4">Median Salary</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {insights.by_department.map(d => (
                    <tr key={d.department} className="hover:bg-slate-50/80 transition">
                      <td className="py-3 px-4 font-bold text-slate-900">{d.department}</td>
                      <td className="py-3 px-4 text-slate-700">{d.employee_count.toLocaleString()}</td>
                      <td className="py-3 px-4 text-slate-500">{d.pct_organization}%</td>
                      <td className="py-3 px-4 font-bold font-mono text-slate-900">
                        ${d.total_compensation_usd.toLocaleString()}
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-50 text-blue-700">
                          {d.comp_share_pct}%
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono font-semibold text-slate-800">
                        ${d.avg_salary_usd.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-600">
                        ${d.median_salary_usd.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 5. CURRENT COUNTRY BREAKDOWN (Labeled As of [date]) */}
      {insights && (activeSection === 'all' || activeSection === 'geo_bands_levels') && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-500">
                Current Country Compensation Breakdown
              </h2>
              <p className="text-xs text-slate-400">
                Geographic workforce allocations &bull; <strong className="text-slate-600 font-semibold">As of {formattedAsOf}</strong>
              </p>
            </div>
            <span className="text-xs font-semibold px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded-lg">
              2 Key Hubs (India & US)
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {insights.by_country.map(c => {
              const isIndia = c.country_code === 'IN';
              return (
                <div key={c.country_code} className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{isIndia ? '🇮🇳' : '🇺🇸'}</span>
                      <div>
                        <h3 className="text-base font-bold text-slate-900">{c.country} Hub</h3>
                        <p className="text-xs text-slate-400 font-medium">Local currency: {c.currency}</p>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-xs font-extrabold bg-blue-100 text-blue-800">
                      {c.pct_organization}% of Staff
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-2 border-t border-slate-100 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 block uppercase font-semibold">Employees</span>
                      <span className="font-bold text-slate-900 text-sm font-mono">{c.employee_count.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block uppercase font-semibold">Total Comp</span>
                      <span className="font-bold text-slate-900 text-sm font-mono">${(c.total_comp_usd / 1000000).toFixed(1)}M</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block uppercase font-semibold">Avg Salary</span>
                      <span className="font-bold text-slate-900 text-sm font-mono">${c.avg_salary_usd.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 6. CURRENT SALARY DISTRIBUTION ACROSS BANDS (Labeled As of [date]) */}
      {insights && (activeSection === 'all' || activeSection === 'geo_bands_levels') && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-500">
                Current Salary Distribution Across Standard Bands
              </h2>
              <p className="text-xs text-slate-400">
                Employee count and expenditure across standard salary brackets &bull; <strong className="text-slate-600 font-semibold">As of {formattedAsOf}</strong>
              </p>
            </div>
            <span className="text-xs font-semibold px-2 py-0.5 bg-purple-50 text-purple-700 rounded-lg">
              5 Canonical Bands
            </span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
            <div className="space-y-4">
              {insights.salary_bands.map((band) => (
                <div key={band.band} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-900">{band.band}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-slate-500 font-mono">
                        {band.employee_count.toLocaleString()} employees ({band.pct_organization}%)
                      </span>
                      <span className="font-bold text-blue-700 font-mono">
                        ${(band.total_comp_usd / 1000000).toFixed(1)}M USD
                      </span>
                    </div>
                  </div>

                  <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-blue-600 transition-all duration-300"
                      style={{ width: `${Math.min(100, band.pct_organization * 2.2)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>Standard organization bands across all active staff</span>
              <span className="font-semibold text-slate-700">As of {formattedAsOf}</span>
            </div>
          </div>
        </div>
      )}

      {/* 7. CURRENT LEVEL INSIGHTS (Labeled As of [date]) */}
      {insights && (activeSection === 'all' || activeSection === 'geo_bands_levels') && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-500">
                Compensation by Level (L1 Associate → L5 Principal)
              </h2>
              <p className="text-xs text-slate-400">
                Career ladder wage progression &bull; <strong className="text-slate-600 font-semibold">As of {formattedAsOf}</strong>
              </p>
            </div>
            <span className="text-xs font-semibold px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded-lg">
              5 Career Levels
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5">
            {insights.by_level.map((lvl) => (
              <div key={lvl.level} className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="w-7 h-7 rounded-xl bg-blue-50 text-blue-700 font-bold text-xs flex items-center justify-center">
                    {lvl.level}
                  </span>
                  <span className="text-xs font-bold text-slate-500">
                    {lvl.employee_count.toLocaleString()} staff
                  </span>
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900 truncate">{lvl.level_name}</div>
                  <div className="text-lg font-black text-slate-900 font-mono mt-1">
                    ${lvl.avg_salary_usd.toLocaleString()}
                  </div>
                  <span className="text-[10px] text-slate-400 block">Avg base salary</span>
                </div>
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                  <span>Median:</span>
                  <span className="font-bold text-slate-800">${lvl.median_salary_usd.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
