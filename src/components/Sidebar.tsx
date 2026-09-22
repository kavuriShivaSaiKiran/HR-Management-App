import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  LayoutDashboard,
  Users,
  BarChart3,
  Settings,
  Headphones,
  PanelLeftClose,
  PanelLeftOpen,
  X
} from 'lucide-react';
import { cn } from '../lib/utils';

export type TabType = 'dashboard' | 'employees' | 'insights' | 'settings';

interface SidebarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  employeeCount: number;
  currentRole?: string;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  employeeCount,
  currentRole,
  isOpenMobile = false,
  onCloseMobile,
  isCollapsed = false,
  onToggleCollapse
}) => {
  interface NavItem {
    id: TabType;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: string;
  }

  const navItems: NavItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'employees', label: 'Employees', icon: Users, badge: employeeCount > 0 ? employeeCount.toLocaleString() : undefined },
    { id: 'insights', label: 'Compensation Insights', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  const handleNavClick = (id: TabType) => {
    setActiveTab(id);
    if (onCloseMobile) {
      onCloseMobile();
    }
  };

  // Content for Expanded Sidebar
  const expandedContent = (
    <div className="flex flex-col justify-between h-full select-none">
      {/* Brand Header */}
      <div>
        <div className="h-16 flex items-center justify-between px-5 sm:px-6 border-b border-slate-100">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center shadow-md shadow-blue-500/20 text-white font-black text-sm tracking-wider shrink-0">
              AC
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-base font-extrabold tracking-tight text-slate-900 truncate">
                ACME Compensation
              </span>
              <span className="text-[10px] text-slate-400 font-medium truncate">Salary & Band Management</span>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {/* Collapse button on desktop */}
            {onToggleCollapse && (
              <button
                onClick={onToggleCollapse}
                className="hidden lg:flex p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
                title="Collapse sidebar"
                aria-label="Collapse sidebar"
              >
                <PanelLeftClose className="w-4 h-4" />
              </button>
            )}

            {/* Close button for mobile drawer */}
            {onCloseMobile && (
              <button
                onClick={onCloseMobile}
                className="lg:hidden p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition cursor-pointer"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
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
                  "w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-medium transition-all duration-150 text-left min-h-[44px] cursor-pointer",
                  isActive
                    ? "bg-blue-50 text-blue-600 font-semibold shadow-xs"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                )}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Icon className={cn("w-5 h-5 shrink-0", isActive ? "text-blue-600" : "text-slate-400")} />
                  <span className="truncate">{item.label}</span>
                </div>
                {item.badge && (
                  <span className={cn(
                    "text-xs px-2 py-0.5 rounded-full font-semibold shrink-0 ml-1.5",
                    isActive ? "bg-blue-200/60 text-blue-700" : "bg-slate-100 text-slate-600"
                  )}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Section */}
      <div className="p-4 space-y-3 border-t border-slate-100">
        {/* Company & Entity Scope Display */}
        <div className="flex items-center justify-between p-2.5 rounded-xl border border-slate-100 hover:border-slate-200 bg-slate-50/50 transition">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
              🌐
            </div>
            <div className="truncate">
              <p className="text-xs font-semibold text-slate-800 truncate">
                Global Operations
              </p>
              <p className="text-[10px] text-slate-400">
                10,000 Staff &bull; IN 69% &bull; US 31%
              </p>
            </div>
          </div>
        </div>

        {/* Support Link */}
        <div className="flex items-center gap-2 px-1 text-xs text-slate-500 hover:text-slate-800 cursor-pointer transition py-1">
          <Headphones className="w-4 h-4 text-slate-400" />
          <span>Compensation Help Desk</span>
        </div>
      </div>
    </div>
  );

  // Content for Collapsed Sidebar (Desktop Icon Rail)
  const collapsedContent = (
    <div className="flex flex-col justify-between h-full select-none py-3 items-center">
      {/* Brand Icon & Expand Trigger */}
      <div className="flex flex-col items-center gap-3 w-full">
        <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-md shadow-blue-500/20 text-white font-black text-sm tracking-wider">
          AC
        </div>
        {onToggleCollapse && (
          <button
            onClick={onToggleCollapse}
            className="p-2 rounded-xl text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
            title="Expand sidebar"
            aria-label="Expand sidebar"
          >
            <PanelLeftOpen className="w-5 h-5" />
          </button>
        )}

        <div className="w-8 h-px bg-slate-200 my-1" />

        {/* Icon Navigation Items */}
        <nav className="flex flex-col items-center gap-2 w-full px-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                title={item.label}
                aria-label={item.label}
                className={cn(
                  "relative w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-150 cursor-pointer group",
                  isActive
                    ? "bg-blue-50 text-blue-600 font-semibold shadow-xs"
                    : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                )}
              >
                <Icon className={cn("w-5 h-5", isActive ? "text-blue-600" : "text-slate-500 group-hover:text-slate-900")} />
                {isActive && (
                  <span className="absolute left-0 w-1 h-6 bg-blue-600 rounded-r-full" />
                )}
                {item.badge && !isActive && (
                  <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-blue-600 ring-2 ring-white" />
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Collapsed Bottom Action */}
      <div className="flex flex-col items-center gap-2 w-full">
        {onToggleCollapse && (
          <button
            onClick={onToggleCollapse}
            className="p-2 rounded-xl text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
            title="Expand sidebar"
          >
            <PanelLeftOpen className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* 1. Desktop Static Sidebar (Collapsible) */}
      <aside
        className={cn(
          "hidden lg:flex shrink-0 bg-white border-r border-slate-200 flex-col justify-between h-screen sticky top-0 transition-[width] duration-200 ease-in-out z-20",
          isCollapsed ? "w-20" : "w-64"
        )}
      >
        {isCollapsed ? collapsedContent : expandedContent}
      </aside>

      {/* 2. Mobile Drawer Slide-Over */}
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
              {expandedContent}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
