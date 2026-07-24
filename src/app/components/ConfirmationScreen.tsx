import { useState } from 'react';
import { CheckCircle2, Copy, Check, Search, Home, Mail, GraduationCap } from 'lucide-react';
import type { Complaint } from '../types';

const CATEGORY_LABELS: Record<string, string> = {
  academic: 'Academic / Lecturer',
  finance: 'Tuition & Fees',
  hostel: 'Hostel & Facilities',
  ict: 'ICT / Portal Issues',
  general: 'General / Other',
};

interface Props {
  complaint: Complaint;
  onDone: () => void;
  onTrack: () => void;
}

export function ConfirmationScreen({ complaint, onDone, onTrack }: Props) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(complaint.referenceCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      const el = document.createElement('textarea');
      el.value = complaint.referenceCode;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const emailProvided = !!complaint.realEmail;

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-[#2B3A67] text-white px-6 py-4 flex items-center gap-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-[#F2A93B] rounded-full flex items-center justify-center">
            <GraduationCap className="w-4 h-4 text-[#2B3A67]" />
          </div>
          <div>
            <div className="font-semibold text-sm">Lincoln College OCMS</div>
            <div className="text-[11px] text-blue-200">Complaint Submitted</div>
          </div>
        </div>
      </header>

      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="max-w-md w-full text-center">
          {/* Success icon */}
          <div className="w-20 h-20 bg-[#2E9E6B]/12 rounded-full flex items-center justify-center mx-auto mb-6 ring-8 ring-[#2E9E6B]/6">
            <CheckCircle2 className="w-10 h-10 text-[#2E9E6B]" />
          </div>

          <h2 className="text-2xl font-bold text-[#1E2233] mb-2">Complaint Submitted!</h2>
          <p className="text-[#6B7280] mb-8 text-sm leading-relaxed">
            Your complaint has been received and will be reviewed by the relevant department. Save your reference code — you'll need it to track your complaint.
          </p>

          {/* Reference code — the most important UI element */}
          <div className="bg-[#2B3A67] rounded-2xl p-7 mb-3 text-white shadow-xl">
            <p className="text-blue-200 text-xs font-medium uppercase tracking-wider mb-3">Your Reference Code</p>
            <div className="text-4xl font-bold tracking-wider mb-5 font-mono">{complaint.referenceCode}</div>
            <button
              onClick={handleCopy}
              className={`flex items-center gap-2 mx-auto px-6 py-2.5 rounded-xl font-medium text-sm transition-all ${
                copied
                  ? 'bg-[#2E9E6B] text-white'
                  : 'bg-white/15 text-white hover:bg-white/25 border border-white/20'
              }`}
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied to clipboard!' : 'Copy Code'}
            </button>
          </div>

          {/* Complaint summary */}
          <div className="bg-white border border-gray-100 rounded-xl p-4 mb-6 text-left space-y-2.5 shadow-sm">
            <div className="flex justify-between items-start gap-2">
              <span className="text-xs text-[#6B7280]">Category</span>
              <span className="text-sm text-[#1E2233] font-medium text-right">{CATEGORY_LABELS[complaint.category]}</span>
            </div>
            <div className="flex justify-between items-start gap-2">
              <span className="text-xs text-[#6B7280]">Subject</span>
              <span className="text-sm text-[#1E2233] font-medium text-right max-w-[60%]">{complaint.subject}</span>
            </div>
            <div className="flex justify-between items-center gap-2">
              <span className="text-xs text-[#6B7280]">Identity</span>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${complaint.isAnonymous ? 'bg-purple-50 text-purple-700' : 'bg-blue-50 text-blue-700'}`}>
                {complaint.isAnonymous ? 'Anonymous' : 'Identified'}
              </span>
            </div>
            <div className="flex justify-between items-center gap-2">
              <span className="text-xs text-[#6B7280]">Status</span>
              <span className="text-xs px-2.5 py-1 rounded-full bg-[#8A93A6]/15 text-[#8A93A6] font-medium">Pending</span>
            </div>
          </div>

          {/* Email notification notice */}
          {emailProvided && (
            <div className="flex items-start gap-2.5 bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 mb-6 text-left">
              <Mail className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-blue-700">
                A confirmation with your reference code has been sent to your email address.
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="space-y-3">
            <button
              onClick={onTrack}
              className="w-full flex items-center justify-center gap-2 bg-[#2B3A67] text-white py-3.5 rounded-xl font-semibold hover:bg-[#1a2547] transition-colors"
            >
              <Search className="w-4 h-4" /> Track This Complaint
            </button>
            <button
              onClick={onDone}
              className="w-full flex items-center justify-center gap-2 bg-white border border-gray-200 text-[#6B7280] py-3.5 rounded-xl font-medium hover:bg-gray-50 transition-colors"
            >
              <Home className="w-4 h-4" /> Return to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
