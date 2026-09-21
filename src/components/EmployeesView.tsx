import React, { useState } from 'react';
import {
  Search,
  Filter,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  UserCheck,
  UserX,
  History,
  Trash2,
  Plus,
  DollarSign,
  Pencil,
  LayoutGrid,
  List,
  SlidersHorizontal,
  X,
  Building,
  Briefcase,
  Layers,
  Globe
} from 'lucide-react';
import { Employee, Department, PayBand, PaginatedResponse } from '../types';
import { formatCurrency, cn, getInitials } from '../lib/utils';

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
  onSoftDelete: (emp: Employee) => void;
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
  onSoftDelete,
  isLoading
}) => {
  const [showFiltersMobile, setShowFiltersMobile] = useState(false);
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('table');

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

  const countries = [
    { code: 'US', name: '🇺🇸 United States (69% • USD)' },
    { code: 'IN', name: '🇮🇳 India (31% • INR)' }
  ];

  const activeFilterCount = [
    Boolean(selectedDept),
    Boolean(selectedCountry),
    Boolean(selectedBand),
    selectedStatus !== 'all',
    Boolean(search.trim())
  ].filter(Boolean).length;

  const handleResetFilters = () => {
    setSearch('');
    setSelectedDept('');
    setSelectedCountry('');
    setSelectedBand('');
    setSelectedStatus('all');
    setPage(1);
  };

  return (
    <div className="space-y-4 sm:space-y-5 pb-16 lg:pb-12">
      {/* Header and Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">Employee Directory</h2>
            <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-100">
              {total.toLocaleString()}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage salary records, bands, and organizational profiles across global offices.
          </p>
        </div>

        <div className="flex items-center gap-2 self-stretch sm:self-auto">
          {/* View mode toggle button: List on left, Grid on right */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl gap-1 shrink-0 border border-slate-200/80">
            <button
              type="button"
              onClick={() => setViewMode('table')}
              className={cn(
                "p-2 rounded-lg text-xs font-semibold transition min-h-[38px] min-w-[38px] flex items-center justify-center cursor-pointer",
                viewMode === 'table'
                  ? "bg-white text-blue-600 shadow-sm border border-slate-200/70 font-bold"
                  : "text-slate-500 hover:text-slate-800 hover:bg-slate-200/50"
              )}
              title="List view"
              aria-label="List view"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('cards')}
              className={cn(
                "p-2 rounded-lg text-xs font-semibold transition min-h-[38px] min-w-[38px] flex items-center justify-center cursor-pointer",
                viewMode === 'cards'
                  ? "bg-white text-blue-600 shadow-sm border border-slate-200/70 font-bold"
                  : "text-slate-500 hover:text-slate-800 hover:bg-slate-200/50"
              )}
              title="Grid view"
              aria-label="Grid view"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={onOpenAddModal}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition min-h-[44px]"
          >
            <Plus className="w-4 h-4 shrink-0" />
            <span>Add Employee</span>
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
        {/* Mobile Filter Toggle Header */}
        <div className="flex items-center justify-between gap-2 sm:hidden">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search employee..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full h-11 pl-10 pr-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
            />
          </div>

          <button
            onClick={() => setShowFiltersMobile(!showFiltersMobile)}
            className={cn(
              "px-3.5 h-11 rounded-xl text-xs font-semibold border flex items-center gap-1.5 transition shrink-0",
              showFiltersMobile || activeFilterCount > 0
                ? "bg-blue-50 border-blue-300 text-blue-700"
                : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
            )}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Filters</span>
            {activeFilterCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center ml-0.5">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>

        {/* Collapsible Filter Section on Mobile / Always visible on Desktop */}
        <div className={cn(
          "space-y-3 transition-all",
          showFiltersMobile ? "block" : "hidden sm:block"
        )}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5 sm:gap-3">
            {/* Search by Name or Code (Hidden on mobile inside dropdown since it's above) */}
            <div className="relative hidden sm:block w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Search name, code, role..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="w-full h-11 pl-10 pr-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
              />
            </div>

            {/* Department Filter */}
            <div className="relative w-full">
              <select
                value={selectedDept}
                onChange={(e) => {
                  setSelectedDept(e.target.value);
                  setPage(1);
                }}
                className="w-full h-11 pl-3.5 pr-9 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 appearance-none cursor-pointer transition truncate"
              >
                <option value="">All Departments</option>
                {departments.map((d) => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Country Filter */}
            <div className="relative w-full">
              <select
                value={selectedCountry}
                onChange={(e) => {
                  setSelectedCountry(e.target.value);
                  setPage(1);
                }}
                className="w-full h-11 pl-3.5 pr-9 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 appearance-none cursor-pointer transition truncate"
              >
                <option value="">All Countries</option>
                {countries.map((c) => (
                  <option key={c.code} value={c.code}>{c.name}</option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Pay Band Filter */}
            <div className="relative w-full">
              <select
                value={selectedBand}
                onChange={(e) => {
                  setSelectedBand(e.target.value);
                  setPage(1);
                }}
                className="w-full h-11 pl-3.5 pr-9 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 appearance-none cursor-pointer transition truncate"
              >
                <option value="">All Pay Bands</option>
                {payBands.map((b) => (
                  <option key={b.id} value={b.id}>{b.name}</option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Status Filter */}
            <div className="relative w-full">
              <select
                value={selectedStatus}
                onChange={(e) => {
                  setSelectedStatus(e.target.value);
                  setPage(1);
                }}
                className="w-full h-11 pl-3.5 pr-9 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 appearance-none cursor-pointer transition truncate"
              >
                <option value="all">All Statuses</option>
                <option value="active">Active Only</option>
                <option value="inactive">Inactive (Soft-Deleted)</option>
              </select>
              <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Filter Badges / Active Counts & Per Page */}
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 pt-1 border-t border-slate-100">
          <div className="flex items-center gap-2 flex-wrap">
            <span>Showing <b>{employees.length}</b> of <b>{total.toLocaleString()}</b></span>
            {activeFilterCount > 0 && (
              <button
                onClick={handleResetFilters}
                className="text-blue-600 hover:text-blue-700 font-bold underline underline-offset-2 flex items-center gap-1 py-1"
              >
                <X className="w-3 h-3" />
                Reset Filters ({activeFilterCount})
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <span>Rows:</span>
            <select
              value={limit}
              onChange={(e) => {
                setLimit(Number(e.target.value));
                setPage(1);
              }}
              className="py-1 px-2 border border-slate-200 rounded-lg text-xs bg-slate-50 min-h-[34px]"
            >
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
          </div>
        </div>
      </div>

      {/* 1. GRID / CARDS VIEW */}
      <div className={cn(
        viewMode === 'cards' ? "block" : "hidden"
      )}>
        {isLoading ? (
          <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center text-slate-400">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-2"></div>
            <p className="text-xs font-semibold">Loading employees...</p>
          </div>
        ) : employees.length === 0 ? (
          <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center text-slate-500">
            <p className="text-sm font-semibold">No employees found.</p>
            <p className="text-xs text-slate-400 mt-1">Try changing or resetting your search filters.</p>
            {activeFilterCount > 0 && (
              <button
                onClick={handleResetFilters}
                className="mt-3 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-600 text-xs font-semibold"
              >
                Reset all filters
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3.5 sm:gap-4">
            {employees.map((emp) => (
              <div
                key={emp.id}
                className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-3.5 hover:border-blue-200 hover:shadow-xs transition flex flex-col justify-between"
              >
                {/* Card Top: Avatar, Name, Code, Status */}
                <div className="flex items-start justify-between gap-3">
                  <div
                    onClick={() => onSelectEmployee(emp)}
                    className="flex items-center gap-3 cursor-pointer flex-1 min-w-0"
                  >
                    <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm shrink-0 shadow-2xs">
                      {getInitials(emp.first_name, emp.last_name)}
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-slate-900 text-sm truncate leading-tight">
                        {emp.first_name} {emp.last_name}
                      </p>
                      <p className="text-xs text-slate-400 truncate mt-0.5">{emp.email}</p>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-1.5 shrink-0">
                    <span className="font-mono text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100">
                      {emp.employee_code}
                    </span>
                    {emp.employment_status === 'active' ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <UserCheck className="w-3 h-3 text-emerald-600" />
                        Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200">
                        <UserX className="w-3 h-3 text-slate-400" />
                        Inactive
                      </span>
                    )}
                  </div>
                </div>

                {/* Card Mid: Role, Dept, Band, Country */}
                <div className="grid grid-cols-2 gap-2 p-3 bg-slate-50/80 rounded-xl text-xs border border-slate-100">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Department & Role</span>
                    <p className="font-bold text-slate-800 truncate mt-0.5">{emp.role_title}</p>
                    <p className="text-[11px] text-slate-500 truncate">{emp.department_name}</p>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Location & Band</span>
                    <p className="font-bold text-slate-800 mt-0.5">{emp.country_code} ({emp.currency_code})</p>
                    <p className="text-[11px] text-slate-500 truncate">{emp.pay_band_name || 'L3 - Mid'}</p>
                  </div>
                </div>

                {/* Card Bottom: Salary highlight & Quick action buttons */}
                <div className="flex items-end justify-between pt-2 border-t border-slate-100 gap-2">
                  <div className="min-w-0 flex-1">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Current Salary</span>
                    <p className="text-base font-extrabold text-slate-900 leading-tight mt-0.5 truncate">
                      {emp.current_salary ? formatCurrency(emp.current_salary, emp.currency_code) : '—'}
                    </p>
                    {emp.currency_code !== 'USD' && emp.current_salary_usd && (
                      <p className="text-[11px] font-medium text-slate-400 truncate">
                        ≈ ${emp.current_salary_usd.toLocaleString()} USD
                      </p>
                    )}
                  </div>

                  {/* 3 Touch Buttons */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => onSelectEmployee(emp)}
                      title="View Profile"
                      className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 flex items-center justify-center h-9 w-9 shadow-2xs"
                      aria-label="View employee profile"
                    >
                      <History className="w-4 h-4 text-blue-600" />
                    </button>

                    <button
                      onClick={() => onOpenSalaryChange(emp)}
                      title="Edit Salary"
                      className="p-2 rounded-xl border border-indigo-200 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 flex items-center justify-center h-9 w-9 shadow-2xs font-bold transition-colors"
                      aria-label="Edit employee salary"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => onSoftDelete(emp)}
                      disabled={emp.employment_status !== 'active'}
                      title="Soft Delete"
                      className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-rose-50 text-slate-400 hover:text-rose-600 flex items-center justify-center h-9 w-9 shadow-2xs disabled:opacity-30"
                      aria-label="Soft delete employee"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 2. TABLE / LIST VIEW */}
      <div className={cn(
        "bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden",
        viewMode === 'table' ? "block" : "hidden"
      )}>
        <div className="overflow-x-auto min-h-[380px]">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-semibold uppercase text-[11px] border-b border-slate-200">
              <tr>
                <th
                  onClick={() => handleSort('code')}
                  className="py-3 px-4 cursor-pointer hover:text-slate-800 transition select-none"
                >
                  <div className="flex items-center gap-1">
                    <span>Code</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('name')}
                  className="py-3 px-4 cursor-pointer hover:text-slate-800 transition select-none"
                >
                  <div className="flex items-center gap-1">
                    <span>Employee</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('department')}
                  className="py-3 px-4 cursor-pointer hover:text-slate-800 transition select-none"
                >
                  <div className="flex items-center gap-1">
                    <span>Department</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="py-3 px-4">Pay Band</th>
                <th className="py-3 px-4">Country & Currency</th>
                <th
                  onClick={() => handleSort('salary')}
                  className="py-3 px-4 cursor-pointer hover:text-slate-800 transition select-none"
                >
                  <div className="flex items-center gap-1">
                    <span>Current Salary</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="py-3 px-4">Status</th>
                <th
                  onClick={() => handleSort('hire_date')}
                  className="py-3 px-4 cursor-pointer hover:text-slate-800 transition select-none"
                >
                  <div className="flex items-center gap-1">
                    <span>Hire Date</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {isLoading ? (
                <tr>
                  <td colSpan={9} className="py-16 text-center text-slate-400">
                    <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mb-2"></div>
                    <p>Loading employee data...</p>
                  </td>
                </tr>
              ) : employees.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-16 text-center text-slate-400">
                    <p className="text-sm font-semibold text-slate-600">No employees match your filter criteria.</p>
                    <p className="text-xs mt-1">Try clearing your search query or department/country filters.</p>
                  </td>
                </tr>
              ) : (
                employees.map((emp) => (
                  <tr
                    key={emp.id}
                    onClick={() => onSelectEmployee(emp)}
                    className="hover:bg-slate-50/80 cursor-pointer transition"
                  >
                    <td className="py-3.5 px-4 font-mono font-bold text-blue-600">
                      {emp.employee_code}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-xs shrink-0">
                          {getInitials(emp.first_name, emp.last_name)}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 leading-tight">
                            {emp.first_name} {emp.last_name}
                          </p>
                          <p className="text-[11px] text-slate-400">{emp.email}</p>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <p className="font-medium text-slate-800">{emp.department_name}</p>
                      <p className="text-[11px] text-slate-400">{emp.role_title}</p>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-medium text-[11px]">
                        {emp.pay_band_name || 'L3 - Mid-Level'}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-slate-800">{emp.country_code}</span>
                        <span className="text-slate-400">·</span>
                        <span className="text-slate-500">{emp.currency_code}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <p className="font-bold text-slate-900">
                        {emp.current_salary ? formatCurrency(emp.current_salary, emp.currency_code) : '—'}
                      </p>
                      {emp.currency_code !== 'USD' && emp.current_salary_usd && (
                        <p className="text-[11px] text-slate-400">
                          ≈ ${emp.current_salary_usd.toLocaleString()} USD
                        </p>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      {emp.employment_status === 'active' ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <UserCheck className="w-3 h-3 text-emerald-600" />
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-600 border border-slate-200">
                          <UserX className="w-3 h-3 text-slate-400" />
                          Inactive
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-slate-500">
                      {emp.hire_date}
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center gap-1" onClick={(e) => e.stopPropagation()}>
                        <button
                          title="View Salary History & Profile"
                          onClick={() => onSelectEmployee(emp)}
                          className="p-2 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition min-h-[36px] min-w-[36px] flex items-center justify-center"
                        >
                          <History className="w-4 h-4" />
                        </button>
                        <button
                          title="Edit Salary"
                          onClick={() => onOpenSalaryChange(emp)}
                          className="p-2 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition min-h-[36px] min-w-[36px] flex items-center justify-center"
                          aria-label="Edit employee salary"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          title={emp.employment_status === 'active' ? "Soft Delete" : "Already Inactive"}
                          disabled={emp.employment_status !== 'active'}
                          onClick={() => onSoftDelete(emp)}
                          className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition disabled:opacity-30 min-h-[36px] min-w-[36px] flex items-center justify-center"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination Toolbar (Touch optimized min 44px height) */}
      <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600">
        <div className="flex items-center gap-2">
          <span>Page <b>{page}</b> of <b>{totalPages}</b> ({total.toLocaleString()} records)</span>
        </div>

        <div className="flex items-center gap-1.5 flex-wrap justify-center">
          <button
            disabled={page <= 1}
            onClick={() => setPage(page - 1)}
            className="px-3.5 py-2.5 rounded-xl border border-slate-200 flex items-center gap-1 hover:bg-slate-50 disabled:opacity-40 transition font-bold min-h-[44px] min-w-[44px]"
            aria-label="Previous page"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden xs:inline">Prev</span>
          </button>

          {/* Quick page buttons on larger screens, compact selector on small screens */}
          <div className="hidden sm:flex items-center gap-1">
            <button
              onClick={() => setPage(1)}
              className={cn(
                "w-10 h-10 rounded-xl font-bold flex items-center justify-center transition min-h-[40px] min-w-[40px]",
                page === 1 ? "bg-blue-600 text-white shadow-xs" : "border border-slate-200 hover:bg-slate-50"
              )}
            >
              1
            </button>

            {page > 3 && <span className="px-1 text-slate-400">...</span>}

            {page > 1 && page < totalPages && (
              <button
                className="w-10 h-10 rounded-xl font-bold flex items-center justify-center bg-blue-600 text-white shadow-xs min-h-[40px] min-w-[40px]"
              >
                {page}
              </button>
            )}

            {page < totalPages - 2 && <span className="px-1 text-slate-400">...</span>}

            {totalPages > 1 && (
              <button
                onClick={() => setPage(totalPages)}
                className={cn(
                  "w-10 h-10 rounded-xl font-bold flex items-center justify-center transition min-h-[40px] min-w-[40px]",
                  page === totalPages ? "bg-blue-600 text-white shadow-xs" : "border border-slate-200 hover:bg-slate-50"
                )}
              >
                {totalPages}
              </button>
            )}
          </div>

          {/* Mobile direct page jump */}
          <div className="flex sm:hidden items-center gap-1">
            <select
              value={page}
              onChange={(e) => setPage(Number(e.target.value))}
              className="py-2 px-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 min-h-[44px]"
              aria-label="Select page"
            >
              {Array.from({ length: Math.min(totalPages, 50) }, (_, i) => i + 1).map((p) => (
                <option key={p} value={p}>Page {p}</option>
              ))}
              {totalPages > 50 && (
                <option value={totalPages}>Page {totalPages}</option>
              )}
            </select>
          </div>

          <button
            disabled={page >= totalPages}
            onClick={() => setPage(page + 1)}
            className="px-3.5 py-2.5 rounded-xl border border-slate-200 flex items-center gap-1 hover:bg-slate-50 disabled:opacity-40 transition font-bold min-h-[44px] min-w-[44px]"
            aria-label="Next page"
          >
            <span className="hidden xs:inline">Next</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
