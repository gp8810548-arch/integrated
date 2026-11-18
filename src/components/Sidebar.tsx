import React from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  Activity,
  Ambulance,
  BarChart3,
  BedDouble,
  Bell,
  CalendarClock,
  ChevronLeft,
  ChevronRight,
  ClipboardCheck,
  Droplets,
  FileHeart,
  FlaskConical,
  LayoutDashboard,
  ListOrdered,
  LogOut,
  MessageSquareHeart,
  Pill,
  Radio,
  Receipt,
  ScrollText,
  Settings,
  ShieldAlert,
  ShieldCheck,
  Stethoscope,
  UserCog,
  Users,
  X,
} from 'lucide-react';
import { useHospital } from '../context/HospitalContext';
import { NavPage } from '../types/hospital';

interface SidebarProps {
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

interface NavItemConfig {
  id: NavPage;
  label: string;
  icon: React.FC<{ className?: string }>;
  badge?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({ mobileOpen, onCloseMobile }) => {
  const {
    activePage,
    setActivePage,
    allowedPages,
    sidebarCollapsed,
    setSidebarCollapsed,
    unreadNotificationCount,
    queueTokens,
    emergencyCases,
    discharges,
    bloodRequests,
    ambulanceTrips,
    logout,
    session,
  } = useHospital();

  const waitingQueueCount = queueTokens.filter((q) => q.status === 'Waiting').length;
  const activeEmergencyCount = emergencyCases.filter((e) => e.treatmentStatus !== 'Discharged').length;
  const pendingDischargeCount = discharges.filter((d) => d.status !== 'Completed').length;
  const pendingBloodReqCount = bloodRequests.filter((r) => r.status === 'Pending').length;
  const activeTripCount = ambulanceTrips.filter(
    (t) => t.status !== 'Completed' && t.status !== 'Cancelled'
  ).length;

  const sections: { heading: string; items: NavItemConfig[] }[] = [
    {
      heading: 'Main',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'command-centre', label: 'Command Centre', icon: Radio },
      ],
    },
    {
      heading: 'Hospital Management',
      items: [
        { id: 'patients', label: 'Patients', icon: Users },
        { id: 'emr', label: 'Medical Records (EMR)', icon: FileHeart },
        { id: 'emergency', label: 'Emergency', icon: ShieldAlert, badge: activeEmergencyCount },
        { id: 'doctors', label: 'Doctors', icon: Stethoscope },
        { id: 'appointments', label: 'Appointments', icon: CalendarClock },
        { id: 'queue', label: 'Patient Queue', icon: ListOrdered, badge: waitingQueueCount },
        { id: 'beds', label: 'Beds & Wards', icon: BedDouble },
        { id: 'discharge', label: 'Discharge', icon: ClipboardCheck, badge: pendingDischargeCount },
      ],
    },
    {
      heading: 'Operations',
      items: [
        { id: 'blood-bank', label: 'Blood Bank', icon: Droplets, badge: pendingBloodReqCount },
        { id: 'insurance', label: 'Insurance', icon: ShieldCheck },
        { id: 'billing', label: 'Billing', icon: Receipt },
        { id: 'pharmacy', label: 'Pharmacy', icon: Pill },
        { id: 'laboratory', label: 'Laboratory', icon: FlaskConical },
        { id: 'staff', label: 'Staff', icon: UserCog },
        { id: 'ambulance', label: 'Ambulance', icon: Ambulance, badge: activeTripCount },
        { id: 'feedback', label: 'Patient Feedback', icon: MessageSquareHeart },
      ],
    },
    {
      heading: 'Analytics',
      items: [{ id: 'reports', label: 'Reports', icon: BarChart3 }],
    },
    {
      heading: 'System',
      items: [
        { id: 'audit-logs', label: 'Audit Logs', icon: ScrollText },
        {
          id: 'notifications',
          label: 'Notifications',
          icon: Bell,
          badge: unreadNotificationCount,
        },
        { id: 'settings', label: 'Settings', icon: Settings },
      ],
    },
  ];

  const handleSelect = (page: NavPage) => {
    setActivePage(page);
    onCloseMobile();
  };

  const renderSidebarContent = (isMobile = false) => {
    const isCollapsed = sidebarCollapsed && !isMobile;

    return (
      <div className="medicare-sidebar flex h-full flex-col bg-white text-slate-700 select-none">
        {/* Brand Header */}
        <div className="flex h-[76px] items-center justify-between border-b border-slate-100 px-4">
          <button
            type="button"
            onClick={() => handleSelect('dashboard')}
            className="flex items-center gap-3 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#168A79] rounded-lg"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[14px] bg-gradient-to-br from-[#1c9c89] to-[#14796e] text-white shadow-[0_8px_20px_-9px_rgba(22,138,121,.75)]">
              <Activity className="h-5 w-5" />
            </div>
            {!isCollapsed && (
              <span className="font-display text-[15px] font-bold tracking-tight text-[#18363a] whitespace-nowrap">
                MediCare Pro
              </span>
            )}
          </button>

          {isMobile ? (
            <button
              type="button"
              onClick={onCloseMobile}
              aria-label="Close navigation menu"
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-800"
            >
              <X className="h-5 w-5" />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              className="hidden lg:flex h-7 w-7 items-center justify-center rounded-md text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
            >
              {sidebarCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            </button>
          )}
        </div>

        {/* Navigation Sections */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-5" aria-label="Main Hospital Navigation">
          {sections.map((section, idx) => {
            const visibleItems = section.items.filter((item) => allowedPages.includes(item.id));
            if (visibleItems.length === 0) return null;
            return (
              <div
                key={section.heading}
                className={idx > 0 ? 'border-t border-slate-100 pt-4' : ''}
              >
                {!isCollapsed && (
                  <div className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[.14em] text-slate-400">
                    {section.heading}
                  </div>
                )}
                <ul className="space-y-0.5">
                  {visibleItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activePage === item.id;
                    return (
                      <li key={item.id} className="relative group/nav">
                        <button
                          type="button"
                          onClick={() => handleSelect(item.id)}
                          aria-label={item.label}
                          aria-current={isActive ? 'page' : undefined}
                          className={`relative flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition-colors whitespace-nowrap ${
                            isActive
                              ? 'text-[#14796e]'
                              : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                          }`}
                        >
                          {isActive && (
                            <motion.span
                              layoutId={isMobile ? 'sidebarActiveMobile' : 'sidebarActiveDesktop'}
                              transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                              className="absolute inset-y-0 left-0 right-0 rounded-xl bg-[#eaf5f2] ring-1 ring-inset ring-[#d9eee8] shadow-[inset_3px_0_0_#168a79]"
                            />
                          )}
                          <span className="relative z-10 flex items-center gap-3 min-w-0">
                            <Icon
                              className={`h-4 w-4 shrink-0 transition-transform duration-150 group-hover/nav:scale-110 ${
                                isActive ? 'text-[#168a79]' : 'text-slate-400 group-hover/nav:text-slate-700'
                              }`}
                            />
                            {!isCollapsed && <span className="truncate">{item.label}</span>}
                          </span>
                          {!isCollapsed && typeof item.badge === 'number' && item.badge > 0 && (
                            <span className="relative z-10 font-mono-num text-[11px] font-semibold text-[#14796e] bg-white/75 px-1.5 py-0.5 rounded-md">
                              {item.badge}
                            </span>
                          )}
                        </button>

                        {/* Tooltip when sidebar is collapsed */}
                        {isCollapsed && (
                          <div
                            role="tooltip"
                            className="pointer-events-none fixed left-[78px] z-50 hidden group-hover/nav:flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 shadow-lg whitespace-nowrap"
                          >
                            <span>{item.label}</span>
                            {typeof item.badge === 'number' && item.badge > 0 && (
                              <span className="font-mono-num text-[#16B8A6]">({item.badge})</span>
                            )}
                          </div>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
        </nav>

        {/* Account & Logout Footer */}
        <div className="border-t border-slate-100 p-3 space-y-2">
          {!isCollapsed && session && (
            <div className="px-3 py-1.5 text-xs text-slate-500">
              <div className="font-semibold text-slate-800 truncate">{session.name}</div>
              <div className="text-slate-400 truncate">
                {session.role} · {session.department}
              </div>
            </div>
          )}
          <button
            type="button"
            onClick={logout}
            title={isCollapsed ? 'Logout' : undefined}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-500 hover:bg-rose-50 hover:text-rose-700 transition-colors whitespace-nowrap"
          >
            <LogOut className="h-4 w-4 shrink-0" />
            {!isCollapsed && <span>Logout</span>}
          </button>
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={`no-print hidden lg:block shrink-0 transition-[width] duration-200 border-r border-slate-200/80 dark:border-slate-800 ${
          sidebarCollapsed ? 'w-[76px]' : 'w-[264px]'
        }`}
      >
        <div className="sticky top-0 h-screen">{renderSidebarContent(false)}</div>
      </aside>

      {/* Mobile Drawer Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <div className="no-print fixed inset-0 z-50 lg:hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="fixed inset-0 bg-slate-950/60 backdrop-blur-[2px]"
              onClick={onCloseMobile}
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 360, damping: 34 }}
              className="fixed inset-y-0 left-0 w-72 max-w-[85vw] shadow-2xl"
            >
              {renderSidebarContent(true)}
            </motion.aside>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
