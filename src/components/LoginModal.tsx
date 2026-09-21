import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Globe,
  Lock,
  Mail,
  ArrowRight,
  ShieldCheck,
  User,
  CheckCircle2,
  Building2,
  Sparkles
} from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onLogin: (role: 'hr.global' | 'hr.india' | 'employee', email: string) => void;
  onClose?: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onLogin,
  onClose
}) => {
  const [email, setEmail] = useState<string>('hr.global@demo.com');
  const [password, setPassword] = useState<string>('••••••••');
  const [selectedPersona, setSelectedPersona] = useState<'hr.global' | 'hr.india' | 'employee'>('hr.global');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(selectedPersona, email);
  };

  const handleSelectPreset = (persona: 'hr.global' | 'hr.india' | 'employee', presetEmail: string) => {
    setSelectedPersona(persona);
    setEmail(presetEmail);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ duration: 0.2 }}
        className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 overflow-hidden"
      >
        {/* Top Brand Banner */}
        <div className="bg-gradient-to-r from-blue-700 to-indigo-800 p-6 text-white text-center relative">
          <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center mx-auto mb-3 shadow-inner">
            <span className="font-black text-xl tracking-tight">SF</span>
          </div>
          <h2 className="text-xl font-black tracking-tight">SalaryFlow Global</h2>
          <p className="text-xs text-blue-200 mt-1">
            Enterprise Multi-Country Payroll Platform (US & India)
          </p>
        </div>

        <div className="p-6 space-y-5">
          {/* Quick Demo Persona Switcher */}
          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
              Select Demo Persona (1-Click Switch)
            </label>
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => handleSelectPreset('hr.global', 'hr.global@demo.com')}
                className={`w-full p-3 rounded-xl text-left border transition flex items-center justify-between ${
                  selectedPersona === 'hr.global'
                    ? 'border-blue-500 bg-blue-50/50 shadow-2xs'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-base">🌐</span>
                    <span className="font-bold text-xs text-slate-900">hr.global@demo.com</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Global HR Admin &bull; Full access to US & India hubs
                  </p>
                </div>
                {selectedPersona === 'hr.global' && (
                  <CheckCircle2 className="w-4 h-4 text-blue-600" />
                )}
              </button>

              <button
                type="button"
                onClick={() => handleSelectPreset('hr.india', 'hr.india@demo.com')}
                className={`w-full p-3 rounded-xl text-left border transition flex items-center justify-between ${
                  selectedPersona === 'hr.india'
                    ? 'border-blue-500 bg-blue-50/50 shadow-2xs'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-base">🇮🇳</span>
                    <span className="font-bold text-xs text-slate-900">hr.india@demo.com</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    India HR Admin &bull; Restricted strictly to India cohort (INR)
                  </p>
                </div>
                {selectedPersona === 'hr.india' && (
                  <CheckCircle2 className="w-4 h-4 text-blue-600" />
                )}
              </button>

              <button
                type="button"
                onClick={() => handleSelectPreset('employee', 'employee@demo.com')}
                className={`w-full p-3 rounded-xl text-left border transition flex items-center justify-between ${
                  selectedPersona === 'employee'
                    ? 'border-blue-500 bg-blue-50/50 shadow-2xs'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-base">👨‍💻</span>
                    <span className="font-bold text-xs text-slate-900">employee@demo.com</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Aarav Sharma &bull; Employee self-service & payslip viewer
                  </p>
                </div>
                {selectedPersona === 'employee' && (
                  <CheckCircle2 className="w-4 h-4 text-blue-600" />
                )}
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3 pt-1">
            <div>
              <label className="text-xs font-semibold text-slate-600 block mb-1">
                Account Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-600 block mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full mt-2 py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center justify-center gap-2"
            >
              <span>Continue as {selectedPersona === 'hr.global' ? 'Global HR' : selectedPersona === 'hr.india' ? 'India HR' : 'Employee'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <p className="text-[11px] text-center text-slate-400">
            Demo credentials pre-filled for immediate exploration
          </p>
        </div>
      </motion.div>
    </div>
  );
};
