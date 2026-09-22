export interface Department {
  id: number;
  name: string;
}

export interface PayBand {
  id: number;
  name: string;
  min_salary: number;
  max_salary: number;
}

export interface FxRate {
  currency_code: string;
  rate_to_usd: number;
}

export interface SalaryRecord {
  id: number;
  employee_id: number;
  base_salary: number;
  previous_salary?: number;
  currency_code: string;
  effective_date: string;
  reason?: string;
  comment?: string;
  changed_by?: string;
  created_at?: string;
  is_current: boolean | number;
}

export interface RecentSalaryChange {
  id: number;
  employee_id: number;
  employee_code?: string;
  employee_name: string;
  role_title?: string;
  department_name: string;
  country_code?: string;
  previous_salary: number;
  new_salary: number;
  percentage_change: number;
  currency_code: string;
  effective_date: string;
  reason: string;
  comment?: string;
  changed_by?: string;
  created_at?: string;
}

export interface Employee {
  id: number;
  employee_code: string;
  first_name: string;
  last_name: string;
  email: string;
  department_id: number;
  department_name?: string;
  role_title: string;
  country_code: string;
  currency_code: string;
  pay_band_id: number;
  pay_band_name?: string;
  employment_status: 'active' | 'inactive';
  hire_date: string;
  created_at: string;
  updated_at: string;
  current_salary?: number;
  current_salary_usd?: number;
  salary_records?: SalaryRecord[];
}

export interface EmployeeFilterParams {
  search?: string;
  department_id?: string | number;
  country_code?: string;
  pay_band_id?: string | number;
  status?: string;
  page?: number;
  limit?: number;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    total_pages: number;
  };
}

export interface CountryBreakdown {
  country_code: string;
  country_name: string;
  currency: string;
  employee_count: number;
  total_comp_usd: number;
  avg_salary_usd: number;
  pct_workforce: number;
}

export interface DepartmentBreakdown {
  department_id: number;
  department_name: string;
  employee_count: number;
  total_comp_usd: number;
  avg_salary_usd: number;
  median_salary_usd: number;
  pct_workforce: number;
  comp_share_pct: number;
}

export interface SalaryBandBreakdown {
  band_name: string;
  employee_count: number;
  min_salary_usd: number;
  max_salary_usd: number;
  avg_salary_usd: number;
  pct_workforce: number;
}

export interface DashboardSummary {
  total_employees: number;
  total_annual_compensation_usd: number;
  average_annual_salary_usd: number;
  median_annual_salary_usd: number;
  countries_count: number;
  countries_breakdown: CountryBreakdown[];
  department_breakdown: DepartmentBreakdown[];
  salary_band_distribution: SalaryBandBreakdown[];
  recent_changes: RecentSalaryChange[];
}

export interface DepartmentInsight {
  department: string;
  employee_count: number;
  pct_organization: number;
  total_compensation_usd: number;
  avg_salary_usd: number;
  median_salary_usd: number;
  comp_share_pct: number;
}

export interface CountryInsight {
  country: string;
  country_code: string;
  currency: string;
  employee_count: number;
  pct_organization: number;
  total_comp_usd: number;
  avg_salary_usd: number;
}

export interface SalaryBandInsight {
  band: string;
  employee_count: number;
  pct_organization: number;
  total_comp_usd: number;
}

export interface LevelInsight {
  level: string;
  level_name: string;
  employee_count: number;
  avg_salary_usd: number;
  median_salary_usd: number;
  total_comp_usd: number;
}

export interface CompensationInsightsData {
  overview: {
    total_annual_compensation_usd: number;
    avg_annual_salary_usd: number;
    median_annual_salary_usd: number;
    highest_annual_salary_usd: number;
    lowest_annual_salary_usd: number;
    total_employees: number;
  };
  by_department: DepartmentInsight[];
  by_country: CountryInsight[];
  salary_bands: SalaryBandInsight[];
  by_level: LevelInsight[];
}

export interface PredefinedQuestionAnswer {
  question_id: string;
  question: string;
  summary: string;
  details: string[];
  insight: string;
  metrics?: Record<string, any>;
}

export interface ActivityItem {
  id: string;
  title: string;
  subtitle: string;
  time_ago: string;
  status?: 'Pending' | 'Approved' | 'Processing' | 'Completed';
  type: 'bonus' | 'payroll' | 'tax' | 'employee' | 'salary' | 'general';
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  type: 'compensation' | 'employee' | 'salary' | 'review' | 'system';
  isRead?: boolean;
}

// Backward compatibility legacy types
export interface DashboardStats {
  total_payroll_month: number;
  total_payroll_change_pct: number;
  employees_paid_count: number;
  employees_paid_change: number;
  pending_salaries_count: number;
  pending_salaries_amount: number;
  tax_deductions: number;
  tax_deductions_change_pct: number;
  payroll_trend: {
    month: string;
    amount: number;
  }[];
  salary_breakdown: {
    gross_salary: number;
    deductions: number;
    bonuses: number;
    net_salary: number;
  };
  total_active_employees: number;
  total_departments: number;
}

export interface PayrollCostGroup {
  group_name: string;
  employee_count: number;
  total_payroll_usd: number;
  avg_payroll_usd: number;
}

export interface SalaryDistributionGroup {
  pay_band: string;
  pay_band_id: number;
  min_allowed_usd: number;
  max_allowed_usd: number;
  min_salary_usd: number;
  max_salary_usd: number;
  median_salary_usd: number;
  avg_salary_usd: number;
  employee_count: number;
}

export interface RoleComparisonGroup {
  role_title: string;
  department_name: string;
  country_code: string;
  avg_salary_usd: number;
  employee_count: number;
}

export interface DateRangeFilter {
  label: string;
  startDate?: string;
  endDate?: string;
  periodKey?: string;
}

export type AnalysisPeriodType = 'snapshot' | '1m' | '3m' | '6m' | '12m' | 'custom';

export interface AnalysisPeriodState {
  period: AnalysisPeriodType;
  startDate?: string; // YYYY-MM-DD
  endDate?: string;   // YYYY-MM-DD
  asOfDate: string;   // YYYY-MM-DD
  label: string;      // e.g. "Last 6 months", "Current snapshot"
}

export interface PeriodTrendPoint {
  date_label: string;
  date: string;
  payroll_usd: number;
  salary_adjustments_count: number;
  total_increase_usd: number;
  avg_adjustment_pct: number;
}

export interface ReviewActivityBreakdown {
  total_reviews: number;
  approved_count: number;
  pending_count: number;
  annual_review_count: number;
  promotion_count: number;
  market_adjustment_count: number;
  other_count: number;
}

export interface PreviousPeriodComparison {
  has_previous_data: boolean;
  previous_start_date?: string;
  previous_end_date?: string;
  salary_change_count_change_pct?: number;
  total_increase_usd_change_pct?: number;
  avg_adjustment_pct_difference?: number;
  previous_total_increase_usd?: number;
  previous_salary_change_count?: number;
  previous_avg_adjustment_pct?: number;
}

export interface PeriodAnalysisMetrics {
  period_type: AnalysisPeriodType;
  period_label: string;
  start_date?: string | null;
  end_date: string;
  as_of_date: string;
  is_snapshot: boolean;
  // Selected period-controlled metrics:
  salary_changes_count: number;
  average_salary_adjustment_pct: number;
  total_annualized_increase_usd: number;
  review_activity: ReviewActivityBreakdown;
  previous_period_comparison: PreviousPeriodComparison;
  trend_points: PeriodTrendPoint[];
  period_salary_changes: RecentSalaryChange[];
}

export interface DashboardResponse extends DashboardSummary {
  as_of_date: string;
  period_analysis: PeriodAnalysisMetrics;
}

export interface CompensationInsightsResponse extends CompensationInsightsData {
  as_of_date: string;
  period_analysis: PeriodAnalysisMetrics;
}

