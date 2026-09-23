import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  History,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  User,
  Building2,
  Briefcase,
  Globe,
  Calendar,
  ShieldCheck,
  CheckCircle2,
  FileText
} from 'lucide-react';
import { Employee, SalaryRecord } from '../types';
import { cn } from '../lib/utils';
import { apiFetch } from '../lib/api';

interface SalaryHistoryDrawerProps {
  isOpen: boolean;
  employee: Employee | null;
  onClose: () => void;
  onOpenEditSalary?: (emp: Employee) => void;
}

export const SalaryHistoryDrawer: React.FC<SalaryHistoryDrawerProps> = ({
  isOpen,
  employee,
  onClose,
  onOpenEditSalary
}) => {
  const [history, setHistory] = useState<SalaryRecord[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen || !employee) return;
    const fetchHistory = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await apiFetch(`/api/employees/${employee.id}/history`);
        if (!res.ok) throw new Error('Failed to load salary history');
        const data: SalaryRecord[] = await res.json();
        setHistory(data);
      } catch (err: any) {
        console.error('Error fetching salary history:', err);
        setError(err.message || 'Failed to load history');
      } finally {
        setIsLoading(false);
      }
    };
    fetchHistory();
  }, [isOpen, employee]);

  if (!isOpen || !employee) return null;

  const currencySymbol = employee.currency_code === 'INR' ? '₹' : '$';

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-hidden">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs"
          onClick={onClose}
        />

        <div className="fixed inset-y-0 right-0 max-w-full flex pl-0 sm:pl-10">
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="w-full sm:w-screen max-w-full sm:max-w-xl bg-white shadow-2xl flex flex-col border-l border-slate-200 h-full"
          >
            {/* Header */}
            <div className="p-6 bg-slate-50/70 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shadow-xs">
                  <History className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-base font-bold text-slate-900">
                      Compensation History
                    </h2>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-700 font-mono">
                      {employee.employee_code}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">
                    Chronological audit trail of all salary adjustments and reviews
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Employee Profile Summary */}
            <div className="p-5 border-b border-slate-100 bg-white grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div>
                <span className="text-slate-400 block text-[10px] font-bold uppercase">Employee</span>
                <span className="font-extrabold text-slate-900">
                  {employee.first_name} {employee.last_name}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] font-bold uppercase">Role & Dept</span>
                <span className="font-semibold text-slate-800 truncate block">
                  {employee.role_title}
                </span>
                <span className="text-[10px] text-slate-500">{employee.department_name}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] font-bold uppercase">Location</span>
                <span className="font-semibold text-slate-800">
                  {employee.country_code === 'IN' ? '🇮🇳 India' : '🇺🇸 United States'}
                </span>
                <span className="text-[10px] text-slate-500 block">Currency: {employee.currency_code}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] font-bold uppercase">Current Base</span>
                <span className="font-black text-slate-900 text-sm font-mono">
                  {currencySymbol}{employee.current_salary?.toLocaleString()}
                </span>
              </div>
            </div>

            {/* History Feed */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {isLoading ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="p-4 rounded-xl border border-slate-200 bg-slate-50 animate-pulse h-28" />
                  ))}
                </div>
              ) : error ? (
                <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700">
                  {error}
                </div>
              ) : history.length === 0 ? (
                <div className="text-center py-12 text-slate-400 text-xs">
                  No historical compensation changes recorded.
                </div>
              ) : (
                <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                  {history.map((record, index) => {
                    const isCurrent = record.is_current;
                    const prevSalary = record.previous_salary || 0;
                    const delta = prevSalary > 0 ? record.base_salary - prevSalary : 0;
                    const deltaPct = prevSalary > 0 ? Math.round((delta / prevSalary) * 1000) / 10 : 0;
                    const isPositive = deltaPct >= 0;

                    return (
                      <div key={record.id || index} className="relative">
                        {/* Dot indicator */}
                        <div
                          className={cn(
                            "absolute -left-6 top-1.5 w-4 h-4 rounded-full border-2 border-white flex items-center justify-center shadow-xs",
                            isCurrent ? "bg-blue-600 ring-2 ring-blue-100" : "bg-slate-300"
                          )}
                        />

                        {/* Record Card */}
                        <div
                          className={cn(
                            "p-4 rounded-2xl border transition",
                            isCurrent
                              ? "bg-blue-50/40 border-blue-200 shadow-xs"
                              : "bg-white border-slate-200 hover:border-slate-300"
                          )}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <span
                                className={cn(
                                  "px-2 py-0.5 rounded-full text-[10px] font-bold",
                                  isCurrent
                                    ? "bg-blue-100 text-blue-700"
                                    : "bg-slate-100 text-slate-700"
                                )}
                              >
                                {record.reason || 'Compensation Record'}
                              </span>
                              {isCurrent && (
                                <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-700">
                                  Current Active
                                </span>
                              )}
                            </div>
                            <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              Effective: {record.effective_date}
                            </span>
                          </div>

                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 py-2 border-y border-slate-100 my-2 text-xs">
                            <div>
                              <span className="text-[10px] text-slate-400 block font-bold uppercase">Salary</span>
                              <span className="text-base font-black text-slate-900 font-mono">
                                {currencySymbol}{record.base_salary.toLocaleString()}
                              </span>
                            </div>
                            {prevSalary > 0 && (
                              <>
                                <div>
                                  <span className="text-[10px] text-slate-400 block font-bold uppercase">Previous</span>
                                  <span className="text-xs font-semibold text-slate-500 font-mono">
                                    {currencySymbol}{prevSalary.toLocaleString()}
                                  </span>
                                </div>
                                <div>
                                  <span className="text-[10px] text-slate-400 block font-bold uppercase">Adjustment</span>
                                  <span
                                    className={cn(
                                      "inline-flex items-center gap-0.5 text-xs font-bold font-mono",
                                      isPositive ? "text-emerald-600" : "text-rose-600"
                                    )}
                                  >
                                    {isPositive ? '+' : ''}{deltaPct}%
                                  </span>
                                </div>
                              </>
                            )}
                          </div>

                          {record.comment && (
                            <div className="mt-2 text-xs text-slate-600 italic bg-white/70 p-2 rounded-lg border border-slate-100">
                              "{record.comment}"
                            </div>
                          )}

                          <div className="mt-2 pt-2 flex items-center justify-between text-[10px] text-slate-400">
                            <span className="flex items-center gap-1">
                              <ShieldCheck className="w-3 h-3 text-slate-400" />
                              Recorded by: {record.changed_by || 'HR Manager'}
                            </span>
                            {record.created_at && (
                              <span>{new Date(record.created_at).toLocaleDateString()}</span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-200/60 transition"
              >
                Close
              </button>
              {onOpenEditSalary && (
                <button
                  onClick={() => {
                    onClose();
                    onOpenEditSalary(employee);
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-xs transition"
                >
                  Adjust Salary Now
                </button>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
};
