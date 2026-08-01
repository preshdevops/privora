import React from 'react';

/**
 * ProtectionDial — The signature visual emblem of Privora.
 * 
 * Functions both as the circular Data Protection Score gauge (hero & dashboard)
 * and as the consistent "secured" badge next to files and folders.
 * 
 * Palette:
 * - Perimeter & ticks: Brass (#C9A227)
 * - Dial Gauge fill when strong (>=75): Deep Vault Green (#2F5D46)
 * - Score text: Monospace (IBM Plex Mono)
 * - Zero status dots used anywhere!
 */
export default function ProtectionDial({
  score = 94,
  size = 180,
  variant = 'hero', // 'hero' | 'card' | 'badge' | 'inline'
  label = 'DATA PROTECTION SCORE',
  className = '',
  style = {},
}) {
  // Clamp score between 0 and 100
  const clampedScore = Math.max(0, Math.min(100, score));

  // Small file/folder badge mode
  if (variant === 'badge' || variant === 'inline') {
    const badgeSize = size || (variant === 'inline' ? 18 : 24);
    return (
      <span
        className={`inline-flex items-center gap-1.5 align-middle ${className}`}
        title={`Protected — Score: ${clampedScore}/100`}
        style={style}
      >
        <svg
          width={badgeSize}
          height={badgeSize}
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="shrink-0"
          aria-hidden="true"
        >
          {/* Deep Vault Green filled interior for protected status */}
          <circle cx="16" cy="16" r="14" fill="#2F5D46" fillOpacity="0.45" />
          {/* Solid brass outer ring */}
          <circle cx="16" cy="16" r="14" stroke="#C9A227" strokeWidth="1.5" />
          {/* Inner tick/dashed ring */}
          <circle cx="16" cy="16" r="11" stroke="#C9A227" strokeWidth="1" strokeDasharray="2 2" strokeOpacity="0.6" />
          {/* Keyhole notch P-ascender */}
          <line x1="13.5" y1="10" x2="13.5" y2="22" stroke="#F2EFE6" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M13.5 10 C13.5 10, 19.5 10, 19.5 14.5 C19.5 19, 13.5 19, 13.5 19" stroke="#F2EFE6" strokeWidth="1.5" strokeLinecap="round" fill="none" />
          <circle cx="16.5" cy="14.5" r="1.2" fill="#C9A227" />
        </svg>
        {variant === 'inline' && (
          <span className="font-mono-ledger text-xs text-[var(--accent-brass)]">
            {clampedScore}/100
          </span>
        )}
      </span>
    );
  }

  // Gauge calculations for Card & Hero variants
  const radius = 42;
  const strokeWidth = 4;
  const center = 50;
  const circumference = 2 * Math.PI * radius;
  // 270 degree arc gauge (starts at 135deg, ends at 405deg)
  const arcLength = circumference * 0.75;
  const strokeDashoffset = arcLength - (arcLength * clampedScore) / 100;

  // Determine fill hue based on score strength
  const isHigh = clampedScore >= 75;
  const isMed = clampedScore >= 50 && clampedScore < 75;
  const arcColor = isHigh ? '#2F5D46' : isMed ? '#C9A227' : '#C84B31';
  const glowColor = isHigh ? 'rgba(47, 93, 70, 0.35)' : 'rgba(201, 162, 39, 0.25)';

  return (
    <div
      className={`relative inline-flex flex-col items-center justify-center ${className}`}
      style={{ width: size, ...style }}
    >
      <div className="relative w-full aspect-square flex items-center justify-center">
        <svg
          width={size}
          height={size}
          viewBox="0 0 100 100"
          className="w-full h-full transform -rotate-225"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <radialGradient id={`dial-glow-${clampedScore}`} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={glowColor} />
              <stop offset="100%" stopColor="transparent" />
            </radialGradient>
          </defs>

          {/* Deep Vault Green inner ambient fill when protected */}
          {isHigh && (
            <circle
              cx={center}
              cy={center}
              r={radius - 8}
              fill={`url(#dial-glow-${clampedScore})`}
            />
          )}

          {/* Precision outer dial track ticks */}
          <circle
            cx={center}
            cy={center}
            r={radius + 4}
            stroke="#282820"
            strokeWidth="1"
            strokeDasharray="1 3"
          />

          {/* Background gauge arc */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            stroke="#24241D"
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={`${arcLength} ${circumference}`}
            strokeLinecap="round"
          />

          {/* Active filled Data Protection Score dial gauge arc */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            stroke={arcColor}
            strokeWidth={strokeWidth + 1}
            fill="none"
            strokeDasharray={`${arcLength} ${circumference}`}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-700 ease-out"
          />

          {/* Inner dash seal motif ring */}
          <circle
            cx={center}
            cy={center}
            r={radius - 12}
            stroke="#C9A227"
            strokeWidth="0.8"
            strokeDasharray="3 2"
            strokeOpacity="0.5"
            fill="none"
          />

          {/* Central P-Keyhole Seal Monogram */}
          <g transform={`rotate(225 ${center} ${center})`}>
            <line x1="47" y1="36" x2="47" y2="58" stroke="#C9A227" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M47 36 C47 36, 56 36, 56 43 C56 50, 47 50, 47 50" stroke="#C9A227" strokeWidth="1.5" strokeLinecap="round" fill="none" />
            <circle cx="51.5" cy="43" r="1.8" fill="#C9A227" />
          </g>
        </svg>

        {/* Center Monospace Score readout */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-2">
          <span className="font-mono-ledger text-3xl sm:text-4xl font-bold tracking-tight text-[#F2EFE6] leading-none">
            {clampedScore}
          </span>
          <span className="font-mono-ledger text-[10px] text-[var(--accent-brass)] tracking-widest mt-1">
            /100
          </span>
        </div>
      </div>

      {/* Label under dial */}
      {label && (
        <div className="mt-2 text-center">
          <span className="font-mono-ledger text-[11px] text-[var(--text-secondary)] tracking-wider uppercase block">
            {label}
          </span>
          <span className="font-mono-ledger text-[10px] text-[var(--accent-brass)] tracking-tight">
            {isHigh ? 'VAULT SECURED' : 'ACTION RECOMMENDED'}
          </span>
        </div>
      )}
    </div>
  );
}
