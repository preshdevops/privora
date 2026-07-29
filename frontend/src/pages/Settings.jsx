import { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../api/axiosInstance';
import SecurityActionBtn from '../components/SecurityActionBtn';

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
      label: 'Tracking protection',
      desc: 'Block third-party trackers and cross-site telemetry.',
    },
    {
      key: 'data_sharing',
      label: 'Data sharing',
      desc: 'Allow anonymised usage data to improve security.',
    },
    {
      key: 'ad_blocking',
      label: 'Ad and script blocking',
      desc: 'Block ads and unverified external scripts from loading.',
    },
    {
      key: 'cookie_control',
      label: 'Cookie control',
      desc: 'Reject non-essential cookies and clear them on close.',
    },
    {
      key: 'location_masking',
      label: 'Location privacy',
      desc: 'Hide IP and location from third-party services.',
    },
    {
      key: 'fingerprint_defense',
      label: 'Fingerprint protection',
      desc: 'Prevent websites from identifying your device.',
    },
  ];

  return (
    <div className="space-y-12">
      {/* Header */}
      <header className="space-y-2 border-b border-[var(--border-primary)] pb-8">
        <span className="text-xs font-mono text-[var(--accent-brass)] tracking-widest uppercase block">
          SETTINGS
        </span>
        <h1 className="text-3xl sm:text-4xl font-serif text-[var(--text-primary)] mt-1">
          Privacy & account preferences
        </h1>
        <p className="text-sm text-[var(--text-secondary)] leading-relaxed max-w-xl">
          Control your privacy toggles, session rules, and log retention schedule.
        </p>
      </header>

      {/* Account Info Summary */}
      <section className="space-y-3 pb-6 border-b border-[var(--border-primary)] text-sm">
        <h2 className="text-xl font-serif text-[var(--text-primary)]">
          Member account
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-[var(--text-secondary)]">
          <div>
            <span className="text-[var(--text-tertiary)] block">Full name</span>
            <span className="text-[var(--text-primary)] font-medium">{user?.full_name || 'N/A'}</span>
          </div>
          <div>
            <span className="text-[var(--text-tertiary)] block">Email address</span>
            <span className="text-[var(--text-primary)] font-medium">{user?.email || 'N/A'}</span>
          </div>
        </div>
      </section>

      {/* Privacy Toggles — Ledger Rule List */}
      <section className="space-y-4">
        <h2 className="text-xl font-serif text-[var(--text-primary)]">
          Privacy controls
        </h2>

        {loading ? (
          <div className="py-6 text-xs font-mono text-[var(--text-tertiary)]">
            Loading settings…
          </div>
        ) : (
          <div className="ledger-list">
            {privacyToggles.map((item) => {
              const active = settings[item.key];
              return (
                <div key={item.key} className="ledger-entry flex items-center justify-between py-4">
                  <div className="space-y-0.5">
                    <span className="text-sm font-medium text-[var(--text-primary)] block">
                      {item.label}
                    </span>
                    <span className="text-xs text-[var(--text-secondary)] block">
                      {item.desc}
                    </span>
                  </div>

                  <div
                    onClick={() => handleToggle(item.key)}
                    className={`toggle-track shrink-0 ${active ? 'active' : 'inactive'}`}
                    role="switch"
                    aria-checked={active}
                    tabIndex={0}
                  >
                    <div className="toggle-thumb" />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Session Rules & Data Retention */}
      <section className="space-y-6 pt-4">
        <h2 className="text-xl font-serif text-[var(--text-primary)]">
          Session & log retention
        </h2>

        <div className="ledger-list text-sm">
          <div className="ledger-entry flex flex-col sm:flex-row sm:items-center justify-between gap-2 py-4">
            <div>
              <span className="font-medium text-[var(--text-primary)] block">Session timeout</span>
              <span className="text-xs text-[var(--text-secondary)]">Automatic sign-out after inactivity</span>
            </div>
            <select
              value={sessionTimeout}
              onChange={(e) => setSessionTimeout(e.target.value)}
              className="px-3 py-2 rounded-sm bg-[var(--bg-input)] border border-[var(--border-primary)] text-xs text-[var(--text-primary)] outline-none"
            >
              <option value="15">15 minutes</option>
              <option value="30">30 minutes</option>
              <option value="60">1 hour</option>
              <option value="120">2 hours</option>
            </select>
          </div>

          <div className="ledger-entry flex flex-col sm:flex-row sm:items-center justify-between gap-2 py-4">
            <div>
              <span className="font-medium text-[var(--text-primary)] block">Log retention</span>
              <span className="text-xs text-[var(--text-secondary)] font-sans">Automatic purge schedule for audit entries</span>
            </div>
            <select
              value={dataRetention}
              onChange={(e) => setDataRetention(e.target.value)}
              className="px-3 py-2 rounded-sm bg-[var(--bg-input)] border border-[var(--border-primary)] text-xs text-[var(--text-primary)] outline-none"
            >
              <option value="30">30 days</option>
              <option value="90">90 days</option>
              <option value="180">180 days</option>
              <option value="365">365 days</option>
            </select>
          </div>
        </div>

        <div className="pt-4 flex justify-end">
          <SecurityActionBtn
            onClick={handleSaveAccount}
            actionLabel="Saving…"
            successLabel="Saved"
            delayMs={650}
          >
            <span>Save preferences</span>
          </SecurityActionBtn>
        </div>
      </section>
    </div>
  );
}
