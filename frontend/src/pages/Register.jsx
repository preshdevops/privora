import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import SecurityActionBtn from '../components/SecurityActionBtn';
import PrivoraSeal from '../components/PrivoraSeal';
import PasswordInput from '../components/PasswordInput';

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
    if (!password) newErrors.password = 'Password is required';
    if (password && password.length < 8) newErrors.password = 'Must be at least 8 characters';
    if (password !== password2) newErrors.password2 = 'Passwords do not match';
    if (!agree) newErrors.agree = 'Please acknowledge the privacy policy';

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
        setErrors({ general: 'Could not reach the server. Please check your connection.' });
      }
      throw err;
    }
  };

  return (
    <div className="min-h-screen flex bg-[var(--bg-primary)] text-[var(--text-primary)] font-sans antialiased">
      {/* Left Column: Seal Mark Panel — sibling of Login's left panel */}
      <div className="hidden lg:flex lg:w-1/2 items-center justify-center p-12 bg-[var(--bg-sidebar)] border-r border-[var(--border-primary)] relative overflow-hidden">
        {/* Large watermark seal bleeding off top-right edge */}
        <div className="absolute -top-16 -right-16 pointer-events-none" aria-hidden="true">
          <PrivoraSeal variant="full" size={360} opacity={0.06} />
        </div>

        <div className="relative z-10 max-w-md text-center space-y-6">
          <PrivoraSeal variant="full" size={120} className="mx-auto" />
          <span className="text-xs font-mono text-[var(--accent-brass)] tracking-widest uppercase block">
            VAULT IDENTITY SETUP
          </span>
          <h2 className="text-3xl font-serif text-[var(--text-primary)]">
            Your personal data vault
          </h2>
          <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
            Create your account to start protecting files with client-side zero-knowledge key isolation.
          </p>
        </div>
      </div>

      {/* Right Column: Clean Form Container */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-5 sm:p-12">
        <div className="w-full max-w-md space-y-6 sm:space-y-8">
          {/* Mobile Brand Emblem Header */}
          <div className="lg:hidden flex items-center gap-2.5 pb-2">
            <PrivoraSeal variant="glyph" size={24} />
            <span className="font-headline text-xl font-bold text-[var(--text-primary)]">Privora</span>
          </div>

          <header className="space-y-1.5 sm:space-y-2">
            <span className="text-xs font-mono text-[var(--accent-brass)] tracking-widest uppercase block">
              CREATE ACCOUNT
            </span>
            <h1 className="text-2xl sm:text-3xl font-serif text-[var(--text-primary)]">
              Create Your Vault
            </h1>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)]">
              Set up your account and secret password to get started.
            </p>
          </header>

          {/* General Error Alert */}
          {(errors.general || errors.detail || errors.non_field_errors || errors.error) && (
            <div className="p-3.5 rounded bg-[var(--badge-danger-bg)] border border-[var(--status-danger)]/40 text-[var(--badge-danger-text)] text-xs font-mono">
              {errors.general || errors.detail || errors.non_field_errors || errors.error}
            </div>
          )}

          <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-xs text-[var(--text-secondary)]">
                Full name
              </label>
              <input
                id="register-fullname"
                type="text"
                placeholder="Precious Olonade"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-sm bg-[var(--bg-input)] border border-[var(--border-primary)] text-base sm:text-sm text-[var(--text-primary)] outline-none min-h-[44px]"
              />
              {errors.full_name && (
                <span className="text-xs text-[var(--status-danger)] block">
                  {errors.full_name}
                </span>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs text-[var(--text-secondary)]">
                Email address
              </label>
              <input
                id="register-email"
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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <PasswordInput
                id="register-password"
                label="Secret Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={errors.password}
                autoComplete="new-password"
              />

              <PasswordInput
                id="register-password2"
                label="Confirm password"
                value={password2}
                onChange={(e) => setPassword2(e.target.value)}
                error={errors.password2}
                autoComplete="new-password"
              />
            </div>

            <div className="flex items-center gap-3 pt-2 touch-target">
              <input
                id="agree-checkbox"
                type="checkbox"
                checked={agree}
                onChange={(e) => setAgree(e.target.checked)}
                className="w-4 h-4 rounded bg-[var(--bg-input)] border-[var(--border-primary)] accent-[var(--accent-brass)] cursor-pointer"
              />
              <label htmlFor="agree-checkbox" className="text-xs text-[var(--text-secondary)] cursor-pointer select-none">
                I agree to the privacy policy and terms of service.
              </label>
            </div>
            {errors.agree && (
              <span className="text-xs text-[var(--status-danger)] block">
                {errors.agree}
              </span>
            )}

            <div className="pt-3">
              <SecurityActionBtn
                onClick={handleRegister}
                actionLabel="Creating vault…"
                successLabel="VAULT CREATED"
                delayMs={750}
                showSealOnSuccess={true}
                className="w-full justify-center min-h-[44px]"
              >
                <span>Create vault account</span>
              </SecurityActionBtn>
            </div>
          </form>

          <footer className="pt-4 border-t border-[var(--border-primary)] text-center text-xs text-[var(--text-secondary)]">
            Already registered?{" "}
            <Link to="/login" className="text-[var(--accent-brass)] hover:underline font-medium">
              Sign in to vault
            </Link>
          </footer>
        </div>
      </div>
    </div>
  );
}
