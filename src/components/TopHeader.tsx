import React, { useState, useRef, useEffect } from 'react';
import {
  Bell,
  Menu,
  ChevronDown,
  LayoutDashboard,
  Users,
  BarChart3,
  Settings,
  BookOpen,
  LogOut,
  ShieldCheck,
  User as UserIcon
} from 'lucide-react';
import { DateRangeFilter } from '../types';
import { TabType } from './Sidebar';
import { useAuth } from '../context/AuthContext';

interface TopHeaderProps {
  onOpenAddModal: () => void;
  onReseed?: () => void;
  employeeCount?: number;
  isReseeding?: boolean;
  onToggleMobileMenu?: () => void;
  selectedDateRange?: DateRangeFilter;
  onDateRangeChange?: (range: DateRangeFilter) => void;
  onOpenNotifications: () => void;
  unreadNotificationsCount: number;
  userRole?: 'hr.global' | 'hr.india' | 'employee';
  onOpenLoginModal?: () => void;
  onSwitchRole?: (role: 'hr.global' | 'hr.india' | 'employee') => void;
  isSidebarCollapsed?: boolean;
  onToggleSidebarCollapse?: () => void;
  activeTab?: TabType;
}

const TAB_TITLES: Record<TabType, { title: string; subtitle: string; icon: React.ComponentType<{ className?: string }> }> = {
  dashboard: {
    title: 'Compensation Dashboard',
    subtitle: 'Global headcount and wage metrics',
    icon: LayoutDashboard
  },
  employees: {
    title: 'Employee Directory',
    subtitle: 'Base salaries and band alignments',
    icon: Users
  },
  insights: {
    title: 'Compensation Insights',
    subtitle: 'Analytical distributions and parity',
    icon: BarChart3
  },
  settings: {
    title: 'Compensation Policies',
    subtitle: 'Multi-entity merit rules & guardrails',
    icon: Settings
  },
  about: {
    title: 'About & System Dossier',
    subtitle: 'Development approach, test suite & engineering artifacts',
    icon: BookOpen
  }
};

export const TopHeader: React.FC<TopHeaderProps> = ({
  onOpenAddModal,
  onReseed,
  employeeCount,
  isReseeding,
  onToggleMobileMenu,
  selectedDateRange,
  onDateRangeChange,
  onOpenNotifications,
  unreadNotificationsCount,
  userRole = 'hr.global',
  onOpenLoginModal,
  onSwitchRole,
  isSidebarCollapsed = false,
  onToggleSidebarCollapse,
  activeTab = 'dashboard'
}) => {
  const currentTabInfo = TAB_TITLES[activeTab] || TAB_TITLES.dashboard;
  const TabIcon = currentTabInfo.icon;
  const { user, logout } = useAuth();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close user dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsUserMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    setIsUserMenuOpen(false);
    await logout();
  };

  const displayName = user?.full_name || 'ACME HR Manager';
  const displayRole = user?.role === 'HR_MANAGER' ? 'HR Manager' : (user?.role || 'HR Manager');

  return (
    <header className="h-14 sm:h-16 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-3 sm:px-6 flex items-center justify-between sticky top-0 z-30 gap-2 select-none">
      {/* Left Area: Mobile Menu Toggle + Current View Title */}
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        {/* Mobile menu trigger */}
        <button
          onClick={onToggleMobileMenu}
          className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition flex items-center justify-center min-h-[44px] min-w-[44px] shrink-0 active:scale-95 cursor-pointer"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Current View Title */}
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center shrink-0 border border-slate-200/80">
            <TabIcon className="w-4 h-4 text-blue-600" />
          </div>
          <div className="min-w-0">
            <h1 className="text-sm sm:text-base font-extrabold tracking-tight text-slate-900 truncate">
              {currentTabInfo.title}
            </h1>
            <p className="text-[10px] sm:text-[11px] text-slate-400 font-medium truncate hidden xs:block">
              {currentTabInfo.subtitle}
            </p>
          </div>
        </div>
      </div>

      {/* Right Controls & User Identity */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* Organization Scope Badge (Kept separate from user identity) */}
        <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200 text-[11px] text-slate-600 font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>Global Scope</span>
          <span className="text-slate-400">•</span>
          <span className="text-slate-500">IN 69% / US 31%</span>
        </div>

        {/* Notifications Button */}
        <button
          onClick={onOpenNotifications}
          className="relative min-h-[40px] min-w-[40px] rounded-xl border border-slate-200 hover:bg-slate-50 flex items-center justify-center text-slate-600 transition shrink-0 bg-white shadow-2xs active:scale-95 cursor-pointer"
          aria-label="Open notifications"
          title="Open notifications"
        >
          <Bell className="w-4 h-4" />
          {unreadNotificationsCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-rose-500 text-white rounded-full text-[10px] font-extrabold flex items-center justify-center border-2 border-white animate-pulse">
              {unreadNotificationsCount}
            </span>
          )}
        </button>

        {/* User Identity & Menu Dropdown */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            className="flex items-center gap-2.5 px-2.5 sm:px-3 py-1.5 rounded-xl border border-slate-200 hover:border-blue-300 bg-slate-50 hover:bg-blue-50/40 transition text-left min-h-[40px] active:scale-95 cursor-pointer"
            title="User Profile & Settings"
          >
            <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-2xs shrink-0">
              <ShieldCheck className="w-4 h-4 text-white" />
            </div>
            <div className="hidden sm:block text-left">
              <div className="flex items-center gap-1">
                <span className="text-xs font-bold text-slate-800 leading-tight">
                  {displayName}
                </span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </div>
              <p className="text-[10px] text-blue-600 font-semibold leading-tight">
                {displayRole}
              </p>
            </div>
          </button>

          {/* User Menu Dropdown */}
          {isUserMenuOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              {/* User Identity Details */}
              <div className="px-4 py-2.5 border-b border-slate-100">
                <div className="text-xs font-bold text-slate-900">{displayName}</div>
                <div className="text-[11px] text-slate-500 truncate mt-0.5">{user?.email || 'hrmanager@acme.org'}</div>
                <div className="mt-2 flex items-center gap-1.5">
                  <span className="text-[10px] font-bold px-2 py-0.5 bg-blue-50 text-blue-700 rounded border border-blue-200">
                    Role: {user?.role || 'HR_MANAGER'}
                  </span>
                  <span className="text-[10px] text-emerald-600 font-medium flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    Active Session
                  </span>
                </div>
              </div>

              {/* Security info */}
              <div className="px-4 py-2 text-[10px] text-slate-400 bg-slate-50/60 border-b border-slate-100">
                <span>Session: HTTP-only cookie • Argon2/Bcrypt hash</span>
              </div>

              {/* Logout button */}
              <div className="p-1">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer text-left"
                >
                  <LogOut className="w-3.5 h-3.5 text-rose-500" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
