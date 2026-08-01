import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * StampEffect — Signature Animated Moment #2: The Stamp
 * 
 * The Privora Seal drops down fast and stamps the target element/screen
 * with a satisfying thud-and-settle spring motion (scale 2.4 down to 1.0 + bounce).
 */
export default function StampEffect({
  trigger = false,
  label = 'SEALED & SECURED',
  onStampComplete,
  size = 72,
  inline = false,
}) {
  const [stamping, setStamping] = useState(false);

  useEffect(() => {
    if (trigger) {
      setStamping(true);
      const timer = setTimeout(() => {
        setStamping(false);
        if (onStampComplete) onStampComplete();
      }, 900);
      return () => clearTimeout(timer);
    }
  }, [trigger, onStampComplete]);

  if (inline) {
    return (
      <AnimatePresence>
        {trigger && (
          <motion.div
            initial={{ scale: 2.2, opacity: 0, rotate: -15 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 450, damping: 18, mass: 0.8 }}
            className="inline-flex items-center gap-2 px-3 py-1 bg-[#1C1C16] border-2 border-[var(--accent-brass)] text-[var(--accent-brass)] font-mono-ledger text-xs font-bold uppercase shadow-[0_4px_20px_rgba(201,162,39,0.3)] select-none"
          >
            <svg width="18" height="18" viewBox="0 0 32 32" fill="none">
              <circle cx="16" cy="16" r="14" fill="#2F5D46" fillOpacity="0.4" stroke="#C9A227" strokeWidth="1.5" />
              <line x1="13.5" y1="10" x2="13.5" y2="22" stroke="#F2EFE6" strokeWidth="1.5" strokeLinecap="round" />
              <path d="M13.5 10 C13.5 10, 19.5 10, 19.5 14.5 C19.5 19, 13.5 19, 13.5 19" stroke="#F2EFE6" strokeWidth="1.5" strokeLinecap="round" fill="none" />
              <circle cx="16.5" cy="14.5" r="1.2" fill="#C9A227" />
            </svg>
            <span>{label}</span>
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

  return (
    <AnimatePresence>
      {stamping && (
        <div className="absolute inset-0 pointer-events-none z-40 flex items-center justify-center overflow-hidden">
          {/* Subtle Flash Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.25 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="absolute inset-0 bg-[var(--accent-brass)] opacity-10"
          />

          {/* Rubber Stamp dropping down fast */}
          <motion.div
            initial={{ scale: 3.5, opacity: 0, rotate: -12 }}
            animate={{ scale: 1, opacity: 1, rotate: -3 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{
              type: 'spring',
              stiffness: 500,
              damping: 16,
              mass: 0.6,
            }}
            className="relative flex flex-col items-center justify-center p-6 bg-[#1C1C16]/95 border-4 border-[var(--accent-brass)] shadow-[0_10px_40px_rgba(201,162,39,0.35)] backdrop-blur-md rotate-[-3deg]"
          >
            <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
              <circle cx="32" cy="32" r="29" stroke="#C9A227" strokeWidth="2.5" />
              <circle cx="32" cy="32" r="23" stroke="#2F5D46" strokeWidth="2" strokeDasharray="3 2" fill="#2F5D46" fillOpacity="0.3" />
              <line x1="27" y1="20" x2="27" y2="44" stroke="#F2EFE6" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M27 20 C27 20, 40 20, 40 29 C40 38, 27 38, 27 38" stroke="#F2EFE6" strokeWidth="2.5" strokeLinecap="round" fill="none" />
              <circle cx="33.5" cy="29" r="2.5" fill="#C9A227" />
              <line x1="20" y1="48" x2="44" y2="48" stroke="#C9A227" strokeWidth="1.5" strokeLinecap="round" />
            </svg>

            <span className="font-mono-ledger text-sm font-bold text-[var(--accent-brass)] tracking-widest mt-2 uppercase">
              {label}
            </span>
            <span className="font-mono-ledger text-[9px] text-[var(--text-tertiary)] tracking-tight">
              PRIVORA SEALED RECORD
            </span>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
