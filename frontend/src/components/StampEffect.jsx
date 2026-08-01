import React from 'react';
import { motion } from 'framer-motion';

/**
 * StampEffect — Minimalist Protection Status Pill
 */
export default function StampEffect({
  trigger = true,
  label = 'LOCKED & SAFE',
  className = '',
}) {
  if (!trigger) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      className={`inline-flex items-center gap-2 px-3 py-1 bg-[var(--accent-brass-bg)] border border-[var(--accent-gold)] text-[var(--accent-gold)] font-mono text-[11px] font-semibold rounded-md ${className}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-gold)] shrink-0" />
      <span className="tracking-wider uppercase">{label}</span>
    </motion.div>
  );
}
