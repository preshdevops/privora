import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import SecurityActionBtn from '../components/SecurityActionBtn';
import { Lock, Mail, KeyRound, ShieldCheck, ArrowRight } from 'lucide-react';
import loginGlobe from '../assets/login-globe.png';

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
          setErrors({ general: 'Invalid credentials. Please check your email and password.' });
        }
      } else {
        setErrors({ general: 'Could not reach the server. Check your connection.' });
      }
      throw err;
    }
  };

  return (
    <div className="min-h-screen flex bg-[var(--bg-primary)] text-[var(--text-primary)] font-sans">
      {/* Left visual panel — hidden on mobile */}
      <div className="hidden lg:flex lg:w-1/2 items-center justify-center p-12 relative overflow-hidden">
        <motion.img
          src={loginGlobe}
          alt=""
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 0.25, scale: 1 }}
          transition={{ duration: 1.4, ease: [0.25, 1, 0.5, 1] }}
          className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none"
          style={{ filter: 'saturate(0.3)' }}
        />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="relative z-10 max-w-md text-center"
        >
          <h2 className="text-3xl font-serif font-semibold text-[var(--text-primary)] mb-3">
            Welcome back
          </h2>
          <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
            Your files are protected and waiting. Sign in to access your private vault.
          </p>
        </motion.div>
      </div>

      {/* Right form panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-6">
        <motion.div
          initial={{ opacity: 0, y: 15, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.25, 1, 0.5, 1] }}
          className="layered-card-accent p-8 sm:p-10 rounded-sm max-w-md w-full bg-[var(--bg-card)] relative"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-[var(--border-primary)]">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-sm bg-[var(--accent-brass)] flex items-center justify-center text-[#12141C]">
                <Lock className="w-4 h-4 stroke-[2.5]" />
              </div>
              <div>
                <span className="font-serif font-semibold text-lg text-[var(--text-primary)] block leading-none">
                  Privora
                </span>
                <span className="text-[10px] font-mono text-[var(--text-tertiary)] uppercase">
                  Sign In
                </span>
              </div>
            </div>
            <span className="text-[10px] font-mono text-[var(--badge-success-text)] flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              Secure
            </span>
          </div>

          {/* General Error Alert */}
          {(errors.general || errors.detail || errors.non_field_errors) && (
            <div className="mb-6 p-3 rounded bg-[var(--badge-danger-bg)] border border-[var(--status-danger)]/40 text-[var(--badge-danger-text)] text-xs">
              {errors.general || errors.detail || errors.non_field_errors}
            </div>
          )}

          {/* Login Form — no onSubmit, button onClick drives the request */}
          <form onSubmit={(e) => e.preventDefault()} className="space-y-5">
            <div>
              <label className="block text-xs text-[var(--text-secondary)] mb-1.5">
                Email
              </label>
              <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-sm bg-[var(--bg-input)] border border-[var(--border-primary)] focus-within:border-[var(--accent-brass)]">
                <Mail className="w-4 h-4 text-[var(--text-tertiary)] shrink-0" />
                <input
                  id="login-email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-transparent text-xs text-[var(--text-primary)] outline-none"
                />
              </div>
              {errors.email && (
                <span className="text-[10px] text-[var(--status-danger)] mt-1 block">
                  {errors.email}
                </span>
              )}
            </div>

            <div>
              <label className="block text-xs text-[var(--text-secondary)] mb-1.5">
                Password
              </label>
              <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-sm bg-[var(--bg-input)] border border-[var(--border-primary)] focus-within:border-[var(--accent-brass)]">
                <KeyRound className="w-4 h-4 text-[var(--text-tertiary)] shrink-0" />
                <input
                  id="login-password"
                  type="password"
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-transparent text-xs text-[var(--text-primary)] outline-none"
                />
              </div>
              {errors.password && (
                <span className="text-[10px] text-[var(--status-danger)] mt-1 block">
                  {errors.password}
                </span>
              )}
            </div>

            <div className="pt-2">
              <SecurityActionBtn
                onClick={handleLogin}
                actionLabel="Signing in…"
                successLabel="Welcome back"
                delayMs={650}
                className="w-full justify-center !py-3"
              >
                <span>Sign In</span>
                <ArrowRight className="w-4 h-4" />
              </SecurityActionBtn>
            </div>
          </form>

          {/* Footer Links */}
          <div className="mt-8 pt-4 border-t border-[var(--border-primary)] text-center text-xs text-[var(--text-secondary)]">
            Don't have an account?{" "}
            <Link to="/register" className="text-[var(--accent-brass)] hover:underline">
              Create one
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
