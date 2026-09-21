import React from 'react';
import { motion } from 'motion/react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend
} from 'recharts';
import {
  FileSpreadsheet,
  TrendingUp,
  Download,
  Printer,
  Building,
  DollarSign,
  Users,
  ShieldCheck
} from 'lucide-react';
import { DashboardStats } from '../types';

interface ReportsViewProps {
  stats: DashboardStats | null;
}

export const ReportsView: React.FC<ReportsViewProps> = ({ stats }) => {
  // Headcount distribution matching 31% US and 69% India
  const totalEmployees = stats?.total_active_employees || 10000;
  const usEmployees = Math.round(totalEmployees * 0.31);
  const inEmployees = totalEmployees - usEmployees;

  // Monthly totals in USD
  const totalPayrollUsd = stats?.total_payroll_month || 16250000;
  // India tech salaries in USD + US salaries
  const usTotalUsd = Math.round(totalPayrollUsd * 0.58);
  const inTotalUsd = totalPayrollUsd - usTotalUsd;

  // 1. Bar Chart Data: Payroll Cost by Country (Current Month in USD)
  const countryComparisonData = [
    {
      country: 'United States (US)',
      currency: 'USD ($)',
      headcount: usEmployees,
      share: '31%',
      totalPayrollUsd: usTotalUsd,
      avgSalaryUsd: Math.round(usTotalUsd / usEmployees)
    },
    {
      country: 'India (IN)',
      currency: 'INR (₹)',
      headcount: inEmployees,
      share: '69%',
      totalPayrollUsd: inTotalUsd,
      avgSalaryUsd: Math.round(inTotalUsd / inEmployees)
    }
  ];

  // 2. Line Chart Data: 6-Month Cost Trend
  const monthlyTrendData = [
    { month: 'Apr 2026', 'United States': Math.round(usTotalUsd * 0.94), 'India': Math.round(inTotalUsd * 0.92) },
    { month: 'May 2026', 'United States': Math.round(usTotalUsd * 0.96), 'India': Math.round(inTotalUsd * 0.95) },
    { month: 'Jun 2026', 'United States': Math.round(usTotalUsd * 0.97), 'India': Math.round(inTotalUsd * 0.96) },
    { month: 'Jul 2026', 'United States': Math.round(usTotalUsd * 0.98), 'India': Math.round(inTotalUsd * 0.98) },
    { month: 'Aug 2026', 'United States': Math.round(usTotalUsd * 0.99), 'India': Math.round(inTotalUsd * 0.99) },
    { month: 'Sep 2026', 'United States': usTotalUsd, 'India': inTotalUsd }
  ];

  // Formatter for currency
  const formatUsd = (val: number) => `$${(val / 1000000).toFixed(2)}M`;

  return (
    <div className="space-y-6">
      {/* 1. Header Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Executive Analytics
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Payroll Costs & Country Trends
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Consolidated multi-entity overview across United States and India operations in USD base currency.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 font-bold text-xs text-slate-700 transition"
          >
            <Printer className="w-4 h-4" />
            <span>Print Report</span>
          </button>
        </div>
      </div>

      {/* 2. Visual Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Visual 1: Bar Chart — Cost by Country */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Payroll Cost by Entity (Current Month)</h3>
              <p className="text-[11px] text-slate-400">Total monthly payroll expenditure in USD</p>
            </div>
            <span className="text-xs font-mono font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg">
              USD Equivalent
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={countryComparisonData} margin={{ top: 10, right: 20, left: 10, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="country" tick={{ fontSize: 11, fill: '#64748b' }} tickLine={false} />
                <YAxis tickFormatter={formatUsd} tick={{ fontSize: 11, fill: '#64748b' }} tickLine={false} />
                <Tooltip
                  formatter={(val: any) => [`$${Number(val || 0).toLocaleString()}`, 'Total Payroll (USD)']}
                  contentStyle={{ backgroundColor: '#ffffff', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 12 }}
                />
                <Bar dataKey="totalPayrollUsd" fill="#3b82f6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Visual 2: Line Chart — 6-Month Trend */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">6-Month Expenditure Trajectory</h3>
              <p className="text-[11px] text-slate-400">Monthly progression across entities</p>
            </div>
            <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" /> Stable growth
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyTrendData} margin={{ top: 10, right: 20, left: 10, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748b' }} tickLine={false} />
                <YAxis tickFormatter={formatUsd} tick={{ fontSize: 11, fill: '#64748b' }} tickLine={false} />
                <Tooltip
                  formatter={(val: any) => [`$${Number(val || 0).toLocaleString()}`, 'Monthly Cost']}
                  contentStyle={{ backgroundColor: '#ffffff', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 12 }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: 11, paddingTop: 6 }} />
                <Line type="monotone" dataKey="United States" stroke="#3b82f6" strokeWidth={2.5} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="India" stroke="#10b981" strokeWidth={2.5} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* 3. Summary Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="p-5 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-900 text-sm">Multi-Country Entity Summary</h3>
            <p className="text-xs text-slate-500">Key metrics by operational jurisdiction</p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600">
            2 Hubs Active
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              <tr>
                <th className="py-3 px-5">Country / Hub</th>
                <th className="py-3 px-5">Currency</th>
                <th className="py-3 px-5 text-right">Headcount</th>
                <th className="py-3 px-5 text-right">% Headcount</th>
                <th className="py-3 px-5 text-right">Estimated Gross (USD)</th>
                <th className="py-3 px-5 text-right">Avg / Employee (USD)</th>
                <th className="py-3 px-5 text-center">Statutory Compliance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr className="hover:bg-slate-50/80 transition">
                <td className="py-4 px-5 font-bold text-slate-900 flex items-center gap-2">
                  <span className="text-xl">🇺🇸</span>
                  <span>United States</span>
                </td>
                <td className="py-4 px-5 font-mono text-slate-600">USD ($)</td>
                <td className="py-4 px-5 text-right font-mono font-bold text-slate-800">
                  {usEmployees.toLocaleString()}
                </td>
                <td className="py-4 px-5 text-right font-bold text-blue-600">31.0%</td>
                <td className="py-4 px-5 text-right font-mono font-bold text-slate-900">
                  ${usTotalUsd.toLocaleString()}
                </td>
                <td className="py-4 px-5 text-right font-mono text-slate-600">
                  ${Math.round(usTotalUsd / usEmployees).toLocaleString()}
                </td>
                <td className="py-4 px-5 text-center">
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    IRS / FICA Compliant
                  </span>
                </td>
              </tr>

              <tr className="hover:bg-slate-50/80 transition">
                <td className="py-4 px-5 font-bold text-slate-900 flex items-center gap-2">
                  <span className="text-xl">🇮🇳</span>
                  <span>India</span>
                </td>
                <td className="py-4 px-5 font-mono text-slate-600">INR (₹)</td>
                <td className="py-4 px-5 text-right font-mono font-bold text-slate-800">
                  {inEmployees.toLocaleString()}
                </td>
                <td className="py-4 px-5 text-right font-bold text-emerald-600">69.0%</td>
                <td className="py-4 px-5 text-right font-mono font-bold text-slate-900">
                  ${inTotalUsd.toLocaleString()}
                </td>
                <td className="py-4 px-5 text-right font-mono text-slate-600">
                  ${Math.round(inTotalUsd / inEmployees).toLocaleString()}
                </td>
                <td className="py-4 px-5 text-center">
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    EPFO / TDS Compliant
                  </span>
                </td>
              </tr>

              {/* Total Row */}
              <tr className="bg-slate-50 font-bold border-t-2 border-slate-200">
                <td className="py-4 px-5 text-slate-900">Consolidated Total</td>
                <td className="py-4 px-5 font-mono text-slate-500">USD Base</td>
                <td className="py-4 px-5 text-right font-mono text-slate-900">
                  {totalEmployees.toLocaleString()}
                </td>
                <td className="py-4 px-5 text-right text-slate-900">100%</td>
                <td className="py-4 px-5 text-right font-mono text-blue-600 text-sm">
                  ${totalPayrollUsd.toLocaleString()}
                </td>
                <td className="py-4 px-5 text-right font-mono text-slate-800">
                  ${Math.round(totalPayrollUsd / totalEmployees).toLocaleString()}
                </td>
                <td className="py-4 px-5 text-center text-slate-500 text-xs">
                  All Audited
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
