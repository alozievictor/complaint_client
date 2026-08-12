import { useState, type ElementType, type FormEvent } from "react";
import {
  ArrowLeft,
  GraduationCap,
  BookOpen,
  Building2,
  CreditCard,
  Monitor,
  LayoutDashboard,
  Power,
  Mail,
  CheckCircle2,
  XCircle,
  Users,
  UserPlus,
  KeyRound,
  Copy,
  Check,
  MessageSquare,
  X,
} from "lucide-react";
import type { Admin, AdminRole, CreateAdminPayload } from "../../types";
import { DashboardLayout } from "../layout/DashboardLayout";

const ROLE_CONFIG: Record<
  AdminRole,
  { label: string; icon: ElementType; color: string; bg: string }
> = {
  academic: {
    label: "Academic Admin",
    icon: BookOpen,
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  finance: {
    label: "Finance Admin",
    icon: CreditCard,
    color: "text-yellow-600",
    bg: "bg-yellow-50",
  },
  hostel: {
    label: "Hostel Admin",
    icon: Building2,
    color: "text-green-600",
    bg: "bg-green-50",
  },
  ict: {
    label: "ICT Admin",
    icon: Monitor,
    color: "text-purple-600",
    bg: "bg-purple-50",
  },
  general: {
    label: "General Complaints Admin",
    icon: MessageSquare,
    color: "text-slate-600",
    bg: "bg-slate-100",
  },
  super: {
    label: "Super Admin",
    icon: LayoutDashboard,
    color: "text-red-600",
    bg: "bg-red-50",
  },
};

const ASSIGNABLE_ROLES: CreateAdminPayload["role"][] = [
  "academic",
  "finance",
  "hostel",
  "ict",
  "general",
];

interface Props {
  admin: Admin;
  admins: Admin[];
  onUpdate: (updated: Admin[]) => Promise<void>;
  onCreate: (data: CreateAdminPayload) => Promise<Admin>;
  onBack: () => void;
  onLogout: () => void;
  onViewAll: () => void;
  onAuditLogs: () => void;
}

export function ManageAdmins({
  admin,
  admins,
  onUpdate,
  onCreate,
  onBack,
  onLogout,
  onViewAll,
  onAuditLogs,
}: Props) {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<CreateAdminPayload["role"]>("academic");
  const [creating, setCreating] = useState(false);
  const [formError, setFormError] = useState("");
  const [createdCredentials, setCreatedCredentials] = useState<{
    username: string;
    password: string;
  } | null>(null);
  const [copied, setCopied] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const toggleActive = async (id: string) => {
    await onUpdate(
      admins.map((a) => (a.id === id ? { ...a, isActive: !a.isActive } : a)),
    );
  };

  const createPassword = () => {
    const characters =
      "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%";
    const generated = Array.from(
      { length: 14 },
      () => characters[Math.floor(Math.random() * characters.length)],
    ).join("");
    setPassword(generated);
  };

  const handleCreate = async (event: FormEvent) => {
    event.preventDefault();
    setFormError("");
    setCreatedCredentials(null);

    if (!name.trim() || !username.trim() || !email.trim() || !password) {
      setFormError("Complete all account details before creating the admin.");
      return;
    }
    if (password.length < 8) {
      setFormError("The temporary password must be at least 8 characters.");
      return;
    }

    setCreating(true);
    try {
      const admin = await onCreate({
        name: name.trim(),
        username: username.trim().toLowerCase(),
        email: email.trim().toLowerCase(),
        password,
        role,
      });
      setCreatedCredentials({ username: admin.username, password });
      setName("");
      setUsername("");
      setEmail("");
      setPassword("");
      setRole("academic");
      setShowCreateModal(false);
    } catch (error) {
      setFormError(
        error instanceof Error
          ? error.message
          : "Unable to create the admin account.",
      );
    } finally {
      setCreating(false);
    }
  };

  const copyCredentials = async () => {
    if (!createdCredentials) return;
    await navigator.clipboard.writeText(
      `Lincoln College OCMS login\nUsername: ${createdCredentials.username}\nTemporary password: ${createdCredentials.password}`,
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const activeCount = admins.filter((a) => a.isActive).length;
  const inactiveCount = admins.filter((a) => !a.isActive).length;

  return (
    <DashboardLayout
      admin={admin}
      title="Manage Admins"
      subtitle="Staff access and category assignments"
      active="admins"
      onNavigate={(key) => {
        if (key === "overview") onBack();
        if (key === "complaints") onViewAll();
        if (key === "audit") onAuditLogs();
      }}
      onLogout={onLogout}
    >
      <header className="hidden">
        <button
          onClick={onBack}
          className="p-2 hover:bg-white/10 rounded-lg transition-colors -ml-1"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-[#F2A93B] rounded-full flex items-center justify-center">
            <GraduationCap className="w-4 h-4 text-[#2B3A67]" />
          </div>
          <div>
            <div className="font-semibold text-sm">Lincoln College OCMS</div>
            <div className="text-[11px] text-blue-200">
              Manage Admin Accounts
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 px-6 py-8 max-w-4xl mx-auto w-full">
        <div className="flex items-center justify-between mb-6">
          <div>
            {/* <h2 className="text-xl font-bold text-[#1E2233]">Admin Accounts</h2>
            <p className="text-[#6B7280] text-sm mt-0.5">
              Create and manage staff access by complaint category
            </p> */}
          </div>
          <div className="flex items-center gap-3 text-sm">
            <div className="hidden sm:flex items-center gap-3">
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
            <button
              onClick={() => {
                setFormError("");
                setShowCreateModal(true);
              }}
              className="flex items-center gap-2 bg-[#2B3A67] text-white px-4 py-2.5 rounded-xl font-semibold hover:bg-[#1a2547] transition-colors"
            >
              <UserPlus className="w-4 h-4" /> Create Admin
            </button>
          </div>
        </div>

        {createdCredentials && (
          <div className="bg-[#2E9E6B]/8 border border-[#2E9E6B]/20 rounded-xl p-4 mb-6">
            <p className="font-semibold text-[#1E2233] text-sm">
              Account created. Share these login details securely now.
            </p>
            <p className="font-mono text-sm mt-2">
              Username: {createdCredentials.username}
              <br />
              Temporary password: {createdCredentials.password}
            </p>
            <button
              onClick={copyCredentials}
              className="mt-3 text-sm font-medium text-[#2B3A67] flex items-center gap-1.5"
            >
              {copied ? (
                <Check className="w-4 h-4" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
              {copied ? "Copied" : "Copy login details"}
            </button>
          </div>
        )}

        <div className="bg-[#2B3A67]/5 border border-[#2B3A67]/10 rounded-xl px-4 py-3 mb-6 text-sm text-[#2B3A67] flex items-start gap-2">
          <Users className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <span>
            Deactivating an account immediately revokes its portal access.
            Category admins can only handle complaints assigned to their
            category and cannot manage accounts or change passwords.
          </span>
        </div>

        <div className="space-y-3">
          {admins.map((admin) => {
            const roleConf = ROLE_CONFIG[admin.role];
            const RoleIcon = roleConf.icon;
            const isSuperAdmin = admin.role === "super";
            return (
              <div
                key={admin.id}
                className={`bg-white rounded-2xl border p-5 shadow-sm ${admin.isActive ? "border-gray-100" : "border-red-100 opacity-75"}`}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${roleConf.bg}`}
                  >
                    <RoleIcon className={`w-6 h-6 ${roleConf.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-[#1E2233]">
                        {admin.name}
                      </span>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-medium ${roleConf.bg} ${roleConf.color}`}
                      >
                        {roleConf.label}
                      </span>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-medium ${admin.isActive ? "bg-[#2E9E6B]/10 text-[#2E9E6B]" : "bg-red-50 text-[#D0564A]"}`}
                      >
                        {admin.isActive ? "Active" : "Inactive"}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-sm text-[#6B7280] mt-1">
                      <Mail className="w-3 h-3" />
                      {admin.email}
                    </div>
                    <div className="text-xs text-gray-400 mt-0.5 font-mono">
                      @{admin.username}
                    </div>
                  </div>
                  {isSuperAdmin ? (
                    <div className="text-xs text-[#6B7280] text-right px-2">
                      Cannot
                      <br />
                      deactivate
                    </div>
                  ) : (
                    <button
                      onClick={() => toggleActive(admin.id)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border ${admin.isActive ? "border-red-100 bg-red-50 text-[#D0564A]" : "border-[#2E9E6B]/20 bg-[#2E9E6B]/8 text-[#2E9E6B]"}`}
                    >
                      <Power className="w-3.5 h-3.5" />
                      {admin.isActive ? "Deactivate" : "Reactivate"}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {showCreateModal && (
        <div
          className="fixed inset-0 z-50 bg-[#1E2233]/50 p-4 flex items-center justify-center"
          role="dialog"
          aria-modal="true"
          aria-labelledby="create-admin-title"
        >
          <form
            onSubmit={handleCreate}
            className="w-full max-w-lg bg-white rounded-2xl shadow-2xl p-6 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-start justify-between gap-4 mb-2">
              <div>
                <div className="flex items-center gap-2">
                  <UserPlus className="w-5 h-5 text-[#2B3A67]" />
                  <h3
                    id="create-admin-title"
                    className="font-semibold text-[#1E2233] text-lg"
                  >
                    Create Category Admin
                  </h3>
                </div>
                <p className="text-xs text-[#6B7280] mt-2">
                  Create login details and assign the one complaint category
                  this admin can manage.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="p-1.5 text-gray-400 hover:text-[#1E2233] rounded-lg hover:bg-gray-100"
                aria-label="Close create admin dialog"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-5">
              <div>
                <label className="text-sm font-medium text-[#1E2233] block mb-1.5">
                  Full name
                </label>
                <input
                  autoFocus
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Full name"
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#2B3A67]"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-[#1E2233] block mb-1.5">
                  Work email
                </label>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  placeholder="name@college.edu"
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#2B3A67]"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-[#1E2233] block mb-1.5">
                  Username
                </label>
                <input
                  value={username}
                  onChange={(e) =>
                    setUsername(e.target.value.replace(/\s/g, "").toLowerCase())
                  }
                  placeholder="username"
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#2B3A67]"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-[#1E2233] block mb-1.5">
                  Complaint category
                </label>
                <select
                  value={role}
                  onChange={(e) =>
                    setRole(e.target.value as CreateAdminPayload["role"])
                  }
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:border-[#2B3A67]"
                >
                  {ASSIGNABLE_ROLES.map((value) => (
                    <option key={value} value={value}>
                      {ROLE_CONFIG[value].label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="mt-4">
              <label className="text-sm font-medium text-[#1E2233] block mb-1.5">
                Temporary password
              </label>
              <div className="flex gap-2">
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type="text"
                  placeholder="At least 8 characters"
                  className="flex-1 min-w-0 px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#2B3A67]"
                />
                <button
                  type="button"
                  onClick={createPassword}
                  className="px-3 py-2 border border-[#2B3A67]/20 rounded-xl text-sm text-[#2B3A67] hover:bg-[#2B3A67]/5"
                >
                  <KeyRound className="w-4 h-4 inline mr-1" />
                  Generate
                </button>
              </div>
            </div>
            <p className="text-xs text-[#6B7280] mt-3">
              The password is shown only now. Copy it and share it securely with
              the new admin.
            </p>
            {formError && (
              <p className="text-sm text-[#D0564A] mt-3">{formError}</p>
            )}
            <div className="flex justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-[#6B7280] hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                disabled={creating}
                className="px-5 py-2.5 bg-[#2B3A67] text-white rounded-xl text-sm font-semibold hover:bg-[#1a2547] disabled:opacity-60"
              >
                {creating ? "Creating..." : "Create Admin"}
              </button>
            </div>
          </form>
        </div>
      )}
    </DashboardLayout>
  );
}
