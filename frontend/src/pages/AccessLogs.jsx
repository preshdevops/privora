import { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';

export default function AccessLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [nextUrl, setNextUrl] = useState(null);
  const [prevUrl, setPrevUrl] = useState(null);
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
        setNextUrl(data.next);
        setPrevUrl(data.previous);
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
    if (s === 'success') return { bg: 'var(--badge-success-bg)', color: 'var(--badge-success-text)', label: 'SUCCESS' };
    if (s === 'warning') return { bg: 'var(--badge-warning-bg)', color: 'var(--badge-warning-text)', label: 'WARNING' };
    if (s === 'failed' || s === 'error') return { bg: 'var(--badge-danger-bg)', color: 'var(--badge-danger-text)', label: 'FAILED' };
    return { bg: 'var(--badge-info-bg)', color: 'var(--badge-info-text)', label: (status || 'INFO').toUpperCase() };
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
      className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-medium cursor-pointer transition-all ${active ? 'text-white' : ''}`}
      style={{
        background: active ? '#2563eb' : 'var(--bg-card)',
        border: `1px solid ${active ? '#2563eb' : 'var(--border-secondary)'}`,
        color: active ? '#fff' : 'var(--text-secondary)',
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
      <div className="flex items-start justify-between mb-8">
        <div>
          <p className="text-[10px] tracking-[0.2em] uppercase font-bold mb-2" style={{ color: 'var(--text-muted)' }}>
            📋 Audit Trail System
          </p>
          <h1 className="text-2xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>Access Logs</h1>
          <p className="text-sm max-w-lg" style={{ color: 'var(--text-secondary)' }}>
            Monitor real-time authentication events, system handshakes, and potential security anomalies across your global infrastructure.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium cursor-pointer transition-all border"
            style={{
              background: 'var(--bg-card)',
              borderColor: 'var(--border-secondary)',
              color: 'var(--text-primary)',
            }}
            role="button"
            tabIndex={0}
            id="export-csv-btn"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Export CSV
          </div>
          <div
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold text-white bg-accent-blue cursor-pointer hover:bg-accent-glow transition-all duration-200 border border-accent-blue"
            role="button"
            tabIndex={0}
            id="live-feed-btn"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Live Feed
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div
        className="rounded-2xl border p-5 mb-6"
        style={{ background: 'var(--bg-card)', borderColor: 'var(--border-primary)' }}
      >
        <div className="grid grid-cols-4 gap-4">
          {/* Search */}
          <div>
            <label className="block text-[10px] tracking-[0.15em] uppercase font-bold mb-1.5" style={{ color: 'var(--text-muted)' }}>
              Search Logs
            </label>
            <div
              className="flex items-center gap-2 rounded-lg px-3 py-2.5"
              style={{ background: 'var(--bg-input)', border: '1px solid var(--border-secondary)' }}
            >
              <svg className="w-4 h-4 shrink-0" style={{ color: 'var(--text-muted)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="IP Address, Action, or Location..."
                className="flex-1 bg-transparent text-sm outline-none"
                style={{ color: 'var(--text-primary)' }}
                id="log-search-input"
              />
            </div>
          </div>

          {/* Date Range */}
          <div>
            <label className="block text-[10px] tracking-[0.15em] uppercase font-bold mb-1.5" style={{ color: 'var(--text-muted)' }}>
              Date Range
            </label>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg text-sm appearance-none cursor-pointer"
              style={{ background: 'var(--bg-input)', border: '1px solid var(--border-secondary)', color: 'var(--text-primary)' }}
              id="date-range-select"
            >
              <option>Last 24 Hours</option>
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
              <option>All Time</option>
            </select>
          </div>

          {/* Event Type */}
          <div>
            <label className="block text-[10px] tracking-[0.15em] uppercase font-bold mb-1.5" style={{ color: 'var(--text-muted)' }}>
              Event Type
            </label>
            <select
              value={eventType}
              onChange={(e) => setEventType(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg text-sm appearance-none cursor-pointer"
              style={{ background: 'var(--bg-input)', border: '1px solid var(--border-secondary)', color: 'var(--text-primary)' }}
              id="event-type-select"
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
            <label className="block text-[10px] tracking-[0.15em] uppercase font-bold mb-1.5" style={{ color: 'var(--text-muted)' }}>
              Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg text-sm appearance-none cursor-pointer"
              style={{ background: 'var(--bg-input)', border: '1px solid var(--border-secondary)', color: 'var(--text-primary)' }}
              id="status-filter-select"
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
        className="rounded-2xl border overflow-hidden mb-6"
        style={{ background: 'var(--bg-card)', borderColor: 'var(--border-primary)' }}
      >
        {/* Table Header */}
        <div
          className="grid grid-cols-12 px-5 py-3 text-[10px] tracking-[0.15em] uppercase font-bold border-b"
          style={{ color: 'var(--text-muted)', borderColor: 'var(--border-primary)' }}
        >
          <span className="col-span-2">Timestamp</span>
          <span className="col-span-3">Action / Event</span>
          <span className="col-span-2">IP Address</span>
          <span className="col-span-2">Location</span>
          <span className="col-span-2">Status</span>
          <span className="col-span-1">Details</span>
        </div>

        {/* Table Body */}
        {loading ? (
          [1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="px-5 py-4 border-b" style={{ borderColor: 'var(--border-primary)' }}>
              <Skeleton className="h-5 w-full" />
            </div>
          ))
        ) : filteredLogs.length === 0 ? (
          <div className="px-5 py-16 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center" style={{ background: 'var(--bg-hover)' }}>
              <svg className="w-8 h-8" style={{ color: 'var(--text-muted)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <p className="text-sm font-medium mb-1" style={{ color: 'var(--text-primary)' }}>No logs found</p>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Try adjusting your filters or check back later.</p>
          </div>
        ) : (
          filteredLogs.map((log, idx) => {
            const badge = statusBadge(log.status);
            const ts = formatTimestamp(log.timestamp || log.created_at);
            return (
              <div
                key={log.id || idx}
                className="grid grid-cols-12 items-center px-5 py-3.5 border-b transition-colors"
                style={{ borderColor: 'var(--border-primary)' }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--bg-hover)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
              >
                {/* Timestamp */}
                <div className="col-span-2">
                  <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{ts.date}</p>
                  <p className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>{ts.time}</p>
                  <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{ts.tz}</p>
                </div>

                {/* Action */}
                <div className="col-span-3 flex items-center gap-2">
                  <span className="text-sm">{actionIcon(log.action || log.event)}</span>
                  <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                    {log.action || log.event || '--'}
                  </span>
                </div>

                {/* IP Address */}
                <div className="col-span-2">
                  <span className="text-sm font-mono" style={{ color: 'var(--text-secondary)' }}>
                    {log.ip_address || 'Internal System'}
                  </span>
                </div>

                {/* Location */}
                <div className="col-span-2">
                  <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                    {log.location || '--'}
                  </span>
                </div>

                {/* Status */}
                <div className="col-span-2">
                  <span
                    className="text-[10px] tracking-wider uppercase font-bold px-3 py-1 rounded-full"
                    style={{ background: badge.bg, color: badge.color }}
                  >
                    {badge.label}
                  </span>
                </div>

                {/* Details */}
                <div className="col-span-1 flex justify-end">
                  <div
                    className="w-7 h-7 rounded flex items-center justify-center cursor-pointer transition-colors"
                    style={{ color: 'var(--text-muted)' }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--text-secondary)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-muted)'; }}
                    role="button"
                    tabIndex={0}
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <circle cx="12" cy="6" r="1.5" />
                      <circle cx="12" cy="12" r="1.5" />
                      <circle cx="12" cy="18" r="1.5" />
                    </svg>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Pagination */}
      {!loading && totalCount > 0 && (
        <div className="flex items-center justify-between mb-8">
          <span className="text-sm" style={{ color: 'var(--text-muted)' }}>
            Showing {showStart}-{showEnd} of {totalCount.toLocaleString()} events
          </span>
          <div className="flex items-center gap-2">
            <div
              className={`w-8 h-8 rounded-lg flex items-center justify-center cursor-pointer transition-all ${page <= 1 ? 'opacity-40 cursor-not-allowed' : ''}`}
              style={{ background: 'var(--bg-card)', border: '1px solid var(--border-secondary)', color: 'var(--text-secondary)' }}
              onClick={() => { if (page > 1) setPage(page - 1); }}
              role="button"
              tabIndex={0}
              id="pagination-prev"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </div>
            {renderPagination().map((p, idx) =>
              p === '...' ? (
                <span key={`dots-${idx}`} className="px-1 text-sm" style={{ color: 'var(--text-muted)' }}>...</span>
              ) : (
                <PageButton key={p} p={p} active={p === page} />
              )
            )}
            <div
              className={`w-8 h-8 rounded-lg flex items-center justify-center cursor-pointer transition-all ${page >= totalPages ? 'opacity-40 cursor-not-allowed' : ''}`}
              style={{ background: 'var(--bg-card)', border: '1px solid var(--border-secondary)', color: 'var(--text-secondary)' }}
              onClick={() => { if (page < totalPages) setPage(page + 1); }}
              role="button"
              tabIndex={0}
              id="pagination-next"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Stats Cards */}
      <div className="grid grid-cols-3 gap-5">
        {/* Health Index */}
        <div
          className="p-5 rounded-2xl border"
          style={{ background: 'var(--bg-card)', borderColor: 'var(--border-primary)', boxShadow: 'var(--shadow-card)' }}
        >
          <div className="flex items-center gap-2 mb-3">
            <span className="text-emerald-400">💚</span>
            <span className="text-[10px] tracking-[0.2em] uppercase font-bold" style={{ color: 'var(--text-muted)' }}>
              Health Index
            </span>
          </div>
          <p className="text-3xl font-bold mb-3" style={{ color: 'var(--text-primary)' }}>99.8%</p>
          <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: 'var(--bg-hover)' }}>
            <div className="h-full rounded-full bg-emerald-400" style={{ width: '99.8%' }} />
          </div>
        </div>

        {/* Failed Attempts */}
        <div
          className="p-5 rounded-2xl border"
          style={{ background: 'var(--bg-card)', borderColor: 'var(--border-primary)', boxShadow: 'var(--shadow-card)' }}
        >
          <div className="flex items-center gap-2 mb-3">
            <span className="text-red-400">🔴</span>
            <span className="text-[10px] tracking-[0.2em] uppercase font-bold" style={{ color: 'var(--text-muted)' }}>
              Failed Attempts
            </span>
          </div>
          <p className="text-3xl font-bold mb-3" style={{ color: 'var(--text-primary)' }}>12</p>
          <p className="text-xs" style={{ color: 'var(--badge-danger-text)' }}>~6% from previous period</p>
        </div>

        {/* Active Sessions */}
        <div
          className="p-5 rounded-2xl border"
          style={{ background: 'var(--bg-card)', borderColor: 'var(--border-primary)', boxShadow: 'var(--shadow-card)' }}
        >
          <div className="flex items-center gap-2 mb-3">
            <span className="text-accent-light">✨</span>
            <span className="text-[10px] tracking-[0.2em] uppercase font-bold" style={{ color: 'var(--text-muted)' }}>
              Active Sessions
            </span>
          </div>
          <p className="text-3xl font-bold mb-3" style={{ color: 'var(--text-primary)' }}>342</p>
          <div className="flex items-center -space-x-2">
            {['bg-blue-500', 'bg-amber-500', 'bg-purple-500'].map((bg, i) => (
              <div
                key={i}
                className={`w-7 h-7 rounded-full ${bg} flex items-center justify-center text-white text-[10px] font-bold border-2`}
                style={{ borderColor: 'var(--bg-card-solid)' }}
              >
                {['JC', 'A', 'MI'][i]}
              </div>
            ))}
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold border-2"
              style={{
                background: 'var(--bg-hover)',
                borderColor: 'var(--bg-card-solid)',
                color: 'var(--text-muted)',
              }}
            >
              +
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
