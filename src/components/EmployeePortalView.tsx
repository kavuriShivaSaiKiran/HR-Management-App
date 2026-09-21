import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  User,
  CreditCard,
  FileText,
  Calendar,
  Building,
  ShieldCheck,
  Download,
  ArrowUpRight,
  TrendingUp,
  CheckCircle2,
  Lock
} from 'lucide-react';
import { Employee } from '../types';
import { PayslipModal } from './PayslipModal';

interface EmployeePortalViewProps {
  employee: Employee;
  onSwitchPersona?: (persona: 'hr.global' | 'hr.india' | 'employee') => void;
}

export const EmployeePortalView: React.FC<EmployeePortalViewProps> = ({
  employee,
  onSwitchPersona
}) => {
  const [selectedPayslipPeriod, setSelectedPayslipPeriod] = useState<string | null>(null);

  const isIndia = employee.country_code === 'IN';
  const currencySymbol = isIndia ? '₹' : '$';
  const currencyCode = isIndia ? 'INR' : 'USD';

  const baseAnnual = employee.current_salary || 2800000;
  const baseMonthly = Math.round(baseAnnual / 12);
  const hraMonthly = Math.round(baseMonthly * 0.40);
  const grossMonthly = baseMonthly + hraMonthly;
  const epfMonthly = Math.round(baseMonthly * 0.12);
  const tdsMonthly = Math.round(grossMonthly * 0.15);
  const ptMonthly = 200;
  const totalDeductions = epfMonthly + tdsMonthly + ptMonthly;
  const netMonthly = grossMonthly - totalDeductions;

  const pastPayslips = [
    { period: 'September 2026', payDate: 'Sep 30, 2026', status: 'Disbursed', net: netMonthly, bonus: 25000 },
    { period: 'August 2026', payDate: 'Aug 31, 2026', status: 'Disbursed', net: netMonthly, bonus: 0 },
    { period: 'July 2026', payDate: 'Jul 31, 2026', status: 'Disbursed', net: netMonthly, bonus: 0 }
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* 1. Welcome & Persona Switcher Banner */}
      <div className="bg-gradient-to-r from-blue-700 via-blue-800 to-indigo-900 rounded-2xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-white font-black text-2xl shadow-inner">
              {employee.first_name[0]}{employee.last_name[0]}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-blue-500/30 text-blue-200 border border-blue-400/20">
                  Employee Self-Service Portal
                </span>
                <span className="text-xs font-semibold text-blue-200">
                  {employee.employee_code}
                </span>
              </div>
              <h1 className="text-2xl font-black tracking-tight">
                Welcome, {employee.first_name} {employee.last_name}
              </h1>
              <p className="text-xs text-blue-200 mt-1">
                {employee.role_title} &bull; {employee.department_name} &bull; 🇮🇳 Bengaluru, India
              </p>
            </div>
          </div>

          {onSwitchPersona && (
            <div className="bg-white/10 backdrop-blur-xs p-3 rounded-xl border border-white/20">
              <span className="text-[11px] font-semibold text-blue-200 block mb-1.5">
                Switch Demo Persona:
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => onSwitchPersona('hr.global')}
                  className="px-3 py-1 rounded-lg text-xs font-bold bg-white text-blue-900 hover:bg-blue-50 transition shadow-2xs"
                >
                  Global HR (US & IN)
                </button>
                <button
                  onClick={() => onSwitchPersona('hr.india')}
                  className="px-3 py-1 rounded-lg text-xs font-bold bg-blue-600/80 text-white hover:bg-blue-600 transition"
                >
                  India HR
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 2. Monthly Compensation Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-xs font-semibold text-slate-400 block uppercase">Monthly Gross Pay</span>
          <h3 className="text-2xl font-black font-mono text-slate-900 mt-1">
            {currencySymbol}{grossMonthly.toLocaleString()}
          </h3>
          <p className="text-[11px] text-slate-400 mt-1">
            Base ({currencySymbol}{baseMonthly.toLocaleString()}) + HRA ({currencySymbol}{hraMonthly.toLocaleString()})
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-xs font-semibold text-slate-400 block uppercase">Statutory Deductions</span>
          <h3 className="text-2xl font-black font-mono text-rose-600 mt-1">
            -{currencySymbol}{totalDeductions.toLocaleString()}
          </h3>
          <p className="text-[11px] text-slate-400 mt-1">
            EPF (12%) + TDS (15%) + Prof. Tax
          </p>
        </div>

        <div className="bg-emerald-600 text-white p-5 rounded-2xl shadow-xs">
          <span className="text-xs font-bold text-emerald-200 block uppercase">Monthly Take-Home Pay</span>
          <h3 className="text-2xl font-black font-mono text-white mt-1">
            {currencySymbol}{netMonthly.toLocaleString()}
          </h3>
          <div className="flex items-center gap-1 text-[11px] text-emerald-100 mt-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Direct Deposit verified</span>
          </div>
        </div>
      </div>

      {/* 3. My Payslips Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="p-5 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">My Payslip Archive</h3>
            <p className="text-xs text-slate-500">Download and inspect certified monthly compensation slips</p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600">
            3 Statements Available
          </span>
        </div>

        <div className="divide-y divide-slate-100">
          {pastPayslips.map((ps, idx) => (
            <div
              key={idx}
              className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-slate-50 transition"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">{ps.period}</h4>
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <span>Pay Date: {ps.payDate}</span>
                    <span>&bull;</span>
                    <span className="text-emerald-700 font-semibold">{ps.status}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                <div className="text-right">
                  <span className="text-xs text-slate-400 block">Net Disbursed</span>
                  <span className="font-mono font-bold text-slate-900 text-sm">
                    {currencySymbol}{(ps.net + ps.bonus).toLocaleString()}
                  </span>
                </div>

                <button
                  onClick={() => setSelectedPayslipPeriod(ps.period)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 font-bold text-xs transition border border-blue-200"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>View Payslip</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Payslip Modal */}
      {selectedPayslipPeriod && (
        <PayslipModal
          employee={employee}
          period={selectedPayslipPeriod}
          bonusAmount={selectedPayslipPeriod === 'September 2026' ? 25000 : 0}
          onClose={() => setSelectedPayslipPeriod(null)}
        />
      )}
    </div>
  );
};
