import { ClipboardList, FileText, LayoutDashboard, LogOut, Settings, ShieldCheck, Users } from 'lucide-react';
import type { Admin } from '../../types';
import type { NavKey } from './DashboardLayout';

interface Props { admin: Admin; active: NavKey; onNavigate: (key: NavKey) => void; onLogout: () => void; onClose?: () => void; }

export function Sidebar({ admin, active, onNavigate, onLogout, onClose }: Props) {
  const nav = [
    ...(admin.role === 'super' ? [{ key: 'overview' as const, label: 'Overview', icon: LayoutDashboard }] : []),
    { key: 'complaints' as const, label: 'All Complaints', icon: ClipboardList },
    ...(admin.role === 'super' ? [{ key: 'admins' as const, label: 'Manage Admins', icon: Users }, { key: 'audit' as const, label: 'Audit Logs', icon: ShieldCheck }] : []),
  ];
  return <aside className="h-full w-[260px] bg-[#202D52] text-white flex flex-col border-r border-white/10">
    <div className="h-[80px] px-6 flex items-center gap-3 border-b border-white/10 flex-shrink-0"><div className="w-10 h-10 rounded-xl bg-[#F2A93B] flex items-center justify-center"><FileText className="w-5 h-5 text-[#202D52]" /></div><div><p className="font-bold tracking-wide text-sm">LINCOLN COLLEGE</p><p className="text-[11px] text-blue-200 mt-0.5">OCMS STAFF PORTAL</p></div></div>
    <div className="px-2 py-6 flex-1 overflow-hidden"><p className="px-3 mb-3 text-[10px] uppercase tracking-[0.18em] text-blue-200/60 font-semibold">Workspace</p><nav className="space-y-1">{nav.map(item => { const Icon = item.icon; return <button key={item.key} onClick={() => { onNavigate(item.key); onClose?.(); }} className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-colors ${active === item.key ? 'bg-[#F2A93B] text-[#202D52] shadow-sm' : 'text-blue-100 hover:bg-white/10'}`}><Icon className="w-4 h-4" />{item.label}</button>; })}</nav><p className="px-3 mt-8 mb-3 text-[10px] uppercase tracking-[0.18em] text-blue-200/60 font-semibold">Account</p><button className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium text-blue-100 hover:bg-white/10"><Settings className="w-4 h-4" />Settings</button></div>
    <div className="p-4 border-t border-white/10 flex-shrink-0"><div className="px-3 py-3 mb-2 rounded-xl bg-white/5"><p className="text-sm font-semibold truncate">{admin.name}</p><p className="text-xs text-blue-200 mt-0.5 truncate">{admin.email}</p></div><button onClick={onLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-blue-100 hover:bg-white/10"><LogOut className="w-4 h-4" />Sign out</button></div>
  </aside>;
}
