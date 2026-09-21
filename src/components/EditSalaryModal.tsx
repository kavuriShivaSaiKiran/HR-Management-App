import React, { useState, useEffect } from 'react';
import { X, DollarSign, Building2, User, Briefcase, Hash, ArrowUpRight, ArrowDownRight, CheckCircle2, AlertCircle } from 'lucide-react';
import { Employee } from '../types';

interface EditSalaryModalProps {
  isOpen: boolean;
  employee: Employee | null;
  onClose: () => void;
  onSave: (employeeId: number, newSalary: number) => Promise<void>;
}

export const EditSalaryModal: React.FC<EditSalaryModalProps> = ({
  isOpen,
  employee,
  onClose,
  onSave
}) => {
  const [salaryInput, setSalaryInput] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (employee) {
      setSalaryInput(employee.current_salary ? String(employee.current_salary) : '');
      setErrorMessage(null);
      setSuccessMessage(null);
    }
  }, [employee]);

  if (!isOpen || !employee) return null;

  const currentSalary = employee.current_salary || 0;
  const parsedNewSalary = parseFloat(salaryInput);
  const isValidNumber = !isNaN(parsedNewSalary) && parsedNewSalary > 0;
  const delta = isValidNumber ? parsedNewSalary - currentSalary : 0;
  const deltaPct = currentSalary > 0 ? (delta / currentSalary) * 100 : 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidNumber) {
      setErrorMessage('Please enter a valid salary amount greater than zero.');
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMessage(null);
      await onSave(employee.id, parsedNewSalary);
      setSuccessMessage('Salary successfully updated in database!');
      setTimeout(() => {
        onClose();
      }, 600);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to update salary');
    } finally {
      setIsSubmitting(false);
    }
  };

  const currencySymbol = employee.currency_code === 'INR' ? '₹' : '$';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div 
        className="relative w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl shadow-indigo-500/10 overflow-hidden transform transition-all animate-in fade-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-salary-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-800/80 bg-slate-900/60">
          <div>
            <h3 id="edit-salary-title" className="text-lg font-semibold text-slate-100 flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                <DollarSign className="w-5 h-5" />
              </span>
              Edit Employee Salary
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Direct compensation record update with database persistence
            </p>
          </div>
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Read-only Employee Summary Card */}
          <div className="rounded-xl bg-slate-950/60 border border-slate-800/80 p-4 space-y-3">
            <div className="text-xs font-semibold text-slate-400 tracking-wider uppercase">
              Employee Details (Read-Only)
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="flex items-start gap-2.5">
                <Hash className="w-4 h-4 text-slate-500 mt-0.5 shrink-0" />
                <div>
                  <div className="text-xs text-slate-500">Employee ID</div>
                  <div className="font-mono font-medium text-slate-200">{employee.employee_code}</div>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <User className="w-4 h-4 text-slate-500 mt-0.5 shrink-0" />
                <div>
                  <div className="text-xs text-slate-500">Name</div>
                  <div className="font-medium text-slate-200">{employee.first_name} {employee.last_name}</div>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Briefcase className="w-4 h-4 text-slate-500 mt-0.5 shrink-0" />
                <div>
                  <div className="text-xs text-slate-500">Role Title</div>
                  <div className="text-slate-300 truncate max-w-[180px]">{employee.role_title}</div>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Building2 className="w-4 h-4 text-slate-500 mt-0.5 shrink-0" />
                <div>
                  <div className="text-xs text-slate-500">Department</div>
                  <div className="text-slate-300">{employee.department_name || 'Engineering'}</div>
                </div>
              </div>
            </div>

            {/* Existing Salary indicator */}
            <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between text-xs">
              <span className="text-slate-400">Current Base Salary:</span>
              <span className="font-mono font-medium text-emerald-400">
                {employee.currency_code} {currentSalary.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Editable Current Salary Input */}
          <div className="space-y-2">
            <label htmlFor="current_salary" className="block text-sm font-medium text-slate-200">
              Current Salary ({employee.currency_code}) <span className="text-indigo-400">*</span>
            </label>
            <div className="relative rounded-xl shadow-sm">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                <span className="text-slate-400 font-mono text-sm">{currencySymbol}</span>
              </div>
              <input
                type="number"
                id="current_salary"
                name="current_salary"
                min="1000"
                step="500"
                required
                autoFocus
                value={salaryInput}
                onChange={(e) => setSalaryInput(e.target.value)}
                placeholder="e.g. 125000"
                className="block w-full rounded-xl border border-slate-700 bg-slate-950 py-3 pl-9 pr-20 text-slate-100 font-mono text-base placeholder-slate-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none transition-all"
              />
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3.5">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide bg-slate-800/80 px-2 py-1 rounded">
                  {employee.currency_code}
                </span>
              </div>
            </div>

            {/* Dynamic Delta Calculation */}
            {isValidNumber && delta !== 0 && (
              <div className="flex items-center gap-2 text-xs pt-1 px-1">
                {delta > 0 ? (
                  <span className="inline-flex items-center gap-1 text-emerald-400 font-medium">
                    <ArrowUpRight className="w-3.5 h-3.5" />
                    +{currencySymbol}{Math.abs(delta).toLocaleString()} (+{deltaPct.toFixed(1)}%)
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-amber-400 font-medium">
                    <ArrowDownRight className="w-3.5 h-3.5" />
                    -{currencySymbol}{Math.abs(delta).toLocaleString()} ({deltaPct.toFixed(1)}%)
                  </span>
                )}
                <span className="text-slate-500">revision vs current salary</span>
              </div>
            )}
          </div>

          {/* Feedback messages */}
          {errorMessage && (
            <div className="rounded-lg bg-rose-500/10 border border-rose-500/20 p-3 flex items-center gap-2.5 text-rose-400 text-xs animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="rounded-lg bg-emerald-500/10 border border-emerald-500/20 p-3 flex items-center gap-2.5 text-emerald-400 text-xs animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-800/60 hover:bg-slate-800 text-slate-300 hover:text-slate-100 text-sm font-medium transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !isValidNumber}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium shadow-lg shadow-indigo-600/20 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <span>Save Changes</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
