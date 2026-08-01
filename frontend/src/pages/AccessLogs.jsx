import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
    const headers = ["Timestamp", "Action", "Data Item", "IP Address", "Status"];
    const rows = filteredLogs.map(l => [
      l.timestamp ? new Date(l.timestamp).toISOString() : '',
      `"${l.action || l.event || ''}"`,
      `"${l.data_item || ''}"`,
      `"${l.ip_address || ''}"`,
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
    const matchesSearch = !q || [
      log.action, log.event, log.ip_address, log.location, log.status, log.data_item
    ].some((field) => (field || '').toLowerCase().includes(q));

    const matchesStatus = statusFilter === 'Any status' || (log.status || '').toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  const toggleAccordion = (id) => {
    setExpandedLogId(prev => prev === id ? null : id);
  };

  return (
    <div className="space-y-12">
      {/* Header */}
      <header className="space-y-2 border-b border-[var(--border-primary)] pb-6 sm:pb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="text-xs font-mono text-[var(--accent-brass)] tracking-widest uppercase block">
            AUDIT LEDGER
          </span>
          <h1 className="text-2xl sm:text-4xl font-serif text-[var(--text-primary)] mt-1">
            Access logs
          </h1>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed max-w-xl">
            A complete record of logins, file actions, and security settings changes on your account.
          </p>
        </div>

        <SecurityActionBtn
          onClick={handleExportCSV}
          actionLabel="Exporting…"
          successLabel="Exported"
          delayMs={500}
          variant="outline"
          className="w-full sm:w-auto"
        >
          <span>Export CSV</span>
        </SecurityActionBtn>
      </header>

      {/* Filter Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 text-xs font-mono">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by IP, action, or file name…"
          className="w-full sm:w-80 px-3.5 py-2.5 rounded-sm bg-[var(--bg-input)] border border-[var(--border-primary)] text-[var(--text-primary)] outline-none min-h-[44px]"
        />

        <div className="flex items-center justify-between sm:justify-end gap-2 shrink-0 pt-1 sm:pt-0">
          <span className="text-[var(--text-tertiary)]">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-sm bg-[var(--bg-input)] border border-[var(--border-primary)] text-[var(--text-primary)] outline-none cursor-pointer min-h-[44px]"
          >
            <option>Any status</option>
            <option value="success">Success</option>
            <option value="failed">Failed</option>
          </select>
        </div>
      </div>

      {/* Ledger List — 2-Line Stacked Layout on Mobile */}
      {loading ? (
        <div className="py-6 text-xs text-[var(--text-tertiary)] text-center font-mono">
          Loading audit entries…
        </div>
      ) : filteredLogs.length === 0 ? (
        <EmptyState
          title="No matching logs"
          description="No security events match your current filter."
        />
      ) : (
        <div className="ledger-list divide-y divide-[var(--border-primary)] border border-[var(--border-primary)] rounded-sm bg-[var(--bg-card)]">
          {filteredLogs.map((log, idx) => {
            const isExpanded = expandedLogId === (log.id || idx);
            return (
              <div key={log.id || idx} className="ledger-entry p-3.5 sm:p-4">
                <div 
                  onClick={() => toggleAccordion(log.id || idx)}
                  className="cursor-pointer space-y-1.5"
                >
                  {/* Line 1: Entry # + Action Title + Status Badge */}
                  <div className="flex items-center justify-between gap-2 min-w-0">
                    <div className="flex items-center gap-2.5 min-w-0 flex-1">
                      <span className="font-mono text-xs text-[var(--accent-brass)] font-semibold shrink-0">
                        #{String((page - 1) * pageSize + idx + 1).padStart(4, '0')}
                      </span>
                      <span className="text-sm font-medium text-[var(--text-primary)] truncate">
                        {log.action || log.event || 'System activity'}
                      </span>
                    </div>

                    <span className={`px-2 py-0.5 text-[10px] font-mono rounded uppercase shrink-0 border ${
                      log.status === 'success' || log.status === 'completed'
                        ? 'bg-[var(--vault-green-bg)] text-[var(--vault-green-bright)] border-[var(--vault-green)]'
                        : 'bg-red-950/40 text-[var(--status-danger)] border-[var(--status-danger)]/40'
                    }`}>
                      {log.status || 'OK'}
                    </span>
                  </div>

                  {/* Line 2: Timestamp + IP address + Details trigger */}
                  <div className="flex items-center justify-between text-xs font-mono text-[var(--text-tertiary)] pt-0.5">
                    <span className="truncate">
                      {log.timestamp ? new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) : 'Just now'}
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

      {/* Pagination Controls */}
      {!loading && totalCount > 0 && (
        <div className="flex items-center justify-between font-mono text-xs text-[var(--text-tertiary)] pt-2 border-t border-[var(--border-primary)]">
          <span>Total entries: {totalCount}</span>
          <div className="flex items-center gap-2">
            <button
              disabled={page <= 1}
              onClick={() => setPage(prev => Math.max(1, prev - 1))}
              className="px-3 py-1.5 rounded-sm border border-[var(--border-primary)] hover:border-[var(--text-primary)] disabled:opacity-40"
            >
              Previous
            </button>
            <span>Page {page} of {totalPages}</span>
            <button
              disabled={page >= totalPages}
              onClick={() => setPage(prev => Math.min(totalPages, prev + 1))}
              className="px-3 py-1.5 rounded-sm border border-[var(--border-primary)] hover:border-[var(--text-primary)] disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
