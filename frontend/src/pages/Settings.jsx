import { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../api/axiosInstance';

export default function Settings() {
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [score, setScore] = useState(null);
  const [settings, setSettings] = useState({
    tracking_protection: true,
    data_sharing: false,
    ad_blocking: true,
    cookie_control: true,
    location_masking: false,
    fingerprint_defense: true,
  });
  const [sessionTimeout, setSessionTimeout] = useState('30');
  const [dataRetention, setDataRetention] = useState('90');
  const [saveMessage, setSaveMessage] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [settingsRes, scoreRes, userRes] = await Promise.allSettled([
          axiosInstance.get('/api/privacy/settings/'),
          axiosInstance.get('/api/privacy/score/'),
          axiosInstance.get('/api/users/me/'),
        ]);

        if (settingsRes.status === 'fulfilled') {
          const d = settingsRes.value.data;
          setSettings((prev) => ({ ...prev, ...d }));
        }
        if (scoreRes.status === 'fulfilled') {
          setScore(scoreRes.value.data.score);
        }
        if (userRes.status === 'fulfilled') {
          const u = userRes.value.data;
          if (u.session_timeout) setSessionTimeout(String(u.session_timeout));
          if (u.data_retention) setDataRetention(String(u.data_retention));
        }
      } catch {
        // use defaults
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  const handleToggle = async (key) => {
    const newVal = !settings[key];
    setSettings((prev) => ({ ...prev, [key]: newVal }));
    try {
      await axiosInstance.patch('/api/privacy/settings/', { [key]: newVal });
      // refresh score
      const scoreRes = await axiosInstance.get('/api/privacy/score/');
      setScore(scoreRes.data.score);
    } catch {
      // revert on error
      setSettings((prev) => ({ ...prev, [key]: !newVal }));
    }
  };

  const handleSaveAccount = async () => {
    if (saving) return;
    setSaving(true);
    try {
      await axiosInstance.patch('/api/users/settings/', {
        session_timeout: parseInt(sessionTimeout, 10),
        data_retention: parseInt(dataRetention, 10),
      });
      setSaveMessage('Settings saved successfully');
      setTimeout(() => setSaveMessage(''), 3000);
    } catch {
      setSaveMessage('Failed to save settings');
      setTimeout(() => setSaveMessage(''), 3000);
    }
    setSaving(false);
  };

  const privacyToggles = [
    {
      key: 'tracking_protection',
      label: 'Tracking Protection',
      desc: 'Block third-party trackers and analytics scripts from monitoring your activity.',
      icon: (
        <svg className="w-5 h-5" style={{ color: 'var(--accent-gold)' }} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="square" strokeLinejoin="miter" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
    },
    {
      key: 'data_sharing',
      label: 'Data Sharing',
      desc: 'Allow anonymized data sharing for service improvement and threat intelligence.',
      icon: (
        <svg className="w-5 h-5" style={{ color: 'var(--accent-gold)' }} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="square" strokeLinejoin="miter" d="M8.684 10.742l4.633-2.316m0 0a3 3 0 105.366-2.684 3 3 0 00-5.366 2.684zm0 9.496l-4.633-2.317m0 0a3 3 0 105.366 2.684 3 3 0 00-5.366-2.684z" />
        </svg>
      ),
    },
    {
      key: 'ad_blocking',
      label: 'Ad & Script Blocking',
      desc: 'Prevent invasive advertisements and potentially malicious scripts from loading.',
      icon: (
        <svg className="w-5 h-5" style={{ color: 'var(--accent-gold)' }} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="square" strokeLinejoin="miter" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
        </svg>
      ),
    },
    {
      key: 'cookie_control',
      label: 'Cookie Control',
      desc: 'Automatically reject non-essential cookies and clear tracking cookies on session end.',
      icon: (
        <svg className="w-5 h-5" style={{ color: 'var(--accent-gold)' }} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="square" strokeLinejoin="miter" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
        </svg>
      ),
    },
    {
      key: 'location_masking',
      label: 'Location Masking',
      desc: 'Mask your real IP and geolocation from third-party services.',
      icon: (
        <svg className="w-5 h-5" style={{ color: 'var(--accent-gold)' }} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="square" strokeLinejoin="miter" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="square" strokeLinejoin="miter" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
    },
    {
      key: 'fingerprint_defense',
      label: 'Fingerprint Defense',
      desc: 'Prevent browser fingerprinting techniques used to identify your device.',
      icon: (
        <svg className="w-5 h-5" style={{ color: 'var(--accent-gold)' }} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="square" strokeLinejoin="miter" d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
        </svg>
      ),
    },
  ];

  const Toggle = ({ active, onClick, id }) => (
    <div
      className={`toggle-track ${active ? 'active' : 'inactive'}`}
      onClick={onClick}
      role="switch"
      tabIndex={0}
      id={id}
    >
      <div className="toggle-thumb" />
    </div>
  );

  const Skeleton = ({ className }) => <div className={`skeleton ${className}`} />;

  return (
    <div className="animate-fade-in-up max-w-5xl">
      {/* Header */}
      <div className="mb-8">
        <p className="text-[10px] tracking-[0.2em] uppercase font-bold font-mono mb-2 flex items-center gap-1.5" style={{ color: 'var(--text-muted)' }}>
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="square" strokeLinejoin="miter" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="square" strokeLinejoin="miter" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          Configuration
        </p>
        <h1 className="text-3xl font-bold font-display mb-1" style={{ color: 'var(--text-primary)' }}>Settings</h1>
        <p className="text-sm font-sans" style={{ color: 'var(--text-secondary)' }}>
          Manage your privacy controls, account preferences, and security configuration.
        </p>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Left Column — Privacy Controls */}
        <div className="col-span-12 lg:col-span-8 space-y-6">
          {/* Privacy Controls Section */}
          <div
            className="rounded-none border p-6 shadow-[var(--shadow-card)]"
            style={{ background: 'var(--bg-card)', borderColor: 'var(--border-primary)' }}
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-bold font-display" style={{ color: 'var(--text-primary)' }}>Privacy Controls</h2>
                <p className="text-xs mt-1 font-sans" style={{ color: 'var(--text-muted)' }}>
                  Toggle privacy features to control your digital footprint.
                </p>
              </div>
            </div>

            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex items-center justify-between py-3">
                    <div className="flex-1">
                      <Skeleton className="h-4 w-40 mb-2" />
                      <Skeleton className="h-3 w-64" />
                    </div>
                    <Skeleton className="h-6 w-11 rounded-none" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-2 border-t pt-4" style={{ borderColor: 'var(--border-secondary)' }}>
                {privacyToggles.map((toggle) => (
                  <div
                    key={toggle.key}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-4 px-2 transition-colors border-b last:border-b-0"
                    style={{ borderColor: 'var(--border-secondary)' }}
                  >
                    <div className="flex items-start gap-4 min-w-0">
                      <span className="text-lg shrink-0 mt-1">{toggle.icon}</span>
                      <div className="min-w-0">
                        <p className="text-sm font-bold font-sans truncate" style={{ color: 'var(--text-primary)' }}>{toggle.label}</p>
                        <p className="text-[11px] mt-1 font-mono uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>{toggle.desc}</p>
                      </div>
                    </div>
                    <Toggle
                      active={settings[toggle.key]}
                      onClick={() => handleToggle(toggle.key)}
                      id={`toggle-${toggle.key}`}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Account Settings Section */}
          <div
            className="rounded-none border p-6 shadow-[var(--shadow-card)]"
            style={{ background: 'var(--bg-card)', borderColor: 'var(--border-primary)' }}
          >
            <h2 className="text-lg font-bold font-display mb-1" style={{ color: 'var(--text-primary)' }}>Account Settings</h2>
            <p className="text-xs mb-6 font-sans" style={{ color: 'var(--text-muted)' }}>
              Configure session and data management preferences.
            </p>

            <div className="space-y-6">
              {/* Session Timeout */}
              <div className="grid grid-cols-1 sm:grid-cols-2 items-start sm:items-center gap-4">
                <div>
                  <p className="text-sm font-bold font-sans" style={{ color: 'var(--text-primary)' }}>Session Timeout</p>
                  <p className="text-[11px] mt-1 font-mono uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Auto-logout after inactivity period.</p>
                </div>
                <select
                  value={sessionTimeout}
                  onChange={(e) => setSessionTimeout(e.target.value)}
                  className="w-full px-4 py-3 rounded-none text-sm appearance-none cursor-pointer border focus:border-[var(--accent-gold)] font-mono"
                  style={{ background: 'var(--bg-input)', borderColor: 'var(--border-secondary)', color: 'var(--text-primary)' }}
                  id="session-timeout-select"
                >
                  <option value="15">15 minutes</option>
                  <option value="30">30 minutes</option>
                  <option value="60">1 hour</option>
                  <option value="120">2 hours</option>
                  <option value="480">8 hours</option>
                </select>
              </div>

              {/* Data Retention */}
              <div className="grid grid-cols-1 sm:grid-cols-2 items-start sm:items-center gap-4">
                <div>
                  <p className="text-sm font-bold font-sans" style={{ color: 'var(--text-primary)' }}>Data Retention</p>
                  <p className="text-[11px] mt-1 font-mono uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>How long to keep audit logs and activity data.</p>
                </div>
                <select
                  value={dataRetention}
                  onChange={(e) => setDataRetention(e.target.value)}
                  className="w-full px-4 py-3 rounded-none text-sm appearance-none cursor-pointer border focus:border-[var(--accent-gold)] font-mono"
                  style={{ background: 'var(--bg-input)', borderColor: 'var(--border-secondary)', color: 'var(--text-primary)' }}
                  id="data-retention-select"
                >
                  <option value="30">30 days</option>
                  <option value="60">60 days</option>
                  <option value="90">90 days</option>
                  <option value="180">6 months</option>
                  <option value="365">1 year</option>
                </select>
              </div>

              {/* Save */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t" style={{ borderColor: 'var(--border-secondary)' }}>
                {saveMessage && (
                  <span className={`text-[10px] font-bold tracking-widest uppercase text-center sm:text-left font-mono ${saveMessage.includes('success') ? 'text-[var(--status-success)]' : 'text-[var(--status-danger)]'}`}>
                    {saveMessage}
                  </span>
                )}
                <div className="w-full sm:w-auto sm:ml-auto">
                  <div
                    className={`w-full sm:w-auto px-8 py-3 rounded-none text-sm font-bold text-center cursor-pointer transition-colors font-sans uppercase tracking-wider border ${
                      saving
                        ? 'opacity-50 cursor-not-allowed'
                        : ''
                    }`}
                    style={{ background: 'var(--text-primary)', color: 'var(--bg-primary)', borderColor: 'var(--text-primary)' }}
                    onMouseEnter={(e) => { if(!saving) e.currentTarget.style.opacity = '0.9'; }}
                    onMouseLeave={(e) => { if(!saving) e.currentTarget.style.opacity = '1'; }}
                    onClick={saving ? undefined : handleSaveAccount}
                    role="button"
                    tabIndex={0}
                    id="save-settings-btn"
                  >
                    {saving ? (
                      <span className="flex items-center justify-center gap-2">
                        <span className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        SAVING...
                      </span>
                    ) : (
                      'SAVE CHANGES'
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column — Score + Appearance */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          {/* Protection Score */}
          <div
            className="rounded-none border p-6 text-center shadow-[var(--shadow-card)]"
            style={{ background: 'var(--bg-card)', borderColor: 'var(--border-primary)' }}
          >
            <p className="text-[10px] tracking-[0.2em] uppercase font-bold mb-6 font-mono" style={{ color: 'var(--text-muted)' }}>
              Protection Score
            </p>
            {loading ? (
              <Skeleton className="w-28 h-28 mx-auto rounded-none border border-[var(--border-secondary)]" />
            ) : (
              <div className="relative w-32 h-32 mx-auto mb-5">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 128 128">
                  <circle cx="64" cy="64" r="56" fill="none" stroke="var(--border-secondary)" strokeWidth="4" />
                  <circle
                    cx="64" cy="64" r="56" fill="none"
                    stroke={score >= 70 ? 'var(--status-success)' : score >= 40 ? 'var(--status-warning)' : 'var(--status-danger)'}
                    strokeWidth="8"
                    strokeDasharray={`${(score || 0) * 3.518} 351.8`}
                    strokeLinecap="square"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-bold font-mono" style={{ color: 'var(--text-primary)' }}>{score ?? '--'}</span>
                  <span className="text-[10px] uppercase tracking-widest font-mono" style={{ color: 'var(--text-muted)' }}>/ 100</span>
                </div>
              </div>
            )}
            <p className="text-xs font-mono uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
              {score >= 70 ? 'Your privacy protection is strong.' : score >= 40 ? 'Consider enabling more protections.' : 'Action needed to improve your score.'}
            </p>
          </div>

          {/* Appearance */}
          <div
            className="rounded-none border p-6 shadow-[var(--shadow-card)]"
            style={{ background: 'var(--bg-card)', borderColor: 'var(--border-primary)' }}
          >
            <h2 className="text-lg font-bold font-display mb-4" style={{ color: 'var(--text-primary)' }}>Appearance</h2>
            <div className="flex items-center justify-between py-2 border-t" style={{ borderColor: 'var(--border-secondary)' }}>
              <div className="flex items-center gap-4 mt-3">
                <span className="text-lg flex items-center justify-center">
                  {theme === 'dark' ? (
                    <svg className="w-5 h-5" style={{ color: 'var(--accent-gold)' }} fill="currentColor" viewBox="0 0 20 20">
                      <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" style={{ color: 'var(--accent-gold)' }} fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464-5.536a1 1 0 011.414 0L16.364 5.88a1 1 0 11-1.414 1.414l-1.414-1.414a1 1 0 010-1.414zm-9.9 0a1 1 0 010 1.414L3.88 7.294a1 1 0 11-1.414-1.414l1.414-1.414a1 1 0 011.414 0zm12.728 9.9a1 1 0 011.414 0l1.414 1.414a1 1 0 11-1.414 1.414l-1.414-1.414a1 1 0 010-1.414zm-9.9 0a1 1 0 010 1.414l-1.414 1.414a1 1 0 11-1.414-1.414l1.414-1.414a1 1 0 011.414 0zM17 10a1 1 0 100-2h-1a1 1 0 100 2h1zm-14 0a1 1 0 100-2H2a1 1 0 100 2h1z" clipRule="evenodd" />
                    </svg>
                  )}
                </span>
                <div>
                  <p className="text-sm font-bold font-sans" style={{ color: 'var(--text-primary)' }}>
                    {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
                  </p>
                  <p className="text-[11px] mt-1 font-mono uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                    Toggle Theme
                  </p>
                </div>
              </div>
              <Toggle active={theme === 'dark'} onClick={toggleTheme} id="theme-toggle-settings" />
            </div>
          </div>

          {/* Account Info */}
          <div
            className="rounded-none border p-6 shadow-[var(--shadow-card)]"
            style={{ background: 'var(--bg-card)', borderColor: 'var(--border-primary)' }}
          >
            <h2 className="text-lg font-bold font-display mb-5" style={{ color: 'var(--text-primary)' }}>Identity</h2>
            <div className="space-y-4">
              <div className="border-l-2 pl-3" style={{ borderColor: 'var(--accent-gold)' }}>
                <p className="text-[10px] tracking-[0.2em] uppercase font-bold font-mono" style={{ color: 'var(--text-muted)' }}>Name</p>
                <p className="text-sm mt-1 font-bold font-sans" style={{ color: 'var(--text-primary)' }}>
                  {user?.full_name || user?.email?.split('@')[0] || '--'}
                </p>
              </div>
              <div className="border-l-2 pl-3" style={{ borderColor: 'var(--accent-gold)' }}>
                <p className="text-[10px] tracking-[0.2em] uppercase font-bold font-mono" style={{ color: 'var(--text-muted)' }}>Email</p>
                <p className="text-sm mt-1 font-bold font-sans truncate" style={{ color: 'var(--text-primary)' }}>{user?.email || '--'}</p>
              </div>
              <div className="border-l-2 pl-3" style={{ borderColor: 'var(--accent-gold)' }}>
                <p className="text-[10px] tracking-[0.2em] uppercase font-bold font-mono" style={{ color: 'var(--text-muted)' }}>Clearance</p>
                <p className="text-sm mt-1 font-bold font-sans" style={{ color: 'var(--text-primary)' }}>{user?.role || 'Security Lead'}</p>
              </div>
            </div>
          </div>

          {/* Danger Zone */}
          <div
            className="rounded-none border p-6 shadow-[var(--shadow-card)]"
            style={{ background: 'var(--bg-card)', borderColor: 'var(--status-danger)' }}
          >
            <h2 className="text-lg font-bold font-display mb-2 text-[var(--status-danger)]">Danger Zone</h2>
            <p className="text-xs mb-5 font-sans" style={{ color: 'var(--text-muted)' }}>
              Irreversible actions. Proceed with extreme caution.
            </p>
            <div
              className="w-full py-3 rounded-none text-sm font-bold text-center cursor-pointer transition-colors border uppercase tracking-wider"
              style={{ borderColor: 'var(--status-danger)', color: 'var(--status-danger)', background: 'transparent' }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--status-danger)'; e.currentTarget.style.color = '#fff'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--status-danger)'; }}
              role="button"
              tabIndex={0}
              id="delete-account-btn"
            >
              PURGE ACCOUNT
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
