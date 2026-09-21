import React, { useState, useEffect, useCallback } from 'react';
import { Sidebar, TabType } from './components/Sidebar';
import { TopHeader } from './components/TopHeader';
import { DashboardView } from './components/DashboardView';
import { EmployeesView } from './components/EmployeesView';
import { ReportsView } from './components/ReportsView';
import { SettingsView } from './components/SettingsView';
import { EmployeePortalView } from './components/EmployeePortalView';
import { LoginModal } from './components/LoginModal';
import { EmployeeDetailModal } from './components/EmployeeDetailModal';
import { AddEmployeeModal } from './components/AddEmployeeModal';
import { EditSalaryModal } from './components/EditSalaryModal';
import { DocsModal } from './components/DocsModal';
import { AboutView } from './components/AboutView';
import { NotificationDrawer } from './components/NotificationDrawer';
import {
  Employee,
  Department,
  PayBand,
  FxRate,
  PaginatedResponse,
  DashboardStats,
  ActivityItem,
  NotificationItem,
  DateRangeFilter
} from './types';
import {
  CheckCircle2,
  AlertCircle,
  Play,
  Database,
  RefreshCw,
  Building,
  Layers,
  Sparkles,
  LayoutDashboard,
  Users,
  CreditCard,
  BarChart3,
  Menu,
  Info
} from 'lucide-react';
import { formatCurrency } from './lib/utils';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Demo Personas: 'hr.global' | 'hr.india' | 'employee'
  const [userRole, setUserRole] = useState<'hr.global' | 'hr.india' | 'employee'>('hr.global');
  const [userEmail, setUserEmail] = useState('hr.global@demo.com');
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [selectedPayrollCountry, setSelectedPayrollCountry] = useState<'US' | 'IN'>('IN');

  // Metadata & Stats
  const [departments, setDepartments] = useState<Department[]>([]);
  const [payBands, setPayBands] = useState<PayBand[]>([]);
  const [fxRates, setFxRates] = useState<FxRate[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [activities, setActivities] = useState<ActivityItem[]>([]);

  // Employee list & filtering
  const [employeesData, setEmployeesData] = useState<PaginatedResponse<Employee> | null>(null);
  const [isLoadingEmployees, setIsLoadingEmployees] = useState<boolean>(false);
  const [search, setSearch] = useState('');
  const [selectedDept, setSelectedDept] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedBand, setSelectedBand] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [sortBy, setSortBy] = useState('id');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  // Modals & Drawers
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [salaryChangeEmployee, setSalaryChangeEmployee] = useState<Employee | null>(null);
  const [isDocsModalOpen, setIsDocsModalOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isReseeding, setIsReseeding] = useState(false);

  // Date Range state for filtering payroll data
  const [selectedDateRange, setSelectedDateRange] = useState<DateRangeFilter>({
    periodKey: 'may_2024',
    label: 'May 1 – May 31, 2024',
    startDate: '2024-05-01',
    endDate: '2024-05-31'
  });

  // Notifications state with options to clear specific or all
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 'notif-1',
      title: 'May 2024 Payroll Disbursed',
      message: 'Direct deposit ACH batches successfully transmitted for 238 employees ($512,430.50). Next cycle scheduled May 31.',
      time: '12m ago',
      type: 'payroll',
      isRead: false
    },
    {
      id: 'notif-2',
      title: 'Salary Band Adjusted (Germany & India)',
      message: 'L3 Senior Engineer compensation benchmark was updated to match European & APAC talent market rates.',
      time: '1h ago',
      type: 'salary',
      isRead: false
    },
    {
      id: 'notif-3',
      title: 'Form 941 Quarterly Tax Filing Ready',
      message: 'Statutory tax deductions of $72,540.30 reconciled with zero discrepancies for internal audit compliance.',
      time: '3h ago',
      type: 'tax',
      isRead: true
    },
    {
      id: 'notif-4',
      title: '10 New Employees Onboarded',
      message: 'Bank account validation and multi-currency payroll profiles finalized for the new engineering cohort.',
      time: '1d ago',
      type: 'employee',
      isRead: true
    }
  ]);

  const handleClearNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const handleClearAllNotifications = () => {
    setNotifications([]);
  };

  const handleDateRangeChange = async (newRange: DateRangeFilter) => {
    setSelectedDateRange(newRange);
    try {
      const res = await fetch(`/api/dashboard/stats?period=${newRange.periodKey}`);
      if (res.ok) {
        const statsJson = await res.json();
        setStats(statsJson);
      }
    } catch (err) {
      console.error('Failed to fetch period stats:', err);
    }
  };

  // Toast / notification state
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Fetch metadata
  const fetchMeta = async () => {
    try {
      const res = await fetch('/api/meta');
      const data = await res.json();
      if (data.departments) setDepartments(data.departments);
      if (data.payBands) setPayBands(data.payBands);
      if (data.fxRates) setFxRates(data.fxRates);
    } catch (err) {
      console.error('Failed to fetch meta:', err);
    }
  };

  // Fetch stats & activity
  const fetchDashboardData = async (periodKey: string = selectedDateRange.periodKey) => {
    try {
      const [statsRes, actRes] = await Promise.all([
        fetch(`/api/dashboard/stats?period=${periodKey}`),
        fetch('/api/activities')
      ]);
      const statsJson = await statsRes.json();
      const actJson = await actRes.json();
      setStats(statsJson);
      setActivities(actJson || []);
    } catch (err) {
      console.error('Failed to fetch dashboard stats:', err);
    }
  };

  // Fetch employees list
  const fetchEmployees = useCallback(async () => {
    setIsLoadingEmployees(true);
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
        sort_by: sortBy,
        sort_order: sortOrder
      });

      if (search.trim()) params.set('search', search.trim());
      if (selectedDept) params.set('department_id', selectedDept);
      if (selectedCountry) params.set('country_code', selectedCountry);
      if (selectedBand) params.set('pay_band_id', selectedBand);
      if (selectedStatus && selectedStatus !== 'all') params.set('status', selectedStatus);

      const res = await fetch(`/api/employees?${params.toString()}`);
      const data = await res.json();
      setEmployeesData(data);
    } catch (err) {
      console.error('Failed to fetch employees:', err);
    } finally {
      setIsLoadingEmployees(false);
    }
  }, [page, limit, sortBy, sortOrder, search, selectedDept, selectedCountry, selectedBand, selectedStatus]);

  // Initial load
  useEffect(() => {
    fetchMeta();
    fetchDashboardData();
  }, []);

  // Re-fetch employees when filters/pagination change
  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  // Handle Tab Switch
  const handleTabChange = (tab: TabType) => {
    setIsMobileMenuOpen(false);
    setActiveTab(tab);
  };

  // Handle Demo Persona Switch
  const handleSwitchRole = (role: 'hr.global' | 'hr.india' | 'employee', email?: string) => {
    setUserRole(role);
    if (email) setUserEmail(email);
    if (role === 'hr.india') {
      setSelectedCountry('IN');
      setSelectedPayrollCountry('IN');
    } else if (role === 'hr.global') {
      setSelectedCountry('');
    }
    setIsLoginModalOpen(false);
    showToast(`Switched persona to ${role === 'hr.global' ? 'Global HR (US & India)' : role === 'hr.india' ? 'India HR (India only)' : 'Employee Self-Service'}`);
  };

  // Showcase employee for Aarav Sharma (employee@demo.com)
  const showcaseEmployee: Employee = employeesData?.data?.find(e => e.country_code === 'IN') || {
    id: 1,
    employee_code: 'EMP-IN-001',
    first_name: 'Aarav',
    last_name: 'Sharma',
    email: 'employee@demo.com',
    role_title: 'Staff Software Engineer',
    department_id: 1,
    department_name: 'Engineering',
    pay_band_id: 3,
    pay_band_name: 'L3 Senior',
    currency_code: 'INR',
    country_code: 'IN',
    current_salary: 2800000,
    hire_date: '2022-03-15',
    employment_status: 'active',
    created_at: '2022-03-15',
    updated_at: '2024-05-01'
  };

  // Open single employee detail with fresh data from server
  const handleOpenEmployeeDetail = async (emp: Employee) => {
    try {
      const res = await fetch(`/api/employees/${emp.id}`);
      const detailed = await res.json();
      setSelectedEmployee(detailed || emp);
    } catch {
      setSelectedEmployee(emp);
    }
  };

  // Add Employee Handler
  const handleAddEmployee = async (newEmpData: any) => {
    const res = await fetch('/api/employees', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newEmpData)
    });
    if (!res.ok) {
      const errJson = await res.json();
      throw new Error(errJson.error || 'Failed to create employee');
    }
    showToast(`Created employee ${newEmpData.first_name} ${newEmpData.last_name} successfully`);
    fetchEmployees();
    fetchDashboardData();
  };

  // Update Employee Profile
  const handleUpdateEmployee = async (id: number, data: any) => {
    const res = await fetch(`/api/employees/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const errJson = await res.json();
      throw new Error(errJson.error || 'Failed to update employee');
    }
    const updated = await res.json();
    setSelectedEmployee(updated);
    showToast(`Updated employee details successfully`);
    fetchEmployees();
    fetchDashboardData();
  };

  // Edit Employee Salary (PUT /api/employees/:id/salary) with instant cache invalidation
  const handleSaveSalary = async (id: number, newSalary: number) => {
    const res = await fetch(`/api/employees/${id}/salary`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ current_salary: newSalary })
    });
    if (!res.ok) {
      const errJson = await res.json();
      throw new Error(errJson.error || 'Failed to update salary');
    }
    const updated = await res.json();
    if (selectedEmployee && selectedEmployee.id === id) {
      setSelectedEmployee(updated);
    }
    showToast(`Updated salary for ${updated.first_name} ${updated.last_name} to ${updated.currency_code} ${Number(newSalary).toLocaleString()}`);
    // Cache invalidation: immediately refresh both directory and dashboard metrics
    await Promise.all([fetchEmployees(), fetchDashboardData()]);
  };

  const handleRecordSalaryChange = async (id: number, data: any) => {
    await handleSaveSalary(id, Number(data.base_salary || data.current_salary));
  };

  // Soft Delete Employee
  const handleSoftDelete = async (emp: Employee) => {
    if (!confirm(`Are you sure you want to soft-delete ${emp.first_name} ${emp.last_name} (${emp.employee_code})? This will mark the employee as inactive for audit preservation.`)) {
      return;
    }

    try {
      const res = await fetch(`/api/employees/${emp.id}`, { method: 'DELETE' });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error);
      showToast(result.message || `Employee marked inactive`);
      if (selectedEmployee && selectedEmployee.id === emp.id) {
        setSelectedEmployee(result.employee);
      }
      fetchEmployees();
      fetchDashboardData();
    } catch (err: any) {
      showToast(err.message || 'Failed to soft delete employee', 'error');
    }
  };

  // Reseed / Scale 10,000 Employees
  const handleReseed = async () => {
    const count = prompt("Enter number of employees to generate at scale (e.g. 10000):", "10000");
    if (!count) return;
    const targetCount = parseInt(count, 10);
    if (isNaN(targetCount) || targetCount <= 0) return;

    setIsReseeding(true);
    showToast(`Generating ${targetCount.toLocaleString()} employees with realistic distributions...`);
    try {
      const res = await fetch('/api/seed', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ count: targetCount })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      showToast(data.message || `Successfully generated ${targetCount} employees`);
      fetchEmployees();
      fetchDashboardData();
    } catch (err: any) {
      showToast(err.message || 'Error generating employees', 'error');
    } finally {
      setIsReseeding(false);
    }
  };

  const totalCount = employeesData?.pagination?.total || stats?.total_active_employees || 0;

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        employeeCount={totalCount}
        currentRole={userRole}
        isOpenMobile={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 pb-16 lg:pb-0">
        {/* Top Header */}
        <TopHeader
          searchQuery={search}
          onSearchChange={(q) => {
            setSearch(q);
            setPage(1);
            if (activeTab !== 'employees' && activeTab !== 'dashboard') {
              setActiveTab('employees');
            }
          }}
          onOpenAddModal={() => setIsAddModalOpen(true)}
          onReseed={handleReseed}
          employeeCount={totalCount}
          isReseeding={isReseeding}
          onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          selectedDateRange={selectedDateRange}
          onDateRangeChange={handleDateRangeChange}
          unreadNotificationsCount={notifications.filter(n => !n.isRead).length || notifications.length}
          onOpenNotifications={() => setIsNotificationsOpen(true)}
          userRole={userRole}
          onOpenLoginModal={() => setIsLoginModalOpen(true)}
          onSwitchRole={handleSwitchRole}
        />

        {/* Dynamic Page Content */}
        <main className="flex-1 p-3.5 sm:p-6 md:p-8 max-w-7xl w-full mx-auto min-w-0">
          {/* Toast Notification Popup */}
          {toastMessage && (
            <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 duration-200">
              <div className={`p-4 rounded-2xl shadow-xl border flex items-center gap-3 text-xs font-bold ${
                toastMessage.type === 'success'
                  ? 'bg-emerald-600 text-white border-emerald-500 shadow-emerald-500/20'
                  : 'bg-rose-600 text-white border-rose-500 shadow-rose-500/20'
              }`}>
                {toastMessage.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 shrink-0" />
                )}
                <span>{toastMessage.text}</span>
              </div>
            </div>
          )}

          {/* If logged in as Employee Persona, show Self-Service Employee Portal */}
          {userRole === 'employee' ? (
            <EmployeePortalView
              employee={showcaseEmployee}
              onSwitchPersona={handleSwitchRole}
            />
          ) : (
            <>
              {/* TAB 1: DASHBOARD */}
              {activeTab === 'dashboard' && (
                <DashboardView
                  stats={stats}
                  employeesData={employeesData}
                  activities={activities}
                  onSelectEmployee={handleOpenEmployeeDetail}
                  onPageChange={(p) => setPage(p)}
                  onRunPayroll={() => setActiveTab('employees')}
                  onViewEmployees={() => setActiveTab('employees')}
                  onViewReports={() => setActiveTab('reports')}
                  currentPage={page}
                  selectedDateRange={selectedDateRange}
                />
              )}

              {/* TAB 2: EMPLOYEES DIRECTORY */}
              {activeTab === 'employees' && (
                <EmployeesView
                  data={employeesData}
                  departments={departments}
                  payBands={payBands}
                  search={search}
                  setSearch={setSearch}
                  selectedDept={selectedDept}
                  setSelectedDept={setSelectedDept}
                  selectedCountry={selectedCountry}
                  setSelectedCountry={setSelectedCountry}
                  selectedBand={selectedBand}
                  setSelectedBand={setSelectedBand}
                  selectedStatus={selectedStatus}
                  setSelectedStatus={setSelectedStatus}
                  sortBy={sortBy}
                  setSortBy={setSortBy}
                  sortOrder={sortOrder}
                  setSortOrder={setSortOrder}
                  page={page}
                  setPage={setPage}
                  limit={limit}
                  setLimit={setLimit}
                  onSelectEmployee={handleOpenEmployeeDetail}
                  onOpenAddModal={() => setIsAddModalOpen(true)}
                  onOpenSalaryChange={(emp) => setSalaryChangeEmployee(emp)}
                  onSoftDelete={handleSoftDelete}
                  isLoading={isLoadingEmployees}
                />
              )}

              {/* TAB 3: REPORTS & TRENDS */}
              {activeTab === 'reports' && (
                <ReportsView stats={stats} />
              )}
            </>
          )}
        </main>
      </div>

      {/* Modal 1: Employee Detail & Salary History */}
      {selectedEmployee && (
        <EmployeeDetailModal
          employee={selectedEmployee}
          departments={departments}
          payBands={payBands}
          onClose={() => setSelectedEmployee(null)}
          onOpenSalaryChange={(emp) => setSalaryChangeEmployee(emp)}
          onUpdateEmployee={handleUpdateEmployee}
          onSoftDelete={handleSoftDelete}
        />
      )}

      {/* Modal 2: Add New Employee */}
      {isAddModalOpen && (
        <AddEmployeeModal
          departments={departments}
          payBands={payBands}
          onClose={() => setIsAddModalOpen(false)}
          onAddEmployee={handleAddEmployee}
        />
      )}

      {/* Modal 3: Edit Employee Salary (Core Feature) */}
      {salaryChangeEmployee && (
        <EditSalaryModal
          isOpen={Boolean(salaryChangeEmployee)}
          employee={salaryChangeEmployee}
          onClose={() => setSalaryChangeEmployee(null)}
          onSave={handleSaveSalary}
        />
      )}

      {/* Modal 4: Assessment Deliverable Docs Viewer */}
      {isDocsModalOpen && (
        <DocsModal onClose={() => setIsDocsModalOpen(false)} />
      )}

      {/* Modal 5: Demo Persona Switcher & Login */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLogin={handleSwitchRole}
      />

      {/* Notification Drawer (Sidebar with smooth animation and item clearing) */}
      <NotificationDrawer
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        notifications={notifications}
        onClearNotification={handleClearNotification}
        onClearAll={handleClearAllNotifications}
      />

      {/* Mobile Bottom Quick Navigation Bar (Visible only on < lg screens) */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-3 py-1.5 flex items-center justify-around shadow-lg">
        <button
          onClick={() => handleTabChange('dashboard')}
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl text-[11px] font-semibold transition min-h-[44px] min-w-[54px] ${
            activeTab === 'dashboard' ? 'text-blue-600 font-bold' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <LayoutDashboard className={`w-5 h-5 mb-0.5 ${activeTab === 'dashboard' ? 'stroke-[2.5]' : 'stroke-2'}`} />
          <span>Home</span>
        </button>

        <button
          onClick={() => handleTabChange('employees')}
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl text-[11px] font-semibold transition min-h-[44px] min-w-[54px] relative ${
            activeTab === 'employees' ? 'text-blue-600 font-bold' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Users className={`w-5 h-5 mb-0.5 ${activeTab === 'employees' ? 'stroke-[2.5]' : 'stroke-2'}`} />
          <span>Employees</span>
          {totalCount > 0 && (
            <span className="absolute top-1 right-2.5 w-2 h-2 rounded-full bg-blue-600 ring-2 ring-white" />
          )}
        </button>

        <button
          onClick={() => handleTabChange('reports')}
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl text-[11px] font-semibold transition min-h-[44px] min-w-[54px] ${
            activeTab === 'reports' ? 'text-blue-600 font-bold' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <BarChart3 className={`w-5 h-5 mb-0.5 ${activeTab === 'reports' ? 'stroke-[2.5]' : 'stroke-2'}`} />
          <span>Reports</span>
        </button>
      </nav>
    </div>
  );
}
