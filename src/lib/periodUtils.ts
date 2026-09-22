import { AnalysisPeriodState, AnalysisPeriodType } from '../types';

export const DEFAULT_AS_OF_DATE = '2026-09-30';
export const STORAGE_KEY_ANALYSIS_PERIOD = 'acme_analysis_period';

export interface PeriodOptionDefinition {
  type: AnalysisPeriodType;
  label: string;
  description: string;
}

export const PERIOD_OPTIONS: PeriodOptionDefinition[] = [
  { type: 'snapshot', label: 'Current snapshot', description: 'Real-time organizational state as of today' },
  { type: '1m', label: 'Last month', description: 'September 2026 activity (Sep 1 – Sep 30, 2026)' },
  { type: '3m', label: 'Last 3 months', description: 'Q3 2026 review cycle (Jul 1 – Sep 30, 2026)' },
  { type: '6m', label: 'Last 6 months', description: 'Q2–Q3 2026 compensation review (Apr 1 – Sep 30, 2026)' },
  { type: '12m', label: 'Last 12 months', description: 'Full trailing 12-month review cycle (Oct 1, 2025 – Sep 30, 2026)' },
  { type: 'custom', label: 'Custom range', description: 'Select a custom start and end date window' }
];

export function calculatePeriodDates(
  type: AnalysisPeriodType,
  customStart?: string,
  customEnd?: string,
  asOfDate: string = DEFAULT_AS_OF_DATE
): AnalysisPeriodState {
  switch (type) {
    case 'snapshot':
      return {
        period: 'snapshot',
        startDate: undefined,
        endDate: asOfDate,
        asOfDate,
        label: 'Current snapshot'
      };

    case '1m':
      return {
        period: '1m',
        startDate: '2026-09-01',
        endDate: asOfDate,
        asOfDate,
        label: 'Last month'
      };

    case '3m':
      return {
        period: '3m',
        startDate: '2026-07-01',
        endDate: asOfDate,
        asOfDate,
        label: 'Last 3 months'
      };

    case '6m':
      return {
        period: '6m',
        startDate: '2026-04-01',
        endDate: asOfDate,
        asOfDate,
        label: 'Last 6 months'
      };

    case '12m':
      return {
        period: '12m',
        startDate: '2025-10-01',
        endDate: asOfDate,
        asOfDate,
        label: 'Last 12 months'
      };

    case 'custom': {
      const start = customStart || '2026-06-01';
      const end = customEnd || asOfDate;
      return {
        period: 'custom',
        startDate: start,
        endDate: end,
        asOfDate,
        label: 'Custom range'
      };
    }

    default:
      return {
        period: '6m',
        startDate: '2026-04-01',
        endDate: asOfDate,
        asOfDate,
        label: 'Last 6 months'
      };
  }
}

export function formatAsOfDate(dateStr: string): string {
  if (!dateStr) return 'Sep 30, 2026';
  const parts = dateStr.split('-');
  if (parts.length === 3) {
    const year = Number(parts[0]);
    const month = Number(parts[1]) - 1;
    const day = Number(parts[2]);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    if (month >= 0 && month < 12) {
      return `${months[month]} ${day}, ${year}`;
    }
  }
  return dateStr;
}

export function formatPeriodRange(state: AnalysisPeriodState): string {
  if (state.period === 'snapshot' || !state.startDate) {
    return `As of ${formatAsOfDate(state.asOfDate)}`;
  }
  return `${formatAsOfDate(state.startDate)} – ${formatAsOfDate(state.endDate || state.asOfDate)}`;
}

export function loadStoredPeriod(): AnalysisPeriodState {
  try {
    const stored = localStorage.getItem(STORAGE_KEY_ANALYSIS_PERIOD);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed && parsed.period) {
        return calculatePeriodDates(parsed.period, parsed.startDate, parsed.endDate, parsed.asOfDate || DEFAULT_AS_OF_DATE);
      }
    }
  } catch (e) {
    // Ignore storage errors
  }
  return calculatePeriodDates('6m');
}

export function saveStoredPeriod(state: AnalysisPeriodState): void {
  try {
    localStorage.setItem(STORAGE_KEY_ANALYSIS_PERIOD, JSON.stringify(state));
  } catch (e) {
    // Ignore storage errors
  }
}
