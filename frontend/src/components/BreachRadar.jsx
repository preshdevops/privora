import { useState, useEffect } from 'react';
import { ShieldCheck, AlertTriangle, RefreshCw } from 'lucide-react';
import axiosInstance from '../api/axiosInstance';
import SecurityActionBtn from './SecurityActionBtn';

export default function BreachRadar({ className = '' }) {
  const [breachData, setBreachData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [scanning, setScanning] = useState(false);

  const fetchBreachStatus = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get('/api/privacy/breach-check/');
      setBreachData(res.data);
    } catch {
      setBreachData(null);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchBreachStatus();
  }, []);

  const handleRescan = async () => {
    setScanning(true);
    await fetchBreachStatus();
    setScanning(false);
  };

  const isBreached = breachData?.status === 'breached' || (breachData?.breaches_count || 0) > 0;

  return (
    <div className={`p-6 rounded-xl border border-[var(--border-primary)] bg-[var(--bg-secondary)] space-y-4 ${className}`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--border-primary)] pb-4">
        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-lg border ${isBreached ? 'bg-red-500/10 border-red-500/30 text-red-500' : 'bg-[var(--accent-gold)]/10 border-[var(--accent-gold)]/30 text-[var(--accent-gold)]'}`}>
            {isBreached ? <AlertTriangle className="w-5 h-5" /> : <ShieldCheck className="w-5 h-5" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-display font-bold text-base text-[var(--text-primary)]">
                Breach & Dark Web Radar
              </h3>
              <span className={`text-[10px] uppercase font-mono px-2 py-0.5 rounded border ${isBreached ? 'bg-red-500/10 text-red-400 border-red-500/30' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'}`}>
                {isBreached ? 'Exposures Found' : 'Clean / Protected'}
              </span>
            </div>
            <p className="text-xs text-[var(--text-secondary)] font-sans mt-0.5">
              Continuous k-anonymity leak monitoring for <span className="font-mono text-[var(--text-primary)]">{breachData?.email || 'account'}</span>
            </p>
          </div>
        </div>

        <SecurityActionBtn
          onClick={handleRescan}
          actionLabel="Scanning…"
          successLabel="Scan Complete"
          variant="outline"
          className="text-xs self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${scanning ? 'animate-spin' : ''}`} />
          Run Scan
        </SecurityActionBtn>
      </div>

      {loading ? (
        <div className="py-4 text-center text-xs font-mono text-[var(--text-secondary)]">
          Scanning credential leak databases...
        </div>
      ) : isBreached ? (
        <div className="space-y-3">
          {breachData?.breaches?.map((breach, idx) => (
            <div key={idx} className="p-3.5 rounded-lg border border-red-500/20 bg-red-500/5 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold font-display text-red-400">{breach.name}</span>
                <span className="font-mono text-[10px] text-[var(--text-secondary)]">Exposed: {breach.breach_date}</span>
              </div>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                {breach.description}
              </p>
              {breach.data_classes && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {breach.data_classes.map((cls, cIdx) => (
                    <span key={cIdx} className="text-[10px] font-mono px-2 py-0.5 rounded bg-red-500/10 text-red-300 border border-red-500/20">
                      {cls}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="py-2 flex items-center justify-between text-xs text-[var(--text-secondary)] font-sans">
          <span>Zero dark web exposures detected for this identity.</span>
          {breachData?.last_scanned && (
            <span className="font-mono text-[10px]">
              Last verified: {new Date(breachData.last_scanned).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
