import React from 'react';
import { motion } from 'framer-motion';

/**
 * Privora's Signature Motion Element: "The Ledger Seal"
 * An authentic brass/wax emblem that presses down and settles into the ledger page
 * whenever an item is officially sealed and protected.
 */
export default function SealStamp({ 
  label = "SEALED", 
  subtitle = "OFFICIAL RECORD", 
  size = "md", // "sm" | "md" | "lg"
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
      {/* Pressed Seal Container with Spring Impact Animation */}
      <motion.div
        initial={{ scale: 2.2, opacity: 0, rotate: -18 }}
        animate={{ scale: 1, opacity: 1, rotate: -4 }}
        transition={{ 
          type: "spring", 
          stiffness: 350, 
          damping: 22,
          mass: 1.2
        }}
        onAnimationComplete={onComplete}
        className={`${dimensions} rounded-full border-2 border-[var(--accent-brass)] bg-[var(--bg-primary)] p-1 flex items-center justify-center relative shadow-[var(--shadow-layered)] select-none pointer-events-none`}
        style={{
          boxShadow: '0 0 0 1px var(--bg-primary), 0 0 20px var(--accent-brass-glow)'
        }}
      >
        {/* Outer Serrated Ring */}
        <div className="w-full h-full rounded-full border border-dashed border-[var(--accent-brass)] flex flex-col items-center justify-center text-center p-1 bg-gradient-to-b from-[var(--bg-secondary)] to-[var(--bg-primary)]">
          {/* Inner Seal Content */}
          <div className="w-full h-full rounded-full border border-[var(--accent-brass-dim)] flex flex-col items-center justify-center p-1">
            <span className="font-mono uppercase font-semibold text-[var(--accent-brass)] tracking-widest leading-none block">
              PRIVORA
            </span>
            <div className="w-8 h-[1px] bg-[var(--accent-brass)] my-1" />
            <span className="font-serif font-bold text-[var(--accent-brass-bright)] tracking-wider block uppercase">
              {label}
            </span>
            {subtitle && (
              <span className="font-mono text-[7px] text-[var(--text-tertiary)] uppercase tracking-tighter block mt-0.5">
                {subtitle}
              </span>
            )}
          </div>
        </div>

        {/* Settling Ripple Impact */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0.8 }}
          animate={{ scale: 1.3, opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="absolute inset-0 rounded-full border-2 border-[var(--accent-brass)] pointer-events-none"
        />
      </motion.div>
    </div>
  );
}
