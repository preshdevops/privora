import { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';

export default function AccessLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [dateRange, setDateRange] = useState('Last 24 Hours');
  const [eventType, setEventType] = useState('All Events');
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

  // Client-side filtering
  const filteredLogs = logs.filter((log) => {
    const q = search.toLowerCase();
    const matchesSearch = !q || [
      log.action, log.event, log.ip_address, log.location, log.status,
    ].some((field) => (field || '').toLowerCase().includes(q));

    const matchesEvent = eventType === 'All Events' || (log.action || log.event || '').toLowerCase().includes(eventType.toLowerCase());
    const matchesStatus = statusFilter === 'Any Status' || (log.status || '').toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesEvent && matchesStatus;
  });

  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const showStart = (page - 1) * pageSize + 1;
  const showEnd = Math.min(page * pageSize, totalCount);

  const statusBadge = (status) => {
    const s = (status || '').toLowerCase();
    if (s === 'success') return { color: 'var(--status-success)', label: 'SUCCESS' };
    if (s === 'warning') return { color: 'var(--status-warning)', label: 'WARNING' };
    if (s === 'failed' || s === 'error') return { color: 'var(--status-danger)', label: 'FAILED' };
    return { color: 'var(--status-info)', label: (status || 'INFO').toUpperCase() };
  };

  const actionIcon = (action) => {
    const a = (action || '').toLowerCase();
    if (a.includes('login')) return '→⃗';
    if (a.includes('password')) return '⊞';
    if (a.includes('mfa') || a.includes('validation')) return '⊘';
    if (a.includes('api') || a.includes('key') || a.includes('rotation')) return '⟳';
    return '●';
  };

  const formatTimestamp = (dt) => {
    if (!dt) return '--';
    const d = new Date(dt);
    const date = d.toISOString().split('T')[0];
    const time = d.toTimeString().split(' ')[0];
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    return { date, time, tz };
  };

  const Skeleton = ({ className }) => <div className={`skeleton ${className}`} />;

  const PageButton = ({ p, active }) => (
    <div
      className={`w-8 h-8 rounded-none flex items-center justify-center text-xs font-mono font-bold cursor-pointer transition-colors`}
      style={{
        background: active ? 'var(--text-primary)' : 'var(--bg-card)',
        border: `1px solid var(--border-secondary)`,
        color: active ? 'var(--bg-primary)' : 'var(--text-secondary)',
      }}
      onClick={() => setPage(p)}
      role="button"
      tabIndex={0}
    >
      {p}
    </div>
  );

  const renderPagination = () => {
    const pages = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (page > 3) pages.push('...');
      const start = Math.max(2, page - 1);
      const end = Math.min(totalPages - 1, page + 1);
      for (let i = start; i <= end; i++) pages.push(i);
      if (page < totalPages - 2) pages.push('...');
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <div className="animate-fade-in-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start justify-between gap-4 mb-8">
        <div>
          <p className="text-[10px] tracking-[0.2em] uppercase font-bold font-mono mb-2 flex items-center gap-1.5" style={{ color: 'var(--text-muted)' }}>
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="square" strokeLinejoin="miter" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            System Ledger
          </p>
          <h1 className="text-3xl font-bold font-display mb-1" style={{ color: 'var(--text-primary)' }}>Access & Security Logs</h1>
          <p className="text-sm max-w-lg font-sans" style={{ color: 'var(--text-secondary)' }}>
            Immutable record of authentication events, cryptographic operations, and system access.
          </p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto justify-start sm:justify-end">
          <div
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-none text-sm font-bold cursor-pointer transition-colors border flex-1 sm:flex-initial"
            style={{
              background: 'var(--bg-card)',
              borderColor: 'var(--border-secondary)',
              color: 'var(--text-primary)',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--bg-hover)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--bg-card)'; }}
            role="button"
            tabIndex={0}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="square" strokeLinejoin="miter" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            EXPORT CSV
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div
        className="rounded-none border p-6 mb-8 shadow-[var(--shadow-card)]"
        style={{ background: 'var(--bg-card)', borderColor: 'var(--border-primary)' }}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Search */}
          <div>
            <label className="block text-[10px] tracking-[0.15em] uppercase font-bold font-mono mb-2" style={{ color: 'var(--text-muted)' }}>
              Search Filter
            </label>
            <div
              className="flex items-center gap-2 rounded-none px-4 py-3 border transition-colors focus-within:border-[var(--accent-gold)]"
              style={{ background: 'var(--bg-input)', borderColor: 'var(--border-secondary)' }}
            >
              <svg className="w-4 h-4 shrink-0" style={{ color: 'var(--text-muted)' }} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="square" strokeLinejoin="miter" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="IP, Hash, Target..."
                className="flex-1 bg-transparent text-sm outline-none font-mono"
                style={{ color: 'var(--text-primary)' }}
              />
            </div>
          </div>

          {/* Date Range */}
          <div>
            <label className="block text-[10px] tracking-[0.15em] uppercase font-bold font-mono mb-2" style={{ color: 'var(--text-muted)' }}>
              Timeframe
            </label>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="w-full px-4 py-3 rounded-none text-sm appearance-none cursor-pointer border transition-colors focus:border-[var(--accent-gold)] font-mono"
              style={{ background: 'var(--bg-input)', borderColor: 'var(--border-secondary)', color: 'var(--text-primary)' }}
            >
              <option>Last 24 Hours</option>
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
              <option>All Time</option>
            </select>
          </div>

          {/* Event Type */}
          <div>
            <label className="block text-[10px] tracking-[0.15em] uppercase font-bold font-mono mb-2" style={{ color: 'var(--text-muted)' }}>
              Event Signature
            </label>
            <select
              value={eventType}
              onChange={(e) => setEventType(e.target.value)}
              className="w-full px-4 py-3 rounded-none text-sm appearance-none cursor-pointer border transition-colors focus:border-[var(--accent-gold)] font-mono"
              style={{ background: 'var(--bg-input)', borderColor: 'var(--border-secondary)', color: 'var(--text-primary)' }}
            >
              <option>All Events</option>
              <option>Login</option>
              <option>Password Change</option>
              <option>MFA</option>
              <option>API Key</option>
            </select>
          </div>

          {/* Status */}
          <div>
            <label className="block text-[10px] tracking-[0.15em] uppercase font-bold font-mono mb-2" style={{ color: 'var(--text-muted)' }}>
              Status Code
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-3 rounded-none text-sm appearance-none cursor-pointer border transition-colors focus:border-[var(--accent-gold)] font-mono"
              style={{ background: 'var(--bg-input)', borderColor: 'var(--border-secondary)', color: 'var(--text-primary)' }}
            >
              <option>Any Status</option>
              <option>Success</option>
              <option>Warning</option>
              <option>Failed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Logs Table */}
      <div
        className="border overflow-x-auto mb-8 w-full shadow-[var(--shadow-card)]"
        style={{ background: 'var(--bg-card)', borderColor: 'var(--border-primary)' }}
      >
        <div className="min-w-[850px]">
          {/* Table Header */}
          <div
            className="grid grid-cols-12 px-6 py-4 text-[10px] tracking-[0.2em] uppercase font-bold border-b font-mono"
            style={{ color: 'var(--text-muted)', borderColor: 'var(--border-primary)', background: 'var(--bg-secondary)' }}
          >
            <span className="col-span-2">Timestamp</span>
            <span className="col-span-3">Action Signature</span>
            <span className="col-span-3">Target Resource</span>
            <span className="col-span-2">Origin IP</span>
            <span className="col-span-2 text-right">Status</span>
          </div>

          {/* Table Body */}
          {loading ? (
            [1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="px-6 py-4 border-b" style={{ borderColor: 'var(--border-primary)' }}>
                <Skeleton className="h-5 w-full" />
              </div>
            ))
          ) : filteredLogs.length === 0 ? (
            <div className="px-6 py-20 text-center">
              <p className="text-sm font-mono" style={{ color: 'var(--text-muted)' }}>[ NO RECORDS MATCHING QUERY ]</p>
            </div>
          ) : (
            filteredLogs.map((log, idx) => {
              const badge = statusBadge(log.status);
              const ts = formatTimestamp(log.timestamp || log.created_at);
              // subtle zebra striping
              const bg = idx % 2 === 0 ? 'var(--bg-card)' : 'var(--bg-secondary)';
              
              return (
                <div
                  key={log.id || idx}
                  className="grid grid-cols-12 items-center px-6 py-4 border-b transition-colors"
                  style={{ borderColor: 'var(--border-primary)', background: bg }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--bg-hover)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = bg; }}
                >
                  {/* Timestamp */}
                  <div className="col-span-2">
                    <p className="text-sm font-bold font-mono" style={{ color: 'var(--text-primary)' }}>{ts.date}</p>
                    <p className="text-xs font-mono" style={{ color: 'var(--text-secondary)' }}>{ts.time} <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{ts.tz}</span></p>
                  </div>

                  {/* Action */}
                  <div className="col-span-3 flex items-center gap-3">
                    <span className="text-sm font-mono" style={{ color: 'var(--accent-gold)' }}>{actionIcon(log.action || log.event)}</span>
                    <span className="text-sm font-bold font-sans" style={{ color: 'var(--text-primary)' }}>
                      {log.action || log.event || '--'}
                    </span>
                  </div>

                  {/* Target / Data Item */}
                  <div className="col-span-3 pr-4">
                    <span className="text-sm font-mono truncate block w-full" style={{ color: 'var(--text-secondary)' }}>
                      {log.data_item || log.location || '--'}
                    </span>
                  </div>

                  {/* IP Address */}
                  <div className="col-span-2">
                    <span className="text-sm font-mono" style={{ color: 'var(--text-secondary)' }}>
                      {log.ip_address || 'SYS_INTERNAL'}
                    </span>
                  </div>

                  {/* Status */}
                  <div className="col-span-2 flex justify-end">
                    <span
                      className="text-[10px] tracking-[0.1em] uppercase font-bold px-3 py-1 font-mono"
                      style={{ border: `1px solid ${badge.color}40`, color: badge.color }}
                    >
                      [{badge.label}]
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Pagination (Responsive Layout) */}
      {!loading && totalCount > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
          <span className="text-sm text-center sm:text-left font-mono" style={{ color: 'var(--text-muted)' }}>
            RECORDS: {showStart}-{showEnd} / {totalCount.toLocaleString()}
          </span>
          <div className="flex items-center gap-2">
            <div
              className={`w-8 h-8 rounded-none flex items-center justify-center cursor-pointer transition-colors ${page <= 1 ? 'opacity-40 cursor-not-allowed' : ''}`}
              style={{ background: 'var(--bg-card)', border: '1px solid var(--border-secondary)', color: 'var(--text-secondary)' }}
              onClick={() => { if (page > 1) setPage(page - 1); }}
              role="button"
              tabIndex={0}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="square" strokeLinejoin="miter" d="M15 19l-7-7 7-7" />
              </svg>
            </div>
            {renderPagination().map((p, idx) =>
              p === '...' ? (
                <span key={`dots-${idx}`} className="px-1 text-sm font-mono" style={{ color: 'var(--text-muted)' }}>...</span>
              ) : (
                <PageButton key={p} p={p} active={p === page} />
              )
            )}
            <div
              className={`w-8 h-8 rounded-none flex items-center justify-center cursor-pointer transition-colors ${page >= totalPages ? 'opacity-40 cursor-not-allowed' : ''}`}
              style={{ background: 'var(--bg-card)', border: '1px solid var(--border-secondary)', color: 'var(--text-secondary)' }}
              onClick={() => { if (page < totalPages) setPage(page + 1); }}
              role="button"
              tabIndex={0}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="square" strokeLinejoin="miter" d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

