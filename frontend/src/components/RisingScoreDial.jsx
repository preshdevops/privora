import React from 'react';
import { motion } from 'framer-motion';

/**
 * RisingScoreDial — Minimalist Circular Protection Gauge
 */
export default function RisingScoreDial({
  score = 94,
  size = 150,
  label = 'PROTECTION SCORE',
  className = '',
}) {
  const validScore = typeof score === 'number' && !isNaN(score) ? score : 94;
  const clampedScore = Math.max(0, Math.min(100, validScore));
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (clampedScore / 100) * circumference;

  return (
    <div
      className={`relative inline-flex flex-col items-center justify-center ${className}`}
      style={{ width: size }}
    >
      <div className="relative w-full aspect-square flex items-center justify-center rounded-full bg-[var(--bg-secondary)] border border-[var(--border-primary)] p-3">
        {/* SVG Progress Ring */}
        <svg
          width={size}
          height={size}
          viewBox="0 0 100 100"
          className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none"
        >
          {/* Background Track */}
          <circle
            cx="50"
            cy="50"
            r={radius}
            stroke="var(--border-secondary)"
            strokeWidth="3.5"
            fill="none"
          />
          {/* Active Ring Stroke */}
          <motion.circle
            cx="50"
            cy="50"
            r={radius}
            stroke="var(--accent-gold)"
            strokeWidth="3.5"
            fill="none"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1, ease: 'easeOut' }}
            strokeLinecap="round"
          />
        </svg>

        {/* Center Score Readout */}
        <div className="relative z-10 flex flex-col items-center justify-center text-center p-2">
          <span className="font-mono text-3xl sm:text-4xl font-bold tracking-tight text-[var(--text-primary)]">
            {clampedScore}
          </span>
          <span className="font-mono text-[10px] text-[var(--accent-gold)] tracking-wider uppercase block mt-0.5">
            / 100
          </span>
        </div>
      </div>

      {/* Label */}
      {label && (
        <div className="mt-2.5 text-center">
          <span className="font-mono text-[10px] text-[var(--text-secondary)] tracking-widest uppercase block font-medium">
            {label}
          </span>
        </div>
      )}
    </div>
  );
}
