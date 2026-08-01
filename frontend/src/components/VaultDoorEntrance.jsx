import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PrivoraSeal from './PrivoraSeal';

/**
 * VaultDoorEntrance — Minimalist Entrance Unseal
 */
export default function VaultDoorEntrance({ onComplete }) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 100);

    const completeTimer = setTimeout(() => {
      if (onComplete) onComplete();
    }, 550);

    return () => {
      clearTimeout(timer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <AnimatePresence>
      {!isOpen && (
        <motion.div
          key="vault-door"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[var(--bg-primary)]"
        >
          <div className="flex flex-col items-center gap-3 text-center">
            <PrivoraSeal variant="glyph" size={48} className="animate-pulse text-[var(--accent-gold)]" />
            <span className="font-mono text-xs text-[var(--text-secondary)] tracking-widest uppercase">
              UNSEALING VAULT…
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
