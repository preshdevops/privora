import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';

export default function Dashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [score, setScore] = useState(null);
  const [encryptionCount, setEncryptionCount] = useState(0);
  const [logsCount, setLogsCount] = useState(0);
  const [recentLogs, setRecentLogs] = useState([]);
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [scoreRes, assetsRes, logsRes, alertsRes] = await Promise.allSettled([
          axiosInstance.get('/api/privacy/score/'),
          axiosInstance.get('/api/encryption/assets/'),
          axiosInstance.get('/api/audit/logs/'),
          axiosInstance.get('/api/audit/alerts/'),
        ]);

        if (scoreRes.status === 'fulfilled') setScore(scoreRes.value.data.score);
        if (assetsRes.status === 'fulfilled') {
          const d = assetsRes.value.data;
          setEncryptionCount(Array.isArray(d) ? d.length : d.results?.length || d.count || 0);
        }
        if (logsRes.status === 'fulfilled') {
          const d = logsRes.value.data;
          setLogsCount(d.count || (Array.isArray(d) ? d.length : 0));
          const items = d.results || (Array.isArray(d) ? d : []);
          setRecentLogs(items.slice(0, 4));
        }
        if (alertsRes.status === 'fulfilled') {
          const d = alertsRes.value.data;
          setAlerts(Array.isArray(d) ? d : d.results || []);
        }
      } catch {
        // silently fail, show empty state
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  const unresolvedAlerts = alerts.filter((a) => !a.resolved);

  // Skeleton block helper
  const Skeleton = ({ className }) => <div className={`skeleton ${className}`} />;

  const statusColor = (status) => {
    const s = (status || '').toLowerCase();
    if (s === 'completed' || s === 'success') return { bg: 'var(--badge-success-bg)', color: 'var(--badge-success-text)' };
    if (s === 'verified' || s === 'info') return { bg: 'var(--badge-info-bg)', color: 'var(--badge-info-text)' };
    if (s === 'blocked' || s === 'failed') return { bg: 'var(--badge-danger-bg)', color: 'var(--badge-danger-text)' };
    if (s === 'syncing' || s === 'warning') return { bg: 'var(--badge-warning-bg)', color: 'var(--badge-warning-text)' };
    return { bg: 'var(--badge-info-bg)', color: 'var(--badge-info-text)' };
  };

  const eventIcon = (event) => {
    const e = (event || '').toLowerCase();
    if (e.includes('rotation') || e.includes('key')) return '🔑';
    if (e.includes('login') || e.includes('auth')) return '🔓';
    if (e.includes('failed') || e.includes('block')) return '⚠️';
    if (e.includes('sync')) return '🔄';
    return '📋';
  };

  const formatTime = (dt) => {
    if (!dt) return '--';
    const now = new Date();
    const d = new Date(dt);
    const diff = Math.floor((now - d) / 1000);
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return d.toLocaleDateString();
  };

  return (
    <div className="animate-fade-in-up">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>Dashboard Overview</h1>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            System health and real-time encryption monitoring.
          </p>
        </div>
        <div
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium cursor-pointer transition-all border"
          style={{
            background: 'var(--bg-card)',
            borderColor: 'var(--border-secondary)',
            color: 'var(--text-primary)',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--text-muted)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border-secondary)'; }}
          role="button"
          tabIndex={0}
          id="export-audit-btn"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Export Audit
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-4 gap-5 mb-8">
        {/* Protection Score */}
        <div
          className="p-5 rounded-2xl border transition-all duration-300 hover:-translate-y-0.5"
          style={{ background: 'var(--bg-card)', borderColor: 'var(--border-primary)', boxShadow: 'var(--shadow-card)' }}
        >
          <p className="text-[10px] tracking-[0.2em] font-bold uppercase mb-3" style={{ color: 'var(--text-muted)' }}>
            Protection Score
          </p>
          {loading ? (
            <Skeleton className="h-16 w-full" />
          ) : (
            <div className="flex items-center justify-between">
              <div>
                <span className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>
                  {score ?? '--'}
                </span>
                <span className="text-sm" style={{ color: 'var(--text-muted)' }}>/100</span>
                <p className="text-xs text-emerald-400 mt-1">↗ +2% from yesterday</p>
              </div>
              <div className="relative w-14 h-14">
                <svg className="w-14 h-14 -rotate-90" viewBox="0 0 56 56">
                  <circle cx="28" cy="28" r="24" fill="none" stroke="var(--border-secondary)" strokeWidth="4" />
                  <circle
                    cx="28" cy="28" r="24" fill="none" stroke="#10b981" strokeWidth="4"
                    strokeDasharray={`${(score || 0) * 1.508} 150.8`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Active Encryptions */}
        <div
          className="p-5 rounded-2xl border transition-all duration-300 hover:-translate-y-0.5"
          style={{ background: 'var(--bg-card)', borderColor: 'var(--border-primary)', boxShadow: 'var(--shadow-card)' }}
        >
          <div className="flex items-center justify-between mb-3">
            <p className="text-[10px] tracking-[0.2em] font-bold uppercase" style={{ color: 'var(--text-muted)' }}>
              Active Encryptions
            </p>
            <span className="text-[9px] tracking-wider uppercase text-emerald-400 font-bold">Live</span>
          </div>
          {loading ? (
            <Skeleton className="h-16 w-full" />
          ) : (
            <>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: 'var(--bg-hover)' }}>
                  <svg className="w-5 h-5" style={{ color: 'var(--text-secondary)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <span className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>
                  {encryptionCount.toLocaleString()}
                </span>
              </div>
              <p className="text-[10px] mt-2" style={{ color: 'var(--text-muted)' }}>AES-256 Standard Active</p>
            </>
          )}
        </div>

        {/* Access Attempts */}
        <div
          className="p-5 rounded-2xl border transition-all duration-300 hover:-translate-y-0.5"
          style={{ background: 'var(--bg-card)', borderColor: 'var(--border-primary)', boxShadow: 'var(--shadow-card)' }}
        >
          <div className="flex items-center justify-between mb-3">
            <p className="text-[10px] tracking-[0.2em] font-bold uppercase" style={{ color: 'var(--text-muted)' }}>
              Access Attempts
            </p>
            <span className="text-[9px] tracking-wider uppercase font-bold" style={{ color: 'var(--text-muted)' }}>24H</span>
          </div>
          {loading ? (
            <Skeleton className="h-16 w-full" />
          ) : (
            <>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: 'var(--bg-hover)' }}>
                  <svg className="w-5 h-5" style={{ color: 'var(--text-secondary)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>
                  {logsCount.toLocaleString()}
                </span>
              </div>
              <p className="text-[10px] mt-2" style={{ color: 'var(--text-muted)' }}>No unauthorized ingress</p>
            </>
          )}
        </div>

        {/* Breach Alerts */}
        <div
          className="p-5 rounded-2xl border transition-all duration-300 hover:-translate-y-0.5"
          style={{ background: 'var(--bg-card)', borderColor: 'var(--border-primary)', boxShadow: 'var(--shadow-card)' }}
        >
          <div className="flex items-center justify-between mb-3">
            <p className="text-[10px] tracking-[0.2em] font-bold uppercase" style={{ color: 'var(--text-muted)' }}>
              Breach Alerts
            </p>
            {unresolvedAlerts.length > 0 && (
              <span className="text-[9px] tracking-wider uppercase font-bold text-red-400 px-2 py-0.5 rounded-full" style={{ background: 'var(--badge-danger-bg)' }}>
                Urgent
              </span>
            )}
          </div>
          {loading ? (
            <Skeleton className="h-16 w-full" />
          ) : (
            <>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-red-500/10">
                  <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.832c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <span className="text-3xl font-bold text-red-400">
                  {String(unresolvedAlerts.length).padStart(2, '0')}
                </span>
              </div>
              <p className="text-[10px] mt-2 text-red-400/70">Pending Investigation</p>
            </>
          )}
        </div>
      </div>

      {/* Security Audit Trail + Quick Actions */}
      <div className="grid grid-cols-12 gap-6 mb-8">
        {/* Audit Trail */}
        <div className="col-span-7">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>Security Audit Trail</h2>
            <span
              className="text-xs font-medium cursor-pointer transition-colors hover:underline"
              style={{ color: 'var(--text-secondary)' }}
              onClick={() => navigate('/access-logs')}
              role="button"
              tabIndex={0}
              id="view-full-log-btn"
            >
              View Full Log
            </span>
          </div>
          <div
            className="rounded-2xl border overflow-hidden"
            style={{ background: 'var(--bg-card)', borderColor: 'var(--border-primary)' }}
          >
            {/* Table Header */}
            <div
              className="grid grid-cols-4 px-5 py-3 text-[10px] tracking-[0.15em] uppercase font-bold border-b"
              style={{ color: 'var(--text-muted)', borderColor: 'var(--border-primary)' }}
            >
              <span>Event</span>
              <span>Data Item</span>
              <span>Time</span>
              <span>Status</span>
            </div>

            {/* Table Body */}
            {loading ? (
              [1, 2, 3, 4].map((i) => (
                <div key={i} className="px-5 py-4 border-b" style={{ borderColor: 'var(--border-primary)' }}>
                  <Skeleton className="h-5 w-full" />
                </div>
              ))
            ) : recentLogs.length === 0 ? (
              <div className="px-5 py-10 text-center" style={{ color: 'var(--text-muted)' }}>
                <p className="text-sm">No audit events recorded yet.</p>
              </div>
            ) : (
              recentLogs.map((log, idx) => {
                const st = statusColor(log.status || log.action);
                return (
                  <div
                    key={log.id || idx}
                    className="grid grid-cols-4 items-center px-5 py-3.5 border-b transition-colors"
                    style={{ borderColor: 'var(--border-primary)' }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--bg-hover)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                  >
                    <span className="flex items-center gap-2 text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                      <span>{eventIcon(log.action || log.event)}</span>
                      {log.action || log.event || 'Event'}
                    </span>
                    <span className="text-sm font-mono" style={{ color: 'var(--text-secondary)' }}>
                      {log.data_item || log.ip_address || '--'}
                    </span>
                    <span className="text-sm" style={{ color: 'var(--text-muted)' }}>
                      {formatTime(log.timestamp || log.created_at)}
                    </span>
                    <span
                      className="text-[10px] tracking-wider uppercase font-bold px-3 py-1 rounded-full w-fit"
                      style={{ background: st.bg, color: st.color }}
                    >
                      {log.status || 'Info'}
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="col-span-5">
          <h2 className="text-base font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3">
            {[
              {
                label: 'Encrypt New File',
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                ),
                onClick: () => navigate('/my-data'),
                accent: true,
              },
              {
                label: 'Revoke Access',
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                ),
                onClick: () => {},
                accent: false,
              },
              {
                label: 'Download Data',
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                ),
                onClick: () => {},
                accent: false,
              },
              {
                label: 'Security Scan',
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                ),
                onClick: () => {},
                accent: true,
              },
            ].map((action) => (
              <div
                key={action.label}
                className="flex flex-col items-center justify-center gap-3 p-5 rounded-2xl border cursor-pointer transition-all duration-300 hover:-translate-y-0.5"
                style={{
                  background: action.accent
                    ? 'linear-gradient(135deg, rgba(37, 99, 235, 0.15), rgba(37, 99, 235, 0.05))'
                    : 'var(--bg-card)',
                  borderColor: action.accent ? 'rgba(37, 99, 235, 0.3)' : 'var(--border-primary)',
                  color: 'var(--text-primary)',
                }}
                onClick={action.onClick}
                role="button"
                tabIndex={0}
                id={`quick-action-${action.label.toLowerCase().replace(/\s/g, '-')}`}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{
                    background: action.accent ? 'rgba(37, 99, 235, 0.2)' : 'var(--bg-hover)',
                    color: action.accent ? '#60a5fa' : 'var(--text-secondary)',
                  }}
                >
                  {action.icon}
                </div>
                <span className="text-xs font-semibold">{action.label}</span>
              </div>
            ))}
          </div>

          {/* Global Ingress Map Placeholder */}
          <div
            className="mt-4 rounded-2xl border overflow-hidden"
            style={{ background: 'var(--bg-card)', borderColor: 'var(--border-primary)' }}
          >
            <p className="text-[10px] tracking-[0.15em] uppercase font-bold px-4 pt-4" style={{ color: 'var(--text-muted)' }}>
              Global Ingress Map
            </p>
            <div
              className="mx-4 my-3 h-32 rounded-xl flex items-end justify-between p-3"
              style={{
                background: 'linear-gradient(135deg, #0f172a, #1e293b)',
                backgroundImage: 'radial-gradient(circle at 30% 50%, rgba(37,99,235,0.1) 0%, transparent 50%), radial-gradient(circle at 70% 30%, rgba(16,185,129,0.08) 0%, transparent 50%)',
              }}
            >
              <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                Last update: 12 seconds ago
              </span>
              <span className="text-[10px] flex items-center gap-1.5 text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                Live Stream
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
