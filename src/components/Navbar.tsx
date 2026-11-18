import React, { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  Ambulance,
  Bell,
  CalendarClock,
  Droplets,
  FlaskConical,
  ListOrdered,
  Menu,
  MessageSquareHeart,
  Moon,
  Pill,
  QrCode,
  Receipt,
  Search,
  ShieldAlert,
  ShieldCheck,
  Stethoscope,
  Sun,
  Users,
  X,
} from 'lucide-react';
import { useHospital } from '../context/HospitalContext';
import { NavPage } from '../types/hospital';

interface NavbarProps {
  onOpenMobileMenu: () => void;
}

const PAGE_META: Record<NavPage, { title: string; breadcrumb: string }> = {
  dashboard: { title: 'Hospital Overview', breadcrumb: 'Main / Dashboard' },
  'command-centre': { title: 'Hospital Command Centre', breadcrumb: 'Main / Command Centre' },
  patients: { title: 'Patient Management', breadcrumb: 'Hospital Management / Patients' },
  emr: { title: 'Electronic Medical Records', breadcrumb: 'Hospital Management / EMR' },
  emergency: { title: 'Emergency Management', breadcrumb: 'Hospital Management / Emergency' },
  doctors: { title: 'Doctor Directory', breadcrumb: 'Hospital Management / Doctors' },
  appointments: { title: 'Appointment Scheduling', breadcrumb: 'Hospital Management / Appointments' },
  queue: { title: 'Patient Queue Management', breadcrumb: 'Hospital Management / Patient Queue' },
  beds: { title: 'Beds & Wards', breadcrumb: 'Hospital Management / Beds & Wards' },
  discharge: { title: 'Discharge Management', breadcrumb: 'Hospital Management / Discharge' },
  'blood-bank': { title: 'Blood Bank Management', breadcrumb: 'Operations / Blood Bank' },
  insurance: { title: 'Insurance & Claims', breadcrumb: 'Operations / Insurance' },
  billing: { title: 'Billing & Invoices', breadcrumb: 'Operations / Billing' },
  pharmacy: { title: 'Pharmacy Inventory', breadcrumb: 'Operations / Pharmacy' },
  laboratory: { title: 'Laboratory & Diagnostics', breadcrumb: 'Operations / Laboratory' },
  staff: { title: 'Staff Directory', breadcrumb: 'Operations / Staff' },
  ambulance: { title: 'Ambulance & Dispatch', breadcrumb: 'Operations / Ambulance' },
  feedback: { title: 'Patient Feedback', breadcrumb: 'Operations / Patient Feedback' },
  'audit-logs': { title: 'System Audit Logs', breadcrumb: 'System / Audit Logs' },
  reports: { title: 'Reports & Analytics', breadcrumb: 'Analytics / Reports' },
  notifications: { title: 'Notification Centre', breadcrumb: 'System / Notifications' },
  settings: { title: 'System Settings', breadcrumb: 'System / Settings' },
};

interface SearchHit {
  id: string;
  label: string;
  sublabel: string;
  category: string;
  page: NavPage;
}

const NAVIGATION_HITS: SearchHit[] = Object.entries(PAGE_META).map(([page, meta]) => ({
  id: page,
  label: meta.title,
  sublabel: meta.breadcrumb,
  category: 'Navigate',
  page: page as NavPage,
}));

export const Navbar: React.FC<NavbarProps> = ({ onOpenMobileMenu }) => {
  const {
    activePage,
    setActivePage,
    allowedPages,
    theme,
    toggleTheme,
    setQrScannerOpen,
    unreadNotificationCount,
    session,
    patients,
    doctors,
    appointments,
    invoices,
    medicines,
    labTests,
    staff,
    queueTokens,
    emergencyCases,
    insuranceClaims,
    bloodRequests,
    ambulances,
    feedbackList,
  } = useHospital();

  const [searchQuery, setSearchQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const [activeResultIndex, setActiveResultIndex] = useState(0);
  const searchBoxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchBoxRef.current && !searchBoxRef.current.contains(e.target as Node)) {
        setSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const handleShortcut = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        const input = searchBoxRef.current?.querySelector('input');
        input?.focus();
        setSearchFocused(true);
      }
    };
    document.addEventListener('keydown', handleShortcut);
    return () => document.removeEventListener('keydown', handleShortcut);
  }, []);

  const searchResults = useMemo<SearchHit[]>(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [];
    const hits: SearchHit[] = NAVIGATION_HITS.filter((hit) =>
      allowedPages.includes(hit.page) && `${hit.label} ${hit.sublabel}`.toLowerCase().includes(q)
    );

    if (allowedPages.includes('patients')) {
      patients
        .filter((p) => p.fullName.toLowerCase().includes(q) || p.id.toLowerCase().includes(q) || p.phone.includes(q))
        .slice(0, 3)
        .forEach((p) =>
          hits.push({
            id: p.id,
            label: p.fullName,
            sublabel: `${p.id} · ${p.bloodGroup} · ${p.age}y`,
            category: 'Patients',
            page: 'patients',
          })
        );
    }

    if (allowedPages.includes('doctors')) {
      doctors
        .filter((d) => d.name.toLowerCase().includes(q) || d.specialization.toLowerCase().includes(q))
        .slice(0, 3)
        .forEach((d) =>
          hits.push({
            id: d.id,
            label: d.name,
            sublabel: `${d.specialization} · ${d.availability}`,
            category: 'Doctors',
            page: 'doctors',
          })
        );
    }

    if (allowedPages.includes('appointments')) {
      appointments
        .filter((a) => a.patientName.toLowerCase().includes(q) || a.doctorName.toLowerCase().includes(q) || a.id.toLowerCase().includes(q))
        .slice(0, 3)
        .forEach((a) =>
          hits.push({
            id: a.id,
            label: `${a.patientName} → ${a.doctorName}`,
            sublabel: `${a.date} ${a.time} · ${a.status}`,
            category: 'Appointments',
            page: 'appointments',
          })
        );
    }

    if (allowedPages.includes('billing')) {
      invoices
        .filter((inv) => inv.id.toLowerCase().includes(q) || inv.patientName.toLowerCase().includes(q))
        .slice(0, 2)
        .forEach((inv) =>
          hits.push({
            id: inv.id,
            label: `${inv.id} · ${inv.patientName}`,
            sublabel: `$${inv.totalAmount.toFixed(2)} · ${inv.paymentStatus}`,
            category: 'Billing',
            page: 'billing',
          })
        );
    }

    if (allowedPages.includes('pharmacy')) {
      medicines
        .filter((m) => m.name.toLowerCase().includes(q) || m.category.toLowerCase().includes(q))
        .slice(0, 2)
        .forEach((m) =>
          hits.push({
            id: m.id,
            label: m.name,
            sublabel: `${m.stock} ${m.unit} · Exp ${m.expiryDate}`,
            category: 'Pharmacy',
            page: 'pharmacy',
          })
        );
    }

    if (allowedPages.includes('laboratory')) {
      labTests
        .filter((t) => t.testName.toLowerCase().includes(q) || t.patientName.toLowerCase().includes(q))
        .slice(0, 2)
        .forEach((t) =>
          hits.push({
            id: t.id,
            label: t.testName,
            sublabel: `${t.patientName} · ${t.status}`,
            category: 'Laboratory',
            page: 'laboratory',
          })
        );
    }

    if (allowedPages.includes('staff')) {
      staff
        .filter((s) => s.fullName.toLowerCase().includes(q) || s.role.toLowerCase().includes(q))
        .slice(0, 2)
        .forEach((s) =>
          hits.push({
            id: s.id,
            label: s.fullName,
            sublabel: `${s.role} · ${s.department}`,
            category: 'Staff',
            page: 'staff',
          })
        );
    }

    if (allowedPages.includes('queue')) {
      queueTokens
        .filter((t) => t.tokenNumber.toLowerCase().includes(q) || t.patientName.toLowerCase().includes(q))
        .slice(0, 2)
        .forEach((t) =>
          hits.push({
            id: t.id,
            label: `${t.tokenNumber} · ${t.patientName}`,
            sublabel: `${t.department} · ${t.doctorName} · ${t.status}`,
            category: 'Queue',
            page: 'queue',
          })
        );
    }

    if (allowedPages.includes('emergency')) {
      emergencyCases
        .filter((e) => e.id.toLowerCase().includes(q) || e.patientName.toLowerCase().includes(q) || e.chiefComplaint.toLowerCase().includes(q))
        .slice(0, 2)
        .forEach((e) =>
          hits.push({
            id: e.id,
            label: `${e.id} · ${e.patientName}`,
            sublabel: `${e.priority} · ${e.treatmentStatus}`,
            category: 'Emergency',
            page: 'emergency',
          })
        );
    }

    if (allowedPages.includes('blood-bank')) {
      bloodRequests
        .filter((r) => r.id.toLowerCase().includes(q) || r.patientName.toLowerCase().includes(q) || r.bloodGroup.toLowerCase().includes(q))
        .slice(0, 2)
        .forEach((r) =>
          hits.push({
            id: r.id,
            label: `${r.id} · ${r.bloodGroup} (${r.unitsRequested}u)`,
            sublabel: `${r.patientName} · ${r.status}`,
            category: 'Blood Bank',
            page: 'blood-bank',
          })
        );
    }

    if (allowedPages.includes('insurance')) {
      insuranceClaims
        .filter((c) => c.id.toLowerCase().includes(q) || c.patientName.toLowerCase().includes(q) || c.providerName.toLowerCase().includes(q))
        .slice(0, 2)
        .forEach((c) =>
          hits.push({
            id: c.id,
            label: `${c.id} · ${c.patientName}`,
            sublabel: `${c.providerName} · ${c.status}`,
            category: 'Insurance',
            page: 'insurance',
          })
        );
    }

    if (allowedPages.includes('ambulance')) {
      ambulances
        .filter((a) => a.vehicleNumber.toLowerCase().includes(q) || a.driverName.toLowerCase().includes(q) || a.plateNumber.toLowerCase().includes(q))
        .slice(0, 2)
        .forEach((a) =>
          hits.push({
            id: a.id,
            label: `${a.vehicleNumber} · ${a.type}`,
            sublabel: `${a.driverName} · ${a.status}`,
            category: 'Ambulance',
            page: 'ambulance',
          })
        );
    }

    if (allowedPages.includes('feedback')) {
      feedbackList
        .filter((f) => f.patientName.toLowerCase().includes(q) || f.department.toLowerCase().includes(q))
        .slice(0, 2)
        .forEach((f) =>
          hits.push({
            id: f.id,
            label: `${f.patientName} · ${f.rating}★`,
            sublabel: `${f.department} · ${f.category}`,
            category: 'Feedback',
            page: 'feedback',
          })
        );
    }

    return hits.slice(0, 8);
  }, [searchQuery, allowedPages, patients, doctors, appointments, invoices, medicines, labTests, staff, queueTokens, emergencyCases, bloodRequests, insuranceClaims, ambulances, feedbackList]);

  const meta = PAGE_META[activePage];

  const getHitIcon = (category: string) => {
    switch (category) {
      case 'Patients':
        return <Users className="h-4 w-4 text-[#2563EB]" />;
      case 'Doctors':
        return <Stethoscope className="h-4 w-4 text-[#16B8A6]" />;
      case 'Appointments':
        return <CalendarClock className="h-4 w-4 text-[#2563EB]" />;
      case 'Queue':
        return <ListOrdered className="h-4 w-4 text-[#2563EB]" />;
      case 'Emergency':
        return <ShieldAlert className="h-4 w-4 text-red-600" />;
      case 'Billing':
        return <Receipt className="h-4 w-4 text-amber-600" />;
      case 'Pharmacy':
        return <Pill className="h-4 w-4 text-emerald-600" />;
      case 'Laboratory':
        return <FlaskConical className="h-4 w-4 text-indigo-600" />;
      case 'Blood Bank':
        return <Droplets className="h-4 w-4 text-rose-600" />;
      case 'Insurance':
        return <ShieldCheck className="h-4 w-4 text-emerald-600" />;
      case 'Ambulance':
        return <Ambulance className="h-4 w-4 text-red-600" />;
      case 'Feedback':
        return <MessageSquareHeart className="h-4 w-4 text-amber-500" />;
      default:
        return <Search className="h-4 w-4 text-slate-400" />;
    }
  };

  return (
    <header className="medicare-topbar no-print sticky top-0 z-30 flex h-[82px] items-center justify-between gap-4 border-b border-slate-200/70 dark:border-slate-800 bg-white/92 dark:bg-[#11232e]/94 backdrop-blur-xl px-4 sm:px-6 xl:px-8">
      {/* Left: Mobile Drawer Trigger + Context */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          type="button"
          onClick={onOpenMobileMenu}
          aria-label="Open navigation menu"
          className="lg:hidden rounded-lg p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <Menu className="h-5 w-5" />
        </button>
        <div className="min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-[.12em] text-[#168a79] truncate">{meta.breadcrumb}</p>
          <h1 className="font-display text-lg sm:text-xl font-bold tracking-tight text-[#18363a] dark:text-white truncate">
            {meta.title}
          </h1>
        </div>
      </div>

      {/* Center: Global Search + QR Lookup */}
      <div ref={searchBoxRef} className="relative hidden md:flex items-center gap-2 w-full max-w-md">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onFocus={() => setSearchFocused(true)}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setActiveResultIndex(0);
              setSearchFocused(true);
            }}
            placeholder="Search patients, doctors, invoices, medicines..."
            aria-label="Global hospital search and navigation"
            aria-controls="global-search-results"
            aria-expanded={searchFocused}
            onKeyDown={(event) => {
              if (event.key === 'ArrowDown' && searchResults.length) {
                event.preventDefault();
                setActiveResultIndex((current) => (current + 1) % searchResults.length);
              }
              if (event.key === 'ArrowUp' && searchResults.length) {
                event.preventDefault();
                setActiveResultIndex((current) => (current - 1 + searchResults.length) % searchResults.length);
              }
              if (event.key === 'Enter' && searchResults[activeResultIndex]) {
                const hit = searchResults[activeResultIndex];
                setActivePage(hit.page);
                setSearchFocused(false);
                setSearchQuery('');
              }
              if (event.key === 'Escape') {
                setSearchFocused(false);
                event.currentTarget.blur();
              }
            }}
            className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-[#F4F7FB] dark:bg-slate-800/80 py-2 pl-9 pr-11 text-sm text-[#263449] dark:text-slate-100 placeholder:text-slate-400 focus:border-[#2563EB] focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 transition-colors"
          />
          {!searchQuery && <kbd className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 rounded border border-slate-200 dark:border-slate-600 bg-white/70 dark:bg-slate-700 px-1.5 py-0.5 text-[10px] font-medium text-slate-400">Ctrl K</kbd>}
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              aria-label="Clear search"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
        <button
          type="button"
          onClick={() => setQrScannerOpen(true)}
          title="Scan Patient Wristband or Lab Report QR"
          aria-label="Scan QR code"
          className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-[#F4F7FB] dark:bg-slate-800/80 px-3 text-xs font-semibold text-[#142D4E] dark:text-slate-100 hover:bg-white dark:hover:bg-slate-700 transition-colors whitespace-nowrap shrink-0"
        >
          <QrCode className="h-4 w-4 text-[#2563EB] dark:text-[#16B8A6]" />
          <span>Scan QR</span>
        </button>

        <AnimatePresence>
          {searchFocused && searchQuery.trim().length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -6, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -4, scale: 0.98 }}
              transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
              id="global-search-results"
              role="listbox"
              aria-label="Search results"
              className="absolute left-0 right-0 mt-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-lg overflow-hidden z-50"
            >
              {searchResults.length === 0 ? (
                <div className="px-4 py-6 text-center text-sm text-slate-500 dark:text-slate-400">
                  No matching records found for “{searchQuery}”.
                </div>
              ) : (
                <ul className="divide-y divide-slate-100 dark:divide-slate-800">
                  {searchResults.map((hit, index) => (
                    <li key={`${hit.category}-${hit.id}`}>
                      <button
                        type="button"
                        role="option"
                        aria-selected={index === activeResultIndex}
                        onClick={() => {
                          setActivePage(hit.page);
                          setSearchFocused(false);
                          setSearchQuery('');
                        }}
                        className={`flex w-full items-center justify-between gap-3 px-4 py-2.5 text-left transition-colors ${index === activeResultIndex ? 'bg-slate-50 dark:bg-slate-800/70' : 'hover:bg-slate-50 dark:hover:bg-slate-800/70'}`}
                      >
                        <span className="flex items-center gap-3 min-w-0">
                          {getHitIcon(hit.category)}
                          <span className="min-w-0">
                            <span className="block text-sm font-medium text-[#1E293B] dark:text-slate-100 truncate">
                              {hit.label}
                            </span>
                            <span className="block text-xs text-slate-500 dark:text-slate-400 truncate">
                              {hit.sublabel}
                            </span>
                          </span>
                        </span>
                        <span className="text-xs font-medium text-slate-400 shrink-0">{hit.category}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Right: Theme Toggle, Notifications, User Profile */}
      <div className="flex items-center gap-2 shrink-0">
        <button
          type="button"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
        >
          {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
        </button>

        <button
          type="button"
          onClick={() => setActivePage('notifications')}
          aria-label="Open notification centre"
          className="relative flex h-9 items-center gap-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-2.5 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
        >
          <Bell className="h-4 w-4" />
          {unreadNotificationCount > 0 && (
            <span className="font-mono-num text-xs font-semibold text-[#2563EB] dark:text-[#16B8A6]">
              {unreadNotificationCount}
            </span>
          )}
        </button>

        {session && (
          <button
            type="button"
            onClick={() => setActivePage('settings')}
            className="hidden sm:flex items-center gap-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-1.5 text-left hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
          >
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-[#142D4E] text-xs font-bold text-white shrink-0">
              {session.name
                .split(' ')
                .slice(0, 2)
                .map((w) => w[0])
                .join('')}
            </div>
            <div className="leading-tight">
              <div className="text-xs font-semibold text-[#263449] dark:text-slate-100 whitespace-nowrap">
                {session.name}
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 whitespace-nowrap">
                {session.role}
              </div>
            </div>
          </button>
        )}
      </div>
    </header>
  );
};
