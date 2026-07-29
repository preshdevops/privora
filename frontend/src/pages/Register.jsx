import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import axiosInstance from '../api/axiosInstance';
import SecurityActionBtn from '../components/SecurityActionBtn';
import { Lock, Mail, User, KeyRound, ShieldCheck, ArrowRight } from 'lucide-react';

export default function Register() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [agree, setAgree] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleRegister = async () => {
    setErrors({});

    const newErrors = {};
    if (!fullName.trim()) newErrors.full_name = 'Full name is required';
    if (!email.trim()) newErrors.email = 'Email is required';
    if (!password) newErrors.password = 'Passphrase is required';
    if (password && password.length < 8) newErrors.password = 'Must be at least 8 characters';
    if (password !== password2) newErrors.password2 = 'Passphrases do not match';
    if (!agree) newErrors.agree = 'Must acknowledge privacy policy';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      throw new Error('Validation failed');
    }

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
          setErrors({ general: 'Registration failed.' });
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
        className="layered-card-accent p-8 sm:p-10 rounded-sm max-w-lg w-full bg-[var(--bg-card)] relative"
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
                Vault Identity Setup
              </span>
            </div>
          </div>
          <span className="text-[10px] font-mono text-[var(--badge-success-text)] flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            NDPR 2023
          </span>
        </div>

        {/* General Error */}
        {(errors.general || errors.detail || errors.non_field_errors) && (
          <div className="mb-6 p-3 rounded bg-[var(--badge-danger-bg)] border border-[var(--status-danger)]/40 text-[var(--badge-danger-text)] text-xs font-mono">
            {errors.general || errors.detail || errors.non_field_errors}
          </div>
        )}

        {/* Register Form */}
        <form onSubmit={(e) => { e.preventDefault(); handleRegister(); }} className="space-y-4">
          <div>
            <label className="block text-xs font-mono text-[var(--text-secondary)] mb-1">
              Full Name
            </label>
            <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-sm bg-[var(--bg-input)] border border-[var(--border-primary)] focus-within:border-[var(--accent-brass)]">
              <User className="w-4 h-4 text-[var(--text-tertiary)] shrink-0" />
              <input
                id="register-fullname"
                type="text"
                placeholder="Aremu Olaseeni"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full bg-transparent text-xs font-mono text-[var(--text-primary)] outline-none"
              />
            </div>
            {errors.full_name && (
              <span className="text-[10px] font-mono text-[var(--status-danger)] mt-1 block">
                {errors.full_name}
              </span>
            )}
          </div>

          <div>
            <label className="block text-xs font-mono text-[var(--text-secondary)] mb-1">
              Email Identity
            </label>
            <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-sm bg-[var(--bg-input)] border border-[var(--border-primary)] focus-within:border-[var(--accent-brass)]">
              <Mail className="w-4 h-4 text-[var(--text-tertiary)] shrink-0" />
              <input
                id="register-email"
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-[var(--text-secondary)] mb-1">
                Passphrase
              </label>
              <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-sm bg-[var(--bg-input)] border border-[var(--border-primary)] focus-within:border-[var(--accent-brass)]">
                <KeyRound className="w-4 h-4 text-[var(--text-tertiary)] shrink-0" />
                <input
                  id="register-password"
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

            <div>
              <label className="block text-xs font-mono text-[var(--text-secondary)] mb-1">
                Confirm Passphrase
              </label>
              <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-sm bg-[var(--bg-input)] border border-[var(--border-primary)] focus-within:border-[var(--accent-brass)]">
                <KeyRound className="w-4 h-4 text-[var(--text-tertiary)] shrink-0" />
                <input
                  id="register-password2"
                  type="password"
                  placeholder="••••••••••••"
                  value={password2}
                  onChange={(e) => setPassword2(e.target.value)}
                  className="w-full bg-transparent text-xs font-mono text-[var(--text-primary)] outline-none"
                />
              </div>
              {errors.password2 && (
                <span className="text-[10px] font-mono text-[var(--status-danger)] mt-1 block">
                  {errors.password2}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <input
              id="agree-checkbox"
              type="checkbox"
              checked={agree}
              onChange={(e) => setAgree(e.target.checked)}
              className="rounded bg-[var(--bg-input)] border-[var(--border-primary)] accent-[var(--accent-brass)]"
            />
            <label htmlFor="agree-checkbox" className="text-xs font-mono text-[var(--text-secondary)] cursor-pointer">
              I acknowledge NDPR data protection policy & zero-knowledge terms.
            </label>
          </div>
          {errors.agree && (
            <span className="text-[10px] font-mono text-[var(--status-danger)] block">
              {errors.agree}
            </span>
          )}

          <div className="pt-3">
            <SecurityActionBtn
              type="submit"
              actionLabel="Deriving Master Salt & Key..."
              successLabel="Vault Created"
              delayMs={750}
              className="w-full justify-center !py-3"
            >
              <span>Initialize Vault Account</span>
              <ArrowRight className="w-4 h-4" />
            </SecurityActionBtn>
          </div>
        </form>

        {/* Footer Link */}
        <div className="mt-8 pt-4 border-t border-[var(--border-primary)] text-center text-xs font-mono text-[var(--text-secondary)]">
          Already registered?{" "}
          <Link to="/login" className="text-[var(--accent-brass)] hover:underline">
            Sign In to Vault
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
