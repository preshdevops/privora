import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * HeartbeatLedger — Signature Animated Moment #3: The Heartbeat Ledger
 * 
 * A living line of activity that gently pulses in new entries one at a time,
 * glowing softly for a second before settling.
 * Uses plain language (e.g. "Your contract file was locked just now.")
 */
export default function HeartbeatLedger({
  entries = [],
  title = 'HEARTBEAT AUDIT LEDGER',
  className = '',
  compact = false,
}) {
  const defaultEntries = [
    { time: 'Just now', text: 'Your contract file was locked and sealed in the vault.' },
    { time: '2 mins ago', text: 'You viewed this file from your recognized phone.' },
    { time: '14 mins ago', text: 'Protection score increased to 94 after key verification.' },
  ];

  const list = entries.length > 0 ? entries : defaultEntries;
  const displayList = compact ? list.slice(0, 3) : list;

  return (
    <div className={`ledger-log-strip p-4 sm:p-5 relative ${className}`}>
      {/* Header bar */}
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#282820]">
        <div className="flex items-center gap-2">
          {/* Gentle Pulse Heartbeat indicator ring */}
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--accent-brass)] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[var(--accent-brass)]"></span>
          </span>
          <span className="font-mono-ledger text-xs font-bold text-[var(--accent-brass)] tracking-widest uppercase">
            {title}
          </span>
        </div>
        <span className="font-mono-ledger text-[10px] text-[var(--text-tertiary)] uppercase tracking-wider">
          LIVE PULSE STREAM
        </span>
      </div>

      {/* Monospace Log Entries with Framer Motion heartbeat entrance */}
      <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
        <AnimatePresence initial={false}>
          {displayList.map((item, idx) => (
            <motion.div
              key={item.id || `${item.time}-${idx}-${item.text}`}
              initial={{ opacity: 0, y: -12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ type: 'spring', stiffness: 350, damping: 22 }}
              className="flex items-start gap-3 text-xs leading-relaxed font-mono-ledger p-2 rounded-none transition-colors hover:bg-[#181812] group bg-[#11110C] border-l-2 border-[var(--accent-brass)]"
            >
              <span className="text-[var(--accent-brass)] shrink-0 font-medium select-none">
                [{item.time}]
              </span>
              <span className="text-[var(--border-secondary)] select-none">—</span>
              <span className="text-[#F2EFE6] group-hover:text-white transition-colors">
                {item.text}
              </span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Quiet Footer */}
      {!compact && (
        <div className="mt-4 pt-3 border-t border-[#282820] flex items-center justify-between text-[10px] font-mono-ledger text-[var(--text-tertiary)]">
          <span>EVERY MOVE RECORDED IN REAL TIME</span>
          <span>NOTHING HAPPENS IN THE DARK</span>
        </div>
      )}
    </div>
  );
}
