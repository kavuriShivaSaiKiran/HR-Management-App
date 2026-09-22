import React from 'react';
import {
  Bell,
  Menu,
  ChevronDown,
  LayoutDashboard,
  Users,
  BarChart3,
  Settings
} from 'lucide-react';
import { DateRangeFilter } from '../types';
import { TabType } from './Sidebar';

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

        {/* Current View Title (clean, no duplicate brand badge) */}
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

      {/* Right Controls & Profile */}
      <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
        {/* Notifications Button */}
        <button
          onClick={onOpenNotifications}
          className="relative min-h-[44px] min-w-[44px] rounded-xl border border-slate-200 hover:bg-slate-50 flex items-center justify-center text-slate-600 transition shrink-0 bg-white shadow-2xs active:scale-95 cursor-pointer"
          aria-label="Open notifications"
          title="Open notifications"
        >
          <Bell className="w-4 h-4" />
          {unreadNotificationsCount > 0 && (
            <span className="absolute top-2 right-2 w-4 h-4 bg-rose-500 text-white rounded-full text-[10px] font-extrabold flex items-center justify-center border-2 border-white animate-pulse">
              {unreadNotificationsCount}
            </span>
          )}
        </button>

        {/* Demo Persona Switcher */}
        <div className="flex items-center pl-1 border-l border-slate-200/80 shrink-0">
          <button
            onClick={onOpenLoginModal}
            className="flex items-center gap-2 px-2 sm:px-3 py-1.5 rounded-xl border border-slate-200 hover:border-blue-300 bg-slate-50 hover:bg-blue-50/50 transition text-left min-h-[44px] active:scale-95 cursor-pointer"
            title="Switch Demo Persona (Global HR / India HR / Employee)"
          >
            <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-2xs shrink-0">
              {userRole === 'hr.global' ? '🌐' : userRole === 'hr.india' ? '🇮🇳' : '👨‍💻'}
            </div>
            <div className="hidden sm:block text-left">
              <div className="flex items-center gap-1">
                <span className="text-xs font-bold text-slate-800 leading-tight">
                  {userRole === 'hr.global' ? 'Global HR' : userRole === 'hr.india' ? 'India HR' : 'Aarav Sharma'}
                </span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </div>
              <p className="text-[10px] text-blue-600 font-semibold leading-tight">
                {userRole === 'hr.global' ? 'US & India' : userRole === 'hr.india' ? 'India Only' : 'Employee View'}
              </p>
            </div>
          </button>
        </div>
      </div>
    </header>
  );
};
