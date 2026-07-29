import { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import axiosInstance from '../../api/axiosInstance';
import OnboardingFlow from '../OnboardingFlow';
import { 
  ShieldCheck, 
  KeyRound, 
  Activity, 
  Settings as SettingsIcon, 
  LogOut, 
  Sun, 
  Moon, 
  HelpCircle, 
  Menu, 
  X, 
  Search,
  Lock
} from 'lucide-react';

const navItems = [
  {
    to: '/dashboard',
    label: 'Dashboard',
    icon: <ShieldCheck className="w-4 h-4" />,
  },
  {
    to: '/my-data',
    label: 'My Data',
    icon: <KeyRound className="w-4 h-4" />,
  },
  {
    to: '/access-logs',
    label: 'Access Logs',
    icon: <Activity className="w-4 h-4" />,
  },
  {
    to: '/settings',
    label: 'Settings',
    icon: <SettingsIcon className="w-4 h-4" />,
  },
];

export default function DashboardLayout({ children }) {
  const { user, logout, tokens } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [loggingOut, setLoggingOut] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);

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
    <div className="min-h-screen flex bg-[var(--bg-primary)] text-[var(--text-primary)] font-sans">
      {/* Onboarding Flow Overlay */}
      {showOnboarding && (
        <OnboardingFlow onComplete={() => setShowOnboarding(false)} />
      )}

      {/* Mobile Sidebar Overlay */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-[var(--bg-modal-overlay)] lg:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`w-[240px] shrink-0 flex flex-col fixed top-0 left-0 h-screen z-50 border-r border-[var(--border-primary)] bg-[var(--bg-sidebar)] transition-transform duration-300 lg:translate-x-0 ${
          mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo */}
        <div className="px-6 pt-7 pb-5 flex items-center justify-between border-b border-[var(--border-primary)]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-sm bg-[var(--accent-brass)] flex items-center justify-center text-[#12141C]">
              <Lock className="w-4 h-4 stroke-[2.5]" />
            </div>
            <div>
              <span className="font-serif font-semibold text-base text-[var(--text-primary)] tracking-tight block">
                Privora
              </span>
              <p className="text-[10px] text-[var(--accent-brass)] font-mono font-medium tracking-wider flex items-center gap-1.5 mt-0.5 uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--status-success)] inline-block animate-pulse" />
                Protected
              </p>
            </div>
          </div>
          
          <button
            onClick={() => setMobileSidebarOpen(false)}
            className="p-1 lg:hidden text-[var(--text-muted)] hover:text-[var(--text-primary)]"
            title="Close navigation"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 mt-4 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setMobileSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 rounded-sm text-xs font-medium transition-all duration-200 group relative ${
                  isActive
                    ? 'bg-[var(--bg-card-elevated)] text-[var(--accent-brass)] border border-[var(--border-accent)] shadow-[var(--shadow-layered)]'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)]'
                }`
              }
              id={`nav-${item.label.toLowerCase().replace(/\s/g, '-')}`}
            >
              {({ isActive }) => (
                <>
                  <span className={isActive ? 'text-[var(--accent-brass)]' : 'text-[var(--text-tertiary)] group-hover:text-[var(--text-secondary)]'}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Bottom Section */}
        <div className="px-4 pb-6 mt-auto space-y-3">
          {/* Status Card */}
          <div className="layered-card p-3.5 rounded-sm bg-[var(--bg-card)]">
            <p className="text-[10px] font-mono tracking-widest text-[var(--text-muted)] uppercase mb-2">
              Security Status
            </p>
            <p className="text-xs flex items-center gap-2 text-[var(--badge-success-text)] font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--status-success)]" />
              Your data is protected
            </p>
            <button
              onClick={() => setShowOnboarding(true)}
              className="mt-3 w-full py-1.5 rounded-sm bg-[var(--bg-input)] hover:bg-[var(--bg-hover)] border border-[var(--border-primary)] text-[var(--text-secondary)] hover:text-[var(--accent-brass)] text-[11px] font-mono transition-colors text-center cursor-pointer"
            >
              How Privora Works
            </button>
          </div>

          {/* Logout */}
          <div
            className="flex items-center gap-3 px-3.5 py-2 rounded-sm cursor-pointer transition-colors text-xs text-[var(--text-secondary)] hover:text-[var(--status-danger)] hover:bg-[var(--bg-hover)]"
            onClick={handleLogout}
            role="button"
            tabIndex={0}
            id="sidebar-logout-btn"
          >
            <LogOut className="w-4 h-4 text-current" />
            <span>{loggingOut ? 'Signing out…' : 'Sign Out'}</span>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 lg:ml-[240px] flex flex-col min-h-screen min-w-0">
        {/* Top Bar */}
        <header className="sticky top-0 z-20 border-b border-[var(--border-primary)] bg-[var(--bg-primary)] px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="p-2 -ml-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] lg:hidden cursor-pointer rounded hover:bg-[var(--bg-hover)] transition-colors"
              id="hamburger-menu-btn"
              title="Open Navigation Menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 lg:hidden">
              <div className="w-7 h-7 rounded-sm bg-[var(--accent-brass)] flex items-center justify-center text-[#12141C]">
                <Lock className="w-3.5 h-3.5 stroke-[2.5]" />
              </div>
              <span className="font-serif font-semibold text-sm text-[var(--text-primary)] hidden sm:inline">
                Privora
              </span>
            </div>

            {/* Global Search Input */}
            <div className="hidden lg:flex items-center gap-2.5 rounded-sm px-3.5 py-2 w-[320px] bg-[var(--bg-input)] border border-[var(--border-primary)] focus-within:border-[var(--accent-brass)]">
              <Search className="w-3.5 h-3.5 text-[var(--text-tertiary)]" />
              <input
                type="text"
                placeholder="Search files or activity…"
                className="flex-1 bg-transparent text-xs text-[var(--text-primary)] outline-none placeholder:[var(--text-muted)]"
                id="global-search"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Theme Toggle */}
            <div
              className="w-8 h-8 rounded-sm flex items-center justify-center cursor-pointer transition-colors bg-[var(--bg-input)] border border-[var(--border-primary)] hover:border-[var(--border-secondary)] text-[var(--text-secondary)]"
              onClick={toggleTheme}
              role="button"
              tabIndex={0}
              id="theme-toggle-btn"
              title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-[var(--accent-brass)]" />
              ) : (
                <Moon className="w-4 h-4 text-[var(--text-secondary)]" />
              )}
            </div>

            {/* User Info */}
            <div className="flex items-center gap-3 pl-4 border-l border-[var(--border-primary)]">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-medium text-[var(--text-primary)]">
                  {user?.full_name || user?.email?.split('@')[0] || 'User'}
                </p>
                <p className="text-[10px] font-mono text-[var(--text-tertiary)] uppercase">
                  Member
                </p>
              </div>
              <div className="w-8 h-8 rounded-sm bg-[var(--bg-card-elevated)] border border-[var(--border-accent)] flex items-center justify-center text-[var(--accent-brass)] font-serif font-semibold text-xs shadow-[var(--shadow-layered)]">
                {(user?.full_name?.[0] || user?.email?.[0] || 'U').toUpperCase()}
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>

        {/* Footer */}
        <footer className="border-t border-[var(--border-primary)] px-4 sm:px-6 lg:px-8 py-4 bg-[var(--bg-primary)]">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[var(--text-tertiary)]">
            <div className="flex items-center gap-2">
              <span className="font-serif font-medium text-[var(--text-primary)]">Privora</span>
              <span>— Built to Nigerian and international privacy law</span>
            </div>
            <div>
              © {new Date().getFullYear()} Privora. All rights reserved.
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
