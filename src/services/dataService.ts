import {
  ActivityLog,
  Ambulance,
  AmbulanceTrip,
  Appointment,
  AuditLogEntry,
  Bed,
  BloodDonation,
  BloodGroupStock,
  BloodIssueRecord,
  BloodRequest,
  DemoAccount,
  DischargeRecord,
  Doctor,
  EmergencyCase,
  EmrDiagnosis,
  EmrPrescription,
  HospitalSettings,
  InsuranceClaim,
  InsurancePolicy,
  Invoice,
  LabTest,
  Medicine,
  MedicineIssue,
  MedicinePurchase,
  NavPage,
  NotificationItem,
  Patient,
  PatientFeedback,
  QueueToken,
  StaffMember,
  UserRole,
  Ward,
} from '../types/hospital';

export const ASSET_IMAGES = {
  loginIllustration: '/src/assets/images/login_hospital_illustration_1794986121973.jpg',
  doctorMale: '/src/assets/images/doctor_avatar_male_1794986123516.jpg',
  doctorFemale: '/src/assets/images/doctor_avatar_female_1794986122203.jpg',
  campusBanner: '/src/assets/images/hospital_campus_banner_1794986122911.jpg',
};

export function getTodayIso(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function addDaysIso(baseIso: string, deltaDays: number): string {
  const dt = new Date(`${baseIso}T00:00:00`);
  dt.setDate(dt.getDate() + deltaDays);
  const y = dt.getFullYear();
  const m = String(dt.getMonth() + 1).padStart(2, '0');
  const d = String(dt.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function formatCurrency(amount: number, symbol = '$'): string {
  return `${symbol}${amount.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

// Demonstration accounts clearly marked as prototype demo credentials
export const DEMO_ACCOUNTS: DemoAccount[] = [
  {
    id: 'USR-ADMIN-01',
    name: 'Dr. Vikram Sethi',
    email: 'admin@medicarepro.demo',
    password: 'admin123',
    role: 'Admin',
    department: 'Hospital Administration',
    title: 'Medical Superintendent',
    avatarUrl: ASSET_IMAGES.doctorMale,
  },
  {
    id: 'USR-DOC-01',
    name: 'Dr. Evelyn Reed',
    email: 'doctor@medicarepro.demo',
    password: 'doctor123',
    role: 'Doctor',
    department: 'Cardiology',
    title: 'Senior Consultant Cardiologist',
    avatarUrl: ASSET_IMAGES.doctorFemale,
  },
  {
    id: 'USR-REC-01',
    name: 'Priya Nair',
    email: 'reception@medicarepro.demo',
    password: 'reception123',
    role: 'Receptionist',
    department: 'Front Desk & Admissions',
    title: 'Lead Patient Coordinator',
  },
];

// Role-based navigation permissions for the prototype
export const ROLE_ALLOWED_PAGES: Record<UserRole, NavPage[]> = {
  Admin: [
    'dashboard',
    'command-centre',
    'patients',
    'emr',
    'emergency',
    'doctors',
    'appointments',
    'queue',
    'beds',
    'discharge',
    'blood-bank',
    'insurance',
    'billing',
    'pharmacy',
    'laboratory',
    'staff',
    'ambulance',
    'feedback',
    'audit-logs',
    'reports',
    'notifications',
    'settings',
  ],
  Doctor: [
    'dashboard',
    'command-centre',
    'patients',
    'emr',
    'emergency',
    'doctors',
    'appointments',
    'queue',
    'beds',
    'discharge',
    'blood-bank',
    'pharmacy',
    'laboratory',
    'ambulance',
    'feedback',
    'notifications',
    'settings',
  ],
  Receptionist: [
    'dashboard',
    'command-centre',
    'patients',
    'emergency',
    'doctors',
    'appointments',
    'queue',
    'beds',
    'discharge',
    'insurance',
    'billing',
    'ambulance',
    'feedback',
    'notifications',
    'settings',
  ],
};

export const INITIAL_SETTINGS: HospitalSettings = {
  hospitalName: 'MediCare Pro General Hospital',
  registrationCode: 'MCP-REG-88412',
  address: '420 Cedarcrest Medical Boulevard, Suite 100',
  phone: '+1 (555) 234-8900',
  email: 'administration@medicarepro.demo',
  currencySymbol: '$',
  taxRatePercent: 0,
  defaultAppointmentDurationMins: 30,
  lowStockDefaultThreshold: 25,
};

export function createInitialPatients(): Patient[] {
  const today = getTodayIso();
  return [
    {
      id: 'PAT-2026-0001',
      fullName: 'Aarav Kulkarni',
      age: 42,
      gender: 'Male',
      phone: '+1 (555) 310-4412',
      email: 'aarav.kulkarni@example.com',
      address: '184 Maple Ridge Drive, Northside',
      bloodGroup: 'O+',
      registrationDate: addDaysIso(today, -125),
      emergencyContact: 'Meera Kulkarni (+1 555-310-4419)',
      allergies: 'Penicillin',
      medicalHistory: [
        {
          id: 'MH-101',
          date: addDaysIso(today, -125),
          title: 'Hypertension Screening & ECG',
          doctorName: 'Dr. Evelyn Reed',
          department: 'Cardiology',
          notes: 'Resting BP 138/86 mmHg. Routine follow-up scheduled; lifestyle & dietary log maintained.',
        },
        {
          id: 'MH-102',
          date: addDaysIso(today, -12),
          title: 'Lipid Panel Review',
          doctorName: 'Dr. Evelyn Reed',
          department: 'Cardiology',
          notes: 'LDL within acceptable target after 2-week nutrition review.',
        },
      ],
    },
    {
      id: 'PAT-2026-0002',
      fullName: 'Clara Vance',
      age: 34,
      gender: 'Female',
      phone: '+1 (555) 482-1904',
      email: 'clara.vance@example.com',
      address: '712 Oakwood Avenue, Apt 4B',
      bloodGroup: 'A+',
      registrationDate: addDaysIso(today, -95),
      emergencyContact: 'Julian Vance (+1 555-482-1990)',
      allergies: 'None reported',
      medicalHistory: [
        {
          id: 'MH-103',
          date: addDaysIso(today, -95),
          title: 'Acute Migraine Evaluation',
          doctorName: 'Dr. Marcus Chen',
          department: 'Neurology',
          notes: 'Neurological exam unremarkable; hydration & sleep tracking advised.',
        },
      ],
    },
    {
      id: 'PAT-2026-0003',
      fullName: 'Eleanor Brooks',
      age: 67,
      gender: 'Female',
      phone: '+1 (555) 791-3320',
      email: 'eleanor.brooks@example.com',
      address: '29 Willowbrook Terrace',
      bloodGroup: 'B+',
      registrationDate: addDaysIso(today, -65),
      emergencyContact: 'Samuel Brooks (+1 555-791-3321)',
      allergies: 'Sulfa drugs',
      medicalHistory: [
        {
          id: 'MH-104',
          date: addDaysIso(today, -65),
          title: 'Post-Operative Knee Recovery',
          doctorName: 'Dr. Robert Sterling',
          department: 'Orthopedics',
          notes: 'Mobility improving steadily; inpatient physical therapy sessions ongoing.',
        },
      ],
    },
    {
      id: 'PAT-2026-0004',
      fullName: 'Mateo Alvarez',
      age: 29,
      gender: 'Male',
      phone: '+1 (555) 609-8841',
      email: 'mateo.alvarez@example.com',
      address: '905 Harbor View Lane',
      bloodGroup: 'AB+',
      registrationDate: addDaysIso(today, -35),
      emergencyContact: 'Lucia Alvarez (+1 555-609-8800)',
      allergies: 'Latex',
      medicalHistory: [
        {
          id: 'MH-105',
          date: addDaysIso(today, -35),
          title: 'Annual Preventive Wellness Check',
          doctorName: 'Dr. Robert Sterling',
          department: 'Internal Medicine',
          notes: 'Vitals stable, CBC and metabolic panel requested.',
        },
      ],
    },
    {
      id: 'PAT-2026-0005',
      fullName: 'Hannah Lindqvist',
      age: 51,
      gender: 'Female',
      phone: '+1 (555) 224-7751',
      email: 'hannah.l@example.com',
      address: '54 Pinecrest Court',
      bloodGroup: 'O-',
      registrationDate: addDaysIso(today, -10),
      emergencyContact: 'Erik Lindqvist (+1 555-224-7752)',
      allergies: 'Aspirin',
      medicalHistory: [
        {
          id: 'MH-106',
          date: addDaysIso(today, -3),
          title: 'Cardiac Observation Admission',
          doctorName: 'Dr. Evelyn Reed',
          department: 'Cardiology',
          notes: 'Admitted to Cardiology Telemetry Ward for 48-hour Holter observation.',
        },
      ],
    },
    {
      id: 'PAT-2026-0006',
      fullName: 'Noah Takahashi',
      age: 8,
      gender: 'Male',
      phone: '+1 (555) 883-1029',
      email: 'takahashi.family@example.com',
      address: '330 Birchwood Place',
      bloodGroup: 'A-',
      registrationDate: today,
      emergencyContact: 'Kenji Takahashi (+1 555-883-1029)',
      allergies: 'Peanuts',
      medicalHistory: [
        {
          id: 'MH-107',
          date: today,
          title: 'Pediatric Respiratory Check',
          doctorName: 'Dr. Ananya Rao',
          department: 'Pediatrics',
          notes: 'Initial outpatient pediatric intake completed.',
        },
      ],
    },
  ];
}

export function createInitialDoctors(): Doctor[] {
  return [
    {
      id: 'DOC-101',
      name: 'Dr. Evelyn Reed',
      specialization: 'Cardiology',
      department: 'Cardiology',
      experienceYears: 14,
      contact: '+1 (555) 201-4401',
      email: 'e.reed@medicarepro.demo',
      consultationFee: 180,
      availability: 'Available',
      avatarUrl: ASSET_IMAGES.doctorFemale,
      scheduleDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
      shiftHours: '09:00 - 17:00',
    },
    {
      id: 'DOC-102',
      name: 'Dr. Robert Sterling',
      specialization: 'Internal Medicine',
      department: 'Internal Medicine',
      experienceYears: 21,
      contact: '+1 (555) 201-4402',
      email: 'r.sterling@medicarepro.demo',
      consultationFee: 150,
      availability: 'Available',
      avatarUrl: ASSET_IMAGES.doctorMale,
      scheduleDays: ['Mon', 'Tue', 'Thu', 'Fri'],
      shiftHours: '08:30 - 16:30',
    },
    {
      id: 'DOC-103',
      name: 'Dr. Marcus Chen',
      specialization: 'Neurology',
      department: 'Neurology',
      experienceYears: 11,
      contact: '+1 (555) 201-4403',
      email: 'm.chen@medicarepro.demo',
      consultationFee: 210,
      availability: 'In Consultation',
      scheduleDays: ['Mon', 'Wed', 'Fri'],
      shiftHours: '10:00 - 18:00',
    },
    {
      id: 'DOC-104',
      name: 'Dr. Ananya Rao',
      specialization: 'Pediatrics',
      department: 'Pediatrics',
      experienceYears: 9,
      contact: '+1 (555) 201-4404',
      email: 'a.rao@medicarepro.demo',
      consultationFee: 130,
      availability: 'Available',
      scheduleDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Sat'],
      shiftHours: '09:00 - 15:00',
    },
    {
      id: 'DOC-105',
      name: 'Dr. Henrik Lindholm',
      specialization: 'Orthopedics',
      department: 'Orthopedics',
      experienceYears: 16,
      contact: '+1 (555) 201-4405',
      email: 'h.lindholm@medicarepro.demo',
      consultationFee: 195,
      availability: 'On Leave',
      scheduleDays: ['Tue', 'Thu', 'Fri'],
      shiftHours: '09:00 - 17:00',
    },
  ];
}

export function createInitialAppointments(): Appointment[] {
  const today = getTodayIso();
  return [
    {
      id: 'APT-2026-001',
      patientId: 'PAT-2026-0001',
      patientName: 'Aarav Kulkarni',
      doctorId: 'DOC-101',
      doctorName: 'Dr. Evelyn Reed',
      department: 'Cardiology',
      date: today,
      time: '09:30',
      reason: 'Follow-up ECG & Blood Pressure Review',
      status: 'Scheduled',
      createdAt: addDaysIso(today, -2),
    },
    {
      id: 'APT-2026-002',
      patientId: 'PAT-2026-0006',
      patientName: 'Noah Takahashi',
      doctorId: 'DOC-104',
      doctorName: 'Dr. Ananya Rao',
      department: 'Pediatrics',
      date: today,
      time: '11:00',
      reason: 'Seasonal Pediatric Checkup',
      status: 'Scheduled',
      createdAt: addDaysIso(today, -1),
    },
    {
      id: 'APT-2026-003',
      patientId: 'PAT-2026-0004',
      patientName: 'Mateo Alvarez',
      doctorId: 'DOC-102',
      doctorName: 'Dr. Robert Sterling',
      department: 'Internal Medicine',
      date: today,
      time: '14:00',
      reason: 'Metabolic Panel Consultation',
      status: 'Pending',
      createdAt: today,
    },
    {
      id: 'APT-2026-004',
      patientId: 'PAT-2026-0002',
      patientName: 'Clara Vance',
      doctorId: 'DOC-103',
      doctorName: 'Dr. Marcus Chen',
      department: 'Neurology',
      date: addDaysIso(today, 1),
      time: '10:30',
      reason: 'Migraine Therapy Progress Check',
      status: 'Scheduled',
      createdAt: addDaysIso(today, -3),
    },
    {
      id: 'APT-2026-005',
      patientId: 'PAT-2026-0003',
      patientName: 'Eleanor Brooks',
      doctorId: 'DOC-102',
      doctorName: 'Dr. Robert Sterling',
      department: 'Internal Medicine',
      date: addDaysIso(today, -2),
      time: '15:30',
      reason: 'Post-Op Discharge Review',
      status: 'Completed',
      createdAt: addDaysIso(today, -6),
    },
    {
      id: 'APT-2026-006',
      patientId: 'PAT-2026-0005',
      patientName: 'Hannah Lindqvist',
      doctorId: 'DOC-101',
      doctorName: 'Dr. Evelyn Reed',
      department: 'Cardiology',
      date: addDaysIso(today, 2),
      time: '16:00',
      reason: 'Holter Monitor Interpretation',
      status: 'Scheduled',
      createdAt: addDaysIso(today, -1),
    },
  ];
}

export function createInitialWards(): Ward[] {
  return [
    { id: 'WRD-GEN', name: 'General Medical Ward A', floor: '2nd Floor', type: 'General', dailyRate: 180 },
    { id: 'WRD-ICU', name: 'Intensive Care Unit (ICU)', floor: '3rd Floor', type: 'ICU', dailyRate: 650 },
    { id: 'WRD-CAR', name: 'Cardiology Telemetry Wing', floor: '4th Floor', type: 'Cardiology', dailyRate: 390 },
    { id: 'WRD-PED', name: 'Pediatrics Care Unit', floor: '2nd Floor', type: 'Pediatrics', dailyRate: 220 },
  ];
}

export function createInitialBeds(): Bed[] {
  const today = getTodayIso();
  return [
    {
      id: 'BED-GEN-101',
      bedNumber: 'G-101',
      wardId: 'WRD-GEN',
      wardName: 'General Medical Ward A',
      status: 'Occupied',
      patientId: 'PAT-2026-0003',
      patientName: 'Eleanor Brooks',
      admittedDate: addDaysIso(today, -4),
      expectedDischarge: addDaysIso(today, 2),
      notes: 'Post-operative physical rehabilitation',
    },
    { id: 'BED-GEN-102', bedNumber: 'G-102', wardId: 'WRD-GEN', wardName: 'General Medical Ward A', status: 'Available' },
    { id: 'BED-GEN-103', bedNumber: 'G-103', wardId: 'WRD-GEN', wardName: 'General Medical Ward A', status: 'Available' },
    {
      id: 'BED-GEN-104',
      bedNumber: 'G-104',
      wardId: 'WRD-GEN',
      wardName: 'General Medical Ward A',
      status: 'Reserved',
      patientId: 'PAT-2026-0004',
      patientName: 'Mateo Alvarez',
      admittedDate: addDaysIso(today, 1),
      notes: 'Reserved for elective overnight observation',
    },
    { id: 'BED-GEN-105', bedNumber: 'G-105', wardId: 'WRD-GEN', wardName: 'General Medical Ward A', status: 'Available' },
    { id: 'BED-ICU-201', bedNumber: 'ICU-201', wardId: 'WRD-ICU', wardName: 'Intensive Care Unit (ICU)', status: 'Available' },
    { id: 'BED-ICU-202', bedNumber: 'ICU-202', wardId: 'WRD-ICU', wardName: 'Intensive Care Unit (ICU)', status: 'Available' },
    { id: 'BED-ICU-203', bedNumber: 'ICU-203', wardId: 'WRD-ICU', wardName: 'Intensive Care Unit (ICU)', status: 'Reserved', notes: 'Held for scheduled surgical recovery' },
    {
      id: 'BED-CAR-301',
      bedNumber: 'C-301',
      wardId: 'WRD-CAR',
      wardName: 'Cardiology Telemetry Wing',
      status: 'Occupied',
      patientId: 'PAT-2026-0005',
      patientName: 'Hannah Lindqvist',
      admittedDate: addDaysIso(today, -2),
      expectedDischarge: addDaysIso(today, 1),
      notes: '48h Telemetry monitoring',
    },
    { id: 'BED-CAR-302', bedNumber: 'C-302', wardId: 'WRD-CAR', wardName: 'Cardiology Telemetry Wing', status: 'Available' },
    { id: 'BED-PED-401', bedNumber: 'P-401', wardId: 'WRD-PED', wardName: 'Pediatrics Care Unit', status: 'Available' },
    { id: 'BED-PED-402', bedNumber: 'P-402', wardId: 'WRD-PED', wardName: 'Pediatrics Care Unit', status: 'Available' },
  ];
}

export function createInitialInvoices(): Invoice[] {
  const today = getTodayIso();
  return [
    {
      id: 'INV-2026-001',
      patientId: 'PAT-2026-0001',
      patientName: 'Aarav Kulkarni',
      date: addDaysIso(today, -95),
      dueDate: addDaysIso(today, -65),
      consultationCharges: 180,
      roomCharges: 0,
      labCharges: 145,
      medicineCharges: 65,
      discount: 0,
      totalAmount: 390,
      paidAmount: 390,
      paymentStatus: 'Paid',
      paymentMethod: 'Card',
      notes: 'Cardiology OPD + Lipid Panel',
    },
    {
      id: 'INV-2026-002',
      patientId: 'PAT-2026-0003',
      patientName: 'Eleanor Brooks',
      date: addDaysIso(today, -35),
      dueDate: addDaysIso(today, -5),
      consultationCharges: 195,
      roomCharges: 720,
      labCharges: 210,
      medicineCharges: 160,
      discount: 50,
      totalAmount: 1235,
      paidAmount: 600,
      paymentStatus: 'Partially Paid',
      paymentMethod: 'Insurance',
      notes: '4-day General Ward stay & rehabilitation',
    },
    {
      id: 'INV-2026-003',
      patientId: 'PAT-2026-0005',
      patientName: 'Hannah Lindqvist',
      date: addDaysIso(today, -2),
      dueDate: addDaysIso(today, 12),
      consultationCharges: 180,
      roomCharges: 780,
      labCharges: 320,
      medicineCharges: 110,
      discount: 0,
      totalAmount: 1390,
      paidAmount: 0,
      paymentStatus: 'Pending',
      notes: 'Cardiology Telemetry admission & troponin assay',
    },
    {
      id: 'INV-2026-004',
      patientId: 'PAT-2026-0002',
      patientName: 'Clara Vance',
      date: addDaysIso(today, -65),
      dueDate: addDaysIso(today, -45),
      consultationCharges: 210,
      roomCharges: 0,
      labCharges: 95,
      medicineCharges: 45,
      discount: 0,
      totalAmount: 350,
      paidAmount: 350,
      paymentStatus: 'Paid',
      paymentMethod: 'Bank Transfer',
      notes: 'Neurology consultation',
    },
    {
      id: 'INV-2026-005',
      patientId: 'PAT-2026-0004',
      patientName: 'Mateo Alvarez',
      date: today,
      dueDate: addDaysIso(today, 14),
      consultationCharges: 150,
      roomCharges: 0,
      labCharges: 65,
      medicineCharges: 35,
      discount: 0,
      totalAmount: 250,
      paidAmount: 250,
      paymentStatus: 'Paid',
      paymentMethod: 'Card',
      notes: 'Internal Medicine preventive consult + CBC',
    },
  ];
}

export function createInitialMedicines(): Medicine[] {
  const today = getTodayIso();
  return [
    {
      id: 'MED-101',
      name: 'Amoxicillin 500mg',
      genericName: 'Amoxicillin Trihydrate',
      category: 'Antibiotic',
      manufacturer: 'Helios Pharma',
      batchNumber: 'AMX-2026-84',
      stock: 145,
      reorderLevel: 40,
      unitPrice: 1.25,
      expiryDate: addDaysIso(today, 280),
      unit: 'Capsules',
    },
    {
      id: 'MED-102',
      name: 'Atorvastatin 20mg',
      genericName: 'Atorvastatin Calcium',
      category: 'Cardiovascular',
      manufacturer: 'Nordic BioMed',
      batchNumber: 'ATV-2026-12',
      stock: 18,
      reorderLevel: 30,
      unitPrice: 2.4,
      expiryDate: addDaysIso(today, 190),
      unit: 'Tablets',
    },
    {
      id: 'MED-103',
      name: 'Insulin Glargine 100U/mL',
      genericName: 'Insulin Glargine',
      category: 'Endocrinology',
      manufacturer: 'Vanguard Labs',
      batchNumber: 'INS-2025-99',
      stock: 14,
      reorderLevel: 20,
      unitPrice: 38.0,
      expiryDate: addDaysIso(today, 28), // Near expiry!
      unit: 'Vials',
    },
    {
      id: 'MED-104',
      name: 'Paracetamol IV 1000mg',
      genericName: 'Acetaminophen',
      category: 'Analgesic',
      manufacturer: 'MedCore Solutions',
      batchNumber: 'PCM-2026-41',
      stock: 92,
      reorderLevel: 25,
      unitPrice: 4.5,
      expiryDate: addDaysIso(today, 45), // Near expiry!
      unit: 'Bottles',
    },
    {
      id: 'MED-105',
      name: 'Metoprolol Succinate 50mg',
      genericName: 'Metoprolol',
      category: 'Cardiovascular',
      manufacturer: 'Helios Pharma',
      batchNumber: 'MTP-2026-05',
      stock: 210,
      reorderLevel: 50,
      unitPrice: 1.8,
      expiryDate: addDaysIso(today, 340),
      unit: 'Tablets',
    },
    {
      id: 'MED-106',
      name: 'Salbutamol Inhaler 100mcg',
      genericName: 'Albuterol Sulfate',
      category: 'Respiratory',
      manufacturer: 'AeroHealth',
      batchNumber: 'SLB-2026-73',
      stock: 11,
      reorderLevel: 15,
      unitPrice: 14.5,
      expiryDate: addDaysIso(today, 150),
      unit: 'Inhalers',
    },
  ];
}

export function createInitialLabTests(): LabTest[] {
  const today = getTodayIso();
  return [
    {
      id: 'LAB-2026-001',
      testName: 'Complete Blood Count (CBC)',
      category: 'Hematology',
      patientId: 'PAT-2026-0004',
      patientName: 'Mateo Alvarez',
      orderedByDoctor: 'Dr. Robert Sterling',
      requestDate: today,
      status: 'Processing',
      referenceRange: 'WBC 4.5-11.0 x10^9/L · Hgb 13.5-17.5 g/dL',
      cost: 65,
      technician: 'S. Mercer, CLS',
    },
    {
      id: 'LAB-2026-002',
      testName: 'High-Sensitivity Troponin I',
      category: 'Cardiac Biomarkers',
      patientId: 'PAT-2026-0005',
      patientName: 'Hannah Lindqvist',
      orderedByDoctor: 'Dr. Evelyn Reed',
      requestDate: addDaysIso(today, -1),
      completedDate: today,
      status: 'Completed',
      resultSummary: '11 ng/L (Within normal reference interval)',
      referenceRange: '< 19 ng/L',
      cost: 140,
      technician: 'K. Okafor, CLS',
    },
    {
      id: 'LAB-2026-003',
      testName: 'Comprehensive Lipid Panel',
      category: 'Clinical Chemistry',
      patientId: 'PAT-2026-0001',
      patientName: 'Aarav Kulkarni',
      orderedByDoctor: 'Dr. Evelyn Reed',
      requestDate: addDaysIso(today, -12),
      completedDate: addDaysIso(today, -12),
      status: 'Completed',
      resultSummary: 'Total Cholesterol 176 mg/dL · LDL 98 mg/dL · HDL 52 mg/dL',
      referenceRange: 'Total < 200 mg/dL · LDL < 100 mg/dL',
      cost: 95,
      technician: 'S. Mercer, CLS',
    },
    {
      id: 'LAB-2026-004',
      testName: 'Pediatric Nasal Respiratory Panel',
      category: 'Microbiology',
      patientId: 'PAT-2026-0006',
      patientName: 'Noah Takahashi',
      orderedByDoctor: 'Dr. Ananya Rao',
      requestDate: today,
      status: 'Requested',
      referenceRange: 'Negative for target viral antigens',
      cost: 110,
      technician: 'Unassigned',
    },
  ];
}

export function createInitialStaff(): StaffMember[] {
  return [
    {
      id: 'STF-101',
      fullName: 'Priya Nair',
      role: 'Lead Receptionist',
      department: 'Front Desk & Admissions',
      shift: 'Morning',
      phone: '+1 (555) 301-1101',
      email: 'priya.nair@medicarepro.demo',
      joinDate: '2023-04-12',
      status: 'Active',
      availability: 'On Shift',
    },
    {
      id: 'STF-102',
      fullName: 'Sonia Mercer',
      role: 'Senior Lab Technologist',
      department: 'Pathology & Laboratory',
      shift: 'Morning',
      phone: '+1 (555) 301-1102',
      email: 'sonia.mercer@medicarepro.demo',
      joinDate: '2022-08-01',
      status: 'Active',
      availability: 'Available',
    },
    {
      id: 'STF-103',
      fullName: 'David Park',
      role: 'Head Charge Nurse',
      department: 'Intensive Care Unit (ICU)',
      shift: 'Evening',
      phone: '+1 (555) 301-1103',
      email: 'david.park@medicarepro.demo',
      joinDate: '2021-11-15',
      status: 'Active',
      availability: 'On Shift',
    },
    {
      id: 'STF-104',
      fullName: 'Elena Morozova',
      role: 'Clinical Pharmacist',
      department: 'Central Pharmacy',
      shift: 'Morning',
      phone: '+1 (555) 301-1104',
      email: 'elena.m@medicarepro.demo',
      joinDate: '2024-01-22',
      status: 'Active',
      availability: 'Available',
    },
    {
      id: 'STF-105',
      fullName: 'Marcus Holloway',
      role: 'Billing & Insurance Specialist',
      department: 'Revenue & Finance',
      shift: 'Morning',
      phone: '+1 (555) 301-1105',
      email: 'marcus.h@medicarepro.demo',
      joinDate: '2023-09-10',
      status: 'On Leave',
      availability: 'On Leave',
    },
    {
      id: 'STF-106',
      fullName: 'Nadia Al-Mansoor',
      role: 'Registered Ward Nurse',
      department: 'Cardiology',
      shift: 'Night',
      phone: '+1 (555) 301-1106',
      email: 'nadia.m@medicarepro.demo',
      joinDate: '2023-11-03',
      status: 'Active',
      availability: 'Off Duty',
    },
  ];
}

export function createInitialActivities(): ActivityLog[] {
  const today = getTodayIso();
  return [
    {
      id: 'ACT-01',
      timestamp: `${today} 09:15`,
      actor: 'Priya Nair',
      module: 'Patients',
      message: 'Registered new patient Noah Takahashi (PAT-2026-0006)',
    },
    {
      id: 'ACT-02',
      timestamp: `${today} 09:02`,
      actor: 'Dr. Evelyn Reed',
      module: 'Laboratory',
      message: 'Reviewed High-Sensitivity Troponin I result for Hannah Lindqvist',
    },
    {
      id: 'ACT-03',
      timestamp: `${today} 08:40`,
      actor: 'David Park',
      module: 'Beds & Wards',
      message: 'Verified bed C-301 telemetry monitoring status',
    },
    {
      id: 'ACT-04',
      timestamp: `${addDaysIso(today, -1)} 16:45`,
      actor: 'Elena Morozova',
      module: 'Pharmacy',
      message: 'Flagged low inventory alert for Atorvastatin 20mg (18 left)',
    },
  ];
}

// ID Generators
export function generatePatientId(existing: Patient[]): string {
  const year = new Date().getFullYear();
  const maxNum = existing.reduce((max, p) => {
    const match = p.id.match(/(\d+)$/);
    const num = match ? parseInt(match[1], 10) : 0;
    return num > max ? num : max;
  }, 0);
  return `PAT-${year}-${String(maxNum + 1).padStart(4, '0')}`;
}

export function generateSequentialId(prefix: string, existingIds: string[], pad = 3): string {
  const maxNum = existingIds.reduce((max, id) => {
    const match = id.match(/(\d+)$/);
    const num = match ? parseInt(match[1], 10) : 0;
    return num > max ? num : max;
  }, 100);
  return `${prefix}-${String(maxNum + 1).padStart(pad, '0')}`;
}

export function generateYearSequentialId(prefix: string, existingIds: string[]): string {
  const year = new Date().getFullYear();
  const maxNum = existingIds.reduce((max, id) => {
    const match = id.match(/(\d+)$/);
    const num = match ? parseInt(match[1], 10) : 0;
    return num > max ? num : max;
  }, 0);
  return `${prefix}-${year}-${String(maxNum + 1).padStart(3, '0')}`;
}

// Conflict Detection: Prevents the same doctor from having two active appointments at the same date & time
export function detectAppointmentConflict(
  appointments: Appointment[],
  doctorId: string,
  date: string,
  time: string,
  excludeAppointmentId?: string
): Appointment | undefined {
  return appointments.find(
    (apt) =>
      apt.id !== excludeAppointmentId &&
      apt.doctorId === doctorId &&
      apt.date === date &&
      apt.time === time &&
      apt.status !== 'Cancelled'
  );
}

// Automatic Billing Calculation
export function calculateInvoiceTotal(
  consultationCharges: number,
  roomCharges: number,
  labCharges: number,
  medicineCharges: number,
  discount: number
): number {
  const subtotal =
    Math.max(0, Number(consultationCharges) || 0) +
    Math.max(0, Number(roomCharges) || 0) +
    Math.max(0, Number(labCharges) || 0) +
    Math.max(0, Number(medicineCharges) || 0);
  return Math.max(0, subtotal - Math.max(0, Number(discount) || 0));
}

// Dynamic Notification Generator derived from live hospital state
export function buildHospitalNotifications(params: {
  appointments: Appointment[];
  invoices: Invoice[];
  medicines: Medicine[];
  beds: Bed[];
  patients: Patient[];
  labTests: LabTest[];
  emergencyCases?: EmergencyCase[];
  discharges?: DischargeRecord[];
  bloodInventory?: BloodGroupStock[];
  readIds: string[];
}): NotificationItem[] {
  const today = getTodayIso();
  const items: NotificationItem[] = [];

  // 0. Low-stock blood bank alerts
  (params.bloodInventory ?? [])
    .filter((b) => b.unitsAvailable <= b.minThreshold)
    .forEach((b) => {
      const id = `notif-blood-${b.bloodGroup}-${b.unitsAvailable}`;
      items.push({
        id,
        title: `Low Blood Bank Stock · ${b.bloodGroup}`,
        message: `Only ${b.unitsAvailable} units of ${b.bloodGroup} remaining (threshold: ${b.minThreshold} units).`,
        category: 'Blood Bank',
        severity: b.unitsAvailable <= 2 ? 'critical' : 'warning',
        timestamp: b.lastUpdated,
        targetPage: 'blood-bank',
        read: params.readIds.includes(id),
      });
    });

  // 0a. Pending discharge approvals
  (params.discharges ?? [])
    .filter((d) => d.status !== 'Completed')
    .forEach((d) => {
      const id = `notif-dsc-${d.id}-${d.status}-${d.doctorApproval}`;
      items.push({
        id,
        title: `Pending Discharge · ${d.patientName}`,
        message: `${d.id} is ${d.status} (Physician Approval: ${d.doctorApproval}).`,
        category: 'Discharge',
        severity: d.doctorApproval === 'Pending' ? 'warning' : 'info',
        timestamp: d.requestDate,
        targetPage: 'discharge',
        read: params.readIds.includes(id),
      });
    });

  // 0b. Critical active emergency cases
  (params.emergencyCases ?? [])
    .filter((c) => c.treatmentStatus !== 'Discharged' && (c.priority === 'Critical' || c.priority === 'High'))
    .forEach((c) => {
      const id = `notif-emrg-${c.id}-${c.treatmentStatus}`;
      items.push({
        id,
        title: `Emergency Alert (${c.priority}) · ${c.id}`,
        message: `${c.patientName} — ${c.chiefComplaint} (${c.treatmentStatus}${
          c.assignedDoctorName ? `, ${c.assignedDoctorName}` : ', Unassigned'
        }).`,
        category: 'Emergency',
        severity: c.priority === 'Critical' ? 'critical' : 'warning',
        timestamp: c.arrivalTime.slice(0, 16).replace('T', ' '),
        targetPage: 'emergency',
        read: params.readIds.includes(id),
      });
    });

  // 1. Upcoming appointments today
  const todayApts = params.appointments.filter(
    (a) => a.date === today && (a.status === 'Scheduled' || a.status === 'Pending')
  );
  todayApts.forEach((apt) => {
    const id = `notif-apt-${apt.id}`;
    items.push({
      id,
      title: `Upcoming Appointment at ${apt.time}`,
      message: `${apt.patientName} is scheduled with ${apt.doctorName} (${apt.department}).`,
      category: 'Appointment',
      severity: 'info',
      timestamp: `${apt.date} ${apt.time}`,
      targetPage: 'appointments',
      read: params.readIds.includes(id),
    });
  });

  // 2. Pending / Partial payments
  params.invoices
    .filter((inv) => inv.paymentStatus !== 'Paid')
    .forEach((inv) => {
      const balance = Math.max(0, inv.totalAmount - inv.paidAmount);
      const id = `notif-inv-${inv.id}`;
      items.push({
        id,
        title: `Pending Payment · ${inv.id}`,
        message: `${inv.patientName} has an outstanding balance of ${formatCurrency(balance)} (${inv.paymentStatus}).`,
        category: 'Billing',
        severity: inv.paymentStatus === 'Pending' ? 'warning' : 'info',
        timestamp: inv.date,
        targetPage: 'billing',
        read: params.readIds.includes(id),
      });
    });

  // 3. Low-stock medicines
  params.medicines
    .filter((m) => m.stock <= m.reorderLevel)
    .forEach((med) => {
      const id = `notif-stock-${med.id}`;
      items.push({
        id,
        title: `Low Medicine Stock · ${med.name}`,
        message: `Only ${med.stock} ${med.unit.toLowerCase()} remaining (reorder threshold: ${med.reorderLevel}).`,
        category: 'Pharmacy',
        severity: 'critical',
        timestamp: today,
        targetPage: 'pharmacy',
        read: params.readIds.includes(id),
      });
    });

  // 4. Near-expiry medicines (within 60 days)
  const sixtyDaysOut = addDaysIso(today, 60);
  params.medicines
    .filter((m) => m.expiryDate <= sixtyDaysOut)
    .forEach((med) => {
      const id = `notif-exp-${med.id}`;
      items.push({
        id,
        title: `Near-Expiry Alert · ${med.name}`,
        message: `Batch ${med.batchNumber} expires on ${med.expiryDate}. Review dispensing priority.`,
        category: 'Pharmacy',
        severity: 'warning',
        timestamp: med.expiryDate,
        targetPage: 'pharmacy',
        read: params.readIds.includes(id),
      });
    });

  // 5. Available beds summary
  const availableBedsCount = params.beds.filter((b) => b.status === 'Available').length;
  const bedNotifId = `notif-beds-summary-${availableBedsCount}`;
  items.push({
    id: bedNotifId,
    title: `${availableBedsCount} Hospital Beds Available`,
    message: `${availableBedsCount} of ${params.beds.length} total beds across all wards are ready for immediate admission.`,
    category: 'Beds',
    severity: availableBedsCount <= 2 ? 'warning' : 'success',
    timestamp: today,
    targetPage: 'beds',
    read: params.readIds.includes(bedNotifId),
  });

  // 6. Newly registered patients (within last 3 days)
  const recentCutoff = addDaysIso(today, -3);
  params.patients
    .filter((p) => p.registrationDate >= recentCutoff)
    .slice(0, 3)
    .forEach((p) => {
      const id = `notif-pat-${p.id}`;
      items.push({
        id,
        title: `New Patient Registered · ${p.fullName}`,
        message: `Patient ID ${p.id} (${p.bloodGroup}, ${p.age}y) added on ${p.registrationDate}.`,
        category: 'Patients',
        severity: 'success',
        timestamp: p.registrationDate,
        targetPage: 'patients',
        read: params.readIds.includes(id),
      });
    });

  return items;
}

function getRecentMonthBuckets(monthCount = 6): { key: string; label: string }[] {
  const now = new Date();
  const buckets: { key: string; label: string }[] = [];
  for (let i = monthCount - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    const label = d.toLocaleString('en-US', { month: 'short' });
    buckets.push({ key, label });
  }
  return buckets;
}

export function computeMonthlyRegistrations(
  patients: Patient[],
  monthCount = 6
): { month: string; registrations: number }[] {
  const buckets = getRecentMonthBuckets(monthCount);
  const counts = new Map<string, number>();
  buckets.forEach((b) => counts.set(b.key, 0));

  patients.forEach((p) => {
    const ym = p.registrationDate.slice(0, 7);
    if (counts.has(ym)) {
      counts.set(ym, (counts.get(ym) ?? 0) + 1);
    }
  });

  return buckets.map((b) => ({
    month: b.label,
    registrations: counts.get(b.key) ?? 0,
  }));
}

export function computeMonthlyRevenue(
  invoices: Invoice[],
  monthCount = 6
): { month: string; collected: number; pending: number }[] {
  const buckets = getRecentMonthBuckets(monthCount);
  const totals = new Map<string, { collected: number; pending: number }>();
  buckets.forEach((b) => totals.set(b.key, { collected: 0, pending: 0 }));

  invoices.forEach((inv) => {
    const ym = inv.date.slice(0, 7);
    const bucket = totals.get(ym);
    if (bucket) {
      bucket.collected += inv.paidAmount;
      bucket.pending += Math.max(0, inv.totalAmount - inv.paidAmount);
    }
  });

  return buckets.map((b) => {
    const entry = totals.get(b.key) ?? { collected: 0, pending: 0 };
    return {
      month: b.label,
      collected: Math.round(entry.collected * 100) / 100,
      pending: Math.round(entry.pending * 100) / 100,
    };
  });
}

export function computeDepartmentStats(
  appointments: Appointment[],
  doctors: Doctor[]
): { department: string; count: number; doctors: number }[] {
  const map = new Map<string, { count: number; doctors: number }>();

  doctors.forEach((d) => {
    const prev = map.get(d.department) ?? { count: 0, doctors: 0 };
    prev.doctors += 1;
    map.set(d.department, prev);
  });

  appointments.forEach((a) => {
    const prev = map.get(a.department) ?? { count: 0, doctors: 0 };
    prev.count += 1;
    map.set(a.department, prev);
  });

  return Array.from(map.entries())
    .map(([department, vals]) => ({
      department,
      count: vals.count,
      doctors: vals.doctors,
    }))
    .sort((a, b) => b.count - a.count);
}

export function computeBedOccupancyByWard(
  wards: Ward[],
  beds: Bed[]
): { ward: string; available: number; occupied: number; reserved: number }[] {
  return wards.map((w) => {
    const wardBeds = beds.filter((b) => b.wardId === w.id);
    return {
      ward: w.name.replace(' Ward A', '').replace(' Unit', '').replace(' Wing', ''),
      available: wardBeds.filter((b) => b.status === 'Available').length,
      occupied: wardBeds.filter((b) => b.status === 'Occupied').length,
      reserved: wardBeds.filter((b) => b.status === 'Reserved').length,
    };
  });
}

export function createInitialQueueTokens(): QueueToken[] {
  const now = Date.now();
  const minsAgo = (m: number) => new Date(now - m * 60_000).toISOString();
  return [
    {
      id: 'QUE-2026-001',
      tokenNumber: 'T-101',
      patientId: 'PAT-2026-0001',
      patientName: 'Aarav Kulkarni',
      department: 'Cardiology',
      doctorId: 'DOC-101',
      doctorName: 'Dr. Evelyn Reed',
      priority: 'Standard',
      status: 'Completed',
      checkInTime: minsAgo(95),
      calledAt: minsAgo(80),
      completedAt: minsAgo(58),
      notes: 'Routine ECG follow-up check completed.',
    },
    {
      id: 'QUE-2026-002',
      tokenNumber: 'T-102',
      patientId: 'PAT-2026-0002',
      patientName: 'Clara Vance',
      department: 'Neurology',
      doctorId: 'DOC-102',
      doctorName: 'Dr. Marcus Chen',
      priority: 'Priority',
      status: 'Completed',
      checkInTime: minsAgo(68),
      calledAt: minsAgo(55),
      completedAt: minsAgo(36),
      notes: 'Follow-up consultation concluded.',
    },
    {
      id: 'QUE-2026-003',
      tokenNumber: 'T-103',
      patientId: 'PAT-2026-0003',
      patientName: 'Eleanor Brooks',
      department: 'Orthopedics',
      doctorId: 'DOC-103',
      doctorName: 'Dr. Robert Sterling',
      priority: 'Priority',
      status: 'Consulting',
      checkInTime: minsAgo(28),
      calledAt: minsAgo(10),
      notes: 'Post-operative mobility evaluation.',
    },
    {
      id: 'QUE-2026-004',
      tokenNumber: 'T-104',
      patientId: 'PAT-2026-0004',
      patientName: 'Mateo Alvarez',
      department: 'Internal Medicine',
      doctorId: 'DOC-103',
      doctorName: 'Dr. Robert Sterling',
      priority: 'Standard',
      status: 'Waiting',
      checkInTime: minsAgo(16),
      notes: 'Annual wellness lab review.',
    },
    {
      id: 'QUE-2026-005',
      tokenNumber: 'T-105',
      patientId: 'PAT-2026-0005',
      patientName: 'Hannah Lindqvist',
      department: 'Cardiology',
      doctorId: 'DOC-101',
      doctorName: 'Dr. Evelyn Reed',
      priority: 'Urgent',
      status: 'Waiting',
      checkInTime: minsAgo(7),
      notes: 'Elevated heart rate review.',
    },
  ];
}

export function createInitialAuditLogs(): AuditLogEntry[] {
  const now = Date.now();
  const minsAgo = (m: number) => new Date(now - m * 60_000).toISOString();
  return [
    {
      id: 'AUD-1001',
      timestamp: minsAgo(120),
      actorName: 'Priya Nair',
      actorEmail: 'reception@medicarepro.demo',
      actorRole: 'Receptionist',
      module: 'Authentication',
      action: 'User Login',
      details: 'Signed in under Receptionist demonstration workspace.',
    },
    {
      id: 'AUD-1002',
      timestamp: minsAgo(90),
      actorName: 'Dr. Evelyn Reed',
      actorEmail: 'doctor@medicarepro.demo',
      actorRole: 'Doctor',
      module: 'Laboratory',
      action: 'Reviewed Lab Report',
      entityId: 'PAT-2026-0005',
      details: 'Verified High-Sensitivity Troponin I result for Hannah Lindqvist.',
    },
    {
      id: 'AUD-1003',
      timestamp: minsAgo(45),
      actorName: 'Dr. Vikram Sethi',
      actorEmail: 'admin@medicarepro.demo',
      actorRole: 'Admin',
      module: 'Beds & Wards',
      action: 'Bed Allocation Verified',
      entityId: 'BED-CAR-01',
      details: 'Confirmed telemetry bed assignment in Cardiology Wing.',
    },
  ];
}

/**
 * Computes estimated wait time strictly from completed historical tokens.
 * Returns null estimates when fewer than 2 completed visits exist in history.
 */
export function computeQueueWaitEstimate(
  tokens: QueueToken[],
  department?: string
): {
  hasSufficientData: boolean;
  avgConsultMins: number | null;
  estimatedWaitMins: number | null;
  sampleCount: number;
  waitingCount: number;
} {
  const completedPool = tokens.filter((t) => {
    if (t.status !== 'Completed' || !t.calledAt || !t.completedAt) return false;
    if (department && department !== 'All' && t.department !== department) return false;
    const dur = (new Date(t.completedAt).getTime() - new Date(t.calledAt).getTime()) / 60_000;
    return Number.isFinite(dur) && dur > 0 && dur < 180;
  });

  const fallbackPool =
    completedPool.length >= 2
      ? completedPool
      : tokens.filter((t) => {
          if (t.status !== 'Completed' || !t.calledAt || !t.completedAt) return false;
          const dur = (new Date(t.completedAt).getTime() - new Date(t.calledAt).getTime()) / 60_000;
          return Number.isFinite(dur) && dur > 0 && dur < 180;
        });

  const waitingCount = tokens.filter(
    (t) => t.status === 'Waiting' && (!department || department === 'All' || t.department === department)
  ).length;

  if (fallbackPool.length < 2) {
    return {
      hasSufficientData: false,
      avgConsultMins: null,
      estimatedWaitMins: null,
      sampleCount: fallbackPool.length,
      waitingCount,
    };
  }

  const totalMins = fallbackPool.reduce((sum, t) => {
    const dur = (new Date(t.completedAt!).getTime() - new Date(t.calledAt!).getTime()) / 60_000;
    return sum + dur;
  }, 0);
  const avgConsultMins = Math.max(1, Math.round(totalMins / fallbackPool.length));
  const estimatedWaitMins = waitingCount > 0 ? waitingCount * avgConsultMins : 0;

  return {
    hasSufficientData: true,
    avgConsultMins,
    estimatedWaitMins,
    sampleCount: fallbackPool.length,
    waitingCount,
  };
}

export function createInitialEmrDiagnoses(): EmrDiagnosis[] {
  const today = getTodayIso();
  return [
    {
      id: 'DX-2026-001',
      patientId: 'PAT-2026-0001',
      date: addDaysIso(today, -125),
      condition: 'Essential Hypertension (Stage 1)',
      icdCode: 'I10',
      doctorId: 'DOC-101',
      doctorName: 'Dr. Evelyn Reed',
      department: 'Cardiology',
      severity: 'Moderate',
      status: 'Monitoring',
      notes: 'BP stabilized on dietary sodium reduction and scheduled monitoring.',
    },
    {
      id: 'DX-2026-002',
      patientId: 'PAT-2026-0002',
      date: addDaysIso(today, -95),
      condition: 'Episodic Migraine without Aura',
      icdCode: 'G43.0',
      doctorId: 'DOC-102',
      doctorName: 'Dr. Marcus Chen',
      department: 'Neurology',
      severity: 'Mild',
      status: 'Resolved',
      notes: 'Trigger log maintained; frequency decreased substantially.',
    },
    {
      id: 'DX-2026-003',
      patientId: 'PAT-2026-0005',
      date: addDaysIso(today, -3),
      condition: 'Paroxysmal Atrial Flutter under Telemetry Observation',
      icdCode: 'I48.3',
      doctorId: 'DOC-101',
      doctorName: 'Dr. Evelyn Reed',
      department: 'Cardiology',
      severity: 'Severe',
      status: 'Active',
      notes: 'Continuous telemetry in Cardiology Wing Bed C-301.',
    },
  ];
}

export function createInitialEmrPrescriptions(): EmrPrescription[] {
  const today = getTodayIso();
  return [
    {
      id: 'RX-2026-001',
      patientId: 'PAT-2026-0001',
      date: addDaysIso(today, -12),
      medicationName: 'Atorvastatin 20mg Tablet',
      dosage: '20 mg',
      frequency: 'Once daily at bedtime',
      duration: '30 days',
      prescribedBy: 'Dr. Evelyn Reed',
      status: 'Active',
      instructions: 'Monitor lipid panel after 30 days.',
    },
    {
      id: 'RX-2026-002',
      patientId: 'PAT-2026-0003',
      date: addDaysIso(today, -14),
      medicationName: 'Enoxaparin Sodium 40mg',
      dosage: '40 mg',
      frequency: 'Once daily subcutaneous',
      duration: '14 days',
      prescribedBy: 'Dr. Robert Sterling',
      status: 'Completed',
      instructions: 'Post-operative DVT prophylaxis regimen.',
    },
    {
      id: 'RX-2026-003',
      patientId: 'PAT-2026-0005',
      date: addDaysIso(today, -3),
      medicationName: 'Metoprolol Tartrate 25mg',
      dosage: '25 mg',
      frequency: 'Twice daily',
      duration: '30 days',
      prescribedBy: 'Dr. Evelyn Reed',
      status: 'Active',
      instructions: 'Hold if resting HR < 55 bpm.',
    },
  ];
}

export function createInitialEmergencyCases(): EmergencyCase[] {
  const now = Date.now();
  const minsAgo = (m: number) => new Date(now - m * 60_000).toISOString();
  return [
    {
      id: 'EMRG-2026-001',
      patientId: 'PAT-2026-0005',
      patientName: 'Hannah Lindqvist',
      arrivalTime: minsAgo(48),
      chiefComplaint: 'Acute chest tightness & palpitations',
      triageVitals: 'BP 148/92 · HR 118 bpm · SpO2 96%',
      priority: 'Critical',
      assignedDoctorId: 'DOC-101',
      assignedDoctorName: 'Dr. Evelyn Reed',
      treatmentStatus: 'Admitted',
      admittedWard: 'Cardiology Wing',
      bedId: 'BED-CAR-01',
      bedNumber: 'C-301',
      notes: 'Transferred to Cardiology Telemetry Ward after initial ER stabilization.',
    },
    {
      id: 'EMRG-2026-002',
      patientId: 'PAT-2026-0004',
      patientName: 'Mateo Alvarez',
      arrivalTime: minsAgo(22),
      chiefComplaint: 'High fever (39.4°C) and severe dehydration',
      triageVitals: 'BP 108/68 · HR 104 bpm · Temp 39.4°C',
      priority: 'High',
      assignedDoctorId: 'DOC-103',
      assignedDoctorName: 'Dr. Robert Sterling',
      treatmentStatus: 'Under Treatment',
      notes: 'IV fluid hydration initiated in ER Bay 2.',
    },
  ];
}

export function createInitialDischarges(): DischargeRecord[] {
  const today = getTodayIso();
  return [
    {
      id: 'DSC-2026-001',
      patientId: 'PAT-2026-0005',
      patientName: 'Hannah Lindqvist',
      bedId: 'BED-CAR-01',
      bedNumber: 'C-301',
      wardName: 'Cardiology Wing',
      admittedDate: addDaysIso(today, -3),
      requestDate: today,
      doctorId: 'DOC-101',
      doctorName: 'Dr. Evelyn Reed',
      doctorApproval: 'Pending',
      status: 'Requested',
      consultationFee: 180,
      roomDays: 3,
      roomRate: 340,
      labCharges: 145,
      medicineCharges: 85,
      discount: 0,
      totalAmount: 1430,
      dischargeSummary:
        'Patient observed for 72h cardiac telemetry; rhythm stabilized without recurrence of atrial flutter.',
      medicationInstructions:
        'Continue Metoprolol Tartrate 25mg twice daily with meals; avoid caffeinated stimulants for 14 days.',
      followUpDate: addDaysIso(today, 7),
      followUpDoctor: 'Dr. Evelyn Reed',
    },
    {
      id: 'DSC-2026-002',
      patientId: 'PAT-2026-0001',
      patientName: 'Aarav Kulkarni',
      requestDate: addDaysIso(today, -14),
      dischargeDate: addDaysIso(today, -13),
      doctorId: 'DOC-101',
      doctorName: 'Dr. Evelyn Reed',
      doctorApproval: 'Approved',
      status: 'Completed',
      consultationFee: 150,
      roomDays: 1,
      roomRate: 210,
      labCharges: 95,
      medicineCharges: 45,
      discount: 25,
      totalAmount: 475,
      invoiceId: 'INV-2026-001',
      dischargeSummary:
        'Overnight hypertension & lipid observation concluded cleanly; blood pressure controlled at discharge.',
      medicationInstructions: 'Take Atorvastatin 20mg once daily at bedtime and monitor home BP daily.',
      followUpDate: addDaysIso(today, 14),
      followUpDoctor: 'Dr. Evelyn Reed',
    },
  ];
}

export function createInitialBloodInventory(): BloodGroupStock[] {
  const today = getTodayIso();
  return [
    { bloodGroup: 'O+', unitsAvailable: 14, minThreshold: 6, lastUpdated: today },
    { bloodGroup: 'O-', unitsAvailable: 3, minThreshold: 5, lastUpdated: today },
    { bloodGroup: 'A+', unitsAvailable: 11, minThreshold: 5, lastUpdated: today },
    { bloodGroup: 'A-', unitsAvailable: 4, minThreshold: 4, lastUpdated: today },
    { bloodGroup: 'B+', unitsAvailable: 9, minThreshold: 5, lastUpdated: today },
    { bloodGroup: 'B-', unitsAvailable: 2, minThreshold: 4, lastUpdated: today },
    { bloodGroup: 'AB+', unitsAvailable: 6, minThreshold: 3, lastUpdated: today },
    { bloodGroup: 'AB-', unitsAvailable: 2, minThreshold: 3, lastUpdated: today },
  ];
}

export function createInitialBloodDonations(): BloodDonation[] {
  const today = getTodayIso();
  return [
    {
      id: 'BDN-2026-001',
      donorName: 'Lucas Meyer',
      donorPhone: '+1 (555) 740-2211',
      bloodGroup: 'O+',
      units: 2,
      donationDate: addDaysIso(today, -2),
      screeningStatus: 'Cleared',
      notes: 'Voluntary campus drive donor.',
    },
    {
      id: 'BDN-2026-002',
      donorName: 'amira.solis (Amira Solis)',
      donorPhone: '+1 (555) 740-8834',
      bloodGroup: 'A+',
      units: 1,
      donationDate: addDaysIso(today, -1),
      screeningStatus: 'Cleared',
    },
  ];
}

export function createInitialBloodRequests(): BloodRequest[] {
  const today = getTodayIso();
  return [
    {
      id: 'BRQ-2026-001',
      patientId: 'PAT-2026-0005',
      patientName: 'Hannah Lindqvist',
      bloodGroup: 'O-',
      unitsRequested: 2,
      priority: 'Urgent',
      requestedBy: 'Dr. Evelyn Reed',
      requestDate: today,
      status: 'Pending',
      notes: 'Standby cross-match for cardiac telemetry monitoring.',
    },
    {
      id: 'BRQ-2026-002',
      patientId: 'PAT-2026-0003',
      patientName: 'Eleanor Brooks',
      bloodGroup: 'B+',
      unitsRequested: 1,
      priority: 'Routine',
      requestedBy: 'Dr. Robert Sterling',
      requestDate: addDaysIso(today, -10),
      status: 'Fulfilled',
      notes: 'Post-operative hemoglobin support.',
    },
  ];
}

export function createInitialBloodIssues(): BloodIssueRecord[] {
  const today = getTodayIso();
  return [
    {
      id: 'BIS-2026-001',
      requestId: 'BRQ-2026-002',
      patientId: 'PAT-2026-0003',
      patientName: 'Eleanor Brooks',
      bloodGroup: 'B+',
      unitsIssued: 1,
      issuedDate: addDaysIso(today, -10),
      issuedBy: 'Sonia Mercer',
      notes: 'Cross-match verified and released to Surgical Ward.',
    },
  ];
}

export function createInitialInsurancePolicies(): InsurancePolicy[] {
  const today = getTodayIso();
  return [
    {
      id: 'POL-2026-001',
      patientId: 'PAT-2026-0001',
      patientName: 'Aarav Kulkarni',
      providerName: 'BlueHorizon Health Assurance',
      policyNumber: 'BHA-994021-IND',
      planName: 'Comprehensive Premier Gold',
      coverageLimit: 50000,
      validUntil: addDaysIso(today, 240),
      status: 'Active',
    },
    {
      id: 'POL-2026-002',
      patientId: 'PAT-2026-0003',
      patientName: 'Eleanor Brooks',
      providerName: 'MedShield Senior Care',
      policyNumber: 'MSC-440129-SR',
      planName: 'Surgical & Orthopedic Advantage',
      coverageLimit: 75000,
      validUntil: addDaysIso(today, 180),
      status: 'Active',
    },
    {
      id: 'POL-2026-003',
      patientId: 'PAT-2026-0005',
      patientName: 'Hannah Lindqvist',
      providerName: 'PacificCare Mutual',
      policyNumber: 'PCM-782104-B',
      planName: 'Cardiac & Critical Care Cover',
      coverageLimit: 100000,
      validUntil: addDaysIso(today, 310),
      status: 'Pending Verification',
    },
  ];
}

export function createInitialInsuranceClaims(): InsuranceClaim[] {
  const today = getTodayIso();
  return [
    {
      id: 'CLM-2026-001',
      patientId: 'PAT-2026-0001',
      patientName: 'Aarav Kulkarni',
      policyId: 'POL-2026-001',
      policyNumber: 'BHA-994021-IND',
      providerName: 'BlueHorizon Health Assurance',
      invoiceId: 'INV-2026-001',
      submittedDate: addDaysIso(today, -10),
      claimAmount: 475,
      approvedAmount: 450,
      paidAmount: 450,
      status: 'Paid',
      diagnosisOrReason: 'Hypertension screening & lipid panel review',
      remarks: 'Settled via EFT directly to hospital account.',
    },
    {
      id: 'CLM-2026-002',
      patientId: 'PAT-2026-0003',
      patientName: 'Eleanor Brooks',
      policyId: 'POL-2026-002',
      policyNumber: 'MSC-440129-SR',
      providerName: 'MedShield Senior Care',
      invoiceId: 'INV-2026-002',
      submittedDate: addDaysIso(today, -3),
      claimAmount: 1850,
      approvedAmount: 0,
      paidAmount: 0,
      status: 'Under Review',
      diagnosisOrReason: 'Inpatient orthopedic physical therapy & recovery stay',
      remarks: 'Awaiting pre-authorization clearance note.',
    },
  ];
}

export function createInitialMedicinePurchases(): MedicinePurchase[] {
  const today = getTodayIso();
  return [
    {
      id: 'MPH-2026-001',
      medicineId: 'MED-101',
      medicineName: 'Amoxicillin 500mg Capsules',
      supplier: 'MedCore Wholesale Distributors',
      batchNumber: 'AMX-2026-04A',
      expiryDate: addDaysIso(today, 320),
      quantity: 120,
      unitCost: 1.8,
      totalCost: 216,
      purchaseDate: addDaysIso(today, -12),
      receivedBy: 'Elena Morozova',
      notes: 'Quarterly scheduled antimicrobial stock replenishment.',
    },
    {
      id: 'MPH-2026-002',
      medicineId: 'MED-103',
      medicineName: 'Metformin HCl 500mg Tablets',
      supplier: 'Apex Pharma Logistics',
      batchNumber: 'MTF-2026-11C',
      expiryDate: addDaysIso(today, 270),
      quantity: 200,
      unitCost: 0.9,
      totalCost: 180,
      purchaseDate: addDaysIso(today, -5),
      receivedBy: 'Elena Morozova',
      notes: 'Temperature-verified seal checked on delivery.',
    },
  ];
}

export function createInitialMedicineIssues(): MedicineIssue[] {
  const today = getTodayIso();
  return [
    {
      id: 'MIS-2026-001',
      medicineId: 'MED-102',
      medicineName: 'Atorvastatin 20mg Tablets',
      batchNumber: 'ATR-2026-09B',
      patientId: 'PAT-2026-0001',
      patientName: 'Aarav Kulkarni',
      quantity: 30,
      issuedDate: addDaysIso(today, -6),
      prescribedBy: 'Dr. Evelyn Reed',
      notes: '30-day outpatient cardiac lipid supply.',
    },
    {
      id: 'MIS-2026-002',
      medicineId: 'MED-104',
      medicineName: 'Enoxaparin Sodium 40mg',
      batchNumber: 'ENX-2026-02D',
      patientId: 'PAT-2026-0003',
      patientName: 'Eleanor Brooks',
      quantity: 7,
      issuedDate: addDaysIso(today, -2),
      prescribedBy: 'Dr. Robert Sterling',
      notes: 'Orthopedic ward inpatient dispensing.',
    },
  ];
}

export function createInitialAmbulances(): Ambulance[] {
  const today = getTodayIso();
  return [
    {
      id: 'AMB-101',
      vehicleNumber: 'MCP-ALS-01',
      plateNumber: 'HOSP-9401',
      type: 'ALS',
      driverName: 'Samuel Ortega',
      driverPhone: '+1 (555) 610-2001',
      driverLicense: 'CDL-B-774019',
      status: 'Available',
      lastServiceDate: addDaysIso(today, -18),
    },
    {
      id: 'AMB-102',
      vehicleNumber: 'MCP-ALS-02',
      plateNumber: 'HOSP-9402',
      type: 'ALS',
      driverName: 'Kenneth Wu',
      driverPhone: '+1 (555) 610-2002',
      driverLicense: 'CDL-B-883420',
      status: 'En Route',
      lastServiceDate: addDaysIso(today, -9),
    },
    {
      id: 'AMB-103',
      vehicleNumber: 'MCP-BLS-01',
      plateNumber: 'HOSP-9403',
      type: 'BLS',
      driverName: 'Tariq Hassan',
      driverPhone: '+1 (555) 610-2003',
      driverLicense: 'CDL-B-661204',
      status: 'Available',
      lastServiceDate: addDaysIso(today, -25),
    },
    {
      id: 'AMB-104',
      vehicleNumber: 'MCP-TRN-01',
      plateNumber: 'HOSP-9404',
      type: 'Patient Transport',
      driverName: 'Rachel Kim',
      driverPhone: '+1 (555) 610-2004',
      driverLicense: 'CDL-C-449012',
      status: 'Maintenance',
      lastServiceDate: today,
    },
  ];
}

export function createInitialAmbulanceTrips(): AmbulanceTrip[] {
  const now = Date.now();
  const minsAgo = (m: number) => new Date(now - m * 60_000).toISOString();
  return [
    {
      id: 'TRP-2026-001',
      ambulanceId: 'AMB-102',
      vehicleNumber: 'MCP-ALS-02',
      driverName: 'Kenneth Wu',
      patientName: 'Mateo Alvarez',
      patientId: 'PAT-2026-0004',
      emergencyCaseId: 'EMRG-2026-002',
      pickupLocation: '1180 Oakridge Avenue, Apt 4B',
      destination: 'MediCare Pro ER Bay 2',
      priority: 'Urgent',
      status: 'En Route',
      dispatchTime: minsAgo(28),
      notes: 'Paramedic telemetry pre-alert sent to Emergency Desk.',
    },
    {
      id: 'TRP-2026-002',
      ambulanceId: 'AMB-101',
      vehicleNumber: 'MCP-ALS-01',
      driverName: 'Samuel Ortega',
      patientName: 'Hannah Lindqvist',
      patientId: 'PAT-2026-0005',
      emergencyCaseId: 'EMRG-2026-001',
      pickupLocation: '742 Cedarcrest Plaza',
      destination: 'MediCare Pro Cardiology ER',
      priority: 'Critical',
      status: 'Completed',
      dispatchTime: minsAgo(140),
      completedTime: minsAgo(105),
      notes: 'Handover completed cleanly to Cardiology Telemetry team.',
    },
  ];
}

export function createInitialFeedback(): PatientFeedback[] {
  const today = getTodayIso();
  return [
    {
      id: 'FDB-2026-001',
      patientId: 'PAT-2026-0001',
      patientName: 'Aarav Kulkarni',
      department: 'Cardiology',
      doctorId: 'DOC-101',
      doctorName: 'Dr. Evelyn Reed',
      category: 'Clinical Care',
      rating: 5,
      comments: 'Clear explanation of ECG results and follow-up medication schedule.',
      submittedDate: addDaysIso(today, -12),
    },
    {
      id: 'FDB-2026-002',
      patientId: 'PAT-2026-0003',
      patientName: 'Eleanor Brooks',
      department: 'Orthopedics',
      doctorId: 'DOC-103',
      doctorName: 'Dr. Robert Sterling',
      category: 'Nursing & Support',
      rating: 5,
      comments: 'Attentive ward nursing and smooth physical therapy handoff.',
      submittedDate: addDaysIso(today, -6),
    },
    {
      id: 'FDB-2026-003',
      patientId: 'PAT-2026-0002',
      patientName: 'Clara Vance',
      department: 'Neurology',
      doctorId: 'DOC-102',
      doctorName: 'Dr. Marcus Chen',
      category: 'Clinical Care',
      rating: 4,
      comments: 'Thorough consultation and prompt migraine management plan.',
      submittedDate: addDaysIso(today, -4),
    },
    {
      id: 'FDB-2026-004',
      patientId: 'PAT-2026-0004',
      patientName: 'Mateo Alvarez',
      department: 'Internal Medicine',
      category: 'Front Desk & Queue',
      rating: 3,
      comments: 'Token queue was straightforward, though morning check-in wait felt slightly long.',
      submittedDate: addDaysIso(today, -2),
    },
    {
      id: 'FDB-2026-005',
      patientId: 'PAT-2026-0005',
      patientName: 'Hannah Lindqvist',
      department: 'Cardiology',
      doctorId: 'DOC-101',
      doctorName: 'Dr. Evelyn Reed',
      category: 'Pharmacy & Lab',
      rating: 5,
      comments: 'QR lab report access and discharge telemetry review were fast and organized.',
      submittedDate: addDaysIso(today, -1),
    },
  ];
}

export function computeDepartmentSatisfaction(
  feedbackList: PatientFeedback[]
): { department: string; avgRating: number; count: number }[] {
  const map = new Map<string, { total: number; count: number }>();
  feedbackList.forEach((f) => {
    const prev = map.get(f.department) ?? { total: 0, count: 0 };
    prev.total += f.rating;
    prev.count += 1;
    map.set(f.department, prev);
  });
  return Array.from(map.entries())
    .map(([department, v]) => ({
      department,
      avgRating: Math.round((v.total / v.count) * 10) / 10,
      count: v.count,
    }))
    .sort((a, b) => b.avgRating - a.avgRating);
}

