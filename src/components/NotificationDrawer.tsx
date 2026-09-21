import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Bell,
  Trash2,
  CheckCheck,
  CreditCard,
  Users,
  BadgeDollarSign,
  Receipt,
  Info,
  Clock,
  Sparkles
} from 'lucide-react';
import { NotificationItem } from '../types';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: NotificationItem[];
  onClearNotification: (id: string) => void;
  onClearAll: () => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({
  isOpen,
  onClose,
  notifications,
  onClearNotification,
  onClearAll
}) => {
  const getIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case 'payroll':
        return <CreditCard className="w-4 h-4 text-blue-600" />;
      case 'employee':
        return <Users className="w-4 h-4 text-emerald-600" />;
      case 'salary':
        return <BadgeDollarSign className="w-4 h-4 text-amber-600" />;
      case 'tax':
        return <Receipt className="w-4 h-4 text-indigo-600" />;
      default:
        return <Info className="w-4 h-4 text-slate-600" />;
    }
  };

  const getBadgeColor = (type: NotificationItem['type']) => {
    switch (type) {
      case 'payroll':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'employee':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'salary':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'tax':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
          {/* Backdrop with smooth fade */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs"
          />

          {/* Slide-in notification drawer */}
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 280 }}
            className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col z-10 border-l border-slate-200"
          >
            {/* Header */}
            <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-200/60 shadow-2xs">
                  <Bell className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                    <span>Notifications</span>
                    {notifications.length > 0 && (
                      <span className="text-[11px] font-extrabold px-2 py-0.5 rounded-full bg-blue-600 text-white">
                        {notifications.length}
                      </span>
                    )}
                  </h3>
                  <p className="text-xs text-slate-400">Payroll runs, salary updates & compliance alerts</p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                {notifications.length > 0 && (
                  <button
                    onClick={onClearAll}
                    title="Clear all notifications"
                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition text-xs font-semibold flex items-center gap-1"
                  >
                    <CheckCheck className="w-4 h-4" />
                    <span className="hidden sm:inline">Clear All</span>
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-xl transition"
                  aria-label="Close notifications drawer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Notification List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {notifications.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100 shadow-2xs">
                    <CheckCheck className="w-7 h-7" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-800 text-sm">All caught up!</p>
                    <p className="text-xs text-slate-400 mt-1 max-w-xs">
                      There are no pending payroll alerts or salary notifications right now.
                    </p>
                  </div>
                </div>
              ) : (
                <AnimatePresence mode="popLayout">
                  {notifications.map((n) => (
                    <motion.div
                      key={n.id}
                      layout
                      initial={{ opacity: 0, y: 10, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, x: 20, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="group relative p-3.5 rounded-2xl border border-slate-200/80 bg-white hover:border-slate-300 hover:shadow-xs transition space-y-2"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-2.5">
                          <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center shrink-0 mt-0.5">
                            {getIcon(n.type)}
                          </div>
                          <div>
                            <span className={`inline-block text-[10px] font-bold px-1.5 py-0.5 rounded border capitalize mb-1 ${getBadgeColor(n.type)}`}>
                              {n.type}
                            </span>
                            <h4 className="font-bold text-slate-900 text-xs leading-snug">
                              {n.title}
                            </h4>
                          </div>
                        </div>

                        {/* Clear Specific Notification Button */}
                        <button
                          onClick={() => onClearNotification(n.id)}
                          title="Dismiss notification"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition shrink-0 opacity-80 group-hover:opacity-100"
                          aria-label={`Dismiss ${n.title}`}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <p className="text-xs text-slate-600 leading-relaxed pl-10">
                        {n.message}
                      </p>

                      <div className="flex items-center justify-between pl-10 pt-1 text-[11px] text-slate-400">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>{n.time}</span>
                        </span>
                        <button
                          onClick={() => onClearNotification(n.id)}
                          className="text-[11px] font-semibold text-blue-600 hover:text-blue-800 transition"
                        >
                          Dismiss
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-slate-100 bg-slate-50 text-center text-[11px] text-slate-400 flex items-center justify-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-blue-500" />
              <span>Real-time enterprise payroll events & auditing</span>
            </div>
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
};
