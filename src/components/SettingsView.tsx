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
  Info,
  Layers,
  Scale
} from 'lucide-react';
import { apiFetch } from '../lib/api';

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
      const res = await apiFetch('/api/seed', { method: 'POST' });
      if (!res.ok) throw new Error('Failed to seed');
      setReseedSuccessMsg('10,000 employee profiles generated (3,100 US / 6,900 India)!');
      if (onReseedComplete) onReseedComplete();
      setTimeout(() => setReseedSuccessMsg(null), 4000);
    } catch (err: any) {
      alert(err.message || 'Seeding failed');
    } finally {
      setLocalReseeding(false);
    }
  };

  // US Entity Compensation Governance
  const [usCompRules, setUsCompRules] = useState({
    meritPoolPct: 5.0,
    promotionCapPct: 18.0,
    compaTolerancePct: 15.0,
    cycleFrequency: 'Annual (Q4)',
    benchmarkSource: 'Radford / Mercer US Tech Benchmark'
  });

  // India Entity Compensation Governance
  const [inCompRules, setInCompRules] = useState({
    meritPoolPct: 10.5,
    promotionCapPct: 22.0,
    compaTolerancePct: 18.0,
    cycleFrequency: 'Annual (Q2)',
    benchmarkSource: 'Aon Hewitt India Tech Benchmark'
  });

  const handleSave = () => {
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  return (
    <div className="space-y-5 sm:space-y-6 pb-12">
      {/* Minimal Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white px-4 py-3 sm:px-5 sm:py-3.5 rounded-xl border border-slate-200/80 shadow-2xs">
        <div className="min-w-0">
          <h1 className="text-base sm:text-lg font-bold tracking-tight text-slate-900 truncate">
            Compensation Policies & Guardrails
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Multi-country merit budgets, band tolerances, and canonical FX conversion pegs
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
          {saveSuccess && (
            <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
              <Check className="w-3.5 h-3.5" /> Policies Saved
            </span>
          )}
          <button
            onClick={handleSave}
            className="px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition shadow-2xs min-h-[38px] sm:min-h-0 flex-1 sm:flex-initial active:scale-95"
          >
            Save Policies
          </button>
        </div>
      </div>

      {/* 2. Global Platform Preferences */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
        <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <Coins className="w-4 h-4 text-blue-600" />
          <span>Consolidated Reporting & Canonical FX Pegs</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 pt-1">
          {/* Base Currency */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex flex-col justify-between">
            <div>
              <label className="text-xs font-bold text-slate-800 block mb-1">
                Canonical Base Reporting Currency
              </label>
              <p className="text-[11px] text-slate-500 mb-3">
                All multi-entity compensation metrics, executive dashboards, and organization-wide aggregations convert to this currency.
              </p>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={() => setBaseCurrency('USD')}
                className={`px-3.5 py-2 rounded-lg text-xs font-bold transition min-h-[44px] ${
                  baseCurrency === 'USD'
                    ? 'bg-blue-600 text-white shadow-2xs'
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                USD ($) &mdash; US Dollar (Canonical)
              </button>
              <button
                type="button"
                onClick={() => setBaseCurrency('INR')}
                className={`px-3.5 py-2 rounded-lg text-xs font-bold transition min-h-[44px] ${
                  baseCurrency === 'INR'
                    ? 'bg-blue-600 text-white shadow-2xs'
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                INR (₹) &mdash; Indian Rupee
              </button>
            </div>
          </div>

          {/* Demo Dataset Controls */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-800">
                  Global Dataset Verification
                </label>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  SQLite In-Memory
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                Active dataset strictly seeded to <strong>31% US (3,100)</strong> and <strong>69% India (6,900)</strong> workforce distribution.
              </p>
            </div>

            <div className="pt-3 mt-3 border-t border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <span className="text-[11px] font-semibold text-slate-600">
                10,000 Auditable Records
              </span>
              <div className="flex items-center gap-2">
                {reseedSuccessMsg && (
                  <span className="text-[11px] font-bold text-emerald-600 truncate max-w-[180px]">
                    {reseedSuccessMsg}
                  </span>
                )}
                <button
                  onClick={handlePerformReseed}
                  disabled={isReseeding}
                  className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 transition disabled:opacity-50 cursor-pointer min-h-[44px] w-full sm:w-auto active:scale-95"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isReseeding ? 'animate-spin text-blue-600' : ''}`} />
                  <span>{isReseeding ? 'Generating 10k...' : 'Reseed 10k Dataset'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Country-Specific Compensation Governance Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6">
        {/* Country 1: United States Entity */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 sm:p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <span className="text-3xl">🇺🇸</span>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">United States Entity</h3>
                  <span className="text-xs text-slate-400 font-mono">USD ($) &bull; ~31% Workforce</span>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                Active Entity
              </span>
            </div>

            <div className="mt-5 space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-600 font-medium block mb-1">
                    Annual Merit Pool (%)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={usCompRules.meritPoolPct}
                      onChange={(e) => setUsCompRules({ ...usCompRules, meritPoolPct: Number(e.target.value) })}
                      className="w-full px-3 py-2 font-bold font-mono bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 min-h-[44px]"
                    />
                    <Percent className="w-3.5 h-3.5 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  </div>
                </div>

                <div>
                  <label className="text-slate-600 font-medium block mb-1">
                    Max Promotion Cap (%)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={usCompRules.promotionCapPct}
                      onChange={(e) => setUsCompRules({ ...usCompRules, promotionCapPct: Number(e.target.value) })}
                      className="w-full px-3 py-2 font-bold font-mono bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 min-h-[44px]"
                    />
                    <Percent className="w-3.5 h-3.5 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-600 font-medium block mb-1">
                    Compa-Ratio Band Tolerance (+/- %)
                  </label>
                  <input
                    type="number"
                    value={usCompRules.compaTolerancePct}
                    onChange={(e) => setUsCompRules({ ...usCompRules, compaTolerancePct: Number(e.target.value) })}
                    className="w-full px-3 py-2 font-bold font-mono bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 min-h-[44px]"
                  />
                </div>

                <div>
                  <label className="text-slate-600 font-medium block mb-1">
                    Review Cycle Timing
                  </label>
                  <select
                    value={usCompRules.cycleFrequency}
                    onChange={(e) => setUsCompRules({ ...usCompRules, cycleFrequency: e.target.value })}
                    className="w-full px-3 py-2 font-semibold bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 min-h-[44px] cursor-pointer"
                  >
                    <option value="Annual (Q4)">Annual Review (Q4 Calendar)</option>
                    <option value="Bi-Annual (Q2 & Q4)">Bi-Annual Reviews</option>
                    <option value="Continuous">Continuous Merit Progression</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-slate-600 font-medium block mb-1">
                  Salary Benchmark Source
                </label>
                <div className="px-3 py-2.5 rounded-lg bg-slate-50 border border-slate-200 font-mono text-xs text-slate-700 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
                  <span className="truncate">{usCompRules.benchmarkSource}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>Audit Standard: ISO-27001 / SOX Comp Compliance</span>
            <span className="font-semibold text-blue-600">Active Band Parity</span>
          </div>
        </div>

        {/* Country 2: India Entity */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 sm:p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <span className="text-3xl">🇮🇳</span>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">India Entity</h3>
                  <span className="text-xs text-slate-400 font-mono">INR (₹) &bull; ~69% Workforce</span>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                Active Entity
              </span>
            </div>

            <div className="mt-5 space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-600 font-medium block mb-1">
                    Annual Merit Pool (%)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={inCompRules.meritPoolPct}
                      onChange={(e) => setInCompRules({ ...inCompRules, meritPoolPct: Number(e.target.value) })}
                      className="w-full px-3 py-2 font-bold font-mono bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 min-h-[44px]"
                    />
                    <Percent className="w-3.5 h-3.5 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  </div>
                </div>

                <div>
                  <label className="text-slate-600 font-medium block mb-1">
                    Max Promotion Cap (%)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={inCompRules.promotionCapPct}
                      onChange={(e) => setInCompRules({ ...inCompRules, promotionCapPct: Number(e.target.value) })}
                      className="w-full px-3 py-2 font-bold font-mono bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 min-h-[44px]"
                    />
                    <Percent className="w-3.5 h-3.5 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-600 font-medium block mb-1">
                    Compa-Ratio Band Tolerance (+/- %)
                  </label>
                  <input
                    type="number"
                    value={inCompRules.compaTolerancePct}
                    onChange={(e) => setInCompRules({ ...inCompRules, compaTolerancePct: Number(e.target.value) })}
                    className="w-full px-3 py-2 font-bold font-mono bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 min-h-[44px]"
                  />
                </div>

                <div>
                  <label className="text-slate-600 font-medium block mb-1">
                    Review Cycle Timing
                  </label>
                  <select
                    value={inCompRules.cycleFrequency}
                    onChange={(e) => setInCompRules({ ...inCompRules, cycleFrequency: e.target.value })}
                    className="w-full px-3 py-2 font-semibold bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 min-h-[44px] cursor-pointer"
                  >
                    <option value="Annual (Q2)">Annual Review (Q2 Fiscal)</option>
                    <option value="Bi-Annual">Bi-Annual Reviews</option>
                    <option value="Continuous">Continuous Progression</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-slate-600 font-medium block mb-1">
                  Salary Benchmark Source
                </label>
                <div className="px-3 py-2.5 rounded-lg bg-slate-50 border border-slate-200 font-mono text-xs text-slate-700 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="truncate">{inCompRules.benchmarkSource}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>Audit Standard: Pan-India Tech Parity Index</span>
            <span className="font-semibold text-blue-600">Active Band Parity</span>
          </div>
        </div>
      </div>
    </div>
  );
};
