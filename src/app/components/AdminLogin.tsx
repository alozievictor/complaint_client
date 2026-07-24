import { useState, type FormEvent } from 'react';
import { ArrowLeft, Eye, EyeOff, Shield, AlertCircle, GraduationCap, ChevronDown, ChevronUp } from 'lucide-react';

interface Props {
  onLogin: (username: string, password: string) => Promise<boolean>;
  onBack: () => void;
}

const DEMO_CREDENTIALS = [
  { role: 'Academic Admin', username: 'academic', password: 'password123', color: 'bg-blue-50 text-blue-700' },
  { role: 'Hostel Admin', username: 'hostel', password: 'password123', color: 'bg-green-50 text-green-700' },
  { role: 'Finance Admin', username: 'finance', password: 'password123', color: 'bg-yellow-50 text-yellow-700' },
  { role: 'ICT Admin', username: 'ict', password: 'password123', color: 'bg-purple-50 text-purple-700' },
  { role: 'Super Admin', username: 'superadmin', password: 'admin12345', color: 'bg-red-50 text-red-700' },
];

export function AdminLogin({ onLogin, onBack }: Props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showDemo, setShowDemo] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    if (!username.trim() || !password.trim()) {
      setError('Please enter both username and password');
      return;
    }
    setLoading(true);
    try {
      const success = await onLogin(username.trim(), password);
      setLoading(false);
      if (!success) {
        setError('Invalid username or password. Please try again.');
      }
    } catch {
      setLoading(false);
      setError('Invalid username or password. Please try again.');
    }
  };

  const fillCredentials = (cred: typeof DEMO_CREDENTIALS[0]) => {
    setUsername(cred.username);
    setPassword(cred.password);
    setError('');
    setShowDemo(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F8FA]">
      <header className="bg-[#2B3A67] text-white px-6 py-4 flex items-center gap-3">
        <button onClick={onBack} className="p-2 hover:bg-white/10 rounded-lg transition-colors -ml-1">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-[#F2A93B] rounded-full flex items-center justify-center">
            <GraduationCap className="w-4 h-4 text-[#2B3A67]" />
          </div>
          <div>
            <div className="font-semibold text-sm">Lincoln College OCMS</div>
            <div className="text-[11px] text-blue-200">Staff Portal</div>
          </div>
        </div>
      </header>

      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          {/* Logo card */}
          <div className="bg-[#2B3A67] rounded-2xl p-8 text-center text-white mb-6 shadow-xl">
            <div className="w-16 h-16 bg-[#F2A93B] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Shield className="w-8 h-8 text-[#2B3A67]" />
            </div>
            <h2 className="text-xl font-bold mb-1">Admin Portal</h2>
            <p className="text-blue-200 text-sm">Lincoln College OCMS — Staff Login</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#1E2233] mb-1.5">Username or Email</label>
                <input
                  type="text"
                  value={username}
                  onChange={e => { setUsername(e.target.value); setError(''); }}
                  placeholder="Enter your username or email"
                  autoComplete="username"
                  className={`w-full px-4 py-3 bg-[#F7F8FA] border rounded-xl text-[#1E2233] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2B3A67]/25 focus:border-[#2B3A67] focus:bg-white transition-all ${error ? 'border-[#D0564A]' : 'border-gray-200'}`}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#1E2233] mb-1.5">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => { setPassword(e.target.value); setError(''); }}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    className={`w-full px-4 py-3 bg-[#F7F8FA] border rounded-xl text-[#1E2233] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2B3A67]/25 focus:border-[#2B3A67] focus:bg-white transition-all pr-12 ${error ? 'border-[#D0564A]' : 'border-gray-200'}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(v => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-2 text-[#D0564A] bg-red-50 border border-red-100 rounded-xl px-4 py-3">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span className="text-sm">{error}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#2B3A67] text-white py-3.5 rounded-xl font-semibold hover:bg-[#1a2547] transition-all disabled:opacity-60 shadow-lg hover:shadow-xl"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    Signing in...
                  </span>
                ) : 'Sign In'}
              </button>
            </form>

            {/* Demo credentials */}
            <div className="mt-5 border-t border-gray-100 pt-4">
              <button
                type="button"
                onClick={() => setShowDemo(v => !v)}
                className="w-full flex items-center justify-between text-sm text-[#6B7280] hover:text-[#2B3A67] transition-colors py-1"
              >
                <span className="font-medium">Demo Credentials</span>
                {showDemo ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              {showDemo && (
                <div className="mt-3 space-y-2">
                  {DEMO_CREDENTIALS.map(cred => (
                    <button
                      key={cred.username}
                      type="button"
                      onClick={() => fillCredentials(cred)}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-gray-50 border border-gray-100 text-left group transition-colors"
                    >
                      <div>
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${cred.color}`}>{cred.role}</span>
                        <div className="text-xs text-[#6B7280] mt-0.5 font-mono">{cred.username} / {cred.password}</div>
                      </div>
                      <span className="text-xs text-[#4A5C99] opacity-0 group-hover:opacity-100 transition-opacity">Use →</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
