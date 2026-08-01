import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import SecurityActionBtn from '../components/SecurityActionBtn';
import PasswordInput from '../components/PasswordInput';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async () => {
    setErrors({});
    if (!email.trim()) {
      setErrors({ email: 'Email is required' });
      throw new Error('Email is required');
    }
    if (!password) {
      setErrors({ password: 'Password is required' });
      throw new Error('Password is required');
    }

    try {
      await login(email, password);
      navigate('/dashboard');
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
          setErrors({ general: 'Invalid credentials. Please verify your email and password.' });
        }
      } else {
        setErrors({ general: 'Could not reach the server. Please check your connection.' });
      }
      throw err;
    }
  };

  return (
    <div className="min-h-screen flex bg-[var(--bg-primary)] text-[var(--text-primary)] font-sans antialiased">
      {/* Left Column: Seal Mark Panel */}
      <div className="hidden lg:flex lg:w-1/2 items-center justify-center p-12 bg-[var(--bg-sidebar)] border-r border-[var(--border-primary)] relative overflow-hidden">
        {/* Large watermark seal bleeding off bottom edge */}
        <div className="absolute -bottom-20 -left-20 pointer-events-none" aria-hidden="true">
          <PrivoraSeal variant="full" size={400} opacity={0.06} />
        </div>

        <div className="relative z-10 max-w-md text-center space-y-6">
          <PrivoraSeal variant="full" size={120} className="mx-auto" />
          <span className="text-xs font-mono text-[var(--accent-gold)] tracking-widest uppercase block">
            VAULT AUTHENTICATION
          </span>
          <h2 className="text-3xl font-display font-bold text-[var(--text-primary)]">
            Welcome back
          </h2>
          <p className="text-sm text-[var(--text-secondary)] font-sans leading-relaxed">
            Sign in to access your protected files, review security alerts, and inspect your audit ledger.
          </p>
        </div>
      </div>

      {/* Right Column: Clean Form Container */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-5 sm:p-12">
        <div className="w-full max-w-md space-y-6 sm:space-y-8 font-sans">
          {/* Mobile Brand Emblem Header */}
          <div className="lg:hidden flex items-center gap-2.5 pb-2">
            <PrivoraSeal variant="glyph" size={24} />
            <span className="font-display text-xl font-bold text-[var(--text-primary)]">Privora</span>
          </div>

          <header className="space-y-1.5 sm:space-y-2">
            <span className="text-xs font-mono text-[var(--accent-gold)] tracking-widest uppercase block">
              WELCOME BACK
            </span>
            <h1 className="text-2xl sm:text-3xl font-display font-bold text-[var(--text-primary)]">
              Sign in to Privora
            </h1>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)] font-sans">
              Enter your account details to access your private vault.
            </p>
          </header>

          {/* General Error Alert */}
          {(errors.general || errors.detail || errors.non_field_errors || errors.error) && (
            <div className="p-3.5 rounded bg-[var(--badge-danger-bg)] border border-[var(--status-danger)]/40 text-[var(--badge-danger-text)] text-xs font-mono">
              {errors.general || errors.detail || errors.non_field_errors || errors.error}
            </div>
          )}

          <form onSubmit={(e) => e.preventDefault()} className="space-y-4 sm:space-y-5">
            <div className="space-y-1.5">
              <label className="block text-xs text-[var(--text-secondary)]">
                Email address
              </label>
              <input
                id="login-email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-sm bg-[var(--bg-input)] border border-[var(--border-primary)] text-base sm:text-sm text-[var(--text-primary)] outline-none min-h-[44px]"
              />
              {errors.email && (
                <span className="text-xs text-[var(--status-danger)] block">
                  {errors.email}
                </span>
              )}
            </div>

            <PasswordInput
              id="login-password"
              label="Secret Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={errors.password}
            />

            <div className="pt-2">
              <SecurityActionBtn
                onClick={handleLogin}
                actionLabel="Signing in…"
                successLabel="GRANTED"
                delayMs={600}
                showSealOnSuccess={true}
                className="w-full justify-center min-h-[44px]"
              >
                <span>Sign in</span>
              </SecurityActionBtn>
            </div>
          </form>

          <footer className="pt-4 border-t border-[var(--border-primary)] text-center text-xs text-[var(--text-secondary)]">
            Don't have a vault account yet?{" "}
            <Link to="/register" className="text-[var(--accent-brass)] hover:underline font-medium">
              Create account
            </Link>
          </footer>
        </div>
      </div>
    </div>
  );
}
