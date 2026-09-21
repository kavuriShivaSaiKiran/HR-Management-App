import React, { useState } from 'react';
import {
  X,
  History,
  DollarSign,
  Briefcase,
  Globe,
  Calendar,
  Mail,
  UserCheck,
  UserX,
  TrendingUp,
  PlusCircle,
  Edit2,
  Trash2,
  CheckCircle2,
  AlertCircle,
  FileText,
  ShieldCheck
} from 'lucide-react';
import { Employee, Department, PayBand } from '../types';
import { formatCurrency, getInitials } from '../lib/utils';
import { PayslipModal } from './PayslipModal';

interface EmployeeDetailModalProps {
  employee: Employee | null;
  departments: Department[];
  payBands: PayBand[];
  onClose: () => void;
  onOpenSalaryChange: (emp: Employee) => void;
  onUpdateEmployee: (id: number, data: any) => Promise<void>;
  onSoftDelete: (emp: Employee) => Promise<void>;
}

export const EmployeeDetailModal: React.FC<EmployeeDetailModalProps> = ({
  employee,
  departments,
  payBands,
  onClose,
  onOpenSalaryChange,
  onUpdateEmployee,
  onSoftDelete
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showPayslip, setShowPayslip] = useState(false);
  const [editRole, setEditRole] = useState(employee?.role_title || '');
  const [editDeptId, setEditDeptId] = useState(employee?.department_id || 1);
  const [editBandId, setEditBandId] = useState(employee?.pay_band_id || 1);
  const [editStatus, setEditStatus] = useState<'active' | 'inactive'>(employee?.employment_status || 'active');
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState('');

  if (!employee) return null;

  const isIndia = employee.country_code === 'IN';
  const currencySymbol = isIndia ? '₹' : '$';
  const baseSalaryAnnual = employee.current_salary || (isIndia ? 2400000 : 108000);
  const baseMonthly = Math.round(baseSalaryAnnual / 12);
  const allowanceAmount = Math.round(isIndia ? baseMonthly * 0.40 : baseMonthly * 0.04);
  const grossMonthly = baseMonthly + allowanceAmount;
  const deductionsMonthly = isIndia
    ? Math.round(grossMonthly * 0.15 + baseMonthly * 0.12 + 200)
    : Math.round(grossMonthly * 0.2565);
  const netMonthly = grossMonthly - deductionsMonthly;

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveError('');
    try {
      await onUpdateEmployee(employee.id, {
        role_title: editRole,
        department_id: editDeptId,
        pay_band_id: editBandId,
        employment_status: editStatus
      });
      setIsEditing(false);
    } catch (err: any) {
      setSaveError(err.message || 'Failed to save employee changes');
    } finally {
      setIsSaving(false);
    }
  };

  const currentPayBand = payBands.find(b => b.id === employee.pay_band_id);

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-2xl rounded-2xl sm:rounded-3xl border border-slate-200 shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="p-4 sm:p-6 bg-slate-50 border-b border-slate-100 flex items-start justify-between shrink-0">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-blue-600 text-white flex items-center justify-center text-lg sm:text-xl font-extrabold shadow-md shadow-blue-500/20 shrink-0">
              {getInitials(employee.first_name, employee.last_name)}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-lg sm:text-xl font-extrabold text-slate-900">
                  {employee.first_name} {employee.last_name}
                </h3>
                <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-md bg-blue-100 text-blue-700">
                  {employee.employee_code}
                </span>
                {employee.employment_status === 'active' ? (
                  <span className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                    <UserCheck className="w-3 h-3" /> Active
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">
                    <UserX className="w-3 h-3" /> Inactive
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 mt-1 flex flex-wrap items-center gap-1.5 sm:gap-2">
                <span>{employee.role_title}</span>
                <span>·</span>
                <span>{employee.department_name}</span>
                <span>·</span>
                <span>{employee.country_code} ({employee.currency_code})</span>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition min-h-[44px] min-w-[44px] flex items-center justify-center shrink-0"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 space-y-5 sm:space-y-6 overflow-y-auto flex-1">
          {saveError && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{saveError}</span>
            </div>
          )}

          {/* Quick Info Grid */}
          {!isEditing ? (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Current Salary</span>
                <span className="font-extrabold text-blue-600 text-base">
                  {employee.current_salary ? formatCurrency(employee.current_salary, employee.currency_code) : '—'}
                </span>
                {employee.currency_code !== 'USD' && employee.current_salary_usd && (
                  <span className="block text-[10px] text-slate-400 mt-0.5">
                    ≈ ${employee.current_salary_usd.toLocaleString()} USD
                  </span>
                )}
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Pay Band</span>
                <span className="font-bold text-slate-800 text-sm">{employee.pay_band_name || 'L3'}</span>
                {currentPayBand && (
                  <span className="block text-[10px] text-slate-400 mt-0.5">
                    ${(currentPayBand.min_salary / 1000)}k – ${(currentPayBand.max_salary / 1000)}k
                  </span>
                )}
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Hire Date</span>
                <span className="font-bold text-slate-800 text-sm">{employee.hire_date}</span>
                <span className="block text-[10px] text-slate-400 mt-0.5">Permanent</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Work Email</span>
                <span className="font-bold text-slate-800 text-xs truncate block" title={employee.email}>
                  {employee.email}
                </span>
                <span className="block text-[10px] text-slate-400 mt-0.5">Verified</span>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSaveEdit} className="p-4 rounded-2xl bg-blue-50/50 border border-blue-200 space-y-3">
              <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wide">Edit Employee Profile</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Role Title</label>
                  <input
                    type="text"
                    value={editRole}
                    onChange={(e) => setEditRole(e.target.value)}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg bg-white"
                    required
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Department</label>
                  <select
                    value={editDeptId}
                    onChange={(e) => setEditDeptId(Number(e.target.value))}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg bg-white"
                  >
                    {departments.map((d) => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Pay Band</label>
                  <select
                    value={editBandId}
                    onChange={(e) => setEditBandId(Number(e.target.value))}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg bg-white"
                  >
                    {payBands.map((b) => (
                      <option key={b.id} value={b.id}>{b.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Employment Status</label>
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value as any)}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg bg-white"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-3 py-1 text-xs font-semibold text-slate-600 hover:bg-slate-200/60 rounded-lg transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-4 py-1 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-2xs transition"
                >
                  {isSaving ? 'Saving...' : 'Save Profile'}
                </button>
              </div>
            </form>
          )}

          {/* Localized Compensation Breakdown Card */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-50 to-blue-50/40 border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-600" />
                <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wide">
                  Monthly Compensation & Statutory Structure ({employee.currency_code})
                </h4>
              </div>
              <button
                onClick={() => setShowPayslip(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>View Payslip</span>
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-400 font-semibold block uppercase">Base Monthly</span>
                <span className="font-bold font-mono text-slate-900 text-sm">
                  {currencySymbol}{baseMonthly.toLocaleString()}
                </span>
              </div>

              <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-400 font-semibold block uppercase">
                  {isIndia ? 'HRA Allowance (40%)' : '401(k) Match (4%)'}
                </span>
                <span className="font-bold font-mono text-emerald-600 text-sm">
                  +{currencySymbol}{allowanceAmount.toLocaleString()}
                </span>
              </div>

              <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-400 font-semibold block uppercase">
                  {isIndia ? 'TDS + EPF Withheld' : 'Federal + FICA Tax'}
                </span>
                <span className="font-bold font-mono text-rose-600 text-sm">
                  -{currencySymbol}{deductionsMonthly.toLocaleString()}
                </span>
              </div>

              <div className="bg-blue-50 p-2.5 rounded-xl border border-blue-200">
                <span className="text-[10px] text-blue-600 font-bold block uppercase">Net Disbursal</span>
                <span className="font-bold font-mono text-blue-700 text-sm">
                  {currencySymbol}{netMonthly.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Action Row */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            <div className="flex items-center gap-2">
              <button
                onClick={() => onOpenSalaryChange(employee)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition"
              >
                <DollarSign className="w-4 h-4" />
                <span>Record Salary Revision</span>
              </button>

              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 rounded-xl transition"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Edit Profile</span>
                </button>
              )}
            </div>

            {employee.employment_status === 'active' && (
              <button
                onClick={() => onSoftDelete(employee)}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-rose-600 hover:bg-rose-50 border border-rose-200 text-xs font-bold rounded-xl transition"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Soft Delete Employee</span>
              </button>
            )}
          </div>

          {/* Chronological Salary History Timeline & Table */}
          <div className="border border-slate-200 rounded-2xl p-4 bg-slate-50/50 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <History className="w-4 h-4 text-blue-600" />
                <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wide">
                  Salary History & Audit Trail
                </h4>
              </div>
              <span className="text-[11px] text-slate-400 font-medium">
                {employee.salary_records?.length || 0} recorded changes
              </span>
            </div>

            <div className="overflow-x-auto bg-white rounded-xl border border-slate-200">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 font-semibold uppercase text-[10px] border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3">Effective Date</th>
                    <th className="py-2.5 px-3">Base Compensation</th>
                    <th className="py-2.5 px-3">Currency</th>
                    <th className="py-2.5 px-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {employee.salary_records && employee.salary_records.length > 0 ? (
                    employee.salary_records.map((rec) => (
                      <tr key={rec.id} className={rec.is_current ? "bg-blue-50/40" : ""}>
                        <td className="py-2.5 px-3 font-semibold text-slate-800">
                          {rec.effective_date}
                        </td>
                        <td className="py-2.5 px-3 font-bold text-slate-900">
                          {formatCurrency(rec.base_salary, rec.currency_code)}
                        </td>
                        <td className="py-2.5 px-3 text-slate-500 font-mono">
                          {rec.currency_code}
                        </td>
                        <td className="py-2.5 px-3">
                          {rec.is_current ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800">
                              <CheckCircle2 className="w-3 h-3" /> Current
                            </span>
                          ) : (
                            <span className="text-[10px] font-semibold text-slate-400 px-2 py-0.5 rounded-md bg-slate-100">
                              Historical
                            </span>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="py-4 text-center text-slate-400">
                        No salary history records found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold rounded-xl transition"
          >
            Close Window
          </button>
        </div>
      </div>

      {/* Payslip Modal View */}
      {showPayslip && (
        <PayslipModal
          employee={employee}
          period="September 2026"
          onClose={() => setShowPayslip(false)}
        />
      )}
    </div>
  );
};
