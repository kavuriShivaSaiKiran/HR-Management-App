import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Globe2,
  Sliders,
  ShieldCheck,
  Percent,
  Coins,
  Check,
  AlertCircle,
  Sparkles,
  RefreshCw,
  Building,
  Info
} from 'lucide-react';

interface SettingsViewProps {
  onTriggerReseed?: () => void;
  onReseedComplete?: () => void;
  isReseeding?: boolean;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  onTriggerReseed,
  onReseedComplete,
  isReseeding: externalIsReseeding
}) => {
  const [baseCurrency, setBaseCurrency] = useState<'USD' | 'INR'>('USD');
  const [showDemoData, setShowDemoData] = useState<boolean>(true);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
  const [localReseeding, setLocalReseeding] = useState<boolean>(false);
  const [reseedSuccessMsg, setReseedSuccessMsg] = useState<string | null>(null);

  const isReseeding = externalIsReseeding || localReseeding;

  const handlePerformReseed = async () => {
    if (onTriggerReseed) {
      onTriggerReseed();
      return;
    }
    setLocalReseeding(true);
    setReseedSuccessMsg(null);
    try {
      const res = await fetch('/api/seed', { method: 'POST' });
      if (!res.ok) throw new Error('Failed to seed');
      setReseedSuccessMsg('10,000 employees generated (3,100 US / 6,900 India)!');
      if (onReseedComplete) onReseedComplete();
      setTimeout(() => setReseedSuccessMsg(null), 4000);
    } catch (err: any) {
      alert(err.message || 'Seeding failed');
    } finally {
      setLocalReseeding(false);
    }
  };

  // Country tax & statutory rules
  const [usRules, setUsRules] = useState({
    taxRate: 18,
    socialSecurityRate: 6.2,
    medicareRate: 1.45,
    employer401kMatch: 4.0,
    payFrequency: 'Semi-Monthly',
    bankingGateway: 'Federal ACH Direct Deposit'
  });

  const [inRules, setInRules] = useState({
    tdsRate: 15,
    epfRate: 12.0,
    hraAllowanceRate: 40.0,
    professionalTaxMonthly: 200,
    payFrequency: 'Monthly',
    bankingGateway: 'RBI NEFT / RTGS'
  });

  const handleSave = () => {
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* 1. Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Globe2 className="w-4 h-4 text-blue-600" />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Multi-Country Configuration
              </span>
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Countries & Statutory Rules
            </h1>
            <p className="text-xs text-slate-500 mt-1 max-w-xl">
              Manage localized payroll formulas, statutory tax withholdings, social security / PF contributions, and organizational reporting currency.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {saveSuccess && (
              <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                <Check className="w-4 h-4" /> Saved Successfully
              </span>
            )}
            <button
              onClick={handleSave}
              className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition shadow-xs"
            >
              Save Configuration
            </button>
          </div>
        </div>
      </div>

      {/* 2. Global Platform Preferences */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
        <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <Coins className="w-4 h-4 text-blue-600" />
          <span>Global Reporting & Presentation</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
          {/* Base Currency */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Consolidated Reporting Base Currency
            </label>
            <p className="text-[11px] text-slate-400 mb-3">
              All multi-country payroll costs, executive dashboards, and company-wide budgets are aggregated into this currency.
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setBaseCurrency('USD')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                  baseCurrency === 'USD'
                    ? 'bg-blue-600 text-white shadow-2xs'
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                USD ($) — United States Dollar
              </button>
              <button
                type="button"
                onClick={() => setBaseCurrency('INR')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                  baseCurrency === 'INR'
                    ? 'bg-blue-600 text-white shadow-2xs'
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                INR (₹) — Indian Rupee
              </button>
            </div>
          </div>

          {/* Demo Data Toggle & Fast Reseed */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700">
                  Demo Simulation Environment
                </label>
                <input
                  type="checkbox"
                  checked={showDemoData}
                  onChange={(e) => setShowDemoData(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded cursor-pointer"
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Active dataset strictly partitioned to <strong>31% US</strong> and <strong>69% India</strong> employees.
              </p>
            </div>

            <div className="pt-3 mt-3 border-t border-slate-200 flex items-center justify-between">
              <span className="text-[11px] font-semibold text-slate-500">
                10,000 Verified Records
              </span>
              <div className="flex items-center gap-2">
                {reseedSuccessMsg && (
                  <span className="text-[11px] font-bold text-emerald-600">
                    {reseedSuccessMsg}
                  </span>
                )}
                <button
                  onClick={handlePerformReseed}
                  disabled={isReseeding}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 transition disabled:opacity-50 cursor-pointer"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isReseeding ? 'animate-spin text-blue-600' : ''}`} />
                  <span>{isReseeding ? 'Generating 10k...' : 'Reseed Demo Data'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Country-Specific Rule Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Country 1: United States */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <span className="text-3xl">🇺🇸</span>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">United States Hub</h3>
                  <span className="text-xs text-slate-400 font-mono">USD ($) &bull; ~31% Headcount</span>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                Active Entity
              </span>
            </div>

            <div className="mt-5 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-500 font-medium block mb-1">
                    Federal/State Tax Rate (%)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={usRules.taxRate}
                      onChange={(e) => setUsRules({ ...usRules, taxRate: Number(e.target.value) })}
                      className="w-full px-3 py-1.5 font-bold font-mono bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                    <Percent className="w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  </div>
                </div>

                <div>
                  <label className="text-slate-500 font-medium block mb-1">
                    FICA Social Security (%)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={usRules.socialSecurityRate}
                      onChange={(e) => setUsRules({ ...usRules, socialSecurityRate: Number(e.target.value) })}
                      className="w-full px-3 py-1.5 font-bold font-mono bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                    <Percent className="w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-500 font-medium block mb-1">
                    Employer 401(k) Match (%)
                  </label>
                  <input
                    type="number"
                    value={usRules.employer401kMatch}
                    onChange={(e) => setUsRules({ ...usRules, employer401kMatch: Number(e.target.value) })}
                    className="w-full px-3 py-1.5 font-bold font-mono bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="text-slate-500 font-medium block mb-1">
                    Pay Frequency
                  </label>
                  <select
                    value={usRules.payFrequency}
                    onChange={(e) => setUsRules({ ...usRules, payFrequency: e.target.value })}
                    className="w-full px-3 py-1.5 font-semibold bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="Semi-Monthly">Semi-Monthly (15th & 30th)</option>
                    <option value="Monthly">Monthly</option>
                    <option value="Bi-Weekly">Bi-Weekly (Every 2 weeks)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-slate-500 font-medium block mb-1">
                  Payment Clearing Protocol
                </label>
                <div className="px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 font-mono text-xs text-slate-700 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-blue-600" />
                  <span>{usRules.bankingGateway}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
            <span>Statutory Code: IRS-W2 / 941</span>
            <span className="font-semibold text-blue-600">Auto-calculated in Payroll Run</span>
          </div>
        </div>

        {/* Country 2: India */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <span className="text-3xl">🇮🇳</span>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">India Hub</h3>
                  <span className="text-xs text-slate-400 font-mono">INR (₹) &bull; ~69% Headcount</span>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                Active Entity
              </span>
            </div>

            <div className="mt-5 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-500 font-medium block mb-1">
                    TDS Income Tax Rate (%)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={inRules.tdsRate}
                      onChange={(e) => setInRules({ ...inRules, tdsRate: Number(e.target.value) })}
                      className="w-full px-3 py-1.5 font-bold font-mono bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                    <Percent className="w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  </div>
                </div>

                <div>
                  <label className="text-slate-500 font-medium block mb-1">
                    Employee Provident Fund (EPF %)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={inRules.epfRate}
                      onChange={(e) => setInRules({ ...inRules, epfRate: Number(e.target.value) })}
                      className="w-full px-3 py-1.5 font-bold font-mono bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                    <Percent className="w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-500 font-medium block mb-1">
                    House Rent Allowance (HRA %)
                  </label>
                  <input
                    type="number"
                    value={inRules.hraAllowanceRate}
                    onChange={(e) => setInRules({ ...inRules, hraAllowanceRate: Number(e.target.value) })}
                    className="w-full px-3 py-1.5 font-bold font-mono bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="text-slate-500 font-medium block mb-1">
                    Professional Tax (₹/mo)
                  </label>
                  <input
                    type="number"
                    value={inRules.professionalTaxMonthly}
                    onChange={(e) => setInRules({ ...inRules, professionalTaxMonthly: Number(e.target.value) })}
                    className="w-full px-3 py-1.5 font-bold font-mono bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-500 font-medium block mb-1">
                  Payment Clearing Protocol
                </label>
                <div className="px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 font-mono text-xs text-slate-700 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>{inRules.bankingGateway}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
            <span>Statutory Code: EPFO / Form 16</span>
            <span className="font-semibold text-blue-600">Auto-calculated in Payroll Run</span>
          </div>
        </div>
      </div>
    </div>
  );
};
