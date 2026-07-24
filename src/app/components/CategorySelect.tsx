import type { ElementType } from 'react';
import { ArrowLeft, BookOpen, CreditCard, Building2, Monitor, MessageSquare, ChevronRight, GraduationCap } from 'lucide-react';
import type { Category } from '../types';

const CATEGORIES: { id: Category; label: string; description: string; icon: ElementType; adminLabel: string }[] = [
  {
    id: 'academic',
    label: 'Academic / Lecturer',
    description: 'Grade disputes, unfair assessment, lecturer conduct, exam issues, academic misconduct',
    icon: BookOpen,
    adminLabel: 'Routed to: Academic Admin',
  },
  {
    id: 'finance',
    label: 'Tuition & Fees',
    description: 'Payment errors, duplicate charges, refunds, scholarship issues, fee statement problems',
    icon: CreditCard,
    adminLabel: 'Routed to: Finance Admin',
  },
  {
    id: 'hostel',
    label: 'Hostel & Facilities',
    description: 'Accommodation conditions, water/electricity outages, maintenance, campus infrastructure',
    icon: Building2,
    adminLabel: 'Routed to: Hostel Admin',
  },
  {
    id: 'ict',
    label: 'ICT / Portal Issues',
    description: 'Student portal access, login problems, ICT infrastructure, online tools, systems failures',
    icon: Monitor,
    adminLabel: 'Routed to: ICT Admin',
  },
  {
    id: 'general',
    label: 'General / Other',
    description: 'Library hours, campus services, canteen, security, or any complaint that doesn\'t fit above',
    icon: MessageSquare,
    adminLabel: 'Routed to: Super Admin',
  },
];

interface Props {
  onSelect: (category: Category) => void;
  onBack: () => void;
}

export function CategorySelect({ onSelect, onBack }: Props) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
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
            <div className="text-[11px] text-blue-200">Submit a Complaint</div>
          </div>
        </div>
      </header>

      <div className="flex-1 px-6 py-10 max-w-2xl mx-auto w-full">
        {/* Progress indicator */}
        <div className="flex items-center gap-2 mb-10 text-sm">
          <div className="flex items-center gap-1.5">
            <div className="w-7 h-7 rounded-full bg-[#2B3A67] text-white text-xs flex items-center justify-center font-semibold shadow">1</div>
            <span className="text-[#2B3A67] font-semibold">Category</span>
          </div>
          <div className="flex-1 h-0.5 bg-gray-200 rounded" />
          <div className="flex items-center gap-1.5 opacity-40">
            <div className="w-7 h-7 rounded-full border-2 border-gray-300 text-gray-400 text-xs flex items-center justify-center">2</div>
            <span className="text-gray-400">Details</span>
          </div>
          <div className="flex-1 h-0.5 bg-gray-200 rounded" />
          <div className="flex items-center gap-1.5 opacity-40">
            <div className="w-7 h-7 rounded-full border-2 border-gray-300 text-gray-400 text-xs flex items-center justify-center">3</div>
            <span className="text-gray-400">Confirm</span>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-[#1E2233] mb-2">What is your complaint about?</h2>
        <p className="text-[#6B7280] mb-8 text-sm">Select the category that best describes your complaint. This routes it to the right department for faster resolution.</p>

        <div className="space-y-3">
          {CATEGORIES.map(({ id, label, description, icon: Icon, adminLabel }) => (
            <button
              key={id}
              onClick={() => onSelect(id)}
              className="w-full flex items-center gap-4 bg-white border border-gray-100 rounded-2xl p-5 hover:border-[#2B3A67] hover:shadow-lg transition-all text-left group cursor-pointer"
            >
              <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 bg-[#2B3A67]/8 group-hover:bg-[#2B3A67]/15 transition-colors">
                <Icon className="w-6 h-6 text-[#2B3A67]" strokeWidth={1.75} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-[#1E2233] mb-0.5">{label}</div>
                <div className="text-[#6B7280] text-sm leading-snug">{description}</div>
                <div className="text-xs text-[#4A5C99] mt-1.5 font-medium">{adminLabel}</div>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-[#2B3A67] transition-colors flex-shrink-0" />
            </button>
          ))}
        </div>

        <p className="text-xs text-[#6B7280] text-center mt-6">
          Not sure which category? Pick the closest one — the Super Admin can reassign if needed.
        </p>
      </div>
    </div>
  );
}
