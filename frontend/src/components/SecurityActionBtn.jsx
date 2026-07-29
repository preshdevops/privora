import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import SealStamp from './SealStamp';

/**
 * SecurityActionBtn provides a deliberate 600-900ms confirmation animation
 * before performing critical security actions.
 * Upon success, it displays Privora's signature "Ledger Seal" emblem.
 */
export default function SecurityActionBtn({
  children,
  onClick,
  actionLabel = "Securing…",
  successLabel = "SEALED",
  delayMs = 750,
  className = "",
  variant = "primary", // "primary" | "danger" | "outline"
  disabled = false,
  type = "button",
  showSealOnSuccess = false,
  ...props
}) {
  const [status, setStatus] = useState('idle'); // 'idle' | 'working' | 'success'

  const handleClick = async (e) => {
    if (disabled || status !== 'idle') return;

    setStatus('working');
    
    // Deliberate trust delay
    await new Promise((resolve) => setTimeout(resolve, delayMs));

    try {
      if (onClick) {
        await onClick(e);
      }
      setStatus('success');
      setTimeout(() => setStatus('idle'), showSealOnSuccess ? 1800 : 1300);
    } catch (err) {
      setStatus('idle');
      throw err;
    }
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'danger':
        return 'bg-[var(--status-danger)] text-white border border-transparent hover:opacity-90';
      case 'outline':
        return 'bg-transparent text-[var(--text-primary)] border border-[var(--border-primary)] hover:border-[var(--accent-brass)] hover:text-[var(--accent-brass)]';
      case 'primary':
      default:
        return 'bg-[var(--accent-brass)] text-[#12141C] font-semibold border border-transparent hover:bg-[var(--accent-brass-bright)] shadow-[var(--shadow-layered)]';
    }
  };

  return (
    <button
      type={type}
      disabled={disabled || status !== 'idle'}
      onClick={handleClick}
      className={`relative inline-flex items-center justify-center px-5 py-3 rounded-sm text-xs font-mono transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${getVariantStyles()} ${className}`}
      {...props}
    >
      <AnimatePresence mode="wait">
        {status === 'working' && (
          <motion.span
            key="working"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.15 }}
            className="flex items-center gap-2"
          >
            <Loader2 className="w-4 h-4 animate-spin text-current" />
            <span>{actionLabel}</span>
          </motion.span>
        )}

        {status === 'success' && (
          <motion.span
            key="success"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="flex items-center gap-1.5 font-bold tracking-wider uppercase"
          >
            {showSealOnSuccess ? (
              <SealStamp label={successLabel} size="sm" />
            ) : (
              <span>✓ {successLabel}</span>
            )}
          </motion.span>
        )}

        {status === 'idle' && (
          <motion.span
            key="idle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-2"
          >
            {children}
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
}
