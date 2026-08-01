import React, { useState, useEffect } from 'react';
import ProtectionDial from './ProtectionDial';

/**
 * LiveLedger — The audit-ledger feature made visible.
 * 
 * Styled like a security flight-recorder readout.
 * Uses IBM Plex Mono for exact timestamped entries.
 * No status dots, no red noise, quietly confident.
 */
export default function LiveLedger({
  initialEntries,
  compact = false,
  title = 'LIVE AUDIT LEDGER',
  className = '',
  autoPulse = true,
}) {
  const defaultEntries = [
    { time: '14:22:01', text: 'contract_draft.pdf encrypted and stored', status: 'stored' },
    { time: '14:22:47', text: 'access granted to your device (Lagos, NG)', status: 'access' },
    { time: '14:25:10', text: 'protection score recalculated: 94/100', status: 'score' },
    { time: '14:28:03', text: 'key derived in memory (device verified)', status: 'key' },
    { time: '14:31:19', text: 'tax_return_2025.pdf encrypted and stored', status: 'stored' },
  ];

  const [entries, setEntries] = useState(initialEntries || defaultEntries);
  const [lastUpdated, setLastUpdated] = useState('LIVE');

  // Simulated flight recorder tick to keep ledger feeling alive without distracting noise
  useEffect(() => {
    if (!autoPulse) return;

    const interval = setInterval(() => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const mins = String(now.getMinutes()).padStart(2, '0');
      const secs = String(now.getSeconds()).padStart(2, '0');
      const timeStr = `${hours}:${mins}:${secs}`;

      setLastUpdated(`${timeStr}`);
    }, 1000);

    return () => clearInterval(interval);
  }, [autoPulse]);

  const displayEntries = compact ? entries.slice(0, 3) : entries;

  return (
    <div className={`ledger-log-strip p-4 sm:p-5 relative ${className}`}>
      {/* Header bar styled like flight-recorder header */}
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#282820]">
        <div className="flex items-center gap-2">
          {/* Small ProtectionDial badge instead of a dot */}
          <ProtectionDial score={94} variant="badge" size={16} />
          <span className="font-mono-ledger text-xs font-semibold text-[var(--accent-brass)] tracking-widest uppercase">
            {title}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-mono-ledger text-[11px] text-[var(--text-tertiary)] uppercase tracking-wider">
            FLIGHT RECORDER
          </span>
          <span className="font-mono-ledger text-[11px] text-[var(--text-secondary)]">
            [{lastUpdated}]
          </span>
        </div>
      </div>

      {/* Monospace Log Rows */}
      <div className="space-y-2.5 max-h-[320px] overflow-y-auto pr-1">
        {displayEntries.map((entry, idx) => (
          <div
            key={idx}
            className="flex items-start gap-3 text-xs leading-relaxed font-mono-ledger transition-colors hover:bg-[#181812] p-1 rounded-none"
          >
            <span className="ledger-log-timestamp shrink-0 select-none">
              {entry.time}
            </span>
            <span className="text-[var(--border-secondary)] select-none">—</span>
            <span className="ledger-log-highlight break-all">
              {entry.text.split(' ').map((word, wIdx) => {
                if (word.endsWith('.pdf') || word.endsWith('.doc') || word.endsWith('.enc')) {
                  return (
                    <span key={wIdx} className="text-[var(--accent-brass)] underline underline-offset-2 font-medium">
                      {word}{' '}
                    </span>
                  );
                }
                if (word.includes('/100')) {
                  return (
                    <span key={wIdx} className="text-[#F2EFE6] bg-[var(--vault-green)] px-1 py-0.5 rounded-none font-bold">
                      {word}{' '}
                    </span>
                  );
                }
                return word + ' ';
              })}
            </span>
          </div>
        ))}
      </div>

      {/* Footer detail readout */}
      {!compact && (
        <div className="mt-4 pt-3 border-t border-[#282820] flex items-center justify-between text-[11px] font-mono-ledger text-[var(--text-tertiary)]">
          <span>LOG TYPE: PASSIVE AUDIT</span>
          <span>RECORDING ALL ACCESS EVENTS</span>
        </div>
      )}
    </div>
  );
}
