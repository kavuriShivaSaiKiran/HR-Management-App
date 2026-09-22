import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  DollarSign,
  Building2,
  User,
  Briefcase,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle2,
  AlertCircle,
  Calendar,
  Layers,
  Info,
  ShieldCheck,
  TrendingUp,
  Percent
} from 'lucide-react';
import { Employee, PayBand } from '../types';
import { cn } from '../lib/utils';

interface EditSalaryModalProps {
  isOpen: boolean;
  employee: Employee | null;
  payBands?: PayBand[];
  onClose: () => void;
  onSave: (
    employeeId: number,
    data: {
      new_salary: number;
      currency_code: string;
      effective_date: string;
      reason: string;
      comment?: string;
      changed_by?: string;
    }
  ) => Promise<void>;
  onViewHistory?: (employee: Employee) => void;
}

export const EditSalaryModal: React.FC<EditSalaryModalProps> = ({
  isOpen,
  employee,
  payBands = [],
  onClose,
  onSave,
  onViewHistory
}) => {
  const [salaryInput, setSalaryInput] = useState<string>('');
  const [effectiveDate, setEffectiveDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [reason, setReason] = useState<string>('Annual review');
  const [comment, setComment] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (employee) {
      setSalaryInput(employee.current_salary ? String(employee.current_salary) : '');
      setEffectiveDate(new Date().toISOString().split('T')[0]);
      setReason('Annual review');
      setComment('');
      setErrorMessage(null);
      setSuccessMessage(null);
    }
  }, [employee]);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !employee) return null;

  const currentSalary = employee.current_salary || 0;
  const parsedNewSalary = parseFloat(salaryInput.replace(/,/g, ''));
  const isValidNumber = !isNaN(parsedNewSalary) && parsedNewSalary > 0;
  const isDifferent = isValidNumber && Math.abs(parsedNewSalary - currentSalary) > 0.01;
  const delta = isValidNumber ? parsedNewSalary - currentSalary : 0;
  const deltaPct = currentSalary > 0 ? (delta / currentSalary) * 100 : 0;
  const isPositive = delta >= 0;

  const currencySymbol = employee.currency_code === 'INR' ? '₹' : '$';

  // Find pay band
  const matchingBand = payBands.find((b) => b.id === employee.pay_band_id);
  // India INR rates are higher scale; if USD equivalent comparison is needed:
  const isIndia = employee.country_code === 'IN';
  const usdRate = isIndia ? 0.012 : 1.0;
  const newSalaryUsd = isValidNumber ? Math.round(parsedNewSalary * usdRate) : 0;
  const currentSalaryUsd = Math.round(currentSalary * usdRate);

  const isAboveBand = matchingBand && newSalaryUsd > matchingBand.max_salary;
  const isBelowBand = matchingBand && newSalaryUsd < matchingBand.min_salary;

  const handleApplyPercentage = (pct: number) => {
    if (currentSalary > 0) {
      const calculated = isIndia
        ? Math.round((currentSalary * (1 + pct / 100)) / 1000) * 1000
        : Math.round((currentSalary * (1 + pct / 100)) / 100) * 100;
      setSalaryInput(String(calculated));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidNumber) {
      setErrorMessage('Please enter a valid salary amount greater than zero.');
      return;
    }
    if (!isDifferent) {
      setErrorMessage('New salary must be different from current salary.');
      return;
    }
    if (!reason) {
      setErrorMessage('Please specify a reason for this salary change.');
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMessage(null);
      await onSave(employee.id, {
        new_salary: parsedNewSalary,
        currency_code: employee.currency_code,
        effective_date: effectiveDate,
        reason,
        comment: comment.trim(),
        changed_by: 'HR Manager'
      });
      setSuccessMessage('Salary change recorded and logged to audit trail.');
      setTimeout(() => {
        onClose();
      }, 700);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to update salary');
    } finally {
      setIsSubmitting(false);
    }
  };

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
            className="w-full sm:w-screen max-w-full sm:max-w-md md:max-w-lg bg-white shadow-2xl flex flex-col border-l border-slate-200 h-full"
          >
            {/* Header */}
            <div className="p-5 bg-slate-50/80 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold shadow-xs">
                  <DollarSign className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900">
                    Edit Employee Salary
                  </h2>
                  <p className="text-xs text-slate-500">
                    Audited compensation adjustment with live change preview
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

            {/* Employee Info Header Card */}
            <div className="p-5 border-b border-slate-100 bg-white">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider font-mono">
                    {employee.employee_code}
                  </span>
                  <h3 className="text-base font-black text-slate-900 mt-0.5">
                    {employee.first_name} {employee.last_name}
                  </h3>
                  <p className="text-xs text-slate-500">{employee.role_title}</p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                    {employee.country_code === 'IN' ? '🇮🇳 India' : '🇺🇸 United States'}
                  </span>
                  <p className="text-[11px] text-slate-400 mt-1 font-medium">{employee.department_name}</p>
                </div>
              </div>

              {/* Current Salary Benchmark Banner */}
              <div className="mt-4 p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">
                    Current Annual Base Salary
                  </span>
                  <span className="text-base font-black text-slate-900 font-mono">
                    {currencySymbol}{currentSalary.toLocaleString()} {employee.currency_code}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">
                    USD Equivalent
                  </span>
                  <span className="text-xs font-extrabold text-slate-700 font-mono">
                    ${currentSalaryUsd.toLocaleString()} USD
                  </span>
                </div>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 space-y-4">
              {/* Notifications */}
              {errorMessage && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}
              {successMessage && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-700 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{successMessage}</span>
                </div>
              )}

              {/* Field 1: New Annual Base Salary */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                  <span>New Annual Base Salary ({employee.currency_code})</span>
                  <span className="text-[10px] font-semibold text-blue-600">Required</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400 pointer-events-none">
                    {currencySymbol}
                  </span>
                  <input
                    type="number"
                    step="any"
                    value={salaryInput}
                    onChange={(e) => setSalaryInput(e.target.value)}
                    placeholder="e.g. 120000"
                    className="w-full pl-8 pr-16 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition font-mono"
                    required
                  />
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 pointer-events-none">
                    {employee.currency_code}
                  </span>
                </div>

                {/* Quick percentage adjusters */}
                <div className="flex items-center gap-1.5 pt-1">
                  <span className="text-[11px] text-slate-400 font-semibold mr-1">Quick:</span>
                  {[3, 5, 8, 10, 15].map((pct) => (
                    <button
                      key={pct}
                      type="button"
                      onClick={() => handleApplyPercentage(pct)}
                      className="px-2 py-0.5 text-[10px] font-bold rounded-lg border border-slate-200 bg-white hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300 text-slate-600 transition"
                    >
                      +{pct}%
                    </button>
                  ))}
                </div>
              </div>

              {/* Live Change Preview Card */}
              {isValidNumber && (
                <div className="p-3.5 bg-blue-50/50 rounded-xl border border-blue-100 space-y-2 text-xs">
                  <div className="flex items-center justify-between font-bold text-slate-800">
                    <span className="flex items-center gap-1 text-[11px] text-blue-900 uppercase">
                      <TrendingUp className="w-3.5 h-3.5 text-blue-600" />
                      Live Change Preview
                    </span>
                    <span
                      className={cn(
                        "inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-xs font-extrabold font-mono",
                        delta >= 0
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-rose-100 text-rose-800"
                      )}
                    >
                      {delta >= 0 ? '+' : ''}{deltaPct.toFixed(1)}%
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-1 border-t border-blue-100/80">
                    <div>
                      <span className="text-[10px] text-slate-500 block">Absolute Adjustment</span>
                      <span className="font-extrabold text-slate-900 font-mono">
                        {delta >= 0 ? '+' : ''}{currencySymbol}{delta.toLocaleString()} {employee.currency_code}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 block">New USD Equivalent</span>
                      <span className="font-extrabold text-slate-900 font-mono">
                        ${newSalaryUsd.toLocaleString()} USD
                      </span>
                    </div>
                  </div>

                  {/* Warnings */}
                  {delta < 0 && (
                    <div className="text-[11px] text-rose-700 bg-rose-50 p-2 rounded-lg border border-rose-200 flex items-center gap-1.5 mt-1">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>Warning: This change constitutes a salary reduction.</span>
                    </div>
                  )}

                  {isAboveBand && (
                    <div className="text-[11px] text-amber-700 bg-amber-50 p-2 rounded-lg border border-amber-200 flex items-center gap-1.5 mt-1">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>Note: Proposed salary exceeds standard {matchingBand?.name} maximum (${matchingBand?.max_salary.toLocaleString()} USD).</span>
                    </div>
                  )}
                </div>
              )}

              {/* Field 2: Effective Date */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>Effective Date</span>
                </label>
                <input
                  type="date"
                  value={effectiveDate}
                  onChange={(e) => setEffectiveDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
                  required
                />
              </div>

              {/* Field 3: Reason for Change */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">
                  Reason for Adjustment <span className="text-rose-500">*</span>
                </label>
                <select
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition cursor-pointer"
                  required
                >
                  <option value="Annual review">Annual review / Merit increase</option>
                  <option value="Promotion">Promotion to higher tier</option>
                  <option value="Market adjustment">Market / Geo-compensation adjustment</option>
                  <option value="Role change">Role change / Responsibility expansion</option>
                  <option value="Equity adjustment">Internal parity / Equity adjustment</option>
                  <option value="Other">Other corporate adjustment</option>
                </select>
              </div>

              {/* Field 4: Comment / Justification */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                  <span>Audit Notes & Justification (Optional)</span>
                  <span className="text-[10px] text-slate-400">Stored in audit log</span>
                </label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={2}
                  placeholder="e.g. Exceeded performance targets during 2026 engineering merit cycle review."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition resize-none"
                />
              </div>
            </form>

            {/* Footer Buttons */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3">
              {onViewHistory && (
                <button
                  type="button"
                  onClick={() => onViewHistory(employee)}
                  className="text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-200/50 px-3 py-2 rounded-xl transition"
                >
                  View History
                </button>
              )}

              <div className="flex items-center gap-2 ml-auto">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-200/60 rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={!isValidNumber || !isDifferent || isSubmitting}
                  className={cn(
                    "px-4 py-2 text-xs font-bold text-white rounded-xl shadow-xs transition flex items-center gap-1.5",
                    !isValidNumber || !isDifferent || isSubmitting
                      ? "bg-slate-300 cursor-not-allowed text-slate-500"
                      : "bg-blue-600 hover:bg-blue-700 cursor-pointer"
                  )}
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>{isSubmitting ? 'Saving...' : 'Save Salary Change'}</span>
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
};
