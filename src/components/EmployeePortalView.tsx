import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  User,
  DollarSign,
  TrendingUp,
  Layers,
  Calendar,
  Building,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  Info,
  Globe2,
  Award
} from 'lucide-react';
import { Employee, SalaryRecord } from '../types';

interface EmployeePortalViewProps {
  employee: Employee;
  onSwitchPersona?: (persona: 'hr.global' | 'hr.india' | 'employee') => void;
}

export const EmployeePortalView: React.FC<EmployeePortalViewProps> = ({
  employee,
  onSwitchPersona
}) => {
  const [history, setHistory] = useState<SalaryRecord[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState<boolean>(false);

  const isIndia = employee.country_code === 'IN';
  const currencySymbol = isIndia ? '₹' : '$';
  const currencyCode = isIndia ? 'INR' : 'USD';

  const baseAnnual = employee.current_salary || (isIndia ? 2800000 : 120000);
  const usdRate = isIndia ? 0.012 : 1.0;
  const baseAnnualUsd = Math.round(baseAnnual * usdRate);

  // Band calculations
  const bandMin = Math.round(baseAnnual * 0.85);
  const bandMid = baseAnnual;
  const bandMax = Math.round(baseAnnual * 1.25);
  const compaRatio = Math.round((baseAnnual / bandMid) * 100);

  useEffect(() => {
    const fetchHistory = async () => {
      setIsLoadingHistory(true);
      try {
        const res = await fetch(`/api/employees/${employee.id}/history`);
        if (res.ok) {
          const data: SalaryRecord[] = await res.json();
          setHistory(data);
        }
      } catch (err) {
        console.error('Failed to load employee history', err);
      } finally {
        setIsLoadingHistory(false);
      }
    };
    fetchHistory();
  }, [employee.id]);

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* 1. Welcome & Persona Switcher Banner */}
      <div className="bg-gradient-to-r from-blue-700 via-blue-800 to-indigo-900 rounded-2xl p-5 sm:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-white font-black text-xl sm:text-2xl shadow-inner shrink-0">
              {employee.first_name[0]}{employee.last_name[0]}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-blue-500/30 text-blue-200 border border-blue-400/20">
                  Employee Compensation Portal
                </span>
                <span className="text-xs font-mono font-semibold text-blue-200">
                  {employee.employee_code}
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black tracking-tight">
                {employee.first_name} {employee.last_name}
              </h1>
              <p className="text-xs text-blue-200 mt-0.5">
                {employee.role_title} &bull; {employee.department_name} &bull; {isIndia ? '🇮🇳 India Entity' : '🇺🇸 US Entity'}
              </p>
            </div>
          </div>

          {onSwitchPersona && (
            <div className="w-full sm:w-auto bg-white/10 backdrop-blur-xs p-3 rounded-xl border border-white/20">
              <span className="text-[11px] font-semibold text-blue-200 block mb-1.5">
                Switch Demo Persona:
              </span>
              <div className="flex items-center gap-1.5 flex-wrap">
                <button
                  onClick={() => onSwitchPersona('hr.global')}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold bg-white text-blue-900 hover:bg-blue-50 transition shadow-2xs min-h-[36px]"
                >
                  Global HR (US & IN)
                </button>
                <button
                  onClick={() => onSwitchPersona('hr.india')}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold bg-blue-600/80 text-white hover:bg-blue-600 transition min-h-[36px]"
                >
                  India HR
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 2. Key Compensation Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Card 1: Annual Base Salary */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Annual Base Salary
          </span>
          <div className="mt-2">
            <h3 className="text-xl sm:text-2xl font-black font-mono text-slate-900">
              {currencySymbol}{baseAnnual.toLocaleString()}
            </h3>
            <p className="text-[10px] sm:text-[11px] text-slate-500 mt-0.5">
              Local currency ({currencyCode})
            </p>
          </div>
        </div>

        {/* Card 2: USD Canonical Equivalent */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            USD Canonical Equiv.
          </span>
          <div className="mt-2">
            <h3 className="text-xl sm:text-2xl font-black font-mono text-emerald-600">
              ${baseAnnualUsd.toLocaleString()}
            </h3>
            <p className="text-[10px] sm:text-[11px] text-emerald-700 font-semibold mt-0.5">
              Consolidated reporting peg
            </p>
          </div>
        </div>

        {/* Card 3: Pay Band & Level */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Pay Band Grade
          </span>
          <div className="mt-2">
            <h3 className="text-xl sm:text-2xl font-black text-slate-900">
              {employee.pay_band_name || 'L3 - Senior'}
            </h3>
            <p className="text-[10px] sm:text-[11px] text-blue-600 font-semibold mt-0.5">
              Midpoint compa: {compaRatio}%
            </p>
          </div>
        </div>

        {/* Card 4: Status */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Review Status
          </span>
          <div className="mt-2">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <h3 className="text-base sm:text-lg font-black text-slate-900">
                In Good Standing
              </h3>
            </div>
            <p className="text-[10px] sm:text-[11px] text-slate-500 mt-0.5">
              Next cycle: Q4 2026
            </p>
          </div>
        </div>
      </div>

      {/* 3. Pay Band Progression Visualizer */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
              <Layers className="w-4 h-4 text-blue-600" />
              <span>Compensation Band Distribution</span>
            </h3>
            <p className="text-xs text-slate-500">
              Range alignment for {employee.role_title} within {employee.pay_band_name || 'L3 - Senior'}
            </p>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200 self-start sm:self-auto">
            Compa-Ratio: {compaRatio}%
          </span>
        </div>

        {/* Band Range Bar */}
        <div className="pt-2">
          <div className="h-3.5 bg-slate-100 rounded-full relative overflow-hidden flex items-center">
            {/* Visual gradient representing min to max */}
            <div
              className="h-full bg-gradient-to-r from-blue-400 via-blue-600 to-indigo-600 rounded-full"
              style={{ width: `${Math.min(100, Math.max(20, (baseAnnual / bandMax) * 100))}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500 font-mono font-medium mt-2">
            <div>
              <span className="block text-[10px] uppercase text-slate-400">Band Min</span>
              <span>{currencySymbol}{bandMin.toLocaleString()}</span>
            </div>
            <div className="text-center">
              <span className="block text-[10px] uppercase text-slate-400">Band Midpoint</span>
              <span className="font-bold text-slate-800">{currencySymbol}{bandMid.toLocaleString()}</span>
            </div>
            <div className="text-right">
              <span className="block text-[10px] uppercase text-slate-400">Band Max</span>
              <span>{currencySymbol}{bandMax.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Compensation Review & Audit History */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h3 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-600" />
              <span>Compensation Review History</span>
            </h3>
            <p className="text-xs text-slate-500">
              Chronological log of merit reviews, promotions, and base salary adjustments
            </p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600">
            {history.length} Record{history.length === 1 ? '' : 's'}
          </span>
        </div>

        {isLoadingHistory ? (
          <div className="p-8 text-center text-slate-400 text-xs">
            Loading compensation history...
          </div>
        ) : history.length > 0 ? (
          <div className="divide-y divide-slate-100">
            {history.map((record) => {
              const previousSalary = record.previous_salary ?? 0;
              const hasPrev = previousSalary > 0;
              const pctChange = hasPrev
                ? Math.round(((record.base_salary - previousSalary) / previousSalary) * 100)
                : 0;
              const isPositive = pctChange >= 0;

              return (
                <div
                  key={record.id}
                  className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 hover:bg-slate-50/70 transition"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100 shrink-0">
                      <TrendingUp className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-slate-900 text-sm">
                          {record.reason || 'Annual Merit Review'}
                        </h4>
                        {hasPrev && (
                          <span
                            className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                              isPositive
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : 'bg-rose-50 text-rose-700 border border-rose-200'
                            }`}
                          >
                            {isPositive ? '+' : ''}{pctChange}%
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>Effective: {record.effective_date}</span>
                        <span>&bull;</span>
                        <span>Authorized by: {record.changed_by || 'HR Committee'}</span>
                      </div>
                      {record.comment && (
                        <p className="text-xs text-slate-600 mt-1 italic">
                          &ldquo;{record.comment}&rdquo;
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="text-left sm:text-right pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 w-full sm:w-auto">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">
                      Annual Base Salary
                    </span>
                    <span className="font-mono font-black text-slate-900 text-sm sm:text-base">
                      {record.currency_code} {record.base_salary.toLocaleString()}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-8 text-center text-slate-400 text-xs">
            Initial compensation record established at hire date. No subsequent adjustments recorded.
          </div>
        )}
      </div>
    </div>
  );
};
