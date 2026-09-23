import React, { useState, useEffect, useCallback } from 'react';
import { Sidebar, TabType } from './components/Sidebar';
import { TopHeader } from './components/TopHeader';
import { DashboardView } from './components/DashboardView';
import { EmployeesView } from './components/EmployeesView';
import { ReportsView } from './components/ReportsView';
import { SettingsView } from './components/SettingsView';
import { AboutView } from './components/AboutView';
import { EmployeePortalView } from './components/EmployeePortalView';
import { LoginModal } from './components/LoginModal';
import { EmployeeDetailModal } from './components/EmployeeDetailModal';
import { AddEmployeeModal } from './components/AddEmployeeModal';
import { EditSalaryModal } from './components/EditSalaryModal';
import { SalaryHistoryDrawer } from './components/SalaryHistoryDrawer';
import { DocsModal } from './components/DocsModal';
import { NotificationDrawer } from './components/NotificationDrawer';
import { LoginPage } from './components/LoginPage';
import { AuthProvider, useAuth } from './context/AuthContext';
import { apiFetch } from './lib/api';
import {
  Employee,
  Department,
  PayBand,
  FxRate,
  PaginatedResponse,
  DashboardStats,
  ActivityItem,
  NotificationItem,
  DateRangeFilter,
  AnalysisPeriodState
} from './types';
import { loadStoredPeriod, saveStoredPeriod } from './lib/periodUtils';
import {
  CheckCircle2,
  AlertCircle,
  LayoutDashboard,
  Users,
  BarChart3,
  Settings,
  ShieldCheck,
  Loader2
} from 'lucide-react';

function CompensationPortal() {
  const { user, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(() => {
    try {
      return localStorage.getItem('acme_sidebar_collapsed') === 'true';
    } catch {
      return false;
    }
  });

  const handleToggleSidebarCollapse = () => {
    setIsSidebarCollapsed(prev => {
      const next = !prev;
      try {
        localStorage.setItem('acme_sidebar_collapsed', String(next));
      } catch {
        // ignore
      }
      return next;
    });
  };

  // Demo Personas: 'hr.global' | 'hr.india' | 'employee'
  const [userRole, setUserRole] = useState<'hr.global' | 'hr.india' | 'employee'>('hr.global');
  const [userEmail, setUserEmail] = useState('hr.global@demo.com');
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

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

  // Shared Analysis Period State across Dashboard and Compensation Insights
  const [analysisPeriod, setAnalysisPeriod] = useState<AnalysisPeriodState>(() => loadStoredPeriod());

  const handlePeriodChange = (nextPeriod: AnalysisPeriodState) => {
    setAnalysisPeriod(nextPeriod);
    saveStoredPeriod(nextPeriod);
  };

  // Modals & Drawers
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [salaryChangeEmployee, setSalaryChangeEmployee] = useState<Employee | null>(null);
  const [historyEmployee, setHistoryEmployee] = useState<Employee | null>(null);
  const [isDocsModalOpen, setIsDocsModalOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isReseeding, setIsReseeding] = useState(false);

  // Notifications state
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 'notif-1',
      title: 'Annual Compensation Review Prepared',
      message: 'Global compensation budgets and band allocations refreshed across 10,000 active employees.',
      time: '10m ago',
      type: 'salary',
      isRead: false
    },
    {
      id: 'notif-2',
      title: 'L3 Senior Engineer Benchmark Updated',
      message: 'India and US market parity benchmarks synced with latest industry compensation percentiles.',
      time: '1h ago',
      type: 'salary',
      isRead: false
    },
    {
      id: 'notif-3',
      title: 'Audit Trail Verification Complete',
      message: 'All historical salary modifications logged with timestamp and user justification.',
      time: '3h ago',
      type: 'compensation',
      isRead: true
    }
  ]);

  const handleClearNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const handleClearAllNotifications = () => {
    setNotifications([]);
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
      const res = await apiFetch('/api/meta');
      const data = await res.json();
      if (data.departments) setDepartments(data.departments);
      if (data.payBands) setPayBands(data.payBands);
      if (data.fxRates) setFxRates(data.fxRates);
    } catch (err) {
      console.error('Failed to fetch meta:', err);
    }
  };

  // Fetch stats & activity
  const fetchDashboardData = async () => {
    try {
      const [statsRes, actRes] = await Promise.all([
        apiFetch('/api/dashboard/stats'),
        apiFetch('/api/activities')
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

      const res = await apiFetch(`/api/employees?${params.toString()}`);
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
    updated_at: '2026-09-01'
  };

  // Open single employee detail with fresh data from server
  const handleOpenEmployeeDetail = async (emp: Employee) => {
    try {
      const res = await apiFetch(`/api/employees/${emp.id}`);
      const detailed = await res.json();
      setSelectedEmployee(detailed || emp);
    } catch {
      setSelectedEmployee(emp);
    }
  };

  // Add Employee Handler
  const handleAddEmployee = async (newEmpData: any) => {
    const res = await apiFetch('/api/employees', {
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
    const res = await apiFetch(`/api/employees/${id}`, {
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

  // Auditable Salary Change (PUT /api/employees/:id/salary) with instant cache invalidation
  const handleSaveSalary = async (
    id: number,
    data: {
      new_salary: number;
      currency_code: string;
      effective_date: string;
      reason: string;
      comment?: string;
      changed_by?: string;
    }
  ) => {
    const res = await apiFetch(`/api/employees/${id}/salary`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const errJson = await res.json();
      throw new Error(errJson.error || 'Failed to update salary');
    }
    const updated = await res.json();
    if (selectedEmployee && selectedEmployee.id === id) {
      setSelectedEmployee(updated);
    }
    showToast(
      `Updated salary for ${updated.first_name} ${updated.last_name} (${data.reason})`
    );
    // Invalidate caches: refresh directory and dashboard metrics
    await Promise.all([fetchEmployees(), fetchDashboardData()]);
  };

  // Reseed / Scale 10,000 Employees
  const handleReseed = async () => {
    const count = prompt("Enter number of employees to generate at scale (e.g. 10000):", "10000");
    if (!count) return;
    const targetCount = parseInt(count, 10);
    if (isNaN(targetCount) || targetCount <= 0) return;

    setIsReseeding(true);
    showToast(`Generating ${targetCount.toLocaleString()} employees with 69% IN / 31% US distribution...`);
    try {
      const res = await apiFetch('/api/seed', {
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

  const totalCount = employeesData?.pagination?.total || stats?.total_active_employees || 10000;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-100">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400 animate-pulse">
            <ShieldCheck className="w-6 h-6 text-blue-400" />
          </div>
          <div className="flex items-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin text-blue-400" />
            <span className="text-sm font-medium text-slate-300">Authenticating ACME Security Session...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return <LoginPage />;
  }

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
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={handleToggleSidebarCollapse}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 pb-20 lg:pb-0">
        {/* Top Header */}
        <TopHeader
          onOpenAddModal={() => setIsAddModalOpen(true)}
          onReseed={handleReseed}
          employeeCount={totalCount}
          isReseeding={isReseeding}
          onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          unreadNotificationsCount={notifications.filter(n => !n.isRead).length || notifications.length}
          onOpenNotifications={() => setIsNotificationsOpen(true)}
          userRole={userRole}
          onOpenLoginModal={() => setIsLoginModalOpen(true)}
          onSwitchRole={handleSwitchRole}
          isSidebarCollapsed={isSidebarCollapsed}
          onToggleSidebarCollapse={handleToggleSidebarCollapse}
          activeTab={activeTab}
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
              {/* TAB 1: EXECUTIVE DASHBOARD */}
              {activeTab === 'dashboard' && (
                <DashboardView
                  departments={departments}
                  analysisPeriod={analysisPeriod}
                  onPeriodChange={handlePeriodChange}
                  onNavigateToEmployees={(country, dept) => {
                    if (country && country !== 'all') setSelectedCountry(country);
                    if (dept && dept !== 'all') setSelectedDept(dept);
                    setActiveTab('employees');
                  }}
                  onOpenEditSalary={async (empId) => {
                    try {
                      const res = await apiFetch(`/api/employees/${empId}`);
                      const emp = await res.json();
                      setSalaryChangeEmployee(emp);
                    } catch (err) {
                      console.error(err);
                    }
                  }}
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
                  onOpenHistory={(emp) => setHistoryEmployee(emp)}
                  isLoading={isLoadingEmployees}
                />
              )}

              {/* TAB 3: COMPENSATION INSIGHTS */}
              {activeTab === 'insights' && (
                <ReportsView
                  analysisPeriod={analysisPeriod}
                  onPeriodChange={handlePeriodChange}
                />
              )}

              {/* TAB 4: SETTINGS */}
              {activeTab === 'settings' && (
                <SettingsView
                  onTriggerReseed={handleReseed}
                  isReseeding={isReseeding}
                />
              )}

              {/* TAB 5: ABOUT & SYSTEM DOSSIER (Accessible via bottom sidebar) */}
              {activeTab === 'about' && (
                <AboutView
                  onNavigateToTab={(tab) => setActiveTab(tab as TabType)}
                  onReseed={handleReseed}
                />
              )}
            </>
          )}
        </main>
      </div>

      {/* Modal 1: Employee Detail Modal */}
      {selectedEmployee && (
        <EmployeeDetailModal
          employee={selectedEmployee}
          departments={departments}
          payBands={payBands}
          onClose={() => setSelectedEmployee(null)}
          onOpenSalaryChange={(emp) => setSalaryChangeEmployee(emp)}
          onOpenHistory={(emp) => setHistoryEmployee(emp)}
          onUpdateEmployee={handleUpdateEmployee}
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

      {/* Modal 3: Edit Employee Salary (Right-Side Auditable Slider/Drawer) */}
      {salaryChangeEmployee && (
        <EditSalaryModal
          isOpen={Boolean(salaryChangeEmployee)}
          employee={salaryChangeEmployee}
          payBands={payBands}
          onClose={() => setSalaryChangeEmployee(null)}
          onSave={handleSaveSalary}
          onViewHistory={(emp) => {
            setSalaryChangeEmployee(null);
            setHistoryEmployee(emp);
          }}
        />
      )}

      {/* Modal 4: Salary History & Audit Trail Drawer */}
      {historyEmployee && (
        <SalaryHistoryDrawer
          isOpen={Boolean(historyEmployee)}
          employee={historyEmployee}
          onClose={() => setHistoryEmployee(null)}
          onOpenEditSalary={(emp) => {
            setHistoryEmployee(null);
            setSalaryChangeEmployee(emp);
          }}
        />
      )}

      {/* Modal 5: Docs Modal */}
      {isDocsModalOpen && (
        <DocsModal onClose={() => setIsDocsModalOpen(false)} />
      )}

      {/* Modal 6: Demo Persona Switcher & Login */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLogin={handleSwitchRole}
      />

      {/* Notification Drawer */}
      <NotificationDrawer
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        notifications={notifications}
        onClearNotification={handleClearNotification}
        onClearAll={handleClearAllNotifications}
      />

      {/* Mobile Bottom Quick Navigation Bar */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 px-3 py-1.5 flex items-center justify-around shadow-lg">
        <button
          onClick={() => handleTabChange('dashboard')}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl text-[11px] font-semibold transition min-h-[44px] min-w-[56px] cursor-pointer ${
            activeTab === 'dashboard' ? 'text-blue-600 font-bold bg-blue-50/80 shadow-2xs' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
          }`}
        >
          <LayoutDashboard className={`w-5 h-5 mb-0.5 ${activeTab === 'dashboard' ? 'stroke-[2.5]' : 'stroke-2'}`} />
          <span>Dashboard</span>
        </button>

        <button
          onClick={() => handleTabChange('employees')}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl text-[11px] font-semibold transition min-h-[44px] min-w-[56px] relative cursor-pointer ${
            activeTab === 'employees' ? 'text-blue-600 font-bold bg-blue-50/80 shadow-2xs' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
          }`}
        >
          <Users className={`w-5 h-5 mb-0.5 ${activeTab === 'employees' ? 'stroke-[2.5]' : 'stroke-2'}`} />
          <span>Employees</span>
          {totalCount > 0 && (
            <span className="absolute top-1 right-2.5 w-2 h-2 rounded-full bg-blue-600 ring-2 ring-white" />
          )}
        </button>

        <button
          onClick={() => handleTabChange('insights')}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl text-[11px] font-semibold transition min-h-[44px] min-w-[56px] cursor-pointer ${
            activeTab === 'insights' ? 'text-blue-600 font-bold bg-blue-50/80 shadow-2xs' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
          }`}
        >
          <BarChart3 className={`w-5 h-5 mb-0.5 ${activeTab === 'insights' ? 'stroke-[2.5]' : 'stroke-2'}`} />
          <span>Insights</span>
        </button>

        <button
          onClick={() => handleTabChange('settings')}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl text-[11px] font-semibold transition min-h-[44px] min-w-[56px] cursor-pointer ${
            activeTab === 'settings' ? 'text-blue-600 font-bold bg-blue-50/80 shadow-2xs' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
          }`}
        >
          <Settings className={`w-5 h-5 mb-0.5 ${activeTab === 'settings' ? 'stroke-[2.5]' : 'stroke-2'}`} />
          <span>Settings</span>
        </button>
      </nav>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CompensationPortal />
    </AuthProvider>
  );
}

