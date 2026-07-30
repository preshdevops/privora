import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import SecurityActionBtn from '../components/SecurityActionBtn';
import registerCrystalImg from '../assets/register-crystal.png';

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
      {/* Left Column: Asymmetric Visual Panel */}
      <div className="hidden lg:flex lg:w-1/2 items-center justify-center p-12 bg-[var(--bg-sidebar)] border-r border-[var(--border-primary)] relative">
        <img
          src={registerCrystalImg}
          alt="Vault Registration"
          className="absolute inset-0 w-full h-full object-cover opacity-30 pointer-events-none"
        />
        <div className="relative z-10 max-w-md text-center space-y-4">
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
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-8">
          <header className="space-y-2">
            <span className="text-xs font-mono text-[var(--accent-brass)] tracking-widest uppercase block">
              CREATE ACCOUNT
            </span>
            <h1 className="text-3xl font-serif text-[var(--text-primary)]">
              Initialize your vault
            </h1>
            <p className="text-sm text-[var(--text-secondary)]">
              Set up your account details and master password key.
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
                placeholder="Aremu Olaseeni"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-sm bg-[var(--bg-input)] border border-[var(--border-primary)] text-sm text-[var(--text-primary)] outline-none"
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
                className="w-full px-3.5 py-2.5 rounded-sm bg-[var(--bg-input)] border border-[var(--border-primary)] text-sm text-[var(--text-primary)] outline-none"
              />
              {errors.email && (
                <span className="text-xs text-[var(--status-danger)] block">
                  {errors.email}
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs text-[var(--text-secondary)]">
                  Master password
                </label>
                <input
                  id="register-password"
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

              <div className="space-y-1.5">
                <label className="block text-xs text-[var(--text-secondary)]">
                  Confirm password
                </label>
                <input
                  id="register-password2"
                  type="password"
                  placeholder="••••••••••••"
                  value={password2}
                  onChange={(e) => setPassword2(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-sm bg-[var(--bg-input)] border border-[var(--border-primary)] text-sm text-[var(--text-primary)] outline-none"
                />
                {errors.password2 && (
                  <span className="text-xs text-[var(--status-danger)] block">
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
                className="rounded bg-[var(--bg-input)] border-[var(--border-primary)] accent-[var(--accent-brass)] cursor-pointer"
              />
              <label htmlFor="agree-checkbox" className="text-xs text-[var(--text-secondary)] cursor-pointer">
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
                actionLabel="Creating account…"
                successLabel="VAULT SEALED"
                delayMs={750}
                showSealOnSuccess={true}
                className="w-full justify-center"
              >
                <span>Create vault account</span>
              </SecurityActionBtn>
            </div>
          </form>

          <footer className="pt-4 border-t border-[var(--border-primary)] text-center text-xs text-[var(--text-secondary)]">
            Already registered?{" "}
            <Link to="/login" className="text-[var(--accent-brass)] hover:underline">
              Sign in to vault
            </Link>
          </footer>
        </div>
      </div>
    </div>
  );
}
