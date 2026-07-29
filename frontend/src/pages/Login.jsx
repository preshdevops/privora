import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import SecurityActionBtn from '../components/SecurityActionBtn';
import { Lock, Mail, KeyRound, ShieldCheck, ArrowRight } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async () => {
    setErrors({});
    if (!email.trim()) {
      setErrors({ email: 'Email identity is required' });
      throw new Error('Email is required');
    }
    if (!password) {
      setErrors({ password: 'Passphrase is required' });
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
          setErrors({ general: 'Invalid credentials. Please verify email and passphrase.' });
        }
      } else {
        setErrors({ general: 'Network connection failure.' });
      }
      throw err;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg-primary)] p-4 sm:p-6 text-[var(--text-primary)] font-sans">
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
                Vault Authentication
              </span>
            </div>
          </div>
          <span className="text-[10px] font-mono text-[var(--badge-success-text)] flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            TLS / JWT
          </span>
        </div>

        {/* General Error Alert */}
        {(errors.general || errors.detail || errors.non_field_errors) && (
          <div className="mb-6 p-3 rounded bg-[var(--badge-danger-bg)] border border-[var(--status-danger)]/40 text-[var(--badge-danger-text)] text-xs font-mono">
            {errors.general || errors.detail || errors.non_field_errors}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={(e) => { e.preventDefault(); handleLogin(); }} className="space-y-5">
          <div>
            <label className="block text-xs font-mono text-[var(--text-secondary)] mb-1.5">
              Identity (Email)
            </label>
            <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-sm bg-[var(--bg-input)] border border-[var(--border-primary)] focus-within:border-[var(--accent-brass)]">
              <Mail className="w-4 h-4 text-[var(--text-tertiary)] shrink-0" />
              <input
                id="login-email"
                type="email"
                placeholder="user@privora.local"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-transparent text-xs font-mono text-[var(--text-primary)] outline-none"
              />
            </div>
            {errors.email && (
              <span className="text-[10px] font-mono text-[var(--status-danger)] mt-1 block">
                {errors.email}
              </span>
            )}
          </div>

          <div>
            <label className="block text-xs font-mono text-[var(--text-secondary)] mb-1.5">
              Vault Passphrase
            </label>
            <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-sm bg-[var(--bg-input)] border border-[var(--border-primary)] focus-within:border-[var(--accent-brass)]">
              <KeyRound className="w-4 h-4 text-[var(--text-tertiary)] shrink-0" />
              <input
                id="login-password"
                type="password"
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-transparent text-xs font-mono text-[var(--text-primary)] outline-none"
              />
            </div>
            {errors.password && (
              <span className="text-[10px] font-mono text-[var(--status-danger)] mt-1 block">
                {errors.password}
              </span>
            )}
          </div>

          <div className="pt-2">
            <SecurityActionBtn
              type="submit"
              actionLabel="Verifying Master Key..."
              successLabel="Authenticated"
              delayMs={650}
              className="w-full justify-center !py-3"
            >
              <span>Authenticate & Enter Vault</span>
              <ArrowRight className="w-4 h-4" />
            </SecurityActionBtn>
          </div>
        </form>

        {/* Footer Links */}
        <div className="mt-8 pt-4 border-t border-[var(--border-primary)] text-center text-xs font-mono text-[var(--text-secondary)]">
          Don't have a vault yet?{" "}
          <Link to="/register" className="text-[var(--accent-brass)] hover:underline">
            Register Account
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
