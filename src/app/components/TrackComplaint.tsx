import { useState, type FormEvent, type ChangeEvent } from 'react';
import { ArrowLeft, Search, AlertCircle, GraduationCap } from 'lucide-react';

interface Props {
  onTrack: (code: string) => Promise<boolean>;
  onBack: () => void;
}

export function TrackComplaint({ onTrack, onBack }: Props) {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    if (!code.trim()) {
      setError('Please enter your reference code');
      return;
    }
    setLoading(true);
    try {
      const found = await onTrack(code.trim());
      setLoading(false);
      if (!found) {
        setError('No complaint found with that reference code. Please check and try again.');
      }
    } catch {
      setLoading(false);
      setError('No complaint found with that reference code. Please check and try again.');
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.toUpperCase().replace(/[^A-Z0-9-]/g, '');
    setCode(val);
    if (error) setError('');
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
            <div className="text-[11px] text-blue-200">Track a Complaint</div>
          </div>
        </div>
      </header>

      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="max-w-md w-full">
          <div className="text-center mb-10">
            <div className="w-16 h-16 bg-[#2B3A67]/8 rounded-2xl flex items-center justify-center mx-auto mb-5">
              <Search className="w-8 h-8 text-[#2B3A67]" />
            </div>
            <h2 className="text-2xl font-bold text-[#1E2233] mb-2">Track Your Complaint</h2>
            <p className="text-[#6B7280] text-sm leading-relaxed">
              Enter the reference code you received when you submitted your complaint. It looks like <strong>LC-2026-0483</strong>.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#1E2233] mb-2">Reference Code</label>
              <input
                type="text"
                value={code}
                onChange={handleChange}
                placeholder="e.g. LC-2026-0483"
                maxLength={15}
                className={`w-full px-5 py-4 bg-white border-2 rounded-2xl text-[#1E2233] text-center text-xl font-mono tracking-widest placeholder:text-gray-300 placeholder:font-normal placeholder:tracking-normal focus:outline-none focus:ring-2 focus:ring-[#2B3A67]/20 transition-all ${
                  error ? 'border-[#D0564A] bg-red-50/50' : 'border-gray-200 focus:border-[#2B3A67]'
                }`}
                autoFocus
              />
              {error && (
                <div className="mt-3 flex items-start gap-2 text-[#D0564A] bg-red-50 border border-red-100 rounded-xl px-4 py-3">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span className="text-sm">{error}</span>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2.5 bg-[#2B3A67] text-white py-4 rounded-xl font-semibold text-base hover:bg-[#1a2547] transition-all disabled:opacity-60 disabled:cursor-not-allowed shadow-lg"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Searching...
                </span>
              ) : (
                <>
                  <Search className="w-4 h-4" /> Track Complaint
                </>
              )}
            </button>
          </form>

          <div className="mt-8 bg-white border border-gray-100 rounded-xl p-5">
            <p className="text-sm font-semibold text-[#1E2233] mb-2">Demo Reference Codes</p>
            <p className="text-xs text-[#6B7280] mb-3">Try these pre-loaded complaints to explore the system:</p>
            <div className="grid grid-cols-2 gap-2">
              {['LC-2026-0001', 'LC-2026-0002', 'LC-2026-0003', 'LC-2026-0004'].map(demoCode => (
                <button
                  key={demoCode}
                  type="button"
                  onClick={() => setCode(demoCode)}
                  className="text-left px-3 py-2 bg-[#F7F8FA] hover:bg-[#2B3A67]/8 border border-gray-200 hover:border-[#2B3A67]/20 rounded-lg text-xs font-mono text-[#2B3A67] transition-colors"
                >
                  {demoCode}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
