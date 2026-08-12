import { useEffect, useState } from "react";
import {
  ArrowLeft,
  ClipboardList,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
} from "lucide-react";
import type { AuditLog, Admin } from "../../types";
import { api } from "../../lib/api";
import { DashboardLayout } from "../layout/DashboardLayout";

interface Props {
  admin: Admin;
  onBack: () => void;
  onLogout: () => void;
  onViewAll: () => void;
  onManageAdmins: () => void;
}

export function AuditLogs({
  admin,
  onBack,
  onLogout,
  onViewAll,
  onManageAdmins,
}: Props) {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    void api
      .listAuditLogs(page)
      .then((result) => {
        setLogs(result.logs);
        setTotalPages(result.pagination.totalPages);
      })
      .finally(() => setLoading(false));
  }, [page]);

  const formatDate = (value: Date | string) =>
    new Date(value).toLocaleString("en-GB", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  const label = (action: string) => action.split("_").join(" ");

  return (
    <DashboardLayout
      admin={admin}
      title="Audit Logs"
      subtitle="Super Admin activity history"
      active="audit"
      onNavigate={(key) => {
        if (key === "overview") onBack();
        if (key === "complaints") onViewAll();
        if (key === "admins") onManageAdmins();
      }}
      onLogout={onLogout}
    >
      <header className="hidden">
        <button onClick={onBack} className="p-2 hover:bg-white/10 rounded-lg">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-[#F2A93B] rounded-full flex items-center justify-center">
            <GraduationCap className="w-4 h-4 text-[#2B3A67]" />
          </div>
          <div>
            <div className="font-semibold text-sm">Audit Logs</div>
            <div className="text-[11px] text-blue-200">
              Super Admin activity history
            </div>
          </div>
        </div>
      </header>
      <main className="flex-1 px-6 py-8 max-w-7xl mx-auto w-full">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-sm text-[#6B7280]">
              Loading audit logs...
            </div>
          ) : logs.length === 0 ? (
            <div className="p-12 text-center">
              <ClipboardList className="w-8 h-8 text-gray-200 mx-auto mb-3" />
              <p className="text-sm text-[#6B7280]">No audit activity yet.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {logs.map((log) => (
                <div
                  key={log.id}
                  className="px-5 py-4 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-5"
                >
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-[#1E2233] capitalize">
                      {label(log.action)}
                    </p>
                    <p className="text-xs text-[#6B7280] mt-1">
                      {log.actorName || log.actorType}
                      {log.complaintReference
                        ? ` · ${log.complaintReference}`
                        : ""}
                      {log.targetLabel ? ` · ${log.targetLabel}` : ""}
                    </p>
                  </div>
                  <span className="text-xs text-gray-400">
                    {formatDate(log.createdAt)}
                  </span>
                </div>
              ))}
            </div>
          )}
          <div className="px-5 py-4 border-t border-gray-100 flex items-center justify-between">
            <span className="text-xs text-[#6B7280]">
              Page {page} of {totalPages}
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
                className="p-2 border rounded-lg disabled:opacity-40"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setPage(page + 1)}
                disabled={page === totalPages}
                className="p-2 border rounded-lg disabled:opacity-40"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </main>
    </DashboardLayout>
  );
}
