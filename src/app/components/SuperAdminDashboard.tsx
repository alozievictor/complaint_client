import type { ElementType } from 'react';
import { LogOut, Users, BookOpen, Building2, CreditCard, Monitor, MessageSquare, Clock, Eye, CheckCircle2, LayoutDashboard, ChevronRight, TrendingUp, AlertTriangle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import type { Admin, Complaint } from '../types';

const CATEGORY_LABELS: Record<string, { label: string; icon: ElementType; short: string }> = {
  academic: { label: 'Academic / Lecturer', icon: BookOpen, short: 'Academic' },
  finance: { label: 'Tuition & Fees', icon: CreditCard, short: 'Finance' },
  hostel: { label: 'Hostel & Facilities', icon: Building2, short: 'Hostel' },
  ict: { label: 'ICT / Portal', icon: Monitor, short: 'ICT' },
  general: { label: 'General / Other', icon: MessageSquare, short: 'General' },
};

const PIE_COLORS = ['#8A93A6', '#E9A227', '#2E9E6B'];

interface Props {
  admin: Admin;
  complaints: Complaint[];
  admins: Admin[];
  onSelectComplaint: (c: Complaint) => void;
  onManageAdmins: () => void;
  onLogout: () => void;
  onViewAll: () => void;
}

export function SuperAdminDashboard({ admin, complaints, admins, onSelectComplaint, onManageAdmins, onLogout, onViewAll }: Props) {
  const total = complaints.length;
  const pending = complaints.filter(c => c.status === 'pending').length;
  const underReview = complaints.filter(c => c.status === 'under_review').length;
  const resolved = complaints.filter(c => c.status === 'resolved').length;
  const resolutionRate = total > 0 ? Math.round((resolved / total) * 100) : 0;

  const byCategory = Object.entries(CATEGORY_LABELS).map(([key, { short }]) => ({
    category: short,
    total: complaints.filter(c => c.category === key).length,
    pending: complaints.filter(c => c.category === key && c.status === 'pending').length,
    resolved: complaints.filter(c => c.category === key && c.status === 'resolved').length,
  }));

  const statusData = [
    { name: 'Pending', value: pending },
    { name: 'Under Review', value: underReview },
    { name: 'Resolved', value: resolved },
  ];

  const recentComplaints = [...complaints].sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()).slice(0, 5);

  const formatDate = (d: Date | string) =>
    new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F8FA]">
      {/* Header */}
      <header className="bg-[#2B3A67] text-white px-6 py-4 sticky top-0 z-40 shadow-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-[#F2A93B] rounded-full flex items-center justify-center">
              <LayoutDashboard className="w-5 h-5 text-[#2B3A67]" />
            </div>
            <div>
              <div className="font-bold text-sm">Lincoln College OCMS</div>
              <div className="text-[11px] text-blue-200">Super Admin Overview — {admin.name}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onManageAdmins}
              className="flex items-center gap-1.5 text-sm text-blue-200 hover:text-white border border-white/20 px-3 py-1.5 rounded-lg hover:bg-white/10 transition-colors"
            >
              <Users className="w-3.5 h-3.5" /> Manage Admins
            </button>
            <button
              onClick={onViewAll}
              className="flex items-center gap-1.5 text-sm text-blue-200 hover:text-white border border-white/20 px-3 py-1.5 rounded-lg hover:bg-white/10 transition-colors"
            >
              All Complaints
            </button>
            <button
              onClick={onLogout}
              className="flex items-center gap-1.5 text-sm text-blue-200 hover:text-white border border-white/20 px-3 py-1.5 rounded-lg hover:bg-white/10 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" /> Sign Out
            </button>
          </div>
        </div>
      </header>

      <div className="flex-1 px-6 py-8 max-w-7xl mx-auto w-full">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-[#1E2233]">System Overview</h2>
          <p className="text-[#6B7280] text-sm">All complaints across all departments — real-time analytics</p>
        </div>

        {/* KPI cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Total Complaints', value: total, icon: LayoutDashboard, color: 'text-[#2B3A67]', bg: 'bg-[#2B3A67]/8', border: 'border-[#2B3A67]/15' },
            { label: 'Pending', value: pending, icon: Clock, color: 'text-[#8A93A6]', bg: 'bg-[#8A93A6]/8', border: 'border-[#8A93A6]/15' },
            { label: 'Under Review', value: underReview, icon: Eye, color: 'text-[#E9A227]', bg: 'bg-[#E9A227]/8', border: 'border-[#E9A227]/15' },
            { label: 'Resolved', value: resolved, icon: CheckCircle2, color: 'text-[#2E9E6B]', bg: 'bg-[#2E9E6B]/8', border: 'border-[#2E9E6B]/15' },
          ].map(({ label, value, icon: Icon, color, bg, border }) => (
            <div key={label} className={`bg-white rounded-2xl p-5 border ${border} shadow-sm`}>
              <div className={`w-10 h-10 ${bg} rounded-xl flex items-center justify-center mb-3`}>
                <Icon className={`w-5 h-5 ${color}`} />
              </div>
              <div className={`text-3xl font-bold ${color} mb-0.5`}>{value}</div>
              <div className="text-xs text-[#6B7280]">{label}</div>
            </div>
          ))}
        </div>

        {/* Resolution rate + charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-6">
          {/* Resolution rate */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp className="w-4 h-4 text-[#2E9E6B]" />
                <span className="font-semibold text-[#1E2233] text-sm">Resolution Rate</span>
              </div>
              <p className="text-xs text-[#6B7280] mb-4">Percentage of complaints marked as resolved</p>
            </div>
            <div>
              <div className="text-5xl font-bold text-[#2E9E6B] mb-3">{resolutionRate}%</div>
              <div className="w-full bg-gray-100 rounded-full h-3 mb-2">
                <div
                  className="bg-[#2E9E6B] h-3 rounded-full transition-all"
                  style={{ width: `${resolutionRate}%` }}
                />
              </div>
              <p className="text-xs text-[#6B7280]">{resolved} of {total} complaints resolved</p>
            </div>
            {pending > 3 && (
              <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-100 rounded-lg px-3 py-2 mt-3 text-xs text-amber-700">
                <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />
                {pending} complaints awaiting attention
              </div>
            )}
          </div>

          {/* Status pie chart */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <div className="font-semibold text-[#1E2233] text-sm mb-4">Status Distribution</div>
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={75}
                  dataKey="value"
                  paddingAngle={2}
                >
                  {statusData.map((_, index) => (
                    <Cell key={index} fill={PIE_COLORS[index]} />
                  ))}
                </Pie>
                <Tooltip formatter={(v) => [v, 'Complaints']} />
                <Legend iconType="circle" iconSize={8} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Category bar chart */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <div className="font-semibold text-[#1E2233] text-sm mb-4">Complaints by Category</div>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={byCategory} margin={{ top: 0, right: 0, bottom: 0, left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="category" tick={{ fontSize: 10, fill: '#6B7280' }} />
                <YAxis tick={{ fontSize: 10, fill: '#6B7280' }} allowDecimals={false} />
                <Tooltip cursor={{ fill: '#f7f8fa' }} />
                <Bar dataKey="total" fill="#2B3A67" radius={[4, 4, 0, 0]} name="Total" />
                <Bar dataKey="resolved" fill="#2E9E6B" radius={[4, 4, 0, 0]} name="Resolved" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category breakdown */}
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 mb-6">
          {Object.entries(CATEGORY_LABELS).map(([key, { short, icon: Icon }]) => {
            const catComplaints = complaints.filter(c => c.category === key);
            const catResolved = catComplaints.filter(c => c.status === 'resolved').length;
            const catPending = catComplaints.filter(c => c.status === 'pending').length;
            return (
              <div key={key} className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-7 h-7 bg-[#2B3A67]/8 rounded-lg flex items-center justify-center">
                    <Icon className="w-3.5 h-3.5 text-[#2B3A67]" />
                  </div>
                  <span className="text-xs font-semibold text-[#1E2233]">{short}</span>
                </div>
                <div className="text-xl font-bold text-[#1E2233] mb-1">{catComplaints.length}</div>
                <div className="text-xs text-[#6B7280] space-y-0.5">
                  <div className="flex justify-between">
                    <span>Pending</span>
                    <span className="text-[#8A93A6] font-medium">{catPending}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Resolved</span>
                    <span className="text-[#2E9E6B] font-medium">{catResolved}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Recent complaints */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-6">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <div className="font-semibold text-[#1E2233]">Recent Complaints</div>
            <button onClick={onViewAll} className="text-sm text-[#4A5C99] hover:text-[#2B3A67] flex items-center gap-1 font-medium">
              View All <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="divide-y divide-gray-50">
            {recentComplaints.map(complaint => {
              const displayName = complaint.isAnonymous ? complaint.anonymousLabel : complaint.realName;
              const StatusIcon = complaint.status === 'pending' ? Clock : complaint.status === 'under_review' ? Eye : CheckCircle2;
              const statusColor = complaint.status === 'pending' ? 'text-[#8A93A6]' : complaint.status === 'under_review' ? 'text-[#E9A227]' : 'text-[#2E9E6B]';
              const statusBg = complaint.status === 'pending' ? 'bg-[#8A93A6]/10' : complaint.status === 'under_review' ? 'bg-[#E9A227]/10' : 'bg-[#2E9E6B]/10';
              const statusLabel = complaint.status === 'pending' ? 'Pending' : complaint.status === 'under_review' ? 'Under Review' : 'Resolved';
              const CatIcon = CATEGORY_LABELS[complaint.category].icon;
              return (
                <div
                  key={complaint.id}
                  className="flex items-center gap-4 px-6 py-4 hover:bg-[#F7F8FA]/70 cursor-pointer group transition-colors"
                  onClick={() => onSelectComplaint(complaint)}
                >
                  <span className="font-mono text-sm text-[#2B3A67] font-semibold w-28 flex-shrink-0">{complaint.referenceCode}</span>
                  <div className="flex items-center gap-1.5 w-24 flex-shrink-0 text-xs text-[#6B7280]">
                    <CatIcon className="w-3 h-3" />
                    {CATEGORY_LABELS[complaint.category].short}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-[#1E2233] font-medium truncate">{complaint.subject}</p>
                    <p className={`text-xs mt-0.5 ${complaint.isAnonymous ? 'italic text-purple-500' : 'text-[#6B7280]'}`}>{displayName}</p>
                  </div>
                  <div className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${statusBg} ${statusColor} flex-shrink-0`}>
                    <StatusIcon className="w-3 h-3" />
                    {statusLabel}
                  </div>
                  <span className="text-xs text-[#6B7280] flex-shrink-0 hidden sm:block">{formatDate(complaint.submittedAt)}</span>
                  <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-[#2B3A67] transition-colors flex-shrink-0" />
                </div>
              );
            })}
          </div>
        </div>

        {/* Admin accounts summary */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <div className="font-semibold text-[#1E2233]">Admin Accounts</div>
            <button onClick={onManageAdmins} className="text-sm text-[#4A5C99] hover:text-[#2B3A67] flex items-center gap-1 font-medium">
              Manage <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="px-6 py-4 grid grid-cols-2 sm:grid-cols-5 gap-3">
            {admins.filter(a => a.role !== 'super').map(a => {
              const { icon: Icon } = CATEGORY_LABELS[a.role] ?? { icon: Users };
              return (
                <div key={a.id} className={`flex items-center gap-2 p-3 rounded-xl border ${a.isActive ? 'border-gray-100 bg-[#F7F8FA]' : 'border-red-100 bg-red-50/50'}`}>
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${a.isActive ? 'bg-[#2B3A67]/8' : 'bg-red-100'}`}>
                    <Icon className={`w-4 h-4 ${a.isActive ? 'text-[#2B3A67]' : 'text-red-400'}`} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-[#1E2233] truncate">{a.name}</p>
                    <p className={`text-xs ${a.isActive ? 'text-[#2E9E6B]' : 'text-red-400'}`}>{a.isActive ? 'Active' : 'Inactive'}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
