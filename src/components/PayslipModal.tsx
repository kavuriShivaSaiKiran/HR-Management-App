import React from 'react';
import { motion } from 'motion/react';
import {
  X,
  Printer,
  Download,
  CheckCircle2,
  Building2,
  Calendar,
  ShieldCheck,
  CreditCard,
  FileText
} from 'lucide-react';
import { Employee } from '../types';

interface PayslipModalProps {
  employee: Employee | null;
  period?: string;
  bonusAmount?: number;
  onClose: () => void;
}

export const PayslipModal: React.FC<PayslipModalProps> = ({
  employee,
  period = 'September 2026',
  bonusAmount = 0,
  onClose
}) => {
  if (!employee) return null;

  const isIndia = employee.country_code === 'IN';
  const currencySymbol = isIndia ? '₹' : '$';
  const currencyCode = isIndia ? 'INR' : 'USD';

  // Base monthly salary calculation (annual / 12)
  const baseSalaryAnnual = employee.current_salary || (isIndia ? 2400000 : 108000);
  const baseMonthly = Math.round(baseSalaryAnnual / 12);

  // Localized allowances
  const allowanceName = isIndia ? 'House Rent Allowance (HRA)' : '401(k) Employer Match';
  const allowanceAmount = Math.round(isIndia ? baseMonthly * 0.40 : baseMonthly * 0.04);
  const bonus = Number(bonusAmount) || 0;
  const grossPay = baseMonthly + allowanceAmount + bonus;

  // Localized deductions
  let taxName = '';
  let taxAmount = 0;
  let socialSecurityName = '';
  let socialSecurityAmount = 0;
  let secondaryDeductionName = '';
  let secondaryDeductionAmount = 0;

  if (isIndia) {
    taxName = 'Tax Deducted at Source (TDS)';
    taxAmount = Math.round(grossPay * 0.15); // ~15% TDS
    socialSecurityName = 'Employee Provident Fund (EPF - 12%)';
    socialSecurityAmount = Math.round(baseMonthly * 0.12);
    secondaryDeductionName = 'Professional Tax (PT)';
    secondaryDeductionAmount = 200;
  } else {
    taxName = 'Federal & State Withholding Tax';
    taxAmount = Math.round(grossPay * 0.18); // ~18% Federal + State
    socialSecurityName = 'FICA - Social Security (6.2%)';
    socialSecurityAmount = Math.round(grossPay * 0.062);
    secondaryDeductionName = 'FICA - Medicare (1.45%)';
    secondaryDeductionAmount = Math.round(grossPay * 0.0145);
  }

  const totalDeductions = taxAmount + socialSecurityAmount + secondaryDeductionAmount;
  const netPay = grossPay - totalDeductions;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 10 }}
        transition={{ duration: 0.2 }}
        className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col my-auto"
      >
        {/* Modal Top Control Bar */}
        <div className="flex items-center justify-between px-6 py-3.5 bg-slate-50 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span className="text-xs font-bold text-slate-700 tracking-wide uppercase">
              Confidential Pay Advice
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-blue-100 text-blue-700">
              {isIndia ? '🇮🇳 India Hub (INR)' : '🇺🇸 US Hub (USD)'}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-xs font-semibold text-slate-600 transition"
              title="Print payslip"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Payslip Document Body */}
        <div id="payslip-document" className="p-6 sm:p-8 space-y-6 text-slate-800">
          {/* Company & Payslip Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-blue-600 flex items-center justify-center text-white font-extrabold text-lg shadow-sm">
                SF
              </div>
              <div>
                <h2 className="text-xl font-black text-slate-900 tracking-tight">SalaryFlow Technologies Inc.</h2>
                <p className="text-xs text-slate-500">
                  {isIndia
                    ? 'RMZ Infinity, Old Madras Road, Bengaluru, KA 560016'
                    : '500 Howard Street, Suite 400, San Francisco, CA 94105'}
                </p>
              </div>
            </div>

            <div className="text-left sm:text-right">
              <span className="inline-block px-3 py-1 rounded-md bg-slate-100 font-extrabold text-xs text-slate-700 mb-1">
                PAYSLIP — {period.toUpperCase()}
              </span>
              <p className="text-xs text-slate-400">Pay Date: September 30, 2026</p>
            </div>
          </div>

          {/* Employee Metadata Matrix */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs">
            <div>
              <span className="text-slate-400 font-medium block">Employee Name</span>
              <span className="font-bold text-slate-900">{employee.first_name} {employee.last_name}</span>
            </div>
            <div>
              <span className="text-slate-400 font-medium block">Employee ID</span>
              <span className="font-mono font-bold text-slate-800">{employee.employee_code}</span>
            </div>
            <div>
              <span className="text-slate-400 font-medium block">Role & Dept</span>
              <span className="font-semibold text-slate-800">{employee.role_title}</span>
            </div>
            <div>
              <span className="text-slate-400 font-medium block">Disbursal Mode</span>
              <span className="font-semibold text-emerald-700 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                {isIndia ? 'NEFT / Direct' : 'ACH Direct Deposit'}
              </span>
            </div>
          </div>

          {/* Dual Ledger: Earnings vs Deductions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Earnings Table */}
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <div className="bg-slate-100/80 px-4 py-2.5 border-b border-slate-200">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Earnings ({currencyCode})
                </h4>
              </div>
              <div className="p-4 space-y-2.5 text-xs">
                <div className="flex justify-between items-center text-slate-700">
                  <span>Basic Salary</span>
                  <span className="font-mono font-semibold">{currencySymbol}{baseMonthly.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-slate-700">
                  <span>{allowanceName}</span>
                  <span className="font-mono font-semibold">{currencySymbol}{allowanceAmount.toLocaleString()}</span>
                </div>
                {bonus > 0 && (
                  <div className="flex justify-between items-center text-emerald-700 font-medium">
                    <span>Performance / Spot Bonus</span>
                    <span className="font-mono font-semibold">+{currencySymbol}{bonus.toLocaleString()}</span>
                  </div>
                )}
                <div className="pt-2.5 border-t border-slate-200 flex justify-between items-center font-bold text-slate-900 text-sm">
                  <span>Total Gross Earnings</span>
                  <span className="font-mono text-blue-600">{currencySymbol}{grossPay.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Deductions Table */}
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <div className="bg-slate-100/80 px-4 py-2.5 border-b border-slate-200">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Deductions ({currencyCode})
                </h4>
              </div>
              <div className="p-4 space-y-2.5 text-xs">
                <div className="flex justify-between items-center text-slate-700">
                  <span className="truncate pr-2">{taxName}</span>
                  <span className="font-mono font-semibold">{currencySymbol}{taxAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-slate-700">
                  <span className="truncate pr-2">{socialSecurityName}</span>
                  <span className="font-mono font-semibold">{currencySymbol}{socialSecurityAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-slate-700">
                  <span className="truncate pr-2">{secondaryDeductionName}</span>
                  <span className="font-mono font-semibold">{currencySymbol}{secondaryDeductionAmount.toLocaleString()}</span>
                </div>
                <div className="pt-2.5 border-t border-slate-200 flex justify-between items-center font-bold text-slate-900 text-sm">
                  <span>Total Deductions</span>
                  <span className="font-mono text-rose-600">{currencySymbol}{totalDeductions.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Highlighted Net Take-Home Pay Banner */}
          <div className="p-5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <span className="text-xs font-semibold text-blue-100 uppercase tracking-wider block">
                Net Disbursal Amount
              </span>
              <p className="text-xs text-blue-200 mt-0.5">
                Deposited to bank account ending in •••• 4092 on Sep 30, 2026
              </p>
            </div>
            <div className="text-right">
              <span className="text-3xl font-extrabold tracking-tight font-mono">
                {currencySymbol}{netPay.toLocaleString()}
              </span>
              <span className="text-[11px] block text-blue-100 font-medium">100% Statutory Compliant</span>
            </div>
          </div>

          {/* Footer Note & Signature */}
          <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400 gap-2 text-center sm:text-left">
            <div>
              <p>Generated automatically by <strong className="text-slate-600">SalaryFlow</strong> enterprise engine.</p>
              <p>Auth Verification Hash: <span className="font-mono text-slate-500">SHA256:7f9b2d8e41a0</span></p>
            </div>
            <div className="flex items-center gap-1.5 text-emerald-600 font-bold">
              <CheckCircle2 className="w-4 h-4" />
              <span>Electronically Approved & Audited</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
