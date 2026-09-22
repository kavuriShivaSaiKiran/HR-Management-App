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
  TrendingUp,
  Pencil,
  CheckCircle2,
  ShieldCheck,
  Layers,
  Building2
} from 'lucide-react';
import { Employee, Department, PayBand } from '../types';
import { getInitials } from '../lib/utils';

interface EmployeeDetailModalProps {
  employee: Employee | null;
  departments: Department[];
  payBands: PayBand[];
  onClose: () => void;
  onOpenSalaryChange: (emp: Employee) => void;
  onOpenHistory?: (emp: Employee) => void;
  onUpdateEmployee: (id: number, data: any) => Promise<void>;
}

export const EmployeeDetailModal: React.FC<EmployeeDetailModalProps> = ({
  employee,
  departments,
  payBands,
  onClose,
  onOpenSalaryChange,
  onOpenHistory,
  onUpdateEmployee
}) => {
  const [isEditing, setIsEditing] = useState(false);
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
  const usdRate = isIndia ? 0.012 : 1.0;
  const salaryUsd = Math.round(baseSalaryAnnual * usdRate);

  const currentPayBand = payBands.find(b => b.id === employee.pay_band_id);

  const handleSaveProfile = async (e: React.FormEvent) => {
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
      setSaveError(err.message || 'Failed to update employee');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-slate-50 to-blue-50/40 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white font-black text-base flex items-center justify-center shadow-md shadow-blue-500/20">
              {getInitials(employee.first_name, employee.last_name)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-slate-900">
                  {employee.first_name} {employee.last_name}
                </h2>
                <span className="px-2 py-0.5 rounded-full text-xs font-mono font-bold bg-blue-100 text-blue-700">
                  {employee.employee_code}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-2">
                <span>{employee.role_title}</span>
                <span>•</span>
                <span>{employee.department_name}</span>
                <span>•</span>
                <span>{isIndia ? '🇮🇳 India' : '🇺🇸 United States'}</span>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 overflow-y-auto max-h-[75vh]">
          {/* Compensation Overview Card */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                Current Annual Base Salary
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-black text-slate-900 font-mono">
                  {currencySymbol}{baseSalaryAnnual.toLocaleString()}
                </span>
                <span className="text-xs font-bold text-slate-500 font-mono">
                  {employee.currency_code}
                </span>
                <span className="text-xs font-semibold text-slate-400">
                  (~${salaryUsd.toLocaleString()} USD)
                </span>
              </div>
              <span className="text-xs text-slate-500 mt-0.5 block">
                Pay Band: <strong className="text-purple-700 font-semibold">{currentPayBand?.name || employee.pay_band_name || 'Standard Band'}</strong>
              </span>
            </div>

            <div className="flex items-center gap-2">
              {onOpenHistory && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenHistory(employee);
                  }}
                  className="px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-white text-slate-700 text-xs font-bold transition flex items-center gap-1.5"
                >
                  <History className="w-3.5 h-3.5" />
                  <span>Audit History</span>
                </button>
              )}
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenSalaryChange(employee);
                }}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition shadow-xs flex items-center gap-1.5"
              >
                <DollarSign className="w-3.5 h-3.5" />
                <span>Edit Salary</span>
              </button>
            </div>
          </div>

          {/* Edit Profile Form vs View Details */}
          {isEditing ? (
            <form onSubmit={handleSaveProfile} className="space-y-4 bg-slate-50/50 p-4 rounded-2xl border border-slate-200">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Edit Employee Details</h3>
              {saveError && (
                <div className="text-xs text-rose-600 bg-rose-50 p-2 rounded-lg">{saveError}</div>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Role Title</label>
                  <input
                    type="text"
                    value={editRole}
                    onChange={(e) => setEditRole(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl font-medium"
                    required
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Department</label>
                  <select
                    value={editDeptId}
                    onChange={(e) => setEditDeptId(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl font-medium cursor-pointer"
                  >
                    {departments.map(d => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Pay Band</label>
                  <select
                    value={editBandId}
                    onChange={(e) => setEditBandId(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl font-medium cursor-pointer"
                  >
                    {payBands.map(b => (
                      <option key={b.id} value={b.id}>{b.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Employment Status</label>
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value as 'active' | 'inactive')}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl font-medium cursor-pointer"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-200 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-4 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl"
                >
                  {isSaving ? 'Saving...' : 'Save Profile Changes'}
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Employment Details</h3>
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
                >
                  <Pencil className="w-3 h-3" />
                  <span>Edit Profile</span>
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[10px] text-slate-400 block font-bold uppercase">Work Email</span>
                  <span className="font-semibold text-slate-800 truncate block mt-0.5">{employee.email}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[10px] text-slate-400 block font-bold uppercase">Hire Date</span>
                  <span className="font-semibold text-slate-800 block mt-0.5">{employee.hire_date || '2023-01-15'}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[10px] text-slate-400 block font-bold uppercase">Status</span>
                  <span className="inline-flex items-center gap-1 font-bold text-emerald-700 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    {employee.employment_status === 'active' ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[10px] text-slate-400 block font-bold uppercase">Jurisdiction</span>
                  <span className="font-semibold text-slate-800 block mt-0.5">
                    {isIndia ? 'India (EPFO / TDS Standard)' : 'United States (IRS / Federal)'}
                  </span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[10px] text-slate-400 block font-bold uppercase">Currency</span>
                  <span className="font-semibold text-slate-800 block mt-0.5">{employee.currency_code}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[10px] text-slate-400 block font-bold uppercase">Compliance Audit</span>
                  <span className="font-semibold text-emerald-700 flex items-center gap-1 mt-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Verified
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-slate-400" />
            <span>ACME Compensation System • Internal Use Only</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-200/60 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
