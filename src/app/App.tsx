import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { LandingPage } from './components/LandingPage';
import { CategorySelect } from './components/CategorySelect';
import { ComplaintForm } from './components/ComplaintForm';
import { ConfirmationScreen } from './components/ConfirmationScreen';
import { TrackComplaint } from './components/TrackComplaint';
import { ComplaintStatus as ComplaintStatusPage } from './components/ComplaintStatus';
import { AdminLogin } from './components/AdminLogin';
import { AdminDashboard, ComplaintDetail } from './components/admin';
import { SuperAdminDashboard, ManageAdmins, AuditLogs } from './components/superadmin';
import { Toaster } from './components/ui/sonner';
import { api, authStore } from './lib/api';
import type { Admin, Category, Complaint, ComplaintAnalytics, ComplaintFormPayload, CreateAdminPayload, ComplaintListMeta, ComplaintListQuery } from './types';

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
  | 'manage-admins'
  | 'audit-logs';

export default function App() {
  const [view, setView] = useState<View>('landing');
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [complaintQuery, setComplaintQuery] = useState<ComplaintListQuery>({ page: 1, limit: 10 });
  const [complaintMeta, setComplaintMeta] = useState<ComplaintListMeta>({
    pagination: { page: 1, limit: 10, total: 0, totalPages: 1 },
    counts: { all: 0, pending: 0, under_review: 0, resolved: 0, closed: 0 },
  });
  const [analytics, setAnalytics] = useState<ComplaintAnalytics | null>(null);
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [currentAdmin, setCurrentAdmin] = useState<Admin | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [newComplaint, setNewComplaint] = useState<Complaint | null>(null);
  const [trackedComplaint, setTrackedComplaint] = useState<Complaint | null>(null);
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [restoringSession, setRestoringSession] = useState(true);

  const showRequestError = (error: unknown, fallback: string) => {
    const message = error instanceof Error && error.message !== 'Failed to fetch'
      ? error.message
      : 'Unable to reach the server. Please try again.';
    toast.error(message || fallback);
  };

  const refreshComplaints = async (query: ComplaintListQuery = complaintQuery) => {
    const result = await api.listComplaints({ page: 1, limit: 10, ...query });
    setComplaints(result.complaints);
    setComplaintQuery(query);
    setComplaintMeta({ pagination: result.pagination, counts: result.counts });
    return result.complaints;
  };

  const handleComplaintQueryChange = async (query: ComplaintListQuery) => {
    try {
      await refreshComplaints({ page: 1, limit: 10, ...query });
    } catch (error) {
      showRequestError(error, 'Unable to load complaints');
    }
  };

  const refreshAdmins = async () => {
    if (currentAdmin?.role !== 'super') return [];
    const result = await api.listAdmins();
    setAdmins(result.admins);
    return result.admins;
  };

  useEffect(() => {
    let isMounted = true;

    const restoreSession = async () => {
      if (!authStore.hasToken()) {
        if (isMounted) setRestoringSession(false);
        return;
      }

      try {
        const { admin } = await api.me();
        const complaintResult = await api.listComplaints({ page: 1, limit: 10 });
        const adminResult = admin.role === 'super' ? await api.listAdmins() : null;
        const analyticsResult = admin.role === 'super' ? await api.getAnalytics() : null;

        if (!isMounted) return;
        setCurrentAdmin(admin);
        setComplaints(complaintResult.complaints);
        setComplaintMeta({ pagination: complaintResult.pagination, counts: complaintResult.counts });
        if (adminResult) setAdmins(adminResult.admins);
        if (analyticsResult) setAnalytics(analyticsResult);
        setView(admin.role === 'super' ? 'super-dashboard' : 'admin-dashboard');
      } catch {
        authStore.clear();
      } finally {
        if (isMounted) setRestoringSession(false);
      }
    };

    void restoreSession();
    return () => { isMounted = false; };
  }, []);

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

  const handleFollowUp = async (message: string) => {
    if (!trackedComplaint?.trackingToken) return;
    try {
      const result = await api.addFollowUpMessage(trackedComplaint.trackingToken, message);
      setTrackedComplaint(result.complaint);
      toast.success('Follow-up submitted. The complaint is under review again.');
    } catch (error) {
      showRequestError(error, 'Unable to submit follow-up');
      throw error;
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
        setAnalytics(await api.getAnalytics());
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
      const payload: Parameters<typeof api.updateComplaint>[1] = {
        status: updated.status,
        adminResponse: updated.adminResponse,
        internalNotes: updated.internalNotes,
      };

      if (currentAdmin?.role === 'super') {
        payload.category = updated.category;
      }

      const result = await api.updateComplaint(selectedComplaint.id, payload);

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

  const handleCreateAdmin = async (data: CreateAdminPayload) => {
    try {
      const result = await api.createAdmin(data);
      setAdmins(previous => [...previous, result.admin].sort((a, b) => a.name.localeCompare(b.name)));
      toast.success('Admin account created');
      return result.admin;
    } catch (error) {
      showRequestError(error, 'Unable to create admin account');
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
        return <ComplaintStatusPage complaint={trackedComplaint!} onBack={() => setView('track')} onFollowUp={handleFollowUp} />;
      case 'admin-login':
        return <AdminLogin onLogin={handleAdminLogin} onBack={() => setView('landing')} />;
      case 'admin-dashboard':
        return (
          <AdminDashboard
            admin={currentAdmin!}
            complaints={complaints}
            meta={complaintMeta}
            query={complaintQuery}
            onQueryChange={handleComplaintQueryChange}
            onSelectComplaint={c => { setSelectedComplaint(c); setView('complaint-detail'); }}
            onLogout={handleAdminLogout}
            onSuperDashboard={currentAdmin?.role === 'super' ? () => setView('super-dashboard') : undefined}
            onManageAdmins={currentAdmin?.role === 'super' ? () => setView('manage-admins') : undefined}
            onAuditLogs={currentAdmin?.role === 'super' ? () => setView('audit-logs') : undefined}
          />
        );
      case 'complaint-detail':
        return (
          <ComplaintDetail
            complaint={selectedComplaint!}
            admin={currentAdmin!}
            onUpdate={handleUpdateComplaint}
            onBack={goBack}
            onLogout={handleAdminLogout}
            onOverview={currentAdmin?.role === 'super' ? () => setView('super-dashboard') : undefined}
            onManageAdmins={currentAdmin?.role === 'super' ? () => setView('manage-admins') : undefined}
            onAuditLogs={currentAdmin?.role === 'super' ? () => setView('audit-logs') : undefined}
          />
        );
      case 'super-dashboard':
        return (
          <SuperAdminDashboard
            admin={currentAdmin!}
            complaints={complaints}
            analytics={analytics}
            admins={admins}
            onSelectComplaint={c => { setSelectedComplaint(c); setView('complaint-detail'); }}
            onManageAdmins={() => setView('manage-admins')}
            onLogout={handleAdminLogout}
            onViewAll={openAdminDashboard}
            onViewAuditLogs={() => setView('audit-logs')}
          />
        );
      case 'manage-admins':
        return <ManageAdmins admin={currentAdmin!} admins={admins} onUpdate={handleUpdateAdmins} onCreate={handleCreateAdmin} onBack={() => setView('super-dashboard')} onLogout={handleAdminLogout} onViewAll={openAdminDashboard} onAuditLogs={() => setView('audit-logs')} />;
      case 'audit-logs':
        return <AuditLogs admin={currentAdmin!} onBack={() => setView('super-dashboard')} onLogout={handleAdminLogout} onViewAll={openAdminDashboard} onManageAdmins={() => setView('manage-admins')} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F8FA]">
      {restoringSession ? (
        <div className="min-h-screen flex items-center justify-center text-[#2B3A67] text-sm font-medium">Restoring your session...</div>
      ) : renderView()}
      <Toaster richColors position="top-right" />
    </div>
  );
}
