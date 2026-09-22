import React, { useState } from 'react';
import { Calendar, ChevronDown, Check, Clock, Filter, ArrowRight } from 'lucide-react';
import { AnalysisPeriodState, AnalysisPeriodType } from '../types';
import {
  PERIOD_OPTIONS,
  calculatePeriodDates,
  formatAsOfDate,
  formatPeriodRange,
  DEFAULT_AS_OF_DATE
} from '../lib/periodUtils';
import { cn } from '../lib/utils';

interface AnalysisPeriodFilterProps {
  value: AnalysisPeriodState;
  onChange: (nextState: AnalysisPeriodState) => void;
  className?: string;
  showSubtitle?: boolean;
}

export const AnalysisPeriodFilter: React.FC<AnalysisPeriodFilterProps> = ({
  value,
  onChange,
  className,
  showSubtitle = true
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [customStart, setCustomStart] = useState<string>(value.startDate || '2026-06-01');
  const [customEnd, setCustomEnd] = useState<string>(value.endDate || value.asOfDate || DEFAULT_AS_OF_DATE);

  const handleSelectPeriod = (type: AnalysisPeriodType) => {
    if (type === 'custom') {
      setShowCustomModal(true);
      setIsOpen(false);
      return;
    }
    const nextState = calculatePeriodDates(type, undefined, undefined, value.asOfDate || DEFAULT_AS_OF_DATE);
    onChange(nextState);
    setIsOpen(false);
  };

  const handleApplyCustom = () => {
    if (!customStart || !customEnd) return;
    const nextState = calculatePeriodDates('custom', customStart, customEnd, customEnd);
    onChange(nextState);
    setShowCustomModal(false);
  };

  return (
    <div className={cn("relative inline-block text-left", className)}>
      <div className="flex flex-col sm:flex-row sm:items-center gap-2">
        {/* Page Header Period & As of Date Badges */}
        {showSubtitle && (
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-blue-50/80 border border-blue-200/80 text-blue-900 font-semibold shadow-2xs">
              <Clock className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              <span>Analysis period:</span>
              <span className="font-bold text-blue-700">{value.label}</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-100/90 border border-slate-200 text-slate-700 font-medium">
              <Calendar className="w-3.5 h-3.5 text-slate-500 shrink-0" />
              <span>As of</span>
              <span className="font-bold text-slate-900">{formatAsOfDate(value.asOfDate)}</span>
            </div>
          </div>
        )}

        {/* Filter Trigger Button */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-2 px-3 py-2 sm:py-1.5 rounded-xl bg-white border border-slate-300 hover:border-blue-500 hover:bg-slate-50/80 text-slate-800 text-xs font-semibold shadow-2xs transition active:scale-[0.99] min-h-[44px] sm:min-h-0"
            aria-expanded={isOpen}
            aria-haspopup="true"
            id="analysis-period-dropdown-button"
            title="Change analysis period"
          >
            <Filter className="w-3.5 h-3.5 text-blue-600 shrink-0" />
            <span className="text-slate-500 font-medium hidden md:inline">Period:</span>
            <span className="font-bold text-slate-900">{value.label}</span>
            <ChevronDown className={cn("w-3.5 h-3.5 text-slate-400 transition-transform duration-200", isOpen && "rotate-180")} />
          </button>

          {/* Dropdown Menu */}
          {isOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setIsOpen(false)}
              />
              <div className="absolute right-0 mt-2 w-72 sm:w-80 rounded-2xl bg-white border border-slate-200 shadow-xl z-50 p-2 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
                <div className="px-3 py-2 border-b border-slate-100 mb-1">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Select Analysis Period
                  </div>
                  <div className="text-xs text-slate-600 mt-0.5">
                    Controls trend charts, adjustments, and review activity
                  </div>
                </div>

                <div className="space-y-1">
                  {PERIOD_OPTIONS.map((opt) => {
                    const isSelected = value.period === opt.type;
                    return (
                      <button
                        key={opt.type}
                        type="button"
                        onClick={() => handleSelectPeriod(opt.type)}
                        className={cn(
                          "w-full text-left px-3 py-2 rounded-xl text-xs transition flex items-start justify-between gap-2",
                          isSelected
                            ? "bg-blue-50 text-blue-900 font-bold border border-blue-200"
                            : "hover:bg-slate-100 text-slate-700 border border-transparent"
                        )}
                      >
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-1.5 font-semibold text-slate-900">
                            {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />}
                            <span>{opt.label}</span>
                          </div>
                          <p className="text-[11px] text-slate-500 font-normal leading-tight">
                            {opt.description}
                          </p>
                        </div>
                        {isSelected && (
                          <Check className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {value.period === 'custom' && value.startDate && value.endDate && (
                  <div className="mt-2 pt-2 border-t border-slate-100 px-3 py-1.5 bg-slate-50 rounded-xl text-[11px] text-slate-600 flex items-center justify-between">
                    <span>Range: {value.startDate} to {value.endDate}</span>
                    <button
                      type="button"
                      onClick={() => {
                        setShowCustomModal(true);
                        setIsOpen(false);
                      }}
                      className="text-blue-600 font-bold hover:underline"
                    >
                      Edit
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Custom Date Range Picker Modal / Popover */}
      {showCustomModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl p-5 max-w-sm w-full space-y-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-blue-600" />
                <span>Custom Analysis Range</span>
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Choose start and end dates for reporting metrics and trend points.
              </p>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Start Date:
                </label>
                <input
                  type="date"
                  value={customStart}
                  onChange={(e) => setCustomStart(e.target.value)}
                  max={customEnd}
                  className="w-full px-3 py-2 text-xs font-semibold rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  End Date (As of Date):
                </label>
                <input
                  type="date"
                  value={customEnd}
                  onChange={(e) => setCustomEnd(e.target.value)}
                  min={customStart}
                  max="2026-12-31"
                  className="w-full px-3 py-2 text-xs font-semibold rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowCustomModal(false)}
                className="px-3.5 py-1.5 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-semibold transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleApplyCustom}
                className="px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition shadow-xs"
              >
                Apply Range
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
