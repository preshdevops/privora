import React from 'react';

/**
 * PrivoraSeal — The canonical Privora mark.
 *
 * Construction: solid outer ring + dashed inner ring + interior "P" ascender
 * that doubles as a keyhole/latch notch. Two colors only: ink and brass.
 *
 * Variants:
 *   "full"    — outer ring, dashed inner ring, interior glyph. For hero use, auth panels.
 *   "glyph"   — simplified: single ring + interior stroke. For favicon, sidebar, small UI.
 *   "outline" — low-opacity outline ring only. For empty states, watermarks.
 *
 * All geometry is hand-plotted on a 64×64 grid with 1.5px stroke weight.
 */
export default function PrivoraSeal({
  variant = 'full',
  size = 64,
  className = '',
  brassColor = 'var(--accent-brass)',
  inkColor = 'var(--text-primary)',
  opacity = 1,
  style = {},
}) {
  const commonProps = {
    width: size,
    height: size,
    viewBox: '0 0 64 64',
    fill: 'none',
    xmlns: 'http://www.w3.org/2000/svg',
    className,
    style: { opacity, ...style },
    'aria-hidden': true,
  };

  if (variant === 'outline') {
    return (
      <svg {...commonProps}>
        <circle cx="32" cy="32" r="28" stroke={brassColor} strokeWidth="1.5" strokeDasharray="4 3" />
      </svg>
    );
  }

  if (variant === 'glyph') {
    return (
      <svg {...commonProps}>
        {/* Single outer ring */}
        <circle cx="32" cy="32" r="28" stroke={brassColor} strokeWidth="1.5" />
        {/* Interior P-ascender / keyhole notch */}
        <line x1="28" y1="22" x2="28" y2="46" stroke={brassColor} strokeWidth="1.5" strokeLinecap="round" />
        <path d="M28 22 C28 22, 40 22, 40 30 C40 38, 28 38, 28 38" stroke={brassColor} strokeWidth="1.5" strokeLinecap="round" fill="none" />
        {/* Keyhole dot at the bowl's center */}
        <circle cx="34" cy="30" r="2" fill={brassColor} />
      </svg>
    );
  }

  // variant === 'full'
  return (
    <svg {...commonProps}>
      {/* Outer solid ring */}
      <circle cx="32" cy="32" r="29" stroke={brassColor} strokeWidth="1.5" />
      {/* Inner dashed ring — the wax-seal impression edge */}
      <circle cx="32" cy="32" r="23" stroke={brassColor} strokeWidth="1" strokeDasharray="3 2.5" />
      {/* P-ascender / keyhole glyph */}
      <line x1="27" y1="22" x2="27" y2="46" stroke={brassColor} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M27 22 C27 22, 40 22, 40 30.5 C40 39, 27 39, 27 39" stroke={brassColor} strokeWidth="1.5" strokeLinecap="round" fill="none" />
      {/* Keyhole notch */}
      <circle cx="33.5" cy="30.5" r="2.5" fill={brassColor} />
      {/* Horizontal rule — the ledger line */}
      <line x1="22" y1="50" x2="42" y2="50" stroke={brassColor} strokeWidth="1" strokeLinecap="round" />
    </svg>
  );
}
