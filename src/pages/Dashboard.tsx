import React, { useMemo, useState } from 'react';
import {
  ArrowRight,
  BedDouble,
  Bell,
  CalendarClock,
  Clock,
  DollarSign,
  HeartPulse,
  Plus,
  Stethoscope,
  Users,
} from 'lucide-react';
import { useHospital } from '../context/HospitalContext';
import { StatCard } from '../components/StatCard';
import {
  AppointmentStatusChart,
  BedOccupancyChart,
  DepartmentBarChart,
  PatientRegistrationChart,
  RevenueAnalyticsChart,
} from '../components/Charts';
import {
  computeBedOccupancyByWard,
  computeDepartmentStats,
  computeMonthlyRegistrations,
  computeMonthlyRevenue,
  formatCurrency,
  getTodayIso,
} from '../services/dataService';

export const Dashboard: React.FC = () => {
  const [activityFilter, setActivityFilter] = useState<'All' | 'Patient care' | 'Operations' | 'System'>('All');
  const [notificationFilter, setNotificationFilter] = useState<'Priority' | 'Unread' | 'All'>('Priority');
  const {
    session,
    patients,
    doctors,
    appointments,
    wards,
    beds,
    invoices,
    activities,
    notifications,
    unreadNotificationCount,
    markNotificationRead,
    setActivePage,
    allowedPages,
    settings,
  } = useHospital();

  const today = getTodayIso();

  const stats = useMemo(() => {
    const todaysAppointments = appointments.filter((a) => a.date === today && a.status !== 'Cancelled').length;
    const availableBeds = beds.filter((b) => b.status === 'Available').length;
    const totalCollected = invoices.reduce((sum, inv) => sum + inv.paidAmount, 0);
    const totalPending = invoices.reduce((sum, inv) => sum + Math.max(0, inv.totalAmount - inv.paidAmount), 0);

    return {
      totalPatients: patients.length,
      totalDoctors: doctors.length,
      todaysAppointments,
      availableBeds,
      totalBeds: beds.length,
      monthlyRevenue: totalCollected,
      pendingPayments: totalPending,
      pendingInvoiceCount: invoices.filter((i) => i.paymentStatus !== 'Paid').length,
    };
  }, [patients.length, doctors.length, appointments, beds, invoices, today]);

  // 100% Data-driven chart series computed from live stored records
  const registrationChartData = useMemo(() => computeMonthlyRegistrations(patients, 6), [patients]);
  const revenueChartData = useMemo(() => computeMonthlyRevenue(invoices, 6), [invoices]);
  const departmentStats = useMemo(() => computeDepartmentStats(appointments, doctors), [appointments, doctors]);
  const bedOccupancyData = useMemo(() => computeBedOccupancyByWard(wards, beds), [wards, beds]);

  const appointmentStatusData = useMemo(() => {
    const countOf = (status: string) => appointments.filter((a) => a.status === status).length;
    return [
      { name: 'Scheduled', value: countOf('Scheduled'), color: '#2563EB' },
      { name: 'Completed', value: countOf('Completed'), color: '#16A34A' },
      { name: 'Pending', value: countOf('Pending'), color: '#F59E0B' },
      { name: 'Cancelled', value: countOf('Cancelled'), color: '#EF4444' },
    ].filter((d) => d.value > 0);
  }, [appointments]);

  const recentPatients = useMemo(
    () => [...patients].sort((a, b) => b.registrationDate.localeCompare(a.registrationDate)).slice(0, 5),
    [patients]
  );

  const visibleActivities = useMemo(() => {
    const patterns: Record<Exclude<typeof activityFilter, 'All'>, RegExp> = {
      'Patient care': /patient|appointment|emergency|queue|laboratory|clinical|emr/i,
      Operations: /billing|pharmacy|bed|blood|insurance|ambulance|staff|discharge/i,
      System: /system|setting|audit|report|notification/i,
    };
    return activities
      .filter((activity) => activityFilter === 'All' || patterns[activityFilter].test(`${activity.module} ${activity.message}`))
      .slice(0, 6);
  }, [activities, activityFilter]);

  const visibleNotifications = useMemo(() => {
    const severityRank = { critical: 0, warning: 1, info: 2, success: 3 } as const;
    return notifications
      .filter((notification) => {
        if (notificationFilter === 'Unread') return !notification.read;
        if (notificationFilter === 'Priority') return notification.severity === 'critical' || notification.severity === 'warning';
        return true;
      })
      .sort((a, b) => Number(a.read) - Number(b.read) || severityRank[a.severity] - severityRank[b.severity])
      .slice(0, 5);
  }, [notifications, notificationFilter]);

  const upcomingAppointments = useMemo(
    () =>
      appointments
        .filter((a) => a.date >= today && a.status !== 'Cancelled' && a.status !== 'Completed')
        .sort((a, b) => `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`))
        .slice(0, 5),
    [appointments, today]
  );

  const canOpen = (page: Parameters<typeof setActivePage>[0]) => allowedPages.includes(page);

  return (
    <div className="space-y-6">
      {/* Daily operations overview */}
      <section className="dashboard-welcome relative isolate overflow-hidden rounded-[26px] border border-[#d8e9e4] bg-white shadow-[0_18px_50px_-36px_rgba(17,67,61,.32)]">
        <div className="pointer-events-none absolute -right-24 -top-32 -z-10 h-80 w-80 rounded-full bg-[#e8f5f0] blur-2xl" />
        <div className="grid lg:grid-cols-[1.15fr_.85fr]">
          <div className="space-y-5 p-6 sm:p-8 xl:p-9">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-2 rounded-full border border-[#d8ece5] bg-[#f0f8f5] px-3 py-1.5 text-[11px] font-bold tracking-wide text-[#14796e]">
                <HeartPulse className="h-3.5 w-3.5" />
                {settings.hospitalName}
              </span>
              <span className="rounded-full bg-slate-50 px-3 py-1.5 text-[11px] font-medium text-slate-500">{today}</span>
            </div>
            <div className="space-y-2">
              <h2 className="font-display text-2xl sm:text-3xl xl:text-[34px] font-bold tracking-tight text-[#18363a] leading-tight [text-wrap:balance]">
                Welcome back, {session?.name ?? 'Administrator'}
              </h2>
              <p className="max-w-2xl text-sm leading-6 text-[#718488]">
                Your hospital at a glance. There are <span className="font-semibold text-[#294449] tabular-nums">{stats.todaysAppointments} appointments</span> today, <span className="font-semibold text-[#14796e] tabular-nums">{stats.availableBeds} beds ready</span> across {wards.length} wards, and <span className="font-semibold text-[#294449] tabular-nums">{unreadNotificationCount} alerts</span> to review.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2.5 pt-1">
              {canOpen('patients') && (
                <button
                  type="button"
                  onClick={() => setActivePage('patients')}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-[#14796e] px-4 py-2.5 text-xs font-semibold text-white shadow-[0_8px_18px_-10px_rgba(20,121,110,.9)] hover:bg-[#106b62] active:scale-[0.98] transition-all whitespace-nowrap"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Register Patient</span>
                </button>
              )}
              {canOpen('appointments') && (
                <button
                  type="button"
                  onClick={() => setActivePage('appointments')}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-[#dfe9e6] bg-white px-4 py-2.5 text-xs font-semibold text-[#294449] hover:bg-[#f6faf8] active:scale-[0.98] transition-all whitespace-nowrap"
                >
                  <CalendarClock className="h-3.5 w-3.5 text-[#168a79]" />
                  <span>Book Appointment</span>
                </button>
              )}
              {canOpen('beds') && (
                <button
                  type="button"
                  onClick={() => setActivePage('beds')}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-[#dfe9e6] bg-white px-4 py-2.5 text-xs font-semibold text-[#294449] hover:bg-[#f6faf8] active:scale-[0.98] transition-all whitespace-nowrap"
                >
                  <BedDouble className="h-3.5 w-3.5 text-[#168a79]" />
                  <span>Ward Occupancy</span>
                </button>
              )}
            </div>
          </div>

          <div className="dashboard-welcome-art relative m-3 mt-0 flex min-h-[210px] flex-col justify-between overflow-hidden rounded-[21px] bg-[#153f3d] p-5 text-white sm:m-4 sm:mt-4 lg:ml-0 lg:min-h-0">
            <div className="absolute -right-9 -top-16 h-48 w-48 rounded-full border border-white/10" />
            <div className="absolute -right-1 -top-8 h-32 w-32 rounded-full border border-white/10" />
            <div className="relative z-10 flex items-center justify-between gap-3">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[.17em] text-[#9bd8c9]">Today at a glance</p>
                <p className="mt-1 text-sm font-semibold text-white">Care teams are ready</p>
              </div>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-2.5 py-1 text-[10px] font-semibold text-[#d6f0e8]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#62d4a7]" /> Live workspace
              </span>
            </div>
            <div className="relative z-10 grid grid-cols-2 gap-3 pt-5">
              <div className="rounded-2xl border border-white/10 bg-white/[.08] p-3.5 backdrop-blur-sm">
                <div className="flex items-center gap-2 text-[#b8e4d8]"><CalendarClock className="h-4 w-4" /><span className="text-[10px] font-semibold uppercase tracking-wide">Appointments</span></div>
                <div className="mt-2 font-display text-2xl font-bold tabular-nums">{stats.todaysAppointments}</div>
                <div className="mt-0.5 text-[10px] text-white/60">Scheduled for today</div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[.08] p-3.5 backdrop-blur-sm">
                <div className="flex items-center gap-2 text-[#b8e4d8]"><BedDouble className="h-4 w-4" /><span className="text-[10px] font-semibold uppercase tracking-wide">Beds available</span></div>
                <div className="mt-2 font-display text-2xl font-bold tabular-nums">{stats.availableBeds}<span className="ml-1 text-sm font-medium text-white/55">/ {stats.totalBeds}</span></div>
                <div className="mt-0.5 text-[10px] text-white/60">Across {wards.length} wards</div>
              </div>
            </div>
            <div className="relative z-10 mt-3 flex items-center justify-between border-t border-white/10 pt-3 text-[10px] text-white/65">
              <span>{stats.totalPatients} registered patients</span>
              <span>{doctors.filter((d) => d.availability === 'Available').length} clinicians available</span>
            </div>
          </div>
        </div>
      </section>

      {/* KPI Overview Row (6 Animated Statistics Cards) */}
      <section aria-label="Hospital Key Metrics" className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6 gap-4">
        <StatCard
          label="Total Patients"
          value={stats.totalPatients}
          numericValue={stats.totalPatients}
          detail="Active registered profiles"
          icon={Users}
          tone="blue"
          onClick={canOpen('patients') ? () => setActivePage('patients') : undefined}
        />
        <StatCard
          label="Total Doctors"
          value={stats.totalDoctors}
          numericValue={stats.totalDoctors}
          detail={`${doctors.filter((d) => d.availability === 'Available').length} available on shift`}
          icon={Stethoscope}
          tone="teal"
          onClick={canOpen('doctors') ? () => setActivePage('doctors') : undefined}
        />
        <StatCard
          label="Today's Appointments"
          value={stats.todaysAppointments}
          numericValue={stats.todaysAppointments}
          detail={`Scheduled for ${today}`}
          icon={CalendarClock}
          tone="navy"
          onClick={canOpen('appointments') ? () => setActivePage('appointments') : undefined}
        />
        <StatCard
          label="Available Beds"
          value={`${stats.availableBeds} / ${stats.totalBeds}`}
          numericValue={stats.availableBeds}
          suffix={` / ${stats.totalBeds}`}
          detail={`${beds.filter((b) => b.status === 'Occupied').length} occupied · ${beds.filter((b) => b.status === 'Reserved').length} reserved`}
          icon={BedDouble}
          tone="teal"
          onClick={canOpen('beds') ? () => setActivePage('beds') : undefined}
        />
        <StatCard
          label="Collected Revenue"
          value={formatCurrency(stats.monthlyRevenue, settings.currencySymbol)}
          numericValue={stats.monthlyRevenue}
          formatter={(n) => formatCurrency(n, settings.currencySymbol)}
          detail="Sum of paid invoice amounts"
          icon={DollarSign}
          tone="blue"
          onClick={canOpen('billing') ? () => setActivePage('billing') : undefined}
        />
        <StatCard
          label="Pending Payments"
          value={formatCurrency(stats.pendingPayments, settings.currencySymbol)}
          numericValue={stats.pendingPayments}
          formatter={(n) => formatCurrency(n, settings.currencySymbol)}
          detail={`${stats.pendingInvoiceCount} open invoice(s)`}
          icon={Clock}
          tone="amber"
          onClick={canOpen('billing') ? () => setActivePage('billing') : undefined}
        />
      </section>

      {/* Primary Data-Driven Charts Row */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
          <div className="flex items-center justify-between gap-2 mb-4">
            <div>
              <h2 className="font-display text-base font-bold text-[#142D4E] dark:text-white">
                Patient Registrations (6 Months)
              </h2>
              <p className="text-xs text-[#64748B] dark:text-slate-400">
                Computed directly from patient registration dates
              </p>
            </div>
            {canOpen('reports') && (
              <button
                type="button"
                onClick={() => setActivePage('reports')}
                className="inline-flex items-center gap-1 text-xs font-medium text-[#2563EB] hover:underline whitespace-nowrap"
              >
                <span>Full Analytics</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
          <PatientRegistrationChart data={registrationChartData} />
        </div>

        <div className="lg:col-span-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
          <div className="flex items-center justify-between gap-2 mb-4">
            <div>
              <h2 className="font-display text-base font-bold text-[#142D4E] dark:text-white">
                Revenue & Receivables
              </h2>
              <p className="text-xs text-[#64748B] dark:text-slate-400">
                Collected vs. pending balances from hospital invoices
              </p>
            </div>
            {canOpen('billing') && (
              <button
                type="button"
                onClick={() => setActivePage('billing')}
                className="inline-flex items-center gap-1 text-xs font-medium text-[#2563EB] hover:underline whitespace-nowrap"
              >
                <span>Open Billing</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
          <RevenueAnalyticsChart data={revenueChartData} />
        </div>
      </section>

      {/* Bed Occupancy & Department Analytics Row */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
          <div className="flex items-center justify-between gap-2 mb-3">
            <div>
              <h2 className="font-display text-base font-bold text-[#142D4E] dark:text-white">
                Bed Occupancy by Ward
              </h2>
              <p className="text-xs text-[#64748B] dark:text-slate-400">
                Available (Green), Occupied (Red), and Reserved (Amber)
              </p>
            </div>
            {canOpen('beds') && (
              <button
                type="button"
                onClick={() => setActivePage('beds')}
                className="text-xs font-medium text-[#2563EB] hover:underline whitespace-nowrap"
              >
                Manage Wards
              </button>
            )}
          </div>
          <BedOccupancyChart data={bedOccupancyData} />
        </div>

        <div className="lg:col-span-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
          <div className="flex items-center justify-between gap-2 mb-3">
            <div>
              <h2 className="font-display text-base font-bold text-[#142D4E] dark:text-white">
                Department Workload
              </h2>
              <p className="text-xs text-[#64748B] dark:text-slate-400">
                Total scheduled & completed visits per clinical department
              </p>
            </div>
            {canOpen('doctors') && (
              <button
                type="button"
                onClick={() => setActivePage('doctors')}
                className="text-xs font-medium text-[#2563EB] hover:underline whitespace-nowrap"
              >
                View Doctors
              </button>
            )}
          </div>
          <DepartmentBarChart data={departmentStats} />
        </div>
      </section>

      {/* Secondary Row: Appointment Stats, Upcoming Appointments, Recent Registrations */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
          <h2 className="font-display text-base font-bold text-[#142D4E] dark:text-white">
            Appointment Analytics
          </h2>
          <p className="text-xs text-[#64748B] dark:text-slate-400">
            Live breakdown across all statuses
          </p>
          <AppointmentStatusChart data={appointmentStatusData} />
          <div className="mt-2 grid grid-cols-2 gap-2 border-t border-slate-100 dark:border-slate-800 pt-3">
            {appointmentStatusData.map((item) => (
              <div key={item.name} className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                  <span
                    className="h-2.5 w-2.5 rounded-sm shrink-0"
                    style={{ backgroundColor: item.color }}
                  />
                  <span>{item.name}</span>
                </span>
                <span className="font-mono-num font-semibold text-[#142D4E] dark:text-white">
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 flex flex-col">
          <div className="flex items-center justify-between gap-2 mb-3">
            <div>
              <h2 className="font-display text-base font-bold text-[#142D4E] dark:text-white">
                Upcoming Appointments
              </h2>
              <p className="text-xs text-[#64748B] dark:text-slate-400">Next scheduled visits</p>
            </div>
            {canOpen('appointments') && (
              <button
                type="button"
                onClick={() => setActivePage('appointments')}
                className="text-xs font-medium text-[#2563EB] hover:underline whitespace-nowrap"
              >
                Manage
              </button>
            )}
          </div>
          <div className="divide-y divide-slate-100 dark:divide-slate-800 flex-1">
            {upcomingAppointments.length === 0 ? (
              <p className="py-8 text-center text-xs text-slate-500 dark:text-slate-400">
                No upcoming appointments scheduled.
              </p>
            ) : (
              upcomingAppointments.map((apt) => (
                <div key={apt.id} className="py-3 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-[#1E293B] dark:text-slate-100 truncate">
                      {apt.patientName}
                    </p>
                    <p className="text-xs text-[#64748B] dark:text-slate-400 truncate">
                      {apt.doctorName} · {apt.department}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="font-mono-num text-xs font-semibold text-[#142D4E] dark:text-slate-200">
                      {apt.time}
                    </div>
                    <div className="font-mono-num text-[11px] text-slate-400">{apt.date}</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="lg:col-span-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 flex flex-col">
          <div className="flex items-center justify-between gap-2 mb-3">
            <div>
              <h2 className="font-display text-base font-bold text-[#142D4E] dark:text-white">
                Recent Patient Registrations
              </h2>
              <p className="text-xs text-[#64748B] dark:text-slate-400">Latest patient intake</p>
            </div>
            {canOpen('patients') && (
              <button
                type="button"
                onClick={() => setActivePage('patients')}
                className="text-xs font-medium text-[#2563EB] hover:underline whitespace-nowrap"
              >
                View All
              </button>
            )}
          </div>
          <div className="divide-y divide-slate-100 dark:divide-slate-800 flex-1">
            {recentPatients.map((patient) => (
              <div key={patient.id} className="py-3 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#2563EB]/10 text-xs font-bold text-[#2563EB]">
                    {patient.fullName
                      .split(' ')
                      .slice(0, 2)
                      .map((w) => w[0])
                      .join('')}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-[#1E293B] dark:text-slate-100 truncate">
                      {patient.fullName}
                    </p>
                    <p className="text-xs text-[#64748B] dark:text-slate-400 truncate">
                      {patient.id} · {patient.age}y · {patient.bloodGroup}
                    </p>
                  </div>
                </div>
                <div className="font-mono-num text-xs text-slate-400 shrink-0">
                  {patient.registrationDate}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom Row: Notification Centre & Recent Patient Activity */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
            <div className="flex items-center gap-2">
              <Bell className="h-4 w-4 text-[#2563EB]" />
              <h2 className="font-display text-base font-bold text-[#142D4E] dark:text-white">
                Notification Centre
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex gap-1 rounded-xl bg-slate-50 p-1 dark:bg-slate-800" role="group" aria-label="Filter notifications">
                {(['Priority', 'Unread', 'All'] as const).map((filter) => (
                  <button
                    key={filter}
                    type="button"
                    aria-pressed={notificationFilter === filter}
                    onClick={() => setNotificationFilter(filter)}
                    className={`rounded-lg px-2.5 py-1.5 text-[11px] font-semibold transition-colors ${notificationFilter === filter ? 'bg-white text-[#14796e] shadow-sm dark:bg-slate-700 dark:text-emerald-300' : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white'}`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
              <button
                type="button"
                onClick={() => setActivePage('notifications')}
                className="text-xs font-medium text-[#2563EB] hover:underline whitespace-nowrap"
              >
                All ({unreadNotificationCount})
              </button>
            </div>
          </div>
          <div className="divide-y divide-slate-100 dark:divide-slate-800" aria-live="polite">
            {visibleNotifications.length === 0 ? (
              <p className="py-8 text-center text-xs text-slate-500 dark:text-slate-400">
                {notificationFilter === 'Priority' ? 'No critical or warning alerts right now.' : 'No notifications in this view.'}
              </p>
            ) : visibleNotifications.map((n) => (
              <div key={n.id} className="py-3 flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 text-xs">
                    <span
                      className={`font-semibold ${
                        n.severity === 'critical'
                          ? 'text-rose-600 dark:text-rose-400'
                          : n.severity === 'warning'
                            ? 'text-amber-600 dark:text-amber-400'
                            : n.severity === 'success'
                              ? 'text-emerald-600 dark:text-emerald-400'
                              : 'text-[#2563EB]'
                      }`}
                    >
                      {n.category}
                    </span>
                    <span className="text-slate-300 dark:text-slate-700">·</span>
                    <span className="font-mono-num text-slate-400">{n.timestamp}</span>
                    {!n.read && (
                      <>
                        <span className="text-slate-300 dark:text-slate-700">·</span>
                        <span className="font-semibold text-[#16B8A6]">Unread</span>
                      </>
                    )}
                  </div>
                  {canOpen(n.targetPage) ? (
                    <button
                      type="button"
                      onClick={() => {
                        markNotificationRead(n.id);
                        setActivePage(n.targetPage);
                      }}
                      className="mt-1 block text-left text-sm font-medium text-[#1E293B] hover:text-[#14796e] dark:text-slate-100 dark:hover:text-emerald-300"
                    >
                      {n.title}
                    </button>
                  ) : (
                    <p className="mt-1 text-sm font-medium text-[#1E293B] dark:text-slate-100">{n.title}</p>
                  )}
                  <p className="text-xs text-[#64748B] dark:text-slate-400">{n.message}</p>
                </div>
                {!n.read && (
                  <button
                    type="button"
                    onClick={() => markNotificationRead(n.id)}
                    className="shrink-0 text-xs font-medium text-slate-500 hover:text-[#2563EB]"
                  >
                    Mark read
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
          <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="font-display text-base font-bold text-[#142D4E] dark:text-white">
                Recent Patient & Clinical Activity
              </h2>
              <p className="text-xs text-[#64748B] dark:text-slate-400">
                Live audit feed across all MediCare Pro modules
              </p>
            </div>
            <div className="flex flex-wrap gap-1 rounded-xl bg-slate-50 p-1 dark:bg-slate-800" role="group" aria-label="Filter activity timeline">
              {(['All', 'Patient care', 'Operations', 'System'] as const).map((filter) => (
                <button
                  key={filter}
                  type="button"
                  aria-pressed={activityFilter === filter}
                  onClick={() => setActivityFilter(filter)}
                  className={`rounded-lg px-2.5 py-1.5 text-[11px] font-semibold transition-colors ${activityFilter === filter ? 'bg-white text-[#14796e] shadow-sm dark:bg-slate-700 dark:text-emerald-300' : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white'}`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>
          <div className="divide-y divide-slate-100 dark:divide-slate-800" aria-live="polite">
            {visibleActivities.length === 0 ? (
              <p className="py-8 text-center text-xs text-slate-500 dark:text-slate-400">No activity in this category yet.</p>
            ) : visibleActivities.map((act) => (
              <div key={act.id} className="relative py-3 pl-5 flex items-start justify-between gap-3 before:absolute before:left-1 before:top-5 before:h-2 before:w-2 before:rounded-full before:bg-[#54aa97] before:ring-4 before:ring-[#eaf5f2] dark:before:ring-[#183b3a]">
                <div className="min-w-0">
                  <p className="text-sm text-[#1E293B] dark:text-slate-100">{act.message}</p>
                  <p className="mt-0.5 text-xs text-[#64748B] dark:text-slate-400">
                    {act.actor} · {act.module}
                  </p>
                </div>
                <span className="font-mono-num text-xs text-slate-400 shrink-0" title={act.timestamp}>
                  {act.timestamp}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
