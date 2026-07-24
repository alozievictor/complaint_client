import { useState, useRef, type FormEvent } from 'react';
import { ArrowLeft, Paperclip, X, AlertCircle, User, Mail, EyeOff, GraduationCap } from 'lucide-react';
import type { Category, ComplaintFormPayload } from '../types';

const CATEGORY_LABELS: Record<Category, string> = {
  academic: 'Academic / Lecturer',
  finance: 'Tuition & Fees',
  hostel: 'Hostel & Facilities',
  ict: 'ICT / Portal Issues',
  general: 'General / Other',
};

interface Props {
  category: Category;
  onSubmit: (data: ComplaintFormPayload) => Promise<void>;
  onBack: () => void;
}

export function ComplaintForm({ category, onSubmit, onBack }: Props) {
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [notifEmail, setNotifEmail] = useState('');
  const [attachment, setAttachment] = useState<File | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!subject.trim()) e.subject = 'Please enter a subject for your complaint';
    if (!description.trim()) e.description = 'Please describe your complaint';
    else if (description.trim().length < 20) e.description = 'Please provide at least 20 characters of detail';
    if (!isAnonymous) {
      if (!name.trim()) e.name = 'Your name is required';
      if (!email.trim()) e.email = 'Your email is required';
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = 'Please enter a valid email address';
    } else {
      if (notifEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(notifEmail)) e.notifEmail = 'Please enter a valid email address';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      await onSubmit({
        category,
        subject: subject.trim(),
        description: description.trim(),
        isAnonymous,
        realName: isAnonymous ? '' : name.trim(),
        realEmail: isAnonymous ? notifEmail.trim() : email.trim(),
        attachment,
      });
    } catch {
      setErrors({ submit: 'We could not submit your complaint. Please try again.' });
    } finally {
      setSubmitting(false);
    }
  };

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
            <div className="text-[11px] text-blue-200">Submit a Complaint</div>
          </div>
        </div>
      </header>

      <div className="flex-1 px-6 py-10 max-w-2xl mx-auto w-full">
        {/* Progress */}
        <div className="flex items-center gap-2 mb-10 text-sm">
          <div className="flex items-center gap-1.5">
            <div className="w-7 h-7 rounded-full bg-[#2E9E6B] text-white text-xs flex items-center justify-center">✓</div>
            <span className="text-[#2E9E6B] font-medium">Category</span>
          </div>
          <div className="flex-1 h-0.5 bg-[#2E9E6B] rounded" />
          <div className="flex items-center gap-1.5">
            <div className="w-7 h-7 rounded-full bg-[#2B3A67] text-white text-xs flex items-center justify-center font-semibold shadow">2</div>
            <span className="text-[#2B3A67] font-semibold">Details</span>
          </div>
          <div className="flex-1 h-0.5 bg-gray-200 rounded" />
          <div className="flex items-center gap-1.5 opacity-40">
            <div className="w-7 h-7 rounded-full border-2 border-gray-300 text-gray-400 text-xs flex items-center justify-center">3</div>
            <span className="text-gray-400">Confirm</span>
          </div>
        </div>

        <div className="flex items-center gap-2 mb-6">
          <span className="inline-flex items-center gap-1.5 bg-[#2B3A67]/10 text-[#2B3A67] px-3 py-1.5 rounded-full text-sm font-medium border border-[#2B3A67]/15">
            {CATEGORY_LABELS[category]}
          </span>
        </div>

        <h2 className="text-2xl font-bold text-[#1E2233] mb-2">Tell us about your complaint</h2>
        <p className="text-[#6B7280] text-sm mb-8">Be as specific as possible — include dates, names, and any steps you've already taken.</p>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Subject */}
          <div>
            <label className="block text-sm font-medium text-[#1E2233] mb-1.5">
              Subject <span className="text-[#D0564A]">*</span>
            </label>
            <input
              type="text"
              value={subject}
              onChange={e => { setSubject(e.target.value); if (errors.subject) setErrors(p => ({ ...p, subject: '' })); }}
              placeholder="Brief title of your complaint"
              className={`w-full px-4 py-3 bg-white border rounded-xl text-[#1E2233] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2B3A67]/25 focus:border-[#2B3A67] transition-all ${errors.subject ? 'border-[#D0564A] bg-red-50/50' : 'border-gray-200'}`}
            />
            {errors.subject && (
              <p className="mt-1.5 text-[#D0564A] text-xs flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />{errors.subject}
              </p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-[#1E2233] mb-1.5">
              Description <span className="text-[#D0564A]">*</span>
            </label>
            <textarea
              value={description}
              onChange={e => { setDescription(e.target.value); if (errors.description) setErrors(p => ({ ...p, description: '' })); }}
              placeholder="Describe your complaint in detail. Include relevant dates, names, and any steps you've already taken to resolve this."
              rows={5}
              className={`w-full px-4 py-3 bg-white border rounded-xl text-[#1E2233] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2B3A67]/25 focus:border-[#2B3A67] transition-all resize-none ${errors.description ? 'border-[#D0564A] bg-red-50/50' : 'border-gray-200'}`}
            />
            <div className="flex justify-between mt-1">
              {errors.description ? (
                <p className="text-[#D0564A] text-xs flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />{errors.description}
                </p>
              ) : <span />}
              <span className={`text-xs ${description.length >= 20 ? 'text-[#2E9E6B]' : 'text-gray-400'}`}>{description.length} chars</span>
            </div>
          </div>

          {/* Attachment */}
          <div>
            <label className="block text-sm font-medium text-[#1E2233] mb-1.5">
              Evidence / Attachment <span className="text-[#6B7280] font-normal text-xs">(Optional)</span>
            </label>
            <input
              ref={fileRef}
              type="file"
              accept="image/*,.pdf,.doc,.docx"
              className="hidden"
              onChange={e => setAttachment(e.target.files?.[0] || null)}
            />
            {attachment ? (
              <div className="flex items-center gap-3 bg-white border border-[#2B3A67]/20 rounded-xl px-4 py-3">
                <Paperclip className="w-4 h-4 text-[#2B3A67]" />
                <span className="text-sm text-[#1E2233] flex-1 truncate">{attachment.name}</span>
                <span className="text-xs text-[#6B7280]">{(attachment.size / 1024).toFixed(0)} KB</span>
                <button type="button" onClick={() => setAttachment(null)} className="text-gray-400 hover:text-[#D0564A] transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="w-full flex items-center gap-3 bg-white border border-dashed border-gray-300 rounded-xl px-4 py-3.5 text-sm text-[#6B7280] hover:border-[#2B3A67] hover:text-[#2B3A67] transition-colors"
              >
                <Paperclip className="w-4 h-4" />
                Click to attach evidence (image, PDF, or Word document)
              </button>
            )}
          </div>

          {/* Identity section */}
          <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
            <div className="p-5">
              <div className="flex items-start gap-4">
                {/* Custom toggle */}
                <button
                  type="button"
                  onClick={() => setIsAnonymous(v => !v)}
                  className={`relative w-11 h-6 rounded-full transition-colors flex-shrink-0 mt-0.5 ${isAnonymous ? 'bg-[#2B3A67]' : 'bg-gray-200'}`}
                  role="switch"
                  aria-checked={isAnonymous}
                >
                  <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${isAnonymous ? 'translate-x-5' : 'translate-x-1'}`} />
                </button>
                <div>
                  <div className="flex items-center gap-2">
                    <EyeOff className="w-4 h-4 text-[#2B3A67]" />
                    <span className="font-semibold text-[#1E2233]">Submit Anonymously</span>
                  </div>
                  <p className="text-sm text-[#6B7280] mt-0.5">
                    {isAnonymous
                      ? 'The admin will see a generated label instead of your name. You can still receive email updates.'
                      : 'Unchecked — your name and email will be visible to the reviewing admin.'}
                  </p>
                </div>
              </div>
            </div>

            {/* Conditional identity fields */}
            {!isAnonymous && (
              <div className="border-t border-gray-100 p-5 bg-[#F7F8FA]/70">
                <p className="text-xs text-[#6B7280] mb-4 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5" />
                  Your name and email will be visible to the admin reviewing this complaint.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[#1E2233] mb-1.5">
                      Full Name <span className="text-[#D0564A]">*</span>
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={e => { setName(e.target.value); if (errors.name) setErrors(p => ({ ...p, name: '' })); }}
                      placeholder="Your full name"
                      className={`w-full px-4 py-3 bg-white border rounded-xl text-[#1E2233] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2B3A67]/25 focus:border-[#2B3A67] transition-all ${errors.name ? 'border-[#D0564A]' : 'border-gray-200'}`}
                    />
                    {errors.name && (
                      <p className="mt-1 text-[#D0564A] text-xs flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />{errors.name}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#1E2233] mb-1.5">
                      Email Address <span className="text-[#D0564A]">*</span>
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={e => { setEmail(e.target.value); if (errors.email) setErrors(p => ({ ...p, email: '' })); }}
                      placeholder="your@email.com"
                      className={`w-full px-4 py-3 bg-white border rounded-xl text-[#1E2233] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2B3A67]/25 focus:border-[#2B3A67] transition-all ${errors.email ? 'border-[#D0564A]' : 'border-gray-200'}`}
                    />
                    {errors.email && (
                      <p className="mt-1 text-[#D0564A] text-xs flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />{errors.email}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {isAnonymous && (
              <div className="border-t border-gray-100 p-5 bg-[#F7F8FA]/70">
                <label className="block text-sm font-medium text-[#1E2233] mb-1">
                  <Mail className="w-3.5 h-3.5 inline mr-1" />
                  Notification Email <span className="text-[#6B7280] font-normal text-xs">(Optional)</span>
                </label>
                <input
                  type="email"
                  value={notifEmail}
                  onChange={e => { setNotifEmail(e.target.value); if (errors.notifEmail) setErrors(p => ({ ...p, notifEmail: '' })); }}
                  placeholder="your@email.com — never revealed to the admin"
                  className={`w-full px-4 py-3 bg-white border rounded-xl text-[#1E2233] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2B3A67]/25 focus:border-[#2B3A67] transition-all ${errors.notifEmail ? 'border-[#D0564A]' : 'border-gray-200'}`}
                />
                {errors.notifEmail && (
                  <p className="mt-1 text-[#D0564A] text-xs">{errors.notifEmail}</p>
                )}
                <p className="mt-1.5 text-xs text-[#6B7280]">
                  Used only to email you your reference code and status updates. This email is <strong>never</strong> shown to the admin.
                </p>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-[#F2A93B] text-[#1E2233] py-4 rounded-xl font-semibold text-lg hover:bg-[#e09830] transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 mt-2"
          >
            {submitting ? 'Submitting...' : 'Submit Complaint'}
          </button>

          {errors.submit && (
            <p className="text-sm text-[#D0564A] text-center">{errors.submit}</p>
          )}

          <p className="text-xs text-[#6B7280] text-center">
            By submitting, you confirm this complaint is genuine and made in good faith.
          </p>
        </form>
      </div>
    </div>
  );
}
