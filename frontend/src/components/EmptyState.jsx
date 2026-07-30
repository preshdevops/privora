import React from 'react';
import { motion } from 'framer-motion';
import PrivoraSeal from './PrivoraSeal';

/**
 * EmptyState — uses the PrivoraSeal outline variant as the quiet visual anchor
 * instead of per-type custom illustrations.
 */
export default function EmptyState({
  title = "Nothing here yet",
  description = "Upload a file to start protecting it.",
  action = null,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="py-16 text-center flex flex-col items-center justify-center"
    >
      <div className="mb-6">
        <PrivoraSeal variant="outline" size={72} opacity={0.25} />
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
