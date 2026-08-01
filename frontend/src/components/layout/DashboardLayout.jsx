import { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, FolderLock, ScrollText, Settings as SettingsIcon, LogOut, Sun, Moon } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import axiosInstance from '../../api/axiosInstance';
import OnboardingFlow from '../OnboardingFlow';
import PrivoraSeal from '../PrivoraSeal';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/my-data', label: 'My data', icon: FolderLock },
  { to: '/access-logs', label: 'Access logs', icon: ScrollText },
  { to: '/settings', label: 'Settings', icon: SettingsIcon },
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
    <div className="min-h-screen flex flex-col md:flex-row bg-[var(--bg-primary)] text-[var(--text-primary)] font-sans antialiased">
      {/* Onboarding Flow Overlay */}
      {showOnboarding && (
        <OnboardingFlow onComplete={() => setShowOnboarding(false)} />
      )}

      {/* Mobile Drawer Backdrop */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-[var(--bg-modal-overlay)] md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* ─── Tablet (640-1024px) & Desktop (1024px+) Left Sidebar ───
          Desktop: 220px wide with text + icons.
          Tablet: 64px wide icon-only with hover tooltips.
          Mobile (<640px): Hidden completely (handled by bottom tab bar & top bar).
      ─── */}
      <aside
        className={`hidden md:flex flex-col fixed top-0 left-0 h-screen z-50 border-r border-[var(--border-primary)] bg-[var(--bg-sidebar)] transition-all duration-200 md:w-16 lg:w-[220px] shrink-0`}
      >
        {/* Brand Title / Logo */}
        <div className="px-4 lg:px-6 pt-6 pb-5 border-b border-[var(--border-primary)] flex items-center justify-center lg:justify-start">
          <NavLink to="/dashboard" className="flex items-center gap-2.5">
            <PrivoraSeal variant="glyph" size={22} className="shrink-0" />
            <div className="hidden lg:block">
              <span className="font-serif text-xl font-semibold text-[var(--text-primary)] tracking-tight block leading-none">
                Privora
              </span>
              <span className="text-[11px] font-mono text-[var(--text-tertiary)] block mt-1">
                Personal vault ledger
              </span>
            </div>
          </NavLink>
        </div>

        {/* Sidebar Navigation Items */}
        <nav className="flex-1 px-2 lg:px-4 py-6 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                title={item.label}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-sm transition-colors min-h-[44px] group relative ${
                    isActive
                      ? 'text-[var(--text-primary)] font-medium bg-[var(--bg-hover)] border-l-2 border-[var(--accent-brass)]'
                      : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)]'
                  }`
                }
              >
                <Icon className="w-5 h-5 shrink-0" />
                <span className="hidden lg:inline text-sm">{item.label}</span>

                {/* Tablet Icon-Only Tooltip Hover Popup */}
                <span className="hidden md:group-hover:block lg:hidden absolute left-14 z-50 px-2.5 py-1 text-xs font-mono bg-[var(--bg-card-elevated)] border border-[var(--border-primary)] text-[var(--text-primary)] rounded shadow-lg whitespace-nowrap pointer-events-none">
                  {item.label}
                </span>
              </NavLink>
            );
          })}
        </nav>

        {/* Sidebar Footer Controls */}
        <div className="p-3 lg:px-6 lg:py-6 border-t border-[var(--border-primary)] space-y-4 text-xs text-[var(--text-tertiary)]">
          <div className="hidden lg:block">
            <span className="text-[var(--text-primary)] font-medium block truncate">
              {user?.full_name || user?.email || 'Member'}
            </span>
            <span className="text-[11px]">Member account</span>
          </div>

          <div className="flex flex-col lg:flex-row items-center justify-between gap-2">
            <button
              onClick={toggleTheme}
              title={theme === 'dark' ? 'Switch to Light mode' : 'Switch to Dark mode'}
              className="p-2 lg:p-0 hover:text-[var(--text-primary)] transition-colors cursor-pointer flex items-center gap-1.5 touch-target"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              <span className="hidden lg:inline">{theme === 'dark' ? 'Light' : 'Dark'}</span>
            </button>

            <button
              onClick={handleLogout}
              title="Sign out of vault"
              className="p-2 lg:p-0 hover:text-[var(--status-danger)] transition-colors cursor-pointer flex items-center gap-1.5 touch-target"
            >
              <LogOut className="w-4 h-4 text-[var(--status-danger)] lg:text-current" />
              <span className="hidden lg:inline">{loggingOut ? 'Signing out…' : 'Sign out'}</span>
            </button>
          </div>
        </div>
      </aside>

      {/* ─── Mobile Slide-in Drawer Header (Fallback Menu Panel for Account / Settings) ─── */}
      {mobileMenuOpen && (
        <div className="fixed top-14 left-0 right-0 z-50 bg-[var(--bg-sidebar)] border-b border-[var(--border-primary)] p-4 md:hidden space-y-4 shadow-2xl">
          <div className="flex items-center justify-between pb-3 border-b border-[var(--border-primary)] text-xs">
            <div>
              <span className="text-[var(--text-primary)] font-medium block">
                {user?.full_name || user?.email || 'Member'}
              </span>
              <span className="text-[11px] text-[var(--text-tertiary)]">Member account</span>
            </div>
            <button
              onClick={toggleTheme}
              className="px-3 py-1.5 border border-[var(--border-primary)] rounded text-xs flex items-center gap-1.5 touch-target"
            >
              {theme === 'dark' ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
              <span>{theme === 'dark' ? 'Light' : 'Dark'}</span>
            </button>
          </div>
          <button
            onClick={() => { setMobileMenuOpen(false); handleLogout(); }}
            className="w-full py-2 text-xs text-[var(--status-danger)] border border-[var(--status-danger)]/30 rounded flex items-center justify-center gap-2 min-h-[44px]"
          >
            <LogOut className="w-4 h-4" />
            <span>{loggingOut ? 'Signing out…' : 'Sign out of vault'}</span>
          </button>
        </div>
      )}

      {/* ─── Main Content Canvas ─── */}
      <div className="flex-1 md:ml-16 lg:ml-[220px] flex flex-col min-h-screen pb-20 md:pb-0">
        {/* Mobile Header Bar (<640px) */}
        <header className="md:hidden sticky top-0 z-30 bg-[var(--bg-primary)]/95 backdrop-blur border-b border-[var(--border-primary)] px-4 py-3 flex items-center justify-between">
          <NavLink to="/dashboard" className="font-serif text-lg font-semibold text-[var(--text-primary)] flex items-center gap-2">
            <PrivoraSeal variant="glyph" size={20} />
            <span>Privora</span>
          </NavLink>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] px-2.5 py-1.5 border border-[var(--border-primary)] rounded touch-target"
          >
            {mobileMenuOpen ? 'Close' : 'Account'}
          </button>
        </header>

        {/* Single-Column Editorial Canvas */}
        <main className="flex-1 w-full max-w-[760px] mx-auto px-4 sm:px-6 py-6 sm:py-10 lg:py-16">
          {children}
        </main>

        {/* Quiet Footer */}
        <footer className="w-full max-w-[760px] mx-auto px-4 sm:px-6 py-6 border-t border-[var(--border-primary)] text-xs text-[var(--text-tertiary)] flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
          <span>Privora — Built to Nigerian and international privacy standards</span>
          <span>© {new Date().getFullYear()}</span>
        </footer>
      </div>

      {/* ─── Mobile Bottom Tab Bar (<640px) ───
          Fixed bottom bar with 4 main navigation tabs (Dashboard, My Data, Access Logs, Settings).
          Each tab has min 44x44px touch target.
      ─── */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 h-16 bg-[#0F0F0B] border-t border-[var(--border-primary)] flex items-center justify-around px-2 shadow-2xl">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex-1 flex flex-col items-center justify-center py-1 rounded transition-colors touch-target min-h-[44px] ${
                  isActive
                    ? 'text-[var(--accent-brass)] font-semibold'
                    : 'text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]'
                }`
              }
            >
              <Icon className="w-5 h-5 mb-0.5" />
              <span className="text-[10px] font-mono tracking-tight">{item.label}</span>
            </NavLink>
          );
        })}
      </nav>
    </div>
  );
}

