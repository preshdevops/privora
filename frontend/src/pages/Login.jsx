import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import loginGlobe from '../assets/login-globe.png';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async () => {
    setErrors({});
    if (!email.trim()) {
      setErrors({ email: 'Email is required' });
      return;
    }
    if (!password) {
      setErrors({ password: 'Password is required' });
      return;
    }

    setLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      if (err.response?.data) {
        const data = err.response.data;
        // Handle Django REST framework error formats
        if (typeof data === 'object') {
          const mapped = {};
          Object.keys(data).forEach((key) => {
            const val = data[key];
            mapped[key] = Array.isArray(val) ? val.join(' ') : val;
          });
          setErrors(mapped);
        } else {
          setErrors({ general: 'Invalid credentials. Please try again.' });
        }
      } else {
        setErrors({ general: 'Network error. Please check your connection.' });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleLogin();
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

        {/* Globe Image */}
        <div className="my-8 z-10">
          <div className="border border-[var(--border-secondary)] grayscale contrast-125 opacity-90 p-2" style={{ background: 'var(--bg-primary)' }}>
            <img
              src={loginGlobe}
              alt="Global surveillance network"
              className="w-full h-auto object-cover border border-[var(--border-primary)]"
            />
          </div>
        </div>

        {/* Tagline */}
        <div className="z-10">
          <h1 className="text-5xl xl:text-6xl font-display font-bold leading-[1.1] mb-6" style={{ color: 'var(--text-primary)' }}>
            Architecting the
            <br />
            future of
            <br />
            <span style={{ color: 'var(--accent-gold)' }}>Digital Trust.</span>
          </h1>
          <p className="text-lg font-sans max-w-md" style={{ color: 'var(--text-secondary)' }}>
            Join the elite ranks of secured enterprises. Privora provides
            high-fidelity sentinel monitoring and cryptographic integrity
            for your most sensitive assets.
          </p>
        </div>

        {/* Footer */}
        <div className="flex items-center gap-12 mt-12 z-10 pt-6 border-t" style={{ borderColor: 'var(--border-secondary)' }}>
          <div>
            <p className="text-[10px] tracking-[0.2em] font-mono uppercase font-bold mb-2" style={{ color: 'var(--text-muted)' }}>Status</p>
            <p className="text-xs font-mono tracking-widest uppercase flex items-center gap-3" style={{ color: 'var(--status-success)' }}>
              <span className="w-2 h-2 rounded-none bg-[var(--status-success)] inline-block" />
              Operational
            </p>
          </div>
          <div>
            <p className="text-[10px] tracking-[0.2em] font-mono uppercase font-bold mb-2" style={{ color: 'var(--text-muted)' }}>Encryption</p>
            <p className="text-xs font-mono tracking-widest uppercase" style={{ color: 'var(--text-primary)' }}>AES-256 GCM</p>
          </div>
        </div>
      </div>

      {/* Right Panel — Login Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-between p-8 md:p-12 lg:p-16 bg-[var(--bg-primary)]">
        <div className="max-w-md mx-auto w-full flex-1 flex flex-col justify-center">
          {/* Header */}
          <div className="mb-10 animate-fade-in-up">
            <h2 className="text-3xl font-bold font-display mb-3" style={{ color: 'var(--text-primary)' }}>Access Vault</h2>
            <p className="font-sans" style={{ color: 'var(--text-secondary)' }}>Cryptographic authentication required.</p>
          </div>

          {/* General Error */}
          {(errors.general || errors.detail || errors.non_field_errors) && (
            <div className="mb-6 p-4 border font-mono text-xs uppercase tracking-wider" style={{ background: 'var(--bg-card)', borderColor: 'var(--status-danger)', color: 'var(--status-danger)' }}>
              {errors.general || errors.detail || errors.non_field_errors}
            </div>
          )}

          {/* Email Field */}
          <div className="mb-6">
            <label className="block text-[10px] tracking-[0.2em] font-mono uppercase font-bold mb-2" style={{ color: 'var(--text-muted)' }}>
              Identity (Email)
            </label>
            <div className={`flex items-center gap-4 bg-[var(--bg-input)] border ${errors.email ? 'border-[var(--status-danger)]' : 'border-[var(--border-secondary)]'} p-4 transition-colors focus-within:border-[var(--accent-gold)]`}>
              <svg className="w-5 h-5 shrink-0" style={{ color: 'var(--text-muted)' }} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="square" strokeLinejoin="miter" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
              </svg>
              <input
                id="login-email"
                type="email"
                placeholder="operative@sentinel.io"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1 bg-transparent font-mono text-sm outline-none"
                style={{ color: 'var(--text-primary)' }}
              />
            </div>
            {errors.email && <p className="mt-2 text-[10px] tracking-widest font-mono uppercase" style={{ color: 'var(--status-danger)' }}>{errors.email}</p>}
          </div>

          {/* Password Field */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <label className="text-[10px] tracking-[0.2em] font-mono uppercase font-bold" style={{ color: 'var(--text-muted)' }}>
                Passphrase
              </label>
              <span className="text-[10px] tracking-[0.2em] font-mono uppercase font-bold cursor-pointer transition-colors" style={{ color: 'var(--text-secondary)' }} onMouseEnter={(e) => e.currentTarget.style.color = 'var(--text-primary)'} onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}>
                Reset Key
              </span>
            </div>
            <div className={`flex items-center gap-4 bg-[var(--bg-input)] border ${errors.password ? 'border-[var(--status-danger)]' : 'border-[var(--border-secondary)]'} p-4 transition-colors focus-within:border-[var(--accent-gold)]`}>
              <svg className="w-5 h-5 shrink-0" style={{ color: 'var(--text-muted)' }} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="square" strokeLinejoin="miter" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
              </svg>
              <input
                id="login-password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1 bg-transparent font-mono text-sm outline-none"
                style={{ color: 'var(--text-primary)' }}
              />
            </div>
            {errors.password && <p className="mt-2 text-[10px] tracking-widest font-mono uppercase" style={{ color: 'var(--status-danger)' }}>{errors.password}</p>}
          </div>

          {/* Remember Checkbox */}
          <div className="flex items-center gap-4 mb-8">
            <div
              className={`w-5 h-5 border flex items-center justify-center cursor-pointer transition-colors ${remember ? '' : 'bg-[var(--bg-input)]'}`}
              style={{ borderColor: remember ? 'var(--text-primary)' : 'var(--border-secondary)', background: remember ? 'var(--text-primary)' : 'var(--bg-input)' }}
              onClick={() => setRemember(!remember)}
              role="checkbox"
              tabIndex={0}
              id="remember-checkbox"
            >
              {remember && (
                <svg className="w-4 h-4" style={{ color: 'var(--bg-primary)' }} fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                  <path strokeLinecap="square" strokeLinejoin="miter" d="M5 13l4 4L19 7"/>
                </svg>
              )}
            </div>
            <span className="text-xs font-mono uppercase tracking-wider cursor-pointer select-none" style={{ color: 'var(--text-secondary)' }} onClick={() => setRemember(!remember)}>
              Persist Session
            </span>
          </div>

          {/* Login Button */}
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
            onClick={loading ? undefined : handleLogin}
            role="button"
            tabIndex={0}
            id="login-submit-btn"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-3">
                <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                AUTHENTICATING...
              </span>
            ) : (
              <span>INITIALIZE LINK</span>
            )}
          </div>

          {/* Register Link */}
          <p className="text-center text-xs font-mono uppercase tracking-wider mt-8" style={{ color: 'var(--text-secondary)' }}>
            UNAUTHORIZED?{' '}
            <Link to="/register" className="font-bold underline underline-offset-4 decoration-2" style={{ color: 'var(--text-primary)' }}>
              REQUEST ACCESS
            </Link>
          </p>
        </div>

        {/* Bottom Footer */}
        <div className="flex items-center justify-between mt-12 pt-6 border-t" style={{ borderColor: 'var(--border-secondary)' }}>
          <div className="hidden md:flex items-center gap-6" />
          <div className="flex items-center gap-8">
            <span className="text-[9px] font-bold font-mono tracking-[0.2em] uppercase cursor-pointer transition-colors" style={{ color: 'var(--text-muted)' }} onMouseEnter={(e) => e.currentTarget.style.color = 'var(--text-primary)'} onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}>PROTOCOLS</span>
            <span className="text-[9px] font-bold font-mono tracking-[0.2em] uppercase cursor-pointer transition-colors" style={{ color: 'var(--text-muted)' }} onMouseEnter={(e) => e.currentTarget.style.color = 'var(--text-primary)'} onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}>SUPPORT</span>
          </div>
        </div>
      </div>
    </div>
  );
}
