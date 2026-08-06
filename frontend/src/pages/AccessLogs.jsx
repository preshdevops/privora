import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Laptop, Smartphone, Tablet, ShieldAlert, Key, Lock, Settings as SettingsIcon, Activity } from 'lucide-react';
import axiosInstance from '../api/axiosInstance';
import SecurityActionBtn from '../components/SecurityActionBtn';
import EmptyState from '../components/EmptyState';

export default function AccessLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('Any status');
  const [categoryFilter, setCategoryFilter] = useState('All Categories');
  const [expandedLogId, setExpandedLogId] = useState(null);

  const pageSize = 50;

  const fetchLogs = async (pageNum = 1) => {
    setLoading(true);
    try {
      const res = await axiosInstance.get('/api/audit/logs/', {
        params: { page: pageNum },
      });
      const data = res.data;
      if (data.results) {
        setLogs(data.results);
        setTotalCount(data.count || 0);
      } else if (Array.isArray(data)) {
        setLogs(data);
        setTotalCount(data.length);
      }
    } catch {
      setLogs([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchLogs(page);
  }, [page]);

  const handleExportCSV = async () => {
    const headers = ["Timestamp", "Action", "Category", "Data Item", "IP Address", "Browser", "OS", "Status"];
    const rows = filteredLogs.map(l => [
      l.timestamp ? new Date(l.timestamp).toISOString() : '',
      `"${l.action || l.event || ''}"`,
      `"${l.metadata?.category || 'General'}"`,
      `"${l.data_item || ''}"`,
      `"${l.ip_address || ''}"`,
      `"${l.metadata?.browser || ''}"`,
      `"${l.metadata?.os || ''}"`,
      `"${l.status || ''}"`
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `privora_audit_ledger_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const filteredLogs = logs.filter((log) => {
    const q = search.toLowerCase();
    const meta = log.metadata || {};
    const matchesSearch = !q || [
      log.action, log.event, log.ip_address, log.location, log.status, log.data_item,
      meta.browser, meta.os, meta.device, meta.category
    ].some((field) => (field || '').toLowerCase().includes(q));

    const matchesStatus = statusFilter === 'Any status' || (log.status || '').toLowerCase() === statusFilter.toLowerCase();
    const matchesCategory = categoryFilter === 'All Categories' || (meta.category || '').toLowerCase() === categoryFilter.toLowerCase();
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  const toggleAccordion = (id) => {
    setExpandedLogId(prev => prev === id ? null : id);
  };

  const getDeviceIcon = (deviceStr) => {
    const d = (deviceStr || '').toLowerCase();
    if (d.includes('mobile') || d.includes('phone')) return <Smartphone className="w-3.5 h-3.5" />;
    if (d.includes('tablet') || d.includes('ipad')) return <Tablet className="w-3.5 h-3.5" />;
    return <Laptop className="w-3.5 h-3.5" />;
  };

  const getCategoryIcon = (catStr) => {
    const c = (catStr || '').toLowerCase();
    if (c.includes('auth')) return <Key className="w-3.5 h-3.5 text-amber-400" />;
    if (c.includes('vault') || c.includes('access')) return <Lock className="w-3.5 h-3.5 text-emerald-400" />;
    if (c.includes('setting') || c.includes('security')) return <SettingsIcon className="w-3.5 h-3.5 text-blue-400" />;
    return <Activity className="w-3.5 h-3.5 text-[var(--accent-gold)]" />;
  };

  return (
    <div className="space-y-12">
      {/* Header */}
      <header className="space-y-2 border-b border-[var(--border-primary)] pb-6 sm:pb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="text-xs font-mono text-[var(--accent-gold)] tracking-widest uppercase block">
            ACTIVITY HISTORY
          </span>
          <h1 className="text-2xl sm:text-4xl font-display font-bold text-[var(--text-primary)] mt-1">
            Access Logs Ledger
          </h1>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] font-sans leading-relaxed max-w-xl">
            A clear security ledger of every login, file view, and key verification on your account with browser, OS, and client metadata.
          </p>
        </div>

        <SecurityActionBtn
          onClick={handleExportCSV}
          actionLabel="Exporting…"
          successLabel="Exported"
          delayMs={500}
          variant="outline"
          className="w-full sm:w-auto text-xs"
        >
          <span>Download Report (CSV)</span>
        </SecurityActionBtn>
      </header>

      {/* Filter Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 text-xs font-mono">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search activity, browser, IP, action…"
          className="w-full sm:w-80 px-3.5 py-2.5 rounded-lg bg-[var(--bg-input)] border border-[var(--border-primary)] text-[var(--text-primary)] outline-none min-h-[44px]"
        />

        <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 shrink-0">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 rounded-lg bg-[var(--bg-input)] border border-[var(--border-primary)] text-[var(--text-primary)] outline-none cursor-pointer min-h-[44px]"
          >
            <option>All Categories</option>
            <option value="Authentication">Authentication</option>
            <option value="Vault Access">Vault Access</option>
            <option value="Security Settings">Security Settings</option>
            <option value="System Event">System Event</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-lg bg-[var(--bg-input)] border border-[var(--border-primary)] text-[var(--text-primary)] outline-none cursor-pointer min-h-[44px]"
          >
            <option>Any status</option>
            <option value="success">Success</option>
            <option value="failed">Failed</option>
          </select>
        </div>
      </div>

      {/* Ledger List */}
      {loading ? (
        <div className="py-6 text-xs text-[var(--text-tertiary)] text-center font-mono">
          Loading detailed audit entries…
        </div>
      ) : filteredLogs.length === 0 ? (
        <EmptyState
          title="No matching logs"
          description="No security events match your current filter."
        />
      ) : (
        <div className="ledger-list divide-y divide-[var(--border-primary)] border border-[var(--border-primary)] rounded-xl overflow-hidden bg-[var(--bg-card)]">
          {filteredLogs.map((log, idx) => {
            const isExpanded = expandedLogId === (log.id || idx);
            const isEven = idx % 2 === 0;
            const meta = log.metadata || {};
            const categoryName = meta.category || 'System Event';
            const browserName = meta.browser || 'Web Browser';
            const osName = meta.os || 'OS System';
            const deviceName = meta.device || 'Desktop';
            const severity = meta.severity || (log.status === 'failed' ? 'high' : 'info');

            return (
              <div 
                key={log.id || idx} 
                className={`ledger-entry p-3.5 sm:p-4 ${isEven ? 'bg-[var(--bg-card)]' : 'bg-[var(--bg-secondary)]'}`}
              >
                <div 
                  onClick={() => toggleAccordion(log.id || idx)}
                  className="cursor-pointer space-y-2"
                >
                  {/* Line 1: Entry # + Action + Category & Status Badges */}
                  <div className="flex items-center justify-between gap-2 min-w-0">
                    <div className="flex items-center gap-2.5 min-w-0 flex-1">
                      <span className="font-mono text-xs text-[var(--accent-gold)] font-semibold shrink-0">
                        #{String((page - 1) * pageSize + idx + 1).padStart(4, '0')}
                      </span>
                      <span className="text-sm font-medium text-[var(--text-primary)] font-sans truncate">
                        {log.action || log.event || 'System activity'}
                      </span>

                      <span className="hidden md:inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded border border-[var(--border-primary)] bg-[var(--bg-input)] text-[var(--text-secondary)]">
                        {getCategoryIcon(categoryName)}
                        {categoryName}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className={`px-2 py-0.5 text-[10px] font-mono rounded uppercase border ${
                        severity === 'high' || log.status === 'failed'
                          ? 'bg-red-500/10 text-red-400 border-red-500/30'
                          : severity === 'medium'
                          ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                          : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                      }`}>
                        {log.status === 'success' || log.status === 'completed' ? 'Success' : 'Failed'}
                      </span>
                    </div>
                  </div>

                  {/* Line 2: Client Metadata (Browser, OS, IP, Date) */}
                  <div className="flex flex-wrap items-center justify-between text-xs font-mono text-[var(--text-tertiary)] pt-0.5 gap-2">
                    <div className="flex items-center gap-2 truncate">
                      <span className="flex items-center gap-1 text-[var(--text-secondary)]">
                        {getDeviceIcon(deviceName)}
                        {browserName} on {osName}
                      </span>
                      <span>&middot;</span>
                      <span>{log.ip_address || '127.0.0.1'}</span>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <span>
                        {log.timestamp ? new Date(log.timestamp).toLocaleString([], { dateStyle: 'short', timeStyle: 'medium' }) : 'Just now'}
                      </span>
                      <span className="text-[11px] text-[var(--accent-gold)]">
                        {isExpanded ? 'Hide details –' : 'Inspect details +'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Accordion Detail Drawer */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="pt-3 pb-1 text-xs font-mono text-[var(--text-secondary)] space-y-1.5 border-t border-[var(--border-primary)] mt-3 bg-[var(--bg-input)]/50 p-3 rounded-lg"
                    >
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <div>
                          <p><strong className="text-[var(--text-primary)]">Target Item:</strong> {log.data_item || 'N/A'}</p>
                          <p><strong className="text-[var(--text-primary)]">Event Category:</strong> {categoryName}</p>
                          <p><strong className="text-[var(--text-primary)]">IP Location:</strong> {log.ip_address || '127.0.0.1'} (Authenticated Request)</p>
                        </div>
                        <div>
                          <p><strong className="text-[var(--text-primary)]">Client Device:</strong> {deviceName} ({osName})</p>
                          <p><strong className="text-[var(--text-primary)]">User Agent:</strong> {browserName}</p>
                          <p><strong className="text-[var(--text-primary)]">HTTP Method:</strong> {meta.method || 'POST'}</p>
                        </div>
                      </div>
                      {meta.user_agent && (
                        <p className="text-[10px] text-[var(--text-tertiary)] pt-1 truncate border-t border-[var(--border-primary)]/50 mt-1">
                          UA String: {meta.user_agent}
                        </p>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination Controls */}
      {!loading && totalCount > 0 && (
        <div className="flex items-center justify-between font-mono text-xs text-[var(--text-tertiary)] pt-2 border-t border-[var(--border-primary)]">
          <span>Total entries: {totalCount}</span>
          <div className="flex items-center gap-2">
            <button
              disabled={page <= 1}
              onClick={() => setPage(prev => Math.max(1, prev - 1))}
              className="px-3 py-1.5 rounded border border-[var(--border-primary)] hover:border-[var(--text-primary)] disabled:opacity-40"
            >
              Previous
            </button>
            <span>Page {page} of {totalPages}</span>
            <button
              disabled={page >= totalPages}
              onClick={() => setPage(prev => Math.min(totalPages, prev + 1))}
              className="px-3 py-1.5 rounded border border-[var(--border-primary)] hover:border-[var(--text-primary)] disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

