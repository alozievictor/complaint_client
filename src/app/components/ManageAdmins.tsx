import type { ElementType } from 'react';
import { ArrowLeft, GraduationCap, BookOpen, Building2, CreditCard, Monitor, LayoutDashboard, Power, Mail, CheckCircle2, XCircle, Users } from 'lucide-react';
import type { Admin, AdminRole } from '../types';

const ROLE_CONFIG: Record<AdminRole, { label: string; icon: ElementType; color: string; bg: string }> = {
  academic: { label: 'Academic Admin', icon: BookOpen, color: 'text-blue-600', bg: 'bg-blue-50' },
  finance: { label: 'Finance Admin', icon: CreditCard, color: 'text-yellow-600', bg: 'bg-yellow-50' },
  hostel: { label: 'Hostel Admin', icon: Building2, color: 'text-green-600', bg: 'bg-green-50' },
  ict: { label: 'ICT Admin', icon: Monitor, color: 'text-purple-600', bg: 'bg-purple-50' },
  super: { label: 'Super Admin', icon: LayoutDashboard, color: 'text-red-600', bg: 'bg-red-50' },
};

interface Props {
  admins: Admin[];
  onUpdate: (updated: Admin[]) => Promise<void>;
  onBack: () => void;
}

export function ManageAdmins({ admins, onUpdate, onBack }: Props) {
  const toggleActive = async (id: string) => {
    await onUpdate(admins.map(a => a.id === id ? { ...a, isActive: !a.isActive } : a));
  };

  const activeCount = admins.filter(a => a.isActive).length;
  const inactiveCount = admins.filter(a => !a.isActive).length;

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-[#2B3A67] text-white px-6 py-4 flex items-center gap-3 sticky top-0 z-40 shadow-md">
        <button onClick={onBack} className="p-2 hover:bg-white/10 rounded-lg transition-colors -ml-1">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-[#F2A93B] rounded-full flex items-center justify-center">
            <GraduationCap className="w-4 h-4 text-[#2B3A67]" />
          </div>
          <div>
            <div className="font-semibold text-sm">Lincoln College OCMS</div>
            <div className="text-[11px] text-blue-200">Manage Admin Accounts</div>
          </div>
        </div>
      </header>

      <div className="flex-1 px-6 py-8 max-w-3xl mx-auto w-full">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-[#1E2233]">Admin Accounts</h2>
            <p className="text-[#6B7280] text-sm mt-0.5">Manage staff access to the OCMS admin portal</p>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <div className="flex items-center gap-1.5 text-[#2E9E6B]">
              <CheckCircle2 className="w-4 h-4" />
              <span className="font-medium">{activeCount} Active</span>
            </div>
            {inactiveCount > 0 && (
              <div className="flex items-center gap-1.5 text-[#D0564A]">
                <XCircle className="w-4 h-4" />
                <span className="font-medium">{inactiveCount} Inactive</span>
              </div>
            )}
          </div>
        </div>

        <div className="bg-[#2B3A67]/5 border border-[#2B3A67]/10 rounded-xl px-4 py-3 mb-6 text-sm text-[#2B3A67] flex items-start gap-2">
          <Users className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <span>Deactivating an account immediately revokes that admin's access to the portal. They will not be able to log in until reactivated.</span>
        </div>

        <div className="space-y-3">
          {admins.map(admin => {
            const roleConf = ROLE_CONFIG[admin.role];
            const RoleIcon = roleConf.icon;
            const isSuperAdmin = admin.role === 'super';
            return (
              <div
                key={admin.id}
                className={`bg-white rounded-2xl border p-5 shadow-sm transition-all ${
                  admin.isActive ? 'border-gray-100' : 'border-red-100 opacity-75'
                }`}
              >
                <div className="flex items-center gap-4">
                  {/* Role icon */}
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${roleConf.bg}`}>
                    <RoleIcon className={`w-6 h-6 ${roleConf.color}`} />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-[#1E2233]">{admin.name}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${roleConf.bg} ${roleConf.color}`}>
                        {roleConf.label}
                      </span>
                      {admin.isActive ? (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-[#2E9E6B]/10 text-[#2E9E6B] font-medium flex items-center gap-1">
                          <CheckCircle2 className="w-2.5 h-2.5" /> Active
                        </span>
                      ) : (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-red-50 text-[#D0564A] font-medium flex items-center gap-1">
                          <XCircle className="w-2.5 h-2.5" /> Inactive
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 text-sm text-[#6B7280] mt-1">
                      <Mail className="w-3 h-3" />
                      {admin.email}
                    </div>
                    <div className="text-xs text-gray-400 mt-0.5 font-mono">@{admin.username}</div>
                  </div>

                  {/* Toggle */}
                  {isSuperAdmin ? (
                    <div className="text-xs text-[#6B7280] text-right px-2">
                      Cannot<br />deactivate
                    </div>
                  ) : (
                    <button
                      onClick={() => toggleActive(admin.id)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border transition-all ${
                        admin.isActive
                          ? 'border-red-100 bg-red-50 text-[#D0564A] hover:bg-red-100'
                          : 'border-[#2E9E6B]/20 bg-[#2E9E6B]/8 text-[#2E9E6B] hover:bg-[#2E9E6B]/15'
                      }`}
                    >
                      <Power className="w-3.5 h-3.5" />
                      {admin.isActive ? 'Deactivate' : 'Reactivate'}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-8 bg-amber-50 border border-amber-100 rounded-xl p-5">
          <p className="text-sm font-semibold text-amber-800 mb-1">Demo Note</p>
          <p className="text-sm text-amber-700">
            In a production system, this page would also allow creating new admin accounts, resetting passwords, and viewing activity logs. For this prototype, only activate/deactivate is implemented.
          </p>
        </div>
      </div>
    </div>
  );
}
