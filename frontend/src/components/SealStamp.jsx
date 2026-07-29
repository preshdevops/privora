import React from 'react';
import { motion } from 'framer-motion';

/**
 * Privora's Signature Motion Element: "The Ledger Seal"
 * An unhurried, calm brass seal stamp that presses down and settles into the ledger
 * for significant completion moments (file protected, login succeeded, onboarding finished).
 */
export default function SealStamp({ 
  label = "SEALED", 
  subtitle = "OFFICIAL ENTRY", 
  size = "md",
  onComplete,
  className = "" 
}) {
  const dimensions = {
    sm: "w-16 h-16 text-[9px]",
    md: "w-24 h-24 text-[10px]",
    lg: "w-32 h-32 text-xs"
  }[size] || "w-24 h-24 text-[10px]";

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      <motion.div
        initial={{ scale: 1.8, opacity: 0, rotate: -12 }}
        animate={{ scale: 1, opacity: 1, rotate: -3 }}
        transition={{ 
          duration: 0.75, 
          ease: [0.16, 1, 0.3, 1] 
        }}
        onAnimationComplete={onComplete}
        className={`${dimensions} rounded-full border-2 border-[var(--accent-brass)] bg-[var(--bg-primary)] p-1 flex items-center justify-center relative select-none pointer-events-none`}
      >
        {/* Inner Seal Circle */}
        <div className="w-full h-full rounded-full border border-dashed border-[var(--accent-brass)] flex flex-col items-center justify-center text-center p-1 bg-[var(--bg-secondary)]">
          <span className="font-mono text-[8px] font-semibold text-[var(--accent-brass)] tracking-widest block uppercase">
            PRIVORA
          </span>
          <div className="w-6 h-[1px] bg-[var(--accent-brass)] my-0.5" />
          <span className="font-serif font-semibold text-[var(--accent-brass-bright)] tracking-wider block uppercase">
            {label}
          </span>
          {subtitle && (
            <span className="font-mono text-[7px] text-[var(--text-tertiary)] uppercase tracking-tight block mt-0.5">
              {subtitle}
            </span>
          )}
        </div>

        {/* Unhurried Settling Pulse */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0.6 }}
          animate={{ scale: 1.25, opacity: 0 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          className="absolute inset-0 rounded-full border border-[var(--accent-brass)] pointer-events-none"
        />
      </motion.div>
    </div>
  );
}
