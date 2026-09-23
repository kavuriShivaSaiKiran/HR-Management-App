import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, Lock, Mail, AlertCircle, ArrowRight, Loader2, KeyRound, Eye, EyeOff, CheckCircle2, Building2 } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login, error: authError } = useAuth();
  const [email, setEmail] = useState('hrmanager@acme.org');
  const [password, setPassword] = useState('AcmeHR@2026!');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const executeLogin = async (loginEmail: string, loginPass: string) => {
    setLocalError(null);

    if (!loginEmail.trim()) {
      setLocalError('Please enter your work email address.');
      return;
    }
    if (!loginPass) {
      setLocalError('Please enter your password.');
      return;
    }

    setIsSubmitting(true);
    const success = await login(loginEmail.trim(), loginPass);
    setIsSubmitting(false);

    if (!success && !authError) {
      setLocalError('Authentication failed. Please verify your credentials.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await executeLogin(email, password);
  };

  const handleQuickLogin = async (targetRole: 'HR_MANAGER' | 'EMPLOYEE' | 'INACTIVE') => {
    let targetEmail = '';
    let targetPass = '';

    if (targetRole === 'HR_MANAGER') {
      targetEmail = 'hrmanager@acme.org';
      targetPass = 'AcmeHR@2026!';
    } else if (targetRole === 'EMPLOYEE') {
      targetEmail = 'staff@acme.org';
      targetPass = 'Staff@2026!';
    } else if (targetRole === 'INACTIVE') {
      targetEmail = 'inactive@acme.org';
      targetPass = 'Inactive@2026!';
    }

    setEmail(targetEmail);
    setPassword(targetPass);
    await executeLogin(targetEmail, targetPass);
  };

  const handleAutofill = (targetRole: 'HR_MANAGER' | 'EMPLOYEE' | 'INACTIVE') => {
    if (targetRole === 'HR_MANAGER') {
      setEmail('hrmanager@acme.org');
      setPassword('AcmeHR@2026!');
    } else if (targetRole === 'EMPLOYEE') {
      setEmail('staff@acme.org');
      setPassword('Staff@2026!');
    } else if (targetRole === 'INACTIVE') {
      setEmail('inactive@acme.org');
      setPassword('Inactive@2026!');
    }
    setLocalError(null);
  };

  const displayError = localError || authError;

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 text-slate-100 relative overflow-hidden select-none">
      {/* Background ambient lighting accents */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-blue-600/15 via-indigo-600/5 to-transparent blur-3xl pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        {/* Brand Icon & Heading */}
        <div className="flex flex-col items-center">
          <div className="h-13 w-13 rounded-2xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shadow-inner mb-3">
            <ShieldCheck className="w-7 h-7 text-blue-400" />
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-white flex items-center gap-2">
            <span>ACME Compensation</span>
          </h1>
          <p className="text-xs uppercase tracking-widest font-semibold text-slate-400 mt-1">
            Workforce Payroll & Intelligence Portal
          </p>

          {/* Operational Scope Badge */}
          <div className="mt-3 flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-[11px] text-slate-400 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>Dual Hubs: India (69%) & US (31%)</span>
            <span className="text-slate-600">•</span>
            <span>10,000 Employees</span>
          </div>
        </div>

        {/* Login Form Card */}
        <div className="mt-6 bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-md">
          <div className="mb-5 pb-4 border-b border-slate-800/80">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">Sign In to Continue</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Enter your credentials or choose a pre-configured demo account below.
            </p>
          </div>

          {/* Error Banner */}
          {displayError && (
            <div className="mb-5 p-3.5 bg-rose-500/10 border border-rose-500/25 rounded-xl flex items-start gap-3 text-rose-300 text-xs animate-in fade-in duration-200">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <div className="flex-1">
                <span className="font-bold block">Authentication Notice</span>
                <span className="mt-0.5 block text-rose-300/90">{displayError}</span>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5" htmlFor="email-input">
                Work Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  id="email-input"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isSubmitting}
                  placeholder="hrmanager@acme.org"
                  className="w-full pl-10 pr-3.5 py-2.5 bg-slate-950 border border-slate-700/80 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors disabled:opacity-50"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-300" htmlFor="password-input">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-[11px] text-slate-400 hover:text-slate-200 transition flex items-center gap-1 cursor-pointer"
                >
                  {showPassword ? (
                    <>
                      <EyeOff className="w-3 h-3 text-slate-400" />
                      <span>Hide</span>
                    </>
                  ) : (
                    <>
                      <Eye className="w-3 h-3 text-slate-400" />
                      <span>Show</span>
                    </>
                  )}
                </button>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="password-input"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isSubmitting}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-10 py-2.5 bg-slate-950 border border-slate-700/80 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors disabled:opacity-50"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-2 py-2.5 px-4 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-md shadow-blue-900/30 disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Demo Accounts Quick-Fill Section */}
          <div className="mt-6 pt-5 border-t border-slate-800">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-400 mb-3">
              <div className="flex items-center gap-1.5">
                <KeyRound className="w-3.5 h-3.5 text-blue-400" />
                <span>Instant Demo Access</span>
              </div>
              <span className="text-[10px] text-slate-500 font-mono">1-Click Login</span>
            </div>

            <div className="space-y-2.5 text-xs">
              {/* HR Manager Demo Card */}
              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-blue-500/50 transition-colors flex items-center justify-between group">
                <div className="min-w-0 pr-2">
                  <div className="font-bold text-slate-200 group-hover:text-blue-400 flex items-center gap-2">
                    <span>ACME HR Manager</span>
                    <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                      HR_MANAGER
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5 truncate">
                    hrmanager@acme.org • Full compensation & salary admin
                  </div>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleAutofill('HR_MANAGER')}
                    className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-semibold cursor-pointer"
                    title="Fill inputs only"
                  >
                    Autofill
                  </button>
                  <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={() => handleQuickLogin('HR_MANAGER')}
                    className="px-2.5 py-1 rounded bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-bold flex items-center gap-1 cursor-pointer transition shadow-xs"
                    title="Sign in immediately"
                  >
                    <span>Sign In</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* Staff Member Demo Card */}
              <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-800/80 hover:border-slate-700 transition-colors flex items-center justify-between text-slate-400">
                <div className="min-w-0 pr-2">
                  <div className="font-medium text-slate-300 flex items-center gap-2">
                    <span>Standard Staff</span>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                      EMPLOYEE
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5 truncate">
                    staff@acme.org • Self-service & read-only access
                  </div>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleAutofill('EMPLOYEE')}
                    className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-semibold cursor-pointer"
                    title="Fill inputs only"
                  >
                    Autofill
                  </button>
                  <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={() => handleQuickLogin('EMPLOYEE')}
                    className="px-2.5 py-1 rounded bg-slate-700 hover:bg-slate-600 text-white text-[10px] font-bold flex items-center gap-1 cursor-pointer transition"
                    title="Sign in immediately"
                  >
                    <span>Sign In</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Security & Architecture Footnote */}
        <div className="mt-6 text-center text-xs text-slate-500 space-y-1">
          <p className="flex items-center justify-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500/70" />
            <span>Protected by HTTP-only JWT sessions & Bcrypt salt hashing</span>
          </p>
          <p className="text-[11px] text-slate-600">
            Relational SQLite WAL engine • Dual Hub: India & US • 10,000 workforce records
          </p>
        </div>
      </div>
    </div>
  );
};
