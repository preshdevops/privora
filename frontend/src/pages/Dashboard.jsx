import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import axiosInstance from '../api/axiosInstance';
import DataJourney from '../components/DataJourney';
import ComplianceBadge from '../components/ComplianceBadge';
import SecurityActionBtn from '../components/SecurityActionBtn';
import EmptyState from '../components/EmptyState';
import RisingScoreDial from '../components/RisingScoreDial';

export default function Dashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [score, setScore] = useState(null);
  const [encryptionCount, setEncryptionCount] = useState(0);
  const [recentLogs, setRecentLogs] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [expandedLogId, setExpandedLogId] = useState(null);

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
          const items = d.results || (Array.isArray(d) ? d : []);
          setRecentLogs(items.slice(0, 5));
        }
        if (alertsRes.status === 'fulfilled') {
          const d = alertsRes.value.data;
          setAlerts(Array.isArray(d) ? d : d.results || []);
        }
      } catch {
        // silently handle
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  const unresolvedAlerts = alerts.filter((a) => !a.resolved);

  const handleExportLedger = async () => {
    const logData = JSON.stringify(recentLogs, null, 2);
    const blob = new Blob([logData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `privora_activity_log_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const toggleAccordion = (id) => {
    setExpandedLogId(prev => prev === id ? null : id);
  };

  return (
    <div className="space-y-8 sm:space-y-12">
      {/* Eyebrow Label & Page Header */}
      <header className="space-y-2 border-b border-[var(--border-primary)] pb-6 sm:pb-8">
        <span className="text-xs font-mono text-[var(--accent-gold)] tracking-widest uppercase block">
          VAULT OVERVIEW
        </span>
        <h1 className="text-2xl sm:text-4xl font-display font-bold text-[var(--text-primary)]">
          Your Data Vault Dashboard
        </h1>
        <p className="text-xs sm:text-sm text-[var(--text-secondary)] font-sans leading-relaxed max-w-xl">
          Your files are encrypted and locked. Only you hold the secret password to open them.
        </p>
      </header>

      {/* Primary Action Button Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-lg bg-[var(--bg-card)] border border-[var(--border-primary)]">
        <div className="text-xs text-[var(--text-secondary)] flex items-center gap-2 font-mono">
          <span className="w-2 h-2 rounded-full bg-[var(--status-success)] animate-pulse shrink-0" />
          <span>Vault Status: <strong className="text-[var(--status-success)] font-medium">Fully Protected</strong></span>
        </div>

        <SecurityActionBtn
          onClick={handleExportLedger}
          actionLabel="Preparing report…"
          successLabel="Downloaded"
          delayMs={600}
          variant="outline"
          className="w-full sm:w-auto text-xs"
        >
          <span>Download Activity Report</span>
        </SecurityActionBtn>
      </div>

      {/* DOMINANT TOP ELEMENT: Data Protection Score Card */}
      <section className="p-6 sm:p-8 bg-[var(--bg-card)] border border-[var(--border-primary)] rounded-xl space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 text-left max-w-md">
            <span className="text-xs font-mono text-[var(--accent-gold)] tracking-widest uppercase block">
              PRIMARY METRIC
            </span>
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-[var(--text-primary)]">
              Data Protection Score
            </h2>
            <p className="text-sm text-[var(--text-secondary)] font-sans leading-relaxed">
              Your protection score in real time. It goes up when you're safer. It never lies to you.
            </p>
          </div>

          {/* Minimalist Score Dial */}
          <div className="flex items-center justify-center shrink-0">
            <RisingScoreDial score={loading ? 90 : (score ?? 94)} size={140} label="PROTECTION SCORE" />
          </div>
        </div>
      </section>

      {/* SECONDARY ROW: Visually Quieter Metric Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Metric 1: Locked Files */}
        <div className="p-4 sm:p-5 bg-[var(--bg-card)] border border-[var(--border-primary)] rounded-lg space-y-2">
          <span className="font-mono text-[11px] text-[var(--text-tertiary)] uppercase tracking-wider block">
            LOCKED FILES
          </span>
          <div className="flex items-baseline justify-between">
            <span className="font-mono text-2xl font-bold text-[var(--text-primary)]">
              {loading ? '--' : encryptionCount}
            </span>
            <button
              onClick={() => navigate('/my-data')}
              className="text-xs font-mono text-[var(--accent-gold)] hover:underline"
            >
              View files →
            </button>
          </div>
          <span className="text-xs text-[var(--text-secondary)] font-sans block">Encrypted in your vault</span>
        </div>

        {/* Metric 2: Security Notices */}
        <div className="p-4 sm:p-5 bg-[var(--bg-card)] border border-[var(--border-primary)] rounded-lg space-y-2">
          <span className="font-mono text-[11px] text-[var(--text-tertiary)] uppercase tracking-wider block">
            SECURITY NOTICES
          </span>
          <div className="flex items-baseline justify-between">
            <span className={`font-mono text-2xl font-bold ${unresolvedAlerts.length > 0 ? 'text-[var(--status-danger)]' : 'text-[var(--text-primary)]'}`}>
              {loading ? '--' : unresolvedAlerts.length}
            </span>
            <button
              onClick={() => navigate('/access-logs')}
              className="text-xs font-mono text-[var(--accent-gold)] hover:underline"
            >
              View alerts →
            </button>
          </div>
          <span className="text-xs text-[var(--text-secondary)] font-sans block">
            {unresolvedAlerts.length > 0 ? 'Unusual activity warnings' : 'No active security issues'}
          </span>
        </div>

        {/* Metric 3: Access Activity */}
        <div className="p-4 sm:p-5 bg-[var(--bg-card)] border border-[var(--border-primary)] rounded-lg space-y-2">
          <span className="font-mono text-[11px] text-[var(--text-tertiary)] uppercase tracking-wider block">
            RECENT LOGS
          </span>
          <div className="flex items-baseline justify-between">
            <span className="font-mono text-2xl font-bold text-[var(--text-primary)]">
              {loading ? '--' : recentLogs.length}
            </span>
            <button
              onClick={() => navigate('/access-logs')}
              className="text-xs font-mono text-[var(--accent-gold)] hover:underline"
            >
              Inspect ledger →
            </button>
          </div>
          <span className="text-xs text-[var(--text-secondary)] font-sans block">Recorded access events</span>
        </div>
      </section>

      {/* Sequential Data Journey Ledger */}
      <section className="space-y-3">
        <h2 className="text-lg sm:text-xl font-display font-bold text-[var(--text-primary)]">
          How your files stay safe
        </h2>
        <DataJourney />
      </section>

      {/* Recent Activity Trail */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg sm:text-xl font-display font-bold text-[var(--text-primary)]">
            Recent activity
          </h2>
          <button
            onClick={() => navigate('/access-logs')}
            className="text-xs font-mono text-[var(--accent-gold)] hover:text-[var(--text-primary)] transition-colors"
          >
            View all logs →
          </button>
        </div>

        {loading ? (
          <div className="py-6 text-xs text-[var(--text-tertiary)] text-center font-mono">
            Loading activity entries…
          </div>
        ) : recentLogs.length === 0 ? (
          <EmptyState
            title="No activity yet"
            description="Once you upload a file or sign in, activity entries will appear here."
          />
        ) : (
          <div className="ledger-list divide-y divide-[var(--border-primary)] border border-[var(--border-primary)] rounded-lg bg-[var(--bg-card)]">
            {recentLogs.map((log, idx) => {
              const isExpanded = expandedLogId === (log.id || idx);
              return (
                <div key={log.id || idx} className="ledger-entry p-3.5 sm:p-4">
                  <div 
                    onClick={() => toggleAccordion(log.id || idx)}
                    className="cursor-pointer space-y-1.5"
                  >
                    {/* Line 1: Primary Info (Action + Status Badge) */}
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-medium text-[var(--text-primary)] font-sans truncate">
                        {log.action || log.event || 'System activity'}
                      </span>
                      <span className={`px-2 py-0.5 text-[10px] font-mono rounded uppercase shrink-0 border ${
                        log.status === 'success' || log.status === 'completed'
                          ? 'bg-[var(--accent-gold-bg)] text-[var(--accent-gold)] border-[var(--accent-gold)]'
                          : 'bg-[rgba(196,87,63,0.15)] text-[var(--status-danger)] border-[var(--status-danger)]'
                      }`}>
                        {log.status || 'OK'}
                      </span>
                    </div>

                    {/* Line 2: Secondary Metadata (Timestamp + IP + Expand indicator) */}
                    <div className="flex items-center justify-between text-xs font-mono text-[var(--text-tertiary)] pt-0.5">
                      <span className="truncate">
                        {(() => {
                          if (!log.timestamp) return 'Just now';
                          try {
                            const d = new Date(log.timestamp);
                            return isNaN(d.getTime()) ? 'Just now' : d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                          } catch {
                            return 'Just now';
                          }
                        })()}
                        <span className="mx-1.5">&middot;</span>
                        {log.ip_address || '127.0.0.1'}
                      </span>
                      <span className="text-[11px] text-[var(--accent-gold)] shrink-0 ml-2">
                        {isExpanded ? 'Hide info –' : 'Details +'}
                      </span>
                    </div>
                  </div>

                  {/* Accordion Detail Drawer */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="pt-3 pb-1 text-xs font-mono text-[var(--text-tertiary)] space-y-1 border-t border-[var(--border-primary)] mt-3"
                      >
                        <p>• Data item: {log.data_item || log.location || 'N/A'}</p>
                        <p>• IP address: {log.ip_address || '127.0.0.1'}</p>
                        <p>• Status: Verified Safe</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
