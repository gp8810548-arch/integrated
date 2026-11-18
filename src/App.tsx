import React, { useState } from 'react';
import { AnimatePresence, MotionConfig } from 'motion/react';
import { HospitalProvider, useHospital } from './context/HospitalContext';
import { Sidebar } from './components/Sidebar';
import { Navbar } from './components/Navbar';
import { ToastContainer } from './components/Notification';
import { QrScannerModal } from './components/QrScannerModal';
import { PageTransition } from './components/MotionPrimitives';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { CommandCentre } from './pages/CommandCentre';
import { Patients } from './pages/Patients';
import { Emr } from './pages/Emr';
import { Emergency } from './pages/Emergency';
import { Doctors } from './pages/Doctors';
import { Appointments } from './pages/Appointments';
import { QueueManagement } from './pages/QueueManagement';
import { Beds } from './pages/Beds';
import { Discharge } from './pages/Discharge';
import { BloodBank } from './pages/BloodBank';
import { Insurance } from './pages/Insurance';
import { Billing } from './pages/Billing';
import { Pharmacy } from './pages/Pharmacy';
import { Laboratory } from './pages/Laboratory';
import { Staff } from './pages/Staff';
import { AmbulancePage } from './pages/Ambulance';
import { Feedback } from './pages/Feedback';
import { AuditLogs } from './pages/AuditLogs';
import { Reports } from './pages/Reports';
import { NotificationsPage } from './pages/NotificationsPage';
import { Settings } from './pages/Settings';

const AppWorkspace: React.FC = () => {
  const { session, activePage } = useHospital();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (!session) {
    return (
      <>
        <Login />
        <ToastContainer />
      </>
    );
  }

  const renderPage = () => {
    switch (activePage) {
      case 'dashboard':
        return <Dashboard />;
      case 'command-centre':
        return <CommandCentre />;
      case 'patients':
        return <Patients />;
      case 'emr':
        return <Emr />;
      case 'emergency':
        return <Emergency />;
      case 'doctors':
        return <Doctors />;
      case 'appointments':
        return <Appointments />;
      case 'queue':
        return <QueueManagement />;
      case 'beds':
        return <Beds />;
      case 'discharge':
        return <Discharge />;
      case 'blood-bank':
        return <BloodBank />;
      case 'insurance':
        return <Insurance />;
      case 'billing':
        return <Billing />;
      case 'pharmacy':
        return <Pharmacy />;
      case 'laboratory':
        return <Laboratory />;
      case 'staff':
        return <Staff />;
      case 'ambulance':
        return <AmbulancePage />;
      case 'feedback':
        return <Feedback />;
      case 'audit-logs':
        return <AuditLogs />;
      case 'reports':
        return <Reports />;
      case 'notifications':
        return <NotificationsPage />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen flex bg-transparent text-[#18363a] dark:text-slate-100 transition-colors duration-200">
      <Sidebar mobileOpen={mobileMenuOpen} onCloseMobile={() => setMobileMenuOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0">
        <Navbar onOpenMobileMenu={() => setMobileMenuOpen(true)} />
        <main className="print-app-shell flex-1 p-4 sm:p-6 xl:p-8 max-w-[1800px] w-full mx-auto">
          <AnimatePresence mode="wait">
            <PageTransition pageKey={activePage}>{renderPage()}</PageTransition>
          </AnimatePresence>
        </main>
      </div>

      <QrScannerModal />
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <HospitalProvider>
        <AppWorkspace />
      </HospitalProvider>
    </MotionConfig>
  );
}
