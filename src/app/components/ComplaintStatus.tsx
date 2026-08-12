import { useState } from 'react';
import { ArrowLeft, GraduationCap, Clock, Eye, CheckCircle2, MessageSquare, Calendar, Send, Lock } from 'lucide-react';
import type { Complaint } from '../types';

const CATEGORY_LABELS: Record<string, string> = {
  academic: 'Academic / Lecturer',
  finance: 'Tuition & Fees',
  hostel: 'Hostel & Facilities',
  ict: 'ICT / Portal Issues',
  general: 'General / Other',
};

const STATUS_CONFIG = {
  pending: {
    label: 'Pending',
    color: 'text-[#8A93A6]',
    bg: 'bg-[#8A93A6]/12',
    border: 'border-[#8A93A6]/25',
    icon: Clock,
    step: 0,
  },
  under_review: {
    label: 'Under Review',
    color: 'text-[#E9A227]',
    bg: 'bg-[#E9A227]/12',
    border: 'border-[#E9A227]/25',
    icon: Eye,
    step: 1,
  },
  resolved: {
    label: 'Resolved',
    color: 'text-[#2E9E6B]',
    bg: 'bg-[#2E9E6B]/12',
    border: 'border-[#2E9E6B]/25',
    icon: CheckCircle2,
    step: 2,
  },
  closed: {
    label: 'Closed', color: 'text-[#475569]', bg: 'bg-[#475569]/12', border: 'border-[#475569]/25', icon: Lock, step: 3,
  },
};

const TIMELINE_STEPS = [
  { key: 'pending', label: 'Submitted', sub: 'Complaint received by the system', icon: Clock },
  { key: 'under_review', label: 'Under Review', sub: 'Being reviewed by the department', icon: Eye },
  { key: 'resolved', label: 'Resolved', sub: 'Admin has provided a solution', icon: CheckCircle2 },
  { key: 'closed', label: 'Closed', sub: 'Complaint is closed and cannot receive follow-ups', icon: Lock },
];

interface Props {
  complaint: Complaint;
  onBack: () => void;
  onFollowUp: (message: string) => Promise<void>;
}

export function ComplaintStatus({ complaint, onBack, onFollowUp }: Props) {
  const [followUp, setFollowUp] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const config = STATUS_CONFIG[complaint.status];
  const StatusIcon = config.icon;
  const currentStep = config.step;

  const formatDate = (d: Date | string) =>
    new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

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
            <div className="text-[11px] text-blue-200">Complaint Status</div>
          </div>
        </div>
      </header>

      <div className="flex-1 px-6 py-10 max-w-xl mx-auto w-full">
        {/* Reference and status badge */}
        <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
          <div>
            <p className="text-xs text-[#6B7280] mb-0.5">Tracking Code</p>
            <p className="text-sm font-bold font-mono text-[#1E2233] break-all">{complaint.trackingToken}</p>
          </div>
          <div className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold border ${config.bg} ${config.color} ${config.border}`}>
            <StatusIcon className="w-4 h-4" />
            {config.label}
          </div>
        </div>

        {/* Complaint summary card */}
        <div className="bg-white border border-gray-100 rounded-2xl p-5 mb-6 shadow-sm">
          <div className="flex items-start justify-between gap-3 mb-4">
            <div>
              <span className="text-xs text-[#4A5C99] bg-[#4A5C99]/10 px-2.5 py-0.5 rounded-full font-medium">
                {CATEGORY_LABELS[complaint.category]}
              </span>
              <h3 className="font-semibold text-[#1E2233] mt-2 text-lg leading-snug break-words">{complaint.subject}</h3>
            </div>
          </div>
          <p className="text-[#6B7280] text-sm leading-relaxed mb-4 break-words">{complaint.description}</p>
          <div className="flex items-center gap-1.5 text-xs text-[#6B7280] border-t border-gray-50 pt-3">
            <Calendar className="w-3.5 h-3.5" />
            Submitted on {formatDate(complaint.submittedAt)}
          </div>
        </div>

        {/* Status timeline */}
        <div className="bg-white border border-gray-100 rounded-2xl p-5 mb-6 shadow-sm">
          <h3 className="font-semibold text-[#1E2233] mb-5">Progress</h3>
          <div className="space-y-0">
            {TIMELINE_STEPS.map(({ key, label, sub, icon: Icon }, index) => {
              const stepNum = TIMELINE_STEPS.findIndex(s => s.key === key);
              const isDone = currentStep > stepNum;
              const isCurrent = currentStep === stepNum;
              const isLast = index === TIMELINE_STEPS.length - 1;

              return (
                <div key={key} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 border-2 transition-all ${
                        isDone
                          ? 'bg-[#2E9E6B] border-[#2E9E6B] text-white'
                          : isCurrent
                          ? 'bg-white border-[#2B3A67] text-[#2B3A67]'
                          : 'bg-white border-gray-200 text-gray-300'
                      }`}
                    >
                      {isDone ? (
                        <CheckCircle2 className="w-5 h-5" />
                      ) : (
                        <Icon className="w-4 h-4" />
                      )}
                    </div>
                    {!isLast && (
                      <div className={`w-0.5 h-8 my-1 rounded ${isDone ? 'bg-[#2E9E6B]' : 'bg-gray-100'}`} />
                    )}
                  </div>
                  <div className="pb-6">
                    <p className={`font-medium text-sm ${isDone || isCurrent ? 'text-[#1E2233]' : 'text-gray-400'}`}>
                      {label}
                    </p>
                    <p className={`text-xs mt-0.5 ${isDone || isCurrent ? 'text-[#6B7280]' : 'text-gray-300'}`}>
                      {sub}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Conversation */}
        {complaint.messages?.length > 0 && (
          <div className="bg-white border border-gray-100 rounded-2xl p-5 mb-6 shadow-sm">
            <h3 className="font-semibold text-[#1E2233] mb-4">Conversation</h3>
            <div className="space-y-3">
              {complaint.messages.map((message, index) => (
                <div key={`${message.createdAt}-${index}`} className={`rounded-xl p-4 ${message.sender === 'admin' ? 'bg-[#2E9E6B]/6 border border-[#2E9E6B]/20' : 'bg-[#2B3A67]/6 border border-[#2B3A67]/15'}`}>
                  <div className="flex items-center justify-between gap-3 mb-1">
                    <span className="text-xs font-semibold text-[#1E2233]">{message.sender === 'admin' ? 'Admin response' : 'Your follow-up'}</span>
                    <span className="text-[11px] text-gray-400">{formatDate(message.createdAt)}</span>
                  </div>
                  <p className="text-[#1E2233] text-sm leading-relaxed break-words">{message.body}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Admin response (legacy complaints without messages) */}
        {!complaint.messages?.length && complaint.adminResponse ? (
          <div className="bg-[#2E9E6B]/6 border border-[#2E9E6B]/20 rounded-2xl p-5 mb-6">
            <div className="flex items-center gap-2 mb-3">
              <MessageSquare className="w-4 h-4 text-[#2E9E6B]" />
              <span className="font-semibold text-[#1E2233] text-sm">Admin Response</span>
            </div>
            <p className="text-[#1E2233] text-sm leading-relaxed break-words">{complaint.adminResponse}</p>
          </div>
        ) : null}
        {!complaint.messages?.length && !complaint.adminResponse && (
          <div className="bg-gray-50 border border-gray-100 rounded-2xl p-5 mb-6 text-center">
            <MessageSquare className="w-6 h-6 text-gray-300 mx-auto mb-2" />
            <p className="text-[#6B7280] text-sm">No response from admin yet.</p>
            <p className="text-xs text-gray-400 mt-0.5">Check back later using your private tracking code.</p>
          </div>
        )}

        {/* Follow-up */}
        <div className="bg-white border border-gray-100 rounded-2xl p-5 mb-6 shadow-sm">
          <h3 className="font-semibold text-[#1E2233] mb-1">Need more help?</h3>
          <p className="text-xs text-[#6B7280] mb-3">Send a follow-up under this complaint. If it was resolved, it will be reopened for review.</p>
          <textarea
            value={followUp}
            onChange={event => setFollowUp(event.target.value)}
            placeholder="Explain what still needs attention..."
            rows={4}
            className="w-full px-4 py-3 bg-[#F7F8FA] border border-gray-200 rounded-xl text-sm text-[#1E2233] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2B3A67]/20 resize-none"
          />
          {complaint.status !== 'closed' ? <button
            disabled={submitting || followUp.trim().length < 3}
            onClick={async () => {
              setSubmitting(true);
              try { await onFollowUp(followUp.trim()); setFollowUp(''); } finally { setSubmitting(false); }
            }}
            className="mt-3 w-full flex items-center justify-center gap-2 bg-[#2B3A67] text-white py-3 rounded-xl font-semibold text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#1a2547] transition-colors"
          >
            <Send className="w-4 h-4" /> {submitting ? 'Sending...' : 'Send Follow-up'}
          </button> : <div className="mt-3 text-center text-sm text-[#6B7280] bg-gray-50 rounded-xl py-3">This complaint is closed and cannot receive follow-up messages.</div>}
        </div>

        <button
          onClick={onBack}
          className="w-full border border-gray-200 bg-white text-[#6B7280] py-3.5 rounded-xl font-medium hover:bg-gray-50 transition-colors"
        >
          Track Another Complaint
        </button>
      </div>
    </div>
  );
}
