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

    if (score <= 1) return { level: 1, label: 'WEAK', color: 'var(--status-danger)' };
    if (score === 2) return { level: 2, label: 'FAIR', color: 'var(--status-warning)' };
    if (score === 3) return { level: 3, label: 'STRONG', color: 'var(--status-success)' };
    return { level: 4, label: 'SECURE', color: 'var(--status-success)' };
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
    <div className="min-h-screen flex" style={{ background: 'var(--bg-primary)' }}>
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 relative overflow-hidden border-r" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-primary)' }}>
        {/* Brand */}
        <div className="flex items-center gap-4 z-10">
          <div className="w-12 h-12 border flex items-center justify-center" style={{ borderColor: 'var(--border-secondary)', background: 'var(--bg-primary)' }}>
            <svg className="w-6 h-6" style={{ color: 'var(--text-primary)' }} fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 2.18l7 3.12v4.7c0 4.67-3.13 9.04-7 10.2-3.87-1.16-7-5.53-7-10.2V6.3l7-3.12z"/>
              <path d="M12 7a2 2 0 00-2 2v2a2 2 0 001 1.73V15a1 1 0 002 0v-2.27A2 2 0 0014 11V9a2 2 0 00-2-2z"/>
            </svg>
          </div>
          <span className="text-2xl font-bold font-display" style={{ color: 'var(--text-primary)' }}>Privora</span>
        </div>

        {/* Tagline */}
        <div className="z-10 mt-16">
          <h1 className="text-5xl xl:text-7xl font-extrabold font-display leading-[1.05] tracking-tight" style={{ color: 'var(--text-primary)' }}>
            Your Data.
            <br />
            <span style={{ color: 'var(--text-secondary)' }}>Your Rights.</span>
            <br />
            <span style={{ color: 'var(--accent-gold)' }}>Protected.</span>
          </h1>
          <p className="text-lg font-sans max-w-md mt-8" style={{ color: 'var(--text-secondary)' }}>
            Join the elite network of security professionals using Privora
            Sentinel to monitor, encrypt, and authorize data access
            across distributed architectures.
          </p>
        </div>

        {/* Crystal Image */}
        <div className="z-10 mt-12 mb-auto">
          <div className="border border-[var(--border-secondary)] grayscale contrast-125 opacity-90 p-2" style={{ background: 'var(--bg-primary)' }}>
            <img
              src={registerCrystal}
              alt="Encryption crystal"
              className="w-full h-auto object-cover border border-[var(--border-primary)]"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="z-10 mt-8 pt-6 border-t" style={{ borderColor: 'var(--border-secondary)' }}>
          <p className="text-[10px] tracking-[0.2em] font-mono uppercase font-bold" style={{ color: 'var(--text-muted)' }}>
            © {new Date().getFullYear()} Privora. Sentinel Protocol v4.2
          </p>
        </div>
      </div>

      {/* Right Panel — Registration Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center p-8 md:p-12 lg:p-16 overflow-y-auto bg-[var(--bg-primary)]">
        <div className="max-w-md mx-auto w-full py-12">
          {/* Header */}
          <div className="mb-10 animate-fade-in-up">
            <h2 className="text-3xl font-bold font-display mb-3" style={{ color: 'var(--text-primary)' }}>Establish Identity</h2>
            <p className="font-sans" style={{ color: 'var(--text-secondary)' }}>Enter credentials to generate your cryptographic profile.</p>
          </div>

          {/* General Error */}
          {(errors.general || errors.detail || errors.non_field_errors) && (
            <div className="mb-6 p-4 border font-mono text-xs uppercase tracking-wider" style={{ background: 'var(--bg-card)', borderColor: 'var(--status-danger)', color: 'var(--status-danger)' }}>
              {errors.general || errors.detail || errors.non_field_errors}
            </div>
          )}

          {/* Full Name */}
          <div className="mb-6">
            <label className="block text-[10px] tracking-[0.2em] font-mono uppercase font-bold mb-2" style={{ color: 'var(--text-muted)' }}>
              Full Name
            </label>
            <div className={`bg-[var(--bg-input)] border ${errors.full_name ? 'border-[var(--status-danger)]' : 'border-[var(--border-secondary)]'} p-4 transition-colors focus-within:border-[var(--accent-gold)]`}>
              <input
                id="register-fullname"
                type="text"
                placeholder="Operative Name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full bg-transparent font-mono text-sm outline-none"
                style={{ color: 'var(--text-primary)' }}
              />
            </div>
            {errors.full_name && <p className="mt-2 text-[10px] tracking-widest font-mono uppercase" style={{ color: 'var(--status-danger)' }}>{errors.full_name}</p>}
          </div>

          {/* Email */}
          <div className="mb-6">
            <label className="block text-[10px] tracking-[0.2em] font-mono uppercase font-bold mb-2" style={{ color: 'var(--text-muted)' }}>
              Network Address
            </label>
            <div className={`bg-[var(--bg-input)] border ${errors.email ? 'border-[var(--status-danger)]' : 'border-[var(--border-secondary)]'} p-4 transition-colors focus-within:border-[var(--accent-gold)]`}>
              <input
                id="register-email"
                type="email"
                placeholder="j.doe@sentinel.io"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full bg-transparent font-mono text-sm outline-none"
                style={{ color: 'var(--text-primary)' }}
              />
            </div>
            {errors.email && <p className="mt-2 text-[10px] tracking-widest font-mono uppercase" style={{ color: 'var(--status-danger)' }}>{errors.email}</p>}
          </div>

          {/* Password + Confirm Row */}
          <div className="flex flex-col sm:flex-row gap-6 mb-3">
            <div className="flex-1">
              <label className="block text-[10px] tracking-[0.2em] font-mono uppercase font-bold mb-2" style={{ color: 'var(--text-muted)' }}>
                Master Key
              </label>
              <div className={`bg-[var(--bg-input)] border ${errors.password ? 'border-[var(--status-danger)]' : 'border-[var(--border-secondary)]'} p-4 transition-colors focus-within:border-[var(--accent-gold)]`}>
                <input
                  id="register-password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="w-full bg-transparent font-mono text-sm outline-none"
                  style={{ color: 'var(--text-primary)' }}
                />
              </div>
              {errors.password && <p className="mt-2 text-[10px] tracking-widest font-mono uppercase" style={{ color: 'var(--status-danger)' }}>{errors.password}</p>}
            </div>
            <div className="flex-1">
              <label className="block text-[10px] tracking-[0.2em] font-mono uppercase font-bold mb-2" style={{ color: 'var(--text-muted)' }}>
                Verify Key
              </label>
              <div className={`bg-[var(--bg-input)] border ${errors.password2 ? 'border-[var(--status-danger)]' : 'border-[var(--border-secondary)]'} p-4 transition-colors focus-within:border-[var(--accent-gold)]`}>
                <input
                  id="register-password2"
                  type="password"
                  placeholder="••••••••"
                  value={password2}
                  onChange={(e) => setPassword2(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="w-full bg-transparent font-mono text-sm outline-none"
                  style={{ color: 'var(--text-primary)' }}
                />
              </div>
              {errors.password2 && <p className="mt-2 text-[10px] tracking-widest font-mono uppercase" style={{ color: 'var(--status-danger)' }}>{errors.password2}</p>}
            </div>
          </div>

          {/* Password Strength Indicator */}
          <div className="mb-8 min-h-[32px]">
            {password && (
              <>
                <div className="flex gap-2 mb-2">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="h-1 flex-1 transition-colors"
                      style={{ background: i <= strength.level ? strength.color : 'var(--border-secondary)' }}
                    />
                  ))}
                </div>
                <p className="text-[10px] tracking-[0.2em] uppercase font-bold font-mono text-center" style={{ color: strength.color }}>
                  {strength.label}
                </p>
              </>
            )}
          </div>

          {/* Terms Checkbox */}
          <div className="flex items-start gap-4 mb-8">
            <div
              className={`w-5 h-5 border flex items-center justify-center shrink-0 cursor-pointer transition-colors mt-0.5 ${agree ? '' : 'bg-[var(--bg-input)]'}`}
              style={{ borderColor: agree ? 'var(--text-primary)' : 'var(--border-secondary)', background: agree ? 'var(--text-primary)' : 'var(--bg-input)' }}
              onClick={() => setAgree(!agree)}
              role="checkbox"
              tabIndex={0}
              id="terms-checkbox"
            >
              {agree && (
                <svg className="w-4 h-4" style={{ color: 'var(--bg-primary)' }} fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                  <path strokeLinecap="square" strokeLinejoin="miter" d="M5 13l4 4L19 7"/>
                </svg>
              )}
            </div>
            <span className="text-xs font-mono uppercase tracking-wider cursor-pointer leading-relaxed" style={{ color: 'var(--text-secondary)' }} onClick={() => setAgree(!agree)}>
              I acknowledge the{' '}
              <span className="font-bold underline underline-offset-4 decoration-2" style={{ color: 'var(--text-primary)' }}>Service Protocols</span>
              {' '}and{' '}
              <span className="font-bold underline underline-offset-4 decoration-2" style={{ color: 'var(--text-primary)' }}>Encryption Policy</span>.
            </span>
          </div>
          {errors.agree && <p className="-mt-6 mb-6 text-[10px] tracking-widest font-mono uppercase" style={{ color: 'var(--status-danger)' }}>{errors.agree}</p>}

          {/* Register Button */}
          <div
            className={`w-full py-4 border text-center cursor-pointer select-none transition-colors font-sans font-bold uppercase tracking-widest ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            style={{
              background: 'var(--text-primary)',
              borderColor: 'var(--text-primary)',
              color: 'var(--bg-primary)',
            }}
            onMouseEnter={(e) => { if (!loading) e.currentTarget.style.opacity = '0.9'; }}
            onMouseLeave={(e) => { if (!loading) e.currentTarget.style.opacity = '1'; }}
            onClick={loading ? undefined : handleRegister}
            role="button"
            tabIndex={0}
            id="register-submit-btn"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-3">
                <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                GENERATING PROFILE...
              </span>
            ) : (
              <span>INITIALIZE PROFILE</span>
            )}
          </div>

          {/* Login Link */}
          <p className="text-center text-xs font-mono uppercase tracking-wider mt-8" style={{ color: 'var(--text-secondary)' }}>
            EXISTING OPERATIVE?{' '}
            <Link to="/login" className="font-bold underline underline-offset-4 decoration-2" style={{ color: 'var(--text-primary)' }}>
              AUTHENTICATE
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
