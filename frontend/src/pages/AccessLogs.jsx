import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axiosInstance from '../api/axiosInstance';
import SecurityActionBtn from '../components/SecurityActionBtn';
import EmptyState from '../components/EmptyState';
import { Activity, Search, Download, ShieldCheck, AlertOctagon, Terminal } from 'lucide-react';

export default function AccessLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('Any Status');

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
    link.setAttribute("download", `privora_activity_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const filteredLogs = logs.filter((log) => {
    const q = search.toLowerCase();
    const matchesSearch = !q || [
      log.action, log.event, log.ip_address, log.location, log.status, log.data_item
    ].some((field) => (field || '').toLowerCase().includes(q));

    const matchesStatus = statusFilter === 'Any Status' || (log.status || '').toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
        <div>
          <span className="text-xs font-mono text-[var(--accent-brass)] uppercase tracking-widest flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5" />
            Activity History
          </span>
          <h1 className="text-3xl font-serif font-semibold text-[var(--text-primary)] mt-1">
            Access & Security Logs
          </h1>
          <p className="text-xs text-[var(--text-secondary)] mt-1">
            A complete record of logins, file actions, and settings changes on your account.
          </p>
        </div>

        <SecurityActionBtn
          onClick={handleExportCSV}
          actionLabel="Preparing CSV…"
          successLabel="Downloaded"
          delayMs={650}
          variant="outline"
        >
          <Download className="w-4 h-4 text-[var(--accent-brass)]" />
          <span>Export CSV</span>
        </SecurityActionBtn>
      </div>

      {/* Filter Bar */}
      <div className="layered-card p-5 rounded-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 px-3 py-2 rounded-sm bg-[var(--bg-input)] border border-[var(--border-primary)] w-full md:w-80">
          <Search className="w-4 h-4 text-[var(--text-tertiary)] shrink-0" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by IP, action, or file name…"
            className="bg-transparent text-xs text-[var(--text-primary)] outline-none w-full"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
          <label className="text-xs text-[var(--text-tertiary)] shrink-0">
            Status:
          </label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 rounded-sm bg-[var(--bg-input)] border border-[var(--border-primary)] text-xs text-[var(--text-primary)] outline-none"
          >
            <option>Any Status</option>
            <option value="success">Success</option>
            <option value="failed">Failed</option>
          </select>
        </div>
      </div>

      {/* Logs Table */}
      {loading ? (
        <div className="layered-card p-8 rounded-sm space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="skeleton h-10 w-full" />
          ))}
        </div>
      ) : filteredLogs.length === 0 ? (
        <EmptyState
          title="No matching logs"
          description="No activity matches your current filter. Try adjusting your search."
          iconType="logs"
        />
      ) : (
        <div className="layered-card rounded-sm overflow-hidden border border-[var(--border-primary)]">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[var(--bg-sidebar)] border-b border-[var(--border-primary)] text-[var(--text-tertiary)] uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="px-5 py-3.5">Time</th>
                  <th className="px-5 py-3.5">Action</th>
                  <th className="px-5 py-3.5">File / Resource</th>
                  <th className="px-5 py-3.5">IP Address</th>
                  <th className="px-5 py-3.5 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-primary)] text-[var(--text-secondary)]">
                {filteredLogs.map((log, idx) => (
                  <tr key={log.id || idx} className="hover:bg-[var(--bg-hover)] transition-colors">
                    <td className="px-5 py-3.5 text-[var(--text-primary)]">
                      {log.timestamp ? new Date(log.timestamp).toISOString().replace('T', ' ').slice(0, 19) : '--'}
                    </td>
                    <td className="px-5 py-3.5 font-medium text-[var(--text-primary)] flex items-center gap-2">
                      <Activity className="w-3.5 h-3.5 text-[var(--accent-brass)]" />
                      <span>{log.action || log.event || 'Activity'}</span>
                    </td>
                    <td className="px-5 py-3.5 text-[var(--text-secondary)] truncate max-w-xs">
                      {log.data_item || log.location || '—'}
                    </td>
                    <td className="px-5 py-3.5 text-[var(--text-tertiary)]">
                      {log.ip_address || '127.0.0.1'}
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <span className={`px-2 py-0.5 rounded text-[10px] border uppercase ${
                        log.status === 'success' || log.status === 'completed'
                          ? 'bg-[var(--badge-success-bg)] text-[var(--badge-success-text)] border-[var(--status-success)]/30'
                          : 'bg-[var(--badge-danger-bg)] text-[var(--badge-danger-text)] border-[var(--status-danger)]/30'
                      }`}>
                        {log.status || 'INFO'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Pagination Controls */}
      {!loading && totalCount > 0 && (
        <div className="flex items-center justify-between text-xs text-[var(--text-tertiary)] pt-2">
          <span>Total: {totalCount} entries</span>
          <div className="flex items-center gap-2">
            <button
              disabled={page <= 1}
              onClick={() => setPage(prev => Math.max(1, prev - 1))}
              className="px-3 py-1.5 rounded-sm bg-[var(--bg-input)] border border-[var(--border-primary)] hover:border-[var(--border-secondary)] disabled:opacity-40"
            >
              Previous
            </button>
            <span>Page {page} of {totalPages}</span>
            <button
              disabled={page >= totalPages}
              onClick={() => setPage(prev => Math.min(totalPages, prev + 1))}
              className="px-3 py-1.5 rounded-sm bg-[var(--bg-input)] border border-[var(--border-primary)] hover:border-[var(--border-secondary)] disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
