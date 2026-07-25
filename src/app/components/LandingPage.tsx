import { GraduationCap, Search, Shield, BookOpen, Building2, CreditCard, Monitor, MessageSquare, CheckCircle2 } from 'lucide-react';

interface Props {
  onDropComplaint: () => void;
  onTrackComplaint: () => void;
  onAdminLogin: () => void;
}

export function LandingPage({ onDropComplaint, onTrackComplaint, onAdminLogin }: Props) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Nav */}
      <header className="bg-[#2B3A67] text-white px-6 py-4 flex items-center justify-between sticky top-0 z-50 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#F2A93B] rounded-full flex items-center justify-center flex-shrink-0">
            <GraduationCap className="w-6 h-6 text-[#2B3A67]" />
          </div>
          <div>
            <div className="font-bold text-base leading-tight">Lincoln College</div>
            <div className="text-[11px] text-blue-200 leading-tight">Online Complaints Management System</div>
          </div>
        </div>
        <button
          onClick={onAdminLogin}
          className="text-sm text-blue-200 hover:text-white transition-colors flex items-center gap-1.5 border border-white/20 px-3 py-1.5 rounded-lg hover:bg-white/10"
        >
          <Shield className="w-3.5 h-3.5" /> Admin Login
        </button>
      </header>

      {/* Hero */}
      <section className="bg-[#2B3A67] text-white px-6 pb-20 pt-16 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#2B3A67] to-[#1a2547] pointer-events-none" />
        <div className="relative z-10 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-white/10 text-blue-200 text-sm px-4 py-1.5 rounded-full mb-6 border border-white/10">
            <Shield className="w-3.5 h-3.5" /> Safe · Transparent · Accountable
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 leading-tight">
            Your Voice, <span className="text-[#F2A93B]">Heard</span> & Resolved
          </h1>
          <p className="text-blue-200 text-lg max-w-xl mx-auto mb-10">
            Submit complaints safely and track their resolution — no account or registration needed.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={onDropComplaint}
              className="bg-[#F2A93B] text-[#1E2233] px-8 py-4 rounded-xl font-semibold text-lg hover:bg-[#e09830] transition-all flex items-center justify-center gap-2 shadow-xl hover:shadow-2xl hover:-translate-y-0.5"
            >
              <MessageSquare className="w-5 h-5" /> Drop a Complaint
            </button>
            <button
              onClick={onTrackComplaint}
              className="bg-white/10 border border-white/25 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white/20 transition-all flex items-center justify-center gap-2"
            >
              <Search className="w-5 h-5" /> Track a Complaint
            </button>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="px-6 py-16 max-w-4xl mx-auto w-full">
        <h2 className="text-2xl font-bold text-[#1E2233] text-center mb-2">How It Works</h2>
        <p className="text-[#6B7280] text-center mb-10">Three simple steps from submission to resolution</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              step: '01',
              title: 'Submit',
              desc: 'Fill a short form, select a category. Choose to include your name or submit anonymously — your decision, per complaint.',
              icon: MessageSquare,
            },
            {
              step: '02',
              title: 'Track',
              desc: 'Receive a private tracking code that you can use anytime to check your complaint status.',
              icon: Search,
            },
            {
              step: '03',
              title: 'Resolve',
              desc: 'The right department reviews your complaint and responds. You see their resolution note as soon as it is posted.',
              icon: CheckCircle2,
            },
          ].map(({ step, title, desc, icon: Icon }) => (
            <div key={step} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 relative">
              <div className="absolute -top-3 left-6 bg-[#2B3A67] text-white text-xs font-bold px-3 py-1 rounded-full">
                Step {step}
              </div>
              <div className="w-12 h-12 bg-[#2B3A67]/8 rounded-xl flex items-center justify-center mb-4 mt-2">
                <Icon className="w-6 h-6 text-[#2B3A67]" />
              </div>
              <h3 className="font-semibold text-[#1E2233] mb-2">{title}</h3>
              <p className="text-[#6B7280] text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="bg-white px-6 py-14">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-[#1E2233] text-center mb-2">Complaint Categories</h2>
          <p className="text-[#6B7280] text-center mb-8">Your complaint is routed to the specialist department for faster resolution</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {[
              { label: 'Academic', sub: 'Grades, lecturers', icon: BookOpen },
              { label: 'Tuition & Fees', sub: 'Billing, payments', icon: CreditCard },
              { label: 'Hostel & Facilities', sub: 'Accommodation', icon: Building2 },
              { label: 'ICT / Portal', sub: 'Systems, access', icon: Monitor },
              { label: 'General', sub: 'Other issues', icon: MessageSquare },
            ].map(({ label, sub, icon: Icon }) => (
              <button
                key={label}
                onClick={onDropComplaint}
                className="flex flex-col items-center gap-2.5 p-4 rounded-xl border border-gray-100 hover:border-[#2B3A67] hover:shadow-md transition-all group bg-[#F7F8FA] hover:bg-white"
              >
                <div className="w-11 h-11 rounded-xl flex items-center justify-center bg-[#2B3A67]/8 group-hover:bg-[#2B3A67]/15 transition-colors">
                  <Icon className="w-5 h-5 text-[#2B3A67]" />
                </div>
                <div className="text-center">
                  <div className="text-sm font-semibold text-[#1E2233]">{label}</div>
                  <div className="text-xs text-[#6B7280]">{sub}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Privacy note */}
      <section className="px-6 py-14 bg-[#F7F8FA]">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white border border-[#2B3A67]/12 rounded-2xl p-8 text-center shadow-sm">
            <div className="w-14 h-14 bg-[#2B3A67]/8 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-7 h-7 text-[#2B3A67]" />
            </div>
            <h3 className="font-bold text-[#1E2233] text-xl mb-3">Your Privacy is Protected</h3>
            <p className="text-[#6B7280] leading-relaxed">
              You decide, <strong>per complaint</strong>, whether to identify yourself or submit anonymously. Anonymous submissions show only a generated placeholder — like <strong>Anonymous234</strong> — to the reviewing admin. Your real identity is never revealed without your consent.
            </p>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="bg-[#2B3A67] px-6 py-10">
        <div className="max-w-3xl mx-auto grid grid-cols-3 gap-6 text-center text-white">
          {[
            { value: '8', label: 'Complaints Submitted' },
            { value: '3', label: 'Resolved This Month' },
            { value: '5', label: 'Categories Covered' },
          ].map(({ value, label }) => (
            <div key={label}>
              <div className="text-3xl font-bold text-[#F2A93B]">{value}</div>
              <div className="text-blue-200 text-sm mt-1">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1E2233] text-white/50 px-6 py-6 text-center text-sm mt-auto">
        <p>© 2026 Lincoln College · Online Complaints Management System</p>
        <p className="mt-1 text-white/30 text-xs">A Final Year Project — Built for transparency and student welfare</p>
      </footer>
    </div>
  );
}
