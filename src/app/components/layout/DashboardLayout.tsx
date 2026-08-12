import type { ReactNode } from 'react';
import { useState } from 'react';
import type { Admin } from '../../types';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';

export type NavKey = 'overview' | 'complaints' | 'admins' | 'audit';
interface Props { admin: Admin; title: string; subtitle: string; active: NavKey; children: ReactNode; onNavigate: (key: NavKey) => void; onLogout: () => void; }

export function DashboardLayout({ admin, title, subtitle, active, children, onNavigate, onLogout }: Props) {
  const [mobileOpen, setMobileOpen] = useState(false);
  return <div className="h-screen overflow-hidden bg-[#F5F7FA] flex"><div className="hidden lg:block h-full flex-shrink-0"><Sidebar admin={admin} active={active} onNavigate={onNavigate} onLogout={onLogout} /></div>{mobileOpen && <div className="fixed inset-0 z-50 lg:hidden"><button className="absolute inset-0 bg-black/40" onClick={() => setMobileOpen(false)} /><div className="relative h-full w-[280px]"><Sidebar admin={admin} active={active} onNavigate={onNavigate} onLogout={onLogout} onClose={() => setMobileOpen(false)} /></div></div>}<div className="min-w-0 flex-1 h-full flex flex-col"><Topbar admin={admin} title={title} subtitle={subtitle} onMenu={() => setMobileOpen(true)} /><main className="flex-1 overflow-y-auto">{children}</main></div></div>;
}
