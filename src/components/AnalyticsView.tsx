import React, { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  CartesianGrid
} from 'recharts';
import {
  Building2,
  Globe2,
  Layers,
  ArrowRightLeft,
  DollarSign,
  TrendingUp,
  Info,
  Download
} from 'lucide-react';
import {
  PayrollCostGroup,
  SalaryDistributionGroup,
  RoleComparisonGroup
} from '../types';
import { formatCurrency, cn } from '../lib/utils';

export const AnalyticsView: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'payroll' | 'distribution' | 'comparison'>('payroll');
  const [payrollGroupBy, setPayrollGroupBy] = useState<'department' | 'country'>('department');
  const [comparisonGroupBy, setComparisonGroupBy] = useState<'department' | 'country'>('department');

  const [payrollCostData, setPayrollCostData] = useState<PayrollCostGroup[]>([]);
  const [distributionData, setDistributionData] = useState<SalaryDistributionGroup[]>([]);
  const [comparisonData, setComparisonData] = useState<RoleComparisonGroup[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Fetch data on tab or filter change
  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        if (activeSubTab === 'payroll') {
          const res = await fetch(`/api/analytics/payroll-cost?group_by=${payrollGroupBy}`);
          const json = await res.json();
          setPayrollCostData(json.data || []);
        } else if (activeSubTab === 'distribution') {
          const res = await fetch('/api/analytics/salary-distribution?group_by=pay_band');
          const json = await res.json();
          setDistributionData(json.data || []);
        } else if (activeSubTab === 'comparison') {
          const res = await fetch(`/api/analytics/comparison?dimension=role&group_by=${comparisonGroupBy}`);
          const json = await res.json();
          setComparisonData(json.data || []);
        }
      } catch (err) {
        console.error('Error fetching analytics data:', err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [activeSubTab, payrollGroupBy, comparisonGroupBy]);

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Compensation & Payroll Analytics
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Normalized USD reporting powered by deterministic FX conversion tables.
          </p>
        </div>

        {/* Sub-tab pills */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl gap-1 w-full sm:w-auto overflow-x-auto">
          <button
            onClick={() => setActiveSubTab('payroll')}
            className={cn(
              "flex-1 sm:flex-initial px-3 py-2 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 whitespace-nowrap min-h-[38px]",
              activeSubTab === 'payroll' ? "bg-white text-blue-600 shadow-xs" : "text-slate-600 hover:text-slate-900"
            )}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Payroll Cost</span>
          </button>

          <button
            onClick={() => setActiveSubTab('distribution')}
            className={cn(
              "flex-1 sm:flex-initial px-3 py-2 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 whitespace-nowrap min-h-[38px]",
              activeSubTab === 'distribution' ? "bg-white text-blue-600 shadow-xs" : "text-slate-600 hover:text-slate-900"
            )}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Distribution</span>
          </button>

          <button
            onClick={() => setActiveSubTab('comparison')}
            className={cn(
              "flex-1 sm:flex-initial px-3 py-2 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 whitespace-nowrap min-h-[38px]",
              activeSubTab === 'comparison' ? "bg-white text-blue-600 shadow-xs" : "text-slate-600 hover:text-slate-900"
            )}
          >
            <ArrowRightLeft className="w-3.5 h-3.5" />
            <span>Comparison</span>
          </button>
        </div>
      </div>

      {/* FX Rates Reference Banner */}
      <div className="bg-blue-50/70 border border-blue-200 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3 text-xs text-blue-900">
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-blue-600 shrink-0" />
          <span><b>Deterministic FX Rates:</b> 1 USD = $1.00 · 1 EUR = $1.08 · 1 GBP = $1.28 · 1 INR = $0.012 · 1 SGD = $0.74</span>
        </div>
        <span className="text-[11px] text-blue-700 bg-blue-100/80 px-2.5 py-0.5 rounded-full font-semibold">
          Deterministic Static Multi-Currency Engine
        </span>
      </div>

      {/* TAB 1: PAYROLL COST */}
      {activeSubTab === 'payroll' && (
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
              <div>
                <h3 className="font-bold text-slate-900 text-base">Total & Average Payroll Expenditure</h3>
                <p className="text-xs text-slate-500">Grouped by active employee headcount in normalized USD</p>
              </div>

              {/* Group by switch */}
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
                <button
                  onClick={() => setPayrollGroupBy('department')}
                  className={cn(
                    "px-3 py-1 rounded-lg text-xs font-semibold transition",
                    payrollGroupBy === 'department' ? "bg-white text-blue-600 shadow-2xs" : "text-slate-600"
                  )}
                >
                  By Department
                </button>
                <button
                  onClick={() => setPayrollGroupBy('country')}
                  className={cn(
                    "px-3 py-1 rounded-lg text-xs font-semibold transition",
                    payrollGroupBy === 'country' ? "bg-white text-blue-600 shadow-2xs" : "text-slate-600"
                  )}
                >
                  By Country
                </button>
              </div>
            </div>

            {/* Chart */}
            <div className="h-72 w-full mb-6">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={payrollCostData} margin={{ top: 10, right: 20, left: 10, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="group_name" stroke="#64748b" fontSize={11} tickLine={false} />
                  <YAxis
                    stroke="#64748b"
                    fontSize={11}
                    tickLine={false}
                    tickFormatter={(val) => `$${Math.round(val / 1000)}k`}
                  />
                  <Tooltip
                    formatter={(val: any, name: any) => [
                      formatCurrency(Number(val)),
                      name === 'total_payroll_usd' ? 'Total Annual Payroll (USD)' : 'Avg Annual Salary (USD)'
                    ]}
                    contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                  />
                  <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                  <Bar dataKey="total_payroll_usd" name="Total Payroll (USD)" fill="#3b82f6" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="avg_payroll_usd" name="Avg Salary (USD)" fill="#10b981" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Aggregation Table */}
            <div className="overflow-x-auto border border-slate-200 rounded-xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 font-semibold uppercase text-[11px] border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">{payrollGroupBy === 'department' ? 'Department' : 'Country'}</th>
                    <th className="py-3 px-4">Headcount</th>
                    <th className="py-3 px-4">Total Payroll (USD)</th>
                    <th className="py-3 px-4">Average Salary (USD)</th>
                    <th className="py-3 px-4">Avg Monthly Cost</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {payrollCostData.map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/80 transition">
                      <td className="py-3 px-4 font-bold text-slate-900">{row.group_name}</td>
                      <td className="py-3 px-4 font-semibold text-slate-600">{row.employee_count.toLocaleString()}</td>
                      <td className="py-3 px-4 font-bold text-blue-600">{formatCurrency(row.total_payroll_usd)}</td>
                      <td className="py-3 px-4 font-semibold text-emerald-600">{formatCurrency(row.avg_payroll_usd)}</td>
                      <td className="py-3 px-4 text-slate-500">{formatCurrency(Math.round(row.total_payroll_usd / 12))}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: SALARY DISTRIBUTION BY PAY BAND */}
      {activeSubTab === 'distribution' && (
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
            <div className="mb-6">
              <h3 className="font-bold text-slate-900 text-base">Salary Distribution by Grade / Pay Band</h3>
              <p className="text-xs text-slate-500">
                Calculates Minimum, Maximum, exact Median, and Mean average for each tier.
              </p>
            </div>

            {/* Distribution Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mb-6">
              {distributionData.map((band) => (
                <div key={band.pay_band_id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-sm">{band.pay_band}</span>
                    <span className="text-xs font-semibold px-2 py-0.5 bg-blue-100 text-blue-700 rounded-md">
                      {band.employee_count.toLocaleString()} employees
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2 rounded-lg bg-white border border-slate-200">
                      <span className="text-slate-400 block text-[10px] uppercase font-semibold">Median Salary</span>
                      <span className="font-bold text-blue-600 text-sm">{formatCurrency(band.median_salary_usd)}</span>
                    </div>
                    <div className="p-2 rounded-lg bg-white border border-slate-200">
                      <span className="text-slate-400 block text-[10px] uppercase font-semibold">Average Salary</span>
                      <span className="font-bold text-slate-800 text-sm">{formatCurrency(band.avg_salary_usd)}</span>
                    </div>
                  </div>

                  <div className="space-y-1 text-xs text-slate-600">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Actual Min – Max:</span>
                      <span className="font-medium">{formatCurrency(band.min_salary_usd)} – {formatCurrency(band.max_salary_usd)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Allowed Band Range:</span>
                      <span className="font-medium text-slate-500">{formatCurrency(band.min_allowed_usd)} – {formatCurrency(band.max_allowed_usd)}</span>
                    </div>
                  </div>

                  {/* Visual Range bar */}
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-blue-600 h-full rounded-full"
                      style={{
                        width: `${Math.min(100, Math.max(10, ((band.median_salary_usd - band.min_allowed_usd) / (band.max_allowed_usd - band.min_allowed_usd || 1)) * 100))}%`
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Distribution Summary Table */}
            <div className="overflow-x-auto border border-slate-200 rounded-xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 font-semibold uppercase text-[11px] border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Pay Band Grade</th>
                    <th className="py-3 px-4">Headcount</th>
                    <th className="py-3 px-4">Allowed Range (USD)</th>
                    <th className="py-3 px-4">Min Salary (USD)</th>
                    <th className="py-3 px-4">Max Salary (USD)</th>
                    <th className="py-3 px-4 font-bold text-blue-600">Median Salary (USD)</th>
                    <th className="py-3 px-4">Mean Average (USD)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {distributionData.map((row) => (
                    <tr key={row.pay_band_id} className="hover:bg-slate-50/80 transition">
                      <td className="py-3 px-4 font-bold text-slate-900">{row.pay_band}</td>
                      <td className="py-3 px-4 font-medium">{row.employee_count.toLocaleString()}</td>
                      <td className="py-3 px-4 text-slate-500">{formatCurrency(row.min_allowed_usd)} - {formatCurrency(row.max_allowed_usd)}</td>
                      <td className="py-3 px-4">{formatCurrency(row.min_salary_usd)}</td>
                      <td className="py-3 px-4">{formatCurrency(row.max_salary_usd)}</td>
                      <td className="py-3 px-4 font-extrabold text-blue-600">{formatCurrency(row.median_salary_usd)}</td>
                      <td className="py-3 px-4 font-semibold text-slate-800">{formatCurrency(row.avg_salary_usd)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: ROLE COMPARISON ACROSS DEPARTMENTS */}
      {activeSubTab === 'comparison' && (
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
              <div>
                <h3 className="font-bold text-slate-900 text-base">Cross-Cut Role Compensation Comparison</h3>
                <p className="text-xs text-slate-500">Benchmark average role compensation across departments and offices</p>
              </div>

              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
                <button
                  onClick={() => setComparisonGroupBy('department')}
                  className={cn(
                    "px-3 py-1 rounded-lg text-xs font-semibold transition",
                    comparisonGroupBy === 'department' ? "bg-white text-blue-600 shadow-2xs" : "text-slate-600"
                  )}
                >
                  By Department
                </button>
                <button
                  onClick={() => setComparisonGroupBy('country')}
                  className={cn(
                    "px-3 py-1 rounded-lg text-xs font-semibold transition",
                    comparisonGroupBy === 'country' ? "bg-white text-blue-600 shadow-2xs" : "text-slate-600"
                  )}
                >
                  By Country
                </button>
              </div>
            </div>

            <div className="overflow-x-auto border border-slate-200 rounded-xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 font-semibold uppercase text-[11px] border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Role Title</th>
                    <th className="py-3 px-4">{comparisonGroupBy === 'department' ? 'Department' : 'Country'}</th>
                    <th className="py-3 px-4">Employees in Role</th>
                    <th className="py-3 px-4">Avg Base Salary (USD)</th>
                    <th className="py-3 px-4">Benchmark Indicator</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {comparisonData.map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/80 transition">
                      <td className="py-3 px-4 font-bold text-slate-900">{row.role_title}</td>
                      <td className="py-3 px-4 font-medium text-slate-600">
                        {comparisonGroupBy === 'department' ? row.department_name : row.country_code}
                      </td>
                      <td className="py-3 px-4 font-semibold text-slate-700">{row.employee_count}</td>
                      <td className="py-3 px-4 font-bold text-blue-600">{formatCurrency(row.avg_salary_usd)}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-24 bg-slate-100 h-2 rounded-full overflow-hidden">
                            <div
                              className="bg-emerald-500 h-full rounded-full"
                              style={{ width: `${Math.min(100, Math.max(15, (row.avg_salary_usd / 200000) * 100))}%` }}
                            />
                          </div>
                          <span className="text-[10px] text-slate-400">
                            {row.avg_salary_usd > 120000 ? 'Senior' : 'Mid/Base'}
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
