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
      icon: '🛡️',
    },
    {
      key: 'data_sharing',
      label: 'Data Sharing',
      desc: 'Allow anonymized data sharing for service improvement and threat intelligence.',
      icon: '📤',
    },
    {
      key: 'ad_blocking',
      label: 'Ad & Script Blocking',
      desc: 'Prevent invasive advertisements and potentially malicious scripts from loading.',
      icon: '🚫',
    },
    {
      key: 'cookie_control',
      label: 'Cookie Control',
      desc: 'Automatically reject non-essential cookies and clear tracking cookies on session end.',
      icon: '🍪',
    },
    {
      key: 'location_masking',
      label: 'Location Masking',
      desc: 'Mask your real IP and geolocation from third-party services.',
      icon: '📍',
    },
    {
      key: 'fingerprint_defense',
      label: 'Fingerprint Defense',
      desc: 'Prevent browser fingerprinting techniques used to identify your device.',
      icon: '🔏',
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
        <p className="text-[10px] tracking-[0.2em] uppercase font-bold mb-2" style={{ color: 'var(--text-muted)' }}>
          ⚙️ Configuration
        </p>
        <h1 className="text-2xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>Settings</h1>
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          Manage your privacy controls, account preferences, and security configuration.
        </p>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Left Column — Privacy Controls */}
        <div className="col-span-8 space-y-6">
          {/* Privacy Controls Section */}
          <div
            className="rounded-2xl border p-6"
            style={{ background: 'var(--bg-card)', borderColor: 'var(--border-primary)' }}
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>Privacy Controls</h2>
                <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
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
                    <Skeleton className="h-6 w-11 rounded-full" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-1">
                {privacyToggles.map((toggle) => (
                  <div
                    key={toggle.key}
                    className="flex items-center justify-between py-3.5 px-4 rounded-xl transition-colors"
                    onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--bg-hover)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-lg">{toggle.icon}</span>
                      <div>
                        <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{toggle.label}</p>
                        <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{toggle.desc}</p>
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
            className="rounded-2xl border p-6"
            style={{ background: 'var(--bg-card)', borderColor: 'var(--border-primary)' }}
          >
            <h2 className="text-base font-bold mb-1" style={{ color: 'var(--text-primary)' }}>Account Settings</h2>
            <p className="text-xs mb-6" style={{ color: 'var(--text-muted)' }}>
              Configure session and data management preferences.
            </p>

            <div className="space-y-5">
              {/* Session Timeout */}
              <div className="grid grid-cols-2 items-center gap-4">
                <div>
                  <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Session Timeout</p>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>Auto-logout after inactivity period.</p>
                </div>
                <select
                  value={sessionTimeout}
                  onChange={(e) => setSessionTimeout(e.target.value)}
                  className="px-4 py-2.5 rounded-lg text-sm appearance-none cursor-pointer"
                  style={{ background: 'var(--bg-input)', border: '1px solid var(--border-secondary)', color: 'var(--text-primary)' }}
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
              <div className="grid grid-cols-2 items-center gap-4">
                <div>
                  <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Data Retention</p>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>How long to keep audit logs and activity data.</p>
                </div>
                <select
                  value={dataRetention}
                  onChange={(e) => setDataRetention(e.target.value)}
                  className="px-4 py-2.5 rounded-lg text-sm appearance-none cursor-pointer"
                  style={{ background: 'var(--bg-input)', border: '1px solid var(--border-secondary)', color: 'var(--text-primary)' }}
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
              <div className="flex items-center justify-between pt-3 border-t" style={{ borderColor: 'var(--border-primary)' }}>
                {saveMessage && (
                  <span className={`text-xs font-medium ${saveMessage.includes('success') ? 'text-emerald-400' : 'text-red-400'}`}>
                    {saveMessage}
                  </span>
                )}
                <div className="ml-auto">
                  <div
                    className={`px-6 py-2.5 rounded-xl text-sm font-semibold cursor-pointer transition-all duration-200 ${
                      saving
                        ? 'bg-accent-blue/50 cursor-not-allowed text-white/60'
                        : 'bg-accent-blue text-white hover:bg-accent-glow hover:shadow-lg hover:shadow-accent-blue/25 active:scale-[0.97]'
                    }`}
                    onClick={saving ? undefined : handleSaveAccount}
                    role="button"
                    tabIndex={0}
                    id="save-settings-btn"
                  >
                    {saving ? (
                      <span className="flex items-center gap-2">
                        <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Saving...
                      </span>
                    ) : (
                      'Save Changes'
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column — Score + Appearance */}
        <div className="col-span-4 space-y-6">
          {/* Protection Score */}
          <div
            className="rounded-2xl border p-6 text-center"
            style={{ background: 'var(--bg-card)', borderColor: 'var(--border-primary)' }}
          >
            <p className="text-[10px] tracking-[0.2em] uppercase font-bold mb-5" style={{ color: 'var(--text-muted)' }}>
              Protection Score
            </p>
            {loading ? (
              <Skeleton className="w-28 h-28 mx-auto rounded-full" />
            ) : (
              <div className="relative w-32 h-32 mx-auto mb-4">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 128 128">
                  <circle cx="64" cy="64" r="56" fill="none" stroke="var(--border-secondary)" strokeWidth="8" />
                  <circle
                    cx="64" cy="64" r="56" fill="none"
                    stroke={score >= 70 ? '#10b981' : score >= 40 ? '#f59e0b' : '#ef4444'}
                    strokeWidth="8"
                    strokeDasharray={`${(score || 0) * 3.518} 351.8`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>{score ?? '--'}</span>
                  <span className="text-[10px] uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>/ 100</span>
                </div>
              </div>
            )}
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
              {score >= 70 ? 'Your privacy protection is strong.' : score >= 40 ? 'Consider enabling more protections.' : 'Action needed to improve your score.'}
            </p>
          </div>

          {/* Appearance */}
          <div
            className="rounded-2xl border p-6"
            style={{ background: 'var(--bg-card)', borderColor: 'var(--border-primary)' }}
          >
            <h2 className="text-base font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Appearance</h2>
            <div className="flex items-center justify-between py-3">
              <div className="flex items-center gap-3">
                <span className="text-lg">{theme === 'dark' ? '🌙' : '☀️'}</span>
                <div>
                  <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                    {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
                  </p>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                    Toggle between light and dark themes.
                  </p>
                </div>
              </div>
              <Toggle active={theme === 'dark'} onClick={toggleTheme} id="theme-toggle-settings" />
            </div>
          </div>

          {/* Account Info */}
          <div
            className="rounded-2xl border p-6"
            style={{ background: 'var(--bg-card)', borderColor: 'var(--border-primary)' }}
          >
            <h2 className="text-base font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Account</h2>
            <div className="space-y-3">
              <div>
                <p className="text-[10px] tracking-[0.15em] uppercase font-bold" style={{ color: 'var(--text-muted)' }}>Name</p>
                <p className="text-sm mt-0.5" style={{ color: 'var(--text-primary)' }}>
                  {user?.full_name || user?.email?.split('@')[0] || '--'}
                </p>
              </div>
              <div>
                <p className="text-[10px] tracking-[0.15em] uppercase font-bold" style={{ color: 'var(--text-muted)' }}>Email</p>
                <p className="text-sm mt-0.5" style={{ color: 'var(--text-primary)' }}>{user?.email || '--'}</p>
              </div>
              <div>
                <p className="text-[10px] tracking-[0.15em] uppercase font-bold" style={{ color: 'var(--text-muted)' }}>Role</p>
                <p className="text-sm mt-0.5" style={{ color: 'var(--text-primary)' }}>{user?.role || 'Security Lead'}</p>
              </div>
            </div>
          </div>

          {/* Danger Zone */}
          <div
            className="rounded-2xl border p-6"
            style={{ background: 'var(--bg-card)', borderColor: 'var(--badge-danger-bg)' }}
          >
            <h2 className="text-base font-bold mb-1 text-red-400">Danger Zone</h2>
            <p className="text-xs mb-4" style={{ color: 'var(--text-muted)' }}>
              Irreversible actions. Proceed with extreme caution.
            </p>
            <div
              className="w-full py-2.5 rounded-xl text-sm font-semibold text-center cursor-pointer transition-all text-red-400 border border-red-500/30 hover:bg-red-500/10"
              role="button"
              tabIndex={0}
              id="delete-account-btn"
            >
              Delete Account
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
