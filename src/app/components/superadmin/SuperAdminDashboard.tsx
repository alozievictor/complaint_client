import type { ElementType } from "react";
import {
  LogOut,
  Users,
  BookOpen,
  Building2,
  CreditCard,
  Monitor,
  MessageSquare,
  Clock,
  Eye,
  CheckCircle2,
  LayoutDashboard,
  ChevronRight,
  Lock,
} from "lucide-react";
import type { Admin, Complaint, ComplaintAnalytics } from "../../types";
import { DashboardLayout } from "../layout/DashboardLayout";

const CATEGORY_LABELS: Record<
  string,
  { label: string; icon: ElementType; short: string }
> = {
  academic: { label: "Academic / Lecturer", icon: BookOpen, short: "Academic" },
  finance: { label: "Tuition & Fees", icon: CreditCard, short: "Finance" },
  hostel: { label: "Hostel & Facilities", icon: Building2, short: "Hostel" },
  ict: { label: "ICT / Portal", icon: Monitor, short: "ICT" },
  general: { label: "General / Other", icon: MessageSquare, short: "General" },
};

interface Props {
  admin: Admin;
  complaints: Complaint[];
  analytics: ComplaintAnalytics | null;
  admins: Admin[];
  onSelectComplaint: (c: Complaint) => void;
  onManageAdmins: () => void;
  onLogout: () => void;
  onViewAll: () => void;
  onViewAuditLogs: () => void;
}

export function SuperAdminDashboard({
  admin,
  complaints,
  analytics,
  admins,
  onSelectComplaint,
  onManageAdmins,
  onLogout,
  onViewAll,
  onViewAuditLogs,
}: Props) {
  const total = analytics?.total ?? complaints.length;
  const pending =
    analytics?.byStatus.pending ??
    complaints.filter((c) => c.status === "pending").length;
  const underReview =
    analytics?.byStatus.under_review ??
    complaints.filter((c) => c.status === "under_review").length;
  const resolved =
    (analytics?.byStatus.resolved ??
      complaints.filter((c) => c.status === "resolved").length) +
    (analytics?.byStatus.closed ??
      complaints.filter((c) => c.status === "closed").length);
  const recentComplaints = [...complaints]
    .sort(
      (a, b) =>
        new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime(),
    )
    .slice(0, 5);

  const formatDate = (d: Date | string) =>
    new Date(d).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  return (
    <DashboardLayout
      admin={admin}
      title="System Overview"
      subtitle="Complaint performance across all departments"
      active="overview"
      onNavigate={(key) => {
        if (key === "complaints") onViewAll();
        if (key === "admins") onManageAdmins();
        if (key === "audit") onViewAuditLogs();
      }}
      onLogout={onLogout}
    >
      {/* Header */}
      <header className="hidden">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-[#F2A93B] rounded-full flex items-center justify-center">
              <LayoutDashboard className="w-5 h-5 text-[#2B3A67]" />
            </div>
            <div>
              <div className="font-bold text-sm">Lincoln College OCMS</div>
              <div className="text-[11px] text-blue-200">
                Super Admin Overview — {admin.name}
              </div>
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
              onClick={onViewAuditLogs}
              className="flex items-center gap-1.5 text-sm text-blue-200 hover:text-white border border-white/20 px-3 py-1.5 rounded-lg hover:bg-white/10 transition-colors"
            >
              Audit Logs
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
        {/* <div className="mb-6">
          <h2 className="text-xl font-bold text-[#1E2233]">System Overview</h2>
          <p className="text-[#6B7280] text-sm">
            All complaints across all departments — real-time analytics
          </p>
        </div> */}

        {/* KPI cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          {[
            {
              label: "Total Complaints",
              value: total,
              icon: LayoutDashboard,
              color: "text-[#2B3A67]",
              bg: "bg-[#2B3A67]/8",
              border: "border-[#2B3A67]/15",
            },
            {
              label: "Pending",
              value: pending,
              icon: Clock,
              color: "text-[#8A93A6]",
              bg: "bg-[#8A93A6]/8",
              border: "border-[#8A93A6]/15",
            },
            {
              label: "Under Review",
              value: underReview,
              icon: Eye,
              color: "text-[#E9A227]",
              bg: "bg-[#E9A227]/8",
              border: "border-[#E9A227]/15",
            },
            {
              label: "Resolved",
              value: resolved,
              icon: CheckCircle2,
              color: "text-[#2E9E6B]",
              bg: "bg-[#2E9E6B]/8",
              border: "border-[#2E9E6B]/15",
            },
          ].map(({ label, value, icon: Icon, color, bg, border }) => (
            <div
              key={label}
              className={`bg-white rounded-2xl p-5 border ${border} shadow-sm`}
            >
              <div
                className={`w-10 h-10 ${bg} rounded-xl flex items-center justify-center mb-3`}
              >
                <Icon className={`w-5 h-5 ${color}`} />
              </div>
              <div className={`text-3xl font-bold ${color} mb-0.5`}>
                {value}
              </div>
              <div className="text-xs text-[#6B7280]">{label}</div>
            </div>
          ))}
        </div>

        {/* Resolution rate + charts */}
        {analytics?.sla && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
            {[
              ["Overdue response", analytics.sla.overdueFirstResponse],
              ["Overdue resolution", analytics.sla.overdueResolution],
              ["Near deadline", analytics.sla.nearingDeadline],
              ["Avg resolution", `${analytics.sla.averageResolutionDays} days`],
            ].map(([label, value]) => (
              <div
                key={String(label)}
                className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm"
              >
                <p className="text-xs text-[#6B7280]">{label}</p>
                <p className="text-xl font-bold text-[#1E2233] mt-1">{value}</p>
              </div>
            ))}
          </div>
        )}

        {/* Category breakdown */}
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 mb-6">
          {Object.entries(CATEGORY_LABELS).map(
            ([key, { short, icon: Icon }]) => {
              const catComplaints = complaints.filter(
                (c) => c.category === key,
              );
              const catTotal =
                analytics?.byCategory[
                  key as keyof typeof analytics.byCategory
                ] ?? catComplaints.length;
              const catResolved =
                analytics?.byCategoryStatus[
                  key as keyof typeof analytics.byCategoryStatus
                ].resolved ??
                catComplaints.filter((c) => c.status === "resolved").length;
              const catPending =
                analytics?.byCategoryStatus[
                  key as keyof typeof analytics.byCategoryStatus
                ].pending ??
                catComplaints.filter((c) => c.status === "pending").length;
              return (
                <div
                  key={key}
                  className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-7 h-7 bg-[#2B3A67]/8 rounded-lg flex items-center justify-center">
                      <Icon className="w-3.5 h-3.5 text-[#2B3A67]" />
                    </div>
                    <span className="text-xs font-semibold text-[#1E2233]">
                      {short}
                    </span>
                  </div>
                  <div className="text-xl font-bold text-[#1E2233] mb-1">
                    {catTotal}
                  </div>
                  <div className="text-xs text-[#6B7280] space-y-0.5">
                    <div className="flex justify-between">
                      <span>Pending</span>
                      <span className="text-[#8A93A6] font-medium">
                        {catPending}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Resolved</span>
                      <span className="text-[#2E9E6B] font-medium">
                        {catResolved}
                      </span>
                    </div>
                  </div>
                </div>
              );
            },
          )}
        </div>

        {/* Recent complaints */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-6">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <div className="font-semibold text-[#1E2233]">
              Recent Complaints
            </div>
            <button
              onClick={onViewAll}
              className="text-sm text-[#4A5C99] hover:text-[#2B3A67] flex items-center gap-1 font-medium"
            >
              View All <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[680px]">
              <thead>
                <tr className="bg-[#F7F8FA] border-b border-gray-100">
                  <th className="px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-[#6B7280]">
                    Reference
                  </th>
                  <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-[#6B7280]">
                    Category
                  </th>
                  <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-[#6B7280]">
                    Subject
                  </th>
                  <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-[#6B7280]">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-[#6B7280]">
                    Submitted
                  </th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {recentComplaints.map((complaint) => {
                  const displayName = complaint.isAnonymous
                    ? complaint.anonymousLabel
                    : complaint.realName;
                  const StatusIcon =
                    complaint.status === "pending"
                      ? Clock
                      : complaint.status === "under_review"
                        ? Eye
                        : complaint.status === "closed"
                          ? Lock
                          : CheckCircle2;
                  const statusColor =
                    complaint.status === "pending"
                      ? "text-[#8A93A6]"
                      : complaint.status === "under_review"
                        ? "text-[#E9A227]"
                        : complaint.status === "closed"
                          ? "text-[#475569]"
                          : "text-[#2E9E6B]";
                  const statusBg =
                    complaint.status === "pending"
                      ? "bg-[#8A93A6]/10"
                      : complaint.status === "under_review"
                        ? "bg-[#E9A227]/10"
                        : complaint.status === "closed"
                          ? "bg-[#475569]/10"
                          : "bg-[#2E9E6B]/10";
                  const statusLabel =
                    complaint.status === "pending"
                      ? "Pending"
                      : complaint.status === "under_review"
                        ? "Under Review"
                        : complaint.status === "closed"
                          ? "Closed"
                          : "Resolved";
                  const CatIcon = CATEGORY_LABELS[complaint.category].icon;
                  return (
                    <tr
                      key={complaint.id}
                      className="hover:bg-[#F7F8FA]/70 cursor-pointer group transition-colors"
                      onClick={() => onSelectComplaint(complaint)}
                    >
                      <td className="px-6 py-4">
                        <span className="font-mono text-sm text-[#2B3A67] font-semibold">
                          {complaint.referenceCode}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-1.5 text-xs text-[#6B7280]">
                          <CatIcon className="w-3 h-3" />
                          {CATEGORY_LABELS[complaint.category].short}
                        </div>
                      </td>
                      <td className="px-4 py-4 max-w-[240px]">
                        <div className="min-w-0">
                          <p className="text-sm text-[#1E2233] font-medium truncate">
                            {complaint.subject}
                          </p>
                          <p
                            className={`text-xs mt-0.5 ${complaint.isAnonymous ? "italic text-purple-500" : "text-[#6B7280]"}`}
                          >
                            {displayName}
                          </p>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${statusBg} ${statusColor}`}
                        >
                          <StatusIcon className="w-3 h-3" />
                          {statusLabel}
                        </div>
                      </td>
                      <td className="px-4 py-4 text-xs text-[#6B7280]">
                        {formatDate(complaint.submittedAt)}
                      </td>
                      <td className="px-4 py-4">
                        <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-[#2B3A67] transition-colors" />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Admin accounts summary */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <div className="font-semibold text-[#1E2233]">Admin Accounts</div>
            <button
              onClick={onManageAdmins}
              className="text-sm text-[#4A5C99] hover:text-[#2B3A67] flex items-center gap-1 font-medium"
            >
              Manage <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="px-6 py-4 grid grid-cols-2 sm:grid-cols-5 gap-3">
            {admins
              .filter((a) => a.role !== "super")
              .map((a) => {
                const { icon: Icon } = CATEGORY_LABELS[a.role] ?? {
                  icon: Users,
                };
                return (
                  <div
                    key={a.id}
                    className={`flex items-center gap-2 p-3 rounded-xl border ${a.isActive ? "border-gray-100 bg-[#F7F8FA]" : "border-red-100 bg-red-50/50"}`}
                  >
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center ${a.isActive ? "bg-[#2B3A67]/8" : "bg-red-100"}`}
                    >
                      <Icon
                        className={`w-4 h-4 ${a.isActive ? "text-[#2B3A67]" : "text-red-400"}`}
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-[#1E2233] truncate">
                        {a.name}
                      </p>
                      <p
                        className={`text-xs ${a.isActive ? "text-[#2E9E6B]" : "text-red-400"}`}
                      >
                        {a.isActive ? "Active" : "Inactive"}
                      </p>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
