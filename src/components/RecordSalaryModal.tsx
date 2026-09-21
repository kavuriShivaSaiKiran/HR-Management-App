import React, { useState } from 'react';
import { X, DollarSign, History, AlertCircle, TrendingUp } from 'lucide-react';
import { Employee, PayBand } from '../types';
import { formatCurrency } from '../lib/utils';

interface RecordSalaryModalProps {
  employee: Employee | null;
  payBands: PayBand[];
  onClose: () => void;
  onRecordSalaryChange: (id: number, data: any) => Promise<void>;
}

export const RecordSalaryModal: React.FC<RecordSalaryModalProps> = ({
  employee,
  payBands,
  onClose,
  onRecordSalaryChange
}) => {
  const [newSalary, setNewSalary] = useState<number>(employee?.current_salary ? Math.round(employee.current_salary * 1.08) : 80000);
  const [effectiveDate, setEffectiveDate] = useState(new Date().toISOString().split('T')[0]);
  const [currencyCode, setCurrencyCode] = useState(employee?.currency_code || 'USD');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!employee) return null;

  const currentBand = payBands.find(b => b.id === employee.pay_band_id);
  const previousSalary = employee.current_salary || 0;
  const pctChange = previousSalary > 0 ? (((newSalary - previousSalary) / previousSalary) * 100).toFixed(1) : '0.0';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsSubmitting(true);

    try {
      await onRecordSalaryChange(employee.id, {
        base_salary: Number(newSalary),
        currency_code: currencyCode,
        effective_date: effectiveDate
      });
      onClose();
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to record salary revision');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-lg rounded-2xl sm:rounded-3xl border border-slate-200 shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col animate-in fade-in zoom-in-95 duration-200">
        <div className="p-4 sm:p-6 bg-slate-50 border-b border-slate-100 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs shrink-0">
              <DollarSign className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-base">Record Salary Change</h3>
              <p className="text-xs text-slate-500">
                {employee.first_name} {employee.last_name} ({employee.employee_code})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 overflow-y-auto flex-1">
          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Current vs Proposed comparison */}
          <div className="grid grid-cols-2 gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Current Base Salary</span>
              <span className="font-extrabold text-slate-800 text-sm">
                {formatCurrency(previousSalary, employee.currency_code)}
              </span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Proposed Adjustment</span>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="font-extrabold text-emerald-600 text-sm">
                  {formatCurrency(newSalary, currencyCode)}
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-700">
                  {Number(pctChange) >= 0 ? `+${pctChange}%` : `${pctChange}%`}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">New Base Salary *</label>
              <div className="relative">
                <input
                  type="number"
                  min="1000"
                  step="500"
                  required
                  value={newSalary}
                  onChange={(e) => setNewSalary(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none"
                />
                <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400">
                  {currencyCode}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Currency *</label>
                <select
                  value={currencyCode}
                  onChange={(e) => setCurrencyCode(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none bg-white"
                >
                  <option value="USD">USD ($)</option>
                  <option value="GBP">GBP (£)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="INR">INR (₹)</option>
                  <option value="SGD">SGD (S$)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Effective Date *</label>
                <input
                  type="date"
                  required
                  value={effectiveDate}
                  onChange={(e) => setEffectiveDate(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none bg-white"
                />
              </div>
            </div>

            {/* Audit trail guarantee note */}
            <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-100 text-[11px] text-blue-800 leading-relaxed">
              <p className="font-semibold mb-0.5">Audit Trail Retention Notice:</p>
              Submitting this change will preserve the current salary record in history (<code className="font-mono text-[10px]">is_current = 0</code>) and record the new salary as the active baseline (<code className="font-mono text-[10px]">is_current = 1</code>).
            </div>
          </div>

          <div className="flex flex-col-reverse sm:flex-row justify-end gap-2.5 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition min-h-[42px]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto px-5 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs transition disabled:opacity-50 min-h-[42px]"
            >
              {isSubmitting ? 'Recording...' : 'Confirm Salary Revision'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
