import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import axiosInstance from '../../api/axiosInstance';

const navItems = [
  {
    to: '/dashboard',
    label: 'Dashboard',
    icon: (
      <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
      </svg>
    ),
  },
  {
    to: '/my-data',
    label: 'My Data',
    icon: (
      <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    ),
  },
  {
    to: '/access-logs',
    label: 'Access Logs',
    icon: (
      <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
      </svg>
    ),
  },
  {
    to: '/settings',
    label: 'Settings',
    icon: (
      <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
];

export default function DashboardLayout({ children }) {
  const { user, logout, tokens } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [loggingOut, setLoggingOut] = useState(false);

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
    <div className="min-h-screen flex" style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
      {/* ─── Sidebar ─── */}
      <aside
        className="w-[220px] shrink-0 flex flex-col fixed top-0 left-0 h-screen z-30 border-r"
        style={{ background: 'var(--bg-sidebar)', borderColor: 'var(--border-primary)' }}
      >
        {/* Logo */}
        <div className="px-5 pt-6 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-accent-blue flex items-center justify-center">
              <svg className="w-[18px] h-[18px] text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 2.18l7 3.12v4.7c0 4.67-3.13 9.04-7 10.2-3.87-1.16-7-5.53-7-10.2V6.3l7-3.12z" />
                <path d="M12 7a2 2 0 00-2 2v2a2 2 0 001 1.73V15a1 1 0 002 0v-2.27A2 2 0 0014 11V9a2 2 0 00-2-2z" />
              </svg>
            </div>
            <div>
              <span className="font-bold text-sm tracking-tight" style={{ color: 'var(--text-primary)' }}>
                Privora Sentinel
              </span>
              <p className="text-[10px] text-emerald-400 font-semibold tracking-wider flex items-center gap-1.5 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
                SYSTEM ACTIVE
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 mt-2 space-y-0.5">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium transition-all duration-200 group relative ${
                  isActive
                    ? 'text-accent-light'
                    : ''
                }`
              }
              style={({ isActive }) => ({
                color: isActive ? '#60a5fa' : 'var(--text-secondary)',
                background: isActive ? 'rgba(37, 99, 235, 0.08)' : 'transparent',
              })}
              id={`nav-${item.label.toLowerCase().replace(/\s/g, '-')}`}
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-6 bg-accent-blue rounded-r-full" />
                  )}
                  <span className={isActive ? 'text-accent-blue' : ''}>{item.icon}</span>
                  {item.label}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Bottom Section */}
        <div className="px-4 pb-5 mt-auto space-y-3">
          {/* Security Status Card */}
          <div
            className="rounded-xl p-3.5 border"
            style={{ background: 'var(--bg-card)', borderColor: 'var(--border-primary)' }}
          >
            <p className="text-[10px] tracking-[0.15em] font-bold uppercase mb-2" style={{ color: 'var(--text-muted)' }}>
              Security Status
            </p>
            <p className="text-xs flex items-center gap-2 text-emerald-400 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              End-to-End Encrypted
            </p>
            <div
              className="mt-3 w-full py-2 rounded-lg bg-emerald-500/20 text-emerald-400 text-xs font-semibold text-center cursor-pointer hover:bg-emerald-500/30 transition-colors"
              role="button"
              tabIndex={0}
              id="upgrade-security-btn"
            >
              Upgrade Security
            </div>
          </div>

          {/* Help Center */}
          <div
            className="flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-colors text-[13px]"
            style={{ color: 'var(--text-secondary)' }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--bg-hover)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
            role="button"
            tabIndex={0}
            id="help-center-btn"
          >
            <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Help Center
          </div>

          {/* Logout */}
          <div
            className="flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-colors text-[13px]"
            style={{ color: 'var(--text-secondary)' }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--bg-hover)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
            onClick={handleLogout}
            role="button"
            tabIndex={0}
            id="sidebar-logout-btn"
          >
            <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            {loggingOut ? 'Signing out...' : 'Logout'}
          </div>
        </div>
      </aside>

      {/* ─── Main Content Area ─── */}
      <div className="flex-1 ml-[220px] flex flex-col min-h-screen">
        {/* Top Bar */}
        <header
          className="sticky top-0 z-20 border-b backdrop-blur-xl px-8 py-3 flex items-center justify-between"
          style={{
            background: theme === 'dark' ? 'rgba(10, 14, 26, 0.8)' : 'rgba(255, 255, 255, 0.85)',
            borderColor: 'var(--border-primary)',
          }}
        >
          {/* Search */}
          <div
            className="flex items-center gap-3 rounded-lg px-4 py-2.5 w-[360px]"
            style={{ background: 'var(--bg-input)', border: '1px solid var(--border-secondary)' }}
          >
            <svg className="w-4 h-4" style={{ color: 'var(--text-muted)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search system logs or files..."
              className="flex-1 bg-transparent text-sm outline-none"
              style={{ color: 'var(--text-primary)' }}
              id="global-search"
            />
          </div>

          {/* Right */}
          <div className="flex items-center gap-5">
            {/* Theme Toggle */}
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center cursor-pointer transition-colors"
              style={{ background: 'var(--bg-input)', border: '1px solid var(--border-secondary)' }}
              onClick={toggleTheme}
              role="button"
              tabIndex={0}
              id="theme-toggle-btn"
              title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            >
              {theme === 'dark' ? (
                <svg className="w-4 h-4 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg className="w-4 h-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </div>

            {/* Notification Bell */}
            <div className="relative cursor-pointer" id="notification-bell">
              <svg className="w-5 h-5" style={{ color: 'var(--text-secondary)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2" style={{ borderColor: 'var(--bg-secondary)' }} />
            </div>

            {/* User Info */}
            <div className="flex items-center gap-3 pl-4 border-l" style={{ borderColor: 'var(--border-secondary)' }}>
              <div className="text-right">
                <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                  {user?.full_name || user?.email?.split('@')[0] || 'User'}
                </p>
                <p className="text-[10px] tracking-[0.1em] uppercase font-semibold" style={{ color: 'var(--text-muted)' }}>
                  Security Lead
                </p>
              </div>
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-accent-blue to-accent-light flex items-center justify-center text-white text-sm font-bold">
                {(user?.full_name?.[0] || user?.email?.[0] || 'U').toUpperCase()}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 px-8 py-6">
          {children}
        </main>

        {/* Footer */}
        <footer
          className="border-t px-8 py-5"
          style={{ borderColor: 'var(--border-primary)' }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm tracking-wider uppercase" style={{ color: 'var(--text-primary)' }}>
                Privora
              </span>
              <span className="text-[10px] tracking-[0.1em] uppercase" style={{ color: 'var(--text-muted)' }}>
                © 2026 Privora Cybersecurity. All Rights Reserved.
              </span>
            </div>
            <div className="flex items-center gap-6">
              {['Privacy Policy', 'Terms of Service', 'Compliance', 'Contact'].map((link) => (
                <span
                  key={link}
                  className="text-[10px] tracking-[0.1em] uppercase cursor-pointer transition-colors"
                  style={{ color: 'var(--text-muted)' }}
                  onMouseEnter={(e) => { e.target.style.color = 'var(--text-secondary)'; }}
                  onMouseLeave={(e) => { e.target.style.color = 'var(--text-muted)'; }}
                >
                  {link}
                </span>
              ))}
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
