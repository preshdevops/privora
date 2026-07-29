import React from 'react';
import { motion } from 'framer-motion';

export default function EmptyState({
  title = "Nothing here yet",
  description = "Upload a file to start protecting it.",
  action = null,
  iconType = "vault" // "vault" | "logs" | "alert" | "search"
}) {
  const renderSvg = () => {
    switch (iconType) {
      case 'logs':
        return (
          <svg className="w-16 h-16 text-[var(--accent-brass)]" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="12" y="8" width="40" height="48" rx="2" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 3" />
            <line x1="20" y1="20" x2="44" y2="20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="20" y1="28" x2="36" y2="28" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="20" y1="36" x2="40" y2="36" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            <circle cx="42" cy="44" r="6" stroke="currentColor" strokeWidth="1.5" />
            <line x1="46" y1="48" x2="52" y2="54" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        );
      case 'alert':
        return (
          <svg className="w-16 h-16 text-[var(--accent-brass)]" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            <polygon points="32 8, 56 52, 8 52" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
            <line x1="32" y1="24" x2="32" y2="36" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <circle cx="32" cy="43" r="1.5" fill="currentColor" />
          </svg>
        );
      case 'vault':
      default:
        return (
          <svg className="w-16 h-16 text-[var(--accent-brass)]" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="12" y="18" width="40" height="34" rx="3" stroke="currentColor" strokeWidth="1.5" />
            <path d="M22 18V14C22 8.477 26.477 4 32 4C37.523 4 42 8.477 42 14V18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            <circle cx="32" cy="32" r="4" stroke="currentColor" strokeWidth="1.5" />
            <line x1="32" y1="36" x2="32" y2="42" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="layered-card p-10 rounded-sm text-center flex flex-col items-center justify-center border-dashed"
    >
      <div className="p-4 rounded-full bg-[var(--bg-input)] border border-[var(--border-primary)] mb-4">
        {renderSvg()}
      </div>

      <h3 className="text-lg font-serif text-[var(--text-primary)] mb-2">
        {title}
      </h3>

      <p className="text-sm text-[var(--text-secondary)] max-w-md leading-relaxed mb-6">
        {description}
      </p>

      {action && <div>{action}</div>}
    </motion.div>
  );
}
