import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * VaultDoorEntrance — Signature Animated Moment #1
 * 
 * A heavy circular vault door (built from the Privora Seal shape)
 * that swings open with mechanical weight & soft spring physics upon arrival.
 * Happens once per session under 1 second.
 */
export default function VaultDoorEntrance({ onComplete }) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Start heavy mechanical unlock after 150ms
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 150);

    // Call onComplete callback when door fully opens
    const completeTimer = setTimeout(() => {
      if (onComplete) onComplete();
    }, 950);

    return () => {
      clearTimeout(timer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <AnimatePresence>
      {!isOpen ? (
        <motion.div
          key="vault-door"
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#14140F] overflow-hidden"
          exit={{ opacity: 0, transition: { duration: 0.35, ease: 'easeOut' } }}
        >
          {/* Left Door Half */}
          <motion.div
            initial={{ x: 0 }}
            animate={isOpen ? { x: '-100%' } : { x: 0 }}
            transition={{ type: 'spring', stiffness: 180, damping: 24, mass: 1.2 }}
            className="absolute left-0 top-0 bottom-0 w-1/2 bg-[#14140F] border-r border-[var(--border-secondary)] flex items-center justify-end pr-0 shadow-2xl z-20"
          >
            <div className="w-48 h-[120%] border-r-2 border-[var(--accent-brass)] opacity-20 absolute -right-24 rounded-full pointer-events-none" />
          </motion.div>

          {/* Right Door Half */}
          <motion.div
            initial={{ x: 0 }}
            animate={isOpen ? { x: '100%' } : { x: 0 }}
            transition={{ type: 'spring', stiffness: 180, damping: 24, mass: 1.2 }}
            className="absolute right-0 top-0 bottom-0 w-1/2 bg-[#14140F] border-l border-[var(--border-secondary)] flex items-center justify-start pl-0 shadow-2xl z-20"
          >
            <div className="w-48 h-[120%] border-l-2 border-[var(--accent-brass)] opacity-20 absolute -left-24 rounded-full pointer-events-none" />
          </motion.div>

          {/* Central Heavy Brass Vault Wheel Emblem */}
          <motion.div
            initial={{ scale: 1, rotate: 0 }}
            animate={isOpen ? { scale: 0.8, rotate: 90, opacity: 0 } : { scale: 1, rotate: -25 }}
            transition={{ type: 'spring', stiffness: 220, damping: 20 }}
            className="relative z-30 flex flex-col items-center justify-center p-8 bg-[#1C1C16] border-2 border-[var(--accent-brass)] rounded-full shadow-[0_0_50px_rgba(201,162,39,0.25)]"
          >
            {/* Outer heavy wheel spokes */}
            <svg width="180" height="180" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="50" cy="50" r="46" stroke="#C9A227" strokeWidth="2" />
              <circle cx="50" cy="50" r="38" stroke="#C9A227" strokeWidth="1" strokeDasharray="3 3" />
              <circle cx="50" cy="50" r="28" stroke="#2F5D46" strokeWidth="3" fill="#14140F" />
              
              {/* Mechanical Vault Door Spokes */}
              <line x1="50" y1="4" x2="50" y2="96" stroke="#C9A227" strokeWidth="2.5" />
              <line x1="4" y1="50" x2="96" y2="50" stroke="#C9A227" strokeWidth="2.5" />
              <line x1="17.5" y1="17.5" x2="82.5" y2="82.5" stroke="#C9A227" strokeWidth="1.5" />
              <line x1="82.5" y1="17.5" x2="17.5" y2="82.5" stroke="#C9A227" strokeWidth="1.5" />

              {/* Central Keyhole Notch Monogram */}
              <line x1="47" y1="36" x2="47" y2="58" stroke="#F2EFE6" strokeWidth="2" strokeLinecap="round" />
              <path d="M47 36 C47 36, 56 36, 56 43 C56 50, 47 50, 47 50" stroke="#F2EFE6" strokeWidth="2" strokeLinecap="round" fill="none" />
              <circle cx="51.5" cy="43" r="2" fill="#C9A227" />
            </svg>

            <span className="font-mono-ledger text-[11px] text-[var(--accent-brass)] tracking-widest mt-3 uppercase font-semibold">
              UNSEALING VAULT…
            </span>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
