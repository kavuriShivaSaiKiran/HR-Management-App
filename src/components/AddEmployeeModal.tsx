import React, { useState, useEffect } from 'react';
import { X, UserPlus, AlertCircle, Sparkles, DollarSign, Globe, Briefcase, TrendingUp } from 'lucide-react';
import { Department, PayBand } from '../types';
import { formatCurrency } from '../lib/utils';

interface AddEmployeeModalProps {
  departments: Department[];
  payBands: PayBand[];
  onClose: () => void;
  onAddEmployee: (data: any) => Promise<void>;
}

// Role compensation benchmarks normalized per country
interface RoleBenchmark {
  role: string;
  departmentId: number;
  salaryByCountry: {
    [countryCode: string]: {
      currency: string;
      min: number;
      max: number;
      recommended: number;
      payBandId: number;
    };
  };
}

const ROLE_BENCHMARKS: RoleBenchmark[] = [
  {
    role: 'Senior Software Engineer',
    departmentId: 1, // Engineering
    salaryByCountry: {
      US: { currency: 'USD', min: 125000, max: 175000, recommended: 145000, payBandId: 3 },
      GB: { currency: 'GBP', min: 65000, max: 95000, recommended: 78000, payBandId: 3 },
      DE: { currency: 'EUR', min: 70000, max: 100000, recommended: 85000, payBandId: 3 },
      IN: { currency: 'INR', min: 1800000, max: 3200000, recommended: 2400000, payBandId: 3 },
      SG: { currency: 'SGD', min: 105000, max: 155000, recommended: 128000, payBandId: 3 },
    }
  },
  {
    role: 'Product Manager',
    departmentId: 2, // Product
    salaryByCountry: {
      US: { currency: 'USD', min: 115000, max: 165000, recommended: 135000, payBandId: 3 },
      GB: { currency: 'GBP', min: 60000, max: 90000, recommended: 72000, payBandId: 3 },
      DE: { currency: 'EUR', min: 65000, max: 95000, recommended: 78000, payBandId: 3 },
      IN: { currency: 'INR', min: 1600000, max: 2800000, recommended: 2100000, payBandId: 3 },
      SG: { currency: 'SGD', min: 95000, max: 145000, recommended: 118000, payBandId: 3 },
    }
  },
  {
    role: 'Data Scientist',
    departmentId: 1, // Engineering / Analytics
    salaryByCountry: {
      US: { currency: 'USD', min: 120000, max: 170000, recommended: 140000, payBandId: 3 },
      GB: { currency: 'GBP', min: 62000, max: 92000, recommended: 75000, payBandId: 3 },
      DE: { currency: 'EUR', min: 68000, max: 98000, recommended: 82000, payBandId: 3 },
      IN: { currency: 'INR', min: 1500000, max: 3000000, recommended: 2200000, payBandId: 3 },
      SG: { currency: 'SGD', min: 100000, max: 150000, recommended: 122000, payBandId: 3 },
    }
  },
  {
    role: 'HR Specialist',
    departmentId: 4, // HR
    salaryByCountry: {
      US: { currency: 'USD', min: 65000, max: 95000, recommended: 78000, payBandId: 2 },
      GB: { currency: 'GBP', min: 38000, max: 55000, recommended: 45000, payBandId: 2 },
      DE: { currency: 'EUR', min: 45000, max: 68000, recommended: 54000, payBandId: 2 },
      IN: { currency: 'INR', min: 750000, max: 1500000, recommended: 1100000, payBandId: 2 },
      SG: { currency: 'SGD', min: 60000, max: 88000, recommended: 72000, payBandId: 2 },
    }
  },
  {
    role: 'Financial Analyst',
    departmentId: 5, // Finance
    salaryByCountry: {
      US: { currency: 'USD', min: 80000, max: 120000, recommended: 95000, payBandId: 2 },
      GB: { currency: 'GBP', min: 45000, max: 70000, recommended: 56000, payBandId: 2 },
      DE: { currency: 'EUR', min: 52000, max: 78000, recommended: 64000, payBandId: 2 },
      IN: { currency: 'INR', min: 900000, max: 1800000, recommended: 1300000, payBandId: 2 },
      SG: { currency: 'SGD', min: 72000, max: 108000, recommended: 88000, payBandId: 2 },
    }
  }
];

const COUNTRY_NAMES: Record<string, string> = {
  US: 'United States',
  GB: 'United Kingdom',
  DE: 'Germany',
  IN: 'India',
  SG: 'Singapore'
};

export const AddEmployeeModal: React.FC<AddEmployeeModalProps> = ({
  departments,
  payBands,
  onClose,
  onAddEmployee
}) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [departmentId, setDepartmentId] = useState<number>(departments[0]?.id || 1);
  const [roleTitle, setRoleTitle] = useState('Senior Software Engineer');
  const [countryCode, setCountryCode] = useState('US');
  const [currencyCode, setCurrencyCode] = useState('USD');
  const [payBandId, setPayBandId] = useState<number>(payBands[1]?.id || 2);
  const [baseSalary, setBaseSalary] = useState<number>(145000);
  const [hireDate, setHireDate] = useState(new Date().toISOString().split('T')[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Find current benchmark for active role and country
  const currentBenchmark = ROLE_BENCHMARKS.find(
    (b) => b.role.toLowerCase() === roleTitle.toLowerCase()
  )?.salaryByCountry[countryCode];

  // When country changes: shift currency AND recalculate role payment as per country
  const handleCountryChange = (c: string) => {
    setCountryCode(c);
    let newCurrency = 'USD';
    if (c === 'US') newCurrency = 'USD';
    else if (c === 'GB') newCurrency = 'GBP';
    else if (c === 'DE') newCurrency = 'EUR';
    else if (c === 'IN') newCurrency = 'INR';
    else if (c === 'SG') newCurrency = 'SGD';
    
    setCurrencyCode(newCurrency);

    // Recalculate role payment based on selected country
    const matchedBenchmark = ROLE_BENCHMARKS.find(
      (b) => b.role.toLowerCase() === roleTitle.toLowerCase()
    )?.salaryByCountry[c];

    if (matchedBenchmark) {
      setBaseSalary(matchedBenchmark.recommended);
      if (matchedBenchmark.payBandId) {
        setPayBandId(matchedBenchmark.payBandId);
      }
    } else {
      // Default localized base salary if custom role
      if (c === 'US') setBaseSalary(95000);
      else if (c === 'GB') setBaseSalary(58000);
      else if (c === 'DE') setBaseSalary(65000);
      else if (c === 'IN') setBaseSalary(1400000);
      else if (c === 'SG') setBaseSalary(88000);
    }
  };

  // When role changes: adjust payment recommendation according to current country
  const handleRoleSelect = (roleName: string) => {
    setRoleTitle(roleName);
    const benchmark = ROLE_BENCHMARKS.find(
      (b) => b.role.toLowerCase() === roleName.toLowerCase()
    );
    if (benchmark) {
      if (benchmark.departmentId) setDepartmentId(benchmark.departmentId);
      const countryData = benchmark.salaryByCountry[countryCode];
      if (countryData) {
        setBaseSalary(countryData.recommended);
        if (countryData.payBandId) setPayBandId(countryData.payBandId);
      }
    }
  };

  const selectedBand = payBands.find(b => b.id === Number(payBandId));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsSubmitting(true);

    try {
      await onAddEmployee({
        first_name: firstName,
        last_name: lastName,
        email: email,
        department_id: Number(departmentId),
        role_title: roleTitle,
        country_code: countryCode,
        currency_code: currencyCode,
        pay_band_id: Number(payBandId),
        base_salary: Number(baseSalary),
        hire_date: hireDate,
        effective_date: hireDate
      });
      onClose();
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to create employee');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-xl rounded-2xl sm:rounded-3xl border border-slate-200 shadow-2xl overflow-hidden my-auto max-h-[94vh] flex flex-col animate-in fade-in zoom-in-95 duration-200">
        <div className="p-4 sm:p-5 bg-slate-50 border-b border-slate-100 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs shrink-0">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-base">Add New Employee</h3>
              <p className="text-xs text-slate-500">Auto-calibrated compensation by country & role</p>
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

          {/* Name Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">First Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Liam"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Last Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Smith"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Work Email Address *</label>
            <input
              type="email"
              required
              placeholder="liam.smith@acme.org"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none"
            />
          </div>

          {/* Country and Currency selector */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 p-3.5 bg-blue-50/50 rounded-2xl border border-blue-100">
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1 flex items-center gap-1">
                <Globe className="w-3.5 h-3.5 text-blue-600" />
                <span>Country *</span>
              </label>
              <select
                value={countryCode}
                onChange={(e) => handleCountryChange(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none bg-white"
              >
                <option value="US">🇺🇸 United States (US)</option>
                <option value="GB">🇬🇧 United Kingdom (GB)</option>
                <option value="DE">🇩🇪 Germany (DE)</option>
                <option value="IN">🇮🇳 India (IN)</option>
                <option value="SG">🇸🇬 Singapore (SG)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1 flex items-center gap-1">
                <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
                <span>Shifted Currency *</span>
              </label>
              <select
                value={currencyCode}
                onChange={(e) => setCurrencyCode(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-bold focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none bg-white text-blue-700"
              >
                <option value="USD">USD ($ - US Dollar)</option>
                <option value="GBP">GBP (£ - British Pound)</option>
                <option value="EUR">EUR (€ - Euro)</option>
                <option value="INR">INR (₹ - Indian Rupee)</option>
                <option value="SGD">SGD (S$ - Singapore Dollar)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Hire Date</label>
              <input
                type="date"
                value={hireDate}
                onChange={(e) => setHireDate(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none bg-white"
              />
            </div>
          </div>

          {/* Department and Role */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Department *</label>
              <select
                value={departmentId}
                onChange={(e) => setDepartmentId(Number(e.target.value))}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none bg-white"
              >
                {departments.map((d) => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Role Title *</label>
              <input
                type="text"
                required
                placeholder="e.g. Senior Software Engineer"
                value={roleTitle}
                onChange={(e) => setRoleTitle(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Quick Role Presets to demonstrate country payment shifts */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
                <Briefcase className="w-3 h-3 text-slate-400" />
                Role Market Standards:
              </span>
              <span className="text-[10px] text-blue-600 font-bold">
                Auto-scales pay for {COUNTRY_NAMES[countryCode]}
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {ROLE_BENCHMARKS.map((rb) => {
                const isSelected = rb.role.toLowerCase() === roleTitle.toLowerCase();
                const payInfo = rb.salaryByCountry[countryCode];
                return (
                  <button
                    key={rb.role}
                    type="button"
                    onClick={() => handleRoleSelect(rb.role)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium transition text-left ${
                      isSelected
                        ? 'bg-blue-600 text-white shadow-xs font-bold'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    }`}
                  >
                    <span>{rb.role}</span>
                    {payInfo && (
                      <span className={`ml-1 text-[10px] ${isSelected ? 'text-blue-100' : 'text-slate-500'}`}>
                        ({formatCurrency(payInfo.recommended, payInfo.currency)})
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Country-Specific Role Payment Callout */}
          {currentBenchmark ? (
            <div className="p-3 bg-emerald-50/70 rounded-xl border border-emerald-200 text-xs text-emerald-900 space-y-1">
              <div className="flex items-center justify-between font-bold">
                <span className="flex items-center gap-1 text-emerald-800">
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                  {COUNTRY_NAMES[countryCode]} Market Band for {roleTitle}:
                </span>
                <span className="text-emerald-800 font-extrabold">
                  {formatCurrency(currentBenchmark.min, currentBenchmark.currency)} – {formatCurrency(currentBenchmark.max, currentBenchmark.currency)}
                </span>
              </div>
              <p className="text-[11px] text-emerald-700">
                Payment is calibrated for {COUNTRY_NAMES[countryCode]} ({currencyCode}) based on local labor market benchmarks and purchasing power parity.
              </p>
            </div>
          ) : (
            <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-600">
              Custom role payment set for <b>{COUNTRY_NAMES[countryCode]}</b> in <b>{currencyCode}</b>.
            </div>
          )}

          {/* Pay Band & Base Salary */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Pay Band Grade *</label>
              <select
                value={payBandId}
                onChange={(e) => setPayBandId(Number(e.target.value))}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none bg-white"
              >
                {payBands.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name} (${(b.min_salary / 1000)}k - ${(b.max_salary / 1000)}k USD)
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Base Salary in {currencyCode} *
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="1000"
                  step="500"
                  required
                  value={baseSalary}
                  onChange={(e) => setBaseSalary(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-extrabold text-blue-600">
                  {currencyCode}
                </span>
              </div>
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
              className="w-full sm:w-auto px-5 py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs transition disabled:opacity-50 min-h-[42px]"
            >
              {isSubmitting ? 'Creating...' : `Create Employee (${currencyCode})`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
