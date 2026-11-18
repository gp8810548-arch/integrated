import React, { useEffect, useMemo, useState } from 'react';
import {
  BedDouble,
  CalendarClock,
  Download,
  Edit3,
  Eye,
  FilePlus2,
  FlaskConical,
  LayoutGrid,
  List,
  Mail,
  Phone,
  Plus,
  Printer,
  QrCode,
  Search,
  Trash2,
  UserPlus,
} from 'lucide-react';
import { useHospital } from '../context/HospitalContext';
import { DataTable, TableColumn } from '../components/DataTable';
import { ConfirmationDialog, Modal } from '../components/Modal';
import { PatientQrCode } from '../components/PatientQrCode';
import { BloodGroup, Patient } from '../types/hospital';
import { getTodayIso } from '../services/dataService';
import { buildPatientQrValue, downloadQrPng } from '../utils/qrCode';

const BLOOD_GROUPS: BloodGroup[] = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

interface PatientFormState {
  fullName: string;
  age: string;
  gender: 'Male' | 'Female' | 'Other';
  phone: string;
  email: string;
  address: string;
  bloodGroup: BloodGroup;
  emergencyContact: string;
  allergies: string;
}

const EMPTY_FORM: PatientFormState = {
  fullName: '',
  age: '',
  gender: 'Male',
  phone: '',
  email: '',
  address: '',
  bloodGroup: 'O+',
  emergencyContact: '',
  allergies: '',
};

export const Patients: React.FC = () => {
  const {
    patients,
    appointments,
    beds,
    doctors,
    labTests,
    settings,
    qrTarget,
    clearQrTarget,
    setQrScannerOpen,
    navigateToQrTarget,
    addPatient,
    updatePatient,
    deletePatient,
    addMedicalRecord,
  } = useHospital();

  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  const [search, setSearch] = useState('');
  const [bloodFilter, setBloodFilter] = useState<string>('All');
  const [genderFilter, setGenderFilter] = useState<string>('All');

  const [formModalOpen, setFormModalOpen] = useState(false);
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);
  const [formState, setFormState] = useState<PatientFormState>(EMPTY_FORM);
  const [formError, setFormError] = useState('');

  const [profilePatientId, setProfilePatientId] = useState<string | null>(null);
  const [wristbandPatientId, setWristbandPatientId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Patient | null>(null);

  // Medical history note form
  const [noteTitle, setNoteTitle] = useState('');
  const [noteDoctor, setNoteDoctor] = useState(doctors[0]?.name ?? 'Dr. Evelyn Reed');
  const [noteDepartment, setNoteDepartment] = useState(doctors[0]?.department ?? 'Cardiology');
  const [noteDetails, setNoteDetails] = useState('');

  const getPatientCareStatus = (patientId: string): { label: string; tone: string } => {
    const activeBed = beds.find(
      (b) => b.patientId === patientId && (b.status === 'Occupied' || b.status === 'Reserved')
    );
    if (activeBed?.status === 'Occupied') {
      return {
        label: `Inpatient · ${activeBed.bedNumber}`,
        tone: 'bg-rose-500/10 text-rose-700 dark:text-rose-400',
      };
    }
    if (activeBed?.status === 'Reserved') {
      return {
        label: `Bed Reserved · ${activeBed.bedNumber}`,
        tone: 'bg-amber-500/10 text-amber-700 dark:text-amber-400',
      };
    }
    return {
      label: 'Outpatient',
      tone: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400',
    };
  };

  const getInitials = (name: string) =>
    name
      .split(' ')
      .slice(0, 2)
      .map((w) => w[0])
      .join('')
      .toUpperCase();

  const filteredPatients = useMemo(() => {
    const q = search.trim().toLowerCase();
    return patients.filter((p) => {
      const matchesQuery =
        !q ||
        p.fullName.toLowerCase().includes(q) ||
        p.id.toLowerCase().includes(q) ||
        p.phone.toLowerCase().includes(q) ||
        p.email.toLowerCase().includes(q);
      const matchesBlood = bloodFilter === 'All' || p.bloodGroup === bloodFilter;
      const matchesGender = genderFilter === 'All' || p.gender === genderFilter;
      return matchesQuery && matchesBlood && matchesGender;
    });
  }, [patients, search, bloodFilter, genderFilter]);

  const profilePatient = useMemo(
    () => patients.find((p) => p.id === profilePatientId) ?? null,
    [patients, profilePatientId]
  );

  const profileBed = useMemo(() => {
    if (!profilePatient) return null;
    return (
      beds.find(
        (b) => b.patientId === profilePatient.id && (b.status === 'Occupied' || b.status === 'Reserved')
      ) ?? null
    );
  }, [beds, profilePatient]);

  const profileAppointments = useMemo(() => {
    if (!profilePatient) return [];
    return appointments
      .filter((a) => a.patientId === profilePatient.id)
      .sort((a, b) => `${b.date} ${b.time}`.localeCompare(`${a.date} ${a.time}`));
  }, [appointments, profilePatient]);

  const profileLabTests = useMemo(() => {
    if (!profilePatient) return [];
    return labTests
      .filter((t) => t.patientId === profilePatient.id)
      .sort((a, b) => b.requestDate.localeCompare(a.requestDate));
  }, [labTests, profilePatient]);

  const wristbandPatient = useMemo(
    () => patients.find((p) => p.id === wristbandPatientId) ?? null,
    [patients, wristbandPatientId]
  );

  const wristbandBed = useMemo(() => {
    if (!wristbandPatient) return null;
    return (
      beds.find(
        (b) =>
          b.patientId === wristbandPatient.id &&
          (b.status === 'Occupied' || b.status === 'Reserved')
      ) ?? null
    );
  }, [beds, wristbandPatient]);

  useEffect(() => {
    if (!qrTarget || qrTarget.type !== 'patient') return;
    const found = patients.find((p) => p.id.toLowerCase() === qrTarget.id.toLowerCase());
    if (found) {
      if (qrTarget.action === 'wristband') {
        setWristbandPatientId(found.id);
      } else {
        setProfilePatientId(found.id);
      }
    }
    clearQrTarget();
  }, [qrTarget, patients, clearQrTarget]);

  const openAddModal = () => {
    setEditingPatient(null);
    setFormState(EMPTY_FORM);
    setFormError('');
    setFormModalOpen(true);
  };

  const openEditModal = (patient: Patient) => {
    setEditingPatient(patient);
    setFormState({
      fullName: patient.fullName,
      age: String(patient.age),
      gender: patient.gender,
      phone: patient.phone,
      email: patient.email,
      address: patient.address,
      bloodGroup: patient.bloodGroup,
      emergencyContact: patient.emergencyContact ?? '',
      allergies: patient.allergies ?? '',
    });
    setFormError('');
    setFormModalOpen(true);
  };

  const handleSavePatient = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    const ageNum = Number(formState.age);
    if (!formState.fullName.trim()) {
      setFormError('Full name is required.');
      return;
    }
    if (!Number.isFinite(ageNum) || ageNum < 0 || ageNum > 120) {
      setFormError('Please enter a valid age between 0 and 120.');
      return;
    }
    if (!formState.phone.trim() || !formState.email.trim()) {
      setFormError('Phone number and email address are required.');
      return;
    }

    if (editingPatient) {
      updatePatient({
        ...editingPatient,
        fullName: formState.fullName.trim(),
        age: ageNum,
        gender: formState.gender,
        phone: formState.phone.trim(),
        email: formState.email.trim(),
        address: formState.address.trim(),
        bloodGroup: formState.bloodGroup,
        emergencyContact: formState.emergencyContact.trim(),
        allergies: formState.allergies.trim(),
      });
    } else {
      addPatient({
        fullName: formState.fullName.trim(),
        age: ageNum,
        gender: formState.gender,
        phone: formState.phone.trim(),
        email: formState.email.trim(),
        address: formState.address.trim(),
        bloodGroup: formState.bloodGroup,
        emergencyContact: formState.emergencyContact.trim(),
        allergies: formState.allergies.trim(),
      });
    }
    setFormModalOpen(false);
  };

  const handleAddMedicalNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!profilePatient || !noteTitle.trim() || !noteDetails.trim()) return;
    addMedicalRecord(profilePatient.id, {
      date: getTodayIso(),
      title: noteTitle.trim(),
      doctorName: noteDoctor,
      department: noteDepartment,
      notes: noteDetails.trim(),
    });
    setNoteTitle('');
    setNoteDetails('');
  };

  const columns: TableColumn<Patient>[] = [
    {
      key: 'id',
      header: 'Patient ID',
      render: (p) => <span className="font-mono-num text-xs font-semibold text-[#2563EB]">{p.id}</span>,
    },
    {
      key: 'fullName',
      header: 'Patient',
      render: (p) => (
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#142D4E] to-[#2563EB] text-xs font-bold text-white">
            {getInitials(p.fullName)}
          </div>
          <div>
            <div className="font-medium text-[#142D4E] dark:text-white">{p.fullName}</div>
            <div className="text-xs text-slate-500 dark:text-slate-400">{p.email}</div>
          </div>
        </div>
      ),
    },
    {
      key: 'demographics',
      header: 'Age / Gender',
      render: (p) => (
        <span className="tabular-nums text-slate-600 dark:text-slate-300">
          {p.age} yrs · {p.gender}
        </span>
      ),
    },
    {
      key: 'bloodGroup',
      header: 'Blood Group',
      render: (p) => (
        <span className="font-mono-num text-xs font-semibold text-rose-700 dark:text-rose-400">
          {p.bloodGroup}
        </span>
      ),
    },
    {
      key: 'careStatus',
      header: 'Care Status',
      render: (p) => {
        const st = getPatientCareStatus(p.id);
        return (
          <span className={`inline-block rounded-md px-2 py-0.5 text-xs font-semibold ${st.tone}`}>
            {st.label}
          </span>
        );
      },
    },
    {
      key: 'phone',
      header: 'Phone',
      render: (p) => <span className="font-mono-num text-xs">{p.phone}</span>,
    },
    {
      key: 'registrationDate',
      header: 'Registered',
      render: (p) => <span className="font-mono-num text-xs text-slate-500">{p.registrationDate}</span>,
    },
    {
      key: 'actions',
      header: 'Actions',
      align: 'right',
      render: (p) => (
        <div className="inline-flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
          <button
            type="button"
            onClick={() => setProfilePatientId(p.id)}
            title="View Patient Profile"
            aria-label={`View profile for ${p.fullName}`}
            className="rounded-md p-1.5 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-[#2563EB]"
          >
            <Eye className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => setWristbandPatientId(p.id)}
            title="Generate Wristband QR"
            aria-label={`Generate wristband QR for ${p.fullName}`}
            className="rounded-md p-1.5 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-[#16B8A6]"
          >
            <QrCode className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => openEditModal(p)}
            title="Edit Patient"
            aria-label={`Edit ${p.fullName}`}
            className="rounded-md p-1.5 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-[#142D4E] dark:hover:text-white"
          >
            <Edit3 className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => setDeleteTarget(p)}
            title="Delete Patient"
            aria-label={`Delete ${p.fullName}`}
            className="rounded-md p-1.5 text-slate-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 hover:text-rose-600"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-5">
      {/* Toolbar */}
      <div className="no-print flex flex-col lg:flex-row lg:items-center justify-between gap-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4">
        <div className="flex flex-1 flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[220px]">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by Patient ID, name, phone, or email..."
              className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-[#F3F6FB] dark:bg-slate-800 py-2 pl-9 pr-3 text-sm text-[#1E293B] dark:text-white focus:border-[#2563EB] focus:bg-white dark:focus:bg-slate-900 focus:outline-none"
            />
          </div>

          <select
            aria-label="Filter by blood group"
            value={bloodFilter}
            onChange={(e) => setBloodFilter(e.target.value)}
            className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-[#1E293B] dark:text-slate-100 focus:border-[#2563EB] focus:outline-none"
          >
            <option value="All">All Blood Groups</option>
            {BLOOD_GROUPS.map((bg) => (
              <option key={bg} value={bg}>
                Blood {bg}
              </option>
            ))}
          </select>

          <select
            aria-label="Filter by gender"
            value={genderFilter}
            onChange={(e) => setGenderFilter(e.target.value)}
            className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-[#1E293B] dark:text-slate-100 focus:border-[#2563EB] focus:outline-none"
          >
            <option value="All">All Genders</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <div className="flex items-center rounded-lg border border-slate-200 dark:border-slate-700 p-0.5 bg-[#F3F6FB] dark:bg-slate-800">
            <button
              type="button"
              onClick={() => setViewMode('table')}
              className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium whitespace-nowrap ${
                viewMode === 'table'
                  ? 'bg-white dark:bg-slate-900 text-[#142D4E] dark:text-white shadow-sm'
                  : 'text-slate-500'
              }`}
            >
              <List className="h-3.5 w-3.5" />
              <span>Table</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('cards')}
              className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium whitespace-nowrap ${
                viewMode === 'cards'
                  ? 'bg-white dark:bg-slate-900 text-[#142D4E] dark:text-white shadow-sm'
                  : 'text-slate-500'
              }`}
            >
              <LayoutGrid className="h-3.5 w-3.5" />
              <span>Cards</span>
            </button>
          </div>

          <button
            type="button"
            onClick={() => setQrScannerOpen(true)}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2 text-sm font-semibold text-[#142D4E] dark:text-white hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors whitespace-nowrap shrink-0"
          >
            <QrCode className="h-4 w-4 text-[#16B8A6]" />
            <span>Scan QR</span>
          </button>

          <button
            type="button"
            onClick={openAddModal}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#2563EB] px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 active:scale-[0.98] transition-all whitespace-nowrap shrink-0"
          >
            <UserPlus className="h-4 w-4" />
            <span>Register Patient</span>
          </button>
        </div>
      </div>

      {/* Patient Data View */}
      <div className="no-print">
      {viewMode === 'table' ? (
        <DataTable
          columns={columns}
          data={filteredPatients}
          rowKey={(p) => p.id}
          onRowClick={(p) => setProfilePatientId(p.id)}
          emptyTitle="No matching patients"
          emptyDescription="Register a new patient to automatically assign a Patient ID and enable scheduling."
          emptyAction={
            <button
              type="button"
              onClick={openAddModal}
              className="inline-flex items-center gap-2 rounded-lg bg-[#2563EB] px-4 py-2 text-xs font-semibold text-white"
            >
              <Plus className="h-4 w-4" />
              <span>Register First Patient</span>
            </button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filteredPatients.map((p) => {
            const st = getPatientCareStatus(p.id);
            return (
              <article
                key={p.id}
                onClick={() => setProfilePatientId(p.id)}
                className="cursor-pointer rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 surface-hover flex flex-col justify-between gap-4"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#142D4E] to-[#2563EB] text-sm font-bold text-white shadow-sm">
                        {getInitials(p.fullName)}
                      </div>
                      <div className="min-w-0">
                        <div className="font-mono-num text-[11px] font-semibold text-[#2563EB]">
                          {p.id}
                        </div>
                        <h3 className="font-display text-base font-bold text-[#142D4E] dark:text-white truncate">
                          {p.fullName}
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {p.age} yrs · {p.gender} · Blood {p.bloodGroup}
                        </p>
                      </div>
                    </div>
                    <span className={`rounded-md px-2 py-0.5 text-[11px] font-semibold whitespace-nowrap ${st.tone}`}>
                      {st.label}
                    </span>
                  </div>

                  <div className="mt-4 space-y-1.5 border-t border-slate-100 dark:border-slate-800 pt-3 text-xs text-slate-600 dark:text-slate-300">
                    <div className="flex items-center gap-2">
                      <Phone className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                      <span className="font-mono-num">{p.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{p.email}</span>
                    </div>
                  </div>
                </div>

                <div
                  className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-3 text-xs"
                  onClick={(e) => e.stopPropagation()}
                >
                  <span className="font-mono-num text-slate-400">Reg {p.registrationDate}</span>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setWristbandPatientId(p.id)}
                      className="inline-flex items-center gap-1 rounded border border-slate-200 dark:border-slate-700 px-2.5 py-1 font-medium text-[#16B8A6] hover:bg-slate-50 dark:hover:bg-slate-800 whitespace-nowrap"
                    >
                      <QrCode className="h-3 w-3" />
                      <span>Wristband</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => openEditModal(p)}
                      className="rounded border border-slate-200 dark:border-slate-700 px-2.5 py-1 font-medium hover:bg-slate-50 dark:hover:bg-slate-800"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteTarget(p)}
                      className="rounded border border-rose-200 dark:border-rose-900/60 px-2.5 py-1 font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
      </div>

      {/* Add / Edit Patient Modal */}
      <Modal
        open={formModalOpen}
        onClose={() => setFormModalOpen(false)}
        title={editingPatient ? `Edit Patient · ${editingPatient.id}` : 'Register New Patient'}
        subtitle={
          editingPatient
            ? 'Update demographic and contact details'
            : 'A unique Patient ID will be generated automatically upon saving'
        }
      >
        <form onSubmit={handleSavePatient} className="space-y-4">
          {formError && (
            <div className="rounded-lg border border-rose-200 dark:border-rose-900 bg-rose-50 dark:bg-rose-950/40 px-3 py-2 text-xs text-rose-700 dark:text-rose-300">
              {formError}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                Full Name *
              </label>
              <input
                type="text"
                required
                value={formState.fullName}
                onChange={(e) => setFormState({ ...formState, fullName: e.target.value })}
                placeholder="e.g., Sofia Fernandez"
                className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm focus:border-[#2563EB] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                Age *
              </label>
              <input
                type="number"
                min={0}
                max={120}
                required
                value={formState.age}
                onChange={(e) => setFormState({ ...formState, age: e.target.value })}
                className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm focus:border-[#2563EB] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                Gender *
              </label>
              <select
                value={formState.gender}
                onChange={(e) =>
                  setFormState({ ...formState, gender: e.target.value as PatientFormState['gender'] })
                }
                className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm focus:border-[#2563EB] focus:outline-none"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                Phone Number *
              </label>
              <input
                type="tel"
                required
                value={formState.phone}
                onChange={(e) => setFormState({ ...formState, phone: e.target.value })}
                placeholder="+1 (555) 000-0000"
                className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm focus:border-[#2563EB] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                Email Address *
              </label>
              <input
                type="email"
                required
                value={formState.email}
                onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                placeholder="patient@example.com"
                className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm focus:border-[#2563EB] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                Blood Group *
              </label>
              <select
                value={formState.bloodGroup}
                onChange={(e) => setFormState({ ...formState, bloodGroup: e.target.value as BloodGroup })}
                className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm focus:border-[#2563EB] focus:outline-none"
              >
                {BLOOD_GROUPS.map((bg) => (
                  <option key={bg} value={bg}>
                    {bg}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                Known Allergies
              </label>
              <input
                type="text"
                value={formState.allergies}
                onChange={(e) => setFormState({ ...formState, allergies: e.target.value })}
                placeholder="e.g., Penicillin, None"
                className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm focus:border-[#2563EB] focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                Residential Address
              </label>
              <input
                type="text"
                value={formState.address}
                onChange={(e) => setFormState({ ...formState, address: e.target.value })}
                placeholder="Street address, apartment, city"
                className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm focus:border-[#2563EB] focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                Emergency Contact
              </label>
              <input
                type="text"
                value={formState.emergencyContact}
                onChange={(e) => setFormState({ ...formState, emergencyContact: e.target.value })}
                placeholder="Name and phone number"
                className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm focus:border-[#2563EB] focus:outline-none"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setFormModalOpen(false)}
              className="rounded-lg border border-slate-200 dark:border-slate-700 px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg bg-[#2563EB] px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
            >
              {editingPatient ? 'Save Changes' : 'Register Patient'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Detailed Patient Profile Modal (Printable A4 Clinical Record + Patient ID QR) */}
      <Modal
        open={Boolean(profilePatient)}
        onClose={() => setProfilePatientId(null)}
        title={profilePatient ? profilePatient.fullName : 'Patient Profile'}
        subtitle={
          profilePatient
            ? `${profilePatient.id} · Registered ${profilePatient.registrationDate}`
            : undefined
        }
        maxWidthClass="max-w-3xl"
        printable
      >
        {profilePatient && (
          <div className="space-y-6">
            <div className="print-a4-sheet space-y-5">
              {/* Print-only Hospital Clinical Record Letterhead */}
              <div className="print-a4-header print-only-flex items-start justify-between gap-4 border-b border-slate-300 pb-4">
                <div>
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-[#2563EB]">
                    Patient Clinical Record
                  </div>
                  <h2 className="font-display text-lg font-bold text-[#142D4E]">
                    {settings.hospitalName}
                  </h2>
                  <p className="text-xs text-slate-600">{settings.address}</p>
                  <p className="text-xs text-slate-600">
                    {settings.phone} · {settings.email} · Reg. {settings.registrationCode}
                  </p>
                </div>
                <div className="text-right font-mono-num text-xs">
                  <div className="font-bold text-[#2563EB]">{profilePatient.id}</div>
                  <div className="text-slate-600">Registered: {profilePatient.registrationDate}</div>
                </div>
              </div>

              {/* Avatar, Care Status & Scannable Patient ID QR Code (Visible on Screen & Print) */}
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
                <div className="flex items-center gap-3.5">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#142D4E] to-[#2563EB] text-sm font-bold text-white">
                    {getInitials(profilePatient.fullName)}
                  </div>
                  <div>
                    <div className="font-mono-num text-xs font-semibold text-[#2563EB]">
                      {profilePatient.id}
                    </div>
                    <div className="text-base font-bold text-[#142D4E] dark:text-white">
                      {profilePatient.fullName}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      {profilePatient.email} · {profilePatient.phone}
                    </div>
                    <div className="mt-1.5 flex flex-wrap items-center gap-2">
                      {profileBed ? (
                        <span className="inline-flex items-center gap-1.5 rounded-md bg-rose-500/10 px-2.5 py-1 text-xs font-semibold text-rose-700 dark:text-rose-300">
                          <BedDouble className="h-3.5 w-3.5" />
                          <span>
                            {profileBed.wardName} · Bed {profileBed.bedNumber} ({profileBed.status})
                          </span>
                        </span>
                      ) : (
                        <span className="inline-block rounded-md bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                          Outpatient Care
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <PatientQrCode
                    patientId={profilePatient.id}
                    patientName={profilePatient.fullName}
                    size={84}
                    caption="Patient ID"
                  />
                </div>
              </div>

              {/* Demographics Grid */}
              <div className="print-a4-meta-grid grid grid-cols-2 sm:grid-cols-4 gap-4 border-b border-slate-200 dark:border-slate-800 pb-4 text-xs">
                <div>
                  <div className="text-slate-400">Age &amp; Gender</div>
                  <div className="mt-1 font-semibold text-[#142D4E] dark:text-white">
                    {profilePatient.age} yrs · {profilePatient.gender}
                  </div>
                </div>
                <div>
                  <div className="text-slate-400">Blood Group</div>
                  <div className="mt-1 font-mono-num font-semibold text-rose-600 dark:text-rose-400">
                    {profilePatient.bloodGroup}
                  </div>
                </div>
                <div>
                  <div className="text-slate-400">Phone</div>
                  <div className="mt-1 font-mono-num font-medium">{profilePatient.phone}</div>
                </div>
                <div>
                  <div className="text-slate-400">Allergies</div>
                  <div className="mt-1 font-medium">{profilePatient.allergies || 'None reported'}</div>
                </div>
                <div className="col-span-2">
                  <div className="text-slate-400">Address</div>
                  <div className="mt-1">{profilePatient.address || '—'}</div>
                </div>
                <div className="col-span-2">
                  <div className="text-slate-400">Emergency Contact</div>
                  <div className="mt-1">{profilePatient.emergencyContact || '—'}</div>
                </div>
              </div>

              {/* Medical History Section */}
              <div>
                <h3 className="font-display text-sm font-bold text-[#142D4E] dark:text-white">
                  Medical History ({profilePatient.medicalHistory.length})
                </h3>
                <div className="mt-2 divide-y divide-slate-100 dark:divide-slate-800 border border-slate-200 dark:border-slate-800 rounded-lg">
                  {profilePatient.medicalHistory.length === 0 ? (
                    <p className="p-4 text-xs text-slate-500">No medical history notes recorded yet.</p>
                  ) : (
                    profilePatient.medicalHistory.map((mh) => (
                      <div key={mh.id} className="print-avoid-break p-3.5">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-sm font-semibold text-[#142D4E] dark:text-white">
                            {mh.title}
                          </span>
                          <span className="font-mono-num text-xs text-slate-400">{mh.date}</span>
                        </div>
                        <p className="mt-0.5 text-xs text-[#16B8A6] font-medium">
                          {mh.doctorName} · {mh.department}
                        </p>
                        <p className="mt-1.5 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                          {mh.notes}
                        </p>
                      </div>
                    ))
                  )}
                </div>

                {/* Add Medical Record Note */}
                <form
                  onSubmit={handleAddMedicalNote}
                  className="no-print mt-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-[#F3F6FB] dark:bg-slate-800/60 p-3.5 space-y-2.5"
                >
                  <div className="flex items-center gap-2 text-xs font-semibold text-[#142D4E] dark:text-white">
                    <FilePlus2 className="h-3.5 w-3.5 text-[#2563EB]" />
                    <span>Add Clinical Record Note</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <input
                      type="text"
                      required
                      value={noteTitle}
                      onChange={(e) => setNoteTitle(e.target.value)}
                      placeholder="Visit / Summary title"
                      className="rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-2.5 py-1.5 text-xs focus:outline-none"
                    />
                    <select
                      value={noteDoctor}
                      onChange={(e) => {
                        const doc = doctors.find((d) => d.name === e.target.value);
                        setNoteDoctor(e.target.value);
                        if (doc) setNoteDepartment(doc.department);
                      }}
                      className="rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-2.5 py-1.5 text-xs focus:outline-none"
                    >
                      {doctors.map((d) => (
                        <option key={d.id} value={d.name}>
                          {d.name}
                        </option>
                      ))}
                    </select>
                    <input
                      type="text"
                      value={noteDepartment}
                      onChange={(e) => setNoteDepartment(e.target.value)}
                      placeholder="Department"
                      className="rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-2.5 py-1.5 text-xs focus:outline-none"
                    />
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      required
                      value={noteDetails}
                      onChange={(e) => setNoteDetails(e.target.value)}
                      placeholder="Observation notes..."
                      className="flex-1 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-2.5 py-1.5 text-xs focus:outline-none"
                    />
                    <button
                      type="submit"
                      className="rounded bg-[#142D4E] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#1d3e6b] whitespace-nowrap"
                    >
                      Save Note
                    </button>
                  </div>
                </form>
              </div>

              {/* Linked Laboratory Records Section */}
              <div>
                <h3 className="flex items-center gap-2 font-display text-sm font-bold text-[#142D4E] dark:text-white">
                  <FlaskConical className="h-4 w-4 text-[#16B8A6]" />
                  <span>Laboratory Records ({profileLabTests.length})</span>
                </h3>
                <div className="mt-2 divide-y divide-slate-100 dark:divide-slate-800 border border-slate-200 dark:border-slate-800 rounded-lg">
                  {profileLabTests.length === 0 ? (
                    <p className="p-4 text-xs text-slate-500">No laboratory tests ordered for this patient.</p>
                  ) : (
                    profileLabTests.map((lab) => (
                      <div key={lab.id} className="print-avoid-break p-3 flex items-center justify-between gap-3 text-xs">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-mono-num font-semibold text-[#2563EB]">{lab.id}</span>
                            <span className="font-semibold text-[#142D4E] dark:text-white truncate">
                              {lab.testName}
                            </span>
                          </div>
                          <div className="mt-0.5 text-slate-500 dark:text-slate-400">
                            {lab.category} · Ordered by {lab.orderedByDoctor} · {lab.requestDate}
                          </div>
                          {lab.resultSummary && (
                            <div className="mt-1 text-slate-700 dark:text-slate-300">
                              Result: {lab.resultSummary}
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="font-semibold text-[#142D4E] dark:text-white">{lab.status}</span>
                          <button
                            type="button"
                            onClick={() => {
                              setProfilePatientId(null);
                              navigateToQrTarget({ type: 'lab', id: lab.id, action: 'report' });
                            }}
                            title="Open Lab Report & QR"
                            className="no-print inline-flex items-center gap-1 rounded border border-slate-200 dark:border-slate-700 px-2 py-1 text-[11px] font-semibold text-[#2563EB] hover:bg-slate-50 dark:hover:bg-slate-800 whitespace-nowrap"
                          >
                            <QrCode className="h-3 w-3" />
                            <span>Report QR</span>
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Appointment History Section */}
              <div>
                <h3 className="flex items-center gap-2 font-display text-sm font-bold text-[#142D4E] dark:text-white">
                  <CalendarClock className="h-4 w-4 text-[#2563EB]" />
                  <span>Appointment History ({profileAppointments.length})</span>
                </h3>
                <div className="mt-2 divide-y divide-slate-100 dark:divide-slate-800 border border-slate-200 dark:border-slate-800 rounded-lg">
                  {profileAppointments.length === 0 ? (
                    <p className="p-4 text-xs text-slate-500">No appointments logged for this patient.</p>
                  ) : (
                    profileAppointments.map((apt) => (
                      <div key={apt.id} className="print-avoid-break p-3 flex items-center justify-between gap-3 text-xs">
                        <div>
                          <div className="font-semibold text-[#142D4E] dark:text-white">
                            {apt.doctorName} · {apt.department}
                          </div>
                          <div className="text-slate-500 dark:text-slate-400">{apt.reason}</div>
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

              {/* Print-only Patient Record Verification Footer */}
              <div className="print-a4-footer print-only text-[10px] text-slate-500">
                <p>
                  Confidential Medical Record · {settings.hospitalName} ({settings.registrationCode}) · Scan Patient ID QR ({profilePatient.id}) for rapid record verification.
                </p>
              </div>
            </div>

            {/* Action Bar */}
            <div className="no-print flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 dark:border-slate-800 pt-4">
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => downloadQrPng(profilePatient.id, `patient-id-qr-${profilePatient.id}`)}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 dark:border-slate-700 px-3 py-2 text-xs font-semibold text-[#142D4E] dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 whitespace-nowrap"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>Download QR PNG</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const id = profilePatient.id;
                    setProfilePatientId(null);
                    setWristbandPatientId(id);
                  }}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 dark:border-slate-700 px-3 py-2 text-xs font-semibold text-[#142D4E] dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 whitespace-nowrap"
                >
                  <QrCode className="h-3.5 w-3.5 text-[#16B8A6]" />
                  <span>Wristband QR</span>
                </button>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setProfilePatientId(null)}
                  className="rounded-lg border border-slate-200 dark:border-slate-700 px-4 py-2 text-sm whitespace-nowrap"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="inline-flex items-center gap-2 rounded-lg bg-[#142D4E] px-4 py-2 text-sm font-semibold text-white hover:bg-[#1d3e6b] whitespace-nowrap"
                >
                  <Printer className="h-4 w-4" />
                  <span>Print Patient Record (A4)</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Printable Patient Wristband QR Modal */}
      <Modal
        open={Boolean(wristbandPatient)}
        onClose={() => setWristbandPatientId(null)}
        title={`Patient Identification Wristband · ${wristbandPatient?.id ?? ''}`}
        subtitle="Printable A4 clinical wristband strip with scannable record QR code"
        maxWidthClass="max-w-2xl"
        printable
      >
        {wristbandPatient && (
          <div className="space-y-5">
            <div className="print-a4-sheet space-y-4">
              <div className="print-only text-[11px] font-semibold uppercase tracking-wider text-slate-500 border-b border-slate-300 pb-2">
                {settings.hospitalName} · Patient Identification Wristband Sheet ({settings.registrationCode})
              </div>

              <div className="print-wristband-strip rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 p-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
                  <div className="space-y-2.5 min-w-0 flex-1">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
                      <div>
                        <div className="text-[10px] font-semibold uppercase tracking-wider text-[#2563EB]">
                          {settings.hospitalName}
                        </div>
                        <h3 className="font-display text-lg font-bold text-[#142D4E] dark:text-white">
                          {wristbandPatient.fullName}
                        </h3>
                      </div>
                      <div className="sm:text-right">
                        <div className="text-[10px] uppercase tracking-wider text-slate-400">Patient ID</div>
                        <div className="font-mono-num text-sm font-bold text-[#2563EB]">
                          {wristbandPatient.id}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                      <div>
                        <span className="text-[10px] uppercase tracking-wider text-slate-400">Age / Sex</span>
                        <div className="font-semibold text-[#142D4E] dark:text-white tabular-nums">
                          {wristbandPatient.age} yrs · {wristbandPatient.gender}
                        </div>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase tracking-wider text-slate-400">Blood Group</span>
                        <div className="font-mono-num font-bold text-rose-700 dark:text-rose-400">
                          {wristbandPatient.bloodGroup}
                        </div>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase tracking-wider text-slate-400">Location</span>
                        <div className="font-semibold text-[#142D4E] dark:text-white">
                          {wristbandBed
                            ? `${wristbandBed.wardName} · ${wristbandBed.bedNumber}`
                            : 'Outpatient'}
                        </div>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase tracking-wider text-slate-400">Registered</span>
                        <div className="font-mono-num text-slate-600 dark:text-slate-300">
                          {wristbandPatient.registrationDate}
                        </div>
                      </div>
                    </div>

                    <div className="rounded-md border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/70 px-3 py-1.5 text-xs">
                      <span className="font-semibold text-[#142D4E] dark:text-white">Allergy Alert: </span>
                      <span className="text-slate-700 dark:text-slate-300">
                        {wristbandPatient.allergies || 'None reported'}
                      </span>
                      {wristbandPatient.emergencyContact && (
                        <>
                          <span className="mx-2 text-slate-300" aria-hidden="true">
                            |
                          </span>
                          <span className="font-semibold text-[#142D4E] dark:text-white">ICE: </span>
                          <span className="text-slate-700 dark:text-slate-300">
                            {wristbandPatient.emergencyContact}
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="shrink-0 flex flex-col items-center justify-center sm:border-l sm:border-slate-200 dark:sm:border-slate-800 sm:pl-5">
                    <PatientQrCode
                      patientId={wristbandPatient.id}
                      patientName={wristbandPatient.fullName}
                      size={104}
                      encodeMode="url"
                      caption="Wristband ID"
                    />
                  </div>
                </div>
              </div>

              <div className="print-only text-[10px] text-slate-500 space-y-1 pt-2">
                <p>
                  Trim along dashed border before securing wristband. Scan QR code prior to medication administration, specimen collection, or ward transfer.
                </p>
              </div>
            </div>

            <div className="no-print flex flex-wrap items-center justify-between gap-3">
              <button
                type="button"
                onClick={() =>
                  downloadQrPng(
                    buildPatientQrValue(wristbandPatient.id),
                    `wristband-qr-${wristbandPatient.id}`
                  )
                }
                className="inline-flex items-center gap-2 rounded-lg border border-slate-200 dark:border-slate-700 px-3.5 py-2 text-xs font-semibold text-[#142D4E] dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 whitespace-nowrap"
              >
                <Download className="h-3.5 w-3.5" />
                <span>Download QR PNG</span>
              </button>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setWristbandPatientId(null)}
                  className="rounded-lg border border-slate-200 dark:border-slate-700 px-4 py-2 text-sm whitespace-nowrap"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="inline-flex items-center gap-2 rounded-lg bg-[#142D4E] px-4 py-2 text-sm font-semibold text-white hover:bg-[#1d3e6b] whitespace-nowrap"
                >
                  <Printer className="h-4 w-4" />
                  <span>Print Wristband (A4)</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmationDialog
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => {
          if (deleteTarget) deletePatient(deleteTarget.id);
        }}
        title="Delete Patient Record"
        message={`Are you sure you want to remove ${deleteTarget?.fullName} (${deleteTarget?.id})? Any allocated bed will be released automatically.`}
        confirmLabel="Delete Patient"
      />
    </div>
  );
};
