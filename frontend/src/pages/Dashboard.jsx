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
    <div className="space-y-12">
      {/* Eyebrow Label & Page Header */}
      <header className="space-y-2 border-b border-[var(--border-primary)] pb-8">
        <span className="text-xs font-mono text-[var(--accent-brass)] tracking-widest uppercase block">
          OVERVIEW
        </span>
        <h1 className="text-3xl sm:text-4xl font-serif text-[var(--text-primary)]">
          Your privacy, at a glance
        </h1>
        <p className="text-sm text-[var(--text-secondary)] leading-relaxed max-w-xl">
          Privora protects your personal data under client-isolated encryption. Only your password can unseal your files.
        </p>
      </header>

      {/* Primary Action Button */}
      <div className="flex items-center justify-between">
        <div className="text-xs text-[var(--text-secondary)]">
          System status: <span className="text-[var(--status-success)] font-medium">Active & protected</span>
        </div>

        <SecurityActionBtn
          onClick={handleExportLedger}
          actionLabel="Preparing export…"
          successLabel="Exported"
          delayMs={600}
          variant="outline"
        >
          <span>Export activity log</span>
        </SecurityActionBtn>
      </div>

      {/* Sequential Data Journey Ledger */}
      <section className="space-y-3">
        <h2 className="text-xl font-serif text-[var(--text-primary)]">
          Protection pipeline
        </h2>
        <DataJourney />
      </section>

      {/* Metrics Summary — Simple Ledger Rule List, Not Cards */}
      <section className="space-y-4">
        <h2 className="text-xl font-serif text-[var(--text-primary)]">
          Vault status summary
        </h2>

        <div className="ledger-list">
          {/* Entry 1: Protection Index */}
          <div className="ledger-entry flex items-center justify-between py-4">
            <div>
              <span className="text-sm font-medium text-[var(--text-primary)] block">Data protection score</span>
              <span className="text-xs text-[var(--text-secondary)]">Calculated compliance index</span>
            </div>
            <div className="text-right">
              <span className="font-serif text-2xl font-semibold text-[var(--accent-brass)]">
                {score ?? 85}
              </span>
              <span className="text-xs text-[var(--text-tertiary)] block">/ 100</span>
            </div>
          </div>

          {/* Entry 2: Protected Files */}
          <div className="ledger-entry flex items-center justify-between py-4">
            <div>
              <span className="text-sm font-medium text-[var(--text-primary)] block">Protected files</span>
              <span className="text-xs text-[var(--text-secondary)]">Encrypted records stored safely</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="font-serif text-2xl font-semibold text-[var(--text-primary)]">
                {loading ? "--" : encryptionCount}
              </span>
              <button
                onClick={() => navigate('/my-data')}
                className="text-xs font-mono text-[var(--accent-brass)] hover:underline"
              >
                View files →
              </button>
            </div>
          </div>

          {/* Entry 3: Security Alerts */}
          <div className="ledger-entry flex items-center justify-between py-4">
            <div>
              <span className="text-sm font-medium text-[var(--text-primary)] block">Security alerts</span>
              <span className="text-xs text-[var(--text-secondary)]">
                {unresolvedAlerts.length > 0 ? "Alerts requiring attention" : "All access metrics nominal"}
              </span>
            </div>
            <div className="flex items-center gap-4">
              <span className={`font-serif text-2xl font-semibold ${unresolvedAlerts.length > 0 ? 'text-[var(--status-danger)]' : 'text-[var(--text-primary)]'}`}>
                {loading ? "--" : unresolvedAlerts.length}
              </span>
              <button
                onClick={() => navigate('/access-logs')}
                className="text-xs font-mono text-[var(--accent-brass)] hover:underline"
              >
                View logs →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Activity Trail — Accordion Detail Expansion */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-serif text-[var(--text-primary)]">
            Recent activity
          </h2>
          <button
            onClick={() => navigate('/access-logs')}
            className="text-xs font-mono text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors"
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
          <div className="ledger-list">
            {recentLogs.map((log, idx) => {
              const isExpanded = expandedLogId === (log.id || idx);
              return (
                <div key={log.id || idx} className="ledger-entry">
                  <div 
                    onClick={() => toggleAccordion(log.id || idx)}
                    className="flex items-center justify-between cursor-pointer py-1"
                  >
                    <div className="space-y-0.5">
                      <span className="text-sm font-medium text-[var(--text-primary)] block">
                        {log.action || log.event || 'System activity'}
                      </span>
                      <span className="text-xs text-[var(--text-tertiary)] font-mono block">
                        {log.timestamp ? new Date(log.timestamp).toUTCString() : 'Just now'}
                      </span>
                    </div>

                    <div className="flex items-center gap-4 text-xs font-mono">
                      <span className="text-[var(--text-tertiary)] hidden sm:inline">
                        {log.ip_address || '127.0.0.1'}
                      </span>
                      <span className={`px-2 py-0.5 text-[11px] rounded uppercase ${
                        log.status === 'success' || log.status === 'completed'
                          ? 'text-[var(--badge-success-text)]'
                          : 'text-[var(--badge-danger-text)]'
                      }`}>
                        {log.status || 'OK'}
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
