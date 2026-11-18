import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Activity,
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  Eye,
  EyeOff,
  HeartPulse,
  KeyRound,
  Lock,
  Mail,
  Moon,
  ShieldCheck,
  Stethoscope,
  Sun,
  UserCheck,
} from 'lucide-react';
import { useHospital } from '../context/HospitalContext';
import { DEMO_ACCOUNTS } from '../services/dataService';
import { UserRole } from '../types/hospital';

export const Login: React.FC = () => {
  const { login, loginAsDemoRole, theme, toggleTheme } = useHospital();

  const [email, setEmail] = useState('admin@medicarepro.demo');
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [forgotMode, setForgotMode] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetSent, setResetSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email.trim() || !password.trim()) {
      setError('Please enter both your email address and password.');
      return;
    }
    const result = login(email, password, rememberMe);
    if (!result.ok && result.error) {
      setError(result.error);
    }
  };

  const handleSelectDemo = (role: UserRole) => {
    const acc = DEMO_ACCOUNTS.find((d) => d.role === role);
    if (!acc) return;
    setEmail(acc.email);
    setPassword(acc.password);
    setError('');
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail.trim()) return;
    setResetSent(true);
  };

  return (
    <div className="login-screen min-h-screen relative overflow-hidden bg-gradient-to-br from-[#F3F6FB] via-[#EAF1FA] to-[#E3F4F2] dark:from-[#0B1120] dark:via-[#0F172A] dark:to-[#0D1E2E] text-[#1E293B] dark:text-slate-100 flex flex-col">
      {/* Subtle Ambient Background Geometry */}
      <div className="pointer-events-none absolute -top-32 -left-32 h-96 w-96 rounded-full bg-[#2563EB]/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-[#16B8A6]/12 blur-3xl" />

      {/* Top Bar */}
      <header className="relative z-10 flex items-center justify-between px-6 py-4 border-b border-slate-200/70 dark:border-slate-800/80 bg-white/80 dark:bg-[#111827]/80 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#142D4E] text-white shadow-sm">
            <Activity className="h-5 w-5 text-[#16B8A6]" />
          </div>
          <span className="font-display text-lg font-bold tracking-tight text-[#142D4E] dark:text-white whitespace-nowrap">
            MediCare Pro
          </span>
        </div>

        <button
          type="button"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          className="flex items-center gap-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white/90 dark:bg-slate-800/90 px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
        >
          {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
          <span>{theme === 'light' ? 'Dark Mode' : 'Light Mode'}</span>
        </button>
      </header>

      {/* Main Split Container */}
      <main className="relative z-10 flex-1 flex items-center justify-center p-4 sm:p-8">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 rounded-2xl border border-white/70 dark:border-slate-800 bg-white/85 dark:bg-[#111827]/90 backdrop-blur-md shadow-xl overflow-hidden"
        >
          {/* Abstract 2D healthcare showcase panel */}
          <div className="login-showcase lg:col-span-6 relative bg-gradient-to-br from-[#102c40] via-[#174d56] to-[#143b4b] text-white p-8 sm:p-10 flex flex-col justify-between gap-7 overflow-hidden">
            <div>
              <p className="text-xs font-semibold text-[#16B8A6]">
                Smart Hospital Administration Suite
              </p>
              <h1 className="mt-2 font-display text-2xl sm:text-3xl font-bold leading-tight text-white [text-wrap:balance]">
                Unified clinical operations, scheduling, and inpatient care.
              </h1>
              <p className="mt-3 text-sm text-slate-300 leading-relaxed">
                Coordinate patient intake, physician schedules, ward bed occupancy, billing, pharmacy stock, and laboratory reporting in real time.
              </p>
            </div>

            <div className="login-abstract-visual relative my-1 flex h-60 sm:h-72 items-center justify-center overflow-hidden rounded-2xl border border-white/15">
              <div className="absolute inset-0 opacity-60" aria-hidden="true">
                <svg viewBox="0 0 720 360" className="h-full w-full" fill="none" preserveAspectRatio="xMidYMid slice">
                  <defs>
                    <linearGradient id="careLine" x1="96" y1="176" x2="638" y2="176" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#77E4CA" stopOpacity=".12" />
                      <stop offset=".48" stopColor="#A5F3E3" />
                      <stop offset="1" stopColor="#84B9FF" stopOpacity=".22" />
                    </linearGradient>
                    <pattern id="careDots" width="22" height="22" patternUnits="userSpaceOnUse">
                      <circle cx="1.2" cy="1.2" r="1" fill="white" fillOpacity=".18" />
                    </pattern>
                  </defs>
                  <rect width="720" height="360" fill="url(#careDots)" />
                  <path d="M-20 236C90 236 96 104 202 104S324 264 428 264 545 126 740 126" stroke="url(#careLine)" strokeWidth="2" />
                  <path d="M-20 265C104 265 112 144 216 144S324 292 440 292 560 164 740 164" stroke="white" strokeOpacity=".12" />
                  <circle cx="202" cy="104" r="8" fill="#9DE9D9" fillOpacity=".9" />
                  <circle cx="428" cy="264" r="7" fill="#B8D8FF" fillOpacity=".9" />
                  <circle cx="545" cy="126" r="5" fill="#9DE9D9" fillOpacity=".8" />
                  <circle cx="202" cy="104" r="20" stroke="#9DE9D9" strokeOpacity=".32" />
                  <circle cx="428" cy="264" r="18" stroke="#B8D8FF" strokeOpacity=".3" />
                </svg>
              </div>
              <div className="absolute -right-12 -top-16 h-52 w-52 rounded-full bg-[#71d8bd]/20 blur-3xl" />
              <div className="absolute -bottom-16 -left-12 h-56 w-56 rounded-full bg-[#6e9cff]/20 blur-3xl" />
              <div className="relative flex h-24 w-24 items-center justify-center rounded-[28px] border border-white/25 bg-white/10 text-[#b6f2e5] shadow-[0_18px_45px_-20px_rgba(0,0,0,.7)] backdrop-blur-xl">
                <HeartPulse className="h-11 w-11" strokeWidth={1.5} />
                <span className="absolute -right-2 -top-2 h-4 w-4 rounded-full border-4 border-[#174d56] bg-[#a4efd7]" />
              </div>
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between gap-3 rounded-xl border border-white/15 bg-[#102c42]/55 px-4 py-3 backdrop-blur-lg">
                <div className="flex items-center gap-2.5">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 text-[#a7ebd8]"><Activity className="h-4 w-4" /></span>
                  <div><p className="text-xs font-semibold text-white">Connected care, clearly in view</p><p className="mt-0.5 text-[10px] text-white/60">One workspace across clinical operations</p></div>
                </div>
                <span className="hidden sm:inline-flex h-2 w-2 rounded-full bg-[#8de0c8] shadow-[0_0_14px_rgba(141,224,200,.8)]" />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 border-t border-white/15 pt-5 text-xs">
              <div>
                <div className="font-display text-lg font-bold text-white tabular-nums">22</div>
                <div className="text-slate-300">Integrated Modules</div>
              </div>
              <div>
                <div className="font-display text-lg font-bold text-[#16B8A6] tabular-nums">3 Roles</div>
                <div className="text-slate-300">Admin · Doctor · Desk</div>
              </div>
              <div>
                <div className="font-display text-lg font-bold text-white tabular-nums">Live</div>
                <div className="text-slate-300">Conflict & Stock Checks</div>
              </div>
            </div>
          </div>

          {/* Right Glass Sign-In Form */}
          <div className="lg:col-span-6 p-8 sm:p-10 flex flex-col justify-center">
            {!forgotMode ? (
              <>
                <div>
                  <h2 className="font-display text-xl font-bold text-[#142D4E] dark:text-white">
                    Sign in to MediCare Pro
                  </h2>
                  <p className="mt-1 text-sm text-[#64748B] dark:text-slate-400">
                    Enter your credentials or choose a role-based demonstration account below.
                  </p>
                </div>

                {error && (
                  <div className="mt-4 flex items-start gap-2.5 rounded-lg border border-rose-200 dark:border-rose-900/60 bg-rose-50 dark:bg-rose-950/40 px-3.5 py-2.5 text-xs text-rose-700 dark:text-rose-300">
                    <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                    <span>{error}</span>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                  <div>
                    <label
                      htmlFor="login-email"
                      className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5"
                    >
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                      <input
                        id="login-email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="admin@medicarepro.demo"
                        required
                        className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-[#F3F6FB] dark:bg-slate-800 py-2.5 pl-9 pr-3 text-sm text-[#1E293B] dark:text-white focus:border-[#2563EB] focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label
                        htmlFor="login-password"
                        className="block text-xs font-semibold text-slate-600 dark:text-slate-300"
                      >
                        Password
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          setForgotMode(true);
                          setResetEmail(email);
                          setResetSent(false);
                        }}
                        className="text-xs font-medium text-[#2563EB] hover:underline"
                      >
                        Forgot password?
                      </button>
                    </div>
                    <div className="relative">
                      <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                      <input
                        id="login-password"
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter password"
                        required
                        className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-[#F3F6FB] dark:bg-slate-800 py-2.5 pl-9 pr-10 text-sm text-[#1E293B] dark:text-white focus:border-[#2563EB] focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <label className="inline-flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="h-4 w-4 rounded border-slate-300 text-[#2563EB] focus:ring-[#2563EB]"
                      />
                      <span>Remember me on this browser</span>
                    </label>
                  </div>

                  <button
                    type="submit"
                    className="w-full rounded-lg bg-[#2563EB] px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 active:scale-[0.99] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] focus-visible:ring-offset-2 transition-all shadow-sm"
                  >
                    Sign In
                  </button>
                </form>

                {/* Demonstration Accounts Section */}
                <div className="mt-7 border-t border-slate-200 dark:border-slate-800 pt-5">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-semibold text-[#142D4E] dark:text-slate-200">
                      Demonstration Accounts (Prototype Only)
                    </h3>
                    <span className="text-[11px] text-slate-400">Fill or quick-enter</span>
                  </div>

                  <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    {DEMO_ACCOUNTS.map((acc) => {
                      const RoleIcon =
                        acc.role === 'Admin'
                          ? ShieldCheck
                          : acc.role === 'Doctor'
                            ? Stethoscope
                            : UserCheck;
                      return (
                        <div
                          key={acc.id}
                          className="rounded-lg border border-slate-200 dark:border-slate-800 bg-[#F3F6FB]/80 dark:bg-slate-800/60 p-3 flex flex-col justify-between gap-2 surface-hover"
                        >
                          <div>
                            <div className="flex items-center gap-1.5 text-xs font-semibold text-[#142D4E] dark:text-white">
                              <RoleIcon className="h-3.5 w-3.5 text-[#16B8A6] shrink-0" />
                              <span>{acc.role}</span>
                            </div>
                            <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400 truncate">
                              {acc.email}
                            </p>
                            <p className="font-mono-num text-[11px] text-slate-500 dark:text-slate-400">
                              pw: {acc.password}
                            </p>
                          </div>
                          <div className="flex items-center gap-1.5 pt-1">
                            <button
                              type="button"
                              onClick={() => handleSelectDemo(acc.role)}
                              className="flex-1 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-2 py-1 text-[11px] font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                            >
                              Fill
                            </button>
                            <button
                              type="button"
                              onClick={() => loginAsDemoRole(acc.role)}
                              className="flex-1 rounded bg-[#142D4E] px-2 py-1 text-[11px] font-medium text-white hover:bg-[#1d3e6b] transition-colors"
                            >
                              Enter
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <p className="mt-3 text-[11px] text-slate-400 leading-relaxed">
                    Notice: Demonstration credentials use local browser storage for academic prototyping and role-based navigation preview, not production authentication.
                  </p>
                </div>
              </>
            ) : (
              <div>
                <button
                  type="button"
                  onClick={() => setForgotMode(false)}
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-[#142D4E] dark:hover:text-white"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  <span>Back to Sign In</span>
                </button>

                <div className="mt-4 flex h-11 w-11 items-center justify-center rounded-xl bg-[#2563EB]/10 text-[#2563EB]">
                  <KeyRound className="h-5 w-5" />
                </div>
                <h2 className="mt-4 font-display text-xl font-bold text-[#142D4E] dark:text-white">
                  Reset Demonstration Password
                </h2>
                <p className="mt-1 text-sm text-[#64748B] dark:text-slate-400">
                  Enter your hospital email address to simulate a password recovery request, or return to sign in with one of the demo accounts.
                </p>

                {resetSent ? (
                  <div className="mt-6 rounded-xl border border-emerald-200 dark:border-emerald-900/50 bg-emerald-50 dark:bg-emerald-950/40 p-4">
                    <div className="flex items-start gap-2.5">
                      <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-semibold text-emerald-900 dark:text-emerald-200">
                          Recovery Instructions Prepared
                        </p>
                        <p className="mt-1 text-xs text-emerald-800 dark:text-emerald-300">
                          In a live deployment, reset instructions would be dispatched to <span className="font-medium">{resetEmail}</span>. For this local prototype, please use the demo credentials on the login screen.
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setForgotMode(false)}
                      className="mt-4 rounded-lg bg-[#142D4E] px-4 py-2 text-xs font-semibold text-white hover:bg-[#1d3e6b]"
                    >
                      Return to Login
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleForgotSubmit} className="mt-6 space-y-4">
                    <div>
                      <label
                        htmlFor="reset-email"
                        className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5"
                      >
                        Hospital Email
                      </label>
                      <input
                        id="reset-email"
                        type="email"
                        required
                        value={resetEmail}
                        onChange={(e) => setResetEmail(e.target.value)}
                        placeholder="name@medicarepro.demo"
                        className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-[#F3F6FB] dark:bg-slate-800 px-3.5 py-2.5 text-sm text-[#1E293B] dark:text-white focus:border-[#2563EB] focus:bg-white dark:focus:bg-slate-900 focus:outline-none"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full rounded-lg bg-[#2563EB] px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
                    >
                      Send Recovery Link
                    </button>
                  </form>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </main>
    </div>
  );
};
