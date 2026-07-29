import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axiosInstance from '../api/axiosInstance';
import DataJourney from '../components/DataJourney';
import ComplianceBadge from '../components/ComplianceBadge';
import SecurityActionBtn from '../components/SecurityActionBtn';
import EmptyState from '../components/EmptyState';
import { ShieldCheck, HardDrive, AlertTriangle, Download, Activity, Lock } from 'lucide-react';

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

  const handleExportLedger = async () => {
    const logData = JSON.stringify(recentLogs, null, 2);
    const blob = new Blob([logData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `privora_audit_ledger_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: [0.25, 1, 0.5, 1] }
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      {/* Page Header */}
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono text-[var(--accent-brass)] uppercase tracking-widest">
            Cryptographic Vault Overview
          </span>
          <h1 className="text-3xl font-serif font-semibold text-[var(--text-primary)] mt-1">
            Data Protection Command
          </h1>
        </div>

        <SecurityActionBtn
          onClick={handleExportLedger}
          actionLabel="Compiling Ledger..."
          successLabel="Ledger Exported"
          delayMs={800}
          variant="outline"
        >
          <Download className="w-4 h-4 text-[var(--accent-brass)]" />
          <span>Export Audit Ledger</span>
        </SecurityActionBtn>
      </motion.div>

      {/* Data Protection Journey Diagram */}
      <motion.div variants={itemVariants}>
        <DataJourney />
      </motion.div>

      {/* Core Security Metrics Grid */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Compliance Status Badge */}
        <ComplianceBadge score={score ?? 85} unresolvedAlertsCount={unresolvedAlerts.length} />

        {/* Encrypted Vault Assets */}
        <div className="layered-card p-5 rounded-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-[var(--border-primary)]">
            <div className="flex items-center gap-2">
              <HardDrive className="w-4 h-4 text-[var(--accent-brass)]" />
              <h3 className="text-sm font-serif text-[var(--text-primary)]">
                Protected Vault Assets
              </h3>
            </div>
            <span className="text-xs font-mono text-[var(--status-success)]">
              AES-256
            </span>
          </div>

          <div className="my-2">
            <span className="text-4xl font-serif text-[var(--text-primary)] font-semibold">
              {loading ? "--" : String(encryptionCount).padStart(2, '0')}
            </span>
            <p className="text-xs text-[var(--text-secondary)] mt-1">
              Encrypted files stored under zero-knowledge isolation.
            </p>
          </div>

          <button
            onClick={() => navigate('/my-data')}
            className="w-full mt-4 py-2 rounded-sm bg-[var(--bg-input)] hover:bg-[var(--bg-hover)] border border-[var(--border-primary)] text-xs text-[var(--text-primary)] font-mono transition-colors text-center cursor-pointer"
          >
            Manage Data Vault →
          </button>
        </div>

        {/* Anomaly & Breach Status */}
        <div className="layered-card p-5 rounded-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-[var(--border-primary)]">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-[var(--accent-brass)]" />
              <h3 className="text-sm font-serif text-[var(--text-primary)]">
                Security Alerts
              </h3>
            </div>
            <span className={`text-xs font-mono ${unresolvedAlerts.length > 0 ? 'text-[var(--status-danger)]' : 'text-[var(--status-success)]'}`}>
              {unresolvedAlerts.length > 0 ? 'ALERT' : 'NO THREATS'}
            </span>
          </div>

          <div className="my-2">
            <span className={`text-4xl font-serif font-semibold ${unresolvedAlerts.length > 0 ? 'text-[var(--status-danger)]' : 'text-[var(--text-primary)]'}`}>
              {loading ? "--" : String(unresolvedAlerts.length).padStart(2, '0')}
            </span>
            <p className="text-xs text-[var(--text-secondary)] mt-1">
              {unresolvedAlerts.length > 0 ? "Unresolved security alerts require attention." : "All security thresholds within normal parameters."}
            </p>
          </div>

          <button
            onClick={() => navigate('/access-logs')}
            className="w-full mt-4 py-2 rounded-sm bg-[var(--bg-input)] hover:bg-[var(--bg-hover)] border border-[var(--border-primary)] text-xs text-[var(--text-primary)] font-mono transition-colors text-center cursor-pointer"
          >
            Review Security Audit Logs →
          </button>
        </div>
      </motion.div>

      {/* Immutable Access Log Preview */}
      <motion.div variants={itemVariants} className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-serif text-[var(--text-primary)]">
              Audit Trail (Recent Events)
            </h2>
            <p className="text-xs text-[var(--text-secondary)] font-mono">
              Real-time access log recorded for regulatory verification.
            </p>
          </div>
          <button
            onClick={() => navigate('/access-logs')}
            className="text-xs font-mono text-[var(--accent-brass)] hover:underline"
          >
            View Complete Log →
          </button>
        </div>

        {loading ? (
          <div className="layered-card p-6 text-center text-xs font-mono text-[var(--text-tertiary)]">
            Loading immutable audit logs...
          </div>
        ) : recentLogs.length === 0 ? (
          <EmptyState
            title="Audit Ledger Empty"
            description="No system access logs recorded yet. Upload a file or log in to generate security telemetry."
            iconType="logs"
          />
        ) : (
          <div className="layered-card rounded-sm overflow-hidden divide-y divide-[var(--border-primary)]">
            {recentLogs.map((log, idx) => (
              <div
                key={log.id || idx}
                className="p-4 flex items-center justify-between text-xs hover:bg-[var(--bg-hover)] transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded bg-[var(--bg-input)] text-[var(--accent-brass)]">
                    <Activity className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="font-mono text-[var(--text-primary)] font-medium block">
                      {log.action || log.event || 'System Activity'}
                    </span>
                    <span className="text-[11px] text-[var(--text-tertiary)] font-mono">
                      {log.timestamp ? new Date(log.timestamp).toUTCString() : 'Just now'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <span className="font-mono text-[var(--text-secondary)] hidden sm:inline">
                    {log.ip_address || '127.0.0.1'}
                  </span>
                  <span className={`px-2 py-0.5 font-mono text-[10px] rounded uppercase border ${
                    log.status === 'success' || log.status === 'completed'
                      ? 'bg-[var(--badge-success-bg)] text-[var(--badge-success-text)] border-[var(--status-success)]/30'
                      : 'bg-[var(--badge-danger-bg)] text-[var(--badge-danger-text)] border-[var(--status-danger)]/30'
                  }`}>
                    {log.status || 'OK'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
