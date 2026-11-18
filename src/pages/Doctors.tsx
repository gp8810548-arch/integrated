import React, { useMemo, useState } from 'react';
import {
  BriefcaseMedical,
  CalendarClock,
  Clock,
  Edit3,
  Mail,
  Phone,
  Plus,
  Search,
  Stethoscope,
  Trash2,
} from 'lucide-react';
import { useHospital } from '../context/HospitalContext';
import { ConfirmationDialog, Modal } from '../components/Modal';
import { Doctor, DoctorAvailability } from '../types/hospital';
import { formatCurrency } from '../services/dataService';

const AVAILABILITIES: DoctorAvailability[] = ['Available', 'In Consultation', 'On Leave', 'Off Duty'];
const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

interface DoctorFormState {
  name: string;
  specialization: string;
  department: string;
  experienceYears: string;
  contact: string;
  email: string;
  consultationFee: string;
  availability: DoctorAvailability;
  shiftHours: string;
  scheduleDays: string[];
}

const EMPTY_DOC_FORM: DoctorFormState = {
  name: '',
  specialization: '',
  department: '',
  experienceYears: '5',
  contact: '',
  email: '',
  consultationFee: '150',
  availability: 'Available',
  shiftHours: '09:00 - 17:00',
  scheduleDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
};

export const Doctors: React.FC = () => {
  const { doctors, appointments, addDoctor, updateDoctor, deleteDoctor, settings } = useHospital();

  const [search, setSearch] = useState('');
  const [specFilter, setSpecFilter] = useState('All');

  const [modalOpen, setModalOpen] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState<Doctor | null>(null);
  const [form, setForm] = useState<DoctorFormState>(EMPTY_DOC_FORM);
  const [profileDoctor, setProfileDoctor] = useState<Doctor | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Doctor | null>(null);

  const specializations = useMemo(() => {
    const unique = Array.from(new Set(doctors.map((d) => d.specialization)));
    return ['All', ...unique];
  }, [doctors]);

  const filteredDoctors = useMemo(() => {
    const q = search.trim().toLowerCase();
    return doctors.filter((d) => {
      const matchesQuery =
        !q ||
        d.name.toLowerCase().includes(q) ||
        d.id.toLowerCase().includes(q) ||
        d.specialization.toLowerCase().includes(q) ||
        d.department.toLowerCase().includes(q);
      const matchesSpec = specFilter === 'All' || d.specialization === specFilter;
      return matchesQuery && matchesSpec;
    });
  }, [doctors, search, specFilter]);

  const doctorSchedule = useMemo(() => {
    if (!profileDoctor) return [];
    return appointments
      .filter((a) => a.doctorId === profileDoctor.id)
      .sort((a, b) => `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`));
  }, [appointments, profileDoctor]);

  const openAdd = () => {
    setEditingDoctor(null);
    setForm(EMPTY_DOC_FORM);
    setModalOpen(true);
  };

  const openEdit = (doc: Doctor) => {
    setEditingDoctor(doc);
    setForm({
      name: doc.name,
      specialization: doc.specialization,
      department: doc.department,
      experienceYears: String(doc.experienceYears),
      contact: doc.contact,
      email: doc.email,
      consultationFee: String(doc.consultationFee),
      availability: doc.availability,
      shiftHours: doc.shiftHours,
      scheduleDays: doc.scheduleDays,
    });
    setModalOpen(true);
  };

  const toggleDay = (day: string) => {
    setForm((prev) => ({
      ...prev,
      scheduleDays: prev.scheduleDays.includes(day)
        ? prev.scheduleDays.filter((d) => d !== day)
        : [...prev.scheduleDays, day],
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      name: form.name.trim(),
      specialization: form.specialization.trim(),
      department: form.department.trim() || form.specialization.trim(),
      experienceYears: Math.max(0, Number(form.experienceYears) || 0),
      contact: form.contact.trim(),
      email: form.email.trim(),
      consultationFee: Math.max(0, Number(form.consultationFee) || 0),
      availability: form.availability,
      shiftHours: form.shiftHours.trim() || '09:00 - 17:00',
      scheduleDays: form.scheduleDays.length > 0 ? form.scheduleDays : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    };

    if (editingDoctor) {
      updateDoctor({ ...editingDoctor, ...payload });
    } else {
      addDoctor(payload);
    }
    setModalOpen(false);
  };

  const getAvailabilityStyle = (status: DoctorAvailability) => {
    switch (status) {
      case 'Available':
        return 'text-emerald-700 dark:text-emerald-400 bg-emerald-500/10';
      case 'In Consultation':
        return 'text-[#2563EB] dark:text-blue-400 bg-[#2563EB]/10';
      case 'On Leave':
        return 'text-amber-700 dark:text-amber-400 bg-amber-500/10';
      case 'Off Duty':
        return 'text-slate-600 dark:text-slate-400 bg-slate-500/10';
    }
  };

  return (
    <div className="space-y-5">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4">
        <div className="flex flex-1 flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[220px]">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search doctors by name, ID, specialization, or department..."
              className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-[#F3F6FB] dark:bg-slate-800 py-2 pl-9 pr-3 text-sm focus:border-[#2563EB] focus:bg-white dark:focus:bg-slate-900 focus:outline-none"
            />
          </div>

          <select
            aria-label="Filter by specialization"
            value={specFilter}
            onChange={(e) => setSpecFilter(e.target.value)}
            className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm focus:border-[#2563EB] focus:outline-none"
          >
            {specializations.map((spec) => (
              <option key={spec} value={spec}>
                {spec === 'All' ? 'All Specializations' : spec}
              </option>
            ))}
          </select>
        </div>

        <button
          type="button"
          onClick={openAdd}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#2563EB] px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 active:scale-[0.98] transition-all whitespace-nowrap shrink-0"
        >
          <Plus className="h-4 w-4" />
          <span>Add Doctor</span>
        </button>
      </div>

      {/* Doctor Profile Cards Grid */}
      {filteredDoctors.length === 0 ? (
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-12 text-center">
          <Stethoscope className="mx-auto h-9 w-9 text-slate-300 dark:text-slate-600" />
          <h3 className="mt-3 font-display text-sm font-bold text-[#142D4E] dark:text-white">
            No doctors match your filters
          </h3>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Clear your search or add a physician profile to the directory.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filteredDoctors.map((doc) => {
            const activeCount = appointments.filter(
              (a) => a.doctorId === doc.id && a.status !== 'Cancelled'
            ).length;

            return (
              <article
                key={doc.id}
                onClick={() => setProfileDoctor(doc)}
                className="cursor-pointer rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 flex flex-col justify-between gap-4 surface-hover hover:border-[#2563EB]/40"
              >
                <div>
                  {/* Header */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3.5 min-w-0">
                      {doc.avatarUrl ? (
                        <img
                          src={doc.avatarUrl}
                          alt={doc.name}
                          referrerPolicy="no-referrer"
                          className="h-14 w-14 rounded-full object-cover border border-slate-200 dark:border-slate-700 shrink-0"
                        />
                      ) : (
                        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#142D4E] to-[#16B8A6] text-base font-bold text-white shadow-sm">
                          {doc.name
                            .replace('Dr. ', '')
                            .split(' ')
                            .slice(0, 2)
                            .map((p) => p[0])
                            .join('')}
                        </div>
                      )}
                      <div className="min-w-0">
                        <div className="font-mono-num text-[11px] font-semibold text-[#2563EB]">
                          {doc.id}
                        </div>
                        <h3 className="font-display text-base font-bold text-[#142D4E] dark:text-white truncate">
                          {doc.name}
                        </h3>
                        <p className="text-xs font-medium text-[#16B8A6] truncate">
                          {doc.specialization} · {doc.department}
                        </p>
                      </div>
                    </div>

                    <span
                      className={`rounded-md px-2 py-1 text-[11px] font-semibold whitespace-nowrap shrink-0 ${getAvailabilityStyle(
                        doc.availability
                      )}`}
                    >
                      {doc.availability}
                    </span>
                  </div>

                  {/* Details */}
                  <div className="mt-4 grid grid-cols-3 gap-2 border-t border-b border-slate-100 dark:border-slate-800 py-3 text-xs">
                    <div>
                      <span className="text-slate-400">Experience</span>
                      <div className="mt-0.5 font-semibold text-[#142D4E] dark:text-slate-100 flex items-center gap-1 tabular-nums">
                        <BriefcaseMedical className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                        <span>{doc.experienceYears} yrs</span>
                      </div>
                    </div>
                    <div>
                      <span className="text-slate-400">Fee</span>
                      <div className="mt-0.5 font-mono-num font-bold text-[#142D4E] dark:text-white">
                        {formatCurrency(doc.consultationFee, settings.currencySymbol)}
                      </div>
                    </div>
                    <div>
                      <span className="text-slate-400">Bookings</span>
                      <div className="mt-0.5 font-mono-num font-semibold text-[#2563EB]">
                        {activeCount}
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                    <div className="flex items-center gap-2">
                      <Phone className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                      <span className="font-mono-num">{doc.contact}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{doc.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                      <span>
                        {doc.scheduleDays.join(', ')} · <span className="font-mono-num">{doc.shiftHours}</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="flex items-center justify-end gap-2 pt-1" onClick={(e) => e.stopPropagation()}>
                  <button
                    type="button"
                    onClick={() => openEdit(doc)}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 dark:border-slate-700 px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
                  >
                    <Edit3 className="h-3.5 w-3.5" />
                    <span>Edit</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeleteTarget(doc)}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-rose-200 dark:border-rose-900/60 px-3 py-1.5 text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    <span>Remove</span>
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* Doctor Profile & Appointments Modal */}
      <Modal
        open={Boolean(profileDoctor)}
        onClose={() => setProfileDoctor(null)}
        title={profileDoctor?.name ?? 'Doctor Profile'}
        subtitle={profileDoctor ? `${profileDoctor.id} · ${profileDoctor.specialization}` : undefined}
        maxWidthClass="max-w-2xl"
      >
        {profileDoctor && (
          <div className="space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-3.5">
                {profileDoctor.avatarUrl ? (
                  <img
                    src={profileDoctor.avatarUrl}
                    alt={profileDoctor.name}
                    referrerPolicy="no-referrer"
                    className="h-14 w-14 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                  />
                ) : (
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-[#142D4E] to-[#16B8A6] text-base font-bold text-white">
                    {profileDoctor.name
                      .replace('Dr. ', '')
                      .split(' ')
                      .slice(0, 2)
                      .map((p) => p[0])
                      .join('')}
                  </div>
                )}
                <div>
                  <div className="text-sm font-bold text-[#142D4E] dark:text-white">
                    {profileDoctor.department} Department
                  </div>
                  <div className="text-xs text-slate-500">
                    {profileDoctor.experienceYears} years experience ·{' '}
                    {formatCurrency(profileDoctor.consultationFee, settings.currencySymbol)} consultation
                  </div>
                  <div className="text-xs text-slate-500">
                    {profileDoctor.scheduleDays.join(', ')} ({profileDoctor.shiftHours})
                  </div>
                </div>
              </div>
              <span className={`rounded-md px-2.5 py-1 text-xs font-semibold ${getAvailabilityStyle(profileDoctor.availability)}`}>
                {profileDoctor.availability}
              </span>
            </div>

            <div>
              <h3 className="flex items-center gap-2 font-display text-sm font-bold text-[#142D4E] dark:text-white">
                <CalendarClock className="h-4 w-4 text-[#2563EB]" />
                <span>Assigned Appointments ({doctorSchedule.length})</span>
              </h3>
              <div className="mt-2 divide-y divide-slate-100 dark:divide-slate-800 border border-slate-200 dark:border-slate-800 rounded-lg">
                {doctorSchedule.length === 0 ? (
                  <p className="p-4 text-xs text-slate-500">No appointments currently assigned.</p>
                ) : (
                  doctorSchedule.map((apt) => (
                    <div key={apt.id} className="p-3 flex items-center justify-between gap-3 text-xs">
                      <div>
                        <div className="font-semibold text-[#142D4E] dark:text-white">
                          {apt.patientName} ({apt.patientId})
                        </div>
                        <div className="text-slate-500">{apt.reason}</div>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="font-mono-num font-semibold">
                          {apt.date} {apt.time}
                        </div>
                        <div className="text-slate-500">{apt.status}</div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Add / Edit Doctor Modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingDoctor ? `Edit Doctor · ${editingDoctor.id}` : 'Add New Doctor'}
        subtitle="Configure physician specialization, department, availability, and consultation fee"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                Doctor Full Name *
              </label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g., Dr. Kavita Sharma"
                className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm focus:border-[#2563EB] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                Specialization *
              </label>
              <input
                type="text"
                required
                value={form.specialization}
                onChange={(e) => setForm({ ...form, specialization: e.target.value })}
                placeholder="e.g., Cardiology"
                className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm focus:border-[#2563EB] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                Department *
              </label>
              <input
                type="text"
                required
                value={form.department}
                onChange={(e) => setForm({ ...form, department: e.target.value })}
                placeholder="e.g., Cardiology"
                className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm focus:border-[#2563EB] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                Experience (Years) *
              </label>
              <input
                type="number"
                min={0}
                max={65}
                required
                value={form.experienceYears}
                onChange={(e) => setForm({ ...form, experienceYears: e.target.value })}
                className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm focus:border-[#2563EB] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                Consultation Fee ({settings.currencySymbol}) *
              </label>
              <input
                type="number"
                min={0}
                step="5"
                required
                value={form.consultationFee}
                onChange={(e) => setForm({ ...form, consultationFee: e.target.value })}
                className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm focus:border-[#2563EB] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                Contact Phone *
              </label>
              <input
                type="tel"
                required
                value={form.contact}
                onChange={(e) => setForm({ ...form, contact: e.target.value })}
                placeholder="+1 (555) 201-4410"
                className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm focus:border-[#2563EB] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                Email *
              </label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="doctor@medicarepro.demo"
                className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm focus:border-[#2563EB] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                Availability
              </label>
              <select
                value={form.availability}
                onChange={(e) => setForm({ ...form, availability: e.target.value as DoctorAvailability })}
                className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm focus:border-[#2563EB] focus:outline-none"
              >
                {AVAILABILITIES.map((a) => (
                  <option key={a} value={a}>
                    {a}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                Shift Hours
              </label>
              <input
                type="text"
                value={form.shiftHours}
                onChange={(e) => setForm({ ...form, shiftHours: e.target.value })}
                placeholder="09:00 - 17:00"
                className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm focus:border-[#2563EB] focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <span className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5">
                Schedule Days
              </span>
              <div className="flex flex-wrap gap-1.5">
                {DAYS.map((day) => {
                  const selected = form.scheduleDays.includes(day);
                  return (
                    <button
                      key={day}
                      type="button"
                      onClick={() => toggleDay(day)}
                      className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
                        selected
                          ? 'bg-[#142D4E] text-white'
                          : 'border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="rounded-lg border border-slate-200 dark:border-slate-700 px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg bg-[#2563EB] px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
            >
              {editingDoctor ? 'Save Profile' : 'Add Doctor'}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmationDialog
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => {
          if (deleteTarget) deleteDoctor(deleteTarget.id);
        }}
        title="Remove Doctor Profile"
        message={`Remove ${deleteTarget?.name} (${deleteTarget?.id}) from the active physician directory?`}
        confirmLabel="Remove Doctor"
      />
    </div>
  );
};
