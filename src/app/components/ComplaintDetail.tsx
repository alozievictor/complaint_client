import { useState } from 'react';
import type { ElementType } from 'react';
import { ArrowLeft, Clock, Eye, CheckCircle2, User, Mail, GraduationCap, BookOpen, Building2, CreditCard, Monitor, MessageSquare, Calendar, Save, RotateCcw } from 'lucide-react';
import type { Admin, Complaint, ComplaintStatus, Category } from '../types';

const CATEGORY_LABELS: Record<Category, string> = {
  academic: 'Academic / Lecturer',
  finance: 'Tuition & Fees',
  hostel: 'Hostel & Facilities',
  ict: 'ICT / Portal Issues',
  general: 'General / Other',
};

const CATEGORY_ICONS: Record<Category, ElementType> = {
  academic: BookOpen,
  finance: CreditCard,
  hostel: Building2,
  ict: Monitor,
  general: MessageSquare,
};

const STATUS_OPTIONS: { value: ComplaintStatus; label: string; color: string; bg: string; icon: ElementType }[] = [
  { value: 'pending', label: 'Pending', color: 'text-[#8A93A6]', bg: 'bg-[#8A93A6]/12', icon: Clock },
  { value: 'under_review', label: 'Under Review', color: 'text-[#E9A227]', bg: 'bg-[#E9A227]/12', icon: Eye },
  { value: 'resolved', label: 'Resolved', color: 'text-[#2E9E6B]', bg: 'bg-[#2E9E6B]/12', icon: CheckCircle2 },
];

interface Props {
  complaint: Complaint;
  admin: Admin;
  onUpdate: (updated: Complaint) => Promise<void>;
  onBack: () => void | Promise<void>;
}

export function ComplaintDetail({ complaint, admin, onUpdate, onBack }: Props) {
  const [status, setStatus] = useState<ComplaintStatus>(complaint.status);
  const [response, setResponse] = useState(complaint.adminResponse);
  const [notes, setNotes] = useState(complaint.internalNotes);
  const [category, setCategory] = useState<Category>(complaint.category);
  const [saved, setSaved] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);

  const CatIcon = CATEGORY_ICONS[category];

  const currentStatus = STATUS_OPTIONS.find(s => s.value === status)!;
  const CurrentStatusIcon = currentStatus.icon;

  const handleSave = async () => {
    setSaving(true);
    try {
      await onUpdate({
        ...complaint,
        status,
        adminResponse: response.trim(),
        internalNotes: notes.trim(),
        category,
      });
      setSaved(true);
      setDirty(false);
      setTimeout(() => setSaved(false), 3000);
    } finally {
      setSaving(false);
    }
  };

  const markDirty = () => { setSaved(false); setDirty(true); };

  const formatDate = (d: Date | string) =>
    new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-[#2B3A67] text-white px-6 py-4 flex items-center gap-3 sticky top-0 z-40 shadow-md">
        <button onClick={onBack} className="p-2 hover:bg-white/10 rounded-lg transition-colors -ml-1">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-3 flex-1">
          <div className="w-8 h-8 bg-[#F2A93B] rounded-full flex items-center justify-center">
            <GraduationCap className="w-4 h-4 text-[#2B3A67]" />
          </div>
          <div>
            <div className="font-semibold text-sm">Complaint Detail</div>
            <div className="text-[11px] text-blue-200 font-mono">{complaint.referenceCode}</div>
          </div>
        </div>
        {dirty && (
          <button
            onClick={handleSave}
            className="flex items-center gap-1.5 bg-[#F2A93B] text-[#1E2233] px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[#e09830] transition-colors"
          >
            <Save className="w-3.5 h-3.5" /> Save Changes
          </button>
        )}
        {saved && (
          <div className="flex items-center gap-1.5 bg-[#2E9E6B]/20 text-[#2E9E6B] px-4 py-2 rounded-lg text-sm font-medium border border-[#2E9E6B]/30">
            <CheckCircle2 className="w-3.5 h-3.5" /> Saved
          </div>
        )}
      </header>

      <div className="flex-1 px-6 py-8 max-w-3xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

          {/* Main content */}
          <div className="lg:col-span-2 space-y-5">
            {/* Complaint card */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <div className="flex items-start justify-between gap-3 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-[#2B3A67]/8 rounded-lg flex items-center justify-center">
                    <CatIcon className="w-4 h-4 text-[#2B3A67]" />
                  </div>
                  <span className="text-sm text-[#4A5C99] font-medium">{CATEGORY_LABELS[category]}</span>
                </div>
                <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${currentStatus.bg} ${currentStatus.color}`}>
                  <CurrentStatusIcon className="w-3 h-3" />
                  {currentStatus.label}
                </div>
              </div>

              <h2 className="text-xl font-bold text-[#1E2233] mb-4 leading-snug">{complaint.subject}</h2>
              <p className="text-[#6B7280] text-sm leading-relaxed mb-5">{complaint.description}</p>

              <div className="flex items-center gap-1.5 text-xs text-[#6B7280] pt-4 border-t border-gray-50">
                <Calendar className="w-3.5 h-3.5" />
                Submitted on {formatDate(complaint.submittedAt)}
              </div>
            </div>

            {/* Admin response */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <label className="block font-semibold text-[#1E2233] mb-1">
                Response to Student
              </label>
              <p className="text-xs text-[#6B7280] mb-3">
                This response is visible to the student when they track their complaint.
                {!complaint.isAnonymous && complaint.realEmail && ` An email will be sent to ${complaint.realEmail} when saved.`}
              </p>
              <textarea
                value={response}
                onChange={e => { setResponse(e.target.value); markDirty(); }}
                placeholder="Write your response to the student here. Be clear, professional, and actionable..."
                rows={5}
                className="w-full px-4 py-3 bg-[#F7F8FA] border border-gray-200 rounded-xl text-[#1E2233] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2B3A67]/20 focus:border-[#2B3A67] resize-none transition-all"
              />
            </div>

            {/* Internal notes */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <label className="block font-semibold text-[#1E2233] mb-1">
                Internal Notes
              </label>
              <p className="text-xs text-[#6B7280] mb-3">These notes are for admin use only — never shown to the student.</p>
              <textarea
                value={notes}
                onChange={e => { setNotes(e.target.value); markDirty(); }}
                placeholder="Add internal notes, action items, or context for your team..."
                rows={3}
                className="w-full px-4 py-3 bg-amber-50/50 border border-amber-100 rounded-xl text-[#1E2233] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-200/50 focus:border-amber-300 resize-none transition-all"
              />
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Student info */}
            <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
              <h3 className="font-semibold text-[#1E2233] text-sm mb-3">Submitted By</h3>
              {complaint.isAnonymous ? (
                <div className="space-y-2">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-purple-500" />
                  </div>
                  <div>
                    <p className="font-semibold text-purple-700 italic">{complaint.anonymousLabel}</p>
                    <p className="text-xs text-[#6B7280] mt-0.5">Student chose to submit anonymously</p>
                  </div>
                  <div className="bg-purple-50 border border-purple-100 rounded-lg px-3 py-2 text-xs text-purple-600">
                    Identity is hidden per the student's choice. Do not attempt to identify this student.
                  </div>
                </div>
              ) : (
                <div className="space-y-2.5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 bg-blue-100 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-blue-500" />
                    </div>
                    <div>
                      <p className="font-semibold text-[#1E2233] text-sm">{complaint.realName}</p>
                      <p className="text-xs text-[#6B7280]">Identified complaint</p>
                    </div>
                  </div>
                  {complaint.realEmail && (
                    <div className="flex items-center gap-2 text-sm text-[#6B7280]">
                      <Mail className="w-3.5 h-3.5 text-[#2B3A67] flex-shrink-0" />
                      <span className="break-all">{complaint.realEmail}</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Status update */}
            <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
              <h3 className="font-semibold text-[#1E2233] text-sm mb-3">Update Status</h3>
              <div className="space-y-2">
                {STATUS_OPTIONS.map(opt => {
                  const OptIcon = opt.icon;
                  return (
                    <button
                      key={opt.value}
                      onClick={() => { setStatus(opt.value); markDirty(); }}
                      className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl border text-sm font-medium transition-all ${
                        status === opt.value
                          ? `${opt.bg} ${opt.color} border-current/20`
                          : 'border-gray-100 text-[#6B7280] hover:bg-gray-50'
                      }`}
                    >
                      <OptIcon className="w-4 h-4" />
                      {opt.label}
                      {status === opt.value && <span className="ml-auto text-xs">✓ Selected</span>}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Reassign (super admin only) */}
            {admin.role === 'super' && (
              <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                <h3 className="flex items-center gap-1.5 font-semibold text-[#1E2233] text-sm mb-3">
                  <RotateCcw className="w-4 h-4" /> Reassign Category
                </h3>
                <select
                  value={category}
                  onChange={e => { setCategory(e.target.value as Category); markDirty(); }}
                  className="w-full px-3 py-2.5 bg-[#F7F8FA] border border-gray-200 rounded-xl text-sm text-[#1E2233] focus:outline-none focus:border-[#2B3A67] focus:ring-1 focus:ring-[#2B3A67]/20"
                >
                  <option value="academic">Academic / Lecturer</option>
                  <option value="finance">Tuition & Fees</option>
                  <option value="hostel">Hostel & Facilities</option>
                  <option value="ict">ICT / Portal Issues</option>
                  <option value="general">General / Other</option>
                </select>
              </div>
            )}

            {/* Save */}
            <button
              onClick={handleSave}
              className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-sm transition-all shadow ${
                dirty
                  ? 'bg-[#2B3A67] text-white hover:bg-[#1a2547] hover:shadow-lg'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
            disabled={!dirty || saving}
          >
            <Save className="w-4 h-4" />
              {saving ? 'Saving...' : saved ? 'Saved!' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
