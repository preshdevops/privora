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
          setRecentLogs(items.slice(0, 5));
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
    if (e.includes('rotation') || e.includes('key')) return (
      <svg className="w-4 h-4 inline" style={{ color: 'var(--accent-gold)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth={1.5} d="M15 7a2 2 0 012 2m-2-2a2 2 0 00-2 2m2-2a2.5 2.5 0 01.5.5m-5 5.5l-3 3v3h3v-3l3-3M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    );
    if (e.includes('login') || e.includes('auth')) return (
      <svg className="w-4 h-4 inline" style={{ color: 'var(--text-secondary)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth={1.5} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3" />
      </svg>
    );
    if (e.includes('failed') || e.includes('block')) return (
      <svg className="w-4 h-4 inline" style={{ color: 'var(--status-danger)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    );
    if (e.includes('sync')) return (
      <svg className="w-4 h-4 inline" style={{ color: 'var(--text-secondary)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      </svg>
    );
    return (
      <svg className="w-4 h-4 inline" style={{ color: 'var(--text-secondary)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
    );
  };

  const formatTime = (dt) => {
    if (!dt) return '--';
    const d = new Date(dt);
    return d.toISOString().replace('T', ' ').substring(0, 19);
  };

  return (
    <div className="animate-fade-in-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-1 font-display" style={{ color: 'var(--text-primary)' }}>Command Center</h1>
          <p className="text-sm font-sans" style={{ color: 'var(--text-secondary)' }}>
            System health and immutable ledger oversight.
          </p>
        </div>
        <div
          className="flex items-center justify-center gap-2 px-6 py-3 rounded-none text-sm font-bold cursor-pointer transition-colors border w-full sm:w-auto"
          style={{
            background: 'var(--bg-card)',
            borderColor: 'var(--border-primary)',
            color: 'var(--text-primary)',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--bg-hover)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--bg-card)'; }}
          role="button"
          tabIndex={0}
          id="export-audit-btn"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="square" strokeLinejoin="miter" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          EXPORT LEDGER
        </div>
      </div>

      {/* Dominant Score Element */}
      <div className="mb-6">
        <div 
          className="p-8 border rounded-none flex flex-col md:flex-row items-center justify-between"
          style={{ background: 'var(--bg-card)', borderColor: 'var(--border-primary)', boxShadow: 'var(--shadow-card)' }}
        >
          <div className="mb-6 md:mb-0">
            <p className="text-xs tracking-[0.2em] font-bold uppercase mb-2 font-mono" style={{ color: 'var(--text-muted)' }}>
              System Protection Index
            </p>
            <h2 className="text-xl font-display" style={{ color: 'var(--text-primary)' }}>Cryptographic Health</h2>
            <p className="text-sm mt-2 max-w-sm" style={{ color: 'var(--text-secondary)' }}>
              An aggregate score based on active encryptions, privacy configurations, and recent audit anomalies.
            </p>
          </div>
          
          <div className="flex items-center">
            {loading ? (
              <Skeleton className="h-32 w-32 rounded-full" />
            ) : (
              <div className="relative w-40 h-40">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="45" fill="none" stroke="var(--bg-hover)" strokeWidth="6" />
                  <circle
                    cx="50" cy="50" r="45" fill="none" stroke="var(--accent-gold)" strokeWidth="6"
                    strokeDasharray={`${(score || 0) * 2.827} 282.7`}
                    strokeLinecap="square"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-4xl font-bold font-mono" style={{ color: 'var(--text-primary)' }}>
                    {score ?? '--'}
                  </span>
                  <span className="text-[10px] tracking-widest font-mono mt-1" style={{ color: 'var(--text-muted)' }}>/100</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Secondary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
        {/* Active Encryptions */}
        <div
          className="p-6 border rounded-none"
          style={{ background: 'var(--bg-card)', borderColor: 'var(--border-primary)' }}
        >
          <p className="text-[10px] tracking-[0.2em] font-bold uppercase mb-4 font-mono" style={{ color: 'var(--text-muted)' }}>
            Active Encryptions
          </p>
          {loading ? (
            <Skeleton className="h-10 w-24" />
          ) : (
            <div className="flex items-end gap-3">
              <span className="text-4xl font-bold font-mono" style={{ color: 'var(--text-primary)' }}>
                {String(encryptionCount).padStart(3, '0')}
              </span>
              <span className="text-xs mb-1 font-mono" style={{ color: 'var(--status-success)' }}>SECURE</span>
            </div>
          )}
        </div>

        {/* Access Attempts */}
        <div
          className="p-6 border rounded-none"
          style={{ background: 'var(--bg-card)', borderColor: 'var(--border-primary)' }}
        >
          <p className="text-[10px] tracking-[0.2em] font-bold uppercase mb-4 font-mono" style={{ color: 'var(--text-muted)' }}>
            Access Requests (24h)
          </p>
          {loading ? (
            <Skeleton className="h-10 w-24" />
          ) : (
            <div className="flex items-end gap-3">
              <span className="text-4xl font-bold font-mono" style={{ color: 'var(--text-primary)' }}>
                {String(logsCount).padStart(3, '0')}
              </span>
              <span className="text-xs mb-1 font-mono" style={{ color: 'var(--status-info)' }}>LOGGED</span>
            </div>
          )}
        </div>

        {/* Breach Alerts */}
        <div
          className="p-6 border rounded-none"
          style={{ background: 'var(--bg-card)', borderColor: 'var(--border-primary)' }}
        >
          <div className="flex items-center justify-between mb-4">
            <p className="text-[10px] tracking-[0.2em] font-bold uppercase font-mono" style={{ color: 'var(--text-muted)' }}>
              Anomalies detected
            </p>
            {unresolvedAlerts.length > 0 && (
              <span className="text-[10px] tracking-wider uppercase font-bold px-2 py-0.5 rounded-sm" style={{ background: 'var(--badge-danger-bg)', color: 'var(--badge-danger-text)' }}>
                ACTION REQ
              </span>
            )}
          </div>
          {loading ? (
            <Skeleton className="h-10 w-24" />
          ) : (
            <div className="flex items-end gap-3">
              <span className={`text-4xl font-bold font-mono ${unresolvedAlerts.length > 0 ? 'text-[var(--status-danger)]' : 'text-[var(--text-primary)]'}`}>
                {String(unresolvedAlerts.length).padStart(3, '0')}
              </span>
              <span className="text-xs mb-1 font-mono" style={{ color: unresolvedAlerts.length > 0 ? 'var(--status-danger)' : 'var(--text-muted)' }}>
                {unresolvedAlerts.length === 0 ? 'CLEAR' : 'UNRESOLVED'}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Security Audit Trail */}
      <div className="grid grid-cols-12 gap-6 mb-8">
        <div className="col-span-12">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold font-display" style={{ color: 'var(--text-primary)' }}>Immutable Ledger</h2>
            <span
              className="text-xs font-mono font-bold cursor-pointer hover:underline uppercase tracking-wider"
              style={{ color: 'var(--accent-gold)' }}
              onClick={() => navigate('/access-logs')}
              role="button"
              tabIndex={0}
              id="view-full-log-btn"
            >
              View Full Log
            </span>
          </div>
          <div
            className="border rounded-none overflow-x-auto w-full shadow-[var(--shadow-card)]"
            style={{ background: 'var(--bg-card)', borderColor: 'var(--border-primary)' }}
          >
            <div className="min-w-[700px]">
              {/* Table Header */}
              <div
                className="grid grid-cols-4 px-6 py-4 text-[10px] tracking-[0.2em] uppercase font-bold border-b font-mono"
                style={{ color: 'var(--text-muted)', borderColor: 'var(--border-primary)', background: 'var(--bg-secondary)' }}
              >
                <span>Timestamp</span>
                <span>Event Signature</span>
                <span>Target Resource</span>
                <span className="text-right">Status Code</span>
              </div>

              {/* Table Body */}
              {loading ? (
                [1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="px-6 py-4 border-b" style={{ borderColor: 'var(--border-primary)' }}>
                    <Skeleton className="h-5 w-full" />
                  </div>
                ))
              ) : recentLogs.length === 0 ? (
                <div className="px-6 py-12 text-center font-mono text-sm" style={{ color: 'var(--text-muted)' }}>
                  [ EMPTY LEDGER RECORD ]
                </div>
              ) : (
                recentLogs.map((log, idx) => {
                  const st = statusColor(log.status || log.action);
                  return (
                    <div
                      key={log.id || idx}
                      className="grid grid-cols-4 items-center px-6 py-4 border-b transition-colors"
                      style={{ borderColor: 'var(--border-primary)' }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--bg-hover)'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                    >
                      <span className="text-sm font-mono" style={{ color: 'var(--text-secondary)' }}>
                        {formatTime(log.timestamp || log.created_at)}
                      </span>
                      <span className="flex items-center gap-3 text-sm font-bold font-sans" style={{ color: 'var(--text-primary)' }}>
                        <span>{eventIcon(log.action || log.event)}</span>
                        {log.action || log.event || 'Event'}
                      </span>
                      <span className="text-sm font-mono truncate" style={{ color: 'var(--text-secondary)' }}>
                        {log.data_item || log.ip_address || '--'}
                      </span>
                      <div className="flex justify-end">
                        <span
                          className="text-[10px] tracking-[0.1em] uppercase font-bold px-3 py-1 font-mono"
                          style={{ background: st.bg, color: st.color, border: `1px solid ${st.color}40` }}
                        >
                          [{log.status || 'INFO'}]
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

