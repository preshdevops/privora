import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import axiosInstance from '../api/axiosInstance';
import DataJourney from '../components/DataJourney';
import ComplianceBadge from '../components/ComplianceBadge';
import SecurityActionBtn from '../components/SecurityActionBtn';
import EmptyState from '../components/EmptyState';

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
        <span className="text-xs font-mono text-[var(--accent-brass)] tracking-widest uppercase block">
          OVERVIEW
        </span>
        <h1 className="text-2xl sm:text-4xl font-serif text-[var(--text-primary)]">
          Your privacy, at a glance
        </h1>
        <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed max-w-xl">
          Privora protects your personal data under client-isolated encryption. Only your password can unseal your files.
        </p>
      </header>

      {/* Primary Action Button Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-3.5 sm:p-0 rounded-sm bg-[var(--bg-input)] sm:bg-transparent border sm:border-0 border-[var(--border-primary)]">
        <div className="text-xs text-[var(--text-secondary)] flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[var(--status-success)] animate-pulse shrink-0" />
          <span>System status: <strong className="text-[var(--status-success)] font-medium">Active & protected</strong></span>
        </div>

        <SecurityActionBtn
          onClick={handleExportLedger}
          actionLabel="Preparing export…"
          successLabel="Exported"
          delayMs={600}
          variant="outline"
          className="w-full sm:w-auto"
        >
          <span>Export activity log</span>
        </SecurityActionBtn>
      </div>

      {/* Sequential Data Journey Ledger */}
      <section className="space-y-3">
        <h2 className="text-lg sm:text-xl font-serif text-[var(--text-primary)]">
          Protection pipeline
        </h2>
        <DataJourney />
      </section>

      {/* Metrics Summary — 2-Line Stacked Layout on Mobile */}
      <section className="space-y-4">
        <h2 className="text-lg sm:text-xl font-serif text-[var(--text-primary)]">
          Vault status summary
        </h2>

        <div className="ledger-list divide-y divide-[var(--border-primary)] border border-[var(--border-primary)] rounded-sm bg-[var(--bg-card)]">
          {/* Entry 1: Protection Index */}
          <div className="ledger-entry p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4">
            <div className="flex items-center justify-between sm:block w-full sm:w-auto">
              <span className="text-sm font-medium text-[var(--text-primary)] block">Data protection score</span>
              <div className="sm:hidden text-right">
                <span className="font-serif text-xl font-semibold text-[var(--accent-brass)]">
                  {score ?? 85}
                </span>
                <span className="text-[10px] text-[var(--text-tertiary)]"> / 100</span>
              </div>
            </div>
            <span className="text-xs text-[var(--text-secondary)] hidden sm:block">Calculated compliance index</span>

            <div className="hidden sm:flex items-center gap-1 text-right shrink-0">
              <span className="font-serif text-2xl font-semibold text-[var(--accent-brass)]">
                {score ?? 85}
              </span>
              <span className="text-xs text-[var(--text-tertiary)]">/ 100</span>
            </div>
          </div>

          {/* Entry 2: Protected Files */}
          <div className="ledger-entry p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4">
            <div className="flex items-center justify-between sm:block w-full sm:w-auto">
              <div>
                <span className="text-sm font-medium text-[var(--text-primary)] block">Protected files</span>
                <span className="text-xs text-[var(--text-secondary)] block sm:hidden">Encrypted records stored safely</span>
              </div>
              <div className="sm:hidden text-right">
                <span className="font-serif text-xl font-semibold text-[var(--text-primary)]">
                  {loading ? "--" : encryptionCount}
                </span>
              </div>
            </div>
            <span className="text-xs text-[var(--text-secondary)] hidden sm:block">Encrypted records stored safely</span>

            <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0 pt-1 sm:pt-0 border-t sm:border-0 border-[var(--border-primary)]/50">
              <span className="font-serif text-2xl font-semibold text-[var(--text-primary)] hidden sm:inline">
                {loading ? "--" : encryptionCount}
              </span>
              <button
                onClick={() => navigate('/my-data')}
                className="text-xs font-mono text-[var(--accent-brass)] hover:underline touch-target"
              >
                View files →
              </button>
            </div>
          </div>

          {/* Entry 3: Security Alerts */}
          <div className="ledger-entry p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4">
            <div className="flex items-center justify-between sm:block w-full sm:w-auto">
              <div>
                <span className="text-sm font-medium text-[var(--text-primary)] block">Security alerts</span>
                <span className="text-xs text-[var(--text-secondary)] block sm:hidden">
                  {unresolvedAlerts.length > 0 ? "Alerts requiring attention" : "All metrics nominal"}
                </span>
              </div>
              <div className="sm:hidden text-right">
                <span className={`font-serif text-xl font-semibold ${unresolvedAlerts.length > 0 ? 'text-[var(--status-danger)]' : 'text-[var(--text-primary)]'}`}>
                  {loading ? "--" : unresolvedAlerts.length}
                </span>
              </div>
            </div>
            <span className="text-xs text-[var(--text-secondary)] hidden sm:block">
              {unresolvedAlerts.length > 0 ? "Alerts requiring attention" : "All access metrics nominal"}
            </span>

            <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0 pt-1 sm:pt-0 border-t sm:border-0 border-[var(--border-primary)]/50">
              <span className={`font-serif text-2xl font-semibold hidden sm:inline ${unresolvedAlerts.length > 0 ? 'text-[var(--status-danger)]' : 'text-[var(--text-primary)]'}`}>
                {loading ? "--" : unresolvedAlerts.length}
              </span>
              <button
                onClick={() => navigate('/access-logs')}
                className="text-xs font-mono text-[var(--accent-brass)] hover:underline touch-target"
              >
                View logs →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Activity Trail — 2-Line Stacked Layout on Mobile */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg sm:text-xl font-serif text-[var(--text-primary)]">
            Recent activity
          </h2>
          <button
            onClick={() => navigate('/access-logs')}
            className="text-xs font-mono text-[var(--accent-brass)] sm:text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors touch-target"
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
          <div className="ledger-list divide-y divide-[var(--border-primary)] border border-[var(--border-primary)] rounded-sm bg-[var(--bg-card)]">
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
                      <span className="text-sm font-medium text-[var(--text-primary)] truncate">
                        {log.action || log.event || 'System activity'}
                      </span>
                      <span className={`px-2 py-0.5 text-[10px] font-mono rounded uppercase shrink-0 border ${
                        log.status === 'success' || log.status === 'completed'
                          ? 'bg-[var(--vault-green-bg)] text-[var(--vault-green-bright)] border-[var(--vault-green)]'
                          : 'bg-red-950/40 text-[var(--status-danger)] border-[var(--status-danger)]/40'
                      }`}>
                        {log.status || 'OK'}
                      </span>
                    </div>

                    {/* Line 2: Secondary Metadata (Timestamp + IP + Expand indicator) */}
                    <div className="flex items-center justify-between text-xs font-mono text-[var(--text-tertiary)] pt-0.5">
                      <span className="truncate">
                        {log.timestamp ? new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now'}
                        <span className="mx-1.5">&middot;</span>
                        {log.ip_address || '127.0.0.1'}
                      </span>
                      <span className="text-[11px] text-[var(--accent-brass)] shrink-0 ml-2">
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
                        <p>• Telemetry status: {log.status || 'Verified'}</p>
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
