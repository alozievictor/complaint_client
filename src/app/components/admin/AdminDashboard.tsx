import { useState } from "react";
import type { ElementType } from "react";
import {
  LogOut,
  Search,
  Filter,
  GraduationCap,
  BookOpen,
  Building2,
  CreditCard,
  Monitor,
  MessageSquare,
  Clock,
  Eye,
  CheckCircle2,
  User,
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  Lock,
} from "lucide-react";
import type {
  Admin,
  Complaint,
  ComplaintStatus,
  ComplaintListMeta,
  ComplaintListQuery,
  Category,
} from "../../types";
import { DashboardLayout } from "../layout/DashboardLayout";

const CATEGORY_LABELS: Record<string, string> = {
  academic: "Academic",
  finance: "Finance",
  hostel: "Hostel",
  ict: "ICT",
  general: "General",
};

const CATEGORY_ICONS: Record<string, ElementType> = {
  academic: BookOpen,
  finance: CreditCard,
  hostel: Building2,
  ict: Monitor,
  general: MessageSquare,
};

const ROLE_LABELS: Record<string, string> = {
  academic: "Academic Admin",
  finance: "Finance Admin",
  hostel: "Hostel Admin",
  ict: "ICT Admin",
  super: "Super Admin",
};

const STATUS_CONFIG: Record<
  ComplaintStatus,
  { label: string; color: string; bg: string; icon: ElementType }
> = {
  pending: {
    label: "Pending",
    color: "text-[#8A93A6]",
    bg: "bg-[#8A93A6]/12",
    icon: Clock,
  },
  under_review: {
    label: "Under Review",
    color: "text-[#E9A227]",
    bg: "bg-[#E9A227]/12",
    icon: Eye,
  },
  resolved: {
    label: "Resolved",
    color: "text-[#2E9E6B]",
    bg: "bg-[#2E9E6B]/12",
    icon: CheckCircle2,
  },
  closed: {
    label: "Closed",
    color: "text-[#475569]",
    bg: "bg-[#475569]/12",
    icon: Lock,
  },
};

type StatusFilter = "all" | ComplaintStatus;
interface Props {
  admin: Admin;
  complaints: Complaint[];
  meta: ComplaintListMeta;
  query: ComplaintListQuery;
  onQueryChange: (query: ComplaintListQuery) => Promise<void>;
  onSelectComplaint: (c: Complaint) => void;
  onLogout: () => void;
  onSuperDashboard?: () => void;
  onManageAdmins?: () => void;
  onAuditLogs?: () => void;
}

export function AdminDashboard({
  admin,
  complaints,
  meta,
  query,
  onQueryChange,
  onSelectComplaint,
  onLogout,
  onSuperDashboard,
  onManageAdmins,
  onAuditLogs,
}: Props) {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<Category | "">("");
  const counts = meta.counts;
  const currentPage = meta.pagination.page;
  const totalPages = meta.pagination.totalPages;
  const pageStart = (currentPage - 1) * meta.pagination.limit;
  const paginatedComplaints = complaints;

  const applyQuery = (next: Partial<ComplaintListQuery>) => {
    void onQueryChange({ ...query, ...next, page: 1 });
  };

  const formatDate = (d: Date | string) =>
    new Date(d).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  return (
    <DashboardLayout
      admin={admin}
      title="Complaints Dashboard"
      subtitle={
        admin.role === "super"
          ? "All complaints across every department"
          : `${CATEGORY_LABELS[admin.role]} complaints`
      }
      active="complaints"
      onNavigate={(key) => {
        if (key === "overview") onSuperDashboard?.();
        if (key === "admins") onManageAdmins?.();
        if (key === "audit") onAuditLogs?.();
      }}
      onLogout={onLogout}
    >
      {/* Header */}
      <header className="hidden">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-[#F2A93B] rounded-full flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-[#2B3A67]" />
            </div>
            <div>
              <div className="font-bold text-sm">Lincoln College OCMS</div>
              <div className="text-[11px] text-blue-200">
                {ROLE_LABELS[admin.role]} — {admin.name}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {onSuperDashboard && (
              <button
                onClick={onSuperDashboard}
                className="flex items-center gap-1.5 text-sm text-blue-200 hover:text-white border border-white/20 px-3 py-1.5 rounded-lg hover:bg-white/10 transition-colors"
              >
                <LayoutDashboard className="w-3.5 h-3.5" /> Overview
              </button>
            )}
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
        {/* Page title is provided by the dashboard topbar. */}
        {/*
        <div className="mb-6">
          <h2 className="text-xl font-bold text-[#1E2233] mb-0.5">
            Complaints Dashboard
          </h2>
          <p className="text-[#6B7280] text-sm">
            {admin.role === "super"
              ? "All complaints across all departments"
              : `${CATEGORY_LABELS[admin.role]} complaints — ${counts.all} total`}
          </p>
        </div>*/}

        {/* Stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          {[
            {
              label: "Total",
              value: counts.all,
              color: "text-[#1E2233]",
              dot: "bg-gray-400",
            },
            {
              label: "Pending",
              value: counts.pending,
              color: "text-[#8A93A6]",
              dot: "bg-[#8A93A6]",
            },
            {
              label: "Under Review",
              value: counts.under_review,
              color: "text-[#E9A227]",
              dot: "bg-[#E9A227]",
            },
            {
              label: "Resolved",
              value: counts.resolved,
              color: "text-[#2E9E6B]",
              dot: "bg-[#2E9E6B]",
            },
            {
              label: "Closed",
              value: counts.closed,
              color: "text-[#475569]",
              dot: "bg-[#475569]",
            },
          ].map(({ label, value, color, dot }) => (
            <div
              key={label}
              className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm"
            >
              <div className="flex items-center gap-1.5 mb-1">
                <div className={`w-2 h-2 rounded-full ${dot}`} />
                <span className="text-xs text-[#6B7280]">{label}</span>
              </div>
              <div className={`text-2xl font-bold ${color}`}>{value}</div>
            </div>
          ))}
        </div>

        {/* Filters + search */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex flex-col sm:flex-row gap-3 sm:items-center justify-between">
            {/* Status filter */}
            <select
              value={statusFilter}
              onChange={(e) => {
                const value = e.target.value as StatusFilter;
                setStatusFilter(value);
                applyQuery({ status: value === "all" ? undefined : value });
              }}
              className="order-3 px-3 py-2 bg-[#F7F8FA] border border-gray-200 rounded-lg text-sm text-[#1E2233] focus:outline-none focus:border-[#2B3A67] focus:ring-1 focus:ring-[#2B3A67]/20"
              aria-label="Filter complaints by status"
            >
              <option value="all">All statuses ({counts.all})</option>
              <option value="pending">Pending ({counts.pending})</option>
              <option value="under_review">Under Review ({counts.under_review})</option>
              <option value="resolved">Resolved ({counts.resolved})</option>
              <option value="closed">Closed ({counts.closed})</option>
            </select>
            {/* Legacy status tabs removed */}
            <div className="hidden">
              {(
                [
                  "all",
                  "pending",
                  "under_review",
                  "resolved",
                  "closed",
                ] as StatusFilter[]
              ).map((status) => (
                <button
                  key={status}
                  onClick={() => {
                    setStatusFilter(status);
                    applyQuery({
                      status: status === "all" ? undefined : status,
                    });
                  }}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    statusFilter === status
                      ? "bg-[#2B3A67] text-white"
                      : "text-[#6B7280] hover:bg-gray-100"
                  }`}
                >
                  {status === "all"
                    ? `All (${counts.all})`
                    : status === "pending"
                      ? `Pending (${counts.pending})`
                      : status === "under_review"
                        ? `Review (${counts.under_review})`
                        : status === "resolved"
                          ? `Resolved (${counts.resolved})`
                          : `Closed (${counts.closed})`}
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  applyQuery({ search: e.target.value });
                }}
                placeholder="Search by code, subject or name"
                className="w-full sm:w-64 pl-9 pr-4 py-2 bg-[#F7F8FA] border border-gray-200 rounded-lg text-sm text-[#1E2233] placeholder:text-gray-400 focus:outline-none focus:border-[#2B3A67] focus:ring-1 focus:ring-[#2B3A67]/20"
              />
            </div>
            {admin.role === "super" && (
              <select
                value={categoryFilter}
                onChange={(e) => {
                  const value = e.target.value as Category | "";
                  setCategoryFilter(value);
                  applyQuery({ category: value || undefined });
                }}
                className="order-2 px-3 py-2 bg-[#F7F8FA] border border-gray-200 rounded-lg text-sm text-[#1E2233]"
              >
                <option value="">All categories</option>
                <option value="academic">Academic</option>
                <option value="finance">Finance</option>
                <option value="hostel">Hostel</option>
                <option value="ict">ICT</option>
                <option value="general">General</option>
              </select>
            )}
            <label className="order-4 flex items-center gap-2 text-xs font-medium text-[#6B7280]">
              <span>Start date</span>
              <input
                type="date"
                value={query.dateFrom ?? ""}
                onChange={(e) =>
                  applyQuery({ dateFrom: e.target.value || undefined })
                }
                className="px-3 py-2 bg-[#F7F8FA] border border-gray-200 rounded-lg text-sm font-normal text-[#1E2233]"
                aria-label="Start date"
              />
            </label>
            <label className="order-5 flex items-center gap-2 text-xs font-medium text-[#6B7280]">
              <span>End date</span>
              <input
                type="date"
                value={query.dateTo ?? ""}
                onChange={(e) =>
                  applyQuery({ dateTo: e.target.value || undefined })
                }
                className="px-3 py-2 bg-[#F7F8FA] border border-gray-200 rounded-lg text-sm font-normal text-[#1E2233]"
                aria-label="End date"
              />
            </label>
          </div>

          {/* Table */}
          {complaints.length === 0 ? (
            <div className="py-16 text-center">
              <Filter className="w-8 h-8 text-gray-200 mx-auto mb-3" />
              <p className="text-[#6B7280] font-medium">No complaints found</p>
              <p className="text-gray-400 text-sm mt-1">
                Try adjusting your filters or search
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-[#F7F8FA]">
                    <th className="text-left px-5 py-3 text-xs font-semibold text-[#6B7280] uppercase tracking-wide">
                      Reference
                    </th>
                    {admin.role === "super" && (
                      <th className="text-left px-4 py-3 text-xs font-semibold text-[#6B7280] uppercase tracking-wide">
                        Category
                      </th>
                    )}
                    <th className="text-left px-4 py-3 text-xs font-semibold text-[#6B7280] uppercase tracking-wide">
                      Subject
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-[#6B7280] uppercase tracking-wide">
                      Student
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-[#6B7280] uppercase tracking-wide">
                      Status
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-[#6B7280] uppercase tracking-wide">
                      Date
                    </th>
                    <th className="px-4 py-3" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {paginatedComplaints.map((complaint) => {
                    const statusConf = STATUS_CONFIG[complaint.status];
                    const StatusIcon = statusConf.icon;
                    const CatIcon = CATEGORY_ICONS[complaint.category];
                    const displayName = complaint.isAnonymous
                      ? complaint.anonymousLabel
                      : complaint.realName;
                    return (
                      <tr
                        key={complaint.id}
                        className="hover:bg-[#F7F8FA]/70 cursor-pointer group transition-colors"
                        onClick={() => onSelectComplaint(complaint)}
                      >
                        <td className="px-5 py-4">
                          <span className="font-mono text-sm text-[#2B3A67] font-semibold">
                            {complaint.referenceCode}
                          </span>
                        </td>
                        {admin.role === "super" && (
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-1.5 text-sm text-[#6B7280]">
                              <CatIcon className="w-3.5 h-3.5" />
                              {CATEGORY_LABELS[complaint.category]}
                            </div>
                          </td>
                        )}
                        <td className="px-4 py-4 max-w-[200px]">
                          <p className="text-sm text-[#1E2233] font-medium truncate">
                            {complaint.subject}
                          </p>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-1.5">
                            <div
                              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${complaint.isAnonymous ? "bg-purple-100 text-purple-600" : "bg-blue-100 text-blue-600"}`}
                            >
                              <User className="w-3 h-3" />
                            </div>
                            <span
                              className={`text-sm ${complaint.isAnonymous ? "text-purple-600 italic" : "text-[#1E2233]"}`}
                            >
                              {displayName}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${statusConf.bg} ${statusConf.color}`}
                          >
                            <StatusIcon className="w-3 h-3" />
                            {statusConf.label}
                          </div>
                        </td>
                        <td className="px-4 py-4 text-sm text-[#6B7280]">
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
          )}
          {meta.pagination.total > 0 && (
            <div className="px-5 py-4 border-t border-gray-100 flex flex-col sm:flex-row gap-3 sm:items-center justify-between">
              <p className="text-xs text-[#6B7280]">
                Showing {pageStart + 1}-
                {Math.min(
                  pageStart + meta.pagination.limit,
                  meta.pagination.total,
                )}{" "}
                of {meta.pagination.total} complaints
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    void onQueryChange({ ...query, page: currentPage - 1 })
                  }
                  disabled={currentPage === 1}
                  className="p-2 border border-gray-200 rounded-lg text-[#2B3A67] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50"
                  aria-label="Previous page"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-sm font-medium text-[#1E2233]">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() =>
                    void onQueryChange({ ...query, page: currentPage + 1 })
                  }
                  disabled={currentPage === totalPages}
                  className="p-2 border border-gray-200 rounded-lg text-[#2B3A67] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50"
                  aria-label="Next page"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
