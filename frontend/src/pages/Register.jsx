import { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import registerCrystal from '../assets/register-crystal.png';

export default function Register() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [agree, setAgree] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Password strength calculation
  const strength = useMemo(() => {
    if (!password) return { level: 0, label: '', color: '' };
    let score = 0;
    if (password.length >= 8) score++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[^a-zA-Z0-9]/.test(password)) score++;

    if (score <= 1) return { level: 1, label: 'WEAK', color: 'bg-red-500' };
    if (score === 2) return { level: 2, label: 'FAIR', color: 'bg-yellow-500' };
    if (score === 3) return { level: 3, label: 'STRONG', color: 'bg-emerald-400' };
    return { level: 4, label: 'STRONG', color: 'bg-emerald-400' };
  }, [password]);

  const handleRegister = async () => {
    setErrors({});

    // Client-side validation
    const newErrors = {};
    if (!fullName.trim()) newErrors.full_name = 'Full name is required';
    if (!email.trim()) newErrors.email = 'Email is required';
    if (!password) newErrors.password = 'Password is required';
    if (password && password.length < 8) newErrors.password = 'Must be at least 8 characters';
    if (password !== password2) newErrors.password2 = 'Passwords do not match';
    if (!agree) newErrors.agree = 'You must acknowledge the terms';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      await axiosInstance.post('/api/users/register/', {
        email,
        full_name: fullName,
        password,
        password2,
      });
      navigate('/login');
    } catch (err) {
      if (err.response?.data) {
        const data = err.response.data;
        if (typeof data === 'object') {
          const mapped = {};
          Object.keys(data).forEach((key) => {
            const val = data[key];
            mapped[key] = Array.isArray(val) ? val.join(' ') : val;
          });
          setErrors(mapped);
        } else {
          setErrors({ general: 'Registration failed. Please try again.' });
        }
      } else {
        setErrors({ general: 'Network error. Please check your connection.' });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleRegister();
  };

  return (
    <div className="min-h-screen flex bg-navy-950">
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-10 bg-navy-900 relative overflow-hidden">
        {/* Brand */}
        <div className="flex items-center gap-3 z-10">
          <div className="w-10 h-10 rounded-lg bg-accent-blue flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 2.18l7 3.12v4.7c0 4.67-3.13 9.04-7 10.2-3.87-1.16-7-5.53-7-10.2V6.3l7-3.12z"/>
              <path d="M12 7a2 2 0 00-2 2v2a2 2 0 001 1.73V15a1 1 0 002 0v-2.27A2 2 0 0014 11V9a2 2 0 00-2-2z"/>
            </svg>
          </div>
          <span className="text-white text-xl font-bold tracking-tight">Privora</span>
        </div>

        {/* Tagline */}
        <div className="z-10 mt-12">
          <h1 className="text-5xl xl:text-6xl font-extrabold leading-tight">
            <span className="text-white">Your Data.</span>
            <br />
            <span className="text-accent-blue">Your Rights.</span>
            <br />
            <span className="text-white">Protected.</span>
          </h1>
          <p className="text-slate-400 text-base leading-relaxed max-w-md mt-6">
            Join the elite network of security professionals using Privora
            Sentinel to monitor, encrypt, and authorize data access
            across distributed cloud architectures.
          </p>
        </div>

        {/* Crystal Image */}
        <div className="z-10 mt-8">
          <div className="rounded-xl overflow-hidden border border-navy-600/30 shadow-2xl">
            <img
              src={registerCrystal}
              alt="Encryption crystal"
              className="w-full h-auto object-cover opacity-85"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="z-10 mt-8">
          <p className="text-[10px] tracking-[0.15em] text-slate-500 uppercase">
            © 2024 Privora Cybersecurity. Sentinel Protocol v4.2
          </p>
        </div>

        {/* Background glow */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-accent-blue/5 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Right Panel — Registration Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center p-8 md:p-12 lg:p-16 overflow-y-auto">
        <div className="max-w-md mx-auto w-full">
          {/* Header */}
          <div className="mb-8 animate-fade-in-up">
            <h2 className="text-3xl font-bold text-white mb-2">Initialize Account</h2>
            <p className="text-slate-400">Enter your credentials to begin the onboarding process.</p>
          </div>

          {/* OAuth Buttons */}
          <div className="flex gap-3 mb-6 animate-fade-in-up-delay">
            <div
              className="flex-1 flex items-center justify-center gap-3 py-3.5 px-4 rounded-lg border border-navy-500 bg-navy-800/50 text-slate-300 cursor-pointer hover:bg-navy-700/50 hover:border-navy-400 transition-all duration-200 select-none"
              onClick={() => {}}
              role="button"
              tabIndex={0}
              id="register-google-btn"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span className="font-medium text-sm">Google</span>
            </div>
            <div
              className="flex-1 flex items-center justify-center gap-3 py-3.5 px-4 rounded-lg border border-navy-500 bg-navy-800/50 text-slate-300 cursor-pointer hover:bg-navy-700/50 hover:border-navy-400 transition-all duration-200 select-none"
              onClick={() => {}}
              role="button"
              tabIndex={0}
              id="register-github-btn"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
              </svg>
              <span className="font-medium text-sm">GitHub</span>
            </div>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 h-px bg-navy-600" />
            <span className="text-[10px] tracking-[0.2em] text-slate-500 uppercase font-semibold">Or Configure Manually</span>
            <div className="flex-1 h-px bg-navy-600" />
          </div>

          {/* General Error */}
          {(errors.general || errors.detail || errors.non_field_errors) && (
            <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
              {errors.general || errors.detail || errors.non_field_errors}
            </div>
          )}

          {/* Full Name */}
          <div className="mb-4">
            <label className="block text-[11px] tracking-[0.15em] text-slate-400 uppercase font-semibold mb-2">
              Full Name
            </label>
            <div className={`bg-navy-800/60 border ${errors.full_name ? 'border-red-500/50' : 'border-navy-600'} rounded-lg px-4 py-3 transition-all duration-200 focus-within:border-accent-blue focus-within:ring-1 focus-within:ring-accent-blue/30`}>
              <input
                id="register-fullname"
                type="text"
                placeholder="Johnathan Doe"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full bg-transparent text-white placeholder-slate-600 text-sm outline-none"
              />
            </div>
            {errors.full_name && <p className="mt-1.5 text-xs text-red-400">{errors.full_name}</p>}
          </div>

          {/* Email */}
          <div className="mb-4">
            <label className="block text-[11px] tracking-[0.15em] text-slate-400 uppercase font-semibold mb-2">
              Email Address
            </label>
            <div className={`bg-navy-800/60 border ${errors.email ? 'border-red-500/50' : 'border-navy-600'} rounded-lg px-4 py-3 transition-all duration-200 focus-within:border-accent-blue focus-within:ring-1 focus-within:ring-accent-blue/30`}>
              <input
                id="register-email"
                type="email"
                placeholder="j.doe@sentinel.io"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full bg-transparent text-white placeholder-slate-600 text-sm outline-none"
              />
            </div>
            {errors.email && <p className="mt-1.5 text-xs text-red-400">{errors.email}</p>}
          </div>

          {/* Password + Confirm Row */}
          <div className="flex gap-3 mb-2">
            <div className="flex-1">
              <label className="block text-[11px] tracking-[0.15em] text-slate-400 uppercase font-semibold mb-2">
                Password
              </label>
              <div className={`bg-navy-800/60 border ${errors.password ? 'border-red-500/50' : 'border-navy-600'} rounded-lg px-4 py-3 transition-all duration-200 focus-within:border-accent-blue focus-within:ring-1 focus-within:ring-accent-blue/30`}>
                <input
                  id="register-password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="w-full bg-transparent text-white placeholder-slate-600 text-sm outline-none"
                />
              </div>
              {errors.password && <p className="mt-1.5 text-xs text-red-400">{errors.password}</p>}
            </div>
            <div className="flex-1">
              <label className="block text-[11px] tracking-[0.15em] text-slate-400 uppercase font-semibold mb-2">
                Confirm
              </label>
              <div className={`bg-navy-800/60 border ${errors.password2 ? 'border-red-500/50' : 'border-navy-600'} rounded-lg px-4 py-3 transition-all duration-200 focus-within:border-accent-blue focus-within:ring-1 focus-within:ring-accent-blue/30`}>
                <input
                  id="register-password2"
                  type="password"
                  placeholder="••••••••"
                  value={password2}
                  onChange={(e) => setPassword2(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="w-full bg-transparent text-white placeholder-slate-600 text-sm outline-none"
                />
              </div>
              {errors.password2 && <p className="mt-1.5 text-xs text-red-400">{errors.password2}</p>}
            </div>
          </div>

          {/* Password Strength Indicator */}
          {password && (
            <div className="mb-5">
              <div className="flex gap-1.5 mb-1.5">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                      i <= strength.level ? strength.color : 'bg-navy-600'
                    }`}
                  />
                ))}
              </div>
              <p className={`text-[10px] tracking-[0.15em] uppercase font-semibold text-center ${
                strength.level <= 1 ? 'text-red-500' : strength.level === 2 ? 'text-yellow-500' : 'text-emerald-400'
              }`}>
                {strength.label}
              </p>
            </div>
          )}

          {/* Terms Checkbox */}
          <div className="flex items-start gap-3 mb-6">
            <div
              className={`w-4 h-4 mt-0.5 rounded border shrink-0 ${agree ? 'bg-accent-blue border-accent-blue' : 'border-navy-500 bg-navy-800/50'} flex items-center justify-center cursor-pointer transition-all duration-200`}
              onClick={() => setAgree(!agree)}
              role="checkbox"
              tabIndex={0}
              id="terms-checkbox"
            >
              {agree && (
                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7"/>
                </svg>
              )}
            </div>
            <span className="text-sm text-slate-400 select-none cursor-pointer leading-snug" onClick={() => setAgree(!agree)}>
              I acknowledge the{' '}
              <span className="text-white underline underline-offset-2">Service Protocols</span>
              {' '}and the{' '}
              <span className="text-white underline underline-offset-2">Privacy Encryption Policy</span>.
            </span>
          </div>
          {errors.agree && <p className="-mt-4 mb-4 text-xs text-red-400">{errors.agree}</p>}

          {/* Register Button */}
          <div
            className={`w-full py-4 rounded-xl font-semibold text-white text-center cursor-pointer select-none transition-all duration-300 ${
              loading
                ? 'bg-accent-blue/60 cursor-not-allowed'
                : 'bg-accent-blue hover:bg-accent-glow hover:shadow-lg hover:shadow-accent-blue/25 active:scale-[0.98]'
            }`}
            onClick={loading ? undefined : handleRegister}
            role="button"
            tabIndex={0}
            id="register-submit-btn"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Creating Account...
              </span>
            ) : (
              <span>Create My Account</span>
            )}
          </div>

          {/* Login Link */}
          <p className="text-center text-sm text-slate-400 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-white font-semibold hover:text-accent-light transition-colors underline underline-offset-2">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
