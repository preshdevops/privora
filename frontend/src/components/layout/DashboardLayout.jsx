import { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import axiosInstance from '../../api/axiosInstance';
import OnboardingFlow from '../OnboardingFlow';

const navItems = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/my-data', label: 'My data' },
  { to: '/access-logs', label: 'Access logs' },
  { to: '/settings', label: 'Settings' },
];

export default function DashboardLayout({ children }) {
  const { user, logout, tokens } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [loggingOut, setLoggingOut] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const onboarded = localStorage.getItem('privora_onboarded');
    if (!onboarded) {
      setShowOnboarding(true);
    }
  }, []);

  const handleLogout = async () => {
    if (loggingOut) return;
    setLoggingOut(true);
    try {
      await axiosInstance.post('/api/users/logout/', { refresh: tokens?.refresh });
    } catch {
      // proceed even if server rejects
    }
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex bg-[var(--bg-primary)] text-[var(--text-primary)] font-sans antialiased">
      {/* Onboarding Flow Overlay */}
      {showOnboarding && (
        <OnboardingFlow onComplete={() => setShowOnboarding(false)} />
      )}

      {/* Mobile Menu Backdrop */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-[var(--bg-modal-overlay)] lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Slim Text-Only Sidebar — No Icon Chrome */}
      <aside
        className={`w-[220px] shrink-0 flex flex-col fixed top-0 left-0 h-screen z-50 border-r border-[var(--border-primary)] bg-[var(--bg-sidebar)] transition-transform duration-300 lg:translate-x-0 ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Title */}
        <div className="px-6 pt-8 pb-6 border-b border-[var(--border-primary)]">
          <NavLink to="/dashboard" className="block">
            <span className="font-serif text-xl font-semibold text-[var(--text-primary)] tracking-tight block">
              Privora
            </span>
            <span className="text-[11px] font-mono text-[var(--text-tertiary)] block mt-0.5">
              Personal vault ledger
            </span>
          </NavLink>
        </div>

        {/* Navigation List — Clean Text Links */}
        <nav className="flex-1 px-4 py-6 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) =>
                `block px-3 py-2 text-sm rounded-sm transition-colors ${
                  isActive
                    ? 'text-[var(--text-primary)] font-medium bg-[var(--bg-hover)] border-l-2 border-[var(--accent-brass)]'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)]'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Sidebar Footer Controls */}
        <div className="px-6 py-6 border-t border-[var(--border-primary)] space-y-4 text-xs text-[var(--text-tertiary)]">
          <div>
            <span className="text-[var(--text-primary)] font-medium block truncate">
              {user?.full_name || user?.email || 'Member'}
            </span>
            <span className="text-[11px]">Member account</span>
          </div>

          <div className="flex items-center justify-between pt-2">
            <button
              onClick={toggleTheme}
              className="hover:text-[var(--text-primary)] transition-colors cursor-pointer"
            >
              {theme === 'dark' ? 'Light mode' : 'Dark mode'}
            </button>

            <button
              onClick={handleLogout}
              className="hover:text-[var(--status-danger)] transition-colors cursor-pointer"
            >
              {loggingOut ? 'Signing out…' : 'Sign out'}
            </button>
          </div>
        </div>
      </aside>

      {/* Main Single-Column Content Area — Capped at 760px */}
      <div className="flex-1 lg:ml-[220px] flex flex-col min-h-screen">
        {/* Mobile Header Bar */}
        <header className="lg:hidden sticky top-0 z-30 bg-[var(--bg-primary)] border-b border-[var(--border-primary)] px-6 py-4 flex items-center justify-between">
          <span className="font-serif text-lg font-semibold text-[var(--text-primary)]">
            Privora
          </span>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
          >
            {mobileMenuOpen ? 'Close' : 'Menu'}
          </button>
        </header>

        {/* Single-Column Editorial Canvas */}
        <main className="flex-1 w-full max-w-[760px] mx-auto px-6 py-10 lg:py-16">
          {children}
        </main>

        {/* Quiet Footer */}
        <footer className="w-full max-w-[760px] mx-auto px-6 py-6 border-t border-[var(--border-primary)] text-xs text-[var(--text-tertiary)] flex items-center justify-between">
          <span>Privora — Built to Nigerian and international privacy standards</span>
          <span>© {new Date().getFullYear()}</span>
        </footer>
      </div>
    </div>
  );
}
