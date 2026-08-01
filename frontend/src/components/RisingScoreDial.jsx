import React from 'react';
import { motion } from 'framer-motion';

/**
 * RisingScoreDial — Signature Animated Moment #4: The Rising Score
 * 
 * Data Protection Score inside a circular seal dial that fills like
 * liquid gold and calm secure green rising smoothly upward whenever it improves.
 */
export default function RisingScoreDial({
  score = 94,
  size = 180,
  label = 'DATA PROTECTION SCORE',
  className = '',
}) {
  const clampedScore = Math.max(0, Math.min(100, score));
  const isStrong = clampedScore >= 75;

  // Liquid height fill percentage (0 to 100)
  const fillHeight = clampedScore;

  return (
    <div
      className={`relative inline-flex flex-col items-center justify-center ${className}`}
      style={{ width: size }}
    >
      <div className="relative w-full aspect-square flex items-center justify-center overflow-hidden rounded-full border-2 border-[var(--accent-brass)] bg-[#14140F] shadow-[0_0_30px_rgba(201,162,39,0.15)]">
        
        {/* Precision Outer Dial Ticks */}
        <svg
          width={size}
          height={size}
          viewBox="0 0 100 100"
          className="absolute inset-0 w-full h-full z-10 pointer-events-none"
        >
          <circle cx="50" cy="50" r="48" stroke="#C9A227" strokeWidth="1" strokeDasharray="1 3" />
          <circle cx="50" cy="50" r="42" stroke="#C9A227" strokeWidth="0.8" strokeDasharray="3 2" strokeOpacity="0.5" />
          
          {/* Keyhole notch monogram overlay */}
          <g transform="translate(0, 0)">
            <line x1="47" y1="36" x2="47" y2="58" stroke="#F2EFE6" strokeWidth="1.5" strokeLinecap="round" opacity="0.9" />
            <path d="M47 36 C47 36, 56 36, 56 43 C56 50, 47 50, 47 50" stroke="#F2EFE6" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.9" />
            <circle cx="51.5" cy="43" r="1.8" fill="#C9A227" />
          </g>
        </svg>

        {/* Rising Liquid Gold & Calm Secure Green Container */}
        <div className="absolute inset-0 w-full h-full overflow-hidden rounded-full flex items-end">
          <motion.div
            initial={{ height: '0%' }}
            animate={{ height: `${fillHeight}%` }}
            transition={{
              type: 'spring',
              stiffness: 70,
              damping: 15,
              mass: 1,
            }}
            className="w-full relative transition-colors duration-700"
            style={{
              backgroundColor: isStrong ? '#2F5D46' : '#C9A227',
              opacity: isStrong ? 0.85 : 0.75,
            }}
          >
            {/* Animated Wave Top Surface */}
            <motion.div
              animate={{ x: ['0%', '-50%'] }}
              transition={{ repeat: Infinity, duration: 4, ease: 'linear' }}
              className="absolute -top-3 left-0 right-0 w-[200%] h-4 opacity-80"
              style={{
                backgroundImage: `radial-gradient(circle at 50% 50%, ${isStrong ? '#3D7A5C' : '#E5BB3A'} 40%, transparent 60%)`,
                backgroundSize: '20px 20px',
              }}
            />
          </motion.div>
        </div>

        {/* Center Score Number Readout (IBM Plex Mono) */}
        <div className="relative z-20 flex flex-col items-center justify-center text-center p-2">
          <motion.span
            key={clampedScore}
            initial={{ scale: 0.85, opacity: 0.5 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 15 }}
            className="font-mono-ledger text-3xl sm:text-4xl font-bold tracking-tight text-[#F2EFE6] drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]"
          >
            {clampedScore}
          </motion.span>
          <span className="font-mono-ledger text-[10px] text-[var(--accent-brass)] tracking-widest mt-0.5 drop-shadow">
            /100
          </span>
        </div>
      </div>

      {/* Label */}
      {label && (
        <div className="mt-2.5 text-center space-y-0.5">
          <span className="font-mono-ledger text-[11px] text-[var(--text-secondary)] tracking-wider uppercase block">
            {label}
          </span>
          <span className="font-mono-ledger text-[10px] text-[var(--accent-brass)] tracking-tight font-semibold">
            {isStrong ? 'RISING PROTECTION ACTIVE' : 'CALCULATING GAUGE…'}
          </span>
        </div>
      )}
    </div>
  );
}
