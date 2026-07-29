import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Scale } from 'lucide-react';

export default function ComplianceBadge({ score = 85, unresolvedAlertsCount = 0 }) {
  const isHealthy = score >= 70 && unresolvedAlertsCount === 0;

  const principles = [
    { name: "Nigerian Privacy Law", status: "Compliant", detail: "Data minimisation & lawful processing" },
    { name: "International Standards", status: "Protected", detail: "Threat detection & full access logging" },
    { name: "File Protection", status: "Active", detail: "Not even we can read your files" }
  ];

  // SVG Gauge calculations
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <motion.div 
      whileHover={{ y: -3 }}
      className="layered-card p-6 rounded-sm flex flex-col justify-between group transition-all"
    >
      <div>
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-[var(--border-primary)]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded bg-[var(--bg-input)] text-[var(--accent-brass)] group-hover:bg-[var(--accent-brass)] group-hover:text-[#12141C] transition-colors">
              <Scale className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-serif text-[var(--text-primary)]">
              Compliance Status
            </h3>
          </div>
          <span className={`px-2.5 py-0.5 text-xs font-mono rounded border ${
            isHealthy
              ? 'bg-[var(--badge-success-bg)] text-[var(--badge-success-text)] border-[var(--status-success)]/30'
              : 'bg-[var(--badge-warning-bg)] text-[var(--badge-warning-text)] border-[var(--status-warning)]/30'
          }`}>
            {isHealthy ? 'HEALTHY' : 'NEEDS ATTENTION'}
          </span>
        </div>

        {/* Circular Protection Score Gauge */}
        <div className="my-4 flex items-center justify-between p-3.5 rounded bg-[var(--bg-input)] border border-[var(--border-primary)]">
          <div>
            <span className="text-xs text-[var(--text-secondary)] font-mono block">Data Protection Index</span>
            <span className="text-xs text-[var(--text-tertiary)] block mt-0.5">Calculated in real-time</span>
          </div>

          <div className="relative w-20 h-20 flex items-center justify-center">
            <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 90 90">
              <circle
                cx="45"
                cy="45"
                r={radius}
                stroke="var(--border-primary)"
                strokeWidth="7"
                fill="transparent"
              />
              <motion.circle
                cx="45"
                cy="45"
                r={radius}
                stroke="var(--accent-brass)"
                strokeWidth="7"
                strokeDasharray={circumference}
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset }}
                transition={{ duration: 1.4, ease: [0.25, 1, 0.5, 1] }}
                strokeLinecap="round"
                fill="transparent"
              />
            </svg>
            <span className="absolute font-serif text-lg font-bold text-[var(--accent-brass)]">
              {score}
            </span>
          </div>
        </div>

        {/* Principles Checklist */}
        <div className="space-y-3">
          {principles.map((item, i) => (
            <div key={i} className="flex items-start justify-between text-xs">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[var(--accent-brass)] shrink-0 mt-0.5" />
                <div>
                  <span className="font-medium text-[var(--text-primary)]">{item.name}</span>
                  <p className="text-[11px] text-[var(--text-tertiary)]">{item.detail}</p>
                </div>
              </div>
              <span className="font-mono text-[11px] text-[var(--accent-brass-bright)]">
                {item.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
