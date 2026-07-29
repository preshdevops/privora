import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SealStamp from './SealStamp';

/**
 * SecurityActionBtn
 * Provides a calm confirmation state for security-critical operations.
 * Routine actions remain instant; security operations get a deliberate beat.
 */
export default function SecurityActionBtn({
  children,
  onClick,
  actionLabel = "Processing…",
  successLabel = "Confirmed",
  delayMs = 600,
  className = "",
  variant = "primary", // "primary" | "outline" | "danger"
  disabled = false,
  type = "button",
  showSealOnSuccess = false,
  ...props
}) {
  const [status, setStatus] = useState('idle'); // 'idle' | 'working' | 'success'

  const handleClick = async (e) => {
    if (disabled || status !== 'idle') return;

    if (delayMs > 0) {
      setStatus('working');
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }

    try {
      if (onClick) {
        await onClick(e);
      }
      setStatus('success');
      setTimeout(() => setStatus('idle'), showSealOnSuccess ? 1800 : 1200);
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
        return 'bg-transparent text-[var(--text-primary)] border border-[var(--border-primary)] hover:border-[var(--text-primary)]';
      case 'primary':
      default:
        return 'bg-[var(--accent-brass)] text-[#14171F] font-semibold border border-transparent hover:bg-[var(--accent-brass-bright)]';
    }
  };

  return (
    <button
      type={type}
      disabled={disabled || status !== 'idle'}
      onClick={handleClick}
      className={`relative inline-flex items-center justify-center px-5 py-2.5 rounded-sm text-sm transition-colors duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${getVariantStyles()} ${className}`}
      {...props}
    >
      <AnimatePresence mode="wait">
        {status === 'working' && (
          <motion.span
            key="working"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-2"
          >
            <span className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
            <span>{actionLabel}</span>
          </motion.span>
        )}

        {status === 'success' && (
          <motion.span
            key="success"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-2 font-medium"
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
