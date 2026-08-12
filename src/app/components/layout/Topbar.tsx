import { Menu } from 'lucide-react';
import type { Admin } from '../../types';

interface Props { admin: Admin; title: string; subtitle: string; onMenu: () => void; }

export function Topbar({ admin, title, subtitle, onMenu }: Props) {
  return <header className="h-[80px] bg-white border-b border-gray-200 px-5 sm:px-8 flex items-center justify-between gap-4 flex-shrink-0"><div className="flex items-center gap-3 min-w-0"><button onClick={onMenu} className="lg:hidden p-2 rounded-lg hover:bg-gray-100"><Menu className="w-5 h-5 text-[#202D52]" /></button><div className="min-w-0"><h1 className="text-xl sm:text-[22px] font-bold text-[#202D52] truncate">{title}</h1><p className="text-xs sm:text-sm text-[#6B7280] mt-1 truncate">{subtitle}</p></div></div><div className="hidden sm:flex items-center gap-3"><div className="flex items-center gap-2 px-3 py-2 rounded-full bg-[#E8F7F0] border border-[#B8E7D0] text-[#237A52] text-xs font-semibold"><span className="w-2 h-2 rounded-full bg-[#2E9E6B]" />Session active</div><div className="w-9 h-9 rounded-full bg-[#2B3A67] text-white flex items-center justify-center text-sm font-bold">{admin.name.charAt(0).toUpperCase()}</div></div></header>;
}
