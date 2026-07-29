import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../api/axiosInstance';
import SecurityActionBtn from '../components/SecurityActionBtn';
import { 
  ShieldCheck, 
  Share2, 
  EyeOff, 
  Cookie, 
  MapPin, 
  Fingerprint, 
  Sliders, 
  User, 
  Sun, 
  Moon, 
  AlertTriangle,
  Save
} from 'lucide-react';

export default function Settings() {
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
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
      const scoreRes = await axiosInstance.get('/api/privacy/score/');
      setScore(scoreRes.data.score);
    } catch {
      setSettings((prev) => ({ ...prev, [key]: !newVal }));
    }
  };

  const handleSaveAccount = async () => {
    try {
      await axiosInstance.patch('/api/users/settings/', {
        session_timeout: parseInt(sessionTimeout, 10),
        data_retention: parseInt(dataRetention, 10),
      });
    } catch (err) {
      throw err;
    }
  };

  const privacyToggles = [
    {
      key: 'tracking_protection',
      label: 'Tracking Protection',
      desc: 'Block third-party trackers and cross-site tracking.',
      icon: ShieldCheck
    },
    {
      key: 'data_sharing',
      label: 'Data Sharing',
      desc: 'Allow anonymised usage data to improve security.',
      icon: Share2
    },
    {
      key: 'ad_blocking',
      label: 'Ad & Script Blocking',
      desc: 'Block ads and unnecessary scripts from loading.',
      icon: EyeOff
    },
    {
      key: 'cookie_control',
      label: 'Cookie Control',
      desc: 'Reject non-essential cookies and clear them on close.',
      icon: Cookie
    },
    {
      key: 'location_masking',
      label: 'Location Privacy',
      desc: 'Hide your IP and location from third-party services.',
      icon: MapPin
    },
    {
      key: 'fingerprint_defense',
      label: 'Fingerprint Protection',
      desc: 'Prevent websites from identifying your device.',
      icon: Fingerprint
    },
  ];

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Header */}
      <div>
        <span className="text-xs font-mono text-[var(--accent-brass)] uppercase tracking-widest flex items-center gap-1.5">
          <Sliders className="w-3.5 h-3.5" />
          Settings
        </span>
        <h1 className="text-3xl font-serif font-semibold text-[var(--text-primary)] mt-1">
          Privacy & Account Settings
        </h1>
        <p className="text-xs text-[var(--text-secondary)] mt-1">
          Control your privacy preferences, session rules, and account details.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Controls Column */}
        <div className="lg:col-span-8 space-y-6">
          {/* Privacy Toggles */}
          <div className="layered-card p-6 rounded-sm space-y-4">
            <div className="pb-3 border-b border-[var(--border-primary)]">
              <h2 className="text-lg font-serif text-[var(--text-primary)]">
                Privacy Controls
              </h2>
              <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                Choose which protections are active on your account.
              </p>
            </div>

            {loading ? (
              <div className="space-y-4 py-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="skeleton h-12 w-full" />
                ))}
              </div>
            ) : (
              <div className="divide-y divide-[var(--border-primary)]">
                {privacyToggles.map((item) => {
                  const Icon = item.icon;
                  const active = settings[item.key];
                  return (
                    <div
                      key={item.key}
                      className="py-4 flex items-start justify-between gap-4"
                    >
                      <div className="flex items-start gap-3 min-w-0">
                        <div className="p-2 rounded bg-[var(--bg-input)] text-[var(--accent-brass)] shrink-0 mt-0.5">
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <h3 className="text-xs font-medium text-[var(--text-primary)]">
                            {item.label}
                          </h3>
                          <p className="text-[11px] text-[var(--text-secondary)] mt-0.5 leading-relaxed">
                            {item.desc}
                          </p>
                        </div>
                      </div>

                      <div
                        onClick={() => handleToggle(item.key)}
                        className={`toggle-track shrink-0 ${active ? 'active' : 'inactive'}`}
                        role="switch"
                        aria-checked={active}
                        tabIndex={0}
                        id={`toggle-${item.key}`}
                      >
                        <div className="toggle-thumb" />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Account Preferences */}
          <div className="layered-card p-6 rounded-sm space-y-6">
            <div className="pb-3 border-b border-[var(--border-primary)]">
              <h2 className="text-lg font-serif text-[var(--text-primary)]">
                Session & Data Retention
              </h2>
              <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                How long you stay signed in and how long activity logs are kept.
              </p>
            </div>

            <div className="space-y-4 text-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <label className="text-[var(--text-primary)] font-medium block">
                    Session Timeout
                  </label>
                  <span className="text-[10px] text-[var(--text-tertiary)] block">
                    How long before you're automatically signed out.
                  </span>
                </div>
                <select
                  value={sessionTimeout}
                  onChange={(e) => setSessionTimeout(e.target.value)}
                  className="px-3 py-2 rounded-sm bg-[var(--bg-input)] border border-[var(--border-primary)] text-[var(--text-primary)] outline-none"
                >
                  <option value="15">15 minutes</option>
                  <option value="30">30 minutes</option>
                  <option value="60">1 hour</option>
                  <option value="120">2 hours</option>
                </select>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-3 border-t border-[var(--border-primary)]">
                <div>
                  <label className="text-[var(--text-primary)] font-medium block">
                    Log Retention
                  </label>
                  <span className="text-[10px] text-[var(--text-tertiary)] block">
                    How long activity logs are kept before automatic deletion.
                  </span>
                </div>
                <select
                  value={dataRetention}
                  onChange={(e) => setDataRetention(e.target.value)}
                  className="px-3 py-2 rounded-sm bg-[var(--bg-input)] border border-[var(--border-primary)] text-[var(--text-primary)] outline-none"
                >
                  <option value="30">30 days</option>
                  <option value="90">90 days</option>
                  <option value="180">180 days</option>
                  <option value="365">365 days</option>
                </select>
              </div>
            </div>

            <div className="pt-4 border-t border-[var(--border-primary)] flex justify-end">
              <SecurityActionBtn
                onClick={handleSaveAccount}
                actionLabel="Saving…"
                successLabel="Saved"
                delayMs={700}
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Changes</span>
              </SecurityActionBtn>
            </div>
          </div>
        </div>

        {/* Side Column */}
        <div className="lg:col-span-4 space-y-6">
          {/* Protection Score */}
          <div className="layered-card p-6 rounded-sm text-center">
            <span className="text-[10px] font-mono uppercase text-[var(--text-tertiary)] tracking-widest block mb-3">
              Protection Score
            </span>
            <div className="w-28 h-28 mx-auto rounded-full bg-[var(--bg-input)] border border-[var(--border-accent)] flex flex-col items-center justify-center my-4 shadow-[var(--shadow-layered)]">
              <span className="text-3xl font-serif font-semibold text-[var(--accent-brass)]">
                {score ?? '--'}
              </span>
              <span className="text-[10px] font-mono text-[var(--text-muted)]">/ 100</span>
            </div>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              Your score updates as you adjust privacy settings and protect files.
            </p>
          </div>

          {/* User Info */}
          <div className="layered-card p-5 rounded-sm space-y-3">
            <div className="flex items-center gap-2 pb-2 border-b border-[var(--border-primary)] text-xs font-serif text-[var(--text-primary)]">
              <User className="w-4 h-4 text-[var(--accent-brass)]" />
              <span>Your Account</span>
            </div>
            <div className="space-y-2 text-xs">
              <div>
                <span className="text-[10px] text-[var(--text-tertiary)] uppercase block">Full Name</span>
                <span className="text-[var(--text-primary)]">{user?.full_name || 'N/A'}</span>
              </div>
              <div>
                <span className="text-[10px] text-[var(--text-tertiary)] uppercase block">Email</span>
                <span className="text-[var(--text-primary)] truncate block">{user?.email || 'N/A'}</span>
              </div>
            </div>
          </div>

          {/* Theme Preferences */}
          <div className="layered-card p-5 rounded-sm flex items-center justify-between">
            <div className="flex items-center gap-3">
              {theme === 'dark' ? (
                <Moon className="w-4 h-4 text-[var(--accent-brass)]" />
              ) : (
                <Sun className="w-4 h-4 text-[var(--text-secondary)]" />
              )}
              <div>
                <span className="text-xs font-medium text-[var(--text-primary)] block">
                  {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
                </span>
                <span className="text-[10px] text-[var(--text-tertiary)]">Appearance</span>
              </div>
            </div>
            <button
              onClick={toggleTheme}
              className="px-3 py-1 text-xs bg-[var(--bg-input)] hover:bg-[var(--bg-hover)] border border-[var(--border-primary)] text-[var(--text-primary)] rounded-sm"
            >
              Toggle
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
