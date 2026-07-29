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
      desc: 'Block third-party tracking vectors and unauthorized cross-site telemetry.',
      icon: ShieldCheck
    },
    {
      key: 'data_sharing',
      label: 'Data Sharing',
      desc: 'Allow anonymized metadata sharing for security threat intelligence.',
      icon: Share2
    },
    {
      key: 'ad_blocking',
      label: 'Ad & Script Isolation',
      desc: 'Prevent non-essential dynamic scripts and network trackers from loading.',
      icon: EyeOff
    },
    {
      key: 'cookie_control',
      label: 'Strict Cookie Control',
      desc: 'Reject non-essential storage cookies and wipe session tokens on close.',
      icon: Cookie
    },
    {
      key: 'location_masking',
      label: 'Location Masking',
      desc: 'Obfuscate client IP and geo-location headers from third-party requests.',
      icon: MapPin
    },
    {
      key: 'fingerprint_defense',
      label: 'Fingerprint Defense',
      desc: 'Disrupt browser canvas and WebGL hardware fingerprinting scripts.',
      icon: Fingerprint
    },
  ];

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Header */}
      <div>
        <span className="text-xs font-mono text-[var(--accent-brass)] uppercase tracking-widest flex items-center gap-1.5">
          <Sliders className="w-3.5 h-3.5" />
          Privacy & Security Configuration
        </span>
        <h1 className="text-3xl font-serif font-semibold text-[var(--text-primary)] mt-1">
          Vault Settings
        </h1>
        <p className="text-xs text-[var(--text-secondary)] mt-1">
          Configure NDPR 2023 compliance toggles, session expiration, and identity preferences.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Controls Column */}
        <div className="lg:col-span-8 space-y-6">
          {/* Privacy Toggles */}
          <div className="layered-card p-6 rounded-sm space-y-4">
            <div className="pb-3 border-b border-[var(--border-primary)]">
              <h2 className="text-lg font-serif text-[var(--text-primary)]">
                Privacy Protections (NDPR / GDPR)
              </h2>
              <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                Toggle data defense mechanisms to enforce personal data minimization.
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

          {/* Account & Session Preferences */}
          <div className="layered-card p-6 rounded-sm space-y-6">
            <div className="pb-3 border-b border-[var(--border-primary)]">
              <h2 className="text-lg font-serif text-[var(--text-primary)]">
                Session & Data Lifecycle
              </h2>
              <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                Manage automated session timeouts and telemetry retention policies.
              </p>
            </div>

            <div className="space-y-4 text-xs font-mono">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <label className="text-[var(--text-primary)] font-medium block">
                    Session Timeout
                  </label>
                  <span className="text-[10px] text-[var(--text-tertiary)] block">
                    Inactivity threshold before automatic session revocation.
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
                    Telemetry Retention
                  </label>
                  <span className="text-[10px] text-[var(--text-tertiary)] block">
                    Automatic deletion cycle for audit logs.
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
                actionLabel="Persisting Config..."
                successLabel="Saved"
                delayMs={700}
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Account Settings</span>
              </SecurityActionBtn>
            </div>
          </div>
        </div>

        {/* Identity & Score Side Column */}
        <div className="lg:col-span-4 space-y-6">
          {/* Dynamic Protection Score */}
          <div className="layered-card p-6 rounded-sm text-center">
            <span className="text-[10px] font-mono uppercase text-[var(--text-tertiary)] tracking-widest block mb-3">
              Computed Protection Index
            </span>
            <div className="w-28 h-28 mx-auto rounded-full bg-[var(--bg-input)] border border-[var(--border-accent)] flex flex-col items-center justify-center my-4 shadow-[var(--shadow-layered)]">
              <span className="text-3xl font-serif font-semibold text-[var(--accent-brass)]">
                {score ?? '--'}
              </span>
              <span className="text-[10px] font-mono text-[var(--text-muted)]">/ 100</span>
            </div>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              Score dynamically updates as you adjust privacy controls and encrypt data assets.
            </p>
          </div>

          {/* User Identity */}
          <div className="layered-card p-5 rounded-sm space-y-3">
            <div className="flex items-center gap-2 pb-2 border-b border-[var(--border-primary)] text-xs font-serif text-[var(--text-primary)]">
              <User className="w-4 h-4 text-[var(--accent-brass)]" />
              <span>Data Subject Identity</span>
            </div>
            <div className="space-y-2 text-xs font-mono">
              <div>
                <span className="text-[10px] text-[var(--text-tertiary)] uppercase block">Full Name</span>
                <span className="text-[var(--text-primary)]">{user?.full_name || 'N/A'}</span>
              </div>
              <div>
                <span className="text-[10px] text-[var(--text-tertiary)] uppercase block">Email Address</span>
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
                  {theme === 'dark' ? 'Ink-Navy Mode' : 'Parchment Mode'}
                </span>
                <span className="text-[10px] font-mono text-[var(--text-tertiary)]">Visual System Theme</span>
              </div>
            </div>
            <button
              onClick={toggleTheme}
              className="px-3 py-1 text-xs font-mono bg-[var(--bg-input)] hover:bg-[var(--bg-hover)] border border-[var(--border-primary)] text-[var(--text-primary)] rounded-sm"
            >
              Toggle
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
