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
  currency_code: string;
  effective_date: string;
  is_current: boolean | number;
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

export interface ActivityItem {
  id: string;
  title: string;
  subtitle: string;
  time_ago: string;
  status?: 'Pending' | 'Approved' | 'Processing' | 'Completed';
  type: 'bonus' | 'payroll' | 'tax' | 'employee' | 'general';
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  type: 'payroll' | 'employee' | 'salary' | 'tax' | 'system';
  isRead?: boolean;
}

export interface DateRangeFilter {
  label: string;
  startDate: string;
  endDate: string;
  periodKey: string;
}
