import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  LayoutDashboard,
  Users,
  CreditCard,
  BadgeDollarSign,
  Clock,
  BarChart3,
  Receipt,
  Settings,
  Headphones,
  ChevronDown,
  Sparkles,
  BookOpen,
  Info,
  X
} from 'lucide-react';
import { cn } from '../lib/utils';

export type TabType = 'dashboard' | 'employees' | 'reports';

interface SidebarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  employeeCount: number;
  currentRole?: string;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  employeeCount,
  currentRole,
  isOpenMobile = false,
  onCloseMobile
}) => {
  interface NavItem {
    id: TabType;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: string;
    highlight?: boolean;
  }

  const navItems: NavItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'employees', label: 'Employees', icon: Users, badge: employeeCount > 0 ? employeeCount.toLocaleString() : undefined },
    { id: 'reports', label: 'Reports & Trends', icon: BarChart3 },
  ];

  const handleNavClick = (id: TabType) => {
    setActiveTab(id);
    if (onCloseMobile) {
      onCloseMobile();
    }
  };

  const content = (
    <div className="flex flex-col justify-between h-full select-none">
      {/* Brand Header */}
      <div>
        <div className="h-16 flex items-center justify-between px-5 sm:px-6 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center shadow-md shadow-blue-500/20 text-white font-black text-base">
              SF
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-extrabold tracking-tight text-slate-900 flex items-center gap-1.5">
                SalaryFlow
              </span>
              <span className="text-[10px] text-slate-400 font-medium">Global HR (US & India)</span>
            </div>
          </div>

          {/* Close button for mobile drawer */}
          {onCloseMobile && (
            <button
              onClick={onCloseMobile}
              className="lg:hidden p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Navigation Links */}
        <nav className="p-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={cn(
                  "w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-medium transition-all duration-150 text-left min-h-[44px]",
                  isActive
                    ? "bg-blue-50 text-blue-600 font-semibold shadow-xs"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                )}
              >
                <div className="flex items-center gap-3">
                  <Icon className={cn("w-5 h-5", isActive ? "text-blue-600" : "text-slate-400")} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className={cn(
                    "text-xs px-2 py-0.5 rounded-full font-semibold",
                    isActive ? "bg-blue-200/60 text-blue-700" : "bg-slate-100 text-slate-600"
                  )}>
                    {item.badge}
                  </span>
                )}
                {item.highlight && (
                  <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-700">
                    PDF
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Section */}
      <div className="p-4 space-y-3">
        {/* Company & Entity Scope Display */}
        <div className="flex items-center justify-between p-2.5 rounded-xl border border-slate-100 hover:border-slate-200 bg-slate-50/50 transition">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
              {currentRole === 'hr.india' ? '🇮🇳' : '🌐'}
            </div>
            <div className="truncate">
              <p className="text-xs font-semibold text-slate-800 truncate">
                {currentRole === 'hr.india' ? 'India Entity Only' : 'Global (US & India)'}
              </p>
              <p className="text-[10px] text-slate-400">
                {currentRole === 'hr.india' ? 'INR ₹ • EPFO Hub' : 'USD & INR • Multi-hub'}
              </p>
            </div>
          </div>
        </div>

        {/* Need Help link */}
        <div className="flex items-center gap-2 px-1 text-xs text-slate-500 hover:text-slate-800 cursor-pointer transition py-1">
          <Headphones className="w-4 h-4 text-slate-400" />
          <span>Need Help? Contact Support</span>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* 1. Desktop Static Sidebar (Visible on lg and larger) */}
      <aside className="hidden lg:flex w-64 shrink-0 bg-white border-r border-slate-200 flex-col justify-between h-screen sticky top-0">
        {content}
      </aside>

      {/* 2. Mobile Drawer Slide-Over (Smooth open and close animation) */}
      <AnimatePresence>
        {isOpenMobile && (
          <div className="fixed inset-0 z-50 lg:hidden flex">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.22, ease: 'easeInOut' }}
              className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs"
              onClick={onCloseMobile}
            />
            {/* Slide-in panel */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 280 }}
              className="relative w-72 max-w-[85vw] bg-white h-full shadow-2xl flex flex-col z-10"
            >
              {content}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
