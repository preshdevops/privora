import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import SecurityActionBtn from '../components/SecurityActionBtn';
import loginGlobeImg from '../assets/login-globe.png';

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
      {/* Left Column: Asymmetric Visual Panel */}
      <div className="hidden lg:flex lg:w-1/2 items-center justify-center p-12 bg-[var(--bg-sidebar)] border-r border-[var(--border-primary)] relative">
        <img
          src={loginGlobeImg}
          alt="Vault Authentication"
          className="absolute inset-0 w-full h-full object-cover opacity-30 pointer-events-none"
        />
        <div className="relative z-10 max-w-md text-center space-y-4">
          <span className="text-xs font-mono text-[var(--accent-brass)] tracking-widest uppercase block">
            VAULT AUTHENTICATION
          </span>
          <h2 className="text-3xl font-serif text-[var(--text-primary)]">
            Welcome back
          </h2>
          <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
            Sign in to access your protected files, review security alerts, and inspect your audit ledger.
          </p>
        </div>
      </div>

      {/* Right Column: Clean Form Container */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-8">
          <header className="space-y-2">
            <span className="text-xs font-mono text-[var(--accent-brass)] tracking-widest uppercase block">
              SIGN IN
            </span>
            <h1 className="text-3xl font-serif text-[var(--text-primary)]">
              Access your vault
            </h1>
            <p className="text-sm text-[var(--text-secondary)]">
              Enter your account credentials to unseal your vault.
            </p>
          </header>

          {/* General Error Alert */}
          {(errors.general || errors.detail || errors.non_field_errors || errors.error) && (
            <div className="p-3.5 rounded bg-[var(--badge-danger-bg)] border border-[var(--status-danger)]/40 text-[var(--badge-danger-text)] text-xs font-mono">
              {errors.general || errors.detail || errors.non_field_errors || errors.error}
            </div>
          )}

          <form onSubmit={(e) => e.preventDefault()} className="space-y-5">
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
                className="w-full px-3.5 py-2.5 rounded-sm bg-[var(--bg-input)] border border-[var(--border-primary)] text-sm text-[var(--text-primary)] outline-none"
              />
              {errors.email && (
                <span className="text-xs text-[var(--status-danger)] block">
                  {errors.email}
                </span>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs text-[var(--text-secondary)]">
                Master password
              </label>
              <input
                id="login-password"
                type="password"
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-sm bg-[var(--bg-input)] border border-[var(--border-primary)] text-sm text-[var(--text-primary)] outline-none"
              />
              {errors.password && (
                <span className="text-xs text-[var(--status-danger)] block">
                  {errors.password}
                </span>
              )}
            </div>

            <div className="pt-2">
              <SecurityActionBtn
                onClick={handleLogin}
                actionLabel="Authenticating…"
                successLabel="SEALED & GRANTED"
                delayMs={600}
                showSealOnSuccess={true}
                className="w-full justify-center"
              >
                <span>Sign in to vault</span>
              </SecurityActionBtn>
            </div>
          </form>

          <footer className="pt-4 border-t border-[var(--border-primary)] text-center text-xs text-[var(--text-secondary)]">
            Don't have a vault account yet?{" "}
            <Link to="/register" className="text-[var(--accent-brass)] hover:underline">
              Create account
            </Link>
          </footer>
        </div>
      </div>
    </div>
  );
}
