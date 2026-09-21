import React from 'react';
import {
  Search,
  Bell,
  Menu,
  ChevronDown
} from 'lucide-react';
import { DateRangeFilter } from '../types';

interface TopHeaderProps {
  onSearchChange: (query: string) => void;
  searchQuery: string;
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
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  onSearchChange,
  searchQuery,
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
  onSwitchRole
}) => {
  return (
    <header className="h-16 bg-white border-b border-slate-200 px-3 sm:px-6 flex items-center justify-between sticky top-0 z-30 gap-2">
      {/* Left Area: Mobile Menu Trigger + Brand (mobile) + Search Bar */}
      <div className="flex items-center gap-2 sm:gap-3 flex-1 max-w-xl min-w-0">
        {/* Mobile menu trigger */}
        <button
          onClick={onToggleMobileMenu}
          className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition flex items-center justify-center min-h-[44px] min-w-[44px] shrink-0"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Brand icon on mobile screens */}
        <div className="flex lg:hidden items-center gap-1.5 shrink-0 pr-1">
          <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-xs">
            <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4" stroke="currentColor" strokeWidth="2.5">
              <circle cx="12" cy="12" r="9" strokeOpacity="0.4" />
              <path d="M12 3a9 9 0 0 1 9 9c0 4.97-4.03 9-9 9" strokeLinecap="round" />
              <path d="M12 7a5 5 0 0 1 5 5" strokeLinecap="round" />
            </svg>
          </div>
          <span className="text-sm font-extrabold tracking-tight text-slate-900 hidden xs:inline">PaySphere</span>
        </div>

        {/* Search input */}
        <div className="relative w-full min-w-0">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search employees, roles, IDs..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-3 md:pr-12 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition min-h-[40px]"
          />
          <div className="hidden md:flex absolute right-3 top-1/2 -translate-y-1/2 items-center gap-0.5 pointer-events-none">
            <kbd className="px-1.5 py-0.5 text-[10px] font-semibold text-slate-400 bg-white border border-slate-200 rounded shadow-2xs">
              ⌘
            </kbd>
            <kbd className="px-1.5 py-0.5 text-[10px] font-semibold text-slate-400 bg-white border border-slate-200 rounded shadow-2xs">
              K
            </kbd>
          </div>
        </div>
      </div>

      {/* Right Controls & Profile */}
      <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
        {/* Notifications Button */}
        <button
          onClick={onOpenNotifications}
          className="relative w-10 h-10 rounded-xl border border-slate-200 hover:bg-slate-50 flex items-center justify-center text-slate-600 transition shrink-0 bg-white"
          aria-label="Open notifications"
          title="Open notifications"
        >
          <Bell className="w-4 h-4" />
          {unreadNotificationsCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center border-2 border-white animate-pulse">
              {unreadNotificationsCount}
            </span>
          )}
        </button>

        {/* Demo Persona Switcher Pill & Button */}
        <div className="flex items-center gap-2 pl-1 sm:pl-2 border-l border-slate-200 shrink-0">
          <button
            onClick={onOpenLoginModal}
            className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl border border-slate-200 hover:border-blue-300 bg-slate-50 hover:bg-blue-50/50 transition text-left"
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
                {userRole === 'hr.global' ? 'US & India' : userRole === 'hr.india' ? 'India Only' : 'Employee Portal'}
              </p>
            </div>
          </button>
        </div>
      </div>
    </header>
  );
};
