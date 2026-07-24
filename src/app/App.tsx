import { useState } from 'react';
import { toast } from 'sonner';
import { LandingPage } from './components/LandingPage';
import { CategorySelect } from './components/CategorySelect';
import { ComplaintForm } from './components/ComplaintForm';
import { ConfirmationScreen } from './components/ConfirmationScreen';
import { TrackComplaint } from './components/TrackComplaint';
import { ComplaintStatus as ComplaintStatusPage } from './components/ComplaintStatus';
import { AdminLogin } from './components/AdminLogin';
import { AdminDashboard } from './components/AdminDashboard';
import { ComplaintDetail } from './components/ComplaintDetail';
import { SuperAdminDashboard } from './components/SuperAdminDashboard';
import { ManageAdmins } from './components/ManageAdmins';
import { Toaster } from './components/ui/sonner';
import { api, authStore } from './lib/api';
import type { Admin, Category, Complaint, ComplaintFormPayload } from './types';

type View =
  | 'landing'
  | 'category-select'
  | 'complaint-form'
  | 'confirmation'
  | 'track'
  | 'complaint-status'
  | 'admin-login'
  | 'admin-dashboard'
  | 'complaint-detail'
  | 'super-dashboard'
  | 'manage-admins';

export default function App() {
  const [view, setView] = useState<View>('landing');
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [currentAdmin, setCurrentAdmin] = useState<Admin | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [newComplaint, setNewComplaint] = useState<Complaint | null>(null);
  const [trackedComplaint, setTrackedComplaint] = useState<Complaint | null>(null);
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);

  const showRequestError = (error: unknown, fallback: string) => {
    const message = error instanceof Error ? error.message : fallback;
    toast.error(message || fallback);
  };

  const refreshComplaints = async () => {
    const result = await api.listComplaints();
    setComplaints(result.complaints);
    return result.complaints;
  };

  const refreshAdmins = async () => {
    if (currentAdmin?.role !== 'super') return [];
    const result = await api.listAdmins();
    setAdmins(result.admins);
    return result.admins;
  };

  const handleSubmitComplaint = async (data: ComplaintFormPayload) => {
    try {
      const result = await api.submitComplaint(data);
      setNewComplaint(result.complaint);
      setView('confirmation');
      toast.success('Complaint submitted successfully');
    } catch (error) {
      showRequestError(error, 'Unable to submit complaint');
      throw error;
    }
  };

  const handleTrackComplaint = async (code: string): Promise<boolean> => {
    try {
      const result = await api.trackComplaint(code.trim().toUpperCase());
      setTrackedComplaint(result.complaint);
      setView('complaint-status');
      toast.success('Complaint found');
      return true;
    } catch (error) {
      showRequestError(error, 'Complaint not found');
      return false;
    }
  };

  const handleAdminLogin = async (username: string, password: string): Promise<boolean> => {
    try {
      const result = await api.login(username, password);
      setCurrentAdmin(result.admin);
      const loadedComplaints = await refreshComplaints();
      if (result.admin.role === 'super') {
        const adminResult = await api.listAdmins();
        setAdmins(adminResult.admins);
      }
      setComplaints(loadedComplaints);
      setView(result.admin.role === 'super' ? 'super-dashboard' : 'admin-dashboard');
      toast.success(`Welcome back, ${result.admin.name}`);
      return true;
    } catch (error) {
      showRequestError(error, 'Invalid username or password');
      return false;
    }
  };

  const handleAdminLogout = () => {
    authStore.clear();
    setCurrentAdmin(null);
    setComplaints([]);
    setAdmins([]);
    setView('landing');
    toast.success('Signed out');
  };

  const handleUpdateComplaint = async (updated: Complaint) => {
    if (!selectedComplaint) return;

    try {
      const result = await api.updateComplaint(selectedComplaint.id, {
        status: updated.status,
        adminResponse: updated.adminResponse,
        internalNotes: updated.internalNotes,
        category: updated.category,
      });

      setComplaints(prev => prev.map(c => c.id === result.complaint.id ? result.complaint : c));
      setSelectedComplaint(result.complaint);
      if (trackedComplaint?.id === result.complaint.id) setTrackedComplaint(result.complaint);
      toast.success('Complaint updated');
    } catch (error) {
      showRequestError(error, 'Unable to update complaint');
      throw error;
    }
  };

  const handleUpdateAdmins = async (updatedAdmins: Admin[]) => {
    const changed = updatedAdmins.find(next => {
      const previous = admins.find(admin => admin.id === next.id);
      return previous && previous.isActive !== next.isActive;
    });

    if (!changed) return;

    try {
      await api.updateAdmin(changed.id, { isActive: changed.isActive });
      await refreshAdmins();
      toast.success(changed.isActive ? 'Admin reactivated' : 'Admin deactivated');
    } catch (error) {
      showRequestError(error, 'Unable to update admin');
      throw error;
    }
  };

  const openAdminDashboard = async () => {
    await refreshComplaints();
    setView('admin-dashboard');
  };

  const goBack = async () => {
    await refreshComplaints();
    if (currentAdmin?.role === 'super') setView('super-dashboard');
    else setView('admin-dashboard');
  };

  const renderView = () => {
    switch (view) {
      case 'landing':
        return (
          <LandingPage
            onDropComplaint={() => setView('category-select')}
            onTrackComplaint={() => setView('track')}
            onAdminLogin={() => setView('admin-login')}
          />
        );
      case 'category-select':
        return (
          <CategorySelect
            onSelect={cat => { setSelectedCategory(cat); setView('complaint-form'); }}
            onBack={() => setView('landing')}
          />
        );
      case 'complaint-form':
        return (
          <ComplaintForm
            category={selectedCategory!}
            onSubmit={handleSubmitComplaint}
            onBack={() => setView('category-select')}
          />
        );
      case 'confirmation':
        return (
          <ConfirmationScreen
            complaint={newComplaint!}
            onDone={() => setView('landing')}
            onTrack={() => { setTrackedComplaint(newComplaint); setView('complaint-status'); }}
          />
        );
      case 'track':
        return <TrackComplaint onTrack={handleTrackComplaint} onBack={() => setView('landing')} />;
      case 'complaint-status':
        return <ComplaintStatusPage complaint={trackedComplaint!} onBack={() => setView('track')} />;
      case 'admin-login':
        return <AdminLogin onLogin={handleAdminLogin} onBack={() => setView('landing')} />;
      case 'admin-dashboard':
        return (
          <AdminDashboard
            admin={currentAdmin!}
            complaints={complaints}
            onSelectComplaint={c => { setSelectedComplaint(c); setView('complaint-detail'); }}
            onLogout={handleAdminLogout}
            onSuperDashboard={currentAdmin?.role === 'super' ? () => setView('super-dashboard') : undefined}
          />
        );
      case 'complaint-detail':
        return (
          <ComplaintDetail
            complaint={selectedComplaint!}
            admin={currentAdmin!}
            onUpdate={handleUpdateComplaint}
            onBack={goBack}
          />
        );
      case 'super-dashboard':
        return (
          <SuperAdminDashboard
            admin={currentAdmin!}
            complaints={complaints}
            admins={admins}
            onSelectComplaint={c => { setSelectedComplaint(c); setView('complaint-detail'); }}
            onManageAdmins={() => setView('manage-admins')}
            onLogout={handleAdminLogout}
            onViewAll={openAdminDashboard}
          />
        );
      case 'manage-admins':
        return <ManageAdmins admins={admins} onUpdate={handleUpdateAdmins} onBack={() => setView('super-dashboard')} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F8FA]">
      {renderView()}
      <Toaster richColors position="top-right" />
    </div>
  );
}
