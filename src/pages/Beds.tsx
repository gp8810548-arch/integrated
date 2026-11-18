import React, { useMemo, useState } from 'react';
import { BedDouble, Building2, LogOut, Plus, UserCheck } from 'lucide-react';
import { useHospital } from '../context/HospitalContext';
import { StatCard } from '../components/StatCard';
import { ConfirmationDialog, Modal } from '../components/Modal';
import { Bed, BedStatus, Ward } from '../types/hospital';
import { formatCurrency } from '../services/dataService';

export const Beds: React.FC = () => {
  const {
    wards,
    beds,
    patients,
    addWard,
    addBedToWard,
    allocateBed,
    dischargeBed,
    settings,
  } = useHospital();

  const [wardFilter, setWardFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<'All' | BedStatus>('All');

  // Modals
  const [wardModalOpen, setWardModalOpen] = useState(false);
  const [wardName, setWardName] = useState('');
  const [wardFloor, setWardFloor] = useState('3rd Floor');
  const [wardType, setWardType] = useState<Ward['type']>('General');
  const [wardRate, setWardRate] = useState('220');

  const [addBedModalOpen, setAddBedModalOpen] = useState(false);
  const [targetWardId, setTargetWardId] = useState(wards[0]?.id ?? '');
  const [newBedNumber, setNewBedNumber] = useState('');
  const [bedFormError, setBedFormError] = useState('');

  const [allocateTarget, setAllocateTarget] = useState<Bed | null>(null);
  const [allocPatientId, setAllocPatientId] = useState(patients[0]?.id ?? '');
  const [allocStatus, setAllocStatus] = useState<'Occupied' | 'Reserved'>('Occupied');
  const [allocDischarge, setAllocDischarge] = useState('');
  const [allocNotes, setAllocNotes] = useState('');
  const [allocError, setAllocError] = useState('');

  const [dischargeTarget, setDischargeTarget] = useState<Bed | null>(null);

  const summary = useMemo(() => {
    const total = beds.length;
    const available = beds.filter((b) => b.status === 'Available').length;
    const occupied = beds.filter((b) => b.status === 'Occupied').length;
    const reserved = beds.filter((b) => b.status === 'Reserved').length;
    return { total, available, occupied, reserved };
  }, [beds]);

  const filteredWards = useMemo(
    () => (wardFilter === 'All' ? wards : wards.filter((w) => w.id === wardFilter)),
    [wards, wardFilter]
  );

  const handleCreateWard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!wardName.trim()) return;
    addWard({
      name: wardName.trim(),
      floor: wardFloor.trim(),
      type: wardType,
      dailyRate: Math.max(0, Number(wardRate) || 200),
    });
    setWardName('');
    setWardModalOpen(false);
  };

  const handleAddBed = (e: React.FormEvent) => {
    e.preventDefault();
    setBedFormError('');
    if (!newBedNumber.trim()) {
      setBedFormError('Bed number is required.');
      return;
    }
    const res = addBedToWard(targetWardId, newBedNumber);
    if (!res.ok && res.error) {
      setBedFormError(res.error);
      return;
    }
    setNewBedNumber('');
    setAddBedModalOpen(false);
  };

  const openAllocate = (bed: Bed) => {
    setAllocateTarget(bed);
    setAllocPatientId(patients[0]?.id ?? '');
    setAllocStatus('Occupied');
    setAllocDischarge('');
    setAllocNotes('');
    setAllocError('');
  };

  const handleAllocateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!allocateTarget) return;
    setAllocError('');
    const res = allocateBed({
      bedId: allocateTarget.id,
      patientId: allocPatientId,
      status: allocStatus,
      expectedDischarge: allocDischarge || undefined,
      notes: allocNotes.trim() || undefined,
    });
    if (!res.ok && res.error) {
      setAllocError(res.error);
      return;
    }
    setAllocateTarget(null);
  };

  const getBedCardTheme = (status: BedStatus) => {
    switch (status) {
      case 'Available':
        return {
          border: 'border-emerald-300 dark:border-emerald-800/80',
          headerBg: 'bg-emerald-500/12 text-emerald-800 dark:text-emerald-300',
          indicator: 'bg-emerald-500',
        };
      case 'Occupied':
        return {
          border: 'border-rose-300 dark:border-rose-800/80',
          headerBg: 'bg-rose-500/12 text-rose-800 dark:text-rose-300',
          indicator: 'bg-rose-500',
        };
      case 'Reserved':
        return {
          border: 'border-amber-300 dark:border-amber-800/80',
          headerBg: 'bg-amber-500/12 text-amber-800 dark:text-amber-300',
          indicator: 'bg-amber-500',
        };
    }
  };

  return (
    <div className="space-y-6">
      {/* KPI Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard label="Total Beds" value={summary.total} numericValue={summary.total} detail={`Across ${wards.length} hospital wards`} icon={BedDouble} tone="navy" />
        <StatCard label="Available Beds" value={summary.available} numericValue={summary.available} detail="Ready for admission (Green)" icon={BedDouble} tone="teal" />
        <StatCard label="Occupied Beds" value={summary.occupied} numericValue={summary.occupied} detail="Active inpatient care (Red)" icon={BedDouble} tone="rose" />
        <StatCard label="Reserved Beds" value={summary.reserved} numericValue={summary.reserved} detail="Held for scheduled intake (Yellow)" icon={BedDouble} tone="amber" />
      </div>

      {/* Controls & Legend */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4">
        <div className="flex flex-wrap items-center gap-3">
          <select
            aria-label="Filter by ward"
            value={wardFilter}
            onChange={(e) => setWardFilter(e.target.value)}
            className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm"
          >
            <option value="All">All Wards ({wards.length})</option>
            {wards.map((w) => (
              <option key={w.id} value={w.id}>
                {w.name}
              </option>
            ))}
          </select>

          <div className="flex items-center gap-1 rounded-lg bg-[#F4F7FB] dark:bg-slate-800 p-1">
            {(['All', 'Available', 'Occupied', 'Reserved'] as const).map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setStatusFilter(st)}
                className={`rounded-md px-2.5 py-1 text-xs font-medium whitespace-nowrap ${
                  statusFilter === st
                    ? 'bg-white dark:bg-slate-900 text-[#142D4E] dark:text-white shadow-sm'
                    : 'text-slate-500'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4 text-xs text-slate-600 dark:text-slate-300 pl-1">
            <span className="inline-flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-sm bg-emerald-500" />
              <span>Available</span>
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-sm bg-rose-500" />
              <span>Occupied</span>
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-sm bg-amber-500" />
              <span>Reserved</span>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => {
              setTargetWardId(wards[0]?.id ?? '');
              setBedFormError('');
              setAddBedModalOpen(true);
            }}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 dark:border-slate-700 px-3.5 py-2 text-xs font-semibold text-[#142D4E] dark:text-white hover:bg-slate-50 dark:hover:bg-slate-800 whitespace-nowrap"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Add Bed</span>
          </button>
          <button
            type="button"
            onClick={() => setWardModalOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-lg bg-[#2563EB] px-3.5 py-2 text-xs font-semibold text-white hover:bg-blue-700 whitespace-nowrap"
          >
            <Building2 className="h-3.5 w-3.5" />
            <span>New Ward</span>
          </button>
        </div>
      </div>

      {/* Wards & Interactive Bed Cards */}
      <div className="space-y-5">
        {filteredWards.map((ward) => {
          const wardBeds = beds.filter(
            (b) => b.wardId === ward.id && (statusFilter === 'All' || b.status === statusFilter)
          );
          const totalInWard = beds.filter((b) => b.wardId === ward.id).length;
          const availInWard = beds.filter((b) => b.wardId === ward.id && b.status === 'Available').length;

          return (
            <section
              key={ward.id}
              className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <h2 className="font-display text-base font-bold text-[#142D4E] dark:text-white">
                    {ward.name}
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {ward.floor} · {ward.type} · Daily Rate:{' '}
                    <span className="font-mono-num font-semibold">
                      {formatCurrency(ward.dailyRate, settings.currencySymbol)}
                    </span>
                  </p>
                </div>
                <div className="text-right space-y-1.5">
                  <div className="font-mono-num text-xs font-semibold text-slate-600 dark:text-slate-300">
                    {availInWard} / {totalInWard} beds available
                  </div>
                  <div className="h-1.5 w-36 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden ml-auto">
                    <div
                      className="h-full bg-[#16B8A6] transition-all duration-300"
                      style={{
                        width: `${totalInWard > 0 ? Math.round(((totalInWard - availInWard) / totalInWard) * 100) : 0}%`,
                      }}
                    />
                  </div>
                </div>
              </div>

              {wardBeds.length === 0 ? (
                <p className="py-6 text-center text-xs text-slate-500 dark:text-slate-400">
                  No beds in this ward match the selected status filter.
                </p>
              ) : (
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                  {wardBeds.map((bed) => {
                    const style = getBedCardTheme(bed.status);
                    return (
                      <div
                        key={bed.id}
                        className={`rounded-lg border ${style.border} bg-[#F3F6FB]/70 dark:bg-slate-800/40 p-3.5 flex flex-col justify-between gap-3 surface-hover`}
                      >
                        <div>
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-mono-num text-sm font-bold text-[#142D4E] dark:text-white flex items-center gap-2">
                              <span className={`h-2.5 w-2.5 rounded-sm ${style.indicator}`} />
                              {bed.bedNumber}
                            </span>
                            <span className={`rounded px-2 py-0.5 text-[11px] font-semibold ${style.headerBg}`}>
                              {bed.status}
                            </span>
                          </div>

                          {bed.patientName ? (
                            <div className="mt-2.5 space-y-0.5 text-xs">
                              <div className="font-semibold text-[#263449] dark:text-slate-100">
                                {bed.patientName}
                              </div>
                              <div className="font-mono-num text-[11px] text-slate-500">
                                {bed.patientId} · Admitted {bed.admittedDate}
                              </div>
                              {bed.notes && (
                                <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                                  {bed.notes}
                                </div>
                              )}
                            </div>
                          ) : (
                            <p className="mt-2.5 text-xs text-slate-500 dark:text-slate-400">
                              {bed.status === 'Reserved'
                                ? bed.notes || 'Reserved for incoming patient'
                                : 'Sanitized and ready for patient admission'}
                            </p>
                          )}
                        </div>

                        <div className="pt-1">
                          {bed.status === 'Available' ? (
                            <button
                              type="button"
                              onClick={() => openAllocate(bed)}
                              className="w-full inline-flex items-center justify-center gap-1.5 rounded-md bg-[#142D4E] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#1d3e6b] transition-colors"
                            >
                              <UserCheck className="h-3.5 w-3.5" />
                              <span>Allocate Bed</span>
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => setDischargeTarget(bed)}
                              className="w-full inline-flex items-center justify-center gap-1.5 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                            >
                              <LogOut className="h-3.5 w-3.5" />
                              <span>{bed.status === 'Occupied' ? 'Discharge Patient' : 'Release Reservation'}</span>
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>
          );
        })}
      </div>

      {/* New Ward Modal */}
      <Modal open={wardModalOpen} onClose={() => setWardModalOpen(false)} title="Create Hospital Ward">
        <form onSubmit={handleCreateWard} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
              Ward Name *
            </label>
            <input
              type="text"
              required
              value={wardName}
              onChange={(e) => setWardName(e.target.value)}
              placeholder="e.g., Surgical Recovery Wing B"
              className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                Floor
              </label>
              <input
                type="text"
                required
                value={wardFloor}
                onChange={(e) => setWardFloor(e.target.value)}
                className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                Ward Type
              </label>
              <select
                value={wardType}
                onChange={(e) => setWardType(e.target.value as Ward['type'])}
                className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm"
              >
                <option value="General">General</option>
                <option value="ICU">ICU</option>
                <option value="Cardiology">Cardiology</option>
                <option value="Pediatrics">Pediatrics</option>
                <option value="Maternity">Maternity</option>
                <option value="Surgical">Surgical</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
              Daily Bed Rate ({settings.currencySymbol})
            </label>
            <input
              type="number"
              min={0}
              required
              value={wardRate}
              onChange={(e) => setWardRate(e.target.value)}
              className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm"
            />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setWardModalOpen(false)} className="rounded-lg border border-slate-200 dark:border-slate-700 px-4 py-2 text-sm">
              Cancel
            </button>
            <button type="submit" className="rounded-lg bg-[#2563EB] px-4 py-2 text-sm font-semibold text-white">
              Create Ward
            </button>
          </div>
        </form>
      </Modal>

      {/* Add Bed Modal */}
      <Modal open={addBedModalOpen} onClose={() => setAddBedModalOpen(false)} title="Add Bed to Ward">
        <form onSubmit={handleAddBed} className="space-y-4">
          {bedFormError && (
            <div className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700">
              {bedFormError}
            </div>
          )}
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
              Select Ward *
            </label>
            <select
              value={targetWardId}
              onChange={(e) => setTargetWardId(e.target.value)}
              className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm"
            >
              {wards.map((w) => (
                <option key={w.id} value={w.id}>
                  {w.name} ({w.floor})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
              Bed Number *
            </label>
            <input
              type="text"
              required
              value={newBedNumber}
              onChange={(e) => setNewBedNumber(e.target.value)}
              placeholder="e.g., G-106 or ICU-204"
              className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm"
            />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setAddBedModalOpen(false)} className="rounded-lg border border-slate-200 dark:border-slate-700 px-4 py-2 text-sm">
              Cancel
            </button>
            <button type="submit" className="rounded-lg bg-[#2563EB] px-4 py-2 text-sm font-semibold text-white">
              Add Bed
            </button>
          </div>
        </form>
      </Modal>

      {/* Allocate Bed Modal */}
      <Modal
        open={Boolean(allocateTarget)}
        onClose={() => setAllocateTarget(null)}
        title={`Allocate Bed · ${allocateTarget?.bedNumber ?? ''}`}
        subtitle={allocateTarget?.wardName}
      >
        <form onSubmit={handleAllocateSubmit} className="space-y-4">
          {allocError && (
            <div className="rounded-lg border border-rose-200 dark:border-rose-900 bg-rose-50 dark:bg-rose-950/40 px-3 py-2 text-xs text-rose-700 dark:text-rose-300">
              {allocError}
            </div>
          )}
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
              Patient *
            </label>
            <select
              required
              value={allocPatientId}
              onChange={(e) => setAllocPatientId(e.target.value)}
              className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm"
            >
              {patients.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.fullName} ({p.id})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                Allocation Status
              </label>
              <select
                value={allocStatus}
                onChange={(e) => setAllocStatus(e.target.value as 'Occupied' | 'Reserved')}
                className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm"
              >
                <option value="Occupied">Occupied (Admit Now)</option>
                <option value="Reserved">Reserved</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                Expected Discharge
              </label>
              <input
                type="date"
                value={allocDischarge}
                onChange={(e) => setAllocDischarge(e.target.value)}
                className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
              Admission Notes
            </label>
            <input
              type="text"
              value={allocNotes}
              onChange={(e) => setAllocNotes(e.target.value)}
              placeholder="e.g., Post-op cardiac monitoring"
              className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setAllocateTarget(null)} className="rounded-lg border border-slate-200 dark:border-slate-700 px-4 py-2 text-sm">
              Cancel
            </button>
            <button type="submit" className="rounded-lg bg-[#2563EB] px-4 py-2 text-sm font-semibold text-white">
              Confirm Allocation
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmationDialog
        open={Boolean(dischargeTarget)}
        onClose={() => setDischargeTarget(null)}
        onConfirm={() => {
          if (dischargeTarget) dischargeBed(dischargeTarget.id);
        }}
        title={dischargeTarget?.status === 'Occupied' ? 'Discharge Patient' : 'Release Reserved Bed'}
        message={`Mark bed ${dischargeTarget?.bedNumber} (${dischargeTarget?.wardName}) as Available${
          dischargeTarget?.patientName ? ` and discharge ${dischargeTarget.patientName}` : ''
        }?`}
        confirmLabel="Confirm"
        destructive={false}
      />
    </div>
  );
};
