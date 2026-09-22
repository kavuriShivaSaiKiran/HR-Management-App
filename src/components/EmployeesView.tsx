import React, { useState } from 'react';
import {
  Search,
  Filter,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  UserCheck,
  History,
  DollarSign,
  Pencil,
  LayoutGrid,
  List,
  Building,
  Briefcase,
  Globe,
  Plus,
  RefreshCw,
  Layers
} from 'lucide-react';
import { Employee, Department, PayBand, PaginatedResponse } from '../types';
import { cn, getInitials } from '../lib/utils';

interface EmployeesViewProps {
  data: PaginatedResponse<Employee> | null;
  departments: Department[];
  payBands: PayBand[];
  search: string;
  setSearch: (val: string) => void;
  selectedDept: string;
  setSelectedDept: (val: string) => void;
  selectedCountry: string;
  setSelectedCountry: (val: string) => void;
  selectedBand: string;
  setSelectedBand: (val: string) => void;
  selectedStatus: string;
  setSelectedStatus: (val: string) => void;
  sortBy: string;
  setSortBy: (val: string) => void;
  sortOrder: 'asc' | 'desc';
  setSortOrder: (val: 'asc' | 'desc') => void;
  page: number;
  setPage: (p: number) => void;
  limit: number;
  setLimit: (l: number) => void;
  onSelectEmployee: (emp: Employee) => void;
  onOpenAddModal: () => void;
  onOpenSalaryChange: (emp: Employee) => void;
  onOpenHistory?: (emp: Employee) => void;
  isLoading: boolean;
}

export const EmployeesView: React.FC<EmployeesViewProps> = ({
  data,
  departments,
  payBands,
  search,
  setSearch,
  selectedDept,
  setSelectedDept,
  selectedCountry,
  setSelectedCountry,
  selectedBand,
  setSelectedBand,
  selectedStatus,
  setSelectedStatus,
  sortBy,
  setSortBy,
  sortOrder,
  setSortOrder,
  page,
  setPage,
  limit,
  setLimit,
  onSelectEmployee,
  onOpenAddModal,
  onOpenSalaryChange,
  onOpenHistory,
  isLoading
}) => {
  const [viewMode, setViewMode] = useState<'table' | 'cards'>(() => {
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      return 'cards';
    }
    return 'table';
  });

  const employees = data?.data || [];
  const total = data?.pagination?.total || 0;
  const totalPages = data?.pagination?.total_pages || 1;

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  return (
    <div className="space-y-4 sm:space-y-5 pb-12">
      {/* Minimal Top Header Card */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white px-4 py-3 sm:px-5 sm:py-3.5 rounded-xl border border-slate-200/80 shadow-2xs">
        <div className="min-w-0">
          <h1 className="text-base sm:text-lg font-bold tracking-tight text-slate-900 truncate">
            Employee Directory
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {total.toLocaleString()} Active Profiles &bull; Multi-Country Base Salaries & Band Alignment
          </p>
        </div>

        <div className="flex items-center gap-2 self-stretch sm:self-auto justify-between sm:justify-end">
          {/* View Mode Toggle */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200">
            <button
              onClick={() => setViewMode('table')}
              className={cn(
                "p-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1 min-h-[34px] min-w-[34px] justify-center",
                viewMode === 'table' ? "bg-white text-slate-900 shadow-2xs font-bold" : "text-slate-500 hover:text-slate-900"
              )}
              title="Table View"
              aria-label="Table View"
            >
              <List className="w-3.5 h-3.5" />
              <span className="hidden xs:inline text-xs">Table</span>
            </button>
            <button
              onClick={() => setViewMode('cards')}
              className={cn(
                "p-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1 min-h-[34px] min-w-[34px] justify-center",
                viewMode === 'cards' ? "bg-white text-slate-900 shadow-2xs font-bold" : "text-slate-500 hover:text-slate-900"
              )}
              title="Cards View"
              aria-label="Cards View"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span className="hidden xs:inline text-xs">Cards</span>
            </button>
          </div>

          {/* Add Employee */}
          <button
            onClick={onOpenAddModal}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold transition shadow-2xs min-h-[38px] sm:min-h-0 active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Employee</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
          {/* Search Box */}
          <div className="relative lg:col-span-2">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by name, code, email, title..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition min-h-[44px]"
            />
          </div>

          {/* Country Filter */}
          <div className="relative">
            <select
              value={selectedCountry}
              onChange={(e) => {
                setSelectedCountry(e.target.value);
                setPage(1);
              }}
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition cursor-pointer appearance-none min-h-[44px]"
            >
              <option value="">All Countries</option>
              <option value="IN">🇮🇳 India (69% workforce)</option>
              <option value="US">🇺🇸 United States (31% workforce)</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Department Filter */}
          <div className="relative">
            <select
              value={selectedDept}
              onChange={(e) => {
                setSelectedDept(e.target.value);
                setPage(1);
              }}
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition cursor-pointer appearance-none min-h-[44px]"
            >
              <option value="">All Departments</option>
              {departments.map((d) => (
                <option key={d.id} value={String(d.id)}>
                  {d.name}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Pay Band Filter */}
          <div className="relative">
            <select
              value={selectedBand}
              onChange={(e) => {
                setSelectedBand(e.target.value);
                setPage(1);
              }}
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition cursor-pointer appearance-none min-h-[44px]"
            >
              <option value="">All Pay Bands</option>
              {payBands.map((b) => (
                <option key={b.id} value={String(b.id)}>
                  {b.name}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Active Filter Chips & Clear */}
        {(search || selectedCountry || selectedDept || selectedBand || selectedStatus !== 'all') && (
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 text-xs">
            <span className="text-[11px] font-bold text-slate-400">Active filters:</span>
            {search && (
              <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 flex items-center gap-1 font-semibold">
                Search: "{search}"
                <button onClick={() => setSearch('')} className="hover:text-slate-900">×</button>
              </span>
            )}
            {selectedCountry && (
              <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 flex items-center gap-1 font-semibold">
                Country: {selectedCountry}
                <button onClick={() => setSelectedCountry('')} className="hover:text-blue-900">×</button>
              </span>
            )}
            {selectedDept && (
              <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 flex items-center gap-1 font-semibold">
                Dept: {departments.find(d => String(d.id) === selectedDept)?.name}
                <button onClick={() => setSelectedDept('')} className="hover:text-blue-900">×</button>
              </span>
            )}
            {selectedBand && (
              <span className="px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 flex items-center gap-1 font-semibold">
                Band: {payBands.find(b => String(b.id) === selectedBand)?.name}
                <button onClick={() => setSelectedBand('')} className="hover:text-purple-900">×</button>
              </span>
            )}
            <button
              onClick={() => {
                setSearch('');
                setSelectedCountry('');
                setSelectedDept('');
                setSelectedBand('');
                setSelectedStatus('all');
                setPage(1);
              }}
              className="text-xs font-bold text-blue-600 hover:text-blue-800 ml-auto"
            >
              Reset All Filters
            </button>
          </div>
        )}
      </div>

      {/* Main Content: Table or Cards */}
      {viewMode === 'table' ? (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/70 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3.5 px-4 cursor-pointer" onClick={() => handleSort('employee_code')}>
                    <div className="flex items-center gap-1">
                      <span>Employee</span>
                      <ArrowUpDown className="w-3 h-3 text-slate-400" />
                    </div>
                  </th>
                  <th className="py-3.5 px-3">Department</th>
                  <th className="py-3.5 px-3">Role Title</th>
                  <th className="py-3.5 px-3">Country</th>
                  <th className="py-3.5 px-3">Currency</th>
                  <th className="py-3.5 px-3 text-right cursor-pointer" onClick={() => handleSort('current_salary')}>
                    <div className="flex items-center justify-end gap-1">
                      <span>Annual Base Salary</span>
                      <ArrowUpDown className="w-3 h-3 text-slate-400" />
                    </div>
                  </th>
                  <th className="py-3.5 px-3 text-right">USD Equiv.</th>
                  <th className="py-3.5 px-3">Pay Band</th>
                  <th className="py-3.5 px-3">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {isLoading ? (
                  [...Array(limit)].map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td colSpan={10} className="py-4 px-4">
                        <div className="h-5 bg-slate-100 rounded w-full" />
                      </td>
                    </tr>
                  ))
                ) : employees.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="py-12 text-center text-slate-400 text-xs">
                      No employees found matching the filter criteria.
                    </td>
                  </tr>
                ) : (
                  employees.map((emp) => {
                    const isIndia = emp.country_code === 'IN';
                    const currencySymbol = isIndia ? '₹' : '$';
                    const usdEquivalent = isIndia
                      ? Math.round((emp.current_salary || 0) * 0.012)
                      : (emp.current_salary || 0);

                    return (
                      <tr
                        key={emp.id}
                        className="hover:bg-blue-50/40 transition group cursor-default"
                      >
                        {/* Employee Code & Name */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-700 font-bold flex items-center justify-center text-xs shrink-0 border border-blue-100">
                              {getInitials(emp.first_name, emp.last_name)}
                            </div>
                            <div className="min-w-0">
                              <div
                                onClick={() => onSelectEmployee(emp)}
                                className="font-bold text-slate-900 hover:text-blue-600 cursor-pointer transition truncate flex items-center gap-1.5"
                              >
                                <span>{emp.first_name} {emp.last_name}</span>
                                <span className="font-mono text-[10px] text-slate-400">({emp.employee_code})</span>
                              </div>
                              <div className="text-[11px] text-slate-400 truncate">{emp.email}</div>
                            </div>
                          </div>
                        </td>

                        {/* Department */}
                        <td className="py-3.5 px-3 font-semibold text-slate-700 whitespace-nowrap">
                          {emp.department_name}
                        </td>

                        {/* Role Title */}
                        <td className="py-3.5 px-3 text-slate-600 whitespace-nowrap">
                          {emp.role_title}
                        </td>

                        {/* Country */}
                        <td className="py-3.5 px-3 whitespace-nowrap">
                          <span className="inline-flex items-center gap-1 font-semibold text-slate-800">
                            <span>{isIndia ? '🇮🇳' : '🇺🇸'}</span>
                            <span>{isIndia ? 'India' : 'United States'}</span>
                          </span>
                        </td>

                        {/* Currency */}
                        <td className="py-3.5 px-3 whitespace-nowrap">
                          <span className="font-mono font-bold text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded text-[11px]">
                            {emp.currency_code}
                          </span>
                        </td>

                        {/* Annual Base Salary (Local Currency) */}
                        <td className="py-3.5 px-3 text-right whitespace-nowrap font-black font-mono text-slate-900">
                          {currencySymbol}{emp.current_salary?.toLocaleString()}
                        </td>

                        {/* USD Equivalent */}
                        <td className="py-3.5 px-3 text-right whitespace-nowrap font-bold font-mono text-slate-500">
                          ${usdEquivalent.toLocaleString()}
                        </td>

                        {/* Pay Band */}
                        <td className="py-3.5 px-3 whitespace-nowrap">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-100">
                            {emp.pay_band_name || 'L3 - Senior'}
                          </span>
                        </td>

                        {/* Status */}
                        <td className="py-3.5 px-3 whitespace-nowrap">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            Active
                          </span>
                        </td>

                        {/* Row Actions */}
                        <td className="py-3.5 px-4 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1.5">
                            {/* History Button */}
                            {onOpenHistory && (
                              <button
                                onClick={() => onOpenHistory(emp)}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
                                title="View Compensation Audit History"
                              >
                                <History className="w-4 h-4" />
                              </button>
                            )}

                            {/* Edit Salary Button */}
                            <button
                              onClick={() => onOpenSalaryChange(emp)}
                              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-600 text-blue-700 hover:text-white text-xs font-bold transition shadow-2xs"
                              title="Edit Base Salary"
                            >
                              <Pencil className="w-3.5 h-3.5" />
                              <span>Edit Salary</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Cards View - dynamically arranged per screen size */
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
          {employees.map((emp) => {
            const isIndia = emp.country_code === 'IN';
            const currencySymbol = isIndia ? '₹' : '$';
            const usdEquivalent = isIndia
              ? Math.round((emp.current_salary || 0) * 0.012)
              : (emp.current_salary || 0);

            return (
              <div
                key={emp.id}
                className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-blue-300 transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-700 font-bold flex items-center justify-center text-xs border border-blue-100">
                        {getInitials(emp.first_name, emp.last_name)}
                      </div>
                      <div>
                        <div
                          onClick={() => onSelectEmployee(emp)}
                          className="text-sm font-bold text-slate-900 hover:text-blue-600 cursor-pointer"
                        >
                          {emp.first_name} {emp.last_name}
                        </div>
                        <span className="text-[11px] text-slate-400 font-mono">{emp.employee_code}</span>
                      </div>
                    </div>
                    <span className="text-sm">{isIndia ? '🇮🇳' : '🇺🇸'}</span>
                  </div>

                  <div className="mt-3 pt-3 border-t border-slate-100 space-y-1.5 text-xs">
                    <div className="flex items-center justify-between text-slate-600">
                      <span>Role:</span>
                      <span className="font-semibold text-slate-900 truncate max-w-[160px]">{emp.role_title}</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-600">
                      <span>Department:</span>
                      <span className="font-semibold text-slate-900">{emp.department_name}</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-600">
                      <span>Pay Band:</span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-50 text-purple-700">
                        {emp.pay_band_name || 'L3 - Senior'}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 p-3 bg-slate-50 rounded-xl border border-slate-200/60 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Base Salary</span>
                      <span className="text-base font-black text-slate-900 font-mono">
                        {currencySymbol}{emp.current_salary?.toLocaleString()}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">USD Equiv.</span>
                      <span className="text-xs font-bold text-slate-600 font-mono">
                        ${usdEquivalent.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  {onOpenHistory && (
                    <button
                      onClick={() => onOpenHistory(emp)}
                      className="px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-100 transition flex items-center gap-1.5 min-h-[44px] active:scale-95"
                    >
                      <History className="w-3.5 h-3.5 text-slate-500" />
                      <span>Audit</span>
                    </button>
                  )}
                  <button
                    onClick={() => onOpenSalaryChange(emp)}
                    className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition shadow-xs min-h-[44px] active:scale-95"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                    <span>Edit Salary</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200/80 shadow-xs text-xs">
        <div className="flex flex-wrap items-center justify-between sm:justify-start gap-2 sm:gap-3 text-slate-500">
          <span>
            Showing <strong className="text-slate-800 font-bold">{Math.min(total, (page - 1) * limit + 1)}</strong> to{' '}
            <strong className="text-slate-800 font-bold">{Math.min(total, page * limit)}</strong> of{' '}
            <strong className="text-slate-800 font-bold">{total.toLocaleString()}</strong> profiles
          </span>

          <div className="flex items-center gap-1.5 ml-auto sm:ml-2">
            <span className="text-slate-400">Rows:</span>
            <select
              value={limit}
              onChange={(e) => {
                setLimit(Number(e.target.value));
                setPage(1);
              }}
              className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 font-bold text-slate-800 cursor-pointer min-h-[36px]"
            >
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
          <button
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page <= 1}
            className={cn(
              "px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-bold transition flex items-center justify-center gap-1 min-h-[44px] flex-1 sm:flex-initial",
              page <= 1
                ? "text-slate-300 border-slate-100 cursor-not-allowed"
                : "text-slate-700 hover:bg-slate-100 active:scale-95"
            )}
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Prev</span>
          </button>

          <span className="px-3 py-2 bg-slate-50 rounded-xl font-bold text-slate-800 border border-slate-200 min-h-[44px] flex items-center justify-center text-center">
            {page} / {Math.max(1, totalPages)}
          </span>

          <button
            onClick={() => setPage(Math.min(totalPages, page + 1))}
            disabled={page >= totalPages}
            className={cn(
              "px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-bold transition flex items-center justify-center gap-1 min-h-[44px] flex-1 sm:flex-initial",
              page >= totalPages
                ? "text-slate-300 border-slate-100 cursor-not-allowed"
                : "text-slate-700 hover:bg-slate-100 active:scale-95"
            )}
          >
            <span>Next</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
